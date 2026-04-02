#!/bin/bash
# uninstall.sh - Remove GRR workflows, skills, and commands from Claude Code

set -e

CLAUDE_DIR="$HOME/.claude"

echo "=== GRR (Guardrails for Reliable Releases) Uninstaller ==="
echo ""
echo "This will remove the following from $CLAUDE_DIR:"
echo "  - Skills: test-driven-development, systematic-debugging, dispatching-parallel-agents"
echo "  - Workflows: dev-story, code-review, review-checklist, bug-hunt"
echo "  - Commands: bmad-grr-dev-story, bmad-grr-code-review, bmad-grr-review-checklist, bmad-grr-bug-hunt"
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
echo "  - dev-story removed"
echo "  - code-review removed"
echo "  - review-checklist removed"
echo "  - bug-hunt removed"

# 3. Remove commands
echo "[3/3] Removing commands..."
rm -f "$CLAUDE_DIR/commands/bmad-grr-dev-story.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-code-review.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-review-checklist.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-bug-hunt.md"
echo "  - bmad-grr-dev-story command removed"
echo "  - bmad-grr-code-review command removed"
echo "  - bmad-grr-review-checklist command removed"
echo "  - bmad-grr-bug-hunt command removed"

echo ""
echo "=== Uninstall Complete ==="
echo ""
echo "GRR workflows have been removed."
echo "To reinstall, run: bash install.sh"
