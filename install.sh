#!/bin/bash
# install.sh — Install bmad-grr globally for Claude Code.
#
# Usage:
#   bash install.sh                       # global install only
#   bash install.sh <project-path>        # global + apply customizations to that BMAD project
#   bash install.sh .                     # global + apply customizations to current dir
#   bash install.sh [--force] <project>   # also overwrite existing project customizations
#
# Global install is CLEAN — grr-managed folders under ~/.claude/ are wiped and
# re-created from this repo on every run. User's other skills / workflows /
# commands are NOT touched.
#
# Global CLAUDE.md (Karpathy 4 principles) is installed at ~/.claude/CLAUDE.md.
# If an existing CLAUDE.md is found, install.sh prompts to Replace / Append /
# Skip. In non-interactive shells (no TTY), it skips and prints manual commands.
#
# Project customizations preserve existing _bmad/custom/*.toml files unless
# --force is passed.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

# --- Arg parsing -------------------------------------------------------------

FORCE=0
PROJECT=""
while [ $# -gt 0 ]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    -h|--help)
      sed -n '2,18p' "$0"  # print the usage block
      exit 0
      ;;
    *)
      if [ -n "$PROJECT" ]; then
        echo "Error: unexpected extra argument: $1" >&2
        exit 1
      fi
      PROJECT="$1"
      shift
      ;;
  esac
done

if [ -n "$PROJECT" ]; then
  PROJECT="$(cd "$PROJECT" && pwd)"  # absolutize
fi

echo "=== GRR (Guardrails for Reliable Releases) Installer ==="
echo ""
echo "Global target:  $CLAUDE_DIR"
[ -n "$PROJECT" ] && echo "Project target: $PROJECT (customizations)"
[ "$FORCE" = "1" ] && echo "Mode:           --force (overwrite existing project customizations)"
echo ""

# --- Lists of grr-managed assets --------------------------------------------

SKILLS=(
  test-driven-development
  systematic-debugging
  dispatching-parallel-agents
  verification-before-completion
  subagent-driven-development
  finishing-a-development-branch
  using-git-worktrees
  requesting-code-review
  receiving-code-review
  writing-plans
  executing-plans
  grr-spec-validate
)

WORKFLOWS=(
  dev-story
  code-review
  bug-hunt
  set-worktree
  pr-create
  refine-story
  quick-story
  design-pass
  qa-test
  review-checklist
)

COMMANDS=(
  bmad-grr-dev-story
  bmad-grr-code-review
  bmad-grr-review-checklist
  bmad-grr-bug-hunt
  bmad-grr-set-worktree
  bmad-grr-pr-create
  bmad-grr-refine-story
  bmad-grr-quick-story
  bmad-grr-design-pass
  bmad-grr-qa-test
  bmad-grr-customize
)

# --- [0/6] Cleanup deprecated forks ------------------------------------------

echo "[0/6] Cleaning up deprecated grr-fork workflows (if present)..."
rm -rf "$CLAUDE_DIR/workflows/create-prd"
rm -rf "$CLAUDE_DIR/workflows/create-architecture"
rm -rf "$CLAUDE_DIR/workflows/create-epics-and-stories"
rm -rf "$CLAUDE_DIR/workflows/create-story"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-prd.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-architecture.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-epics-and-stories.md"
rm -f "$CLAUDE_DIR/commands/bmad-grr-create-story.md"
echo "  - removed deprecated forks (if any). Use upstream BMAD /bmad-create-* for those flows."

# --- [1/6] Skills (clean reinstall) -----------------------------------------

echo "[1/6] Installing global skills (clean reinstall — wipes each grr skill folder first)..."
for s in "${SKILLS[@]}"; do
  rm -rf "$CLAUDE_DIR/skills/$s"
  mkdir -p "$CLAUDE_DIR/skills/$s"
  cp -r "$SCRIPT_DIR/skills/$s/"* "$CLAUDE_DIR/skills/$s/" 2>/dev/null || true
  echo "  - $s"
done

# --- [2/6] Workflows (clean reinstall) --------------------------------------

echo "[2/6] Installing workflows (clean reinstall — wipes each grr workflow folder first)..."
for w in "${WORKFLOWS[@]}"; do
  rm -rf "$CLAUDE_DIR/workflows/$w"
  mkdir -p "$CLAUDE_DIR/workflows/$w"
  cp -r "$SCRIPT_DIR/workflows/$w/"* "$CLAUDE_DIR/workflows/$w/" 2>/dev/null || true
  echo "  - $w"
done

# --- [3/6] Commands (clean reinstall of each grr command file) --------------

