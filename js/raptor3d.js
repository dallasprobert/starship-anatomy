/* Starship Anatomy: raptor3d view.
   A procedural, sectionable, explodable Three.js model of Raptor 3 and Raptor Vacuum 3.
   Engine axis is +y, y = 0 at the sea-level nozzle exit plane, metres. Overall height and diameter come from facts.
   Internal layout (oxygen turbopump on the centerline, fuel turbopump on the side, preburners below their turbines)
   follows public analysis of SpaceX photos and community cycle models; the copy says so wherever it matters. */
(function () {
  'use strict';
  const SX = window.SX;
  if (!SX) return;

  const VIEW = 'raptor3d';

  /* ------------------------------------------------------------------ geometry constants (metres, SL engine) */

  const H = SX.val('raptor.r3.height', 2.9);            // overall height, official
  const DIA = SX.val('raptor.r3.diameter', 1.3);        // overall diameter, official
  const RE = SX.val('raptor.r3.exitDiameter', 1.3) / 2; // nozzle exit radius (outer)
  const HV = SX.val('raptor.rvac3.height', 4.4);
  const REV = SX.val('raptor.rvac3.exitDiameter', 2.3) / 2;
  const RT = SX.val('raptor.r3.throatDiameterEst', 0.23) / 2; // throat radius (estimate, added below)

  // Model design values (schematic, drawn to 2.9 m x 1.3 m; the root group is scaled to the facts).
  const G = {
    yExit: 0, yJoint: 1.25, yThroat: 1.45, yInj: 1.90, yDeck0: 1.975, yDeck1: 2.03,
    rc: 0.19, tHot: 0.007, gapN: 0.012, tJn: 0.007, gapC: 0.02, tJc: 0.02,
    yMan: 1.12, yOut: 1.86, rDeck: 0.46,
    xF: 0.42, // fuel turbopump axis offset (+x)
  };
  // The model is drawn at 2.9 m x 1.3 m and the root group is scaled so the result matches the facts exactly.
  const SY = H / 2.9, SR = DIA / 1.3;
  G.yVacExit = 2.9 - HV / SY; // RVac exit plane in model units (tops aligned)
  G.reV = REV / SR;           // RVac exit radius in model units
  G.re = RE / SR;
  const TWALL_N = G.tHot + G.gapN + G.tJn;
  // Expansion ratios the model's contours imply (reported as estimates with the math).
  const MODEL_EPS = Math.pow((RE - TWALL_N) / RT, 2);
  const MODEL_EPS_VAC = Math.pow((REV - 0.02) / RT, 2);

  /* ------------------------------------------------------------------ facts this view needs that the canonical file lacks */

  SX.addFacts({
    'raptor.r3.inletPressure': { v: 4, unit: 'bar', conf: 'estimate', src: ['S47'], note: 'Community Raptor 2 cycle model: about 4 bar at both engine inlets. Not published by SpaceX.' },
    'raptor.r3.loxFlow': { v: 590, unit: 'kg/s', conf: 'estimate', src: ['S1', 'S3'], note: 'Derived: about 750 kg/s total (263 tf vacuum / (350 s x g0)) split at O/F 3.6 gives about 590 kg/s of oxygen.' },
    'raptor.r3.ch4Flow': { v: 165, unit: 'kg/s', conf: 'estimate', src: ['S1', 'S3'], note: 'Derived: about 750 kg/s total split at O/F 3.6 gives about 165 kg/s of methane.' },
    'raptor.r3.oxTurbineExit': { v: 707, unit: 'K', conf: 'estimate', src: ['S47'], note: 'Community Raptor 2 model: oxygen-rich gas leaves the oxygen turbine at about 430 bar and 707 K.' },
    'raptor.r3.oxTurbineExitP': { v: 430, unit: 'bar', conf: 'estimate', src: ['S47'], note: 'Community Raptor 2 model: oxygen-rich gas leaving the turbine.' },
    'raptor.r3.fuelTurbineExit': { v: 808, unit: 'K', conf: 'estimate', src: ['S47'], note: 'Community Raptor 2 model: fuel-rich gas leaves the fuel turbine at about 342 bar and 808 K.' },
    'raptor.r3.fuelTurbineExitP': { v: 342, unit: 'bar', conf: 'estimate', src: ['S47'], note: 'Community Raptor 2 model: fuel-rich gas leaving the turbine.' },
    'raptor.r3.regenOutletP': { v: 696, unit: 'bar', conf: 'estimate', src: ['S47'], note: 'Community Raptor 2 model: warm, supercritical methane leaving the cooling jacket.' },
    'raptor.r3.otpDesignPressure': { v: 800, unit: 'atm', conf: 'official', src: ['S48'], note: 'Musk (2018): "~800 atmosphere, hot, oxygen-rich turbopump". A design description, not a measured station pressure.' },
    'raptor.r3.throatDiameterEst': { v: 0.23, unit: 'm', conf: 'estimate', src: ['S1', 'S12', 'S18'], note: 'Not published. Derived: throat area = vacuum thrust / (chamber pressure x about 1.84); with the derived 263 tf vacuum thrust that gives about 0.23 m (0.226 m at 350 bar, 0.233 m at 330 bar). The 2019 engine: 0.222 m (official).' },
    'raptor.r1.nozzleLength': { v: 1.53, unit: 'm', conf: 'official', src: ['S18'], note: 'Throat-to-exit length 60.06 in, 2019 booster Raptor.' },
    'raptor.r1.nozzleAngles': { v: '32° at the throat end, 6° at the lip', unit: '', conf: 'official', src: ['S18'], note: 'Nozzle wall angles at tangency and at the exit lip, 2019 booster Raptor.' },
    'raptor.r3.integration': { v: 'Secondary flow paths internalized; exposed parts regeneratively cooled', unit: '', conf: 'official', src: ['S3801', 'S2'], note: 'Musk (2024-08-03). SpaceX (2026): sensors and controllers are internally integrated and covered by engine thermal protection.' },
    'raptor.r3.controllers': { v: 'Inside the engine, under its thermal protection', unit: '', conf: 'official', src: ['S2'], note: '"Sensors and controllers are now internally integrated and covered by engine thermal protection."' },
    'raptor.tvc.electric': { v: 'Electric actuators (replaced hydraulics)', unit: '', conf: 'official', src: ['S3808'], note: 'On Super Heavy from Flight 2 and on the ship afterward. The actuators are vehicle-side hardware.' },
    'raptor.ffsc.noSeal': { v: 'None needed: each shaft sees one propellant', unit: '', conf: 'official', src: ['S3802', 'S31'], note: 'AFRL and NASA (2006) on the full-flow Integrated Powerhead Demonstrator; Everyday Astronaut (2019) on Raptor.' },
    'raptor.r3.layout': { v: 'Oxygen pump on the centerline, fuel pump on the side', unit: '', conf: 'estimate', src: ['S3803', 'S47'], note: 'Inferred from SpaceX photos and community cycle models. SpaceX has not published the layout.' },
    'raptor.r3.regenManifold': { v: 'Fuel pump discharge pipe loops over the top to a ring manifold on the upper nozzle', unit: '', conf: 'estimate', src: ['S3803'], note: 'Photo interpretation of Raptor 3 SN1. Flow direction and any split inside the channels are not public.' },
    'raptor.r3.injectorElements': { v: 'Not published (Raptor 2 reported as coaxial swirl)', unit: '', conf: 'reported', src: ['S30'], note: 'Musk discussed swirl injectors in a 2022 tour; element type, count and layout are not public for any Raptor.' },
    'raptor.r3.autogenous': { v: 'Autogenous: engine-heated oxygen and methane gas', unit: '', conf: 'official', src: ['S3807', 'S3809'], note: 'Part of the design since 2016. SpaceX traced the Flight 9 ship loss to a failed diffuser in the main fuel tank pressurization system. Raptor 3 tap-off locations are not public.' },
    'raptor.r3.igniterHistory': { v: 'Raptor 2 relight failures traced to the igniters', unit: '', conf: 'official', src: ['S3805', 'S3804'], note: 'Flight 7: "a low-power condition in the igniter system". Flight 8: torch ignition issues caused by thermal conditions local to the igniter, addressed with insulation.' },
    'raptor.r3.otpInletLoss': { v: 'Filter blockage starved oxygen pumps (Flights 2 and 3)', unit: '', conf: 'official', src: ['S3810', 'S3806'], note: 'Loss of oxygen inlet pressure to the turbopumps, caused by filter blockage in the vehicle feed, shut engines down (Raptor 2).' },
    'raptor3d.modelExpansion': { v: Math.round(MODEL_EPS), unit: ':1', conf: 'estimate', src: ['S1', 'S18'], note: 'This model only: (inner exit radius / throat radius) squared, from the official 1.3 m exit and the estimated 0.23 m throat. SpaceX has not published Raptor 3 expansion ratio.' },
    'raptor3d.modelExpansionVac': { v: Math.round(MODEL_EPS_VAC / 5) * 5, unit: ':1', conf: 'estimate', src: ['S1'], note: 'This model only: the official 2.3 m RVac exit over the estimated sea-level throat, assuming RVac 3 shares it. Not published.' },
  }, {
    S3801: { title: 'The amount of work required to simplify the Raptor engine, internalize secondary flow paths and add regenerative cooling for exposed components was staggering', publisher: 'Elon Musk on X', date: '2024-08-03', url: 'https://x.com/elonmusk/status/1819597689283121225' },
    S3802: { title: 'Integrated Powerhead Demonstrator reaches mainstage (AFRL and NASA release)', publisher: 'Spaceflight Now', date: '2006-07-20', url: 'https://spaceflightnow.com/news/n0607/20ipd/' },
    S3803: { title: 'Raptor 3 SN1 at McGregor (official photo)', publisher: 'SpaceX', date: '2024-08-02', url: 'https://sxcontent9668.azureedge.us/cms-assets/assets/Raptor_V3_Mc_G_20240802_1w3a8289_daa3a51ef3.jpg' },
    S3804: { title: 'Fly. Learn. Repeat. (Flight 8 report)', publisher: 'SpaceX', date: '2025-05-22', url: 'https://www.spacex.com/updates#flight-8-report' },
    S3805: { title: 'New Year. New Ship. New Lessons. (Flight 7 report)', publisher: 'SpaceX', date: '2025-02-24', url: 'https://www.spacex.com/updates#flight-7-report' },
    S3806: { title: 'On the Path to Rapid Reusability (Flight 3 report)', publisher: 'SpaceX', date: '2024-05-24', url: 'https://www.spacex.com/updates#flight-3-report' },
    S3807: { title: 'ITS Propulsion: The evolution of the SpaceX Raptor engine', publisher: 'NASASpaceflight', date: '2016-10-03', url: 'https://www.nasaspaceflight.com/2016/10/its-propulsion-evolution-raptor-engine/' },
    S3808: { title: "Upgrades Ahead of Starship's Second Flight Test (electric thrust vector control)", publisher: 'SpaceX', date: '2023-09-08', url: 'https://www.spacex.com/updates#starship-upgrades' },
    S3809: { title: 'Flight 9 and Ship 36 Report', publisher: 'SpaceX', date: '2025-08-15', url: 'https://www.spacex.com/updates#flight-9-report' },
    S3810: { title: "Building on the Success of Starship's Second Flight Test (Flight 2 report)", publisher: 'SpaceX', date: '2024-02-26', url: 'https://www.spacex.com/updates#flight-2-report' },
  });

  /* ------------------------------------------------------------------ part content */

  const NP = { value: 'Not published' };
  const asOf = (SX.data && SX.data.asOf) || '';

  const PARTS = [
    {
      id: 'raptor3', parent: 'stack', name: 'Raptor 3', kind: 'Rocket engine', order: 3, view: VIEW,
      summary: 'SpaceX\'s third-generation Raptor: a full-flow staged combustion methane and oxygen engine rated at {{raptor.r3.thrustSL}} at sea level on Starship V3, with its plumbing, sensors and controllers built into the engine itself.',
      body: [
        'Raptor 3 powers both stages of Starship V3: {{booster.engineCount}} on Super Heavy, plus ' + SX.factHTML('ship.enginesSL', { unitless: true }) + ' sea-level engines and ' + SX.factHTML('ship.enginesVac', { unitless: true }) + ' Raptor Vacuum 3 engines on the ship. Every one burns subcooled liquid methane and liquid oxygen in the full-flow staged combustion cycle, in which essentially all of both propellants passes through a turbine before it reaches the main chamber. Raptor was the first engine of that type to fly.',
        'SpaceX rates the flight engine at {{raptor.r3.thrustSL}} (Raptor 2: {{raptor.r2.thrustSL}}), and the engine alone weighs {{raptor.r3.mass}} (Raptor 2: {{raptor.r2.mass}}). The larger saving is around the engine: with vehicle-side commodities and hardware Raptor 3 comes to {{raptor.r3.massWithCommodities}}, against {{raptor.r2.massWithCommodities}} for Raptor 2, which SpaceX rounds to about {{raptor.r3.massSavingPerEngine}} per engine. The {{raptor.r3.thrustSLDemonstrated}} SpaceX published in August 2024 is the ground-test figure and the stated goal, not the V3 flight rating. A development engine reached {{raptor.r3.chamberPressure}} of chamber pressure in a 2023 test; the chamber pressure at the flight rating has not been published.',
        'The integration is the headline. Musk said SpaceX had to internalize secondary flow paths and add regenerative cooling for exposed components. Purge, pressurant, igniter and instrument lines now run through passages inside the housings, where propellant keeps them cool, so Raptor 3 needs no heat shield. Both stages dropped their individual engine shrouds, and the booster dropped its CO2 fire suppression system. SpaceX tied this to reliability after the Flight 7 and Flight 8 ship losses: fewer external joints leave fewer places for propellant to leak into the engine bay.',
        'Status as of ' + asOf + ': Raptor 3 first flew on {{raptor.r3.firstFlight}} (Flight 12) and has flown on all three V3 flights, about {{raptor.program.r3EnginesFlown}} in total. It made its first in-space relight on {{raptor.r3.firstInSpaceRelight}}, the V3 booster has flown a boostback on all {{booster.enginesRelight}}, and on {{flight.firstOrbit}} a single sea-level Raptor 3 made the burn that put Starship into orbit for the first time. Reliability is still maturing: every V3 flight has had at least one engine shut down or fail to start, including a Raptor Vacuum on Flights 12 and 14.',
      ],
      specs: [
        { label: 'Thrust, sea level (flight rating)', fact: 'raptor.r3.thrustSL' },
        { label: 'Thrust, 2024 ground-test spec', fact: 'raptor.r3.thrustSLDemonstrated' },
        { label: 'Thrust in vacuum (sea-level engine)', fact: 'raptor.r3.thrustVacOfSLEngine' },
        { label: 'Specific impulse, sea level', fact: 'raptor.r3.ispSL' },
        { label: 'Specific impulse, vacuum', fact: 'raptor.r3.ispVac' },
        { label: 'Chamber pressure (2023 test)', fact: 'raptor.r3.chamberPressure' },
        { label: 'Engine mass', fact: 'raptor.r3.mass' },
        { label: 'With vehicle-side hardware', fact: 'raptor.r3.massWithCommodities' },
        { label: 'Thrust-to-weight', fact: 'raptor.r3.twr' },
        { label: 'Mixture ratio', fact: 'raptor.r3.ofRatio' },
        { label: 'Propellant flow', fact: 'raptor.r3.massFlow' },
        { label: 'Height', fact: 'raptor.r3.height' },
        { label: 'Diameter', fact: 'raptor.r3.diameter' },
        { label: 'Cumulative run time', fact: 'raptor.r3.runTime' },
        { label: 'First flight', fact: 'raptor.r3.firstFlight' },
      ],
      related: ['raptor3.cycle', 'raptor3.evolution', 'raptor3.rvac', 'raptor3.startup', 'raptor3.physics'],
    },
    {
      id: 'raptor3.gimbal', parent: 'raptor3', name: 'Gimbal and thrust mount', short: 'Gimbal', kind: 'Control and structure', order: 1, view: VIEW,
      summary: 'The pivot at the top of the engine that carries all of its thrust into the vehicle and lets electric actuators swing it to steer.',
      body: [
        'Every tonne of thrust passes through this joint into the vehicle\'s thrust structure, which makes it one of the most heavily loaded parts on the engine. Swinging the engine a few degrees points its thrust away from the vehicle\'s center of mass and turns the rocket. The Raptor 2 range was reported as about {{raptor.r2.gimbalRange}}; SpaceX has published neither the Raptor 3 range nor the bearing design.',
        'Only some engines gimbal. On V3 the booster\'s inner {{booster.enginesGimbal}} carry thrust vector control and the outer ring is fixed; on the ship the ' + SX.factHTML('ship.enginesGimbal', { unitless: true }) + ' sea-level engines steer and the Raptor Vacuums are fixed. SpaceX replaced hydraulic steering with electric actuators starting in 2023, which Musk said keeps one hydraulic leak from taking out several engines at once.',
        'The actuators count as vehicle-side hardware: they are part of the difference between the {{raptor.r3.mass}} engine and the {{raptor.r3.massWithCommodities}} figure that includes vehicle-side commodities and hardware, and they are absent from SpaceX\'s photos of the bare engine. The gimbal ring, trunnions and actuator lugs in this model are schematic.',
      ],
      specs: [
        { label: 'Gimbal range, Raptor 3', fact: 'raptor.r3.gimbalRange' },
        { label: 'Gimbal range, Raptor 2', fact: 'raptor.r2.gimbalRange' },
        { label: 'Actuation', fact: 'raptor.tvc.electric' },
        { label: 'Booster engines that gimbal', fact: 'booster.enginesGimbal' },
        { label: 'Ship engines that gimbal', fact: 'ship.enginesGimbal' },
        Object.assign({ label: 'Bearing design' }, NP),
      ],
      related: ['booster.enginesInner', 'booster.enginesCenter', 'ship.enginesSL', 'raptor3.controller'],
    },
    {
      id: 'raptor3.loxInlet', parent: 'raptor3', name: 'Oxygen inlet', short: 'LOX inlet', kind: 'Feed and valves', order: 20, view: VIEW,
      summary: 'The large flanged inlet on the engine\'s centerline where liquid oxygen from the vehicle enters, directly above the oxygen turbopump.',
      body: [
        'Liquid oxygen arrives subcooled, below its {{propellant.loxBoil}} boiling point, at a pressure the community cycle model puts at only about {{raptor.r3.inletPressure}}. It drops straight into the inducer of the oxygen turbopump. Low inlet pressure is the danger for any pump: if the liquid boils on the inducer blades it cavitates and the pump loses pressure. On Flights 2 and 3, blocked filters in the vehicle\'s oxygen feed starved turbopumps of inlet pressure and shut engines down.',
        'This is the low-pressure side of the engine, so it keeps a bolted flange and seals. NASASpaceflight described Raptor 3 as flanged on the low-pressure side and flangeless on the high-pressure side, where joints became welds or single parts. The main oxidizer valve is downstream; SpaceX has not published where.',
        'On the V3 booster the inner engines can also draw oxygen from a separate LOX landing tank, which NASASpaceflight reports feeds them for landing burns.',
      ],
      specs: [
        { label: 'Inlet pressure', fact: 'raptor.r3.inletPressure' },
        { label: 'Oxygen flow', fact: 'raptor.r3.loxFlow' },
        { label: 'LOX boiling point', fact: 'propellant.loxBoil' },
        { label: 'LOX freezing point', fact: 'propellant.loxFreeze' },
        { label: 'Joints', fact: 'raptor.r3.flanges' },
        { label: 'Past failure mode', fact: 'raptor.r3.otpInletLoss' },
      ],
      related: ['raptor3.otp', 'raptor3.otp.pump', 'raptor3.cycle.oxPath', 'booster.landingTank', 'booster.loxTank'],
    },
    {
      id: 'raptor3.ch4Inlet', parent: 'raptor3', name: 'Methane inlet', short: 'CH4 inlet', kind: 'Feed and valves', order: 21, view: VIEW,
      summary: 'The smaller flanged inlet on top of the fuel turbopump, off the centerline, where liquid methane enters.',
      body: [
        'Methane enters above the fuel pump on the side of the powerhead, subcooled below its {{propellant.ch4Boil}} boiling point. The engine burns about {{raptor.r3.ofRatio}} of oxygen per kilogram of methane (estimate), but liquid methane is less than half as dense as liquid oxygen, so the two inlets carry more similar volumes than the mass ratio suggests.',
        'On the V3 booster, methane reaches the engines through a redesigned transfer tube that SpaceX says is roughly the size of a Falcon 9 first stage, sized so that all {{booster.engineCount}} can start at once.',
        'Like the oxygen inlet this joint is on the low-pressure side and keeps its bolted flange. After Flight 1 SpaceX upgraded methane turbopump and manifold seals to cut leakage into the engine bay (Raptor 2).',
      ],
      specs: [
        { label: 'Inlet pressure', fact: 'raptor.r3.inletPressure' },
        { label: 'Methane flow', fact: 'raptor.r3.ch4Flow' },
        { label: 'CH4 boiling point', fact: 'propellant.ch4Boil' },
        { label: 'CH4 freezing point', fact: 'propellant.ch4Freeze' },
        { label: 'Booster feed', fact: 'booster.transferTube' },
      ],
      related: ['raptor3.ftp', 'raptor3.ftp.pump', 'raptor3.cycle.fuelPath', 'booster.downcomer', 'booster.ch4Tank'],
    },
    {
      id: 'raptor3.otp', parent: 'raptor3', name: 'Oxygen turbopump', short: 'OTP', kind: 'Turbomachinery', order: 4, view: VIEW,
      summary: 'A pump and a turbine on one shaft, on the engine\'s centerline. The pump raises liquid oxygen to several hundred bar; the turbine is driven by hot oxygen-rich gas from the oxygen preburner.',
      body: [
        'Liquid oxygen falls into the pump from the inlet above, and the pump raises it far above chamber pressure, to about {{raptor.r3.otpDischarge}} in a community model of Raptor 2, because the oxygen still has to pass through the preburner, the turbine and the injector before it burns. Musk\'s 2018 description of a hot, oxygen-rich turbopump of about {{raptor.r3.otpDesignPressure}} is the only official hint at its pressure.',
        'Its turbine runs in the harshest environment on the engine: hot, high-pressure gas that is mostly oxygen, which will burn most metals. SpaceX developed its own alloy, {{raptor.material.sx500}}, with extreme oxidation resistance for this job.',
        'The layout drawn here follows public analysis of SpaceX photos and community cycle models: pump on top, fed straight from the inlet, turbine below it, and turbine exhaust ducted down into the main injector. SpaceX has not published the stage count, inducer and impeller design, shaft speed, bearings or power.',
        'The oxygen side has caused real trouble. Oxygen inlet pressure losses shut engines down on Flights 2 and 3, and SpaceX attributed the first Flight 13 launch abort to ox turbopump issues: {{flight.f13Abort}}.',
      ],
      specs: [
        { label: 'Discharge pressure', fact: 'raptor.r3.otpDischarge' },
        { label: 'Design pressure class', fact: 'raptor.r3.otpDesignPressure' },
        { label: 'Oxygen flow', fact: 'raptor.r3.loxFlow' },
        { label: 'Turbine drive gas', fact: 'raptor.r3.oxPreburnerTemp' },
        { label: 'Hot-section alloy', fact: 'raptor.material.sx500' },
        { label: 'Layout', fact: 'raptor.r3.layout' },
        Object.assign({ label: 'Shaft speed and power' }, NP),
      ],
      related: ['raptor3.opb', 'raptor3.oxDuct', 'raptor3.cycle.oxPath', 'raptor3.loxInlet', 'raptor3.ftp'],
    },
    {
      id: 'raptor3.otp.pump', parent: 'raptor3.otp', name: 'Oxygen pump', short: 'OTP pump', kind: 'Turbomachinery', order: 1, view: VIEW,
      summary: 'The inducer and centrifugal impeller that take liquid oxygen from a few bar at the inlet to several hundred bar.',
      body: [
        'An inducer, a small axial screw at the pump inlet, raises the pressure just enough that the main impeller does not cavitate. The impeller then flings the liquid outward, and the volute around it slows the flow and turns its speed into pressure.',
        'Subcooled propellant helps. Colder oxygen is denser and further from boiling, which gives the inducer more margin at low inlet pressure and lets more propellant fit in the tank.',
        'The inducer, backswept impeller vanes and volute shown are a generic single-stage centrifugal layout. SpaceX has not published the number of stages or vanes, and the discharge pressure is a community estimate for Raptor 2.',
      ],
      specs: [
        { label: 'Inlet pressure', fact: 'raptor.r3.inletPressure' },
        { label: 'Discharge pressure', fact: 'raptor.r3.otpDischarge' },
        { label: 'Oxygen flow', fact: 'raptor.r3.loxFlow' },
        Object.assign({ label: 'Stages and vanes' }, NP),
      ],
      related: ['raptor3.otp.shaft', 'raptor3.otp.turbine', 'raptor3.loxInlet', 'raptor3.cycle.oxPath'],
    },
    {
      id: 'raptor3.otp.turbine', parent: 'raptor3.otp', name: 'Oxygen-rich turbine', short: 'OTP turbine', kind: 'Turbomachinery', order: 2, view: VIEW,
      summary: 'The turbine that drives the oxygen pump, spun by oxygen-rich gas rising from the oxygen preburner.',
      body: [
        'Nearly all of the engine\'s oxygen burns with a little methane in the oxygen preburner, and that gas, about {{raptor.r3.oxPreburnerTemp}} in a community model, expands through this turbine. Stator vanes aim it at the rotor blades, the rotor extracts power, and the gas leaves at about {{raptor.r3.oxTurbineExitP}} and {{raptor.r3.oxTurbineExit}} in the same model, still carrying all of that oxygen to the main injector.',
        'Because the whole oxygen flow drives the turbine, the gas can stay relatively cool for the power it delivers. The AFRL and NASA Integrated Powerhead Demonstrator program cited this in 2006 as the cycle\'s main benefit for turbine life.',
        'Hot oxygen-rich gas at this pressure attacks most metals, which is why this corner of the engine needs an oxidation-resistant superalloy. Blade count and geometry here are schematic.',
      ],
      specs: [
        { label: 'Inlet gas (preburner)', fact: 'raptor.r3.oxPreburnerTemp' },
        { label: 'Preburner pressure', fact: 'raptor.r3.preburnerPressure' },
        { label: 'Exit pressure', fact: 'raptor.r3.oxTurbineExitP' },
        { label: 'Exit temperature', fact: 'raptor.r3.oxTurbineExit' },
        { label: 'Alloy', fact: 'raptor.material.sx500' },
        Object.assign({ label: 'Blade count' }, NP),
      ],
      related: ['raptor3.opb', 'raptor3.oxDuct', 'raptor3.otp.shaft', 'raptor3.cycle.oxPath'],
    },
    {
      id: 'raptor3.otp.shaft', parent: 'raptor3.otp', name: 'Oxygen turbopump shaft', short: 'OTP shaft', kind: 'Turbomachinery', order: 3, view: VIEW,
      summary: 'The single shaft tying the oxygen turbine to the oxygen pump. Both ends see oxygen, so no seal has to keep two propellants apart.',
      body: [
        'In a staged combustion engine with one preburner, a turbine driven by gas rich in one propellant often shares a shaft or housing with a pump full of the other. A seal then has to keep fuel and oxygen apart along the shaft, and a leak across it can start a fire inside the turbopump.',
        'Full flow removes the problem. This shaft carries liquid oxygen at the pump end and oxygen-rich gas at the turbine end, so anything that leaks along it meets more oxygen. The fuel pump shaft sees only methane and fuel-rich gas. The 2006 demonstrator program and Everyday Astronaut both cite this as a core benefit; as the latter put it, leaking hot fuel "just comes in contact with more fuel".',
        'Shaft speed, bearing type and seal design are not published. The 2006 demonstrator used hydrostatic bearings to avoid wear; Raptor\'s bearings are not public.',
      ],
      specs: [
        { label: 'Inter-propellant seal', fact: 'raptor.ffsc.noSeal' },
        Object.assign({ label: 'Shaft speed' }, NP),
        Object.assign({ label: 'Bearings' }, NP),
      ],
      related: ['raptor3.ftp.shaft', 'raptor3.otp.pump', 'raptor3.otp.turbine', 'raptor3.cycles'],
    },
    {
      id: 'raptor3.ftp', parent: 'raptor3', name: 'Fuel turbopump', short: 'FTP', kind: 'Turbomachinery', order: 5, view: VIEW,
      summary: 'The methane pump and its fuel-rich turbine, on the side of the powerhead. It makes the highest pressure in the engine.',
      body: [
        'Methane is the less dense propellant and has further to go before it burns: through the fuel pump, the cooling channels of the nozzle and chamber, the fuel preburner and the fuel turbine. So the fuel pump works hardest. A community model puts Raptor 2\'s methane discharge near {{raptor.r3.ftpDischarge}}, the highest pressure anywhere in the engine.',
        'The scroll-shaped housing on the side of the Raptor 3 powerhead is read as this pump\'s discharge volute, because the engine\'s largest external pipe leaves it and runs to the nozzle cooling manifold. Its turbine sits below, driven by fuel-rich gas rising from the fuel preburner that hangs beneath the deck.',
        'Fuel-rich gas is gentle on metal compared with the oxygen side, so the fuel turbine\'s limits are heat and pressure, not oxidation. The position is photo interpretation; stage count, speed and power are not published.',
      ],
      specs: [
        { label: 'Discharge pressure', fact: 'raptor.r3.ftpDischarge' },
        { label: 'Methane flow', fact: 'raptor.r3.ch4Flow' },
        { label: 'Turbine drive gas', fact: 'raptor.r3.fuelPreburnerTemp' },
        { label: 'Layout', fact: 'raptor.r3.layout' },
        Object.assign({ label: 'Shaft speed and power' }, NP),
      ],
      related: ['raptor3.fpb', 'raptor3.fuelDuct', 'raptor3.regen', 'raptor3.cycle.fuelPath', 'raptor3.ch4Inlet'],
    },
    {
      id: 'raptor3.ftp.pump', parent: 'raptor3.ftp', name: 'Methane pump', short: 'FTP pump', kind: 'Turbomachinery', order: 1, view: VIEW,
      summary: 'The methane pump: inducer, impeller and the scroll-shaped volute that feeds the cooling circuit.',
      body: [
        'A pump\'s pressure rise scales with the density of the liquid and the square of the impeller tip speed. Methane is much lighter than oxygen, so reaching an even higher pressure takes more tip speed or more stages. SpaceX has not said which Raptor uses.',
        'The discharge does not go straight to a preburner. It goes first through the regenerative cooling circuit, starting with the large pipe that loops over the top of the engine.',
      ],
      specs: [
        { label: 'Inlet pressure', fact: 'raptor.r3.inletPressure' },
        { label: 'Discharge pressure', fact: 'raptor.r3.ftpDischarge' },
        { label: 'Methane flow', fact: 'raptor.r3.ch4Flow' },
        Object.assign({ label: 'Stages and vanes' }, NP),
      ],
      related: ['raptor3.regen', 'raptor3.ch4Inlet', 'raptor3.ftp.shaft', 'raptor3.cycle.fuelPath'],
    },
    {
      id: 'raptor3.ftp.turbine', parent: 'raptor3.ftp', name: 'Fuel-rich turbine', short: 'FTP turbine', kind: 'Turbomachinery', order: 2, view: VIEW,
      summary: 'The turbine that drives the methane pump, spun by fuel-rich gas from the fuel preburner.',
      body: [
        'Almost all of the methane, warmed in the cooling channels, burns with a small amount of oxygen in the fuel preburner. The fuel-rich gas, about {{raptor.r3.fuelPreburnerTemp}} in a community model, rises into this turbine, gives up power, and leaves at about {{raptor.r3.fuelTurbineExitP}} and {{raptor.r3.fuelTurbineExit}} for the fuel side of the main injector.',
        'Methane leaves no soot in a fuel-rich preburner, unlike kerosene, so the blades stay clean between flights. Blade count and geometry here are schematic.',
      ],
      specs: [
        { label: 'Inlet gas (preburner)', fact: 'raptor.r3.fuelPreburnerTemp' },
        { label: 'Preburner pressure', fact: 'raptor.r3.preburnerPressure' },
        { label: 'Exit pressure', fact: 'raptor.r3.fuelTurbineExitP' },
        { label: 'Exit temperature', fact: 'raptor.r3.fuelTurbineExit' },
        Object.assign({ label: 'Blade count' }, NP),
      ],
      related: ['raptor3.fpb', 'raptor3.fuelDuct', 'raptor3.ftp.shaft', 'raptor3.cycle.fuelPath'],
    },
    {
      id: 'raptor3.ftp.shaft', parent: 'raptor3.ftp', name: 'Fuel turbopump shaft', short: 'FTP shaft', kind: 'Turbomachinery', order: 3, view: VIEW,
      summary: 'The shaft linking the fuel turbine to the methane pump. It only ever touches methane and fuel-rich gas.',
      body: [
        'The same logic as the oxygen side: a leak along this shaft moves methane-rich gas into more methane, so no inter-propellant seal or purge is needed between pump and turbine.',
        'Two separate shafts also let each pump spin at its own best speed, which a single shaft driving both pumps cannot do. Speed and bearing design are not published.',
      ],
      specs: [
        { label: 'Inter-propellant seal', fact: 'raptor.ffsc.noSeal' },
        Object.assign({ label: 'Shaft speed' }, NP),
      ],
      related: ['raptor3.otp.shaft', 'raptor3.ftp.pump', 'raptor3.ftp.turbine'],
    },
    {
      id: 'raptor3.opb', parent: 'raptor3', name: 'Oxygen-rich preburner', short: 'OPB', kind: 'Combustion', order: 6, view: VIEW,
      summary: 'A small combustor that burns nearly all of the oxygen with a little methane, making the gas that drives the oxygen turbine.',
      body: [
        'Most of the pumped oxygen flows in with a small stream of warm methane from the cooling circuit. The mixture is so oxygen-rich that it burns only a few hundred kelvin above ambient, about {{raptor.r3.oxPreburnerTemp}} at about {{raptor.r3.preburnerPressure}} in a community model of Raptor 2: cool enough for the turbine, energetic enough to drive it.',
        'An oxygen-rich preburner is the hardest part of the cycle to build. Hot, high-pressure gaseous oxygen burns through most alloys, and a rub or a stray particle can start a metal fire. SpaceX tested an oxygen-rich preburner as a stand-alone component at NASA Stennis in 2015, before the first full engine.',
        'Its position on the centerline between the oxygen turbopump and the injector, with gas rising into the turbine, follows public analysis; community schematics have revised it more than once.',
      ],
      specs: [
        { label: 'Gas temperature', fact: 'raptor.r3.oxPreburnerTemp' },
        { label: 'Pressure', fact: 'raptor.r3.preburnerPressure' },
        { label: 'Alloy', fact: 'raptor.material.sx500' },
        { label: 'Ignition', fact: 'raptor.r3.ignition' },
      ],
      related: ['raptor3.otp.turbine', 'raptor3.igniters', 'raptor3.fpb', 'raptor3.cycle.oxPath'],
    },
    {
      id: 'raptor3.fpb', parent: 'raptor3', name: 'Fuel-rich preburner', short: 'FPB', kind: 'Combustion', order: 7, view: VIEW,
      summary: 'Burns nearly all of the methane with a little oxygen to make the fuel-rich gas that drives the fuel turbine.',
      body: [
        'Warm methane from the cooling channels meets a small flow of oxygen, making fuel-rich gas at about {{raptor.r3.fuelPreburnerTemp}} and {{raptor.r3.preburnerPressure}} in a community model of Raptor 2. The gas rises through the deck into the fuel turbine above.',
        'SpaceX\'s photo of Raptor 3 SN1 shows a large ribbed vertical body hanging below the deck under the fuel pump, ending in a rounded dome with small ports. Public analysis reads it as the fuel preburner or its hot-gas path; SpaceX has not labeled it. The model draws it as the preburner.',
        'The fuel-rich side is chemically gentle, so materials are chosen for temperature and pressure, and methane leaves no carbon deposits to clean out between flights.',
      ],
      specs: [
        { label: 'Gas temperature', fact: 'raptor.r3.fuelPreburnerTemp' },
        { label: 'Pressure', fact: 'raptor.r3.preburnerPressure' },
        { label: 'Ignition', fact: 'raptor.r3.ignition' },
      ],
      related: ['raptor3.ftp.turbine', 'raptor3.igniters', 'raptor3.regen', 'raptor3.cycle.fuelPath'],
    },
    {
      id: 'raptor3.oxDuct', parent: 'raptor3', name: 'Oxygen-rich hot-gas ducts', short: 'Ox-gas ducts', kind: 'Combustion', order: 8, view: VIEW,
      summary: 'Carry the oxygen-rich gas leaving the oxygen turbine down into the center of the main injector.',
      body: [
        'After the turbine the oxygen-rich gas is still at very high pressure, about {{raptor.r3.oxTurbineExitP}} and {{raptor.r3.oxTurbineExit}} in a community model, and it carries all of the engine\'s oxygen. The path to the injector has to be short, smooth and gas-tight.',
        'On Raptor 3 most of this path is built into the powerhead castings and the flat deck above the chamber. The two ducts in this model stand in for that internal passage, and their shape is schematic.',
      ],
      specs: [
        { label: 'Gas pressure', fact: 'raptor.r3.oxTurbineExitP' },
        { label: 'Gas temperature', fact: 'raptor.r3.oxTurbineExit' },
        { label: 'Construction', fact: 'raptor.r3.integration' },
      ],
      related: ['raptor3.otp.turbine', 'raptor3.injector', 'raptor3.fuelDuct', 'raptor3.cycle.oxPath'],
    },
    {
      id: 'raptor3.fuelDuct', parent: 'raptor3', name: 'Fuel-rich hot-gas duct', short: 'Fuel-gas duct', kind: 'Combustion', order: 9, view: VIEW,
      summary: 'Carries fuel-rich gas from the fuel turbine into the outer manifold of the main injector.',
      body: [
        'The gas leaving the fuel turbine, about {{raptor.r3.fuelTurbineExitP}} and {{raptor.r3.fuelTurbineExit}} in a community model, contains nearly all of the engine\'s methane. The high pressure in Raptor\'s hot-gas manifold was cited as one reason methane leaks troubled early boosters.',
        'Raptor 3 builds this path into the engine structure; NASASpaceflight described much of the internal plumbing as built into the engine\'s case. The duct drawn here is schematic.',
      ],
      specs: [
        { label: 'Gas pressure', fact: 'raptor.r3.fuelTurbineExitP' },
        { label: 'Gas temperature', fact: 'raptor.r3.fuelTurbineExit' },
        { label: 'Construction', fact: 'raptor.r3.integration' },
      ],
      related: ['raptor3.ftp.turbine', 'raptor3.injector', 'raptor3.oxDuct', 'raptor3.cycle.fuelPath'],
    },
    {
      id: 'raptor3.injector', parent: 'raptor3', name: 'Main injector', kind: 'Combustion', order: 10, view: VIEW,
      summary: 'Where the two hot gas streams meet: the flat deck and a face of many small elements at the head of the combustion chamber.',
      body: [
        'In most engines at least one propellant reaches the injector as a liquid that has to be sprayed and evaporated before it can burn. In Raptor both arrive as hot gases, oxygen-rich gas into the central dome and fuel-rich gas into the outer manifold. Gas mixes with gas quickly and completely, so combustion finishes in a short chamber, and the two hot streams ignite on contact.',
        'That is why Raptor 2 dropped the main-chamber igniters Raptor 1 carried: only the preburners need an ignition source. The 2019 FAA-filed model assumed {{raptor.r1.cStarEfficiency}} combustion efficiency (c-star).',
        'The element pattern shown is schematic. Musk discussed swirl injectors in 2022 and Raptor 2 is reported to use coaxial swirl elements, but SpaceX has not published the element type, count or layout for any Raptor.',
      ],
      specs: [
        { label: 'Elements', fact: 'raptor.r3.injectorElements' },
        { label: 'Mixture ratio', fact: 'raptor.r3.ofRatio' },
        { label: 'Combustion efficiency (2019)', fact: 'raptor.r1.cStarEfficiency' },
        { label: 'Main-chamber igniter', value: 'None since Raptor 2', conf: 'reported' },
      ],
      related: ['raptor3.mcc', 'raptor3.oxDuct', 'raptor3.fuelDuct', 'raptor3.cycle'],
    },
    {
      id: 'raptor3.mcc', parent: 'raptor3', name: 'Main combustion chamber and throat', short: 'MCC', kind: 'Combustion', order: 11, view: VIEW,
      summary: 'The short, regeneratively cooled chamber where the gases burn near {{raptor.r3.chamberTemp}}, and the narrow throat where the flow goes supersonic.',
      body: [
        'Combustion here runs near {{raptor.r3.chamberTemp}}, far above the melting point of any metal in the chamber. The wall survives because it is a thin copper-alloy liner with coolant channels cut into it: methane flows through the channels at high pressure and carries the heat away, and copper\'s high thermal conductivity moves heat from the hot face to the coolant fast enough to keep the liner solid. A copper liner is widely reported (Musk once attributed a green tint in the flame to copper from the chamber); SpaceX has not named the alloy.',
        'Chamber pressure is the headline figure for an engine like this: higher pressure packs more thrust into the same size and expands the exhaust more efficiently. Raptor 2 ran about {{raptor.r2.chamberPressure}}, and a development Raptor 3 reached {{raptor.r3.chamberPressure}} in May 2023. Musk suggested the chamber wall may carry the highest heat flux of anything ever made. The flight-rating chamber pressure is not published.',
        'The throat is the narrowest point, where the gas reaches the speed of sound and the heat flux peaks. The 2019 engine\'s throat was {{raptor.r1.throatDiameter}} across; Raptor 2 opened it up for more thrust, and Raptor 3\'s is not published (about {{raptor.r3.throatDiameterEst}} by estimate). The 2019 engine also bled {{raptor.r1.filmCooling}} as a fuel-rich film through slots just upstream of the throat; SpaceX was reported in 2022 to be working to remove that film cooling.',
      ],
      specs: [
        { label: 'Chamber pressure (2023 test)', fact: 'raptor.r3.chamberPressure' },
        { label: 'Chamber pressure, Raptor 2', fact: 'raptor.r2.chamberPressure' },
        { label: 'Combustion temperature', fact: 'raptor.r3.chamberTemp' },
        { label: 'Throat diameter, Raptor 3', fact: 'raptor.r3.throatDiameterEst' },
        { label: 'Throat diameter, 2019 engine', fact: 'raptor.r1.throatDiameter' },
        { label: 'Film cooling, 2019 engine', fact: 'raptor.r1.filmCooling' },
      ],
      related: ['raptor3.injector', 'raptor3.regen', 'raptor3.nozzle', 'raptor3.physics'],
    },
    {
      id: 'raptor3.regen', parent: 'raptor3', name: 'Regenerative cooling circuit', short: 'Regen cooling', kind: 'Combustion', order: 12, view: VIEW,
      summary: 'The fuel pump discharge pipe, the ring manifold on the upper nozzle, and the channels in the chamber and nozzle walls that cool the engine with its own methane.',
      body: [
        'In community cycle models nearly all of the methane from the fuel pump is routed through the walls of the thrust chamber before it burns. On Raptor 3 you can see the start of the circuit in SpaceX\'s photo: the engine\'s largest pipe leaves the fuel pump volute, loops over the top of the engine and runs down the far side into a ring manifold around the upper nozzle.',
        'From the manifold the methane flows through narrow channels in the nozzle, throat and chamber walls. It picks up heat, protecting the wall, and arrives at the regen outlet warm and supercritical, about {{raptor.r3.regenOutletP}} in a community model, ready to feed the preburners. The heat goes back into the propellant instead of being thrown away.',
        'Which way the methane runs in each section, and whether the flow splits at the manifold, are not published. The flow animation follows one plausible route: up from the manifold through the throat and chamber to an outlet ring below the injector. The channel count here is schematic.',
        'On Raptor 3 the same cooled structure also shelters internal plumbing and sensors, which is part of what let SpaceX delete the heat shield. The 2019 FAA-filed data describe the sea-level engine as a regeneratively cooled thrust chamber and nozzle at {{raptor.r1.expansionRatio}} expansion.',
      ],
      specs: [
        { label: 'Supply (fuel pump discharge)', fact: 'raptor.r3.ftpDischarge' },
        { label: 'Regen outlet', fact: 'raptor.r3.regenOutletP' },
        { label: 'Coolant flow', fact: 'raptor.r3.ch4Flow' },
        { label: 'Routing', fact: 'raptor.r3.regenManifold' },
        Object.assign({ label: 'Channel count' }, NP),
      ],
      related: ['raptor3.ftp.pump', 'raptor3.mcc', 'raptor3.nozzle', 'raptor3.cycle.fuelPath'],
    },
    {
      id: 'raptor3.nozzle', parent: 'raptor3', name: 'Sea-level nozzle', short: 'Nozzle', kind: 'Combustion', order: 13, view: VIEW,
      summary: 'The bell that expands the exhaust into thrust, sized to work at sea level without the flow separating from the wall.',
      body: [
        'Past the throat the gas expands and accelerates through the bell, turning pressure into velocity. A wider exit extracts more energy, but at sea level the air pushes back: an over-expanded plume separates from the wall, which is unstable and can damage the nozzle. So the sea-level nozzle stops at an exit about {{raptor.r3.exitDiameter}} across, giving up some vacuum performance to run cleanly from liftoff to space.',
        'The numbers show the trade. The same engine gives about {{raptor.r3.ispSL}} at sea level and about {{raptor.r3.ispVac}} in vacuum, and makes about {{raptor.r3.thrustVacOfSLEngine}} in vacuum (derived from SpaceX\'s ship thrust).',
        'The bell is cooled by methane in wall channels, which show as fine ribs. The 2019 engine had {{raptor.r1.expansionRatio}} expansion, a {{raptor.r1.exitDiameter}} exit and a {{raptor.r1.nozzleLength}} throat-to-exit length; Raptor 3\'s expansion ratio is not published. The contour here is a parabolic bell fitted to the 2019 wall angles ({{raptor.r1.nozzleAngles}}) with an estimated throat, which gives about {{raptor3d.modelExpansion}}.',
      ],
      specs: [
        { label: 'Exit diameter', fact: 'raptor.r3.exitDiameter' },
        Object.assign({ label: 'Expansion ratio, Raptor 3' }, NP),
        { label: 'Expansion ratio, 2019 engine', fact: 'raptor.r1.expansionRatio' },
        { label: 'Length, 2019 engine', fact: 'raptor.r1.nozzleLength' },
        { label: 'Isp, sea level', fact: 'raptor.r3.ispSL' },
        { label: 'Thrust in vacuum', fact: 'raptor.r3.thrustVacOfSLEngine' },
        { label: 'This model', fact: 'raptor3d.modelExpansion' },
      ],
      related: ['raptor3.rvac', 'raptor3.regen', 'raptor3.mcc', 'raptor3.plume'],
    },
    {
      id: 'raptor3.igniters', parent: 'raptor3', name: 'Ignition system', short: 'Igniters', kind: 'Combustion', order: 14, view: VIEW,
      summary: 'Lights the two preburners at every start and relight. SpaceX says Raptor 3 has a redesigned ignition system.',
      body: [
        'Only the preburners need an ignition source: once they run, hot gases from both reach the main injector and light the chamber on contact. Earlier Raptors used spark-energized torch igniters, small methalox torches fed with gaseous methane and oxygen and lit by spark plugs.',
        'Ignition was a known weak point. SpaceX traced a Flight 7 boostback relight failure to a low-power condition in the igniter system, and a Flight 8 problem to torch ignition issues caused by local thermal conditions, fixed with insulation. For Raptor 3, SpaceX confirms only a redesigned ignition system. NASASpaceflight reports acoustic resonance igniters with no spark and no moving parts; SpaceX has not confirmed that.',
        'Starting also needs the pumps turning first. NASASpaceflight reports that Raptor 3 spins its turbopumps up with gaseous oxygen and methane from onboard pressure vessels, where earlier engines used helium or nitrogen. The number and position of igniters are not public; the two drawn here, one per preburner, are schematic.',
      ],
      specs: [
        { label: 'Ignition', fact: 'raptor.r3.ignition' },
        { label: 'Spin-start gas', fact: 'raptor.r3.spinStartGas' },
        { label: 'Raptor 2 history', fact: 'raptor.r3.igniterHistory' },
        { label: 'First in-space relight', fact: 'raptor.r3.firstInSpaceRelight' },
        { label: 'Booster engines that relight', fact: 'booster.enginesRelight' },
        Object.assign({ label: 'Igniter count' }, NP),
      ],
      related: ['raptor3.startup', 'raptor3.opb', 'raptor3.fpb', 'raptor3.controller'],
    },
    {
      id: 'raptor3.controller', parent: 'raptor3', name: 'Engine controller and sensors', short: 'Controller', kind: 'Control and structure', order: 15, view: VIEW,
      summary: 'The electronics that sequence start, throttle and shutdown and watch engine health. On Raptor 3 they sit inside the engine under its thermal protection.',
      body: [
        'Raptor 1 was covered in external sensors and wiring, and Raptor 2 consolidated its controllers into boxes. On Raptor 3, SpaceX says the sensors and controllers are internally integrated and covered by engine thermal protection, one reason the engine no longer needs a heat shield or shroud.',
        'The controller runs the start sequence (chill, spin start, preburner ignition, ramp to power), holds thrust and mixture ratio with the valves, and shuts the engine down if it misbehaves. Engine health is an explicit abort criterion: the first Flight 13 countdown aborted automatically at T-0 when engines failed to start. The FAA listed erroneous engine alarm settings among the probable causes of the Flight 12 booster loss.',
        'The box and harness drawn here stand in for electronics SpaceX has not shown in detail. The throttle floor of Raptor 3 is not published; the 2020 engine throttled to about {{raptor.r1.throttleMin}}.',
      ],
      specs: [
        { label: 'Location', fact: 'raptor.r3.controllers' },
        Object.assign({ label: 'Throttle range, Raptor 3' }, NP),
        { label: 'Throttle floor, 2020 engine', fact: 'raptor.r1.throttleMin' },
      ],
      related: ['raptor3.igniters', 'raptor3.gimbal', 'raptor3.startup'],
    },
    {
      id: 'raptor3.press', parent: 'raptor3', name: 'Autogenous pressurization taps', short: 'Pressurant taps', kind: 'Feed and valves', order: 22, view: VIEW,
      summary: 'Tap-offs that turn a little of each propellant into gas and send it back to keep the vehicle\'s tanks pressurized.',
      body: [
        'As propellant drains, gas has to fill the space behind it or tank pressure drops and the pumps starve. Starship was designed from 2016 to do this autogenously: a heat exchanger on each engine turns a small flow of oxygen into gaseous oxygen for the LOX tank, and warm methane is tapped off after the cooling channels for the methane tank. That avoids carrying helium, the pressurant Falcon 9 uses.',
        'Where Raptor 3 takes these gases is not public; they are presumably among the secondary flow paths Musk says were moved inside the engine. Community models put the oxygen heat exchanger in the oxygen-rich turbine exhaust and take methane gas from the regen outlet, which is how they are placed here.',
        'The system matters: SpaceX traced the Flight 9 ship loss to a failed diffuser in the main fuel tank pressurization system. On the V3 booster, NASASpaceflight reports the pressurization manifolds run outside the aft section alongside the engines\' other commodity lines.',
      ],
      specs: [
        { label: 'Method', fact: 'raptor.r3.autogenous' },
        Object.assign({ label: 'Tap-off locations' }, NP),
      ],
      related: ['booster.pressurization', 'raptor3.regen', 'raptor3.otp.turbine'],
    },
    {
      id: 'raptor3.rvac', parent: 'raptor3', name: 'Raptor Vacuum 3', short: 'RVac 3', kind: 'Engine variant', order: 16, view: VIEW,
      summary: 'The ship\'s vacuum engine: the same powerhead and chamber with a much larger nozzle, rated at {{raptor.rvac3.thrust}}.',
      body: [
        'In space nothing pushes back on the plume, so a larger nozzle keeps extracting energy from the expanding gas. Raptor Vacuum 3 is {{raptor.rvac3.height}} tall with a {{raptor.rvac3.exitDiameter}} exit, against {{raptor.r3.height}} and {{raptor.r3.exitDiameter}} for the sea-level engine. SpaceX rates it at {{raptor.rvac3.thrust}}, against about {{raptor.r3.thrustVacOfSLEngine}} for a sea-level Raptor 3 in vacuum, and Musk\'s long-standing figure for a vacuum-nozzle Raptor is about {{raptor.rvac3.isp}}.',
        'That nozzle cannot run at sea level, where the plume would separate from the wall. So the ship carries ' + SX.factHTML('ship.enginesVac', { unitless: true }) + ' fixed RVacs for ascent and orbital efficiency and ' + SX.factHTML('ship.enginesSL', { unitless: true }) + ' gimbaling sea-level engines for steering, in-space burns and landing. On V3 the RVac tops sit slightly recessed into the LOX tank.',
        'Mass, expansion ratio and nozzle cooling for RVac 3 are not published. If it shares the sea-level throat, the exit in this model gives about {{raptor3d.modelExpansionVac}} (estimate). The April 2024 thrust target was {{raptor.rvac3.thrustTarget2024}}. One RVac shut down early on both Flight 12 and Flight 14 without losing the mission.',
      ],
      specs: [
        { label: 'Thrust, vacuum', fact: 'raptor.rvac3.thrust' },
        { label: 'Isp, vacuum', fact: 'raptor.rvac3.isp' },
        { label: 'Height', fact: 'raptor.rvac3.height' },
        { label: 'Exit diameter', fact: 'raptor.rvac3.exitDiameter' },
        { label: '2024 thrust target', fact: 'raptor.rvac3.thrustTarget2024' },
        Object.assign({ label: 'Mass' }, NP),
        Object.assign({ label: 'Expansion ratio' }, NP),
        { label: 'This model', fact: 'raptor3d.modelExpansionVac' },
        { label: 'Per ship', fact: 'ship.enginesVac' },
      ],
      related: ['ship.enginesVac', 'raptor3.nozzle', 'raptor3.evolution'],
    },
  ];
  SX.addParts(PARTS);

  const OWN = PARTS.map((p) => p.id);
  const OWNSET = new Set(OWN);
  const TP_KIDS = { 'raptor3.otp': ['pump', 'turbine', 'shaft'], 'raptor3.ftp': ['pump', 'turbine', 'shaft'] };
  const LIST_GROUPS = [
    ['Turbomachinery', ['raptor3.otp', 'raptor3.otp.pump', 'raptor3.otp.turbine', 'raptor3.otp.shaft', 'raptor3.ftp', 'raptor3.ftp.pump', 'raptor3.ftp.turbine', 'raptor3.ftp.shaft']],
    ['Combustion', ['raptor3.opb', 'raptor3.fpb', 'raptor3.oxDuct', 'raptor3.fuelDuct', 'raptor3.injector', 'raptor3.mcc', 'raptor3.regen', 'raptor3.nozzle', 'raptor3.rvac', 'raptor3.igniters']],
    ['Feed and valves', ['raptor3.loxInlet', 'raptor3.ch4Inlet', 'raptor3.press']],
    ['Control and structure', ['raptor3.gimbal', 'raptor3.controller']],
  ];
  // Callout text: [wide, narrow]
  const CALL = {
    'raptor3.gimbal': ['Gimbal', 'Gimbal'], 'raptor3.loxInlet': ['LOX inlet', 'LOX in'], 'raptor3.ch4Inlet': ['CH4 inlet', 'CH4 in'],
    'raptor3.otp': ['Oxygen turbopump', 'OTP'], 'raptor3.ftp': ['Fuel turbopump', 'FTP'], 'raptor3.opb': ['Ox-rich preburner', 'OPB'],
    'raptor3.fpb': ['Fuel-rich preburner', 'FPB'], 'raptor3.oxDuct': ['Ox-gas ducts', 'Ox duct'], 'raptor3.fuelDuct': ['Fuel-gas duct', 'Fuel duct'],
    'raptor3.injector': ['Main injector', 'Injector'], 'raptor3.mcc': ['Chamber + throat', 'MCC'], 'raptor3.regen': ['Regen cooling', 'Regen'],
    'raptor3.nozzle': ['SL nozzle', 'Nozzle'], 'raptor3.rvac': ['RVac nozzle', 'RVac'], 'raptor3.igniters': ['Igniters', 'Ign.'],
    'raptor3.controller': ['Controller', 'Ctrl'], 'raptor3.press': ['Pressurant taps', 'Press.'],
  };

  /* ------------------------------------------------------------------ styles (scoped to .v-raptor3d) */

  SX.css(`
.v-raptor3d .r3-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(300px, 344px); gap: 16px; align-items: start; }
.v-raptor3d .r3-stagecol { min-width: 0; }
.v-raptor3d .r3-viz { height: clamp(480px, 76vh, 780px); }
.v-raptor3d .r3-viz .viz-toolbar { right: 12px; }
.v-raptor3d .r3-tools-spacer { flex: 1; }
.v-raptor3d .r3-viz .seg button { padding: 8px 9px; }
.v-raptor3d .r3-foot { position: absolute; left: 12px; bottom: 10px; right: 12px; display: grid; gap: 6px; justify-items: start; pointer-events: none; z-index: 2; }
.v-raptor3d .r3-foot > * { pointer-events: auto; }
.v-raptor3d .r3-note { font: 500 10.5px/1.35 var(--font-mono); color: var(--muted); letter-spacing: 0.04em; max-width: 62ch; pointer-events: none; }
.v-raptor3d .r3-legend { background: color-mix(in srgb, var(--bg) 82%, transparent); border: 1px solid var(--line); border-radius: 4px; padding: 7px 9px; font-size: 10.5px; }
.v-raptor3d .r3-legend[hidden], .v-raptor3d .r3-detailbar[hidden] { display: none; }
.v-raptor3d .r3-detailbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; background: color-mix(in srgb, var(--bg) 86%, transparent); border: 1px solid var(--accent); border-radius: 4px; padding: 6px 6px 6px 10px; }
.v-raptor3d .r3-detailbar b { font: 600 13px/1.1 var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; color: var(--accent); }
.v-raptor3d .r3-readout { position: absolute; right: 12px; top: 58px; z-index: 2; pointer-events: none; text-align: right; font: 500 10.5px/1.5 var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.v-raptor3d .r3-readout b { display: block; color: var(--fg); font: 600 15px/1.2 var(--font-display); letter-spacing: 0.06em; }
.v-raptor3d .r3-readout .fact { border-bottom: 0; }
.v-raptor3d .r3-sectag { position: absolute; left: 12px; top: 58px; z-index: 2; pointer-events: none; font: 500 10.5px/1.4 var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); border-left: 2px solid var(--accent); padding: 2px 0 2px 8px; }
.v-raptor3d .r3-sectag b { display: block; color: var(--accent); font-weight: 600; }
.v-raptor3d .r3-sectag[hidden] { display: none; }
.v-raptor3d .r3-controls { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 24px; padding: 12px 14px; margin-top: 10px; }
.v-raptor3d .r3-controls .range-row output { min-width: 4.5ch; }
.v-raptor3d .r3-controls .range-row.is-off { opacity: 0.45; }
.v-raptor3d .r3-side { display: grid; gap: 12px; min-width: 0; }
.v-raptor3d .r3-sheet { padding: 14px 16px 12px; }
.v-raptor3d .r3-sheet-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-bottom: 10px; }
.v-raptor3d .r3-sheet-head .h4 { font-size: 18px; }
.v-raptor3d .r3-dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 0; border-top: 1px solid var(--line-2); }
.v-raptor3d .r3-dl > div { padding: 8px 8px 8px 0; border-bottom: 1px solid var(--line); min-width: 0; }
.v-raptor3d .r3-dl > div:nth-child(odd) { border-right: 1px solid var(--line); }
.v-raptor3d .r3-dl > div:nth-child(even) { padding-left: 10px; }
.v-raptor3d .r3-dl dt { font: 500 9.5px/1.3 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.v-raptor3d .r3-dl dd { margin: 3px 0 0; font: 600 19px/1.1 var(--font-display); letter-spacing: 0.02em; font-variant-numeric: tabular-nums; }
.v-raptor3d .r3-dl dd .fact { border-bottom: 0; white-space: nowrap; }
.v-raptor3d .r3-dl dd small { display: block; font: 400 10.5px/1.3 var(--font-mono); color: var(--muted); letter-spacing: 0.02em; margin-top: 2px; }
.v-raptor3d .r3-parts { padding: 8px 8px 10px; }
.v-raptor3d .r3-parts h3 { font: 500 10px/1 var(--font-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin: 10px 8px 4px; }
.v-raptor3d .r3-parts ul { list-style: none; margin: 0; padding: 0; }
.v-raptor3d .r3-row { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; background: none; border: 0; border-left: 2px solid transparent; color: var(--fg-2); font: 400 13.5px/1.25 var(--font-body); padding: 5px 8px; border-radius: 0 4px 4px 0; cursor: pointer; }
.v-raptor3d .r3-row small { margin-left: auto; font: 500 10px/1 var(--font-mono); letter-spacing: 0.06em; color: var(--muted); }
.v-raptor3d .r3-row.is-child { padding-left: 24px; font-size: 12.5px; }
.v-raptor3d .r3-row.is-child::before { content: ""; width: 8px; height: 1px; background: var(--line-2); margin-left: -14px; margin-right: 4px; }
.v-raptor3d .r3-row:hover { background: var(--bg-3); color: var(--fg); }
.v-raptor3d .r3-row.is-hover { background: var(--bg-3); }
.v-raptor3d .r3-row[aria-current="true"] { border-left-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
.v-raptor3d .r3-row[aria-current="true"] small { color: var(--accent); }
.v-raptor3d .r3-row .dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--steel-2); }
.v-raptor3d .r3-row .dot.k-turbo { background: var(--steel); }
.v-raptor3d .r3-row .dot.k-comb { background: var(--copper); }
.v-raptor3d .r3-row .dot.k-feed { background: transparent; box-shadow: inset 0 0 0 1.5px var(--steel); }
.v-raptor3d .r3-row .dot.k-ctrl { background: var(--muted); }
.v-raptor3d .r3-cap { padding: 14px 16px; display: grid; gap: 10px; }
.v-raptor3d .r3-cap .eyebrow { color: var(--accent); }
.v-raptor3d .r3-cap h3 { font: 600 20px/1.1 var(--font-display); text-transform: uppercase; letter-spacing: 0.03em; }
.v-raptor3d .r3-cap p { font-size: 13.5px; color: var(--fg-2); }
.v-raptor3d .r3-cap .r3-actions { display: flex; flex-wrap: wrap; gap: 6px; }
.v-raptor3d .r3-cap .callout { font-size: 13.5px; }
.v-raptor3d .r3-callouts { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.v-raptor3d .r3-callouts path { fill: none; stroke: var(--steel-2); stroke-width: 1; }
.v-raptor3d .r3-callouts circle { fill: var(--fg); }
.v-raptor3d .r3-callouts .is-sel path { stroke: var(--accent); }
.v-raptor3d .r3-callouts .is-sel circle { fill: var(--accent); }
.v-raptor3d .r3-co { position: absolute; left: 0; top: 0; white-space: nowrap; pointer-events: auto; cursor: pointer;
  font: 500 10.5px/1 var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--fg);
  padding: 4px 6px; background: color-mix(in srgb, var(--bg) 84%, transparent); border: 1px solid var(--line-2); border-radius: 3px; }
.v-raptor3d .r3-co:hover { border-color: var(--accent); color: var(--accent); }
.v-raptor3d .r3-co.is-sel { border-color: var(--accent); color: var(--accent); background: color-mix(in srgb, var(--bg) 70%, var(--accent) 12%); }
.v-raptor3d .r3-co.is-sub { color: var(--fg-2); border-style: dashed; }
.v-raptor3d .three-label.r3-dim { background: none; border: 0; padding: 0; margin: -7px 0 0 8px; color: var(--muted); font-size: 10.5px; letter-spacing: 0.06em; }
.v-raptor3d .three-label.r3-dim.r3-dim-h { margin: 6px 0 0 0; transform-origin: 0 0; }
.v-raptor3d .three-label.r3-dim b { color: var(--fg-2); font-weight: 500; }
.v-raptor3d .r3-parts, .v-raptor3d .r3-cap { scrollbar-width: thin; scrollbar-color: var(--line-2) transparent; }
@media (min-width: 961px) {
  .v-raptor3d .r3-side { position: sticky; top: calc(var(--topbar) + 12px); max-height: calc(100vh - var(--topbar) - 24px); display: flex; flex-direction: column; }
  .v-raptor3d .r3-sheet { flex: none; }
  .v-raptor3d .r3-cap { flex: 0 1 auto; min-height: 0; overflow-y: auto; }
  .v-raptor3d .r3-parts { flex: 1 1 0; min-height: 170px; overflow-y: auto; }
}
@media (max-width: 960px) {
  .v-raptor3d .r3-grid { grid-template-columns: minmax(0, 1fr); }
  .v-raptor3d .r3-side { grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); align-items: start; }
}
@media (max-width: 600px) {
  .v-raptor3d .r3-viz { height: clamp(460px, 72vh, 620px); }
  .v-raptor3d .r3-controls { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  .v-raptor3d .r3-foot { right: 104px; }
  .v-raptor3d .r3-note { font-size: 9.5px; }
  .v-raptor3d .viz-toolbar .btn-ghost { background: var(--bg-2); border-color: var(--line-2); } /* the toolbar wraps over the model and its dimension lines */
  .v-raptor3d .r3-readout { display: none; } /* the in-scene dimension lines carry the same numbers on phones */
  .v-raptor3d .r3-co { font-size: 9.5px; padding: 3px 5px; }
  .v-raptor3d .r3-dl dd { font-size: 17px; }
}
`);

  /* ------------------------------------------------------------------ chamber contour (hot-gas wall), metres */

  const deg = (d) => (d * Math.PI) / 180;

  // Parabolic (Rao-style) bell from the throat down to the exit: [[r, y]] with y descending.
  function bell(rt, yT, re, yExit, thN, thE, n) {
    const L = yT - yExit, Rd = 0.382 * rt, pts = [];
    for (let i = 0; i <= 8; i++) { const a = (thN * i) / 8; pts.push([rt + Rd * (1 - Math.cos(a)), yT - Rd * Math.sin(a)]); }
    const xN = Rd * Math.sin(thN), rN = rt + Rd * (1 - Math.cos(thN));
    const m1 = Math.tan(thN), m2 = Math.tan(thE), c1 = rN - m1 * xN, c2 = re - m2 * L;
    const qx = (c2 - c1) / (m1 - m2), qr = m1 * qx + c1;
    for (let i = 1; i <= n; i++) {
      const t = i / n, u = 1 - t;
      pts.push([u * u * rN + 2 * u * t * qr + t * t * re, yT - (u * u * xN + 2 * u * t * qx + t * t * L)]);
    }
    return pts;
  }
  // Converging section and cylindrical chamber from the throat up to the injector face: [[r, y]] ascending.
  function convergent(rt, rc, yT, yInj, thc) {
    const Ru = 1.5 * rt, Rs = 0.07, pts = [];
    for (let i = 0; i <= 8; i++) { const a = (thc * i) / 8; pts.push([rt + Ru * (1 - Math.cos(a)), yT + Ru * Math.sin(a)]); }
    const [rA, yA] = pts[pts.length - 1];
    const rB = rc - Rs * (1 - Math.cos(thc));
    const yB = yA + (rB - rA) / Math.tan(thc), yS = yB + Rs * Math.sin(thc);
    for (let i = 0; i <= 8; i++) { const b = thc * (1 - i / 8); pts.push([rc - Rs * (1 - Math.cos(b)), yS - Rs * Math.sin(b)]); }
    pts.push([rc, (yS + yInj) / 2], [rc, yInj]);
    return pts;
  }
  const CONTOUR = bell(RT, G.yThroat, G.re - TWALL_N, G.yExit, deg(32), deg(6), 30).reverse()
    .concat(convergent(RT, G.rc, G.yThroat, G.yInj, deg(32)).slice(1));
  function rAt(cont, y) {
    if (y <= cont[0][1]) return cont[0][0];
    for (let i = 1; i < cont.length; i++) {
      if (y <= cont[i][1]) { const a = cont[i - 1], b = cont[i]; const t = (y - a[1]) / (b[1] - a[1] || 1); return a[0] + (b[0] - a[0]) * t; }
    }
    return cont[cont.length - 1][0];
  }
  const rHot = (y) => rAt(CONTOUR, y);
  // Raptor Vacuum bell: continues the chamber contour below the nozzle joint with a larger quadratic bell.
  const VCONT = (function () {
    const y0 = G.yJoint, r0 = rHot(y0), dy = 0.01;
    const s = (rHot(y0 - dy) - r0) / dy; // radius growth per metre going down
    const reIn = G.reV - 0.02, L = y0 - G.yVacExit, m2 = Math.tan(deg(7));
    const qx = (reIn - m2 * L - r0) / (s - m2), qr = r0 + s * qx;
    const pts = [];
    for (let i = 0; i <= 44; i++) { const t = i / 44, u = 1 - t; pts.push([u * u * r0 + 2 * u * t * qr + t * t * reIn, y0 - (2 * u * t * qx + t * t * L)]); }
    return pts.reverse();
  })();
  const rVac = (y) => rAt(VCONT, y);

  // Sample ys inside [y0, y1] from a contour, adding points so no step exceeds maxStep.
  function ysOf(cont, y0, y1, maxStep) {
    const ys = [y0];
    cont.forEach((p) => { if (p[1] > y0 + 1e-4 && p[1] < y1 - 1e-4) ys.push(p[1]); });
    ys.push(y1);
    ys.sort((a, b) => a - b);
    const out = [ys[0]];
    for (let i = 1; i < ys.length; i++) {
      const n = Math.max(1, Math.ceil((ys[i] - ys[i - 1]) / (maxStep || 0.05)));
      for (let k = 1; k <= n; k++) out.push(ys[i - 1] + ((ys[i] - ys[i - 1]) * k) / n);
    }
    return out;
  }
  // Closed wall band between radial offsets a and b from a contour function over [y0, y1].
  function band(rFn, cont, y0, y1, a, b, step) {
    const ys = ysOf(cont, y0, y1, step || 0.05);
    return ys.map((y) => [rFn(y) + b, y]).concat(ys.slice().reverse().map((y) => [rFn(y) + a, y]));
  }

  /* ------------------------------------------------------------------ three.js helpers (THREE is bound at init) */

  let THREE = null;

  // Lathe from a CLOSED profile. Orients it counter-clockwise in (r, y) so faces point out of the solid,
  // and doubles sharp corners so edges shade crisply. Section caps rely on the result being a closed solid.
  function solidLathe(profile, segs) {
    const pts = profile.map((p) => [Math.max(0, p[0]), p[1]]);
    let area = 0;
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; area += p[0] * q[1] - q[0] * p[1]; }
    if (area < 0) pts.reverse();
    const out = [], n = pts.length;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
      const ax = p1[0] - p0[0], ay = p1[1] - p0[1], bx = p2[0] - p1[0], by = p2[1] - p1[1];
      const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
      const c = la && lb ? (ax * bx + ay * by) / (la * lb) : 1;
      out.push(p1);
      if (i > 0 && c < 0.8) out.push(p1);
    }
    out.push(pts[0]);
    return new THREE.LatheGeometry(out.map((p) => new THREE.Vector2(p[0], p[1])), segs || 64);
  }
  const ringProfile = (r0, r1, y0, y1) => [[r0, y0], [r1, y0], [r1, y1], [r0, y1]];
  const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  function curveOf(points, tension) {
    return new THREE.CatmullRomCurve3(points.map(V), false, 'catmullrom', tension == null ? 0.35 : tension);
  }
  // Tube along a curve with a radius that varies with t (0..1). Same topology as TubeGeometry.
  function taperTube(curve, segs, radial, rFn, capEnds) {
    const frames = curve.computeFrenetFrames(segs, false);
    const pos = [], nor = [], uv = [], idx = [];
    const P = new THREE.Vector3(), N = new THREE.Vector3();
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      curve.getPointAt(t, P);
      const r = rFn(t);
      for (let j = 0; j <= radial; j++) {
        const v = (j / radial) * Math.PI * 2, s = Math.sin(v), c = -Math.cos(v);
        const fn = frames.normals[i], fb = frames.binormals[i];
        N.set(c * fn.x + s * fb.x, c * fn.y + s * fb.y, c * fn.z + s * fb.z).normalize();
        pos.push(P.x + r * N.x, P.y + r * N.y, P.z + r * N.z);
        nor.push(N.x, N.y, N.z);
        uv.push(t, j / radial);
      }
    }
    for (let i = 1; i <= segs; i++) {
      for (let j = 1; j <= radial; j++) {
        const a = (radial + 1) * (i - 1) + (j - 1), b = (radial + 1) * i + (j - 1), c = (radial + 1) * i + j, d = (radial + 1) * (i - 1) + j;
        idx.push(a, b, d, b, c, d);
      }
    }
    if (capEnds) {
      [0, segs].forEach((i) => {
        const t = i / segs;
        curve.getPointAt(t, P);
        const T = curve.getTangentAt(t).multiplyScalar(i ? 1 : -1);
        const ci = pos.length / 3;
        pos.push(P.x, P.y, P.z); nor.push(T.x, T.y, T.z); uv.push(t, 0.5);
        const base = (radial + 1) * i;
        for (let j = 0; j < radial; j++) { if (i) idx.push(ci, base + j, base + j + 1); else idx.push(ci, base + j + 1, base + j); }
      });
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    return g;
  }
  // One regen channel land (rib) following a contour: an annular sector between offsets a..b and angles +-half.
  function ribGeometry(rFn, cont, y0, y1, a, b, half) {
    const ys = ysOf(cont, y0, y1, 0.07);
    const pos = [];
    const P = (r, phi, y) => [r * Math.sin(phi), y, r * Math.cos(phi)];
    const quad = (p, q, r, s) => { pos.push(...p, ...q, ...r, ...p, ...r, ...s); };
    for (let k = 0; k < ys.length - 1; k++) {
      const y = ys[k], y2 = ys[k + 1];
      const i0 = rFn(y) + a, o0 = rFn(y) + b, i1 = rFn(y2) + a, o1 = rFn(y2) + b;
      quad(P(o0, -half, y), P(o0, half, y), P(o1, half, y2), P(o1, -half, y2));
      quad(P(i0, half, y), P(i0, -half, y), P(i1, -half, y2), P(i1, half, y2));
      quad(P(i0, -half, y), P(o0, -half, y), P(o1, -half, y2), P(i1, -half, y2));
      quad(P(o0, half, y), P(i0, half, y), P(i1, half, y2), P(o1, half, y2));
    }
    const e0 = ys[0], e1 = ys[ys.length - 1];
    quad(P(rFn(e0) + a, -half, e0), P(rFn(e0) + a, half, e0), P(rFn(e0) + b, half, e0), P(rFn(e0) + b, -half, e0));
    quad(P(rFn(e1) + b, -half, e1), P(rFn(e1) + b, half, e1), P(rFn(e1) + a, half, e1), P(rFn(e1) + a, -half, e1));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }
  // Helical inducer blades (zero thickness, rendered double-sided).
  function inducerGeometry(rh, rt, yTop, h, wrap, blades) {
    const nT = 28, nR = 3, pos = [], idx = [];
    for (let b = 0; b < blades; b++) {
      const base = pos.length / 3, th0 = (b / blades) * Math.PI * 2;
      for (let i = 0; i <= nT; i++) {
        const th = th0 + (wrap * i) / nT, y = yTop - (h * i) / nT;
        for (let j = 0; j <= nR; j++) { const r = rh + ((rt - rh) * j) / nR; pos.push(r * Math.sin(th), y, r * Math.cos(th)); }
      }
      for (let i = 0; i < nT; i++) for (let j = 0; j < nR; j++) {
        const a = base + i * (nR + 1) + j, c = a + nR + 1;
        idx.push(a, c, a + 1, a + 1, c, c + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Backswept centrifugal impeller vane, extruded upward from y0 by h.
  function vaneGeometry(r0, r1, sweep, thick, y0, h) {
    const s = new THREE.Shape(), n = 10, side = [];
    for (let i = 0; i <= n; i++) { const r = r0 + ((r1 - r0) * i) / n; side.push([r, sweep * Math.pow(i / n, 1.3)]); }
    side.forEach(([r, th], i) => { const a = th - thick / 2 / r; if (i) s.lineTo(r * Math.sin(a), r * Math.cos(a)); else s.moveTo(r * Math.sin(a), r * Math.cos(a)); });
    side.slice().reverse().forEach(([r, th]) => { const a = th + thick / 2 / r; s.lineTo(r * Math.sin(a), r * Math.cos(a)); });
    const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 2 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, y0, 0);
    return g;
  }
  // Cylinder between two points.
  function strutGeometry(a, b, r, radial) {
    const A = V(a), B = V(b), len = A.distanceTo(B);
    const g = new THREE.CylinderGeometry(r, r, len, radial || 12, 1, false);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()));
    g.translate((A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2);
    return g;
  }

  /* ------------------------------------------------------------------ procedural textures */

  function canvasTex(w, h, draw, repeat) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (repeat) t.repeat.set(repeat[0], repeat[1]);
    t.anisotropy = 4;
    return t;
  }
  let TEX = null;
  function makeTextures() {
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    TEX = {
      // circumferential turning marks: roughness varies along the profile (v), constant around (u)
      brush: canvasTex(4, 256, (g, w, h) => {
        for (let y = 0; y < h; y++) { const v = Math.round(84 + rnd() * 46 + (rnd() < 0.08 ? 40 : 0)); g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.fillRect(0, y, w, 1); }
      }, [1, 3]),
      // regen channel ribs on the outside of the nozzle: one soft ridge per channel around u
      ribs: canvasTex(32, 4, (g, w, h) => {
        for (let x = 0; x < w; x++) { const v = Math.round(70 + 150 * Math.pow(Math.sin((x / w) * Math.PI), 0.7)); g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.fillRect(x, 0, 1, h); }
      }, [96, 1]),
      // flow dashes: chevrons pointing along +u
      dash: canvasTex(128, 32, (g, w, h) => {
        g.fillStyle = 'rgba(255,255,255,0.3)'; g.fillRect(0, 0, w, h);
        g.fillStyle = 'rgba(255,255,255,1)';
        g.beginPath(); g.moveTo(30, 0); g.lineTo(76, 0); g.lineTo(100, h / 2); g.lineTo(76, h); g.lineTo(30, h); g.lineTo(54, h / 2); g.closePath(); g.fill();
      }),
      // combustion glow: bright core fading along the profile
      glow: canvasTex(4, 64, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, 0, h);
        gr.addColorStop(0, 'rgba(255,255,255,0.2)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.75)'); gr.addColorStop(1, 'rgba(255,255,255,0.15)');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
      }),
      shadow: canvasTex(128, 128, (g, w, h) => {
        const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        gr.addColorStop(0, 'rgba(0,0,0,0.7)'); gr.addColorStop(0.45, 'rgba(0,0,0,0.32)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
      }),
    };
    TEX.shadow.wrapS = TEX.shadow.wrapT = THREE.ClampToEdgeWrapping;
  }

  /* ------------------------------------------------------------------ materials (colors from CSS variables) */

  let COL = null;
  function readColors() {
    // CSS colors are sRGB; the renderer works in linear light with sRGB output, so convert once here.
    const c = (v) => new THREE.Color(SX.color(v) || '#888888').convertSRGBToLinear();
    COL = {
      steel: c('--steel'), steel2: c('--steel-2'), copper: c('--copper'), bg: c('--bg'), bg3: c('--bg-3'), bg4: c('--bg-4'), line: c('--line'), line2: c('--line-2'),
      fg: c('--fg'), muted: c('--muted'), accent: c('--accent'), lox: c('--lox'), ch4: c('--ch4'), oxgas: c('--oxgas'), fuelgas: c('--fuelgas'), mix: c('--mix'),
    };
    COL.steelM = COL.steel.clone().lerp(COL.steel2, 0.4);
    COL.alloy = COL.steel2.clone().multiplyScalar(0.6);
    COL.dark = COL.steel2.clone().multiplyScalar(0.2).lerp(COL.copper, 0.06);
    COL.darkIn = COL.steel2.clone().multiplyScalar(0.16).lerp(COL.copper, 0.12);
    COL.black = COL.bg4.clone().multiplyScalar(0.9);
    COL.copperDark = COL.copper.clone().multiplyScalar(0.32);
  }
  const PRESET = {
    steel: { col: 'steelM', metalness: 0.9, roughness: 1.05, rmap: true, env: 0.75 },
    bright: { col: 'steel', metalness: 1, roughness: 0.2, env: 1.15 },
    alloy: { col: 'alloy', metalness: 0.85, roughness: 1.2, rmap: true, env: 0.9 },
    dark: { col: 'dark', metalness: 0.8, roughness: 0.5, bump: true, env: 0.85 },
    darkIn: { col: 'darkIn', metalness: 0.6, roughness: 0.62, env: 0.6 },
    copper: { col: 'copper', metalness: 1, roughness: 0.4, env: 0.8 },
    copperDark: { col: 'copperDark', metalness: 0.9, roughness: 0.55, env: 0.5 },
    black: { col: 'black', metalness: 0.35, roughness: 0.62, env: 0.5 },
  };
  function newMat(kind, part, opts) {
    const p = PRESET[kind];
    const m = new THREE.MeshStandardMaterial({
      color: COL[p.col].clone(), metalness: p.metalness, roughness: p.roughness, envMapIntensity: p.env,
      side: opts && opts.double ? THREE.DoubleSide : THREE.FrontSide,
    });
    if (p.rmap) m.roughnessMap = TEX.brush;
    if (p.bump) { m.bumpMap = TEX.ribs; m.bumpScale = 0.012; }
    m.userData.part = part;
    m.userData.xray = !!(opts && opts.xray);
    m.userData.xrayOp = (opts && opts.xop) || 0.15;
    return m;
  }
  function capMaterial(col, plane, hatch) {
    const m = new THREE.MeshBasicMaterial({ color: col, side: THREE.BackSide, clippingPlanes: [plane], toneMapped: false });
    if (hatch) {
      m.onBeforeCompile = (sh) => {
        sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>',
          '#include <dithering_fragment>\n  if (mod(gl_FragCoord.x + gl_FragCoord.y, 9.0) < 1.3) gl_FragColor.rgb *= ' + hatch.toFixed(2) + ';');
      };
      m.customProgramCacheKey = () => 'r3hatch' + hatch;
    }
    return m;
  }

  /* ------------------------------------------------------------------ derived layout (model units) */

  const RIBS = 48; // regen channel lands drawn (schematic; the real count is not published)
  const R_MAN = rHot(G.yMan) + TWALL_N + 0.03;                 // regen inlet manifold ring radius
  const R_OUT = rHot(G.yOut) + G.tHot + G.gapC + G.tJc + 0.012; // regen outlet ring radius
  const PIPE_PTS = [
    [G.xF + 0.152, 2.43, 0.07], [G.xF + 0.165, 2.47, 0.16], [0.56, 2.62, 0.25], [0.42, 2.77, 0.315], [0.14, 2.835, 0.35],
    [-0.2, 2.8, 0.32], [-0.46, 2.64, 0.2], [-0.56, 2.34, 0.06], [-0.56, 1.98, 0], [-0.48, 1.58, 0], [-(R_MAN + 0.075), 1.3, 0], [-R_MAN, G.yMan + 0.03, 0],
  ];
  const FUEL_DUCT = [[G.xF - 0.106, 2.16, 0.106], [0.285, 2.14, 0.175], [0.25, 2.085, 0.235], [0.233, 2.057, 0.233]];
  const OX_DUCT = [[0, 2.27, 0.2], [0, 2.252, 0.272], [0, 2.17, 0.305], [0, 2.085, 0.282], [0, 2.035, 0.21]];
  const GOX_LINE = [[-0.3, 2.31, 0], [-0.3, 2.4, -0.05], [-0.31, 2.6, -0.1], [-0.27, 2.8, -0.1], [-0.25, 2.875, -0.1]];
  const a290 = deg(290);
  const GCH4_LINE = [[R_OUT * Math.sin(a290), G.yOut, R_OUT * Math.cos(a290)], [-0.36, 1.93, 0.11], [-0.49, 2.05, 0.13], [-0.44, 2.4, 0.11], [-0.37, 2.75, 0.09], [-0.34, 2.875, 0.08]];
  function scrollPoints() {
    const pts = [], n = 28, a0 = -1.75 * Math.PI;
    for (let i = 0; i <= n; i++) { const s = i / n, a = a0 * (1 - s), R = 0.112 + 0.034 * s; pts.push([R * Math.cos(a), 2.43, R * Math.sin(a)]); }
    pts.push([0.149, 2.43, 0.035], [0.152, 2.43, 0.07]);
    return pts;
  }
  // Callout anchors (root-local, explode 0) and detail-mode label anchors (r, y around a pump or chamber axis).
  const ANCH = {
    'raptor3.gimbal': [0, 2.79, 0.235], 'raptor3.loxInlet': [0.11, 2.87, 0.11], 'raptor3.ch4Inlet': [G.xF + 0.075, 2.66, 0.075],
    'raptor3.otp': [0.12, 2.6, 0.2], 'raptor3.ftp': [G.xF + 0.14, 2.45, 0.1], 'raptor3.opb': [0.09, 2.14, 0.07],
    'raptor3.fpb': [G.xF + 0.06, 1.66, 0.075], 'raptor3.oxDuct': [0, 2.17, 0.345], 'raptor3.fuelDuct': [0.27, 2.12, 0.2],
    'raptor3.injector': [-0.33, 2.03, 0.32], 'raptor3.mcc': [0.17, 1.72, 0.17], 'raptor3.regen': [-0.6, 2.1, 0.02],
    'raptor3.nozzle': null, 'raptor3.rvac': null, 'raptor3.igniters': null, 'raptor3.controller': null, 'raptor3.press': [-0.34, 2.28, 0.04],
  };
  const DETAIL = {
    otp: { parts: ['raptor3.otp'], axis: [0, 0], title: 'Oxygen turbopump, cut open', labels: [
      ['Inducer', 'raptor3.otp.pump', 0.06, 2.7], ['Impeller', 'raptor3.otp.pump', 0.12, 2.515], ['Volute casing', 'raptor3.otp.pump', 0.24, 2.575],
      ['Shaft', 'raptor3.otp.shaft', 0.012, 2.33], ['Bearings', 'raptor3.otp.shaft', 0.05, 2.405], ['Turbine rotor', 'raptor3.otp.turbine', 0.16, 2.278],
      ['Stator vanes', 'raptor3.otp.turbine', 0.16, 2.236], ['Exhaust collector', 'raptor3.otp.turbine', 0.265, 2.26],
    ] },
    ftp: { parts: ['raptor3.ftp'], axis: [G.xF, 0], title: 'Fuel turbopump, cut open', labels: [
      ['Inducer', 'raptor3.ftp.pump', 0.035, 2.52], ['Impeller', 'raptor3.ftp.pump', 0.065, 2.405], ['Scroll volute', 'raptor3.ftp.pump', 0.135, 2.43],
      ['Shaft', 'raptor3.ftp.shaft', 0.009, 2.2], ['Bearings', 'raptor3.ftp.shaft', 0.03, 2.3], ['Turbine rotor', 'raptor3.ftp.turbine', 0.106, 2.182],
      ['Stator vanes', 'raptor3.ftp.turbine', 0.106, 2.148], ['Exhaust collector', 'raptor3.ftp.turbine', 0.17, 2.16],
    ] },
    mcc: { parts: ['raptor3.injector', 'raptor3.mcc', 'raptor3.regen'], axis: [0, 0], title: 'Main chamber, cut open', labels: [
      ['Injector face', 'raptor3.injector', 0.06, G.yInj], ['Injector elements', 'raptor3.injector', 0.144, 1.94], ['Ox-gas dome', 'raptor3.injector', 0.12, 2.03],
      ['Fuel-gas manifold', 'raptor3.injector', 0.33, 2.057], ['Copper liner', 'raptor3.mcc', G.rc + 0.003, 1.62], ['Coolant channels', 'raptor3.regen', G.rc + G.tHot + G.gapC / 2, 1.75],
      ['Structural jacket', 'raptor3.mcc', G.rc + 0.035, 1.84], ['Throat', 'raptor3.mcc', RT, G.yThroat], ['Regen outlet ring', 'raptor3.regen', R_OUT, G.yOut],
    ] },
  };

  /* ------------------------------------------------------------------ model build */

  function buildModel(plane) {
    const root = new THREE.Group();
    root.name = 'raptor3-root';
    root.scale.set(SR, SY, SR);
    const matCache = {}, mats = [], glows = [], caps = [], managed = [], groups = {}, explode = [], anchors = {}, solids = [];
    const capMats = {
      steel: capMaterial(COL.steel2.clone().lerp(COL.steel, 0.3), plane, 0.72),
      copper: capMaterial(COL.copper.clone().lerp(COL.fg, 0.08), plane, 0.8),
    };

    function mat(part, kind, o) {
      const key = part + '|' + kind + '|' + (o && o.xray ? 'x' + (o.xop || '') : '') + (o && o.double ? 'd' : '');
      if (!matCache[key]) { const m = newMat(kind, part, o); m.clippingPlanes = [plane]; matCache[key] = m; mats.push(m); }
      return matCache[key];
    }
    function glowMat(part, col) {
      const m = new THREE.MeshBasicMaterial({ color: col, map: TEX.glow, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending, clippingPlanes: [plane], toneMapped: false, side: THREE.DoubleSide });
      m.userData.part = part; m.userData.glow = true;
      glows.push(m);
      return m;
    }
    function group(id, parent) { const g = new THREE.Group(); g.name = id; SX.three.tag(g, id); (parent || root).add(g); groups[id] = g; return g; }
    function add(parent, geo, material, cap, fn) {
      const m = new THREE.Mesh(geo, material);
      if (fn) fn(m);
      parent.add(m);
      let c = null;
      if (cap) {
        c = new THREE.Mesh(geo, capMats[cap]);
        c.position.copy(m.position); c.quaternion.copy(m.quaternion); c.scale.copy(m.scale);
        c.visible = false; c.userData.cap = true;
        parent.add(c); caps.push({ mesh: c, part: material.userData.part });
      }
      solids.push({ mesh: m, cap: c, part: material.userData.part });
      return m;
    }
    function inst(parent, geo, material, cap, matrices) {
      const im = new THREE.InstancedMesh(geo, material, matrices.length);
      matrices.forEach((mx, i) => im.setMatrixAt(i, mx));
      parent.add(im);
      let c = null;
      if (cap) {
        c = new THREE.InstancedMesh(geo, capMats[cap], matrices.length);
        matrices.forEach((mx, i) => c.setMatrixAt(i, mx));
        c.visible = false; c.userData.cap = true;
        parent.add(c); caps.push({ mesh: c, part: material.userData.part });
      }
      solids.push({ mesh: im, cap: c, part: material.userData.part });
      return im;
    }
    const ring = (n, fn) => Array.from({ length: n }, (_, i) => fn(i, (i / n) * Math.PI * 2));
    const rotY = (a) => new THREE.Matrix4().makeRotationY(a);
    const tr = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
    const rotZ = (a) => new THREE.Matrix4().makeRotationZ(a);
    const rotX = (a) => new THREE.Matrix4().makeRotationX(a);
    function boltRing(parent, cx, cz, y, r, n, material, size) {
      const s = size || 0.009, geo = new THREE.CylinderGeometry(s, s, s * 1.3, 6);
      inst(parent, geo, material, null, ring(n, (i, a) => tr(cx + r * Math.sin(a), y, cz + r * Math.cos(a))));
    }
    function torus(R, r, y, radial, tubular) { const g = new THREE.TorusGeometry(R, r, radial || 14, tubular || 72); g.rotateX(Math.PI / 2); g.translate(0, y, 0); return g; }
    const tube = (pts, r, segs, tension) => taperTube(curveOf(pts, tension), segs || 64, 14, () => r, false);
    function exp(obj, v) { explode.push({ obj, vec: new THREE.Vector3(v[0], v[1], v[2]) }); }
    function anchor(id, obj, p) { anchors[id] = { obj, p: new THREE.Vector3(p[0], p[1], p[2]) }; }
    const onAxis = (g) => { const o = new THREE.Group(); o.position.x = G.xF; g.add(o); return o; };

    /* ---- sea-level nozzle: hot wall + channel gap + outer jacket, lip ring and stiffener hoops */
    const gNoz = group('raptor3.nozzle');
    gNoz.userData.variant = 'sl';
    {
      const out = mat('raptor3.nozzle', 'dark', { xray: true }), inn = mat('raptor3.nozzle', 'darkIn', { xray: true });
      add(gNoz, solidLathe(band(rHot, CONTOUR, G.yExit, G.yJoint, 0, G.tHot, 0.08), 84), inn, 'steel');
      add(gNoz, solidLathe(band(rHot, CONTOUR, G.yExit, G.yJoint, G.tHot + G.gapN, TWALL_N, 0.08), 84), out, 'steel');
      const r0 = rHot(G.yExit);
      add(gNoz, solidLathe([[r0 - 0.002, -0.006], [r0 + TWALL_N + 0.008, -0.006], [r0 + TWALL_N + 0.008, 0.018], [r0 - 0.002, 0.018]], 84), out, 'steel');
      [0.42, 0.84].forEach((y) => add(gNoz, torus(rHot(y) + TWALL_N + 0.002, 0.008, y, 6, 84), out));
      add(gNoz, torus(rHot(G.yJoint) + TWALL_N + 0.001, 0.007, G.yJoint - 0.012, 8, 72), out);
      const a = deg(40), y = 0.62;
      anchor('raptor3.nozzle', gNoz, [(rHot(y) + TWALL_N) * Math.sin(a), y, (rHot(y) + TWALL_N) * Math.cos(a)]);
    }
    exp(gNoz, [0, -0.9, 0]);

    /* ---- Raptor Vacuum 3 nozzle (same chamber, larger bell) */
    const gVac = group('raptor3.rvac');
    gVac.userData.variant = 'rvac';
    {
      const out = mat('raptor3.rvac', 'dark', { xray: true });
      add(gVac, solidLathe(band(rVac, VCONT, G.yVacExit, G.yJoint, 0, 0.02, 0.1), 112), out, 'steel');
      const r0 = rVac(G.yVacExit);
      add(gVac, solidLathe([[r0 - 0.003, G.yVacExit - 0.01], [r0 + 0.032, G.yVacExit - 0.01], [r0 + 0.032, G.yVacExit + 0.022], [r0 - 0.003, G.yVacExit + 0.022]], 112), out, 'steel');
      [0.6, 0.0, -0.7].forEach((y) => add(gVac, torus(rVac(y) + 0.022, 0.012, y, 6, 112), out));
      add(gVac, torus(rVac(G.yJoint) + 0.02, 0.007, G.yJoint - 0.012, 8, 72), out);
      const a = deg(40), y = -0.35;
      anchor('raptor3.rvac', gVac, [(rVac(y) + 0.02) * Math.sin(a), y, (rVac(y) + 0.02) * Math.cos(a)]);
    }
    exp(gVac, [0, -0.9, 0]);

    /* ---- main combustion chamber: copper liner (hot wall with channels) inside a superalloy jacket */
    const gMcc = group('raptor3.mcc');
    {
      add(gMcc, solidLathe(band(rHot, CONTOUR, G.yJoint, G.yInj, 0, G.tHot, 0.04), 80), mat('raptor3.mcc', 'copper', { xray: true }), 'copper');
      add(gMcc, solidLathe(band(rHot, CONTOUR, G.yJoint, G.yInj, G.tHot + G.gapC, G.tHot + G.gapC + G.tJc, 0.04), 80), mat('raptor3.mcc', 'alloy', { xray: true }), 'steel');
      anchor('raptor3.mcc', gMcc, ANCH['raptor3.mcc']);
    }
    exp(gMcc, [0, -0.4, 0]);

    /* ---- regenerative cooling: channel lands (ribs), inlet manifold + supply pipe, outlet ring */
    const gReg = group('raptor3.regen');
    {
      const half = (Math.PI / RIBS) * 0.42, R72 = ring(RIBS, (i, a) => rotY(a + Math.PI / RIBS));
      const nr = new THREE.Group(); gReg.add(nr);
      inst(nr, ribGeometry(rHot, CONTOUR, G.yExit + 0.012, G.yJoint, G.tHot, G.tHot + G.gapN, half), mat('raptor3.regen', 'alloy', { xray: true, xop: 0.28 }), 'steel', R72);
      managed.push({ obj: nr, kind: 'rib', variant: 'sl', sub: 'nozzleRibs' });
      exp(nr, [0, -0.9, 0]);
      const cr = new THREE.Group(); gReg.add(cr);
      inst(cr, ribGeometry(rHot, CONTOUR, G.yJoint, G.yInj - 0.004, G.tHot, G.tHot + G.gapC, half), mat('raptor3.regen', 'copperDark', { xray: true, xop: 0.5 }), 'copper', R72);
      managed.push({ obj: cr, kind: 'rib', sub: 'chamberRibs' });
      exp(cr, [0, -0.4, 0]);
      const outG = new THREE.Group(); gReg.add(outG);
      add(outG, torus(R_OUT, 0.02, G.yOut, 10, 80), mat('raptor3.regen', 'alloy', { xray: true }), 'steel');
      managed.push({ obj: outG, kind: 'sub', sub: 'outlet' });
      exp(outG, [0, -0.4, 0]);
      const sup = new THREE.Group(); gReg.add(sup);
      const st = mat('raptor3.regen', 'steel', { xray: true, double: true });
      add(sup, torus(R_MAN, 0.036, G.yMan, 14, 112), mat('raptor3.regen', 'alloy', { xray: true }), 'steel');
      add(sup, tube(PIPE_PTS, 0.045, 180, 0.45), st);
      // bolted flange where the pipe leaves the fuel pump volute (one of the few flanges left on the high-pressure side)
      const f = new THREE.Group(); f.position.fromArray(PIPE_PTS[0]); f.rotation.x = Math.PI / 2; sup.add(f);
      add(f, solidLathe(ringProfile(0.045, 0.078, -0.012, 0.012), 36), mat('raptor3.regen', 'steel'), 'steel');
      boltRing(f, 0, 0, 0.015, 0.066, 8, mat('raptor3.regen', 'bright'), 0.0065);
      // support saddle clamping the pipe to the manifold
      add(sup, strutGeometry([-(R_MAN + 0.075), 1.3, 0], [-(R_MAN + 0.02), 1.2, 0], 0.03, 12), mat('raptor3.regen', 'alloy', { xray: true }), 'steel');
      managed.push({ obj: sup, kind: 'sub', sub: 'supply' });
      exp(sup, [-0.62, -0.32, 0.05]);
      anchor('raptor3.regen', sup, ANCH['raptor3.regen']);
    }

    /* ---- main injector: face plate with elements, body ring, ox-gas dome, flat deck, fuel-gas manifold */
    const gInj = group('raptor3.injector');
    {
      const al = mat('raptor3.injector', 'alloy', { xray: true }), st = mat('raptor3.injector', 'steel', { xray: true });
      add(gInj, solidLathe([[0, G.yInj], [G.rc, G.yInj], [G.rc, G.yInj + 0.012], [0, G.yInj + 0.012]], 72), mat('raptor3.injector', 'alloy'), 'steel');
      add(gInj, solidLathe([[G.rc, G.yInj], [0.255, G.yInj], [0.262, 1.935], [0.262, G.yDeck0], [G.rc, G.yDeck0]], 80), al, 'steel');
      add(gInj, solidLathe([[0, G.yDeck0], [0.236, G.yDeck0], [0.236, 2.016], [0.205, 2.046], [0.12, 2.058], [0, 2.061]], 80), al, 'steel');
      add(gInj, solidLathe([[0.236, G.yDeck0], [0.44, G.yDeck0], [0.46, 1.99], [0.46, 2.015], [0.44, G.yDeck1], [0.236, G.yDeck1]], 96), st, 'steel');
      add(gInj, torus(0.33, 0.028, 2.058, 12, 96), al, 'steel');
      const els = [];
      [[0, 1], [0.036, 6], [0.072, 12], [0.108, 18], [0.144, 24], [0.172, 30]].forEach(([r, n], k) => {
        for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + (k % 2 ? Math.PI / n : 0); els.push(tr(r * Math.sin(a), 0, r * Math.cos(a))); }
      });
      const h = G.yDeck0 - G.yInj - 0.012;
      const sleeve = new THREE.CylinderGeometry(0.0095, 0.0095, h, 10, 1, true); sleeve.translate(0, G.yInj + 0.012 + h / 2, 0);
      const post = new THREE.CylinderGeometry(0.0042, 0.0042, h + 0.013, 8); post.translate(0, G.yInj + (h + 0.013) / 2 - 0.0005, 0);
      const face = new THREE.RingGeometry(0.0046, 0.0095, 14); face.rotateX(Math.PI / 2); face.translate(0, G.yInj - 0.0008, 0);
      const bright = mat('raptor3.injector', 'bright', { double: true });
      inst(gInj, sleeve, bright, null, els);
      inst(gInj, post, mat('raptor3.injector', 'bright'), 'steel', els);
      inst(gInj, face, mat('raptor3.injector', 'darkIn', { double: true }), null, els);
      anchor('raptor3.injector', gInj, ANCH['raptor3.injector']);
    }

    /* ---- oxygen-rich preburner (centerline, below the oxygen turbine) */
    const gOpb = group('raptor3.opb');
    {
      add(gOpb, solidLathe([[0, 2.055], [0.095, 2.055], [0.116, 2.07], [0.116, 2.176], [0.096, 2.19], [0.05, 2.19], [0.05, 2.178], [0.1, 2.172], [0.1, 2.075], [0.086, 2.068], [0, 2.068]], 64), mat('raptor3.opb', 'alloy', { xray: true }), 'steel');
      const zg = new THREE.Group(); gOpb.add(zg);
      add(zg, solidLathe([[0, 2.072], [0.08, 2.078], [0.09, 2.12], [0.07, 2.165], [0.042, 2.185], [0, 2.188]], 40), glowMat('raptor3.opb', COL.oxgas));
      managed.push({ obj: zg, kind: 'zone' });
      anchor('raptor3.opb', gOpb, ANCH['raptor3.opb']);
    }
    exp(gOpb, [0, 0.2, 0]);

    /* ---- oxygen turbopump: pump (inducer, impeller, volute) over turbine, one shaft */
    const gOtp = group('raptor3.otp');
    const gOp = group('raptor3.otp.pump', gOtp), gOt = group('raptor3.otp.turbine', gOtp), gOs = group('raptor3.otp.shaft', gOtp);
    {
      const hx = mat('raptor3.otp.pump', 'alloy', { xray: true }), br = mat('raptor3.otp.pump', 'bright');
      add(gOp, solidLathe([[0.09, 2.448], [0.2, 2.468], [0.236, 2.495], [0.247, 2.54], [0.233, 2.585], [0.17, 2.625], [0.13, 2.65], [0.118, 2.672], [0.118, 2.726],
        [0.1, 2.726], [0.1, 2.668], [0.112, 2.648], [0.155, 2.622], [0.218, 2.585], [0.231, 2.54], [0.221, 2.503], [0.19, 2.482], [0.09, 2.464]], 72), hx, 'steel');
      add(gOp, solidLathe([[0, 2.47], [0.15, 2.476], [0.15, 2.486], [0.08, 2.497], [0.045, 2.52], [0.034, 2.565], [0, 2.565]], 64), br, 'steel');
      inst(gOp, vaneGeometry(0.046, 0.148, 0.8, 0.0055, 2.486, 0.042), br, 'steel', ring(8, (i, a) => rotY(a)));
      add(gOp, solidLathe([[0, 2.6], [0.028, 2.61], [0.028, 2.73], [0.016, 2.745], [0, 2.75]], 32), br, 'steel');
      add(gOp, inducerGeometry(0.027, 0.094, 2.735, 0.1, deg(250), 3), mat('raptor3.otp.pump', 'bright', { double: true }));

      const th = mat('raptor3.otp.turbine', 'alloy', { xray: true }), tb = mat('raptor3.otp.turbine', 'bright'), ta = mat('raptor3.otp.turbine', 'alloy');
      add(gOt, solidLathe([[0.09, 2.372], [0.18, 2.357], [0.205, 2.332], [0.21, 2.29], [0.21, 2.21], [0.19, 2.19], [0.116, 2.19], [0.116, 2.203], [0.185, 2.206], [0.196, 2.216], [0.196, 2.33], [0.176, 2.344], [0.09, 2.358]], 72), th, 'steel');
      add(gOt, torus(0.236, 0.04, 2.26, 14, 80), th, 'steel');
      add(gOt, solidLathe([[0, 2.262], [0.14, 2.268], [0.14, 2.282], [0, 2.288]], 64), tb, 'steel');
      inst(gOt, new THREE.BoxGeometry(0.005, 0.026, 0.034), tb, 'steel', ring(44, (i, a) => rotY(a).multiply(tr(0, 2.275, 0.157)).multiply(rotZ(deg(28)))));
      inst(gOt, new THREE.BoxGeometry(0.005, 0.022, 0.034), ta, 'steel', ring(30, (i, a) => rotY(a).multiply(tr(0, 2.236, 0.157)).multiply(rotZ(deg(-32)))));

      const sb = mat('raptor3.otp.shaft', 'bright'), sh = mat('raptor3.otp.shaft', 'alloy', { xray: true }), ss = mat('raptor3.otp.shaft', 'steel');
      add(gOs, solidLathe([[0, 2.21], [0.024, 2.21], [0.024, 2.742], [0, 2.742]], 24), sb, 'steel');
      add(gOs, solidLathe([[0.072, 2.355], [0.09, 2.355], [0.09, 2.452], [0.072, 2.452]], 56), sh, 'steel');
      [[2.378, 2.395], [2.412, 2.429]].forEach(([a, b]) => add(gOs, solidLathe(ringProfile(0.024, 0.072, a, b), 40), ss, 'steel'));
      anchor('raptor3.otp', gOtp, ANCH['raptor3.otp']);
    }
    exp(gOtp, [0, 0.45, 0]);

    /* ---- fuel turbopump (+x): scroll volute pump over the fuel-rich turbine */
    const gFtp = group('raptor3.ftp');
    const gFp = group('raptor3.ftp.pump', gFtp), gFt = group('raptor3.ftp.turbine', gFtp), gFs = group('raptor3.ftp.shaft', gFtp);
    {
      const P = onAxis(gFp), hx = mat('raptor3.ftp.pump', 'alloy', { xray: true }), br = mat('raptor3.ftp.pump', 'bright');
      add(P, solidLathe([[0.05, 2.345], [0.1, 2.35], [0.11, 2.4], [0.108, 2.47], [0.08, 2.515], [0.07, 2.558], [0.056, 2.558], [0.058, 2.52], [0.092, 2.47], [0.094, 2.4], [0.086, 2.362], [0.05, 2.36]], 64), hx, 'steel');
      add(P, taperTube(curveOf(scrollPoints(), 0.5), 140, 18, (t) => 0.022 + 0.034 * Math.min(1, t / 0.86), true), hx, 'steel');
      add(P, solidLathe([[0, 2.378], [0.085, 2.382], [0.085, 2.39], [0.046, 2.401], [0.028, 2.43], [0, 2.43]], 48), br, 'steel');
      inst(P, vaneGeometry(0.03, 0.083, 0.75, 0.0045, 2.39, 0.03), br, 'steel', ring(7, (i, a) => rotY(a)));
      add(P, solidLathe([[0, 2.45], [0.018, 2.46], [0.018, 2.555], [0.01, 2.565], [0, 2.568]], 24), br, 'steel');
      add(P, inducerGeometry(0.018, 0.052, 2.555, 0.085, deg(250), 3), mat('raptor3.ftp.pump', 'bright', { double: true }));

      const T = onAxis(gFt), th = mat('raptor3.ftp.turbine', 'alloy', { xray: true }), tb = mat('raptor3.ftp.turbine', 'bright'), ta = mat('raptor3.ftp.turbine', 'alloy');
      add(T, solidLathe([[0.06, 2.262], [0.12, 2.25], [0.135, 2.225], [0.135, 2.13], [0.12, 2.105], [0.078, 2.1], [0.078, 2.112], [0.112, 2.117], [0.121, 2.13], [0.121, 2.225], [0.11, 2.238], [0.06, 2.25]], 64), th, 'steel');
      add(T, torus(0.15, 0.03, 2.16, 12, 64), th, 'steel');
      add(T, solidLathe([[0, 2.172], [0.094, 2.176], [0.094, 2.188], [0, 2.192]], 48), tb, 'steel');
      inst(T, new THREE.BoxGeometry(0.004, 0.02, 0.022), tb, 'steel', ring(34, (i, a) => rotY(a).multiply(tr(0, 2.182, 0.106)).multiply(rotZ(deg(26)))));
      inst(T, new THREE.BoxGeometry(0.004, 0.018, 0.022), ta, 'steel', ring(24, (i, a) => rotY(a).multiply(tr(0, 2.148, 0.106)).multiply(rotZ(deg(-30)))));

      const S = onAxis(gFs), sb = mat('raptor3.ftp.shaft', 'bright'), sh = mat('raptor3.ftp.shaft', 'alloy', { xray: true }), ss = mat('raptor3.ftp.shaft', 'steel');
      add(S, solidLathe([[0, 2.125], [0.017, 2.125], [0.017, 2.56], [0, 2.56]], 20), sb, 'steel');
      add(S, solidLathe([[0.045, 2.25], [0.06, 2.25], [0.06, 2.35], [0.045, 2.35]], 40), sh, 'steel');
      [[2.268, 2.281], [2.318, 2.331]].forEach(([a, b]) => add(S, solidLathe(ringProfile(0.017, 0.045, a, b), 32), ss, 'steel'));
      anchor('raptor3.ftp', gFtp, ANCH['raptor3.ftp']);
    }
    exp(gFtp, [0.62, 0.45, 0]);

    /* ---- fuel-rich preburner: ribbed body hanging below the deck under the fuel pump */
    const gFpb = group('raptor3.fpb');
    {
      const F = onAxis(gFpb), prof = [[0, 1.36]];
      for (let i = 1; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); prof.push([0.085 * Math.sin(a), 1.445 - 0.085 * Math.cos(a)]); }
      for (let k = 0; k < 7; k++) { const y = 1.49 + k * 0.066; prof.push([0.085, y - 0.014], [0.097, y - 0.007], [0.097, y + 0.007], [0.085, y + 0.014]); }
      prof.push([0.085, 1.975], [0.075, 1.99], [0.075, 2.1], [0.06, 2.1], [0.06, 1.985], [0.07, 1.97], [0.07, 1.45]);
      for (let i = 5; i >= 0; i--) { const a = (i / 6) * (Math.PI / 2); prof.push([0.07 * Math.sin(a), 1.447 - 0.07 * Math.cos(a)]); }
      add(F, solidLathe(prof, 56), mat('raptor3.fpb', 'alloy', { xray: true }), 'steel');
      const b = deg(52), rP = 0.085 * Math.sin(b), yP = 1.445 - 0.085 * Math.cos(b);
      inst(F, new THREE.CylinderGeometry(0.009, 0.009, 0.024, 8), mat('raptor3.fpb', 'steel'), null, ring(6, (i, a) => rotY(a + 0.3).multiply(tr(0, yP, rP)).multiply(rotX(Math.PI - b))));
      const zg = new THREE.Group(); F.add(zg);
      add(zg, solidLathe([[0, 1.4], [0.055, 1.43], [0.062, 1.6], [0.062, 1.95], [0.05, 2.09], [0, 2.095]], 32), glowMat('raptor3.fpb', COL.fuelgas));
      managed.push({ obj: zg, kind: 'zone' });
      anchor('raptor3.fpb', gFpb, ANCH['raptor3.fpb']);
    }
    exp(gFpb, [0.82, -0.14, 0]);

    /* ---- hot-gas ducts (schematic stand-ins for passages cast into the powerhead) */
    const gOxd = group('raptor3.oxDuct');
    [1, -1].forEach((s) => {
      const d = new THREE.Group(); gOxd.add(d);
      add(d, tube(OX_DUCT.map((p) => [p[0], p[1], p[2] * s]), 0.042, 56), mat('raptor3.oxDuct', 'steel', { xray: true, double: true }));
      exp(d, [0, 0.32, 0.4 * s]);
      if (s > 0) anchor('raptor3.oxDuct', d, ANCH['raptor3.oxDuct']);
    });
    const gFd = group('raptor3.fuelDuct');
    add(gFd, tube(FUEL_DUCT, 0.034, 44), mat('raptor3.fuelDuct', 'steel', { xray: true, double: true }));
    exp(gFd, [0.42, 0.22, 0.4]);
    anchor('raptor3.fuelDuct', gFd, ANCH['raptor3.fuelDuct']);

    /* ---- igniters, one per preburner (count and type not public) */
    const gIgn = group('raptor3.igniters');
    {
      const br = mat('raptor3.igniters', 'bright'), st = mat('raptor3.igniters', 'steel'), cu = mat('raptor3.igniters', 'copper');
      const a1 = deg(55), s1 = Math.sin(a1), c1 = Math.cos(a1), y1 = 2.125;
      const i1 = new THREE.Group(); gIgn.add(i1);
      add(i1, strutGeometry([0.11 * s1, y1, 0.11 * c1], [0.19 * s1, y1, 0.19 * c1], 0.014, 14), br, 'steel');
      add(i1, strutGeometry([0.19 * s1, y1, 0.19 * c1], [0.215 * s1, y1, 0.215 * c1], 0.02, 6), st, 'steel');
      add(i1, strutGeometry([0.215 * s1, y1, 0.215 * c1], [0.25 * s1, y1, 0.25 * c1], 0.008, 10), cu);
      exp(i1, [0.26 * s1, 0.24, 0.26 * c1]);
      anchor('raptor3.igniters', i1, [0.24 * s1, y1, 0.24 * c1]);
      const i2 = new THREE.Group(); gIgn.add(i2);
      const x2 = G.xF, y2 = 1.52;
      add(i2, strutGeometry([x2, y2, 0.09], [x2, y2, 0.155], 0.012, 14), br, 'steel');
      add(i2, strutGeometry([x2, y2, 0.155], [x2, y2, 0.176], 0.018, 6), st, 'steel');
      add(i2, strutGeometry([x2, y2, 0.176], [x2, y2, 0.205], 0.007, 10), cu);
      exp(i2, [0.82, -0.14, 0.24]);
    }

    /* ---- propellant inlets (low-pressure side keeps bolted flanges) */
    const gLox = group('raptor3.loxInlet');
    add(gLox, solidLathe([[0.104, 2.726], [0.118, 2.726], [0.125, 2.742], [0.125, 2.835], [0.17, 2.838], [0.17, 2.87], [0.133, 2.873], [0.133, 2.9], [0.104, 2.9]], 80), mat('raptor3.loxInlet', 'steel', { xray: true }), 'steel');
    boltRing(gLox, 0, 0, 2.876, 0.152, 20, mat('raptor3.loxInlet', 'bright'));
    exp(gLox, [0, 0.66, 0]);
    anchor('raptor3.loxInlet', gLox, ANCH['raptor3.loxInlet']);
    const gCh4 = group('raptor3.ch4Inlet');
    {
      const A = onAxis(gCh4);
      add(A, solidLathe([[0.056, 2.556], [0.074, 2.556], [0.078, 2.572], [0.078, 2.64], [0.107, 2.643], [0.107, 2.668], [0.083, 2.671], [0.083, 2.695], [0.057, 2.695]], 56), mat('raptor3.ch4Inlet', 'steel', { xray: true }), 'steel');
      boltRing(A, 0, 0, 2.674, 0.095, 12, mat('raptor3.ch4Inlet', 'bright'), 0.007);
    }
    exp(gCh4, [0.62, 0.76, 0]);
    anchor('raptor3.ch4Inlet', gCh4, ANCH['raptor3.ch4Inlet']);

    /* ---- gimbal: ring on two trunnion axes, vehicle mounting pads, TVC actuator lugs */
    const gGim = group('raptor3.gimbal');
    {
      const st = mat('raptor3.gimbal', 'steel'), br = mat('raptor3.gimbal', 'bright');
      add(gGim, torus(0.215, 0.02, 2.772, 12, 80), st, 'steel');
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([x, z]) => add(gGim, new THREE.BoxGeometry(0.05, 0.05, 0.05), br, 'steel', (m) => m.position.set(0.215 * x, 2.772, 0.215 * z)));
      [1, -1].forEach((s) => add(gGim, strutGeometry([0.215 * s, 2.76, 0], [0.15 * s, 2.655, 0], 0.016, 10), st, 'steel'));
      [1, -1].forEach((s) => {
        add(gGim, strutGeometry([0, 2.79, 0.215 * s], [0, 2.884, 0.215 * s], 0.018, 12), st, 'steel');
        add(gGim, new THREE.BoxGeometry(0.1, 0.016, 0.07), br, 'steel', (m) => m.position.set(0, 2.892, 0.215 * s));
      });
      [deg(135), deg(225)].forEach((a) => {
        const r = 0.262;
        add(gGim, new THREE.BoxGeometry(0.04, 0.05, 0.03), st, 'steel', (m) => { m.position.set(r * Math.sin(a), 2.55, r * Math.cos(a)); m.rotation.y = a; });
        add(gGim, new THREE.TorusGeometry(0.015, 0.006, 6, 18), br, null, (m) => { m.position.set((r + 0.024) * Math.sin(a), 2.55, (r + 0.024) * Math.cos(a)); m.rotation.y = a + Math.PI / 2; });
      });
      anchor('raptor3.gimbal', gGim, ANCH['raptor3.gimbal']);
    }
    exp(gGim, [0, 0.95, 0]);

    /* ---- controller box, sensors and harness (schematic: SpaceX says they are inside the engine's thermal protection) */
    const gCtl = group('raptor3.controller');
    {
      const a = deg(225), r = 0.35, yb = 2.1, st = mat('raptor3.controller', 'steel'), br = mat('raptor3.controller', 'bright'), bl = mat('raptor3.controller', 'black');
      const box = new THREE.Group(); box.position.set(r * Math.sin(a), yb, r * Math.cos(a)); box.rotation.y = a; gCtl.add(box);
      add(box, new THREE.BoxGeometry(0.22, 0.13, 0.06), st, 'steel');
      for (let i = 0; i < 6; i++) add(box, new THREE.BoxGeometry(0.004, 0.11, 0.016), st, null, (m) => m.position.set(-0.09 + i * 0.036, 0, 0.037));
      const conn = [-0.06, 0, 0.06].map((x) => {
        add(box, new THREE.CylinderGeometry(0.011, 0.011, 0.024, 12), br, null, (m) => m.position.set(x, 0.076, 0));
        return [box.position.x + x * Math.cos(a), yb + 0.088, box.position.z - x * Math.sin(a)];
      });
      const runs = [
        [conn[0], [conn[0][0] * 0.8, 2.3, conn[0][2] * 0.8], [-0.1, 2.5, -0.24], [-0.074, 2.6, -0.2]],
        [conn[1], [-0.05, 2.24, -0.36], [0.2, 2.26, -0.31], [G.xF - 0.1, 2.21, -0.13]],
        [conn[2], [conn[2][0] * 1.1, 2.17, conn[2][2] * 1.1], [-0.35, 2.06, -0.34], [-0.3, 1.9, -0.19], [-0.236, 1.78, -0.1], [-0.222, 1.75, -0.08]],
      ];
      runs.forEach((pts) => {
        add(gCtl, tube(pts, 0.0075, 48, 0.3), bl);
        const e = pts[pts.length - 1];
        add(gCtl, new THREE.SphereGeometry(0.016, 12, 8), br, null, (m) => m.position.set(e[0], e[1], e[2]));
      });
      anchor('raptor3.controller', gCtl, [box.position.x, yb + 0.07, box.position.z]);
    }
    exp(gCtl, [-0.28, 0.1, -0.62]);

    /* ---- autogenous pressurization: GOX heat exchanger in the ox-rich exhaust, GCH4 tap from the regen outlet */
    const gPr = group('raptor3.press');
    {
      const st = mat('raptor3.press', 'steel', { xray: true }), al = mat('raptor3.press', 'alloy'), cu = mat('raptor3.press', 'copper');
      add(gPr, new THREE.CylinderGeometry(0.034, 0.034, 0.1, 20), al, 'steel', (m) => m.position.set(-0.3, 2.26, 0));
      const coil = [];
      for (let i = 0; i <= 80; i++) { const t = i / 80, a = t * Math.PI * 2 * 3.5; coil.push([-0.3 + 0.043 * Math.cos(a), 2.215 + 0.09 * t, 0.043 * Math.sin(a)]); }
      add(gPr, tube(coil, 0.0065, 160, 0.5), cu);
      add(gPr, tube(GOX_LINE, 0.011, 60), st);
      add(gPr, tube(GCH4_LINE, 0.011, 80), st);
      [GOX_LINE[GOX_LINE.length - 1], GCH4_LINE[GCH4_LINE.length - 1]].forEach((p) => {
        add(gPr, solidLathe(ringProfile(0.009, 0.024, 0, 0.02), 24), mat('raptor3.press', 'bright'), 'steel', (m) => m.position.set(p[0], p[1], p[2]));
      });
      anchor('raptor3.press', gPr, ANCH['raptor3.press']);
    }
    exp(gPr, [-0.66, 0.3, 0.14]);

    return { root, groups, mats, glows, caps, managed, explode, anchors, solids };
  }

  /* ------------------------------------------------------------------ propellant flow paths (routing per public cycle analysis) */

  function flowDefs() {
    const xF = G.xF, F = [];
    const chanR = (y) => rHot(y) + G.tHot + (y < G.yJoint ? G.gapN : G.gapC) / 2;
    const circle = (R, y, n) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [R * Math.sin(a), y, R * Math.cos(a)]; });
    // liquid oxygen: inlet, inducer, impeller, then down through the casing to the oxygen-rich preburner; a branch to the fuel preburner
    F.push({ c: 'lox', r: 0.016, v: 0.3, pts: [[0, 3.08, 0], [0, 2.88, 0], [0, 2.7, 0], [0, 2.59, 0], [0.08, 2.53, 0.06], [0.17, 2.52, 0.12], [0.2, 2.44, 0.14], [0.19, 2.32, 0.13], [0.13, 2.2, 0.09], [0.06, 2.09, 0.04], [0, 2.075, 0]] });
    F.push({ c: 'lox', r: 0.01, v: 0.3, pts: [[0.2, 2.44, 0.14], [0.3, 2.37, 0.16], [0.335, 2.12, 0.13], [0.345, 1.8, 0.11], [0.37, 1.5, 0.08], [xF, 1.41, 0.02]] });
    // liquid methane: inlet, fuel pump, scroll volute, supply pipe over the top, down to the regen inlet manifold
    F.push({ c: 'ch4', r: 0.014, v: 0.3, pts: [[xF, 2.85, 0], [xF, 2.62, 0], [xF, 2.47, 0], [xF + 0.07, 2.43, -0.08], [xF + 0.14, 2.43, -0.03]].concat(PIPE_PTS) });
    F.push({ c: 'ch4', r: 0.011, v: 0.3, pts: circle(R_MAN, G.yMan, 48), closed: true });
    for (let k = 0; k < 10; k++) {
      const a = (k / 10) * Math.PI * 2 + 0.15, pts = [[R_MAN * Math.sin(a), G.yMan, R_MAN * Math.cos(a)]];
      for (let i = 1; i <= 24; i++) { const y = G.yMan + 0.02 + ((G.yOut - G.yMan - 0.02) * i) / 24, r = chanR(y); pts.push([r * Math.sin(a), y, r * Math.cos(a)]); }
      pts.push([R_OUT * Math.sin(a), G.yOut, R_OUT * Math.cos(a)]);
      F.push({ c: 'ch4', r: 0.0055, v: 0.3, pts });
    }
    F.push({ c: 'ch4', r: 0.009, v: 0.3, pts: circle(R_OUT, G.yOut, 48), closed: true });
    // warm methane from the regen outlet to the fuel preburner, to the oxygen preburner, and to the tank-pressurant tap
    F.push({ c: 'ch4', r: 0.012, v: 0.3, pts: [[R_OUT, G.yOut, 0], [0.31, 1.83, 0.03], [xF - 0.07, 1.7, 0.06], [xF - 0.06, 1.47, 0.05], [xF, 1.4, 0]] });
    F.push({ c: 'ch4', r: 0.009, v: 0.3, pts: [[0, G.yOut, -R_OUT], [0, 1.95, -0.21], [0, 2.02, -0.13], [0, 2.065, -0.05], [0, 2.075, 0]] });
    F.push({ c: 'ch4', r: 0.007, v: 0.3, pts: GCH4_LINE.concat([[-0.34, 2.97, 0.08]]) });
    // fuel-rich gas: up through the preburner into the fuel turbine, then the duct into the injector's outer manifold
    F.push({ c: 'fuelgas', r: 0.02, v: 0.5, pts: [[xF, 1.43, 0], [xF, 1.75, 0], [xF, 2.0, 0], [xF, 2.12, 0], [xF, 2.18, 0], [xF - 0.07, 2.17, 0.07]].concat(FUEL_DUCT, [[0.16, 2.0, 0.16], [0.1, 1.93, 0.1], [0.07, 1.9, 0.07]]) });
    // oxygen-rich gas: up through the preburner into the oxygen turbine, out the collector and down both ducts into the dome
    [1, -1].forEach((s) => F.push({ c: 'oxgas', r: 0.02, v: 0.5, pts: [[0, 2.08, 0], [0, 2.19, 0], [0, 2.265, 0.02 * s], [0, 2.27, 0.14 * s]].concat(OX_DUCT.map((p) => [p[0], p[1], p[2] * s]), [[0, 1.99, 0.12 * s], [0, 1.92, 0.06 * s], [0, 1.9, 0.04 * s]]) }));
    // gaseous oxygen pressurant from the heat exchanger
    F.push({ c: 'oxgas', r: 0.007, v: 0.5, pts: [[-0.24, 2.26, 0], [-0.3, 2.23, 0], [-0.3, 2.3, 0]].concat(GOX_LINE.slice(1), [[-0.25, 2.97, -0.1]]) });
    // combustion products through the throat and out of the nozzle, one set per variant
    ['sl', 'rvac'].forEach((variant) => {
      const y1 = variant === 'sl' ? G.yExit : G.yVacExit, rEnd = variant === 'sl' ? G.re : G.reV;
      const rF = (y) => (y >= G.yJoint || variant === 'sl' ? rHot(y) : rVac(y));
      [[0, 0], [0.56, 0.4], [0.56, 2.0], [0.56, 3.6], [0.56, 5.2]].forEach(([f, a]) => {
        const pts = [], y0 = G.yInj - 0.012;
        for (let i = 0; i <= 32; i++) { const y = y0 + (y1 - y0) * (i / 32), r = f * rF(y); pts.push([r * Math.sin(a), y, r * Math.cos(a)]); }
        pts.push([f * rEnd * 1.12 * Math.sin(a), y1 - 0.32, f * rEnd * 1.12 * Math.cos(a)]);
        F.push({ c: 'mix', r: f ? 0.01 : 0.016, v: 1.0, pts, variant });
      });
    });
    return F;
  }
  function buildFlows(root) {
    const group = new THREE.Group();
    group.name = 'flows';
    root.add(group);
    const list = [];
    flowDefs().forEach((d) => {
      const curve = new THREE.CatmullRomCurve3(d.pts.map(V), !!d.closed, 'centripetal');
      const len = curve.getLength();
      const geo = new THREE.TubeGeometry(curve, Math.min(160, Math.max(20, Math.round(len * 55))), d.r, 5, !!d.closed);
      const map = TEX.dash.clone();
      map.needsUpdate = true;
      const rep = Math.max(1, Math.round(len / 0.085));
      map.repeat.set(rep, 1);
      const mat = new THREE.MeshBasicMaterial({ color: COL[d.c], map, transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = 4;
      group.add(mesh);
      list.push({ mesh, mat, map, rep, len, v: d.v, variant: d.variant });
    });
    group.visible = false;
    return { group, list };
  }

  /* ------------------------------------------------------------------ view state */

  const CUT_OFF = 50; // plane constant that clips nothing
  const S = {
    st: null, model: null, flows: null, dims: null, plane: null, ui: {},
    variant: 'sl', explode: 0, explodeTarget: 0, section: false, sectionAngle: 225, xray: false, autoXray: false, flow: false, isolate: false,
    detail: null, detailNormal: null, detailPoint: null, saved: null, selected: null, hover: null, spin: false, rootY: 0, rootYTarget: 0, pulse: 0,
    calls: {}, narrow: false,
  };
  const TOP_IDS = OWN.filter((id) => id !== 'raptor3' && id.split('.').length === 2);
  const KIND_DOT = { Turbomachinery: 'k-turbo', Combustion: 'k-comb', 'Feed and valves': 'k-feed', 'Control and structure': 'k-ctrl' };
  const DETAIL_TEXT = {
    otp: [
      'Full-flow staged combustion needs no seal between the two propellants. This shaft only ever touches oxygen: liquid oxygen at the inducer, oxygen-rich gas at the turbine. Anything that leaks along it meets more oxygen.',
      'With a single preburner, a turbine driven by gas rich in one propellant can share a shaft with a pump full of the other, and a seal has to keep them apart; a leak across it can start a fire inside the turbopump. Here the fuel turbopump has its own shaft, with methane on both ends.',
      'Oxygen enters at about {{raptor.r3.inletPressure}} and leaves the pump at about {{raptor.r3.otpDischarge}} (community estimates). Stage, vane and blade counts are schematic.',
    ],
    ftp: [
      'Full-flow staged combustion needs no seal between the two propellants. This shaft only ever touches methane: liquid at the inducer, fuel-rich gas at the turbine. Anything that leaks along it meets more methane.',
      'The oxygen turbopump has its own shaft with oxygen on both ends, and two shafts let each pump spin at its own best speed.',
      'The scroll volute sends methane at about {{raptor.r3.ftpDischarge}} (community estimate), the highest pressure in the engine, into the cooling circuit. Stage, vane and blade counts are schematic.',
    ],
    mcc: [
      'Oxygen-rich gas from the central dome and fuel-rich gas from the outer manifold meet at the injector face and burn near {{raptor.r3.chamberTemp}}.',
      'The copper liner survives because methane flows at high pressure through the channels between its lands, carrying the heat to the outlet ring, where it leaves warm to feed the preburners. SpaceX has not published the flow direction.',
      'The throat, about {{raptor.r3.throatDiameterEst}} across by estimate, is where the gas reaches the speed of sound and the heat flux peaks. Element and channel counts are schematic.',
    ],
  };
  const SHEET = {
    sl: { title: 'Raptor 3', sub: 'Sea-level engine, Starship V3', rows: [
      ['Thrust, sea level', 'raptor.r3.thrustSL', 'Flight rating'],
      ['Demonstrated', 'raptor.r3.thrustSLDemonstrated', '2024 ground-test spec'],
      ['Isp, sea level', 'raptor.r3.ispSL', 'Estimate'],
      ['Isp, vacuum', 'raptor.r3.ispVac', 'Listed without a condition'],
      ['Chamber pressure', 'raptor.r3.chamberPressure', '2023 test; flight value unpublished'],
      ['Engine mass', 'raptor.r3.mass', 'Without vehicle-side hardware'],
      ['Thrust to weight', 'raptor.r3.twr', 'At the flight rating', { unitless: true }],
      ['Mixture ratio', 'raptor.r3.ofRatio', 'O/F by mass, estimate', { unitless: true }],
    ] },
    rvac: { title: 'Raptor Vacuum 3', sub: 'Vacuum engine, Starship V3', rows: [
      ['Thrust, vacuum', 'raptor.rvac3.thrust', 'Flight rating'],
      ['2024 target', 'raptor.rvac3.thrustTarget2024', 'Not a flight rating'],
      ['Isp, vacuum', 'raptor.rvac3.isp', 'Long-standing goal'],
      ['Chamber pressure', 'raptor.r3.chamberPressure', 'Shared powerhead, 2023 test'],
      ['Height', 'raptor.rvac3.height', 'Sea-level engine: ' + SX.fmt('raptor.r3.height')],
      ['Exit diameter', 'raptor.rvac3.exitDiameter', 'Sea-level engine: ' + SX.fmt('raptor.r3.exitDiameter')],
      ['Engine mass', null, 'Not published'],
      ['Expansion ratio', 'raptor3d.modelExpansionVac', 'This model; not published'],
    ] },
  };

  const plainFacts = (s) => String(s || '').replace(/\{\{\s*([\w.]+)(?:\|([^}\s]+))?\s*\}\}/g, (m, k, to) => SX.fmt(k, to ? { to } : null));
  const firstSentence = (s) => { const t = plainFacts(s); const i = t.indexOf('. '); return i > 0 ? t.slice(0, i + 1) : t; };
  const inFamily = (id, root) => id === root || id.indexOf(root + '.') === 0;
  const detailKindFor = (id) => (inFamily(id, 'raptor3.otp') ? 'otp' : inFamily(id, 'raptor3.ftp') ? 'ftp' : (id === 'raptor3.mcc' || id === 'raptor3.injector' || id === 'raptor3.regen') ? 'mcc' : null);
  const inDetail = (id) => !!(S.detail && id && DETAIL[S.detail].parts.some((p) => inFamily(id, p)));

  /* ------------------------------------------------------------------ DOM */

  function buildDom(mount) {
    const el = SX.el;
    const tbtn = (label, key, title) => el('button', { type: 'button', class: 'btn btn-sm', 'aria-pressed': 'false', 'data-k': key, title: title || null }, label);
    const seg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Engine variant' },
      el('button', { type: 'button', 'aria-pressed': 'true', 'data-variant': 'sl', title: 'Raptor 3, sea-level nozzle' }, 'Raptor 3'),
      el('button', { type: 'button', 'aria-pressed': 'false', 'data-variant': 'rvac', title: 'Raptor Vacuum 3' }, 'RVac 3'));
    const ui = S.ui;
    ui.seg = seg;
    ui.tSection = tbtn('Section', 'section', 'Cut the engine in half along its axis');
    ui.tXray = tbtn('X-ray', 'xray', 'Make the outer housings translucent');
    ui.tFlow = tbtn('Flow', 'flow', 'Animate the propellant paths');
    ui.tIso = tbtn('Isolate', 'isolate', 'Dim everything except the selected component');
    ui.tReset = el('button', { type: 'button', class: 'btn btn-sm btn-ghost', title: 'Reset the model and the camera' }, 'Reset');
    const toolbar = el('div', { class: 'viz-toolbar', role: 'toolbar', 'aria-label': 'Engine model controls' }, seg, ui.tSection, ui.tXray, ui.tFlow, ui.tIso, el('span', { class: 'r3-tools-spacer' }), ui.tReset);
    ui.toolbar = toolbar;
    const sw = (k, t) => el('span', null, el('span', { class: 'sw ' + k }), t);
    ui.legend = el('div', { class: 'legend r3-legend', hidden: true }, sw('lox', 'Liquid oxygen'), sw('ch4', 'Methane, incl. regen'), sw('oxgas', 'Oxygen-rich gas'), sw('fuelgas', 'Fuel-rich gas'), sw('mix', 'Combustion products'));
    ui.detailTitle = el('b', null, '');
    ui.detailbar = el('div', { class: 'r3-detailbar', hidden: true }, ui.detailTitle, el('button', { type: 'button', class: 'btn btn-sm', onclick: () => exitDetail() }, 'Back to full engine'));
    ui.note = el('div', { class: 'r3-note' }, (SX.coarse ? '' : 'Drag to orbit, scroll to zoom, click a part. ') + 'Proportions from the published height and diameter; internal layout follows public analysis, not SpaceX drawings.');
    ui.foot = el('div', { class: 'r3-foot' }, ui.detailbar, ui.legend, ui.note);
    ui.readout = el('div', { class: 'r3-readout' });
    ui.secTag = el('div', { class: 'r3-sectag', hidden: true });
    ui.viz = el('div', { class: 'viz viz-grid r3-viz', role: 'group', 'aria-label': 'Interactive 3D model of Raptor 3. Use the component list to select parts with the keyboard.' }, toolbar, ui.readout, ui.secTag, ui.foot);

    ui.exR = el('input', { type: 'range', min: 0, max: 100, step: 1, value: 0, id: 'r3-explode' });
    ui.exO = el('output', { for: 'r3-explode' }, '0%');
    ui.anR = el('input', { type: 'range', min: 0, max: 359, step: 1, value: S.sectionAngle, id: 'r3-angle' });
    ui.anO = el('output', { for: 'r3-angle' }, S.sectionAngle + '°');
    ui.anRow = el('div', { class: 'range-row is-off' }, el('label', { for: 'r3-angle' }, 'Cut angle'), ui.anR, ui.anO);
    const controls = el('div', { class: 'panel r3-controls' }, el('div', { class: 'range-row' }, el('label', { for: 'r3-explode' }, 'Explode'), ui.exR, ui.exO), ui.anRow);

    ui.sheet = el('section', { class: 'panel r3-sheet', 'aria-label': 'Engine datasheet' });
    ui.cap = el('section', { class: 'panel r3-cap', 'aria-live': 'polite' });
    ui.parts = el('nav', { class: 'panel r3-parts', 'aria-label': 'Raptor 3 components' });
    ui.rows = {};
    LIST_GROUPS.forEach(([title, ids]) => {
      const ul = el('ul');
      ids.forEach((id) => {
        const p = SX.part(id);
        if (!p) return;
        const child = id.split('.').length > 2;
        const b = el('button', { type: 'button', class: 'r3-row' + (child ? ' is-child' : ''), 'data-id': id, 'aria-current': 'false' },
          child ? null : el('span', { class: 'dot ' + (KIND_DOT[title] || ''), 'aria-hidden': 'true' }),
          el('span', null, p.name),
          p.short && p.short !== p.name ? el('small', null, p.short) : null);
        b.addEventListener('click', () => { stopSpin(); SX.select(id); focus(id); });
        b.addEventListener('mouseenter', () => setHover(id));
        b.addEventListener('mouseleave', () => setHover(null));
        b.addEventListener('focus', () => setHover(id));
        b.addEventListener('blur', () => setHover(null));
        ui.rows[id] = b;
        ul.appendChild(el('li', null, b));
      });
      ui.parts.appendChild(el('h3', null, title));
      ui.parts.appendChild(ul);
    });
    const side = el('div', { class: 'r3-side' }, ui.sheet, ui.cap, ui.parts);
    mount.appendChild(el('div', { class: 'r3-grid' }, el('div', { class: 'r3-stagecol' }, ui.viz, controls), side));

    // wiring
    seg.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { stopSpin(); if (S.detail) exitDetail(true); setVariant(b.dataset.variant, true); }));
    ui.tSection.addEventListener('click', () => { stopSpin(); if (S.detail) exitDetail(true); setSection(!S.section); });
    ui.tXray.addEventListener('click', () => { stopSpin(); if (S.detail) exitDetail(true); S.xray = !S.xray; S.autoXray = false; applyAll(); });
    ui.tFlow.addEventListener('click', () => { stopSpin(); if (S.detail) exitDetail(true); setFlow(!S.flow); });
    ui.tIso.addEventListener('click', () => { stopSpin(); S.isolate = !S.isolate; applyAll(); renderCaption(); });
    ui.tReset.addEventListener('click', () => resetAll());
    let fitT = 0;
    ui.exR.addEventListener('input', () => {
      stopSpin();
      if (S.detail) exitDetail(true);
      S.explodeTarget = +ui.exR.value / 100;
      ui.exO.textContent = ui.exR.value + '%';
      clearTimeout(fitT);
      fitT = setTimeout(() => fitExploded(650), 140);
    });
    ui.anR.addEventListener('input', () => { stopSpin(); S.sectionAngle = +ui.anR.value; ui.anO.textContent = ui.anR.value + '°'; if (!S.section) setSection(true, true); updatePlane(); updateClip(); syncUI(); });
    mount.addEventListener('pointerdown', (e) => { if (e.target.closest && e.target.closest('input,button')) stopSpin(); });
  }

  function renderSheet() {
    const d = SHEET[S.variant], el = SX.el, ui = S.ui;
    ui.sheet.innerHTML = '';
    ui.sheet.appendChild(el('div', { class: 'r3-sheet-head' },
      el('div', null, el('div', { class: 'eyebrow' }, 'Datasheet'), el('h3', { class: 'h4' }, d.title)),
      el('span', { class: 'small muted' }, d.sub)));
    const dl = el('dl', { class: 'r3-dl' });
    d.rows.forEach(([label, key, note, opts]) => {
      dl.appendChild(el('div', null, el('dt', null, label),
        el('dd', { html: (key ? SX.factHTML(key, opts || null) : '<span class="muted">n/a</span>') + (note ? '<small>' + SX.esc(note) + '</small>' : '') })));
    });
    ui.sheet.appendChild(dl);
    SX.renderFacts(ui.sheet);
    const hk = S.variant === 'rvac' ? 'raptor.rvac3.height' : 'raptor.r3.height', dk = S.variant === 'rvac' ? 'raptor.rvac3.exitDiameter' : 'raptor.r3.diameter';
    ui.readout.innerHTML = '<b>' + SX.esc(d.title) + '</b>' + SX.factHTML(hk) + ' tall, ' + SX.factHTML(dk) + (S.variant === 'rvac' ? ' exit' : ' wide');
    SX.renderFacts(ui.readout);
  }

  function renderCaption() {
    const el = SX.el, cap = S.ui.cap;
    if (!cap) return;
    cap.innerHTML = '';
    const actions = el('div', { class: 'r3-actions' });
    if (S.detail) {
      const d = DETAIL[S.detail];
      cap.append(el('div', { class: 'eyebrow' }, 'Cutaway'), el('h3', null, d.title));
      DETAIL_TEXT[S.detail].forEach((p, i) => cap.appendChild(el('p', { class: i === 0 ? 'callout' : '', html: SX.withFacts(p) })));
      actions.appendChild(el('button', { type: 'button', class: 'btn btn-sm btn-primary', onclick: () => exitDetail() }, 'Back to full engine'));
    } else if (S.selected && S.selected !== 'raptor3') {
      const p = SX.part(S.selected);
      cap.append(el('div', { class: 'eyebrow' }, p.kind || 'Component'), el('h3', null, p.name), el('p', { html: SX.withFacts(p.summary) }));
      const dk = detailKindFor(S.selected);
      if (dk === 'otp' || dk === 'ftp') actions.appendChild(el('button', { type: 'button', class: 'btn btn-sm btn-primary', onclick: () => enterDetail(dk, S.selected) }, 'Cut open this turbopump'));
      if (dk === 'mcc') actions.appendChild(el('button', { type: 'button', class: 'btn btn-sm btn-primary', onclick: () => enterDetail('mcc', S.selected) }, 'Cut open the chamber'));
      actions.appendChild(el('button', { type: 'button', class: 'btn btn-sm', onclick: () => focus(S.selected) }, 'Frame it'));
      actions.appendChild(el('button', { type: 'button', class: 'btn btn-sm', 'aria-pressed': String(S.isolate), onclick: () => { S.isolate = !S.isolate; applyAll(); renderCaption(); } }, 'Isolate'));
    } else {
      cap.append(el('div', { class: 'eyebrow' }, 'Explore'), el('h3', null, 'Raptor 3 in 3D'),
        el('p', null, 'Click any part, or pick one from the list. Explode the engine to see how it stacks, cut it in half with the section plane, or turn on the flow to follow the propellants. Select a turbopump or the chamber to cut it open.'));
      actions.appendChild(el('button', { type: 'button', class: 'btn btn-sm', onclick: () => SX.select('raptor3') }, 'About Raptor 3'));
      if (S.isolate) cap.appendChild(el('p', { class: 'small muted' }, 'Isolate is on: select a component to isolate it.'));
    }
    cap.appendChild(actions);
    SX.renderFacts(cap);
  }

  function syncUI() {
    const ui = S.ui;
    ui.seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.variant === S.variant)));
    ui.tSection.setAttribute('aria-pressed', String(S.section || !!S.detail));
    ui.tXray.setAttribute('aria-pressed', String(S.xray));
    ui.tFlow.setAttribute('aria-pressed', String(S.flow));
    ui.tIso.setAttribute('aria-pressed', String(S.isolate));
    ui.anRow.classList.toggle('is-off', !S.section);
    ui.exR.value = Math.round(S.explodeTarget * 100);
    ui.exO.textContent = ui.exR.value + '%';
    ui.legend.hidden = !S.flow || !!S.detail;
    ui.detailbar.hidden = !S.detail;
    ui.note.hidden = !!S.detail;
    ui.detailTitle.textContent = S.detail ? DETAIL[S.detail].title : '';
    ui.secTag.hidden = !(S.section || S.detail);
    ui.secTag.style.top = (ui.toolbar.offsetTop + ui.toolbar.offsetHeight + 10) + 'px';
    ui.secTag.innerHTML = S.detail ? '<b>Section A-A</b>through the ' + (S.detail === 'mcc' ? 'chamber' : 'pump') + ' axis' : '<b>Section A-A</b>cut plane at ' + S.sectionAngle + '°';
    Object.keys(ui.rows).forEach((id) => {
      const sel = S.selected === id;
      ui.rows[id].setAttribute('aria-current', String(sel));
      ui.rows[id].classList.toggle('is-hover', S.hover === id && !sel);
    });
    // keep the active row visible inside the list when the list scrolls on its own (never scroll the page)
    const row = S.selected && ui.rows[S.selected], box = ui.parts;
    if (row && row !== S.lastRow && box.scrollHeight > box.clientHeight + 4) {
      const top = row.offsetTop - box.offsetTop, bottom = top + row.offsetHeight;
      if (top < box.scrollTop + 24) box.scrollTop = Math.max(0, top - 40);
      else if (bottom > box.scrollTop + box.clientHeight - 12) box.scrollTop = bottom - box.clientHeight + 40;
    }
    S.lastRow = row || null;
  }

  /* ------------------------------------------------------------------ state application */

  function isDim(part) {
    const sel = S.selected;
    if (!S.isolate || !sel || !OWNSET.has(sel) || sel === 'raptor3' || !part) return false;
    return !(inFamily(part, sel) || inFamily(sel, part));
  }
  function applyExplode(e) {
    const k = SX.smooth(SX.clamp(e, 0, 1));
    S.model.explode.forEach(({ obj, vec }) => obj.position.copy(vec).multiplyScalar(k));
  }
  function updatePlane() {
    const pl = S.plane;
    if (S.detail && S.detailNormal) { pl.normal.copy(S.detailNormal); pl.constant = -pl.normal.dot(S.detailPoint); }
    else if (S.section) { const a = deg(S.sectionAngle); pl.normal.set(Math.sin(a), 0, Math.cos(a)); pl.constant = 0; }
    else { pl.normal.set(1, 0, 0); pl.constant = CUT_OFF; }
  }
  function applyVisibility() {
    const m = S.model, d = S.detail ? DETAIL[S.detail] : null;
    TOP_IDS.forEach((id) => {
      const g = m.groups[id];
      if (!g) return;
      const variantOk = !g.userData.variant || g.userData.variant === S.variant;
      g.visible = variantOk && (!d || d.parts.indexOf(id) >= 0);
    });
    const cut = S.section || !!S.detail;
    updatePlane();
    m.managed.forEach((it) => {
      let v = !it.variant || it.variant === S.variant;
      if (it.kind === 'rib') v = v && (cut || S.xray);
      if (it.kind === 'zone') v = v && (cut || S.xray);
      if (S.detail === 'mcc' && (it.sub === 'supply' || it.sub === 'nozzleRibs')) v = false;
      it.obj.visible = v;
    });
    updateClip();
    S.flows.group.visible = S.flow && !S.detail;
    S.flows.list.forEach((f) => { f.mesh.visible = !f.variant || f.variant === S.variant; });
    S.dims.group.visible = !S.detail;
  }
  // With a section plane, hide meshes that lie entirely on the cut-away side and draw section caps only for
  // meshes the plane actually crosses. This keeps the section view inside the triangle budget.
  const _sph = { s: null };
  function updateClip() {
    const cut = S.section || !!S.detail, pl = S.plane;
    if (!_sph.s) _sph.s = new THREE.Sphere();
    S.model.root.updateMatrixWorld(true);
    S.model.solids.forEach((it) => {
      let clipAll = false, cross = false;
      if (cut) {
        if (!it.local) it.local = localSphere(it.mesh);
        const w = _sph.s.copy(it.local).applyMatrix4(it.mesh.matrixWorld);
        const d = pl.distanceToPoint(w.center);
        clipAll = d < -w.radius;
        cross = Math.abs(d) <= w.radius;
      }
      // translucent instanced detail (injector elements, blades) piles up into bright bands when dimmed, so hide it
      it.mesh.visible = !clipAll && !(it.mesh.isInstancedMesh && isDim(it.part));
      if (it.cap) it.cap.visible = cut && cross && !S.xray && !isDim(it.part);
    });
  }
  function localSphere(mesh) {
    const g = mesh.geometry;
    if (!g.boundingBox) g.computeBoundingBox();
    if (!mesh.isInstancedMesh) { const sp = new THREE.Sphere(); g.boundingBox.getBoundingSphere(sp); return sp; }
    const box = new THREE.Box3(), tmp = new THREE.Box3(), m4 = new THREE.Matrix4();
    for (let i = 0; i < mesh.count; i++) { mesh.getMatrixAt(i, m4); box.union(tmp.copy(g.boundingBox).applyMatrix4(m4)); }
    return box.getBoundingSphere(new THREE.Sphere());
  }
  // World bounding box that respects instance transforms (Box3.setFromObject in r147 does not).
  function worldBox(obj) {
    const box = new THREE.Box3(), tmp = new THREE.Box3(), m4 = new THREE.Matrix4();
    obj.updateWorldMatrix(true, true);
    obj.traverse((o) => {
      if (!o.isMesh || o.userData.cap) return;
      const g = o.geometry;
      if (!g.boundingBox) g.computeBoundingBox();
      if (o.isInstancedMesh) { for (let i = 0; i < o.count; i++) { o.getMatrixAt(i, m4); box.union(tmp.copy(g.boundingBox).applyMatrix4(m4).applyMatrix4(o.matrixWorld)); } }
      else box.union(tmp.copy(g.boundingBox).applyMatrix4(o.matrixWorld));
    });
    return box;
  }
  // Box of the whole engine at explode fraction k (from boxes measured once, assembled).
  function explodedBox(k) {
    const m = S.model, root = m.root, e = SX.smooth(SX.clamp(k, 0, 1));
    if (!m.boxes) {
      const pos = root.position.clone();
      root.position.set(0, 0, 0);
      m.explode.forEach((it) => { const p = it.obj.position.clone(); it.obj.position.set(0, 0, 0); it.box = worldBox(it.obj); it.obj.position.copy(p); });
      m.staticBox = worldBox(m.groups['raptor3.injector']);
      root.position.copy(pos);
      root.updateMatrixWorld(true);
      m.boxes = true;
    }
    const box = m.staticBox.clone(), off = new THREE.Vector3();
    m.explode.forEach((it) => {
      let vis = true, n = it.obj;
      while (n && n !== root) { if (n.userData.variant && n.userData.variant !== S.variant) { vis = false; break; } n = n.parent; }
      if (!vis || it.box.isEmpty()) return;
      off.copy(it.vec).multiplyScalar(e).multiply(root.scale);
      box.union(it.box.clone().translate(off));
    });
    return box.translate(new THREE.Vector3(0, S.rootYTarget, 0));
  }
  function fitExploded(ms) {
    if (S.detail) return;
    const box = explodedBox(S.explodeTarget);
    if (S.explodeTarget < 0.02) { homeView(); return; }
    box.expandByScalar(0.05);
    flyToBox(box, currentDir(), 1.0, ms || 700);
  }
  function applyMaterials() {
    S.model.mats.forEach((mt) => {
      const dim = isDim(mt.userData.part), xr = S.xray && mt.userData.xray;
      const op = dim ? 0.06 : xr ? mt.userData.xrayOp : 1, tr = op < 1;
      if (mt.transparent !== tr) { mt.transparent = tr; mt.needsUpdate = true; }
      mt.opacity = op;
      mt.depthWrite = !tr;
    });
    S.model.glows.forEach((mt) => { mt.opacity = isDim(mt.userData.part) ? 0.06 : 0.85; });
  }
  function setHighlight() {
    const H3 = SX.three, m = S.model;
    H3.highlight(m.root, null);
    if (S.hover && S.hover !== S.selected && m.groups[S.hover]) H3.highlight(m.groups[S.hover], COL.steel, 0.14);
    if (S.selected && m.groups[S.selected]) H3.highlight(m.groups[S.selected], COL.accent, (S.detail ? 0.1 : 0.3) + 0.7 * Math.min(1, S.pulse / 0.9));
  }
  function applyAll() { applyVisibility(); applyMaterials(); setHighlight(); syncUI(); }

  /* ------------------------------------------------------------------ actions */

  function stopSpin() {
    if (!S.spin) return;
    S.spin = false;
    if (S.st && S.st.controls) S.st.controls.autoRotate = false;
  }
  function camAzimuthDeg() {
    const st = S.st, t = st.controls ? st.controls.target : new THREE.Vector3();
    return (THREE.MathUtils.radToDeg(Math.atan2(st.camera.position.x - t.x, st.camera.position.z - t.z)) + 360) % 360;
  }
  function setSection(on, keepAngle) {
    S.section = on;
    if (on && !keepAngle) {
      S.sectionAngle = Math.round((camAzimuthDeg() + 180) % 360);
      S.ui.anR.value = S.sectionAngle;
      S.ui.anO.textContent = S.sectionAngle + '°';
    }
    if (on && S.autoXray) { S.xray = false; S.autoXray = false; }
    applyAll();
  }
  function setFlow(on) {
    S.flow = on;
    if (on) {
      if (S.explodeTarget > 0) { S.explodeTarget = 0; homeView(); }
      if (!S.section && !S.xray) { S.xray = true; S.autoXray = true; }
    } else if (S.autoXray) { S.xray = false; S.autoXray = false; }
    applyAll();
  }
  function setVariant(v, reframe) {
    if (v === S.variant) return;
    S.variant = v;
    S.rootYTarget = v === 'rvac' ? HV - H : 0;
    if (SX.reducedMotion) { S.rootY = S.rootYTarget; S.model.root.position.y = S.rootY; }
    S.dims.update();
    renderSheet();
    applyAll();
    if (reframe !== false && !S.detail) homeView();
  }
  function resetAll() {
    stopSpin();
    if (S.detail) exitDetail(true);
    S.explodeTarget = 0; S.section = false; S.xray = false; S.autoXray = false; S.flow = false; S.isolate = false;
    applyAll();
    renderCaption();
    homeView();
  }
  function flyToBox(box, dir, pad, ms) {
    const st = S.st, cam = st.camera;
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const fitH = sphere.radius / Math.sin(THREE.MathUtils.degToRad(cam.fov / 2));
    const fitW = fitH / Math.max(0.4, Math.min(1, cam.aspect));
    const dist = Math.max(fitH, fitW) * (pad || 1.1);
    st.fly(sphere.center, sphere.center.clone().add(dir.clone().normalize().multiplyScalar(dist)), ms || 900);
  }
  function currentDir() {
    const st = S.st, t = st.controls ? st.controls.target : new THREE.Vector3();
    return st.camera.position.clone().sub(t).normalize();
  }
  // Fit the assembled engine using separate vertical and horizontal extents (a bounding sphere wastes space on tall, narrow views).
  function homeView(instant) {
    const st = S.st, cam = st.camera, dir = new THREE.Vector3(0.64, 0.24, 0.73).normalize();
    const vac = S.variant === 'rvac';
    const yBot = S.rootYTarget + (vac ? G.yVacExit : 0) * SY - 0.34, yTop = S.rootYTarget + 2.9 * SY + 0.04;
    const halfW = ((vac ? G.reV : G.re) + 0.3) * SR;
    const tanV = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), aspect = Math.max(0.3, cam.aspect || 1);
    const dist = Math.max((yTop - yBot) / 2 / tanV, halfW / (tanV * aspect)) * 1.12 + halfW * 0.5;
    const center = new THREE.Vector3(0.1 * SR, (yTop + yBot) / 2 + (yTop - yBot) * 0.02, 0);
    const pos = center.clone().add(dir.multiplyScalar(dist));
    if (instant) {
      cam.position.copy(pos);
      if (st.controls) { st.controls.target.copy(center); st.controls.update(); } else cam.lookAt(center);
      return;
    }
    st.fly(center, pos, 1000);
  }
  function worldAnchor(id) {
    const a = S.model.anchors[id];
    if (!a) return null;
    return S.model.root.localToWorld(a.p.clone().add(a.obj.position));
  }
  // Designed viewing directions per part [azimuth deg, elevation], chosen so the big coolant pipe,
  // the fuel pump and the ducts do not block the part being framed.
  const VIEWS = {
    'raptor3.gimbal': [25, 0.55], 'raptor3.loxInlet': [20, 0.6], 'raptor3.ch4Inlet': [80, 0.45], 'raptor3.otp': [160, 0.35],
    'raptor3.ftp': [95, 0.25], 'raptor3.opb': [70, 0.2], 'raptor3.fpb': [105, 0.1], 'raptor3.oxDuct': [5, 0.25],
    'raptor3.fuelDuct': [45, 0.3], 'raptor3.injector': [30, 0.45], 'raptor3.mcc': [30, 0.12], 'raptor3.regen': [300, 0.2],
    'raptor3.nozzle': [30, 0.2], 'raptor3.rvac': [30, 0.2], 'raptor3.igniters': [55, 0.2], 'raptor3.controller': [225, 0.3], 'raptor3.press': [275, 0.3],
  };
  function frameOn(id) {
    const g = S.model.groups[id];
    if (!g) return;
    const box = worldBox(g);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3()).length();
    const v = VIEWS[id] || VIEWS[id.split('.').slice(0, 2).join('.')];
    let dir = currentDir();
    if (v && S.explode < 0.1) { const a = deg(v[0]); dir = new THREE.Vector3(Math.sin(a), v[1], Math.cos(a)); }
    flyToBox(box, dir, size < 0.3 ? 3.4 : size < 1.2 ? 2.4 : 1.35, 900);
  }
  function focus(id) {
    if (!S.st || !OWNSET.has(id)) return;
    stopSpin();
    if (id === 'raptor3') { if (S.detail) exitDetail(true); homeView(); return; }
    const dk = detailKindFor(id);
    if (id.split('.').length > 2 && (dk === 'otp' || dk === 'ftp')) { enterDetail(dk, id); return; }
    if (S.detail) { if (inDetail(id)) { S.pulse = SX.reducedMotion ? 0 : 0.9; return; } exitDetail(true); }
    if (id === 'raptor3.rvac') setVariant('rvac', false);
    if (id === 'raptor3.nozzle') setVariant('sl', false);
    frameOn(id);
    S.pulse = SX.reducedMotion ? 0 : 0.9;
  }
  function enterDetail(kind, focusId) {
    const st = S.st;
    if (!S.detail) S.saved = { explode: S.explodeTarget, section: S.section, xray: S.xray, autoXray: S.autoXray, flow: S.flow };
    stopSpin();
    S.detail = kind;
    S.explodeTarget = 0; S.explode = 0; applyExplode(0);
    S.xray = false; S.autoXray = false; S.flow = false;
    const d = DETAIL[kind];
    const t = st.controls ? st.controls.target : new THREE.Vector3();
    const toCam = new THREE.Vector3(st.camera.position.x - t.x, 0, st.camera.position.z - t.z);
    if (toCam.lengthSq() < 1e-6) toCam.set(0.64, 0, 0.73);
    toCam.normalize();
    S.detailNormal = toCam.clone().negate();
    if (kind === 'mcc') {
      const step = (Math.PI * 2) / RIBS, a = Math.round(Math.atan2(S.detailNormal.x, S.detailNormal.z) / step) * step;
      S.detailNormal.set(Math.sin(a), 0, Math.cos(a));
      toCam.copy(S.detailNormal).negate();
    }
    const root = S.model.root;
    root.position.y = S.rootY = S.rootYTarget;
    root.updateMatrixWorld(true);
    S.detailPoint = root.localToWorld(new THREE.Vector3(d.axis[0], 0, d.axis[1]));
    applyAll();
    const box = new THREE.Box3();
    d.parts.forEach((pid) => { const g = S.model.groups[pid]; if (g) box.union(worldBox(g)); });
    if (kind === 'mcc') { box.min.y = Math.max(box.min.y, root.localToWorld(new THREE.Vector3(0, G.yThroat - 0.25, 0)).y); box.max.y = Math.min(box.max.y, root.localToWorld(new THREE.Vector3(0, 2.1, 0)).y); }
    const dir = toCam.clone().multiplyScalar(0.95).add(new THREE.Vector3(0, kind === 'mcc' ? -0.05 : 0.22, 0));
    flyToBox(box, dir, kind === 'mcc' ? 1.02 : 1.12, 1000);
    if (focusId && S.selected !== focusId) SX.select(focusId);
    renderCaption();
    syncUI();
  }
  function exitDetail(silent) {
    if (!S.detail) return;
    const s = S.saved || {};
    S.detail = null;
    S.explodeTarget = s.explode || 0; S.section = !!s.section; S.xray = !!s.xray; S.autoXray = !!s.autoXray; S.flow = !!s.flow;
    S.saved = null;
    applyAll();
    renderCaption();
    if (!silent) homeView();
  }

  /* ------------------------------------------------------------------ selection and hover */

  function mapPick(id) {
    if (!S.detail) {
      if (inFamily(id, 'raptor3.otp')) return 'raptor3.otp';
      if (inFamily(id, 'raptor3.ftp')) return 'raptor3.ftp';
    }
    return id;
  }
  function setHover(id, ev) {
    if (id === S.hover) return;
    S.hover = id;
    setHighlight();
    syncUI();
    if (!ev) return;
    if (id) { const p = SX.part(id); if (p) SX.tip.show('<b>' + SX.esc(p.name) + '</b>' + SX.esc(firstSentence(p.summary)), ev.clientX, ev.clientY); }
    else SX.tip.hide();
  }
  function onSelect(id) {
    const own = id && OWNSET.has(id) ? id : null;
    S.selected = own;
    if (own === 'raptor3.rvac' && S.variant !== 'rvac') setVariant('rvac', false);
    if (own === 'raptor3.nozzle' && S.variant !== 'sl') setVariant('sl', false);
    if (S.detail && own && !inDetail(own)) exitDetail(true);
    applyAll();
    renderCaption();
  }

  /* ------------------------------------------------------------------ dimensions (billboarded to face the camera) */

  function buildDims(st) {
    const group = new THREE.Group();
    group.name = 'dims';
    const mat = new THREE.LineBasicMaterial({ color: COL.muted, transparent: true, opacity: 0.85, depthWrite: false });
    const geo = new THREE.BufferGeometry();
    group.add(new THREE.LineSegments(geo, mat));
    const pos = { h: new THREE.Vector3(), d: new THREE.Vector3() };
    const lh = st.label('', () => (group.visible ? group.localToWorld(pos.h.clone()) : null), { className: 'r3-dim' });
    const ld = st.label('', () => (group.visible ? group.localToWorld(pos.d.clone()) : null), { className: 'r3-dim r3-dim-h' });
    function update() {
      const vac = S.variant === 'rvac', top = 2.9, bot = vac ? G.yVacExit : 0, re = vac ? G.reV : G.re;
      const xd = re + 0.26, yd = bot - 0.3, t = 0.028;
      const s = [
        [xd, bot, 0, xd, top, 0], [0.18, top, 0, xd + 0.06, top, 0], [re + 0.04, bot, 0, xd + 0.06, bot, 0],
        [xd - t, top - t, 0, xd + t, top + t, 0], [xd - t, bot - t, 0, xd + t, bot + t, 0],
        [-re, yd, 0, re, yd, 0], [-re, bot - 0.03, 0, -re, yd - 0.05, 0], [re, bot - 0.03, 0, re, yd - 0.05, 0],
        [-re - t, yd - t, 0, -re + t, yd + t, 0], [re - t, yd - t, 0, re + t, yd + t, 0],
      ];
      geo.setAttribute('position', new THREE.Float32BufferAttribute([].concat(...s), 3));
      geo.computeBoundingSphere();
      pos.h.set(xd + 0.02, (top + bot) / 2, 0);
      pos.d.set(0, yd, 0);
      const hk = vac ? 'raptor.rvac3.height' : 'raptor.r3.height', dk = vac ? 'raptor.rvac3.exitDiameter' : 'raptor.r3.exitDiameter';
      lh.el.innerHTML = '<b>' + SX.esc(SX.fmt(hk)) + '</b>';
      ld.el.innerHTML = '<span style="display:inline-block;transform:translateX(-50%)">Exit <b>' + SX.esc(SX.fmt(dk)) + '</b></span>';
    }
    update();
    return { group, mat, update, labels: [lh, ld] };
  }

  /* ------------------------------------------------------------------ callouts (leader labels in two columns) */

  function calloutItems() {
    const out = [];
    if (S.detail) {
      const d = DETAIL[S.detail], root = S.model.root;
      const up = new THREE.Vector3(0, 1, 0), u = new THREE.Vector3().crossVectors(up, S.detailNormal).normalize();
      d.labels.forEach(([text, part, r, y], i) => {
        const side = i % 2 ? -1 : 1;
        const local = new THREE.Vector3(d.axis[0] + u.x * r * side, y, d.axis[1] + u.z * r * side);
        out.push({ key: 'd:' + S.detail + ':' + i, text, part, world: root.localToWorld(local), sub: true });
      });
      return out;
    }
    TOP_IDS.forEach((id) => {
      const g = S.model.groups[id];
      if (!g || !g.visible || !CALL[id]) return;
      const w = worldAnchor(id);
      if (w) out.push({ key: id, text: CALL[id][S.narrow ? 1 : 0], part: id, world: w });
    });
    return out;
  }
  function layoutCallouts(opacity) {
    const st = S.st, holder = st.holder, W = holder.clientWidth, Hh = holder.clientHeight;
    let svg = S.calls.svg;
    if (!svg) {
      svg = S.calls.svg = SX.svg('svg', { class: 'r3-callouts', 'aria-hidden': 'true' });
      st.overlay.appendChild(svg);
      S.calls.els = {};
    }
    const els = S.calls.els;
    if (opacity <= 0.01) {
      if (!S.calls.hidden) { svg.style.display = 'none'; Object.values(els).forEach((e) => { e.label.style.display = 'none'; }); S.calls.hidden = true; }
      return;
    }
    S.calls.hidden = false;
    svg.style.display = '';
    svg.style.opacity = opacity;
    const items = calloutItems();
    const cam = st.camera;
    cam.updateMatrixWorld();
    const seen = new Set();
    const cols = { L: [], R: [] };
    const v = new THREE.Vector3();
    items.forEach((it) => {
      v.copy(it.world).project(cam);
      if (v.z > 1) return;
      let e = els[it.key];
      if (!e) {
        const label = SX.el('div', { class: 'r3-co' + (it.sub ? ' is-sub' : '') });
        label.addEventListener('click', (ev) => { ev.stopPropagation(); stopSpin(); SX.select(e.part); if (!S.detail) S.pulse = SX.reducedMotion ? 0 : 0.9; });
        label.addEventListener('mouseenter', () => setHover(e.part));
        label.addEventListener('mouseleave', () => setHover(null));
        const g = SX.svg('g');
        const path = SX.svg('path', { d: '' }), dot = SX.svg('circle', { r: 2.5 });
        g.appendChild(path); g.appendChild(dot); svg.appendChild(g);
        st.overlay.appendChild(label);
        e = els[it.key] = { label, g, path, dot, text: '', w: 0, h: 0, part: it.part };
      }
      if (e.text !== it.text) { e.label.textContent = it.text; e.text = it.text; e.w = 0; }
      e.label.style.display = '';
      e.g.style.display = '';
      if (!e.w) { e.w = e.label.offsetWidth; e.h = e.label.offsetHeight; }
      const sx = (v.x * 0.5 + 0.5) * W, sy = (-v.y * 0.5 + 0.5) * Hh;
      const sel = S.selected && (it.part === S.selected || (!S.detail && inFamily(S.selected, it.part)));
      e.label.classList.toggle('is-sel', !!sel);
      e.g.setAttribute('class', sel ? 'is-sel' : '');
      (sx < W / 2 ? cols.L : cols.R).push({ e, sx, sy, y: sy });
      seen.add(it.key);
    });
    Object.keys(els).forEach((k) => { if (!seen.has(k)) { els[k].label.style.display = 'none'; els[k].g.style.display = 'none'; } });
    const tag = S.ui.secTag && !S.ui.secTag.hidden ? S.ui.secTag.offsetTop + S.ui.secTag.offsetHeight + 12 : 0;
    const top = Math.max(S.ui.toolbar ? S.ui.toolbar.offsetHeight + 20 : 60, tag), bottom = Hh - (S.ui.foot ? S.ui.foot.offsetHeight + 16 : 40);
    const pad = 10, gap = S.narrow ? 21 : 25;
    ['L', 'R'].forEach((side) => {
      const c = cols[side].sort((a, b) => a.sy - b.sy);
      for (let i = 0; i < c.length; i++) c[i].y = Math.max(c[i].sy, top + c[i].e.h / 2, i ? c[i - 1].y + gap : -1e9);
      for (let i = c.length - 1; i >= 0; i--) c[i].y = Math.min(c[i].y, i < c.length - 1 ? c[i + 1].y - gap : bottom - c[i].e.h / 2);
      c.forEach(({ e, sx, sy, y }) => {
        const lx = side === 'L' ? pad : W - pad - e.w;
        const edge = side === 'L' ? lx + e.w : lx;
        const elbow = side === 'L' ? Math.min(sx - 8, edge + 18) : Math.max(sx + 8, edge - 18);
        e.label.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + (y - e.h / 2).toFixed(1) + 'px)';
        e.label.style.opacity = opacity;
        e.path.setAttribute('d', 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) + 'L' + elbow.toFixed(1) + ' ' + y.toFixed(1) + 'L' + edge.toFixed(1) + ' ' + y.toFixed(1));
        e.dot.setAttribute('cx', sx.toFixed(1));
        e.dot.setAttribute('cy', sy.toFixed(1));
      });
    });
  }

  /* ------------------------------------------------------------------ per-frame */

  function onFrame(dt) {
    const st = S.st;
    if (S.explode !== S.explodeTarget) {
      S.explode = SX.reducedMotion ? S.explodeTarget : S.explode + (S.explodeTarget - S.explode) * Math.min(1, dt * 6);
      if (Math.abs(S.explode - S.explodeTarget) < 0.002) S.explode = S.explodeTarget;
      applyExplode(S.explode);
      if (S.section) updateClip();
    }
    if (S.rootY !== S.rootYTarget) {
      S.rootY = SX.reducedMotion ? S.rootYTarget : S.rootY + (S.rootYTarget - S.rootY) * Math.min(1, dt * 5);
      if (Math.abs(S.rootY - S.rootYTarget) < 0.002) S.rootY = S.rootYTarget;
      S.model.root.position.y = S.rootY;
    }
    // flows fade out as the engine explodes (their routing belongs to the assembled engine)
    const fo = S.flow && !S.detail ? SX.clamp(1 - S.explode * 8, 0, 1) : 0;
    S.flows.group.visible = fo > 0.01;
    if (fo > 0.01) S.flows.list.forEach((f) => { f.mat.opacity = 0.95 * fo; if (!SX.reducedMotion) f.map.offset.x -= (dt * f.v * f.rep) / f.len; });
    if (S.pulse > 0) { S.pulse = Math.max(0, S.pulse - dt); setHighlight(); }
    // dimension lines face the camera and fade when exploded
    const dimsOn = !S.detail && S.explode < 0.2;
    S.dims.group.visible = dimsOn;
    if (dimsOn) {
      const rp = S.model.root.position;
      S.dims.group.rotation.y = Math.atan2(st.camera.position.x - rp.x, st.camera.position.z - rp.z);
      S.dims.mat.opacity = 0.85 * (1 - S.explode / 0.2);
    }
    S.narrow = st.holder.clientWidth < 560;
    const quiet = S.explode > 0.08 || !!S.detail;
    S.ui.readout.style.opacity = quiet ? '0' : '1';
    S.ui.note.style.visibility = quiet || S.flow ? 'hidden' : 'visible';
    layoutCallouts(S.detail ? 1 : SX.smooth(SX.clamp((S.explode - 0.12) / 0.3, 0, 1)));
  }

  /* ------------------------------------------------------------------ init */

  function init(mount) {
    THREE = window.THREE;
    if (!THREE) throw new Error('three.js is not available');
    readColors();
    makeTextures();
    buildDom(mount);
    const st = SX.three.stage(S.ui.viz, { fov: 30, position: [4.2, 2.6, 5], target: [0, 1.45, 0], minDistance: 0.3, maxDistance: 18, exposure: 0.95 });
    S.st = st;
    st.renderer.sortObjects = true;
    S.plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), CUT_OFF);
    S.model = buildModel(S.plane);
    st.scene.add(S.model.root);
    S.flows = buildFlows(S.model.root);
    S.dims = buildDims(st);
    S.model.root.add(S.dims.group);

    // studio lighting (colors from the palette): key, cool rim, low fill, sky/ground hemisphere
    st.scene.add(new THREE.HemisphereLight(COL.fg, COL.bg, 0.5));
    const key = new THREE.DirectionalLight(COL.fg, 1.55); key.position.set(3.5, 6, 4.5); st.scene.add(key);
    const rim = new THREE.DirectionalLight(COL.lox.clone().lerp(COL.fg, 0.55), 1.1); rim.position.set(-4.5, 3, -3.5); st.scene.add(rim);
    const fill = new THREE.DirectionalLight(COL.fg, 0.35); fill.position.set(-2, -1.5, 3); st.scene.add(fill);

    // floor grid and a soft contact shadow
    const grid = new THREE.GridHelper(7, 28, COL.line2, COL.line);
    grid.position.y = -0.2;
    grid.material.transparent = true; grid.material.opacity = 0.55; grid.material.depthWrite = false;
    st.scene.add(grid);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ map: TEX.shadow, transparent: true, depthWrite: false, opacity: 0.8 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.195;
    st.scene.add(shadow);

    st.pick([S.model.root], {
      onClick(hit) { stopSpin(); if (hit) SX.select(mapPick(hit.id)); },
      onHover: Object.assign((hit, ev) => setHover(hit ? mapPick(hit.id) : null, ev || null), {
        move(hit, ev) { if (hit && ev) { const p = SX.part(mapPick(hit.id)); if (p) SX.tip.show('<b>' + SX.esc(p.name) + '</b>' + SX.esc(firstSentence(p.summary)), ev.clientX, ev.clientY); } },
      }),
    });
    st.canvas.addEventListener('pointerdown', stopSpin);
    st.canvas.addEventListener('wheel', stopSpin, { passive: true });
    st.canvas.addEventListener('pointerleave', () => setHover(null));
    st.onFrame(onFrame);

    renderSheet();
    renderCaption();
    applyExplode(0);
    applyAll();
    homeView(true);
    if (st.controls && !SX.reducedMotion) { S.spin = true; st.controls.autoRotate = true; st.controls.autoRotateSpeed = 0.55; }

    SX.on('select', (id) => onSelect(id));
    SX.on('units', () => { renderSheet(); renderCaption(); S.dims.update(); });
    if (SX.selected) onSelect(SX.selected);

    // debug hook for headless checks
    S.debug = () => {
      let tris = 0;
      S.model.root.traverse((o) => {
        if (!o.isMesh || !o.visible) return;
        let vis = true, n = o;
        while (n) { if (!n.visible) { vis = false; break; } n = n.parent; }
        if (!vis) return;
        const g = o.geometry, c = g.index ? g.index.count / 3 : g.attributes.position.count / 3;
        tris += c * (o.isInstancedMesh ? o.count : 1);
      });
      return { tris: Math.round(tris), explode: S.explode, variant: S.variant, detail: S.detail, section: S.section, xray: S.xray, flow: S.flow, selected: S.selected };
    };
    SX.__raptor3d = S;
  }

  SX.register(VIEW, { title: '3D engine', parts: OWN, init, focus });
})();
