# ElectroPi Task Management

A task management app built with Nuxt 4 and Nuxt UI, backed by a mock REST API (json-server) for local development.

## Getting Started

**1. Install dependencies**

```bash
bun install
# or: npm install
```

**2. Configure environment variables**

Create a `.env` file in the project root:

```bash
NUXT_PUBLIC_API_BASE=http://localhost:9001
NUXT_PUBLIC_API_DELAY=600
```

`NUXT_PUBLIC_API_DELAY` (in ms) simulates real backend latency on every request made through the API client — useful for seeing loading states while developing against `json-server`. Set it to `0` (or remove it) to disable.

**3. Run the app**

```bash
bun run dev
# or: npm run dev
```

This single command starts both the Nuxt dev server and the mock API concurrently:
- Nuxt app → `http://localhost:3000`
- Mock API (json-server) → `http://localhost:9001`, serving data from `db.json`

Other scripts:

```bash
npm run build      # production build
npm run generate   # static generation
npm run preview    # preview production build
npm run mock-api   # run only the json-server mock API
```

## What's Implemented

A full CRUD task management flow:

- **Tasks list** (`/tasks`) — sortable, searchable table of tasks with filtering by status and title, using Nuxt UI's `UTable`.
- **Create / edit task** — a shared dialog form (`TaskFromManager`) validated with a `zod` schema (required title, due date can't be in the past), used for both creating and editing.
- **Task details** (`/tasks/[id]`) — a detail page showing description, progress, acceptance criteria, attachments, assignee, tags, and metadata (created/updated/completed dates, hours).
- **Delete task** — with a reusable confirmation dialog (`GeneralConfirmationDialog`) before removing a task.
- **Welcome page** (`/`) — a simple landing page with a call-to-action button linking to the tasks list.
- **Error page** (`app/error.vue`) — a global fallback page for unhandled errors (e.g. 404s), with a button to clear the error and return home.
- **State management** — a Pinia store (`useTaskStore`) wraps the API calls (`useTaskApi`) so components stay thin and just call store actions.
- **API layer** — a small `$fetch`-based client (`useApiLayer` / `apiClient.ts`) with a configurable base URL and centralized request/response handling (e.g. hook point for 401s), so swapping the mock API for a real backend later only means changing `NUXT_PUBLIC_API_BASE`.
- **Reusable UI building blocks** — `EditableTable`, `AppPageToolbar`, `UDialog`, and a shared `Header` layout component, kept generic so they aren't tied to tasks specifically.

## Why Nuxt / Nuxt UI

- **Nuxt** gives file-based routing, auto-imports, and a conventional project structure (`pages`, `composables`, `stores`) out of the box, which keeps a small app like this fast to build without hand-rolling routing or build config.
- **Nuxt UI** provides a full set of accessible, themeable components (tables, forms, dialogs, dropdowns, toasts) already built on top of Tailwind CSS. Using it means the CRUD screens, form validation UX (`UForm`), and data table (`UTable`) didn't need to be built from scratch, so more time went into the actual task management logic.
- Together they let the same codebase scale from a simple SPA to full SSR/static generation later, without changing the architecture.

## Why json-server

The focus here was the frontend (UI, state, API integration patterns) rather than building and hosting a real backend. `json-server` turns `db.json` into a working REST API (`GET/POST/PATCH/DELETE /tasks`, plus filtering via query params) with zero backend code, which:

- Unblocks frontend development immediately with realistic, persisted data.
- Matches the shape of a real REST API closely enough that the API layer (`apiClient.ts`, `useTaskApi.ts`) needs little to no change when pointed at a real backend later — just update `NUXT_PUBLIC_API_BASE`.
- Runs alongside the Nuxt dev server via a single `npm run dev` command (using `concurrently`), keeping the local dev workflow simple.

## Project Structure

```
app/
├── components/
│   ├── layouts/         # Header, layout-level components
│   ├── shared/          # Generic, reusable components (table, dialogs, toolbar)
│   └── tasks/           # Task-specific components (create/edit form)
├── composables/
│   ├── useApiLayer.ts   # Shared $fetch client
│   └── tasks/           # Task API composable
├── constant/apis/       # API endpoint constants
├── layouts/             # Nuxt layouts
├── pages/               # File-based routes (tasks list & details)
├── services/            # API client factory
├── stores/              # Pinia stores
├── types/               # Shared TypeScript types
└── utils/               # Small helper utilities

db.json                  # Mock database used by json-server
```
