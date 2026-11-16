import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const reference = process.argv[2] ?? '17d1f94';
if (!/^[a-f0-9]{7,40}$/i.test(reference)) throw new Error('Informe o SHA do commit de partida.');
const original = execFileSync('git', ['show', `${reference}:index.html`], {
    cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
});
const current = readFileSync(new URL('index.html', root), 'utf8');

function gameGraph(html) {
    const context = vm.createContext({
        document: { querySelector: () => ({ addEventListener() {} }) },
        window: { addEventListener() {} },
    });
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    if (!script) throw new Error('Script do jogo ausente.');
    vm.runInContext(script.replace(/void boot\(\);\s*$/, ''), context);
    return vm.runInContext(`(() => {
        const { cards, agents, reactions, rules } = EMBEDDED;
        const engine = createEngine(cards, agents, reactions, rules);
        if (engine.diagnostics.length) throw Error(engine.diagnostics.join(' | '));
        const graph = buildPairCatalog(engine);
        return {
            cards: engine.cards,
            starters: makeInitialSave(engine.cards).discovered,
            agents: [...AVAILABLE_AGENTS],
            pairs: graph.pairs,
            reachable: [...reachablePairIds(engine, graph, AVAILABLE_AGENTS)],
            active: engine.reactions.length,
            total: engine.byReaction.size,
        };
    })()`, context);
}

function branchFrom(pairs, initial, rootId) {
    const lineage = new Set([rootId]);
    let rounds = 0;
    while (true) {
        const outputs = new Set();
        for (const pair of pairs) {
            if (!pair.inputs.some(id => lineage.has(id)) || !pair.inputs.every(id => initial.has(id) || lineage.has(id))) continue;
            for (const id of pair.reaction.outputs) {
                if (!initial.has(id) && !lineage.has(id)) outputs.add(id);
            }
        }
        if (!outputs.size) return { outputs: [...lineage].filter(id => id !== rootId), rounds };
        for (const id of outputs) lineage.add(id);
        rounds++;
    }
}

function metrics(graph) {
    const initial = new Set([...graph.starters, ...graph.agents]);
    const minerals = new Set(graph.cards.filter(card => card.kind === 'mineral').map(card => card.id));
    const byId = new Map(graph.cards.map(card => [card.id, card]));
    const branches = graph.starters.map(id => {
        const { outputs, rounds } = branchFrom(graph.pairs, initial, id);
        return { id, name: byId.get(id).name, newMaterials: outputs.length, newMinerals: outputs.filter(id => minerals.has(id)).length, rounds };
    });
    const allMineralsUsed = new Set(graph.pairs.flatMap(pair => pair.inputs.filter(id =>
        minerals.has(id) && pair.reaction.outputs.some(out => !pair.inputs.includes(out)))));
    return {
        starters: graph.starters.length,
        firstPairs: graph.pairs.filter(pair => pair.inputs.every(id => initial.has(id)) && pair.reaction.outputs.some(id => !initial.has(id))).length,
        withoutDiscovery: branches.filter(r => !r.rounds).length,
        withoutSecondStep: branches.filter(r => r.rounds === 1).length,
        mineralsWithoutOutput: [...minerals].filter(id => !allMineralsUsed.has(id)).map(id => ({ id, name: byId.get(id).name })),
        reachableMinerals: graph.reachable.filter(id => minerals.has(id)).length,
        active: graph.active,
        pairs: graph.pairs.length,
        total: graph.total,
        branches,
    };
}

console.log(JSON.stringify({ reference, before: metrics(gameGraph(original)), after: metrics(gameGraph(current)) }, null, 2));
