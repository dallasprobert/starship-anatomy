# Raptor internals: the full-flow staged combustion cycle and component anatomy

Research dossier 02 for the Starship explorer page. Target: Raptor 3 (the engine on Starship V3, first flown on Flight 12, 22 May 2026), with Raptor 2 differences noted. Research date: 2026-09-29.

Confidence legend used throughout:
- **official**: SpaceX, Elon Musk, FAA or other US government documents, NASA.
- **reported**: credible press or named expert outlets (NASASpaceFlight, Everyday Astronaut, Spaceflight Now, Ars Technica, SpaceNews, Teslarati).
- **estimate**: community analysis, photo interpretation, or a number derived here (derivation shown).
- **disputed**: credible sources disagree, or an official number conflicts with another official number.

Source numbers in square brackets refer to the Sources list at the end.

## Key numbers

### Raptor numbers

| quantity | value | unit | version | confidence | source (publisher, date, URL) |
|---|---|---|---|---|---|
| Sea-level thrust, nominal (flight rating) | 250 (551,000 lbf; 2,452 kN) | tf | Raptor 3 sea-level (SL), Starship V3 | official | SpaceX, "Introducing Starship V3", 2026-05-12, https://www.spacex.com/updates#starship-v3 [1] |
| Vacuum-engine thrust, nominal | 275 (606,000 lbf; 2,697 kN) | tf | Raptor 3 Vacuum (RVac) | official | SpaceX, 2026-05-12 [1] |
| Sea-level thrust, spec published at reveal | 280 (2,746 kN) | tf | Raptor 3 SL (Aug 2024) | official | SpaceX on X, 2024-08-03, https://x.com/SpaceX/status/1819772716339339664 [2] |
| Sea-level thrust | 230 (507,000 lbf) | tf | Raptor 2 SL | official | SpaceX, 2026-05-12 [1]; SpaceX on X, 2024-08-03 [2] |
| Vacuum-engine thrust | 258 (568,000 lbf) | tf | Raptor 2 RVac | official | SpaceX, 2026-05-12 [1] |
| Sea-level thrust | 185 | tf | Raptor 1 SL | official | SpaceX on X, 2024-08-03, quoted by NASASpaceFlight 2024-08-09 [2][16] |
| RVac thrust target shown by Musk | 306 | tf | Raptor 3 RVac (April 2024 target) | reported | Musk presentation slide, 2024-04-04, as reported by Ars Technica 2024-04-08 and SpaceNews 2024-04-06 [27] |
| Long-term thrust goal | over 300 (Raptor 3.x, "certainly Raptor 4"); aim over 330 | tf | future | official | Elon Musk on X, 2024-12-31, https://x.com/elonmusk/status/1873986963407344069 [28]; April 2024 presentation [27] |
| Specific impulse listed by SpaceX | 350 | s | Raptor 3 SL (vacuum value of the sea-level engine, see Uncertain) | official (value); estimate (interpretation) | SpaceX on X, 2024-08-03 [2]; Musk on X, 2019-09-09: "Sea level Raptor's vacuum Isp is ~350 sec" [23] |
| Specific impulse listed by SpaceX | 347 | s | Raptor 2 SL (vacuum value) | official | SpaceX graphic 2024-08-03 as reported by SlashGear 2024-09-08 [47] |
| Sea-level specific impulse | 327 | s | Raptor 2 SL | reported | Everyday Astronaut, 2022-07-14 [21] |
| RVac specific impulse target | about 380 | s | RVac (goal) | official | Musk on X, 2019-09-09, https://x.com/elonmusk/status/1171118891671490560 [23] |
| Engine mass | 1,525 | kg | Raptor 3 SL | official | SpaceX, 2026-05-12 [1]; SpaceX on X, 2024-08-03 [2] |
| Engine plus vehicle-side commodities and hardware | 1,720 | kg | Raptor 3 SL | official | SpaceX on X, 2024-08-03 [2] |
| Engine mass | 1,630 | kg | Raptor 2 SL | official | SpaceX, 2026-05-12 [1] |
| Engine mass; engine plus vehicle-side | 2,080; 3,630 | kg | Raptor 1 SL | official | SpaceX on X, 2024-08-03, quoted by NASASpaceFlight 2024-08-09 [16] |
| Vehicle-level mass saving per engine | about 1 | t | V3 vs V2 | official | SpaceX, 2026-05-12 [1] |
| Thrust-to-weight (engine only) | 164 at 250 tf; 184 at 280 tf | ratio | Raptor 3 SL | estimate (derived: 250,000/1,525 and 280,000/1,525) | derived from [1][2] |
| Chamber pressure demonstrated | 350 (at 269 tf) | bar | "Raptor V3" development engine, May 2023 | official | Musk on X, 2023-05-13, https://x.com/elonmusk/status/1657249739925258240 [4] |
| Chamber pressure | 300 | bar | Raptor 2 | reported (Musk via Everyday Astronaut) | Everyday Astronaut, 2022-07-14 [21][22] |
| Chamber pressure | 250 | bar | Raptor 1 | reported | Everyday Astronaut, 2022-07-14 [21] |
| Operational chamber pressure | not published | bar | Raptor 3 flight rating | n/a | (see Uncertain) |
| Injector-face stagnation pressure, nominal | 253 (3,669.5 psia) | bar | 2019 booster Raptor (Raptor 1 era) | official (FAA-filed analysis) | Sierra Engineering for SpaceX, FAA Appendix G, 2019-06-18 [5] |
| Engine mixture ratio (O/F by mass) | 3.60 (78% O2, 22% CH4) | ratio | 2019 booster Raptor | official | FAA Appendix G, 2019-06-18 [5] |
| Nozzle area ratio | 34.34:1, "regeneratively-cooled thrust chamber nozzle" | ratio | 2019 booster Raptor | official | FAA Appendix G [5] |
| Throat radius / diameter | 4.362 in / 0.222 m | in, m | 2019 booster Raptor | official | FAA Appendix G, Table 1 [5] |
| Nozzle exit diameter | 51.226 in (1.30 m) | in, m | 2019 booster Raptor | official | FAA Appendix G, Table 1 [5] |
| Throat-to-exit length | 60.06 in (1.53 m) | in, m | 2019 booster Raptor | official | FAA Appendix G, Table 1 [5] |
| Nozzle wall angles | 32.0 (tangency), 6.0 (lip exit) | degrees | 2019 booster Raptor | official | FAA Appendix G, Table 1 [5] |
| Film cooling | 1.2% of total flow (13.89 lb/s) as fuel-rich gas through 3 slots in the converging section | % | 2019 booster Raptor | official | FAA Appendix G, section 4.0 [5] |
| Characteristic-velocity (C*) efficiency | 98.6 | % | 2019 model of booster Raptor | official (FAA-filed model) | FAA Appendix G [5] |
| Total propellant flow | about 525 (13.89 lb/s divided by 1.2%) | kg/s | 2019 booster Raptor | estimate (derived) | derived from [5] |
| Total propellant flow | about 750 (at 250 tf) to 840 (at 280 tf); LOX about 590 to 660, CH4 about 165 to 180 | kg/s | Raptor 3 SL | estimate (derived: vacuum thrust = sea-level thrust + 101.3 kPa x 1.33 m2 exit area; divided by 350 s x 9.807; split at O/F 3.6; exit area and O/F assumed from 2019 data) | derived from [1][2][5] |
| Engine length and diameter | 3.1 and 1.3 | m | Raptor 1-era figures (2019) | official (dated) | SpaceX Starship page, archived 2019-09-30 [49] |
| Throttle range (demonstrated) | about 90 to 225 tf (about 40% to 100%) | tf | Raptor 1 era (2020) | official | Musk on X, 2020-08-18, https://x.com/elonmusk/status/1295553672454311941 [24] |
| Gimbal range | 15 | degrees | Raptor 2 | reported | Everyday Astronaut, 2022-07-14 [21] |
| Hot oxygen-rich turbopump pressure class | about 800 | atm | design statement, 2018 | official | Musk on X, 2018-06-17, via NextBigFuture 2018-06-22 [25] |
| SX500 alloy capability | over 800 | bar hot oxygen-rich gas | SX500 superalloy | reported | Everyday Astronaut, 2019-05-25 [20] |
| Methane pump discharge | about 886 | bar | Raptor 2 | estimate (community cycle model) | Livingjw and HVM, NASASpaceFlight forum, 2022-02-03 [38] |
| Oxygen pump discharge | about 696 | bar | Raptor 2 | estimate (community) | [38] |
| Fuel-rich preburner | about 611 bar, 860 K | bar, K | Raptor 2 | estimate (community) | [38] |
| Oxygen-rich preburner | about 611 bar, 760 K | bar, K | Raptor 2 | estimate (community) | [38] |
| Fuel-rich gas after turbine | about 342 bar, 808 K | bar, K | Raptor 2 | estimate (community) | [38] |
| Oxygen-rich gas after turbine | about 430 bar, 707 K | bar, K | Raptor 2 | estimate (community) | [38] |
| Turbopump shaft power | FTP about 37 MW; OTP about 31 MW | MW | Raptor 2 | disputed (community model; the OTP figure is questioned as not closing) | [38]; Interesting Engineering++, 2026-09-23 [39] |
| Turbomachinery power of 1 MN subscale demonstrator | 27 | MW | 2016 subscale Raptor | reported | NASASpaceFlight, 2016-10-03 [19] |
| Methalox combustion temperature (typical) | about 3,550 | K | general methalox | reported | Everyday Astronaut, 2019-05-25 [20] |
| Engines produced | more than 600 | engines | all Raptor versions, as of 2025-10-30 | official | SpaceX, "To the Moon and Beyond", 2025-10-30 [9] |
| Accumulated test and flight run time | over 226,000 (Raptor 2); over 40,000 (Raptor 3) | s | as of 2025-10-30 | official | SpaceX, 2025-10-30 [9] |
| Raptor 3 reveal / first flight | SN1 photo 2024-08-02, revealed 2024-08-03; first flight 2026-05-22 (Flight 12) | date | Raptor 3 | official | [2][42][6] |
| Booster engines | 33 Raptor 3; thrust vector control hardware on the inner 13 | count | Super Heavy V3 | official | SpaceX, 2026-05-12 [1] |
| Ship engines | 3 sea-level + 3 RVac | count | Starship V3 | official / reported | SpaceX Flight 12 page [6]; Spaceflight Now, 2026-05-23 [45] |
| Lunar-descent throttle test | 281 | s | Raptor for HLS (Nov 2021) | official | NASA, 2023-09-14 [30] |
| Future vehicle envelope (not V3) | 35 booster + 9 ship engines; booster liftoff thrust up to 103 MN (about 300 tf per engine, derived) | count, MN | future Starship configuration | official (envelope) | Department of the Air Force, CCSFS Final EIS, 2025-11 [29] |

