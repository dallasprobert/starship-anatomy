# Super Heavy booster dossier (current V3 / Block 3, with V1 and V2 comparison)

Research date: 2026-09-29. Confidence levels: **official** (SpaceX, Elon Musk, FAA, NASA), **reported** (credible press such as NASASpaceflight, Spaceflight Now, Ars Technica, CBS News), **estimate** (analyst, community, or derived by this dossier, with the derivation shown), **disputed** (credible sources disagree). Source numbers in brackets refer to the Sources list at the end.

Naming note (important for the page): SpaceX itself describes every booster flown through Flight 11 (October 2025) as the "first generation Super Heavy" [6], and calls the booster introduced on Flight 12 "Super Heavy V3" to match "Starship V3" [2][3]. The community and Wikipedia split the older boosters into "Block 1" (B7 to B13) and "Block 2" (B14 to B16), but the Block 2 booster changes were minor [pointer: Wikipedia list of boosters; NSF 2025 still called B14 to B17 "Block 1" [20]]. The ship did have a real "V2". This dossier therefore compares **V3** against the **V1/V2 era booster** (treated as one design family) and calls out the few V1 to V2 differences that matter.

## Key numbers

| Quantity | Value | Unit | Version | Confidence | Source (publisher, date, URL) |
|---|---|---|---|---|---|
| Height | 72 (236 ft) | m | V3 | official | SpaceX Starship vehicle page, accessed 2026-09-29, https://www.spacex.com/vehicles/starship [1] |
| Height (more precise figure) | 72.3 | m | V3 | reported | NASASpaceflight (R. Weber), 2025-05-30, https://www.nasaspaceflight.com/2025/05/future-starship-block-3-mars/ [17]; also Tesla Oracle 2026-03-12 [41] |
| Height, including vented hot-stage ring | 71 (232 ft) | m | V1/V2 | official | SpaceX vehicle page as of Jan 2025 (quoted via search snapshot and Wikipedia citation) [1] |
| Height, without hot-stage ring | about 69 | m | V1/V2 | reported | Wikipedia infobox pointer; consistent with 71 m minus 1.8 m ring |
| Diameter | 9 (29.5 ft) | m | all | official | SpaceX vehicle page [1] |
| Full stack height | 124 (407 ft) | m | V3 | official | SpaceX vehicle page [1] |
| Propellant capacity, total | 3,650 (8 Mlb) | t | V3 | official | SpaceX vehicle page [1] |
| Propellant capacity, total | 3,400 (7.5 Mlb) | t | V1/V2 | official | SpaceX vehicle page, Jan 2025 [1] |
| LOX load | about 2,850 | t | V3 | estimate | Derived: 3,650 t x 78% oxygen share (Musk, May 2020: stack propellant is "78% O2 & 22% CH4") [32]; a 3.6:1 mixture ratio gives 2,857 t |
| CH4 load | about 800 | t | V3 | estimate | Derived: 3,650 t x 22% = 803 t (3.6:1 ratio gives 793 t) [32] |
| LOX / CH4 load | about 2,660 to 2,700 / 700 to 740 | t | V1/V2 | estimate | Derived from 3,400 t at 3.55 to 3.6:1 |
| LOX volume (liquid) | about 2,280 to 2,380 | m3 | V3 | estimate | Derived: 2,850 t / 1.20 to 1.25 t/m3 (subcooled LOX; exact loading temperature not public) |
| CH4 volume (liquid) | about 1,780 to 1,820 | m3 | V3 | estimate | Derived: 800 t / 0.44 to 0.45 t/m3 (subcooled methane); includes the methane held inside the transfer tube |
| Liftoff thrust | 8,240 (18.1 Mlbf) | tf | V3 | official | SpaceX vehicle page [1] |
| Liftoff thrust | 80.8 | MN | V3 | official (converted) | 8,240 tf x 9.80665 kN/tf |
| Liftoff thrust, arithmetic check | 8,250 | tf | V3 | estimate | 33 x 250 tf (Raptor 3 sea-level rating, official [2]); SpaceX lists 8,240 tf |
| Liftoff thrust | 7,590 (16.7 Mlbf), about 74.4 MN | tf | V1/V2 (Raptor 2) | official | SpaceX vehicle page, Jan 2025 [1]; Musk: Flight 6 liftoff thrust "~7500 tons", mass "~5000 tons" (Nov 2024) [31] |
| Raptor 3 sea-level thrust (per engine) | 250 (551,000 lbf), up from 230 tf for Raptor 2 | tf | V3 | official | SpaceX, "Introducing Starship V3", 2026-05-12, https://www.spacex.com/updates [2] |
| Raptor 3 sea-level goal thrust | 280 | tf | future | reported | NSF 2026-05-20 [14] |
| Raptor sea-level engine mass | 1,525 (Raptor 3), 1,630 (Raptor 2) | kg | V3 vs V2 | official | SpaceX 2026-05-12 [2] |
| Vehicle-level mass saving | about 1 | t per engine | V3 | official | SpaceX 2026-05-12 [2]; NSF gives about 907 kg (2,000 lb) per engine on the vehicle side [14] |
| Engine count | 33: 3 center + 10 inner ring + 20 outer ring | engines | all | official (count and 13/20 split) | SpaceX vehicle page: "13 maneuverable engines in the center and the remaining 20 around the perimeter" [1]; 3/10/20 ring split from Musk-approved layout, NSF 2021 [24] |
| Gimbaling engines | inner 13 (center 3 + inner ring 10); outer 20 fixed | engines | all | official (V3 TVC on inner 13) | SpaceX 2026-05-12 [2]; NSF 2021 [24] |
| Center-engine clocking | 108 / 108 / 144 | degrees | V3 | reported | NSF 2026-05-18 [13] (NSF 2025 said 108/108/140, which does not sum to 360) [17] |
| Engines relit for boostback (high-thrust portion) | all 33 | engines | V3 | official | SpaceX Flight 13 summary, 2026-07-24 [4] |
| Engines relit for boostback | 13 (inner) | engines | V1/V2 | official | SpaceX Flight 7 and Flight 8 summaries [9] |
| Landing burn engine sequence | 13, then 5, then 3 | engines | V3 | official | SpaceX Flight 14 summary, 2026-09-28 [5] (profile first tested on Flight 11 [6][21]) |
| Landing burn engine sequence | 13, then 3 center | engines | V1/V2 | official | SpaceX Flight 7/8 summaries [9] |
| Engines kept running during hot staging | 3 center | engines | V1/V2 | official | SpaceX Flight 2 and Flight 8 summaries [9][42] |
| Engines kept running during hot staging | not published | engines | V3 | disputed / unknown | NSF says B19 "shut down 28 of 33 engines" at staging [14]; SpaceX has not stated the V3 number |
| Grid fins | 3, each 50% larger and stronger | fins | V3 | official | SpaceX 2026-05-12 [2]; SpaceX on X 2025-08-13 [11] |
| Grid fins | 4 | fins | V1/V2 | official | SpaceX 2026-05-12 ("reduced from four to three") [2] |
| Grid fin mass | about 3 each | t | V1/V2 | estimate | Community figure (Wikipedia, unsourced); not found in a primary source |
| Grid fin arrangement | 90 / 90 / 180 degrees ("T" layout): two opposite fins carry lift/catch points, third is a rudder fin | layout | V3 | reported | NSF 2026-05-18 [13]; SpaceX: fins "include a new catch point and have been re-clocked" [2] |
| Transfer tube (CH4 downcomer) size | "roughly the size of a Falcon 9 first stage" | description | V3 | official | SpaceX 2026-05-12 [2]; SpaceX on X 2025-07-09 [10] |
| Transfer tube size | about 50 m tall, about 3 m wide | m | V3 | reported | NSF 2026-05-18 [13] |
| Transfer tube volume | about 350 | m3 | V3 | estimate | Derived from NSF dimensions: pi x 1.5^2 x 50; about 150 t of methane if full |
| Quick disconnects (propellant fill) | 2 (separate LOX and CH4), was 1 | QDs | V3 vs V1/V2 | official | SpaceX 2026-05-12 [2] |
| Hot-stage ring height | about 1.8 | m | V1/V2 | estimate | Community measurement cited by Wikipedia |
| Hot-stage ring | jettisoned after boostback (from Flight 4 onward) | n/a | V1/V2 | official | SpaceX Flight 11 timeline ("Hot-stage jettison" at T+3:40) [6] |
| Hot stage | integrated, not jettisoned | n/a | V3 | official | SpaceX 2026-05-12 [2]; hot-stage jettison removed from timeline, NSF [14] |
| Barrel ring dimensions | 9 m diameter, 1.83 m tall, 3.97 mm (about 4 mm) wall | m, mm | V1/V2 | estimate | Community measurements (NSF video "Building SpaceX's Starship Super Heavy One Ring At A Time", 2023-06-01, cited by Wikipedia); V3 not public |
| Ring mass | about 1,630 | kg | V1/V2 | estimate | Derived: pi x 9 m x 1.829 m x 0.00397 m x 7,930 kg/m3 |
| Ring count | 33 standard rings plus 4 shorter (1.4 m) aft rings | rings | V1/V2 | estimate | Community count (Wikipedia pointer); V3 not public |
| Dry mass | about 275 | t | V1/V2 | estimate | Community figure (Wikipedia infobox, no primary source found) |
| Dry mass | not public | t | V3 | n/a | No SpaceX figure found |
| Liftoff thrust-to-weight (stack) | nearly 1.5 | ratio | V3 | reported | NSF 2026-05-20 [14]; consistent with an estimated gross liftoff mass of about 5,650 to 5,850 t (5,250 t propellant official [1] + about 160 t ship [16] + about 250 to 300 t booster + payload) |
| Max Q | T+0:45 (Flight 12), T+0:58 (Flights 13 and 14) | s | V3 | official | SpaceX flight timelines [3][4][5] |
| Booster MECO | T+2:18 to T+2:22 | min:s | V3 | official | SpaceX flight timelines [3][4][5]; V1/V2 Flight 11 was T+2:37 [6] |
| Boostback burn (Flight 14) | T+2:27 to T+3:07 | min:s | V3 | official | SpaceX Flight 14 timeline [5] |
| Landing burn (Flight 14) | T+6:36 to T+7:01 | min:s | V3 | official | SpaceX Flight 14 timeline [5] |
| Booster propellant load time | about 34 (LOX start T-36:33, complete T-2:50) | min | V3 | official (derived from timeline) | SpaceX Flight 14 countdown [5] |
| Avionics (both stages combined) | about 60 custom avionics units, about 9 MW peak power, about 50 camera views, 480 Mbps Starlink links | various | V3 | official | SpaceX 2026-05-12 [2] |
| Tower catches of Super Heavy | 3 (Oct 13, 2024 B12; Jan 16, 2025 B14; Mar 6, 2025 B15) | catches | V1/V2 | official | SpaceX Flight 5 page [8]; SpaceX Flight 7 and 8 summaries [9] |
| Tower catches | 0 as of 2026-09-29 (first attempt expected with B22 on Flight 15) | catches | V3 | reported | NSF 2026-09-27/28 [16], NSF Sept 2026 [22] |
| First booster reflight | Flight 9, May 27, 2025 (B14, first flown Flight 7) with 29 of 33 engines reused | date | V1/V2 | official (reflight), reported (engine count) | SpaceX Flight 9 page [7]; NSF April 2025 [20] |
| Second booster reflight | Flight 11, Oct 13, 2025 (B15, first flown Flight 8) with 24 flight-proven engines | date | V1/V2 | reported | NSF Oct 2025 [21] |
| FAA-licensed envelope ("upgraded Super Heavy") | 80 m, 35 engines, 103 MN, 4,100 t | various | future upper bound | official | FAA Final Tiered EA Executive Summary, April 2025, Table ES.2, https://www.faa.gov/media/94341 [37] |

