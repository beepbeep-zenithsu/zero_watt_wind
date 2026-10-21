"""Run with Blender --background --python tools/build_rotor.py.

Produces an editable Blender asset, portable GLB, and a compact browser mesh.
Coordinates deliberately match the existing website: the shaft rotates about X.
"""
import bpy
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "premium"
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

def material(name, color, metallic, roughness):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Metallic"].default_value = metallic
    p.inputs["Roughness"].default_value = roughness
    return m

ceramic = material("Pearl powder coating", (.84, .87, .85), .18, .29)
steel = material("Satin stainless steel", (.40, .46, .49), .78, .25)
dark = material("Graphite fasteners", (.035, .045, .05), .65, .32)

def finish(obj, mat, bevel=0):
    obj.data.materials.append(mat)
    for p in obj.data.polygons:
        p.use_smooth = True
    if bevel:
        mod = obj.modifiers.new("Manufactured edge radius", "BEVEL")
        mod.width = bevel
        mod.segments = 3
    return obj

for blade in range(3):
    verts, faces = [], []
    nu, nv = 48, 14
    for u in range(nu + 1):
        a = u / nu
        for v in range(nv + 1):
            t = v / nv
            r = .1 + t * (.38 + a * .7)
            theta = blade * math.tau / 3 + a * 2.7 + t * .3
            verts.append(((a - .5) * 1.5, r * math.cos(theta), r * math.sin(theta)))
    for u in range(nu):
        for v in range(nv):
            i = u * (nv + 1) + v
            faces.append((i, i + 1, i + nv + 2, i + nv + 1))
    mesh = bpy.data.meshes.new("Spiral surface")
    mesh.from_pydata(verts, [], faces)
    obj = bpy.data.objects.new(f"Blade_{blade+1}", mesh)
    bpy.context.collection.objects.link(obj)
    finish(obj, ceramic)
    mod = obj.modifiers.new("Blade thickness", "SOLIDIFY")
    mod.thickness = .014
    mod = obj.modifiers.new("Rounded blade edges", "BEVEL")
    mod.width = .006
    mod.segments = 2

def cylinder(name, radius, length, x, y=0, z=0, mat=steel, vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=length,
                                      location=(x, y, z), rotation=(0, math.pi / 2, 0))
    obj = bpy.context.object
    obj.name = name
    return finish(obj, mat, .008)

cylinder("Drive shaft", .105, 1.95, 0)
for x in (-.79, .85):
    cylinder("Machined hub", .235, .12, x)
    cylinder("Hub face", .18, .14, x, mat=ceramic)
    for j in range(6):
        theta = j * math.tau / 6
        cylinder("Hex fastener", .025, .025, x + (.075 if x > 0 else -.075),
                 .196 * math.cos(theta), .196 * math.sin(theta), dark, 6)

bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "rotor.blend"))
bpy.ops.export_scene.gltf(filepath=str(OUT / "rotor.glb"), export_format="GLB")

# A lightweight mesh interchange keeps the site's pinned Three.js installation
# self-contained. World transforms are baked; X remains the animation axis.
parts = []
depsgraph = bpy.context.evaluated_depsgraph_get()
for obj in bpy.context.scene.objects:
    if obj.type != "MESH":
        continue
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    mesh.calc_loop_triangles()
    positions, normals = [], []
    matrix = obj.matrix_world
    normal_matrix = matrix.to_3x3().inverted().transposed()
    for tri in mesh.loop_triangles:
        for loop_index in tri.loops:
            loop = mesh.loops[loop_index]
            position = matrix @ mesh.vertices[loop.vertex_index].co
            normal = (normal_matrix @ mesh.corner_normals[loop_index].vector).normalized()
            positions.extend(round(v, 6) for v in position)
            normals.extend(round(v, 6) for v in normal)
    m = obj.data.materials[0]
    p = m.node_tree.nodes.get("Principled BSDF")
    parts.append(dict(name=obj.name, positions=positions, normals=normals,
                      color=list(m.diffuse_color[:3]),
                      metalness=p.inputs["Metallic"].default_value,
                      roughness=p.inputs["Roughness"].default_value))
    evaluated.to_mesh_clear()
(OUT / "rotor.json").write_text(json.dumps(parts, separators=(",", ":")), encoding="utf-8")
print("PREMIUM_ROTOR_READY", len(parts), "parts")
