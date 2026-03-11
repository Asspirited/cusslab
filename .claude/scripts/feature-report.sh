#!/usr/bin/env bash
# Feature Activity Report — counts BL and WL entries by Feature: label
# Usage: bash .claude/scripts/feature-report.sh
# Exit 1 if required files not found.

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKLOG="$REPO_DIR/.claude/practices/backlog.md"
WASTELOG="$REPO_DIR/.claude/practices/waste-log.md"

if [[ ! -f "$BACKLOG" ]]; then
  echo "ERROR: backlog.md not found at $BACKLOG" >&2
  exit 1
fi
if [[ ! -f "$WASTELOG" ]]; then
  echo "ERROR: waste-log.md not found at $WASTELOG" >&2
  exit 1
fi

# ── Canonical feature labels ──────────────────────────────────────────────────
LABELS=(
  golf-adventure pub-navigator comedy-room sports-19th-hole
  darts cricket quntum-leeks boardroom play learn platform process
)

# ── Parse BL items ────────────────────────────────────────────────────────────
# Each BL item has: Status: OPEN or Status: CLOSED, and optionally Feature: label
# We track: current item number, current feature, current status, current session date

declare -A bl_open_count
declare -A bl_closed_count
declare -A bl_closed_latest

# Latest session date = highest date string found in Status: CLOSED lines
LATEST_DATE=""

