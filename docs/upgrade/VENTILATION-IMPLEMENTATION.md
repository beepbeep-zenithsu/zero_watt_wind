# Building ventilation implementation

This work upgrades the existing Application 1 in the same project. No alternate
versions, new simulation applications, new mathematics or npm dependencies were
introduced. Application 2 remains available. The updated project files on disk
are the deliverable; `SOURCE-DELIVERY.md` contains complete copyable sources.

## What changed

- `src/graphics/ventilation-vfx.js`: four pooled trail layers for wind, fresh
  intake, warm exhaust and mechanical transfer. Tubular paths have shader-driven
  traveling highlights. Geometry rebuilds only on layout or inspection-view
  changes, with four additional draw submissions for the full effect.
- Wind visibility/strength follows live wind. Window intake combines existing
  modeled background exchange with fan airflow. Exhaust and mechanical transfer
  are hidden at zero modeled airflow/power, including the manual brake. Trail
  travel speeds ease between values, without phase jumps when wind changes.
  Pause freezes their clocks. Flow hides the visualization without changing the
  simulation. These are illustrative model-driven paths, not CFD results.
- Intake routes cross the actual existing window openings. Exhaust routes
  converge on each installed fan and leave through the existing roof opening.
  The first unit's controller indicator remains attached and driven by hardware
  status after its enclosure is replaced. Its subtle activation pulse follows
  the scene clock and is independent of the Flow visibility toggle.
- `src/graphics/camera.js`: time-based orbit/zoom/reset easing, shortest-angle
  rotation, portrait-aware framing and expanded zoom distance for large layouts.
  Camera transitions continue while the simulation is paused. Reduced-motion
  preferences make camera changes immediate.
- `scene.js`: integrates VFX into the original RAF/render loop. Adds flow-focused
  inspection, component focus, automatic preset reframing after layout/diameter
  changes, and smooth transitions. The original rotor, signed bevel and reduced
  output rotation mappings remain intact. No new render loop was introduced.
- `app.js`: adds an **Air paths** camera control and three projected component
  callouts. Wind capture opens mechanical inspection; intake and exhaust focus
  on the room/fan. Close-up, Air paths, door state and Reset view button states
  stay synchronized. The same live model supplies every metric.
- `upgrade.css`: restrained component labels, a cyan/amber/bronze flow legend,
  refined readouts and active indicators, responsive annotation treatment and
  touch targets. All original controls and parameter definitions remain present.
- `src/graphics/site.js`: instanced floor tiles with real grout gaps, richer
  plaster, warm interior fixtures and a generated foundation contact texture.
  Tiles are one instanced draw; the contact treatment needs no extra render pass.
- `src/graphics/surfaces.js`: less pale air-mode color response, cooler glass,
  deeper structural colors and softer indoor/outdoor balance. Daylight uses the
  existing interior fill light; no heavy postprocessing stack or bloom was added.
- `scripts/blender/build_assets.py`: extends the existing library with contoured
  upholstered chairs, a gasketed controller enclosure with glands/fasteners, and
  a rolled exhaust shroud with concentric finger guard. The chair shares the
  original occupancy group, the controller retains its independent live LED,
  and the shroud remains stationary around the existing spinning fan pivot.

There is no motor or solar panel in the original core mechanism, so none was
invented. Original simplified occupants remain; their chairs were improved.
The existing roof, opening, door and window geometry is retained for functional
continuity. Cutaway glazing is more transparent so it reveals the interior.

## Blender sources and assets

Blender **5.2.2 LTS** actually generated all assets. The editable library is
`assets/zw-upgrade/zerowatt-library.blend`; its thirteen collections were
successfully reopened and checked. The three additional runtime assets are:

- `assets/zw-upgrade/chair.glb`
- `assets/zw-upgrade/controller.glb`
- `assets/zw-upgrade/fan-shroud.glb`

The ten prior library assets remain integrated. `manifest.json` lists exact
triangle, material-group and byte counts; `asset-validation.json` verifies the
exported geometry using the real runtime GLTFLoader. Shared cached GLB geometry
and PBR materials keep repeated chairs and machinery inexpensive. No external
textures or unlicensed assets were added. The 64px contact texture is generated
in memory and disposed when the room layout is retired.

The complete pre-change files and asset library are recoverable from
`.upgrade-baseline/ventilation-before.zip`. Earlier baseline backups remain.

## Run and regenerate

From `G:\new_8\zerowatt-wind-v8`:

```powershell
npm ci
npm run assets:build
npm run build
npm start
```

Use `http://localhost:5500`. If that port already belongs to your running project,
refresh the existing page after building. Stop that terminal with Ctrl+C before
running another `npm start`. This task did not terminate the process already
listening on 5500, and did not leave another server running.

Verification and geometry reviews:

```powershell
npm test
npm run verify:graphics
node tools/run-blender.cjs scripts/blender/validate_library.py
npm run assets:review
node tools/deliver-sources.cjs
```

`npm run preview` serves the same esbuild production bundle, after any existing
server is stopped. Assets remain document-relative for `/zero_watt_wind/` hosting.
Nothing was deployed or pushed.

## Verification results and practical limits

- Production esbuild build passes.
- Full test suite: **39 pass, 1 pre-existing voice test fails**. The unchanged
  failure is `tests/jarvis.test.cjs:123`: the parser treats `wind speed 12` as a
  command, while the fixture expects the prior value 2.5 to remain unchanged.
- **84/84 engineering baseline outputs match**, and the original `model.js`
  SHA-256 still matches the baseline. No engineering formulas were edited.
- **13/13 GLBs** parse through the actual r180 loader. All coordinates are finite,
  dimensions and pivots match expectations, and counts agree with Blender.
- **16/16 offline scene combinations pass** across both applications, clear/
  heat/rain/storm/night conditions as supported, one/maximum installations,
  moving/moored boats, original fan/paddle speed relationships and pause.
- Eleven targeted graphics, UI, opening, VFX and camera tests pass. New checks
  verify zero-output trail gating, retained background exchange, unchanged
  per-frame path buffers, window/fan alignment, live controller parenting,
  component-focus buttons, paused camera easing and portrait close-up framing.
- Blender renders of actual scene-mesh snapshots were visually inspected for
  floor/seat detail, cutaway clarity, machinery/shroud alignment and complete
  rotor framing. `air-blender-review.png` and `air-machinery-blender-review.png`
  are **Blender geometry reviews, not browser screenshots**. Their lighting
  differs from Three.js; trails are approximated at a frozen phase, and the UI
  is absent. They cannot validate WebGL shaders or browser layout.
- The user approved localhost browser inspection during this task. The browser
  tool nevertheless rejected the navigation because a **saved permission or
  managed policy** still denies `http://localhost:5500`. No alternative browser
  surface or policy workaround was used. Browser screenshots, shader compilation,
  browser console errors, fullscreen/touch behavior, actual phone layout and GPU
  FPS remain **unverified**. Final visual acceptance therefore remains pending.
- Scene-graph mesh/triangle counts are recorded in `scene-verification.json`.
  These are not measured GPU draw-call or performance benchmarks. Compact
  devices use fewer curve segments and the existing lower pixel/shadow settings.
- Blender reported a nonfatal OS thumbnail-cache write warning under the sandbox;
  actual GLBs and the BLEND source were saved and independently loaded.

`FILES.json` lists all source, binary and generated paths with hashes.
`SOURCE-DELIVERY.md` includes full final file texts and omits minified bundles.
