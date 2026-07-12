import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000/',
    env: {
      ALLOW_RESET_DATABASE: '1',
      DB: 'test.db',
    },
    reuseExistingServer: false,
  },
})