"""ZeroWatt custom asset library. Blender 5.x, no third-party assets.

blender --background --python scripts/blender/build_assets.py
Authoring helpers accept Three.js Y-up coordinates; V converts to Blender Z-up.
Each GLB has an origin at its mechanical pivot. Static meshes are joined by
material before export, so fasteners do not each cost a browser draw call.
"""
import bpy
import math
import json
import random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'zw-upgrade'
OUT.mkdir(parents=True, exist_ok=True)
random.seed(27)
bpy.context.preferences.filepaths.save_version = 0
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def V(p):
    return Vector((p[0], -p[2], p[1]))

def mat(name, color, metal=0, rough=.5):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metal
    p.inputs['Roughness'].default_value = rough
    return m

pearl = mat('Warm porcelain powder coat', (.78, .81, .77), .25, .34)
steel = mat('Satin stainless steel', (.34, .41, .43), .82, .3)
graphite = mat('Graphite epoxy steel', (.035, .065, .063), .5, .43)
brass = mat('Phosphor bronze transmission', (.42, .28, .12), .75, .37)
rubber = mat('EPDM bearing seal', (.016, .024, .023), .02, .78)
wood = mat('Oiled ash', (.36, .22, .105), 0, .62)
plaster = mat('Mineral plaster', (.71, .69, .61), 0, .88)
cloth = mat('Moss upholstery', (.13, .21, .18), 0, .92)
bark = mat('Grey brown bark', (.16, .13, .09), 0, .94)
leaf = mat('Willow foliage', (.16, .25, .115), 0, .85)
leaflight = mat('Sunlit foliage', (.23, .32, .14), 0, .85)
stone = mat('Shore limestone', (.34, .36, .29), 0, .92)

collection = None
manifest = {}
def begin(name):
    global collection
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)

def finish(o, material, bevel=0, smooth=False):
    for c in list(o.users_collection):
        c.objects.unlink(o)
    collection.objects.link(o)
    o.data.materials.append(material)
    for p in o.data.polygons:
        p.use_smooth = smooth
    bpy.context.view_layer.objects.active = o
    if bevel:
        mod = o.modifiers.new('Fabricated edge fillet', 'BEVEL')
        mod.width = bevel
        mod.segments = 2
    return o

def box(name, size, pos, material, bevel=.015):
    bpy.ops.mesh.primitive_cube_add(size=1, location=V(pos))
    o = bpy.context.object
    o.name = name
    o.scale = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(o, material, bevel)

def cylinder(name, r, length, pos, material, axis='x', verts=32, bevel=.006, r2=None):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r if r2 is None else r2,
                                    depth=length, location=V(pos))
    o = bpy.context.object
    o.name = name
    direction = V({'x':(1,0,0), 'y':(0,1,0), 'z':(0,0,1)}[axis])
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Vector((0,0,1)).rotation_difference(direction)
    return finish(o, material, bevel, True)

def rod(name, a, b, r, material, verts=10):
    d = V(b) - V(a)
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=d.length, location=(V(a)+V(b))/2)
    o = bpy.context.object
    o.name = name
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Vector((0,0,1)).rotation_difference(d.normalized())
    return finish(o, material, 0, True)

def ring(name, radius, tube, pos, material, axis='x', segments=48):
    bpy.ops.mesh.primitive_torus_add(major_segments=segments, minor_segments=6,
                                    major_radius=radius, minor_radius=tube, location=V(pos))
    o = bpy.context.object
    o.name = name
    o.rotation_mode = 'QUATERNION'
    o.rotation_quaternion = Vector((0,0,1)).rotation_difference(V({'x':(1,0,0),'y':(0,1,0),'z':(0,0,1)}[axis]))
    return finish(o, material, 0, True)

