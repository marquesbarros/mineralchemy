function auditedReaction(r) {
    if (HYDRIC_RETIRED.has(r.id)) return { ...r, retired: true };
    if (HYDRIC_OVERRIDES[r.id]) return { ...r, ...HYDRIC_OVERRIDES[r.id] };
    if (r.id === 's-goethite') return {
        ...r, inputs: ['hematite', 'rain'],
        summary: 'Alteração em ambiente de intemperismo úmido, com dissolução, reprecipitação e reequilíbrio de oxi-hidróxidos férricos.',
        conditions: 'Água meteórica, condições redox e pH adequados; hematita não se converte automaticamente em goethita por contato com água.',
        source: 'https://pubs.usgs.gov/pp/0650b/report.pdf'
    };
    if (r.id === 'v08-alt-iron3-reduction') return {
        ...r, outputs: ['iron2'], equation: 'Fe³⁺ + e⁻ → Fe²⁺',
        summary: 'Redução do ferro férrico a ferro ferroso, não produção direta de ferro nativo.',
        conditions: 'Semirreação Fe³⁺/Fe²⁺. Exige fonte de elétrons; a especiação depende de Eh e pH.',
        source: 'https://pubs.usgs.gov/wsp/1473/report.pdf'
    };
    return CATALOG_RETIRED_EXPLICIT.has(r.id) ? { ...r, retired: true } : r;
}
function auditIntuitiveReaction(r) {
    if (r.retired || !CATALOG_RETAINED_INTUITIVE.has(r.id)) return { ...r, retired: true };
    if (r.id === 'i-pair-quartz-forsterite') return {
        ...r, equation: 'Mg₂SiO₄ + SiO₂ ⇌ 2 MgSiO₃',
        conditions: 'Balanço no sistema forsterita–sílica. Na cristalização reacional, a forsterita reage com o líquido apropriado; a peça Quartzo representa o componente SiO₂.',
        reviewStatus: 'condicional',
    };
    if (r.id === 'i-pair-leucite-quartz') return {
        ...r, equation: 'KAlSi₂O₆ + SiO₂ ⇌ KAlSi₃O₈',
        conditions: 'Relação no sistema KAlSiO₄–SiO₂ a baixa pressão. A carta Ortoclásio representa a composição KAlSi₃O₈; a fase potássica de alta temperatura no diagrama é a sanidina.',
    };
    if (r.id === 'i-agent-stishovite-decompression') return {
        ...r, summary: 'A descompressão retira a estishovita de seu campo de estabilidade.',
        conditions: 'A trajetória de pressão e temperatura e a cinética determinam se a fase de alta pressão persiste ou se transforma. A carta Quartzo representa o polimorfo estável em condições crustais usuais.',
    };
    return r;
}

const subDigits = '₀₁₂₃₄₅₆₇₈₉';
const asciiFormula = (x) => [...x].map(c => subDigits.includes(c) ? String(subDigits.indexOf(c)) : c).join('');
/** Stoichiometry parser used only on solid, charge-neutral formulae in family templates. */
function formulaElements(input) {
    const formula = asciiFormula(input);
    if (!/^[A-Za-z0-9()]+$/.test(formula))
        return null;
    const tokens = formula.match(/[A-Z][a-z]?|[()]|\d+/g) ?? [];
    if (tokens.join('') !== formula)
        return null;
    const stack = [{}];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token === '(') {
            stack.push({});
            continue;
        }
        if (token === ')') {
            if (stack.length === 1)
                return null;
            const group = stack.pop();
            const next = tokens[i + 1];
            const factor = next && /^\d+$/.test(next) ? Number(tokens[++i]) : 1;
            for (const [el, count] of Object.entries(group))
                stack[stack.length - 1][el] = (stack[stack.length - 1][el] ?? 0) + count * factor;
            continue;
        }
        if (/^\d+$/.test(token))
            return null;
        const next = tokens[i + 1];
        const count = next && /^\d+$/.test(next) ? Number(tokens[++i]) : 1;
        stack[stack.length - 1][token] = (stack[stack.length - 1][token] ?? 0) + count;
    }
    return stack.length === 1 ? stack[0] : null;
}
/** Finds the smallest positive whole-number balance for a specified family phase. */
function balanceFormulae(inputs, outputs) {
    if (!inputs.length || !outputs.length || inputs.length > 3 || outputs.length > 2)
        return null;
    const parsedInputs = inputs.map(x => formulaElements(x.formula));
    const parsedOutputs = outputs.map(x => formulaElements(x.formula));
    if ([...parsedInputs, ...parsedOutputs].some(x => !x))
        return null;
    const keys = [...new Set([...parsedInputs, ...parsedOutputs].flatMap(x => Object.keys(x)))];
    let found = null;
    const recurse = (at, arr) => {
        if (at < inputs.length) {
            for (let k = 1; k <= 4; k++)
                recurse(at + 1, [...arr, k]);
            return;
        }
        for (let outExtra = 1; outExtra <= (outputs.length === 1 ? 1 : 4); outExtra++) {
            const b = outputs.length === 1 ? [1] : [1, outExtra];
            const good = keys.every(el => parsedInputs.reduce((n, p, i) => n + (p[el] ?? 0) * arr[i], 0) === parsedOutputs.reduce((n, p, i) => n + (p[el] ?? 0) * b[i], 0));
            if (!good)
                continue;
            const score = [...arr, ...b].reduce((a, b) => a + b, 0);
            if (!found || score < found.score)
                found = { a: arr, b, score };
        }
    };
    recurse(0, []);
    if (!found)
        return null;
    // TS flow analysis cannot infer mutation through recurse.
    const selected = found;
    const phrase = (cards, coefficients) => cards.map((c, i) => (coefficients[i] === 1 ? '' : `${coefficients[i]} `) + c.formula).join(' + ');
    return { equation: `${phrase(inputs, selected.a)} → ${phrase(outputs, selected.b)}`, inputCoefficients: selected.a, outputCoefficients: selected.b };
}
/** Produces explicit, traceable reactions from structural families and mass balance. */
function generateFamilyReactions(cards, rules) {
    const map = new Map(cards.map(x => [x.id, x]));
    const reactions = [];
    const phaseTargets = (family) => cards.filter(x => x.kind === 'mineral' && x.family === family);
    const maybeGenerate = (id, inputIds, outputIds, rule, summary, conditions) => {
        const inputCards = inputIds.map(x => map.get(x));
        const outputCards = outputIds.map(x => map.get(x));
        if ([...inputCards, ...outputCards].some(x => !x))
            return;
        const balance = balanceFormulae(inputCards, outputCards);
        if (!balance)
            return;
        reactions.push({ id: `r-${id}`, kind: 'synthesis', inputs: inputIds, outputs: outputIds, agent: null, equation: balance.equation, summary, conditions, source: rule.source, symbolic: true, generatedBy: 'family' });
    };
    for (const rule of rules.ternary) {
        for (const component of rule.componentOxides) {
            const selected = [rule.calciumOxide, component, rule.silica];
            for (const target of phaseTargets(rule.targetFamily)) {
                maybeGenerate(`${rule.id}-${component}-${target.id}`, selected, [target.id], rule, `Composição compatível com ${target.name.toLowerCase()}, um clinopiroxênio. A proporção dos reagentes é calculada a partir das fórmulas.`, 'Modelo estequiométrico de cristalização; a fase efetiva depende de temperatura, pressão, atividade de sílica e outras condições.');
            }
        }
    }
    for (const rule of rules.binary) {
        for (const m of rule.divalentOxides)
            for (const f of rule.trivalentOxides) {
                for (const target of phaseTargets(rule.targetFamily)) {
                    maybeGenerate(`${rule.id}-${m}-${f}-${target.id}`, [m, f], [target.id], rule, `A combinação de componentes óxidos corresponde à composição ideal da fase do grupo dos espinélios: ${target.name}.`, 'Modelo de balanço de óxidos. Não representa síntese espontânea à temperatura ambiente.');
                }
            }
    }
    for (const rule of rules.exchangeSeries) {
        const [left, right] = rule.endmembers;
        const [leftCarrier, rightCarrier] = rule.carrierOxides;
        maybeGenerate(`${rule.id}-${left}-para-${right}`, [left, rightCarrier], [right, leftCarrier], rule, `Troca formal de componentes Fe²⁺/Mg²⁺ na estrutura da série ${rule.id}. O produto excedente retorna ao meio.`, 'Representação da troca de componentes. Em rochas, substituições dependem de equilíbrio, transporte de massa e condições físico-químicas.');
        maybeGenerate(`${rule.id}-${right}-para-${left}`, [right, leftCarrier], [left, rightCarrier], rule, `Troca formal de componentes Fe²⁺/Mg²⁺ na estrutura da série ${rule.id}. O produto excedente retorna ao meio.`, 'Representação da troca de componentes. Em rochas, substituições dependem de equilíbrio, transporte de massa e condições físico-químicas.');
    }
    return reactions;
}

