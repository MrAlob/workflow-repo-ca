# Workflow Course Assignment — Holidaze Venue Booking

A vanilla JavaScript venue booking application with configured development tooling, linting, formatting, unit tests, and end-to-end tests.

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/MrAlob/workflow-repo-ca.git
   cd workflow-repo-ca
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**

   Copy the example file and fill in your credentials:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual values.

4. **Build the CSS (Tailwind)**

   ```bash
   npx tailwindcss -i ./css/input.css -o ./css/style.css
   ```

## Running the Application

Start a local development server:

```bash
npx live-server --port=5500
```

Then open `http://localhost:5500` in your browser.

## Scripts

| Command              | Description                                   |
| -------------------- | --------------------------------------------- |
| `npm install`        | Install all dependencies                      |
| `npm run dev`        | Build Tailwind CSS in watch mode              |
| `npm test`           | Run unit tests (Vitest)                       |
| `npm run test:watch` | Run unit tests in watch mode                  |
| `npm run test:e2e`   | Run end-to-end tests (Playwright)              |
| `npm run lint`       | Lint JavaScript files (ESLint)                |
| `npm run format`     | Format files (Prettier)                       |

## Required Environment Variables

The following environment variables must be set in a `.env` file:

| Variable            | Description                          |
| ------------------- | ------------------------------------ |
| `TEST_USER_EMAIL`   | Email for a valid test user account  |
| `TEST_USER_PASSWORD`| Password for the test user account   |
| `BASE_URL`          | Base URL of the application          |

## Testing

### Unit Tests (Vitest)

Unit tests cover utility functions:

- `isActivePath` — checks if the current path matches navigation links
- `getUsername` — retrieves the stored username from localStorage

Tests are located in `tests/unit/`.

### End-to-End Tests (Playwright)

E2E tests cover:

- **Login** — valid and invalid credentials
- **Navigation** — clicking through to venue details

Tests are located in `tests/e2e/`.

Before running e2e tests, start the local server:

```bash
npx live-server --port=5500
```

Then in another terminal:

```bash
npm run test:e2e
```

## Development Tools

- **ESLint** — linting with test globals configured
- **Prettier** — code formatting
- **Husky + lint-staged** — pre-commit hooks format HTML and lint/format JS
- **Vitest** — unit testing with jsdom environment
- **Playwright** — end-to-end browser testing (Chromium)
