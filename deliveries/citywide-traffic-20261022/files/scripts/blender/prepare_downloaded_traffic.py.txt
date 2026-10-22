"""Prepare actual CC-BY downloaded cars; identify disconnected wheel geometry.
No replacement body geometry is authored here. Preserve original UVs and credits.
"""
import bpy,json,math,sys,hashlib
from pathlib import Path
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from make_traffic_lods import normalize
ROOT=Path(__file__).resolve().parents[2]
settings=[('jaguar-e-type','jaguar-e-type-nommoc','-X',4.45,'32aa25ea6e1b40f395b2aff33ca0a279'),
          ('porsche-taycan','porsche-taycan-martin','-Y',4.96,'875072396ef541e3b106152e6dea6978'),
          ('de-tomaso-p72','de-tomaso-p72','-Y',4.55,'ab85c302e652492196b600ee1eb7106a')]

def porsche_materials():
    specifications={'paint':((.19,.29,.36),.82,.24,1),'rubber':((.014,.018,.021),0,.9,1),
      'trim':((.022,.028,.032),.12,.48,1),'chrome':((.51,.57,.6),.92,.23,1),
      'glass':((.035,.065,.085),.05,.09,.38),'leather':((.035,.029,.027),0,.88,1),
      'red-leather':((.22,.038,.028),0,.86,1),'tail':((.55,.012,.009),.1,.2,1),'caliper':((.55,.055,.025),.55,.3,1)}
    materials={}
    for key,(color,metal,rough,alpha) in specifications.items():
        m=bpy.data.materials.new('Restored Taycan '+key);m.use_nodes=True
        node=m.node_tree.nodes.get('Principled BSDF');node.inputs['Base Color'].default_value=(*color,alpha)
        node.inputs['Metallic'].default_value=metal;node.inputs['Roughness'].default_value=rough;node.inputs['Alpha'].default_value=alpha
        if alpha<1:m.surface_render_method='DITHERED'
        if key=='tail':node.inputs['Emission Color'].default_value=(*color,1);node.inputs['Emission Strength'].default_value=.5
        materials[key]=m
    for obj in bpy.context.scene.objects:
        if obj.type!='MESH':continue
        for slot in obj.material_slots:
            name=slot.material.name.lower()
            key='paint'
            if 'glass' in name:key='tail' if 'redlight' in name else 'glass'
            elif 'caliper' in name:key='caliper'
            elif 'tire' in name or 'rubber' in name:key='rubber'
            elif any(s in name for s in ['leather','alcantara','stitch','seam','carpet','seatbelt']):key='red-leather' if 'red' in name else 'leather'
            elif 'aluminium' in name or 'bolt' in name:key='chrome'
            elif any(s in name for s in ['black','carbon','plastic','intbutton','intgrid','inttex']):key='trim'
            slot.material=materials[key]

def split_wheels(obj):
    mesh=obj.data;parents=list(range(len(mesh.vertices)))
    def find(i):
        while parents[i]!=i:parents[i]=parents[parents[i]];i=parents[i]
        return i
    for edge in mesh.edges:
        a,b=edge.vertices;ra,rb=find(a),find(b)
        if ra!=rb:parents[ra]=rb
    groups={}
    for vertex in mesh.vertices:groups.setdefault(find(vertex.index),[]).append(vertex.index)
    components=[]
    for key,vertices in groups.items():
        lo=Vector((math.inf,)*3);hi=Vector((-math.inf,)*3)
        for i in vertices:
            p=mesh.vertices[i].co
            for axis in range(3):lo[axis]=min(lo[axis],p[axis]);hi[axis]=max(hi[axis],p[axis])
        components.append({'key':key,'lo':lo,'hi':hi,'center':(lo+hi)*.5,'size':hi-lo,'vertices':len(vertices)})
    candidates=[c for c in components if .50<c['size'].z<.88 and .75<c['size'].y/c['size'].z<1.3 and .035<c['size'].x<.5 and abs(c['center'].x)>.52 and c['center'].z<.6 and c['lo'].z<.10]
    centers={}
    for component in sorted(candidates,key=lambda c:(c['size'].z,c['vertices']),reverse=True):
        p=component['center'];key=('F' if p.y<0 else 'R')+('L' if p.x<0 else 'R')
        if key not in centers:centers[key]=component
    print('WHEEL_CANDIDATES',json.dumps({k:{'center':list(v['center']),'size':list(v['size'])} for k,v in centers.items()}))
    if len(centers)!=4:
        return [],'Could not identify all four wheel components; source wheels retained static.'
    membership={}
    for component in components:
        p=component['center'];size=component['size']
        for key,reference in centers.items():
            c=reference['center'];r=reference['size'].z*.55
            if abs(p.x-c.x)<.18 and abs(p.y-c.y)<r*.6 and abs(p.z-c.z)<r*.55 and size.y<r*2.15 and size.z<r*2.15 and size.x<.5:
                membership[component['key']]=key;break
    # Select complete connected components, never arbitrary body polygons.
    attribute=mesh.attributes.new('ZW_WheelGroup','INT','FACE')
    names=['FL','FR','RL','RR']
    for polygon in mesh.polygons:
        key=membership.get(find(polygon.vertices[0]))
        material=mesh.materials[polygon.material_index].name.lower()
        attribute.data[polygon.index].value=names.index(key)+1 if key in names and 'caliper' not in material else 0
    wheels=[]
    for number,key in enumerate(names,1):
        bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
        bpy.context.tool_settings.mesh_select_mode=(False,False,True)
        bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='DESELECT');bpy.ops.object.mode_set(mode='OBJECT')
        mesh=obj.data;attribute=mesh.attributes['ZW_WheelGroup']
        for polygon in mesh.polygons:polygon.select=attribute.data[polygon.index].value==number
        if not any(p.select for p in mesh.polygons):continue
        bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.separate(type='SELECTED');bpy.ops.object.mode_set(mode='OBJECT')
        wheel=next(o for o in bpy.context.selected_objects if o!=obj);wheel.name='Wheel_'+key
        wheels.append({'id':key,'objects':[wheel.name]})
    return wheels,None

