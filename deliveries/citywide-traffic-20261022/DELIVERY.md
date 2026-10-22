# Whole-city movement and Play fix — complete files

Thirty-six actual Jaguar E-Type, Porsche Taycan and De Tomaso P72 cars, 24 cycling riders and 80 pedestrians populate the city in basic, advanced and pond modes. All 12 vehicle routes carry the three installed types and cover every street segment between all nine blocks. Pedestrians choose destinations across the city and use protected marked crossings at all 16 junctions. The user has chosen these three car types; no further sourcing is needed.

**Fixed the stationary-traffic bug:** a reduced-motion preference previously kept city movement disabled even after Play started the simulation clock. Initial pause remains respected; pressing Play now starts cars, riders and walkers. Refresh the page to fetch the versioned bundle, then press Play if the simulation starts paused. Actual car position changes are verified in all three modes with both motion preferences: [live movement results](<G:/new_8/zerowatt-wind-v8/docs/cars/live-traffic-motion.json>).

Dry-weather cruise is 8.4 m/s for cars, 5 m/s for bicycles and 1.75–2.11 m/s for walkers. Traffic slows for curves, queues, signals and weather. Fair junction requests prevent cyclist starvation; vehicles check exit space before entering. Fixed 120 Hz physics and fractional-step render poses keep motion smooth on high-refresh displays. Instanced car/LOD parts, cached routes and reused matrices/colors/bounds reduce CPU work and draw overhead. The corner workstation still has one operator and remains clear at 30 occupants.

[Download the complete updated project](<G:/new_8/zerowatt-wind-v8/ZeroWatt-Premium-City.zip>). Extract it, then use the existing server or run npm install and npm start. The ZIP contains all website files, binary assets and these complete source copies under ZeroWatt-City/. The previous full project remains in checkpoints/city-before-citywide-20261022.zip. All three car types include three Blender-generated LODs and packed editable sources. Preserve [creator credits and licenses](<G:/new_8/zerowatt-wind-v8/assets/cars/SOURCES.md>).

Validation: npm run build; 77/77 tests; protected crossings throughout the whole grid; high-refresh continuity, pause, queues and actual car loading. A real headless Edge/WebGL review renders sunlight/rain/night, pond and advanced scenes, and switches modes in the actual website without page errors. [Timing/hardware report](<G:/new_8/zerowatt-wind-v8/docs/cars/citywide-browser-review.json>) records measured frame intervals, render work and draw/triangle counts. Timings apply to that machine and viewport. [Geometry report](<G:/new_8/zerowatt-wind-v8/docs/cars/mobility-validation.json>) and [car asset checks](<G:/new_8/zerowatt-wind-v8/docs/cars/installed-asset-validation.json>) are included. No new mesh generation was needed for this runtime movement fix; the existing editable Blender assets and credits are preserved.

## Actual assets and review images

