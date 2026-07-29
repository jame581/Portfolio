# Portfolio Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix build warnings, cut loading overhead, and update projects content.

**Architecture:** Three independent task groups — each produces a passing build with 0 warnings. No test framework exists; verification is `dotnet build` (0 warnings) + manual browser check.

**Tech Stack:** Blazor WebAssembly (.NET 10), C#, Bootstrap 5.3 (CDN), FontAwesome 6 (local CSS + webfonts), custom CSS, vanilla JS.

## Global Constraints

- Target framework: `net10.0`
- Never break the existing build — always verify with `dotnet build` after each task
- Worktree path: `/home/jame/Projects/Godot/copilot-worktrees/Portfolio/jame581-fuzzy-engine/`
- All file paths below are relative to the worktree root

---

## Task 1: Fix Build Warnings

**Files:**
- Modify: `Portfolio/Portfolio.csproj`
- Modify: `Portfolio/Components/AnchorNavigation.razor:25`

**Context:**  
Two warnings found in the current build:
1. `NU1510` — `System.Text.Json` is an explicit package reference that ships with .NET 10 and doesn't need to be listed.
2. `CS8622` — `OnLocationChanged(object sender, …)` uses non-nullable `object` but the `EventHandler<LocationChangedEventArgs>` delegate expects nullable `object?`.

- [ ] **Step 1: Remove System.Text.Json from csproj**

Open `Portfolio/Portfolio.csproj`. Remove this line from the `<ItemGroup>`:

```xml
<PackageReference Include="System.Text.Json" Version="10.0.9" />
```

The file should look like this after the change:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.Components.WebAssembly" Version="10.0.9" />
  <PackageReference Include="Microsoft.AspNetCore.Components.WebAssembly.DevServer" Version="10.0.9" PrivateAssets="all" />
</ItemGroup>
```

- [ ] **Step 2: Fix nullable sender in AnchorNavigation.razor**

In `Portfolio/Components/AnchorNavigation.razor`, change line 25 from:

```csharp
private async void OnLocationChanged(object sender, LocationChangedEventArgs e)
```

to:

```csharp
private async void OnLocationChanged(object? sender, LocationChangedEventArgs e)
```

- [ ] **Step 3: Verify 0 warnings**

```bash
cd Portfolio && dotnet build 2>&1 | grep -i "warning\|error"
```

Expected output: `0 Warning(s)  0 Error(s)`

- [ ] **Step 4: Commit**

```bash
git add Portfolio/Portfolio.csproj Portfolio/Components/AnchorNavigation.razor
git commit -m "fix: resolve NU1510 and CS8622 build warnings

- Remove redundant System.Text.Json package reference (ships with net10.0)
- Fix nullable mismatch on LocationChanged event handler sender parameter

Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: Remove Duplicate FontAwesome JS Bundle

**Files:**
- Modify: `Portfolio/wwwroot/index.html`
- Delete: `Portfolio/wwwroot/js/fontawesome.min.js`

**Context:**  
FontAwesome icons are already loaded via `@import` rules at the top of `app.css` (lines 1–3), which pulls in `fontawesome.min.css`, `brands.min.css`, and `solid.min.css` from the local `css/fontawesome/` folder. The JS bundle `fontawesome.min.js` (56 KB) loads FontAwesome a second time, doing unnecessary DOM scanning at runtime. Remove the JS bundle — the CSS already handles all icons.

Only `fa-brands` icons are actually used (`fa-linkedin-in`, `fa-github`, `fa-itch-io`, `fa-mastodon`). `solid.min.css` and the `@import` for it can also be removed. However, to keep Task 2 minimal and safe, just remove the script tag. Cleanup of the unused solid import can happen as part of Task 3.

- [ ] **Step 1: Remove the fontawesome script tag from index.html**

In `Portfolio/wwwroot/index.html`, remove this line:

```html
<script src="js/fontawesome.min.js"></script>
```

The scripts block at the bottom of `<body>` should then be:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" ...></script>
<script src="js/scripts.js"></script>
<script src="_framework/blazor.webassembly.js"></script>
```

- [ ] **Step 2: Delete the JS bundle file**

```bash
git rm Portfolio/wwwroot/js/fontawesome.min.js
```

- [ ] **Step 3: Verify build and icons still render**

```bash
cd Portfolio && dotnet build 2>&1 | grep -i "warning\|error"
```

Then run the dev server and verify the LinkedIn, GitHub, itch.io, and Mastodon icons are still visible in the sidebar:

```bash
cd Portfolio && dotnet run
```

Open `http://localhost:5000` (or the port shown) and check the sidebar social icons.

- [ ] **Step 4: Commit**

