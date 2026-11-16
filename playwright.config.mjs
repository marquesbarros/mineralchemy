import { defineConfig, devices } from '@playwright/test';

const port = process.env.MINERALCHEMY_TEST_PORT ?? '4178';
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/browser',
  forbidOnly: Boolean(process.env.CI),
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testMatch: /desktop\.spec\.mjs$/ },
    { name: 'touch', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } }, testMatch: /touch\.spec\.mjs$/ },
  ],
  webServer: {
    command: 'node tests/browser/serve.mjs',
    url: `${baseURL}/index.html`,
    timeout: 10_000,
    env: { MINERALCHEMY_TEST_PORT: port },
  },
});
