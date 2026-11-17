import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const calcite = /^Calcita\./;
const lawsoniteRoute = 'a-anorthite-pressure-lawsonite';
const reactButton = page => page.getByRole('button', { name: 'Reagir as peças da bancada' });
const discoveryDialog = page => page.getByRole('dialog', { name: /^Descoberta/ });

async function searchAndAdd(page, query, material) {
  const search = page.getByRole('searchbox', { name: 'Buscar material na coleção lateral' });
  await search.fill(query);
  await expect(page.getByRole('button', { name: `Adicionar ${material} à bancada` })).toBeVisible();
  await search.press('Enter');
  await expect(search).toHaveValue('');
}

async function openLawsoniteAudit(page) {
  await page.getByRole('searchbox').fill(lawsoniteRoute);
  await page.getByRole('button', { name: new RegExp(lawsoniteRoute) }).click();
  return page.getByRole('region', { name: 'Ficha da reação' });
}

test('busca sem acento, combinação por arraste e histórico após recarga', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const board = page.getByRole('region', { name: 'Bancada' });
  const calcium = board.getByRole('button', { name: /^Cálcio \(Ca²⁺\)\./ });
  const carbonate = board.getByRole('button', { name: /^Carbonato\./ });

  await searchAndAdd(page, 'calcio', 'Cálcio (Ca²⁺)');
  await searchAndAdd(page, 'carbonato', 'Carbonato');
  await calcium.dragTo(carbonate);
  await expect(discoveryDialog(page)).toContainText('Calcita');
  await page.keyboard.press('Escape');
  await expect(calcium).toHaveCount(0);
  await expect(carbonate).toHaveCount(0);
  await expect(board.getByRole('button', { name: calcite })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(board.getByRole('button', { name: calcite })).toBeVisible();
  await page.getByRole('button', { name: 'Reações realizadas' }).click();
  await expect(page.getByRole('dialog', { name: 'Histórico de reações' }))
    .toContainText('Ca²⁺ + CO₃²⁻ → CaCO₃');
  expect(errors).toEqual([]);
});

test('arrastar da coleção diretamente sobre outra peça também abre a descoberta', async ({ page }) => {
  await page.goto('/');
  await searchAndAdd(page, 'calcio', 'Cálcio (Ca²⁺)');
  const search = page.getByRole('searchbox', { name: 'Buscar material na coleção lateral' });
  await search.fill('carbonato');
  const source = page.getByRole('button', { name: 'Adicionar Carbonato à bancada' }).locator('.library-orb');
  const target = page.getByRole('region', { name: 'Bancada' }).getByRole('button', { name: /^Cálcio/ });
  await source.dragTo(target);
  await expect(discoveryDialog(page)).toContainText('Calcita');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: calcite })).toBeFocused();
});