### Cycle comparison (one representative engine per cycle)

| quantity | value | unit | version | confidence | source (publisher, date, URL) |
|---|---|---|---|---|---|
| Full-flow staged combustion (FFSC): Raptor 2 chamber pressure; Isp | 300; 327 s SL, 347 s vac (SL engine) | bar; s | Raptor 2, CH4/LOX | reported / official | [21][47] |
| FFSC: Raptor 3 chamber pressure; Isp | 350 demonstrated; 350 s (vac, SL engine) | bar; s | Raptor 3 | official | [4][2] |
| Gas generator: Merlin 1D chamber pressure; Isp | about 97 (9.7 MPa); 282 s SL, 311 s vac | bar; s | Merlin 1D, RP-1/LOX | reported (Pc); official, dated (Isp) | Everyday Astronaut 2019-05-25 [20]; SpaceX Falcon 9 page (2013) via [36] |
| Oxygen-rich staged: RD-180 chamber pressure; Isp | 256.6 (3,722 psia); 311.3 s SL, 337.8 s vac | bar; s | RD-180, RP-1/LOX | official (manufacturer data as published) | Spaceflight Now, 2002-02-19 [33] |
| Oxygen-rich staged: BE-4 chamber pressure; thrust | about 135; 550,000 lbf SL | bar; lbf | BE-4, LNG/LOX | reported (Pc not published by Blue Origin) | Everyday Astronaut 2019-05-25 [20] |
| Fuel-rich staged: RS-25 chamber pressure; Isp | 206.4 (2,994 psia); 452.3 s vac (366 s SL) | bar; s | RS-25, LH2/LOX | official | L3Harris RS-25 spec sheet, 2024-07 [32] |
| RS-25 pump discharge (for station comparison) | fuel 6,276 psia (433 bar); oxygen 7,268 psia (501 bar); pump power 71,140 hp fuel, 23,260 hp oxygen | psia, hp | RS-25 | official | L3Harris, 2024-07 [32] |
| Expander: RL10B-2 chamber pressure; Isp | 43.6 (633 psi); 465.5 s vac | bar; s | RL10B-2, LH2/LOX | official (NRC report) | National Research Council, 2006 [34] |
| Electric pump: Rutherford chamber pressure; Isp | not published; 311 s SL, 343 s vac | bar; s | Rutherford, RP-1/LOX | reported | Rocket Lab data as compiled by Wikipedia [35] |
| FFSC history: RD-270 chamber pressure; Isp | 26.1 MPa (261 bar); 301 s SL, 322 s vac | bar; s | RD-270, UDMH/N2O4 (never flew) | reported | Energomash data via lpre.de; Harvey 2007 [37] |
| FFSC history: Integrated Powerhead Demonstrator thrust class | about 250,000 | lbf | IPD, LH2/LOX demonstrator (never flew) | official | AFRL/NASA release via Spaceflight Now, 2006-07-20 [31] |

## Explainer

### What Raptor is

Raptor is SpaceX's methane and liquid-oxygen ("methalox") engine. Thirty-three sea-level Raptors power the Super Heavy booster; the Starship upper stage carries three sea-level Raptors and three Raptor Vacuum (RVac) engines with much larger nozzles [1][6]. The current version, Raptor 3, is rated by SpaceX at 250 tonnes-force (tf) at sea level and 275 tf for the vacuum variant, and a sea-level engine weighs 1,525 kg [1]. When SpaceX first revealed Raptor 3 in August 2024 it listed 280 tf and a specific impulse of 350 s [2]; the 2026 figures are the nominal flight rating.

Raptor is the first full-flow staged combustion (FFSC) engine ever to fly. Two earlier FFSC engines were built and fired on test stands but never flew: the Soviet RD-270 (1960s) and the US Integrated Powerhead Demonstrator (mid-2000s) [20][31][37].

