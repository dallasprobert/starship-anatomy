# Starship Anatomy: build contract for view modules

Read this whole file before writing code. Then read `index.html` (page shell and CSS component library) and
`js/core.js` (the shared runtime, `window.SX`). Both exist and work; build against them, do not edit them.

## What we are building

A single-page, highly interactive, **accurate**, beautiful educational explainer of SpaceX Starship V3:
the Super Heavy booster, the Starship upper stage, and above all the **Raptor 3** engine. The reader can click any
component anywhere on the page to open the **inspector** (right-hand drawer) with a breadcrumb, explanation,
sourced specs, and child components, and can drill down into more detailed sectional / exploded views.

Audience: curious, technical adults (engineers, space fans, students). Explain the *why*, not just the *what*.
Quality bar: something a SpaceX engineer would find accurate and a designer would find polished.

## Files and ownership

```
index.html          shell + CSS tokens/components (owner: lead, do not edit)
js/data.js          window.SX_DATA generated from research/facts.json (do not edit)
js/core.js          SX runtime (do not edit)
js/<view>.js        ONE file per view module, written by exactly one builder
research/*.md       sourced dossiers (01 Raptor program, 02 Raptor internals, 03 Super Heavy, 04 Starship, 05 flight/ground/history)
research/facts.json canonical numbers (same content as js/data.js)
research/VERIFY.md  fact-check notes, conflicts, unknowns
tools/shoot.py      headless Chromium check + screenshot tool
```

Your module file must be self-contained: its CSS (injected with `SX.css`), its part nodes (`SX.addParts`), any
extra facts (`SX.addFacts`), and its view registration (`SX.register`). Scripts are classic (not ES modules):
wrap your file in an IIFE, `'use strict'`, no globals except through `SX`. Three.js r147 is loaded as the global
`THREE` with `THREE.OrbitControls`, `THREE.RoomEnvironment`, `THREE.BufferGeometryUtils` (UMD). No other libraries.

Mount points already exist in index.html: `<div class="mount" data-view="NAME">`. Your `init(mount)` builds
everything inside it. Core adds class `v-NAME` to the mount: scope ALL your CSS under `.v-NAME`.

## Runtime API (js/core.js)

```js
SX.register(name, { title, parts: [ids this view can show], init(mount), focus(partId) })
SX.addParts([{ id, parent, name, short?, kind, summary, body: [paragraph HTML], specs: [{label, fact?} | {label, value, unit?, conf?}], related?: [ids], order?, view? }])
SX.addFacts({ 'my.key': { v, unit, conf: 'official'|'reported'|'estimate'|'disputed', src: ['S#'], note } }, { S99: { title, publisher, date, url } })
SX.data            // { asOf, sources, facts, timeline, flights, comparisons } from research/facts.json
SX.fact(key) / SX.val(key, fallback)
SX.fmt(key, {to?, digits?})          // formatted with unit, honours the Metric/US toggle
SX.fmtValue(number, unit, opts)      // same for computed numbers
SX.factHTML(key, opts)               // clickable inline fact span with confidence dot + source popover
SX.withFacts('text {{raptor.r3.thrustSL}} text {{raptor.r3.thrustSL|kN}}')  // tokens -> fact spans
SX.renderFacts(rootEl)               // fill [data-fact] spans you inserted (core does this once after init)
SX.on('units', fn)                   // re-render any canvas/SVG text that shows unit values
SX.select(id) / SX.on('select', (id, opts) => ...)   // selection drives the inspector; highlight your parts on it
SX.hover(id) / SX.on('hover', ...)
SX.show(id, viewName?)               // scroll to a view, init it, call its focus(id), open inspector
SX.tip.show(html, clientX, clientY) / SX.tip.hide()
SX.el(tag, attrs, ...kids) / SX.svg(tag, attrs, ...kids) / SX.css(text) / SX.color('--lox')
SX.loop(el, (dt, t) => {...})        // per-frame callback while el is on screen; returns stop()
SX.reducedMotion, SX.coarse (touch), SX.clamp, SX.lerp, SX.ease, SX.smooth, SX.esc
SX.three.stage(el, {position, target, fov, minDistance, maxDistance, exposure})
   -> st { THREE, scene, camera, renderer, controls, canvas, overlay, holder,
           onFrame((dt, t) => {}), pick(targets, {onClick(hit, ev), onHover(hit, ev)}), hitTest(x, y),
           fly(target, position, ms), frame(object3d, {dir, pad, ms}), label(html, () => Vector3, {className}), render() }
   hit = { id, object, point } | null. Picking skips invisible objects and fragments cut away by clipping planes.
   Renderer: sRGB output, ACES tone mapping, localClippingEnabled = true, a RoomEnvironment env map for metals.
   The element passed to stage() must have a CSS height. On touch screens core adds a "Rotate" toggle.
SX.three.lathe([[r, y], ...], segments) / SX.three.tag(obj, partId) / SX.three.partOf(obj) / SX.three.highlight(obj, color|null, intensity)
   highlight() changes emissive on every material under obj: give each part its OWN material instances.
window.__sx.step(n)  // advance all loops/stages n frames synchronously (headless verification)
```

