# Element Targeting Strategy

- Primary selector: `data-elementid` attributes seeded in demo components to ensure stable linkage.
- Secondary selector: `payload.options.selector` enables CSS targeting for dynamic nodes.
- Retry loop: 5 attempts × 100 ms; exposes `TargetResolutionWarning` if unresolved so the overlay UI can suggest remediation.
- Lifecycle management: `MutationObserver` cleans overlays and removes event listeners when host nodes unmount.
- Reattachment logic replays overlay configuration when elements reappear to maintain AI button continuity.
