import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
const context = vm.createContext({
    document: { querySelector: () => ({ addEventListener() {} }) },
    window: { addEventListener() {} },
});
const script = read('index.html').match(/<script>([\s\S]*?)<\/script>/)[1];
const run = code => vm.runInContext(code, context);
run(script.replace(/void boot\(\);\s*$/, ''));
run('engine = createEngine(EMBEDDED.cards, EMBEDDED.agents, EMBEDDED.reactions, EMBEDDED.rules)');

const route = id => JSON.parse(run(`JSON.stringify(routeScience(engine.byReaction.get(${JSON.stringify(id)}), engine.byCard))`));
const payload = () => JSON.parse(read('catalogo-auditoria.html').match(/<script[^>]*id="payload"[^>]*>([\s\S]*?)<\/script>/)[1]);

test('montagem de uma associação fica sem equação química', () => {
    const science = route('prepare-assemblage-corundum-lime');
    assert.equal(science.process, 'associacao-didatica');
    assert.equal(science.reference, null);
});

test('a ficha da lawsonita preserva equilíbrio, água e restrições de formação', () => {
    const science = route('a-anorthite-pressure-lawsonite');
    assert.match(science.reference.equation, /2 H₂O ⇌/);
    assert.match(science.conditions, /baixa temperatura/i);
    assert.equal(science.reference.balance, 'balanced');
    assert.equal(science.reviewStatus, 'condicional');
    const markup = run("historyEntryMarkup({ reaction: engine.byReaction.get('a-anorthite-pressure-lawsonite'), count: 1, lastAt: 0 })");
    assert.match(markup, /Peças da bancada/);
    assert.match(markup, /2 H₂O ⇌/);
    assert.match(markup, /Componentes do meio/);
    assert.match(markup, /baixa temperatura/i);
});

test('rota provisória para clinoptilolita preserva a ressalva e a especificidade da fonte', () => {
    const science = route('a-albite-hydrothermal-clinoptilolite');
    assert.equal(science.reference, null);
    assert.equal(science.reviewStatus, 'provisoria');
    assert.match(science.sources[0].claim, /vidro riolítico/i);
    assert.match(science.conditions, /precursor/i);
});

test('validação distingue massa, carga, hidratação, equilíbrio e texto livre', () => {
    const balance = formula => run(`parseReferenceEquation(${JSON.stringify(formula)})?.balance ?? null`);
    assert.equal(balance('Fe³⁺ + e⁻ → Fe²⁺'), 'balanced');
    assert.equal(balance('Fe³⁺ → Fe²⁺'), 'unbalanced');
    assert.equal(balance('CaSO₄ + 2 H₂O ⇌ CaSO₄·2H₂O'), 'balanced');
    assert.equal(balance('C + O₂ → CO'), 'unbalanced');
    assert.equal(balance('Cal + Coríndon → associação mineral'), null);
});

test('auditoria publicada deriva do motor e distingue pares, evidência e taxonomia', () => {
    const { entries, revision } = payload();
    assert.match(revision, /^[a-f0-9]{64}$/);
    const ids = JSON.parse(run('JSON.stringify([...engine.byReaction.keys()])'));
    assert.deepEqual(entries.map(r => r.id).sort(), ids.sort());
    assert.equal(entries.filter(r => r.active).length, run('engine.reactions.length'));
    assert.equal(entries.filter(r => r.executable).length, run('buildPairCatalog(engine).pairs.length'));
    assert.ok(entries.every(r => r.process && r.reviewStatus && /^[a-f0-9]{64}$/.test(r.fingerprint)));
    assert.ok(entries.flatMap(r => [...r.inputs, ...r.outputs]).some(c => c.id === 'andesine' && c.materialType === 'faixa-composicional'));
    assert.ok(entries.filter(r => r.active && r.reference).every(r => r.reference.balance === 'balanced'));
});

test('o alcance usa apenas pares que podem ser escolhidos na bancada', () => {
    const count = run(`[...reachablePairIds(engine, buildPairCatalog(engine), specialAgents)]
        .filter(id => engine.byCard.get(id)?.kind === 'mineral').length`);
    assert.equal(count, 178);
});

test('o catálogo rejeita produtos conflitantes para o mesmo par da bancada', () => {
    assert.throws(() => run(`buildPairCatalog({ reactions: [
        { id: 's-a', kind: 'synthesis', inputs: ['a', 'b'], outputs: ['x'] },
        { id: 'a-b', kind: 'alteration', inputs: ['a'], agent: 'b', outputs: ['y'] },
    ] })`), /par ambíguo/i);
});

