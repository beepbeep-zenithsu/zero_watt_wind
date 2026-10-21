# Asset provenance

All new GLBs and Blender source assets are generated locally by
`scripts/blender/build_assets.py`. No third-party models or textures are used.
The normal textures are deterministic runtime DataTextures in
`src/graphics/surfaces.js`; no external image download is needed.

The following upstream Three.js r180 addons are vendored under the existing
Three.js MIT license at `vendor/THREE-LICENSE.txt`:

- `vendor/addons/loaders/GLTFLoader.js`
  https://github.com/mrdoob/three.js/blob/r180/examples/jsm/loaders/GLTFLoader.js
- `vendor/addons/utils/BufferGeometryUtils.js`
  https://github.com/mrdoob/three.js/blob/r180/examples/jsm/utils/BufferGeometryUtils.js
- `vendor/addons/environments/RoomEnvironment.js`
  https://github.com/mrdoob/three.js/blob/r180/examples/jsm/environments/RoomEnvironment.js

Only their bare `three` imports were changed to `../../three.module.js`, to use
the repository's existing pinned r180 runtime. Upstream license notices and
attribution are retained. No new npm runtime dependency is required.