echo "[3/6] Installing global commands..."
for c in "${COMMANDS[@]}"; do
  rm -f "$CLAUDE_DIR/commands/$c.md"
  cp "$SCRIPT_DIR/commands/$c.md" "$CLAUDE_DIR/commands/"
  echo "  - /$c"
done

# --- [4/6] Hooks (clean reinstall) ------------------------------------------

echo "[4/6] Installing hooks (clean reinstall of ~/.claude/hooks/grr/)..."
rm -rf "$CLAUDE_DIR/hooks/grr"
mkdir -p "$CLAUDE_DIR/hooks/grr"
cp "$SCRIPT_DIR/hooks/"*.py "$CLAUDE_DIR/hooks/grr/"
cp "$SCRIPT_DIR/hooks/README.md" "$CLAUDE_DIR/hooks/grr/" 2>/dev/null || true
echo "  - pretool-file-size.py        (block edits to files ≥ 500 lines)"
echo "  - pretool-bash-safety.py      (block rm -rf / sudo / chmod 777 / etc.)"
echo "  - posttool-format.py          (run prettier + eslint after Edit/Write)"
echo "  - stop-test-gate.py           (block Stop while .grr/tests-failing marker exists)"
echo "  - README.md                   (per-hook docs + env-var overrides)"

# --- [5/6] Global CLAUDE.md (Karpathy 4 principles) -------------------------

GLOBAL_CLAUDE_MD="$CLAUDE_DIR/CLAUDE.md"
SOURCE_CLAUDE_MD="$SCRIPT_DIR/data/global-CLAUDE.md"

echo "[5/6] Installing global CLAUDE.md (Karpathy 4 principles)..."

if [ ! -f "$SOURCE_CLAUDE_MD" ]; then
  echo "  Warning: $SOURCE_CLAUDE_MD missing — skipping."
elif [ -f "$GLOBAL_CLAUDE_MD" ]; then
  existing_lines=$(wc -l < "$GLOBAL_CLAUDE_MD")
  echo ""
  echo "  Existing ~/.claude/CLAUDE.md found ($existing_lines lines). Preview:"
  echo "  ------------------------------------------------------------"
  head -20 "$GLOBAL_CLAUDE_MD" | sed 's/^/  | /'
  if [ "$existing_lines" -gt 20 ]; then
    echo "  | ..."
  fi
  echo "  ------------------------------------------------------------"
  echo ""
  if [ -t 0 ]; then
    echo "  Options:"
    echo "    [R] Replace existing with grr's Karpathy 4 principles"
    echo "    [A] Append grr's Karpathy 4 principles to existing"
    echo "    [S] Skip (keep existing as-is)"
    printf "  Choose [R/A/S] (default: S): "
    read -r choice
    case "$choice" in
      R|r)
        cp "$SOURCE_CLAUDE_MD" "$GLOBAL_CLAUDE_MD"
        echo "  - Replaced"
        ;;
      A|a)
        printf "\n---\n\n" >> "$GLOBAL_CLAUDE_MD"
        cat "$SOURCE_CLAUDE_MD" >> "$GLOBAL_CLAUDE_MD"
        echo "  - Appended (separated by ---)"
        ;;
      *)
        echo "  - Skipped"
        ;;
    esac
  else
    echo "  Skipping (non-interactive shell — cannot prompt)."
    echo "  To install manually:"
    echo "    cp '$SOURCE_CLAUDE_MD' '$GLOBAL_CLAUDE_MD'           # replace"
    echo "    cat '$SOURCE_CLAUDE_MD' >> '$GLOBAL_CLAUDE_MD'       # append"
  fi
else
  cp "$SOURCE_CLAUDE_MD" "$GLOBAL_CLAUDE_MD"
  echo "  - Installed: $GLOBAL_CLAUDE_MD"
fi

# --- [6/6] Project customizations (optional) --------------------------------

if [ -n "$PROJECT" ]; then
  echo "[6/6] Applying customizations to project: $PROJECT"
  if [ "$FORCE" = "1" ]; then
    bash "$SCRIPT_DIR/install-customizations.sh" --force "$PROJECT"
  else
    bash "$SCRIPT_DIR/install-customizations.sh" "$PROJECT"
  fi
else
  echo "[6/6] Skipping project customizations (no project path passed)."
  echo "      To apply the grr-spec-validate gate to a BMAD project later, run:"
  echo "        bash $SCRIPT_DIR/install.sh /path/to/your/bmad-project"
  echo "      or, from inside Claude Code in that project:"
  echo "        /bmad-grr-customize"
fi

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
echo "=== Optional: grr hooks (~/.claude/hooks/grr/) ==="
echo ""
echo "Hook scripts are installed but ~/.claude/settings.json is NOT auto-modified — paste the"
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
