# GRR — Guardrails for Reliable Releases

Extended workflow collection for BMAD — adds TDD enforcement, parallel agent dispatching, checklist-based code review, systematic debugging, and automated checklist generation to your Claude Code projects.

## Included Workflows

### 1. dev-story

Story implementation workflow with TDD enforcement and parallel agent dispatching.

- **TDD Skill Enforcement**: Loads `test-driven-development` skill before implementation — RED-GREEN-REFACTOR is mandatory
- **Parallel Agent Dispatching**: Automatically dispatches parallel agents when 2+ independent tasks are detected
- **Multi-Session Support**: Resume previous sessions via step-01b-continue
- **Systematic Debugging**: Loads debugging skill on test failures

### 2. code-review

Checklist-based code review — zero subjective judgment allowed.

- **Checklist Required**: Must provide a checklist `.md` file — workflow HALTs without one
- **No Subjective Opinions**: If it's not in the checklist, it's not a finding
- **Parallel File Review**: Each file reviewed by an independent agent in parallel
- **Scope-Based Fix Options**: Choose fix scope after review:
  - `[F]` Full — fix ALL findings, no exceptions
  - `[S]` Small — fix small-scope items only
  - `[H]` High — fix HIGH priority items only
  - `[X]` Skip — complete without fixes
- **Parallel Fix Execution**: Fix agents dispatched per-file in parallel (mirrors review pattern)
- **No Deferral Policy**: Selected scope items are fixed unconditionally — "too complex" or "needs refactoring" is never an excuse
- **Priority Classification**: HIGH / MEDIUM / LOW for every finding
- **Scope Classification**: SMALL / LARGE for every finding
- **3 Review Sources**: Story document / git diff / manual file list
- **Story Document Reflection**: After review, updates story documents with actual changes — modified plans are updated in-place, additional changes are appended

### 3. review-checklist

Generate, edit, or validate code review checklists for use with `code-review`.

- **3 Modes**: Create / Edit / Validate
- **4 Generation Sources** (combinable):
  - Project analysis — scan codebase for patterns and conventions
  - GitHub PR review mining — extract patterns from past PR reviews
  - Interactive Q&A — collaborative checklist building with user input
  - Universal best practices — common code quality patterns
- **Parallel Execution**: Automatic modes (project analysis, PR mining, universal) run as parallel agents
- **Direct Compatibility**: Output is structured for immediate use by `code-review`
- **Tri-Modal Architecture**: Separate step folders for create (`steps-c/`), edit (`steps-e/`), and validate (`steps-v/`)

### 4. bug-hunt

Systematic debugging workflow with escalation levels and evidence-based root cause analysis.

- **Iron Law**: No fix attempts without root cause investigation first
- **Escalation Levels**: Level 1 (code analysis) → Level 2 (debug logs + DevTools) → Level 3 (web search)
- **Chrome DevTools MCP**: Collects evidence via Chrome DevTools integration
- **Debug Log Lifecycle**: Tracks all inserted debug logs, forcibly removes on completion
- **Story/Bug Report Documentation**: Documents findings in story file or standalone bug report
- **Architecture Review**: Fundamental re-examination when 3+ hypotheses fail

### 5. set-worktree

Multi-repo worktree workspace setup with parallel clone and branch creation.

- **Monorepo-Style Setup**: Clone multiple GitHub repos as git worktrees under one project root
- **Parallel Execution**: All repos cloned and branched simultaneously via sub-agents
- **Branch Convention**: Auto-suggests `{type}/{YYMMDD}-{description}` branch names (feature/fix/refactor/chore)
- **Mapping Document**: Generates `worktree-map.md` with folder paths, repo links, branches for PR workflow reference
- **Pairs with pr-create**: Mapping document feeds directly into `pr-create` workflow

### 6. pr-create

PR lifecycle management — analyze, split, test, create, track, and rebase.

