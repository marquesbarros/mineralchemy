'use strict';

const auditDecisions = {
  pending: 'Sem decisão',
  approved: 'Aprovada por mim',
  rejected: 'Reprovada por mim',
  revisit: 'Revisar depois',
};
const auditVersions = {
  none: 'Sem parecer',
  legacy: 'Parecer sem versão da rota',
  stale: 'Versão anterior',
  current: 'Versão atual',
};
const auditProcesses = {
  associacao: 'Associação didática',
  'associacao-didatica': 'Associação didática',
  alteracao: 'Alteração',
  'alteracao-hidrotermal': 'Alteração hidrotermal',
  hidrotermalismo: 'Hidrotermalismo',
  intemperismo: 'Intemperismo',
  dissolucao: 'Dissolução',
  hidratacao: 'Hidratação',
  precipitacao: 'Precipitação',
  cristalizacao: 'Cristalização',
  metamorfismo: 'Metamorfismo',
  'equilibrio-polimorfico': 'Equilíbrio polimórfico',
  polimorfismo: 'Polimorfismo',
  'solucao-solida': 'Solução sólida',
  'oxidacao-reducao': 'Oxidação e redução',
  sintese: 'Síntese',
};
const auditReviewStates = {
  pendente: 'Revisão pendente',
  condicional: 'Interpretação condicional',
  didatica: 'Uso didático',
  arquivada: 'Arquivada',
  provisoria: 'Rota provisória',
  aprovada: 'Revisada',
  revisada: 'Revisada',
};
const auditEvidence = {
  equacao: 'Equação de referência',
  equilibrio: 'Equilíbrio de referência',
  semirreacao: 'Semirreação de referência',
  didatica: 'Expressão didática',
  balanco_ideal: 'Balanço idealizado',
  associacao: 'Associação simbólica',
};
const auditOrigins = {
  explicit: 'Cadastrada',
  family: 'Regra composicional',
  intuitive: 'Rota intuitiva',
  staging: 'Associação em etapas',
};

const escapeAudit = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const auditSearchText = value => String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
const auditProcessName = key => auditProcesses[key] ?? String(key || 'Processo a classificar')
  .replaceAll('-', ' ').replace(/^\p{Ll}/u, letter => letter.toUpperCase());
const auditRouteProcess = route => route.processLabel ?? auditProcessName(route.process);
const auditRouteState = route => route.reviewLabel ?? auditReviewStates[route.reviewStatus] ?? 'Situação a classificar';
const auditRouteSources = route => route.sources ?? (route.source ? [{ url: route.source, claim: '' }] : []);
const auditAvailability = route => route.executable ? 'Executável' : route.active ? 'No catálogo ativo' : 'Arquivada';

