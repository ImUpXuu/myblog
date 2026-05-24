# Astro blog (Fuwari fork, maintained by UpXuu)

## Commands (pnpm only — npm/yarn blocked by preinstall hook)
- `pnpm dev` — dev server at `localhost:4321`
- `pnpm build` — runs `scripts/compress-gallery.mjs` → `astro build` → `pagefind --site dist`
- `pnpm preview` — preview production build
- `pnpm check` — `astro check` (type-check Astro files)
- `pnpm type-check` — `tsc --noEmit --isolatedDeclarations`
- `pnpm format` — `biome format --write ./src`
- `pnpm lint` — `biome check --write ./src`
- `pnpm new-post <filename>` — creates a new post in `src/content/posts/`
- No test framework exists in this repo.

## Layout & architecture
- Posts: `src/content/posts/` with zod schema in `src/content/config.ts`
- Config: `src/config.ts` (site, nav, profile, license, expressive code theme)
- Themes: `src/constants/constants.ts` (`DEFAULT_THEME = LIGHT_MODE`)
- Path aliases (from tsconfig): `@components/*`, `@assets/*`, `@constants/*`, `@utils/*`, `@i18n/*`, `@layouts/*`, `@config/*`, `@/*`
- Dark mode: Tailwind `class` strategy (toggled programmatically)
- Dashboard: Swup for SPA page transitions; containers `#swup-container` and `#toc`
- Lightbox: Fancybox (`@fancyapps/ui`), not lightbox3. Managed via `FancyboxManager.astro`
- Search: Pagefind (runs as final build step)
- Gallery: images in `public/gallery/<album>/`, thumbnails generated via `scripts/compress-gallery.mjs` (WebP, quality 75)

## CI / automation (`.github/workflows/`)
- **friend-link-checker.yml** — on Issue open/edit: parses friend request, deduplicates by URL, commits to `public/data/friends.json`, closes issue
- **cron-check.yml** — daily 16:00 CST, Playwright checks all friend links, reports failures as Issue comments
- **indexnow.yml** — on push to `src/content/posts/*.md`: submits changed post URLs to IndexNow
- **notify-update.yml** — on push to `src/content/posts/*.md` (non-talk): posts update notice to Issue #66, 30-min cooldown tracked in `skipupdate.json`

## Infrastructure
- Hosted on Vercel (`vercel.json` minimal)
- Umami analytics via Cloudflare Worker proxy (`worker-umami-proxy/`)
- Additional CF Worker proxy in `cf-proxy/`
- Partytown for 3rd-party script offloading (Umami)

## Out of scope (not implemented)
- No test framework or test files exist

## Security
- `opencode.json` contains a GITHUB_TOKEN — it's in `.gitignore` but verify it stays excluded
- `.env` used for secrets (also gitignored)

## Style
- Biome with `indentStyle: tab`, double quotes, `organizeImports` on save
- Conventional Commits (see CONTRIBUTING.md)
