# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack on localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

There are no tests configured in this project.

## Environment Setup

Copy `env.example` to `.env.local` and fill in the keys:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `OPENAI_API_KEY` | Yes | OpenAI API calls |
| `GOOGLE_MAPS_API_KEY` | Yes | Places API (`/api/places`) |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Payments |
| `APIFY_API_TOKEN` + `APIFY_ZILLOW_ACTOR_ID` | Optional | Zillow scraping via Apify |
| `SCHOOLDIGGER_API_KEY` | Optional | School data (`/api/schools`) |
| `NEXT_PUBLIC_ACCESS_CODE` | Optional | Simple passcode gate on Vercel |

## Architecture

This is a **Next.js 15 App Router** project with **TailwindCSS 4** and **TypeScript**.

### Data Flow

The main page (`src/app/page.tsx`) renders three tabs:

1. **Marketing Toolkit** (`ZillowScraper.tsx`) — the primary workflow:
   - User pastes a Zillow URL → calls `POST /api/scrape-zillow-apify` (requires `APIFY_API_TOKEN`) → displays scraped property data
   - Then can call `POST /api/generate-listing` → OpenAI (`gpt-4o-mini`) generates a listing copy
   - Then can call `GET /api/places` → Google Maps Places API for nearby restaurants/parks/attractions
   - Then can call `POST /api/generate-social-content` → OpenAI generates Instagram + TikTok posts (2 variants each)

2. **Listing Generator** (`ListingForm.tsx`) — manual form that calls `POST /api/generate-listing` directly

3. **Neighborhood Guide** (`NeighborhoodGuideForm.tsx`) — calls `POST /api/generate-neighborhood-guide`

### Key Directories

- `src/app/api/` — All API routes (Next.js Route Handlers)
- `src/components/` — React client components
- `src/lib/` — Shared utilities:
  - `prompts.ts` — All AI prompt functions and shared TypeScript types (`PropertyData`, `BrandingData`, `SocialMediaResult`, etc.)
  - `openai.ts` — OpenAI client singleton; all API routes import `openai` from here and call `openai.chat.completions.create` directly (not `generateContent`)
  - `placesTypes.ts` — `ExtendedPlace` and `PlacesApiResponse` types used across components and API routes
  - `scraperRegexUtils.ts` — Regex helpers for parsing raw Apify/Zillow response fields
  - `placesInfoUtils.ts` — Display helpers (`getRatingStars`, `getPriceLevelText`)

### Auth

Supabase SSR auth is wired up via:
- `src/middleware.ts` — runs `updateSession` on every non-static request
- `src/utils/supabase/` — server/client/middleware Supabase client factories
- `src/app/actions/auth.ts` — Server Actions for login/sign-up
- The home page also checks `sessionStorage.getItem("authenticated")` for a simple passcode gate (`NEXT_PUBLIC_ACCESS_CODE`)

### Adding AI Content Features

All prompts live in `src/lib/prompts.ts`. To add a new generation feature:
1. Add a prompt function and any needed types to `prompts.ts`
2. Create `src/app/api/<feature>/route.ts` that imports `openai` from `@/lib/openai` and the prompt from `@/lib/prompts`
3. Add UI in a new or existing component under `src/components/`

### Zillow Scraping

`/api/scrape-zillow-apify` requires `APIFY_API_TOKEN` — it will return a 400 without it. There is also a basic regex-based fallback at `/api/scrape-zillow` that doesn't require Apify but extracts less data. The `scraperRegexUtils.ts` helpers are shared by both routes.

### Places API

`GET /api/places` accepts query params `location`, `radius` (meters, default 5000), and `types` (comma-separated, e.g. `restaurant,park,tourist_attraction`). The `/api/places/photo` subroute proxies Google Places photo requests to avoid exposing the API key client-side.
