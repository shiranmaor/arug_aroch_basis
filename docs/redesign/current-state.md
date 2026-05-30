# Current State

## Project Structure

- Root:
  - `index.html`
  - `.gitignore`
- Assets:
  - `assets/favicon.svg`
  - `assets/README.md`
  - `assets/images/header.jpeg`
- Source:
  - `src/css/base.css`
  - `src/css/layout.css`
  - `src/css/components.css`
  - `src/css/responsive.css`
  - `src/js/config.js`
  - `src/js/main.js`
  - `src/js/registration.js`
  - `src/js/admin-edit.js`
- Documentation:
  - `docs/redesign/current-state.md`
  - `docs/redesign/redesign-plan.md`
  - `docs/redesign/implementation-phases.md`
- Local continuity only:
  - `codex/*`
  - ignored by Git

## Current Technologies

- Static HTML page with external CSS and JavaScript
- No bundler, no framework, no package manager, no build step
- Google Fonts:
  - `Heebo`
- External integrations:
  - Google Apps Script endpoint for `pageview`, `count`, `registration`, `waitinglist`
  - PayBox payment redirect
  - WhatsApp deep links
  - YouTube embeds
- Deployment assumption:
  - GitHub Pages at `https://shiranmaor.github.io/arug_aroch_basis/`

## Final Page Structure

1. Hero / emotional opening
2. Quick details
3. Pain points
4. Shiran / solution
5. Workshop experience
6. What you will learn
7. Who it is for
8. Videos / trust / social
9. FAQ
10. Registration / waitlist
11. Footer / contact

## Final Business Content State

- Workshop title:
  - `סדנת בסיס בארוג ארוך`
- Configured date:
  - `חמישי, 12 במרץ 2026`
- Time:
  - `10:00–12:30`
- Location:
  - `מודיעין (הכתובת תישלח לאחר הרשמה)`
- Price:
  - `280 ₪`
- Duration:
  - `כשעתיים וחצי`
- Group size:
  - `עד 5 משתתפות`
- Instructor:
  - `שירן מאור, מדריכת נשיאה ומדריכה להתפתחות תינוקות`
- Existing learning content, FAQ, videos, contact details, and social links are all preserved.

## Final UX / Conversion State

- The page now follows the stronger storytelling structure defined in earlier phases.
- The current configured date is past as of `2026-05-30`, and the page now handles that honestly.
- Static fallback and runtime UI both clearly route visitors to:
  - waitlist
  - WhatsApp questions
  - understanding that no payment occurs in past/full/closed states
- CTA paths are now clearer across hero, details, trust, and registration sections.

## Final Visual / Motion / Media State

- Warm premium visual system applied and preserved
- Soft reveal/motion system applied and preserved
- Media/trust framing applied and preserved
- One real local image plus two real YouTube videos are used
- Future media placeholders remain CSS-only and clearly non-fake

## Final Technical State

- Runtime configuration lives in `src/js/config.js`:
  - `workshopDateText`
  - `workshopCapacity`
  - `apiUrl`
  - `payboxUrl`
  - `whatsappPhone`
  - `forceClose`
- Capacity is now centralized and consistent:
  - `workshopCapacity: 5`
- `src/js/registration.js` applies a single workshop state model:
  - `open`
  - `past`
  - `full`
  - `closed`
- `src/js/main.js` still handles:
  - source field
  - date injection
  - drawer behavior
  - WhatsApp link generation
  - motion/reveal setup
- `src/js/admin-edit.js` still supports `?edit=1`, and now makes the target GitHub branch more explicit with:
  - visible branch field
  - warning text that saving writes directly to the selected branch
  - remembered branch value via localStorage

## Final Asset / Link Integrity State

- Local assets used by the page:
  - `assets/images/header.jpeg`
  - `assets/favicon.svg`
- Local asset planning doc:
  - `assets/README.md`
- No broken local image references were intentionally introduced.
- CSS/JS paths remain relative and compatible with GitHub Pages subpath deployment.

## Final Accessibility State

- `lang="he"` and `dir="rtl"` preserved
- semantic header / main / section / footer structure preserved
- skip link present
- drawer nav has accessible label
- form labels preserved and associated
- required markers shown
- focus states preserved
- reduced-motion support preserved
- image alt text present
- iframe titles present

## Final SEO / Social State

- `<title>`:
  - `סדנת בסיס בארוג ארוך עם שירן מאור | נשיאה בטוחה ונעימה`
- Meta description is accurate and waitlist-safe
- Added and preserved:
  - canonical
  - robots
  - theme-color
  - Open Graph basics
  - Twitter card basics
- Existing JSON-LD remains simple and accurate enough for the current page

## Final QA Outcome

- Desktop, tablet, and mobile screenshots were generated locally.
- Page state resolves correctly to `past` for the current configured date.
- JS syntax checks pass for all page scripts.
- Local asset requests returned `200` for key CSS/JS/image/favicon files.
- `?edit=1` still loads.

## Remaining Risks / Caveats

- The configured workshop date is still a past date and should be replaced only when a real future date is available.
- `280 ₪` and `עד 5 משתתפות` still need business confirmation.
- `?edit=1` is still security-sensitive because it writes to GitHub from the browser.
- The admin panel now warns about branch selection, but human care is still required before saving.
- There is still no automated test suite.
