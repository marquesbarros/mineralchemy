import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'Mineralchemy deve possuir script inline');

async function makeGame() {
  const nodes = new Map();
  const appEvents = new Map();
  const windowEvents = new Map();
  const storage = new Map();
  const classList = () => ({ add() {}, remove() {}, toggle() {} });
  class FakeInput {
    constructor() { this.value = ''; this.id = ''; this.tagName = 'INPUT'; this.classList = classList(); }
    focus() { this.focused = true; this.blurred = false; }
    blur() { this.blurred = true; this.focused = false; }
  }
  function node() {
    return { innerHTML: '', textContent: '', value: '', style: {}, dataset: {},
      classList: classList(), addEventListener() {}, querySelector() { return null; },
      querySelectorAll() { return []; }, insertAdjacentHTML() {}, setAttribute() {},
      getBoundingClientRect() { return { width: 800, height: 550, left: 0, top: 0, right: 800, bottom: 550 }; },
      focus() { this.focused = true; }, blur() { this.blurred = true; },
    };
  }
  const get = selector => {
    if (!nodes.has(selector)) {
      const el = selector === '#catalogSearch' ? new FakeInput() : node();
      if (selector === '#catalogSearch') el.id = 'catalogSearch';
      nodes.set(selector, el);
    }
    return nodes.get(selector);
  };
  const app = get('#app');
  app.addEventListener = (name, fn) => appEvents.set(name, fn);
  const context = vm.createContext({
    document: { querySelector: get, querySelectorAll() { return []; } },
    window: { addEventListener(name, fn) { windowEvents.set(name, fn); } },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    navigator: {}, setTimeout() { return 1; }, clearTimeout() {}, console,
    HTMLElement: class {}, HTMLInputElement: FakeInput, HTMLSelectElement: class {}, Element: class {},
  });
  const run = source => vm.runInContext(source, context);
  run(script.replace(/void boot\(\);\s*$/, ''));
  await run('boot()');
  return { run, get, appEvents, windowEvents };
}

function press(game, key, target = 'BODY', extras = '') {
  game.run(`handleGameplayShortcut({key:${JSON.stringify(key)},target:{tagName:${JSON.stringify(target)},isContentEditable:false},ctrlKey:false,metaKey:false,altKey:false,shiftKey:false,preventDefault(){},${extras}})`);
}

test('Tab abre e fecha o catálogo de descobertas sem ocultar a barra lateral', async () => {
  const g = await makeGame();
  assert.equal(g.run('modal'), null);
  press(g, 'Tab');
  assert.equal(g.run('modal'), 'collection');
  assert.match(g.run('modalMarkup()'), /class="dialog dialog-wide collection-dialog"/);
  assert.match(g.run('mainMarkup()'), /class="library"/);
  press(g, 'Tab');
  assert.equal(g.run('modal'), null);
  assert.match(g.run('mainMarkup()'), /class="library"/);
  assert.doesNotMatch(g.run('mainMarkup()'), /catalog-collapsed|toggle-catalog/);
});

test('Tab mantém navegação reversa e campos editáveis e não interfere em outros modais', async () => {
  const g = await makeGame();
  press(g, 'Tab', 'BODY', 'shiftKey:true,');
  assert.equal(g.run('modal'), null);
  press(g, 'Tab', 'INPUT');
  assert.equal(g.run('modal'), null);
  g.run("modal = 'history'");
  press(g, 'Tab');
  assert.equal(g.run('modal'), 'history');
});

test('digitação e busca no campo retornam à aba Tudo e abrangem todas as categorias', async () => {
  const g = await makeGame();
  g.run("filter = 'agent'; setLibrarySearch('calcio')");
  assert.equal(g.run('filter'), 'all');
  assert.ok(g.run("getLibraryItems().some(p => p.id === 'calcium_ion')"));
  g.run("filter = 'mineral'; search = ''");
  const input = g.get('#catalogSearch');
  input.value = 'calcio';
  g.appEvents.get('input')({ target: input });
  assert.equal(g.run('filter'), 'all');
  g.run("filter = 'compound'; search = ''");
  press(g, 'c');
  assert.equal(g.run('filter'), 'all');
  assert.equal(g.run('search'), 'c');
  assert.equal(g.run('modal'), null);
});

test('agrupamento por produto usa apenas reações concluídas e contempla múltiplas saídas', async () => {
  const g = await makeGame();
  const products = JSON.parse(g.run(`JSON.stringify(historyProductGroups([
    { reaction: { id: 'r1', outputs: ['quartz', 'water'] }, count: 1 },
    { reaction: { id: 'r2', outputs: ['quartz'] }, count: 1 },
  ]).map(group => ({ id: group.product.id, count: group.entries.length })))`));
  assert.deepEqual(products, [{ id: 'water', count: 1 }, { id: 'quartz', count: 2 }]);
  assert.equal(g.run('historyProductGroups([]).length'), 0);
  assert.doesNotMatch(g.run("historyGroup = 'product'; historySectionsMarkup()"), /<article class="reaction-entry">/);
});

test('histórico mantém agrupamento por processo e oferece modo por produto com filtros', async () => {
  const g = await makeGame();
  assert.match(g.run('modal = "history"; modalMarkup()'), /data-group="section"/);
  assert.match(g.run('modalMarkup()'), /data-group="product"/);
  const reactionId = g.run("engine.reactions.find(r => reactionCatalogEligible(r) && r.outputs.length).id");
  g.run(`save = discover(save, engine.byReaction.get(${JSON.stringify(reactionId)}), engine).save`);
  g.run("historyGroup = 'product'");
  const byProduct = g.run('historySectionsMarkup()');
  assert.match(byProduct, /<section class="history-section"/);
  assert.match(byProduct, /reaction-entry/);
  g.run("historyGroup = 'section'");
  const bySection = g.run('historySectionsMarkup()');
  assert.match(bySection, /<section class="history-section"/);
});
