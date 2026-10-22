"""Actual installed car GLBs and actual room mesh review, not browser screenshots."""
import bpy,json,math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/cars'

def studio(target,position,file,width=1400,height=700):
    scene=bpy.context.scene
    world=bpy.data.worlds.new('Daylight studio');world.use_nodes=True
    background=world.node_tree.nodes.get('Background');background.inputs['Strength'].default_value=.45
    env=world.node_tree.nodes.new('ShaderNodeTexEnvironment');env.image=bpy.data.images.load(str(ROOT/'assets/textures/city/daylight.hdr'))
    world.node_tree.links.new(env.outputs['Color'],background.inputs['Color']);scene.world=world
    for location,energy,size in [((0,-5,10),1800,9),((-8,1,7),1400,7),((7,6,8),2000,7)]:
        bpy.ops.object.light_add(type='AREA',location=location);light=bpy.context.object
        light.data.energy=energy;light.data.shape='DISK';light.data.size=size
        light.rotation_euler=(Vector(target)-light.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.object.camera_add(location=position);camera=bpy.context.object
    camera.rotation_euler=(Vector(target)-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.lens=43
    scene.camera=camera;scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=True
    scene.render.resolution_x=width;scene.render.resolution_y=height;scene.render.resolution_percentage=100
    scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/file)
    bpy.ops.render.render(write_still=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
for id,x in [('jaguar-e-type',-5.5),('porsche-taycan',0),('de-tomaso-p72',5.5)]:
    previous=set(bpy.context.scene.objects)
    bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/cars/traffic'/(id+'-lod0.glb')))
    for obj in set(bpy.context.scene.objects)-previous:
        if obj.parent is None:obj.location.x+=x
bpy.ops.mesh.primitive_plane_add(size=200)
ground=bpy.context.object;ground.location.z=-.015
material=bpy.data.materials.new('Urban concrete studio');material.diffuse_color=(.17,.19,.20,1);ground.data.materials.append(material)
studio((0,0,.6),(11,-18,11),'installed-cars-review.png')

bpy.ops.wm.read_factory_settings(use_empty=True)
data=json.loads((OUT/'workstation-review.json').read_text())
def convert(p):return (p[0],-p[2],p[1])
for batch in data['batches']:
    vertices=[convert(batch['positions'][i:i+3]) for i in range(0,len(batch['positions']),3)]
    faces=[batch['indices'][i:i+3] for i in range(0,len(batch['indices']),3)]
    mesh=bpy.data.meshes.new(batch['name']);mesh.from_pydata(vertices,[],faces);mesh.update()
    obj=bpy.data.objects.new(batch['name'],mesh);bpy.context.collection.objects.link(obj)
    material=bpy.data.materials.new(batch['name']);material.use_nodes=True
    node=material.node_tree.nodes.get('Principled BSDF');node.inputs['Base Color'].default_value=(*batch['color'],1)
    node.inputs['Roughness'].default_value=batch['roughness'];node.inputs['Metallic'].default_value=batch['metalness'];mesh.materials.append(material)
    for polygon in mesh.polygons:polygon.use_smooth=True
    mesh.normals_split_custom_set_from_vertices([convert(batch['normals'][i:i+3]) for i in range(0,len(batch['normals']),3)])
studio(convert(data['camera']['target']),convert(data['camera']['position']),'workstation-review.png',1000,850)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(ROOT/'assets/environment/site-cyclist.glb'))
for name,value in {'Person skin':(.319,.120,.048,1),'Person shirt':(.142,.184,.107,1),'Person trousers':(.082,.091,.138,1),'Person hair':(.067,.030,.017,1)}.items():
    material=bpy.data.materials.get(name)
    if material:material.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=value
bpy.ops.mesh.primitive_plane_add(size=200);bpy.context.object.location.z=-.015
studio((0,0,.8),(3,-4,2.8),'cyclist-review.png',900,800)
print('MOBILITY_REVIEW_RENDERED')
