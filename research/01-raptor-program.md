# 01 Raptor program: performance, evolution and status (focus: Raptor 3)

Compiled 2026-09-29 for the Starship Anatomy page. Scope: the Raptor engine family (Raptor 1, Raptor 2, Raptor 3, Raptor Vacuum 2 and 3, and the announced Raptor 4 / V4 goals), with the main focus on Raptor 3 as flown on Starship V3.

Confidence levels used throughout:

- **official**: SpaceX (website updates, launch pages, X posts, SEC filings), Elon Musk posts, FAA, NASA.
- **reported**: credible press (NASASpaceflight, Spaceflight Now, SpaceNews, Ars Technica, Teslarati, Everyday Astronaut) or an official statement known only through press.
- **estimate**: derived by calculation (math shown) or from community tracking.
- **disputed**: credible sources disagree, or an official number is ambiguous.

Source numbers in brackets, for example [S3], refer to the Sources list at the end.

## Key numbers

Units: tf = tonnes-force (1 tf = 9.80665 kN = 2,204.6 lbf). kN conversions are computed from the published tf value unless SpaceX published kN or lbf itself.

| Quantity | Value | Unit | Version | Confidence | Source (publisher, date, URL) |
|---|---|---|---|---|---|
| Sea-level thrust, flight rating on Starship V3 | 250 (2,452 kN; 551,000 lbf) | tf | Raptor 3 sea level | official | [S3] SpaceX, "Introducing Starship V3", 2026-05-12, https://www.spacex.com/updates#starship-v3 |
| Sea-level thrust, demonstrated in ground test | 280 (2,746 kN) | tf | Raptor 3 sea level | official | [S1] SpaceX on X, 2024-08-03, https://x.com/SpaceX/status/1819772716339339664 |
| Stated in-flight goal for sea-level engine | 280 (starting at 250) | tf | Raptor 3 sea level | reported | [S24] NASASpaceflight, 2026-05-20/22, https://www.nasaspaceflight.com/2026/05/starship-flight-12-block-3-pad-2/ |
| Vacuum thrust, flight rating | 275 (2,697 kN; 606,000 lbf) | tf | Raptor Vacuum 3 | official | [S3] SpaceX, 2026-05-12 |
| Vacuum thrust, 2024 target shown by Musk | 306 (3,001 kN) | tf | Raptor Vacuum 3 (target) | reported | [S43] Ars Technica, 2024-04-08 (SpaceX slide); [S47] Wikipedia pointer citing Ars and SpaceNews |
| Sea-level thrust | 230 (2,256 kN; 507,000 lbf) | tf | Raptor 2 sea level | official | [S2] SpaceX on X, 2024-08-03, https://x.com/SpaceX/status/1819795288116330594 ; [S3] |
| Vacuum thrust | 258 (2,530 kN; 568,000 lbf) | tf | Raptor Vacuum 2 | official | [S3] SpaceX, 2026-05-12 ("up from 258 tf") |
| Sea-level thrust | 185 (1,814 kN) | tf | Raptor 1 sea level | official | [S2] SpaceX on X, 2024-08-03 |
| Vacuum thrust | 200 (1,961 kN) | tf | Raptor Vacuum 1 | reported | [S43] Ars Technica, 2024-04-08 (Musk slide); [S47] |
| Long-term sea-level thrust ambition | more than 330 | tf | future Raptor | reported | [S42] Drive Tesla Canada, 2024-04-08 (Musk Starbase talk, early April 2024) |
| V4 stretch goal per engine | 300 (33 engines, about 10,000 tf total) | tf | Starship V4 (engine often called "Raptor 4") | official | [S16] Elon Musk on X, 2026-01-23, https://x.com/elonmusk/status/2014749076672184631 |
| Chamber pressure reached in test | 350 (at 269 tf) | bar | "Raptor V3" development engine | official | [S14] Elon Musk on X, 2023-05-13 UTC, https://x.com/elonmusk/status/1657249739925258240 |
| Chamber pressure, flight-rated | not published | bar | Raptor 3 | n/a | none; see Uncertain section |
| Chamber pressure | about 300 | bar | Raptor 2 | reported | [S37] Everyday Astronaut, 2022-07-14, https://everydayastronaut.com/spacex-raptor-engine-comparison/ |
| Chamber pressure, nominal (injector face) | 3,669.5 psia (253 bar) | psia | Raptor 1 era (2019) | official | [S17] FAA / Sierra Engineering, 2019-06-18 (archived) |
| Chamber pressure design goal | 250 | bar | Raptor 1 | official | [S54] Musk, IAC 2017 talk, 2017-09-29 |
| Specific impulse as listed by SpaceX (not labeled SL or vacuum) | 350 / 347 / 350 | s | Raptor 1 / Raptor 2 / Raptor 3 sea-level variants | disputed | [S1], [S2] SpaceX on X, 2024-08-03 |
| Vacuum Isp of sea-level engine; Isp with vacuum nozzle | about 350; about 380 | s | Raptor (2019 statement, applies generically) | official | [S15] Elon Musk on X, 2019-09-09, https://twitter.com/elonmusk/status/1171118891671490560 |
| Sea-level Isp | about 330 / 327 | s | Raptor 1 / Raptor 2 | reported | [S37] Everyday Astronaut, 2022-07-14 |
| Sea-level Isp at sea level | not published | s | Raptor 3 | n/a | none |
| Engine mass | 1,525 | kg | Raptor 3 sea level | official | [S1]; [S3] |
| Engine mass | 1,630 | kg | Raptor 2 sea level | official | [S2]; [S3] |
| Engine mass | 2,080 | kg | Raptor 1 sea level | official | [S2] |
| Engine + vehicle-side commodities and hardware | 1,720 | kg | Raptor 3 | official | [S1] |
| Engine + vehicle-side commodities and hardware | 2,875 | kg | Raptor 2 | official | [S2] |
| Engine + vehicle-side commodities and hardware | 3,630 | kg | Raptor 1 | official | [S2] |
| Vehicle-side mass attributable to each engine (derived) | 1,550 / 1,245 / 195 | kg | R1 / R2 / R3 | estimate | derived from [S1],[S2]: 3,630-2,080; 2,875-1,630; 1,720-1,525 |
| Vehicle-level mass saving per engine, R2 to R3 | about 1 (derived: 2,875 - 1,720 = 1,155 kg) | t | Raptor 3 | official (SpaceX "approximately 1 ton"); derived value estimate | [S3]; derived from [S1],[S2] |
| Mass saved per V3 stack (39 engines), R2 to R3 | about 45 | t | V3 stack | estimate | derived: 1,155 kg x 39 |
| Engine mass of Raptor Vacuum 3 | not published | kg | RVac 3 | n/a | none |
| Thrust-to-weight (engine only) | 163.9 at 250 tf; 183.6 at 280 tf | ratio | Raptor 3 | estimate | derived: 250/1.525; 280/1.525 from [S1],[S3] |
| Thrust-to-weight (engine only) | 141.1 | ratio | Raptor 2 | estimate | derived: 230/1.630 |
| Thrust-to-weight (engine only) | 88.9 | ratio | Raptor 1 | estimate | derived: 185/2.080 |
| Thrust-to-weight including vehicle-side hardware | 51.0 / 80.0 / 145.3 (at 250 tf) / 162.8 (at 280 tf) | ratio | R1 / R2 / R3 | estimate | derived from [S1],[S2] |
| Mixture ratio O/F (by mass) | 3.60 ("somewhat fuel-rich") | ratio | Raptor (2019 FAA analysis) | official | [S17] FAA / Sierra Engineering, 2019-06-18 |
| Mixture ratio | not published | ratio | Raptor 3 | n/a | none |
| Throttle range | about 90 to 225 tf, i.e. roughly 40% to 100% | tf | Raptor 1 era (2020) | official (Musk), via pointer | [S51] Musk on X, 2020-08-17, as cited in [S47] |
| Throttle range | not published | % | Raptor 3 | n/a | none (SpaceX did publish a lunar-landing throttle test, [S4]) |
| Nozzle expansion ratio | 34.34:1 (regeneratively cooled) | ratio | sea-level Raptor (2019) | official | [S17] |
| Nozzle expansion ratio | about 80 | ratio | Raptor Vacuum (2021 statement) | reported | [S40] Everyday Astronaut, Starbase tour part 2, 2021-08-07 |
| Nozzle exit diameter | 1.3 (sea level); 2.4 (vacuum) | m | 2018 design statements | reported | [S50] NASASpaceflight, 2018-08-09 |
| Engine height x diameter | 3.1 x 1.3 | m | Raptor (SpaceX Starship page, Raptor 2 era) | reported | [S47] pointer to SpaceX Starship page; not re-verified for Raptor 3 |
| Gimbal range | about 15 | deg | gimbaling Raptor 1 and 2 | reported | [S37] Everyday Astronaut, 2022-07-14 |
| Engines with thrust vector control on V3 booster | inner 13 (outer 20 fixed, inferred) | count | Super Heavy V3 | official (inner 13); inference for outer 20 | [S3] |
| TVC actuation | electric (replaced hydraulic) | n/a | Super Heavy from Flight 2; Ship from Flight 3 | official | [S11] 2023-09-08; [S9b] SpaceX Flight 2 report, 2024-02-26 |
| First in-space Raptor relight | about 1 s burn, 2024-11-19 | date | Raptor 2, Flight 6 | reported | [S57] NASASpaceflight, 2024-11-18/19 |
| First in-space relight of a Raptor 3 | 2026-07-24 | date | Raptor 3, Flight 13 (Ship 40) | official | [S7]; [S13] |
| First orbit insertion and deorbit burns | 2026-09-28 (single sea-level Raptor each) | date | Raptor 3, Flight 14 (Ship 41) | official | [S8] |
| Orbit insertion burn duration | about 19 | s | Raptor 3, Flight 14 | reported | [S36] Teslarati, 2026-09-28 |
| Engines per Super Heavy | 33 | count | V1 to V3 | official | [S12] S-1, 2026-05-20 |
| Engines per Starship upper stage | 6 (3 sea level + 3 vacuum) | count | V1 to V3 | official | [S12] |
| V3 liftoff thrust (33 x 250 tf) | 8,250 tf (80.9 MN; 18.2 million lbf) | tf | V3 at flight rating | estimate | derived; consistent with "up to 18 million pounds" in [S33] Spaceflight Now, 2026-05-23 |
| FAA-analyzed envelope for LC-39A | up to 35 booster engines, 9 ship engines, 103 MN max liftoff thrust, about 28 MN ship thrust | mixed | future configuration (V4-class) | official | [S18] FAA Final EIS, LC-39A, January 2026 |
| Implied average thrust per engine in that envelope | about 300 | tf | derived | estimate | derived: 103 MN / 35 / 9.80665 |
| Estimated propellant flow per engine at 250 tf | about 715 to 760 (LOX about 560 to 595; CH4 about 155 to 165) | kg/s | Raptor 3 | estimate | derived: mdot = F / (Isp x g0) with assumed Isp 330 to 350 s and O/F 3.6 |
| Raptor engines produced (all versions) | 600 or more (SpaceX wording: "more than three dozen Starships and 600 Raptor rocket engines") | count | program, as of 2025-10-30 | official | [S4] SpaceX, 2025-10-30, https://www.spacex.com/updates#moon-and-beyond |
| Cumulative engine run time | more than 226,000 (Raptor 2); more than 40,000 (Raptor 3) | s | as of 2025-10-30 | official | [S4] |
| Raptor 2 engines built | at least 569 | count | as of August 2024 | reported | [S20] NASASpaceflight, 2024-08-09 |
| Raptor 3 engines flown | 117 | count | Flights 12 to 14 | estimate | derived: 3 flights x 39 engines, no engine known to have flown twice (B20 carried 10 engines that had earlier been installed on B19 for a static fire only, [S26]) |
| Longest single Raptor 3 test burn reported | 354 | s | Raptor 3 | reported | [S23] NASASpaceflight, 2025-09-16 |
| McGregor test stands | 15 (with dedicated vertical Raptor stands) | count | 2026 | official | [S12] S-1, 2026-05-20 |
| Production goal, second Raptor factory | 800 to 1,000 per year (2 to 4 per day) | engines | announced 2021 | official (Musk), via press | [S44] KWTX, 2021-07-11 |
| Cost target (2019) | under 250,000 per engine, up to 500 per year | USD | Raptor (2019 goal) | reported | [S47] pointer to the SpaceX Starship page (goal no longer shown there) |
| Cost target, "LEET" concept | under 1,000 per tf of thrust | USD/tf | future engine concept | reported | [S56] Isaacson biography, 2023, via [S47] |
| Raptor 2 cost vs Raptor 1 | about half | ratio | Raptor 2 | reported | [S55] NASASpaceflight, 2022-02-11 (Musk quote) |
| Oxygen: normal boiling point / triple point | 90.19 / 54.36 | K | physical constant | official | [S45] NIST Chemistry WebBook |
| Methane: normal boiling point / triple point | 111.67 / 90.69 | K | physical constant | official | [S46] NIST Chemistry WebBook |
| Starship propellant loading temperatures | not published | K | V3 | n/a | none |

