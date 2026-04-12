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
echo "  - qa-test (workflow.md + SKILL.md + 6 step files + 2 data templates + 2 scripts + tests)"

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

# create-prd (grr-enhanced fork of bmad-create-prd)
mkdir -p "$CLAUDE_DIR/workflows/create-prd/steps-c"
mkdir -p "$CLAUDE_DIR/workflows/create-prd/data"
mkdir -p "$CLAUDE_DIR/workflows/create-prd/templates"
cp "$SCRIPT_DIR/workflows/create-prd/workflow.md" "$CLAUDE_DIR/workflows/create-prd/"
cp "$SCRIPT_DIR/workflows/create-prd/SKILL.md" "$CLAUDE_DIR/workflows/create-prd/" 2>/dev/null || true
cp "$SCRIPT_DIR/workflows/create-prd/steps-c/"* "$CLAUDE_DIR/workflows/create-prd/steps-c/"
cp "$SCRIPT_DIR/workflows/create-prd/data/"* "$CLAUDE_DIR/workflows/create-prd/data/"
cp "$SCRIPT_DIR/workflows/create-prd/templates/"* "$CLAUDE_DIR/workflows/create-prd/templates/"
echo "  - create-prd (workflow.md + 15 step files + data + prd-template — grr-enhanced fork of bmad-create-prd)"

# create-architecture (grr-enhanced fork of bmad-create-architecture)
mkdir -p "$CLAUDE_DIR/workflows/create-architecture/steps"
mkdir -p "$CLAUDE_DIR/workflows/create-architecture/data"
cp "$SCRIPT_DIR/workflows/create-architecture/workflow.md" "$CLAUDE_DIR/workflows/create-architecture/"
cp "$SCRIPT_DIR/workflows/create-architecture/SKILL.md" "$CLAUDE_DIR/workflows/create-architecture/" 2>/dev/null || true
cp "$SCRIPT_DIR/workflows/create-architecture/architecture-decision-template.md" "$CLAUDE_DIR/workflows/create-architecture/"
cp "$SCRIPT_DIR/workflows/create-architecture/steps/"* "$CLAUDE_DIR/workflows/create-architecture/steps/"
cp "$SCRIPT_DIR/workflows/create-architecture/data/"* "$CLAUDE_DIR/workflows/create-architecture/data/"
echo "  - create-architecture (workflow.md + 9 step files + data + architecture-decision-template — grr-enhanced fork)"

# create-epics-and-stories (grr-enhanced fork of bmad-create-epics-and-stories)
mkdir -p "$CLAUDE_DIR/workflows/create-epics-and-stories/steps"
mkdir -p "$CLAUDE_DIR/workflows/create-epics-and-stories/templates"
cp "$SCRIPT_DIR/workflows/create-epics-and-stories/workflow.md" "$CLAUDE_DIR/workflows/create-epics-and-stories/"
cp "$SCRIPT_DIR/workflows/create-epics-and-stories/SKILL.md" "$CLAUDE_DIR/workflows/create-epics-and-stories/" 2>/dev/null || true
cp "$SCRIPT_DIR/workflows/create-epics-and-stories/steps/"* "$CLAUDE_DIR/workflows/create-epics-and-stories/steps/"
cp "$SCRIPT_DIR/workflows/create-epics-and-stories/templates/"* "$CLAUDE_DIR/workflows/create-epics-and-stories/templates/"
echo "  - create-epics-and-stories (workflow.md + 4 step files + epics-template — grr-enhanced fork)"

# create-story (grr-enhanced fork of bmad-create-story — XML workflow)
mkdir -p "$CLAUDE_DIR/workflows/create-story"
cp "$SCRIPT_DIR/workflows/create-story/workflow.md" "$CLAUDE_DIR/workflows/create-story/"
cp "$SCRIPT_DIR/workflows/create-story/SKILL.md" "$CLAUDE_DIR/workflows/create-story/" 2>/dev/null || true
cp "$SCRIPT_DIR/workflows/create-story/template.md" "$CLAUDE_DIR/workflows/create-story/"
cp "$SCRIPT_DIR/workflows/create-story/checklist.md" "$CLAUDE_DIR/workflows/create-story/"
cp "$SCRIPT_DIR/workflows/create-story/discover-inputs.md" "$CLAUDE_DIR/workflows/create-story/"
echo "  - create-story (XML workflow.md + template + checklist + discover-inputs — grr-enhanced fork)"

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
cp "$SCRIPT_DIR/commands/bmad-grr-create-prd.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-create-architecture.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-create-epics-and-stories.md" "$CLAUDE_DIR/commands/"
cp "$SCRIPT_DIR/commands/bmad-grr-create-story.md" "$CLAUDE_DIR/commands/"
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
echo "  - /bmad-grr-create-prd command"
echo "  - /bmad-grr-create-architecture command"
echo "  - /bmad-grr-create-epics-and-stories command"
echo "  - /bmad-grr-create-story command"

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
echo "  /bmad-grr-quick-story        - Lightweight pre-dev story (mini PRD + architecture + tasks)"
echo "  /bmad-grr-design-pass        - LLM-judgment UI/UX pass (pre-dev enhance OR live-fix audit)"
echo "  /bmad-grr-qa-test            - Story/Epic-based web QA testing with Chrome DevTools"
echo ""
echo "grr-enhanced forks of bmad planning workflows (with gstack + superpowers integration):"
echo "  /bmad-grr-create-prd                - 12-step PRD creation (ceo-review + office-hours + autoplan)"
echo "  /bmad-grr-create-architecture       - 8-step architecture (eng-review + cso + systematic-debugging + autoplan)"
echo "  /bmad-grr-create-epics-and-stories  - 4-step epic/story breakdown (ceo+eng review + parallel-agents + TDD + autoplan)"
echo "  /bmad-grr-create-story              - XML workflow for story creation (learn + eng-review + TDD + conditional UX/security)"
echo ""
echo "Requirement: Project must have BMAD Method installed (config.yaml required)"
