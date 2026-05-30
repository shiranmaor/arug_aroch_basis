# Current State

## Final File Structure

- `index.html`
- `.gitignore`
- `assets/favicon.svg`
- `assets/README.md`
- `assets/images/header.jpeg`
- `src/css/base.css`
- `src/css/layout.css`
- `src/css/components.css`
- `src/css/responsive.css`
- `src/js/config.js`
- `src/js/main.js`
- `src/js/registration.js`
- `src/js/admin-edit.js`
- `docs/redesign/current-state.md`
- `docs/redesign/redesign-plan.md`
- `docs/redesign/implementation-phases.md`
- local-only:
  - `codex/context.md`
  - `codex/current-state.md`
  - `codex/future-state.md`
  - `codex/phase-status.md`
  - `codex/user-preferences.md`

## Final Logic / Config State

- `src/js/config.js` contains:
  - `workshopDateText`
  - `workshopCapacity`
  - `apiUrl`
  - `payboxUrl`
  - `whatsappPhone`
  - `forceClose`
- Current values of note:
  - `workshopDateText = "חמישי, 12 במרץ 2026"`
  - `workshopCapacity = 5`
- `src/js/registration.js` uses one state model:
  - `open`
  - `past`
  - `full`
  - `closed`
- Current live/runtime expectation with the configured date:
  - `past`

## Final Design / Motion / Media State

- Warm premium visual system is in place.
- Motion/reveal layer is in place and remains reduced-motion-safe.
- Trust/media section uses:
  - hero image
  - two YouTube embeds
  - WhatsApp / Instagram / YouTube trust paths
  - CSS-only placeholders for future real media

## Final SEO / Accessibility State

- SEO metadata present:
  - title
  - meta description
  - canonical
  - robots
  - Open Graph basics
  - Twitter card basics
  - JSON-LD
- Accessibility support present:
  - RTL + Hebrew language attributes
  - skip link
  - accessible drawer nav label
  - form labels and required markers
  - meaningful alt text
  - meaningful iframe titles
  - focus styles
  - reduced-motion handling

## Final Assets

- `assets/images/header.jpeg`
- `assets/favicon.svg`
- `assets/README.md`

## Final Risks

- configured workshop date is still past
- price and capacity still need business confirmation
- page cannot demonstrate `open` or `full` visually without changing the real configured date, so those paths were validated primarily by code inspection
- `?edit=1` still writes to GitHub from the browser and should be treated carefully
- admin panel branch selection is safer than before, but still human-dependent
- no automated tests
