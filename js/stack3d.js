/* Starship Anatomy: stack3d view.
   A procedural Three.js model of the full Starship V3 stack (Super Heavy + Starship) at published proportions.
   Modes: Assembled, Exploded, Section (a fixed cut plane A-A through the vertical axis with propellant levels).
   Scene units are meters, +y up, engine exits of the booster at y = 0.
   Azimuth convention used throughout: phi = 0 points at +z, phi = 90 deg points at +x (x = r sin phi, z = r cos phi),
   which matches THREE.LatheGeometry. The ship's windward (tiled) side faces +x; the booster's rudder fin faces -z. */
(function () {
  'use strict';
  const SX = window.SX;
  if (!SX) return;
  const VIEW = 'stack3d';

  /* ------------------------------------------------------------------ extra facts (view-specific, with sources) */

  SX.addFacts({
    'stack.thrustVsSaturnV': { v: 2.4, unit: '×', conf: 'estimate', src: ['S1', 'S36'],
      note: 'Derived: 8,240 tf (80.8 MN) divided by Saturn V liftoff thrust of 7.5 million lbf (33.4 MN) = 2.42.' },
    'stack.hotStageTime': { v: 142, unit: 's', conf: 'official', src: ['S5'],
      note: 'Flight 14 plan: hot staging at T+2:22, two seconds after booster MECO at T+2:20.' },
    'stack.liftoffTWR': { v: 1.45, unit: '', conf: 'estimate', src: ['S1', 'S22'],
      note: 'Derived: 8,240 tf liftoff thrust / about 5,700 t estimated liftoff mass = 1.45. NASASpaceflight describes it as "nearly 1.5".' },
    'stack3d.ringHeight': { v: 1.83, unit: 'm', conf: 'estimate', src: ['S50'],
      note: 'Steel barrel rings are about 1.8 m (6 ft) tall: community measurements of V1/V2 rings. V3 ring height is not published. The seams on this model use this spacing.' },
    'stack3d.personHeight': { v: 1.8, unit: 'm', conf: 'estimate', src: [],
      note: 'A reference adult for scale, not a vehicle dimension.' },
  });

  /* ------------------------------------------------------------------ content for the 'stack' node (owned here) */

  SX.addParts([{
    id: 'stack', parent: null, name: 'Starship system', kind: 'Vehicle', order: 0, view: VIEW,
    summary: 'Super Heavy and Starship stacked into one {{stack.height}} launch vehicle, the tallest and most powerful rocket ever flown, with both stages designed to come back and fly again.',
    body: [
      '<b>Two stages, one launch.</b> Super Heavy does the heavy lifting at the start. It lights {{booster.engineCount}} on the pad, every one a Raptor 3, producing {{stack.liftoffThrust}}, about {{stack.thrustVsSaturnV}} the liftoff thrust of a Saturn V, against an estimated {{stack.liftoffMass}} of fully fuelled rocket. About {{stack.hotStageTime}} after liftoff most booster engines shut down and the ship lights its own engines while the two stages are still joined. This is hot staging. Separating first and lighting later (cold staging) would need extra thrusters to settle the ship\'s propellant, and the stack would lose speed while nothing was firing.',
      '<b>A hot stage built into the booster.</b> Earlier boosters carried a vented steel ring that shielded the booster\'s top and was dropped after boostback. V3 builds the hot stage into the booster as an open truss. The ship\'s exhaust hits the booster\'s forward dome directly, which is protected by tank pressure and a layer of non-structural steel, and the gas escapes sideways through the truss.',
      '<b>Both stages come home.</b> After separation the booster flips, relights (on V3 all {{booster.enginesRelight}} can restart), flies back steered by {{booster.gridFins}}, and slows with a landing burn of {{booster.landingBurnSequence}}. On a return to the launch site the tower\'s arms catch it by its grid fins. The ship finishes the climb to orbit, delivers its payload, then reenters belly first behind a black ceramic heat shield, steers with its flaps, flips upright and lands on its sea-level engines. Flying the same hardware again, and later refuelling ships in orbit for missions to the Moon and Mars, is the reason for the whole design.',
      '<b>What V3 changed.</b> V3 first flew on {{raptor.r3.firstFlight}}. Every engine is now a Raptor 3, rated at {{raptor.r3.thrustSL}} at sea level and {{raptor.rvac3.thrust}} in the vacuum version, with its sensors and controllers built inside the engine so the bulky engine shrouds could go. The booster gained the integrated hot stage, larger grid fins ({{booster.gridFins}}) that double as catch points, a methane transfer tube roughly the size of a Falcon 9 first stage, and a separate LOX tank for landing. The ship lowered its common and aft domes by about {{ship.domeLowering}} to carry {{ship.propTotal}} of propellant, and gained docking drogues for ship-to-ship propellant transfer. The stack grew from {{stack.heightV2}} to {{stack.height}}.',
      '<b>Where things stand.</b> Flight 14 on {{flight.firstOrbit}} made Starship an orbital vehicle for the first time and deployed {{flight.f14Starlinks}}, all Starlink V3. The tower has made {{booster.catchesTotal}} so far, all of first-generation boosters. No V3 booster and no ship has been caught yet.',
    ],
    specs: [
      { label: 'Height', fact: 'stack.height' },
      { label: 'Diameter', fact: 'stack.diameter' },
      { label: 'Liftoff mass', fact: 'stack.liftoffMass' },
      { label: 'Liftoff thrust', fact: 'stack.liftoffThrust' },
      { label: 'Thrust-to-weight at liftoff', fact: 'stack.liftoffTWR' },
      { label: 'Propellant', fact: 'stack.propTotal' },
      { label: 'Payload to orbit, reusable', fact: 'stack.payloadLEOReusable' },
      { label: 'Raptor 3 engines', fact: 'stack.engineCount' },
      { label: 'Integrated flights', fact: 'flight.integratedFlights' },
    ],
    related: ['raptor3', 'flight', 'ground'],
  }]);

  /* ------------------------------------------------------------------ part ids this view models
     Names below are short on-model labels. Inspector content for booster.* and ship.* is owned by the booster and
     ship views; the fallback line is only used for the hover tip until (or unless) the owner registers the node. */

  const PARTS = [
    // [id, parent, label name, fallback kind, fallback one-line summary]
    ['booster.hsr', 'booster', 'Integrated hot stage', 'Structure', 'An open steel truss on top of the booster that lets the ship\'s exhaust escape during hot staging. On V3 it stays with the booster.'],
    ['booster.gridfins', 'booster', 'Grid fins', 'Aerodynamic control', 'Lattice fins that steer the booster on its way back. V3 has fewer, larger fins, and two of them carry the catch points.'],
    ['booster.catch', 'booster', 'Catch points', 'Structure', 'Hard points built into the two opposite grid fins, where the tower arms take the booster\'s weight.'],
    ['booster.ch4Tank', 'booster', 'Methane tank', 'Propellant tank', 'The upper main tank, holding the liquid methane fuel.'],
    ['booster.commonDome', 'booster', 'Common dome', 'Bulkhead', 'One shared steel bulkhead separating the methane tank above from the liquid oxygen tank below.'],
    ['booster.loxTank', 'booster', 'LOX tank', 'Propellant tank', 'The lower and larger main tank, holding liquid oxygen, the heaviest single mass on the rocket.'],
    ['booster.downcomer', 'booster', 'Methane transfer tube', 'Plumbing', 'A pipe roughly the size of a Falcon 9 first stage that carries methane down through the LOX tank to the engines.'],
    ['booster.chines', 'booster', 'Chines', 'Aerodynamic structure', 'Long strakes on the lower body that add lift during the glide back and house avionics and pressure vessels.'],
    ['booster.thrustSection', 'booster', 'Thrust section', 'Structure', 'The aft skirt and tapered thrust plate that carry the push of all {{booster.engineCount}} into the tanks.'],
    ['booster.engineShield', 'booster', 'Engine shielding', 'Thermal protection', 'Metallic heat shielding on the surface between the engines. V3 deleted the individual engine shrouds.'],
    ['booster.landingTank', 'booster', 'LOX landing tank', 'Propellant tank', 'A separate liquid oxygen tank on V3 that feeds the inner {{booster.enginesGimbal}} for the landing burn. Size and location are not published.'],
    ['booster.enginesCenter', 'booster', 'Center engines', 'Engines', 'The {{booster.enginesCenter}} at the center. They gimbal, and are clocked so none fires straight at the flame diverter ridge.'],
    ['booster.enginesInner', 'booster', 'Inner ring', 'Engines', 'The inner ring of {{booster.enginesInner}}. They gimbal to steer and, with the center three, fly the landing burn.'],
    ['booster.enginesOuter', 'booster', 'Outer ring', 'Engines', 'The outer ring of {{booster.enginesOuter}}, fixed in place, supplying most of the liftoff thrust.'],
    ['ship.nose', 'ship', 'Nosecone', 'Structure', 'The ogive nose, holding the header tanks, gas bottles and forward flap mounts.'],
    ['ship.headerLOX', 'ship', 'LOX header tank', 'Propellant tank', 'A small liquid oxygen tank in the nose tip, reserved for the landing flip and burn.'],
    ['ship.headerCH4', 'ship', 'Methane header tank', 'Propellant tank', 'A small methane sphere below the LOX header, reserved for landing.'],
    ['ship.payloadBay', 'ship', 'Payload bay', 'Cargo', 'The cargo volume above the methane tank, with a slot door that dispenses Starlink satellites one at a time.'],
    ['ship.flapsFwd', 'ship', 'Forward flaps', 'Aerodynamic control', 'The pair of flaps high on the nose, swung toward the leeward side, that steer the ship during reentry.'],
    ['ship.flapsAft', 'ship', 'Aft flaps', 'Aerodynamic control', 'The large pair of flaps at the tail, the main drag and control surfaces during reentry.'],
    ['ship.ch4Tank', 'ship', 'Methane tank', 'Propellant tank', 'The ship\'s upper main tank, holding liquid methane.'],
    ['ship.commonDome', 'ship', 'Common dome', 'Bulkhead', 'The shared bulkhead between the ship\'s methane and LOX tanks. It bulges downward so methane drains to the center.'],
    ['ship.loxTank', 'ship', 'LOX tank', 'Propellant tank', 'The ship\'s larger lower tank, holding liquid oxygen.'],
    ['ship.heatShield', 'ship', 'Heat shield', 'Thermal protection', 'Black hexagonal ceramic tiles covering the windward side, which faces the flow during reentry.'],
    ['ship.rcs', 'ship', 'Attitude thrusters', 'Reaction control', 'Small thrusters on the payload bay, mid-body and aft flap hinges that point the ship in space.'],
    ['ship.catchPins', 'ship', 'Catch points', 'Structure', 'Hard points high on the nose where the tower arms can lift and, in future, catch the ship.'],
    ['ship.transferPorts', 'ship', 'Docking and transfer ports', 'Propellant transfer', 'Docking drogues ({{ship.dockingDrogues}}) on the leeward side and the split quick-disconnect plate used for filling and in-space transfer.'],
    ['ship.engineBay', 'ship', 'Engine bay', 'Structure', 'The unpressurized aft skirt around the ship\'s six engines, which sits on the booster at launch.'],
    ['ship.enginesSL', 'ship', 'Sea-level Raptors', 'Engines', 'Sea-level Raptor 3 engines ({{ship.enginesSL}}) at the center. They gimbal, and do the in-space burns and the landing.'],
    ['ship.enginesVac', 'ship', 'Raptor Vacuum', 'Engines', 'Raptor Vacuum 3 engines ({{ship.enginesVac}}) with much larger, fixed nozzles, for efficient thrust in near vacuum.'],
  ];
  const META = {};
  PARTS.forEach(([id, parent, name, kind, line]) => { META[id] = { id, parent, name, kind, line }; });
  META.stack = { id: 'stack', name: 'Starship system', line: 'The full V3 stack.' };
  META.booster = { id: 'booster', name: 'Super Heavy', line: 'The first stage.' };
  META.ship = { id: 'ship', name: 'Starship', line: 'The upper stage and spacecraft.' };
  const INTERNAL = new Set(['booster.ch4Tank', 'booster.commonDome', 'booster.loxTank', 'booster.downcomer', 'booster.landingTank',
    'booster.thrustSection', 'ship.headerLOX', 'ship.headerCH4', 'ship.payloadBay', 'ship.ch4Tank', 'ship.commonDome', 'ship.loxTank']);

  SX.register(VIEW, {
    title: '3D stack',
    parts: ['stack', 'booster', 'ship'].concat(PARTS.map((p) => p[0])),
    init,
    focus: (id) => { if (S) S.focus(id); },
  });

  /* ------------------------------------------------------------------ styles (scoped) */

  SX.css(`
.v-stack3d { isolation: isolate; }
.v-stack3d .s3-viz { position: absolute; inset: 0; }
.v-stack3d .s3-stage { position: absolute; inset: 0; }
.v-stack3d .s3-top { justify-content: space-between; align-items: flex-start; }
.v-stack3d .s3-top .seg { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35); }
.v-stack3d .s3-toggles { display: flex; gap: 6px; flex-wrap: wrap; }
.v-stack3d .s3-toggles .btn { background: rgba(17, 24, 32, 0.82); }
.v-stack3d .s3-toggles .btn[aria-pressed="true"] { background: rgba(40, 34, 12, 0.9); }
.v-stack3d .s3-bottom { position: absolute; left: 12px; right: 12px; bottom: 12px; z-index: 2; display: grid; gap: 8px; pointer-events: none; }
.v-stack3d .s3-bottom > * { pointer-events: auto; min-width: 0; }
.v-stack3d.s3-coarse .s3-bottom { right: 128px; }
.v-stack3d .s3-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.v-stack3d .s3-cams { display: flex; gap: 6px; align-items: center; overflow-x: auto; scrollbar-width: none; min-width: 0; flex: 1 1 auto; }
.v-stack3d .s3-cams::-webkit-scrollbar { display: none; }
.v-stack3d .s3-cams .eyebrow { font-size: 10px; white-space: nowrap; margin-right: 2px; }
.v-stack3d .s3-cams .chip { font: 500 10.5px/1 var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; padding: 7px 9px; white-space: nowrap; background: rgba(17, 24, 32, 0.84); }
.v-stack3d .s3-jump { font: 500 11px/1.2 var(--font-mono); letter-spacing: 0.04em; color: var(--fg); background: rgba(17, 24, 32, 0.9); border: 1px solid var(--line-2); border-radius: 999px; padding: 6px 26px 6px 10px; max-width: 190px; min-width: 0; cursor: pointer;
  appearance: none; -webkit-appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%), linear-gradient(135deg, var(--muted) 50%, transparent 50%);
  background-position: calc(100% - 13px) 50%, calc(100% - 9px) 50%; background-size: 4px 4px; background-repeat: no-repeat; }
.v-stack3d .s3-jump:hover { border-color: var(--accent); }
.v-stack3d .s3-jump option, .v-stack3d .s3-jump optgroup { background: var(--bg-2); color: var(--fg); }
.v-stack3d .s3-prop { flex: 1 1 220px; max-width: 320px; background: rgba(17, 24, 32, 0.88); border: 1px solid var(--line-2); border-radius: var(--radius); padding: 5px 10px; gap: 8px; }
.v-stack3d .s3-prop[hidden] { display: none; }
.v-stack3d .s3-prop output { min-width: 4.2ch; }
.v-stack3d .s3-legend { display: grid; justify-items: end; gap: 5px; font: 500 10.5px/1.3 var(--font-mono); letter-spacing: 0.04em; color: var(--fg-2); margin-top: 10px; text-transform: none; }
.v-stack3d .s3-legend i { display: inline-block; width: 9px; height: 9px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; }
.v-stack3d .s3-note { font: 400 10.5px/1.4 var(--font-mono); color: var(--muted); letter-spacing: 0.02em; }
.v-stack3d .s3-section-tag { position: absolute; right: 14px; top: 58px; z-index: 2; pointer-events: none; text-align: right; font: 600 13px/1 var(--font-display); letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-2); opacity: 0; transition: opacity 0.4s; }
.v-stack3d .s3-section-tag small { display: block; margin-top: 4px; font: 500 10px/1.3 var(--font-mono); letter-spacing: 0.06em; color: var(--muted); }
.v-stack3d .s3-section-tag.on { opacity: 1; }
.v-stack3d .s3-arrow { display: inline-block; width: 22px; height: 10px; margin: 0 6px; vertical-align: 1px; border-top: 1px solid var(--fg-2); position: relative; }
.v-stack3d .three-label.s3-lbl { background: none; border: 0; padding: 0; margin: 0; width: 0; height: 0; overflow: visible; font: 500 10.5px/1 var(--font-mono); letter-spacing: 0.06em; transition: opacity 0.35s; }
.v-stack3d .s3-lbl.s3-off { opacity: 0; }
.v-stack3d .s3-lbl .s3-dot { position: absolute; left: -3px; top: -3px; width: 6px; height: 6px; border-radius: 50%; background: var(--fg); box-shadow: 0 0 0 2px rgba(12, 17, 23, 0.75); }
.v-stack3d .s3-lbl svg { position: absolute; left: 0; top: 0; width: 1px; height: 1px; overflow: visible; pointer-events: none; }
.v-stack3d .s3-lbl polyline { fill: none; stroke: var(--steel-2); stroke-width: 1; vector-effect: non-scaling-stroke; }
.v-stack3d .s3-lbl .s3-txt { position: absolute; left: 0; top: 0; pointer-events: auto; cursor: pointer; white-space: nowrap; color: var(--fg); padding: 4px 6px; background: rgba(12, 17, 23, 0.8); border: 1px solid var(--line); border-radius: 3px; }
.v-stack3d .s3-lbl .s3-txt:hover, .v-stack3d .s3-lbl.is-sel .s3-txt { color: var(--accent); border-color: rgba(255, 210, 74, 0.55); }
.v-stack3d .s3-lbl.is-sel .s3-dot { background: var(--accent); }
.v-stack3d .s3-lbl.is-sel polyline { stroke: var(--accent); }
.v-stack3d .s3-lbl .s3-txt small { color: var(--muted); margin-left: 6px; letter-spacing: 0.02em; text-transform: none; }
.v-stack3d .s3-lbl .s3-txt .cd { display: inline-block; width: 5px; height: 5px; border-radius: 50%; margin-left: 4px; vertical-align: 0.2em; background: var(--muted); }
.v-stack3d .s3-lbl .cd.conf-official { background: var(--good); } .v-stack3d .s3-lbl .cd.conf-reported { background: var(--conf-rep); }
.v-stack3d .s3-lbl .cd.conf-estimate { background: var(--warn); } .v-stack3d .s3-lbl .cd.conf-disputed { background: var(--bad); }
.v-stack3d .s3-lbl.s3-lox .s3-txt { border-left: 2px solid var(--lox); }
.v-stack3d .s3-lbl.s3-ch4 .s3-txt { border-left: 2px solid var(--ch4); }
.v-stack3d .three-label.s3-dim { background: none; border: 0; padding: 0; margin: 0; font: 500 10.5px/1.2 var(--font-mono); letter-spacing: 0.06em; color: var(--fg-2); transition: opacity 0.35s; }
.v-stack3d .s3-dim span { position: absolute; right: 8px; top: 0; transform: translateY(-50%); white-space: nowrap; text-align: right; }
.v-stack3d .s3-dim b { display: block; font-weight: 500; color: var(--fg); font-size: 12px; text-transform: none; }
.v-stack3d .s3-dim.s3-off { opacity: 0; }
.v-stack3d .s3-status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 600px) {
  .v-stack3d .s3-top .seg button { padding: 8px 8px; }
  .v-stack3d .s3-toggles .btn { padding: 6px 8px; font-size: 11.5px; }
  .v-stack3d .s3-jump { max-width: 150px; }
  .v-stack3d .s3-note { display: none; }
  .v-stack3d .s3-section-tag { display: none; }
  .v-stack3d .three-label.s3-lbl { font-size: 9.5px; }
  .v-stack3d .s3-lbl .s3-txt { padding: 3px 5px; }
  .v-stack3d .s3-dim b { font-size: 11px; }
}
`);

  /* ------------------------------------------------------------------ geometry constants (meters)
     Heights, diameter and engine sizes come from facts. Internal stations are ESTIMATES from the dossiers
     (research/03 and 04): tank split sized from the estimated LOX and methane masses at subcooled densities,
     positions from the reported ring and section layout. They are schematic and labelled as such on the page. */

  const HB = SX.val('booster.height', 72);
  const HS = SX.val('ship.height', 52);
  const R = SX.val('booster.diameter', 9) / 2;
  const TW = 0.12; // drawn wall thickness (real skin is about 4 mm; exaggerated so the section cut reads)
  const RI = R - TW;
  const RING = SX.val('stack3d.ringHeight', 1.83);
  const ENG = { h: SX.val('raptor.r3.height', 2.9), re: SX.val('raptor.r3.exitDiameter', 1.3) / 2 };
  const RVAC = { h: SX.val('raptor.rvac3.height', 4.4), re: SX.val('raptor.rvac3.exitDiameter', 2.3) / 2 };

  const B = {
    skirt: 2.3,                   // estimate: nozzle protrusion below the aft skirt (tapered V3 thrust plate)
    plate: 3.05,                  // thrust plate apex under the engines
    aftEq: 7.8, aftD: 2.6,        // aft dome (bulges down)
    comEq: 48.2, comD: 2.4,       // common dome (drawn bulging down; orientation not documented)
    fwdEq: HB - 3.8, fwdD: 2.3,   // forward dome (bulges up into the hot-stage truss)
    barrelTop: HB - 3.1,          // top of the tank barrel; the open truss sits above
    tubeR: SX.val('booster.transferTubeDiameter', 3) / 2,
    tubeBot: 3.6,
    finY: HB - 7.2,               // grid fin mid-plane (0.87 to 0.93 of height, lowered on V3)
    landX: -2.9, landR: 1.15, landY0: 6.3, landY1: 12.1,
  };
  const SH = {
    y0: HB,
    barrelTop: Math.round((21 * RING) * 100) / 100, // 21 rings (reported layout)
    aftEq: 6.4, aftD: 3.0,
    comEq: 21.8, comD: 2.0,       // bulges down so methane drains to the center (reported)
    fwdEq: 31.5, fwdD: 1.5,       // flat e-dome, bulges up into the payload bay
    dcR: 0.45,                    // central downcomer (V2 layout; V3 routing not published)
    hdrLOX0: 49.2, hdrLOXrim: 50.1,
    hdrCH4c: 47.75, hdrCH4r: 1.35,
    doorY0: 34.3, doorY1: 36.9,
  };
  SH.noseL = HS - SH.barrelTop;
  const WIND = Math.PI / 2;       // ship windward (heat shield) azimuth: +x
  const LEE = WIND + Math.PI;

  /** Nose radius at ship-relative height y (blunted ogive). */
  function noseR(y) {
    const t = SX.clamp((y - SH.barrelTop) / SH.noseL, 0, 1);
    return R * Math.pow(Math.max(0, 1 - Math.pow(t, 1.7)), 0.62);
  }
  /** Outer skin radius of the ship at ship-relative height. */
  function shipR(y) { return y <= SH.barrelTop ? R : noseR(y); }

  // Exploded offsets (m) by assembly
  const EXPLODE = { bEng: -7, bCore: 0, hsr: 8, sEng: 15, sBody: 22, sNose: 30 };

  let S = null; // live view state (one instance)

  /* ------------------------------------------------------------------ utilities */

  let THREE = null;
  const DEG = Math.PI / 180;
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function polar(phi, r, y) { return new THREE.Vector3(r * Math.sin(phi), y, r * Math.cos(phi)); }
  /** y of an ellipsoidal dome surface at radius r. dir -1 bulges down, +1 bulges up. */
  function domeY(eq, depth, rr, dir, r) { return eq + dir * depth * Math.sqrt(Math.max(0, 1 - (r / rr) * (r / rr))); }
  function cssColor(name, fallback) { const c = SX.color(name); return c || fallback; }
  /** CSS token as a linear THREE.Color, so the rendered (sRGB-encoded) result matches the token. */
  function col(name, fallback) { return new THREE.Color(cssColor(name, fallback)).convertSRGBToLinear(); }
  function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ''); }
  function factsToText(s) {
    return String(s || '').replace(/\{\{\s*([\w.]+)(?:\|([^}\s]+))?\s*\}\}/g, (m, k, to) => SX.fmt(k, to ? { to } : null));
  }
  function partName(id) { const p = SX.part(id); return (p && p.name) || (META[id] && META[id].name) || id; }
  function partLine(id) {
    const p = SX.part(id);
    let s = stripTags(factsToText((p && p.summary) || (META[id] && META[id].line) || ''));
    const m = s.match(/^.*?[.!?](?=\s|$)/);
    if (m) s = m[0];
    return s.length > 170 ? s.slice(0, 167).replace(/\s+\S*$/, '') + '...' : s;
  }

  /* ------------------------------------------------------------------ procedural textures (canvas) */

  let maxAniso = 4;

  /** Stainless skin: one band per ring with a slight tone shift, a faint weld seam at each ring joint,
      one vertical weld per ring, and circumferential grain. v runs from y0 (bottom) to y1 (top). */
  function steelTexture(y0, y1, seams, seed, base) {
    const W = 256, H = 2048;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    const r = rng(seed);
    const rowOf = (y) => (1 - (y - y0) / (y1 - y0)) * H;
    base = base || [192, 200, 208];
    const cuts = [y0].concat(seams.filter((s) => s > y0 + 0.05 && s < y1 - 0.05)).concat([y1]).sort((a, b) => a - b);
    for (let i = 0; i < cuts.length - 1; i++) {
      const top = rowOf(cuts[i + 1]), bot = rowOf(cuts[i]);
      const k = (r() - 0.5) * 18, warm = (r() - 0.5) * 5;
      const grad = g.createLinearGradient(0, top, 0, bot);
      const cA = 'rgb(' + ((base[0] + k + warm) | 0) + ',' + ((base[1] + k) | 0) + ',' + ((base[2] + k - warm) | 0) + ')';
      const cB = 'rgb(' + ((base[0] + k + warm - 7) | 0) + ',' + ((base[1] + k - 7) | 0) + ',' + ((base[2] + k - warm - 6) | 0) + ')';
      grad.addColorStop(0, cB); grad.addColorStop(0.18, cA); grad.addColorStop(0.82, cA); grad.addColorStop(1, cB);
      g.fillStyle = grad;
      g.fillRect(0, top, W, bot - top);
      for (let s = 0; s < 26; s++) {
        const yy = top + r() * (bot - top);
        g.fillStyle = r() < 0.5 ? 'rgba(255,255,255,' + (0.025 + r() * 0.05) + ')' : 'rgba(40,48,56,' + (0.025 + r() * 0.05) + ')';
        g.fillRect(0, yy, W, 1 + (r() < 0.2 ? 1 : 0));
      }
      const u = r() * W;
      g.fillStyle = 'rgba(70,78,88,0.45)';
      g.fillRect(u, top, 1.5, bot - top);
      g.fillStyle = 'rgba(255,255,255,0.12)';
      g.fillRect(u + 1.5, top, 1, bot - top);
    }
    cuts.slice(1, -1).forEach((s) => {
      const yy = rowOf(s);
      g.fillStyle = 'rgba(58,64,72,0.6)';
      g.fillRect(0, yy - 1, W, 1.5);
      g.fillStyle = 'rgba(255,255,255,0.16)';
      g.fillRect(0, yy + 0.5, W, 1);
    });
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = maxAniso;
    return t;
  }

  /** Hexagonal heat-shield tiles, seamless. One repeat covers 12 x 8.66 tile radii. */
  const TILE_S = 0.17; // m, tile circumradius (schematic; V3 tile size not published)
  const TILE_W = 12 * TILE_S, TILE_H = 5 * Math.sqrt(3) * TILE_S;
  function hexTexture(seed) {
    const W = 512, cols = 8, rows = 5, s = W / 12;
    const H = Math.round(rows * Math.sqrt(3) * s);
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#050607';
    g.fillRect(0, 0, W, H);
    const dx = W / cols, dy = H / rows, ky = dy / (Math.sqrt(3) * s);
    const r = rng(seed);
    const tone = [];
    for (let i = 0; i < cols * rows; i++) {
      const roll = r();
      tone.push(29 + (roll - 0.5) * 9);
    }
    for (let ci = -1; ci <= cols; ci++) {
      for (let ri = -1; ri <= rows; ri++) {
        const cx = ci * dx, cy = ri * dy + ((((ci % 2) + 2) % 2) ? dy / 2 : 0);
        const L = tone[((ci + cols) % cols) * rows + ((ri + rows) % rows)];
        const rr = s * 0.9;
        g.beginPath();
        for (let a = 0; a < 6; a++) {
          const ang = a * 60 * DEG;
          const x = cx + rr * Math.cos(ang), y = cy + rr * Math.sin(ang) * ky;
          if (a) g.lineTo(x, y); else g.moveTo(x, y);
        }
        g.closePath();
        g.fillStyle = 'rgb(' + (L | 0) + ',' + ((L + 3) | 0) + ',' + ((L + 7) | 0) + ')';
        g.fill();
        g.strokeStyle = 'rgba(255,255,255,0.03)';
        g.lineWidth = 1;
        g.stroke();
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = maxAniso;
    return t;
  }

  /** Blueprint floor grid with a radial fade and a warm floodlit pool at the center. */
  function floorTexture() {
    const N = 1024, span = 320; // meters covered
    const c = document.createElement('canvas');
    c.width = c.height = N;
    const g = c.getContext('2d');
    const pool = g.createRadialGradient(N / 2, N / 2, 0, N / 2, N / 2, N * 0.16);
    pool.addColorStop(0, 'rgba(255,196,130,0.16)');
    pool.addColorStop(1, 'rgba(255,196,130,0)');
    g.fillStyle = pool;
    g.fillRect(0, 0, N, N);
    const px = N / span;
    for (let m = -span / 2; m <= span / 2; m += 5) {
      const major = Math.abs(m % 25) < 0.01;
      g.fillStyle = major ? 'rgba(140,184,224,0.30)' : 'rgba(140,184,224,0.13)';
      const p = N / 2 + m * px;
      g.fillRect(p - 0.5, 0, major ? 1.5 : 1, N);
      g.fillRect(0, p - 0.5, N, major ? 1.5 : 1);
    }
    g.strokeStyle = 'rgba(140,184,224,0.35)';
    g.lineWidth = 1;
    g.beginPath();
    g.arc(N / 2, N / 2, (R + 1.5) * px, 0, Math.PI * 2);
    g.stroke();
    g.globalCompositeOperation = 'destination-in';
    const fade = g.createRadialGradient(N / 2, N / 2, N * 0.05, N / 2, N / 2, N * 0.5);
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(0.55, 'rgba(0,0,0,0.55)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = fade;
    g.fillRect(0, 0, N, N);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = maxAniso;
    return { tex: t, span };
  }

  /* ------------------------------------------------------------------ geometry builders */

  function lathe(pts, seg, phiStart, phiLen) {
    const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(Math.max(0, r), y)), seg || 96,
      phiStart || 0, phiLen == null ? Math.PI * 2 : phiLen);
    const n = g.attributes.normal;
    for (let i = 0; i < n.count; i++) {
      const x = n.getX(i), y = n.getY(i), z = n.getZ(i);
      if (!isFinite(x) || !isFinite(y) || !isFinite(z) || (x === 0 && y === 0 && z === 0)) n.setXYZ(i, 0, 1, 0);
    }
    return g;
  }
  function uvByY(geo, y0, y1) {
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setY(i, (p.getY(i) - y0) / (y1 - y0));
    uv.needsUpdate = true;
    return geo;
  }
  /** Thick-walled cylinder shell (outer radius ro, wall t). Closed, so a clipped cut reads as a solid wall. */
  function tubeShellPts(y0, y1, ro, t) {
    return [[ro, y0], [ro, y1], [ro, y1], [ro - t, y1], [ro - t, y1], [ro - t, y0], [ro - t, y0], [ro, y0 + 1e-4]];
  }
  /** Thick dome shell. r0 > 0 leaves a center hole (for a pipe passing through). */
  function domeShellPts(eq, depth, rr, t, dir, r0, n) {
    n = n || 14;
    const a0 = Math.asin(SX.clamp((r0 || 0) / rr, 0, 1));
    const lower = [], upper = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + (Math.PI / 2 - a0) * (i / n);
      const r = rr * Math.sin(a);
      const y = eq + dir * depth * Math.cos(a);
      lower.push([r, y]);
      upper.push([r, y + t]);
    }
    const pts = lower.slice();
    pts.push([rr, eq], [rr, eq + t], [rr, eq + t]);
    for (let i = upper.length - 2; i >= 0; i--) pts.push(upper[i]);
    if (r0 > 0) pts.push(upper[0].slice(), [lower[0][0], lower[0][1] + 1e-4]);
    return pts;
  }
  /** Liquid volume between floor(r) and min(level, ceil(r)) for r in [r0, r1]. Returns a closed profile or null. */
  function liquidPts(r0, r1, floorFn, ceilFn, level, n) {
    n = n || 12;
    const rs = [];
    for (let i = 0; i <= n; i++) { const k = i / n; rs.push(r0 + (r1 - r0) * Math.sin(k * Math.PI / 2)); }
    const top = (r) => Math.max(floorFn(r), Math.min(level, ceilFn(r)));
    if (!rs.some((r) => top(r) - floorFn(r) > 0.02)) return null;
    const pts = rs.map((r) => [r, floorFn(r)]);
    if (top(r1) - floorFn(r1) > 1e-3) pts.push([r1, floorFn(r1)], [r1, top(r1)], [r1, top(r1)]);
    for (let i = rs.length - 2; i >= 0; i--) {
      const r = rs[i], y = top(r), q = pts[pts.length - 1];
      if (Math.abs(q[1] - y) < 1e-5 && Math.abs(q[0] - r) < 1e-5) continue;
      pts.push([r, y]);
    }
    if (r0 > 0 && top(r0) - floorFn(r0) > 1e-3) pts.push([r0, top(r0)], [r0, floorFn(r0) + 1e-4]);
    return pts;
  }

  /** Raptor bell profile [r, y] from nozzle exit (y = 0) to the gimbal (y = h). Simplified outline. */
  function bellPts(h, re, vac) {
    const pts = [];
    const rt = vac ? 0.14 : 0.15;
    const yt = vac ? h * 0.705 : h * 0.54;
    const n = vac ? 12 : 9;
    for (let i = 0; i <= n; i++) {
      const s = i / n;
      pts.push([rt + (re - rt) * (1 - Math.pow(s, vac ? 1.9 : 1.65)), s * yt]); // bell: walls near-parallel at the exit, flaring hard off the throat
    }
    const c = yt;
    [[0.2, c + 0.07], [0.265, c + 0.16], [0.275, c + 0.22], [0.275, c + 0.56], [0.33, c + 0.62], [0.43, c + 0.72],
      [0.44, c + 1.0], [0.36, c + 1.1], [0.2, c + 1.2], [0.12, c + 1.3]].forEach((p) => pts.push(p));
    for (let i = 1; i < pts.length; i++) if (pts[i][1] <= pts[i - 1][1]) pts[i][1] = pts[i - 1][1] + 0.01;
    // squeeze the powerhead so the whole engine is exactly h tall
    const top = pts[pts.length - 1][1];
    return pts.map(([r, y]) => [r, y <= yt ? y : yt + (y - yt) * ((h - yt) / (top - yt))]);
  }
  /** Vertex colors down a bell: bright steel at the exit, heat-tinted copper toward the throat, dark powerhead. */
  function tintBell(geo, h, vac) {
    const p = geo.attributes.position;
    const cols = new Float32Array(p.count * 3);
    const steel = new THREE.Color(0.6, 0.63, 0.67), copper = col('--copper', '#c9794b'), dark = new THREE.Color(0.34, 0.35, 0.37);
    const tmp = new THREE.Color();
    const yt = vac ? h * 0.705 : h * 0.54;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      if (y <= yt + 1e-3) tmp.copy(steel).lerp(copper, Math.pow(y / yt, 2.4) * 0.38);
      else tmp.copy(dark);
      cols[i * 3] = tmp.r; cols[i * 3 + 1] = tmp.g; cols[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    return geo;
  }

  /** Lattice grid fin: a frame with rectangular cells, extruded. Shape X = radial span, Y = tangential width.
      After rotation the extrusion depth is vertical, so air flows through the cells along the booster axis. */
  function gridFinGeo(span, width, depth, nx, ny, frame, bar) {
    const s = new THREE.Shape();
    s.moveTo(0, -width / 2); s.lineTo(span, -width / 2); s.lineTo(span, width / 2); s.lineTo(0, width / 2); s.lineTo(0, -width / 2);
    const cw = (span - 2 * frame - (nx - 1) * bar) / nx, ch = (width - 2 * frame - (ny - 1) * bar) / ny;
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        const x0 = frame + i * (cw + bar), y0 = -width / 2 + frame + j * (ch + bar);
        const h = new THREE.Path();
        h.moveTo(x0, y0); h.lineTo(x0 + cw, y0); h.lineTo(x0 + cw, y0 + ch); h.lineTo(x0, y0 + ch); h.lineTo(x0, y0);
        s.holes.push(h);
      }
    }
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 1 });
    g.translate(0, 0, -depth / 2);
    g.rotateX(-Math.PI / 2);
    return g;
  }
  /** Flat panel from a side outline in (radial distance, y), extruded tangentially by thickness t. */
  function panelGeo(outline, t) {
    const s = new THREE.Shape();
    outline.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
    const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 2 });
    g.translate(0, 0, -t / 2);
    return g;
  }
  /** Rotate a radial panel so its local +X points outward at azimuth phi. */
  function atAzimuth(obj, phi) { obj.rotation.y = phi - Math.PI / 2; return obj; }
  /** Cylinder between two points (truss struts, pipes). */
  function strutGeo(a, b, r, seg) {
    const d = new THREE.Vector3().subVectors(b, a);
    const g = new THREE.CylinderGeometry(r, r, d.length(), seg || 8, 1, true);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()));
    const m = a.clone().add(b).multiplyScalar(0.5);
    g.translate(m.x, m.y, m.z);
    return g;
  }
  function merge(geos) {
    const list = geos.map((g) => {
      const n = g.index ? g.toNonIndexed() : g;
      ['uv2', 'color'].forEach((a) => { if (n.hasAttribute(a)) n.deleteAttribute(a); });
      if (!n.hasAttribute('uv')) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2));
      return n;
    });
    return THREE.BufferGeometryUtils.mergeBufferGeometries(list, false);
  }

  /** Heat-shield shell following the ship's outer profile, covering the windward half and wrapping
      further around the nose toward the tip. UVs are in tile repeats so hexagons keep their size. */
  function tileShellGeo(y0, y1, off, rows) {
    rows = rows || 40;
    const colsN = 64;
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= rows; i++) {
      const y = y0 + (y1 - y0) * (i / rows);
      const r = shipR(y) + off;
      const t = SX.clamp((y - SH.barrelTop) / SH.noseL, 0, 1);
      const k = SX.smooth(SX.clamp((t - 0.3) / 0.7, 0, 1));
      const half = Math.PI / 2 + (Math.PI / 2 - 0.02) * k;
      for (let j = 0; j <= colsN; j++) {
        const phi = WIND - half + 2 * half * (j / colsN);
        pos.push(r * Math.sin(phi), y, r * Math.cos(phi));
        uv.push(((phi - WIND) * Math.max(r, 0.3)) / TILE_W, y / TILE_H);
      }
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < colsN; j++) {
        const a = i * (colsN + 1) + j, b = a + 1, c = a + colsN + 1, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  /* ------------------------------------------------------------------ view setup */

  const CUT_OFF = 14;      // plane constant that keeps everything (the model is at most ~9 m from the axis)
  const CAMS = [['full', 'Full stack'], ['fins', 'Grid fins'], ['engines', 'Engines from below'], ['nose', 'Ship nose'], ['flaps', 'Flaps']];

  /** If an owner view has not registered a node this view models, add a minimal one so selection still works. */
  function ensureNodes() {
    const missing = [];
    PARTS.forEach(([id, parent, name, kind, line]) => {
      if (!SX.part(id)) { missing.push(id); SX.addParts({ id, parent, name, kind, summary: line }); }
    });
    if (missing.length) console.info('[stack3d] placeholder nodes until their owner views register them: ' + missing.join(', '));
  }

  function buildUI(mount) {
    const el = SX.el;
    const stageEl = el('div', { class: 's3-stage' });
    const modeBtns = {};
    const seg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Model view' },
      [['assembled', 'Assembled'], ['exploded', 'Exploded'], ['section', 'Section']].map(([m, t]) =>
        (modeBtns[m] = el('button', { type: 'button', 'aria-pressed': String(m === 'assembled'), 'data-mode': m }, t))));
    const lblBtn = el('button', { type: 'button', class: 'btn btn-sm', 'aria-pressed': 'false' }, 'Labels');
    const personBtn = el('button', { type: 'button', class: 'btn btn-sm', 'aria-pressed': 'false' }, 'Person for scale');

    const range = el('input', { type: 'range', min: '0', max: '100', step: '1', value: '100', id: 's3-prop', 'aria-describedby': 's3-prop-note' });
    const out = el('output', { for: 's3-prop' }, '100%');
    const sw = (v, t) => el('span', null, el('i', { style: { background: 'var(' + v + ')' } }), t);
    const prop = el('div', { class: 's3-prop range-row', hidden: true }, el('label', { for: 's3-prop' }, 'Propellant'), range, out);
    const legend = el('div', { class: 's3-legend', id: 's3-prop-note' }, sw('--lox', 'Liquid oxygen'), sw('--ch4', 'Liquid methane'), sw('--steel', 'Cut steel'));

    const camBtns = {};
    const cams = el('div', { class: 's3-cams', role: 'group', 'aria-label': 'Camera views' },
      el('span', { class: 'eyebrow', 'aria-hidden': 'true' }, 'View'),
      CAMS.map(([k, label]) => (camBtns[k] = el('button', { type: 'button', class: 'chip', 'data-cam': k }, label))));
    const jump = el('select', { class: 's3-jump', 'aria-label': 'Jump to a part of the stack' });
    const note = el('div', { class: 's3-note' });
    const top = el('div', { class: 'viz-toolbar s3-top' }, seg, prop, el('div', { class: 's3-toggles' }, lblBtn, personBtn));
    const bottom = el('div', { class: 's3-bottom' }, el('div', { class: 's3-row' }, cams, jump), note);
    const tag = el('div', { class: 's3-section-tag' }, el('span', { 'aria-hidden': 'true', html: 'Section A-A<small>Front half removed</small>' }), legend);
    const status = el('div', { class: 's3-status', role: 'status', 'aria-live': 'polite' });
    const viz = el('div', { class: 'viz s3-viz' }, stageEl, top, tag, bottom, status);
    mount.appendChild(viz);
    return { viz, stageEl, top, bottom, modeBtns, lblBtn, personBtn, range, out, prop, camBtns, jump, note, tag, status };
  }

  function fillJump(ui) {
    const el = SX.el;
    ui.jump.innerHTML = '';
    ui.jump.appendChild(el('option', { value: '' }, 'Jump to a part'));
    const grp = (label, ids) => el('optgroup', { label }, ids.map((id) => el('option', { value: id }, partName(id))));
    ui.jump.appendChild(grp('Vehicle', ['stack', 'booster', 'ship']));
    ui.jump.appendChild(grp('Super Heavy', PARTS.filter((p) => p[1] === 'booster').map((p) => p[0])));
    ui.jump.appendChild(grp('Starship', PARTS.filter((p) => p[1] === 'ship').map((p) => p[0])));
  }

  function init(mount) {
    THREE = window.THREE;
    if (!THREE) throw new Error('three.js is not available');
    if (SX.coarse) mount.classList.add('s3-coarse');
    ensureNodes();
    const ui = buildUI(mount);
    const st = SX.three.stage(ui.stageEl, { fov: 30, near: 0.5, far: 4000, position: [160, 66, 205], target: [0, 60, 0], minDistance: 6, maxDistance: 760, exposure: 1.05 });
    maxAniso = Math.min(8, st.renderer.capabilities.getMaxAnisotropy() || 4);
    S = {
      st, ui, mount, mode: 'assembled', ex: 0, exTarget: 0, cut: 0, cutTarget: 0, fill: 1,
      labelsOn: false, person: false, selected: SX.selected, hover: null, pulse: null, hl: new Map(),
      turntable: !SX.reducedMotion, parts: new Map(), sectionOnly: [], liquids: [], labels: [], dims: [],
      plane: new THREE.Plane(new THREE.Vector3(0, 0, -1), CUT_OFF), groups: {}, limitTimer: 0, vo: 0,
    };
    S.cutSteel = col('--steel', '#c6cfd7');
    buildScene();
    buildLabels();
    wireUI();
    fillJump(ui);
    SX.on('parts', () => { if (S) fillJump(S.ui); });
    S.focus = focusPart;
    if (SX.debug) SX.debug.stack3d = () => S; // headless verification hook
    setLabels(mount.clientWidth >= 500);
    applyCamera('full', { instant: true });
    st.controls.autoRotate = S.turntable;
    st.controls.autoRotateSpeed = 0.55;
    st.controls.addEventListener('start', stopTurntable);
    st.canvas.addEventListener('wheel', stopTurntable, { passive: true });
    st.onFrame(frame);
    SX.on('select', (id) => { if (!S) return; S.selected = id; refreshHighlights(); });
    SX.on('units', () => { if (S) refreshLabelText(); });
    refreshNote();
  }

  function stopTurntable() {
    if (!S || !S.turntable) return;
    S.turntable = false;
    S.st.controls.autoRotate = false;
  }

  /* ------------------------------------------------------------------ materials + registration */

  function M(opts, clip) {
    const o = Object.assign({ color: 0xffffff, metalness: 0.85, roughness: 0.32 }, opts || {});
    // the core RoomEnvironment is bright: metals keep most of it (that is what makes steel read), dielectrics very little
    if (o.envMapIntensity == null) o.envMapIntensity = o.metalness >= 0.5 ? 0.3 : 0.14;
    const m = new THREE.MeshStandardMaterial(o);
    if (clip !== false) m.clippingPlanes = [S.plane];
    return m;
  }
  function flatBack(color) {
    const m = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, toneMapped: false });
    m.clippingPlanes = [S.plane];
    return m;
  }
  function reg(obj, id) {
    SX.three.tag(obj, id);
    let a = S.parts.get(id);
    if (!a) S.parts.set(id, (a = []));
    a.push(obj);
    return obj;
  }
  /** Add a mesh for part id. o.solid adds a BackSide twin in a flat section color so the cut reads as solid;
      o.interior hides the mesh outside Section mode. */
  function add(parent, geo, mat, id, o) {
    o = o || {};
    const m = new THREE.Mesh(geo, mat);
    if (o.pos) m.position.copy(o.pos);
    if (o.rotY != null) m.rotation.y = o.rotY;
    parent.add(m);
    reg(m, id);
    if (o.interior) { m.visible = false; S.sectionOnly.push(m); }
    if (o.solid) {
      const b = new THREE.Mesh(geo, flatBack(o.cut || S.cutSteel));
      b.position.copy(m.position);
      b.rotation.copy(m.rotation);
      b.visible = false;
      parent.add(b);
      reg(b, id);
      S.sectionOnly.push(b);
    }
    return m;
  }
  /** A propellant volume whose profile is rebuilt from the fill fraction. */
  function liquid(parent, id, kind, build, pos) {
    const c = col(kind === 'lox' ? '--lox' : '--ch4', kind === 'lox' ? '#45b6ff' : '#ff8f3a');
    const front = M({ color: c, emissive: c, emissiveIntensity: 0.28, metalness: 0.0, roughness: 0.22 });
    const back = flatBack(c.clone().multiplyScalar(0.82));
    const L = { id, build, front: new THREE.Mesh(new THREE.BufferGeometry(), front), back: new THREE.Mesh(new THREE.BufferGeometry(), back) };
    [L.front, L.back].forEach((m) => {
      if (pos) m.position.copy(pos);
      m.visible = false;
      parent.add(m);
      reg(m, id);
      S.sectionOnly.push(m);
    });
    S.liquids.push(L);
    return L;
  }
  function updateLiquids() {
    S.liquids.forEach((L) => {
      const pts = L.build(S.fill);
      const old = L.front.geometry;
      const geo = pts ? lathe(pts, 64) : new THREE.BufferGeometry();
      L.front.geometry = geo;
      L.back.geometry = geo;
      L.front.userData.empty = L.back.userData.empty = !pts;
      old.dispose();
    });
    setSectionVisible(S.cut > 0.02);
  }
  function setSectionVisible(v) {
    S.sectionOnly.forEach((m) => { m.visible = v && !m.userData.empty; });
  }

  /* ------------------------------------------------------------------ scene */

  function ringSeams(y0, yTop) {
    const out = [];
    for (let y = yTop - RING; y > y0 + 0.3; y -= RING) out.push(y);
    return out;
  }

  function buildScene() {
    const { scene } = S.st;
    const root = (S.root = new THREE.Group());
    scene.add(root);
    const booster = new THREE.Group(), ship = new THREE.Group();
    ship.position.y = HB;
    root.add(booster, ship);
    ['bEng', 'bCore', 'hsr'].forEach((k) => booster.add((S.groups[k] = new THREE.Group())));
    ['sEng', 'sBody', 'sNose'].forEach((k) => ship.add((S.groups[k] = new THREE.Group())));
    S.hexTex = hexTexture(7);
    buildBooster();
    buildShip();
    buildEnvironment();
    updateLiquids();
    S.st.pick([root], { onClick, onHover });
    onHover.move = (hit, ev) => { if (hit && ev) SX.tip.show(tipHTML(hit.id), ev.clientX, ev.clientY); };
  }

  /* ---------- Super Heavy */

  function buildBooster() {
    const g = S.groups;
    const tex = steelTexture(B.skirt, HB, ringSeams(B.skirt, B.barrelTop), 11, [166, 174, 182]);
    const skin = (y0, y1, id) => add(g.bCore, uvByY(lathe(tubeShellPts(y0, y1, R, TW), 96), B.skirt, HB), M({ map: tex }), id, { solid: true });
    skin(B.skirt, B.aftEq, 'booster.thrustSection');
    skin(B.aftEq, B.comEq, 'booster.loxTank');
    skin(B.comEq, B.barrelTop, 'booster.ch4Tank');

    const domeMat = () => M({ color: 0xb0b8c0, roughness: 0.38, metalness: 0.8 });
    add(g.bCore, lathe(domeShellPts(B.aftEq, B.aftD, RI, TW, -1, B.tubeR), 64), domeMat(), 'booster.loxTank', { solid: true, interior: true });
    add(g.bCore, lathe(domeShellPts(B.comEq, B.comD, RI, TW, -1, B.tubeR - TW), 64), domeMat(), 'booster.commonDome', { solid: true, interior: true });
    // forward dome: the surface the ship's engines fire at during hot staging (darker: non-structural steel shield layer)
    add(g.bCore, lathe(domeShellPts(B.fwdEq, B.fwdD, RI, TW * 1.6, 1, 0), 64), M({ color: 0x858d95, roughness: 0.5, metalness: 0.78 }), 'booster.hsr', { solid: true });

    // methane transfer tube (3 m wide per NSF), from the aft manifold up to the common dome
    const tubeTop = B.comEq - B.comD + 0.06;
    add(g.bCore, lathe(tubeShellPts(B.tubeBot, tubeTop, B.tubeR, TW), 64), M({ color: 0xc4cbd2, roughness: 0.28 }), 'booster.downcomer', { solid: true, interior: true });
    // thrust plate (tapered steel plate carrying the engines)
    const tp = [[0.25, 2.95], [RI, 3.3], [RI, 3.3], [RI, 3.52], [RI, 3.52], [0.25, 3.17], [0.25, 3.17], [0.25, 2.9501]];
    add(g.bCore, lathe(tp, 96), M({ color: 0x7a828a, roughness: 0.45 }), 'booster.thrustSection', { solid: true, interior: true });

    // LOX landing tank (V3). Placement and size are not published: drawn as a capsule low in the LOX tank.
    const cap = capsulePts(B.landR, B.landY0, B.landY1, 0.07);
    add(g.bCore, lathe(cap, 48), M({ color: 0xd0d6dc, roughness: 0.3 }), 'booster.landingTank', { solid: true, interior: true, pos: new THREE.Vector3(B.landX, 0, 0) });

    // propellant volumes (height-linear fill)
    const aftTop = (r) => domeY(B.aftEq, B.aftD, RI, -1, r) + TW + 0.04;
    const comBot = (r) => domeY(B.comEq, B.comD, RI, -1, r) - 0.04;
    const comTop = (r) => domeY(B.comEq, B.comD, RI, -1, r) + TW + 0.04;
    const fwdBot = (r) => domeY(B.fwdEq, B.fwdD, RI, 1, r) - 0.04;
    liquid(g.bCore, 'booster.loxTank', 'lox', (f) => liquidPts(B.tubeR + 0.01, RI - 0.08, aftTop, comBot, SX.lerp(aftTop(B.tubeR), B.comEq, f)));
    liquid(g.bCore, 'booster.ch4Tank', 'ch4', (f) => liquidPts(0, RI - 0.08, comTop, fwdBot, SX.lerp(comTop(0), B.fwdEq, f)));
    const ti = B.tubeR - TW - 0.01;
    liquid(g.bCore, 'booster.downcomer', 'ch4', (f) => (f > 0.01 ? [[0, B.tubeBot + 0.05], [ti, B.tubeBot + 0.05], [ti, B.tubeBot + 0.05], [ti, tubeTop], [ti, tubeTop], [0, tubeTop]] : null));
    const lri = B.landR - 0.07, lyb = B.landY0 + B.landR, lyt = B.landY1 - B.landR;
    const lrl = lri - 0.04;
    liquid(g.bCore, 'booster.landingTank', 'lox', (f) => liquidPts(0, lrl,
      (r) => lyb - Math.sqrt(Math.max(0, lrl * lrl - r * r)), (r) => lyt + Math.sqrt(Math.max(0, lrl * lrl - r * r)),
      SX.lerp(lyb - lrl, lyt + lrl, f)), new THREE.Vector3(B.landX, 0, 0));

    // engine shielding: metallic plate between the engines at the skirt bottom, one hole per engine
    const sh = new THREE.Shape();
    sh.absarc(0, 0, R - 0.03, 0, Math.PI * 2, false);
    const layout = boosterEngineLayout();
    layout.all.forEach((e) => { const h = new THREE.Path(); h.absarc(e.x, -e.z, e.ring === 'outer' ? 0.48 : 0.55, 0, Math.PI * 2, true); sh.holes.push(h); });
    const shieldGeo = new THREE.ExtrudeGeometry(sh, { depth: 0.14, bevelEnabled: false, curveSegments: 20 });
    shieldGeo.rotateX(-Math.PI / 2);
    shieldGeo.translate(0, B.skirt - 0.02, 0);
    add(g.bCore, shieldGeo, M({ color: 0x59616a, metalness: 0.7, roughness: 0.5 }), 'booster.engineShield');

    // 33 Raptor 3 engines in three rings (InstancedMesh per ring)
    const bell = tintBell(lathe(bellPts(ENG.h, ENG.re, false), 20), ENG.h, false);
    bell.userData.inner = nozzleInner(ENG.h, ENG.re, false, 16);
    const spacing = (2 * Math.PI * layout.outer[0].r) / layout.outer.length;
    const reOuter = Math.min(ENG.re, spacing / 2 - 0.02);
    const bellOuter = tintBell(lathe(bellPts(ENG.h, reOuter, false), 20), ENG.h, false);
    bellOuter.userData.inner = nozzleInner(ENG.h, reOuter, false, 16);
    engineRing(g.bEng, 'booster.enginesCenter', bell, layout.center, 0);
    engineRing(g.bEng, 'booster.enginesInner', bell, layout.inner, 0);
    engineRing(g.bEng, 'booster.enginesOuter', bellOuter, layout.outer, 0);

    // chines: two taller and closer together on the raceway side, two shorter and farther apart opposite (V3, per NSF)
    const chineMat = M({ color: 0x8e969e, roughness: 0.4 });
    const chineGrp = reg(new THREE.Group(), 'booster.chines');
    g.bCore.add(chineGrp);
    [[28, 33.2], [-28, 33.2], [125, 23.4], [235, 23.4]].forEach(([deg, y1]) => {
      const y0 = B.skirt + 1.0;
      const geo = panelGeo([[R - 0.1, y0], [R + 0.7, y0 + 1.4], [R + 0.7, y1 - 3.6], [R - 0.1, y1]], 1.05);
      const m = new THREE.Mesh(geo, chineMat);
      atAzimuth(m, deg * DEG);
      chineGrp.add(m);
      SX.three.tag(m, 'booster.chines');
    });
    // raceway: external conduit from the upper tank down into the taller chine (about halfway down on V3)
    const rw = new THREE.Mesh(new THREE.BoxGeometry(0.34, B.finY - 2 - 33.2, 0.6), M({ color: 0x9aa2aa, roughness: 0.4 }));
    rw.position.copy(polar(28 * DEG, R + 0.14, (33.2 + B.finY - 2) / 2));
    rw.rotation.y = 28 * DEG;
    g.bCore.add(rw);
    reg(rw, 'booster');

    // grid fins: T layout, the two opposite fins carry the catch points, the third is the rudder fin.
    // Exempt from the section cut so the catch fins (which sit on the cut plane) stay whole.
    const finGeo = gridFinGeo(3.6, 4.8, 0.85, 8, 10, 0.13, 0.055);
    const finMat = M({ color: 0x69727a, metalness: 0.8, roughness: 0.55 }, false);
    const rootMat = M({ color: 0x7f8891, metalness: 0.8, roughness: 0.45 }, false);
    const fins = reg(new THREE.Group(), 'booster.gridfins');
    g.bCore.add(fins);
    const catchGrp = reg(new THREE.Group(), 'booster.catch');
    g.bCore.add(catchGrp);
    [90, 270, 180].forEach((deg, i) => {
      const phi = deg * DEG;
      const f = new THREE.Mesh(finGeo, finMat);
      f.position.copy(polar(phi, R + 0.5, B.finY));
      atAzimuth(f, phi);
      fins.add(f);
      SX.three.tag(f, 'booster.gridfins');
      const root = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 1.7), rootMat);
      root.position.copy(polar(phi, R + 0.25, B.finY));
      atAzimuth(root, phi);
      fins.add(root);
      SX.three.tag(root, 'booster.gridfins');
      if (i < 2) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 1.3), M({ color: 0x6d757e, metalness: 0.8, roughness: 0.5 }, false));
        c.position.copy(polar(phi, R + 1.0, B.finY + 0.7));
        atAzimuth(c, phi);
        catchGrp.add(c);
        SX.three.tag(c, 'booster.catch');
      }
    });

    // integrated hot stage: an open Warren truss between two rings, the forward dome visible inside
    const hsrMat = M({ color: 0xa1a9b1, roughness: 0.4, metalness: 0.82 });
    const t0 = B.barrelTop, t1 = HB - 0.42;
    add(g.hsr, lathe(tubeShellPts(t0, t0 + 0.45, R, 0.2), 128), hsrMat, 'booster.hsr', { solid: true });
    add(g.hsr, lathe(tubeShellPts(t1, HB, R, 0.24), 128), hsrMat, 'booster.hsr', { solid: true });
    const struts = [];
    const nodes = 64;
    for (let k = 0; k < nodes; k++) {
      const a = polar((k / nodes) * Math.PI * 2, R - 0.12, k % 2 ? t1 : t0 + 0.45);
      const b = polar(((k + 1) / nodes) * Math.PI * 2, R - 0.12, (k + 1) % 2 ? t1 : t0 + 0.45);
      struts.push(strutGeo(a, b, 0.12));
    }
    const strutMat = M({ color: 0xa1a9b1, roughness: 0.4, metalness: 0.82, side: THREE.DoubleSide });
    add(g.hsr, merge(struts), strutMat, 'booster.hsr');
    const latchMat = M({ color: 0x6f7780, roughness: 0.5, metalness: 0.8 });
    for (let k = 0; k < 6; k++) {
      const phi = (30 + 60 * k) * DEG;
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.9), latchMat);
      l.position.copy(polar(phi, R - 0.6, HB - 0.28));
      atAzimuth(l, phi);
      g.hsr.add(l);
      reg(l, 'booster.hsr');
    }
  }

  function capsulePts(r, y0, y1, t) {
    const pts = [], n = 8;
    const yb = y0 + r, yt = y1 - r, ri = r - t;
    for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (i / n) * (Math.PI / 2); pts.push([r * Math.cos(a), yb + r * Math.sin(a)]); }
    for (let i = 0; i <= n; i++) { const a = (i / n) * (Math.PI / 2); pts.push([r * Math.cos(a), yt + r * Math.sin(a)]); }
    for (let i = n; i >= 0; i--) { const a = (i / n) * (Math.PI / 2); pts.push([ri * Math.cos(a), yt + ri * Math.sin(a)]); }
    for (let i = n; i >= 0; i--) { const a = -Math.PI / 2 + (i / n) * (Math.PI / 2); pts.push([ri * Math.cos(a), yb + ri * Math.sin(a)]); }
    return pts.filter((p, i) => i === 0 || Math.abs(p[0] - pts[i - 1][0]) > 1e-6 || Math.abs(p[1] - pts[i - 1][1]) > 1e-6);
  }

  /** Booster engine positions: center 3 clocked 108/108/144 deg (NSF), inner ring 10, outer ring 20 (SpaceX). */
  function boosterEngineLayout() {
    const nC = SX.val('booster.enginesCenter', 3), nI = SX.val('booster.enginesInner', 10), nO = SX.val('booster.enginesOuter', 20);
    const center = [0, 108, 216].slice(0, nC).map((a) => ({ phi: (a + 18) * DEG, r: 0.95 }));
    const inner = Array.from({ length: nI }, (v, i) => ({ phi: (i * 360 / nI + 18) * DEG, r: 2.45 }));
    const outer = Array.from({ length: nO }, (v, i) => ({ phi: (i * 360 / nO + 9) * DEG, r: 3.95 }));
    const fin = (arr, ring) => arr.map((e) => Object.assign(e, { ring, x: e.r * Math.sin(e.phi), z: e.r * Math.cos(e.phi) }));
    fin(center, 'center'); fin(inner, 'inner'); fin(outer, 'outer');
    return { center, inner, outer, all: center.concat(inner, outer) };
  }

  /** Nozzle interior only (exit to throat), for the dark BackSide pass. */
  function nozzleInner(h, re, vac, seg) {
    const yt = vac ? h * 0.705 : h * 0.54;
    return lathe(bellPts(h, re, vac).filter((p) => p[1] <= yt + 1e-3), seg);
  }
  /** One ring of engines: outer bell (vertex-tinted steel) plus a dark BackSide nozzle interior, both instanced. */
  function engineRing(parent, id, geo, list, y, clip) {
    const grp = reg(new THREE.Group(), id);
    parent.add(grp);
    const outer = new THREE.InstancedMesh(geo, M({ vertexColors: true, metalness: 0.72, roughness: 0.34 }, clip), list.length);
    const inner = new THREE.InstancedMesh(geo.userData.inner || geo, M({ color: 0x17191c, metalness: 0.35, roughness: 0.85, side: THREE.BackSide }, clip), list.length);
    const m4 = new THREE.Matrix4();
    list.forEach((e, i) => {
      m4.makeTranslation(e.x, y, e.z);
      outer.setMatrixAt(i, m4);
      inner.setMatrixAt(i, m4);
    });
    [outer, inner].forEach((m) => { m.frustumCulled = false; SX.three.tag(m, id); grp.add(m); });
    return grp;
  }

  /* ---------- Starship (coordinates are ship-relative: y = 0 at the base of the engine skirt) */

  /** Offset an upward-running [r, y] profile inward along its normal by t (r clamped at the axis). */
  function insetProfile(pts, t) {
    return pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const tx = b[0] - a[0], ty = b[1] - a[1];
      const L = Math.hypot(tx, ty) || 1;
      return [Math.max(0, p[0] - (ty / L) * t), p[1] + (tx / L) * t];
    });
  }
  /** Height where the nose's inner wall has radius r (bisection; the nose narrows monotonically). */
  function noseInnerY(r) {
    let lo = SH.barrelTop, hi = HS;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (noseR(m) - TW > r) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  function buildShip() {
    const g = S.groups;
    const bt = SH.barrelTop;
    const tex = steelTexture(0, bt, ringSeams(0, bt), 23, [166, 174, 182]);
    const skin = (y0, y1, id) => add(g.sBody, uvByY(lathe(tubeShellPts(y0, y1, R, TW), 96), 0, bt), M({ map: tex }), id, { solid: true });
    skin(0, SH.aftEq, 'ship.engineBay');
    skin(SH.aftEq, SH.comEq, 'ship.loxTank');
    skin(SH.comEq, SH.fwdEq, 'ship.ch4Tank');
    skin(SH.fwdEq, bt, 'ship.payloadBay');

    // nosecone: blunted ogive, thick shell
    const noseTex = steelTexture(bt, HS, [bt + 4.6, bt + 9.2], 29, [168, 175, 183]);
    const outer = [];
    for (let i = 0; i <= 30; i++) { const y = bt + (HS - bt) * Math.sin((i / 30) * Math.PI / 2); outer.push([noseR(y), y]); }
    const inner = insetProfile(outer, TW).reverse();
    const nosePts = outer.concat(inner, [inner[inner.length - 1].slice(), [R, bt + 1e-4]]);
    add(g.sNose, uvByY(lathe(nosePts, 96), bt, HS), M({ map: noseTex }), 'ship.nose', { solid: true });

    // domes: common dome bulges down (methane drains to the central downcomer), forward e-dome bulges up
    const domeMat = () => M({ color: 0xb0b8c0, roughness: 0.38, metalness: 0.8 });
    add(g.sBody, lathe(domeShellPts(SH.aftEq, SH.aftD, RI, TW, -1, SH.dcR), 64), domeMat(), 'ship.loxTank', { solid: true, interior: true });
    add(g.sBody, lathe(domeShellPts(SH.comEq, SH.comD, RI, TW, -1, SH.dcR - 0.08), 64), domeMat(), 'ship.commonDome', { solid: true, interior: true });
    add(g.sBody, lathe(domeShellPts(SH.fwdEq, SH.fwdD, RI, TW, 1, 0), 64), domeMat(), 'ship.ch4Tank', { solid: true, interior: true });
    const dcTop = SH.comEq - SH.comD + 0.06;
    add(g.sBody, lathe(tubeShellPts(3.45, dcTop, SH.dcR, 0.08), 32), M({ color: 0xc4cbd2, roughness: 0.3 }), 'ship.ch4Tank', { solid: true, interior: true });
    // thrust puck under the aft dome, where the sea-level engines mount
    const puck = [[0, 3.15], [1.9, 3.15], [1.9, 3.15], [1.9, 3.5], [1.9, 3.5], [0, 3.5]];
    add(g.sBody, lathe(puck, 48), M({ color: 0x7a828a, roughness: 0.45 }), 'ship.engineBay', { solid: true, interior: true });

    // propellant
    const aftTop = (r) => domeY(SH.aftEq, SH.aftD, RI, -1, r) + TW + 0.04;
    const comBot = (r) => domeY(SH.comEq, SH.comD, RI, -1, r) - 0.04;
    const comTop = (r) => domeY(SH.comEq, SH.comD, RI, -1, r) + TW + 0.04;
    const fwdBot = (r) => domeY(SH.fwdEq, SH.fwdD, RI, 1, r) - 0.04;
    liquid(g.sBody, 'ship.loxTank', 'lox', (f) => liquidPts(SH.dcR + 0.01, RI - 0.08, aftTop, comBot, SX.lerp(aftTop(SH.dcR), SH.comEq, f)));
    liquid(g.sBody, 'ship.ch4Tank', 'ch4', (f) => liquidPts(0, RI - 0.08, comTop, fwdBot, SX.lerp(comTop(0), SH.fwdEq, f)));
    const di = SH.dcR - 0.09;
    liquid(g.sBody, 'ship.ch4Tank', 'ch4', (f) => (f > 0.01 ? [[0, 3.5], [di, 3.5], [di, 3.5], [di, dcTop], [di, dcTop], [0, dcTop]] : null));

    // header tanks in the nose: LOX header at the tip above a conical sump, methane header sphere below it
    const rim = noseR(SH.hdrLOXrim) - TW - 0.01, ct = 0.08;
    const cone = [[0, SH.hdrLOX0], [rim, SH.hdrLOXrim], [rim, SH.hdrLOXrim], [rim, SH.hdrLOXrim + ct], [rim, SH.hdrLOXrim + ct], [0, SH.hdrLOX0 + ct]];
    add(g.sNose, lathe(cone, 64), M({ color: 0xc9d0d6, roughness: 0.32 }), 'ship.headerLOX', { solid: true, interior: true });
    const coneTop = (r) => SH.hdrLOX0 + ct + 0.05 + (SH.hdrLOXrim - SH.hdrLOX0) * (r / rim);
    liquid(g.sNose, 'ship.headerLOX', 'lox', (f) => liquidPts(0, rim - 0.08, coneTop, (r) => noseInnerY(r + 0.05) - 0.03, SX.lerp(SH.hdrLOX0 + ct, HS - TW - 0.1, f), 18));
    const c = SH.hdrCH4c, rs = SH.hdrCH4r, ri = rs - 0.06;
    const sphere = [];
    for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI; sphere.push([rs * Math.sin(a), c - rs * Math.cos(a)]); }
    for (let i = 16; i >= 0; i--) { const a = (i / 16) * Math.PI; sphere.push([ri * Math.sin(a), c - ri * Math.cos(a) + (i === 0 ? 1e-4 : 0)]); }
    add(g.sNose, lathe(sphere, 64), M({ color: 0xc9d0d6, roughness: 0.32 }), 'ship.headerCH4', { solid: true, interior: true });
    const rl = ri - 0.04; // concentric: offset along the normal, not vertically, so the faceted surfaces never touch
    liquid(g.sNose, 'ship.headerCH4', 'ch4', (f) => liquidPts(0, rl, (r) => c - Math.sqrt(Math.max(0, rl * rl - r * r)),
      (r) => c + Math.sqrt(Math.max(0, rl * rl - r * r)), SX.lerp(c - rl, c + rl, f), 20));

    // vacuum-jacketed header feed lines from the nose down to the engines (drawn just behind the cut plane)
    const zL = -0.3;
    const line = (pts, id, tint) => {
      const m = M({ color: new THREE.Color(0xc2c9d0).lerp(col(tint), 0.45), roughness: 0.35, metalness: 0.6 });
      const part = (grp, arr) => {
        const geos = [];
        for (let i = 0; i < arr.length - 1; i++) geos.push(strutGeo(new THREE.Vector3(arr[i][0], arr[i][1], zL), new THREE.Vector3(arr[i + 1][0], arr[i + 1][1], zL), 0.13, 10));
        add(grp, merge(geos), m, id, { interior: true });
      };
      part(g.sNose, pts.filter((p) => p[1] >= bt));
      part(g.sBody, pts.filter((p) => p[1] <= bt));
    };
    line([[0.3, SH.hdrLOX0], [1.9, 48.6], [2.75, 45.2], [2.75, bt], [2.75, 3.6]], 'ship.headerLOX', '--lox');
    line([[0.25, c - rs + 0.02], [1.95, 44.4], [1.95, bt], [1.95, 3.6]], 'ship.headerCH4', '--ch4');

    // payload bay volume (ghosted) from the forward dome crown into the lower nosecone
    const py0 = SH.fwdEq + SH.fwdD + TW + 0.05, py1 = 41.6;
    const bayPts = [[0, py0]];
    for (let i = 0; i <= 16; i++) { const y = py0 + (py1 - py0) * (i / 16); bayPts.push([shipR(y) - 0.4, y]); }
    bayPts.push([0, py1]);
    const bayMat = new THREE.MeshBasicMaterial({ color: col('--steel', '#c6cfd7'), transparent: true, opacity: 0.07, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
    bayMat.clippingPlanes = [S.plane];
    add(g.sBody, lathe(bayPts, 64), bayMat, 'ship.payloadBay', { interior: true });
    const ringMat = new THREE.LineBasicMaterial({ color: col('--steel-2', '#8e9aa6'), transparent: true, opacity: 0.8, toneMapped: false });
    ringMat.clippingPlanes = [S.plane];
    [[py0, R - 0.4], [py1, shipR(py1) - 0.4]].forEach(([y, r]) => {
      const pts = [];
      for (let i = 0; i <= 96; i++) pts.push(polar((i / 96) * Math.PI * 2, r, y));
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat);
      l.visible = false;
      g.sBody.add(l);
      S.sectionOnly.push(l);
    });

    // payload (PEZ) door on the leeward side
    const span = 5.0 / R;
    add(g.sBody, lathe([[R + 0.02, SH.doorY0 - 0.14], [R + 0.02, SH.doorY1 + 0.14]], 24, LEE - span / 2 - 0.03, span + 0.06), M({ color: 0x77808a, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 }), 'ship.payloadBay');
    add(g.sBody, lathe([[R + 0.04, SH.doorY0], [R + 0.04, SH.doorY1]], 24, LEE - span / 2, span), M({ color: 0x161c23, metalness: 0.5, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }), 'ship.payloadBay');

    // docking drogues (4, leeward) and the split quick-disconnect plate between the aft pair
    const drogueGeo = merge([
      new THREE.TorusGeometry(0.34, 0.08, 8, 24).rotateY(Math.PI / 2),
      new THREE.CircleGeometry(0.3, 24).rotateY(Math.PI / 2).translate(-0.02, 0, 0),
    ]);
    const drogueMat = M({ color: 0x5f6770, metalness: 0.7, roughness: 0.45 });
    const ports = reg(new THREE.Group(), 'ship.transferPorts');
    g.sBody.add(ports);
    [[LEE - 52 * DEG, 35.6], [LEE + 52 * DEG, 35.6], [LEE - 20 * DEG, 4.4], [LEE + 20 * DEG, 4.4]].forEach(([phi, y]) => {
      const d = new THREE.Mesh(drogueGeo, drogueMat);
      d.position.copy(polar(phi, R + 0.08, y));
      atAzimuth(d, phi);
      ports.add(d);
      SX.three.tag(d, 'ship.transferPorts');
    });
    [[-5, '--lox'], [5, '--ch4']].forEach(([deg, tint]) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.2, 0.8), M({ color: new THREE.Color(0x6a727b).lerp(col(tint), 0.25), metalness: 0.7, roughness: 0.45 }));
      p.position.copy(polar(LEE + deg * DEG, R + 0.07, 4.4));
      atAzimuth(p, LEE + deg * DEG);
      ports.add(p);
      SX.three.tag(p, 'ship.transferPorts');
    });

    // attitude thrusters: payload-bay roll pairs, mid-body set, aft flap hinge thrusters
    const rcs = reg(new THREE.Group(), 'ship.rcs');
    g.sBody.add(rcs);
    const rcsMat = M({ color: 0x353b42, metalness: 0.45, roughness: 0.7 });
    [0, Math.PI].forEach((phi) => [35.0, 36.3, 24.6, 9.6].forEach((y) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.42), rcsMat);
      b.position.copy(polar(phi + (phi ? 7 : -7) * DEG, R + 0.14, y));
      atAzimuth(b, phi);
      rcs.add(b);
      SX.three.tag(b, 'ship.rcs');
    }));

    // catch points high on the nose (one each side)
    const pins = reg(new THREE.Group(), 'ship.catchPins');
    g.sNose.add(pins);
    [0, Math.PI].forEach((phi) => {
      const y = 40.6;
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.0, 0.85), M({ color: 0x3c434b, metalness: 0.45, roughness: 0.7 }));
      b.position.copy(polar(phi, noseR(y) + 0.2, y));
      atAzimuth(b, phi);
      pins.add(b);
      SX.three.tag(b, 'ship.catchPins');
    });

    // heat shield: hex-tile shell proud of the steel on the windward half, wrapping onto the nose
    // tiles sit 5.5 cm proud of the steel: polygon offset keeps them on top at long range
    const tileMat = () => M({ map: S.hexTex, color: 0x4d5560, metalness: 0.05, roughness: 0.7, envMapIntensity: 0.1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 });
    add(g.sBody, tileShellGeo(0.5, bt, 0.055, 4), tileMat(), 'ship.heatShield');
    add(g.sNose, tileShellGeo(bt, HS - 0.005, 0.055, 36), tileMat(), 'ship.heatShield');

    // flaps: tiled faces, steel edges. Aft pair at the windward/leeward boundary, forward pair swung leeward (about 140 deg apart)
    const flapTex = S.hexTex.clone();
    flapTex.needsUpdate = true;
    flapTex.repeat.set(1 / TILE_W, 1 / TILE_H);
    const flapMats = () => [M({ map: flapTex, color: 0x4d5560, metalness: 0.05, roughness: 0.7, envMapIntensity: 0.1 }), M({ color: 0x8f98a1, roughness: 0.4 })];
    const aftGeo = panelGeo([[R - 0.05, 1.2], [R + 2.7, 1.2], [R + 3.9, 2.5], [R + 3.9, 9.9], [R + 2.3, 12.0], [R - 0.05, 12.0]], 0.42);
    const aft = reg(new THREE.Group(), 'ship.flapsAft');
    g.sBody.add(aft);
    const am = flapMats();
    [0, Math.PI].forEach((phi) => { const m = new THREE.Mesh(aftGeo, am); atAzimuth(m, phi); aft.add(m); SX.three.tag(m, 'ship.flapsAft'); });
    const yA = 40.2, yB = 46.9;
    const fwdOutline = [[noseR(yA) - 0.05, yA], [noseR(yA) + 2.2, yA], [noseR(40.9) + 2.9, 40.9], [noseR(45.7) + 1.8, 45.9], [noseR(yB) + 0.35, yB]];
    for (let i = 0; i <= 8; i++) { const y = yB - (yB - yA) * (i / 8); fwdOutline.push([noseR(y) - 0.05, y]); }
    const fwdGeo = panelGeo(fwdOutline, 0.3);
    const fwd = reg(new THREE.Group(), 'ship.flapsFwd');
    g.sNose.add(fwd);
    const fm = flapMats();
    [LEE - 70 * DEG, LEE + 70 * DEG].forEach((phi) => { const m = new THREE.Mesh(fwdGeo, fm); atAzimuth(m, phi); fwd.add(m); SX.three.tag(m, 'ship.flapsFwd'); });

    // engines: 3 sea-level Raptor 3 at the center (gimbal), 3 Raptor Vacuum 3 around them (fixed, recessed into the LOX tank)
    const slBell = tintBell(lathe(bellPts(ENG.h, ENG.re, false), 24), ENG.h, false);
    slBell.userData.inner = nozzleInner(ENG.h, ENG.re, false, 20);
    const vacBell = tintBell(lathe(bellPts(RVAC.h, RVAC.re, true), 40), RVAC.h, true);
    vacBell.userData.inner = nozzleInner(RVAC.h, RVAC.re, true, 32);
    const at = (deg, r) => ({ phi: deg * DEG, r, x: r * Math.sin(deg * DEG), z: r * Math.cos(deg * DEG) });
    S.shipSL = [30, 150, 270].map((d) => at(d, 1.05));
    S.shipVac = [90, 210, 330].map((d) => at(d, 3.15));
    engineRing(g.sEng, 'ship.enginesSL', slBell, S.shipSL, 0.35);
    engineRing(g.sEng, 'ship.enginesVac', vacBell, S.shipVac, 0.05);
  }

  /* ---------- floor, lights, person, dimensions */

  function buildEnvironment() {
    const { scene } = S.st;
    const fl = floorTexture();
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(fl.span, fl.span).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: fl.tex, transparent: true, depthWrite: false, toneMapped: false }));
    floor.position.y = -0.03;
    floor.renderOrder = -2;
    scene.add(floor);
    // soft contact shadow
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const cg = c.getContext('2d');
    const rg = cg.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, 'rgba(0,0,0,0.55)'); rg.addColorStop(0.55, 'rgba(0,0,0,0.25)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    cg.fillStyle = rg;
    cg.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(16, 16).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    shadow.position.y = -0.02;
    shadow.renderOrder = -1;
    scene.add(shadow);

    // lighting: warm pad floodlights as key, a cool rim from behind, a soft sky/ground fill, a low warm uplight
    // The key sits well off the camera axis so the cylinder shades from lit to dark instead of glaring flat.
    const key = new THREE.DirectionalLight(0xffdcb4, 2.8);
    key.position.set(135, 55, -25);
    const rim = new THREE.DirectionalLight(0x8db8ff, 2.0);
    rim.position.set(-95, 45, -125);
    const fill = new THREE.DirectionalLight(0xc8d6e6, 0.22);
    fill.position.set(-40, 20, 110);
    const up = new THREE.DirectionalLight(0xffb57a, 0.7);
    up.position.set(40, -60, 60);
    const hemi = new THREE.HemisphereLight(0xa9c8ff, 0x2a1d12, 0.3);
    scene.add(key, rim, fill, up, hemi);

    // person for scale (1.8 m)
    const ph = SX.val('stack3d.personHeight', 1.8), k = ph / 1.8;
    const body = merge([
      new THREE.CapsuleGeometry(0.075, 0.72, 4, 8).translate(-0.1, 0.44, 0),
      new THREE.CapsuleGeometry(0.075, 0.72, 4, 8).translate(0.1, 0.44, 0),
      new THREE.CapsuleGeometry(0.17, 0.4, 4, 10).translate(0, 1.18, 0),
      new THREE.CapsuleGeometry(0.052, 0.56, 4, 8).translate(-0.27, 1.12, 0),
      new THREE.CapsuleGeometry(0.052, 0.56, 4, 8).translate(0.27, 1.12, 0),
      new THREE.SphereGeometry(0.112, 14, 10).translate(0, 1.686, 0),
    ]);
    body.scale(k, k, k);
    const person = new THREE.Mesh(body, new THREE.MeshStandardMaterial({ color: col('--fg', '#e3e9ef'), roughness: 0.7, metalness: 0, emissive: 0x303a44 }));
    person.position.copy(polar(38 * DEG, 7.4, 0));
    person.rotation.y = 38 * DEG;
    person.visible = false;
    scene.add(person);
    S.person3d = person;

    // dimension lines: one vertical line with ticks at 0, booster top and stack top, billboarded to the camera's left
    const dims = new THREE.Group();
    const x = -(R + 3.4), e0 = -(R + 0.9), e1 = x - 1.2, T = 0.6;
    const seg = [x, 0, 0, x, HB + HS, 0];
    [0, HB, HB + HS].forEach((y) => {
      seg.push(e0, y, 0, e1, y, 0);
      seg.push(x - T, y - T, 0, x + T, y + T, 0);
    });
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    const dm = new THREE.LineBasicMaterial({ color: col('--steel-2', '#8e9aa6'), transparent: true, opacity: 0.85, toneMapped: false });
    dims.add(new THREE.LineSegments(dg, dm));
    scene.add(dims);
    S.dims3d = dims;
    S.dimMat = dm;
    const mk = (y, key, name) => {
      const p = new THREE.Vector3(x, y, 0);
      const w = new THREE.Vector3();
      const L = S.st.label('', () => w.copy(p).applyMatrix4(dims.matrixWorld), { className: 's3-dim' });
      L.key = key; L.name = name;
      S.dims.push(L);
    };
    mk(HB / 2, 'booster.height', 'Super Heavy');
    mk(HB + HS / 2, 'ship.height', 'Starship');
    mk(HB + HS, 'stack.height', 'Full stack');
  }

  /* ------------------------------------------------------------------ labels (leader style) */

  function off(g) { return S.groups[g].position.y; }
  function camBasis() {
    const cam = S.st.camera;
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
    right.y = 0; right.normalize();
    const toward = new THREE.Vector3(cam.position.x, 0, cam.position.z);
    if (toward.lengthSq() < 1e-6) toward.set(0, 0, 1);
    toward.normalize();
    return { right, toward };
  }
  /** A point on the skin facing the camera, pushed toward one side (side +1 right, -1 left). */
  function skinAnchor(y, r, side) {
    const { right, toward } = camBasis();
    const d = toward.multiplyScalar(0.5).addScaledVector(right, 0.86 * (side || 1)).normalize();
    return new THREE.Vector3(d.x * r, y, d.z * r);
  }
  /** Of several candidate world points, the one that projects furthest right on screen. */
  function rightmost(pts) {
    const cam = S.st.camera;
    const { toward, right } = camBasis();
    let best = null, bx = -Infinity;
    // prefer candidates that can be seen (on the camera side, or sticking out past the silhouette), then the rightmost
    pts.forEach((p) => {
      const facing = (p.x * toward.x + p.z * toward.z) / (Math.hypot(p.x, p.z) || 1) > -0.2 || Math.abs(p.x * right.x + p.z * right.z) > R + 0.4;
      const x = p.clone().project(cam).x + (facing ? 10 : 0);
      if (x > bx) { bx = x; best = p; }
    });
    return best;
  }
  function factBit(key) {
    const f = SX.fact(key);
    if (!f) return '';
    return '<small>' + SX.esc(SX.fmt(key)) + '</small><i class="cd conf-' + SX.esc(f.conf || 'reported') + '"></i>';
  }

  /** Height at the middle of the liquid column at radius r (follows the Propellant slider). */
  function liquidMidY(floorEq, floorD, floorDir, ceilEq, ceilD, ceilDir, lo, hi, r) {
    const floor = domeY(floorEq, floorD, RI, floorDir, r) + TW;
    const ceil = domeY(ceilEq, ceilD, RI, ceilDir, r);
    const level = Math.min(ceil, SX.lerp(lo, hi, S.fill));
    return level > floor + 0.4 ? (floor + level) / 2 : floor + 0.2;
  }
  function buildLabels() {
    const defs = [
      // assembled: exterior anatomy, right-hand column
      { mode: 'assembled', id: 'ship.nose', name: 'Nosecone', at: () => skinAnchor(HB + 44 + off('sNose'), noseR(44) * 0.98, 1) },
      { mode: 'assembled', id: 'ship.flapsFwd', name: 'Forward flaps', at: () => rightmost([LEE - 70 * DEG, LEE + 70 * DEG].map((p) => polar(p, noseR(43.5) + 2.2, HB + 43.5 + off('sNose')))) },
      { mode: 'assembled', id: 'ship.heatShield', name: 'Heat shield', at: () => {
        const { toward } = camBasis();
        let a = Math.atan2(toward.x, toward.z) + 0.45;
        let d = Math.atan2(Math.sin(a - WIND), Math.cos(a - WIND));
        d = SX.clamp(d, -80 * DEG, 80 * DEG);
        return polar(WIND + d, R + 0.06, HB + 27 + off('sBody'));
      } },
      { mode: 'assembled', id: 'ship.flapsAft', name: 'Aft flaps', at: () => rightmost([0, Math.PI].map((p) => polar(p, R + 3.9, HB + 6.5 + off('sBody')))) },
      { mode: 'assembled', id: 'booster.hsr', name: 'Integrated hot stage', at: () => skinAnchor(HB - 1.6 + off('hsr'), R, 1) },
      { mode: 'assembled', id: 'booster.gridfins', name: 'Grid fins', fact: 'booster.gridFins', at: () => rightmost([90, 270, 180].map((d) => polar(d * DEG, R + 3.9, B.finY + off('bCore')))) },
      { mode: 'assembled', id: 'booster.chines', name: 'Chines', at: () => rightmost([28, -28, 125, 235].map((d) => polar(d * DEG, R + 0.7, 17 + off('bCore')))) },
      { mode: 'assembled', id: 'booster.enginesOuter', name: 'Raptor 3 engines', fact: 'booster.engineCount', at: () => skinAnchor(1.2 + off('bEng'), 4.2, 1) },
      // exploded: assemblies
      { mode: 'exploded', id: 'ship.nose', name: 'Nosecone and header tanks', at: () => skinAnchor(HB + 43 + off('sNose'), noseR(43), 1) },
      { mode: 'exploded', id: 'ship', name: 'Starship', fact: 'ship.height', at: () => skinAnchor(HB + 20 + off('sBody'), R, 1) },
      { mode: 'exploded', id: 'ship.enginesVac', name: () => SX.fmt('ship.enginesVac', { unitless: true }) + ' Raptor Vacuum + ' + SX.fmt('ship.enginesSL', { unitless: true }) + ' sea level', at: () => rightmost(S.shipVac.map((e) => new THREE.Vector3(e.x, HB + 1.2 + off('sEng'), e.z))) },
      { mode: 'exploded', id: 'booster.hsr', name: 'Hot stage, stays on booster', at: () => skinAnchor(HB - 1.2 + off('hsr'), R, 1) },
      { mode: 'exploded', id: 'booster', name: 'Super Heavy', fact: 'booster.height', at: () => skinAnchor(40 + off('bCore'), R, 1) },
      { mode: 'exploded', id: 'booster.enginesOuter', name: 'Raptor 3 engines', fact: 'booster.engineCount', at: () => skinAnchor(1.2 + off('bEng'), 4.2, 1) },
      // section: booster tanks on the left half of the cut, ship tanks on the right half
      { mode: 'section', side: 'L', id: 'booster.ch4Tank', name: 'Methane', fact: 'booster.propCH4', cls: 's3-ch4', at: () => new THREE.Vector3(-2.7, liquidMidY(B.comEq, B.comD, -1, B.fwdEq, B.fwdD, 1, B.comEq - B.comD + TW, B.fwdEq, 2.7), 0) },
      { mode: 'section', side: 'L', id: 'booster.commonDome', name: 'Common dome', at: () => new THREE.Vector3(-3.4, domeY(B.comEq, B.comD, RI, -1, 3.4) + 0.06, 0) },
      { mode: 'section', side: 'L', id: 'booster.loxTank', name: 'Liquid oxygen', fact: 'booster.propLOX', cls: 's3-lox', at: () => new THREE.Vector3(-3.1, Math.max(liquidMidY(B.aftEq, B.aftD, -1, B.comEq, B.comD, -1, B.aftEq - B.aftD + TW, B.comEq, 3.1), B.landY1 + 2.5), 0) },
      { mode: 'section', side: 'L', id: 'booster.downcomer', name: 'Methane transfer tube', at: () => new THREE.Vector3(-0.6, 21, 0) },
      { mode: 'section', side: 'L', id: 'booster.landingTank', name: 'LOX landing tank', at: () => new THREE.Vector3(B.landX, 9.4, 0) },
      { mode: 'section', side: 'R', id: 'ship.headerLOX', name: 'LOX header', at: () => new THREE.Vector3(0.7, HB + 50.3, 0) },
      { mode: 'section', side: 'R', id: 'ship.headerCH4', name: 'Methane header', at: () => new THREE.Vector3(0.7, HB + SH.hdrCH4c - 0.3, 0) },
      { mode: 'section', side: 'R', id: 'ship.payloadBay', name: 'Payload bay', at: () => new THREE.Vector3(3.0, HB + 36.5, 0) },
      { mode: 'section', side: 'R', id: 'ship.ch4Tank', name: 'Methane', fact: 'ship.propCH4', cls: 's3-ch4', at: () => new THREE.Vector3(2.7, HB + liquidMidY(SH.comEq, SH.comD, -1, SH.fwdEq, SH.fwdD, 1, SH.comEq - SH.comD + TW, SH.fwdEq, 2.7), 0) },
      { mode: 'section', side: 'R', id: 'ship.commonDome', name: 'Common dome', at: () => new THREE.Vector3(3.3, HB + domeY(SH.comEq, SH.comD, RI, -1, 3.3) + 0.06, 0) },
      { mode: 'section', side: 'R', id: 'ship.loxTank', name: 'Liquid oxygen', fact: 'ship.propLOX', cls: 's3-lox', at: () => new THREE.Vector3(2.7, HB + liquidMidY(SH.aftEq, SH.aftD, -1, SH.comEq, SH.comD, -1, SH.aftEq - SH.aftD + TW, SH.comEq, 2.7), 0) },
      // person for scale (any mode, only when the figure is on)
      { mode: 'person', id: null, name: 'Person', fact: 'stack3d.personHeight', at: () => S.person3d.position.clone().add(new THREE.Vector3(0, 1.75, 0)) },
    ];
    defs.forEach((d) => {
      const world = new THREE.Vector3();
      const L = S.st.label('', () => world, { className: 's3-lbl s3-off' + (d.cls ? ' ' + d.cls : '') });
      Object.assign(L, d, { world, side: d.side || 'R', active: false, w: 0 });
      L.show = false;
      L.el.addEventListener('click', (e) => {
        if (!L.id || !e.target.closest('.s3-txt')) return;
        stopTurntable();
        SX.select(L.id);
      });
      S.labels.push(L);
    });
    refreshLabelText();
  }

  function refreshLabelText() {
    S.labels.forEach((L) => {
      L.el.innerHTML = '<i class="s3-dot"></i><svg aria-hidden="true"><polyline points="0,0 0,0"></polyline></svg>' +
        '<span class="s3-txt">' + SX.esc(typeof L.name === 'function' ? L.name() : L.name) + (L.fact ? factBit(L.fact) : '') + '</span>';
      L.poly = L.el.querySelector('polyline');
      L.txt = L.el.querySelector('.s3-txt');
      L.w = 0;
      L.el.classList.toggle('is-sel', !!L.id && L.id === S.selected);
    });
    S.dims.forEach((L) => { L.el.innerHTML = '<span>' + SX.esc(L.name) + '<b>' + SX.esc(SX.fmt(L.key)) + '</b></span>'; });
  }

  function labelWanted(L) {
    if (L.mode === 'person') return S.person;
    if (!S.labelsOn || L.mode !== S.mode) return false;
    if (L.mode === 'assembled') return S.ex < 0.05 && S.cut < 0.05;
    if (L.mode === 'exploded') return S.ex > 0.85;
    if (L.mode === 'section') return S.cut > 0.9;
    return false;
  }

  function layoutLabels() {
    const st = S.st, cam = st.camera;
    const w = st.holder.clientWidth, h = st.holder.clientHeight;
    cam.updateMatrixWorld();
    const tgt = st.controls.target;
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
    const c0 = new THREE.Vector3(0, tgt.y, 0).project(cam);
    const c1 = new THREE.Vector3(0, tgt.y, 0).addScaledVector(right, R + 6).project(cam);
    const axisX = (c0.x * 0.5 + 0.5) * w;
    const colOff = Math.max(38, Math.abs(c1.x - c0.x) * 0.5 * w);
    const cols = { L: [], R: [] };
    const q = new THREE.Vector3();
    S.labels.forEach((L) => {
      const want = labelWanted(L);
      if (want !== L.active) { L.active = want; L.el.classList.toggle('s3-off', !want); }
      if (!want) { L.show = false; return; }
      const p = L.at();
      if (!p) { L.show = false; return; }
      L.world.copy(p);
      q.copy(p).project(cam);
      if (q.z > 1 || q.x < -1.1 || q.x > 1.1 || q.y < -1.1 || q.y > 1.1) { L.show = false; return; }
      L.show = true;
      L.sx = (q.x * 0.5 + 0.5) * w;
      L.sy = (-q.y * 0.5 + 0.5) * h;
      const mw = L.txt ? L.txt.offsetWidth : 0;
      if (mw) L.w = mw; // only trust the width while the label is laid out
      // no room for the chip on its preferred side (zoomed in near an edge): use the other side
      const need = 26 + (L.w || 120);
      let side = L.side;
      if (side === 'L' && L.sx - need < 8) side = 'R';
      else if (side === 'R' && L.sx + need > w - 2 * (S.vo || 0) - 8 && L.sx - need > 8) side = 'L';
      cols[side].push(L);
    });
    const band = uiBand();
    const topM = band.top + 10, gap = 25;
    ['L', 'R'].forEach((side) => {
      const botM = band.bottom - 12 - (S.mode === 'section' && side === 'R' && band.wide ? 110 : 0);
      const arr = cols[side].sort((a, b) => a.sy - b.sy);
      arr.forEach((L, i) => { L.ty = Math.max(L.sy, topM, i ? arr[i - 1].ty + gap : -1e9); });
      for (let i = arr.length - 1; i >= 0; i--) {
        const lim = i < arr.length - 1 ? arr[i + 1].ty - gap : botM;
        if (arr[i].ty > lim) arr[i].ty = lim;
      }
      arr.forEach((L) => {
        let colX = side === 'R' ? axisX + colOff : axisX - colOff;
        if (side === 'R') colX = Math.max(colX, L.sx + 18); else colX = Math.min(colX, L.sx - 18);
        const lw = L.w || 120;
        if (side === 'R') colX = Math.min(colX, w - 2 * (S.vo || 0) - 8 - lw); else colX = Math.max(colX, 8 + lw);
        const dx = colX - L.sx, dy = L.ty - L.sy;
        if (!isFinite(dx) || !isFinite(dy)) { L.show = false; return; }
        const knee = dx - (side === 'R' ? 1 : -1) * Math.min(14, Math.abs(dx) * 0.4);
        L.poly.setAttribute('points', '0,0 ' + knee.toFixed(1) + ',' + dy.toFixed(1) + ' ' + dx.toFixed(1) + ',' + dy.toFixed(1));
        L.txt.style.transform = 'translate(' + (side === 'R' ? dx + 2 : dx - 2 - lw).toFixed(1) + 'px,' + (dy - 11).toFixed(1) + 'px)';
      });
    });
  }

  /* ------------------------------------------------------------------ modes, cameras, focus */

  /** The free vertical band of the canvas between the top toolbar and the bottom controls (px, canvas space). */
  function uiBand() {
    const hr = S.st.holder.getBoundingClientRect();
    const h = hr.height || 1;
    let top = 0, bottom = h;
    const tb = S.ui.top.getBoundingClientRect(), bb = S.ui.bottom.getBoundingClientRect();
    if (tb.height) top = Math.max(0, tb.bottom - hr.top);
    if (bb.height) bottom = Math.min(h, bb.top - hr.top);
    if (bottom - top < h * 0.4) { top = 0; bottom = h; }
    return { top, bottom, h, wide: hr.width >= 600 };
  }
  /** Slide a view so its target sits at the center of the free band instead of the canvas center. */
  function toBand(v) {
    const b = uiBand();
    const cam = S.st.camera;
    const dist = v.pos.distanceTo(v.target);
    const worldPerPx = (2 * dist * Math.tan((cam.fov * DEG) / 2)) / b.h;
    const dc = (b.top + b.bottom) / 2 - b.h / 2; // + means the band center is below the canvas center
    const up = new THREE.Vector3(0, 1, 0);
    const shift = up.multiplyScalar(dc * worldPerPx);
    return { target: v.target.clone().add(shift), pos: v.pos.clone().add(shift) };
  }
  function dirFrom(az, el) {
    return new THREE.Vector3(Math.sin(az * DEG) * Math.cos(el * DEG), Math.sin(el * DEG), Math.cos(az * DEG) * Math.cos(el * DEG));
  }
  function aimAt(target, az, el, dist) { return { target, pos: target.clone().addScaledVector(dirFrom(az, el), dist) }; }
  /** Fit a vertical span [y0, y1] of width w into the view from azimuth/elevation. */
  function frameRange(y0, y1, o) {
    const cam = S.st.camera;
    const h = y1 - y0, w = o.w || 2 * R + 8;
    const tv = Math.tan((cam.fov * DEG) / 2);
    const b = uiBand();
    const frac = Math.max(0.45, (b.bottom - b.top) / b.h); // fit the span into the free band only
    const dV = h / 2 / tv / frac, dH = w / 2 / (tv * Math.max(0.3, cam.aspect || 1));
    const dist = Math.max(dV, dH) * (o.pad || 1.14) + w / 2;
    const target = new THREE.Vector3(o.x || 0, (y0 + y1) / 2 + (o.dy || 0) * h, 0);
    return { target, pos: target.clone().addScaledVector(dirFrom(o.az, o.el), dist) };
  }
  function viewFor(name) {
    const e = S.exTarget;
    const ofs = (g) => EXPLODE[g] * e;
    if (name === 'full') {
      const y0 = Math.min(0, ofs('bEng')), y1 = HB + HS + ofs('sNose');
      const sec = S.mode === 'section';
      return frameRange(y0, y1, { az: sec ? 22 : 38, el: sec ? 2 : 4, w: 2 * R + (S.mode === 'assembled' ? 16 : 10), pad: 1.1 });
    }
    if (name === 'fins') return aimAt(new THREE.Vector3(0, B.finY - 0.8 + ofs('bCore'), 0), 58, -18, 31);
    if (name === 'engines') return aimAt(new THREE.Vector3(0, 1.3 + ofs('bEng'), 0), 28, -55, 23);
    if (name === 'nose') return aimAt(new THREE.Vector3(0, HB + 44.5 + ofs('sNose'), 0), 62, 9, 44);
    if (name === 'flaps') return frameRange(HB + ofs('sBody'), HB + HS + ofs('sNose'), { az: 64, el: 6, w: 2 * R + 9, pad: 1.06 });
    if (name === 'base') return aimAt(new THREE.Vector3(2.4, 5.2, 1.8), 36, 6, 32);
    return viewFor('full');
  }
  function fly(v, instant) {
    const st = S.st;
    v = toBand(v);
    if (instant || SX.reducedMotion) {
      st.camera.position.copy(v.pos);
      st.controls.target.copy(v.target);
      st.controls.update();
    } else st.fly(v.target, v.pos, 1100);
  }
  function applyCamera(name, o) {
    o = o || {};
    fly(viewFor(name), o.instant);
    Object.entries(S.ui.camBtns).forEach(([k, b]) => b.setAttribute('aria-pressed', String(k === name)));
    scheduleLimits(o.instant);
  }
  /** In Section mode, keep the camera in front of the cut plane (azimuth limited), applied after any flight. */
  function scheduleLimits(now) {
    const c = S.st.controls;
    c.minAzimuthAngle = -Infinity;
    c.maxAzimuthAngle = Infinity;
    clearTimeout(S.limitTimer);
    const apply = () => {
      if (S.mode === 'section') { c.minAzimuthAngle = -80 * DEG; c.maxAzimuthAngle = 80 * DEG; }
    };
    if (now || SX.reducedMotion) apply(); else S.limitTimer = setTimeout(apply, 1200);
  }

  const MODE_NOTE = {
    assembled: 'Heights and diameter from published figures; seams at the reported ring spacing.',
    exploded: 'Pulled apart for clarity. On V3 the hot stage is built into the booster and is not dropped in flight.',
    section: 'Cut A-A through the axis. Tank split sized from estimated propellant masses; internal layout is schematic.',
  };
  function refreshNote() {
    S.ui.note.textContent = (SX.coarse ? 'Tap a part for details. ' : S.mode === 'assembled' ? 'Drag to orbit, click any part. ' : '') + MODE_NOTE[S.mode];
  }
  function setMode(mode, o) {
    o = o || {};
    if (S.mode === mode) return;
    S.mode = mode;
    Object.entries(S.ui.modeBtns).forEach(([k, b]) => b.setAttribute('aria-pressed', String(k === mode)));
    S.exTarget = mode === 'exploded' ? 1 : 0;
    S.cutTarget = mode === 'section' ? 1 : 0;
    S.ui.prop.hidden = mode !== 'section';
    S.ui.tag.classList.toggle('on', mode === 'section');
    if (mode === 'section') stopTurntable();
    if (SX.reducedMotion) { S.ex = S.exTarget; S.cut = S.cutTarget; applyExplode(); applyCut(); }
    if (!o.noFly) applyCamera('full'); else scheduleLimits();
    refreshNote();
    announce(mode === 'section' ? 'Section view: front half removed, tanks and propellant visible.' : mode === 'exploded' ? 'Exploded view.' : 'Assembled view.');
  }
  function setLabels(on) {
    S.labelsOn = on;
    S.ui.lblBtn.setAttribute('aria-pressed', String(on));
  }
  function setPerson(on) {
    S.person = on;
    S.person3d.visible = on;
    S.ui.personBtn.setAttribute('aria-pressed', String(on));
    if (on) {
      stopTurntable();
      if (S.mode !== 'assembled') setMode('assembled', { noFly: true });
      fly(viewFor('base'));
      Object.values(S.ui.camBtns).forEach((b) => b.setAttribute('aria-pressed', 'false'));
      announce('A person ' + SX.fmt('stack3d.personHeight') + ' tall stands beside the booster engines.');
    }
  }
  function announce(msg) { S.ui.status.textContent = msg; }

  // Where to look for each part. y ranges are in assembled coordinates; grp gives the explode offset to add.
  const FOCUS = {
    stack: { preset: 'full' },
    booster: { y: [0, HB], grp: 'bCore', az: 36, el: 4, w: 2 * R + 10 },
    ship: { y: [HB, HB + HS], grp: 'sBody', az: 48, el: 4, w: 2 * R + 10 },
    'booster.hsr': { y: [HB - 6.5, HB + 1.5], grp: 'hsr', az: 30, el: 16, w: 2 * R + 3 },
    'booster.gridfins': { preset: 'fins' },
    'booster.catch': { y: [B.finY - 3, B.finY + 3.5], grp: 'bCore', az: 62, el: 14, w: 2 * R + 9 },
    'booster.ch4Tank': { y: [B.comEq - 3, HB], grp: 'bCore', az: 20, el: 5 },
    'booster.commonDome': { y: [B.comEq - 5.5, B.comEq + 4], grp: 'bCore', az: 20, el: 12, w: 2 * R + 2 },
    'booster.loxTank': { y: [3, B.comEq + 2], grp: 'bCore', az: 20, el: 4 },
    'booster.downcomer': { y: [2, B.comEq + 1], grp: 'bCore', az: 18, el: 4 },
    'booster.landingTank': { y: [2.5, 17], grp: 'bCore', az: 18, el: 6, w: 2 * R + 2 },
    'booster.chines': { y: [1, 36], grp: 'bCore', az: 30, el: 4, w: 2 * R + 6 },
    'booster.thrustSection': { y: [-0.5, 11], grp: 'bCore', az: 20, el: 6, w: 2 * R + 2 },
    'booster.engineShield': { preset: 'engines' },
    'booster.enginesCenter': { preset: 'engines' },
    'booster.enginesInner': { preset: 'engines' },
    'booster.enginesOuter': { preset: 'engines' },
    'ship.nose': { preset: 'nose' },
    'ship.headerLOX': { y: [HB + 45.5, HB + 52.6], grp: 'sNose', az: 20, el: 8, w: 8 },
    'ship.headerCH4': { y: [HB + 44.5, HB + 51], grp: 'sNose', az: 20, el: 8, w: 8 },
    'ship.payloadBay': { y: [HB + 30.5, HB + 43], grp: 'sBody', az: 22, el: 8, w: 2 * R + 2 },
    'ship.flapsFwd': { y: [HB + 38.5, HB + 48.5], grp: 'sNose', az: -40, el: 10, w: 2 * R + 8 },
    'ship.flapsAft': { y: [HB - 0.5, HB + 13.5], grp: 'sBody', az: 70, el: 8, w: 2 * R + 9 },
    'ship.ch4Tank': { y: [HB + 18.5, HB + 34], grp: 'sBody', az: 20, el: 5 },
    'ship.commonDome': { y: [HB + 17, HB + 25], grp: 'sBody', az: 20, el: 12, w: 2 * R + 2 },
    'ship.loxTank': { y: [HB + 2, HB + 23], grp: 'sBody', az: 20, el: 4 },
    'ship.heatShield': { y: [HB, HB + HS], grp: 'sBody', az: 96, el: 4, w: 2 * R + 9 },
    'ship.rcs': { y: [HB + 21, HB + 39], grp: 'sBody', az: 20, el: 5, w: 2 * R + 4 },
    'ship.catchPins': { y: [HB + 37.5, HB + 44.5], grp: 'sNose', az: 22, el: 8, w: 2 * R + 6 },
    'ship.transferPorts': { y: [HB, HB + 40], grp: 'sBody', az: -92, el: 4, w: 2 * R + 9 },
    'ship.engineBay': { mode: 'exploded', aim: ['sEng', 2.2, 34, -22, 31] },
    'ship.enginesSL': { mode: 'exploded', aim: ['sEng', 2.2, 34, -22, 31] },
    'ship.enginesVac': { mode: 'exploded', aim: ['sEng', 2.2, 34, -22, 31] },
  };

  function focusPart(id) {
    if (!S || !id) return;
    stopTurntable();
    const f = FOCUS[id] || (String(id).startsWith('ship') ? FOCUS.ship : FOCUS.stack);
    let mode = S.mode;
    if (INTERNAL.has(id)) mode = 'section';
    else if (f.mode) mode = f.mode;
    else if (S.mode === 'section' && !['stack', 'booster', 'ship'].includes(id)) mode = 'assembled';
    else if (S.mode === 'exploded' && f.preset && f.preset !== 'full') mode = 'assembled';
    if (mode !== S.mode) setMode(mode, { noFly: true });
    let v;
    if (f.preset) v = viewFor(f.preset);
    else if (f.aim) {
      const [g, dy, az, el, dist] = f.aim;
      v = aimAt(new THREE.Vector3(0, HB + dy + EXPLODE[g] * S.exTarget, 0), az, el, dist);
    } else {
      const o = EXPLODE[f.grp || 'bCore'] * S.exTarget;
      v = frameRange(f.y[0] + o, f.y[1] + o, { az: f.az, el: f.el, w: f.w || 2 * R + 6, pad: f.pad || 1.12 });
    }
    fly(v);
    scheduleLimits();
    Object.entries(S.ui.camBtns).forEach(([k, b]) => b.setAttribute('aria-pressed', String(k === f.preset)));
    S.selected = SX.selected || id;
    S.pulse = SX.reducedMotion ? null : { id, t: 0 };
    refreshHighlights();
    announce('Showing ' + partName(id) + '.');
  }

  /* ------------------------------------------------------------------ highlight, hover, click */

  function refreshHighlights() {
    const acc = S.accent || (S.accent = col('--accent', '#ffd24a'));
    const sel = S.selected;
    S.parts.forEach((objs, id) => {
      let lvl = 0;
      if (sel === id) lvl = 0.3;
      else if ((sel === 'booster' || sel === 'ship') && id.startsWith(sel + '.')) lvl = 0.12;
      if (S.hover === id) lvl = Math.max(lvl, 0.2);
      if (S.pulse && S.pulse.id === id) {
        const k = S.pulse.t / 1.6;
        lvl = 0.3 + 0.22 * Math.sin(S.pulse.t * 9) * (1 - k);
      }
      lvl = Math.round(lvl * 100) / 100;
      if (S.hl.get(id) === lvl) return;
      S.hl.set(id, lvl);
      objs.forEach((o) => SX.three.highlight(o, lvl > 0 ? acc : null, lvl));
    });
    S.labels.forEach((L) => L.el.classList.toggle('is-sel', !!L.id && L.id === sel));
  }
  function tipHTML(id) {
    const hint = INTERNAL.has(id) && S.mode !== 'section' ? '<br><span style="color:var(--muted)">Section view shows the inside.</span>' : '';
    return '<b>' + SX.esc(partName(id)) + '</b>' + SX.esc(partLine(id)) + hint;
  }
  function onHover(hit, ev) {
    const id = hit ? hit.id : null;
    S.hover = id;
    refreshHighlights();
    if (id && ev) SX.tip.show(tipHTML(id), ev.clientX, ev.clientY); else SX.tip.hide();
    SX.hover(id, { from: VIEW });
  }
  function onClick(hit) {
    if (!hit) return;
    stopTurntable();
    SX.select(hit.id, { from: VIEW });
  }

  /* ------------------------------------------------------------------ per-frame */

  const WINDOWS = { sNose: [0, 0.72], sBody: [0, 0.66], sEng: [0.12, 0.8], hsr: [0.3, 0.95], bCore: [0, 1], bEng: [0.42, 1] };
  function applyExplode() {
    Object.keys(EXPLODE).forEach((g) => {
      const [a, b] = WINDOWS[g];
      const k = SX.ease(SX.clamp((S.ex - a) / (b - a), 0, 1));
      S.groups[g].position.y = EXPLODE[g] * k;
    });
  }
  function applyCut() {
    S.plane.constant = SX.lerp(CUT_OFF, 0, SX.smooth(S.cut));
    setSectionVisible(S.cut > 0.001);
  }

  function frame(dt) {
    if (!S) return;
    if (S.ex !== S.exTarget) {
      const s = dt / 1.6;
      S.ex = S.ex < S.exTarget ? Math.min(S.exTarget, S.ex + s) : Math.max(S.exTarget, S.ex - s);
      applyExplode();
    }
    if (S.cut !== S.cutTarget) {
      const s = dt / 0.95;
      S.cut = S.cut < S.cutTarget ? Math.min(S.cutTarget, S.cut + s) : Math.max(S.cutTarget, S.cut - s);
      applyCut();
    }
    if (S.pulse) {
      S.pulse.t += dt;
      if (S.pulse.t > 1.6) S.pulse = null;
      refreshHighlights();
    }
    // keep the subject clear of the side inspector: shift the projection center into the visible part of the canvas
    const cam = S.st.camera;
    let want = 0;
    const insp = S.inspEl || (S.inspEl = document.querySelector('.inspector'));
    if (insp && insp.classList.contains('open')) {
      const il = insp.offsetLeft, cr = S.st.canvas.getBoundingClientRect();
      if (il > cr.left + 1) { const hidden = Math.max(0, cr.right - il); if (hidden > 24 && hidden < cr.width * 0.8) want = hidden / 2; }
    }
    S.vo += (want - S.vo) * (SX.reducedMotion ? 1 : Math.min(1, dt * 6));
    if (Math.abs(S.vo - want) < 0.5) S.vo = want;
    const cw = S.st.holder.clientWidth, ch = S.st.holder.clientHeight;
    if (S.vo > 0.5) {
      if (!cam.view || !cam.view.enabled || cam.view.offsetX !== S.vo || cam.view.fullWidth !== cw || cam.view.fullHeight !== ch) cam.setViewOffset(cw, ch, S.vo, 0, cw, ch);
    } else if (cam.view && cam.view.enabled) cam.clearViewOffset();
    // dimension lines: billboard to the camera's left, visible when assembled and zoomed out
    S.dims3d.rotation.y = Math.atan2(cam.position.x, cam.position.z);
    const dist = cam.position.distanceTo(S.st.controls.target);
    const dimOn = S.mode === 'assembled' && S.ex < 0.05 && S.cut < 0.05 && dist > 120;
    S.dimMat.opacity += ((dimOn ? 0.85 : 0) - S.dimMat.opacity) * Math.min(1, dt * 8);
    S.dims3d.visible = S.dimMat.opacity > 0.02;
    S.dims.forEach((L) => { L.show = dimOn; L.el.classList.toggle('s3-off', !dimOn); });
    layoutLabels();
  }

  /* ------------------------------------------------------------------ UI wiring */

  function wireUI() {
    const ui = S.ui;
    Object.entries(ui.modeBtns).forEach(([m, b]) => b.addEventListener('click', () => setMode(m)));
    ui.lblBtn.addEventListener('click', () => setLabels(!S.labelsOn));
    ui.personBtn.addEventListener('click', () => setPerson(!S.person));
    ui.range.addEventListener('input', () => {
      S.fill = Number(ui.range.value) / 100;
      ui.out.textContent = ui.range.value + '%';
      updateLiquids();
    });
    Object.entries(ui.camBtns).forEach(([k, b]) => b.addEventListener('click', () => {
      stopTurntable();
      if (S.mode === 'exploded' && k !== 'full') setMode('assembled', { noFly: true });
      applyCamera(k);
      announce(b.textContent + ' view.');
    }));
    ui.jump.addEventListener('change', () => {
      const id = ui.jump.value;
      if (!id) return;
      ui.jump.value = '';
      SX.select(id, { from: VIEW });
      focusPart(id);
    });
  }
})();
