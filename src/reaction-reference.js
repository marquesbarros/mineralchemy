const REACTION_CATALOG_SECTIONS = Object.freeze([
    { id: 'formation', label: 'Formação de minerais', description: 'Sínteses e montagens didáticas a partir de componentes' },
    { id: 'transformations', label: 'Transformações mineralógicas', description: 'Reações que utilizam minerais já formados' },
    { id: 'agents', label: 'Alterações por agentes', description: 'Reações acionadas por água, fluidos, temperatura ou condições ambientais' },
    { id: 'stages', label: 'Associações em etapas', description: 'Preparação de associações e conclusão de reações com múltiplos reagentes' },
    { id: 'components', label: 'Reações de componentes', description: 'Espécies químicas, íons e outras transformações sem mineral como produto' },
]);
const REACTION_CATALOG_FILTERS = Object.freeze([
    { id: 'all', label: 'Tudo' },
    { id: 'formation', label: 'Formações' },
    { id: 'transformations', label: 'Transformações' },
    { id: 'metamorphism', label: 'Metamorfismo' },
    { id: 'fluids', label: 'H₂O e fluidos' },
    { id: 'redox', label: 'Oxirredução' },
    { id: 'agents', label: 'Agentes' },
    { id: 'stages', label: 'Em etapas' },
    { id: 'components', label: 'Componentes' },
]);
/** Rotas triplas com preparação têm contrapartida executável em duas etapas. */
function reactionCatalogEligible(reaction) {
    return !(reaction.staging?.length === 2 && reaction.inputs.length === 3);
}
/** Classificação exclusiva para o agrupamento da lista. */
function reactionCatalogSection(reaction, byCard) {
    if (reaction.id.startsWith('prepare-assemblage-') || reaction.id.startsWith('complete-meta-'))
        return 'stages';
    if (reaction.kind === 'alteration')
        return 'agents';
    const hasProductMineral = reaction.outputs.some(id => byCard.get(id)?.kind === 'mineral');
    if (!hasProductMineral)
        return 'components';
    return reaction.inputs.some(id => byCard.get(id)?.kind === 'mineral') ? 'transformations' : 'formation';
}
/** Rótulos temáticos independentes, sem inferir rotas geológicas que os dados não sustentam. */
function reactionCatalogTags(reaction, byCard) {
    const primary = reactionCatalogSection(reaction, byCard);
    const tags = new Set(['all', primary]);
    const allInputs = [...reaction.inputs, ...(reaction.agent ? [reaction.agent] : []), ...(reaction.environmentalInputs ?? [])];
    const allIds = [...allInputs, ...reaction.outputs];
    if (reaction.id.startsWith('meta-') || reaction.id.startsWith('complete-meta-') || /metam[oó]rf|alta press[aã]o|press[aã]o e temperatura/i.test(reaction.conditions ?? ''))
        tags.add('metamorphism');
    if (allIds.some(id => ['water', 'co2', 'rain', 'hydrothermal'].includes(id)))
        tags.add('fluids');
    if (allInputs.some(id => ['air', 'reduction'].includes(id)) || /(?:oxidation|oxida|reduction|redu[cç]|redox)/i.test(reaction.id))
        tags.add('redox');
    if (reaction.kind === 'alteration')
        tags.add('agents');
    if (reaction.id.startsWith('prepare-assemblage-') || reaction.id.startsWith('complete-'))
        tags.add('stages');
    return [...tags];
}

/** Balanços de componentes registrados para rotas específicas. */
const METAMORPHIC_ROUTE_EQUATIONS = Object.freeze({
    'i-pair-aluminium3-quartz': 'Al₂O₃ + SiO₂ → Al₂SiO₅',
    'v08-nepheline-2': 'NaAlSi₂O₆·H₂O → NaAlSiO₄ + SiO₂ + H₂O',
    'i-agent-grunerite-heat': 'Fe₇Si₈O₂₂(OH)₂ → 7 FeSiO₃ + SiO₂ + H₂O',
    'i-agent-ferroactinolite-heat': 'Ca₂Fe₅Si₈O₂₂(OH)₂ → 2 CaFeSi₂O₆ + 3 FeSiO₃ + SiO₂ + H₂O',
    'i-agent-dolomite-heat': 'CaMg(CO₃)₂ → CaCO₃ + MgO + CO₂',
    'i-agent-sodalite-heat': 'Na₈Al₆Si₆O₂₄Cl₂ → 6 NaAlSiO₄ + 2 NaCl',
    'i-pair-paragonite-quartz': 'NaAl₃Si₃O₁₀(OH)₂ + SiO₂ → NaAlSi₃O₈ + Al₂SiO₅ + H₂O',
    'v08-rutile-2': '4 FeTiO₃ + O₂ → 4 TiO₂ + 2 Fe₂O₃',
    'v08-azurite-1': '3 Cu₂CO₃(OH)₂ + CO₂ → 2 Cu₃(CO₃)₂(OH)₂ + H₂O',
    'i-pair-siderite-quartz': '7 FeCO₃ + 8 SiO₂ + H₂O → Fe₇Si₈O₂₂(OH)₂ + 7 CO₂',
    'i-pair-enstatite-co2': 'MgSiO₃ + CO₂ → MgCO₃ + SiO₂',
    'i-pair-diopside-co2': 'CaMgSi₂O₆ + 2 CO₂ → CaCO₃ + MgCO₃ + 2 SiO₂',
    'i-pair-tremolite-co2': 'Ca₂Mg₅Si₈O₂₂(OH)₂ + 7 CO₂ → 2 CaCO₃ + 5 MgCO₃ + 8 SiO₂ + H₂O',
    'i-pair-grossular-kyanite': 'Ca₃Al₂(SiO₄)₃ + 2 Al₂SiO₅ + SiO₂ → 3 CaAl₂Si₂O₈',
    ...Object.fromEntries(['andalusite', 'kyanite', 'sillimanite'].flatMap(mineral => [
        [`i-pair-${mineral}-sodium_ion`, 'Na₂O + Al₂O₃ + 2 Al₂SiO₅ + 4 SiO₂ + 2 H₂O → 2 NaAl₃Si₃O₁₀(OH)₂'],
        [`i-pair-${mineral}-potassium_ion`, 'K₂O + Al₂O₃ + 2 Al₂SiO₅ + 4 SiO₂ + 2 H₂O → 2 KAl₃Si₃O₁₀(OH)₂'],
        [`i-pair-${mineral}-calcium_ion`, '3 CaO + Al₂O₃ + 3 SiO₂ → Ca₃Al₂(SiO₄)₃'],
        [`i-pair-${mineral}-orthoclase`, 'KAlSi₃O₈ + Al₂SiO₅ + H₂O → KAl₃Si₃O₁₀(OH)₂ + SiO₂'],
        [`i-pair-${mineral}-albite`, 'NaAlSi₃O₈ + Al₂SiO₅ + H₂O → NaAl₃Si₃O₁₀(OH)₂ + SiO₂'],
    ])),
});
