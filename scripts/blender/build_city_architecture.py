"""Finished skyline assets: recessed windows, roof plant, stepped massing.
World-scale face UVs allow local scanned PBR textures without stretching.
"""
from pathlib import Path
exec((Path(__file__).parent/'build_environment.py').read_text().split("apartment('site-apartment-low'")[0])
glass.diffuse_color=(.026,.046,.062,1)
glass.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.026,.046,.062,1)
glass.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=.13
glass2=mat('Smoked architectural glass',(.045,.065,.075),.45,.16)
glass3=mat('Interior shadow glazing',(.015,.023,.028),.25,.23)
bronze=mat('Brushed architectural bronze',(.19,.145,.09),.78,.32)

def facade_box(label,size,x,y,z,side,m):
    if side==0:return box(label,size,(x,y,z),m)
    if side==2:return box(label,size,(-x,y,-z),m)
    return box(label,(size[2],size[1],size[0]),((1 if side==1 else -1)*z,y,-x*(1 if side==1 else -1)),m)

def tower(name,style):
    begin(name);floors=7 if style==1 else 6;floorH=3.12;H=floors*floorH
    W=6.4;D=6.4
    box('Stone foundation',(6.65,.24,6.65),(0,.12,0),stone,.035)
    for f in range(floors):
        setback=.48 if f>=floors-2 else 0
        span=W-setback*2;depth=span/2;y=.24+f*floorH
        facade=brick if style==2 else cream if style==0 else sage
        box('Floor structure',(span,floorH,span),(0,y+floorH/2,0),facade,.015)
        if style!=1:box('Fine stone string course',(span+.14,.085,span+.14),(0,y+.09,0),stone)
        for side in range(4):
            for c in [-1,0,1]:
                x=c*(span-.6)/3;ww=(span-.6)/3-.28
                facade_box('Window recess',(ww+.12,2.12,.035),x,y+1.65,depth+.02,side,dark)
                gl=[glass,glass2,glass3][(f*7+c+side*3)%3]
                facade_box('Individual reflective glazing',(ww,1.94,.018),x,y+1.65,depth+.055,side,gl)
                for sign in [-1,1]:facade_box('Slim window jamb',(.045,2.12,.11),x+sign*(ww+.07)/2,y+1.65,depth+.075,side,bronze if style==1 else stone)
                facade_box('Drained window sill',(ww+.22,.065,.22),x,y+.59,depth+.10,side,stone)
                facade_box('Window head',(ww+.18,.06,.14),x,y+2.72,depth+.07,side,stone)
                facade_box('Double glazing mullion',(.025,1.96,.04),x,y+1.65,depth+.075,side,dark)
                if (f+c+side)%4==0:
                    facade_box('Partly closed interior blind',(ww*.96,.62,.022),x,y+2.28,depth+.08,side,wood)
                if style==2 and f>0 and side%2==0:
                    facade_box('Balcony deck',(ww+.16,.10,.66),x,y+.45,depth+.30,side,stone)
                    for sign in [-1,1]:facade_box('Balcony stanchion',(.025,.82,.03),x+sign*ww/2,y+.91,depth+.59,side,dark)
                    facade_box('Balcony rail',(ww+.05,.035,.04),x,y+1.33,depth+.59,side,dark)
            if style==1:
                for x in [-span/2+.08,span/2-.08]:facade_box('Bronze facade fin',(.075,floorH,.25),x,y+floorH/2,depth+.08,side,bronze)
        if setback and f==floors-2:
            box('Setback terrace',(W+.14,.10,D+.14),(0,y+.05,0),stone)
    roofSpan=W-.96
    box('Roof coping',(roofSpan+.22,.14,roofSpan+.22),(0,H+.31,0),stone,.02)
    for side in [-1,1]:
        box('Roof guard',(.12,.52,roofSpan),(side*roofSpan/2,H+.61,0),stone)
        box('Roof guard',(roofSpan,.52,.12),(0,H+.61,side*roofSpan/2),stone)
    box('Lift overrun',(1.65,1.7,2.0),(-1.0,H+1.12,-1.0),facade,.025)
    box('Lift roof flashing',(1.80,.08,2.15),(-1.0,H+2.01,-1.0),dark)
    for x in [.55,1.6]:
        for z in [-.4,.9]:
            box('Plant feet',(.75,.15,.75),(x,H+.45,z),dark)
            box('Packaged HVAC',(.80,.62,.80),(x,H+.83,z),steel,.025)
            cyl('Condenser fan',.25,.035,(x,H+1.16,z),dark,n=20)
            for k in range(6):box('Ventilation louvre',(.65,.022,.025),(x,H+.59+k*.078,z+.414),dark)
    for x in [-2,2]:rod('Rainwater pipe',(x,.25,-3.23),(x,H,-3.23),.025,steel)
    # Ground lobby, glazing and a supported canopy finish the street elevation.
    box('Lobby entrance',(1.2,2.4,.035),(0,1.45,3.27),glass2)
    for x in [-.64,.64]:box('Lobby frame',(.045,2.48,.11),(x,1.45,3.28),bronze)
    box('Lobby canopy',(2.2,.10,1.15),(0,2.93,3.67),dark,.02)
    for x in [-.85,.85]:rod('Canopy tie',(x,3.6,3.21),(x,2.98,4.15),.014,steel)
    for o in collection.objects:
        if o.type!='MESH':continue
        uv=o.data.uv_layers.active or o.data.uv_layers.new(name='Metre scale UV')
        for poly in o.data.polygons:
            axis=max(range(3),key=lambda a:abs(poly.normal[a]));axes=[a for a in range(3) if a!=axis]
            for li in poly.loop_indices:
                p=o.matrix_world@o.data.vertices[o.data.loops[li].vertex_index].co
                uv.data[li].uv=(p[axes[0]]/2,p[axes[1]]/2)
    export(name)

tower('site-distant-block',0)
tower('site-skyline-glass',1)
tower('site-skyline-brick',2)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'city-skyline.blend'),compress=True)
old=json.loads((OUT/'manifest.json').read_text());old['assets'].update(manifest)
(OUT/'manifest.json').write_text(json.dumps(old,indent=2))
print('CITY_SKYLINE_READY',json.dumps(manifest))
