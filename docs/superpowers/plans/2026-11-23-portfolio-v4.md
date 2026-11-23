# Portfolio v4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing Blazor portfolio as a cool technical, game-developer-focused v4 experience.

**Architecture:** Preserve the existing Blazor component boundaries and data sources, replace the visual shell and page styling, and upgrade the project and navigation components only where interaction changes are required. Keep JS interop concentrated in `Portfolio/wwwroot/js/scripts.js`, maintain section-ID synchronization, and retain the existing `/fetchgithubdata` route.

**Tech Stack:** .NET 10, Blazor WebAssembly, C#, Razor, vanilla JavaScript, CSS.

**Spec:** `docs/superpowers/specs/2026-11-23-portfolio-v4-design.md`

## Global Constraints

- Target framework: `net10.0`.
- `.NET` build must remain warning-free.
- Keep the `<base href="/" />` unchanged.
- Preserve the existing Google Analytics tag.
- Keep the current About, Projects, Experience, Education, Skills, and Interests sections.
- Use the established section-ID arrays and components; do not rename or duplicate section IDs.
- Keep JS interop in `Portfolio/wwwroot/js/scripts.js`.
- The visual identity must stay cool technical, restrained, and game-developer-focused.
- Use no em dashes or `·` separators in visible copy.
- Desktop navigation is a persistent side index.
- Mobile navigation is a compact top bar with a collapsible menu.
- Project browsing is a keyboard-accessible split selector.
- No push is allowed until the user explicitly requests it.
- No automated test framework is present; validation is `dotnet build` plus manual desktop/mobile browser review.

---

### Task 1: Establish v4 Shell and Palette

**Files:**
- Modify: `Portfolio/wwwroot/css/site.css`
- Modify: `Portfolio/Shared/MainLayout.razor`
- Modify: `Portfolio/Pages/Index.razor`

**Interfaces:**
- Consumes: existing `.app`, `.sidebar`, `main.content`, and section components.
- Produces: v4 shell classes and a stable page-width/layout surface.

- [ ] **Step 1: Replace the root palette with the cool technical F3 system**

Update `:root` in `Portfolio/wwwroot/css/site.css` to use cool off-white surfaces, charcoal text, slate-blue active emphasis, and a restrained warm highlight. Keep the existing `--pad`, `--mono`, `--sans`, and `--disp` variables if those font resources remain linked.

- [ ] **Step 2: Add shell-specific v4 layout classes**

Update `Portfolio/Shared/MainLayout.razor` only if semantic wrapper labels are needed. Otherwise keep the existing markup and add the v4 classes or styling through `Portfolio/wwwroot/css/site.css`.

- [ ] **Step 3: Retitle the route metadata**

In `Portfolio/Pages/Index.razor`, keep `Jan Mesarc, gameplay and networking programmer` as supporting copy only if the final visible product clearly leads with “game developer.”

- [ ] **Step 4: Build and inspect shell output**

Run: `dotnet build Portfolio/Portfolio.csproj --nologo`

Expected: build succeeds with 0 warnings and 0 errors.

- [ ] **Step 5: Commit**

```bash
git add Portfolio/wwwroot/css/site.css Portfolio/Shared/MainLayout.razor Portfolio/Pages/Index.razor
git diff --cached --check
git commit -m "feat: establish portfolio v4 shell"
```

### Task 2: Redesign Desktop and Mobile Navigation

**Files:**
- Modify: `Portfolio/Shared/NavMenu.razor`
- Modify: `Portfolio/wwwroot/css/site.css`
- Modify: `Portfolio/wwwroot/js/scripts.js`

**Interfaces:**
- Consumes: `NavMenu.Sections`, `PortfolioObserveSections`, `NavMenu.ToggleDrawer`, and `NavMenu.CloseDrawerFromJs`.
- Produces: G2 desktop side index, H1 mobile top-bar menu, and consistent active-section behavior.

- [ ] **Step 1: Preserve the existing ordered section array**

Keep this exact order: `about`, `projects`, `experience`, `education`, `skills`, `interests`.

- [ ] **Step 2: Update the sidebar identity**

In `Portfolio/Shared/NavMenu.razor`, change visible role text to explicitly lead with game development, for example:

```razor
<div class="sb-role">Game developer</div>
```

Keep the profile image and social links.

- [ ] **Step 3: Add mobile menu accessibility state**

Keep `_drawerOpen`, `aria-label`, and `aria-expanded`. Ensure the menu closes after a section link is selected and on Escape or viewport expansion beyond 900px.

- [ ] **Step 4: Style G2 and H1**

In `Portfolio/wwwroot/css/site.css`, keep the persistent side rail on desktop and convert it to the compact top bar at `max-width: 900px`. The mobile top bar must show Jan's identity and a labeled menu control. The opened menu must sit below the bar and must not remain pinned to the bottom.

