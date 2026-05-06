#!/bin/bash
# install-customizations.sh — Install grr ouroboros customizations into a BMad project.
#
# Usage:
#   ./install-customizations.sh                    # installs into $(pwd)
#   ./install-customizations.sh /path/to/project   # installs into specified project
#
# The customizations are per-project because BMad's resolve_customization.py
# only merges from {project-root}/_bmad/custom/. Running install.sh installs
# the global workflows/skills/commands; running THIS script wires the
# ouroboros gate into a specific project's BMad workflows.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="${1:-$(pwd)}"
PROJECT="$(cd "$PROJECT" && pwd)"  # absolute

echo "=== grr Customizations Installer ==="
echo ""
echo "Source:  $SCRIPT_DIR/customizations"
echo "Target:  $PROJECT/_bmad/custom"
echo ""

# Sanity check: target must look like a BMad project
if [ ! -d "$PROJECT/_bmad" ]; then
  echo "Error: $PROJECT does not look like a BMad project." >&2
  echo "       Expected $PROJECT/_bmad/ to exist." >&2
  echo "       Initialize BMad first, then re-run this script." >&2
  exit 1
fi

if [ ! -d "$SCRIPT_DIR/customizations" ]; then
  echo "Error: $SCRIPT_DIR/customizations not found." >&2
  echo "       Run this script from the bmad-grr repo." >&2
  exit 1
fi

mkdir -p "$PROJECT/_bmad/custom"

installed=0
skipped=0

for toml in "$SCRIPT_DIR/customizations/"*.toml; do
  [ -f "$toml" ] || continue
  name=$(basename "$toml")
  target="$PROJECT/_bmad/custom/$name"

  if [ -f "$target" ]; then
    echo "  - Skipped (exists): $name"
    skipped=$((skipped + 1))
  else
    cp "$toml" "$target"
    echo "  - Installed: $name"
    installed=$((installed + 1))
  fi
done

echo ""
echo "=== Summary ==="
echo "  Installed: $installed"
echo "  Skipped:   $skipped (already present)"
echo ""
echo "=== Next steps ==="
echo ""
echo "1. Install the Ouroboros plugin (if not already):"
echo "     claude plugin marketplace add Q00/ouroboros"
echo "     claude plugin install ouroboros@ouroboros"
echo "   Requires Python >= 3.12 and uvx."
echo ""
echo "2. Restart your Claude Code session (so the plugin's MCP server registers)."
echo ""
echo "3. The next time you run /bmad-create-prd, /bmad-create-architecture,"
echo "   /bmad-create-epics-and-stories, or /bmad-create-story in this project,"
echo "   the ouroboros gate will activate automatically."
echo ""
echo "To opt out of a specific workflow's gate later:"
echo "     rm $PROJECT/_bmad/custom/<workflow>.toml"
echo ""
