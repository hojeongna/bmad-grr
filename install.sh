#!/bin/bash
# install.sh - Install GRR workflows, skills, and commands globally for Claude Code

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "=== GRR (Guardrails for Reliable Releases) Installer ==="
echo ""

# 0. Cleanup deprecated grr-fork workflows from prior versions
# These were forks of upstream bmad workflows that are no longer maintained as forks.
# Use the upstream bmad workflows directly: bmad-create-prd, bmad-create-architecture,
# bmad-create-epics-and-stories, bmad-create-story.
echo "[0/3] Cleaning up deprecated grr-fork workflows (if present)..."
rm -rf "$CLAUDE_DIR/workflows/create-prd"
rm -rf "$CLAUDE_DIR/workflows/create-architecture"
rm -rf "$CLAUDE_DIR/workflows/create-epics-and-stories"
rm -rf "$CLAUDE_DIR/workflows/create-story"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-prd.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-architecture.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-epics-and-stories.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-story.md"
echo "  - Removed deprecated forks: create-prd, create-architecture, create-epics-and-stories, create-story"
echo "  - For these workflows, use upstream BMAD: /bmad-create-prd, /bmad-create-architecture, /bmad-create-epics-and-stories, /bmad-create-story"

# 1. Install skills (9 superpowers bundled with bmad-grr — all from obra/superpowers)
echo "[1/3] Installing global skills..."
mkdir -p "$CLAUDE_DIR/skills/test-driven-development"
mkdir -p "$CLAUDE_DIR/skills/systematic-debugging"
mkdir -p "$CLAUDE_DIR/skills/dispatching-parallel-agents"
mkdir -p "$CLAUDE_DIR/skills/verification-before-completion"
mkdir -p "$CLAUDE_DIR/skills/subagent-driven-development"
mkdir -p "$CLAUDE_DIR/skills/finishing-a-development-branch"
mkdir -p "$CLAUDE_DIR/skills/using-git-worktrees"
mkdir -p "$CLAUDE_DIR/skills/requesting-code-review"
mkdir -p "$CLAUDE_DIR/skills/receiving-code-review"

cp "$SCRIPT_DIR/skills/test-driven-development/"* "$CLAUDE_DIR/skills/test-driven-development/"
cp "$SCRIPT_DIR/skills/systematic-debugging/"* "$CLAUDE_DIR/skills/systematic-debugging/"
cp "$SCRIPT_DIR/skills/dispatching-parallel-agents/"* "$CLAUDE_DIR/skills/dispatching-parallel-agents/"
cp "$SCRIPT_DIR/skills/verification-before-completion/"* "$CLAUDE_DIR/skills/verification-before-completion/"
cp "$SCRIPT_DIR/skills/subagent-driven-development/"* "$CLAUDE_DIR/skills/subagent-driven-development/"
cp "$SCRIPT_DIR/skills/finishing-a-development-branch/"* "$CLAUDE_DIR/skills/finishing-a-development-branch/"
cp "$SCRIPT_DIR/skills/using-git-worktrees/"* "$CLAUDE_DIR/skills/using-git-worktrees/"
cp "$SCRIPT_DIR/skills/requesting-code-review/"* "$CLAUDE_DIR/skills/requesting-code-review/"
cp "$SCRIPT_DIR/skills/receiving-code-review/"* "$CLAUDE_DIR/skills/receiving-code-review/"
echo "  - test-driven-development (SKILL.md + testing-anti-patterns.md)"
echo "  - systematic-debugging (SKILL.md + 3 reference files)"
echo "  - dispatching-parallel-agents (SKILL.md)"
echo "  - verification-before-completion (SKILL.md)"
echo "  - subagent-driven-development (SKILL.md + 3 prompt templates)"
echo "  - finishing-a-development-branch (SKILL.md)"
echo "  - using-git-worktrees (SKILL.md)"
echo "  - requesting-code-review (SKILL.md + code-reviewer template)"
echo "  - receiving-code-review (SKILL.md)"

# 2. Install workflows
echo "[2/3] Installing workflows..."

# dev-story (BDD-based ATDD outer loop + superpowers TDD inner loop)
mkdir -p "$CLAUDE_DIR/workflows/dev-story/steps-c"
mkdir -p "$CLAUDE_DIR/workflows/dev-story/data"
cp "$SCRIPT_DIR/workflows/dev-story/workflow.md" "$CLAUDE_DIR/workflows/dev-story/"
cp "$SCRIPT_DIR/workflows/dev-story/steps-c/"* "$CLAUDE_DIR/workflows/dev-story/steps-c/"
cp "$SCRIPT_DIR/workflows/dev-story/data/"* "$CLAUDE_DIR/workflows/dev-story/data/"
echo "  - dev-story (workflow.md + 5 step files + checklist)"

