# City traffic, bicycles and workstation delivery

Actual Jaguar E-Type, Porsche Taycan and De Tomaso P72 models are installed across all 18 moving cars. Each type includes three headless Blender-generated LODs and a packed editable Blender source. These are downloaded creator meshes, credited under CC BY 4.0, obtained without an account through the public Objaverse archive. Original source URLs, licenses, modifications and SHA-256 receipts are included.

**The eight-car request remains partially complete: 3/8 car types are installed.** Ferrari Roma, McLaren GT, Pininfarina Battista, McLaren Elva and Lotus Evija still lack an accepted account-free, redistributable download. No other car is labeled as one of these five. See [source evidence](<G:/new_8/zerowatt-wind-v8/assets/cars/SOURCES.md>).

Ten animated riders pedal bicycles. Cars and bikes use eight routes across the district, share junction reservations and accelerate smoothly. Dry-weather cruising speeds are 7.2 m/s for cars and 4.2 m/s for bicycles; wet and storm conditions slow traffic. The computer now occupies a rear corner with exactly one operator. The other seats stay clear of the desk up to 30 occupants, including the smallest room.

[Download the complete updated project](<G:/new_8/zerowatt-wind-v8/ZeroWatt-Premium-City.zip>). Extract it, then use the existing server or run npm install and npm start. The ZIP contains all website files, binary assets and these complete source copies under ZeroWatt-City/. The previous full project remains in checkpoints/city-before-mobility-20261022.zip.

Validation: npm run build; 73/73 tests; headless Blender source preparation, nine production LOD exports and fixture round trip; real GLTFLoader placement and wheel checks. Geometry/motion checks and Blender review renders passed. Browser FPS and GPU performance have not been measured. [Validation report](<G:/new_8/zerowatt-wind-v8/docs/cars/mobility-validation.json>) and [asset checks](<G:/new_8/zerowatt-wind-v8/docs/cars/installed-asset-validation.json>) are included.

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

## Complete source files

60 byte-identical full text copies follow. CREATE means add the listed file; REPLACE means replace the entire existing file. Remove the extra .txt extension when copying. Use the ZIP to apply everything together, including the binary models. Do not append these contents to existing files. [SHA-256 inventory](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/manifest.json>) covers the text originals and binary assets.

