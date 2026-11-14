import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'script principal deve existir');
const context = vm.createContext({
  document: { querySelector: () => ({addEventListener(){}}) },
  window: { addEventListener() {} },
  localStorage: {getItem(){return null},setItem(){}},
  navigator: {}, setTimeout(){return 1}, clearTimeout(){}, console
});
vm.runInContext(script.replace(/void boot\(\);\s*$/, ''), context);
const evalGame = code => vm.runInContext(code, context);
const engine = evalGame('createEngine(EMBEDDED.cards, EMBEDDED.agents, EMBEDDED.reactions, EMBEDDED.rules)');
const active = new Set(engine.reactions.map(r=>r.id));
const pair = (a,b) => evalGame('buildPairCatalog(createEngine(EMBEDDED.cards, EMBEDDED.agents, EMBEDDED.reactions, EMBEDDED.rules))')
  .byPair.get([a,b].sort().join('::'));

test('serpentinização depende de fluido reativo, não de água simples',()=>{
  for(const id of ['s-serpentine-water','a-forsterite-water','s-olivine-water','a-olivine-water'])
    assert.equal(active.has(id),false,id);
  assert.equal(pair('forsterite','water'),undefined);
  assert.equal(pair('olivine','water'),undefined);
  assert.equal(pair('forsterite','hydrothermal')?.id,'a-forsterite-serp');
  assert.equal(pair('olivine','hydrothermal')?.id,'a-olivine-hydrothermal');
});

test('hidratação simples e dissolução continuam disponíveis',()=>{
  assert.ok(pair('anhydrite','water'));
  assert.ok(pair('periclase','water'));
  assert.ok(pair('lime','water'));
  assert.ok(pair('halite','water'));
  assert.equal(pair('enstatite','water'),undefined);
  assert.equal(pair('diopside','water'),undefined);
  assert.equal(pair('diopside','hydrothermal')?.id,'a-diopside-hydrothermal');
});

test('zeolitas e minerais do metamorfismo não nascem ao juntar água e cristal',()=>{
  for(const id of ['v08-analcime-1','v08-lawsonite-1','v08-prehnite-1','v08-laumontite-2','v08-clinoptilolite-2','v08-halloysite-1'])
    assert.equal(active.has(id),false,id);
  for(const name of ['nepheline','prehnite','albite','anorthite'])
    assert.equal(pair(name,'water'),undefined,name);
  assert.equal(pair('nepheline','hydrothermal')?.id,'a-nepheline-hydrothermal-analcime');
  assert.equal(pair('anorthite','hydrothermal')?.id,'a-anorthite-hydrothermal-prehnite');
  assert.equal(pair('anorthite','pressure')?.id,'a-anorthite-pressure-lawsonite');
  assert.equal(pair('albite','rain')?.id,'a-albite-weathering-halloysite');
});

test('água mantém o papel químico em hidrólise de Ti, sem virar hidrotermalismo indiscriminado',()=>{
  const r=pair('titanium4','water');
  assert.equal(r?.id,'v08-anatase-2');
  assert.match(r?.equation||'',/4 H⁺/);
});

test('lepidocrocita é ligada a precipitação/oxidação supergênica, não à transformação hidrotermal arbitrária de goethita',()=>{
  assert.equal(active.has('v08-lepidocrocite-1'),false);
  assert.equal(pair('goethite','hydrothermal'),undefined);
  assert.equal(pair('iron2','rain')?.id,'s-lepidocrocite-weathering');
});

test('talco é formado por reação com sílica e não por água isolada',()=>{
  const route=pair('lizardite','quartz');
  assert.equal(route?.id,'v08-alt-lizardite-quartz');
  assert.deepEqual([...route.outputs],['talc','water']);
  assert.equal(route.symbolic,false);
  assert.equal(route.mechanic,null);
  assert.equal(pair('enstatite','water'),undefined);
});

test('todas as espécies continuam alcançáveis, sem duplicações de pares e sem perder histórico',()=>{
  assert.equal(engine.diagnostics.length,0);
  const reached=evalGame('reachableIds(createEngine(EMBEDDED.cards, EMBEDDED.agents, EMBEDDED.reactions, EMBEDDED.rules))');
  assert.equal(engine.cards.filter(x=>x.kind==='mineral'&&reached.has(x.id)).length,178);
  assert.ok(engine.byReaction.has('s-serpentine-water'));
  assert.ok(engine.byReaction.get('s-serpentine-water').retired);
  const catalog=evalGame('buildPairCatalog(createEngine(EMBEDDED.cards, EMBEDDED.agents, EMBEDDED.reactions, EMBEDDED.rules))');
  assert.equal(new Set(catalog.pairs.map(p=>p.inputs.slice().sort().join('::'))).size,catalog.pairs.length);
});
