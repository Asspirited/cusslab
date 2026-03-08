#!/usr/bin/env bash
# append-section.sh — appends a markdown section to a named file
# Usage: bash .claude/scripts/append-section.sh <target-file> <section-file>
# Contract: specs/append-section.feature

TARGET="$1"
SECTION="$2"

if [ -z "$TARGET" ] || [ -z "$SECTION" ]; then
  echo "Usage: append-section.sh <target-file> <section-file>"
  exit 1
fi

if [ ! -f "$TARGET" ]; then
  echo "ERROR: target file not found: $TARGET"
  exit 1
fi

if [ ! -f "$SECTION" ]; then
  echo "ERROR: section file not found: $SECTION"
  exit 1
fi

cat "$SECTION" >> "$TARGET" && echo "OK: appended $SECTION to $TARGET"
