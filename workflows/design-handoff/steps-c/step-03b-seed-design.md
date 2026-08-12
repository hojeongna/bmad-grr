---
name: step-03b-seed-design
description: 'Harvest SEED (daangn) design norms via the seed-docs MCP — measurable rules only, never component selection — and write them into the UX/UI Guide as the layer that fills whatever a design system leaves tacit'
nextStepBrownfield: './step-04-brownfield-prep.md'
nextStepMobbin: './step-05-mobbin-research.md'
uxGuidePath: '{ux_guide_path}'
---

# Step 3b — SEED Norm Harvest

## Outcome

`seed_norms` is resolved: a detailed, near-verbatim set of SEED's measurable design rules — spacing scales, radius scales, grid/gutter/max-width numbers, motion durations and easing curves, state definitions, loading-duration thresholds, and the Korean UX-writing Do/Don't tables — written into Section 4a of `{uxGuidePath}`. These sit under whatever design system governs the output, never in place of it.

## Why this step exists

A design system says what components exist and what the palette is. It almost never says *how far apart two buttons sit*, *how long a sheet takes to open*, *at what loading duration a spinner should become a skeleton*, or *whether error copy is allowed to say "불가능합니다"*. Those rules exist in every team's head and nowhere in their docs — that's the tacit gap. SEED has written them all down, with numbers. This step borrows that layer.

This is also why SEED survived the removal of the old "describe your local design system" interview: that step was restating something Claude Design can read for itself, whereas this one supplies what neither side has written down.

**Scope discipline — the thing that makes or breaks this step:** harvest *rules*, not *component choices*. "버튼과 버튼 사이는 `$dimension.x2` (8px)" is in scope. "액션에는 Action Button 컴포넌트를 쓰세요" is out of scope — the project has its own components and this workflow must not smuggle in a component library swap. When a SEED component doc is worth reading at all, take only its measurable parts (dimensions, state coverage, ordering, copy constraints) and leave its component identity behind.

## Approach

### Confirm the seed-docs MCP is available

Use ToolSearch with a query like `"seed"` to discover the actual tool names before calling anything. Expect `discover_seed_docs`, `list_docs`, `get_doc`, `get_full_docs`, `get_rootage`, `list_icons`, `search_icons`, `get_icon_details`.

If nothing turns up, halt and tell the user plainly, in `{communication_language}`, that SEED mode needs the MCP connected — don't silently fall back to WebFetch or to your own recollection of SEED. A remembered design system is exactly the kind of confident-but-stale input this workflow exists to avoid.

```
SEED 모드는 seed-docs MCP가 필요해요. 아직 연결이 안 되어 있어요.

  claude mcp add seed-docs -- npx -y @seed-design/docs-mcp

연결 후 다시 실행해 주세요. (인증·토큰 불필요, 공개 문서만 읽습니다)
```

### Known gotcha — the section enum is behind the live site

`list_docs` / `get_doc` accept only `react | docs | breeze | ai-integration | lynx`. The SEED site has since moved every foundation, component, and pattern doc out to `foundations` / `components` / `patterns`, which aren't in that enum — so `list_docs({ section: "docs" })` now returns migration guides and nothing else. Don't conclude from that that the norms are gone.

Reach them by relative path off the `docs` base, which the URL normalizes:

```
get_doc({ section: "docs", path: "../foundations/spacing" })
get_doc({ section: "docs", path: "../patterns/loading" })
get_doc({ section: "docs", path: "../components/action-button" })
```

Don't trust `discover_seed_docs` to settle this. It advertises `docs` as having `components` / `foundation` / `guidelines` categories; `list_docs({ section: "docs" })` against the same server returns two migration documents and nothing else. The discovery response describes the config, not the site. Treat the relative-path form above as the working route until `list_docs` itself starts returning foundation documents.

### Probe the route before harvesting

