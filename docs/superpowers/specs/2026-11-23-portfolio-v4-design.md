# Portfolio v4 Design

## Purpose

Redesign the portfolio so the visitor immediately understands that Jan Mesarc is a **game developer**, primarily a gameplay and multiplayer programmer. The site remains a simple, focused portfolio rather than a complex interactive experience.

This work is local until explicitly approved for implementation or publishing. The redesign is experimental and must not be pushed.

## Approved Direction

The approved concept combines an editorial page structure, restrained game-interface cues, a cool technical color palette, and a single professional project explorer.

The chosen exploration directions are:

- **D2:** Game UI, editorial body
- **E1:** Split project selector
- **F3:** Cool technical palette
- **G2:** Persistent side index on desktop
- **H1:** Compact top bar on mobile

## Positioning

The primary identity is:

> Game developer specializing in gameplay and networking systems

The headline should communicate shipped game experience first, while preserving Jan's experience in Unreal Engine, C++, gameplay systems, multiplayer, and his engineering background.

The visual design must not reduce the content to a decorative "game screen." It should support fast reading and make title, role, platform, and links obvious.

## Information Architecture

Preserve the existing portfolio sections and content:

1. About
2. Projects
3. Experience
4. Education
5. Skills
6. Interests

Contact remains available through the existing email and social links.

The order and section content may be presented by redesigned components, but no major content areas will be removed or combined for v4.

## Visual Language

Use a cool off-white and slate-blue visual system:

- off-white/cool gray page surfaces;
- charcoal text and interface chrome;
- muted slate blue for active states and emphasis;
- gold or another restrained warm accent only for rare status or highlight treatment;
- crisp borders and square or minimally rounded corners;
- compact monospace labels for indices, metadata, and controls.

The interface should feel authored and technical rather than flashy or overly game-themed. Avoid scanlines, HUD framing around every block, pixel motifs, strong gradients, excessive animation, and decorative controls that do not lead somewhere.

## Homepage

The homepage combines a concise game-developer headline with restrained game-interface structure.

Recommended hierarchy:

1. Compact identity and location/context.
2. A strong headline stating that Jan builds game systems that ship.
3. A short role summary naming Unreal Engine, C++, gameplay, and multiplayer.
4. Primary actions to view work and get in touch.
5. A compact evidence row with years in games, shipped titles, and engineering experience.

The hero should remain readable at desktop and mobile widths. It should not require project artwork or interactions to explain the primary identity.

## Desktop Navigation

Keep a persistent, narrow side index.

- The index contains only meaningful section anchors.
- The active section is clearly marked.
- Index labels use the existing section order.
- Social links and contact information remain reachable.
- The index does not become a large dashboard or consume excessive width.

The section rail should convert cleanly from sticky to ordinary mobile behavior at the existing breakpoint. Desktop navigation must not obscure page content.

## Mobile Navigation

Use a compact top bar.

- Show Jan's name or a short identity mark.
- Provide an accessible menu control.
- Open a simple section menu from the top.
- Close the menu after navigation.
- Preserve a clear close affordance.
- Do not pin the index to the bottom or permanently cover content.

The mobile presentation has no persistent side rail. Project controls, text, and artwork receive precedence.

## Project Explorer

The professional projects section uses a split selector:

- a compact vertical list of shipped titles on the left;
- the selected title's cover art, role, platforms, and links on the right;
- a clear active/selected state;
- an unobtrusive index such as `01 / 06`.

The first visible project remains the newest or most relevant shipped work.

Interaction behavior:

- selectable title list with visible hover and focus states;
- arrow and keyboard navigation;
- left/right or up/down keys as appropriate to list orientation;
- click, Enter, and Space for selection;
- no selection state changes on mere pointer movement;
- external project links remain normal accessible links;
- reduced-motion preferences are respected.

Hover previews may provide a small visual response, but must not replace or obscure selection. On small screens, the explorer converts to a stacked layout: title selector above, selected cover and details below.

## Other Sections

- **Experience:** chronological entries with role, company, dates, technologies, and selected shipped credits.
- **Education:** concise and subordinate to experience.
- **Skills:** grouped by game development domain rather than presented as a generic skill cloud.
- **Interests:** lightweight supporting context, not a visually dominant section.

## Interactions

V4 interactions stay deliberately limited:

- project selection;
- hover and keyboard focus feedback;
- section navigation and scroll-spy;
- menu open and close;
- existing reveal behavior, if retained, with reduced-motion support.

No game simulation, drag system, cursor gimmick, audio, or unrelated animation is required.

## Responsive Behavior

At desktop widths:

- persistent side index;
- full split project selector;
- generous but not excessive measure for reading.

At tablet widths:

- side index may become a compact top bar if it would reduce useful content width;
- project details may use a more compact split or stack.

At mobile widths:

- top bar navigation;
- stacked project selector;
- large tap targets;
- no sideways page overflow;
- project metadata remains legible;
- external links remain easy to discover.

## Accessibility

- Semantic section and heading structure.
- Keyboard-operable project selection and navigation.
- Visible focus states with sufficient contrast.
- Labels for icon-only controls.
- Respects `prefers-reduced-motion`.
- No color-only selected state.
- Text contrast follows WCAG AA at minimum.

## Technical Constraints

The redesign remains within the current .NET 10 Blazor WebAssembly architecture.

- Section components should remain separate and purposeful.
- Shared navigation and section IDs must stay in sync.
- Existing JS interop should continue to live in `wwwroot/js/scripts.js`.
- Styling should remain in the established CSS structure unless implementation review identifies a clearer organization.
- No new framework or bundler is required.
- Existing project and experience data should be reused.

## Validation

Implementation will be considered visually complete only after:

- desktop and mobile layouts are checked;
- project selection works with mouse and keyboard;
- side/top navigation remains in sync with the active section;
- external links work;
- reduced-motion behavior is correct;
- the .NET build remains warning-free.

No automated test suite will be introduced solely for this redesign.

## Out of Scope

- adding new portfolio sections;
- adding a game demo or playable canvas;
- adding audio;
- rewriting content beyond presentation-focused edits;
- adding CMS or backend functionality;
- publishing or pushing changes.