test('a ficha da descoberta fica aberta e consome as teclas de reação e de fechamento', async ({ page }) => {
  await page.goto('/');
  await searchAndAdd(page, 'calcio', 'Cálcio (Ca²⁺)');
  await searchAndAdd(page, 'carbonato', 'Carbonato');
  await reactButton(page).focus();
  await page.keyboard.down('Enter');
  const discovery = discoveryDialog(page);
  await expect(discovery.getByRole('heading', { name: 'Calcita' })).toBeVisible();
  await expect(discovery).toBeFocused();
  const burst = discovery.locator('.discovery-burst').first();
  await expect(burst).toHaveCSS('animation-name', 'discovery-burst');
  await expect(burst).toHaveCSS('animation-iteration-count', '2');
  await page.keyboard.down('Enter');
  await expect(discovery).toBeVisible();
  await page.keyboard.up('Enter');
  await discovery.evaluate(el => Promise.all(el.getAnimations({ subtree: true }).map(animation => animation.finished)));
  await expect(discovery).toBeVisible();
  await page.keyboard.down('Delete');
  await expect(discovery).toHaveCount(0);
  await expect(reactButton(page)).toBeFocused();
  await page.keyboard.down('Delete');
  await page.keyboard.up('Delete');
  await expect(page.getByRole('button', { name: calcite })).toBeVisible();

  await page.getByRole('button', { name: calcite }).focus();
  await page.keyboard.press('Enter');
  const manual = page.getByRole('dialog', { name: 'Detalhes do material' });
  await expect(manual.getByRole('heading', { name: 'Calcita' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(manual.getByRole('button', { name: 'Fechar' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: calcite })).toBeFocused();

  await page.locator('[data-action="clear"]').click();
  await searchAndAdd(page, 'calcio', 'Cálcio (Ca²⁺)');
  await searchAndAdd(page, 'carbonato', 'Carbonato');
  await reactButton(page).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: calcite })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calcita', exact: true })).toHaveCount(0);
});

for (const key of ['Enter', 'Space', 'Tab']) {
  test(`Ctrl+Enter celebra a descoberta e ${key} devolve o foco à bancada`, async ({ page }) => {
    await page.goto('/');
    await searchAndAdd(page, 'calcio', 'Cálcio (Ca²⁺)');
    await searchAndAdd(page, 'carbonato', 'Carbonato');
    await reactButton(page).focus();
    await page.keyboard.down('Control');
    await page.keyboard.down('Enter');
    await page.keyboard.up('Control');
    await page.keyboard.down('Enter');
    await expect(discoveryDialog(page)).toBeVisible();
    await page.keyboard.up('Enter');
    const activeBursts = () => page.evaluate(() => document.getAnimations()
      .filter(animation => animation.animationName === 'discovery-burst' && animation.playState === 'running').length);
    expect(await activeBursts()).toBeGreaterThan(0);
    await page.keyboard.press(key);
    await expect(discoveryDialog(page)).toHaveCount(0);
    expect(await activeBursts()).toBe(0);
    await expect(reactButton(page)).toBeFocused();
    await expect(page.getByRole('button', { name: calcite })).toBeVisible();
  });
}

test('uma reação de albita celebra jadeíta e quartzo em uma ficha com movimento reduzido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Ajuda' }).click();
  const prior = { format: 'mineralchemy-progress-v1', progress: { version: 1, discovered: ['albite'], history: [] }, board: [], recent: [] };
  await page.locator('#importProgress').setInputFiles({
    name: 'partida.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(prior)),
  });
  await page.getByRole('button', { name: 'Confirmar restauração' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await searchAndAdd(page, 'albita', 'Albita');
  await searchAndAdd(page, 'alta pressao', 'Alta pressão');
  await reactButton(page).click();
  const discovery = discoveryDialog(page);
  await expect(discovery).toHaveCount(1);
  await expect(discovery.getByRole('heading', { name: 'Jadeíta' })).toBeVisible();
  await expect(discovery.getByText('Quartzo', { exact: true })).toBeVisible();
  await expect(discovery.locator('.discovery-burst').first()).toBeHidden();
  await expect(discovery.getByText('2 minerais descobertos')).toBeVisible();
  await page.keyboard.press('a');
  await expect(discovery).toHaveCount(0);
  await expect(page.locator('#catalogSearch')).toHaveValue('');
  await expect(page.getByRole('region', { name: 'Bancada' }).getByRole('button')).toHaveCount(2);
});

