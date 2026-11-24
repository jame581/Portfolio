# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site (single long page + a `/fetchgithubdata` sub-page) built as a **.NET 11 Blazor WebAssembly client-side** app. Deployed as a static site to GitHub Pages at `janmesarc.online`.

There are **no tests** in this repo — no test project, no test framework wired up. Don't claim "tests pass" as verification; use `dotnet build` and manual browser testing instead. The build is warning-free, so any new warning came from your change.

## Deployment

The `<base href="/" />` in `wwwroot/index.html` is correct for the custom domain — do **not** change it to `/Portfolio/` (the commented-out `sed` step in the workflow is for the project-pages URL, which isn't used).

## Architecture

**Sidebar nav with scroll-spy.** Section IDs live in a single `private static readonly Sections` record array inside `Shared/NavMenu.razor`; the matching `<section id="…">` attributes are on the section components in `Portfolio/Components/`. Keep both in sync, and keep the order in `Pages/Index.razor` matching (Projects deliberately precedes Experience).

**JS interop.** When adding new scroll-driven behavior, prefer extending `wwwroot/js/scripts.js` over adding a new JS file (it's loaded directly from `index.html`, no bundler).

**Styling: v3 design (Claude Design handoff).** Tokens (`--bg`, `--fg`, `--dim`, `--sig`, `--line`, `--mono`, `--disp`, `--pad` …) are on `:root` in `wwwroot/css/site.css`. Rules there are one per line in the same order as the design's `portfolio-v3.css`, so the two can be diffed; keep that layout. No Bootstrap and no icon font: the social icons are inline SVGs in `NavMenu.razor` (FontAwesome is still vendored in `wwwroot/css/fontawesome/` but not linked). Don't use `--mut` for text (fails AA contrast). Copy rules from the design: no em dashes or `·` separators (date ranges use `→`), first person. The build/version line uses `BuildInfo.BuildDate` (`yy.MM.dd`).

**Social preview card.** `og:image` is `wwwroot/assets/og-card.jpg`, rendered from `tools/og-card/og-card.html` by `tools/og-card/render.ps1` (headless Edge + Pillow). Its copy duplicates the hero (headline, shipped-titles count), so re-render it when those change; don't hand-edit the JPEG.

**Analytics.** A Google Analytics tag (`G-9D0H04KM1Y`) is hardcoded in `wwwroot/index.html`. Don't strip it inadvertently when editing the head.

**Layout gotchas.** `.app` is `252px minmax(0,1fr)` (216px ≤1100px, single track ≤900px); the `minmax(0,…)` is what stops the filmstrip (`.strip-wrap` bleeds right by `-var(--pad)`) from widening the grid. On desktop the sidebar is a flex column whose `.sb-drawer` is the scrolling region (`min-height:0; overflow-y:auto`) with `.sb-foot` pinned by `margin-top:auto`; at ≤900px `.sb-drawer` becomes the hamburger drawer (`.open`, toggled from `NavMenu.razor`). `body::before`/`::after` are fixed background/grain layers, so page content must sit in positioned ancestors (`main` is `position:relative`) or the gradient paints over it. Blazor trims whitespace next to `@if`/`@foreach`, so put needed spaces inside C# strings (see `ExperienceSection.razor`).
