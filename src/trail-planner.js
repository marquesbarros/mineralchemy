/** Plans use the same pairs as the bench. A discovered piece remains available in the collection. */
function plansToDiscover(catalog, known) {
    const plans = new Map([...known].map(id => [id, []]));
    let changed;
    do {
        changed = false;
        for (const pair of catalog.pairs) {
            if (!pair.inputs.every(id => plans.has(id))) continue;
            const actions = [...new Set([...pair.inputs.flatMap(id => plans.get(id)), pair])];
            for (const id of pair.reaction.outputs) {
                const previous = plans.get(id);
                if (!previous || actions.length < previous.length) {
                    plans.set(id, actions);
                    changed = true;
                }
            }
        }
    } while (changed);
    return plans;
}

function continuationOptions(catalog, focusId, known, cards) {
    const available = [];
    const blocked = [];
    if (!known.has(focusId) || !isPlayableCard(cards.get(focusId))) return { available, blocked };
    const candidates = catalog.pairs.filter(pair => pair.inputs.includes(focusId) &&
        pair.inputs.every(id => isPlayableCard(cards.get(id))));
    const plans = candidates.some(pair => !pair.inputs.every(id => known.has(id)))
        ? plansToDiscover(catalog, known) : null;
    for (const pair of candidates) {
        const partnerId = pair.inputs[0] === focusId ? pair.inputs[1] : pair.inputs[0];
        const newOutputs = pair.reaction.outputs.filter(id => !known.has(id) && isPlayableCard(cards.get(id)));
        const option = { ...pair, partnerId, newOutputs, prerequisite: null };
        if (known.has(partnerId)) {
            available.push(option);
        } else {
            const actions = plans?.get(partnerId);
            if (actions) blocked.push({ ...option, prerequisite: { targetId: partnerId, actions } });
        }
    }
    const discoveriesOn = option => option.newOutputs.filter(id => cards.get(id)?.kind === 'mineral').length;
    const byDiscovery = (a, b) => discoveriesOn(b) - discoveriesOn(a)
        || b.newOutputs.length - a.newOutputs.length;
    available.sort(byDiscovery);
    blocked.sort((a, b) => Number(b.newOutputs.length > 0) - Number(a.newOutputs.length > 0)
        || a.prerequisite.actions.length - b.prerequisite.actions.length || byDiscovery(a, b));
    return { available, blocked };
}