A missing document does surface as a real error — `get_doc` sets `isError` and the text reads `Error fetching document '<path>' … 404 Not Found`. Detection isn't the problem. The problem is what happens next: one failure among fifteen calls is easy to step over, and a harvest that ends with fourteen documents and no note is indistinguishable downstream from a harvest that found everything.

The relative-path route works because the site currently keeps the norms at `/llms/foundations/…`. That's the arrangement that already changed once — it's what broke the enum in the first place — so treat it as observed behavior, not a guarantee.

Fetch `../foundations/spacing` first as the canary, before spending the other calls:

- **Canary 404s** → the route itself is gone, and the rest of the manifest will 404 too. Halt. Don't fall back to WebFetch, and don't harvest from memory. Tell the user the SEED docs moved again and that step-03b needs its paths re-derived against `https://seed-design.io/llms.txt`, which lists the current section entry points.
- **Canary resolves, some later docs 404** → those individual documents moved or were retired. Keep going with what resolved and carry each failure forward as a named miss, reported in the confirmation block below.
- `get_rootage` fails the same way; treat it identically.

Never let a miss become an omission the user can't see. Downstream, a norm that wasn't fetched looks exactly like a norm SEED doesn't have.

### Harvest manifest

Pull all of these. They're small, they're the whole point of the step, and picking a subset up front is how the tacit gap survives.

| Doc | What to take from it |
| --- | --- |
| `../foundations/spacing` | The full token table (`$dimension.x0_5`…) with px values, plus the named spacings — `global-gutter`, `component-default`, `nav-to-title` — and what each governs |
| `../foundations/radius` | The full radius token table with px values |
| `../foundations/layout` | Dashboard vs Contents layout, the density table (column count / gutter / margin / max-width), breakpoint and responsive behavior |
| `../foundations/typography` | Type scale, weights, line-heights, and which role goes where |
| `../foundations/color` + `../foundations/color/color-role` | The Property × Role × Variant × Status taxonomy and what each role (brand / neutral / positive / warning / critical / informative) is *for*. **Stop before the `## Tokens` section** — its three tables are ~71 rows mapping roles onto SEED's own palette (`carrot-600`, `gray-1000`). That's daangn's brand color, not a norm; injecting it repaints the product |
| `../foundations/state` | The state taxonomy (enabled / pressed / selected / disabled / focused) and which states must coexist vs override |
| `../foundations/motion` | Micro vs macro threshold (0.2s), the timing-function curves, the duration token table |
| `../foundations/elevation` | The global/local stacking model and what belongs at each level. The levels are labelled with SEED component names (Bottom Sheet → L2, Alert Dialog → L3) — carry the *role* ("모달 시트", "확인 다이얼로그"), not the component name |
| `../foundations/iconography/usage` | Icon sizing and icon-to-text interaction rules |
| `../foundations/inclusive-design` | Accessibility floor stated as rules |
| `../foundations/international-design` | **Conditional.** Its bulk is ~107 rows of ko/en/ja formatting tables (상대적 시간, 날짜, 숫자, 통화). Pull those only when the product actually ships more than one locale. Single-locale product → take just the text-expansion ratios, which matter for layout regardless |
| `../foundations/writing` | **Every Do/Don't table, verbatim** — familiar wording, honorifics, numerals, abbreviations, function naming, positive sentences, active sentences |
| `../foundations/voice-and-tone` | The principles and the voice/tone matrix |
| `../patterns/loading` | The duration thresholds per indicator (progress circle / bar / skeleton) and when each applies |
| `get_rootage()` then `get_rootage({ path })` | Index first, then the token collections behind the numbers above. Also pull `/components/<name>.json` **only** for components that map to something on the screens in scope |

Component docs (`../components/<name>`) are opt-in, not part of the sweep: read one only when a screen in scope has that exact element, and take only its measurable guidelines.

**Drop every `<Image src=…>` line and every `figma-alpha-api…` URL.** They're ~10KB across the manifest and carry nothing into a text prompt.

