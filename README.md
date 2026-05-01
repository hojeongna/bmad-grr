# GRR — Guardrails for Reliable Releases

Workflow collection for BMAD — adds BDD-based ATDD for story implementation, checklist-based code review, systematic debugging, multi-repo monorepo workspaces, PR lifecycle management with re-push, browser-verified QA, and LLM-judgment UI/UX passes.

**v2 highlights**:
- **Outcome-driven**, slim workflow files (Claude Opus 4.7 prompting guidance applied)
- **gstack-free** — no external `gstack/*` skill dependencies
- **9 superpowers skills bundled** (sourced from [obra/superpowers](https://github.com/obra/superpowers))
- **dev-story is BDD-based ATDD** — Gherkin scenarios drive a TDD inner loop
- **set-worktree enforces monorepo style** — workspace root never becomes a git repo
- **pr-create has a re-push branch** — post-edit CI test → fix → push to existing PR

For PRD / Architecture / Epics / Story creation, use **upstream BMAD** workflows directly (`/bmad-create-prd`, `/bmad-create-architecture`, `/bmad-create-epics-and-stories`, `/bmad-create-story`).

## Included Workflows (10)

### 1. `dev-story` — BDD-based ATDD + TDD

Story implementation with a **BDD-based ATDD outer loop** + a **TDD inner loop**.

- **Universal stack** — auto-detects the project's BDD runner (`@cucumber/cucumber`, `playwright-bdd`, `pytest-bdd`, `behave`, `cucumber-jvm`, `godog`, `Reqnroll`, `cucumber-rs`); on no-detection, asks once and persists the choice.
- **ATDD outer loop** — every Acceptance Criterion becomes a Gherkin scenario; the scenario stays red until the implementation makes it green.
- **TDD inner loop** — driven by the bundled `test-driven-development` superpower (RED → GREEN → REFACTOR; Iron Law: no production code without a failing test first).
- **Optional context-isolated TDD** — load `subagent-driven-development` for non-trivial implementations: a test-writer sub-agent writes the tests; an implementer sub-agent writes the production code without ever reading the test source. Prevents test-fitting.
- **Verification gates** — every "tests pass" / "scenario green" claim runs the actual command via `verification-before-completion`.
- **Branch hygiene** — on completion, applies `finishing-a-development-branch` to clean up debug logs, temp files, dead helpers before review.
- **Resume in step-01** — in-progress story detection routes back to the right stage automatically.
- **Dry-run fallback** — if no BDD runner is available, scenarios are still authored; verification falls back to reasoning + unit tests.

### 2. `code-review` — Checklist-driven, parallel per-file

Strict checklist-based code review — no subjective judgment.

- **Checklist supremacy** — must provide a checklist `.md` file; halts otherwise.
- **One file = one sub-agent** for parallel review. Every finding cites a specific checklist item.
- **3 review sources** — story, git diff, manual file list.
- **Priority × Scope** — every finding gets HIGH/MEDIUM/LOW × SMALL/LARGE.
- **Fix scope choice** — `[F]` Full / `[S]` Small / `[H]` High / `[X]` Skip.
- **No-deferral fix policy** — items in selected scope get fixed; "too complex" needs a concrete technical blocker.
- **Auto test detection** — `tsc --noEmit`, build, project test runner; auto-retry up to 3 rounds.
- **Pushback discipline** — `receiving-code-review` is loaded when the user pushes back on findings.
- **Story doc reflection** — code-review changes are written back to the affected story documents.

### 3. `review-checklist` — Generate / validate / edit checklists

Three-mode workflow producing checklists for `code-review`.

- **Combinable modes** — `[A]` project analysis · `[P]` PR review mining · `[I]` interactive Q&A · `[U]` universal best practices · `[S]` security (OWASP/STRIDE inline) · `[R]` structural (SQL safety, race, LLM trust boundary, coupling) · `[Au]` audit (a11y / perf / theming / responsive — auto when `ui-ux-pro-max/audit` is installed).
- **Parallel agents** for automatic modes (one per mode).
- **Direct compatibility** — output is structured for immediate `code-review` use.
- **Three step folders** — `steps-c/` create, `steps-v/` validate, `steps-e/` edit.

### 4. `bug-hunt` — Systematic, escalation-based debugging

For genuinely stuck bugs — when `quick-story → dev-story` isn't enough.

- **Iron Law** — no fix attempts without root cause.
- **Escalation levels** — Level 1 (code analysis) → Level 2 (debug logs + Chrome DevTools MCP) → Level 3 (web search).
- **Architecture review trigger** — 3+ failed hypotheses pivots to architectural pressure-test (step-04b).
- **Debug log lifecycle** — every `[BUG-HUNT]` log is tracked and forcibly removed at wrap-up.
- **Multi-session resume** — state file in `_bmad-output/` enables resume across days.
- **Standalone bug report** — works without a story file; produces a fresh bug report.

### 5. `set-worktree` — Multi-repo monorepo workspace

Set up a monorepo-style workspace with multiple GitHub repos under a single parent folder.

- **Monorepo-only** — workspace root is **never** turned into a git repo. If chosen root already is git, halts and asks for a different folder.
- **Inline safety checks** — clean target folders, no branch collisions, no dirty-tree clobber.
- **Parallel clone** — one sub-agent per repo via `dispatching-parallel-agents`.
- **Branch convention** — `{type}/{YYMMDD}-{description}` (feature / fix / refactor / chore).
- **Mapping document** — `worktree-map.md` for downstream `pr-create`.
- **Sibling skill** — for single-repo branch isolation, use the `using-git-worktrees` skill directly (different shape).

### 6. `pr-create` — PR lifecycle with re-push branch

Manage analyze → split → commit → test → create → track → rebase across multi-repo workspaces.

- **Smart splitting** — large changes (≥1000 lines) split by responsibility, not line count. AI-proposed or manual.
- **Local CI/test before PR** — failures route to `[A]mend` or `[N]ew` commit recovery.
- **Auto/Manual PR creation** — `gh pr create` or copy-paste command.
- **Sequential rebase** — between merged predecessors and queued successors.
- **🆕 Re-push branch (`step-04b-update-pr`)** — when you come back from `refine-story` / `dev-story` with extra edits to an OPEN PR: CI test → fix failures → `[A]mend` or `[N]ew` commit → push to existing branch (no new PR). Two entry points:
  - Auto: detected at step-01 resume when uncommitted/unpushed changes exist on a repo with an OPEN PR.
  - Manual: `[U] Update PR` option in step-05 merge loop.
- **Optional code review request** — after PR creation, `requesting-code-review` is offered for non-trivial PRs.
- **Branch hygiene at completion** — `finishing-a-development-branch` cleans up after merge.
- **Continuable** — state persists across sessions for multi-day merge cycles.

### 7. `refine-story` — Story refinement after dev-story / QA / feedback

Bridge dev-story runs when implementation results differ from expectations.

- **Multi-scope** — single story / multiple stories / entire epic (parallel sub-agent gap analysis for epic mode).
- **Visual verification** (optional) — Chrome DevTools MCP / Playwright MCP browser inspection.
- **Modify vs create** — per-story decision with explicit user checkpoint.
- **Receiving-code-review discipline** — when the situation is QA / reviewer feedback, `receiving-code-review` skill governs handling: verify before agreeing, push back with technical reasoning, no performative agreement.
- **dev-story / design-pass chaining** — `[D]` chain into dev-story, `[U]` design-pass Branch A first for UI stories, `[S]` end.

### 8. `quick-story` — Lightweight pre-dev story from zero

No upstream PRD / architecture / epics required. For fast solo work on a single change.

- **Existing-story detection** — auto-delegates to `refine-story` if a matching story exists in sprint-status.
- **Mini PRD (4 fields)** — Problem / Users / Success / Out-of-scope, single inline Q&A round.
- **Mini Architecture (5 fields)** — Stack / Touchpoints / Patterns / Constraints / Risks.
- **Inline 4-point Architecture Impact** — Scope Challenge / Failure Scenarios / Cross-Story Impact / Test Coverage Gap (no external skill; pressure-test in-place).
- **Inline lightweight Premise Challenge** — Premise / Existing leverage / 10x check / Hidden scope.
- **Fix-specific deepening** — `change_type == 'fix'` loads `systematic-debugging` (4-phase root-cause framework).
- **TDD-aware testing standards** — `test-driven-development` skill informs the testing section.
- **dev-story-compatible output** — chain `[D]` in the same session.

### 9. `design-pass` — LLM-judgment UI/UX pass (two branches)

Two-branch workflow using inline audit checklists + auto-dispatched ui-ux-pro-max skills.

- **Branch A (Pre-dev)** — read full story document, identify UX risks from actual content, enhance with "UX Considerations" section.
- **Branch B (Live-fix)** — audit running screen via Chrome DevTools MCP (screenshots / console / network), produce improvement document with priorities.
- **Branch C** — no story yet → delegate to `quick-story`, return as Branch A.
- **Inline audit framework** (replaces gstack/plan-design-review + gstack/design-review) — visual hierarchy, states (empty/error/loading), AI-slop patterns, accessibility, edge cases, motion/feedback, micro-copy, responsive, token drift.
- **Inline critique scoring** (Visual Hierarchy / Information Architecture / Cognitive Load / Emotional Resonance, 0-10).
- **15+ ui-ux-pro-max skills auto-dispatched** by judgment from actual content (NOT keyword matching) — `polish`, `normalize`, `arrange`, `distill`, `typeset`, `colorize`, `bolder`, `quieter`, `delight`, `animate`, `overdrive`, `adapt`, `harden`, `clarify`, `onboard`, `critique`.
- **User confirmation** — every selection presented with reasoning tied to specific source (AC #N / screenshot / user concern).
- **Branch B save targets** — new `dp-{N}-{slug}` story / append to existing via refine-story / file only.
- **Routing** — Branch A: `[D]` dev-story / `[S]` save. Branch B: `[D]` / `[R]` (refine-story) / `[S]` per save target.

### 10. `qa-test` — Story/Epic browser QA via Chrome DevTools

Spec-first QA testing in a real browser.

- **Spec-first** — produces a comprehensive QA Test Specification document **before** any browser action.
- **8 test dimensions** — functional / edge cases / error / navigation / regression / accessibility / responsive / UI-visual.
- **Chrome DevTools MCP** — every test case verified in a real browser with screenshot evidence.
- **Fix-as-you-go** — small-scope failures fixed inline + regression-checked; large-scope failures deferred with documented recommendations.
- **Epic mode** — sequentially tests every story, completes each cycle before moving on.
- **Verification gates** — `verification-before-completion` enforces evidence on every claim.
- **Superpowers integration** — `verification-before-completion`, `systematic-debugging`, `dispatching-parallel-agents`.
- **Persistent QA report** — named by story/epic ID for long-term reference.
- **Decision gate** — chain to `refine-story`, `dev-story`, or stop.
- **Deterministic Python scripts** — `qa-state.py` for state, `qa-spec-stats.py` for test counts (LLM context stays lean).

## Included Skills (9 superpowers)

All sourced from [obra/superpowers](https://github.com/obra/superpowers) (synced).

| Skill | Description |
|---|---|
| `test-driven-development` | RED-GREEN-REFACTOR + testing anti-patterns guide |
| `systematic-debugging` | 4-phase debugging + root cause tracing + defense-in-depth + condition-based-waiting |
| `dispatching-parallel-agents` | Parallel agent dispatch patterns for independent tasks |
| `verification-before-completion` | Evidence-before-claims gate; run command, read output, then claim |
| `subagent-driven-development` | Context-isolated test-writer ↔ implementer split (with prompt templates) |
| `finishing-a-development-branch` | Branch-finishing discipline: cleanup, options (merge/PR/keep/discard) |
| `using-git-worktrees` | Single-repo branch isolation via `git worktree add` (different shape from multi-repo `set-worktree`) |
| `requesting-code-review` | Dispatch code-reviewer sub-agent with crafted context (with template) |
| `receiving-code-review` | Verify before implementing, push back with reasoning, no performative agreement |

## Installation

```bash
git clone https://github.com/hojeongna/bmad-grr.git
cd bmad-grr
bash install.sh
```

This will:
- Clean up any deprecated grr-fork workflows from prior versions (`create-prd`, `create-architecture`, `create-epics-and-stories`, `create-story` and their commands).
- Install the 9 superpowers skills to `~/.claude/skills/`.
- Install the 10 workflows to `~/.claude/workflows/`.
- Install the 10 commands to `~/.claude/commands/`.

### Update

```bash
bash install.sh
```

The cleanup step is idempotent — re-running install is safe.

### Uninstall

```bash
bash uninstall.sh
```

Removes everything, including any deprecated leftovers.

## Installed File Structure

```
~/.claude/
├── commands/                              # 10 grr commands
│   ├── bmad-grr-dev-story.md
│   ├── bmad-grr-code-review.md
│   ├── bmad-grr-review-checklist.md
│   ├── bmad-grr-bug-hunt.md
│   ├── bmad-grr-set-worktree.md
│   ├── bmad-grr-pr-create.md
│   ├── bmad-grr-refine-story.md
│   ├── bmad-grr-quick-story.md
│   ├── bmad-grr-design-pass.md
│   └── bmad-grr-qa-test.md
├── workflows/                             # 10 workflows
│   ├── dev-story/        (5 step files + checklist)
│   ├── code-review/      (6 step files)
│   ├── review-checklist/ (5 + 3 + 2 step files across modes)
│   ├── bug-hunt/         (7 step files + bug-report template)
│   ├── set-worktree/     (3 step files)
│   ├── pr-create/        (7 step files including step-04b-update-pr)
│   ├── refine-story/     (5 step files)
│   ├── quick-story/      (5 step files + story template)
│   ├── design-pass/      (6 step files + 3 data files)
│   └── qa-test/          (5 step files + 2 templates + 2 scripts + tests)
└── skills/                                # 9 superpowers
    ├── test-driven-development/
    ├── systematic-debugging/
    ├── dispatching-parallel-agents/
    ├── verification-before-completion/
    ├── subagent-driven-development/
    ├── finishing-a-development-branch/
    ├── using-git-worktrees/
    ├── requesting-code-review/
    └── receiving-code-review/
```

## Usage

In any project with BMAD installed:

```
# Story creation (lightweight, from zero)
/bmad-grr-quick-story

# Story implementation (BDD-ATDD + TDD)
/bmad-grr-dev-story

# Story refinement after dev-story / QA / feedback
/bmad-grr-refine-story

# Browser-verified QA testing
/bmad-grr-qa-test

# UI/UX design pass (pre-dev or live-fix)
/bmad-grr-design-pass

# Stuck bug — systematic escalation-based debugging
/bmad-grr-bug-hunt

# Code review (checklist-based)
/bmad-grr-code-review

# Generate / validate / edit code review checklists
/bmad-grr-review-checklist

# Multi-repo monorepo workspace setup
/bmad-grr-set-worktree

# PR lifecycle (with re-push for post-edit updates)
/bmad-grr-pr-create
```

For PRD / Architecture / Epics / Story creation use upstream BMAD:

```
/bmad-create-prd
/bmad-create-architecture
/bmad-create-epics-and-stories
/bmad-create-story
```

## Requirements

- [Claude Code](https://claude.com/claude-code) CLI
- [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) installed in your project (`config.yaml` required)

## Workflow Flows

### dev-story

```
step-01-init (also handles resume)
    │ Find/resume story · Detect BDD runner · Load TDD skill · Mark in-progress
    ↓
step-02-analyze
    │ Convert ACs → Gherkin scenarios · Group by independence
    ↓
step-03-atdd-tdd-loop ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
    │ For each scenario:                       │
    │   • Author .feature + step definitions   │
    │   • RED (BDD runner fails)               │
    │   • Drill down: TDD inner loop           │
    │     (optional: subagent-driven-          │
    │      development for context isolation)  │
    │   • GREEN (BDD runner passes)            │
    │ Verification-before-completion enforced  │
    ↓                                          │ (loop until all scenarios green)
step-04-validate
    │ All scenarios green · Full regression · Inline health check (types/lint)
    ↓
step-05-complete (END)
    │ Verification-before-completion on every DoD item
    │ finishing-a-development-branch cleanup
    │ Status → review · Sprint-status updated · Summary
```

### code-review

```
step-01-init                  Load checklist (HALT if none) · Pick source [S/D/M]
   ↓
step-02-collect               Collect files + per-file diffs
   ↓
step-03-review                Parallel sub-agent per file vs full checklist
   ↓
step-04-report                Priority × Scope · Receiving-code-review on pushback
   │ [F]ull / [S]mall / [H]igh / [X]Skip
   ↓
step-05-fix (parallel)        Per-file fix agents · Auto test runs + retry
   ↓
step-06-complete (END)        Story-status update · Reflect changes back to story doc
```

### review-checklist

```
Create:    step-01-init → step-02-execute (parallel agents) → step-03-interactive → step-04-integrate → step-05-finalize
Validate:  step-01-validate → step-02-report
Edit:      step-01-assess → step-02-edit → step-03-complete
```

### bug-hunt

```
step-01-init (also handles resume)
   ↓
step-02-code-analysis (Level 1)        Found? → step-05-fix · else escalate
   ↓
step-03-debug-logs (Level 2)           DevTools evidence · Found? → step-05-fix · else escalate
   ↓
step-04-web-search (Level 3)           Found? → step-05-fix · 3+ failures? → step-04b-architecture
   ↓
step-04b-architecture                  Architecture review · Restart from Level 1 with new direction
   ↓
step-05-fix                            Implement + verify in real environment
   ↓
step-06-wrapup (END)                   Remove every tracked debug log · Document in story or bug report
```

### set-worktree

```
step-01-init                 Confirm root (NOT git) · Gather repos / branches
   ↓
step-02-execute              Inline safety checks · Parallel clone (1 sub-agent / repo)
   ↓
step-03-document-complete    Generate worktree-map.md (END)
```

### pr-create

```
step-01-init (also handles resume)
   │ Auto-routes:
   │   • OPEN PR + uncommitted/unpushed → step-04b-update-pr
   │   • PLANNED → step-02-plan
   │   • PUSHED → step-04-test-create
   │   • OPEN clean → step-05-merge-loop
   │   • All MERGED → step-06-complete
   ↓
step-02-plan                  Per-repo single PR or split by responsibility
   ↓
step-03-commit-push           Stage by PR plan · Commit · Push
   ↓
step-04-test-create           Test → fix-loop → PR (auto/manual) · Optional: requesting-code-review
   ↓
step-05-merge-loop ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
   │ Poll status · On merge of predecessor:    │
   │   rebase next PR → route to step-04        │ (loop)
   │ [U] Update an OPEN PR → step-04b           │
   │ All merged → step-06                       │
   ↓                                            │
step-04b-update-pr ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ (returns to step-05)
   │ For OPEN PR with extra edits: CI test → fix → amend/new → push (no new PR)
   ↓
step-06-complete (END)        Verify all merged · finishing-a-development-branch cleanup
```

### refine-story

```
step-01-init                  Collect situation · Discover stories · Receiving-code-review on QA/review feedback
   ↓
step-02-verify (optional)     Server check · Chrome DevTools / Playwright visual inspection
   ↓
step-03-analyze               Gap analysis (parallel for epic) · Modify vs create · CHECKPOINT
   ↓
step-04-execute               Update AC / Tasks (reset [ ]) / Dev Notes · Sprint-status
   ↓
step-05-complete (END)        [D] dev-story / [U] design-pass first / [S] save
```

### quick-story

```
step-01-init                  Capture intent · Detect existing → delegate to refine-story
   ↓
step-02-analyze               project-context · Touchpoint discovery · Observed patterns
   ↓
step-03-architect             5-field Mini Architecture · Inline 4-point Impact · Fix-deep dive (if change_type='fix')
   ↓
step-04-compose               Inline 4-Q Mini PRD · Inline Premise Challenge · Render template · Write file · Sprint-status
   ↓
step-05-route (END)           [D] dev-story / [U] design-pass first / [S] save
```

### design-pass

```
step-01-init                  Branch decision: [A] pre-dev / [B] live-fix / [C] no-story → quick-story
   ↓
[A] step-02a-plan-audit       Read full story · Inline plan-audit framework · Auto-dispatch ui-ux-pro-max
[B] step-02b-live-audit       Verify server · Chrome DevTools capture · Inline live-audit framework + critique scoring · Auto-dispatch
   ↓
[A] step-03a-enhance-doc      Compose UX Considerations section · Insert before Dev Agent Record
[B] step-03b-document-fix     Compose improvement doc · Save target [N/A/S] · Sprint-status (when N)
   ↓
step-04-route (END)           [D] dev-story / [R] refine-story (B+A only) / [S] save
```

### qa-test

```
step-01-init (also handles resume)         Scope [S/E] · App URL · Detect BDD-runner-equivalent
   ↓
step-02-test-plan ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
   │ Generate QA Test Spec (8 dimensions)   │ (epic loop:
   │ User reviews + approves                │  next story)
   ↓                                        │
step-03-execute-and-fix                     │
   │ Chrome DevTools MCP per case           │
   │ PASS → screenshot · Continue           │
   │ FAIL (small) → fix → re-test → regress │
   │ FAIL (large) → defer + document        │
   ↓                                        │
step-04-story-wrapup ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
   │ Write deferred to story · More stories? → loop
   ↓ (all done)
step-05-final-report (END)
   │ [R] refine-story / [D] dev-story / [S] stop
```

## License

MIT — see install.sh / uninstall.sh for the actual file inventory the scripts manage.
