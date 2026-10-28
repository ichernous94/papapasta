# PapaPasta — Codex Instructions

## Project context
- PapaPasta is a Next.js App Router project for two restaurant experiences: PapaPasta Pizza Wino Steki and Centro.
- The existing WordPress sites are migration references for content, visuals, behavior, and SEO.
- Read `docs/architecture.md` before proposing architectural changes. If it conflicts with the codebase, report the discrepancy instead of silently changing either.
- Existing code and established conventions take precedence over examples in this document when implementing small features; discuss structural changes first.

## Stack and conventions
- Next.js App Router, React, TypeScript, pnpm, Sass/SCSS Modules.
- Existing dependencies may include TanStack Query, Axios, Zustand, react-hook-form, react-toastify, Swiper and other installed packages. Do not assume every dependency must be used.
- Prefer `@/` alias imports where configured; avoid deep relative imports.
- Follow the existing component folder convention (`ComponentName/index.tsx` with colocated `ComponentName.module.scss`) unless a module already uses another established pattern.
- Use semantic HTML and accessible controls. Use `next/link` for internal navigation and `next/image` where appropriate.
- Prefer Server Components by default. Add `'use client'` only where client-side interaction or browser APIs require it.

## Architecture
- Keep route entry points in `src/app/` focused on routing, metadata and composition. Do not force every page to be an empty wrapper.
- Reuse shared UI components; separate restaurant-specific content and assets where it helps clarity.
- Use `src/hooks/` for reusable client-side UI hooks, `src/store/` for shared client UI state, `src/types/` for shared domain types, and `src/utils/` for pure helpers, when those directories exist.
- For client-side remote data, follow existing API service and TanStack Query conventions. Do not force server-side data access through client hooks.
- Keep sensitive operations and authorization checks on the server. UI guards and hidden navigation items are not security boundaries.
- Avoid new libraries, state managers, design systems or abstractions without a concrete need and approval.

## WordPress migration and visuals
- Treat supplied screenshots as references, not as proof of unseen mobile behavior or interactions.
- Inspect available images, fonts, styles and components before creating new ones.
- Match layout, spacing, typography, proportions and responsive behavior as closely as possible.
- Do not fabricate missing content or functionality; explicitly state assumptions.
- Preserve existing public URLs, metadata, canonical intent, headings and structured data where possible. Report any necessary redirects.
- Keep versioned static design assets in `public/`; do not store future admin-uploaded media there by default.

## Workflow and approvals
- For analysis or planning requests, do not edit files, install packages, run migrations or deploy. Explain findings with file paths and propose a plan.
- For implementation requests, modify only the agreed scope. Do not refactor unrelated code or overwrite user changes.
- Ask before adding dependencies, changing routing conventions, modifying database schemas, auth/2FA behavior, environment configuration or deployment settings.
- Never expose secrets, tokens, `.env` values or credentials. Never perform destructive production operations without explicit authorization.
- After edits, run available targeted TypeScript/lint/tests where practical and report what passed, failed or could not be run.
- Summarize changed files and any remaining manual checks. Do not claim visual fidelity without comparing actual screenshots at equivalent viewport sizes.

## Source of truth
- Detailed project-specific decisions belong in `docs/architecture.md`.
- Update that document only when an architectural decision has actually been agreed upon; distinguish confirmed choices from open questions.
