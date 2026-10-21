"""Detailed shared site assets, authored in Blender and exported in metres/Y-up.
Run npm run assets:environment. No downloaded models or textures are required.
The editable source retains one collection per exported asset; browser meshes
are joined by material and cached across Basic, Advanced and Pond scenes.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets'/'environment'
OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.context.preferences.filepaths.save_version=0

def V(p):return Vector((p[0],-p[2],p[1]))
def mat(name,color,metal=0,rough=.7):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    return m
cream=mat('Limestone render',(.73,.69,.59))
white=mat('Warm white precast',(.85,.83,.75),0,.78)
brick=mat('Terracotta brick',(.43,.22,.14),0,.92)
sage=mat('Sage ceramic cladding',(.25,.36,.32),0,.78)
stone=mat('Honed grey sandstone',(.37,.40,.38),0,.94)
dark=mat('Anthracite anodized metal',(.045,.063,.066),.65,.38)
steel=mat('Galvanized brushed steel',(.42,.48,.49),.8,.32)
glass=mat('Blue reflective glazing',(.09,.22,.29),.35,.17)
wood=mat('Weathered warm teak',(.37,.22,.105),0,.66)
rubber=mat('Rubber gaskets and feet',(.019,.023,.025),0,.9)
leaf=mat('Garden evergreen',(.10,.22,.075),0,.89)
orange=mat('Safety orange',(.85,.24,.045),0,.52)
rope=mat('Braided natural rope',(.52,.44,.28),0,.95)
skin=mat('Warm skin',(.57,.38,.25),0,.9)
shirt=mat('Woven blue cotton',(.13,.28,.35),0,.95)
trousers=mat('Charcoal twill',(.055,.075,.08),0,.95)
hair=mat('Dark hair',(.045,.032,.025),0,.98)
lamp=mat('Opal light diffuser',(.92,.85,.68),0,.37)
lp=lamp.node_tree.nodes.get('Principled BSDF')
lp.inputs['Emission Color'].default_value=(.65,.48,.25,1)
lp.inputs['Emission Strength'].default_value=.25
manifest={};collection=None

def begin(name):
    global collection
    collection=bpy.data.collections.new(name);bpy.context.scene.collection.children.link(collection)
def finish(o,name,m,bevel=0,smooth=False):
    o.name=name
    for c in list(o.users_collection):c.objects.unlink(o)
    collection.objects.link(o);o.data.materials.append(m)
    for p in o.data.polygons:p.use_smooth=smooth
    if bevel:
        mod=o.modifiers.new('Architectural eased edge','BEVEL');mod.width=bevel;mod.segments=2
    return o
def box(name,size,pos,m,bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=V(pos));o=bpy.context.object
    o.scale=(size[0],size[2],size[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(o,name,m,bevel)
def cyl(name,r,length,pos,m,axis='y',n=16,r2=None):
    bpy.ops.mesh.primitive_cone_add(vertices=n,radius1=r,radius2=r if r2 is None else r2,depth=length,location=V(pos))
    o=bpy.context.object;o.rotation_euler=Vector((0,0,1)).rotation_difference(V({'x':(1,0,0),'y':(0,1,0),'z':(0,0,1)}[axis])).to_euler()
    return finish(o,name,m,0,True)
def rod(name,a,b,r,m,n=10):
    d=V(b)-V(a)
    bpy.ops.mesh.primitive_cylinder_add(vertices=n,radius=r,depth=d.length,location=(V(a)+V(b))/2)
    o=bpy.context.object;o.rotation_euler=Vector((0,0,1)).rotation_difference(d.normalized()).to_euler()
    return finish(o,name,m,0,True)
def sphere(name,r,pos,scale,m):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=10,radius=r,location=V(pos))
    o=bpy.context.object;o.scale=(scale[0],scale[2],scale[1]);return finish(o,name,m,0,True)
def torus(name,r,t,pos,m,axis='y'):
    bpy.ops.mesh.primitive_torus_add(major_segments=32,minor_segments=8,major_radius=r,minor_radius=t,location=V(pos))
    o=bpy.context.object;o.rotation_euler=Vector((0,0,1)).rotation_difference(V({'y':(0,1,0),'z':(0,0,1),'x':(1,0,0)}[axis])).to_euler()
    return finish(o,name,m,0,True)
def export(name):
    parts=list(collection.objects);buckets={}
    for o in parts:
        bpy.context.view_layer.objects.active=o
        for mod in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
        buckets.setdefault(o.data.materials[0].name,[]).append(o)
    combined=[]
    for material,objects in buckets.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in objects:o.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        if len(objects)>1:bpy.ops.object.join()
        o=bpy.context.object;o.name=name+'_'+material.replace(' ','_')
        bpy.context.scene.cursor.location=(0,0,0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
        bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);combined.append(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in combined:o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/(name+'.glb')),export_format='GLB',use_selection=True,
        export_yup=True,export_animations=False,export_cameras=False,export_lights=False)
    triangles=0
    for o in combined:o.data.calc_loop_triangles();triangles+=len(o.data.loop_triangles)
    manifest[name]={'meshes':len(combined),'triangles':triangles,'bytes':(OUT/(name+'.glb')).stat().st_size}

def apartment(name,floors,facade):
    begin(name);W=3.8;D=3.2;H=.55+floors*1.65
    box('Paved frontage',(4.55,.14,4.2),(0,.07,.18),stone,.025)
    box('Raised masonry plinth',(4,.35,3.4),(0,.29,0),stone,.02)
    box('Render building core',(W,H-.4,D),(0,(H+.4)/2,0),facade,.025)
    # Four finished elevations keep orbit and street views equally complete.
    for side in ['front','back','left','right']:
        for floor in range(floors):
            y=1.2+floor*1.65
            for column in [-1,1]:
                x=column*.93
                def face(label,size,p,m):
                    if side=='front':return box(label,size,p,m)
                    if side=='back':return box(label,size,(-p[0],p[1],-p[2]),m)
                    sign=-1 if side=='left' else 1
                    return box(label,(size[2],size[1],size[0]),(sign*(W/2+p[2]-D/2),p[1],p[0]*sign),m)
                face('Deep window shadow',(.91,1.09,.06),(x,y,D/2+.032),dark)
                face('Reflective inset glass',(.77,.94,.018),(x,y,D/2+.073),glass)
                for dx in [-.43,.43]:face('Precast vertical window reveal',(.065,1.13,.14),(x+dx,y,D/2+.075),white)
                for dy in [-.54,.54]:face('Projecting window sill',(.98,.065,.22),(x,y+dy,D/2+.11),white)
                face('Window mullion',(.025,.96,.05),(x,y,D/2+.09),dark)
                face('Transom',(.79,.026,.05),(x,y+.19,D/2+.09),dark)
                if floor>0 and side=='front':
                    box('Cantilevered balcony slab',(1.20,.085,.56),(x,y-.60,D/2+.28),white)
                    for dx in [-.55,.55]:rod('Balcony upright',(x+dx,y-.55,D/2+.52),(x+dx,y-.02,D/2+.52),.018,dark)
                    rod('Balcony handrail',(x-.56,y-.02,D/2+.52),(x+.56,y-.02,D/2+.52),.024,dark)
                    for j in range(8):rod('Balcony baluster',(x-.48+j*.137,y-.52,D/2+.52),(x-.48+j*.137,y-.04,D/2+.52),.009,steel,6)
            box('Expressed floor slab',(W+.14,.075,D+.14),(0,.48+floor*1.65,0),white)
    for x in [-1.82,1.82]:box('Masonry corner pier',(.15,H-.4,.16),(x,(H+.4)/2,D/2+.035),brick)
    # Entrance sits between the ground-floor windows.
    box('Entrance reveal',(.59,1.08,.10),(0,.95,D/2+.06),dark)
    box('Timber entrance door',(.46,.98,.045),(0,.93,D/2+.13),wood)
    box('Door glazing',(.32,.54,.018),(0,1.08,D/2+.158),glass)
    rod('Entrance pull',(.15,.81,D/2+.19),(.15,1.05,D/2+.19),.013,steel)
    box('Entrance canopy',(.92,.09,.72),(0,1.63,D/2+.32),dark,.012)
    for i in range(2):box('Front entrance step',(.90,.10,.30),(0,.15+i*.10,D/2+.40-i*.16),white)
    box('Roof coping',(W+.20,.12,D+.20),(0,H+.045,0),white,.01)
    for x in [-W/2,W/2]:box('Roof parapet',(.11,.27,D+.15),(x,H+.22,0),facade)
    for z in [-D/2,D/2]:box('Roof parapet',(W+.15,.27,.11),(0,H+.22,z),facade)
    box('Roof access room',(1.0,.82,1.05),(-.7,H+.47,-.62),facade,.015)
    box('Stair head cap',(1.13,.09,1.18),(-.7,H+.92,-.62),white)
    cyl('Rooftop water tank',.37,.66,(.76,H+.50,-.55),white,n=24)
    for dx in [-.22,.22]:box('Tank support saddle',(.10,.13,.52),(.76+dx,H+.16,-.55),steel)
    for h in [.24,.49,.76]:torus('Tank reinforcement ring',.375,.017,(.76,H+h,-.55),steel)
    cyl('Tank inspection lid',.21,.045,(.76,H+.85,-.55),dark)
    rod('Tank water feed',(.76,H+.8,-.55),(1.25,H+.8,-.55),.022,steel)
    rod('Roof downpipe',(1.25,H+.8,-.55),(1.25,H+.18,-.55),.022,steel)
    box('Air conditioner condenser',(.60,.47,.38),(1.1,H+.32,.75),white,.02)
    for i in range(7):box('Condenser fins',(.53,.017,.02),(1.1,H+.15+i*.05,.95),steel)
    for side in [-1,1]:
        rod('Facade rainwater pipe',(side*1.97,.35,-1.1),(side*1.97,H+.18,-1.1),.035,steel)
        for floor in range(floors):box('Downpipe clip',(.10,.04,.10),(side*1.97,.8+floor*1.65,-1.1),dark)
    for x in [-1.50,1.50]:
        box('Front planter',(.56,.30,.40),(x,.46,1.99),stone,.02)
        for i in range(5):sphere('Planter foliage',.13,(x+(i-2)*.08,.70+(i%2)*.08,1.99),(1,1.3,.8),leaf)
    export(name)

apartment('site-apartment-low',2,cream)
apartment('site-apartment-mid',3,sage)
apartment('site-apartment-tall',4,brick)

begin('Corner pier')
box('Rusticated stone plinth',(.29,.52,.29),(0,.26,0),stone,.012)
box('Precast corner column',(.20,2.77,.20),(0,1.915,0),white,.012)
for y in [.70,1.34,1.98,2.62,3.26]:box('Column reveal',(.215,.025,.215),(0,y,0),stone)
box('Capital',(.30,.13,.30),(0,3.43,0),white,.012)
export('site-corner-pier')

begin('Window surround')
for x in [-.5,.5]:box('Recessed jamb',(.052,1.55,.17),(x,0,.025),white,.008)
for y in [-.75,.75]:box('Window trim lintel',(1.08,.055,.18),(0,y,.025),white,.008)
box('Sloped projecting stone sill',(1.12,.065,.33),(0,-.82,.09),stone,.01)
for x in [-.45,.45]:box('Sill end cap',(.055,.08,.34),(x,-.795,.09),white)
export('site-window-trim')

begin('Rainwater stack')
cyl('Painted rainwater downpipe',.045,3.18,(0,1.82,.14),dark,n=16)
box('Rain hopper',(.23,.23,.20),(0,3.47,.14),dark,.012)
for y in [.6,1.5,2.4,3.18]:
    box('Wall fixing bracket',(.16,.045,.15),(0,y,.055),steel)
    torus('Pipe strap',.049,.008,(0,y,.14),steel)
rod('Downpipe discharge',(0,.25,.14),(0,.13,.35),.045,dark)
export('site-downpipe')

begin('Entrance canopy')
box('Folded entry canopy',(1.55,.10,.93),(0,2.84,.38),dark,.015)
box('Canopy soffit',(1.43,.035,.80),(0,2.77,.38),white)
for x in [-.63,.63]:rod('Canopy tension stay',(x,3.28,-.03),(x,2.87,.78),.018,steel)
box('Entrance downlight',(.25,.025,.19),(0,2.74,.36),lamp,.012)
export('site-entry-canopy')

begin('Park furniture')
for z in [-.18,-.06,.06,.18]:box('Individual teak seat slat',(1.65,.055,.095),(0,.47,z),wood,.012)
for y in [.67,.81,.95]:box('Teak backrest slat',(1.65,.095,.045),(0,y,-.20),wood,.012)
for x in [-.65,.65]:
    for z in [-.17,.17]:box('Cast metal bench leg',(.055,.43,.07),(x,.235,z),dark,.01)
    box('Armrest',(.065,.055,.49),(x,.70,0),wood,.012)
    rod('Armrest support',(x,.45,.17),(x,.68,.17),.025,dark)
    rod('Backrest upright',(x,.25,-.17),(x,.99,-.20),.023,dark)
export('site-bench')

begin('Path lighting')
box('Bollard anchor',(.26,.06,.26),(0,.03,0),stone,.02)
box('Bollard body',(.12,.78,.12),(0,.42,0),dark,.015)
box('Opal diffuser',(.15,.12,.15),(0,.82,0),lamp,.01)
box('Weather hood',(.21,.035,.21),(0,.90,0),dark,.01)
for x in [-.085,.085]:cyl('Foundation bolt',.017,.025,(x,.07,0),steel,n=6)
export('site-bollard')

begin('Deck mooring hardware')
box('Mooring cleat base',(.30,.025,.15),(0,.013,0),steel,.008)
for x in [-.11,.11]:cyl('Cleat through bolt',.021,.018,(x,.034,0),dark,n=6)
for x in [-.06,.06]:rod('Cleat upright',(x,.03,0),(x,.12,0),.022,steel)
rod('Cleat horn',(-.19,.13,0),(.19,.13,0),.028,steel)
for i in range(4):torus('Coiled mooring line',.105+i*.018,.009,(.04,.045,.20),rope)
export('site-deck-cleat')

begin('Deck safety ring')
torus('Orange lifebuoy',.24,.062,(0,.07,0),orange)
for a in [0,math.pi/2,math.pi,math.pi*1.5]:
    x,z=.24*math.cos(a),.24*math.sin(a)
    box('White reflective band',(.09,.105,.09),(x,.07,z),white,.01)
torus('Perimeter grab rope',.33,.010,(0,.07,0),rope)
export('site-lifebuoy')

begin('Seated occupant')
box('Trouser waist',(.26,.14,.20),(0,.62,-.01),trousers,.035)
box('Cotton shirt torso',(.27,.36,.19),(0,.84,-.025),shirt,.065)
box('Shirt collar',(.11,.025,.12),(0,1.025,-.015),white,.01)
cyl('Neck',.044,.09,(0,1.065,-.015),skin,n=16)
sphere('Head',.119,(0,1.19,-.015),(.85,1.13,.90),skin)
sphere('Hair crown',.117,(0,1.245,-.025),(.87,.64,.93),hair)
sphere('Nose',.027,(0,1.19,.091),(.65,.8,1),skin)
for sign in [-1,1]:
    sphere('Ear',.025,(sign*.105,1.19,-.01),(.45,1,.8),skin)
    rod('Short sleeve',(sign*.13,.97,-.02),(sign*.17,.85,.04),.056,shirt)
    rod('Forearm',(sign*.17,.85,.04),(sign*.17,.65,.17),.037,skin)
    sphere('Hand',.041,(sign*.17,.64,.20),(.7,.6,1),skin)
    rod('Seated thigh',(sign*.075,.54,-.02),(sign*.095,.54,.27),.066,trousers)
    rod('Trouser shin',(sign*.095,.51,.27),(sign*.095,.12,.31),.048,trousers)
    box('Shoe',(.095,.075,.19),(sign*.095,.075,.35),dark,.024)
export('site-seated-person')

begin('Pond fish')
scales=mat('Copper fish scales',(.55,.32,.09),.25,.43)
fin=mat('Translucent amber fins',(.36,.18,.045),.05,.6)
sphere('Streamlined fish body',.14,(0,0,0),(2.1,.65,.78),scales)
sphere('Fish head',.095,(.20,.005,0),(.85,.85,.9),scales)
for side in [-1,1]:
    sphere('Black fish eye',.014,(.236,.032,side*.069),(1,1,.45),dark)
    rod('Gill crease',(.15,-.04,side*.075),(.15,.05,side*.075),.004,fin,6)
    rod('Pectoral fin',(.08,-.035,side*.06),(-.015,-.055,side*.17),.015,fin,6)
vs=[(-.24,0,0),(-.43,.13,.015),(-.38,0,0),(-.43,-.13,.015),(-.24,0,-.012)]
data=bpy.data.meshes.new('Forked tail');data.from_pydata([V(v) for v in vs],[],[(0,1,2,4),(0,4,2,3)]);data.update()
o=bpy.data.objects.new('Forked tail fin',data);collection.objects.link(o);data.materials.append(fin)
rod('Dorsal fin',(-.12,.07,0),(-.04,.15,0),.018,fin,6)
export('site-fish')

# Urban district library: real facade relief, street equipment and vehicles.
cityPaint=mat('City vehicle enamel',(.73,.75,.76),.28,.29)
asphalt=mat('City asphalt',(.11,.13,.14),0,.97)
litGlass=mat('City glow office windows',(.12,.24,.30),.22,.24)
litGlass.node_tree.nodes['Principled BSDF'].inputs['Emission Color'].default_value=(.80,.53,.23,1)
litGlass.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value=.03
cityLamp=mat('City glow street luminaires',(.91,.90,.79),.05,.3)
cityLamp.node_tree.nodes['Principled BSDF'].inputs['Emission Color'].default_value=(1,.77,.42,1)
cityLamp.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value=.10

begin('Urban canyon office tower')
W=4.8;D=7.0;H=14.8
box('Granite podium',(W+.5,.38,D+.5),(0,.19,0),stone,.03)
box('Brick and concrete tower',(W,H-.38,D),(0,(H+.38)/2,0),cream,.025)
for side in range(4):
    span=W if side%2==0 else D
    def facade(label,size,p,m):
        x,y,z=p
        if side==0:return box(label,size,(x,y,D/2+z),m)
        if side==2:return box(label,size,(-x,y,-D/2-z),m)
        sign=1 if side==1 else -1
        return box(label,(size[2],size[1],size[0]),(sign*(W/2+z),y,-sign*x),m)
    columns=3 if side%2==0 else 4
    for floor in range(5):
        y=1.75+floor*2.65
        for col in range(columns):
            x=(col-(columns-1)/2)*(span-.75)/columns
            facade('Recessed glazing shadow',((span-.75)/columns-.16,1.64,.045),(x,y,.026),dark)
            facade('Double glazing',((span-.75)/columns-.28,1.47,.025),(x,y,.068),litGlass if (floor+col+side)%3==0 else glass)
            for dx in [-1,1]:facade('Deep facade jamb',(.075,1.80,.20),(x+dx*((span-.75)/columns-.12)/2,y,.075),white)
            facade('Deep window sill',((span-.75)/columns, .08,.28),(x,y-.86,.10),white)
            facade('Window mullion',(.038,1.49,.055),(x,y,.095),steel)
        facade('Horizontal sunshade',(span+.12,.10,.42),(0,y+1,.14),white)
    for x in [-span/2+.12,span/2-.12]:facade('Vertical ceramic fin',(.19,H-.5,.26),(x,H/2+.15,.09),sage)
    for i in range(3):facade('Ground-floor ventilation grille',(.70,.035,.06),(-span/2+.7, .7+i*.12,.13),steel)
box('Commercial entrance glass',(1.2,2.12,.08),(0,1.44,D/2+.15),glass)
box('Entrance frame',(1.4,.10,.15),(0,2.54,D/2+.18),dark)
box('Office entrance canopy',(2.20,.12,1.25),(0,2.8,D/2+.5),dark,.02)
for x in [-.47,.47]:rod('Office pull handle',(x,1.25,D/2+.22),(x,1.70,D/2+.22),.02,steel)
box('Roof parapet cap',(W+.4,.17,D+.4),(0,H+.085,0),white,.01)
for x in [-W/2,W/2]:box('Roof guard parapet',(.15,.38,D+.25),(x,H+.30,0),sage)
for z in [-D/2,D/2]:box('Roof guard parapet',(W+.25,.38,.15),(0,H+.30,z),sage)
box('Lift overrun',(1.5,1.4,2.0),(-1,H+.75,-1.6),cream,.02)
for x in [.3,1.5]:
    box('HVAC condenser',(.85,.72,1.65),(x,H+.48,.6),steel,.02)
    for z in [.14,.62,1.10]:cyl('HVAC fan guard',.27,.045,(x,H+.87,z),dark,n=20)
for z in [-2.6,2.5]:cyl('Rooftop vent',.16,.65,(1,H+.4,z),steel,n=16)
export('site-canyon-tower')

begin('Neighborhood retail frontage')
box('Shop plinth',(7.4,.22,4.5),(0,.11,0),stone,.015)
box('Retail masonry',(7.0,3.2,4.1),(0,1.82,0),brick,.02)
for k in [-1,0,1]:
    x=k*2.27
    box('Shop window surround',(2.1,2.25,.08),(x,1.48,2.10),dark)
    box('Shop glazing',(1.95,2.08,.035),(x,1.48,2.16),glass)
    box('Storefront transom',(2.04,.06,.09),(x,2.20,2.19),steel)
    box('Door upright',(.055,2.10,.09),(x+.48,1.48,2.19),steel)
    box('Shopfront sign fascia',(2.10,.38,.15),(x,2.85,2.16),sage if k!=0 else cream)
    awning=box('Canvas sun awning',(2.18,.08,.90),(x,2.58,2.47),cream if k==0 else sage)
    awning.rotation_euler.x=math.radians(-9)
    box('Awning valance',(2.18,.15,.045),(x,2.45,2.91),white)
    rod('Shop door pull',(x+.62,1.25,2.23),(x+.62,1.60,2.23),.014,steel)
for x in [-3.49,-1.15,1.15,3.49]:box('Brick shop pilaster',(.13,3.22,.22),(x,1.83,2.10),white)
box('Retail roof cornice',(7.35,.18,4.4),(0,3.48,0),white,.015)
for x in [-2,1.8]:
    box('Roof condenser unit',(1,.54,.8),(x,3.82,0),steel,.015)
    cyl('Roof condenser grille',.25,.035,(x,4.11,0),dark,n=20)
export('site-shopfront')

begin('Distant city block')
box('Distant masonry building',(5.8,11,5.4),(0,5.5,0),sage)
for y in [1.3,3.1,4.9,6.7,8.5,10.3]:
    for side in [-1,1]:
        box('Distant glazing band',(5.52,.88,.035),(0,y,side*2.72),glass)
        box('Distant side glazing band',(.035,.88,5.12),(side*2.92,y,0),glass)
    for x in [-2,-.7,.7,2]:
        for side in [-1,1]:box('Distant window upright',(.07,.90,.055),(x,y,side*2.75),white)
box('Distant roof ledge',(6.1,.22,5.7),(0,11.10,0),white)
box('Roof service penthouse',(2,1.15,2),(0,11.7,-.5),cream)
export('site-distant-block')

begin('City hatchback')
box('Car underbody',(1.62,.28,3.55),(0,.46,0),dark,.09)
box('Pressed car body',(1.72,.48,3.72),(0,.71,0),cityPaint,.15)
box('Passenger cabin',(1.47,.58,1.93),(0,1.18,-.18),cityPaint,.16)
box('Windshield',(1.31,.43,.035),(0,1.22,.81),glass,.035)
box('Rear windshield',(1.29,.37,.035),(0,1.22,-1.15),glass,.025)
for side in [-1,1]:
    for z in [-.69,.29]:box('Side window',(.025,.39,.79),(side*.745,1.23,z),glass,.025)
    box('B pillar',(.035,.46,.10),(side*.765,1.20,-.18),dark)
    for z in [-1.15,1.15]:
        cyl('Road tire',.31,.17,(side*.80,.37,z),rubber,'x',24)
        cyl('Alloy wheel',.20,.178,(side*.80,.37,z),steel,'x',16)
        cyl('Wheel hub',.065,.185,(side*.80,.37,z),dark,'x',12)
    box('Door handle',(.026,.035,.19),(side*.865,.88,-.10),steel,.008)
    box('Wing mirror',(.16,.12,.22),(side*.91,1.04,.57),cityPaint,.025)
    box('Headlamp',(.43,.15,.055),(side*.51,.78,1.865),cityLamp,.025)
    box('Rear lamp',(.38,.17,.045),(side*.55,.78,-1.865),orange,.025)
box('Front intake grille',(.85,.13,.045),(0,.52,1.88),dark)
export('site-city-car')

begin('City street light')
box('Street light footing',(.42,.16,.42),(0,.08,0),stone,.02)
cyl('Tapered lamp column',.075,4.9,(0,2.61,0),dark,n=16,r2=.045)
rod('Curved lamp arm',(0,4.95,0),(0,5.28,.40),.045,dark)
rod('Cantilever lamp arm',(0,5.28,.40),(0,5.28,1.24),.045,dark)
box('LED lamp housing',(.37,.10,.75),(0,5.25,1.23),dark,.04)
box('Warm LED light panel',(.30,.018,.64),(0,5.19,1.23),cityLamp,.015)
for x in [-.13,.13]:cyl('Pole anchor bolt',.023,.03,(x,.18,0),steel,n=6)
export('site-street-lamp')

begin('Bus shelter')
shelterGlass=mat('Shelter safety glass',(.35,.55,.59),.1,.24)
shelterGlass.diffuse_color=(.35,.55,.59,.27)
shelterGlass.node_tree.nodes['Principled BSDF'].inputs['Alpha'].default_value=.27
shelterGlass.surface_render_method='DITHERED'
for x in [-1.6,1.6]:
    box('Shelter post',(.075,2.4,.075),(x,1.2,-.38),steel)
    box('Side safety glass',(.025,1.85,.88),(x,.99,.02),shelterGlass)
box('Back safety glass',(3.15,1.85,.025),(0,.99,-.39),shelterGlass)
box('Shelter roof',(3.65,.12,1.34),(0,2.43,.09),dark,.03)
box('Shelter roof diffuser',(.9,.025,.60),(0,2.355,.09),cityLamp)
box('Passenger bench',(2.65,.075,.38),(0,.48,-.12),wood,.025)
for x in [-1.1,1.1]:box('Bench pedestal',(.07,.45,.29),(x,.24,-.12),steel)
box('Route information case',(.42,.70,.045),(-1.27,1.40,-.35),white,.012)
cyl('Bus stop pole',.035,2.8,(-2,1.4,.20),steel)
box('Bus stop marker',(.40,.47,.055),(-2,2.58,.20),sage,.02)
export('site-bus-shelter')

begin('Bicycle')
for z in [-.57,.57]:
    torus('Bicycle tire',.315,.025,(0,.34,z),rubber,'x')
    torus('Wheel rim',.287,.012,(0,.34,z),steel,'x')
    for i in range(8):
        a=i*math.tau/8;rod('Wheel spoke',(0,.34,z),(0,.34+.28*math.sin(a),z+.28*math.cos(a)),.003,steel,4)
for a,b in [((0,.34,-.57),(0,.77,-.22)),((0,.77,-.22),(0,.37,0)),((0,.37,0),(0,.34,-.57)),((0,.77,-.22),(0,.82,.36)),((0,.82,.36),(0,.37,0)),((0,.82,.36),(0,.34,.57))]:rod('Tubular bicycle frame',a,b,.024,sage)
rod('Seat stem',(0,.65,-.16),(0,.89,-.22),.018,steel)
box('Bicycle saddle',(.19,.045,.27),(0,.91,-.22),dark,.025)
rod('Handlebar stem',(0,.79,.36),(0,1.01,.40),.02,steel)
rod('Handlebar',(-.23,1.01,.40),(.23,1.01,.40),.018,steel)
rod('Crank axle',(-.13,.37,0),(.13,.37,0),.02,steel)
export('site-bicycle')

begin('Cycle parking rack')
for z in [-.75,0,.75]:
    for x in [-.28,.28]:rod('Cycle stand upright',(x,0,z),(x,.67,z),.023,steel)
    rod('Cycle stand crossbar',(-.28,.67,z),(.28,.67,z),.023,steel)
    for x in [-.28,.28]:box('Rack fixing plate',(.11,.025,.11),(x,.013,z),dark)
export('site-cycle-rack')

begin('Traffic signal')
signalMats=[]
for name,col in [('red',(.85,.045,.025)),('amber',(.95,.55,.025)),('green',(.05,.70,.26))]:
    m=mat('City signal '+name,col,0,.4)
    m.node_tree.nodes['Principled BSDF'].inputs['Emission Color'].default_value=(*col,1)
    m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value=.08;signalMats.append(m)
cyl('Signal mast',.055,3.5,(0,1.75,0),dark,n=16)
box('Traffic signal backing',(.34,1.0,.18),(0,3.16,.10),dark,.055)
for i,m in enumerate(signalMats):
    cyl('Signal lens',.105,.028,(0,3.46-i*.30,.205),m,'z',20)
    box('Lens weather visor',(.26,.035,.18),(0,3.59-i*.30,.25),dark,.012)
export('site-traffic-signal')

begin('Public litter bin')
box('Bin housing',(.42,.86,.40),(0,.44,0),dark,.035)
box('Waste opening',(.28,.14,.025),(0,.70,.21),rubber,.025)
box('Bin rain hood',(.47,.05,.45),(0,.91,0),sage,.025)
for x in [-.16,-.08,0,.08,.16]:box('Timber bin slat',(.045,.55,.035),(x,.34,.215),wood,.006)
export('site-street-bin')

begin('Fire hydrant')
cyl('Hydrant barrel',.105,.55,(0,.34,0),orange,n=16)
cyl('Hydrant cap',.14,.09,(0,.67,0),orange,n=16,r2=.06)
cyl('Side hydrant outlet',.068,.34,(0,.44,0),steel,'x',12)
cyl('Ground hydrant flange',.17,.055,(0,.055,0),dark,n=16)
export('site-hydrant')

begin('Standing pedestrian')
for side in [-1,1]:
    rod('Standing trouser leg',(side*.085,.86,0),(side*.10,.14,side*.04),.060,trousers)
    box('Street shoe',(.115,.08,.23),(side*.10,.075,.09+side*.04),dark,.022)
box('Pedestrian waist',(.30,.16,.22),(0,.92,0),trousers,.035)
box('Pedestrian shirt',(.33,.45,.23),(0,1.20,0),shirt,.065)
for side in [-1,1]:
    rod('Shirt sleeve',(side*.15,1.38,0),(side*.22,1.15,.01),.065,shirt)
    rod('Standing forearm',(side*.22,1.15,.01),(side*.20,.97,.10),.040,skin)
    sphere('Pedestrian hand',.045,(side*.20,.95,.10),(.75,1,.75),skin)
cyl('Pedestrian neck',.05,.09,(0,1.48,0),skin)
sphere('Pedestrian head',.132,(0,1.63,0),(.90,1.12,.95),skin)
sphere('Pedestrian hair',.13,(0,1.69,-.015),(.92,.65,.95),hair)
sphere('Pedestrian nose',.028,(0,1.63,.12),(.6,.8,1),skin)
export('site-pedestrian')

bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'site-library.blend'),compress=True)
(OUT/'manifest.json').write_text(json.dumps({'generator':'Blender '+bpy.app.version_string,'assets':manifest},indent=2))
print('ENVIRONMENT_ASSETS_READY '+json.dumps(manifest))