| Action | Project path | Complete file |
|---|---|---|
| REPLACE | CAR_INTEGRATION_PROGRESS.md | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/CAR_INTEGRATION_PROGRESS.md.txt>) |
| REPLACE | package.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/package.json.txt>) |
| REPLACE | index.html | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/index.html.txt>) |
| REPLACE | scene.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/scene.js.txt>) |
| REPLACE | app.bundle.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/app.bundle.js.txt>) |
| REPLACE | car-showcase.bundle.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/car-showcase.bundle.js.txt>) |
| REPLACE | src/cars/car-catalog.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/src/cars/car-catalog.js.txt>) |
| REPLACE | src/cars/traffic-fleet.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/src/cars/traffic-fleet.js.txt>) |
| CREATE | src/cars/installed-fleet.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/src/cars/installed-fleet.js.txt>) |
| REPLACE | src/graphics/city.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/src/graphics/city.js.txt>) |
| REPLACE | src/graphics/traffic.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/src/graphics/traffic.js.txt>) |
| REPLACE | src/graphics/assets.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/src/graphics/assets.js.txt>) |
| CREATE | src/graphics/road-network.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/src/graphics/road-network.js.txt>) |
| CREATE | src/graphics/cyclists.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/src/graphics/cyclists.js.txt>) |
| CREATE | src/graphics/occupant-layout.js | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/src/graphics/occupant-layout.js.txt>) |
| REPLACE | scripts/blender/prepare_car.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/scripts/blender/prepare_car.py.txt>) |
| REPLACE | scripts/blender/make_traffic_lods.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/scripts/blender/make_traffic_lods.py.txt>) |
| REPLACE | scripts/blender/test_traffic_lods.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/scripts/blender/test_traffic_lods.py.txt>) |
| CREATE | scripts/blender/build_city_cyclists.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/scripts/blender/build_city_cyclists.py.txt>) |
| CREATE | scripts/blender/prepare_downloaded_traffic.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/scripts/blender/prepare_downloaded_traffic.py.txt>) |
| CREATE | scripts/blender/refine_traffic_materials.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/scripts/blender/refine_traffic_materials.py.txt>) |
| CREATE | scripts/blender/inspect_traffic_sources.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/scripts/blender/inspect_traffic_sources.py.txt>) |
| CREATE | scripts/blender/render_mobility_review.py | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/scripts/blender/render_mobility_review.py.txt>) |
| REPLACE | tools/run-blender.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/run-blender.cjs.txt>) |
| REPLACE | tools/build-environment.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/build-environment.cjs.txt>) |
| REPLACE | tools/download-traffic-models.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/download-traffic-models.cjs.txt>) |
| REPLACE | tools/download-traffic-models.ps1 | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/download-traffic-models.ps1.txt>) |
| REPLACE | tools/make-traffic-lods.ps1 | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/make-traffic-lods.ps1.txt>) |
| REPLACE | tools/validate-traffic-assets.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/validate-traffic-assets.cjs.txt>) |
| REPLACE | tools/test-traffic-lods.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/test-traffic-lods.cjs.txt>) |
| REPLACE | tools/verify-graphics.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/verify-graphics.cjs.txt>) |
| CREATE | tools/capture-mobility-review.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/capture-mobility-review.cjs.txt>) |
| CREATE | tools/update-car-source-report.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/update-car-source-report.cjs.txt>) |
| CREATE | tools/deliver-city-mobility.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/deliver-city-mobility.cjs.txt>) |
| REPLACE | tools/package-city.ps1 | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/package-city.ps1.txt>) |
| REPLACE | tools/fetch-car-candidate-metadata.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/fetch-car-candidate-metadata.cjs.txt>) |
| REPLACE | tools/inspect-public-car-repositories.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/inspect-public-car-repositories.cjs.txt>) |
| REPLACE | tools/research-account-free-cars.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/research-account-free-cars.cjs.txt>) |
| REPLACE | tools/search-car-repositories.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tools/search-car-repositories.cjs.txt>) |
| REPLACE | tests/fleet.test.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tests/fleet.test.cjs.txt>) |
| REPLACE | tests/environment.test.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tests/environment.test.cjs.txt>) |
| CREATE | tests/city-mobility.test.cjs | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/tests/city-mobility.test.cjs.txt>) |
| REPLACE | assets/environment/manifest.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/environment/manifest.json.txt>) |
| REPLACE | assets/cars/SOURCES.md | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/SOURCES.md.txt>) |
| CREATE | assets/cars/CREDITS.html | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/CREDITS.html.txt>) |
| REPLACE | assets/cars/traffic-sources.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/traffic-sources.json.txt>) |
| REPLACE | docs/cars/TRAFFIC-PIPELINE.md | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/docs/cars/TRAFFIC-PIPELINE.md.txt>) |
| CREATE | docs/cars/CITY-MOBILITY.md | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/docs/cars/CITY-MOBILITY.md.txt>) |
| CREATE | docs/cars/installed-asset-validation.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/docs/cars/installed-asset-validation.json.txt>) |
| CREATE | docs/cars/mobility-validation.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/docs/cars/mobility-validation.json.txt>) |
| REPLACE | docs/cars/fixture-validation.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/docs/cars/fixture-validation.json.txt>) |
| CREATE | assets/cars/metadata/acquisition-receipts.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/metadata/acquisition-receipts.json.txt>) |
| REPLACE | assets/cars/metadata/de-tomaso-p72.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/metadata/de-tomaso-p72.json.txt>) |
| REPLACE | assets/cars/metadata/download-access.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/metadata/download-access.json.txt>) |
| REPLACE | assets/cars/metadata/ferrari-roma.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/metadata/ferrari-roma.json.txt>) |
| REPLACE | assets/cars/metadata/jaguar-e-type.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/metadata/jaguar-e-type.json.txt>) |
| REPLACE | assets/cars/metadata/porsche-taycan.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/metadata/porsche-taycan.json.txt>) |
| REPLACE | assets/cars/traffic/jaguar-e-type.report.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/traffic/jaguar-e-type.report.json.txt>) |
| REPLACE | assets/cars/traffic/porsche-taycan.report.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/traffic/porsche-taycan.report.json.txt>) |
| REPLACE | assets/cars/traffic/de-tomaso-p72.report.json | [Full contents](<G:/new_8/zerowatt-wind-v8/deliveries/city-mobility-20261022/files/assets/cars/traffic/de-tomaso-p72.report.json.txt>) |
