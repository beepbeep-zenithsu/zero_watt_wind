# Car integration progress

Last updated: 2026-10-21 (Checkpoint 2)

## Completed
- Task 0: Inspected project. Build is `esbuild` (app.js to app.bundle.js); Three.js is vendored; GLTFLoader has no Draco decoder, so GLBs must not use Draco.
- Task 1: Car showcase viewer, catalog, `scripts/blender/prepare_car.py`, `tools/prepare-cars.ps1`.
- Task 2: Runtime traffic fleet. `src/cars/traffic-fleet.js` loads and caches 3 LOD GLBs per car, builds a THREE.LOD per moving car (shared geometry/materials), and hides the original instanced car only when its premium model has loaded. `city.js` calls `attachTrafficFleet` and `placeFleetCar`. Road-following, speed, spawning and collision logic (`traffic.js`) is untouched.

## Traffic behaviour
- 8 moving cars, car i uses model i % 8 (lane 0: E-Type, Roma, Battista, Elva; lane 1: Taycan, McLaren GT, P72, Evija).
- LOD distances 0 / 38 / 95 m (hysteresis 0.12) in `src/cars/car-catalog.js`. LOD2 casts no shadow.
- Missing LOD0 file: the original sedan/crossover stays. Missing LOD1/LOD2: nearest finer level reused.
- Parked static sedans/crossovers beside the road are NOT traffic and are unchanged.
- Known limitation: premium models have no wheel spin or steering (merged meshes).

## Files
Delivered, REPLACE: `src/graphics/city.js`, `src/cars/car-catalog.js`, `CAR_INTEGRATION_PROGRESS.md`.
Delivered, CREATE: `src/cars/traffic-fleet.js`, `tests/fleet.test.cjs`.
Earlier deliveries: `index.html`, `package.json`, `car-showcase.js`, `car-showcase.css`, `scripts/blender/prepare_car.py`, `tools/prepare-cars.ps1`.
Awaiting delivery: Blender LOD script, PowerShell LOD driver, `package.json` script.
After copying files run `npm run build` (regenerates `app.bundle.js`).

## Required GLB output (per car id)
`assets/cars/traffic/<id>-lod0.glb`, `-lod1.glb`, `-lod2.glb` (nose +Z, wheels on y=0, length in metres, no Draco).

## Asset sources
No model has been selected or downloaded. No URL or licence is verified (authoring sandbox has no internet).

| Car | Model URL | Licence | Status |
|---|---|---|---|
| Jaguar E-Type | none | none | Pending |
| Porsche Taycan | none | none | Pending |
| Ferrari Roma | none | none | Pending |
| McLaren GT | none | none | Pending |
| Automobili Pininfarina Battista | none | none | Pending |
| De Tomaso P72 | none | none | Pending |
| McLaren Elva | none | none | Pending |
| Lotus Evija | none | none | Pending |

## Testing status
- Verified in sandbox: `tests/fleet.test.cjs` passes (2 tests: catalog shape, LOD resource sharing); `city.js` imports in Node.
- NOT run: existing suite (needs `npm install`, esbuild missing in sandbox), browser rendering, FPS, draw calls, triangles, memory, Blender. All performance results UNVERIFIED.
- Local test: `npm install`, `npm run build`, `npm test`, `npm start`, open browser console, check `console.warn` lines for missing models.

## Next task
Task 3: `scripts/blender/make_traffic_lods.py` (headless: import prepared car, make LOD0/1/2 via decimation, texture caps 1024/512/256, export GLB) plus `tools/make-traffic-lods.ps1` and an `npm` script. Then Task 4: verify model sources and licences.

## Resume in another Claude account
Upload the project ZIP with these files applied plus this document, and say: "Resume from CAR_INTEGRATION_PROGRESS.md, do the Next task."