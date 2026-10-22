"""ZeroWatt Wind: prepare one downloaded car model for Three.js (Blender headless).

Run (Windows PowerShell, from the project root):
  & "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe" --background --python scripts\\blender\\prepare_car.py -- --input downloads\\cars\\jaguar-e-type.glb --output assets\\cars\\jaguar-e-type.glb --length 4.45 --front -Y

Output convention: glTF Y-up, nose toward +Z, centred on X/Z, wheels on y=0,
scaled so overall length equals --length metres. Draco is NOT used because the
project's GLTFLoader has no Draco decoder.
Blender 5.2 is available locally. Use make_traffic_lods.py for the three-level
traffic pipeline; this utility also provides shared import/bounds helpers.
"""
import argparse
import json
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector

FRONT = {'+X': (1, 0), '-X': (-1, 0), '+Y': (0, 1), '-Y': (0, -1)}


def parse():
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument('--input', required=True)
    p.add_argument('--output', required=True)
    p.add_argument('--length', type=float, required=True, help='overall car length in metres')
    p.add_argument('--front', default='-Y', choices=list(FRONT), help='Blender axis the nose points to AFTER import')
    p.add_argument('--target-tris', type=int, default=250000)
    p.add_argument('--max-texture', type=int, default=2048)
    p.add_argument('--keep-parts', action='store_true', help='do not join meshes (more draw calls, keeps wheels separate)')
    return p.parse_args(argv)


def import_model(path):
    ext = os.path.splitext(path)[1].lower()
    if ext in ('.glb', '.gltf'):
        bpy.ops.import_scene.gltf(filepath=path)
    elif ext == '.fbx':
        bpy.ops.import_scene.fbx(filepath=path)
    elif ext == '.obj':
        bpy.ops.wm.obj_import(filepath=path)
    elif ext == '.blend':
        with bpy.data.libraries.load(path, link=False) as (src, dst):
            dst.objects = list(src.objects)
        for obj in dst.objects:
            if obj is not None:
                bpy.context.scene.collection.objects.link(obj)
    else:
        raise SystemExit('Unsupported input type: ' + ext)


def world_bounds(objs):
    lo = Vector((1e9, 1e9, 1e9))
    hi = Vector((-1e9, -1e9, -1e9))
    for o in objs:
        for corner in o.bound_box:
            w = o.matrix_world @ Vector(corner)
            lo = Vector((min(lo[i], w[i]) for i in range(3)))
            hi = Vector((max(hi[i], w[i]) for i in range(3)))
    return lo, hi


def select_only(objs):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]


def tri_count(objs):
    return sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs)


def main():
    a = parse()
    src = os.path.abspath(a.input)
    out = os.path.abspath(a.output)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    warnings = []

    bpy.ops.wm.read_factory_settings(use_empty=True)
    import_model(src)
    scene = bpy.context.scene

    meshes = [o for o in scene.objects if o.type == 'MESH' and not o.hide_render]
    if not meshes:
        raise SystemExit('No mesh objects found in ' + src)
    for o in meshes:  # bake parent transforms, then drop the parents
        world = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = world
    for o in list(scene.objects):
        if o not in meshes:
            bpy.data.objects.remove(o, do_unlink=True)

    # Orient: rotate about Z so the nose points to Blender -Y (glTF +Z after export).
    fx, fy = FRONT[a.front]
    rot = Matrix.Rotation(math.atan2(-1, 0) - math.atan2(fy, fx), 4, 'Z')
    for o in meshes:
        o.matrix_world = rot @ o.matrix_world
    bpy.context.view_layer.update()

    lo, hi = world_bounds(meshes)
    ext = hi - lo
    if ext.y < ext.x * 1.2:
        warnings.append('Length (Y) is not clearly longer than width (X): --front is probably wrong.')
    scale = Matrix.Scale(a.length / max(ext.y, 1e-6), 4)
    for o in meshes:
        o.matrix_world = scale @ o.matrix_world
    bpy.context.view_layer.update()
    lo, hi = world_bounds(meshes)
    move = Matrix.Translation(Vector((-(lo.x + hi.x) / 2, -(lo.y + hi.y) / 2, -lo.z)))
    for o in meshes:
        o.matrix_world = move @ o.matrix_world
    bpy.context.view_layer.update()

    select_only(meshes)
    bpy.ops.object.make_single_user(object=True, obdata=True)
    meshes = [o for o in scene.objects if o.type == 'MESH']
    if not a.keep_parts and len(meshes) > 1:
        select_only(meshes)
        bpy.ops.object.join()
        meshes = [bpy.context.view_layer.objects.active]
    select_only(meshes)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    before = tri_count(meshes)
    if before > a.target_tris:
        ratio = a.target_tris / before
        for o in meshes:
            select_only([o])
            mod = o.modifiers.new('ZWDecimate', 'DECIMATE')
            mod.ratio = max(.05, ratio)
            bpy.ops.object.modifier_apply(modifier=mod.name)
    after = tri_count(meshes)

    for img in bpy.data.images:
        w, h = img.size
        if max(w, h) > a.max_texture:
            f = a.max_texture / max(w, h)
            img.scale(max(1, int(w * f)), max(1, int(h * f)))

    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_yup=True, export_apply=True,
                              export_image_format='AUTO', export_materials='EXPORT')
    lo, hi = world_bounds(meshes)
    report = {'input': src, 'output': out, 'triangles_before': before, 'triangles_after': after,
              'size_m': [round(v, 3) for v in (hi - lo)], 'bytes': os.path.getsize(out), 'warnings': warnings}
    with open(os.path.splitext(out)[0] + '.report.json', 'w') as fh:
        json.dump(report, fh, indent=2)
    print('ZW_CAR_REPORT ' + json.dumps(report))


if __name__ == '__main__':
    main()
