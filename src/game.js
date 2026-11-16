const app = document.querySelector('#app');
if (!app)
    throw new Error('Elemento raiz não encontrado.');
const PIECE_RADIUS = 40;
let engine, pairs, save;
let pieces = [];
let nextInstance = 1;
let search = '';
let filter = 'all';
let recentlyUsed = [];
let collectionSearch = '';
let historySearch = '';
let historyFilter = 'all';
let historyGroup = 'section';
let collectionTopic = 'all';
let modal = null;
let detailId = null;
let dialogReturnFocus = null;
let pendingProgressFile = null;
let pendingImport = null;
let importNotice = '';
let storageWarning = '';
let active = null;
let toastTimer = null;
let shelfLabelTap = null;
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] ?? char));
const specialIcons = { hydrothermal: 'H₂O↑', rain: 'H₂O↓', air: 'fO₂↑', heat: 'T↑', reduction: 'fO₂↓', pressure: 'P↑', cooling: 'T↓', impact: 'P↑↑', volcanism: 'T↑↑', decompression: 'P↓', low_silica: 'aSiO₂↓' };
const specialAgents = AVAILABLE_AGENTS;
let playables = [];
let byPlayable = new Map();
const item = (id) => byPlayable.get(id);
const shortName = (p) => p.id === 'olivine' ? 'Olivina' : p.kind === 'ion' ? p.name.replace(/ \([^)]*\)$/, '') : p.name.replace(' (intermediária)', '');
const mineralGlyph = (p) => {
    const text = (p.family + ' ' + p.name + ' ' + p.formula).toLowerCase();
    if (/mica|biotita|muscovita|phlogopite|annite|paragonite|clorita|caulinita|argil|serpentina|talc|halloysite|clinocloro|chamosita/.test(text))
        return '≋';
    if (/anfib|pirox|inossilicat|tremolite|actinolite|riebeckite|glaucophane|grunerite|wollastonite/.test(text))
        return '▰';
    if (/granada|garnet|almandine|pyrope|grossular|spessartine|andradite|uvarovite/.test(text))
        return '⬢';
    if (/feldspato|feldspat|albite|anorthite|orthoclase|microcline|sanidine|nepheline|sodalite|analcime|leucite/.test(text))
        return '◼';
    if (/quartzo|silica|zirc|diamond|diamante|andalusite|kyanite|silimanite|topaz|beryl|tourmaline|turmalina/.test(text))
        return '◇';
    if (/carbonato|calcite|dolomite|magnesite|siderite|rhodochrosite|smithsonite|malachite|azurite/.test(text))
        return '◈';
    if (/sulfato|gipsita|anhydrite|barite|anglesite|chalcanthite/.test(text))
        return '✶';
    if (/sulfeto|pyrite|chalcopyrite|sphalerite|galena|troilite|covellite|bornite|chalcocite|molybdenite|marcasite/.test(text))
        return '◆';
    if (/óxido|oxido|hidróxido|hidroxido|hematite|goethite|magnetite|boehmite|gibbsite|corundum|rutile|anatase|brookite|tenorite|cuprite|manganite|spinel|hercynite|magnesioferrite/.test(text))
        return '⬡';
    if (/apatite|monazite|xenotime|phosphate|fosfato|fluorapatite|hydroxylapatite/.test(text))
        return '✣';
    if (/elementos nativos|native|ouro|gold|prata|silver|cobre|copper|enxofre|sulfur|grafita|graphite|ferro nativo/.test(text))
        return '●';
    return '⬢';
};
const icon = (p) => {
    if (p.kind === 'ion')
        return p.formula;
    if (p.kind === 'molecule')
        return p.formula;
    if (p.kind === 'aqueous')
        return p.formula;
    if (p.kind === 'reagent')
        return p.formula;
    if (p.kind === 'agent')
        return specialIcons[p.id] ?? 'P/T';
    if (p.kind === 'assemblage')
        return '◈';
    return mineralGlyph(p); // Ícone provisório para minerais fora da primeira biblioteca.
};
const agentVectorPaths = {"water":"<path d=\"M12 2C9 7 5 11 5 16a7 7 0 0 0 14 0c0-5-4-9-7-14Z\"/><path d=\"M8 16a4 4 0 0 0 4 4\"/>","rain":"<path d=\"M6 14a4 4 0 0 1-1-8 6 6 0 0 1 11-1 4 4 0 0 1 3 7\"/><path d=\"m8 15-1 3m5-4-1 3m6-3-1 3m-8 3-1 2m9-2-1 2\"/>","air":"<circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M9 12h6m-3-3v6M17 4h4m-2-2v4\"/>","reduction":"<circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M8 10h8m-7 5 2 2 4-4\"/>","hydrothermal":"<path d=\"M5 19c2-2 4 2 6 0s4-2 6 0 3-1 3-1M7 14c-3-3 3-4 0-7m5 7c-3-3 3-4 0-7m5 7c-3-3 3-4 0-7\"/>","heat":"<path d=\"M12 2c1 4-1 5-3 8a7 7 0 1 0 8-2c0 3-2 4-2 4s0-7-3-10Z\"/><path d=\"M12 13c-1 2-2 3-2 5a2 2 0 0 0 4 0c0-2-1-3-2-5Z\"/>","pressure":"<path d=\"M4 7h16M7 7l-2 8h14l-2-8M7 19h10M12 1v4m-3-3 3 3 3-3\"/>","cooling":"<path d=\"M12 2v20M2 12h20M5 5l14 14M19 5 5 19\"/>","impact":"<path d=\"m4 3 7 7m-1-7 4 5m-11 3 5 3\"/><path d=\"M17 12a5 5 0 1 1-5 5c0-3 2-5 5-5Z\"/>","volcanism":"<path d=\"M3 20h18l-6-12-3 3-3-3-6 12Z\"/><path d=\"m10 5 2-3 2 3m-2 3V6\"/>","decompression":"<path d=\"M4 17h16M7 17l-2-8h14l-2 8M7 5h10m5 16v-3m-3 2 3-3 3 3\"/>","low_silica":"<path d=\"M4 6h11m-9 5h7m-5 5h4m5-6v10m-3-3 3 3 3-3\"/>"};
const agentIconMarkup = id => agentVectorPaths[id] ? '<svg class="agent-svg" viewBox="0 0 24 24" aria-hidden="true">' + agentVectorPaths[id] + '</svg>' : null;
const iconMarkup = (p) => ((p.kind === 'agent' || p.id === 'water') && agentIconMarkup(p.id)) || (p.kind === 'mineral' ? (mineralIconMarkup({ id: p.id, name: p.name, family: p.family, formula: p.formula }) ?? esc(icon(p))) : esc(icon(p)));
const denseIcon = (p) => p.kind !== 'mineral' && icon(p).length > 5;
const chemicalIcon = (p) => p.kind === 'ion' || p.kind === 'molecule' || p.kind === 'reagent' || p.kind === 'aqueous' || p.kind === 'agent';
const palette = (p) => {
    if (p.kind === 'assemblage')
        return ['#e8eef4', '#475569', '#d4e0eb'];
    if (p.kind === 'agent' || p.id === 'water')
        return ['#d9ecff', '#236caa', '#c9dff7'];
    if (p.id === 'co2')
        return ['#e7e8f6', '#655b9e', '#d4d4f0'];
    if (p.kind === 'ion')
        return ['#eaf0fb', '#334f83', '#d5e0f4'];
    if (p.kind === 'reagent')
        return ['#eef0f2', '#38404a', '#dbe0e4'];
    if (p.kind === 'aqueous')
        return ['#ecf1fa', '#64829f', '#dfe8f7'];
    const f = (p.family + ' ' + p.name).toLowerCase();
    if (/sulfeto|pirita|calcopirita/.test(f))
        return ['#fff1cb', '#9c6814', '#f7dfa0'];
    if (/hidróxido|óxido|goeth|hematit|magnetit/.test(f))
        return ['#fbe8df', '#a65c40', '#f4d5c5'];
    if (/carbonato|sulfato|gipsita|anidrita|fosfato|tungstato/.test(f))
        return ['#f0ebfa', '#69549c', '#ded4f3'];
    if (/feldspat|zeolita|zeólita|sílica/.test(f))
        return ['#eaf0ff', '#436a9b', '#d9e5fa'];
    if (/anfibólio|inossilicato|metamórfico/.test(f))
        return ['#e7efed', '#316f73', '#d3e5df'];
    if (/granada|turmalina|aluminossilicato/.test(f))
        return ['#f7eaf0', '#995777', '#efd8e4'];
    if (/mica|clorita|argilomineral|serpentina|filossilicato/.test(f))
        return ['#e3f4e5', '#2e7b52', '#cfead6'];
    return ['#e3f3e7', '#277b55', '#cde8d4'];
};
const styleFor = (p) => { const [bg, fg, ring] = palette(p); return `--orb:${bg};--ink:${fg};--ring:${ring}`; };
const percent = () => { const count = engine.cards.filter(c => c.kind === 'mineral' && save.discovered.includes(c.id)).length; const total = engine.cards.filter(c => c.kind === 'mineral').length; return { count, total }; };
const discovered = () => new Set([...save.discovered, ...specialAgents]);
const knownItems = () => playables.filter(p => discovered().has(p.id) && !HIDDEN_ARCHIVED_IONS.has(p.id));
const normalizeText = (value) => String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR');
const mineralPlayables = () => engine.cards.filter((c) => c.kind === 'mineral').map(c => item(c.id)).filter((p) => !!p);
const collectionTopicDefs = [
    { id: 'all', label: 'Tudo' },
    { id: 'silicates', label: 'Silicatos' },
    { id: 'nonsilicates', label: 'Não silicatos' },
    { id: 'metamorphic', label: 'Metamórficos' },
    { id: 'alteration', label: 'Alteração' },
    { id: 'ore', label: 'Minérios' },
    { id: 'native', label: 'Nativos' },
    { id: 'accessory', label: 'Acessórios' },
];
const collectionSections = [
    { id: 'feldspars', label: 'Feldspatos', group: 'silicates', match: (p) => p.family === 'Feldspatos' || p.name === 'Ortoclásio' },
    { id: 'feldspathoids', label: 'Feldspatoides', group: 'silicates', match: (p) => p.family === 'Feldspatoides' },
    { id: 'silica', label: 'Sílica e polimorfos', group: 'silicates', match: (p) => p.family === 'Polimorfos de sílica' || p.name === 'Quartzo' },
    { id: 'tectos', label: 'Tectossilicatos', group: 'silicates', match: (p) => p.family === 'Silicatos (tectossilicatos)' && !['Quartzo', 'Ortoclásio'].includes(p.name) },
    { id: 'nesos', label: 'Nesossilicatos', group: 'silicates', match: (p) => p.family === 'Silicatos (nesossilicatos)' },
    { id: 'inos', label: 'Inossilicatos', group: 'silicates', match: (p) => p.family === 'Silicatos (inossilicatos)' },
    { id: 'amphiboles', label: 'Anfibólios', group: 'silicates', match: (p) => p.family === 'Anfibólios' || p.family === 'Silicatos (anfibólios)' },
    { id: 'garnets', label: 'Granadas', group: 'silicates', match: (p) => p.family === 'Granadas' },
    { id: 'micas', label: 'Micas', group: 'silicates', match: (p) => p.family === 'Micas' },
    { id: 'phyllos', label: 'Filossilicatos', group: 'silicates', match: (p) => p.family === 'Filossilicatos' || p.family === 'Silicatos (filossilicatos)' },
    { id: 'chlorites', label: 'Cloritas', group: 'silicates', match: (p) => p.family === 'Cloritas' },
    { id: 'serpentines', label: 'Serpentinas', group: 'silicates', match: (p) => p.family === 'Serpentinas' },
    { id: 'clays', label: 'Argilominerais', group: 'silicates', match: (p) => p.family === 'Argilominerais' },
    { id: 'tourmalines', label: 'Turmalinas', group: 'silicates', match: (p) => p.family === 'Turmalinas' },
    { id: 'epidotes', label: 'Epidotos', group: 'silicates', match: (p) => p.family === 'Epidotos' },
    { id: 'aluminosilicates', label: 'Aluminossilicatos', group: 'silicates', match: (p) => p.family === 'Aluminossilicatos' },
    { id: 'metamorphic', label: 'Metamórficos', group: 'silicates', match: (p) => p.family === 'Metamórficos' },
    { id: 'zeolites', label: 'Zeólitas', group: 'silicates', match: (p) => p.family === 'Zeólitas' },
    { id: 'accessories', label: 'Acessórios', group: 'silicates', match: (p) => p.family === 'Acessórios' },
    { id: 'native', label: 'Elementos nativos', group: 'nonsilicates', match: (p) => p.family === 'Elementos nativos' },
    { id: 'sulfides', label: 'Sulfetos', group: 'nonsilicates', match: (p) => p.family === 'Sulfetos' },
    { id: 'oxides', label: 'Óxidos', group: 'nonsilicates', match: (p) => p.family === 'Óxidos' },
    { id: 'mixedoxides', label: 'Óxidos e hidróxidos', group: 'nonsilicates', match: (p) => p.family === 'Óxidos e hidróxidos' },
    { id: 'spinels', label: 'Espinélios', group: 'nonsilicates', match: (p) => p.family === 'Óxidos (grupo dos espinélios)' },
    { id: 'hydroxides', label: 'Hidróxidos', group: 'nonsilicates', match: (p) => p.family === 'Hidróxidos' },
    { id: 'halides', label: 'Haletos', group: 'nonsilicates', match: (p) => p.family === 'Haletos' },
    { id: 'carbonates', label: 'Carbonatos', group: 'nonsilicates', match: (p) => p.family === 'Carbonatos' },
    { id: 'sulfates', label: 'Sulfatos', group: 'nonsilicates', match: (p) => p.family === 'Sulfatos' },
    { id: 'phosphates', label: 'Fosfatos', group: 'nonsilicates', match: (p) => p.family === 'Fosfatos' },
    { id: 'tungstates', label: 'Tungstatos', group: 'nonsilicates', match: (p) => p.family === 'Tungstatos' },
];
function collectionSectionFor(p) {
    return collectionSections.find(section => section.match(p)) ?? { id: `fallback-${p.id}`, label: p.family, group: 'nonsilicates', match: () => false };
}
function collectionTagsFor(p) {
    const section = collectionSectionFor(p);
    const tags = new Set(['all']);
    tags.add(section.group === 'silicates' ? 'silicates' : 'nonsilicates');
    if (section.id === 'native')
        tags.add('native');
    if (['accessories', 'phosphates', 'tungstates', 'tourmalines', 'zeolites'].includes(section.id))
        tags.add('accessory');
    if (['sulfides', 'oxides', 'mixedoxides', 'spinels', 'native', 'carbonates', 'tungstates', 'phosphates'].includes(section.id))
        tags.add('ore');
    if (['hydroxides', 'mixedoxides', 'clays', 'serpentines', 'chlorites', 'phyllos', 'carbonates', 'sulfates'].includes(section.id))
        tags.add('alteration');
    if (['garnets', 'amphiboles', 'micas', 'chlorites', 'serpentines', 'epidotes', 'aluminosilicates', 'metamorphic', 'inos'].includes(section.id))
        tags.add('metamorphic');
    return tags;
}
const collectionMatchesTopic = (p, topic) => topic === 'all' || collectionTagsFor(p).has(topic);
const collectionMatchesSearch = (p, query) => !query || normalizeText(`${p.name} ${p.formula} ${p.family} ${collectionSectionFor(p).label}`).includes(query);
function collectionTileMarkup(p, available) {
    return `<button class="collection-tile ${available ? '' : 'tile-locked'}" data-action="${available ? 'detail' : 'none'}" data-id="${esc(p.id)}" ${available ? '' : 'disabled'} style="${styleFor(p)}"><span class="tile-orb">${available ? iconMarkup(p) : '?'}</span><span>${available ? esc(shortName(p)) : 'Desconhecido'}</span></button>`;
}
function collectionTopicStats(minerals, acquired) {
    return collectionTopicDefs.map(topic => {
        const items = minerals.filter(p => collectionMatchesTopic(p, topic.id));
        return { topic, total: items.length, discovered: items.filter(p => acquired.has(p.id)).length };
    });
}
function reactionActor(id) {
    const found = item(id);
    if (found)
        return found;
    const agent = engine.agents.find(a => a.id === id);
    if (agent)
        return { id: agent.id, name: agent.name, formula: agent.icon, description: agent.description, family: 'Agentes', kind: 'agent', color: '#eaf1ff' };
    return { id, name: id, formula: id, description: '', family: 'Outros', kind: 'reagent', color: '#eef0f2' };
}
function reactionChipMarkup(id) {
    const p = reactionActor(id);
    return `<span class="reaction-chip" style="${styleFor(p)}"><span class="reaction-chip-orb ${chemicalIcon(p) ? 'orb-chemical' : ''} ${denseIcon(p) ? 'orb-dense' : ''}">${iconMarkup(p)}</span><span class="reaction-chip-label">${esc(shortName(p))}</span></span>`;
}
function reactionFlowMarkup(ids) {
    return `<div class="reaction-flow">${ids.map(reactionChipMarkup).join('<span class="reaction-flow-plus">+</span>')}</div>`;
}
function scientificDetailsMarkup(reaction, science) {
    const { reference, conditions, environmentalInputs, equationIssue, process, reviewStatus } = science;
    const label = {
        balanco_ideal: 'Balanço ideal de referência',
        equilibrio: 'Equilíbrio de referência',
        semirreacao: 'Semirreação de referência',
        equacao: 'Equação química de referência',
        didatica: 'Interpretação da combinação',
    }[science.evidence];
    const value = reference?.equation ?? reaction.summary;
    const status = reaction.historicalSnapshot ? 'Versão registrada na partida' : REVIEW_LABELS[reviewStatus];
    return `<div class="reaction-reference">
      <span class="reaction-reference-title">${esc(label)}</span>
      <p class="reaction-equation">${esc(value)}</p>
      <p class="reaction-reference-note">${esc(PROCESS_LABELS[process])} · ${esc(status)}</p>
      ${equationIssue ? `<p class="reaction-reference-note">${esc(equationIssue)}</p>` : ''}
      ${environmentalInputs.length ? `<p class="reaction-conditions"><b>Componentes do meio</b> ${esc(environmentalInputs.map(id => reactionActor(id).name).join(', '))}</p>` : ''}
      ${conditions ? `<p class="reaction-conditions"><b>Condições</b> ${esc(conditions)}</p>` : ''}
    </div>`;
}
function historyEntryMarkup({ reaction, count, lastAt }) {
    const timestamp = new Date(lastAt).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const inputs = [...reaction.inputs, ...(reaction.agent ? [reaction.agent] : [])];
    const science = routeScience(reaction, engine.byCard);
    return `<article class="reaction-entry"><p class="reaction-reference-title">Peças da bancada</p>
      <div class="reaction-row"><div class="reaction-row-main"><div class="reaction-visual"><div class="reaction-side">${reactionFlowMarkup(inputs)}</div><span class="reaction-arrow reaction-arrow-large" aria-hidden="true">→</span><div class="reaction-side">${reactionFlowMarkup(reaction.outputs)}</div></div></div>${count > 1 ? `<span class="reaction-count">${count}×</span>` : ''}</div>
      ${scientificDetailsMarkup(reaction, science)}
      ${science.reference ? `<p class="reaction-summary">${esc(reaction.summary)}</p>` : ''}
      <time class="reaction-date" datetime="${new Date(lastAt).toISOString()}">${esc(timestamp)}</time>
    </article>`;
}
function historyEntriesMatchQuery(reaction, query) {
    if (!query)
        return true;
    const related = [...reaction.inputs, ...reaction.outputs, ...(reaction.agent ? [reaction.agent] : [])];
    const names = related.map(id => { const p = item(id); return `${p?.name ?? engine.agents.find(a => a.id === id)?.name ?? id} ${p?.formula ?? ''}`; }).join(' ');
    const science = routeScience(reaction, engine.byCard);
    return normalizeText(`${names} ${science.reference?.equation ?? ''} ${reaction.summary} ${science.conditions}`).includes(query);
}
/** Sections exist before the player's first experiment; unknown equations remain hidden. */
/** Um produto aparece apenas quando a respectiva reação foi realmente realizada. */
function historyProductGroups(entries) {
    const groups = new Map();
    for (const entry of entries) {
        for (const id of new Set(entry.reaction.outputs)) {
            if (!groups.has(id)) groups.set(id, { product: reactionActor(id), entries: [] });
            groups.get(id).entries.push(entry);
        }
    }
    return [...groups.values()].sort((a, b) =>
        a.product.name.localeCompare(b.product.name, 'pt-BR', { sensitivity: 'base' }) ||
        a.product.id.localeCompare(b.product.id));
}
/** Seções temáticas continuam disponíveis; por produto só exibe descobertas. */
function historySectionsMarkup() {
    const current = completedReactions(save, engine).filter(entry => reactionCatalogTags(entry.reaction, engine.byCard).includes(historyFilter));
    const query = normalizeText(historySearch.trim());
    if (historyGroup === 'product') {
        const groups = historyProductGroups(current.filter(entry => historyEntriesMatchQuery(entry.reaction, query)));
        if (!groups.length)
            return '<div class="history-empty">Nenhuma reação registrada corresponde a esta busca.</div>';
        return groups.map(({ product, entries }) => `<section class="history-section history-product-section"><div class="history-section-head"><div><h3>${esc(product.name)}</h3><p>${esc(product.formula)} · Reações que produziram este material</p></div><span>${entries.length} ${entries.length === 1 ? 'rota' : 'rotas'}</span></div><div class="reaction-list">${entries.map(historyEntryMarkup).join('')}</div></section>`).join('');
    }
    const possible = engine.reactions.filter(reaction => reactionCatalogEligible(reaction) && reactionCatalogTags(reaction, engine.byCard).includes(historyFilter));
    const sections = REACTION_CATALOG_SECTIONS.map(section => {
        const total = possible.filter(reaction => reactionCatalogSection(reaction, engine.byCard) === section.id).length;
        const recorded = current.filter(entry => reactionCatalogSection(entry.reaction, engine.byCard) === section.id);
        const matches = recorded.filter(entry => historyEntriesMatchQuery(entry.reaction, query));
        return { section, total, recorded, matches };
    }).filter(({ total, recorded, matches }) => (total > 0 || recorded.length > 0) && (!query || matches.length > 0));
    if (!sections.length)
        return '<div class="history-empty">Nenhuma reação registrada corresponde a esta busca.</div>';
    return sections.map(({ section, total, recorded, matches }) => `<section class="history-section"><div class="history-section-head"><div><h3>${esc(section.label)}</h3><p>${esc(section.description)}</p></div><span>${recorded.length} / ${total}</span></div>${matches.length ? `<div class="reaction-list">${matches.map(historyEntryMarkup).join('')}</div>` : '<p class="history-section-empty">Nenhuma reação realizada nesta seção.</p>'}</section>`).join('');
}
function historyGroupMarkup() {
    return `<div class="history-grouping" role="group" aria-label="Agrupar reações"><span class="history-grouping-label">Organizar por</span><button type="button" class="history-group-button ${historyGroup === 'section' ? 'selected' : ''}" data-action="history-group" data-group="section" aria-pressed="${historyGroup === 'section'}">Processo</button><button type="button" class="history-group-button ${historyGroup === 'product' ? 'selected' : ''}" data-action="history-group" data-group="product" aria-pressed="${historyGroup === 'product'}">Produto</button></div>`;
}
function historyFilterMarkup() {
    const entries = completedReactions(save, engine);
    const possible = engine.reactions.filter(reactionCatalogEligible);
    return REACTION_CATALOG_FILTERS.map(filter => {
        const done = entries.filter(entry => reactionCatalogTags(entry.reaction, engine.byCard).includes(filter.id)).length;
        const total = possible.filter(reaction => reactionCatalogTags(reaction, engine.byCard).includes(filter.id)).length;
        return `<button type="button" class="history-filter ${historyFilter === filter.id ? 'selected' : ''}" data-action="history-filter" data-filter="${filter.id}" aria-pressed="${historyFilter === filter.id ? 'true' : 'false'}"><span>${esc(filter.label)}</span><b>${done} / ${total}</b></button>`;
    }).join('');
}
function boardSize() { const rect = document.querySelector('#board')?.getBoundingClientRect(); return { width: rect?.width ?? 800, height: rect?.height ?? 550 }; }
const clamp = (v, min, max) => Math.max(min, Math.min(Math.max(min, max), v));
function clampPiece(p) { const { width, height } = boardSize(); p.x = clamp(p.x, PIECE_RADIUS, width - PIECE_RADIUS); p.y = clamp(p.y, 52, height - 52); }
function pieceMarkup(piece) {
    const p = item(piece.itemId);
    if (!p)
        return '';
    return `<div class="piece" tabindex="0" role="button" aria-label="${esc(p.name)}. Arraste para combinar ou pressione para ver detalhes" data-instance="${piece.instanceId}" style="left:${piece.x}px;top:${piece.y}px;${styleFor(p)}"><span class="piece-orb ${chemicalIcon(p) ? 'orb-chemical' : ''} ${denseIcon(p) ? 'orb-dense' : ''}"><span>${iconMarkup(p)}</span></span><span class="piece-caption">${esc(shortName(p))}</span></div>`;
}

