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

### 4. set-worktree

Multi-repo worktree workspace setup with parallel clone and branch creation.

- **Monorepo-Style Setup**: Clone multiple GitHub repos as git worktrees under one project root
- **Parallel Execution**: All repos cloned and branched simultaneously via sub-agents
- **Branch Convention**: Auto-suggests `{type}/{YYMMDD}-{description}` branch names (feature/fix/refactor/chore)
- **Mapping Document**: Generates `worktree-map.md` with folder paths, repo links, branches for PR workflow reference
- **Pairs with pr-create**: Mapping document feeds directly into `pr-create` workflow

### 5. pr-create

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

### 6. bug-hunt

Systematic debugging workflow with escalation levels and evidence-based root cause analysis.

- **Iron Law**: No fix attempts without root cause investigation first
- **Escalation Levels**: Level 1 (code analysis) → Level 2 (debug logs + DevTools) → Level 3 (web search)
- **Chrome DevTools MCP**: Collects evidence via Chrome DevTools integration
- **Debug Log Lifecycle**: Tracks all inserted debug logs, forcibly removes on completion
- **Story/Bug Report Documentation**: Documents findings in story file or standalone bug report
- **Architecture Review**: Fundamental re-examination when 3+ hypotheses fail

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
│   └── bmad-grr-pr-create.md
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
│   └── pr-create/
│       ├── workflow.md
│       └── steps-c/ (7 step files)
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