## Explainer

### What Raptor is

Raptor is SpaceX's family of methane and oxygen ("methalox") rocket engines built for Starship. Every Starship V3 stack flies 39 of them: 33 on the Super Heavy booster and six on the Starship upper stage (three sea-level engines and three Raptor Vacuum engines with large nozzles) [S12]. Raptor uses the full-flow staged combustion cycle. Before Raptor, only two full-flow designs had reached a test stand, and none had flown [S38, S47].

In a gas-generator engine such as SpaceX's Merlin, a little propellant is burned to spin the turbopumps and then dumped overboard, wasting performance. In a full-flow engine nothing is dumped. Each of the two turbopumps has its own preburner. One burns all of the methane with a little oxygen, making hot fuel-rich gas that drives the methane pump's turbine. The other burns all of the oxygen with a little methane, making hot oxygen-rich gas that drives the oxygen pump's turbine [S38]. Both gas streams then enter the main combustion chamber, already gaseous, and burn completely. Because the whole propellant flow drives the turbines, they can run cooler for the same pump power, which helps engine life, and the two propellants sit on separate shafts, so no seal between them is needed [S38]. Gas-gas mixing also burns quickly, allowing a compact chamber.

The cost is an oxygen-rich turbine: hot, high-pressure oxygen attacks most metals. SpaceX developed in-house superalloys (SX300, then SX500) for these parts, reported as able to contain hot oxygen-rich gas at about 800 bar [S38, S47].

