# City upgrade progress

Recovery: checkpoints/city-before-premium-20261021.zip (175 files, 81,302,312 bytes; source, GLBs, editable Blender files and prior work preserved). Restore into a separate folder. Run npm ci, npm run build, npm start.

Current: realism revision in progress after user visual rejection. Prior visual PASS labels below describe the earlier stylized version and are superseded by this revision. Recovery: checkpoints/city-before-realism-20261021.zip.

Revision scope: detailed far skyline, scanned PBR masonry, outdoor HDR reflections, five brand-inspired car models, more natural human anatomy and cross-scenario lighting.

| Task | Status | Changed files / evidence | Remaining issue |
|---|---|---|---|
| 0 | PASS | Existing Three.js/Blender pipeline recovered; prior build and 57 tests passed; ZIP entry verified | No measured browser FPS baseline |
| 1 | PASS | assets.js, city.js, site.js: bounds-based ground contact, connected paving and fixtures; 4 environment tests passed | Final visual integration check remains |
| 2 | PASS | scene.js, advanced-scene.js: clouds at 62–72 m, clear-weather fog .0012; 12 focused tests passed; full-screen city inspected | Final distant view after art direction |
| 3 | PASS | Four-sided Blender facades, supported roof tanks, individual instance colors; 8 focused tests passed; browser facade review | Final city-wide palette review in Task 12 |
| 4 | PASS | build_city_vehicles.py, city-vehicles.blend, sedan/crossover GLBs; 8 tests passed; actual browser appearance reviewed, no console errors | Wheel movement belongs to Task 5 |
| 5 | PASS | traffic.js, assets.js: acceleration/braking, steering, rotating wheels, 60 Hz substeps; 5 tests passed including 60/120 Hz comparison and headway; browser traffic observed | Signal cycle next |
| 6 | PASS | Red/amber/green and all-red clearance; dark inactive lenses; full 30 s signal cycle, stop-line braking and restart tested; 6 tests passed | Corrected duplicate stop at loop seam found by test |
| 7 | PASS | city-people.blend, detailed faces/hands/clothes, six skin and eight outfit colors; 10 tests passed, browser occupant review | Animated street behavior next |
| 8 | PASS | people.js: walking, face-to-face gestures, idle and resume; 80 s route continuity test passed; live preview exercised | Social interaction is visual, without generated speech. Road width corrected after observed parked-car clearance issue |
| 9 | PASS | city-bicycle.blend and GLB: connected drivetrain/forks, brakes, 24 spokes per wheel, grounded kickstand; actual loader validation passed | Parked bicycles intentionally stationary |
| 10 | PASS | Shared ray selection, touch pointer handling, drag threshold and smooth hinge; focused ray/animation and Advanced interior tests passed; direct door click changed live button to Close door | Background decorative facade doors remain static |
| 11 | PASS | Advanced viewport scenario select, sidebar synchronization, responsive layout; 6 UI tests passed; Monsoon selected in actual full-screen browser | None |
| 12 | PASS | Whole-city camera, revised architectural proportions, pastel/stone palette, courtyard greenery, cycle promenade, facade normals, warm night windows and wider street shadows; 22 focused tests passed; aerial browser review | Final scenario sweep and packaging next |
| 13 | PASS | Build passed; full regression 62 checks (60 initial passes, two door tests corrected and passed in 18-check retest); final traffic/pedestrian retest 8/8; ten offline scenario cases; live Sunny/Canyon/Monsoon/interior/night/pond screenshots, no captured console errors | Browser FPS not benchmarked | Follow the sequential queue | Atmosphere, architecture, vehicles, traffic, people, bicycles, doors, scenario UI, art direction, final integration |

## Original requirements (unchanged)

