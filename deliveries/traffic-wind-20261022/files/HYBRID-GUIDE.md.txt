# ZeroWatt Wind · Advanced hybrid ventilation

The existing Building Ventilation and Pond Aeration applications remain in place.
Building Ventilation now has independently selectable **Basic Mode** and **Advanced Mode**.
The original `model.js`, Basic machinery, weather controls, camera controls, voice,
hand and face implementations have not been replaced.

## Launch

Requires Node.js 18 or later. From this folder:

```sh
npm ci
npm run build
npm start
```

Open **http://127.0.0.1:5500/** and choose Building Ventilation → Advanced Mode.
The committed browser bundle and assets are already built; `npm start` is sufficient
for a delivered copy if you are not editing source. `START-SERVER.bat` also works.
Use HTTP rather than opening `index.html` as a file. No external asset CDNs are used.

## Explore

- **Higher wind/RPM:** Advanced wind now spans 0–60 m/s. Fan target spans 80–1200 RPM, and live rotor/fan RPM appears beneath the wind control. Wind-driven RPM can exceed the assistance target; the target governs electrical assistance. The educational model no longer plateaus at the old 360 W wind-power ceiling.
- **Traffic motion:** acceleration ramps, anticipatory bend speeds, gentle braking and eased heading run with fixed 120 Hz integration. Existing premium-model LOD loading and moving fallback vehicles are preserved.

- **City view** frames the full district in Basic, Advanced and Pond scenes. Reset camera returns to the installation. Drag to orbit and scroll to zoom.
- Street cars accelerate, queue, steer and rotate their wheels. Red/amber/green signals include an all-red clearance interval.
- Pedestrian pairs walk along sidewalks, stop for face-to-face gestures, and resume. These social encounters use animation without generated voices.
- Click or touch the clinic entrance to open/close it. Dragging the scene does not toggle the door. Advanced **Enter room** opens the door and moves the camera inside.
- The **Advanced scenario** menu remains at the top left in full screen and synchronizes with the sidebar.

The city uses original Blender models: terraced apartment facades, offices, retail, an electric sedan and crossover, detailed people and commuter bicycles. The visual style remains a stylized real-time architectural simulation. Background facade doors are decorative; the clinic entrance is interactive.

To regenerate all city assets, run `npm run assets:environment` with Blender 5.2 installed (or set `BLENDER_PATH`). The command builds the shared library, vehicles, people and bicycles in sequence. Editable sources are `assets/environment/site-library.blend`, `city-vehicles.blend`, `city-people.blend`, and `city-bicycle.blend`. The hybrid machinery remains in `assets/hybrid/hybrid-assembly.blend`.

See `CITY_UPGRADE_PROGRESS.md` for requirement status, verification and the local recovery ZIP reference. `docs/upgrade/premium-integration.json` contains offline geometry counts; these are not GPU timings or FPS measurements. `tools/package-city.ps1` produces a standalone delivery ZIP without dependencies or checkpoints.

- **Adequate wind:** 6 m/s; the wind drives the fan, motor stops, surplus PV charges.
- **Weak wind:** 4 m/s; wind and motor share the required shaft power.
- **No wind:** input rotor stops, wind freewheel overruns, electrical power drives the fan.
- **Low battery:** 8%; motor is inhibited, wind ventilation continues below target.
- **Night:** PV becomes zero; a charged battery can supply the motor. Lights and sky transition.
- **Sunny:** bright daylight with automatic solar tracking. An illustrative day advances from
  06:00 to 18:00 in five minutes of simulation time. The module turns and tilts to keep its
  surface perpendicular to the sunlight, with its pedestal and roof feet fixed. Sun position
  can also be adjusted manually. Pause stops the sun, tracker and simulation together.
- **Monsoon:** rainfall and overcast light. The panel parks at a 10° tilt, PV output becomes
  zero, and the motor/battery assistance is disabled. Wind alone drives the fan, like Basic.
  Returning to Sunny restores solar operation and automatic tracking.
- **Urban canyon:** detailed office towers frame the installation, with sheltered 2.8 m/s
  wind and solar assistance. Basic's Urban Canyon and Pond's Sheltered Lull use the same towers.
- **Open door / Close door:** operates the actual entrance; clicking the door also works.
- **Enter room / Leave room:** opens the door and places the camera inside. Drag to look around,
  scroll to move within the room, and use Leave room or Reset camera to return outside.
- **Inject fault:** motor protection trips while wind drive remains available.
- **Wind only:** intentionally inhibits assistance, independently of battery charge.
- **Section:** removes the roof/front wall, opens the cabinet and clips the fan housing.
- **Explode:** separates the assembly; reassembly restores original positions. Flow paths
  hide while the assembly is disconnected; the presentation does not imply a working exploded machine.
- **Airflow / Energy:** separate visibility toggles for cool intake, warm exhaust and DC paths.
- **Tour:** nine framing stages, six seconds each. Orbiting, scrolling or choosing a component
  cancels the tour. Reduced-motion preferences disable automatic camera motion and start paused.
- Select a component in the sidebar or click machinery to inspect it. Reset camera returns to the hero view.
- Full screen, play/pause, simulation speed and quality controls work independently of Basic mode.

The battery slider **sets** charge. Bottom status/metrics dashboards were removed from
Basic, Advanced and Pond modes at the user's request. Energy and protection calculations
continue to drive the machinery; controls, inspection and flow effects remain available.
Shaft RPM is physical model time; rotation is displayed at **0.22×** to reduce aliasing.
Changing the simulation-speed selector scales both energy integration and animation time.
Returning to Basic restores its cached scene/camera. Only the active application advances.
Advanced assets load on first use; subsequent switches reuse one scene, not new WebGL contexts.