Inspector "Show in ..." buttons list every view whose `parts` includes the id, using the view `title`.
Use these titles: stack3d `3D stack`, booster `booster cutaway`, ship `ship cutaway`, raptor3d `3D engine`,
raptorcycle `flow schematic`, raptorlab `engine lab`, flight `flight profile`.

## Part ids (fixed; use exactly these so views can link to each other)

Owner writes each node's `name/kind/summary/body/specs`. Others may reference the id (views `parts`, `related`, `SX.select`).
Core already registers the roots `stack, booster, ship, raptor3, flight, ground` with short summaries; owners
re-add them with full content (fields merge).

- **stack3d** owns `stack` (content only).
- **booster** owns `booster` and: `booster.hsr` (hot-staging ring / interstage), `booster.gridfins`, `booster.catch`
  (catch points for the tower arms), `booster.ch4Tank`, `booster.commonDome`, `booster.loxTank`, `booster.downcomer`
  (methane transfer tube through the LOX tank), `booster.chines`, `booster.pressurization`, `booster.avionics`,
  `booster.thrustSection`, `booster.engineShield`, `booster.landingTank` (V3 separate LOX landing tank), `booster.enginesCenter`, `booster.enginesInner`, `booster.enginesOuter`.
- **ship** owns `ship` and: `ship.nose`, `ship.headerLOX`, `ship.payloadBay`, `ship.flapsFwd`, `ship.flapsAft`,
  `ship.ch4Tank`, `ship.commonDome`, `ship.loxTank`, `ship.headerCH4`, `ship.heatShield`, `ship.rcs`, `ship.catchPins`,
  `ship.transferPorts`, `ship.avionics`, `ship.engineBay`, `ship.enginesSL`, `ship.enginesVac`.
  (If research shows a part does not exist on V3, keep the id but say so plainly in its summary.)
- **raptor3d** owns `raptor3` and: `raptor3.gimbal`, `raptor3.loxInlet`, `raptor3.ch4Inlet`, `raptor3.otp`,
  `raptor3.otp.pump`, `raptor3.otp.turbine`, `raptor3.otp.shaft`, `raptor3.ftp`, `raptor3.ftp.pump`, `raptor3.ftp.turbine`,
  `raptor3.ftp.shaft`, `raptor3.opb`, `raptor3.fpb`, `raptor3.oxDuct`, `raptor3.fuelDuct`, `raptor3.injector`, `raptor3.mcc`,
  `raptor3.regen`, `raptor3.nozzle`, `raptor3.igniters`, `raptor3.controller`, `raptor3.press`, `raptor3.rvac`.
- **raptorcycle** owns `raptor3.cycle`, `raptor3.cycle.fuelPath`, `raptor3.cycle.oxPath`, `raptor3.startup`,
  `raptor3.cycles` (engine cycle comparison) and `cycles.gg`, `cycles.orsc`, `cycles.frsc`, `cycles.exp`, `cycles.ffsc`.
  Its schematic also lists the raptor3.* component ids in `parts` (so "Show in flow schematic" appears for them).