function rememberRecentlyUsed(id) {
    recentlyUsed = [id, ...recentlyUsed.filter(prev => prev !== id)].slice(0, 8);
}

const SEARCH_ALIASES = {
    halloysite: ['hidrohaloisita', 'haloisita hidratada'],
    hydrothermal: ['Fluido hidrotermal', 'Alteração hidrotermal', 'Fluidos hidrotermais'],
    rain: ['Meteorização', 'Alteração supergênica', 'Chuva'],
    air: ['Meio oxidante', 'Oxidante', 'Oxigênio'],
    reduction: ['Meio redutor', 'Redutor'],
    water: ['H2O'],
    co2: ['Dióxido de carbono', 'Gás carbônico'],
    heat: ['Temperatura elevada', 'Calor'],
    cooling: ['Esfriamento'],
    pressure: ['Pressão alta'],
    olivine: ['Olivina'],
};
const searchWords = (value) => value.match(/[\p{L}\p{N}]+/gu) ?? [];
const librarySearchScore = (p, query) => {
    const name = normalizeText(p.name);
    const short = normalizeText(shortName(p));
    const formula = normalizeText(p.formula);
    const family = normalizeText(p.family);
    const aliases = (SEARCH_ALIASES[p.id] ?? []).map(normalizeText);
    if (name === query || short === query) return 0;
    if (formula && formula === query) return 5;
    if (name.startsWith(query) || short.startsWith(query)) return 10;
    if (aliases.some(a => a === query)) return 15;
    if (searchWords(name).some(word => word.startsWith(query))) return 20;
    if (name.includes(query) || short.includes(query)) return 30;
    if (aliases.some(a => a.startsWith(query))) return 40;
    if (formula.startsWith(query)) return 50;
    if (aliases.some(a => a.includes(query))) return 60;
    if (formula.includes(query)) return 70;
    if (family.startsWith(query)) return 80;
    if (family.includes(query)) return 90;
    if (normalizeText(p.id).includes(query)) return 100;
    return Infinity;
};
/** Distância limitada para sugerir uma grafia próxima somente quando não há resultado exato. */
function searchEditDistance(a, b, limit) {
    if (Math.abs(a.length - b.length) > limit) return limit + 1;
    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        const next = [i];
        let min = i;
        for (let j = 1; j <= b.length; j++) {
            const value = Math.min(
                previous[j] + 1,
                next[j - 1] + 1,
                previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
            next.push(value);
            if (value < min) min = value;
        }
        if (min > limit) return limit + 1;
        previous = next;
    }
    return previous[b.length];
}
function libraryTypoDistance(p, query) {
    if (query.length < 4) return Infinity;
    const limit = query.length >= 6 ? 2 : 1;
    const terms = [p.name, shortName(p), ...(SEARCH_ALIASES[p.id] ?? [])]
        .flatMap(t => [normalizeText(t), ...searchWords(normalizeText(t))]);
    const best = Math.min(...terms.map(term => searchEditDistance(query, term, limit)));
    return best <= limit ? best : Infinity;
}
function getLibraryItems() {
    const query = normalizeText(search.trim());
    const available = knownItems().filter(p => {
        if (filter === 'ion' && p.kind !== 'ion') return false;
        if (filter === 'mineral' && p.kind !== 'mineral') return false;
        if (filter === 'agent' && p.kind !== 'agent') return false;
        if (filter === 'compound' && ['ion', 'mineral', 'agent'].includes(p.kind)) return false;
        return true;
    });
    const byName = (a,b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }) || a.id.localeCompare(b.id);
    if (!query) return available.sort(byName);
    const scored = available.map(p => ({p, score: librarySearchScore(p, query)})).filter(x => Number.isFinite(x.score));
    if (!scored.length) {
        for (const p of available) {
            const distance = libraryTypoDistance(p, query);
            if (Number.isFinite(distance)) scored.push({p, score: 200 + distance * 10});
        }
    }
    const recentRank = p => filter === 'all' ? recentlyUsed.indexOf(p.id) : -1;
    return scored.sort((a,b) => a.score - b.score ||
        ((recentRank(a.p) < 0 ? 99 : recentRank(a.p)) - (recentRank(b.p) < 0 ? 99 : recentRank(b.p))) ||
        byName(a.p,b.p)).map(x => x.p);
}
function resetLibrarySearch() {
    search = '';
    const input = document.querySelector('#catalogSearch');
    if (input) { input.value = ''; input.blur(); }
    updateLibrary();
}
function selectLibraryPiece(id) {
    const added = addPiece(id);
    if (!added) return false;
    resetLibrarySearch();
    return true;
}
function addFirstSearchResult() {
    const found = getLibraryItems()[0];
    if (!found) { notify('Nenhum item corresponde à pesquisa.'); return false; }
    return selectLibraryPiece(found.id);
}
function libraryMarkup() {
    const sorted = getLibraryItems();
    if (!sorted.length) return '<div class="library-empty">Nenhuma descoberta corresponde à busca.</div>';
    const query = normalizeText(search.trim());
    const recent = filter === 'all' && !query ? recentlyUsed.map(id => sorted.find(p => p.id === id)).filter(Boolean) : [];
    const recentIds = new Set(recent.map(p => p.id));
    const remaining = sorted.filter(p => !recentIds.has(p.id));
    const tile = p => '<button type="button" class="library-item" data-item="' + esc(p.id)
        + '" title="Arraste ' + esc(p.name) + ' para a bancada" aria-label="Adicionar ' + esc(p.name)
        + ' à bancada" style="' + styleFor(p) + '"><span class="library-orb '
        + (chemicalIcon(p) ? 'orb-chemical' : '') + ' ' + (denseIcon(p) ? 'orb-dense' : '')
        + '">' + iconMarkup(p) + '</span><span class="library-name">' + esc(shortName(p)) + '</span></button>';
    const section = (heading, items) => items.length ? '<div class="library-section-label">' + heading + '</div>' + items.map(tile).join('') : '';
    if (query) return section('Primeiro resultado · Enter ↵', sorted.slice(0, 1))
        + section('Outras correspondências', sorted.slice(1));
    return section('Usados recentemente', recent) + section('A–Z', remaining);
}
/** Trilhas orientam a exploração, sem impor evolução obrigatória em todos os ambientes. */
function pathNodeMarkup(id) {
    const p = item(id);
    if (!p)
        return '';
    const found = discovered().has(id);
    const inner = `<span class="path-node-icon">${found ? iconMarkup(p) : '?'}</span><span>${found ? esc(shortName(p)) : 'Por descobrir'}</span>`;
    return found ? `<button class="path-node" data-action="detail" data-id="${esc(id)}" style="${styleFor(p)}" title="Ver ${esc(p.name)}">${inner}</button>` : `<span class="path-node path-node-locked" style="${styleFor(p)}">${inner}</span>`;
}
function pathMarkup(ids, transitions) {
    return `<div class="path-list">${ids.map((id, i) => `${i ? `<div class="path-step"><span>↓</span><small>${esc(transitions[i - 1] ?? 'Reequilíbrio')}</small></div>` : ''}${pathNodeMarkup(id)}`).join('')}</div>`;
}
function pathsMarkup() {
    const tracks = [
        { label: 'Bowen · série descontínua', desc: 'Relações representativas de silicatos: sílica, Ca, H₂O e K não são supridos apenas pelo resfriamento.', ids: ['forsterite', 'enstatite', 'diopside', 'tremolite', 'phlogopite', 'biotite'], steps: ['+ sílica', '+ Ca', '+ H₂O e Ca', '+ K e Al', '+ Fe²⁺'] },
        { label: 'Bowen · plagioclásios', desc: 'Cristalização em equilíbrio com líquido magmático progressivamente mais rico em Na; não é alteração de cristal a seco.', ids: ['anorthite', 'bytownite', 'labradorite', 'andesine', 'oligoclase', 'albite'], steps: ['resfriamento + líquido Na', 'resfriamento + líquido Na', 'resfriamento + líquido Na', 'resfriamento + líquido Na', 'resfriamento + líquido Na'] },
        { label: 'Metamorfismo de pelitos', desc: 'Al₂SiO₅ pode participar de equilíbrio com mica. Em alta T, muscovita + quartzo pode produzir K-feldspato + Al₂SiO₅ + H₂O.', ids: ['andalusite', 'muscovite', 'orthoclase'], steps: ['+ K, Si e fluidos', '+ quartzo, aquecimento'] },
        { label: 'Alteração de feldspatos', desc: 'Sericitização e argilização são caminhos possíveis, não etapas obrigatórias de uma única história geológica.', ids: ['orthoclase', 'muscovite', 'kaolinite'], steps: ['+ fluido hidrotermal', '+ intemperismo, lixiviação'] },
        { label: 'Metamorfismo calcissilicático', desc: 'Reação de descarbonatação: calcita + quartzo → wollastonita + CO₂ sob condições P–T–X(CO₂) adequadas.', ids: ['calcite', 'wollastonite'], steps: ['+ quartzo, aquecimento'] },
    ];
    return `<div class="shade" data-action="close-shade"><section class="dialog dialog-wide paths-dialog" role="dialog" aria-modal="true" aria-label="Trilhas mineralógicas"><button class="close" data-action="close" aria-label="Fechar">×</button><p class="overline">RELAÇÕES MINERALÓGICAS</p><h2>Trilhas de transformação</h2><p class="paths-intro">Exemplos de relações mineralógicas e mudanças de composição. Minerais ainda não descobertos permanecem ocultos. Estas trilhas não representam sequências obrigatórias nem garantem transformações em qualquer condição geológica.</p><div class="paths-grid">${tracks.map(track => `<article class="path-track"><h3>${esc(track.label)}</h3><p>${esc(track.desc)}</p>${pathMarkup(track.ids, track.steps)}</article>`).join('')}</div></section></div>`;
}
function headerMarkup() { const { count, total } = percent(); const n = completedReactions(save, engine).length; return `<header class="topbar"><div class="brand"><span class="brand-mark">✦</span><div><strong>mineralchemy</strong></div></div><div class="top-actions"><div class="progress" title="Minerais descobertos"><span class="progress-label">Minerais</span><b>${count}<span> / ${total}</span></b><span class="progress-track"><span style="width:${total ? Math.round(count / total * 100) : 0}%"></span></span></div><button type="button" class="top-button paths-trigger" data-action="paths" title="Trilhas mineralógicas" aria-label="Ver trilhas mineralógicas"><span>⇄</span><span class="desktop-only">Trilhas</span></button><button type="button" class="top-button history-trigger" data-action="history" title="Ver reações realizadas" aria-label="Reações realizadas"><span>≋</span><span class="desktop-only">Reações</span><span class="history-count">${n}</span></button><button type="button" class="top-button top-help" data-action="help" title="Como jogar"><span>?</span><span class="desktop-only">Ajuda</span></button><button type="button" class="top-button icon-button" data-action="collection" title="Catálogo de descobertas" aria-label="Abrir catálogo de descobertas">▦</button></div></header>`; }
function modalMarkup() {
    const present = detailId ? item(detailId) : undefined;
    if (present) {
        const possibleReactionCount = save.discovered.includes(present.id) ? engine.reactions.filter(r => r.inputs.includes(present.id) || r.agent === present.id).length : 0;
        const traced = completedReactions(save, engine).filter(x => x.reaction.outputs.includes(present.id)).slice(0, 5);
        const routes = traced.length ? `<div class="detail-routes"><h3>Descoberto em</h3>${traced.map(({ reaction }) => {
            const inputs = [...reaction.inputs, ...(reaction.agent ? [reaction.agent] : [])];
            return `<details><summary>${esc(inputs.map(id => reactionActor(id).name).join(' + '))}</summary>
              ${scientificDetailsMarkup(reaction, routeScience(reaction, engine.byCard))}
            </details>`;
        }).join('')}</div>` : '';
        return `<div class="shade" data-action="close-shade"><section class="dialog" role="dialog" aria-modal="true" aria-label="Detalhes do material"><button class="close" data-action="close" aria-label="Fechar">×</button><div class="detail-orb" style="${styleFor(present)}">${iconMarkup(present)}</div><p class="overline">${esc(present.kind === 'agent' ? 'AGENTE' : present.family)}</p><h2>${esc(present.name)}</h2><div class="detail-formula">${esc(present.formula)}</div><p class="material-type">${esc(MATERIAL_LABELS[materialType(present)])}</p><p>${esc(present.description)}</p>${routes}<div class="detail-foot">${possibleReactionCount} rotas cadastradas com este material</div><button class="primary" data-action="use-detail" data-id="${esc(present.id)}">Adicionar à bancada <span>↗</span></button></section></div>`;
    }
    if (modal === 'help')
        return `<div class="shade" data-action="close-shade"><section class="dialog" role="dialog" aria-modal="true" aria-label="Como jogar"><button class="close" data-action="close" aria-label="Fechar">×</button><p class="overline">PRIMEIROS PASSOS</p><h2>Explore combinações mineralógicas</h2><div class="help-step"><span>01</span><p><b>Escolha um material</b> na coleção lateral. Toque para adicioná-lo à bancada ou arraste a peça diretamente para lá.</p></div><div class="help-step"><span>02</span><p><b>Combine duas peças</b> arrastando uma sobre a outra ou usando o botão Reagir. Algumas descobertas exigem uma associação intermediária.</p></div><div class="help-step"><span>03</span><p><b>Continue explorando.</b> Os materiais descobertos ficam disponíveis para novas combinações. Consulte o catálogo de descobertas e o histórico de reações.</p></div><p class="help-note">As combinações são modelos didáticos e não equivalem necessariamente a equações químicas balanceadas ou processos geológicos viáveis em qualquer condição. Toque em uma peça da bancada para ver seus detalhes.</p><div class="shortcut-guide"><b>Atalhos</b><div><kbd>Digitar</kbd> inicia a busca da coleção lateral · <kbd>Ctrl+K</kbd> foca a busca · <kbd>Enter</kbd> adiciona o primeiro resultado.</div><div><kbd>Ctrl+Enter</kbd> reage · <kbd>Delete</kbd> limpa a bancada · <kbd>Tab</kbd> e <kbd>Shift+Tab</kbd> percorrem os controles · <kbd>←</kbd>/<kbd>→</kbd> mudam a categoria da janela aberta · <kbd>Esc</kbd> fecha a janela ou limpa a busca lateral.</div><div>Em buscas e campos editáveis, as setas continuam movendo o cursor. O jogo salva o progresso neste navegador.</div></div><div class="progress-tools"><h3>Progresso da partida</h3><div class="dialog-buttons"><button type="button" class="secondary" data-action="export-progress">Exportar progresso</button></div><label for="importProgress">Restaurar progresso</label><input id="importProgress" type="file" accept=".json,application/json"><p role="status">${esc(importNotice)}</p>${pendingImport ? '<button type="button" class="primary" data-action="confirm-import">Confirmar restauração</button>' : ''}</div><button class="primary" data-action="close">Voltar ao jogo <span>→</span></button></section></div>`;
    if (modal === 'reset')
        return `<div class="shade" data-action="close-shade"><section class="dialog" role="dialog" aria-modal="true" aria-label="Reiniciar descobertas"><button class="close" data-action="close" aria-label="Fechar">×</button><p class="overline">NOVA PARTIDA</p><h2>Reiniciar a partida?</h2><p>Os minerais descobertos, as reações registradas e as peças da bancada serão apagados deste navegador. Esta ação não pode ser desfeita.</p><div class="dialog-buttons"><button class="secondary" data-action="close">Cancelar</button><button class="danger" data-action="confirm-reset">Reiniciar jogo</button></div></section></div>`;
    if (modal === 'paths')
        return pathsMarkup();
    if (modal === 'history') {
        const entries = completedReactions(save, engine);
        return `<div class="shade" data-action="close-shade"><section class="dialog dialog-wide history-dialog" role="dialog" aria-modal="true" aria-label="Histórico de reações"><button class="close" data-action="close" aria-label="Fechar">×</button><p class="overline">REGISTRO DE EXPERIMENTOS</p><h2>Reações <span class="muted">${entries.length}</span></h2><p class="history-intro">Consulte as combinações que você já realizou. Os diagramas mostram as peças usadas; quando disponível, a equação de referência apresenta um processo químico que pode envolver outros componentes e condições. Organize as rotas por processo ou produto. Receitas desconhecidas não são reveladas.</p>${historyGroupMarkup()}<div class="history-filters">${historyFilterMarkup()}</div><label class="search history-search"><span>⌕</span><input id="historySearch" value="${esc(historySearch)}" type="search" placeholder="Buscar reação, componente ou produto" aria-label="Buscar nas reações realizadas" autocomplete="off"/></label><div id="historyResults" class="history-results">${historySectionsMarkup()}</div></section></div>`;
    }
    if (modal === 'collection') {
        const acquired = discovered();
        const mine = mineralPlayables();
        const { count, total } = percent();
        const query = normalizeText(collectionSearch.trim());
        const topicStats = collectionTopicStats(mine, acquired);
        const visibleSections = collectionSections.map(section => {
            const sectionItems = mine.filter(p => collectionSectionFor(p).id === section.id && collectionMatchesTopic(p, collectionTopic));
            const visibleItems = sectionItems.filter(p => collectionMatchesSearch(p, query));
            return { section, total: sectionItems.length, discovered: sectionItems.filter(p => acquired.has(p.id)).length, visibleItems };
        }).filter(entry => entry.total > 0 && (!query || entry.visibleItems.length > 0));
        const summary = topicStats.find(entry => entry.topic.id === collectionTopic) ?? { topic: collectionTopicDefs[0], discovered: 0, total: 0 };
        return `<div class="shade" data-action="close-shade"><section class="dialog dialog-wide collection-dialog" role="dialog" aria-modal="true" aria-label="Coleção de minerais"><button class="close" data-action="close" aria-label="Fechar">×</button><p class="overline">ATLAS MINERALÓGICO</p><h2>Descobertas <span class="muted">${count} / ${total}</span></h2><p class="collection-summary">Acompanhe os minerais encontrados por categoria. Uma carta pode aparecer em mais de um grupo; minerais não descobertos permanecem ocultos.</p><div class="collection-topics">${topicStats.map(({ topic, discovered, total }) => `<button type="button" class="collection-topic ${collectionTopic === topic.id ? 'selected' : ''}" data-action="collection-topic" data-topic="${topic.id}" aria-pressed="${collectionTopic === topic.id ? 'true' : 'false'}"><span>${topic.label}</span><b>${discovered} / ${total}</b></button>`).join('')}</div><label class="search collection-search"><span>⌕</span><input id="collectionSearch" value="${esc(collectionSearch)}" type="search" placeholder="Buscar por mineral, fórmula ou família" aria-label="Buscar no atlas mineralógico" autocomplete="off"/></label><p class="collection-topic-summary">Exibindo <b>${summary.discovered} / ${summary.total}</b> minerais em <b>${esc(summary.topic.label)}</b>.</p>${visibleSections.length ? `<div class="collection-sections">${visibleSections.map(({ section, total, discovered, visibleItems }) => `<section class="collection-section"><div class="collection-section-head"><div><h3>${esc(section.label)}</h3><p>${discovered} descobertos · ${total - discovered} restantes</p></div><span>${discovered} / ${total}</span></div><div class="collection-grid">${visibleItems.map(p => collectionTileMarkup(p, acquired.has(p.id))).join('')}</div></section>`).join('')}</div>` : `<div class="collection-empty">Nenhum mineral corresponde à busca e à categoria selecionadas.</div>`}<button class="text-button" data-action="reset">Reiniciar descobertas</button></section></div>`;
    }
    return '';
}
function mainMarkup() {
    const acquired = knownItems();
    const library = `<aside class="library"><div class="library-heading"><h2>Coleção <span>${acquired.length}</span></h2></div><label class="search"><span>⌕</span><input id="catalogSearch" value="${esc(search)}" type="search" placeholder="Buscar material ou fórmula" aria-label="Buscar material na coleção lateral" autocomplete="off"/></label><div class="filters"><button data-action="filter" data-filter="all" class="${filter === 'all' ? 'selected' : ''}">Tudo</button><button data-action="filter" data-filter="ion" class="${filter === 'ion' ? 'selected' : ''}">Íons</button><button data-action="filter" data-filter="mineral" class="${filter === 'mineral' ? 'selected' : ''}">Minerais</button><button data-action="filter" data-filter="agent" class="${filter === 'agent' ? 'selected' : ''}">Agentes</button><button data-action="filter" data-filter="compound" class="${filter === 'compound' ? 'selected' : ''}">Compostos</button></div><div id="libraryItems" class="library-items">${libraryMarkup()}</div></aside>`;
    const board = `<section class="workspace"><div class="workspace-heading"><h1>Bancada</h1><div class="board-actions"><span id="pieceCount">${pieces.length} peças</span><button type="button" data-action="react" class="clear-button board-react" title="Reagir as peças da bancada (Ctrl+Enter)" aria-label="Reagir as peças da bancada">⚗ <span>Reagir</span></button><button type="button" data-action="clear" class="clear-button" title="Limpar a bancada (Delete)">↺ <span>Limpar</span></button></div></div><div id="board" class="board" role="region" aria-label="Bancada">${pieces.map(pieceMarkup).join('')}<div id="boardEmpty" class="board-empty ${pieces.length ? 'hidden' : ''}"></div></div></section>`;
    return `${headerMarkup()}<p id="saveWarning" class="save-warning" role="status" ${storageWarning ? '' : 'hidden'}>${esc(storageWarning)}</p><div class="game">${board}${library}</div><div id="toast" class="toast" aria-live="polite"></div><div id="modalRoot">${modalMarkup()}</div>`;
}
function render() {
    if (!app) return;
    const focus = focusSelectorFor(document.activeElement);
    app.innerHTML = mainMarkup();
    for (const p of pieces) clampPiece(p);
    updateBoardDom();
    if (modal || detailId) updateModal();
    else if (focus) document.querySelector(focus)?.focus?.({ preventScroll: true });
}
function updateBoardDom() {
    const board = document.querySelector('#board');
    if (!board)
        return;
    board.querySelectorAll('.piece').forEach(e => e.remove());
    const empty = board.querySelector('#boardEmpty');
    empty?.classList.toggle('hidden', pieces.length > 0);
    board.insertAdjacentHTML('afterbegin', pieces.map(pieceMarkup).join(''));
    const count = document.querySelector('#pieceCount');
    if (count)
        count.textContent = `${pieces.length} ${pieces.length === 1 ? 'peça' : 'peças'}`;
}
function notify(message, newDiscovery = false) {
    const toast = document.querySelector('#toast');
    if (!toast)
        return;
    toast.textContent = (newDiscovery ? '✦  ' : '') + message;
    toast.classList.add('visible');
    if (toastTimer)
        clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), newDiscovery ? 3400 : 2300);
}
function findFreeSpot() {
    const { width, height } = boardSize();
    const center = { x: width / 2, y: height / 2 };
    for (let step = 0; step < 80; step++) {
        const r = step === 0 ? 0 : 30 + Math.sqrt(step) * 23;
        const theta = step * 2.399963;
        const x = clamp(center.x + Math.cos(theta) * r, PIECE_RADIUS, width - PIECE_RADIUS);
        const y = clamp(center.y + Math.sin(theta) * r, 52, height - 52);
        if (!findCollision(pieces, -1, x, y, 88))
            return { x, y };
    }
    return { x: clamp(center.x + Math.random() * 100 - 50, PIECE_RADIUS, width - PIECE_RADIUS), y: clamp(center.y + Math.random() * 100 - 50, 52, height - 52) };
}
function addPiece(itemId) {
    if (!discovered().has(itemId) || !item(itemId))
        return null;
    if (pieces.length >= 120) {
        notify('Limpe parte da bancada para continuar.');
        return null;
    }
    const spot = findFreeSpot();
    const p = { instanceId: nextInstance++, itemId, ...spot };
    pieces.push(p);
    rememberRecentlyUsed(itemId);
    const board = document.querySelector('#board');
    board?.insertAdjacentHTML('afterbegin', pieceMarkup(p));
    board?.querySelector('#boardEmpty')?.classList.add('hidden');
    const count = document.querySelector('#pieceCount');
    if (count)
        count.textContent = `${pieces.length} peças`;
    persistSession();
    return p;
}

