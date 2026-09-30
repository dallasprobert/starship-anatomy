# VERIFY: fact check of dossiers 01 to 05

Checked 2026-09-29 for the Starship explorer page. Output: `facts.json` (174 facts, 58 sources, an 18-event Flight 14 timeline, 14 flights, 8 comparison vehicles). Source ids below (S1, S2 ...) are the ids in `facts.json`.

## How the checks were done

- The session's web-search budget was already used up by the research agents, so every check below went straight to a known primary URL instead of a search.
- **SpaceX website.** The mission pages and updates are rendered by JavaScript. Their text was read from SpaceX's own content API (`content.spacex.com/api/spacex-website/missions/<slug>` and `/updates`), which serves the same page text. The vehicle-page numbers (heights, propellant, thrust, Raptor and RVac sizes) are not in that API. They are hard-coded in the site's Angular bundle, so the current Starship page chunk was downloaded from spacex.com and the metric tiles were read directly. The V2-era page came from the Internet Archive copy of 2025-03-13 (S10).
- **X posts.** SpaceX and Musk posts were read in full through the public syndication and fxtwitter endpoints, not through summaries.
- **Documents.** The FAA Appendix G PDF (2019) and FAA Tiered EA summary (2025) were downloaded and read as text. NASA pages and the SLS fact sheet were also read directly.
- **Press.** NASASpaceflight, Everyday Astronaut, SpacePolicyOnline, Space.com and Ars Technica pages were fetched and read in full. The April 2024 Raptor slide image was viewed directly.

## Results of the re-verification (most important and most at-risk facts)

