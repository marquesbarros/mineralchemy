import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = vm.createContext({ document: { querySelector: () => ({ addEventListener() {} }) }, window: { addEventListener() {} } });
const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = page.match(/<script>([\s\S]*?)<\/script>/)[1];
const run = expression => vm.runInContext(expression, context);
run(script.replace(/void boot\(\);\s*$/, ''));
run(`engine = createEngine(EMBEDDED.cards, EMBEDDED.agents, EMBEDDED.reactions, EMBEDDED.rules);
pairs = buildPairCatalog(engine);
const initiallyKnown = new Set([...makeInitialSave(engine.cards).discovered, ...AVAILABLE_AGENTS]);
const trailCards = new Map([...engine.cards, ...engine.agents].map(card => [card.id, card]));`);
const plain = expression => JSON.parse(run('JSON.stringify(' + expression + ')'));

test('silício pode iniciar diretamente com O₂, sem uma semirreação preparatória', () => {
    const initial = plain("continuationOptions(pairs, 'si', initiallyKnown, trailCards)");
    const quartz = initial.available.find(option => option.partnerId === 'o2');
    assert.ok(quartz);
    assert.deepEqual(quartz.newOutputs, ['quartz']);
    assert.equal(quartz.prerequisite, null);
    assert.equal(run("resolvePair(pairs, 'oxide', 'oxide')"), null);
});

test('uma pista de cálcio ensina a obter quartzo e abre a wollastonita ao retornar', () => {
    const initial = plain("continuationOptions(pairs, 'calcium_ion', initiallyKnown, trailCards)");
    const blocked = initial.blocked.find(option => option.partnerId === 'quartz' && option.newOutputs.includes('wollastonite'));
    assert.equal(blocked.prerequisite.targetId, 'quartz');
    assert.deepEqual(blocked.prerequisite.actions.map(step => step.inputs), [['si', 'o2']]);
    const next = plain("continuationOptions(pairs, 'calcium_ion', new Set([...initiallyKnown, 'quartz']), trailCards)");
    const ready = next.available.find(option => option.partnerId === 'quartz');
    assert.deepEqual(ready.newOutputs, ['wollastonite']);
});

test('após descobrir quartzo as pistas oferecem mais de um percurso real', () => {
    const routes = plain("continuationOptions(pairs, 'quartz', new Set([...initiallyKnown, 'o2', 'quartz']), trailCards).available");
    assert.ok(routes.some(option => option.newOutputs.includes('enstatite')));
    assert.ok(routes.some(option => option.newOutputs.includes('coesite')));
    assert.ok(routes.some(option => option.newOutputs.includes('wollastonite')));
});

test('as pistas omitem ciclos inacessíveis e encadeiam os pré-requisitos na ordem de execução', () => {
    const result = plain(`(() => {
        const cards = new Map(['a', 'b', 'c', 'd', 'e', 'x', 'y'].map(id => [id, { id, kind: 'mineral' }]));
        const reactions = [
            [['a', 'x'], ['e']], [['x', 'b'], ['y']], [['y', 'b'], ['x']],
            [['a', 'd'], ['e']], [['c', 'b'], ['d']], [['a', 'b'], ['c']],
        ].map(([inputs, outputs], index) => ({ inputs, reaction: { id: String(index), outputs } }));
        return continuationOptions({ pairs: reactions }, 'a', new Set(['a', 'b']), cards);
    })()`);
    assert.deepEqual(result.blocked.map(option => option.partnerId), ['d']);
    assert.deepEqual(result.blocked[0].prerequisite.actions.map(step => step.inputs), [['a', 'b'], ['c', 'b']]);
});

