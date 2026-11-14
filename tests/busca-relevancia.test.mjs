import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'script inline não encontrado');

async function game() {
  const elements = new Map();
  const storage = new Map();
  const node = () => ({
    value:'',innerHTML:'',textContent:'',style:{},
    classList:{add(){},remove(){},toggle(){}},
    addEventListener(){},querySelectorAll(){return []},querySelector(){return null},
    insertAdjacentHTML(){},getBoundingClientRect(){return {width:850,height:560,left:0,top:0,right:850,bottom:560}},
    focus(){this.focused=true},blur(){this.blurred=true}
  });
  const get = id => {
    if (!elements.has(id)) elements.set(id, node());
    return elements.get(id);
  };
  const context = vm.createContext({
    document:{querySelector:get,querySelectorAll(){return []}},
    window:{addEventListener(){}},
    localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},
    navigator:{},
    setTimeout(){return 1},clearTimeout(){},console,
    HTMLElement:class {},HTMLInputElement:class {},HTMLSelectElement:class {},Element:class {}
  });
  vm.runInContext(script.replace(/void boot\(\);\s*$/,''), context);
  await vm.runInContext('boot()', context);
  const run = source => vm.runInContext(source, context);
  const addDiscoveries = ids => run('save.discovered = [...new Set([...save.discovered, ...' + JSON.stringify(ids) + '])]');
  const search = term => {
    run('search = ' + JSON.stringify(term));
    return [...run('getLibraryItems().map(p=>p.id)')];
  };
  return {run,search,get,addDiscoveries};
}

test('busca ignora acentos, caixa e variantes Unicode', async () => {
  const g = await game();
  for(const term of ['calcio','cálcio','ca\u0301lcio','CALCIO'])
    assert.ok(g.search(term).includes('calcium_ion'), term);
  assert.ok(g.search('magnesio').includes('magnesium_ion'));
});

test('nome exato supera minerais que apenas contêm o mesmo trecho', async () => {
  const g = await game();
  g.addDiscoveries(['pyrite','arsenopyrite','chalcopyrite','pyrrhotite']);
  assert.equal(g.search('pirita')[0], 'pyrite');
  assert.equal(g.search('PIRITA')[0], 'pyrite');
  assert.equal(g.search('pir')[0], 'pyrite');
});

test('nomes iniciados pela busca superam correspondências secundárias na família', async () => {
  const g = await game();
  g.addDiscoveries(['quartz','calcite','chalcopyrite','pyrite','pyrophyllite']);
  assert.equal(g.search('quartzo')[0], 'quartz');
  assert.equal(g.search('calcita')[0], 'calcite');
  assert.equal(g.search('pirofilita')[0], 'pyrophyllite');
});

test('fórmulas são pesquisáveis mesmo digitadas sem subscritos', async () => {
  const g = await game();
  g.addDiscoveries(['hematite','quartz']);
  assert.equal(g.search('Fe2O3')[0], 'hematite');
  assert.ok(g.search('SiO2').includes('quartz'));
});

test('pequenos erros de digitação retornam mineral quando não há resultado direto', async () => {
  const g = await game();
  g.addDiscoveries(['pyrite','hematite']);
  assert.equal(g.search('piritaa')[0], 'pyrite');
  assert.equal(g.search('hematitaa')[0], 'hematite');
});

test('agente Hidrotermalismo mantém ID e aceita nome anterior como sinônimo', async () => {
  const g = await game();
  assert.equal(g.run("item('hydrothermal').name"), 'Hidrotermalismo');
  assert.equal(g.run("engine.agents.find(a=>a.id==='hydrothermal').name"), 'Hidrotermalismo');
  assert.equal(g.search('hidrotermalismo')[0], 'hydrothermal');
  assert.equal(g.search('fluido hidrotermal')[0], 'hydrothermal');
});

test('Enter adiciona a opção mais relevante e mantém a limpeza da busca', async () => {
  const g = await game();
  g.addDiscoveries(['pyrite','arsenopyrite','chalcopyrite']);
  g.run("search='pirita'");
  g.get('#catalogSearch').value='pirita';
  const id = g.run('getLibraryItems()[0].id');
  assert.equal(id,'pyrite');
  g.run("handleGameplayShortcut({key:'Enter',target:{tagName:'INPUT',id:'catalogSearch'},ctrlKey:false,metaKey:false,altKey:false,preventDefault(){}})");
  assert.equal(g.run('pieces.at(-1).itemId'),id);
  assert.equal(g.run('search'),'');
  assert.equal(g.get('#catalogSearch').value,'');
  assert.equal(g.get('#catalogSearch').blurred,true);
});

test('não sugere minerais não descobertos nem modifica as reações', async () => {
  const g = await game();
  assert.equal(g.search('pirita').includes('pyrite'),false);
  assert.equal(g.run('engine.reactions.length'),279);
  assert.equal(g.run('buildPairCatalog(engine).pairs.length'),269);
  assert.equal(g.run("engine.cards.filter(x=>x.kind==='mineral').length"),178);
  assert.equal(g.run('engine.diagnostics.length'),0);
});