- **Change Analysis**: Scans all repos for change volume via git diff
- **Smart Splitting**: Recommends splitting PRs when changes exceed 1000 lines
- **Responsibility-Based**: Each PR gets a clear role — not arbitrary line splits
- **Split Options**: AI-proposed grouping or manual user specification
- **Local Testing**: Runs repo test suite before PR creation — test failures trigger amend/new-commit choice
- **Auto/Manual PR Creation**: `gh pr create` automatically or provides the command for manual execution
- **Merge Tracking**: Monitors PR merge status via `gh pr view`
- **Sequential Rebase**: Handles rebasing between sequential PRs in the same repo
- **Continuable**: Saves state across sessions — resume after waiting for merges
- **Pairs with set-worktree**: Reads `worktree-map.md` for repo/branch context

### 7. refine-story

Story refinement workflow — analyze, update, and chain back into dev-story.

- **Post dev-story Bridge**: Handles the gap when implementation results differ from expectations or new improvements are needed
- **Multi-Scope Input**: Single story, multiple stories, or entire epic — user specifies or AI discovers
- **Visual Verification**: Optional browser inspection via Chrome DevTools MCP / Playwright MCP with server status check
- **Gap Analysis**: Compares story documents against current implementation state with parallel sub-agent analysis
- **Smart Decision**: AI determines whether to modify existing stories or create new ones, with user checkpoint
- **Precise Execution**: Updates AC, Tasks (resets to `[ ]`), Dev Notes with refinement context, sprint_status → `ready-for-dev`
- **dev-story Chaining**: Optionally chains directly into dev-story in the same session for immediate implementation
- **Creative Tools**: Party Mode, Advanced Elicitation, and Brainstorming available for feature improvement exploration

### 8. quick-story

Lightweight pre-dev story drafting — mini PRD + mini architecture + story + tasks in a single unified document, no prior PRD or architecture pipeline required.

- **No Prerequisites**: Starts from zero — ideal for fast solo work on a single change, no epic/PRD/architecture pipeline needed upstream
- **Existing Story Detection**: Auto-delegates to `refine-story` if a matching story already exists in sprint-status (keyword-based match on titles)
- **Mini PRD (4 fields)**: Problem / Users / Success / Out-of-scope — collected in a single inline Q&A round
- **Mini Architecture (5 fields)**: Stack / Touchpoints / Patterns / Constraints / Risks — bullet points only, no paragraphs
- **gstack/learn Integration**: Queries prior architecture learnings (`architecture`, `pattern`, `pitfall` types) to respect past decisions on this project
- **gstack/plan-eng-review Integration**: Runs 4-point Architecture Impact analysis — Scope Challenge, Failure Scenarios, Cross-Story Impact, Test Coverage Gap
- **Optional gstack/health**: Module health check for unfamiliar code areas (type/lint/test/dead code)
- **Dev-Story Compatible Output**: Generates story in the exact format `dev-story` expects — chain with `[D]` in the same session with no transformation
- **Optional gstack/qa**: Quick QA via browser before chaining to dev-story
- **Graceful Degradation**: All gstack skills are OPTIONAL — workflow produces valid output with zero gstack installed

### 9. design-pass

LLM-judgment-first UI/UX design pass. Two branches (pre-dev enhancement OR live-fix audit) with auto-dispatched gstack UX skills selected by deep reading of actual content — NOT keyword matching.

- **Two Branches**:
  - **Branch A (Pre-dev)** — Read story document deeply, enhance with "UX Considerations" section before implementation
  - **Branch B (Live-fix)** — Audit running screen, document improvement proposals with priorities