config=json.loads((ROOT/'assets/cars/traffic-sources.json').read_text())
for id,filename,front,length,uid in settings:
    original=ROOT/'downloads/cars'/(filename+'.glb')
    meshes=normalize({'front':front,'length':length,'wheels':[]},original)
    if id=='porsche-taycan':porsche_materials()
    wheels=[];warnings=[]
    body=meshes[0]
    wheels,warning=split_wheels(body)
    if warning:warnings.append(warning)
    if len({w['id'] for w in wheels})!=4:
        # Keep any successfully separated geometry but don't animate an
        # incomplete/misidentified set. No body mesh is deleted.
        wheels=[];warnings.append('Full four-wheel articulation needs further mesh review.')
    output=ROOT/'downloads/cars'/('prepared-'+id+'.blend')
    bpy.context.preferences.filepaths.file_preview_type='NONE';bpy.context.preferences.filepaths.save_version=0
    bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(output),compress=True)
    car=next(c for c in config['cars'] if c['id']==id)
    if uid=='ab85c302e652492196b600ee1eb7106a':metadata=json.loads((ROOT/'assets/cars/metadata/de-tomaso-p72.json').read_text())
    else:metadata=json.loads((ROOT/'downloads/cars'/(uid+'.json')).read_text())
    archive={'jaguar-e-type':'000-144','porsche-taycan':'000-014','de-tomaso-p72':'000-122'}[id]
    car.update({'input':str(output.relative_to(ROOT)).replace('\\','/'),'front':'-Y','wheels':wheels})
    car['source']={'uid':uid,'title':metadata['name'],'author':metadata['user']['displayName'],
      'url':'https://sketchfab.com/3d-models/'+uid,'license':'CC-BY-4.0','licenseUrl':'https://creativecommons.org/licenses/by/4.0/',
      'verified':True,'verifiedAt':'2026-10-22','status':'downloaded',
      'downloadUrl':f'https://huggingface.co/datasets/allenai/objaverse/resolve/main/glbs/{archive}/{uid}.glb',
      'originalFile':filename+'.glb',
      'originalSha256':hashlib.sha256(original.read_bytes()).hexdigest(),
      'provenance':'CC-BY creator listing; exact UID distributed by Allen Institute Objaverse under the original object license. '+('Creator describes modelling with Blender 2.93.' if id=='jaguar-e-type' else 'Public creator attribution/license retained.'),
      'changes':'Normalized scale/orientation; extracted disconnected wheel geometry where possible; reduced LODs/textures.'+(' Restored missing material colors with semantic PBR materials.' if id=='porsche-taycan' else ''),
      'warnings':warnings}
    (ROOT/'assets/cars/metadata'/(id+'.json')).write_text(json.dumps(metadata,indent=2))
    print('PREPARED_ACTUAL_CAR',id,'wheels',wheels,'warnings',warnings)
(ROOT/'assets/cars/traffic-sources.json').write_text(json.dumps(config,indent=2)+'\n')
