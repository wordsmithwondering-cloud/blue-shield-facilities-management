# Test suites

- `npm test` runs the fast Vitest unit suite.
- `npm run test:e2e` runs Chromium end-to-end tests with Playwright and starts the Next.js development server when needed.
- `npm run test:performance` runs the small k6 health baseline. Install the k6 CLI separately before using this command.

Use a dedicated Supabase test project before adding tests that create or modify tickets, maintainers, users, or authentication state. Set `PLAYWRIGHT_BASE_URL` or `BASE_URL` to test a deployed environment.
