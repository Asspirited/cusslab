import { useState, useRef, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NODES = [
  // CHARACTER ATTRIBUTES
  { id: "a1",  layer: "attr",    label: "bathos_affinity",        short: "Attr 15",  desc: "0.0–1.0. How readily a character drops from elevated register to naked feeling. Cricket panel: all characters start high — affinity governs how fast they fall, not whether." },
  { id: "a2",  layer: "attr",    label: "temporal_bleed_affinity",short: "Attr 14",  desc: "leak_probability + bleed_response_weights (TRAIL_OFF / MISFIRE / ADJACENCY_RUSH / CALLED_OUT / MYSTIC_MEG). Historic match mode only." },
  { id: "a3",  layer: "attr",    label: "premonition_affinity",   short: "Attr 13",  desc: "Five sub-weights: premonition / prediction / running_commentary / retrospective_call / collective_call. Governs which Premonition Engine mode a character favours. HAUNTED aftermath state suppresses this." },
  { id: "a4",  layer: "attr",    label: "commentary_role",        short: "Attr 12",  desc: "ANCHOR / COLOUR / CHARACTER. Defined at character level. Read by COMMENTARY_ROLE_TAX at panel level. Governs three-horizon weighting (H1/H2/H3) and routing priority." },
  { id: "a5",  layer: "attr",    label: "exaggeration_tendency",  short: "Attr 16",  desc: "0.0–1.0. How much a character amplifies claims beyond evidence. High: overshoots bathos into ROOM_STOPPER more frequently; premonition commits bolder, misses more spectacular; warm insults more extreme." },
  { id: "a6",  layer: "attr",    label: "lie_tendency",           short: "Attr 17",  desc: "0.0–1.0. Propensity to deploy selective truth, misdirection or fabrication. High: bathos used as cover not weapon. Temporal bleed leaks become suspect. Premonition retrospective calls unreliable. Tracy memos are institutional lie_tendency made visible." },
  { id: "a7",  layer: "attr",    label: "wound",                  short: "Attr 2",   desc: "The real thing underneath the mask. Drives Eventually Cracks escalation. When wound fires, character loses performed register entirely. Recovery = ice_breaker_style." },
  { id: "a8",  layer: "attr",    label: "ice_breaker_style",      short: "Attr 18",  desc: "Character-specific recovery mechanic after ROOM_STOPPER or FULL_CRACK. Must acknowledge the room without fully owning the damage. Governs ICE_BREAKER event. Outcome feeds RECOVERY_OUTCOME." },
  { id: "a9",  layer: "attr",    label: "truth_teller_eligible",  short: "Attr 19",  desc: "Boolean. Can this character call out a false RETROSPECTIVE_CALL in the Premonition Engine? Darts: Studd, Lowe, Part only. Separate from CONFLICT_PAIR — being an antagonist does not make you a truth-teller." },
  { id: "a10", layer: "attr",    label: "bathos_register_start",  short: "Attr 20",  desc: "The elevated register this character performs before the drop. Governs how far the drop feels. Blofeld: cosmic. Boycott: authoritative. Tufnell: warmly chaotic." },

  // SHARED MECHANICS
  { id: "m1",  layer: "mechanic",label: "BATHOS",                 short: "Mechanic", desc: "Sudden drop from elevated register to actual feeling underneath. Shared across all panels. Fired by: trigger conditions + bathos_affinity + bathos_register_start. lie_tendency changes whether it lands as weapon or cover. Cricket: not occasional but atmospheric baseline." },
  { id: "m2",  layer: "mechanic",label: "EVENTUALLY_CRACKS",      short: "Mechanic", desc: "Five pressure tiers: SWALLOW → LAUGH_OFF → PASSIVE_AGGRESSIVE → FULL_CRACK → FULL_MONTY. Pressure accumulates from: wound exposure, hostile banter, food/hypochondria collision, asymmetric wound, Tracy memos, wrong premonition, failed recovery." },
  { id: "m3",  layer: "mechanic",label: "PREMONITION_ENGINE",     short: "Mechanic", desc: "COMMIT → RESOLUTION → AFTERMATH. Five modes. Resolution types: EXACT / PARTIAL / MISS / TRANSCENDENT / ABANDONED. Aftermath: GLORY / PARTIAL_CREDIT / HAUNTED / DOUBLED_DOWN. Climax act boosts commit probability." },
  { id: "m4",  layer: "mechanic",label: "TEMPORAL_BLEED",         short: "Mechanic", desc: "Historic match mode only (enabled by ERA_LOCK). Character leaks a future fact without realising. Room reacts with BLEED_RESPONSE. Nobody names it. lie_tendency makes leak suspect." },
  { id: "m5",  layer: "mechanic",label: "FOOD_WEATHER",           short: "Mechanic", desc: "Ambient probabilistic. Marmite effect. Per-character food profiles. Can collide with HYPOCHONDRIA_POOL to add pressure." },
  { id: "m6",  layer: "mechanic",label: "HYPOCHONDRIA_POOL",      short: "Mechanic", desc: "Grows across session. Negative emotional pressure trigger. Collision with FOOD_WEATHER escalates Eventually Cracks pressure." },
  { id: "m7",  layer: "mechanic",label: "HOSTILE_BANTER",         short: "Mechanic", desc: "Sub-functions: SUBTLY_UNDERMINING / BACKHANDED_COMPLIMENT / OUTRIGHT_INSULT / COMPLETE_DISBELIEF / DISGUST. Routed by: commentary_role + conflict_pair + dramatic act (CLIMAX routes more extreme sub-functions)." },
  { id: "m8",  layer: "mechanic",label: "ROUND_TRACKER",          short: "Mechanic", desc: "ROUND_LABELS array. Defcon-style escalating labels per round. roundNote sends named label to every character. Governs unlock conditions (FULL_MONTY eligible rounds 4–5). Tracy memos escalate with rounds." },

  // BEHAVIOURAL EVENTS
  { id: "e1",  layer: "event",   label: "ROOM_STOPPER",           short: "Event",    desc: "Bathos overshoots. Character loses warm register entirely. Contempt lands naked. The room goes quiet. Distinct from FULL_CRACK (wound-driven) — ROOM_STOPPER is bathos-driven overshoot. Frequency scales with exaggeration_tendency." },
  { id: "e2",  layer: "event",   label: "ICE_BREAKER",            short: "Event",    desc: "Recovery event triggered after ROOM_STOPPER or FULL_CRACK. Defined by ice_breaker_style. Must acknowledge the room without fully owning the damage. Outcome: CLEAN / PARTIAL / FAILED — feeds RECOVERY_OUTCOME." },
  { id: "e3",  layer: "event",   label: "FULL_MONTY",             short: "Event",    desc: "Montgomerie walks in as full guest. Escalating presence counter N=1–5. Eligible rounds 4–5 only. The nuclear Eventually Cracks outcome." },
  { id: "e4",  layer: "event",   label: "FULL_CRACK",             short: "Event",    desc: "Eventually Cracks tier 4. Wound fires. Character loses performed register. Unlike ROOM_STOPPER: wound-driven not bathos-driven. Triggers ICE_BREAKER." },
  { id: "e5",  layer: "event",   label: "BIG_FISH_CALL",          short: "Event",    desc: "Darts. 170 remaining → BIG_FISH_OPPORTUNITY (m8 governs window) → Mardle PENDING (conflict_pair routes to Mardle) → CALLED_CORRECT / CALLED_WRONG. Wrong call adds pressure. Once per session." },
  { id: "e6",  layer: "event",   label: "TEMPORAL_BLEED_RESPONSE",short: "Event",    desc: "TRAIL_OFF / MISFIRE / ADJACENCY_RUSH / CALLED_OUT / MYSTIC_MEG. Fired by TEMPORAL_BLEED. Weights from temporal_bleed_affinity. lie_tendency makes MYSTIC_MEG more likely." },
  { id: "e7",  layer: "event",   label: "WADDELL_ECHO",           short: "Event",    desc: "Darts. Studd quotes Waddell once per session without attribution. Comedy is the asymmetry: Studd knows. Waddell doesn't know he's being echoed. It is a bathos moment — warmth masking grief." },
  { id: "e8",  layer: "event",   label: "PREMONITION_AFTERMATH",  short: "Event",    desc: "GLORY: others gain pressure. PARTIAL_CREDIT: character defends once. HAUNTED: suppresses premonition_affinity until next success. DOUBLED_DOWN: stackable, no expiry (Bristow special)." },
  { id: "e9",  layer: "event",   label: "RECOVERY_OUTCOME",       short: "Event",    desc: "Result of ICE_BREAKER attempt. CLEAN: pressure reduces, register resets. PARTIAL: pressure holds, register partly restored. FAILED: pressure increases, next ROOM_STOPPER cheaper to trigger. Closes the recovery feedback loop." },

  // RELATIONSHIP DYNAMICS
  { id: "d3",  layer: "dynamic", label: "WARM_INSULT_TAXONOMY",   short: "Dynamic",  desc: "Cricket-primary, cross-panel available. Four weapons: FAINT_PRAISE_THAT_DAMNS / REMINISCENCE_THAT_WOUNDS / AGREEMENT_THAT_DISAGREES / COMPLIMENT_ABOUT_SPEAKER. Character's preferred weapon is a per-character enum value (not a separate attribute node)." },
  { id: "d4",  layer: "dynamic", label: "ASYMMETRIC_WOUND",       short: "Dynamic",  desc: "A resents B. B is oblivious. C deploys it. Directional wound between specific character pairs. Not mutual. Comedy is the asymmetry. Feeds pressure into EVENTUALLY_CRACKS for A only. WADDELL_ECHO is a live instance of this pattern." },
  { id: "d5",  layer: "dynamic", label: "CONFLICT_PAIR",          short: "Dynamic",  desc: "Named natural antagonists per panel — governs HOSTILE_BANTER routing priority only. Darts: Mardle/Lowe, Bristow/Part, Waddell/Studd. Cricket: Boycott/Blofeld, Agnew/Boycott. Separate from truth_teller_eligible: being an antagonist ≠ being a truth-teller." },

  // PANEL-LEVEL CONCEPTS
  { id: "p1",  layer: "panel",   label: "CRICKET_BASELINE",       short: "Panel",    desc: "Cricket panel operates bathos at panel level not character level. The shared register IS elevated. The drop is structurally always available. DEAD_IN_PANEL_WORLD characters contribute to this ambient register." },
  { id: "p2",  layer: "panel",   label: "COMMENTARY_ROLE_TAX",    short: "Panel",    desc: "ANCHOR / COLOUR / CHARACTER taxonomy. Reads commentary_role from each character — does not define it. Governs three-horizon model and routing priority. truth_teller_eligible is now a separate attribute." },
  { id: "p3",  layer: "panel",   label: "ERA_LOCK",               short: "Panel",    desc: "Historic match mode. Characters cannot reference events after era_knowledge_cutoff. Modern voice, era-locked knowledge. The gap is the comedy. Enables TEMPORAL_BLEED." },
  { id: "p4",  layer: "panel",   label: "DEAD_IN_PANEL_WORLD",    short: "Panel",    desc: "Darts: Waddell, Bristow, Jocky. Golf: various. Present. Unremarked. Their presence is ambient bathos — the elevated register of someone performing alongside the dead. WADDELL_ECHO is the purest expression of this." },
  { id: "p5",  layer: "panel",   label: "TRACY_FROM_HR",          short: "Panel",    desc: "Named ambient constant. Memos. Calendar invites. Escalates with round number. Institutional lie_tendency made visible — Tracy acknowledges nothing directly. Ambient pressure signal." },
  { id: "p6",  layer: "panel",   label: "PANEL_SIZE",             short: "Panel",    desc: "EXP-001: 4 vs 5 vs 6 characters. Ivan metric. Ringelmann hypothesis. Optimum: 5 hypothesised. In-Game mode: 3 min / 4 max, at least 1 ANCHOR mandatory. Constrains commentary role distribution." },
  { id: "p7",  layer: "panel",   label: "DRAMATIC_STRUCTURE",     short: "Panel",    desc: "Football historic: SETUP→CRISIS→CLIMAX→AFTERMATH four-act structure. CLIMAX: boosts premonition commit probability, routes more extreme hostile banter. AFTERMATH: bathos peaks. HALF_TIME between CRISIS and CLIMAX. Structures ROUND_TRACKER." },
];

const EDGES = [
  // attr → mechanic
  { from: "a1",  to: "m1",  label: "governs fire rate",         type: "governs" },
  { from: "a2",  to: "m4",  label: "governs leak+response",     type: "governs" },
  { from: "a3",  to: "m3",  label: "governs mode selection",    type: "governs" },
  { from: "a4",  to: "m7",  label: "governs routing",           type: "governs" },
  { from: "a5",  to: "e1",  label: "scales frequency",          type: "modulates" },
  { from: "a5",  to: "m3",  label: "bolder commits",            type: "modulates" },
  { from: "a6",  to: "m1",  label: "weapon vs cover",           type: "modulates" },
  { from: "a6",  to: "m4",  label: "makes leak suspect",        type: "modulates" },
  { from: "a7",  to: "m2",  label: "drives accumulation",       type: "governs" },
  { from: "a8",  to: "e2",  label: "defines recovery style",    type: "governs" },
  { from: "a9",  to: "m3",  label: "gates truth-teller calls",  type: "governs" },
  { from: "a10", to: "m1",  label: "sets drop distance",        type: "governs" },

  // mechanic → event
  { from: "m1",  to: "e1",  label: "overshoots into",           type: "triggers" },
  { from: "m2",  to: "e3",  label: "tier 5 fires",              type: "triggers" },
  { from: "m2",  to: "e4",  label: "tier 4 fires",              type: "triggers" },
  { from: "m3",  to: "e8",  label: "resolution produces",       type: "triggers" },
  { from: "m4",  to: "e6",  label: "produces response",         type: "triggers" },
  { from: "m5",  to: "m6",  label: "collision escalates",       type: "triggers" },
  { from: "m6",  to: "m2",  label: "adds pressure",             type: "triggers" },
  { from: "m7",  to: "m2",  label: "adds pressure",             type: "triggers" },
  { from: "m8",  to: "m2",  label: "unlocks tiers",             type: "governs" },
  { from: "m8",  to: "e3",  label: "unlock condition",          type: "governs" },
  { from: "m8",  to: "e5",  label: "governs opportunity window",type: "governs" },

  // event → event / feedback loops
  { from: "e1",  to: "e2",  label: "obligates recovery",        type: "triggers" },
  { from: "e4",  to: "e2",  label: "triggers recovery",         type: "triggers" },
  { from: "e2",  to: "e9",  label: "produces outcome",          type: "triggers" },
  { from: "e9",  to: "m2",  label: "adjusts pressure",          type: "modulates" },
  { from: "e9",  to: "e1",  label: "FAILED lowers threshold",   type: "modulates" },
  { from: "e8",  to: "m2",  label: "GLORY adds pressure (others)", type: "feeds" },
  { from: "e8",  to: "a3",  label: "HAUNTED suppresses",        type: "modulates" },
  { from: "e5",  to: "m2",  label: "WRONG adds pressure",       type: "feeds" },
  { from: "e7",  to: "d4",  label: "is an instance of",         type: "feeds" },
  { from: "e7",  to: "m1",  label: "warmth masking grief",      type: "triggers" },

  // dynamic → mechanic/event
  { from: "d3",  to: "m1",  label: "is bathos toolkit",         type: "feeds" },
  { from: "d4",  to: "m2",  label: "creates asymm pressure",    type: "feeds" },
  { from: "d5",  to: "m7",  label: "governs routing",           type: "governs" },
  { from: "d5",  to: "e5",  label: "routes to Mardle",          type: "governs" },

  // panel → mechanic/attr (panels READ attributes, don't write them)
  { from: "p1",  to: "m1",  label: "elevates baseline",         type: "governs" },
  { from: "p2",  to: "m7",  label: "applies role to routing",   type: "governs" },
  { from: "p2",  to: "m3",  label: "applies role to premonition",type: "governs" },
  { from: "p3",  to: "m4",  label: "enables",                   type: "governs" },
  { from: "p4",  to: "m1",  label: "ambient bathos register",   type: "feeds" },
  { from: "p4",  to: "d4",  label: "generates asymmetry",       type: "feeds" },
  { from: "p5",  to: "m2",  label: "ambient pressure",          type: "feeds" },
  { from: "p5",  to: "m8",  label: "escalates with rounds",     type: "feeds" },
  { from: "p5",  to: "a6",  label: "institutional expression of",type: "feeds" },
  { from: "p6",  to: "p2",  label: "constrains role distribution",type: "governs" },
  { from: "p7",  to: "m8",  label: "structures rounds",         type: "governs" },
  { from: "p7",  to: "m7",  label: "CLIMAX routes extreme banter",type: "modulates" },
  { from: "p7",  to: "m3",  label: "CLIMAX boosts commits",     type: "modulates" },
  { from: "p7",  to: "m1",  label: "AFTERMATH peaks bathos",    type: "modulates" },

  // a4 is character-level — p2 reads it, not the other way
  { from: "a4",  to: "p2",  label: "read by",                   type: "feeds" },
];

// ─── LAYOUT (manual x/y in a 1200×700 canvas) ────────────────────────────────

const POSITIONS = {
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
  m1:  { x: 340, y: 60  },
  m2:  { x: 340, y: 170 },
  m3:  { x: 340, y: 280 },
  m4:  { x: 340, y: 370 },
  m5:  { x: 340, y: 450 },
  m6:  { x: 340, y: 520 },
  m7:  { x: 340, y: 590 },
  m8:  { x: 340, y: 660 },
  e1:  { x: 600, y: 60  },
  e2:  { x: 600, y: 150 },
  e3:  { x: 600, y: 240 },
  e4:  { x: 600, y: 310 },
  e5:  { x: 600, y: 390 },
  e6:  { x: 600, y: 460 },
  e7:  { x: 600, y: 530 },
  e8:  { x: 600, y: 600 },
  e9:  { x: 600, y: 670 },
  d3:  { x: 860, y: 100 },
  d4:  { x: 860, y: 280 },
  d5:  { x: 860, y: 460 },
  p1:  { x: 1110, y: 60  },
  p2:  { x: 1110, y: 170 },
  p3:  { x: 1110, y: 280 },
  p4:  { x: 1110, y: 370 },
  p5:  { x: 1110, y: 460 },
  p6:  { x: 1110, y: 550 },
  p7:  { x: 1110, y: 630 },
};

// ─── STYLE CONFIG ─────────────────────────────────────────────────────────────

const LAYER_STYLE = {
  attr:    { bg: "#1a1a2e", border: "#4a9eff", text: "#4a9eff", badge: "#0d3b66" },
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
  mechanic:"SHARED MECHANICS",
  event:   "BEHAVIOURAL EVENTS",
  dynamic: "RELATIONSHIP DYNAMICS",
  panel:   "PANEL CONCEPTS",
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const W = 1260;
const H = 760;
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
              { x: 340,  label: "MECHANICS",layer: "mechanic"},
              { x: 600,  label: "EVENTS",   layer: "event"   },
              { x: 860,  label: "DYNAMICS", layer: "dynamic" },
              { x: 1110, label: "PANEL",    layer: "panel"   },
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
                  v2 STRUCTURAL FIXES<br/>
                  <span style={{ color: "#ff6b3566" }}>+ e9 RECOVERY_OUTCOME (feedback loop)</span><br/>
                  <span style={{ color: "#4a9eff66" }}>+ a9 truth_teller_eligible (split from d5)</span><br/>
                  <span style={{ color: "#ff444466" }}>− d1 EXAGGERATION_DYNAMIC (collapsed to a5)</span><br/>
                  <span style={{ color: "#ff444466" }}>− d2 LIE_DYNAMIC (collapsed to a6)</span><br/>
                  <span style={{ color: "#ff444466" }}>− a9 warm_insult_preferred (merged into d3)</span><br/>
                  <span style={{ color: "#06d6a066" }}>d5 CONFLICT_PAIR: routing only</span><br/>
                  <span style={{ color: "#06d6a066" }}>p2 now reads a4, not writes it</span><br/>
                  <span style={{ color: "#ffd60a66" }}>e5, e7, e8, p4, p5, p7 wired</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
