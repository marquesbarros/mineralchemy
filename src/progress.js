const SAVE_KEY = 'mineralchemy:progress:v1';
const BOARD_KEY = 'mineralchemy:board:v05';
const RECENT_KEY = 'mineralchemy:recent:v1';
const SESSION_KEY = 'mineralchemy:session:v2';
const PROGRESS_FORMAT = 'mineralchemy-progress-v1';
const HIDDEN_ARCHIVED_IONS = new Set(['gold3', 'silicon4']);
const HISTORY_LIMIT = 100;
const BOARD_LIMIT = 120;

function makeInitialSave(cards) {
    return { version: 1, discovered: cards.filter(x => x.starter).map(x => x.id), history: [], recorded: [] };
}

function routeSnapshot(reaction) {
    return {
        inputs: [...reaction.inputs], outputs: [...reaction.outputs], agent: reaction.agent,
        equation: reaction.equation, summary: reaction.summary, conditions: reaction.conditions,
        environmentalInputs: reaction.environmentalInputs ? [...reaction.environmentalInputs] : undefined,
    };
}

function sanitizeSnapshot(snap) {
    const strings = list => Array.isArray(list) && list.length <= 20 &&
        list.every(id => typeof id === 'string' && id.length <= 100);
    if (!snap || !strings(snap.inputs) || !strings(snap.outputs) ||
        !(snap.agent === null || typeof snap.agent === 'string' && snap.agent.length <= 100) ||
        typeof snap.equation !== 'string' || typeof snap.summary !== 'string') return undefined;
    return routeSnapshot({
        inputs: snap.inputs.map(canonicalCardId), outputs: snap.outputs.map(canonicalCardId), agent: snap.agent,
        equation: snap.equation.slice(0, 2000), summary: snap.summary.slice(0, 2000),
        conditions: typeof snap.conditions === 'string' ? snap.conditions.slice(0, 2000) : undefined,
        environmentalInputs: strings(snap.environmentalInputs) ? snap.environmentalInputs.map(canonicalCardId) : undefined,
    });
}

function displayReaction(event, engine) {
    const current = engine.byReaction.get(event.reactionId);
    const snap = event.snapshot ?? current.legacyV09;
    if (!snap) return current;
    const matches = ['inputs', 'outputs', 'agent', 'equation', 'summary', 'conditions', 'environmentalInputs'].every(field =>
        (snap[field] === undefined && !['inputs', 'outputs', 'agent', 'equation', 'summary'].includes(field)) ||
            JSON.stringify(snap[field]) === JSON.stringify(current[field]),
    );
    return matches ? current : {
        ...current, conditions: '', environmentalInputs: [], ...snap, historicalSnapshot: true,
    };
}

function recordedKey(event, engine) {
    const reaction = displayReaction(event, engine);
    return JSON.stringify([event.reactionId, reaction.inputs, reaction.outputs, reaction.agent,
        reaction.equation, reaction.conditions, reaction.environmentalInputs]);
}

function aggregateReactions(events, engine) {
    const groups = new Map();
    for (const event of events) {
        const key = recordedKey(event, engine);
        const prior = groups.get(key);
        const count = event.count ?? 1;
        const firstAt = event.firstAt ?? event.at;
        groups.set(key, {
            reactionId: event.reactionId, snapshot: event.snapshot,
            count: Math.min(Number.MAX_SAFE_INTEGER, (prior?.count ?? 0) + count),
            firstAt: Math.min(prior?.firstAt ?? firstAt, firstAt),
            at: Math.max(prior?.at ?? event.at, event.at),
        });
    }
    return [...groups.values()];
}

function completedReactions(save, engine) {
    return (save.recorded ?? aggregateReactions(save.history, engine)).map(event => ({
        reaction: displayReaction(event, engine), count: event.count, firstAt: event.firstAt, lastAt: event.at,
    })).sort((a, b) => b.lastAt - a.lastAt);
}

function isProgress(value) {
    return value?.version === 1 && Array.isArray(value.discovered) && Array.isArray(value.history);
}

function restoreSave(raw, engine) {
    const initial = makeInitialSave(engine.cards);
    if (!isProgress(raw)) return initial;
    const validDate = value => Number.isFinite(value) && Math.abs(value) <= 8.64e15;
    const validEvent = e => e && typeof e.reactionId === 'string' && engine.byReaction.has(e.reactionId) && validDate(e.at);
    const events = raw.history.filter(validEvent).map(e => ({
        reactionId: e.reactionId, at: e.at, snapshot: sanitizeSnapshot(e.snapshot),
    }));
    const recorded = Array.isArray(raw.recorded)
        ? raw.recorded.filter(e => validEvent(e) && Number.isSafeInteger(e.count) && e.count > 0 &&
            validDate(e.firstAt) && e.firstAt <= e.at).map(e => ({
            reactionId: e.reactionId, at: e.at, firstAt: e.firstAt, count: e.count, snapshot: sanitizeSnapshot(e.snapshot),
        }))
        : events;
    const discovered = [...new Set([...initial.discovered, ...raw.discovered
        .filter(id => typeof id === 'string').map(canonicalCardId).filter(id => engine.byCard.has(id))])];
    return { version: 1, discovered, history: events.slice(-HISTORY_LIMIT), recorded: aggregateReactions(recorded, engine) };
}

function discover(save, reaction, engine) {
    if (!reaction) return { save, newIds: [] };
    const known = new Set(save.discovered);
    const newIds = reaction.outputs.filter(id => engine.byCard.has(id) && !known.has(id));
    const event = { reactionId: reaction.id, at: Date.now(), snapshot: routeSnapshot(reaction) };
    return {
        save: {
            version: 1,
            discovered: [...save.discovered, ...newIds],
            history: [...save.history, event].slice(-HISTORY_LIMIT),
            recorded: aggregateReactions([...(save.recorded ?? save.history), event], engine),
        },
        newIds,
    };
}

function makeProgressBackup(progress, board, recent) {
    return { format: PROGRESS_FORMAT, progress, board: board.slice(-BOARD_LIMIT), recent };
}

function readProgressBackup(raw, engine) {
    if (raw?.format !== PROGRESS_FORMAT || !isProgress(raw.progress) || !Array.isArray(raw.board) || !Array.isArray(raw.recent)) {
        throw new Error('Selecione um arquivo de progresso exportado pelo Mineralchemy.');
    }
    const progress = restoreSave(raw.progress, engine);
    const discovered = new Set([...progress.discovered, ...AVAILABLE_AGENTS]);
    const valid = id => discovered.has(id) && !HIDDEN_ARCHIVED_IONS.has(id);
    const board = [];
    const used = new Set();
    for (const p of raw.board.slice(-BOARD_LIMIT)) {
        if (!p || !Number.isSafeInteger(p.instanceId) || p.instanceId < 1 || used.has(p.instanceId) ||
            typeof p.itemId !== 'string' || !valid(canonicalCardId(p.itemId)) ||
            !Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
        board.push({ instanceId: p.instanceId, itemId: canonicalCardId(p.itemId), x: p.x, y: p.y });
        used.add(p.instanceId);
    }
    const recent = [...new Set(raw.recent.filter(id => typeof id === 'string').map(canonicalCardId).filter(valid))].slice(0, 8);
    return { progress, board, recent };
}
