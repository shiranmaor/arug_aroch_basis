# Change Log

## 2026-05-30

- Converted the landing page color system from turquoise/teal to a light-orange palette across CSS variables, direct fills, gradients, focus states, shadows, and JS-injected inline styles.
- The first orange conversion pass left two visual issues:
  - the upper section transition between the hero background and the section below felt too abrupt
  - the footer background was too dark for the softened orange theme
- Refined the follow-up pass without changing layout, content, structure, RTL behavior, or JavaScript logic:
  - smoothed the hero background gradient so the top area flows more naturally into the page background
  - lightened the footer to a softer orange gradient while preserving readable contrast and footer hierarchy
