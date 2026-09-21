# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Rodrigo Tomé (rodrigotome.es) — an Astro static site deployed to Cloudflare, integrating Spotify, GitHub, and Flickr APIs. The homepage is a CSS grid bento layout that randomizes on device shake.

## Commands

- **Dev server:** `bun run dev`
- **Build:** `bun run build` (runs `astro check` then `astro build`)
- **Preview:** `bun run start`
- **Lint JS/TS/Astro:** `bun run lint`
- **Lint CSS:** `bun run lint:styles`
- **Format:** `bun run prettier`
- **Type check:** `bun run tsc --noEmit`
- **Get Spotify refresh token:** `bun run get-refresh-token`

Package manager is **bun** (lockfile: `bun.lock`). Node >= 24 required.

## Architecture

- **Framework:** Astro 5 with static output (`output: 'static'`), Cloudflare adapter, Tailwind CSS 3
- **Components:** Atomic design — `src/components/atoms/`, `molecules/`, `organisms/`
- **Services:** `src/lib/services/` — each service (spotify, flickr) has its own directory with `types.ts`, service class, and error classes. Re-exported from `src/lib/services/index.ts`
- **API routes:** `src/pages/api/` — server-rendered endpoints (`prerender = false`). Currently only `/api/spotify` for real-time now-playing data
- **OG images:** Generated via `astro-og-canvas` at `src/lib/og/[...route].ts`

## Path Aliases (tsconfig)

`@/atoms/*`, `@/molecules/*`, `@/organisms/*`, `@/assets/*`, `@/services/*`, `@/utils/*`, `@/styles/*`, `@/types/*`, `@/layouts/*`, `@lib/*`, `@/public/*`

## Code Conventions

- **Commit messages:** Conventional Commits enforced by commitlint + husky
- **Pre-commit hooks:** lint-staged runs type checking, ESLint, Prettier, and Stylelint
- **ESLint rules to note:** `no-console` is an error, `consistent-type-imports` required (use `import type`), `eqeqeq` always, `prefer-template` over string concat
- **TypeScript:** Strict mode (`astro/tsconfigs/strict`), `verbatimModuleSyntax` enabled

## Environment Variables

Copy `.env.template` to `.env`. Required vars: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URL`, `SPOTIFY_REFRESH_TOKEN`, `GITHUB_USERNAME`, `FLICKR_API_KEY`, `FLICKR_PHOTOSET_ID`, `FLICKR_USER_ID`. Optional: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (Telegram alert when the Spotify refresh token expires), `SPOTIFY_ALLOWED_USER_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PAGES_PROJECT`, `CLOUDFLARE_DEPLOY_HOOK_URL` (automatic Spotify token renewal through `/api/spotify/callback`)

## Git Config (this repo only)

- Author: `RodrigoTomeES <rotome@unirioja.es>`