function reactBoard() {
    if (active) return false;
    if (pieces.length > 2) {
        notify('Use apenas duas peças por reação. Para mais componentes, combine em etapas.');
        return false;
    }
    if (pieces.length < 2) {
        notify('Coloque duas peças na bancada para reagir.');
        return false;
    }
    const r = resolvePair(pairs, pieces[0].itemId, pieces[1].itemId);
    if (!r) { notify('Não há uma combinação cadastrada para essas duas peças.'); return false; }
    combine(pieces[0], pieces[1], r);
    return true;
}
function clearBoard() {
    pieces = [];
    persistSession();
    updateBoardDom();
    notify('Bancada limpa. Suas descobertas foram mantidas.');
}
function getCoord(e) {
    const rect = document.querySelector('#board')?.getBoundingClientRect();
    if (!rect)
        return null;
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom };
}
function beginPointer(e, origin, source) {
    if (e.button !== 0 || active)
        return;
    let p;
    if (origin === 'shelf') {
        const id = source.dataset.item;
        if (!id)
            return;
        p = addPiece(id) ?? undefined;
    }
    else
        p = pieces.find(p => p.instanceId === Number(source.dataset.instance));
    if (!p)
        return;
    e.preventDefault();
    const coord = getCoord(e);
    if (!coord)
        return;
    const element = document.querySelector(`.piece[data-instance="${p.instanceId}"]`);
    if (!element)
        return;
    active = { pointerId: e.pointerId, instanceId: p.instanceId, startX: e.clientX, startY: e.clientY, offsetX: origin === 'board' ? coord.x - p.x : 0, offsetY: origin === 'board' ? coord.y - p.y : 0, origin, element, moved: false };
    element.classList.add('dragging');
    source.setPointerCapture?.(e.pointerId);
}
function hitTest(p) {
    const target = findCollision(pieces, p.instanceId, p.x, p.y, 76);
    if (!target)
        return false;
    const reaction = resolvePair(pairs, p.itemId, target.itemId);
    if (!reaction)
        return false;
    combine(p, target, reaction);
    return true;
}
function combine(a, b, reaction) {
    const newSave = discover(save, reaction, engine);
    save = newSave.save;
    const { width, height } = boardSize();
    const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
    pieces = pieces.filter(x => x.instanceId !== a.instanceId && x.instanceId !== b.instanceId);
    const products = makeBoardProducts(reaction.outputs, x, y, width, height, nextInstance);
    nextInstance += products.length;
    pieces.push(...products);
    persistSession();
    if (active?.origin === 'shelf') search = '';
    active = null;
    render();
    const names = reaction.outputs.map(id => item(id)?.name ?? id).join(' + ');
    notify(newSave.newIds.length ? `Nova descoberta: ${newSave.newIds.map(id => item(id)?.name ?? id).join(' + ')}` : `Combinação: ${names}`, newSave.newIds.length > 0);
    if (newSave.newIds.length && 'vibrate' in navigator)
        navigator.vibrate?.(20);
}
function movePointer(e) {
    if (!active || active.pointerId !== e.pointerId)
        return;
    if (Math.hypot(e.clientX - active.startX, e.clientY - active.startY) < 5 && !active.moved)
        return;
    active.moved = true;
    const p = pieces.find(p => p.instanceId === active?.instanceId);
    const pos = getCoord(e);
    if (!p || !pos)
        return;
    const { width, height } = boardSize();
    p.x = clamp(pos.x - active.offsetX, PIECE_RADIUS, width - PIECE_RADIUS);
    p.y = clamp(pos.y - active.offsetY, 52, height - 52);
    active.element.style.left = `${p.x}px`;
    active.element.style.top = `${p.y}px`;
    active.element.classList.add('has-moved');
    if (pos.inside)
        hitTest(p);
}
function endPointer(e) {
    if (!active || active.pointerId !== e.pointerId)
        return;
    const state = active;
    active = null;
    const p = pieces.find(p => p.instanceId === state.instanceId);
    if (!p)
        return;
    state.element.classList.remove('dragging', 'has-moved');
    const pos = getCoord(e);
    if (state.moved) {
        if (!pos?.inside) {
            pieces = pieces.filter(x => x.instanceId !== p.instanceId);
            updateBoardDom();
            persistSession();
            if (state.origin === 'board') notify('Peça removida da bancada.');
            return;
        }
        if (hitTest(p)) return;
    }
    else if (state.origin === 'board')
        openDetails(p.itemId);
    persistSession();
    if (state.origin === 'shelf' && pieces.some(x => x.instanceId === state.instanceId)) resetLibrarySearch();
}
function openDetails(id) { if (!discovered().has(id) || !item(id))
    return; detailId = id; modal = null; updateModal(); }