- [assets/cars/traffic/jaguar-e-type-lod0.glb](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/jaguar-e-type-lod0.glb>) (4,006,976 bytes)
- [assets/cars/traffic/jaguar-e-type-lod1.glb](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/jaguar-e-type-lod1.glb>) (1,226,664 bytes)
- [assets/cars/traffic/jaguar-e-type-lod2.glb](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/jaguar-e-type-lod2.glb>) (329,668 bytes)
- [assets/cars/traffic/jaguar-e-type.blend](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/jaguar-e-type.blend>) (4,489,303 bytes)
- [assets/cars/traffic/porsche-taycan-lod0.glb](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/porsche-taycan-lod0.glb>) (2,164,240 bytes)
- [assets/cars/traffic/porsche-taycan-lod1.glb](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/porsche-taycan-lod1.glb>) (746,008 bytes)
- [assets/cars/traffic/porsche-taycan-lod2.glb](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/porsche-taycan-lod2.glb>) (244,744 bytes)
- [assets/cars/traffic/porsche-taycan.blend](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/porsche-taycan.blend>) (12,267,599 bytes)
- [assets/cars/traffic/de-tomaso-p72-lod0.glb](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/de-tomaso-p72-lod0.glb>) (2,883,896 bytes)
- [assets/cars/traffic/de-tomaso-p72-lod1.glb](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/de-tomaso-p72-lod1.glb>) (1,408,580 bytes)
- [assets/cars/traffic/de-tomaso-p72-lod2.glb](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/de-tomaso-p72-lod2.glb>) (437,652 bytes)
- [assets/cars/traffic/de-tomaso-p72.blend](<G:/new_8/zerowatt-wind-v8/assets/cars/traffic/de-tomaso-p72.blend>) (2,872,688 bytes)
- [assets/environment/site-cyclist.glb](<G:/new_8/zerowatt-wind-v8/assets/environment/site-cyclist.glb>) (454,120 bytes)
- [assets/environment/city-cyclists.blend](<G:/new_8/zerowatt-wind-v8/assets/environment/city-cyclists.blend>) (240,681 bytes)
- [docs/cars/installed-cars-review.png](<G:/new_8/zerowatt-wind-v8/docs/cars/installed-cars-review.png>) (1,045,552 bytes)
- [docs/cars/cyclist-review.png](<G:/new_8/zerowatt-wind-v8/docs/cars/cyclist-review.png>) (729,623 bytes)
- [docs/cars/workstation-review.png](<G:/new_8/zerowatt-wind-v8/docs/cars/workstation-review.png>) (1,022,526 bytes)
- [docs/cars/citywide-clear.png](<G:/new_8/zerowatt-wind-v8/docs/cars/citywide-clear.png>) (1,177,345 bytes)
- [docs/cars/citywide-rain.png](<G:/new_8/zerowatt-wind-v8/docs/cars/citywide-rain.png>) (1,129,537 bytes)
- [docs/cars/citywide-night.png](<G:/new_8/zerowatt-wind-v8/docs/cars/citywide-night.png>) (1,038,069 bytes)
- [docs/cars/citywide-water-clear.png](<G:/new_8/zerowatt-wind-v8/docs/cars/citywide-water-clear.png>) (1,107,841 bytes)
- [docs/cars/citywide-advanced-clear.png](<G:/new_8/zerowatt-wind-v8/docs/cars/citywide-advanced-clear.png>) (1,163,060 bytes)
- [docs/cars/citywide-advanced-rain.png](<G:/new_8/zerowatt-wind-v8/docs/cars/citywide-advanced-rain.png>) (1,184,898 bytes)

## Complete source files

67 byte-identical full text copies follow. CREATE means add the listed file; REPLACE means replace the entire existing file. Remove the extra .txt extension when copying. Use the ZIP to apply everything together, including the binary models. Do not append these contents to existing files. [SHA-256 inventory](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/manifest.json>) covers the text originals and binary assets.

