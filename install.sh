#!/bin/bash
# install.sh - Install GRR workflows, skills, and commands globally for Claude Code

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

echo "=== GRR (Guardrails for Reliable Releases) Installer ==="
echo ""

# 1. Install skills
echo "[1/3] Installing global skills..."
mkdir -p "$CLAUDE_DIR/skills/test-driven-development"
mkdir -p "$CLAUDE_DIR/skills/systematic-debugging"
mkdir -p "$CLAUDE_DIR/skills/dispatching-parallel-agents"

cp "$SCRIPT_DIR/skills/test-driven-development/"* "$CLAUDE_DIR/skills/test-driven-development/"
cp "$SCRIPT_DIR/skills/systematic-debugging/"* "$CLAUDE_DIR/skills/systematic-debugging/"
cp "$SCRIPT_DIR/skills/dispatching-parallel-agents/"* "$CLAUDE_DIR/skills/dispatching-parallel-agents/"
echo "  - test-driven-development (SKILL.md + testing-anti-patterns.md)"
echo "  - systematic-debugging (SKILL.md + 3 reference files)"
echo "  - dispatching-parallel-agents (SKILL.md)"

# 2. Install workflows
echo "[2/3] Installing workflows..."

# dev-story
mkdir -p "$CLAUDE_DIR/workflows/dev-story/steps-c"
mkdir -p "$CLAUDE_DIR/workflows/dev-story/data"
cp "$SCRIPT_DIR/workflows/dev-story/workflow.md" "$CLAUDE_DIR/workflows/dev-story/"
cp "$SCRIPT_DIR/workflows/dev-story/steps-c/"* "$CLAUDE_DIR/workflows/dev-story/steps-c/"
cp "$SCRIPT_DIR/workflows/dev-story/data/"* "$CLAUDE_DIR/workflows/dev-story/data/"
echo "  - dev-story (workflow.md + 8 step files + checklist)"

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
echo "  - bug-hunt (workflow.md + 8 step files + bug-report template)"

# set-worktree
mkdir -p "$CLAUDE_DIR/workflows/set-worktree/steps-c"
cp "$SCRIPT_DIR/workflows/set-worktree/workflow.md" "$CLAUDE_DIR/workflows/set-worktree/"
cp "$SCRIPT_DIR/workflows/set-worktree/steps-c/"* "$CLAUDE_DIR/workflows/set-worktree/steps-c/"
echo "  - set-worktree (workflow.md + 3 step files)"

# pr-create
mkdir -p "$CLAUDE_DIR/workflows/pr-create/steps-c"
cp "$SCRIPT_DIR/workflows/pr-create/workflow.md" "$CLAUDE_DIR/workflows/pr-create/"
cp "$SCRIPT_DIR/workflows/pr-create/steps-c/"* "$CLAUDE_DIR/workflows/pr-create/steps-c/"
echo "  - pr-create (workflow.md + 7 step files)"

# refine-story
mkdir -p "$CLAUDE_DIR/workflows/refine-story/steps-c"
cp "$SCRIPT_DIR/workflows/refine-story/workflow.md" "$CLAUDE_DIR/workflows/refine-story/"
cp "$SCRIPT_DIR/workflows/refine-story/steps-c/"* "$CLAUDE_DIR/workflows/refine-story/steps-c/"
echo "  - refine-story (workflow.md + 5 step files)"

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
echo "  - /bmad-grr-dev-story command"
echo "  - /bmad-grr-code-review command"
echo "  - /bmad-grr-review-checklist command"
echo "  - /bmad-grr-bug-hunt command"
echo "  - /bmad-grr-set-worktree command"
echo "  - /bmad-grr-pr-create command"
echo "  - /bmad-grr-refine-story command"

echo ""
echo "=== Installation Complete! ==="
echo ""
echo "Available commands in any BMAD project:"
echo "  /bmad-grr-dev-story          - TDD + parallel agent story implementation"
echo "  /bmad-grr-code-review        - Checklist-based code review"
echo "  /bmad-grr-review-checklist   - Generate/edit/validate code review checklists"
echo "  /bmad-grr-bug-hunt           - Systematic debugging with escalation levels"
echo "  /bmad-grr-set-worktree       - Multi-repo worktree workspace setup"
echo "  /bmad-grr-pr-create          - PR lifecycle management with split & merge tracking"
echo "  /bmad-grr-refine-story       - Story refinement after dev-story with dev-story chaining"
echo ""
echo "Requirement: Project must have BMAD Method installed (config.yaml required)"