- **raptorlab** owns `raptor3.evolution`, `raptor3.evolution.r1`, `raptor3.evolution.r2`, `raptor3.plume`, `raptor3.physics`.
- **flight** owns `flight`, `ground`, and: `flight.liftoff`, `flight.maxq`, `flight.meco`, `flight.hotstage`,
  `flight.boostback`, `flight.boosterLanding`, `flight.seco`, `flight.coast`, `flight.entry`, `flight.flip`, `flight.landing`,
  `ground.tower`, `ground.chopsticks`, `ground.olm`, `ground.qd`, `ground.deluge`, `ground.tankfarm`.

Parent of each id is the prefix before the last dot (`raptor3.otp.pump` -> `raptor3.otp`), except
`raptor3.cycles` children `cycles.*` (parent `raptor3.cycles`) and the stated roots.
You may add extra child ids under your own ids (e.g. `raptor3.injector.elements`) if they carry real content.

## Research findings every builder must respect

- Raptor 3 FLIGHT rating on V3 is 250 tf at sea level (`raptor.r3.thrustSL`); Raptor Vacuum 3 is 275 tf (`raptor.rvac3.thrust`).
  280 tf (`raptor.r3.thrustSLDemonstrated`) is the August 2024 ground-test spec, not the flight rating. Show both correctly.
- SpaceX's 350 s Isp figure carries no condition (`raptor.r3.ispVac` is disputed); sea-level Isp is an estimate. 350 bar chamber
  pressure was demonstrated in a 2023 test; the flight-rating chamber pressure is not published. Say so where relevant.
- V3 booster: 3 grid fins (larger, and they are the catch points), an integrated hot stage (no jettisoned ring), no individual
  engine shrouds, a methane transfer tube roughly the size of a Falcon 9 first stage, a separate LOX landing tank, 2 quick
  disconnects, all 33 engines can relight (Flight 13 flew a 33-engine boostback), landing burn 13 then 5 then 3 engines.
- Raptor 3 ignition: SpaceX confirms a redesigned ignition system; acoustic igniters are REPORTED (NSF), not confirmed.
  Spin start with gaseous oxygen and methane is reported. Most Raptor internals (turbopump stages, layout, station
  pressures and temperatures) are community analysis: `conf: 'estimate'`, and the copy says so.
- Status as of 2026-09-29: 14 integrated flights; V3 flew Flights 12, 13 and 14; Flight 14 (2026-09-28) was the first to reach
  orbit and deployed 26 Starlink V3 satellites. No V3 booster and no ship has been caught yet (3 first-generation booster catches).
- The timeline in facts.json is the Flight 14 plan with notes on what actually happened.

## Accuracy rules (the most important section)

1. Every hard number shown to the reader comes from `SX.data.facts` via `SX.fmt` / `SX.factHTML` / `{{key}}` /
   spec `{fact: key}`. Never hard-code a number that exists in facts. Grep `research/facts.json` for keys.
2. A number you need that is not in facts: add it with `SX.addFacts` including a real source (reuse an existing `S#`
   from facts.json if it covers it, or add a new source with a real URL from the dossiers) and an honest `conf`.
   Derived numbers (e.g. T/W computed from thrust and mass) are `conf: 'estimate'` with a note showing the math.
3. Ground every explanation in the dossiers (`research/*.md`) and `research/VERIFY.md`. Where the public record is
   thin (most Raptor internals), say so in the copy ("SpaceX has not published...", "public analysis suggests...").
   Do not invent part counts, temperatures, pressures, speeds, dates or flight outcomes.
4. Diagrams are schematic but proportions should follow real dimensions where known (heights, diameters, tank
   split, engine layout). Put a small "Schematic, not to scale" or "Proportions from published dimensions" note on each.
5. Version discipline: the page shows V3 with Raptor 3. When you mention V1/V2 or Raptor 1/2, label them.

## Writing rules

- **Never use an em dash or an en dash** (U+2014, U+2013) anywhere: copy, labels, comments, strings. Use commas,
  colons, periods, parentheses. For ranges use a hyphen or "to". Also no emoji.
- Plain, direct, active sentences. Name things the way people recognize them. Avoid mannered devices
  ("not X, but Y", colon reveals, "worth noting", scare quotes).