| # | Fact | Dossier value | Checked against | Result |
|---|---|---|---|---|
| 1 | Raptor 3 sea-level thrust, flight rating | 250 tf | S2 (SpaceX V3 update text), S1 (vehicle page: 250 tf / 551 klbf) | Confirmed, official |
| 2 | Raptor 3 thrust 280 tf | ground-test spec | S3 (SpaceX X post, 2024-08-03), S22 (NSF: "start off at 250 ... final goal 280") | Confirmed: 280 tf is the 2024 spec and the goal, not the flight rating |
| 3 | Raptor Vacuum 3 thrust | 275 tf | S2, S1 | Confirmed, official |
| 4 | Raptor 3 Isp | 350 s, condition unlabeled | S3 full text; S13 (Musk: sea-level Raptor vacuum Isp ~350 s) | Confirmed unlabeled. Stored as vacuum Isp of the sea-level engine, conf "disputed" |
| 5 | Raptor 3 mass / with vehicle-side hardware | 1,525 / 1,720 kg | S3, S2 | Confirmed, official |
| 6 | Raptor 1 and 2 figures | 185 tf, 350 s, 2,080 / 3,630 kg; 230 tf, 347 s, 1,630 / 2,875 kg | S4 full post text | All confirmed, official |
| 7 | RVac 1 / 2 / 3 thrust | 200 / 258 / 306 (target) tf | S20 (SpaceX slide image viewed), S2 | Confirmed. RVac 1 = 200 tf upgraded from "reported" to official (SpaceX slide) |
| 8 | Raptor 3 chamber pressure | 350 bar demonstrated; flight value unknown | S12 (Musk post full text: "350 bar ... 269 tons") | Confirmed. The "330 bar" traced to S30: a 2022 "Raptor 2.5" target of 250 tf at 330 bar, not a Raptor 3 spec |
| 9 | Raptor 2 / Raptor 1 chamber pressure | 300 / 250 bar | S30 ("300 bar, up 50 bar from Raptor 1"); S18 (2019 model 3,669.5 psia = 253 bar) | Confirmed, reported |
| 10 | Raptor 2 / 1 sea-level Isp | 327 / 330 s | S30 | Confirmed, reported |
| 11 | Raptor 3 height and diameter | "not published" (01, 02); 2.9 x 1.3 m (04) | S1 (current vehicle page), S10 (2025 page) | **Dossier 04 correct.** SpaceX lists Raptor 1.3 m x 2.9 m and RVac 2.3 m x 4.4 m. The 3.1 m and 4.6 m figures are the Raptor 2 era values on the 2025 page |
| 12 | O/F, expansion ratio, exit diameter, film cooling (2019 engine) | 3.60; 34.34:1; 51.226 in; 1.2% | S18 (PDF text) | All confirmed, official for the 2019 engine only |
| 13 | Throttle floor | about 40% | S15 (Musk: max ~225 t, min ~90 t) | Confirmed for the 2020 engine; Raptor 3 not published |
| 14 | Gimbal range | 15 deg | S30 | Confirmed for Raptor 2; Raptor 3 not published |
| 15 | V3 booster / ship / stack heights | 72 / 52 / 124 m | S1 (72 m 236 ft; 52 m 171 ft; 124 m 407 ft) | Confirmed, official. 72.3 and 52.1 m are the reported precise values (sum 124.4 m) |
| 16 | Propellant | booster 3,650 t; ship 1,600 t | S1 | Confirmed. V2 era: 3,400 t and 1,500 t (S10, now official) |
| 17 | Liftoff thrust | 8,240 tf (03) vs 8,250 tf derived (01, 05) | S1 (8,240 tf / 18.1 Mlbf) | **8,240 tf official.** The derived 8,250 tf is replaced |
| 18 | Ship thrust | 1,614 tf vacuum | S1 | Confirmed. Cross-check: (1,614 - 825) / 3 = 263 tf vacuum thrust per sea-level engine, whose 13 tf gain implies about a 1.27 m exit, matching the 1.3 m engine diameter |
| 19 | Engine counts, gimbal and relight | 33 (3/10/20), 13 gimbal; 3 SL + 3 RVac; all 33 relight on V3 | S1 ("13 maneuverable ... remaining 20"), S2 (TVC on inner 13), S6 ("all 33 engines" in boostback) | Confirmed |
| 20 | V3 grid fins | 3, 50% larger | S2 | Confirmed, official |
| 21 | Heat-shield tile count | about 18,000 (V1 era) | S44 (CNBC current and archived copies) | **Not supported by the cited source.** The CNBC text says "thousands of the tiles". Kept as "reported" with a caveat |
| 22 | Flights 1 to 14: dates, pads, outcomes | dossier 05 table | S11, S7, S6, S5 (SpaceX mission pages and launches list) | Dates, pads and outcomes confirmed. Catch sites "Mechazilla" only on Flights 5, 7, 8, so 3 catches. Serials 12 to 14 confirmed in NSF (S22, S25, S27) |
| 23 | Flight 14 timeline | T+0:58 Max Q through T+9:50:30 | S5 content API (all entries) | All 23 planned entries confirmed exactly |
| 24 | Flight 12 and 13 timelines | Max Q T+0:45 / T+0:58; MECO 2:22 / 2:18 | S7, S6 | Confirmed |
| 25 | Flight 14 actuals | deorbit T+2:12:18; splash T+3:08:27 or 3:08:30; orbit 262 x 275/277 km | S27, S32, S33 | Confirmed as reported values (see conflicts) |
| 26 | Flight 13 T-0 abort | 4 vs 6 vs 2 engines | S26 (embedded SpaceX post), S25, S49 | SpaceX: four engines aborted at startup (ox turbopump issues). NSF: six swapped for moisture-related low LOX pump pressure. Musk: two to be swapped. All three are true statements about different things |
| 27 | Flight 12 mishap cause | heat effects and engine alarm settings | S35 (FAA statement) | Confirmed |
| 28 | FAA future-vehicle envelope | 35 engines, 103 MN, 9 ship engines | S19 Table ES.2 | Confirmed: upgraded Super Heavy 80 m, 35 engines, 103 MN, 4,100 t; upgraded Starship 70 m, 9 engines, 28.7 MN, 2,650 t |
| 29 | Program stats | 600 engines; >226,000 s R2; >40,000 s R3; ~5 t LOX transfer (Flight 3) | S9 text | Confirmed, official |
| 30 | Pad 2 and tower | electromechanical shorter chopsticks; 2 BQDs; 20 clamps; 700 US tons; 422,000 gal; Pad 1 tower 480 ft | S2, S29, S43 | Confirmed |
| 31 | Comparison vehicles | Saturn V, SLS, Falcon 9, Falcon Heavy | S36, S37, S38 (SpaceX site bundle) | Confirmed: Saturn V 363 ft / 7.5 Mlbf; SLS 322 ft / 8.8 Mlbf / 70 t minimum / 27.6 ft core; F9 70 m, 3.7 m, 7,607 kN, 22,800 kg; FH 70 m, 12.2 m, 22,819 kN, 63,800 kg |
| 32 | Mars cargo NET 2028 at $100 M per tonne | secondary source only (05) | S1 (text in SpaceX's current Starship page code) | **Upgraded to official** |
| 33 | Raptor 3 first firing | SN1 around 2024-08-08 | S21 (NSF: "reveal and first firing of the Raptor 3 engine"; Shotwell static-fire photo 2024-08-08) | Confirmed as reported; "Raptor V3" development hardware ran in May 2023 (S12) |
| 34 | Musk quotes | V4 300 tf goal; Raptor 3.x 300 t; new alloys, no 301; two grid fins; 78/22 split | S14, S16, S45, S46, S17 | All confirmed verbatim |

## Conflicts between dossiers and how they were resolved

1. **Raptor 3 dimensions.** Dossiers 01 and 02 said Raptor 3 height and diameter were unpublished and reused the 3.1 x 1.3 m Raptor 1/2 figures. Dossier 04 cited the SpaceX page: 2.9 x 1.3 m, RVac 2.3 x 4.4 m. The SpaceX page was checked and dossier 04 is right. Stored: `raptor.r3.height` 2.9 m, `raptor.rvac3.height` 4.4 m, `raptor.rvac3.exitDiameter` 2.3 m (official). Raptor 2 era values kept separately (3.1 m, 4.6 m).
2. **Liftoff thrust.** 8,240 tf (SpaceX page, dossier 03) against 8,250 tf (33 x 250, dossiers 01 and 05). Resolved to 8,240 tf official. The 9,240 tf figure (33 x 280) is wrong for flight.
3. **Stack height.** 124.4 m (dossier 05, Space.com) against 124 m (SpaceX, dossier 03). Resolved to 124 m official. 124.4 m is the sum of the reported precise stage heights.
4. **Propellant aboard at launch.** Dossier 05 turned SpaceX's "~12 million pounds" into about 5,440 t. The official capacities sum to 5,250 t (11.6 Mlb), so "~12 million" is a rounding. `stack.propTotal` = 5,250 t.
5. **V1/V2 booster propellant.** 3,400 t (dossier 03, SpaceX page) against 3,250 t (Wikipedia table). The archived SpaceX page (S10) says 3,400 t. Kept 3,400 t.
6. **V2 ship propellant.** Dossier 04 had about 1,500 t as "reported via Ringwatchers". The archived SpaceX page lists 1,500 t and 1,500 tf, so it is now official.
7. **Chamber pressure 330 bar.** All dossiers flagged it as unsourced. It traces to Everyday Astronaut (2022) describing a planned "Raptor 2.5" at 250 tf and 330 bar. The only official Raptor 3 figure is 350 bar (test, 2023). Stored 350 bar with an explanatory note. About 325 to 330 bar at 250 tf remains an estimate.
8. **Specific impulse labels.** SpaceX's 350 / 347 / 350 s are unlabeled (verified in the posts). Stored as `ispListed` (official) and `r3.ispVac` (disputed, meaning the vacuum Isp of the sea-level engine). The sea-level Isp is reported (330 / 327 s) for Raptor 1 and 2 and estimated (about 333 s) for Raptor 3 from SpaceX's own ship-thrust total.
9. **Flight 14 orbit.** NSF gives 262 x 277 km at 32 deg; McDowell (CelesTrak tracking of the deployed satellites) gives 262 x 275 km at 30.5 deg. Stored as disputed, with 262 x 275 km as the value because tracking data outranks a webcast readout. 32 deg was the planned inclination.
10. **Flight 14 splashdown.** T+3:08:27 (SpacePolicyOnline) against T+3:08:30 (NSF). Stored 3:08:27 (11,307 s).
11. **Flight 13 abort engine count.** Resolved as described in row 26: four failed to start (official), six replaced (reported), and Musk's two was an early statement. Launch commit criteria remain inconsistent in NSF's own reporting ("tolerate up to three startup failures" against "at least 31 of 33 running").
12. **Flight 13 boostback cut short.** SpaceX says only that it ended early; NSF says ice ingestion. Kept as reported.
13. **Booster catch count.** Three per SpaceX's launch records; Spaceflight Now's "four times" is wrong.
14. **FAA envelope source.** Dossier 01 cited the LC-39A EIS and dossier 02 the Air Force CCSFS EIS. Both describe the same future envelope. The FAA Tiered EA Table ES.2 was read and cited. It gives 28.7 MN for the ship, where dossier 01 had "about 28 MN".
15. **Tile count.** About 18,000 is repeated everywhere, but the source Wikipedia cites (CNBC 2021) does not contain the number. Kept as reported, with that caveat.
16. **Mars cargo pricing.** Dossier 05 flagged it as secondary-only. It is on SpaceX's own page, so it is now official.
17. **V1 vs V2 vs V3 naming.** SpaceX calls every booster through Flight 11 "first generation". The flights array records ship and booster generation separately (for example, "V2 ship, first-generation booster" for Flights 7 to 11).

## Timeline choice

The timeline uses the **official planned Flight 14 timeline** (the first orbital mission) because it is the only complete, citable V3 orbital profile. Each entry's note gives what actually happened. The deorbit came early at about T+2:12:18, and splashdown was at T+3:08:27 north of Hawaii instead of T+9:50:30 off Chile. Speeds and altitudes are **null wherever SpaceX has not published them**. The only filled values are liftoff and splashdown (zero), and the post-insertion orbit (about 270 km, about 28,000 km/h, from McDowell's orbit and SpaceX's "about 17,500 mph"). `peakHeat` is explicitly an estimate placed about 7 minutes after entry, because SpaceX does not publish it. Extra ids beyond the suggested set: `deployEnd`, `deorbit`, `transonic`.

## Remaining unknowns (not public as of 2026-09-29)

- Raptor 3 flight-rated chamber pressure, sea-level Isp (estimated), mixture ratio, throttle range, gimbal range, expansion ratio, throat size and unit cost.
- Raptor Vacuum 3 Isp, expansion ratio, mass and nozzle cooling method.
- Turbopump architecture: stage counts, shaft speeds, bearings and powers. All station pressures and temperatures in `facts.json` are Raptor 2 community estimates.
- Physical layout of the Raptor 3 powerhead. Placing the OTP on the centerline and the FTP on the side is inferred from photos.
- Raptor 3 igniter type and spin-start gas are confirmed only by NSF. SpaceX says only "redesigned ignition system" and "new Raptor startup method".
- Dry masses of the V3 booster and ship, stack liftoff mass (estimated about 5,700 t), expendable payload, and LOX/CH4 split (estimated).
- V3 tile count and material; peak heating time, rate and angle of attack.
- Speed and altitude at Max Q, MECO, staging, SECO, entry and peak heating on V3 flights.
- How many booster engines stay lit through V3 hot staging (NSF: 28 of 33 shut down on Flight 12).
- Pad 2 tower height; propellant loading temperatures.
- The V4 figures (142 m, 9 ship engines, 200 t, 300 tf per engine) are goals only. The 200 t S-1 quote was not re-read in this pass.
- Not re-verified in this pass (kept at the dossiers' confidence): the 354 s Raptor 3 test (NSF 2025), the V1 ship's roughly 100 t dry mass (Musk 2021), New Glenn and N1 figures, and the Ringwatchers V2 ship internals.