| Action | Project path | Complete file |
|---|---|---|
| REPLACE | CAR_INTEGRATION_PROGRESS.md | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/CAR_INTEGRATION_PROGRESS.md.txt>) |
| REPLACE | package.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/package.json.txt>) |
| REPLACE | index.html | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/index.html.txt>) |
| REPLACE | scene.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/scene.js.txt>) |
| REPLACE | app.bundle.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/app.bundle.js.txt>) |
| REPLACE | car-showcase.bundle.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/car-showcase.bundle.js.txt>) |
| REPLACE | src/cars/car-catalog.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/cars/car-catalog.js.txt>) |
| REPLACE | src/cars/traffic-fleet.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/cars/traffic-fleet.js.txt>) |
| CREATE | src/cars/installed-fleet.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/cars/installed-fleet.js.txt>) |
| REPLACE | src/graphics/city.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/graphics/city.js.txt>) |
| REPLACE | src/graphics/traffic.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/graphics/traffic.js.txt>) |
| REPLACE | src/graphics/assets.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/graphics/assets.js.txt>) |
| CREATE | src/graphics/road-network.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/graphics/road-network.js.txt>) |
| CREATE | src/graphics/cyclists.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/graphics/cyclists.js.txt>) |
| CREATE | src/graphics/occupant-layout.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/graphics/occupant-layout.js.txt>) |
| REPLACE | src/graphics/people.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/graphics/people.js.txt>) |
| CREATE | src/graphics/motion-route.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/graphics/motion-route.js.txt>) |
| CREATE | src/graphics/mobility-shadows.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/src/graphics/mobility-shadows.js.txt>) |
| CREATE | tools/review-citywide-browser.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/review-citywide-browser.cjs.txt>) |
| CREATE | tools/check-live-traffic.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/check-live-traffic.cjs.txt>) |
| REPLACE | scripts/blender/prepare_car.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/scripts/blender/prepare_car.py.txt>) |
| REPLACE | scripts/blender/make_traffic_lods.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/scripts/blender/make_traffic_lods.py.txt>) |
| REPLACE | scripts/blender/test_traffic_lods.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/scripts/blender/test_traffic_lods.py.txt>) |
| CREATE | scripts/blender/build_city_cyclists.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/scripts/blender/build_city_cyclists.py.txt>) |
| CREATE | scripts/blender/prepare_downloaded_traffic.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/scripts/blender/prepare_downloaded_traffic.py.txt>) |
| CREATE | scripts/blender/refine_traffic_materials.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/scripts/blender/refine_traffic_materials.py.txt>) |
| CREATE | scripts/blender/inspect_traffic_sources.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/scripts/blender/inspect_traffic_sources.py.txt>) |
| CREATE | scripts/blender/render_mobility_review.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/scripts/blender/render_mobility_review.py.txt>) |
| REPLACE | tools/run-blender.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/run-blender.cjs.txt>) |
| REPLACE | tools/build-environment.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/build-environment.cjs.txt>) |
| REPLACE | tools/download-traffic-models.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/download-traffic-models.cjs.txt>) |
| REPLACE | tools/download-traffic-models.ps1 | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/download-traffic-models.ps1.txt>) |
| REPLACE | tools/make-traffic-lods.ps1 | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/make-traffic-lods.ps1.txt>) |
| REPLACE | tools/validate-traffic-assets.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/validate-traffic-assets.cjs.txt>) |
| REPLACE | tools/test-traffic-lods.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/test-traffic-lods.cjs.txt>) |
| REPLACE | tools/verify-graphics.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/verify-graphics.cjs.txt>) |
| CREATE | tools/capture-mobility-review.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/capture-mobility-review.cjs.txt>) |
| CREATE | tools/update-car-source-report.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/update-car-source-report.cjs.txt>) |
| CREATE | tools/deliver-city-mobility.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/deliver-city-mobility.cjs.txt>) |
| REPLACE | tools/package-city.ps1 | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/package-city.ps1.txt>) |
| REPLACE | tools/fetch-car-candidate-metadata.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/fetch-car-candidate-metadata.cjs.txt>) |
| REPLACE | tools/inspect-public-car-repositories.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/inspect-public-car-repositories.cjs.txt>) |
| REPLACE | tools/research-account-free-cars.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/research-account-free-cars.cjs.txt>) |
| REPLACE | tools/search-car-repositories.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tools/search-car-repositories.cjs.txt>) |
| REPLACE | tests/fleet.test.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tests/fleet.test.cjs.txt>) |
| REPLACE | tests/environment.test.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tests/environment.test.cjs.txt>) |
| CREATE | tests/city-mobility.test.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/tests/city-mobility.test.cjs.txt>) |
| REPLACE | assets/environment/manifest.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/environment/manifest.json.txt>) |
| REPLACE | assets/cars/SOURCES.md | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/SOURCES.md.txt>) |
| CREATE | assets/cars/CREDITS.html | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/CREDITS.html.txt>) |
| REPLACE | assets/cars/traffic-sources.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/traffic-sources.json.txt>) |
| REPLACE | docs/cars/TRAFFIC-PIPELINE.md | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/docs/cars/TRAFFIC-PIPELINE.md.txt>) |
| CREATE | docs/cars/CITY-MOBILITY.md | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/docs/cars/CITY-MOBILITY.md.txt>) |
| CREATE | docs/cars/installed-asset-validation.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/docs/cars/installed-asset-validation.json.txt>) |
| CREATE | docs/cars/mobility-validation.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/docs/cars/mobility-validation.json.txt>) |
| REPLACE | docs/cars/fixture-validation.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/docs/cars/fixture-validation.json.txt>) |
| CREATE | docs/cars/citywide-browser-review.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/docs/cars/citywide-browser-review.json.txt>) |
| CREATE | docs/cars/live-traffic-motion.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/docs/cars/live-traffic-motion.json.txt>) |
| CREATE | assets/cars/metadata/acquisition-receipts.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/metadata/acquisition-receipts.json.txt>) |
| REPLACE | assets/cars/metadata/de-tomaso-p72.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/metadata/de-tomaso-p72.json.txt>) |
| REPLACE | assets/cars/metadata/download-access.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/metadata/download-access.json.txt>) |
| REPLACE | assets/cars/metadata/ferrari-roma.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/metadata/ferrari-roma.json.txt>) |
| REPLACE | assets/cars/metadata/jaguar-e-type.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/metadata/jaguar-e-type.json.txt>) |
| REPLACE | assets/cars/metadata/porsche-taycan.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/metadata/porsche-taycan.json.txt>) |
| REPLACE | assets/cars/traffic/jaguar-e-type.report.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/traffic/jaguar-e-type.report.json.txt>) |
| REPLACE | assets/cars/traffic/porsche-taycan.report.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/traffic/porsche-taycan.report.json.txt>) |
| REPLACE | assets/cars/traffic/de-tomaso-p72.report.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/citywide-traffic-20261022/files/assets/cars/traffic/de-tomaso-p72.report.json.txt>) |