### Why methane and oxygen

- **Mars.** Both can be made on Mars from atmospheric carbon dioxide and water ice: electrolysis splits water into hydrogen and oxygen, and the Sabatier reaction (CO2 + 4 H2 gives CH4 + 2 H2O) makes methane [S31]. Kerosene cannot practically be made there, and hydrogen is hard to store [S31].
- **Reuse.** Kerosene leaves soot and carbon deposits ("coking") in engines; methane burns much cleaner, so less cleaning between flights [S31].
- **Density.** Methalox is far denser than the hydrogen-oxygen combination, so stages stay compact, and its specific impulse sits between kerosene and hydrogen [S31].
- **Cost and handling.** Methane is cheap, and liquid methane (boils near 112 K) and liquid oxygen (near 90 K) have similar temperatures, which makes a shared tank bulkhead easier [S31, S45, S46].

Raptor is designed for subcooled ("densified") propellants, chilled well below their boiling points. Colder propellant is denser, so more fits in a tank, and it gives the pumps more margin against cavitation [S47]. SpaceX has not published Starship's loading temperatures; the floor is set by the freezing points (oxygen 54.4 K, methane 90.7 K) [S45, S46].

### Reading the numbers correctly

Thrust is quoted in tonnes-force (tf): 1 tf is the weight of one metric tonne, 9.81 kN. Sea-level engines are rated at sea level and Raptor Vacuum in vacuum, so the two are not directly comparable. Specific impulse (Isp) also differs between sea level and vacuum. SpaceX's August 2024 comparison listed 350 s, 347 s and 350 s for Raptor 1, 2 and 3 without saying which condition applies [S1, S2]. Musk had said a sea-level Raptor achieves about 350 s in vacuum and a vacuum-nozzle Raptor about 380 s [S15], while reporting put sea-level Isp near 327 to 330 s [S37]. The SpaceX figures most likely describe vacuum Isp of the sea-level engines, but treat them as ambiguous.

The most common error in coverage is the Raptor 3 thrust. The 280 tf figure was demonstrated on the test stand in 2024 [S1]. For flight on Starship V3, SpaceX rates Raptor 3 at 250 tf (sea level) and 275 tf (vacuum) [S3], with 280 tf described as the goal [S24].

### From Raptor 1 to Raptor 2

Raptor 1 powered the suborbital test flights and vehicles up to Booster 4 and Ship 20: 185 tf, 2,080 kg, about 250 bar [S2, S17, S20]. It was a development engine wrapped in sensors, plumbing and flanges, and needed a heat shield and shrouds. Raptor 2 (2022) was a near-complete redesign: new turbomachinery, chamber, nozzle and electronics, many flanges turned into welds, no main-chamber torch igniter, much less external plumbing [S37, S47]. It ran near 300 bar, made 230 tf, weighed 1,630 kg and, per Musk, cost about half as much [S37, S55]. On Super Heavy V1 and V2 the outer 20 engines were a fixed "Raptor Boost" variant started with ground-supplied gas [S47, S55]. Raptor 2 flew on Flights 1 to 11 (April 2023 to October 2025), including the first booster catch, the first reflown Raptor (Flight 7) and the first in-space relight (Flight 6) [S47, S57]. Its failures (oxygen filter blockages, igniter problems, a center-engine failure on Flight 8) fed directly into Raptor 3 [S9, S9b, S10].

### What changed in Raptor 3, and why

SpaceX revealed Raptor 3 SN1 in August 2024 with a side-by-side photo of all three generations; Raptor 3 looks almost bare [S1, S2, S20]. The main changes, as stated by SpaceX or reported:

1. **No heat shield or shrouds.** Raptor 1 and 2 needed shielding because their external pipes, wiring and sensors could not survive the heat of neighboring plumes and reentry. Raptor 3 moves most plumbing and sensing into the engine structure, where the engine's own regenerative cooling protects it [S20, S47]. SpaceX: sensors and controllers are now integrated inside the engine under its thermal protection, eliminating individual shrouds on both stages [S3].
2. **Integrated secondary flow paths.** The small streams for cooling, purges, valve actuation, tap-offs and instrumentation now run through passages built into the engine's housings rather than external tubes, which reporting credits to additive manufacturing [S20, S48, S49]. Musk's summary: simple outside, complicated inside [S41].
3. **Fewer flanges and bolted joints.** Many bolted joints became single parts or welds, removing leak paths and mass at the cost of serviceability [S41, S47]. SpaceX tied this to reliability: after Flight 7 it said Raptor 3 would shrink the ship's aft "attic" and eliminate most joints that can leak into it, and after Flight 8 that it would address that failure mechanism [S9, S10].
4. **More thrust from higher pressure.** A development "Raptor V3" reached 350 bar and 269 tf in May 2023 [S14]; SN1 was listed at 280 tf in August 2024 [S1].
5. **Much less vehicle mass.** The engine went from 1,630 kg to 1,525 kg, but engine plus vehicle-side hardware fell from 2,875 kg to 1,720 kg, about 1.15 t per engine (SpaceX: about 1 ton) [S1, S2, S3], roughly 45 t per 39-engine stack (estimate).
6. **New ignition and start.** SpaceX says all variants use a redesigned ignition system and that V3 enables a new startup method [S3]. NSF reports acoustic (resonance) igniters with no spark or moving parts, and turbopump spin-up with gaseous oxygen and methane instead of helium or nitrogen, stored in onboard pressure vessels [S24, S39, S59].
7. **Every booster engine restarts.** V3's redesigned fuel transfer tube lets all 33 engines start together, and the booster now flies 33-engine boostback burns [S3, S7]. Thrust vector control remains on the inner 13 [S3].