test('as entradas bloqueadas oferecem um caminho executável a partir das peças iniciais', () => {
    for (const id of ['borate', 'zirconium4', 'lithium1', 'chromium3', 'nickel2', 'beryllium2', 'cobalt2']) {
        const report = plain(`(() => {
            const focus = ${JSON.stringify(id)};
            const options = continuationOptions(pairs, focus, initiallyKnown, trailCards);
            const option = options.blocked.find(item => item.newOutputs.length);
            if (!option) return null;
            const known = new Set(initiallyKnown);
            for (const step of option.prerequisite.actions) {
                if (!step.inputs.every(piece => known.has(piece))) return null;
                const reaction = resolvePair(pairs, ...step.inputs);
                if (reaction?.id !== step.reaction.id) return null;
                for (const product of reaction.outputs) known.add(product);
            }
            return { ready: option.inputs.every(piece => known.has(piece)), partner: option.partnerId };
        })()`);
        assert.ok(report?.ready, 'Falta um caminho reproduzível para ' + id);
    }
});

test('já conhecer o produto ainda permite rever o processo de transformação', () => {
    const done = plain("continuationOptions(pairs, 'quartz', new Set([...initiallyKnown, 'quartz', 'coesite']), trailCards).available");
    const review = done.find(option => option.reaction.outputs.includes('coesite'));
    assert.ok(review);
    assert.deepEqual(review.newOutputs, []);
});

test('a cementação desloca cobre sem uma redução genérica e separa metais de íons', () => {
    assert.equal(run("resolvePair(pairs, 'sodium_ion', 'reduction')"), null);
    assert.equal(run("resolvePair(pairs, 'copper2', 'reduction')"), null);
    assert.deepEqual(plain("resolvePair(pairs, 'fe', 'copper2').outputs"), ['cu', 'iron2']);
    assert.deepEqual(plain("resolvePair(pairs, 'cu', 'silver1').outputs"), ['silver_native', 'copper2']);
    assert.equal(run("canonicalCardId('na')"), 'na');
});

test('partidas antigas guardam o sódio metálico no histórico e restauram o foco válido', () => {
    const session = plain(`(() => {
        const progress = { version: 1, discovered: ['na'], history: [{ reactionId: 'ion-sodium-neutral', at: 100 }] };
        const board = [
            { instanceId: 1, itemId: 'na', x: 40, y: 40 },
            { instanceId: 2, itemId: 'sodium_ion', x: 60, y: 60 },
        ];
        const saved = makeProgressBackup(progress, board, ['na'], 'sodium_ion');
        const restored = readProgressBackup(saved, engine);
        const [event] = completedReactions(restored.progress, engine);
        const invalidFocus = readProgressBackup({ ...saved, trailFocusId: 'na' }, engine).trailFocusId;
        return { restored, previousProducts: event.reaction.outputs, invalidFocus };
    })()`);
    assert.ok(session.restored.progress.discovered.includes('na'));
    assert.deepEqual(session.previousProducts, ['na']);
    assert.deepEqual(session.restored.board.map(p => p.itemId), ['sodium_ion']);
    assert.deepEqual(session.restored.recent, []);
    assert.equal(session.restored.trailFocusId, 'sodium_ion');
    assert.equal(session.invalidFocus, null);
});

test('galena segue para anglesita e cerussita e a calcita pode encontrar a trilha do sulfato', () => {
    assert.ok(plain("resolvePair(pairs, 'galena', 'air').outputs").includes('anglesite'));
    const carbonate = plain("resolvePair(pairs, 'anglesite', 'bicarbonate')");
    assert.ok(carbonate.outputs.includes('cerussite'));
    assert.ok(carbonate.outputs.includes('sulfate'));
    const gypsum = plain("resolvePair(pairs, 'calcite', 'sulfate')");
    assert.ok(gypsum.outputs.includes('gypsum'));
    assert.ok(gypsum.environmentalInputs.includes('water'));
    assert.ok(gypsum.environmentalInputs.includes('proton'));
    assert.equal(run("routeScience(resolvePair(pairs, 'calcite', 'sulfate'), engine.byCard).reference.balance"), 'balanced');
});