- **LLM Judgment Core**: Skills are auto-selected by reading the actual story content or live audit findings, NOT by keyword matching. Every selection comes with specific reasoning tied to the source (AC #N, screenshot finding, user's exact words).
- **15+ Auto-Dispatched UX Skills**: `polish`, `normalize`, `arrange`, `distill`, `typeset`, `colorize`, `bolder`, `quieter`, `delight`, `animate`, `overdrive`, `adapt`, `harden`, `clarify`, `onboard` — loaded in FULL only when judgment says they're relevant
- **Base Skills (Always Loaded)**: 
  - Branch A: `plan-design-review` + `critique`
  - Branch B: `design-review` + `critique` + `browse` (or Chrome DevTools MCP)
- **User Confirmation**: LLM presents selection with reasoning, user can approve (Y) or adjust (M/+/N)
- **Save Target Options (Branch B)**: New `dp-N-slug` story / Append to existing (refine-story delegate) / File only
- **Dev-Story Compatible Output**: Branch B generates stories in dev-story-ready format — chain with [D]
- **Learnings Feedback Loop**: On completion, saves UX insights to `gstack/learn` for future passes
- **Reference Over Rules**: `data/ux-auto-dispatch-rules.md` contains common patterns as HINTS, not mechanical lookup

### 10. qa-test

Story/Epic-based web QA testing — creates a comprehensive test specification document, then executes every test case in the real browser via Chrome DevTools MCP.

- **Spec-First**: Before touching the browser, creates a complete QA Test Specification document listing every possible scenario, edge case, error path, and regression check
- **Exhaustive Coverage**: Functional, edge cases, error handling, navigation, regression, accessibility, responsive, UI/visual — 8 test dimensions
- **Chrome DevTools MCP**: Every test case verified by actually clicking through the browser — screenshots as evidence
- **Fix-As-You-Go**: Small-scope failures fixed immediately and re-tested with regression checks before moving on
- **Defer-to-Refine**: Large-scope failures documented in the story document with fix recommendations, chainable to `refine-story`
- **Epic Mode**: Sequentially tests ALL stories in an epic — completes each story's full QA cycle before moving to the next
- **QA Report**: Produces a persistent QA report document named by story/epic identifier
- **Decision Gate**: After testing, choose to stop, chain to `refine-story`, or chain directly to `dev-story`
- **Deterministic Scripts**: `qa-state.py` for state management, `qa-spec-stats.py` for test case counting — keeping LLM context lean
- **gstack Integration**: `learn` (prior QA learnings), `qa` (structured QA methodology), `investigate` (deep debugging)
- **superpowers Integration**: `verification-before-completion` (evidence gates), `systematic-debugging` (root cause analysis), `dispatching-parallel-agents` (parallel code reading)

### 11. create-prd (grr-enhanced)

12-step PM-facilitated PRD creation enriched with gstack skills — CEO-mode premise challenge, YC forcing questions, past project learnings, and 4-way validation.

- **12-Step Facilitated Process**: Discovery → vision → executive summary → success metrics → user journeys → domain context → innovation → project type → scoping → functional → non-functional → polish + validation
- **CEO Premise Challenge**: `plan-ceo-review` loaded at 6 steps — 10x thinking, nuclear scope challenge, dream state mapping
- **YC Forcing Questions**: `office-hours` runs 6 reality-check prompts (demand reality, status quo, desperate specificity, narrowest wedge, observation, future-fit)
- **4-Way Validation**: `autoplan` runs CEO + design + eng + DX reviews in final polish step
- **Prior Learnings**: `learn` queries past project context at init and saves PRD learnings at completion
- **Conditional Depth**: `plan-eng-review`, `plan-design-review`, `plan-devex-review`, `cso`, `onboard` loaded based on LLM judgment of PRD content domain
- **Graceful Degradation**: All gstack skills optional — produces valid PRD with zero gstack installed

### 12. create-architecture (grr-enhanced)

8-step collaborative architecture design enriched with gstack skills — engineering review, security threat modeling, failure mode analysis, and multi-perspective validation.

- **Collaborative Partnership**: Equal peer collaboration — facilitator brings architectural frameworks, user brings domain expertise
- **Engineering Supremacy**: `plan-eng-review` loaded at 4 steps — scope challenge, failure scenarios, test coverage gaps
- **Security Threat Modeling**: `cso` runs OWASP, STRIDE, supply chain, and LLM security analysis on architectural decisions
- **Failure Mode Analysis**: `systematic-debugging` validates each component's failure modes in final validation
- **TDD-Informed Testability**: `test-driven-development` patterns inform architectural testability decisions
- **4-Way Validation**: `autoplan` for final CEO + design + eng + DX validation
- **Brownfield Support**: `health` skill (conditional) for existing codebase module health assessment
- **Prior Learnings**: `learn` queries past architecture decisions and saves new ones

### 13. create-epics-and-stories (grr-enhanced)

4-step epic/story breakdown enriched with gstack skills — value validation per epic, feasibility checking, parallel story analysis, and multi-lens final validation.

- **PRD + Architecture → Epics**: Transforms requirements and architecture decisions into epics organized by user value
- **CEO Value Validation**: `plan-ceo-review` validates each epic ("Is this epic earning its weight?")
- **Engineering Feasibility**: `plan-eng-review` checks feasibility per epic and complexity per story
- **Parallel Story Analysis**: `dispatching-parallel-agents` analyzes multiple epics/stories simultaneously
- **TDD Decomposition**: `test-driven-development` ensures each story is testable and follows TDD sequence
- **4-Way Validation**: `autoplan` runs final 4-way validation across all epics and stories
- **Conditional Security/UX/DX**: `cso`, `plan-design-review`, `plan-devex-review` loaded by LLM judgment per story content

### 14. create-story (grr-enhanced)

Comprehensive story file creation that gives the dev agent everything needed for flawless implementation — parallel artifact analysis, architecture compliance, TDD-aware testing, and domain-specific reviews.

- **Exhaustive Context Engine**: NOT a copy from epics — creates an optimized, comprehensive story file for developer implementation
- **Prevent LLM Mistakes**: Guards against reinventing wheels, wrong libraries, wrong file locations, breaking regressions, vague implementations
- **XML Workflow**: 6-step state machine with conditional branching (determine target → analyze artifacts → architecture analysis → web research → create story → update sprint)
- **Parallel Artifact Analysis**: `dispatching-parallel-agents` analyzes PRD, architecture, UX, project context, previous stories simultaneously
- **Architecture Compliance**: `plan-eng-review` validates every story against architecture guardrails
- **TDD Testing Standards**: `test-driven-development` defines testing requirements and TDD sequence per story
- **Zero User Intervention**: Fully automated except initial story selection or missing documents
- **Conditional Depth**: `cso` (auth/secrets), `plan-design-review` (UI), `plan-devex-review` (API/SDK), `investigate` (fix/debug), `health` (module assessment)
- **Story Intelligence**: `learn` queries past story patterns and saves creation learnings

## Included Skills

Sourced from [obra/superpowers](https://github.com/obra/superpowers):

| Skill | Description |
|-------|-------------|
| `test-driven-development` | RED-GREEN-REFACTOR TDD process + testing anti-patterns guide |
| `systematic-debugging` | 4-phase systematic debugging + root cause tracing + defensive validation |
| `dispatching-parallel-agents` | Parallel agent dispatch patterns for independent tasks |

## Installation

### Automatic

```bash
git clone https://github.com/hojeongna/bmad-grr.git
cd bmad-grr
bash install.sh
```

### Manual

```bash
# Copy skills
cp -r skills/* ~/.claude/skills/

# Copy workflows
mkdir -p ~/.claude/workflows
cp -r workflows/* ~/.claude/workflows/

# Copy commands
cp commands/* ~/.claude/commands/
```

### Update

Re-run `install.sh` to update all installed files:

```bash
bash install.sh
```

## Installed File Structure

```
~/.claude/
├── commands/
│   ├── bmad-grr-dev-story.md
│   ├── bmad-grr-code-review.md
│   ├── bmad-grr-review-checklist.md
│   ├── bmad-grr-bug-hunt.md
│   ├── bmad-grr-set-worktree.md
│   ├── bmad-grr-pr-create.md
│   ├── bmad-grr-refine-story.md
│   ├── bmad-grr-qa-test.md
│   ├── bmad-grr-quick-story.md
│   ├── bmad-grr-design-pass.md
│   ├── bmad-grr-create-prd.md
│   ├── bmad-grr-create-architecture.md
│   ├── bmad-grr-create-epics-and-stories.md
│   └── bmad-grr-create-story.md
├── workflows/
│   ├── dev-story/
│   │   ├── workflow.md
│   │   ├── steps-c/ (8 step files)
│   │   └── data/checklist.md
│   ├── code-review/
│   │   ├── workflow.md
│   │   └── steps-c/ (6 step files)
│   ├── review-checklist/
│   │   ├── workflow.md
│   │   ├── steps-c/ (5 step files)
│   │   ├── steps-e/ (3 step files)
│   │   ├── steps-v/ (2 step files)
│   │   └── data/ (analysis-categories.md, checklist-template.md)
│   ├── bug-hunt/
│   │   ├── workflow.md
│   │   ├── steps-c/ (8 step files)
│   │   └── data/bug-report-template.md
│   ├── set-worktree/
│   │   ├── workflow.md
│   │   └── steps-c/ (3 step files)
│   ├── pr-create/
│   │   ├── workflow.md
│   │   └── steps-c/ (7 step files)
│   ├── refine-story/
│   │   ├── workflow.md
│   │   └── steps-c/ (5 step files)
│   ├── quick-story/
│   │   ├── workflow.md
│   │   ├── steps-c/ (5 step files)
│   │   └── data/story-template.md
│   ├── design-pass/
│   │   ├── workflow.md
│   │   ├── steps-c/ (6 step files)
│   │   └── data/ (ux-auto-dispatch-rules.md, ux-checklist.md, improvement-doc-template.md)
│   ├── qa-test/
│   │   ├── SKILL.md
│   │   ├── workflow.md
│   │   ├── steps-c/ (6 step files)
│   │   ├── data/ (qa-test-spec-template.md, qa-report-template.md)
│   │   └── scripts/ (qa-state.py, qa-spec-stats.py + tests)
│   ├── create-prd/
│   │   ├── workflow.md + SKILL.md
│   │   ├── steps-c/ (15 step files)
│   │   ├── data/ (prd-purpose.md + CSVs)
│   │   └── templates/ (prd-template.md)
│   ├── create-architecture/
│   │   ├── workflow.md + SKILL.md
│   │   ├── steps/ (9 step files)
│   │   ├── data/ (CSVs)
│   │   └── architecture-decision-template.md
│   ├── create-epics-and-stories/
│   │   ├── workflow.md + SKILL.md
│   │   ├── steps/ (4 step files)
│   │   └── templates/ (epics-template.md)
│   └── create-story/
│       ├── workflow.md + SKILL.md
│       ├── template.md
│       ├── checklist.md
│       └── discover-inputs.md
└── skills/
    ├── test-driven-development/
    │   ├── SKILL.md
    │   └── testing-anti-patterns.md
    ├── systematic-debugging/
    │   ├── SKILL.md
    │   ├── root-cause-tracing.md
    │   ├── defense-in-depth.md
    │   └── condition-based-waiting.md
    └── dispatching-parallel-agents/
        └── SKILL.md
```

## Usage

In any project with BMAD installed:

```
# Story implementation (TDD + parallel agents)
/bmad-grr-dev-story

# Checklist-based code review
/bmad-grr-code-review

# Generate/edit/validate code review checklists
/bmad-grr-review-checklist

# Systematic debugging with escalation levels
/bmad-grr-bug-hunt

# Multi-repo worktree workspace setup
/bmad-grr-set-worktree

# PR lifecycle management
/bmad-grr-pr-create

# Story refinement after dev-story
/bmad-grr-refine-story

# Lightweight pre-dev story (mini PRD + mini architecture + tasks)
/bmad-grr-quick-story

# UI/UX design pass (pre-dev enhance OR live-fix audit)
/bmad-grr-design-pass

# Story/Epic-based web QA testing with Chrome DevTools
/bmad-grr-qa-test

# grr-enhanced planning workflows
/bmad-grr-create-prd
/bmad-grr-create-architecture
/bmad-grr-create-epics-and-stories
/bmad-grr-create-story
```

## Requirements

- [Claude Code](https://claude.com/claude-code) CLI
- [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) installed in your project (config.yaml required)

## Workflow Flows

### dev-story

```
step-01-init (or step-01b-continue)
    ↓
step-02-setup
    ↓
step-03-analyze ← ─ ─ ─ ─ ─ ─ ─ ┐
    ↓ (parallel or sequential)    │ (loop if tasks remain)
step-04-implement                 │
    ↓                             │
step-05-validate ─ ─ ─ ─ ─ ─ ─ ─ ┘
    ↓ (all tasks done)
step-06-completion
    ↓
step-07-communicate (END)
```

### code-review

```
step-01-init
    │ Load checklist (HALT if none)
    │ Select source: [S] Story / [D] Git diff / [M] Manual
    ↓
step-02-collect
    │ Collect files by source type
    ↓
step-03-review
    │ Parallel agent dispatch (one per file)
    │ Each agent: review against full checklist only
    ↓
step-04-report
    │ Aggregate results
    │ Assign priority (HIGH/MEDIUM/LOW)
    │ Assign scope (SMALL/LARGE)
    │ Present report
    │   [F] Full fix    → step-05
    │   [S] Small only  → step-05
    │   [H] High only   → step-05
    │   [X] Skip        → step-06
    ↓
step-05-fix (parallel)
    │ Filter findings by selected scope
    │ Parallel agent dispatch (one per file)
    │ No deferral — all items in scope MUST be fixed
    ↓
step-06-complete (END)
    │ Update story status (if story-based)
    │ Reflect review changes into story documents
    │ Completion summary
```

### review-checklist

**Create mode:**

```
step-01-init
    │ Select generation modes (combinable)
    ↓
step-02-execute
    │ Run selected modes as parallel agents
    │ (project analysis, PR mining, universal)
    ↓
step-03-interactive
    │ Interactive Q&A with user
    ↓
step-04-integrate
    │ Merge all sources into unified checklist
    ↓
step-05-finalize (END)
    │ Output checklist md file
```

**Edit mode:** `step-01-assess` → `step-02-edit` → `step-03-complete`

**Validate mode:** `step-01-validate` → `step-02-report`

### set-worktree

```
step-01-init
    │ Confirm project root
    │ Gather problem context
    │ Collect repo links + branch config
    ↓
step-02-execute
    │ Parallel clone all repos (sub-agents)
    │ Create branches on correct base
    ↓
step-03-document-complete (END)
    │ Generate worktree-map.md
    │ Completion summary
```

### pr-create

```
step-01-init (or step-01b-continue)
    │ Read worktree-map.md
    │ Analyze change volume per repo
    ↓
step-02-plan
    │ < 1000 lines → single PR
    │ >= 1000 lines → split by responsibility
    │ [A] AI-proposed split / [M] Manual
    ↓
step-03-commit-push
    │ Stage per PR plan → commit → push
    ↓
step-04-test-create ← ─ ─ ─ ─ ─ ─ ┐
    │ Run local tests                │
    │ Fail → fix → [A]mend/[N]ew    │
    │ Pass → [A]uto/[M]anual PR     │ (rebase next PR)
    ↓                                │
step-05-merge-loop ─ ─ ─ ─ ─ ─ ─ ─ ┘
    │ Check merge status (gh pr view)
    │ Merged → rebase next PR → loop
    │ Not merged → save & exit (continuable)
    │ All done ↓
step-06-complete (END)
    │ Verify all merged
    │ Completion summary
```

### refine-story

```
step-01-init
    │ Collect situation + discover stories
    │ (single / multi / epic with parallel sub-agents)
    ↓
step-02-verify (optional)
    │ Server check → Chrome DevTools / Playwright
    │ Visual findings captured
    ↓
step-03-analyze
    │ Gap analysis (parallel sub-agents for epic)
    │ Decide: modify existing vs create new
    │ [A] Advanced Elicitation / [P] Party Mode / [B] Brainstorming
    │ CHECKPOINT: user confirms approach
    ↓
step-04-execute
    │ Update AC, Tasks (reset [ ]), Dev Notes
    │ sprint_status → ready-for-dev
    │ CHECKPOINT: user confirms results
    ↓
step-05-complete (END)
    │ [D] Chain into dev-story (same session)
    │ [S] End workflow
```

### quick-story

```
step-01-init
    │ Collect user intent (one round)
    │ Scan sprint-status for existing story match
    │ IF match → delegate to refine-story (END)
    │ ELSE → continue
    ↓
step-02-analyze
    │ Load project-context.md
    │ Query gstack/learn for prior learnings (optional)
    │ Discover 3-5 touchpoint files
    │ Optional: gstack/health check
    ↓
step-03-architect
    │ Draft Mini Architecture (5 fields)
    │ IF gstack/plan-eng-review installed:
    │   → 4-point Architecture Impact analysis
    │ CHECKPOINT: user confirms draft
    ↓
step-04-compose
    │ Inline 4-Q Mini PRD
    │ Generate story_key + render template
    │ CHECKPOINT: user confirms final story
    │ Write to {implementation_artifacts}/{story_key}.md
    │ Update sprint-status.yaml (ready-for-dev)
    ↓
step-05-route (END)
    │ [D] Chain to dev-story (same session)
    │ [S] Save and exit
    │ [Q] Quick QA via gstack/qa (if installed)
```

### design-pass

```
step-01-init
    │ Collect input (story ref or URL + optional concern)
    │ Branch decision:
    │   [A] Pre-dev (story ref) → step-02a
    │   [B] Live-fix (URL) → step-02b
    │   [C] No story → delegate to quick-story
    ↓
┌─── Branch A ──────────┐   ┌─── Branch B ──────────┐
│ step-02a-plan-audit    │   │ step-02b-live-audit    │
│  • Load FULL story doc │   │  • Verify server       │
│  • Load plan-design-   │   │  • Load design-review  │
│    review + critique   │   │    + critique + browse │
│  • Deep reading        │   │  • Capture screenshots │
│  • LLM judgment →      │   │  • LLM judgment →      │
│    auto-dispatch skills│   │    auto-dispatch skills│
│  • User confirms       │   │  • User confirms       │
│  • Apply skills        │   │  • Apply skills        │
│         ↓              │   │         ↓              │
│ step-03a-enhance-doc   │   │ step-03b-document-fix  │
│  • Compose UX          │   │  • Choose save target  │
│    Considerations      │   │    (N/A/S)             │
│  • User approves       │   │  • Compose improvement │
│  • Insert into story   │   │    doc with priorities │
│                        │   │  • User approves       │
│                        │   │  • Write + register    │
└────────┬───────────────┘   └────────┬───────────────┘
         │                            │
         └──────────────┬─────────────┘
                        ↓
             step-04-route (END)
                │ Save learnings to gstack/learn
                │ Branch A: [D] dev-story / [S] save only
                │ Branch B (N): [D] dev-story / [S] save only
                │ Branch B (A): [R] refine-story delegate
                │ Branch B (S): [D] dev-story / [S] exit
```

### qa-test

```
step-01-init (or step-01b-continue)
    │ Determine scope: [S] Single story / [E] Full epic
    │ Load story files, app URL
    │ Query gstack/learn for prior QA learnings
    ↓
step-02-test-plan ← ─ ─ ─ ─ ─ ─ ─ ─ ┐
    │ Read story + implementation code   │ (epic loop:
    │ Generate QA Test Specification     │  next story)
    │ 8 dimensions: functional, edge,    │
    │   error, nav, regression,          │
    │   a11y, responsive, ui/visual      │
    │ User reviews + approves spec       │
    ↓                                    │
step-03-execute-and-fix                  │
    │ Chrome DevTools MCP: test each     │
    │   case one by one                  │
    │ PASS → screenshot + next case      │
    │ FAIL (small) → fix → re-test       │
    │   → regression check → next case   │
    │ FAIL (large) → defer + next case   │
    ↓                                    │
step-04-story-wrapup ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
    │ Write deferred issues to story doc
    │ Save QA learnings (gstack/learn)
    │ Epic: more stories? → loop to step-02
    ↓ (all stories done)
step-05-final-report (END)
    │ Generate final QA report
    │ [R] Chain to refine-story
    │ [D] Chain to dev-story
    │ [S] Stop here
```

### bug-hunt

```
step-01-init (or step-01b-continue)
    ↓
step-02-code-analysis (Level 1)
    │ Root cause found? → step-05-fix
    ↓ (not found)
step-03-debug-logs (Level 2)
    │ Root cause found? → step-05-fix
    ↓ (not found)
step-04-web-search (Level 3)
    │ Root cause found? → step-05-fix
    │ 3+ failures? → step-04b-architecture
    ↓
step-04b-architecture
    │ Fundamental review → restart from step-02
    ↓
step-05-fix
    │ Implement fix + verify
    │ Verification failed? → loop back to investigation level
    ↓
step-06-wrapup (END)
    │ Remove all debug logs
    │ Document findings in story/bug report
```

### create-prd (grr-enhanced)

```
step-01-init (or step-01b-continue)
    │ Load config, query gstack/learn
    ↓
step-02-discovery
    │ gstack/office-hours: 6 forcing questions
    │ gstack/plan-ceo-review: Premise Challenge
    ↓
step-02b-vision → step-02c-executive-summary
    ↓
step-03-success (metrics)
    ↓
step-04-journeys (user journeys, conditional: onboard, design-review)
    ↓
step-05-domain (domain context + learn query)
    ↓
step-06-innovation (differentiation, ceo-review)
    ↓
step-07-project-type (classification)
    ↓
step-08-scoping (scope + feasibility, ceo-review Nuclear Scope Challenge)
    ↓
step-09-functional (requirements, conditional: eng-review, cso, design-review)
    ↓
step-10-nonfunctional (NFRs, conditional: eng-review, cso, devex-review)
    ↓
step-11-polish (autoplan 4-way validation: CEO + design + eng + DX)
    ↓
step-12-complete (END)
    │ Save learnings to gstack/learn
```

### create-architecture (grr-enhanced)

```
step-01-init (or step-01b-continue)
    │ Load config, conditional: gstack/health (brownfield)
    ↓
step-02-context
    │ Load PRD, query gstack/learn
    ↓
step-03-starter
    │ Starter architecture patterns
    │ gstack/plan-eng-review: scope challenge
    ↓
step-04-decisions
    │ Key architectural decisions
    │ gstack/plan-eng-review + gstack/cso
    │ Conditional: investigate (novel tech)
    ↓
step-05-patterns
    │ Patterns + testability
    │ gstack/plan-eng-review + superpowers/TDD
    ↓
step-06-structure
    │ Code structure + component breakdown
    │ gstack/plan-eng-review
    │ Conditional: design-review, devex-review
    ↓
step-07-validation
    │ superpowers/systematic-debugging: failure modes
    │ autoplan: 4-way validation
    ↓
step-08-complete (END)
    │ Save learnings to gstack/learn
```

### create-epics-and-stories (grr-enhanced)

```
step-01-validate-prerequisites
    │ Validate PRD + Architecture exist
    │ Query gstack/learn for past epic sizing
    ↓
step-02-design-epics
    │ gstack/plan-ceo-review: value validation per epic
    │ gstack/plan-eng-review: feasibility per epic
    │ Conditional: cso, design-review, devex-review
    ↓
step-03-create-stories
    │ superpowers/dispatching-parallel-agents: parallel analysis
    │ superpowers/TDD: testability per story
    │ gstack/plan-eng-review: complexity check
    ↓
step-04-final-validation (END)
    │ autoplan: 4-way validation
    │ Save learnings to gstack/learn
```

### create-story (grr-enhanced)

```
Step 1: Determine target story
    │ Parse input or auto-discover from sprint-status
    ↓
Step 2: Load and analyze artifacts
    │ superpowers/dispatching-parallel-agents: parallel analysis
    │ gstack/learn: past story intelligence
    │ Analyze: epics, PRD, architecture, UX, project-context, git history
    ↓
Step 3: Architecture analysis
    │ gstack/plan-eng-review: architecture compliance
    │ Conditional: gstack/cso, investigate, health
    ↓
Step 4: Web research
    │ Latest tech versions, APIs, security patches
    ↓
Step 5: Create story file
    │ superpowers/TDD: testing standards
    │ Conditional: design-review, devex-review, cso
    │ Generate comprehensive story with all sections
    ↓
Step 6: Update sprint status (END)
    │ Validate against checklist
    │ Save learnings to gstack/learn
```