def mesh(name, verts, faces, material, thickness=0, bevel=0):
    data = bpy.data.meshes.new(name)
    data.from_pydata([V(p) for p in verts], [], faces)
    data.update()
    o = bpy.data.objects.new(name, data)
    collection.objects.link(o)
    data.materials.append(material)
    for p in data.polygons:
        p.use_smooth = True
    if thickness:
        m = o.modifiers.new('Formed sheet thickness', 'SOLIDIFY')
        m.thickness = thickness
    if bevel:
        m = o.modifiers.new('Hemmed edges', 'BEVEL')
        m.width = bevel
        m.segments = 2
    return o

def bolts(axis, center, radius, count, material=steel, size=.023):
    for i in range(count):
        a = i*math.tau/count
        x,y,z = center
        if axis == 'x': y += radius*math.cos(a); z += radius*math.sin(a)
        elif axis == 'y': x += radius*math.cos(a); z += radius*math.sin(a)
        else: x += radius*math.cos(a); y += radius*math.sin(a)
        cylinder('Captive hex bolt',size,.025,(x,y,z),material,axis,6,.002)

def export(name, axis=None):
    # Apply all modifiers and merge by material in local authoring coordinates.
    objects = list(collection.objects)
    for o in objects:
        bpy.context.view_layer.objects.active = o
        for mod in list(o.modifiers):
            bpy.ops.object.modifier_apply(modifier=mod.name)
    groups = {}
    for o in objects:
        groups.setdefault(o.data.materials[0].name, []).append(o)
    combined = []
    for material, parts in groups.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in parts: o.select_set(True)
        bpy.context.view_layer.objects.active = parts[0]
        bpy.ops.object.join()
        o = bpy.context.object
        o.name = name + '_' + material.replace(' ', '_')
        bpy.context.scene.cursor.location = (0,0,0)
        bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        combined.append(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in combined: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/(name+'.glb')), export_format='GLB',
                             use_selection=True, export_yup=True, export_animations=False,
                             export_cameras=False, export_lights=False)
    triangles = sum(len(o.data.polygons) for o in combined)  # calculate exact triangles below
    triangles = 0
    for o in combined:
        o.data.calc_loop_triangles()
        triangles += len(o.data.loop_triangles)
    manifest[name] = {'axis':axis, 'origin':[0,0,0], 'meshes':len(combined),
                      'triangles':triangles, 'bytes':(OUT/(name+'.glb')).stat().st_size}

begin('01 Spiral rotor')
for b in range(3):
    verts, faces = [], []
    nu,nv = 44,12
    for u in range(nu+1):
        a = u/nu
        for v in range(nv+1):
            s = v/nv
            r = .1+s*(.38+a*.7)
            theta = b*math.tau/3+a*2.7+s*.3
            verts.append(((a-.5)*1.5, r*math.cos(theta), r*math.sin(theta)))
    for u in range(nu):
        for v in range(nv):
            i=u*(nv+1)+v
            faces.append((i,i+1,i+nv+2,i+nv+1))
    mesh('Hydroformed spiral blade',verts,faces,pearl,.018,.004)
    for a in [.06,.93]:
        th=b*math.tau/3+a*2.7+.3
        rr=.1+.38+a*.7
        rod('Blade root reinforcement',((a-.5)*1.5,.12*math.cos(th),.12*math.sin(th)),
            ((a-.5)*1.5,rr*.88*math.cos(th),rr*.88*math.sin(th)),.022,steel)
cylinder('Rotor shaft',.105,1.94,(0,0,0),steel)
for x in [-.8,.85]:
    cylinder('Clamping flange',.23,.12,(x,0,0),steel)
    cylinder('Painted hub cap',.17,.15,(x,0,0),pearl)
    bolts('x',(x+(.075 if x>0 else -.075),0,0),.192,6,graphite)
export('rotor','x')

