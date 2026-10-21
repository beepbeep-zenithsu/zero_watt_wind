"""Original luxury-inspired electric sedan and crossover; no external assets.
Wheel mesh buckets preserve meaningful names for runtime wheel/steering pivots.
"""
from pathlib import Path
exec((Path(__file__).parent/'build_environment.py').read_text().split("apartment('site-apartment-low'")[0])
paint=mat('City vehicle enamel',(1,1,1),.48,.22)
trim=mat('Vehicle polished chrome',(.60,.66,.68),.92,.17)
red=mat('Vehicle tail LEDs',(.6,.012,.018),.1,.24)
light=mat('City glow vehicle LEDs',(.9,.94,1),.1,.2)
light.node_tree.nodes['Principled BSDF'].inputs['Emission Color'].default_value=(.8,.9,1,1)
light.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value=.12

def loft(name,sections,m):
    verts=[]
    for z,w,low,high in sections:
        for x,y in [(-w*.82,low),(-w,low+.09),(-w,high-.10),(-w*.87,high),(w*.87,high),(w,high-.10),(w,low+.09),(w*.82,low)]:verts.append(V((x,y,z)))
    faces=[tuple(range(7,-1,-1))]
    for i in range(len(sections)-1):
        for j in range(8):faces.append((i*8+j,i*8+(j+1)%8,(i+1)*8+(j+1)%8,(i+1)*8+j))
    faces.append(tuple(range((len(sections)-1)*8,len(sections)*8)))
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);return finish(o,name,m,.035,True)

def vehicle(name,suv=False):
    begin(name);lift=.16 if suv else 0;half=.94 if suv else .92;wheelbase=1.43
    loft('Sculpted lower body',[(-2.36,.65,.40,.64),(-2.17,half*.95,.37,.82),(-1.48,half,.38,.89),(.9,half,.38,.91),(1.85,half*.95,.40,.78),(2.35,.70,.45,.65)],paint)
    box('Dark sill',(1.73,.12,3.32),(0,.40,0),dark,.04)
    loft('Glazed panoramic cabin',[(-1.44,.77,.82,.97),(-.81,.72,.87,1.42+lift),(.59,.71,.88,1.44+lift),(1.37,.80,.86,.99)],glass)
    loft('Floating roof',[(-.88,.66,1.39+lift,1.43+lift),(-.58,.69,1.46+lift,1.50+lift),(.41,.68,1.47+lift,1.51+lift),(.67,.64,1.40+lift,1.44+lift)],paint)
    for side in [-1,1]:
        rod('A pillar',(side*.77,.90,1.32),(side*.66,1.43+lift,.54),.032,paint)
        rod('C pillar',(side*.77,.87,-1.42),(side*.68,1.42+lift,-.78),.045,paint)
        rod('Chrome window surround',(side*.78,.89,-1.42),(side*.80,.90,1.30),.014,trim)
        rod('Black B pillar',(side*.735,.91,-.10),(side*.69,1.46+lift,-.10),.034,dark)
        for z in [-.72,.54]:
            box('Flush door handle',(.025,.028,.18),(side*(half+.006),.87,z),trim,.008)
            rod('Door shutline',(side*(half+.012),.47,z-.44),(side*(half+.012),.88,z-.44),.004,dark,6)
        box('Mirror stem',(.18,.035,.07),(side*.91,1.03,.84),dark,.01)
        sphere('Aerodynamic mirror',.10,(side*1.02,1.06,.82),(1,.65,1.6),paint)
        box('DRL blade',(.64,.044,.055),(side*.50,.74,2.22),light,.018)
        box('Headlamp lens',(.47,.09,.045),(side*.56,.65,2.26),glass,.018)
        box('Rear LED strip',(.68,.045,.035),(side*.47,.78,-2.22),red,.014)
        for z in [-wheelbase,wheelbase]:
            # Tire radius .345 gives a stable road contact at y=0.
            tag=('FL' if side<0 else 'FR') if z>0 else ('RL' if side<0 else 'RR')
            before=set(collection.objects)
            cyl('Performance tire',.345,.235,(side*.89,.345,z),rubber,'x',32)
            cyl('Ventilated brake disc',.232,.242,(side*.89,.345,z),dark,'x',32)
            torus('Machined alloy rim',.242,.022,(side*1.012,.345,z),trim,'x')
            cyl('Alloy center cap',.065,.25,(side*.89,.345,z),trim,'x',16)
            for j in range(10):
                a=j*math.tau/10
                rod('Forged wheel spoke',(side*1.014,.345+.05*math.sin(a),z+.05*math.cos(a)),(side*1.014,.345+.225*math.sin(a+.12),z+.225*math.cos(a+.12)),.014,trim,6)
            for o in set(collection.objects)-before:o['wheel']=tag
            # Curved arch lips hide the upper edge of each wheel inside the body.
            for j in range(12):
                a=j*math.pi/12;b=(j+1)*math.pi/12
                rod('Wheel arch trim',(side*.955,.345+.385*math.sin(a),z+.385*math.cos(a)),(side*.955,.345+.385*math.sin(b),z+.385*math.cos(b)),.017,dark,6)
    box('Lower front intake',(1.20,.13,.055),(0,.48,2.29),dark,.035)
    for x in [-.48,-.24,0,.24,.48]:box('Intake vane',(.025,.10,.07),(x,.48,2.32),trim)
    box('Rear diffuser',(1.28,.12,.10),(0,.40,-2.24),dark,.035)
    box('Rear plate',(.36,.10,.02),(0,.62,-2.28),white,.01)
    for x in [-.38,.38]:box('Seat headrest',(.28,.26,.18),(x,1.17+lift,-.30),dark,.06)
    # Join by material AND wheel identity; moving wheels remain independent.
    parts=list(collection.objects);buckets={}
    for o in parts:
        bpy.context.view_layer.objects.active=o
        for mod in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
        buckets.setdefault((o.get('wheel','body'),o.data.materials[0].name),[]).append(o)
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

vehicle('site-city-sedan')
vehicle('site-city-crossover',True)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'city-vehicles.blend'),compress=True)
old=json.loads((OUT/'manifest.json').read_text());old['assets'].update(manifest)
(OUT/'manifest.json').write_text(json.dumps(old,indent=2))
print('CITY_VEHICLES_READY',json.dumps(manifest))
