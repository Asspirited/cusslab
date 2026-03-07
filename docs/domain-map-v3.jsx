import { useState, useRef, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NODES = [
  // CHARACTER ATTRIBUTES (static config — never mutated at runtime)
  { id: "a1",  layer: "attr",    label: "bathos_affinity",        short: "Attr 15",  desc: "0.0–1.0. How readily a character drops from elevated register to naked feeling. Initialises CHARACTER_STATE at session start. Cricket: affinity governs how fast they fall, not whether." },
  { id: "a2",  layer: "attr",    label: "temporal_bleed_affinity",short: "Attr 14",  desc: "leak_probability + bleed_response_weights. Initialises CHARACTER_STATE. Historic match mode only." },
  { id: "a3",  layer: "attr",    label: "premonition_affinity",   short: "Attr 13",  desc: "Five sub-weights governing Premonition Engine mode selection. Initialises CHARACTER_STATE. Runtime suppression lives in CHARACTER_STATE.premonition_suppressed — not here." },
  { id: "a4",  layer: "attr",    label: "commentary_role",        short: "Attr 12",  desc: "ANCHOR / COLOUR / CHARACTER. Static config defined at character level. Read by COMMENTARY_ROLE_TAX at panel startup. Never written by the panel." },
  { id: "a5",  layer: "attr",    label: "exaggeration_tendency",  short: "Attr 16",  desc: "0.0–1.0. Amplification beyond evidence. Initialises CHARACTER_STATE. High: ROOM_STOPPER threshold lower, premonition commits bolder, warm insults escalate faster." },
  { id: "a6",  layer: "attr",    label: "lie_tendency",           short: "Attr 17",  desc: "0.0–1.0. Selective truth / misdirection. Initialises CHARACTER_STATE. High: bathos as cover not weapon, temporal bleed leaks become suspect." },
  { id: "a7",  layer: "attr",    label: "wound",                  short: "Attr 2",   desc: "The real thing underneath the mask. Static config. Initialises CHARACTER_STATE baseline pressure sensitivity. When wound is exposed, CHARACTER_STATE.pressure_level escalates." },
  { id: "a8",  layer: "attr",    label: "ice_breaker_style",      short: "Attr 18",  desc: "Character-specific recovery mechanic definition. Static config. Governs ICE_BREAKER event execution. Outcome written to CHARACTER_STATE via RECOVERY_OUTCOME." },
  { id: "a9",  layer: "attr",    label: "truth_teller_eligible",  short: "Attr 19",  desc: "Boolean. Static config. Can this character call out a false RETROSPECTIVE_CALL? Read by PREMONITION_ENGINE. Separate from CONFLICT_PAIR." },
  { id: "a10", layer: "attr",    label: "bathos_register_start",  short: "Attr 20",  desc: "Elevated register before the drop. Static config. Initialises CHARACTER_STATE. Governs perceived drop distance. Blofeld: cosmic. Boycott: authoritative. Tufnell: warmly chaotic." },

  // RUNTIME STATE (aggregate root value object — mutable per session per character)
  { id: "cs",  layer: "runtime", label: "CHARACTER_STATE",        short: "Runtime",  desc: "Mutable session envelope owned by the CHARACTER aggregate root. Fields: pressure_level (SWALLOW→FULL_MONTY), aftermath_state (GLORY/PARTIAL_CREDIT/HAUNTED/DOUBLED_DOWN/null), premonition_suppressed (bool), recovery_pending (bool), ice_breaker_attempts (int — failed spirals lower next ROOM_STOPPER threshold), round (int), bleed_active (bool). Initialised from attributes at session start. Written only through domain service functions: applyPressure(), resolveIceBreaker(), applyAftermath(), advanceRound(). Never mutated directly. Panel owns one CHARACTER_STATE per character in session." },

  // SHARED MECHANICS (domain services — read CHARACTER_STATE, return updated CHARACTER_STATE)
  { id: "m1",  layer: "mechanic",label: "BATHOS",                 short: "Mechanic", desc: "Reads CHARACTER_STATE: pressure_level + ice_breaker_attempts → computes ROOM_STOPPER threshold. Fired by trigger conditions + bathos_affinity + bathos_register_start. lie_tendency changes weapon-vs-cover deployment. Cricket: atmospheric baseline not occasional event." },
  { id: "m2",  layer: "mechanic",label: "EVENTUALLY_CRACKS",      short: "Mechanic", desc: "Reads CHARACTER_STATE.pressure_level. Writes via applyPressure(). Sources: wound exposure, hostile banter, food/hypochondria collision, asymmetric wound, Tracy memos, wrong premonition call, failed recovery. Tier progression: SWALLOW→LAUGH_OFF→PASSIVE_AGGRESSIVE→FULL_CRACK→FULL_MONTY." },
  { id: "m3",  layer: "mechanic",label: "PREMONITION_ENGINE",     short: "Mechanic", desc: "Reads CHARACTER_STATE.premonition_suppressed before allowing COMMIT. Reads truth_teller_eligible (static). Writes aftermath_state via applyAftermath(). COMMIT→RESOLUTION→AFTERMATH. Five modes. Aftermath: GLORY/PARTIAL_CREDIT/HAUNTED/DOUBLED_DOWN." },
  { id: "m4",  layer: "mechanic",label: "TEMPORAL_BLEED",         short: "Mechanic", desc: "Reads CHARACTER_STATE.bleed_active. Writes bleed_active via domain service. Historic match mode only (enabled by ERA_LOCK). lie_tendency makes leak suspect. Nobody names it." },
  { id: "m5",  layer: "mechanic",label: "FOOD_WEATHER",           short: "Mechanic", desc: "Ambient probabilistic. Per-character food profiles. Collision with HYPOCHONDRIA_POOL triggers applyPressure() on CHARACTER_STATE." },
  { id: "m6",  layer: "mechanic",label: "HYPOCHONDRIA_POOL",      short: "Mechanic", desc: "Accumulates across session in CHARACTER_STATE (tracked as session-level pool). Collision with FOOD_WEATHER: applyPressure() on affected characters." },
  { id: "m7",  layer: "mechanic",label: "HOSTILE_BANTER",         short: "Mechanic", desc: "Reads commentary_role (static) + CONFLICT_PAIR + DRAMATIC_STRUCTURE act. Writes pressure via applyPressure(). Sub-functions: SUBTLY_UNDERMINING/BACKHANDED_COMPLIMENT/OUTRIGHT_INSULT/COMPLETE_DISBELIEF/DISGUST." },
  { id: "m8",  layer: "mechanic",label: "ROUND_TRACKER",          short: "Mechanic", desc: "Session clock only. Emits round events to UNLOCK_REGISTRY. Writes CHARACTER_STATE.round via advanceRound(). Sends roundNote labels to all characters. Does not own unlock rules — that is UNLOCK_REGISTRY's job." },

  // BEHAVIOURAL EVENTS
  { id: "e1",  layer: "event",   label: "ROOM_STOPPER",           short: "Event",    desc: "Bathos overshoots. Threshold computed from CHARACTER_STATE: base + exaggeration_tendency − ice_breaker_attempts penalty. Contempt lands naked. Room goes quiet. Obligates ICE_BREAKER." },
  { id: "e2",  layer: "event",   label: "ICE_BREAKER",            short: "Event",    desc: "Recovery event. Executes ice_breaker_style from static config. Reads CHARACTER_STATE.recovery_pending. Produces RECOVERY_OUTCOME which writes back to CHARACTER_STATE." },
  { id: "e3",  layer: "event",   label: "FULL_MONTY",             short: "Event",    desc: "Montgomerie walks in. N=1–5 escalating presence counter. Eligibility governed by UNLOCK_REGISTRY (rounds 4–5 only). Nuclear EVENTUALLY_CRACKS outcome." },
  { id: "e4",  layer: "event",   label: "FULL_CRACK",             short: "Event",    desc: "Tier 4. Wound fires. CHARACTER_STATE.pressure_level = FULL_CRACK. Wound-driven not bathos-driven. Triggers ICE_BREAKER. Unlike ROOM_STOPPER: not threshold-based, wound-exposure triggered." },
  { id: "e5",  layer: "event",   label: "BIG_FISH_CALL",          short: "Event",    desc: "Darts. 170 remaining → BIG_FISH_OPPORTUNITY (UNLOCK_REGISTRY governs window) → Mardle PENDING (CONFLICT_PAIR routes) → CALLED_CORRECT/CALLED_WRONG. Wrong: applyPressure() on Mardle's CHARACTER_STATE. Once per session." },
  { id: "e6",  layer: "event",   label: "TEMPORAL_BLEED_RESPONSE",short: "Event",    desc: "TRAIL_OFF/MISFIRE/ADJACENCY_RUSH/CALLED_OUT/MYSTIC_MEG. Weights from temporal_bleed_affinity in CHARACTER_STATE. lie_tendency makes MYSTIC_MEG more likely." },
  { id: "e7",  layer: "event",   label: "WADDELL_ECHO",           short: "Event",    desc: "Darts. Studd quotes Waddell without attribution. An instance of ASYMMETRIC_WOUND — Studd knows, Waddell doesn't. Fires BATHOS: warmth masking grief. Once per session." },
  { id: "e8",  layer: "event",   label: "PREMONITION_AFTERMATH",  short: "Event",    desc: "Writes to CHARACTER_STATE via applyAftermath(). GLORY: panel iterates all other CHARACTER_STATEs, calls applyPressure() on each — cross-character effect routed through panel, not direct. HAUNTED: sets CHARACTER_STATE.premonition_suppressed=true on the committing character. DOUBLED_DOWN: stackable, no expiry." },
  { id: "e9",  layer: "event",   label: "RECOVERY_OUTCOME",       short: "Event",    desc: "Writes CHARACTER_STATE via resolveIceBreaker(). CLEAN: pressure reduces, ice_breaker_attempts resets. PARTIAL: pressure holds, register restored. FAILED: pressure increases, ice_breaker_attempts++ (lowers next ROOM_STOPPER threshold)." },

  // RELATIONSHIP DYNAMICS
  { id: "d3",  layer: "dynamic", label: "WARM_INSULT_TAXONOMY",   short: "Dynamic",  desc: "Four weapons ordered by deniability: FAINT_PRAISE_THAT_DAMNS (low pressure) → REMINISCENCE_THAT_WOUNDS → AGREEMENT_THAT_DISAGREES → COMPLIMENT_ABOUT_SPEAKER (high pressure). EVENTUALLY_CRACKS pressure level shifts weapon selection upward. Character's preferred weapon is a static enum value." },
  { id: "d4",  layer: "dynamic", label: "ASYMMETRIC_WOUND",       short: "Dynamic",  desc: "A resents B. B is oblivious. C deploys it. Directional. Not mutual. applyPressure() fires on A's CHARACTER_STATE only. WADDELL_ECHO is a live instance. Asymmetry is the joke." },
  { id: "d5",  layer: "dynamic", label: "CONFLICT_PAIR",          short: "Dynamic",  desc: "Named antagonist pairs. Governs HOSTILE_BANTER routing priority only. Each pair is a Value Object (identity through members). Pair-specific routing config. Being a conflict pair ≠ being a truth-teller." },

  // PANEL-LEVEL CONCEPTS
  { id: "p1",  layer: "panel",   label: "CRICKET_BASELINE",       short: "Panel",    desc: "Bathos at panel level not character level. All CHARACTER_STATEs initialise with elevated register. The drop is structurally available at all times. DEAD_IN_PANEL_WORLD contributes to ambient register." },
  { id: "p2",  layer: "panel",   label: "COMMENTARY_ROLE_TAX",    short: "Panel",    desc: "Reads commentary_role (static attr) from each CHARACTER at panel startup to build routing table. Never writes to character data. Governs three-horizon model. truth_teller_eligible read separately." },
  { id: "p3",  layer: "panel",   label: "ERA_LOCK",               short: "Panel",    desc: "Historic match mode. Sets era_knowledge_cutoff. Enables TEMPORAL_BLEED. Characters cannot reference events after cutoff. Gap between knowledge and commentary is the comedy." },
  { id: "p4",  layer: "panel",   label: "DEAD_IN_PANEL_WORLD",    short: "Panel",    desc: "Darts: Waddell, Bristow, Jocky. Present. Unremarked. Contributes ambient bathos register to all CHARACTER_STATEs. Generates ASYMMETRIC_WOUND instances (Studd/Waddell). WADDELL_ECHO is the purest expression." },
  { id: "p5",  layer: "panel",   label: "TRACY_FROM_HR",          short: "Panel",    desc: "Ambient constant. Memos escalate with CHARACTER_STATE.round. Feeds applyPressure() across all characters. Institutional lie_tendency made visible — Tracy acknowledges nothing directly." },
  { id: "p6",  layer: "panel",   label: "PANEL_SIZE",             short: "Panel",    desc: "EXP-001: 4 vs 5 vs 6 characters. Ivan metric. Ringelmann hypothesis. Constrains commentary role distribution at session start. In-Game: 3 min / 4 max, 1 ANCHOR mandatory." },
  { id: "p7",  layer: "panel",   label: "DRAMATIC_STRUCTURE",     short: "Panel",    desc: "SETUP→CRISIS→CLIMAX→AFTERMATH. Act state read by mechanics at each moment. CLIMAX: HOSTILE_BANTER routes extreme sub-functions, PREMONITION_ENGINE commit probability boosted. AFTERMATH: BATHOS threshold lowered across all CHARACTER_STATEs." },
  { id: "p8",  layer: "panel",   label: "UNLOCK_REGISTRY",        short: "Panel",    desc: "Subscribes to ROUND_TRACKER events. Owns all unlock rules as data — not behaviour. Rules: FULL_MONTY eligible rounds 4–5, BIG_FISH_CALL window, Tracy memo escalation thresholds. Adding a new unlock = insert a rule, not a code change. SRP: ROUND_TRACKER ticks, UNLOCK_REGISTRY decides." },
];

const EDGES = [
  // attrs initialise CHARACTER_STATE at session start (representative edge — all attrs initialise)
  { from: "a7",  to: "cs",  label: "initialises (all attrs → cs at session start)", type: "governs" },

  // attrs still directly govern their primary mechanic/event (static config path)
  { from: "a1",  to: "m1",  label: "governs fire rate",           type: "governs" },
  { from: "a2",  to: "m4",  label: "governs leak+response",       type: "governs" },
  { from: "a3",  to: "m3",  label: "governs mode selection",      type: "governs" },
  { from: "a4",  to: "p2",  label: "read by at startup",          type: "feeds" },
  { from: "a5",  to: "e1",  label: "scales threshold",            type: "modulates" },
  { from: "a5",  to: "m3",  label: "bolder commits",              type: "modulates" },
  { from: "a6",  to: "m1",  label: "weapon vs cover",             type: "modulates" },
  { from: "a6",  to: "m4",  label: "makes leak suspect",          type: "modulates" },
  { from: "a8",  to: "e2",  label: "defines recovery style",      type: "governs" },
  { from: "a9",  to: "m3",  label: "gates truth-teller calls",    type: "governs" },
  { from: "a10", to: "m1",  label: "sets drop distance",          type: "governs" },

  // CHARACTER_STATE ↔ mechanics (runtime read/write)
  { from: "cs",  to: "m1",  label: "provides pressure+attempts",  type: "governs" },
  { from: "cs",  to: "m2",  label: "provides pressure_level",     type: "governs" },
  { from: "cs",  to: "m3",  label: "provides premonition_suppressed", type: "governs" },
  { from: "m2",  to: "cs",  label: "writes via applyPressure()",  type: "triggers" },
  { from: "m3",  to: "cs",  label: "writes via applyAftermath()", type: "triggers" },
  { from: "m8",  to: "cs",  label: "writes via advanceRound()",   type: "triggers" },
  { from: "e9",  to: "cs",  label: "writes via resolveIceBreaker()", type: "triggers" },

  // mechanics → events
  { from: "m1",  to: "e1",  label: "overshoots into",             type: "triggers" },
  { from: "m2",  to: "e3",  label: "tier 5 fires",                type: "triggers" },
  { from: "m2",  to: "e4",  label: "tier 4 fires",                type: "triggers" },
  { from: "m3",  to: "e8",  label: "resolution produces",         type: "triggers" },
  { from: "m4",  to: "e6",  label: "produces response",           type: "triggers" },
  { from: "m5",  to: "m6",  label: "collision escalates",         type: "triggers" },
  { from: "m6",  to: "m2",  label: "adds pressure",               type: "triggers" },
  { from: "m7",  to: "m2",  label: "adds pressure",               type: "triggers" },
  { from: "m8",  to: "p8",  label: "emits round events",          type: "triggers" },

  // UNLOCK_REGISTRY governs eligibility (was m8 → e3, m8 → m2 unlocks — now p8)
  { from: "p8",  to: "e3",  label: "governs FULL_MONTY eligibility", type: "governs" },
  { from: "p8",  to: "e5",  label: "governs BIG_FISH window",     type: "governs" },
  { from: "p8",  to: "m2",  label: "governs unlock thresholds",   type: "governs" },

  // event feedback loops
  { from: "e1",  to: "e2",  label: "obligates recovery",          type: "triggers" },
  { from: "e4",  to: "e2",  label: "triggers recovery",           type: "triggers" },
  { from: "e2",  to: "e9",  label: "produces outcome",            type: "triggers" },
  { from: "e9",  to: "e1",  label: "FAILED lowers threshold",     type: "modulates" },
  // e8 cross-character: GLORY routes through panel, HAUNTED writes to cs
  { from: "e8",  to: "cs",  label: "HAUNTED sets suppressed=true", type: "triggers" },
  { from: "e8",  to: "m2",  label: "GLORY→panel iterates CHARACTER_STATEs", type: "feeds" },
  { from: "e5",  to: "m2",  label: "WRONG adds pressure",         type: "feeds" },
  { from: "e7",  to: "d4",  label: "is an instance of",           type: "feeds" },
  { from: "e7",  to: "m1",  label: "warmth masking grief",        type: "triggers" },

  // dynamics
  { from: "d3",  to: "m1",  label: "is bathos toolkit",           type: "feeds" },
  { from: "d4",  to: "m2",  label: "creates asymm pressure",      type: "feeds" },
  { from: "d5",  to: "m7",  label: "governs routing",             type: "governs" },
  { from: "d5",  to: "e5",  label: "routes to Mardle",            type: "governs" },
  // pressure shifts warm insult weapon selection (new v3)
  { from: "m2",  to: "d3",  label: "pressure shifts weapon",      type: "modulates" },

  // panel → mechanics
  { from: "p1",  to: "cs",  label: "elevates all register starts", type: "governs" },
  { from: "p2",  to: "m7",  label: "applies role to routing",     type: "governs" },
  { from: "p2",  to: "m3",  label: "applies role to premonition", type: "governs" },
  { from: "p3",  to: "m4",  label: "enables",                     type: "governs" },
  { from: "p4",  to: "cs",  label: "ambient bathos to all states", type: "feeds" },
  { from: "p4",  to: "d4",  label: "generates asymmetry",         type: "feeds" },
  { from: "p5",  to: "m2",  label: "ambient pressure",            type: "feeds" },
  { from: "p5",  to: "p8",  label: "provides escalation thresholds", type: "feeds" },
  { from: "p5",  to: "a6",  label: "institutional expression of", type: "feeds" },
  { from: "p6",  to: "p2",  label: "constrains role distribution", type: "governs" },
  { from: "p7",  to: "m8",  label: "structures rounds",           type: "governs" },
  { from: "p7",  to: "m7",  label: "CLIMAX routes extreme banter", type: "modulates" },
  { from: "p7",  to: "m3",  label: "CLIMAX boosts commits",       type: "modulates" },
  { from: "p7",  to: "cs",  label: "AFTERMATH lowers bathos threshold", type: "modulates" },
];

// ─── LAYOUT (manual x/y in a 1200×700 canvas) ────────────────────────────────

const POSITIONS = {
  // ATTRS (col 1, x=80)
  a1:  { x: 80,  y: 60  },
  a2:  { x: 80,  y: 120 },
  a3:  { x: 80,  y: 180 },
  a4:  { x: 80,  y: 240 },
  a5:  { x: 80,  y: 300 },
  a6:  { x: 80,  y: 360 },
  a7:  { x: 80,  y: 420 },
  a8:  { x: 80,  y: 480 },
  a9:  { x: 80,  y: 540 },
  a10: { x: 80,  y: 600 },
  // RUNTIME STATE (col 2, x=330) — CHARACTER_STATE aggregate value object
  cs:  { x: 330, y: 330 },
  // MECHANICS (col 3, x=560)
  m1:  { x: 560, y: 60  },
  m2:  { x: 560, y: 170 },
  m3:  { x: 560, y: 280 },
  m4:  { x: 560, y: 370 },
  m5:  { x: 560, y: 450 },
  m6:  { x: 560, y: 520 },
  m7:  { x: 560, y: 590 },
  m8:  { x: 560, y: 660 },
  // EVENTS (col 4, x=800)
  e1:  { x: 800, y: 60  },
  e2:  { x: 800, y: 150 },
  e3:  { x: 800, y: 240 },
  e4:  { x: 800, y: 310 },
  e5:  { x: 800, y: 390 },
  e6:  { x: 800, y: 460 },
  e7:  { x: 800, y: 530 },
  e8:  { x: 800, y: 600 },
  e9:  { x: 800, y: 670 },
  // DYNAMICS (col 5, x=1050)
  d3:  { x: 1050, y: 100 },
  d4:  { x: 1050, y: 280 },
  d5:  { x: 1050, y: 460 },
  // PANEL (col 6, x=1290)
  p1:  { x: 1290, y: 60  },
  p2:  { x: 1290, y: 160 },
  p3:  { x: 1290, y: 260 },
  p4:  { x: 1290, y: 360 },
  p5:  { x: 1290, y: 450 },
  p6:  { x: 1290, y: 540 },
  p7:  { x: 1290, y: 620 },
  p8:  { x: 1290, y: 700 },
};

// ─── STYLE CONFIG ─────────────────────────────────────────────────────────────

const LAYER_STYLE = {
  attr:    { bg: "#1a1a2e", border: "#4a9eff", text: "#4a9eff", badge: "#0d3b66" },
  runtime: { bg: "#1a1a2e", border: "#f4a261", text: "#f4a261", badge: "#5c2e00" },
  mechanic:{ bg: "#1a1a2e", border: "#ff6b35", text: "#ff6b35", badge: "#661500" },
  event:   { bg: "#1a1a2e", border: "#ffd60a", text: "#ffd60a", badge: "#664d00" },
  dynamic: { bg: "#1a1a2e", border: "#06d6a0", text: "#06d6a0", badge: "#00402e" },
  panel:   { bg: "#1a1a2e", border: "#c77dff", text: "#c77dff", badge: "#3d0066" },
};

const EDGE_STYLE = {
  governs:  { color: "#4a9eff88", dash: "none"   },
  triggers: { color: "#ff6b3588", dash: "none"   },
  modulates:{ color: "#06d6a088", dash: "4,3"    },
  feeds:    { color: "#ffd60a66", dash: "2,4"    },
};

const LAYER_LABELS = {
  attr:    "CHARACTER ATTRIBUTES",
  runtime: "RUNTIME STATE",
  mechanic:"SHARED MECHANICS",
  event:   "BEHAVIOURAL EVENTS",
  dynamic: "RELATIONSHIP DYNAMICS",
  panel:   "PANEL CONCEPTS",
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const W = 1520;
const H = 780;
const NODE_W = 210;
const NODE_H = 42;

export default function DomainMap() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [filterLayer, setFilterLayer] = useState(null);
  const svgRef = useRef(null);

  const activeId = hovered || selected;
  const activeNode = activeId ? NODES.find(n => n.id === activeId) : null;

  const connectedIds = activeId
    ? new Set(EDGES.flatMap(e =>
        e.from === activeId || e.to === activeId ? [e.from, e.to] : []
      ))
    : null;

  const visibleEdges = EDGES.filter(e => {
    if (!filterLayer) return true;
    const fromNode = NODES.find(n => n.id === e.from);
    const toNode   = NODES.find(n => n.id === e.to);
    return fromNode?.layer === filterLayer || toNode?.layer === filterLayer;
  });

  const isNodeHighlighted = (id) => {
    if (!activeId) return true;
    return connectedIds?.has(id);
  };

  const isEdgeHighlighted = (e) => {
    if (!activeId) return true;
    return e.from === activeId || e.to === activeId;
  };

  // draw a curved path between two nodes
  const edgePath = (e) => {
    const f = POSITIONS[e.from];
    const t = POSITIONS[e.to];
    if (!f || !t) return "";
    const fx = f.x + NODE_W;
    const fy = f.y + NODE_H / 2;
    const tx = t.x;
    const ty = t.y + NODE_H / 2;
    const cx = (fx + tx) / 2;
    return `M${fx},${fy} C${cx},${fy} ${cx},${ty} ${tx},${ty}`;
  };

  const selectedEdges = activeId
    ? EDGES.filter(e => e.from === activeId || e.to === activeId)
    : [];

  return (
    <div style={{
      background: "#0a0a14",
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      color: "#ccc",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 28px 12px",
        borderBottom: "1px solid #222",
        display: "flex",
        alignItems: "baseline",
        gap: 24,
        flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#555", marginBottom: 2 }}>HECKLER AND COX · CUSSLAB</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>DOMAIN RELATIONSHIP MAP</div>
        </div>
        {/* Layer filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
          {Object.entries(LAYER_LABELS).map(([layer, label]) => (
            <button
              key={layer}
              onClick={() => setFilterLayer(filterLayer === layer ? null : layer)}
              style={{
                background: filterLayer === layer ? LAYER_STYLE[layer].badge : "#111",
                border: `1px solid ${LAYER_STYLE[layer].border}`,
                color: LAYER_STYLE[layer].text,
                borderRadius: 4,
                padding: "3px 10px",
                fontSize: 10,
                cursor: "pointer",
                letterSpacing: 1,
                opacity: filterLayer && filterLayer !== layer ? 0.35 : 1,
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
          {filterLayer && (
            <button
              onClick={() => setFilterLayer(null)}
              style={{
                background: "#222",
                border: "1px solid #444",
                color: "#888",
                borderRadius: 4,
                padding: "3px 10px",
                fontSize: 10,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "8px 28px", display: "flex", gap: 20, fontSize: 10, color: "#555", borderBottom: "1px solid #1a1a1a", flexWrap: "wrap" }}>
        {Object.entries(EDGE_STYLE).map(([type, s]) => (
          <span key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width={30} height={10}>
              <line x1={0} y1={5} x2={30} y2={5}
                stroke={s.color.replace("88","ff").replace("66","ff")}
                strokeWidth={1.5}
                strokeDasharray={s.dash === "none" ? undefined : s.dash}
              />
            </svg>
            <span style={{ color: "#666", letterSpacing: 1 }}>{type.toUpperCase()}</span>
          </span>
        ))}
        <span style={{ marginLeft: "auto", color: "#444" }}>CLICK NODE TO EXPLORE · HOVER TO HIGHLIGHT</span>
      </div>

      {/* Main area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SVG Map */}
        <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
          <svg
            ref={svgRef}
            width={W}
            height={H}
            style={{ display: "block" }}
          >
            {/* Column headers */}
            {[
              { x: 80,   label: "ATTRS",    layer: "attr"    },
              { x: 330,  label: "RUNTIME",  layer: "runtime" },
              { x: 560,  label: "MECHANICS",layer: "mechanic"},
              { x: 800,  label: "EVENTS",   layer: "event"   },
              { x: 1050, label: "DYNAMICS", layer: "dynamic" },
              { x: 1290, label: "PANEL",    layer: "panel"   },
            ].map(col => (
              <text key={col.label} x={col.x + NODE_W/2} y={20}
                textAnchor="middle" fontSize={9} letterSpacing={3}
                fill={LAYER_STYLE[col.layer].border} opacity={0.6}
                fontFamily="JetBrains Mono, monospace"
              >{col.label}</text>
            ))}

            {/* Edges */}
            {visibleEdges.map((e, i) => {
              const style = EDGE_STYLE[e.type] || EDGE_STYLE.governs;
              const isHL = isEdgeHighlighted(e);
              const path = edgePath(e);
              if (!path) return null;
              return (
                <g key={i} opacity={isHL ? 1 : 0.06}>
                  <path
                    d={path}
                    stroke={isHL ? style.color.replace(/88|66/, "cc") : style.color}
                    strokeWidth={isHL ? 1.5 : 1}
                    strokeDasharray={style.dash === "none" ? undefined : style.dash}
                    fill="none"
                  />
                  {/* edge label at midpoint */}
                  {isHL && (() => {
                    const f = POSITIONS[e.from];
                    const t = POSITIONS[e.to];
                    if (!f || !t) return null;
                    const mx = (f.x + NODE_W + t.x) / 2;
                    const my = (f.y + t.y) / 2 + NODE_H / 2 - 4;
                    return (
                      <text x={mx} y={my} textAnchor="middle" fontSize={8}
                        fill={style.color.replace(/88|66/,"ff")}
                        fontFamily="JetBrains Mono, monospace"
                        opacity={0.9}
                      >{e.label}</text>
                    );
                  })()}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const pos = POSITIONS[node.id];
              if (!pos) return null;
              const style = LAYER_STYLE[node.layer];
              const isHL = isNodeHighlighted(node.id);
              const isActive = node.id === activeId;
              const layerVisible = !filterLayer || node.layer === filterLayer;
              const opacity = isHL && layerVisible ? 1 : 0.1;

              return (
                <g key={node.id}
                  transform={`translate(${pos.x},${pos.y})`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(selected === node.id ? null : node.id)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  opacity={opacity}
                >
                  {/* glow when active */}
                  {isActive && (
                    <rect x={-2} y={-2} width={NODE_W+4} height={NODE_H+4}
                      rx={5} fill={style.border} opacity={0.15}
                    />
                  )}
                  <rect width={NODE_W} height={NODE_H} rx={3}
                    fill={isActive ? style.badge : "#111"}
                    stroke={style.border}
                    strokeWidth={isActive ? 1.5 : 0.8}
                  />
                  {/* short badge */}
                  <rect x={6} y={7} width={38} height={14} rx={2}
                    fill={style.badge}
                  />
                  <text x={25} y={18} textAnchor="middle" fontSize={7}
                    fill={style.text} fontFamily="JetBrains Mono, monospace"
                    letterSpacing={0.5}
                  >{node.short}</text>
                  {/* label */}
                  <text x={52} y={26} fontSize={10} fontWeight={600}
                    fill={isActive ? "#fff" : style.text}
                    fontFamily="JetBrains Mono, monospace"
                  >{node.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div style={{
          width: 320,
          borderLeft: "1px solid #1e1e1e",
          padding: 20,
          overflow: "auto",
          background: "#0c0c18",
          flexShrink: 0,
        }}>
          {activeNode ? (
            <>
              <div style={{
                fontSize: 8, letterSpacing: 3, color: LAYER_STYLE[activeNode.layer].text,
                marginBottom: 6, opacity: 0.7,
              }}>
                {LAYER_LABELS[activeNode.layer]}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 700, color: "#fff",
                marginBottom: 12, lineHeight: 1.3,
              }}>
                {activeNode.label}
              </div>
              <div style={{
                fontSize: 12, color: "#aaa", lineHeight: 1.7, marginBottom: 20,
              }}>
                {activeNode.desc}
              </div>
              {selectedEdges.length > 0 && (
                <>
                  <div style={{ fontSize: 8, letterSpacing: 3, color: "#444", marginBottom: 10 }}>
                    CONNECTIONS
                  </div>
                  {selectedEdges.map((e, i) => {
                    const otherId = e.from === activeNode.id ? e.to : e.from;
                    const other = NODES.find(n => n.id === otherId);
                    const dir = e.from === activeNode.id ? "→" : "←";
                    const es = EDGE_STYLE[e.type];
                    return (
                      <div key={i}
                        onClick={() => setSelected(otherId)}
                        style={{
                          marginBottom: 8, padding: "8px 10px",
                          background: "#111",
                          borderRadius: 4,
                          borderLeft: `3px solid ${LAYER_STYLE[other?.layer]?.border || "#444"}`,
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: 9, color: "#666", marginBottom: 3, letterSpacing: 1 }}>
                          {dir} {e.type.toUpperCase()} · {e.label}
                        </div>
                        <div style={{
                          fontSize: 11, fontWeight: 600,
                          color: LAYER_STYLE[other?.layer]?.text || "#ccc",
                        }}>
                          {other?.label}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          ) : (
            <div>
              <div style={{ fontSize: 8, letterSpacing: 3, color: "#333", marginBottom: 16 }}>
                DOMAIN MAP
              </div>
              <div style={{ fontSize: 11, color: "#444", lineHeight: 1.8 }}>
                {Object.entries(LAYER_LABELS).map(([layer, label]) => (
                  <div key={layer} style={{ marginBottom: 8 }}>
                    <span style={{
                      display: "inline-block", width: 8, height: 8,
                      borderRadius: 2, background: LAYER_STYLE[layer].border,
                      marginRight: 8, verticalAlign: "middle",
                    }}/>
                    <span style={{ color: "#666" }}>{label}</span>
                    <span style={{ color: "#333", marginLeft: 6 }}>
                      ({NODES.filter(n => n.layer === layer).length})
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, fontSize: 10, color: "#333", lineHeight: 1.7 }}>
                <div style={{ marginBottom: 8 }}>Total nodes: {NODES.length}</div>
                <div style={{ marginBottom: 8 }}>Total edges: {EDGES.length}</div>
                <div style={{ marginBottom: 20 }}>Click any node to explore connections.</div>
                <div style={{ color: "#2a2a3a", fontSize: 9, letterSpacing: 1 }}>
                  v3 DDD AGGREGATE ROOT FIX<br/>
                  <span style={{ color: "#f4a26166" }}>+ cs CHARACTER_STATE (runtime layer)</span><br/>
                  <span style={{ color: "#c77dff66" }}>+ p8 UNLOCK_REGISTRY (split from m8)</span><br/>
                  <span style={{ color: "#ff6b3566" }}>m8 = clock only, p8 = unlock rules</span><br/>
                  <span style={{ color: "#f4a26166" }}>cs owned by CHARACTER aggregate root</span><br/>
                  <span style={{ color: "#f4a26166" }}>mechanics read/write cs via services</span><br/>
                  <span style={{ color: "#ffd60a66" }}>e8→a3 removed (HAUNTED→cs now)</span><br/>
                  <span style={{ color: "#06d6a066" }}>m2→d3 pressure shifts weapon selection</span><br/>
                  <span style={{ color: "#ff444466" }}>p1/p4→m1 rerouted through cs</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