function focusSelectorFor(element) {
    const { action, instance, item: itemId } = element?.dataset ?? {};
    if (element?.id === 'catalogSearch') return '#catalogSearch';
    if (instance) return `[data-instance="${instance}"]`;
    if (itemId) return `[data-item="${itemId}"]`;
    if (['help', 'collection', 'history', 'paths', 'react', 'clear'].includes(action)) {
        return `.topbar [data-action="${action}"], .workspace [data-action="${action}"]`;
    }
    return null;
}
function restoreDialogFocus() {
    const previous = dialogReturnFocus;
    dialogReturnFocus = null;
    if (previous?.element?.isConnected !== false && previous?.element?.focus) {
        previous.element.focus({ preventScroll: true });
    } else {
        const element = (previous?.selector && document.querySelector(previous.selector)) || document.querySelector('#catalogSearch');
        element?.focus?.({ preventScroll: true });
    }
}
function closeDialog() {
    modal = null;
    detailId = null;
    pendingProgressFile = null;
    pendingImport = null;
    importNotice = '';
    updateModal();
}
/** Preserva o foco, a seleção da busca e a rolagem ao atualizar um diálogo. */
function updateModal(focusSelector = null) {
    const root = document.querySelector('#modalRoot');
    if (!root) return;
    const previousDialog = root.querySelector?.('.dialog');
    const previousScroll = previousDialog?.scrollTop ?? null;
    const previousFocus = document.activeElement;
    if (!previousDialog && (modal || detailId) && !dialogReturnFocus) {
        dialogReturnFocus = { element: previousFocus, selector: focusSelectorFor(previousFocus) };
    }
    const searchId = (modal === 'collection' && previousFocus?.id === 'collectionSearch') ||
        (modal === 'history' && previousFocus?.id === 'historySearch')
        ? previousFocus.id : null;
    const selection = searchId && typeof previousFocus.selectionStart === 'number'
        ? [previousFocus.selectionStart, previousFocus.selectionEnd] : null;
    root.innerHTML = modalMarkup();
    const dialog = root.querySelector?.('.dialog');
    for (const selector of ['.topbar', '.game']) {
        const background = document.querySelector(selector);
        if (background) background.inert = Boolean(dialog);
    }
    if (!dialog) {
        if (previousDialog || dialogReturnFocus) restoreDialogFocus();
        return;
    }
    if (previousScroll != null && (focusSelector || searchId)) dialog.scrollTop = previousScroll;
    const selector = focusSelector || (searchId ? '#' + searchId : null);
    const focused = selector ? root.querySelector?.(selector) : null;
    if (focused) {
        focused.focus?.({ preventScroll: true });
        if (selection) focused.setSelectionRange?.(...selection);
    } else {
        dialog.tabIndex = -1;
        dialog.focus?.({ preventScroll: true });
    }
}
function action(el) {
    const a = el.dataset.action;
    switch (a) {
        case 'help':
            modal = 'help';
            detailId = null;
            updateModal();
            break;
        case 'collection':
            modal = 'collection';
            detailId = null;
            updateModal();
            break;
        case 'history':
            modal = 'history';
            detailId = null;
            updateModal();
            break;
        case 'paths':
            modal = 'paths';
            detailId = null;
            updateModal();
            break;
        case 'reset':
            modal = 'reset';
            detailId = null;
            updateModal();
            break;
        case 'close':
        case 'close-shade':
            closeDialog();
            break;
        case 'export-progress':
            exportProgress();
            break;
        case 'confirm-import': {
            if (!pendingImport) break;
            applySession(pendingImport);
            closeDialog();
            const saved = persistSession();
            render();
            notify(saved ? 'Progresso restaurado.' : 'Progresso restaurado nesta aba. Exporte uma cópia para preservá-lo.');
            break;
        }
        case 'clear':
            clearBoard();
            break;
        case 'react':
            reactBoard();
            break;
        case 'confirm-reset': {
            applySession({ progress: makeInitialSave(engine.cards), board: [], recent: [] });
            closeDialog();
            persistSession();
            search = '';
            filter = 'all';
            collectionSearch = '';
            collectionTopic = 'all';
            historySearch = '';
            historyFilter = 'all';
            historyGroup = 'section';
            render();
            notify('Nova partida iniciada.');
            break;
        }
        case 'filter':
            filter = el.dataset.filter;
            updateLibrary();
            break;
        case 'collection-topic':
            collectionTopic = el.dataset.topic ?? 'all';
            updateModal(`.collection-topic[data-topic="${collectionTopic}"]`);
            break;
        case 'history-group':
            historyGroup = el.dataset.group === 'product' ? 'product' : 'section';
            updateModal(`.history-group-button[data-group="${historyGroup}"]`);
            break;
        case 'history-filter':
            historyFilter = el.dataset.filter ?? 'all';
            updateModal(`.history-filter[data-filter="${historyFilter}"]`);
            break;
        case 'use-detail': {
            const id = el.dataset.id;
            if (id)
                addPiece(id);
            closeDialog();
            break;
        }
        case 'detail': {
            const id = el.dataset.id;
            if (id)
                openDetails(id);
            break;
        }
    }
}
function updateHistoryResults() { const root = document.querySelector('#historyResults'); if (root)
    root.innerHTML = historySectionsMarkup(); }