## Explainer

### What Super Heavy is

Super Heavy is the first stage of Starship: a 9 m wide stainless-steel cylinder about 72 m tall that carries roughly 3,650 t of liquid oxygen (LOX) and liquid methane (CH4) and burns them in 33 Raptor 3 engines [1]. Its job is to lift the fully fuelled 52 m Starship upper stage off the pad, push it for about two and a half minutes to high altitude and speed, then turn around and fly itself back so it can be caught by the launch tower and flown again [1][5]. At liftoff the current V3 booster produces about 8,240 tonnes-force (80.8 MN, 18.1 million lbf), which SpaceX describes as making Starship the most powerful launch vehicle ever developed [1].

### Structure: a steel pressure vessel with engines at one end

The booster is built from rolled stainless-steel rings welded into stacks and then into two propellant tanks [pointer: NSF manufacturing video, 2023]. On the V1/V2 generation each ring was about 1.83 m tall with a wall close to 4 mm thick, and a finished booster used roughly 33 full rings plus four shorter aft rings (community measurements, estimate). Longitudinal stiffeners called stringers are welded to the inside walls. Early Starship prototypes used 301 stainless; Musk said in March 2020 that "some parts will use 304L" for its toughness at cryogenic temperatures and that SpaceX would move to internally developed alloys [35]. In August 2026 he wrote that SpaceX has "created our own new alloys and no longer use 301" [34]. The popular name "30X" comes from Tesla's Cybertruck marketing, which Musk tied to Starship steel; SpaceX has not published which alloy or wall thickness the V3 booster uses.

