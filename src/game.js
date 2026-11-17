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
let trailMode = 'continuation';
let trailFocusId = null;
const trailHints = new Map();
let pendingTrailPair = '';
let trailNotice = '';
let recentDiscoveries = [];
let missingPairIds = [];
let modal = null;
let detailId = null;
let detailOrigin = null;
let discoveryIds = [];
let dialogReturnFocus = null;
const consumedKeys = new Set();
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
const percent = () => { const cards = mineralPlayables(); return { count: cards.filter(c => save.discovered.includes(c.id)).length, total: cards.length }; };
const discovered = () => new Set([...save.discovered, ...specialAgents].filter(id => isPlayableCard(item(id))));
const knownItems = () => { const known = discovered(); return playables.filter(p => known.has(p.id)); };
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
    const found = item(id) ?? engine.byCard.get(id);
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
    const names = related.map(id => { const p = reactionActor(id); return `${p.name} ${p.formula}`; }).join(' ');
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
    return `<div class="path-list">${ids.map((stage, i) => {
        const step = i ? `<div class="path-step"><span>↓</span><small>${esc(transitions[i - 1] ?? 'Reequilíbrio')}</small></div>` : '';
        const materials = Array.isArray(stage)
            ? `<div class="path-stage">${stage.map(pathNodeMarkup).join('')}</div>`
            : pathNodeMarkup(stage);
        return step + materials;
    }).join('')}</div>`;
}
function thematicPathsMarkup() {
    const tracks = [
        { label: 'Bowen · série descontínua', desc: 'Olivina, piroxênios, anfibólio e biotita ilustram mudanças de minerais durante a evolução de certos magmas. A ordem e as fases dependem da composição do líquido, da pressão e da água disponível.', ids: ['forsterite', ['enstatite', 'augite'], 'magnesiohornblende', 'biotite'], steps: ['reação com o líquido', 'evolução do líquido e disponibilidade de H₂O', 'evolução do líquido e inclusão de K'] },
        { label: 'Bowen · plagioclásios', desc: 'Cristais em equilíbrio com líquido magmático podem evoluir para composições mais sódicas. Difusão lenta ou retirada dos cristais pode preservar núcleos mais cálcicos.', ids: ['anorthite', 'bytownite', 'labradorite', 'andesine', 'oligoclase', 'albite'], steps: Array(5).fill('líquido residual e troca Ca–Al por Na–Si') },
        { label: 'Metamorfismo de pelitos', desc: 'A desidratação subsólida de muscovita com quartzo pode produzir feldspato potássico, Al₂SiO₅ e fluido. A silimanita representa o aluminossilicato no campo apropriado de pressão e temperatura.', ids: [['muscovite', 'quartz'], ['orthoclase', 'sillimanite', 'water']], steps: ['desidratação subsólida em condições adequadas'] },
        { label: 'Alteração de feldspatos', desc: 'Sericitização e argilização são caminhos possíveis, não etapas obrigatórias de uma única história geológica.', ids: ['orthoclase', 'muscovite', 'kaolinite'], steps: ['+ fluido hidrotermal', '+ intemperismo, lixiviação'] },
        { label: 'Metamorfismo calcissilicático', desc: 'Reação de descarbonatação: calcita + quartzo → wollastonita + CO₂ sob condições P–T–X(CO₂) adequadas.', ids: ['calcite', 'wollastonite'], steps: ['+ quartzo, aquecimento'] },
    ];
    return `<p class="paths-intro">As trilhas temáticas mostram exemplos de relações mineralógicas cuja ocorrência depende das condições geológicas.</p><div class="paths-grid">${tracks.map(track => `<article class="path-track"><h3>${esc(track.label)}</h3><p>${esc(track.desc)}</p>${pathMarkup(track.ids, track.steps)}</article>`).join('')}</div>`;
}
function trailOptionMarkup({ reaction, inputs, partnerId, newOutputs, prerequisite }, blocked) {
    const level = trailHints.get(reaction.id) ?? 0;
    const partner = reactionActor(partnerId);
    const process = PROCESS_LABELS[routeProcess(reaction, engine.byCard)];
    const label = ['Mostrar pista', blocked ? 'Mostrar como obter a peça' : 'Revelar combinação', 'Revelar produto'][level];
    const hint = level ? `<p>Tipo da outra peça: ${esc(MATERIAL_LABELS[materialType(partner)])}. Família: ${esc(partner.family)}.</p>` : '';
    let recipe = '';
    if (level >= 2 && !blocked) {
        recipe = `<div class="trail-recipe">${reactionFlowMarkup(inputs)}<button type="button" class="secondary" data-action="trail-prepare" data-id="${esc(reaction.id)}">Preparar na bancada</button></div>`;
    } else if (level >= 2) {
        const route = prerequisite?.actions ?? [];
        const step = route[0];
        recipe = `<p>Peça por descobrir: <b>${esc(partner.name)}</b>.</p>` + (step
            ? `<ol class="trail-steps">${route.map(({ inputs, reaction }) => `<li>${esc(inputs.map(id => reactionActor(id).name).join(' + '))} <span aria-hidden="true">→</span> ${esc(reaction.outputs.map(id => reactionActor(id).name).join(' + '))}</li>`).join('')}</ol><button type="button" class="secondary" data-action="trail-prepare" data-id="${esc(step.reaction.id)}">Preparar etapa na bancada</button><p>Depois de descobrir a peça, volte a esta continuação.</p>`
            : '<p>Não foi encontrado um caminho para obter essa peça com os materiais atuais.</p>');
    }
    const result = level === 3 ? `<div class="trail-result" tabindex="-1"><p>Produto${reaction.outputs.length === 1 ? '' : 's'}: <b>${esc(reaction.outputs.map(id => reactionActor(id).name).join(' + '))}</b>.</p>${scientificDetailsMarkup(reaction, routeScience(reaction, engine.byCard))}</div>` : '';
    return `<article class="trail-option" data-trail-reaction="${esc(reaction.id)}"><h4>${esc(process)}</h4><span class="trail-kind">${newOutputs.length ? 'Nova descoberta' : 'Rever combinação'}</span>${hint}${recipe}${result}${level < 3 ? `<button type="button" class="text-button trail-hint" data-action="trail-hint" data-id="${esc(reaction.id)}">${label}</button>` : ''}</article>`;
}
function terminalTrailMarkup(focus, known) {
    const recent = completedReactions(save, engine).find(({ reaction }) => reaction.outputs.includes(focus));
    const precursors = [...new Set(recent?.reaction.inputs ?? [])]
        .filter(id => id !== focus && known.has(id) && item(id)?.kind !== 'agent');
    return `<p class="paths-intro">O catálogo não oferece uma continuação acessível para este material nesta partida.</p>${precursors.length ? `<div class="trail-modes">${precursors.map(id => `<button type="button" class="secondary" data-action="trail-focus" data-id="${esc(id)}">Voltar a explorar ${esc(item(id).name)}</button>`).join('')}</div>` : ''}`;
}
function continuationMarkup() {
    const list = knownItems().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    const known = new Set(list.map(p => p.id));
    const focus = known.has(trailFocusId) ? trailFocusId : '';
    const select = `<label class="trail-focus" for="trailFocus"><span>Material de partida</span><select id="trailFocus"><option value="">Escolha um material</option>${list.map(p => `<option value="${esc(p.id)}"${p.id === focus ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select></label>`;
    if (!focus) return `${select}<p class="paths-intro">Escolha um material da coleção para ver combinações e pistas.</p>`;
    const { available, blocked } = continuationOptions(pairs, focus, known, byPlayable);
    const group = (title, options, isBlocked) => options.length
        ? `<section class="trail-options"><h3>${title}</h3>${options.map(option => trailOptionMarkup(option, isBlocked)).join('')}</section>` : '';
    const choices = group('Disponíveis agora', available, false) + group('Falta uma peça', blocked, true);
    const confirm = pendingTrailPair ? `<div class="trail-confirm" role="group" aria-labelledby="trailConfirm"><p id="trailConfirm">A bancada tem peças que não fazem parte desta etapa. Substituí-las?</p><div class="dialog-buttons"><button type="button" class="secondary" data-action="trail-keep">Manter bancada</button><button type="button" class="primary" data-action="trail-replace">Substituir peças</button></div></div>` : '';
    return `${select}${trailNotice ? `<p class="trail-notice" role="status">${esc(trailNotice)}</p>` : ''}${confirm}${choices || terminalTrailMarkup(focus, known)}`;
}
function pathsMarkup() {
    const tabs = [['continuation', 'Continuar descobertas'], ['thematic', 'Trilhas temáticas']];
    return `<div class="shade" data-action="close-shade"><section class="dialog dialog-wide paths-dialog" role="dialog" aria-modal="true" aria-label="Trilhas mineralógicas"><button class="close" data-action="close" aria-label="Fechar">×</button><h2>Trilhas</h2><div class="trail-modes" role="group" aria-label="Modo das trilhas">${tabs.map(([mode, name]) => `<button type="button" class="secondary" data-action="trail-mode" data-mode="${mode}" aria-pressed="${trailMode === mode}">${name}</button>`).join('')}</div>${trailMode === 'continuation' ? continuationMarkup() : thematicPathsMarkup()}</section></div>`;
}
function boardTrailMarkup() {
    const button = (id, label) => `<button type="button" class="trail-link" data-action="trail-focus" data-id="${esc(id)}">${esc(label)}</button>`;
    const missed = missingPairIds.length ? `<div class="board-trail-row"><p>Não há uma combinação cadastrada para essas duas peças.</p>${missingPairIds.map(id => button(id, `Explorar com ${reactionActor(id).name}`)).join('')}</div>` : '';
    const justFound = recentDiscoveries.length ? `<div class="board-trail-row"><p>Continuar da descoberta:</p>${recentDiscoveries.map(id => button(id, reactionActor(id).name)).join('')}</div>` : '';
    const resume = trailFocusId ? `<button type="button" class="trail-link" data-action="trail-resume">Voltar à continuação de ${esc(reactionActor(trailFocusId).name)}</button>` : '';
    return missed + justFound + resume;
}
function updateBoardTrailLinks() {
    const area = document.querySelector('#boardTrailLinks');
    if (!area) return;
    const markup = boardTrailMarkup();
    if (area.innerHTML === markup) return;
    const previous = document.activeElement;
    const selector = area.contains?.(previous) ? focusSelectorFor(previous) : null;
    area.innerHTML = markup;
    if (selector) document.querySelector(selector)?.focus?.({ preventScroll: true });
}
function setTrailFocus(id) {
    const next = discovered().has(id) ? id : null;
    if (next !== trailFocusId) {
        trailHints.clear();
        trailFocusId = next;
        persistSession();
    }
    pendingTrailPair = '';
    trailNotice = '';
}
function openContinuation(id = trailFocusId) {
    setTrailFocus(id);
    trailMode = 'continuation';
    modal = 'paths';
    detailId = null;
    detailOrigin = null;
    updateModal('#trailFocus');
}
function resetContinuation() {
    trailHints.clear();
    pendingTrailPair = '';
    trailNotice = '';
    recentDiscoveries = [];
    missingPairIds = [];
    trailMode = 'continuation';
}
function prepareTrailPair(reactionId, replace = false) {
    const entry = pairs.pairs.find(({ reaction }) => reaction.id === reactionId);
    const known = discovered();
    if (!entry?.inputs.every(id => known.has(id)) || active) {
        trailNotice = 'Essas peças ainda não estão disponíveis para preparar a etapa.';
        pendingTrailPair = '';
        updateModal('#trailFocus');
        return;
    }
    const remaining = [...entry.inputs];
    const kept = pieces.filter(piece => {
        const index = remaining.indexOf(piece.itemId);
        if (index === -1) return false;
        remaining.splice(index, 1);
        return true;
    });
    if (kept.length !== pieces.length && !replace) {
        pendingTrailPair = reactionId;
        updateModal('[data-action="trail-keep"]');
        document.querySelector('.trail-confirm')?.scrollIntoView?.({ block: 'nearest' });
        return;
    }
    missingPairIds = [];
    pieces = kept;
    for (const id of remaining) addPiece(id, false);
    updateBoardDom();
    persistSession();
    closeDialog();
    document.querySelector('.workspace [data-action="react"]')?.focus();
    notify('Duas peças preparadas. Use Reagir para realizar a combinação.');
}
function headerMarkup() {
    const { count, total } = percent();
    const n = completedReactions(save, engine).length;
    return `<header class="topbar">
      <div class="brand"><img class="brand-mark" src="${BRAND_ICON}" alt=""><strong>mineralchemy</strong></div>
      <nav class="top-actions" aria-label="Menu do jogo">
        <div class="progress" aria-label="${count} de ${total} minerais descobertos"><span class="progress-label">Minerais</span><b>${count}<span> / ${total}</span></b><span class="progress-track" aria-hidden="true"><span style="width:${total ? Math.round(count / total * 100) : 0}%"></span></span></div>
        <button type="button" class="top-button paths-trigger" data-action="paths" aria-label="Ver trilhas mineralógicas"><span class="nav-icon" aria-hidden="true">⇄</span> Trilhas</button>
        <button type="button" class="top-button history-trigger" data-action="history" aria-label="Reações realizadas"><span class="nav-icon" aria-hidden="true">≋</span> Reações <span class="history-count" aria-hidden="true">${n}</span></button>
        <button type="button" class="top-button top-help" data-action="help"><span class="nav-icon" aria-hidden="true">?</span> Ajuda</button>
        <button type="button" class="top-button" data-action="collection" aria-label="Abrir catálogo de descobertas"><span class="nav-icon" aria-hidden="true">▦</span> Atlas</button>
      </nav>
    </header>`;
}
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
        const celebrating = discoveryIds.length > 0;
        const discoveryLabel = discoveryIds.length === 1 ? 'Mineral descoberto' : `${discoveryIds.length} minerais descobertos`;
        const bursts = celebrating ? '<span class="discovery-burst" aria-hidden="true"></span><span class="discovery-burst" aria-hidden="true"></span><span class="discovery-burst" aria-hidden="true"></span>' : '';
        const others = discoveryIds.slice(1);
        const additional = others.length ? `<div class="discovery-also"><b>Também descobertos</b>${reactionFlowMarkup(others)}</div>` : '';
        const footer = celebrating
            ? '<footer class="discovery-footer"><button type="button" class="primary" data-action="close">Voltar à bancada</button><p class="discovery-keyboard">Pressione qualquer tecla para voltar.</p></footer>'
            : `<div class="dialog-buttons detail-actions"><button type="button" class="primary" data-action="use-detail" data-id="${esc(present.id)}">Adicionar à bancada</button><button type="button" class="secondary" data-action="trail-focus" data-id="${esc(present.id)}">Continuar a partir deste material</button>
              ${detailOrigin ? `<button type="button" class="text-button detail-back" data-action="detail-back">${detailOrigin.modal === 'collection' ? 'Voltar ao atlas' : 'Voltar às trilhas'}</button>` : ''}
            </div>`;
        return `<div class="shade"${celebrating ? '' : ' data-action="close-shade"'}><section class="dialog detail-dialog${celebrating ? ' discovery-dialog' : ''}" role="dialog" aria-modal="true" aria-label="${celebrating ? `Descoberta · ${esc(present.name)}` : 'Detalhes do material'}"><div class="detail-dismiss"><button type="button" class="close" data-action="close" aria-label="Fechar">×</button></div>
          <div class="detail-hero">
            <div class="detail-illustration">${bursts}<div class="detail-orb" style="${styleFor(present)}" aria-hidden="true">${iconMarkup(present)}</div></div>
            <div class="detail-identity">
              ${celebrating ? `<p class="overline discovery-label">${discoveryLabel}</p>` : ''}
              <p class="overline">${esc(present.kind === 'agent' ? 'Agente' : present.family)}</p>
              <h2>${esc(present.name)}</h2>
              <div class="detail-formula">${esc(present.formula)}</div>
              <p class="material-type">${esc(MATERIAL_LABELS[materialType(present)])}</p>
            </div>
          </div>
          <p class="detail-description">${esc(present.description)}</p>${additional}${routes}
          <div class="detail-foot">${possibleReactionCount} ${possibleReactionCount === 1 ? 'rota cadastrada' : 'rotas cadastradas'} com este material</div>
          ${footer}
        </section></div>`;
    }
    if (modal === 'help')
        return `<div class="shade" data-action="close-shade"><section class="dialog" role="dialog" aria-modal="true" aria-label="Como jogar"><button class="close" data-action="close" aria-label="Fechar">×</button><h2>Como jogar</h2><ol class="help-flow"><li><b>Escolha duas peças.</b> Clique ou toque nos materiais da coleção para colocá-los na bancada.</li><li><b>Combine.</b> Use <b>Reagir</b> ou solte uma peça sobre a outra. A primeira descoberta de cada mineral abre a ficha.</li><li><b>Continue explorando.</b> Em <b>Trilhas</b>, escolha um material e veja pistas para combinar com ele ou obter o parceiro que falta.</li></ol><p class="help-note">As fichas e o histórico indicam quando uma combinação representa uma associação didática ou um processo que depende das condições do meio.</p><div class="shortcut-guide"><b>Atalhos</b><div><kbd>Digitar</kbd> inicia a busca da coleção lateral · <kbd>Ctrl+K</kbd> foca a busca · <kbd>Enter</kbd> adiciona o primeiro resultado.</div><div><kbd>Ctrl+Enter</kbd> reage · <kbd>Delete</kbd> limpa a bancada · <kbd>Tab</kbd> e <kbd>Shift+Tab</kbd> percorrem os controles · <kbd>←</kbd>/<kbd>→</kbd> mudam a categoria da janela aberta · <kbd>Esc</kbd> fecha a janela ou limpa a busca lateral.</div><div>Em buscas e campos editáveis, as setas continuam movendo o cursor. O jogo salva o progresso neste navegador.</div></div><div class="progress-tools"><h3>Progresso da partida</h3><div class="dialog-buttons"><button type="button" class="secondary" data-action="export-progress">Exportar progresso</button></div><label for="importProgress">Restaurar progresso</label><input id="importProgress" type="file" accept=".json,application/json"><p role="status">${esc(importNotice)}</p>${pendingImport ? '<button type="button" class="primary" data-action="confirm-import">Confirmar restauração</button>' : ''}</div><button class="primary" data-action="close">Voltar ao jogo <span>→</span></button></section></div>`;
    if (modal === 'reset')
        return `<div class="shade" data-action="close-shade"><section class="dialog" role="dialog" aria-modal="true" aria-label="Reiniciar descobertas"><button class="close" data-action="close" aria-label="Fechar">×</button><p class="overline">NOVA PARTIDA</p><h2>Reiniciar a partida?</h2><p>Os minerais descobertos, as reações registradas e as peças da bancada serão apagados deste navegador. Esta ação não pode ser desfeita.</p><div class="dialog-buttons"><button class="secondary" data-action="close">Cancelar</button><button class="danger" data-action="confirm-reset">Reiniciar jogo</button></div></section></div>`;
    if (modal === 'paths')
        return pathsMarkup();
    if (modal === 'history') {
        const entries = completedReactions(save, engine);
        return `<div class="shade" data-action="close-shade"><section class="dialog dialog-wide history-dialog" role="dialog" aria-modal="true" aria-label="Histórico de reações"><button class="close" data-action="close" aria-label="Fechar">×</button><h2>Reações realizadas <span class="muted">${entries.length}</span></h2><p class="history-intro">Busque uma combinação feita na bancada. Cada registro mostra as peças usadas e, quando disponível, a equação de referência com as condições do processo.</p>${historyGroupMarkup()}<div class="history-filters">${historyFilterMarkup()}</div><label class="search history-search"><span>⌕</span><input id="historySearch" value="${esc(historySearch)}" type="search" placeholder="Buscar reação, componente ou produto" aria-label="Buscar nas reações realizadas" autocomplete="off"/></label><div id="historyResults" class="history-results">${historySectionsMarkup()}</div></section></div>`;
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
        return `<div class="shade" data-action="close-shade"><section class="dialog dialog-wide collection-dialog" role="dialog" aria-modal="true" aria-label="Coleção de minerais"><button class="close" data-action="close" aria-label="Fechar">×</button><h2>Atlas de descobertas <span class="muted">${count} / ${total}</span></h2><p class="collection-summary">Busque por nome, fórmula ou família. Selecione um mineral descoberto para abrir a ficha.</p><div class="collection-topics">${topicStats.map(({ topic, discovered, total }) => `<button type="button" class="collection-topic ${collectionTopic === topic.id ? 'selected' : ''}" data-action="collection-topic" data-topic="${topic.id}" aria-pressed="${collectionTopic === topic.id ? 'true' : 'false'}"><span>${topic.label}</span><b>${discovered} / ${total}</b></button>`).join('')}</div><label class="search collection-search"><span>⌕</span><input id="collectionSearch" value="${esc(collectionSearch)}" type="search" placeholder="Buscar por mineral, fórmula ou família" aria-label="Buscar no atlas mineralógico" autocomplete="off"/></label><p class="collection-topic-summary">Exibindo <b>${summary.discovered} / ${summary.total}</b> minerais em <b>${esc(summary.topic.label)}</b>.</p>${visibleSections.length ? `<div class="collection-sections">${visibleSections.map(({ section, total, discovered, visibleItems }) => `<section class="collection-section"><div class="collection-section-head"><div><h3>${esc(section.label)}</h3><p>${discovered} descobertos · ${total - discovered} restantes</p></div><span>${discovered} / ${total}</span></div><div class="collection-grid">${visibleItems.map(p => collectionTileMarkup(p, acquired.has(p.id))).join('')}</div></section>`).join('')}</div>` : `<div class="collection-empty">Nenhum mineral corresponde à busca e à categoria selecionadas.</div>`}<button class="text-button" data-action="reset">Reiniciar descobertas</button></section></div>`;
    }
    return '';
}
function mainMarkup() {
    const acquired = knownItems();
    const library = `<aside class="library"><div class="library-heading"><h2>Coleção <span>${acquired.length}</span></h2></div><label class="search"><span>⌕</span><input id="catalogSearch" value="${esc(search)}" type="search" placeholder="Buscar material ou fórmula" aria-label="Buscar material na coleção lateral" autocomplete="off"/></label><div class="filters" role="group" aria-label="Filtrar materiais">${Object.entries({ all: 'Tudo', ion: 'Íons', mineral: 'Minerais', agent: 'Agentes', compound: 'Compostos' }).map(([id, label]) => `<button type="button" data-action="filter" data-filter="${id}" aria-pressed="${filter === id}" class="${filter === id ? 'selected' : ''}">${label}</button>`).join('')}</div><div id="libraryItems" class="library-items">${libraryMarkup()}</div></aside>`;
    const board = `<main class="workspace">
      <div class="workspace-heading"><h1>Bancada</h1><div class="board-actions">
        <span id="pieceCount"></span>
        <button type="button" data-action="react" class="clear-button board-react" title="Reagir (Ctrl+Enter)" aria-label="Reagir as peças da bancada"><span aria-hidden="true">⚗</span> Reagir</button>
        <button type="button" data-action="clear" class="clear-button" title="Limpar (Delete)"><span aria-hidden="true">↺</span> Limpar</button>
      </div></div>
      <div id="boardTrailLinks" class="board-trail-links" aria-live="polite">${boardTrailMarkup()}</div>
      <div id="board" class="board" role="region" aria-label="Bancada">${pieces.map(pieceMarkup).join('')}
        <div id="boardEmpty" class="board-empty ${pieces.length ? 'hidden' : ''}">
          <div class="empty-illustration" aria-hidden="true"><span>Ca²⁺</span><b>+</b><span>CO₃²⁻</span></div>
          <h2>Combine duas peças</h2>
          <p>Escolha materiais na coleção e use <strong>Reagir</strong>, ou solte uma peça sobre a outra.</p>
          ${save.recorded.length ? '' : '<p class="first-pair">Para começar, tente cálcio e carbonato.</p>'}
        </div>
      </div>
    </main>`;
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
    const focusedPiece = document.activeElement?.dataset?.instance;
    board.querySelectorAll('.piece').forEach(e => e.remove());
    const empty = board.querySelector('#boardEmpty');
    empty?.classList.toggle('hidden', pieces.length > 0);
    board.insertAdjacentHTML('afterbegin', pieces.map(pieceMarkup).join(''));
    const count = document.querySelector('#pieceCount');
    if (count)
        count.textContent = `${pieces.length} ${pieces.length === 1 ? 'peça' : 'peças'}`;
    if (focusedPiece) board.querySelector(`[data-instance="${focusedPiece}"]`)?.focus({ preventScroll: true });
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
function addPiece(itemId, saveAfterAdd = true) {
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
        count.textContent = `${pieces.length} ${pieces.length === 1 ? 'peça' : 'peças'}`;
    if (missingPairIds.length) {
        missingPairIds = [];
        updateBoardTrailLinks();
    }
    if (saveAfterAdd) persistSession();
    return p;
}

function reportUnregisteredPair(a, b) {
    missingPairIds = [...new Set([a.itemId, b.itemId])];
    updateBoardTrailLinks();
}
function reactBoard(openingKey) {
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
    if (!r) { reportUnregisteredPair(pieces[0], pieces[1]); return false; }
    combine(pieces[0], pieces[1], r, openingKey);
    return true;
}
function clearBoard() {
    pieces = [];
    missingPairIds = [];
    persistSession();
    updateBoardDom();
    updateBoardTrailLinks();
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
function reactDroppedPiece(p, pointerType) {
    const target = findCollision(pieces, p.instanceId, p.x, p.y, 76);
    if (!target)
        return false;
    const reaction = resolvePair(pairs, p.itemId, target.itemId);
    if (!reaction) {
        reportUnregisteredPair(p, target);
        return false;
    }
    if (pointerType === 'touch') {
        // Mantenha a peça capturada no DOM até o navegador terminar o gesto.
        setTimeout(() => {
            if (!active && !modal && !detailId && pieces.includes(p) && pieces.includes(target)) {
                combine(p, target, reaction, null, true);
            }
        }, 0);
    } else {
        combine(p, target, reaction, null, true);
    }
    return true;
}
function combine(a, b, reaction, openingKey = null, fromDrop = false) {
    const newSave = discover(save, reaction, engine);
    save = newSave.save;
    const newPlayables = newSave.newIds.filter(id => isPlayableCard(item(id)));
    recentDiscoveries = newPlayables;
    discoveryIds = newPlayables.filter(id => item(id)?.kind === 'mineral');
    missingPairIds = [];
    const { width, height } = boardSize();
    const x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
    pieces = pieces.filter(x => x.instanceId !== a.instanceId && x.instanceId !== b.instanceId);
    const products = makeBoardProducts(reaction.outputs, x, y, width, height, nextInstance);
    nextInstance += products.length;
    pieces.push(...products);
    persistSession();
    if (active?.origin === 'shelf') search = '';
    active = null;
    if (discoveryIds.length) {
        modal = null;
        detailId = discoveryIds[0];
        const product = products.find(p => p.itemId === detailId);
        dialogReturnFocus = { selector: fromDrop && product ? `[data-instance="${product.instanceId}"]` : '[data-action="react"]' };
        if (openingKey) consumedKeys.add(openingKey);
    }
    render();
    if (!discoveryIds.length) {
        const names = reaction.outputs.map(id => item(id)?.name ?? id).join(' + ');
        notify(newPlayables.length ? `Nova descoberta: ${newPlayables.map(id => item(id).name).join(' + ')}` : `Resultado: ${names}`, newPlayables.length > 0);
    }
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
            missingPairIds = [];
            updateBoardDom();
            updateBoardTrailLinks();
            persistSession();
            if (state.origin === 'board') notify('Peça removida da bancada.');
            return;
        }
        if (state.origin === 'shelf') resetLibrarySearch();
        if (reactDroppedPiece(p, e.pointerType)) return;
    }
    else if (state.origin === 'board') {
        state.element.focus({ preventScroll: true });
        openDetails(p.itemId);
    }
    persistSession();
    if (state.origin === 'shelf' && !state.moved) resetLibrarySearch();
}
function openDetails(id) {
    if (!discovered().has(id) || !item(id)) return;
    detailOrigin = modal === 'collection' || modal === 'paths'
        ? { modal, scroll: document.querySelector('#modalRoot .dialog')?.scrollTop ?? 0 }
        : null;
    detailId = id;
    modal = null;
    updateModal();
}
function returnFromDetails() {
    if (!detailOrigin) return;
    const id = detailId;
    const { modal: parent, scroll } = detailOrigin;
    detailOrigin = null;
    detailId = null;
    modal = parent;
    updateModal(`[data-action="detail"][data-id="${id}"]`);
    const dialog = document.querySelector('#modalRoot .dialog');
    if (dialog) dialog.scrollTop = scroll;
}
function focusSelectorFor(element) {
    const { action, instance, item: itemId, id } = element?.dataset ?? {};
    if (element?.id === 'catalogSearch') return '#catalogSearch';
    if (instance) return `[data-instance="${instance}"]`;
    if (itemId) return `[data-item="${itemId}"]`;
    if (action === 'trail-resume') return '.board-trail-links [data-action="trail-resume"]';
    if (action === 'trail-focus' && id) return `.board-trail-links [data-action="trail-focus"][data-id="${id}"]`;
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
    detailOrigin = null;
    discoveryIds = [];
    pendingProgressFile = null;
    pendingImport = null;
    importNotice = '';
    pendingTrailPair = '';
    trailNotice = '';
    updateModal();
    updateBoardTrailLinks();
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
        case 'trail-resume':
            openContinuation();
            break;
        case 'trail-focus':
            openContinuation(el.dataset.id);
            break;
        case 'trail-mode':
            trailMode = el.dataset.mode === 'thematic' ? 'thematic' : 'continuation';
            pendingTrailPair = '';
            trailNotice = '';
            updateModal(`[data-mode="${trailMode}"]`);
            break;
        case 'trail-hint': {
            const id = el.dataset.id;
            const next = Math.min((trailHints.get(id) ?? 0) + 1, 3);
            trailHints.set(id, next);
            pendingTrailPair = '';
            const control = next === 3 ? '.trail-result' : '[data-action="trail-hint"]';
            const selector = `[data-trail-reaction="${id}"] ${control}`;
            updateModal(selector);
            document.querySelector(selector)?.scrollIntoView?.({ block: 'nearest' });
            break;
        }
        case 'trail-prepare':
            prepareTrailPair(el.dataset.id);
            break;
        case 'trail-replace':
            if (pendingTrailPair) prepareTrailPair(pendingTrailPair, true);
            break;
        case 'trail-keep':
            pendingTrailPair = '';
            updateModal('#trailFocus');
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
            resetContinuation();
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
            resetContinuation();
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
        case 'detail-back':
            returnFromDetails();
            break;
    }
}
function updateHistoryResults() { const root = document.querySelector('#historyResults'); if (root)
    root.innerHTML = historySectionsMarkup(); }
function updateLibrary() {
    const panel = document.querySelector('#libraryItems');
    if (panel) panel.innerHTML = libraryMarkup();
    for (const button of document.querySelectorAll('.filters button')) {
        const selected = button.dataset.filter === filter;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
    }
}
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
app.addEventListener('touchend', e => {
    if (!discoveryIds.length || e.touches.length || !(e.target instanceof Element)) return;
    const close = e.target.closest('.discovery-dialog [data-action="close"]');
    const touch = e.changedTouches[0];
    if (!close || !touch || !close.contains(document.elementFromPoint(touch.clientX, touch.clientY))) return;
    // Após o arraste o navegador pode suprimir o clique derivado do toque.
    e.preventDefault();
    closeDialog();
}, { passive: false });
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
    if (e.target?.id === 'trailFocus') {
        setTrailFocus(e.target.value);
        updateModal('#trailFocus');
    }
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
    const physicalKey = e.code || e.key;
    if (consumedKeys.has(physicalKey)) {
        e.preventDefault();
        return;
    }
    const key = String(e.key ?? '').toLowerCase();
    const target = e.target;
    const editing = !!target && (target.isContentEditable || ['INPUT','TEXTAREA','SELECT'].includes(target.tagName));
    const noModifiers = !e.ctrlKey && !e.metaKey && !e.altKey;
    if (discoveryIds.length) {
        if (noModifiers && !['Shift', 'Control', 'Alt', 'AltGraph', 'Meta', 'CapsLock'].includes(e.key) && !/^F\d+$/.test(e.key)) {
            e.preventDefault();
            consumedKeys.add(physicalKey);
            closeDialog();
        }
        return;
    }
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
        e.preventDefault();
        if (!e.repeat) reactBoard(physicalKey);
        return;
    }
    if (noModifiers && (e.key === 'Enter' || e.key === ' ') && target?.dataset?.action === 'react') {
        e.preventDefault();
        if (!e.repeat) reactBoard(physicalKey);
        return;
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
window.addEventListener('keyup', e => {
    if (consumedKeys.delete(e.code || e.key)) e.preventDefault();
}, true);
window.addEventListener('blur', () => consumedKeys.clear());
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
        playables = [...engine.cards, ...agents.filter(a => specialAgents.has(a.id)).map(a => ({ id: a.id, name: a.name, formula: 'Agente ambiental', description: a.description, family: 'Processo geológico', kind: 'agent', color: '#80acc6' }))].filter(isPlayableCard);
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
