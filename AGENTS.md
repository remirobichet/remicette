# AGENTS

This repository is a Nuxt 3 app with Vue SFCs, Nuxt Content, Tailwind CSS, and a small server API.
Use this guide as the single source of truth for how to build, lint, and edit code in this repo.

## Quick Facts

- Package manager: `pnpm` (see `package.json` and `pnpm-lock.yaml`)
- Framework: Nuxt 3 with client-only rendering (`ssr: false`)
- UI layer: Vue 3 SFCs + Tailwind CSS + shadcn-nuxt components
- Content: Markdown files under `content/`
- Server endpoints: `server/api/*.ts` using h3 handlers
- Linting: ESLint via `@nuxt/eslint`

## Commands

Run commands from the repo root.

### Install

```bash
pnpm install
```

### Dev server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Generate static site

```bash
pnpm generate
```

### Preview build

```bash
pnpm preview
```

### Lint

```bash
pnpm lint
```

### Lint a single file

```bash
pnpm lint -- path/to/file.vue
```

### Tests

- No automated test runner is configured yet.
- If tests are added later, document single-test commands here.

### Type checks

- No explicit typecheck script is configured.
- Nuxt supports `pnpm nuxi typecheck` if you need a quick check.

## Project Structure

- `app/` holds all Nuxt app code (pages, components, layouts, assets).
- `app/pages/` is file-based routing (`index.vue`, `[...slug].vue`, etc.).
- `app/components/` contains shared components and `ui/` (shadcn-nuxt).
- `app/assets/css/` contains Tailwind and global CSS.
- `server/api/` contains API routes (e.g., `extract.post.ts`).
- `content/` contains Markdown content for Nuxt Content.
- `public/` contains static assets served as-is.

## Coding Style (General)

- Use TypeScript everywhere in app and server code.
- Use `script setup` in Vue SFCs (`<script setup lang="ts">`).
- Indentation is 2 spaces; no tabs.
- Avoid semicolons; follow existing file style.
- Prefer single quotes in TS/JS and Vue scripts; match the file if it differs.
- Keep lines readable; break long template attributes onto multiple lines.
- Use trailing commas in multi-line object/array literals where already present.
- Favor `const` by default; use `let` only when reassignment is needed.
- Keep functions small and focused; extract helpers for repeated logic.
- Only add comments when the intent is not obvious from the code.

## Imports and Module Conventions

- Use the `@/` alias for app imports (e.g., `@/components/ui/button`).
- Group imports by source: external packages first, then internal aliases.
- Use type-only imports when appropriate (`import type { Foo } from 'bar'`).
- Prefer named exports from `app/components/ui/*` indexes when available.

## Naming Conventions

- Components: `PascalCase` filenames and component names.
- Composables/refs: `camelCase` (`useColorMode`, `filteredRecipes`).
- Constants: `camelCase` unless truly constant configuration (`const colorMode`).
- Types: `PascalCase` (`Recipe`, `Ingredient`).
- CSS classes are Tailwind utility strings; keep them ordered for readability.

## Vue and Nuxt Patterns

- Use Nuxt composables (`useAsyncData`, `useSeoMeta`) instead of manual wiring.
- Prefer `computed` for derived state and `ref` for mutable state.
- Use `defineProps` with `PropType` for arrays/objects when needed.
- Use `v-model` for form bindings; keep `@submit.prevent` handlers async.
- Use `NuxtLink` for internal navigation.
- Keep page-level data fetching in `app/pages/`.
- UI primitives live in `app/components/ui/` (shadcn-nuxt).
- Prefer `queryCollection('content')` for Nuxt Content queries.
- Reuse the `cn` helper from `app/lib/utils.ts` for class merging when needed.

## Tailwind and Styling

- Tailwind is enabled via `app/assets/css/tailwind.css` and `globals.css`.
- Prefer Tailwind utilities in templates over custom CSS.
- Keep component-level styles inline in templates; avoid scoped styles unless needed.
- Use existing tokens like `text-muted-foreground` and `bg-muted/50` for consistency.

## Server API Conventions

- Use `defineEventHandler` for handlers in `server/api/`.
- Use `readBody` for POST JSON payloads.
- Validate input early and return JSON errors for missing data.
- Use `async`/`await` consistently for IO.
- Keep file system interactions contained and isolated.

## Error Handling and Logging

- Fail fast on missing inputs (return `{ error: '...' }`).
- Throw on external API failures to surface errors clearly.
- Use `try/catch` around remote calls and JSON parsing.
- Log with `console.error` for server-side errors; keep logs concise.
- Avoid swallowing errors; return explicit error payloads to the client.

## Content Authoring

- Markdown lives under `content/` and is read by Nuxt Content.
- Frontmatter keys used by recipes: `title`, `description`, `image`, `category`,
  `prepTime`, `cookTime`, `totalTime`, `servings`, `ingredients`.
- Recipe entries are saved under `content/recipes/` by the extractor API.
- Keep recipe body text in Markdown, not HTML.
- Preserve existing recipe slugs and filenames when editing.

## Assets and Media

- Static images live in `public/` and are served as-is.
- Keep recipe placeholders in `public/images/recipe/`.

## Tooling and Configs

- ESLint config: `eslint.config.mjs` (uses Nuxt defaults).
- TypeScript config: `tsconfig.json` extends Nuxt's generated config.
- Editor settings in `.vscode/settings.json` enable format-on-save with ESLint.

## Agent Guidance

- Respect existing user changes in a dirty working tree.
- Avoid adding new dependencies unless requested or clearly justified.
- Keep edits focused and minimal; prefer small, readable patches.
- Do not delete or rename content files without explicit user intent.
