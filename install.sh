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
echo "[0/4] Cleaning up deprecated grr-fork workflows (if present)..."
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

# 1. Install skills (11 superpowers from obra/superpowers + 1 grr-original skill)
echo "[1/4] Installing global skills..."

# Superpowers — synced from obra/superpowers v5.1.0
mkdir -p "$CLAUDE_DIR/skills/test-driven-development"
mkdir -p "$CLAUDE_DIR/skills/systematic-debugging"
mkdir -p "$CLAUDE_DIR/skills/dispatching-parallel-agents"
mkdir -p "$CLAUDE_DIR/skills/verification-before-completion"
mkdir -p "$CLAUDE_DIR/skills/subagent-driven-development"
mkdir -p "$CLAUDE_DIR/skills/finishing-a-development-branch"
mkdir -p "$CLAUDE_DIR/skills/using-git-worktrees"
mkdir -p "$CLAUDE_DIR/skills/requesting-code-review"
mkdir -p "$CLAUDE_DIR/skills/receiving-code-review"
mkdir -p "$CLAUDE_DIR/skills/writing-plans"
mkdir -p "$CLAUDE_DIR/skills/executing-plans"

# grr-original skill
mkdir -p "$CLAUDE_DIR/skills/grr-spec-validate"

cp "$SCRIPT_DIR/skills/test-driven-development/"* "$CLAUDE_DIR/skills/test-driven-development/"
cp "$SCRIPT_DIR/skills/systematic-debugging/"* "$CLAUDE_DIR/skills/systematic-debugging/"
cp "$SCRIPT_DIR/skills/dispatching-parallel-agents/"* "$CLAUDE_DIR/skills/dispatching-parallel-agents/"
cp "$SCRIPT_DIR/skills/verification-before-completion/"* "$CLAUDE_DIR/skills/verification-before-completion/"
cp "$SCRIPT_DIR/skills/subagent-driven-development/"* "$CLAUDE_DIR/skills/subagent-driven-development/"
cp "$SCRIPT_DIR/skills/finishing-a-development-branch/"* "$CLAUDE_DIR/skills/finishing-a-development-branch/"
cp "$SCRIPT_DIR/skills/using-git-worktrees/"* "$CLAUDE_DIR/skills/using-git-worktrees/"
cp "$SCRIPT_DIR/skills/requesting-code-review/"* "$CLAUDE_DIR/skills/requesting-code-review/"
cp "$SCRIPT_DIR/skills/receiving-code-review/"* "$CLAUDE_DIR/skills/receiving-code-review/"
cp "$SCRIPT_DIR/skills/writing-plans/"* "$CLAUDE_DIR/skills/writing-plans/"
cp "$SCRIPT_DIR/skills/executing-plans/"* "$CLAUDE_DIR/skills/executing-plans/"
cp "$SCRIPT_DIR/skills/grr-spec-validate/"* "$CLAUDE_DIR/skills/grr-spec-validate/"
echo "  - test-driven-development (SKILL.md + testing-anti-patterns.md)"
echo "  - systematic-debugging (SKILL.md + 3 reference files)"
echo "  - dispatching-parallel-agents (SKILL.md)"
echo "  - verification-before-completion (SKILL.md)"
echo "  - subagent-driven-development (SKILL.md + 3 prompt templates)"
echo "  - finishing-a-development-branch (SKILL.md)"
echo "  - using-git-worktrees (SKILL.md)"
echo "  - requesting-code-review (SKILL.md + code-reviewer template)"
echo "  - receiving-code-review (SKILL.md)"
echo "  - writing-plans (SKILL.md + plan-document-reviewer-prompt.md)"
echo "  - executing-plans (SKILL.md)"
echo "  - grr-spec-validate (SKILL.md + 4 rubric files + invocation-template) [grr-original]"

# 2. Install workflows
echo "[2/4] Installing workflows..."

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
echo "[3/4] Installing global commands..."
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
cp "$SCRIPT_DIR/commands/bmad-grr-customize.md" "$CLAUDE_DIR/commands/"
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
echo "  - /bmad-grr-customize command"

# 4. Install hooks (opt-in — files installed, settings.json NOT auto-modified)
echo "[4/4] Installing hooks..."
mkdir -p "$CLAUDE_DIR/hooks/grr"
cp "$SCRIPT_DIR/hooks/"*.py "$CLAUDE_DIR/hooks/grr/"
cp "$SCRIPT_DIR/hooks/README.md" "$CLAUDE_DIR/hooks/grr/" 2>/dev/null || true
echo "  - pretool-file-size.py        (block edits to files ≥ 500 lines)"
echo "  - pretool-bash-safety.py      (block rm -rf / sudo / chmod 777 / etc.)"
echo "  - posttool-format.py          (run prettier + eslint after Edit/Write)"
echo "  - stop-test-gate.py           (block Stop while .grr/tests-failing marker exists)"
echo "  - README.md                   (per-hook docs + env var overrides)"

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
echo "  /bmad-grr-customize          - Apply grr-spec-validate gate to a BMAD project (per-project)"
echo ""
echo "For PRD / Architecture / Epics / Story creation, use upstream BMAD workflows:"
echo "  /bmad-create-prd"
echo "  /bmad-create-architecture"
echo "  /bmad-create-epics-and-stories"
echo "  /bmad-create-story"
echo ""
echo "Requirement: Project must have BMAD Method installed (config.yaml required)."
echo ""
echo "=== Optional: grr-spec-validate gate for upstream BMAD create-* workflows ==="
echo ""
echo "grr ships customizations that gate the four upstream BMAD create-* workflows"
echo "with grr-spec-validate — sub-agent-dispatched, four-rubric spec validator."
echo "No external plugin required."
echo ""
echo "To enable in a BMAD project, run /bmad-grr-customize from inside that project,"
echo "or: bash install-customizations.sh /path/to/your/bmad-project"
echo ""
echo "=== Optional: grr hooks (~/.claude/hooks/grr/) ==="
echo ""
echo "Hook scripts are installed but settings.json is NOT auto-modified — paste the"
echo "snippet below into ~/.claude/settings.json to activate. See ~/.claude/hooks/grr/README.md"
echo "for per-hook details and env-var overrides."
echo ""
cat <<'HOOKSNIPPET'
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "python3 ~/.claude/hooks/grr/pretool-file-size.py" }] },
      { "matcher": "Bash",       "hooks": [{ "type": "command", "command": "python3 ~/.claude/hooks/grr/pretool-bash-safety.py" }] }
    ],
    "PostToolUse": [
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "command": "python3 ~/.claude/hooks/grr/posttool-format.py" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "python3 ~/.claude/hooks/grr/stop-test-gate.py" }] }
    ]
  }
}
HOOKSNIPPET
echo ""
echo "Windows: use 'python' instead of 'python3' if python3 is not on PATH."