### The full-flow idea in one paragraph

Every pump-fed rocket engine needs a turbine to spin its pumps, and the turbine needs hot gas. In a gas-generator engine such as Merlin, a small side stream of propellant is burned to drive the turbine and then dumped overboard, wasting it. In ordinary staged combustion (RD-180, BE-4, RS-25), one propellant plus a little of the other is burned in a "preburner", the hot gas drives the turbine, and then that gas is sent into the main chamber so nothing is wasted. Full-flow goes one step further: there are two preburners. A fuel-rich preburner burns nearly all the methane with a small amount of oxygen and drives the fuel pump; an oxygen-rich preburner burns nearly all the oxygen with a small amount of methane and drives the oxygen pump [20][31]. So essentially all of both propellants passes through a turbine, and both arrive at the main injector already as hot gases.

### Why bother

The US Air Force and NASA summarized the benefits when their IPD reached full power in 2006 [31]: because the whole propellant flow is available to drive the turbines, each turbine can run cooler for the same power, which lengthens turbine life; and because the oxygen pump is driven by oxygen-rich gas and the fuel pump by fuel-rich gas, there is no need for a complex seal on a shaft that has fuel on one side and oxygen on the other. Everyday Astronaut put the seal point plainly: if hot fuel leaks along a shaft seal, "it just comes in contact with more fuel" [20]. A third benefit is combustion: two gases mix and burn far faster and more completely than liquid sprays, which helps a short, compact chamber run at very high pressure. The costs are complexity (two preburners, two turbines, and a hard bootstrapping start where each preburner needs both pumps running) and the oxygen-rich side, which is hot, high-pressure gaseous oxygen that will burn most metals. SpaceX developed its own superalloys, SX300 and then SX500, which Musk described in 2018 as "a modern version of Inconel superalloys" with "extreme oxidation resistance", needed for a "~800 atmosphere, hot, oxygen-rich turbopump" [25]. Methane also helps: it does not leave soot (coke) in a fuel-rich preburner the way kerosene does [20], and the FAA-filed plume analysis predicts no soot from the engine [5].

### The methane path

Subcooled liquid methane leaves the tank and enters the engine at the top, on the fuel-pump side. The fuel turbopump (FTP) raises it to several hundred bar; a community cycle model puts Raptor 2's methane discharge near 886 bar, far above the 300 bar main chamber, because the fuel still has to push through cooling channels, a preburner and a turbine [38]. On Raptor 3 you can see the next step in SpaceX's own photo: a large pipe leaves the fuel pump, loops over the top of the engine and down its side into a ring-shaped manifold around the upper nozzle [42]. From there the methane flows through channels in the walls of the nozzle, throat and chamber, soaking up heat (regenerative cooling) and leaving the jacket warm and in a supercritical, gas-like state. Most of it then feeds the fuel-rich preburner, where a small flow of oxygen burns just enough of it to make hot methane-rich gas (community estimate about 860 K) [38]. That gas spins the FTP turbine and flows on into the main injector. A small share of the warm methane is sent to the oxygen-rich preburner as its fuel, and some is tapped off to pressurize the methane tank [19][38].

### The oxygen path

Liquid oxygen enters at the top center of the engine and goes straight into the oxygen turbopump (OTP), which appears to sit on the engine's centerline [38][42]. A small share of the pumped oxygen goes to the fuel-rich preburner. The rest goes to the oxygen-rich preburner, where a small amount of warm methane is burned in a large excess of oxygen, making hot oxygen-rich gas (community estimate about 760 K) [38]. That gas drives the OTP turbine and then flows directly down into the main injector. Some oxygen is also heated in a heat exchanger to make gaseous oxygen for tank pressurization [19][38].

### Injector, chamber and ignition

At the main injector the fuel-rich gas and oxygen-rich gas meet. Because both are hot, they ignite on contact: Raptor 1 had redundant torch igniters in the main chamber, and Raptor 2 deleted them [21]. Musk discussed swirl injectors in his 2022 Raptor tour [22], but the element design is not published. The main chamber of Raptor 2 runs at about 300 bar [21]; a Raptor 3 development engine reached 350 bar and 269 tf in May 2023, which Musk called "uncharted territory" [4]. SpaceX has not published the operating chamber pressure of the flight-rated Raptor 3.

### Cooling

The whole sea-level thrust chamber, including a 34.34:1 nozzle, is regeneratively cooled by methane (FAA-filed data for the 2019 engine) [5]. That 2019 analysis also modeled 1.2% of engine flow as fuel-rich film coolant injected through three slots just upstream of the throat [5]; by 2022 SpaceX was reported to be trying to remove throat film cooling entirely [21]. Musk once suggested a green tinge in a Raptor flame could be "a bit of copper from the chamber" [26], consistent with a copper-alloy chamber liner (the alloy is not published). RVac carries the same powerhead and chamber with a far larger nozzle extension for higher efficiency in vacuum [19][23].

### Pressures and temperatures along the way

SpaceX has published only the chamber pressure. Everything else in the station table is either Musk's 800-atmosphere design remark [25] or a community estimate [38]. As a cross-check, the Space Shuttle's RS-25 pumps discharge at 433 bar (fuel) and 501 bar (oxygen) for a 206 bar chamber [32]; Raptor's higher chamber pressure implies pump discharges well above RS-25's, which is consistent with the community's 700 to 900 bar range. The key point for the page: preburner and turbine gas temperatures in FFSC are modest (hundreds of kelvin above ambient, well under 1,000 K in the community model) because the heat is spread over the whole flow, while the main chamber runs near 3,500 K [20][38].

### Starting, relighting and shutting down

