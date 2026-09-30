# 05: Mission profile, ground systems, flight history, and scale

Research cut-off: 2026-09-29. Current vehicle: Starship V3 (Super Heavy V3 booster plus Starship V3 upper stage, both on Raptor 3), flown on Flights 12, 13 and 14 from Pad 2 at Starbase, Texas. Older versions appear only for comparison and are labelled.

Conventions used below:

- T+ times are hh:mm:ss after liftoff. "Planned" means the timeline SpaceX published on its mission page before the flight; "actual" means a reported or official post-flight time.
- tf = metric tonnes-force (1 tf = 9.80665 kN). Mlbf = million pounds-force.
- Confidence: official (SpaceX, Musk, FAA, NASA), reported (credible press), estimate (derived or analyst), disputed (credible sources disagree).
- SpaceX mission pages at spacex.com/launches/... are rendered by JavaScript. Their text was read through SpaceX's own content API (content.spacex.com/api/spacex-website/missions/<slug>), which serves the same page content. SpaceX updates were read the same way (spacex.com/updates#<id>).

## Key numbers

### Flight 14 (first orbital flight, V3): published timeline and what actually happened

| quantity | value | unit | version | confidence | source |
|---|---|---|---|---|---|
| Liftoff, Flight 14 | 2026-09-28 12:48:59 UTC (7:48:59 a.m. CDT) | date/time | V3, B21/S41 | official (minute), reported (seconds) | SpaceX Flight 14 page [1]; NSF 2026-09-28 [13]; SpacePolicyOnline 2026-09-28 [26] |
| Max-Q (planned) | T+00:00:58 | time | V3 | official | SpaceX Flight 14 page [1] |
| Super Heavy MECO, most engines cut off (planned) | T+00:02:20 | time | V3 | official | [1] |
| Hot staging: ship Raptor ignition and separation (planned) | T+00:02:22 | time | V3 | official | [1] |
| Boostback burn start / shutdown (planned) | T+00:02:27 / T+00:03:07 | time | V3 | official | [1] |
| Booster engines relit for boostback (actual) | 31 of 33 planned | engines | V3 | official | [1] |
| Booster landing burn start / shutdown (planned) | T+00:06:36 / T+00:07:01 | time | V3 | official | [1] |
| Booster landing burn engine sequence (actual) | 11 of 13 planned, then 5, then 3, then splashdown in the Gulf; flight termination system then fired as a demonstration | engines | V3 | official | [1] |
| Booster splashdown (actual) | about 7 min after liftoff (landing burn planned to end at T+00:07:01) | time | V3 | official (planned), reported (actual) | [1]; Space.com live blog [29] |
| Starship engine cutoff, SECO (planned) | T+00:08:11 | time | V3 | official | [1] |
| Ship engine-out on ascent (actual) | 1 of 3 Raptor Vacuum shut down early; remaining 5 engines burned longer | engines | V3 | official | [1] |
| Orbital insertion burn (planned) | T+00:25:17 to T+00:25:36 (about 19 s), one Raptor sea-level engine | time | V3 | official | [1]; SpaceX "Starship to Orbit" [5] |
| Orbital insertion burn complete (actual) | about T+00:25:20 | time | V3 | reported | NSF [13] |
| Payload deploy, 26 Starlink V3 (planned) | T+00:34:07 to T+01:04:39 | time | V3 | official | [1] |
| Deorbit burn (planned, full mission) | T+08:52:37 to T+08:52:48 (about 11 s), one Raptor sea-level engine | time | V3 | official | [1] |
| Deorbit burn (actual, early return) | about T+02:12:18 | time | V3 | reported | NSF [13]; SpaceX spokesperson Dan Huot quoted by CNN ("around two hours and 12 minutes") [30] |
| Entry / transonic / subsonic (planned) | T+09:28:56 / T+09:47:29 / T+09:48:07 | time | V3 | official | [1] |
| Landing burn start / flip / 3 to 2 engines / 2 to 1 engine / landing (planned) | T+09:50:11 / 09:50:13 / 09:50:21 / 09:50:28 / 09:50:30 | time | V3 | official | [1] |
| Ship splashdown (actual) | T+03:08:27 (NSF gives T+3:08:30), north Pacific north of Hawaii | time | V3 | reported | SpacePolicyOnline [26]; NSF [13]; Spaceflight Now [27] |
| Achieved orbit | 262 x 277 km at 32 deg | km, deg | V3 | disputed | NSF [13] |
| Achieved orbit (alternative) | 262 x 275 km at 30.5 deg | km, deg | V3 | disputed | Jonathan McDowell on X, via Wikipedia pointer [35] |
| Target orbit (planned) | about 275 x 275 km, 32 deg, about 6 revolutions, about 9 h 50 min mission | km, deg | V3 | reported | NSF [13]; Spaceflight Now preview [28] |
| Orbital speed in low Earth orbit | about 17,500 mph (about 28,000 km/h) | mph | general | official | SpaceX "Starship to Orbit" [5] |
| Circular orbital speed and period at 275 km | 7.74 km/s (27,880 km/h), 89.9 min | km/s, min | derived | estimate | Derived: v = sqrt(mu/r), mu = 398,600 km^3/s^2, r = 6,371 + 275 km |
| Propellant loaded for launch | about 12 million lb (about 5,440 t) of LOX and liquid methane | lb | V3 | official | SpaceX post on X, quoted in Space.com live blog [29] |

### Countdown and propellant loading (V3, Pad 2)

| quantity | value | unit | version | confidence | source |
|---|---|---|---|---|---|
| Flight director poll, GO for propellant load | T-00:50:00 | time | V3 F14 | official | [1] |
| Booster LOX load start | T-00:36:33 | time | V3 F14 | official | [1] |
| Booster methane load start | T-00:35:00 | time | V3 F14 | official | [1] |
| Ship LOX / ship methane load start | T-00:34:13 / T-00:34:11 | time | V3 F14 | official | [1] |
| Raptor engine chill starts (booster and ship) | T-00:21:40 | time | V3 F14 | official | [1] |
| Booster / ship propellant load complete | T-00:02:50 / T-00:02:10 | time | V3 F14 | official | [1] |
| GO for launch | T-00:00:30 | time | V3 | official | [1] |
| Flame diverter activation (Pad 2 deluge) | T-00:00:17 | time | V3 | official | [1], [2], [3] |
| Booster engine startup command | T-00:00:03 | time | V3 | official | [1] |
| Booster loading duration, F14 | about 33 min 43 s (T-36:33 to T-2:50) | min | V3 | estimate | Derived from [1] |
| Stack loading time, Pad 1 vs Pad 2 | 49 min vs 38 min | min | Pad 1 vs Pad 2 | reported | NSF 2026-05-13 [15] |
| Total fueling time, Flight 13 | 35 min 20 s | min | V3 | reported | NSF [14] |
| SpaceX design goal | propellant loading "in under an hour" | | Starship | official | SpaceX "Evolving the Multi-User Spaceport" [7] |
| LOX and methane loading temperature | not published by SpaceX | K | all | (unknown) | See Uncertain section |
| Physical bounds for subcooled liquids | LOX: boils 90.2 K (-183 C), freezes 54.4 K; methane: boils 111.7 K (-161.5 C), freezes 90.7 K (-182.5 C) | K | physics | official (reference data) | NIST Chemistry WebBook [51], [52] |

### Ground systems