### Materials and manufacturing

SpaceX builds Raptor in Hawthorne, California, and qualifies, acceptance-tests and post-flight-tests it at McGregor, Texas, which has 15 test stands including dedicated vertical Raptor stands [S12]. Musk announced a second Raptor factory at McGregor in 2021, aiming at 800 to 1,000 engines per year [S44]; the 2026 S-1 lists Raptor manufacturing only at Hawthorne [S12]. Known materials and methods: SX300 and SX500 superalloys for oxygen-rich hot-gas parts [S38, S47]; a regeneratively cooled chamber and nozzle, with methane flowing through wall channels before it burns [S17]; and extensive metal 3D printing [S48]. A copper-alloy chamber liner is widely reported and fits the thermal loads (Musk said in 2023 the chamber wall might have the highest heat flux of anything ever made [S58]), but SpaceX has not named the alloy. Cost targets have been under 250,000 USD per engine and, for the "LEET" concept, under 1,000 USD per tf [S47, S56]; in June 2024 Musk said Raptor 3 is still far more expensive than that because it uses printed parts [S41, S47]. Actual unit cost is not public.

### Raptor Vacuum

Raptor Vacuum shares the powerhead with the sea-level engine but adds a much larger nozzle for efficiency in space (about 380 s Isp per Musk) [S15]. The three RVacs are fixed; the three sea-level engines gimbal for steering and landing [S47]. RVac 3 is rated at 275 tf [S3]; its mass, dimensions and expansion ratio are unpublished. On V3 their tops sit slightly recessed into the ship's LOX tank [S60]. RVac 3 hardware lagged the sea-level engine through 2025 [S21].

### Raptor 3 on the ground

Musk reported a "Raptor V3" at 350 bar in May 2023 [S14]. Raptor 3 SN1 was revealed and fired at McGregor in early August 2024 [S1, S20]. By August 2025 test tempo reached two dozen Raptor firings a week, with Raptor 3 burns of 201 s and a 13-start relight test [S21]; in September 2025 a Raptor 3 ran 354 s, while another ended in an explosive shutdown after 40 s [S23]. By October 2025 Raptor 3 had logged more than 40,000 s, and SpaceX had run throttle and cold-start tests relevant to lunar landing [S4]. In December 2025 SpaceX showed a Raptor 3 simulating a V3 ship ascent burn [S52].

### Raptor 3 in flight

- **Flight 12, 2026-05-22 (Booster 19, Ship 39).** One booster engine shut down on ascent. The boostback failed when several engines did not relight, with an energetic event, and the booster was lost [S6, S24, S25]. The ship lost one Raptor Vacuum shortly after staging, still reached its planned trajectory, skipped its in-space relight and landed on two engines [S6, S25]. The FAA cited heat effects on propulsion components and erroneous engine alarm settings as most probable causes [S19].
- **Flight 13, 2026-07-24 (Booster 20, Ship 40).** A 2026-07-16 attempt aborted at T-0 when four engines failed to start (SpaceX: oxidizer turbopump issues) [S28]. In flight, all 33 engines ran through ascent and all 33 started for boostback, which ended early; only part of the landing-burn engines lit [S7, S28]. Ship 40 made the first Raptor 3 in-space relight and the softest splashdown yet [S7, S13].
- **Flight 14, 2026-09-28 (Booster 21, Ship 41), first orbital flight.** One booster engine shut down on ascent; boostback ran on 31 of 33 engines; the landing burn on 11 of 13, then 5, then 3, ending on target [S8]. The ship lost one Raptor Vacuum on ascent and compensated with longer burns, then used a single sea-level Raptor for orbit insertion (about 19 s) and later for the first deorbit burn, landing on all three sea-level engines [S8, S30, S36].

### Status as of 2026-09-29

Raptor 3 is the production engine of Starship V3. In three flights (117 engines flown, estimate) it has demonstrated in-space relight, orbit insertion, deorbit and full 33-engine boostback starts, culminating in Starship's first orbital flight one day before this dossier. Reliability is still short of what SpaceX needs: every V3 flight has had at least one engine shut down or fail to start, including a Raptor Vacuum loss on Flights 12 and 14. The flight rating (250 tf sea level, 275 tf vacuum) remains below the 280 tf demonstrated on the ground. Tentative next flights: Flight 15 no earlier than 2026-10-19 and the first LC-39A launch no earlier than 2026-10-30 [S29]. Beyond V3, Musk's stretch goal for Starship V4 is 300 tf per engine, about 10,000 tf on 33 engines [S16], and the FAA's January 2026 LC-39A analysis bounds a future vehicle at up to 35 booster engines, 9 ship engines and 103 MN of liftoff thrust [S18]. No Raptor 4 hardware or specifications have been published.

## Components

Ids follow the page contract (CONTRACT.md). Program-level ids come first, then the Raptor 3 parts at summary level (the internals dossier, 02, carries deeper detail). Axial position is a schematic fraction from the top of the engine (0.0 = gimbal mount) to the nozzle exit (1.0); it is an estimate for drawing only, not measured.

### Program level