Top to bottom, the booster is: the hot-stage section, the methane tank, a single shared bulkhead (the "common dome"), the LOX tank, and the engine section [pointer: Musk Starbase interview, Everyday Astronaut, 2021]. The heavier LOX sits at the bottom, which keeps the center of mass low. Because the two tanks share one dome instead of having separate domes joined by an intertank, the design saves length and mass, the same approach used on the Saturn V upper stages. This common-dome layout carried into V3; NASASpaceflight describes V3 boosters being stacked starting "with the common dome" [19].

### Plumbing: getting methane past the oxygen

Because the methane tank sits on top, its fuel must travel down through the LOX tank to reach the engines. The V1/V2 booster used a single pipe called the downcomer. On Flight 9 (May 2025), a flight experiment at a high angle of attack (about 17 degrees) overloaded that pipe; SpaceX concluded the "fuel transfer tube" likely failed structurally, mixing methane and oxygen and destroying the booster during its landing burn [9].

V3 replaced it with a far larger transfer tube that SpaceX says is "roughly the size of a Falcon 9 first stage" [2][10]; NASASpaceflight reports about 50 m by 3 m [13]. That tube lets all 33 engines start at the same moment and supports faster, more reliable flips [2]. It is also structurally significant: when a pressure vessel failure blew a hole in Booster 18's LOX tank during a November 2025 ground test, the damaged booster was left standing on the transfer tube [18]. NASASpaceflight notes the V3 methane tank is shorter and the LOX tank longer than before, with the tube's own volume making up the methane difference [13].

For landing, V3 adds a separate LOX landing tank that feeds all 13 inner engines, so any of them can be started if one fails [13]; the V1/V2 boosters used a smaller LOX header tank for the same purpose [pointer: Wikipedia, citing NSF video 2022]. On Flight 14 SpaceX deliberately burned the main LOX tank dry during boostback to test the limits of that arrangement [5].

### The 33 engines

The engines sit in three rings: 3 in the center, 10 in an inner ring, and 20 around the outside [1][24]. Only the inner 13 can steer (gimbal); the outer 20 are fixed and exist mainly for liftoff thrust [1][24]. Since Flight 2 the steering actuators have been electric rather than hydraulic, which Musk said isolates each engine so one hydraulic leak cannot take down several engines at once (reported). On V1/V2 the outer 20 engines were spun up by ground equipment through the launch mount and could not relight in flight [24]. On V3 every Raptor 3 can relight, and on Flight 13 the booster lit all 33 for the high-thrust part of the boostback for the first time [4]. NASASpaceflight reports that V3 carries gaseous methane and oxygen in onboard pressure vessels for engine spin start and igniters [13].

V3 also changed how the engines attach. Instead of hanging the inner engines from a "thrust puck" in the aft dome, the V3 engines mount on a tapered steel thrust plate covered in new metallic tiles [13][17]. Raptor 3 integrates its sensors and controllers inside its own thermal protection, so SpaceX deleted the bulky individual engine shrouds, the enclosed aft cavity, and the carbon dioxide fire-suppression system; shielding now covers only the surface between engines and the steering hardware on the inner 13 [2]. The center three engines are no longer 120 degrees apart (NASASpaceflight reports 108, 108 and 144 degrees) so that no single engine blasts the ridge of the new flame diverter [13].

### A flight, step by step