- [ ] **Step 5: Remove obsolete drawer-only behavior**

Update `Portfolio/wwwroot/js/scripts.js` only if existing escape/resize behavior needs names or cleanup changes. Retain `PortfolioDrawer.bind` and `PortfolioDrawer.unbind`.

- [ ] **Step 6: Build and manually verify navigation**

Run: `dotnet build Portfolio/Portfolio.csproj --nologo`

Expected: build succeeds with 0 warnings and 0 errors.

Manual review:
- side index remains persistent on desktop;
- active section follows scroll;
- top bar fits mobile widths;
- menu opens, closes, and restores focus appropriately;
- public repositories remains reachable.

- [ ] **Step 7: Commit**

```bash
git add Portfolio/Shared/NavMenu.razor Portfolio/wwwroot/css/site.css Portfolio/wwwroot/js/scripts.js
git diff --cached --check
git commit -m "feat: add portfolio v4 navigation"
```

### Task 3: Reframe the Hero Around Game Development

**Files:**
- Modify: `Portfolio/Components/AboutSection.razor`
- Modify: `Portfolio/wwwroot/css/site.css`

**Interfaces:**
- Consumes: existing `Stats`, `Facts`, profile asset, and `ScrollTo`.
- Produces: a game-developer-first hero with compact evidence and actions.

- [ ] **Step 1: Update the hero headline**

In `Portfolio/Components/AboutSection.razor`, lead with:

```razor
<h1 class="statement reveal">I build game systems that <span class="mark">ship</span>.</h1>
```

Add a supporting line that makes gameplay, multiplayer, Unreal Engine, C++, and shipped work clear.

- [ ] **Step 2: Rework hero metadata**

Preserve location, email, and availability. Keep labels compact and secondary to the headline.

- [ ] **Step 3: Retain evidence data**

Preserve the existing `Stats` array:

- `5` Years in games
- `6` Shipped titles
- `10+` Years engineering

- [ ] **Step 4: Style the hero**

Use the F3 slate-blue palette, a strong type hierarchy, crisp labels, and understated game-interface cues. Do not use em dashes or `·` in visible copy.

- [ ] **Step 5: Build and manually verify**

Run: `dotnet build Portfolio/Portfolio.csproj --nologo`

Expected: build succeeds with 0 warnings and 0 errors.

Manual review:
- visitor understands the game-developer identity before reading the second sentence;
- hero works with a one-column mobile layout;
- portrait and actions do not overflow.

- [ ] **Step 6: Commit**

```bash
git add Portfolio/Components/AboutSection.razor Portfolio/wwwroot/css/site.css
git diff --cached --check
git commit -m "feat: reframe portfolio hero for game development"
```

### Task 4: Replace the Project Filmstrip with a Split Explorer

**Files:**
- Modify: `Portfolio/Components/ProjectSection.razor`
- Modify: `Portfolio/wwwroot/css/site.css`
- Modify: `Portfolio/wwwroot/js/scripts.js`

**Interfaces:**
- Consumes: `Shipped[]`, `ProjectLink[]`, `stripEl`, and project images.
- Produces: `_selectedProjectIndex`, `SelectProject`, `HandleProjectKey`, and E1 split-selector markup.

- [ ] **Step 1: Add explicit project selection state**

In `Portfolio/Components/ProjectSection.razor`, add:

```razor
private int _selectedProjectIndex;

private Shipped SelectedProject => ShippedTitles[_selectedProjectIndex];

private void SelectProject(int index)
{
    _selectedProjectIndex = Math.Clamp(index, 0, ShippedTitles.Length - 1);
}
```

- [ ] **Step 2: Replace filmstrip markup with split-selector markup**

Render a left title list and right selected-project panel. Keep `ShippedTitles` and `ItchEntries` unchanged. Include the selected index in a visible label such as `01 / 06`.

- [ ] **Step 3: Add keyboard navigation**

Handle `@onkeydown="HandleProjectKey"` on the title list or use individual selectable buttons. Support ArrowUp, ArrowLeft, ArrowDown, and ArrowRight by selecting an adjacent project. Home and End may move to the first and last project.

- [ ] **Step 4: Preserve accessible project links**

Each selected project link remains a normal anchor with `target="_blank"` and `rel="noopener"`.

- [ ] **Step 5: Replace strip JS**

Remove or leave unused `PortfolioScrollStrip`; do not introduce a new script if Blazor state can implement selection. If project key handling needs JS to prevent scrolling, implement it in Razor or in `scripts.js` as a focused helper.

- [ ] **Step 6: Style E1 and stacked mobile behavior**

Desktop: compact vertical selector and dominant project artwork/details.

Mobile: selector above selected project, no horizontal overflow, large tap targets, metadata wrapping cleanly.

