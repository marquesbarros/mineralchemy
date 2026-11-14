import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = page.match(/<script>([\s\S]*)<\/script>/)?.[1];
assert.ok(script, 'script inline do jogo deve existir');

async function setup() {
  const handlers = new Map();
  const storage = new Map();
  const fakeClassList = { add() {}, remove() {}, toggle() {} };
  const fakeNode = () => ({
    innerHTML: '', textContent: '', value: '', style: {}, classList: fakeClassList,
    querySelectorAll() { return []; }, querySelector() { return null; },
    insertAdjacentHTML() {}, getBoundingClientRect() {
      return { width: 820, height: 540, left: 0, right: 820, top: 0, bottom: 540 };
    },
    addEventListener() {}, focus() { this.focused = true; },
    select() { this.selected = true; },
    setPointerCapture() {},
  });
  const nodes = new Map();
  const nodeFor = id => {
    if (!nodes.has(id)) nodes.set(id, fakeNode());
    return nodes.get(id);
  };
  const context = vm.createContext({
    document: { querySelector: nodeFor, querySelectorAll() { return []; } },
    window: { addEventListener(type, fn) { handlers.set(type, fn); } },
    localStorage: {
      getItem(key) { return storage.get(key) ?? null; },
      setItem(key, value) { storage.set(key, value); },
    },
    navigator: { vibrate() {} },
    setTimeout() { return 1; },
    clearTimeout() {},
    console,
    Element: class {},
    HTMLElement: class {},
    HTMLInputElement: class {},
  });
  vm.runInContext(script.replace(/void boot\(\);\s*$/, ''), context);
  await vm.runInContext('boot()', context);
  return { eval: code => vm.runInContext(code, context), storage, handlers, nodes };
}

test('busca é limpa depois de escolher uma peça, sem apagar descobertas', async () => {
  const h = await setup();
  const id = h.eval("knownItems()[0].id");
  h.eval("search = 'quartzo';");
  h.nodes.get('#catalogSearch').value = 'quartzo';
  assert.equal(typeof h.eval('selectLibraryPiece'), 'function');
  assert.equal(h.eval('selectLibraryPiece(' + JSON.stringify(id) + ')'), true);
  assert.equal(h.eval('search'), '');
  assert.equal(h.nodes.get('#catalogSearch').value, '');
  assert.equal(h.eval('pieces.length'), 1);
});

test('lista principal combina últimas peças utilizadas e ordenação A-Z', async () => {
  const h = await setup();
  const ids = h.eval("knownItems().slice(0, 3).map(x=>x.id)");
  h.eval("selectLibraryPiece(" + JSON.stringify(ids[0]) + "); selectLibraryPiece(" + JSON.stringify(ids[1]) + ");");
  const recent = h.eval('recentlyUsed.slice()');
  assert.deepEqual([...recent.slice(0, 2)], [ids[1], ids[0]]);
  const names = h.eval("getLibraryItems().map(x=>x.name)");
  assert.deepEqual([...names], [...names].sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })));
  assert.match(h.eval('libraryMarkup()'), /Usados recentemente/);
});

test('reagir usa apenas duas peças e não altera quadros com excesso de itens', async () => {
  const h = await setup();
  h.eval("pieces = [{instanceId:1,itemId:'oxide',x:200,y:150},{instanceId:2,itemId:'proton',x:260,y:150},{instanceId:3,itemId:'chloride',x:320,y:150}];");
  const before = h.eval('save.history.length');
  assert.equal(h.eval('reactBoard()'), false);
  assert.equal(h.eval('pieces.length'), 3);
  assert.equal(h.eval('save.history.length'), before);
  h.eval('pieces.pop()');
  assert.equal(h.eval('reactBoard()'), true);
  assert.equal(h.eval('save.history.length'), before + 1);
});

test('atalhos trabalham com busca e não capturam escrita em outros campos', async () => {
  const h = await setup();
  assert.ok(h.handlers.has('keydown'), 'atalho global precisa de um listener no window');
  const search = h.nodes.get('#catalogSearch');
  h.eval("handleGameplayShortcut({key:'/',target:{tagName:'BODY',isContentEditable:false},ctrlKey:false,metaKey:false,altKey:false,preventDefault(){} })");
  assert.equal(search.focused, true);
  h.eval("search = 'quartzo';");
  search.value = 'quartzo';
  h.eval("handleGameplayShortcut({key:'r',target:{tagName:'INPUT',id:'collectionSearch'},ctrlKey:false,metaKey:false,altKey:false,preventDefault(){} })");
  assert.equal(h.eval('search'), 'quartzo');
});

test('agentes exibem ícones vetoriais e vulcanismo tem nome mais específico', async () => {
  const h = await setup();
  assert.equal(h.eval("item('volcanism').name"), 'Cristalização vulcânica');
  for (const id of ['rain', 'air', 'reduction', 'impact', 'heat', 'hydrothermal', 'water']) {
    assert.match(h.eval('iconMarkup(item(' + JSON.stringify(id) + '))'), /<svg/);
  }
});