1. **Liftoff and ascent.** All 33 engines ignite; peak aerodynamic pressure (Max Q) arrives about 45 to 58 seconds after liftoff on V3 flights [3][4][5].
2. **Hot staging.** At about T+2:20 most booster engines shut down and the ship lights its six engines while still attached, pushing itself off [5]. On V1/V2 a vented ring, about 1.8 m tall, shielded the booster's top and was dropped after boostback [6]. On V3 the ship's exhaust hits the booster's forward dome directly, protected by tank pressure and a non-structural steel layer, and the latch actuators retract after separation [2].
3. **Flip and boostback.** The booster flips and relights engines to reverse course toward the landing zone [5].
4. **Glide.** Grid fins and body chines steer it back through the atmosphere. V3 flies a higher angle of attack glide-back, which is why SpaceX could delete the fourth grid fin: it would sit out of the airflow [13].
5. **Landing burn.** V3 relights 13 engines, drops to 5 for fine trajectory control, then to 3 for the final hover [5]. On a return-to-launch-site flight, the tower's chopsticks then catch the booster by its catch points.

### Grid fins, chines and catch points

The V1/V2 booster had four electrically actuated grid fins fixed in the extended position, mounted in the forward section above the methane tank, plus separate catch pins between them [pointer: Ars Technica 2023-11-17 [39]]. V3 has three fins, each 50% larger and stronger, lowered away from the hot-staging plume, with their shafts, actuators and fixed structure moved inside the methane tank for protection [2]. The two opposite fins double as the lift and catch points; the third, a rudder fin, has angled internal grids to avoid pitching the booster up [13]. On Sept 25, 2026, Musk suggested SpaceX "might be able to reduce to 2 grid fins and use S-turns for the third axis of control" [33].

The chines, the long strakes on the lower body, add lift during the glide and house avionics, batteries, and pressure vessels. On V3 the chines on the raceway side are taller and closer together, and those on the rudder-fin side shorter and farther apart [13].

### Pressurization, power and electronics

In flight, the main tanks are pressurized autogenously: engines return hot gaseous oxygen and methane to the tanks, and V3 routes these through external manifolds on the aft section [13]. Composite overwrapped pressure vessels (COPVs) in the chines hold gases for spin start, igniters, pneumatic valves and landing-tank pressurization; NASASpaceflight reports V3 nearly doubled their number [13]. A COPV failure in a chine is the likely cause of the Booster 18 loss [18]. SpaceX says V3 introduced about 60 custom avionics units combining batteries, inverters and high-voltage distribution, able to deliver about 9 MW peak across both stages, with about 50 camera views and 480 Mbps of redundant Starlink connectivity [2].

### Track record

Boosters were caught by the tower three times, all on the older design: Oct 13, 2024 (Flight 5), Jan 16, 2025 (Flight 7) and Mar 6, 2025 (Flight 8) [8][9]. The first reflight came on Flight 9 (May 27, 2025), reusing the Flight 7 booster [7]. V3 has flown three times: Flight 12 (May 22, 2026) lost its booster after a wrong-direction flip and failed boostback [3][15]; Flight 13 (July 24, 2026) completed a 33-engine boostback but hit the water hard after too few engines lit for landing [4]; Flight 14 (Sept 28, 2026) relit 31 of 33 for boostback and 11 of 13 for landing, splashing down on target, after which SpaceX triggered the flight termination system as a demonstration [5]. As of Sept 29, 2026 no V3 booster has been caught or reflown.

## Components

Position convention for the cutaway: 0 = base (aft edge) of the engine skirt, 1 = top of the integrated hot-stage truss. Positions are **estimates** unless noted, built from these assumptions: skirt-to-top length about 70 m (72.3 m overall minus about 2.3 m of Raptor nozzle protruding below the skirt; the protrusion itself is an estimate), tank lengths from the derived propellant volumes above, and the qualitative order from SpaceX and NASASpaceflight. Order and rough proportions are the reliable part; exact values are not public. Listed top to bottom.

- **id: `sh-hotstage`**, Integrated hot-stage truss. Function: connects the ship to the booster and lets the ship's exhaust escape during hot staging. Detail: V3 replaced the separate, jettisoned vented ring with an open truss built into the top of the methane tank (NASASpaceflight compares it to the Soviet N1's open interstage) [13]. The ship's six Raptors fire straight at the booster's forward dome during separation [2]. The latch actuators that hold ship to booster retract after separation to shield them from exhaust [2]. It stays with the booster for the whole flight. Specs: height not public (V1/V2 ring was about 1.8 m, estimate). Position: 0.965 to 1.00.

- **id: `sh-interstage-latches`**, Ship-booster connection actuators. Function: hold the ship on the booster until separation. Detail: SpaceX says these now retract after separation [2]. Count and design not public. Position: about 0.99 to 1.00.

- **id: `sh-forward-dome`**, Forward dome with steel shield. Function: top bulkhead of the methane tank and the surface that takes the ship's exhaust. Detail: protected by internal tank pressure plus a non-structural steel layer [2]; Booster 20 added more steel heat-shield protection here [15]. The dome apex rises up into the truss. Position: 0.935 to 0.975.

- **id: `sh-gridfins`**, Grid fins (3). Function: steer the booster in pitch, yaw and roll during the unpowered glide and descent. Detail: 50% larger and stronger than the old fins, lowered to reduce hot-staging heat, and re-clocked into a T layout (90/90/180 degrees) [2][13]. Two opposite fins carry catch/lift points; the third is a rudder fin with angled internal grids [13]. They stay extended during ascent (true of V1/V2 [39]; assumed for V3). Specs: exact size and mass not public. Position: 0.865 to 0.935.

