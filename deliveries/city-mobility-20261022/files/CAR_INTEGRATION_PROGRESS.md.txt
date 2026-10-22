# ZeroWatt Wind v8 — actual traffic and city mobility checkpoint

Updated: 2026-10-22 (Asia/Dhaka).

## Delivered in the working website

- All 18 moving traffic cars now use actual downloaded Jaguar E-Type, Porsche Taycan and De Tomaso P72 meshes. Three types are installed, with three validated LODs and one editable Blender source each. The five uninstalled catalog names are not applied to other meshes.
- Actual downloads required no accounts. Exact creator UIDs were matched to the Allen Institute's public Objaverse archive, and each creator's CC-BY 4.0 listing was verified. Source URLs, hashes, modification notices and website credits are included under assets/cars/.
- Both car and bicycle traffic now use eight continuous circuits over the connected street grid, including side roads and outer streets. Eighteen cars and ten cyclists are staggered across the routes. All 16 junctions have crossing/signal geometry.
- Retained 120 Hz integration, bounded jerk, eased steering/heading, spacing and weather/pause behavior. Dry-road car cruise increased from 3.2 to 7.2 m/s; rain/storm speeds remain lower. Shared junction reservations coordinate cars and bikes. Incoming stop detection avoids stopping again halfway through an outside-lane turn.
- Added a Blender commuter bicycle with an actual seated rider, hands on the bars, named wheel/crank/pedal/leg parts and per-person colors. Wheels and pedals follow travelled distance; two-link leg motion keeps the feet on the pedals. Cyclists stop pedalling when stopped. The asset has 12,300 triangles and 32 shared material meshes, instanced across ten riders.
- Moved the computer desk into the rear corner. Exactly one occupant is assigned to the computer when occupancy is nonzero, facing the screen. Waiting seats exclude the whole workstation/operator area. Up to 30 people fit in the smallest room without intersecting the desk or each other. Plants were moved clear of the workstation and seating.
- Cached real-car templates share geometry, materials and textures between moving instances. All three actual sources have four separated wheel groups that spin/steer. LODs share one reference fit, and distant geometry does not cast shadows. Night head/tail lamps follow the moving premium cars using two instanced draws.
- Added website/model credit links and preserved the original body meshes and UVs. Jaguar paint/normals were refined; the untextured white Taycan materials were restored using semantic PBR materials and its normals refined.

## Actual installed fleet

| Model | Creator | Source license | LOD triangles |
|---|---|---|---|
| Jaguar E_TYPE | Nommoc | CC-BY 4.0 | 58,196 / 15,516 / 3,877 |
| 2020 Porsche Taycan | martin002 | CC-BY 4.0 | 58,196 / 15,515 / 3,871 |
| Low Poly Car - De Tomaso P72 2020 | ROH3D | CC-BY 4.0 | 21,495 / 15,518 / 3,877 |

Exact current export sizes, hashes and texture limits are in assets/cars/traffic/<id>.report.json and docs/cars/installed-asset-validation.json. Editable, packed .blend files are included alongside the GLBs. Manifest inputs point to these portable sources, so the installed cars rebuild from the delivery without downloading originals again.

The earlier Jaguar restoration scan was rejected in favor of Nommoc's complete authored car. The earlier Mikhail Hamanovich Taycan candidate was unavailable in the public archive; the installed Taycan is martin002's exact car. These artist/UID changes are explicit in the source records.

## Still unfinished: five of the requested eight types

Ferrari Roma, McLaren GT, Pininfarina Battista, McLaren Elva and Lotus Evija remain uninstalled. Searches covered creator pages, Objaverse/Hugging Face, the university S3D3C collection, GitHub, RD Studio and several model marketplaces. No cleared account-free files were found for these five. Game-derived assets, no-license GTA repositories and sources prohibiting redistribution were not used.

The original ZIRODESIGN Elva appears in S3D3C's historical CC-BY index, but that public project explicitly asks users to contact the authors for model access. No message was sent. Other pending choices require an account, purchase or additional redistribution permission. See assets/cars/SOURCES.md for the exact findings. Do not mark the eight-car request complete or pretend different meshes are the missing models.

## Verification

- npm run build passed for both bundles.
- npm test passed 73/73, including actual installed-car loading, all 18 replacements, eight car/bike routes, asphalt containment, car spacing, signal restart, higher speed, rider leg/pedal contact, pause behavior and the 30-person workstation clearance.
- Actual nine vehicle GLBs passed independent hash, geometry, world-bounds, grounding, decoder, texture-size and embedded-credit validation.
- Blender 5.2.2 LTS was actually run headlessly for source inspection, disconnected wheel extraction, material refinement, LOD exports, the rider asset and final visual reviews. No Blender MCP was used.
- The separate original technical-fixture LOD regression also passed through the real GLTFLoader. It is not presented as any of the requested cars and is excluded from the ZIP.
- Blender review images show the actual installed car GLBs, the actual room layout at 30 occupants and the bicycle/rider. These are geometry/PBR reviews, not browser screenshots.
- Browser tools are unavailable. Browser FPS/GPU memory/draw calls are unmeasured. Offline tests use placeholder image decoding only for geometry; actual car PBR output was reviewed in Blender. The visible district mesh budget was separated from inactive LOD levels rather than counting all hidden levels as rendered objects.

## Previous work preserved

Advanced wind remains 0–60 m/s, target fan control 80–1200 RPM, with the live RPM display and uncapped cubic wind-power model. Sunlight, solar tracking, Monsoon wind-only operation, door opening/entering, pond dynamics, model.js calculations, detailed city/canyon/skyline and voice/hand/face systems remain intact. Regression tests cover the previous mode controls and engineering behavior.

## Complete delivery and resume

Complete updated text files and binary asset links: deliveries/city-mobility-20261022/DELIVERY.md. Full project: ZeroWatt-Premium-City.zip. Previous full ZIP: checkpoints/city-before-mobility-20261022.zip. The previous progress document is retained in the new delivery folder.

Run npm run build, npm test and npm start; open http://127.0.0.1:5500/ . Vehicle sources/credits: assets/cars/SOURCES.md. Rebuild commands: docs/cars/TRAFFIC-PIPELINE.md. Cyclist regeneration: node tools/run-blender.cjs scripts/blender/build_city_cyclists.py .

Next: obtain cleared, account-free source files for the five pending exact cars; inspect each source, generate LODs and extend the installed registry. The runtime automatically distributes genuinely installed types across the moving fleet. Continue browser visual/performance checks when those tools are available. Keep the actual installed fleet and new city/desk fixes while completing the remaining models.
