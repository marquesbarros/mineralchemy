const MATERIAL_TYPES = {
    mineral: 'especie-mineral',
    assemblage: 'associacao-mineral',
    ion: 'ion',
    molecule: 'especie-quimica',
    reagent: 'especie-quimica',
    aqueous: 'especie-aquosa',
    agent: 'agente-ambiental',
};
const MATERIAL_LABELS = {
    'especie-mineral': 'Espécie mineral',
    'faixa-composicional': 'Faixa composicional',
    'grupo-mineral': 'Grupo ou nome coletivo',
    'associacao-mineral': 'Associação mineral',
    'especie-quimica': 'Espécie química',
    'especie-aquosa': 'Espécie aquosa',
    'agente-ambiental': 'Agente ambiental',
    ion: 'Íon',
};
const PROCESS_LABELS = {
    'associacao-didatica': 'Associação didática',
    'sintese-didatica': 'Síntese didática',
    'troca-composicional': 'Troca composicional',
    'montagem-em-etapas': 'Reação em etapas',
    'alteracao-hidrotermal': 'Alteração hidrotermal',
    'intemperismo': 'Intemperismo',
    'resfriamento': 'Resfriamento',
    'cristalizacao-magmatica': 'Cristalização magmática',
    'equilibrio-de-fases': 'Equilíbrio de fases',
    'transformacao-termica': 'Transformação térmica',
    'alteracao-por-agente': 'Alteração por agente',
    'alteracao-aquosa': 'Alteração aquosa',
    'reacao-metamorfica': 'Reação metamórfica',
    'reacao-de-componentes': 'Reação entre componentes',
    'transformacao-mineral': 'Transformação mineral',
    'oxirreducao': 'Oxirredução',
};
const REVIEW_LABELS = {
    arquivada: 'Rota arquivada',
    didatica: 'Representação didática',
    condicional: 'Transformação condicional',
    provisoria: 'Rota provisória',
    pendente: 'Revisão científica pendente',
};

function materialType(card) {
    return card?.materialType ?? MATERIAL_TYPES[card?.kind] ?? 'especie-quimica';
}

function parseEquationTerm(text) {
    const match = /^(?:(\d+)\s+)?(.+)$/.exec(text.trim());
    if (!match) return null;
    const coefficient = Number(match[1] ?? 1);
    let species = match[2].replace(/^[α-ω]-/u, '')
        .replace(/(?:\((?:aq|s|l|g)\)|\s+\([^()]+\))$/u, '');
    const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    const ion = /([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/u.exec(species);
    const charge = ion
        ? Number([...ion[1]].map(char => superscripts.indexOf(char)).join('') || 1) * (ion[2] === '⁻' ? -1 : 1)
        : 0;
    if (ion) species = species.slice(0, ion.index);
    const elements = {};
    if (species === 'e' && charge === -1) return { coefficient, species: match[2], charge, elements };
    for (const component of species.split('·')) {
        const part = /^(\d+)?(.+)$/.exec(asciiFormula(component));
        if (!part) return null;
        const counts = formulaElements(part[2]);
        if (!counts || !Object.keys(counts).length) return null;
        for (const [element, amount] of Object.entries(counts)) {
            elements[element] = (elements[element] ?? 0) + amount * Number(part[1] ?? 1);
        }
    }
    return { coefficient, species: match[2], charge, elements };
}

function parseReferenceEquation(equation) {
    if (typeof equation !== 'string') return null;
    const sides = equation.split(/\s+([→⇌])\s+/u);
    if (sides.length !== 3) return null;
    const reactants = sides[0].split(/\s+\+\s+/u).map(parseEquationTerm);
    const products = sides[2].split(/\s+\+\s+/u).map(parseEquationTerm);
    if ([...reactants, ...products].includes(null)) return null;
    const hasElectron = [...reactants, ...products].some(term => term.species === 'e⁻');
    const difference = new Map();
    for (const [terms, sign] of [[reactants, 1], [products, -1]]) {
        for (const { coefficient, charge, elements } of terms) {
            for (const [element, amount] of Object.entries({ ...elements, charge })) {
                difference.set(element, (difference.get(element) ?? 0) + amount * coefficient * sign);
            }
        }
    }
    return {
        equation, arrow: sides[1], reactants, products,
        kind: hasElectron ? 'semirreacao' : sides[1] === '⇌' ? 'equilibrio' : 'equacao',
        balance: [...difference.values()].every(amount => amount === 0) ? 'balanced' : 'unbalanced',
    };
}

function routeProcess(reaction, byCard) {
    if (reaction.process) return reaction.process;
    if (reaction.id.startsWith('prepare-')) return 'associacao-didatica';
    if (reaction.id.startsWith('complete-')) return 'montagem-em-etapas';
    if (reaction.id.startsWith('meta-')) return 'reacao-metamorfica';
    if (reaction.id.startsWith('r-olivina-')) return 'troca-composicional';
    const factors = [...reaction.inputs, reaction.agent];
    if (factors.includes('hydrothermal')) return 'alteracao-hidrotermal';
    if (factors.includes('rain')) return 'intemperismo';
    if (factors.includes('air') || factors.includes('reduction')) return 'oxirreducao';
    if (factors.includes('volcanism')) return 'cristalizacao-magmatica';
    if (factors.includes('cooling')) return 'resfriamento';
    if (factors.includes('pressure') || factors.includes('decompression')) return 'equilibrio-de-fases';
    if (factors.includes('heat')) return 'transformacao-termica';
    if (factors.includes('water')) return 'alteracao-aquosa';
    if (reaction.agent) return 'alteracao-por-agente';
    if (reaction.mechanic === 'evolution') return 'associacao-didatica';
    if (!reaction.outputs.some(id => byCard.get(id)?.kind === 'mineral')) return 'reacao-de-componentes';
    if (reaction.inputs.some(id => byCard.get(id)?.kind === 'mineral')) return 'transformacao-mineral';
    return 'sintese-didatica';
}

function routeScience(reaction, byCard) {
    const process = routeProcess(reaction, byCard);
    const original = parseReferenceEquation(reaction.equation);
    const routeSpecific = reaction.historicalSnapshot ? null : METAMORPHIC_ROUTE_EQUATIONS[reaction.id];
    const candidate = original ?? parseReferenceEquation(routeSpecific);
    const reference = candidate?.balance === 'balanced' && !reaction.id.startsWith('prepare-') ? candidate : null;
    const reviewStatus = reaction.retired ? 'arquivada'
        : reaction.reviewStatus ?? (reaction.id.startsWith('prepare-') || reaction.mechanic === 'evolution' || reaction.generatedBy === 'family'
            ? 'didatica' : reaction.agent || reaction.environmentalInputs?.length ? 'condicional' : 'pendente');
    const evidence = reference
        ? reaction.generatedBy === 'family' ? 'balanco_ideal' : reference.kind
        : 'didatica';
    const initialSources = reaction.sources ?? (reaction.source ? [{ url: reaction.source, claim: '' }] : []);
    const citations = LITERATURE.routes[reaction.id.replace(/^complete-/, '')] ?? [];
    const sources = [...initialSources, ...citations.map(({ work, locator, claim }) => ({
        ...LITERATURE.works[work], locator, claim,
    }))];
    return {
        process, reviewStatus, evidence, reference, sources,
        equationIssue: candidate?.balance === 'unbalanced' ? 'Balanço de massa ou carga a revisar.' : null,
        conditions: reaction.conditions ?? '',
        environmentalInputs: reaction.environmentalInputs ?? [],
    };
}