- **id: `sh-gridfin-actuators`**, Grid fin shafts and actuators. Function: rotate the fins. Detail: SpaceX moved the shaft, actuator and fixed structure inside the booster's main fuel (methane) tank for protection [2]. V1/V2 actuators were electric [39]; V3 actuator type not stated but no hydraulics are reported. Position: about 0.89 to 0.91, inside the tank wall at each fin.

- **id: `sh-catch-points`**, Catch points. Function: where the tower chopsticks take the booster's weight when catching or lifting it. Detail: on V3 these are integrated into the two opposite grid fins [2][13]. V1/V2 used separate protruding catch pins (hardpoints) between the fins [pointer: NSF 2021]. The V3 Pad 2 chopsticks are shorter and use electromechanical instead of hydraulic actuators [2]. No V3 catch yet (as of 2026-09-29). Position: about 0.90.

- **id: `sh-raceway`**, Raceway. Function: external conduit carrying cabling, and on V3 the flight termination system charges. Detail: V3's raceway runs only about halfway down the booster, then goes internal and feeds into one of the taller chines; the separate FTS raceways of V1/V2 were deleted [13]. Position: about 0.48 to 0.93 on the side opposite the rudder fin.

- **id: `sh-ch4-tank`**, Methane (fuel) tank. Function: holds liquid methane, about 800 t on V3 (estimate). Detail: upper tank; shorter on V3 than V1/V2, with the transfer tube volume making up the difference [13]. Subcooled below boiling point for density (reported). Position: 0.61 to 0.94 (barrel section).

- **id: `sh-common-dome`**, Common dome. Function: single bulkhead separating the methane tank above from the LOX tank below. Detail: replaces the heavier "two domes plus intertank" layout. The V1/V2 common dome was made more elliptical after Flight 2 (reported, Everyday Astronaut 2024 via Wikipedia pointer). V3 retains a common dome [19]. Which way it bulges is not documented in the sources reviewed. Position: about 0.58 to 0.63 (center near 0.60).

- **id: `sh-lox-tank`**, Liquid oxygen tank. Function: holds liquid oxygen, about 2,850 t on V3 (estimate), the largest single mass on the rocket. Detail: bottom tank, longer on V3 than V1/V2 [13]. The transfer tube runs down its center. Position: 0.07 to 0.60.

- **id: `sh-transfer-tube`**, Methane transfer tube (downcomer). Function: carries methane from the upper tank down through the LOX tank to the engines. Detail: V3's tube is "roughly the size of a Falcon 9 first stage" [2], reported about 50 m tall and 3 m wide [13]; it enables simultaneous 33-engine start [2] and proved strong enough to hold up the damaged Booster 18 [18]. V1/V2 used a much smaller single downcomer that failed under high-angle-of-attack loads on Flight 9 [9]. Position: along the centerline from about 0.03 (aft manifold) to about 0.63 (common dome); the reported 50 m length may mean it extends slightly above the common dome or that the LOX tank is longer than estimated here.

- **id: `sh-chines`**, Chines (4). Function: aerodynamic strakes that add lift in the glide, and housings for avionics, batteries and COPVs. Detail: first added on Booster 7 [pointer: NSF video 2022]. On V3 the two on the raceway side are taller and closer together; the two on the rudder-fin side are shorter and farther apart for extra glide lift [13]. Position: tall pair about 0.02 to 0.44; short pair about 0.02 to 0.30.

- **id: `sh-copvs`**, Composite overwrapped pressure vessels. Function: store high-pressure gases. Detail: gaseous methane and oxygen for Raptor spin start and igniters, nitrogen for pneumatic valves, and pressurant for the landing tank; V3 carries nearly twice as many as before [13]. A chine COPV failure destroyed Booster 18 in Nov 2025 [18]. Position: inside the chines, about 0.03 to 0.40.

- **id: `sh-avionics`**, Avionics and batteries. Function: flight computers, power, navigation and communications. Detail: V3 introduced integrated avionics units combining batteries, inverters and high-voltage distribution (about 60 units across both stages, about 9 MW peak), multi-sensor navigation, about 50 cameras and 480 Mbps redundant Starlink links [2]. Mounted in the chines [13]. Position: inside the chines, about 0.05 to 0.35.

- **id: `sh-landing-tank`**, LOX landing (header) tank. Function: supplies oxygen to the 13 inner engines for the landing burn so the booster can land after the main LOX tank runs low. Detail: V3 uses a separate landing tank feeding all 13 inner engines [13]; NASASpaceflight calls it a "side landing tank" pressurized from COPVs [13]. V1/V2 had a header tank integrated with the thrust puck [pointer: Wikipedia]. Size and exact placement not public. Position: about 0.05 to 0.14.

- **id: `sh-aft-dome`**, Aft dome. Function: bottom bulkhead of the LOX tank. Detail: on V1/V2 its center included the "thrust puck" that carried the inner 13 engines [pointer: Wikipedia]. On V3 the engines instead hang from a separate thrust plate [13]. Position: about 0.045 to 0.08.

- **id: `sh-thrust-plate`**, Thrust plate with metallic tiles. Function: carries the thrust of all 33 engines into the structure. Detail: a tapered steel plate, which makes the engines protrude further below the booster than before, covered by new metallic heat-shield tiles [13][17]. Position: about 0.02 to 0.045.

- **id: `sh-aft-manifolds`**, Aft commodity lines and autogenous pressurization manifolds. Function: route power, data, spin-start and igniter gases to each engine, and return hot engine gas to pressurize the tanks. Detail: on V3 these run as external pipes and junction boxes around the aft; previously they were inside the enclosed engine shielding [13]. Position: 0.00 to 0.07 (exterior).

