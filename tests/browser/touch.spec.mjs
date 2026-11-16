import { expect, test } from '@playwright/test';

async function findAndTap(page, query, material) {
  const search = page.getByRole('searchbox', { name: 'Buscar material na coleção lateral' });
  await search.fill(query);
  const tile = page.getByRole('button', { name: `Adicionar ${material} à bancada` });
  // The label adds the piece without beginning the shelf's drag gesture.
  await tile.locator('.library-name').tap();
}

test('bancada e busca funcionam por toque em uma tela de 360 px', async ({ page }) => {
  await page.goto('/');
  const board = page.getByRole('region', { name: 'Bancada' });
  await findAndTap(page, 'calcio', 'Cálcio (Ca²⁺)');
  await expect(board.getByRole('button', { name: /^Cálcio \(Ca²⁺\)\./ })).toBeVisible();
  await findAndTap(page, 'carbonato', 'Carbonato');
  await expect(board.getByRole('button', { name: /^Carbonato\./ })).toBeVisible();

  await page.getByRole('button', { name: 'Reagir as peças da bancada' }).tap();
  await expect(board.getByRole('button', { name: /^Calcita\./ })).toBeVisible();
  await expect(board.getByRole('button')).toHaveCount(1);

  const discoveries = page.getByRole('button', { name: 'Abrir catálogo de descobertas' });
  await discoveries.tap();
  const dialog = page.getByRole('dialog', { name: 'Coleção de minerais' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Fechar' }).tap();
  await expect(dialog).toHaveCount(0);
});

test('arraste por toque também combina peças na bancada estreita', async ({ page, context }) => {
  await page.goto('/');
  await findAndTap(page, 'calcio', 'Cálcio (Ca²⁺)');
  await findAndTap(page, 'carbonato', 'Carbonato');

  const board = page.getByRole('region', { name: 'Bancada' });
  const calcium = await board.getByRole('button', { name: /^Cálcio \(Ca²⁺\)\./ }).boundingBox();
  const carbonate = await board.getByRole('button', { name: /^Carbonato\./ }).boundingBox();
  expect(calcium).not.toBeNull();
  expect(carbonate).not.toBeNull();
  const start = { x: calcium.x + calcium.width / 2, y: calcium.y + calcium.height / 2 };
  const end = { x: carbonate.x + carbonate.width / 2, y: carbonate.y + carbonate.height / 2 };

  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
  for (const fraction of [0.15, 0.5, 1]) {
    const point = { x: start.x + (end.x - start.x) * fraction, y: start.y + (end.y - start.y) * fraction };
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point] });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();

  await expect(board.getByRole('button', { name: /^Calcita\./ })).toBeVisible();
});

test('auditoria móvel volta da ficha à reação selecionada', async ({ page }) => {
  await page.goto('/catalogo-auditoria.html');
  await page.getByRole('searchbox').fill('a-anorthite-pressure-lawsonite');
  const route = page.getByRole('button', { name: /a-anorthite-pressure-lawsonite/ });
  await route.tap();
  const detail = page.getByRole('dialog', { name: 'Ficha da reação' });
  await expect(detail).toBeVisible();
  await expect(detail).toContainText('Lawsonita');
  await detail.getByRole('button', { name: /Lista/ }).tap();
  await expect(detail).toHaveCount(0);
  await expect(route).toBeFocused();
});