function updateLibrary() { const panel = document.querySelector('#libraryItems'); if (panel)
    panel.innerHTML = libraryMarkup(); document.querySelectorAll('.filters button').forEach(button => button.classList.toggle('selected', button.dataset.filter === filter)); }
function setLibrarySearch(value) {
    search = value;
    if (search.trim()) {
        filter = 'all';
    }
    updateLibrary();
}
app.addEventListener('pointerdown', e => {
    const target = e.target;
    if (!(target instanceof Element))
        return;
    const shelf = target.closest('[data-item]');
    const piece = target.closest('[data-instance]');
    if (piece)
        beginPointer(e, 'board', piece);
    else if (shelf) {
        if (e.pointerType === 'touch' && !target.closest('.library-orb')) {
            shelfLabelTap = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, itemId: shelf.dataset.item };
            return;
        }
        beginPointer(e, 'shelf', shelf);
    }
});
app.addEventListener('pointermove', movePointer);
app.addEventListener('pointerup', e => {
    if (shelfLabelTap?.pointerId === e.pointerId) {
        const t = shelfLabelTap;
        shelfLabelTap = null;
        if (Math.hypot(e.clientX - t.startX, e.clientY - t.startY) < 8)
            selectLibraryPiece(t.itemId);
        return;
    }
    endPointer(e);
});
app.addEventListener('pointercancel', e => { if (shelfLabelTap?.pointerId === e.pointerId)
    shelfLabelTap = null; if (!active || active.pointerId !== e.pointerId)
    return; const orig = active; active = null; orig.element.classList.remove('dragging', 'has-moved'); persistSession(); });
