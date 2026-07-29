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
- `visibility: "hidden"` / `hasFocus: false` / `rafFired: false` → **expected, not a problem.** A tab driven by an agent is backgrounded, so `requestAnimationFrame` never fires. The gate falls through on a timer instead of hanging, which is the whole reason those three fields are reported. What it *does* mean: anything that only runs on a frame callback may not have run, and `:focus-visible` cannot be observed live — the pseudo-state axis reads the rules out of the stylesheets rather than trying to trigger them.

Re-inject the script after every navigation and after every reload. `window.__grrSpec` does not survive a page load. Never put a reload and an extraction in the same `javascript_tool` call — the evaluation context dies mid-call and the tool returns "Inspected target navigated or closed".

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

## 5.1 Assert the app's own view state before extracting anything

A route is not a screen. Modern apps persist view state — a table/card toggle, a density or
font-size step, a collapsed sidebar, an expanded row, a saved filter — in `localStorage`, and it
survives reloads, new tabs, and the responsive iframes.

This is not hypothetical. A mockup drawn for a table view was compared against a route that, on
a later day, was sitting in card view; a run that didn't check would have diffed a table spec
against a card screen and reported the entire screen as missing. A separate capture recorded a
cell font at step 2/5 (12px) when the product default is 3/5 (13px), which turned a 1px
difference into a 2px one and nearly promoted it to a real finding.

Before the first extraction, for each screen:

1. **Read the toggles.** `[role=radio]`, `[role=tab]`, `aria-checked` / `aria-selected` /
   `aria-expanded`, and anything in `localStorage` whose key names a view or a preference.
2. **Say which state the mockup depicts** and set the app to it — through the app's own
   controls, never by writing to `localStorage` behind its back.
3. **Record the asserted state in spec meta**, and re-assert it inside `responsive()`'s
   `prepare` callback, since each iframe is a fresh app instance reading the same storage.
4. If the state can't be reached (the toggle needs data that isn't there), **halt that screen**
   and say so. A diff of two different views is not a partial result; it is a wrong one.

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

## 8. Responsive (S7) — iframes, not window resizing

```
await window.__grrSpec.responsive([375, 768, 1440], { noiseSelectors, prepare })
```

**Never use `resize_window` for this.** Verified: it returns `"Successfully resized window ... to
1024x800 pixels"` and then `innerWidth` is still 1920. Asked again for 700x600, same success
string, same 1920. A maximized window silently ignores it, and nothing in the return value says
so — which is why S7 was reported as "미측정" on runs that believed they had measured it.

`responsive()` loads the same URL into a same-origin iframe at each width. Verified on a real
authenticated production route: `innerWidth` is exactly the requested width, media queries
evaluate against **the iframe's** viewport (`(max-width:768px)` true at 375, false at 1440),
computed styles flip accordingly, geometry measures inside it, and the parent window is
untouched at 1920.

Three consequences:

- **S7 parallelizes now.** The old rule — fan out S1–S6, then walk S7 one screen at a time —
  existed only because `resize_window` hit the shared window. It doesn't apply; drop it.
- **Capture both sides through iframes at the same fixed width.** Then the viewport is identical
  by construction instead of by luck, and `@doc viewport` stops appearing in every diff.
- **The iframe inherits cookies, session and `localStorage` from the parent origin.** That is
  what makes an authenticated route reachable. It also means every persisted UI preference comes
  along — see §5.1. Assert that state via `opts.prepare(win, doc)`; never assume it.

The iframe is positioned on-screen and on top on purpose. An off-screen iframe suppresses
`IntersectionObserver` in Chrome, so lazy content never loads and a narrow viewport reads as
half-empty. The capture tab is dedicated to this, so covering it briefly costs nothing.

**When framing is refused** — `X-Frame-Options` or `CSP frame-ancestors` — `responsive()` returns
`{ width, error }` for that width instead of a spec. Record S7 as `not measurable: framing
refused`. Do not substitute a window resize; it will report success and measure nothing.

Record only what changes from the 1440 baseline. Overflow, clipped text, and touch targets under
44px are recorded on both sides — a mockup that breaks at 375px is a mockup defect, not something
to hold the implementation to.

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

## 9.1 The spec goes to disk, not through the agent

```
await window.__grrSpec.upload('http://localhost:{port}', '{slug}.live.tsv', window.__grrSpec.tsv(spec))
```

A real screen's record dump is on the order of half a megabyte — a production route measured
5,145 records / 8,328 lines / 442 KB. Returning that through a tool result puts every byte into
the agent's context, and an agent holding two of those is back to eyeballing, which is the defect
this workflow was rewritten to remove. `spec-server.py` accepts the POST and writes the file;
`diff` compares two files; only the differences are ever read.

Verified from an https production origin to `http://localhost`: Chrome exempts localhost from
mixed-content blocking and the server sends permissive CORS, so the upload succeeds from the
application's own origin. The server binds to 127.0.0.1 and refuses any name outside
`[A-Za-z0-9._-]`, which is what makes an open CORS policy safe here.

**Never return a page-derived name as an object KEY.** The claude-in-chrome result filter
redacts values under keys that look sensitive: a CSS custom property named `--media-token` comes
back as `"[BLOCKED: Sensitive key]"` while `--brand` passes. Renaming the key doesn't help — the
substring is what triggers it. Array pairs and TSV lines pass through untouched, which is why the
extractor emits `[name, value]` triples everywhere. A design system named `--token-*` would
otherwise vanish from the spec silently, and the report would state a variable count that is
simply false.

## 10. Map findings back to source while the page is still open

Finding the file is part of capture, not a later exercise — the DOM is right there and it stops being available once you've moved on. In order of reliability:

1. `data-testid` / `data-component` attributes → grep the repo for the literal value.
2. React/Vue devtools component name via CDP, when the MCP exposes it.
3. CSS-module class hashes (`Button_primary__x7f2q`) → the prefix is the source filename.
4. Source maps for the stylesheet rule that set the offending value — this is the reliable path for a token drift, since it names the declaration rather than the consumer.
5. Verbatim copy string → grep. Works well for S4 findings and locale files.

A finding whose file couldn't be identified does **not** get routed to "fix now". Route it to `quick-story` and say the file is unidentified — editing something that looks close is worse than deferring.