| quantity | value | unit | version | confidence | source |
|---|---|---|---|---|---|
| Pad 1 launch and catch tower height | about 480 ft (146 m) | ft | Pad 1 | reported | FAA letter reported by CNBC, 2021-07-14 [40] |
| Pad 2 tower height | not officially published | | Pad 2 | (unknown) | See Uncertain section |
| Pad 2 tower base vs Pad 1 base | about 1.5 m taller | m | Pad 2 | reported | NSF 2025-08-19 [16] |
| Pad 2 chopsticks vs Pad 1 | about 10 m shorter, more reinforced | m | Pad 2 | reported | NSF [16]; SpaceX says "shorter" [4] |
| Chopstick main actuators | electromechanical on Pad 2 and LC-39A (hydraulic on Pad 1) | | Pad 2 | official | SpaceX "Introducing Starship V3" [4]; NSF [20] |
| Pad 2 chopstick lift capacity | 700 US tons (about 635 t), load-tested 16 to 24 May 2025 with water bags | US tons | Pad 2 | reported | NSF [16] |
| Launch mount hold-down clamp arms | 20 (new design on Pad 2) | count | Pad 2 | reported | NSF [16] |
| Booster quick disconnects (BQD) | 2 (separate LOX and methane units), moved to the opposite side of the mount from Pad 1's single BQD | count | Pad 2 / V3 | official | SpaceX [4]; NSF [15], [16] |
| Deluge water per operation (maximum evaluated) | about 422,000 US gal (about 1,600 m^3) per static fire, launch or landing | gal | Pad 2 | official (FAA EA, quoted) | FAA Final Tiered EA, quoted by NSF [16], [41] |
| Deluge water use split | 17% before ignition, 75% during launch, 8% after | % | Pad 2 | official (FAA EA, quoted) | [16], [41] |
| Deluge subsystems on Pad 2 | 3 (two flame-bucket diverters, ridge cap, top-deck plate), each with its own tank and pressurization | count | Pad 2 | reported | NSF [15] |
| Pad 2 tank farm pumps, LOX | booster 4 to 5, ship 1 to 4; subcooling +75% (booster), about +300% (ship) | count | Pad 2 | reported | NSF [15] |
| Pad 2 tank farm pumps, methane | booster 3 to 4, ship 1 to 4; subcooling about +100% (booster), +300% (ship) | count | Pad 2 | reported | NSF [15] |
| Starbase liquid nitrogen storage upgrade | seven older tanks replaced by three 1,000 m^3 tanks | m^3 | Starbase | reported | NSF 2026-09-06 [17] |
| LC-39A LOX tank size (also first SLC-37 tanks) | 1,700 m^3 each | m^3 | Florida | reported | NSF 2026-09-01 [21] |
| Starship launch pads built or building (Texas and Florida) | 5 | count | program | official | SpaceX "To the Moon and Beyond" 2025-10-30 [6] |
| Pad 1 return to service | "later next year" (2027), after rebuild with a flame trench | year | Pad 1 | reported | NSF 2026-09-01 [21] |

### Program history and roadmap

| quantity | value | unit | version | confidence | source |
|---|---|---|---|---|---|
| Integrated flight tests flown | 14 (13 suborbital, 1 orbital) | count | all | official | SpaceX launches list [11]; SpaceX "Starship to Orbit" [5] |
| Booster tower catches | 3 (Flight 5 B12, Flight 7 B14, Flight 8 B15) | count | V1 booster | disputed | SpaceX mission pages list return site "Mechazilla" for Flights 5, 7, 8 [11]; Spaceflight Now wrote "four times" [27] |
| Booster reflights | 2 (B14 on Flight 9, B15 on Flight 11) | count | V1 booster | official | SpaceX Flight 9 and 11 pages [11] |
| Ship tower catches | 0 as of 2026-09-29 | count | all | official | Spaceflight Now [27]; SpaceX [5] |
| Cryogenic propellant moved tank to tank in space (Flight 3) | about 5 t | t | V1 ship | official | SpaceX [6] |
| Ship-to-ship propellant transfer | not yet flown | | V3 | official | SpaceX [5], [6] |
| HLS milestones completed | 49 (as of 2025-10-30) | count | HLS | official | SpaceX [6] |
| Artemis III (revised) | 2027 crewed Orion rendezvous and docking tests in low Earth orbit with a Starship V3 test article and Blue Moon Mk2 | year | HLS | official | NASA 2026-07-15 [34] |
| Crewed lunar landing target | 2028 | year | HLS | official | NASA [34] |
| Starship V3 ship height (NASA figure) | 171 ft (52.1 m) | ft | V3 ship | official | NASA [34] |
| SpaceX internal HLS schedule (Nov 2025) | prop transfer June 2026, uncrewed lunar landing June 2027, crewed landing Sept 2028 | dates | HLS | reported | Audrey Decker (Politico) on X [38] |
| Flight 15 target | NET 2026-10-19 (B22/S42, possible first catch of a V3 booster and possibly the ship) | date | V3 | reported (provisional) | NSF [19], [13] |
| First Florida launch (Flight 16, Starlink 30-1, LC-39A) | NET 2026-10-30 | date | V3 | reported (provisional) | NSF [19], [20] |
| Mars cargo | SpaceX site reportedly lists cargo flights NET 2028 at $100 million per tonne | year | Mars | reported | ScienceBlog 2026-08-15 [39] |
| Starship V4 stack height goal | about 142 m | m | V4 | reported | Musk talk reported by NSF 2025-05-30 [24] |
| Starship V4 ship engines / reusable payload goal | 9 engines (42 total on stack) / about 200 t | count / t | V4 | reported | NSF [24] |

### Scale comparison

Liftoff thrust is sea-level thrust at liftoff. Conversions: 1 Mlbf = 4.448 MN; 1 MN = 101.97 tf.

| vehicle | height (m) | diameter (m) | liftoff thrust (MN) | liftoff thrust (tf) | payload to LEO (t) | confidence | source |
|---|---|---|---|---|---|---|---|
| Saturn V | 110.6 (363 ft) | 10.1 | 33.4 (7.5 Mlbf) | 3,402 | about 118 to 140 | height, thrust official; diameter reported; payload disputed | NASA [43]; Space.com [44] (says "as much as 130 tons", citing NASA) |
| SLS Block 1 | 98.1 (322 ft) | 8.4 (core) | 39.1 (8.8 Mlbf) | 3,992 | 70 minimum (NASA fact sheet); about 95 in later charts | height, thrust official; diameter reported; payload disputed | NASA SLS fact sheet [42] |
| N1 (Soviet, 1969 to 1972) | 105 | 17 (base) | 44.1 (4,500 tf) to 45.4 | 4,500 to 4,630 | 95 | reported (thrust disputed slightly) | RussianSpaceWeb [45] |
| Falcon 9 | 70 | 3.7 | 7.6 (7,607 kN) | 776 | 22.8 (expendable) | official | SpaceX Falcon 9 page, cross-checked with Next Spaceflight [46] |
| Falcon Heavy | 70 | 12.2 (width) | 22.8 (22,819 kN) | 2,327 | 63.8 (expendable) | official | SpaceX Falcon Heavy page, cross-checked [47] |
| New Glenn (7x2) | 98 | 7 | 17.1 (3.85 Mlbf, baseline) | 1,746 | 45 | reported (BE-4 uprates announced) | Blue Origin via Satellite Today 2025-11-20 [48] |
| Starship V3 | 124.4 (408 ft) | 9 | 80.9 (derived) | 8,250 (derived) | more than 100 (reusable) | height reported; thrust estimate; payload official | Space.com [33]; SpaceX [4], [6] |

