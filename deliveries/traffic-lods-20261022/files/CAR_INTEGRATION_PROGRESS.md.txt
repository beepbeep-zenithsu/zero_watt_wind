# ZeroWatt Wind v8 — vehicle integration checkpoint

Updated: 2026-10-22 (Asia/Dhaka). Checkpoint: verified source shortlist and tested headless Blender LOD pipeline.

## Completion status

**The requested eight-car replacement is NOT complete. 0/8 actual vehicle models are downloaded or installed.** Existing moving traffic remains visible. The user confirmed no Sketchfab account is available; no credentials were supplied, and no account was created.

Four creator listings have verified CC-BY 4.0 metadata: Jaguar E-Type (Lightweight restoration scan), Porsche Taycan, Ferrari Roma (6,000-triangle candidate), De Tomaso P72. Their public metadata is saved under assets/cars/metadata/. The official P72 download endpoint returned HTTP 401: Authentication credentials were not provided. Sketchfab's documentation requires authenticated end-user downloads. There is no accepted anonymous download path in this checkpoint.

McLaren GT, Pininfarina Battista, McLaren Elva and Lotus Evija still need cleared, accessible source files. Listings that explicitly derive from commercial games were rejected. Paid, editorial-only or no-source-redistribution listings were not treated as permission to ship models. No purchase was made and no exact car was silently substituted.

See assets/cars/SOURCES.md and assets/cars/traffic-sources.json for individual evidence, URLs, caveats and rejected sources. Candidate source verification does not establish visual quality or completion. The Jaguar scan and low-poly Roma may not satisfy the requested cinematic result.

## Completed implementation

- Implemented tools/download-traffic-models.cjs and its masked local OAuth-token PowerShell wrapper. Uses official metadata/download endpoints only; saves asset hashes/receipts and does not persist or print credentials/signed URLs. Public metadata retrieval was run. Authenticated model download remains untested because no account/token is available.
- Implemented scripts/blender/make_traffic_lods.py and tools/make-traffic-lods.ps1. Preflights actual licensed inputs, freezes evaluated geometry, normalizes scale/grounding/nose direction, groups body and explicitly named wheels, preserves UV/material assignments, packs editable Blender assets and generates three uncompressed GLBs with attribution and reports.
- Production ceilings: 60,000/16,000/4,000 triangles; 1,024/512/256 px textures; 32 material primitives. Each LOD starts from the normalized source. Sources requiring material atlases/manual retopology fail or need artist work; automatic cinematic quality is not claimed.
- Added structural GLB checks for actual geometry, embedded PNG/JPEG sizes, world bounds, hash/report agreement, unsupported decoders and embedded credits. Successful production validation writes src/cars/installed-fleet.js. That registry is currently empty.
- Preserved the confirmed eight-car catalog and the existing 14 moving vehicles/two routes. Assets are cached once per type, with geometry/material/texture sharing across clones. LOD instances have independent wheel transforms. Corrected yaw handling and centering, kept one normalization across LODs, and disabled distant shadows even when a finer fallback level is reused.
- Explicit wheel groups spin from existing travelled distance and front wheels steer using the current driving model. Unmapped wheels are reported as static. No wheel hierarchy is claimed for the missing branded models.
- Uninstalled models retain generic moving cars without issuing 24 missing-file requests. Actual models must pass installation validation before they replace traffic. The standalone showcase uses the same installed source/LOD0 credits.

## Verification actually run

- npm run build passed for both bundles.
- npm test: 70/70 passed, including five fleet checks and all existing traffic, weather, ventilation, solar, door and UI regressions.
- Blender 5.2.2 LTS actually ran headlessly on an ORIGINAL TECHNICAL FIXTURE, not a requested car. Original fixture: 10,112 triangles. Exported levels: 6,784 / 1,936 / 580 triangles; embedded textures: 128 / 64 / 32 px; four explicit wheel groups; five material primitives per level. GLB sizes: 539,404 / 192,256 / 64,308 bytes.
- Export hashes, texture dimensions, grounding, world bounds and geometry passed independent validation. Actual Blender GLB hierarchy/wheels/traffic placement passed through the project's GLTFLoader; texture decoding is excluded from this Node hierarchy check.
- The delivered PowerShell driver also built and validated the technical fixture successfully. Fixture outputs remain under .upgrade-baseline/ and are excluded from the project ZIP; docs/cars/fixture-validation.json records their results.
- Browser tools are unavailable. No browser visual acceptance, FPS, GPU memory or draw-call measurement is claimed. No performance/realism result is claimed for the absent eight-car fleet.

## Prior work preserved

The earlier smooth-traffic implementation still uses 120 Hz substeps, bounded jerk, bend preview, headway and eased heading/steering. Advanced wind remains 0–60 m/s, target fan control 80–1200 RPM, with the live rotor/fan readout and uncapped cubic wind-power model. Wind-only educational model outputs at 20/40/60 m/s remain approximately 910/1821/2731 RPM.

The detailed skyline, local scanned wall maps, HDR lighting, sunlight/solar tracking, Monsoon wind-only operation, door/interior controls, pond dynamics, model.js calculations and voice/hand/face systems remain preserved. Human/cinematic city realism remains unfinished from the earlier revision. Historical checkpoint: deliveries/traffic-lods-20261022/previous-car-progress.md.

## Complete updated files

Complete byte-identical text copies, SHA-256 hashes and CREATE/REPLACE instructions: deliveries/traffic-lods-20261022/DELIVERY.md. Full project: ZeroWatt-Premium-City.zip. This is a pipeline/checkpoint delivery; it contains no eight-car GLB fleet and does not represent that replacement as complete.

## Resume

1. Obtain authenticated download access for acceptable CC-BY candidates and cleared sources for the four unresolved cars. Retain provenance/license evidence. Reconsider the scan/low-poly candidates if they cannot meet visual requirements.
2. Inspect each real file; set input, front axis, actual variant length and optional wheel mesh names in assets/cars/traffic-sources.json.
3. Run powershell -ExecutionPolicy Bypass -File tools/make-traffic-lods.ps1 -Only <car-id>. After all eight are configured, omit -Only for the full batch. Production validation installs only genuine exported files.
4. Run npm run build, npm test and npm start. Visually inspect each real moving model, LOD transition, wheel contact/materials and all scenarios. Measure browser performance before claiming completion.

Full commands and constraints: docs/cars/TRAFFIC-PIPELINE.md. npm run test:car-lods recreates and verifies the separate original technical fixture. This work used local headless Blender, not Blender MCP.
