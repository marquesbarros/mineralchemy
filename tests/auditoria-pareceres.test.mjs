import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const fingerprint = 'a'.repeat(64);
const otherVersion = 'b'.repeat(64);
const repository = 'mineralchemy';
const review = (overrides = {}) => ({
  status: 'approved',
  note: 'Parecer local',
  sources: [],
  routeFingerprint: fingerprint,
  catalogRevision: 'revisão 1',
  updatedAt: '2026-11-16T12:00:00.000Z',
  ...overrides,
});
const row = (id, overrides = {}) => ({
  id,
  family: 'Silicatos',
  process: 'alteracao',
  reviewStatus: 'condicional',
  active: true,
  executable: true,
  fingerprint,
  inputs: [{ name: 'Anortita', formula: 'CaAl₂Si₂O₈' }],
  outputs: [{ name: 'Lawsonita' }],
  ...overrides,
});
const audit = () => {
  const context = vm.createContext({ URL });
  const source = readFileSync(new URL('../src/audit.js', import.meta.url), 'utf8');
  vm.runInContext(source, context);
  return name => vm.runInContext(name, context);
};

test('pareceres legados preservam a decisão sem adquirir a versão da rota atual', () => {
  const run = audit();
  const legacy = run('readAuditReview')({ status: 'approved', note: 'Histórico' });
  assert.equal(legacy.routeFingerprint, null);
  assert.equal(run('reviewVersion')(row('lawsonita'), legacy), 'legacy');
  assert.equal(run('reviewVersion')(row('lawsonita'), review({ routeFingerprint: otherVersion })), 'stale');
  assert.equal(run('reviewVersion')(row('lawsonita'), review()), 'current');
});

test('filtros combinam família, processo e pendências de versão', () => {
  const run = audit();
  const rows = [
    row('atual'),
    row('mudou'),
    row('legado'),
    row('outra-familia', { family: 'Óxidos' }),
    row('outro-processo', { process: 'dissolucao' }),
  ];
  const reviews = new Map([
    ['atual', review()],
    ['mudou', review({ routeFingerprint: otherVersion })],
    ['legado', review({ routeFingerprint: null })],
    ['outra-familia', review({ routeFingerprint: null })],
    ['outro-processo', review({ routeFingerprint: null })],
  ]);
  const filters = { family: 'Silicatos', process: 'alteracao', pending: 'stale', query: 'ANORTITA' };
  const results = rows.filter(r => run('matchesAuditFilters')(r, filters, reviews.get(r.id)));
  assert.deepEqual(results.map(r => r.id), ['mudou', 'legado']);
});

test('importação mantém parecer local em conflito e preserva a versão dos pareceres recebidos', () => {
  const run = audit();
  const byId = new Map([['lawsonita', row('lawsonita')], ['anortita', row('anortita')]]);
  const local = new Map([['lawsonita', review()]]);
  const sources = [{ url: 'https://example.org/paper', claim: 'Delimita o campo de estabilidade.' }];
  const plan = run('prepareReviewImport')({
    format: 'mineralchemy-review-v2',
    repository,
    decisions: [
      { id: 'lawsonita', ...review({ status: 'revisit', routeFingerprint: otherVersion, sources }) },
      { id: 'anortita', ...review({ note: 'Novo parecer' }) },
    ],
  }, byId, local, repository);
  assert.equal(plan.conflicts.length, 1);
  assert.equal(plan.conflicts[0].local.note, 'Parecer local');
  const apply = run('applyReviewImport');
  assert.equal(apply(plan, local, new Set()).reviews.get('lawsonita').status, 'approved');
  const imported = apply(plan, local, new Set(['lawsonita'])).reviews;
  assert.equal(imported.get('lawsonita').routeFingerprint, otherVersion);
  assert.equal(imported.get('lawsonita').sources[0].claim, sources[0].claim);
  assert.equal(imported.get('anortita').note, 'Novo parecer');
  assert.equal(local.size, 1, 'somente o resultado contém alterações');
});

test('importação identifica IDs duplicados e uma versão local editada depois da conferência', () => {
  const run = audit();
  const byId = new Map([['lawsonita', row('lawsonita')]]);
  const local = new Map([['lawsonita', review()]]);
  const incoming = { id: 'lawsonita', ...review({ note: 'Parecer recebido' }) };
  const payload = { format: 'mineralchemy-review-v2', repository, decisions: [incoming] };
  const prepare = run('prepareReviewImport');
  assert.throws(() => prepare({ ...payload, decisions: [incoming, incoming] }, byId, local, repository), /repetido/i);
  const plan = prepare(payload, byId, local, repository);
  const changed = new Map([['lawsonita', review({ note: 'Edição posterior' })]]);
  const result = run('applyReviewImport')(plan, changed, new Set(['lawsonita']));
  assert.equal(result.reviews.get('lawsonita').note, 'Edição posterior');
  assert.equal(result.changed, 1);
});

test('importação v1 mantém a revisão de origem sem atribuir uma impressão digital', () => {
  const run = audit();
  const byId = new Map([['lawsonita', row('lawsonita')]]);
  const local = new Map();
  const plan = run('prepareReviewImport')({
    format: 'mineralchemy-review-v1',
    sourceRevision: 'commit antigo',
    decisions: [
      { id: 'lawsonita', status: 'pending', note: 'Parecer em andamento' },
      { id: 'id-fora-do-catalogo', status: 'rejected', note: 'Outro registro' },
    ],
  }, byId, local, repository);
  const evaluation = run('applyReviewImport')(plan, local, new Set()).reviews.get('lawsonita');
  assert.equal(evaluation.routeFingerprint, null);
  assert.equal(evaluation.catalogRevision, 'commit antigo');
  assert.equal(plan.unknown, 1);
});

test('uma segunda importação não atribui a revisão da exportação a um parecer legado', () => {
  const run = audit();
  const byId = new Map([['lawsonita', row('lawsonita')]]);
  const plan = run('prepareReviewImport')({
    format: 'mineralchemy-review-v2',
    repository,
    sourceRevision: 'revisão recente',
    decisions: [{ id: 'lawsonita', ...review({ routeFingerprint: null, catalogRevision: null }) }],
  }, byId, new Map(), repository);
  assert.equal(plan.additions[0].incoming.catalogRevision, null);
});

test('CSV informa o estado da rota e contém fontes e versão do parecer', () => {
  const run = audit();
  const route = row('lawsonita', { sources: [{ url: 'https://example.org/ref', claim: 'Parecer publicado' }] });
  const evaluation = review({ note: '=1+1', routeFingerprint: otherVersion });
  const csv = run('auditCsv')([route], new Map([[route.id, evaluation]]), 'revisão 2');
  assert.match(csv, /versao_avaliada/);
  assert.match(csv, /versao_atual/);
  assert.match(csv, /Parecer publicado/);
  assert.match(csv, /Versão anterior/);
  assert.match(csv, /"'=1\+1"/);
});
