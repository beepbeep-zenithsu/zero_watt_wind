"""Render the actual offline FieldScene mesh snapshots for geometry review.
Run node tools/verify-graphics.cjs first. These are Blender renders, NOT browser
screenshots: PMREM, GLSL water, particles, UI and browser color mapping differ.
"""
import bpy
import json
import math
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[2]
def V(v):return (v[0],-v[2],v[1])
for name in ['air-machinery','water-machinery','air','water']:
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    data=json.loads((ROOT/'.upgrade-baseline'/'verification'/(name+'.json')).read_text())
    for batch in data['batches']:
        positions=batch['positions'];indices=batch['indices'];normals=batch['normals']
        vertices=[V(positions[i:i+3]) for i in range(0,len(positions),3)]
        faces=[indices[i:i+3] for i in range(0,len(indices),3)]
        mesh=bpy.data.meshes.new(batch['name']);mesh.from_pydata(vertices,[],faces);mesh.update()
        obj=bpy.data.objects.new(batch['name'],mesh);bpy.context.collection.objects.link(obj)
        material=bpy.data.materials.new(batch['name']);material.use_nodes=True
        p=material.node_tree.nodes.get('Principled BSDF')
        p.inputs['Base Color'].default_value=(*batch['color'],1)
        p.inputs['Metallic'].default_value=batch['metalness']
        p.inputs['Roughness'].default_value=batch['roughness']
        p.inputs['Alpha'].default_value=batch['alpha']
        if batch['alpha']<1:material.surface_render_method='DITHERED'
        if 'texture' in batch:
            uv=mesh.uv_layers.new(name='Runtime UV')
            for loop in mesh.loops:uv.data[loop.index].uv=batch['uvs'][loop.vertex_index*2:loop.vertex_index*2+2]
            tex=batch['texture'];image=bpy.data.images.new('Runtime contact texture',width=tex['width'],height=tex['height'])
            image.colorspace_settings.name='Non-Color';image.pixels=[v/255 for v in tex['data']]
            node=material.node_tree.nodes.new('ShaderNodeTexImage');node.image=image
            material.node_tree.links.new(node.outputs['Color'],p.inputs['Base Color'])
            material.node_tree.links.new(node.outputs['Alpha'],p.inputs['Alpha'])
            material.surface_render_method='DITHERED'
        mesh.materials.append(material)
        for poly in mesh.polygons:poly.use_smooth=True
        mesh.normals_split_custom_set_from_vertices([V(normals[i:i+3]) for i in range(0,len(normals),3)])
    scene=bpy.context.scene
    world=bpy.data.worlds.new('Soft daylight');world.use_nodes=True
    world.node_tree.nodes['Background'].inputs['Color'].default_value=(.48,.59,.62,1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value=.65
    scene.world=world
    bpy.ops.object.light_add(type='SUN',location=(-8,-9,14))
    sun=bpy.context.object;sun.data.energy=2.1;sun.data.angle=.15
    sun.rotation_euler=(math.radians(25),math.radians(-28),math.radians(-35))
    bpy.ops.object.light_add(type='AREA',location=(2,-5,9))
    bpy.context.object.data.energy=700;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=8
    bpy.ops.object.camera_add(location=V(data['camera']['position']))
    camera=bpy.context.object;camera.rotation_euler=(Vector(V(data['camera']['target']))-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.sensor_fit='VERTICAL';camera.data.sensor_height=24;camera.data.lens=12/math.tan(math.radians(19));camera.data.clip_end=300
    scene.camera=camera
    scene.render.engine='CYCLES';scene.cycles.samples=16;scene.cycles.use_denoising=True
    scene.render.resolution_x=1200;scene.render.resolution_y=800;scene.render.resolution_percentage=100
    scene.view_settings.view_transform='AgX';scene.view_settings.exposure=-.25
    scene.render.image_settings.file_format='PNG';scene.render.filepath=str(ROOT/'docs'/'upgrade'/(name+'-blender-review.png'))
    bpy.ops.render.render(write_still=True)
    print('REVIEW_RENDER_READY',name)
