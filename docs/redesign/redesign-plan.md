# Redesign Plan

## Scope of This Plan

- This is a planning document for redesign work only.
- Phase 1 must not redesign the page yet.
- Existing business content should be preserved and restructured, not discarded.

## Redesign Goal

Transform the current static workshop page into a premium, emotional, conversion-focused Hebrew RTL landing page that feels calm, warm, confident, and visually memorable while staying:

- simple
- fast
- mobile-first
- static-deployable
- easy to maintain

## Proposed New Landing Page Flow

### 1. Emotional Opening

- Full-bleed hero or near-full-bleed opening with stronger atmosphere.
- Immediate emotional promise:
  - closeness
  - confidence
  - softness
  - support
- Short, high-impact primary CTA.
- Secondary CTA for WhatsApp questions should remain available but de-emphasized versus the main conversion path.

### 2. Parent Pain Points

- A short section that names the real friction:
  - confusion around wraps
  - fear of tying incorrectly
  - physical discomfort
  - wanting closeness without stress
- This should validate the parent emotionally before moving into instruction.

### 3. Shiran’s Solution

- Introduce Shiran as the calm guide who makes woven wrap use understandable and doable.
- Explain what makes this workshop practical, safe, and supportive.
- Include concise credibility cues without making it feel clinical.

### 4. Workshop Experience

- Explain how the session feels:
  - small group
  - guided practice
  - supportive pace
  - real-life parenting welcome
- This section should reduce intimidation.

### 5. What Participants Learn

- Reframe the current bullet list into grouped outcomes:
  - safety
  - fit and comfort
  - tying technique
  - confidence after the workshop
- Keep the WhatsApp support continuation as a meaningful post-workshop benefit.

### 6. Trust and Credibility

- Dedicated section for:
  - instructor credentials
  - group size
  - workshop format
  - practical guidance
- Optionally add “why woven wrap” or “why learn in person” angle if it strengthens trust.

### 7. Videos / Social Proof

- Keep existing videos, but frame them better.
- Add room for future testimonials, short quotes, or micro proof points.
- If no real testimonials exist yet, leave clear placeholder structure without inventing proof.

### 8. FAQ

- Keep current FAQ and expand only if real new questions are confirmed later.
- Design it as a calmer final reassurance step.

### 9. Registration CTA

- End with a stronger closing conversion block.
- Include current date / price / location / payment expectations.
- Keep WhatsApp as a lower-friction fallback CTA.

## Section-by-Section Proposed Structure

1. Sticky top area with simplified nav and persistent CTA
2. Hero with emotional message, image/video, and core CTA
3. Pain-point / empathy section
4. Shiran introduction / solution section
5. Workshop experience section
6. Learning outcomes section
7. Practical details strip
8. Videos / proof section
9. FAQ section
10. Registration section
11. Footer with contact and social links

## Visual Concept

### Direction

- Warm, soft, premium, calm, emotional.
- Should feel intimate and elevated, not childish and not startup-tech.
- The page should suggest fabric, touch, closeness, breath, and confidence.

### Suggested Design Language

- Palette direction:
  - warm creams
  - sand
  - soft clay / blush accents
  - muted olive or sage support tones
  - deep warm brown or espresso for text contrast
- Keep teal only if used sparingly and intentionally; current palette should not define the redesign.
- Typography direction:
  - expressive Hebrew-capable display heading paired with a highly readable body font
  - avoid generic default visual feel
- Shapes:
  - soft edges
  - layered panels
  - subtle fabric-like curves
- Texture:
  - faint grain, soft gradients, textile-inspired backgrounds, or blurred light fields

## Animation Concept

### Desired Motion Style

- Gentle, cinematic, and calm.
- No flashy or aggressive transitions.

### Candidate Motion Patterns

- Scroll-based reveals with opacity + translate + slight scale settling.
- Section transitions that feel like fabric unfolding.
- Soft parallax on hero image or background shapes.
- Hover states with slight lift, glow, or background drift.
- CTA emphasis through restrained motion, not pulsing spammy animation.
- FAQ open/close refinement with smoother height and opacity treatment.

### Storytelling Motion Ideas