begin('02 Miter bevel gear')
# Cone apex is at x=.5, big pitch radius .5 at x=0: original 1:1 miter geometry.
cylinder('Conical gear blank',.445,.31,(.155,0,0),steel,'x',48,.005,.135)
cylinder('Keyed hub',.14,.32,(-.13,0,0),graphite)
ring('Machined back shoulder',.34,.022,(-.014,0,0),steel)
for k in range(20):
    a=k*math.tau/20
    # Tapered teeth follow the cone generatrix instead of a flat decorative disc.
    verts=[]
    for x,r,width in [(-.025,.495,.045),(.285,.21,.023)]:
        for dr,da in [(-.045,-width),(.035,-width),(.035,width),(-.045,width)]:
            verts.append((x,(r+dr)*math.cos(a+da),(r+dr)*math.sin(a+da)))
    faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
    mesh('Tapered miter tooth',verts,faces,steel,0,.004)
bolts('x',(-.025,0,0),.25,6,graphite,.018)
export('bevel','x')

begin('03 Axial ventilation impeller')
cylinder('Machined spinner',.18,.20,(0,0,0),pearl,'y',40,.012,.12)
cylinder('Shaft bore collar',.07,.32,(0,0,0),steel,'y')
for b in range(6):
    verts,faces=[],[]
    for j in range(15):
        t=j/14; r=.14+.66*t
        sweep=b*math.tau/6+.35*t*t
        for k in range(7):
            v=k/6-.5; chord=.19+.1*math.sin(t*math.pi)
            angle=sweep+v*chord/r
            verts.append((r*math.cos(angle),v*(.16-.07*t)+.025*(1-4*v*v),r*math.sin(angle)))
    for j in range(14):
        for k in range(6):
            i=j*7+k;faces.append((i,i+1,i+8,i+7))
    mesh('Twisted cambered airfoil',verts,faces,pearl,.012,.003)
bolts('y',(0,.12,0),.115,6,steel,.018)
export('fan','y')

begin('04 Pond paddle wheel')
cylinder('Through axle hub',.23,1.52,(0,0,0),steel,'z')
for z in [-.62,.62]:
    ring('Rolled steel wheel rim',1.38,.05,(0,0,z),graphite,'z',64)
    ring('Inner reinforcing ring',.40,.025,(0,0,z),steel,'z')
    cylinder('Hub flange',.34,.07,(0,0,z),graphite,'z')
    bolts('z',(0,0,z+(.04 if z>0 else -.04)),.275,8,steel)
for k in range(8):
    a=k*math.tau/8
    for z in [-.62,.62]:
        rod('Radial box brace',(.2*math.cos(a),.2*math.sin(a),z),
            (1.4*math.cos(a),1.4*math.sin(a),z),.037,graphite,8)
    verts,faces=[],[]
    for i in range(9):
        t=i/8
        r=1.07+.59*t
        th=a+.11*math.sin(t*math.pi)
        for z in [-.69,.69]:verts.append((r*math.cos(th),r*math.sin(th),z))
    for i in range(8):faces.append((i*2,i*2+1,i*2+3,i*2+2))
    mesh('Formed concave paddle',verts,faces,pearl,.026,.009)
    for z in [-.65,.65]:
        rod('Paddle edge stiffener',(1.1*math.cos(a),1.1*math.sin(a),z),
            (1.64*math.cos(a),1.64*math.sin(a),z),.025,steel)
export('paddle','z')

begin('05 Pillow block support')
# Normalized height: scene scales y to the original shaft height, axis X.
box('Foot plate',(.8,.10,.95),(0,.05,0),graphite,.025)
for z in [-.19,.19]:
    box('Tapered support web',(.12,.73,.10),(0,.455,z),pearl,.014)
    rod('Diagonal knee brace',(-.29,.11,z),(0,.78,z),.035,steel)
box('Bearing saddle',(.32,.16,.62),(0,.87,0),graphite,.045)
for x in [-.28,.28]:
    for z in [-.32,.32]:cylinder('Foundation anchor',.04,.045,(x,.12,z),steel,'y',6,.003)
export('bearing-frame')
begin('05b Unscaled bearing cartridge')
cylinder('Sealed bearing housing',.235,.23,(0,0,0),pearl)
ring('Annular bearing seal',.12,.04,(.13,0,0),rubber)
export('bearing')

