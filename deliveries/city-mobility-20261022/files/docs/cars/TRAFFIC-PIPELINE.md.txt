# Vehicle acquisition and headless Blender pipeline

Current status: **three actual car types are installed**, with nine validated LOD
GLBs and three editable Blender sources. All 18 moving cars use the real Jaguar
E-Type, Porsche Taycan or De Tomaso P72. Ferrari Roma, McLaren GT, Pininfarina
Battista, McLaren Elva and Lotus Evija remain uninstalled. See `assets/cars/SOURCES.md`.
There are also ten pedalling cyclists and eight routes across the street grid.

## Acquire genuine source files

`node tools/download-traffic-models.cjs --metadata-only` refreshes the public API
records. It reports unresolved car sources as blocked and exits nonzero when any
requested entry is blocked. Use `--only de-tomaso-p72` for one entry.

The three installed models were downloaded without accounts from the Allen
Institute's public Objaverse archive. Exact URLs and original hashes are recorded
in the manifest and acquisition receipts. The downloader uses those reviewed
public URLs directly: `node tools/download-traffic-models.cjs --only de-tomaso-p72`
requires no token. An existing source with the correct hash is retained.

For candidates without an accepted public archive URL, the official Sketchfab API
requires a locally supplied OAuth token in `SKETCHFAB_ACCESS_TOKEN`, following the [official download API
documentation](https://sketchfab.com/developers/download-api/downloading-models).
The tool never scrapes viewer caches, saves the token or
prints signed download URLs. There is currently no account/token available. If
an authorized OAuth access token becomes available, use the masked PowerShell prompt:

```powershell
powershell -ExecutionPolicy Bypass -File tools/download-traffic-models.ps1 -Only de-tomaso-p72
```

The downloader writes creator-authorized GLB/glTF downloads under `downloads/cars/` and records the SHA-256,
source and license in a receipt. Preserve originals. ZIP downloads must be
extracted with their texture folder structure intact. Do not use an unlicensed
mirror to avoid an account requirement. Paid models also require terms that
permit this website's asset delivery and the requested source-file distribution.

## Prepare the manifest

The three installed entries already use portable `assets/cars/traffic/<id>.blend`
inputs, canonical nose direction and explicit `Traffic_FL/FR/RL/RR` wheel names.
They rebuild from the delivered ZIP without another model download.

For a NEW source, in `assets/cars/traffic-sources.json`, set `input` to the actual model path,
`front` to its nose direction **after Blender import** (`+X`, `-X`, `+Y`, `-Y`),
and confirm the length against that variant. These values are intentionally empty
until a real source is inspected. All configured inputs in a batch are preflighted
before exports start. A failed/absent source does not enable a placeholder model.

Optional `include` contains exact mesh object names when a source has multiple
vehicles/display props. Otherwise all renderable meshes are included. Remove
interior/engine/display geometry only after inspecting the source; the pipeline
does not guess whether an object is visible through its windows.

For moving wheels, supply exact source mesh names (rotating tyres/rims, excluding
stationary brake calipers). Example manifest field:

```json
"wheels": [
  {"id":"FL","objects":["tyre_front_left","rim_front_left"]},
  {"id":"FR","objects":["tyre_front_right","rim_front_right"]},
  {"id":"RL","objects":["tyre_rear_left","rim_rear_left"]},
  {"id":"RR","objects":["tyre_rear_right","rim_rear_right"]}
]
```

Those names are examples, not names claimed to exist in the missing models. With
no wheel mapping, the report explicitly warns that wheels remain static. Scan
meshes may need manual separation before wheel animation is possible.

## Generate and install

```powershell
powershell -ExecutionPolicy Bypass -File tools/make-traffic-lods.ps1 -Only de-tomaso-p72
npm run build
```

Omit `-Only` to build all eight after every source has been acquired/configured.
`BLENDER_PATH` or `-Blender` can override the installed Blender 5.2 executable.
The command uses `--background --factory-startup --disable-autoexec` and fails on
Python errors. Source .blend scripts are not executed.

The real source preparation scripts are `prepare_downloaded_traffic.py` (requires
original downloads) and `refine_traffic_materials.py` (installed paint/normals).
Bodies and UVs remain the downloaded artists' geometry.

Default targets:

| Level | Triangle ceiling | Texture dimension ceiling | Switch distance |
|---|---:|---:|---:|
| LOD0 | 60,000 | 1,024 px | 0 m |
| LOD1 | 16,000 | 512 px | 38 m |
| LOD2 | 4,000 | 256 px | 95 m |

Each level starts from the same normalized original. The script freezes evaluated
geometry, preserves UV/material assignments, joins static parts and explicit
wheel groups, caps textures and exports self-contained GLBs without Draco or
Meshopt compression. More than 32 material primitives fails the build and requires
source material/atlas work. UV atlasing, retopology and cinematic quality cannot
be guaranteed by decimation; inspect actual outputs before accepting each model.

Outputs: `assets/cars/traffic/<id>-lod0.glb`, `-lod1.glb`, `-lod2.glb`, a normalized
editable `<id>.blend` with packed images, and `<id>.report.json` with hashes, sizes,
budgets and attribution. No existing car files are touched until that car's three
exports complete. GLB validation checks actual triangles, world bounds, embedded
image dimensions, decoder requirements, hashes and embedded credits.

For the production output directory, successful validation updates
`src/cars/installed-fleet.js`; rebuild the bundles afterward. Existing valid cars
are revalidated during partial installation. The exact eight-model catalog and
eight connected street circuits are used. Models load once per car type; clones
share geometry/material/texture objects and have independent wheel transforms.
Missing or invalid replacements keep the existing instanced moving traffic.

An explicit validator command for a partial fleet is:

```powershell
node tools/validate-traffic-assets.cjs --install de-tomaso-p72
```

List every currently present production car id when installing a partial fleet.
Validation without ids expects all eight. Never insert technical test assets in
the production registry.

## Verification

```powershell
npm run test:car-lods
npm test
npm run build
```

The separate Blender test creates an original ellipsoid/four-wheel technical
fixture under `.upgrade-baseline/traffic-lod-validation/`. It is **not** any of
the requested cars and is excluded from the project ZIP. Its exports are checked
for actual triangle/texture budgets, grounding, shared-resource LOD behavior,
and wheel/traffic placement through the project's GLTFLoader. Node hierarchy
checks omit image decoding; embedded PNG/JPEG dimensions are checked separately.

These checks establish pipeline behavior, not photorealism, browser FPS, GPU
memory or visual acceptance of the five remaining vehicle models.
