"""Inspect downloaded source hierarchy and render small actual-source previews."""
import bpy,json,math,sys
from pathlib import Path
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from prepare_car import import_model,world_bounds
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/cars/source-previews';OUT.mkdir(parents=True,exist_ok=True)
for name in ['de-tomaso-p72','jaguar-e-type-nommoc','porsche-taycan-martin']:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    import_model(str(ROOT/'downloads/cars'/(name+'.glb')))
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    bpy.context.view_layer.update();lo,hi=world_bounds(meshes);center=(lo+hi)/2;size=hi-lo
    report={'name':name,'bounds':[list(lo),list(hi)],'objects':[{'name':o.name,'polygons':len(o.data.polygons),'materials':[m.name for m in o.data.materials]} for o in meshes]}
    (OUT/(name+'.json')).write_text(json.dumps(report,indent=2))
    distance=max(size)*1.65
    for index,direction in enumerate([(1,-1,.7),(-1,1,.7)]):
        scene=bpy.context.scene
        world=bpy.data.worlds.new('Inspection daylight');world.use_nodes=True
        world.node_tree.nodes['Background'].inputs['Color'].default_value=(.55,.61,.72,1)
        world.node_tree.nodes['Background'].inputs['Strength'].default_value=.65;scene.world=world
        bpy.ops.object.light_add(type='AREA',location=center+Vector((distance*.3,-distance*.7,distance)))
        bpy.context.object.data.energy=1000*(max(size)/5)**2;bpy.context.object.data.size=max(size)
        bpy.ops.object.camera_add(location=center+Vector(direction).normalized()*distance)
        camera=bpy.context.object;camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.clip_end=distance*20
        scene.camera=camera;scene.render.engine='CYCLES';scene.cycles.samples=12;scene.cycles.use_denoising=True
        scene.render.resolution_x=700;scene.render.resolution_y=450;scene.render.resolution_percentage=100
        scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG'
        scene.render.filepath=str(OUT/f'{name}-{index}.png');bpy.ops.render.render(write_still=True)
    print('INSPECTED_SOURCE',json.dumps(report))
