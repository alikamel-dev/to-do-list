# Tasks

Tasks to be completed by me, divided into categories listed from the most important.

> [!NOTE]
> Pull requests implementing the tasks in this document will be rejected. If you wish to contribute, you can try to resolve one or more of the [issues](https://alikamel-dev.github.io/to-do-list/issues) or otherwise make a contribution that you believe will improve the project.

## Accessibility and Semantics

- [ ] Create skip links
- [ ] Create custom tooltips

- [ ] Replace `span` elements used to announce section titles in footer with appropriate section heading elements

## Metadata

- [ ] Add Favicons
- [ ] Add X Card metadata (if needed)
- [ ] Update native, OGP, and X Card description metadata

## Content

- [ ] Add links to more online platforms

## Performance and Cleanup

- [ ] Include SVG icons that need not be inlined as external SVG files
  - [ ] Include SVG icon for brand logo as external SVG file if it is intended to have the same color

- [ ] Remove unused fonts
- [ ] Replace variable font files with static font files if a only subset of the variable font features is needed

## Appearance

### Theme

- [ ] Implement light/dark theme switching functionality (You will need to dynamically set the values of `#theme-toggle[aria-label]` and `#theme-toggle use[href]`)

## Syntax

- [ ] TODO: Use `attr(data-original-color)` instead of `var(--original-color, var(--brand-color))` when browser support is suitable.