- **id: `sh-qd`**, Quick disconnects (2). Function: ground connection points for loading propellant. Detail: V3 split the single booster quick disconnect into two physically separated connections, one for LOX and one for methane, for redundancy and simpler mechanisms [2][13]. V1/V2 also had separate quick disconnects feeding ground spin-start gas to the outer engines, which V3 eliminated [17]. Position: about 0.005 to 0.05, on the skirt.

- **id: `sh-aft-skirt`**, Aft skirt and engine section. Function: the bottom of the barrel that surrounds the engine mounts. Detail: V3 deleted the enclosed aft cavity, engine shrouds and CO2 fire suppression [2]; Booster 21 also flew without the aerocovers above the outer 20 engines [16]. Position: 0.00 to 0.07.

- **id: `sh-engine-shielding`**, Inter-engine shielding. Function: protects plumbing between engines from heat and from a neighboring engine failure. Detail: V3 keeps shielding only on the surface between engines and around the steering (TVC) hardware, main valves and inlets of the inner 13 [2][13]. Position: about 0.00 to 0.04.

- **id: `sh-tvc`**, Electric thrust vector control. Function: gimbal the inner 13 engines for steering. Detail: electric actuators replaced hydraulics after Flight 1 (reported); SpaceX shields the TVC hardware on the inner 13 engines [2]. Position: about 0.00 to 0.03.

- **id: `sh-raptor-center`**, Center engines (3). Function: gimbaling engines that run through hot staging on V1/V2 and do the final landing hover [9]. Detail: clocked 108/108/144 degrees on V3 [13]. Position: nozzle exits at about -0.033, engine tops at about 0.04.

- **id: `sh-raptor-inner`**, Inner ring engines (10). Function: gimbaling engines used with the center three for boostback and landing. Detail: ring rotated on V3 so no engine blasts the flame-diverter ridge [13]. Position: as above.

- **id: `sh-raptor-outer`**, Outer ring engines (20). Function: fixed engines that provide most of the liftoff thrust. Detail: on V1/V2, spun up by ground equipment and not relightable [24]; on V3 all relight and join the boostback [4]. Position: as above, at the perimeter.

- **id: `sh-fts`**, Flight termination system. Function: destroys the vehicle if it strays from its approved path. Detail: V3 charges run in the raceway [13]; SpaceX triggered it after B21's splashdown as a demonstration [5]. Position: along the raceway, about 0.48 to 0.93.

V1/V2 comparison parts (for a "previous generation" toggle; positions as fraction of the 71 m V1/V2 booster, estimates):
- `v2-hsr` Vented hot-stage ring, about 1.8 m tall with its own protective dome, jettisoned after boostback: 0.975 to 1.00 [6].
- `v2-gridfins` Four grid fins at 90-degree spacing in the forward section above the methane tank: about 0.925 to 0.97.
- `v2-catch-pins` Catch pins between the fins: about 0.95.
- `v2-shrouds` Engine shrouds and enclosed aft bay with CO2 fire suppression: 0.00 to 0.05 [2].
- `v2-downcomer` Smaller single methane downcomer: 0.04 to 0.62 [9].
- `v2-thrust-puck` Thrust puck in the aft dome carrying the inner 13 engines; outer 20 on a ring at the first barrel ring [pointer: Wikipedia].

## Uncertain or conflicting

- **Height, 72 m vs 72.3 m.** SpaceX's page says 72 m (236 ft) [1]; NASASpaceflight and others give 72.3 m [17][41]. Probably rounding; use 72 m as official, 72.3 m as the more precise reported figure.
- **Liftoff thrust, 8,240 vs 8,250 tf.** SpaceX lists 8,240 tf [1], while 33 x 250 tf is 8,250 tf. Press also uses "18 million" (CBS [28], Scientific American [43]) and even "16 million pounds" (Spaceflight Now, Flight 14 [26], apparently the old V1/V2 figure). Use SpaceX's 8,240 tf / 18.1 Mlbf / 80.8 MN.
- **Raptor 3 thrust numbers.** Musk announced 269 t at 350 bar in a May 2023 development test (33 x = 8,877 t) [36], and reporting mentions a 280 tf goal [14]; the flight rating SpaceX published for V3 is 250 tf [2]. Older articles quoting 280 tf per engine or "9,240 tons" total describe targets, not the flying vehicle.
- **Version naming.** SpaceX calls every pre-2026 booster "first generation" [6]; Wikipedia splits Block 1/Block 2; NASASpaceflight in April 2025 expected Booster 18 to be "Block 2" [20], and it became the first V3. Musk's 2024 chart [31] used "V2" for roughly what flies today and "V3" for a 150 m future stack; that larger vehicle is now often called Block 4 / V4. The FAA envelopes (80 m, 35 engines, 103 MN, 4,100 t [37]; stack up to 150 m in the LC-39A Draft EIS [38]) describe that future upper bound, not the current booster.
- **Propellant split and tank volumes.** SpaceX publishes only the 3,650 t total [1]. The LOX/CH4 split, tank volumes and tank lengths here are estimates from a mixture ratio of about 3.55 to 3.6 and assumed subcooled densities.
- **Dry mass.** No official figure for any version. The widely repeated 275 t (V1/V2) has no primary source found. SpaceX says V3 saves about 1 t per engine at vehicle level [2], but gives no total.
- **Structure and materials.** Ring height, wall thickness, ring count and alloy for V3 are not public. The 3.97 mm / 1.83 m ring figures are community measurements of V1/V2. "30X" is a nickname, not a SpaceX-published designation.
- **Transfer tube dimensions.** SpaceX says only "roughly the size of a Falcon 9 first stage" [2]. NSF's 50 m x 3 m [13] is plausible but not official, and whether the tube also acts as a methane reserve for landing is not stated.
- **Center-engine clocking.** NSF gave 108/108/140 degrees in 2025 [17] (does not add to 360) and 108/108/144 in 2026 [13]. Use 144.
- **Engines lit during V3 hot staging.** V1/V2 kept the 3 center engines running [9][42]. For V3, NSF's "shut down 28 of 33" on Flight 12 [14] implies more than three may stay lit (or an engine-out artifact); SpaceX has not said.
- **Outer-engine start at liftoff on V3.** All V3 engines can relight in flight [4], and NSF reports onboard GOX/GCH4 spin-start gas [13] and the deletion of the outer-engine ground quick disconnects [17]. SpaceX has not explicitly said that ground spin start is gone.
- **LOX landing tank location and size.** NSF calls it both a "separate LOX landing tank" in the aft and a "side landing tank" [13]; exact placement and capacity are not public.
- **Grid fin details.** V3 fin dimensions, mass and actuator type are not public. The 3 t per fin figure for V1/V2 is unsourced. The two-fin idea is a Musk suggestion only [33].
- **Flight 13 boostback and landing details.** SpaceX says the boostback ended early after the high-thrust portion [4]; NSF later attributed the short burn to ice ingestion [16] and Wikipedia summaries call it intentional. Landing-burn engine counts differ: NSF says 10 lit, then 8, then 5 [15]; Spaceflight Now says only 8 of 13 fired [26].
- **Flight 12 cause.** NSF reports the closed mishap investigation found heat effects on engine components during ascent and erroneous engine alarm settings, plus a wrong-direction flip [15]; SpaceX's own page gives no cause [3].
- **Cold-gas attitude control on V3.** V1/V2 used ullage-gas thrusters and vents in the interstage and below the common dome [pointer: Wikipedia]; how V3 does this is not documented in sources reviewed.
- **Common dome shape and orientation** on V3: not documented.
- **Liftoff thrust-to-weight and gross mass.** NSF says "nearly 1.5" [14]; no official stack mass for V3 has been published.

