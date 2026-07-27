---
title: 'Live Capture Protocol'
type: 'capture-discipline'
purpose: 'The rules that make a running app extractable into a spec comparable with a static mockup — timing, noise, data volume, roles, states, and interaction tracing'
---

# Live Capture Protocol

A static mockup holds still. A running app does not: it hydrates, fetches, animates, lazy-loads, renders whatever data happens to be in the database, and carries dev tooling the mockup never had. Extracting it the same way you'd extract a mockup produces a diff dominated by artifacts of those differences — and a report full of artifacts trains the user to stop reading reports.

These rules are what earn the right to compare the two. Apply every one; note explicitly when a rule couldn't be applied rather than skipping it silently.

## 1. Never extract before the page is ready

A fixed sleep is wrong in both directions — it clips a slow hydration (producing phantom "element missing" findings) and wastes time on a fast one. Gate on real signals:

```
await window.__grrSpec.ready()
```

It returns a report. Act on it:

- `fontsReady: false` → the font stack never resolved. **Stop.** Every typography row is now measuring a fallback, and the whole S3 comparison is invalid.
- `fallbackFonts: [...]` non-empty → those families are rendering as fallbacks. Record them in the spec's meta and say so in the report; a family that didn't load makes the implementation look wrong when it isn't.
- `quiet: false` → the DOM never stopped mutating within the timeout. Usually a polling widget, a live clock, or an animation loop. Identify it, add it to `noiseSelectors`, and re-run — don't extract over a moving target.

Re-inject the script after every navigation and after every reload. `window.__grrSpec` does not survive a page load.

## 2. Sweep before extracting

```
await window.__grrSpec.sweep()
```

Lazy images, `IntersectionObserver` reveals, infinite scroll, and virtualized lists mean the initial viewport contains a fraction of the page. A mockup has everything in the DOM at once; an un-swept live extraction will report most of the page as missing.

Virtualized lists are the one case sweep can't fully solve — rows are destroyed as they leave the viewport, so no single snapshot holds them all. Extract the row *template* and the total count from the app's own indicator, and record `virtualized: true` in meta. Don't report the count difference as a finding.

## 3. Exclude noise, don't classify it

Things that exist in a running app and never in a mockup, and are not findings at any severity:

- Framework dev overlays (Next.js build watcher and error dialogs, Vite/React-refresh overlays, webpack-dev-server badges)
- Query/state devtools panels, in-house debug toolbars, performance HUDs
- Cookie/consent banners, A/B-test wrappers, chat widgets, session-recording pixels
- Browser-extension injected DOM

The script excludes the common framework ones by default. **Everything app-specific must be passed in explicitly:**

```
await window.__grrSpec.extract({ noiseSelectors: ['#cookie-banner', '.intercom-lightweight-app'] })
```

Identify them once, up front, by looking at the page — not by discovering them later as mysterious `[ADDED]` items. List what was excluded in the report. Silent exclusion and silent inclusion are both wrong; the user needs to see the filter that was applied.

## 4. Normalize data volume, not data content

The mockup shows 3 placeholder rows; the app shows 47 real ones. That is not a fidelity finding, and `47 ≠ 3` must never reach the report.

`collapseRepeats` (on by default) collapses runs of structurally identical siblings to one template entry plus a count. Compare **templates**, not instances. What matters:

- Does the row template have the same columns, controls, and treatment? → real comparison
- Are there 47 vs 3 of them? → not a finding
- Does the app render a row variant the mockup never showed (a "pending" state row)? → real finding, `[ADDED]` direction

Same logic for text: placeholder copy (`Lorem ipsum`, `홍길동`, `example@`) versus real data is not an S4 mismatch. Only compare strings the mockup **fixed** — headings, labels, button text, error messages, empty-state copy. Record obviously-sample content as `sample: true` and exclude it from S4 comparison.

## 5. Capture the permission level the mockup was drawn for

A full-access account makes role-gated differences invisible, and a restricted one makes half the screen look missing. Before extracting, establish which role the mockup depicts and capture as that role.

If the app has visibly different views per role (an admin console, a "view as" switcher, a restricted item), capture the screens where that matters at more than one permission level and say which level each spec came from. A single-permission pass is a known blind spot — the same one `design-handoff` step-04b:35 already calls out — and it must not stand as the final word on anything permission-sensitive.

Record the role in spec meta. A spec without a stated role is not comparable to anything.

## 6. Reaching states (S6)

The mockup draws empty / loading / error as static markup. The live app has to be driven into them.

**The one inviolable rule: never inject a state.** Editing the DOM or flipping a class to "see what it would look like" produces a state the implementation does not actually have. That's fabrication, and it's the one error a fidelity report can't recover from. Everything below drives the app's own code down its own branches; none of it writes markup.

### empty / success

- **empty** — a filter or search that genuinely returns nothing; a fresh account.
- **success** — a real, non-destructive action that completes.

### loading / error — intercept at the request layer

claude-in-chrome exposes no network throttling or request blocking, but `javascript_tool` runs arbitrary page-context script, and patching `fetch` / `XMLHttpRequest` puts the app down its own loading and error paths. The rendered result comes from the app's own branch — its own `role="status"` spinner, its own error copy — so this is driving the app, not faking it.

**loading** — hold the response open, then sample while the branch is live:

```js
const orig = window.fetch;
window.fetch = async (...a) => { const r = await orig(...a); await new Promise(s => setTimeout(s, 2000)); return r; };
// trigger the action, wait ~300ms, extract
```