## Model assumptions and limits

This is an educational visualization, **not certified engineering performance or CFD**.
The reference is a concept illustration, not fabrication CAD. The tapered bevel teeth,
rotor surfaces and guards are visual engineering approximations, not verified manufacturing geometry.

- Available wind power: `0.5 × 1.225 × 3.46 × 0.23 × wind³ × 0.84`, capped for the demonstration.
- Free-running input-speed estimate: `65 × wind` RPM. Loaded speed follows the common shaft
  only while the wind clutch can engage. At very weak wind, the motor can outrun and isolate
  the rotor instead of incorrectly back-driving it.
- Equal miter gears: 1:1. Motor/fan pulley RPM ratio: 34/22. Motor belt surface speed
  follows the driven pulley circumference; it stops when the motor-side freewheel overruns.
- Fan curve: 60 W at 240 RPM, power proportional to RPM cubed. Estimated flow: 850 m³/h
  at 240 RPM. These are configurable illustrative coefficients, not a tested fan curve.
- PV: 180 W at 1000 W/m² before 94% charge-controller efficiency; zero at night or in Monsoon.
- Battery: 240 Wh, conceptual 24 V bus. Maximum charge power 75 W, charge efficiency 95%.
  Charge integrates in Wh using real elapsed simulation seconds, not an arbitrary animation loop.
- Motor: maximum 95 W input, 78% efficiency. Assistance is bounded by PV and available battery power.
- Protection: motor locks at ≤12% SOC and recovers at ≥20%. An injected fault always inhibits it.
  PV charging remains possible during lockout. Wind operation is independent of motor protection.
- Control hysteresis: assist below 90% of target, release above 105%; 1.5 s timed verification.
- Air paths cross an existing screened window opening and the roof penetration, then the sealed
  plenum, connected rectangular branch and outdoor cowl. They are illustrative streamlines.

Defaults and thresholds are in `src/advanced/hybrid-model.js`. No changes were made to the
original calculations in `model.js`; the existing 84-output baseline regression remains applicable.
The advanced installation uses a fixed, single-unit building layout so Basic layout controls cannot
move its dedicated machinery or detach the ducts. It reuses the existing architectural interior,
landscaping, neighborhood, PBR surface detail, PMREM reflections and weather renderer.

## Blender source and regeneration

The shared scenery includes three apartment types, office towers, shops, distant skyline
blocks, cars, street lights, signals, bus shelters, bicycles, cycle racks, hydrants, bins,
pedestrians, architectural fittings, benches, boat hardware, occupants and fish. These 25 assets are in
`assets/environment/`, with editable source `site-library.blend`. Basic, Advanced and Pond
reuse the same cached meshes. Regenerate with `npm run assets:environment`.

The city layout follows the actual roof or pond footprint. Eight surrounding blocks and
an outer skyline replace the single backdrop row, with connected roads, sidewalks, zebra
crossings and a paved civic courtyard. Repeated models use instancing. Traffic follows the
simulation clock and signals; rain slows vehicles and makes roads reflective. Night lights
and windows belong to each scene, so switching modes does not change another scene's lighting.

Delivered:

- `assets/hybrid/hybrid-assembly.blend` — editable model, organized under named assembly pivots.
- `assets/hybrid/hybrid-assembly.glb` — optimized browser export, no decoder dependency.
- `assets/hybrid/manifest.json` — exact export size, triangle count and pivot inventory.
- `scripts/blender/build_hybrid.py` — full reproducible generator.

```sh
npm run assets:hybrid
npm run build
```

The runner detects Blender 5.2 at its standard Windows installation path. On another system,
set `BLENDER_PATH` to the Blender executable, or make `blender` available on PATH.
The generator needs no downloaded models or Python packages; it uses Blender's bundled Python.
Blender is needed to regenerate assets, not to use the website.

## Verification

```sh
npm test
npm run build
npm run verify:graphics
```

`tests/hybrid.test.cjs` checks all operating cases, energy limits, hysteresis, actual GLB parsing,
finite geometry, pivots, shaft ratios, pause, sectioning and reassembly. `tests/hybrid-ui.test.cjs`
checks all presets and toggles, cached scene switching, original camera preservation and pond navigation.
The existing scene/UI/voice/gesture/offline-speech tests remain. One stale voice test expected
`wind speed 12` to leave 2.5 unchanged even though the existing parser explicitly supports
bare control-name + number commands; its expectation was corrected to 12. Voice code is unchanged.

Browser QA and evidence are recorded in `docs/hybrid/VALIDATION.md`. Device-specific frame rate,
GPU compatibility and manufacturing clearances should not be inferred from these checks.

## Changed/new files for this upgrade

Updated: `app.js`, `app.bundle.js`, `index.html`, `package.json`,
`tools/verify-graphics.cjs`, and the single expectation in `tests/jarvis.test.cjs`.

Added: `hybrid.css`, `src/advanced/hybrid-model.js`, `src/advanced/hybrid-ui.js`,
`src/advanced/advanced-scene.js`, `scripts/blender/build_hybrid.py`, `assets/hybrid/*`,
`tests/hybrid.test.cjs`, `tests/hybrid-ui.test.cjs`, this guide, validation evidence,
and `tools/package-hybrid.ps1`.

Earlier uncommitted project upgrades were retained. The delivered ZIP includes those existing
project files as well as this hybrid integration, while excluding dependencies, Git internals,
historical archives and temporary geometry snapshots. Run `npm ci` after extracting to develop.