## Sources

1. SpaceX, "Starship" vehicle page (current V3 specifications), accessed 2026-09-29, https://www.spacex.com/vehicles/starship (Jan 2025 V1/V2 figures of 71 m, 3,400 t, 7,590 tf from the earlier version of the same page, as cited by Wikipedia and search snapshots)
2. SpaceX, "Introducing Starship V3" (Super Heavy V3, Starship V3, avionics, Raptor 3 and Pad 2 change highlights), 2026-05-12, https://www.spacex.com/updates
3. SpaceX, "Starship's Twelfth Flight Test," 2026-05-22, https://www.spacex.com/launches/starship-flight-12
4. SpaceX, "Starship's Thirteenth Flight Test," 2026-07-24, https://www.spacex.com/launches/starship-flight-13
5. SpaceX, "Starship Flight 14," 2026-09-28, https://www.spacex.com/launches/starship-flight-14
6. SpaceX, "Starship's Eleventh Flight Test," 2025-10-13, https://www.spacex.com/launches/starship-flight-11
7. SpaceX, "Starship's Ninth Flight Test," 2025-05-27, https://www.spacex.com/launches/starship-flight-9
8. SpaceX, "Starship's Fifth Flight Test," 2024-10-13, https://www.spacex.com/launches/starship-flight-5
9. SpaceX Updates: Flight 7 summary (2025-02-24), Flight 8 summary (2025-05-22), Flight 9 summary including transfer tube failure cause (2025-08-15), https://www.spacex.com/updates
10. SpaceX on X, "Installing the redesigned fuel transfer tube into the first next generation Super Heavy booster...", 2025-07-09, https://x.com/SpaceX/status/1942975057040404843
11. SpaceX on X, "The first grid fin for the next generation Super Heavy booster...", 2025-08-13, https://x.com/SpaceX/status/1955715300256616451
12. SpaceX Updates, "Starship to Orbit," 2026-09-15, https://www.spacex.com/updates
13. NASASpaceflight (Ryan Weber), "Super Heavy Block 3 the Booster of the Future," 2026-05-18, https://www.nasaspaceflight.com/2026/05/super-heavy-block-3-booster-future/
14. NASASpaceflight (Ryan Weber), "Starship Flight 12: Block 3 Impresses on First Flight," 2026-05-20 (updated after the May 22 launch), https://www.nasaspaceflight.com/2026/05/starship-flight-12-block-3-pad-2/
15. NASASpaceflight (Ryan Weber), "Starship Flight 13 achieves new firsts for SpaceX," 2026-07-23 (updated after the July 24 launch), https://www.nasaspaceflight.com/2026/07/starship-flight-13-flight/
16. NASASpaceflight (Ryan Weber), "Ship 41 Makes it to Orbit, Booster 21 Nearly Perfect," 2026-09-27 (updated after the Sept 28 launch), https://www.nasaspaceflight.com/2026/09/starship-flight-14-orbit/
17. NASASpaceflight (Ryan Weber), "The Future of the Starship Program, Block 3 and Mars," 2025-05-30, https://www.nasaspaceflight.com/2025/05/future-starship-block-3-mars/
18. NASASpaceflight (Ryan Weber), "Booster 18 suffers anomaly during proof testing," 2025-11-21, https://www.nasaspaceflight.com/2025/11/booster-18-anomaly-proof-testing/
19. NASASpaceflight, "Booster 19 stacking begins as SpaceX pushes forward from B18 anomaly," 2025-11, https://www.nasaspaceflight.com/2025/11/booster-19-stacking-spacex-forward/
20. NASASpaceflight, "Booster 14 Completes Milestone Static Fire Ahead of Flight 9," 2025-04, https://www.nasaspaceflight.com/2025/04/booster-14-flight-9/
21. NASASpaceflight, "Starship Flight 11: the end, the beginning, the new," 2025-10, https://www.nasaspaceflight.com/2025/10/starship-flight-11-the-end-beginning-new/
22. NASASpaceflight, "Flight 15 pairing at Massey's" (Booster 22 and Ship 42 testing, possible Flight 15 catch), 2026-09, https://www.nasaspaceflight.com/2026/09/flight-15-pairing-masseys/
23. NASASpaceflight (Alejandro Alcantarilla Romera and Chris Bergin), "Flight 14 approaches as a near-term manifest sketches Starship's next steps," 2026-09-25, https://www.nasaspaceflight.com/2026/09/flight-14-starships-forward-path/
24. NASASpaceflight, "Super Heavy Booster 3 set to fire up first" (Musk-confirmed 3/10/20 layout, outer-ring "Raptor Boost" without TVC), 2021-07-19, https://www.nasaspaceflight.com/2021/07/super-heavy-booster-3-fire-up-first/
25. Spaceflight Now (Will Robinson-Smith), "SpaceX targets May 19 for debut of Starship Version 3, Launch Pad 2," 2026-05-12, https://spaceflightnow.com/2026/05/12/spacex-targets-may-19-for-debut-of-starship-super-heavy-version-3-launch-pad-2/
26. Spaceflight Now (William Harwood), "Starship returns to Earth; rocket splashes down north of Hawaii after three-hour flight," 2026-09-28, https://spaceflightnow.com/2026/09/28/starship-returns-to-earth-rocket-splashes-down-north-of-hawaii-after-three-hour-flight/
27. Teslarati (Joey Klender), "SpaceX unveils sweeping Starship V3 upgrades ahead of May 19 launch," 2026-05-13, https://www.teslarati.com/spacex-unveils-sweeping-starship-v3-upgrades-ahead-may-19-launch/
28. CBS News (William Harwood), "SpaceX launches more powerful Super Heavy-Starship rocket on test flight," 2026-05-22, https://www.cbsnews.com/news/spacex-launches-super-heavy-starship-rocket-version-3-test-flight/
29. Everyday Astronaut, "Starship/SuperHeavy Integrated Flight Test #2" (electric TVC and Musk quote; seen via search, page not re-read), 2023-11, https://everydayastronaut.com/starship-superheavy-flight-test-2/
30. Everyday Astronaut (Trevor Sesnic), "Starbase Tour and Interview with Elon Musk" (tank order), 2021-08-11, https://everydayastronaut.com/starbase-tour-and-interview-with-elon-musk/ (via Wikipedia pointer)
31. Elon Musk on X, "The chart below is due for an update... Flight 6 liftoff thrust is ~7500 tons and mass is ~5000 tons," 2024-11, https://x.com/elonmusk/status/1858927701220049023
32. Elon Musk on X, "Starship + Super Heavy propellant mass is 4800 tons (78% O2 & 22% CH4)," 2020-05, https://twitter.com/elonmusk/status/1258580078218412033
33. Elon Musk on X, "We might be able to reduce to 2 grid fins and use S-turns for the third axis of control," 2026-09-25, https://x.com/elonmusk/status/2103540479266836485 (reported by TeslaNorth, https://teslanorth.com/2026/09/25/super-heavy-two-grid-fins/)
34. Elon Musk on X, "...We have since created our own new alloys and no longer use 301," 2026-08, https://x.com/elonmusk/status/2091617925669245333
35. Tesmanian, Musk quote "Some parts will use 304L, as it has higher toughness at cryo temps," 2020-03-14, https://www.tesmanian.com/blogs/tesmanian-blog/starshipstainlesssteelalloy
36. Elon Musk on X, "Raptor V3 just achieved 350 bar chamber pressure (269 tons of thrust)...," 2023-05, https://x.com/elonmusk/status/1657249739925258240
37. FAA, "Executive Summary of the Final Tiered Environmental Assessment for SpaceX Starship/Super Heavy Vehicle Increased Cadence at the SpaceX Boca Chica Launch Site," April 2025, Table ES.2, https://www.faa.gov/media/94341
38. FAA, "Draft Environmental Impact Statement for SpaceX Starship-Super Heavy Launch Vehicle at Launch Complex 39A" (public brochure), August 2025, https://www.faa.gov/space/stakeholder_engagement/spacex_starship_ksc/SpaceX-39A-EIS_Brochure_Final_pages.pdf
39. Ars Technica (Eric Berger), "Here's why SpaceX really needed to change out that part on Starship" (Super Heavy grid fins fixed extended, electric actuators), 2023-11-17, https://arstechnica.com/space/2023/11/heres-why-spacex-really-needed-to-change-out-that-part-on-starship/
40. Wikipedia, "SpaceX Super Heavy" and "List of Super Heavy boosters," accessed 2026-09-29 (used only as pointers to the sources above), https://en.wikipedia.org/wiki/SpaceX_Super_Heavy
41. Tesla Oracle (Iqtidar Ali), "Starship Flight 12: V3 Booster 19 shows better propellant load speeds...," 2026-03-12, https://www.teslaoracle.com/2026/03/12/starship-flight-12-v3-booster-19-shows-boosted-propellant-load-speeds-static-fire-next/
42. SpaceX, "Starship's Second Flight Test" (first hot staging, all but three booster engines powered down), 2023-11-18, https://www.spacex.com/launches/starship-flight-2
43. Scientific American (Claire Cameron), "Watch SpaceX launch Starship V3, the tallest and most powerful rocket yet" (stack about 408 ft, "exceeds 18 million pounds" of thrust), 2026-05-21, https://www.scientificamerican.com/article/watch-spacex-launch-starship-v3-the-tallest-and-most-powerful-rocket-yet