- [ ] **Step 7: Build and manually verify**

Run: `dotnet build Portfolio/Portfolio.csproj --nologo`

Expected: build succeeds with 0 warnings and 0 errors.

Manual review:
- selected state is obvious;
- keyboard navigation wraps or clamps predictably;
- focus is visible;
- project links work;
- mobile layout is stacked.

- [ ] **Step 8: Commit**

```bash
git add Portfolio/Components/ProjectSection.razor Portfolio/wwwroot/css/site.css Portfolio/wwwroot/js/scripts.js
git diff --cached --check
git commit -m "feat: add split project explorer"
```

### Task 5: Apply v4 Styling to the Supporting Sections

**Files:**
- Modify: `Portfolio/Components/ExperienceSection.razor`
- Modify: `Portfolio/Components/EducationSection.razor`
- Modify: `Portfolio/Components/SkillsSection.razor`
- Modify: `Portfolio/Components/InterestsSection.razor`
- Modify: `Portfolio/wwwroot/css/site.css`

**Interfaces:**
- Consumes: existing entry arrays and existing reveal classes.
- Produces: consistent v4 section markers, entries, skills, education, and interests.

- [ ] **Step 1: Retain all section data and IDs**

Do not change `id="experience"`, `id="education"`, `id="skills"`, or `id="interests"`. Keep the existing data arrays and copy unless a presentation-only edit is necessary.

- [ ] **Step 2: Redesign section markers**

Use compact section indices, rule lines, and monospace metadata. Preserve Projects deliberately before Experience.

- [ ] **Step 3: Improve supporting-section hierarchy**

In Experience, preserve chronological entries and shipped-credit summaries. In Skills, keep game-engine/language groups. In Education and Interests, keep compact subordinate layouts.

- [ ] **Step 4: Update CSS**

Add or revise v4 CSS rules for `.xp`, `.edu`, `.skill-block`, `.chip`, `.interests-grid`, and `.interest`. Keep the side index and project selector styles consistent.

- [ ] **Step 5: Build and manually verify**

Run: `dotnet build Portfolio/Portfolio.csproj --nologo`

Expected: build succeeds with 0 warnings and 0 errors.

Manual review:
- all sections remain present;
- long experience and credits copy remain readable;
- skills and interests remain compact;
- no horizontal overflow at 360px, 768px, and desktop widths.

- [ ] **Step 6: Commit**

```bash
git add Portfolio/Components/ExperienceSection.razor Portfolio/Components/EducationSection.razor Portfolio/Components/SkillsSection.razor Portfolio/Components/InterestsSection.razor Portfolio/wwwroot/css/site.css
git diff --cached --check
git commit -m "feat: apply portfolio v4 supporting sections"
```

### Task 6: Responsive, Accessibility, and Motion Pass

**Files:**
- Modify: `Portfolio/wwwroot/css/site.css`
- Modify: `Portfolio/wwwroot/js/scripts.js`
- Modify: `Portfolio/Shared/NavMenu.razor`
- Modify: `Portfolio/Components/ProjectSection.razor`

**Interfaces:**
- Consumes: v4 classes and existing reveal/observer code.
- Produces: complete responsive and reduced-motion behavior.

- [ ] **Step 1: Audit focus states**

Ensure all anchors and buttons use `:focus-visible`, with no focus outline removed without a visible replacement.

- [ ] **Step 2: Audit reduced-motion behavior**

In `scripts.js`, preserve smooth scrolling only when `prefers-reduced-motion` is false. Keep reveal elements visible in reduced-motion mode.

- [ ] **Step 3: Audit mobile targets and overflow**

Confirm menu controls and project selectors meet practical touch targets. Confirm `main`, `.strip` replacements, sidebar, and project details do not introduce page-wide horizontal overflow.

- [ ] **Step 4: Audit metadata and contrast**

Review text against the F3 palette. Slate-blue text used for small labels must meet WCAG AA contrast where it is essential.

- [ ] **Step 5: Run final build**

Run: `dotnet build Portfolio/Portfolio.csproj --nologo`

Expected: build succeeds with 0 warnings and 0 errors.

- [ ] **Step 6: Manually test all routes and breakpoints**

Run: `dotnet run --project Portfolio/Portfolio.csproj`

Check:
- `/`;
- `/#about`;
- `/#projects`;
- `/#experience`;
- `/#education`;
- `/#skills`;
- `/#interests`;
- `/fetchgithubdata`;
- widths at 360px, 768px, 900px, 1100px, and desktop.

- [ ] **Step 7: Commit**

```bash
git add Portfolio/wwwroot/css/site.css Portfolio/wwwroot/js/scripts.js Portfolio/Shared/NavMenu.razor Portfolio/Components/ProjectSection.razor
git diff --cached --check
git commit -m "feat: complete portfolio v4 responsive pass"
```