Before launch the engines are chilled with propellant ("Raptor begins engine chill" is a line in SpaceX's countdown) [6][7]. The turbopumps are then spun up with pressurized gas (a "spin start"), and torch igniters, energized by spark, light each preburner; SpaceX's flight reports have traced relight failures to "torch ignition issues ... caused by thermal conditions local to the igniter" and to "a low-power condition in the igniter system" [10][11]. Once the preburners light, the turbines take over and the engine bootstraps to full power. On Raptor 2 boosters, the outer ring of 20 engines had no steering hardware [18] and was reported to be spun up by ground equipment through the launch mount, so it could not relight [48]. Raptor 3 changes this in practice: on Flight 13 (24 July 2026) the Super Heavy V3 booster flew "the high thrust portion of the boostback burn with all 33 engines" [7]. SpaceX says all Raptor 3 variants have "a redesigned ignition system" and that Starship V3's propulsion redesign enables "a new Raptor startup method" [1]. Starts remain the hardest phase: Flight 12 and Flight 13 both saw incomplete booster relights, and the first Flight 13 attempt ended in an automatic abort at T-0 when some engines did not start [6][7][43][44]. In space, Starship relit a single Raptor on Flight 13 and plans to use one sea-level Raptor for orbit insertion and deorbit burns from Flight 14 [7][8]. SpaceX also ran "cold start" tests on pre-chilled sea-level and vacuum engines to mimic starts after long coasts [9][30].

### Tank pressurization

Starship was designed from the start (2016) to pressurize its tanks "autogenously", with engine heat exchangers turning a little of each propellant into gas that is piped back to its own tank, instead of Falcon 9's helium [19]. Musk described a 2022 booster firing as a test of autogenous pressurization [46], and SpaceX traced the Flight 9 ship loss to a failed diffuser in "the main fuel tank pressurization system" [15]. Where exactly Raptor 3 taps its pressurant gases is not public; it is presumably among the "secondary flow paths" Musk says were internalized [3].

### Steering, control and health

Inner booster engines and ship sea-level engines gimbal; Raptor 2 gimbaled 15 degrees [21]. SpaceX replaced hydraulic steering with electric thrust vector control (TVC) on Super Heavy for Flight 2 and on the ship afterwards [13][14][17]. On V3, TVC hardware sits on the inner 13 booster engines [1]. Raptor 3's "sensors and controllers are now internally integrated and covered by engine thermal protection" [1]. Engine health is an explicit abort criterion for orbital flights [8], and the vehicles tolerate engine-outs: on Flight 12 the ship lost one RVac and still reached its planned trajectory [6].

### Raptor 2 to Raptor 3: what changed and how it looks

Raptor 1 was a "Christmas tree" of external lines and sensors; Raptor 2 deleted and combined much of it, turned flanges into welds and merged valves into "valve plates" [21][22]. Raptor 3 goes further: Musk said SpaceX had to "internalize secondary flow paths and add regenerative cooling for exposed components", so Raptor 3 "doesn't require any heat shield" or fire suppression [3]. The vehicle no longer needs individual engine shrouds, and the booster's CO2 fire suppression system was removed [1]. In photos Raptor 3 looks almost bare: a smooth dark nozzle, a compact chamber, a flat deck, and a tidy powerhead with only a few large pipes [42]. NASASpaceFlight noted a flanged "low-pressure side" on top and a flangeless "high-pressure side" below [16]. The 1,525 kg engine mass excludes vehicle-side hardware such as TVC actuators, which is why the SpaceX figure "engine plus vehicle-side commodities and hardware" (1,720 kg) exists [2].

## Components

Coordinate convention for the 3D model: engine axis vertical, z = 0 at the nozzle exit plane, H = overall height (about 3.1 m for the Raptor 1 era [49]; Raptor 3 height not published). "+x" is the side where the fuel pump volute sits in SpaceX's Raptor 3 SN1 photo [42]; the big coolant supply pipe crosses over to "-x" and runs down that side. Height fractions below are photo-scaled estimates from [42] and carry perspective error of perhaps 10%.

Approximate proportions (estimate unless noted): nozzle exit diameter about 1.3 m (official for the 2019 engine [5]); throat diameter about 0.22 m (official 2019 [5]; about 0.23 to 0.25 m for Raptor 3 by derivation: throat area = vacuum thrust / (chamber pressure x 1.84) with 330 to 350 bar, estimate); bell occupies roughly z = 0 to 0.45 H; throat near 0.5 H; chamber about 0.5 to 0.65 H with an outer diameter roughly 0.35 x the nozzle exit; injector deck about 0.65 to 0.72 H and about 0.6 x the nozzle exit wide; powerhead top about 1.0 H.

1. **id: `lox-inlet`**, Oxygen inlet and top interface.
   - Function: receives liquid oxygen from the vehicle and ties the engine to the vehicle's thrust structure.
   - Detail: In the SN1 photo the top of the engine is a tall capped cylindrical inlet on the centerline over a bolted flange ring (one of the few flanges left) [42]. NASASpaceFlight described Raptor 3's upper part as a "low-pressure side that still has flanges and seals" [16]. The exact gimbal bearing design and where thrust is carried into the vehicle are not published.
   - Position: centerline, z about 0.9 to 1.0 H.
   - Confidence: estimate (photo interpretation).

2. **id: `ch4-inlet`**, Methane inlet.
   - Function: receives liquid methane from the vehicle feed.
   - Detail: A second, smaller capped inlet sits on top of the fuel-pump volute, off the centerline [42]. On Super Heavy V3, methane reaches the engines through a redesigned "fuel transfer tube" roughly the size of a Falcon 9 first stage [1].
   - Position: +x, z about 0.85 to 0.9 H.
   - Confidence: estimate (photo), official for the transfer tube.

3. **id: `otp`**, Oxygen turbopump (OTP).
   - Function: pumps liquid oxygen to very high pressure; driven by an oxygen-rich turbine on the same shaft.
   - Detail: Community cycle models place the OTP on the engine centerline with its oxygen-rich turbine exhausting straight down into the main injector [38]. Musk's 2018 remark about a "~800 atmosphere, hot, oxygen-rich turbopump" is the only official pressure hint [25]. Stage count, impeller type, inducer design and shaft speed are not public. On Flight 2 and Flight 3, loss of oxygen inlet pressure to the OTPs (caused by filter blockage in the vehicle feed) shut engines down [12][13].
   - Specs: discharge about 696 bar (Raptor 2, community estimate [38]); power about 31 MW (community, disputed [39]).
   - Position: centerline, z about 0.75 to 0.95 H.
   - Confidence: estimate for layout; official for the 800 atm class.

4. **id: `opb`**, Oxygen-rich preburner (OPB).
   - Function: burns nearly all the oxygen with a small amount of methane to make the hot gas that drives the OTP turbine.
   - Detail: SpaceX tested the oxygen-rich preburner as a stand-alone component at NASA Stennis in 2015 (NASA photo) [48]. Its hot, high-pressure oxygen-rich gas is the reason for the SX500 alloy [25][20]. It is lit by a spark-energized torch igniter [19][10]. Community estimate for Raptor 2: about 611 bar and 760 K [38]. A 2025 community schematic noted the OPB location was revised and that preburner ignition details are uncertain [41].
   - Position: centerline, between OTP and injector, z about 0.7 to 0.8 H (estimate).
   - Confidence: official that it exists; estimate for position and conditions.

5. **id: `ftp`**, Fuel (methane) turbopump (FTP).
   - Function: pumps liquid methane to the highest pressure in the engine; driven by a fuel-rich turbine.
   - Detail: The prominent scroll-shaped volute on the side of the Raptor 3 powerhead is the fuel pump discharge: a large pipe leaves it and runs to the nozzle cooling manifold [42]. Methane's low density means the fuel pump needs much more pressure rise per kilogram than the oxygen pump; how SpaceX splits that across stages is not public. After Flight 1, SpaceX upgraded methane turbopump and manifold seals to reduce leakage into the engine bay [17].
   - Specs: discharge about 886 bar and about 37 MW (Raptor 2, community estimate [38]).
   - Position: +x, z about 0.75 to 0.88 H.
   - Confidence: estimate (photo plus community model).

6. **id: `fpb`**, Fuel-rich preburner (FPB).
   - Function: burns nearly all the (now warm) methane with a small amount of oxygen to drive the FTP turbine.
   - Detail: Community models place it directly below the FTP turbine [38]. In the Raptor 3 photo, a large ribbed vertical body hangs below the deck under the fuel pump and ends in a rounded dome with small ports; it is a plausible candidate for the fuel-side preburner or its hot-gas path, but SpaceX has not labeled it [42]. Lit by a spark-energized torch igniter.
   - Specs: about 611 bar, about 860 K (Raptor 2, community estimate [38]).
   - Position: +x, hanging from about 0.45 to 0.65 H (photo, interpretation).
   - Confidence: estimate.

7. **id: `turbines`**, Turbines (oxygen-rich and fuel-rich).
   - Function: extract energy from preburner gas to drive the pumps.
   - Detail: FFSC turbines see the full propellant flow, so they can run cooler and at lower pressure ratio than in single-preburner staged combustion [31][20]. The IPD demonstrator also used hydrostatic bearings to avoid wear [31]; Raptor's bearing type is not public. Community estimates of gas leaving the turbines (Raptor 2): fuel-rich about 342 bar and 808 K; oxygen-rich about 430 bar and 707 K [38].
   - Confidence: official for the principle; estimate for numbers.

8. **id: `hot-gas-manifolds`**, Hot-gas manifolds and transfer ducts.
   - Function: carry turbine exhaust gas (fuel-rich and oxygen-rich) into the main injector.
   - Detail: On Raptor 3 much of this is built into the powerhead structure and the flat deck above the chamber; NASASpaceFlight described much of the internal plumbing as "regenerative cooling channels built into the engine's case" [16]. The high pressure of Raptor's "hot gas manifold" was cited as one reason methane leaks were a problem on early boosters [17].
   - Position: deck and powerhead, z about 0.62 to 0.75 H.
   - Confidence: reported / estimate.

9. **id: `main-injector`**, Main injector (gas-gas).
   - Function: mixes the two hot gas streams at the head of the chamber.
   - Detail: Both propellants arrive fully gasified, which speeds mixing and allows a smaller chamber [20]. Musk discussed swirl injectors in 2022 [22]; element count and geometry are not public. There is no main-chamber igniter on Raptor 2 or later: the gases ignite on contact [21].
   - Position: just below the deck, z about 0.62 to 0.66 H.
   - Confidence: reported for gas-gas and no igniter; element type not public.

10. **id: `mcc`**, Main combustion chamber (MCC) and throat.
    - Function: burns the mixture at very high pressure and accelerates it to sonic speed at the throat.
    - Detail: Chamber pressure about 300 bar (Raptor 2) and 350 bar demonstrated on a Raptor 3 development engine [21][4]. Regeneratively cooled by methane flowing through wall channels; the 2019 engine also used 1.2% fuel-rich film cooling through three slots in the converging section [5]. A copper-alloy liner is implied by Musk's 2019 "copper from the chamber" remark [26]. Raptor 2 "opened the throat" to raise thrust, lowering expansion ratio [21].
    - Specs: throat diameter 0.222 m (2019 engine, official [5]).
    - Position: z about 0.48 to 0.65 H.
    - Confidence: official / reported.

11. **id: `nozzle-sl`**, Sea-level nozzle (regeneratively cooled).
    - Function: expands the exhaust to produce thrust at sea level without flow separation.
    - Detail: FAA-filed data describe a 34.34:1 "regeneratively-cooled thrust chamber nozzle", 1.30 m exit diameter, 1.53 m throat-to-exit, 32 degree tangency and 6 degree lip angles (2019 engine) [5]. On Raptor 3 the coolant supply pipe enters a ring manifold around the upper nozzle [42]; whether coolant runs down the bell and back or splits at that manifold is not public (a community model shows a split [38]).
    - Position: z = 0 to about 0.48 H.
    - Confidence: official (2019 geometry); estimate for Raptor 3 routing.

12. **id: `rvac-nozzle`**, RVac nozzle extension.
    - Function: much larger bell for efficiency in vacuum; RVac shares the powerhead and chamber.
    - Detail: Musk: sea-level Raptor's vacuum Isp is about 350 s, "but ~380 sec with larger vacuum-optimized nozzle" [23]. SpaceX planned a 2.4 m RVac exit diameter in 2018 [48]; current RVac 3 exit diameter, expansion ratio and cooling method are not published. RVacs are widely reported to be fixed (no gimbal), and Wikipedia's Starship article says the sea-level engines carry the gimbal actuators [48]; SpaceX has not published this.
    - Specs: 275 tf (Raptor 3 RVac, official [1]); 258 tf (Raptor 2 RVac [1]).
    - Confidence: official for thrust; others not public.

13. **id: `coolant-supply`**, Fuel pump discharge line and regen inlet manifold.
    - Function: carries high-pressure liquid methane from the FTP to the cooling channels.
    - Detail: The single most visible external pipe on Raptor 3: it leaves the FTP volute through a bolted flange, loops over the top at -x and descends to a torus around the upper nozzle [42]. Community models label this the highest-pressure line in the engine (about 886 bar on Raptor 2) [38].
    - Position: from +x at about 0.82 H, over to -x, down to about 0.45 H.
    - Confidence: estimate (photo interpretation).

14. **id: `regen-outlet`**, Regen outlet and preburner fuel supply.
    - Function: collects warmed methane from the chamber jacket and routes it to the FPB, the OPB and the tank-pressurant tap.
    - Detail: Internal on Raptor 3. Community estimate for Raptor 2: about 696 bar at this point [38]. Where the methane leaves the jacket and whether any methane bypasses cooling are uncertain [41].
    - Confidence: estimate.

15. **id: `valves`**, Main valves and valve plates.
    - Function: control flow to preburners and injector; sequence start and shutdown; throttle.
    - Detail: Raptor 2 combined many valves into "valve plates" [21]. A research model of an FFSC engine using Raptor as reference names a main fuel valve, an oxidizer-preburner fuel valve and a fuel-preburner oxidizer valve as the knobs for preburner temperature [see Uncertain]. SpaceX has not published Raptor's valve list. Several small valve and sensor bodies ring the top-center housing in the SN1 photo [42].
    - Confidence: estimate.

16. **id: `igniters`**, Spark-energized torch igniters.
    - Function: light the preburners at start and at every relight.
    - Detail: Raptor uses a spark ignition system designed to allow many relights [19]; Inverse (2019) described "methalox torch igniters, kickstarted by gaseous methane and oxygen combined with big spark plugs" [26]. SpaceX flight reports blamed boostback relight failures on a "low-power condition in the igniter system" (Flight 7) and on "torch ignition issues ... caused by thermal conditions local to the igniter", fixed with insulation (Flight 8) [11][10]. Raptor 3 has "a redesigned ignition system" [1]. Number and exact location of igniters are not public.
    - Confidence: official for existence and failure modes; count not public.

17. **id: `spin-start`**, Spin-start system.
    - Function: spins the turbopumps up with pressurized gas before the preburners take over.
    - Detail: A 2025 US Air Force environmental document defines a "spin test" as chilling the engines and spinning the pumps "to operating speed" without ignition [29]. Raptor 2 booster outer-ring engines were reported to use ground-supplied spin-start gas through the launch mount [48]; booster chines were reported to hold COPVs for spin start [48]. Raptor 3: all 33 booster engines relit for boostback on Flight 13 [7], and V3 has "a new Raptor startup method" [1]. The gas used (helium, nitrogen, or propellant gases) is not confirmed [41][40].
    - Confidence: official for spin tests and relight results; reported or disputed for hardware and gas.

18. **id: `pressurant-hx`**, Autogenous pressurization taps and heat exchanger.
    - Function: make gaseous oxygen and gaseous methane to keep the tanks pressurized as they drain.
    - Detail: Planned from the 2016 design: "heat exchangers to heat methane and oxygen so the ITS can self-pressurize" [19]. Community models put a GOX heat exchanger in the oxygen-rich turbine exhaust region and take GCH4 from warm methane after the cooling jacket [38]. On Raptor 3 the tap-offs are internal; their locations are not public [3][41].
    - Confidence: official that autogenous pressurization is the design; estimate for locations.

19. **id: `tvc`**, Gimbal and electric thrust vector control.
    - Function: points the engine to steer the vehicle.
    - Detail: Electric linear actuators replaced hydraulics on Super Heavy for Flight 2 and on the ship afterward [13][14][17]. Raptor 2 gimbal range 15 degrees [21]. On Super Heavy V3, TVC hardware is on the inner 13 engines only, with added shielding around it [1]. Actuators are vehicle-side hardware and are absent from the SN1 photo [2][42].
    - Confidence: official (introduction and fleet); reported (range).

20. **id: `controller`**, Engine controller, sensors and health monitoring.
    - Function: runs the start, throttle and shutdown sequences and watches engine health.
    - Detail: On Raptor 2 controllers were consolidated into boxes [40]. On Raptor 3, "sensors and controllers are now internally integrated and covered by engine thermal protection" [1]. Engine health is an abort criterion [8], and flight software aborts a launch automatically if engines fail to start (Flight 13 first attempt) [43].
    - Confidence: official.

21. **id: `integrated-channels`**, Internalized secondary flow paths (Raptor 3 signature feature).
    - Function: carry small flows (purges, pressurant, igniter feeds, instrument lines) inside the engine's own walls, where they are cooled, instead of outside.
    - Detail: Musk: SpaceX had to "internalize secondary flow paths and add regenerative cooling for exposed components", so Raptor 3 needs no heat shield or fire suppression [3]. Additive manufacturing (3D metal printing) is central; Musk said Raptor 3 is "way more expensive" than an ideal design "because it still has printed parts" (June 2024, via [48]). Many bolted joints were replaced by single parts or welds [48].
    - Confidence: official.

### Animated schematic: ordered stations

Numbers are Raptor 2 community estimates [38] unless marked; treat them as illustrative. Steps marked "partial" are where public information runs out.

**Methane (fuel) path**
1. Methane tank (subcooled liquid methane) and vehicle feed (booster: fuel transfer tube [1]).
2. Engine methane inlet (top, +x side) [42]. About 4 bar (estimate) [38].
3. FTP pump (inducer and impeller(s); stage count not public) [partial]. Discharge about 886 bar.
4. Fuel pump discharge line with main fuel valve (valve position not public) [partial].
5. Regen inlet manifold around the upper nozzle [42].
6. Cooling channels in nozzle, throat and chamber walls (flow split and direction not public) [partial].
7. Regen outlet: warm, supercritical methane, about 696 bar.
   - Tap A: gaseous methane to the fuel tank (autogenous pressurant) [19][38] [partial on Raptor 3].
   - Tap B: small methane flow to the oxygen-rich preburner (its fuel) [38].
8. Fuel-rich preburner (with a small oxygen flow from the OTP side), about 611 bar, 860 K.
9. FTP turbine.
10. Fuel-rich hot-gas manifold, about 342 bar, 808 K.
11. Main injector, fuel-gas side.
12. Main combustion chamber, 300 bar (Raptor 2, reported [21]); 350 bar demonstrated (Raptor 3 development [4]); about 3,500 K [20].
13. Throat (sonic).
14. Nozzle and exhaust.

**Oxygen path**
1. Oxygen tank (subcooled LOX) and vehicle feed (vehicle-side LOX filters caused OTP inlet-pressure losses on Flights 2 and 3 [12][13]).
2. Engine LOX inlet (top center) [42]. About 4 bar (estimate) [38].
3. OTP pump (inducer and impeller; details not public) [partial]. Discharge about 696 bar (community) versus Musk's "~800 atmosphere" design remark [25].
4. Main oxidizer valve (position not public) [partial].
   - Tap C: small LOX flow to the fuel-rich preburner [38].
   - Tap D: LOX through a heat exchanger to become gaseous oxygen pressurant for the LOX tank [19][38] [partial on Raptor 3].
5. Oxygen-rich preburner (with a small warm-methane flow from the regen outlet), about 611 bar, 760 K.
6. OTP turbine.
7. Oxygen-rich hot gas into the injector, about 430 bar, 707 K.
8. Main injector, oxygen-gas side.
9. Main combustion chamber (shared with the fuel path), throat, nozzle.

**Regenerative cooling loop (for a separate animation layer)**
FTP discharge, then coolant supply line, then regen inlet manifold, then nozzle channels, then throat channels (peak heat flux), then chamber channels, then regen outlet, then preburners. Film-cooling slots just upstream of the throat (2019 engine: 1.2% of flow, fuel-rich gas, 3 slots) [5]; may be reduced or removed on later engines [21].

**Start sequence (illustrative order, not published by SpaceX)**
Chill-in of engine hardware with propellant [6][7]; spin-start gas spins both turbopumps [29]; spark torch igniters light the preburners [19][10]; turbines accelerate and pumps bootstrap; hot gases meet at the main injector and ignite on contact [21]; controller ramps to commanded thrust. Shutdown and throttling are valve-controlled; the sequence is not public.

## Uncertain or conflicting

1. **Raptor 3 thrust: 280 tf or 250 tf.** SpaceX listed 280 tf in August 2024 [2]; SpaceX's May 2026 V3 update gives 250 tf (sea level) and 275 tf (vacuum) as what Raptor 3 "now" produces [1]. Musk's April 2024 slide showed an RVac 3 target of 306 tf [27]. Best reading: 280 tf is demonstrated or design capability; 250 and 275 tf are the current nominal flight ratings. The page should show 250/275 tf as current and 280 tf as demonstrated. Label: disputed (different meanings).
2. **Raptor 3 chamber pressure.** Only the 350 bar test point (May 2023, 269 tf, "Raptor V3") is official [4]. Wikipedia's 330 bar figure is uncited. The flight-rating chamber pressure is not public.
3. **What "specific impulse 350 s" means.** SpaceX's graphic does not say sea level or vacuum [2]. A 34:1 nozzle cannot deliver 350 s at sea level; Musk has said the sea-level engine's vacuum Isp is about 350 s [23]. Raptor 3 sea-level Isp and current RVac Isp are not published (the 380 s RVac figure is a goal).
4. **Raptor 1 baseline numbers.** The 2019 FAA-filed analysis (253 bar, about 525 kg/s derived, 349.6 s) implies about 184 tf in vacuum and about 170 tf at sea level if 349.6 s is a vacuum value; SpaceX lists Raptor 1 at 185 tf [2][5]. The FAA document does not say whether its Isp is sea level or vacuum. Estimate.
5. **Mixture ratio of Raptor 2 and 3.** Only the 2019 value (3.60) is official [5].
6. **Turbopump architecture.** Stage counts, inducers, impeller types, shaft speeds, bearing types and shaft powers are not public. The community's 31 MW OTP figure has been flagged as not closing with the stated flows and pressures [39].
7. **Physical layout.** The OTP-on-centerline and FTP-on-the-side layout is inferred from photos and community models [38][42], not stated by SpaceX. The identity of the ribbed vertical body under the Raptor 3 fuel pump (preburner versus duct) is an interpretation. The 2025 community schematic lists unknowns: methane autogenous source, preburner ignition type, turbines per powerhead, where methane cooling starts and ends, and post-cooling methane conditions [41].
8. **Spin-start gas and hardware.** Helium, nitrogen and propellant gases have all been suggested; a 2025 community schematic switched from helium to nitrogen for Raptor 3 [41][40]. Not confirmed by SpaceX.
9. **Outer-ring relight.** Raptor 2 outer-ring ground spin start is reported, not officially documented [48] (NASASpaceFlight confirms only that the outer-ring "Raptor Boost" engines lacked TVC [18]). SpaceX confirmed all 33 V3 engines ran in the Flight 13 boostback [7], but how the outer 20 are now spun up is not public.
10. **Flight 13 abort details.** Musk said "Some of the engines didn't start" and two Raptors would be replaced [43]; press counted four engines [43][44]; Wikipedia attributes to an earlier version of SpaceX's page a statement that six engines had oxidizer turbopump problems and did not reach flight speeds [48]. The current SpaceX page does not contain that sentence [7]. Treat the turbopump detail as reported.
11. **Injector element type.** Wikipedia says Raptor 2 uses coaxial swirl injectors, citing Musk's 2022 video and a general academic paper on gas-centered swirl coaxial injectors [48][22]; SpaceX has not published the design.
12. **Materials.** SX300 and SX500 are official names [25]; which parts use them (manifolds, turbine housings, OPB) is only partly reported. Copper-alloy chamber liner is implied, not specified [26].
13. **Film cooling and nozzle cooling on Raptor 3.** 2019 film cooling is official [5]; the 2022 goal to remove throat film cooling [21] and its status on Raptor 3 are unknown. RVac nozzle cooling method, expansion ratio and exit diameter are not published for current engines (older figures: 2016 ITS design 200:1 [19]; 2018 plan 2.4 m exit [48]; an 80:1 figure attributed to a 2021 Musk interview appears on Wikipedia but was not verified here).
14. **Dimensions.** 3.1 m length and 1.3 m diameter are Raptor 1-era numbers [49]. Raptor 3 height, chamber diameter and throat size are not published; values in Components are photo-scaled or derived estimates.
15. **Gimbal range and throttle range for Raptor 3.** Not published (15 degrees is Raptor 2 [21]; about 40% minimum thrust is from 2020 [24]).
16. **Valve names.** The valve names used in Components come from an academic equilibrium model of an FFSC engine that used Raptor as a reference (He et al., International Journal of Aerospace Engineering, 2024, https://onlinelibrary.wiley.com/doi/10.1155/2024/7114250), not from SpaceX. Estimate.
17. **Future configurations.** The Air Force EIS envelope (35 booster engines, 9 ship engines, up to 103 MN booster liftoff thrust) describes a future vehicle, not Starship V3 [29].

## Sources

1. SpaceX, "Introducing Starship V3", 2026-05-12, https://www.spacex.com/updates#starship-v3 (text retrieved via SpaceX's public content API).
2. SpaceX on X, "Raptor 3 (sea level variant) Thrust: 280tf Specific impulse: 350s Engine mass: 1525kg Engine + vehicle-side commodities and hardware mass: 1720kg", 2024-08-03, https://x.com/SpaceX/status/1819772716339339664
3. Elon Musk on X, "The amount of work required to simplify the Raptor engine, internalize secondary flow paths and add regenerative cooling for exposed components was staggering...", 2024-08-03, https://x.com/elonmusk/status/1819597689283121225 (also quoted by Tesla Oracle, 2024-08-08, https://www.teslaoracle.com/2024/08/08/raptor-3-starship-engine-is-lighter-less-complicated-but-more-powerful-and-reusable/)
4. Elon Musk on X, "Raptor V3 just achieved 350 bar chamber pressure (269 tons of thrust)...", 2023-05-13, https://x.com/elonmusk/status/1657249739925258240
5. Sierra Engineering and Software for SpaceX, "Exhaust Plume Calculations for SpaceX Raptor Booster Engine", Analysis Report 2019-001b, 2019-06-18, FAA Starship PEA Appendix G, https://www.faa.gov/space/stakeholder_engagement/spacex_starship/media/Appendix_G_Exhaust_Plume_Calculations.pdf (archive: https://web.archive.org/web/20211020054702/https://www.faa.gov/space/stakeholder_engagement/spacex_starship/media/Appendix_G_Exhaust_Plume_Calculations.pdf)
6. SpaceX, "Starship's Twelfth Flight Test" (flight of 2026-05-22), https://www.spacex.com/launches/starship-flight-12
7. SpaceX, "Starship's Thirteenth Flight Test" (flight of 2026-07-24), https://www.spacex.com/launches/starship-flight-13
8. SpaceX, "Starship to Orbit", 2026-09-15, https://www.spacex.com/updates#orbital-starship
9. SpaceX, "To the Moon and Beyond", 2025-10-30, https://www.spacex.com/updates#moon-and-beyond
10. SpaceX, "Fly. Learn. Repeat." (Flight 8 report), 2025-05-22, https://www.spacex.com/updates#flight-8-report
11. SpaceX, "New Year. New Ship. New Lessons." (Flight 7 report), 2025-02-24, https://www.spacex.com/updates#flight-7-report
12. SpaceX, "On the Path to Rapid Reusability" (Flight 3 report), 2024-05-24, https://www.spacex.com/updates#flight-3-report
13. SpaceX, "Building on the Success of Starship's Second Flight Test" (Flight 2 report), 2024-02-26, https://www.spacex.com/updates#flight-2-report
14. SpaceX, "Upgrades Ahead of Starship's Second Flight Test", 2023-09-08, https://www.spacex.com/updates#starship-upgrades
15. SpaceX, "Flight 9 and Ship 36 Report", 2025-08-15, https://www.spacex.com/updates#flight-9-report
16. NASASpaceFlight (Ryan Weber), "Flight 5 and 6 Preparations Underway as SpaceX reveals Raptor 3", 2024-08-09, https://www.nasaspaceflight.com/2024/08/flight-5-6-preparations-raptor-3/
17. NASASpaceFlight, "Starship upgrades ahead of upcoming test flight" (Raptor 2.1 electric TVC, methane seal upgrades), 2023-09, https://www.nasaspaceflight.com/2023/09/starship-upgrades-upcoming-test-flight/
18. NASASpaceFlight (Chris Bergin), "Super Heavy Booster 3 fires up for the first time" (outer-ring Raptor Boost without TVC), 2021-07-19, https://www.nasaspaceflight.com/2021/07/super-heavy-booster-3-fire-up-first/
19. NASASpaceFlight (Alejandro G. Belluscio), "ITS Propulsion: The evolution of the SpaceX Raptor engine", 2016-10-03, https://www.nasaspaceflight.com/2016/10/its-propulsion-evolution-raptor-engine/
20. Everyday Astronaut (Tim Dodd), "Is SpaceX's Raptor engine the king of rocket engines?", 2019-05-25, https://everydayastronaut.com/raptor-engine/
21. Everyday Astronaut (Trevor Sesnic), "Raptor 1 vs Raptor 2: What did SpaceX change?", 2022-07-14, https://everydayastronaut.com/spacex-raptor-engine-comparison/
22. Everyday Astronaut (Tim Dodd) with Elon Musk, "Elon Musk Explains SpaceX's Raptor Engine!" (video), 2022-07-09, https://www.youtube.com/watch?v=E7MQb9Y4FAE ; coverage: Teslarati (Johnna Crider), 2022-07-09, https://www.teslarati.com/elon-musk-detailed-tour-spacex-raptor-2/
23. Elon Musk on X, "Sea level Raptor's vacuum Isp is ~350 sec, but ~380 sec with larger vacuum-optimized nozzle", 2019-09-09, https://x.com/elonmusk/status/1171118891671490560
24. Elon Musk on X, "Max demonstrated Raptor thrust is ~225 tons & min is ~90 tons...", 2020-08-18, https://x.com/elonmusk/status/1295553672454311941
25. NextBigFuture, "SpaceX will use superalloys for Raptor engines" (quoting Musk on X, 2018-06-17: SX 300 and SX 500, "~800 atmosphere, hot, oxygen-rich turbopump"), 2018-06-22, https://www.nextbigfuture.com/2018/06/spacex-will-use-superalloys-for-raptor-engines.html
26. Inverse, "Watch Elon Musk fire the Starship Raptor engine for the first time", 2019-02-04, https://www.inverse.com/article/52989-spacex-watch-elon-musk-fire-the-starship-raptor-engine-for-the-first-time
27. Ars Technica (Eric Berger), "Elon Musk just gave another Mars speech; this time the vision seems tangible", 2024-04-08, https://arstechnica.com/space/2024/04/elon-musk-just-gave-another-mars-speech-this-time-the-vision-seems-tangible/ ; SpaceNews (Jeff Foust), "Musk outlines plans to increase Starship launch rate and performance", 2024-04-06, https://spacenews.com/musk-outlines-plans-to-increase-starship-launch-rate-and-performance/ (thrust figures are on a presentation slide; not read directly here)
28. Elon Musk on X, "When Raptor reaches 300 tons of thrust at liftoff, which Raptor 3.x can probably do (certainly Raptor 4 will)...", 2024-12-31, https://x.com/elonmusk/status/1873986963407344069
29. Department of the Air Force, "SpaceX Starship-Super Heavy Cape Canaveral Space Force Station Final Environmental Impact Statement", 2025-11, https://spaceforcestarshipeis.com/wp-content/uploads/2025/11/SpaceX_Starship-SuperHeavy_CCSFS_Final_EIS_508.pdf
30. NASA, "SpaceX Completes Engine Tests for NASA's Artemis III Moon Lander", 2023-09-14, https://www.nasa.gov/blogs/missions/2023/09/14/spacex-completes-engine-tests-for-nasas-artemis-iii-moon-lander
31. Spaceflight Now (AFRL/NASA release), "Integrated Powerhead Demonstrator reaches mainstage", 2006-07-20, https://spaceflightnow.com/news/n0607/20ipd/
32. L3Harris, "RS-25 Propulsion System" specification sheet, 2024-07, https://l3harris.com/sites/default/files/2024-07/l3harris-ar-rs-25-spec-sheet.pdf
33. Spaceflight Now, "The RD-180 engine", 2002-02-19, https://spaceflightnow.com/atlas/ac204/020219rd180.html
34. National Research Council, "A Review of United States Air Force and Department of Defense Aerospace Propulsion Needs", 2006, https://www.nationalacademies.org/read/11780/chapter/13
35. Rutherford figures (Rocket Lab data as compiled by Wikipedia, used as a pointer), https://en.wikipedia.org/wiki/Rutherford_(rocket_engine)
36. Merlin 1D figures: SpaceX Falcon 9 Merlin page (archived 2013) and Aviation Week (2011-08-11) as cited by Wikipedia (pointer), https://en.wikipedia.org/wiki/Merlin_(rocket_engine)
37. RD-270: B. Harvey, "Soviet and Russian Lunar Exploration", Springer-Praxis, 2007 (27 firings on 22 engines, 1967 to 1969); Energomash data via lpre.de, http://www.lpre.de/energomash/RD-270/index.htm ; pointer: https://en.wikipedia.org/wiki/RD-270
38. Livingjw and HVM (NASASpaceFlight forum), "Raptor 2 schematic and cycle estimates" (CC BY-SA 4.0), 2022-02-03, https://commons.wikimedia.org/wiki/File:Raptor_2_Full_Flow_Staged_Combustion_Cycle_Estimate.svg
39. Interesting Engineering++ (Substack), "Tuning Dials On The Raptor", 2026-09-23, https://interestingengineering.substack.com/p/tuning-dials-on-the-raptor
40. Construction Physics (Brian Potter), "How SpaceX Streamlined the Raptor Engine", 2026-09-17, https://www.construction-physics.com/p/how-spacex-streamlined-the-raptor
41. Fred Beltzer Jr. (LinkedIn), "SpaceX Raptor 3 schematic" update post, 2025-01-11, https://www.linkedin.com/posts/fbeltzer_spacex-raptor-3-schematic-the-oxygen-preburner-activity-7283874273444691968-MsEA
42. SpaceX, official photo of Raptor 3 SN1 at McGregor, taken 2024-08-02 (used in [1]), https://sxcontent9668.azureedge.us/cms-assets/assets/Raptor_V3_Mc_G_20240802_1w3a8289_daa3a51ef3.jpg
43. Teslarati, "SpaceX Starship Flight 13 aborted at zero and Musk just told us what broke", 2026-07-16, https://www.teslarati.com/spacex-starship-flight-13-reason-why-aborted/
44. Spaceflight Now, "Super Heavy-Starship rocket chalks up mostly successful test flight", 2026-07-25, https://spaceflightnow.com/2026/07/25/super-heavy-starship-rocket-chalks-up-mostly-successful-test-flight/
45. Spaceflight Now, "Musk praises 'epic' Super Heavy-Starship launch", 2026-05-23, https://spaceflightnow.com/2026/05/23/musk-praises-epic-super-heavy-starship-launch/
46. Scanalyst (John Walker), quoting Musk on X, 2022-08-11: "About to attempt long duration engine firing to test autogenous pressurization", https://scanalyst.fourmilab.ch/t/spacex-super-heavy-booster-single-engine-static-fire-test/1827
47. SlashGear, "Everything We Know About SpaceX's New Raptor 3 Engine" (Raptor 1: 185 tf, 350 s, 2,080 kg; Raptor 2: 230 tf, 347 s, 1,630 kg, from SpaceX's graphic), 2024-09-08, https://www.slashgear.com/1658725/space-x-raptor-3-engine-details-everything-we-know/
48. Wikipedia, used only as a pointer to underlying sources: "SpaceX Raptor", https://en.wikipedia.org/wiki/SpaceX_Raptor ; "SpaceX Super Heavy", https://en.wikipedia.org/wiki/SpaceX_Super_Heavy ; "SpaceX Starship (spacecraft)", https://en.wikipedia.org/wiki/SpaceX_Starship_(spacecraft) ; "Starship flight test 13", https://en.wikipedia.org/wiki/Starship_flight_test_13 ; NASA Stennis photo of the Raptor oxygen preburner test (2015), https://commons.wikimedia.org/wiki/File:SpaceX%27s_Raptor_oxygen_preburner_testing_at_Stennis_(2015).jpg
49. SpaceX, Starship page (archived 2019-09-30; Raptor length 3.1 m, diameter 1.3 m), https://web.archive.org/web/20190930163150/https://www.spacex.com/starship
