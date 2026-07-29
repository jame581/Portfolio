# Portfolio Improvements — Design Spec

**Date:** 2026-07-29  
**Author:** Jan Mesarc  
**Scope:** Three focused improvement passes on the Blazor WebAssembly portfolio site.

---

## 1. Build Warnings

**Goal:** Zero build warnings in Debug and Release.

**Findings from `dotnet build`:**

| Warning | Location | Description |
|---------|----------|-------------|
| NU1510 | `Portfolio.csproj` | `System.Text.Json` explicit reference is unnecessary — it ships with the .NET 10 framework. Remove from `.csproj`. |
| CS8622 | `Components/AnchorNavigation.razor:25` | `OnLocationChanged(object sender, …)` — parameter type should be `object?` to match `EventHandler<LocationChangedEventArgs>` delegate signature. |

**Fix policy:** Fix both warnings. Neither requires a behavioural change.

---

## 2. Loading Time Optimization (Approach A — Low-Hanging Fruit)

**Goal:** Reduce first-paint cost without structural rewrites.

### 2a. FontAwesome JS → CSS

| | Before | After |
|--|--------|-------|
| File | `js/fontawesome.min.js` (56 KB, JS execution, DOM scanning) | `css/fontawesome/fontawesome.min.css` + `css/fontawesome/brands.min.css` |
| How | Replace `<script src="js/fontawesome.min.js">` in `index.html` with two `<link>` tags | |
| Delete | `wwwroot/js/fontawesome.min.js` | |

**Icons in use** (verified): `fa-brands fa-linkedin-in`, `fa-brands fa-github`, `fa-brands fa-itch-io`, `fa-brands fa-mastodon`. Twitter uses an inline SVG — no FontAwesome icon. `solid.min.css` is not needed.

### 2b. Bootstrap JS — Remove

No `data-bs-*` attributes found anywhere in the codebase. Bootstrap interactive JS (dropdowns, modals, collapses) is unused. The custom drawer is implemented in `scripts.js` / Blazor C#.

**Action:** Remove `bootstrap.bundle.min.js` `<script>` tag from `index.html`.

### 2c. Consolidate CSS

Three CSS files (4 KB + 4 KB + 28 KB = 36 KB) → one `site.css`. Eliminates 2 extra HTTP round-trips on first load.

**Merge order** (preserves cascade):
1. `app.css` — base, Blazor loading spinner, global resets
2. `layout.css` — structural layout, sidebar, section scaffolding
3. `styles.css` — component styles, overrides

`index.html` references updated: remove three `<link>` tags, add one `<link href="css/site.css" rel="stylesheet" />`.

### 2d. Image Audit

All 5 cover JPGs are 32–68 KB each. No compression needed.

---

## 3. Projects & Content

### 3a. Add Darkest Dungeon: The Fire's Edge

New entry in `ShippedTitles` in `ProjectSection.razor`:

```csharp
new("Darkest Dungeon: The Fire's Edge", "2026", "DLC · Gameplay Programmer",
    "images/fires-edge-placeholder.jpg",
    "A major DLC for the gothic roguelike Darkest Dungeon. Implemented the full DLC on the code side for PC.",
    "Gameplay programmer · PC",
    new[]
    {
        new ProjectLink("Steam", "https://store.steampowered.com/app/4964110/Darkest_Dungeon_The_Fires_Edge/"),
    }),
```

**Image:** `images/fires-edge-placeholder.jpg` — use the existing `images/darkest-dungeon.jpg` as a temporary copy until a real cover is available.

### 3b. Reorder Filmstrip

Sorted by most recent work (most recent first). Year on card = game's original release year.

| Position | Title | Card Year | Worked |
|----------|-------|-----------|--------|
| 1 | Darkest Dungeon: The Fire's Edge | 2026 | May 2026 – present |
| 2 | Phantom Fury | 2024 | 2024 |
| 3 | MOTHERGUNSHIP: FORGE | 2023 | Sep 2025 – Mar 2026 |
| 4 | The Last Oricru | 2022 | 2022 |
| 5 | Beat Saber | 2018 | Live ops |
| 6 | Darkest Dungeon | 2016 | 2016 |

### 3c. Fix Hero Stat

`AboutSection.razor`: update `4<span class="unit">titles</span>` → `6<span class="unit">titles</span>`.

The strip-controls count `@ShippedTitles.Length titles · scroll →` is already dynamic and updates automatically.

---

## Out of Scope

- Font subsetting / self-hosting Google Fonts
- Replacing Bootstrap CSS utilities with custom code
- WebP image conversion
- New portfolio sections

---

## Files Changed Summary

| File | Change |
|------|--------|
| `Portfolio.csproj` | Remove `System.Text.Json` package reference |
| `Components/AnchorNavigation.razor` | Fix `object sender` → `object? sender` |
| `wwwroot/index.html` | FA JS→CSS links, remove Bootstrap JS, consolidate CSS refs |
| `wwwroot/css/site.css` | New — merged from app.css + layout.css + styles.css |
| `wwwroot/css/app.css` | Deleted (merged into site.css) |
| `wwwroot/css/layout.css` | Deleted (merged into site.css) |
| `wwwroot/css/styles.css` | Deleted (merged into site.css) |
| `wwwroot/js/fontawesome.min.js` | Deleted |
| `wwwroot/images/fires-edge-placeholder.jpg` | New (copy of darkest-dungeon.jpg) |
| `Components/ProjectSection.razor` | New entry + reorder ShippedTitles |
| `Components/AboutSection.razor` | Hero stat 4 → 6 |
