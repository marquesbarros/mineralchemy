import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(js, 'index.html deve incluir o motor de reações');

const app = { addEventListener() {} };
const context = vm.createContext({
  document: { querySelector(selector) { return selector === '#app' ? app : null; } },
  window: { addEventListener() {} },
  localStorage: { getItem() { return null; }, setItem() {} },
  navigator: {},
  setTimeout() { return 1; }, clearTimeout() {},
  console,
});
vm.runInContext(js.replace(/void boot\(\);\s*$/, ''), context);
const inspect = text => vm.runInContext(text, context);
const engine = inspect('createEngine(EMBEDDED.cards, EMBEDDED.agents, EMBEDDED.reactions, EMBEDDED.rules)');
const card = id => inspect('EMBEDDED.cards').find(x => x.id === id);
const activeIds = new Set(engine.reactions.map(r => r.id));

test('poda reduz rotas mas conserva o catálogo e os históricos', () => {
  assert.ok(engine.reactions.length < 350, 'deve haver corte expressivo das rotas');
  assert.equal(engine.diagnostics.length, 0);
  assert.equal(inspect('EMBEDDED.cards.filter(c=>c.kind === "mineral").length'), 178);
  assert.equal(engine.byReaction.has('v08-alt-muscovite-heat'), true, 'rota antiga deve ser reconhecida');
  assert.equal(activeIds.has('v08-alt-muscovite-heat'), false, 'atalho antigo não pode reagir');
});

test('as 178 espécies continuam alcançáveis no grafo', () => {
  const reachable = inspect('reachableIds(createEngine(EMBEDDED.cards, EMBEDDED.agents, EMBEDDED.reactions, EMBEDDED.rules))');
  for (const mineral of engine.cards.filter(c => c.kind === 'mineral')) {
    assert.ok(reachable.has(mineral.id), mineral.name + ' ficou inacessível');
  }
});

test('hidratação é diferente do intemperismo hematita-goethita', () => {
  const reaction = engine.byReaction.get('s-goethite');
  assert.deepEqual([...reaction.inputs], ['hematite', 'rain']);
  assert.equal(activeIds.has('a-hematite-water'), false);
  assert.equal(activeIds.has('v08-lepidocrocite-2'), false);
  assert.equal(activeIds.has('s-goethite'), true);
});

test('a redução de Fe(III) forma Fe(II), não ferro nativo', () => {
  const reaction = engine.byReaction.get('v08-alt-iron3-reduction');
  assert.deepEqual([...reaction.outputs], ['iron2']);
  assert.equal(activeIds.has(reaction.id), true);
});

test('anortita e os plagioclásios podem ser produzidos sem íons inventados', () => {
  assert.equal(activeIds.has('s-anorthite-oxides'), true);
  assert.equal(engine.byReaction.has('prepare-assemblage-corundum-lime'), true);
  assert.equal(engine.byReaction.has('complete-s-anorthite-oxides'), true);
});

test('íons sem função natural essencial não precisam ser ponto de partida', () => {
  assert.equal(card('gold3').starter, false);
  assert.equal(card('gold_native').starter, true);
  assert.equal(card('silicon4').starter, false);
  assert.equal(card('si').starter, true);
  assert.equal(activeIds.has('ion-gold-native'), false);
  assert.equal(activeIds.has('ion-silicon-neutral'), false);
});

test('as avaliações aprovadas pelo usuário são preservadas', () => {
  const approvedIds = [
    'assemble-water','assemble-co2','s-quartz','s-halite','s-hematite',
    's-periclase','s-lime','s-fluorite','s-corundum','s-pyrite','s-cuprite',
    's-enstatite','s-forsterite','s-wollastonite','s-calcite','s-magnesite',
    's-portlandite','a-halite-water','a-forsterite-serp','a-forsterite-carbon',
    'a-woll-carbon','a-brucite-carbon','a-lizardite-carbon','a-pyrite-air',
    'a-orthoclase-rain','a-kaolinite-rain','a-anhydrite-water','a-gypsum-heat',
    'a-calcite-rain','a-calcite-heat','a-magnesite-heat','a-portlandite-co2',
    'a-goethite-heat','a-cuprite-rain','a-lime-water','a-portlandite-heat',
    's-chalcopyrite','s-ferrosilite-direct','a-talc-heat','v08-jadeite-1',
    'prepare-assemblage-clinochlore-muscovite','complete-meta-clinochlore-muscovite-quartz',
    'prepare-assemblage-almandine-clinochlore','complete-meta-garnet-chlorite-muscovite',
    'prepare-assemblage-clinochlore-staurolite','complete-meta-staurolite-chlorite-muscovite',
    'prepare-assemblage-calcite-tremolite','complete-meta-tremolite-calcite-quartz'
  ];
  for (const id of approvedIds) assert.ok(activeIds.has(id), id + ' foi removida apesar da aprovação');
});

test('a bancada permanece livre de pares ambíguos após a poda', () => {
  const pairCatalog = inspect('buildPairCatalog(createEngine(EMBEDDED.cards, EMBEDDED.agents, EMBEDDED.reactions, EMBEDDED.rules))');
  const seen = new Set();
  for (const pair of pairCatalog.pairs) {
    const key = [...pair.inputs].sort().join('::');
    assert.equal(seen.has(key), false, 'par duplicado ' + key);
    seen.add(key);
  }
});
