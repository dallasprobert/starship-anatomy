/* Starship Anatomy: raptorcycle view ("flow schematic").
   A process schematic of Raptor's full-flow staged combustion cycle with animated flow, a throttle,
   guided tours (methane, oxygen, start sequence) and a comparison of rocket engine cycles.
   Owns raptor3.cycle, raptor3.cycle.fuelPath, raptor3.cycle.oxPath, raptor3.startup, raptor3.cycles, cycles.*.
   The raptor3.* component nodes drawn here belong to raptor3d; this file only links to them. */
(function () {
  'use strict';
  const SX = window.SX;
  if (!SX) return;
  const VIEW = 'raptorcycle';

  /* =================================================================== facts this view adds */

  const EST_MODEL = 'Community Raptor 2 cycle model (Livingjw and HVM, 2022). Not published by SpaceX; shown as an illustration of Raptor 3.';
  SX.addFacts({
    'raptorcycle.pcAtRating': { v: 325, unit: 'bar', conf: 'estimate', src: ['S12', 'S2'], note: 'Not published. 350 bar x 250 tf / 269 tf, assuming thrust scales with chamber pressure at a fixed throat. Used only for the illustrative throttle readout.' },
    'raptorcycle.inletP': { v: 4, unit: 'bar', conf: 'estimate', src: ['S47'], note: 'Engine inlet pressure. ' + EST_MODEL },
    'raptorcycle.regenOutP': { v: 696, unit: 'bar', conf: 'estimate', src: ['S47'], note: 'Warm methane leaving the cooling jacket. ' + EST_MODEL },
    'raptorcycle.fuelTurbOutP': { v: 342, unit: 'bar', conf: 'estimate', src: ['S47'], note: 'Fuel-rich gas after the fuel turbine. ' + EST_MODEL },
    'raptorcycle.fuelTurbOutT': { v: 808, unit: 'K', conf: 'estimate', src: ['S47'], note: 'Fuel-rich gas after the fuel turbine. ' + EST_MODEL },
    'raptorcycle.oxTurbOutP': { v: 430, unit: 'bar', conf: 'estimate', src: ['S47'], note: 'Oxygen-rich gas after the oxygen turbine. ' + EST_MODEL },
    'raptorcycle.f13AbortEngines': { v: 4, unit: 'engines', conf: 'official', src: ['S26', 'S49'], note: 'SpaceX: four of the 33 Super Heavy Raptor engines aborted at startup due to issues with their ox turbopumps (first Flight 13 attempt, 2026-07-16). NSF reported six engines replaced for low LOX pump pressure from moisture.' },
    'raptorcycle.oxTurbOutT': { v: 707, unit: 'K', conf: 'estimate', src: ['S47'], note: 'Oxygen-rich gas after the oxygen turbine. ' + EST_MODEL },

    'cycles.merlin1d.pc': { v: 97, unit: 'bar', conf: 'reported', src: ['S31'], note: 'About 9.7 MPa (Everyday Astronaut, 2019). SpaceX does not publish Merlin 1D chamber pressure.' },
    'cycles.merlin1d.ispSL': { v: 282, unit: 's', conf: 'reported', src: ['S123'], note: 'Sea level. SpaceX Falcon 9 page (2013) as cited by Wikipedia; a dated figure.' },
    'cycles.merlin1d.ispVac': { v: 311, unit: 's', conf: 'reported', src: ['S123'], note: 'Vacuum, sea-level engine. SpaceX Falcon 9 page (2013) as cited by Wikipedia.' },
    'cycles.rd180.pc': { v: 256.6, unit: 'bar', conf: 'reported', src: ['S120'], note: '3,722 psia. Manufacturer data (NPO Energomash and Pratt & Whitney) as published by Spaceflight Now.' },
    'cycles.rd180.ispSL': { v: 311.3, unit: 's', conf: 'reported', src: ['S120'], note: 'Sea level. Manufacturer data as published by Spaceflight Now.' },
    'cycles.rd180.ispVac': { v: 337.8, unit: 's', conf: 'reported', src: ['S120'], note: 'Vacuum. Manufacturer data as published by Spaceflight Now.' },
    'cycles.rs25.pc': { v: 206.4, unit: 'bar', conf: 'official', src: ['S121'], note: '2,994 psia. Manufacturer specification (L3Harris) for the NASA SLS engine.' },
    'cycles.rs25.ispSL': { v: 366, unit: 's', conf: 'official', src: ['S121'], note: 'Sea level. Manufacturer specification (L3Harris).' },
    'cycles.rs25.ispVac': { v: 452.3, unit: 's', conf: 'official', src: ['S121'], note: 'Vacuum. Manufacturer specification (L3Harris).' },
    'cycles.rl10.pc': { v: 43.6, unit: 'bar', conf: 'reported', src: ['S122'], note: '633 psi, RL10B-2 (National Research Council review, 2006).' },
    'cycles.rl10.ispVac': { v: 465.5, unit: 's', conf: 'reported', src: ['S122'], note: 'Vacuum, RL10B-2 with its extendible nozzle (National Research Council review, 2006).' },
  }, {
    S120: { title: 'The RD-180 engine', publisher: 'Spaceflight Now', date: '2002-02-19', url: 'https://spaceflightnow.com/atlas/ac204/020219rd180.html' },
    S121: { title: 'RS-25 Propulsion System (specification sheet)', publisher: 'L3Harris', date: '2024-07', url: 'https://l3harris.com/sites/default/files/2024-07/l3harris-ar-rs-25-spec-sheet.pdf' },
    S122: { title: 'A Review of United States Air Force and Department of Defense Aerospace Propulsion Needs (RL10B-2 data)', publisher: 'National Research Council', date: '2006', url: 'https://www.nationalacademies.org/read/11780/chapter/13' },
    S123: { title: 'Merlin (rocket engine), used as a pointer to the SpaceX Falcon 9 page (2013)', publisher: 'Wikipedia', date: '2026-09', url: 'https://en.wikipedia.org/wiki/Merlin_(rocket_engine)' },
    S124: { title: 'Integrated Powerhead Demonstrator reaches mainstage (AFRL/NASA release)', publisher: 'Spaceflight Now', date: '2006-07-20', url: 'https://spaceflightnow.com/news/n0607/20ipd/' },
    S125: { title: 'ITS Propulsion: The evolution of the SpaceX Raptor engine', publisher: 'NASASpaceflight', date: '2016-10-03', url: 'https://www.nasaspaceflight.com/2016/10/its-propulsion-evolution-raptor-engine/' },
    S126: { title: 'Raptor 3 SN1 at McGregor (official photo; coolant supply pipe routing)', publisher: 'SpaceX', date: '2024-08-02', url: 'https://sxcontent9668.azureedge.us/cms-assets/assets/Raptor_V3_Mc_G_20240802_1w3a8289_daa3a51ef3.jpg' },
  });

  /* =================================================================== part content (owned ids) */

  SX.addParts([
    {
      id: 'raptor3.cycle', parent: 'raptor3', view: VIEW, order: 80,
      name: 'Full-flow staged combustion', short: 'FFSC', kind: 'Engine cycle',
      summary: 'How Raptor turns two cold liquids into a jet near {{raptor.r3.chamberTemp}}: each propellant is pumped, partly burned to drive its own turbine, and delivered to the main chamber as a hot gas. Nothing is dumped overboard.',
      body: [
        'Every pump-fed engine needs turbines to spin its pumps, and turbines need hot gas. Raptor makes that gas in two preburners. The fuel-rich preburner burns nearly all of the methane with a little oxygen and drives the methane pump. The oxygen-rich preburner burns nearly all of the oxygen with a little methane and drives the oxygen pump. Both exhaust streams then flow into the main injector, so essentially all of both propellants passes through a turbine.',
        'Because the whole flow drives the turbines, each one can make its power at a lower temperature, which is easier on the blades. Each pump is driven by gas rich in the propellant it pumps, so no shaft carries fuel on one side and oxygen on the other and no inter-propellant seal is needed. The propellants reach the injector as two gases, which mix and burn quickly in a compact chamber.',
        'The price is complexity and a hard start. There are two preburners and two hot-gas systems, and one turbine runs in hot, high-pressure oxygen-rich gas that attacks most metals. SpaceX developed its own superalloys, SX300 and then SX500, for those parts.',
        'SpaceX publishes thrust, mass and one demonstrated chamber pressure. Every station pressure and temperature inside the engine on this page comes from a community model of Raptor 2 and is marked as an estimate.',
      ],
      specs: [
        { label: 'Chamber pressure, demonstrated (2023 test)', fact: 'raptor.r3.chamberPressure' },
        { label: 'Chamber pressure at 250 tf rating', fact: 'raptorcycle.pcAtRating' },
        { label: 'Combustion temperature (typical methalox)', fact: 'raptor.r3.chamberTemp' },
        { label: 'Mixture ratio', fact: 'raptor.r3.ofRatio' },
        { label: 'Preburner pressure (model)', fact: 'raptor.r3.preburnerPressure' },
        { label: 'Fuel-rich preburner gas (model)', fact: 'raptor.r3.fuelPreburnerTemp' },
        { label: 'Oxygen-rich preburner gas (model)', fact: 'raptor.r3.oxPreburnerTemp' },
        { label: 'Hot oxygen turbopump alloy', fact: 'raptor.material.sx500' },
      ],
      related: ['raptor3.cycle.fuelPath', 'raptor3.cycle.oxPath', 'raptor3.startup', 'raptor3.cycles', 'raptor3.regen', 'raptor3.press'],
    },
    {
      id: 'raptor3.cycle.fuelPath', parent: 'raptor3.cycle', view: VIEW, order: 1,
      name: 'Methane path', kind: 'Flow path',
      summary: 'Liquid methane is pumped to the highest pressure in the engine, cools the nozzle and chamber walls, drives the fuel turbine as fuel-rich gas, and finally burns in the main chamber.',
      body: [
        'Subcooled methane enters at the top of the engine on the fuel-pump side. The fuel turbopump raises it to roughly {{raptor.r3.ftpDischarge}} (community estimate), far above chamber pressure, because the methane still has to push through the cooling channels, a preburner and a turbine before it reaches the chamber.',
        'A large pipe carries it to a ring manifold around the upper nozzle. On Raptor 3 that pipe leaves the fuel pump, loops over the top of the engine and runs down the far side (SpaceX photo of Raptor 3 SN1). From the manifold the methane flows through channels in the nozzle, throat and chamber walls, soaking up heat, and leaves the jacket warm and supercritical.',
        'Most of the warm methane feeds the fuel-rich preburner, where a small flow of oxygen burns just enough of it to make hot methane-rich gas, about {{raptor.r3.fuelPreburnerTemp}} (estimate). That gas spins the fuel turbine and flows on to the main injector. A small share becomes the only fuel of the oxygen-rich preburner, and some is tapped off to pressurize the methane tank.',
      ],
      specs: [
        { label: 'Engine inlet (model)', fact: 'raptorcycle.inletP' },
        { label: 'Fuel pump discharge (model)', fact: 'raptor.r3.ftpDischarge' },
        { label: 'Leaving the cooling jacket (model)', fact: 'raptorcycle.regenOutP' },
        { label: 'Fuel-rich preburner (model)', fact: 'raptor.r3.fuelPreburnerTemp' },
        { label: 'After the fuel turbine (model)', fact: 'raptorcycle.fuelTurbOutP' },
        { label: 'After the fuel turbine, temperature (model)', fact: 'raptorcycle.fuelTurbOutT' },
        { label: 'Methane boiling point', fact: 'propellant.ch4Boil' },
      ],
      related: ['raptor3.ch4Inlet', 'raptor3.ftp', 'raptor3.regen', 'raptor3.fpb', 'raptor3.fuelDuct', 'raptor3.injector'],
    },
    {
      id: 'raptor3.cycle.oxPath', parent: 'raptor3.cycle', view: VIEW, order: 2,
      name: 'Oxygen path', kind: 'Flow path',
      summary: 'Liquid oxygen is pumped straight to high pressure, burns with a little methane in the oxygen-rich preburner, drives the oxygen turbine and enters the injector as hot oxygen-rich gas.',
      body: [
        'Liquid oxygen enters at the top center of the engine and goes straight into the oxygen turbopump, which community analysis places on the engine centerline. Pump discharge is around {{raptor.r3.otpDischarge}} (community estimate); in 2018 Musk described a "~800 atmosphere, hot, oxygen-rich turbopump".',
        'A small share of the pumped oxygen goes to the fuel-rich preburner. The rest feeds the oxygen-rich preburner, where a small flow of warm methane burns in a large excess of oxygen, about {{raptor.r3.oxPreburnerTemp}} (estimate). That gas drives the oxygen turbine and flows down into the main injector.',
        'Some oxygen is heated into gas for tank pressurization. Community models put that heat exchanger in the oxygen-rich turbine exhaust; on Raptor 3 the tap-offs are internal and their locations are not public.',
        'The oxygen side has caused real trouble. Filter blockages starved the oxygen pumps on Flights 2 and 3, and on the first Flight 13 attempt {{raptorcycle.f13AbortEngines}} on the booster aborted at startup with oxygen turbopump issues.',
      ],
      specs: [
        { label: 'Engine inlet (model)', fact: 'raptorcycle.inletP' },
        { label: 'Oxygen pump discharge (model)', fact: 'raptor.r3.otpDischarge' },
        { label: 'Oxygen-rich preburner (model)', fact: 'raptor.r3.oxPreburnerTemp' },
        { label: 'After the oxygen turbine (model)', fact: 'raptorcycle.oxTurbOutP' },
        { label: 'After the oxygen turbine, temperature (model)', fact: 'raptorcycle.oxTurbOutT' },
        { label: 'Oxygen boiling point', fact: 'propellant.loxBoil' },
      ],
      related: ['raptor3.loxInlet', 'raptor3.otp', 'raptor3.opb', 'raptor3.oxDuct', 'raptor3.press', 'raptor3.injector'],
    },
    {
      id: 'raptor3.startup', parent: 'raptor3', view: VIEW, order: 81,
      name: 'Start sequence', kind: 'Operation',
      summary: 'Starting a full-flow engine is a bootstrapping problem. Each preburner needs propellant from both pumps, and the pumps only turn once the preburners burn. Raptor breaks the loop by spinning its turbopumps with stored gas, then lighting the preburners.',
      body: [
        'The flow schematic steps through a generalized full-flow start, because SpaceX has not published the real one. The hardware is chilled and purged, stored gas spins both turbopumps, the igniters fire, the two preburners light, the hot gases meet and ignite in the main chamber, and the engine ramps to mainstage.',
        'SpaceX says every Raptor 3 variant has a "redesigned ignition system" and that Starship V3 enables "a new Raptor startup method". NASASpaceflight reports acoustic igniters with no spark or moving parts, and spin start with gaseous oxygen and methane from onboard pressure vessels. SpaceX has confirmed neither detail. Earlier Raptors spun up on helium or nitrogen, and the outer 20 engines of first-generation boosters were started with gas supplied from the ground.',
        'Starts remain the hardest phase. Raptor 2 relight failures were traced to low igniter power and to thermal conditions around the torch igniters (Flights 7 and 8). On V3 every booster engine can restart, and Flight 13 flew the high-thrust part of its boostback with all {{booster.enginesRelight}}, yet every V3 flight so far has had engines that failed to start or relight.',
      ],
      specs: [
        { label: 'Ignition', value: 'Redesigned system (SpaceX); acoustic igniters reported by NSF', conf: 'reported' },
        { label: 'Spin-start gas', value: 'Gaseous oxygen and methane (NSF)', conf: 'reported' },
        { label: 'Booster engines able to relight', fact: 'booster.enginesRelight' },
        { label: 'First Raptor 3 in-space relight', fact: 'raptor.r3.firstInSpaceRelight' },
        { label: 'Engines aborted at startup, Flight 13 first attempt', fact: 'raptorcycle.f13AbortEngines' },
      ],
      related: ['raptor3.igniters', 'raptor3.opb', 'raptor3.fpb', 'raptor3.otp', 'raptor3.ftp', 'raptor3.cycle'],
    },
    {
      id: 'raptor3.cycles', parent: 'raptor3', view: VIEW, order: 82,
      name: 'Engine cycles compared', kind: 'Comparison',
      summary: 'Five ways to power a rocket engine\'s pumps. The clearest difference between them is where the turbine exhaust goes.',
      body: [
        'A gas generator engine burns a little propellant to spin its turbine and throws the exhaust away. Staged combustion engines route that exhaust into the main chamber, so every kilogram contributes full thrust and the pumps can push the chamber to far higher pressure. An expander engine has no combustion before the chamber at all: heat picked up in the cooling jacket drives its turbine.',
        'Full flow is staged combustion taken to its limit. Two earlier full-flow engines reached test stands, the Soviet RD-270 in the 1960s and the US Integrated Powerhead Demonstrator in 2006, but neither flew. Raptor was the first.',
        'Specific impulse mostly reflects the propellant. Hydrogen engines such as RS-25 and RL10 post the highest figures because hydrogen exhaust is light. Chamber pressure shows more clearly what a cycle makes possible.',
      ],
      specs: [
        { label: 'Raptor 3, demonstrated', fact: 'raptor.r3.chamberPressure' },
        { label: 'RD-180 (oxygen-rich staged)', fact: 'cycles.rd180.pc' },
        { label: 'RS-25 (fuel-rich staged)', fact: 'cycles.rs25.pc' },
        { label: 'Merlin 1D (gas generator)', fact: 'cycles.merlin1d.pc' },
        { label: 'RL10B-2 (expander)', fact: 'cycles.rl10.pc' },
      ],
      related: ['raptor3.cycle'],
    },
    {
      id: 'cycles.gg', parent: 'raptor3.cycles', view: VIEW, order: 1,
      name: 'Gas generator cycle', short: 'GG', kind: 'Engine cycle',
      summary: 'A small side stream of fuel and oxygen burns in a gas generator, spins the turbine, and is dumped overboard. Example: SpaceX Merlin 1D on Falcon 9.',
      body: [
        'The simplest pump-fed cycle. The turbine loop is separate from the main chamber, so the pumps can be tuned without disturbing combustion, and only a small, cool gas generator has to be developed alongside the chamber.',
        'The dumped gas never produces full thrust, and it must be cool enough for the turbine blades, so the generator runs far off the ideal mixture. The pumps also have to supply every bit of chamber pressure with that small side stream, which keeps chamber pressure modest.',
        'Merlin burns kerosene (RP-1). Its fuel-rich gas generator exhaust leaves soot; methane avoids that problem.',
      ],
      specs: [
        { label: 'Merlin 1D chamber pressure', fact: 'cycles.merlin1d.pc' },
        { label: 'Merlin 1D Isp, sea level', fact: 'cycles.merlin1d.ispSL' },
        { label: 'Merlin 1D Isp, vacuum', fact: 'cycles.merlin1d.ispVac' },
      ],
      related: ['cycles.ffsc'],
    },
    {
      id: 'cycles.orsc', parent: 'raptor3.cycles', view: VIEW, order: 2,
      name: 'Oxygen-rich staged combustion', short: 'ORSC', kind: 'Engine cycle',
      summary: 'All of the oxygen and a little fuel burn in one preburner; the oxygen-rich gas drives the turbopump and then enters the main chamber. Example: RD-180 (Atlas V). Blue Origin\'s methane BE-4 uses the same cycle.',
      body: [
        'Nothing is wasted, so chamber pressure can climb far above a gas generator engine. The fuel reaches the chamber separately, usually after cooling the chamber walls.',
        'The turbine runs in hot, high-pressure oxygen-rich gas, which burns most metals, so it needs special alloys. Raptor\'s oxygen side faces the same problem, which SpaceX answered with its SX500 superalloy.',
      ],
      specs: [
        { label: 'RD-180 chamber pressure', fact: 'cycles.rd180.pc' },
        { label: 'RD-180 Isp, sea level', fact: 'cycles.rd180.ispSL' },
        { label: 'RD-180 Isp, vacuum', fact: 'cycles.rd180.ispVac' },
      ],
      related: ['cycles.ffsc', 'raptor3.opb'],
    },
    {
      id: 'cycles.frsc', parent: 'raptor3.cycles', view: VIEW, order: 3,
      name: 'Fuel-rich staged combustion', short: 'FRSC', kind: 'Engine cycle',
      summary: 'All of the fuel and a little oxygen burn in fuel-rich preburners (RS-25 has two); the fuel-rich gas drives the turbopumps and then enters the main chamber. Example: RS-25 (Space Shuttle, SLS).',
      body: [
        'Fuel-rich turbine gas is gentle on metal, and hydrogen leaves no soot, so this cycle suits hydrogen engines well. Kerosene is a poor fit because it cokes in a fuel-rich preburner.',
        'The oxygen pump is driven by fuel-rich gas, so its shaft needs elaborate seals and purges to keep fuel and oxygen apart. Full flow removes that seal by giving the oxygen pump its own oxygen-rich turbine.',
      ],
      specs: [
        { label: 'RS-25 chamber pressure', fact: 'cycles.rs25.pc' },
        { label: 'RS-25 Isp, sea level', fact: 'cycles.rs25.ispSL' },
        { label: 'RS-25 Isp, vacuum', fact: 'cycles.rs25.ispVac' },
      ],
      related: ['cycles.ffsc', 'raptor3.fpb'],
    },
    {
      id: 'cycles.exp', parent: 'raptor3.cycles', view: VIEW, order: 4,
      name: 'Expander cycle', short: 'EXP', kind: 'Engine cycle',
      summary: 'No preburner at all: the fuel is warmed in the chamber\'s cooling jacket and the expanding gas drives the turbine before it enters the chamber. Example: RL10 upper-stage engines.',
      body: [
        'With no combustion before the main chamber, a whole class of failures disappears. Hydrogen works well because it absorbs a lot of heat and expands strongly.',
        'Turbine power is limited by the heat the cooling jacket can pick up, and that heat grows more slowly than engine size. Chamber pressure and thrust stay small, so expanders live on upper stages.',
      ],
      specs: [
        { label: 'RL10B-2 chamber pressure', fact: 'cycles.rl10.pc' },
        { label: 'RL10B-2 Isp, vacuum', fact: 'cycles.rl10.ispVac' },
      ],
      related: ['cycles.ffsc', 'raptor3.regen'],
    },
    {
      id: 'cycles.ffsc', parent: 'raptor3.cycles', view: VIEW, order: 5,
      name: 'Full-flow staged combustion', short: 'FFSC', kind: 'Engine cycle',
      summary: 'Two preburners, one fuel-rich and one oxygen-rich, each driving its own turbopump; both exhausts enter the main chamber. Example: Raptor, the first full-flow engine to fly.',
      body: [
        'The turbines share the entire propellant flow, so they can run cooler for the same power. Each pump shaft sees only one propellant, so there is no inter-propellant seal. Both propellants arrive at the injector as gases and burn quickly in a compact chamber.',
        'The costs are two preburners, two hot-gas systems, an oxygen-rich turbine that needs special alloys, and a hard start in which each preburner needs both pumps running. The Soviet RD-270 (1960s) and the US Integrated Powerhead Demonstrator (2006) ran on test stands but never flew.',
      ],
      specs: [
        { label: 'Raptor 3 chamber pressure, demonstrated', fact: 'raptor.r3.chamberPressure' },
        { label: 'Raptor 2 chamber pressure', fact: 'raptor.r2.chamberPressure' },
        { label: 'Raptor 3 Isp, sea level', fact: 'raptor.r3.ispSL' },
        { label: 'Raptor 3 Isp as listed (vacuum reading)', fact: 'raptor.r3.ispVac' },
      ],
      related: ['raptor3.cycle', 'raptor3.cycle.fuelPath', 'raptor3.cycle.oxPath'],
    },
  ]);

  /* One-line fallbacks for the component nodes raptor3d owns, used only for tooltips when those nodes are not registered. */
  const FALLBACK = {
    'raptor3.loxInlet': ['LOX inlet', 'Receives liquid oxygen from the vehicle feedline.'],
    'raptor3.ch4Inlet': ['Methane inlet', 'Receives liquid methane from the vehicle feedline.'],
    'raptor3.otp': ['Oxygen turbopump', 'Pumps liquid oxygen, driven by an oxygen-rich turbine on the same shaft.'],
    'raptor3.otp.pump': ['Oxygen pump', 'Raises liquid oxygen to very high pressure.'],
    'raptor3.otp.shaft': ['Oxygen turbopump shaft', 'Carries turbine power to the oxygen pump. It sees only oxygen, so no inter-propellant seal is needed.'],
    'raptor3.otp.turbine': ['Oxygen turbine', 'Driven by hot oxygen-rich gas from the oxygen-rich preburner.'],
    'raptor3.ftp': ['Methane turbopump', 'Pumps liquid methane, driven by a fuel-rich turbine on the same shaft.'],
    'raptor3.ftp.pump': ['Methane pump', 'Raises liquid methane to the highest pressure in the engine.'],
    'raptor3.ftp.shaft': ['Methane turbopump shaft', 'Carries turbine power to the methane pump. It sees only methane.'],
    'raptor3.ftp.turbine': ['Methane turbine', 'Driven by hot fuel-rich gas from the fuel-rich preburner.'],
    'raptor3.opb': ['Oxygen-rich preburner', 'Burns nearly all the oxygen with a little methane to drive the oxygen turbine.'],
    'raptor3.fpb': ['Fuel-rich preburner', 'Burns nearly all the methane with a little oxygen to drive the methane turbine.'],
    'raptor3.oxDuct': ['Oxygen-rich hot-gas duct', 'Carries oxygen-rich turbine exhaust to the main injector.'],
    'raptor3.fuelDuct': ['Fuel-rich hot-gas duct', 'Carries fuel-rich turbine exhaust to the main injector.'],
    'raptor3.injector': ['Main injector', 'Mixes the two hot gas streams at the head of the chamber.'],
    'raptor3.mcc': ['Main combustion chamber', 'Burns the two gases at very high pressure and accelerates them to sonic speed at the throat.'],
    'raptor3.regen': ['Regenerative cooling', 'Methane flows through channels in the chamber and nozzle walls before it burns.'],
    'raptor3.nozzle': ['Nozzle', 'Expands the exhaust to produce thrust.'],
    'raptor3.igniters': ['Igniters', 'Light the preburners at every start and relight.'],
    'raptor3.press': ['Autogenous pressurization', 'Engine-heated oxygen and methane gas piped back to keep the tanks pressurized.'],
    'booster.loxTank': ['LOX tank', 'Vehicle liquid oxygen tank.'],
    'booster.ch4Tank': ['Methane tank', 'Vehicle liquid methane tank.'],
  };

  /* =================================================================== styles (scoped to .v-raptorcycle) */

  SX.css(`
.v-raptorcycle { display: grid; gap: clamp(44px, 6vw, 80px); }
.v-raptorcycle .rc-main { display: grid; grid-template-columns: minmax(0, 1fr) minmax(300px, 344px); gap: 18px; align-items: start; }
.v-raptorcycle .rc-fig { grid-column: 1; grid-row: 1; min-width: 0; position: relative; }
.v-raptorcycle .rc-side { grid-column: 2; grid-row: 1; position: sticky; top: calc(var(--topbar) + 14px); display: grid; gap: 12px; min-width: 0; }
.v-raptorcycle .rc-panel { background: var(--bg-2); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px 16px 16px; min-width: 0; }
.v-raptorcycle .rc-modes { display: flex; width: 100%; }
.v-raptorcycle .rc-modes button { flex: 1 1 0; padding: 9px 4px; }
.v-raptorcycle .rc-step-meta { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-top: 14px; font: 500 11px/1.2 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.v-raptorcycle .rc-step-meta b { color: var(--accent); font-weight: 500; }
.v-raptorcycle .rc-step-title { font: 600 21px/1.1 var(--font-display); text-transform: uppercase; letter-spacing: 0.03em; margin-top: 6px; color: var(--fg); }
.v-raptorcycle .rc-step-text { font-size: 14px; line-height: 1.55; color: var(--fg-2); margin-top: 8px; }
.v-raptorcycle .rc-step-text p + p { margin-top: 0.55em; }
.v-raptorcycle .rc-step-text b { color: var(--fg); font-weight: 600; }
.v-raptorcycle .rc-caveat { margin-top: 10px; padding: 6px 0 6px 10px; border-left: 2px solid var(--warn); font-size: 12.5px; line-height: 1.45; color: var(--fg-2); }
.v-raptorcycle .rc-dots { display: flex; gap: 3px; margin-top: 14px; }
.v-raptorcycle .rc-dots button { flex: 1 1 0; height: 14px; padding: 0; border: 0; background: none; cursor: pointer; position: relative; }
.v-raptorcycle .rc-dots button::before { content: ""; position: absolute; left: 0; right: 0; top: 6px; height: 3px; border-radius: 2px; background: var(--line-2); }
.v-raptorcycle .rc-dots button.done::before { background: var(--steel-2); }
.v-raptorcycle .rc-dots button[aria-current="step"]::before { background: var(--accent); }
.v-raptorcycle .rc-step-nav { display: flex; gap: 8px; margin-top: 10px; align-items: center; flex-wrap: wrap; }
.v-raptorcycle .rc-step-nav .rc-grow { flex: 1; }
.v-raptorcycle .rc-intro-actions { display: grid; gap: 8px; margin-top: 14px; }
.v-raptorcycle .rc-intro-actions .btn { justify-content: space-between; }
.v-raptorcycle .rc-kbd { font: 500 10px/1 var(--font-mono); color: var(--muted); letter-spacing: 0.08em; }
.v-raptorcycle .rc-read { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 12px 0 0; }
.v-raptorcycle .rc-read div { border-top: 1px solid var(--line-2); padding-top: 6px; min-width: 0; }
.v-raptorcycle .rc-read dt { font: 500 10px/1.25 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.v-raptorcycle .rc-read dd { margin: 4px 0 0; font: 600 21px/1.05 var(--font-display); letter-spacing: 0.01em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.v-raptorcycle .rc-note { font-size: 12px; line-height: 1.5; color: var(--muted); margin-top: 10px; }
.v-raptorcycle .rc-note .fact { color: var(--fg-2); }
.v-raptorcycle .rc-ctl-row { display: flex; gap: 10px; align-items: center; }
.v-raptorcycle .rc-ctl-row .range-row { flex: 1; min-width: 0; }
.v-raptorcycle .rc-legend { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px 12px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); font: 500 10.5px/1.3 var(--font-mono); letter-spacing: 0.03em; color: var(--fg-2); }
.v-raptorcycle .rc-legend span { display: flex; align-items: center; gap: 8px; min-width: 0; }
.v-raptorcycle .rc-legend svg { flex: none; width: 24px; height: 10px; overflow: visible; }
.v-raptorcycle .rc-scroll { overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; scrollbar-color: var(--line-2) transparent; overscroll-behavior-x: contain; }
.v-raptorcycle .viz svg.rc-svg { display: block; width: 100%; height: auto; max-height: calc(100vh - var(--topbar) - 36px); min-width: 780px; -webkit-user-select: none; user-select: none; -webkit-tap-highlight-color: transparent; }
.v-raptorcycle .rc-fig-foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 16px; margin-top: 8px; font: 500 11px/1.4 var(--font-mono); color: var(--muted); letter-spacing: 0.03em; }
.v-raptorcycle .rc-swipe { display: none; }
@media (max-width: 1099px) {
  .v-raptorcycle .rc-main { grid-template-columns: minmax(0, 1fr); }
  .v-raptorcycle .rc-side { display: contents; }
  .v-raptorcycle .rc-tour { order: 1; }
  .v-raptorcycle .rc-ctl { order: 2; }
  .v-raptorcycle .rc-fig { order: 3; grid-column: auto; grid-row: auto; }
  .v-raptorcycle.rc-touring .rc-tour { position: sticky; top: calc(var(--topbar) + 6px); z-index: 5; box-shadow: 0 14px 30px var(--bg); }
}
@media (max-width: 840px) { .v-raptorcycle .rc-swipe { display: inline; } }
@media (max-width: 760px) {
  .v-raptorcycle .rc-panel { padding: 12px 13px 14px; }
  .v-raptorcycle .rc-step-title { font-size: 19px; }
  .v-raptorcycle .rc-step-text { font-size: 13.5px; }
  .v-raptorcycle.rc-touring .rc-step-text { max-height: 9.6em; overflow-y: auto; }
  .v-raptorcycle .rc-read dd { font-size: 18px; }
  .v-raptorcycle .rc-legend { grid-template-columns: minmax(0, 1fr); }
}

/* ---- schematic */
.v-raptorcycle .rc-svg text { font-family: var(--font-mono); }
.v-raptorcycle .rc-svg .lbl { pointer-events: none; }
.v-raptorcycle .rc-svg .t-lbl { fill: var(--fg); font-size: 13px; font-weight: 500; letter-spacing: 0.05em; }
.v-raptorcycle .rc-svg .t-sub { fill: var(--muted); font-size: 11.5px; letter-spacing: 0.05em; }
.v-raptorcycle .rc-svg .t-tiny { fill: var(--muted); font-size: 10.5px; letter-spacing: 0.06em; }
.v-raptorcycle .rc-svg .t-in { fill: var(--fg-2); font-size: 11px; font-weight: 500; letter-spacing: 0.08em; }
.v-raptorcycle .rc-svg .t-title { fill: var(--fg); font-family: var(--font-display); font-size: 17px; font-weight: 600; letter-spacing: 0.1em; }
.v-raptorcycle .rc-svg .t-warn { fill: var(--warn); }
.v-raptorcycle .rc-svg .leader { stroke: var(--steel-2); stroke-width: 1; fill: none; }
.v-raptorcycle .rc-svg .leader-dot { fill: var(--steel-2); }
.v-raptorcycle .rc-svg .iface { stroke: var(--line-2); stroke-width: 1; stroke-dasharray: 6 5; fill: none; }
.v-raptorcycle .rc-svg .fl-lox, .v-raptorcycle .rc-svg .fl-gox { --c: var(--lox); }
.v-raptorcycle .rc-svg .fl-ch4, .v-raptorcycle .rc-svg .fl-ch4w, .v-raptorcycle .rc-svg .fl-gch4 { --c: var(--ch4); }
.v-raptorcycle .rc-svg .fl-oxgas { --c: var(--oxgas); }
.v-raptorcycle .rc-svg .fl-fuelgas { --c: var(--fuelgas); }
.v-raptorcycle .rc-svg .fl-mix { --c: var(--mix); }
.v-raptorcycle .rc-svg .fl-spin { --c: var(--muted); }
.v-raptorcycle .rc-svg .p-case { fill: none; stroke: var(--bg); stroke-linecap: round; stroke-linejoin: round; }
.v-raptorcycle .rc-svg .p-base { fill: none; stroke: var(--c); stroke-opacity: 0.32; stroke-linecap: round; stroke-linejoin: round; transition: stroke-opacity 0.15s; }
.v-raptorcycle .rc-svg .p-flow { fill: none; stroke: var(--c); stroke-linejoin: round; pointer-events: none; }
.v-raptorcycle .rc-svg .p-flow.liq { stroke-linecap: butt; }
.v-raptorcycle .rc-svg .p-flow.gas { stroke-linecap: round; }
.v-raptorcycle .rc-svg .p-hit { fill: none; stroke: transparent; stroke-width: 16px; pointer-events: stroke; }
.v-raptorcycle .rc-svg .p-unknown { fill: none; stroke: var(--ch4); stroke-opacity: 0.5; stroke-width: 2; stroke-dasharray: 2 5; stroke-linecap: round; }
.v-raptorcycle .rc-svg .arrow { fill: var(--c); }
.v-raptorcycle .rc-svg .pipe:hover .p-base, .v-raptorcycle .rc-svg .pipe.is-tip .p-base { stroke-opacity: 0.65; }
.v-raptorcycle .rc-svg .c-body { fill: var(--bg-3); stroke: var(--steel-2); stroke-width: 1.5; transition: stroke 0.15s; }
.v-raptorcycle .rc-svg .c-lox { stroke: var(--lox); }
.v-raptorcycle .rc-svg .c-ch4 { stroke: var(--ch4); }
.v-raptorcycle .rc-svg .c-oxgas { stroke: var(--oxgas); }
.v-raptorcycle .rc-svg .c-fuelgas { stroke: var(--fuelgas); }
.v-raptorcycle .rc-svg .c-tint-ox { fill: color-mix(in srgb, var(--oxgas) 14%, var(--bg-3)); }
.v-raptorcycle .rc-svg .c-tint-fuel { fill: color-mix(in srgb, var(--fuelgas) 14%, var(--bg-3)); }
.v-raptorcycle .rc-svg .c-glyph { fill: none; stroke: var(--steel); stroke-width: 1.2; stroke-linecap: round; opacity: 0.75; }
.v-raptorcycle .rc-svg .c-flame-ox { fill: var(--oxgas); opacity: 0.6; }
.v-raptorcycle .rc-svg .c-flame-fuel { fill: var(--fuelgas); opacity: 0.6; }
.v-raptorcycle .rc-svg .c-tank { fill: var(--bg-2); stroke: var(--steel-2); stroke-width: 1.5; transition: stroke 0.15s; }
.v-raptorcycle .rc-svg .rc-part:hover .c-tank, .v-raptorcycle .rc-svg .rc-part.is-hover .c-tank { stroke: var(--fg); }
.v-raptorcycle .rc-svg .c-liq-lox { fill: var(--lox); opacity: 0.14; }
.v-raptorcycle .rc-svg .c-liq-ch4 { fill: var(--ch4); opacity: 0.14; }
.v-raptorcycle .rc-svg .c-surf-lox { stroke: var(--lox); opacity: 0.6; stroke-width: 1.2; }
.v-raptorcycle .rc-svg .c-surf-ch4 { stroke: var(--ch4); opacity: 0.6; stroke-width: 1.2; }
.v-raptorcycle .rc-svg .c-wall { fill: none; stroke: var(--steel); stroke-width: 3; stroke-linejoin: round; transition: stroke 0.15s; }
.v-raptorcycle .rc-svg .c-liner { fill: none; stroke: var(--copper); stroke-width: 1.6; }
.v-raptorcycle .rc-svg .c-flange { fill: var(--steel-2); }
.v-raptorcycle .rc-svg .c-valve { fill: var(--bg-3); stroke: var(--fg-2); stroke-width: 1.2; }
.v-raptorcycle .rc-svg .c-plate { stroke: var(--steel); stroke-width: 3; }
.v-raptorcycle .rc-svg .c-elem { fill: var(--steel-2); }
.v-raptorcycle .rc-svg .c-spark { fill: none; stroke: var(--warn); stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
.v-raptorcycle .rc-svg .c-ring { fill: none; stroke: var(--ch4); stroke-width: 2.5; }
.v-raptorcycle .rc-svg .c-ring-back { fill: none; stroke: var(--ch4); stroke-opacity: 0.35; stroke-width: 1.5; }
.v-raptorcycle .rc-svg .rc-part { cursor: pointer; outline: none; }
.v-raptorcycle .rc-svg .rc-part:hover .c-body, .v-raptorcycle .rc-svg .rc-part.is-hover .c-body { stroke: var(--fg); }
.v-raptorcycle .rc-svg .rc-part:hover .c-wall, .v-raptorcycle .rc-svg .rc-part.is-hover .c-wall { stroke: var(--fg); }
.v-raptorcycle .rc-svg .rc-part.is-selected .c-body, .v-raptorcycle .rc-svg .rc-part.is-selected .c-wall,
.v-raptorcycle .rc-svg .rc-part.is-selected .c-tank { stroke: var(--accent); }
.v-raptorcycle .rc-svg .rc-part.is-selected .p-base { stroke-opacity: 0.75; }
.v-raptorcycle .rc-svg .rc-part:focus-visible { filter: drop-shadow(0 0 3px var(--accent)) drop-shadow(0 0 1px var(--accent)); }
.v-raptorcycle .rc-svg [data-key] { transition: opacity 0.3s; }
.v-raptorcycle .rc-svg.is-touring [data-key]:not(.is-lit) { opacity: 0.13; }
.v-raptorcycle .rc-svg .rc-marker { pointer-events: none; }
.v-raptorcycle .rc-svg .rc-marker .ring { fill: none; stroke: var(--accent); stroke-width: 2; transform-box: fill-box; transform-origin: center; animation: rcRing 1.8s ease-out infinite; }
.v-raptorcycle .rc-svg .rc-marker .badge { fill: var(--accent); }
.v-raptorcycle .rc-svg .rc-marker .badge-t { fill: var(--accent-ink); font-size: 12px; font-weight: 600; text-anchor: middle; }
@keyframes rcRing { 0% { transform: scale(0.7); opacity: 0.95; } 100% { transform: scale(1.9); opacity: 0; } }
@keyframes rcFlash { 0%, 100% { filter: drop-shadow(0 0 0 transparent); } 50% { filter: drop-shadow(0 0 7px var(--accent)) drop-shadow(0 0 2px var(--accent)); } }
@keyframes rcSpark { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.15; } }
.v-raptorcycle .rc-pulse { animation: rcFlash 0.75s ease-in-out 3; }
.v-raptorcycle .rc-svg .rc-sparking .c-spark { animation: rcSpark 0.22s steps(1) infinite; }
@media (prefers-reduced-motion: reduce) {
  .v-raptorcycle .rc-svg .rc-marker .ring { animation: none; transform: scale(1.3); opacity: 0.7; }
  .v-raptorcycle .rc-svg .rc-sparking .c-spark { animation: none; }
}

/* ---- why full flow + cycle comparison */
.v-raptorcycle .rc-why-head { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 18px 44px; align-items: start; }
.v-raptorcycle .rc-why-head .h3 { margin-top: 8px; font-size: clamp(19px, 2vw, 23px); } /* same step as the engine-lab section titles, one below the 4.x subsheet title */
.v-raptorcycle .rc-why-head .callout { margin-top: 18px; max-width: 60ch; }
@media (max-width: 900px) { .v-raptorcycle .rc-why-head { grid-template-columns: minmax(0, 1fr); } }
.v-raptorcycle .rc-cycles { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin-top: 28px; }
@media (max-width: 1180px) { .v-raptorcycle .rc-cycles { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 760px) { .v-raptorcycle .rc-cycles { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 540px) { .v-raptorcycle .rc-cycles { grid-template-columns: minmax(0, 1fr); } }
.v-raptorcycle .rc-card { display: flex; flex-direction: column; gap: 9px; padding: 10px 12px 12px; background: var(--bg-2); border: 1px solid var(--line); border-radius: var(--radius); cursor: pointer; transition: border-color 0.15s, background 0.15s; min-width: 0; outline: none; }
.v-raptorcycle .rc-card:hover, .v-raptorcycle .rc-card.is-hover { border-color: var(--steel-2); background: var(--bg-3); }
.v-raptorcycle .rc-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.v-raptorcycle .rc-card.is-selected { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
.v-raptorcycle .rc-card.is-raptor { background: linear-gradient(180deg, color-mix(in srgb, var(--oxgas) 7%, var(--bg-2)), var(--bg-2)); }
.v-raptorcycle .rc-mini { display: block; width: 100%; height: auto; border-radius: 4px; background: radial-gradient(120% 90% at 50% 20%, var(--bg-3) 0%, var(--bg) 80%); border: 1px solid var(--line); }
.v-raptorcycle .rc-mini text { font-family: var(--font-mono); font-size: 8.5px; letter-spacing: 0.05em; fill: var(--fg-2); }
.v-raptorcycle .rc-mini .m-dim { fill: var(--muted); }
.v-raptorcycle .rc-mini .m-line { fill: none; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
.v-raptorcycle .rc-mini .m-thin { stroke-width: 1.5; }
.v-raptorcycle .rc-mini .m-gas { stroke-dasharray: 0.1 4.2; stroke-width: 3; }
.v-raptorcycle .rc-mini .m-dump { stroke-dasharray: 4 3; }
.v-raptorcycle .rc-mini .m-body { fill: var(--bg-3); stroke: var(--steel-2); stroke-width: 1.2; }
.v-raptorcycle .rc-mini .m-wall { fill: color-mix(in srgb, var(--mix) 10%, var(--bg-3)); stroke: var(--steel); stroke-width: 1.4; stroke-linejoin: round; }
.v-raptorcycle .rc-mini .m-tank { fill: var(--bg-2); stroke: var(--steel-2); stroke-width: 1.1; }
.v-raptorcycle .rc-mini .s-lox { stroke: var(--lox); } .v-raptorcycle .rc-mini .s-ch4 { stroke: var(--ch4); } .v-raptorcycle .rc-mini .s-fuel { stroke: var(--steel); }
.v-raptorcycle .rc-mini .s-oxgas { stroke: var(--oxgas); } .v-raptorcycle .rc-mini .s-fuelgas { stroke: var(--fuelgas); }
.v-raptorcycle .rc-mini .f-lox { fill: var(--lox); } .v-raptorcycle .rc-mini .f-ch4 { fill: var(--ch4); } .v-raptorcycle .rc-mini .f-fuel { fill: var(--steel); }
.v-raptorcycle .rc-mini .f-oxgas { fill: var(--oxgas); } .v-raptorcycle .rc-mini .f-fuelgas { fill: var(--fuelgas); } .v-raptorcycle .rc-mini .f-warn { fill: var(--warn); }
.v-raptorcycle .rc-mini .pb-ox { fill: color-mix(in srgb, var(--oxgas) 22%, var(--bg-3)); stroke: var(--oxgas); stroke-width: 1.2; }
.v-raptorcycle .rc-mini .pb-fuel { fill: color-mix(in srgb, var(--fuelgas) 22%, var(--bg-3)); stroke: var(--fuelgas); stroke-width: 1.2; }
.v-raptorcycle .rc-card-name { font: 600 17px/1.1 var(--font-display); text-transform: uppercase; letter-spacing: 0.03em; color: var(--fg); }
.v-raptorcycle .rc-card-eg { font: 500 10.5px/1.3 var(--font-mono); color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; margin-top: 3px; }
.v-raptorcycle .rc-tag { display: inline-flex; align-items: center; gap: 6px; width: fit-content; font: 500 10px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 7px; border-radius: 3px; border: 1px solid var(--line-2); }
.v-raptorcycle .rc-tag.dump { color: var(--warn); border-color: color-mix(in srgb, var(--warn) 45%, transparent); }
.v-raptorcycle .rc-tag.into { color: var(--good); border-color: color-mix(in srgb, var(--good) 45%, transparent); }
.v-raptorcycle .rc-trade { font-size: 13px; line-height: 1.45; color: var(--fg-2); }
.v-raptorcycle .rc-card dl { margin: auto 0 0; display: grid; gap: 0; font-size: 12.5px; }
.v-raptorcycle .rc-card dl div { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; border-top: 1px solid var(--line); padding: 5px 0 0; margin-top: 5px; }
.v-raptorcycle .rc-card dt { color: var(--muted); font: 500 10px/1.4 var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em; }
.v-raptorcycle .rc-card dd { margin: 0; text-align: right; font-variant-numeric: tabular-nums; color: var(--fg); }
.v-raptorcycle .rc-mini-legend { margin-top: 14px; }
.v-raptorcycle .rc-bars { margin: 28px 0 0; padding: 16px 18px 16px; background: var(--bg-2); border: 1px solid var(--line); border-radius: var(--radius); --lab: 210px; --val: 11ch; }
.v-raptorcycle .rc-bars figcaption { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 18px; align-items: baseline; }
.v-raptorcycle .rc-bar-rows { position: relative; display: grid; gap: 2px; margin-top: 16px; }
.v-raptorcycle .rc-bar-grid { position: absolute; top: 0; bottom: 0; left: calc(var(--lab) + 12px); right: calc(var(--val) + 12px); pointer-events: none; }
.v-raptorcycle .rc-bar-grid i { position: absolute; top: -4px; bottom: -4px; width: 0; border-left: 1px solid var(--line); }
.v-raptorcycle .rc-bar-row { display: grid; grid-template-columns: var(--lab) minmax(0, 1fr) var(--val); gap: 12px; align-items: center; padding: 5px 0; background: none; border: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; border-radius: 3px; position: relative; width: 100%; }
.v-raptorcycle .rc-bar-row:hover .rc-bar-name, .v-raptorcycle .rc-bar-row.is-selected .rc-bar-name { color: var(--accent); }
.v-raptorcycle .rc-bar-name { font: 500 13px/1.2 var(--font-body); color: var(--fg); }
.v-raptorcycle .rc-bar-btn { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; text-align: left; border-radius: 2px; }
.v-raptorcycle .rc-mini .s-shaft { stroke: var(--steel-2); stroke-width: 2; fill: none; }
.v-raptorcycle .rc-svg .rc-tp.is-selected .c-body { stroke: var(--accent); }
.v-raptorcycle .rc-bar-name small { display: block; font: 500 10px/1.3 var(--font-mono); color: var(--muted); letter-spacing: 0.05em; text-transform: uppercase; margin-top: 2px; }
.v-raptorcycle .rc-bar-track { position: relative; height: 16px; }
.v-raptorcycle .rc-bar-fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--steel-2); border-radius: 0 2px 2px 0; }
.v-raptorcycle .rc-bar-fill.raptor { background: var(--steel); }
.v-raptorcycle .rc-bar-fill.demo { background: repeating-linear-gradient(135deg, var(--steel) 0 5px, var(--steel-2) 5px 8px); }
.v-raptorcycle .rc-bar-mark { position: absolute; top: -5px; bottom: -5px; width: 0; border-left: 2px dashed var(--warn); }
.v-raptorcycle .rc-bar-val { font: 500 12.5px/1 var(--font-mono); font-variant-numeric: tabular-nums; color: var(--fg); text-align: right; white-space: nowrap; }
.v-raptorcycle .rc-bar-axis { display: grid; grid-template-columns: var(--lab) minmax(0, 1fr) var(--val); gap: 12px; margin-top: 8px; }
.v-raptorcycle .rc-bar-ticks { position: relative; height: 16px; font: 500 10.5px/1 var(--font-mono); color: var(--muted); }
.v-raptorcycle .rc-bar-ticks span { position: absolute; top: 3px; transform: translateX(-50%); white-space: nowrap; }
.v-raptorcycle .rc-bar-ticks span:first-child { transform: none; }
.v-raptorcycle .rc-bar-unit { font: 500 10.5px/1 var(--font-mono); color: var(--muted); padding-top: 3px; text-align: right; }
.v-raptorcycle .rc-bar-foot { margin-top: 12px; font-size: 12px; line-height: 1.5; color: var(--muted); max-width: 90ch; }
.v-raptorcycle .rc-bar-foot i { display: inline-block; width: 0; height: 11px; border-left: 2px dashed var(--warn); margin: 0 5px -1px 2px; }
@media (max-width: 760px) {
  .v-raptorcycle .rc-bars { --lab: 104px; --val: 9ch; padding: 14px 12px; }
  .v-raptorcycle .rc-bar-row, .v-raptorcycle .rc-bar-axis { gap: 8px; }
  .v-raptorcycle .rc-bar-grid { left: calc(var(--lab) + 8px); right: calc(var(--val) + 8px); }
  .v-raptorcycle .rc-bar-name { font-size: 12px; }
  .v-raptorcycle .rc-bar-val { font-size: 11px; }
}
`);

  /* =================================================================== schematic geometry */

  const S = SX.svg;
  const W = 1000, H = 912, CX = 500;

  // Thrust chamber outline, scaled from the 2019 FAA-filed nozzle data (Appendix G, S18): exit 1.30 m, throat
  // 0.222 m, throat-to-exit 1.53 m, 32 degree tangency and 6 degree lip angles. The chamber diameter (about 0.35 x the
  // exit) is a photo-scaled estimate from dossier 02. Everything above the injector is schematic.
  const SC = 180; // px per metre
  const Y_INJ = 446, Y_CHE = 520, Y_THR = 552;
  const R_E = Math.round(SX.val('raptor.r1.exitDiameter', 1.3) / 2 * SC);
  const R_T = Math.round(SX.val('raptor.r1.throatDiameter', 0.222) / 2 * SC);
  const R_CH = Math.round(0.35 * SX.val('raptor.r1.exitDiameter', 1.3) / 2 * SC);
  const Y_EXIT = Math.round(Y_THR + 1.53 * SC);
  const Y_MAN = 612; // regen inlet manifold on the upper nozzle
  const Y_OUT = 462; // regen outlet ring at the top of the chamber jacket

  const PROF = (function () {
    const pts = [];
    for (let y = Y_INJ; y < Y_CHE; y += 4) pts.push([R_CH, y]);
    for (let i = 0; i <= 16; i++) {
      const u = i / 16;
      pts.push([R_T + (R_CH - R_T) * (1 + Math.cos(Math.PI * u)) / 2, Y_CHE + (Y_THR - Y_CHE) * u]);
    }
    const a = 32 * Math.PI / 180, b = 6 * Math.PI / 180;
    const P0 = [R_T, Y_THR], P1 = [R_T + 100 * Math.sin(a), Y_THR + 100 * Math.cos(a)];
    const P2 = [R_E - 120 * Math.sin(b), Y_EXIT - 120 * Math.cos(b)], P3 = [R_E, Y_EXIT];
    for (let i = 1; i <= 48; i++) {
      const t = i / 48, m = 1 - t;
      const k0 = m * m * m, k1 = 3 * m * m * t, k2 = 3 * m * t * t, k3 = t * t * t;
      pts.push([k0 * P0[0] + k1 * P1[0] + k2 * P2[0] + k3 * P3[0], k0 * P0[1] + k1 * P1[1] + k2 * P2[1] + k3 * P3[1]]);
    }
    return pts;
  })();
  function rAt(y) {
    if (y <= PROF[0][1]) return PROF[0][0];
    for (let i = 1; i < PROF.length; i++) {
      const a = PROF[i - 1], b = PROF[i];
      if (y <= b[1]) { const u = (y - a[1]) / ((b[1] - a[1]) || 1); return a[0] + (b[0] - a[0]) * u; }
    }
    return R_E;
  }
  /** Points along one wall between y0 and y1 (either order), offset outward by off. sgn: +1 right, -1 left. */
  function wallPts(y0, y1, off, sgn) {
    const out = [], n = Math.max(2, Math.ceil(Math.abs(y1 - y0) / 4));
    for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * i / n; out.push([CX + sgn * (rAt(y) + off), y]); }
    return out;
  }
  const f1 = (v) => Math.round(v * 10) / 10;
  const ptsD = (pts) => 'M' + pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L');

  /** Polyline path with rounded corners and pipe-bridge hops at given crossing points. */
  function pathD(pts, rad, hops) {
    rad = rad == null ? 12 : rad;
    hops = hops || [];
    const HR = 7;
    let d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], c = pts[i + 1];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
      hops.filter((h) => Math.abs((h[0] - a[0]) * uy - (h[1] - a[1]) * ux) < 0.5 && (h[0] - a[0]) * ux + (h[1] - a[1]) * uy > HR && (b[0] - h[0]) * ux + (b[1] - h[1]) * uy > HR)
        .sort((p, q) => ((p[0] - a[0]) * ux + (p[1] - a[1]) * uy) - ((q[0] - a[0]) * ux + (q[1] - a[1]) * uy))
        .forEach((h) => {
          const sweep = ux > 0.5 || uy > 0.5 ? 1 : 0;
          d += ' L' + f1(h[0] - ux * HR) + ' ' + f1(h[1] - uy * HR) + ' A' + HR + ' ' + HR + ' 0 0 ' + sweep + ' ' + f1(h[0] + ux * HR) + ' ' + f1(h[1] + uy * HR);
        });
      if (c) {
        const len2 = Math.hypot(c[0] - b[0], c[1] - b[1]) || 1;
        const r = Math.min(rad, len / 2, len2 / 2);
        const vx = (c[0] - b[0]) / len2, vy = (c[1] - b[1]) / len2;
        d += ' L' + f1(b[0] - ux * r) + ' ' + f1(b[1] - uy * r) + ' Q' + f1(b[0]) + ' ' + f1(b[1]) + ' ' + f1(b[0] + vx * r) + ' ' + f1(b[1] + vy * r);
      } else {
        d += ' L' + f1(b[0]) + ' ' + f1(b[1]);
      }
    }
    return d;
  }

  /* =================================================================== pipes */

  // gas: drawn as travelling beads; liquid: travelling dashes. v: animation speed in px/s at 100% throttle.
  const FLUID = {
    lox: { gas: false, v: 30, name: 'Liquid oxygen' }, ch4: { gas: false, v: 30, name: 'Liquid methane' },
    ch4w: { gas: true, v: 46, name: 'Warm supercritical methane' }, gox: { gas: true, v: 50, name: 'Gaseous oxygen' },
    gch4: { gas: true, v: 50, name: 'Gaseous methane' }, oxgas: { gas: true, v: 66, name: 'Oxygen-rich hot gas' },
    fuelgas: { gas: true, v: 66, name: 'Fuel-rich hot gas' }, mix: { gas: true, v: 110, name: 'Combustion products' },
    spin: { gas: true, v: 56, name: 'Spin-start gas' },
  };
  let flows = [];

  function arrowOn(pts, spec, w) {
    let seg = spec && spec.seg, at = spec && spec.at != null ? spec.at : 0.5;
    if (seg == null) {
      let bl = -1;
      for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (l > bl) { bl = l; seg = i; } }
    }
    const a = pts[seg - 1], b = pts[seg];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    const x = a[0] + (b[0] - a[0]) * at, y = a[1] + (b[1] - a[1]) * at;
    const s = 2.6 + w * 0.5;
    return S('path', { class: 'arrow', d: 'M' + f1(s * 1.1) + ' 0 L' + f1(-s) + ' ' + f1(-s * 0.85) + ' L' + f1(-s * 0.45) + ' 0 L' + f1(-s) + ' ' + f1(s * 0.85) + ' Z', transform: 'translate(' + f1(x) + ' ' + f1(y) + ') rotate(' + f1(ang) + ')' });
  }

  function pipe(spec) {
    const fl = FLUID[spec.fl];
    const d = spec.d || pathD(spec.pts, spec.r, spec.hops);
    const w = spec.w || 6;
    const g = S('g', { class: 'pipe fl-' + spec.fl, 'data-key': spec.key, 'data-tip': spec.tip || spec.key });
    if (!spec.noCase) g.appendChild(S('path', { class: 'p-case', d, 'stroke-width': w + 5 }));
    g.appendChild(S('path', { class: 'p-base', d, 'stroke-width': w }));
    const fw = fl.gas ? Math.max(2.6, w * 0.62) : Math.max(1.8, w - 3);
    const da = fl.gas ? '0.1 ' + f1(Math.max(7, fw * 2.7)) : f1(Math.max(7, w * 1.5)) + ' ' + f1(Math.max(6, w * 1.25));
    const flow = S('path', { class: 'p-flow ' + (fl.gas ? 'gas' : 'liq'), d, 'stroke-width': f1(fw), 'stroke-dasharray': da });
    g.appendChild(flow);
    if (spec.arrow !== false && spec.pts) g.appendChild(arrowOn(spec.pts, spec.arrow, w));
    if (!spec.noHit) g.appendChild(S('path', { class: 'p-hit', d }));
    flows.push({ el: flow, key: spec.key, v: spec.v || fl.v, off: 0 });
    return g;
  }

  /* =================================================================== drawing primitives */

  function partG(id, label, extra) {
    return S('g', Object.assign({ class: 'part rc-part', 'data-part': id, tabindex: 0, role: 'button', 'aria-label': label }, extra || {}));
  }
  function keyed(key, ...kids) { return S('g', { 'data-key': key }, ...kids); }
  function lbl(x, y, text, cls, anchor, key, extra) {
    return S('text', Object.assign({ x, y, class: 'lbl ' + (cls || 't-lbl'), 'text-anchor': anchor || 'start', 'data-key': key || null }, extra || {}), text);
  }
  function pumpShape(cx, cy, r, cls) {
    const g = S('g', null, S('circle', { cx, cy, r, class: 'c-body ' + cls }));
    let d = '';
    for (let k = 0; k < 5; k++) {
      const t = (k * 72 + 15) * Math.PI / 180;
      const x0 = cx + 7 * Math.cos(t), y0 = cy + 7 * Math.sin(t);
      const x1 = cx + (r - 7) * Math.cos(t + 0.75), y1 = cy + (r - 7) * Math.sin(t + 0.75);
      const qx = cx + (r * 0.62) * Math.cos(t + 0.1), qy = cy + (r * 0.62) * Math.sin(t + 0.1);
      d += 'M' + f1(x0) + ' ' + f1(y0) + ' Q' + f1(qx) + ' ' + f1(qy) + ' ' + f1(x1) + ' ' + f1(y1) + ' ';
    }
    g.appendChild(S('path', { class: 'c-glyph', d }));
    g.appendChild(S('circle', { cx, cy, r: 5.5, class: 'c-body' }));
    return g;
  }
  function turbineShape(cx, y0, y1, wt, wb, cls) {
    const g = S('g', null, S('path', { class: 'c-body ' + cls, d: 'M' + (cx - wt / 2) + ' ' + y0 + ' L' + (cx + wt / 2) + ' ' + y0 + ' L' + (cx + wb / 2) + ' ' + y1 + ' L' + (cx - wb / 2) + ' ' + y1 + ' Z' }));
    let d = '';
    for (let k = 0; k < 5; k++) {
      const x = cx - wt / 2 + 9 + k * (wt - 18) / 4;
      d += 'M' + f1(x - 5) + ' ' + (y0 + 9) + ' L' + f1(x + 5) + ' ' + (y1 - 9) + ' ';
    }
    g.appendChild(S('path', { class: 'c-glyph', d }));
    return g;
  }
  function shaftShape(cx, y0, y1) {
    return S('g', null,
      S('rect', { x: cx - 4, y: y0, width: 8, height: y1 - y0, class: 'c-body' }),
      S('rect', { x: cx - 10, y: y0 + 9, width: 20, height: 5, rx: 1, class: 'c-body' }),
      S('rect', { x: cx - 10, y: y1 - 14, width: 20, height: 5, rx: 1, class: 'c-body' }));
  }
  function preburnerShape(cx, y0, y1, w, cls, tint, flameCls, dir) {
    const cy = (y0 + y1) / 2, s = dir;
    return S('g', null,
      S('rect', { x: cx - w / 2, y: y0, width: w, height: y1 - y0, rx: w / 2, class: 'c-body ' + cls + ' ' + tint }),
      S('path', { class: flameCls, d: 'M' + (cx - s * 13) + ' ' + cy + ' Q' + (cx - s * 12) + ' ' + (cy - 12) + ' ' + cx + ' ' + (cy - 10) + ' Q' + (cx + s * 10) + ' ' + (cy - 7) + ' ' + (cx + s * 19) + ' ' + cy + ' Q' + (cx + s * 10) + ' ' + (cy + 7) + ' ' + cx + ' ' + (cy + 10) + ' Q' + (cx - s * 12) + ' ' + (cy + 12) + ' ' + (cx - s * 13) + ' ' + cy + ' Z' }),
      S('path', { class: 'c-glyph', d: 'M' + (cx - w / 2 + 6) + ' ' + (y0 + 22) + ' H' + (cx + w / 2 - 6) + ' M' + (cx - w / 2 + 6) + ' ' + (y1 - 22) + ' H' + (cx + w / 2 - 6) }));
  }
  function flangeShape(x, y) {
    return S('g', null, S('rect', { x: x - 14, y: y - 6, width: 28, height: 4, rx: 1, class: 'c-flange' }), S('rect', { x: x - 14, y: y + 2, width: 28, height: 4, rx: 1, class: 'c-flange' }));
  }
  function valveShape(x, y, vertical) {
    const d = vertical
      ? 'M' + (x - 6) + ' ' + (y - 8) + ' L' + (x + 6) + ' ' + (y - 8) + ' L' + (x - 6) + ' ' + (y + 8) + ' L' + (x + 6) + ' ' + (y + 8) + ' Z'
      : 'M' + (x - 8) + ' ' + (y - 6) + ' L' + (x - 8) + ' ' + (y + 6) + ' L' + (x + 8) + ' ' + (y - 6) + ' L' + (x + 8) + ' ' + (y + 6) + ' Z';
    const stem = vertical ? 'M' + x + ' ' + y + ' H' + (x + 13) + ' M' + (x + 13) + ' ' + (y - 5) + ' V' + (y + 5) : 'M' + x + ' ' + y + ' V' + (y - 13) + ' M' + (x - 5) + ' ' + (y - 13) + ' H' + (x + 5);
    return S('g', null, S('path', { class: 'c-glyph', d: stem }), S('path', { class: 'c-valve', d }));
  }
  function sparkShape(x, y, rot) {
    return S('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + rot + ')' },
      S('path', { class: 'c-body', d: 'M-5 -6 H5 V2 H-5 Z' }),
      S('path', { class: 'c-spark', d: 'M0 2 L-4 8 L2 10 L-2 17' }));
  }

  /* =================================================================== the schematic */

  // Station coordinates used by the drawing, tours and markers.
  const P = {
    otp: { x: 330, pumpY: 205, r: 33, turbY0: 288, turbY1: 346 },
    ftp: { x: 670, pumpY: 205, r: 33, turbY0: 288, turbY1: 346 },
    opb: { x: 190, y0: 262, y1: 372, w: 56 },
    fpb: { x: 810, y0: 262, y1: 372, w: 56 },
    gasY: 316, ductY: 380, domeTop: 412,
  };

  function buildSchematic() {
    flows = [];
    const svg = S('svg', { class: 'rc-svg', viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': 'Flow schematic of the Raptor 3 full-flow staged combustion cycle. Each component is a button; pipes show what flows through them.' });
    const defs = S('defs', null,
      S('linearGradient', { id: 'rcGlow', x1: 0, y1: Y_INJ, x2: 0, y2: Y_EXIT + 50, gradientUnits: 'userSpaceOnUse' },
        S('stop', { offset: '0', style: 'stop-color:var(--mix);stop-opacity:0.9' }),
        S('stop', { offset: '0.22', style: 'stop-color:var(--mix);stop-opacity:0.55' }),
        S('stop', { offset: '0.55', style: 'stop-color:var(--plume);stop-opacity:0.28' }),
        S('stop', { offset: '1', style: 'stop-color:var(--plume);stop-opacity:0.06' })),
      S('linearGradient', { id: 'rcPlume', x1: 0, y1: Y_EXIT, x2: 0, y2: H, gradientUnits: 'userSpaceOnUse' },
        S('stop', { offset: '0', style: 'stop-color:var(--plume);stop-opacity:0.1' }),
        S('stop', { offset: '1', style: 'stop-color:var(--plume);stop-opacity:0' })),
      S('clipPath', { id: 'rcClipLox' }, S('rect', { x: 150, y: 22, width: 270, height: 78, rx: 39 })),
      S('clipPath', { id: 'rcClipCh4' }, S('rect', { x: 580, y: 22, width: 270, height: 78, rx: 39 })));
    svg.appendChild(defs);

    /* ---- sheet furniture: vehicle/engine interface, title block */
    svg.appendChild(S('path', { class: 'iface', d: 'M10 118 H990' }));
    svg.appendChild(lbl(14, 111, 'VEHICLE', 't-tiny'));
    svg.appendChild(lbl(14, 133, 'ENGINE', 't-tiny'));
    const tb = S('g', { class: 'lbl' },
      S('path', { class: 'iface', style: 'stroke-dasharray:none', d: 'M14 818 H356 V900 H14 Z M14 846 H356' }),
      lbl(24, 838, 'RAPTOR 3 FLOW SCHEMATIC', 't-title'),
      lbl(24, 864, 'FULL-FLOW STAGED COMBUSTION, CH4 / LOX', 't-tiny'),
      lbl(24, 879, 'SCHEMATIC. CHAMBER AND NOZZLE OUTLINE SCALED', 't-tiny'),
      lbl(24, 892, 'FROM 2019 FAA-FILED DATA; REST NOT TO SCALE.', 't-tiny'));
    svg.appendChild(tb);

    /* ---- vehicle tanks */
    function tank(x, kind, id, name, sub) {
      const g = partG(id, name + ' (vehicle tank)', { 'data-fallback': kind === 'lox' ? 'raptor3.cycle.oxPath' : 'raptor3.cycle.fuelPath', 'data-tipname': name });
      const k = keyed(kind === 'lox' ? 'tankLox' : 'tankCh4',
        S('rect', { x, y: 22, width: 270, height: 78, rx: 39, class: 'c-tank' }),
        S('rect', { x, y: 52, width: 270, height: 48, class: 'c-liq-' + kind, 'clip-path': 'url(#' + (kind === 'lox' ? 'rcClipLox' : 'rcClipCh4') + ')' }),
        S('path', { d: 'M' + (x + 12) + ' 52 H' + (x + 258), class: 'c-surf-' + kind }),
        lbl(x + 135, 44, name, 't-lbl', 'middle'),
        lbl(x + 135, 76, sub, 't-sub', 'middle'));
      k.setAttribute('data-tip', kind === 'lox' ? 'tankLox' : 'tankCh4');
      g.appendChild(k);
      return g;
    }
    svg.appendChild(tank(150, 'lox', 'booster.loxTank', 'LOX TANK', 'SUBCOOLED LIQUID OXYGEN'));
    svg.appendChild(tank(580, 'ch4', 'booster.ch4Tank', 'METHANE TANK', 'SUBCOOLED LIQUID METHANE'));

    /* ---- thrust chamber: nozzle, then main combustion chamber on top */
    const rightN = wallPts(Y_THR, Y_EXIT, 0, 1), leftN = wallPts(Y_EXIT, Y_THR, 0, -1);
    const gN = partG('raptor3.nozzle', 'Nozzle');
    gN.appendChild(keyed('nozzle',
      S('path', { class: 'c-hot', d: ptsD(rightN.concat(leftN)) + ' Z', fill: 'url(#rcGlow)', 'data-glow': '1' }),
      S('path', { class: 'c-wall', d: ptsD(wallPts(Y_THR, Y_EXIT, 1.5, 1)) }),
      S('path', { class: 'c-wall', d: ptsD(wallPts(Y_THR, Y_EXIT, 1.5, -1)) })));
    svg.appendChild(gN);
    const gM = partG('raptor3.mcc', 'Main combustion chamber and throat');
    gM.appendChild(keyed('mcc',
      S('path', { class: 'c-hot', d: ptsD(wallPts(Y_INJ, Y_THR, 0, 1).concat(wallPts(Y_THR, Y_INJ, 0, -1))) + ' Z', fill: 'url(#rcGlow)', 'data-glow': '1' }),
      S('path', { class: 'c-liner', d: ptsD(wallPts(Y_INJ + 2, Y_THR + 6, -1, 1)) }),
      S('path', { class: 'c-liner', d: ptsD(wallPts(Y_INJ + 2, Y_THR + 6, -1, -1)) }),
      S('path', { class: 'c-wall', d: ptsD(wallPts(Y_INJ, Y_THR + 1, 1.5, 1)) }),
      S('path', { class: 'c-wall', d: ptsD(wallPts(Y_INJ, Y_THR + 1, 1.5, -1)) })));
    svg.appendChild(gM);

    /* ---- exhaust (decoration: not a part) */
    const ex = S('g', { style: 'pointer-events:none' },
      S('path', { 'data-key': 'exhaust', d:'M' + (CX - R_E) + ' ' + Y_EXIT + ' L' + (CX + R_E) + ' ' + Y_EXIT + ' L' + (CX + R_E + 26) + ' ' + H + ' L' + (CX - R_E - 26) + ' ' + H + ' Z', fill: 'url(#rcPlume)', 'data-glow': '1' }));
    [-0.5, 0, 0.5].forEach((k) => {
      const pts = [];
      for (let y = Y_INJ + 10; y <= Y_EXIT; y += 6) pts.push([CX + k * rAt(y) * 0.95, y]);
      pts.push([CX + k * (R_E + 24), H - 4]);
      ex.appendChild(pipe({ key: 'exhaust', fl: 'mix', w: 3.2, d: ptsD(pts), noCase: true, noHit: true, arrow: false }));
    });
    svg.appendChild(ex);

    /* ---- regenerative cooling: coolant supply, inlet manifold, channels, outlet ring */
    const rMan = rAt(Y_MAN), rOut = R_CH;
    const gR = partG('raptor3.regen', 'Regenerative cooling: coolant supply, manifold and wall channels');
    gR.appendChild(pipe({ key: 'coolant', fl: 'ch4', w: 7, pts: [[700, P.ftp.pumpY], [900, P.ftp.pumpY], [900, Y_MAN], [CX + rMan + 15, Y_MAN]], arrow: { seg: 2, at: 0.62 } }));
    gR.appendChild(keyed('mfv', valveShape(792, P.ftp.pumpY, false)));
    [-1, 1].forEach((sgn) => {
      gR.appendChild(pipe({ key: 'jacket', fl: 'ch4', w: 3.4, d: ptsD(wallPts(Y_MAN - 6, Y_OUT + 5, 7, sgn)), arrow: false, v: 24 }));
      gR.appendChild(keyed('jacketLow', S('path', { class: 'p-unknown', d: ptsD(wallPts(Y_MAN + 10, Y_EXIT - 4, 7, sgn)) }), S('path', { class: 'p-hit', d: ptsD(wallPts(Y_MAN + 10, Y_EXIT - 4, 7, sgn)), 'data-tip': 'jacketLow' })));
    });
    gR.appendChild(S('g', { 'data-key': 'manifold', 'data-tip': 'manifold' },
      S('path', { class: 'c-ring-back', d: 'M' + f1(CX - rMan - 9) + ' ' + Y_MAN + ' A' + f1(rMan + 9) + ' 7 0 0 1 ' + f1(CX + rMan + 9) + ' ' + Y_MAN }),
      S('path', { class: 'c-ring', d: 'M' + f1(CX - rMan - 9) + ' ' + Y_MAN + ' A' + f1(rMan + 9) + ' 7 0 0 0 ' + f1(CX + rMan + 9) + ' ' + Y_MAN }),
      S('circle', { cx: f1(CX - rMan - 9), cy: Y_MAN, r: 6, class: 'c-body c-ch4' }),
      S('circle', { cx: f1(CX + rMan + 9), cy: Y_MAN, r: 6, class: 'c-body c-ch4' })));
    gR.appendChild(keyed('outlet',
      S('path', { class: 'c-ring-back', d: 'M' + (CX - rOut - 9) + ' ' + Y_OUT + ' A' + (rOut + 9) + ' 6 0 0 1 ' + (CX + rOut + 9) + ' ' + Y_OUT }),
      S('path', { class: 'c-ring', d: 'M' + (CX - rOut - 9) + ' ' + Y_OUT + ' A' + (rOut + 9) + ' 6 0 0 0 ' + (CX + rOut + 9) + ' ' + Y_OUT }),
      S('circle', { cx: CX - rOut - 9, cy: Y_OUT, r: 6, class: 'c-body c-ch4', 'data-tip': 'outlet' }),
      S('circle', { cx: CX + rOut + 9, cy: Y_OUT, r: 6, class: 'c-body c-ch4', 'data-tip': 'outlet' })));
    svg.appendChild(gR);

    /* ---- hot-gas ducts from the turbines to the injector */
    const gFD = partG('raptor3.fuelDuct', 'Fuel-rich hot-gas duct');
    gFD.appendChild(pipe({ key: 'fuelDuct', fl: 'fuelgas', w: 10, pts: [[P.ftp.x, P.ftp.turbY1 - 4], [P.ftp.x, P.ductY], [538, P.ductY], [538, P.domeTop + 3]], arrow: { seg: 2, at: 0.3 } }));
    svg.appendChild(gFD);
    const gOD = partG('raptor3.oxDuct', 'Oxygen-rich hot-gas duct');
    gOD.appendChild(pipe({ key: 'oxDuct', fl: 'oxgas', w: 10, pts: [[P.otp.x, P.otp.turbY1 - 4], [P.otp.x, P.ductY], [462, P.ductY], [462, P.domeTop + 3]], arrow: { seg: 2, at: 0.28 } }));
    svg.appendChild(gOD);

    /* ---- preburners with their gas links into the turbines */
    const gOPB = partG('raptor3.opb', 'Oxygen-rich preburner');
    gOPB.appendChild(pipe({ key: 'opbGas', fl: 'oxgas', w: 10, pts: [[P.opb.x + 20, P.gasY], [P.otp.x - 26, P.gasY]], arrow: { seg: 1, at: 0.72 } }));
    gOPB.appendChild(keyed('opb', preburnerShape(P.opb.x, P.opb.y0, P.opb.y1, P.opb.w, 'c-oxgas', 'c-tint-ox', 'c-flame-ox', 1)));
    svg.appendChild(gOPB);
    const gFPB = partG('raptor3.fpb', 'Fuel-rich preburner');
    gFPB.appendChild(pipe({ key: 'fpbGas', fl: 'fuelgas', w: 10, pts: [[P.fpb.x - 20, P.gasY], [P.ftp.x + 26, P.gasY]], arrow: { seg: 1, at: 0.72 } }));
    gFPB.appendChild(keyed('fpb', preburnerShape(P.fpb.x, P.fpb.y0, P.fpb.y1, P.fpb.w, 'c-fuelgas', 'c-tint-fuel', 'c-flame-fuel', -1)));
    svg.appendChild(gFPB);

    /* ---- engine inlets and feed lines */
    const gLI = partG('raptor3.loxInlet', 'LOX inlet');
    gLI.appendChild(pipe({ key: 'loxFeed', fl: 'lox', w: 9, pts: [[P.otp.x, 100], [P.otp.x, P.otp.pumpY - P.otp.r + 4]], arrow: { seg: 1, at: 0.72 } }));
    gLI.appendChild(keyed('loxInlet', flangeShape(P.otp.x, 126)));
    svg.appendChild(gLI);
    const gCI = partG('raptor3.ch4Inlet', 'Methane inlet');
    gCI.appendChild(pipe({ key: 'ch4Feed', fl: 'ch4', w: 9, pts: [[P.ftp.x, 100], [P.ftp.x, P.ftp.pumpY - P.ftp.r + 4]], arrow: { seg: 1, at: 0.72 } }));
    gCI.appendChild(keyed('ch4Inlet', flangeShape(P.ftp.x, 126)));
    svg.appendChild(gCI);

    /* ---- oxygen path lines (main LOX to the OPB, LOX cross-feed to the FPB) */
    const gOX = partG('raptor3.cycle.oxPath', 'Oxygen path lines: main oxygen line and oxygen cross-feed');
    gOX.appendChild(pipe({ key: 'loxMain', fl: 'lox', w: 8, pts: [[P.otp.x - 28, P.otp.pumpY], [P.opb.x, P.otp.pumpY], [P.opb.x, P.opb.y0 + 4]], arrow: { seg: 2, at: 0.55 } }));
    gOX.appendChild(keyed('mov', valveShape(248, P.otp.pumpY, false)));
    gOX.appendChild(pipe({ key: 'loxX', fl: 'lox', w: 3.6, pts: [[P.otp.x + 30, 195], [600, 195], [600, 436], [P.fpb.x, 436], [P.fpb.x, P.fpb.y1 - 4]], hops: [[600, P.ductY]], arrow: { seg: 1, at: 0.72 } }));
    svg.appendChild(gOX);

    /* ---- methane path lines after the jacket (warm methane to the FPB, methane cross-feed to the OPB) */
    const gCH = partG('raptor3.cycle.fuelPath', 'Methane path lines: warm methane to the fuel-rich preburner and methane cross-feed');
    gCH.appendChild(pipe({ key: 'warmMain', fl: 'ch4w', w: 8, pts: [[CX + rOut + 12, Y_OUT], [860, Y_OUT], [860, P.gasY], [P.fpb.x + P.fpb.w / 2 - 4, P.gasY]], arrow: { seg: 1, at: 0.55 } }));
    gCH.appendChild(pipe({ key: 'ch4X', fl: 'ch4w', w: 3.6, pts: [[CX - rOut - 12, Y_OUT], [P.opb.x, Y_OUT], [P.opb.x, P.opb.y1 - 4]], arrow: { seg: 1, at: 0.4 } }));
    svg.appendChild(gCH);

    /* ---- autogenous pressurization taps */
    const gP = partG('raptor3.press', 'Autogenous pressurization taps');
    gP.appendChild(pipe({ key: 'loxHX', fl: 'lox', w: 3.4, pts: [[P.otp.x + 26, 222], [418, 222], [418, P.ductY - 9]], arrow: { seg: 2, at: 0.5 } }));
    gP.appendChild(keyed('hx',
      S('rect', { x: 406, y: P.ductY - 10, width: 48, height: 20, rx: 3, class: 'c-body c-lox' }),
      S('path', { class: 'c-glyph', d: 'M411 ' + P.ductY + ' l5 -6 l5 12 l5 -12 l5 12 l5 -12 l5 12 l5 -6' })));
    gP.appendChild(pipe({ key: 'gox', fl: 'gox', w: 3.4, pts: [[442, P.ductY - 10], [442, 48], [418, 48]], hops: [[442, 195]], arrow: { seg: 1, at: 0.72 }, r: 8 }));
    gP.appendChild(pipe({ key: 'gch4', fl: 'gch4', w: 3.4, pts: [[860, 400], [950, 400], [950, 48], [848, 48]], hops: [[900, 400]], arrow: { seg: 2, at: 0.5 }, r: 8 }));
    svg.appendChild(gP);

    /* ---- spin-start gas injection */
    const gS = partG('raptor3.startup', 'Spin-start gas injection (start sequence)');
    gS.appendChild(pipe({ key: 'spinOx', fl: 'spin', w: 3.4, pts: [[250, 268], [250, P.gasY - 8]], arrow: { seg: 1, at: 0.45 } }));
    gS.appendChild(pipe({ key: 'spinFuel', fl: 'spin', w: 3.4, pts: [[750, 268], [750, P.gasY - 8]], arrow: { seg: 1, at: 0.45 } }));
    svg.appendChild(gS);

    /* ---- igniters */
    const gI = partG('raptor3.igniters', 'Preburner igniters');
    gI.appendChild(keyed('ignOx', sparkShape(P.opb.x - P.opb.w / 2 - 8, 336, 90)));
    gI.appendChild(keyed('ignFuel', sparkShape(P.fpb.x, P.fpb.y0 - 16, 0)));
    svg.appendChild(gI);

    /* ---- turbopumps: pump, shaft, turbine (sub-parts of raptor3.otp / raptor3.ftp) */
    function turbopump(side) {
      const T = side === 'ox' ? P.otp : P.ftp;
      const base = side === 'ox' ? 'raptor3.otp' : 'raptor3.ftp';
      const pre = side === 'ox' ? 'otp' : 'ftp';
      const nm = side === 'ox' ? 'Oxygen' : 'Methane';
      const outer = S('g', { class: 'part rc-tp', 'data-part': base });
      const gp = partG(base + '.pump', nm + ' pump', { 'data-fallback': base });
      gp.appendChild(keyed(pre + 'Pump', pumpShape(T.x, T.pumpY, T.r, side === 'ox' ? 'c-lox' : 'c-ch4')));
      const gs = partG(base + '.shaft', nm + ' turbopump shaft', { 'data-fallback': base });
      gs.appendChild(keyed(pre + 'Shaft', shaftShape(T.x, T.pumpY + T.r - 1, T.turbY0 + 1)));
      const gt = partG(base + '.turbine', nm + ' turbine', { 'data-fallback': base });
      gt.appendChild(keyed(pre + 'Turb', turbineShape(T.x, T.turbY0, T.turbY1, 56, 70, side === 'ox' ? 'c-oxgas' : 'c-fuelgas')));
      outer.appendChild(gs); outer.appendChild(gp); outer.appendChild(gt);
      return outer;
    }
    svg.appendChild(turbopump('ox'));
    svg.appendChild(turbopump('fuel'));

    /* ---- main injector */
    const gInj = partG('raptor3.injector', 'Main injector');
    const dome = 'M425 ' + Y_INJ + ' L425 ' + (Y_INJ - 10) + ' Q427 ' + P.domeTop + ' 452 ' + P.domeTop + ' L548 ' + P.domeTop + ' Q573 ' + P.domeTop + ' 575 ' + (Y_INJ - 10) + ' L575 ' + Y_INJ + ' Z';
    const elems = [];
    for (let x = CX - R_CH + 8; x <= CX + R_CH - 7; x += 10) elems.push(S('circle', { cx: x, cy: Y_INJ + 5, r: 1.8, class: 'c-elem' }));
    gInj.appendChild(keyed('injector',
      S('path', { class: 'c-body', d: dome }),
      S('path', { class: 'c-glyph', d: 'M438 ' + (Y_INJ - 12) + ' H562 M444 ' + (Y_INJ - 22) + ' H556' }),
      S('path', { class: 'c-plate', d: 'M' + (CX - R_CH - 12) + ' ' + Y_INJ + ' H' + (CX + R_CH + 12) }),
      ...elems));
    svg.appendChild(gInj);

    /* ---- labels (never intercept the pointer) */
    const L = S('g', { class: 'rc-labels' });
    const add = (...n) => n.forEach((x) => L.appendChild(x));
    add(
      lbl(308, 131, 'LOX INLET', 't-sub', 'end', 'loxInlet'),
      lbl(692, 131, 'METHANE INLET', 't-sub', 'start', 'ch4Inlet'),
      lbl(292, 160, 'OXYGEN TURBOPUMP', 't-lbl', 'end', 'otpPump'),
      lbl(292, 175, 'OTP', 't-sub', 'end', 'otpPump'),
      lbl(708, 160, 'METHANE TURBOPUMP', 't-lbl', 'start', 'ftpPump'),
      lbl(708, 175, 'FTP', 't-sub', 'start', 'ftpPump'),
      lbl(292, 227, 'PUMP', 't-tiny', 'end', 'otpPump'),
      lbl(708, 227, 'PUMP', 't-tiny', 'start', 'ftpPump'),
      lbl(292, 338, 'TURBINE', 't-tiny', 'end', 'otpTurb'),
      lbl(708, 338, 'TURBINE', 't-tiny', 'start', 'ftpTurb'),
      lbl(138, 298, 'OXYGEN-RICH', 't-lbl', 'end', 'opb'),
      lbl(138, 313, 'PREBURNER', 't-lbl', 'end', 'opb'),
      lbl(138, 328, 'OPB', 't-sub', 'end', 'opb'),
      lbl(800, 402, 'FUEL-RICH PREBURNER', 't-lbl', 'end', 'fpb'),
      lbl(800, 417, 'FPB', 't-sub', 'end', 'fpb'),
      lbl(250, 259, 'SPIN GAS', 't-tiny', 'middle', 'spinOx'),
      lbl(750, 259, 'SPIN GAS', 't-tiny', 'middle', 'spinFuel'),
      lbl(338, 372, 'HOT GAS', 't-tiny', 'start', 'oxDuct'),
      lbl(662, 372, 'HOT GAS', 't-tiny', 'end', 'fuelDuct'),
      lbl(430, P.ductY + 24, 'HX', 't-tiny', 'middle', 'hx'),
      lbl(418, 438, 'MAIN INJECTOR', 't-lbl', 'end', 'injector'),
      lbl(530, 188, 'LOX CROSS-FEED', 't-tiny', 'middle', 'loxX'),
      lbl(300, 455, 'CH4 CROSS-FEED', 't-tiny', 'middle', 'ch4X'),
      lbl(700, 455, 'WARM CH4', 't-tiny', 'middle', 'warmMain'),
      lbl(438, 482, 'REGEN OUTLET', 't-tiny', 'end', 'outlet'),
      lbl(572, 496, 'MAIN COMBUSTION CHAMBER', 't-lbl', 'start', 'mcc'),
      lbl(572, 511, 'MCC', 't-sub', 'start', 'mcc'),
      lbl(CX + R_T + 16, Y_THR + 4, 'THROAT', 't-sub', 'start', 'mcc'),
      lbl(CX + rMan + 26, Y_MAN - 12, 'REGEN INLET MANIFOLD', 't-sub', 'start', 'manifold'),
      lbl(CX - rAt(668) - 20, 664, 'COOLING CHANNELS', 't-sub', 'end', 'jacket'),
      lbl(CX - rAt(760) - 18, 752, 'LOWER-NOZZLE ROUTING', 't-tiny', 'end', 'jacketLow'),
      lbl(CX - rAt(760) - 18, 765, 'NOT PUBLIC', 't-tiny t-warn', 'end', 'jacketLow'),
      lbl(CX + R_E + 16, 800, 'NOZZLE', 't-lbl', 'start', 'nozzle'),
      lbl(CX + R_E + 16, 815, 'REGEN-COOLED BELL', 't-sub', 'start', 'nozzle'),
      lbl(CX + R_E + 44, H - 10, 'EXHAUST', 't-tiny', 'start', 'exhaust'),
      lbl(914, 520, 'COOLANT SUPPLY', 't-tiny', 'middle', 'coolant', { transform: 'rotate(-90 914 520)', dy: '0.35em' }),
      lbl(456, 132, 'GOX PRESSURANT', 't-tiny', 'middle', 'gox', { transform: 'rotate(-90 456 132)', dy: '0.35em' }),
      lbl(964, 232, 'GCH4 PRESSURANT', 't-tiny', 'middle', 'gch4', { transform: 'rotate(-90 964 232)', dy: '0.35em' })
    );
    // short leaders for the throat and manifold
    add(S('path', { class: 'leader', 'data-key': 'mcc', d: 'M' + (CX + R_T + 13) + ' ' + Y_THR + ' H' + (CX + R_T + 4) }),
      S('path', { class: 'leader', 'data-key': 'jacket', d: 'M' + f1(CX - rAt(668) - 16) + ' 660 L' + f1(CX - rAt(660) - 9) + ' 660' }),
      S('circle', { class: 'leader-dot', 'data-key': 'jacket', cx: f1(CX - rAt(660) - 9), cy: 660, r: 2 }),
      S('path', { class: 'leader', 'data-key': 'fpb', d: 'M803 390 L789 373' }),
      S('circle', { class: 'leader-dot', 'data-key': 'fpb', cx: 789, cy: 373, r: 2 }));
    svg.appendChild(L);

    /* ---- tour marker (station badge) */
    const marker = S('g', { class: 'rc-marker', visibility: 'hidden' },
      S('circle', { class: 'ring', cx: 0, cy: 0, r: 16 }),
      S('circle', { class: 'badge', cx: 0, cy: 0, r: 11 }),
      S('text', { class: 'badge-t', x: 0, y: 4 }, '1'));
    svg.appendChild(marker);

    return { svg, marker };
  }

  /* =================================================================== pipe tooltips (fluid state at each point) */

  const F = (k, o) => SX.esc(SX.fmt(k, o));
  const FL_COLOR = { lox: '--lox', ch4: '--ch4', ch4w: '--ch4', gox: '--lox', gch4: '--ch4', oxgas: '--oxgas', fuelgas: '--fuelgas', mix: '--mix', spin: '--muted' };
  const MODEL = ' <i style="color:var(--warn);font-style:normal">(community estimate, Raptor 2 model)</i>';
  // key: [title, fluid, state line, text]
  const TIPS = {
    tankLox: () => ['LOX tank (vehicle)', 'lox', 'Subcooled liquid', 'On both stages the methane tank sits above the LOX tank; they are drawn side by side here. Oxygen is about ' + F('propellant.stackO2Fraction') + ' of the propellant.'],
    tankCh4: () => ['Methane tank (vehicle)', 'ch4', 'Subcooled liquid', 'On both stages this tank sits above the LOX tank. On the V3 booster its methane reaches the engines through a transfer tube roughly the size of a Falcon 9 first stage.'],
    loxFeed: () => ['LOX feed and inlet', 'lox', 'Liquid, low pressure', 'Colder than its ' + F('propellant.loxBoil') + ' boiling point (loading temperature not published). About ' + F('raptorcycle.inletP') + ' at the inlet' + MODEL + '.'],
    ch4Feed: () => ['Methane feed and inlet', 'ch4', 'Liquid, low pressure', 'Colder than its ' + F('propellant.ch4Boil') + ' boiling point (loading temperature not published). About ' + F('raptorcycle.inletP') + ' at the inlet' + MODEL + '.'],
    loxMain: () => ['Main oxygen line', 'lox', 'Liquid, very high pressure', 'About ' + F('raptor.r3.otpDischarge') + ' leaving the pump' + MODEL + '. Carries most of the oxygen to the oxygen-rich preburner. The valve symbol marks the main oxidizer valve; its real position is not public.'],
    loxX: () => ['Oxygen cross-feed', 'lox', 'Liquid, high pressure', 'A small share of the pumped oxygen, sent to the fuel-rich preburner to burn a little of the methane and heat it for the fuel turbine.'],
    loxHX: () => ['Oxygen pressurant tap', 'lox', 'Liquid, high pressure', 'A little liquid oxygen goes to a heat exchanger to become pressurant gas. Community models heat it in the oxygen-rich turbine exhaust; on Raptor 3 the tap-offs are internal and their locations are not public.'],
    gox: () => ['GOX pressurant', 'gox', 'Warm gaseous oxygen', 'Returned to the LOX tank to hold its pressure as it drains (autogenous pressurization). Starship was designed for this from 2016, instead of carrying helium like Falcon 9.'],
    ch4X: () => ['Methane cross-feed', 'ch4w', 'Warm supercritical methane', 'A small share of the warm methane from the cooling jacket, the only fuel of the oxygen-rich preburner.'],
    warmMain: () => ['Warm methane to the fuel-rich preburner', 'ch4w', 'Warm supercritical fluid', 'Most of the engine\'s methane, now a dense gas-like fluid at about ' + F('raptorcycle.regenOutP') + MODEL + '.'],
    gch4: () => ['GCH4 pressurant', 'gch4', 'Warm gaseous methane', 'Community models tap warm methane after the cooling jacket and pipe it back to the methane tank. Raptor 3\'s tap location is not public.'],
    coolant: () => ['Coolant supply', 'ch4', 'Liquid, highest pressure in the engine', 'About ' + F('raptor.r3.ftpDischarge') + MODEL + '. On Raptor 3 this pipe loops over the top of the engine and down the far side to the nozzle manifold (SpaceX photo); it is drawn on the near side here. The valve symbol marks the main fuel valve, position not public.'],
    jacket: () => ['Cooling channels', 'ch4', 'Liquid warming to supercritical', 'Methane flows up through channels in the nozzle, throat and chamber walls, soaking up heat from gas near ' + F('raptor.r3.chamberTemp') + '. The throat carries the highest heat flux. The 2019 engine also bled ' + F('raptor.r1.filmCooling') + ' as fuel-rich film coolant just upstream of the throat; SpaceX later worked to remove it.'],
    jacketLow: () => ['Lower-nozzle channels', 'ch4', 'Routing not public', 'The 2019 FAA-filed data describe the whole sea-level nozzle as regeneratively cooled. How Raptor 3 routes coolant below the manifold is not public; a community model shows the flow splitting at the manifold.'],
    manifold: () => ['Regen inlet manifold', 'ch4', 'Liquid, high pressure', 'A ring around the upper nozzle, visible in SpaceX\'s Raptor 3 photo, that spreads the coolant into the wall channels.'],
    outlet: () => ['Regen outlet', 'ch4w', 'Warm supercritical methane', 'Warm methane collects at the top of the chamber jacket at about ' + F('raptorcycle.regenOutP') + MODEL + ', then splits: most to the fuel-rich preburner, a little to the oxygen-rich preburner and to tank pressurization. On Raptor 3 this plumbing is internal.'],
    opbGas: () => ['Oxygen-rich preburner gas', 'oxgas', 'Hot oxygen-rich gas', 'About ' + F('raptor.r3.oxPreburnerTemp') + ' at ' + F('raptor.r3.preburnerPressure') + MODEL + '. Hot, dense oxygen that attacks most metals, hence SpaceX\'s SX500 superalloy.'],
    fpbGas: () => ['Fuel-rich preburner gas', 'fuelgas', 'Hot methane-rich gas', 'About ' + F('raptor.r3.fuelPreburnerTemp') + ' at ' + F('raptor.r3.preburnerPressure') + MODEL + '. Methane leaves no soot in a fuel-rich preburner; kerosene would.'],
    oxDuct: () => ['Oxygen-rich hot gas to the injector', 'oxgas', 'Hot oxygen-rich gas', 'Turbine exhaust carrying nearly all of the engine\'s oxygen, at about ' + F('raptorcycle.oxTurbOutP') + ' and ' + F('raptorcycle.oxTurbOutT') + MODEL + '.'],
    fuelDuct: () => ['Fuel-rich hot gas to the injector', 'fuelgas', 'Hot methane-rich gas', 'Turbine exhaust carrying nearly all of the engine\'s methane, at about ' + F('raptorcycle.fuelTurbOutP') + ' and ' + F('raptorcycle.fuelTurbOutT') + MODEL + '.'],
    spinOx: () => TIPS.spinFuel(),
    spinFuel: () => ['Spin-start gas', 'spin', 'Pressurized gas, start only', 'Spins the turbopumps before the preburners light. Raptor 3: gaseous oxygen and methane from vehicle pressure vessels, as reported by NASASpaceflight and not confirmed by SpaceX. Injection points are drawn schematically.'],
  };
  function tipHTML(key) {
    const f = TIPS[key];
    if (!f) return null;
    const [title, fl, st, text] = f();
    return '<b>' + SX.esc(title) + '</b><span style="display:block;margin:2px 0 5px;font:500 10px/1.3 var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;color:var(' + FL_COLOR[fl] + ')">' + SX.esc(st) + '</span>' + text;
  }
  function plainFacts(s) {
    return String(s || '').replace(/\{\{\s*([\w.]+)(?:\|([^}\s]+))?\s*\}\}/g, (m, k, to) => SX.fmt(k, to ? { to } : null));
  }
  function partTipHTML(id, el) {
    const p = SX.part(id);
    const fb = FALLBACK[id];
    const name = (el && el.dataset.tipname) || (p && p.name) || (fb && fb[0]) || id;
    let line = fb ? fb[1] : '';
    if (!line && p && p.summary) line = plainFacts(p.summary).split(/(?<=\.)\s/)[0];
    return '<b>' + SX.esc(name) + '</b>' + SX.esc(line) + '<span style="display:block;margin-top:4px;color:var(--muted);font-size:11px">Click for details</span>';
  }

  /* =================================================================== guided tours */

  const MID_OX = [P.opb.x, P.gasY + 1], MID_FUEL = [P.fpb.x, P.gasY + 1];
  const TOURS = {
    fuel: {
      label: 'Follow the methane', part: 'raptor3.cycle.fuelPath',
      steps: [
        { title: 'Methane tank', at: [P.ftp.x, 61], lit: ['tankCh4', 'ch4Feed'],
          text: 'The vehicle stores methane as a subcooled liquid, colder than its {{propellant.ch4Boil}} boiling point and warmer than its {{propellant.ch4Freeze}} freezing point. Colder methane is denser, so more fits in the tank, and it gives the pump more margin against boiling at its inlet.' },
        { title: 'Methane inlet', at: [P.ftp.x, 126], lit: ['ch4Feed', 'ch4Inlet'], part: 'raptor3.ch4Inlet',
          text: 'Methane enters at the top of the engine on the fuel-pump side at low pressure, about {{raptorcycle.inletP}} in a community model. Raptor 3 keeps flanges and seals on this low-pressure side and welds the high-pressure side below (reported).' },
        { title: 'Methane pump', at: [P.ftp.x, P.ftp.pumpY], lit: ['ftpPump', 'ch4Feed'], part: 'raptor3.ftp.pump',
          text: 'The fuel turbopump raises the methane to roughly {{raptor.r3.ftpDischarge}}, the highest pressure in the engine (community estimate). It has to sit far above chamber pressure because the methane still must push through the cooling channels, a preburner and a turbine. Methane is light, so this pump needs far more pressure rise per kilogram than the oxygen pump.' },
        { title: 'Coolant supply', at: [900, 408], lit: ['coolant', 'mfv', 'ftpPump'], part: 'raptor3.regen',
          text: 'The pumped methane heads for the nozzle through the biggest pipe on the engine. On Raptor 3 it leaves the fuel pump, loops over the top of the engine and runs down the far side to a ring manifold on the upper nozzle (SpaceX photo of Raptor 3 SN1); this drawing keeps it on the near side.' },
        { title: 'Regenerative cooling', at: [CX + rAt(585) + 7, 585], lit: ['manifold', 'jacket', 'jacketLow', 'coolant'], part: 'raptor3.regen',
          text: 'From the manifold the methane flows through channels in the nozzle, throat and chamber walls. The gas inside runs near {{raptor.r3.chamberTemp}} and the throat carries the highest heat flux in the engine. The methane soaks up that heat and keeps the chamber liner, reported to be a copper alloy, from melting; routing below the manifold is not public.' },
        { title: 'Regen outlet', at: [CX + R_CH + 9, Y_OUT], lit: ['outlet', 'jacket', 'warmMain', 'ch4X', 'gch4'], part: 'raptor3.regen',
          text: 'The methane leaves the jacket warm and supercritical, a dense gas-like fluid at about {{raptorcycle.regenOutP}} (community estimate). It splits three ways: most goes to the fuel-rich preburner, a small share becomes the fuel of the oxygen-rich preburner, and some is tapped off to pressurize the methane tank.' },
        { title: 'Fuel-rich preburner', at: MID_FUEL, lit: ['fpb', 'warmMain', 'loxX', 'ignFuel'], part: 'raptor3.fpb',
          text: 'Nearly all of the methane meets a small flow of oxygen from the other side of the engine. Burning a little of it heats the whole stream to about {{raptor.r3.fuelPreburnerTemp}} at {{raptor.r3.preburnerPressure}} (community estimates), hot enough to drive a turbine yet cool enough for its blades. Methane leaves no soot here; kerosene would.' },
        { title: 'Methane turbine', at: [P.ftp.x, P.gasY + 1], lit: ['fpbGas', 'ftpTurb', 'ftpShaft', 'ftpPump'], part: 'raptor3.ftp.turbine',
          text: 'The fuel-rich gas spins the turbine, and the shaft drives the methane pump above it. Pump and turbine both handle methane-rich fluid, so this shaft needs no seal against oxygen.' },
        { title: 'Fuel-rich hot gas', at: [640, P.ductY], lit: ['fuelDuct'], part: 'raptor3.fuelDuct',
          text: 'The turbine exhaust, still carrying nearly all of the engine\'s methane, flows to the main injector at about {{raptorcycle.fuelTurbOutP}} and {{raptorcycle.fuelTurbOutT}} (community estimates). On Raptor 3 much of this path is built into the engine structure.' },
        { title: 'Main injector and chamber', at: [CX, Y_INJ + 24], lit: ['injector', 'mcc', 'fuelDuct', 'oxDuct'], part: 'raptor3.injector',
          text: 'Fuel-rich and oxygen-rich gas meet at the injector. Both are hot, so they ignite on contact; Raptor has had no main-chamber igniter since Raptor 2. Gas-gas mixing is fast, so a compact chamber can run at very high pressure; a development engine reached {{raptor.r3.chamberPressure}} in a 2023 test, and the flight-rating value is not published.' },
        { title: 'Throat and nozzle', at: [CX, Y_THR + 60], lit: ['mcc', 'nozzle', 'exhaust', 'jacket', 'jacketLow'], part: 'raptor3.nozzle',
          text: 'The gas reaches the speed of sound at the throat, then expands and accelerates in the bell. The methane you followed leaves as exhaust after first cooling this same nozzle.' },
      ],
    },
    ox: {
      label: 'Follow the oxygen', part: 'raptor3.cycle.oxPath',
      steps: [
        { title: 'LOX tank', at: [P.otp.x, 61], lit: ['tankLox', 'loxFeed'],
          text: 'Liquid oxygen is stored subcooled, between its {{propellant.loxFreeze}} freezing point and {{propellant.loxBoil}} boiling point. It is most of the propellant, about {{propellant.stackO2Fraction}}. On Flights 2 and 3, blocked filters in the vehicle\'s LOX feed starved the oxygen pumps and shut engines down.' },
        { title: 'LOX inlet', at: [P.otp.x, 126], lit: ['loxFeed', 'loxInlet'], part: 'raptor3.loxInlet',
          text: 'Oxygen enters at the top center of the engine, the tall capped inlet in SpaceX\'s Raptor 3 photo, at about {{raptorcycle.inletP}} (community model). It goes straight into the oxygen pump.' },
        { title: 'Oxygen pump', at: [P.otp.x, P.otp.pumpY], lit: ['otpPump', 'loxFeed'], part: 'raptor3.otp.pump',
          text: 'The oxygen turbopump raises the liquid to roughly {{raptor.r3.otpDischarge}} (community estimate). In 2018 Musk described a "~800 atmosphere, hot, oxygen-rich turbopump". Oxygen is dense, so this pump needs less pressure rise per kilogram than the methane pump.' },
        { title: 'Main oxygen line', at: [248, P.otp.pumpY], lit: ['loxMain', 'mov', 'loxX', 'loxHX'], part: 'raptor3.cycle.oxPath',
          text: 'Most of the pumped oxygen goes to the oxygen-rich preburner. A small share crosses to the fuel-rich preburner, and a little more is tapped off to make pressurant gas. The valve symbol marks the main oxidizer valve, whose real position SpaceX has not published.' },
        { title: 'Cross-feed to the fuel side', at: [530, 195], lit: ['loxX', 'fpb'], part: 'raptor3.fpb',
          text: 'This thin line carries just enough oxygen to burn a little of the methane in the fuel-rich preburner. Cross-feeds like this make full flow hard to start, because each preburner needs propellant from both pumps.' },
        { title: 'Oxygen-rich preburner', at: MID_OX, lit: ['opb', 'loxMain', 'ch4X', 'ignOx'], part: 'raptor3.opb',
          text: 'Nearly all of the oxygen burns with a small flow of warm methane, reaching about {{raptor.r3.oxPreburnerTemp}} at {{raptor.r3.preburnerPressure}} (community estimates). SpaceX tested an oxygen-rich preburner on its own at NASA\'s Stennis Space Center in 2015.' },
        { title: 'Oxygen turbine', at: [P.otp.x, P.gasY + 1], lit: ['opbGas', 'otpTurb', 'otpShaft', 'otpPump'], part: 'raptor3.otp.turbine',
          text: 'Hot, high-pressure oxygen-rich gas is the harshest environment in the engine; it burns most metals. SpaceX developed its own superalloys, SX300 and then SX500, for these parts. The shaft handles only oxygen-rich fluid, so it needs no seal against fuel.' },
        { title: 'Oxygen-rich hot gas', at: [372, P.ductY], lit: ['oxDuct', 'hx', 'loxHX'], part: 'raptor3.oxDuct',
          text: 'The turbine exhaust, carrying nearly all of the engine\'s oxygen, flows to the injector at about {{raptorcycle.oxTurbOutP}} and {{raptorcycle.oxTurbOutT}} (community estimates). Community models place a heat exchanger in this stream to boil a little liquid oxygen into pressurant gas.' },
        { title: 'Tank pressurization', at: [442, 250], lit: ['gox', 'hx', 'tankLox', 'gch4', 'tankCh4'], part: 'raptor3.press',
          text: 'Warm oxygen gas returns to the LOX tank to hold its pressure as it drains, and warm methane does the same for the methane tank. Starship was designed from the start to pressurize its tanks this way instead of carrying helium. Flight 9 (a V2 ship) was lost after a diffuser in its main fuel tank pressurization system failed.' },
        { title: 'Injector, chamber and nozzle', at: [CX, Y_INJ + 24], lit: ['injector', 'mcc', 'oxDuct', 'fuelDuct', 'nozzle', 'exhaust'], part: 'raptor3.mcc',
          text: 'The oxygen-rich gas meets the fuel-rich gas and burns. The mixture ratio is about {{raptor.r3.ofRatio}} (estimate), so oxygen is most of the mass leaving the nozzle. The gas reaches the speed of sound at the throat and expands through the bell.' },
      ],
    },
    start: {
      label: 'Start sequence', part: 'raptor3.startup',
      caveat: 'A generalized full-flow start. SpaceX has not published Raptor\'s start sequence; the order and details here are illustrative.',
      steps: [
        { title: 'Chill and purge', at: [CX, 160], glow: 0, lit: ['tankLox', 'tankCh4', 'loxFeed', 'ch4Feed', 'loxInlet', 'ch4Inlet', 'otpPump', 'ftpPump'], flows: ['loxFeed', 'ch4Feed'],
          text: 'Cold propellant flows into the engine to chill the pumps and lines, so the liquid does not flash to gas on warm metal. "Raptor begins engine chill" is a line in SpaceX\'s countdown. Engines like this also purge their lines with inert gas; Raptor\'s purge sequence is not public.' },
        { title: 'Spin start', at: [230, 290], glow: 0, part: 'raptor3.startup', lit: ['spinOx', 'spinFuel', 'otpTurb', 'ftpTurb', 'otpShaft', 'ftpShaft', 'otpPump', 'ftpPump', 'loxFeed', 'ch4Feed'], flows: ['spinOx', 'spinFuel', 'loxFeed', 'ch4Feed'],
          text: 'Stored gas blasts through both turbines and spins the pumps up before anything burns. Raptor 3 reportedly uses gaseous oxygen and methane from onboard pressure vessels (NASASpaceflight); earlier Raptors used helium or nitrogen, and first-generation boosters started their outer ring of {{booster.enginesOuter}} with gas from the ground. SpaceX confirms only "a new Raptor startup method".' },
        { title: 'Igniters fire', at: [P.fpb.x + 32, P.fpb.y0 - 12], glow: 0, spark: true, part: 'raptor3.igniters', lit: ['ignOx', 'ignFuel', 'opb', 'fpb', 'spinOx', 'spinFuel'], flows: ['spinOx', 'spinFuel', 'loxFeed', 'ch4Feed'],
          text: 'Igniters in both preburners fire. SpaceX says every Raptor 3 variant has a "redesigned ignition system"; NASASpaceflight reports acoustic resonance igniters with no spark or moving parts. Raptor 2 used spark-energized torch igniters, and igniter problems cut short booster relights on Flights 7 and 8.' },
        { title: 'Preburners light', at: MID_OX, glow: 0, spark: true, part: 'raptor3.opb',
          lit: ['opb', 'fpb', 'ignOx', 'ignFuel', 'spinOx', 'spinFuel', 'loxFeed', 'ch4Feed', 'loxMain', 'mov', 'loxX', 'coolant', 'mfv', 'manifold', 'jacket', 'outlet', 'warmMain', 'ch4X', 'opbGas', 'fpbGas', 'otpTurb', 'ftpTurb', 'otpShaft', 'ftpShaft', 'otpPump', 'ftpPump'],
          flows: ['loxFeed', 'ch4Feed', 'loxMain', 'loxX', 'coolant', 'jacket', 'warmMain', 'ch4X', 'opbGas', 'fpbGas', 'spinOx', 'spinFuel'],
          text: 'Propellant reaches both preburners and they light. This is the bootstrapping problem, since each preburner needs oxygen and methane from both pumps and the pumps only speed up once the preburners make hot gas. Spin gas carries the turbines until they can run on their own.' },
        { title: 'Main chamber lights', at: [CX, Y_INJ + 24], glow: 0.35, part: 'raptor3.injector',
          lit: ['opb', 'fpb', 'loxFeed', 'ch4Feed', 'loxMain', 'mov', 'loxX', 'coolant', 'mfv', 'manifold', 'jacket', 'jacketLow', 'outlet', 'warmMain', 'ch4X', 'opbGas', 'fpbGas', 'otpTurb', 'ftpTurb', 'otpShaft', 'ftpShaft', 'otpPump', 'ftpPump', 'oxDuct', 'fuelDuct', 'injector', 'mcc', 'nozzle', 'exhaust'],
          flows: ['loxFeed', 'ch4Feed', 'loxMain', 'loxX', 'coolant', 'jacket', 'warmMain', 'ch4X', 'opbGas', 'fpbGas', 'oxDuct', 'fuelDuct', 'exhaust'],
          text: 'The two hot gas streams reach the injector and ignite on contact; Raptor 2 and later have no main-chamber igniter. Thrust builds as the turbines accelerate and the spin gas shuts off.' },
        { title: 'Mainstage', at: [CX, Y_THR + 90], lit: 'all', part: 'raptor3.startup',
          text: 'The controller ramps to commanded thrust and holds it with valves, and the pressurant taps come online. Starts remain the hardest phase; on the first Flight 13 attempt, {{raptorcycle.f13AbortEngines}} on the booster aborted at T-0 with oxygen turbopump issues. On V3 every booster engine can relight, and Flight 13 flew the high-thrust part of its boostback on all {{booster.enginesRelight}}.' },
      ],
    },
  };
  const ALL_FLOWS_EXCEPT_SPIN = (k) => k !== 'spinOx' && k !== 'spinFuel';

  /* =================================================================== cycle comparison: small-multiple schematics */

  const CYCLES = [
    { id: 'cycles.gg', name: 'Gas generator', eg: 'Merlin 1D, Falcon 9', fuel: 'RP-1', fuelCls: 'fuel', dump: true,
      trade: 'Simple to develop, but the turbine gas is thrown overboard and chamber pressure stays modest.',
      specs: [['Chamber pressure', 'cycles.merlin1d.pc'], ['Isp, sea level', 'cycles.merlin1d.ispSL'], ['Isp, vacuum', 'cycles.merlin1d.ispVac']] },
    { id: 'cycles.orsc', name: 'Oxygen-rich staged', eg: 'RD-180, Atlas V', fuel: 'RP-1', fuelCls: 'fuel',
      trade: 'Nothing wasted and high pressure, but the turbine runs in hot oxygen-rich gas that burns most metals.',
      specs: [['Chamber pressure', 'cycles.rd180.pc'], ['Isp, sea level', 'cycles.rd180.ispSL'], ['Isp, vacuum', 'cycles.rd180.ispVac']] },
    { id: 'cycles.frsc', name: 'Fuel-rich staged', eg: 'RS-25, Shuttle and SLS', fuel: 'LH2', fuelCls: 'fuel',
      trade: 'Gentle fuel-rich turbine gas, but the oxygen pump shaft needs seals to keep fuel and oxygen apart.',
      specs: [['Chamber pressure', 'cycles.rs25.pc'], ['Isp, sea level', 'cycles.rs25.ispSL'], ['Isp, vacuum', 'cycles.rs25.ispVac']] },
    { id: 'cycles.exp', name: 'Expander', eg: 'RL10B-2, upper stages', fuel: 'LH2', fuelCls: 'fuel',
      trade: 'No combustion before the chamber, but jacket heat limits turbine power, so the engine stays small.',
      specs: [['Chamber pressure', 'cycles.rl10.pc'], ['Isp, vacuum', 'cycles.rl10.ispVac']] },
    { id: 'cycles.ffsc', name: 'Full-flow staged', eg: 'Raptor 3, Starship', fuel: 'CH4', fuelCls: 'ch4', raptor: true,
      trade: 'All propellant drives the turbines, no shaft sees both propellants, and two gases mix in the injector. The price is two preburners and a hard start.',
      specs: [['Chamber pressure (2023 test)', 'raptor.r3.chamberPressure'], ['Isp, sea level (est.)', 'raptor.r3.ispSL'], ['Isp as listed by SpaceX', 'raptor.r3.ispVac']] },
  ];

  function miniSVG(c) {
    const fc = c.fuelCls; // 'fuel' (grey, non-methane fuels) or 'ch4'
    const svg = S('svg', { class: 'rc-mini', viewBox: '0 0 200 156', 'aria-hidden': 'true' });
    const ln = (d, cls) => S('path', { d, class: 'm-line ' + cls });
    const arrow = (x, y, deg, fill) => S('path', { d: 'M4 0 L-3 -3.4 L-1.5 0 L-3 3.4 Z', class: fill, transform: 'translate(' + x + ' ' + y + ') rotate(' + deg + ')' });
    const turb = (x, cls) => S('path', { class: 'm-body ' + cls, d: 'M' + (x - 8) + ' 43 H' + (x + 8) + ' L' + (x + 11) + ' 57 H' + (x - 11) + ' Z' });
    const pump = (x, cls) => S('circle', { cx: x, cy: 50, r: 8, class: 'm-body ' + cls });
    const pb = (x, y, cls) => S('rect', { x: x - 8, y, width: 16, height: 22, rx: 6, class: cls });
    const kids = [
      S('rect', { x: 8, y: 6, width: 40, height: 20, rx: 10, class: 'm-tank' }), S('text', { x: 28, y: 19, 'text-anchor': 'middle' }, c.fuel),
      S('rect', { x: 152, y: 6, width: 40, height: 20, rx: 10, class: 'm-tank' }), S('text', { x: 172, y: 19, 'text-anchor': 'middle' }, 'LOX'),
      ln('M33 26 V41', 's-' + fc), ln('M167 26 V41', 's-lox'),
      S('path', { class: 'm-wall', d: 'M88 100 H112 V113 Q112 119 105 123 Q114 136 124 150 H76 Q86 136 95 123 Q88 119 88 113 Z' }),
    ];
    const top = [];
    if (c.id === 'cycles.gg' || c.id === 'cycles.orsc' || c.id === 'cycles.frsc' || c.id === 'cycles.exp') {
      kids.push(ln('M41 50 H89 M111 50 H159', 's-shaft'));
      const tcls = c.id === 'cycles.orsc' ? 's-oxgas' : c.id === 'cycles.exp' ? 's-' + fc : 's-fuelgas';
      top.push(turb(100, tcls));
    }
    if (c.id === 'cycles.gg') {
      kids.push(ln('M33 58 V108 H86', 's-' + fc), ln('M167 58 V108 H114', 's-lox'),
        ln('M33 72 H91', 'm-thin s-' + fc), ln('M167 72 H109', 'm-thin s-lox'),
        ln('M100 66 V59', 'm-gas s-fuelgas'),
        ln('M100 42 V8', 'm-dump s-fuelgas'), arrow(100, 6, -90, 'f-fuelgas'),
        arrow(84, 108, 0, 'f-' + fc), arrow(116, 108, 180, 'f-lox'));
      top.push(S('rect', { x: 92, y: 66, width: 16, height: 12, rx: 5, class: 'pb-fuel' }), S('text', { x: 105, y: 30, class: 'f-warn', style: 'fill:var(--warn)' }, 'DUMPED'), S('text', { x: 100, y: 91, class: 'm-dim', 'text-anchor': 'middle' }, 'GG'));
    } else if (c.id === 'cycles.orsc') {
      kids.push(ln('M160 44 Q142 23 109 23', 's-lox'), ln('M40 44 Q60 28 91 28', 'm-thin s-' + fc),
        ln('M100 35 V42', 'm-gas s-oxgas'), ln('M100 58 V98', 'm-gas s-oxgas'), arrow(100, 97, 90, 'f-oxgas'),
        ln('M33 58 V108 H86', 's-' + fc), arrow(84, 108, 0, 'f-' + fc));
      top.push(pb(100, 12, 'pb-ox'));
    } else if (c.id === 'cycles.frsc') {
      kids.push(ln('M40 44 Q58 23 91 23', 's-' + fc), ln('M160 44 Q140 28 109 28', 'm-thin s-lox'),
        ln('M100 35 V42', 'm-gas s-fuelgas'), ln('M100 58 V98', 'm-gas s-fuelgas'), arrow(100, 97, 90, 'f-fuelgas'),
        ln('M167 58 V108 H114', 's-lox'), arrow(116, 108, 180, 'f-lox'));
      top.push(pb(100, 12, 'pb-fuel'));
    } else if (c.id === 'cycles.exp') {
      kids.push(ln('M33 58 V148 H73 L83 136 L90 125', 's-' + fc), ln('M90 125 L84 119 V72 L91 60', 'm-gas s-' + fc),
        ln('M108 58 V98', 'm-gas s-' + fc), arrow(108, 97, 90, 'f-' + fc),
        ln('M167 58 V108 H114', 's-lox'), arrow(116, 108, 180, 'f-lox'));
      top.push(S('text', { x: 38, y: 142, class: 'm-dim' }, 'JACKET'));
    } else if (c.id === 'cycles.ffsc') {
      kids.push(ln('M41 50 H66 M134 50 H159', 's-shaft'),
        ln('M38 43 Q48 23 67 23', 's-' + fc), ln('M162 43 Q152 23 133 23', 's-lox'),
        ln('M53 26 V4 H121 V11', 'm-thin s-' + fc), ln('M147 26 V8 H79 V11', 'm-thin s-lox'),
        ln('M76 35 V42', 'm-gas s-fuelgas'), ln('M124 35 V42', 'm-gas s-oxgas'),
        ln('M76 58 V78 H94 V98', 'm-gas s-fuelgas'), ln('M124 58 V78 H106 V98', 'm-gas s-oxgas'),
        arrow(94, 97, 90, 'f-fuelgas'), arrow(106, 97, 90, 'f-oxgas'));
      top.push(turb(76, 's-fuelgas'), turb(124, 's-oxgas'), pb(76, 12, 'pb-fuel'), pb(124, 12, 'pb-ox'));
    }
    kids.push(pump(33, 's-' + fc), pump(167, 's-lox'));
    kids.forEach((k) => svg.appendChild(k));
    top.forEach((k) => svg.appendChild(k));
    return svg;
  }

  /* chamber pressure bars, sorted low to high; scale 0 to 400 bar */
  const BARS = [
    { name: 'RL10B-2', sub: 'Expander, LH2', key: 'cycles.rl10.pc', id: 'cycles.exp' },
    { name: 'Merlin 1D', sub: 'Gas generator, RP-1', key: 'cycles.merlin1d.pc', id: 'cycles.gg' },
    { name: 'RS-25', sub: 'Fuel-rich staged, LH2', key: 'cycles.rs25.pc', id: 'cycles.frsc' },
    { name: 'RD-180', sub: 'Oxygen-rich staged, RP-1', key: 'cycles.rd180.pc', id: 'cycles.orsc' },
    { name: 'Raptor 2', sub: 'Full flow, CH4', key: 'raptor.r2.chamberPressure', id: 'cycles.ffsc', cls: 'raptor' },
    { name: 'Raptor 3', sub: 'Full flow, 2023 test', key: 'raptor.r3.chamberPressure', id: 'cycles.ffsc', cls: 'demo', mark: 'raptorcycle.pcAtRating' },
  ];
  const BAR_MAX = 400; // bar

  /* =================================================================== view */

  const el = SX.el;
  const st = { mode: 'explore', step: 0, throttle: 1, playing: !SX.reducedMotion, glow: null, flowOK: null };
  let V = null; // built DOM refs

  function floorPct() {
    const r3 = SX.val('raptor.r3.throttleMin', null);
    return { v: r3 != null ? r3 : SX.val('raptor.r1.throttleMin', 40), key: r3 != null ? 'raptor.r3.throttleMin' : 'raptor.r1.throttleMin' };
  }

  function init(mount) {
    const built = buildSchematic();
    const svg = built.svg;
    V = { mount, svg, marker: built.marker, parts: new Map() };

    /* ---- tour + explore panel */
    const modes = [['explore', 'Explore'], ['fuel', 'Methane'], ['ox', 'Oxygen'], ['start', 'Start']];
    const seg = el('div', { class: 'seg rc-modes', role: 'group', 'aria-label': 'Schematic mode' });
    modes.forEach(([m, label]) => seg.appendChild(el('button', { type: 'button', 'data-mode': m, 'aria-pressed': String(m === 'explore'), onclick: () => setMode(m, 0, true) }, label)));
    const body = el('div', { class: 'rc-tour-body', 'aria-live': 'polite' });
    const tour = el('div', { class: 'rc-panel rc-tour' }, seg, body);
    tour.addEventListener('keydown', (e) => {
      if (st.mode === 'explore' || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    /* ---- throttle, readouts, legend */
    const fl = floorPct();
    const range = el('input', { type: 'range', id: 'rc-throttle', min: String(fl.v), max: '100', step: '1', value: '100', 'aria-describedby': 'rc-throttle-note' });
    const out = el('output', { for: 'rc-throttle', class: 'num' }, '100%');
    const play = el('button', { type: 'button', class: 'btn btn-sm', 'aria-pressed': String(st.playing), onclick: () => setPlaying(!st.playing) }, st.playing ? 'Pause flow' : 'Animate flow');
    const rThrust = el('dd', { class: 'num' }), rPc = el('dd', { class: 'num' }), rFlow = el('dd', { class: 'num' });
    const legendItem = (label, color, gas, extra) => el('span', null,
      S('svg', { viewBox: '0 0 28 10', 'aria-hidden': 'true', html: '<path d="M2 5 H26" style="fill:none;stroke:var(' + color + ');stroke-width:' + (gas ? 3.6 : 4) + ';stroke-linecap:' + (gas ? 'round' : 'butt') + ';stroke-dasharray:' + (extra || (gas ? '0.1 7' : '7 4')) + '"/>' }), label);
    const ctl = el('div', { class: 'rc-panel rc-ctl' },
      el('div', { class: 'rc-ctl-row' },
        el('div', { class: 'range-row' }, el('label', { for: 'rc-throttle' }, 'Throttle'), range, out),
        play),
      el('dl', { class: 'rc-read' },
        el('div', null, el('dt', null, 'Thrust, sea level'), rThrust),
        el('div', null, el('dt', null, 'Chamber pressure'), rPc),
        el('div', null, el('dt', null, 'Propellant flow'), rFlow)),
      el('p', { class: 'rc-note', id: 'rc-throttle-note', html: SX.withFacts('Illustrative, linear scaling. 100% = {{raptor.r3.thrustSL}} flight rating, about {{raptorcycle.pcAtRating}} and {{raptor.r3.massFlow}} (both estimates). Real engines do not scale exactly linearly. The slider stops at ' + SX.factHTML(fl.key) + ', the demonstrated minimum of the 2020 engine; SpaceX has not published a Raptor 3 floor.') }),
      el('div', { class: 'rc-legend', 'aria-label': 'Line key' },
        legendItem('Liquid oxygen', '--lox', false), legendItem('Liquid methane', '--ch4', false),
        legendItem('Oxygen gas', '--lox', true), legendItem('Warm methane', '--ch4', true),
        legendItem('Oxygen-rich gas', '--oxgas', true), legendItem('Fuel-rich gas', '--fuelgas', true),
        legendItem('Combustion gas', '--mix', true), legendItem('Spin-start gas', '--muted', true)));
    range.addEventListener('input', () => { st.throttle = Number(range.value) / 100; out.textContent = range.value + '%'; updateReadouts(); updateGlow(); if (!st.playing) stepFlows(0); });

    /* ---- figure */
    const scroll = el('div', { class: 'rc-scroll' }, svg);
    const frame = el('div', { class: 'viz viz-grid' }, scroll);
    const fig = el('figure', { class: 'rc-fig', style: 'margin:0' }, frame,
      el('figcaption', { class: 'rc-fig-foot' },
        el('span', null, (SX.coarse ? 'Tap a pipe to see what flows through it. Tap a component for details. ' : 'Hover a pipe to see what flows through it. Click any component for details. '), el('span', { class: 'rc-swipe' }, 'Scroll sideways for the whole engine.')),
        el('span', null, 'Functional layout, not the physical arrangement. Pressures and temperatures are community estimates for Raptor 2.')));

    const side = el('div', { class: 'rc-side' }, tour, ctl);
    mount.appendChild(el('div', { class: 'rc-main' }, side, fig));
    mount.appendChild(buildWhy());

    Object.assign(V, { seg, body, tour, range, out, play, rThrust, rPc, rFlow, scroll, frame, fig, igniters: svg.querySelector('[data-part="raptor3.igniters"]') });
    V.glowEls = Array.from(svg.querySelectorAll('[data-glow]'));

    wireSchematic(svg);
    updateReadouts();
    updateGlow();
    render();
    stepFlows(0);
    SX.loop(frame, (dt) => { if (st.playing) stepFlows(dt); });
    // On narrow screens the schematic scrolls sideways: open it centered on the engine axis.
    const centerScroll = () => { if (scroll.scrollWidth > scroll.clientWidth + 2) scroll.scrollLeft = (scroll.scrollWidth - scroll.clientWidth) / 2; };
    requestAnimationFrame(centerScroll);
    SX.on('units', () => { updateReadouts(); renderTicks(); });
    SX.on('select', onSelect);
    SX.on('hover', (id) => {
      mount.querySelectorAll('.is-hover').forEach((n) => n.classList.remove('is-hover'));
      if (id) mount.querySelectorAll('[data-part="' + id + '"]').forEach((n) => n.classList.add('is-hover'));
    });
    if (SX.selected) onSelect(SX.selected);
  }

  /* ---- flow animation */
  function stepFlows(dt) {
    const k = st.throttle;
    for (const f of flows) {
      const on = !st.flowOK || st.flowOK(f.key);
      f.el.style.opacity = on ? '' : '0';
      if (!on) continue;
      if (f.period == null) { const a = (f.el.getAttribute('stroke-dasharray') || '10 10').split(/[ ,]+/).map(Number); f.period = a.reduce((s, x) => s + x, 0) || 20; }
      f.off = (f.off - f.v * k * dt) % f.period;
      f.el.setAttribute('stroke-dashoffset', f1(f.off));
    }
  }
  function setPlaying(on) {
    st.playing = on;
    V.play.setAttribute('aria-pressed', String(on));
    V.play.textContent = on ? 'Pause flow' : 'Animate flow';
  }
  function updateGlow() {
    const g = st.glow != null ? st.glow : 0.3 + 0.7 * st.throttle;
    V.glowEls.forEach((n) => n.setAttribute('fill-opacity', f1(g)));
  }
  function updateReadouts() {
    const t = st.throttle;
    V.rThrust.textContent = SX.fmtValue(SX.val('raptor.r3.thrustSL', 250) * t, 'tf', { digits: 0 });
    V.rPc.textContent = SX.fmtValue(SX.val('raptorcycle.pcAtRating', 325) * t, 'bar', { digits: 0 });
    const mdot = SX.val('raptor.r3.massFlow', 750) * t;
    V.rFlow.textContent = SX.units() === 'imperial' ? SX.fmtValue(mdot * 2.20462, 'lb/s', { digits: 0 }) : SX.fmtValue(mdot, 'kg/s', { digits: 0 });
  }

  /* ---- modes and tours */
  function setMode(mode, step, reveal) {
    st.mode = mode;
    st.step = step || 0;
    V.seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    V.mount.classList.toggle('rc-touring', mode !== 'explore');
    render();
    if (reveal && mode !== 'explore') revealMarker();
  }
  function go(d) {
    const T = TOURS[st.mode];
    if (!T) return;
    const n = T.steps.length;
    const i = SX.clamp(st.step + d, 0, n - 1);
    if (i === st.step) return;
    st.step = i;
    render();
    revealMarker();
  }
  function render() {
    const b = V.body;
    const act = document.activeElement;
    const hadFocus = act && b.contains(act) ? (act.getAttribute('aria-label') || act.textContent) : null;
    b.innerHTML = '';
    renderBody(b);
    if (hadFocus) {
      // keep keyboard users in place: refocus the matching control, else the step title
      const same = Array.from(b.querySelectorAll('button')).find((n) => !n.disabled && (n.getAttribute('aria-label') || n.textContent) === hadFocus);
      const tgt = same || b.querySelector('.rc-step-title');
      if (tgt) tgt.focus({ preventScroll: true });
    }
    applyStep();
  }
  function renderBody(b) {
    if (st.mode === 'explore') {
      b.appendChild(el('div', { class: 'rc-step-meta' }, el('span', null, 'Explore'), el('span', null, 'Full flow, CH4 / LOX')));
      b.appendChild(el('h4', { class: 'rc-step-title' }, 'Two pumps, two preburners, one chamber'));
      b.appendChild(el('div', { class: 'rc-step-text', html: '<p>Almost every kilogram of propellant passes through a turbine before it burns, and nothing is thrown overboard. ' + (SX.coarse ? 'Tap' : 'Hover') + ' a pipe to see what flows through it and how hot or pressurized it is; ' + (SX.coarse ? 'tap' : 'click') + ' a component for its details.</p>' }));
      const acts = el('div', { class: 'rc-intro-actions' });
      ['fuel', 'ox', 'start'].forEach((m) => acts.appendChild(el('button', { type: 'button', class: 'btn', onclick: () => setMode(m, 0, true) },
        el('span', null, TOURS[m].label), el('span', { class: 'rc-kbd' }, TOURS[m].steps.length + ' STEPS'))));
      acts.appendChild(el('button', { type: 'button', class: 'btn btn-ghost', onclick: () => SX.select('raptor3.cycle') }, el('span', null, 'About the cycle'), el('span', { class: 'rc-kbd' }, 'INSPECTOR')));
      b.appendChild(acts);
    } else {
      const T = TOURS[st.mode], s = T.steps[st.step], n = T.steps.length;
      b.appendChild(el('div', { class: 'rc-step-meta' }, el('span', null, T.label), el('span', null, 'Step ', el('b', null, String(st.step + 1)), ' of ' + n)));
      b.appendChild(el('h4', { class: 'rc-step-title' }, s.title));
      b.appendChild(el('div', { class: 'rc-step-text', html: '<p>' + SX.withFacts(s.text) + '</p>' }));
      if (T.caveat) b.appendChild(el('p', { class: 'rc-caveat' }, T.caveat));
      const dots = el('div', { class: 'rc-dots', role: 'group', 'aria-label': 'Steps' });
      T.steps.forEach((x, i) => dots.appendChild(el('button', { type: 'button', class: i < st.step ? 'done' : '', 'aria-label': 'Step ' + (i + 1) + ': ' + x.title, 'aria-current': i === st.step ? 'step' : null, onclick: () => { st.step = i; render(); revealMarker(); } })));
      b.appendChild(dots);
      const prev = el('button', { type: 'button', class: 'btn btn-sm', disabled: st.step === 0, onclick: () => go(-1), 'aria-label': 'Previous step' }, 'Prev');
      const next = st.step < n - 1
        ? el('button', { type: 'button', class: 'btn btn-sm btn-primary', onclick: () => go(1), 'aria-label': 'Next step' }, 'Next')
        : el('button', { type: 'button', class: 'btn btn-sm btn-primary', onclick: () => setMode('explore') }, 'Done');
      const det = el('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: () => SX.select(s.part || T.part) }, 'Details');
      b.appendChild(el('div', { class: 'rc-step-nav' }, prev, next, el('span', { class: 'rc-grow' }), det));
      SX.renderFacts(b);
    }
    const title = b.querySelector('.rc-step-title');
    if (title) title.setAttribute('tabindex', '-1');
  }
  function applyStep() {
    const svg = V.svg;
    svg.querySelectorAll('.is-lit').forEach((n) => n.classList.remove('is-lit'));
    const T = TOURS[st.mode];
    const s = T ? T.steps[st.step] : null;
    const dim = !!s && s.lit !== 'all';
    svg.classList.toggle('is-touring', dim);
    if (dim) s.lit.forEach((k) => svg.querySelectorAll('[data-key="' + k + '"]').forEach((n) => n.classList.add('is-lit')));
    if (s) {
      V.marker.setAttribute('transform', 'translate(' + s.at[0] + ' ' + s.at[1] + ')');
      V.marker.querySelector('text').textContent = String(st.step + 1);
      V.marker.setAttribute('visibility', 'visible');
    } else V.marker.setAttribute('visibility', 'hidden');
    st.glow = s && s.glow != null ? s.glow : null;
    st.flowOK = s && s.flows ? ((set) => (k) => set.has(k))(new Set(s.flows)) : ALL_FLOWS_EXCEPT_SPIN;
    if (V.igniters) V.igniters.classList.toggle('rc-sparking', !!(s && s.spark));
    updateGlow();
    stepFlows(0);
  }
  function visibleBand() {
    const topbar = document.querySelector('.topbar');
    let top = (topbar ? topbar.getBoundingClientRect().bottom : 0) + 8;
    const tr = V.tour.getBoundingClientRect();
    if (getComputedStyle(V.tour).position === 'sticky' && tr.bottom > top && tr.top < top + 40) top = tr.bottom + 8;
    return [top, window.innerHeight - 12];
  }
  function reveal(node, always) {
    const beh = SX.reducedMotion ? 'auto' : 'smooth';
    const r = node.getBoundingClientRect();
    const sb = V.scroll.getBoundingClientRect();
    if (V.scroll.scrollWidth > V.scroll.clientWidth + 2) {
      const want = V.scroll.scrollLeft + (r.left + r.width / 2) - (sb.left + sb.width / 2);
      V.scroll.scrollTo({ left: want, behavior: beh });
    }
    const [a, b] = visibleBand();
    const cy = r.top + r.height / 2;
    if (always || cy < a + 30 || cy > b - 30) window.scrollBy({ top: cy - (a + b) / 2, behavior: beh });
  }
  function revealMarker() { requestAnimationFrame(() => reveal(V.marker.querySelector('.badge'), false)); }

  /* ---- schematic interaction */
  function resolveId(node) {
    const id = node.dataset.part;
    if (id && !SX.part(id) && node.dataset.fallback) return node.dataset.fallback;
    return id;
  }
  function tipFor(target) {
    const pipeEl = target.closest('[data-tip]');
    const partEl = target.closest('.rc-part');
    if (pipeEl && V.svg.contains(pipeEl)) { const h = tipHTML(pipeEl.dataset.tip); if (h) return { html: h, partEl, pipeEl }; }
    if (partEl) return { html: partTipHTML(resolveId(partEl), partEl), partEl, pipeEl: null };
    return null;
  }
  function wireSchematic(svg) {
    let hoverId = null, tipPipe = null;
    const setTipPipe = (p) => { if (tipPipe) tipPipe.classList.remove('is-tip'); tipPipe = p; if (p) p.classList.add('is-tip'); };
    svg.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const t = tipFor(e.target);
      if (!t) { SX.tip.hide(); setTipPipe(null); if (hoverId) { hoverId = null; SX.hover(null); } return; }
      SX.tip.show(t.html, e.clientX, e.clientY);
      setTipPipe(t.pipeEl);
      const id = t.partEl ? resolveId(t.partEl) : null;
      if (id !== hoverId) { hoverId = id; SX.hover(id); }
    });
    svg.addEventListener('pointerleave', () => { SX.tip.hide(); setTipPipe(null); if (hoverId) { hoverId = null; SX.hover(null); } });
    svg.addEventListener('click', (e) => {
      const t = tipFor(e.target);
      if (!t || !t.partEl) return;
      // On touch screens a tap on a pipe explains the pipe; tap a component body to open it.
      if (SX.coarse && t.pipeEl && tipPipe !== t.pipeEl) {
        const r = e.target.getBoundingClientRect();
        SX.tip.show(t.html + '<span style="display:block;margin-top:4px;color:var(--muted);font-size:11px">Tap again for details</span>', e.clientX || r.left, e.clientY || r.top);
        setTipPipe(t.pipeEl);
        return;
      }
      SX.tip.hide();
      setTipPipe(null);
      SX.select(resolveId(t.partEl));
    });
    svg.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const p = e.target.closest && e.target.closest('.rc-part');
      if (!p) return;
      e.preventDefault();
      SX.select(resolveId(p));
    });
    svg.addEventListener('focusin', (e) => {
      const p = e.target.closest && e.target.closest('.rc-part');
      if (!p) return;
      const r = p.getBoundingClientRect();
      SX.tip.show(partTipHTML(resolveId(p), p), r.right - 8, r.top + r.height / 2);
    });
    svg.addEventListener('focusout', () => SX.tip.hide());
    window.addEventListener('scroll', () => { if (tipPipe && SX.coarse) { SX.tip.hide(); setTipPipe(null); } }, { passive: true });
  }
  function onSelect(id) {
    const m = V.mount;
    m.querySelectorAll('.is-selected').forEach((n) => n.classList.remove('is-selected'));
    if (!id) return;
    m.querySelectorAll('[data-part="' + id + '"]').forEach((n) => n.classList.add('is-selected'));
  }
  function pulse(node) {
    if (!node) return;
    node.classList.remove('rc-pulse');
    void node.getBoundingClientRect();
    node.classList.add('rc-pulse');
    setTimeout(() => node.classList.remove('rc-pulse'), 2400);
  }

  function focus(id) {
    if (!V) return;
    const tourFor = { 'raptor3.cycle.fuelPath': 'fuel', 'raptor3.cycle.oxPath': 'ox', 'raptor3.startup': 'start' };
    if (tourFor[id]) {
      setMode(tourFor[id], 0, true);
      pulse(V.tour);
      return;
    }
    if (id === 'raptor3.cycles' || id.indexOf('cycles.') === 0) {
      const target = id === 'raptor3.cycles' ? V.mount.querySelector('.rc-cycles') : V.mount.querySelector('.rc-card[data-part="' + id + '"]');
      if (target) { target.scrollIntoView({ block: 'center', behavior: SX.reducedMotion ? 'auto' : 'smooth' }); pulse(target); }
      return;
    }
    if (id === 'raptor3.cycle') { setMode('explore'); pulse(V.frame); return; }
    let node = V.svg.querySelector('.rc-part[data-part="' + id + '"]') || V.svg.querySelector('[data-part="' + id + '"]');
    if (!node) return;
    if (st.mode !== 'explore') setMode('explore');
    reveal(node, false);
    pulse(node);
  }

  /* ---- "why full flow" section */
  function buildWhy() {
    const cards = el('div', { class: 'rc-cycles' });
    CYCLES.forEach((c) => {
      const dl = el('dl');
      c.specs.forEach(([label, key]) => dl.appendChild(el('div', null, el('dt', null, label), el('dd', { html: SX.factHTML(key) }))));
      const card = el('article', { class: 'rc-card' + (c.raptor ? ' is-raptor' : ''), 'data-part': c.id, tabindex: 0, role: 'button','aria-label': c.name + ' cycle, example ' + c.eg + '. Open details.' },
        miniSVG(c),
        el('div', null, el('div', { class: 'rc-card-name' }, c.name), el('div', { class: 'rc-card-eg' }, c.eg)),
        el('span', { class: 'rc-tag ' + (c.dump ? 'dump' : 'into') }, c.dump ? 'Turbine gas dumped overboard' : 'Turbine gas into the chamber'),
        el('p', { class: 'rc-trade' }, c.trade),
        dl);
      card.addEventListener('click', () => SX.select(c.id));
      card.addEventListener('keydown', (e) => { if (e.target === card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); SX.select(c.id); } });
      card.addEventListener('pointerenter', () => SX.hover(c.id));
      card.addEventListener('pointerleave', () => SX.hover(null));
      cards.appendChild(card);
    });
    const miniLegend = el('div', { class: 'legend rc-mini-legend', 'aria-label': 'Key for the cycle diagrams' },
      el('span', null, el('i', { class: 'sw lox' }), 'Liquid oxygen'), el('span', null, el('i', { class: 'sw ch4' }), 'Liquid methane'),
      el('span', null, el('i', { class: 'sw steel' }), 'Other fuels (RP-1 kerosene, LH2 hydrogen)'),
      el('span', null, el('i', { class: 'sw oxgas' }), 'Oxygen-rich gas'), el('span', null, el('i', { class: 'sw fuelgas' }), 'Fuel-rich gas'),
      el('span', { class: 'muted' }, 'Dotted: gas. Schematic; cooling jackets shown only where they drive the turbine.'));

    /* bars */
    const rows = el('div', { class: 'rc-bar-rows' });
    const grid = el('div', { class: 'rc-bar-grid', 'aria-hidden': 'true' });
    rows.appendChild(grid);
    BARS.forEach((b) => {
      const v = SX.val(b.key, 0);
      const track = el('div', { class: 'rc-bar-track' }, el('div', { class: 'rc-bar-fill' + (b.cls ? ' ' + b.cls : ''), style: 'width:' + (100 * v / BAR_MAX).toFixed(2) + '%' }));
      if (b.mark) track.appendChild(el('div', { class: 'rc-bar-mark', title: 'Flight-rating estimate', style: 'left:' + (100 * SX.val(b.mark, 0) / BAR_MAX).toFixed(2) + '%' }));
      const row = el('div', { class: 'rc-bar-row', 'data-part': b.id },
        el('div', { class: 'rc-bar-name' }, el('button', { type: 'button', class: 'rc-bar-btn', onclick: (e) => { e.stopPropagation(); SX.select(b.id); } }, b.name), el('small', null, b.sub)),
        track,
        el('div', { class: 'rc-bar-val', html: SX.factHTML(b.key) }));
      row.addEventListener('click', () => SX.select(b.id));
      rows.appendChild(row);
    });
    const ticks = el('div', { class: 'rc-bar-ticks', 'aria-hidden': 'true' });
    const unit = el('div', { class: 'rc-bar-unit' });
    Object.assign(V, { barGrid: grid, barTicks: ticks, barUnit: unit });
    const bars = el('figure', { class: 'rc-bars', 'aria-labelledby': 'rc-bars-cap' },
      el('figcaption', { id: 'rc-bars-cap' }, el('span', { class: 'h4' }, 'Chamber pressure by engine'), el('span', { class: 'muted small' }, 'Scale starts at zero. Click an engine for its cycle.')),
      rows,
      el('div', { class: 'rc-bar-axis' }, el('span'), ticks, unit),
      el('p', { class: 'rc-bar-foot', html: SX.withFacts('Raptor 3\'s bar is the {{raptor.r3.chamberPressure}} reached by a development engine in a 2023 test. SpaceX has not published the chamber pressure at the 250 tf flight rating; the dashed line <i></i>marks an estimate of about {{raptorcycle.pcAtRating}}. Higher chamber pressure packs more thrust into a smaller engine and leaves room for a larger expansion ratio.') }));
    renderTicks();

    return el('section', { class: 'rc-why', 'aria-labelledby': 'rc-why-title' },
      el('div', { class: 'rc-why-head' },
        el('div', null,
          el('div', { class: 'eyebrow' }, 'Why full flow'),
          el('h4', { class: 'h3', id: 'rc-why-title' }, 'Where does the turbine gas go?'),
          el('p', { class: 'callout' }, 'Specific impulse mostly reflects the propellant. Hydrogen engines post the highest figures because their exhaust is light. Chamber pressure shows more clearly what a cycle makes possible.')),
        el('div', { class: 'prose' },
          el('p', null, 'Every pump-fed rocket engine has the same problem. Its pumps need enormous power, and the only practical source on board is the propellant itself, burned or heated to drive a turbine. Engine cycles differ mainly in what happens to that gas afterward.'),
          el('p', null, 'A gas generator engine throws it overboard. Staged combustion engines send it into the main chamber, so every kilogram produces full thrust and the pumps can push the chamber to far higher pressure. Conventional staged combustion designs choose between an oxygen-rich turbine, which needs exotic alloys, and a fuel-rich one, whose oxygen pump needs a seal against fuel.'),
          el('p', null, 'Full flow takes both routes at once. Each propellant gets its own preburner and turbine, so the turbines share the whole flow and run cooler, each shaft touches only one propellant, and two hot gases meet in the injector. The Soviet RD-270 and the US Integrated Powerhead Demonstrator ran on test stands but never flew; Raptor was the first full-flow engine in flight.'))),
      cards, miniLegend, bars);
  }
  function renderTicks() {
    if (!V || !V.barTicks) return;
    const imp = SX.units() === 'imperial';
    const vals = imp ? [0, 1000, 2000, 3000, 4000, 5000] : [0, 100, 200, 300, 400];
    const toBar = (v) => (imp ? v / 14.5038 : v);
    V.barTicks.innerHTML = '';
    V.barGrid.innerHTML = '';
    vals.forEach((v) => {
      const pct = (100 * toBar(v) / BAR_MAX).toFixed(2) + '%';
      V.barTicks.appendChild(el('span', { style: 'left:' + pct }, v.toLocaleString('en-US')));
      V.barGrid.appendChild(el('i', { style: 'left:' + pct }));
    });
    V.barUnit.textContent = imp ? 'psi' : 'bar';
  }

  /* =================================================================== register */

  SX.register(VIEW, {
    title: 'flow schematic',
    parts: [
      'raptor3.cycle', 'raptor3.cycle.fuelPath', 'raptor3.cycle.oxPath', 'raptor3.startup', 'raptor3.cycles',
      'cycles.gg', 'cycles.orsc', 'cycles.frsc', 'cycles.exp', 'cycles.ffsc',
      'raptor3.loxInlet', 'raptor3.ch4Inlet', 'raptor3.otp', 'raptor3.otp.pump', 'raptor3.otp.shaft', 'raptor3.otp.turbine',
      'raptor3.ftp', 'raptor3.ftp.pump', 'raptor3.ftp.shaft', 'raptor3.ftp.turbine', 'raptor3.opb', 'raptor3.fpb',
      'raptor3.oxDuct', 'raptor3.fuelDuct', 'raptor3.injector', 'raptor3.mcc', 'raptor3.regen', 'raptor3.nozzle',
      'raptor3.igniters', 'raptor3.press',
    ],
    init,
    focus,
  });
})();
