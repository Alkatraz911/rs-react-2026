# Pokémon Explorer — Next.js (App Router + SSR)

A Pokémon browser rebuilt on **Next.js (App Router)** with server components,
server actions, internationalization (next-intl) and server-side rendering.
Data comes from the public [PokéAPI](https://pokeapi.co/).

## Tech stack

- **Next.js 15** (App Router, file-based routing, server/client components)
- **React 19**, **TypeScript** (strict)
- **next-intl** for i18n (English / Russian) and locale-aware navigation
- **Redux Toolkit** for client-side selected-items state
- **Context API** for theme (light/dark)
- **next/image** for optimized images

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:3000)
npm run build    # production build
npm run start    # run the production build
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

### Environment variables

| Variable             | Default | Description                                          |
| -------------------- | ------- | ---------------------------------------------------- |
| `CACHE_TTL_MINUTES`  | `5`     | Revalidation window (minutes) for PokéAPI fetches.   |

See [.env.example](.env.example).

## Architecture

- **Routing** is locale-prefixed (`/en`, `/ru`) via the `[locale]` segment and
  `next-intl` middleware. All internal links/redirects use the `createNavigation`
  helpers in [src/i18n/navigation.ts](src/i18n/navigation.ts).
- **Search results page** ([src/app/[locale]/page.tsx](src/app/%5Blocale%5D/page.tsx))
  is a server component: it reads `searchParams` (`query`, `page`, `details`),
  fetches results on the server and renders the list plus the details-panel shell.
- **Search** is submitted through a **server action**
  ([src/app/[locale]/actions.ts](src/app/%5Blocale%5D/actions.ts)) that redirects
  to the updated server-rendered URL.
- **Details panel** ([src/components/Details/PokemonDetailsPanel.tsx](src/components/Details/PokemonDetailsPanel.tsx))
  is a server component that fetches the selected pokémon on the server.
- **About** ([src/app/[locale]/about/page.tsx](src/app/%5Blocale%5D/about/page.tsx))
  is a statically generated (SSG) server component.
- **CSV export** is compiled and served by a route handler
  ([src/app/api/csv/route.ts](src/app/api/csv/route.ts)) with a
  `Content-Disposition: attachment` response.
- **Data layer** ([src/lib/pokeapi.ts](src/lib/pokeapi.ts)) holds the server-only
  PokéAPI fetchers with TTL-based caching.

## Project structure

```
messages/                 # en.json / ru.json translation catalogs
src/
  app/
    [locale]/             # locale-scoped routes
      layout.tsx          # shared layout (navbar, providers, flyout, global css)
      page.tsx            # search results page (server)
      about/page.tsx      # SSG About page (server)
      not-found.tsx       # localized 404
      [...rest]/page.tsx  # catch-all -> notFound()
      actions.ts          # search server actions
      error.tsx / loading.tsx
    api/csv/route.ts      # server CSV route handler
    providers.tsx         # Redux + Theme client providers
  components/             # Navbar, LanguageSwitcher, Search, Card, CardList,
                          # Pagination, Details, Flyout, RefreshButton, Loader
  context/ThemeContext.tsx
  i18n/                   # routing, navigation, request config
  lib/pokeapi.ts          # server data layer
  store/                  # Redux store + selected slice
  styles/                 # global stylesheets
  middleware.ts           # next-intl locale middleware
```

## Score

- [x] **Feature 1 — Rebuild in Next.js App Router with preserved behavior** (10)
- [x] **Feature 2 — Internationalization** (10): next-intl (5) + client-side language switcher (5)
- [x] **Feature 3 — Shared layout** for all pages (5)
- [x] **Feature 4 — 404 page** for unknown routes (5)
- [x] **Feature 5 — Images via `next/image`** (10)
- [x] **Feature 6 — Links via next-intl `createNavigation`** (10)
- [x] **Feature 7 — About page as a statically generated server component** (10): server-only (5) + SSG, no client fetching (5)
- [x] **Feature 8 — Server-side CSV generation** via route handler (15)
- [x] **Feature 9 — Search results page rendered on the server** (15): initial SSR (8) + server components for list & details shell (7)
- [x] **Feature 10 — Server actions for search and detail selection** (10): search server action (5) + server-side detail fetch (5)

> Note: the standalone forms module from the previous task is intentionally excluded per the assignment.
