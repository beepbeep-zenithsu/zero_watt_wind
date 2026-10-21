"""Detailed instanced people with named limbs for lightweight runtime gestures."""
from pathlib import Path
exec((Path(__file__).parent/'build_environment.py').read_text().split("apartment('site-apartment-low'")[0])
skin=mat('Person skin',(1,1,1),0,.86)
shirt=mat('Person shirt',(1,1,1),0,.91)
trousers=mat('Person trousers',(1,1,1),0,.94)
hair=mat('Person hair',(1,1,1),0,.96)
eye=mat('Person eye white',(.84,.83,.75),0,.48)
iris=mat('Person eyes and brows',(.025,.018,.012),0,.4)
lip=mat('Person lips',(.28,.105,.075),0,.88)

def person(name,seated=False):
    begin(name);waist=.61 if seated else .91;chest=waist+.23;head=waist+.58
    box('Tailored waistband',(.30,.12,.22),(0,waist,0),trousers,.035)
    box('Shaped shirt',(.34,.40,.235),(0,chest,0),shirt,.075)
    for x in [-.08,.08]:rod('Collar fold',(x,chest+.19,.065),(x*.3,chest+.11,.125),.013,white)
    for y in [chest-.10,chest,chest+.10]:sphere('Shirt button',.007,(0,y,.122),(1,1,.5),white)
    cyl('Connected neck',.052,.12,(0,head-.16,0),skin,n=16)
    sphere('Sculpted face',.123,(0,head,0),(.86,1.14,.88),skin)
    sphere('Hair cap',.122,(0,head+.062,-.019),(.89,.68,.90),hair)
    sphere('Hair side part',.09,(-.055,head+.08,-.018),(.65,.43,1.1),hair)
    long=sphere('Long hair',.12,(0,head-.005,-.072),(.93,1.65,.55),hair);long['part']='HairLong'
    sphere('Nose bridge',.024,(0,head+.002,.108),(.62,1.1,1),skin)
    sphere('Nose tip',.023,(0,head-.014,.125),(.8,.65,.65),skin)
    for side in [-1,1]:
        sphere('Ear with lobe',.029,(side*.108,head-.004,-.006),(.42,1,.70),skin)
        sphere('Eye socket',.022,(side*.041,head+.022,.101),(1,.66,.45),eye)
        sphere('Pupil',.010,(side*.041,head+.023,.111),(.60,.78,.35),iris)
        rod('Eyebrow',(side*.020,head+.047,.104),(side*.060,head+.045,.096),.005,iris,6)
    rod('Upper lip',(-.027,head-.051,.100),(.027,head-.051,.100),.005,lip,8)
    rod('Lower lip',(-.021,head-.057,.099),(.021,head-.057,.099),.004,skin,8)
    for side in [-1,1]:
        before=set(collection.objects)
        shoulder=(side*.165,chest+.13,0);elbow=(side*.22,chest-.10,.015);wrist=(side*.21,chest-.30,.09)
        rod('Connected sleeve',shoulder,elbow,.063,shirt,12)
        rod('Forearm',elbow,wrist,.039,skin,12)
        sphere('Palm',.046,(side*.21,chest-.33,.095),(.72,1.1,.52),skin)
        for finger in range(4):rod('Finger',(side*.21+(finger-1.5)*.014,chest-.34,.095),(side*.21+(finger-1.5)*.014,chest-.395,.10),.006,skin,6)
        sphere('Thumb',.018,(side*.18,chest-.345,.12),(.8,1.5,.8),skin)
        for o in set(collection.objects)-before:o['part']='ArmL' if side<0 else 'ArmR'
        before=set(collection.objects)
        hip=(side*.085,waist-.02,0);knee=(side*.095,.49,.28 if seated else .018);ankle=(side*.10,.11,.32 if seated else .01)
        rod('Trouser thigh',hip,knee,.066,trousers,12)
        sphere('Knee joint',.058,knee,(1,1,1),trousers)
        rod('Trouser calf',knee,ankle,.049,trousers,12)
        box('Leather shoe',(.12,.09,.24),(side*.10,.045,.39 if seated else .085),dark,.025)
        box('Shoe sole',(.124,.025,.245),(side*.10,.0125,.39 if seated else .085),rubber,.01)
        for o in set(collection.objects)-before:o['part']='LegL' if side<0 else 'LegR'
    parts=list(collection.objects);buckets={}
    for o in parts:
        bpy.context.view_layer.objects.active=o
        for mod in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
        buckets.setdefault((o.get('part','Body'),o.data.materials[0].name),[]).append(o)
    combined=[]
    for (part,material),objects in buckets.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in objects:o.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        if len(objects)>1:bpy.ops.object.join()
        o=bpy.context.object;o.name=f'{part}_{material.replace(" ","_")}'
        bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
        bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);combined.append(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in combined:o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/(name+'.glb')),export_format='GLB',use_selection=True,export_yup=True,export_animations=False)
    triangles=0
    for o in combined:o.data.calc_loop_triangles();triangles+=len(o.data.loop_triangles)
    manifest[name]={'meshes':len(combined),'triangles':triangles,'bytes':(OUT/(name+'.glb')).stat().st_size}

person('site-pedestrian')
person('site-seated-person',True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'city-people.blend'),compress=True)
old=json.loads((OUT/'manifest.json').read_text());old['assets'].update(manifest)
(OUT/'manifest.json').write_text(json.dumps(old,indent=2))
print('CITY_PEOPLE_READY',json.dumps(manifest))