- Explain why things are the way they are (the physics and the engineering trade-off), briefly and correctly.
- Section copy lives inside your mount. The sheet header (h2 + lede) is already in index.html.

## Design system (use it; do not invent a new look)

Single deliberate dark theme. Colors ONLY through CSS variables (in JS, `SX.color('--lox')` for Three.js/canvas):
`--bg --bg-2 --bg-3 --bg-4 --line --line-2 --grid --fg --fg-2 --muted --steel --steel-2 --accent (CAD selection yellow:
selection, focus, active states) --accent-soft --lox (liquid oxygen) --ch4 (liquid methane) --oxgas (oxygen-rich hot gas)
--fuelgas (fuel-rich hot gas) --mix (combustion products) --plume --tile (heat-shield black) --copper --good --warn --bad`.
The propellant colors are semantic and must mean the same thing in every view. In SVG, set colors with CSS
(`style="fill:var(--lox)"` or classes), not presentation attributes.

Fonts: `--font-display` (Saira Condensed: headings, uppercase), `--font-body` (IBM Plex Sans), `--font-mono`
(IBM Plex Mono: labels, data, readouts). Use `font-variant-numeric: tabular-nums` for changing numbers.

Classes available from index.html: `.eyebrow .h3 .h4 .lede .prose .mono .num .muted .small`, `.btn .btn-sm .btn-ghost
.btn-primary` (and `aria-pressed="true"` for toggles), `.seg` (segmented control of buttons with aria-pressed), `.chip`,
`.chip-row`, `.range-row` (label + input[type=range] + output), `.panel .panel-pad .callout .spec-table .legend .sw.lox`
(etc.), `.viz` (figure frame with dark radial ground) + `.viz-grid` (blueprint grid) + `.viz-toolbar` (overlay controls)
+ `.viz-hint`, SVG helpers `.svg-label .svg-label-muted .svg-leader .svg-dim`, `.part` with `.is-hover` / `.is-selected`.

Layout: the mount spans the content width (max 1320px minus gutters). Use CSS grid with `gap`, `minmax(0, 1fr)`
columns, stacking to one column below ~900px. Every text column max ~66ch. Must work at 390px wide with no
horizontal page scroll (wide SVGs scale down or sit in their own `overflow-x:auto` box). 3D canvases need an
explicit height (e.g. `height: clamp(420px, 70vh, 720px)`).

Craft: engineering-drawing vocabulary (leader lines with small end dots, dimension lines with ticks, section
markers like "A-A", hairline 1px strokes, mono labels in caps). Restraint: the drawing is the star.

## Interaction rules

- Every visible component is clickable: `SX.select(id)`. Hover gives a highlight and `SX.tip` with name + one line.
- Listen to `SX.on('select', id => ...)` and highlight your matching part (`.is-selected` or 3D emissive with
  `SX.color('--accent')`), and clear it when another id is selected.
- `focus(id)` must visibly bring that part forward: fly the camera to it, open the relevant sub-panel, scroll the
  element into view, pulse it.
- SVG parts: `tabindex="0" role="button" aria-label="..."`, Enter/Space selects. Visible focus.
- Respect `SX.reducedMotion` (no auto-play loops; jump instead of tween). Animations only run when on screen
  (`SX.loop`, stages handle this).
- Performance: one WebGL context per 3D module at most; keep a scene under ~300k triangles; use InstancedMesh or
  merged geometry for repeated parts (engines, tiles).

## Verify your work (required)

1. `node --check js/<view>.js`
2. `python tools/shoot.py --selector "[data-view=<view>]" --out shots/<view>-desktop.png` and read the PNG with the
   Read tool. Also `--mobile`. Also `--eval "SX.show('<some id>')"` to test focus + inspector (use `--viewport` to
   see the inspector drawer). Other modules are being written in parallel: use `--filter <view>` to ignore their noise.
3. Fix every console error you cause, every unknown part id, every missing fact key, any overflow warning.
4. Look at the screenshots critically, like a designer: alignment, spacing, label collisions, legibility, whether
   the diagram actually teaches. Iterate until it is genuinely good.