- **raptor3.evolution** (Raptor evolution). Function: how the engine went from prototype to production. Detail: Three generations share the full-flow methalox cycle but differ in integration: Raptor 1 was a heavily instrumented development engine, Raptor 2 a simplified production redesign, and Raptor 3 integrates plumbing and electronics inside the engine so it needs no heat shield. Thrust rose from 185 tf to 230 tf to 250 tf flight rating (280 tf demonstrated) while mass fell from 2,080 kg to 1,630 kg to 1,525 kg. Specs: see Key numbers.
- **raptor3.evolution.r1** (Raptor 1). Function: first flight-weight Raptor (2019 to 2022). Detail: 185 tf sea level, 2,080 kg, 3,630 kg with vehicle-side hardware, chamber pressure goal 250 bar, O/F 3.6 and 34.34:1 nozzle per a 2019 FAA analysis. Flew on the suborbital prototypes (Starhopper, SN5 to SN15). Covered in sensors and external plumbing; needed shrouds and a booster heat shield. Specs: [S2, S17].
- **raptor3.evolution.r2** (Raptor 2). Function: production engine for Starship V1 and V2 (flights 1 to 11). Detail: redesigned turbomachinery, chamber and electronics; flanges converted to welds; no main-chamber torch igniter; about 300 bar; 230 tf, 1,630 kg, about half the cost of Raptor 1 per Musk. Booster outer ring used the fixed "Raptor Boost" variant started with ground-supplied gas. At least 569 built by August 2024. Specs: [S2, S20, S37, S55].
- **raptor3** (Raptor 3, root). Function: the sea-level engine of Starship V3, 33 on the booster and 3 on the ship. Detail: full-flow staged combustion, methane and oxygen, regeneratively cooled chamber and nozzle, plumbing and electronics internal, no shroud. 250 tf flight rating (280 tf demonstrated), 1,525 kg, 1,720 kg including vehicle-side hardware. First flight 2026-05-22 on Flight 12. Specs: [S1, S3].
- **raptor3.rvac** (Raptor Vacuum 3). Function: high-efficiency upper-stage engine, three per ship, fixed (no gimbal). Detail: same powerhead family with a much larger nozzle for vacuum; 275 tf rated (306 tf target shown in 2024). Mass, nozzle size and Isp for the Raptor 3 version are not published; the long-standing RVac Isp figure is about 380 s. One RVac shut down early on both Flight 12 and Flight 14. Specs: [S3, S15, S43].
- **raptor4** (Raptor 4 / V4 engine, concept). Function: future uprated engine for Starship V4. Detail: Musk's V4 stretch goal is 300 tf per engine and about 10,000 tf total on 33 engines; the FAA's LC-39A envelope allows up to 35 booster engines and 103 MN. No hardware, design details or dates are public. Suggest labeling as a goal, not a spec. Specs: [S16, S18].

### Raptor 3 parts (summary level)

- **raptor3.gimbal** (Gimbal mount and TVC interface). Axial 0.00. Function: attaches the engine to the thrust structure and lets it pivot for steering. Detail: Gimbaling Raptors have been reported at about 15 degrees of range. On V3 only the booster's inner 13 engines and the ship's three sea-level engines carry thrust vector control; actuators are electric, replacing hydraulics since 2023 to 2024. Raptor 3 gimbal range is not published. Specs: [S3, S11, S37].
- **raptor3.loxInlet** and **raptor3.ch4Inlet** (Propellant inlets and main valves). Axial about 0.05 to 0.10. Function: receive liquid oxygen and liquid methane from the vehicle feedlines. Detail: On V3 the booster's methane arrives through a redesigned transfer tube the size of a Falcon 9 first stage, sized to start all 33 engines at once, and a separate LOX landing tank feeds the inner 13 engines for landing burns (NSF). With the engine shrouds gone, V3 protects only the main propellant valves, TVC actuators and primary inlets (NSF). Valve types and sizes are not published. Specs: [S3, S59].
- **raptor3.otp** (Oxygen turbopump, with pump, turbine, shaft). Axial about 0.10 to 0.30. Function: raises liquid oxygen to very high pressure, driven by oxygen-rich hot gas. Detail: The turbine sees hot, high-pressure oxygen-rich gas, the harshest environment in the engine, which is why SpaceX created the SX500 superalloy. Oxygen turbopump problems have caused several Starship issues: filter blockages starved the pumps on Flights 2 and 3, and moisture-related low pump pressure caused the 2026-07-16 Flight 13 abort. Pump speed, power and pressure are not published. Specs: [S9b, S26, S27, S35, S38].
- **raptor3.ftp** (Methane turbopump, with pump, turbine, shaft). Axial about 0.10 to 0.30. Function: raises liquid methane to high pressure, driven by fuel-rich hot gas. Detail: A separate shaft from the oxygen pump, so no seal between propellants is needed; fuel-rich turbine gas is benign to materials compared with the oxygen side. Specs: [S38].
- **raptor3.opb** (Oxygen-rich preburner). Function: burns all of the oxygen with a small amount of methane to make turbine drive gas. Detail: Part of the full-flow cycle; ignited at start by the ignition system (Raptor 2 used torch igniters here; Raptor 3 uses a redesigned system). Temperatures and pressures not published. Specs: [S3, S38, S39].
- **raptor3.fpb** (Fuel-rich preburner). Function: burns all of the methane with a small amount of oxygen to drive the methane turbine. Specs: [S38].
- **raptor3.oxDuct** and **raptor3.fuelDuct** (Hot-gas ducts). Function: carry the two gaseous streams from the turbines to the main injector. Detail: On Raptor 3 these paths and the secondary flow circuits are integrated into the engine structure rather than flanged external lines (reported). Specs: [S20, S24].
- **raptor3.injector** (Main injector). Axial about 0.35. Function: mixes hot oxygen-rich and fuel-rich gases entering the chamber. Detail: Raptor 2 is reported to use coaxial swirl injector elements; gas-gas injection lets combustion complete in a short chamber. Raptor 3 injector details are not published. Specs: [S47].
- **raptor3.mcc** (Main combustion chamber). Axial about 0.35 to 0.50. Function: where the propellants burn at roughly 300 to 350 bar. Detail: Regeneratively cooled by methane flowing through wall channels; a copper-alloy liner is widely reported. Raptor 2 ran about 300 bar; a Raptor 3 development engine reached 350 bar. The flight-rated Raptor 3 chamber pressure is not published. Specs: [S14, S17, S37].
- **raptor3.regen** (Regenerative cooling channels). Function: circulate cold methane through chamber and nozzle walls to keep them from melting, preheating the fuel. Detail: On Raptor 3 the same cooled structure also protects internalized plumbing and sensors, which is what let SpaceX delete the heat shield. SpaceX's 2019 FAA data describe the sea-level nozzle as regeneratively cooled at 34.34:1 expansion. Specs: [S17, S20].
- **raptor3.nozzle** (Sea-level nozzle). Axial 0.50 to 1.00. Function: expands exhaust to produce thrust at sea level without flow separation. Detail: About 1.3 m exit diameter and 34.34:1 expansion in 2018 to 2019 figures; not re-published for Raptor 3. Specs: [S17, S50].
- **raptor3.igniters** (Ignition system). Function: lights the preburners at every start and in-space relight. Detail: SpaceX: redesigned ignition system on all Raptor 3 variants. NSF: acoustic (resonance) igniters with no spark or moving parts. Ignition was a known weak point on Raptor 2 (igniter low-power abort on Flight 7, torch ignition thermal issue on Flight 8). Specs: [S3, S9, S10, S24].
- **raptor3.controller** (Engine controller and sensors). Function: runs startup, throttle and shutdown and monitors health. Detail: Moved inside the engine and covered by engine thermal protection on Raptor 3 (SpaceX). Erroneous engine alarm settings were one of the two most probable causes of the Flight 12 booster loss. Specs: [S3, S19].
- **raptor3.press** (Autogenous pressurization tap-offs). Function: supply gaseous oxygen and methane from the engines to keep the vehicle's tanks pressurized. Detail: Reported for Super Heavy V3, where autogenous pressurization manifolds run around the outside of the aft section alongside the engines' other commodity lines. Flow rates and gas temperatures are not public. Specs: [S59].
- **raptor3.startup** (Start sequence). Function: bring pumps up to speed and light the preburners and chamber. Detail: Raptor 2 spun up using helium or nitrogen, with booster outer engines supplied from the ground. Raptor 3 reportedly uses gaseous oxygen and methane for spin-up, and V3 introduced a new startup method that lets all 33 booster engines start together and relight in flight. NSF describes V3 booster pressure vessels holding gaseous methane and oxygen for spin start and igniters. Specs: [S3, S24, S39, S55, S59].

