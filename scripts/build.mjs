import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = async path => (await readFile(new URL(path, root), 'utf8')).replace(/\r\n/g, '\n');
const json = async path => JSON.parse(await read(path));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]);
const generated = '<!-- Arquivo gerado. Edite as fontes e execute npm run build. -->';

function insert(template, marker, content) {
    if (template.split(marker).length !== 2) throw new Error('Marcador ausente ou duplicado: ' + marker);
    return template.replace(marker, () => content);
}

function rowFor(reaction, engine, pairIds, agentById, notes, science, describeCard, processLabel, reviewLabel) {
    const { evidence, process, reviewStatus, reference, sources, conditions, equationIssue } = science;
    const byId = id => engine.byCard.get(id) ?? agentById.get(id);
    const piece = id => {
        const card = byId(id);
        if (!card) throw new Error(reaction.id + ': ID de material desconhecido ' + id);
        return describeCard(card);
    };
    const origin = reaction.id.startsWith('prepare-') || reaction.id.startsWith('complete-') ? 'staging'
        : reaction.generatedBy === 'family' ? 'family' : reaction.id.startsWith('i-') ? 'intuitive' : 'explicit';
    const outputs = reaction.outputs.map(piece);
    const note = notes.routes[reaction.id];
    const active = !reaction.retired;
    const source = sources.find(item => item.url)?.url ?? null;
    const sourceSpecificity = sources.some(item => item.claim) ? 'escopo_documentado'
        : !sources.length ? 'sem_fonte'
        : note?.genericSource || notes.genericSources.includes(source) ? 'referência_genérica' : 'a_verificar';
    const row = {
        id: reaction.id, origin, kind: reaction.kind, active, executable: pairIds.has(reaction.id), old: !active,
        inputs: reaction.inputs.map(piece), outputs, agent: reaction.agent ? piece(reaction.agent) : null,
        environmentalInputs: (reaction.environmentalInputs ?? []).map(piece),
        family: (outputs.find(item => item.kind === 'mineral') ?? outputs[0])?.family ?? 'Componentes',
        process, processLabel, reviewStatus, reviewLabel,
        summary: reaction.summary, conditions, equation: reference?.equation ?? reaction.equation ?? null,
        reference, evidence, sources, source, sourceSpecificity,
        priority: active ? note?.priority ?? null : null,
        issue: active ? [equationIssue, note?.issue].filter(Boolean).join(' ') || null : null,
        archivalNote: !active ? reaction.archiveReason ?? note?.issue ?? 'Rota retirada da bancada; conservada para leitura de partidas antigas.' : null,
    };
    return { ...row, fingerprint: hash(row) };
}

function buildAtlas(template, layout, minerals, iconMarkup) {
    const byId = new Map(minerals.map(card => [card.id, card]));
    const stageLabels = { initial: 'Originais', previous: 'Curados · v0.15', refined: 'Refinados · v0.16' };
    const stageCounts = { initial: 0, previous: 0, refined: 0 };
    const groups = Object.entries(layout.families).map(([label, ids]) => {
        const cards = ids.map(id => {
            const card = byId.get(id);
            const stage = layout.stage[id];
            const icon = card && iconMarkup(card);
            if (!icon || !Object.hasOwn(stageLabels, stage)) throw new Error('Ilustração ou etapa inválida: ' + id);
            byId.delete(id);
            stageCounts[stage]++;
            return '<article class="mineral" data-name="' + esc(card.name + ' ' + id) + '" data-stage="' + stage +
                '" title="' + esc(card.name + ' • ' + card.formula) + '"><div class="orb">' + icon + '</div><strong>' +
                esc(card.name) + '</strong><span class="formula">' + esc(card.formula) + '</span><span class="stage">' +
                stageLabels[stage] + '</span></article>';
        });
        return '<section class="group" data-family="' + esc(label) + '"><div class="group-heading"><h2>' + esc(label) +
            '</h2><span class="count">' + ids.length + (ids.length === 1 ? ' carta' : ' cartas') +
            '</span></div><div class="icon-grid">\n' + cards.join('\n') + '\n</div></section>';
    });
    if (byId.size) throw new Error('Cartas sem ilustração no atlas: ' + [...byId.keys()].join(', '));
    return insert(template, '<!-- ATLAS_GROUPS -->', groups.join('\n'))
        .replaceAll('{{ATLAS_TOTAL}}', minerals.length)
        .replace('{{ATLAS_INITIAL}}', stageCounts.initial)
        .replace('{{ATLAS_PREVIOUS}}', stageCounts.previous)
        .replace('{{ATLAS_REFINED}}', stageCounts.refined);
}

const [catalog, notes, layout, literature, speciation, transformations, game, css, atlas, modules, gameUi, audit, auditUi, brand] = await Promise.all([
    json('data/catalog.json'), json('data/review-notes.json'), json('data/atlas-layout.json'),
    json('data/literature.json'),
    json('data/speciation.json'), json('data/transformations.json'),
    read('src/game.template.html'), read('src/game.css'), read('src/atlas.template.html'),
    Promise.all(['catalog-overrides', 'game-engine', 'progress', 'catalog-science', 'mineral-icons', 'reaction-reference', 'game-storage', 'trail-planner']
        .map(name => read('src/' + name + '.js'))),
    read('src/game.js'), read('src/audit.template.html'), read('src/audit.js'), read('src/brand.svg'),
]);
const brandIcon = 'data:image/svg+xml,' + encodeURIComponent(brand.trim());
const sharedScript = 'const EMBEDDED = ' + safeJson(catalog) + ';\n' +
    'const LITERATURE = ' + safeJson(literature) + ';\n' +
    'const SPECIATION = ' + safeJson(speciation) + ';\n' +
    'const TRANSFORMATIONS = ' + safeJson(transformations) + ';\n\n' + modules.join('\n');