const generateIntuitiveRoutes = (() => {
const mineralogy = 'https://geo.libretexts.org/Bookshelves/Geology/Mineralogy_(Perkins_et_al.)/02:_Mineral_Chemistry/2.05:_Compositional_Variation_in_Minerals';
const framework = 'https://geo.libretexts.org/Bookshelves/Geology/Mineralogy_(Perkins_et_al.)/14:_Mineral_Descriptions/14.01:_Silicate_Class/14.1.01:_Silicate_Class_-_Framework_Silicates';
const weathering = 'https://geo.libretexts.org/Bookshelves/Geology/Environmental_Geology_(Earle)/10:_Weathering_Soil_and_Clay_Minerals/10.05:_Clay_Minerals';
const metapelite = 'https://utc.pressbooks.pub/mineralogy/chapter/metamorphic-reactions/';
const gAsp = 'https://www.science.smith.edu/~jbrady/petrology/metrocks-topics/conditions/conditions-page05.php';
const hornblendeAlteration = 'https://www.jstage.jst.go.jp/article/ganko1941/67/2/67_2_35/_article/-char/en';
const notes = {
    exchange: 'Enriquecimento composicional no sistema indicado. A troca exige aporte e remoção de componentes, conforme o equilíbrio mineralógico.',
    phase: 'Mudança de fase ou reorganização estrutural sob condições adequadas de pressão, temperatura ou atividade dos componentes.',
    fluid: 'Alteração em sistema aberto com fluidos; os reagentes e produtos ilustram fases representativas, não um balanço fechado de duas peças.',
    weathering: 'Intemperismo e lixiviação com disponibilidade ambiental de H₂O, CO₂ e O₂ conforme necessário. O produto é representativo.',
    redox: 'Transformação condicionada à fugacidade de oxigênio e a outros componentes do ambiente, não apenas à presença isolada do agente.',
    dissolve: 'Dissolução com transporte de íons e formação de espécies aquosas no meio. As peças produzidas não são coeficientes molares.',
    metamorphic: 'Reorganização mineralógica em metamorfismo progressivo ou retrógrado, com componentes disponíveis em sistema aberto.',
};
const ladders = [
    { members: ['forsterite', 'olivine', 'fayalite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Série Fo–Fa: Fe²⁺ aumenta e Mg²⁺ reduz o componente faialítico.', source: mineralogy },
    { members: ['enstatite', 'ferrosilite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Extremos Mg–Fe dos ortopiroxênios; troca no sítio octaédrico.', source: mineralogy },
    { members: ['diopside', 'augite', 'hedenbergite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Progressão composicional Ca–Mg–Fe do piroxênio.', source: mineralogy },
    { members: ['tremolite', 'actinolite', 'ferroactinolite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Série tremolita–actinolita com substituição Fe²⁺–Mg²⁺.', source: mineralogy },
    { members: ['magnesiohornblende', 'ferrohornblende'], forward: 'iron2', backward: 'magnesium_ion', note: 'Enriquecimento em Fe²⁺ ou Mg²⁺ na hornblenda.', source: mineralogy },
    { members: ['phlogopite', 'biotite', 'annite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Micas trioctaédricas de composição progressivamente mais ferrífera.', source: mineralogy },
    { members: ['muscovite', 'paragonite'], forward: 'sodium_ion', backward: 'potassium_ion', note: 'Substituição Na–K no sítio interlamelar de micas dioctaédricas.', source: mineralogy },
    { members: ['clinochlore', 'chamosite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Endmembers ricos em Mg ou Fe do grupo das cloritas.', source: mineralogy },
    { members: ['monticellite', 'kirschsteinite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Troca Fe²⁺–Mg²⁺ entre os polos cálcicos de olivina.', source: mineralogy },
    { members: ['pyrope', 'almandine'], forward: 'iron2', backward: 'magnesium_ion', note: 'Granadas Mg–Fe com substituição entre endmembers.', source: mineralogy },
    { members: ['almandine', 'spessartine'], forward: 'manganese2', backward: 'iron2', note: 'Substituição Fe²⁺–Mn²⁺ na granada.', source: mineralogy },
    { members: ['grossular', 'andradite'], forward: 'iron3', backward: 'aluminium3', note: 'Substituição Al³⁺–Fe³⁺ nos octaedros da granada.', source: mineralogy },
    { members: ['andradite', 'uvarovite'], forward: 'chromium3', backward: 'iron3', note: 'Substituição de Fe³⁺ por Cr³⁺ no subgrupo das granadas cálcicas.', source: mineralogy },
    { members: ['dravite', 'schorl'], forward: 'iron2', backward: 'magnesium_ion', note: 'Turmalinas com substituição Fe²⁺–Mg²⁺.', source: mineralogy },
    { members: ['spinel', 'hercynite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Polos de espinélio aluminoso rico em Mg ou Fe²⁺.', source: mineralogy },
    { members: ['magnesioferrite', 'magnetite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Troca de Mg²⁺–Fe²⁺ em espinélios férricos.', source: mineralogy },
    { members: ['dolomite', 'ankerite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Substituição de Fe²⁺ por Mg²⁺ em carbonatos dolomíticos.', source: mineralogy },
    { members: ['magnesite', 'siderite'], forward: 'iron2', backward: 'magnesium_ion', note: 'Composição dominante MgCO₃–FeCO₃, favorecida sob condições adequadas.', source: mineralogy },
    { members: ['fluorapatite', 'hydroxylapatite'], forward: 'hydroxide', backward: 'fluoride', note: 'Substituição de F⁻ por OH⁻ em apatitas, em meio reativo.', source: mineralogy },
    { members: ['albite', 'oligoclase', 'andesine', 'labradorite', 'bytownite', 'anorthite'], forward: 'calcium_ion', backward: 'sodium_ion', note: 'Aumento da fração An por troca acoplada CaAl ↔ NaSi; não basta adicionar Ca isoladamente.', source: framework },
    { members: ['barite', 'celestine'], forward: 'strontium2', backward: 'barium2', note: 'Substituição Sr²⁺–Ba²⁺ na estrutura dos sulfatos.', source: mineralogy },
];
/** Extra short paths supplement the long mineralogical progressions. */
const pairs = [
    { from: 'enstatite', with: 'fe', to: ['ferrosilite'], note: 'Enriquecimento do ortopiroxênio em ferro.' },
    { from: 'ferrosilite', with: 'mg', to: ['enstatite'], note: 'Enriquecimento do ortopiroxênio em magnésio.' },
    { from: 'forsterite', with: 'fe', to: ['olivine'], note: 'Enriquecimento da olivina em Fe.' },
    { from: 'fayalite', with: 'mg', to: ['olivine'], note: 'Enriquecimento da olivina em Mg.' },
    { from: 'olivine', with: 'mg', to: ['forsterite'], note: 'Direção mais magnesiana na solução sólida.' },
    { from: 'olivine', with: 'fe', to: ['fayalite'], note: 'Direção mais ferrífera na solução sólida.' },
    { from: 'albite', with: 'potassium_ion', to: ['orthoclase'], note: 'Metassomatismo potássico em feldspatos alcalinos.' },
    { from: 'orthoclase', with: 'sodium_ion', to: ['albite'], note: 'Albitização por fluido rico em Na.' },
    { from: 'kaolinite', with: 'quartz', to: ['pyrophyllite'], note: 'Disponibilidade de sílica para filossilicatos aluminosos.' },
    { from: 'nepheline', with: 'quartz', to: ['albite'], note: 'Adição de sílica ao feldspatoide pode favorecer albita.' },
    { from: 'leucite', with: 'quartz', to: ['orthoclase'], note: 'Maior atividade de sílica permite formar feldspato potássico.' },
    { from: 'orthoclase', with: 'water', to: ['muscovite'], note: 'Sericitização de feldspato potássico em ambiente com Al, H₂O e outras fases.' },
    { from: 'albite', with: 'water', to: ['paragonite'], note: 'Transformação sericítica em mica sódica sob condições adequadas.' },
    { from: 'muscovite', with: 'magnesium_ion', to: ['phlogopite'], note: 'Evolução do conjunto de micas em meio com disponibilidade de Mg.' },
    { from: 'muscovite', with: 'iron2', to: ['biotite'], note: 'Enriquecimento ferrífero de associações micáceas.' },
    { from: 'talc', with: 'potassium_ion', to: ['phlogopite'], note: 'Metassomatismo potássico de metassilicatos magnesianos, com Al disponível.' },
    { from: 'clinochlore', with: 'potassium_ion', to: ['phlogopite'], note: 'Entrada de K e aquecimento podem favorecer micas Mg-rica em associação com clorita.' },
    { from: 'chamosite', with: 'potassium_ion', to: ['biotite'], note: 'Entrada de K em associação rica em Fe pode favorecer biotita.' },
    { from: 'muscovite', with: 'sodium_ion', to: ['paragonite'], note: 'Substituição K–Na em mica dioctaédrica.' },
    { from: 'paragonite', with: 'potassium_ion', to: ['muscovite'], note: 'Substituição Na–K em mica dioctaédrica.' },
    { from: 'muscovite', with: 'lithium1', to: ['lepidolite'], note: 'Enriquecimento em Li em micas de sistemas pegmatíticos.' },
    { from: 'lepidolite', with: 'aluminium3', to: ['muscovite'], note: 'Perda de Li e reequilíbrio aluminoso em mica.' },
    { from: 'dravite', with: 'lithium1', to: ['elbaite'], note: 'Evolução de turmalina Mg–Li em sistema rico em B.' },
    { from: 'elbaite', with: 'magnesium_ion', to: ['dravite'], note: 'Evolução da composição de turmalina em direção à dravita.' },
    { from: 'elbaite', with: 'iron2', to: ['schorl'], note: 'Evolução da composição de turmalina em direção à schorlita.' },
    { from: 'quartz', with: 'forsterite', to: ['enstatite'], note: 'Reação de sílica com olivina magnesiana favorece ortopiroxênio.' },
    { from: 'quartz', with: 'fayalite', to: ['ferrosilite'], note: 'Equilíbrio Fe₂SiO₄–SiO₂–FeSiO₃ condicionado por P e T. Não é uma etapa obrigatória da formação de ferrossilita; a estabilidade do ortopiroxênio ferroso depende das condições.' },
    { from: 'periclase', with: 'quartz', to: ['enstatite'], note: 'Síntese a partir de óxidos magnesianos e sílica.' },
    { from: 'wustite', with: 'quartz', to: ['ferrosilite'], note: 'Síntese a partir de óxido ferroso e sílica.' },
    { from: 'enstatite', with: 'periclase', to: ['forsterite'], note: 'Deslocamento de sílica e MgO em silicatos magnesianos.' },
    { from: 'ferrosilite', with: 'wustite', to: ['fayalite'], note: 'Reação entre componente FeO e ortopiroxênio férrico.' },
    { from: 'siderite', with: 'magnesium_ion', to: ['magnesite'], note: 'Composição carbonática deslocada em direção ao Mg.' },
    { from: 'siderite', with: 'quartz', to: ['grunerite', 'co2'], note: 'Em formações ferríferas metamorfizadas, siderita + quartzo + água podem formar grunerita e CO₂; o equilíbrio depende de fCO₂, fH₂O, pressão e temperatura.', source: 'https://ntrs.nasa.gov/citations/19700019391' },
    { from: 'enstatite', with: 'co2', to: ['magnesite', 'quartz'], note: 'Carbonatação de ortopiroxênio magnesiano sob atividade de CO₂ e fluido adequadas; liberação de sílica, não conversão a seco.', source: 'https://pubs.rsc.org/en/content/articlehtml/2023/qi/d2qi02482a' },
    { from: 'diopside', with: 'co2', to: ['calcite', 'magnesite', 'quartz'], note: 'Carbonatação de clinopiroxênio cálcico-magnesiano em fluido com CO₂; carbonatos e sílica podem ser formados, conforme P–T e atividade dos fluidos.', source: 'https://pubs.rsc.org/en/content/articlehtml/2023/qi/d2qi02482a' },
    { from: 'tremolite', with: 'co2', to: ['calcite', 'magnesite', 'quartz', 'water'], note: 'Carbonatação de anfibólio cálcico-magnesiano: formação de carbonatos, sílica e água em ambiente apropriado.', source: 'https://pubs.rsc.org/en/content/articlehtml/2023/qi/d2qi02482a' },
    { from: 'marcasite', with: 'heat', to: ['pyrite'], note: 'Reorganização da fase FeS₂ sob aquecimento.' },
    { from: 'albite', with: 'calcium_ion', to: ['oligoclase'], note: 'Evolução composicional da plagioclase em direção ao anortítico.' },
    { from: 'anorthite', with: 'sodium_ion', to: ['bytownite'], note: 'Evolução composicional da plagioclase em direção ao albítico.' },
];
// Open-system, intuitively meaningful metamorphic pathways. The environment
// supplies or removes the additional components specified in the note.
// Al₂SiO₅ is a nesosilicate polymorph family, not a feldspar framework.
// Reactions are reference-balanced independently in reaction-reference.ts.
pairs.push({ from: 'aluminium3', with: 'quartz', to: ['andalusite'], note: 'Alumínio + sílica representam a composição Al₂SiO₅. O oxigênio e as condições de estabilidade vêm do ambiente.', source: metapelite });
for (const polymorph of ['andalusite', 'kyanite', 'sillimanite']) {
    pairs.push({ from: polymorph, with: 'sodium_ion', to: ['paragonite'], note: 'Na + Al₂SiO₅ leva à mica branca sódica por hidratação e reequilíbrio com sílica do meio; não forma albita diretamente.', source: metapelite }, { from: polymorph, with: 'potassium_ion', to: ['muscovite'], note: 'A associação entre Al₂SiO₅, K e fluido conduz à mica branca. Feldspato potássico pode ser obtido na reação posterior de muscovita com quartzo.', source: metapelite }, { from: polymorph, with: 'calcium_ion', to: ['grossular'], note: 'Aporte de Ca e sílica em sistema cálcico-aluminoso pode favorecer grossulária; grossulária + quartzo participa da formação de anortita + wollastonita.', source: metapelite }, { from: polymorph, with: 'orthoclase', to: ['muscovite', 'quartz'], note: 'Muscovita e quartzo podem se formar por hidratação de feldspato potássico e Al₂SiO₅ em condições retrógradas.', source: metapelite }, { from: polymorph, with: 'albite', to: ['paragonite', 'quartz'], note: 'Associação análoga para mica sódica hidratada, com quartzo no balanço de componentes.', source: metapelite });
}
pairs.push({ from: 'grossular', with: 'kyanite', to: ['anorthite'], note: 'Reação GASP em equilíbrio com quartzo: grossulária + cianita + quartzo ↔ anortita.', source: gAsp });
// Hydrothermal replacement of calcic amphiboles by trioctahedral micas
// requires K-bearing fluids plus Al, Si, H₂O and mass exchange. It is not the
// isolated addition of an elemental potassium atom to an amphibole.
for (const id of ['magnesiohornblende', 'ferrohornblende', 'actinolite', 'pargasite']) {
    pairs.push({ from: id, with: 'potassium_ion', to: ['biotite'], note: 'Substituição hidrotermal potássica: o anfibólio pode ser substituído por biotita quando houver disponibilidade de K, Al e fluidos.', source: hornblendeAlteration });
}
pairs.push({ from: 'tremolite', with: 'potassium_ion', to: ['phlogopite'], note: 'Metassomatismo potássico de anfibólio magnesiano em meio com Al disponível pode favorecer flogopita.', source: hornblendeAlteration }, { from: 'ferroactinolite', with: 'potassium_ion', to: ['annite'], note: 'Evolução para mica rica em Fe requer aporte de K e Al, além de reações com o fluido.', source: hornblendeAlteration }, { from: 'biotite', with: 'calcium_ion', to: ['magnesiohornblende'], note: 'Reequilíbrio cálcico de biotita em sistema com Si, Mg e fluidos pode favorecer formação de hornblenda.', source: hornblendeAlteration });
// Reactant combination is a memory cue; the real reaction needs silica and fluid.
pairs.push({ from: 'paragonite', with: 'quartz', to: ['albite', 'sillimanite', 'water'],
    note: 'Desidratação de paragonita com quartzo em metamorfismo progressivo, formando albita, Al₂SiO₅ e água; equilíbrio condicionado por P–T e aH₂O.',
    source: metapelite });
/** Positive agent pathways. All destinations are specific products or dissolved species. */
const agentRoutes = [];
/** Plagioclase evolution during magmatic cooling requires exchange with Na-rich residual melt.
 * It is NOT a dry solid-state polymorphic transition caused by temperature alone. */
for (const [from, to] of [
    ['anorthite', 'bytownite'], ['bytownite', 'labradorite'], ['labradorite', 'andesine'],
    ['andesine', 'oligoclase'], ['oligoclase', 'albite'],
]) {
    agentRoutes.push({ from, agent: 'cooling', to: [to],
        note: 'Série contínua de Bowen: a composição do plagioclásio cristalizado torna-se mais sódica à medida que o líquido magmático residual evolui. Não é conversão por resfriamento de um cristal isolado.',
        source: 'https://geo.libretexts.org/Bookshelves/Geology/Mineralogy_(Perkins_et_al.)/06:_Igneous_Rocks_and_Silicate_Minerals/6.03:_Crystallization_of_Magmas/6.3.02:_Bowens_Reaction_Series' });
}
function map(agent, target, ids, note, source) {
    for (const id of ids)
        agentRoutes.push({ from: id, agent, to: Array.isArray(target) ? target : [target], note, source });
}
// Reverse high-pressure silica transitions are tied to pressure release, not cooling alone.
map('decompression', 'quartz', ['coesite', 'stishovite'], 'Fases de alta pressão de SiO₂ podem retrotransformar-se em quartzo quando a pressão diminui; a cinética pode preservar polimorfos metaestáveis.', 'https://pubs.usgs.gov/pp/0440l/report.pdf');
// Sodalite can break down into nepheline + NaCl under appropriate P–T–aNaCl conditions.
agentRoutes.push({ from: 'sodalite', agent: 'heat', to: ['nepheline', 'halite'],
    note: 'Decomposição de sodalita a nefelina e NaCl em regime térmico apropriado; a atividade de NaCl e a pressão controlam o equilíbrio.',
    source: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11432373/' });
// Framework minerals: weathering to clays, sericitization, and thermal structural rearrangement.
map('rain', 'kaolinite', ['orthoclase', 'microcline', 'sanidine', 'albite', 'oligoclase', 'andesine', 'labradorite', 'bytownite', 'anorthite'], notes.weathering, weathering);
map('hydrothermal', 'biotite', ['magnesiohornblende', 'ferrohornblende', 'actinolite', 'pargasite'], 'Alteração hidrotermal por fluido rico em K e Al pode substituir anfibólio por biotita. O fluido é um reservatório aberto, não apenas água pura.', hornblendeAlteration);
map('hydrothermal', 'phlogopite', ['tremolite'], 'Alteração hidrotermal de anfibólio magnesiano em fluido rico em K e Al pode formar flogopita.', hornblendeAlteration);
map('hydrothermal', 'annite', ['ferroactinolite'], 'Alteração potássica de anfibólio ferroso, com suprimento de Al e saída de componentes, pode formar mica ferrosa.', hornblendeAlteration);
map('hydrothermal', 'muscovite', ['orthoclase', 'microcline', 'sanidine'], notes.fluid, weathering);
map('hydrothermal', 'paragonite', ['albite', 'oligoclase'], notes.fluid, weathering);
map('cooling', 'microcline', ['orthoclase', 'sanidine'], notes.phase, framework);
map('heat', 'sanidine', ['orthoclase', 'microcline'], notes.phase, framework);
map('hydrothermal', 'analcime', ['nepheline', 'sodalite', 'leucite'], notes.fluid, framework);
map('rain', 'kaolinite', ['nepheline', 'leucite', 'sodalite', 'analcime'], notes.weathering, weathering);
map('heat', 'albite', ['analcime'], notes.metamorphic, framework);
// Olivine and pyroxenes: hydration, oxidative alteration and retrometamorphism.
map('hydrothermal', 'lizardite', ['forsterite', 'olivine', 'monticellite', 'enstatite', 'diopside'], notes.fluid, mineralogy);
map('air', 'goethite', ['fayalite', 'ferrosilite', 'hedenbergite', 'kirschsteinite'], notes.redox, mineralogy);
map('air', 'pyrolusite', ['tephroite'], notes.redox, mineralogy);
map('rain', 'montmorillonite', ['augite', 'pigeonite', 'clinoenstatite', 'jadeite', 'omphacite', 'spodumene', 'wollastonite'], notes.weathering, weathering);
map('rain', 'nontronite', ['aegirine', 'ferrosilite', 'hedenbergite', 'fayalite'], notes.weathering, weathering);
map('hydrothermal', 'talc', ['monticellite', 'pigeonite', 'clinoenstatite'], notes.fluid, mineralogy);
map('heat', 'enstatite', ['lizardite', 'antigorite', 'chrysotile', 'talc'], notes.metamorphic, mineralogy);
map('heat', 'forsterite', ['brucite'], notes.metamorphic, mineralogy);
map('rain', 'montmorillonite', ['lizardite', 'antigorite', 'chrysotile', 'talc'], notes.weathering, weathering);
map('heat', 'tremolite', ['diopside'], notes.metamorphic, mineralogy);
// Amphiboles and micas: weathering clays and chloritization, with limited thermal dehydration.
map('rain', 'montmorillonite', ['tremolite', 'actinolite', 'anthophyllite', 'glaucophane', 'pargasite', 'magnesiohornblende'], notes.weathering, weathering);
map('rain', 'nontronite', ['ferroactinolite', 'grunerite', 'riebeckite', 'ferrohornblende'], notes.weathering, weathering);
map('heat', 'diopside', ['tremolite', 'actinolite', 'pargasite', 'magnesiohornblende'], notes.metamorphic, mineralogy);
map('heat', 'hedenbergite', ['ferroactinolite', 'grunerite', 'ferrohornblende'], notes.metamorphic, mineralogy);
map('hydrothermal', 'clinochlore', ['phlogopite', 'biotite', 'muscovite', 'paragonite'], notes.fluid, mineralogy);
map('rain', 'chamosite', ['annite', 'biotite'], notes.weathering, weathering);
map('rain', 'kaolinite', ['muscovite', 'paragonite', 'lepidolite'], notes.weathering, weathering);
map('rain', 'clinochlore', ['phlogopite'], notes.weathering, weathering);
map('heat', 'orthoclase', ['muscovite', 'paragonite', 'lepidolite'], notes.metamorphic, mineralogy);
map('heat', 'phlogopite', ['clinochlore'], notes.metamorphic, mineralogy);
map('heat', 'annite', ['chamosite'], notes.metamorphic, mineralogy);
map('rain', 'montmorillonite', ['clinochlore', 'chamosite'], notes.weathering, weathering);
map('rain', 'gibbsite', ['kaolinite', 'halloysite', 'pyrophyllite'], notes.weathering, weathering);
map('hydrothermal', 'kaolinite', ['montmorillonite', 'nontronite', 'halloysite'], notes.fluid, weathering);
map('heat', 'kaolinite', ['montmorillonite', 'nontronite'], notes.metamorphic, weathering);
// Não há atalho pirofilita + resfriamento → caulinita; a argilização exige fluidos e perda de Si.
// Garnets/metamorphic indices: retrogression and Al2SiO5 phase fields.
map('hydrothermal', 'clinochlore', ['pyrope'], notes.metamorphic, mineralogy);
map('hydrothermal', 'epidote', ['grossular'], 'Reequilíbrio de granada grossulária em sistema hidrotermal com Fe, Si e H₂O disponíveis pode formar minerais do grupo do epidoto.', 'https://pubs.usgs.gov/bul/b1693/html/bull9ik5.htm');
map('hydrothermal', 'chamosite', ['almandine', 'spessartine', 'andradite'], notes.metamorphic, mineralogy);
map('rain', 'goethite', ['almandine', 'andradite'], notes.weathering, mineralogy);
map('rain', 'pyrolusite', ['spessartine'], notes.weathering, mineralogy);
map('pressure', 'kyanite', ['andalusite'], notes.phase, mineralogy);
map('heat', 'sillimanite', ['kyanite', 'andalusite'], notes.phase, mineralogy);
map('cooling', 'andalusite', ['sillimanite'], notes.phase, mineralogy);
map('hydrothermal', 'clinochlore', ['cordierite', 'staurolite', 'chloritoid'], notes.metamorphic, mineralogy);
map('hydrothermal', 'prehnite', ['zoisite', 'clinozoisite', 'epidote', 'lawsonite', 'pumpellyite_mg'], notes.metamorphic, mineralogy);
map('heat', 'anorthite', ['zoisite', 'clinozoisite', 'prehnite', 'pumpellyite_mg', 'lawsonite'], notes.metamorphic, mineralogy);
map('rain', 'kaolinite', ['cordierite', 'andalusite', 'kyanite', 'sillimanite'], notes.weathering, weathering);
map('rain', 'montmorillonite', ['prehnite', 'pumpellyite_mg', 'lawsonite', 'epidote', 'zoisite', 'clinozoisite'], notes.weathering, weathering);
// Framework polymorphs and zeolites.
map('cooling', 'quartz', ['tridymite', 'cristobalite', 'coesite', 'stishovite'], notes.phase, framework);
map('heat', 'tridymite', ['quartz', 'coesite'], notes.phase, framework);
map('pressure', 'coesite', ['quartz'], notes.phase, framework);
map('impact', 'stishovite', ['coesite', 'quartz'], notes.phase, framework);
map('heat', 'anorthite', ['laumontite', 'stilbite'], notes.metamorphic, framework);
map('heat', 'albite', ['clinoptilolite'], notes.metamorphic, framework);
map('rain', 'kaolinite', ['laumontite', 'stilbite', 'clinoptilolite'], notes.weathering, weathering);
// Carbonate dissolution and CO2 re-equilibration. Aqueous ions are representative, not stoichiometric amounts.
const dissolution = [
    ['calcite', ['calcium_ion', 'bicarbonate']], ['magnesite', ['magnesium_ion', 'bicarbonate']],
    ['siderite', ['iron2', 'bicarbonate']], ['dolomite', ['calcium_ion', 'magnesium_ion', 'bicarbonate']],
    ['aragonite', ['calcium_ion', 'bicarbonate']], ['ankerite', ['calcium_ion', 'iron2', 'bicarbonate']],
    ['rhodochrosite', ['manganese2', 'bicarbonate']], ['smithsonite', ['zinc2', 'bicarbonate']],
    ['azurite', ['copper2', 'bicarbonate']], ['malachite', ['copper2', 'bicarbonate']],
    ['cerussite', ['lead2', 'bicarbonate']], ['strontianite', ['strontium2', 'bicarbonate']],
    ['witherite', ['barium2', 'bicarbonate']],
];
for (const [from, to] of dissolution)
    agentRoutes.push({ from, agent: 'rain', to, note: notes.dissolve, source: weathering });
map('heat', 'lime', ['calcite', 'aragonite'], notes.metamorphic, mineralogy);
map('heat', 'periclase', ['magnesite', 'dolomite'], notes.metamorphic, mineralogy);
map('air', 'goethite', ['siderite', 'ankerite'], notes.redox, mineralogy);
map('heat', 'tenorite', ['malachite', 'azurite'], notes.metamorphic, mineralogy);
// Sulfates and halides: dissolution, desolvation, oxidizing environments.
const saltDissolutions = [
    ['halite', ['sodium_ion', 'chloride']], ['sylvite', ['potassium_ion', 'chloride']],
    ['fluorite', ['calcium_ion', 'fluoride']], ['chlorargyrite', ['silver1', 'chloride']],
    ['gypsum', ['calcium_ion', 'sulfate']], ['anhydrite', ['calcium_ion', 'sulfate']],
    ['barite', ['barium2', 'sulfate']], ['celestine', ['strontium2', 'sulfate']],
    ['anglesite', ['lead2', 'sulfate']], ['chalcanthite', ['copper2', 'sulfate']],
];
for (const [from, to] of saltDissolutions)
    agentRoutes.push({ from, agent: 'rain', to, note: notes.dissolve, source: weathering });
map('hydrothermal', 'gibbsite', ['alunite'], notes.fluid, weathering);
map('hydrothermal', 'goethite', ['jarosite'], notes.fluid, weathering);
// Oxides, hydroxides and sulfides (products represent weathering or metamorphic targets).
map('air', 'hematite', ['fe', 'wustite', 'magnetite', 'hercynite', 'pyrrhotite'], notes.redox, mineralogy);
map('air', 'cuprite', ['cu'], notes.redox, mineralogy);
map('air', 'sulfate', ['s'], notes.redox, mineralogy);
map('air', 'goethite', ['pyrite', 'marcasite', 'troilite', 'arsenopyrite', 'pentlandite', 'cobaltite'], notes.redox, mineralogy);
map('rain', 'malachite', ['chalcopyrite', 'bornite', 'chalcocite', 'covellite', 'cuprite', 'tenorite'], notes.weathering, weathering);
map('air', 'anglesite', ['galena'], notes.redox, mineralogy);
map('rain', 'smithsonite', ['sphalerite'], notes.weathering, weathering);
map('rain', 'lepidocrocite', ['hematite', 'magnetite'], notes.weathering, weathering);
map('hydrothermal', 'brucite', ['periclase', 'spinel'], notes.fluid, mineralogy);
map('hydrothermal', 'boehmite', ['corundum', 'diaspore'], notes.fluid, mineralogy);
map('hydrothermal', 'clinochlore', ['spinel', 'hercynite'], notes.fluid, mineralogy);
map('rain', 'gibbsite', ['corundum', 'boehmite', 'diaspore'], notes.weathering, weathering);
map('heat', 'corundum', ['gibbsite', 'boehmite', 'diaspore'], notes.metamorphic, mineralogy);
map('rain', 'goethite', ['magnesioferrite', 'hercynite'], notes.weathering, weathering);
map('air', 'pyrolusite', ['manganite'], notes.redox, mineralogy);
map('hydrothermal', 'manganite', ['pyrolusite'], notes.fluid, mineralogy);
map('heat', 'rutile', ['anatase', 'brookite', 'ilmenite', 'titanite'], notes.phase, mineralogy);
map('rain', 'goethite', ['ilmenite'], notes.weathering, weathering);
map('hydrothermal', 'anatase', ['rutile'], notes.fluid, mineralogy);
map('air', 'sulfate', ['molybdenite', 'stibnite', 'realgar', 'orpiment', 'cinnabar', 'acanthite'], notes.redox, mineralogy);
map('rain', 'sulfate', ['pyrrhotite', 'arsenopyrite', 'pentlandite', 'cobaltite'], notes.weathering, weathering);
map('hydrothermal', 'molybdate', ['molybdenite'], notes.fluid, mineralogy);
map('hydrothermal', 'silver1', ['silver_native', 'acanthite'], notes.fluid, mineralogy);
map('hydrothermal', 'copper2', ['cu', 'bornite', 'chalcocite', 'covellite'], notes.fluid, mineralogy);
map('hydrothermal', 'iron2', ['pyrrhotite', 'troilite'], notes.fluid, mineralogy);
map('hydrothermal', 'iron3', ['hematite', 'goethite', 'lepidocrocite'], notes.fluid, mineralogy);
map('hydrothermal', 'calcium_ion', ['lime', 'portlandite'], notes.fluid, mineralogy);
map('heat', 'lime', ['portlandite'], notes.metamorphic, mineralogy);
map('air', 'hematite', ['siderite'], notes.redox, mineralogy);
// Accessories, fluorination, boron, tungstates and phosphates.
map('hydrothermal', 'rutile', ['titanite'], notes.fluid, mineralogy);
map('rain', 'kaolinite', ['beryl', 'topaz'], notes.weathering, weathering);
map('hydrothermal', 'muscovite', ['topaz'], notes.fluid, mineralogy);
map('hydrothermal', 'hydroxylapatite', ['fluorapatite'], notes.fluid, mineralogy);
map('hydrothermal', 'fluorapatite', ['hydroxylapatite'], notes.fluid, mineralogy);
map('hydrothermal', 'borate', ['dravite', 'schorl', 'elbaite'], notes.dissolve, mineralogy);
map('hydrothermal', 'dravite', ['schorl', 'elbaite'], notes.fluid, mineralogy);
map('hydrothermal', 'tungstate', ['scheelite'], notes.dissolve, mineralogy);
map('hydrothermal', 'scheelite', ['ferberite', 'hubnerite', 'wolframite'], notes.fluid, mineralogy);
map('air', 'goethite', ['vivianite'], notes.redox, weathering);
map('rain', 'phosphate', ['fluorapatite', 'hydroxylapatite', 'vivianite'], notes.weathering, weathering);
/** Old routes retained only in byReaction for compatibility with saved histories.
 * These transitions imply missing cations, hydration without H₂O, or the wrong P–T axis. */
const RETIRED_GEOLOGICAL_ROUTES = new Set([
    'i-agent-analcime-heat', // replaced by v08-nepheline-2; keep old history
    'i-agent-paragonite-heat', // no K source for orthoclase
    'i-agent-clinochlore-heat', // no K source for phlogopite
    'i-agent-chamosite-heat', // no K source for annite
    'i-agent-diopside-heat', // no hydration to tremolite
    'i-agent-montmorillonite-heat', // smectite heating does not produce kaolinite
    'i-agent-nontronite-heat',
    'i-agent-pargasite-heat', // incomplete dry amphibole breakdown
    'i-agent-magnesiohornblende-heat',
    'i-agent-sillimanite-cooling', // Al2SiO5 boundary requires P–T, not cooling alone
    'i-agent-coesite-cooling', // depends on pressure release
    'i-agent-stishovite-cooling',
    'i-agent-coesite-heat', // does not directly produce high-T tridymite
    'i-agent-ilmenite-heat', // Fe removal and redox missing
    'i-agent-titanite-heat', // no simple heat-only destabilization
    'i-agent-laumontite-heat', // not automatically anorthite
    'i-agent-stilbite-heat',
    'i-agent-clinoptilolite-heat',
]);
const ROUTE_CORRECTIONS = {
    'i-agent-grunerite-heat': { to: ['ferrosilite', 'quartz', 'water'], note: 'Desidroxilação da grunerita gera associação de ortopiroxênio ferroso, sílica e água; depende de P–T e fO₂.', source: metapelite },
    'i-agent-ferroactinolite-heat': { to: ['hedenbergite', 'ferrosilite', 'quartz', 'water'], note: 'Desidroxilação de anfibólio ferroso e separação em piroxênios, sílica e H₂O em condições adequadas.', source: metapelite },
    'i-agent-aragonite-heat': { to: ['calcite'], note: 'Reorganização estrutural aragonita–calcita para o campo de estabilidade da calcita; não é calcinação imediata.', source: mineralogy },
    'i-agent-dolomite-heat': { to: ['calcite', 'periclase', 'co2'], note: 'Primeiro estágio idealizado da descarbonatação térmica da dolomita com formação de calcita, MgO e CO₂.', source: mineralogy },
};
function key(a, b) { return [a, b].sort().join('::'); }
function generateIntuitiveRoutes(cards, agents, existing) {
    const byCard = new Map(cards.map(c => [c.id, c]));
    const agentIds = new Set(agents.map(a => a.id));
    const labels = new Map([...cards.map(c => [c.id, c.name]), ...agents.map(a => [a.id, a.name])]);
    const taken = new Set();
    for (const r of existing) {
        if (r.kind === 'synthesis') {
            if (r.inputs.length === 2)
                taken.add(key(r.inputs[0], r.inputs[1]));
            if (r.staging?.length === 2)
                taken.add(key(r.staging[0], r.staging[1]));
        }
        else if (r.agent)
            taken.add(key(r.inputs[0], r.agent));
    }
    const result = [];
    const append = (from, withId, outputs, note, source, idPrefix) => {
        if (!byCard.has(from) || !(byCard.has(withId) || agentIds.has(withId)) || !outputs.length || outputs.some(x => !byCard.has(x)) || outputs.includes(from))
            return;
        const routeKey = key(from, withId);
        const historicalId = `i-${idPrefix}-${from}-${withId}`;
        const retired = RETIRED_GEOLOGICAL_ROUTES.has(historicalId);
        if (taken.has(routeKey) && !retired)
            return;
        const replacement = ROUTE_CORRECTIONS[historicalId];
        if (replacement) {
            outputs = replacement.to;
            note = replacement.note;
            source = replacement.source;
        }
        const isAgent = agentIds.has(withId);
        if (isAgent && byCard.get(from)?.kind !== 'mineral')
            return;
        const equation = `${labels.get(from)} + ${labels.get(withId)} ⇢ ${outputs.map(x => labels.get(x)).join(' + ')}`;
        const environmentNotes = {
            rain: notes.weathering, air: notes.redox, reduction: notes.redox,
            heat: notes.metamorphic, pressure: notes.phase, cooling: notes.phase, impact: notes.phase,
            hydrothermal: notes.fluid, water: notes.fluid, co2: notes.dissolve, volcanism: notes.metamorphic,
        };
        result.push({
            id: `i-${idPrefix}-${from}-${withId}`,
            kind: isAgent ? 'alteration' : 'synthesis',
            inputs: [from, ...(isAgent ? [] : [withId])], outputs, agent: isAgent ? withId : null,
            equation, summary: note, conditions: isAgent ? (idPrefix === 'agent' && withId === 'cooling' && ['anorthite', 'bytownite', 'labradorite', 'andesine', 'oligoclase'].includes(from) ? 'Evolução do plagioclásio com o líquido residual, com troca acoplada Ca–Al por Na–Si. Difusão lenta ou cristalização fracionada pode preservar núcleos mais cálcicos.' : environmentNotes[withId] ?? notes.fluid) : notes.exchange,
            source, symbolic: true, mechanic: 'evolution', retired,
        });
        if (!retired)
            taken.add(routeKey);
    };
    for (const ladder of ladders) {
        for (let i = 0; i < ladder.members.length - 1; i++) {
            const from = ladder.members[i], to = ladder.members[i + 1];
            append(from, ladder.forward, [to], ladder.note, ladder.source, 'series');
            append(to, ladder.backward, [from], ladder.note, ladder.source, 'series');
        }
    }
    for (const p of pairs)
        append(p.from, p.with, p.to, p.note, p.source ?? mineralogy, 'pair');
    for (const p of agentRoutes)
        append(p.from, p.agent, p.to, p.note, p.source ?? mineralogy, 'agent');
    return result;
}

return generateIntuitiveRoutes;
})();
/** Equivalências de nomes de espécies em partidas antigas. */
const LEGACY_CARD_ALIASES = { k_aq: 'potassium_ion', na_aq: 'sodium_ion', ca_aq: 'calcium_ion', cl_aq: 'chloride', hco3_aq: 'bicarbonate', sulfate_aq: 'sulfate', proton_aq: 'proton' };
function canonicalCardId(id) {
    if (Object.hasOwn(LEGACY_CARD_ALIASES, id)) return LEGACY_CARD_ALIASES[id];
    return Object.hasOwn(SPECIATION.aliases, id) ? SPECIATION.aliases[id] : id;
}
const isPlayableCard = card => Boolean(card && !card.hiddenFromPlay && !HIDDEN_ARCHIVED_IONS.has(card.id));
const AVAILABLE_AGENTS = new Set(['hydrothermal', 'rain', 'air', 'heat', 'reduction', 'pressure', 'cooling', 'impact', 'volcanism', 'decompression', 'low_silica']);
for (const card of EMBEDDED.cards) {
    if (card.id === 'gold3' || card.id === 'silicon4') card.starter = false;
    if (card.id === 'gold_native' || card.id === 'si') card.starter = true;
}
const keyFor = (ids) => [...ids].sort().join('::');
const pairKey = (left, right) => keyFor([left, right]);
function createEngine(cards, agents, baseReactions, rules) {
    cards = cards.map(card => ({ ...card, ...SPECIATION.cards[card.id] }));
    const generated = rules ? generateFamilyReactions(cards, rules) : [];
    const intuitive = generateIntuitiveRoutes(cards, agents, [...baseReactions, ...generated]);
    const coreReactions = [...baseReactions.map(auditedReaction), ...generated,
        ...intuitive.map(auditIntuitiveReaction), ANORTHITE_REFERENCE, ...HYDRIC_REPLACEMENTS, ...TRANSFORMATIONS.additions]
        .map(reaction => ({
            ...reaction, ...SPECIATION.routes[reaction.id], ...TRANSFORMATIONS.updates[reaction.id],
            archiveReason: TRANSFORMATIONS.retiredReasons[reaction.id] ?? SPECIATION.retiredReasons[reaction.id],
        }));
    const stagingCards = [];
    const stagingReactions = [];
    const stagingPairs = new Map();
    const catalogCard = new Map(cards.map(c => [c.id, c]));
    for (const reaction of coreReactions) {
        if (reaction.kind !== 'synthesis' || reaction.inputs.length !== 3 || !reaction.staging)
            continue;
        const pair = reaction.staging;
        if (pair.length !== 2 || pair[0] === pair[1] || !pair.every(id => reaction.inputs.includes(id)))
            continue;
        const third = reaction.inputs.filter(id => !pair.includes(id));
        if (third.length !== 1)
            continue;
        const sorted = [...pair].sort();
        const stageId = `assemblage-${sorted.join('-')}`;
        if (!stagingPairs.has(pairKey(...pair))) {
            stagingPairs.set(pairKey(...pair), stageId);
            const names = pair.map(id => catalogCard.get(id)?.name ?? id);
            stagingCards.push({ id: stageId, name: `${names[0]} + ${names[1]}`, formula: 'Associação mineral', kind: 'assemblage', family: 'Associações minerais', description: `Associação de ${names.join(' e ')}. Combine com outra peça para completar a rota em etapas.`, color: '#96a2b2', starter: false });
            stagingReactions.push({ id: `prepare-${stageId}`, kind: 'synthesis', inputs: [...pair], outputs: [stageId], agent: null, equation: `${names.join(' + ')} → associação mineral`, summary: `Associação de ${names.join(' e ')}.`, conditions: 'Preparação da associação mineral; não representa uma reação química isolada.', source: reaction.source, symbolic: true });
        }
        stagingReactions.push({ ...reaction, id: `complete-${reaction.id}`, inputs: [stageId, third[0]], staging: undefined });
    }
    const allCards = [...cards, ...stagingCards];
    const allReactions = [...coreReactions, ...stagingReactions];
    const reactions = allReactions.filter(r => !r.retired);
    const byCard = new Map(allCards.map(c => [c.id, c]));
    const byReaction = new Map(allReactions.map(r => [r.id, r]));
    const agentIds = new Set(agents.map(a => a.id));
    const diagnostics = [];
    const syntheses = new Map();
    const alterations = new Map();
    if (byCard.size !== allCards.length)
        diagnostics.push('Há cartas com IDs repetidos.');
    if (byReaction.size !== allReactions.length)
        diagnostics.push('Há reações com IDs repetidos.');
    if (agentIds.size !== agents.length)
        diagnostics.push('Há agentes com IDs repetidos.');
    for (const reaction of reactions) {
        if (reaction.outputs.length === 0)
            diagnostics.push(`${reaction.id}: sem produtos`);
        if (reaction.staging && (reaction.inputs.length !== 3 || reaction.staging.length !== 2 || reaction.staging.some(x => !reaction.inputs.includes(x))))
            diagnostics.push(`${reaction.id}: associação de reagentes inválida`);
        if (reaction.mechanic === 'evolution' && !reaction.symbolic)
            diagnostics.push(`${reaction.id}: evolução exige rótulo didático`);
        for (const id of reaction.environmentalInputs ?? [])
            if (!byCard.has(id) && !agentIds.has(id))
                diagnostics.push(`${reaction.id}: reagente ambiental inexistente ${id}`);
        for (const id of [...reaction.inputs, ...reaction.outputs]) {
            if (!byCard.has(id) && !agentIds.has(id))
                diagnostics.push(`${reaction.id}: carta inexistente ${id}`);
            else if (byCard.has(id) && !isPlayableCard(byCard.get(id)))
                diagnostics.push(`${reaction.id}: carta reservada ao histórico ${id}`);
        }
        if (reaction.kind === 'synthesis') {
            if (![2, 3].includes(reaction.inputs.length) || reaction.agent !== null)
                diagnostics.push(`${reaction.id}: receita de síntese inválida`);
            const key = keyFor(reaction.inputs);
            if (syntheses.has(key))
                diagnostics.push(`${reaction.id}: receita de síntese ambígua`);
            syntheses.set(key, reaction);
        }
        else if (reaction.kind === 'alteration') {
            if (reaction.inputs.length !== 1 || !reaction.agent || !agentIds.has(reaction.agent))
                diagnostics.push(`${reaction.id}: agente ou entrada inválidos`);
            if (byCard.get(reaction.inputs[0] ?? '')?.kind !== 'mineral')
                diagnostics.push(`${reaction.id}: alteração requer mineral`);
            const key = `${reaction.inputs[0]}::${reaction.agent}`;
            if (alterations.has(key))
                diagnostics.push(`${reaction.id}: alteração ambígua`);
            alterations.set(key, reaction);
        }
        else {
            diagnostics.push(`${reaction.id}: categoria inválida`);
        }
    }
    return {
        cards: allCards, agents, reactions, byCard, byReaction, diagnostics,
        synthesize: (first, second) => syntheses.get(pairKey(first, second)) ?? null,
        synthesizeMany: (inputs) => inputs.length >= 2 && inputs.length <= 3 ? syntheses.get(keyFor(inputs)) ?? null : null,
        thirdComponentHints: (selected, available) => {
            if (selected.length !== 2)
                return [];
            return [...new Set(reactions.filter(r => r.kind === 'synthesis' && r.inputs.length === 3 && selected.every(id => r.inputs.includes(id)))
                    .flatMap(r => r.inputs.filter(id => !selected.includes(id))))]
                .filter(id => available.has(id)).map(id => byCard.get(id)).filter((c) => Boolean(c));
        },
        alter: (cardId, agentId) => alterations.get(`${cardId}::${agentId}`) ?? null,
        nearCombos: (firstId, secondId, available) => {
            const selected = new Set([firstId, secondId]);
            const found = new Set();
            const result = [];
            for (const reaction of reactions) {
                if (reaction.kind !== 'synthesis' || reaction.inputs.length !== 2 || !reaction.inputs.some(id => selected.has(id)))
                    continue;
                if (!reaction.inputs.every(id => available.has(id)))
                    continue;
                const inputs = [reaction.inputs[0], reaction.inputs[1]];
                const key = pairKey(...inputs);
                if (key === pairKey(firstId, secondId) || found.has(key))
                    continue;
                found.add(key);
                result.push({ inputs });
                if (result.length >= 4)
                    break;
            }
            return result;
        },
    };
}
function reachableIds(engine) {
    const reachable = new Set([...makeInitialSave(engine.cards).discovered, ...engine.agents.map(a => a.id)]);
    let changed = true;
    while (changed) {
        changed = false;
        for (const reaction of engine.reactions) {
            if (!reaction.inputs.every(input => reachable.has(input)))
                continue;
            for (const output of reaction.outputs) {
                if (!reachable.has(output)) {
                    reachable.add(output);
                    changed = true;
                }
            }
        }
    }
    return reachable;
}
function nearSynthesis(engine, firstId, available) {
    return engine.reactions
        .filter(r => r.kind === 'synthesis' && r.inputs.includes(firstId))
        .map(r => r.inputs.find(id => id !== firstId) ?? firstId)
        .filter(id => available.has(id))
        .map(id => engine.byCard.get(id))
        .filter((card) => Boolean(card));
}

const boardPairKey = (a, b) => [a, b].sort().join('::');
/** The player sees only binary recipes, including environmental agents as playable pieces. */
function buildPairCatalog(engine) {
    const byPair = new Map();
    const pairs = [];
    const add = (a, b, r) => {
        const key = boardPairKey(a, b);
        const previous = byPair.get(key);
        if (previous) {
            if (keyFor(previous.outputs) !== keyFor(r.outputs)) {
                throw new Error(`Par ambíguo ${a} + ${b} nas rotas ${previous.id} e ${r.id}.`);
            }
            return; // Representações equivalentes de hidratação mantêm a síntese cadastrada.
        }
        byPair.set(key, r);
        pairs.push({ inputs: [a, b], reaction: r });
    };
    for (const r of engine.reactions)
        if (r.kind === 'synthesis' && r.inputs.length === 2)
            add(r.inputs[0], r.inputs[1], r);
    for (const r of engine.reactions)
        if (r.kind === 'alteration' && r.inputs.length === 1 && r.agent)
            add(r.inputs[0], r.agent, r);
    return { pairs, byPair };
}
function resolvePair(catalog, a, b) {
    return catalog.byPair.get(boardPairKey(a, b)) ?? null;
}

function reachablePairIds(engine, catalog, availableAgents) {
    const reachable = new Set([...makeInitialSave(engine.cards).discovered, ...availableAgents]);
    let previousSize;
    do {
        previousSize = reachable.size;
        for (const { inputs, reaction } of catalog.pairs) {
            if (inputs.every(id => reachable.has(id))) {
                for (const id of reaction.outputs) {
                    if (isPlayableCard(engine.byCard.get(id))) reachable.add(id);
                }
            }
        }
    } while (reachable.size !== previousSize);
    return reachable;
}
/** Coordinates are piece centers inside the board. */
function findCollision(pieces, draggingId, x, y, threshold) {
    let closest = null;
    let best = threshold * threshold;
    for (const p of pieces) {
        if (p.instanceId === draggingId)
            continue;
        const d = (p.x - x) ** 2 + (p.y - y) ** 2;
        if (d <= best) {
            best = d;
            closest = p;
        }
    }
    return closest;
}
function makeBoardProducts(ids, x, y, width, height, firstId) {
    // Products are instances of species, not stoichiometric coefficients.
    // A reaction can create several different species at once.
    const columns = Math.ceil(Math.sqrt(ids.length));
    const rows = Math.ceil(ids.length / columns);
    const dx = ids.length === 2 ? 88 : 96;
    const dy = 100;
    const minimumX = Math.min(40, width / 2), maximumX = Math.max(minimumX, width - 40);
    const minimumY = Math.min(46, height / 2), maximumY = Math.max(minimumY, height - 46);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const centerX = clamp(x, minimumX + (columns - 1) * dx / 2, maximumX - (columns - 1) * dx / 2);
    const centerY = clamp(y, minimumY + (rows - 1) * dy / 2, maximumY - (rows - 1) * dy / 2);
    return ids.map((itemId, i) => {
        const col = i % columns, row = Math.floor(i / columns);
        return { instanceId: firstId + i, itemId,
            x: clamp(centerX + (col - (columns - 1) / 2) * dx, minimumX, maximumX),
            y: clamp(centerY + (row - (rows - 1) / 2) * dy, minimumY, maximumY) };
    });
}

/** Biblioteca de iconografia mineralógica.
 * 19 espécies mantêm ilustrações autorais totalmente desenhadas.
 * As demais recebem SVGs exclusivos gerados a partir de arquétipos mineralógicos,
 * preservando a regra: todo mineral possui ícone próprio; íons e moléculas não.
 */