Starship V3 thrust derivation: 33 engines x 250 tf (SpaceX's published Raptor 3 sea-level thrust [4]) = 8,250 tf = 80.9 MN = 18.2 Mlbf. Press accounts give "about 18 million pounds (about 80 MN)" [32]. For comparison, 33 x 230 tf (Raptor 2) = 7,590 tf (74.4 MN).

### Complete integrated flight test history (through 2026-09-29)

| # | date (UTC) | booster / ship | version | pad | outcome in one line | sources |
|---|---|---|---|---|---|---|
| 1 | 2023-04-20 | B7 / S24 | V1 ship, V1 booster | Starbase Pad 1 | Several engines lost and fires in the booster aft end; no staging; apogee about 39 km; autonomous destruct, breakup 237.474 s after ignition; pad foundation failed | [8], [11] |
| 2 | 2023-11-18 | B9 / S25 | V1 / V1 | Pad 1 | First full-duration 33-engine ascent and first hot staging; booster broke up during boostback at about 90 km; ship reached about 150 km and about 24,000 km/h, then was destroyed near the end of its burn | [11] |
| 3 | 2024-03-14 | B10 / S28 | V1 / V1 | Pad 1 | Ship completed its full ascent burn, cycled the payload door and ran a propellant transfer demo; relight skipped due to roll; ship lost during entry about 49 min in; booster lost at about 462 m during its landing burn | [11], [6] |
| 4 | 2024-06-06 | B11 / S29 | V1 / V1 | Pad 1 | First soft splashdowns of both stages: booster at 7 min 24 s in the Gulf, ship in the Indian Ocean at 1 h 06 min after flap damage in entry | [11] |
| 5 | 2024-10-13 | B12 / S30 | V1 / V1 | Pad 1 | First booster catch by the tower chopsticks; ship on-target splashdown at 1:05:40 | [11] |
| 6 | 2024-11-19 | B13 / S31 | V1 / V1 | Pad 1 | Tower health checks aborted the catch; booster diverted to a soft Gulf splashdown; ship made the first in-space Raptor relight and splashed down | [11] |
| 7 | 2025-01-16 | B14 / S33 | V2 ship (first), V1 booster | Pad 1 | Booster caught (second catch); ship lost about 8.5 min in after an aft fire, debris over Turks and Caicos | [11] |
| 8 | 2025-03-06 | B15 / S34 | V2 / V1 | Pad 1 | Booster caught (third catch); ship lost about 9.5 min in after an energetic event in the aft section took out several engines | [11] |
| 9 | 2025-05-27 | B14-2 / S35 | V2 / V1 (first reflown booster) | Pad 1 | Booster flew a high angle-of-attack descent test and broke up at landing burn start about 6 min in; ship reached space but the payload door stuck, relight skipped, attitude lost, ship lost about 46 min in | [11] |
| 10 | 2025-08-26 | B16 / S37 | V2 / V1 | Pad 1 | All major objectives met: booster engine-out landing test and hover, then splashdown; ship deployed 8 Starlink simulators, relit a Raptor and splashed down on target | [11] |
| 11 | 2025-10-13 | B15-2 / S38 | V2 / V1 | Pad 1 | Reflown booster flew the landing burn planned for V3 and splashed down; ship deployed 8 simulators, relit a Raptor, flew a dynamic banking maneuver and splashed down; last V2 flight and last flight from the original Pad 1 | [11] |
| 12 | 2026-05-22 | B19 / S39 | V3 / V3 (first), first Raptor 3 | Pad 2 (first) | Booster lost one engine on ascent, flipped the wrong way, lit too few engines for a partial boostback and hit the Gulf hard; ship lost one Raptor Vacuum but reached its trajectory, deployed 20 Starlink simulators and 2 camera satellites, skipped its relight, splashed down in the Indian Ocean on two engines; FAA mishap investigation, closed July 2026 | [3], [14] |
| 13 | 2026-07-24 | B20 / S40 | V3 / V3 | Pad 2 | First V3 boostback with all 33 engines, ended early; landing burn lit too few engines and the booster hit the Gulf hard; ship deployed 20 real Starlink V3 satellites on a suborbital path, relit a Raptor, splashed down intact in the Indian Ocean and was later recovered | [2], [14] |
| 14 | 2026-09-28 | B21 / S41 | V3 / V3 | Pad 2 | First orbital flight: booster lost one engine on ascent, relit 31 of 33 for boostback and 11 of 13 for landing, soft Gulf splashdown; ship lost one Raptor Vacuum, reached orbit with a single sea-level engine burn, deployed 26 Starlink V3 satellites, returned early and splashed down north of Hawaii at about T+3:08 (fireball after tip-over) | [1], [13], [26], [30] |

Ground-test losses between flights (not flights): Ship 36 destroyed on the Massey's test stand on 2025-06-18 while loading for a six-engine static fire [10]; Booster 18 (first V3 booster) had its LOX tank ruptured during a gas-system pressure test at Massey's on 2025-11-21, with no propellant or engines aboard [25].

Flights not found: I found no record of any Starship launch from Florida, any Flight 15, or any other integrated flight between 2026-09-28 and 2026-09-29. Flight 15 and Flight 16 are provisional plans only.

## Explainer

### The shape of a V3 mission

A Starship launch is two rockets doing two very different jobs. Super Heavy, the booster, is a sprinter: it burns for about two and a half minutes, throws the upper stage toward space, then turns around and flies itself home. Starship, the ship, is the marathon runner: it finishes the climb, delivers cargo, and has to survive reentry from orbital speed so it can land and fly again.

Flight 14 on 2026-09-28 is the reference mission for the current vehicle. SpaceX published a planned timeline for a nearly ten-hour flight: Max-Q at T+58 s, booster main engine cutoff at T+2:20, hot staging at T+2:22, boostback from T+2:27 to T+3:07, booster landing burn from T+6:36 to T+7:01, ship engine cutoff at T+8:11, a single-engine orbit insertion burn at T+25:17, satellite deployment from T+34:07 to T+1:04:39, a deorbit burn at T+8:52:37 and splashdown off Chile at T+9:50:30. In the event, a Raptor Vacuum engine on the ship shut down during ascent, controllers still went for orbit, deployed all 26 Starlink V3 satellites, then brought the ship home early: deorbit at about T+2:12 and splashdown north of Hawaii at about T+3:08.

### Countdown and propellant loading

The countdown for a V3 launch is short. At T-50 minutes the flight director polls the team for a GO to load propellant. Booster liquid oxygen starts flowing at T-36:33, booster methane at T-35:00, and the ship follows within about a minute. At T-21:40 the Raptors begin "engine chill": cold propellant is bled through the engines so their pumps and lines are at cryogenic temperature before start, which prevents the liquid from flashing to gas inside the turbopumps. The booster is full at T-2:50 and the ship at T-2:10. Roughly 12 million pounds (about 5,400 tonnes) of liquid oxygen and liquid methane go aboard in about 34 minutes.

That speed comes from the new tank farm serving Pad 2. SpaceX added storage, pumps and subcooling capacity; NASASpaceflight counted five booster LOX pumps instead of four and four ship pumps instead of one, and reported that total loading time fell from 49 minutes on Pad 1 to 38 minutes on Pad 2, and to about 35 minutes by Flight 13. Both propellants are subcooled, chilled below their boiling points with liquid nitrogen heat exchangers, which makes them denser (more mass in the same tank) and reduces boil-off during the count. SpaceX has not published the exact loading temperatures for Starship.

At T-17 s the flame diverter deluge activates, and at T-3 s the booster engine start command goes out. All 33 Raptor 3 engines start before the hold-down clamps release.

### Liftoff, Max-Q and MECO

Starship V3 stands about 124 m tall and produces roughly 8,250 tonnes-force at liftoff if every engine runs at SpaceX's published 250 tf. That is about 2.4 times the thrust of a Saturn V. The stack climbs over the Gulf of America and passes Max-Q, the point of peak aerodynamic pressure, at about T+58 s on Flights 13 and 14 (T+45 s on Flight 12). On Flight 13 SpaceX deliberately throttled down less after Max-Q to test the stack under higher loads, which pulled main engine cutoff four seconds earlier.

### Hot staging

Most rockets separate stages first and then light the upper stage ("cold staging"), which needs extra thrusters to settle propellant and loses speed while nothing is firing. Starship lights the ship's engines while the two stages are still joined. On earlier versions, Super Heavy shut down all but its three center engines, the ship lit all six Raptors, and their exhaust escaped sideways through a vented steel ring on top of the booster, the hot-stage adapter, which the booster later jettisoned. This was first done on Flight 2 in November 2023.

V3 integrates the hot stage into the booster. The booster's forward fuel dome is now directly exposed to the ship's Raptor exhaust. It is protected by the booster's own internal tank pressure and a non-structural layer of steel, and the interstage actuators retract after separation to stay out of the plume. NASASpaceflight describes the new structure as an open truss in the style of the Soviet N1.

### Booster return: flip, boostback, glide, landing burn

After separation the booster flips to point its engines back toward Texas. Which way it flips is set by the timing of engine startup; on Flight 12 the booster flipped the wrong way, several engines failed on relight, and the boostback ended early. For Flight 13 SpaceX added deliberate timing variability to make the flip direction reliable, and Flight 13 became the first V3 booster to fire all 33 engines for the high-thrust part of boostback. On Flight 14 the booster relit 31 of 33 and intentionally burned through the remaining oxygen in its main tank to find the performance limit for future return-to-launch-site flights.

The booster then falls tail-first, steering with three large grid fins (V3 has three fins, each 50 percent larger than the four on earlier boosters). Near the ground it starts a landing burn with up to 13 engines for high thrust, drops to five for fine trajectory control, and finishes on three. Flight 14 lit 11 of 13, then 5, then 3, and made a soft splashdown before its flight termination system was fired as a test.

For a catch, the same landing burn ends beside the tower instead of over the water, and the tower's two "chopstick" arms close around the booster. On V3, two of the three grid fins carry the lift and catch points. A catch needs thousands of vehicle and pad criteria to be green; on Flight 6 automated tower health checks aborted the catch and the booster diverted to the ocean. Three boosters have been caught (Flights 5, 7 and 8, all first-generation boosters). No V3 booster has yet been caught; SpaceX is expected to try on Flight 15.

### Ship ascent, the passively safe trajectory and orbit

The ship burns for about six minutes after staging and cuts off at about T+8:11. Through Flight 13 every ship stopped just short of orbital speed on a "passively safe" suborbital path that would bring it down in the Indian Ocean even if control were lost. Flight 14 kept that safety net: after cutoff the ship was still on the Indian Ocean trajectory, controllers checked the three sea-level Raptors, and only then relit one of them for about 19 s to raise the low point of the orbit. That burn made Starship an orbital vehicle for the first time, at roughly 262 by 275 km. Orbital speed at that height is about 28,000 km/h (SpaceX: about 17,500 mph).

In orbit the ship opens its "PEZ" slot and pushes out Starlink satellites one at a time; Flight 14 released 26 Starlink V3 satellites in about 30 minutes. In-space relights of a single Raptor had been practiced on Flights 6, 10, 11 and 13 because the same maneuver is the deorbit burn. On Flight 14 the deorbit burn took one sea-level engine about 10 to 11 seconds.

### Entry, flip and landing

Starship reenters belly-first, like a skydiver, so its broad side of black hexagonal heat-shield tiles takes the heat and the drag. Four flaps (two forward, two aft) steer it through hypersonic flight. On the planned Flight 14 timeline, entry begins about 36 minutes after the deorbit burn and lasts about 21.5 minutes to landing; on suborbital flights, entry to splashdown took about 18 minutes. Peak heating happens early in that window, between entry interface and the transonic point; SpaceX does not list its exact time. In the last minutes recent ships fly a "dynamic banking" maneuver that mimics the ground track of a future return to Starbase.

Then comes the flip. About 20 minutes after entry and still falling belly-first, the ship relights its three sea-level Raptors; two seconds after the landing burn starts, the timeline calls the flip to vertical, and the engines then brake the fall. The published timeline steps down from three engines to two and then to one in the final ten seconds before touchdown. On Flight 13 the ship came to rest intact and was towed to Christmas Island for recovery, which NASASpaceflight noted was a surprise because ships usually explode after toppling into the sea; on Flight 14 the ship tipped over and a fireball followed. The ship has never been caught by a tower. Ship 42, planned for Flight 15, has already been lifted in the Pad 2 chopsticks for fit checks.

### Ground systems

Starbase has two launch sites. Pad 1, the original, launched Flights 1 to 11 from a ring-shaped mount on six legs. Flight 1 caused a pad foundation failure; SpaceX then reinforced the foundation and added a water-cooled steel plate, a flame deflector that sprays water up through the plate into the exhaust. Pad 1 is now being rebuilt to the Pad 2 design and is expected back in 2027.

Pad 2, first used on Flight 12, is a clean-sheet design. The launch mount is a steel box with 20 new hold-down clamps, a water-cooled top deck and a side bunker that houses the valves and filters for booster loading, with oxygen and methane equipment in separate rooms. Under the mount is a real flame trench: a steel-lined concrete tub with a double-sided, water-cooled flame bucket that splits the plume two ways, and a water-cooled ridge cap where the halves meet. The deluge, rated in the FAA's assessment at up to about 422,000 gallons per launch, sprays from the buckets, the ridge and the deck plate. The booster connects to the pad through two quick disconnects in the mount (one for oxygen, one for methane); the ship connects through a quick-disconnect arm on the tower that swings away at launch.

The tower is both crane and catcher. Its chopsticks ride a carriage up and down the tower and swing and slide to grab vehicles. On Pad 2 they are about 10 m shorter than the original arms, driven by electromechanical rather than hydraulic actuators, and were load-tested to 700 US tons. The Pad 2 tower also has a clad, hardened roof to survive ship landing burns.

In Florida, LC-39A at Kennedy Space Center has a complete Starship tower and mount; its deluge and tank farm were being tested in September 2026, and SpaceX's provisional plan is a first launch no earlier than 2026-10-30. At Cape Canaveral, SLC-37 has its first tower stacked while its launch mount is still being built.

### Where the program stands

Fourteen flights in three and a half years moved Starship from a vehicle that could not stage (Flight 1) to one that reached orbit and delivered a working payload (Flight 14). The V3 booster has not yet had a clean return: Flights 12 and 13 ended in hard water impacts, and Flight 14's booster made a soft splashdown despite engine relight shortfalls. The next steps are catches of V3 boosters and ships, the first Florida launch, a long-duration orbital flight and the first ship-to-ship propellant transfer, which NASA's lunar lander plan depends on. NASA has restructured Artemis III into a 2027 low-Earth-orbit docking test with Orion, with the crewed landing moved to 2028. No Starship is announced for the late-2026 Mars window.

## Components

Ids follow CONTRACT.md for the flight module. Extra child ids are suggestions and carry real content.

### Mission phases

- **id: `flight`**, name: Mission profile (V3). Function: the sequence of events from propellant load to landing for booster and ship. Detail: Two vehicles, two profiles. The booster flies about 7 minutes and returns to the Gulf or the tower; the ship flies to orbit (from Flight 14) or a suborbital trajectory (Flights 1 to 13), deploys payload and reenters. The Flight 14 plan was about 9 h 50 min; the actual flight lasted about 3 h 08 min. Specs: first orbital flight 2026-09-28; 14 integrated flights to date.
- **id: `flight.liftoff`**, name: Liftoff. Function: all 33 Raptor 3 engines start and the clamps release. Detail: Engine start command at T-3 s after the flame diverter deluge activates at T-17 s. V3 thrust is about 8,250 tf if all engines run at SpaceX's published 250 tf. Flight 13's first attempt (2026-07-16) aborted at T-0 when four engines failed to ignite, the first full-stack ignition abort. Specs: 12:48:59 UTC on Flight 14; about 12 million lb of propellant aboard.
- **id: `flight.maxq`**, name: Max-Q. Function: moment of peak aerodynamic pressure on the stack. Detail: Occurs about T+58 s on Flights 13 and 14 (T+45 s on Flight 12). Flight 13 flew higher dynamic pressures on purpose, with load-sensing heat-shield tiles on the ship. Specs: T+00:00:58 (planned, F14).
- **id: `flight.meco`**, name: Main engine cutoff (MECO). Function: most booster engines shut down just before staging. Detail: "MECO" at SpaceX means most engines cut off; on earlier versions three center engines kept running through hot staging. Specs: T+00:02:20 (planned, F14); T+00:02:18 (F13).
- **id: `flight.hotstage`**, name: Hot staging. Function: the ship lights its six Raptors while still attached, pushing itself off the booster. Detail: Avoids a coast gap and the need for ullage thrusters. V1 and V2 used a vented, jettisonable hot-stage ring; V3 integrates the hot stage, exposing the booster's forward dome to the ship's exhaust, protected by tank pressure and a non-structural steel layer, with retracting interstage actuators. Related: `booster.hsr`. Specs: T+00:02:22 (planned, F14); first done on Flight 2 (2023-11-18).
- **id: `flight.boostback`**, name: Flip and boostback. Function: the booster turns around and burns to reverse its downrange speed. Detail: Flip direction is set by engine start timing (Flight 12 flipped the wrong way; fixed for Flight 13). V3 boostback uses all 33 engines; Flight 13 was the first V3 to do so. Flight 14 relit 31 of 33 and intentionally burned the main tank's remaining LOX. Specs: T+00:02:27 to T+00:03:07 (planned, F14).
- **id: `flight.boosterLanding`**, name: Booster landing burn and catch. Function: slows the booster from terminal velocity to a hover over the water or between the tower arms. Detail: Up to 13 engines for the high-thrust phase, then 5, then 3. A catch attempt requires thousands of vehicle and pad criteria; failed tower checks trigger a divert (Flight 6). Catches: Flights 5, 7, 8. V3 grid fins carry the catch points. Related: `booster.catch`, `booster.gridfins`, `ground.chopsticks`. Specs: T+00:06:36 to T+00:07:01 (planned, F14); F14 actual 11 of 13, then 5, then 3.
- **id: `flight.seco`**, name: Ship engine cutoff (SECO). Function: ship ends its ascent burn on a passively safe suborbital trajectory. Detail: If controllers see a problem the ship simply reenters over the Indian Ocean. On Flight 14 one Raptor Vacuum failed and the other five engines burned longer to compensate. Specs: T+00:08:11 (planned, F14).
- **id: `flight.coast`**, name: Orbit insertion, payload deploy, coast and deorbit. Function: in-space operations. Detail: A single Raptor sea-level engine burns about 19 s to enter orbit (first done on Flight 14), the PEZ slot releases Starlink satellites one by one, and a single-engine deorbit burn of about 10 to 11 s ends the mission. In-space relights were demonstrated on Flights 6, 10, 11 and 13. Specs: F14 insertion T+00:25:17 to 00:25:36; deploy T+00:34:07 to 01:04:39; actual deorbit about T+2:12:18; orbit 262 x 275 to 277 km.
- **id: `flight.entry`**, name: Atmospheric entry. Function: belly-first hypersonic descent that sheds orbital energy as heat and drag. Detail: The heat-shield side faces the flow; four flaps steer. Recent flights include a dynamic banking maneuver that mimics a return to Starbase. Peak heating falls between entry interface and the transonic point; SpaceX does not publish its exact time. Related: `ship.heatShield`, `ship.flapsFwd`, `ship.flapsAft`. Specs: planned F14 entry T+09:28:56, transonic 09:47:29, subsonic 09:48:07; F13 entry T+00:47:30.
- **id: `flight.flip`**, name: Landing flip. Function: the ship rotates from belly-first to tail-first using engine thrust. Detail: The three sea-level Raptors relight and the timeline calls the flip 2 s after landing burn start; the duration of the rotation itself is not published. Specs: planned F14 landing burn start T+09:50:11, flip T+09:50:13.
- **id: `flight.landing`**, name: Landing burn and splashdown (catch later). Function: final deceleration to a soft touchdown on the water, and in future into the tower arms. Detail: Steps from three engines to two to one in the final ten seconds. Ship 40 floated intact after Flight 13 and was recovered; Ship 41 exploded after tipping over on Flight 14. No ship has been caught yet. Specs: planned F14 3 to 2 engines T+09:50:21, 2 to 1 at T+09:50:28, landing T+09:50:30; actual F14 splashdown about T+3:08:27.

### Ground systems

- **id: `ground`**, name: Launch site (Starbase Pad 2). Function: stores, subcools and loads propellant, holds the stack, survives the launch plume, and catches returning vehicles. Detail: Pad 2 first launched Flight 12; Pad 1 is being rebuilt to match. Florida pads LC-39A (near ready) and SLC-37 (under construction) follow the Pad 2 design. SpaceX counts five Starship launch pads built or building in Texas and Florida. Specs: 5 pads (official, 2025-10-30).
- **id: `ground.tower`**, name: Launch and catch tower ("Mechazilla"). Function: crane for stacking and arms for catching. Detail: A steel tower carrying a carriage with the chopsticks and the ship quick-disconnect arm. Pad 2's base is steel "speed core" panels filled with concrete, about 1.5 m taller than Pad 1's, and the tower has a new clad roof to survive ship landing exhaust. A LOX reclaim line added in September 2026 replaced the old tower vent. Specs: Pad 1 tower about 480 ft (146 m) per FAA; Pad 2 height not published.
- **id: `ground.chopsticks`**, name: Chopsticks (catch arms) and catch rails. Function: lift stages for stacking and close around a returning booster or ship. Detail: Two arms swing independently on a carriage that rides the tower. On Pad 2 they are about 10 m shorter than Pad 1's original arms, more rigid, and moved by electromechanical actuators for speed and redundancy; each arm's top "catch rail" carries a single sled plus a telescopic pusher that centers the vehicle's catch points. Boosters 12, 14 and 15 were caught near the inner end of the arms. Ship 42 was lifted and rotated in the Pad 2 arms on 2026-09-12. Specs: 700 US tons lift capacity (Pad 2, tested May 2025); electromechanical actuators (official).
- **id: `ground.olm`**, name: Orbital launch mount. Function: holds the fully fueled stack down until all engines are running, then releases it. Detail: Pad 2's mount is a steel box rather than Pad 1's six-legged ring. It carries 20 redesigned hold-down clamps with a clamp-and-ball-socket alignment system, a water-cooled steel top deck, and a side bunker for booster-fill valves, filters and vents (oxygen and methane in separate rooms). Pad 1 used 20 Raptor quick disconnects to start the outer engines; Pad 2 does not. Specs: 20 clamps; water-cooled top deck.
  - suggested child **id: `ground.olm.clamps`**, name: Hold-down clamps. Function: restrain the booster at its base until release. Detail: Thicker arms for a heavier stack; new hoods keep the plume out of the mount interior.
- **id: `ground.qd`**, name: Quick disconnects (BQD and SQD arm). Function: carry propellant, gases, power and data into the vehicles until launch. Detail: V3 boosters have two separate fill connections, one oxygen and one methane, fed by two smaller booster quick disconnects moved to the side of the mount away from the plume. The ship is fed by the ship quick-disconnect arm on the tower, which was strengthened, repackaged and now rotates farther from the rocket at launch. The ship fill port has been updated to double as the in-space propellant transfer port. Related: `ship.transferPorts`. Specs: 2 BQDs (official); SQD arm on tower.
- **id: `ground.deluge`**, name: Flame trench and deluge. Function: turn the launch plume away from the pad and absorb its heat and sound with water. Detail: Pad 2 has a steel-lined trench with a double-sided water-cooled flame bucket, a water-cooled ridge cap, and a water-cooled top-deck plate, each with its own water tank. The tanks are pressurized by gas generators that burn oxygen and methane to boil liquid nitrogen into gas (Pad 1 used banks of high-pressure gas tanks). Activation at T-17 s. Pad 1's original water-cooled steel plate was added after Flight 1 destroyed the pad foundation. Specs: up to about 422,000 US gal per operation; 17% before ignition, 75% during launch, 8% after (FAA EA).
  - suggested child **id: `ground.deluge.trench`**, name: Flame trench and diverter. Function: split the plume into two directions. Detail: Diverter built from welded pipes with holes drilled to match where the plume hits; trench walls are concrete-filled steel so damaged plates can be replaced.
- **id: `ground.tankfarm`**, name: Tank farm and subcoolers. Function: store LOX, liquid methane and liquid nitrogen; subcool and pump propellant to the vehicles. Detail: Pad 2 has its own pumps and subcoolers, modular pump skids, vacuum-jacketed lines and larger pipes. NSF counted LOX pumps up from 4 to 5 (booster) and 1 to 4 (ship), methane pumps 3 to 4 and 1 to 4, with subcooling capacity up 75 to 300 percent. SpaceX plans on-site air separation and methane liquefaction plants at Starship sites. Specs: loading about 34 min (F14, derived); LN2 three 1,000 m^3 tanks; Florida LOX tanks 1,700 m^3.
- suggested **id: `ground.pad1`**, name: Starbase Pad 1 (original). Function: flew Flights 1 to 11. Detail: Six-legged ring mount, one booster quick disconnect, water-cooled steel deflector plate, hydraulic chopsticks. Being rebuilt with a flame trench and new mount; expected back in 2027.
- suggested **id: `ground.lc39a`**, name: LC-39A, Kennedy Space Center. Function: first Florida Starship pad. Detail: Tower with electromechanical chopsticks, SQD arm load-tested, trench deluge tested several times, first top-deck deluge test around 2026-09-24/25, tank farm storing and subcooling LN2, LOX and methane, hardened roof being added for ship catches. Not yet licensed for Starship. Specs: first launch NET 2026-10-30 (provisional).
- suggested **id: `ground.slc37`**, name: SLC-37, Cape Canaveral. Function: future two-pad Starship complex (37A, 37B). Detail: 37A tower stacked with the new roof; mount being welded at the Roberts Road site; trench floor poured; shared deluge farm; 37B has piles only.

## Uncertain or conflicting

- **Flight 14 orbit.** NSF reports 262 x 277 km at 32 degrees; Jonathan McDowell (via Wikipedia) reports 262 x 275 km at 30.5 degrees. The planned inclination was 32 degrees (NSF). Treat 30.5 vs 32 as disputed.
- **Flight 14 insertion burn engine count.** SpaceX says a single Raptor sea-level engine; Spaceflight Now wrote that two Raptors were used. Use SpaceX.
- **Flight 14 splashdown time.** SpacePolicyOnline and Wikipedia give T+3:08:27; NSF gives T+3:08:30; Space.com says "T+3 hours, 9 minutes". Teslarati wrote the ship "completed roughly 6 orbits", which contradicts SpaceX's account of an early return after the first checkpoint; ignore that claim.
- **Flight 14 liftoff time.** Space.com's lead says 8:46 a.m. EDT; the same blog, SpaceX (7:48 a.m. CT) and NSF (7:48:59 CDT) agree on 7:48 to 7:49 CDT. Use 12:48:59 UTC.
- **Number of booster catches.** SpaceX mission pages list "Mechazilla" as the return site for Flights 5, 7 and 8 only, and NSF names Boosters 12, 14 and 15 as caught. Spaceflight Now (2026-09-28) wrote "four times". The dossier uses three.
- **Flight 12 booster.** Scientific American's same-day article said the booster splashed down "as intended"; SpaceX says it made a partial boostback and a hard splashdown, and NSF says it blew up before hitting the water. Use SpaceX.
- **Flight 12 propellant load start.** NSF says Flight 12 loading began at T-38:53 and was shortened for Flight 13; SpaceX's current Flight 12 page shows the same T-37:30 start as Flight 13. The page may have been reused; minor.
- **Event speeds and altitudes for V3 flights.** SpaceX's webcasts show live speed and altitude, but SpaceX's published timelines do not include them and I found no citable, archived text giving V3 speed and altitude at MECO, staging, SECO, entry or peak heating. Known values: orbit about 262 x 275 km (F14); Flight 12 payload deploy at about 195 km (Scientific American, reported); Flight 2 (V1) ship reached about 150 km and about 24,000 km/h near the end of its burn, and the Flight 2 booster broke up at about 90 km (SpaceX, official); Flight 1 apogee about 39 km (SpaceX). The page should show "not published" for the other V3 events rather than invent values.
- **Peak heating time.** Not in SpaceX's published timelines. It lies between entry interface and the transonic point.
- **Hot staging engines on V3.** SpaceX said "all but three" booster engines shut down for hot staging on V1 and V2. The V3 timelines say "most engines cut off" without a number.
- **Starship V3 liftoff thrust.** SpaceX's V3 update gives Raptor 3 sea-level thrust as 250 tf (up from 230 tf), which yields 8,250 tf (80.9 MN) for 33 engines. Musk has previously cited 280 tf for Raptor 3, and Payload Space repeated 280 tf; 33 x 280 would be 9,240 tf. Press accounts of V3 give "about 18 million pounds (about 80 MN)", consistent with 250 tf. The engine dossiers own this number.
- **Starship V3 height.** 124.4 m (408 ft) per Space.com; "124 m" per Scientific American and Spaceflight Now. SpaceX's own vehicle page could not be rendered for a figure. V3 is reportedly about 1.5 m taller than V2.
- **Pad 2 tower height.** Not published. One secondary listing gives 474 ft (144.5 m); unverified. Pad 1's tower is about 480 ft (146 m) per a 2021 FAA letter.
- **Propellant loading temperatures.** SpaceX has not published Starship's LOX or methane loading temperatures. Physics bounds them: subcooled LOX must be between its freezing point (54.4 K) and boiling point (90.2 K), subcooled methane between 90.7 K and 111.7 K. For comparison only, Falcon 9 has been reported to load LOX at about -207 C (66 K). Do not state a Starship value.
- **Saturn V LEO payload.** Figures of about 118 t, 130 "tons" (Space.com, citing NASA, unit unclear) and 140 t (includes the S-IVB stage and residual propellant in some accountings) all circulate. Mark as disputed.
- **SLS Block 1 LEO payload.** NASA's fact sheet says a minimum of 70 t; later NASA charts and secondary sources give about 95 t. Mark as disputed.
- **N1 thrust.** RussianSpaceWeb gives 4,500 tf (44.1 MN); other sources give 45.4 MN (about 4,630 tf).
- **New Glenn thrust.** Blue Origin's baseline is 3.85 Mlbf (7 BE-4s). Blue Origin announced BE-4 thrust increases from the third mission onward; some listings show 4.48 Mlbf for an upgraded 7x2. The currently flying value could not be confirmed (Blue Origin's site returned HTTP 429).
- **Diameters of Saturn V (10.1 m) and SLS core (8.4 m).** Widely published but not re-verified against a primary source in this session.
- **Flight 15 and Flight 16 dates.** From CADENA air traffic planning slides reported by NSF, not SpaceX announcements. NSF itself calls them provisional and likely to slip. Flight 16 also needs an FAA license for LC-39A.
- **Propellant transfer demo timing.** SpaceX said in October 2025 that the long-duration flight and the ship-to-ship transfer were both targeted for 2026; a November 2025 internal schedule reported by Politico said June 2026. Neither had flown by 2026-09-29, and no new public date was found.
- **Artemis III and IV.** NASA's July 2026 article describes Artemis III as a 2027 Earth-orbit docking test and puts crewed landings in 2028. The mission number for the first landing (Artemis IV) comes from press reporting.
- **Mars 2026 window.** Musk said in May 2025 that the chance of sending uncrewed Starships in late 2026 was about 50/50, and SpaceX's May 2025 plan called for about five ships. As of 2026-09-29 no Mars launch is announced for the window that opens around November 2026. The claim that SpaceX's website lists Mars cargo "no earlier than 2028" at $100 million per tonne comes from a secondary source (ScienceBlog) and could not be confirmed on the JavaScript-rendered SpaceX page. ScienceBlog's statement that the 2026 opportunity "passed" is premature, since the window had not opened by its publication date.
- **Starship V4.** The 142 m stack, 9-engine ship and about 200 t reusable payload come from Musk's May 2025 employee talk as reported by NSF. Claims of 10,000 tf, 300 tf per engine and a 2027 debut come from lower-tier secondary sources without links to Musk's posts. Treat all V4 numbers as goals.
- **Not public.** Exact tank farm capacities at Starbase, Pad 2 deluge flow rates, chopstick closing speeds, the ship catch hardware on V3, the V3 booster landing-burn propellant reserve, and detailed Flight 12 to 14 mishap findings beyond SpaceX's summaries.