const context = vm.createContext({});
vm.runInContext(sharedScript, context);
const { engine, pairs, reachable, minerals } = vm.runInContext(`(() => {
    const { cards, agents, reactions, rules } = EMBEDDED;
    const engine = createEngine(cards, agents, reactions, rules);
    const pairs = buildPairCatalog(engine);
    const reachable = reachablePairIds(engine, pairs, AVAILABLE_AGENTS);
    return { engine, pairs, reachable, minerals: engine.cards.filter(card => card.kind === 'mineral') };
})()`, context);
if (engine.diagnostics.length) throw new Error(engine.diagnostics.join('\n'));
if (minerals.some(card => !reachable.has(card.id))) {
    throw new Error('Cartas inalcançáveis: ' + minerals.filter(card => !reachable.has(card.id)).map(card => card.id).join(', '));
}
for (const id of Object.keys(speciation.cards)) {
    if (!engine.byCard.has(id)) throw new Error('Revisão de estados químicos sem carta: ' + id);
}
for (const [oldId, id] of Object.entries(speciation.aliases)) {
    if (oldId === id || !engine.byCard.has(id)) throw new Error('Equivalência legada inválida: ' + oldId);
}
const speciationRoutes = new Set(Object.keys(speciation.routes));
for (const id of Object.keys(transformations.updates)) {
    if (speciationRoutes.has(id)) throw new Error('Rota editada por duas revisões: ' + id);
}
for (const id of [...speciationRoutes, ...Object.keys(transformations.updates)]) {
    if (!engine.byReaction.has(id)) throw new Error('Revisão editorial sem rota: ' + id);
}
for (const id of Object.keys(notes.routes)) {
    if (!engine.byReaction.has(id)) throw new Error('Parecer editorial sem rota: ' + id);
}
for (const [id, sources] of Object.entries(literature.routes)) {
    if (!engine.byReaction.has(id)) throw new Error('Referência bibliográfica sem rota: ' + id);
    for (const { work, locator, claim } of sources) {
        if (!Object.hasOwn(literature.works, work) || !locator?.trim() || !claim?.trim()) {
            throw new Error('Referência bibliográfica incompleta para a rota ' + id);
        }
    }
}
const pairIds = new Set(pairs.pairs.map(({ reaction }) => reaction.id));
const agentById = new Map(catalog.agents.map(agent => [agent.id, { ...agent, kind: 'agent', family: 'Processo geológico' }]));
const { routeScience, materialType, mineralIconMarkup, PROCESS_LABELS, REVIEW_LABELS } = vm.runInContext(
    '({ routeScience, materialType, mineralIconMarkup, PROCESS_LABELS, REVIEW_LABELS })', context,
);
const describeCard = card => ({
    id: card.id, name: card.name, formula: card.formula ?? '', kind: card.kind, family: card.family, materialType: materialType(card),
});
const entries = [...engine.byReaction.values()].map(reaction => {
    const science = routeScience(reaction, engine.byCard);
    return rowFor(reaction, engine, pairIds, agentById, notes, science, describeCard, PROCESS_LABELS[science.process], REVIEW_LABELS[science.reviewStatus]);
});
const transformationIds = new Set([
    ...transformations.additions.map(route => route.id),
    ...Object.entries(transformations.updates).filter(([, patch]) => patch.retired === false).map(([id]) => id),
]);
for (const entry of entries.filter(row => transformationIds.has(row.id))) {
    if (!entry.executable || entry.reference?.balance !== 'balanced' || !entry.sources.some(source => source.claim)) {
        throw new Error('Transformação revisada sem par executável, balanço ou evidência: ' + entry.id);
    }
}
const revision = hash(entries.map(row => row.fingerprint));
const payload = { version: 2, repository: 'marquesbarros/mineralchemy', revision, pairs: pairIds.size, entries };
let auditHtml = insert(audit, '<!-- AUDIT_PAYLOAD -->', '<script type="application/json" id="payload">' + safeJson(payload) + '</script>');
auditHtml = insert(auditHtml, '<!-- AUDIT_SCRIPT -->', '<script>\n' + auditUi + '</script>');
const gameHtml = insert(insert(game, '<!-- GAME_STYLE -->', '<style>\n' + css + '</style>'),
    '<!-- GAME_SCRIPT -->', '<script>' + sharedScript + '\nconst BRAND_ICON = ' + safeJson(brandIcon) + ';\n' + gameUi + '</script>');
const outputs = {
    'index.html': gameHtml,
    'catalogo-auditoria.html': auditHtml,
    'iconografia.html': buildAtlas(atlas, layout, minerals, mineralIconMarkup),
};
const drift = [];
for (const [path, html] of Object.entries(outputs)) {
    const withIcon = insert(html, '<meta charset="UTF-8">',
        '<meta charset="UTF-8">\n<link rel="icon" type="image/svg+xml" href="' + brandIcon + '">');
    const result = withIcon.trimEnd().replace(/^(<!doctype html>)/i, '$1\n' + generated + '\n') + '\n';
    if (process.argv.includes('--check')) {
        if (await read(path) !== result) drift.push(path);
    } else {
        await writeFile(new URL(path, root), result);
    }
}
if (drift.length) throw new Error('Páginas desatualizadas: ' + drift.join(', ') + '. Execute npm run build.');
console.log(minerals.length + ' cartas, ' + entries.filter(row => row.active).length + ' rotas ativas, ' +
    pairIds.size + ' pares, ' + entries.length + ' registros.');
