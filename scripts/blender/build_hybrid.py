"""Reproducible hybrid assembly. Run: npm run assets:hybrid
Coordinates are authored in browser Y-up metres, converted to Blender Z-up.
Named empty pivots survive GLB export for independently controlled mechanisms.
Concept geometry, not manufacturing CAD; 1:1 bevel and 34:22 belt radii.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector, Matrix

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets'/'hybrid'
OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.context.preferences.filepaths.save_version=0
def V(p): return Vector((p[0],-p[2],p[1]))
def mat(name,c,metal=0,rough=.5):
    m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*c,1)
    bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=rough
    return m
ivory=mat('Ceramic white rotor',(.81,.84,.80),.38,.29)
steel=mat('Brushed stainless 304',(.42,.49,.51),.88,.29)
green=mat('Deep green powder coat',(.035,.13,.105),.55,.38)
dark=mat('Anodized graphite',(.027,.041,.045),.6,.38)
bronze=mat('Bronze overrunning clutch',(.57,.30,.085),.8,.30)
rubber=mat('Reinforced EPDM belt',(.012,.017,.019),0,.86)
blue=mat('Monocrystalline silicon',(.018,.052,.14),.45,.22)
cellline=mat('Silver cell busbars',(.24,.38,.52),.75,.30)
copper=mat('Insulated DC cable',(.16,.075,.035),.12,.65)
cyan=mat('Hall sensor blue',(.026,.20,.36),.15,.43)
red=mat('Fused DC positive',(.49,.055,.025),.1,.53)
parent=None
def group(name,pos=(0,0,0)):
    o=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(o)
    o.location=V(pos);return o
root=group('HybridAssembly')
groups={}
def begin(name,pos=(0,0,0)):
    global parent
    parent=group(name,pos);parent.parent=root;groups[name]=parent;return parent
def finish(o,name,m,bevel=.008,smooth=False):
    o.name=name;o.data.materials.append(m)
    bpy.context.view_layer.update()
    world=o.matrix_world.copy();o.parent=parent;o.matrix_world=world
    for p in o.data.polygons:p.use_smooth=smooth
    if bevel:
        mod=o.modifiers.new('Manufactured edge radius','BEVEL');mod.width=bevel;mod.segments=2
    return o
def box(name,size,pos,m,bevel=.008):
    bpy.ops.mesh.primitive_cube_add(size=1,location=V(pos));o=bpy.context.object
    o.scale=(size[0],size[2],size[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    return finish(o,name,m,bevel)
def cyl(name,r,l,pos,m,axis='y',r2=None,n=40):
    bpy.ops.mesh.primitive_cone_add(vertices=n,radius1=r,radius2=r if r2 is None else r2,depth=l,location=V(pos))
    o=bpy.context.object
    direction=V({'x':(1,0,0),'y':(0,1,0),'z':(0,0,1)}[axis])
    o.rotation_euler=Vector((0,0,1)).rotation_difference(direction).to_euler()
    return finish(o,name,m,.004,True)
def mesh(name,vs,fs,m,thickness=0):
    data=bpy.data.meshes.new(name);data.from_pydata([V(v) for v in vs],[],fs);data.update()
    o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);finish(o,name,m,.003,True)
    if thickness:mod=o.modifiers.new('Real sheet thickness','SOLIDIFY');mod.thickness=thickness
    return o
def tube(name,pts,r,m):
    curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.bevel_depth=r;curve.bevel_resolution=2
    spl=curve.splines.new('POLY');spl.points.add(len(pts)-1)
    for p,v in zip(spl.points,pts):p.co=(*V(v),1)
    o=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(o)
    bpy.context.view_layer.update()
    o.data.materials.append(m);world=o.matrix_world.copy();o.parent=parent;o.matrix_world=world
    return o
def ring(name,r,h,pos,m,axis='y',arc=math.tau):
    vs=[];fs=[];n=64
    for i in range(n+1):
        a=i/n*arc
        for yy in [-h/2,h/2]:
            q=(r*math.cos(a),yy,r*math.sin(a))
            if axis=='x':q=(yy,r*math.cos(a),r*math.sin(a))
            if axis=='z':q=(r*math.cos(a),r*math.sin(a),yy)
            vs.append(tuple(q[j]+pos[j] for j in range(3)))
    for i in range(n):fs.append((2*i,2*i+2,2*i+3,2*i+1))
    return mesh(name,vs,fs,m,.016)
def bolt(pos):return cyl('M10 captive hex fastener',.035,.035,pos,steel,n=6)

begin('Frame')
for z in [-.54,.54]:
    box('Welded base rail',(4.8,.14,.12),(-.1,.16,z),green)
    for x in [-2.3,-.6,.65,2.2]:
        box('Elastomer vibration isolator',(.25,.09,.25),(x,.045,z),rubber)
        bolt((x,.25,z))
for x in [-.85,.28]:
    box('Bearing foot',(.48,.10,1.12),(x,.31,0),green)
    for z in [-.35,.35]:
        box('Bearing pedestal',(.14,1.08,.12),(x,.85,z),steel)
        bolt((x,.39,z))
    box('Bearing crossplate',(.45,.12,.85),(x,1.37,0),green)
    cyl('Pillow block',.235,.24,(x,1.55,0),green,'x')
    cyl('Contact bearing seal',.16,.255,(x,1.55,0),rubber,'x')
    cyl('Inner bearing race',.105,.27,(x,1.55,0),steel,'x')
for x in [.22,1.82]:
    box('Fan bridge base crossmember',(.18,.14,1.20),(x,.16,0),green)
    box('Fan shaft bridge leg',(.10,.92,.12),(x,.62,0),steel)
# Support the shaft between the pulley and bevel gear, clear of both swept volumes.
box('Fan bearing bridge',(1.82,.06,.40),(1.02,1.08,0),green)
cyl('Vertical shaft bearing',.17,.12,(1.02,1.115,0),green)
box('Motor frame extension',(.80,.12,1.16),(2.18,.24,.54),green)
for z in [.48,.92]:box('Raised motor support pedestal',(.12,.56,.12),(2.18,.53,z),steel)

begin('WindRotor',(-1.83,1.55,0))
for blade in range(3):
    vs=[];fs=[];nu=52;nv=16
    for i in range(nu+1):
        u=i/nu
        for j in range(nv+1):
            v=j/nv;r=.13+v*(.42+.67*u)
            a=blade*math.tau/3+2.65*u+.22*v
            vs.append((-2.55+1.5*u,r*math.cos(a)+1.55,r*math.sin(a)))
    for i in range(nu):
        for j in range(nv):
            k=i*(nv+1)+j;fs.append((k,k+1,k+nv+2,k+nv+1))
    mesh('Golden spiral formed blade',vs,fs,ivory,.018)
cyl('Rotor nose hub',.14,1.75,(-1.83,1.55,0),ivory,'x')
cyl('Bolted rotor flange',.23,.09,(-1.02,1.55,0),steel,'x')
for i in range(8):
    a=i*math.tau/8;cyl('Rotor flange bolt',.025,.055,(-.96,1.55+.18*math.cos(a),.18*math.sin(a)),steel,'x',n=6)

begin('WindShaft',(-.28,1.55,0))
cyl('Keyed input shaft',.075,1.55,(-.28,1.55,0),steel,'x')
begin('WindClutch',(.56,1.55,0))
cyl('W wind one-way clutch',.155,.29,(.56,1.55,0),bronze,'x')
for x in [.44,.68]:cyl('Retaining collar',.17,.035,(x,1.55,0),dark,'x')

def gear(name,center,axis):
    begin(name,center)
    cyl('Miter gear conical body',.36,.24,center,steel,axis,r2=.12)
    # Tapered radial teeth follow the conical pitch surface.
    for i in range(24):
        a=math.tau*i/24;vs=[]
        for h,r in [(-.12,.36),(.12,.12)]:
            for da,rr in [(-.045,r-.018),(.045,r-.018),(.045,r+.035),(-.045,r+.035)]:
                q=(rr*math.cos(a+da),h,rr*math.sin(a+da))
                if axis=='x':q=(h,rr*math.cos(a+da),rr*math.sin(a+da))
                vs.append(tuple(center[j]+q[j] for j in range(3)))
        mesh('Tapered bevel tooth',vs,[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)],steel)
gear('InputGear',(.78,1.55,0),'x')
gear('OutputGear',(1.02,1.31,0),'y')
begin('FanShaft',(1.02,.92,0))
cyl('Common fan shaft',.075,1.35,(1.02,.92,0),steel)
begin('Fan',(1.02,.31,0))
cyl('Axial fan hub',.16,.16,(1.02,.31,0),steel)
for i in range(7):
    a=math.tau*i/7;vs=[]
    for r in [.15,.56]:
        for w in [-.085,.085]:
            angle=a+.35*(r/.56)
            vs.append((1.02+r*math.cos(angle)-w*math.sin(angle),.31+w*.72,r*math.sin(angle)+w*math.cos(angle)))
    mesh('Pitched axial blade',vs,[(0,1,3,2)],steel,.014)

begin('FanHousing')
ring('Sealed exhaust collection plenum',.65,.64,(1.02,.35,0),steel)
ring('Circular fan curb flange',.70,.045,(1.02,.055,0),dark)
vs=[];fs=[]
for i in range(65):
    a=i*math.tau/64
    for r in [.40,.65]:vs.append((1.02+r*math.cos(a),.035,r*math.sin(a)))
for i in range(64):fs.append((i*2,i*2+2,i*2+3,i*2+1))
mesh('Sealed plenum annular floor',vs,fs,steel,.018)
ring('Roof penetration intake tube',.40,1.0,(1.02,-.46,0),steel)
ring('Isolated shaft sleeve',.135,.47,(1.02,.91,0),steel)
for i in range(8):
    a=math.tau*i/8;bolt((1.02+.67*math.cos(a),.09,.67*math.sin(a)))
begin('SectionGuard')
ring('Removable plenum lid',.65,.04,(1.02,.69,0),dark)
# Solid annular lid around sleeve (no cap across the airflow inlet).
vs=[];fs=[]
for i in range(65):
    a=i*math.tau/64
    for r in [.14,.65]:vs.append((1.02+r*math.cos(a),.70,r*math.sin(a)))
for i in range(64):fs.append((i*2,i*2+1,i*2+3,i*2+2))
mesh('Sealed plenum annular cover',vs,fs,steel,.018)
box('Sectionable transmission guard',(.86,.06,.93),(.96,1.99,0),dark)
for z in [-.43,.43]:box('Guard support',(.06,.62,.04),(1.31,1.7,z),steel)

begin('Motor')
for z in [.48,.92]:box('Motor adjustable mounting rail',(.68,.10,.09),(2.18,.29,z),green)
cyl('DC assist motor casing',.235,.66,(2.18,.83,.70),steel)
for y in [.57,.64,.71,.78,.85,.92,1.0]:ring('Motor cooling fin',.26,.023,(2.18,y,.70),dark)
cyl('Motor top end bell',.24,.08,(2.18,1.20,.70),dark)
box('Weatherproof terminal box',(.22,.22,.20),(2.45,.88,.70),dark)
cyl('Motor output spindle',.055,.21,(2.18,.40,.70),steel)
# Belt plane lies at y=.38; fan driven wheel shares the common shaft axis.
begin('MotorPulley',(2.18,.38,.70))
cyl('22 mm ratio drive pulley',.22,.10,(2.18,.38,.70),dark)
begin('FanPulley',(1.02,.95,0))
cyl('34 mm ratio driven pulley',.34,.10,(1.02,.95,0),dark)
# Motor moved up so the pulleys run in one common horizontal plane.
groups['Motor'].location.z+=.57
groups['MotorPulley'].location.z+=.57
# Feet join the raised motor casing to its adjustable rails.
parent=groups['Frame']
for z in [.48,.92]:box('Motor casing mounting foot',(.42,.23,.10),(2.18,1.015,z),steel)
begin('MotorClutch',(1.02,.95,0))
cyl('M motor one-way hub',.14,.18,(1.02,.95,0),bronze)
begin('Belt')
# Exact external tangents between unequal pulley circles in the XZ plane.
c1=(1.02,0);c2=(2.18,.70);R=.34;r=.22
dx=c2[0]-c1[0];dz=c2[1]-c1[1];d=math.hypot(dx,dz);phi=math.atan2(dz,dx);alpha=math.acos((R-r)/d)
pts=[]
for i in range(49):
    a=phi+alpha+(math.tau-2*alpha)*i/48;pts.append((c1[0]+R*math.cos(a),.95,c1[1]+R*math.sin(a)))
for i in range(49):
    a=phi-alpha+2*alpha*i/48;pts.append((c2[0]+r*math.cos(a),.95,c2[1]+r*math.sin(a)))
pts.append(pts[0]);tube('Endless reinforced drive belt',pts,.026,rubber)

begin('Duct')
# Outlet intersects a real rectangular opening cut into the cylindrical plenum.
# The short branch starts within the plenum and exits toward the rear cowl.
for x in [.75,1.29]:box('Sealed rectangular duct side',(.025,.43,2.75),(x,.34,-1.93),steel)
for y in [.115,.565]:box('Sealed rectangular duct horizontal',(.56,.025,2.75),(1.02,y,-1.93),steel)
for z in [-.67,-1.65,-2.65]:
    for x in [.73,1.31]:box('Duct flange seam',(.035,.51,.04),(x,.34,z),dark)
    for y in [.08,.60]:box('Duct flange seam',(.61,.035,.04),(1.02,y,z),dark)
for j in range(7):box('Weatherproof discharge cowl louvre',(.72,.035,.25),(1.02,.10+j*.08,-3.42),steel)
box('Outdoor cowl rain cap',(.82,.06,.48),(1.02,.68,-3.42),dark)
for x in [.65,1.39]:box('Outdoor cowl side',(.025,.64,.44),(x,.35,-3.42),steel)
# Remove the sector where the rectangular branch intersects the plenum.
plenum=next(o for o in groups['FanHousing'].children if o.name.startswith('Sealed exhaust collection'))
bpy.context.view_layer.objects.active=plenum
for mod in list(plenum.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
saved_parent=parent;parent=groups['Duct']
cut=box('Temporary branch cutter',(.54,.43,.8),(1.02,.34,-.66),steel,0)
mod=plenum.modifiers.new('Connected duct outlet','BOOLEAN');mod.operation='DIFFERENCE';mod.object=cut
bpy.context.view_layer.objects.active=plenum;bpy.ops.object.modifier_apply(modifier=mod.name)
bpy.data.objects.remove(cut,do_unlink=True);parent=saved_parent

solar=begin('SolarArray',(-2.20,0,2.0))
# Roof feet stay fixed while the yaw and elevation pivots track the sun.
rack=begin('SolarRack')
rack.parent=solar;rack.matrix_world=Matrix.Identity(4)
for x in [-2.85,-1.55]:
    for z in [1.45,2.55]:
        box('PV anchored roof foot',(.22,.08,.22),(x,.04,z),rubber)
        box('PV rack stanchion',(.075,.47,.075),(x,.315,z),steel)
    box('PV rack cross rail',(.10,.10,1.30),(x,.60,2.0),green)
box('PV rack pedestal beam',(1.50,.10,.14),(-2.20,.60,2.0),green)
cyl('Solar tracker pedestal',.085,.50,(-2.20,.90,2.0),steel)
cyl('Solar azimuth bearing',.14,.12,(-2.20,1.12,2.0),dark)
yaw=begin('SolarYaw',(-2.20,1.15,2.0))
bpy.context.view_layer.update();world=yaw.matrix_world.copy();yaw.parent=solar;yaw.matrix_world=world
for x in [-2.45,-1.95]:box('PV tilt bearing cheek',(.07,.20,.18),(x,1.23,2.0),green)
cyl('PV tilt axle',.055,.66,(-2.20,1.30,2.0),steel,'x')
tilt=begin('SolarTilt',(-2.20,1.30,2.0))
bpy.context.view_layer.update();world=tilt.matrix_world.copy();tilt.parent=yaw;tilt.matrix_world=world
def panel_box(name,size,local,m):
    # The module is horizontal in its local frame; the runtime owns tracking.
    vs=[]
    for dx,dy,dz in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]:
        x=local[0]+dx*size[0]/2;y=local[1]+dy*size[1]/2;z=local[2]+dz*size[2]/2
        vs.append((-2.20+x,1.30+y,2.0+z))
    o=mesh(name,vs,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(2,3,7,6),(1,2,6,5),(0,4,7,3)],m)
    for polygon in o.data.polygons:polygon.use_smooth=False
    return o
panel_box('Aluminium PV frame',(2.20,.075,1.50),(0,0,0),steel)
for i in range(10):
    for j in range(6):
        panel_box('PV silicon cell',(.205,.008,.231),(-.98+i*.217,.046,-.625+j*.245),blue)
        for k in [-.05,.05]:
            panel_box('Cell conductor busbar',(.002,.002,.228),(-.98+i*.217+k,.052,-.625+j*.245),cellline)

begin('Electrical')
def C(p):return (4.33+p[2]-1.8,p[1],1.8-(p[0]-3.85))
def cabinet_box(name,size,pos,m):return box(name,(size[2],size[1],size[0]),C(pos),m)
cabinet_box('Wall mounted controller backplate',(1.10,1.35,.10),(3.85,-1.05,1.80),dark)
for x in [3.27,4.43]:cabinet_box('Weatherproof enclosure side',(.035,1.40,.45),(x,-1.04,2.02),steel)
for y in [-1.74,-.34]:cabinet_box('Weatherproof enclosure cap',(1.16,.035,.45),(3.85,y,2.02),steel)
cabinet_box('Protected battery 24 V 10 Ah',(.90,.43,.32),(3.85,-1.43,1.98),green)
for x in [3.55,4.13]:cyl('Battery terminal',.035,.05,C((x,-1.18,1.98)),bronze)
cabinet_box('MPPT charge controller',(.42,.36,.22),(3.61,-.85,1.98),steel)
cabinet_box('PWM DC motor driver',(.37,.29,.22),(4.12,-.84,1.98),cyan)
for x in [3.60,3.76,3.94,4.12]:cabinet_box('DC fuse and disconnect',(.09,.14,.12),(x,-.48,1.95),red)
pv_route=[(-2.2,1.30,2.0),(-2.2,.65,2.12),(-2.2,.065,2.65),(4.42,.065,2.65),(4.55,-.20,2.65),(4.55,-.20,2.15),(4.55,-.65,2.15),C((3.85,-.65,1.98))]
motor_route=[C((4.12,-.85,1.98)),(4.55,-.55,1.53),(4.55,-.20,1.53),(4.55,.065,1.53),(4.15,.065,1.30),(2.18,.065,.92),(2.18,1.20,.92),(2.45,1.45,.70)]
tube('PV protected conduit',pv_route,.025,dark)
tube('Motor driver conduit',motor_route,.022,dark)
# Saddles, roof clips and glands keep the conduits attached at bends and ends.
for route in [pv_route,motor_route]:
    for a,b in zip(route,route[1:]):
        if abs(a[1]-.065)<.001 and abs(b[1]-.065)<.001:
            length=math.dist(a,b)
            for i in range(math.ceil(length/.65)+1):
                t=i/max(1,math.ceil(length/.65));p=tuple(a[j]+(b[j]-a[j])*t for j in range(3))
                box('Roof conduit saddle',(.10,.065,.10),(p[0],.0325,p[2]),steel)
    for p in [route[0],route[-1]]:cyl('Sealed cable gland',.043,.09,p,dark)
for z in [1.53,2.15,2.65]:box('Wall conduit fixing',(.30,.07,.11),(4.44,-.20,z),steel)
for z in [1.53,2.15]:cyl('Cabinet top entry gland',.045,.12,(4.55,-.34,z),dark)
tube('Fused battery positive',[C(p) for p in [(4.12,-1.17,1.98),(4.12,-1.03,2.15),(3.60,-1.03,2.15),(3.60,-.52,2.01)]],.012,red)
begin('CabinetDoor')
cabinet_box('Sectionable cabinet door',(1.16,1.40,.055),(3.85,-1.04,2.23),green)
cabinet_box('Enclosure latch',(.045,.16,.035),(4.32,-1.04,2.27),steel)
begin('Sensors')
for pos in [(-.45,1.76,0),(1.24,1.18,0)]:box('Hall effect shaft tachometer',(.12,.17,.15),pos,cyan)
box('Input sensor mounting arm',(.48,.055,.14),(-.65,1.43,-.20),steel)
box('Input sensor upright',(.07,.30,.12),(-.45,1.58,-.20),steel)
box('Input sensor mounting tab',(.10,.045,.27),(-.45,1.70,-.10),steel)
box('Fan sensor bracket',(.18,.05,.20),(1.24,1.08,0),steel)
tube('Sensor conduit',[(-.45,1.76,-.075),(-.45,1.43,-.20),(-.85,1.43,-.20),(-.85,.26,-.35),(-.85,.26,-.54),(1.82,.26,-.54),(1.82,1.08,0),(1.24,1.08,0),(1.24,1.18,-.075)],.012,dark)

# Collapse static meshes by material inside each named pivot to bound draw calls.
bpy.context.view_layer.update()
for g in groups.values():
    buckets={}
    # Only merge direct meshes: nested solar tracking pivots must survive.
    for o in list(g.children):
        if o.type=='CURVE':
            bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
        if o.type!='MESH':continue
        bpy.context.view_layer.objects.active=o
        for mod in list(o.modifiers):bpy.ops.object.modifier_apply(modifier=mod.name)
        bpy.context.view_layer.update()
        world=o.matrix_world.copy();o.parent=g;o.matrix_world=world
        buckets.setdefault(o.data.materials[0].name,[]).append(o)
    for name,parts in buckets.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in parts:o.select_set(True)
        bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join()
        o=bpy.context.object;world=o.matrix_world.copy();o.parent=g;o.matrix_world=world
        o.name=g.name+'_'+name
bpy.ops.object.select_all(action='SELECT')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'hybrid-assembly.blend'),compress=True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'hybrid-assembly.glb'),export_format='GLB',export_yup=True,export_animations=False,export_cameras=False,export_lights=False)
triangles=0
for o in bpy.context.scene.objects:
    if o.type=='MESH':o.data.calc_loop_triangles();triangles+=len(o.data.loop_triangles)
manifest={'asset':'hybrid-assembly.glb','bytes':(OUT/'hybrid-assembly.glb').stat().st_size,'triangles':triangles,'pivots':list(groups),'units':'metres','gearRatio':1,'beltRatio':34/22,'purpose':'Educational engineering visualization; not fabrication CAD'}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2))
print('HYBRID_EXPORT_VERIFIED '+json.dumps(manifest))