# code-review
mkdir -p "$CLAUDE_DIR/workflows/code-review/steps-c"
cp "$SCRIPT_DIR/workflows/code-review/workflow.md" "$CLAUDE_DIR/workflows/code-review/"
cp "$SCRIPT_DIR/workflows/code-review/steps-c/"* "$CLAUDE_DIR/workflows/code-review/steps-c/"
echo "  - code-review (workflow.md + 6 step files)"

# bug-hunt
mkdir -p "$CLAUDE_DIR/workflows/bug-hunt/steps-c"
mkdir -p "$CLAUDE_DIR/workflows/bug-hunt/data"
cp "$SCRIPT_DIR/workflows/bug-hunt/workflow.md" "$CLAUDE_DIR/workflows/bug-hunt/"
cp "$SCRIPT_DIR/workflows/bug-hunt/steps-c/"* "$CLAUDE_DIR/workflows/bug-hunt/steps-c/"
cp "$SCRIPT_DIR/workflows/bug-hunt/data/"* "$CLAUDE_DIR/workflows/bug-hunt/data/"
echo "  - bug-hunt (workflow.md + 7 step files + bug-report template)"

# set-worktree (monorepo-style; never makes the workspace root a git repo)
mkdir -p "$CLAUDE_DIR/workflows/set-worktree/steps-c"
cp "$SCRIPT_DIR/workflows/set-worktree/workflow.md" "$CLAUDE_DIR/workflows/set-worktree/"
cp "$SCRIPT_DIR/workflows/set-worktree/steps-c/"* "$CLAUDE_DIR/workflows/set-worktree/steps-c/"
echo "  - set-worktree (workflow.md + 3 step files)"

# pr-create (with step-04b-update-pr re-push branch for post-edit updates)
mkdir -p "$CLAUDE_DIR/workflows/pr-create/steps-c"
cp "$SCRIPT_DIR/workflows/pr-create/workflow.md" "$CLAUDE_DIR/workflows/pr-create/"
cp "$SCRIPT_DIR/workflows/pr-create/steps-c/"* "$CLAUDE_DIR/workflows/pr-create/steps-c/"
echo "  - pr-create (workflow.md + 7 step files including step-04b-update-pr)"

# refine-story
mkdir -p "$CLAUDE_DIR/workflows/refine-story/steps-c"
cp "$SCRIPT_DIR/workflows/refine-story/workflow.md" "$CLAUDE_DIR/workflows/refine-story/"
cp "$SCRIPT_DIR/workflows/refine-story/steps-c/"* "$CLAUDE_DIR/workflows/refine-story/steps-c/"
echo "  - refine-story (workflow.md + 5 step files)"

# quick-story
mkdir -p "$CLAUDE_DIR/workflows/quick-story/steps-c"
mkdir -p "$CLAUDE_DIR/workflows/quick-story/data"
cp "$SCRIPT_DIR/workflows/quick-story/workflow.md" "$CLAUDE_DIR/workflows/quick-story/"
cp "$SCRIPT_DIR/workflows/quick-story/steps-c/"* "$CLAUDE_DIR/workflows/quick-story/steps-c/"
cp "$SCRIPT_DIR/workflows/quick-story/data/"* "$CLAUDE_DIR/workflows/quick-story/data/"
echo "  - quick-story (workflow.md + 5 step files + story template)"

# design-pass
mkdir -p "$CLAUDE_DIR/workflows/design-pass/steps-c"
mkdir -p "$CLAUDE_DIR/workflows/design-pass/data"
cp "$SCRIPT_DIR/workflows/design-pass/workflow.md" "$CLAUDE_DIR/workflows/design-pass/"
cp "$SCRIPT_DIR/workflows/design-pass/steps-c/"* "$CLAUDE_DIR/workflows/design-pass/steps-c/"
cp "$SCRIPT_DIR/workflows/design-pass/data/"* "$CLAUDE_DIR/workflows/design-pass/data/"
echo "  - design-pass (workflow.md + 6 step files + 3 data files)"