## Uncertain or conflicting

1. **Raptor 3 thrust: 250 vs 280 tf.** SpaceX's 2024 specification (280 tf) is a demonstrated ground-test figure [S1]; SpaceX's V3 announcement gives 250 tf for flight [S3]. Much press and many secondary sites describe V3 as flying 280 tf engines; that is wrong as of 2026-09-29. When (or whether) flight thrust will rise toward 280 tf is not public beyond NSF's statement that 280 tf is the goal [S24].
2. **Specific impulse labels.** SpaceX's 350 / 347 / 350 s figures are unlabeled [S1, S2]. They fit Musk's "about 350 s in vacuum" for a sea-level Raptor [S15] better than reported sea-level Isp of about 327 to 330 s [S37]. Raptor 3 sea-level Isp at sea level, and Raptor Vacuum 3 Isp, are not published.
3. **Raptor 3 chamber pressure.** 350 bar was reached by a "Raptor V3" in May 2023 at 269 tf [S14]. Wikipedia lists 330 bar as an "operational" value without a clear primary source [S47]. No SpaceX figure exists for the 250 tf flight rating. If thrust scaled linearly with chamber pressure at a fixed throat (a simplification), 250 tf would correspond to roughly 325 bar (350 x 250 / 269), estimate only.
4. **First Raptor 3 firing.** The first public firing is Raptor 3 SN1 around 2024-08-08 [S20], but Musk's May 2023 "Raptor V3" 350 bar post shows development hardware carrying the Raptor 3 name was already testing in 2023 [S14]. Pages should say "first public firing of Raptor 3 SN1" rather than "first ever Raptor 3 firing".
5. **Percentage claims.** Some outlets say Raptor 3 is "36% lighter than Raptor 1" or "costs four times less". Neither matches SpaceX's published masses (26.7% lighter engine-only; 52.6% lighter with vehicle-side hardware) and no SpaceX source for a cost ratio was found. Do not use.
6. **Thrust-to-weight "over 180" (SatNews)** uses the 280 tf ground figure; at the 250 tf flight rating it is about 164 [S49]. Label which thrust is meant.
7. **Flight 13 abort engine count.** Musk: some engines did not start and two would be replaced [S35]; SpaceX: four engines aborted at startup due to oxidizer turbopump issues [S28]; NSF: 29 of 33 lit, six engines had low LOX pump pressure from moisture and all six were swapped [S27, S28]. Launch commit criteria are reported both as "at most three startup failures" and "at least 31 of 33 running" by NSF in different articles [S26, S28]. The root cause of the moisture is not public.
8. **Flight 12 timings.** Booster engine-out at T+1:43 (NSF) vs about 1:42 (Spaceflight Now); the ship RVac loss is given as T+3:03 and as about 36 to 40 s after staging, which are consistent [S24, S25, S27, S34].
9. **Flight 13 boostback cut short.** SpaceX says only that the burn ended early [S7]; NSF attributes it to ice ingestion [S30]. Treat the cause as reported.
10. **Flight 14 RVac shutdown time.** T+7:19 appears in encyclopedic summaries; SpaceX says only "during Starship's ascent burn" [S8]. Cause not public.
11. **Where Raptors are built.** Musk announced a McGregor Raptor factory in 2021 for Raptor 2 volume production [S44], and NSF reported it nearly ready in February 2022 [S55]; SpaceX's 2026 S-1 lists Raptor manufacturing at Hawthorne and McGregor only as a test site [S12]. Whether McGregor currently builds engines is unclear.
12. **Production counts.** SpaceX's "600 Raptor rocket engines" (October 2025) may be "more than 600" (the sentence begins "more than three dozen Starships and 600 Raptor rocket engines") and covers all versions [S4]. Raptor 3 production totals are not public; community serial-number sightings (for example R3 No. 35 in August 2025 [S22], and higher numbers later) are not a reliable count because numbering schemes are not published.
13. **Raptor Vacuum 3 details** (mass, nozzle exit diameter, expansion ratio, Isp, whether the nozzle extension is fully regeneratively cooled) are not public. The 306 tf RVac 3 figure is a 2024 target from a Musk slide, not a flight rating [S43].
14. **Acoustic igniters and gaseous O2/CH4 spin start** for Raptor 3 are reported by NSF only [S24]; SpaceX confirms only a "redesigned ignition system" and a "new Raptor startup method" [S3].
15. **Legacy specs reused for Raptor 3.** Height 3.1 m, diameter 1.3 m, gimbal about 15 degrees, O/F 3.6, 34.34:1 expansion and the 40% throttle floor all come from Raptor 1 or 2 era sources. They are reasonable context but not confirmed for Raptor 3.
16. **Raptor 4.** A named "Raptor 4" appears mostly in fan wikis and low-quality sites (claims such as 330 tf and T/W 202 have no primary source found). The verifiable items are Musk's 300 tf V4 stretch goal [S16] and the FAA LC-39A envelope [S18]. Claims that V4 ships will carry nine engines come from the FAA envelope (9 ship engines) and secondary coverage; SpaceX has not published a V4 engine layout.
17. **Unit cost.** No current Raptor 3 unit cost is public. The 250,000 USD per engine and 1,000 USD per tf figures are targets.

