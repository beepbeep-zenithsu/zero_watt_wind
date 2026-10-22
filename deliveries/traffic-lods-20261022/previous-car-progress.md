# ZeroWatt Wind v8 — car integration checkpoint

Updated: 2026-10-22 (Asia/Dhaka). Checkpoint: smooth traffic + extended Advanced wind/RPM.

## Current state and completed work
- Existing workspace is the active project; no new uploaded project ZIP accompanied this message. Prior project ZIP remains preserved under checkpoints/city-before-realism-20261021.zip.
- Preserved the preexisting eight-car catalog, showcase, and cached/shared-resource LOD fleet loader. Vehicles remain on the original two moving traffic routes. Generic moving cars remain visible whenever premium GLBs are missing.
- Traffic now integrates at 120 Hz, ramps acceleration with bounded jerk, previews curves, brakes before bends and traffic signals, maintains headway, eases heading and steering, and reuses physics scratch buffers/vectors.
- Advanced wind slider: 0–60 m/s (previously 0–20). Target fan control: 80–1200 RPM (previously 80–500). Added live rotor/fan RPM readout in the control panel.
- Removed the 360 W wind-power ceiling that made fan RPM plateau at high winds. Existing cubic wind-power/fan-load relationship retained. At steady wind-only conditions, verified approximately 910/1821/2731 RPM at 20/40/60 m/s. These are educational model outputs, not manufacturer performance ratings.
- Previously started realism revision included: three new headless-Blender skyline types, local scanned wall maps, outdoor HDR reflections and revised lighting. Skyline exports are 8740/10492/10180 triangles per unique model, nine material meshes each. Human/car realism upgrades remain unfinished.

## Verification
- npm run build passed (app.bundle.js and car-showcase.bundle.js).
- Full regression: 67 checks; 66 passed immediately. One geometry-review file write failed while producing a 144 MB district snapshot. The review was scoped to the installation, and the failing animation test passed on focused retest. All 67 checks are now verified.
- Focused model/UI suite: 16/16 passed. Startup jerk/heading test passed. Existing spacing, stop-line, signal-cycle, 60/120 Hz consistency, pause and Monsoon checks passed.
- Browser inspection: revised skyline/materials inspected. The wind control range/readout passed DOM tests; a live wind UI recheck could not be completed after browser tools became unavailable. Actual FPS, GPU memory and GPU draw calls are unmeasured; do not claim a performance result.

## Unfinished / next task
- Vehicle list confirmed by the user: use the latest eight-car list below. The earlier five-brand list is superseded. Existing eight-car catalog is preserved without substitutions.
- No premium vehicle GLBs are present under assets/cars/traffic/. No car URL, license or attribution has been verified. New premium models are NOT yet delivered or represented as completed.
- Next: verify/download legal source models, complete scripts/blender/make_traffic_lods.py and tools/make-traffic-lods.ps1, generate and validate LODs, integrate animated wheels where hierarchy permits, then browser/performance-test the fleet. Do not invent source links or silently replace model names.
- Continue the natural-human/vehicle realism pass after the source-model task. Current artwork still has stylized components.

## Models and licensing
| Catalog entry | Model URL | License | State |
|---|---|---|---|
| Jaguar E-Type | Not selected | Unverified | Pending |
| Porsche Taycan | Not selected | Unverified | Pending |
| Ferrari Roma | Not selected | Unverified | Pending |
| McLaren GT | Not selected | Unverified | Pending |
| Automobili Pininfarina Battista | Not selected | Unverified | Pending |
| De Tomaso P72 | Not selected | Unverified | Pending |
| McLaren Elva | Not selected | Unverified | Pending |
| Lotus Evija | Not selected | Unverified | Pending |

Actual downloaded lighting/textures: Poly Haven CC0 daylight HDR and plaster/brick maps. Exact sources, local filenames and license are in assets/textures/city/SOURCES.md. These are environmental materials, not vehicle models.

## LOD / optimization
- Existing TRAFFIC_LOD_DISTANCES: 0 / 38 / 95 m; hysteresis .12. Templates share geometries/materials, and LOD2 casts no shadows.
- Missing LOD0 retains the moving generic fallback; missing coarser LODs reuse the finer level. Premium wheel articulation remains unverified because the vehicle files are absent.
- No LOD processing result is claimed for the eight requested cars.

## Files and delivery
- Complete source copies and a REPLACE/CREATE index are in deliveries/traffic-wind-20261022/DELIVERY.md. Includes complete files, not diffs. The project ZIP is additional convenience, not the sole deliverable.
- Already delivered before this checkpoint: preexisting showcase/catalog/fleet files listed in the previous progress document, preserved at deliveries/traffic-wind-20261022/previous-car-progress.md.
- This checkpoint delivers traffic.js, city.js, hybrid-model.js, hybrid-ui.js, hybrid.css, updated tests and the completed skyline/material source files, with unchanged content retained inside every replacement file.
- Awaiting delivery: premium car GLBs, verified vehicle-source licenses, vehicle LOD processing scripts/results and final human realism work.
- KEEP UNCHANGED: model.js calculations, existing car catalog/fleet loader, solar tracking, door interactions, pond dynamics, voice/hand/face systems.

## Commands / resume
Run npm ci if dependencies are absent, then npm run build, npm test, npm start. Open http://127.0.0.1:5500/ .
Headless skyline generation: node tools/run-blender.cjs scripts/blender/build_city_architecture.py .
All environmental assets: npm run assets:environment . Blender 5.2 is available locally and was actually run; no Blender MCP used.
Existing single-car preparation: powershell -File tools/prepare-cars.ps1 (requires source files acquired under verified licenses). The final traffic-LOD driver is not yet implemented.

To continue elsewhere, upload the current project ZIP, this document and DELIVERY.md. Resume at the next unfinished task above. Preserve the existing workspace and the eight catalog entries using the confirmed latest eight-car list. Do not mark missing GLBs, licensing, FPS or human/car realism as completed.