# qa-test
mkdir -p "$CLAUDE_DIR/workflows/qa-test/steps-c"
mkdir -p "$CLAUDE_DIR/workflows/qa-test/data"
mkdir -p "$CLAUDE_DIR/workflows/qa-test/scripts/tests"
cp "$SCRIPT_DIR/workflows/qa-test/workflow.md" "$CLAUDE_DIR/workflows/qa-test/"
cp "$SCRIPT_DIR/workflows/qa-test/SKILL.md" "$CLAUDE_DIR/workflows/qa-test/" 2>/dev/null || true
cp "$SCRIPT_DIR/workflows/qa-test/steps-c/"* "$CLAUDE_DIR/workflows/qa-test/steps-c/"
cp "$SCRIPT_DIR/workflows/qa-test/data/"* "$CLAUDE_DIR/workflows/qa-test/data/"
cp "$SCRIPT_DIR/workflows/qa-test/scripts/"*.py "$CLAUDE_DIR/workflows/qa-test/scripts/"
cp "$SCRIPT_DIR/workflows/qa-test/scripts/tests/"*.py "$CLAUDE_DIR/workflows/qa-test/scripts/tests/"
echo "  - qa-test (workflow.md + SKILL.md + 5 step files + 2 data templates + 2 scripts + tests)"

# review-checklist
mkdir -p "$CLAUDE_DIR/workflows/review-checklist/steps-c"
mkdir -p "$CLAUDE_DIR/workflows/review-checklist/steps-e"
mkdir -p "$CLAUDE_DIR/workflows/review-checklist/steps-v"
mkdir -p "$CLAUDE_DIR/workflows/review-checklist/data"
cp "$SCRIPT_DIR/workflows/review-checklist/workflow.md" "$CLAUDE_DIR/workflows/review-checklist/"
cp "$SCRIPT_DIR/workflows/review-checklist/steps-c/"* "$CLAUDE_DIR/workflows/review-checklist/steps-c/"
cp "$SCRIPT_DIR/workflows/review-checklist/steps-e/"* "$CLAUDE_DIR/workflows/review-checklist/steps-e/"
cp "$SCRIPT_DIR/workflows/review-checklist/steps-v/"* "$CLAUDE_DIR/workflows/review-checklist/steps-v/"
cp "$SCRIPT_DIR/workflows/review-checklist/data/"* "$CLAUDE_DIR/workflows/review-checklist/data/"
echo "  - review-checklist (workflow.md + 10 step files + 2 data files)"

# 3. Install commands
echo "[3/3] Installing global commands..."
mkdir -p "$CLAUDE_DIR/commands"
cp "$SCRIPT_DIR/commands/bmad-grr-dev-story.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-code-review.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-review-checklist.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-bug-hunt.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-set-worktree.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-pr-create.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-refine-story.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-quick-story.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-design-pass.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-qa-test.md" "$CLAUDE_DIR/commands/"
echo "  - /bmad-grr-dev-story command"
echo "  - /bmad-grr-code-review command"
echo "  - /bmad-grr-review-checklist command"
echo "  - /bmad-grr-bug-hunt command"
echo "  - /bmad-grr-set-worktree command"
echo "  - /bmad-grr-pr-create command"
echo "  - /bmad-grr-refine-story command"
echo "  - /bmad-grr-quick-story command"
echo "  - /bmad-grr-design-pass command"
echo "  - /bmad-grr-qa-test command"

echo ""
echo "=== Installation Complete! ==="
echo ""
echo "Available commands:"
echo "  /bmad-grr-dev-story          - BDD-based ATDD outer loop + TDD inner loop story implementation"
echo "  /bmad-grr-code-review        - Checklist-based code review"
echo "  /bmad-grr-review-checklist   - Generate / edit / validate code review checklists"
echo "  /bmad-grr-bug-hunt           - Systematic debugging with escalation levels"
echo "  /bmad-grr-set-worktree       - Multi-repo monorepo-style workspace setup (workspace root stays non-git)"
echo "  /bmad-grr-pr-create          - PR lifecycle management with split, merge tracking, and post-edit re-push"
echo "  /bmad-grr-refine-story       - Story refinement after dev-story / QA / improvement requests"
echo "  /bmad-grr-quick-story        - Lightweight pre-dev story (mini PRD + architecture + tasks) from zero"
echo "  /bmad-grr-design-pass        - LLM-judgment UI/UX pass (pre-dev story enhance OR live screen audit)"
echo "  /bmad-grr-qa-test            - Story/Epic-based browser QA via Chrome DevTools MCP"
echo ""
echo "For PRD / Architecture / Epics / Story creation, use upstream BMAD workflows:"
echo "  /bmad-create-prd"
echo "  /bmad-create-architecture"
echo "  /bmad-create-epics-and-stories"
echo "  /bmad-create-story"
echo ""
echo "Requirement: Project must have BMAD Method installed (config.yaml required)."
