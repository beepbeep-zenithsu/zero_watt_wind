/** Keep the P72's shared paint/glass atlas compatible with instanced traffic. */
export function prepareCarMaterials(root, car) {
  if (car.id !== 'de-tomaso-p72') return;
  root.traverse(object => {
    if (!object.isMesh) return;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (!material) continue;
      // The atlas includes translucent windows and opaque bodywork. BLEND turns
      // off depth writes for the entire car, exposing far-side wheels through
      // the paint. Restore depth writes while keeping the atlas's glass alpha.
      material.depthWrite = true;
    }
  });
}