test('Tab percorre o jogo e o diálogo devolve o foco após Escape', async ({ page }) => {
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Ver trilhas mineralógicas' });
  const dialog = page.getByRole('dialog', { name: 'Trilhas mineralógicas' });

  await opener.focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Reações realizadas' })).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.keyboard.press('Shift+Tab');
  await expect(opener).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();

  const close = dialog.getByRole('button', { name: 'Fechar' });
  await close.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator(':focus')).toHaveCount(1);
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test('voltar da ficha ao atlas preserva a busca e o mineral selecionado', async ({ page }) => {
  await page.goto('/');
  const atlasButton = page.getByRole('button', { name: 'Abrir catálogo de descobertas' });
  await atlasButton.click();
  const atlas = page.getByRole('dialog', { name: 'Coleção de minerais' });
  await atlas.getByRole('searchbox').fill('grafita');
  const graphite = atlas.getByRole('button', { name: 'Grafita', exact: true });
  await graphite.click();
  const detail = page.getByRole('dialog', { name: 'Detalhes do material' });
  await detail.getByRole('button', { name: 'Voltar ao atlas' }).click();
  await expect(atlas.getByRole('searchbox')).toHaveValue('grafita');
  await expect(graphite).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(atlasButton).toBeFocused();
});

test('Trilhas guia a descoberta de um precursor e retoma a continuação', async ({ page }) => {
  await page.goto('/');
  const board = page.getByRole('region', { name: 'Bancada' });
  const react = page.getByRole('button', { name: 'Reagir as peças da bancada' });
  await searchAndAdd(page, 'silicio elementar', 'Silício elementar');
  await searchAndAdd(page, 'calcio', 'Cálcio (Ca²⁺)');
  await react.click();
  await expect(page.getByText('Não há uma combinação cadastrada para essas duas peças.').first()).toBeVisible();
  await page.getByRole('button', { name: 'Explorar com Cálcio (Ca²⁺)' }).click();

  const dialog = page.getByRole('dialog', { name: 'Trilhas mineralógicas' });
  const focus = dialog.getByRole('combobox', { name: 'Material de partida' });
  const route = dialog.locator('[data-trail-reaction="ion-path-wollastonite"]');
  await expect(focus).toHaveValue('calcium_ion');
  await expect(route).not.toContainText(/Quartzo|Wollastonita/);
  await route.getByRole('button', { name: 'Mostrar pista' }).click();
  await expect(route).not.toContainText(/Quartzo|Wollastonita/);
  await route.getByRole('button', { name: 'Mostrar como obter a peça' }).click();
  await expect(route).toContainText('Oxigênio molecular');
  await expect(route).toContainText('Quartzo');
  await expect(route).not.toContainText('Wollastonita');
  await route.getByRole('button', { name: 'Preparar etapa na bancada' }).click();
  await expect(dialog.getByText(/A bancada tem peças/)).toBeVisible();
  await dialog.getByRole('button', { name: 'Manter bancada' }).click();
  await dialog.getByRole('button', { name: 'Fechar' }).click();
  await expect(board.getByRole('button')).toHaveCount(2);
  const resume = page.getByRole('button', { name: 'Voltar à continuação de Cálcio (Ca²⁺)' });
  await resume.click();
  await expect(focus).toHaveValue('calcium_ion');
  await route.getByRole('button', { name: 'Preparar etapa na bancada' }).click();
  await dialog.getByRole('button', { name: 'Substituir peças' }).click();
  await expect(board.getByRole('button', { name: /^Silício elementar\./ })).toBeVisible();
  await expect(board.getByRole('button', { name: /^Oxigênio molecular\./ })).toBeVisible();
  await expect(react).toBeFocused();
  await react.click();
  await page.keyboard.press('Escape');
  const quartz = board.getByRole('button', { name: /^Quartzo\./ });
  await expect(quartz).toBeVisible();
  await expect(page.getByRole('button', { name: 'Quartzo', exact: true })).toBeVisible();

  await resume.click();
  await expect(focus).toHaveValue('calcium_ion');
  await expect(route).not.toContainText('Wollastonita');
  await route.getByRole('button', { name: 'Revelar produto' }).click();
  await expect(route).toContainText('Wollastonita');
  await expect(route.getByText('Condições', { exact: true })).toBeVisible();
  await route.getByRole('button', { name: 'Preparar na bancada' }).click();
  await expect(board.getByRole('button')).toHaveCount(2);
  await react.click();
  await page.keyboard.press('Escape');
  await expect(board.getByRole('button', { name: /^Wollastonita\./ })).toBeVisible();

  await searchAndAdd(page, 'quartzo', 'Quartzo');
  await expect(quartz).toBeVisible();
  await quartz.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Continuar a partir deste material' }).click();
  await expect(focus).toHaveValue('quartz');
  await expect(dialog.getByText('Disponíveis agora', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Voltar à continuação de Quartzo' }).click();
  await expect(focus).toHaveValue('quartz');
});

test('uma descoberta sem continuação oferece o retorno a um precursor', async ({ page }) => {
  await page.goto('/');
  await searchAndAdd(page, 'zinco', 'Zinco (Zn²⁺)');
  await searchAndAdd(page, 'carbonato', 'Carbonato');
  await page.getByRole('button', { name: 'Reagir as peças da bancada' }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Smithsonita', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Trilhas mineralógicas' });
  const focus = dialog.getByRole('combobox', { name: 'Material de partida' });
  await expect(focus).toHaveValue('smithsonite');
  await dialog.getByRole('button', { name: 'Voltar a explorar Carbonato' }).click();
  await expect(focus).toHaveValue('carbonate');
  await expect(dialog.getByText('Disponíveis agora', { exact: true })).toBeVisible();
});

test('backup restaura bancada e reações em um navegador sem progresso anterior', async ({ page, browser }) => {
  await page.goto('/');
  await searchAndAdd(page, 'calcio', 'Cálcio (Ca²⁺)');
  await searchAndAdd(page, 'carbonato', 'Carbonato');
  await page.getByRole('button', { name: 'Reagir as peças da bancada' }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Calcita', exact: true }).click();
  await page.getByRole('dialog', { name: 'Trilhas mineralógicas' }).getByRole('button', { name: 'Fechar' }).click();
  await page.getByRole('button', { name: /Ajuda/ }).click();

  const downloaded = page.waitForEvent('download');
  await page.locator('[data-action="export-progress"]').click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toBe('mineralchemy-progresso.json');
  const backup = await readFile(await file.path());
  expect(JSON.parse(backup.toString('utf8')).format).toBe('mineralchemy-progress-v1');

  const fresh = await browser.newContext();
  try {
    const freshPage = await fresh.newPage();
    await freshPage.goto(page.url());
    const board = freshPage.getByRole('region', { name: 'Bancada' });
    await expect(board.getByRole('button', { name: calcite })).toHaveCount(0);
    await freshPage.getByRole('button', { name: /Ajuda/ }).click();
    await freshPage.locator('#importProgress').setInputFiles({
      name: file.suggestedFilename(), mimeType: 'application/json', buffer: backup,
    });
    await freshPage.locator('[data-action="confirm-import"]').click();
    await expect(freshPage.getByRole('dialog')).toHaveCount(0);
    await expect(board.getByRole('button', { name: calcite })).toBeVisible();
    await freshPage.getByRole('button', { name: 'Voltar à continuação de Calcita' }).click();
    const trails = freshPage.getByRole('dialog', { name: 'Trilhas mineralógicas' });
    await expect(trails.getByRole('combobox', { name: 'Material de partida' })).toHaveValue('calcite');
    await trails.getByRole('button', { name: 'Fechar' }).click();
    await freshPage.getByRole('button', { name: 'Reações realizadas' }).click();
    await expect(freshPage.getByRole('dialog', { name: 'Histórico de reações' }))
      .toContainText('Ca²⁺ + CO₃²⁻ → CaCO₃');
  } finally {
    await fresh.close();
  }
});

test('falha de armazenamento mantém a partida ativa e oferece exportação', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Cota indisponível', 'QuotaExceededError'); };
  });
  await page.goto('/');
  await searchAndAdd(page, 'calcio', 'Cálcio (Ca²⁺)');
  await searchAndAdd(page, 'carbonato', 'Carbonato');
  await page.getByRole('button', { name: 'Reagir as peças da bancada' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('region', { name: 'Bancada' }).getByRole('button', { name: calcite })).toBeVisible();
  await expect(page.locator('#saveWarning')).toContainText('não conseguiu salvar a partida');
  await page.getByRole('button', { name: /Ajuda/ }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exportar progresso' }).click();
  const backup = JSON.parse(await readFile(await (await downloaded).path(), 'utf8'));
  expect(backup.progress.discovered).toContain('calcite');
});

test('auditoria localiza uma rota e mostra seus condicionantes', async ({ page }) => {
  await page.goto('/catalogo-auditoria.html');
  await expect(page.getByRole('heading', { name: 'Auditoria de reações' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Família', exact: true }).selectOption({ label: 'Metamórficos' });
  await page.getByRole('combobox', { name: 'Processo', exact: true }).selectOption({ label: 'Reação metamórfica' });
  const details = await openLawsoniteAudit(page);

  await expect(details).toContainText('Lawsonita');
  await expect(details).toContainText('⇌');
  await expect(details).toContainText(/água|H₂O/i);
  await expect(details).toContainText('p. 69 (PDF 77), foto 66');
  await expect(details).toContainText('Yardley');
});

test('auditoria grava e exporta fontes e versão de um parecer', async ({ page }) => {
  await page.goto('/catalogo-auditoria.html');
  const details = await openLawsoniteAudit(page);
  const note = 'Conferir o papel da água e o campo de estabilidade.';
  const url = 'https://doi.org/10.1093/petrology/12.2.379';
  const claim = 'Limites de estabilidade no sistema estudado.';
  await details.locator('#reviewDecision').selectOption('revisit');
  await details.locator('#note').fill(note);
  await details.getByRole('button', { name: /Adicionar fonte/ }).click();
  await details.locator('[name="sourceUrl"]').last().fill(url);
  await details.locator('[name="sourceClaim"]').last().fill(claim);
  await details.getByRole('button', { name: 'Salvar parecer' }).click();
  await expect(details.locator('#savedLabel')).toContainText(/salvo/i);

  await page.reload();
  await openLawsoniteAudit(page);
  await expect(details.locator('#reviewDecision')).toHaveValue('revisit');
  await expect(details.locator('#note')).toHaveValue(note);
  await expect(details.locator('[name="sourceClaim"]').last()).toHaveValue(claim);

  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: /Exportar pareceres/ }).click();
  const file = await downloaded;
  const exported = JSON.parse(await readFile(await file.path(), 'utf8'));
  expect(exported.decisions.find(decision => decision.id === lawsoniteRoute)).toMatchObject({
    status: 'revisit',
    note,
    sources: [{ url, claim }],
    routeFingerprint: expect.stringMatching(/^[0-9a-f]{64}$/),
  });
});

test('atlas encontra uma ilustração mineral pelo nome', async ({ page }) => {
  await page.goto('/iconografia.html');
  await expect(page.getByRole('heading', { name: 'Atlas de ilustrações minerais' })).toBeVisible();
  const search = page.getByLabel('Buscar mineral');
  await search.fill('calcita');
  const result = page.getByRole('article').filter({ hasText: 'Calcita' });
  await expect(result).toBeVisible();
  await expect(result.locator('svg')).toHaveCount(1);
  await expect(page.getByRole('article').filter({ hasText: 'Berilo' })).toHaveCount(0);
});
