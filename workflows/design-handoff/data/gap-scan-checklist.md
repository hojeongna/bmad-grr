# UX/UI Gap-Scan Checklist (reference hints, not a form to fill in)

A PRD is written by product thinking, not screen thinking — it almost always leaves some of these unresolved. Use this as a prompt for judgment while reading the actual PRD; don't walk it mechanically, and don't flag a dimension just because it's on this list if the PRD genuinely covers it.

- **Screen inventory** — does the PRD name every screen/view the described flows imply, or only the ones central to the pitch? Missing settings/empty-account/error/confirmation screens are the most common gap.
- **IA / navigation model** — how do screens connect? Tab bar, drawer, stack, modal? If the PRD describes features but never how a user moves between them, that's a gap.
- **States per interaction** — for every action the PRD describes, does it say what empty/loading/error/success looks like? Silence here is the single most common source of AI-slop in a generated draft.
- **Responsive / platform target** — does the PRD say mobile, web, desktop, or all three, and how layout should adapt? Unstated usually means "whatever the generator defaults to."
- **Accessibility** — contrast, keyboard reachability, screen-reader labels, touch-target size. PRDs almost never mention this; that's still worth flagging, not skipping.
- **Microcopy specificity** — are button labels, error strings, empty-state guidance given verbatim, or left to be invented? Generic filler ("문제가 발생했습니다") is a signal the PRD didn't specify.
- **Design-system anchoring** — does the PRD reference an existing visual language, or is this greenfield with no anchor at all? Different downstream instruction either way.
- **Data variability / edge content** — long strings, empty lists, very large numbers, RTL, locale formatting — does the PRD's screen descriptions hold up under real data, or only the happy-path example?
- **Permissions / auth states** — logged-out, no-permission, expired-session views — implied by the feature but not necessarily written down.

For each real gap found, capture: the dimension, the PRD location it's missing from (or "not addressed anywhere"), and a one-line default assumption reasonable enough to let the workflow proceed without blocking.
