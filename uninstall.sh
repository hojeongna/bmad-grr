#!/bin/bash
# uninstall.sh - Remove GRR workflows, skills, and commands from Claude Code

set -e

CLAUDE_DIR="$HOME/.claude"

echo "=== GRR (Guardrails for Reliable Releases) Uninstaller ==="
echo ""
echo "This will remove the following from $CLAUDE_DIR:"
echo "  - Skills: test-driven-development, systematic-debugging, dispatching-parallel-agents"
echo "  - Workflows: dev-story, code-review, review-checklist, bug-hunt, set-worktree, pr-create,"
echo "               refine-story, quick-story, design-pass, qa-test,"
echo "               create-prd, create-architecture, create-epics-and-stories, create-story"
echo "  - Commands: all bmad-grr-* commands"
echo ""
read -p "Are you sure? (y/N): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Cancelled."
  exit 0
fi

echo ""

# 1. Remove skills
echo "[1/3] Removing skills..."
rm -rf "$CLAUDE_DIR/skills/test-driven-development"
rm -rf "$CLAUDE_DIR/skills/systematic-debugging"
rm -rf "$CLAUDE_DIR/skills/dispatching-parallel-agents"
echo "  - test-driven-development removed"
echo "  - systematic-debugging removed"
echo "  - dispatching-parallel-agents removed"

# 2. Remove workflows
echo "[2/3] Removing workflows..."
rm -rf "$CLAUDE_DIR/workflows/dev-story"
rm -rf "$CLAUDE_DIR/workflows/code-review"
rm -rf "$CLAUDE_DIR/workflows/review-checklist"
rm -rf "$CLAUDE_DIR/workflows/bug-hunt"
rm -rf "$CLAUDE_DIR/workflows/set-worktree"
rm -rf "$CLAUDE_DIR/workflows/pr-create"
rm -rf "$CLAUDE_DIR/workflows/refine-story"
rm -rf "$CLAUDE_DIR/workflows/quick-story"
rm -rf "$CLAUDE_DIR/workflows/design-pass"
rm -rf "$CLAUDE_DIR/workflows/qa-test"
rm -rf "$CLAUDE_DIR/workflows/create-prd"
rm -rf "$CLAUDE_DIR/workflows/create-architecture"
rm -rf "$CLAUDE_DIR/workflows/create-epics-and-stories"
rm -rf "$CLAUDE_DIR/workflows/create-story"
echo "  - dev-story removed"
echo "  - code-review removed"
echo "  - review-checklist removed"
echo "  - bug-hunt removed"
echo "  - set-worktree removed"
echo "  - pr-create removed"
echo "  - refine-story removed"
echo "  - quick-story removed"
echo "  - design-pass removed"
echo "  - qa-test removed"
echo "  - create-prd removed"
echo "  - create-architecture removed"
echo "  - create-epics-and-stories removed"
echo "  - create-story removed"

# 3. Remove commands
echo "[3/3] Removing commands..."
rm -f "$CLAUDE_DIR/commands/bmad-grr-dev-story.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-code-review.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-review-checklist.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-bug-hunt.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-set-worktree.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-pr-create.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-refine-story.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-quick-story.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-design-pass.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-qa-test.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-prd.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-architecture.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-epics-and-stories.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-story.md"
echo "  - All 14 bmad-grr-* commands removed"

echo ""
echo "=== Uninstall Complete ==="
echo ""
echo "GRR workflows have been removed."
echo "To reinstall, run: bash install.sh"