## Sources

1. SpaceX on X, Raptor 3 (sea level variant) specifications post, 2024-08-03, https://x.com/SpaceX/status/1819772716339339664
2. SpaceX on X, "Performance stats of previous versions" (Raptor 1 and 2), 2024-08-03, https://x.com/SpaceX/status/1819795288116330594
3. SpaceX, "Introducing Starship V3" (Updates), 2026-05-12, https://www.spacex.com/updates#starship-v3
4. SpaceX, "To the Moon and Beyond" (Updates), 2025-10-30, https://www.spacex.com/updates#moon-and-beyond
5. SpaceX, "Starship to Orbit" (Updates), 2026-09-15, https://www.spacex.com/updates#orbital-starship
6. SpaceX, "Starship's Twelfth Flight Test" (launch page), 2026-05-22, https://www.spacex.com/launches/starship-flight-12
7. SpaceX, "Starship's Thirteenth Flight Test" (launch page), 2026-07-24, https://www.spacex.com/launches/starship-flight-13
8. SpaceX, "Starship Flight 14" (launch page), 2026-09-28, https://www.spacex.com/launches/starship-flight-14
9. SpaceX, "New Year. New Ship. New Lessons." (Flight 7 report), 2025-02-24, https://www.spacex.com/updates#flight-7-report
   9b. SpaceX, "Building on the success of Starship's second flight test" (Flight 2 report), 2024-02-26, https://www.spacex.com/updates#flight-2-report ; and "On the path to rapid reusability" (Flight 3 report), 2024-05-24, https://www.spacex.com/updates#flight-3-report