app.addEventListener('click', e => {
    const target = e.target;
    if (!(target instanceof Element))
        return;
    const el = target.closest('[data-action]');
    if (!el || el.hasAttribute('disabled'))
        return;
    if (el.dataset.action === 'close-shade' && target !== el)
        return;
    action(el);
});
app.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ')
        return;
    const target = e.target;
    if (!(target instanceof HTMLElement))
        return;
    if (target.dataset.instance) {
        e.preventDefault();
        const p = pieces.find(p => p.instanceId === Number(target.dataset.instance));
        if (p)
            openDetails(p.itemId);
    }
    if (target.dataset.item) {
        e.preventDefault();
        selectLibraryPiece(target.dataset.item);
    }
});
app.addEventListener('change', e => {
    if (e.target?.id === 'importProgress') void previewProgress(e.target.files?.[0]);
});
app.addEventListener('input', e => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement))
        return;
    if (target.id === 'catalogSearch') {
        setLibrarySearch(target.value);
        return;
    }
    if (target.id === 'collectionSearch') {
        collectionSearch = target.value;
        updateModal('#collectionSearch');
        return;
    }
    if (target.id === 'historySearch') {
        historySearch = target.value;
        updateHistoryResults();
    }
});


/** Navegação circular entre as categorias internas de cada catálogo. */
function nextMenuOption(options, currentId, step) {
    const index = options.findIndex(option => option.id === currentId);
    return options[(index + step + options.length) % options.length].id;
}
function handleGameplayShortcut(e) {
    if (!engine || e.defaultPrevented || e.isComposing) return;
    const key = String(e.key ?? '').toLowerCase();
    const target = e.target;
    const editing = !!target && (target.isContentEditable || ['INPUT','TEXTAREA','SELECT'].includes(target.tagName));
    const noModifiers = !e.ctrlKey && !e.metaKey && !e.altKey;
    if ((modal || detailId) && noModifiers && e.key === 'Escape') {
        e.preventDefault();
        closeDialog();
        return;
    }
    if ((modal || detailId) && noModifiers && (e.key === 'Tab' || e.key === 'ISO_Left_Tab')) {
        const dialog = document.querySelector('#modalRoot')?.querySelector('.dialog');
        const controls = [...(dialog?.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], summary, [tabindex="0"]') ?? [])];
        const reverse = e.shiftKey || e.key === 'ISO_Left_Tab';
        const index = controls.indexOf(target);
        if (index === -1 || (reverse ? index === 0 : index === controls.length - 1)) {
            e.preventDefault();
            (reverse ? controls.at(-1) : controls[0])?.focus?.();
        }
        return;
    }
    // Não captura as setas em campos de texto: nelas movem o cursor normalmente.
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && noModifiers &&
        !e.shiftKey && !editing && !detailId) {
        const direction = e.key === 'ArrowRight' ? 1 : -1;
        if (modal === 'collection') {
            e.preventDefault();
            collectionTopic = nextMenuOption(collectionTopicDefs, collectionTopic, direction);
            updateModal(`.collection-topic[data-topic="${collectionTopic}"]`);
            return;
        }
        if (modal === 'history') {
            e.preventDefault();
            if (target?.dataset?.action === 'history-group' || target?.closest?.('[data-action="history-group"]')) {
                historyGroup = historyGroup === 'section' ? 'product' : 'section';
                updateModal(`.history-group-button[data-group="${historyGroup}"]`);
            } else {
                historyFilter = nextMenuOption(REACTION_CATALOG_FILTERS, historyFilter, direction);
                updateModal(`.history-filter[data-filter="${historyFilter}"]`);
            }
            return;
        }
        // Trilhas não tem submenus; mantém o comportamento nativo das setas.
    }
    if (modal || detailId) return;
    const input = document.querySelector('#catalogSearch');
    if ((e.ctrlKey || e.metaKey) && key === 'k' && !e.altKey) {
        e.preventDefault(); input?.focus(); return;
    }
    if (e.key === 'Enter' && target?.id === 'catalogSearch' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault(); addFirstSearchResult(); return;
    }
    if (e.key === 'Escape' && target?.id === 'catalogSearch') {
        e.preventDefault(); resetLibrarySearch(); return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !e.altKey && !editing) {
        e.preventDefault(); reactBoard(); return;
    }
    const altGraph = e.getModifierState?.('AltGraph') === true;
    if (editing || ((e.ctrlKey || e.metaKey || e.altKey) && !altGraph)) return;
    if (e.key === 'Delete') {
        e.preventDefault(); clearBoard(); return;
    }
    // Acentos compostos em teclado internacional: focar antes do caractere.
    if (e.key === 'Dead') { input?.focus(); return; }
    if (e.key === ' ' && target?.closest?.('button, [role="button"], a[href]')) return;
    // Todas as teclas imprimíveis iniciam busca, incluindo R e C.
    if (e.key.length === 1 && input) {
        e.preventDefault();
        input.value = e.key;
        setLibrarySearch(input.value);
        input.focus();
    }
}
window.addEventListener('keydown', handleGameplayShortcut, true);
window.addEventListener('resize', () => { if (active)
    return; for (const p of pieces)
    clampPiece(p); updateBoardDom(); });
async function boot() {
    try {
        const { cards, agents, reactions, rules } = EMBEDDED;
        engine = createEngine(cards, agents, reactions, rules);
        if (engine.diagnostics.length)
            throw new Error(engine.diagnostics.join('; '));
        pairs = buildPairCatalog(engine);
        playables = [...engine.cards, ...agents.filter(a => specialAgents.has(a.id)).map(a => ({ id: a.id, name: a.name, formula: 'Agente ambiental', description: a.description, family: 'Processo geológico', kind: 'agent', color: '#80acc6' }))];
        byPlayable = new Map(playables.map(p => [p.id, p]));
        loadSession();
        render();
    }
    catch (error) {
        if (app)
            app.innerHTML = `<div class="fatal"><h1>Não foi possível abrir o Mineralchemy</h1><p>${esc(error instanceof Error ? error.message : String(error))}</p></div>`;
    }
}
void boot();