test('a desidratação da antigorita explicita o polissoma e tem referência paginada', () => {
    const science = route('meta-antigorite-brucite');
    assert.match(science.reference.equation, /Mg₄₈Si₃₄O₈₅\(OH\)₆₂.*51 H₂O/);
    assert.equal(science.reference.balance, 'balanced');
    assert.ok(science.sources.some(source => source.locator?.includes('676')));
});

test('a rota encenada da estaurolita consome quartzo do meio', () => {
    const { entries } = payload();
    for (const id of ['meta-staurolite-chlorite-muscovite', 'complete-meta-staurolite-chlorite-muscovite']) {
        const entry = entries.find(r => r.id === id);
        assert.ok(entry.environmentalInputs.some(material => material.id === 'quartz'));
        assert.ok(!entry.outputs.some(material => material.id === 'quartz'));
        assert.ok(entry.sources.some(source => source.locator?.includes('648')));
    }
});

test('aragonita fica alcançável pelo equilíbrio polimórfico e conserva a rota antiga no arquivo', () => {
    const { entries } = payload();
    assert.equal(entries.find(r => r.id === 'v08-aragonite-2').active, false);
    const pressure = entries.find(r => r.id === 'v08-aragonite-1');
    assert.equal(pressure.executable, true);
    assert.equal(pressure.reference.kind, 'equilibrio');
    assert.equal(pressure.reference.balance, 'balanced');
    assert.match(pressure.reference.equation, /calcita.*⇌.*aragonita/);
});

test('a desidratação de pirofilita fornece uma rota documentada para andaluzita', () => {
    const { entries } = payload();
    const route = entries.find(r => r.id === 'meta-pyrophyllite-andalusite');
    assert.equal(entries.find(r => r.id === 'v08-andalusite-1').active, false);
    assert.equal(route.executable, true);
    assert.equal(route.reference.balance, 'balanced');
    assert.deepEqual(route.outputs.map(material => material.id), ['andalusite', 'quartz', 'water']);
    assert.match(route.conditions, /baixa pressão/);
});

test('o resumo da partida mantém rotas antigas após cem eventos recentes', () => {
    const progress = JSON.parse(run(`JSON.stringify((() => {
        let progress = makeInitialSave(engine.cards);
        progress = discover(progress, engine.byReaction.get('a-anorthite-pressure-lawsonite'), engine).save;
        for (let i = 0; i < 105; i++) {
            progress = discover(progress, engine.byReaction.get('assemble-water'), engine).save;
        }
        const restored = restoreSave(JSON.parse(JSON.stringify(progress)), engine);
        return { recent: restored.history.length, entries: completedReactions(restored, engine).map(x => [x.reaction.id, x.count]) };
    })())`));
    assert.equal(progress.recent, 100);
    assert.deepEqual(new Map(progress.entries), new Map([['assemble-water', 105], ['a-anorthite-pressure-lawsonite', 1]]));
});

test('o backup é portável e a restauração valida peças antes de devolver a sessão', () => {
    const restored = JSON.parse(run(`JSON.stringify((() => {
        const progress = makeInitialSave(engine.cards);
        const backup = makeProgressBackup(progress, [
            { instanceId: 1, itemId: 'ca_aq', x: 40, y: 50 },
            { instanceId: 2, itemId: 'nao-existe', x: 40, y: 50 },
        ], ['ca_aq']);
        return readProgressBackup(JSON.parse(JSON.stringify(backup)), engine);
    })())`));
    assert.deepEqual(restored.board.map(piece => piece.itemId), ['calcium_ion']);
    assert.deepEqual(restored.recent, ['calcium_ion']);
    assert.throws(() => run("readProgressBackup({ format: 'mineralchemy-progress-v1', progress: {} }, engine)"));
});

test('partidas anteriores conservam a interpretação de uma rota que mudou', () => {
    const game = JSON.parse(run(`JSON.stringify((() => {
        const save = restoreSave({
            version: 1, discovered: ['ca_aq', 'jadeite'], history: [
                { reactionId: 'v08-jadeite-1', at: 100 },
                { reactionId: 'nao-existe', at: 200 },
            ],
        }, engine);
        const entries = completedReactions(save, engine);
        return { discovered: save.discovered, entries };
    })())`));
    assert.ok(game.discovered.includes('calcium_ion'));
    assert.equal(game.entries.length, 1);
    assert.equal(game.entries[0].reaction.historicalSnapshot, true);
    assert.deepEqual(game.entries[0].reaction.outputs, ['jadeite']);
});
