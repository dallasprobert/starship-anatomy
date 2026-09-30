/* Starship Anatomy: engine lab (view "raptorlab").
   Three small instruments about Raptor as a machine that obeys physics:
     A. Evolution: Raptor 1, 2 and 3 drawn at one scale, with a zero-based comparison chart.
     B. Nozzles and plumes: an altitude slider driving a nozzle model, canvas plumes and a thrust chart.
     C. Physics: a rocket-equation playground for the ship, and a propellant comparison.
   Every number shown comes from SX facts. Numbers this view derives are added with SX.addFacts as
   estimates, with the math in the note. */
(function () {
  'use strict';

  const SX = window.SX;
  if (!SX || !SX.register) return;
  const VIEW = 'raptorlab';
  const val = (k) => SX.val(k);

  /* ================================================================== 1. sourced inputs */

  SX.addFacts({
    'lab.pcTestThrust': { v: 269, unit: 'tf', conf: 'official', src: ['S12'], note: 'Thrust at which the development engine Musk called Raptor V3 reached 350 bar chamber pressure, May 2023.' },
    'lab.r1.height': { v: 3.1, unit: 'm', conf: 'official', src: ['RL107'], note: 'SpaceX Starship page, 2019: Raptor length 3.1 m, diameter 1.3 m (Raptor 1 era). Raptor 2 kept the same published length.' },
    'lab.gamma': { v: 1.2, unit: '', conf: 'estimate', src: [], note: 'Modeling assumption: ratio of specific heats of the hot methane-oxygen exhaust. Not a SpaceX figure. Values from 1.15 to 1.25 move the derived exit pressures by roughly 15 to 20 percent either way.' },
    'lab.sepRule': { v: 40, unit: '%', conf: 'estimate', src: ['RL102'], note: 'Rule of thumb: flow separates when nozzle exit pressure falls below about 40% of ambient pressure (published ranges run about 30 to 45%). The real threshold depends on nozzle shape.' },
    'lab.g0': { v: 9.80665, unit: 'm/s²', conf: 'official', src: ['RL103'], note: 'Standard acceleration of gravity, exact by definition. Converts specific impulse in seconds into exhaust velocity.' },
    'lab.rho.lox': { v: 1141, unit: 'kg/m³', conf: 'official', src: ['RL104'], note: 'Saturated liquid oxygen at its normal boiling point (90.2 K). Subcooled LOX, as Starship loads it, is denser.' },
    'lab.rho.ch4': { v: 422.4, unit: 'kg/m³', conf: 'official', src: ['RL104', 'S31'], note: 'Saturated liquid methane at its normal boiling point (111.7 K).' },
    'lab.rho.lh2': { v: 70.8, unit: 'kg/m³', conf: 'official', src: ['RL104', 'S31'], note: 'Saturated liquid (normal) hydrogen at its normal boiling point (20.4 K).' },
    'lab.rho.rp1': { v: 813, unit: 'kg/m³', conf: 'reported', src: ['S31'], note: 'Everyday Astronaut: one liter of RP-1 is around 813 g. RP-1 is a specified kerosene blend, about 0.81 g/mL at room temperature.' },
    'lab.lh2Boil': { v: 20.37, unit: 'K', conf: 'official', src: ['RL104'], note: 'Normal boiling point of normal hydrogen at 1 atm (-252.8 C).' },
    'lab.of.kerolox': { v: 2.72, unit: 'O/F by mass', conf: 'official', src: ['RL105'], note: 'RD-180 mixture ratio, used here as a representative kerosene-oxygen engine.' },
    'lab.of.hydrolox': { v: 6.03, unit: 'O/F by mass', conf: 'official', src: ['RL106'], note: 'RS-25 mixture ratio, used here as a representative hydrogen-oxygen engine.' },
    'lab.isp.rd180Vac': { v: 337.8, unit: 's', conf: 'official', src: ['RL105'], note: 'Vacuum specific impulse of the RD-180, a sea-level kerosene engine (311.3 s at sea level).' },
    'lab.isp.rs25Vac': { v: 452.3, unit: 's', conf: 'official', src: ['RL106'], note: 'Vacuum specific impulse of the RS-25, a sea-level hydrogen engine.' },
    'lab.dvLEO': { v: 9400, unit: 'm/s', conf: 'estimate', src: ['S8'], note: 'Typical budget to reach low Earth orbit from the ground, not a SpaceX figure: about 7.8 km/s of orbital speed (SpaceX: about 17,500 mph), plus roughly 1.5 to 2 km/s of gravity, drag and steering losses, minus up to about 0.4 km/s from Earth\'s rotation for an eastward launch from Starbase (26 deg N). Range about 9.3 to 9.6 km/s.' },
    'lab.dvShipShare': { v: 6500, unit: 'm/s', conf: 'estimate', src: [], note: 'Not published. Two-stage bookkeeping: of the roughly 9.4 km/s total, the booster\'s burn (which also absorbs most of the gravity and drag losses) supplies roughly 2.5 to 3.5 km/s of ideal delta-v, leaving about 6 to 7 km/s for the ship. Depends on the staging point and trajectory.' },
    'lab.dvShipShareLo': { v: 6000, unit: 'm/s', conf: 'estimate', src: [], note: 'Lower edge of the estimated range for the delta-v the ship supplies after staging (see lab.dvShipShare).' },
    'lab.dvShipShareHi': { v: 7000, unit: 'm/s', conf: 'estimate', src: [], note: 'Upper edge of the estimated range for the delta-v the ship supplies after staging (see lab.dvShipShare).' },
    'lab.shipDryAssumed': { v: 130, unit: 't', conf: 'estimate', src: ['S53', 'S27'], note: 'Slider default only. Starship dry mass is not published: Musk put the V1 ship at roughly 100 t (2021) and NASASpaceflight loosely calls Ship 41 a 160-metric-ton vehicle. 130 t is the middle of that range.' },
  }, {
    RL101: { title: 'U.S. Standard Atmosphere, 1976 (NOAA-S/T-76-1562, NASA-TM-X-74335)', publisher: 'NOAA, NASA and US Air Force', date: '1976-10', url: 'https://ntrs.nasa.gov/citations/19770009539' },
    RL102: { title: 'Rocket engine nozzle (flow separation and expansion; used as a pointer)', publisher: 'Wikipedia', date: '2026-09', url: 'https://en.wikipedia.org/wiki/Rocket_engine_nozzle' },
    RL103: { title: 'Standard acceleration of gravity (CODATA 2022)', publisher: 'NIST', date: '2022', url: 'https://physics.nist.gov/cgi-bin/cuu/Value?gn' },
    RL104: { title: 'Thermophysical Properties of Fluid Systems (saturation properties of oxygen, methane and hydrogen)', publisher: 'NIST Chemistry WebBook', date: '2026-09', url: 'https://webbook.nist.gov/chemistry/fluid/' },
    RL105: { title: 'The RD-180 engine (fact sheet: specific impulse, chamber pressure, mixture ratio)', publisher: 'Spaceflight Now', date: '2002-02-19', url: 'https://spaceflightnow.com/atlas/ac204/020219rd180.html' },
    RL106: { title: 'RS-25 Propulsion System specification sheet', publisher: 'L3Harris', date: '2024-07', url: 'https://l3harris.com/sites/default/files/2024-07/l3harris-ar-rs-25-spec-sheet.pdf' },
    RL107: { title: 'Starship page as archived 2019-09-30 (Raptor length 3.1 m, diameter 1.3 m)', publisher: 'SpaceX (Internet Archive copy)', date: '2019-09-30', url: 'https://web.archive.org/web/20190930163150/https://www.spacex.com/starship' },
  });

  /* ================================================================== 2. physics */

  const G0 = val('lab.g0');
  const TF = 1000 * G0; // newtons in one tonne-force

  /* US Standard Atmosphere 1976, layers to 84.852 km geopotential (86 km geometric). Above that the 1976
     standard switches to a species-by-species model; an isothermal extension of the last layer stays within a
     few percent of its tabulated pressure up to 100 km, which is irrelevant to thrust. */
  const ATM = (function () {
    const RSTAR = 8.31432, MAIR = 0.0289644, RE = 6356766;
    const L = [
      [0, 288.15, -0.0065, 101325],
      [11000, 216.65, 0, 22632.06],
      [20000, 216.65, 0.001, 5474.889],
      [32000, 228.65, 0.0028, 868.0187],
      [47000, 270.65, 0, 110.9063],
      [51000, 270.65, -0.0028, 66.93887],
      [71000, 214.65, -0.002, 3.956420],
      [84852, 186.946, 0, 0.3734],
    ];
    const K = G0 * MAIR / RSTAR;
    function at(zm) {
      if (zm == null) return { p: 0, T: null, rho: 0, vac: true };
      const h = RE * zm / (RE + zm);
      let i = L.length - 1;
      while (i > 0 && h < L[i][0]) i--;
      const [hb, Tb, lap, pb] = L[i];
      const dh = h - hb;
      let T, p;
      if (lap === 0) { T = Tb; p = pb * Math.exp(-K * dh / Tb); }
      else { T = Tb + lap * dh; p = pb * Math.pow(Tb / T, K / lap); }
      return { p, T, rho: p * MAIR / (RSTAR * T), vac: false };
    }
    /** geometric altitude (m) at which pressure equals p (Pa); bisection */
    function altOf(p) {
      let lo = 0, hi = 120000;
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (at(m).p > p) lo = m; else hi = m; }
      return (lo + hi) / 2;
    }
    return { at, altOf };
  })();

  /* Ideal (isentropic, frozen) nozzle relations for a constant ratio of specific heats. */
  const NOZ = (function () {
    const g = val('lab.gamma');
    const areaRatio = (M) => (1 / M) * Math.pow((2 / (g + 1)) * (1 + (g - 1) / 2 * M * M), (g + 1) / (2 * (g - 1)));
    function machFromArea(eps) {
      let lo = 1.0001, hi = 40;
      for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (areaRatio(m) < eps) lo = m; else hi = m; }
      return (lo + hi) / 2;
    }
    const pRatio = (M) => Math.pow(1 + (g - 1) / 2 * M * M, -g / (g - 1));
    const machFromP = (pr) => Math.sqrt(Math.max(0, 2 / (g - 1) * (Math.pow(pr, -(g - 1) / g) - 1)));
    function cfVac(eps) {
      const pr = pRatio(machFromArea(eps));
      return Math.sqrt((2 * g * g / (g - 1)) * Math.pow(2 / (g + 1), (g + 1) / (g - 1)) * (1 - Math.pow(pr, (g - 1) / g))) + pr * eps;
    }
    const nu = (M) => {
      if (!isFinite(M)) return (Math.sqrt((g + 1) / (g - 1)) - 1) * Math.PI / 2;
      const a = Math.sqrt(M * M - 1);
      return Math.sqrt((g + 1) / (g - 1)) * Math.atan(Math.sqrt((g - 1) / (g + 1)) * a) - Math.atan(a);
    };
    return { g, areaRatio, machFromArea, pRatio, machFromP, cfVac, nu };
  })();

  /* Solve the sea-level engine: throat sized so the ideal nozzle gives the published-derived vacuum thrust
     through the published exit diameter at the estimated chamber pressure. The RVac shares that throat. */
  const MODEL = (function () {
    const pc = val('raptor.r3.chamberPressure') * 1e5 * val('raptor.r3.thrustSL') / val('lab.pcTestThrust');
    const FvSL = val('raptor.r3.thrustVacOfSLEngine') * TF;
    const FvV = val('raptor.rvac3.thrust') * TF;
    const DeSL = val('raptor.r3.exitDiameter'), DeV = val('raptor.rvac3.exitDiameter');
    const AeSL = Math.PI / 4 * DeSL * DeSL, AeV = Math.PI / 4 * DeV * DeV;
    let lo = 4, hi = 300;
    for (let i = 0; i < 80; i++) {
      const e = (lo + hi) / 2;
      if (NOZ.cfVac(e) * pc * AeSL / e > FvSL) lo = e; else hi = e;
    }
    const epsSL = (lo + hi) / 2;
    const At = AeSL / epsSL;
    const Dt = Math.sqrt(4 * At / Math.PI);
    const MeSL = NOZ.machFromArea(epsSL), peSL = pc * NOZ.pRatio(MeSL);
    const epsV = AeV / At;
    const MeV = NOZ.machFromArea(epsV), peV = pc * NOZ.pRatio(MeV);
    const FvVmodel = NOZ.cfVac(epsV) * pc * At;
    const ispVmodel = val('raptor.r3.ispVac') * NOZ.cfVac(epsV) / NOZ.cfVac(epsSL);
    const sepK = val('lab.sepRule') / 100;
    return {
      pc, At, Dt, Rt: Dt / 2, epsSL, epsV, MeSL, MeV, peSL, peV, FvSL, FvV, AeSL, AeV, FvVmodel, ispVmodel, sepK,
      cfSL: NOZ.cfVac(epsSL), cfV: NOZ.cfVac(epsV),
      altSepV: ATM.altOf(peV / sepK), altIdealSL: ATM.altOf(peSL), altIdealV: ATM.altOf(peV),
    };
  })();

  const r2 = (x, d) => Number(x.toFixed(d == null ? 2 : d));
  const nf = (x, d) => x.toLocaleString('en-US', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d == null ? 0 : d });

  /* ================================================================== 3. derived facts (estimates, math in the note) */

  (function derived() {
    const m = MODEL;
    const F = (k) => val(k);
    const tw = (tf, kg) => tf / (kg / 1000);
    const bulk = (of, rox, rf) => { const fo = of / (1 + of); return 1 / (fo / rox + (1 - fo) / rf); };
    const nSL = F('ship.enginesSL'), nV = F('ship.enginesVac');
    const fSL = F('raptor.r3.thrustVacOfSLEngine'), fV = F('raptor.rvac3.thrust');
    const iSL = F('raptor.r3.ispVac'), iV = F('raptor.rvac3.isp');
    const ispMix = (nSL * fSL + nV * fV) / (nSL * fSL / iSL + nV * fV / iV);
    SX.addFacts({
      'lab.pcFlightEst': { v: Math.round(m.pc / 1e5), unit: 'bar', conf: 'estimate', src: ['S12', 'S2'], note: `Not published. ${F('raptor.r3.chamberPressure')} bar x ${F('raptor.r3.thrustSL')} tf / ${F('lab.pcTestThrust')} tf = ${nf(m.pc / 1e5)} bar, assuming thrust scales with chamber pressure at a fixed throat.` },
      'lab.aeSL': { v: r2(m.AeSL), unit: 'm²', conf: 'estimate', src: ['S1'], note: `pi/4 x (${F('raptor.r3.exitDiameter')} m)^2, taking the published engine diameter as the nozzle exit diameter.` },
      'lab.aeRVac': { v: r2(m.AeV), unit: 'm²', conf: 'estimate', src: ['S1'], note: `pi/4 x (${F('raptor.rvac3.exitDiameter')} m)^2, taking the published RVac diameter as the nozzle exit diameter.` },
      'lab.throatDiaEst': { v: r2(m.Dt, 3), unit: 'm', conf: 'estimate', src: ['S1', 'S12', 'S18'], note: `Throat sized so an ideal nozzle (gamma ${NOZ.g}) at ${nf(m.pc / 1e5)} bar gives the ${fSL} tf vacuum thrust through a ${F('raptor.r3.exitDiameter')} m exit: thrust coefficient ${m.cfSL.toFixed(2)}, throat area ${m.At.toFixed(4)} m2. The 2019 engine's throat was 0.222 m (official).` },
      'lab.epsSLEst': { v: Math.round(m.epsSL), unit: ':1', conf: 'estimate', src: ['S1', 'S18'], note: `Exit area / throat area = ${m.AeSL.toFixed(3)} / ${m.At.toFixed(4)} = ${m.epsSL.toFixed(1)}. Not published for Raptor 3; the 2019 engine was 34.34:1.` },
      'lab.epsRVacEst': { v: Math.round(m.epsV), unit: ':1', conf: 'estimate', src: ['S1'], note: `${m.AeV.toFixed(2)} / ${m.At.toFixed(4)} = ${m.epsV.toFixed(1)}, assuming the RVac shares the sea-level throat and chamber pressure. With that assumption the ideal nozzle predicts ${nf(m.FvVmodel / TF)} tf in vacuum, close to SpaceX's ${fV} tf rating.` },
      'lab.peSLEst': { v: r2(m.peSL / 1e5), unit: 'bar', conf: 'estimate', src: ['S1', 'S12'], note: `Isentropic expansion to ${m.epsSL.toFixed(1)}:1 (exit Mach ${m.MeSL.toFixed(2)}, gamma ${NOZ.g}) from ${nf(m.pc / 1e5)} bar.` },
      'lab.peRVacEst': { v: r2(m.peV / 1e5), unit: 'bar', conf: 'estimate', src: ['S1', 'S12'], note: `Isentropic expansion to ${m.epsV.toFixed(1)}:1 (exit Mach ${m.MeV.toFixed(2)}, gamma ${NOZ.g}) from ${nf(m.pc / 1e5)} bar.` },
      'lab.rvacIspModel': { v: Math.round(m.ispVmodel), unit: 's', conf: 'estimate', src: ['S1', 'S13'], note: `${iSL} s x thrust coefficient ratio ${m.cfV.toFixed(3)} / ${m.cfSL.toFixed(3)}, for the same chamber and throat. Musk's long-standing RVac figure is about ${iV} s; the gap shows how uncertain both Isp values are.` },
      'lab.rvacSepAlt': { v: r2(m.altSepV / 1000, 1), unit: 'km', conf: 'estimate', src: ['RL101', 'RL102'], note: `Altitude where the RVac's estimated exit pressure (${(m.peV / 1e5).toFixed(2)} bar) equals ${F('lab.sepRule')}% of ambient pressure in the US Standard Atmosphere.` },
      'lab.slIdealAlt': { v: r2(m.altIdealSL / 1000, 1), unit: 'km', conf: 'estimate', src: ['RL101'], note: `Altitude where ambient pressure equals the sea-level nozzle's estimated exit pressure (${(m.peSL / 1e5).toFixed(2)} bar).` },
      'lab.rvacIdealAlt': { v: r2(m.altIdealV / 1000, 1), unit: 'km', conf: 'estimate', src: ['RL101'], note: `Altitude where ambient pressure equals the RVac's estimated exit pressure (${(m.peV / 1e5).toFixed(2)} bar).` },
      'lab.ispMix': { v: r2(ispMix, 1), unit: 's', conf: 'estimate', src: ['S1', 'S13'], note: `Total thrust / total mass flow for ${nSL} sea-level and ${nV} vacuum engines: (${nSL} x ${fSL} + ${nV} x ${fV}) / (${nSL} x ${fSL}/${iSL} + ${nV} x ${fV}/${iV}). Engines with more thrust weigh more in the average.` },
      'lab.shipThrustSLOnly': { v: nSL * fSL, unit: 'tf', conf: 'estimate', src: ['S1'], note: `${nSL} x ${fSL} tf vacuum thrust of each sea-level engine.` },
      'lab.shipThrustVacOnly': { v: nV * fV, unit: 'tf', conf: 'estimate', src: ['S1', 'S2'], note: `${nV} x ${fV} tf.` },
      'lab.stackSaving': { v: Math.round((F('raptor.r2.massWithCommodities') - F('raptor.r3.massWithCommodities')) * F('stack.engineCount') / 1000), unit: 't', conf: 'estimate', src: ['S3', 'S4', 'S1'], note: `(${F('raptor.r2.massWithCommodities')} - ${F('raptor.r3.massWithCommodities')} kg) x ${F('stack.engineCount')} engines, engine plus vehicle-side hardware, Raptor 2 to Raptor 3.` },
      'lab.r1.vehicleSide': { v: F('raptor.r1.massWithCommodities') - F('raptor.r1.mass'), unit: 'kg', conf: 'estimate', src: ['S4'], note: `${F('raptor.r1.massWithCommodities')} - ${F('raptor.r1.mass')} kg.` },
      'lab.r2.vehicleSide': { v: F('raptor.r2.massWithCommodities') - F('raptor.r2.mass'), unit: 'kg', conf: 'estimate', src: ['S4'], note: `${F('raptor.r2.massWithCommodities')} - ${F('raptor.r2.mass')} kg.` },
      'lab.r1.twrHw': { v: Math.round(tw(F('raptor.r1.thrustSL'), F('raptor.r1.massWithCommodities'))), unit: 'ratio', conf: 'estimate', src: ['S4'], note: `${F('raptor.r1.thrustSL')} tf / ${F('raptor.r1.massWithCommodities') / 1000} t, engine plus vehicle-side hardware.` },
      'lab.r2.twrHw': { v: Math.round(tw(F('raptor.r2.thrustSL'), F('raptor.r2.massWithCommodities'))), unit: 'ratio', conf: 'estimate', src: ['S4'], note: `${F('raptor.r2.thrustSL')} tf / ${F('raptor.r2.massWithCommodities') / 1000} t, engine plus vehicle-side hardware.` },
      'lab.r3.twrHw': { v: Math.round(tw(F('raptor.r3.thrustSL'), F('raptor.r3.massWithCommodities'))), unit: 'ratio', conf: 'estimate', src: ['S2', 'S3'], note: `${F('raptor.r3.thrustSL')} tf / ${F('raptor.r3.massWithCommodities') / 1000} t, engine plus vehicle-side hardware, at the flight rating.` },
      'lab.r3.twrDemo': { v: Math.round(tw(F('raptor.r3.thrustSLDemonstrated'), F('raptor.r3.mass'))), unit: 'ratio', conf: 'estimate', src: ['S3'], note: `${F('raptor.r3.thrustSLDemonstrated')} tf / ${F('raptor.r3.mass') / 1000} t, at the thrust demonstrated on the test stand in 2024.` },
      'lab.bulk.kerolox': { v: Math.round(bulk(F('lab.of.kerolox'), F('lab.rho.lox'), F('lab.rho.rp1'))), unit: 'kg/m³', conf: 'estimate', src: ['RL104', 'RL105', 'S31'], note: `Mass-weighted mix of LOX (${F('lab.rho.lox')}) and RP-1 (${F('lab.rho.rp1')} kg/m3) at O/F ${F('lab.of.kerolox')}: 1 / (f_ox/rho_ox + f_fuel/rho_fuel).` },
      'lab.bulk.methalox': { v: Math.round(bulk(F('raptor.r3.ofRatio'), F('lab.rho.lox'), F('lab.rho.ch4'))), unit: 'kg/m³', conf: 'estimate', src: ['RL104', 'S18'], note: `LOX (${F('lab.rho.lox')}) and methane (${F('lab.rho.ch4')} kg/m3) at O/F ${F('raptor.r3.ofRatio')} (2019 Raptor value). Starship subcools both, so its real figure is higher.` },
      'lab.bulk.hydrolox': { v: Math.round(bulk(F('lab.of.hydrolox'), F('lab.rho.lox'), F('lab.rho.lh2'))), unit: 'kg/m³', conf: 'estimate', src: ['RL104', 'RL106'], note: `LOX (${F('lab.rho.lox')}) and hydrogen (${F('lab.rho.lh2')} kg/m3) at O/F ${F('lab.of.hydrolox')}.` },
    });
  })();

  /* ================================================================== 4. parts */

  SX.addParts([
    {
      id: 'raptor3.evolution', parent: 'raptor3', name: 'Raptor evolution', short: 'R1 to R3', kind: 'Program history', order: 90, view: VIEW,
      summary: 'Three generations of the same full-flow methane-oxygen engine. Each one made more thrust from less hardware, and Raptor 3 moved its plumbing and electronics inside the engine so it needs no heat shield.',
      body: [
        'Raptor 1 was a development engine wrapped in sensors, external lines and bolted flanges, and the vehicle had to shield it. Raptor 2 (2022) was a near-complete redesign: new turbomachinery, chamber and electronics, many flanges turned into welds, valves merged into valve plates, and far less external plumbing.',
        'Raptor 3 goes further. Its secondary flow paths run inside the engine\'s own housings, its sensors and controllers sit under the engine\'s thermal protection, and the vehicle no longer carries individual engine shrouds. Thrust rose from {{raptor.r1.thrustSL}} to {{raptor.r2.thrustSL}} to {{raptor.r3.thrustSL}} (flight rating; {{raptor.r3.thrustSLDemonstrated}} demonstrated on the stand) while engine mass fell from {{raptor.r1.mass}} to {{raptor.r2.mass}} to {{raptor.r3.mass}}.',
        'The installed saving is larger than the engine saving. Engine plus the vehicle-side hardware and commodities it needs went from {{raptor.r2.massWithCommodities}} to {{raptor.r3.massWithCommodities}}, about {{raptor.r3.massSavingPerEngine}} per engine in SpaceX\'s words, or about {{lab.stackSaving}} across the {{stack.engineCount}} of a full stack (estimate).',
        'SpaceX lists specific impulse as {{raptor.r1.ispListed}}, {{raptor.r2.ispListed}} and {{raptor.r3.ispVac}} without saying sea level or vacuum. The values match the vacuum performance of the sea-level engine, so the engine lab treats them that way.',
      ],
      specs: [
        { label: 'Thrust, Raptor 1', fact: 'raptor.r1.thrustSL' },
        { label: 'Thrust, Raptor 2', fact: 'raptor.r2.thrustSL' },
        { label: 'Thrust, Raptor 3 (flight)', fact: 'raptor.r3.thrustSL' },
        { label: 'Thrust, Raptor 3 (demonstrated)', fact: 'raptor.r3.thrustSLDemonstrated' },
        { label: 'Engine mass, R1 / R2 / R3', value: SX.fmt('raptor.r1.mass') + ' / ' + SX.fmt('raptor.r2.mass') + ' / ' + SX.fmt('raptor.r3.mass'), conf: 'official' },
        { label: 'With vehicle-side hardware, R3', fact: 'raptor.r3.massWithCommodities' },
        { label: 'Saving per engine, R2 to R3', fact: 'raptor.r3.massSavingPerEngine' },
        { label: 'Thrust-to-weight, R3 (engine only)', value: SX.fmt('raptor.r3.twr', { unitless: true }) + ' to 1', conf: 'estimate' },
      ],
      related: ['raptor3.cycle', 'raptor3.regen', 'raptor3.igniters', 'raptor3.controller'],
    },
    {
      id: 'raptor3.evolution.r1', parent: 'raptor3.evolution', name: 'Raptor 1', short: 'R1', kind: 'Engine generation, 2019 to 2022', order: 1, view: VIEW,
      summary: 'The first flight-weight Raptor: {{raptor.r1.thrustSL}} at sea level from a {{raptor.r1.mass}} engine. It flew Starhopper and the SN5 to SN15 suborbital prototypes.',
      body: [
        'Raptor 1 proved that a full-flow staged combustion engine could fly. It was also plainly a development engine: a dense tree of external lines, bolted flanges, individual valves, sensors and wiring, all of which the vehicle had to protect with shrouds and a heat shield.',
        'A 2019 plume analysis prepared for SpaceX and filed with the FAA gives the best public snapshot of its insides: mixture ratio {{raptor.r1.ofRatio}}, a {{raptor.r1.expansionRatio}} regeneratively cooled nozzle with a {{raptor.r1.exitDiameter}} exit and a {{raptor.r1.throatDiameter}} throat, and about {{raptor.r1.filmCooling}} used as film coolant near the throat.',
        'Raptor 1 carried redundant torch igniters in the main chamber. Raptor 2 deleted them, because the hot fuel-rich and oxygen-rich gases ignite on contact.',
      ],
      specs: [
        { label: 'Sea-level thrust', fact: 'raptor.r1.thrustSL' },
        { label: 'Specific impulse (as listed)', fact: 'raptor.r1.ispListed' },
        { label: 'Sea-level Isp', fact: 'raptor.r1.ispSL' },
        { label: 'Engine mass', fact: 'raptor.r1.mass' },
        { label: 'With vehicle-side hardware', fact: 'raptor.r1.massWithCommodities' },
        { label: 'Chamber pressure', fact: 'raptor.r1.chamberPressure' },
        { label: 'Thrust-to-weight (engine only)', value: SX.fmt('raptor.r1.twr', { unitless: true }) + ' to 1', conf: 'estimate' },
        { label: 'Mixture ratio', fact: 'raptor.r1.ofRatio' },
        { label: 'Expansion ratio', fact: 'raptor.r1.expansionRatio' },
        { label: 'Nozzle exit diameter', fact: 'raptor.r1.exitDiameter' },
      ],
    },
    {
      id: 'raptor3.evolution.r2', parent: 'raptor3.evolution', name: 'Raptor 2', short: 'R2', kind: 'Engine generation, 2022 to 2025', order: 2, view: VIEW,
      summary: 'The production engine of Starship V1 and V2, Flights 1 to 11: {{raptor.r2.thrustSL}} from {{raptor.r2.mass}}, at about half the cost of Raptor 1 according to Musk.',
      body: [
        'Raptor 2 was a near-complete redesign with new turbomachinery, chamber, nozzle and electronics. SpaceX turned many flanges into welds, merged valves into valve plates, deleted the main-chamber torch igniters and cut back the external plumbing. It ran at about {{raptor.r2.chamberPressure}}.',
        'On first-generation boosters the outer ring of {{booster.enginesOuter}} was a fixed Raptor Boost variant, reportedly spun up by ground equipment through the launch mount, so it could not relight in flight. Raptor 2 flew the first booster catch, the first reflown Raptor and the first in-space relight. Its vacuum version made {{raptor.rvac2.thrust}}.',
        'Its failures fed straight into Raptor 3: oxygen filter blockages on Flights 2 and 3, igniter problems on Flights 7 and 8, and leaks into the ship\'s aft section that SpaceX said Raptor 3 would design out.',
      ],
      specs: [
        { label: 'Sea-level thrust', fact: 'raptor.r2.thrustSL' },
        { label: 'Specific impulse (as listed)', fact: 'raptor.r2.ispListed' },
        { label: 'Sea-level Isp', fact: 'raptor.r2.ispSL' },
        { label: 'Engine mass', fact: 'raptor.r2.mass' },
        { label: 'With vehicle-side hardware', fact: 'raptor.r2.massWithCommodities' },
        { label: 'Chamber pressure', fact: 'raptor.r2.chamberPressure' },
        { label: 'Thrust-to-weight (engine only)', value: SX.fmt('raptor.r2.twr', { unitless: true }) + ' to 1', conf: 'estimate' },
        { label: 'Length', fact: 'raptor.r2.height' },
        { label: 'Gimbal range', fact: 'raptor.r2.gimbalRange' },
        { label: 'Raptor Vacuum 2 thrust', fact: 'raptor.rvac2.thrust' },
      ],
    },
    {
      id: 'raptor3.plume', parent: 'raptor3', name: 'Nozzles and plumes', short: 'Plume', kind: 'Physics', order: 91, view: VIEW,
      summary: 'Why Starship carries two kinds of nozzle, and how a plume changes shape from the launch pad to vacuum as the air around it thins out.',
      body: [
        'A nozzle turns hot, high-pressure gas into speed. The more it expands the gas, the faster the exhaust and the higher the efficiency, but the exhaust leaves at a lower pressure. Thrust is the exhaust momentum plus the pressure difference across the exit: in vacuum nothing pushes back, and at altitude h the air subtracts p_a(h) x A_e. That is why a big nozzle wins in space and loses near the ground.',
        'The sea-level Raptor 3 has a {{raptor.r3.exitDiameter}} exit. In this lab\'s ideal-nozzle estimate its exit pressure is about {{lab.peSLEst}}, close to sea-level air pressure, so it runs nearly matched on the pad. Raptor Vacuum 3 has a {{raptor.rvac3.exitDiameter}} exit and expands the gas to about {{lab.peRVacEst}} (estimate).',
        'If a nozzle\'s exit pressure falls far below ambient, roughly {{lab.sepRule}} of it by a common rule of thumb, the air pushes into the bell and the flow separates from the wall. Separation lines are unsteady and asymmetric, so they push the nozzle sideways. By this estimate the RVac\'s flow would separate below about {{lab.rvacSepAlt}}. Ships do fire all their engines, RVacs included, in short static fires on the ground, but in flight the RVacs light only after staging and the sea-level engines do every landing.',
        'Model: ideal nozzle with fixed chamber conditions, US Standard Atmosphere 1976, gamma {{lab.gamma}}, chamber pressure {{lab.pcFlightEst}}. Plume shapes in the drawing are schematic.',
      ],
      specs: [
        { label: 'Sea-level nozzle exit', fact: 'raptor.r3.exitDiameter' },
        { label: 'RVac nozzle exit', fact: 'raptor.rvac3.exitDiameter' },
        { label: 'Exit area, sea level / RVac', value: SX.fmt('lab.aeSL') + ' / ' + SX.fmt('lab.aeRVac'), conf: 'estimate' },
        { label: 'Expansion ratio, sea level', fact: 'lab.epsSLEst' },
        { label: 'Expansion ratio, RVac', fact: 'lab.epsRVacEst' },
        { label: 'Exit pressure, sea level', fact: 'lab.peSLEst' },
        { label: 'Exit pressure, RVac', fact: 'lab.peRVacEst' },
        { label: 'Separation rule of thumb', fact: 'lab.sepRule' },
        { label: 'RVac separates below', fact: 'lab.rvacSepAlt' },
      ],
      related: ['raptor3.nozzle', 'raptor3.rvac', 'raptor3.regen', 'ship.enginesVac'],
    },
    {
      id: 'raptor3.physics', parent: 'raptor3', name: 'Rocket equation', short: 'Delta-v', kind: 'Physics', order: 92, view: VIEW,
      summary: 'The rocket equation turns specific impulse and mass ratio into delta-v, and shows why every tonne of dry mass and every second of Isp matters on the ship.',
      body: [
        'Delta-v = Isp x g0 x ln(m0 / mf). Isp x g0 is the effective exhaust velocity; m0 is the ship fully loaded and mf what is left when the propellant is gone. Because of the logarithm, adding propellant gives diminishing returns, while every tonne of dry mass or payload is carried through the whole burn.',
        'With every engine lit ({{ship.enginesSL}} sea-level and {{ship.enginesVac}} vacuum), the ship\'s vacuum thrust is {{ship.thrustVac}} and its thrust-weighted vacuum Isp is about {{lab.ispMix}} (estimate). The mass flow of each engine sets the weighting, so the RVacs pull the average up only part of the way to their own {{raptor.rvac3.isp}}.',
        'Starship\'s dry mass is not published, so the playground treats it as a slider. The marker lines are estimates: reaching low Earth orbit from the ground costs about {{lab.dvLEO}} including losses, and the ship must supply roughly {{lab.dvShipShare}} of that after staging.',
      ],
      specs: [
        { label: 'Ship propellant', fact: 'ship.propTotal' },
        { label: 'Ship vacuum thrust', fact: 'ship.thrustVac' },
        { label: 'Isp, sea-level engine in vacuum', fact: 'raptor.r3.ispVac' },
        { label: 'Isp, Raptor Vacuum 3', fact: 'raptor.rvac3.isp' },
        { label: 'Isp, all engines together', fact: 'lab.ispMix' },
        { label: 'Standard gravity g0', fact: 'lab.g0' },
        { label: 'Ground to LEO incl. losses', fact: 'lab.dvLEO' },
        { label: 'Ship share after staging', fact: 'lab.dvShipShare' },
      ],
      related: ['raptor3.physics.methane', 'ship', 'ship.enginesVac', 'ship.enginesSL'],
    },
    {
      id: 'raptor3.physics.methane', parent: 'raptor3.physics', name: 'Why methane', kind: 'Propellant choice', order: 1, view: VIEW,
      summary: 'Methane sits between kerosene and hydrogen for efficiency and density, burns without coking an engine that has to fly again, stores at a temperature close to liquid oxygen, and can be made on Mars.',
      body: [
        'Kerosene (RP-1) is dense and storable at room temperature, but in a fuel-rich preburner it leaves soot and coke that foul turbines and cooling passages, which is a problem for an engine meant to be reused many times.',
        'Hydrogen gives the highest specific impulse, but liquid hydrogen is so light ({{lab.rho.lh2}}) that tanks become huge, and it boils at {{lab.lh2Boil}}, which makes it hard to insulate and to keep for months.',
        'Methane sits between them. At {{lab.rho.ch4}} it is much denser than hydrogen, it boils at {{propellant.ch4Boil}}, close to liquid oxygen at {{propellant.loxBoil}}, so the two tanks can share a common dome, and it burns cleanly. On Mars, water and atmospheric carbon dioxide can be turned into methane and oxygen with electrolysis and the Sabatier reaction.',
      ],
      specs: [
        { label: 'Liquid methane density', fact: 'lab.rho.ch4' },
        { label: 'Liquid hydrogen density', fact: 'lab.rho.lh2' },
        { label: 'RP-1 density', fact: 'lab.rho.rp1' },
        { label: 'Methalox bulk density', fact: 'lab.bulk.methalox' },
        { label: 'Methane boiling point', fact: 'propellant.ch4Boil' },
        { label: 'Oxygen boiling point', fact: 'propellant.loxBoil' },
        { label: 'Hydrogen boiling point', fact: 'lab.lh2Boil' },
      ],
    },
  ]);

  // raptor3.nozzle and raptor3.rvac belong to the 3D engine view. Stub them only if nobody has, so this view's
  // links never point at an unknown id; the owner's later addParts call overwrites these fields.
  [['raptor3.nozzle', 'Sea-level nozzle', 'Nozzle'], ['raptor3.rvac', 'Raptor Vacuum 3', 'Engine variant']].forEach(([id, name, kind]) => {
    if (!SX.part(id)) SX.addParts([{ id, parent: 'raptor3', name, kind }]);
  });

  /* ================================================================== 5. styles */

  SX.css(`
.v-raptorlab { --rl-gap: clamp(16px, 2.4vw, 28px); }
.v-raptorlab .rl-nav { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
.v-raptorlab .rl-panel { padding-top: clamp(26px, 4vw, 44px); scroll-margin-top: calc(var(--topbar) + 12px); }
.v-raptorlab .rl-panel + .rl-panel { margin-top: clamp(30px, 4vw, 48px); border-top: 1px solid var(--line); }
.v-raptorlab .rl-head { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px 24px; align-items: end; margin-bottom: 18px; }
.v-raptorlab .rl-head .eyebrow { color: var(--accent); }
.v-raptorlab .rl-head h4 { margin-top: 6px; font-size: clamp(19px, 2vw, 23px); }
.v-raptorlab .rl-head p { margin-top: 8px; max-width: 66ch; color: var(--fg-2); }
.v-raptorlab .rl-grid { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: var(--rl-gap); align-items: start; }
.v-raptorlab .rl-grid-even { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
@media (max-width: 900px) {
  .v-raptorlab .rl-grid, .v-raptorlab .rl-grid-even { grid-template-columns: minmax(0, 1fr); }
  .v-raptorlab .rl-head { grid-template-columns: minmax(0, 1fr); }
  .v-raptorlab .rl-head > .btn { justify-self: start; }
}
.v-raptorlab .rl-fig { padding: 14px 14px 12px; }
.v-raptorlab .rl-fig svg { overflow: visible; }
.v-raptorlab .rl-figtitle { display: flex; justify-content: space-between; gap: 8px 16px; flex-wrap: wrap; align-items: baseline; margin-bottom: 6px; position: relative; z-index: 1; }
.v-raptorlab .rl-note { font: 400 11px/1.45 var(--font-mono); color: var(--muted); letter-spacing: 0.02em; }
.v-raptorlab .rl-note b { color: var(--fg-2); font-weight: 500; }
.v-raptorlab .rl-card p.rl-note, .v-raptorlab .rl-fig p.rl-note { font: 400 11px/1.5 var(--font-mono); color: var(--muted); letter-spacing: 0.02em; }
.v-raptorlab .rl-legend .rl-legend-plain::before { display: none; }
.v-raptorlab .rl-subhead { margin: 0; font: 600 clamp(19px, 2vw, 23px)/1.1 var(--font-display); text-transform: uppercase; letter-spacing: 0.04em; }
.v-raptorlab .rl-kicker { font: 500 10px/1.2 var(--font-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.v-raptorlab .rl-side { display: grid; gap: 14px; min-width: 0; }
.v-raptorlab .rl-card { background: var(--bg-2); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px 16px; min-width: 0; }
.v-raptorlab .rl-card h5 { margin: 0 0 6px; font: 600 15px/1.2 var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; color: var(--fg); }
.v-raptorlab .rl-card p { font-size: 13.5px; color: var(--fg-2); }
.v-raptorlab .rl-card p + p { margin-top: 0.6em; }
.v-raptorlab .rl-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); gap: 12px; margin-top: var(--rl-gap); }
.v-raptorlab .rl-pulse { animation: rl-pulse 1.4s ease-out 1; }
@keyframes rl-pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 210, 74, 0.55); } 100% { box-shadow: 0 0 0 16px rgba(255, 210, 74, 0); } }
.v-raptorlab .rl-svgpulse { animation: rl-svgpulse 1.4s ease-out 1; }
@keyframes rl-svgpulse { 0%, 60% { filter: drop-shadow(0 0 6px var(--accent)); } 100% { filter: none; } }
.v-raptorlab .svg-label, .v-raptorlab .svg-label-muted { paint-order: stroke; stroke: var(--bg); stroke-width: 3px; stroke-linejoin: round; }
.v-raptorlab .rl-halo { paint-order: stroke; stroke: var(--bg); stroke-width: 3px; stroke-linejoin: round; }

/* ---------- A: evolution drawing */
.v-raptorlab .rl-evo-svg .rl-metal-a { stop-color: var(--bg-3); }
.v-raptorlab .rl-evo-svg .rl-metal-b { stop-color: var(--steel-2); stop-opacity: 0.55; }
.v-raptorlab .rl-evo-svg .rl-metal-c { stop-color: var(--bg-4); }
.v-raptorlab .rl-evo-svg .rl-metal-d { stop-color: var(--bg-2); }
.v-raptorlab .rl-dark-a { stop-color: var(--bg-2); }
.v-raptorlab .rl-dark-b { stop-color: var(--steel-2); stop-opacity: 0.32; }
.v-raptorlab .rl-dark-c { stop-color: var(--bg); }
.v-raptorlab .rl-body { stroke: var(--steel-2); stroke-width: 1; }
.v-raptorlab .rl-fill-metal { fill: url(#rl-evo-metal); }
.v-raptorlab .rl-fill-dark { fill: url(#rl-evo-dark); }
.v-raptorlab .rl-body-flat { fill: var(--bg-4); stroke: var(--steel-2); stroke-width: 1; }
.v-raptorlab .rl-lip { fill: var(--bg); stroke: var(--steel-2); stroke-width: 1; }
.v-raptorlab .rl-ring { fill: var(--bg-4); stroke: var(--steel); stroke-width: 1; }
.v-raptorlab .rl-band { fill: none; stroke: var(--steel-2); stroke-width: 1; opacity: 0.8; }
.v-raptorlab .rl-rib { stroke: var(--line-2); stroke-width: 1; }
.v-raptorlab .rl-pipe-o { fill: none; stroke: var(--bg); stroke-linecap: round; stroke-linejoin: round; }
.v-raptorlab .rl-pipe { fill: none; stroke: var(--steel-2); stroke-linecap: round; stroke-linejoin: round; }
.v-raptorlab .rl-pipe-hi { fill: none; stroke: var(--steel); stroke-linecap: round; stroke-linejoin: round; opacity: 0.38; }
.v-raptorlab .rl-flange { stroke: var(--steel); stroke-linecap: butt; }
.v-raptorlab .rl-weld { stroke: var(--fg-2); stroke-linecap: butt; opacity: 0.7; }
.v-raptorlab .rl-valve { fill: var(--bg-3); stroke: var(--steel); stroke-width: 1; }
.v-raptorlab .rl-box { fill: var(--bg-2); stroke: var(--steel-2); stroke-width: 1; }
.v-raptorlab .rl-sensor { fill: var(--bg-2); stroke: var(--fg-2); stroke-width: 1; }
.v-raptorlab .rl-harness { fill: none; stroke: var(--muted); stroke-width: 1.2; stroke-dasharray: 2 2; }
.v-raptorlab .rl-port { fill: var(--bg); stroke: var(--steel-2); stroke-width: 1; }
.v-raptorlab .rl-shroud { fill: none; stroke: var(--warn); stroke-width: 1; stroke-dasharray: 5 4; opacity: 0.75; }
.v-raptorlab .rl-shroud-t { fill: var(--warn); font: 500 10px var(--font-mono); letter-spacing: 0.08em; }
.v-raptorlab .rl-clean-t { fill: var(--good); font: 500 10px var(--font-mono); letter-spacing: 0.08em; }
.v-raptorlab .rl-ground { stroke: var(--line-2); stroke-width: 1; stroke-dasharray: 2 4; }
.v-raptorlab .rl-dim { stroke: var(--muted); stroke-width: 1; fill: none; }
.v-raptorlab .rl-balloon circle { fill: var(--bg-2); stroke: var(--fg-2); stroke-width: 1; }
.v-raptorlab .rl-balloon text { fill: var(--fg); font: 600 10px var(--font-mono); text-anchor: middle; dominant-baseline: central; }
.v-raptorlab .rl-lead { stroke: var(--fg-2); stroke-width: 1; fill: none; }
.v-raptorlab .rl-lead-dot { fill: var(--fg-2); }
.v-raptorlab .rl-evo-eng { transition: opacity 0.2s; }
.v-raptorlab .rl-evo-eng.is-dim { opacity: 0.6; }
.v-raptorlab .rl-evo-eng.is-dim:hover, .v-raptorlab .rl-evo-eng.is-dim:focus-visible { opacity: 0.8; }
.v-raptorlab .rl-hit { fill: transparent; stroke: none; pointer-events: all; }
.v-raptorlab .rl-evo-caps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 6px; }
.v-raptorlab .rl-vbtn { display: grid; gap: 3px; text-align: left; background: var(--bg-2); border: 1px solid var(--line); border-radius: var(--radius); padding: 9px 10px; color: var(--fg); cursor: pointer; min-width: 0; font: inherit; }
.v-raptorlab .rl-vbtn:hover { border-color: var(--steel-2); }
.v-raptorlab .rl-vbtn[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); }
.v-raptorlab .rl-vbtn b { font: 700 16px/1 var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; }
.v-raptorlab .rl-vbtn[aria-pressed="true"] b { color: var(--accent); }
.v-raptorlab .rl-vbtn span { font: 400 11px/1.35 var(--font-mono); color: var(--muted); }
.v-raptorlab .rl-vlist { margin: 6px 2px 0; padding: 0; list-style: none; display: grid; gap: 3px; font: 400 11px/1.35 var(--font-mono); color: var(--fg-2); }
.v-raptorlab .rl-vlist li { display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 5px; }
.v-raptorlab .rl-vlist i { font-style: normal; width: 15px; height: 15px; border: 1px solid var(--fg-2); border-radius: 50%; display: grid; place-items: center; font-size: 9px; line-height: 1; margin-top: 0; }
@media (max-width: 640px) {
  .v-raptorlab .rl-evo-svg .rl-balloon, .v-raptorlab .rl-evo-svg .rl-lead, .v-raptorlab .rl-evo-svg .rl-lead-dot, .v-raptorlab .rl-evo-svg .rl-shroud-t, .v-raptorlab .rl-evo-svg .rl-clean-t { display: none; }
  .v-raptorlab .rl-evo-svg .svg-label-muted { font-size: 17px; }
  .v-raptorlab .rl-vlist { display: none; }
  .v-raptorlab .rl-vbtn { padding: 8px; }
  .v-raptorlab .rl-vbtn b { font-size: 14px; }
}

/* ---------- A: comparison chart */
.v-raptorlab .rl-metric { padding: 11px 0 12px; border-top: 1px solid var(--line); }
.v-raptorlab .rl-metric:first-of-type { border-top: 0; padding-top: 2px; }
.v-raptorlab .rl-metric-h { display: flex; justify-content: space-between; gap: 4px 12px; align-items: baseline; flex-wrap: wrap; margin-bottom: 7px; }
.v-raptorlab .rl-metric-name { font: 500 11px/1.3 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg); }
.v-raptorlab .rl-metric-note { font: 400 10.5px/1.3 var(--font-mono); color: var(--muted); }
.v-raptorlab .rl-bar { display: grid; grid-template-columns: 2.2em minmax(0, 1fr) minmax(6.6em, auto); gap: 8px; align-items: center; min-height: 21px; cursor: pointer; }
.v-raptorlab .rl-bar-lab { font: 500 11px/1 var(--font-mono); color: var(--muted); }
.v-raptorlab .rl-bar.is-on .rl-bar-lab { color: var(--accent); }
.v-raptorlab .rl-track { position: relative; height: 9px; background: var(--bg-3); border-radius: 2px; }
.v-raptorlab .rl-fillbar { position: absolute; left: 0; top: 0; bottom: 0; background: var(--steel-2); border-radius: 2px 0 0 2px; transition: background 0.2s; }
.v-raptorlab .rl-bar.is-on .rl-fillbar { background: var(--accent); }
.v-raptorlab .rl-fillbar.rl-hatch { background: repeating-linear-gradient(135deg, var(--steel-2) 0 2px, transparent 2px 5px); border-radius: 0; }
.v-raptorlab .rl-bar.is-on .rl-fillbar.rl-hatch { background: repeating-linear-gradient(135deg, var(--accent) 0 2px, transparent 2px 5px); }
.v-raptorlab .rl-ghost { position: absolute; top: 0; bottom: 0; border: 1px dashed var(--steel-2); border-left: 0; border-radius: 0 2px 2px 0; }
.v-raptorlab .rl-bar.is-on .rl-ghost { border-color: var(--accent); }
.v-raptorlab .rl-tick { position: absolute; top: -4px; bottom: -4px; width: 2px; margin-left: -1px; background: var(--fg); border-radius: 1px; }
.v-raptorlab .rl-bar-val { font: 500 12px/1.2 var(--font-mono); text-align: right; white-space: nowrap; color: var(--fg-2); }
.v-raptorlab .rl-bar.is-on .rl-bar-val { color: var(--fg); }
.v-raptorlab .rl-bar-val small { font-size: 10.5px; color: var(--muted); }
.v-raptorlab .rl-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; font: 400 10.5px/1.3 var(--font-mono); color: var(--muted); margin-top: 10px; }
.v-raptorlab .rl-legend > span::before { content: ""; display: inline-block; width: 12px; height: 8px; margin-right: 6px; vertical-align: 0; background: var(--steel-2); border-radius: 1px; }
.v-raptorlab .rl-legend > .lg-hatch::before { background: repeating-linear-gradient(135deg, var(--steel-2) 0 2px, transparent 2px 4px); }
.v-raptorlab .rl-legend > .lg-ghost::before { background: transparent; border: 1px dashed var(--steel-2); height: 6px; }
.v-raptorlab .rl-legend > .lg-tick::before { width: 2px; height: 11px; background: var(--fg); vertical-align: -2px; }

/* ---------- A: change list */
.v-raptorlab .rl-changes { margin: var(--rl-gap) 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 0 28px; counter-reset: rlc; }
.v-raptorlab .rl-changes li { counter-increment: rlc; display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 2px 10px; padding: 12px 0; border-top: 1px solid var(--line); align-content: start; }
.v-raptorlab .rl-changes li::before { content: counter(rlc, decimal-leading-zero); font: 500 12px/1.5 var(--font-mono); color: var(--accent); grid-row: span 2; }
.v-raptorlab .rl-changes h5 { margin: 0; font: 600 15px/1.3 var(--font-display); text-transform: uppercase; letter-spacing: 0.04em; }
.v-raptorlab .rl-changes p { font-size: 13.5px; color: var(--fg-2); max-width: 60ch; }

/* ---------- B: nozzle figure */
.v-raptorlab .rl-noz-stage { position: relative; width: 100%; }
.v-raptorlab .rl-noz-stage canvas, .v-raptorlab .rl-noz-stage svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.v-raptorlab .rl-noz-svg .rl-sec { fill: url(#rl-noz-hatch); stroke: var(--steel); stroke-width: 1; }
.v-raptorlab .rl-noz-svg .rl-hatch-line { stroke: var(--steel-2); stroke-width: 1; }
.v-raptorlab .rl-noz-svg .rl-sep-line { stroke: var(--bad); stroke-width: 1; }
.v-raptorlab .rl-noz-svg .rl-sepzone { fill: url(#rl-noz-sep); stroke: var(--bad); stroke-width: 1; stroke-dasharray: 3 3; }
.v-raptorlab .rl-noz-svg .rl-cl { stroke: var(--muted); stroke-width: 1; stroke-dasharray: 14 4 2 4; opacity: 0.55; }
.v-raptorlab .rl-noz-svg .rl-mount { stroke: var(--line-2); stroke-width: 1; stroke-dasharray: 2 4; }
.v-raptorlab .rl-noz-svg text { font-family: var(--font-mono); }
.v-raptorlab .rl-t-sl { fill: var(--steel); }
.v-raptorlab .rl-t-v { fill: var(--copper); }
.v-raptorlab .rl-arrow-a { stroke: var(--fg-2); stroke-width: 1.5; fill: none; }
.v-raptorlab .rl-arrow-e { stroke: var(--plume); stroke-width: 1.5; fill: none; }
.v-raptorlab .rl-arrowhead-a { fill: var(--fg-2); }
.v-raptorlab .rl-arrowhead-e { fill: var(--plume); }
.v-raptorlab .rl-regime { font: 600 12px var(--font-mono); letter-spacing: 0.08em; }
.v-raptorlab .rl-reg-bad { fill: var(--bad); }
.v-raptorlab .rl-reg-over { fill: var(--warn); }
.v-raptorlab .rl-reg-ideal { fill: var(--good); }
.v-raptorlab .rl-reg-under { fill: var(--plume); }
.v-raptorlab .rl-plume-hit:focus-visible { outline: none; stroke: var(--accent); stroke-width: 1.5; stroke-dasharray: 5 4; }
@media (max-width: 640px) {
  .v-raptorlab .rl-noz-svg .svg-label, .v-raptorlab .rl-noz-svg .svg-label-muted { font-size: 17px; }
  .v-raptorlab .rl-noz-svg .rl-regime { font-size: 17px; }
  .v-raptorlab .rl-noz-svg .rl-hide-sm { display: none; }
}

/* ---------- B: controls and readouts */
.v-raptorlab .rl-alt { display: grid; gap: 10px; }
.v-raptorlab .rl-alt-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center; }
.v-raptorlab .rl-alt-row label { font: 500 11px/1.2 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.v-raptorlab .rl-alt-row output { font: 600 22px/1 var(--font-display); letter-spacing: 0.02em; font-variant-numeric: tabular-nums; min-width: 5.2em; text-align: right; }
.v-raptorlab .rl-atm { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.v-raptorlab .rl-stat { background: var(--bg); border: 1px solid var(--line); border-radius: 4px; padding: 8px 10px; min-width: 0; }
.v-raptorlab .rl-stat dt { font: 500 9.5px/1.2 var(--font-mono); letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
.v-raptorlab .rl-stat dd { margin: 4px 0 0; font: 500 14px/1.2 var(--font-mono); font-variant-numeric: tabular-nums; color: var(--fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.v-raptorlab .rl-tbl { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.v-raptorlab .rl-tbl th, .v-raptorlab .rl-tbl td { padding: 7px 6px; border-top: 1px solid var(--line); text-align: right; font-variant-numeric: tabular-nums; }
.v-raptorlab .rl-tbl thead th { border-top: 0; font: 500 10px/1.2 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.v-raptorlab .rl-tbl tbody th { text-align: left; font: 500 10.5px/1.25 var(--font-mono); letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); padding-left: 0; }
.v-raptorlab .rl-tbl td { font-family: var(--font-mono); color: var(--fg); }
.v-raptorlab .rl-tbl .c-sl { color: var(--steel); }
.v-raptorlab .rl-tbl .c-v { color: var(--copper); }
.v-raptorlab .rl-sw { display: inline-block; width: 10px; height: 3px; border-radius: 2px; vertical-align: 3px; margin-right: 6px; }
.v-raptorlab .rl-sw.sl { background: var(--steel); }
.v-raptorlab .rl-sw.v { background: var(--copper); }
.v-raptorlab .rl-badge { display: inline-block; font: 500 10px/1 var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 5px; border-radius: 3px; border: 1px solid currentColor; white-space: nowrap; }
.v-raptorlab .rl-b-bad { color: var(--bad); }
.v-raptorlab .rl-b-over { color: var(--warn); }
.v-raptorlab .rl-b-ideal { color: var(--good); }
.v-raptorlab .rl-b-under { color: var(--plume); }
.v-raptorlab .rl-gauge text { font-family: var(--font-mono); }
.v-raptorlab .rl-gz-bad { fill: var(--bad); opacity: 0.2; }
.v-raptorlab .rl-gz-over { fill: var(--warn); opacity: 0.16; }
.v-raptorlab .rl-gz-ideal { fill: var(--good); opacity: 0.3; }
.v-raptorlab .rl-gz-under { fill: var(--plume); opacity: 0.14; }
.v-raptorlab .rl-gmark-sl { fill: var(--steel); }
.v-raptorlab .rl-gmark-v { fill: var(--copper); }
.v-raptorlab .rl-lg { display: inline-block; width: 10px; height: 8px; margin-right: 5px; border-radius: 1px; vertical-align: 0; }
.v-raptorlab .rl-lg-bad { background: var(--bad); opacity: 0.55; }
.v-raptorlab .rl-lg-over { background: var(--warn); opacity: 0.5; }
.v-raptorlab .rl-lg-ideal { background: var(--good); opacity: 0.7; }
.v-raptorlab .rl-lg-under { background: var(--plume); opacity: 0.45; }
.v-raptorlab .rl-chartbox { position: relative; margin-top: var(--rl-gap); }
.v-raptorlab .rl-chart { width: 100%; touch-action: pan-y; }
.v-raptorlab .rl-chart svg { display: block; width: 100%; height: auto; }
.v-raptorlab .rl-axis { stroke: var(--line-2); stroke-width: 1; }
.v-raptorlab .rl-gridl { stroke: var(--grid); stroke-width: 1; }
.v-raptorlab .rl-gridl-2 { stroke: var(--line); stroke-width: 1; }
.v-raptorlab .rl-line-sl { stroke: var(--steel); stroke-width: 2; fill: none; }
.v-raptorlab .rl-line-v { stroke: var(--copper); stroke-width: 2; fill: none; }
.v-raptorlab .rl-line-dash { stroke-dasharray: 4 4; }
.v-raptorlab .rl-sepband { fill: url(#rl-alt-sep); }
.v-raptorlab .rl-cursor { stroke: var(--accent); stroke-width: 1; }
.v-raptorlab .rl-dot-sl { fill: var(--steel); stroke: var(--bg); stroke-width: 2; }
.v-raptorlab .rl-dot-v { fill: var(--copper); stroke: var(--bg); stroke-width: 2; }
.v-raptorlab .rl-ref { fill: var(--bg); stroke: var(--fg); stroke-width: 1.2; }
.v-raptorlab .rl-lab-sl { fill: var(--steel); font: 500 11px var(--font-mono); }
.v-raptorlab .rl-lab-v { fill: var(--copper); font: 500 11px var(--font-mono); }
.v-raptorlab .rl-lab-acc { fill: var(--accent); font: 600 11px var(--font-mono); }
.v-raptorlab .rl-chart .svg-label, .v-raptorlab .rl-chart .svg-label-muted, .v-raptorlab .rl-chart .rl-lab-sl, .v-raptorlab .rl-chart .rl-lab-v, .v-raptorlab .rl-chart .rl-lab-acc { paint-order: stroke; stroke: var(--bg-2); stroke-width: 3px; stroke-linejoin: round; }

/* ---------- C: physics */
.v-raptorlab .rl-ctrl { display: grid; gap: 12px; }
.v-raptorlab .rl-ctrl .range-row output { min-width: 7.5em; }
.v-raptorlab .rl-ctrl .range-row { grid-template-columns: 11.2em minmax(0, 1fr) 7.2em; }
@media (max-width: 480px) {
  .v-raptorlab .rl-ctrl .range-row { grid-template-columns: minmax(0, 1fr) auto; row-gap: 4px; }
  .v-raptorlab .rl-ctrl .range-row input { grid-column: 1 / -1; grid-row: 2; }
}
.v-raptorlab .rl-eq { font: 400 13.5px/1.9 var(--font-mono); color: var(--fg-2); background: var(--bg); border: 1px solid var(--line); border-radius: 4px; padding: 12px 14px; overflow-x: auto; }
.v-raptorlab .rl-eq .l { display: block; white-space: nowrap; }
.v-raptorlab .rl-eq var { font-style: italic; color: var(--fg); }
.v-raptorlab .rl-eq .n { color: var(--accent); font-variant-numeric: tabular-nums; }
.v-raptorlab .rl-eq .res { color: var(--fg); font-weight: 600; font-size: 15px; }
.v-raptorlab .rl-eq sub { font-size: 0.72em; }
.v-raptorlab .rl-eq .def { white-space: normal; color: var(--muted); font-size: 12px; line-height: 1.5; margin-top: 4px; }
@media (max-width: 520px) { .v-raptorlab .rl-eq { font-size: 12.5px; padding: 10px 12px; } .v-raptorlab .rl-eq .l { white-space: normal; } }
.v-raptorlab .rl-outs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
@media (max-width: 560px) { .v-raptorlab .rl-outs { grid-template-columns: repeat(2, minmax(0, 1fr)); } .v-raptorlab .rl-atm { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.v-raptorlab .rl-band-ship { fill: var(--good); opacity: 0.1; }
.v-raptorlab .rl-mk { stroke-width: 1; fill: none; }
.v-raptorlab .rl-mk-leo { stroke: var(--bad); stroke-dasharray: 6 4; }
.v-raptorlab .rl-mk-orb { stroke: var(--steel); stroke-dasharray: 2 3; }
.v-raptorlab .rl-mk-ship { stroke: var(--good); stroke-dasharray: 6 4; }
.v-raptorlab .rl-mk-t-leo { fill: var(--bad); font: 500 10.5px var(--font-mono); }
.v-raptorlab .rl-mk-t-orb { fill: var(--steel); font: 500 10.5px var(--font-mono); }
.v-raptorlab .rl-mk-t-ship { fill: var(--good); font: 500 10.5px var(--font-mono); }
.v-raptorlab .rl-dv-main { stroke: var(--accent); stroke-width: 2.25; fill: none; }
.v-raptorlab .rl-dv-alt { stroke: var(--steel-2); stroke-width: 1.25; fill: none; stroke-dasharray: 3 3; }
.v-raptorlab .rl-dv-dot { fill: var(--accent); stroke: var(--bg); stroke-width: 2; }
.v-raptorlab .rl-mklist { margin: 10px 0 0; padding: 0; list-style: none; display: grid; gap: 5px; font-size: 12.5px; color: var(--fg-2); }
.v-raptorlab .rl-mklist li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; align-items: baseline; }
.v-raptorlab .rl-mklist i { display: inline-block; width: 18px; border-top: 2px dashed var(--muted); transform: translateY(-3px); }
.v-raptorlab .rl-mklist .k-leo i { border-color: var(--bad); }
.v-raptorlab .rl-mklist .k-orb i { border-top-style: dotted; border-color: var(--steel); }
.v-raptorlab .rl-mklist .k-ship i { border-color: var(--good); }

/* ---------- C: why methane */
.v-raptorlab .rl-prop { margin-top: clamp(28px, 4vw, 44px); }
.v-raptorlab .rl-prop-scroll { overflow-x: auto; border: 1px solid var(--line); border-radius: var(--radius); background: var(--bg-2); }
.v-raptorlab .rl-ptbl { width: 100%; min-width: 620px; border-collapse: collapse; font-size: 13px; }
.v-raptorlab .rl-ptbl th, .v-raptorlab .rl-ptbl td { padding: 10px 12px; border-top: 1px solid var(--line); vertical-align: top; text-align: left; }
.v-raptorlab .rl-ptbl thead th { border-top: 0; font: 600 15px/1.2 var(--font-display); letter-spacing: 0.05em; text-transform: uppercase; color: var(--fg); background: var(--bg-3); }
.v-raptorlab .rl-ptbl thead th small { display: block; font: 400 10.5px/1.3 var(--font-mono); letter-spacing: 0.04em; text-transform: none; color: var(--muted); margin-top: 3px; }
.v-raptorlab .rl-ptbl thead th.is-ch4 { color: var(--ch4); box-shadow: inset 0 -2px 0 var(--ch4); }
.v-raptorlab .rl-ptbl tbody th { width: 21%; font: 500 10.5px/1.35 var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.v-raptorlab .rl-ptbl td { color: var(--fg-2); width: 26.3%; }
.v-raptorlab .rl-ptbl td.is-ch4 { background: rgba(255, 143, 58, 0.045); }
.v-raptorlab .rl-mini { height: 5px; background: var(--bg-4); border-radius: 2px; margin-top: 6px; position: relative; overflow: hidden; }
.v-raptorlab .rl-mini b { position: absolute; left: 0; top: 0; bottom: 0; background: var(--steel-2); border-radius: 2px; }
.v-raptorlab td.is-ch4 .rl-mini b { background: var(--ch4); }
.v-raptorlab .rl-ptbl .v { color: var(--fg); font-family: var(--font-mono); font-size: 13px; }
.v-raptorlab .rl-good { color: var(--good); }
.v-raptorlab .rl-bad { color: var(--bad); }
.v-raptorlab .rl-mid { color: var(--warn); }
@media (max-width: 640px) {
  .v-raptorlab .rl-prop-scroll { overflow: visible; }
  .v-raptorlab .rl-ptbl { min-width: 0; }
  .v-raptorlab .rl-ptbl thead { display: none; }
  .v-raptorlab .rl-ptbl, .v-raptorlab .rl-ptbl tbody { display: block; }
  .v-raptorlab .rl-ptbl tr { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--line); }
  .v-raptorlab .rl-ptbl tr:first-child { border-top: 0; }
  .v-raptorlab .rl-ptbl tbody th { grid-column: 1 / -1; width: auto; border-top: 0; padding: 10px 10px 2px; }
  .v-raptorlab .rl-ptbl td { width: auto; border-top: 0; padding: 4px 8px 12px 10px; font-size: 12px; line-height: 1.4; }
  .v-raptorlab .rl-ptbl td::before { content: attr(data-fuel); display: block; font: 600 12px/1.2 var(--font-display); letter-spacing: 0.06em; text-transform: uppercase; color: var(--fg-2); margin-bottom: 3px; }
  .v-raptorlab .rl-ptbl td.is-ch4::before { color: var(--ch4); }
  .v-raptorlab .rl-ptbl .v { font-size: 12px; }
}
`);

  /* ================================================================== 6. helpers */

  const el = SX.el, svg = SX.svg;
  const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
  const imperial = () => SX.units() === 'imperial';

  function hexRGB(hex) {
    const h = String(hex || '#ffffff').replace('#', '').trim();
    const x = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const n = parseInt(x, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgba = (rgb, a) => 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + SX.clamp(a, 0, 1).toFixed(3) + ')';

  function fmtPa(p) {
    if (p <= 0) return '0';
    if (imperial()) {
      const psi = p / 6894.757;
      if (psi >= 1) return psi.toFixed(2) + ' psi';
      if (psi >= 0.001) return psi.toFixed(4).replace(/0+$/, '') + ' psi';
      return psi.toPrecision(2) + ' psi';
    }
    if (p >= 10000) return (p / 1000).toFixed(1) + ' kPa';
    if (p >= 1000) return (p / 1000).toFixed(2) + ' kPa';
    if (p >= 100) return p.toFixed(0) + ' Pa';
    if (p >= 1) return p.toFixed(1) + ' Pa';
    return p.toPrecision(2) + ' Pa';
  }
  function fmtAlt(km) {
    if (km == null) return 'Vacuum';
    return SX.fmtValue(km, 'km', { digits: km < 10 ? 1 : 0 });
  }
  function fmtTf(tf, digits) { return SX.fmtValue(tf, 'tf', imperial() ? { to: 'lbf', digits: 0 } : { digits: digits == null ? 1 : digits }); }
  function fmtDv(ms) {
    if (imperial()) return SX.fmtValue(ms, 'm/s', { digits: 0 });
    return (ms / 1000).toFixed(2) + ' km/s';
  }
  function fmtT(t) { return SX.fmtValue(t, 't', { digits: t >= 100 ? 0 : 1 }); }

  /** Rounded polyline path through points [[x,y],...] */
  function roundPath(pts, rad) {
    const f = (p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1);
    let d = 'M' + f(pts[0]);
    for (let i = 1; i < pts.length - 1; i++) {
      const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      const d1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), d2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const r = Math.min(rad, d1 / 2, d2 / 2);
      const a = [p1[0] + (p0[0] - p1[0]) * r / d1, p1[1] + (p0[1] - p1[1]) * r / d1];
      const b = [p1[0] + (p2[0] - p1[0]) * r / d2, p1[1] + (p2[1] - p1[1]) * r / d2];
      d += ' L' + f(a) + ' Q' + f(p1) + ' ' + f(b);
    }
    return d + ' L' + f(pts[pts.length - 1]);
  }

  /** Make an SVG group a keyboard and pointer target for a part id. */
  function bindPart(node, id, tipFn) {
    node.classList.add('part');
    node.setAttribute('data-part', id);
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    const p = SX.part(id);
    node.setAttribute('aria-label', (p ? p.name : id) + ': open in inspector');
    node.addEventListener('click', (e) => { e.stopPropagation(); SX.select(id); });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); SX.select(id); }
    });
    node.addEventListener('pointerenter', (e) => {
      SX.hover(id);
      if (e.pointerType === 'touch') return;
      SX.tip.show(tipFn ? tipFn() : defaultTip(id), e.clientX, e.clientY);
    });
    node.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') SX.tip.show(tipFn ? tipFn() : defaultTip(id), e.clientX, e.clientY); });
    node.addEventListener('pointerleave', () => { SX.hover(null); SX.tip.hide(); });
    node.addEventListener('focus', () => SX.hover(id));
    node.addEventListener('blur', () => SX.hover(null));
    return node;
  }
  function defaultTip(id) {
    const p = SX.part(id);
    if (!p) return '<b>' + SX.esc(id) + '</b>';
    const s = String(p.summary || '').replace(/\{\{\s*([\w.]+)(?:\|[^}]*)?\s*\}\}/g, (m, k) => SX.fmt(k));
    const one = s.split(/(?<=\.)\s/)[0];
    return '<b>' + SX.esc(p.name) + '</b>' + SX.esc(one);
  }
  function pulse(node, svgMode) {
    if (!node) return;
    const cls = svgMode ? 'rl-svgpulse' : 'rl-pulse';
    node.classList.remove(cls);
    void node.getBoundingClientRect();
    node.classList.add(cls);
    setTimeout(() => node.classList.remove(cls), 1500);
  }
  function confTag(conf) {
    const c = SX.CONF && SX.CONF[conf];
    return '<span class="conf-tag conf-' + conf + '">' + (c ? c.label : conf) + '</span>';
  }
  function observeSize(node, fn) {
    let lastW = -1;
    const run = () => { const w = node.clientWidth; if (w && w !== lastW) { lastW = w; fn(w); } };
    if ('ResizeObserver' in window) new ResizeObserver(run).observe(node);
    else window.addEventListener('resize', run);
    return run;
  }

  /* Bell contour: quadratic Bezier from the throat (r=rt at z=zt) to the exit (r=Re at z=0), leaving the throat at
     angle ai and arriving at the exit at angle ae (degrees). Returns {ctl:[r,z], at(t)->[r,z], rAt(z)}. */
  function bell(rt, zt, Re, ai, ae) {
    const ti = Math.tan(ai * Math.PI / 180), te = Math.tan(ae * Math.PI / 180);
    let z1 = (Re - rt - ti * zt) / (te - ti);
    z1 = SX.clamp(z1, zt * 0.1, zt * 0.9);
    const r1 = Re - te * z1;
    const at = (t) => {
      const u = 1 - t;
      return [u * u * rt + 2 * u * t * r1 + t * t * Re, u * u * zt + 2 * u * t * z1];
    };
    const samples = [];
    for (let i = 0; i <= 60; i++) samples.push(at(i / 60));
    const rAt = (z) => {
      for (let i = 1; i < samples.length; i++) {
        const a = samples[i - 1], b = samples[i];
        if (z <= a[1] && z >= b[1]) { const k = (a[1] - z) / ((a[1] - b[1]) || 1); return a[0] + (b[0] - a[0]) * k; }
      }
      return z > zt ? rt : Re;
    };
    const zAt = (r) => {
      for (let i = 1; i < samples.length; i++) {
        const a = samples[i - 1], b = samples[i];
        if (r >= a[0] && r <= b[0]) { const k = (r - a[0]) / ((b[0] - a[0]) || 1); return a[1] + (b[1] - a[1]) * k; }
      }
      return r <= rt ? zt : 0;
    };
    return { ctl: [r1, z1], at, rAt, zAt, samples };
  }

  /* ================================================================== 7. panel A: evolution */

  const EVO = {
    r1: { key: 'r1', part: 'raptor3.evolution.r1', name: 'Raptor 1', hKey: 'lab.r1.height', zt: 1.53, rt: 0.111, dz: 0.52, years: '2019 to 2022 · suborbital prototypes',
      notes: ['Sensors, boxes and harnesses outside', 'Bolted flanges on every line', 'Main-chamber torch igniters'] },
    r2: { key: 'r2', part: 'raptor3.evolution.r2', name: 'Raptor 2', hKey: 'raptor.r2.height', zt: 1.5, rt: 0.118, dz: 0.52, years: 'Flights 1 to 11 · 2023 to 2025',
      notes: ['Valves merged into valve plates', 'Welds replace many flanges', 'Still shielded by the vehicle'] },
    r3: { key: 'r3', part: 'raptor3', name: 'Raptor 3', hKey: 'raptor.r3.height', zt: 1.42, rt: 0.117, dz: 0.46, years: 'Flights 12 to 14 · 2026',
      notes: ['Coolant supply, one of few outside lines', 'Flow paths inside the housings', 'Regen-cooled structure, no heat shield'] },
  };
  const VER_OF_PART = { 'raptor3.evolution.r1': 'r1', 'raptor3.evolution.r2': 'r2', raptor3: 'r3' };

  function buildEvolution(root, state) {
    const S = 100, BASE = 392, H = 438;
    const s = svg('svg', { class: 'rl-evo-svg', role: 'group', 'aria-label': 'Raptor 1, Raptor 2 and Raptor 3 side by side at the same scale' });
    const dimTexts = [];
    const groups = {};
    let scaleT = null;
    let compact = null;
    /* Wide layout leaves room for numbered callouts; narrow screens get tighter columns without them. */
    function render(c) {
      compact = c;
      const W = c ? 560 : 780;
      const CX = c ? { r1: 96, r2: 280, r3: 464 } : { r1: 130, r2: 390, r3: 650 };
      s.textContent = '';
      dimTexts.length = 0;
      s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      s.appendChild(svg('defs', null,
        svg('linearGradient', { id: 'rl-evo-metal', x1: '0', x2: '1', y1: '0', y2: '0' },
          svg('stop', { offset: '0', class: 'rl-metal-a' }), svg('stop', { offset: '0.34', class: 'rl-metal-b' }),
          svg('stop', { offset: '0.62', class: 'rl-metal-c' }), svg('stop', { offset: '1', class: 'rl-metal-d' })),
        svg('linearGradient', { id: 'rl-evo-dark', x1: '0', x2: '1', y1: '0', y2: '0' },
          svg('stop', { offset: '0', class: 'rl-dark-a' }), svg('stop', { offset: '0.36', class: 'rl-dark-b' }),
          svg('stop', { offset: '1', class: 'rl-dark-c' }))));
      // exit plane and scale bar
      s.appendChild(svg('line', { x1: 8, x2: W - 8, y1: BASE + 0.5, y2: BASE + 0.5, class: 'rl-ground' }));
      const scaleG = svg('g', { transform: 'translate(14,' + (BASE + 24) + ')' });
      scaleG.appendChild(svg('path', { d: 'M0 -4 V4 M0 0 H' + S + ' M' + S + ' -4 V4 M' + (S / 2) + ' -2 V2', class: 'rl-dim' }));
      scaleT = svg('text', { x: S + 8, y: 5, class: 'svg-label-muted' });
      scaleG.appendChild(scaleT);
      s.appendChild(scaleG);
      s.appendChild(svg('text', { x: W - 10, y: BASE + 29, class: 'svg-label-muted', 'text-anchor': 'end' }, c ? 'SAME SCALE' : 'NOZZLE EXITS ALIGNED · SAME SCALE'));
      ['r1', 'r2', 'r3'].forEach((k) => {
        const g = drawEvoEngine(EVO[k], CX[k], BASE, S, dimTexts, { balloons: !c });
        groups[k] = g;
        s.appendChild(g);
      });
      refreshText();
      if (state.ver) api.setVer(state.ver);
      if (SX.selected) s.querySelectorAll('.part[data-part]').forEach((n) => n.classList.toggle('is-selected', n.getAttribute('data-part') === SX.selected));
    }
    function refreshText() {
      if (scaleT) scaleT.textContent = imperial() ? SX.fmtValue(1, 'm', { to: 'ft', digits: 2 }) : SX.fmtValue(1, 'm');
      dimTexts.forEach((d) => { d.node.textContent = SX.fmt(d.key); });
    }

    const fig = el('figure', { class: 'viz viz-grid rl-fig', style: { margin: 0 } },
      el('div', { class: 'rl-figtitle' },
        el('span', { class: 'rl-kicker' }, 'Elevation · Raptor 1, 2, 3'),
        el('span', { class: 'rl-note' }, 'Click an engine')),
      s);
    const caps = el('div', { class: 'rl-evo-caps' });
    const vbtns = {};
    ['r1', 'r2', 'r3'].forEach((k) => {
      const v = EVO[k];
      const b = el('button', { type: 'button', class: 'rl-vbtn', 'aria-pressed': 'false', onclick: () => { state.setVer(k); SX.select(v.part); } },
        el('b', null, v.name), el('span', null, v.years));
      vbtns[k] = b;
      caps.appendChild(el('div', null, b, el('ol', { class: 'rl-vlist', 'aria-label': v.name + ' callouts' },
        v.notes.map((n, i) => el('li', null, el('i', null, String(i + 1)), el('span', null, n))))));
    });
    fig.appendChild(caps);
    fig.appendChild(el('p', { class: 'rl-note', style: { marginTop: '10px' } },
      'Heights and exit diameters from published figures; internal proportions from SpaceX photos (estimate). External lines are drawn to show relative complexity after SpaceX\'s August 2024 comparison photo, not as a part-by-part map.'));
    root.appendChild(fig);

    const api = {
      fig, groups, refreshText,
      setVer(k) {
        ['r1', 'r2', 'r3'].forEach((q) => {
          if (groups[q]) groups[q].classList.toggle('is-dim', q !== k);
          vbtns[q].setAttribute('aria-pressed', String(q === k));
        });
      },
    };
    render(false);
    observeSize(fig, (w) => { const c = w < 560; if (c !== compact) render(c); });
    return api;
  }

  function drawEvoEngine(v, cx, base, S, dimTexts, opts) {
    const k = v.key;
    const H = val(v.hKey);
    const X = (x) => cx + x * S, Y = (z) => base - z * S;
    const P = (x, z) => [X(x), Y(z)];
    const g = svg('g', { class: 'rl-evo-eng' });
    const Re = val(k === 'r1' ? 'raptor.r1.exitDiameter' : k === 'r2' ? 'raptor.r2.diameter' : 'raptor.r3.exitDiameter') / 2;
    const zt = v.zt, rto = v.rt + 0.04, rc = 0.25, zc = zt + 0.2, zinj = zt + v.dz, dh = 0.14, zdeck = zinj + dh;
    const B = bell(rto, zt, Re, 32, 6);
    const rOut = B.rAt;
    const [r1c, z1c] = B.ctl;
    const fillCls = k === 'r3' ? 'rl-fill-dark' : 'rl-fill-metal';

    // hit area behind everything so the whole column is clickable
    g.appendChild(svg('rect', { x: X(-1.05), y: Y(H + 0.12), width: 2.1 * S, height: (H + 0.12) * S, class: 'rl-hit' }));

    // shielding envelope (R1, R2)
    if (k !== 'r3') {
      const zb = zt - 0.42;
      g.appendChild(svg('rect', { x: X(-0.7), y: Y(H + 0.06), width: 1.4 * S, height: (H + 0.06 - zb) * S, rx: 10, class: 'rl-shroud' }));
      g.appendChild(svg('text', { x: X(-0.66), y: Y(H + 0.06) - 6, class: 'rl-shroud-t' }, 'SHIELDED BY THE VEHICLE'));
    } else {
      g.appendChild(svg('text', { x: X(-0.66), y: Y(3.1 + 0.06) - 6, class: 'rl-clean-t' }, 'NO HEAT SHIELD NEEDED'));
    }

    // nozzle + chamber silhouette
    const d = 'M' + X(-Re) + ' ' + Y(0) +
      ' Q' + X(-r1c) + ' ' + Y(z1c) + ' ' + X(-rto) + ' ' + Y(zt) +
      ' Q' + X(-rto) + ' ' + Y(zt + 0.1) + ' ' + X(-rc) + ' ' + Y(zc) +
      ' L' + X(-rc) + ' ' + Y(zinj) + ' L' + X(rc) + ' ' + Y(zinj) + ' L' + X(rc) + ' ' + Y(zc) +
      ' Q' + X(rto) + ' ' + Y(zt + 0.1) + ' ' + X(rto) + ' ' + Y(zt) +
      ' Q' + X(r1c) + ' ' + Y(z1c) + ' ' + X(Re) + ' ' + Y(0) + ' Z';
    g.appendChild(svg('path', { d, class: 'rl-body ' + fillCls }));
    g.appendChild(svg('ellipse', { cx: X(0), cy: Y(0), rx: Re * S, ry: 0.05 * S, class: 'rl-lip' }));
    // nozzle stiffener bands
    const bands = k === 'r1' ? [0.3, 0.62, 0.95] : k === 'r2' ? [0.42, 0.85] : [0.55];
    bands.forEach((z) => {
      const r = rOut(z);
      g.appendChild(svg('path', { d: 'M' + X(-r) + ' ' + Y(z) + ' Q' + X(0) + ' ' + (Y(z) + 0.05 * S) + ' ' + X(r) + ' ' + Y(z), class: 'rl-band' }));
    });
    // regen inlet manifold ring
    const zm = zt - 0.3;
    const rm = rOut(zm) + 0.045;
    g.appendChild(svg('rect', { x: X(-rm), y: Y(zm + 0.04), width: 2 * rm * S, height: 0.08 * S, rx: 0.04 * S, class: 'rl-ring' }));

    // fuel-rich preburner body hanging under the fuel pump (photo interpretation)
    const fpbX = 0.31;
    g.appendChild(svg('rect', { x: X(fpbX - 0.085), y: Y(zinj), width: 0.17 * S, height: (zinj - (zt + 0.02)) * S, rx: 0.06 * S, class: 'rl-body ' + fillCls }));
    for (let z = zt + 0.1; z < zinj - 0.04; z += 0.07) g.appendChild(svg('line', { x1: X(fpbX - 0.08), x2: X(fpbX + 0.08), y1: Y(z), y2: Y(z), class: 'rl-rib' }));

    // injector deck
    const dw = k === 'r3' ? 0.38 : 0.41;
    g.appendChild(svg('rect', { x: X(-dw), y: Y(zdeck), width: 2 * dw * S, height: dh * S, rx: 0.02 * S, class: 'rl-body ' + fillCls }));

    // powerhead: oxygen pump on the centerline, fuel pump to +x
    const otp = { x0: -0.2, x1: 0.2, z0: zdeck, z1: H - 0.22 };
    const ftp = { x0: 0.23, x1: 0.5, z0: zdeck + 0.02, z1: H - 0.36 };
    const rect = (b, cls, r) => svg('rect', { x: X(b.x0), y: Y(b.z1), width: (b.x1 - b.x0) * S, height: (b.z1 - b.z0) * S, rx: (r || 0.05) * S, class: cls });
    if (k === 'r3') {
      // one housing: draw both outlines, then both fills without stroke on top to merge them
      g.appendChild(rect(otp, 'rl-body ' + fillCls, 0.07));
      g.appendChild(rect(ftp, 'rl-body ' + fillCls, 0.07));
      const bridge = { x0: 0.1, x1: 0.33, z0: zdeck + 0.06, z1: H - 0.42 };
      g.appendChild(rect(bridge, 'rl-body ' + fillCls, 0.03));
      [otp, ftp, bridge].forEach((b) => { const r = rect(b, fillCls, 0.07); r.style.stroke = 'none'; r.setAttribute('x', X(b.x0) + 1); r.setAttribute('width', (b.x1 - b.x0) * S - 2); r.setAttribute('y', Y(b.z1) + 1); r.setAttribute('height', (b.z1 - b.z0) * S - 2); g.appendChild(r); });
    } else {
      g.appendChild(rect(otp, 'rl-body ' + fillCls));
      g.appendChild(rect(ftp, 'rl-body ' + fillCls));
      // oxygen pump discharge volute
      g.appendChild(svg('ellipse', { cx: X(0), cy: Y(H - 0.62), rx: 0.25 * S, ry: 0.09 * S, class: 'rl-body ' + fillCls }));
    }
    // fuel pump volute
    g.appendChild(svg('circle', { cx: X(0.365), cy: Y(H - 0.52), r: 0.155 * S, class: 'rl-body ' + fillCls }));
    g.appendChild(svg('circle', { cx: X(0.365), cy: Y(H - 0.52), r: 0.06 * S, class: 'rl-port' }));
    // LOX inlet (centerline) with its bolted flange (the low-pressure side keeps flanges)
    g.appendChild(svg('rect', { x: X(-0.14), y: Y(H), width: 0.28 * S, height: 0.22 * S, rx: 0.03 * S, class: 'rl-body ' + fillCls }));
    g.appendChild(svg('rect', { x: X(-0.2), y: Y(H - 0.17), width: 0.4 * S, height: 0.045 * S, class: 'rl-ring' }));
    // methane inlet over the fuel pump
    g.appendChild(svg('rect', { x: X(0.3), y: Y(H - 0.2), width: 0.13 * S, height: 0.17 * S, rx: 0.02 * S, class: 'rl-body ' + fillCls }));
    g.appendChild(svg('rect', { x: X(0.27), y: Y(H - 0.25), width: 0.19 * S, height: 0.035 * S, class: 'rl-ring' }));

    // ---------- plumbing
    const pipes = svg('g');
    const extras = svg('g');
    const pipe = (pts, w, opts) => {
      opts = opts || {};
      const px = pts.map((p) => P(p[0], p[1]));
      const dd = roundPath(px, (opts.rad || 0.1) * S);
      pipes.appendChild(svg('path', { d: dd, class: 'rl-pipe-o', 'stroke-width': w * S + 2.5 }));
      pipes.appendChild(svg('path', { d: dd, class: 'rl-pipe', 'stroke-width': w * S }));
      if (w * S > 3) pipes.appendChild(svg('path', { d: dd, class: 'rl-pipe-hi', 'stroke-width': Math.max(1, w * S * 0.3) }));
      (opts.flanges || []).forEach(([i, t]) => joint(px, i, t, w, 'rl-flange', 1.9, 0.035));
      (opts.welds || []).forEach(([i, t]) => joint(px, i, t, w, 'rl-weld', 1.2, 0.012));
      return px;
    };
    const joint = (px, i, t, w, cls, wide, thick) => {
      const a = px[i], b = px[i + 1];
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
      const h = w * S * wide / 2;
      extras.appendChild(svg('line', { x1: x - nx * h, y1: y - ny * h, x2: x + nx * h, y2: y + ny * h, class: cls, 'stroke-width': Math.max(1.2, thick * S) }));
    };
    const box = (x, z, w, h, cls) => extras.appendChild(svg('rect', { x: X(x - w / 2), y: Y(z + h / 2), width: w * S, height: h * S, rx: 1.5, class: cls || 'rl-valve' }));
    const valve = (x, z, dir) => {
      box(x, z, 0.1, 0.08, 'rl-valve');
      const ax = x + (dir || 1) * 0.085;
      extras.appendChild(svg('rect', { x: X(Math.min(x, ax) + (dir > 0 ? 0.05 : -0.035)), y: Y(z + 0.025), width: 0.07 * S, height: 0.05 * S, rx: 1, class: 'rl-box' }));
    };
    const sensor = (x, z) => extras.appendChild(svg('circle', { cx: X(x), cy: Y(z), r: 2.4, class: 'rl-sensor' }));
    const harness = (pts) => extras.appendChild(svg('path', { d: roundPath(pts.map((p) => P(p[0], p[1])), 0.08 * S), class: 'rl-harness' }));

    // the regen coolant supply line: fuel pump discharge, over the top, down the far side to the manifold (all versions)
    const cs = [[0.52, H - 0.52], [0.6, H - 0.52], [0.6, H - 0.06], [-0.5, H - 0.06], [-0.5, zm + 0.12], [-rm + 0.02, zm + 0.02]];
    let callPts = {};
    if (k === 'r3') {
      pipe(cs, 0.085, { rad: 0.14, flanges: [[0, 0.35]] });
      // a few small integrated ports on the housing
      [[-0.1, H - 0.48], [0.08, H - 0.6], [-0.12, zdeck + 0.12]].forEach(([x, z]) => extras.appendChild(svg('circle', { cx: X(x), cy: Y(z), r: 2.2, class: 'rl-port' })));
      callPts = { 1: P(0.64, H - 0.3), 2: P(0.5, zdeck + 0.18), 3: P(rm - 0.02, zm) };
    } else if (k === 'r2') {
      pipe(cs, 0.085, { rad: 0.14, flanges: [[0, 0.35], [4, 0.6]], welds: [[2, 0.4], [3, 0.5]] });
      pipe([[-0.2, H - 0.46], [-0.36, H - 0.46], [-0.36, zdeck + 0.02], [-0.3, zdeck + 0.02]], 0.055, { rad: 0.06, welds: [[1, 0.3], [1, 0.75]] });
      pipe([[0.5, H - 0.78], [0.58, H - 0.78], [0.58, zt + 0.02], [rOut(zm) + 0.1, zm + 0.08]], 0.05, { rad: 0.08, flanges: [[1, 0.55]], welds: [[1, 0.2]] });
      pipe([[-0.2, zdeck + 0.3], [-0.3, zdeck + 0.3], [-0.3, zc + 0.05], [-rc, zc + 0.05]], 0.034, { rad: 0.05, welds: [[1, 0.5]] });
      pipe([[0.23, zdeck + 0.2], [0.16, zdeck + 0.2], [0.16, zdeck + 0.02]], 0.035, { rad: 0.04 });
      box(-0.22, H - 0.64, 0.16, 0.12, 'rl-valve');
      box(0.14, zdeck + 0.33, 0.14, 0.1, 'rl-valve');
      box(-0.55, zdeck + 0.34, 0.1, 0.18, 'rl-box');
      harness([[-0.55, zdeck + 0.25], [-0.55, zinj - 0.1], [-0.3, zinj - 0.1]]);
      harness([[-0.5, zdeck + 0.43], [-0.44, H - 0.3], [-0.14, H - 0.3]]);
      [[-0.36, H - 0.7], [0.58, zc], [-0.3, zc + 0.25], [0.12, H - 0.32], [-0.22, zdeck + 0.1]].forEach(([x, z]) => sensor(x, z));
      callPts = { 1: P(0.21, zdeck + 0.33), 2: P(0.6, H - 0.78 + (zt + 0.02 - (H - 0.78)) * 0.2), 3: P(0.7, zt + 0.05) };
    } else {
      pipe(cs, 0.085, { rad: 0.12, flanges: [[0, 0.3], [2, 0.3], [3, 0.7], [4, 0.45]] });
      pipe([[-0.19, H - 0.4], [-0.42, H - 0.4], [-0.42, zdeck + 0.06], [-0.3, zdeck + 0.06]], 0.06, { rad: 0.06, flanges: [[1, 0.2], [1, 0.7], [2, 0.5]] });
      pipe([[0.5, H - 0.72], [0.62, H - 0.72], [0.62, zt + 0.06], [rOut(zm) + 0.1, zm + 0.1]], 0.055, { rad: 0.07, flanges: [[1, 0.25], [1, 0.62], [2, 0.5]] });
      pipe([[0.23, zdeck + 0.32], [-0.2, zdeck + 0.32]], 0.05, { flanges: [[0, 0.2], [0, 0.78]] });
      pipe([[-0.24, zdeck + 0.02], [-0.33, zinj - 0.04], [-0.33, zc + 0.02], [-rc, zc + 0.02]], 0.03, { rad: 0.04, flanges: [[1, 0.5]] });
      pipe([[0.18, zdeck + 0.02], [0.2, zinj - 0.05], [0.2, zc + 0.02], [rc, zc + 0.02]], 0.03, { rad: 0.04, flanges: [[1, 0.5]] });
      pipe([[0.08, H - 0.02], [0.08, H + 0.05], [0.72, H + 0.05], [0.72, zdeck + 0.5], [0.5, zdeck + 0.5]], 0.028, { rad: 0.05, flanges: [[2, 0.3], [3, 0.6]] });
      pipe([[-0.14, H - 0.12], [-0.62, H - 0.12], [-0.62, zc + 0.12], [-0.3, zc + 0.12]], 0.028, { rad: 0.05, flanges: [[1, 0.25], [1, 0.72]] });
      pipe([[-0.2, H - 0.3], [-0.3, H - 0.3], [-0.3, H - 0.58], [-0.2, H - 0.58]], 0.022, { rad: 0.03 });
      pipe([[0.5, zdeck + 0.12], [0.66, zdeck + 0.12], [0.66, zinj - 0.1], [0.4, zinj - 0.1]], 0.022, { rad: 0.03, flanges: [[1, 0.5]] });
      // chamber torch igniters (deleted on Raptor 2)
      box(-rc - 0.05, zc + 0.14, 0.09, 0.07, 'rl-valve');
      box(rc + 0.05, zc + 0.14, 0.09, 0.07, 'rl-valve');
      valve(-0.42, H - 0.7, -1); valve(0.62, zdeck + 0.22, 1); valve(-0.42, zdeck + 0.22, -1);
      valve(0.62, H - 0.94, 1); valve(0.05, zdeck + 0.32, 1); valve(-0.62, zc + 0.45, -1);
      box(-0.58, H - 0.9, 0.1, 0.16, 'rl-box');
      box(0.74, H - 0.35, 0.09, 0.14, 'rl-box');
      harness([[-0.58, H - 0.98], [-0.5, zdeck + 0.16], [-0.2, zdeck + 0.16]]);
      harness([[-0.58, H - 0.82], [-0.54, H - 0.24], [-0.12, H - 0.24]]);
      harness([[0.74, H - 0.43], [0.52, zdeck + 0.4], [0.28, zdeck + 0.4]]);
      harness([[0.74, H - 0.28], [0.7, H - 0.16], [0.3, H - 0.16]]);
      harness([[-0.53, zdeck + 0.05], [-0.4, zc + 0.3], [-0.26, zc + 0.3]]);
      [[-0.42, H - 0.55], [-0.42, zdeck + 0.35], [0.62, H - 0.55], [0.62, zt + 0.35], [0.62, zdeck + 0.02], [0.05, H - 0.34],
        [-0.12, H - 0.5], [0.3, zdeck + 0.45], [-0.3, zc + 0.35], [0.3, zc + 0.3], [-0.62, zc + 0.3], [0.72, zdeck + 0.7],
        [-0.05, zdeck + 0.1], [0.14, zc + 0.2], [-0.5, H - 0.25], [0.2, H - 0.12]].forEach(([x, z]) => sensor(x, z));
      callPts = { 1: P(0.785, H - 0.35), 2: P(0.64, H - 0.72 + (zt + 0.06 - (H - 0.72)) * 0.62), 3: P(rc + 0.095, zc + 0.14) };
    }
    g.appendChild(pipes);
    g.appendChild(extras);

    // height dimension on the left
    const dx = X(-0.9);
    g.appendChild(svg('path', { d: 'M' + dx + ' ' + Y(0) + ' V' + Y(H) + ' M' + (dx - 4) + ' ' + Y(0) + ' H' + (dx + 4) + ' M' + (dx - 4) + ' ' + Y(H) + ' H' + (dx + 4), class: 'rl-dim' }));
    const ht = svg('text', { x: dx - 6, y: (Y(0) + Y(H)) / 2, class: 'svg-label-muted', 'text-anchor': 'middle', transform: 'rotate(-90 ' + (dx - 6) + ' ' + ((Y(0) + Y(H)) / 2) + ')' });
    g.appendChild(ht);
    dimTexts.push({ node: ht, key: v.hKey });

    // numbered balloons (engineering callouts) on the right, level with their targets where possible
    const bx = X(1.02);
    if (opts && opts.balloons === false) callPts = {};
    let prevY = -1e9;
    const bys = {};
    [1, 2, 3].forEach((n) => { if (callPts[n]) { const y = Math.max(callPts[n][1] + 12, prevY + 26); bys[n] = y; prevY = y; } });
    [1, 2, 3].forEach((n) => {
      const tgt = callPts[n];
      if (!tgt) return;
      const by = bys[n];
      g.appendChild(svg('path', { d: 'M' + (bx - 9) + ' ' + by + ' L' + (bx - 16) + ' ' + by + ' L' + tgt[0] + ' ' + tgt[1], class: 'rl-lead' }));
      g.appendChild(svg('circle', { cx: tgt[0], cy: tgt[1], r: 2.2, class: 'rl-lead-dot' }));
      g.appendChild(svg('g', { class: 'rl-balloon' }, svg('circle', { cx: bx, cy: by, r: 9 }), svg('text', { x: bx, y: by + 0.5 }, String(n))));
    });

    bindPart(g, v.part, () => {
      const t = k === 'r3'
        ? SX.fmt('raptor.r3.thrustSL') + ' flight rating, ' + SX.fmt('raptor.r3.mass')
        : SX.fmt('raptor.' + k + '.thrustSL') + ', ' + SX.fmt('raptor.' + k + '.mass');
      return '<b>' + v.name + '</b>' + SX.esc(t) + '. Click to open.';
    });
    return g;
  }

  /* ---------- comparison chart (HTML bars, each metric on its own zero-based scale) */
  function buildEvoChart(root, state) {
    const wrap = el('div', { class: 'rl-card' });
    wrap.appendChild(el('div', { class: 'rl-figtitle' }, el('span', { class: 'rl-kicker' }, 'Sea-level engines compared'), el('span', { class: 'rl-note' }, 'Bars start at zero')));
    const rows = [];
    const V = ['r1', 'r2', 'r3'];
    const LAB = { r1: 'R1', r2: 'R2', r3: 'R3' };
    const metric = (name, note, max, items, extraLegend) => {
      const m = el('div', { class: 'rl-metric' }, el('div', { class: 'rl-metric-h' }, el('span', { class: 'rl-metric-name' }, name), el('span', { class: 'rl-metric-note' }, note)));
      items.forEach((it) => {
        const track = el('div', { class: 'rl-track' });
        (it.segs || []).forEach((sg) => track.appendChild(el('div', { class: 'rl-fillbar' + (sg.hatch ? ' rl-hatch' : ''), style: { left: (100 * sg.from / max) + '%', width: (100 * (sg.to - sg.from) / max) + '%' } })));
        if (it.ghost) track.appendChild(el('div', { class: 'rl-ghost', style: { left: (100 * it.ghost[0] / max) + '%', width: (100 * (it.ghost[1] - it.ghost[0]) / max) + '%' } }));
        if (it.tick != null) track.appendChild(el('i', { class: 'rl-tick', style: { left: (100 * it.tick / max) + '%' } }));
        const row = el('div', { class: 'rl-bar', 'data-ver': it.v, title: EVO[it.v].name, onclick: () => { state.setVer(it.v); SX.select(EVO[it.v].part); } },
          el('span', { class: 'rl-bar-lab' }, LAB[it.v]), track, el('span', { class: 'rl-bar-val', html: it.html }));
        rows.push(row);
        m.appendChild(row);
      });
      if (extraLegend) m.appendChild(extraLegend);
      wrap.appendChild(m);
    };
    const fh = (k, o) => SX.factHTML(k, o);
    const F = (k) => val(k);
    // thrust
    const thrMax = F('raptor.r3.thrustSLDemonstrated');
    metric('Sea-level thrust', 'R3: flight rating, dashed to demonstrated', thrMax, V.map((v) => ({
      v, segs: [{ from: 0, to: F('raptor.' + v + '.thrustSL') }],
      ghost: v === 'r3' ? [F('raptor.r3.thrustSL'), thrMax] : null,
      html: fh('raptor.' + v + '.thrustSL'),
    })));
    // specific impulse
    const ispKey = { r1: 'raptor.r1.ispListed', r2: 'raptor.r2.ispListed', r3: 'raptor.r3.ispVac' };
    const ispMax = Math.max(F('raptor.r1.ispListed'), F('raptor.r2.ispListed'), F('raptor.r3.ispVac'));
    metric('Specific impulse', 'Bar: as SpaceX lists it · tick: at sea level', ispMax, V.map((v) => ({
      v, segs: [{ from: 0, to: F(ispKey[v]) }], tick: F('raptor.' + v + '.ispSL'),
      html: fh(ispKey[v]) + ' <small>/ ' + fh('raptor.' + v + '.ispSL') + '</small>',
    })));
    // mass, stacked: engine + vehicle-side hardware
    const vs = { r1: 'lab.r1.vehicleSide', r2: 'lab.r2.vehicleSide', r3: 'raptor.r3.vehicleSideMass' };
    const massMax = F('raptor.r1.massWithCommodities');
    metric('Mass', 'Solid: engine · hatched: vehicle-side hardware', massMax, V.map((v) => ({
      v, segs: [{ from: 0, to: F('raptor.' + v + '.mass') }, { from: F('raptor.' + v + '.mass'), to: F('raptor.' + v + '.massWithCommodities'), hatch: true }],
      html: fh('raptor.' + v + '.mass') + ' <small>/ ' + fh('raptor.' + v + '.massWithCommodities') + '</small>',
    })));
    // thrust-to-weight
    const twMax = F('lab.r3.twrDemo');
    const hw = { r1: 'lab.r1.twrHw', r2: 'lab.r2.twrHw', r3: 'lab.r3.twrHw' };
    metric('Thrust-to-weight', 'Bar: engine only · tick: with vehicle-side hardware', twMax, V.map((v) => ({
      v, segs: [{ from: 0, to: F('raptor.' + v + '.twr') }], tick: F(hw[v]),
      ghost: v === 'r3' ? [F('raptor.r3.twr'), twMax] : null,
      html: fh('raptor.' + v + '.twr', { unitless: true }) + ' <small>/ ' + fh(hw[v], { unitless: true }) + '</small>',
    })));
    // chamber pressure
    const pcMax = F('raptor.r3.chamberPressure');
    metric('Chamber pressure', 'R3 bar: reached in a 2023 test · tick: flight estimate', pcMax, V.map((v) => ({
      v, segs: [{ from: 0, to: F('raptor.' + v + '.chamberPressure') }],
      tick: v === 'r3' ? F('lab.pcFlightEst') : null,
      html: fh('raptor.' + v + '.chamberPressure') + (v === 'r3' ? ' <small>test</small>' : ''),
    })));
    wrap.appendChild(el('div', { class: 'rl-legend' },
      el('span', { class: 'lg-bar' }, 'value'), el('span', { class: 'lg-hatch' }, 'vehicle-side'),
      el('span', { class: 'lg-ghost' }, 'demonstrated, not flown'), el('span', { class: 'lg-tick' }, 'second value')));
    wrap.appendChild(el('p', { class: 'rl-note', style: { marginTop: '10px' } }, 'The first figure in each row is the bar, the second is the tick or hatched part. Click a figure for its source. SpaceX\'s Isp values carry no condition; they fit the vacuum Isp of the sea-level engine.'));
    root.appendChild(wrap);
    return {
      el: wrap,
      setVer(k) { rows.forEach((r) => r.classList.toggle('is-on', r.dataset.ver === k)); },
    };
  }

  const CHANGES = [
    { t: 'No heat shield or engine shrouds', c: 'official', p: 'The external pipes, wiring and sensors on Raptor 1 and 2 could not survive the heat of neighboring plumes and reentry, so the vehicle wrapped each engine in shielding. Raptor 3 integrates its sensors and controllers inside the engine under its own thermal protection. SpaceX deleted the individual engine shrouds on both stages and the booster\'s CO₂ fire-suppression system.' },
    { t: 'Secondary flow paths moved inside', c: 'official', p: 'Musk said the job was to internalize the secondary flow paths and add regenerative cooling for exposed components. The small streams for cooling, purges, valve actuation and instrumentation now run through passages in the engine\'s housings instead of external tubes, which reporting credits to metal 3D printing.' },
    { t: 'Fewer flanges and bolted joints', c: 'reported', p: 'Many bolted joints became welds or single parts, removing seals and leak paths at the cost of serviceability. NASASpaceflight describes a flanged low-pressure side on top and a flangeless high-pressure side below. After Flights 7 and 8, SpaceX said Raptor 3 would eliminate most of the joints that could leak into the ship\'s aft section.' },
    { t: 'Higher pressure, more thrust', c: 'official', p: 'A development engine reached {{raptor.r3.chamberPressure}} at {{lab.pcTestThrust}} in May 2023, and Raptor 3 SN1 was listed at {{raptor.r3.thrustSLDemonstrated}} in August 2024. The flight rating on Starship V3 is {{raptor.r3.thrustSL}}; SpaceX has not published the chamber pressure at that rating (about {{lab.pcFlightEst}} by scaling).' },
    { t: 'About a tonne lighter per engine, installed', c: 'official', p: 'The bare engine went from {{raptor.r2.mass}} to {{raptor.r3.mass}}. The bigger saving is on the vehicle side: engine plus the hardware and commodities the vehicle carries for it fell from {{raptor.r2.massWithCommodities}} to {{raptor.r3.massWithCommodities}}, which SpaceX rounds to {{raptor.r3.massSavingPerEngine}} per engine.' },
    { t: 'New ignition and startup', c: 'reported', p: 'SpaceX confirms a redesigned ignition system and a new startup method. NASASpaceflight reports acoustic igniters with no spark or moving parts, and turbopump spin-up with gaseous oxygen and methane from onboard pressure vessels instead of helium or nitrogen.' },
    { t: 'Every booster engine can relight', c: 'official', p: 'On V3 all {{booster.enginesRelight}} on the booster can restart; Flight 13 flew the high-thrust part of its boostback burn on all of them. On first-generation boosters the fixed outer ring was started from the ground and could not relight.' },
  ];

  function buildChanges(root) {
    root.appendChild(el('div', { class: 'rl-figtitle', style: { marginTop: 'var(--rl-gap)' } },
      el('span', { class: 'rl-kicker' }, 'What changed from Raptor 2 to Raptor 3, and why'),
      el('span', { class: 'rl-note' }, 'Sources: SpaceX, Musk, NASASpaceflight')));
    const ol = el('ol', { class: 'rl-changes', style: { marginTop: '6px' } });
    CHANGES.forEach((c) => ol.appendChild(el('li', null,
      el('h5', { html: SX.esc(c.t) + ' ' + confTag(c.c) }),
      el('p', { html: SX.withFacts(c.p) }))));
    root.appendChild(ol);
  }

  /* ================================================================== 8. panel B: nozzles and plumes */

  const NW = 600, NH = 660, NS = 62, NTOP = 76;
  const MOUNT_TO_THROAT = val('raptor.r3.height') - 1.45; // throat sits about half-way up the sea-level engine (photo estimate)

  function engineGeom(kind) {
    const isV = kind === 'v';
    const Hm = val(isV ? 'raptor.rvac3.height' : 'raptor.r3.height');
    const Re = val(isV ? 'raptor.rvac3.exitDiameter' : 'raptor.r3.exitDiameter') / 2;
    const Rt = MODEL.Rt;
    const zt = Hm - MOUNT_TO_THROAT; // throat height above the exit plane
    const inner = bell(Rt, zt, Re, isV ? 30 : 32, isV ? 5 : 6);
    const wall = isV ? 0.022 : 0.04;
    const outer = bell(Rt + wall + 0.02, zt, Re + wall * 0.6, isV ? 30 : 32, isV ? 5 : 6);
    const cx = isV ? 425 : 165;
    return {
      kind, isV, Hm, Re, Rt, zt, inner, outer, cx, yTop: NTOP, yExit: NTOP + Hm * NS,
      pe: isV ? MODEL.peV : MODEL.peSL, Me: isV ? MODEL.MeV : MODEL.MeSL, eps: isV ? MODEL.epsV : MODEL.epsSL,
      Fv: isV ? val('raptor.rvac3.thrust') : val('raptor.r3.thrustVacOfSLEngine'),
      Ae: isV ? MODEL.AeV : MODEL.AeSL,
      Isp: isV ? val('raptor.rvac3.isp') : val('raptor.r3.ispVac'),
      lip: (isV ? 5 : 6) * Math.PI / 180,
      part: isV ? 'raptor3.rvac' : 'raptor3.nozzle',
    };
  }

  /** Thrust (tf) and effective Isp at ambient pressure pa (Pa). Simplified: ideal nozzle, fixed chamber conditions. */
  function perf(e, pa) {
    const F = e.Fv - pa * e.Ae / TF;
    return { F, isp: e.Isp * F / e.Fv, ratio: pa > 0 ? e.pe / pa : Infinity, sep: pa > 0 && e.pe / pa < MODEL.sepK };
  }
  function regime(r) {
    if (r < MODEL.sepK) return { k: 'bad', t: 'Flow separated' };
    if (r < 0.9) return { k: 'over', t: 'Over-expanded' };
    if (r <= 1.1) return { k: 'ideal', t: 'Near ideal' };
    if (r <= 30) return { k: 'under', t: 'Under-expanded' };
    return { k: 'under', t: 'Strongly under-expanded' };
  }

  /** Plume geometry at ambient pressure pa for engine e. Lengths in meters. */
  function plumeState(e, pa) {
    const g = NOZ.g;
    const pc = MODEL.pc;
    const r = pa > 0 ? e.pe / pa : Infinity;
    const st = { ratio: r, sep: false, zStart: 0, R0: e.Re, M0: e.Me };
    if (pa > 0 && r < MODEL.sepK) {
      // the wall pressure falls to sepK x ambient somewhere inside the bell: the jet leaves the wall there
      const Msep = NOZ.machFromP(MODEL.sepK * pa / pc);
      const epsSep = NOZ.areaRatio(Msep);
      const Rsep = e.Rt * Math.sqrt(epsSep);
      st.sep = true;
      st.R0 = Math.min(Rsep, e.Re);
      st.zStart = e.inner.zAt(st.R0);
      st.M0 = Msep;
    }
    let Mj = Infinity, Rj = Infinity;
    if (pa > 0) { Mj = NOZ.machFromP(pa / pc); Rj = e.Rt * Math.sqrt(NOZ.areaRatio(Mj)); }
    // after free-shock separation the jet has been recompressed to about ambient: it narrows only a little
    if (st.sep) Rj = st.R0 * 0.86;
    st.Mj = Mj; st.Rj = Rj;
    // Prandtl-Meyer turn at the lip: outward when under-expanded, inward when over-expanded
    const turn = NOZ.nu(Mj) - NOZ.nu(st.M0);
    const wallAng = st.sep ? Math.atan(Math.max(0, (e.inner.rAt(st.zStart - 0.01) - st.R0) / 0.01)) : e.lip;
    st.theta = SX.clamp(turn + wallAng, -0.6, 1.4);
    // shock-cell spacing (schematic: grows with jet diameter and Mach number)
    st.L = isFinite(Rj) ? 0.42 * 2 * Rj * Math.sqrt(Math.max(0.2, Mj * Mj - 1)) : Infinity;
    const dens = pa > 0 ? SX.clamp((Math.log10(pa) - 0.5) / 4.5, 0, 1) : 0;
    st.dens = dens;
    const mis = isFinite(r) ? Math.abs(Math.log(r)) : 6;
    st.diamond = SX.clamp(0.25 + mis * 0.55, 0, 1) * Math.pow(dens, 0.8) * (st.sep ? 1.25 : 1);
    st.balloon = isFinite(Rj) ? SX.smooth(SX.clamp((Rj / e.Re - 3) / 7, 0, 1)) : 1;
    return st;
  }

  /** Boundary radius (m) at distance u (m) downstream of the plume start. */
  function plumeR(e, st, u) {
    const spread = u * Math.tan((1.5 + 3 * st.dens) * Math.PI / 180);
    const cone = st.R0 + u * Math.tan(SX.clamp(st.theta, 0.02, 1.0)) / (1 + u / (6 * e.Re)) + spread;
    if (st.balloon >= 1) return cone;
    const k = 2 * Math.PI / st.L;
    const dmp = Math.exp(-u / (1.3 * st.L));
    let osc = st.Rj + (st.R0 - st.Rj) * Math.cos(k * u) * dmp;
    if (st.Rj > st.R0) osc += (st.Rj - st.R0) * 0.35 * Math.sin(k * u) * dmp;
    osc += spread;
    return SX.lerp(osc, Math.max(osc, cone), st.balloon);
  }

  function buildNozzles(root, state) {
    const engines = [engineGeom('sl'), engineGeom('v')];
    const stage = el('div', { class: 'rl-noz-stage', style: { aspectRatio: NW + ' / ' + NH } });
    const cv = el('canvas', { 'aria-hidden': 'true' });
    const s = svg('svg', { viewBox: '0 0 ' + NW + ' ' + NH, class: 'rl-noz-svg', role: 'group', 'aria-label': 'Sea-level Raptor 3 and Raptor Vacuum 3 nozzles in section, drawn to the same scale, with their exhaust plumes' });
    stage.appendChild(cv);
    stage.appendChild(s);
    s.appendChild(svg('defs', null,
      svg('pattern', { id: 'rl-noz-hatch', width: 5, height: 5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
        svg('line', { x1: 0, y1: 0, x2: 0, y2: 5, class: 'rl-hatch-line' })),
      svg('pattern', { id: 'rl-noz-sep', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-45)' },
        svg('line', { x1: 0, y1: 0, x2: 0, y2: 6, class: 'rl-sep-line' })),
      svg('marker', { id: 'rl-ah-a', viewBox: '0 0 8 8', refX: 7, refY: 4, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, svg('path', { d: 'M0 0 L8 4 L0 8 Z', class: 'rl-arrowhead-a' })),
      svg('marker', { id: 'rl-ah-e', viewBox: '0 0 8 8', refX: 7, refY: 4, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, svg('path', { d: 'M0 0 L8 4 L0 8 Z', class: 'rl-arrowhead-e' }))));

    // plume hit areas (under the engines)
    engines.forEach((e) => {
      const hit = svg('rect', { x: e.cx - (e.isV ? 118 : 92), y: e.yExit + 6, width: e.isV ? 236 : 184, height: NH - e.yExit - 40, class: 'rl-hit rl-plume-hit' });
      bindPart(hit, 'raptor3.plume', () => '<b>' + (e.isV ? 'RVac plume' : 'Sea-level plume') + '</b>' + SX.esc(state.plumeTip(e)));
      s.appendChild(hit);
    });
    // mount plane and centerlines
    s.appendChild(svg('line', { x1: 30, x2: NW - 30, y1: NTOP, y2: NTOP, class: 'rl-mount' }));
    s.appendChild(svg('text', { x: NW - 30, y: NTOP - 6, class: 'svg-label-muted rl-hide-sm', 'text-anchor': 'end' }, 'TOPS ALIGNED'));
    engines.forEach((e) => s.appendChild(svg('line', { x1: e.cx, x2: e.cx, y1: NTOP - 14, y2: NH - 34, class: 'rl-cl' })));

    const sepG = svg('g');
    const arrowsG = svg('g');
    const dimTexts = [];
    const regimeT = {};
    engines.forEach((e) => {
      const X = (x) => e.cx + x * NS, Y = (z) => e.yExit - z * NS;
      const grp = svg('g');
      // powerhead (elevation, simplified Raptor 3 silhouette), same for both engines
      const zt = e.zt, zinj = zt + 0.46, zdeck = zinj + 0.14, Hm = e.Hm;
      const body = 'rl-body rl-body-flat';
      grp.appendChild(svg('rect', { x: X(-0.25), y: Y(zinj), width: 0.5 * NS, height: (zinj - zt - 0.12) * NS, rx: 3, class: body }));
      grp.appendChild(svg('path', { d: 'M' + X(-0.25) + ' ' + Y(zt + 0.12) + ' Q' + X(-e.Rt - 0.06) + ' ' + Y(zt + 0.06) + ' ' + X(-e.Rt - 0.06) + ' ' + Y(zt) + ' L' + X(e.Rt + 0.06) + ' ' + Y(zt) + ' Q' + X(e.Rt + 0.06) + ' ' + Y(zt + 0.06) + ' ' + X(0.25) + ' ' + Y(zt + 0.12) + ' Z', class: body }));
      grp.appendChild(svg('rect', { x: X(-0.38), y: Y(zdeck), width: 0.76 * NS, height: 0.14 * NS, rx: 2, class: body }));
      grp.appendChild(svg('rect', { x: X(-0.2), y: Y(Hm - 0.22), width: 0.4 * NS, height: (Hm - 0.22 - zdeck) * NS, rx: 4, class: body }));
      grp.appendChild(svg('rect', { x: X(0.23), y: Y(Hm - 0.36), width: 0.27 * NS, height: (Hm - 0.36 - zdeck - 0.02) * NS, rx: 4, class: body }));
      grp.appendChild(svg('rect', { x: X(-0.14), y: Y(Hm), width: 0.28 * NS, height: 0.22 * NS, rx: 2, class: body }));
      grp.appendChild(svg('circle', { cx: X(0.365), cy: Y(Hm - 0.52), r: 0.155 * NS, class: body }));
      grp.appendChild(svg('path', { d: roundPath([[X(0.52), Y(Hm - 0.52)], [X(0.6), Y(Hm - 0.52)], [X(0.6), Y(Hm - 0.06)], [X(-0.5), Y(Hm - 0.06)], [X(-0.5), Y(zt - 0.2)], [X(-e.outer.rAt(zt - 0.3) - 0.02), Y(zt - 0.28)]], 6), class: 'rl-pipe', 'stroke-width': 0.085 * NS }));
      // nozzle in section: two hatched walls between inner and outer contours
      const wallPath = (sgn) => {
        const pts = [];
        for (let i = 0; i <= 40; i++) { const [r, z] = e.inner.at(i / 40); pts.push([X(sgn * r), Y(z)]); }
        for (let i = 40; i >= 0; i--) { const [r, z] = e.outer.at(i / 40); pts.push([X(sgn * r), Y(z)]); }
        return 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
      };
      grp.appendChild(svg('path', { d: wallPath(-1), class: 'rl-sec' }));
      grp.appendChild(svg('path', { d: wallPath(1), class: 'rl-sec' }));
      // regen manifold ring stub on both walls
      const zm = zt - 0.3, rm = e.outer.rAt(zm);
      [-1, 1].forEach((sg) => grp.appendChild(svg('rect', { x: sg < 0 ? X(-rm - 0.06) : X(rm - 0.01), y: Y(zm + 0.04), width: 0.07 * NS, height: 0.08 * NS, rx: 2, class: 'rl-ring' })));
      // throat marker
      grp.appendChild(svg('path', { d: 'M' + X(-e.Rt) + ' ' + Y(zt) + ' H' + X(e.Rt), class: 'rl-dim', style: { strokeDasharray: '2 2' } }));
      bindPart(grp, e.part, () => {
        const pf = perf(e, state.pa());
        return '<b>' + (e.isV ? 'Raptor Vacuum 3' : 'Sea-level nozzle') + '</b>' + SX.esc('Exit ' + SX.fmt(e.isV ? 'raptor.rvac3.exitDiameter' : 'raptor.r3.exitDiameter') + ' across. Here: ' + fmtTf(pf.F) + ', Isp ' + f1(pf.isp) + ' s.');
      });
      s.appendChild(grp);
      e.grp = grp;

      // name (top) and regime (bottom)
      s.appendChild(svg('text', { x: e.cx, y: 30, 'text-anchor': 'middle', class: 'svg-label ' + (e.isV ? 'rl-t-v' : 'rl-t-sl') }, e.isV ? 'RAPTOR VACUUM 3' : 'SEA-LEVEL RAPTOR 3'));
      s.appendChild(svg('text', { x: e.cx, y: 46, 'text-anchor': 'middle', class: 'svg-label-muted rl-hide-sm' }, 'SECTION THROUGH NOZZLE'));
      const rt = svg('text', { x: e.cx, y: NH - 12, 'text-anchor': 'middle', class: 'rl-regime rl-halo' });
      s.appendChild(rt);
      regimeT[e.kind] = rt;

      // exit diameter dimension (just below the exit plane)
      const yd = e.yExit + 16;
      s.appendChild(svg('path', { d: 'M' + X(-e.Re) + ' ' + (e.yExit + 4) + ' V' + (yd + 4) + ' M' + X(e.Re) + ' ' + (e.yExit + 4) + ' V' + (yd + 4) + ' M' + X(-e.Re) + ' ' + yd + ' H' + X(e.Re), class: 'rl-dim' }));
      const dt = svg('text', { x: e.isV ? X(e.Re) + 8 : X(-e.Re) - 8, y: yd + 4, 'text-anchor': e.isV ? 'start' : 'end', class: 'svg-label' });
      s.appendChild(dt);
      dimTexts.push({ node: dt, key: e.isV ? 'raptor.rvac3.exitDiameter' : 'raptor.r3.exitDiameter', pre: 'Ø ' });
      // height dimension on the outside
      const hx = e.isV ? X(e.Re) + 22 : X(-e.Re) - 22;
      s.appendChild(svg('path', { d: 'M' + hx + ' ' + NTOP + ' V' + e.yExit + ' M' + (hx - 4) + ' ' + NTOP + ' H' + (hx + 4) + ' M' + (hx - 4) + ' ' + e.yExit + ' H' + (hx + 4), class: 'rl-dim' }));
      const htx = e.isV ? hx + 12 : hx - 12;
      const ht = svg('text', { x: htx, y: (NTOP + e.yExit) / 2, class: 'svg-label-muted', 'text-anchor': 'middle', transform: 'rotate(-90 ' + htx + ' ' + ((NTOP + e.yExit) / 2) + ')' });
      s.appendChild(ht);
      dimTexts.push({ node: ht, key: e.isV ? 'raptor.rvac3.height' : 'raptor.r3.height' });
    });
    s.appendChild(sepG);
    s.appendChild(arrowsG);

    function refreshText() {
      dimTexts.forEach((d) => { d.node.textContent = (d.pre || '') + SX.fmt(d.key); });
    }
    refreshText();

    /* ---- per-altitude SVG overlays: separation zone, pressure arrows, regime labels */
    function updateOverlays(pa) {
      sepG.textContent = '';
      arrowsG.textContent = '';
      engines.forEach((e) => {
        const X = (x) => e.cx + x * NS, Y = (z) => e.yExit - z * NS;
        const st = plumeState(e, pa);
        const reg = regime(st.ratio);
        const rt = regimeT[e.kind];
        rt.textContent = reg.t.toUpperCase();
        rt.setAttribute('class', 'rl-regime rl-halo rl-reg-' + reg.k);
        if (st.sep) {
          // separated zone between the wall and the detached jet, from the separation line to the exit
          [-1, 1].forEach((sg) => {
            const pts = [];
            for (let z = st.zStart; z >= 0; z -= 0.05) pts.push([X(sg * e.inner.rAt(z)), Y(z)]);
            pts.push([X(sg * e.Re), Y(0)]);
            const jet = [];
            for (let z = 0; z <= st.zStart + 1e-6; z += 0.05) { const u = st.zStart - z; jet.push([X(sg * plumeR(e, st, u)), Y(z)]); }
            const all = pts.concat(jet);
            sepG.appendChild(svg('path', { d: 'M' + all.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z', class: 'rl-sepzone' }));
          });
          const ys = Y(st.zStart);
          const xs = X(-e.inner.rAt(st.zStart));
          sepG.appendChild(svg('path', { d: 'M' + (xs - 2) + ' ' + ys + ' L' + (xs - 22) + ' ' + (ys - 22) + ' H' + (xs - 30), class: 'svg-leader rl-hide-sm' }));
          sepG.appendChild(svg('circle', { cx: xs, cy: ys, r: 2.4, style: { fill: 'var(--bad)' } }));
          sepG.appendChild(svg('text', { x: xs - 34, y: ys - 26, class: 'svg-label rl-hide-sm', 'text-anchor': 'end', style: { fill: 'var(--bad)' } },
            svg('tspan', { x: xs - 34 }, 'FLOW'), svg('tspan', { x: xs - 34, dy: 13 }, 'SEPARATES')));
        }
        // pressure arrows meeting at the lip: ambient pushing in from outside, exit pressure pushing out from inside
        // (square-root length scale, so a 1:4 pressure ratio reads as 1:2)
        const len = (p) => 5 + 26 * Math.sqrt(SX.clamp(p / 101325, 0, 1.3));
        const yA = e.yExit - 7;
        const side = e.isV ? 1 : -1;
        [-1, 1].forEach((sg) => {
          const lip = X(sg * e.Re) + sg * 3;
          if (pa > 0) {
            const la = len(pa);
            arrowsG.appendChild(svg('line', { x1: lip + sg * (la + 3), y1: yA, x2: lip + sg * 2, y2: yA, class: 'rl-arrow-a', 'marker-end': 'url(#rl-ah-a)' }));
          }
          const le = len(e.pe);
          const inner = X(sg * e.inner.rAt(0.12)) - sg * 3;
          arrowsG.appendChild(svg('line', { x1: inner - sg * le, y1: yA, x2: inner - sg * 1, y2: yA, class: 'rl-arrow-e', 'marker-end': 'url(#rl-ah-e)' }));
          if (sg === side) {
            const sub = (main, s2, x, y, anchor, fill) => {
              const t = svg('text', { x, y, class: 'svg-label rl-hide-sm', 'text-anchor': anchor, style: fill ? { fill } : null });
              t.appendChild(svg('tspan', null, main));
              t.appendChild(svg('tspan', { 'baseline-shift': 'sub', 'font-size': '8' }, s2));
              arrowsG.appendChild(t);
            };
            if (pa > 0) sub('p', 'a', lip + sg * (len(pa) + 7), yA + 4, sg > 0 ? 'start' : 'end');
            sub('p', 'e', inner - sg * (le + 5), yA - 6, sg > 0 ? 'end' : 'start', 'var(--plume)');
          }
        });
      });
    }

    /* ---- canvas plumes */
    const C = {};
    function readColors() {
      C.plume = hexRGB(SX.color('--plume'));
      C.mix = hexRGB(SX.color('--mix'));
      C.oxgas = hexRGB(SX.color('--oxgas'));
      C.bad = hexRGB(SX.color('--bad'));
    }
    readColors();
    let dpr = 1;
    function sizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = stage.clientWidth;
      if (!w) return;
      const h = w * NH / NW;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }
    let states = null;
    const offs = [];
    let dirty = true;
    /* The blurred plume bodies are expensive, so they are rendered to one layer per engine only when the
       altitude or size changes. Each animation frame then composites those layers with a slight flicker and
       redraws only the shock diamonds. */
    function rebuild() {
      const k = cv.width / NW;
      engines.forEach((e, i) => {
        const oc = offs[i] || (offs[i] = document.createElement('canvas'));
        if (oc.width !== cv.width || oc.height !== cv.height) { oc.width = cv.width; oc.height = cv.height; }
        const o = oc.getContext('2d');
        o.setTransform(1, 0, 0, 1, 0, 0);
        o.globalCompositeOperation = 'source-over';
        o.clearRect(0, 0, oc.width, oc.height);
        o.setTransform(k, 0, 0, k, 0, 0);
        o.globalCompositeOperation = 'lighter';
        drawBody(o, e, states[i]);
        // fade each plume out across the middle so balloons at altitude do not paint over the other engine
        o.globalCompositeOperation = 'destination-in';
        const g = o.createLinearGradient(NW / 2 - 34, 0, NW / 2 + 34, 0);
        g.addColorStop(0, e.isV ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,1)');
        g.addColorStop(1, e.isV ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0)');
        o.fillStyle = g;
        o.fillRect(0, 0, NW, NH);
      });
      dirty = false;
    }
    function drawPlumes(t) {
      if (!cv.width || !states) return;
      if (dirty) rebuild();
      const ctx = cv.getContext('2d');
      const k = cv.width / NW;
      const moving = !SX.reducedMotion;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.globalCompositeOperation = 'lighter';
      engines.forEach((e, i) => {
        ctx.globalAlpha = moving ? 0.93 + 0.05 * Math.sin(t * 13 + i * 2.1) + 0.02 * Math.sin(t * 31 + i) : 1;
        ctx.drawImage(offs[i], 0, 0);
      });
      ctx.globalAlpha = 1;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      engines.forEach((e, i) => drawDiamonds(ctx, e, states[i], t || 0));
      ctx.globalCompositeOperation = 'source-over';
    }
    function drawBody(ctx, e, st) {
      const cx = e.cx;
      const Y = (z) => e.yExit - z * NS; // z up from the exit plane (m)
      // 1. flow inside the nozzle, throat to exit (or to the separation line)
      const zEnd = st.sep ? st.zStart : 0;
      const gIn = ctx.createLinearGradient(0, Y(e.zt), 0, Y(zEnd));
      gIn.addColorStop(0, rgba(C.mix, 0.75));
      gIn.addColorStop(0.3, rgba(C.plume, 0.32));
      gIn.addColorStop(1, rgba(C.plume, 0.14));
      ctx.fillStyle = gIn;
      ctx.beginPath();
      const n = 36;
      for (let i = 0; i <= n; i++) { const z = e.zt - (e.zt - zEnd) * i / n; const r = e.inner.rAt(z) - 0.012; ctx.lineTo(cx + r * NS, Y(z)); }
      for (let i = n; i >= 0; i--) { const z = e.zt - (e.zt - zEnd) * i / n; const r = e.inner.rAt(z) - 0.012; ctx.lineTo(cx - r * NS, Y(z)); }
      ctx.closePath();
      ctx.fill();
      // 2. the jet from its start station down to the bottom of the figure
      const yStart = Y(st.zStart);
      const Umax = (NH - yStart) / NS + 0.2;
      const steps = 110;
      const bright = 0.45 + 0.45 * Math.pow(st.dens, 0.6);
      const visLen = SX.lerp(4.5 * e.Re, Umax * 1.1, Math.pow(st.dens, 0.45));
      const R = [];
      for (let i = 0; i <= steps; i++) {
        const u = Umax * i / steps;
        R.push([u, Math.max(0.03, plumeR(e, st, u))]);
      }
      const shape = (scale) => {
        ctx.beginPath();
        R.forEach(([u, r]) => ctx.lineTo(cx + r * scale * NS, yStart + u * NS));
        for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(cx - R[i][1] * scale * NS, yStart + R[i][0] * NS);
        ctx.closePath();
      };
      const lg = (a0, a1, col, len) => {
        const g = ctx.createLinearGradient(0, yStart, 0, yStart + len * NS);
        g.addColorStop(0, rgba(col, a0));
        g.addColorStop(0.55, rgba(col, a1));
        g.addColorStop(1, rgba(col, 0));
        return g;
      };
      // concentric translucent layers add up to a smooth falloff from the hot core to the mixing layer
      const blur = 'filter' in ctx;
      if (blur) ctx.filter = 'blur(2.5px)';
      const layers = 8;
      for (let L = 0; L < layers; L++) {
        const f = L / (layers - 1);
        const sc = 1.16 - f * 0.86;
        const a = (0.06 + 0.07 * f) * bright;
        const len = visLen * (1.08 - f * 0.45);
        ctx.fillStyle = lg(a, a * 0.45, f > 0.7 ? C.mix : C.plume, len);
        shape(sc); ctx.fill();
      }
      const coreLen = Math.min(visLen, (isFinite(st.L) ? st.L * 1.4 : 2 * e.Re) + 0.8);
      ctx.fillStyle = lg(0.35 * bright + 0.1, 0.1 * bright, C.mix, coreLen);
      shape(0.2); ctx.fill();
      if (blur) ctx.filter = 'none';
    }
    // shock diamonds (Mach disks), strongest where the pressure mismatch is large and the air is dense
    function drawDiamonds(ctx, e, st, t) {
      const cx = e.cx;
      const moving = !SX.reducedMotion;
      const yStart = e.yExit - st.zStart * NS;
      const Umax = (NH - yStart) / NS + 0.2;
      if (isFinite(st.L) && st.diamond > 0.02) {
        for (let j = 0; j < 7; j++) {
          const u = st.L * (j + 0.58);
          if (u > Umax) break;
          const inten = st.diamond * Math.exp(-j / 2.6) * (moving ? 0.9 + 0.1 * Math.sin(t * 23 + j * 1.7) : 1);
          if (inten < 0.02) break;
          const rr = plumeR(e, st, u);
          const rx = Math.max(0.05, rr * (j === 0 ? 0.62 : 0.5)) * NS;
          const ry = Math.max(3, Math.min(st.L * 0.2, rr * 0.9) * NS);
          const y = yStart + u * NS;
          ctx.save();
          ctx.translate(cx, y);
          ctx.scale(1, ry / rx);
          const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
          gr.addColorStop(0, rgba(C.mix, 0.9 * inten));
          gr.addColorStop(0.35, rgba(C.mix, 0.45 * inten));
          gr.addColorStop(1, rgba(C.plume, 0));
          ctx.fillStyle = gr;
          ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }
    }

    function update(pa) {
      states = engines.map((e) => plumeState(e, pa));
      dirty = true;
      updateOverlays(pa);
      drawPlumes(state.clock());
    }

    const fig = el('figure', { class: 'viz viz-grid rl-fig', style: { margin: 0 } },
      el('div', { class: 'rl-figtitle' },
        el('span', { class: 'rl-kicker' }, 'Section A-A · same scale'),
        el('span', { class: 'rl-note' }, 'Plume shapes schematic')),
      stage,
      el('p', { class: 'rl-note', style: { marginTop: '8px' } }, 'Heights and exit diameters published by SpaceX; throat and wall contours estimated. Arrows compare exit pressure with the air pressure at the lip.'));
    root.appendChild(fig);

    return {
      fig, engines, update, refreshText,
      resize() { sizeCanvas(); dirty = true; drawPlumes(state.clock()); },
      frame(t) { if (states) drawPlumes(t); },
      recolor() { readColors(); },
    };
  }

  /* ---- p_e / p_a gauge (log scale) */
  function buildGauge() {
    const W = 340, H = 76, x0 = 12, x1 = 296, xInf = 324;
    const lo = Math.log10(0.1), hi = Math.log10(1000);
    const X = (r) => (!isFinite(r) ? xInf : x0 + (x1 - x0) * (SX.clamp(Math.log10(r), lo, hi) - lo) / (hi - lo));
    const s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'rl-gauge', role: 'img', 'aria-label': 'Exit pressure divided by ambient pressure, log scale, for both engines' });
    const y = 22, h = 14;
    const zone = (a, b, cls) => s.appendChild(svg('rect', { x: X(a), y, width: X(b) - X(a), height: h, class: cls }));
    zone(0.1, MODEL.sepK, 'rl-gz-bad'); zone(MODEL.sepK, 0.9, 'rl-gz-over'); zone(0.9, 1.1, 'rl-gz-ideal'); zone(1.1, 1000, 'rl-gz-under');
    s.appendChild(svg('rect', { x: x1 + 8, y, width: xInf - x1 + 6, height: h, class: 'rl-gz-under' }));
    s.appendChild(svg('path', { d: 'M' + (x1 + 1) + ' ' + (y + h + 3) + ' l3 -6 M' + (x1 + 5) + ' ' + (y + h + 3) + ' l3 -6', class: 'rl-axis' }));
    [[0.1, '0.1'], [MODEL.sepK, String(MODEL.sepK)], [1, '1'], [10, '10'], [100, '100'], [1000, '1000']].forEach(([r, t]) => {
      s.appendChild(svg('line', { x1: X(r), x2: X(r), y1: y + h, y2: y + h + 4, class: 'rl-axis' }));
      s.appendChild(svg('text', { x: X(r), y: H - 3, 'text-anchor': 'middle', class: 'svg-label-muted' }, t));
    });
    s.appendChild(svg('text', { x: xInf + 1, y: H - 3, 'text-anchor': 'middle', class: 'svg-label-muted' }, 'vac'));
    const mSL = svg('path', { class: 'rl-gmark-sl' }), mV = svg('path', { class: 'rl-gmark-v' });
    const tSL = svg('text', { class: 'svg-label rl-t-sl', 'text-anchor': 'middle', y: 11 }, 'SL');
    const tV = svg('text', { class: 'svg-label rl-t-v', 'text-anchor': 'middle', y: y + h + 20 }, 'RVAC');
    [mSL, mV, tSL, tV].forEach((n) => s.appendChild(n));
    const wrap = el('div', null, s, el('div', { class: 'rl-legend', style: { marginTop: '4px' } },
      el('span', { class: 'rl-legend-plain', html: '<i class="rl-lg rl-lg-bad"></i>separated' }),
      el('span', { class: 'rl-legend-plain', html: '<i class="rl-lg rl-lg-over"></i>over-expanded' }),
      el('span', { class: 'rl-legend-plain', html: '<i class="rl-lg rl-lg-ideal"></i>near ideal' }),
      el('span', { class: 'rl-legend-plain', html: '<i class="rl-lg rl-lg-under"></i>under-expanded' })));
    return {
      el: wrap,
      set(rSL, rV) {
        const a = X(rSL), b = X(rV);
        mSL.setAttribute('d', 'M' + a + ' ' + (y - 1) + ' l-5 -7 h10 Z M' + (a - 1) + ' ' + y + ' h2 v' + h + ' h-2 Z');
        mV.setAttribute('d', 'M' + b + ' ' + (y + h + 1) + ' l-5 7 h10 Z M' + (b - 1) + ' ' + y + ' h2 v' + h + ' h-2 Z');
        tSL.setAttribute('x', SX.clamp(a, 12, W - 12));
        tV.setAttribute('x', SX.clamp(b, 18, W - 18));
      },
    };
  }

  /* ---- thrust / Isp vs altitude chart (drawn at the container's pixel size so text stays 11px) */
  function buildAltChart(box, state) {
    let mode = 'thrust';
    let geom = null;
    const holder = el('div', { class: 'rl-chart' });
    box.appendChild(holder);
    const sqrtX = (km) => Math.sqrt(km / 100);
    function draw() {
      const w = Math.max(280, holder.clientWidth || 600);
      const h = Math.round(SX.clamp(w * 0.44, 230, 320));
      const m = { l: 50, r: 12, t: 34, b: 40 };
      const vacW = 58;
      const x0 = m.l, x1 = w - m.r - vacW, xVac = w - m.r - vacW / 2;
      const X = (km) => (km == null ? xVac : x0 + (x1 - x0) * sqrtX(km));
      const dom = mode === 'thrust' ? [220, 290] : [300, 400];
      const narrow = w < 520;
      const Yv = (v) => m.t + (h - m.t - m.b) * (1 - (v - dom[0]) / (dom[1] - dom[0]));
      const s = svg('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, role: 'img', 'aria-label': (mode === 'thrust' ? 'Thrust' : 'Effective specific impulse') + ' versus altitude for the sea-level Raptor 3 and Raptor Vacuum 3' });
      s.appendChild(svg('defs', null, svg('pattern', { id: 'rl-alt-sep', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, svg('line', { x1: 0, y1: 0, x2: 0, y2: 6, style: { stroke: 'var(--bad)', strokeWidth: 1, opacity: 0.35 } }))));
      // y grid + labels
      const usThrust = mode === 'thrust' && imperial();
      const kl = SX.convert(1, 'tf', 'klbf')[0];
      const tick0 = usThrust ? Math.ceil(dom[0] * kl / 20) * 20 : Math.ceil(dom[0] / 10) * 10;
      const tickStep = usThrust ? 20 : mode === 'thrust' ? 10 : 20;
      for (let tv = tick0; (usThrust ? tv / kl : tv) <= dom[1]; tv += tickStep) {
        const v = usThrust ? tv / kl : tv;
        s.appendChild(svg('line', { x1: x0, x2: xVac + vacW / 2, y1: Yv(v), y2: Yv(v), class: 'rl-gridl-2' }));
        s.appendChild(svg('text', { x: x0 - 8, y: Yv(v) + 4, 'text-anchor': 'end', class: 'svg-label-muted' }, String(tv)));
      }
      s.appendChild(svg('text', { x: 4, y: 12, class: 'svg-label-muted' }, mode === 'thrust' ? (imperial() ? 'THRUST PER ENGINE, KLBF' : 'THRUST PER ENGINE, TF') : 'EFFECTIVE ISP, S'));
      // x ticks
      const miKm = SX.convert(1, 'km', 'mi')[0];
      (imperial() ? (narrow ? [0, 3, 12, 25, 60] : [0, 3, 6, 12, 25, 40, 60]) : (narrow ? [0, 5, 20, 40, 100] : [0, 5, 10, 20, 40, 60, 80, 100])).forEach((u) => {
        const km = imperial() ? u / miKm : u;
        s.appendChild(svg('line', { x1: X(km), x2: X(km), y1: h - m.b, y2: h - m.b + 4, class: 'rl-axis' }));
        s.appendChild(svg('line', { x1: X(km), x2: X(km), y1: m.t, y2: h - m.b, class: 'rl-gridl' }));
        s.appendChild(svg('text', { x: X(km), y: h - m.b + 16, 'text-anchor': 'middle', class: 'svg-label-muted' }, String(u)));
      });
      s.appendChild(svg('text', { x: xVac, y: h - m.b + 16, 'text-anchor': 'middle', class: 'svg-label-muted' }, 'VAC'));
      s.appendChild(svg('path', { d: 'M' + (x1 + 10) + ' ' + (h - m.b - 5) + ' l5 10 M' + (x1 + 15) + ' ' + (h - m.b - 5) + ' l5 10', class: 'rl-axis' }));
      s.appendChild(svg('text', { x: (x0 + x1) / 2, y: h - 6, 'text-anchor': 'middle', class: 'svg-label-muted' }, (imperial() ? 'ALTITUDE, MI' : 'ALTITUDE, KM') + ' (SQUARE-ROOT SCALE)'));
      s.appendChild(svg('line', { x1: x0, x2: xVac + vacW / 2, y1: h - m.b, y2: h - m.b, class: 'rl-axis' }));
      s.appendChild(svg('line', { x1: x0, x2: x0, y1: m.t, y2: h - m.b, class: 'rl-axis' }));
      // RVac separation band
      const sepKm = MODEL.altSepV / 1000;
      s.appendChild(svg('rect', { x: X(0), y: m.t, width: X(sepKm) - X(0), height: h - m.t - m.b, class: 'rl-sepband' }));
      s.appendChild(svg('text', { x: X(sepKm) + 5, y: m.t + 12, class: 'svg-label', style: { fill: 'var(--bad)' } }, (narrow ? 'RVAC SEPARATES' : 'RVAC FLOW SEPARATES BELOW ' + fmtAlt(r2(sepKm, 1)).toUpperCase())));
      // curves
      const val2 = (e, pa) => { const p = perf(e, pa); return mode === 'thrust' ? p.F : p.isp; };
      state.engines.forEach((e) => {
        let dSep = '', dOk = '';
        for (let i = 0; i <= 160; i++) {
          const km = 100 * Math.pow(i / 160, 2);
          const pa = ATM.at(km * 1000).p;
          const pt = X(km).toFixed(1) + ' ' + Yv(val2(e, pa)).toFixed(1);
          if (e.isV && km < sepKm) dSep += (dSep ? ' L' : 'M') + pt;
          else { if (e.isV && !dOk && dSep) dOk = 'M' + dSep.split(' L').pop().replace('M', ''); dOk += (dOk ? ' L' : 'M') + pt; }
        }
        const vx = X(null), vy = Yv(val2(e, 0));
        dOk += ' M' + (X(100) + 0).toFixed(1) + ' ' + Yv(val2(e, ATM.at(100000).p)).toFixed(1) + ' L' + vx + ' ' + vy;
        if (dSep) s.appendChild(svg('path', { d: dSep, class: 'rl-line-v rl-line-dash' }));
        s.appendChild(svg('path', { d: dOk, class: e.isV ? 'rl-line-v' : 'rl-line-sl' }));
      });
      // published reference points
      const refs = mode === 'thrust'
        ? [[0, val('raptor.r3.thrustSL'), 'SL', 'raptor.r3.thrustSL'], [null, val('raptor.rvac3.thrust'), 'V', 'raptor.rvac3.thrust'], [null, val('raptor.r3.thrustVacOfSLEngine'), 'SL', 'raptor.r3.thrustVacOfSLEngine']]
        : [[0, val('raptor.r3.ispSL'), 'SL', 'raptor.r3.ispSL'], [null, val('raptor.r3.ispVac'), 'SL', 'raptor.r3.ispVac'], [null, val('raptor.rvac3.isp'), 'V', 'raptor.rvac3.isp']];
      refs.forEach(([km, v, who, key]) => {
        const x = X(km), y = Yv(v);
        s.appendChild(svg('path', { d: 'M' + x + ' ' + (y - 5) + ' l5 5 l-5 5 l-5 -5 Z', class: 'rl-ref' }));
        const f = SX.fact(key);
        const conf = f && f.conf ? f.conf : 'estimate';
        const below = km == null && (mode === 'thrust' ? who === 'SL' : who === 'SL');
        s.appendChild(svg('text', { x: km == null ? x - 9 : x + 8, y: km == null ? y + (below ? 15 : -8) : y - 10, 'text-anchor': km == null ? 'end' : 'start', class: who === 'V' ? 'rl-lab-v' : 'rl-lab-sl' },
          narrow ? SX.fmt(key) : (km == null || mode !== 'thrust' ? '' : 'rated ') + SX.fmt(key) + ' · ' + conf));
      });
      // cursor
      const km = state.alt();
      const cx = X(km);
      s.appendChild(svg('line', { x1: cx, x2: cx, y1: m.t - 6, y2: h - m.b, class: 'rl-cursor' }));
      const pa = state.pa();
      const vals = state.engines.map((e) => ({ e, y: Yv(val2(e, pa)), v: val2(e, pa) }));
      // avoid label overlap
      const labY = vals.map((o) => o.y);
      if (Math.abs(labY[0] - labY[1]) < 16) { const mid = (labY[0] + labY[1]) / 2; const sg = labY[0] <= labY[1] ? -1 : 1; labY[0] = mid + sg * 8; labY[1] = mid - sg * 8; }
      vals.forEach((o, i) => {
        s.appendChild(svg('circle', { cx, cy: o.y, r: 4.5, class: o.e.isV ? 'rl-dot-v' : 'rl-dot-sl' }));
        if (km == null) return; // in vacuum the dots sit on the labelled ratings
        const right = cx < x0 + (x1 - x0) * 0.62;
        const sep = o.e.isV && perf(o.e, pa).sep;
        const txt = (mode === 'thrust' ? fmtTf(o.v) : f1(o.v) + ' s');
        s.appendChild(svg('text', { x: cx + (right ? 10 : -10), y: labY[i] + 4 + (km === 0 && !o.e.isV ? 10 : 0), 'text-anchor': right ? 'start' : 'end', class: o.e.isV ? 'rl-lab-v' : 'rl-lab-sl' },
          sep ? '(' + txt + ', invalid)' : txt));
      });
      const cRight = cx < x0 + 60;
      s.appendChild(svg('text', { x: cRight ? cx + 6 : Math.min(cx, w - 40), y: m.t - 10, 'text-anchor': cRight ? 'start' : 'middle', class: 'rl-lab-acc' }, fmtAlt(km)));
      holder.textContent = '';
      holder.appendChild(s);
      geom = { x0, x1, xVac, vacW, w };
    }
    // click or drag on the chart to set altitude
    let dragging = false;
    const setFromEvent = (e) => {
      if (!geom) return;
      const r = holder.getBoundingClientRect();
      const x = (e.clientX - r.left) * geom.w / r.width;
      if (x > geom.x1 + 8) { state.setAlt(null); return; }
      const t = SX.clamp((x - geom.x0) / (geom.x1 - geom.x0), 0, 1);
      state.setAlt(Math.round(100 * t * t * 2) / 2);
    };
    holder.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') return; dragging = true; holder.setPointerCapture(e.pointerId); setFromEvent(e); });
    holder.addEventListener('pointermove', (e) => { if (dragging) setFromEvent(e); });
    holder.addEventListener('pointerup', () => { dragging = false; });
    holder.addEventListener('click', (e) => { if (e.pointerType === 'touch' || e.detail === 0) setFromEvent(e); });
    observeSize(holder, draw);
    return { draw, setMode(mo) { mode = mo; draw(); } };
  }

  function buildPlumePanel(root) {
    let altKm = 0; // null = vacuum
    let clock = 0;
    const state = {
      alt: () => altKm,
      pa: () => (altKm == null ? 0 : ATM.at(altKm * 1000).p),
      clock: () => clock,
      setAlt: null,
      engines: null,
      plumeTip: null,
    };
    const grid = el('div', { class: 'rl-grid' });
    const left = el('div', { style: { minWidth: 0 } });
    const right = el('div', { class: 'rl-side' });
    grid.appendChild(left);
    grid.appendChild(right);
    root.appendChild(grid);
    const noz = buildNozzles(left, state);
    state.engines = noz.engines;
    state.plumeTip = (e) => {
      const pf = perf(e, state.pa());
      return regime(pf.ratio).t + '. Exit pressure ' + (isFinite(pf.ratio) ? f1(pf.ratio) + ' x ambient.' : 'against vacuum.');
    };

    // controls
    const outAlt = el('output', { for: 'rl-alt', 'aria-live': 'off' });
    const rng = el('input', { id: 'rl-alt', type: 'range', min: '0', max: '102', step: '0.5', value: '0', 'aria-label': 'Altitude' });
    const chips = el('div', { class: 'chip-row', role: 'group', 'aria-label': 'Altitude presets' });
    const presets = [[0, 'Sea level'], [5, '5 km'], [12, '12 km'], [25, '25 km'], [50, '50 km'], [null, 'Vacuum']];
    const chipEls = presets.map(([km, t]) => {
      const c = el('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', onclick: () => state.setAlt(km) }, t);
      chips.appendChild(c);
      return { km, c };
    });
    const atm = el('dl', { class: 'rl-atm' });
    const statP = el('dd'), statT = el('dd'), statR = el('dd');
    atm.appendChild(el('div', { class: 'rl-stat' }, el('dt', null, 'Air pressure'), statP));
    atm.appendChild(el('div', { class: 'rl-stat' }, el('dt', null, 'Air temperature'), statT));
    atm.appendChild(el('div', { class: 'rl-stat' }, el('dt', null, 'Air density'), statR));
    const ctlCard = el('div', { class: 'rl-card rl-alt' },
      el('div', { class: 'rl-alt-row' }, el('label', { for: 'rl-alt' }, 'Altitude'), rng, outAlt),
      chips, atm);
    right.appendChild(ctlCard);

    const gauge = buildGauge();
    const tbody = el('tbody');
    const tbl = el('table', { class: 'rl-tbl' },
      el('thead', null, el('tr', null, el('th', { scope: 'col' }, ''), el('th', { scope: 'col', html: '<span class="rl-sw sl"></span>Sea level' }), el('th', { scope: 'col', html: '<span class="rl-sw v"></span>RVac' }))),
      tbody);
    const readCard = el('div', { class: 'rl-card' },
      el('div', { class: 'rl-figtitle' }, el('span', { class: 'rl-kicker' }, 'Exit pressure / air pressure'), el('span', { class: 'rl-note' }, 'log scale')),
      gauge.el, tbl,
      el('p', { class: 'rl-note', style: { marginTop: '8px' }, html: 'Simplified: ideal nozzle, fixed chamber conditions. F(h) = F<sub>vac</sub> - p<sub>a</sub>(h) x A<sub>e</sub>; Isp scales with thrust at constant mass flow.' }));
    right.appendChild(readCard);

    const cells = {};
    const rowDefs = [
      ['exit', 'Exit pressure'], ['ratio', 'p_e / p_a'], ['regime', 'Regime'], ['F', 'Thrust'], ['isp', 'Isp'],
    ];
    rowDefs.forEach(([k, t]) => {
      const a = el('td', { class: 'c-sl' }), b = el('td', { class: 'c-v' });
      cells[k] = [a, b];
      tbody.appendChild(el('tr', null, el('th', { scope: 'row', html: k === 'ratio' ? 'p<sub>e</sub> / p<sub>a</sub>' : t }), a, b));
    });
    cells.exit[0].innerHTML = SX.factHTML('lab.peSLEst');
    cells.exit[1].innerHTML = SX.factHTML('lab.peRVacEst');

    // chart
    const chartBox = el('div', { class: 'rl-card rl-chartbox' });
    const modeSeg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Chart quantity' });
    const mb = (m, t) => el('button', { type: 'button', 'aria-pressed': String(m === 'thrust'), onclick: () => { modeSeg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btns[m]))); chart.setMode(m); } }, t);
    const btns = { thrust: mb('thrust', 'Thrust'), isp: mb('isp', 'Isp') };
    modeSeg.appendChild(btns.thrust); modeSeg.appendChild(btns.isp);
    chartBox.appendChild(el('div', { class: 'rl-figtitle' },
      el('div', null, el('div', { class: 'rl-kicker' }, 'One engine of each type vs altitude'),
        el('div', { class: 'rl-note', style: { marginTop: '4px' } }, 'Simplified: ideal nozzle, fixed chamber conditions. Drag on the chart to set altitude.')),
      modeSeg));
    root.appendChild(chartBox);
    const chart = buildAltChart(chartBox, state);
    chartBox.appendChild(el('div', { class: 'rl-legend', style: { marginTop: '4px' } },
      el('span', { html: '<span class="rl-sw sl" style="width:14px"></span>Sea-level Raptor 3' }),
      el('span', { html: '<span class="rl-sw v" style="width:14px"></span>Raptor Vacuum 3 (dashed: separated, model invalid)' }),
      el('span', { html: '&#9671; published or derived rating' })));
    chartBox.querySelectorAll('.rl-legend > span').forEach((s) => s.classList.add('rl-legend-plain'));
    chartBox.appendChild(el('p', { class: 'rl-note', style: { marginTop: '8px' }, html: SX.withFacts('Model inputs: vacuum thrust {{raptor.r3.thrustVacOfSLEngine}} and {{raptor.rvac3.thrust}}; vacuum Isp {{raptor.r3.ispVac}} and {{raptor.rvac3.isp}}; exit areas {{lab.aeSL}} and {{lab.aeRVac}}; US Standard Atmosphere 1976. With the RVac sharing the sea-level throat, an ideal nozzle gives it about {{lab.rvacIspModel}} rather than {{raptor.rvac3.isp}}, so treat both Isp values as approximate.') }));

    // explainer cards
    const cards = el('div', { class: 'rl-cards' });
    [
      ['Over-expanded: pinched', 'Below its design altitude a nozzle expands the gas to a lower pressure than the air around it. The air squeezes the jet inward, and oblique shocks start at the lip, cross, reflect and repeat down the plume as a chain of bright shock diamonds. In this model the sea-level Raptor leaves at about {{lab.peSLEst}}, so it is nearly matched at sea level and ideally expanded at about {{lab.slIdealAlt}}.'],
      ['Under-expanded: ballooning', 'Above that altitude the gas leaves at a higher pressure than the air, so it keeps expanding outside the nozzle, where the expansion pushes on nothing. The plume balloons, shock cells stretch out and fade, and in vacuum the exhaust fans out in every forward direction. The RVac\'s big bell recovers that wasted expansion. It is matched near {{lab.rvacIdealAlt}} and gains the most above it.'],
      ['Flow separation', 'When exit pressure drops far enough below ambient, roughly {{lab.sepRule}} of it by a common rule of thumb, air pushes up into the bell and the jet peels away from the wall. The separation line is rarely symmetric and it wanders, so the nozzle takes large, unsteady side loads, and the thrust the model predicts no longer applies.'],
      ['Why the RVac stays off near the ground', 'By this estimate the RVac\'s flow would separate below about {{lab.rvacSepAlt}}, and even with attached flow its huge exit area loses more thrust to air pressure than the small bell does. Ships do fire all their engines, RVacs included, in short static fires on the ground, but in flight the RVacs light only at staging, high above the dense air, and the sea-level engines do every landing.'],
    ].forEach(([t, p]) => cards.appendChild(el('div', { class: 'rl-card' }, el('h5', null, t), el('p', { html: SX.withFacts(p) }))));
    root.appendChild(cards);

    function setAlt(km) {
      altKm = km == null ? null : SX.clamp(km, 0, 100);
      rng.value = altKm == null ? '102' : String(altKm);
      rng.setAttribute('aria-valuetext', fmtAlt(altKm));
      refresh();
    }
    state.setAlt = setAlt;
    rng.addEventListener('input', () => {
      const v = parseFloat(rng.value);
      altKm = v > 100.5 ? null : v;
      rng.setAttribute('aria-valuetext', fmtAlt(altKm));
      refresh();
    });

    function refresh() {
      const pa = state.pa();
      const a = altKm == null ? null : ATM.at(altKm * 1000);
      outAlt.textContent = fmtAlt(altKm);
      statP.textContent = altKm == null ? '0 (vacuum)' : fmtPa(pa);
      statT.textContent = a ? SX.fmtValue(a.T, 'K', { digits: 0 }) : 'n/a';
      const rhoU = a ? (imperial() ? a.rho * 0.0624280 : a.rho) : 0;
      statR.textContent = a ? (rhoU >= 0.01 ? rhoU.toFixed(imperial() ? 4 : 3) : rhoU.toPrecision(2)) + (imperial() ? ' lb/ft³' : ' kg/m³') : '0';
      chipEls.forEach(({ km, c }) => {
        c.setAttribute('aria-pressed', String(km === altKm));
        if (km != null && km > 0) c.textContent = fmtAlt(km);
      });
      const pSL = perf(noz.engines[0], pa), pV = perf(noz.engines[1], pa);
      gauge.set(pSL.ratio, pV.ratio);
      [pSL, pV].forEach((p, i) => {
        const reg = regime(p.ratio);
        cells.ratio[i].textContent = isFinite(p.ratio) ? (p.ratio >= 100 ? Math.round(p.ratio).toLocaleString('en-US') : p.ratio >= 10 ? p.ratio.toFixed(1) : p.ratio.toFixed(2)) : '∞ (vacuum)';
        cells.regime[i].innerHTML = '<span class="rl-badge rl-b-' + reg.k + '">' + reg.t + '</span>';
        cells.F[i].textContent = (p.sep ? '(' : '') + fmtTf(p.F) + (p.sep ? ')' : '');
        cells.isp[i].textContent = (p.sep ? '(' : '') + f1(p.isp) + ' s' + (p.sep ? ')' : '');
      });
      noz.update(pa);
      chart.draw();
    }

    SX.renderFacts(root);
    const run = observeSize(noz.fig, () => noz.resize());
    run();
    setAlt(0);
    // flicker only while on screen and only without reduced motion
    if (!SX.reducedMotion) SX.loop(noz.fig, (dt, t) => { clock = t; noz.frame(t); });
    return {
      noz, refresh, fig: noz.fig,
      units() { noz.refreshText(); refresh(); },
    };
  }

  /* ================================================================== 9. panel C: physics */

  function buildPhysics(root) {
    const F = (k) => val(k);
    const nSL = F('ship.enginesSL'), nV = F('ship.enginesVac');
    const MODES = {
      mix: { name: 'All ' + (nSL + nV) + ' engines', isp: F('lab.ispMix'), thrust: F('ship.thrustVac'), ispKey: 'lab.ispMix', thrKey: 'ship.thrustVac' },
      vac: { name: nV + ' RVacs only', isp: F('raptor.rvac3.isp'), thrust: F('lab.shipThrustVacOnly'), ispKey: 'raptor.rvac3.isp', thrKey: 'lab.shipThrustVacOnly' },
      sl: { name: nSL + ' sea-level only', isp: F('raptor.r3.ispVac'), thrust: F('lab.shipThrustSLOnly'), ispKey: 'raptor.r3.ispVac', thrKey: 'lab.shipThrustSLOnly' },
    };
    const st = { mode: 'mix', dry: F('lab.shipDryAssumed'), prop: F('ship.propTotal'), pay: F('stack.payloadLEOReusable'), res: 0 };
    const dv = (isp, dry, prop, pay, res) => isp * G0 * Math.log((dry + pay + prop) / (dry + pay + res));

    const grid = el('div', { class: 'rl-grid rl-grid-even' });
    const left = el('div', { class: 'rl-side' });
    const right = el('div', { class: 'rl-side' });
    grid.appendChild(left); grid.appendChild(right);
    root.appendChild(grid);

    // controls
    const seg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Engines and specific impulse' });
    const segBtns = {};
    ['mix', 'vac', 'sl'].forEach((k) => {
      segBtns[k] = el('button', { type: 'button', 'aria-pressed': String(k === st.mode), onclick: () => { st.mode = k; Object.keys(segBtns).forEach((q) => segBtns[q].setAttribute('aria-pressed', String(q === k))); update(); } }, MODES[k].name);
      seg.appendChild(segBtns[k]);
    });
    const ispNote = el('p', { class: 'rl-note' });
    const slider = (id, label, min, max, step, value, onInput) => {
      const out = el('output', { for: id });
      const inp = el('input', { id, type: 'range', min: String(min), max: String(max), step: String(step), value: String(value) });
      inp.addEventListener('input', () => { onInput(parseFloat(inp.value)); update(); });
      return { row: el('div', { class: 'range-row' }, el('label', { for: id }, label), inp, out), inp, out };
    };
    const sDry = slider('rl-dry', 'Ship dry mass', 80, 220, 1, st.dry, (v) => { st.dry = v; });
    const sProp = slider('rl-prop', 'Propellant', 200, F('ship.propTotal'), 10, st.prop, (v) => { st.prop = v; });
    const sPay = slider('rl-pay', 'Payload', 0, 200, 1, st.pay, (v) => { st.pay = v; });
    const sRes = slider('rl-res', 'Kept for landing', 0, 150, 5, st.res, (v) => { st.res = Math.min(v, st.prop); });
    const ctl = el('div', { class: 'rl-card rl-ctrl' },
      el('div', { class: 'rl-figtitle' }, el('span', { class: 'rl-kicker' }, 'Ship in vacuum'), el('span', { class: 'rl-note' }, 'Drag the sliders')),
      seg, ispNote, sDry.row, sProp.row, sPay.row, sRes.row,
      el('p', { class: 'rl-note', html: SX.withFacts('Dry mass is not published (default {{lab.shipDryAssumed}} is mid-range of public estimates). Full load {{ship.propTotal}}; SpaceX quotes {{stack.payloadLEOReusable}} to orbit reusable. Landing reserve is your choice: SpaceX has not published it.') }));
    left.appendChild(ctl);

    // equation
    const eq = el('div', { class: 'rl-eq', role: 'group', 'aria-label': 'Rocket equation with the current numbers' });
    left.appendChild(el('div', { class: 'rl-card' },
      el('div', { class: 'rl-figtitle' }, el('span', { class: 'rl-kicker' }, 'Tsiolkovsky rocket equation'), el('span', { class: 'rl-note', html: 'g<sub>0</sub> = ' + SX.factHTML('lab.g0', { digits: 5 }) })),
      eq));
    // outputs
    const outs = el('dl', { class: 'rl-outs' });
    const o = {};
    [['dv', 'Delta-v'], ['mr', 'Mass ratio'], ['tw', 'Start T/W'], ['bt', 'Burn time']].forEach(([k, t]) => {
      o[k] = el('dd');
      outs.appendChild(el('div', { class: 'rl-stat' }, el('dt', null, t), o[k]));
    });
    left.appendChild(outs);
    const twNote = el('p', { class: 'rl-note' });
    left.appendChild(twNote);

    // chart
    const chartCard = el('div', { class: 'rl-card' });
    chartCard.appendChild(el('div', { class: 'rl-figtitle' }, el('span', { class: 'rl-kicker' }, 'Ship delta-v vs payload'), el('span', { class: 'rl-note' }, 'Axis starts at zero')));
    const holder = el('div', { class: 'rl-chart' });
    chartCard.appendChild(holder);
    const mkList = el('ul', { class: 'rl-mklist' },
      el('li', { class: 'k-leo', html: '<i></i><span>' + SX.withFacts('Ground to low Earth orbit, including losses: about {{lab.dvLEO}}') + '</span>' }),
      el('li', { class: 'k-orb', html: '<i></i><span>' + SX.withFacts('Orbital speed in low Earth orbit: about {{flight.orbitalSpeedLEO}}, the speed itself with no losses') + '</span>' }),
      el('li', { class: 'k-ship', html: '<i></i><span>' + SX.withFacts('The ship\'s share after staging: roughly {{lab.dvShipShare}}, shaded band {{lab.dvShipShareLo}} to {{lab.dvShipShareHi}}') + '</span>' }));
    chartCard.appendChild(mkList);
    chartCard.appendChild(el('p', { class: 'rl-note', style: { marginTop: '8px' } }, 'Ideal delta-v in vacuum. Gravity, drag and steering losses are counted in the markers, not in the curve. Faint dashed curves show the other two engine choices.'));
    right.appendChild(chartCard);

    let geom = null;
    function drawChart() {
      const w = Math.max(280, holder.clientWidth || 500);
      const h = Math.round(SX.clamp(w * 0.72, 260, 380));
      const m = { l: 44, r: 14, t: 26, b: 38 };
      const X = (t) => m.l + (w - m.l - m.r) * t / 200;
      const Yk = (kms) => m.t + (h - m.t - m.b) * (1 - kms / 12);
      const s = svg('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, role: 'img', 'aria-label': 'Ship delta-v against payload for the chosen engines, with orbit markers' });
      const fps = SX.convert(1, 'm/s', 'ft/s')[0];
      const yt = imperial() ? [0, 5, 10, 15, 20, 25, 30, 35].map((kft) => [kft * 1000 / fps / 1000, kft]) : [0, 2, 4, 6, 8, 10, 12].map((k) => [k, k]);
      yt.forEach(([k, lab]) => {
        s.appendChild(svg('line', { x1: m.l, x2: w - m.r, y1: Yk(k), y2: Yk(k), class: 'rl-gridl-2' }));
        s.appendChild(svg('text', { x: m.l - 7, y: Yk(k) + 4, 'text-anchor': 'end', class: 'svg-label-muted' }, String(lab)));
      });
      s.appendChild(svg('text', { x: 4, y: 11, class: 'svg-label-muted' }, imperial() ? 'DELTA-V, 1000 FT/S' : 'DELTA-V, KM/S'));
      const lbT = SX.convert(1, 't', 'lb')[0] / 1000;
      (imperial() ? [0, 100, 200, 300, 400].map((kl) => [kl / lbT, kl]) : [0, 50, 100, 150, 200].map((t) => [t, t])).forEach(([t, lab]) => {
        s.appendChild(svg('line', { x1: X(t), x2: X(t), y1: h - m.b, y2: h - m.b + 4, class: 'rl-axis' }));
        s.appendChild(svg('text', { x: X(t), y: h - m.b + 16, 'text-anchor': 'middle', class: 'svg-label-muted' }, String(lab)));
      });
      s.appendChild(svg('text', { x: (m.l + w - m.r) / 2, y: h - 5, 'text-anchor': 'middle', class: 'svg-label-muted' }, imperial() ? 'PAYLOAD, 1000 LB' : 'PAYLOAD, T'));
      s.appendChild(svg('line', { x1: m.l, x2: w - m.r, y1: h - m.b, y2: h - m.b, class: 'rl-axis' }));
      s.appendChild(svg('line', { x1: m.l, x2: m.l, y1: m.t, y2: h - m.b, class: 'rl-axis' }));
      // markers
      const share = F('lab.dvShipShare') / 1000;
      const bandHi = F('lab.dvShipShareHi') / 1000, bandLo = F('lab.dvShipShareLo') / 1000;
      s.appendChild(svg('rect', { x: m.l, y: Yk(bandHi), width: w - m.l - m.r, height: Yk(bandLo) - Yk(bandHi), class: 'rl-band-ship' }));
      const narrow = w < 520;
      const mk = (kms, cls, text, dy) => {
        s.appendChild(svg('line', { x1: m.l, x2: w - m.r, y1: Yk(kms), y2: Yk(kms), class: 'rl-mk rl-mk-' + cls }));
        s.appendChild(svg('text', { x: w - m.r - 4, y: Yk(kms) + (dy || -5), 'text-anchor': 'end', class: 'rl-mk-t-' + cls + ' rl-halo' }, text));
      };
      mk(F('lab.dvLEO') / 1000, 'leo', narrow ? 'TO LEO · EST.' : 'GROUND TO LEO · ESTIMATE');
      mk(F('flight.orbitalSpeedLEO') / 3600, 'orb', narrow ? 'ORBITAL · OFFICIAL' : 'ORBITAL SPEED · OFFICIAL');
      mk(share, 'ship', narrow ? 'SHIP SHARE · EST.' : 'SHIP SHARE · ESTIMATE', 14);
      // payload reference
      const pRef = F('stack.payloadLEOReusable');
      s.appendChild(svg('line', { x1: X(pRef), x2: X(pRef), y1: m.t, y2: h - m.b, class: 'rl-gridl-2', style: { strokeDasharray: '2 3' } }));
      s.appendChild(svg('text', { x: X(pRef) + 4, y: h - m.b - 6, class: 'svg-label-muted' }, SX.fmt('stack.payloadLEOReusable', { plus: true }) + (narrow ? ' SPACEX' : ' REUSABLE, SPACEX')));
      // curves
      const curve = (isp) => {
        let d = '';
        for (let t = 0; t <= 200; t += 2) d += (d ? ' L' : 'M') + X(t).toFixed(1) + ' ' + Yk(dv(isp, st.dry, st.prop, t, st.res) / 1000).toFixed(1);
        return d;
      };
      Object.keys(MODES).forEach((k) => { if (k !== st.mode) s.appendChild(svg('path', { d: curve(MODES[k].isp), class: 'rl-dv-alt' })); });
      s.appendChild(svg('path', { d: curve(MODES[st.mode].isp), class: 'rl-dv-main' }));
      // current point
      const cur = dv(MODES[st.mode].isp, st.dry, st.prop, st.pay, st.res) / 1000;
      s.appendChild(svg('line', { x1: X(st.pay), x2: X(st.pay), y1: Yk(cur), y2: h - m.b, class: 'rl-cursor', style: { strokeDasharray: '3 3' } }));
      s.appendChild(svg('circle', { cx: X(st.pay), cy: Yk(cur), r: 5, class: 'rl-dv-dot' }));
      const right = st.pay < 110;
      if (!narrow) s.appendChild(svg('text', { x: X(st.pay) + (right ? 10 : -10), y: Yk(cur) + 18, 'text-anchor': right ? 'start' : 'end', class: 'rl-lab-acc' }, fmtDv(cur * 1000)));
      holder.textContent = '';
      holder.appendChild(s);
      geom = { X, m, w };
    }
    // click the chart to set payload
    holder.addEventListener('click', (e) => {
      if (!geom) return;
      const r = holder.getBoundingClientRect();
      const x = (e.clientX - r.left) * geom.w / r.width;
      const t = SX.clamp(Math.round((x - geom.m.l) / (geom.w - geom.m.l - geom.m.r) * 200), 0, 200);
      st.pay = t; sPay.inp.value = String(t); update();
    });

    function update() {
      st.res = Math.min(st.res, st.prop);
      const M = MODES[st.mode];
      const m0 = st.dry + st.pay + st.prop, mf = st.dry + st.pay + st.res;
      const d = dv(M.isp, st.dry, st.prop, st.pay, st.res);
      sDry.out.textContent = fmtT(st.dry);
      sProp.out.textContent = fmtT(st.prop);
      sPay.out.textContent = fmtT(st.pay);
      sRes.out.textContent = fmtT(st.res);
      ispNote.innerHTML = SX.withFacts('Isp {{' + M.ispKey + '}} · thrust {{' + M.thrKey + '}}');
      SX.renderFacts(ispNote);
      const massU = imperial() ? (v) => SX.fmtValue(v, 't') : (v) => nf(v) + ' t';
      const fps = SX.convert(1, 'm/s', 'ft/s')[0];
      const g0txt = imperial() ? (G0 * fps).toFixed(3) + ' ft/s²' : G0 + ' m/s²';
      const veTxt = imperial() ? nf(M.isp * G0 * fps) + ' ft/s' : nf(M.isp * G0) + ' m/s';
      eq.innerHTML =
        '<span class="l"><var>Δv</var> = <var>I</var><sub>sp</sub> · <var>g</var><sub>0</sub> · ln( <var>m</var><sub>0</sub> / <var>m</var><sub>f</sub> )</span>' +
        '<span class="l">&nbsp;&nbsp;&nbsp; = <span class="n">' + f1(M.isp) + ' s</span> · <span class="n">' + g0txt + '</span> · ln( <span class="n">' + massU(m0) + '</span> / <span class="n">' + massU(mf) + '</span> )</span>' +
        '<span class="l">&nbsp;&nbsp;&nbsp; = <span class="n">' + veTxt + '</span> · ln( <span class="n">' + (m0 / mf).toFixed(2) + '</span> )</span>' +
        '<span class="l">&nbsp;&nbsp;&nbsp; = <span class="res">' + fmtDv(d) + '</span></span>' +
        '<span class="l def"><var>m</var><sub>0</sub> = dry + payload + propellant; <var>m</var><sub>f</sub> = dry + payload + landing reserve. <var>I</var><sub>sp</sub> · <var>g</var><sub>0</sub> is the effective exhaust velocity.</span>';
      o.dv.textContent = fmtDv(d);
      o.mr.textContent = (m0 / mf).toFixed(2);
      o.tw.textContent = (M.thrust / m0).toFixed(2);
      o.bt.textContent = nf((st.prop - st.res) * M.isp / M.thrust) + ' s';
      const tw = M.thrust / m0;
      twNote.textContent = 'Start T/W is vacuum thrust over full weight at 1 g. ' + (tw < 1
        ? 'Below 1 the ship cannot climb on thrust alone. It rides the upward speed the booster gave it while it accelerates mostly sideways, and the longer the burn fights gravity, the larger the gravity losses.'
        : 'Above 1 the ship could climb on thrust alone.') + ' Burn time assumes full thrust throughout.';
      drawChart();
    }
    observeSize(holder, drawChart);
    update();

    // why methane
    const prop = el('div', { class: 'rl-prop', id: 'rl-methane' });
    prop.appendChild(el('div', { class: 'rl-figtitle' },
      el('h5', { class: 'rl-subhead' }, 'Why methane'),
      el('span', { class: 'rl-note' }, 'Each fuel burned with liquid oxygen')));
    prop.appendChild(el('p', { class: 'prose', style: { marginBottom: '14px' } }, 'Choosing a propellant is a trade between efficiency, density, temperature and what the fuel does to an engine that has to fly again.'));
    const mini = (v, max) => '<div class="rl-mini" aria-hidden="true"><b style="width:' + (100 * v / max).toFixed(1) + '%"></b></div>';
    const fd = (k, o2) => SX.factHTML(k, o2);
    const dMax = F('lab.rho.rp1'), bMax = F('lab.bulk.kerolox'), iMax = F('lab.isp.rs25Vac');
    const rows = [
      ['Fuel density', [
        '<span class="v">' + fd('lab.rho.rp1') + '</span>' + mini(F('lab.rho.rp1'), dMax),
        '<span class="v">' + fd('lab.rho.ch4') + '</span>' + mini(F('lab.rho.ch4'), dMax),
        '<span class="v">' + fd('lab.rho.lh2') + '</span>' + mini(F('lab.rho.lh2'), dMax)]],
      ['Propellant pair density', [
        '<span class="v">' + fd('lab.bulk.kerolox') + '</span>' + mini(F('lab.bulk.kerolox'), bMax) + '<span class="small muted">at O/F ' + fd('lab.of.kerolox', { unitless: true }) + '</span>',
        '<span class="v">' + fd('lab.bulk.methalox') + '</span>' + mini(F('lab.bulk.methalox'), bMax) + '<span class="small muted">at O/F ' + fd('raptor.r3.ofRatio', { unitless: true }) + '</span>',
        '<span class="v">' + fd('lab.bulk.hydrolox') + '</span>' + mini(F('lab.bulk.hydrolox'), bMax) + '<span class="small muted">at O/F ' + fd('lab.of.hydrolox', { unitless: true }) + '</span>']],
      ['Vacuum Isp, sea-level engine', [
        '<span class="v">' + fd('lab.isp.rd180Vac') + '</span>' + mini(F('lab.isp.rd180Vac'), iMax) + '<span class="small muted">RD-180</span>',
        '<span class="v">' + fd('raptor.r3.ispVac') + '</span>' + mini(F('raptor.r3.ispVac'), iMax) + '<span class="small muted">Raptor 3; RVac about ' + fd('raptor.rvac3.isp') + '</span>',
        '<span class="v">' + fd('lab.isp.rs25Vac') + '</span>' + mini(F('lab.isp.rs25Vac'), iMax) + '<span class="small muted">RS-25</span>']],
      ['Boiling point', [
        '<span class="rl-good">Liquid at room temperature</span>',
        '<span class="v">' + fd('propellant.ch4Boil') + '</span><br><span class="small">Close to LOX at ' + fd('propellant.loxBoil') + ': tanks can share a common dome</span>',
        '<span class="v">' + fd('lab.lh2Boil') + '</span><br><span class="small">Boils off fast; hard to insulate and keep for months</span>']],
      ['Soot and coking', [
        '<span class="rl-bad">Soots and cokes</span> in a fuel-rich preburner, fouling turbines and cooling passages',
        '<span class="rl-good">Burns clean</span>, so a fuel-rich preburner stays usable across many flights',
        '<span class="rl-good">No carbon</span> in the fuel']],
      ['Make it on Mars', [
        '<span class="rl-bad">Not practical</span>',
        '<span class="rl-good">Yes</span>: water ice and atmospheric CO₂, via electrolysis and the Sabatier reaction',
        '<span class="rl-mid">From water</span>, but very hard to store for a long return trip']],
    ];
    const tb = el('tbody');
    rows.forEach(([name, cellsHTML]) => tb.appendChild(el('tr', null, el('th', { scope: 'row' }, name),
      cellsHTML.map((h, i) => el('td', { class: i === 1 ? 'is-ch4' : '', 'data-fuel': ['Kerosene', 'Methane', 'Hydrogen'][i], html: h })))));
    const table = el('table', { class: 'rl-ptbl' },
      el('thead', null, el('tr', null, el('th', { scope: 'col' }, ''),
        el('th', { scope: 'col', html: 'Kerosene<small>RP-1 + LOX, e.g. Falcon 9</small>' }),
        el('th', { scope: 'col', class: 'is-ch4', html: 'Methane<small>CH₄ + LOX, Raptor</small>' }),
        el('th', { scope: 'col', html: 'Hydrogen<small>LH₂ + LOX, e.g. RS-25</small>' }))),
      tb);
    const ptWrap = el('div', { class: 'rl-prop-scroll', tabindex: '0', role: 'region', 'aria-label': 'Propellant comparison table' }, table);
    prop.appendChild(ptWrap);
    prop.appendChild(el('p', { class: 'rl-note', style: { marginTop: '8px' } }, 'Densities are saturated liquids at 1 atm (NIST); Starship subcools its propellants, which makes them denser. Pair density is the mass-weighted mix at each engine\'s mixture ratio (estimate). Isp compares sea-level engines in vacuum so the three are like for like.'));
    const pb = el('button', { type: 'button', class: 'btn btn-sm', style: { marginTop: '10px' }, onclick: () => SX.select('raptor3.physics.methane') }, 'Open "Why methane" in the inspector');
    prop.appendChild(pb);
    root.appendChild(prop);
    SX.renderFacts(root);

    return { update, prop, units() { update(); } };
  }

  /* ================================================================== 10. view */

  const V = { ready: false };

  function panelHead(eyebrow, title, text, partId) {
    const btn = el('button', { type: 'button', class: 'btn btn-sm btn-ghost', onclick: () => SX.select(partId) }, 'Details');
    return el('div', { class: 'rl-head' },
      el('div', null, el('div', { class: 'eyebrow' }, eyebrow), el('h4', { class: 'h4' }, title), el('p', { html: SX.withFacts(text) })),
      btn);
  }

  function init(mount) {
    const root = el('div', { class: 'rl' });
    mount.appendChild(root);
    const nav = el('nav', { class: 'rl-nav', 'aria-label': 'Engine lab panels' });
    root.appendChild(nav);

    // A
    const pA = el('section', { class: 'rl-panel', id: 'rl-evo', 'aria-labelledby': 'rl-evo-h' });
    pA.appendChild(panelHead('Lab A · Evolution', 'Raptor 1 to Raptor 3, at one scale',
      'In August 2024 SpaceX photographed its three Raptor generations side by side. Most of the difference is what you can no longer see: each version made more thrust from less hardware, and Raptor 3 moved its plumbing, sensors and wiring inside the engine so it needs no heat shield.', 'raptor3.evolution'));
    pA.querySelector('h4').id = 'rl-evo-h';
    root.appendChild(pA);
    const evoState = { ver: 'r3', setVer: null };
    const gA = el('div', { class: 'rl-grid' });
    const gAl = el('div', { style: { minWidth: 0 } }), gAr = el('div', { style: { minWidth: 0 } });
    gA.appendChild(gAl); gA.appendChild(gAr);
    pA.appendChild(gA);
    const evo = buildEvolution(gAl, evoState);
    const evoChart = buildEvoChart(gAr, evoState);
    evoState.setVer = (k) => { evoState.ver = k; evo.setVer(k); evoChart.setVer(k); };
    evoState.setVer('r3');
    buildChanges(pA);

    // B
    const pB = el('section', { class: 'rl-panel', id: 'rl-plume', 'aria-labelledby': 'rl-plume-h' });
    pB.appendChild(panelHead('Lab B · Nozzles and plumes', 'Why the ship carries two kinds of nozzle',
      'A nozzle turns hot, high-pressure gas into speed. How far it should expand that gas depends on the air pressure outside, which falls to almost nothing on the way to orbit. Move the altitude and watch what each nozzle does to its plume and its thrust.', 'raptor3.plume'));
    pB.querySelector('h4').id = 'rl-plume-h';
    root.appendChild(pB);
    const plume = buildPlumePanel(pB);

    // C
    const pC = el('section', { class: 'rl-panel', id: 'rl-phys', 'aria-labelledby': 'rl-phys-h' });
    pC.appendChild(panelHead('Lab C · Physics', 'The rocket equation, on the ship',
      'Delta-v is the total change in velocity a stage can produce. It depends on only two things: how efficiently the engines use propellant (specific impulse) and how much of the ship is propellant (the mass ratio). Starship\'s dry mass is not published, so here it is a slider.', 'raptor3.physics'));
    pC.querySelector('h4').id = 'rl-phys-h';
    root.appendChild(pC);
    const phys = buildPhysics(pC);

    [['Evolution', pA], ['Nozzles and plumes', pB], ['Rocket equation', pC], ['Why methane', phys.prop]].forEach(([t, target]) => {
      nav.appendChild(el('button', { type: 'button', class: 'chip chip-quiet', onclick: () => target.scrollIntoView({ behavior: SX.reducedMotion ? 'auto' : 'smooth', block: 'start' }) }, t));
    });

    // selection and hover highlighting
    const markParts = (id, cls) => mount.querySelectorAll('.part[data-part]').forEach((n) => n.classList.toggle(cls, !!id && n.getAttribute('data-part') === id));
    SX.on('select', (id) => {
      markParts(id, 'is-selected');
      if (id && VER_OF_PART[id]) evoState.setVer(VER_OF_PART[id]);
    });
    SX.on('hover', (id) => markParts(id, 'is-hover'));
    if (SX.selected) markParts(SX.selected, 'is-selected');

    SX.on('units', () => {
      evo.refreshText();
      plume.units();
      phys.units();
    });

    Object.assign(V, { ready: true, pA, pB, pC, evo, plume, phys, evoState });
  }

  function focus(id) {
    if (!V.ready) return;
    const smooth = SX.reducedMotion ? 'auto' : 'smooth';
    let target = null, glow = null, svgGlow = false;
    if (VER_OF_PART[id] || id === 'raptor3.evolution') {
      target = V.pA;
      if (VER_OF_PART[id]) { V.evoState.setVer(VER_OF_PART[id]); glow = V.evo.groups[VER_OF_PART[id]]; svgGlow = true; }
      else glow = V.evo.fig;
    } else if (id === 'raptor3.plume' || id === 'raptor3.nozzle' || id === 'raptor3.rvac') {
      target = V.pB;
      const e = V.plume.noz.engines.find((q) => q.part === id);
      if (e) { glow = e.grp; svgGlow = true; } else glow = V.plume.fig;
    } else if (id === 'raptor3.physics.methane') {
      target = V.phys.prop; glow = V.phys.prop.querySelector('.rl-prop-scroll');
    } else if (id === 'raptor3.physics') {
      target = V.pC; glow = V.pC.querySelector('.rl-eq');
    }
    if (!target) return;
    target.scrollIntoView({ behavior: smooth, block: 'start' });
    setTimeout(() => pulse(glow, svgGlow), SX.reducedMotion ? 0 : 350);
  }

  SX.register(VIEW, {
    title: 'engine lab',
    parts: ['raptor3.evolution', 'raptor3.evolution.r1', 'raptor3.evolution.r2', 'raptor3.plume', 'raptor3.physics', 'raptor3.physics.methane', 'raptor3', 'raptor3.nozzle', 'raptor3.rvac'],
    init,
    focus,
  });
})();
