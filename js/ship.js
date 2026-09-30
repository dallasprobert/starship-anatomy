/* Starship Anatomy: ship view ("ship cutaway").
   Four instruments for the Starship V3 upper stage:
     1. A drafted elevation: windward face on the left half, a section through the centreline on the right half,
        plus a leeward view (View B) for the docking and transfer hardware.
     2. A heat-shield explorer that peels the tile field down to the steel and blows it apart into a section.
     3. A scrubbable reentry, flip and landing sequence on the planned Flight 14 timeline, and a flap lab that shows
        how the four flaps trim a falling ship in pitch.
     4. A bottom view of the six engines with nozzle exits to scale.
   Height, diameter and engine sizes come from SX facts. Internal stations are estimates from the ring layout
   reported by NASASpaceflight and Ringwatchers (dossier 04, "Components"); the fact notes say so. */
(function () {
  'use strict';
  const SX = window.SX;
  if (!SX) return;

  const el = SX.el;
  const svg = SX.svg;
  const RM = SX.reducedMotion;

  /* ================================================================== facts this view adds */

  SX.addFacts({
    'ship.noseconeHeight': { v: 14, unit: 'm', conf: 'reported', src: ['S50'], note: 'About 14 m on V2 (Ringwatchers). NSF reports V3 external dimensions are unchanged from V2.' },
    'ship.payloadBarrel': { v: 5.5, unit: 'm', conf: 'reported', src: ['SS4', 'SS5'], note: 'Three steel rings, about 5.5 m, since V2. V3 keeps the same three-ring payload barrel (NSF, "N:3").' },
    'ship.ringHeight': { v: 1.8, unit: 'm', conf: 'reported', src: ['S50'], note: 'About 1.83 m (6 ft) per rolled steel ring.' },
    'ship.fwdFlapSpacing': { v: 140, unit: '°', conf: 'reported', src: ['S50'], note: 'Angle between the two forward flaps since V2, swung toward the leeward side. On V1 they sat 180 degrees apart like the aft pair.' },
    'ship.aftFlapSpacing': { v: 180, unit: '°', conf: 'reported', src: ['S50'], note: 'The aft flaps sit on opposite sides of the ship.' },
    'ship.aftFlapActuator': { v: 'One actuator with three motors per flap', unit: '', conf: 'official', src: ['S2'], note: 'V3 change for redundancy; earlier ships used two actuators per aft flap.' },
    'ship.transferDemo': { v: 5, unit: 't', conf: 'official', src: ['S9'], note: 'Flight 3 (2024): about 5 t of liquid oxygen moved from a header tank to a main tank inside one ship. No ship-to-ship transfer has been attempted as of 2026-09-29.' },
    'ship.propTotalV2': { v: 1500, unit: 't', conf: 'official', src: ['S10'], note: 'V2 ship propellant capacity (SpaceX vehicle page, 2025).' },
    'ship.skirtHeightV2': { v: 7, unit: 'm', conf: 'reported', src: ['SS3'], note: 'V2 aft skirt: just over 7 m tall with 156 internal stringer columns. The V3 skirt height is not published.' },
    'ship.f12Deploy': { v: 22, unit: 'satellites', conf: 'official', src: ['S7'], note: 'Flight 12: 20 Starlink simulators plus 2 camera satellites.' },
    'ship.f13Deploy': { v: 20, unit: 'satellites', conf: 'official', src: ['S6'], note: 'Flight 13: 20 Starlink V3 satellites on a suborbital path.' },
    'ship.f14.subsonicT': { v: 35287, unit: 's', conf: 'official', src: ['S5'], note: 'Planned T+9:48:07 on the full-length Flight 14 timeline.' },
    'ship.f14.threeToTwoT': { v: 35421, unit: 's', conf: 'official', src: ['S5'], note: 'Planned T+9:50:21: landing burn steps from three sea-level engines to two.' },
    'ship.f14.twoToOneT': { v: 35428, unit: 's', conf: 'official', src: ['S5'], note: 'Planned T+9:50:28: landing burn steps from two engines to one.' },
    'ship.hls.volume': { v: 600, unit: 'm³', conf: 'official', src: ['S9'], note: 'HLS lunar lander: more than 600 m3 of pressurized volume.' },
    'ship.hls.airlock': { v: 13, unit: 'm³', conf: 'official', src: ['S9'], note: 'About 13 m3 each; HLS has two airlocks.' },
    'ship.cargoLanderPayload': { v: 100, unit: 't', conf: 'official', src: ['S9'], note: 'Cargo lander: up to 100 t to the lunar surface.' },
    'ship.crewCapacity': { v: 100, unit: 'people', conf: 'official', src: ['S1'], note: 'SpaceX: up to 100 people on long-duration, interplanetary flights (future crew configuration).' },
    'ship.ablativeSince': { v: 'Ship 30 (Flight 5, 2024)', unit: '', conf: 'reported', src: ['SS1', 'SS2'], note: 'A black ablative backup layer under the felt blanket. Ship 41 (Flight 14) extended it.' },
    'ship.gapFiller': { v: 'Felt gap filler packed between tiles', unit: '', conf: 'reported', src: ['SS2'], note: 'Added after Flight 10 showed hot gas seeping through tile gaps.' },
    'ship.tilePinsV3': { v: 'Simpler pin; nearly every tile pinned', unit: '', conf: 'reported', src: ['SS6', 'S24'], note: 'V3 pins almost every tile; glue remains only at the nose tip and a few spots. A horizontal tile seam on the nose was removed.' },
    'ship.metallicTiles': { v: 'Tested on Flight 10 (three on Ship 37, one actively cooled)', unit: '', conf: 'reported', src: ['SS2'], note: 'Bill Gerstenmaier later said they "didn\'t work so well" (as reported from a September 2025 talk).' },
    'ship.f14.entryToLanding': { v: null, unit: 'min', conf: 'estimate', src: ['S5'], note: 'Derived from the planned Flight 14 timeline: landing (T+9:50:30) minus entry (T+9:28:56).' },
    'ship.exitAreaRatio': { v: null, unit: '×', conf: 'estimate', src: ['S1'], note: 'Derived: (2.3 m / 1.3 m) squared, from the engine diameters SpaceX lists. Treats each listed diameter as the nozzle exit.' },
  }, {
    SS1: { title: 'The Bestagons: Starship\'s Upgraded Heat Shield (V2 tiles, pins, felt, ablative layer)', publisher: 'Ringwatchers', date: '2025', url: 'https://ringwatchers.com/article/s33-tps' },
    SS2: { title: 'The Tilewatchers: Analyzing Ship 37\'s Tile Experiments (Flight 10 metallic tiles, removed tiles, catch fittings)', publisher: 'Ringwatchers', date: '2025', url: 'https://ringwatchers.com/article/s37-tps' },
    SS3: { title: 'The Business End: Starship\'s Upgraded Aft Section (V2 skirt, vents, flap actuators, gimballing engines)', publisher: 'Ringwatchers', date: '2025', url: 'https://ringwatchers.com/article/s33-aft' },
    SS4: { title: 'It\'s Electrifying: Starship\'s Upgraded Payload Deployment System (V2 payload bay, PEZ dispenser, door)', publisher: 'Ringwatchers', date: '2025', url: 'https://ringwatchers.com/article/s33-pez' },
    SS5: { title: 'From Steel Rolls to Starship at the Starfactory (V3 section layout)', publisher: 'NASASpaceflight', date: '2026-03-13', url: 'https://www.nasaspaceflight.com/2026/03/steel-rolls-to-starship/' },
    SS6: { title: 'Flight 12: Ship 39 rolls out to Masseys to begin testing (V3 tile pins)', publisher: 'NASASpaceflight', date: '2026-02-27', url: 'https://www.nasaspaceflight.com/2026/02/ship-39-masseys-testing/' },
    SS7: { title: 'Starship Flight 12: Ship 39 moving through preflight test objectives', publisher: 'NASASpaceflight', date: '2026-03-03', url: 'https://www.nasaspaceflight.com/2026/03/ship-39-preflight-test-objectives/' },
    SS8: { title: 'Forward flap placement on the first ships was "a slight error"', publisher: 'Elon Musk on X', date: '2021-08-18', url: 'https://x.com/elonmusk/status/1427939016645627904' },
    SS9: { title: 'SpaceX will try for 1st Starship tower catch "in a few months," Elon Musk says (Ship 40 recovery)', publisher: 'Space.com', date: '2026-08-20', url: 'https://www.space.com/space-exploration/launches-spacecraft/spacex-will-try-for-1st-starship-tower-catch-in-a-few-months-elon-musk-says' },
    SS10: { title: 'On the Path to Rapid Reusability (Flight 3 report: roll control lost to clogged valves)', publisher: 'SpaceX', date: '2024-05-24', url: 'https://www.spacex.com/updates' },
    SS11: { title: 'Flight 9 and Ship 36 Report (COPV failure on the test stand, lower operating pressures)', publisher: 'SpaceX', date: '2025-08-15', url: 'https://www.spacex.com/updates' },
  });

  // Derived facts: fill the values from the canonical ones so the arithmetic is never hand-typed.
  (function derive() {
    const tl = (id) => { const e = (SX.data.timeline || []).find((x) => x.id === id); return e ? e.t : null; };
    const f1 = SX.fact('ship.f14.entryToLanding');
    const a = tl('entry'), b = tl('splashdown');
    if (f1 && f1.v == null && a != null && b != null) f1.v = Math.round(((b - a) / 60) * 10) / 10;
    const f2 = SX.fact('ship.exitAreaRatio');
    const dv = SX.val('raptor.rvac3.exitDiameter', null), ds = SX.val('raptor.r3.exitDiameter', null);
    if (f2 && f2.v == null && dv && ds) f2.v = Math.round((dv / ds) * (dv / ds) * 10) / 10;
  })();

  /* ================================================================== small helpers */

  const TL = (id) => { const e = (SX.data.timeline || []).find((x) => x.id === id); return e ? e.t : null; };
  /** seconds after liftoff -> "T+9:50:13" */
  function clock(sec) {
    if (sec == null || isNaN(sec)) return 'T+?';
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return 'T+' + h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  const confOf = (key) => { const f = SX.fact(key); return f && SX.CONF[f.conf] ? f.conf : 'missing'; };
  const U = (s) => String(s).toUpperCase();
  const fx = (n) => Math.round(n * 100) / 100;
  /** Deterministic pseudo-random numbers so the tile field looks the same on every load. */
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function partName(id) { const p = SX.part(id); return p ? p.name : id; }
  function partShort(id) { const p = SX.part(id); return p ? (p.summary || '') : ''; }
  function firstSentence(html) {
    const t = String(html || '').replace(/<[^>]+>/g, '').replace(/\{\{[^}]+\}\}/g, (m) => {
      const k = m.slice(2, -2).split('|')[0].trim(); return SX.fmt(k);
    });
    const i = t.indexOf('. ');
    return i > 0 && i < 220 ? t.slice(0, i + 1) : t.slice(0, 220);
  }

  /* ================================================================== styles */

  SX.css(`
.v-ship {
  --sh-gap: clamp(20px, 3vw, 40px);
  /* derived shades of the page palette: dark metal ramp, felt, sea, sky */
  --sh-k0: #07090c; --sh-k1: #131619; --sh-k2: #282e35; --sh-k3: #3a424b; --sh-k4: #4b545e;
  --sh-k5: #5b6570; --sh-k6: #6b7581; --sh-k8: #a3aeb8;
  --sh-felt: #d6dade; --sh-felt-2: #b8bec5; --sh-char: #8d6b4f;
  --sh-shadow: rgba(0, 0, 0, 0.35); --sh-sea: #0f2233; --sh-wave: #23425c; --sh-sky-a: #0a0f16; --sh-sky-b: #13202e;
}
.v-ship .sh-sec + .sh-sec { margin-top: clamp(56px, 8vw, 100px); }
.v-ship .sh-sec-head { display: flex; align-items: baseline; gap: 10px 14px; flex-wrap: wrap; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.v-ship .sh-sec-head .eyebrow { color: var(--accent); }
.v-ship .sh-sec-head .small { flex-basis: 100%; }
@media (min-width: 900px) { .v-ship .sh-sec-head .small { flex-basis: auto; } }
.v-ship .sh-row { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: var(--sh-gap); align-items: start; }
.v-ship .sh-row + .sh-row { margin-top: clamp(28px, 4vw, 44px); }
.v-ship .sh-col { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; min-width: 0; align-content: start; }
.v-ship .spec-table .fact { white-space: normal; }
@media (max-width: 900px) {
  .v-ship .sh-row { grid-template-columns: minmax(0, 1fr); }
  .v-ship .sh-row > .sh-fig { order: -1; }
}
.v-ship .prose { font-size: 14.5px; }
.v-ship .prose p + p { margin-top: 0.75em; }
.v-ship .sh-note { font: 400 11px/1.45 var(--font-mono); color: var(--muted); letter-spacing: 0.02em; }
.v-ship .sh-kv { width: 100%; }
.v-ship .sh-kv th { width: 48%; }
.v-ship .sh-card-h { font: 500 10px/1 var(--font-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }

/* parts list (the drawing's key) */
.v-ship .sh-plist { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap: 2px 12px; }
.v-ship .sh-plist button { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: center; width: 100%; text-align: left; background: none; border: 0; border-radius: 4px; padding: 5px 6px; color: var(--fg-2); font: 400 13px/1.25 var(--font-body); cursor: pointer; }
.v-ship .sh-plist button:hover, .v-ship .sh-plist button.is-hover { background: var(--bg-3); color: var(--fg); }
.v-ship .sh-plist button.is-selected { background: var(--accent-soft); color: var(--accent); }
.v-ship .sh-plist .n { display: inline-grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--line-2); font: 500 10px/1 var(--font-mono); color: var(--muted); font-variant-numeric: tabular-nums; }
.v-ship .sh-plist button.is-selected .n { border-color: var(--accent); color: var(--accent); }
.v-ship .sh-group-h { grid-column: 1 / -1; font: 500 10px/1 var(--font-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); padding: 10px 6px 4px; }

/* figures */
.v-ship .sh-fig { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; min-width: 0; }
.v-ship .sh-fig .viz { min-width: 0; }
.v-ship .sh-scroll { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; }
.v-ship .sh-cut svg { max-height: 92vh; }
.v-ship .sh-controls { display: grid; gap: 12px; padding: 14px 16px; }
.v-ship .sh-controls .row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.v-ship .viz-toolbar .seg, .v-ship .viz-toolbar .btn { box-shadow: 0 4px 14px var(--sh-shadow); }
.v-ship .sh-legend { padding: 10px 14px 12px; border-top: 1px solid var(--line); }
.v-ship .viz .sh-titlebar { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding: 10px 14px; border-bottom: 1px solid var(--line); font: 500 10px/1.3 var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.v-ship .viz .sh-titlebar b { color: var(--fg); font-weight: 500; }

/* SVG vocabulary */
.v-ship svg text { font-family: var(--font-mono); }
.v-ship .lbl { fill: var(--fg); font-size: 11px; font-weight: 500; letter-spacing: 0.04em; }
.v-ship .lbl-sub { fill: var(--muted); font-size: 9.5px; letter-spacing: 0.03em; }
.v-ship .lbl-title { fill: var(--muted); font-size: 10px; letter-spacing: 0.12em; }
.v-ship .lbl-big { fill: var(--fg); font-size: 13px; font-weight: 500; letter-spacing: 0.06em; }
.v-ship .ldr { stroke: var(--steel-2); stroke-width: 0.9; fill: none; }
.v-ship .ldr-dot { fill: var(--steel); }
.v-ship .dim { stroke: var(--muted); stroke-width: 0.9; fill: none; }
.v-ship .dim-t { fill: var(--fg-2); font-size: 10.5px; letter-spacing: 0.03em; }
.v-ship .cdot { font-size: 7px; }
.v-ship .c-official { fill: var(--good); } .v-ship .c-reported { fill: var(--conf-rep); }
.v-ship .c-estimate { fill: var(--warn); } .v-ship .c-disputed { fill: var(--bad); } .v-ship .c-missing { fill: var(--muted); }
.v-ship .axis { stroke: var(--muted); stroke-width: 0.7; stroke-dasharray: 10 3 2 3; fill: none; opacity: 0.8; }
.v-ship .hidden-line { stroke: var(--steel-2); stroke-width: 0.9; stroke-dasharray: 3 2.5; fill: none; }
.v-ship .steel-fill { fill: var(--bg-3); }
.v-ship .steel-s { stroke: var(--steel); stroke-width: 1.1; fill: none; }
.v-ship .steel-s2 { stroke: var(--steel-2); stroke-width: 0.8; fill: none; }
.v-ship .f-lox { fill: var(--lox); fill-opacity: 0.3; }
.v-ship .f-ch4 { fill: var(--ch4); fill-opacity: 0.3; }
.v-ship .s-lox { stroke: var(--lox); } .v-ship .s-ch4 { stroke: var(--ch4); }
.v-ship .no-prop .f-lox, .v-ship .no-prop .f-ch4 { fill-opacity: 0.03; }
.v-ship .f-lox-solid { fill: var(--lox); fill-opacity: 0.55; }
.v-ship .f-ch4-solid { fill: var(--ch4); fill-opacity: 0.55; }
.v-ship .f-tile { fill: var(--tile); }
.v-ship .tile-edge { stroke: var(--sh-k3); stroke-width: 0.6; fill: none; }
.v-ship .f-bay { fill: var(--bg-2); fill-opacity: 0.9; }
.v-ship .f-copv { fill: var(--bg-4); stroke: var(--steel-2); stroke-width: 0.7; }
.v-ship .f-engine { fill: var(--bg-4); stroke: var(--steel); stroke-width: 0.9; }
.v-ship .f-nozzle { fill: var(--sh-k2); stroke: var(--steel); stroke-width: 0.9; }
.v-ship .f-copper { fill: var(--copper); fill-opacity: 0.85; }
.v-ship .hit { fill: none; stroke: transparent; stroke-width: 12; pointer-events: stroke; }
.v-ship .hitf { fill: transparent; stroke: none; }
.v-ship .off { display: none; }
.v-ship [data-layer].is-off { display: none; }

/* parts in SVG */
.v-ship .part { outline: none; }
.v-ship .part .hl { transition: stroke 0.15s; }
.v-ship .part.is-hover .hl { stroke: var(--fg); }
.v-ship .part.is-selected .hl { stroke: var(--accent); }
.v-ship .part:focus-visible .hl { stroke: var(--accent); }
.v-ship .part.is-selected .hl-fill { fill: var(--accent); fill-opacity: 0.18; }
.v-ship g.lab.is-selected .lbl { fill: var(--accent); }
.v-ship g.lab.is-selected .ldr { stroke: var(--accent); }
.v-ship g.lab.is-selected .ldr-dot { fill: var(--accent); }
.v-ship g.lab.is-hover .lbl { fill: var(--accent); }
.v-ship g.lab { cursor: pointer; }
.v-ship .balloon circle { fill: var(--bg-2); stroke: var(--steel-2); stroke-width: 0.9; }
.v-ship .balloon text { fill: var(--fg); font-size: 10px; font-weight: 500; }
.v-ship g.lab.is-selected .balloon circle { stroke: var(--accent); fill: var(--accent-soft); }
.v-ship g.lab.is-selected .balloon text { fill: var(--accent); }
@keyframes sh-pulse { 0% { opacity: 1; } 30% { opacity: 0.35; } 60% { opacity: 1; } 80% { opacity: 0.55; } 100% { opacity: 1; } }
.v-ship .part.sh-pulse { animation: sh-pulse 1.2s ease-in-out 1; }
.v-ship .sh-panel-pulse { animation: sh-pulse 1.2s ease-in-out 1; }

/* narrow screens: SVG text is drawn larger so it survives the scale-down */
.v-ship svg.is-narrow .lbl-sub { font-size: 16px; }
.v-ship svg.is-narrow .lbl { font-size: 17px; }
.v-ship svg.is-narrow .lbl-title { font-size: 15px; }
.v-ship svg.is-narrow .ev-lbl { font-size: 15px; }
.v-ship svg.is-narrow .re-tick { font-size: 17px; }

/* heat shield explorer */
.v-ship .hs-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0; }
.v-ship .hs-grid > div { min-width: 0; }
.v-ship .hs-grid > div + div { border-left: 1px solid var(--line); }
@media (max-width: 640px) { .v-ship .hs-grid { grid-template-columns: minmax(0, 1fr); } .v-ship .hs-grid > div + div { border-left: 0; border-top: 1px solid var(--line); } }
.v-ship .hs-tile { transform-box: fill-box; transform-origin: 50% 50%; }
.v-ship .hs-lost { transition: transform 0.7s cubic-bezier(.3, .6, .3, 1), opacity 0.7s; }
.v-ship .f-felt { fill: var(--sh-felt); }
.v-ship .f-felt-s { fill: var(--sh-felt); }
.v-ship .f-abl { fill: var(--sh-k1); }
.v-ship .f-steelplate { fill: var(--steel-2); }
.v-ship .f-pin { fill: var(--steel); stroke: var(--sh-k4); stroke-width: 0.6; }
.v-ship .f-char { fill: var(--bad); }
.v-ship .gas-path { stroke: var(--accent); stroke-width: 2; fill: none; stroke-linejoin: round; }
.v-ship .gas-straight { stroke: var(--bad); stroke-width: 2; fill: none; stroke-dasharray: 5 4; }

/* reentry + flap lab */
.v-ship .re-phases { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.v-ship .re-phases button { display: grid; grid-template-columns: 7.2em minmax(0, 1fr); gap: 10px; width: 100%; text-align: left; background: none; border: 0; border-left: 2px solid var(--line); padding: 6px 8px 6px 10px; color: var(--fg-2); cursor: pointer; font: 400 13px/1.35 var(--font-body); }
.v-ship .re-phases button:hover { background: var(--bg-3); color: var(--fg); }
.v-ship .re-phases button[aria-current="true"] { border-left-color: var(--accent); color: var(--fg); background: var(--accent-soft); }
.v-ship .re-phases .t { font: 500 11.5px/1.35 var(--font-mono); color: var(--muted); font-variant-numeric: tabular-nums; }
.v-ship .re-phases button[aria-current="true"] .t { color: var(--accent); }
.v-ship .re-phases .d { display: block; font-size: 12px; color: var(--muted); margin-top: 1px; }
.v-ship .re-scrub { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center; }
.v-ship .re-clock { font: 500 14px/1 var(--font-mono); font-variant-numeric: tabular-nums; color: var(--fg); min-width: 7.5ch; text-align: right; }
.v-ship .re-hud-clock { fill: var(--fg); font-size: 18px; font-weight: 500; font-variant-numeric: tabular-nums; }
.v-ship .re-hud-phase { fill: var(--accent); font-size: 11px; letter-spacing: 0.08em; }
.v-ship .sky-a { stop-color: var(--sh-sky-a); } .v-ship .sky-b { stop-color: var(--sh-sky-b); }
.v-ship .sea { fill: var(--sh-sea); stroke: var(--line-2); stroke-width: 1; }
.v-ship .traj { stroke: var(--steel-2); stroke-width: 1; stroke-dasharray: 4 4; fill: none; }
.v-ship .traj-done { stroke: var(--fg-2); stroke-width: 1.4; fill: none; }
.v-ship .heat-a { stop-color: var(--warn); } .v-ship .heat-b { stop-color: var(--bad); }
.v-ship .plume-a { stop-color: var(--mix); } .v-ship .plume-b { stop-color: var(--plume); }
.v-ship .force-drag { stroke: var(--fg); stroke-width: 2; fill: none; }
.v-ship .force-drag-h { fill: var(--fg); }
.v-ship .force-body { stroke: var(--steel-2); stroke-width: 2; fill: none; }
.v-ship .force-body-h { fill: var(--steel-2); }
.v-ship .moment { stroke: var(--accent); stroke-width: 2.4; fill: none; }
.v-ship .moment-h { fill: var(--accent); }
.v-ship .flow { stroke: var(--muted); stroke-width: 1; fill: none; opacity: 0.6; }
.v-ship .cg circle { fill: var(--bg); stroke: var(--fg); stroke-width: 1; }
.v-ship .cg path { fill: var(--fg); }
.v-ship .lab-read { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
.v-ship .lab-read div { background: var(--bg-2); padding: 10px 12px; }
.v-ship .lab-read dt { font: 500 10px/1.2 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.v-ship .lab-read dd { margin: 4px 0 0; font: 600 18px/1.1 var(--font-display); letter-spacing: 0.02em; text-transform: uppercase; }
.v-ship .lab-read dd.up { color: var(--good); } .v-ship .lab-read dd.down { color: var(--warn); }

.v-ship .viz svg.re-icon { width: 40px; height: 40px; flex: none; }
.v-ship .viz svg.re-flaps { width: 104px; height: 50px; flex: none; }
.v-ship .sh-plist .n i { display: none; }
.v-ship .sh-plist.is-wide .n { font-size: 0; border-color: transparent; }
.v-ship .sh-plist.is-wide .n i { display: block; width: 9px; height: 9px; border-radius: 2px; background: var(--steel-2); }
.v-ship .sh-plist.is-wide .n i.c-lox { background: var(--lox); } .v-ship .sh-plist.is-wide .n i.c-ch4 { background: var(--ch4); }
.v-ship .sh-plist.is-wide .n i.c-tile { background: var(--tile); border: 1px solid var(--line-2); } .v-ship .sh-plist.is-wide .n i.c-eng { background: var(--plume); }
.v-ship .sh-plist.is-wide .n i.c-steel { background: var(--steel); }

/* engine layout */
.v-ship .eng-lit { fill: var(--plume); fill-opacity: 0.35; }
.v-ship .eng-off { opacity: 0.35; }
.v-ship .eng-ring { fill: none; stroke: var(--steel-2); stroke-width: 0.8; }
.v-ship .sh-mini { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.v-ship .sh-mini .panel { padding: 12px 14px; }
.v-ship .sh-mini h4 { font: 600 15px/1.2 var(--font-display); letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 6px; }
.v-ship .sh-cardbtn { all: unset; cursor: pointer; color: var(--fg); border-bottom: 1px dotted var(--line-2); }
.v-ship .sh-cardbtn:hover, .v-ship .sh-cardbtn.is-selected { color: var(--accent); border-bottom-color: var(--accent); }
.v-ship .sh-cardbtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (max-width: 420px) { .v-ship .sh-mini { grid-template-columns: minmax(0, 1fr); } }
`);

  /* ================================================================== part nodes */

  const ID = {
    ship: 'ship', nose: 'ship.nose', hLOX: 'ship.headerLOX', hCH4: 'ship.headerCH4', bay: 'ship.payloadBay',
    fwd: 'ship.flapsFwd', aft: 'ship.flapsAft', ch4: 'ship.ch4Tank', cd: 'ship.commonDome', lox: 'ship.loxTank',
    hs: 'ship.heatShield', rcs: 'ship.rcs', pins: 'ship.catchPins', ports: 'ship.transferPorts', av: 'ship.avionics',
    bayE: 'ship.engineBay', sl: 'ship.enginesSL', vac: 'ship.enginesVac',
    copv: 'ship.nose.copvs', pez: 'ship.payloadBay.pez', fd: 'ship.ch4Tank.forwardDome', dc: 'ship.ch4Tank.downcomer',
    ad: 'ship.loxTank.aftDome', attic: 'ship.engineBay.attic',
    tile: 'ship.heatShield.tile', tpin: 'ship.heatShield.pins', felt: 'ship.heatShield.felt', abl: 'ship.heatShield.backup',
  };

  SX.addParts([
    { id: ID.ship, parent: 'stack', name: 'Starship', short: 'Ship', kind: 'Second stage and spacecraft', order: 2, view: 'ship',
      summary: 'The upper stage and the spacecraft in one steel hull, {{ship.height}} tall and {{ship.diameter}} wide. It finishes the climb to orbit on six Raptor 3 engines, carries the payload, and comes home belly-first behind a ceramic heat shield before flipping upright to land.',
      body: [
        'A conventional rocket splits three jobs between separate pieces: an upper stage, a payload fairing and, if anything comes back at all, a small reentry capsule. Starship does all three with one vehicle. Its stainless-steel tank walls are also its outer skin, so the same structure holds {{ship.propTotal}} of liquid oxygen and liquid methane on the way up and survives reentry on the way down.',
        'From the top: a nosecone holding two small header tanks and many high-pressure gas bottles, a short payload bay, the methane tank, the larger liquid-oxygen tank, and an unpressurized engine bay with three sea-level Raptors and three Raptor Vacuum engines. Four flaps steer it through the atmosphere, and black hexagonal tiles cover the windward side.',
        'Version 3 keeps the V2 outside dimensions but lowers the common dome and aft dome by about {{ship.domeLowering}} and tucks the vacuum engines slightly up into the LOX tank. That adds about 100 t of propellant (V2: {{ship.propTotalV2}}). V3 also brings Raptor 3, fully vacuum-jacketed header feed lines, one three-motor actuator per aft flap, four docking drogues, a redesigned reaction control system and new avionics that NASASpaceflight reports were designed for about {{ship.orbitEndurance}} in orbit.',
        'Status on {{flight.firstOrbit}}: Ship 41 reached orbit on Flight 14 and deployed Starlink V3 satellites ({{flight.f14Starlinks}}), the first operational payload Starship has delivered. Ship 40 (Flight 13) was the first ship to survive splashdown intact. No ship has been caught by the tower yet.',
        '<b>Variants.</b> SpaceX describes several configurations of the same basic ship. The <b>Starlink ship</b> flying now has a slot door and a "PEZ" dispenser. A <b>tanker</b> is a V3 ship fitted with docking probes that carries propellant up to another ship, and a <b>propellant depot</b> is a long-duration storage ship in orbit (SpaceX has completed a depot power module demonstration). The <b>Human Landing System</b> for NASA has no flaps or heat shield because it never returns to Earth; it has landing legs, a crew elevator, two airlocks of about {{ship.hls.airlock}} each and more than {{ship.hls.volume}} of pressurized volume. A <b>cargo lander</b> version is meant to put up to {{ship.cargoLanderPayload}} on the lunar surface, and a future <b>crew ship</b> is quoted at up to {{ship.crewCapacity}} on long flights. None of the tanker, depot, lander or crew versions has flown yet.',
        'The next generation is still a plan. SpaceX\'s S-1 filing says payload could reach about {{v4.payloadReusable}}, "potentially as soon as Starship V4", and Musk\'s May 2025 presentation showed a V4 ship with {{v4.shipEngines}}.',
      ],
      specs: [
        { label: 'Height', fact: 'ship.height' }, { label: 'Diameter', fact: 'ship.diameter' },
        { label: 'Propellant', fact: 'ship.propTotal' }, { label: 'LOX (derived)', fact: 'ship.propLOX' }, { label: 'Methane (derived)', fact: 'ship.propCH4' },
        { label: 'Thrust, vacuum', fact: 'ship.thrustVac' }, { label: 'Sea-level Raptor 3', fact: 'ship.enginesSL' }, { label: 'Raptor Vacuum 3', fact: 'ship.enginesVac' },
        { label: 'Payload, reusable (at least)', fact: 'stack.payloadLEOReusable' }, { label: 'Dry mass', fact: 'ship.dryMass' },
        { label: 'Flaps', fact: 'ship.flapCount' }, { label: 'Docking drogues', fact: 'ship.dockingDrogues' }, { label: 'Physical sensors', fact: 'ship.sensors' },
        { label: 'Ship catches so far', fact: 'flight.shipCatches' },
      ],
      related: ['booster', 'raptor3', 'flight.entry', 'flight.landing', 'ground.chopsticks'] },

    { id: ID.nose, parent: ID.ship, name: 'Nosecone', kind: 'Structure', order: 1, view: 'ship',
      summary: 'The ogive-shaped cap, about {{ship.noseconeHeight}} tall. It holds both header tanks, most of the high-pressure gas bottles and the forward flap mounts, and its lower part is usable payload space.',
      body: [
        'Since V2 the nosecone is stiffened by internal stringers instead of the large "flap frames" of earlier ships. That opened its lower part to payload, which is why the payload barrel below could shrink to three rings without losing much volume (Ringwatchers).',
        'Tiles run well onto the leeward side of the nose, because the flow wraps around the tip during entry. V3 removed a horizontal tile seam on the nose, and the nose tip is one of the few places where tiles are still bonded rather than pinned. NSF reported new vents beneath the nose-cone tiles on V3; on V2 the header tanks vented through bidirectional vents on each side of the nose, staggered so the oxygen and methane plumes never mix.',
        'On V3 the tower catch and lift points moved higher up the nose (see catch points). Positions in the drawing are estimates from the reported ring layout.',
      ],
      specs: [{ label: 'Height (V2, reported)', fact: 'ship.noseconeHeight' }, { label: 'Header tanks', fact: 'ship.headerTanks' }, { label: 'COPVs on Ship 39', fact: 'ship.copvs' }],
      related: [ID.hLOX, ID.hCH4, ID.fwd, ID.pins] },

    { id: ID.copv, parent: ID.nose, name: 'Pressure vessels (COPVs)', kind: 'Pressurization', order: 3, view: 'ship',
      summary: 'Composite-overwrapped bottles of high-pressure gas for igniters, turbopump spin-up, purges, valves and header pressurization. NSF counted {{ship.copvs}} on Ship 39.',
      body: [
        'Most COPVs cluster around the methane header in the nose, mostly on the windward side; more sit at the base of the payload bay. V3 carries more of them than V1 or V2 because Raptor 3 needs more gas held in orbit for longer (NSF).',
        'In June 2025 a damaged COPV in the payload bay destroyed Ship 36 on a test stand. SpaceX then lowered COPV operating pressures and added inspections and protective covers (SpaceX, Flight 9 and Ship 36 report).',
      ],
      specs: [{ label: 'Count (Ship 39, at least)', fact: 'ship.copvs' }],
      related: [ID.hCH4, ID.bay] },

    { id: ID.hLOX, parent: ID.ship, name: 'LOX header tank', kind: 'Propellant tank', order: 2, view: 'ship',
      summary: 'A small liquid-oxygen tank that forms the tip of the nose. It holds the oxygen the engines burn during the landing flip and burn, when the main tanks cannot be trusted to deliver liquid.',
      body: [
        'During the belly-first fall the propellant left in the main tanks sloshes against the side walls. Raptor needs solid liquid at its inlets to relight, and a froth of liquid and gas can starve a turbopump. So the ship keeps a separate, small supply of each propellant for landing, fed down long lines to the engines.',
        'The tank\'s upper wall is the nose tip itself. A conical sump at its bottom leads into the transfer line; the V3 part was labelled "V3 LOX CONE" when first spotted (NSF). SpaceX says V3 has 100% vacuum jacketing on the header feed system, so the long lines from the nose to the engines are insulated like a thermos and the oxygen stays cold on long coasts.',
        'The only propellant transfer Starship has flown so far used this plumbing: on Flight 3 in 2024 the ship moved about {{ship.transferDemo}} of liquid oxygen from a header tank to a main tank. Header capacities are not published.',
      ],
      specs: [{ label: 'Position', value: 'Nose tip, about 95 to 100% of height', conf: 'estimate' }, { label: 'Capacity', value: 'Not published' }, { label: 'In-ship transfer demo', fact: 'ship.transferDemo' }],
      related: [ID.hCH4, ID.sl, 'flight.flip', 'flight.landing'] },

    { id: ID.hCH4, parent: ID.ship, name: 'Methane header tank', kind: 'Propellant tank', order: 3, view: 'ship',
      summary: 'A sphere of reserve liquid methane hanging directly beneath the LOX header inside the nosecone, kept for the landing burn.',
      body: [
        'On V2 the sphere hangs from a conical support welded to the nose wall; earlier ships hung it from six pairs of struts (Ringwatchers). NSF reports that the V3 nosecone "houses the two header tanks".',
        'Some explanations still put the methane header inside the LOX tank. That describes the 2020 to 2021 suborbital prototypes, not the orbital ships from Ship 24 onward, V2 or V3.',
        'Both landing tanks live far from the engines they feed, so they need long, cold feed lines. On V3 those lines are fully vacuum jacketed (SpaceX). Capacity is not published.',
      ],
      specs: [{ label: 'Position', value: 'About 89 to 95% of height', conf: 'estimate' }, { label: 'Capacity', value: 'Not published' }, { label: 'Header feed', value: '100% vacuum jacketed (V3)', conf: 'official' }],
      related: [ID.hLOX, ID.ch4, ID.sl] },

    { id: ID.bay, parent: ID.ship, name: 'Payload bay', kind: 'Payload', order: 4, view: 'ship',
      summary: 'The cargo space between the forward dome and the nosecone, set up today to dispense flat Starlink satellites through a slot door.',
      body: [
        'The payload barrel is three steel rings, about {{ship.payloadBarrel}} tall, and usable space continues up into the lower nosecone. V3 adds vents that let the bay depressurize before the door opens (NSF).',
        'Starship released {{ship.f12Deploy}} on Flight 12, {{ship.f13Deploy}} on Flight 13 and {{flight.f14Starlinks}} into orbit on Flight 14. On Flight 9 (V2) the door stuck and the deployment was skipped.',
        'SpaceX\'s S-1 filing compares the bay volume to the pressurized sections of the International Space Station. That comparison looks ahead to future cargo and crew layouts, which will need very different doors.',
      ],
      specs: [{ label: 'Payload barrel (reported)', fact: 'ship.payloadBarrel' }, { label: 'Flight 14 deploy', fact: 'flight.f14Starlinks' }, { label: 'Payload to orbit, reusable (at least)', fact: 'stack.payloadLEOReusable' }],
      related: [ID.pez, 'flight.coast'] },

    { id: ID.pez, parent: ID.bay, name: 'PEZ dispenser and door', kind: 'Payload deployment', order: 1, view: 'ship',
      summary: 'A rail system on the forward dome that pushes flat satellites out of a slot door one at a time, like sweets from a PEZ toy.',
      body: [
        'Instead of a huge clamshell door, the ship opens a narrow slot on its leeward side. A track pushes each satellite out, then lowers the next one into place. The small opening keeps the hull strong and leaves most of the bay closed.',
        'V2 made the door fully rounded. V3 adds new actuators and inverters for faster release (SpaceX). On the Flight 14 plan the deployment ran from {{clock:deploy}} to {{clock:deployEnd}}.',
      ],
      specs: [{ label: 'Door position', value: 'About 66 to 71% of height, leeward', conf: 'estimate' }, { label: 'Flight 14 deploy', fact: 'flight.f14Starlinks' }],
      related: [ID.bay] },

    { id: ID.fwd, parent: ID.ship, name: 'Forward flaps', kind: 'Aerodynamic control', order: 5, view: 'ship',
      summary: 'Two electrically driven flaps on the nosecone that trim the nose during the belly-first fall. Since V2 they sit higher, thinner and swung toward the leeward side, about {{ship.fwdFlapSpacing}} apart.',
      body: [
        'On V1 the forward flaps sat 180 degrees apart like the aft pair. Musk called that "a slight error" in 2021, because the fixed root of each flap pushed the nose backward in the flow. V2 moved them up the nose, made them thinner and constant-thickness, swept them, and swung them toward the leeward side so they hide from the hottest flow when folded in (Ringwatchers). V3 keeps the V2 design.',
        'Each flap attaches at three hinge points and is moved by a separate electrically driven control arm, with aerocovers sealing the hinges (Ringwatchers, from V2 hardware). Extending a forward flap adds drag at the nose, which holds it up; folding it in lets the nose drop. Flap dimensions and the actuator design are not published.',
      ],
      specs: [{ label: 'Count', value: '2' }, { label: 'Spacing (V2, V3)', fact: 'ship.fwdFlapSpacing' }, { label: 'Dimensions', value: 'Not published' }],
      related: [ID.aft, ID.hs, 'flight.entry'] },

    { id: ID.aft, parent: ID.ship, name: 'Aft flaps', kind: 'Aerodynamic control', order: 6, view: 'ship',
      summary: 'The two large flaps at the tail, {{ship.aftFlapSpacing}} apart. They supply most of the drag behind the center of mass that keeps the heavy engine end from falling first.',
      body: [
        'An empty ship is tail-heavy because the six engines sit at the bottom. Left alone it would fall engine-first. The big aft flaps add drag behind the center of mass and hold the tail up, and moving the fore and aft pairs against each other trims pitch. Moving the left and right flaps differently rolls and yaws the ship.',
        'On V3 each aft flap is driven by one actuator with three motors, replacing two actuators per flap, for redundancy on return-to-launch-site landings (SpaceX). The flaps are the same size as on V2 and their tiles are now pinned wherever possible. Flight 12 stress-tested them on purpose. NSF reports that some V3 attitude thrusters are fed through pipes in the aft flap hinges.',
        'Flaps take some of the harshest heating on the ship. On Flight 4 (V1) a forward flap was visibly burning through during entry and the ship still splashed down.',
      ],
      specs: [{ label: 'Count', value: '2' }, { label: 'Actuation (V3)', fact: 'ship.aftFlapActuator' }, { label: 'Dimensions', value: 'Not published' }],
      related: [ID.fwd, ID.rcs, 'flight.entry'] },

    { id: ID.ch4, parent: ID.ship, name: 'Methane main tank', short: 'CH4 tank', kind: 'Propellant tank', order: 7, view: 'ship',
      summary: 'The upper main tank, holding roughly {{ship.propCH4}} of liquid methane between the forward dome and the common dome.',
      body: [
        'The tank wall is the ship\'s skin. On V2 it has about 30 columns of internal stringers and three slosh baffles (Ringwatchers). V3 made it larger by moving the common dome down about {{ship.domeLowering}}.',
        'Methane leaves from the lowest point of the common dome and runs down through the LOX tank in the downcomer. SpaceX does not publish the oxygen-to-methane split; the {{ship.propCH4}} figure assumes a mixture ratio near 3.6 by mass.',
      ],
      specs: [{ label: 'Methane (derived)', fact: 'ship.propCH4' }, { label: 'Dome lowering (V3)', fact: 'ship.domeLowering' }, { label: 'Methane boils at', fact: 'propellant.ch4Boil' }],
      related: [ID.cd, ID.lox, ID.dc] },

    { id: ID.fd, parent: ID.ch4, name: 'Forward dome', kind: 'Bulkhead', order: 1, view: 'ship',
      summary: 'The top bulkhead of the methane tank and the floor of the payload bay.',
      body: [
        'Since V2 it is a flatter "e-dome" made of 18 stretch-formed panels, replacing 36 stamped ones. The main-tank pressurization diffuser sits on it; a diffuser failure caused the loss of the Flight 9 ship, and it was redesigned. V3 moves flight termination system charges into the raceway at this dome (Ringwatchers, SpaceX, NSF).',
      ],
      specs: [{ label: 'Position', value: 'Weld about 60%, crown about 63% of height', conf: 'estimate' }],
      related: [ID.bay, ID.pez] },

    { id: ID.dc, parent: ID.ch4, name: 'Downcomer', kind: 'Feed line', order: 2, view: 'ship',
      summary: 'The pipe that carries methane from the bottom of the methane tank straight down through the LOX tank to the engines.',
      body: [
        'On V2 there were four: a large central downcomer feeding the three sea-level engines through a sump, and three smaller ones feeding the vacuum engines. SpaceX calls the V3 propellant system a clean-sheet redesign and has not published its routing, so the drawing shows only the central line.',
        'Running the fuel pipe through the oxidizer tank keeps the ship short and avoids routing a large cryogenic line around the outside of the hull. The common dome bulges downward so methane drains to this pipe.',
      ],
      specs: [{ label: 'V3 routing', value: 'Not published' }],
      related: [ID.cd, ID.sl, ID.vac] },

    { id: ID.cd, parent: ID.ship, name: 'Common dome', kind: 'Bulkhead', order: 8, view: 'ship',
      summary: 'One sheet of steel separating methane above from liquid oxygen below. It bulges downward so methane drains to the downcomer at its center.',
      body: [
        'Sharing one bulkhead between the tanks saves the length and mass of a second dome and the intertank structure between them. The price is a thermal problem: subcooled oxygen can be colder than the {{propellant.ch4Freeze}} at which methane freezes, and only this dome separates them. SpaceX has not published its propellant load temperatures.',
        'V3 lowered the common dome by about {{ship.domeLowering}} to enlarge the methane tank without making the ship taller. SpaceX also placed flight termination system charges at this dome on V3.',
      ],
      specs: [{ label: 'Lowered on V3 by', fact: 'ship.domeLowering' }, { label: 'Position', value: 'Weld about 42%, crown about 38% of height', conf: 'estimate' }, { label: 'Methane freezes at', fact: 'propellant.ch4Freeze' }, { label: 'LOX boils at', fact: 'propellant.loxBoil' }],
      related: [ID.ch4, ID.lox, ID.dc] },

    { id: ID.lox, parent: ID.ship, name: 'LOX main tank', kind: 'Propellant tank', order: 9, view: 'ship',
      summary: 'The larger, lower main tank, holding roughly {{ship.propLOX}} of liquid oxygen, about three and a half times the mass of the methane.',
      body: [
        'Oxygen is denser and there is much more of it by mass, so the heavy tank sits at the bottom, close to the engines and the thrust structure. On V2 the tank has about 48 columns of internal stringers and slosh baffles in its lower half (Ringwatchers).',
        'V3 lowered the aft dome about {{ship.domeLowering}} and slightly recessed the tops of the vacuum engines into the bottom of this tank. Together with the lowered common dome, that is how V3 found about 100 t more propellant without growing taller (NSF).',
      ],
      specs: [{ label: 'LOX (derived)', fact: 'ship.propLOX' }, { label: 'Share of stack propellant, O2', fact: 'propellant.stackO2Fraction' }, { label: 'LOX boils at', fact: 'propellant.loxBoil' }],
      related: [ID.cd, ID.ad, ID.dc] },

    { id: ID.ad, parent: ID.lox, name: 'Aft dome and thrust puck', kind: 'Bulkhead and thrust structure', order: 1, view: 'ship',
      summary: 'The bottom of the LOX tank. The sea-level engines hang from a thrust puck at its lowest point and the vacuum engines mount to the dome around it.',
      body: [
        'V3 lowered the aft dome about {{ship.domeLowering}} and flattened the puck (NSF). The RVac tops now sit slightly above the dome line, recessed into the tank. Dome depth and puck size are not published; the drawing uses estimates.',
      ],
      specs: [{ label: 'Lowered on V3 by', fact: 'ship.domeLowering' }],
      related: [ID.sl, ID.vac, ID.attic] },

    { id: ID.hs, parent: ID.ship, name: 'Heat shield', kind: 'Thermal protection', order: 10, view: 'ship',
      summary: 'Black hexagonal ceramic tiles over the whole windward side, pinned to the steel over a felt blanket and an ablative backup layer.',
      body: [
        'Starship reenters belly-first, so one half of the ship takes the heat. The tiles are reported to be silica-based. Hexagons interlock so there is, in Musk\'s words, "no straight path for hot gas to accelerate through the gaps". A 2019 torch test heated samples to about {{ship.tileTestTemp}}, which Musk called orbital entry temperature; SpaceX has not published V3 peak heating.',
        'Each tile clips onto small pins welded to the steel skin rather than being glued, because glued tiles were the ones most likely to fall off in early flights. Under the tiles is a white felt insulation blanket, and under that, since {{ship.ablativeSince}}, a black ablative layer that chars away to protect the steel if a tile is lost. Felt gap filler went in between tiles after Flight 10 showed hot gas seeping through gaps (Ringwatchers).',
        'V3 introduced a simpler pin, removed a horizontal tile seam on the nose and pins nearly every tile (NSF). Ship 41 (Flight 14) added an extended ablative layer, extra retention on tiles that had loosened, and a curved-tile experiment. Metallic tiles were tried too: {{ship.metallicTiles}}. Some strips are left bare on purpose so the tower\'s catch arms can slide along the hull without scraping tiles off.',
        'Tile count: about {{ship.tileCount}} is repeated everywhere for the early orbital ships, but the source usually cited says only "thousands". The V3 count is not published.',
      ],
      specs: [{ label: 'Tiles (V1 era, see note)', fact: 'ship.tileCount' }, { label: 'Tile test temperature (2019)', fact: 'ship.tileTestTemp' }, { label: 'Ablative backup since', fact: 'ship.ablativeSince' }, { label: 'V3 attachment', fact: 'ship.tilePinsV3' }],
      related: ['flight.entry', ID.fwd, ID.aft] },

    { id: ID.tile, parent: ID.hs, name: 'Ceramic tile', kind: 'Thermal protection', order: 1, view: 'ship',
      summary: 'The black hexagonal tile that faces the plasma. Reported to be silica-based; the exact material is not published.',
      body: [
        'A tile works by being a poor conductor with a hot, black surface: it radiates much of the incoming heat back out and lets little through to the steel during the minutes of peak heating. The hexagon shape means no gap runs straight for long, so hot gas cannot build up speed along a seam.',
        'Tile size, thickness and composition are not published. A 2019 test ran samples at about {{ship.tileTestTemp}}.',
      ],
      specs: [{ label: 'Tested at (2019)', fact: 'ship.tileTestTemp' }, { label: 'Count (V1 era)', fact: 'ship.tileCount' }],
      related: [ID.tpin, ID.felt] },

    { id: ID.tpin, parent: ID.hs, name: 'Tile pins', kind: 'Attachment', order: 2, view: 'ship',
      summary: 'Small studs welded to the steel skin. Each tile clips onto its pins, so a tile can be replaced without scraping off glue.',
      body: ['V3 uses a simpler pin and pins nearly every tile; bonding remains only at the nose tip and a few spots (NSF). The pin layout in the drawing is schematic.'],
      specs: [{ label: 'V3 attachment', fact: 'ship.tilePinsV3' }],
      related: [ID.tile] },

    { id: ID.felt, parent: ID.hs, name: 'Felt blanket and gap filler', kind: 'Insulation', order: 3, view: 'ship',
      summary: 'A white insulating felt under the tiles, plus felt packed into the gaps between tiles since Flight 10.',
      body: ['The blanket slows the heat that does get through a tile or a gap. Flight 10 showed hot gas seeping between tiles, and gap filler went in afterward (Ringwatchers).'],
      specs: [{ label: 'Gap filler', fact: 'ship.gapFiller' }],
      related: [ID.abl] },

    { id: ID.abl, parent: ID.hs, name: 'Ablative backup layer', kind: 'Thermal protection', order: 4, view: 'ship',
      summary: 'A black layer on the steel under the felt that chars and erodes, sparing the steel, if a tile is lost.',
      body: [
        'Losing a tile used to mean a hot spot on the tank wall and, in the worst case, a burn-through. Since {{ship.ablativeSince}} a sacrificial ablative layer sits directly on the steel: the hot gas that reaches it spends its energy charring the ablator. On Flight 10 it protected the header feed lines where tiles had been removed on purpose (Ringwatchers). Ship 41 extended its coverage.',
      ],
      specs: [{ label: 'In service since', fact: 'ship.ablativeSince' }],
      related: [ID.felt, ID.tile] },

    { id: ID.rcs, parent: ID.ship, name: 'Reaction control thrusters', short: 'RCS', kind: 'Attitude control', order: 11, view: 'ship',
      summary: 'Small thrusters that point the ship in space. V3 redesigned the system with roll thrusters on the payload bay, a mid-body set and thrusters fed through the aft flap hinges.',
      body: [
        'Earlier ships used cold-gas thrusters fed by boil-off ("ullage") gas from the tanks. SpaceX calls the V3 system "more efficient" but has not said whether it still runs on cold gas or burns methane and oxygen, and it has not published thruster counts or thrust.',
        'NSF reports two pairs of roll thrusters on the payload bay, a set about midway down the ship, thrusters that blow gas routed through pipes in the aft flap hinges onto a redirecting plate, and a tile-covered deflected vent near the nose that likely acts as a pitch thruster. Extra roll authority was first added after Flight 3 lost roll control from clogged valves (SpaceX). Docking needs fine control in every axis, which is why the mid-body set matters for tankers.',
      ],
      specs: [{ label: 'Type (V3)', value: 'Not published' }, { label: 'Groups shown', value: 'Nose, payload bay, mid-body, aft hinge', conf: 'reported' }],
      related: [ID.aft, ID.ports] },

    { id: ID.pins, parent: ID.ship, name: 'Catch points', kind: 'Tower interface', order: 12, view: 'ship',
      summary: 'Hard points on either side of the nose that rest on the tower\'s chopsticks for lifting and, soon, for catching the ship. V3 moved them higher up the nose.',
      body: [
        'V3 deleted the old lift sockets and added newly designed catch and lift points higher on the nose (NSF). V2 flew first non-structural and then, from Ship 35, structural catch fittings, with a tile-free strip where the arms slide along the hull.',
        'Ship 39 was squeeze-tested on the ground to mimic catch loads. In September 2026 Ship 42 was lifted by the Pad 2 chopsticks and reconnected to the propellant arm as a rehearsal. No ship has been caught yet; Flight 15 is the next candidate, pending FAA approval. The catch-point geometry is not published.',
      ],
      specs: [{ label: 'Ship catches so far', fact: 'flight.shipCatches' }, { label: 'Rehearsal', fact: 'flight.shipCatchRehearsal' }, { label: 'Position', value: 'About 76 to 80% of height, both sides', conf: 'estimate' }],
      related: ['ground.chopsticks', 'flight.landing', ID.nose] },

    { id: ID.ports, parent: ID.ship, name: 'Docking and transfer ports', kind: 'Refueling interface', order: 13, view: 'ship',
      summary: 'Four docking drogues on the leeward side and a split LOX and methane quick-disconnect plate that doubles as the in-space propellant transfer port.',
      body: [
        'Moon and Mars missions need a ship refilled in low Earth orbit. V3 adds {{ship.dockingDrogues}} on the leeward side, two near the payload bay and two at the aft end: the passive half of a probe-and-drogue docking system. A tanker ship adds the active probes (SpaceX).',
        'The ground-fill connection has been updated to double as the transfer port. On V3 it is split into separate LOX and methane plates on the ship side, sitting between the two aft drogues (NSF). Rendezvous will use DragonEye sensors from Dragon, and radio-frequency gauges will measure propellant in microgravity.',
        'So far the only transfer demonstrated is about {{ship.transferDemo}} of LOX moved inside one ship on Flight 3. No ship-to-ship transfer has been attempted as of the data date; SpaceX says reaching orbit enables "the first orbital propellant transfer".',
      ],
      specs: [{ label: 'Docking drogues', fact: 'ship.dockingDrogues' }, { label: 'Transfer demo (Flight 3)', fact: 'ship.transferDemo' }, { label: 'QD plate position', value: 'About 5 to 10% of height, leeward', conf: 'estimate' }],
      related: ['ground.qd', ID.bay, ID.rcs] },

    { id: ID.av, parent: ID.ship, name: 'Avionics, power and raceway', kind: 'Electrical', order: 14, view: 'ship',
      summary: 'Flight computers, batteries, inverters and high-voltage distribution spread through the ship, with cables and lines routed along an external raceway.',
      body: [
        'V3 uses custom avionics units across ship and booster ({{vehicle.avionicsUnits}}), each combining batteries, inverters and high-voltage distribution, with about {{vehicle.peakPower}} of peak power across both vehicles. Starlink provides {{vehicle.starlinkBandwidth}} of redundant links, and SpaceX counts {{vehicle.cameraViews}} of camera coverage. V3 rearranged the ship\'s four Starlink dishes: two on the sides of the heat shield and two on the leeward side (NSF).',
        'Physical sensors on the vehicle: {{ship.sensors}}. The avionics are designed for about {{ship.orbitEndurance}} in orbit, long enough for propellant-transfer and depot demonstrations. The raceway, the external trunk along the leeward side, was redesigned on V3 for protection and serviceability and now carries flight termination system hardware. Box locations are not published.',
      ],
      specs: [{ label: 'Avionics units (both stages)', fact: 'vehicle.avionicsUnits' }, { label: 'Peak power (both stages)', fact: 'vehicle.peakPower' }, { label: 'Starlink links', fact: 'vehicle.starlinkBandwidth' }, { label: 'Design endurance', fact: 'ship.orbitEndurance' }],
      related: [ID.ports] },

    { id: ID.bayE, parent: ID.ship, name: 'Engine bay (aft skirt)', kind: 'Structure', order: 15, view: 'ship',
      summary: 'The unpressurized skirt below the LOX tank that shelters the six engines, carries the ship\'s weight on the pad and bolts to the booster before staging.',
      body: [
        'On V2 the skirt was just over {{ship.skirtHeightV2}} tall with 156 internal stringer columns (Ringwatchers). Clamps hold it to the booster until hot staging, when the ship lights all six engines while still attached and pushes itself off.',
        'Fires in the aft section destroyed the V2 ships on Flights 7 and 8. Raptor 3 carries its own thermal protection and needs no shroud, so V3 deleted the individual engine shrouds and the large aft close-out volume. What remains is a small "attic" over the RVac tops.',
      ],
      specs: [{ label: 'Skirt height (V2, reported)', fact: 'ship.skirtHeightV2' }, { label: 'Engines', value: '3 sea-level + 3 vacuum' }, { label: 'Raptor 3 heat shield', fact: 'raptor.r3.heatShield' }],
      related: [ID.sl, ID.vac, 'flight.hotstage'] },

    { id: ID.attic, parent: ID.bayE, name: 'Attic', kind: 'Structure', order: 1, view: 'ship',
      summary: 'The small space between the bottom of the LOX tank and the aft heat shield. On V3 it covers only the RVac tops, under a metal roof with new vents.',
      body: ['On V2 the attic was a large volume where leaking propellant could collect and burn (Flight 7). V3 shrank it and added venting (SpaceX, NSF).'],
      specs: [{ label: 'Position', value: 'About 8.5 to 12% of height', conf: 'estimate' }],
      related: [ID.vac] },

    { id: ID.sl, parent: ID.ship, name: 'Sea-level Raptor 3 engines', short: 'SL x3', kind: 'Engines', order: 16, view: 'ship',
      summary: 'The three center engines. They gimbal to steer, run all in-space burns so far, and are the only engines that land the ship. Each is rated {{raptor.r3.thrustSL}} at sea level.',
      body: [
        'The sea-level nozzle is short enough to run in thick air without the exhaust separating from the wall. That makes these the landing engines: on the planned Flight 14 landing all three relight, the ship flips, and the burn steps down from three to two to one engine before touchdown.',
        'In space the same engines do the fine work. On Flight 14 a single sea-level Raptor made the {{raptor.r3.orbitInsertionBurn}} orbit insertion burn and, later, the deorbit burn. In vacuum each one makes about {{raptor.r3.thrustVacOfSLEngine}}, derived from SpaceX\'s ship total.',
        'Only these three gimbal; the vacuum engines are fixed. Raptor 3 gimbal range is not published (Raptor 2: about {{raptor.r2.gimbalRange}}).',
      ],
      specs: [{ label: 'Count', fact: 'ship.enginesSL' }, { label: 'Thrust, sea level (flight rating)', fact: 'raptor.r3.thrustSL' }, { label: 'Thrust in vacuum (derived)', fact: 'raptor.r3.thrustVacOfSLEngine' }, { label: 'Nozzle exit', fact: 'raptor.r3.exitDiameter' }, { label: 'Height', fact: 'raptor.r3.height' }, { label: 'Mass', fact: 'raptor.r3.mass' }],
      related: ['raptor3', 'raptor3.gimbal', ID.vac, 'flight.landing'] },

    { id: ID.vac, parent: ID.ship, name: 'Raptor Vacuum 3 engines', short: 'RVac x3', kind: 'Engines', order: 17, view: 'ship',
      summary: 'Three fixed engines with large nozzles around the outside of the cluster, rated {{raptor.rvac3.thrust}} each in vacuum. They do most of the work on the climb to orbit.',
      body: [
        'Same Raptor powerhead, much bigger bell. A larger nozzle expands the exhaust further and turns more of its heat into speed, which is worth a lot of efficiency in vacuum (about {{raptor.rvac3.isp}} against about {{raptor.r3.ispVac}} for the sea-level engine, both unconfirmed for Raptor 3). At sea level the same bell would overexpand the flow, which can separate from the wall violently, so the RVacs never land the ship.',
        'The exit area is about {{ship.exitAreaRatio}} that of a sea-level nozzle. The RVacs do not gimbal. On V3 their tops sit slightly recessed into the LOX tank. One RVac shut down early on both Flight 12 and Flight 14; each time the other engines burned longer and the ship still reached its planned trajectory.',
      ],
      specs: [{ label: 'Count', fact: 'ship.enginesVac' }, { label: 'Thrust, vacuum', fact: 'raptor.rvac3.thrust' }, { label: 'Nozzle exit', fact: 'raptor.rvac3.exitDiameter' }, { label: 'Height', fact: 'raptor.rvac3.height' }, { label: 'Isp (estimate)', fact: 'raptor.rvac3.isp' }, { label: 'Exit area vs sea level', fact: 'ship.exitAreaRatio' }],
      related: ['raptor3.rvac', 'raptor3', ID.sl] },
  ]);

  // "{{clock:deploy}}" tokens in part text become T+ clock strings from the timeline data.
  SX.allParts().forEach((p) => {
    if (!p.id || (p.id !== 'ship' && p.id.indexOf('ship.') !== 0)) return;
    const fix = (s) => String(s).replace(/\{\{clock:(\w+)\}\}/g, (m, id) => clock(TL(id)));
    if (p.summary) p.summary = fix(p.summary);
    if (p.body) p.body = p.body.map(fix);
  });

  const PART_IDS = Object.keys(ID).map((k) => ID[k]);

  /* ================================================================== geometry (metres; h measured up from the skirt bottom)
     Height, diameter, nosecone and engine sizes come from facts. Stations inside the hull are estimates: dossier 04
     derives them from the V3 ring layout (21 rings of about 1.83 m plus the nosecone). Order is well supported;
     individual positions could be off by 1 to 2 m. */

  const G = (function () {
    const H = SX.val('ship.height', 52), R = SX.val('ship.diameter', 9) / 2;
    const noseL = SX.val('ship.noseconeHeight', 14);
    const f = (x) => x * H;
    const g = {
      H, R, noseL, yN0: H - noseL,
      loxHdr: { bottom: f(0.954), apex: f(0.944) },
      ch4Hdr: { c: f(0.913), r: 1.5 },
      copv: [f(0.855), f(0.905)],
      fwdFlap: { root0: f(0.777), root1: f(0.896), tipTop: f(0.842), tipBot: f(0.788), span: 2.3 },
      pins: [f(0.756), f(0.768)],
      bayTop: f(0.80),
      door: [f(0.66), f(0.71)],
      fdWeld: f(0.60), fdCrown: f(0.63),
      cdWeld: f(0.42), cdCrown: f(0.38),
      adWeld: f(0.121), adCrown: f(0.06), puckR: 1.35,
      aftFlap: { root0: f(0.02), root1: f(0.23), tipTop: f(0.165), tipBot: f(0.025), span: 4.2 },
      tw: 0.26,           // wall thickness in the drawing (exaggerated for legibility)
      tile: 0.2,          // tile layer thickness in the drawing (exaggerated)
      sl: { x: 0.95, h: SX.val('raptor.r3.height', 2.9), d: SX.val('raptor.r3.exitDiameter', 1.3) },
      vac: { x: 2.95, h: SX.val('raptor.rvac3.height', 4.4), d: SX.val('raptor.rvac3.exitDiameter', 2.3) },
      lineLOX: 3.35, lineCH4: 3.02,
      dcR: 0.55,
    };
    /** Hull radius at height h: a blunted ogive over the top noseL metres. */
    g.r = function (h) {
      if (h <= g.yN0) return R;
      const t = SX.clamp((h - g.yN0) / noseL, 0, 1);
      return R * Math.pow(Math.max(0, 1 - Math.pow(t, 2.2)), 0.58);
    };
    /** Aft dome: ellipse from the weld to the puck, flat across the puck. */
    g.aft = function (x) {
      const dep = g.adWeld - g.adCrown;
      const xx = Math.max(Math.abs(x), g.puckR);
      return g.adWeld - dep * Math.sqrt(Math.max(0, 1 - (xx / R) * (xx / R)));
    };
    g.puckH = g.aft(0);
    g.common = (x) => g.cdWeld - (g.cdWeld - g.cdCrown) * Math.sqrt(Math.max(0, 1 - (x / R) * (x / R)));
    g.fwd = (x) => g.fdWeld + (g.fdCrown - g.fdWeld) * Math.sqrt(Math.max(0, 1 - (x / R) * (x / R)));
    g.sl.top = g.puckH;
    g.vac.top = g.vac.h;           // RVac exit sits at the skirt bottom
    g.vac.dome = g.aft(g.vac.x);   // dome height where the RVac passes through
    return g;
  })();

  /* Drawing frame for the main elevation. */
  const E = { S: 12, X0: 300, BASE: 684, W: 640, Hgt: 772 };
  E.px = (x) => E.X0 + x * E.S;
  E.py = (h) => E.BASE - h * E.S;
  E.pt = (x, h) => fx(E.px(x)) + ',' + fx(E.py(h));

  /** Engine outline (one side profile) as a closed path around centreline cx, top at hTop, height ht, exit diameter de. */
  function enginePath(P, cx, hTop, ht, de, vac) {
    // proportions: powerhead, chamber, throat, bell. Schematic, sized to the published height and exit diameter.
    const phH = 0.95, phW = 0.62, chH = 0.5, chW = 0.36, thW = 0.2;
    const hPh = hTop - phH, hTh = hPh - chH;
    const pts = [];
    pts.push([cx - phW * 0.72, hTop], [cx + phW * 0.72, hTop], [cx + phW, hTop - 0.2], [cx + phW, hPh + 0.12], [cx + chW, hPh], [cx + chW, hPh - chH * 0.45], [cx + thW, hTh]);
    const bellH = hTh - (hTop - ht);
    const n = 18;
    for (let i = 1; i <= n; i++) {
      const s = i / n;
      const r = thW + (de / 2 - thW) * (1 - Math.pow(1 - s, vac ? 1.55 : 1.8));
      pts.push([cx + r, hTh - bellH * s]);
    }
    const right = pts.slice();
    const left = right.map(([x, h]) => [2 * cx - x, h]).reverse();
    const all = right.concat(left);
    return 'M' + all.map(([x, h]) => P(x, h)).join('L') + 'Z';
  }

  /** Hull outline samples on one side (sign +1 right, -1 left), bottom to tip. */
  function hullSide(sign, extra) {
    const pts = [[sign * (G.R + (extra || 0)), 0], [sign * (G.R + (extra || 0)), G.yN0]];
    const n = 48;
    for (let i = 1; i <= n; i++) {
      const h = G.yN0 + (G.noseL * i) / n;
      pts.push([sign * (G.r(h) + (extra || 0) * (1 - i / n * 0.6)), h]);
    }
    return pts;
  }
  const pathFrom = (pts, close) => 'M' + pts.map(([x, h]) => E.pt(x, h)).join('L') + (close ? 'Z' : '');

  /* ================================================================== SVG helpers shared by all instruments */

  function partG(parent, id, attrs, label) {
    const a = Object.assign({ class: 'part', 'data-part': id, tabindex: '0', role: 'button', 'aria-label': label || partName(id) }, attrs || {});
    if (attrs && attrs.class) a.class = 'part ' + attrs.class;
    const g = svg('g', a);
    parent.appendChild(g);
    return g;
  }
  function add(parent, tag, attrs) { const n = svg(tag, attrs); parent.appendChild(n); return n; }
  function txt(parent, x, y, s, cls, attrs) { return add(parent, 'text', Object.assign({ x: fx(x), y: fx(y), class: cls || 'lbl' }, attrs || {}, { text: s })); }
  /** Text + a confidence dot for a fact. getText() re-runs on unit changes. */
  const unitHooks = [];
  function factText(parent, x, y, key, cls, attrs, getText) {
    const t = add(parent, 'text', Object.assign({ x: fx(x), y: fx(y), class: cls || 'dim-t' }, attrs || {}));
    const main = add(t, 'tspan', {});
    const dot = add(t, 'tspan', { class: 'cdot c-' + confOf(key), dx: '3', dy: '-3' });
    dot.textContent = '●';
    const run = () => { main.textContent = getText ? getText() : SX.fmt(key); };
    run();
    unitHooks.push(run);
    const tt = add(t, 'title', {});
    const f = SX.fact(key);
    tt.textContent = (SX.CONF[confOf(key)] ? SX.CONF[confOf(key)].label : 'Missing') + (f && f.note ? ': ' + f.note : '');
    return t;
  }
  /** Dimension line with ticks. Vertical if x0 == x1. */
  function dimLine(parent, x0, y0, x1, y1, ext) {
    const g = add(parent, 'g', { class: 'dimg' });
    add(g, 'path', { class: 'dim', d: 'M' + fx(x0) + ',' + fx(y0) + 'L' + fx(x1) + ',' + fx(y1) });
    const vert = Math.abs(x0 - x1) < 0.5;
    const tick = (x, y) => add(g, 'path', { class: 'dim', d: 'M' + fx(x - 4) + ',' + fx(y + 4) + 'L' + fx(x + 4) + ',' + fx(y - 4) });
    tick(x0, y0); tick(x1, y1);
    if (ext) {
      ext.forEach(([ax, ay, bx, by]) => add(g, 'path', { class: 'dim', d: 'M' + fx(ax) + ',' + fx(ay) + 'L' + fx(bx) + ',' + fx(by), style: 'opacity:0.55' }));
    }
    return { g, vert };
  }
  /** Toggle .is-narrow on an SVG while its frame is narrower than px; cb(narrow) runs on every change. */
  function watchNarrow(frame, svgEl, px, cb) {
    let last = null;
    const run = () => {
      const w = frame.clientWidth;
      const n = w > 0 && w < px;
      if (n === last) return;
      last = n;
      svgEl.classList.toggle('is-narrow', n);
      if (cb) cb(n);
    };
    run();
    if ('ResizeObserver' in window) new ResizeObserver(run).observe(frame);
    else window.addEventListener('resize', run);
  }
  function hexPath(cx, cy, r) {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 180 * (60 * i - 90);
      d += (i ? 'L' : 'M') + fx(cx + r * Math.cos(a)) + ',' + fx(cy + r * Math.sin(a));
    }
    return d + 'Z';
  }
  function arrowHead(parent, x, y, ang, size, cls) {
    const s = size || 7;
    const a1 = ang + Math.PI * 0.84, a2 = ang - Math.PI * 0.84;
    return add(parent, 'path', { class: cls, d: 'M' + fx(x) + ',' + fx(y) + 'L' + fx(x + s * Math.cos(a1)) + ',' + fx(y + s * Math.sin(a1)) + 'L' + fx(x + s * Math.cos(a2)) + ',' + fx(y + s * Math.sin(a2)) + 'Z' });
  }

  /* ================================================================== 1. the elevation / section drawing */

  function buildCutaway() {
    const S = E.S;
    const root = svg('svg', { viewBox: '0 0 ' + E.W + ' ' + E.Hgt, role: 'group', 'aria-label': 'Starship V3 elevation: windward face on the left half, section through the centreline on the right half', class: 'sh-cut-svg' });

    /* ---- defs */
    const defs = add(root, 'defs', {});
    const hatch = add(defs, 'pattern', { id: 'sh-hatch', width: 4, height: 4, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
    add(hatch, 'rect', { width: 4, height: 4, style: 'fill:var(--bg-4)' });
    add(hatch, 'path', { d: 'M0,0L0,4', style: 'stroke:var(--steel-2);stroke-width:1' });
    const hr = 3.1, hw = Math.sqrt(3) * hr;
    const hex = add(defs, 'pattern', { id: 'sh-hex', width: fx(hw), height: fx(3 * hr), patternUnits: 'userSpaceOnUse' });
    add(hex, 'rect', { width: fx(hw), height: fx(3 * hr), style: 'fill:var(--tile)' });
    add(hex, 'path', { class: 'tile-edge', d: [hexPath(0, 0, hr), hexPath(hw, 0, hr), hexPath(hw / 2, 1.5 * hr, hr), hexPath(0, 3 * hr, hr), hexPath(hw, 3 * hr, hr)].join('') });
    const shade = add(defs, 'linearGradient', { id: 'sh-shade', x1: '0', x2: '1', y1: '0', y2: '0' });
    add(shade, 'stop', { offset: '0', style: 'stop-color:var(--bg);stop-opacity:0.55' });
    add(shade, 'stop', { offset: '0.55', style: 'stop-color:var(--fg);stop-opacity:0.07' });
    add(shade, 'stop', { offset: '1', style: 'stop-color:var(--fg);stop-opacity:0.02' });
    const nozG = add(defs, 'linearGradient', { id: 'sh-noz', x1: '0', x2: '1', y1: '0', y2: '0' });
    add(nozG, 'stop', { offset: '0', style: 'stop-color:var(--sh-k1)' });
    add(nozG, 'stop', { offset: '0.45', style: 'stop-color:var(--sh-k4)' });
    add(nozG, 'stop', { offset: '1', style: 'stop-color:var(--sh-k1)' });
    const hullL = hullSide(-1), hullR = hullSide(1);
    const hullPath = 'M' + E.pt(-G.R, 0) + 'L' + hullR.map(([x, h]) => E.pt(x, h)).join('L') + 'L' + hullL.slice().reverse().map(([x, h]) => E.pt(x, h)).join('L') + 'Z';
    const clipL = add(defs, 'clipPath', { id: 'sh-clipL' });
    add(clipL, 'path', { d: hullPath });
    const clipLeftHalf = add(defs, 'clipPath', { id: 'sh-clipLH' });
    add(clipLeftHalf, 'rect', { x: 0, y: 0, width: E.X0, height: E.Hgt });

    /* ---- titles */
    txt(root, 16, 20, 'VIEW A', 'lbl-title wide-only');
    txt(root, 16, 34, 'WINDWARD FACE (LEFT)  /  SECTION ON CENTRELINE (RIGHT)', 'lbl-sub wide-only');

    /* ---- centreline */
    add(root, 'path', { class: 'axis', d: 'M' + E.X0 + ',' + fx(E.py(G.H) - 16) + 'L' + E.X0 + ',' + fx(E.BASE + 14) });

    /* ---- the cut half: interior first, wall on top */
    const cut = add(root, 'g', { class: 'cut' });
    const inner = (h) => Math.max(0, G.r(h) - G.tw);

    // payload bay: from the forward dome crown up into the nose
    const bayG = partG(cut, ID.bay);
    {
      const pts = [];
      for (let i = 0; i <= 20; i++) { const x = (inner(G.fdWeld) * i) / 20; pts.push([x, G.fwd(x)]); }
      const top = G.bayTop;
      const walls = [];
      for (let h = G.fdWeld; h <= top; h += 0.5) walls.push([inner(h), h]);
      walls.push([inner(top), top]);
      const d = pathFrom(pts.concat(walls).concat([[0, top]]), true);
      add(bayG, 'path', { class: 'f-bay hl', d, style: 'stroke:none' });
      add(bayG, 'path', { class: 'hl steel-s2', d: 'M' + E.pt(0, top) + 'L' + E.pt(inner(top), top), style: 'stroke-dasharray:4 3' });
    }
    // nose cavity above the bay
    const noseG = partG(cut, ID.nose);
    {
      const pts = [[0, G.bayTop]];
      for (let h = G.bayTop; h <= G.H; h += 0.4) pts.push([inner(h), h]);
      pts.push([0, G.H - G.tw]);
      add(noseG, 'path', { class: 'hl', d: pathFrom(pts, true), style: 'fill:var(--bg-2);fill-opacity:0.6;stroke:none' });
    }
    // methane main tank
    const ch4G = partG(cut, ID.ch4);
    {
      const pts = [];
      for (let i = 0; i <= 24; i++) { const x = (inner(0) * i) / 24; pts.push([x, G.common(x)]); }
      for (let i = 24; i >= 0; i--) { const x = (inner(0) * i) / 24; pts.push([x, G.fwd(x)]); }
      add(ch4G, 'path', { class: 'f-ch4 hl hl-fill', d: pathFrom(pts, true), style: 'stroke:none' });
    }
    // LOX main tank
    const loxG = partG(cut, ID.lox);
    {
      const pts = [];
      for (let i = 0; i <= 24; i++) { const x = (inner(0) * i) / 24; pts.push([x, G.aft(x)]); }
      for (let i = 24; i >= 0; i--) { const x = (inner(0) * i) / 24; pts.push([x, G.common(x)]); }
      add(loxG, 'path', { class: 'f-lox hl hl-fill', d: pathFrom(pts, true), style: 'stroke:none' });
    }
    // slosh baffles and ring weld lines (quiet structure cues)
    const ringG = add(cut, 'g', { style: 'opacity:0.35', 'aria-hidden': 'true' });
    const ringH = SX.val('ship.ringHeight', 1.8);
    for (let h = G.adWeld + ringH; h < G.yN0; h += ringH) {
      if (Math.abs(h - G.cdWeld) < 0.4 || Math.abs(h - G.fdWeld) < 0.4) continue;
      add(ringG, 'path', { class: 'steel-s2', d: 'M' + E.pt(inner(h) - 0.35, h) + 'L' + E.pt(inner(h), h) });
    }

    // engine bay background
    const ebG = partG(cut, ID.bayE);
    {
      const pts = [[0, 0], [inner(0), 0], [inner(0), G.adWeld]];
      for (let i = 24; i >= 0; i--) { const x = (inner(0) * i) / 24; pts.push([x, G.aft(x)]); }
      add(ebG, 'path', { class: 'hl', d: pathFrom(pts, true), style: 'fill:var(--bg);fill-opacity:0.75;stroke:none' });
    }

    // domes (bulkheads): drawn as thick steel strokes over the fills
    function domePath(fn, x0, x1) {
      const pts = [];
      for (let i = 0; i <= 30; i++) { const x = x0 + ((x1 - x0) * i) / 30; pts.push([x, fn(x)]); }
      return pathFrom(pts);
    }
    const fdG = partG(cut, ID.fd);
    add(fdG, 'path', { class: 'hl', d: domePath(G.fwd, 0, inner(0)), style: 'stroke:var(--steel);stroke-width:2.4;fill:none' });
    add(fdG, 'path', { class: 'hit', d: domePath(G.fwd, 0, inner(0)) });
    const cdG = partG(cut, ID.cd);
    add(cdG, 'path', { class: 'hl', d: domePath(G.common, 0, inner(0)), style: 'stroke:var(--steel);stroke-width:2.4;fill:none' });
    add(cdG, 'path', { class: 'hit', d: domePath(G.common, 0, inner(0)) });
    const adG = partG(cut, ID.ad);
    add(adG, 'path', { class: 'hl', d: domePath(G.aft, 0, inner(0)), style: 'stroke:var(--steel);stroke-width:2.4;fill:none' });
    add(adG, 'path', { class: 'hit', d: domePath(G.aft, 0, inner(0)) });
    // thrust puck: a heavier plate under the flat centre of the aft dome
    add(adG, 'path', { class: 'hl', d: 'M' + E.pt(0, G.puckH - 0.28) + 'L' + E.pt(G.puckR, G.puckH - 0.28) + 'L' + E.pt(G.puckR + 0.25, G.puckH) + 'L' + E.pt(0, G.puckH) + 'Z', style: 'fill:url(#sh-hatch);stroke:var(--steel);stroke-width:1' });

    // downcomer: half of the central pipe, from the common dome crown to the puck
    const dcG = partG(cut, ID.dc, { 'data-layer': 'plumbing' });
    add(dcG, 'path', { class: 'hl', d: 'M' + E.pt(0, G.common(0)) + 'L' + E.pt(G.dcR, G.common(G.dcR)) + 'L' + E.pt(G.dcR, G.puckH + 0.2) + 'L' + E.pt(0, G.puckH + 0.2) + 'Z', style: 'fill:var(--ch4);fill-opacity:0.5;stroke:var(--steel);stroke-width:1' });

    // header feed lines (vacuum jacketed): LOX from the nose-tip tank, CH4 from the sphere
    function feedLine(g, pts, colorVar) {
      const d = pathFrom(pts);
      add(g, 'path', { class: 'hl', d, style: 'stroke:var(--steel-2);stroke-width:4;fill:none;stroke-linejoin:round' });
      add(g, 'path', { d, style: 'stroke:var(--bg);stroke-width:2.2;fill:none;stroke-linejoin:round' });
      add(g, 'path', { d, style: 'stroke:var(' + colorVar + ');stroke-width:1.3;fill:none;stroke-linejoin:round' });
      add(g, 'path', { class: 'hit', d });
    }
    const lineLOXG = partG(cut, ID.hLOX, { 'data-layer': 'plumbing' }, 'LOX header feed line');
    feedLine(lineLOXG, [[0.15, G.loxHdr.apex], [2.05, G.loxHdr.apex - 0.15], [2.05, 41.3], [G.lineLOX, 40.5], [G.lineLOX, 7.2], [1.3, 3.95], [G.sl.x + 0.28, G.puckH + 0.25]], '--lox');
    const lineCH4G = partG(cut, ID.hCH4, { 'data-layer': 'plumbing' }, 'Methane header feed line');
    feedLine(lineCH4G, [[0.1, G.ch4Hdr.c - G.ch4Hdr.r], [1.6, G.ch4Hdr.c - G.ch4Hdr.r - 0.9], [1.6, 41.0], [G.lineCH4, 40.2], [G.lineCH4, 7.0], [1.12, 3.9], [G.sl.x + 0.12, G.puckH + 0.2]], '--ch4');

    // PEZ dispenser: a stack of flat satellites on the forward dome, and the slot door on the far (leeward) wall
    const pezG = partG(cut, ID.pez);
    {
      const x1 = 2.7, base = G.fdCrown + 0.35, n = 15, th = 0.32, gap = 0.1;
      add(pezG, 'path', { class: 'hl steel-s2', d: 'M' + E.pt(x1 + 0.18, base - 0.2) + 'L' + E.pt(x1 + 0.18, base + n * (th + gap) + 0.2), style: 'stroke-width:1.4' });
      for (let i = 0; i < n; i++) {
        const h0 = base + i * (th + gap);
        add(pezG, 'rect', { x: fx(E.px(0)), y: fx(E.py(h0 + th)), width: fx(x1 * S), height: fx(th * S), style: 'fill:var(--bg-4);stroke:var(--steel-2);stroke-width:0.6' });
      }
      add(pezG, 'rect', { class: 'hidden-line hl', x: fx(E.px(0.25)), y: fx(E.py(G.door[1])), width: fx(3.3 * S), height: fx((G.door[1] - G.door[0]) * S), rx: 5 });
    }

    // header tanks
    const hLOXG = partG(cut, ID.hLOX);
    {
      const pts = [[0, G.loxHdr.apex], [inner(G.loxHdr.bottom), G.loxHdr.bottom]];
      for (let h = G.loxHdr.bottom; h <= G.H - 0.05; h += 0.2) pts.push([inner(h), h]);
      pts.push([0, G.H - G.tw]);
      add(hLOXG, 'path', { class: 'hl f-lox-solid', d: pathFrom(pts, true), style: 'stroke:var(--steel);stroke-width:1.2' });
    }
    const hCH4G = partG(cut, ID.hCH4);
    {
      const c = G.ch4Hdr.c, r = G.ch4Hdr.r;
      add(hCH4G, 'path', { class: 'hl f-ch4-solid', d: 'M' + E.pt(0, c + r) + 'A' + fx(r * S) + ',' + fx(r * S) + ' 0 0 1 ' + E.pt(0, c - r) + 'Z', style: 'stroke:var(--steel);stroke-width:1.2' });
      // conical support up to the nose wall
      add(hCH4G, 'path', { class: 'steel-s2', d: 'M' + E.pt(r * 0.72, c + r * 0.7) + 'L' + E.pt(inner(c + r + 0.35), c + r + 0.35) + 'M' + E.pt(r * 0.98, c + 0.2) + 'L' + E.pt(inner(c + 0.9), c + 0.9) });
    }
    // COPVs: around the methane header and at the payload bay floor
    const copvG = partG(cut, ID.copv);
    [[2.35, 44.7], [2.9, 45.5], [2.45, 46.35], [3.35, 44.3], [3.05, 43.35]].forEach(([x, h]) => {
      add(copvG, 'rect', { class: 'f-copv hl', x: fx(E.px(x - 0.24)), y: fx(E.py(h + 0.42)), width: fx(0.48 * S), height: fx(0.84 * S), rx: 2.5 });
    });
    [[3.76, G.fdWeld + 1.0], [4.06, G.fdWeld + 1.0]].forEach(([x, h]) => {
      add(copvG, 'rect', { class: 'f-copv hl', x: fx(E.px(x - 0.14)), y: fx(E.py(h + 0.75)), width: fx(0.28 * S), height: fx(1.5 * S), rx: 2 });
    });

    // forward flap actuator (inside the nose, driving the flap hinge)
    const fwdActG = partG(cut, ID.fwd, {}, 'Forward flap actuator');
    add(fwdActG, 'rect', { class: 'hl', x: fx(E.px(3.05)), y: fx(E.py(42.7)), width: fx(0.8 * S), height: fx(0.9 * S), rx: 1.5, style: 'fill:var(--bg-4);stroke:var(--steel);stroke-width:0.9' });
    add(fwdActG, 'path', { class: 'steel-s', d: 'M' + E.pt(3.85, 42.25) + 'L' + E.pt(inner(42.25), 42.25) });

    // engine bay: attic roofs, aft flap actuator, engines
    const atticG = partG(cut, ID.attic);
    {
      const vx = G.vac.x, w = 0.85;
      add(atticG, 'path', { class: 'hl', d: 'M' + E.pt(vx - w, G.aft(vx - w)) + 'Q' + E.pt(vx, G.vac.top + 0.75) + ' ' + E.pt(vx + w, G.aft(vx + w)), style: 'fill:var(--bg-3);stroke:var(--steel);stroke-width:1.1' });
    }
    const aftActG = partG(cut, ID.aft, {}, 'Aft flap actuator');
    {
      const x0 = 3.72, h0 = 4.7;
      add(aftActG, 'rect', { class: 'hl', x: fx(E.px(x0)), y: fx(E.py(h0 + 1.2)), width: fx(0.5 * S), height: fx(1.2 * S), rx: 1.5, style: 'fill:var(--bg-4);stroke:var(--steel);stroke-width:0.9' });
      for (let k = 0; k < 3; k++) add(aftActG, 'circle', { cx: fx(E.px(x0 + 0.25)), cy: fx(E.py(h0 + 0.25 + k * 0.36)), r: 1.3, style: 'fill:var(--steel-2)' });
    }
    const vacG = partG(cut, ID.vac);
    add(vacG, 'path', { class: 'hl', d: enginePath(E.pt, G.vac.x, G.vac.top, G.vac.h, G.vac.d, true), style: 'fill:url(#sh-noz);stroke:var(--steel);stroke-width:0.9' });
    add(vacG, 'path', { class: 'steel-s2', d: 'M' + E.pt(G.vac.x - 0.35, G.vac.top - 0.25) + 'L' + E.pt(G.vac.x + 0.35, G.vac.top - 0.25) + 'M' + E.pt(G.vac.x - 0.62, G.vac.top - 0.6) + 'L' + E.pt(G.vac.x + 0.62, G.vac.top - 0.6) });
    const slG = partG(cut, ID.sl);
    add(slG, 'path', { class: 'hl', d: enginePath(E.pt, G.sl.x, G.sl.top, G.sl.h, G.sl.d, false), style: 'fill:url(#sh-noz);stroke:var(--steel);stroke-width:0.9' });
    add(slG, 'path', { class: 'steel-s2', d: 'M' + E.pt(G.sl.x - 0.35, G.sl.top - 0.25) + 'L' + E.pt(G.sl.x + 0.35, G.sl.top - 0.25) });
    // gimbal pivot mark on the sea-level engine
    add(slG, 'circle', { cx: fx(E.px(G.sl.x)), cy: fx(E.py(G.sl.top)), r: 2.2, style: 'fill:var(--bg);stroke:var(--accent);stroke-width:1' });

    // wall (hatched) and tile layer on its outer face
    const wallG = add(cut, 'g', { 'aria-hidden': 'true' });
    {
      const outer = hullSide(1);
      const innerPts = outer.map(([x, h]) => [Math.max(0, x - G.tw), h]).reverse();
      add(wallG, 'path', { d: pathFrom(outer.concat(innerPts), true), style: 'fill:url(#sh-hatch);stroke:var(--steel);stroke-width:0.8' });
    }
    const tileCutG = partG(cut, ID.hs, {}, 'Heat shield tile layer, in section');
    {
      const outer = hullSide(1, G.tile);
      const innerPts = hullSide(1).reverse();
      add(tileCutG, 'path', { class: 'hl', d: pathFrom(outer.concat(innerPts), true), style: 'fill:var(--tile);stroke:var(--sh-k3);stroke-width:0.6' });
    }

    /* ---- the exterior half: windward face, tiled */
    const ext = add(root, 'g', { class: 'ext', 'clip-path': 'url(#sh-clipLH)' });
    const hsG = partG(ext, ID.hs, {}, 'Heat shield tiles on the windward face');
    const leftHull = 'M' + E.pt(0, 0) + 'L' + hullSide(-1, G.tile).map(([x, h]) => E.pt(x, h)).join('L') + 'L' + E.pt(0, G.H) + 'Z';
    add(hsG, 'path', { d: leftHull, style: 'fill:url(#sh-hex)' });
    add(hsG, 'path', { d: leftHull, style: 'fill:url(#sh-shade)' });
    add(hsG, 'path', { class: 'hl', d: leftHull, style: 'fill:none;stroke:var(--steel-2);stroke-width:0.9' });
    // hidden (leeward) hardware shown dashed through the tiles: forward drogues, aft drogues and the QD plates
    const portsG = partG(ext, ID.ports, {}, 'Docking drogues and transfer ports on the leeward side (hidden)');
    add(portsG, 'circle', { class: 'hidden-line hl', cx: fx(E.px(-2.35)), cy: fx(E.py(35.4)), r: fx(0.7 * S) });
    add(portsG, 'circle', { class: 'hidden-line hl', cx: fx(E.px(-2.35)), cy: fx(E.py(4.5)), r: fx(0.7 * S) });
    add(portsG, 'rect', { class: 'hidden-line hl', x: fx(E.px(-1.35)), y: fx(E.py(5.2)), width: fx(1.2 * S), height: fx(2.6 * S), rx: 2 });
    add(portsG, 'path', { class: 'hidden-line', d: 'M' + E.pt(-1.35, 3.9) + 'L' + E.pt(-0.15, 3.9) });

    /* ---- flaps, catch points, RCS (outside the hull, both sides) */
    const outside = add(root, 'g', {});
    function flapShape(sign, root0, root1, tipTop, tipBot, span, useNose) {
      const rr = (h) => (useNose ? G.r(h) : G.R) + G.tile * 0.5;
      const pts = [[sign * rr(root0), root0]];
      for (let i = 1; i <= 8; i++) { const h = root0 + ((root1 - root0) * i) / 8; pts.push([sign * rr(h), h]); }
      const tipX = sign * (G.R + span);
      pts.push([tipX, tipTop], [tipX, tipBot]);
      return pathFrom(pts, true);
    }
    [-1, 1].forEach((sign) => {
      const af = G.aftFlap, ff = G.fwdFlap;
      const ag = partG(outside, ID.aft, {}, (sign < 0 ? 'Left' : 'Right') + ' aft flap');
      const ad = flapShape(sign, af.root0, af.root1, af.tipTop, af.tipBot, af.span, false);
      add(ag, 'path', { d: ad, style: 'fill:url(#sh-hex)' });
      add(ag, 'path', { class: 'hl', d: ad, style: 'fill:none;stroke:var(--steel-2);stroke-width:1' });
      add(ag, 'path', { class: 'hidden-line', d: 'M' + E.pt(sign * (G.R + 0.45), af.root0 + 0.4) + 'L' + E.pt(sign * (G.R + 0.45), af.root1 - 0.4), style: 'stroke:var(--steel)' });
      const fg = partG(outside, ID.fwd, {}, (sign < 0 ? 'Left' : 'Right') + ' forward flap');
      const fd = flapShape(sign, ff.root0, ff.root1, ff.tipTop, ff.tipBot, ff.span, true);
      add(fg, 'path', { d: fd, style: 'fill:url(#sh-hex)' });
      add(fg, 'path', { class: 'hl', d: fd, style: 'fill:none;stroke:var(--steel-2);stroke-width:1' });
      add(fg, 'path', { class: 'hidden-line', d: 'M' + E.pt(sign * (G.r(ff.root0 + 0.4) + 0.4), ff.root0 + 0.4) + 'L' + E.pt(sign * (G.r(ff.root1 - 0.5) + 0.4), ff.root1 - 0.5), style: 'stroke:var(--steel)' });
      const pg = partG(outside, ID.pins, {}, (sign < 0 ? 'Left' : 'Right') + ' catch point');
      const px0 = sign * (G.r(G.pins[0]) + G.tile), px1 = sign * (G.r(G.pins[0]) + G.tile + 0.6);
      add(pg, 'path', { class: 'hl', d: 'M' + E.pt(px0, G.pins[0]) + 'L' + E.pt(px1, G.pins[0] + 0.08) + 'L' + E.pt(px1, G.pins[1] - 0.08) + 'L' + E.pt(px0, G.pins[1]) + 'Z', style: 'fill:var(--steel);stroke:var(--steel);stroke-width:0.8' });
      const rg = partG(outside, ID.rcs, {}, (sign < 0 ? 'Left' : 'Right') + ' reaction control thrusters');
      const rcsAt = [G.H * 0.695, G.H * 0.475, G.aftFlap.root1 + 0.45];
      if (sign < 0) rcsAt.push(G.H * 0.94);
      rcsAt.forEach((h) => {
        const x0 = sign * (G.r(h) + G.tile), dir = sign;
        add(rg, 'path', { class: 'hl', d: 'M' + E.pt(x0, h + 0.28) + 'L' + E.pt(x0 + dir * 0.42, h + 0.4) + 'L' + E.pt(x0 + dir * 0.42, h - 0.4) + 'L' + E.pt(x0, h - 0.28) + 'Z', style: 'fill:var(--bg-3);stroke:var(--steel);stroke-width:0.8' });
        add(rg, 'path', { class: 'steel-s2', d: 'M' + E.pt(x0 + dir * 0.62, h + 0.35) + 'Q' + E.pt(x0 + dir * 0.85, h) + ' ' + E.pt(x0 + dir * 0.62, h - 0.35), style: 'stroke-dasharray:1.5 1.5' });
      });
    });

    /* ---- dimensions */
    const dims = add(root, 'g', { class: 'dims', 'data-layer': 'dims' });
    {
      const xD = 26, yT = E.py(G.H), yB = E.py(0);
      dimLine(dims, xD, yB, xD, yT, [[xD - 4, yB, E.px(-G.R) - 6, yB], [xD - 4, yT, E.X0 - 6, yT]]);
      factText(dims, xD - 7, (yT + yB) / 2, 'ship.height', 'dim-t', { transform: 'rotate(-90 ' + fx(xD - 7) + ' ' + fx((yT + yB) / 2) + ')', 'text-anchor': 'middle' });
      const xN = 56, yN = E.py(G.yN0);
      dimLine(dims, xN, yN, xN, yT, [[xN - 4, yN, E.px(-G.R) - 6, yN]]);
      factText(dims, xN - 7, (yT + yN) / 2, 'ship.noseconeHeight', 'dim-t', { transform: 'rotate(-90 ' + fx(xN - 7) + ' ' + fx((yT + yN) / 2) + ')', 'text-anchor': 'middle' }, () => 'NOSE ' + SX.fmt('ship.noseconeHeight'));
      const yDm = E.BASE + 30;
      dimLine(dims, E.px(-G.R), yDm, E.px(G.R), yDm, [[E.px(-G.R), E.BASE + 4, E.px(-G.R), yDm + 4], [E.px(G.R), E.BASE + 4, E.px(G.R), yDm + 4]]);
      factText(dims, E.X0, yDm - 6, 'ship.diameter', 'dim-t', { 'text-anchor': 'middle' }, () => 'Ø ' + SX.fmt('ship.diameter'));
    }
    txt(root, 16, E.Hgt - 26, 'PROPORTIONS FROM PUBLISHED HEIGHT, DIAMETER AND ENGINE SIZES. INTERNAL STATIONS ESTIMATED.', 'lbl-sub wide-only');
    txt(root, 16, E.Hgt - 12, 'WALL AND TILE THICKNESS EXAGGERATED. FLAP OUTLINES FROM PHOTOS. ENGINE CLOCKING SCHEMATIC.', 'lbl-sub wide-only');

    return root;
  }

  /* ================================================================== leader labels for the elevation
     Each label: side (L exterior, R interior), part id, name, sub line (string or fn), anchor [x m, h m], fact key
     (for the confidence dot on the sub line). Positions are laid out at runtime so they never overlap. */

  const CUT_LABELS = [
    { side: 'R', id: ID.hLOX, name: 'LOX header tank', sub: 'Landing oxygen, nose tip', at: [0.9, 50.4] },
    { side: 'R', id: ID.hCH4, name: 'Methane header tank', sub: 'Landing methane sphere', at: [0.7, 47.9] },
    { side: 'R', id: ID.copv, name: 'Pressure vessels', sub: () => SX.fmt('ship.copvs'), key: 'ship.copvs', at: [2.9, 45.5] },
    { side: 'R', id: ID.fwd, name: 'Forward flap actuator', sub: 'Electric, drives the hinge', at: [3.45, 42.25] },
    { side: 'R', id: ID.bay, name: 'Payload bay', sub: () => 'Barrel ' + SX.fmt('ship.payloadBarrel'), key: 'ship.payloadBarrel', at: [3.85, 38.6] },
    { side: 'R', id: ID.pez, name: 'PEZ dispenser + door', sub: 'Door on the far, leeward wall', at: [2.0, 36.1] },
    { side: 'R', id: ID.fd, name: 'Forward dome', sub: 'Bay floor, tank top', at: [3.3, G.fwd(3.3)] },
    { side: 'R', id: ID.ch4, name: 'Methane main tank', sub: () => SX.fmt('ship.propCH4') + ' CH4', key: 'ship.propCH4', at: [2.2, 26.8] },
    { side: 'R', id: ID.hLOX, name: 'Header feed lines', sub: 'Vacuum jacketed on V3', at: [G.lineLOX, 24.2] },
    { side: 'R', id: ID.cd, name: 'Common dome', sub: () => 'Lowered ' + SX.fmt('ship.domeLowering') + ' on V3', key: 'ship.domeLowering', at: [3.7, G.common(3.7)] },
    { side: 'R', id: ID.dc, name: 'Downcomer', sub: 'Methane through the LOX', at: [G.dcR * 0.5, 14.5] },
    { side: 'R', id: ID.lox, name: 'LOX main tank', sub: () => SX.fmt('ship.propLOX') + ' LOX', key: 'ship.propLOX', at: [2.2, 11.2] },
    { side: 'R', id: ID.ad, name: 'Aft dome + thrust puck', sub: 'Sea-level engines hang here', at: [1.9, G.aft(1.9)] },
    { side: 'R', id: ID.attic, name: 'Attic', sub: 'RVac tops, recessed', at: [G.vac.x + 0.3, G.vac.top + 0.45] },
    { side: 'R', id: ID.aft, name: 'Aft flap actuator', sub: () => '1 actuator, 3 motors', key: 'ship.aftFlapActuator', at: [3.97, 5.3] },
    { side: 'R', id: ID.vac, name: 'Raptor Vacuum 3', sub: () => SX.fmt('raptor.rvac3.thrust') + ', fixed', key: 'raptor.rvac3.thrust', at: [G.vac.x + 0.75, 1.1] },
    { side: 'R', id: ID.sl, name: 'Sea-level Raptor 3', sub: () => SX.fmt('raptor.r3.thrustSL') + ', gimbals', key: 'raptor.r3.thrustSL', at: [G.sl.x + 0.3, 1.0] },

    { side: 'L', id: ID.nose, name: 'Nosecone', sub: () => SX.fmt('ship.noseconeHeight') + ' ogive', key: 'ship.noseconeHeight', at: [-1.3, 50.6] },
    { side: 'L', id: ID.rcs, name: 'Nose pitch thruster', sub: 'Tile-covered vent', at: [-(G.r(G.H * 0.94) + 0.45), G.H * 0.94] },
    { side: 'L', id: ID.fwd, name: 'Forward flaps', sub: () => SX.fmt('ship.fwdFlapSpacing') + ' apart', key: 'ship.fwdFlapSpacing', at: [-(G.R + 1.4), 42.6] },
    { side: 'L', id: ID.pins, name: 'Catch points', sub: 'For the tower arms', at: [-(G.R + 0.6), 39.6] },
    { side: 'L', id: ID.rcs, name: 'Roll thrusters', sub: 'Payload bay, both sides', at: [-(G.R + 0.45), G.H * 0.695] },
    { side: 'L', id: ID.ports, name: 'Docking drogue', sub: 'Leeward, hidden (View B)', at: [-2.35 - 0.7, 35.4] },
    { side: 'L', id: ID.hs, name: 'Heat-shield tiles', sub: () => SX.fmt('ship.tileCount') + ' (V1 era)', key: 'ship.tileCount', at: [-2.6, 30.5] },
    { side: 'L', id: ID.rcs, name: 'Mid-body thrusters', sub: 'Docking control', at: [-(G.R + 0.45), G.H * 0.475] },
    { side: 'L', id: ID.aft, name: 'Aft flaps', sub: () => SX.fmt('ship.aftFlapSpacing') + ' apart', key: 'ship.aftFlapSpacing', at: [-(G.R + 2.6), 7.4] },
    { side: 'L', id: ID.ports, name: 'Transfer ports', sub: 'LOX + CH4 plates, leeward', at: [-1.35, 4.2] },
    { side: 'L', id: ID.bayE, name: 'Engine bay (skirt)', sub: 'Unpressurized', at: [-3.2, 0.9] },
  ];

  // One number per part id, in top-to-bottom order of the highest label for it: the drawing key.
  const CUT_NUM = (function () {
    const best = {};
    CUT_LABELS.forEach((l) => { best[l.id] = Math.max(best[l.id] == null ? -1 : best[l.id], l.at[1]); });
    const ids = Object.keys(best).sort((a, b) => best[b] - best[a]);
    const m = {};
    ids.forEach((id, i) => { m[id] = i + 1; });
    return m;
  })();

  function relax(items, gap, lo, hi) {
    items.sort((a, b) => a.want - b.want);
    let prev = -1e9;
    items.forEach((it) => { it.y = Math.max(it.want, prev + gap); prev = it.y; });
    let next = hi + gap;
    for (let i = items.length - 1; i >= 0; i--) { items[i].y = Math.min(items[i].y, next - gap); next = items[i].y; }
    prev = lo - gap;
    items.forEach((it) => { it.y = Math.max(it.y, prev + gap); prev = it.y; });
    return items;
  }

  /** Draw leader labels (wide mode) and numbered balloons (compact mode) into the elevation SVG. */
  function buildCutLabels(root) {
    const wide = add(root, 'g', { class: 'labels-wide', 'data-layer': 'labels' });
    const compact = add(root, 'g', { class: 'labels-compact off', 'data-layer': 'labels' });
    const TR = 454, TL = 184;
    ['L', 'R'].forEach((side) => {
      const items = CUT_LABELS.filter((l) => l.side === side).map((l) => ({ l, want: E.py(l.at[1]) + 4 }));
      relax(items, 27, 52, E.Hgt - 52);
      items.forEach(({ l, y }) => {
        const ax = E.px(l.at[0]), ay = E.py(l.at[1]);
        const g = add(wide, 'g', { class: 'lab', 'data-part': l.id });
        const sx = side === 'R' ? TR - 6 : TL + 6;
        const ex = side === 'R' ? TR - 18 : TL + 18;
        add(g, 'path', { class: 'ldr', d: 'M' + fx(ax) + ',' + fx(ay) + 'L' + fx(ex) + ',' + fx(y - 4) + 'L' + fx(sx) + ',' + fx(y - 4) });
        add(g, 'circle', { class: 'ldr-dot', cx: fx(ax), cy: fx(ay), r: 2 });
        const anchor = side === 'R' ? 'start' : 'end';
        const tx = side === 'R' ? TR : TL;
        txt(g, tx, y, U(l.name), 'lbl', { 'text-anchor': anchor });
        if (typeof l.sub === 'function') factText(g, tx, y + 11, l.key, 'lbl-sub', { 'text-anchor': anchor }, l.sub);
        else if (l.sub) txt(g, tx, y + 11, l.sub, 'lbl-sub', { 'text-anchor': anchor });
      });
      // compact: balloons
      const bx = side === 'R' ? 440 : 160;
      const bitems = CUT_LABELS.filter((l) => l.side === side).map((l) => ({ l, want: E.py(l.at[1]) }));
      relax(bitems, 21, 60, E.Hgt - 60);
      bitems.forEach(({ l, y }) => {
        const ax = E.px(l.at[0]), ay = E.py(l.at[1]);
        const g = add(compact, 'g', { class: 'lab', 'data-part': l.id });
        const ex = side === 'R' ? bx - 12 : bx + 12;
        add(g, 'path', { class: 'ldr', d: 'M' + fx(ax) + ',' + fx(ay) + 'L' + fx(ex) + ',' + fx(y) });
        add(g, 'circle', { class: 'ldr-dot', cx: fx(ax), cy: fx(ay), r: 1.8 });
        const b = add(g, 'g', { class: 'balloon' });
        add(b, 'circle', { cx: bx, cy: fx(y), r: 9 });
        txt(b, bx, y + 3.5, String(CUT_NUM[l.id]), '', { 'text-anchor': 'middle' });
        add(g, 'title', { text: l.name });
      });
    });
  }

  /* ================================================================== View B: the leeward side, lying down */

  function buildViewB() {
    const S = 9.5, X0 = 66, CY = 125, W = 640, Hh = 290;
    const px = (h) => X0 + h * S, py = (lat) => CY - lat * S;
    const pt = (h, lat) => fx(px(h)) + ',' + fx(py(lat));
    const root = svg('svg', { viewBox: '0 0 ' + W + ' ' + Hh, role: 'group', 'aria-label': 'View B: the leeward side of the ship lying horizontally, nose to the right' });
    const defs = add(root, 'defs', {});
    const sg = add(defs, 'linearGradient', { id: 'sh-steelB', x1: '0', x2: '0', y1: '0', y2: '1' });
    add(sg, 'stop', { offset: '0', style: 'stop-color:var(--sh-k5)' });
    add(sg, 'stop', { offset: '0.45', style: 'stop-color:var(--sh-k8)' });
    add(sg, 'stop', { offset: '1', style: 'stop-color:var(--sh-k4)' });
    txt(root, 16, 22, 'VIEW B', 'lbl-title');
    txt(root, 16, Hh - 10, 'LEEWARD SIDE, NOSE RIGHT. POSITIONS ESTIMATED; DOOR AND DROGUE LAYOUT SCHEMATIC.', 'lbl-sub');

    const top = [], bot = [];
    for (let i = 0; i <= 48; i++) { const h = G.yN0 + (G.noseL * i) / 48; top.push([h, G.r(h)]); }
    const outline = 'M' + pt(0, G.R) + 'L' + top.map(([h, r]) => pt(h, r)).join('L') + 'L' + top.slice().reverse().map(([h, r]) => pt(h, -r)).join('L') + 'L' + pt(0, -G.R) + 'Z';
    add(root, 'path', { class: 'axis', d: 'M' + fx(px(0) - 12) + ',' + CY + 'L' + fx(px(G.H) + 14) + ',' + CY });

    // flaps first (they sit behind the hull edge)
    const fl = add(root, 'g', {});
    [-1, 1].forEach((s) => {
      const af = G.aftFlap, ff = G.fwdFlap;
      const ag = partG(fl, ID.aft, {}, 'Aft flap, view B');
      add(ag, 'path', { class: 'hl', d: 'M' + pt(af.root0, s * G.R) + 'L' + pt(af.root1, s * G.R) + 'L' + pt(af.tipTop, s * (G.R + af.span)) + 'L' + pt(af.tipBot, s * (G.R + af.span)) + 'Z', style: 'fill:var(--sh-k5);stroke:var(--steel);stroke-width:0.9' });
      const fg = partG(fl, ID.fwd, {}, 'Forward flap, view B');
      const lat0 = (h) => s * G.r(h) * 0.94;
      add(fg, 'path', { class: 'hl', d: 'M' + pt(ff.root0, lat0(ff.root0)) + 'L' + pt(ff.root1, lat0(ff.root1)) + 'L' + pt(ff.tipTop, s * (G.R + ff.span * 0.9)) + 'L' + pt(ff.tipBot, s * (G.R + ff.span * 0.9)) + 'Z', style: 'fill:var(--sh-k6);stroke:var(--steel);stroke-width:0.9' });
    });

    // hull: bare steel on the leeward side, rings, tiles wrapping at the nose and edges
    const hull = partG(root, ID.nose, {}, 'Leeward hull, view B');
    add(hull, 'path', { d: outline, style: 'fill:url(#sh-steelB)' });
    const ringH = SX.val('ship.ringHeight', 1.8);
    for (let h = ringH; h < G.yN0; h += ringH) add(hull, 'path', { d: 'M' + pt(h, G.R) + 'L' + pt(h, -G.R), style: 'stroke:var(--sh-k3);stroke-width:0.6;opacity:0.7' });
    add(hull, 'path', { class: 'hl', d: outline, style: 'fill:none;stroke:var(--steel);stroke-width:1' });
    const tiles = partG(root, ID.hs, {}, 'Tiles wrapping onto the leeward nose');
    {
      const n0 = G.H - 5.2, pts = [];
      for (let i = 0; i <= 20; i++) { const h = n0 + (G.H - n0) * (i / 20); pts.push([h, G.r(h)]); }
      const cap = 'M' + pt(n0, G.r(n0)) + 'Q' + pt(n0 - 1.6, 0) + ' ' + pt(n0, -G.r(n0)) + 'L' + pts.map(([h, r]) => pt(h, -r)).join('L') + 'L' + pts.slice().reverse().map(([h, r]) => pt(h, r)).join('L') + 'Z';
      add(tiles, 'path', { class: 'hl', d: cap, style: 'fill:var(--tile);stroke:var(--sh-k3);stroke-width:0.7' });
      add(tiles, 'path', { d: 'M' + pt(0, G.R - 0.12) + 'L' + pt(n0, G.R - 0.12) + 'M' + pt(0, -G.R + 0.12) + 'L' + pt(n0, -G.R + 0.12), style: 'stroke:var(--tile);stroke-width:2.4' });
    }

    // raceway
    const rw = partG(root, ID.av, {}, 'Raceway, view B');
    add(rw, 'rect', { class: 'hl', x: fx(px(G.H * 0.05)), y: fx(py(-2.75)), width: fx((G.H * 0.69) * S), height: fx(0.5 * S), style: 'fill:var(--sh-k3);stroke:var(--steel-2);stroke-width:0.7' });
    for (let h = G.H * 0.05 + 1.2; h < G.H * 0.74; h += 1.2) add(rw, 'path', { d: 'M' + pt(h, -2.75) + 'L' + pt(h, -3.25), style: 'stroke:var(--sh-k2);stroke-width:0.8' });

    // PEZ door
    const door = partG(root, ID.pez, {}, 'PEZ door, view B');
    add(door, 'rect', { class: 'hl', x: fx(px(G.door[0])), y: fx(py(1.65)), width: fx((G.door[1] - G.door[0]) * S), height: fx(3.3 * S), rx: 6, style: 'fill:var(--sh-k3);stroke:var(--fg-2);stroke-width:1' });
    // docking drogues and transfer plates
    const ports = partG(root, ID.ports, {}, 'Docking drogues and transfer plates, view B');
    [[35.6, 2.75], [35.6, -2.75]].forEach(([h, lat]) => {
      add(ports, 'circle', { class: 'hl', cx: fx(px(h)), cy: fx(py(lat)), r: fx(0.62 * S), style: 'fill:var(--sh-k2);stroke:var(--fg-2);stroke-width:1' });
      add(ports, 'circle', { cx: fx(px(h)), cy: fx(py(lat)), r: fx(0.28 * S), style: 'fill:var(--sh-k1)' });
    });
    [[4.4, 1.95], [4.4, -1.95]].forEach(([h, lat]) => {
      add(ports, 'circle', { class: 'hl', cx: fx(px(h)), cy: fx(py(lat)), r: fx(0.62 * S), style: 'fill:var(--sh-k2);stroke:var(--fg-2);stroke-width:1' });
      add(ports, 'circle', { cx: fx(px(h)), cy: fx(py(lat)), r: fx(0.28 * S), style: 'fill:var(--sh-k1)' });
    });
    add(ports, 'rect', { class: 'hl', x: fx(px(3.0)), y: fx(py(1.05)), width: fx(2.6 * S), height: fx(0.95 * S), rx: 2, style: 'fill:var(--lox);fill-opacity:0.35;stroke:var(--lox);stroke-width:1' });
    add(ports, 'rect', { class: 'hl', x: fx(px(3.0)), y: fx(py(-0.1)), width: fx(2.6 * S), height: fx(0.95 * S), rx: 2, style: 'fill:var(--ch4);fill-opacity:0.35;stroke:var(--ch4);stroke-width:1' });
    // catch points on both edges
    const pins = partG(root, ID.pins, {}, 'Catch points, view B');
    [-1, 1].forEach((s) => add(pins, 'rect', { class: 'hl', x: fx(px(G.pins[0])), y: fx(s > 0 ? py(G.r(G.pins[0]) + 0.55) : py(-G.r(G.pins[0]))), width: fx((G.pins[1] - G.pins[0]) * S), height: fx(0.55 * S), style: 'fill:var(--steel);stroke:var(--steel);stroke-width:0.6' }));
    // engine bells peeking past the skirt edge (tail)
    add(root, 'path', { d: 'M' + pt(0, G.R * 0.92) + 'L' + pt(-0.35, G.R * 0.8) + 'L' + pt(-0.35, -G.R * 0.8) + 'L' + pt(0, -G.R * 0.92), style: 'fill:none;stroke:var(--steel-2);stroke-width:0.8;stroke-dasharray:2 2' });

    // labels (hand placed: row y, anchor side)
    const labs = [
      { id: ID.aft, t: 'AFT FLAPS', h: 6.5, lat: G.R + 3.4, row: 30, side: 'start' },
      { id: ID.pins, t: 'CATCH POINTS', h: G.pins[0] + 0.3, lat: G.R + 0.5, row: 48, side: 'end' },
      { id: ID.hs, t: 'NOSE TILES WRAP LEEWARD', h: 50.2, lat: 1.0, row: 30, side: 'end' },
      { id: ID.ports, t: 'LOX/CH4 TRANSFER PLATES', h: 3.4, lat: -0.55, row: 246, side: 'start' },
      { id: ID.ports, t: 'AFT DROGUES', h: 4.4, lat: -1.95 - 0.6, row: 228, side: 'start' },
      { id: ID.av, t: 'RACEWAY', h: 14, lat: -3.25, row: 228, side: 'start' },
      { id: ID.fwd, t: 'FORWARD FLAPS', h: 43.0, lat: -(G.R + 2.05), row: 264, side: 'end', key: 'ship.fwdFlapSpacing', sub: () => ', ' + SX.fmt('ship.fwdFlapSpacing') + ' APART' },
      { id: ID.pez, t: 'PEZ DOOR', h: G.door[0] + 0.4, lat: -1.65, row: 228, side: 'end' },
      { id: ID.ports, t: 'FORWARD DROGUES', h: 35.6, lat: -2.75 - 0.62, row: 246, side: 'end' },
    ];
    const lg = add(root, 'g', {});
    labs.forEach((L) => {
      const ax = px(L.h), ay = py(L.lat);
      const g = add(lg, 'g', { class: 'lab', 'data-part': L.id });
      const ly = L.row < CY ? L.row + 5 : L.row - 12;
      add(g, 'path', { class: 'ldr', d: 'M' + fx(ax) + ',' + fx(ay) + 'L' + fx(ax) + ',' + fx(ly) });
      add(g, 'circle', { class: 'ldr-dot', cx: fx(ax), cy: fx(ay), r: 1.8 });
      const tx = L.side === 'start' ? ax + 4 : ax - 4;
      if (L.sub) {
        const t = add(g, 'text', { x: fx(tx), y: L.row, class: 'lbl', 'text-anchor': L.side });
        add(t, 'tspan', { text: L.t });
        const s = add(t, 'tspan', { style: 'fill:var(--fg-2)' });
        const dot = add(t, 'tspan', { class: 'cdot c-' + confOf(L.key), dx: '3', dy: '-3', text: '●' });
        const run = () => { s.textContent = L.sub(); };
        run(); unitHooks.push(run);
        void dot;
      } else {
        txt(g, tx, L.row, L.t, 'lbl', { 'text-anchor': L.side });
      }
    });
    return root;
  }

  /* ================================================================== interaction plumbing shared by every instrument */

  const scopes = [];        // containers whose [data-part] children mirror the selection
  let hoverId = null;
  let mountEl = null;

  function markHover(id) {
    if (!mountEl) return;
    mountEl.querySelectorAll('.is-hover').forEach((n) => n.classList.remove('is-hover'));
    if (id) mountEl.querySelectorAll('[data-part="' + id + '"]').forEach((n) => n.classList.add('is-hover'));
  }
  function markSelected(id) {
    scopes.forEach((sc) => {
      sc.querySelectorAll('.is-selected').forEach((n) => n.classList.remove('is-selected'));
      if (!id) return;
      let hits = sc.querySelectorAll('[data-part="' + id + '"]');
      if (!hits.length) {
        const line = SX.lineage(id).map((p) => p.id).reverse().slice(1).filter((x) => x !== 'ship' && x !== 'stack');
        for (const a of line) { hits = sc.querySelectorAll('[data-part="' + a + '"]'); if (hits.length) break; }
      }
      hits.forEach((n) => n.classList.add('is-selected'));
    });
  }
  function tipHTML(id) {
    const p = SX.part(id);
    if (!p) return SX.esc(id);
    return '<b>' + SX.esc(p.name) + '</b>' + SX.esc(firstSentence(p.summary));
  }
  function wire(rootEl) {
    scopes.push(rootEl);
    const find = (t) => (t && t.closest ? t.closest('[data-part]') : null);
    rootEl.addEventListener('click', (e) => {
      const t = find(e.target);
      if (t && rootEl.contains(t)) SX.select(t.dataset.part);
    });
    rootEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const t = find(e.target);
      if (t && t === e.target) { e.preventDefault(); SX.select(t.dataset.part); }
    });
    rootEl.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const t = find(e.target);
      const id = t ? t.dataset.part : null;
      if (id !== hoverId) { hoverId = id; markHover(id); SX.hover(id, { from: 'ship' }); }
      if (id) SX.tip.show(tipHTML(id), e.clientX, e.clientY); else SX.tip.hide();
    });
    rootEl.addEventListener('pointerleave', () => { if (hoverId) { hoverId = null; markHover(null); SX.hover(null, { from: 'ship' }); } SX.tip.hide(); });
    rootEl.addEventListener('focusin', (e) => { const t = find(e.target); if (t && t === e.target) markHover(t.dataset.part); });
    rootEl.addEventListener('focusout', () => markHover(null));
  }
  function pulse(node) {
    if (!node || RM) return;
    node.classList.remove('sh-pulse');
    void node.getBoundingClientRect();
    node.classList.add('sh-pulse');
    setTimeout(() => node.classList.remove('sh-pulse'), 1300);
  }

  /* ================================================================== section 1: cutaway + key */

  const cutState = { compact: null, svgEl: null, frame: null };
  function keyCat(id) {
    if ([ID.hLOX, ID.lox].includes(id)) return 'lox';
    if ([ID.hCH4, ID.ch4, ID.dc].includes(id)) return 'ch4';
    if ([ID.hs].includes(id)) return 'tile';
    if ([ID.sl, ID.vac].includes(id)) return 'eng';
    return 'steel';
  }

  function sectionCutaway(host) {
    const sec = el('section', { class: 'sh-sec', 'aria-labelledby': 'sh-h-cut' });
    sec.appendChild(el('div', { class: 'sh-sec-head' },
      el('span', { class: 'eyebrow' }, '3.1'), el('h3', { class: 'h3', id: 'sh-h-cut' }, 'Cutaway'),
      el('span', { class: 'small muted' }, 'Left half: the tiled windward face. Right half: cut open on the centreline. Click any part.')));
    const row = el('div', { class: 'sh-row' });
    sec.appendChild(row);

    /* left column: intro, specs, key */
    const col = el('div', { class: 'sh-col' });
    col.appendChild(el('div', { class: 'prose', html: SX.withFacts(
      '<p>The ship is a stack of stainless-steel rings, {{ship.diameter}} wide, whose walls are also the propellant tanks. Liquid methane sits on top, liquid oxygen below, and the six engines hang underneath. The two tanks share a single dome; everything above them is payload bay and nosecone.</p>' +
      '<p>Two details explain most of the layout. The heavy oxygen goes at the bottom, next to the thrust structure. And the small <b>header tanks</b> live in the nose: during the belly-first fall the main tanks slosh, so the landing engines drink from these instead.</p>') }));
    const specs = el('div', { class: 'panel panel-pad' });
    specs.appendChild(el('div', { class: 'sh-card-h' }, 'Starship V3 at a glance'));
    const tb = el('tbody');
    [['Height', 'ship.height'], ['Diameter', 'ship.diameter'], ['Propellant', 'ship.propTotal'], ['LOX / methane (derived)', null],
      ['Thrust, vacuum (6 engines)', 'ship.thrustVac'], ['Payload to orbit, reusable', 'stack.payloadLEOReusable'], ['Dry mass', 'ship.dryMass']].forEach(([k, f]) => {
      const td = el('td', { html: f ? SX.factHTML(f, f === 'stack.payloadLEOReusable' ? { plus: true } : null) : SX.factHTML('ship.propLOX') + ' / ' + SX.factHTML('ship.propCH4') });
      tb.appendChild(el('tr', null, el('th', { scope: 'row' }, k), td));
    });
    specs.appendChild(el('table', { class: 'spec-table sh-kv' }, tb));
    specs.appendChild(el('p', { class: 'sh-note', style: { marginTop: '10px' } }, 'SpaceX has not published the dry mass or the LOX and methane split. The split assumes a mixture ratio near 3.6.'));
    col.appendChild(specs);

    const keyPanel = el('div', { class: 'panel panel-pad' });
    keyPanel.appendChild(el('div', { class: 'sh-card-h' }, 'Key to the drawing'));
    const list = el('ul', { class: 'sh-plist', 'aria-label': 'Ship parts' });
    const groups = [
      ['Nose', [ID.nose, ID.hLOX, ID.hCH4, ID.copv, ID.fwd, ID.pins]],
      ['Payload', [ID.bay, ID.pez]],
      ['Tanks', [ID.fd, ID.ch4, ID.dc, ID.cd, ID.lox, ID.ad]],
      ['Aft', [ID.bayE, ID.attic, ID.aft, ID.sl, ID.vac]],
      ['Across the hull', [ID.hs, ID.rcs, ID.ports, ID.av]],
    ];
    groups.forEach(([gname, ids]) => {
      list.appendChild(el('li', { class: 'sh-group-h', 'aria-hidden': 'true' }, gname));
      ids.forEach((id) => {
        const n = CUT_NUM[id];
        list.appendChild(el('li', null, el('button', { type: 'button', 'data-part': id, 'aria-label': partName(id) + (n ? ', drawing number ' + n : '') },
          el('span', { class: 'n' }, n ? String(n) : '', el('i', { class: 'c-' + keyCat(id) })), el('span', null, partName(id)))));
      });
    });
    keyPanel.appendChild(list);
    col.appendChild(keyPanel);
    wire(list);
    row.appendChild(col);

    /* right column: the drawing, then View B */
    const fig = el('div', { class: 'sh-fig' });
    const frame = el('figure', { class: 'viz viz-grid sh-cut', style: { margin: 0 } });
    const bar = el('div', { class: 'sh-titlebar' }, el('span', null, 'Starship V3 ', el('b', null, 'View A, windward face and section')), el('span', null, 'Proportions from published dimensions'));
    frame.appendChild(bar);
    const tools = el('div', { class: 'row', style: { display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px 14px', borderBottom: '1px solid var(--line)' } });
    const svgBox = el('div', { class: 'sh-scroll' });
    const svgEl = buildCutaway();
    buildCutLabels(svgEl);
    svgBox.appendChild(svgEl);
    const toggles = [
      ['Propellant', true, (on) => svgEl.classList.toggle('no-prop', !on)],
      ['Plumbing', true, (on) => svgEl.querySelectorAll('[data-layer="plumbing"]').forEach((n) => n.classList.toggle('is-off', !on))],
      ['Labels', true, (on) => svgEl.querySelectorAll('[data-layer="labels"]').forEach((n) => n.classList.toggle('is-off', !on))],
      ['Dimensions', true, (on) => svgEl.querySelectorAll('[data-layer="dims"]').forEach((n) => n.classList.toggle('is-off', !on))],
    ];
    toggles.forEach(([name, on, fn]) => {
      const b = el('button', { type: 'button', class: 'btn btn-sm', 'aria-pressed': String(on) }, name);
      b.addEventListener('click', () => { const v = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(v)); fn(v); });
      tools.appendChild(b);
    });
    const leg = el('div', { class: 'legend', style: { marginLeft: 'auto', alignItems: 'center' } },
      el('span', null, el('i', { class: 'sw lox' }), 'LOX'), el('span', null, el('i', { class: 'sw ch4' }), 'Methane'), el('span', null, el('i', { class: 'sw tile' }), 'Tiles'), el('span', null, el('i', { class: 'sw steel' }), 'Steel'));
    tools.appendChild(leg);
    frame.appendChild(tools);
    frame.appendChild(svgBox);
    frame.appendChild(el('figcaption', { class: 'sh-legend sh-note' }, 'Dashed outlines are hidden detail on the far (leeward) side. Dots on figures: green official, blue reported, amber estimate.'));
    fig.appendChild(frame);
    wire(svgEl);

    const frameB = el('figure', { class: 'viz viz-grid', style: { margin: 0 } });
    frameB.appendChild(el('div', { class: 'sh-titlebar' }, el('span', null, 'Starship V3 ', el('b', null, 'View B, leeward side')), el('span', null, 'Docking, transfer and payload hardware')));
    const boxB = el('div', { class: 'sh-scroll' });
    const svgB = buildViewB();
    boxB.appendChild(svgB);
    frameB.appendChild(boxB);
    fig.appendChild(frameB);
    wire(svgB);
    row.appendChild(fig);

    cutState.svgEl = svgEl; cutState.frame = frame; cutState.svgB = svgB;
    const setMode = () => {
      const w = svgBox.clientWidth || frame.clientWidth;
      const compact = w > 0 && w < 560;
      if (compact === cutState.compact) return;
      cutState.compact = compact;
      svgEl.setAttribute('viewBox', compact ? '134 40 332 ' + (E.Hgt - 40) : '0 0 ' + E.W + ' ' + E.Hgt);
      svgEl.querySelector('.labels-wide').classList.toggle('off', compact);
      svgEl.querySelector('.labels-compact').classList.toggle('off', !compact);
      svgEl.querySelectorAll('.dims .dimg').forEach((n, i) => { if (i < 2) n.style.display = compact ? 'none' : ''; });
      svgEl.querySelectorAll('.dims text').forEach((n, i) => { if (i < 2) n.style.display = compact ? 'none' : ''; });
      svgEl.querySelectorAll('.wide-only').forEach((n) => { n.style.display = compact ? 'none' : ''; });
      svgB.style.minWidth = compact ? '600px' : '';
      list.classList.toggle('is-wide', !compact);
    };
    setMode();
    if ('ResizeObserver' in window) new ResizeObserver(setMode).observe(frame);
    else window.addEventListener('resize', setMode);
    host.appendChild(sec);
    return sec;
  }

  /* ================================================================== 2. heat shield explorer
     A close-up of the tile field that peels layer by layer (tiles, felt, ablative, steel), and a section through two
     tiles that blows apart in step with it. Tile size and thickness are not published: the drawing is schematic. */

  const HS = { peel: 0, lost: false, paths: false, api: null };

  /** Polygon for the part of the W x H rect where x/W + y/H <= c (the region not yet peeled). */
  function halfPlane(W, H, c) {
    const corners = [[0, 0], [W, 0], [W, H], [0, H]];
    const f = ([x, y]) => x / W + y / H - c;
    const out = [];
    for (let i = 0; i < 4; i++) {
      const a = corners[i], b = corners[(i + 1) % 4];
      const fa = f(a), fb = f(b);
      if (fa <= 0) out.push(a);
      if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
        const t = fa / (fa - fb);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    return out.length ? 'M' + out.map(([x, y]) => fx(x) + ',' + fx(y)).join('L') + 'Z' : 'M0,0Z';
  }

  function buildTileField() {
    const W = 380, H = 300, r = 23, gap = 1.15;
    const w = Math.sqrt(3) * r;
    const root = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': 'Close-up of the heat-shield tile field, peeling back to the steel' });
    const defs = add(root, 'defs', {});
    const cl = add(defs, 'clipPath', { id: 'hs-frame' });
    add(cl, 'rect', { x: 0, y: 0, width: W, height: H });
    const cF = add(defs, 'clipPath', { id: 'hs-clip-felt' });
    const feltClip = add(cF, 'path', { d: halfPlane(W, H, 2) });
    const cA = add(defs, 'clipPath', { id: 'hs-clip-abl' });
    const ablClip = add(cA, 'path', { d: halfPlane(W, H, 2) });
    const fib = add(defs, 'pattern', { id: 'hs-fibre', width: 14, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-18)' });
    add(fib, 'rect', { width: 14, height: 9, style: 'fill:var(--sh-felt-2)' });
    add(fib, 'path', { d: 'M0,2.5Q4,1 8,3T14,2M0,6.5Q5,5 9,7T14,6', style: 'stroke:var(--sh-felt-2);stroke-width:0.6;fill:none' });
    const spk = add(defs, 'pattern', { id: 'hs-speck', width: 7, height: 7, patternUnits: 'userSpaceOnUse' });
    add(spk, 'rect', { width: 7, height: 7, class: 'f-abl' });
    add(spk, 'circle', { cx: 2, cy: 2, r: 0.6, style: 'fill:var(--sh-k2)' });
    add(spk, 'circle', { cx: 5.3, cy: 4.8, r: 0.5, style: 'fill:var(--sh-k2)' });
    const hot = add(defs, 'radialGradient', { id: 'hs-hot' });
    add(hot, 'stop', { offset: '0', style: 'stop-color:var(--warn);stop-opacity:0.95' });
    add(hot, 'stop', { offset: '0.45', style: 'stop-color:var(--bad);stop-opacity:0.7' });
    add(hot, 'stop', { offset: '1', style: 'stop-color:var(--bad);stop-opacity:0' });
    const sheen = add(defs, 'linearGradient', { id: 'hs-sheen', x1: '0', y1: '0', x2: '0.4', y2: '1' });
    add(sheen, 'stop', { offset: '0', style: 'stop-color:var(--fg);stop-opacity:0.1' });
    add(sheen, 'stop', { offset: '1', style: 'stop-color:var(--fg);stop-opacity:0' });

    const frame = add(root, 'g', { 'clip-path': 'url(#hs-frame)' });
    // steel skin
    const steel = partG(frame, ID.lox, {}, 'Stainless-steel tank wall under the heat shield');
    add(steel, 'rect', { x: 0, y: 0, width: W, height: H, class: 'f-steelplate' });
    for (let y = 18; y < H; y += 58) add(steel, 'path', { d: 'M0,' + y + 'L' + W + ',' + (y - 6), style: 'stroke:var(--sh-k6);stroke-width:0.8' });
    // ablative backup layer
    const abl = partG(frame, ID.abl, { 'clip-path': 'url(#hs-clip-abl)' });
    add(abl, 'rect', { x: 0, y: 0, width: W, height: H, style: 'fill:url(#hs-speck)' });
    // felt blanket
    const felt = partG(frame, ID.felt, { 'clip-path': 'url(#hs-clip-felt)' });
    add(felt, 'rect', { x: 0, y: 0, width: W, height: H, style: 'fill:url(#hs-fibre)' });
    // tile centres
    const tiles = [];
    const rand = rng(7);
    for (let row = -1; row * 1.5 * r < H + r; row++) {
      for (let col = -1; col * w < W + w; col++) {
        const cx = col * w + (row % 2 ? w / 2 : 0), cy = row * 1.5 * r;
        const d = ((W - cx) / W + (H - cy) / H) / 2;
        tiles.push({ cx, cy, d, tone: 0.25 + rand() * 0.75, spin: (rand() - 0.5) * 30 });
      }
    }
    // pins: three per tile, schematic
    const pins = partG(frame, ID.tpin);
    tiles.forEach((t) => {
      for (let k = 0; k < 3; k++) {
        const a = Math.PI / 180 * (90 + 120 * k);
        add(pins, 'circle', { cx: fx(t.cx + Math.cos(a) * r * 0.46), cy: fx(t.cy + Math.sin(a) * r * 0.46), r: 2.3, class: 'f-pin' });
      }
    });
    // lost-tile damage (hidden under the tile until it goes)
    const lostT = tiles.reduce((best, t) => (Math.hypot(t.cx - 128, t.cy - 118) < Math.hypot(best.cx - 128, best.cy - 118) ? t : best), tiles[0]);
    const dmg = add(frame, 'g', { class: 'hs-dmg', 'data-part': ID.abl, style: 'opacity:0' });
    add(dmg, 'path', { d: hexPath(lostT.cx, lostT.cy, r - 1), style: 'fill:url(#hs-speck)' });
    add(dmg, 'circle', { cx: fx(lostT.cx), cy: fx(lostT.cy), r: fx(r * 0.95), style: 'fill:url(#hs-hot)' });
    add(dmg, 'path', { d: hexPath(lostT.cx, lostT.cy, r + 2), style: 'fill:none;stroke:var(--sh-char);stroke-width:2.5;stroke-dasharray:3 2;opacity:0.8' });
    // tiles
    const tileG = partG(frame, ID.tile, {}, 'Heat-shield tiles');
    tiles.forEach((t) => {
      const g = add(tileG, 'g', { class: 'hs-tile' + (t === lostT ? ' hs-lost' : '') });
      add(g, 'path', { d: hexPath(t.cx, t.cy, r - gap), class: 'f-tile', style: 'stroke:var(--sh-k1);stroke-width:1.1' });
      add(g, 'path', { d: hexPath(t.cx, t.cy, r - gap - 0.8), style: 'fill:' + (t.tone > 0.6 ? 'var(--fg)' : 'var(--bg)') + ';opacity:' + fx(0.02 + Math.abs(t.tone - 0.6) * 0.1) });
      add(g, 'path', { d: hexPath(t.cx, t.cy, r - gap - 0.8), style: 'fill:url(#hs-sheen);opacity:' + fx(0.35 + t.tone * 0.5) });
      t.g = g;
    });
    // gap-path overlay
    const gp = add(root, 'g', { class: 'hs-gaps', style: 'display:none', 'aria-hidden': 'true' });
    {
      const row = 4, cy = row * 1.5 * r;
      const pts = [];
      for (let col = -1; col * w < W + w; col++) {
        const cx = col * w + (row % 2 ? w / 2 : 0);
        pts.push([cx - w / 2, cy + r / 2], [cx, cy + r]);
      }
      add(gp, 'path', { class: 'gas-path', d: 'M' + pts.map(([x, y]) => fx(x) + ',' + fx(y)).join('L') });
      const yS = cy + r * 0.75;
      add(gp, 'path', { class: 'gas-straight', d: 'M0,' + fx(yS + 52) + 'L' + W + ',' + fx(yS + 52) });
      const lab1 = add(gp, 'g', {});
      add(lab1, 'rect', { x: 8, y: fx(cy + r + 6), width: 214, height: 17, rx: 3, style: 'fill:var(--bg);fill-opacity:0.85' });
      txt(lab1, 14, cy + r + 18, 'HEX GAPS: NO STRAIGHT PATH FOR GAS', 'lbl', { style: 'fill:var(--accent);font-size:10px' });
      const lab2 = add(gp, 'g', {});
      add(lab2, 'rect', { x: 8, y: fx(yS + 57), width: 238, height: 17, rx: 3, style: 'fill:var(--bg);fill-opacity:0.85' });
      txt(lab2, 14, yS + 69, 'A STRAIGHT SEAM LETS HOT GAS ACCELERATE', 'lbl', { style: 'fill:var(--bad);font-size:10px' });
    }
    // flow arrow
    const flow = add(root, 'g', { 'aria-hidden': 'true' });
    add(flow, 'rect', { x: W - 104, y: 8, width: 96, height: 20, rx: 3, style: 'fill:var(--bg);fill-opacity:0.8' });
    txt(flow, W - 98, 22, 'FLOW', 'lbl-sub', { style: 'fill:var(--fg-2)' });
    add(flow, 'path', { d: 'M' + (W - 66) + ',18L' + (W - 18) + ',18', style: 'stroke:var(--fg-2);stroke-width:1.2' });
    arrowHead(flow, W - 16, 18, 0, 6, 'ldr-dot');

    function update() {
      const p = HS.peel;
      // tiles: the peel front sweeps in from the lower right, up to about 62% of the field
      const fT = SX.clamp(p / 0.42, 0, 1) * 0.66;
      tiles.forEach((t) => {
        if (t === lostT && HS.lost) return;
        const s = SX.smooth(SX.clamp((fT - t.d) / 0.1, 0, 1));
        t.g.style.transform = s ? 'translate(' + fx(18 * s) + 'px,' + fx(-26 * s) + 'px) rotate(' + fx(t.spin * s) + 'deg) scale(' + fx(1 - 0.12 * s) + ')' : '';
        t.g.style.opacity = s ? String(fx(1 - s)) : '';
      });
      const fF = SX.clamp((p - 0.42) / 0.26, 0, 1) * 0.44;
      feltClip.setAttribute('d', halfPlane(W, H, 2 - 2 * fF));
      const fA = SX.clamp((p - 0.7) / 0.24, 0, 1) * 0.26;
      ablClip.setAttribute('d', halfPlane(W, H, 2 - 2 * fA));
      lostT.g.style.transform = HS.lost ? 'translate(70px,-150px) rotate(50deg) scale(0.8)' : '';
      lostT.g.style.opacity = HS.lost ? '0' : '';
      dmg.style.opacity = HS.lost ? '1' : '0';
      gp.style.display = HS.paths ? '' : 'none';
    }
    return { root, update };
  }

  function buildTileSection() {
    const W = 380, H = 300;
    const root = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': 'Section through two heat-shield tiles and the layers beneath them' });
    const defs = add(root, 'defs', {});
    const pl = add(defs, 'linearGradient', { id: 'hs-plasma', x1: '0', x2: '0', y1: '0', y2: '1' });
    add(pl, 'stop', { offset: '0', style: 'stop-color:var(--bad);stop-opacity:0' });
    add(pl, 'stop', { offset: '0.7', style: 'stop-color:var(--bad);stop-opacity:0.28' });
    add(pl, 'stop', { offset: '1', style: 'stop-color:var(--warn);stop-opacity:0.55' });
    const hatch2 = add(defs, 'pattern', { id: 'hs-hatch', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
    add(hatch2, 'rect', { width: 5, height: 5, class: 'f-steelplate' });
    add(hatch2, 'path', { d: 'M0,0L0,5', style: 'stroke:var(--sh-k5);stroke-width:1' });
    const hot = add(defs, 'radialGradient', { id: 'hs-hot2', cy: '0.2' });
    add(hot, 'stop', { offset: '0', style: 'stop-color:var(--warn);stop-opacity:1' });
    add(hot, 'stop', { offset: '0.6', style: 'stop-color:var(--bad);stop-opacity:0.6' });
    add(hot, 'stop', { offset: '1', style: 'stop-color:var(--bad);stop-opacity:0' });

    const X0 = 14, X1 = 196, GAPX = 102, GAPW = 6;
    const base = { tile: 70, tileH: 44, felt: 12, abl: 8, steel: 11 };
    const g = {
      plasma: add(root, 'rect', { x: X0, y: 16, width: X1 - X0, height: 54, style: 'fill:url(#hs-plasma)' }),
      lox: partG(root, ID.lox, {}, 'Tank side: liquid oxygen behind the steel wall'),
      steel: partG(root, ID.lox, {}, 'Stainless-steel tank wall'),
      abl: partG(root, ID.abl),
      felt: partG(root, ID.felt),
      pins: partG(root, ID.tpin),
      tileL: partG(root, ID.tile, {}, 'Ceramic tile, in section'),
      tileR: partG(root, ID.tile, {}, 'Ceramic tile, in section'),
      gap: partG(root, ID.felt, {}, 'Gap filler between tiles'),
      dmg: add(root, 'g', { style: 'opacity:0', 'aria-hidden': 'true' }),
      labels: add(root, 'g', {}),
    };
    // flow arrows in the plasma band
    for (let k = 0; k < 3; k++) {
      const x = X0 + 96 + k * 30;
      add(root, 'path', { d: 'M' + x + ',24L' + (x + 30) + ',46', style: 'stroke:var(--warn);stroke-width:1;opacity:0.7' });
      arrowHead(root, x + 30, 46, Math.atan2(22, 30), 5, 'ldr-dot');
    }
    const tempT = factText(root, 208, 30, 'ship.tileTestTemp', 'lbl', { style: 'font-size:10px' }, () => 'TILE TEST: ' + SX.fmt('ship.tileTestTemp'));
    txt(root, 208, 42, '2019. V3 PEAK NOT PUBLISHED', 'lbl-sub');
    add(root, 'path', { class: 'ldr', d: 'M' + (X1 - 6) + ',40L204,27' });
    void tempT;

    // static shapes; y positions set in update()
    const lox = add(g.lox, 'rect', { class: 'hl', x: X0, width: X1 - X0, height: 44, style: 'fill:var(--lox);fill-opacity:0.18;stroke:none' });
    const steel = add(g.steel, 'rect', { class: 'hl', x: X0, width: X1 - X0, height: base.steel, style: 'fill:url(#hs-hatch);stroke:var(--steel);stroke-width:0.8' });
    const abl = add(g.abl, 'rect', { class: 'hl', x: X0, width: X1 - X0, height: base.abl, style: 'fill:var(--sh-k1);stroke:var(--sh-k3);stroke-width:0.6' });
    const felt = add(g.felt, 'rect', { class: 'hl', x: X0, width: X1 - X0, height: base.felt, style: 'fill:var(--sh-felt);stroke:var(--sh-felt-2);stroke-width:0.6' });
    const tileShape = (x0, x1) => add(x0 < GAPX ? g.tileL : g.tileR, 'path', { class: 'hl', style: 'fill:var(--tile);stroke:var(--sh-k4);stroke-width:0.9' });
    const tL = tileShape(X0, GAPX), tR = tileShape(GAPX + GAPW, X1);
    const socket = [];
    const pinsX = [38, 80, 128, 172];
    const pinEls = pinsX.map((x) => add(g.pins, 'rect', { class: 'hl', x: x - 2, width: 4, style: 'fill:var(--steel);stroke:var(--sh-k4);stroke-width:0.6' }));
    pinsX.forEach((x) => socket.push(add(x < GAPX ? g.tileL : g.tileR, 'rect', { x: x - 3.5, width: 7, height: 9, style: 'fill:var(--sh-k0)' })));
    const gapFill = add(g.gap, 'rect', { class: 'hl', x: GAPX, width: GAPW, style: 'fill:var(--sh-felt);fill-opacity:0.85;stroke:none' });
    // damage: gas jet into the hole, eroded felt, charring ablator
    const dmgGlow = add(g.dmg, 'ellipse', { cx: (GAPX + GAPW + X1) / 2, rx: 60, ry: 26, style: 'fill:url(#hs-hot2)' });
    const dmgArrow = add(g.dmg, 'path', { d: '', style: 'stroke:var(--warn);stroke-width:1.6;fill:none' });
    const dmgHead = add(g.dmg, 'path', { d: '', style: 'fill:var(--warn)' });

    const LABS = [
      { key: 'tile', id: ID.tile, name: 'Ceramic tile', sub: 'Silica-based (reported)' },
      { key: 'gap', id: ID.felt, name: 'Gap + felt filler', sub: 'Filler since Flight 10' },
      { key: 'felt', id: ID.felt, name: 'Felt blanket', sub: 'Insulation' },
      { key: 'pin', id: ID.tpin, name: 'Welded pin', sub: 'Clip-on; simpler on V3' },
      { key: 'abl', id: ID.abl, name: 'Ablative backup', sub: 'Chars if a tile is lost' },
      { key: 'steel', id: ID.lox, name: 'Steel tank wall', sub: 'The ship\'s skin' },
      { key: 'lox', id: ID.lox, name: 'LOX side (at launch)', sub: () => 'Boils at ' + SX.fmt('propellant.loxBoil'), fact: 'propellant.loxBoil' },
    ];
    const labEls = LABS.map((L) => {
      const lg = add(g.labels, 'g', { class: 'lab', 'data-part': L.id });
      const path = add(lg, 'path', { class: 'ldr' });
      const dot = add(lg, 'circle', { class: 'ldr-dot', r: 1.8 });
      const t1 = txt(lg, 216, 0, U(L.name), 'lbl', { style: 'font-size:10.5px' });
      const t2 = typeof L.sub === 'function' ? factText(lg, 216, 0, L.fact, 'lbl-sub', {}, L.sub) : txt(lg, 216, 0, L.sub, 'lbl-sub');
      return { L, path, dot, t1, t2 };
    });
    const lostNote = add(root, 'g', { style: 'display:none' });
    add(lostNote, 'rect', { x: X0, y: H - 34, width: X1 - X0, height: 24, rx: 3, style: 'fill:var(--bad);fill-opacity:0.1;stroke:var(--bad);stroke-width:0.8' });
    txt(lostNote, X0 + 8, H - 18, 'LOST TILE: THE ABLATOR CHARS', 'lbl', { style: 'fill:var(--fg);font-size:9.5px' });

    function tilePath(x0, x1, y0, h) {
      const c = 5;
      return 'M' + x0 + ',' + fx(y0 + h) + 'L' + x0 + ',' + fx(y0 + c) + 'Q' + x0 + ',' + fx(y0) + ' ' + (x0 + c) + ',' + fx(y0) + 'L' + (x1 - c) + ',' + fx(y0) + 'Q' + x1 + ',' + fx(y0) + ' ' + x1 + ',' + fx(y0 + c) + 'L' + x1 + ',' + fx(y0 + h) + 'Z';
    }
    function update() {
      const e = SX.smooth(SX.clamp((HS.peel - 0.08) / 0.8, 0, 1));
      const yT = base.tile, yF = yT + base.tileH + e * 14, yA = yF + base.felt + e * 14, yS = yA + base.abl + e * 14, yL = yS + base.steel;
      tL.setAttribute('d', tilePath(X0, GAPX, yT, base.tileH));
      tR.setAttribute('d', tilePath(GAPX + GAPW, X1, yT, base.tileH));
      socket.forEach((s) => s.setAttribute('y', fx(yT + base.tileH - 9)));
      gapFill.setAttribute('y', fx(yT + 6)); gapFill.setAttribute('height', fx(base.tileH - 6));
      felt.setAttribute('y', fx(yF)); abl.setAttribute('y', fx(yA)); steel.setAttribute('y', fx(yS)); lox.setAttribute('y', fx(yL));
      const pinTop = yS - (base.felt + base.abl) - 8 - e * 20;
      pinEls.forEach((p) => { p.setAttribute('y', fx(pinTop)); p.setAttribute('height', fx(yS - pinTop)); });
      g.tileR.style.transform = HS.lost ? 'translate(40px,-60px) rotate(14deg)' : '';
      g.tileR.style.opacity = HS.lost ? '0' : '';
      g.tileR.style.transition = RM ? '' : 'transform 0.6s, opacity 0.6s';
      g.dmg.style.opacity = HS.lost ? '1' : '0';
      dmgGlow.setAttribute('cy', fx(yA + 2));
      const mx = (GAPX + GAPW + X1) / 2;
      dmgArrow.setAttribute('d', 'M' + fx(mx - 30) + ',34Q' + fx(mx) + ',' + fx(yT) + ' ' + fx(mx) + ',' + fx(yA - 6));
      dmgHead.setAttribute('d', 'M' + fx(mx) + ',' + fx(yA - 1) + 'L' + fx(mx - 4) + ',' + fx(yA - 9) + 'L' + fx(mx + 4) + ',' + fx(yA - 9) + 'Z');
      felt.setAttribute('width', HS.lost ? fx(GAPX + GAPW + 8 - X0) : fx(X1 - X0));
      lostNote.style.display = HS.lost ? '' : 'none';
      // labels: anchor points, then keep them apart
      const anchors = {
        tile: [X1 - 14, yT + 12], gap: [GAPX + GAPW / 2, yT + 22], felt: [X1 - 8, yF + base.felt / 2],
        pin: [pinsX[3] + 2, pinTop + 4], abl: [X1 - 8, yA + base.abl / 2], steel: [X1 - 8, yS + base.steel / 2], lox: [X1 - 8, yL + 22],
      };
      const items = labEls.map((le) => ({ le, want: anchors[le.L.key][1] + 3 }));
      relax(items, 25, 62, H - 40);
      items.forEach(({ le, y }) => {
        const [ax, ay] = anchors[le.L.key];
        le.path.setAttribute('d', 'M' + fx(ax) + ',' + fx(ay) + 'L' + 204 + ',' + fx(y - 4) + 'L' + 212 + ',' + fx(y - 4));
        le.dot.setAttribute('cx', fx(ax)); le.dot.setAttribute('cy', fx(ay));
        le.t1.setAttribute('y', fx(y));
        le.t2.setAttribute('y', fx(y + 11));
      });
    }
    return { root, update };
  }

  const PEEL_STAGES = [[0.02, 'Tiles intact'], [0.42, 'Tiles lifting'], [0.7, 'Felt blanket'], [0.94, 'Ablative layer'], [1.01, 'Steel skin']];

  function sectionHeatShield(host) {
    const sec = el('section', { class: 'sh-sec', 'aria-labelledby': 'sh-h-hs' });
    sec.appendChild(el('div', { class: 'sh-sec-head' },
      el('span', { class: 'eyebrow' }, '3.2'), el('h3', { class: 'h3', id: 'sh-h-hs' }, 'Heat shield'),
      el('span', { class: 'small muted' }, 'Peel the tiles back to the steel, then lose one.')));
    const row = el('div', { class: 'sh-row' });
    sec.appendChild(row);

    const col = el('div', { class: 'sh-col' });
    col.appendChild(el('div', { class: 'prose', html: SX.withFacts(
      '<p>Reentry from orbit turns the ship\'s speed into heat in the air around it. Starship takes that heat on its belly: the whole windward side is covered in black ceramic tiles, reported to be silica-based, that radiate the heat back out and let little of it through to the steel. A 2019 test ran tile samples at about {{ship.tileTestTemp}}, which Musk called orbital entry temperature. SpaceX has not published V3 peak heating.</p>' +
      '<p>The tiles are hexagons so that no gap runs straight across the shield. Hot gas that finds a seam has to keep turning, and it cannot build up speed. Each tile clips onto small pins welded to the steel, over a white felt blanket, over a black ablative layer.</p>' +
      '<p><b>V3 changes:</b> a simpler pin, nearly every tile pinned (glue only at the nose tip), one horizontal nose seam removed. Ship 41 added an extended ablative layer and extra retention on tiles that had loosened.</p>') }));
    const lose = el('div', { class: 'callout hs-callout' });
    lose.innerHTML = SX.withFacts('<b style="color:var(--fg)">When a tile is lost.</b> The gap exposes the felt, and then the ablative backup layer that has sat on the steel since {{ship.ablativeSince}}. The ablator chars and erodes, spending the heat that would otherwise reach the tank wall. On Flight 10 SpaceX flew with tiles deliberately removed, and the ablative layer protected the header feed lines beneath them (Ringwatchers). Felt gap filler went in after that flight showed hot gas seeping between tiles.');
    col.appendChild(lose);
    const nums = el('div', { class: 'panel panel-pad' });
    nums.appendChild(el('div', { class: 'sh-card-h' }, 'Heat shield numbers'));
    const tb = el('tbody');
    [['Tiles, early orbital ships', 'ship.tileCount'], ['Tile test temperature, 2019', 'ship.tileTestTemp'], ['Ablative backup since', 'ship.ablativeSince'], ['V3 attachment', 'ship.tilePinsV3'], ['Metallic tiles', 'ship.metallicTiles']].forEach(([k, f]) => {
      tb.appendChild(el('tr', null, el('th', { scope: 'row' }, k), el('td', { html: SX.factHTML(f) })));
    });
    nums.appendChild(el('table', { class: 'spec-table sh-kv' }, tb));
    nums.appendChild(el('p', { class: 'sh-note', style: { marginTop: '10px' } }, 'The 18,000 figure dates from 2021 and its usual citation says only "thousands". SpaceX has not published the V3 tile count, tile size or composition.'));
    row.appendChild(col);

    const fig = el('div', { class: 'sh-fig' });
    const frame = el('figure', { class: 'viz viz-grid', style: { margin: 0 } });
    frame.appendChild(el('div', { class: 'sh-titlebar' }, el('span', null, 'Detail C ', el('b', null, 'Tile field, windward side')), el('span', null, 'Section D, through two tiles')));
    const grid = el('div', { class: 'hs-grid' });
    const field = buildTileField();
    const section = buildTileSection();
    grid.appendChild(el('div', null, field.root));
    grid.appendChild(el('div', null, section.root));
    frame.appendChild(grid);
    frame.appendChild(el('figcaption', { class: 'sh-legend sh-note' }, 'Schematic: tile size, thickness and pin layout are not published. Layer thicknesses are exaggerated.'));
    fig.appendChild(frame);
    wire(field.root); wire(section.root);

    const ctr = el('div', { class: 'panel sh-controls' });
    const out = el('output', { for: 'sh-peel', 'aria-live': 'polite' }, 'Tiles intact');
    out.style.minWidth = '12ch';
    const range = el('input', { type: 'range', id: 'sh-peel', min: '0', max: '100', value: '0', step: '1', 'aria-label': 'Peel the heat shield back, layer by layer' });
    ctr.appendChild(el('div', { class: 'range-row' }, el('label', { for: 'sh-peel' }, 'Peel'), range, out));
    const bLose = el('button', { type: 'button', class: 'btn btn-sm', 'aria-pressed': 'false' }, 'Lose a tile');
    const bGap = el('button', { type: 'button', class: 'btn btn-sm', 'aria-pressed': 'false' }, 'Show gas paths');
    const bSteps = el('div', { class: 'seg', role: 'group', 'aria-label': 'Jump to a layer' });
    [['Tile', 0], ['Felt', 55], ['Ablative', 82], ['Steel', 100]].forEach(([n, v]) => {
      const b = el('button', { type: 'button', 'aria-pressed': v === 0 ? 'true' : 'false' }, n);
      b.addEventListener('click', () => setPeel(v / 100, true));
      bSteps.appendChild(b);
    });
    ctr.appendChild(el('div', { class: 'row' }, bSteps, bLose, bGap));
    fig.appendChild(ctr);
    fig.appendChild(nums);
    row.appendChild(fig);

    let anim = null;
    function render() {
      field.update(); section.update();
      const st = PEEL_STAGES.find(([t]) => HS.peel < t) || PEEL_STAGES[PEEL_STAGES.length - 1];
      out.textContent = st[1];
      range.value = String(Math.round(HS.peel * 100));
      const marks = [0, 0.55, 0.82, 1];
      bSteps.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(Math.abs(HS.peel - marks[i]) < 0.04)));
    }
    function setPeel(v, animate) {
      v = SX.clamp(v, 0, 1);
      if (!animate || RM) { HS.peel = v; render(); return; }
      const from = HS.peel, t0 = performance.now(), dur = 700;
      if (anim) cancelAnimationFrame(anim);
      const step = (now) => {
        const k = SX.ease(SX.clamp((now - t0) / dur, 0, 1));
        HS.peel = from + (v - from) * k; render();
        if (k < 1) anim = requestAnimationFrame(step); else anim = null;
      };
      anim = requestAnimationFrame(step);
    }
    range.addEventListener('input', () => { HS.peel = Number(range.value) / 100; render(); });
    bLose.addEventListener('click', () => {
      HS.lost = !HS.lost; bLose.setAttribute('aria-pressed', String(HS.lost)); bLose.textContent = HS.lost ? 'Restore the tile' : 'Lose a tile';
      render();
    });
    bGap.addEventListener('click', () => { HS.paths = !HS.paths; bGap.setAttribute('aria-pressed', String(HS.paths)); render(); });
    render();
    HS.api = { setPeel, frame, render };
    host.appendChild(sec);
    return sec;
  }

  /* ================================================================== 3a. reentry, flip and landing
     A compressed, scrubbable replay of the planned Flight 14 descent. The clock shows SpaceX's planned times; the
     picture is schematic: SpaceX has not published angles of attack, flap angles, or how long the flip takes. */

  const RE = { u: 0, playing: false, api: null, narrow: false };

  function reKeys() {
    const V = (k) => SX.val(k, null);
    return [
      { u: 0.00, t: TL('entry'), key: 'entry', part: 'flight.entry', name: 'Entry interface', desc: 'Belly first into the upper atmosphere' },
      { u: 0.17, t: TL('peakHeat'), key: 'peakHeat', part: ID.hs, name: 'Peak heating', desc: 'Time is an estimate; not published' },
      { u: 0.35, t: TL('transonic'), key: 'transonic', part: 'flight.entry', name: 'Transonic', desc: 'Slowing through the speed of sound' },
      { u: 0.41, t: V('ship.f14.subsonicT'), key: 'subsonic', part: ID.fwd, name: 'Subsonic belly flop', desc: 'Falling flat; the flaps hold the attitude' },
      { u: 0.56, t: TL('landingBurn'), key: 'landingBurn', part: ID.sl, name: 'Landing burn start', desc: 'Three sea-level Raptors relight on header propellant' },
      { u: 0.62, t: TL('flip'), key: 'flip', part: 'flight.flip', name: 'Flip', desc: 'Gimbaled engines swing the tail down' },
      { u: 0.80, t: V('ship.f14.threeToTwoT'), key: 'threeToTwo', part: ID.sl, name: 'Three to two engines', desc: 'Thrust trimmed as the ship slows' },
      { u: 0.92, t: V('ship.f14.twoToOneT'), key: 'twoToOne', part: ID.sl, name: 'Two to one engine', desc: 'One engine for the last seconds' },
      { u: 1.00, t: TL('splashdown'), key: 'splashdown', part: 'flight.landing', name: 'Touchdown', desc: 'Splashdown so far; tower catch planned' },
    ];
  }

  const RP = { P0: [58, 60], C1: [330, 70], C2: [634, 146], P1: [640, 250], P2: [644, 332], P3: [655, 376], L: 44, sea: 400 };
  function bez(a, b, c, d, s) {
    const m = 1 - s;
    return [m * m * m * a[0] + 3 * m * m * s * b[0] + 3 * m * s * s * c[0] + s * s * s * d[0], m * m * m * a[1] + 3 * m * m * s * b[1] + 3 * m * s * s * c[1] + s * s * s * d[1]];
  }
  function bezD(a, b, c, d, s) {
    const m = 1 - s;
    return [3 * m * m * (b[0] - a[0]) + 6 * m * s * (c[0] - b[0]) + 3 * s * s * (d[0] - c[0]), 3 * m * m * (b[1] - a[1]) + 6 * m * s * (c[1] - b[1]) + 3 * s * s * (d[1] - c[1])];
  }
  const lerp2 = (a, b, t) => [SX.lerp(a[0], b[0], t), SX.lerp(a[1], b[1], t)];
  function rePos(u) {
    if (u <= 0.41) { const s0 = u / 0.41; return bez(RP.P0, RP.C1, RP.C2, RP.P1, 1 - Math.pow(1 - s0, 1.5)); }
    if (u <= 0.56) return lerp2(RP.P1, RP.P2, (u - 0.41) / 0.15);
    const v = (u - 0.56) / 0.44;
    return lerp2(RP.P2, RP.P3, 1 - (1 - v) * (1 - v));
  }
  /** Rotation of the ship sprite in degrees (0 = nose pointing right, negative = nose up). */
  function reAtt(u) {
    if (u <= 0.41) {
      const s0 = u / 0.41, s = 1 - Math.pow(1 - s0, 1.5);
      const d = bezD(RP.P0, RP.C1, RP.C2, RP.P1, s);
      const vAng = Math.atan2(d[1], d[0]) * 180 / Math.PI;
      const aoa = SX.lerp(60, 90, SX.smooth(s0));   // illustrative: SpaceX has not published entry angles
      return vAng - aoa;
    }
    const endWide = (function () { const d = bezD(RP.P0, RP.C1, RP.C2, RP.P1, 1); return Math.atan2(d[1], d[0]) * 180 / Math.PI - 90; })();
    if (u <= 0.60) {
      const k = (u - 0.41) / 0.19;
      return SX.lerp(endWide, 0, k) + 1.6 * Math.sin((u - 0.41) * 140) * (1 - k);
    }
    if (u <= 0.74) return -90 * SX.smooth((u - 0.60) / 0.14);
    return -90;
  }
  const reHeat = (u) => (u < 0 || u > 0.35 ? 0 : u < 0.17 ? SX.smooth(u / 0.17) : 1 - SX.smooth((u - 0.17) / 0.18));
  const reLit = (u) => (u < 0.56 ? 0 : u < 0.80 ? 3 : u < 0.92 ? 2 : u < 0.995 ? 1 : 0);
  /** Illustrative flap extension (0 folded against the leeward side, 1 straight out). */
  function reFlaps(u) {
    if (u < 0.41) return { fwd: 0.45 + 0.05 * Math.sin(u * 60), aft: 0.62 + 0.04 * Math.sin(u * 47 + 1) };
    if (u < 0.60) return { fwd: 0.5 + 0.12 * Math.sin(u * 110), aft: 0.6 + 0.1 * Math.sin(u * 90 + 2) };
    if (u < 0.74) { const k = SX.smooth((u - 0.60) / 0.14); return { fwd: SX.lerp(0.5, 0.1, k), aft: SX.lerp(0.6, 0.1, k) }; }
    return { fwd: 0.1, aft: 0.1 };
  }
  function reTime(u, K) {
    for (let i = 0; i < K.length - 1; i++) {
      const a = K[i], b = K[i + 1];
      if (u <= b.u) return SX.lerp(a.t, b.t, (u - a.u) / (b.u - a.u));
    }
    return K[K.length - 1].t;
  }

  /** Tiny end-view of one flap pair: circle (tiles on the lower half), two flaps swung by extension e. */
  function flapIcon(parent, cx, cy, label, hingeFromTop) {
    const g = add(parent, 'g', {});
    add(g, 'circle', { cx, cy, r: 13, style: 'fill:var(--steel-2);fill-opacity:0.35;stroke:var(--steel-2);stroke-width:0.8' });
    add(g, 'path', { d: 'M' + (cx - 13) + ',' + cy + 'A13,13 0 0 0 ' + (cx + 13) + ',' + cy + 'Z', style: 'fill:var(--tile);stroke:var(--sh-k3);stroke-width:0.6' });
    const a0 = hingeFromTop * Math.PI / 180;
    const hinges = [-1, 1].map((s) => [cx + s * 13 * Math.sin(a0), cy - 13 * Math.cos(a0), s]);
    const flaps = hinges.map(() => add(g, 'path', { style: 'stroke:var(--fg);stroke-width:2.6;stroke-linecap:round;fill:none' }));
    txt(g, cx, cy + 27, label, 'lbl-sub ev-lbl', { 'text-anchor': 'middle' });
    return function set(e) {
      hinges.forEach(([hx, hy, s], i) => {
        // e = 1: straight out sideways; e = 0: folded up against the leeward side
        const ang = SX.lerp(-80, 0, SX.clamp(e, 0, 1)) * Math.PI / 180;
        const len = 11;
        const dx = s * Math.cos(ang) * len, dy = Math.sin(ang) * len;
        flaps[i].setAttribute('d', 'M' + fx(hx) + ',' + fx(hy) + 'L' + fx(hx + dx) + ',' + fx(hy + dy));
      });
    };
  }
  /** Tiny bottom view of the six engines; returns set(nLitSL). */
  function engineIcon(parent, cx, cy) {
    const g = add(parent, 'g', {});
    add(g, 'circle', { cx, cy, r: 17, style: 'fill:none;stroke:var(--steel-2);stroke-width:0.8' });
    const sl = [], vac = [];
    for (let k = 0; k < 3; k++) {
      const a = (-90 + 120 * k) * Math.PI / 180, b = (30 + 120 * k) * Math.PI / 180;
      sl.push(add(g, 'circle', { cx: fx(cx + 4.4 * Math.cos(a)), cy: fx(cy + 4.4 * Math.sin(a)), r: 3.1, style: 'fill:var(--bg-4);stroke:var(--steel);stroke-width:0.7' }));
      vac.push(add(g, 'circle', { cx: fx(cx + 11.2 * Math.cos(b)), cy: fx(cy + 11.2 * Math.sin(b)), r: 5.2, style: 'fill:var(--bg-4);stroke:var(--steel-2);stroke-width:0.7' }));
    }
    return function set(n) { sl.forEach((c, i) => { c.style.fill = i < n ? 'var(--plume)' : 'var(--bg-4)'; }); };
  }

  function buildReentry() {
    const W = 800, H = 440;
    const root = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Animated diagram of Starship reentering belly first, flipping and landing' });
    const defs = add(root, 'defs', {});
    const sky = add(defs, 'linearGradient', { id: 're-sky', x1: '0', x2: '0', y1: '0', y2: '1' });
    add(sky, 'stop', { offset: '0', class: 'sky-a' });
    add(sky, 'stop', { offset: '1', class: 'sky-b' });
    const blur = add(defs, 'filter', { id: 're-blur', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    add(blur, 'feGaussianBlur', { stdDeviation: '2.6' });
    const plume = add(defs, 'linearGradient', { id: 're-plume', x1: '1', x2: '0', y1: '0', y2: '0' });
    add(plume, 'stop', { offset: '0', class: 'plume-a', style: 'stop-opacity:0.95' });
    add(plume, 'stop', { offset: '1', class: 'plume-b', style: 'stop-opacity:0' });
    const heat = add(defs, 'radialGradient', { id: 're-heat' });
    add(heat, 'stop', { offset: '0', class: 'heat-a', style: 'stop-opacity:0.9' });
    add(heat, 'stop', { offset: '1', class: 'heat-b', style: 'stop-opacity:0' });

    add(root, 'rect', { width: W, height: H, style: 'fill:url(#re-sky)' });
    const rand = rng(21);
    const stars = add(root, 'g', { 'aria-hidden': 'true' });
    for (let i = 0; i < 46; i++) add(stars, 'circle', { cx: fx(rand() * W), cy: fx(rand() * 190), r: fx(0.4 + rand() * 0.7), style: 'fill:var(--fg-2);opacity:' + fx(0.15 + rand() * 0.35) });

    const cam = add(root, 'g', {});
    // atmosphere bands (schematic)
    add(cam, 'rect', { x: -400, y: RP.sea, width: W + 800, height: 400, class: 'sea' });
    for (let x = -400; x < W + 400; x += 26) add(cam, 'path', { d: 'M' + x + ',' + (RP.sea + 7) + 'q6.5,-3 13,0t13,0', style: 'stroke:var(--sh-wave);stroke-width:0.8;fill:none' });
    // the future: a tower catch instead of a splashdown
    const tower = add(cam, 'g', { style: 'opacity:0.55' });
    add(tower, 'path', { d: 'M700,' + RP.sea + 'L700,318L712,318L712,' + RP.sea + 'M700,338L684,338M700,352L684,352', style: 'stroke:var(--steel-2);stroke-width:1;stroke-dasharray:3 2;fill:none', 'vector-effect': 'non-scaling-stroke' });
    const towerLab = txt(tower, 716, 330, 'TOWER CATCH', 'lbl-sub');
    const towerLab2 = txt(tower, 716, 340, '(PLANNED)', 'lbl-sub');
    // trajectory
    const tpts = [];
    for (let i = 0; i <= 120; i++) tpts.push(rePos(i / 120));
    add(cam, 'path', { class: 'traj', 'vector-effect': 'non-scaling-stroke', d: 'M' + tpts.map((p) => fx(p[0]) + ',' + fx(p[1])).join('L') });
    const done = add(cam, 'path', { class: 'traj-done', 'vector-effect': 'non-scaling-stroke', d: '' });
    // event ticks for the high-altitude part
    const K = reKeys();
    const ticks = add(cam, 'g', {});
    K.filter((k) => k.u <= 0.41).forEach((k, i) => {
      const p = rePos(k.u);
      add(ticks, 'circle', { cx: fx(p[0]), cy: fx(p[1]), r: 2.4, style: 'fill:var(--bg);stroke:var(--fg-2);stroke-width:1' });
      const below = i % 2 === 1;
      const lx = i === 0 ? p[0] + 4 : i === 3 ? p[0] - 8 : p[0] + 6, ly = i === 0 ? p[1] + 22 : p[1] + (below ? 16 : -8);
      txt(ticks, lx, ly, U(k.name), 'lbl-sub re-tick', { 'text-anchor': i === 3 ? 'end' : 'start', style: 'fill:var(--fg-2)' });
    });

    // plasma trail while heating is high
    const trail = add(cam, 'path', { 'vector-effect': 'non-scaling-stroke', style: 'fill:none;stroke:var(--warn);stroke-width:3;stroke-linecap:round;opacity:0' });
    // the ship sprite (local coords: nose to +x, belly to +y), origin at mid-length
    const ship = add(cam, 'g', {});
    const L = RP.L, hw = L * (SX.val('ship.diameter', 9) / SX.val('ship.height', 52)) / 2;
    const glow = add(ship, 'ellipse', { cx: 1, cy: hw + 1.5, rx: L * 0.62, ry: 7, style: 'fill:url(#re-heat)', filter: 'url(#re-blur)' });
    const plumeG = add(ship, 'g', {});
    const plumes = [-1.9, 0, 1.9].map((y) => add(plumeG, 'path', { d: 'M' + fx(-L / 2 - 2) + ',' + fx(y - 1.3) + 'L' + fx(-L / 2 - 30) + ',' + fx(y * 2.2) + 'L' + fx(-L / 2 - 2) + ',' + fx(y + 1.3) + 'Z', style: 'fill:url(#re-plume)' }));
    const noseX = L / 2 - L * (SX.val('ship.noseconeHeight', 14) / SX.val('ship.height', 52));
    const noseTop = [], noseBot = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16, rr = hw * Math.pow(Math.max(0, 1 - Math.pow(t, 2.2)), 0.58);
      noseTop.push([noseX + (L / 2 - noseX) * t, -rr]); noseBot.push([noseX + (L / 2 - noseX) * t, rr]);
    }
    const bodyTop = 'M' + fx(-L / 2) + ',' + fx(-hw) + noseTop.map(([x, y]) => 'L' + fx(x) + ',' + fx(y)).join('') + 'L' + fx(L / 2) + ',0L' + fx(-L / 2) + ',0Z';
    const bodyBot = 'M' + fx(-L / 2) + ',0L' + fx(L / 2) + ',0' + noseBot.slice().reverse().map(([x, y]) => 'L' + fx(x) + ',' + fx(y)).join('') + 'L' + fx(-L / 2) + ',' + fx(hw) + 'Z';
    add(ship, 'path', { d: bodyTop, style: 'fill:var(--sh-k8);stroke:var(--steel);stroke-width:0.4' });
    add(ship, 'path', { d: bodyBot, style: 'fill:var(--tile);stroke:var(--sh-k4);stroke-width:0.4' });
    // flap stubs, drawn in side view as short dark fins at the hinge line
    add(ship, 'path', { d: 'M' + fx(-L / 2 + 0.6) + ',' + fx(0.4) + 'L' + fx(-L / 2 + 9.4) + ',' + fx(0.4) + 'L' + fx(-L / 2 + 7.2) + ',' + fx(-2.2) + 'L' + fx(-L / 2 + 1.4) + ',' + fx(-2.2) + 'Z', style: 'fill:var(--sh-k3);stroke:var(--steel-2);stroke-width:0.3' });
    add(ship, 'path', { d: 'M' + fx(noseX + 1.2) + ',' + fx(0.2) + 'L' + fx(noseX + 6.2) + ',' + fx(-0.6) + 'L' + fx(noseX + 4.2) + ',' + fx(-2.4) + 'L' + fx(noseX + 1.6) + ',' + fx(-2.2) + 'Z', style: 'fill:var(--sh-k3);stroke:var(--steel-2);stroke-width:0.3' });
    for (let k = -1; k <= 1; k++) add(ship, 'path', { d: 'M' + fx(-L / 2) + ',' + fx(k * 1.9 - 0.9) + 'L' + fx(-L / 2 - 1.8) + ',' + fx(k * 1.9 - 1.2) + 'L' + fx(-L / 2 - 1.8) + ',' + fx(k * 1.9 + 1.2) + 'L' + fx(-L / 2) + ',' + fx(k * 1.9 + 0.9) + 'Z', style: 'fill:var(--sh-k2);stroke:var(--steel-2);stroke-width:0.3' });
    // velocity cue
    const vel = add(cam, 'g', { style: 'opacity:0.8' });
    const velPath = add(vel, 'path', { class: 'flow' });
    const velHead = add(vel, 'path', { style: 'fill:var(--muted)' });

    function update(u) {
      const p = rePos(u), phi = reAtt(u);
      // camera: wide for the high-speed part, then close on the ship for the flip and landing
      const k = SX.smooth(SX.clamp((u - 0.36) / 0.16, 0, 1));
      const z = SX.lerp(1, 2.35, k);
      const wx = 655, wy = 356, sx = SX.lerp(wx, 520, k), sy = SX.lerp(wy, 332, k);
      cam.setAttribute('transform', 'translate(' + fx(sx) + ',' + fx(sy) + ') scale(' + fx(z) + ') translate(' + fx(-wx) + ',' + fx(-wy) + ')');
      ticks.style.opacity = String(fx(Math.max(0, 1 - k * 2.5)));
      ticks.style.display = k > 0.4 ? 'none' : '';
      tower.style.opacity = String(fx(0.1 + 0.55 * k));
      towerLab.style.display = towerLab2.style.display = k > 0.5 ? '' : 'none';
      towerLab.style.fontSize = towerLab2.style.fontSize = fx((RE.narrow ? 16 : 9.5) / z) + 'px';
      const sc = RE.narrow ? SX.lerp(1.6, 1.15, k) : 1;
      ship.setAttribute('transform', 'translate(' + fx(p[0]) + ',' + fx(p[1]) + ') rotate(' + fx(phi) + ') scale(' + fx(sc) + ')');
      const hh = reHeat(u);
      glow.style.opacity = String(fx(hh));
      const tp = [];
      for (let i = 0; i <= 12; i++) tp.push(rePos(Math.max(0, u - 0.05 + (0.05 * i) / 12)));
      trail.setAttribute('d', 'M' + tp.map((q) => fx(q[0]) + ',' + fx(q[1])).join('L'));
      trail.style.opacity = String(fx(hh * 0.45));
      const n = reLit(u);
      plumes.forEach((pl, i) => { pl.style.display = (n === 3 || (n === 2 && i !== 1) || (n === 1 && i === 1)) ? '' : 'none'; });
      plumeG.style.opacity = n ? '1' : '0';
      const dpts = [];
      for (let i = 0; i <= 80; i++) dpts.push(rePos((u * i) / 80));
      done.setAttribute('d', 'M' + dpts.map((q) => fx(q[0]) + ',' + fx(q[1])).join('L'));
      // velocity arrow ahead of the ship (direction of travel)
      const q = rePos(Math.min(1, u + 0.004)), dx = q[0] - p[0], dy = q[1] - p[1], m = Math.hypot(dx, dy);
      if (m > 1e-4 && u < 0.99) {
        const ux = dx / m, uy = dy / m, len = SX.lerp(46, 20, k) / z * (u > 0.56 ? 0.6 : 1), off = 32 / z;
        const ax = p[0] + ux * off, ay = p[1] + uy * off;
        velPath.setAttribute('d', 'M' + fx(ax) + ',' + fx(ay) + 'L' + fx(ax + ux * len) + ',' + fx(ay + uy * len));
        const hx = ax + ux * (len + 5 / z), hy = ay + uy * (len + 5 / z), a = Math.atan2(uy, ux);
        velHead.setAttribute('d', 'M' + fx(hx) + ',' + fx(hy) + 'L' + fx(hx - 6 / z * Math.cos(a - 0.45)) + ',' + fx(hy - 6 / z * Math.sin(a - 0.45)) + 'L' + fx(hx - 6 / z * Math.cos(a + 0.45)) + ',' + fx(hy - 6 / z * Math.sin(a + 0.45)) + 'Z');
        velPath.style.strokeWidth = fx(1.2 / z);
        vel.style.display = '';
      } else vel.style.display = 'none';
    }
    return { root, update, K };
  }

  function sectionReentry(host) {
    const sec = el('section', { class: 'sh-sec', 'aria-labelledby': 'sh-h-re' });
    sec.appendChild(el('div', { class: 'sh-sec-head' },
      el('span', { class: 'eyebrow' }, '3.3'), el('h3', { class: 'h3', id: 'sh-h-re' }, 'Reentry and landing'),
      el('span', { class: 'small muted' }, 'Scrub the last stretch of the planned Flight 14 mission, from entry to touchdown.')));
    const row = el('div', { class: 'sh-row' });
    sec.appendChild(row);

    const scene = buildReentry();
    const K = scene.K;
    const col = el('div', { class: 'sh-col' });
    col.appendChild(el('div', { class: 'prose', html: SX.withFacts(
      '<p>Starship sheds orbital speed by falling belly-first, like a skydiver lying flat. The broad tiled side takes the heat and makes enormous drag, and the four flaps hold the attitude. On the full-length Flight 14 plan the descent from entry interface to touchdown takes about {{ship.f14.entryToLanding}}.</p>' +
      '<p>About 20 seconds before touchdown on the plan, the three sea-level Raptors relight, fed from the header tanks, and the gimbaled engines swing the ship from horizontal to vertical. The burn then steps down from three engines to two to one before the ship stops just above the water.</p>') }));
    const list = el('ol', { class: 're-phases', 'aria-label': 'Descent phases' });
    const phaseBtns = K.map((k) => {
      const b = el('button', { type: 'button', title: k.desc }, el('span', { class: 't' }, clock(k.t)), el('span', null, k.name));
      b.addEventListener('click', () => { stop(); setU(k.u, true); });
      list.appendChild(el('li', null, b));
      return b;
    });
    col.appendChild(el('div', { class: 'panel panel-pad' }, el('div', { class: 'sh-card-h' }, 'Planned Flight 14 descent'), list));
    const actual = el('p', { class: 'sh-note', html: 'What actually happened on Flight 14: after a Raptor Vacuum shut down on ascent, SpaceX brought the ship home early. It splashed down north of Hawaii at ' + SX.esc(clock(SX.val('flight.f14Splashdown', null))) + ' (' + SX.factHTML('flight.f14Splashdown') + '), with all three sea-level engines relit for the flip. On Flight 12 the ship landed on two engines; Ship 40 on Flight 13 was the first to float intact afterward.' });
    col.appendChild(actual);
    row.appendChild(col);

    const fig = el('div', { class: 'sh-fig' });
    const frame = el('figure', { class: 'viz', style: { margin: 0 } });
    frame.appendChild(el('div', { class: 'sh-titlebar' }, el('span', null, 'Sequence E ', el('b', null, 'Entry to touchdown')), el('span', null, 'Schematic, timeline compressed')));
    frame.appendChild(scene.root);
    // readouts
    const ro = el('dl', { class: 'lab-read', style: { margin: '0', borderRadius: '0', borderLeft: '0', borderRight: '0', borderBottom: '0', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' } });
    const clockDD = el('dd', { class: 'num' }, 'T+');
    const phaseDD = el('dd', null, '');
    const phaseDesc = el('p', { class: 'sh-note', style: { marginTop: '4px' } }, '');
    const engDD = el('dd', { style: { display: 'flex', alignItems: 'center', gap: '10px' } });
    const flapDD = el('dd', { style: { display: 'flex', alignItems: 'center', gap: '6px' } });
    const engSvg = svg('svg', { viewBox: '0 0 40 40', width: 40, height: 40, class: 're-icon', 'aria-hidden': 'true' });
    const setEng = engineIcon(engSvg, 20, 20);
    const engTxt = el('span', { style: { font: '500 12px/1.2 var(--font-mono)', textTransform: 'none' } }, '');
    engDD.appendChild(engSvg); engDD.appendChild(engTxt);
    const flapSvg = svg('svg', { viewBox: '0 0 100 48', width: 104, height: 50, class: 're-flaps', 'aria-hidden': 'true' });
    const setFwd = flapIcon(flapSvg, 24, 17, 'FWD', 70);
    const setAft = flapIcon(flapSvg, 74, 17, 'AFT', 90);
    flapDD.appendChild(flapSvg);
    [['Mission clock', clockDD], ['Phase', phaseDD], ['Engines lit', engDD], ['Flaps, end view (illustrative)', flapDD]].forEach(([k, dd]) => ro.appendChild(el('div', null, el('dt', null, k), dd, dd === phaseDD ? phaseDesc : null)));
    frame.appendChild(ro);
    fig.appendChild(frame);

    const ctr = el('div', { class: 'panel sh-controls' });
    const play = el('button', { type: 'button', class: 'btn btn-sm btn-primary', 'aria-label': 'Play the descent' }, RM ? 'Next step' : 'Play');
    const range = el('input', { type: 'range', min: '0', max: '1000', value: '0', step: '1', 'aria-label': 'Scrub through the descent' });
    const clk = el('output', { class: 're-clock' }, '');
    ctr.appendChild(el('div', { class: 're-scrub' }, play, range, clk));
    ctr.appendChild(el('p', { class: 'sh-note' }, 'The clock follows SpaceX\'s planned Flight 14 times. SpaceX has not published the entry angle of attack, the flap angles or how long the flip itself takes; those are drawn to show the physics, not measured.'));
    fig.appendChild(ctr);
    row.appendChild(fig);

    let cur = -1;
    function render() {
      const u = RE.u;
      scene.update(u);
      const t = reTime(u, K);
      clockDD.textContent = clock(t);
      clk.textContent = clock(t);
      let idx = 0;
      K.forEach((k, i) => { if (u >= k.u - 1e-6) idx = i; });
      if (idx !== cur) {
        cur = idx;
        phaseDD.textContent = K[idx].name;
        phaseDesc.textContent = K[idx].desc;
        phaseBtns.forEach((b, i) => b.setAttribute('aria-current', String(i === idx)));
      }
      const n = reLit(u);
      setEng(n);
      engTxt.textContent = n ? n + ' sea-level' : u >= 0.995 ? 'Shut down' : 'None';
      const f = reFlaps(u);
      setFwd(f.fwd); setAft(f.aft);
      range.value = String(Math.round(u * 1000));
      range.setAttribute('aria-valuetext', clock(t) + ', ' + K[idx].name);
    }
    let tween = null;
    function setU(u, animate) {
      u = SX.clamp(u, 0, 1);
      if (!animate || RM) { RE.u = u; render(); return; }
      const from = RE.u, t0 = performance.now(), dur = 600;
      if (tween) cancelAnimationFrame(tween);
      const step = (now) => {
        const k = SX.ease(SX.clamp((now - t0) / dur, 0, 1));
        RE.u = from + (u - from) * k; render();
        tween = k < 1 ? requestAnimationFrame(step) : null;
      };
      tween = requestAnimationFrame(step);
    }
    function stop() { RE.playing = false; play.textContent = RM ? 'Next step' : 'Play'; play.setAttribute('aria-label', 'Play the descent'); }
    play.addEventListener('click', () => {
      if (RM) { const nx = K.find((k) => k.u > RE.u + 1e-3); setU(nx ? nx.u : 0, false); return; }
      if (RE.playing) { stop(); return; }
      if (RE.u >= 0.999) RE.u = 0;
      RE.playing = true; play.textContent = 'Pause'; play.setAttribute('aria-label', 'Pause the descent');
    });
    range.addEventListener('input', () => { stop(); RE.u = Number(range.value) / 1000; render(); });
    SX.loop(frame, (dt) => {
      if (!RE.playing) return;
      // slow through the flip and landing so they are readable
      const rate = RE.u < 0.5 ? 1 / 9 : 1 / 16;
      RE.u = Math.min(1, RE.u + dt * rate);
      render();
      if (RE.u >= 1) stop();
    });
    watchNarrow(frame, scene.root, 560, (n) => { RE.narrow = n; render(); });
    render();
    RE.api = { setU, frame, render };
    host.appendChild(sec);
    return sec;
  }

  /* ================================================================== 3b. flap lab: how four flaps trim a falling ship
     Qualitative: a toy moment balance about an illustrative center of mass. Flap areas, arm lengths and the real
     center of mass are not published; the relative sizes are chosen only to show the mechanism. */

  const FL = { fwd: 0.4, aft: 0.72 };
  const FLM = { sCG: 0.36, sCP: 0.5, sF: 0.835, sA: 0.12, body: 2.0, kF: 1.0, kA: 2.7 };
  function flapMoment(ef, ea) {
    const dF = FLM.kF * ef, dA = FLM.kA * ea;
    const m = dF * (FLM.sF - FLM.sCG) + FLM.body * (FLM.sCP - FLM.sCG) - dA * (FLM.sCG - FLM.sA);
    return { dF, dA, dB: FLM.body, m };
  }

  function buildFlapLab() {
    const W = 640, H = 364, X0 = 110, X1 = 530, CY = 200;
    const Ls = X1 - X0, hw = Ls * (SX.val('ship.diameter', 9) / SX.val('ship.height', 52)) / 2;
    const root = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': 'Flap lab: a falling ship seen from the side, with drag arrows at each flap pair and the resulting pitch moment' });
    const sx = (s) => X0 + s * Ls;
    // relative wind from below
    const flow = add(root, 'g', { 'aria-hidden': 'true' });
    for (let x = 70; x <= 590; x += 40) {
      add(flow, 'path', { class: 'flow', d: 'M' + x + ',' + (H - 30) + 'L' + x + ',' + (CY + hw + 62) });
      arrowHead(flow, x, CY + hw + 58, -Math.PI / 2, 5, 'ldr-dot');
    }
    txt(root, 16, H - 12, 'AIRFLOW RELATIVE TO THE SHIP: IT IS FALLING BELLY FIRST', 'lbl-sub');
    txt(root, 16, 22, 'SIDE VIEW, NOSE RIGHT', 'lbl-title');

    const tilt = add(root, 'g', {});
    const shipG = add(tilt, 'g', {});
    const noseX = X1 - Ls * (SX.val('ship.noseconeHeight', 14) / SX.val('ship.height', 52));
    const topPts = [], botPts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20, rr = hw * Math.pow(Math.max(0, 1 - Math.pow(t, 2.2)), 0.58);
      topPts.push([noseX + (X1 - noseX) * t, CY - rr]); botPts.push([noseX + (X1 - noseX) * t, CY + rr]);
    }
    const hullTop = 'M' + X0 + ',' + fx(CY - hw) + topPts.map(([x, y]) => 'L' + fx(x) + ',' + fx(y)).join('') + 'L' + X1 + ',' + CY + 'L' + X0 + ',' + CY + 'Z';
    const hullBot = 'M' + X0 + ',' + CY + 'L' + X1 + ',' + CY + botPts.slice().reverse().map(([x, y]) => 'L' + fx(x) + ',' + fx(y)).join('') + 'L' + X0 + ',' + fx(CY + hw) + 'Z';
    const hullP = partG(shipG, ID.hs, {}, 'Belly: the tiled windward side facing the flow');
    add(hullP, 'path', { d: hullTop, style: 'fill:var(--steel-2);stroke:var(--steel);stroke-width:0.8' });
    add(hullP, 'path', { class: 'hl', d: hullBot, style: 'fill:var(--tile);stroke:var(--sh-k4);stroke-width:0.8' });
    for (let k = -1; k <= 1; k++) add(shipG, 'path', { d: 'M' + X0 + ',' + fx(CY + k * 9 - 4) + 'L' + (X0 - 9) + ',' + fx(CY + k * 9 - 6) + 'L' + (X0 - 9) + ',' + fx(CY + k * 9 + 6) + 'L' + X0 + ',' + fx(CY + k * 9 + 4) + 'Z', style: 'fill:var(--sh-k2);stroke:var(--steel-2);stroke-width:0.6' });
    // flaps: drawn hanging into the flow from the hinge line; depth = area facing the airflow (schematic)
    const fA = partG(shipG, ID.aft, {}, 'Aft flaps');
    const fF = partG(shipG, ID.fwd, {}, 'Forward flaps');
    const aftPath = add(fA, 'path', { class: 'hl', style: 'fill:var(--sh-k3);stroke:var(--steel);stroke-width:1' });
    const fwdPath = add(fF, 'path', { class: 'hl', style: 'fill:var(--sh-k3);stroke:var(--steel);stroke-width:1' });
    txt(root, sx(0.125), CY + hw + 50, 'FLAPS DRAWN BY THE AREA THEY SHOW THE FLOW', 'lbl-sub', { 'text-anchor': 'start' });
    // center of mass and center of pressure markers
    const cg = add(shipG, 'g', { class: 'cg' });
    const cgx = sx(FLM.sCG);
    add(cg, 'circle', { cx: fx(cgx), cy: CY, r: 7 });
    add(cg, 'path', { d: 'M' + fx(cgx) + ',' + (CY - 7) + 'A7,7 0 0 1 ' + fx(cgx + 7) + ',' + CY + 'L' + fx(cgx) + ',' + CY + 'Z M' + fx(cgx) + ',' + (CY + 7) + 'A7,7 0 0 1 ' + fx(cgx - 7) + ',' + CY + 'L' + fx(cgx) + ',' + CY + 'Z' });
    // forces
    const forces = add(root, 'g', {});
    const mk = (cls) => ({ line: add(forces, 'path', { class: cls }), head: add(forces, 'path', { class: cls + '-h' }) });
    const fwdArrow = mk('force-drag'), aftArrow = mk('force-drag'), bodyArrow = mk('force-body');
    const moment = add(root, 'path', { class: 'moment' });
    const momentHead = add(root, 'path', { class: 'moment-h' });
    const lab = add(root, 'g', {});
    add(root, 'path', { class: 'ldr', d: 'M' + fx(cgx) + ',' + fx(CY + 8) + 'L' + fx(cgx) + ',' + fx(CY + hw + 24) + 'L' + fx(cgx + 6) + ',' + fx(CY + hw + 24) });
    const lCG = txt(root, cgx + 9, CY + hw + 28, 'CENTER OF MASS (ILLUSTRATIVE)', 'lbl-sub', { 'text-anchor': 'start', style: 'fill:var(--fg-2)' });
    const lF = txt(lab, sx(FLM.sF), 0, 'FORWARD FLAP DRAG', 'lbl-sub', { 'text-anchor': 'middle', style: 'fill:var(--fg)' });
    const lA = txt(lab, sx(FLM.sA), 0, 'AFT FLAP DRAG', 'lbl-sub', { 'text-anchor': 'middle', style: 'fill:var(--fg)' });
    const lB = txt(lab, sx(FLM.sCP), 0, 'BELLY DRAG', 'lbl-sub', { 'text-anchor': 'middle' });
    const lM = txt(root, 16, 44, '', 'lbl', { 'text-anchor': 'start' });
    void lCG;
    // end views of the two flap pairs (accurate angles for the slider values)
    const endViews = add(root, 'g', {});
    add(endViews, 'rect', { x: W - 150, y: 8, width: 142, height: 74, rx: 4, style: 'fill:var(--bg);fill-opacity:0.7;stroke:var(--line-2)' });
    const setA = flapIcon(endViews, W - 110, 34, 'AFT', 90);
    const setF = flapIcon(endViews, W - 46, 34, 'FWD', 70);

    function arrow(a, x, y0, len, lbl) {
      const y1 = y0 - len;
      a.line.setAttribute('d', 'M' + fx(x) + ',' + fx(y0) + 'L' + fx(x) + ',' + fx(y1 + 6));
      a.head.setAttribute('d', 'M' + fx(x) + ',' + fx(y1) + 'L' + fx(x - 5) + ',' + fx(y1 + 8) + 'L' + fx(x + 5) + ',' + fx(y1 + 8) + 'Z');
      if (lbl) lbl.setAttribute('y', fx(y1 - 6));
    }
    function update() {
      const r = flapMoment(FL.fwd, FL.aft);
      const tiltDeg = SX.clamp(-r.m * 14, -9, 9);
      tilt.setAttribute('transform', 'rotate(' + fx(tiltDeg) + ' ' + fx(cgx) + ' ' + CY + ')');
      // flap depth into the flow
      const aD = 3 + 30 * FL.aft, fD = 2.5 + 20 * FL.fwd;
      const a0 = sx(0.02), a1 = sx(0.23), f0 = sx(0.775), f1 = sx(0.895), yb = CY + hw - 1;
      const yf = CY + G.r(G.H * 0.835) / G.R * hw - 1;
      aftPath.setAttribute('d', 'M' + fx(a0) + ',' + fx(yb) + 'L' + fx(a1) + ',' + fx(yb) + 'L' + fx(a1 - 26) + ',' + fx(yb + aD) + 'L' + fx(a0 + 2) + ',' + fx(yb + aD) + 'Z');
      fwdPath.setAttribute('d', 'M' + fx(f0) + ',' + fx(yf + 2) + 'L' + fx(f1) + ',' + fx(yf - 4) + 'L' + fx(f1 - 18) + ',' + fx(yf + fD) + 'L' + fx(f0 + 6) + ',' + fx(yf + fD) + 'Z');
      const rot = (x, y) => {
        const a = tiltDeg * Math.PI / 180, dx = x - cgx, dy = y - CY;
        return [cgx + dx * Math.cos(a) - dy * Math.sin(a), CY + dx * Math.sin(a) + dy * Math.cos(a)];
      };
      const topAt = (s) => {
        // highest point of the hull outline above station s, after tilting
        const x = sx(s), rr = x > noseX ? hw * Math.pow(Math.max(0, 1 - Math.pow((x - noseX) / (X1 - noseX), 2.2)), 0.58) : hw;
        return rot(x, CY - rr - 4);
      };
      const pF = topAt(FLM.sF), pA = topAt(FLM.sA), pB = topAt(FLM.sCP);
      arrow(fwdArrow, pF[0], pF[1], 8 + r.dF * 24, lF);
      arrow(aftArrow, pA[0], pA[1], 8 + r.dA * 24, lA);
      arrow(bodyArrow, pB[0], pB[1], 8 + r.dB * 17, lB);
      lF.setAttribute('x', fx(pF[0])); lA.setAttribute('x', fx(pA[0])); lB.setAttribute('x', fx(pB[0]));
      // moment arc about the center of mass
      const mag = Math.abs(r.m), R = 46, up = r.m > 0;
      const sweep = SX.clamp(mag / 0.6, 0, 1) * 150;
      if (mag < 0.035) {
        moment.setAttribute('d', 'M' + fx(cgx - 16) + ',' + fx(CY - hw - 16) + 'L' + fx(cgx + 16) + ',' + fx(CY - hw - 16) + 'M' + fx(cgx - 16) + ',' + fx(CY - hw - 21) + 'L' + fx(cgx + 16) + ',' + fx(CY - hw - 21));
        momentHead.setAttribute('d', '');
        lM.textContent = 'BALANCED: THE SHIP HOLDS ITS ATTITUDE';
        lM.style.fill = 'var(--fg)';
      } else {
        const c = [cgx, CY], startA = up ? -30 : -150, endA = up ? -30 - sweep * 0.8 - 12 : -150 + sweep * 0.8 + 12;
        const P = (a) => [c[0] + R * Math.cos(a * Math.PI / 180), c[1] + R * Math.sin(a * Math.PI / 180)];
        const s = P(startA), e = P(endA);
        moment.setAttribute('d', 'M' + fx(s[0]) + ',' + fx(s[1]) + 'A' + R + ',' + R + ' 0 0 ' + (up ? 0 : 1) + ' ' + fx(e[0]) + ',' + fx(e[1]));
        const tang = (endA + (up ? -90 : 90)) * Math.PI / 180;
        momentHead.setAttribute('d', 'M' + fx(e[0] + 9 * Math.cos(tang)) + ',' + fx(e[1] + 9 * Math.sin(tang)) + 'L' + fx(e[0] - 6 * Math.cos(tang - Math.PI / 2)) + ',' + fx(e[1] - 6 * Math.sin(tang - Math.PI / 2)) + 'L' + fx(e[0] - 6 * Math.cos(tang + Math.PI / 2)) + ',' + fx(e[1] - 6 * Math.sin(tang + Math.PI / 2)) + 'Z');
        const strong = mag > 0.22 ? 'STRONG ' : '';
        lM.textContent = up ? strong + 'NOSE-UP MOMENT: NOSE RISES, TAIL DROPS' : strong + 'NOSE-DOWN MOMENT: NOSE DROPS';
        lM.style.fill = up ? 'var(--good)' : 'var(--warn)';
      }
      setA(FL.aft); setF(FL.fwd);
      return r;
    }
    return { root, update };
  }

  function sectionFlapLab(sec) {
    sec.appendChild(el('div', { class: 'sh-sec-head', style: { marginTop: 'clamp(40px, 6vw, 64px)' } },
      el('span', { class: 'eyebrow' }, '3.4'), el('h4', { class: 'h3', id: 'sh-h-flap', style: { fontSize: 'clamp(20px, 2vw, 24px)' } }, 'Flap lab'),
      el('span', { class: 'small muted' }, 'Deflect the flaps and watch the pitch moment. Qualitative, not a flight model.')));
    const row = el('div', { class: 'sh-row' });
    sec.appendChild(row);
    const lab = buildFlapLab();

    const col = el('div', { class: 'sh-col' });
    col.appendChild(el('div', { class: 'prose', html: SX.withFacts(
      '<p>Starship has no wings and no tail fin. It steers a falling steel tube {{ship.height}} long with four flaps, the way a skydiver steers with arms and legs. A flap swung straight out into the flow adds drag at its end of the ship; a flap folded in against the leeward side hides from the flow and adds almost none.</p>' +
      '<p>The heavy engines make the tail the heavy end. With the center of mass behind the middle of the belly, air pushing on the belly alone would rotate the ship until it fell tail-first. The large aft flaps stop that by adding drag behind the center of mass; the smaller forward flaps set the balance at the nose. <b>More forward drag lifts the nose. More aft drag lifts the tail.</b> Moving the left and right flaps differently adds roll and yaw.</p>' +
      '<p class="sh-note">The flap areas, lever arms and center of mass here are illustrative. SpaceX has not published flap sizes, entry angles or mass properties.</p>') }));
    const read = el('dl', { class: 'lab-read' });
    const dF = el('dd', { class: 'num' }), dA = el('dd', { class: 'num' }), dM = el('dd');
    [['Forward drag', dF], ['Aft drag', dA], ['Pitch', dM]].forEach(([k, dd]) => read.appendChild(el('div', null, el('dt', null, k), dd)));
    col.appendChild(read);
    row.appendChild(col);

    const fig = el('div', { class: 'sh-fig' });
    const frame = el('figure', { class: 'viz viz-grid', style: { margin: 0 } });
    frame.appendChild(el('div', { class: 'sh-titlebar' }, el('span', null, 'Diagram F ', el('b', null, 'Pitch balance in the belly flop')), el('span', null, 'Qualitative')));
    frame.appendChild(lab.root);
    fig.appendChild(frame);
    wire(lab.root);
    watchNarrow(frame, lab.root, 560);
    const ctr = el('div', { class: 'panel sh-controls' });
    const mkRange = (id, label, key) => {
      const out = el('output', { for: id });
      const r = el('input', { type: 'range', id, min: '0', max: '100', step: '1', value: String(Math.round(FL[key] * 100)), 'aria-label': label + ' extension' });
      r.addEventListener('input', () => { FL[key] = Number(r.value) / 100; render(); });
      ctr.appendChild(el('div', { class: 'range-row' }, el('label', { for: id }, label), r, out));
      return { r, out };
    };
    const rf = mkRange('sh-flap-f', 'Forward flaps', 'fwd');
    const ra = mkRange('sh-flap-a', 'Aft flaps', 'aft');
    const presets = el('div', { class: 'row' });
    [['Trim', 0.4, 0.72], ['Nose up', 1, 0.3], ['Nose down', 0.1, 1], ['All folded', 0, 0]].forEach(([n, f, a]) => {
      const b = el('button', { type: 'button', class: 'btn btn-sm' }, n);
      b.addEventListener('click', () => { FL.fwd = f; FL.aft = a; rf.r.value = String(Math.round(f * 100)); ra.r.value = String(Math.round(a * 100)); render(); });
      presets.appendChild(b);
    });
    ctr.appendChild(presets);
    fig.appendChild(ctr);
    row.appendChild(fig);

    const word = (v) => (v < 0.2 ? 'folded' : v > 0.8 ? 'out' : 'partial');
    function render() {
      const r = lab.update();
      rf.out.textContent = Math.round(FL.fwd * 100) + '%';
      ra.out.textContent = Math.round(FL.aft * 100) + '%';
      rf.r.setAttribute('aria-valuetext', Math.round(FL.fwd * 100) + '% extended, ' + word(FL.fwd));
      ra.r.setAttribute('aria-valuetext', Math.round(FL.aft * 100) + '% extended, ' + word(FL.aft));
      const rel = (d) => (d < 0.3 ? 'Low' : d < 1.2 ? 'Medium' : 'High');
      dF.textContent = rel(r.dF); dA.textContent = rel(r.dA);
      dM.textContent = Math.abs(r.m) < 0.035 ? 'Balanced' : r.m > 0 ? 'Nose up' : 'Nose down';
      dM.className = Math.abs(r.m) < 0.035 ? '' : r.m > 0 ? 'up' : 'down';
    }
    render();
  }

  /* ================================================================== 4. engine layout, bottom view */

  const ENG = { mode: 'ascent', api: null };

  function buildEngineLayout() {
    const W = 460, H = 486, C = [236, 252], S = 36;
    const Rm = G.R;
    const root = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': 'Bottom view of the six engines, nozzle exits to scale' });
    const P = (x, y) => [C[0] + x * S, C[1] + y * S];
    const defs = add(root, 'defs', {});
    const bell = add(defs, 'radialGradient', { id: 'eng-bell', cx: '0.5', cy: '0.5', r: '0.5' });
    add(bell, 'stop', { offset: '0', style: 'stop-color:var(--sh-k0)' });
    add(bell, 'stop', { offset: '0.25', style: 'stop-color:var(--sh-k1)' });
    add(bell, 'stop', { offset: '0.85', style: 'stop-color:var(--sh-k3)' });
    add(bell, 'stop', { offset: '1', style: 'stop-color:var(--sh-k5)' });
    const lit = add(defs, 'radialGradient', { id: 'eng-lit' });
    add(lit, 'stop', { offset: '0', class: 'plume-a', style: 'stop-opacity:0.95' });
    add(lit, 'stop', { offset: '0.6', class: 'plume-b', style: 'stop-opacity:0.5' });
    add(lit, 'stop', { offset: '1', class: 'plume-b', style: 'stop-opacity:0' });
    txt(root, 16, 22, 'VIEW G', 'lbl-title');
    txt(root, 16, 36, 'FROM BELOW. EXITS TO SCALE; CLOCKING SCHEMATIC.', 'lbl-sub');

    // aft flap stubs (sides), with break marks
    [-1, 1].forEach((s) => {
      const g = partG(root, ID.aft, {}, (s < 0 ? 'Left' : 'Right') + ' aft flap, bottom view');
      const x0 = s * (Rm + 0.05), x1 = s * (Rm + 1.35);
      const a = P(x0, -0.28), b = P(x1, -0.2), c = P(x1, 0.2), d = P(x0, 0.28);
      add(g, 'path', { class: 'hl', d: 'M' + a.map(fx).join(',') + 'L' + b.map(fx).join(',') + 'L' + c.map(fx).join(',') + 'L' + d.map(fx).join(',') + 'Z', style: 'fill:var(--sh-k3);stroke:var(--steel-2);stroke-width:0.9' });
      const bx = P(x1 + s * 0.12, 0)[0];
      add(g, 'path', { d: 'M' + fx(bx - 4) + ',' + fx(C[1] - 12) + 'l4,6l-4,6l4,6', style: 'stroke:var(--steel-2);fill:none;stroke-width:0.9' });
    });
    // skirt: leeward steel half on top, windward tiled half below
    const skirt = partG(root, ID.bayE, {}, 'Aft skirt, bottom view');
    add(skirt, 'circle', { class: 'hl', cx: C[0], cy: C[1], r: fx(Rm * S), style: 'fill:var(--bg-2);stroke:var(--steel);stroke-width:1.2' });
    const tileArc = partG(root, ID.hs, {}, 'Heat shield on the windward half');
    const rr = Rm * S;
    add(tileArc, 'path', { class: 'hl', d: 'M' + fx(C[0] - rr) + ',' + C[1] + 'A' + fx(rr) + ',' + fx(rr) + ' 0 0 0 ' + fx(C[0] + rr) + ',' + C[1], style: 'fill:none;stroke:var(--tile);stroke-width:10' });
    add(root, 'path', { d: 'M' + fx(C[0] - rr) + ',' + C[1] + 'A' + fx(rr) + ',' + fx(rr) + ' 0 0 0 ' + fx(C[0] + rr) + ',' + C[1], style: 'fill:none;stroke:var(--sh-k3);stroke-width:0.6' });
    txt(root, 16, C[1] + rr - 18, 'WINDWARD', 'lbl-sub', { style: 'fill:var(--fg-2)' });
    txt(root, 16, C[1] + rr - 6, '(TILES)', 'lbl-sub');
    txt(root, 16, C[1] - rr + 16, 'LEEWARD', 'lbl-sub', { style: 'fill:var(--fg-2)' });
    txt(root, 16, C[1] - rr + 28, '(STEEL)', 'lbl-sub');
    txt(root, 16, C[1] - 22, 'AFT FLAP', 'lbl-sub');
    add(root, 'path', { class: 'axis', d: 'M' + fx(C[0] - rr - 14) + ',' + C[1] + 'L' + fx(C[0] + rr + 14) + ',' + C[1] + 'M' + C[0] + ',' + fx(C[1] - rr - 6) + 'L' + C[0] + ',' + fx(C[1] + rr + 8) });

    const engines = [];
    function nozzle(id, x, y, d, kind, k) {
      const g = partG(root, id, {}, (kind === 'sl' ? 'Sea-level Raptor 3, ' : 'Raptor Vacuum 3, ') + 'engine ' + (k + 1));
      const [cx, cy] = P(x, y), r = (d / 2) * S;
      const glow = add(g, 'circle', { cx: fx(cx), cy: fx(cy), r: fx(r * 1.25), style: 'fill:url(#eng-lit);opacity:0' });
      add(g, 'circle', { class: 'hl', cx: fx(cx), cy: fx(cy), r: fx(r), style: 'fill:url(#eng-bell);stroke:var(--steel);stroke-width:1.3' });
      add(g, 'circle', { cx: fx(cx), cy: fx(cy), r: fx(r * 0.93), style: 'fill:none;stroke:var(--sh-k6);stroke-width:0.6' });
      add(g, 'circle', { cx: fx(cx), cy: fx(cy), r: fx(Math.max(3, r * 0.17)), style: 'fill:var(--sh-k0);stroke:var(--sh-k4);stroke-width:0.6' });
      if (kind === 'sl') add(g, 'circle', { cx: fx(cx), cy: fx(cy), r: fx(r + 5), style: 'fill:none;stroke:var(--accent);stroke-width:0.8;stroke-dasharray:2 3;opacity:0.7' });
      const out = add(g, 'g', { style: 'display:none' });
      add(out, 'path', { d: 'M' + fx(cx - r * 0.6) + ',' + fx(cy - r * 0.6) + 'L' + fx(cx + r * 0.6) + ',' + fx(cy + r * 0.6) + 'M' + fx(cx + r * 0.6) + ',' + fx(cy - r * 0.6) + 'L' + fx(cx - r * 0.6) + ',' + fx(cy + r * 0.6), style: 'stroke:var(--bad);stroke-width:2' });
      engines.push({ kind, k, glow, out, g, cx, cy, r });
    }
    const vacA = [90, 210, 330], slA = [270, 30, 150];
    slA.forEach((a, k) => nozzle(ID.sl, G.sl.x * Math.cos(a * Math.PI / 180) * 1.05, G.sl.x * Math.sin(a * Math.PI / 180) * 1.05, G.sl.d, 'sl', k));
    vacA.forEach((a, k) => nozzle(ID.vac, G.vac.x * Math.cos(a * Math.PI / 180), G.vac.x * Math.sin(a * Math.PI / 180), G.vac.d, 'vac', k));

    // dimensions from facts
    const dims = add(root, 'g', {});
    const yTop = C[1] - rr - 18;
    const v0 = engines.find((e) => e.kind === 'vac' && e.k === 2);
    dimLine(dims, v0.cx - v0.r, yTop, v0.cx + v0.r, yTop, [[v0.cx - v0.r, v0.cy, v0.cx - v0.r, yTop - 4], [v0.cx + v0.r, v0.cy, v0.cx + v0.r, yTop - 4]]);
    factText(dims, v0.cx - v0.r, yTop - 7, 'raptor.rvac3.exitDiameter', 'dim-t', { 'text-anchor': 'start' }, () => 'RVAC Ø ' + SX.fmt('raptor.rvac3.exitDiameter'));
    const s0 = engines.find((e) => e.kind === 'sl' && e.k === 0);
    dimLine(dims, s0.cx - s0.r, yTop, s0.cx + s0.r, yTop, [[s0.cx - s0.r, s0.cy, s0.cx - s0.r, yTop - 4], [s0.cx + s0.r, s0.cy, s0.cx + s0.r, yTop - 4]]);
    factText(dims, s0.cx + s0.r, yTop - 7, 'raptor.r3.exitDiameter', 'dim-t', { 'text-anchor': 'end' }, () => 'SL Ø ' + SX.fmt('raptor.r3.exitDiameter'));
    const yd = C[1] + rr + 24;
    dimLine(dims, C[0] - rr, yd, C[0] + rr, yd, [[C[0] - rr, C[1], C[0] - rr, yd + 4], [C[0] + rr, C[1], C[0] + rr, yd + 4]]);
    factText(dims, C[0], yd + 14, 'ship.diameter', 'dim-t', { 'text-anchor': 'middle' }, () => 'SKIRT Ø ' + SX.fmt('ship.diameter'));
    // legend chips inside
    const lg = add(root, 'g', {});
    add(lg, 'circle', { cx: W - 112, cy: 20, r: 6, style: 'fill:none;stroke:var(--accent);stroke-dasharray:2 2' });
    txt(lg, W - 100, 24, 'GIMBALS', 'lbl-sub');
    add(lg, 'circle', { cx: W - 112, cy: 38, r: 6, style: 'fill:url(#eng-lit)' });
    txt(lg, W - 100, 42, 'FIRING NOW', 'lbl-sub');

    function update() {
      const m = ENG.mode;
      engines.forEach((e) => {
        let on = false, out = false;
        if (m === 'ascent') on = true;
        else if (m === 'out') { on = !(e.kind === 'vac' && e.k === 0); out = e.kind === 'vac' && e.k === 0; }
        else if (m === 'space') on = e.kind === 'sl' && e.k === 0;
        else if (m === 'landing') on = e.kind === 'sl';
        e.glow.style.opacity = on ? '1' : '0';
        e.out.style.display = out ? '' : 'none';
        e.g.classList.toggle('eng-off', !on && m !== 'ascent');
      });
    }
    return { root, update };
  }

  function sectionEngines(host) {
    const sec = el('section', { class: 'sh-sec', 'aria-labelledby': 'sh-h-eng' });
    sec.appendChild(el('div', { class: 'sh-sec-head' },
      el('span', { class: 'eyebrow' }, '3.5'), el('h3', { class: 'h3', id: 'sh-h-eng' }, 'Engine layout'),
      el('span', { class: 'small muted' }, 'Three sea-level Raptors in the middle, three vacuum engines around them.')));
    const row = el('div', { class: 'sh-row' });
    sec.appendChild(row);
    const view = buildEngineLayout();

    const col = el('div', { class: 'sh-col' });
    col.appendChild(el('div', { class: 'prose', html: SX.withFacts(
      '<p>All six are Raptor 3, built around the same powerhead. The difference is the nozzle. A sea-level nozzle, {{raptor.r3.exitDiameter}} across, is sized so the exhaust still fills it in thick air. A Raptor Vacuum bell, {{raptor.rvac3.exitDiameter}} across, has about {{ship.exitAreaRatio}} the exit area; it expands the gas much further and gets more push from the same propellant in vacuum, but at sea level the flow would separate from the wall.</p>' +
      '<p>That split sets every job. On the climb all six fire. In space a single sea-level engine did the orbit insertion and deorbit burns on Flight 14. For landing only the three gimbaling sea-level engines light. When one RVac shut down early on Flights 12 and 14, the others burned longer and the ship still made its trajectory.</p>') }));
    const cards = el('div', { class: 'sh-mini' });
    const card = (id, title, rows) => {
      const c = el('div', { class: 'panel' });
      c.appendChild(el('h4', null, el('button', { type: 'button', class: 'sh-cardbtn', 'data-part': id, 'aria-label': partName(id) }, title)));
      const tb = el('tbody');
      rows.forEach(([k, f]) => tb.appendChild(el('tr', null, el('th', { scope: 'row' }, k), el('td', { html: SX.factHTML(f) }))));
      c.appendChild(el('table', { class: 'spec-table' }, tb));
      return c;
    };
    cards.appendChild(card(ID.sl, 'Sea-level x3', [['Thrust, SL', 'raptor.r3.thrustSL'], ['Exit', 'raptor.r3.exitDiameter'], ['Height', 'raptor.r3.height'], ['Isp, vac', 'raptor.r3.ispVac']]));
    cards.appendChild(card(ID.vac, 'Vacuum x3', [['Thrust, vac', 'raptor.rvac3.thrust'], ['Exit', 'raptor.rvac3.exitDiameter'], ['Height', 'raptor.rvac3.height'], ['Isp, vac', 'raptor.rvac3.isp']]));
    col.appendChild(cards);
    wire(cards);
    const rel = el('div', { class: 'chip-row' });
    [['raptor3', 'Raptor 3 in 3D'], ['raptor3.rvac', 'Raptor Vacuum'], ['raptor3.gimbal', 'Gimbal mount']].forEach(([id, n]) => {
      const b = el('button', { type: 'button', class: 'chip chip-quiet' }, n);
      b.addEventListener('click', () => (SX.viewsFor(id).length ? SX.show(id) : SX.select(id)));
      rel.appendChild(b);
    });
    col.appendChild(rel);
    row.appendChild(col);

    const fig = el('div', { class: 'sh-fig' });
    const frame = el('figure', { class: 'viz viz-grid', style: { margin: 0 } });
    frame.appendChild(el('div', { class: 'sh-titlebar' }, el('span', null, 'View G ', el('b', null, 'Engine bay from below')), el('span', null, 'Nozzle exits to scale')));
    const wrapV = el('div', { style: { maxWidth: '560px', margin: '0 auto' } });
    wrapV.appendChild(view.root);
    frame.appendChild(wrapV);
    const total = el('p', { class: 'sh-legend sh-note', 'aria-live': 'polite' });
    frame.appendChild(total);
    fig.appendChild(frame);
    wire(view.root);
    const ctr = el('div', { class: 'panel sh-controls' });
    const seg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Which engines fire' });
    const modes = [['ascent', 'Ascent'], ['out', 'RVac out'], ['space', 'In space'], ['landing', 'Landing']];
    modes.forEach(([m, n]) => {
      const b = el('button', { type: 'button', 'aria-pressed': String(m === ENG.mode), 'data-mode': m }, n);
      b.addEventListener('click', () => { ENG.mode = m; render(); });
      seg.appendChild(b);
    });
    ctr.appendChild(el('div', { class: 'row' }, seg));
    fig.appendChild(ctr);
    row.appendChild(fig);

    function render() {
      view.update();
      seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === ENG.mode)));
      const sl = SX.val('raptor.r3.thrustSL', null), slv = SX.val('raptor.r3.thrustVacOfSLEngine', null), vac = SX.val('raptor.rvac3.thrust', null);
      let html = '';
      if (ENG.mode === 'ascent') html = 'All six firing: ' + SX.factHTML('ship.thrustVac') + ' in vacuum (SpaceX total for the ship).';
      else if (ENG.mode === 'out') html = 'One RVac out, as on Flights 12 and 14: about ' + SX.esc(SX.fmtValue(3 * slv + 2 * vac, 'tf')) + ' in vacuum (derived: three sea-level at about ' + SX.factHTML('raptor.r3.thrustVacOfSLEngine') + ' plus two RVacs). The ship burns longer to make up the difference.';
      else if (ENG.mode === 'space') html = 'One sea-level engine, as for the Flight 14 orbit insertion (' + SX.factHTML('raptor.r3.orbitInsertionBurn') + ') and deorbit (' + SX.factHTML('raptor.r3.deorbitBurn') + ') burns: about ' + SX.factHTML('raptor.r3.thrustVacOfSLEngine') + ' in vacuum.';
      else html = 'Landing: the three sea-level engines, up to ' + SX.esc(SX.fmtValue(3 * sl, 'tf')) + ' at sea level (3 x ' + SX.factHTML('raptor.r3.thrustSL') + '), stepping down to two and then one.';
      total.innerHTML = html;
      SX.renderFacts(total);
    }
    render();
    SX.on('units', render);
    ENG.api = { render, frame };
    host.appendChild(sec);
    return sec;
  }

  /* ================================================================== registration */

  function focusPart(id) {
    const heat = [ID.tile, ID.tpin, ID.felt, ID.abl];
    const eng = [ID.sl, ID.vac];
    let target = null;
    if (heat.includes(id) && HS.api) {
      const peel = { [ID.tile]: 0, [ID.tpin]: 0.5, [ID.felt]: 0.5, [ID.abl]: 0.84 }[id];
      HS.api.setPeel(peel, true);
      target = HS.api.frame;
    } else if (id === 'ship') {
      target = cutState.frame;
    } else {
      const inCut = cutState.svgEl && cutState.svgEl.querySelector('.part[data-part="' + id + '"]');
      const inB = cutState.svgB && cutState.svgB.querySelector('.part[data-part="' + id + '"]');
      const preferB = id === ID.av || id === ID.ports;
      target = preferB ? (inB || inCut) : (inCut || inB);
      if (!target && eng.includes(id) && ENG.api) target = ENG.api.frame;
    }
    if (!target) target = cutState.frame;
    try { target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center', inline: 'center' }); } catch (e) { target.scrollIntoView(); }
    markSelected(id);
    if (mountEl) mountEl.querySelectorAll('.part[data-part="' + id + '"]').forEach(pulse);
    if (id === 'ship' || heat.includes(id)) pulse(target);
  }

  SX.register('ship', {
    title: 'ship cutaway',
    parts: PART_IDS,
    init(mount) {
      mountEl = mount;
      const wrap = el('div', { class: 'sh-wrap' });
      mount.appendChild(wrap);
      sectionCutaway(wrap);
      sectionHeatShield(wrap);
      const re = sectionReentry(wrap);
      sectionFlapLab(re);
      sectionEngines(wrap);
      SX.on('select', (id) => markSelected(id));
      SX.on('hover', (id, o) => { if (!o || o.from !== 'ship') markHover(id); });
      SX.on('units', () => unitHooks.forEach((f) => { try { f(); } catch (e) { /* keep going */ } }));
      if (SX.selected) markSelected(SX.selected);
    },
    focus: focusPart,
  });
})();
