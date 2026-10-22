"""Original commuter bicycle/rider, with named wheel, crank and leg parts."""
from pathlib import Path
exec((Path(__file__).parent/'build_city_bicycles.py').read_text().split("export('site-bicycle')")[0])
for obj in list(collection.objects):
    if obj.name.startswith('Grounded kickstand'):bpy.data.objects.remove(obj,do_unlink=True)
for obj in collection.objects:
    logical=(obj.location.x,obj.location.z,-obj.location.y)
    if obj.name.startswith(('Road tire','Brushed aluminum rim','Wheel hub','Crossed wheel spoke')):
        obj['part']='CycleFW' if logical[2]>0 else 'CycleRW'
    if obj.name.startswith(('Crank arm','Chainring')):obj['part']='CycleCrank'
    if obj.name.startswith('Platform pedal'):obj['part']='CyclePedalL' if logical[0]<0 else 'CyclePedalR'

skin=mat('Person skin',(1,1,1),0,.8)
shirt=mat('Person shirt',(1,1,1),0,.88)
trousers=mat('Person trousers',(1,1,1),0,.9)
hair=mat('Person hair',(1,1,1),0,.9)
eye_white=mat('Rider eye whites',(.82,.83,.76),0,.5)
lip=mat('Rider natural lips',(.25,.085,.055),0,.85)

def leg(side,angle=0):
    dy=side*(.15*math.cos(angle)-.08*math.sin(angle));dz=side*(.15*math.sin(angle)+.08*math.cos(angle))
    hip=(side*.10,1.05,-.22);ankle=(side*.11,.47+dy,-.06+dz)
    y=ankle[1]-hip[1];z=ankle[2]-hip[2];distance=math.hypot(y,z)
    a=(.44**2-.46**2+distance**2)/(2*distance);b=math.sqrt(max(0,.44**2-a*a))
    knee=(side*.105,hip[1]+a*y/distance+b*z/distance,hip[2]+a*z/distance-b*y/distance)
    return hip,knee,ankle,(side*.13,.35+dy,-.02+dz)

box('Cycling shorts pelvis',(.28,.14,.23),(0,1.06,-.22),trousers,.045)
rod('Forward leaning jersey',(0,1.10,-.20),(0,1.46,.10),.16,shirt,16)
sphere('Jersey shoulder contour',.17,(0,1.43,.09),(1,.70,.70),shirt)
cyl('Cyclist neck',.053,.12,(0,1.55,.16),skin)
sphere('Rider face',.12,(0,1.69,.19),(.86,1.10,.88),skin)
sphere('Protective cycling helmet',.135,(0,1.755,.17),(1,.68,1.12),shirt)
for x in [-.065,0,.065]:rod('Helmet ventilation groove',(x,1.84,.09),(x,1.84,.24),.009,dark,6)
sphere('Rider nose bridge',.021,(0,1.69,.296),(.7,1.1,1),skin)
sphere('Rider nose tip',.019,(0,1.675,.317),(.9,.7,.7),skin)
rod('Rider mouth',(-.025,1.64,.294),(.025,1.64,.294),.005,lip,8)
for side in [-1,1]:
    shoulder=(side*.15,1.44,.10);elbow=(side*.22,1.25,.22);hand=(side*.23,1.09,.45)
    rod('Short jersey sleeve',shoulder,elbow,.062,shirt,12)
    rod('Cyclist forearm',elbow,hand,.038,skin,12)
    sphere('Hands on handlebar grip',.044,hand,(1,.65,1),skin)
    sphere('Rider ear',.026,(side*.105,1.69,.185),(.45,1,.8),skin)
    sphere('Rider eye white',.019,(side*.04,1.71,.294),(1,.6,.5),eye_white)
    sphere('Rider pupil',.009,(side*.04,1.71,.304),(.7,.9,.4),dark)
    rod('Rider eyebrow',(side*.022,1.736,.293),(side*.060,1.734,.285),.005,dark,6)
    hip,knee,ankle,pedal=leg(side);suffix='L' if side<0 else 'R'
    before=set(collection.objects)
    rod('Cycling shorts thigh',hip,knee,.061,trousers,12)
    sphere('Knee',.053,knee,(1,1,1),skin)
    for obj in set(collection.objects)-before:obj['part']='CycleThigh'+suffix
    before=set(collection.objects)
    rod('Lower leg',knee,ankle,.039,skin,12)
    cyl('Ankle sock',.041,.10,(ankle[0],ankle[1]-.025,ankle[2]),white,n=12)
    for obj in set(collection.objects)-before:obj['part']='CycleCalf'+suffix
    before=set(collection.objects)
    box('Riding shoe',(.115,.08,.23),(pedal[0],pedal[1]+.065,pedal[2]+.045),dark,.022)
    box('Shoe sole',(.119,.023,.235),(pedal[0],pedal[1]+.027,pedal[2]+.045),rubber,.008)
    for obj in set(collection.objects)-before:obj['part']='CycleShoe'+suffix

buckets={}
for obj in list(collection.objects):
    bpy.context.view_layer.objects.active=obj
    for modifier in list(obj.modifiers):bpy.ops.object.modifier_apply(modifier=modifier.name)
    buckets.setdefault((obj.get('part','CycleBody'),obj.data.materials[0].name),[]).append(obj)
combined=[]
for (part,material),objects in buckets.items():
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:obj.select_set(True)
    bpy.context.view_layer.objects.active=objects[0]
    if len(objects)>1:bpy.ops.object.join()
    obj=bpy.context.object;obj.name=part+'_'+material.replace(' ','_')
    bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);combined.append(obj)
bpy.ops.object.select_all(action='DESELECT')
for obj in combined:obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'site-cyclist.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False)
bpy.context.preferences.filepaths.file_preview_type='NONE'
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'city-cyclists.blend'),compress=True)
triangles=0
for obj in combined:obj.data.calc_loop_triangles();triangles+=len(obj.data.loop_triangles)
old=json.loads((OUT/'manifest.json').read_text());old['assets']['site-cyclist']={'meshes':len(combined),'triangles':triangles,'bytes':(OUT/'site-cyclist.glb').stat().st_size}
(OUT/'manifest.json').write_text(json.dumps(old,indent=2))
print('CITY_CYCLIST_READY',old['assets']['site-cyclist'])
