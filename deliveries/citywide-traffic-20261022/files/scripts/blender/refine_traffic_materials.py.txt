"""Refine paint and generated normals on the installed, attributed real meshes."""
import bpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
for id,paint,color,metal,rough in [('jaguar-e-type','body',(.025,.07,.045,1),.50,.32),
                                 ('porsche-taycan','Restored Taycan paint',(.14,.23,.29,1),.48,.38)]:
    file=ROOT/'assets/cars/traffic'/(id+'.blend');bpy.ops.wm.open_mainfile(filepath=str(file))
    material=bpy.data.materials.get(paint)
    if material:
        node=material.node_tree.nodes.get('Principled BSDF')
        for link in list(node.inputs['Base Color'].links):material.node_tree.links.remove(link)
        node.inputs['Base Color'].default_value=color;node.inputs['Metallic'].default_value=metal
        node.inputs['Roughness'].default_value=rough;node.inputs['Coat Weight'].default_value=.30;node.inputs['Coat Roughness'].default_value=.25
    for obj in bpy.context.scene.objects:
        if obj.type=='MESH':obj.data.normals_split_custom_set([(0,0,0)]*len(obj.data.loops))
    bpy.context.preferences.filepaths.file_preview_type='NONE';bpy.context.preferences.filepaths.save_version=0
    bpy.ops.wm.save_as_mainfile(filepath=str(file),compress=True)
print('TRAFFIC_PAINT_AND_NORMALS_REFINED')