while IFS= read -r line; do
  line="${line%$'\r'}"
  if [[ "$line" =~ ^###[[:space:]]BL-([0-9]+) ]]; then
    current_bl_feature="unlabelled"
    current_bl_status=""
    current_bl_date=""
  fi
  if [[ "$line" =~ ^-[[:space:]]Feature:[[:space:]](.+)$ ]]; then
    current_bl_feature="${BASH_REMATCH[1]// /}"
  fi
  if [[ "$line" =~ Status:[[:space:]]OPEN ]]; then
    current_bl_status="open"
  fi
  if [[ "$line" =~ Status:[[:space:]]CLOSED[[:space:]]—[[:space:]]([0-9]{4}-[0-9]{2}-[0-9]{2}) ]]; then
    current_bl_status="closed"
    current_bl_date="${BASH_REMATCH[1]}"
    [[ "$current_bl_date" > "$LATEST_DATE" ]] && LATEST_DATE="$current_bl_date"
  fi
  if [[ -z "$line" ]] && [[ -n "$current_bl_status" ]]; then
    if [[ "$current_bl_status" == "open" ]]; then
      bl_open_count["$current_bl_feature"]=$(( ${bl_open_count["$current_bl_feature"]:-0} + 1 ))
    elif [[ "$current_bl_status" == "closed" ]]; then
      bl_closed_count["$current_bl_feature"]=$(( ${bl_closed_count["$current_bl_feature"]:-0} + 1 ))
      if [[ "$current_bl_date" == "$LATEST_DATE" ]] && [[ -n "$LATEST_DATE" ]]; then
        bl_closed_latest["$current_bl_feature"]=$(( ${bl_closed_latest["$current_bl_feature"]:-0} + 1 ))
      fi
    fi
    current_bl_status=""
    current_bl_date=""
  fi
done < "$BACKLOG"

# ── Parse WL items ────────────────────────────────────────────────────────────
declare -A wl_total_count
declare -A wl_open_count
declare -A wl_new_latest

while IFS= read -r line; do
  line="${line%$'\r'}"
  if [[ "$line" =~ ^##[[:space:]]WL- ]]; then
    current_wl_feature="unlabelled"
    current_wl_status=""
    current_wl_date=""
  fi
  if [[ "$line" =~ \*\*Feature:\*\*[[:space:]](.+)$ ]] || [[ "$line" =~ ^-[[:space:]]Feature:[[:space:]](.+)$ ]]; then
    current_wl_feature="${BASH_REMATCH[1]// /}"
  fi
  if [[ "$line" =~ [Ss]ession.*([0-9]{4}-[0-9]{2}-[0-9]{2}) ]]; then
    current_wl_date="${BASH_REMATCH[1]}"
  fi
  if [[ "$line" =~ [Ss]tatus.*[Oo]pen ]] && [[ "$line" != *"closed"* ]]; then
    current_wl_status="open"
  fi
  if [[ "$line" =~ [Ss]tatus.*[Cc]losed ]] || [[ "$line" =~ [Ss]tatus.*CLOSED ]]; then
    current_wl_status="closed"
  fi
  if [[ "$line" =~ ^---$ ]] && [[ -n "$current_wl_feature" ]]; then
    wl_total_count["$current_wl_feature"]=$(( ${wl_total_count["$current_wl_feature"]:-0} + 1 ))
    if [[ "$current_wl_status" == "open" ]]; then
      wl_open_count["$current_wl_feature"]=$(( ${wl_open_count["$current_wl_feature"]:-0} + 1 ))
    fi
    if [[ "$current_wl_date" == "$LATEST_DATE" ]] && [[ -n "$LATEST_DATE" ]]; then
      wl_new_latest["$current_wl_feature"]=$(( ${wl_new_latest["$current_wl_feature"]:-0} + 1 ))
    fi
    current_wl_feature=""
    current_wl_status=""
    current_wl_date=""
  fi
done < "$WASTELOG"

# ── Collect all seen feature labels ──────────────────────────────────────────
declare -A all_labels
for k in "${!bl_open_count[@]}" "${!bl_closed_count[@]}" "${!wl_total_count[@]}"; do
  all_labels["$k"]=1
done

# ── Output ────────────────────────────────────────────────────────────────────
echo "## Feature Activity Report"
echo ""
echo "### ALL TIME"
printf "%-22s %8s %9s %8s %8s\n" "feature" "open-BL" "closed-BL" "total-WL" "open-WL"
printf "%-22s %8s %9s %8s %8s\n" "----------------------" "-------" "---------" "--------" "-------"

# Print canonical labels first, then any unlabelled
for label in "${LABELS[@]}" unlabelled; do
  o_bl=${bl_open_count["$label"]:-0}
  c_bl=${bl_closed_count["$label"]:-0}
  t_wl=${wl_total_count["$label"]:-0}
  o_wl=${wl_open_count["$label"]:-0}
  if (( o_bl + c_bl + t_wl > 0 )); then
    printf "%-22s %8s %9s %8s %8s\n" "$label" "$o_bl" "$c_bl" "$t_wl" "$o_wl"
  fi
done

# Any extra labels not in canonical list
for label in "${!all_labels[@]}"; do
  in_canonical=0
  for cl in "${LABELS[@]}" unlabelled; do
    [[ "$cl" == "$label" ]] && in_canonical=1 && break
  done
  if (( in_canonical == 0 )); then
    o_bl=${bl_open_count["$label"]:-0}
    c_bl=${bl_closed_count["$label"]:-0}
    t_wl=${wl_total_count["$label"]:-0}
    o_wl=${wl_open_count["$label"]:-0}
    printf "%-22s %8s %9s %8s %8s\n" "$label (unlisted)" "$o_bl" "$c_bl" "$t_wl" "$o_wl"
  fi
done

echo ""
echo "### LATEST SESSION (${LATEST_DATE:-unknown})"
printf "%-22s %10s %8s\n" "feature" "closed-BL" "new-WL"
printf "%-22s %10s %8s\n" "----------------------" "---------" "------"

for label in "${LABELS[@]}" unlabelled; do
  c_bl=${bl_closed_latest["$label"]:-0}
  n_wl=${wl_new_latest["$label"]:-0}
  if (( c_bl + n_wl > 0 )); then
    printf "%-22s %10s %8s\n" "$label" "$c_bl" "$n_wl"
  fi
done
