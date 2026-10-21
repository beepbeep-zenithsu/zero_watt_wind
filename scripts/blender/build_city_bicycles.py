"""Connected commuter bicycle, grounded tires, drivetrain and parking support."""
from pathlib import Path
exec((Path(__file__).parent/'build_environment.py').read_text().split("apartment('site-apartment-low'")[0])
begin('Detailed commuter bicycle')
wheelY=.35;rear=-.59;front=.59;crank=(0,.35,-.02);seat=(0,.81,-.22);head=(0,.86,.40)
for z in [rear,front]:
    torus('Road tire',.324,.026,(0,wheelY,z),rubber,'x')
    torus('Brushed aluminum rim',.296,.013,(0,wheelY,z),steel,'x')
    cyl('Wheel hub',.035,.12,(0,wheelY,z),dark,'x',16)
    for j in range(24):
        a=j*math.tau/24
        rod('Crossed wheel spoke',((-.035 if j%2 else .035),wheelY,z),(0,wheelY+.286*math.sin(a),z+.286*math.cos(a)),.0025,steel,4)
for a,b in [(crank,seat),(seat,head),(head,crank)]:rod('Main alloy frame tube',a,b,.025,sage,12)
for side in [-1,1]:
    for a,b in [((side*.04,wheelY,rear),(side*.035,.80,-.22)),((side*.04,wheelY,rear),(side*.035,.35,-.02)),((side*.04,wheelY,front),(side*.035,.83,.40))]:rod('Paired stays and fork blades',a,b,.017,sage,10)
rod('Headset',(0,.76,.38),(0,.91,.41),.035,dark)
rod('Chrome seat post',(0,.73,-.19),(0,.96,-.23),.018,steel)
box('Contoured saddle',(.18,.055,.28),(0,.98,-.24),dark,.035)
rod('Handlebar riser',(0,.87,.41),(0,1.08,.45),.022,steel)
rod('Handlebar crossbar',(-.28,1.08,.45),(.28,1.08,.45),.017,steel)
for side in [-1,1]:
    rod('Rubber handle grip',(side*.18,1.08,.45),(side*.29,1.08,.45),.023,rubber)
    rod('Brake lever',(side*.19,1.06,.47),(side*.27,1.04,.53),.008,dark)
    rod('Visible brake cable',(side*.19,1.04,.47),(side*.03,.74,.44),.003,dark,6)
    cyl('Brake rotor',.11,.009,(side*.045,.35,front),steel,'x',24)
    angle=side*.15
    rod('Crank arm',(side*.085,.35,-.02),(side*.085,.35+angle,-.02+side*.08),.014,steel)
    box('Platform pedal',(.11,.035,.08),(side*.13,.35+angle,-.02+side*.08),dark,.008)
cyl('Bottom bracket',.055,.16,crank,steel,'x',20)
torus('Chainring',.105,.012,(.065,.35,-.02),steel,'x')
torus('Rear sprocket',.060,.009,(.065,.35,rear),steel,'x')
for y,z in [(.445,-.05),(.255,-.05)]:rod('Connected drive chain',(.068,y,z),(.068,.35+(y-.35)*.60,rear),.006,dark,8)
# Fenders follow the wheels; fender stays join both fork/chainstay ends.
for z in [rear,front]:
    for j in range(20):
        a=.15+j*math.pi*.85/20;b=.15+(j+1)*math.pi*.85/20
        rod('Curved rain mudguard',(0,.35+.367*math.sin(a),z+.367*math.cos(a)),(0,.35+.367*math.sin(b),z+.367*math.cos(b)),.018,dark,8)
    for side in [-1,1]:rod('Fender support stay',(side*.045,.35,z),(side*.045,.62,z-.22),.004,steel,6)
for side in [-1,1]:rod('Rear carrier support',(side*.10,.35,rear),(side*.10,.83,rear-.05),.008,steel)
box('Rear luggage carrier',(.24,.025,.40),(0,.84,rear-.01),dark,.009)
rod('Grounded kickstand',(-.03,.35,-.12),(-.20,.005,-.25),.010,dark)
box('Front reflector',(.05,.06,.02),(0,1.03,.48),white,.008)
box('Rear reflector',(.05,.045,.025),(0,.83,-.82),orange,.006)
export('site-bicycle')
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'city-bicycle.blend'),compress=True)
old=json.loads((OUT/'manifest.json').read_text());old['assets'].update(manifest)
(OUT/'manifest.json').write_text(json.dumps(old,indent=2))
print('CITY_BICYCLE_READY',json.dumps(manifest))