- “Parent journey” motion arc:
  - opening tension / uncertainty
  - guided clarity
  - calm confidence by the registration section
- Background shape flow that echoes wrap movement around the body.
- Optional transition bands between sections that mimic layered cloth folds.

### Avoid

- Heavy 3D
- WebGL unless a later phase proves clear value
- Performance-costly scroll effects on low-end mobile devices
- Over-animated decorative elements that distract from conversion

## Mobile Behavior

- Mobile-first layout must lead the design, not be a later adaptation.
- Hero should remain emotionally strong on narrow screens.
- Sticky CTA should not block content or keyboard interactions.
- Registration form should remain easy to complete with large tap targets.
- Videos should remain responsive and not dominate the page vertically.
- Animations should degrade gracefully on mobile and respect reduced-motion preferences.
- Section spacing should remain airy without becoming excessively tall.

## Image / Video Strategy

### Ideal Real Assets

- Real photography should lead the visual identity.
- Highest-value image types:
  - close, emotional parent-baby moments using woven wraps
  - Shiran guiding a participant
  - workshop environment in soft natural light
  - detail shots of fabric texture, tying, hands, and closeness
  - calm candid interactions rather than posed stock-feeling images

### Background Video Use

- Optional, only if a short loop materially improves atmosphere.
- Best candidate:
  - muted, lightweight hero background clip showing wrap motion or close parent-baby movement
- Must be:
  - silent
  - compressed
  - non-essential
  - replaceable with a poster image on mobile / reduced motion

### Placeholder Strategy for Now

- Use neutral placeholders only where assets are truly missing.
- Avoid generic baby stock that weakens premium feel.
- Better temporary fallback:
  - enlarged existing `header.jpeg`
  - blurred crop variants
  - abstract warm textile backgrounds

### AI-Generated Visuals

- Appropriate only for:
  - abstract textile-inspired background textures
  - non-human decorative mood visuals
- Not recommended for:
  - fake parent/baby workshop photography
  - fake testimonial imagery
- Real people and workshop imagery should remain authentic.

### Asset Storage Proposal

- Future local asset structure:
  - `assets/images/`
  - `assets/videos/`
  - `assets/icons/`
- Recommended naming convention:
  - lowercase kebab-case
  - purpose-first names
  - examples:
    - `hero-shiran-babywearing.jpg`
    - `section-workshop-practice-01.jpg`
    - `bg-fabric-texture-soft.jpg`
    - `hero-wrap-motion-loop.mp4`
    - `video-poster-arug-aroch-basics.jpg`

## Proposed File / Component Structure For Redesign

The project should remain static-friendly. A simple split without introducing a heavy framework is preferred.

### Recommended Structure

- `index.html`
- `assets/`
  - `images/`
  - `videos/`
  - `icons/`
- `styles/`
  - `base.css`
  - `components.css`
  - `sections.css`
  - `utilities.css`
- `scripts/`
  - `config.js`
  - `content.js`
  - `main.js`
  - `registration.js`
  - `admin.js`
  - `animations.js`

### Optional Alternative

- Keep a single `index.html`, but split CSS and JS into external files only.
- This is probably the best balance between maintainability and GitHub Pages simplicity.

## Risks and Constraints

- Existing business logic is mixed with content and UI; redesign must not break:
  - registration submission
  - waiting list mode
  - full workshop logic
  - payment redirect
  - pageview tracking
- Current date and capacity logic are inconsistent and need careful preservation/replacement in later phases.
- The live page currently depends on an external Apps Script and PayBox link; those are critical integration points.
- The current page already has an ad hoc content editing mode via `?edit=1`; any redesign must decide whether to preserve, replace, or retire it.
- The project must stay easy to deploy as a static page.
- Hebrew RTL support must remain first-class throughout.

## What Should Not Be Changed Yet

- Do not rewrite the live markup in Phase 1.
- Do not change the current registration logic in Phase 1.
- Do not remove existing content in Phase 1.
- Do not add dependencies in Phase 1.
- Do not alter deployment setup in Phase 1.
- Do not replace the current PayBox or Apps Script integration in Phase 1.

