#!/bin/sh

set -e

echo "🔍 Detecting changed apps..."

if [ -n "$(git diff --cached --name-only)" ]; then
  DIFF="git diff --cached --name-only"
elif git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
  DIFF="git diff HEAD~1 HEAD --name-only"
else
  echo "No previous commit, skipping tests"
  exit 0
fi

eval "$DIFF" | while IFS= read -r file; do
  case "$file" in
  apps/*/*/*)
    pkg=$(printf '%s\n' "$file" | awk -F/ '{print $1 "/" $2 "/" $3}')
    ;;
  apps/*/*)
    pkg=$(printf '%s\n' "$file" | awk -F/ '{print $1 "/" $2}')
    ;;
  *)
    continue
    ;;
  esac

  if [ -f "$pkg/package.json" ]; then
    echo "🧪 Running tests in $pkg"
    bun run --cwd "$pkg" test
  fi
done