function auditSourceUrl(value) {
  if (typeof value !== 'string' || value.length > 2048 || !/^https?:\/\//i.test(value.trim())) return null;
  try {
    const url = new URL(value.trim());
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function readAuditReview(value, { legacy = false, sourceRevision = null } = {}) {
  if (!value || !Object.hasOwn(auditDecisions, value.status)) throw new Error('decisão inválida');
  if (value.note != null && (typeof value.note !== 'string' || (!legacy && value.note.length > 20000))) {
    throw new Error('justificativa inválida');
  }
  if (value.updatedAt != null && (typeof value.updatedAt !== 'string' || !Number.isFinite(Date.parse(value.updatedAt)))) {
    throw new Error('data inválida');
  }
  const routeFingerprint = legacy ? null : value.routeFingerprint ?? null;
  if (routeFingerprint !== null && (typeof routeFingerprint !== 'string' || !/^[a-f0-9]{64}$/i.test(routeFingerprint))) {
    throw new Error('versão da rota inválida');
  }
  const catalogRevision = legacy || !Object.hasOwn(value, 'catalogRevision') ? sourceRevision : value.catalogRevision;
  if (catalogRevision !== null && (typeof catalogRevision !== 'string' || catalogRevision.length > 200)) {
    throw new Error('revisão do catálogo inválida');
  }
  const sourceItems = legacy ? [] : value.sources ?? [];
  if (!Array.isArray(sourceItems)) throw new Error('lista de fontes inválida');
  const sources = sourceItems.map(source => {
    const url = auditSourceUrl(source?.url);
    const claim = typeof source?.claim === 'string' ? source.claim.trim() : '';
    if (!url || !claim || claim.length > 4000) throw new Error('cada fonte precisa de um link HTTP(S) e de uma indicação do que sustenta');
    return { url, claim };
  });
  return {
    status: value.status,
    note: value.note ?? '',
    sources,
    routeFingerprint: routeFingerprint?.toLowerCase() ?? null,
    catalogRevision,
    updatedAt: value.updatedAt ?? null,
  };
}

function reviewVersion(route, review) {
  if (!review) return 'none';
  if (!review.routeFingerprint || !route.fingerprint) return 'legacy';
  return route.fingerprint === review.routeFingerprint ? 'current' : 'stale';
}

function hasAuditPending(route, review, filter) {
  const version = reviewVersion(route, review);
  const outdated = version === 'stale' || version === 'legacy';
  switch (filter) {
    case 'priority': return Boolean(route.priority);
    case 'stale': return outdated;
    case 'unreviewed': return version === 'none' || review.status === 'pending' || review.status === 'revisit' || outdated;
    case 'sources': return !['especifica', 'específica', 'referência_específica', 'referencia_especifica', 'escopo_documentado'].includes(route.sourceSpecificity);
    default: return true;
  }
}

function matchesAuditFilters(route, filters, review, indexedText = null) {
  const { query, family, process, pending, availability, origin, decision } = filters;
  if (family && family !== 'all' && route.family !== family) return false;
  if (process && process !== 'all' && route.process !== process) return false;
  if (origin && origin !== 'all' && route.origin !== origin) return false;
  if (decision && decision !== 'all' && decision !== (review?.status ?? 'pending')) return false;
  if (availability === 'active' && !route.active) return false;
  if (availability === 'executable' && !route.executable) return false;
  if (availability === 'retired' && route.active) return false;
  if (!hasAuditPending(route, review, pending)) return false;
  return !query || (indexedText ?? indexAuditRoute(route)).includes(auditSearchText(query.trim()));
}

function indexAuditRoute(route) {
  const pieces = [...route.inputs, ...route.outputs, ...(route.environmentalInputs ?? []), ...(route.agent ? [route.agent] : [])];
  return auditSearchText([
    route.id, route.family, auditRouteProcess(route), route.summary, route.conditions,
    route.equation, route.issue, ...pieces.flatMap(piece => [piece.name, piece.formula]),
  ].join(' '));
}

function sameAuditReview(left, right) {
  if (!left || !right) return left === right;
  return left.status === right.status && left.note === right.note &&
    left.routeFingerprint === right.routeFingerprint &&
    (Boolean(left.routeFingerprint) || left.catalogRevision === right.catalogRevision) &&
    JSON.stringify(left.sources) === JSON.stringify(right.sources);
}

function prepareReviewImport(payload, byId, reviews, repository) {
  const legacy = payload?.format === 'mineralchemy-review-v1';
  if ((!legacy && payload?.format !== 'mineralchemy-review-v2') || !Array.isArray(payload.decisions)) {
    throw new Error('Use um arquivo JSON de pareceres exportado pelo Mineralchemy.');
  }
  if (payload.repository && payload.repository !== repository) throw new Error('O arquivo pertence a outro catálogo.');
  const plan = { additions: [], conflicts: [], unchanged: 0, unknown: 0 };
  const seen = new Set();
  for (const item of payload.decisions) {
    if (!item || typeof item.id !== 'string' || !item.id) throw new Error('O arquivo contém um parecer sem identificador.');
    if (seen.has(item.id)) throw new Error('Identificador repetido no arquivo: ' + item.id);
    seen.add(item.id);
    if (!byId.has(item.id)) {
      plan.unknown++;
      continue;
    }
    let incoming;
    try {
      incoming = readAuditReview(item, { legacy, sourceRevision: payload.sourceRevision });
    } catch (err) {
      throw new Error(item.id + ' — ' + err.message, { cause: err });
    }
    const local = reviews.get(item.id);
    if (sameAuditReview(local, incoming)) plan.unchanged++;
    else if (local) plan.conflicts.push({ id: item.id, incoming, local });
    else plan.additions.push({ id: item.id, incoming });
  }
  return plan;
}

function applyReviewImport(plan, existing, replacements) {
  const reviews = new Map(existing);
  let added = 0;
  let replaced = 0;
  let changed = 0;
  for (const { id, incoming } of plan.additions) {
    if (existing.has(id)) changed++;
    else {
      reviews.set(id, incoming);
      added++;
    }
  }
  for (const { id, incoming, local } of plan.conflicts) {
    if (!replacements.has(id)) continue;
    if (!sameAuditReview(existing.get(id), local)) changed++;
    else {
      reviews.set(id, incoming);
      replaced++;
    }
  }
  return { reviews, added, replaced, changed };
}

function auditRouteContext(route) {
  return {
    fingerprint: route.fingerprint ?? null,
    family: route.family,
    process: route.process,
    reviewStatus: route.reviewStatus,
    active: Boolean(route.active),
    executable: Boolean(route.executable),
    equation: route.equation,
    reference: route.reference,
    conditions: route.conditions,
    environmentalInputs: route.environmentalInputs,
    sources: auditRouteSources(route),
    evidence: route.evidence,
    issue: route.issue,
    priority: route.priority,
    archivalNote: route.archivalNote,
  };
}

function auditCsv(rows, reviews, revision) {
  const quote = value => {
    const text = String(value ?? '');
    const needsPrefix = /^[\t\r\n]|^\s*[=+\-@＝＋－＠]/u.test(text);
    return '"' + (needsPrefix ? "'" : '') + text.replaceAll('"', '""') + '"';
  };
  const fields = [
    'id', 'origem', 'familia', 'processo', 'tipo_de_evidencia', 'situacao_catalogo', 'disponibilidade',
    'entradas', 'agente', 'produtos', 'componentes_do_meio', 'equacao', 'condicoes', 'fontes_catalogo', 'especificidade_das_fontes',
    'prioridade', 'pendencia', 'motivo_do_arquivamento', 'minha_decisao', 'justificativa', 'fontes_parecer', 'situacao_parecer',
    'versao_avaliada', 'versao_atual', 'revisao_avaliada', 'revisao_atual', 'data_parecer',
  ];
  const lines = rows.map(route => {
    const review = reviews.get(route.id);
    return [
      route.id, auditOrigins[route.origin] ?? route.origin, route.family, auditRouteProcess(route),
      auditEvidence[route.evidence] ?? route.evidence, auditRouteState(route), auditAvailability(route),
      route.inputs.map(x => x.name).join(' + '), route.agent?.name, route.outputs.map(x => x.name).join(' + '),
      route.environmentalInputs?.map(x => x.name).join(' + '),
      route.equation, route.conditions, JSON.stringify(auditRouteSources(route)), route.sourceSpecificity,
      route.priority, route.issue, route.archivalNote, auditDecisions[review?.status ?? 'pending'], review?.note,
      JSON.stringify(review?.sources ?? []), auditVersions[reviewVersion(route, review)], review?.routeFingerprint,
      route.fingerprint, review?.catalogRevision, revision, review?.updatedAt,
    ];
  });
  return '\uFEFF' + [fields, ...lines].map(line => line.map(quote).join(';')).join('\r\n');
}

function auditRouteLabel(route) {
  const inputs = route.inputs.map(piece => piece.name).join(' + ');
  const outputs = route.outputs.map(piece => piece.name).join(' + ');
  return inputs + (route.agent ? ' · ' + route.agent.name : '') + ' → ' + outputs;
}

function auditSourceList(sources) {
  const items = sources.map(({ url, claim }) => {
    const link = auditSourceUrl(url);
    return link ? `<li><a href="${escapeAudit(link)}" target="_blank" rel="noopener noreferrer">${escapeAudit(url)}</a>${claim ? `<p>${escapeAudit(claim)}</p>` : ''}</li>` : '';
  }).join('');
  return items ? `<ul class="source-list">${items}</ul>` : '<p>Fontes a registrar.</p>';
}

function auditOptions(options, selected) {
  return Object.entries(options).map(([key, label]) =>
    `<option value="${escapeAudit(key)}"${selected === key ? ' selected' : ''}>${escapeAudit(label)}</option>`,
  ).join('');
}

function auditReviewForm(route, draft, review, dirty) {
  const version = reviewVersion(route, review);
  const message = version === 'stale' ? 'A rota mudou após este parecer. Confira a ficha antes de salvar para a versão atual.'
    : version === 'legacy' ? 'Este parecer foi salvo antes do registro de versões por rota. Confira a ficha antes de vinculá-lo à versão atual.'
      : version === 'current' ? 'O parecer salvo acompanha a versão atual da rota.' : '';
  const sources = (draft.sources ?? []).map(({ url, claim }, index) =>
    `<div class="review-source">
      <label class="field">Link da fonte ${index + 1}<input type="url" name="sourceUrl" required maxlength="2048" value="${escapeAudit(url)}" placeholder="https://doi.org/…"></label>
      <label class="field">O que a fonte ${index + 1} sustenta<input name="sourceClaim" required maxlength="4000" value="${escapeAudit(claim)}"></label>
      <button class="action action-small" type="button" data-remove-source="${index}">Remover fonte ${index + 1}</button>
    </div>`,
  ).join('');
  return `<section class="status-panel" aria-labelledby="review-heading">
    <h3 id="review-heading">Seu parecer</h3>
    ${message ? `<p class="${['stale', 'legacy'].includes(version) ? 'priority' : ''}">${message}</p>` : ''}
    <form id="reviewForm" class="review-form">
      <label class="field">Decisão<select id="reviewDecision">${auditOptions(auditDecisions, draft.status ?? 'pending')}</select></label>
      <label class="field">Justificativa<textarea id="note" maxlength="20000">${escapeAudit(draft.note)}</textarea></label>
      <fieldset class="review-sources"><legend>Fontes do parecer</legend>
        ${sources}
        <button class="action action-small" type="button" id="addReviewSource">Adicionar fonte</button>
      </fieldset>
      <div class="review-footer">
        <button class="action action-primary" type="submit">Salvar parecer</button>
        ${review || dirty ? '<button class="action action-small" type="button" id="clearReview">Limpar parecer</button>' : ''}
        <span class="tiny" id="savedLabel" role="status">${dirty ? 'Rascunho nesta página. Salve para incluir na próxima exportação.' : ''}</span>
      </div>
    </form>
  </section>`;
}

function auditRouteSheet(route, draft, review, dirty) {
  const chip = material => `<span class="piece"><b>${escapeAudit(material.name)}</b>${material.formula ? `<small>${escapeAudit(material.formula)}</small>` : ''}</span>`;
  const group = pieces => pieces.map(chip).join('<span class="plus" aria-hidden="true">+</span>');
  const sourceNote = route.sourceSpecificity === 'referência_genérica' ? 'A referência registrada aborda a família ou o processo de modo geral.' :
    route.sourceSpecificity === 'a_verificar' ? 'A relação entre a fonte registrada e a rota está em revisão.' : '';
  const condition = route.agent && `<span class="piece"><b>Agente da bancada</b><small>${escapeAudit(route.agent.name)}</small></span>`;
  const evidence = route.reference?.arrow === '⇌' ? auditEvidence.equilibrio : auditEvidence[route.evidence] ?? route.evidence ?? 'Evidência';
  return `<div class="detailheader">
      <div><div class="labelcaps">${escapeAudit(route.id)}</div><div class="detail-title">${escapeAudit(auditRouteLabel(route))}</div></div>
      <span class="tag ${route.executable ? 'green' : route.active ? 'blue' : 'warn'}">${auditAvailability(route)}</span>
    </div>
    <div class="equation-area"><div class="labelcaps">Peças e produtos do jogo</div>
      <div class="piece-line">${group(route.inputs)}${condition || ''}<span class="then" aria-hidden="true">→</span>${group(route.outputs)}</div>
    </div>
    <section class="section"><h3>${escapeAudit(evidence)}</h3>
      ${route.equation ? `<div class="eq">${escapeAudit(route.equation)}</div>` : '<p>Equação de referência a definir.</p>'}
      ${route.equationNote ? `<p>${escapeAudit(route.equationNote)}</p>` : ''}
    </section>
    <section class="section"><h3>Interpretação</h3><p>${escapeAudit(route.summary)}</p></section>
    <section class="section"><h3>Condições e limitações</h3><p>${escapeAudit(route.conditions || 'Condições a especificar.')}</p>
      ${route.environmentalInputs?.length ? `<p><strong>Componentes do meio</strong> ${escapeAudit(route.environmentalInputs.map(x => x.name).join(', '))}</p>` : ''}
    </section>
    <section class="section"><h3>Classificação e situação no catálogo</h3>
      <p>${escapeAudit(auditOrigins[route.origin] ?? route.origin)} · ${escapeAudit(route.family)} · ${escapeAudit(auditRouteProcess(route))}</p>
      <p>${escapeAudit(auditRouteState(route))}</p>
      ${route.archivalNote ? `<p>${escapeAudit(route.archivalNote)}</p>` : ''}
    </section>
    ${route.issue ? `<div class="priority"><strong>Pendência ${escapeAudit(route.priority)}</strong>${escapeAudit(route.issue)}</div>` : ''}
    <section class="section"><h3>Fontes do catálogo</h3><div class="sourcebox">${auditSourceList(auditRouteSources(route))}</div>${sourceNote ? `<p>${sourceNote}</p>` : ''}</section>
    ${auditReviewForm(route, draft, review, dirty)}`;
}

function startAudit() {
  const get = id => document.getElementById(id);
  const data = JSON.parse(get('payload').textContent);
  const routes = data.entries;
  const byId = new Map(routes.map(route => [route.id, route]));
  const searchIndex = new Map(routes.map(route => [route.id, indexAuditRoute(route)]));
  const list = get('list');
  const detail = get('detailbody');
  const details = get('details');
  const pager = get('pager');
  const detailTitle = get('audit-detail-title');
  const mobile = window.matchMedia('(max-width:740px)');
  const importDialog = get('importDialog');
  const importFile = get('importFile');
  const storageKey = 'mineralchemy:scientific-review:v2';
  const legacyKey = 'mineralchemy:scientific-review:v1';
  const pageSize = 35;
  const filters = {
    query: get('search'), family: get('familyFilter'), process: get('processFilter'),
    pending: get('pendingFilter'), origin: get('origin'), decision: get('decisionFilter'),
    availability: get('routeFilter'),
  };
  const drafts = new Map();
  let selectedId = byId.has('a-talc-heat') ? 'a-talc-heat' : routes[0]?.id ?? null;
  let plannedImport = null;
  let page = 0;
  let unsaved = false;
  let reviews = readStorage() ?? new Map();

  for (const [filter, property, label] of [[filters.family, 'family', route => route.family], [filters.process, 'process', auditRouteProcess]]) {
    const options = new Map(routes.filter(route => route[property]).map(route => [route[property], label(route)]));
    for (const [key, title] of [...options].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))) {
      filter.add(new Option(title, key));
    }
  }

  function readStorage() {
    try {
      const stored = localStorage.getItem(storageKey);
      const record = JSON.parse(stored ?? localStorage.getItem(legacyKey) ?? '{}');
      if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
      const result = new Map();
      for (const [id, value] of Object.entries(record)) {
        try {
          result.set(id, readAuditReview(value, { legacy: stored === null }));
        } catch {
          // Keep the remaining entries available if one saved record is invalid.
        }
      }
      return result;
    } catch {
      return null;
    }
  }

  function saveStorage(next) {
    reviews = next;
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(reviews)));
      unsaved = false;
    } catch {
      unsaved = true;
    }
    return unsaved ? 'O navegador bloqueou o salvamento local. Exporte o JSON para guardar o parecer.' : 'Parecer salvo neste navegador.';
  }

  function latestReviews() {
    return unsaved ? new Map(reviews) : readStorage() ?? new Map(reviews);
  }

  function statusTags(route) {
    const review = reviews.get(route.id);
    const version = reviewVersion(route, review);
    const status = review?.status ?? 'pending';
    return [
      `<span class="tag ${{ approved: 'green', rejected: 'red', revisit: 'warn' }[status] ?? ''}">${auditDecisions[status]}</span>`,
      ['stale', 'legacy'].includes(version) ? '<span class="tag warn">Parecer a reavaliar</span>' : '',
      route.priority ? `<span class="tag red">${escapeAudit(route.priority)}</span>` : '',
      !route.active ? '<span class="tag warn">Arquivada</span>' : '',
      `<span class="tag">${escapeAudit(auditRouteProcess(route))}</span>`,
    ].join('');
  }

  function showList() {
    const values = Object.fromEntries(Object.entries(filters).map(([name, element]) => [name, element.value]));
    const found = routes.filter(route => matchesAuditFilters(route, values, reviews.get(route.id), searchIndex.get(route.id)));
    const pages = Math.ceil(found.length / pageSize);
    page = Math.max(0, Math.min(page, pages - 1));
    get('resultCount').textContent = `${found.length} registros encontrados`;
    get('listCaption').textContent = `${found.length} de ${routes.length}`;
    if (!found.length) list.innerHTML = '<div class="empty">Nenhuma rota com esses filtros.</div>';
    else list.innerHTML = found.slice(page * pageSize, (page + 1) * pageSize).map(route =>
      `<button type="button" class="item${route.id === selectedId ? ' selected' : ''}" data-open="${escapeAudit(route.id)}" aria-controls="details"${route.id === selectedId ? ' aria-current="true"' : ''}>
        <span class="itemtop"><span class="itemid">${escapeAudit(route.id)}</span><span class="tag">${escapeAudit(auditOrigins[route.origin] ?? route.origin)}</span></span>
        <span class="route">${escapeAudit(auditRouteLabel(route))}</span>
        <span class="minitags">${statusTags(route)}</span>
      </button>`,
    ).join('');
    pager.innerHTML = `<button data-page="prev"${page === 0 ? ' disabled' : ''}>← Anterior</button><span>${pages ? `Página ${page + 1} de ${pages}` : ''}</span><button data-page="next"${page >= pages - 1 ? ' disabled' : ''}>Próxima →</button>`;
  }

  function showStats() {
    const reviewed = routes.filter(route => {
      const review = reviews.get(route.id);
      return reviewVersion(route, review) === 'current' && review.status !== 'pending';
    }).length;
    const stats = [
      [routes.filter(route => route.active).length, 'no catálogo ativo'],
      [routes.filter(route => !route.active).length, 'arquivadas'],
      [routes.filter(route => route.executable).length, 'pares executáveis'],
      [reviewed, 'pareceres na versão atual'],
    ];
    get('stats').innerHTML = stats.map(([number, label]) => `<div class="stat"><strong>${number}</strong><span>${label}</span></div>`).join('');
  }

  function showDetail() {
    const route = byId.get(selectedId);
    const review = reviews.get(selectedId);
    detail.innerHTML = route ? auditRouteSheet(route, drafts.get(selectedId) ?? review ?? {}, review, drafts.has(selectedId))
      : '<div class="empty">Selecione uma rota para abrir a ficha.</div>';
  }

  function refresh() {
    showList();
    showStats();
    showDetail();
  }

  function setMobileSheet(open) {
    const modal = open && mobile.matches;
    details.classList.toggle('show', open);
    for (const element of document.querySelectorAll('.masthead, .heading, .notice, .toolbar, .workbench > .panel:first-child')) {
      element.inert = modal;
    }
    if (modal) {
      details.setAttribute('role', 'dialog');
      details.setAttribute('aria-modal', 'true');
    } else {
      details.removeAttribute('role');
      details.removeAttribute('aria-modal');
    }
  }

  function openRoute(id, focus = true) {
    if (!byId.has(id)) return;
    selectedId = id;
    showDetail();
    showList();
    setMobileSheet(true);
    details.scrollTop = 0;
    if (focus) detailTitle.focus({ preventScroll: true });
    const url = new URL(window.location.href);
    url.searchParams.set('r', id);
    try {
      history.replaceState(null, '', url);
    } catch {
      // The detail panel still works when the host disallows history changes.
    }
  }

  function closeMobileSheet() {
    setMobileSheet(false);
    const button = [...list.querySelectorAll('[data-open]')].find(el => el.dataset.open === selectedId);
    (button ?? filters.query).focus();
  }

  function draftFromForm() {
    const urls = [...detail.querySelectorAll('[name="sourceUrl"]')];
    const claims = [...detail.querySelectorAll('[name="sourceClaim"]')];
    return {
      status: get('reviewDecision').value,
      note: get('note').value,
      sources: urls.map((input, i) => ({ url: input.value, claim: claims[i].value })),
    };
  }

  function saveReview(event) {
    if (event.target.id !== 'reviewForm') return;
    event.preventDefault();
    const route = byId.get(selectedId);
    try {
      const review = readAuditReview({
        ...draftFromForm(), routeFingerprint: route.fingerprint,
        catalogRevision: data.revision, updatedAt: new Date().toISOString(),
      });
      const next = latestReviews();
      next.set(route.id, review);
      const message = saveStorage(next);
      drafts.delete(route.id);
      refresh();
      get('savedLabel').textContent = message;
      detail.querySelector('button[type="submit"]').focus({ preventScroll: true });
    } catch (err) {
      get('savedLabel').textContent = 'Confira o parecer: ' + err.message + '.';
    }
  }

  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function exportReviews() {
    const decisions = [...reviews].map(([id, review]) => {
      const route = byId.get(id);
      return { id, ...review, versionStatus: route ? reviewVersion(route, review) : 'unknown', route: route ? auditRouteContext(route) : null };
    });
    const payload = {
      format: 'mineralchemy-review-v2', repository: data.repository, sourceRevision: data.revision,
      exportedAt: new Date().toISOString(), decisions,
    };
    download('mineralchemy-pareceres.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
  }

  function importDescription(title, route, review) {
    return `<div class="import-description"><strong>${title}</strong>
      <p>${auditDecisions[review.status]} · ${auditVersions[reviewVersion(route, review)]}</p>
      <p>${escapeAudit(review.note || 'Justificativa em branco.')}</p>
      ${review.sources.length ? auditSourceList(review.sources) : ''}
    </div>`;
  }

  async function previewImport(file) {
    const payload = JSON.parse(await file.text());
    const plan = prepareReviewImport(payload, byId, latestReviews(), data.repository);
    const summary = `${plan.additions.length} novos, ${plan.conflicts.length} em conflito, ${plan.unchanged} iguais e ${plan.unknown} fora deste catálogo.`;
    if (!plan.additions.length && !plan.conflicts.length) {
      get('auditStatus').textContent = summary;
      return;
    }
    plannedImport = plan;
    get('importSummary').textContent = summary + (plan.conflicts.length ? ' Marque os pareceres importados que devem substituir os locais.' : '');
    get('importConflicts').innerHTML = plan.conflicts.map(({ id, incoming, local }) => {
      const route = byId.get(id);
      return `<div class="import-conflict">
        <p>${escapeAudit(auditRouteLabel(route))}</p>
        <div class="import-columns">${importDescription('Parecer local', route, local)}${importDescription('Parecer do arquivo', route, incoming)}</div>
        <label><input type="checkbox" name="replaceAudit" value="${escapeAudit(id)}"> Substituir parecer de ${escapeAudit(id)}</label>
      </div>`;
    }).join('');
    importDialog.showModal();
    get('importTitle').focus();
  }

  list.addEventListener('click', event => {
    const button = event.target.closest('[data-open]');
    if (button) openRoute(button.dataset.open);
  });
  pager.addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (!button) return;
    page += button.dataset.page === 'next' ? 1 : -1;
    showList();
    list.scrollTop = 0;
    const nextButton = pager.querySelector(`[data-page="${button.dataset.page}"]:enabled`);
    (nextButton ?? list.querySelector('[data-open]'))?.focus();
  });
  get('back').addEventListener('click', closeMobileSheet);
  mobile.addEventListener('change', () => {
    const open = details.classList.contains('show');
    setMobileSheet(open);
    if (open && mobile.matches) detailTitle.focus({ preventScroll: true });
  });
  details.addEventListener('keydown', event => {
    if (!mobile.matches || !details.classList.contains('show')) return;
    if (event.key === 'Escape') closeMobileSheet();
    if (event.key !== 'Tab') return;
    const controls = details.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]');
    const first = controls[0];
    const last = controls[controls.length - 1];
    const wrapBack = event.shiftKey && [first, detailTitle].includes(document.activeElement);
    const wrapForward = !event.shiftKey && document.activeElement === last;
    if (wrapBack || wrapForward) {
      event.preventDefault();
      (wrapBack ? last : first)?.focus();
    }
  });
  detail.addEventListener('input', event => {
    if (!event.target.closest('#reviewForm')) return;
    drafts.set(selectedId, draftFromForm());
    get('savedLabel').textContent = 'Rascunho nesta página. Salve para incluir na próxima exportação.';
  });
  detail.addEventListener('submit', saveReview);
  detail.addEventListener('click', event => {
    if (event.target.id === 'clearReview') {
      const next = latestReviews();
      next.delete(selectedId);
      const message = saveStorage(next);
      drafts.delete(selectedId);
      refresh();
      get('savedLabel').textContent = unsaved ? message : 'Parecer removido.';
      get('reviewDecision').focus({ preventScroll: true });
      return;
    }
    const button = event.target.closest('[data-remove-source]');
    const adding = event.target.id === 'addReviewSource';
    if (!button && !adding) return;
    const draft = draftFromForm();
    if (adding) draft.sources.push({ url: '', claim: '' });
    else draft.sources.splice(Number(button.dataset.removeSource), 1);
    drafts.set(selectedId, draft);
    showDetail();
    (adding ? detail.querySelector('input[name="sourceUrl"]:invalid') : get('addReviewSource'))?.focus();
  });

  for (const [name, control] of Object.entries(filters)) {
    control.addEventListener(name === 'query' ? 'input' : 'change', () => {
      page = 0;
      showList();
    });
  }
  get('clearFilters').addEventListener('click', () => {
    for (const [name, control] of Object.entries(filters)) control.value = name === 'query' ? '' : name === 'availability' ? 'active' : 'all';
    page = 0;
    showList();
    filters.query.focus();
  });
  get('exportJson').addEventListener('click', exportReviews);
  get('exportCsv').addEventListener('click', () => download('mineralchemy-catalogo-completo.csv', auditCsv(routes, reviews, data.revision), 'text/csv;charset=utf-8'));
  get('importBtn').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', async () => {
    const file = importFile.files?.[0];
    if (!file) return;
    try {
      await previewImport(file);
    } catch (err) {
      get('auditStatus').textContent = 'Falha na importação: ' + err.message;
    } finally {
      importFile.value = '';
    }
  });
  get('importForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!plannedImport) return;
    const replacements = new Set(new FormData(event.target).getAll('replaceAudit'));
    const { reviews: next, added, replaced, changed } = applyReviewImport(plannedImport, latestReviews(), replacements);
    if (added || replaced) saveStorage(next);
    const preserved = plannedImport.conflicts.length - replaced;
    let message = `Importação concluída. ${added} novos, ${replaced} substituídos e ${preserved} conflitos com parecer local preservado.`;
    if (changed) message += ` ${changed} registros mudaram durante a conferência. Importe novamente para revisá-los.`;
    if (unsaved) message += ' Exporte o JSON para guardar as avaliações.';
    importDialog.close();
    refresh();
    get('auditStatus').textContent = message;
  });
  get('cancelImport').addEventListener('click', () => importDialog.close());
  importDialog.addEventListener('close', () => {
    plannedImport = null;
    get('importBtn').focus();
  });
  window.addEventListener('storage', event => {
    if (!unsaved && (event.key === storageKey || event.key === legacyKey)) {
      reviews = readStorage() ?? reviews;
      showList();
      showStats();
      if (!drafts.has(selectedId)) showDetail();
    }
  });

  refresh();
  const requested = new URLSearchParams(window.location.search).get('r');
  if (byId.has(requested)) openRoute(requested, mobile.matches);
}

if (typeof document !== 'undefined') startAudit();
