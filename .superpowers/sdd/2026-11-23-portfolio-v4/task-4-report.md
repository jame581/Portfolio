# Task 4 Report

## Summary

Replaced the professional-project filmstrip with a split project explorer. A compact accessible tab list now controls a dominant selected-project panel, with project selection state kept entirely in Blazor and keyboard focus moved between selector options.

## Implementation

- Added `_selectedProjectIndex`, `SelectedProject`, `SelectProject`, and `HandleProjectKey` in `ProjectSection.razor`.
- Rendered a vertical project selector and a selected-project artwork/details panel.
- Added a visible `01 / 06` through `06 / 06` position label.
- Added clamped ArrowUp, ArrowLeft, ArrowDown, ArrowRight, Home, and End navigation.
- Preserved `ShippedTitles`, `ItchEntries`, project image data, descriptions, metadata, and all external project anchors.
- Preserved normal external `<a>` behavior with `target="_blank"` and `rel="noopener"`.
- Removed the unused filmstrip markup and scroll function.
- Added focused JS helpers to prevent page scrolling for handled project keys and move focus to the selected tab.
- Replaced filmstrip CSS with split-explorer, focus-visible, stacked-mobile, and metadata-wrapping styles.

## Global Constraints

- Did not modify `ShippedTitles`, `ItchEntries`, project data, or project external URLs.
- Did not change the Google Analytics configuration or the custom-domain `<base href="/" />`.
- Did not change navigation section IDs or the overall page/section ordering.
- Did not add dependencies or test projects.
- No push was performed.

## Validation

- Ran the exact build command: `dotnet build Portfolio/Portfolio.csproj --nologo`.
- Result: build succeeded with 0 warnings and 0 errors.
- Reviewed the implementation diff and confirmed the old filmstrip selectors and `PortfolioScrollStrip` function are removed.
- Browser automation/manual visual testing was not available in this session, so desktop and mobile rendering should receive a manual check.

## Self-Review

- Selection is initialized to the first project and clamped to the valid project range.
- Selected state, tab ARIA attributes, panel labeling, and roving tabindex remain synchronized.
- Keyboard navigation has predictable clamping behavior at the first and last projects.
- Normal Tab navigation is not prevented; only handled project navigation keys are prevented from scrolling.
- The mobile breakpoint stacks the selector above the artwork/details panel and removes horizontal filmstrip overflow.
- Project links remain direct anchors and retain external-link behavior.

## Fix round 1

- **Implementation change:** Added `aria-orientation="vertical"` to the `role="tablist"` project-selector container in `Portfolio/Components/ProjectSection.razor`.
- **Covering build:** `dotnet build Portfolio/Portfolio.csproj --nologo`
- **Result:** 0 warnings, 0 errors.
- **Commit:** `23056dc7f25639d639e021956106ea0c3dd426f7`
