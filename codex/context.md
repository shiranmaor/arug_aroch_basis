# Codex Context

## Project Purpose

Static Hebrew RTL landing page for Shiran Maor's woven-wrap basics workshop. The page should feel premium, warm, trustworthy, and now also more visually memorable through lightweight experimental effects and a stronger cinematic entrance.

## Current Project State

- Current branch:
  - `redesign/landing-page-flow`
- `codex/` remains local-only and ignored by Git.
- Phases `1/8` through `8/8` were completed previously.
- Extra experimental passes were added:
  - `Phase 9/8 — Experimental Wow Effects`
  - `Phase 10/8 — Cinematic Entrance + GSAP Wow Pass`

## Phase 9/10 Summary

- Added flowing ribbon-like background elements through CSS.
- Added a sticky journey/storytelling section:
  - `בלבול`
  - `התאמה`
  - `תרגול`
  - `ביטחון`
  - `ידיים חופשיות`
- Added a before/after comparison section.
- Added subtle parallax hooks for hero/ribbons.
- Added restrained interactive tilt/lift behavior to selected cards.
- Strengthened the registration block visually as the end of the journey.
- Added GSAP and ScrollTrigger from CDN as progressive enhancement only.
- Replaced the plain hero entrance with a cinematic layered reveal:
  - ribbon drift
  - staggered Hebrew headline reveal
  - orbit chip settling
  - hero image depth/parallax
  - CTA reveal last
- Enhanced sticky journey activation with ScrollTrigger while keeping a no-GSAP fallback.
- Follow-up pass fixed a regression where the registration form could remain hidden by conflicting GSAP reveal targets.
- The hero was pushed further into a staged, two-column cinematic composition with deeper atmosphere layers and floating detail cards.

## Important Constraints Still Preserved

- no change to registration logic
- no change to Apps Script integration
- no change to PayBox behavior
- no change to WhatsApp link generation
- no change to YouTube embeds
- no change to `?edit=1` admin mode behavior beyond the earlier branch-safety update
- no package manager/build dependency
- only GSAP/ScrollTrigger via CDN scripts were added

## Current Runtime Expectation

- configured date remains:
  - `חמישי, 12 במרץ 2026`
- runtime state still resolves to:
  - `past`

## Validation Notes

- JS syntax checks passed.
- `/` and `/?edit=1` still load locally.
- desktop and mobile screenshots were generated for the experimental pass.
- reduced-motion safety remains in place because GSAP only runs when motion is allowed.
- if GSAP fails to load, the fallback reveal/journey/parallax path still runs and content remains visible.

## Future Note

- Treat Phases 9 and 10 as experimental branch-state enhancements, not as the baseline business requirement.
