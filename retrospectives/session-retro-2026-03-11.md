# Session Retrospective — 2026-03-11
Structure: Derby & Larsen 5-phase

Trigger: Same bug caught by Rod 6+ times (WL-124). Explicit Rod feedback: "this keeps happening", "PATHETIC", "need to rethink UI testing".

---

## Phase 1 — Set the Stage

This retro covers sessions 5 and 6 (2026-03-10 and 2026-03-11), with focus on the PubCrawl recurring bug.

Check-in word: **Pattern**

A pattern is recurring. The PubCrawl ENGINE.initPubCrawl bug has been reported, "fixed", and re-reported across at least 6 sessions. Each fix felt correct. Each fix passed the pipeline. The bug came back. This is not a one-off — it's a system failure.

---

## Phase 2 — Gather Data

**Timeline of the pattern (WL-124):**

1. PubCrawl (Mode B) shipped (BL-110, 2026-03-10)
2. Session 6: Rod reports "PubCrawl cannot read properties of undefined reading initPubCrawl" — first report
3. Fix applied: guard in index.html inline script (window.PubCrawlScenes || {}) and (window.PubNavigatorEngine || {})
4. Fix applied: FFEngine guard in pub-navigator-engine.js
5. Session continues: Rod still reports "ENGINE.initPubCrawl is not a function"
6. Investigation: line 9 of pub-navigator-engine.js still unguarded (window.PubCrawlScenes.PUB_CRAWL_SCENES)
7. Fix applied: guard + getEngine() runtime lookup + cache busters removed
8. Total time lost: 45+ minutes, 2 sessions

**DORA data:**
- Pipeline failure rate: 21% (305/1420 sessions RED)
- Rod-caught bugs: 100% (8/8)
- Pipeline-caught bugs: 0% (0/8)
- False greens: 1

**What the pipeline checks and what it misses:**
- Unit tests: run in Node.js — cannot load index.html, cannot see browser globals
- Gherkin: run in Node.js — same limitation
- UI audit: static HTML analysis — detects `window.X.Y` patterns (added this session)
- Browser sim: jsdom + inline script execution — does NOT load external scripts (`<script src="...">`)
- Result: zero pipeline coverage of "external script sets window global correctly"

**What WL-122 (partially mitigated) and BL-118 address:**
- WL-122: Added checks 11+12 to ui-audit.js — detects unguarded window chain access STATICALLY
- BL-118: Runtime check that external scripts actually set their globals — NOT YET IMPLEMENTED

---

## Phase 3 — Generate Insights

**5 Whys (from 5-WHYS.md protocol):**

1. Why did the fix not work after session 5? → Because line 9 of pub-navigator-engine.js was still unguarded, AND the browser was serving a cached old version of the script
2. Why was line 9 not caught in session 5? → Because the fix in session 5 addressed the FFEngine guard (lines 13-16) but not the PubCrawlScenes guard (line 9)
3. Why wasn't line 9 caught? → Because no test exercises "pub-navigator-engine.js loads in browser context and sets window.PubNavigatorEngine"
4. Why does no such test exist? → Because the pipeline runs in Node.js; external browser scripts are outside its scope
5. Why has the pipeline not been extended to cover this? → Because no BL item existed for it, and the gap was not named until Rod caught it repeatedly

**Root cause (systems level):**
The pipeline has a structural blind spot: external scripts (`<script src="...">`) that set window globals are tested as Node.js modules but never as browser-loaded scripts. The gap between Node.js module behaviour and browser global behaviour is invisible to every current pipeline check.

**Contributing factor: cache buster pattern**
The `?v=2` cache buster was added manually. When code was fixed, the version number wasn't bumped, so users received stale cached scripts. The fix was deployed but the browser kept using the old version. This made the bug appear unfixed even after the correct fix was pushed.

**Framework lenses:**

- **DevOps Three Ways (feedback):** Fast feedback requires the pipeline to detect what production detects. If the pipeline can't see a bug, the feedback loop is broken. Rod IS the feedback loop — that is not acceptable.
- **DORA:** 0% pipeline-caught bugs = poor change failure rate visibility. Lead time to bug detection = time until Rod manually tests, which is session-by-session.
- **Lean / Muda:** Repeated-work waste (WL-124: "repeated-work" tag). Same diagnosis, same partial fix, same re-report — three cycles before permanent fix.
- **XP / four rules of simple design:** "tests express intent." There is no test expressing "PubCrawl engine loads in the browser." The feature passed all tests but failed in production.

---

## Phase 4 — Decide What to Do

**Experiments agreed:**

1. **BL-118 (raised this session, CD3=6.0):** Extend pipeline to test that external scripts set expected window globals in a browser-like context. Options: jsdom with external script loading, or playwright headless. Three Amigos before implementation.

2. **Retire `?v=N` cache busters permanently:** Done this session (commit 3b4821a). ETag-based caching is automatic — content changes → ETag changes → browser re-fetches. No manual version bumping.

3. **getEngine() pattern for all external-script globals:** Done this session for PubCrawl. Apply same pattern to QuntumLeeksEngine and any other external-script globals — look up at call time, not load time. Gives a clear error if missing rather than silent TypeError.

4. **Rule: external scripts must be guarded at BOTH ends:** (a) at declaration time (use `|| {}` guard) AND (b) at call time (getEngine() pattern). Both are now in place for PubCrawl. Apply to others.

**STOP doing:**
- Applying partial fixes (addressing one unguarded access but missing others in the same file)
- Assuming "pipeline green = production working" for features that depend on external script loading

**KEEP doing:**
- Writing WL entries for every Rod-caught bug immediately
- Adding pipeline checks whenever a gap is identified (WL-122 → checks 11+12)

**TRY:**
- When fixing an external-script bug: read the ENTIRE file for other guards, not just the reported line

---

## Phase 5 — Close

**Summary:**
The root cause of WL-124 is a structural pipeline blind spot: external scripts are tested as Node modules but never as browser-loaded globals. Contributing factor: manual `?v=N` cache busters that weren't bumped after fixes. Both are now partially addressed. BL-118 is the next step.

**Commitment:**
Next session's first topic: agree Three Amigos for BL-118 (pipeline runtime browser test). Do this before any feature work.

**One-word close:** Closed.
