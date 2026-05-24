#!/bin/bash
# sync-superpowers.sh — pull skills from obra/superpowers upstream
#
# Usage:
#   bash sync-superpowers.sh                    # sync every skill present in BOTH grr and upstream
#   bash sync-superpowers.sh <skill> [<skill>]  # sync specific skills only
#
# Skills with the `grr-` prefix are grr-original and never touched.
# Run from the bmad-grr repo root. Requires git and a clean working tree.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
UPSTREAM_URL="https://github.com/obra/superpowers.git"
UPSTREAM_REF="v5.1.0"  # pinned to a known-good tag — bump deliberately after review
TEMP_DIR="$(mktemp -d -t superpowers-sync-XXXXXX 2>/dev/null || mktemp -d)"

trap 'rm -rf "$TEMP_DIR"' EXIT

echo "=== bmad-grr superpowers sync ==="
echo "Upstream: $UPSTREAM_URL @ $UPSTREAM_REF"
echo ""

# Refuse if working tree dirty — keeps commits clean
if ! git -C "$SCRIPT_DIR" diff --quiet; then
  echo "Error: working tree has uncommitted changes." >&2
  echo "       Commit or stash first, then re-run." >&2
  exit 1
fi

# Clone upstream at the pinned tag
echo "Cloning..."
git clone --depth 1 --branch "$UPSTREAM_REF" "$UPSTREAM_URL" "$TEMP_DIR" >/dev/null 2>&1 || {
  echo "Error: clone failed. The tag '$UPSTREAM_REF' may not exist anymore." >&2
  echo "       Check available tags: git ls-remote --tags $UPSTREAM_URL" >&2
  exit 1
}

# Decide which skills to sync
if [ "$#" -gt 0 ]; then
  SKILLS_TO_SYNC=("$@")
else
  SKILLS_TO_SYNC=()
  for skill_dir in "$SCRIPT_DIR/skills"/*/; do
    name=$(basename "$skill_dir")
    [[ "$name" == grr-* ]] && continue
    if [ -d "$TEMP_DIR/skills/$name" ]; then
      SKILLS_TO_SYNC+=("$name")
    fi
  done
fi

echo ""
echo "Syncing ${#SKILLS_TO_SYNC[@]} skill(s):"
for skill in "${SKILLS_TO_SYNC[@]}"; do
  if [[ "$skill" == grr-* ]]; then
    echo "  - $skill: skipped (grr-original; never synced from upstream)"
    continue
  fi
  if [ ! -d "$TEMP_DIR/skills/$skill" ]; then
    echo "  - $skill: NOT IN UPSTREAM, skipped"
    continue
  fi
  rm -rf "$SCRIPT_DIR/skills/$skill"
  cp -r "$TEMP_DIR/skills/$skill" "$SCRIPT_DIR/skills/"
  echo "  - $skill: synced"
done

echo ""
echo "=== git status (skills/) ==="
git -C "$SCRIPT_DIR" status --short skills/
echo ""
echo "Review the diff. If any skills were added or removed, also update install.sh + README."
echo "Then commit."
