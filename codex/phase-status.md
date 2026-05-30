# Phase Status

## Current Phase

- `10/8`

## Status

- Experimental cinematic GSAP pass completed

## Branch

- `redesign/landing-page-flow`

## Files Modified In Phase 10

- `index.html`
- `src/css/base.css`
- `src/js/main.js`
- local-only `codex/context.md`
- local-only `codex/phase-status.md`

## Effects Added

- GSAP hero entrance timeline
- ScrollTrigger hero progression
- GSAP Hebrew word-level title reveal
- animated fabric ribbon drift and scroll-linked motion
- ScrollTrigger journey-step activation and stage motion
- GSAP-powered registration climax reveal
- fallback kept for reduced-motion / no-GSAP paths

## Validation Performed

- `git branch --show-current`
- `git check-ignore -v codex/context.md`
- `node --check` for all JS files
- local server run
- `/` loaded
- `/?edit=1` loaded
- reduced-motion load checked with `--force-prefers-reduced-motion`
- screenshots generated:
  - `/tmp/arug-phase10-desktop.png`
  - `/tmp/arug-phase10-mobile.png`
- asset `200` checks for:
  - `assets/images/header.jpeg`
  - `assets/favicon.svg`

## Preserved Behavior

- Apps Script logic
- PayBox logic
- WhatsApp links
- YouTube embeds
- registration form
- admin mode
- static deployment compatibility

## Remaining Risks

- current configured date is still past
- the GSAP path should get human visual review before merge
- headless Chrome still emits unrelated GCM noise during validation
- the waitlist popup still dominates screenshots because the configured date is past
- the stronger hero motion should be reviewed in a real foreground browser, not only headless capture