Hold it deliberately long. Racing a fast response to catch the spinner is how you sample the wrong frame and record a loading state that doesn't match what users see.

**error** — return a failure, or throw the one a dead network throws:

```js
window.fetch = async () => new Response('{}', { status: 500 });      // server error branch
window.fetch = async () => { throw new TypeError('Failed to fetch'); }; // network failure branch
```

**Always restore** `window.fetch = orig` when done, or reload. A patch left in place silently corrupts every later trace on that tab.

Validation errors need none of this — feed the form an invalid value and let the app validate.

### What this genuinely cannot reach

Record these as `not reached: {reason}`, never as untested-but-fine, and never as a finding against the implementation:

- **Initial-page-load loading states.** The request fires before any patch can land — there's no `initScript` equivalent on this path. A skeleton screen that only appears on first paint is out of reach.
- **Apps that captured `fetch` at module scope** (`const f = window.fetch` at import time). The patch misses them. Detect it: if the patch produces no visible change, this is why — say so rather than concluding the state doesn't exist.
- **Resource-level slowness** — images, fonts, CSS. Only JS-initiated requests are interceptable.
- **Service-worker-mediated requests**, which may bypass a page-context patch entirely.

`not reached: {why}` is a valid, expected answer. An unreachable state is itself worth knowing — often it means the state doesn't exist.

## 7. Interaction tracing (S5)

Drive from `window.__grrSpec.interactives()`, which returns the target list with a `destructive` flag already computed.

```
const before = __grrSpec.fingerprint()
target.click()
await __grrSpec.settle()
const after  = __grrSpec.fingerprint()
// appeared = after \ before ; vanished = before \ after
```

Set differences over the fingerprint projection — never two full DOM dumps. A delta is 10–30 lines; a DOM dump is thousands, and diffing two of them across a mockup/implementation boundary is noise by construction.

**Rules, all mandatory:**

- **Skip everything flagged `destructive`.** Don't click it to find out what it does. Record its name and what it appears it will do. A prior `design-handoff` run left permanent state changes exactly this way. The regex is a first line of defense, not a complete one — read the label yourself before clicking anything ambiguous.
- **Prefer a throwaway account or a non-production environment.** On a real app, non-destructive-looking controls still mutate state: a persisted filter, "mark as read", a draft autosave, an analytics event. If neither is available, say which traces were skipped for that reason instead of running them anyway.
- **Reset by reloading, not by closing.** Close-the-modal leaves residue (scroll position, a toast still fading, a fetch in flight) and the next trace measures the wrong delta. Reload, re-inject, `ready()`, then trace the next target. It costs one page load per trace and it's worth it.
- **Wait for async outcomes.** A live click often starts a fetch. `settle()` returns when mutations stop, which may be before the response lands. For anything that triggers a request, settle again after the network goes idle, and record both the immediate delta and the settled one when they differ — an implementation that flashes a spinner and then renders is behaving correctly even though the mockup showed only the end state.

Live outcomes are richer than a mockup's. Record the specific one: `modal-open`, `drawer-open`, `expand`, `navigate(route)`, `state-change`, `toast`, `validation-error`, `async-load`, `optimistic-then-settle`, `none`, `not-reachable(why)`.

## 8. Responsive (S7) — and why it can't be parallelized

Re-run `ready()` → `sweep()` → `extract()` at 375 / 768 / 1440. Do not resize and re-extract without re-running the gate: a resize retriggers media queries, re-lays out, and often refetches.

**`resize_window` resizes the window, and every tab `tabs_create_mcp` made shares one.** Resizing for one screen changes the viewport under every other tab in the group. So S1–S6 fan out in parallel across per-screen tabs, and then S7 walks screens **one at a time**. A parallel S7 pass silently records each screen at whatever width some other agent last set, and the resulting breakpoint findings are fiction.

Record only what changes from the 1440 baseline. Overflow, clipped text, and touch targets under 44px are recorded on both sides — a mockup that breaks at 375px is a mockup defect, not something to hold the implementation to.

## 9. Meta that must be in every live spec

Without these, the spec is not comparable and the diff can't be trusted:

| Field | Why |
|---|---|
| `role` | Which permission level this was captured as |
| `dataProfile` | `seeded` / `real` / `empty` — what was in the list |
| `noiseSelectors` | Exactly what was filtered out |
| `fallbackFonts` | Families that didn't load, if any |
| `virtualized` | Whether any list destroys off-screen rows |
| `readyReport` | The `ready()` return value verbatim |
| `sweepPasses` | How far the sweep got |
| `env` | dev / staging / prod, and whether it's a throwaway account |

## 10. Map findings back to source while the page is still open

Finding the file is part of capture, not a later exercise — the DOM is right there and it stops being available once you've moved on. In order of reliability:

1. `data-testid` / `data-component` attributes → grep the repo for the literal value.
2. React/Vue devtools component name via CDP, when the MCP exposes it.
3. CSS-module class hashes (`Button_primary__x7f2q`) → the prefix is the source filename.
4. Source maps for the stylesheet rule that set the offending value — this is the reliable path for a token drift, since it names the declaration rather than the consumer.
5. Verbatim copy string → grep. Works well for S4 findings and locale files.

A finding whose file couldn't be identified does **not** get routed to "fix now". Route it to `quick-story` and say the file is unidentified — editing something that looks close is worse than deferring.
