# Complete file delivery — traffic and wind checkpoint

Updated 2026-10-22. Every linked .txt contains the entire corresponding source file, including unchanged code. Copy the full text into the exact project path below; do not save the .txt suffix in your working project. Byte-identical source copies were verified. Generated browser bundles are included in the project ZIP; running npm run build recreates them.

This checkpoint completes smoother traffic and the higher Advanced wind/RPM range. It also preserves the completed skyline/PBR work from the ongoing realism revision. Premium car source acquisition, eight-car GLBs/LOD generation and further human/car realism remain unfinished.

| Action | Exact project path | Full copyable file |
|---|---|---|
| REPLACE | src/graphics/traffic.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/graphics/traffic.js.txt) |
| REPLACE | src/graphics/city.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/graphics/city.js.txt) |
| REPLACE | src/advanced/hybrid-model.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/advanced/hybrid-model.js.txt) |
| REPLACE | src/advanced/hybrid-ui.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/advanced/hybrid-ui.js.txt) |
| REPLACE | hybrid.css | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/hybrid.css.txt) |
| REPLACE | scene.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/scene.js.txt) |
| REPLACE | src/graphics/assets.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/graphics/assets.js.txt) |
| REPLACE | src/graphics/surfaces.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/graphics/surfaces.js.txt) |
| REPLACE | src/advanced/advanced-scene.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/advanced/advanced-scene.js.txt) |
| REPLACE | tools/build-environment.cjs | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/tools/build-environment.cjs.txt) |
| REPLACE | tests/environment.test.cjs | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/tests/environment.test.cjs.txt) |
| REPLACE | tests/hybrid.test.cjs | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/tests/hybrid.test.cjs.txt) |
| REPLACE | tests/hybrid-ui.test.cjs | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/tests/hybrid-ui.test.cjs.txt) |
| REPLACE | HYBRID-GUIDE.md | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/HYBRID-GUIDE.md.txt) |
| REPLACE | CITY_UPGRADE_PROGRESS.md | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/CITY_UPGRADE_PROGRESS.md.txt) |
| REPLACE | CAR_INTEGRATION_PROGRESS.md | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/CAR_INTEGRATION_PROGRESS.md.txt) |
| CREATE | src/graphics/city-materials.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/graphics/city-materials.js.txt) |
| CREATE | scripts/blender/build_city_architecture.py | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/scripts/blender/build_city_architecture.py.txt) |
| CREATE | vendor/addons/loaders/HDRLoader.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/vendor/addons/loaders/HDRLoader.js.txt) |
| CREATE | vendor/addons/loaders/RGBELoader.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/vendor/addons/loaders/RGBELoader.js.txt) |
| CREATE | assets/textures/city/SOURCES.md | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/assets/textures/city/SOURCES.md.txt) |
| KEEP (reference) | src/cars/car-catalog.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/cars/car-catalog.js.txt) |
| KEEP (reference) | src/cars/traffic-fleet.js | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/src/cars/traffic-fleet.js.txt) |
| KEEP (reference) | scripts/blender/prepare_car.py | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/scripts/blender/prepare_car.py.txt) |
| KEEP (reference) | tools/prepare-cars.ps1 | [Complete contents](G:/new_8/zerowatt-wind-v8/deliveries/traffic-wind-20261022/files/tools/prepare-cars.ps1.txt) |

## Binary files

The accompanying ZeroWatt-Premium-City.zip contains the actual skyline GLBs, city-skyline.blend, seven downloaded HDR/PBR files and all earlier environment/hybrid assets. No new licensed premium-car GLBs are claimed: none are installed. Existing catalog/fleet files retain moving fallback cars until real models are acquired.

## Verification

Build passed; 67 tests verified (66 initial full-suite passes plus the corrected geometry-snapshot test passed on focused retest). Higher-wind model/UI checks passed, including 0–60 m/s and fan target 80–1200 RPM. Startup jerk, frame-rate consistency, headway, stop-line and pause checks passed. Live browser wind/FPS retest is unavailable in the current tool set.

## Resume

Read CAR_INTEGRATION_PROGRESS.md first. Use the user-confirmed latest eight-car catalog, then verify legal model sources and implement headless LOD processing. Do not substitute model names, invent licenses, or mark unavailable assets/performance measurements as verified. The full previous progress text is preserved alongside this file.