1. Clouds should be more higher
2. Cars, people, buildings, bicycle should be more detailed and cinematic and realistic
3. Finish all the unfinished joints(everything should follow gravitational laws must... Nothing should be floating)
4. Movement of cars should be more realistic and smooth and cinematic
5. The upper parts of the building are cloudy... It shouldn't be... Cloud be more upper
6. When zoom out to see the whole view, entire city looks cloudy... It shouldn't be.... It should be more visually appealing, cinematic and detailed
7. People here should move and can talk with one another sometimes
8. Use more modern luxurious and visually appealing cars(can take examples from internet)
9. Traffic lights should work and give signals accordingly
10. Every details should present inside human and use different colour combination for different ones and all people shouldn't be similar... His face should be more detailed
11. When I touch the door, I should open it or close it
12. The scenerio option of advanced mode should be like the basic mode(In the fit screen tab, I should open it like the basic mode)
13. Everything building should have its unique colour
14. Taking examples from the world's most beautiful cities, make it a combination of those... Its colour, background, architecture, textures, finishing, overall view to everything... Make this city visually so appealing (in all scenerios)

## Final verification and delivery

- Preview: http://127.0.0.1:5500/ ; source remains in this folder. Delivery: ZeroWatt-Premium-City.zip. Recovery ZIP is preserved separately under checkpoints/.
- Final screenshots: docs/previews/premium-city/. Offline scenario/geometry evidence: docs/upgrade/premium-integration.json. 27 exported environment assets; editable shared library, vehicles, people, bicycle and hybrid Blender files included.
- Regression corrections: preserve open doors on layout rebuild; support headless test fixtures; remove duplicate stop at path seam; preserve vehicle headway; continuous pedestrian turnarounds and passing clearance; amber dilemma-zone clearance; grounded pond bench; hidden accessibility labels.
- Scope: original stylized real-time artwork, visual conversations without generated speech, interactive clinic entrance, decorative background facade doors. No FPS or GPU timing claims. Ten offline cases have approximately 1.18–1.24 million visible triangles; these are geometry counts, not measured rendering performance. Instanced district meshes remain below the 250-mesh test budget.

| Requirement ID | Implemented changes | Verification | PASS / PARTIAL / BLOCKED |
|---|---|---|---|
| 1 | Clouds raised to 62–72 m | Ten-case altitude check and skyline views | PASS |
| 2 | Detailed Blender architecture, sedan/crossover, faces/clothing, mechanical bicycles | Actual GLB validation; aerial, room and pond browser views | PASS |
| 3 | Bounds-based ground contact, connected supports/joints, supported tanks, anchored wheels/bikes/benches | Geometry checks and representative browser views | PASS |
| 4 | Acceleration, braking, curved lanes, wheel rotation and steering, headway | 60/120 Hz equivalence and queue tests; live traffic | PASS |
| 5 | Cloud layer above tallest roofs | 62 m minimum cloud altitude; Canyon/aerial inspection | PASS |
| 6 | Reduced clear fog, whole-city camera, longer view range | Clear-weather density below .002; aerial screenshot | PASS |
| 7 | Walking, paired approach, facing gestures, resume and passing clearance | 80 s continuity test; live sidewalk activity | PASS |
| 8 | Original luxury-inspired electric sedan and crossover | Blender exports, loader test and browser views | PASS |
| 9 | Red/amber/green, all-red clearance, stop-line and dilemma-zone response | Complete-cycle stopping/restart test | PASS |
| 10 | Eyes, brows, nose, ears, lips, fingers, clothing, skin/outfit/hair variety | Six skin and eight shirt colors validated; interior screenshot | PASS |
| 11 | Click/touch clinic door, drag rejection, animated hinge | Actual browser click; ray, enclosure and interior tests | PASS |
| 12 | Full-screen Advanced scenario menu synchronized with sidebar | Six UI checks; actual full-screen Monsoon selection | PASS |
| 13 | Coordinated individual facade colors and separate Canyon tower tints | Instance color checks and building views | PASS |
| 14 | Coherent masonry/pastels, skyline, courtyard planting, cycle promenade and night lighting | Whole-city, Canyon, Sunny, Monsoon, interior, night and pond review | PASS |