10. SpaceX, "Fly. Learn. Repeat." (Flight 8 report), 2025-05-22, https://www.spacex.com/updates#flight-8-report
11. SpaceX, "Upgrades ahead of Starship's second flight test", 2023-09-08, https://www.spacex.com/updates#starship-upgrades
12. Space Exploration Technologies Corp., Form S-1 Registration Statement, filed 2026-05-20, https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm
13. Space Exploration Technologies Corp., "SpaceX Reports Second Quarter 2026 Results" (Exhibit 99.1 to Form 8-K), 2026-08-04, https://www.sec.gov/Archives/edgar/data/1181412/000162828026052515/earningsreleaseq22608042.htm
14. Elon Musk on X, Raptor V3 350 bar / 269 tons post, 2023-05-13 (UTC), https://x.com/elonmusk/status/1657249739925258240
15. Elon Musk on X, Raptor sea-level vs vacuum Isp post, 2019-09-09, https://twitter.com/elonmusk/status/1171118891671490560
16. Elon Musk on X, Starship V4 stretch goal post, 2026-01-23 (date decoded from post ID), https://x.com/elonmusk/status/2014749076672184631
17. Sierra Engineering & Software for SpaceX / FAA, "Exhaust Plume Calculations for SpaceX Raptor Booster Engine" (Appendix G, Starship PEA), 2019-06-18, archived at https://web.archive.org/web/20211020054702/https://www.faa.gov/space/stakeholder_engagement/spacex_starship/media/Appendix_G_Exhaust_Plume_Calculations.pdf (original FAA URL now returns 404)
18. FAA, "Final Environmental Impact Statement for the SpaceX Starship-Super Heavy Launch Vehicle at Launch Complex 39A", January 2026 (Record of Decision 2026-01-30), https://www.faa.gov/space/stakeholder_engagement/spacex_starship_ksc
19. Aero-News Network, "FAA Closes SpaceX Starship Flight 12 Mishap Investigation" (FAA statement), 2026-07-14, https://www.aero-news.net/index.cfm?do=main.textpost&id=DAB4BEFB-29DC-49DA-9D0C-697CBC87B746 ; FAA statements page https://www.faa.gov/newsroom/statements/general-statements
20. NASASpaceflight, "Flight 5 and 6 Preparations Underway as SpaceX reveals Raptor 3", 2024-08-09, https://www.nasaspaceflight.com/2024/08/flight-5-6-preparations-raptor-3/ (embeds SpaceX 2024-08-03 and Gwynne Shotwell 2024-08-08 posts)
21. NASASpaceflight, "Raptor 3 testing ramps up at SpaceX McGregor", 2025-08-11, https://www.nasaspaceflight.com/2025/08/raptor-3-ramps-spacex-mcgregor/
22. NASASpaceflight, "SpaceX McGregor looks to the future, from Raptor 3 to potential HLS testing", 2025-09-02, https://www.nasaspaceflight.com/2025/09/spacex-mcgregor-raptor-3-hls/
23. NASASpaceflight, "Starship Block 3 development continues at Starbase and McGregor", 2025-09-16, https://www.nasaspaceflight.com/2025/09/spacex-starship-block-3-engine-testing-mcgregor/
24. NASASpaceflight (Ryan Weber), "Starship Flight 12: Block 3 Impresses on First Flight", dated 2026-05-20, updated after the 2026-05-22 launch, https://www.nasaspaceflight.com/2026/05/starship-flight-12-block-3-pad-2/
25. NASASpaceflight, "Following Starship V3 debut, SpaceX prepares for follow up", 2026-05-26, https://www.nasaspaceflight.com/2026/05/starship-flight-12-v3-follow/
26. NASASpaceflight, "Path to Starship Flight 13 requires additional Booster 20 test", 2026-07-22, https://www.nasaspaceflight.com/2026/07/path-flight-13-attempt-2-test/
27. NASASpaceflight, "Starship Flight 13 achieves new firsts for SpaceX", dated 2026-07-23, updated after the 2026-07-24 launch, https://www.nasaspaceflight.com/2026/07/starship-flight-13-flight/
28. NASASpaceflight, "Ship 40's flawless flight promotes next mission catch potential", 2026-07-28, https://www.nasaspaceflight.com/2026/07/ship-40-catch-potential/ (embeds SpaceX post of 2026-07-24 on the ox turbopump aborts)
29. NASASpaceflight, "Flight 14 approaches as a near-term manifest sketches Starship's next steps", 2026-09-25, https://www.nasaspaceflight.com/2026/09/flight-14-starships-forward-path/
30. NASASpaceflight, "Ship 41 Makes it to Orbit, Booster 21 Nearly Perfect", page dated 2026-09-27, covering the 2026-09-28 launch, https://www.nasaspaceflight.com/2026/09/starship-flight-14-orbit/
31. NASASpaceflight, "Methalox race likely to be won in 2022, but winner not yet clear", 2022-03-13, https://www.nasaspaceflight.com/2022/03/methalox-race-to-orbit/
32. Spaceflight Now, "SpaceX targets May 19 for debut of Starship Version 3, Launch Pad 2", 2026-05-12, https://spaceflightnow.com/2026/05/12/spacex-targets-may-19-for-debut-of-starship-super-heavy-version-3-launch-pad-2/
33. Spaceflight Now, "Musk praises 'epic' Super Heavy-Starship launch", 2026-05-23, https://spaceflightnow.com/2026/05/23/musk-praises-epic-super-heavy-starship-launch/
34. Spaceflight Now, "FAA requires SpaceX-led mishap investigation before resumption of Starship launches", 2026-05-27, https://spaceflightnow.com/2026/05/27/faa-requires-spacex-led-mishap-investigation-before-resumption-of-starship-launches/
35. Teslarati, "SpaceX Starship Flight 13 aborted at zero and Musk just told us what broke", 2026-07-16, https://www.teslarati.com/spacex-starship-flight-13-reason-why-aborted/
36. Teslarati, Starship Flight 14 orbit coverage, 2026-09-28, https://www.teslarati.com/starship-14-orbit/
37. Everyday Astronaut (Tim Dodd), "Raptor 1 vs Raptor 2: What did SpaceX change?", 2022-07-14, https://everydayastronaut.com/spacex-raptor-engine-comparison/
38. Everyday Astronaut (Tim Dodd), "Is SpaceX's Raptor engine the king of rocket engines?", 2019-05-25, https://everydayastronaut.com/raptor-engine/
39. Everyday Astronaut, "How to start a rocket engine", 2023-03-09, https://everydayastronaut.com/how-to-start-a-rocket-engine/
40. Everyday Astronaut (YouTube), "Starbase Tour with Elon Musk [Part 2]", 2021-08-07, https://www.youtube.com/watch?v=SA8ZBJWo73E
41. Everyday Astronaut (YouTube), "First Look Inside SpaceX's Starfactory w/ Elon Musk", recorded 2024-06-05, published 2024-06-22, https://www.youtube.com/watch?v=aFqjoCbZ4ik
42. Drive Tesla Canada, "SpaceX Aims for Groundbreaking Efficiency and Cost Reductions with Upcoming Starship Updates, Says Elon Musk", 2024-04-08, https://driveteslacanada.ca/news/spacex-aims-for-groundbreaking-efficiency-and-cost-reductions-with-upcoming-starship-updates-says-elon-musk/
43. Ars Technica (Eric Berger), "Elon Musk just gave another Mars speech; this time the vision seems tangible", 2024-04-08, https://arstechnica.com/space/2024/04/elon-musk-just-gave-another-mars-speech-this-time-the-vision-seems-tangible/ (Raptor figures are in a SpaceX slide image; text values taken via [S47]); see also SpaceNews (Jeff Foust), "Musk outlines plans to increase Starship launch rate and performance", 2024-04-06, https://spacenews.com/musk-outlines-plans-to-increase-starship-launch-rate-and-performance/
44. KWTX, "Elon Musk says SpaceX planning second rocket facility near Waco", 2021-07-11, https://www.kwtx.com/2021/07/11/elon-musk-says-spacex-planning-second-rocket-facility-near-waco
45. NIST Chemistry WebBook, "Oxygen" (phase change data), https://webbook.nist.gov/cgi/cbook.cgi?ID=C7782447
46. NIST Chemistry WebBook, "Methane" (phase change data), https://webbook.nist.gov/cgi/cbook.cgi?ID=C74828
47. Wikipedia, "SpaceX Raptor" (used only as a pointer to underlying citations), accessed 2026-09-29, https://en.wikipedia.org/wiki/SpaceX_Raptor
48. VoxelMatters, "Elon Musk confirms new Raptor 3 optimization was made possible by AM", 2024-08-05, https://www.voxelmatters.com/elon-musk-confirms-new-raptor-3-optimization-was-made-possible-by-am/
49. SatNews, "SpaceX Debuts Starship V3: Redefining Heavy-Lift Launch Capability", 2026-05-14, https://satnews.com/2026/05/14/spacex-debuts-starship-v3-redefining-heavy-lift-launch-capability/
50. NASASpaceflight (Phillip Gaynor), "The Evolution of the Big Falcon Rocket", 2018-08-09, https://www.nasaspaceflight.com/2018/08/evolution-big-falcon-rocket/
51. Elon Musk on X, Raptor max and min thrust post, 2020-08-17, as quoted in the citations of [S47] (original post URL not independently verified)
52. SpaceX on X, Raptor 3 validation test simulating a Starship V3 ascent burn, 2025-12-03, as embedded in [S24]
53. Gwynne Shotwell on X, Raptor 3 SN1 firing photo, 2024-08-08, as embedded in [S20]
54. Elon Musk, "Becoming a Multiplanet Species" (IAC 2017 talk), 2017-09-29, https://www.youtube.com/watch?v=tdUX3ypDVwI
55. NASASpaceflight, "Musk outlines Starship progress towards self-sustaining Mars city", 2022-02-11, https://www.nasaspaceflight.com/2022/02/starships-self-sustaining-city-mars/
56. Walter Isaacson, "Elon Musk" (biography), Simon and Schuster, 2023-09-12 (LEET engine account), via [S47]
57. NASASpaceflight, "SpaceX lands Ship 31 in the Indian Ocean but miss the Booster Catch" (Flight 6), 2024-11-18/19, https://www.nasaspaceflight.com/2024/11/starship-flight-6-launch/
58. Tesmanian, "SpaceX's third version of the Raptor engine reaches a new thrust record", 2023-05-13, https://www.tesmanian.com/blogs/tesmanian-blog/raptor-v3 (quotes Musk's replies on X about the 350 bar test)
59. NASASpaceflight (Ryan Weber), "Super Heavy Block 3 the Booster of the Future", 2026-05-18, https://www.nasaspaceflight.com/2026/05/super-heavy-block-3-booster-future/
60. NASASpaceflight (Ryan Weber), "Flight 12 readies for the debut SpaceX's next Ship evolution", 2026-05-15, https://www.nasaspaceflight.com/2026/05/fligth12-debut-spacex-ship-evolution/
