"""Original ellipsoid/wheel test fixture. NOT one of the eight requested cars."""
import json
import math
from pathlib import Path
import runpy
import sys
import bpy

root = Path(__file__).resolve().parents[2]
folder = root / '.upgrade-baseline/traffic-lod-validation'
folder.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
paint = bpy.data.materials.new('Pipeline_test_paint')
paint.use_nodes = True
bsdf = paint.node_tree.nodes.get('Principled BSDF')
bsdf.inputs['Metallic'].default_value = .7
bsdf.inputs['Roughness'].default_value = .25
image = bpy.data.images.new('Test_UV_Texture', width=256, height=256)
image.generated_type = 'COLOR_GRID'
texture = paint.node_tree.nodes.new('ShaderNodeTexImage')
texture.image = image
paint.node_tree.links.new(texture.outputs['Color'], bsdf.inputs['Base Color'])
bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, location=(0,0,.8))
body = bpy.context.object
body.name = 'TestBody'
body.scale = (1,2.3,.55)
body.data.materials.append(paint)
wheels = []
for name, x, y in [('FL',-1,-1.4),('FR',1,-1.4),('RL',-1,1.4),('RR',1,1.4)]:
    bpy.ops.mesh.primitive_torus_add(major_segments=48, minor_segments=16,
        major_radius=.26, minor_radius=.09, location=(x,y,.35), rotation=(0,math.pi/2,0))
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(paint)
    wheels.append({'id':name,'objects':[name]})
file = folder / 'original-test-fixture.blend'
bpy.context.preferences.filepaths.file_preview_type = 'NONE'
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(file))
config = {'root':str(root),'cars':[{'id':'lod-pipeline-fixture','length':4.6,
    'input':str(file),'front':'-Y','wheels':wheels,
    'source':{'verified':True,'license':'CC0-1.0','licenseUrl':'https://creativecommons.org/publicdomain/zero/1.0/',
              'title':'Original technical test fixture, not a branded vehicle','author':'ZeroWatt project',
              'url':'urn:zerowatt:technical-test-fixture','provenance':'Created by this local test script from primitives.'}}]}
manifest = folder / 'fixture-manifest.json'
manifest.write_text(json.dumps(config,indent=2),encoding='utf-8')
sys.argv = ['blender','--','--manifest',str(manifest),'--output',str(folder / 'exports'),
            '--budgets','7000,2000,600','--textures','128,64,32']
runpy.run_path(str(root / 'scripts/blender/make_traffic_lods.py'),run_name='__main__')