**Volume check.** The manifest fetches ~105KB raw. Dropping images, the palette tables, and the locale tables mechanically takes it to ~75KB — still mostly rationale prose, because the rule density varies enormously per document. `writing` is ~8.5KB of almost pure Do/Don't tables and should survive nearly whole. `patterns/loading` is ~13KB carrying about one table's worth of actual thresholds, and `elevation` ~10KB carrying a four-level model; both should come out an order of magnitude smaller. Four documents (`state`, `voice-and-tone`, `inclusive-design`, `iconography/usage`) have no tables at all, so their rules must be *extracted* into rule form rather than copied.

Landing around 20–25KB means every rule survived and the prose didn't. That is still the most detailed section this workflow produces — the reduction comes entirely from dropping non-rules, never from compressing a rule. If the block lands near 75KB, the filter didn't run.

### Filter — what survives into `seed_norms`

Keep a rule if it is checkable against a rendered screen: a number, a threshold, a scale, a state that must exist, an ordering, or a copy pattern with a stated wrong version. Drop it if it is a component recommendation, a Karrot-brand-specific voice line that would read as impersonation in another product, marketing prose, or a rationale paragraph with no rule in it.

Preserve the Do/Don't tables as tables. They are the highest-value artifact in the whole harvest — a downstream builder can apply "✅ 대화할 수 없어요 / ❌ 대화가 불가능합니다" directly, and can do nothing at all with "친근한 톤으로 쓰세요."

Do not summarize aggressively. This is deliberately the most verbose section the workflow produces; the user asked for the rules to arrive nearly whole, and a compressed rule is a rule that gets skipped.

### Don't reconcile — hand the reconciliation downstream

There is nothing here to compare against. Step-03 resolves which Claude Design project the work targets; it never reads that project's design system, and neither does this step. Whatever design system ends up governing the output is visible only to the tool that reads it.

So don't tag norms as agreeing or conflicting with something you can't see, and don't build a conflict table out of guesses. State the precedence instead and let the reader — Claude Design, or whoever edits the scaffold — resolve it against the system actually in front of them:

**The project's own design system > SEED norms > model judgment.** Where a norm contradicts something the design system already fixes, the design system wins and the override gets named rather than silently applied.

That instruction is carried wherever these norms render, and it's the whole reconciliation. A rule that turns out to be redundant with the project's system costs a line; a conflict invented here from an unread system costs a wrong build.

### Present and confirm

```
🌱 SEED 규범 수집 완료

파운데이션: {n}/{total}개 문서 · 라이팅 규칙: {n}개 표 · 토큰: rootage v{version}

못 가져온 문서:
- {path} — 문서가 옮겨졌거나 없어졌어요. 이 영역 규범은 비어 있어요.
- ...

프로젝트 디자인 시스템과 겹치는 부분은 그쪽이 우선이에요 — 실제 대조는
클로드 디자인(또는 스캐폴드를 고치는 쪽)이 자기 시스템을 보면서 합니다.

[Y] 이대로 진행   [M] 일부 빼거나 더 담기   [V] 수집된 규범 전문 보기
```

Halt for input. On `V`, show the harvested block in full before re-asking. On `M`, take the adjustment and re-present.

Drop the "못 가져온 문서" block entirely when nothing missed — but never drop it to keep the summary tidy when something did. Say `{n}/{total}` even on a clean run, so a later partial run reads as visibly different rather than merely smaller.

### Write into the UX/UI Guide document

Fill the SEED subsection of Section 4 in `{uxGuidePath}` with the harvested norms at full detail, any named misses, and the precedence statement. Set `seed_design_mode: true` and `updated: {date}` in the frontmatter.

## Next

If `has_existing_screen` → load and follow `{nextStepBrownfield}`.
Otherwise → load and follow `{nextStepMobbin}`.