begin('06 Architectural workspace')
box('Ash desk top',(1.5,.08,.8),(0,.95,0),wood,.025)
for x in [-.64,.64]:
    for z in [-.29,.29]:box('Desk steel leg',(.055,.61,.055),(x,.62,z),graphite,.008)
box('Monitor foot',(.26,.018,.18),(0,1.005,-.14),steel,.009)
box('Monitor neck',(.05,.14,.04),(0,1.08,-.18),graphite)
box('Display housing',(.54,.33,.035),(0,1.25,-.18),graphite,.018)
box('Display glass',(.49,.275,.008),(0,1.25,-.156),cloth,.004)
box('Keyboard',(.4,.018,.14),(0,1.008,.13),graphite,.008)
for j in range(3):box('Reference manuals',(.18,.035,.26),(.52,1.015+j*.036,-.1),plaster,.004)
export('workspace')

begin('07 Architectural service wall')
box('Plaster service panel',(1,2.8,.16),(0,1.7,0),plaster,.018)
box('Recessed skirting',(1,.10,.19),(0,.36,.01),graphite,.008)
for x in [-.46,.46]:box('Ash reveal',(.035,2.85,.20),(x,1.7,.015),wood,.006)
for j in range(5):box('Cabinet fronts',(.81,.35,.34),(0,.55+j*.36,.24),wood,.012)
for j in range(5):box('Brushed pull',(.20,.015,.025),(0,.62+j*.36,.425),steel,.003)
export('service-wall')

begin('08 Landscape tree')
rod('Tapered trunk',(0,0,0),(.08,2.15,0),.10,bark,12)
for i in range(9):
    a=i*2.4;h=1.4+(i%4)*.36
    end=(math.cos(a)*(.65+i%3*.13),h+.65,math.sin(a)*(.55+i%2*.2))
    rod('Branch',(.04,h-.4,0),end,.035,bark,8)
    for j in range(5):
        pos=(end[0]+random.uniform(-.38,.38),end[1]+random.uniform(-.2,.32),end[2]+random.uniform(-.35,.35))
        # Individual opaque leaves create a broken, natural silhouette without
        # alpha textures or spherical foliage clumps.
        verts, faces = [], []
        for k in range(24):
            a=random.random()*math.tau;r=random.random()*.40
            cx=pos[0]+math.cos(a)*r;cy=pos[1]+random.uniform(-.23,.23);cz=pos[2]+math.sin(a)*r
            length=.13+random.random()*.12;width=length*.29
            dx=math.cos(a)*length;dz=math.sin(a)*length
            bx=-math.sin(a)*width;bz=math.cos(a)*width
            base=len(verts)
            verts.extend([(cx-dx,cy-.02,cz-dz),(cx+bx,cy,cz+bz),(cx,cy+.035,cz),
                          (cx-bx,cy,cz-bz),(cx+dx,cy+.06,cz+dz)])
            faces.extend([(base,base+1,base+2),(base,base+2,base+3),
                          (base+2,base+1,base+4),(base+3,base+2,base+4)])
        mesh('Willow leaf sprays',verts,faces,leaflight if (i+j)%3==0 else leaf,.001)
export('tree')

begin('09 Shoreline planting')
for i in range(20):
    a=random.random()*math.tau;r=random.random()*.42;h=.45+random.random()*.65
    x,z=math.cos(a)*r,math.sin(a)*r
    rod('Reed stem',(x,0,z),(x+.04,h,z+.07),.009,leaf,6)
    verts=[(x,0,z),(x+.06,h*.55,z+.02),(x+.18,h*.9,z+.15),(x+.04,h*.45,z+.02)]
    mesh('Tapered reed leaf',verts,[(0,1,2,3)],leaflight,.003)
    if i%4==0:cylinder('Cattail',.025,.15,(x+.04,h,z+.07),bark,'y',8,0)