```bash
git add Portfolio/wwwroot/index.html
git commit -m "perf: remove duplicate FontAwesome JS bundle

FA icons are already served by CSS imports in app.css.
The JS bundle (56 KB) was loading FA a second time and scanning the DOM
at runtime. Removing it has no visual effect.

Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Remove Bootstrap JS + Consolidate CSS

**Files:**
- Modify: `Portfolio/wwwroot/index.html`
- Create: `Portfolio/wwwroot/css/site.css`
- Delete: `Portfolio/wwwroot/css/app.css`
- Delete: `Portfolio/wwwroot/css/layout.css`
- Delete: `Portfolio/wwwroot/css/styles.css`

**Context:**  
No `data-bs-*` attributes exist anywhere in the codebase — Bootstrap JS (dropdowns, modals, collapses) is entirely unused. The custom drawer is handled by `scripts.js` and Blazor C#.

Three CSS files (4 KB + 4 KB + 28 KB) can be merged into one `site.css`, saving 2 HTTP round-trips on first paint.

`layout.css` is currently just a comment. `app.css` starts with three FontAwesome `@import` rules that create a nested cascade (browser must download app.css, then trigger 3 more downloads). Replace those `@import` calls with direct `<link>` tags in `index.html` so all CSS downloads start in parallel.

- [ ] **Step 1: Create site.css by merging the three CSS files**

Create `Portfolio/wwwroot/css/site.css` with the following content, in order:
1. The content of `app.css` **minus** the three `@import` lines at the top (lines 1–3) and minus the empty commented-out `@import url('styles.css')` line (line 4)
2. A separator comment: `/* === layout.css === */` (layout.css is empty — just the comment separator is fine, no content to add)
3. The full content of `styles.css`

Concretely, `site.css` starts at line 6 of app.css (`html, body { ...`) and ends with the last line of `styles.css`. Do not include the FontAwesome import lines.

- [ ] **Step 2: Update index.html**

Replace the three CSS `<link>` tags:

```html
<link href="css/app.css" rel="stylesheet" />
<link href="css/styles.css" rel="stylesheet" />
<link href="css/layout.css" rel="stylesheet" />
```

With FontAwesome `<link>` tags (replacing the CSS @imports) plus one `site.css` link:

```html
<link href="css/fontawesome/fontawesome.min.css" rel="stylesheet" />
<link href="css/fontawesome/brands.min.css" rel="stylesheet" />
<link href="css/site.css" rel="stylesheet" />
```

Note: `solid.min.css` is omitted — no solid icons are used in the codebase.

Also remove the Bootstrap JS script tag from the bottom of `<body>`:

```html
<!-- Remove this line: -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
```

- [ ] **Step 3: Delete the old CSS files**

```bash
git rm Portfolio/wwwroot/css/app.css Portfolio/wwwroot/css/layout.css Portfolio/wwwroot/css/styles.css
```

- [ ] **Step 4: Verify build and visual appearance**

```bash
cd Portfolio && dotnet build 2>&1 | grep -i "warning\|error"
cd Portfolio && dotnet run
```

Open the site and verify:
- Loading spinner appears during WASM load
- Sidebar renders with correct layout and icons
- All sections (About, Experience, Projects, Education, Skills, Interests) render correctly
- Reveal animations work on scroll
- Mobile drawer opens/closes correctly

- [ ] **Step 5: Commit**

```bash
git add Portfolio/wwwroot/css/site.css Portfolio/wwwroot/index.html
git commit -m "perf: consolidate CSS and remove unused Bootstrap JS

- Merge app.css + layout.css + styles.css into site.css (saves 2 HTTP round-trips)
- Move FontAwesome @imports to direct <link> tags in index.html (parallel download)
- Remove Bootstrap bundle JS (no data-bs-* components used)

Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 4: Projects Content Update

**Files:**
- Modify: `Portfolio/Components/ProjectSection.razor`
- Modify: `Portfolio/Components/AboutSection.razor`
- Add: `Portfolio/wwwroot/images/fires-edge-placeholder.jpg`

**Context:**  
Add the Darkest Dungeon: The Fire's Edge DLC to the filmstrip, reorder all titles by most-recent-work-first, and fix the hero stat counter from 4 to 6.

- [ ] **Step 1: Add placeholder image**

Copy the existing Darkest Dungeon cover as a placeholder:

```bash
cp Portfolio/wwwroot/images/darkest-dungeon.jpg Portfolio/wwwroot/images/fires-edge-placeholder.jpg
```

This will be replaced with the real cover art once the DLC is released.

- [ ] **Step 2: Replace ShippedTitles array in ProjectSection.razor**

In `Portfolio/Components/ProjectSection.razor`, replace the entire `ShippedTitles` static array with the reordered version including the new Fire's Edge entry:

```csharp
private static readonly Shipped[] ShippedTitles =
{
    new("Darkest Dungeon: The Fire's Edge", "2026", "DLC · Gameplay Programmer",
        "images/fires-edge-placeholder.jpg",
        "A major DLC for the gothic roguelike Darkest Dungeon. Implemented the full DLC on the code side for PC.",
        "Gameplay programmer · PC",
        new[]
        {
            new ProjectLink("Steam", "https://store.steampowered.com/app/4964110/Darkest_Dungeon_The_Fires_Edge/"),
        }),
    new("Phantom Fury", "2024", "Gameplay Systems", "images/phantom-fury.jpg",
        "Retro-inspired first-person shooter with fast-paced action, creative weapons and a cross-country road trip.",
        "Gameplay · Unreal · C++",
        new[]
        {
            new ProjectLink("Steam", "https://store.steampowered.com/app/1733240/Phantom_Fury/"),
            new ProjectLink("Site",  "https://www.slipgate-ironworks.com/phantom-fury/"),
        }),
    new("MOTHERGUNSHIP: FORGE", "2023", "UE4 → UE5 Migration", "images/mothergunship-forge.jpg",
        "VR FPS roguelite where you forge absurdly powerful guns and blast through the belly of a metal alien monstrosity — the follow-up to MOTHERGUNSHIP.",
        "Engine migration · Unreal · C++",
        new[]
        {
            new ProjectLink("Steam", "https://store.steampowered.com/app/1931240/MOTHERGUNSHIP_FORGE/"),
        }),
    new("The Last Oricru", "2022", "Gameplay Systems", "images/the-last-oricru.jpg",
        "Story-driven action-RPG set in a sci-fi medieval world, focused on impactful player choices and co-op gameplay.",
        "Gameplay & networking · Unreal · C++",
        new[]
        {
            new ProjectLink("Steam", "https://store.steampowered.com/app/1663640/The_Last_Oricru/"),
            new ProjectLink("Site",  "https://lastoricru.com/"),
        }),
    new("Beat Saber", "2018", "Live Ops · Updates", "images/beat-saber.jpg",
        "Award-winning VR rhythm game where players slash beats to music. Contributing on live updates and platform work.",
        "Gameplay · Unreal · C++",
        new[]
        {
            new ProjectLink("Steam", "https://store.steampowered.com/app/620980/Beat_Saber/"),
            new ProjectLink("Site",  "https://beatsaber.com/"),
        }),
    new("Darkest Dungeon", "2016", "Contributor", "images/darkest-dungeon.jpg",
        "Challenging gothic roguelike turn-based RPG about the psychological stresses of adventuring.",
        "Engineering support",
        new[]
        {
            new ProjectLink("Steam", "https://store.steampowered.com/app/262060/Darkest_Dungeon/"),
            new ProjectLink("Site",  "https://www.darkestdungeon.com/"),
        }),
};
```

- [ ] **Step 3: Fix hero stat in AboutSection.razor**

In `Portfolio/Components/AboutSection.razor`, find the hero stats block and change the titles stat from `4` to `6`:

Change:
```html
<div class="n">4<span class="unit">titles</span></div>
<div class="l">Shipped, professional</div>
```

To:
```html
<div class="n">6<span class="unit">titles</span></div>
<div class="l">Shipped, professional</div>
```

- [ ] **Step 4: Verify build and filmstrip**

```bash
cd Portfolio && dotnet build 2>&1 | grep -i "warning\|error"
cd Portfolio && dotnet run
```

Open the site and verify:
- Filmstrip shows 6 titles: Fire's Edge first, Darkest Dungeon last
- Fire's Edge card shows 2026, correct description, Steam link works
- Hero stats show "6 titles"
- Strip-controls label shows "6 titles · scroll →"

- [ ] **Step 5: Commit**

```bash
git add Portfolio/Components/ProjectSection.razor Portfolio/Components/AboutSection.razor Portfolio/wwwroot/images/fires-edge-placeholder.jpg
git commit -m "content: add Fire's Edge DLC, reorder filmstrip, fix hero stat

- Add Darkest Dungeon: The Fire's Edge (2026) as newest shipped title
- Reorder filmstrip by most-recent-work: Fire's Edge, Phantom Fury,
  MOTHERGUNSHIP: FORGE, The Last Oricru, Beat Saber, Darkest Dungeon
- Fix hero stat: 4 titles → 6 titles
- Placeholder cover image until release art is available

Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

---

## Spec Reference

Design spec: `docs/superpowers/specs/2026-07-29-portfolio-improvements-design.md`
