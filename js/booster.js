/* Starship Anatomy: booster view ("booster cutaway").
   A half-section elevation of Super Heavy V3 drawn to its published height and diameter, an aft-section detail,
   an interactive engine cluster (phases, engine-out, gimbal) and four explainer cards.
   Internal positions are estimates derived from the published propellant load; see the fact notes. */
(function () {
  'use strict';
  const SX = window.SX;
  if (!SX) return;

  /* ================================================================== facts this view adds */

  SX.addFacts({
    'booster.ringHeightV2': { v: 1.83, unit: 'm', conf: 'estimate', src: ['SB1'], note: 'Height of one rolled barrel ring on V1/V2 boosters, a community measurement. V3 ring dimensions are not published.' },
    'booster.wallV2': { v: 3.97, unit: 'mm', conf: 'estimate', src: ['SB1'], note: 'Barrel wall thickness on V1/V2, about 4 mm, a community measurement. V3 wall thickness and alloy are not published.' },
    'booster.hsrHeightV2': { v: 1.8, unit: 'm', conf: 'estimate', src: ['SB1'], note: 'The separate vented hot-stage ring used from Flight 2 to Flight 11, jettisoned after boostback from Flight 4 onward.' },
    'booster.gridFinsV2': { v: 4, unit: 'fins', conf: 'official', src: ['S2'], note: 'SpaceX: grid fins were reduced from four to three on V3.' },
    'booster.gridFinGrowth': { v: 50, unit: '%', conf: 'official', src: ['S2'], note: 'Each V3 grid fin is 50% larger and stronger than the first-generation fins. Absolute size and mass are not published.' },
    'booster.chineCount': { v: 4, unit: 'chines', conf: 'reported', src: ['S23'], note: 'On V3 the two chines on the raceway side are taller and closer together; the two on the rudder-fin side are shorter and farther apart.' },
    'booster.propTotalV2': { v: 3400, unit: 't', conf: 'official', src: ['S10'], note: 'First-generation booster propellant capacity (SpaceX vehicle page, 2025).' },
    'booster.liftoffThrustV2': { v: 7590, unit: 'tf', conf: 'official', src: ['S10'], note: 'First-generation booster on Raptor 2 (16.7 Mlbf).' },
    'booster.enginesRelightV2': { v: 13, unit: 'engines', conf: 'official', src: ['S11'], note: 'First-generation boosters relit only the inner 13 for boostback and landing; the outer 20 used ground spin start.' },
    'booster.landingSeqV2': { v: '13, then the 3 center engines', unit: '', conf: 'official', src: ['S11'], note: 'First-generation landing burn profile (Flights 7 and 8). Flight 11 flew the V3-style 13, 5, 3 profile as a test.' },
    'booster.hotStageLitV2': { v: 3, unit: 'engines', conf: 'official', src: ['SB6'], note: 'V1/V2 kept the three center engines running through hot staging. SpaceX has not said how many stay lit on V3; NSF reported 28 of 33 shut down on Flight 12.' },
    'booster.f9AoA': { v: 17, unit: '°', conf: 'official', src: ['SB2'], note: 'Flight 9 (May 2025) flew a descent experiment at about 17 degrees angle of attack; SpaceX concluded the first-generation fuel transfer tube likely failed under the load.' },
    'booster.f14BoostbackLit': { v: 31, unit: 'of 33 engines', conf: 'official', src: ['S5'], note: 'Flight 14 boostback: 31 of the 33 planned engines relit. The burn intentionally used up the main-tank LOX.' },
    'booster.f14LandingLit': { v: 11, unit: 'of 13 engines', conf: 'official', src: ['S5'], note: 'Flight 14 landing burn: 11 of 13 planned engines lit, then 5, then 3, and a soft splashdown in the Gulf.' },
    'booster.transferTubeVolume': { v: 350, unit: 'm³', conf: 'estimate', src: ['S23'], note: 'Derived from NSF dimensions: pi x 1.5 m x 1.5 m x 50 m, about 350 m3, roughly 150 t of methane if full.' },
    'booster.loxBarrel': { v: 39, unit: 'm', conf: 'estimate', src: ['S1', 'S17'], note: 'Drawing estimate, not published. About 2,850 t of LOX at roughly 1.2 t/m3 (subcooled) in a 9 m barrel, less the 3 m transfer tube, with domes about 2 to 2.3 m deep, needs roughly 39 m of straight barrel.' },
    'booster.ch4Barrel': { v: 21, unit: 'm', conf: 'estimate', src: ['S1', 'S17', 'S23'], note: 'Drawing estimate, not published. About 800 t of methane at roughly 0.44 t/m3 is about 1,800 m3; the transfer tube holds roughly 280 m3 of it in this layout, leaving about 21 m of barrel above the common dome. NSF: the V3 methane tank is shorter than before and the LOX tank longer.' },
    'booster.liftoffTW': { v: 1.45, unit: '', conf: 'estimate', src: ['S2', 'S1', 'S22'], note: '33 x 250 tf / 5,700 t estimated liftoff mass = 1.45. NSF describes V3 liftoff thrust-to-weight as nearly 1.5. The stack mass is not published.' },
    'booster.minEnginesLiftoff': { v: 23, unit: 'engines', conf: 'estimate', src: ['S2', 'S1'], note: '5,700 t (estimated stack mass) / 250 tf per engine = 22.8, so 23 engines are the least that could lift the stack at all. Launch commit rules are stricter and not published.' },
  }, {
    SB1: { title: 'SpaceX Super Heavy (community measurements of V1/V2 rings, wall thickness and hot-stage ring, from NSF video coverage)', publisher: 'Wikipedia', date: '2026-09', url: 'https://en.wikipedia.org/wiki/SpaceX_Super_Heavy' },
    SB2: { title: 'Starship updates: Flight 7, 8 and 9 summaries (Flight 9 fuel transfer tube failure at high angle of attack)', publisher: 'SpaceX', date: '2025-08-15', url: 'https://www.spacex.com/updates' },
    SB3: { title: 'Booster 18 suffers anomaly during proof testing', publisher: 'NASASpaceflight', date: '2025-11-21', url: 'https://www.nasaspaceflight.com/2025/11/booster-18-anomaly-proof-testing/' },
    SB4: { title: 'Musk: some parts will use 304L, as it has higher toughness at cryo temps', publisher: 'Tesmanian', date: '2020-03-14', url: 'https://www.tesmanian.com/blogs/tesmanian-blog/starshipstainlesssteelalloy' },
    SB5: { title: "Here's why SpaceX really needed to change out that part on Starship (grid fins fixed extended, electric actuators)", publisher: 'Ars Technica', date: '2023-11-17', url: 'https://arstechnica.com/space/2023/11/heres-why-spacex-really-needed-to-change-out-that-part-on-starship/' },
    SB6: { title: "Starship's Second Flight Test (first hot staging; all but three booster engines powered down)", publisher: 'SpaceX', date: '2023-11-18', url: 'https://www.spacex.com/launches/starship-flight-2' },
  });

  /* ================================================================== geometry (metres, y up from the nozzle exit plane)
     Height and diameter are official. Everything inside is an estimate built from the published propellant load
     (dossier 03, "Components"): order and rough proportions are reliable, exact stations are not public. */

  const H = SX.val('booster.height', 72);
  const R = SX.val('booster.diameter', 9) / 2;
  const G = {
    H, R,
    engH: SX.val('raptor.r3.height', 2.9),
    exitD: 1.18,          // nozzle exits drawn to fit 20 around a 9 m base (SpaceX lists 1.3 m engine diameter, rounded)
    ySk: 2.3,             // aft skirt edge; nozzle protrusion below the skirt is an estimate
    shield: [2.3, 2.55],  // inter-engine shield deck
    plate: [3.2, 4.0],    // thrust plate (tapered)
    manifold: 4.3,        // methane manifold on top of the thrust plate
    yAD: 7.4, dAD: 2.3,   // aft dome rim and depth (convex down)
    yCD: 7.4 + SX.val('booster.loxBarrel', 39), dCD: 2.0,  // common dome rim and depth (drawn convex down)
    dFD: 2.4,             // forward dome depth (convex up)
    trussTop: H - 0.4,    // integrated hot stage: open truss, then the ship interface ring
    tubeR: SX.val('booster.transferTubeDiameter', 3) / 2,
    fin: { y0: 63.9, y1: 66.1, span: 3.2 },
    landing: { x0: 2.0, x1: 3.4, y0: 6.3, y1: 10.9 },
    chineTall: { x0: -2.9, x1: -2.2, y0: 3.7, y1: 33 },
    chineShort: { x0: -3.95, x1: -3.45, y0: 3.7, y1: 23.2 },
    raceway: { x0: -0.42, x1: 0, y0: 36, y1: 67 },
    rings: { c: 0.8, i: 2.3, o: 3.8 },
  };
  G.yFD = G.yCD + SX.val('booster.ch4Barrel', 21);   // forward dome rim
  G.fwdSkirtTop = G.yFD + 1.8;                          // barrel ends, truss begins
  G.domeAD = (x) => G.yAD - G.dAD * Math.sqrt(Math.max(0, 1 - (x / R) * (x / R)));
  G.domeCD = (x) => G.yCD - G.dCD * Math.sqrt(Math.max(0, 1 - (x / R) * (x / R)));
  G.domeFD = (x) => G.yFD + G.dFD * Math.sqrt(Math.max(0, 1 - (x / R) * (x / R)));

  /* The 33 engines, seen from below. bx = left/right as in the elevation, by = depth (positive = away from the
     elevation's viewer, i.e. toward the rudder fin). Centre clocking 108/108/144 is reported by NSF. */
  const ENGINES = (function () {
    const out = [];
    const deg = Math.PI / 180;
    const cAng = [90, 90 + 108, 90 + 216];
    cAng.forEach((a, k) => out.push({ ring: 'c', k, a: a * deg, r: G.rings.c }));
    for (let k = 0; k < 10; k++) out.push({ ring: 'i', k, a: (18 + 36 * k) * deg, r: G.rings.i });
    for (let k = 0; k < 20; k++) out.push({ ring: 'o', k, a: (9 + 18 * k) * deg, r: G.rings.o });
    out.forEach((e, n) => {
      e.n = n;
      e.bx = Math.cos(e.a) * e.r;
      e.by = Math.sin(e.a) * e.r;
      e.gimbal = e.ring !== 'o';
      e.part = e.ring === 'c' ? 'booster.enginesCenter' : e.ring === 'i' ? 'booster.enginesInner' : 'booster.enginesOuter';
      e.label = (e.ring === 'c' ? 'Center engine ' : e.ring === 'i' ? 'Inner ring engine ' : 'Outer ring engine ') + (e.k + 1);
    });
    return out;
  })();

  /* ================================================================== part nodes */

  const ENG_REL = ['raptor3'];
  const N = (k) => SX.factHTML(k, { unitless: true });  // bare number, for 'the 13 inner engines' style copy
  SX.addParts([
    {
      id: 'booster', parent: 'stack', name: 'Super Heavy', short: 'Booster', kind: 'First stage', order: 1,
      summary: 'The first stage of Starship V3: a {{booster.height}} tall, {{booster.diameter}} wide stainless-steel pressure vessel that carries {{booster.propTotal}} of propellant to ' + N('booster.engineCount') + ' Raptor 3 engines, lifts the whole stack through the lower atmosphere, then flies itself back to the launch site.',
      body: [
        'Top to bottom it is an open hot-stage truss, the methane tank, a single shared common dome, the liquid oxygen tank and the engine section. The heavier oxygen sits at the bottom, which keeps the center of mass low, and the methane reaches the engines through a wide transfer tube that runs down the middle of the oxygen tank.',
        'SpaceX calls every booster flown through Flight 11 the first generation; the booster that debuted on Flight 12 is Super Heavy V3. It carries {{booster.propTotal}} of propellant (first generation: {{booster.propTotalV2}}) and makes {{booster.liftoffThrust}} at liftoff (first generation: {{booster.liftoffThrustV2}}). It was redesigned around Raptor 3: no engine shrouds, an integrated hot stage, larger grid fins that double as catch points, and a transfer tube big enough to start every engine at once.',
        'V3 boosters flew on Flights 12, 13 and 14. None had been caught or reflown by the data date; all ' + N('booster.catchesTotal') + ' tower catches so far were first-generation boosters. SpaceX has never published a dry mass for any booster.',
      ],
      specs: [
        { label: 'Height', fact: 'booster.height' },
        { label: 'Diameter', fact: 'booster.diameter' },
        { label: 'Propellant', fact: 'booster.propTotal' },
        { label: 'Liquid oxygen', fact: 'booster.propLOX' },
        { label: 'Liquid methane', fact: 'booster.propCH4' },
        { label: 'Engines', fact: 'booster.engineCount' },
        { label: 'Liftoff thrust', fact: 'booster.liftoffThrust' },
        { label: 'Stack liftoff T/W', fact: 'booster.liftoffTW' },
        { label: 'Dry mass', value: 'Not published', conf: 'disputed' },
        { label: 'Structure', value: 'Stainless steel, SpaceX in-house alloys', conf: 'official' },
      ],
    },
    {
      id: 'booster.hsr', parent: 'booster', name: 'Integrated hot stage', short: 'Interstage', kind: 'Structure', order: 1,
      summary: 'An open steel truss built into the top of the booster. During hot staging the ship lights its engines while it still sits on the booster, and the exhaust escapes sideways through the gaps.',
      body: [
        'Hot staging avoids the coast gap of a conventional separation: the ship never stops accelerating, so its propellant stays settled at the bottom of its tanks without extra ullage thrusters.',
        'First-generation boosters used a separate vented ring about {{booster.hsrHeightV2}} tall (community measurement) that was jettisoned after boostback. V3 builds the hot stage into the booster and keeps it for the whole flight. The ship\'s exhaust now hits the booster\'s forward dome directly, which is protected by tank pressure and a non-structural steel layer, and the latch actuators that hold the ship retract after separation to stay out of the plume. NASASpaceflight compares the open structure to the Soviet N1\'s interstage.',
        'SpaceX has not said how many booster engines keep running through V3 hot staging; first-generation boosters kept the ' + N('booster.hotStageLitV2') + ' center engines lit. The height of the V3 truss is not published.',
      ],
      specs: [
        { label: 'Configuration', fact: 'booster.hotStage' },
        { label: 'V1/V2 ring height', fact: 'booster.hsrHeightV2' },
        { label: 'V1/V2 engines lit at staging', fact: 'booster.hotStageLitV2' },
      ],
      related: ['flight.hotstage', 'booster.ch4Tank.forwardDome'],
    },
    {
      id: 'booster.ch4Tank.forwardDome', parent: 'booster.ch4Tank', name: 'Forward dome', kind: 'Bulkhead', order: 1,
      summary: 'The top bulkhead of the methane tank. On V3 it is also the surface the ship\'s six engines fire at during hot staging.',
      body: [
        'With no jettisoned ring above it, the dome relies on the methane tank\'s internal pressure and a non-structural steel shield layer to survive the ship\'s exhaust. NASASpaceflight reports Booster 20 added more steel heat protection here after the first V3 flight.',
        'The dome bulges upward, so its apex rises into the hot-stage truss. Its exact shape and the shield\'s thickness are not published.',
      ],
      specs: [{ label: 'Hot stage', fact: 'booster.hotStage' }],
      related: ['booster.hsr'],
    },
    {
      id: 'booster.gridfins', parent: 'booster', name: 'Grid fins', kind: 'Aerodynamic control', order: 2,
      summary: 'Large lattice fins near the top of the booster ({{booster.gridFins}}). They steer it in pitch, yaw and roll as it falls back through the atmosphere, and two of them carry the catch points.',
      body: [
        'V3 has ' + N('booster.gridFins') + ' fins where the first generation had ' + N('booster.gridFinsV2') + ', each {{booster.gridFinGrowth}} larger and stronger. They were lowered away from the hot-staging plume and re-clocked into a T: two opposite fins provide lift and carry the catch points, and the third is a rudder fin whose angled internal grids avoid pitching the booster up (NSF).',
        'Why three: the V3 booster glides back at a higher angle of attack, which would leave a fourth fin sitting out of the airflow. The fin shafts, actuators and fixed structure moved inside the methane tank for protection.',
        'First-generation fins stayed extended during ascent and used electric actuators (Ars Technica); V3 details are assumed similar but not published, nor are the fins\' size and mass. In September 2026 Musk suggested a future booster might get by with two fins, using S-turns for the third axis of control ({{booster.gridFinsFuture}}, reported; an idea, not a plan of record).',
      ],
      specs: [
        { label: 'Fins (V3)', fact: 'booster.gridFins' },
        { label: 'Growth vs V1/V2', fact: 'booster.gridFinGrowth' },
        { label: 'Fins (V1/V2)', fact: 'booster.gridFinsV2' },
        { label: 'Possible future', fact: 'booster.gridFinsFuture' },
      ],
      related: ['booster.catch', 'flight.boosterLanding'],
    },
    {
      id: 'booster.catch', parent: 'booster', name: 'Catch points', kind: 'Ground interface', order: 3,
      summary: 'Where the tower\'s chopstick arms take the booster\'s weight when they catch it, or lift it onto the launch mount. On V3 they are built into the two opposite grid fins.',
      body: [
        'First-generation boosters had separate protruding catch pins between their fins. On V3 the catch points are part of the fins themselves, which removes a separate set of protruding hardware. Exactly where on each fin they sit is not published; the drawing places them at the fin root.',
        'The booster has been caught ' + N('booster.catchesTotal') + ' times, on Flights 5, 7 and 8, all with first-generation boosters. No V3 booster had been caught by the data date; V3 flights so far ended in the Gulf. The Pad 2 chopsticks are shorter than Pad 1\'s and use electromechanical instead of hydraulic main actuators.',
      ],
      specs: [
        { label: 'Catches to date', fact: 'booster.catchesTotal' },
        { label: 'Pad 2 arm lift rating', fact: 'tower.chopsticksLift' },
      ],
      related: ['ground.chopsticks', 'booster.gridfins', 'flight.boosterLanding'],
    },
    {
      id: 'booster.ch4Tank', parent: 'booster', name: 'Methane tank', short: 'CH4 tank', kind: 'Propellant tank', order: 4,
      summary: 'The upper tank, holding about {{booster.propCH4}} of subcooled liquid methane (estimate: SpaceX publishes only the total load).',
      body: [
        'Raptor burns roughly {{propellant.ofMass}}, so methane is the smaller share by mass. It is also far less dense than liquid oxygen, which is why the methane tank is still a large fraction of the booster\'s length.',
        'NASASpaceflight reports the V3 methane tank is shorter than before and the oxygen tank longer, with the transfer tube\'s own volume making up the difference. The tank also houses the grid fin actuators on V3. Methane is loaded subcooled, below its boiling point of {{propellant.ch4Boil}} but above its freezing point of {{propellant.ch4Freeze}}, which packs more mass into the same volume; the exact loading temperature is not published.',
        'In flight the tank is kept pressurized autogenously, with warm methane gas returned from the engines.',
      ],
      specs: [
        { label: 'Liquid methane', fact: 'booster.propCH4' },
        { label: 'Barrel length (drawing)', fact: 'booster.ch4Barrel' },
        { label: 'Methane boils at', fact: 'propellant.ch4Boil' },
        { label: 'Methane freezes at', fact: 'propellant.ch4Freeze' },
      ],
    },
    {
      id: 'booster.commonDome', parent: 'booster', name: 'Common dome', kind: 'Bulkhead', order: 5,
      summary: 'A single shared bulkhead that separates the methane above from the liquid oxygen below.',
      body: [
        'Two separate tanks would need two domes and an intertank structure between them. Sharing one dome saves length and mass, the same approach used on the Saturn V upper stages. NASASpaceflight describes V3 boosters being stacked starting with the common dome.',
        'It is a hard bulkhead to design: subcooled liquid oxygen can be colder than the temperature at which methane freezes ({{propellant.ch4Freeze}}), so the dome separates two liquids that cannot share a temperature. How SpaceX manages the heat flow across it is not published.',
        'The V3 booster\'s dome shape is not published. The drawing shows it bowing down into the oxygen tank, as reported for the ship (Ringwatchers), so that methane drains to its center where the transfer tube begins.',
      ],
      specs: [
        { label: 'Shape', value: 'Not published' },
        { label: 'LOX boils at', fact: 'propellant.loxBoil' },
        { label: 'Methane freezes at', fact: 'propellant.ch4Freeze' },
      ],
    },
    {
      id: 'booster.loxTank', parent: 'booster', name: 'Liquid oxygen tank', short: 'LOX tank', kind: 'Propellant tank', order: 6,
      summary: 'The lower, longer tank, holding about {{booster.propLOX}} of subcooled liquid oxygen (estimate), the largest single mass on the rocket.',
      body: [
        'Oxygen is most of the propellant by mass ({{propellant.stackO2Fraction}}), and putting it at the bottom keeps the center of mass low and close to the engines. The transfer tube runs down its middle, carrying methane past the oxygen, and the engine feed lines leave through the aft dome.',
        'For the landing burn the inner engines draw from a separate landing tank, so the main tank can run nearly dry. On Flight 14 SpaceX deliberately burned the main tank\'s oxygen dry during boostback to find the limits of that arrangement.',
        'In November 2025 a gas-system failure during a pressure test blew a hole in the LOX tank of Booster 18, the first V3 booster; the damaged vehicle was left standing on its transfer tube (NSF).',
      ],
      specs: [
        { label: 'Liquid oxygen', fact: 'booster.propLOX' },
        { label: 'Barrel length (drawing)', fact: 'booster.loxBarrel' },
        { label: 'LOX boils at', fact: 'propellant.loxBoil' },
        { label: 'Booster load time (F14)', fact: 'propellant.loadTime' },
      ],
    },
    {
      id: 'booster.loxTank.aftDome', parent: 'booster.loxTank', name: 'Aft dome', kind: 'Bulkhead', order: 1,
      summary: 'The bottom bulkhead of the oxygen tank. The engine feed lines and the transfer tube pass through it.',
      body: [
        'On first-generation boosters the center of this dome was a heavy thrust puck that carried the inner engines. V3 hangs every engine from a separate thrust plate below the dome instead, so the dome mainly has to hold pressure and propellant.',
      ],
      specs: [{ label: 'Engine mounting (V3)', value: 'Separate thrust plate', conf: 'reported' }],
      related: ['booster.thrustSection'],
    },
    {
      id: 'booster.downcomer', parent: 'booster', name: 'Methane transfer tube', short: 'Downcomer', kind: 'Propellant feed', order: 7,
      summary: 'A wide steel pipe that carries methane from the upper tank straight down through the oxygen tank to the engines. SpaceX says the V3 tube is roughly the size of a Falcon 9 first stage.',
      body: [
        'The methane tank is on top, so its fuel has to pass through the oxygen tank to reach the engines. First-generation boosters used a much smaller single downcomer. On Flight 9 the booster flew a descent experiment at about {{booster.f9AoA}} angle of attack; SpaceX concluded the tube likely failed structurally, mixing methane and oxygen and destroying the booster as its landing burn began.',
        'NASASpaceflight reports the V3 tube at about {{booster.transferTubeLength}} tall and {{booster.transferTubeDiameter}} wide, roughly {{booster.transferTubeVolume}} (estimate). The large bore lets every engine draw methane at once, which SpaceX says enables simultaneous starts and faster, more reliable flips. It is structural too: it held up Booster 18 after that booster\'s oxygen tank was holed in a ground test.',
        'Drawing note: the tube here follows tank volumes derived from the published propellant load, which put the common dome lower than a full-length tube would imply. Its exact routing, and whether it serves as a methane reserve for landing, are not published.',
      ],
      specs: [
        { label: 'Size (SpaceX)', value: 'Roughly a Falcon 9 first stage', conf: 'official' },
        { label: 'Length', fact: 'booster.transferTubeLength' },
        { label: 'Diameter', fact: 'booster.transferTubeDiameter' },
        { label: 'Volume', fact: 'booster.transferTubeVolume' },
      ],
      related: ['booster.ch4Tank', 'booster.loxTank'],
    },
    {
      id: 'booster.chines', parent: 'booster', name: 'Chines', kind: 'Aerodynamic structure', order: 8,
      summary: 'Long strakes along the lower body. They add lift during the glide back and house pressure vessels, batteries and avionics.',
      body: [
        'Chines first appeared on Booster 7. V3 has ' + N('booster.chineCount') + ': the pair on the raceway side is taller and closer together, and the pair on the rudder-fin side is shorter and farther apart for extra lift in the glide (NSF). Their exact size is not published.',
        'The chines give the booster room outside its cryogenic tanks for gas bottles and electronics, close to the engine section they serve.',
      ],
      specs: [{ label: 'Chines', fact: 'booster.chineCount' }],
      related: ['booster.pressurization', 'booster.avionics'],
    },
    {
      id: 'booster.pressurization', parent: 'booster', name: 'Pressurization and COPVs', short: 'Press', kind: 'Fluid systems', order: 9,
      summary: 'How the tanks stay pressurized as they drain, and where the engines\' start gases are stored.',
      body: [
        'Starship was designed from the start for autogenous pressurization: the engines turn a little of each propellant into warm gas and send it back to its own tank, so no helium is needed. On V3 these return lines run as external manifolds around the aft section (NSF).',
        'Composite overwrapped pressure vessels (COPVs) in the chines hold high-pressure gas: gaseous methane and oxygen for Raptor spin start and igniters, nitrogen for pneumatic valves, and pressurant for the landing tank. NASASpaceflight reports V3 nearly doubled their number.',
        'A COPV failure in a chine is the likely cause of the Booster 18 loss during a November 2025 gas-system test (NSF).',
      ],
      specs: [
        { label: 'COPVs', fact: 'booster.copvs' },
        { label: 'Spin-start gas', value: 'Gaseous oxygen and methane', conf: 'reported' },
      ],
      related: ['booster.chines', 'booster.landingTank'],
    },
    {
      id: 'booster.avionics', parent: 'booster', name: 'Avionics and power', kind: 'Electrical', order: 10,
      summary: 'Flight computers, batteries, power electronics, cameras and radio links, mounted in the chines.',
      body: [
        'V3 introduced custom avionics units that combine batteries, inverters and high-voltage distribution: about ' + N('vehicle.avionicsUnits') + ' across ship and booster, delivering about {{vehicle.peakPower}} at peak. The booster steers its engines with electric actuators, so this power system also moves the engines.',
        'The two stages carry about ' + N('vehicle.cameraViews') + ' camera views and redundant Starlink links of {{vehicle.starlinkBandwidth}}. Wiring runs down the external raceway and then inside a chine.',
      ],
      specs: [
        { label: 'Avionics units (both stages)', fact: 'vehicle.avionicsUnits' },
        { label: 'Peak power (both stages)', fact: 'vehicle.peakPower' },
        { label: 'Starlink bandwidth', fact: 'vehicle.starlinkBandwidth' },
      ],
      related: ['booster.raceway', 'booster.chines'],
    },
    {
      id: 'booster.raceway', parent: 'booster', name: 'Raceway', kind: 'Cable conduit', order: 11,
      summary: 'An external conduit that carries cabling and the flight termination system along the booster.',
      body: [
        'On V3 the raceway runs only about halfway down the booster, then goes inside and continues through one of the taller chines; the separate flight termination raceways of the first generation were deleted (NSF). After Booster 21\'s soft splashdown on Flight 14, SpaceX fired its flight termination system as a demonstration.',
      ],
      specs: [],
      related: ['booster.avionics'],
    },
    {
      id: 'booster.thrustSection', parent: 'booster', name: 'Engine section and thrust plate', short: 'Aft section', kind: 'Structure', order: 12,
      summary: 'The aft end of the booster, where the thrust of all the engines enters the structure through a tapered steel thrust plate.',
      body: [
        'First-generation boosters hung the inner engines from a thrust puck in the aft dome. V3 mounts every engine on a tapered steel thrust plate covered in new metallic tiles, which also makes the engines stick out further below the skirt (NSF).',
        'Because Raptor 3 carries its sensors and controllers inside its own thermal protection, SpaceX deleted the individual engine shrouds, the enclosed aft cavity and the carbon dioxide fire-suppression system. Commodity lines, spin-start and igniter gas and the pressurization manifolds now run as external pipes, and Booster 21 flew without the aerocovers over the outer engines.',
      ],
      specs: [
        { label: 'Thrust carried at liftoff', fact: 'booster.liftoffThrust' },
        { label: 'Engine shrouds', fact: 'booster.shrouds' },
      ],
      related: ['booster.engineShield', 'booster.loxTank.aftDome'],
    },
    {
      id: 'booster.thrustSection.tvc', parent: 'booster.thrustSection', name: 'Electric thrust vector control', short: 'TVC', kind: 'Actuators', order: 1,
      summary: 'Electric actuators that swing the ' + N('booster.enginesGimbal') + ' central engines to steer the booster.',
      body: [
        'Super Heavy replaced hydraulic steering with electric actuators from Flight 2 onward. Musk has said this isolates each engine, so one hydraulic leak can no longer take out several engines (reported). On V3 the actuators on the inner engines are among the few parts still wrapped in shielding.',
        'Raptor 3\'s gimbal range is not published; Raptor 2 was reported at about {{raptor.r2.gimbalRange}}.',
      ],
      specs: [
        { label: 'Gimballing engines', fact: 'booster.enginesGimbal' },
        { label: 'Gimbal range', fact: 'raptor.r3.gimbalRange' },
      ],
      related: ['raptor3.gimbal'],
    },
    {
      id: 'booster.engineShield', parent: 'booster', name: 'Engine shielding', kind: 'Thermal protection', order: 13,
      summary: 'Heat shielding on the surface between the engines and around the steering hardware of the inner engines. It replaced the individual engine shrouds.',
      body: [
        'Tightly packed engines heat each other, and a failing engine can damage its neighbors. On earlier boosters every engine sat in its own shroud inside an enclosed, fire-suppressed aft bay. Raptor 3 integrates its plumbing and electronics inside its own cooled structure, so V3 keeps shielding only on the surface between the engines and around the steering actuators, main valves and inlets of the inner ' + N('booster.enginesGimbal') + ' engines.',
      ],
      specs: [
        { label: 'Shrouds', fact: 'booster.shrouds' },
        { label: 'Raptor 3 heat shield', fact: 'raptor.r3.heatShield' },
      ],
      related: ['booster.thrustSection', 'raptor3'],
    },
    {
      id: 'booster.landingTank', parent: 'booster', name: 'LOX landing tank', kind: 'Propellant tank', order: 14,
      summary: 'A separate liquid-oxygen tank reserved for the landing burn, able to feed all ' + N('booster.enginesGimbal') + ' inner engines.',
      body: [
        'By the landing burn the main oxygen tank can be nearly empty, with what is left sloshing around a very wide tank. A small dedicated tank keeps oxygen at the engine inlets, and because it can feed every inner engine, any of them can be started if another fails.',
        'First-generation boosters used a smaller header tank integrated with the thrust puck. NASASpaceflight describes the V3 tank as a side landing tank pressurized from COPVs. Its size and exact placement are not published, so its position in the drawing is schematic.',
      ],
      specs: [
        { label: 'Arrangement', value: 'Separate tank feeding the inner engines', conf: 'reported' },
        { label: 'Landing burn', fact: 'booster.landingBurnSequence' },
      ],
      related: ['booster.loxTank', 'flight.boosterLanding'],
    },
    {
      id: 'booster.qds', parent: 'booster', name: 'Quick disconnects', short: 'QDs', kind: 'Ground interface', order: 15,
      summary: 'Two fill connections on the aft skirt, one for liquid oxygen and one for methane, that mate with the launch mount.',
      body: [
        'V3 split the single booster quick disconnect into two physically separated connections, which adds redundancy and simplifies each mechanism. Pad 2 has matching separate units on the side of the mount away from the plume. First-generation pads also fed spin-start gas to the outer engines through extra quick disconnects, which V3 no longer uses.',
        'On Flight 14 the booster took on its propellant in about {{propellant.loadTime}}.',
      ],
      specs: [
        { label: 'Booster QDs', fact: 'booster.quickDisconnects' },
        { label: 'Load time (F14)', fact: 'propellant.loadTime' },
      ],
      related: ['ground.qd'],
    },
    {
      id: 'booster.enginesCenter', parent: 'booster', name: 'Center engines', kind: 'Raptor 3 engines', order: 16,
      summary: 'The ' + N('booster.enginesCenter') + ' innermost Raptor 3 engines. They gimbal and relight, and on first-generation boosters they flew the final hover of the landing burn.',
      body: [
        'On V3 the center three are not evenly spaced: NSF reports {{booster.centerClocking}} so that none fires straight at the ridge of the Pad 2 flame diverter.',
        'First-generation boosters kept these three running through hot staging and finished the landing burn on them ({{booster.landingSeqV2}}). SpaceX V3 timelines say only that the landing burn ends on three engines, and do not say which V3 engines stay lit through hot staging.',
      ],
      specs: [
        { label: 'Engines', fact: 'booster.enginesCenter' },
        { label: 'Clocking', fact: 'booster.centerClocking' },
        { label: 'Thrust each', fact: 'raptor.r3.thrustSL' },
      ],
      related: ENG_REL,
    },
    {
      id: 'booster.enginesInner', parent: 'booster', name: 'Inner ring engines', kind: 'Raptor 3 engines', order: 17,
      summary: 'A ring of ' + N('booster.enginesInner') + ' gimballing Raptor 3 engines. With the center three they are the ' + N('booster.enginesGimbal') + ' engines that steer the booster and fly the landing burn.',
      body: [
        'These engines carry electric thrust vector control and draw oxygen from the landing tank for the landing burn. SpaceX describes ' + N('booster.enginesGimbal') + ' maneuverable engines in the center and the remaining ' + N('booster.enginesOuter') + ' around the perimeter.',
        'NSF reports the ring was rotated on V3 so that no engine blasts the flame-diverter ridge.',
      ],
      specs: [
        { label: 'Engines', fact: 'booster.enginesInner' },
        { label: 'Thrust each', fact: 'raptor.r3.thrustSL' },
        { label: 'Landing burn', fact: 'booster.landingBurnSequence' },
      ],
      related: ENG_REL,
    },
    {
      id: 'booster.enginesOuter', parent: 'booster', name: 'Outer ring engines', kind: 'Raptor 3 engines', order: 18,
      summary: 'The ' + N('booster.enginesOuter') + ' fixed Raptor 3 engines around the perimeter. They do not gimbal; they supply most of the liftoff thrust, and on V3 they can relight.',
      body: [
        'On first-generation boosters the outer ring was a simplified "Raptor Boost" variant spun up by ground equipment through the launch mount, so it could not restart in flight. On V3 all ' + N('booster.enginesRelight') + ' engines can relight: Flight 13 flew the high-thrust part of its boostback on all of them, and Flight 14 relit {{booster.f14BoostbackLit}}.',
        'NSF reports the V3 engines spin up on gaseous oxygen and methane from onboard pressure vessels; SpaceX confirms only a new startup method. Pad 2 has no outer-engine spin-start connections.',
      ],
      specs: [
        { label: 'Engines', fact: 'booster.enginesOuter' },
        { label: 'Relight capable (V3)', fact: 'booster.enginesRelight' },
        { label: 'Thrust each', fact: 'raptor.r3.thrustSL' },
      ],
      related: ENG_REL,
    },
  ]);

  // this sheet is the primary view for every booster part (the inspector's first "Show in" button)
  const PRIMARY_VIEW = true;
  const PART_IDS = ['booster', 'booster.hsr', 'booster.ch4Tank.forwardDome', 'booster.gridfins', 'booster.catch', 'booster.ch4Tank',
    'booster.commonDome', 'booster.loxTank', 'booster.loxTank.aftDome', 'booster.downcomer', 'booster.chines', 'booster.pressurization',
    'booster.avionics', 'booster.raceway', 'booster.thrustSection', 'booster.thrustSection.tvc', 'booster.engineShield',
    'booster.landingTank', 'booster.qds', 'booster.enginesCenter', 'booster.enginesInner', 'booster.enginesOuter'];
  if (PRIMARY_VIEW) SX.addParts(PART_IDS.map((id) => ({ id, view: 'booster' })));

  /* ================================================================== styles (scoped to .v-booster) */

  const CSS = `
.v-booster { --bx-gap: clamp(18px, 2.2vw, 28px); }
.v-booster .bx-top { display: grid; grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr); gap: var(--bx-gap); align-items: start; }
.v-booster .bx-right { display: grid; gap: var(--bx-gap); min-width: 0; }
@media (max-width: 960px) { .v-booster .bx-top { grid-template-columns: minmax(0, 1fr); } }
.v-booster .bx-fig { margin: 0; padding: 14px 14px 12px; min-width: 0; }
.v-booster .bx-head { position: relative; z-index: 1; display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 6px 14px; margin-bottom: 8px; }
.v-booster .bx-title { font: 500 11px/1.35 var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-2); }
.v-booster .bx-title b { color: var(--accent); font-weight: 500; }
.v-booster .bx-scale { font: 500 10px/1.3 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.v-booster .bx-svgwrap { position: relative; }
.v-booster .bx-main svg { max-width: 500px; margin: 0 auto; }
.v-booster .bx-detail svg { max-width: 600px; margin: 0 auto; }
.v-booster .bx-cap { font-size: 12.5px; line-height: 1.5; color: var(--muted); margin-top: 10px; max-width: 66ch; }
.v-booster .bx-cap strong { color: var(--fg-2); font-weight: 500; }
.v-booster .bx-legend { margin-top: 10px; }
.v-booster .bx-legend .sw.hatch { background: repeating-linear-gradient(135deg, var(--steel-2) 0 1px, transparent 1px 4px); border: 1px solid var(--steel-2); }
.v-booster .bx-legend .sw.hid { background: none; border: 1px dashed var(--steel-2); }
.v-booster .bx-legend .sw.gas { background: none; width: 12px; height: 4px; border-top: 2px dotted var(--lox); border-bottom: 2px dotted var(--ch4); border-radius: 0; vertical-align: 0; }
.v-booster .bx-toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.v-booster .bx-toolbar .bx-tl { font: 500 10px/1 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }

/* svg vocabulary */
.v-booster svg text { font-family: var(--font-mono); }
.v-booster .bx-ext { stroke: none; }
.v-booster .bx-ol { fill: none; stroke: var(--steel); stroke-width: 1.1; }
.v-booster .bx-ol-2 { fill: none; stroke: var(--steel-2); stroke-width: 0.9; }
.v-booster .bx-seam { stroke: var(--steel-2); stroke-width: 0.6; opacity: 0.5; fill: none; }
.v-booster .bx-hid { fill: none; stroke: var(--steel-2); stroke-width: 0.9; stroke-dasharray: 3.5 2.5; }
.v-booster .bx-cut { stroke: var(--steel); stroke-width: 0.7; }
.v-booster .bx-void { fill: var(--bg-2); stroke: none; }
.v-booster .bx-lox { fill: var(--lox); fill-opacity: 0.22; stroke: none; }
.v-booster .bx-ch4 { fill: var(--ch4); fill-opacity: 0.24; stroke: none; }
.v-booster .bx-lox-s { fill: none; stroke: var(--lox); stroke-width: 1.5; }
.v-booster .bx-ch4-s { fill: none; stroke: var(--ch4); stroke-width: 1.5; }
.v-booster .bx-lox-line { fill: none; stroke: var(--lox); stroke-width: 1.4; stroke-dasharray: 4 3; opacity: 0.35; transition: opacity 0.3s; }
.v-booster .bx-lox-line.is-on { opacity: 1; }
.v-booster .bx-ox-line { fill: none; stroke: var(--lox); stroke-width: 1.3; stroke-dasharray: 1.5 2; stroke-linecap: round; }
.v-booster .bx-fu-line { fill: none; stroke: var(--ch4); stroke-width: 1.3; stroke-dasharray: 1.5 2; stroke-linecap: round; }
.v-booster .bx-eng { fill: var(--bg-4); stroke: var(--steel-2); stroke-width: 0.8; }
.v-booster .bx-eng-hot { fill: var(--copper); fill-opacity: 0.55; stroke: none; }
.v-booster .bx-eng-rib { stroke: var(--steel-2); stroke-width: 0.5; opacity: 0.55; fill: none; }
.v-booster .bx-dark { fill: var(--bg); stroke: var(--steel-2); stroke-width: 0.8; }
.v-booster .bx-copv { fill: var(--bg-3); stroke: var(--steel); stroke-width: 0.8; }
.v-booster .bx-box { fill: var(--bg-3); stroke: var(--steel-2); stroke-width: 0.8; }
.v-booster .bx-fin { fill: var(--bg-3); stroke: var(--steel); stroke-width: 1; }
.v-booster .bx-lattice { fill: none; stroke: var(--steel-2); stroke-width: 0.6; }
.v-booster .bx-plume { fill: none; stroke: var(--plume); stroke-width: 1.2; opacity: 0.8; }
.v-booster .bx-ghost { fill: none; stroke: var(--muted); stroke-width: 0.9; stroke-dasharray: 6 3; }
.v-booster .bx-ghost-t { fill: var(--muted); font-size: 9.5px; letter-spacing: 0.08em; }
.v-booster .bx-cl { fill: none; stroke: var(--muted); stroke-width: 0.7; stroke-dasharray: 14 3 2 3; opacity: 0.8; }
.v-booster .bx-dim { fill: none; stroke: var(--muted); stroke-width: 0.8; }
.v-booster .bx-dim-t { fill: var(--fg-2); font-size: 12px; font-weight: 500; letter-spacing: 0.03em; font-variant-numeric: tabular-nums; }
.v-booster .bx-dim-e { fill: var(--warn); font-size: 10.5px; font-weight: 500; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
.v-booster .bx-dim-e.bx-dim-l { fill: none; stroke: var(--warn); stroke-width: 0.7; opacity: 0.75; }
.v-booster .bx-note { fill: var(--muted); font-size: 10px; letter-spacing: 0.08em; }
.v-booster .bx-callout { fill: none; stroke: var(--accent); stroke-width: 0.9; stroke-dasharray: 5 4; opacity: 0.7; }
.v-booster .bx-callout-t { fill: var(--accent); font-size: 12px; font-weight: 600; }
.v-booster .bx-callout-g { cursor: pointer; }
.v-booster .bx-callout-g:hover .bx-callout { opacity: 1; }
.v-booster .bx-callout-g:focus-visible { outline: none; }
.v-booster .bx-callout-g:focus-visible .bx-callout { opacity: 1; stroke-width: 1.6; }

/* highlight: the outline of a hovered or selected part turns CAD yellow */
.v-booster .part .bx-hl { transition: stroke 0.15s; }
.v-booster .part.is-hover .bx-hl, .v-booster .part.is-selected .bx-hl, .v-booster .part:focus-visible .bx-hl { stroke: var(--accent); }
.v-booster .part.is-selected .bx-lox, .v-booster .part.is-selected .bx-ch4 { fill-opacity: 0.34; }
.v-booster .part.is-hover .bx-lox, .v-booster .part.is-hover .bx-ch4 { fill-opacity: 0.3; }
.v-booster .part.is-selected { filter: drop-shadow(0 0 2.5px var(--accent-soft)) drop-shadow(0 0 2px var(--accent-soft)); }
.v-booster .bx-big.part.is-selected { filter: none; }
.v-booster .bx-pulse { animation: bx-pulse 0.55s ease-in-out 3; }
@keyframes bx-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* leader labels */
.v-booster .bx-lab { cursor: pointer; }
.v-booster .bx-lab.part.is-hover, .v-booster .bx-lab.part.is-selected, .v-booster .bx-lab.part:focus-visible { filter: none; }
.v-booster .bx-lab:focus-visible { outline: none; }
.v-booster .bx-lab:focus-visible .bx-lab-hit { stroke: var(--accent); stroke-width: 1; }
.v-booster .bx-lab:focus-visible .bx-lab-t { fill: var(--accent); }
.v-booster .bx-lab-hit { fill: transparent; }
.v-booster .bx-lab-t { fill: var(--fg); font-weight: 500; letter-spacing: 0.05em; }
.v-booster .bx-lab-s { fill: var(--muted); font-weight: 500; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
.v-booster .bx-lab-l { fill: none; stroke: var(--steel-2); stroke-width: 0.8; }
.v-booster .bx-lab-d { fill: var(--steel); }
.v-booster .bx-lab.is-hover .bx-lab-t, .v-booster .bx-lab.is-selected .bx-lab-t { fill: var(--accent); }
.v-booster .bx-lab.is-hover .bx-lab-l, .v-booster .bx-lab.is-selected .bx-lab-l { stroke: var(--accent); }
.v-booster .bx-lab.is-hover .bx-lab-d, .v-booster .bx-lab.is-selected .bx-lab-d { fill: var(--accent); }

.v-booster .bx-bal { fill: var(--bg-2); stroke: var(--steel); stroke-width: 1; }
.v-booster .bx-bal-t { fill: var(--fg); font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; }
.v-booster .bx-lab.is-hover .bx-bal, .v-booster .bx-lab.is-selected .bx-bal { stroke: var(--accent); }
.v-booster .bx-lab.is-hover .bx-bal-t, .v-booster .bx-lab.is-selected .bx-bal-t { fill: var(--accent); }
.v-booster .bx-key { list-style: none; margin: 12px 0 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 10px; }
.v-booster .bx-key[hidden] { display: none; }
.v-booster .bx-key-b { display: flex; gap: 8px; align-items: flex-start; width: 100%; text-align: left; background: none; border: 0; border-radius: 3px; color: var(--fg); font: 500 11px/1.35 var(--font-mono); letter-spacing: 0.04em; padding: 4px 2px; cursor: pointer; }
.v-booster .bx-key-b small { display: block; color: var(--muted); font-size: 10px; letter-spacing: 0.03em; }
.v-booster .bx-key-n { flex: none; width: 19px; height: 19px; border: 1px solid var(--steel-2); border-radius: 50%; text-align: center; line-height: 17px; font-size: 10px; color: var(--fg-2); font-variant-numeric: tabular-nums; }
.v-booster .bx-key-b:hover, .v-booster .bx-key-b.is-hover, .v-booster .bx-key-b.is-selected { color: var(--accent); }
.v-booster .bx-key-b.is-selected .bx-key-n, .v-booster .bx-key-b.is-hover .bx-key-n { border-color: var(--accent); color: var(--accent); }

/* engine cluster */
.v-booster .bx-cluster { padding: 16px; }
.v-booster .bx-cl-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px 16px; margin-bottom: 14px; }
.v-booster .bx-cl-grid { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr); gap: 18px; align-items: start; }
@media (max-width: 1100px) and (min-width: 961px), (max-width: 620px) { .v-booster .bx-cl-grid { grid-template-columns: minmax(0, 1fr); } }
.v-booster .bx-cl-svg { max-width: 380px; margin: 0 auto; }
.v-booster .bx-steps { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; min-height: 30px; margin: 10px 0 0; }
.v-booster .bx-steps[hidden] { display: none; }
.v-booster .bx-phase-note { font-size: 13px; line-height: 1.5; color: var(--fg-2); margin-top: 10px; max-width: 66ch; }
.v-booster .bx-e { cursor: pointer; }
.v-booster .bx-e:focus { outline: none; }
.v-booster .bx-e-noz { fill: var(--bg-4); stroke: var(--steel-2); stroke-width: 1; transition: fill 0.25s, stroke 0.25s; }
.v-booster .bx-e.is-gimbal .bx-e-noz { stroke: var(--steel); stroke-width: 1.4; }
.v-booster .bx-e-glow { fill: url(#bx-plume-grad); opacity: 0; transition: opacity 0.35s; pointer-events: none; }
.v-booster .bx-e.is-lit .bx-e-glow { opacity: 1; }
.v-booster .bx-e.is-lit .bx-e-noz { fill: var(--bg); }
.v-booster .bx-e-mark { fill: none; stroke: var(--steel-2); stroke-width: 1; pointer-events: none; }
.v-booster .bx-e.is-lit .bx-e-mark { stroke: var(--bg); }
.v-booster .bx-e-dot { fill: var(--steel-2); pointer-events: none; }
.v-booster .bx-e.is-lit .bx-e-dot { fill: var(--bg); }
.v-booster .bx-e-x { stroke: var(--bad); stroke-width: 2; opacity: 0; pointer-events: none; }
.v-booster .bx-e.is-out .bx-e-x { opacity: 1; }
.v-booster .bx-e.is-out .bx-e-noz { stroke: var(--bad); }
.v-booster .bx-e:hover .bx-e-noz, .v-booster .bx-e:focus-visible .bx-e-noz { stroke: var(--accent); stroke-width: 2; }
.v-booster .bx-e.is-ring-hl .bx-e-noz { stroke: var(--accent); }
.v-booster .bx-arrow { fill: none; stroke: var(--fg-2); stroke-width: 1.3; pointer-events: none; }
.v-booster .bx-arrow-h { fill: var(--fg-2); pointer-events: none; }
.v-booster .bx-net { fill: none; stroke: var(--fg); stroke-width: 2.4; pointer-events: none; }
.v-booster .bx-net-h { fill: var(--fg); pointer-events: none; }
.v-booster .bx-net-t { fill: var(--fg); font-size: 10px; font-weight: 600; letter-spacing: 0.08em; pointer-events: none; paint-order: stroke; stroke: var(--bg); stroke-width: 3px; stroke-linejoin: round; }
.v-booster .bx-body { fill: var(--bg-2); stroke: var(--steel); stroke-width: 1.2; }
.v-booster .bx-shieldbg { fill: var(--tile); stroke: none; }
.v-booster .bx-fin-b { fill: var(--bg-3); stroke: var(--steel-2); stroke-width: 1; }
.v-booster .bx-chine-b { fill: var(--bg-3); stroke: var(--steel-2); stroke-width: 1; }
.v-booster .bx-tiny { fill: var(--muted); font-size: 9.5px; letter-spacing: 0.08em; pointer-events: none; }
.v-booster .bx-read { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; border-top: 1px solid var(--line-2); }
.v-booster .bx-read > div { padding: 10px 10px 10px 0; border-bottom: 1px solid var(--line); min-width: 0; }
.v-booster .bx-read > div:nth-child(even) { padding-left: 12px; border-left: 1px solid var(--line); }
.v-booster .bx-read dt { font: 500 10px/1.3 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.v-booster .bx-read dd { margin: 3px 0 0; font: 600 22px/1.05 var(--font-display); letter-spacing: 0.01em; font-variant-numeric: tabular-nums; }
.v-booster .bx-read dd small { display: block; font: 400 11px/1.35 var(--font-mono); color: var(--muted); letter-spacing: 0; margin-top: 3px; }
.v-booster .bx-read dd.is-bad { color: var(--bad); }
.v-booster .bx-read .bx-est { font: 500 9px/1 var(--font-mono); letter-spacing: 0.08em; color: var(--warn); border: 1px solid var(--warn); border-radius: 3px; padding: 2px 4px; opacity: 0.85; margin-left: 6px; vertical-align: 0.35em; }
.v-booster .bx-mathy { cursor: help; border-bottom: 1px dotted var(--line-2); }
.v-booster .bx-gim { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 14px; align-items: center; margin-top: 14px; }
.v-booster .bx-joy { width: 124px; height: 124px; touch-action: none; cursor: grab; display: block; border-radius: 50%; }
.v-booster .bx-joy:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.v-booster .bx-joy-ring { fill: var(--bg-3); stroke: var(--line-2); stroke-width: 1; }
.v-booster .bx-joy-x { stroke: var(--line-2); stroke-width: 1; }
.v-booster .bx-joy-k { fill: var(--accent); stroke: var(--accent-ink); stroke-width: 1.5; }
.v-booster .bx-joy-v { stroke: var(--accent); stroke-width: 1.5; }
.v-booster .bx-gim-t { font-size: 12.5px; line-height: 1.5; color: var(--fg-2); }
.v-booster .bx-gim-t b { display: block; font: 500 10px/1.3 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
.v-booster .bx-ringbtns { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.v-booster .bx-ringbtns .chip i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; vertical-align: -1px; border: 1.5px solid var(--steel); }
.v-booster .bx-ringbtns .chip i.fixed { border-width: 1px; border-color: var(--steel-2); }

/* explainer cards */
.v-booster .bx-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--bx-gap); margin-top: var(--bx-gap); }
@media (max-width: 800px) { .v-booster .bx-cards { grid-template-columns: minmax(0, 1fr); } }
.v-booster .bx-card { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.v-booster .bx-card .eyebrow { color: var(--accent); }
.v-booster .bx-card .prose { font-size: 14px; }
.v-booster .bx-card ul { margin: 0; padding-left: 18px; color: var(--fg-2); font-size: 14px; }
.v-booster .bx-card li + li { margin-top: 6px; }
.v-booster .bx-card li strong { color: var(--fg); font-weight: 600; }
.v-booster .bx-src { font: 400 11px/1.5 var(--font-mono); color: var(--muted); margin-top: auto; padding-top: 8px; border-top: 1px solid var(--line); }
.v-booster .bx-src a { color: var(--fg-2); }
.v-booster .bx-chg { width: 100%; border-collapse: collapse; font-size: 13px; }
.v-booster .bx-chg th { text-align: left; font: 500 10px/1.3 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); padding: 0 8px 6px 0; }
.v-booster .bx-chg td { padding: 7px 8px 7px 0; border-top: 1px solid var(--line); vertical-align: top; color: var(--fg-2); }
.v-booster .bx-chg td:first-child { color: var(--fg); font-weight: 500; white-space: nowrap; }
.v-booster .bx-seq { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; counter-reset: bxs; }
.v-booster .bx-seq li { position: relative; padding: 0 0 12px 26px; color: var(--fg-2); font-size: 14px; }
.v-booster .bx-seq li::before { counter-increment: bxs; content: counter(bxs); position: absolute; left: 0; top: 1px; width: 17px; height: 17px; border: 1px solid var(--line-2); border-radius: 50%; font: 500 10px/16px var(--font-mono); text-align: center; color: var(--muted); }
.v-booster .bx-seq li::after { content: ""; position: absolute; left: 8px; top: 20px; bottom: 2px; width: 1px; background: var(--line); }
.v-booster .bx-seq li:last-child::after { display: none; }
.v-booster .bx-seq .mono { color: var(--fg); font-size: 12px; }
@media (prefers-reduced-motion: reduce) { .v-booster .bx-pulse { animation: none; } }
`;

  /* ================================================================== small helpers */

  const esc = SX.esc;
  const S_ = (tag, attrs, ...kids) => SX.svg(tag, attrs, ...kids);
  const f1 = (n) => Math.round(n * 10) / 10;
  const fmtNum = (n, d) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d });

  /** Plain text of a copy string: fact tokens and fact spans become formatted values, tags are stripped. */
  function plain(html) {
    const d = document.createElement('div');
    d.innerHTML = SX.withFacts(html || '');
    SX.renderFacts(d);
    return d.textContent.replace(/\s+/g, ' ').trim();
  }
  function firstSentence(t) {
    const m = /^(.+?[.!?])(\s|$)/.exec(t);
    return m ? m[1] : t;
  }
  const tipCache = new Map();
  function tipHTML(id, extra) {
    const key = id + '|' + (extra || '');
    if (tipCache.has(key)) return tipCache.get(key);
    const p = SX.part(id);
    if (!p) return '';
    const html = '<b>' + esc(p.name) + '</b>' + esc(firstSentence(plain(p.summary))) + (extra ? '<br><span style="color:var(--muted)">' + esc(extra) + '</span>' : '');
    tipCache.set(key, html);
    return html;
  }
  /** Mono character width estimate for label layout. */
  const textW = (s, fs) => s.length * fs * 0.61;

  /** A coordinate system for one drawing: metres to SVG px. */
  function frame(cx, yTop, yMax, S) {
    return {
      S, cx,
      x: (m) => cx + m * S,
      y: (m) => yTop + (yMax - m) * S,
      pt: (x, y) => f1(cx + x * S) + ',' + f1(yTop + (yMax - y) * S),
    };
  }
  /** Polyline path through [[x,y],...] metres. */
  function poly(F, pts, close) {
    return 'M' + pts.map((p) => F.pt(p[0], p[1])).join(' L') + (close ? ' Z' : '');
  }
  /** Sample a function x -> y into [[x, y]] points. */
  function sample(fn, x0, x1, n) {
    const out = [];
    for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * (i / n); out.push([x, fn(x)]); }
    return out;
  }
  /** A thin dome band (bulkhead in section) from x0 to x1, thickness t metres, hatched as cut steel. */
  function domeBand(F, fn, x0, x1, t, dir) {
    const a = sample(fn, x0, x1, 28);
    const b = sample((x) => fn(x) + t * dir, x0, x1, 28).reverse();
    return poly(F, a.concat(b), true);
  }
  /** Liquid region between bottom(x) and min(level, ceil(x)), for x in [x0, x1]. Returns {fill, surface}. */
  function liquid(F, x0, x1, bottom, ceil, level) {
    const n = 48;
    const top = [], bot = [];
    let sx0 = null, sx1 = null;
    for (let i = 0; i <= n; i++) {
      const x = x0 + (x1 - x0) * (i / n);
      const b = bottom(x), c = ceil(x), t = Math.min(level, c);
      if (t > b + 0.01) {
        top.push([x, t]); bot.push([x, b]);
        if (level < c) { if (sx0 == null) sx0 = x; sx1 = x; }
      }
    }
    if (top.length < 2) return { fill: '', surface: '' };
    // close the ends vertically so the polygon hugs the tube wall and the tank wall
    const fill = poly(F, top.concat(bot.reverse()), true);
    const surface = sx0 != null && sx1 > sx0 ? 'M' + F.pt(sx0, level) + ' L' + F.pt(sx1, level) : '';
    return { fill, surface };
  }

  /* ================================================================== part registry: hover, select, focus, tooltip */

  const reg = new Map();      // id -> Set of elements that represent it
  const mainLabelIds = new Set(); // parts labelled in the elevation (detail B only adds tab stops for the rest)
  function regEl(id, el) {
    if (!reg.has(id)) reg.set(id, new Set());
    reg.get(id).add(el);
    if (SX.selected === id) el.classList.add('is-selected');
  }
  function paintHover(id) {
    reg.forEach((set, k) => set.forEach((el) => el.classList.toggle('is-hover', k === id)));
  }
  function paintSelect(id) {
    reg.forEach((set, k) => set.forEach((el) => el.classList.toggle('is-selected', k === id)));
  }
  function tipAtEl(el, html) {
    const r = el.getBoundingClientRect();
    SX.tip.show(html, r.left + Math.min(r.width, 160) / 2, r.top + Math.min(r.height, 60) / 2);
  }
  /** Wire pointer + keyboard behaviour onto an element that stands for part id. */
  function wire(el, id, opts) {
    opts = opts || {};
    regEl(id, el);
    el.addEventListener('pointerenter', (e) => { SX.hover(id, { from: 'booster' }); SX.tip.show(tipHTML(id, opts.tipExtra), e.clientX, e.clientY); });
    el.addEventListener('pointermove', (e) => SX.tip.show(tipHTML(id, opts.tipExtra), e.clientX, e.clientY));
    el.addEventListener('pointerleave', () => { SX.hover(null, { from: 'booster' }); SX.tip.hide(); });
    el.addEventListener('click', (e) => { e.stopPropagation(); SX.select(id, { from: 'booster' }); });
    if (opts.tab) {
      const p = SX.part(id);
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', (p ? p.name : id) + '. ' + (p ? firstSentence(plain(p.summary)) : ''));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); SX.select(id, { from: 'booster' }); }
      });
      el.addEventListener('focus', () => { SX.hover(id, { from: 'booster' }); tipAtEl(el, tipHTML(id)); });
      el.addEventListener('blur', () => { SX.hover(null, { from: 'booster' }); SX.tip.hide(); });
    }
    return el;
  }
  /** A <g class="part"> for id, appended to parent. */
  function partG(parent, id, cls, opts) {
    const g = S_('g', { class: 'part' + (cls ? ' ' + cls : ''), 'data-part': id });
    parent.appendChild(g);
    return wire(g, id, opts);
  }

  /* ================================================================== leader labels that never collide
     Each label: {part, text, sub, ax, ay (px anchor), side: 'L'|'R'}. Labels on a side are stacked in a column,
     sorted by anchor height, relaxed toward their anchors, then separated with a strict pass. */
  function layoutColumn(items, top, bottom, pad) {
    items.sort((a, b) => a.ay - b.ay);
    items.forEach((it) => { it.y = it.ay; });
    const minGap = (a, b) => (a.h + b.h) / 2 + pad;
    for (let iter = 0; iter < 120; iter++) {
      items.forEach((it) => { it.y += (it.ay - it.y) * 0.08; });
      for (let i = 1; i < items.length; i++) {
        const a = items[i - 1], b = items[i];
        const ov = a.y + minGap(a, b) - b.y;
        if (ov > 0) { a.y -= ov / 2; b.y += ov / 2; }
      }
      items.forEach((it) => { it.y = SX.clamp(it.y, top + it.h / 2, bottom - it.h / 2); });
    }
    for (let i = 1; i < items.length; i++) items[i].y = Math.max(items[i].y, items[i - 1].y + minGap(items[i - 1], items[i]));
    for (let i = items.length - 2; i >= 0; i--) {
      if (items[i + 1].y > bottom - items[i + 1].h / 2) items[i + 1].y = bottom - items[i + 1].h / 2;
      items[i].y = Math.min(items[i].y, items[i + 1].y - minGap(items[i], items[i + 1]));
    }
  }
  /** Draw labels into layer. cfg: {xL, xR, fs, fsSub, top, bottom, shoulder} (px).
      With cfg.mode 'balloon' (narrow screens) each label becomes a numbered balloon beside the drawing, the drafting
      convention for item callouts, and the names go into an HTML key list (cfg.keyEl) where they stay legible. */
  const BR = 9;
  function drawLabels(layer, labels, cfg) {
    layer.textContent = '';
    const balloon = cfg.mode === 'balloon';
    if (cfg.keyEl) {
      cfg.keyEl.querySelectorAll('.bx-key-b').forEach((b) => { const s2 = reg.get(b.dataset.part); if (s2) s2.delete(b); });
      cfg.keyEl.textContent = '';
      cfg.keyEl.hidden = !balloon;
    }
    const fs = cfg.fs, fsSub = cfg.fsSub;
    labels.forEach((l) => { l.h = balloon ? 2 * BR + 4 : l.sub ? fs + fsSub + 5 : fs + 3; });
    const order = [];
    const seen = new Set();
    ['L', 'R'].forEach((side) => {
      const col = labels.filter((l) => l.side === side);
      layoutColumn(col, cfg.top, cfg.bottom, balloon ? 3 : cfg.pad || 5);
      col.forEach((l) => order.push(l));
    });
    order.forEach((l, i) => {
      const side = l.side;
      const g = S_('g', { class: 'part bx-lab', 'data-part': l.part });
      if (balloon) {
        const bx = side === 'L' ? cfg.bL : cfg.bR;
        const dx = l.ax - bx, dy = l.ay - l.y, d = Math.hypot(dx, dy) || 1;
        g.appendChild(S_('path', { class: 'bx-lab-l', d: 'M' + f1(bx + dx / d * BR) + ',' + f1(l.y + dy / d * BR) + ' L' + f1(l.ax) + ',' + f1(l.ay) }));
        g.appendChild(S_('circle', { class: 'bx-lab-d', cx: f1(l.ax), cy: f1(l.ay), r: 2.3 }));
        g.appendChild(S_('circle', { class: 'bx-bal', cx: f1(bx), cy: f1(l.y), r: BR }));
        g.appendChild(S_('text', { class: 'bx-bal-t', x: f1(bx), y: f1(l.y + 4), 'text-anchor': 'middle' }, String(i + 1)));
        if (cfg.keyEl) {
          const b = SX.el('button', { type: 'button', class: 'bx-key-b', 'data-part': l.part },
            SX.el('span', { class: 'bx-key-n' }, String(i + 1)),
            SX.el('span', null, l.text, l.sub ? SX.el('small', null, l.sub) : null));
          wire(b, l.part, {});
          b.addEventListener('focus', () => SX.hover(l.part, { from: 'booster' }));
          b.addEventListener('blur', () => SX.hover(null, { from: 'booster' }));
          cfg.keyEl.appendChild(SX.el('li', null, b));
        }
      } else {
        const tx = side === 'L' ? cfg.xL : cfg.xR;
        const anchor = side === 'L' ? 'end' : 'start';
        const yName = l.sub ? l.y - (fsSub + 5) / 2 + fs * 0.36 : l.y + fs * 0.36;
        const w = Math.max(textW(l.text, fs), l.sub ? textW(l.sub, fsSub) : 0);
        g.appendChild(S_('rect', { class: 'bx-lab-hit', x: f1(side === 'L' ? tx - w - 4 : tx - 4), y: f1(l.y - l.h / 2 - 2), width: f1(w + 8), height: f1(l.h + 4) }));
        const sh0 = side === 'L' ? tx + 5 : tx - 5;
        const sh1 = side === 'L' ? tx + cfg.shoulder : tx - cfg.shoulder;
        const ly = l.sub ? yName - fs * 0.36 : l.y;
        g.appendChild(S_('path', { class: 'bx-lab-l', d: 'M' + f1(sh0) + ',' + f1(ly) + ' L' + f1(sh1) + ',' + f1(ly) + ' L' + f1(l.ax) + ',' + f1(l.ay) }));
        g.appendChild(S_('circle', { class: 'bx-lab-d', cx: f1(l.ax), cy: f1(l.ay), r: 2.3 }));
        g.appendChild(S_('text', { class: 'bx-lab-t', x: tx, y: f1(yName), 'text-anchor': anchor, 'font-size': fs }, l.text));
        if (l.sub) g.appendChild(S_('text', { class: 'bx-lab-s', x: tx, y: f1(yName + fsSub + 4), 'text-anchor': anchor, 'font-size': fsSub }, l.sub));
      }
      layer.appendChild(g);
      const tab = !balloon && !seen.has(l.part) && (!cfg.tabbable || cfg.tabbable(l.part));
      if (tab) seen.add(l.part);
      if (cfg.collect) cfg.collect.add(l.part);
      wire(g, l.part, { tab });
    });
  }
  /** Remove label elements from the registry before a relayout. */
  function unregLabels(layer) {
    layer.querySelectorAll('.bx-lab').forEach((g) => { const s2 = reg.get(g.dataset.part); if (s2) s2.delete(g); });
  }
  /** Switch a drawing between leader labels (wide) and balloons + key (narrow) as its box resizes. */
  function watchMode(host, threshold, apply) {
    let mode = null;
    const check = () => {
      const w = host.clientWidth || 999;
      const m = w < threshold ? 'balloon' : 'label';
      if (m !== mode) { mode = m; apply(m); }
    };
    if ('ResizeObserver' in window) new ResizeObserver(check).observe(host);
    else window.addEventListener('resize', check);
    check();
    return () => mode;
  }

  /** SVG defs shared by the drawings: hatch for cut steel, steel shading, plume glow. Ids are prefixed bx-. */
  function defs(svg, pre) {
    const d = S_('defs');
    const hatch = S_('pattern', { id: pre + '-hatch', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
      S_('rect', { width: 5, height: 5, style: 'fill:var(--bg-3)' }),
      S_('line', { x1: 0, y1: 0, x2: 0, y2: 5, style: 'stroke:var(--steel-2);stroke-width:1.1' }));
    const steel = S_('linearGradient', { id: pre + '-steel', x1: 0, x2: 1, y1: 0, y2: 0 },
      S_('stop', { offset: '0', style: 'stop-color:var(--steel-2);stop-opacity:0.10' }),
      S_('stop', { offset: '0.35', style: 'stop-color:var(--steel);stop-opacity:0.3' }),
      S_('stop', { offset: '0.8', style: 'stop-color:var(--steel);stop-opacity:0.17' }),
      S_('stop', { offset: '1', style: 'stop-color:var(--steel-2);stop-opacity:0.10' }));
    d.appendChild(hatch);
    d.appendChild(steel);
    svg.appendChild(d);
    return { hatch: 'url(#' + pre + '-hatch)', steel: 'url(#' + pre + '-steel)' };
  }

  /** Raptor 3 silhouette in elevation (metres, relative to the nozzle exit centre). Schematic outline. */
  function engineShape(F, x0, y0, hw) {
    const k = hw / 0.61; // scale if the drawn exit differs
    const P = (dx, dy) => F.pt(x0 + dx * k, y0 + dy);
    const nozzle = 'M' + P(-0.61, 0) + ' C' + P(-0.55, 0.8) + ' ' + P(-0.25, 1.3) + ' ' + P(-0.17, 1.62) +
      ' L' + P(-0.26, 1.8) + ' L' + P(-0.26, 2.2) + ' L' + P(-0.44, 2.32) + ' L' + P(-0.44, 2.76) + ' L' + P(-0.2, 2.9) +
      ' L' + P(0.2, 2.9) + ' L' + P(0.44, 2.76) + ' L' + P(0.44, 2.32) + ' L' + P(0.26, 2.2) + ' L' + P(0.26, 1.8) +
      ' L' + P(0.17, 1.62) + ' C' + P(0.25, 1.3) + ' ' + P(0.55, 0.8) + ' ' + P(0.61, 0) + ' Z';
    const ribs = [0.35, 0.75, 1.15].map((yy) => {
      const w = yy < 0.5 ? 0.585 : yy < 0.9 ? 0.49 : 0.34;
      return 'M' + P(-w, yy) + ' L' + P(w, yy);
    }).join(' ');
    const hot = 'M' + P(-0.61, 0) + ' L' + P(0.61, 0) + ' L' + P(0.6, 0.12) + ' L' + P(-0.6, 0.12) + ' Z';
    return { nozzle, ribs, hot };
  }

  /* ================================================================== propellant levels by phase (schematic)
     Liftoff: tanks full. Boostback: most of the main-tank load is gone. Landing: main tanks nearly dry, the landing
     tank feeds the inner engines. SpaceX does not publish reserves; the levels only illustrate the arrangement. */

  const LEVELS = {
    liftoff: { lox: G.yCD - 0.35, ch4: G.yFD - 0.45, land: 1 },
    boostback: { lox: G.yAD + 4.2, ch4: G.yCD + 3.2, land: 1 },
    landing: { lox: G.domeAD(0) + 0.32, ch4: G.domeCD(G.tubeR) + 0.45, land: 0.62 },
  };

  /* ================================================================== the elevation: half section A-A */

  const EV = { W: 500, top: 46, bottom: 58, S: 12.5, cx: 262 };
  EV.Hpx = EV.top + H * EV.S + EV.bottom;
  const WALL = 0.16; // drawn wall thickness in section; the real wall is a few millimeters

  function buildElevation(host, onDetail, keyEl) {
    const F = frame(EV.cx, EV.top, H, EV.S);
    const X = F.x, Y = F.y;
    const svg = S_('svg', { viewBox: '0 0 ' + EV.W + ' ' + f1(EV.Hpx), class: 'bx-elev', role: 'group',
      'aria-label': 'Half-section elevation of Super Heavy V3. The left half shows the outside; the right half is cut open on the centerline to show the tanks, the transfer tube and the engine section.' });
    const D = defs(svg, 'bxm');
    const dfs = svg.querySelector('defs');
    dfs.appendChild(S_('pattern', { id: 'bxm-lat', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
      S_('rect', { width: 5, height: 5, style: 'fill:var(--bg-3)' }),
      S_('path', { d: 'M0,0 L0,5 M0,0 L5,0', style: 'stroke:var(--steel-2);stroke-width:0.8' })));
    dfs.appendChild(S_('clipPath', { id: 'bxm-clipL' }, S_('rect', { x: 0, y: f1(Y(G.ySk)), width: f1(X(0)), height: 200 })));
    dfs.appendChild(S_('clipPath', { id: 'bxm-clipR' }, S_('rect', { x: f1(X(0)), y: 0, width: EV.W, height: f1(EV.Hpx) })));
    const lat = 'url(#bxm-lat)';

    const lay = {};
    ['engL', 'shell', 'seams', 'sect', 'ext', 'top', 'dims', 'labels'].forEach((k) => { lay[k] = S_('g'); svg.appendChild(lay[k]); });
    lay.seams.setAttribute('pointer-events', 'none');
    lay.dims.setAttribute('pointer-events', 'none');
    host.appendChild(svg);

    const rectM = (x0, y0, x1, y1, attrs) => S_('rect', Object.assign({ x: f1(X(x0)), y: f1(Y(y1)), width: f1((x1 - x0) * EV.S), height: f1((y1 - y0) * EV.S) }, attrs || {}));

    /* ---- engines, left half (exterior): only the bells below the skirt show */
    const engL = S_('g', { 'clip-path': 'url(#bxm-clipL)' });
    lay.engL.appendChild(engL);
    ENGINES.filter((e) => e.bx - 0.61 < 0).sort((a, b) => b.by - a.by).forEach((e) => {
      const g = partG(engL, e.part, 'bx-engG', { tipExtra: e.gimbal ? 'Gimbals and relights' : 'Fixed; relights on V3' });
      const s = engineShape(F, e.bx, 0, G.exitD / 2);
      g.appendChild(S_('path', { class: 'bx-eng bx-hl', d: s.nozzle }));
      g.appendChild(S_('path', { class: 'bx-eng-rib', d: s.ribs }));
      g.appendChild(S_('path', { class: 'bx-eng-hot', d: s.hot }));
    });

    /* ---- exterior shell bands (left half), each clickable as the part at that height */
    const bands = [
      ['booster.thrustSection', G.ySk, G.yAD],
      ['booster.loxTank', G.yAD, G.yCD],
      ['booster.ch4Tank', G.yCD, G.yFD],
      ['booster.ch4Tank.forwardDome', G.yFD, G.fwdSkirtTop],
    ];
    bands.forEach(([id, a, b]) => {
      const g = partG(lay.shell, id, 'bx-big');
      g.appendChild(rectM(-R, a, 0, b, { class: 'bx-ext', style: 'fill:' + D.steel }));
      g.appendChild(S_('path', { class: 'bx-ol bx-hl', d: 'M' + F.pt(-R, a) + ' L' + F.pt(-R, b) }));
      g.appendChild(S_('path', { class: 'bx-ol-2', style: 'opacity:0.7', d: 'M' + F.pt(0, a) + ' L' + F.pt(-R, a) }));
    });
    // ring seams: schematic spacing from the V1/V2 ring height (V3 rings are not published)
    const ring = SX.val('booster.ringHeightV2', 1.83);
    let sd = '';
    for (let yy = G.ySk + ring; yy < G.fwdSkirtTop - 0.3; yy += ring) sd += 'M' + F.pt(-R, yy) + ' L' + F.pt(0, yy) + ' ';
    lay.seams.appendChild(S_('path', { class: 'bx-seam', d: sd }));

    /* ---- section half: the void, then propellant, walls, domes, tube, landing tank, thrust structure */
    lay.sect.appendChild(rectM(0, G.ySk, R, G.fwdSkirtTop, { class: 'bx-void' }));

    const gLOX = partG(lay.sect, 'booster.loxTank', 'bx-big');
    const loxFill = S_('path', { class: 'bx-lox' });
    const loxSurf = S_('path', { class: 'bx-lox-s' });
    gLOX.appendChild(loxFill); gLOX.appendChild(loxSurf);
    gLOX.appendChild(rectM(R - WALL, G.yAD, R, G.yCD, { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
    // main LOX feed stubs from the aft dome to the engines
    [G.rings.i, G.rings.o].forEach((xx) => gLOX.appendChild(S_('path', { class: 'bx-lox-s', style: 'stroke-width:1', d: 'M' + F.pt(xx, G.domeAD(xx) - 0.14) + ' L' + F.pt(xx, G.plate[1] + 0.05) })));

    const gCH4 = partG(lay.sect, 'booster.ch4Tank', 'bx-big');
    const ch4Fill = S_('path', { class: 'bx-ch4' });
    const ch4Surf = S_('path', { class: 'bx-ch4-s' });
    gCH4.appendChild(ch4Fill); gCH4.appendChild(ch4Surf);
    gCH4.appendChild(rectM(R - WALL, G.yCD, R, G.yFD, { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
    // grid fin actuator, inside the methane tank on V3
    gCH4.appendChild(rectM(R - WALL - 0.55, G.fin.y0 + 0.45, R - WALL, G.fin.y1 - 0.45, { class: 'bx-box' }));

    const tubeTop = G.domeCD(G.tubeR);
    const gTube = partG(lay.sect, 'booster.downcomer');
    const tubeFill = rectM(0, G.manifold, G.tubeR - 0.12, tubeTop, { class: 'bx-ch4', style: 'fill-opacity:0.42' });
    gTube.appendChild(tubeFill);
    gTube.appendChild(rectM(G.tubeR - 0.12, G.manifold, G.tubeR, tubeTop, { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
    gTube.appendChild(S_('path', { class: 'bx-ch4-s', style: 'stroke-width:1', d: 'M' + F.pt(0.35, tubeTop - 1.2) + ' L' + F.pt(0.35, G.manifold + 0.6) }));
    // methane manifold over the thrust plate, feeding the engines
    gTube.appendChild(rectM(0, G.plate[1] + 0.02, 3.3, G.manifold, { class: 'bx-ch4', style: 'fill-opacity:0.55' }));
    gTube.appendChild(S_('path', { class: 'bx-ol-2 bx-hl', d: 'M' + F.pt(0, G.manifold) + ' L' + F.pt(3.3, G.manifold) + ' L' + F.pt(3.3, G.plate[1] + 0.02) }));

    const gCD = partG(lay.sect, 'booster.commonDome');
    gCD.appendChild(S_('path', { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch, d: domeBand(F, G.domeCD, G.tubeR, R - WALL, 0.16, -1) }));

    const gAD = partG(lay.sect, 'booster.loxTank.aftDome');
    gAD.appendChild(S_('path', { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch, d: domeBand(F, G.domeAD, G.tubeR, R - WALL, 0.16, -1) }));

    const gFD = partG(lay.sect, 'booster.ch4Tank.forwardDome');
    gFD.appendChild(S_('path', { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch, d: domeBand(F, G.domeFD, 0, R - WALL, 0.16, 1) }));
    gFD.appendChild(S_('path', { class: 'bx-hid', d: poly(F, sample((x) => G.domeFD(x) + 0.5, 0, R - 0.5, 20)) }));
    gFD.appendChild(rectM(R - WALL, G.yFD, R, G.fwdSkirtTop, { class: 'bx-cut', style: 'fill:' + D.hatch }));

    const gLT = partG(lay.sect, 'booster.landingTank');
    const LT = G.landing;
    const ltR = (LT.x1 - LT.x0) / 2;
    const ltPath = 'M' + F.pt(LT.x0, LT.y0 + ltR) + ' L' + F.pt(LT.x0, LT.y1 - ltR) +
      ' A' + f1(ltR * EV.S) + ' ' + f1(ltR * EV.S) + ' 0 0 1 ' + F.pt(LT.x1, LT.y1 - ltR) +
      ' L' + F.pt(LT.x1, LT.y0 + ltR) + ' A' + f1(ltR * EV.S) + ' ' + f1(ltR * EV.S) + ' 0 0 1 ' + F.pt(LT.x0, LT.y0 + ltR) + ' Z';
    gLT.appendChild(S_('path', { class: 'bx-void', d: ltPath }));
    const ltFill = rectM(LT.x0, LT.y0, LT.x1, LT.y1, { class: 'bx-lox', style: 'fill-opacity:0.5', 'clip-path': 'url(#bxm-ltclip)' });
    dfs.appendChild(S_('clipPath', { id: 'bxm-ltclip' }, S_('path', { d: ltPath })));
    gLT.appendChild(ltFill);
    gLT.appendChild(S_('path', { class: 'bx-ol bx-hl', d: ltPath }));
    const ltFeed = S_('path', { class: 'bx-lox-line', d: 'M' + F.pt((LT.x0 + LT.x1) / 2, LT.y0) + ' L' + F.pt((LT.x0 + LT.x1) / 2, G.plate[1] + 0.05) + ' M' + F.pt((LT.x0 + LT.x1) / 2, G.plate[1] + 0.2) + ' L' + F.pt(G.rings.i, G.plate[1] + 0.2) });
    gLT.appendChild(ltFeed);

    const gTS = partG(lay.sect, 'booster.thrustSection');
    gTS.appendChild(rectM(R - WALL, G.ySk, R, G.yAD, { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
    const plateD = poly(F, [[0, G.plate[0]], [R - WALL, G.plate[0] + 0.12], [R - WALL, G.plate[1] - 0.2], [0, G.plate[1] + 0.02]], true);
    gTS.appendChild(S_('path', { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch, d: plateD }));

    // engines behind the cut plane, full height (the skirt is cut away here)
    const engR = S_('g', { 'clip-path': 'url(#bxm-clipR)' });
    lay.sect.appendChild(engR);
    ENGINES.filter((e) => e.bx + 0.61 > 0 && e.by > -0.05).sort((a, b) => b.by - a.by).forEach((e) => {
      const g = partG(engR, e.part, 'bx-engG', { tipExtra: e.gimbal ? 'Gimbals and relights' : 'Fixed; relights on V3' });
      const s = engineShape(F, e.bx, 0, G.exitD / 2);
      g.appendChild(S_('path', { class: 'bx-eng bx-hl', d: s.nozzle }));
      g.appendChild(S_('path', { class: 'bx-eng-rib', d: s.ribs }));
      g.appendChild(S_('path', { class: 'bx-eng-hot', d: s.hot }));
      // gimbal mount to the thrust plate
      g.appendChild(S_('path', { class: 'bx-ol-2', d: 'M' + F.pt(e.bx, G.engH) + ' L' + F.pt(e.bx, G.plate[0] + 0.05) }));
    });

    // inter-engine shield deck, cut on the centerline, with openings where engines pass through the cut plane
    const gSh = partG(lay.sect, 'booster.engineShield');
    const gaps = ENGINES.filter((e) => Math.abs(e.by) < 0.7 && e.bx > -0.3).map((e) => [e.bx - 0.46, e.bx + 0.46]).sort((a, b) => a[0] - b[0]);
    let xs = 0;
    gaps.concat([[R - WALL, R]]).forEach(([a, b]) => {
      if (a > xs + 0.05) gSh.appendChild(rectM(xs, G.shield[0], Math.min(a, R - WALL), G.shield[1], { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
      xs = Math.max(xs, b);
    });

    /* ---- exterior details (left half) */
    const gCh = partG(lay.ext, 'booster.chines');
    const CT = G.chineTall, CS = G.chineShort;
    gCh.appendChild(S_('path', { class: 'bx-hid bx-hl', d: poly(F, [[CS.x0, CS.y0], [CS.x0, CS.y1 - 1.5], [(CS.x0 + CS.x1) / 2, CS.y1], [CS.x1, CS.y1 - 1.5], [CS.x1, CS.y0]]) }));
    gCh.appendChild(S_('path', { class: 'bx-fin bx-hl', style: 'fill:var(--bg-3);fill-opacity:0.72', d: poly(F, [[CT.x0, CT.y0], [CT.x0, CT.y1 - 2.2], [(CT.x0 + CT.x1) / 2, CT.y1], [CT.x1, CT.y1 - 2.2], [CT.x1, CT.y0]], true) }));
    gCh.appendChild(S_('path', { class: 'bx-ol-2', style: 'opacity:0.6', d: 'M' + F.pt(CT.x0 + 0.12, CT.y0 + 0.3) + ' L' + F.pt(CT.x0 + 0.12, CT.y1 - 2.4) }));

    const gPr = partG(lay.ext, 'booster.pressurization');
    const cw = CT.x1 - CT.x0 - 0.22;
    [[4.4, 6.0], [6.3, 7.9], [12.6, 14.2], [14.5, 16.1], [24.6, 26.2], [26.5, 28.1]].forEach(([a, b]) => {
      gPr.appendChild(S_('rect', { class: 'bx-hid', x: f1(X(CT.x0 + 0.11)), y: f1(Y(b)), width: f1(cw * EV.S), height: f1((b - a) * EV.S), rx: f1(cw * EV.S / 2) }));
    });
    gPr.appendChild(S_('path', { class: 'bx-ox-line', d: 'M' + F.pt(-R + 0.05, 5.55) + ' L' + F.pt(-0.02, 5.55) }));
    gPr.appendChild(S_('path', { class: 'bx-fu-line', d: 'M' + F.pt(-R + 0.05, 5.95) + ' L' + F.pt(-0.02, 5.95) }));
    [-3.7, -1.3].forEach((xx) => gPr.appendChild(rectM(xx - 0.25, 5.4, xx + 0.25, 6.1, { class: 'bx-box' })));

    const gAv = partG(lay.ext, 'booster.avionics');
    [[9.0, 10.3], [18.2, 19.5], [20.2, 21.5]].forEach(([a, b]) => {
      gAv.appendChild(rectM(CT.x0 + 0.11, a, CT.x1 - 0.11, b, { class: 'bx-hid', style: 'stroke-dasharray:2 2' }));
    });

    const gRw = partG(lay.ext, 'booster.raceway');
    const RW = G.raceway;
    gRw.appendChild(rectM(RW.x0, RW.y0, RW.x1, RW.y1, { class: 'bx-fin bx-hl', style: 'fill:var(--bg-3)' }));
    let rwt = '';
    for (let yy = RW.y0 + 1; yy < RW.y1; yy += 2) rwt += 'M' + F.pt(RW.x0, yy) + ' L' + F.pt(RW.x1, yy) + ' ';
    gRw.appendChild(S_('path', { class: 'bx-seam', style: 'opacity:0.9', d: rwt }));

    const gQD = partG(lay.ext, 'booster.qds');
    [[-1.7, -0.9, 'lox'], [-4.1, -3.3, 'ch4']].forEach(([a, b, k]) => {
      gQD.appendChild(rectM(a, 2.55, b, 3.45, { class: 'bx-box bx-hl' }));
      gQD.appendChild(S_('circle', { cx: f1(X((a + b) / 2)), cy: f1(Y(3.0)), r: 2.6, style: 'fill:var(--' + k + ')' }));
    });

    /* ---- top: grid fins, catch points, integrated hot stage */
    const FN = G.fin;
    const gFin = partG(lay.top, 'booster.gridfins');
    gFin.appendChild(rectM(-R - FN.span, FN.y0, -R, FN.y1, { class: 'bx-fin bx-hl', style: 'fill:' + lat }));
    gFin.appendChild(rectM(R, FN.y0, R + FN.span, FN.y1, { class: 'bx-fin bx-hl', style: 'fill:' + lat }));
    gFin.appendChild(rectM(R, FN.y0, R + 0.35, FN.y1, { class: 'bx-cut', style: 'fill:' + D.hatch }));
    gFin.appendChild(S_('path', { class: 'bx-ol-2', d: 'M' + F.pt(R - WALL - 0.3, (FN.y0 + FN.y1) / 2) + ' L' + F.pt(R + 0.3, (FN.y0 + FN.y1) / 2) }));

    const gCa = partG(lay.top, 'booster.catch');
    [[-R - 0.95, -R], [R, R + 0.95]].forEach(([a, b]) => gCa.appendChild(rectM(a, FN.y0 - 0.42, b, FN.y0, { class: 'bx-box bx-hl', style: 'fill:var(--steel-2);fill-opacity:0.55' })));
    gCa.appendChild(rectM(-R - 3.4, FN.y0 - 1.55, -R - 0.12, FN.y0 - 0.5, { class: 'bx-ghost' }));
    gCa.appendChild(S_('text', { class: 'bx-ghost-t', x: f1(X(-R - 3.4)), y: f1(Y(FN.y0 - 1.55) + 11) }, 'TOWER ARM'));

    const gHs = partG(lay.top, 'booster.hsr');
    const t0 = G.fwdSkirtTop, t1 = G.trussTop;
    const posts = [-R, -R * 0.62, -R * 0.2];
    let tr = '';
    posts.forEach((px) => { tr += 'M' + F.pt(px, t0) + ' L' + F.pt(px, t1) + ' '; });
    for (let i = 0; i < posts.length - 1; i++) {
      tr += 'M' + F.pt(posts[i], t0) + ' L' + F.pt(posts[i + 1], t1) + ' M' + F.pt(posts[i + 1], t0) + ' L' + F.pt(posts[i], t1) + ' ';
    }
    tr += 'M' + F.pt(-R * 0.2, t0) + ' L' + F.pt(0, t1) + ' ';
    gHs.appendChild(S_('rect', { x: f1(X(-R)), y: f1(Y(t1)), width: f1(R * EV.S), height: f1((t1 - t0) * EV.S), style: 'fill:transparent' }));
    gHs.appendChild(S_('path', { class: 'bx-ol bx-hl', d: tr }));
    let trb = '';
    [R * 0.25, R * 0.7].forEach((px) => { trb += 'M' + F.pt(px, t0) + ' L' + F.pt(px, t1) + ' '; });
    trb += 'M' + F.pt(R * 0.25, t0) + ' L' + F.pt(R * 0.7, t1) + ' M' + F.pt(R * 0.7, t0) + ' L' + F.pt(R - WALL, t1);
    gHs.appendChild(S_('path', { class: 'bx-ol-2', style: 'opacity:0.55', d: trb }));
    gHs.appendChild(rectM(R - WALL, t0, R, t1, { class: 'bx-cut', style: 'fill:' + D.hatch }));
    gHs.appendChild(rectM(-R, t1, 0, H, { class: 'bx-fin bx-hl', style: 'fill:' + D.steel }));
    gHs.appendChild(rectM(0, t1, R, H, { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
    gHs.appendChild(rectM(R - 0.75, t1 - 0.45, R - WALL, t1, { class: 'bx-box' }));
    // ship exhaust during hot staging: onto the dome, out through the truss
    const pl = 'M' + F.pt(1.2, t1 - 0.1) + ' Q' + F.pt(1.4, t0 + 0.2) + ' ' + F.pt(R + 1.0, t0 + 0.55) +
      ' M' + F.pt(2.6, t1 - 0.1) + ' Q' + F.pt(2.8, t0 + 0.5) + ' ' + F.pt(R + 1.1, t0 + 1.2);
    gHs.appendChild(S_('path', { class: 'bx-plume', d: pl }));
    gHs.appendChild(S_('path', { class: 'bx-plume', style: 'fill:var(--plume);stroke:none', d: 'M' + F.pt(R + 1.0, t0 + 0.55) + ' l-6,-3 l1,6 Z M' + F.pt(R + 1.1, t0 + 1.2) + ' l-6,-3 l1,6 Z' }));

    /* ---- drafting marks: centerline, dimensions, detail callout */
    const dm = lay.dims;
    dm.appendChild(S_('path', { class: 'bx-cl', d: 'M' + F.pt(0, H + 1.4) + ' L' + F.pt(0, -1.0) }));
    const hDim = S_('g');
    dm.appendChild(hDim);
    let hText = null;
    const drawHeightDim = (xd) => {
      hDim.textContent = '';
      hDim.appendChild(S_('path', { class: 'bx-dim', d: 'M' + (xd - 6) + ',' + f1(Y(H)) + ' L' + f1(X(-R) - 5) + ',' + f1(Y(H)) + ' M' + (xd - 6) + ',' + f1(Y(0)) + ' L' + (xd + 16) + ',' + f1(Y(0)) }));
      hDim.appendChild(S_('path', { class: 'bx-dim', d: 'M' + xd + ',' + f1(Y(H)) + ' L' + xd + ',' + f1(Y(0)) + ' M' + (xd - 4) + ',' + f1(Y(H) + 4) + ' L' + (xd + 4) + ',' + f1(Y(H) - 4) + ' M' + (xd - 4) + ',' + f1(Y(0) + 4) + ' L' + (xd + 4) + ',' + f1(Y(0) - 4) }));
      hDim.appendChild(S_('rect', { x: xd - 13, y: f1(Y(H / 2) - 34), width: 14, height: 68, style: 'fill:var(--bg)' }));
      hText = S_('text', { class: 'bx-dim-t', x: xd - 5, y: f1(Y(H / 2)), 'text-anchor': 'middle', transform: 'rotate(-90 ' + (xd - 5) + ' ' + f1(Y(H / 2)) + ')' }, SX.fmt('booster.height'));
      hDim.appendChild(hText);
    };
    drawHeightDim(26);
    const yd = 24;
    dm.appendChild(S_('path', { class: 'bx-dim', d: 'M' + f1(X(-R)) + ',' + f1(Y(H) - 4) + ' L' + f1(X(-R)) + ',' + (yd - 6) + ' M' + f1(X(R)) + ',' + f1(Y(H) - 4) + ' L' + f1(X(R)) + ',' + (yd - 6) +
      ' M' + f1(X(-R)) + ',' + yd + ' L' + f1(X(R)) + ',' + yd + ' M' + f1(X(-R) - 4) + ',' + (yd + 4) + ' L' + f1(X(-R) + 4) + ',' + (yd - 4) + ' M' + f1(X(R) - 4) + ',' + (yd + 4) + ' L' + f1(X(R) + 4) + ',' + (yd - 4) }));
    dm.appendChild(S_('rect', { x: f1(X(0) - 26), y: yd - 9, width: 52, height: 15, style: 'fill:var(--bg)' }));
    const dText = S_('text', { class: 'bx-dim-t', x: f1(X(0)), y: yd + 4, 'text-anchor': 'middle' });
    dm.appendChild(dText);
    // estimated barrel lengths, drawn inside the section in the estimate colour
    const xe = 4.05;
    const estDim = (a, b) => {
      dm.appendChild(S_('path', { class: 'bx-dim-e bx-dim-l', d: 'M' + F.pt(xe, a) + ' L' + F.pt(xe, b) + ' M' + f1(X(xe) - 3) + ',' + f1(Y(a) + 3) + ' L' + f1(X(xe) + 3) + ',' + f1(Y(a) - 3) + ' M' + f1(X(xe) - 3) + ',' + f1(Y(b) + 3) + ' L' + f1(X(xe) + 3) + ',' + f1(Y(b) - 3) }));
      const ym = Y((a + b) / 2);
      const t = S_('text', { class: 'bx-dim-e', x: f1(X(xe) - 4), y: f1(ym), 'text-anchor': 'middle', transform: 'rotate(-90 ' + f1(X(xe) - 4) + ' ' + f1(ym) + ')' });
      dm.appendChild(t);
      return t;
    };
    const loxDimT = estDim(G.yAD, G.yCD);
    const ch4DimT = estDim(G.yCD, G.yFD);

    const callout = S_('g', { class: 'bx-callout-g', tabindex: '0', role: 'button', 'aria-label': 'Go to detail B, the engine section' });
    callout.appendChild(S_('rect', { class: 'bx-callout', x: f1(X(-R - 0.7)), y: f1(Y(12.0)), width: f1((2 * R + 1.4) * EV.S), height: f1(13.1 * EV.S), rx: 14 }));
    callout.appendChild(S_('circle', { cx: f1(X(0)), cy: f1(Y(-1.1)), r: 9, style: 'fill:var(--bg);stroke:var(--accent);stroke-width:1' }));
    callout.appendChild(S_('text', { class: 'bx-callout-t', x: f1(X(0)), y: f1(Y(-1.1) + 4), 'text-anchor': 'middle' }, 'B'));
    svg.appendChild(callout);
    const goDetail = () => onDetail && onDetail();
    callout.addEventListener('click', goDetail);
    callout.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goDetail(); } });
    callout.addEventListener('pointerenter', (e) => SX.tip.show('<b>Detail B</b>The engine section, enlarged: thrust plate, landing tank, COPVs, shielding and quick disconnects.', e.clientX, e.clientY));
    callout.addEventListener('pointerleave', () => SX.tip.hide());

    /* ---- labels */
    function labels() {
      const eIn = ENGINES.find((e) => e.ring === 'i' && e.bx > 1 && e.by > -0.05);
      const approx = (k) => '≈ ' + SX.fmt(k);
      return [
        { part: 'booster.hsr', text: 'HOT-STAGE TRUSS', sub: 'INTEGRATED, V3', x: -R * 0.81, y: (t0 + t1) / 2, side: 'L' },
        { part: 'booster.gridfins', text: 'GRID FIN', sub: 'LIFT + CATCH', x: -R - FN.span * 0.55, y: FN.y1 - 0.2, side: 'L' },
        { part: 'booster.catch', text: 'CATCH POINT', x: -R - 0.5, y: FN.y0 - 0.25, side: 'L' },
        { part: 'booster.raceway', text: 'RACEWAY', x: (RW.x0 + RW.x1) / 2, y: 52, side: 'L' },
        { part: 'booster.chines', text: 'CHINE', sub: 'TALL PAIR', x: CT.x0 + 0.1, y: 31, side: 'L' },
        { part: 'booster.avionics', text: 'AVIONICS', sub: 'IN CHINE', x: (CT.x0 + CT.x1) / 2, y: 20.8, side: 'L' },
        { part: 'booster.pressurization', text: 'COPVs', sub: 'IN CHINE', x: (CT.x0 + CT.x1) / 2, y: 15.3, side: 'L' },
        { part: 'booster.thrustSection', text: 'AFT SKIRT', x: -R + 0.3, y: 4.6, side: 'L' },
        { part: 'booster.enginesOuter', text: 'OUTER RING', sub: 'FIXED, RELIGHTS', x: -3.3, y: 0.9, side: 'L' },
        { part: 'booster.ch4Tank.forwardDome', text: 'FORWARD DOME', sub: 'TAKES SHIP EXHAUST', x: 1.6, y: G.domeFD(1.6) - 0.1, side: 'R' },
        { part: 'booster.ch4Tank', text: 'METHANE TANK', sub: approx('booster.propCH4'), x: 2.6, y: 58, side: 'R' },
        { part: 'booster.commonDome', text: 'COMMON DOME', x: 3.1, y: G.domeCD(3.1) - 0.08, side: 'R' },
        { part: 'booster.downcomer', text: 'TRANSFER TUBE', sub: 'CH4 TO THE ENGINES', x: G.tubeR * 0.5, y: 36, side: 'R' },
        { part: 'booster.loxTank', text: 'LOX TANK', sub: approx('booster.propLOX'), x: 2.8, y: 26, side: 'R' },
        { part: 'booster.landingTank', text: 'LANDING TANK', sub: 'POSITION SCHEMATIC', x: LT.x1 - 0.2, y: (LT.y0 + LT.y1) / 2 + 0.6, side: 'R' },
        { part: 'booster.thrustSection', text: 'THRUST PLATE', x: 3.6, y: G.plate[0] + 0.4, side: 'R' },
        { part: 'booster.engineShield', text: 'ENGINE SHIELD', x: 1.3, y: (G.shield[0] + G.shield[1]) / 2, side: 'R' },
        { part: 'booster.enginesInner', text: 'GIMBAL ENGINES', sub: 'CENTER + INNER', x: eIn ? eIn.bx + 0.2 : 2.2, y: 0.9, side: 'R' },
      ].map((l) => ({ part: l.part, text: l.text, sub: l.sub, side: l.side, ax: X(l.x), ay: Y(l.y) }));
    }
    let mode = 'label';
    function relabel() {
      unregLabels(lay.labels);
      drawLabels(lay.labels, labels(), { mode, keyEl, collect: mainLabelIds, xL: X(-R - FN.span) - 12, xR: X(R + FN.span) + 12, bL: X(-R - FN.span) - 13, bR: X(R + FN.span) + 13,
        fs: 12, fsSub: 10.5, top: 36, bottom: Y(0) - 2, shoulder: 10, pad: 5 });
    }
    watchMode(host, 440, (m) => {
      mode = m;
      if (m === 'balloon') {
        const x0 = X(-R - FN.span) - 50, x1 = X(R + FN.span) + 26;
        svg.setAttribute('viewBox', f1(x0) + ' 0 ' + f1(x1 - x0) + ' ' + f1(EV.Hpx));
        drawHeightDim(x0 + 16);
      } else {
        svg.setAttribute('viewBox', '0 0 ' + EV.W + ' ' + f1(EV.Hpx));
        drawHeightDim(26);
      }
      relabel();
    });
    function units() {
      hText.textContent = SX.fmt('booster.height');
      dText.textContent = SX.fmt('booster.diameter');
      loxDimT.textContent = '≈ ' + SX.fmt('booster.loxBarrel', { digits: 0 }) + ' EST.';
      ch4DimT.textContent = '≈ ' + SX.fmt('booster.ch4Barrel', { digits: 0 }) + ' EST.';
      relabel();
    }
    function setLevels(lv, phase) {
      const lox = liquid(F, G.tubeR, R - WALL, (x) => G.domeAD(x), (x) => G.domeCD(x) - 0.16, lv.lox);
      loxFill.setAttribute('d', lox.fill); loxSurf.setAttribute('d', lox.surface);
      const ch4 = liquid(F, 0, R - WALL, (x) => (x < G.tubeR ? tubeTop : G.domeCD(x)), (x) => G.domeFD(x) - 0.16, lv.ch4);
      ch4Fill.setAttribute('d', ch4.fill); ch4Surf.setAttribute('d', ch4.surface);
      const h = (LT.y1 - LT.y0) * SX.clamp(lv.land, 0, 1);
      ltFill.setAttribute('y', f1(Y(LT.y0 + h)));
      ltFill.setAttribute('height', f1(h * EV.S));
      ltFeed.classList.toggle('is-on', phase === 'landing');
    }
    units();
    return { svg, units, setLevels };
  }

  /* ================================================================== detail B: the engine section, enlarged */

  const DB = { W: 546, top: 18, bottom: 18, S: 24, cx: 273, yMax: 12.4, yMin: -0.5 };
  DB.Hpx = DB.top + (DB.yMax - DB.yMin) * DB.S + DB.bottom;

  function buildDetail(host, keyEl) {
    const F = frame(DB.cx, DB.top, DB.yMax, DB.S);
    const X = F.x, Y = F.y;
    const svg = S_('svg', { viewBox: '0 0 ' + DB.W + ' ' + f1(DB.Hpx), class: 'bx-det', role: 'group',
      'aria-label': 'Detail B: the aft end of Super Heavy V3, enlarged. Left half exterior, right half in section.' });
    const D = defs(svg, 'bxd');
    const dfs = svg.querySelector('defs');
    dfs.appendChild(S_('clipPath', { id: 'bxd-clipL' }, S_('rect', { x: 0, y: f1(Y(G.ySk)), width: f1(X(0)), height: 400 })));
    dfs.appendChild(S_('clipPath', { id: 'bxd-clipR' }, S_('rect', { x: f1(X(0)), y: 0, width: DB.W, height: f1(DB.Hpx) })));
    const lay = {};
    ['engL', 'shell', 'seams', 'sect', 'ext', 'marks', 'labels'].forEach((k) => { lay[k] = S_('g'); svg.appendChild(lay[k]); });
    lay.seams.setAttribute('pointer-events', 'none');
    lay.marks.setAttribute('pointer-events', 'none');
    host.appendChild(svg);
    const rectM = (x0, y0, x1, y1, attrs) => S_('rect', Object.assign({ x: f1(X(x0)), y: f1(Y(y1)), width: f1((x1 - x0) * DB.S), height: f1((y1 - y0) * DB.S) }, attrs || {}));
    const top = DB.yMax;

    const drawEngine = (parent, e, full) => {
      const g = partG(parent, e.part, 'bx-engG', { tipExtra: e.gimbal ? 'Gimbals and relights' : 'Fixed; relights on V3' });
      const s = engineShape(F, e.bx, 0, G.exitD / 2);
      g.appendChild(S_('path', { class: 'bx-eng bx-hl', d: s.nozzle }));
      g.appendChild(S_('path', { class: 'bx-eng-rib', d: s.ribs }));
      g.appendChild(S_('path', { class: 'bx-eng-hot', d: s.hot }));
      if (full) g.appendChild(S_('path', { class: 'bx-ol-2', d: 'M' + F.pt(e.bx, G.engH) + ' L' + F.pt(e.bx, G.plate[0] + 0.05) }));
      return g;
    };

    /* left half, exterior */
    const engL = S_('g', { 'clip-path': 'url(#bxd-clipL)' });
    lay.engL.appendChild(engL);
    ENGINES.filter((e) => e.bx - 0.61 < 0).sort((a, b) => b.by - a.by).forEach((e) => drawEngine(engL, e, false));

    [['booster.thrustSection', G.ySk, G.yAD], ['booster.loxTank', G.yAD, top]].forEach(([id, a, b]) => {
      const g = partG(lay.shell, id, 'bx-big');
      g.appendChild(rectM(-R, a, 0, b, { class: 'bx-ext', style: 'fill:' + D.steel }));
      g.appendChild(S_('path', { class: 'bx-ol bx-hl', d: 'M' + F.pt(0, a) + ' L' + F.pt(-R, a) + ' L' + F.pt(-R, b) }));
    });
    const ring = SX.val('booster.ringHeightV2', 1.83);
    let sd = '';
    for (let yy = G.ySk + ring; yy < top; yy += ring) sd += 'M' + F.pt(-R, yy) + ' L' + F.pt(0, yy) + ' ';
    lay.seams.appendChild(S_('path', { class: 'bx-seam', d: sd }));

    /* right half, section */
    lay.sect.appendChild(rectM(0, G.ySk, R, top, { class: 'bx-void' }));
    const gLOX = partG(lay.sect, 'booster.loxTank', 'bx-big');
    const loxFill = S_('path', { class: 'bx-lox' });
    const loxSurf = S_('path', { class: 'bx-lox-s' });
    gLOX.appendChild(loxFill); gLOX.appendChild(loxSurf);
    gLOX.appendChild(rectM(R - WALL * 0.7, G.yAD, R, top, { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
    [G.rings.i + 0.35, G.rings.o].forEach((xx) => gLOX.appendChild(S_('path', { class: 'bx-lox-s', style: 'stroke-width:1.4', d: 'M' + F.pt(xx, G.domeAD(xx) - 0.1) + ' L' + F.pt(xx, G.plate[1] - 0.05) })));

    const gAD = partG(lay.sect, 'booster.loxTank.aftDome');
    gAD.appendChild(S_('path', { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch, d: domeBand(F, G.domeAD, G.tubeR, R - WALL * 0.7, 0.12, -1) }));

    const gTube = partG(lay.sect, 'booster.downcomer');
    gTube.appendChild(rectM(0, G.manifold, G.tubeR - 0.09, top, { class: 'bx-ch4', style: 'fill-opacity:0.42' }));
    gTube.appendChild(rectM(G.tubeR - 0.09, G.manifold, G.tubeR, top, { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
    gTube.appendChild(rectM(0, G.plate[1] + 0.02, 3.3, G.manifold, { class: 'bx-ch4', style: 'fill-opacity:0.55' }));
    gTube.appendChild(S_('path', { class: 'bx-ol-2 bx-hl', d: 'M' + F.pt(G.tubeR, G.manifold) + ' L' + F.pt(3.3, G.manifold) + ' L' + F.pt(3.3, G.plate[1] + 0.02) }));
    gTube.appendChild(S_('path', { class: 'bx-ch4-s', style: 'stroke-width:1.2', d: 'M' + F.pt(0.45, top - 0.4) + ' L' + F.pt(0.45, G.manifold + 0.4) + ' M' + F.pt(0.28, G.manifold + 0.75) + ' L' + F.pt(0.45, G.manifold + 0.4) + ' L' + F.pt(0.62, G.manifold + 0.75) }));

    const LT = G.landing;
    const ltR = (LT.x1 - LT.x0) / 2;
    const ltPath = 'M' + F.pt(LT.x0, LT.y0 + ltR) + ' L' + F.pt(LT.x0, LT.y1 - ltR) +
      ' A' + f1(ltR * DB.S) + ' ' + f1(ltR * DB.S) + ' 0 0 1 ' + F.pt(LT.x1, LT.y1 - ltR) +
      ' L' + F.pt(LT.x1, LT.y0 + ltR) + ' A' + f1(ltR * DB.S) + ' ' + f1(ltR * DB.S) + ' 0 0 1 ' + F.pt(LT.x0, LT.y0 + ltR) + ' Z';
    dfs.appendChild(S_('clipPath', { id: 'bxd-ltclip' }, S_('path', { d: ltPath })));
    const gLT = partG(lay.sect, 'booster.landingTank');
    gLT.appendChild(S_('path', { class: 'bx-void', d: ltPath }));
    const ltFill = rectM(LT.x0, LT.y0, LT.x1, LT.y1, { class: 'bx-lox', style: 'fill-opacity:0.5', 'clip-path': 'url(#bxd-ltclip)' });
    gLT.appendChild(ltFill);
    gLT.appendChild(S_('path', { class: 'bx-ol bx-hl', d: ltPath }));
    const xm = (LT.x0 + LT.x1) / 2;
    const ltFeed = S_('path', { class: 'bx-lox-line', d: 'M' + F.pt(xm, LT.y0) + ' L' + F.pt(xm, G.plate[1] + 0.3) + ' L' + F.pt(G.rings.c, G.plate[1] + 0.3) + ' M' + F.pt(G.rings.i, G.plate[1] + 0.3) + ' L' + F.pt(G.rings.i, G.plate[1] - 0.02) });
    gLT.appendChild(ltFeed);
    // COPV pressurant line into the landing tank (reported: pressurized from COPVs)
    gLT.appendChild(S_('path', { class: 'bx-ox-line', style: 'stroke-dasharray:2 2', d: 'M' + F.pt(LT.x1, LT.y1 - ltR) + ' L' + F.pt(R - 0.2, LT.y1 - ltR) }));

    const gTS = partG(lay.sect, 'booster.thrustSection');
    gTS.appendChild(rectM(R - WALL * 0.7, G.ySk, R, G.yAD, { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
    gTS.appendChild(S_('path', { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch, d: poly(F, [[0, G.plate[0]], [R - 0.1, G.plate[0] + 0.12], [R - 0.1, G.plate[1] - 0.2], [0, G.plate[1] + 0.02]], true) }));
    // metallic tiles on the underside of the plate
    let tiles = '';
    for (let xx = 0.3; xx < R - 0.2; xx += 0.42) tiles += 'M' + F.pt(xx, G.plate[0] + 0.012 * xx) + ' l0,4 ';
    gTS.appendChild(S_('path', { class: 'bx-seam', style: 'opacity:0.9', d: tiles }));

    const engR = S_('g', { 'clip-path': 'url(#bxd-clipR)' });
    lay.sect.appendChild(engR);
    const rightEng = ENGINES.filter((e) => e.bx + 0.61 > 0 && e.by > -0.05).sort((a, b) => b.by - a.by);
    rightEng.forEach((e) => drawEngine(engR, e, true));

    const gTVC = partG(lay.sect, 'booster.thrustSection.tvc');
    rightEng.filter((e) => e.gimbal && e.bx > 0.2).forEach((e) => {
      const a = [e.bx + 0.62, G.plate[0] + 0.02], b = [e.bx + 0.3, 2.05];
      gTVC.appendChild(S_('path', { class: 'bx-ol bx-hl', style: 'stroke-width:2.2', d: 'M' + F.pt(a[0], a[1]) + ' L' + F.pt(b[0], b[1]) }));
      gTVC.appendChild(S_('circle', { cx: f1(X(b[0])), cy: f1(Y(b[1])), r: 2.2, style: 'fill:var(--steel)' }));
    });

    const gSh = partG(lay.sect, 'booster.engineShield');
    const gaps = ENGINES.filter((e) => Math.abs(e.by) < 0.7 && e.bx > -0.3).map((e) => [e.bx - 0.46, e.bx + 0.46]).sort((a, b) => a[0] - b[0]);
    let xs = 0;
    gaps.concat([[R - WALL * 0.7, R]]).forEach(([a, b]) => {
      if (a > xs + 0.05) gSh.appendChild(rectM(xs, G.shield[0], Math.min(a, R - WALL * 0.7), G.shield[1], { class: 'bx-cut bx-hl', style: 'fill:' + D.hatch }));
      xs = Math.max(xs, b);
    });

    /* exterior details */
    const CT = G.chineTall, CS = G.chineShort;
    const gCh = partG(lay.ext, 'booster.chines');
    gCh.appendChild(S_('path', { class: 'bx-hid bx-hl', d: poly(F, [[CS.x0, CS.y0], [CS.x0, top], [CS.x1, top], [CS.x1, CS.y0]]) }));
    gCh.appendChild(rectM(CT.x0, CT.y0, CT.x1, top, { class: 'bx-fin bx-hl', style: 'fill:var(--bg-3);fill-opacity:0.8' }));
    // breakout: a wavy break line opens the chine to show what is inside
    const gPr = partG(lay.ext, 'booster.pressurization');
    const cx0 = CT.x0 + 0.1, cx1 = CT.x1 - 0.1;
    [[4.2, 5.8], [6.1, 7.7], [10.6, 12.2]].forEach(([a, b]) => {
      gPr.appendChild(S_('rect', { class: 'bx-copv bx-hl', x: f1(X(cx0)), y: f1(Y(b)), width: f1((cx1 - cx0) * DB.S), height: f1((b - a) * DB.S), rx: f1((cx1 - cx0) * DB.S / 2) }));
    });
    gPr.appendChild(S_('path', { class: 'bx-ox-line', d: 'M' + F.pt(-R + 0.05, 5.55) + ' L' + F.pt(-0.02, 5.55) }));
    gPr.appendChild(S_('path', { class: 'bx-fu-line', d: 'M' + F.pt(-R + 0.05, 5.95) + ' L' + F.pt(-0.02, 5.95) }));
    [-3.9, -1.3].forEach((xx) => gPr.appendChild(rectM(xx - 0.22, 5.35, xx + 0.22, 6.15, { class: 'bx-box' })));
    const gAv = partG(lay.ext, 'booster.avionics');
    [[8.1, 9.2], [9.4, 10.4]].forEach(([a, b]) => {
      gAv.appendChild(rectM(cx0, a, cx1, b, { class: 'bx-box bx-hl' }));
      gAv.appendChild(S_('path', { class: 'bx-seam', style: 'opacity:1', d: 'M' + F.pt(cx0 + 0.12, (a + b) / 2) + ' L' + F.pt(cx1 - 0.12, (a + b) / 2) }));
    });
    lay.marks.appendChild(S_('path', { class: 'bx-ol-2', d: 'M' + F.pt(CT.x0, 3.95) + ' q4,-3 8,0 t8,0' }));

    const gQD = partG(lay.ext, 'booster.qds');
    [[-1.7, -0.9, 'lox'], [-4.1, -3.3, 'ch4']].forEach(([a, b, k]) => {
      gQD.appendChild(rectM(a, 2.55, b, 3.45, { class: 'bx-box bx-hl' }));
      gQD.appendChild(S_('circle', { cx: f1(X((a + b) / 2)), cy: f1(Y(3.0)), r: 5, style: 'fill:var(--' + k + ');fill-opacity:0.75' }));
    });

    /* marks: centerline, break line across the top, a person for scale, the exit plane */
    const mk = lay.marks;
    mk.appendChild(S_('path', { class: 'bx-cl', d: 'M' + F.pt(0, top + 0.3) + ' L' + F.pt(0, DB.yMin + 0.1) }));
    let br = 'M' + F.pt(-R - 0.2, top);
    for (let i = 0; i < 12; i++) {
      const x0 = -R + (2 * R) * (i / 12), x1 = -R + (2 * R) * ((i + 0.5) / 12), x2 = -R + (2 * R) * ((i + 1) / 12);
      br += ' L' + F.pt(x0, top) + ' L' + F.pt(x1, top + 0.14) + ' L' + F.pt(x2, top - 0.14);
    }
    br += ' L' + F.pt(R + 0.2, top);
    mk.appendChild(S_('path', { class: 'bx-ol', style: 'stroke:var(--bg);stroke-width:5', d: br }));
    mk.appendChild(S_('path', { class: 'bx-ol', d: br }));
    // person, about 1.8 m tall, standing on the nozzle exit plane
    const px = -R - 0.55, s = DB.S;
    const pp = [
      'M' + f1(X(px)) + ',' + f1(Y(1.52)) + ' m-4.2,0 a4.2,4.2 0 1,0 8.4,0 a4.2,4.2 0 1,0 -8.4,0',
      'M' + f1(X(px) - 0.19 * s) + ',' + f1(Y(1.38)) + ' L' + f1(X(px) + 0.19 * s) + ',' + f1(Y(1.38)) + ' L' + f1(X(px) + 0.16 * s) + ',' + f1(Y(0.85)) + ' L' + f1(X(px) + 0.13 * s) + ',' + f1(Y(0)) + ' L' + f1(X(px) + 0.02 * s) + ',' + f1(Y(0)) + ' L' + f1(X(px)) + ',' + f1(Y(0.6)) + ' L' + f1(X(px) - 0.02 * s) + ',' + f1(Y(0)) + ' L' + f1(X(px) - 0.13 * s) + ',' + f1(Y(0)) + ' L' + f1(X(px) - 0.16 * s) + ',' + f1(Y(0.85)) + ' Z',
    ];
    mk.appendChild(S_('path', { d: pp.join(' '), style: 'fill:var(--muted);opacity:0.7' }));
    mk.appendChild(S_('path', { class: 'bx-dim', style: 'stroke-dasharray:2 3', d: 'M' + F.pt(-R - 1.0, 0) + ' L' + F.pt(R + 0.4, 0) }));

    function labels() {
      const eIn = rightEng.find((e) => e.ring === 'i' && e.bx > 1.2);
      const eC = rightEng.find((e) => e.ring === 'c');
      const eO = ENGINES.filter((e) => e.ring === 'o' && e.bx < -3).sort((a, b) => a.by - b.by)[0];
      return [
        { part: 'booster.pressurization', text: 'COPVs', sub: 'START + PRESS GASES', x: (cx0 + cx1) / 2, y: 11.4, side: 'L' },
        { part: 'booster.avionics', text: 'AVIONICS', sub: 'POWER + COMPUTERS', x: (cx0 + cx1) / 2, y: 8.6, side: 'L' },
        { part: 'booster.pressurization', text: 'PRESS MANIFOLDS', sub: 'AUTOGENOUS, EXTERNAL', x: -1.8, y: 5.75, side: 'L' },
        { part: 'booster.chines', text: 'CHINE', sub: 'BROKEN OUT', x: CT.x1 - 0.05, y: 7.95, side: 'L' },
        { part: 'booster.qds', text: 'QUICK DISCONNECTS', sub: 'LOX + CH4, SEPARATE', x: -1.3, y: 3.0, side: 'L' },
        { part: 'booster.thrustSection', text: 'AFT SKIRT', sub: 'NO ENCLOSED BAY', x: -R + 0.25, y: 4.3, side: 'L' },
        { part: 'booster.enginesOuter', text: 'OUTER RING', sub: 'FIXED', x: eO ? eO.bx : -3.8, y: 0.8, side: 'L' },
        { part: 'booster.loxTank', text: 'LOX TANK', x: 3.9, y: 11.2, side: 'R' },
        { part: 'booster.downcomer', text: 'TRANSFER TUBE', sub: 'CH4 DOWN THE MIDDLE', x: 0.9, y: 9.4, side: 'R' },
        { part: 'booster.landingTank', text: 'LANDING TANK', sub: 'FEEDS INNER ENGINES', x: LT.x1 - 0.15, y: 9.0, side: 'R' },
        { part: 'booster.loxTank.aftDome', text: 'AFT DOME', x: 3.9, y: G.domeAD(3.9) - 0.06, side: 'R' },
        { part: 'booster.thrustSection', text: 'THRUST PLATE', sub: 'TAPERED, TILED', x: 4.0, y: G.plate[0] + 0.35, side: 'R' },
        { part: 'booster.thrustSection.tvc', text: 'TVC ACTUATOR', sub: 'ELECTRIC', x: eIn ? eIn.bx + 0.5 : 2.6, y: 2.6, side: 'R' },
        { part: 'booster.engineShield', text: 'ENGINE SHIELD', x: 1.35, y: (G.shield[0] + G.shield[1]) / 2, side: 'R' },
        { part: 'booster.enginesInner', text: 'INNER RING', sub: 'GIMBAL', x: eIn ? eIn.bx : 2.2, y: 0.8, side: 'R' },
        { part: 'booster.enginesCenter', text: 'CENTER ENGINE', sub: 'GIMBAL, RELIGHT', x: eC ? Math.max(0.25, eC.bx + 0.3) : 0.3, y: 0.3, side: 'R' },
      ].map((l) => ({ part: l.part, text: l.text, sub: l.sub, side: l.side, ax: X(l.x), ay: Y(l.y) }));
    }
    let mode = 'label';
    function relabel() {
      unregLabels(lay.labels);
      drawLabels(lay.labels, labels(), { mode, keyEl, tabbable: (id) => !mainLabelIds.has(id), xL: X(-R - 0.8) - 12, xR: X(R + 0.8) + 12, bL: X(-R - 0.8) - 12, bR: X(R + 0.8) + 7,
        fs: 12, fsSub: 10, top: 6, bottom: DB.Hpx - 4, shoulder: 10, pad: 4 });
    }
    watchMode(host, 480, (m) => {
      mode = m;
      if (m === 'balloon') {
        const x0 = X(-R - 0.8) - 24, x1 = X(R + 0.8) + 19;
        svg.setAttribute('viewBox', f1(x0) + ' 0 ' + f1(x1 - x0) + ' ' + f1(DB.Hpx));
      } else svg.setAttribute('viewBox', '0 0 ' + DB.W + ' ' + f1(DB.Hpx));
      relabel();
    });
    function setLevels(lv, phase) {
      const lox = liquid(F, G.tubeR, R - WALL * 0.7, (x) => G.domeAD(x), () => top, lv.lox);
      loxFill.setAttribute('d', lox.fill); loxSurf.setAttribute('d', lox.surface);
      const h = (LT.y1 - LT.y0) * SX.clamp(lv.land, 0, 1);
      ltFill.setAttribute('y', f1(Y(LT.y0 + h)));
      ltFill.setAttribute('height', f1(h * DB.S));
      ltFeed.classList.toggle('is-on', phase === 'landing');
    }
    relabel();
    return { svg, units: relabel, setLevels };
  }

  /* ================================================================== engine cluster: bottom view, phases, engine-out, gimbal */

  const CL = { W: 360, H: 318, S: 21, cx: 180, cy: 174 };
  const PHASES = [
    { id: 'liftoff', label: 'Liftoff' },
    { id: 'boostback', label: 'Boostback' },
    { id: 'landing', label: 'Landing burn' },
  ];
  /** Landing-burn engine counts parsed from the fact string ("13, then 5, then 3 engines"). */
  function landingSeq() {
    const m = String(SX.val('booster.landingBurnSequence', '13, then 5, then 3')).match(/\d+/g);
    return m && m.length >= 3 ? m.slice(0, 3).map(Number) : [13, 5, 3];
  }

  function buildCluster(host, st, hooks) {
    const T = SX.val('raptor.r3.thrustSL', 250);          // tf per engine, flight rating
    const M0 = SX.val('stack.liftoffMass', 5700);          // t, estimate
    const gMax = SX.val('raptor.r3.gimbalRange', 15);      // deg, Raptor 2 figure (estimate for Raptor 3)
    const seq = landingSeq();
    const N = (k) => SX.factHTML(k, { unitless: true });
    const FH = (k) => SX.factHTML(k);
    const px = (bx) => CL.cx + bx * CL.S;
    const py = (by) => CL.cy - by * CL.S;

    /* ---- head: title + phase buttons */
    const seg = SX.el('div', { class: 'seg', role: 'group', 'aria-label': 'Flight phase' });
    const phaseBtns = PHASES.map((p) => {
      const b = SX.el('button', { type: 'button', 'aria-pressed': 'false', onclick: () => hooks.setPhase(p.id) }, p.label);
      seg.appendChild(b);
      return b;
    });
    host.appendChild(SX.el('div', { class: 'bx-cl-head' },
      SX.el('div', null,
        SX.el('div', { class: 'bx-title' }, SX.el('b', null, 'Engine cluster'), ' · view from below'),
        SX.el('div', { class: 'bx-scale' }, 'Click an engine to shut it down')),
      seg));

    const stepBtns = seq.map((n, i) => SX.el('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', onclick: () => hooks.setStep(i, true) }, n + ' engines'));
    const playBtn = SX.el('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: () => hooks.playLanding() }, 'Replay sequence');
    const steps = SX.el('div', { class: 'bx-steps', hidden: true, role: 'group', 'aria-label': 'Landing burn steps' },
      SX.el('span', { class: 'bx-tl mono small muted' }, 'STEP'), stepBtns, SX.reducedMotion ? null : playBtn);
    host.appendChild(steps);

    /* ---- the bottom-view SVG */
    const svg = S_('svg', { viewBox: '0 0 ' + CL.W + ' ' + CL.H, class: 'bx-cl-svg', role: 'group', 'aria-label': 'The 33 booster engines seen from below. Use the arrow keys to move between engines and Enter to shut one down or restart it.' });
    const dfs = S_('defs');
    const grad = S_('radialGradient', { id: 'bx-plume-grad' },
      S_('stop', { offset: '0', style: 'stop-color:var(--mix);stop-opacity:1' }),
      S_('stop', { offset: '0.55', style: 'stop-color:var(--plume);stop-opacity:0.95' }),
      S_('stop', { offset: '1', style: 'stop-color:var(--plume);stop-opacity:0.25' }));
    dfs.appendChild(grad);
    dfs.appendChild(S_('pattern', { id: 'bxc-lat', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
      S_('rect', { width: 6, height: 6, style: 'fill:var(--bg-3)' }),
      S_('path', { d: 'M0,0 L0,6 M0,0 L6,0', style: 'stroke:var(--steel-2);stroke-width:0.9' })));
    svg.appendChild(dfs);

    const deco = S_('g', { 'pointer-events': 'none' });
    svg.appendChild(deco);
    // grid fins: two lift/catch fins left and right, the rudder fin toward the rear (top of this view)
    const span = G.fin.span, fw = 2.4;
    deco.appendChild(S_('rect', { class: 'bx-fin-b', x: f1(px(-R - span)), y: f1(py(fw / 2)), width: f1(span * CL.S), height: f1(fw * CL.S), style: 'fill:url(#bxc-lat)' }));
    deco.appendChild(S_('rect', { class: 'bx-fin-b', x: f1(px(R)), y: f1(py(fw / 2)), width: f1(span * CL.S), height: f1(fw * CL.S), style: 'fill:url(#bxc-lat)' }));
    deco.appendChild(S_('rect', { class: 'bx-fin-b', x: f1(px(-fw / 2)), y: f1(py(R + span)), width: f1(fw * CL.S), height: f1(span * CL.S), style: 'fill:url(#bxc-lat)' }));
    deco.appendChild(S_('text', { class: 'bx-tiny', x: f1(px(-R - span / 2)), y: f1(py(fw / 2) - 6), 'text-anchor': 'middle' }, 'LIFT + CATCH'));
    deco.appendChild(S_('text', { class: 'bx-tiny', x: f1(px(R + span / 2)), y: f1(py(fw / 2) - 6), 'text-anchor': 'middle' }, 'LIFT + CATCH'));
    deco.appendChild(S_('text', { class: 'bx-tiny', x: f1(px(fw / 2) + 6), y: f1(py(R + span * 0.55)) }, 'RUDDER FIN'));
    // chines: the tall pair near the raceway (front), the short pair toward the rudder fin
    [[-55, 0.8], [-125, 0.8], [35, 0.6], [145, 0.6]].forEach(([a, h]) => {
      const r0 = R, r1 = R + h, da = 5 * Math.PI / 180, t = a * Math.PI / 180;
      const P = (r, ang) => f1(px(Math.cos(ang) * r)) + ',' + f1(py(Math.sin(ang) * r));
      deco.appendChild(S_('path', { class: 'bx-chine-b', d: 'M' + P(r0, t - da) + ' L' + P(r1, t) + ' L' + P(r0, t + da) + ' Z' }));
    });
    deco.appendChild(S_('rect', { class: 'bx-chine-b', x: f1(px(-0.22)), y: f1(py(-R)), width: f1(0.44 * CL.S), height: 6 }));
    deco.appendChild(S_('circle', { class: 'bx-body', cx: CL.cx, cy: CL.cy, r: f1(R * CL.S) }));
    deco.appendChild(S_('circle', { class: 'bx-shieldbg', cx: CL.cx, cy: CL.cy, r: f1((R - 0.12) * CL.S) }));
    deco.appendChild(S_('text', { class: 'bx-tiny', x: CL.cx, y: CL.H - 8, 'text-anchor': 'middle' }, 'FRONT OF THE ELEVATION ↓  ·  RING RADII SCHEMATIC'));

    const engG = S_('g');
    svg.appendChild(engG);
    const arrowG = S_('g');
    svg.appendChild(arrowG);
    const re = G.exitD / 2 * CL.S;
    ENGINES.forEach((e, i) => {
      const g = S_('g', { class: 'bx-e' + (e.gimbal ? ' is-gimbal' : ''), 'data-part': e.part, role: 'switch', tabindex: i === 0 ? '0' : '-1' });
      const x = f1(px(e.bx)), y = f1(py(e.by));
      g.appendChild(S_('circle', { class: 'bx-e-noz', cx: x, cy: y, r: f1(re) }));
      g.appendChild(S_('circle', { class: 'bx-e-glow', cx: x, cy: y, r: f1(re - 1.5) }));
      if (e.gimbal) g.appendChild(S_('circle', { class: 'bx-e-mark', cx: x, cy: y, r: f1(re * 0.42) }));
      g.appendChild(S_('circle', { class: 'bx-e-dot', cx: x, cy: y, r: 1.8 }));
      const k = re * 0.55;
      g.appendChild(S_('path', { class: 'bx-e-x', d: 'M' + f1(x - k) + ',' + f1(y - k) + ' L' + f1(+x + k) + ',' + f1(+y + k) + ' M' + f1(+x + k) + ',' + f1(y - k) + ' L' + f1(x - k) + ',' + f1(+y + k) }));
      e.cl = g;
      g.addEventListener('click', (ev) => { ev.stopPropagation(); hooks.toggle(e.n); focusEngine(e.n, false); });
      g.addEventListener('keydown', (ev) => {
        const n = ENGINES.length;
        let to = null;
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') to = (e.n + 1) % n;
        else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') to = (e.n - 1 + n) % n;
        else if (ev.key === 'Home') to = 0;
        else if (ev.key === 'End') to = n - 1;
        else if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); hooks.toggle(e.n); tipEngine(e, g); return; }
        if (to != null) { ev.preventDefault(); focusEngine(to, true); }
      });
      g.addEventListener('pointerenter', (ev) => { SX.hover(e.part, { from: 'booster' }); SX.tip.show(engineTip(e), ev.clientX, ev.clientY); });
      g.addEventListener('pointermove', (ev) => SX.tip.show(engineTip(e), ev.clientX, ev.clientY));
      g.addEventListener('pointerleave', () => { SX.hover(null, { from: 'booster' }); SX.tip.hide(); });
      g.addEventListener('focus', () => tipEngine(e, g));
      g.addEventListener('blur', () => SX.tip.hide());
      engG.appendChild(g);
    });
    function engineTip(e) {
      const out = st.out.has(e.n);
      const lit = isLit(e);
      return '<b>' + esc(e.label) + '</b>' + (e.gimbal ? 'Gimbals and relights.' : 'Fixed (no gimbal); relights on V3.') + ' ' +
        (out ? 'Shut down. Click to restart it.' : (lit ? 'Running.' : 'Not commanded in this phase.') + ' Click to shut it down.');
    }
    function tipEngine(e, g) { tipAtEl(g, engineTip(e)); }
    function focusEngine(n, move) {
      ENGINES.forEach((q) => q.cl.setAttribute('tabindex', q.n === n ? '0' : '-1'));
      if (move) ENGINES[n].cl.focus();
    }

    /* ---- readouts */
    const dd = {};
    const cell = (key, label, est) => {
      dd[key] = SX.el('dd', { class: 'num' });
      return SX.el('div', null, SX.el('dt', null, label, est ? SX.el('span', { class: 'bx-est' }, 'EST') : null), dd[key]);
    };
    const read = SX.el('dl', { class: 'bx-read' },
      cell('lit', 'Engines running'), cell('thrust', 'Total thrust'), cell('tw', 'Liftoff T/W', true), cell('side', 'Side force', true));
    dd.tw.classList.add('bx-mathy');
    dd.tw.setAttribute('tabindex', '0');
    const twTip = () => {
      const n = litEngines().length;
      return '<b>Thrust-to-weight</b>' + (st.phase === 'liftoff'
        ? 'T/W = ' + n + ' engines × ' + esc(SX.fmt('raptor.r3.thrustSL')) + ' ÷ ' + esc(SX.fmt('stack.liftoffMass')) + ' = ' + fmtNum(n * T / M0, 2) +
          '. The stack mass is an estimate (propellant is official, dry masses are not published). Above 1 the rocket can climb; the margin over 1 is its upward acceleration in g.'
        : 'Shown only at liftoff. The booster\'s mass during boostback and landing is not published.');
    };
    dd.tw.addEventListener('pointerenter', (ev) => SX.tip.show(twTip(), ev.clientX, ev.clientY));
    dd.tw.addEventListener('pointermove', (ev) => SX.tip.show(twTip(), ev.clientX, ev.clientY));
    dd.tw.addEventListener('pointerleave', () => SX.tip.hide());
    dd.tw.addEventListener('focus', () => tipAtEl(dd.tw, twTip()));
    dd.tw.addEventListener('blur', () => SX.tip.hide());

    /* ---- gimbal joystick */
    const joy = S_('svg', { class: 'bx-joy', viewBox: '0 0 124 124', tabindex: '0', role: 'slider', 'aria-label': 'Gimbal joystick: arrow keys tilt the gimballing engines, Home recentres',
      'aria-valuemin': '0', 'aria-valuemax': String(gMax), 'aria-valuenow': '0' });
    const JR = 50;
    joy.appendChild(S_('circle', { class: 'bx-joy-ring', cx: 62, cy: 62, r: JR + 8 }));
    joy.appendChild(S_('path', { class: 'bx-joy-x', d: 'M62,8 L62,116 M8,62 L116,62' }));
    joy.appendChild(S_('circle', { class: 'bx-joy-x', cx: 62, cy: 62, r: JR / 2, style: 'fill:none' }));
    const jv = S_('path', { class: 'bx-joy-v', d: 'M62,62 L62,62' });
    const jk = S_('circle', { class: 'bx-joy-k', cx: 62, cy: 62, r: 9 });
    joy.appendChild(jv); joy.appendChild(jk);
    const setTilt = (x, y) => {
      const m = Math.hypot(x, y);
      if (m > 1) { x /= m; y /= m; }
      st.tilt = { x, y };
      render();
    };
    let dragging = false;
    const fromEvent = (ev) => {
      const r = joy.getBoundingClientRect();
      const k = 124 / r.width;
      setTilt(((ev.clientX - r.left) * k - 62) / JR, ((ev.clientY - r.top) * k - 62) / JR);
    };
    joy.addEventListener('pointerdown', (ev) => { dragging = true; joy.setPointerCapture(ev.pointerId); fromEvent(ev); });
    joy.addEventListener('pointermove', (ev) => { if (dragging) fromEvent(ev); });
    joy.addEventListener('pointerup', () => { dragging = false; });
    joy.addEventListener('pointercancel', () => { dragging = false; });
    joy.addEventListener('keydown', (ev) => {
      const d = 0.1;
      const t = st.tilt;
      if (ev.key === 'ArrowLeft') setTilt(t.x - d, t.y);
      else if (ev.key === 'ArrowRight') setTilt(t.x + d, t.y);
      else if (ev.key === 'ArrowUp') setTilt(t.x, t.y - d);
      else if (ev.key === 'ArrowDown') setTilt(t.x, t.y + d);
      else if (ev.key === 'Home' || ev.key === 'Escape') setTilt(0, 0);
      else return;
      ev.preventDefault();
      ev.stopPropagation();
    });
    const gimText = SX.el('div', { class: 'bx-gim-t' });
    const gim = SX.el('div', { class: 'bx-gim' }, joy, gimText);

    const resetBtn = SX.el('button', { type: 'button', class: 'btn btn-sm', onclick: () => { st.out.clear(); setTilt(0, 0); } }, 'Reset engines');
    const centerBtn = SX.el('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: () => setTilt(0, 0) }, 'Center gimbal');

    /* ---- ring chips (select the ring parts) */
    const rings = [
      ['booster.enginesCenter', 'Center', 'booster.enginesCenter', true],
      ['booster.enginesInner', 'Inner ring', 'booster.enginesInner', true],
      ['booster.enginesOuter', 'Outer ring', 'booster.enginesOuter', false],
    ];
    const ringRow = SX.el('div', { class: 'bx-ringbtns', role: 'group', 'aria-label': 'Engine rings' });
    const ringBtns = {};
    rings.forEach(([id, name, fk, gimbal]) => {
      const b = ringBtns[id] = SX.el('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', onclick: () => SX.select(id, { from: 'booster' }) },
        SX.el('i', { class: gimbal ? '' : 'fixed', 'aria-hidden': 'true' }), name + ' ' + SX.val(fk, '') + (gimbal ? ', gimbal' : ', fixed'));
      b.addEventListener('pointerenter', () => SX.hover(id, { from: 'booster' }));
      b.addEventListener('pointerleave', () => SX.hover(null, { from: 'booster' }));
      b.addEventListener('focus', () => SX.hover(id, { from: 'booster' }));
      b.addEventListener('blur', () => SX.hover(null, { from: 'booster' }));
      ringRow.appendChild(b);
    });

    const note = SX.el('p', { class: 'bx-phase-note' });
    const legend = SX.el('div', { class: 'legend bx-legend' },
      SX.el('span', null, SX.el('span', { class: 'sw', style: 'background:var(--plume)' }), 'Running'),
      SX.el('span', null, SX.el('span', { class: 'sw', style: 'background:var(--bg-4);border:1px solid var(--steel-2)' }), 'Off'),
      SX.el('span', null, SX.el('span', { class: 'sw', style: 'background:none;border:1.5px solid var(--bad)' }), 'Shut down by you'),
      SX.el('span', null, SX.el('span', { class: 'sw', style: 'background:none;border:2px solid var(--steel);border-radius:50%' }), 'Ring mark = gimbals'));

    host.appendChild(SX.el('div', { class: 'bx-cl-grid' },
      SX.el('div', null, svg, ringRow),
      SX.el('div', null, read, gim, SX.el('div', { class: 'chip-row', style: 'margin-top:12px' }, resetBtn, centerBtn))));
    host.appendChild(note);
    host.appendChild(legend);

    /* ---- state -> view */
    function commanded(e) {
      if (st.phase !== 'landing') return true;
      const n = seq[st.step];
      if (n >= 13) return e.gimbal;
      if (n <= 3) return e.ring === 'c';
      // middle step: the center three plus two opposite inner-ring engines (which ones is not published)
      return e.ring === 'c' || (e.ring === 'i' && (e.k === 2 || e.k === 7));
    }
    function isLit(e) { return commanded(e) && !st.out.has(e.n); }
    function litEngines() { return ENGINES.filter(isLit); }

    function render() {
      const lit = litEngines();
      const n = lit.length, nG = lit.filter((e) => e.gimbal).length;
      const order = { c: 0, i: 1, o: 2 };
      ENGINES.forEach((e) => {
        const on = isLit(e);
        const was = e.cl.classList.contains('is-lit');
        e.cl.style.transitionDelay = '0ms';
        e.cl.querySelectorAll('.bx-e-glow').forEach((c) => { c.style.transitionDelay = on && !was && !SX.reducedMotion ? (order[e.ring] * 90 + (e.k % 10) * 12) + 'ms' : '0ms'; });
        e.cl.classList.toggle('is-lit', on);
        e.cl.classList.toggle('is-out', st.out.has(e.n));
        e.cl.setAttribute('aria-checked', String(!st.out.has(e.n)));
        e.cl.setAttribute('aria-label', e.label + (e.gimbal ? ', gimballing' : ', fixed') + (st.out.has(e.n) ? ', shut down' : on ? ', running' : ', off in this phase'));
      });
      phaseBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(PHASES[i].id === st.phase)));
      steps.hidden = st.phase !== 'landing';
      stepBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === st.step)));

      // readouts
      const total = n * T;
      dd.lit.innerHTML = n + ' <span class="muted" style="font-size:15px">/ ' + ENGINES.length + '</span><small>' + nG + ' gimballing, ' + (n - nG) + ' fixed</small>';
      dd.thrust.innerHTML = esc(SX.fmtValue(total, 'tf')) + '<small>' + n + ' × ' + esc(SX.fmt('raptor.r3.thrustSL')) + ' flight rating</small>';
      if (st.phase === 'liftoff') {
        const tw = total / M0;
        dd.tw.innerHTML = fmtNum(tw, 2) + '<small>' + (tw < 1 ? 'below 1: cannot lift the stack' : '÷ ' + esc(SX.fmt('stack.liftoffMass')) + ' stack') + '</small>';
        dd.tw.classList.toggle('is-bad', tw < 1);
      } else {
        dd.tw.innerHTML = 'n/a<small>mass not published</small>';
        dd.tw.classList.remove('is-bad');
      }
      const m = Math.min(1, Math.hypot(st.tilt.x, st.tilt.y));
      const deg = m * gMax;
      const side = nG * T * Math.sin(deg * Math.PI / 180);
      dd.side.innerHTML = esc(SX.fmtValue(side, 'tf')) + '<small>' + nG + ' engines at ' + fmtNum(deg, 1) + '°</small>';

      // joystick
      const kx = 62 + st.tilt.x * JR, ky = 62 + st.tilt.y * JR;
      jk.setAttribute('cx', f1(kx)); jk.setAttribute('cy', f1(ky));
      jv.setAttribute('d', 'M62,62 L' + f1(kx) + ',' + f1(ky));
      joy.setAttribute('aria-valuenow', fmtNum(deg, 1));
      joy.setAttribute('aria-valuetext', fmtNum(deg, 1) + ' degrees of tilt');
      gimText.innerHTML = '<b>Gimbal</b>Drag to tilt the gimballing engines, up to ' + SX.factHTML('raptor.r3.gimbalRange') +
        ' (a Raptor 2 figure). Each arrow is the sideways push on the booster\'s tail; the nozzles swing the opposite way. Fixed engines add none.';
      SX.renderFacts(gimText);

      // arrows
      arrowG.textContent = '';
      if (m > 0.02) {
        const ux = st.tilt.x / Math.hypot(st.tilt.x, st.tilt.y), uy = st.tilt.y / Math.hypot(st.tilt.x, st.tilt.y);
        const arrow = (x0, y0, len, cls, hcls, w) => {
          const x1 = x0 + ux * len, y1 = y0 + uy * len;
          arrowG.appendChild(S_('path', { class: cls, d: 'M' + f1(x0) + ',' + f1(y0) + ' L' + f1(x1 - ux * w) + ',' + f1(y1 - uy * w) }));
          const nx = -uy, ny = ux;
          arrowG.appendChild(S_('path', { class: hcls, d: 'M' + f1(x1) + ',' + f1(y1) + ' L' + f1(x1 - ux * w * 1.6 + nx * w * 0.8) + ',' + f1(y1 - uy * w * 1.6 + ny * w * 0.8) + ' L' + f1(x1 - ux * w * 1.6 - nx * w * 0.8) + ',' + f1(y1 - uy * w * 1.6 - ny * w * 0.8) + ' Z' }));
        };
        lit.filter((e) => e.gimbal).forEach((e) => arrow(px(e.bx), py(e.by), 6 + 16 * m, 'bx-arrow', 'bx-arrow-h', 3));
        if (nG > 0) {
          const L = 30 + 80 * m * (nG / 13);
          arrow(CL.cx, CL.cy, L, 'bx-net', 'bx-net-h', 5);
          const tw = 100, anchor = ux > 0.3 ? 'start' : ux < -0.3 ? 'end' : 'middle';
          let tx = CL.cx + ux * (L + 12), ty = CL.cy + uy * (L + 12) + 3;
          if (anchor === 'end') tx = Math.max(tx, tw + 4);
          else if (anchor === 'start') tx = Math.min(tx, CL.W - tw - 4);
          else tx = SX.clamp(tx, tw / 2 + 4, CL.W - tw / 2 - 4);
          if (Math.abs(ux) > 0.3) ty = CL.cy + uy * (L + 12) + (uy >= 0 ? 16 : -10);
          ty = SX.clamp(ty, 12, CL.H - 22);
          arrowG.appendChild(S_('text', { class: 'bx-net-t', x: f1(tx), y: f1(ty), 'text-anchor': anchor }, 'NET SIDE FORCE'));
        }
      }

      // phase note
      const G13 = N('booster.enginesGimbal');
      if (st.phase === 'liftoff') {
        note.innerHTML = 'All ' + N('booster.engineCount') + ' engines start before the hold-down clamps let go. SpaceX lists ' + FH('booster.liftoffThrust') +
          ' at liftoff; at the ' + FH('raptor.r3.thrustSL') + ' flight rating the arithmetic gives the readout above. Shut engines down to watch thrust-to-weight fall: against an estimated ' +
          FH('stack.liftoffMass') + ' stack, fewer than ' + N('booster.minEnginesLiftoff') + ' engines could not lift it at all.';
      } else if (st.phase === 'boostback') {
        note.innerHTML = 'After hot staging the booster flips and burns back toward the launch site. On V3 every engine can relight: Flight 13 flew the high-thrust part of its boostback on all ' +
          N('booster.enginesRelight') + ', and Flight 14 relit ' + FH('booster.f14BoostbackLit') + '. First-generation boosters relit only their ' + N('booster.enginesRelightV2') + ' inner engines.';
      } else {
        note.innerHTML = 'The landing burn starts on the ' + G13 + ' gimballing engines, drops to ' + seq[1] + ' for fine trajectory control and finishes on ' + seq[2] +
          ' (' + FH('booster.landingBurnSequence') + '), shown here as the center engines, as on first-generation boosters. The inner engines draw oxygen from the landing tank. Flight 14 lit ' + FH('booster.f14LandingLit') +
          ' at the start. SpaceX does not say which engines run in the later steps; the choice shown is schematic.';
      }
      SX.renderFacts(note);
      hooks.rendered && hooks.rendered();
    }
    return {
      render,
      setTilt,
      ringHighlight(ids) {
        ENGINES.forEach((e) => e.cl.classList.toggle('is-ring-hl', ids.includes(e.part)));
        Object.keys(ringBtns).forEach((id) => ringBtns[id].setAttribute('aria-pressed', String(SX.selected === id)));
      },
      el: host,
    };
  }

  /* ================================================================== explainer cards */

  function tFmt(id) {
    const e = (SX.data.timeline || []).find((q) => q.id === id);
    if (!e) return '?';
    const m = Math.floor(e.t / 60), s = e.t % 60;
    return 'T+' + m + ':' + String(s).padStart(2, '0');
  }
  function srcLine(ids) {
    const parts = ids.map((id) => {
      const s = SX.data.sources[id];
      if (!s) return '';
      return '<a href="#src-' + esc(id) + '" title="' + esc(s.title) + '">' + esc(id) + '</a> ' + esc(s.publisher || '') + (s.date ? ' ' + esc(s.date) : '');
    }).filter(Boolean);
    return 'Sources: ' + parts.join(' · ');
  }
  function showChips(ids) {
    return SX.el('div', { class: 'chip-row' }, ids.map((id) => {
      const p = SX.part(id);
      return SX.el('button', { type: 'button', class: 'chip chip-quiet', onclick: () => SX.show(id, 'booster') }, p ? p.name : id);
    }));
  }
  function card(eyebrow, title, bodyHTML, chips, srcIds) {
    const c = SX.el('article', { class: 'panel panel-pad bx-card' },
      SX.el('div', { class: 'eyebrow' }, eyebrow),
      SX.el('h3', { class: 'h4' }, title),
      SX.el('div', { class: 'prose', html: SX.withFacts(bodyHTML) }),
      chips && chips.length ? showChips(chips) : null,
      SX.el('p', { class: 'bx-src', html: srcLine(srcIds) }));
    return c;
  }

  function buildCards(host) {
    const N = (k) => SX.factHTML(k, { unitless: true });
    host.appendChild(card('Material', 'Why stainless steel',
      '<p>The booster\'s skin is its tank wall: rolled stainless-steel rings welded into barrels, with stringers welded inside. On first-generation boosters each ring was about {{booster.ringHeightV2}} tall with a wall close to {{booster.wallV2}} (community measurements; SpaceX has not published V3 figures).</p>' +
      '<p><strong>It copes with the cold.</strong> Austenitic stainless steel does not turn brittle at cryogenic temperatures the way ordinary carbon steel does, and it gets stronger as it chills. The oxygen tank holds liquid below {{propellant.loxBoil}}; Musk said in 2020 that some parts would use 304L because it has higher toughness at cryogenic temperatures.</p>' +
      '<p><strong>It copes with heat.</strong> Steel keeps its strength far hotter than the aluminum alloys most rockets are built from. On V3 the forward dome takes the ship\'s exhaust at every staging, protected only by tank pressure and a non-structural steel layer.</p>' +
      '<p><strong>Pressure stiffens it.</strong> A thin cylinder under internal pressure resists buckling far better than the same cylinder empty, the way a sealed drink can does.</p>' +
      '<p><strong>The alloy is SpaceX\'s own.</strong> Musk wrote in August 2026 that SpaceX has created its own alloys and no longer uses 301. The popular name "30X" is a nickname, not a published designation.</p>',
      ['booster.ch4Tank.forwardDome', 'booster'], ['S45', 'SB4', 'SB1', 'S2']));

    host.appendChild(card('Plumbing', 'How the tanks are arranged and fed',
      '<p><strong>Oxygen low, methane high.</strong> About {{booster.propLOX}} of liquid oxygen sits in the lower tank and about {{booster.propCH4}} of methane in the upper one: estimates that split the official {{booster.propTotal}} load by mass. The dense oxygen at the bottom keeps the center of mass low and close to the engines.</p>' +
      '<p><strong>One dome between them.</strong> A single common dome replaces two separate domes and an intertank, saving length and mass. It separates two liquids that cannot share a temperature: subcooled oxygen can be colder than the point where methane freezes, {{propellant.ch4Freeze}}.</p>' +
      '<p><strong>Methane goes through the oxygen.</strong> With the fuel tank on top, a transfer tube runs down the middle of the oxygen tank. SpaceX says the V3 tube is roughly the size of a Falcon 9 first stage (NSF: about {{booster.transferTubeLength}} by {{booster.transferTubeDiameter}}), wide enough to feed every engine at once. The much thinner first-generation downcomer likely failed under high angle-of-attack loads on Flight 9.</p>' +
      '<p><strong>A reserve for landing.</strong> A separate oxygen landing tank feeds the ' + N('booster.enginesGimbal') + ' inner engines, so the main tank can run dry during boostback, as it did on purpose on Flight 14. The engines return warm gas to keep both tanks pressurized, and pressure vessels in the chines hold the start gases.</p>',
      ['booster.downcomer', 'booster.commonDome', 'booster.landingTank', 'booster.pressurization'], ['S1', 'S17', 'S2', 'S23', 'SB2', 'S5']));

    const seqHTML = '<ol class="bx-seq">' +
      '<li><span class="mono">' + tFmt('meco') + ' · ' + tFmt('hotstage') + '</span><br>Most engines shut down and the ship lights its engines while still sitting on the booster, pushing off through the hot-stage truss.</li>' +
      '<li><span class="mono">' + tFmt('boostback') + ' to ' + tFmt('boostbackEnd') + '</span><br>The booster flips engines-first and relights (all ' + N('booster.enginesRelight') + ' on V3) to cancel its downrange speed and head back toward the launch site.</li>' +
      '<li><span class="mono">Glide</span><br>It falls tail-first, steered by its ' + N('booster.gridFins') + ' grid fins while the chines add lift. V3 glides at a higher angle of attack, which is why a fourth fin was no longer useful.</li>' +
      '<li><span class="mono">' + tFmt('boosterLandingBurn') + ' to ' + tFmt('boosterCatch') + '</span><br>Landing burn: {{booster.landingBurnSequence}}. High thrust to brake, fewer engines for fine control, then a final hover on three.</li>' +
      '<li><span class="mono">Catch</span><br>Over the pad the tower\'s chopsticks close, and the booster settles onto the arms by the catch points on its two lift fins.</li></ol>';
    host.appendChild(card('Recovery', 'How the booster returns and is caught',
      seqHTML + '<p>Times are from SpaceX\'s Flight 14 plan. The booster has been caught ' + N('booster.catchesTotal') + ' times, all first-generation boosters (Flights 5, 7 and 8). V3 boosters have so far come down in the Gulf; Flight 14\'s made a soft splashdown on target.</p>',
      ['booster.gridfins', 'booster.catch', 'booster.enginesCenter'], ['S5', 'S2', 'S23', 'S11']));

    const row = (a, b) => '<tr><td>' + a + '</td><td>' + b + '</td></tr>';
    host.appendChild(card('Version 3', 'What changed in V3, and why',
      '<table class="bx-chg"><thead><tr><th scope="col">Change</th><th scope="col">Why</th></tr></thead><tbody>' +
      row('Hot stage', 'Built into the booster instead of a jettisoned {{booster.hsrHeightV2}} ring. Nothing to build and throw away; tank pressure and a steel layer protect the forward dome.') +
      row('Grid fins', N('booster.gridFins') + ' instead of ' + N('booster.gridFinsV2') + ', each {{booster.gridFinGrowth}} larger, lowered and re-clocked, with catch points built in and actuators moved inside the methane tank. The higher angle-of-attack glide left a fourth fin out of the airflow.') +
      row('Transfer tube', 'Roughly Falcon 9 first-stage size. Starts every engine at once and makes flips faster and more reliable.') +
      row('Relight', 'All ' + N('booster.enginesRelight') + ' engines, up from ' + N('booster.enginesRelightV2') + '. Onboard spin-start gas (reported) replaces ground start for the outer ring.') +
      row('Aft end', 'No engine shrouds, enclosed aft bay or CO2 fire suppression, and a new thrust plate. Raptor 3 protects its own plumbing; SpaceX puts the saving at about {{raptor.r3.massSavingPerEngine}} per engine at vehicle level.') +
      row('Landing tank', 'A separate oxygen tank that can feed any inner engine, so a failed engine can be swapped for another during landing.') +
      row('Fill', '{{booster.quickDisconnects}}, oxygen and methane separated, for redundancy and simpler mechanisms.') +
      row('Numbers', '{{booster.propTotal}} of propellant and {{booster.liftoffThrust}} at liftoff, up from {{booster.propTotalV2}} and {{booster.liftoffThrustV2}}; Raptor 3 is rated {{raptor.r3.thrustSL}} against Raptor 2\'s {{raptor.r2.thrustSL}}.') +
      '</tbody></table>',
      ['booster.hsr', 'booster.engineShield', 'booster.qds'], ['S2', 'S23', 'S10', 'S6', 'S4']));
  }

  /* ================================================================== view assembly */

  let V = null; // live handles after init

  function init(mount) {
    if (!init.cssDone) { SX.css(CSS); init.cssDone = true; }
    const st = { phase: 'liftoff', step: 0, out: new Set(), tilt: { x: 0, y: 0 } };
    const cur = Object.assign({}, LEVELS.liftoff);
    let target = Object.assign({}, LEVELS.liftoff);
    let tweening = false;
    let timers = [];

    const top = SX.el('div', { class: 'bx-top' });
    const right = SX.el('div', { class: 'bx-right' });

    /* main drawing */
    const fillSeg = SX.el('div', { class: 'seg', role: 'group', 'aria-label': 'Tank levels by flight phase' });
    const fillBtns = PHASES.map((p) => {
      const b = SX.el('button', { type: 'button', 'aria-pressed': 'false', onclick: () => hooks.setPhase(p.id) }, p.label.replace(' burn', ''));
      fillSeg.appendChild(b);
      return b;
    });
    const figMain = SX.el('figure', { class: 'viz viz-grid bx-fig bx-main' });
    figMain.appendChild(SX.el('div', { class: 'bx-head' },
      SX.el('div', null,
        SX.el('div', { class: 'bx-title' }, SX.el('b', null, 'Elevation'), ' · half section on the centerline'),
        SX.el('div', { class: 'bx-scale' }, 'Left: outside · Right: cut open')),
      SX.el('div', { class: 'bx-toolbar' }, SX.el('span', { class: 'bx-tl' }, 'Tank levels'), fillSeg)));
    const mainWrap = SX.el('div', { class: 'bx-svgwrap' });
    figMain.appendChild(mainWrap);
    const mainKey = SX.el('ol', { class: 'bx-key', hidden: true, 'aria-label': 'Key to the numbered callouts' });
    figMain.appendChild(SX.el('figcaption', null, mainKey,
      SX.el('div', { class: 'legend bx-legend' },
        SX.el('span', null, SX.el('span', { class: 'sw lox' }), 'Liquid oxygen'),
        SX.el('span', null, SX.el('span', { class: 'sw ch4' }), 'Liquid methane'),
        SX.el('span', null, SX.el('span', { class: 'sw hatch' }), 'Cut steel'),
        SX.el('span', null, SX.el('span', { class: 'sw hid' }), 'Hidden inside'),
        SX.el('span', null, SX.el('span', { class: 'sw gas' }), 'Warm gas lines'),
        SX.el('span', { style: 'color:var(--warn)' }, SX.el('span', { class: 'sw', style: 'background:var(--warn)' }), 'Estimated dimension')),
      SX.el('p', { class: 'bx-cap', html: SX.withFacts('<strong>Proportions from published dimensions.</strong> Height ({{booster.height}}) and diameter ({{booster.diameter}}) are official. The tank split, dome depths and internal stations are estimates derived from the published propellant load, the wall is drawn far thicker than its few millimeters, and the tank levels for each phase are schematic. Click any part, or tab to it and press Enter.') })));

    /* detail B */
    const figDet = SX.el('figure', { class: 'viz viz-grid bx-fig bx-detail', id: 'bx-detail-b' });
    figDet.appendChild(SX.el('div', { class: 'bx-head' },
      SX.el('div', null,
        SX.el('div', { class: 'bx-title' }, SX.el('b', null, 'Detail B'), ' · engine section'),
        SX.el('div', { class: 'bx-scale' }, 'Enlarged about 2× · schematic'))));
    const detWrap = SX.el('div', { class: 'bx-svgwrap' });
    figDet.appendChild(detWrap);
    const detKey = SX.el('ol', { class: 'bx-key', hidden: true, 'aria-label': 'Key to the numbered callouts in detail B' });
    figDet.appendChild(detKey);
    figDet.appendChild(SX.el('figcaption', { class: 'bx-cap', html: SX.withFacts('The chine is broken open to show its pressure vessels and avionics. Landing-tank placement, engine ring radii and the thrust plate\'s taper are schematic. A person is drawn for scale on the nozzle exit plane.') }));

    /* cluster */
    const clPanel = SX.el('section', { class: 'panel bx-cluster', 'aria-label': 'Engine cluster' });

    right.appendChild(figDet);
    right.appendChild(clPanel);
    top.appendChild(figMain);
    top.appendChild(right);
    mount.appendChild(top);
    const cards = SX.el('div', { class: 'bx-cards' });
    mount.appendChild(cards);

    const hooks = {
      setPhase(id) {
        timers.forEach(clearTimeout); timers = [];
        st.phase = id; st.step = 0;
        target = Object.assign({}, LEVELS[id]);
        if (SX.reducedMotion) { Object.assign(cur, target); applyLevels(); } else tweening = true;
        if (id === 'landing' && !SX.reducedMotion) {
          timers.push(setTimeout(() => hooks.setStep(1, false), 1700));
          timers.push(setTimeout(() => hooks.setStep(2, false), 3400));
        }
        fillBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(PHASES[i].id === id)));
        cluster.render();
      },
      setStep(i, user) {
        if (user) { timers.forEach(clearTimeout); timers = []; }
        if (st.phase !== 'landing') return;
        st.step = i;
        cluster.render();
      },
      playLanding() { hooks.setPhase('landing'); },
      toggle(n) { if (st.out.has(n)) st.out.delete(n); else st.out.add(n); cluster.render(); },
    };

    const elev = buildElevation(mainWrap, () => {
      const r = figDet.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.top - 72, behavior: SX.reducedMotion ? 'auto' : 'smooth' });
      pulse(figDet.querySelector('svg'));
    }, mainKey);
    const detail = buildDetail(detWrap, detKey);
    const cluster = buildCluster(clPanel, st, hooks);
    buildCards(cards);

    function applyLevels() {
      elev.setLevels(cur, st.phase);
      detail.setLevels(cur, st.phase);
    }
    SX.loop(mount, (dt) => {
      if (!tweening) return;
      const k = 1 - Math.exp(-dt * 5);
      let done = true;
      ['lox', 'ch4', 'land'].forEach((key) => {
        cur[key] += (target[key] - cur[key]) * k;
        if (Math.abs(target[key] - cur[key]) > 0.01) done = false;
      });
      if (done) { Object.assign(cur, target); tweening = false; }
      applyLevels();
    });

    let hoverId = null;
    const ringIds = ['booster.enginesCenter', 'booster.enginesInner', 'booster.enginesOuter'];
    const ringHl = () => cluster.ringHighlight([hoverId, SX.selected].filter((x) => ringIds.includes(x)));
    SX.on('hover', (id) => { hoverId = id; paintHover(id); ringHl(); });
    SX.on('select', (id) => { paintSelect(id); ringHl(); });
    SX.on('units', () => { tipCache.clear(); elev.units(); detail.units(); cluster.render(); });

    applyLevels();
    hooks.setPhase('liftoff');
    paintSelect(SX.selected);
    V = { mount, elev, detail, cluster, figMain, figDet, clPanel, hooks, st };
    hooks.tilt = (x, y) => cluster.setTilt(x, y);
    mount.bx = hooks; // handle for headless checks
  }

  function pulse(el) {
    if (!el || SX.reducedMotion) return;
    el.classList.remove('bx-pulse');
    void el.getBoundingClientRect();
    el.classList.add('bx-pulse');
    setTimeout(() => el.classList.remove('bx-pulse'), 1800);
  }
  function scrollToEl(el, align) {
    const r = el.getBoundingClientRect();
    const topbar = document.querySelector('.topbar');
    const off = (topbar ? topbar.offsetHeight : 0) + 12;
    // on narrow screens the inspector is a bottom sheet over about 72% of the screen: aim for the strip above it
    const sheet = window.innerWidth <= 760 && document.body.classList.contains('inspector-open') ? window.innerHeight * 0.72 : 0;
    const visH = window.innerHeight - sheet - off;
    let y = window.scrollY + r.top + r.height / 2 - off - visH / 2;
    if (align === 'start' || r.height > visH - 20) y = window.scrollY + r.top - off;
    window.scrollTo({ top: Math.max(0, y), behavior: SX.reducedMotion ? 'auto' : 'smooth' });
  }
  const DETAIL_FIRST = ['booster.qds', 'booster.thrustSection.tvc', 'booster.loxTank.aftDome', 'booster.landingTank', 'booster.engineShield', 'booster.pressurization', 'booster.thrustSection'];

  function focus(id) {
    if (!V) return;
    if (id === 'booster') { scrollToEl(V.mount, 'start'); return; }
    if (['booster.enginesCenter', 'booster.enginesInner', 'booster.enginesOuter'].includes(id)) {
      scrollToEl(V.clPanel);
      ENGINES.filter((e) => e.part === id).forEach((e) => pulse(e.cl));
      V.cluster.ringHighlight([id]);
    } else {
      const inDetail = V.figDet.querySelector('.part[data-part="' + id + '"]');
      const inMain = V.figMain.querySelector('.part[data-part="' + id + '"]');
      const el = (DETAIL_FIRST.includes(id) && inDetail) || inMain || inDetail;
      if (el) scrollToEl(el);
    }
    (reg.get(id) || new Set()).forEach((el) => { if (!el.classList.contains('bx-lab')) pulse(el); });
  }

  SX.register('booster', { title: 'booster cutaway', parts: PART_IDS, init, focus });
})();