## Sources

1. SpaceX, "Starship Flight 14" mission page (timeline and post-flight summary), 2026-09-28. https://www.spacex.com/launches/starship-flight-14 (content read via https://content.spacex.com/api/spacex-website/missions/starship-flight-14)
2. SpaceX, "Starship's Thirteenth Flight Test", 2026-07-24. https://www.spacex.com/launches/starship-flight-13
3. SpaceX, "Starship's Twelfth Flight Test", 2026-05-22. https://www.spacex.com/launches/starship-flight-12
4. SpaceX, "Introducing Starship V3", 2026-05-12. https://www.spacex.com/updates#starship-v3
5. SpaceX, "Starship to Orbit", 2026-09-15. https://www.spacex.com/updates#orbital-starship
6. SpaceX, "To the Moon and Beyond", 2025-10-30. https://www.spacex.com/updates#moon-and-beyond
7. SpaceX, "Evolving the Multi-User Spaceport", 2025-09-18. https://www.spacex.com/updates#multiuser-spaceport
8. SpaceX, "Upgrades Ahead of Starship's Second Flight Test", 2023-09-08. https://www.spacex.com/updates#starship-upgrades
9. SpaceX, "Starships Are Meant to Fly", 2024-09-10. https://www.spacex.com/updates#starships-fly
10. SpaceX, "Starship Static Fire Update" (Ship 36), 2025-06-19. https://www.spacex.com/updates#starship-static-fire-update
11. SpaceX, mission pages for Flights 1 to 11 and the launches list, 2023-04-20 to 2025-10-13. https://www.spacex.com/launches/starship-flight-test, https://www.spacex.com/launches/starship-flight-2 through https://www.spacex.com/launches/starship-flight-11 (read via content.spacex.com/api/spacex-website/missions/<slug> and /launches-page-tiles)
12. SpaceX, "First Starship Interplanetary Human Spaceflight Mission", 2026-05-21. https://www.spacex.com/updates#first-starship-interplanetary-mission
13. NASASpaceflight.com, Ryan Weber, "Ship 41 Makes it to Orbit, Booster 21 Nearly Perfect", 2026-09-27 (updated after launch 2026-09-28). https://www.nasaspaceflight.com/2026/09/starship-flight-14-orbit/
14. NASASpaceflight.com, Ryan Weber, "Starship Flight 13 achieves new firsts for SpaceX", 2026-07-23 (updated after launch). https://www.nasaspaceflight.com/2026/07/starship-flight-13-flight/
15. NASASpaceflight.com, Ryan Weber, "SpaceX's new Starship pad readies for first launch", 2026-05-13. https://www.nasaspaceflight.com/2026/05/spacex-starship-pad-first-launch/
16. NASASpaceflight.com, Jake Rees, "Starbase Pad 2: Design Advancements from Pad 1", 2025-08-19. https://www.nasaspaceflight.com/2025/08/starbase-pad-2-advancements-pad-1/
17. NASASpaceflight.com, Ryan Weber, "Starbase Infrastructure Advances Toward Flight 14", 2026-09-06. https://www.nasaspaceflight.com/2026/09/starbase-infrastructure-spacex-flight-14/
18. NASASpaceflight.com, Ryan Weber, Ship 41 and Booster 21 wet dress rehearsal article, 2026-09-23. https://www.nasaspaceflight.com/2026/09/ship-41-booster-21-wdr/
19. NASASpaceflight.com, Alejandro Alcantarilla Romera and Chris Bergin, "Flight 14 approaches as a near-term manifest sketches Starship's next steps", 2026-09-25. https://www.nasaspaceflight.com/2026/09/flight-14-starships-forward-path/
20. NASASpaceflight.com, Chris Bergin, "Starship's upcoming missions: Waiting on Orbit, Building toward Cape", 2026-09-18. https://www.nasaspaceflight.com/2026/09/starships-upcoming-missions-orbit-cape/
21. NASASpaceflight.com, East Coast Starship launch site and facility progress, 2026-09-01. https://www.nasaspaceflight.com/2026/09/launch-site-facility-progress-east-coast-starship/
22. NASASpaceflight.com, Eleanor Day and Chris Bergin, "Ship 42 wraps chopsticks tests, Flight 14 moves to NET Sept. 22", 2026-09-14. https://www.nasaspaceflight.com/2026/09/ship-42-chopsticks-tests-flight-14-net/
23. NASASpaceflight.com, Ryan Weber, "Super Heavy Block 3 the Booster of the Future", 2026-05-18. https://www.nasaspaceflight.com/2026/05/super-heavy-block-3-booster-future/
24. NASASpaceflight.com, Ryan Weber, "The Future of the Starship Program, Block 3 and Mars", 2025-05-30. https://www.nasaspaceflight.com/2025/05/future-starship-block-3-mars/
25. NASASpaceflight.com, "Booster 18 anomaly during proof testing", 2025-11-21. https://www.nasaspaceflight.com/2025/11/booster-18-anomaly-proof-testing/ (also Engadget, "The booster for SpaceX's Starship V3 suffered a gas system failure during testing", 2025-11. https://engadget.com/science/space/the-booster-for-spacexs-starship-v3-suffered-a-gas-system-failure-during-testing-181459063.html)
26. SpacePolicyOnline, Marcia Smith, "Starship Achieves Orbit for the First Time", 2026-09-28. https://spacepolicyonline.com/news/starship-achieves-orbit-for-the-first-time/
27. Spaceflight Now, William Harwood, "Starship returns to Earth; rocket splashes down north of Hawaii after three-hour flight", 2026-09-28. https://spaceflightnow.com/2026/09/28/starship-returns-to-earth-rocket-splashes-down-north-of-hawaii-after-three-hour-flight/
28. Spaceflight Now, Will Robinson-Smith, "Launch preview: SpaceX to launch first Starlink V3 satellites to orbit on Starship", 2026-09-28. https://spaceflightnow.com/2026/09/28/live-coverage-spacex-to-launch-first-starlink-v3-satellites-to-orbit-on-starship/
29. Space.com, Josh Dinner, "SpaceX Starship Flight 14 live updates", 2026-09-28. https://www.space.com/news/live/spacex-starship-flight-14-live-updates-sept-28-2026-starship-first-orbital-launch-attempt
30. CNN, Jackie Wattles and others, "SpaceX Starship splashes down after reaching orbit in unprecedented test flight" (live coverage), 2026-09-28 to 2026-09-29. https://www.cnn.com/2026/09/28/science/live-news/spacex-starship-flight-14-launch
31. Scientific American, "SpaceX's Starship lifts off in make-or-break orbital test flight", 2026-09-28. https://www.scientificamerican.com/article/spacexs-starship-lifts-off-in-make-or-break-orbital-test-flight/
32. Scientific American, "SpaceX launches Starship V3, the world's most powerful and tallest rocket ever", 2026-05-22. https://www.scientificamerican.com/article/spacex-launches-starship-v3-the-worlds-most-powerful-and-tallest-rocket-ever/
33. Space.com, "SpaceX fuels up Starship V3 megarocket for 1st time ahead of crucial test flight (photos)", 2026. https://space.com/space-exploration/launches-spacecraft/spacex-fuels-up-starship-v3-megarocket-for-1st-time-ahead-of-crucial-test-flight-photos
34. NASA, "How NASA's Artemis III Lander Test Will Pave Way for Moon Landings", 2026-07-15. https://www.nasa.gov/directorates/esdmd/artemis-campaign-development-division/human-landing-system-program/how-nasas-artemis-iii-lander-test-will-pave-way-for-moon-landings/
35. Jonathan McDowell (@planet4589) on X, Flight 14 orbital elements, 2026-09 (found via the Wikipedia article "Starship flight 14", used as a pointer only). https://x.com/planet4589/status/2104691411748802577
36. MyRGV, "Flight 13 launches: All mission goals met, Starship makes soft splashdown", 2026-07-24. https://myrgv.com/alerts-brh/2026/07/24/flight-13-launches-all-mission-goals-met-starship-makes-soft-splashdown/
37. SpaceNews, Jeff Foust, "SpaceX scales back plans for next Starship launch", 2026-08-21. https://spacenews.com/spacex-scales-back-plans-for-next-starship-launch/
38. Audrey Decker (Politico Pro) on X, SpaceX internal HLS schedule, 2025-11. https://x.com/audrey_decker9/status/1989352112728510935
39. ScienceBlog, SpaceX Mars deadlines 2016 to 2028, 2026-08-15. https://scienceblog.com/t-spacex-mars-deadlines-2016-2018-2022-2026-2028/
40. CNBC, "FAA warns SpaceX that massive Starship launch tower in Texas is unapproved", 2021-07-14. https://www.cnbc.com/2021/07/14/faa-warns-spacex-it-has-not-approved-new-texas-launch-site-tower.html
41. FAA, Final Tiered Environmental Assessment for SpaceX Starship/Super Heavy Vehicle Increased Cadence at the SpaceX Boca Chica Launch Site (quoted by NSF [16]; the FAA document itself was not re-read in this session). https://www.faa.gov/media/94346
42. NASA, "Space Launch System" NASA Facts sheet (Block 1: 322 ft, 8.8 million lb thrust, minimum 70 t). https://www.nasa.gov/sites/default/files/files/SLS-Fact-Sheet_aug2014-finalv3.pdf
43. NASA, "Preparing Saturn V for Apollo 13" image article (363 ft, 7.5 million lb thrust), 2020-04-06. https://www.nasa.gov/image-article/preparing-saturn-v-apollo-13-march-24-1970/
44. Space.com, "Saturn V: The mighty U.S. moon rocket". https://www.space.com/saturn-v-rocket-guide-apollo
45. RussianSpaceWeb, Anatoly Zak, "N1 moon rocket". https://russianspaceweb.com/n1.html
46. SpaceX, Falcon 9 vehicle page (70 m, 3.7 m, 7,607 kN, 22,800 kg to LEO), cross-checked with Next Spaceflight. https://www.spacex.com/vehicles/falcon-9/ and https://nextspaceflight.com/rockets/3
47. SpaceX, Falcon Heavy vehicle page (70 m, 12.2 m, 22,819 kN, 63,800 kg to LEO), cross-checked with SatNow and Space Launch Now listings. https://www.spacex.com/vehicles/falcon-heavy/ and https://www.satnow.com/launch-vehicle-details/falcon-heavy
48. Satellite Today, "Blue Origin Targets Super-Heavy Class New Glenn Variant", 2025-11-20 (New Glenn 7x2: 45 t LEO; 9x4 over 70 t), with Blue Origin's New Glenn page for 3.85 Mlbf. https://www.satellitetoday.com/launch/2025/11/20/blue-origin-targets-super-heavy-class-new-glenn-variant/ and https://www.blueorigin.com/new-glenn
49. Space.com, "Elon Musk says SpaceX will launch its biggest Starship yet by year's end, but Mars in 2026 is '50/50'", 2025-05. https://www.space.com/space-exploration/private-spaceflight/elon-musk-says-spacex-will-launch-its-biggest-starship-yet-this-year-but-mars-in-2026-is-50-50
50. Teslarati, "SpaceX turned a heralding moment for Starship into its greatest", 2026-09-28 (cited only for a claim flagged as wrong). https://www.teslarati.com/starship-14-orbit/
51. NIST Chemistry WebBook, Oxygen (phase change data). https://webbook.nist.gov/cgi/cbook.cgi?ID=C7782447
52. NIST Chemistry WebBook, Methane (phase change data). https://webbook.nist.gov/cgi/cbook.cgi?ID=C74828
