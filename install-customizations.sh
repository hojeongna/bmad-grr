#!/bin/bash
# install-customizations.sh — install grr customizations into a BMAD project.
#
# Usage:
#   ./install-customizations.sh                    # installs into $(pwd)
#   ./install-customizations.sh /path/to/project   # installs into the given project
#   ./install-customizations.sh --force [path]     # overwrite existing tomls
#
# The customizations are per-project because BMAD's resolve_customization.py
# only merges from {project-root}/_bmad/custom/. Running install.sh installs
# the global workflows/skills/commands; running THIS script wires the
# grr-spec-validate gate into a specific project's BMAD workflows.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FORCE=0
if [ "$1" = "--force" ]; then
  FORCE=1
  shift
fi
PROJECT="${1:-$(pwd)}"
PROJECT="$(cd "$PROJECT" && pwd)"  # absolute

echo "=== grr Customizations Installer ==="
echo ""
echo "Source:  $SCRIPT_DIR/customizations"
echo "Target:  $PROJECT/_bmad/custom"
[ "$FORCE" = "1" ] && echo "Mode:    --force (existing files will be overwritten)"
echo ""

# Sanity check: target must look like a BMAD project
if [ ! -d "$PROJECT/_bmad" ]; then
  echo "Error: $PROJECT does not look like a BMAD project." >&2
  echo "       Expected $PROJECT/_bmad/ to exist." >&2
  echo "       Initialize BMAD first, then re-run this script." >&2
  exit 1
fi

if [ ! -d "$SCRIPT_DIR/customizations" ]; then
  echo "Error: $SCRIPT_DIR/customizations not found." >&2
  echo "       Run this script from the bmad-grr repo." >&2
  exit 1
fi

# Sanity check: grr-spec-validate skill must be installed globally
if [ ! -f "$HOME/.claude/skills/grr-spec-validate/SKILL.md" ]; then
  echo "Warning: ~/.claude/skills/grr-spec-validate/SKILL.md is missing." >&2
  echo "         The gated workflows will halt at pre-flight without it." >&2
  echo "         Run 'bash install.sh' from the bmad-grr repo first." >&2
  echo ""
fi

mkdir -p "$PROJECT/_bmad/custom"

installed=0
skipped=0
overwritten=0

for toml in "$SCRIPT_DIR/customizations/"*.toml; do
  [ -f "$toml" ] || continue
  name=$(basename "$toml")
  target="$PROJECT/_bmad/custom/$name"

  if [ -f "$target" ]; then
    if [ "$FORCE" = "1" ]; then
      cp "$toml" "$target"
      echo "  - Overwritten: $name"
      overwritten=$((overwritten + 1))
    else
      echo "  - Skipped (exists; use --force to overwrite): $name"
      skipped=$((skipped + 1))
    fi
  else
    cp "$toml" "$target"
    echo "  - Installed: $name"
    installed=$((installed + 1))
  fi
done

echo ""
echo "=== Summary ==="
echo "  Installed:   $installed"
echo "  Overwritten: $overwritten"
echo "  Skipped:     $skipped"
echo ""
echo "=== Next steps ==="
echo ""
echo "The next time you run /bmad-create-prd, /bmad-create-architecture,"
echo "/bmad-create-epics-and-stories, or /bmad-create-story in this project,"
echo "the grr-spec-validate gate will activate automatically."
echo ""
echo "To opt out of a specific workflow's gate later:"
echo "     rm $PROJECT/_bmad/custom/<workflow>.toml"
echo ""
