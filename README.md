# Cards & Transactions

A banking-style overview page built with React, TypeScript, and Vite. Users can view payment cards, select one, and inspect its transactions with optional amount filtering.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [yarn](https://yarnpkg.com/) (`npm install -g yarn`)

## Getting Started

### 1. Install dependencies

```bash
yarn
```

### 2. Configure environment

Create a `.env` file in the project root (already included):

```env
VITE_API_URL=http://localhost:3000
```

### 3. Start the mock API server

The app loads data from a local JSON server that simulates a REST API.

```bash
yarn server
```

This starts `json-server` on `http://localhost:3000` using `db.json` as the data source.

### 4. Start the development server

In a separate terminal:

```bash
yarn dev
```

The app will be available at `http://localhost:5173`.

> Both the API server and the dev server must be running at the same time.

---

## Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start the Vite development server |
| `yarn server` | Start the mock JSON API on port 3000 |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build locally |
| `yarn test` | Run unit tests with Vitest |
| `yarn e2e` | Run end-to-end tests with Playwright (headless) |

---

## Running Tests

### Unit tests

```bash
yarn test
```

Runs all Vitest unit and component tests. Uses jsdom and React Testing Library.

### End-to-end tests

Playwright automatically starts both servers before running tests.

```bash
yarn e2e
```

To run with the interactive Playwright UI:

```bash
yarn e2e:ui
```

> Requires Playwright browsers to be installed: `npx playwright install`

---

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** — build tool and dev server
- **SWR** — data fetching and caching
- **React Router DOM 7** — client-side routing
- **styled-components 6** — component-scoped styling
- **json-server** — mock REST API
- **Vitest + React Testing Library** — unit and component tests
- **Playwright** — end-to-end tests

---

## Assumptions & Tradeoffs

- **Mock API using json-server** — data is fetched via `json-server` so the architecture is structured as if connecting to a real backend. Switching to a real API only requires updating `VITE_API_URL`.
- **SWR for data fetching** — chosen over useEffect + fetch
- **Context over Redux** — the app has a single shared state (selected card + theme). A full state management library would be over-engineering at this scale.
- **Debounced amount filter** — the filter input is debounced by 300ms to avoid filtering on every keystroke.
- **Error handling** — HTTP errors are typed (`HttpError` with a `status` code) so the UI can show context-specific messages (404, 401/403, 5xx) rather than a generic failure message.

---

## What I Would Improve With More Time

- **Pagination** for large transaction lists
- **Loading UI** when apis are loading the data
- **Internationalisation (i18n)** Multi language support
- **Path aliases** replace deep relative imports like `../../../../api/Http` with short aliases.
- **Feature-level error boundaries** when adding multiple features it will be good to add feature level error boundaries
- **Responsive design** for mobile application 
- **Better empty state messaging** for no transactions in amount filter and no transactions related to particular card
- **Unit test coverage to 95%+** — expand test coverage across components, hooks, and utility functions to reach and maintain a 95%+ coverage threshold
- **Better error UI** — replace the plain `<p role="alert">` with a proper error component
- **Card type support** — the card theme colour is currently derived by matching keywords in the card `description` string (e.g. "Private", "Business"). This is fragile; the API should return a `type` field (e.g. `"personal" | "business"`) so the UI can apply themes based on a proper data contract rather than string parsing
- **Configure ESLint** — add and configure ESLint
