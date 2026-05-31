# Change Log

## 2026-05-31

- Fixed an inconsistency in `index.html` workshop registration capacity logic.
- Confirmed the intended workshop limit remains 5 participants, matching the visible text `עד 5 משתתפות`.
- Corrected the page-load availability check from `count >= 4` to `count >= 5` so the workshop no longer appears full one registration too early.
- Left the submit-time logic unchanged because it already used the correct `count >= 5` threshold for switching from paid registration to waiting-list handling.

## 2026-05-30

- Converted the landing page color system from turquoise/teal to a light-orange palette across CSS variables, direct fills, gradients, focus states, shadows, and JS-injected inline styles.
- The first orange conversion pass left two visual issues:
  - the upper section transition between the hero background and the section below felt too abrupt
  - the footer background was too dark for the softened orange theme
- Refined the follow-up pass without changing layout, content, structure, RTL behavior, or JavaScript logic:
  - smoothed the hero background gradient so the top area flows more naturally into the page background
  - lightened the footer to a softer orange gradient while preserving readable contrast and footer hierarchy