for i in range(5):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=.2,location=V((random.uniform(-.7,.7),.03,random.uniform(-.4,.4))))
    o=bpy.context.object;o.name='Weathered bank stone';o.scale=(1.3,1,.5);finish(o,stone,.015)
export('shore')

begin('10 Upholstered clinic chair')
box('Rounded upholstered seat',(.43,.075,.44),(0,.47,0),cloth,.03)
verts,faces=[],[]
for j in range(9):
    x=(j/8-.5)*.43;bow=.055*(1-(x/.23)**2)
    verts.extend([(x,.54,-.22-bow*.3),(x,.93,-.20-bow)])
for j in range(8):faces.append((j*2,j*2+1,j*2+3,j*2+2))
mesh('Contoured upholstered back',verts,faces,cloth,.035,.012)
for x in [-.17,.17]:
    for z in [-.17,.17]:
        rod('Tubular chair leg',(x,.44,z),(x*1.18,.03,z*1.18),.018,steel,10)
        cylinder('Non-slip foot',.025,.022,(x*1.18,.018,z*1.18),rubber,'y',12,.003)
    rod('Backrest support',(x,.35,-.16),(x,.83,-.24),.017,steel,10)
rod('Under-seat cross brace',(-.17,.28,-.17),(.17,.28,-.17),.013,steel,8)
export('chair')

begin('11 Ventilation controller enclosure')
box('Gasketed die-cast controller',(.70,.50,.35),(0,0,0),pearl,.035)
box('Recessed graphite face',(.60,.40,.014),(0,0,.178),graphite,.016)
box('Instrument display surround',(.43,.24,.016),(-.06,.025,.192),steel,.014)
box('Smoked instrument glass',(.38,.19,.008),(-.06,.025,.205),graphite,.01)
for x in [-.30,.30]:
    for y in [-.20,.20]:cylinder('Captive enclosure screw',.018,.012,(x,y,.19),steel,'z',6,.002)
for x in [-.18,.18]:
    cylinder('IP cable gland',.045,.07,(x,-.285,0),graphite,'y',12,.004)
    cylinder('Cable strain relief',.024,.07,(x,-.34,0),rubber,'y',12,.003)
for x in [.15,.23]:cylinder('Recessed control button',.027,.015,(x,-.10,.20),graphite,'z',16,.003)
export('controller')

begin('12 Exhaust fan shroud and guard')
verts,faces=[],[]
for y,r in [(-.15,.89),(.15,.89),(-.15,.855),(.15,.855)]:
    for i in range(48):
        a=i*math.tau/48;verts.append((r*math.cos(a),y,r*math.sin(a)))
for i in range(48):
    j=(i+1)%48
    faces.extend([(i,j,j+48,i+48),(i+96,i+144,j+144,j+96),
                  (i,i+96,j+96,j),(i+48,j+48,j+144,i+144)])
mesh('Rolled ventilator casing',verts,faces,pearl,0,.005)
for y in [-.15,.15]:ring('Rolled mounting lip',.89,.025,(0,y,0),steel,'y',48)
for r in [.17,.34,.51,.68,.83]:ring('Concentric finger guard',r,.008,(0,-.17,0),steel,'y',40)
for i in range(4):
    a=i*math.tau/4
    rod('Guard radial stay',(.08*math.cos(a),-.17,.08*math.sin(a)),(.87*math.cos(a),-.17,.87*math.sin(a)),.009,steel,8)
export('fan-shroud')

# Archive the full editable library. Separated collections remain easy to inspect.
bpy.ops.object.select_all(action='DESELECT')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'zerowatt-library.blend'))
(OUT/'manifest.json').write_text(json.dumps({'generator':'Blender '+bpy.app.version_string,
    'coordinates':'glTF Y-up; authored Three.js coordinates converted once by V',
    'assets':manifest},indent=2),encoding='utf-8')
print('ZEROWATT_ASSETS_READY',json.dumps(manifest))
