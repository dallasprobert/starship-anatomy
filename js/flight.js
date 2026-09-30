/* Starship Anatomy: flight view ("flight profile").
   1. Mission player: canvas side view of the Flight 14 plan with a webcast-style HUD and engine rings.
   2. Catch: SVG of the Pad 2 tower, arms, launch mount, deluge and tank farm, with a catch sequence slider.
   3. Scale: launch vehicles at true relative height, with thrust and payload bars.
   4. Flight log: every integrated flight, filterable by version.
   Owns part ids: flight, ground, flight.*, ground.*. Every hard number comes from SX.data. */
(function () {
  'use strict';
  const SX = window.SX;
  if (!SX) return;
  const D = SX.data;

  /* ------------------------------------------------------------------ small helpers */

  const TL = (D.timeline || []).slice().sort((a, b) => a.t - b.t);
  const TLID = {};
  TL.forEach((e) => { TLID[e.id] = e; });
  const tOf = (id) => (TLID[id] ? TLID[id].t : null);
  const pad2 = (n) => String(n).padStart(2, '0');

  /** 'T+00:02:20' (webcast clock) */
  function clock(sec) {
    const neg = sec < 0;
    const s = Math.floor(Math.abs(sec) + 1e-6);
    return (neg ? 'T-' : 'T+') + pad2(Math.floor(s / 3600)) + ':' + pad2(Math.floor((s % 3600) / 60)) + ':' + pad2(s % 60);
  }
  /** 'T+2:20' or 'T+9:50:30' (prose) */
  function tShort(sec) {
    const neg = sec < 0;
    const s = Math.round(Math.abs(sec));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    return (neg ? 'T-' : 'T+') + (h ? h + ':' + pad2(m) : String(m)) + ':' + pad2(ss);
  }
  /** Parse 'T+9:50:21' or 'T-36:33' into seconds. */
  function parseT(str) {
    const m = /^T([+-])(\d+(?::\d+){0,2})/.exec(String(str || ''));
    if (!m) return null;
    const parts = m[2].split(':').map(Number);
    let s = 0;
    parts.forEach((p) => { s = s * 60 + p; });
    return m[1] === '-' ? -s : s;
  }
  /** Human duration from seconds: '7 min', '2 s', '9 h 50 min' (computed from timeline data). */
  function dur(sec) {
    sec = Math.round(sec);
    if (sec < 90) return sec + ' s';
    if (sec < 5400) return Math.round(sec / 60) + ' min';
    const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
    return h + ' h' + (m ? ' ' + m + ' min' : '');
  }
  const numsIn = (str) => (String(str || '').match(/\d+/g) || []).map(Number);
  /** Format a computed or approximate value to 3 significant figures in the page's unit system (no false precision). */
  const IMPERIAL = { 'km/h': 'mph', km: 'mi', t: 'lb', m: 'ft', MN: 'Mlbf' };
  function fmt3(v, unit, opts) {
    const to = SX.units() === 'imperial' && IMPERIAL[unit] ? IMPERIAL[unit] : unit;
    const cv = SX.convert(v, unit, to)[0];
    if (!cv) return SX.fmtValue(0, to, Object.assign({ to }, opts));
    const mag = Math.pow(10, Math.floor(Math.log10(Math.abs(cv))) - 2);
    const r = Math.round(cv / mag) * mag;
    return SX.fmtValue(r, to, Object.assign({ to, digits: mag < 1 ? Math.min(2, Math.round(-Math.log10(mag))) : 0 }, opts));
  }

  /* ------------------------------------------------------------------ flights data, derived lists */

  const FLIGHTS = (D.flights || []).slice().sort((a, b) => a.n - b.n);
  const isCatch = (f) => /booster catch/i.test(f.outcome) && !/aborted/i.test(f.outcome);
  const catchFlights = FLIGHTS.filter(isCatch).map((f) => f.n);
  const abortFlight = FLIGHTS.find((f) => /aborted the catch/i.test(f.outcome));
  function listNums(ns) {
    if (!ns.length) return '';
    if (ns.length === 1) return String(ns[0]);
    return ns.slice(0, -1).join(', ') + ' and ' + ns[ns.length - 1];
  }
  const pad1Flights = FLIGHTS.filter((f) => f.pad === 'Pad 1').map((f) => f.n);
  const pad1Range = pad1Flights.length ? pad1Flights[0] + ' to ' + pad1Flights[pad1Flights.length - 1] : '';

  /* ------------------------------------------------------------------ extra facts */

  const NEW_SOURCES = {
    S141: { title: "SpaceX's new Starship pad readies for first launch (Pad 2 tank farm pumps, subcooling, loading times, deluge systems)", publisher: 'NASASpaceflight', date: '2026-05-13', url: 'https://www.nasaspaceflight.com/2026/05/spacex-starship-pad-first-launch/' },
    S142: { title: 'Starbase Infrastructure Advances Toward Flight 14 (liquid nitrogen storage)', publisher: 'NASASpaceflight', date: '2026-09-06', url: 'https://www.nasaspaceflight.com/2026/09/starbase-infrastructure-spacex-flight-14/' },
    S143: { title: 'East Coast Starship launch site and facility progress (Pad 1 rebuild)', publisher: 'NASASpaceflight', date: '2026-09-01', url: 'https://www.nasaspaceflight.com/2026/09/launch-site-facility-progress-east-coast-starship/' },
  };
  const NEW_FACTS = {
    'flight.f12MaxQT': { v: 'T+0:45', unit: '', conf: 'official', src: ['S7'], note: 'Flight 12 planned Max Q. Flights 13 and 14: T+0:58.' },
    'flight.f13MecoT': { v: 'T+2:18', unit: '', conf: 'official', src: ['S6'], note: 'Flight 13 planned MECO. SpaceX throttled down less after Max Q on Flight 13 to test the stack under higher loads.' },
    'flight.f14LiftoffUTC': { v: '2026-09-28 12:48:59 UTC', unit: '', conf: 'reported', src: ['S5', 'S27'], note: 'SpaceX gives 7:48 a.m. CDT; the seconds are from NASASpaceflight.' },
    'flight.f14BoostbackEngines': { v: 31, unit: 'of 33 engines', conf: 'official', src: ['S5'], note: 'Flight 14: 31 of the 33 planned engines relit for boostback. The burn intentionally used up the oxygen left in the main tank.' },
    'flight.f14LandingEngines': { v: 11, unit: 'of 13 engines', conf: 'official', src: ['S5'], note: 'Flight 14: 11 of 13 lit, then 5, then 3; soft splashdown in the Gulf, after which the flight termination system was fired as a demonstration.' },
    'flight.v12HotStageEngines': { v: 3, unit: 'center engines', conf: 'official', src: ['S11'], note: 'First-generation boosters (Flights 2 to 11): all but three booster engines shut down for hot staging.' },
    'flight.v3HotStageEngines': { v: 'not published', unit: '', conf: 'disputed', src: ['S22'], note: 'SpaceX V3 timelines say only "most engines cut off". NASASpaceflight reported that Booster 19 shut down 28 of 33 engines at staging on Flight 12, which would leave five running.' },
    'flight.f14DeorbitActualT': { v: 'T+2:12:18', unit: '', conf: 'reported', src: ['S27'], note: 'About two hours and 12 minutes (NSF; a SpaceX spokesperson gave the same to CNN). The full-length plan was T+8:52:37.' },
    'flight.f14SplashdownT': { v: 'T+3:08:27', unit: '', conf: 'reported', src: ['S32', 'S27', 'S58'], note: 'SpacePolicyOnline; NASASpaceflight gives T+3:08:30. North Pacific, north of Hawaii, after an early deorbit.' },
    'flight.f14ShipStep3to2T': { v: 'T+9:50:21', unit: '', conf: 'official', src: ['S5'], note: 'Flight 14 plan: landing burn steps from three sea-level engines to two.' },
    'flight.f14ShipStep2to1T': { v: 'T+9:50:28', unit: '', conf: 'official', src: ['S5'], note: 'Flight 14 plan: landing burn steps from two engines to one, two seconds before touchdown.' },
    'flight.orbitPeriod': { v: 89.9, unit: 'min', conf: 'estimate', src: ['S33'], note: 'Derived for a circular orbit at 275 km: v = sqrt(398,600 / 6,646) = 7.74 km/s, period = 2 pi x 6,646 / 7.74 = 89.9 min.' },
    'flight.firstHotStaging': { v: '2023-11-18', unit: '', conf: 'official', src: ['S11'], note: 'Flight 2, the first hot staging.' },
    'ground.engineStartCmdT': { v: 'T-3 s', unit: '', conf: 'official', src: ['S5'], note: 'Booster engine startup command (Flight 14 countdown).' },
    'ground.goPollT': { v: 'T-50:00', unit: '', conf: 'official', src: ['S5'], note: 'Flight director poll: GO for propellant load (Flight 14 countdown).' },
    'ground.boosterLoxStartT': { v: 'T-36:33', unit: '', conf: 'official', src: ['S5'], note: 'Booster LOX load start; methane follows at T-35:00 and the ship about a minute later (Flight 14).' },
    'ground.chillStartT': { v: 'T-21:40', unit: '', conf: 'official', src: ['S5'], note: 'Raptor engine chill on booster and ship: cold propellant is bled through the engines so pumps and lines are at cryogenic temperature before start.' },
    'ground.pad2FirstLaunch': { v: '2026-05-22', unit: '', conf: 'official', src: ['S7'], note: 'Flight 12, the first V3 flight.' },
    'ground.pad1Return': { v: 'expected back in 2027', unit: '', conf: 'reported', src: ['S143'], note: 'Pad 1 is being rebuilt with a flame trench and a Pad 2 style mount.' },
    'ground.pads': { v: 5, unit: 'pads built or building', conf: 'official', src: ['S9'], note: 'Starship launch pads in Texas and Florida (SpaceX, 2025-10-30).' },
    'ground.pad2BaseTaller': { v: 1.5, unit: 'm', conf: 'reported', src: ['S29'], note: 'Pad 2 tower base compared with Pad 1.' },
    'ground.pad2ChopstickShorter': { v: 10, unit: 'm', conf: 'reported', src: ['S29'], note: 'Approximate. SpaceX says only that the Pad 2 arms are shorter.' },
    'ground.delugeSplit': { v: '17% before ignition, 75% during launch, 8% after', unit: '', conf: 'official', src: ['S29'], note: 'FAA environmental assessment figures, as quoted by NASASpaceflight.' },
    'ground.tankfarmPumps': { v: 'LOX: 5 booster and 4 ship pumps (Pad 1: 4 and 1); methane: 4 and 4 (Pad 1: 3 and 1)', unit: '', conf: 'reported', src: ['S141'], note: 'NASASpaceflight counts of pump skids at the Pad 2 tank farm.' },
    'ground.subcoolingGain': { v: 'up about 75 to 300 percent', unit: '', conf: 'reported', src: ['S141'], note: 'LOX: about +75% (booster) and +300% (ship); methane: about +100% (booster) and +300% (ship), against Pad 1.' },
    'ground.loadTimePad1': { v: 49, unit: 'min', conf: 'reported', src: ['S141'], note: 'Full stack loading time from Pad 1.' },
    'ground.loadTimePad2': { v: 38, unit: 'min', conf: 'reported', src: ['S141'], note: 'Full stack loading time from Pad 2 at first use; Flight 13 took about 35 min 20 s (NSF).' },
    'ground.ln2Storage': { v: 3000, unit: 'm³', conf: 'reported', src: ['S142'], note: 'Three new 1,000 m3 liquid nitrogen tanks replaced seven older ones at Starbase.' },
  };
  // The canonical orbit fact carries its unit inside the text value ('262 x 275 km') and again as unit ('km'):
  // show it once, same value, confidence and sources.
  if (SX.fact('flight.f14Orbit')) NEW_FACTS['flight.f14OrbitShown'] = Object.assign({}, SX.fact('flight.f14Orbit'), { unit: '' });
  // Every timeline event becomes a clickable, sourced time: flight.t.<id> -> 'T+2:20'
  TL.forEach((e) => {
    NEW_FACTS['flight.t.' + e.id] = {
      v: tShort(e.t), unit: '', conf: e.id === 'peakHeat' ? 'estimate' : 'official', src: e.src || ['S5'],
      note: (e.id === 'peakHeat' ? '' : 'Flight 14 planned time. ') + (e.note || ''),
    };
  });
  SX.addFacts(NEW_FACTS, NEW_SOURCES);

  /* ------------------------------------------------------------------ key times (all from the timeline or facts) */

  const K = {
    liftoff: tOf('liftoff'), maxq: tOf('maxq'), meco: tOf('meco'), hs: tOf('hotstage'), bb: tOf('boostback'), bbe: tOf('boostbackEnd'),
    blb: tOf('boosterLandingBurn'), bc: tOf('boosterCatch'), seco: tOf('seco'), rel: tOf('relight'), dep: tOf('deploy'), depe: tOf('deployEnd'),
    deo: tOf('deorbit'), ent: tOf('entry'), ph: tOf('peakHeat'), ts: tOf('transonic'), lb: tOf('landingBurn'), flip: tOf('flip'), spl: tOf('splashdown'),
  };
  K.relEnd = K.rel + (SX.val('raptor.r3.orbitInsertionBurn', 0) || 0);
  K.deoEnd = K.deo + (SX.val('raptor.r3.deorbitBurn', 0) || 0);
  K.step32 = parseT(SX.val('flight.f14ShipStep3to2T'));
  K.step21 = parseT(SX.val('flight.f14ShipStep2to1T'));
  K.end = TL.length ? TL[TL.length - 1].t : 0;
  const LAND_SEQ = numsIn(SX.val('booster.landingBurnSequence', ''));  // [13, 5, 3]
  const N_BOOST = SX.val('booster.engineCount', 0);
  const N_C = SX.val('booster.enginesCenter', 0), N_I = SX.val('booster.enginesInner', 0), N_O = SX.val('booster.enginesOuter', 0);
  const N_SL = SX.val('ship.enginesSL', 0), N_VAC = SX.val('ship.enginesVac', 0);
  const ORBIT_ALT = TLID.relight && TLID.relight.alt_km != null ? TLID.relight.alt_km : 0;
  const ORBIT_PERIOD_S = (SX.val('flight.orbitPeriod', 0) || 0) * 60;

  /* ------------------------------------------------------------------ part nodes */

  const tf = (id) => '{{flight.t.' + id + '}}';
  const U = (k) => SX.factHTML(k, { unitless: true });
  // long text facts must wrap: core's .fact is nowrap, so these carry an inline override
  const WR = (k) => '<span class="fact" data-fact="' + k + '" tabindex="0" role="button" style="white-space:normal"></span>';
  const tspec = (label, id) => (TLID[id] ? { label, fact: 'flight.t.' + id } : { label, value: 'not published' });
  const peakAfterEntry = K.ph != null && K.ent != null ? dur(K.ph - K.ent) : '';
  const flipAfterBurn = K.flip != null && K.lb != null ? dur(K.flip - K.lb) : '';
  const entryToLanding = K.spl != null && K.ent != null ? dur(K.spl - K.ent) : '';
  const planLength = dur(K.end);

  SX.addParts([
    {
      id: 'flight', parent: 'stack', name: 'Mission profile', kind: 'Operations', order: 4, view: 'flight',
      summary: 'Two vehicles fly two very different missions from one launch. Super Heavy lifts the stack until main engine cutoff at ' + tf('meco') + ' and then flies itself back; Starship carries on to orbit, deploys its payload, falls back belly-first and lands on its engines.',
      body: [
        'This page follows the timeline SpaceX published for Flight 14, flown on {{flight.firstOrbit}}: the first time Starship reached orbit. The plan ran about ' + planLength + ' from liftoff to a splashdown off Chile.',
        'In the event a Raptor Vacuum engine shut down on ascent. Controllers still went for orbit and deployed every satellite, then brought the ship home early: deorbit burn at about {{flight.f14DeorbitActualT}} and splashdown at {{flight.f14SplashdownT}}, north of Hawaii.',
        'SpaceX webcasts show live speed and altitude, but its published timelines do not. The player on this page shows telemetry only where a source gives it, and says so where none exists.',
      ],
      specs: [
        { label: 'Integrated flights', fact: 'flight.integratedFlights' },
        { label: 'First orbital flight', fact: 'flight.firstOrbit' },
        { label: 'Flight 14 liftoff', fact: 'flight.f14LiftoffUTC' },
        { label: 'Satellites deployed (F14)', fact: 'flight.f14Starlinks' },
        { label: 'Orbit reached (F14)', fact: 'flight.f14OrbitShown' },
        { label: 'Booster catches to date', fact: 'booster.catchesTotal' },
        { label: 'Ship catches to date', fact: 'flight.shipCatches' },
      ],
      related: ['ground', 'booster', 'ship'],
    },
    {
      id: 'flight.liftoff', parent: 'flight', name: 'Liftoff', kind: 'Mission event', order: 1, view: 'flight',
      summary: 'All ' + U('booster.engineCount') + ' booster engines start on the launch mount and the clamps let go once they are running. Only the booster fires at liftoff: {{stack.liftoffThrust}} of thrust.',
      body: [
        'Water starts pouring into the flame trench at T{{ground.flameDiverterActivation}} and the booster engine start command goes out at {{ground.engineStartCmdT}}. The hold-down clamps release only once the engines are confirmed healthy, so a bad start can still be stopped on the ground.',
        'SpaceX lists {{stack.liftoffThrust}} for the V3 stack, which matches ' + U('booster.engineCount') + ' engines at the {{raptor.r3.thrustSL}} flight rating. The often quoted {{raptor.r3.thrustSLDemonstrated}} per engine was the 2024 ground-test figure and overstates what the vehicle flies with.',
        'Starts are the hardest moment for an engine. The first attempt at Flight 13 ended in an automatic abort: ' + WR('flight.f13Abort') + '. It was the first full-stack ignition abort.',
        'On Flight 14 one booster engine later shut down during the ascent (NASASpaceflight reports a center engine) and the rest carried on.',
      ],
      specs: [
        tspec('Planned time', 'liftoff'),
        { label: 'Flight 14 liftoff', fact: 'flight.f14LiftoffUTC' },
        { label: 'Engines running', fact: 'booster.engineCount' },
        { label: 'Liftoff thrust', fact: 'stack.liftoffThrust' },
        { label: 'Propellant aboard', fact: 'stack.propTotal' },
        { label: 'Liftoff mass', fact: 'stack.liftoffMass' },
      ],
      related: ['ground.olm', 'ground.deluge', 'booster.enginesOuter'],
    },
    {
      id: 'flight.maxq', parent: 'flight', name: 'Max Q', kind: 'Mission event', order: 2, view: 'flight',
      summary: 'The moment of peak aerodynamic pressure, when rising speed and thinning air together squeeze the stack hardest: ' + tf('maxq') + ' on the Flight 14 plan.',
      body: [
        'Dynamic pressure grows with air density and with the square of speed. Just off the pad the air is thick but the rocket is slow; later it is fast but the air is thin. The peak falls in between: ' + tf('maxq') + ' on the Flight 13 and 14 plans and {{flight.f12MaxQT}} on Flight 12.',
        'Rockets usually throttle back around Max Q to limit structural loads. On Flight 13 SpaceX deliberately throttled down less after Max Q to test the stack under higher loads, which brought main engine cutoff forward to {{flight.f13MecoT}}.',
        'SpaceX has not published the speed or altitude at Max Q for V3, so the player leaves them blank.',
      ],
      specs: [tspec('Planned time', 'maxq'), { label: 'Flight 12', fact: 'flight.f12MaxQT' }],
      related: ['flight.meco', 'stack'],
    },
    {
      id: 'flight.meco', parent: 'flight', name: 'Main engine cutoff', short: 'MECO', kind: 'Mission event', order: 3, view: 'flight',
      summary: 'Most of the booster engines shut down just before staging, at ' + tf('meco') + ' on the Flight 14 plan.',
      body: [
        'On Starship, MECO means most engines cut off, not all. A few keep running so the stack stays under thrust, and the propellant stays settled, while the ship lights its own engines on top.',
        'First-generation boosters kept {{flight.v12HotStageEngines}} lit through hot staging. For V3 the number is {{flight.v3HotStageEngines}} by SpaceX; the source note has what NASASpaceflight saw on Flight 12. The player shows the inner engines as uncertain for this phase.',
        'Speed and altitude at MECO are not published for V3 flights.',
      ],
      specs: [
        tspec('Planned time', 'meco'),
        { label: 'Flight 13', fact: 'flight.f13MecoT' },
        { label: 'Lit through staging, V1/V2', fact: 'flight.v12HotStageEngines' },
        { label: 'Lit through staging, V3', fact: 'flight.v3HotStageEngines' },
      ],
      related: ['flight.hotstage', 'booster.enginesCenter'],
    },
    {
      id: 'flight.hotstage', parent: 'flight', name: 'Hot staging', kind: 'Mission event', order: 4, view: 'flight',
      summary: 'The ship lights its ' + U('ship.enginesSL') + ' sea-level and ' + U('ship.enginesVac') + ' vacuum Raptors while still attached to the booster and pushes itself off, at ' + tf('hotstage') + ' on the plan.',
      body: [
        'Most rockets separate first and then light the upper stage. That leaves a moment with no thrust, when propellant floats away from the tank outlets and small thrusters are needed to settle it. Lighting the upper stage while the booster is still pushing keeps the propellant settled and wastes no speed.',
        'The price is that the ship fires straight into the top of the booster. V1 and V2 boosters carried a vented steel ring that let the plume escape sideways, then dropped it after boostback. V3 builds the hot stage in: the forward dome takes the exhaust directly, protected by tank pressure and a non-structural steel layer, and the interstage actuators retract after separation.',
        'Hot staging first flew on Flight 2 on {{flight.firstHotStaging}}.',
      ],
      specs: [tspec('Planned time', 'hotstage'), { label: 'Hot stage on V3', fact: 'booster.hotStage' }, { label: 'First flown', fact: 'flight.firstHotStaging' }],
      related: ['booster.hsr', 'ship.enginesVac', 'flight.meco'],
    },
    {
      id: 'flight.boostback', parent: 'flight', name: 'Flip and boostback', kind: 'Mission event', order: 5, view: 'flight',
      summary: 'The booster flips to point its engines downrange and burns to cancel its speed away from Texas, ' + tf('boostback') + ' to ' + tf('boostbackEnd') + ' on the plan.',
      body: [
        'Which way the booster flips is set by the timing of its engine starts. On Flight 12 it flipped the wrong way, several engines failed to relight and the boostback was only partial. SpaceX added deliberate timing variability for Flight 13 to make the flip direction reliable.',
        'Every V3 engine can relight ({{booster.enginesRelight}}). Flight 13 was the first to run the high-thrust part of boostback on all of them, though the burn then ended early. On Flight 14 the booster relit {{flight.f14BoostbackEngines}} and deliberately burned through the rest of the oxygen in its main tank to find the performance limit for future returns.',
        'The V3 methane transfer tube is what lets all the engines start at once. How many engines run in the low-thrust tail of the burn, and for how long, is not published.',
      ],
      specs: [
        tspec('Start (plan)', 'boostback'), tspec('Shutdown (plan)', 'boostbackEnd'),
        { label: 'Engines able to relight', fact: 'booster.enginesRelight' },
        { label: 'Relit on Flight 14', fact: 'flight.f14BoostbackEngines' },
      ],
      related: ['booster.downcomer', 'booster.enginesOuter', 'booster.landingTank'],
    },
    {
      id: 'flight.boosterLanding', parent: 'flight', name: 'Booster landing burn and catch', kind: 'Mission event', order: 6, view: 'flight',
      summary: 'Falling tail-first and steering with its grid fins, the booster relights to slow down over the water or between the tower arms, ' + tf('boosterLandingBurn') + ' to ' + tf('boosterCatch') + ' on the plan.',
      body: [
        'After boostback the booster coasts, then falls back through the atmosphere steering with its ' + U('booster.gridFins') + ' grid fins. NASASpaceflight reports that V3 glides at a higher angle of attack, which is why the fourth fin could go: it would sit out of the airflow.',
        'The landing burn runs {{booster.landingBurnSequence}}: many engines for braking power, fewer for fine control, the last few for the final hover. The V3 oxygen landing tank lets any of the ' + U('booster.enginesGimbal') + ' inner engines start even when the main tank is nearly dry. On Flight 14 {{flight.f14LandingEngines}} lit, the burn stepped down as planned, and the booster made a soft splashdown in the Gulf.',
        'For a catch the same burn ends beside the tower, and the chopsticks close on the booster. Thousands of vehicle and tower criteria must all be green' + (abortFlight ? '; on Flight ' + abortFlight.n + ' tower health checks failed and the booster diverted to the sea' : '') + '. ' + U('booster.catchesTotal') + ' boosters have been caught' + (catchFlights.length ? ', on Flights ' + listNums(catchFlights) + ', all first generation' : '') + '. No V3 booster has been caught yet.',
        'SpaceX does not publish when the burn steps from one engine count to the next, so the player spaces the steps evenly and marks them as schematic.',
      ],
      specs: [
        tspec('Burn start (plan)', 'boosterLandingBurn'), tspec('Burn end (plan)', 'boosterCatch'),
        { label: 'Engine sequence', fact: 'booster.landingBurnSequence' },
        { label: 'Lit on Flight 14', fact: 'flight.f14LandingEngines' },
        { label: 'Booster catches to date', fact: 'booster.catchesTotal' },
      ],
      related: ['booster.catch', 'booster.gridfins', 'booster.landingTank', 'ground.chopsticks'],
    },
    {
      id: 'flight.seco', parent: 'flight', name: 'Ship engine cutoff', short: 'SECO', kind: 'Mission event', order: 7, view: 'flight',
      summary: 'The ship shuts down at ' + tf('seco') + ' on a passively safe path: if nothing else happened, it would come down in the Indian Ocean on its own.',
      body: [
        'Through Flight 13 every ship stopped just short of orbital speed, on a suborbital path that reenters even if control is lost. Flight 14 kept that safety net and committed to orbit only after controllers had checked the engines in space.',
        'On Flight 14 one Raptor Vacuum shut down early and the remaining engines burned longer to make up the lost impulse. The ship did the same on Flight 12.',
        'Speed and altitude at SECO are not published for V3.',
      ],
      specs: [tspec('Planned time', 'seco'), { label: 'Ship thrust, vacuum', fact: 'ship.thrustVac' }, { label: 'Raptor Vacuum 3', fact: 'raptor.rvac3.thrust' }],
      related: ['ship.enginesVac', 'ship.enginesSL', 'flight.coast'],
    },
    {
      id: 'flight.coast', parent: 'flight', name: 'Orbit, deploy and deorbit', kind: 'Mission phase', order: 8, view: 'flight',
      summary: 'In space the ship relights one sea-level Raptor to reach orbit, releases its satellites one by one, and later relights again to come home.',
      body: [
        'At ' + tf('relight') + ' a single sea-level Raptor 3 burned for about {{raptor.r3.orbitInsertionBurn}} and lifted the low point of the trajectory out of the atmosphere. That made Flight 14 the first orbital Starship flight, in an orbit of ' + SX.factHTML('flight.f14Orbit', { unitless: true }) + ', moving at about {{flight.orbitalSpeedLEO}}, once around the Earth every {{flight.orbitPeriod}}.',
        'From ' + tf('deploy') + ' to ' + tf('deployEnd') + ' the slot-shaped payload door stood open and the PEZ dispenser pushed out ' + U('flight.f14Starlinks') + ' Starlink V3 satellites one at a time.',
        'The plan then called for a long coast and a deorbit burn at ' + tf('deorbit') + ': one sea-level engine for about {{raptor.r3.deorbitBurn}}. After the engine-out on ascent, SpaceX brought the ship home early, deorbiting at about {{flight.f14DeorbitActualT}}. In-space relights had been practiced on earlier flights for exactly this reason: a ship that cannot relight cannot come home on target.',
      ],
      specs: [
        tspec('Orbit insertion (plan)', 'relight'),
        { label: 'Insertion burn', fact: 'raptor.r3.orbitInsertionBurn' },
        { label: 'Orbit (F14)', fact: 'flight.f14OrbitShown' },
        { label: 'Orbital speed', fact: 'flight.orbitalSpeedLEO' },
        { label: 'Orbital period', fact: 'flight.orbitPeriod' },
        tspec('Deploy start (plan)', 'deploy'),
        { label: 'Satellites', fact: 'flight.f14Starlinks' },
        tspec('Deorbit burn (plan)', 'deorbit'),
        { label: 'Deorbit burn', fact: 'raptor.r3.deorbitBurn' },
        { label: 'Deorbit (F14 actual)', fact: 'flight.f14DeorbitActualT' },
      ],
      related: ['ship.payloadBay', 'ship.enginesSL', 'ship.headerLOX'],
    },
    {
      id: 'flight.entry', parent: 'flight', name: 'Atmospheric entry', kind: 'Mission event', order: 9, view: 'flight',
      summary: 'The ship falls into the atmosphere belly-first, letting its tiled underside take the heat and the drag, from ' + tf('entry') + ' on the plan.',
      body: [
        'Coming home from orbit means losing about {{flight.orbitalSpeedLEO}} of speed. Almost all of that energy leaves as heat in the air around the ship. Flying belly-first at a high angle of attack spreads the heating over the largest area and turns the whole ship into a brake, like a skydiver lying flat.',
        'Its ' + U('ship.flapCount') + ' flaps, two forward and two aft, do the steering. Folding a flap in reduces drag at that end and swinging it out adds drag, so moving the pairs differentially pitches, rolls and yaws the ship.',
        'Peak heating comes early, between entry interface and the transonic point. SpaceX does not publish its time; the player marks it about ' + peakAfterEntry + ' after entry as an estimate. The ship goes transonic at ' + tf('transonic') + '; the whole descent, from entry interface to touchdown, lasts about ' + entryToLanding + ' on the plan.',
        'Heat-shield tiles were torch-tested at about {{ship.tileTestTemp}} in 2019, the figure Musk gave for orbital entry. V3 peak heating is not published.',
      ],
      specs: [
        tspec('Entry (plan)', 'entry'), tspec('Peak heating (estimate)', 'peakHeat'), tspec('Transonic (plan)', 'transonic'),
        { label: 'Flaps', fact: 'ship.flapCount' },
        { label: 'Tile test temperature', fact: 'ship.tileTestTemp' },
      ],
      related: ['ship.heatShield', 'ship.flapsFwd', 'ship.flapsAft'],
    },
    {
      id: 'flight.flip', parent: 'flight', name: 'Landing flip', kind: 'Mission event', order: 10, view: 'flight',
      summary: 'Still falling belly-first, the ship relights its ' + U('ship.enginesSL') + ' sea-level Raptors and swings upright, at ' + tf('flip') + ' on the plan.',
      body: [
        'The landing burn starts at ' + tf('landingBurn') + ' and the flip is called ' + flipAfterBurn + ' later. The engines draw from the header tanks in the nose, because the propellant left in the main tanks has been sloshing against the walls during the belly-first fall and would feed the pumps a froth of gas.',
        'Only the sea-level engines can do this. A Raptor Vacuum nozzle is too large to run safely in thick air, and only the sea-level engines gimbal ({{ship.enginesGimbal}}). The rotation takes a few seconds; its exact duration is not published, so the animation is schematic.',
        'On Flights 13 and 14 all of the sea-level engines relit for the flip and burn.',
      ],
      specs: [tspec('Landing burn start (plan)', 'landingBurn'), tspec('Flip (plan)', 'flip'), { label: 'Engines', fact: 'ship.enginesSL' }, { label: 'Gimbaling engines', fact: 'ship.enginesGimbal' }],
      related: ['ship.headerLOX', 'ship.headerCH4', 'ship.enginesSL'],
    },
    {
      id: 'flight.landing', parent: 'flight', name: 'Landing burn and splashdown', kind: 'Mission event', order: 11, view: 'flight',
      summary: 'The ship brakes to a hover and touches down on the water, dropping engines one at a time in the final seconds. A tower catch is the goal.',
      body: [
        'On the Flight 14 plan the burn steps from three engines to two at {{flight.f14ShipStep3to2T}} and to one at {{flight.f14ShipStep2to1T}}, with touchdown at ' + tf('splashdown') + '. The actual splashdown came at {{flight.f14SplashdownT}}, north of Hawaii, after the early deorbit.',
        'Ship 40 floated intact after Flight 13 and was recovered; Ship 41 tipped over after Flight 14 and a fireball followed. No ship has been caught yet ({{flight.shipCatches}}). The rehearsal has started: ' + WR('flight.shipCatchRehearsal') + '.',
      ],
      specs: [
        { label: 'Three to two engines', fact: 'flight.f14ShipStep3to2T' },
        { label: 'Two to one engine', fact: 'flight.f14ShipStep2to1T' },
        tspec('Touchdown (plan)', 'splashdown'),
        { label: 'Splashdown (F14 actual)', fact: 'flight.f14SplashdownT' },
        { label: 'Ship catches to date', fact: 'flight.shipCatches' },
      ],
      related: ['ship.catchPins', 'ground.chopsticks', 'flight.flip'],
    },

    /* ---- ground systems */
    {
      id: 'ground', parent: 'stack', name: 'Launch and catch systems', short: 'Pad 2', kind: 'Ground systems', order: 5, view: 'flight',
      summary: 'Starbase Pad 2 stores and chills the propellant, loads the stack in about {{propellant.loadTime}}, survives the plume, and is built to catch both stages when they come back.',
      body: [
        'Pad 2 first launched on {{ground.pad2FirstLaunch}}. It is a clean-sheet design: a steel box launch mount over a real flame trench, a tower with shorter, electrically driven catch arms, and its own tank farm. Pad 1, which flew Flights ' + pad1Range + ', is being rebuilt to match ({{ground.pad1Return}}).',
        'The countdown shows how much of a launch is ground work. The flight director polls for propellant load at {{ground.goPollT}}, booster oxygen starts flowing at {{ground.boosterLoxStartT}}, the engines start chilling at {{ground.chillStartT}}, and the deluge opens at T{{ground.flameDiverterActivation}}.',
        'SpaceX counts {{ground.pads}} in Texas and Florida. Next in line: ' + WR('flight.next') + '.',
      ],
      specs: [
        { label: 'Loading time (F14 booster)', fact: 'propellant.loadTime' },
        { label: 'Propellant loaded', fact: 'stack.propTotal' },
        { label: 'Hold-down clamps', fact: 'ground.holdDownClamps' },
        { label: 'Deluge water, max', fact: 'ground.delugeWater' },
        { label: 'Chopstick lift capacity', fact: 'tower.chopsticksLift' },
        { label: 'Starship pads', fact: 'ground.pads' },
      ],
      related: ['flight', 'booster.catch'],
    },
    {
      id: 'ground.tower', parent: 'ground', name: 'Launch and catch tower', short: 'Mechazilla', kind: 'Ground structure', order: 1, view: 'flight',
      summary: 'A steel tower that is both the crane that stacks the rocket and the catcher that takes the booster back, carrying the chopsticks and the ship quick-disconnect arm.',
      body: [
        'The Pad 1 tower is about {{tower.height}} tall, a figure from a 2021 FAA letter. SpaceX has not published the Pad 2 tower height, so the catch drawing uses the Pad 1 figure.',
        'The Pad 2 base is built from steel panels filled with concrete and stands about {{ground.pad2BaseTaller}} taller than the Pad 1 base. The top carries a clad, hardened roof so the tower can survive a ship landing burn once ship catches begin.',
        'Catching at the tower means the booster carries no landing legs, and it comes back to the one place where it can be refuelled and flown again.',
      ],
      specs: [{ label: 'Height (Pad 1)', fact: 'tower.height' }, { label: 'Height (Pad 2)', value: 'not published' }, { label: 'Pad 2 base vs Pad 1', fact: 'ground.pad2BaseTaller' }, { label: 'Arm actuators (Pad 2)', value: 'Electromechanical', conf: 'official' }],
      related: ['ground.chopsticks', 'ground.qd'],
    },
    {
      id: 'ground.chopsticks', parent: 'ground', name: 'Chopsticks (catch arms)', short: 'Arms', kind: 'Ground mechanism', order: 2, view: 'flight',
      summary: 'Two arms on a carriage that rides up and down the tower. They lift the stages for stacking and close around a returning booster to catch it by its catch points.',
      body: [
        'The arms swing independently and ride the carriage up and down the tower. NASASpaceflight reports that the top rail of each arm carries a sled and a telescopic pusher that center the vehicle on its catch points.',
        'The Pad 2 arms are about {{ground.pad2ChopstickShorter}} shorter than the Pad 1 arms, stiffer, and driven by electromechanical actuators instead of hydraulics, for speed and redundancy. They were load-tested to {{tower.chopsticksLift}}.',
        'On V3 the catch points are built into two opposite grid fins, which come to rest on the arms; the third fin is a rudder fin with angled internal grids (NASASpaceflight). Earlier boosters used separate catch pins between their four fins.',
        'Ship catches need the same arms and new catch points on the ship. ' + WR('flight.shipCatchRehearsal') + '.',
      ],
      specs: [
        { label: 'Actuators (Pad 2)', value: 'Electromechanical', conf: 'official' },
        { label: 'Lift capacity (Pad 2)', fact: 'tower.chopsticksLift' },
        { label: 'Shorter than Pad 1 by', fact: 'ground.pad2ChopstickShorter' },
        { label: 'Booster catches', fact: 'booster.catchesTotal' },
        { label: 'Ship catches', fact: 'flight.shipCatches' },
      ],
      related: ['booster.catch', 'booster.gridfins', 'ship.catchPins', 'flight.boosterLanding'],
    },
    {
      id: 'ground.olm', parent: 'ground', name: 'Orbital launch mount', short: 'OLM', kind: 'Ground structure', order: 3, view: 'flight',
      summary: 'The steel structure the stack stands on. It holds the fully fuelled rocket down until every engine is running, then lets go.',
      body: [
        'The Pad 2 mount is a steel box, replacing the six-legged ring of Pad 1. It carries ' + U('ground.holdDownClamps') + ' redesigned hold-down clamps, a water-cooled steel top deck, and a side bunker for the booster-loading valves and filters, with oxygen and methane equipment in separate rooms.',
        'Holding the rocket down for the first moments of thrust gives the flight computers time to confirm a good start and shut down before the vehicle leaves the ground.',
        'Pad 1 fed ground gas through the mount to spin up the outer ' + U('booster.enginesOuter') + ' engines; Pad 2 has no such connections. V3 boosters are reported to carry their own spin-start gas on board: ' + WR('raptor.r3.spinStartGas') + '.',
      ],
      specs: [{ label: 'Hold-down clamps', fact: 'ground.holdDownClamps' }, { label: 'Top deck', value: 'Water-cooled steel', conf: 'reported' }, { label: 'Booster quick disconnects', fact: 'ground.boosterQDs' }],
      related: ['ground.deluge', 'ground.qd', 'booster.enginesOuter'],
    },
    {
      id: 'ground.qd', parent: 'ground', name: 'Quick disconnects', short: 'QD', kind: 'Ground interface', order: 4, view: 'flight',
      summary: 'The umbilical connections that pour propellant, gases, power and data into the vehicles until the moment of launch.',
      body: [
        'V3 boosters take propellant through {{ground.boosterQDs}}: separate oxygen and methane connections in the launch mount, moved to the side away from the plume. Earlier boosters had a single combined connection.',
        'The ship is fed from the tower by the ship quick-disconnect arm, which was strengthened, repackaged, and now swings farther from the rocket at launch. The fill port on the ship doubles as its in-space propellant transfer port.',
        'In September 2026 the arm was reconnected to Ship 42 while it hung in the chopsticks, rehearsing how a caught ship would be made safe.',
      ],
      specs: [{ label: 'Booster QDs', fact: 'booster.quickDisconnects' }, { label: 'Ship QD', value: 'Swing arm on the tower', conf: 'reported' }],
      related: ['ship.transferPorts', 'ground.tower', 'ground.tankfarm'],
    },
    {
      id: 'ground.deluge', parent: 'ground', name: 'Flame trench and deluge', kind: 'Ground system', order: 5, view: 'flight',
      summary: 'A steel-lined trench under the mount splits the plume two ways while water floods the flame bucket, the ridge and the deck to soak up heat and sound.',
      body: [
        'On Flight 1 the original pad foundation failed under the plume. Pad 1 then got a water-cooled steel plate that sprays water up into the plume. Pad 2 was designed with a trench from the start: a double-sided, water-cooled flame bucket that sends the exhaust two ways, a water-cooled ridge cap where the halves meet, and a water-cooled top-deck plate, each with its own water tank.',
        'The system starts at T{{ground.flameDiverterActivation}}. The FAA assessment allows up to {{ground.delugeWater}} for each launch, landing or static fire, split ' + WR('ground.delugeSplit') + '.',
        'The water tanks are pressurized by gas generators that burn oxygen and methane to boil liquid nitrogen, instead of banks of high-pressure bottles. On V3 the center engines are clocked {{booster.centerClocking}} so that none fires straight at the ridge.',
      ],
      specs: [{ label: 'Starts at', value: SX.fmt('ground.flameDiverterActivation').replace(/^-/, 'T-'), conf: 'official' }, { label: 'Water per operation, max', fact: 'ground.delugeWater' }],
      related: ['ground.olm', 'booster.enginesCenter'],
    },
    {
      id: 'ground.tankfarm', parent: 'ground', name: 'Tank farm and subcoolers', kind: 'Ground system', order: 6, view: 'flight',
      summary: 'Tanks, pumps and heat exchangers that hold liquid oxygen, liquid methane and liquid nitrogen, chill the propellants below their boiling points and pump them aboard.',
      body: [
        'Both propellants are subcooled: chilled below their boiling points in liquid nitrogen heat exchangers. Colder liquid is denser, so the same tanks hold more mass, and it boils off less during the count. Liquid oxygen boils at {{propellant.loxBoil}} and freezes at {{propellant.loxFreeze}}; methane boils at {{propellant.ch4Boil}} and freezes at {{propellant.ch4Freeze}}. SpaceX does not publish its loading temperatures.',
        'Pad 2 has its own pumps and subcoolers (' + WR('ground.tankfarmPumps') + '), with subcooling capacity ' + WR('ground.subcoolingGain') + '. Loading time fell from {{ground.loadTimePad1}} on Pad 1 to {{ground.loadTimePad2}} on Pad 2; the Flight 14 booster took about {{propellant.loadTime}}.',
        'About {{stack.propTotal}} goes aboard, with oxygen making up about {{propellant.stackO2Fraction}}. Starbase liquid nitrogen storage was rebuilt around {{ground.ln2Storage}} of new tanks.',
      ],
      specs: [
        { label: 'Propellant loaded', fact: 'stack.propTotal' },
        { label: 'Loading time, Pad 2', fact: 'ground.loadTimePad2' },
        { label: 'Loading time, Pad 1', fact: 'ground.loadTimePad1' },
        { label: 'LN2 storage', fact: 'ground.ln2Storage' },
      ],
      related: ['booster.loxTank', 'booster.ch4Tank', 'ground.qd'],
    },
  ]);

  // Timeline event -> part id (event list clicks select these in the inspector)
  const EV_PART = {
    liftoff: 'flight.liftoff', maxq: 'flight.maxq', meco: 'flight.meco', hotstage: 'flight.hotstage',
    boostback: 'flight.boostback', boostbackEnd: 'flight.boostback', boosterLandingBurn: 'flight.boosterLanding', boosterCatch: 'flight.boosterLanding',
    seco: 'flight.seco', relight: 'flight.coast', deploy: 'flight.coast', deployEnd: 'flight.coast', deorbit: 'flight.coast',
    entry: 'flight.entry', peakHeat: 'flight.entry', transonic: 'flight.entry', landingBurn: 'flight.flip', flip: 'flight.flip', splashdown: 'flight.landing',
  };
  const PART_EV = {};
  Object.keys(EV_PART).forEach((ev) => { if (!PART_EV[EV_PART[ev]] && TLID[ev]) PART_EV[EV_PART[ev]] = ev; });
  const EV_SHORT = {
    liftoff: 'Liftoff', maxq: 'Max Q', meco: 'MECO', hotstage: 'Hot staging', boostback: 'Boostback', boostbackEnd: 'Boostback end',
    boosterLandingBurn: 'Landing burn', boosterCatch: 'Splashdown / catch', seco: 'SECO', relight: 'Orbit insertion', deploy: 'Deploy',
    deployEnd: 'Deploy done', deorbit: 'Deorbit burn', entry: 'Entry', peakHeat: 'Peak heating (est.)', transonic: 'Transonic',
    landingBurn: 'Landing burn', flip: 'Flip', splashdown: 'Splashdown',
  };

  /* ------------------------------------------------------------------ styles (all scoped under .v-flight) */

  SX.css(`
.v-flight { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(52px, 7vw, 92px); }
.v-flight .fl-sec { min-width: 0; }
.v-flight .fl-head { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
.v-flight .fl-head .eyebrow { color: var(--accent); }
.v-flight .fl-intro { margin: 0 0 20px; }
.v-flight .fl-note { font: 500 10.5px/1.45 var(--font-mono); letter-spacing: 0.04em; color: var(--muted); }
.v-flight .fl-note b { color: var(--fg-2); font-weight: 500; }

/* ---- mission player */
.v-flight .fl-player { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 318px); gap: 16px; align-items: start; }
.v-flight .fl-screen { border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: var(--bg); min-width: 0; }
.v-flight .fl-cbox { position: relative; height: clamp(300px, 50vh, 500px); border: 0; border-radius: 0; }
.v-flight .fl-cbox canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.v-flight .fl-cbox .viz-toolbar { justify-content: space-between; }
.v-flight .fl-legend { display: flex; gap: 12px; font: 500 10px/1 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-2); background: color-mix(in srgb, var(--bg) 70%, transparent); padding: 6px 8px; border-radius: 4px; }
.v-flight .fl-legend i { display: inline-block; width: 14px; height: 0; border-top: 2px solid var(--steel-2); margin-right: 6px; vertical-align: 3px; }
.v-flight .fl-legend i.ship { border-top-color: var(--fg); }
.v-flight .fl-legend i.plan { border-top: 1px dashed var(--muted); }
.v-flight .fl-cbox .viz-hint { max-width: calc(100% - 24px); background: color-mix(in srgb, var(--bg) 70%, transparent); padding: 3px 6px; border-radius: 3px; }

.v-flight .fl-hud { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 10px 16px; align-items: center; padding: 12px 14px; border-top: 1px solid var(--line); background: linear-gradient(180deg, var(--bg-2), var(--bg)); }
.v-flight .fl-stagecol { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; align-items: center; min-width: 0; }
.v-flight .fl-stagecol.ship { grid-template-columns: minmax(0, 1fr) auto; }
.v-flight .fl-stagecol.ship .fl-tel { text-align: right; }
.v-flight .fl-stagecol.ship .fl-tel-row { flex-direction: row-reverse; }
.v-flight .fl-ring { width: 78px; height: 78px; display: block; cursor: pointer; border-radius: 50%; }
.v-flight .fl-ring .skirt { fill: color-mix(in srgb, var(--bg-3) 60%, transparent); stroke: var(--line-2); stroke-width: 1; }
.v-flight .fl-dot { fill: var(--bg-4); stroke: var(--line-2); stroke-width: 0.8; transition: fill 0.12s, stroke 0.12s; }
.v-flight .fl-dot.on { fill: var(--plume); stroke: var(--mix); }
.v-flight .fl-dot.unk { fill: color-mix(in srgb, var(--warn) 18%, transparent); stroke: var(--warn); stroke-dasharray: 2 1.4; }
.v-flight .fl-tel { min-width: 0; display: grid; gap: 3px; }
.v-flight .fl-tel-name { font: 700 14px/1 var(--font-display); letter-spacing: 0.16em; text-transform: uppercase; color: var(--fg); }
.v-flight .fl-tel-row { display: flex; gap: 8px; align-items: baseline; font: 500 10px/1.3 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.v-flight .fl-tel-row span:first-child { width: 6.2em; flex: none; }
.v-flight .fl-tel-val { font: 500 13px/1.3 var(--font-mono); letter-spacing: 0.02em; text-transform: none; color: var(--fg); font-variant-numeric: tabular-nums; white-space: nowrap; }
.v-flight .fl-tel-val.np { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.v-flight .fl-tel-val.approx { color: var(--fg-2); }
.v-flight .fl-tel-val .q { color: var(--warn); margin-left: 4px; font-size: 9.5px; letter-spacing: 0.06em; }
.v-flight .fl-engcap { font: 500 10px/1.35 var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--fg-2); margin-top: 3px; min-height: 2.7em; }
.v-flight .fl-engcap.warn { color: var(--warn); }
.v-flight .fl-clockcol { text-align: center; min-width: 0; }
.v-flight .fl-clock { font: 600 clamp(24px, 3vw, 36px)/1 var(--font-mono); font-variant-numeric: tabular-nums; letter-spacing: 0.01em; color: var(--fg); white-space: nowrap; }
.v-flight .fl-clockev { font: 600 12.5px/1.2 var(--font-display); letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-2); margin: 7px auto 0; max-width: 24ch; min-height: 2.4em; }
.v-flight .fl-badges { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-top: 4px; height: 18px; overflow: hidden; }
.v-flight .fl-badge { font: 500 9.5px/1 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 6px; border: 1px solid var(--line-2); border-radius: 3px; color: var(--muted); }
.v-flight .fl-badge.ff { color: var(--accent); border-color: var(--accent); }

.v-flight .fl-controls { display: grid; grid-template-columns: auto auto minmax(0, 1fr); gap: 10px 14px; align-items: center; padding: 12px 14px 8px; border-top: 1px solid var(--line); background: var(--bg-2); }
.v-flight .fl-playbtn { width: 42px; height: 34px; padding: 0; }
.v-flight .fl-controls .seg { justify-self: start; }
.v-flight .fl-playbtn svg { width: 14px; height: 14px; fill: currentColor; }
.v-flight .fl-scrub { position: relative; padding: 0 0 30px; min-width: 0; }
.v-flight .fl-scrub input { display: block; margin: 0; }
.v-flight .fl-track { position: absolute; left: 8px; right: 8px; top: 22px; height: 26px; pointer-events: none; }
.v-flight .fl-tick { position: absolute; top: 0; width: 1px; height: 7px; background: var(--steel-2); transform: translateX(-0.5px); }
.v-flight .fl-tick.ship { background: var(--fg); }
.v-flight .fl-tick.both { background: var(--fg-2); height: 9px; }
.v-flight .fl-tick.cur { background: var(--accent); height: 11px; width: 2px; }
.v-flight .fl-seg.cmp { background: repeating-linear-gradient(135deg, transparent 0 3px, var(--line) 3px 4px); }
.v-flight .fl-seg { position: absolute; top: 12px; font: 500 9px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: clip; padding-left: 4px; border-left: 1px solid var(--line-2); height: 12px; }

.v-flight .fl-side { display: grid; gap: 12px; min-width: 0; }
.v-flight .fl-card { padding: 14px 16px; display: grid; gap: 8px; }
.v-flight .fl-card-meta { display: flex; gap: 8px; align-items: center; font: 500 11px/1 var(--font-mono); letter-spacing: 0.06em; color: var(--fg-2); font-variant-numeric: tabular-nums; }
.v-flight .fl-who { font: 500 9.5px/1 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 6px; border-radius: 3px; border: 1px solid var(--line-2); color: var(--fg-2); }
.v-flight .fl-who.booster { color: var(--steel); }
.v-flight .fl-who.ship { color: var(--fg); border-color: var(--steel-2); }
.v-flight .fl-card h4 { margin: 0; }
.v-flight .fl-card p { font-size: 13px; line-height: 1.5; color: var(--fg-2); }
.v-flight .fl-evlist { position: relative; list-style: none; margin: 0; padding: 4px; max-height: 360px; overflow-y: auto; border: 1px solid var(--line); border-radius: var(--radius); background: var(--bg-2); }
.v-flight .fl-evlist button { display: grid; grid-template-columns: 5.4em 8px minmax(0, 1fr); gap: 8px; align-items: baseline; width: 100%; text-align: left; background: none; border: 0; border-radius: 4px; padding: 6px 8px; cursor: pointer; color: var(--muted); font: 400 13px/1.3 var(--font-body); }
.v-flight .fl-evlist button:hover { background: var(--bg-3); color: var(--fg); }
.v-flight .fl-evlist button.past { color: var(--fg-2); }
.v-flight .fl-evlist button[aria-current="true"] { background: var(--accent-soft); color: var(--accent); }
.v-flight .fl-evlist .t { font: 500 11px/1.3 var(--font-mono); font-variant-numeric: tabular-nums; }
.v-flight .fl-evlist .w { width: 7px; height: 7px; border-radius: 50%; background: var(--steel-2); align-self: center; }
.v-flight .fl-evlist .w.ship { background: var(--fg); }
.v-flight .fl-evlist .w.both { background: linear-gradient(90deg, var(--steel-2) 50%, var(--fg) 50%); }

/* ---- catch */
.v-flight .fl-catch { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: 20px 28px; align-items: start; }
.v-flight .fl-catchviz svg { max-height: 80vh; }
.v-flight .fl-catchscroll { overflow-x: auto; overscroll-behavior-x: contain; }
.v-flight svg .fl-sc-name { fill: var(--fg); font: 600 12.5px var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; }
.v-flight svg .fl-sc-name.star { fill: var(--accent); }
.v-flight svg .fl-sc-val { fill: var(--fg); font: 500 12.5px var(--font-mono); letter-spacing: 0.02em; }
.v-flight svg .fl-sc-sub { fill: var(--muted); font: 500 11px var(--font-mono); letter-spacing: 0.04em; }
.v-flight .fl-catchctl { padding: 12px 14px; border-top: 1px solid var(--line); background: var(--bg-2); display: grid; gap: 10px; }
.v-flight .fl-steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; counter-reset: fls; }
.v-flight .fl-steps li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 10px; padding: 8px 10px; border-radius: 4px; color: var(--muted); font-size: 13.5px; line-height: 1.45; counter-increment: fls; }
.v-flight .fl-steps li::before { content: counter(fls); font: 600 12px/20px var(--font-mono); text-align: center; border: 1px solid var(--line-2); border-radius: 50%; width: 20px; height: 20px; }
.v-flight .fl-steps li.on { color: var(--fg); background: var(--bg-2); }
.v-flight .fl-steps li.on::before { border-color: var(--accent); color: var(--accent); }
.v-flight .fl-steps li.done { color: var(--fg-2); }
.v-flight .fl-glist { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.v-flight .fl-catchspecs { margin-top: 22px; max-width: 66ch; }
.v-flight .fl-catchspecs .fact { white-space: normal; }
.v-flight .fl-catchtext .prose { margin-bottom: 14px; }
.v-flight svg .fl-tw { fill: none; stroke: var(--steel-2); stroke-width: 1; }
.v-flight svg .fl-tw-bold { fill: none; stroke: var(--steel); stroke-width: 1.6; }
.v-flight svg .fl-steel { fill: var(--steel-2); stroke: var(--steel); stroke-width: 0.8; }
.v-flight svg .fl-steel-d { fill: var(--bg-4); stroke: var(--steel-2); stroke-width: 0.8; }
.v-flight svg .fl-conc { fill: var(--bg-3); stroke: var(--line-2); stroke-width: 1; }
.v-flight svg .fl-ground { stroke: var(--line-2); stroke-width: 1; fill: none; }
.v-flight svg .fl-water { fill: none; stroke: var(--fg-2); stroke-width: 1; stroke-linecap: round; opacity: 0.55; }
.v-flight svg .fl-hull { fill: var(--steel); stroke: var(--fg); stroke-width: 0.6; }
.v-flight svg .fl-hull-d { fill: var(--steel-2); stroke: var(--steel); stroke-width: 0.6; }
.v-flight svg .fl-tile { fill: var(--tile); stroke: var(--line-2); stroke-width: 0.6; }
.v-flight svg .fl-lox { fill: color-mix(in srgb, var(--lox) 22%, var(--bg-3)); stroke: var(--lox); stroke-width: 1; }
.v-flight svg .fl-ch4 { fill: color-mix(in srgb, var(--ch4) 22%, var(--bg-3)); stroke: var(--ch4); stroke-width: 1; }
.v-flight svg .fl-ln2 { fill: var(--bg-4); stroke: var(--steel); stroke-width: 1; }
.v-flight svg .fl-plume { fill: var(--plume); opacity: 0.85; }
.v-flight svg .fl-plume-core { fill: var(--mix); }
.v-flight svg .fl-acc { fill: none; stroke: var(--accent); stroke-width: 1.4; }
.v-flight svg .fl-accfill { fill: var(--accent); }
.v-flight svg .fl-hit { fill: transparent; stroke: none; }
.v-flight svg .part:focus-visible .fl-hit { stroke: var(--accent); stroke-width: 1.4; stroke-dasharray: 3 2; }
.v-flight svg .part.is-selected .fl-hit { stroke: var(--accent); stroke-width: 1.2; }
.v-flight svg .fl-lbl { fill: var(--fg); font: 500 10.5px var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; }
.v-flight svg .fl-lbl-m { fill: var(--muted); font: 500 9.5px var(--font-mono); letter-spacing: 0.05em; }
.v-flight svg .fl-lbl-a { fill: var(--accent); font: 600 10.5px var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; }
.v-flight svg .fl-dimtxt { fill: var(--fg-2); font: 500 10px var(--font-mono); letter-spacing: 0.04em; }
.v-flight svg .fl-inset-bg { fill: var(--bg-2); stroke: var(--line-2); stroke-width: 1; }

/* ---- scale */
.v-flight .fl-scalebox { overflow-x: auto; overscroll-behavior-x: contain; }
.v-flight .fl-scalebox svg { min-width: 660px; }
.v-flight svg .fl-sil { fill: color-mix(in srgb, var(--steel-2) 55%, var(--bg-3)); stroke: var(--steel); stroke-width: 0.8; transition: opacity 0.35s; }
.v-flight svg .fl-sil.star { fill: color-mix(in srgb, var(--steel) 80%, var(--bg-3)); stroke: var(--fg); }
.v-flight svg .fl-col:hover .fl-sil, .v-flight svg .fl-col:focus-visible .fl-sil { fill: var(--steel); }
.v-flight svg .fl-col.is-on .fl-colbg { fill: var(--accent-soft); }
.v-flight svg .fl-colbg { fill: transparent; }
.v-flight svg .fl-bar { fill: var(--steel-2); transition: height 0.45s cubic-bezier(.2,.8,.2,1), y 0.45s cubic-bezier(.2,.8,.2,1); }
.v-flight svg .fl-bar.star { fill: var(--fg); }
.v-flight svg .fl-grid { stroke: var(--grid); stroke: color-mix(in srgb, var(--steel-2) 18%, transparent); stroke-width: 1; }
.v-flight .fl-scalebar { display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.v-flight .fl-detail { margin-top: 12px; padding: 14px 16px; display: grid; gap: 6px; min-height: 92px; }
.v-flight .fl-detail h4 { margin: 0; }
.v-flight .fl-detail dl { display: flex; flex-wrap: wrap; gap: 6px 22px; margin: 0; font-size: 13px; }
.v-flight .fl-detail dt { font: 500 10px/1.5 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.v-flight .fl-detail dd { margin: 0; font-variant-numeric: tabular-nums; }

/* ---- flight log */
.v-flight .fl-logbar { display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.v-flight .fl-logbox { overflow-x: auto; border: 1px solid var(--line); border-radius: var(--radius); background: var(--bg-2); }
.v-flight .fl-log { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 640px; }
.v-flight .fl-log th { text-align: left; font: 500 10px/1.3 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding: 10px 12px; border-bottom: 1px solid var(--line-2); white-space: nowrap; }
.v-flight .fl-log td { padding: 10px 12px; border-top: 1px solid var(--line); vertical-align: top; color: var(--fg-2); }
.v-flight .fl-log td.n { font: 600 16px/1.2 var(--font-display); color: var(--fg); width: 2.4em; }
.v-flight .fl-log td.d, .v-flight .fl-log td.v { font: 500 12px/1.4 var(--font-mono); white-space: nowrap; font-variant-numeric: tabular-nums; }
.v-flight .fl-log td.o { min-width: 30ch; line-height: 1.45; }
.v-flight .fl-log tr.v3 td.n { color: var(--accent); }
.v-flight .fl-oc { display: inline-block; font: 500 10px/1 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 8px; border-radius: 999px; border: 1px solid var(--line-2); white-space: nowrap; cursor: help; }
.v-flight .fl-oc.success { color: var(--good); border-color: color-mix(in srgb, var(--good) 45%, transparent); }
.v-flight .fl-oc.partial { color: var(--warn); border-color: color-mix(in srgb, var(--warn) 45%, transparent); }
.v-flight .fl-oc.failure { color: var(--bad); border-color: color-mix(in srgb, var(--bad) 45%, transparent); }
.v-flight .fl-tag { display: inline-block; margin-top: 6px; font: 500 9.5px/1 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-2); border: 1px solid var(--line-2); padding: 3px 6px; border-radius: 3px; }
.v-flight .fl-replay { margin-top: 8px; }

@media (max-width: 980px) {
  .v-flight .fl-player { grid-template-columns: minmax(0, 1fr); }
  .v-flight .fl-evlist { max-height: 300px; }
  .v-flight .fl-catch { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 700px) {
  .v-flight .fl-logbox { overflow: visible; }
  .v-flight .fl-log { min-width: 0; }
  .v-flight .fl-log thead { display: none; }
  .v-flight .fl-log tbody { display: block; }
  .v-flight .fl-log tr { display: grid; grid-template-columns: 2.2em minmax(0, 1fr) auto; gap: 2px 10px; padding: 12px 12px 14px; border-top: 1px solid var(--line); }
  .v-flight .fl-log tr:first-child { border-top: 0; }
  .v-flight .fl-log td { display: block; padding: 0; border: 0; }
  .v-flight .fl-log td.n { grid-column: 1; grid-row: 1 / span 3; font-size: 20px; }
  .v-flight .fl-log td.d { grid-column: 2; grid-row: 1; }
  .v-flight .fl-log td.r { grid-column: 3; grid-row: 1 / span 2; text-align: right; }
  .v-flight .fl-log td.bs { grid-column: 2; grid-row: 2; }
  .v-flight .fl-log td.v { grid-column: 2; grid-row: 3; white-space: normal; color: var(--muted); }
  .v-flight .fl-log td.p { grid-column: 3; grid-row: 3; text-align: right; color: var(--muted); }
  .v-flight .fl-log td.o { grid-column: 1 / -1; grid-row: 4; min-width: 0; margin-top: 8px; }
}
@media (max-width: 640px) {
  .v-flight .fl-catchscroll svg { min-width: 540px; }
  .v-flight .fl-scalebox svg { min-width: 820px; }
  .v-flight .fl-hud { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); padding: 10px; }
  .v-flight .fl-clockcol { grid-column: 1 / -1; order: -1; }
  .v-flight .fl-stagecol, .v-flight .fl-stagecol.ship { grid-template-columns: minmax(0, 1fr); gap: 6px; }
  .v-flight .fl-stagecol.ship .fl-ring { order: -1; justify-self: end; }
  .v-flight .fl-ring { width: 64px; height: 64px; }
  .v-flight .fl-tel-row span:first-child { width: auto; }
  .v-flight .fl-controls { grid-template-columns: auto minmax(0, 1fr); padding: 10px; }
  .v-flight .fl-scrub { grid-column: 1 / -1; }
  .v-flight .fl-cbox { height: clamp(280px, 56vh, 420px); }
  .v-flight .fl-legend { display: none; }
}
`);

  /* ------------------------------------------------------------------ mission model
     Event times are real (Flight 14 plan). SpaceX does not publish V3 trajectories, so the path SHAPE is
     illustrative: control points sit at the real event times, and nothing drawn from them is shown as a number. */

  const RE = 6371;  // Earth radius, km (geometry only)

  /** Fritsch-Carlson monotone cubic through (xs, ys): smooth, no overshoot. */
  function monotone(xs, ys) {
    const n = xs.length, dx = [], d = [], m = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = xs[i + 1] - xs[i]; d[i] = (ys[i + 1] - ys[i]) / dx[i]; }
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
    }
    return function (x) {
      if (x <= xs[0]) return ys[0];
      if (x >= xs[n - 1]) return ys[n - 1];
      let i = 0;
      while (i < n - 2 && x > xs[i + 1]) i++;
      const h = dx[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
    };
  }

  // Booster: [time, downrange km, altitude km] (schematic shape at real times)
  const BK = [
    [K.liftoff, 0, 0], [K.maxq, 3, 11], [K.meco * 0.72, 18, 36], [K.meco, 52, 64], [K.bb, 62, 74], [K.bbe, 74, 93],
    [(K.bbe + K.blb) / 2, 52, 112], [K.bbe + (K.blb - K.bbe) * 0.78, 22, 58], [K.blb, 2.5, 7], [K.bc, 0, 0],
  ];
  const bD = monotone(BK.map((k) => k[0]), BK.map((k) => k[1]));
  const bH = monotone(BK.map((k) => k[0]), BK.map((k) => k[2]));
  // Ship ascent and suborbital coast to the orbit insertion burn
  const SK = [
    [K.hs, bD(K.hs), bH(K.hs)], [K.hs + 60, 150, 105], [K.hs + 150, 420, 145], [K.hs + 260, 900, 172], [K.seco, 1500, 188],
    [(K.seco + K.rel) / 2, 5200, 236], [K.rel, 9100, ORBIT_ALT],
  ];
  const sD = monotone(SK.map((k) => k[0]), SK.map((k) => k[1]));
  const sH = monotone(SK.map((k) => k[0]), SK.map((k) => k[2]));
  const OMEGA = ORBIT_PERIOD_S ? (2 * Math.PI) / ORBIT_PERIOD_S : 0;
  const V_GT = RE * OMEGA;         // ground-track rate, km/s
  const D_REL = SK[SK.length - 1][1];
  const H_EI = 105;                // schematic entry-interface height for the drawing only
  const D_ENTRY = 4600;            // schematic entry range for the drawing only
  const FLIP_DUR = 6;              // rotation duration is not published: schematic

  function bDH(t) { return [bD(t), bH(t)]; }
  function sDH(t) {
    if (t <= K.hs) return bDH(t);
    if (t <= K.rel) return [sD(t), sH(t)];
    const dOrb = D_REL + V_GT * (Math.min(t, K.ent) - K.rel);
    if (t <= K.deo) return [dOrb, ORBIT_ALT];
    if (t <= K.ent) return [dOrb, ORBIT_ALT + (H_EI - ORBIT_ALT) * SX.smooth((t - K.deo) / (K.ent - K.deo))];
    const u = SX.clamp((t - K.ent) / (K.spl - K.ent), 0, 1);
    return [dOrb + D_ENTRY * (1 - Math.pow(1 - u, 2.4)), H_EI * Math.pow(1 - u, 1.3)];
  }
  /** (downrange, altitude) -> world [x, y, theta]; launch site at the origin, local up = +y there. */
  function world(dh, ex) {
    const th = dh[0] / RE, r = RE + dh[1] * ex;
    return [r * Math.sin(th), r * Math.cos(th) - RE, th];
  }
  const LAND_TH = sDH(K.spl)[0] / RE;

  /* ---- engines lit, by phase */
  const LAND13 = N_C + N_I;
  function engState(t) {
    const B = { c: 'off', i: 'off', o: 'off', lit: 0, cap: '', warn: false };
    const S = { sl: 'off', vac: 'off', lit: 0, cap: '', warn: false };
    if (t < K.meco) { B.c = B.i = B.o = 'on'; B.lit = N_BOOST; B.cap = N_BOOST + ' of ' + N_BOOST + ' running'; }
    else if (t < K.bb) { B.c = B.i = 'unk'; B.lit = N_C; B.warn = true; B.cap = (t < K.hs ? 'Most cut off' : 'Separated, flipping') + ': V3 count not published'; }
    else if (t < K.bbe) { B.c = B.i = B.o = 'on'; B.lit = N_BOOST; B.cap = 'Boostback: up to ' + N_BOOST + ' relit'; }
    else if (t < K.blb) { B.cap = 'Engines off: grid fins steer'; }
    else if (t < K.bc) {
      const k = Math.min(2, Math.floor(((t - K.blb) / (K.bc - K.blb)) * 3));
      const n = LAND_SEQ[k] != null ? LAND_SEQ[k] : 0;
      B.lit = n;
      if (k === 0) { B.c = B.i = 'on'; B.cap = 'Landing burn: ' + n + ' lit'; }
      else { B.c = B.i = 'unk'; B.warn = true; B.cap = n + ' of ' + LAND13 + ' lit: step time schematic'; }
    } else { B.cap = 'Splashdown on F14: catch on future flights'; }

    if (t < K.hs) { S.cap = 'Engines off, riding on the booster'; }
    else if (t < K.seco) { S.sl = S.vac = 'on'; S.lit = N_SL + N_VAC; S.cap = (N_SL + N_VAC) + ' of ' + (N_SL + N_VAC) + ' running'; }
    else if (t < K.rel) { S.cap = 'Engines off: suborbital coast'; }
    else if (t < K.relEnd) { S.sl = 'unk'; S.lit = 1; S.cap = '1 of ' + N_SL + ' sea-level: orbit insertion'; }
    else if (t < K.deo) { S.cap = t < K.dep ? 'In orbit' : t < K.depe ? 'In orbit: deploying satellites' : 'In orbit: coasting'; }
    else if (t < K.deoEnd) { S.sl = 'unk'; S.lit = 1; S.cap = '1 of ' + N_SL + ' sea-level: deorbit burn'; }
    else if (t < K.ent) { S.cap = 'Engines off: falling toward entry'; }
    else if (t < K.lb) { S.cap = 'Belly-first: flaps steer'; }
    else if (t < K.step32) { S.sl = 'on'; S.lit = N_SL; S.cap = N_SL + ' sea-level lit: flip and burn'; }
    else if (t < K.step21) { S.sl = 'unk'; S.lit = N_SL - 1; S.cap = (N_SL - 1) + ' of ' + N_SL + ' sea-level lit'; }
    else if (t < K.spl) { S.sl = 'unk'; S.lit = N_SL - 2; S.cap = (N_SL - 2) + ' of ' + N_SL + ' sea-level lit'; }
    else { S.cap = 'Splashdown: catch on future flights'; }
    return { B, S };
  }

  /* ---- telemetry: only what the timeline publishes */
  const EV_B = TL.filter((e) => e.who === 'booster' || e.who === 'both');
  const EV_S = TL.filter((e) => e.who === 'ship' || e.who === 'both');
  function tele(list, t, key) {
    let a = null, b = null;
    for (const e of list) { if (e.t <= t + 1e-6) a = e; else { b = e; break; } }
    if (!a || a[key] == null) return { kind: 'np' };
    const va = a[key];
    if (Math.abs(t - a.t) < 0.5) return { kind: 'data', v: va };
    if (!b) return { kind: 'rest', v: va };
    if (b[key] != null) return { kind: 'interp', v: va + ((b[key] - va) * (t - a.t)) / (b.t - a.t) };
    if (a.alt_km != null && a.alt_km >= 100) return { kind: 'hold', v: va };
    return { kind: 'np' };
  }

  /* ---- scrub warp: the 9 h coast is compressed so the busy minutes get room */
  const WK = [
    [0, 0], [K.meco + 60, 0.24], [K.seco + 10, 0.4], [K.depe + 30, 0.54], [K.ent - 150, 0.66], [K.lb - 120, 0.83], [K.end, 1],
  ];
  const SEG_LBL = ['Ascent', 'Return', 'Orbit', 'Coast', 'Entry', 'Land'];
  function t2u(t) {
    for (let i = 0; i < WK.length - 1; i++) {
      if (t <= WK[i + 1][0]) return WK[i][1] + ((WK[i + 1][1] - WK[i][1]) * (t - WK[i][0])) / (WK[i + 1][0] - WK[i][0]);
    }
    return 1;
  }
  function u2t(u) {
    for (let i = 0; i < WK.length - 1; i++) {
      if (u <= WK[i + 1][1]) return WK[i][0] + ((WK[i + 1][0] - WK[i][0]) * (u - WK[i][1])) / (WK[i + 1][1] - WK[i][1]);
    }
    return K.end;
  }
  function curEvent(t) {
    let cur = null;
    for (const e of TL) { if (e.t <= t + 1e-6) cur = e; else break; }
    return cur;
  }
  /** Playback rate: real time x speed, but long empty gaps fast-forward so a coast never takes minutes. */
  function rateAt(t, speed) {
    let prev = 0, next = K.end;
    for (const e of TL) { if (e.t <= t) prev = e.t; else { next = e.t; break; } }
    const margin = 3 * speed;
    if (next - prev > 900 && t - prev > margin && next - t > margin) return { rate: Math.max(speed, (next - prev) / 10), ff: true, cap: next - margin };
    return { rate: speed, ff: false, cap: K.end };
  }

  /* ------------------------------------------------------------------ 1. mission player */

  function hexA(hex, a) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  const EXT_NAMES = { 'booster.catch': 'Booster catch points', 'booster.gridfins': 'Grid fins' };
  const PARTNAME = (id) => (SX.part(id) ? SX.part(id).name : EXT_NAMES[id] || id);
  function partAttrs(id, label) {
    return { class: 'part', 'data-part': id, tabindex: '0', role: 'button', 'aria-label': label || PARTNAME(id) };
  }
  /** Click, hover tip and keyboard select for an SVG or HTML element standing for a part. */
  function wirePart(node, id, tipLine) {
    node.addEventListener('click', (e) => { e.stopPropagation(); SX.select(id); });
    node.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); SX.select(id); } });
    node.addEventListener('pointerenter', () => { node.classList.add('is-hover'); SX.hover(id); });
    node.addEventListener('pointermove', (e) => {
      const p = SX.part(id);
      SX.tip.show('<b>' + SX.esc(p ? p.name : id) + '</b>' + SX.esc(tipLine || (p && p.summary ? p.summary.replace(/\{\{[^}]+\}\}/g, '').split('. ')[0] + '.' : '')), e.clientX, e.clientY);
    });
    node.addEventListener('pointerleave', () => { node.classList.remove('is-hover'); SX.hover(null); SX.tip.hide(); });
    return node;
  }

  /* ---- engine ring (HUD): booster 3/10/20, ship 3 SL + 3 RVac, as seen from below */
  function engineRing(kind) {
    const svg = SX.svg('svg', { viewBox: '0 0 100 100', class: 'fl-ring', 'aria-hidden': 'false' });
    svg.appendChild(SX.svg('circle', { cx: 50, cy: 50, r: 48, class: 'skirt' }));
    const groups = {};
    const polar = (deg, r) => [50 + r * Math.cos((deg * Math.PI) / 180), 50 + r * Math.sin((deg * Math.PI) / 180)];
    function group(key, partId, label, list) {
      const g = SX.svg('g', partAttrs(partId, label));
      const dots = list.map(([deg, r, s]) => { const [x, y] = polar(deg, r); const c = SX.svg('circle', { cx: x.toFixed(2), cy: y.toFixed(2), r: s, class: 'fl-dot' }); g.appendChild(c); return c; });
      wirePart(g, partId, label);
      svg.appendChild(g);
      groups[key] = dots;
    }
    if (kind === 'booster') {
      const clock = numsIn(SX.val('booster.centerClocking', ''));  // reported 108/108/144 degrees
      let a = -90;
      const center = [];
      for (let k = 0; k < N_C; k++) { center.push([a, 11, 5.4]); a += clock[k] || 360 / N_C; }
      group('c', 'booster.enginesCenter', 'Center engines: gimbal, clocked ' + (SX.val('booster.centerClocking') || '') + ' degrees (reported)', center);
      group('i', 'booster.enginesInner', 'Inner ring: gimbal, relight', Array.from({ length: N_I }, (_, k) => [-90 + 18 + (k * 360) / N_I, 27, 5.4]));
      group('o', 'booster.enginesOuter', 'Outer ring: fixed, relight on V3', Array.from({ length: N_O }, (_, k) => [-90 + (k * 360) / N_O, 41.5, 5]));
    } else {
      group('sl', 'ship.enginesSL', 'Sea-level Raptors: gimbal, used for landing', Array.from({ length: N_SL }, (_, k) => [-90 + (k * 360) / N_SL, 11, 6.5]));
      group('vac', 'ship.enginesVac', 'Raptor Vacuum: fixed, large nozzles', Array.from({ length: N_VAC }, (_, k) => [90 + (k * 360) / N_VAC, 31, 12]));
    }
    svg.setAttribute('aria-label', kind === 'booster' ? 'Super Heavy engine layout seen from below' : 'Starship engine layout seen from below');
    return { svg, set(states) { Object.keys(groups).forEach((k) => groups[k].forEach((c) => c.setAttribute('class', 'fl-dot ' + (states[k] || 'off')))); } };
  }

  function buildPlayer(root) {
    const C = {};
    ['--fg', '--fg-2', '--muted', '--steel', '--steel-2', '--line', '--line-2', '--bg', '--bg-2', '--bg-3', '--bg-4', '--plume', '--mix', '--accent', '--warn'].forEach((v) => { C[v.slice(2)] = SX.color(v); });
    const P = { t: 0, playing: false, speed: 10, cam: 'auto', lastEv: null, ff: false };
    let dirty = true;

    /* DOM */
    const canvas = SX.el('canvas', { role: 'img', 'aria-label': 'Side view of the Flight 14 trajectory: the booster returns toward the launch site while the ship continues to orbit, reenters and lands.' });
    const hint = SX.el('div', { class: 'viz-hint' });
    const camSeg = SX.el('div', { class: 'seg', role: 'group', 'aria-label': 'Camera' });
    [['auto', 'Follow'], ['site', 'Launch site'], ['earth', 'Whole Earth']].forEach(([k, lbl]) => {
      camSeg.appendChild(SX.el('button', { type: 'button', 'aria-pressed': String(k === P.cam), onclick: () => { P.cam = k; camSeg.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === ['auto', 'site', 'earth'].indexOf(k)))); dirty = true; } }, lbl));
    });
    const legend = SX.el('div', { class: 'fl-legend', 'aria-hidden': 'true' },
      SX.el('span', null, SX.el('i'), 'Booster'), SX.el('span', null, SX.el('i', { class: 'ship' }), 'Ship'), SX.el('span', null, SX.el('i', { class: 'plan' }), 'Planned'));
    const cbox = SX.el('div', { class: 'viz viz-grid fl-cbox' }, canvas, SX.el('div', { class: 'viz-toolbar' }, camSeg, legend), hint);

    function stageCol(kind) {
      const ring = engineRing(kind);
      const sp = SX.el('span', { class: 'fl-tel-val' }), al = SX.el('span', { class: 'fl-tel-val' }), cap = SX.el('div', { class: 'fl-engcap' });
      const tel = SX.el('div', { class: 'fl-tel' },
        SX.el('div', { class: 'fl-tel-name' }, kind === 'booster' ? 'Super Heavy' : 'Starship'),
        SX.el('div', { class: 'fl-tel-row' }, SX.el('span', null, 'Speed'), sp),
        SX.el('div', { class: 'fl-tel-row' }, SX.el('span', null, 'Altitude'), al), cap);
      const col = SX.el('div', { class: 'fl-stagecol ' + kind }, kind === 'booster' ? [ring.svg, tel] : [tel, ring.svg]);
      return { col, ring, sp, al, cap };
    }
    const HB = stageCol('booster'), HS = stageCol('ship');
    const clockEl = SX.el('div', { class: 'fl-clock', 'aria-live': 'off' });
    const clockEv = SX.el('div', { class: 'fl-clockev' });
    const badges = SX.el('div', { class: 'fl-badges' });
    const hud = SX.el('div', { class: 'fl-hud' }, HB.col, SX.el('div', { class: 'fl-clockcol' }, clockEl, clockEv, badges), HS.col);

    const ICON_PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
    const ICON_PAUSE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg>';
    const playBtn = SX.el('button', { type: 'button', class: 'btn fl-playbtn', 'aria-label': 'Play', html: ICON_PLAY });
    const speedSeg = SX.el('div', { class: 'seg', role: 'group', 'aria-label': 'Playback speed' });
    [1, 10, 60].forEach((s) => speedSeg.appendChild(SX.el('button', { type: 'button', 'aria-pressed': String(s === P.speed), 'data-speed': s, onclick: () => { P.speed = s; speedSeg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.speed === s))); } }, s + 'x')));
    const range = SX.el('input', { type: 'range', min: '0', max: '1000', step: '1', value: '0', 'aria-label': 'Mission time' });
    const track = SX.el('div', { class: 'fl-track', 'aria-hidden': 'true' });
    WK.slice(0, -1).forEach((k, i) => {
      const u0 = k[1], u1 = WK[i + 1][1];
      track.appendChild(SX.el('span', { class: 'fl-seg' + (i === 3 ? ' cmp' : ''), style: { left: (u0 * 100).toFixed(2) + '%', width: ((u1 - u0) * 100).toFixed(2) + '%' }, title: i === 3 ? 'Long coast, time compressed on this scale' : '' }, SEG_LBL[i]));
    });
    const tickEls = {};
    TL.forEach((e) => {
      const tk = SX.el('span', { class: 'fl-tick ' + e.who, style: { left: (t2u(e.t) * 100).toFixed(2) + '%' } });
      tickEls[e.id] = tk;
      track.appendChild(tk);
    });
    const scrub = SX.el('div', { class: 'fl-scrub' }, range, track);
    const controls = SX.el('div', { class: 'fl-controls' }, playBtn, speedSeg, scrub);
    const screen = SX.el('div', { class: 'fl-screen' }, cbox, hud, controls);

    // event card + list
    const cardMeta = SX.el('div', { class: 'fl-card-meta' });
    const cardH = SX.el('h4', { class: 'h4' });
    const cardP = SX.el('p');
    const cardBtn = SX.el('button', { type: 'button', class: 'btn btn-sm' }, 'Open in inspector');
    const card = SX.el('div', { class: 'panel fl-card', 'aria-live': 'polite' }, cardMeta, cardH, cardP, SX.el('div', null, cardBtn));
    const list = SX.el('ol', { class: 'fl-evlist', 'aria-label': 'Flight 14 events' });
    const evBtns = {};
    TL.forEach((e) => {
      const b = SX.el('button', { type: 'button', onclick: () => jump(e.id, true) },
        SX.el('span', { class: 't' }, tShort(e.t)), SX.el('span', { class: 'w ' + e.who, title: e.who }), SX.el('span', null, e.label));
      evBtns[e.id] = b;
      list.appendChild(SX.el('li', null, b));
    });
    const side = SX.el('div', { class: 'fl-side' }, card, list,
      SX.el('p', { class: 'fl-note' }, 'Event times: SpaceX Flight 14 plan. ', SX.el('b', null, 'Dashed engine dots'), ' mark counts SpaceX has not published or step times that are schematic.'));
    root.appendChild(SX.el('div', { class: 'fl-player' }, screen, side));

    /* ---- interactions */
    playBtn.addEventListener('click', () => {
      if (!P.playing && P.t >= K.end - 0.01) setT(0);
      P.playing = !P.playing;
      syncPlay();
    });
    function syncPlay() {
      playBtn.innerHTML = P.playing ? ICON_PAUSE : ICON_PLAY;
      playBtn.setAttribute('aria-label', P.playing ? 'Pause' : 'Play');
    }
    range.addEventListener('input', () => { setT(u2t(+range.value / 1000)); });
    cardBtn.addEventListener('click', () => { const e = curEvent(P.t); if (e && EV_PART[e.id]) SX.select(EV_PART[e.id]); });

    function setT(t) {
      P.t = SX.clamp(t, 0, K.end);
      dirty = true;
      syncUI();
    }
    function jump(id, select) {
      const e = TLID[id];
      if (!e) return;
      P.playing = false;
      syncPlay();
      setT(e.t);
      if (select && EV_PART[id]) SX.select(EV_PART[id], { from: 'flight' });
    }

    function fmtTele(r, unit, el) {
      el.className = 'fl-tel-val';
      if (r.kind === 'np') { el.classList.add('np'); el.textContent = 'not published'; el.title = 'SpaceX has not published this value for V3 flights.'; return; }
      const txt = r.kind === 'interp' || r.kind === 'hold' ? fmt3(r.v, unit) : SX.fmtValue(r.v, unit, { digits: 0 });
      if (r.kind === 'interp' || r.kind === 'hold') {
        el.classList.add('approx');
        el.innerHTML = '&asymp; ' + SX.esc(txt) + '<span class="q">' + (r.kind === 'hold' ? 'held' : 'approx') + '</span>';
        el.title = r.kind === 'hold' ? 'Holding the last published orbit value while the ship coasts.' : 'Interpolated between published values: approximate.';
      } else { el.textContent = txt; el.title = 'From the published timeline.'; }
    }
    function syncUI() {
      const t = P.t;
      range.value = String(Math.round(t2u(t) * 1000));
      range.setAttribute('aria-valuetext', clock(t));
      clockEl.textContent = clock(t);
      const e = curEvent(t);
      clockEv.textContent = e ? EV_SHORT[e.id] || e.label : '';
      fmtTele(tele(EV_B, t, 'speed_kmh'), 'km/h', HB.sp);
      fmtTele(tele(EV_B, t, 'alt_km'), 'km', HB.al);
      fmtTele(tele(EV_S, t, 'speed_kmh'), 'km/h', HS.sp);
      fmtTele(tele(EV_S, t, 'alt_km'), 'km', HS.al);
      const es = engState(t);
      HB.ring.set(es.B); HS.ring.set(es.S);
      HB.cap.textContent = es.B.cap; HB.cap.classList.toggle('warn', es.B.warn);
      HS.cap.textContent = es.S.cap; HS.cap.classList.toggle('warn', es.S.warn);
      badges.innerHTML = '';
      if (P.ff && P.playing) badges.appendChild(SX.el('span', { class: 'fl-badge ff' }, 'Fast-forward'));
      if (t > K.depe && t < K.deo) badges.appendChild(SX.el('span', { class: 'fl-badge' }, 'Plan: long coast'));
      if (t >= K.ph - 1 && t < K.ts) badges.appendChild(SX.el('span', { class: 'fl-badge' }, 'Peak heating time: estimate'));
      if ((t >= K.blb && t < K.bc) || (t >= K.flip && t < K.flip + FLIP_DUR)) badges.appendChild(SX.el('span', { class: 'fl-badge' }, 'Timing schematic'));
      Object.keys(tickEls).forEach((id) => tickEls[id].classList.toggle('cur', !!e && e.id === id));
      Object.keys(evBtns).forEach((id) => {
        const b = evBtns[id];
        if (e && e.id === id) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
        b.classList.toggle('past', TLID[id].t <= t);
      });
      if ((e && e.id) !== P.lastEv) {
        P.lastEv = e ? e.id : null;
        if (e) {
          cardMeta.innerHTML = '';
          cardMeta.append(SX.el('span', null, clock(e.t)), SX.el('span', { class: 'fl-who ' + e.who }, e.who === 'both' ? 'Full stack' : e.who === 'booster' ? 'Booster' : 'Ship'));
          cardH.textContent = e.label;
          cardP.textContent = e.note || '';
          cardBtn.hidden = !EV_PART[e.id];
          if (EV_PART[e.id]) cardBtn.textContent = 'Open: ' + PARTNAME(EV_PART[e.id]);
          const li = evBtns[e.id];
          if (li && list.scrollHeight > list.clientHeight) {
            const top = li.offsetTop - list.clientHeight / 2 + li.offsetHeight / 2;
            list.scrollTop = SX.clamp(top, 0, list.scrollHeight);
          }
        }
      }
    }

    /* ---- camera: keyframed on mission time (box = region to fit, rot aligns local vertical) */
    const EXN = 3, EXG = 2;
    const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
    const ROT_L = wrapA(LAND_TH);
    const fixed = (cx, cy, bw, bh) => () => ({ cx, cy, bw, bh });
    function landBox(bw, bh) {
      return (t, ex) => { const p = world([sDH(K.spl)[0], 0], ex); const up = bh * 0.3; return { cx: p[0] + Math.sin(p[2]) * up, cy: p[1] + Math.cos(p[2]) * up, bw, bh }; };
    }
    function followShip(bw, bh) {
      return (t, ex) => { const p = world(sDH(t), ex); return { cx: p[0], cy: p[1], bw, bh }; };
    }
    function entryBox(t, ex) {
      const a = world(sDH(K.ent), ex), b = world([sDH(K.spl)[0], 0], ex);
      const chord = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const up = chord * 0.12;
      return { cx: (a[0] + b[0]) / 2 + Math.sin(LAND_TH) * up, cy: (a[1] + b[1]) / 2 + Math.cos(LAND_TH) * up, bw: chord * 1.2, bh: chord * 0.62 };
    }
    const GLOBAL = fixed(0, -RE, RE * 2.7, RE * 2.7);
    const NEAR = [
      { t: 0, ex: EXN, rot: 0, box: fixed(10, 55, 190, 150) },
      { t: K.meco, ex: EXN, rot: 0, box: fixed(38, 190, 380, 330) },
      { t: K.seco - 230, ex: EXN, rot: 0, box: fixed(420, 250, 1300, 780) },
      { t: K.seco, ex: EXN, rot: 0, box: fixed(760, 250, 1950, 920) },
    ];
    const CAMS = {
      auto: NEAR.concat([
        { t: K.seco + 420, ex: EXG, rot: 0, box: GLOBAL },
        { t: K.ent - 900, ex: EXG, rot: 0, box: GLOBAL },
        { t: K.ent - 60, ex: EXN, rot: ROT_L, box: entryBox },
        { t: K.ts - 30, ex: EXN, rot: ROT_L, box: followShip(900, 560) },
        { t: K.lb - 12, ex: EXN, rot: ROT_L, box: landBox(15, 9.5) },
        { t: K.end + 60, ex: EXN, rot: ROT_L, box: landBox(15, 9.5) },
      ]),
      site: NEAR.concat([{ t: K.end + 60, ex: EXN, rot: 0, box: NEAR[3].box }]),
      earth: [{ t: 0, ex: EXG, rot: 0, box: GLOBAL }, { t: K.end + 60, ex: EXG, rot: 0, box: GLOBAL }],
    };
    function camAt(t) {
      const keys = CAMS[P.cam] || CAMS.auto;
      let i = 0;
      while (i < keys.length - 2 && t >= keys[i + 1].t) i++;
      const a = keys[i], b = keys[i + 1];
      const u = SX.smooth(SX.clamp((t - a.t) / (b.t - a.t), 0, 1));
      const ex = SX.lerp(a.ex, b.ex, u);
      const A = a.box(t, ex), B = b.box(t, ex);
      return {
        ex, rot: SX.lerp(a.rot, b.rot, u),
        cx: SX.lerp(A.cx, B.cx, u), cy: SX.lerp(A.cy, B.cy, u),
        bw: Math.exp(SX.lerp(Math.log(A.bw), Math.log(B.bw), u)), bh: Math.exp(SX.lerp(Math.log(A.bh), Math.log(B.bh), u)),
      };
    }

    /* ---- sampled paths */
    const B_TS = [], S_TS = [];
    for (let t = 0; t <= K.bc; t += 1.5) B_TS.push(t);
    B_TS.push(K.bc);
    const pushRange = (arr, a, b, step) => { for (let t = a; t < b; t += step) arr.push(t); };
    pushRange(S_TS, 0, K.hs, 2); pushRange(S_TS, K.hs, K.rel, 4); pushRange(S_TS, K.rel, K.deo, 45);
    pushRange(S_TS, K.deo, K.ent, 20); pushRange(S_TS, K.ent, K.lb, 3); pushRange(S_TS, K.lb, K.spl, 0.5); S_TS.push(K.spl);

    // seeded star field (screen space)
    const STARS = [];
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let k = 0; k < 150; k++) STARS.push([rnd(), rnd(), 0.2 + rnd() * 0.55, rnd() < 0.12 ? 1.4 : 0.9]);

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    function resize() {
      const r = cbox.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      dirty = true;
    }
    if ('ResizeObserver' in window) new ResizeObserver(() => { resize(); render(); }).observe(cbox);
    else window.addEventListener('resize', () => { resize(); render(); });

    let markers = [];   // screen positions of event markers for hit testing
    let lastHint = '';

    function noseLocal(phiDeg, th) {
      const p = (phiDeg * Math.PI) / 180, c = Math.cos(p), s = Math.sin(p);
      return [c * Math.cos(th) + s * Math.sin(th), -c * Math.sin(th) + s * Math.cos(th)];
    }
    function tangent(fn, t, ex) {
      const a = world(fn(Math.max(0, t - 0.6)), ex), b = world(fn(t + 0.6), ex);
      const dx = b[0] - a[0], dy = b[1] - a[1];
      if (Math.hypot(dx, dy) < 1e-6) { const th = world(fn(t), ex)[2]; return [Math.sin(th), Math.cos(th)]; }
      return [dx, dy];
    }
    function localPhi(v, th) {
      const e = v[0] * Math.cos(th) - v[1] * Math.sin(th), u = v[0] * Math.sin(th) + v[1] * Math.cos(th);
      return (Math.atan2(u, e) * 180) / Math.PI;
    }
    function boosterNose(t, ex) {
      const th = world(bDH(t), ex)[2];
      if (t < K.hs) return tangent(bDH, t, ex);
      const phiHs = localPhi(tangent(bDH, K.hs, ex), world(bDH(K.hs), ex)[2]);
      let phi;
      if (t < K.bb) phi = SX.lerp(phiHs, 160, SX.smooth((t - K.hs) / (K.bb - K.hs)));
      else if (t < K.bbe) phi = 160;
      else if (t < K.blb) phi = SX.lerp(160, 90, SX.smooth((t - K.bbe) / (K.blb - K.bbe)));
      else phi = 90;
      return noseLocal(phi, th);
    }
    function shipNose(t, ex) {
      if (t < K.ent) return tangent(sDH, t, ex);
      const th = world(sDH(t), ex)[2];
      let phi;
      if (t < K.flip) phi = SX.lerp(18, 0, SX.smooth((t - K.ent) / (K.flip - K.ent)));
      else if (t < K.flip + FLIP_DUR) phi = SX.lerp(0, 90, SX.smooth((t - K.flip) / FLIP_DUR));
      else phi = 90;
      return noseLocal(phi, th);
    }

    function render() {
      if (!W || !H) resize();
      const t = P.t;
      const cam = camAt(t);
      const sc = Math.min(W / cam.bw, H / cam.bh);
      const cr = Math.cos(cam.rot), sr = Math.sin(cam.rot);
      const X = (x, y) => [W / 2 + sc * (cr * (x - cam.cx) - sr * (y - cam.cy)), H / 2 - sc * (sr * (x - cam.cx) + cr * (y - cam.cy))];
      const dirS = (v) => Math.atan2(-(sr * v[0] + cr * v[1]), cr * v[0] - sr * v[1]);
      const onScreen = (p, m) => p[0] > -m && p[0] < W + m && p[1] > -m && p[1] < H + m;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // stars (fade out near the ground at close range)
      const starA = SX.clamp(Math.log10(cam.bw) / 3.6, 0.15, 1);
      STARS.forEach(([x, y, a, s]) => { ctx.fillStyle = hexA(C.fg, a * starA * 0.6); ctx.fillRect(x * W, y * H, s, s); });

      // Earth: sampled arc around the camera, so huge radii stay precise
      const thc = Math.atan2(cam.cx, cam.cy + RE);
      const span = Math.min(Math.PI, (Math.max(cam.bw, cam.bh) * 1.4) / RE + 0.01);
      const N = 260;
      const limb = (r) => { const pts = []; for (let i = 0; i <= N; i++) { const th = thc - span + (2 * span * i) / N; pts.push(X(r * Math.sin(th), r * Math.cos(th) - RE)); } return pts; };
      const trace = (pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); };
      // atmosphere glow, schematic 100 km shell (exaggerated with the altitudes)
      for (let k = 5; k >= 0; k--) {
        trace(limb(RE + ((k + 0.5) / 6) * 100 * cam.ex));
        ctx.strokeStyle = hexA(C.steel, 0.05 * (1 - k / 6));
        ctx.lineWidth = Math.max(1, (100 * cam.ex * sc) / 6 + 1);
        ctx.stroke();
      }
      const surf = limb(RE);
      trace(surf);
      if (span < Math.PI) { const c = X(0, -RE); ctx.lineTo(c[0], c[1]); }
      ctx.closePath();
      const grd = ctx.createLinearGradient(0, 0, 0, H);
      grd.addColorStop(0, C['bg-3']); grd.addColorStop(1, C['bg-2']);
      ctx.fillStyle = grd;
      ctx.fill();
      trace(surf);
      ctx.strokeStyle = C['steel-2']; ctx.lineWidth = 1; ctx.stroke();

      // orbit ring (whole-Earth view)
      if (cam.bw > 6000 && ORBIT_ALT) {
        ctx.setLineDash([2, 5]);
        trace(limb(RE + ORBIT_ALT * cam.ex));
        ctx.strokeStyle = hexA(C.fg, 0.28); ctx.stroke();
        ctx.setLineDash([]);
      }

      // launch site and Gulf coastline cue
      const site = X(0, 0);
      if (onScreen(site, 40)) {
        const up = dirS([0, 1]);
        ctx.save(); ctx.translate(site[0], site[1]); ctx.rotate(up + Math.PI / 2);
        ctx.strokeStyle = C.steel; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -15); ctx.moveTo(-3, 0); ctx.lineTo(-3, -13); ctx.lineTo(0, -15); ctx.moveTo(0, -11); ctx.lineTo(5, -11); ctx.stroke();
        ctx.restore();
      }
      const placed = [];  // screen rects already holding a label
      const free = (r) => r.x > 2 && r.y > 2 && r.x + r.w < W - 2 && r.y + r.h < H - 2 && !placed.some((q) => r.x < q.x + q.w && r.x + r.w > q.x && r.y < q.y + q.h && r.y + r.h > q.y);
      if (cam.bw < 2600 && Math.abs(cam.rot) < 0.01) {
        // water east of the pad, land to the west; map-style captions just under the surface line
        const sea = surf.filter((p, i) => thc - span + (2 * span * i) / N > 0.0004);
        ctx.strokeStyle = hexA(C.fg, 0.35); ctx.lineWidth = 2;
        trace(sea); ctx.stroke();
        ctx.font = '500 10px ' + (getComputedStyle(document.body).getPropertyValue('--font-mono') || 'monospace');
        ctx.fillStyle = C.muted;
        const gp = sea.find((p) => p[0] > W * 0.62);
        if (gp && gp[1] < H - 8) { ctx.fillText('GULF', gp[0], gp[1] + 16); placed.push({ x: gp[0] - 2, y: gp[1] + 4, w: 34, h: 16 }); }
        if (onScreen(site, -30)) { ctx.fillText('STARBASE, TX', site[0] - 34, site[1] + 16); placed.push({ x: site[0] - 36, y: site[1] + 4, w: 84, h: 16 }); }
      }

      // paths
      function drawPath(ts, fn, tmax, col, width) {
        const pts = ts.map((tt) => X.apply(null, world(fn(tt), cam.ex)));
        ctx.setLineDash([3, 4]); ctx.strokeStyle = hexA(C.muted, 0.55); ctx.lineWidth = 1;
        trace(pts); ctx.stroke(); ctx.setLineDash([]);
        const done = [];
        for (let i = 0; i < ts.length && ts[i] <= tmax; i++) done.push(pts[i]);
        if (tmax > 0) done.push(X.apply(null, world(fn(tmax), cam.ex)));
        if (done.length > 1) { ctx.strokeStyle = col; ctx.lineWidth = width; trace(done); ctx.stroke(); }
      }
      drawPath(B_TS, bDH, Math.min(t, K.bc), C['steel-2'], 1.6);
      drawPath(S_TS, sDH, Math.min(t, K.spl), hexA(C.fg, 0.9), 1.6);

      // event markers + labels (greedy collision avoidance)
      markers = [];
      const cur = curEvent(t);
      const selEv = SX.selected && PART_EV[SX.selected] ? SX.selected : null;
      ctx.font = '500 10px ' + (getComputedStyle(document.body).getPropertyValue('--font-mono') || 'monospace');
      const order = TL.slice().sort((a, b) => (cur && a.id === cur.id ? -1 : cur && b.id === cur.id ? 1 : 0));
      // vehicles first claim their label space
      const bp = X.apply(null, world(bDH(Math.min(t, K.bc)), cam.ex));
      const sp = X.apply(null, world(sDH(Math.min(t, K.spl)), cam.ex));
      placed.push({ x: sp[0] - 12, y: sp[1] - 12, w: 24, h: 24 }, { x: bp[0] - 12, y: bp[1] - 12, w: 24, h: 24 });
      order.forEach((e) => {
        const fn = e.who === 'booster' ? bDH : sDH;
        const p = X.apply(null, world(fn(e.t), cam.ex));
        if (!onScreen(p, 6)) return;
        const isCur = cur && cur.id === e.id;
        const isSel = selEv && EV_PART[e.id] === selEv;
        const past = e.t <= t;
        markers.push({ id: e.id, x: p[0], y: p[1] });
        ctx.beginPath(); ctx.arc(p[0], p[1], isCur ? 4 : 3, 0, Math.PI * 2);
        ctx.fillStyle = past ? (e.who === 'booster' ? C['steel-2'] : C.fg) : C.bg;
        ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = isCur || isSel ? C.accent : past ? C.fg : C.muted; ctx.stroke();
        if (isCur || isSel) { ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, Math.PI * 2); ctx.strokeStyle = C.accent; ctx.stroke(); }
        const txt = (EV_SHORT[e.id] || e.id).toUpperCase();
        const w = ctx.measureText(txt).width + 6, h = 14;
        const cands = [[8, -h - 2], [8, 2], [-w - 8, -h - 2], [-w - 8, 2], [-w / 2, -h - 10], [-w / 2, 9]];
        for (const [ox, oy] of cands) {
          const r = { x: p[0] + ox, y: p[1] + oy, w, h };
          if (free(r)) {
            placed.push(r);
            ctx.fillStyle = hexA(C.bg, 0.72); ctx.fillRect(r.x, r.y, r.w, r.h);
            ctx.fillStyle = isCur || isSel ? C.accent : past ? C['fg-2'] : C.muted;
            ctx.fillText(txt, r.x + 3, r.y + 10.5);
            break;
          }
        }
      });

      // vehicles
      const es = engState(t);
      const small = cam.bw > 6000 ? 0.7 : cam.bw < 120 ? 1.7 : 1;
      function rocket(p, dir, len, wid, body, plumeN, total, nose) {
        const a = dirS(dir);
        ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(a); ctx.translate(len / 2, 0);  // tail (engines) sits on the path point
        if (plumeN > 0) {
          const pl = (6 + 16 * Math.sqrt(plumeN / Math.max(1, total))) * small;
          const g = ctx.createLinearGradient(-len / 2, 0, -len / 2 - pl, 0);
          g.addColorStop(0, hexA(C.mix, 0.95)); g.addColorStop(0.35, hexA(C.plume, 0.8)); g.addColorStop(1, hexA(C.plume, 0));
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.moveTo(-len / 2, -wid / 2); ctx.lineTo(-len / 2 - pl, 0); ctx.lineTo(-len / 2, wid / 2); ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = body; ctx.strokeStyle = C.bg; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-len / 2, -wid / 2); ctx.lineTo(len / 2 - (nose ? wid : 0), -wid / 2);
        if (nose) ctx.quadraticCurveTo(len / 2, -wid / 2, len / 2, 0), ctx.quadraticCurveTo(len / 2, wid / 2, len / 2 - wid, wid / 2);
        else ctx.lineTo(len / 2, wid / 2);
        ctx.lineTo(-len / 2, wid / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      function tag(p, txt, col) {
        const w = ctx.measureText(txt).width + 6;
        const cands = [[12, -20], [12, 6], [-w - 12, -20], [-w - 12, 6]];
        for (const [ox, oy] of cands) {
          const r = { x: SX.clamp(p[0] + ox, 2, W - w - 2), y: SX.clamp(p[1] + oy, 2, H - 16), w, h: 14 };
          if (free(r) || ox === cands[cands.length - 1][0]) { placed.push(r); ctx.fillStyle = hexA(C.bg, 0.8); ctx.fillRect(r.x, r.y, r.w, r.h); ctx.fillStyle = col; ctx.fillText(txt, r.x + 3, r.y + 10.5); return; }
        }
      }
      const bT = Math.min(t, K.bc), sT = Math.min(t, K.spl);
      if (t < K.hs) {
        const dir = tangent(bDH, t, cam.ex);
        const ang = dirS(dir);
        const off = [Math.cos(ang), Math.sin(ang)];
        // booster part behind, ship part in front, along the axis
        rocket(bp, dir, 17 * small, 4.6 * small, C['steel-2'], es.B.lit, N_BOOST, false);
        rocket([bp[0] + off[0] * 17 * small, bp[1] + off[1] * 17 * small], dir, 12 * small, 4.6 * small, C.fg, 0, 1, true);
        tag(bp, 'SUPER HEAVY + STARSHIP', C.fg);
      } else {
        rocket(bp, boosterNose(bT, cam.ex), 17 * small, 4.6 * small, C['steel-2'], es.B.lit, N_BOOST, false);
        rocket(sp, shipNose(sT, cam.ex), 12 * small, 4.6 * small, C.fg, es.S.lit, N_SL + N_VAC, true);
        if (onScreen(bp, 0)) tag(bp, 'SUPER HEAVY', C['steel']);
        if (onScreen(sp, 0)) tag(sp, 'STARSHIP', C.fg);
      }

      const h2 = 'Schematic path, real event times. Altitude x' + (Math.round(cam.ex * 2) / 2) + '.';
      if (h2 !== lastHint) { hint.textContent = h2; lastHint = h2; }
      dirty = false;
    }

    /* ---- canvas pointer: event markers are clickable */
    function hitMarker(e) {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      let best = null, bd = 144;
      markers.forEach((m) => { const d = (m.x - x) ** 2 + (m.y - y) ** 2; if (d < bd) { bd = d; best = m; } });
      return best;
    }
    canvas.addEventListener('pointermove', (e) => {
      const m = hitMarker(e);
      canvas.style.cursor = m ? 'pointer' : '';
      if (m) SX.tip.show('<b>' + SX.esc(EV_SHORT[m.id] || m.id) + '</b>' + SX.esc(clock(TLID[m.id].t) + ': ' + TLID[m.id].label), e.clientX, e.clientY);
      else SX.tip.hide();
    });
    canvas.addEventListener('pointerleave', () => SX.tip.hide());
    canvas.addEventListener('click', (e) => { const m = hitMarker(e); if (m) jump(m.id, true); });

    /* ---- clock */
    SX.loop(cbox, (dt) => {
      if (P.playing) {
        const r = rateAt(P.t, P.speed);
        const wasFF = P.ff;
        P.ff = r.ff;
        let nt = P.t + dt * r.rate;
        if (r.ff) nt = Math.min(nt, r.cap);
        if (nt >= K.end) { nt = K.end; P.playing = false; syncPlay(); }
        P.t = nt;
        dirty = true;
        syncUI();
        if (wasFF !== P.ff) syncUI();
      }
      if (dirty) render();
    });
    SX.on('select', () => { dirty = true; });
    SX.on('units', () => { syncUI(); });

    resize();
    syncUI();
    render();
    return {
      el: screen,
      jump,
      setTime(t) { P.playing = false; syncPlay(); setT(t); render(); },
      setCam(k) { P.cam = k; render(); },
      partShown: (id) => !!PART_EV[id],
      showPart(id) { if (PART_EV[id]) jump(PART_EV[id], false); screen.scrollIntoView({ block: 'nearest', behavior: SX.reducedMotion ? 'auto' : 'smooth' }); },
      redraw() { dirty = true; render(); },
    };
  }

  /* ------------------------------------------------------------------ 2. catch: tower, arms, mount, trench, tank farm */

  function buildCatch(root) {
    const S = SX.svg;
    const VBW = 600, VBH = 640;
    const PXM = 3.3;                         // px per metre for the two published heights
    const Y0 = 560;                          // grade
    const TOWER_H = SX.val('tower.height', 0) * PXM;
    const BOOST_H = SX.val('booster.height', 0) * PXM;
    const BOOST_W = SX.val('booster.diameter', 0) * PXM;
    const TX0 = 402, TX1 = 436;              // tower legs (width schematic)
    const BX = 300;                          // booster / mount centerline
    const DECK = Y0 - 22 * PXM;              // mount deck height: schematic
    const BASE_CAUGHT = DECK - 6 * PXM;      // engine exits clear the deck when caught (schematic)
    const FIN_FRAC = 0.9;                    // catch fins near the top (position estimate)
    const ARM_Y = BASE_CAUGHT - FIN_FRAC * BOOST_H;  // arm top = fin bottom when caught
    const DESC = 260;                        // start of the drawn descent, px above the caught position

    const svg = S('svg', { viewBox: '0 0 ' + VBW + ' ' + VBH, role: 'group', 'aria-label': 'Launch and catch tower with the booster on its landing burn' });
    const defs = S('defs');
    defs.appendChild(S('clipPath', { id: 'fl-clip-trench' }, S('rect', { x: 0, y: Y0, width: VBW, height: VBH - Y0 })));
    svg.appendChild(defs);

    function partG(id, label) {
      const g = S('g', partAttrs(id, label));
      wirePart(g, id);
      return g;
    }
    function hit(g, x, y, w, h) { g.insertBefore(S('rect', { x, y, width: w, height: h, rx: 3, class: 'fl-hit' }), g.firstChild); }
    const txt = (x, y, s, cls, anchor) => S('text', { x, y, class: cls || 'fl-lbl', 'text-anchor': anchor || 'start' }, s);

    /* ground and trench */
    svg.appendChild(S('rect', { x: 0, y: Y0, width: VBW, height: VBH - Y0, style: 'fill:var(--bg-2)' }));
    svg.appendChild(S('line', { x1: 0, y1: Y0, x2: VBW, y2: Y0, class: 'fl-ground' }));

    // tank farm (left, schematic)
    const farm = partG('ground.tankfarm', 'Tank farm and subcoolers');
    const tanks = [[34, 'fl-lox', 'LOX', 18, 92], [66, 'fl-ch4', 'CH4', 16, 80], [96, 'fl-ln2', 'LN2', 14, 70], [124, 'fl-lox', '', 12, 60]];
    tanks.forEach(([x, cls, lbl, r, h]) => {
      farm.appendChild(S('rect', { x: x - r, y: Y0 - h, width: r * 2, height: h, rx: r * 0.9, class: cls }));
      if (lbl) farm.appendChild(txt(x, Y0 - h - 6, lbl, 'fl-lbl-m', 'middle'));
    });
    farm.appendChild(S('rect', { x: 150, y: Y0 - 18, width: 64, height: 14, rx: 7, class: 'fl-ch4' }));
    farm.appendChild(S('rect', { x: 150, y: Y0 - 34, width: 64, height: 14, rx: 7, class: 'fl-lox' }));
    farm.appendChild(S('path', { d: 'M 150 ' + (Y0 + 14) + ' H 262', class: 'fl-tw', style: 'stroke-dasharray:4 3' }));
    farm.appendChild(txt(20, Y0 + 30, 'Tank farm', 'fl-lbl'));
    farm.appendChild(txt(20, Y0 + 43, 'schematic, not to scale', 'fl-lbl-m'));
    hit(farm, 12, Y0 - 112, 206, 160);
    svg.appendChild(farm);

    // flame trench and deluge (below grade)
    const del = partG('ground.deluge', 'Flame trench and deluge');
    const TR0 = BX - 70, TR1 = BX + 70, TRD = Y0 + 58;
    del.appendChild(S('path', { d: `M ${TR0} ${Y0} V ${TRD} H ${TR1} V ${Y0}`, class: 'fl-conc' }));
    del.appendChild(S('path', { d: `M ${TR0 + 6} ${TRD - 4} Q ${BX - 30} ${TRD - 8} ${BX} ${Y0 + 14} Q ${BX + 30} ${TRD - 8} ${TR1 - 6} ${TRD - 4}`, class: 'fl-steel-d' }));
    const sprays = S('g', { class: 'fl-sprays' });
    for (let k = -3; k <= 3; k++) {
      if (!k) continue;
      const x = BX + k * 16;
      sprays.appendChild(S('path', { d: `M ${x} ${TRD - 10 - Math.abs(k) * 3} q ${k * 2} -10 ${k * 4} -16`, class: 'fl-water', style: 'stroke-dasharray:2 3' }));
    }
    for (let k = 0; k < 6; k++) sprays.appendChild(S('path', { d: `M ${BX - 36 + k * 14.4} ${DECK - 2} v -8`, class: 'fl-water', style: 'stroke-dasharray:1.5 2.5' }));
    del.appendChild(sprays);
    del.appendChild(txt(TR1 + 8, Y0 + 30, 'Flame trench', 'fl-lbl'));
    del.appendChild(txt(TR1 + 8, Y0 + 43, 'deluge: bucket, ridge, deck', 'fl-lbl-m'));
    hit(del, TR0 - 4, Y0 + 1, TR1 - TR0 + 150, TRD - Y0 + 4);
    svg.appendChild(del);

    // launch mount
    const olm = partG('ground.olm', 'Orbital launch mount');
    olm.appendChild(S('rect', { x: BX - 40, y: DECK, width: 80, height: Y0 - DECK, class: 'fl-steel-d' }));
    olm.appendChild(S('rect', { x: BX - 44, y: DECK - 3, width: 88, height: 4, class: 'fl-steel' }));
    olm.appendChild(S('rect', { x: BX - 20, y: DECK + 8, width: 40, height: Y0 - DECK - 8, style: 'fill:var(--bg)' }));
    [-36, -26, 26, 36].forEach((dx) => olm.appendChild(S('path', { d: `M ${BX + dx} ${DECK - 3} v -6 h ${dx < 0 ? 3 : -3}`, class: 'fl-tw-bold' })));
    olm.appendChild(txt(BX - 48, DECK + 22, 'Launch mount', 'fl-lbl', 'end'));
    olm.appendChild(txt(BX - 48, DECK + 35, 'hold-down clamps', 'fl-lbl-m', 'end'));
    hit(olm, BX - 46, DECK - 10, 92, Y0 - DECK + 10);
    svg.appendChild(olm);

    // tower
    const tower = partG('ground.tower', 'Launch and catch tower');
    const TOP = Y0 - TOWER_H;
    tower.appendChild(S('rect', { x: TX0, y: TOP, width: TX1 - TX0, height: TOWER_H, style: 'fill:var(--bg-2);stroke:none' }));
    let lat = 'M ' + TX0 + ' ' + Y0 + ' V ' + TOP + ' M ' + TX1 + ' ' + Y0 + ' V ' + TOP;
    const bay = 22;
    for (let y = Y0; y > TOP + 1; y -= bay) {
      const y2 = Math.max(TOP, y - bay);
      lat += ` M ${TX0} ${y} L ${TX1} ${y2} M ${TX1} ${y} L ${TX0} ${y2} M ${TX0} ${y2} H ${TX1}`;
    }
    tower.appendChild(S('path', { d: lat, class: 'fl-tw' }));
    tower.appendChild(S('path', { d: `M ${TX0 - 4} ${TOP} H ${TX1 + 4} V ${TOP - 5} H ${TX0 - 4} Z`, class: 'fl-steel' }));
    tower.appendChild(S('rect', { x: TX0 - 6, y: Y0 - 14, width: TX1 - TX0 + 12, height: 14, class: 'fl-conc' }));
    hit(tower, TX0 - 6, TOP - 6, TX1 - TX0 + 12, TOWER_H + 6);
    svg.appendChild(tower);

    // ship quick-disconnect arm, folded back against the tower for a booster catch; booster QDs in the mount
    const qd = partG('ground.qd', 'Quick disconnects');
    const QY = TOP + 64;
    qd.appendChild(S('path', { d: `M ${TX0} ${QY} l -8 4 v 30 l 8 4`, class: 'fl-tw-bold' }));
    qd.appendChild(S('rect', { x: TX0 - 12, y: QY + 8, width: 6, height: 22, class: 'fl-steel' }));
    qd.appendChild(S('path', { d: `M ${TX1 + 4} ${QY + 19} H ${TX1 + 12}`, class: 'svg-leader' }));
    qd.appendChild(txt(TX1 + 14, QY + 16, 'Ship QD arm', 'fl-lbl'));
    qd.appendChild(txt(TX1 + 14, QY + 29, 'folded back', 'fl-lbl-m'));
    qd.appendChild(S('rect', { x: BX - 50, y: DECK + 44, width: 8, height: 10, class: 'fl-lox' }));
    qd.appendChild(S('rect', { x: BX - 50, y: DECK + 58, width: 8, height: 10, class: 'fl-ch4' }));
    hit(qd, TX0 - 14, QY - 4, TX1 - TX0 + 110, 44);
    qd.appendChild(S('rect', { x: BX - 53, y: DECK + 41, width: 14, height: 30, rx: 2, class: 'fl-hit' }));
    svg.appendChild(qd);

    // dimension line: tower height (to scale), far right
    const dims = S('g', { 'aria-hidden': 'true' });
    const DX = VBW - 30;
    dims.appendChild(S('path', { d: `M ${DX} ${Y0} V ${TOP} M ${DX - 4} ${Y0} h 8 M ${DX - 4} ${TOP} h 8 M ${TX1 + 6} ${TOP} H ${DX - 6}`, class: 'svg-dim' }));
    const tLbl = txt(DX - 8, (Y0 + TOP) / 2, '', 'fl-dimtxt', 'end');
    const tLbl2 = txt(DX - 8, (Y0 + TOP) / 2 + 13, 'Pad 1 tower', 'fl-lbl-m', 'end');
    dims.append(tLbl, tLbl2);
    svg.appendChild(dims);

    // far arm (behind the booster)
    const chop = partG('ground.chopsticks', 'Chopsticks (catch arms)');
    const ARM_X0 = BX - 42;
    chop.appendChild(S('rect', { x: ARM_X0 + 6, y: ARM_Y - 3, width: TX0 - ARM_X0 - 6, height: 6, class: 'fl-steel-d' }));
    svg.appendChild(chop);

    /* booster (moves) */
    const boost = S('g');
    const bBody = partG('booster', 'Super Heavy booster');
    const bw = BOOST_W, bh = BOOST_H;
    const plume = S('g', { 'aria-hidden': 'true' });
    const plOuter = S('path', { class: 'fl-plume' }), plCore = S('path', { class: 'fl-plume-core' });
    plume.append(plOuter, plCore);
    boost.appendChild(plume);
    // engines (bells below the base), body, hot stage band, chines
    for (let k = 0; k < 7; k++) bBody.appendChild(S('path', { d: `M ${BX - 12 + k * 4} 0 l -1.6 7 h 3.2 z`, class: 'fl-steel-d' }));
    bBody.appendChild(S('rect', { x: BX - bw / 2, y: -bh, width: bw, height: bh, class: 'fl-hull' }));
    bBody.appendChild(S('rect', { x: BX - bw / 2, y: -bh, width: bw, height: 5, class: 'fl-steel-d' }));
    bBody.appendChild(S('rect', { x: BX - bw / 2 - 2, y: -bh * 0.42, width: 2, height: bh * 0.4, class: 'fl-steel-d' }));
    bBody.appendChild(S('rect', { x: BX + bw / 2, y: -bh * 0.42, width: 2, height: bh * 0.4, class: 'fl-steel-d' }));
    hit(bBody, BX - bw / 2 - 3, -bh - 2, bw + 6, bh + 10);
    boost.appendChild(bBody);
    // catch fins (grid fins carry the catch points on V3): side view shows the two opposite fins in profile
    const fins = partG('booster.catch', 'Catch points on the grid fins');
    const FY = -FIN_FRAC * bh;
    [-1, 1].forEach((sgn) => {
      const x = sgn < 0 ? BX - bw / 2 - 13 : BX + bw / 2;
      fins.appendChild(S('rect', { x, y: FY - 11, width: 13, height: 11, class: 'fl-steel' }));
      fins.appendChild(S('path', { d: `M ${x} ${FY - 5.5} h 13 M ${x + 4.3} ${FY - 11} v 11 M ${x + 8.6} ${FY - 11} v 11`, class: 'fl-tw', style: 'stroke:var(--bg)' }));
    });
    hit(fins, BX - bw / 2 - 16, FY - 14, bw + 32, 16);
    boost.appendChild(fins);
    svg.appendChild(boost);

    // booster height dimension (moves with the booster)
    const bDim = S('g', { 'aria-hidden': 'true', style: 'transition: opacity 0.3s' });
    const bdx = BX - bw / 2 - 30;
    bDim.appendChild(S('path', { d: `M ${bdx} 0 V ${-bh} M ${bdx - 4} 0 h 8 M ${bdx - 4} ${-bh} h 8`, class: 'svg-dim' }));
    const bLbl = txt(bdx - 6, -bh / 2, '', 'fl-dimtxt', 'end');
    bDim.appendChild(bLbl);
    bDim.appendChild(txt(bdx - 6, -bh / 2 + 13, 'booster', 'fl-lbl-m', 'end'));
    boost.appendChild(bDim);

    // near arm + carriage (in front of the booster)
    const chopFront = partG('ground.chopsticks', 'Chopsticks (catch arms)');
    chopFront.appendChild(S('rect', { x: TX0 - 8, y: ARM_Y - 16, width: TX1 - TX0 + 16, height: 32, rx: 2, class: 'fl-steel' }));
    const nearArm = S('rect', { x: ARM_X0, y: ARM_Y, width: TX0 - ARM_X0, height: 7, class: 'fl-steel' });
    chopFront.appendChild(nearArm);
    chopFront.appendChild(S('path', { d: `M ${ARM_X0 + 4} ${ARM_Y + 3.5} H ${TX0 - 4}`, class: 'fl-tw', style: 'stroke:var(--bg)' }));
    chopFront.appendChild(txt(TX1 + 14, ARM_Y - 20, 'Chopsticks', 'fl-lbl'));
    chopFront.appendChild(txt(TX1 + 14, ARM_Y - 7, 'on a carriage', 'fl-lbl-m'));
    hit(chopFront, ARM_X0 - 2, ARM_Y - 18, TX1 - ARM_X0 + 12, 36);
    svg.appendChild(chopFront);
    const finLbl = S('g', { 'aria-hidden': 'true', style: 'transition: opacity 0.3s' });
    finLbl.appendChild(S('path', { d: `M ${BX - bw / 2 - 46} ${FY + 18} L ${BX - bw / 2 - 12} ${FY - 5}`, class: 'svg-leader' }));
    finLbl.appendChild(S('circle', { cx: BX - bw / 2 - 12, cy: FY - 5, r: 1.8, class: 'fl-accfill' }));
    finLbl.appendChild(txt(BX - bw / 2 - 48, FY + 30, 'Catch points', 'fl-lbl-a', 'end'));
    finLbl.appendChild(txt(BX - bw / 2 - 48, FY + 43, 'on the grid fins', 'fl-lbl-m', 'end'));
    boost.appendChild(finLbl);

    /* plan view inset: arms closing around the three grid fins */
    const IX = 16, IY = 16, IW = 214, IH = 214;
    const inset = S('g', { 'aria-label': 'Plan view of the arms closing' });
    inset.appendChild(S('rect', { x: IX, y: IY, width: IW, height: IH, rx: 4, class: 'fl-inset-bg' }));
    inset.appendChild(txt(IX + 10, IY + 17, 'Plan view', 'fl-lbl'));
    inset.appendChild(txt(IX + 10, IY + 29, 'from above, schematic', 'fl-lbl-m'));
    const PCX = IX + 84, PCY = IY + 112, PR = 24, PIV = IX + 170, ARM_L = 118;
    inset.appendChild(S('rect', { x: PIV, y: PCY - 26, width: 28, height: 52, class: 'fl-steel-d' }));
    inset.appendChild(S('text', { x: PIV + 14, y: PCY, class: 'fl-lbl-m', 'text-anchor': 'middle', transform: `rotate(90 ${PIV + 14} ${PCY})`, dy: '3' }, 'tower'));
    const pinUp = [PIV, PCY - PR - 6], pinDn = [PIV, PCY + PR + 6];
    const armShape = () => { const g = S('g'); g.appendChild(S('rect', { x: 0, y: -3.5, width: ARM_L, height: 7, rx: 2, class: 'fl-steel' })); g.appendChild(S('rect', { x: ARM_L - 44, y: -2, width: 10, height: 4, class: 'fl-steel-d' })); return g; };
    const gUp = armShape(), gDn = armShape();
    const pBooster = S('g');
    pBooster.appendChild(S('circle', { cx: 0, cy: 0, r: PR, class: 'fl-hull' }));
    const finShape = (a, cls) => { const g = S('g', { transform: 'rotate(' + a + ')' }); g.appendChild(S('rect', { x: PR - 2, y: -5, width: 13, height: 10, class: cls })); return g; };
    pBooster.appendChild(finShape(-90, 'fl-steel'));
    pBooster.appendChild(finShape(90, 'fl-steel'));
    pBooster.appendChild(finShape(180, 'fl-steel-d'));
    inset.append(gUp, gDn);
    inset.appendChild(pBooster);
    inset.appendChild(txt(PCX - PR - 16, PCY + 3.5, 'rudder', 'fl-lbl-m', 'end'));
    inset.appendChild(txt(IX + 10, IY + IH - 22, 'Two opposite fins rest on the arms;', 'fl-lbl-m'));
    inset.appendChild(txt(IX + 10, IY + IH - 10, 'the third is a rudder fin.', 'fl-lbl-m'));
    svg.appendChild(inset);
    const planG = partG('ground.chopsticks', 'Chopsticks, plan view');
    planG.appendChild(S('rect', { x: IX, y: IY, width: IW, height: IH, rx: 4, class: 'fl-hit' }));
    svg.appendChild(planG);

    svg.appendChild(txt(VBW - 12, VBH - 10, 'Tower and booster heights to scale; mount, trench, arms and farm schematic', 'fl-lbl-m', 'end'));

    /* controls */
    const STEPS = [
      ['Landing burn', 'The booster falls tail-first and relights: ' + (LAND_SEQ.join(', then ') || '') + ' engines, braking from its fall to a hover beside the tower.'],
      ['Arms close', 'The chopsticks swing in around the booster just below its grid fins.'],
      ['Settle on the catch points', 'The engines shut down and the booster comes to rest on the arms, its weight carried by two opposite grid fins.'],
      ['Held', 'The booster hangs in the tower, ready to be lowered back onto the launch mount.'],
    ];
    const stepEls = STEPS.map(([h, p]) => SX.el('li', null, SX.el('span', null, SX.el('b', null, h), '. ' + p)));
    const out = SX.el('output', { class: 'num' });
    const rng = SX.el('input', { type: 'range', min: '0', max: '1000', value: '0', id: 'fl-catch-k', 'aria-label': 'Catch sequence' });
    const playC = SX.el('button', { type: 'button', class: 'btn btn-sm' }, 'Play');
    const ctl = SX.el('div', { class: 'fl-catchctl' },
      SX.el('div', { class: 'range-row' }, SX.el('label', { for: 'fl-catch-k' }, 'Catch'), rng, out),
      SX.el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' } }, playC,
        SX.el('span', { class: 'fl-note' }, 'Sequence schematic: SpaceX does not publish catch timing.')));
    const scroller = SX.el('div', { class: 'fl-catchscroll' }, svg);
    const viz = SX.el('div', { class: 'viz viz-grid fl-catchviz' }, scroller, ctl);
    requestAnimationFrame(() => { if (scroller.scrollWidth > scroller.clientWidth) scroller.scrollLeft = scroller.scrollWidth; });
    const text = SX.el('div', { class: 'fl-catchtext' },
      SX.el('div', { class: 'prose', html: SX.withFacts(
        '<p>Super Heavy has no landing legs. It flies back to the tower that launched it and the tower catches it. The arms close around the booster as its landing burn brings it to a hover, and it settles onto them by its grid fins. ' +
        U('booster.catchesTotal') + ' boosters have been caught so far, all first generation; no V3 booster has been caught yet, and no ship.</p>' +
        '<p>The Pad 2 arms are shorter than the originals and electrically driven, rated to lift {{tower.chopsticksLift}}. The drawing uses the Pad 1 tower height, {{tower.height}}, because SpaceX has not published the Pad 2 figure.</p>') }),
      SX.el('ol', { class: 'fl-steps' }, stepEls),
      (() => {
        const row = SX.el('div', { class: 'fl-glist chip-row' });
        ['ground.tower', 'ground.chopsticks', 'ground.olm', 'ground.qd', 'ground.deluge', 'ground.tankfarm', 'booster.catch'].forEach((id) => {
          row.appendChild(SX.el('button', { type: 'button', class: 'chip', 'data-part': id, onclick: () => SX.select(id) }, PARTNAME(id)));
        });
        return row;
      })(),
      (() => {
        const tb = SX.el('tbody');
        [['Tower height (Pad 1)', 'tower.height'], ['Arm lift capacity (Pad 2)', 'tower.chopsticksLift'], ['Hold-down clamps', 'ground.holdDownClamps'],
          ['Booster quick disconnects', 'ground.boosterQDs'], ['Deluge water, maximum', 'ground.delugeWater'], ['Booster catches to date', 'booster.catchesTotal'],
          ['Ship catches to date', 'flight.shipCatches']].forEach(([l, k]) => tb.appendChild(SX.el('tr', null, SX.el('th', { scope: 'row' }, l), SX.el('td', { html: SX.factHTML(k) }))));
        return SX.el('table', { class: 'spec-table fl-catchspecs' }, tb);
      })());
    root.appendChild(SX.el('div', { class: 'fl-catch' }, viz, text));

    function setK(k) {
      k = SX.clamp(k, 0, 1);
      rng.value = String(Math.round(k * 1000));
      // descent: 0 to 0.62 (ease out), final settle 0.62 to 0.8
      const dsc = SX.clamp(k / 0.62, 0, 1);
      const settle = SX.smooth(SX.clamp((k - 0.62) / 0.18, 0, 1));
      const hover = 8;
      const baseY = BASE_CAUGHT - hover - DESC * Math.pow(1 - dsc, 2.2) + hover * settle;
      boost.setAttribute('transform', 'translate(0 ' + baseY.toFixed(1) + ')');
      finLbl.setAttribute('opacity', k > 0.45 ? '1' : '0');
      bDim.setAttribute('opacity', k > 0.5 ? '1' : '0');
      // engines: 13, then 5, then 3 while descending; off once settled
      const stage = k < 0.22 ? 0 : k < 0.44 ? 1 : 2;
      const n = k >= 0.7 ? 0 : LAND_SEQ[stage] || 0;
      const L = n ? 14 + 40 * Math.sqrt(n / (LAND_SEQ[0] || 1)) : 0;
      const w = n ? 6 + 18 * Math.sqrt(n / (LAND_SEQ[0] || 1)) : 0;
      plOuter.setAttribute('d', n ? `M ${BX - w / 2} 6 L ${BX} ${6 + L} L ${BX + w / 2} 6 Z` : '');
      plCore.setAttribute('d', n ? `M ${BX - w / 4} 6 L ${BX} ${6 + L * 0.45} L ${BX + w / 4} 6 Z` : '');
      sprays.setAttribute('opacity', k < 0.75 ? '1' : '0.25');
      // arms: open 28 degrees, close between 0.45 and 0.66
      const c = SX.smooth(SX.clamp((k - 0.45) / 0.21, 0, 1));
      const open = 16 * (1 - c);
      gUp.setAttribute('transform', `translate(${pinUp[0]} ${pinUp[1]}) rotate(${180 + open})`);
      gDn.setAttribute('transform', `translate(${pinDn[0]} ${pinDn[1]}) rotate(${180 - open})`);
      // plan-view booster slides in from the open side as it descends (schematic): centered once caught
      pBooster.setAttribute('transform', `translate(${PCX} ${PCY})`);
      pBooster.setAttribute('opacity', (0.35 + 0.65 * SX.clamp(k / 0.5, 0, 1)).toFixed(2));
      const si = k < 0.45 ? 0 : k < 0.66 ? 1 : k < 0.85 ? 2 : 3;
      stepEls.forEach((li, i) => { li.className = i === si ? 'on' : i < si ? 'done' : ''; });
      out.textContent = n ? n + ' engines' : si === 3 ? 'held' : 'engines off';
      rng.setAttribute('aria-valuetext', STEPS[si][0] + (n ? ', ' + n + ' engines lit' : ''));
    }
    function units() {
      tLbl.textContent = SX.fmt('tower.height', { digits: 0 });
      bLbl.textContent = SX.fmt('booster.height', { digits: 0 });
    }
    let anim = null;
    const syncC = () => { playC.textContent = anim ? 'Pause' : 'Play'; playC.setAttribute('aria-pressed', String(!!anim)); };
    rng.addEventListener('input', () => { anim = null; syncC(); setK(+rng.value / 1000); });
    playC.addEventListener('click', () => {
      if (SX.reducedMotion) { setK(1); return; }
      anim = anim ? null : { k: +rng.value / 1000 >= 0.999 ? 0 : +rng.value / 1000 };
      syncC();
    });
    SX.loop(viz, (dt) => {
      if (!anim) return;
      anim.k += dt / 7;
      setK(anim.k);
      if (anim.k >= 1) { anim = null; syncC(); }
    });
    SX.on('units', units);
    units();
    setK(0.3);
    return { el: viz, setK };
  }

  /* ------------------------------------------------------------------ 3. scale: launch vehicles at true relative height */

  // Silhouette profiles: [height fraction, half-width as a fraction of the listed diameter]. Shapes schematic,
  // overall height and diameter from SX.data.comparisons.
  const SIL = {
    'Saturn V': { body: [[0, 1.2], [0.04, 1.2], [0.08, 1], [0.62, 1], [0.66, 0.66], [0.8, 0.66], [0.83, 0.55], [0.86, 0.39], [0.905, 0.39], [0.925, 0.12], [0.93, 0.05], [1, 0.03]] },
    'SLS Block 1': { body: [[0, 1], [0.64, 1], [0.67, 0.6], [0.72, 0.6], [0.745, 0.62], [0.82, 0.55], [0.84, 0.2], [0.86, 0.08], [1, 0.03]], sides: { off: 0.72, w: 0.44, top: 0.55, nose: 0.6 } },
    N1: { body: [[0, 1], [0.06, 0.98], [0.29, 0.62], [0.47, 0.46], [0.6, 0.36], [0.78, 0.26], [0.86, 0.22], [0.92, 0.1], [0.93, 0.04], [1, 0.02]] },
    'Falcon 9': { body: [[0, 1], [0.8, 1], [0.805, 1.41], [0.92, 1.41], [0.96, 1.1], [0.99, 0.5], [1, 0.15]] },
    'Falcon Heavy': { body: [[0, 0.303], [0.8, 0.303], [0.805, 0.43], [0.92, 0.43], [0.96, 0.33], [0.99, 0.15], [1, 0.05]], sides: { off: 0.348, w: 0.303, top: 0.6, nose: 0.68 } },
    'New Glenn': { body: [[0, 1], [0.78, 1], [0.93, 0.85], [0.99, 0.4], [1, 0.1]] },
    'Starship V3': { body: [[0, 1], [0.887, 1], [0.93, 0.9], [0.965, 0.7], [0.99, 0.35], [1, 0.05]], fins: [0.52, 0.55], star: true },
  };
  const SCALE_ORDER = ['Saturn V', 'SLS Block 1', 'N1', 'Falcon 9', 'Falcon Heavy', 'New Glenn', 'Starship V3'];

  function buildScale(root) {
    const S = SX.svg;
    const rows = SCALE_ORDER.map((n) => (D.comparisons || []).find((c) => c.name === n)).filter(Boolean);
    const W = 1000, H = 560, BASE = 470, TOPPAD = 60, AX = 70;
    const maxH = Math.max.apply(null, rows.map((r) => r.height_m));
    const k = (BASE - TOPPAD) / maxH;             // px per metre, same for height and width
    const colW = (W - AX - 10) / rows.length;
    let mode = 'height', sel = rows.find((r) => /Starship/.test(r.name)) || rows[0];

    const svg = S('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': 'Launch vehicles drawn at the same scale' });
    const grid = S('g', { 'aria-hidden': 'true' });
    svg.appendChild(grid);
    svg.appendChild(S('line', { x1: AX - 6, y1: BASE, x2: W - 6, y2: BASE, class: 'fl-ground' }));
    const cols = [];
    rows.forEach((r, i) => {
      const cx = AX + colW * (i + 0.5);
      const sh = SIL[r.name] || { body: [[0, 1], [1, 1]] };
      const hpx = r.height_m * k, dpx = r.diameter_m * k;
      const g = S('g', { class: 'fl-col', tabindex: '0', role: 'button', 'aria-label': r.name });
      g.appendChild(S('rect', { x: cx - colW / 2 + 3, y: TOPPAD - 44, width: colW - 6, height: BASE - TOPPAD + 90, rx: 4, class: 'fl-colbg' }));
      const sil = S('g', { class: 'fl-silg' });
      const prof = (pts, x0, halfScale) => {
        const R = pts.map(([f, w]) => [x0 + w * halfScale, BASE - f * hpx]);
        const L = pts.slice().reverse().map(([f, w]) => [x0 - w * halfScale, BASE - f * hpx]);
        return 'M ' + R.concat(L).map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L ') + ' Z';
      };
      const cls = 'fl-sil' + (sh.star ? ' star' : '');
      if (sh.sides) {
        const s = sh.sides;
        [-1, 1].forEach((sg) => {
          const x0 = cx + sg * s.off * dpx;
          const pts = [[0, s.w / 2 / 1], [s.top, s.w / 2], [s.nose, 0.02]];
          sil.appendChild(S('path', { d: prof(pts.map(([f, w]) => [f, w * 2]), x0, dpx / 2), class: cls }));
        });
      }
      sil.appendChild(S('path', { d: prof(sh.body, cx, dpx / 2), class: cls }));
      if (sh.fins) {
        const y1 = BASE - sh.fins[1] * hpx, y0 = BASE - sh.fins[0] * hpx;
        sil.appendChild(S('rect', { x: cx - dpx / 2 - dpx * 0.2, y: y1, width: dpx * 1.4, height: y0 - y1, class: cls, style: 'opacity:0.7' }));
        sil.appendChild(S('rect', { x: cx - dpx / 2, y: y1 - 1, width: dpx, height: y0 - y1 + 2, class: cls }));
      }
      g.appendChild(sil);
      const bar = S('rect', { x: cx - 15, y: BASE, width: 30, height: 0, class: 'fl-bar' + (sh.star ? ' star' : '') });
      g.appendChild(bar);
      const valT = S('text', { x: cx, y: BASE - hpx - 10, class: 'fl-sc-val', 'text-anchor': 'middle' });
      const subT = S('text', { x: cx, y: BASE - hpx - 26, class: 'fl-sc-sub', 'text-anchor': 'middle' });
      g.append(valT, subT);
      const nameT = S('text', { x: cx, y: BASE + 22, class: 'fl-sc-name' + (sh.star ? ' star' : ''), 'text-anchor': 'middle' }, r.name);
      g.appendChild(nameT);
      g.appendChild(S('text', { x: cx, y: BASE + 40, class: 'fl-sc-sub', 'text-anchor': 'middle' }, SX.fmtValue(r.diameter_m, 'm') + ' wide'));
      const pick = () => { sel = r; update(); };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      g.addEventListener('pointermove', (e) => SX.tip.show('<b>' + SX.esc(r.name) + '</b>' + SX.esc(r.note || ''), e.clientX, e.clientY));
      g.addEventListener('pointerleave', () => SX.tip.hide());
      svg.appendChild(g);
      cols.push({ r, g, sil, bar, valT, subT, hpx, cx, dimT: g.lastChild });
    });

    const seg = SX.el('div', { class: 'seg', role: 'group', 'aria-label': 'Compare' });
    [['height', 'Height'], ['thrust', 'Liftoff thrust'], ['payload', 'Payload to LEO']].forEach(([m, lbl]) => {
      seg.appendChild(SX.el('button', { type: 'button', 'data-mode': m, 'aria-pressed': String(m === mode), onclick: () => { mode = m; update(); } }, lbl));
    });
    const cap = SX.el('p', { class: 'fl-note' });
    const detail = SX.el('div', { class: 'panel fl-detail', 'aria-live': 'polite' });
    root.appendChild(SX.el('div', { class: 'fl-scalebar' }, seg, cap));
    const box = SX.el('div', { class: 'viz viz-grid fl-scalebox' }, svg);
    root.appendChild(box);
    requestAnimationFrame(() => { if (box.scrollWidth > box.clientWidth) box.scrollLeft = box.scrollWidth; });
    root.appendChild(detail);

    const payloadNote = (r) => (/disputed|minimum/i.test(r.note || '') ? 'disputed' : /expendable/i.test(r.note || '') ? 'expendable' : /reusable/i.test(r.note || '') ? 'reusable' : '');
    const fmtThrust = (r) => SX.fmtValue(r.thrust_MN, 'MN', { digits: 1 });
    const fmtPayload = (r) => (r.payload_leo_t == null ? 'not published' : fmt3(r.payload_leo_t, 't', { plus: /100\+/.test(r.note || '') }));
    const fmtH = (r) => SX.fmtValue(r.height_m, 'm', SX.units() === 'imperial' ? { digits: 0 } : null);

    function drawGrid() {
      grid.innerHTML = '';
      const imp = SX.units() === 'imperial';
      const stepM = imp ? 50 / 3.28084 : 20;
      for (let i = 1; i * stepM <= maxH + 0.1; i++) {
        const y = BASE - i * stepM * k;
        grid.appendChild(S('line', { x1: AX - 6, y1: y, x2: W - 6, y2: y, class: 'fl-grid' }));
        grid.appendChild(S('text', { x: AX - 10, y: y + 4, class: 'fl-sc-sub', 'text-anchor': 'end' }, imp ? i * 50 + ' ft' : i * 20 + ' m'));
      }
    }
    function update() {
      seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
      const key = mode === 'thrust' ? 'thrust_MN' : mode === 'payload' ? 'payload_leo_t' : null;
      const maxV = key ? Math.max.apply(null, rows.map((r) => r[key] || 0)) : 1;
      grid.style.opacity = key ? '0' : '1';
      cols.forEach((c) => {
        const r = c.r;
        c.g.classList.toggle('is-on', r === sel);
        c.g.setAttribute('aria-pressed', String(r === sel));
        c.sil.style.opacity = key ? '0.16' : '1';
        const v = key ? r[key] : null;
        const bh = key && v != null ? (v / maxV) * (BASE - TOPPAD) : 0;
        c.bar.setAttribute('y', (BASE - bh).toFixed(1));
        c.bar.setAttribute('height', bh.toFixed(1));
        const top = key ? BASE - bh : BASE - c.hpx;
        c.valT.setAttribute('y', (top - 10).toFixed(1));
        c.subT.setAttribute('y', (top - 24).toFixed(1));
        c.valT.textContent = key === 'thrust_MN' ? fmtThrust(r) : key === 'payload_leo_t' ? fmtPayload(r) : fmtH(r);
        c.subT.textContent = key === 'payload_leo_t' ? payloadNote(r) : '';
        c.g.setAttribute('aria-label', r.name + ': height ' + fmtH(r) + ', liftoff thrust ' + fmtThrust(r) + ', payload to low Earth orbit ' + fmtPayload(r));
      });
      const star = rows.find((r) => /Starship/.test(r.name)), sat = rows.find((r) => r.name === 'Saturn V');
      if (mode === 'thrust' && star && sat) cap.textContent = 'Liftoff thrust. Starship V3 pushes about ' + (star.thrust_MN / sat.thrust_MN).toFixed(1) + ' times as hard as a Saturn V; only the booster fires at liftoff.';
      else if (mode === 'payload') cap.textContent = 'Payload to low Earth orbit. Not like for like: Falcon figures are expendable, Starship is fully reusable, and Saturn V and SLS values are disputed.';
      else cap.textContent = 'Heights and diameters to one scale from published figures; shapes simplified.';
      const srcs = (sel.src || []).map((id) => SX.sourceTitle(id)).join('; ');
      detail.innerHTML = '';
      detail.append(
        SX.el('h4', { class: 'h4' }, sel.name),
        SX.el('dl', null,
          SX.el('div', null, SX.el('dt', null, 'Height'), SX.el('dd', null, fmtH(sel))),
          SX.el('div', null, SX.el('dt', null, 'Diameter'), SX.el('dd', null, SX.fmtValue(sel.diameter_m, 'm'))),
          SX.el('div', null, SX.el('dt', null, 'Liftoff thrust'), SX.el('dd', null, fmtThrust(sel))),
          SX.el('div', null, SX.el('dt', null, 'Payload to LEO'), SX.el('dd', null, fmtPayload(sel) + (payloadNote(sel) ? ' (' + payloadNote(sel) + ')' : '')))),
        SX.el('p', { class: 'small muted' }, (sel.note || '') + (srcs ? ' Source: ' + srcs + '.' : '')),
        /Starship/.test(sel.name) ? SX.el('div', null, SX.el('button', { type: 'button', class: 'btn btn-sm', onclick: () => SX.select('stack') }, 'Open the Starship stack')) : null);
      cols.forEach((c) => { c.dimT.textContent = SX.fmtValue(c.r.diameter_m, 'm') + ' wide'; });
    }
    SX.on('units', () => { drawGrid(); update(); });
    drawGrid();
    update();
  }

  /* ------------------------------------------------------------------ 4. flight log */

  const OUT_MAJOR = [/never separated/i, /destroyed/i, /broke up/i, /\blost (?:at|on|about|near|during)\b/i, /before loss/i, /hit the Gulf hard/i];
  const OUT_MINOR = [/lost one (?:engine|RVac|Raptor)/i, /aborted/i, /ended early/i, /skipped/i, /stuck/i, /too few engines/i, /deorbited early/i, /partial boostback/i];
  const OUT_GOOD = [/all major objectives met/i, /splash(?:ed)? ?down/i, /\bcatch\b/i, /deployed/i, /completed its ascent/i, /reached (?:orbit|its trajectory)/i];
  function classify(f) {
    const o = f.outcome || '';
    const hits = (list) => list.map((re) => { const m = re.exec(o); return m ? m[0] : null; }).filter(Boolean);
    const major = hits(OUT_MAJOR), minor = hits(OUT_MINOR), good = hits(OUT_GOOD);
    let cls;
    if (major.length && !good.length) cls = 'failure';
    else if (major.length || minor.length) cls = 'partial';
    else if (good.length) cls = 'success';
    else cls = 'partial';
    const why = cls === 'success' ? good : major.concat(minor);
    return { cls, why };
  }
  const verKey = (f) => (/^V3/.test(f.version) ? 'V3' : /V2/.test(f.version) ? 'V2' : 'V1');

  function buildLog(root, onReplay) {
    let filter = 'all';
    const seg = SX.el('div', { class: 'seg', role: 'group', 'aria-label': 'Filter by version' });
    const counts = { all: FLIGHTS.length, V1: 0, V2: 0, V3: 0 };
    FLIGHTS.forEach((f) => { counts[verKey(f)]++; });
    [['all', 'All'], ['V1', 'V1'], ['V2', 'V2 ship'], ['V3', 'V3']].forEach(([k, lbl]) => {
      seg.appendChild(SX.el('button', { type: 'button', 'data-f': k, 'aria-pressed': String(k === filter), onclick: () => { filter = k; render(); } }, lbl + ' (' + counts[k] + ')'));
    });
    const tally = { success: 0, partial: 0, failure: 0 };
    FLIGHTS.forEach((f) => { tally[classify(f).cls]++; });
    const summary = SX.el('p', { class: 'fl-note', html: SX.withFacts(U('flight.integratedFlights') + ' integrated flights: ' + tally.success + ' success, ' + tally.partial + ' partial, ' + tally.failure + ' failure.') });
    const tbody = SX.el('tbody');
    const table = SX.el('table', { class: 'fl-log' },
      SX.el('thead', null, SX.el('tr', null, ['Flight', 'Date', 'Booster / ship', 'Version', 'Pad', 'Result', 'What happened'].map((h) => SX.el('th', { scope: 'col' }, h)))),
      tbody);
    root.appendChild(SX.el('div', { class: 'fl-logbar' }, seg, summary));
    root.appendChild(SX.el('div', { class: 'fl-logbox' }, table));
    root.appendChild(SX.el('p', { class: 'fl-note', style: { marginTop: '10px' } },
      'Result chips are derived conservatively from each summary: any lost stage, engine-out, skipped or aborted objective makes a flight partial; losing a stage with nothing achieved makes it a failure.' + (SX.coarse ? '' : ' Hover a chip for the words it was judged on.')));

    function render() {
      seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === filter)));
      tbody.innerHTML = '';
      FLIGHTS.filter((f) => filter === 'all' || verKey(f) === filter).forEach((f) => {
        const c = classify(f);
        const why = c.why.length ? 'Judged on: ' + c.why.map((w) => '"' + w + '"').join(', ') : '';
        const res = SX.el('td', { class: 'r' }, SX.el('span', { class: 'fl-oc ' + c.cls, title: why, tabindex: '0', 'aria-label': c.cls + '. ' + why }, c.cls),
          isCatch(f) ? SX.el('div', null, SX.el('span', { class: 'fl-tag' }, 'Booster caught')) : null);
        const what = SX.el('td', { class: 'o' }, f.outcome,
          f.n === Math.max.apply(null, FLIGHTS.map((x) => x.n)) && onReplay ? SX.el('div', { class: 'fl-replay' }, SX.el('button', { type: 'button', class: 'btn btn-sm', onclick: onReplay }, 'Replay the Flight 14 plan')) : null);
        tbody.appendChild(SX.el('tr', { class: verKey(f) === 'V3' ? 'v3' : '' },
          SX.el('td', { class: 'n' }, String(f.n)),
          SX.el('td', { class: 'd' }, f.date),
          SX.el('td', { class: 'd bs' }, f.booster + ' / ' + f.ship),
          SX.el('td', { class: 'v' }, f.version.replace('first-generation', '1st-gen')),
          SX.el('td', { class: 'd p' }, f.pad),
          res, what));
      });
    }
    render();
  }

  /* ------------------------------------------------------------------ view registration */

  const FLIGHT_PARTS = ['flight', 'flight.liftoff', 'flight.maxq', 'flight.meco', 'flight.hotstage', 'flight.boostback', 'flight.boosterLanding',
    'flight.seco', 'flight.coast', 'flight.entry', 'flight.flip', 'flight.landing'];
  const GROUND_PARTS = ['ground', 'ground.tower', 'ground.chopsticks', 'ground.olm', 'ground.qd', 'ground.deluge', 'ground.tankfarm'];
  let V = null;  // built view handles

  function section(num, title, sub) {
    return SX.el('div', { class: 'fl-head' }, SX.el('span', { class: 'eyebrow' }, num), SX.el('h3', { class: 'h3' }, title), sub ? SX.el('span', { class: 'muted small' }, sub) : null);
  }

  SX.register('flight', {
    title: 'flight profile',
    parts: FLIGHT_PARTS.concat(GROUND_PARTS, ['booster.catch']),
    init(mount) {
      if (!TL.length) throw new Error('The flight timeline is missing from the data file.');
      const s1 = SX.el('section', { class: 'fl-sec', 'aria-label': 'Mission player' });
      s1.appendChild(section('5.1', 'Mission player', 'The Flight 14 plan, first orbital flight'));
      s1.appendChild(SX.el('div', { class: 'prose fl-intro', html: SX.withFacts(
        '<p>Press play or drag the timeline. The stack lifts off as one vehicle; at hot staging it becomes two, each with its own telemetry and engine map under the view. The engine maps light up phase by phase from the published plan. Speed and altitude appear only where SpaceX or tracking data give them: the orbit at about {{flight.orbitalSpeedLEO}}, and zero on the pad and on the water.</p>') }));
      const player = buildPlayer(s1);

      const s2 = SX.el('section', { class: 'fl-sec', 'aria-label': 'Catch' });
      s2.appendChild(section('5.2', 'The catch', 'Tower, arms, mount and pad'));
      const cat = buildCatch(s2);

      const s3 = SX.el('section', { class: 'fl-sec', 'aria-label': 'Scale' });
      s3.appendChild(section('5.3', 'Scale', 'Moon rockets and heavy lifters at one scale'));
      buildScale(s3);

      const s4 = SX.el('section', { class: 'fl-sec', 'aria-label': 'Flight log' });
      s4.appendChild(section('5.4', 'Flight log', 'Every integrated flight test'));
      buildLog(s4, () => { player.jump('liftoff', false); player.el.scrollIntoView({ block: 'center', behavior: SX.reducedMotion ? 'auto' : 'smooth' }); });

      mount.append(s1, s2, s3, s4);
      V = { mount, player, cat, s1, s2 };
      this.api = V;  // handle for headless checks: SX._views.get('flight').api

      function mark(id) {
        mount.querySelectorAll('[data-part]').forEach((n) => {
          const on = !!id && n.getAttribute('data-part') === id;
          n.classList.toggle('is-selected', on);
          if (n.classList.contains('chip')) n.setAttribute('aria-pressed', String(on));
        });
      }
      SX.on('select', (id, opts) => {
        mark(id);
        if (id && PART_EV[id] && (!opts || (opts.from !== 'flight' && opts.from !== 'show'))) player.jump(PART_EV[id], false);
        player.redraw();
      });
      if (SX.selected) mark(SX.selected);
    },
    focus(id) {
      if (!V) return;
      const pulse = (el) => {
        if (!el || SX.reducedMotion || !el.animate) return;
        el.animate([{ outline: '2px solid transparent' }, { outline: '2px solid ' + SX.color('--accent') }, { outline: '2px solid transparent' }], { duration: 1200 });
      };
      if (id === 'flight' || PART_EV[id]) {
        if (PART_EV[id]) V.player.jump(PART_EV[id], false);
        V.player.el.scrollIntoView({ block: 'center', behavior: SX.reducedMotion ? 'auto' : 'smooth' });
        pulse(V.player.el);
        return;
      }
      if (id === 'ground' || /^ground\./.test(id) || id === 'booster.catch') {
        if (id === 'ground.chopsticks' || id === 'booster.catch') V.cat.setK(0.9);
        V.cat.el.scrollIntoView({ block: 'center', behavior: SX.reducedMotion ? 'auto' : 'smooth' });
        const n = V.cat.el.querySelector('[data-part="' + id + '"]');
        pulse(n && n.tagName.toLowerCase() !== 'g' ? n : V.cat.el);
      }
    },
  });
})();
