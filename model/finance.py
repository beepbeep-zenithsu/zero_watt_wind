"""ZeroWatt Wind: reproducible screening model, Python standard library only.

Run from any directory: python model/finance.py
All money is nominal BDT; USD is presentation-only at the dated BB benchmark.
No grants, loans, speculative health/yield benefits or exit multiple enter project FCF.
This is a scenario model, not measured performance, a tax opinion or a forecast.
"""
from pathlib import Path
from math import exp, gamma, pi, ceil, isfinite
from statistics import median
from collections import defaultdict
import csv, json, copy

ROOT=Path(__file__).resolve().parents[1]; DATA=ROOT/'data'; DATA.mkdir(exist_ok=True)
FX=123.65  # [S] Bangladesh Bank WAR, 2026-10-19, accessed 2026-10-22
GRID_TARIFF=15.36  # [S] BERC order 2026-06-03, scanned official PDF p3
CLINIC_TARIFF=9.05 # [S] same order, PDF p2; LT-D1
DATE='2026-10-22'
RATES=(.12,.18,.25) # [A] nominal required returns; historical BB policy 10% is a floor benchmark, not WACC
YEARS=10; MONTHS=120

def dump(name,rows):
    rows=list(rows)
    if not rows:return
    with (DATA/name).open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)

def npv(cash,rate=.18):return sum(c/(1+rate)**(i/12) for i,c in enumerate(cash))
def bisect(fn,lo,hi):
    a=fn(lo)
    for _ in range(100):
        mid=(lo+hi)/2;b=fn(mid)
        if abs(b)<1e-7:return mid
        if a*b<=0:hi=mid
        else:lo=mid;a=b
    return (lo+hi)/2
def irr_roots(cash):
    # Annual effective IRR from end-month cash flows; report all bracketed roots.
    grid=[-.9999]+[-.99+i*.99/200 for i in range(201)]+[(exp(i*.04)-1) for i in range(1,151)]
    roots=[];last=grid[0];prev=npv(cash,last)
    for x in grid[1:]:
        val=npv(cash,x)
        if prev*val<0:
            root=bisect(lambda r:npv(cash,r),last,x)
            if not roots or abs(root-roots[-1])>1e-5:roots.append(root)
        prev=val;last=x
    return roots
def payback(cash,rate=0):
    cum=0.;s=[]
    for i,c in enumerate(cash):cum+=c/(1+rate)**(i/12);s.append(cum)
    # Durable crossing: later capex must not undo the recovery.
    for m in range(1,len(s)):
        if s[m]>=0 and s[m-1]<0 and min(s[m:])>=-1e-8:
            return (m-1+(-s[m-1])/(s[m]-s[m-1]))/12
    return None

# Component unit costs [A] are deliberately separate from sourced price observations.
# qA/qB/qH: basic rooftop / pond / advanced hybrid. Three columns are uncertainty
# allowances, NOT manufactured supplier quotes. Dimensions require engineering design.
BOM=[
('rotor','Spiral rotor and balanced hub','Formed aluminium; 1 m nominal basic / 2.1 m hybrid','Capture wind',1,1,1,3500,6000,10000,'A','windguide;poster'),
('shafts','Shaft stock and machining','Steel, nominal 20 mm; three axes for two stages, two for H','Transmit torque',3,3,2,500,900,1600,'A','bearing3'),
('bevel','Production bevel gear pair','Steel, two right-angle stages; module and rating RFQ','Redirect rotation',2,2,1,700,1500,3000,'A','gear'),
('bearings','Radial bearing blocks','20 mm sealed UCP-type; two radial supports per shaft; axial separate','Support shaft',6,6,4,450,900,2000,'A','bearing1;bearing3'),
('thrust','Thrust bearing and collar set','Matched axial load and positive retention','Carry fan/gear thrust',1,1,1,500,1000,2000,'A','windguide'),
('couplers','Couplings keys collars','Keyed steel; fastener locking','Locate and couple shafts',3,3,3,200,400,700,'A','gear'),
('frame','Frame mounting and isolators','Coated local steel; engineered anchor plates','Structural support',1,1,1,2500,4500,7500,'A','windguide'),
('brake','Fail-safe brake and storm restraint','Mechanical brake/furling concept; test required','Overspeed protection',1,1,1,1000,2500,5000,'A','windguide'),
('guard','Rotor and gear guards','Corrosion-resistant mesh with access covers','Entanglement protection',1,1,1,1000,1800,3500,'A','windguide'),
('seals','Seals grease fasteners coating','Gaskets, compatible lubricant, corrosion isolation','Weather and service kit',1,1,1,700,1200,2200,'A','windguide'),
('fan','Mechanical axial fan and hub','NACA 65-810 concept; needs pressure-flow test','Exhaust room air',1,0,1,1200,2200,4000,'A','poster;fanweb'),
('plenum','Sleeve plenum duct and cowl','Sheet metal; screened intake, access and rain drain','Air pathway',1,0,1,1800,3500,6500,'A','poster'),
('roof','Roof flashing and backdraft damper','Waterproof penetration and service access','Weatherproof building interface',1,0,1,800,1500,3000,'A','windguide'),
('paddles','Paddle wheel and wet shaft guards','HDPE paddles on corrosion-resistant hub','Surface aeration',0,1,0,1800,3500,6000,'A','faoaer;poster'),
('floats','Compartmented pontoons','Recovered/rotomoulded HDPE, two separate floats','Flotation with reserve buoyancy',0,2,0,1200,2200,4000,'A','poster'),
('mooring','Mooring anchor retrieval and wet seals','Two lines, anchors and dry access provision','Retain and retrieve pond assembly',0,1,0,1200,2500,5000,'A','faoquality'),
('pv','PV module and fixed rack','180-200 W class; roof area/structure assessment','Electrical assistance energy',0,0,1,6000,9000,15000,'A','site'),
('battery','Battery pack and BMS','24 V nominal, 240 Wh class; warranted matched pack','Short duration assistance',0,0,1,8000,14000,22000,'A','battery1;battery2'),
('motor','Motor PWM belt pulleys dual freewheels','95 W input class, compatible ratios','Assist common shaft',0,0,1,5000,9000,15000,'A','site'),
('control','Controller fuses disconnect cabling','Weatherproof DC controls and two tachometers','Protected DC bus',0,0,1,3500,6000,10000,'A','site'),
('tracking','Sun tracker structure and actuators','Optional site depiction; costed only in H','Illustrative solar tracking',0,0,1,2500,5000,10000,'A','site'),
('qa','Assembly balancing and inspection','Paid shop labour and acceptance test','Deliver inspected ex-works unit',1,1,1,2000,3500,6000,'A','filament2')]

def bom_cost(mode,band='base'):
    if mode=='A+B':return bom_cost('A',band)+bom_cost('B',band)
    qi={'A':4,'B':5,'H':6}[mode]; ci={'low':7,'base':8,'high':9}[band]
    return sum(r[qi]*r[ci] for r in BOM)

OPEX=[('Engineering and founder salaries',40000,60000,100000),('Technician salary',18000,25000,40000),('Rent',8000,12000,20000),('Utilities and workshop energy',2000,3500,6000),('Logistics and field travel',4000,8000,15000),('Marketing and customer development',3000,7000,14000),('Administration accounting telecom',3000,6000,10000),('Insurance and liability allowance',1000,3000,8000),('Tool maintenance and calibration',2000,4000,8000)]
INVEST=[('Engineering and redesign',250000,500000,1000000,'prelaunch'),('Tools printer jigs metrology',200000,450000,900000,'capex'),('Pilot fabrication and failed trials',150000,300000,600000,'prelaunch'),('Independent performance and structural tests',150000,350000,800000,'prelaunch'),('Registration legal and launch',50000,100000,200000,'prelaunch')]
PRICES={'A':45000,'B':55000,'H':125000} # [A] willingness to pay unverified; not competitor equivalence
MIX={'A':.60,'B':.30,'H':.10}
CHANNELS={'sale':.70,'lease':.20,'use':.10}
SCENARIOS={
 'conservative':dict(adoption=.5,price=.85,cost=1.25,overhead=1.1,wind_mean=2.5,availability=.8,churn=.15,bad_debt=.08),
 'base':dict(adoption=1.,price=1.,cost=1.,overhead=1.,wind_mean=3.5,availability=.9,churn=.08,bad_debt=.03),
 'optimistic':dict(adoption=1.8,price=1.10,cost=.90,overhead=1.10,wind_mean=4.5,availability=.95,churn=.04,bad_debt=.015)}
RAMP=[30,45,65,90,120,150,180,210,240,270] # new deployments/year [A], not market survey
INFLATION=.04; COST_INFLATION=.04; TAX=.25; WARRANTY=.03
LEASE_MO=1500; USE_HOURLY=30; USE_SCHEDULED_H=120; INSTALL=3000; INSTALL_COST=1800
AMC_ANNUAL=1800; AMC_COST=900; AMC_TAKE=.40
NWC_SHARE=.12; START_NWC=200000; FLEET_LIFE=60; TOOL_LIFE=60

def wind(mean,availability=.9):
    """[A/D] Weibull k=2, quadrature; no claim to site resource measurement.
    Energy service fraction integrates min(P(v),required)/required.
    Full-performance fraction is a different probability, not capacity factor.
    """
    shape=2.;scale=mean/gamma(1+1/shape)
    rho=1.225;area=pi/4;cp=.18;drive=.75;cutin=2.;cutout=16.;rated=250.
    required=300/3600*20/.35 # 300 m3/h at 20 Pa, site coefficient efficiency .35
    dv=.01;power=0.;fraction=0.;full=0.;mass=0.
    for i in range(5000):
        v=(i+.5)*dv;f=shape/scale*(v/scale)**(shape-1)*exp(-(v/scale)**shape)*dv
        p=min(.5*rho*area*cp*drive*v**3,rated) if cutin<=v<=cutout else 0.
        power+=p*f;fraction+=min(p/required,1)*f;full+=float(p>=required)*f;mass+=f
    return dict(mean_wind_ms=mean,weibull_shape=shape,scale_ms=scale,mechanical_availability=availability,
                mean_shaft_w=power*availability,capacity_factor_250w=power*availability/rated,
                energy_service_fraction=fraction*availability,full_service_fraction=full*availability,
                threshold_ms=(required/(.5*rho*area*cp*drive))**(1/3),required_shaft_w=required,
                integrated_probability=mass)

WIND={k:wind(v['wind_mean'],v['availability']) for k,v in SCENARIOS.items()}

def run(name='base',overrides=None,channel_mix=None):
    p=copy.deepcopy(SCENARIOS[name]);p.update(overrides or {})
    channels=channel_mix or CHANNELS
    weighted_cost=sum(MIX[k]*bom_cost(k) for k in MIX)*p['cost']
    weighted_price=sum(MIX[k]*PRICES[k] for k in MIX)*p['price']
    fixed=sum(r[2] for r in OPEX)*p['overhead']
    capital=sum(r[2] for r in INVEST if r[4]=='capex')*p['cost']
    prelaunch=sum(r[2] for r in INVEST if r[4]=='prelaunch')*p['cost']
    contingency=.20*(capital+prelaunch)
    winddata=wind(p['wind_mean'],p['availability'])
    service=winddata['energy_service_fraction']*p.get('wind_factor',1.)
    service=max(0,min(1,service))
    rows=[]; fleets=[]; sold=[]; prev_nwc=START_NWC
    zero=dict(scenario=name,month=0,year=0,new_units=0.,sales_units=0.,lease_units=0.,use_units=0.,sale_revenue=0.,lease_revenue=0.,use_revenue=0.,installation_revenue=0.,maintenance_revenue=0.,revenue=0.,direct_cost=0.,fixed_opex=0.,ebitda=-prelaunch-contingency,depreciation=0.,tax=0.,net_profit=-prelaunch-contingency,fleet_capex=0.,tool_capex=capital,delta_nwc=START_NWC,fcf=-capital-prelaunch-contingency-START_NWC,nwc=START_NWC)
    zero.update({k:0. for k in ['cost_sale','cost_install','cost_maintenance','cost_lease','cost_use','depreciation_fleet','depreciation_tools']})
    rows.append(zero)
    for m in range(1,MONTHS+1):
        y=(m-1)//12;infl=(1+INFLATION)**y;ci=(1+COST_INFLATION)**y
        new=RAMP[y]*p['adoption']/12
        sale=new*channels.get('sale',0);lease=new*channels.get('lease',0);use=new*channels.get('use',0)
        # Uniform expected monthly deployment; fractional units are expected values, not literal orders.
        fleets.append((m,lease,use,(weighted_cost+INSTALL_COST)*ci))
        sold.append((m,sale))
        active_l=active_u=dep_fleet=0.
        for birth,nl,nu,cost in fleets:
            age=m-birth
            if age<FLEET_LIFE:
                survival=(1-p['churn'])**(age/12)
                active_l+=nl*survival;active_u+=nu*survival
                # Retired/churned assets assumed recovered without resale; conservative cost book remains depreciated.
                dep_fleet+=(nl+nu)*cost/FLEET_LIFE
        amc=sum(n*(1-p['churn'])**((m-b)/12) for b,n in sold if 12<=m-b<60)*AMC_TAKE
        collected=1-p['bad_debt']
        sr=sale*weighted_price*infl*collected
        # Lease sells supplemental access, not guaranteed critical service. No wind credit promised.
        lr=active_l*LEASE_MO*p['price']*infl*collected
        ur=active_u*USE_HOURLY*p['price']*USE_SCHEDULED_H*service*infl*collected
        ir=sale*INSTALL*p['price']*infl*collected
        mr=amc*AMC_ANNUAL/12*p['price']*infl*collected
        revenue=sr+lr+ur+ir+mr
        cost_sale=sale*weighted_cost*ci+sr*WARRANTY
        cost_install=sale*INSTALL_COST*ci
        cost_maintenance=amc*AMC_COST/12*ci
        cost_lease=active_l*weighted_cost*.05/12*ci
        cost_use=active_u*weighted_cost*.05/12*ci
        direct=cost_sale+cost_install+cost_maintenance+cost_lease+cost_use
        fixed_now=fixed*ci*(1 if y<3 else 1+.12*(y-2)) # capacity/headcount increases explicitly after launch phase
        ebitda=revenue-direct-fixed_now
        tool_add=capital*ci if m==61 else 0.
        tool_dep=(capital if m<=60 else capital*(1+COST_INFLATION)**5)/TOOL_LIFE
        depreciation=tool_dep+dep_fleet
        ebit=ebitda-depreciation
        tax=max(0,ebit)*TAX # conservative monthly reserve; no loss-credit assumption
        net=ebit-tax
        fc=(lease+use)*weighted_cost*ci+(lease+use)*INSTALL_COST*ci # provider pays installation; never billed twice
        nwc=max(START_NWC,revenue*12*NWC_SHARE)
        delta=nwc-prev_nwc
        if m==MONTHS:delta-=nwc;nwc=0 # working-capital recovery, no fleet/enterprise salvage
        fcf=net+depreciation-fc-tool_add-delta
        rows.append(dict(scenario=name,month=m,year=y+1,new_units=new,sales_units=sale,lease_units=active_l,use_units=active_u,
          sale_revenue=sr,lease_revenue=lr,use_revenue=ur,installation_revenue=ir,maintenance_revenue=mr,revenue=revenue,
          direct_cost=direct,fixed_opex=fixed_now,ebitda=ebitda,depreciation=depreciation,tax=tax,net_profit=net,
          fleet_capex=fc,tool_capex=tool_add,delta_nwc=delta,fcf=fcf,nwc=nwc,
          cost_sale=cost_sale,cost_install=cost_install,cost_maintenance=cost_maintenance,cost_lease=cost_lease,cost_use=cost_use,
          depreciation_fleet=dep_fleet,depreciation_tools=tool_dep))
        prev_nwc=nwc
    return rows

def metrics(rows,rate=.18,with_irr=True):
    cash=[r['fcf'] for r in rows];roots=irr_roots(cash) if with_irr else []
    cum=[];x=0
    for c in cash:x+=c;cum.append(x)
    return dict(npv_bdt=npv(cash,rate),npv_usd=npv(cash,rate)/FX,irr=roots[0] if len(roots)==1 else None,
                irr_root_count=len(roots),simple_payback_years=payback(cash),discounted_payback_years=payback(cash,rate),
                initial_investment_bdt=-cash[0],peak_funding_need_bdt=-min(cum),terminal_cash_bdt=sum(cash),discount_rate=rate)

def annual(rows):
    out=[]
    stocks=['lease_units','use_units','nwc'];meta=['scenario','month','year']
    for y in range(11):
        rr=[r for r in rows if r['year']==y]
        row={'scenario':rows[0]['scenario'],'year':y}
        for key in rows[0]:
            if key in meta:continue
            row[key]=rr[-1][key] if key in stocks else sum(r[key] for r in rr)
        row['average_monthly_revenue']=row['revenue']/12 if y else 0
        row['average_monthly_ebitda']=row['ebitda']/12 if y else 0
        row['average_monthly_net_profit']=row['net_profit']/12 if y else 0
        row['average_monthly_fcf']=row['fcf']/12 if y else 0
        out.append(row)
    return out

def engineering():
    """Equal-service customer economics; annual wind energy integration is screening only.
    Ventilation: 300m3/h additional flow into 150m3 (2 ACH), 12h/day 365days.
    Pond: 0.25mg/L/h *100m3=25g/h=0.025kg/h, 24h/day.
    Electric product duty at service point and field SAE are assumptions, never borrowed from nameplate.
    """
    records=[];cumrows=[]; env=[]
    for scen,p in SCENARIOS.items():
        w=WIND[scen];fr=w['energy_service_fraction']
        for mode in ['A','H','B']:
            h=4380 if mode!='B' else 8760
            kw=.055 if mode!='B' else .025/1.2 # [A] field SAE 1.2; sourced fan nameplate, assumed delivered flow
            if mode=='B':
                # Field correction applied to standard shaft SAE; actual performance NOT FOUND.
                annual_wind_oxygen=w['mean_shaft_w']/1000*.8*.5*8760
                fraction=min(annual_wind_oxygen/(.025*8760),1)
                demand=.025*8760;denom=demand
            else:fraction=fr;demand=300*h;denom=2*h
            if mode=='H':fraction=min(.85,fr+.45) # [A] solar+wind offset, not dispatch simulation
            cap_e=5000 if mode!='B' else 50000 # fan 1310 retail + installation/duct allowance, pond source 50000
            price=PRICES[mode]+INSTALL
            maint_e=300 if mode!='B' else 2500
            maint_w=.04*bom_cost(mode)
            battery_repl=14000 if mode=='H' else 0
            wind_repl=.25*bom_cost(mode)
            costs={'electric':cap_e,'wind_backup':price+cap_e,'diesel':cap_e+30000}
            grid=.0;windgrid=.0;diesell=.0
            for y in range(11):
                if y:
                    kwh=kw*h;tariff=GRID_TARIFF # [S] June 2026 LT-E flat, before VAT/demand charges
                    ec=kwh*tariff+maint_e
                    wc=kwh*(1-fraction)*tariff+maint_e+maint_w
                    # shared generator allocated capex; small-load fuel is highly uncertain [A].
                    liters=kwh*.4;dc=liters*110+maint_e+2000 # diesel price reserve [A], not asserted current pump price
                    if y==5:ec+=cap_e;wc+=cap_e+wind_repl+battery_repl;dc+=cap_e
                    if y==8:dc+=30000
                    costs['electric']+=ec;costs['wind_backup']+=wc;costs['diesel']+=dc
                    grid+=kwh;windgrid+=kwh*(1-fraction);diesell+=liters
                cumrows.append(dict(scenario=scen,mode=mode,year=y,electric=costs['electric'],wind_backup=costs['wind_backup'],diesel=costs['diesel']))
            saving=kw*h*fraction*GRID_TARIFF-maint_w
            incremental_capex=price
            pay=incremental_capex/saving if saving>0 else None
            records.append(dict(scenario=scen,mode=mode,wind_energy_fraction=fraction,full_service_fraction=w['full_service_fraction'],
              annual_service_demand=demand,annual_grid_kwh=kw*h,annual_avoided_grid_kwh=kw*h*fraction,
              ten_year_electric_bdt=costs['electric'],ten_year_wind_backup_bdt=costs['wind_backup'],ten_year_diesel_bdt=costs['diesel'],
              cost_per_service_electric=costs['electric']/(10*denom),cost_per_service_wind=costs['wind_backup']/(10*denom),
              annual_net_saving_bdt=saving,incremental_payback_years=pay,unmet_energy_without_backup=1-fraction,
              subsidy_free_capital_premium_bdt=incremental_capex))
            # LCA-style screening. Foreground masses [A], factors [A] not a claimed supplier EPD.
            masses={'steel':15,'aluminium':4,'polymer':3 if mode!='B' else 8}
            factors={'steel':2.,'aluminium':8.,'polymer':3.}
            emb=sum(masses[k]*factors[k] for k in masses)+20+30 # fabrication/transport, replacement reserve
            if mode=='H':emb+=300 # PV+battery+controls lifecycle reserve
            avoided=kw*h*fraction*.62*10
            env.append(dict(scenario=scen,mode=mode,embodied_low_kg=emb*.5,embodied_base_kg=emb,embodied_high_kg=emb*2,
               ten_year_avoided_kg=avoided,ten_year_net_kg=avoided-emb,
               carbon_payback_years=emb/(avoided/10) if avoided>0 else None,
               grid_factor_kg_kwh=.62,recyclability_target_fraction=.8))
    return records,cumrows,env

def price_observations():
    # Only values visible in actually accessed sources or explicitly flagged search-index-only.
    data=[
      ('PLA filament kg','HTE Bangladesh',1287,'BDT','filament3','open text; out of stock on recheck','generic'),
      ('PLA filament kg','Costareen',1550,'BDT','filament1','dated guide starting price','SUNLU PLA+'),
      ('PLA filament kg','Electronics.Com.BD',1999,'BDT','filament4','open text','generic white'),
      ('PLA filament kg','TechShopBD',1950.04,'BDT','filament2','open marketplace','SUNLU PLA+ red'),
      ('UCP204 bearing','Daraz/Fair Enterprise',450,'BDT','bearing1','cached stock conflicting','generic 20mm'),
      ('UCP204 bearing','MISUMI',15.65,'SGD','bearing2','search-index only; open 429','ASAHI branded'),
      ('UCP204 bearing','Motion',52.70,'USD','bearing3','open text','AMI branded'),
      ('Electric exhaust fan','Walton',1250,'BDT','fanweb','open full text; index showed 1310','WEF1201N 55W'),
      ('Hobby bevel gear','ZerOneTech',245,'BDT','gear','search-index only; open failed','8mm hole, not production gear'),
      ('Conventional aerator','NSC BD',50000,'BDT','aerator1','open text','2HP four paddles'),
      ('Conventional aerator','Bangla Ltd.',40000,'BDT','banglaaer','open text; inconsistent transfer claims','2HP model unspecified'),
      ('Conventional aerator','BDStall single seller',40000,'BDT','bdstall','open text; seller independence not established','1HP two paddles; not equivalent'),
      ('Battery 12V20Ah','CityTechBD',1845,'BDT','battery1','open text; suspicious outlier','not selected'),
      ('Battery 12V20Ah','Teexla',8200,'BDT','battery2','open text','not 24V warranted pack')]
    rows=[]
    for cat,supplier,p,curr,src,status,spec in data:
        bdt=p*(FX if curr=='USD' else 96.5851 if curr=='SGD' else 1)
        rows.append(dict(component_family=cat,supplier=supplier,price=p,currency=curr,bdt=bdt,usd=bdt/FX,source_id=src,status=status,spec=spec,date_accessed=DATE))
    stats=[]
    for cat in sorted(set(r['component_family'] for r in rows)):
        rr=[r for r in rows if r['component_family']==cat];v=[r['bdt'] for r in rr]
        independent=len(rr)-(1 if cat=='Conventional aerator' else 0) # BDStall seller identity not verified against NSC
        stats.append(dict(component_family=cat,independent_sellers=independent,low_bdt=min(v),median_bdt=median(v),high_bdt=max(v),
          basis='D from S indications; non-equivalent grades' if cat=='UCP204 bearing' else 'D from S retail indications',
          limitation='Three comparable independent landed quotes NOT FOUND' if independent<3 or cat=='UCP204 bearing' else 'Family-level comparison only; brands differ'))
    return rows,stats

def main():
    bomrows=[]
    for r in BOM:
        for mode,quantity in [('A',r[4]),('B',r[5]),('H',r[6]),('A+B',r[4]+r[5])]:
            if quantity:
                bomrows.append(dict(mode=mode,component=r[0],name=r[1],specification=r[2],function=r[3],quantity=quantity,
                    low_unit_bdt=r[7],base_unit_bdt=r[8],high_unit_bdt=r[9],low_total_bdt=quantity*r[7],base_total_bdt=quantity*r[8],high_total_bdt=quantity*r[9],
                    base_total_usd=quantity*r[8]/FX,basis=r[10],source_ids=r[11],three_production_quotes='NOT FOUND'))
    dump('components.csv',bomrows)
    bomsummary=[dict(mode=m,low_bdt=bom_cost(m,'low'),base_bdt=bom_cost(m),high_bdt=bom_cost(m,'high'),base_usd=bom_cost(m)/FX,basis='D from A production allowances') for m in ['A','B','H']]
    bomsummary.append(dict(mode='A+B',low_bdt=bom_cost('A','low')+bom_cost('B','low'),base_bdt=bom_cost('A')+bom_cost('B'),high_bdt=bom_cost('A','high')+bom_cost('B','high'),base_usd=(bom_cost('A')+bom_cost('B'))/FX,basis='D; separate cores, no energy sharing'))
    dump('bom_summary.csv',bomsummary)
    po,ps=price_observations();dump('price_observations.csv',po);dump('price_statistics.csv',ps)
    build=[]
    for mode in ['A','B','A+B','H']:
        for q in [1,10,100,1000]:
            make_setup=360000 if mode=='A+B' else 180000 if mode!='H' else 300000
            ass_setup=60000 if mode=='A+B' else 30000 if mode!='H' else 50000
            make_var=bom_cost(mode)*.82;ass_var=bom_cost(mode)
            build.append(dict(mode=mode,quantity=q,build_unit_bdt=make_setup/q+make_var,assemble_unit_bdt=ass_setup/q+ass_var,
               build_total_bdt=make_setup+q*make_var,assemble_total_bdt=ass_setup+q*ass_var,
               break_even_quantity=ceil((make_setup-ass_setup)/(ass_var-make_var)),basis='A setup and variable rates; D crossover'))
    dump('build_vs_assemble.csv',build)
    inv=[]
    for n,l,b,h,t in INVEST:inv.append(dict(item=n,low_bdt=l,base_bdt=b,high_bdt=h,treatment=t,basis='A'))
    for band,idx in [('low',1),('base',2),('high',3)]:
        total=sum(r[idx] for r in INVEST);reserve=total*.2;nwc={'low':100000,'base':200000,'high':400000}[band]
        inv.append(dict(item=f'{band} total incl contingency and working capital',low_bdt=total+reserve+nwc if band=='low' else '',base_bdt=total+reserve+nwc if band=='base' else '',high_bdt=total+reserve+nwc if band=='high' else '',treatment='D total',basis='D from A'))
    dump('investment.csv',inv)
    dump('opex.csv',[dict(item=n,low_monthly_bdt=l,base_monthly_bdt=b,high_monthly_bdt=h,base_annual_bdt=b*12,basis='A') for n,l,b,h in OPEX])
    dump('wind_resource.csv',[dict(scenario=k,**v,basis='A Weibull distribution and site coefficients; D integration') for k,v in WIND.items()])
    allmonthly=[];allannual=[];summary=[];results={};rate_rows=[];business=[]
    for name in SCENARIOS:
        rows=run(name);aa=annual(rows);mm=metrics(rows);results[name]={'metrics':mm,'annual':aa}
        allmonthly+=rows;allannual+=aa;summary.append(dict(scenario=name,**mm))
        for rate in RATES:rate_rows.append(dict(scenario=name,discount_rate=rate,npv_bdt=npv([r['fcf'] for r in rows],rate),basis='D from A/S inputs'))
        for y in [1,5,10]:
            row=aa[y]
            for channel,key in [('sale','sale_revenue'),('lease','lease_revenue'),('pay_per_use','use_revenue'),('installation','installation_revenue'),('maintenance','maintenance_revenue')]:
                business.append(dict(scenario=name,year=y,model=channel,annual_revenue_bdt=row[key],average_monthly_revenue_bdt=row[key]/12,basis='D from A tariffs/adoption'))
        # Standalone channels have the same complete overhead and initial budget; never summed together.
        for channel in ['sale','lease','use']:
            solo=run(name,channel_mix={channel:1.});sa=annual(solo)
            sm=metrics(solo,with_irr=False)
            results[name][channel]={'annual':sa,'metrics':sm}
    dump('cashflow_monthly.csv',allmonthly);dump('cashflow_annual.csv',allannual);dump('scenario_results.csv',summary);dump('npv_rates.csv',rate_rows);dump('revenue_by_model.csv',business)
    standalone=[]
    for s in SCENARIOS:
        for c in ['sale','lease','use']:
            for row in results[s][c]['annual']:standalone.append(dict(business_model=c,**row))
    dump('standalone_annual.csv',standalone)
    base=results['base']['metrics']['npv_bdt'];sens=[]
    tests=[('Price',{'price':.8},{'price':1.2}),('Adoption',{'adoption':.6},{'adoption':1.4}),('Wind availability',{'wind_factor':.6},{'wind_factor':1.4}),('Component cost',{'cost':.8},{'cost':1.2})]
    for label,lo,hi in tests:
        a=npv([r['fcf'] for r in run('base',lo)]);b=npv([r['fcf'] for r in run('base',hi)])
        sens.append(dict(parameter=label,low_input=str(lo),high_input=str(hi),low_npv_bdt=a,base_npv_bdt=base,high_npv_bdt=b,low_delta_bdt=a-base,high_delta_bdt=b-base,basis='D one-at-a-time; A ranges'))
    a=npv([r['fcf'] for r in run()],.12);b=npv([r['fcf'] for r in run()],.25)
    sens.append(dict(parameter='Discount rate',low_input='.12',high_input='.25',low_npv_bdt=a,base_npv_bdt=base,high_npv_bdt=b,low_delta_bdt=a-base,high_delta_bdt=b-base,basis='D at A rates'))
    dump('sensitivity.csv',sens)
    breaks={}
    for key in ['price','adoption']:
        fn=lambda x:npv([r['fcf'] for r in run('base',{key:x})])
        upper=10 if key=='price' else 1000
        if fn(.01)*fn(upper)<0:breaks[key]=bisect(fn,.01,upper)
        else:breaks[key]=None
    breaks['weighted_price_bdt']=sum(MIX[k]*PRICES[k] for k in MIX)*(breaks['price'] or 0)
    breaks['year1_units']=RAMP[0]*breaks['adoption'] if breaks['adoption'] is not None else None
    dump('break_even.csv',[dict(parameter=k,value=v,basis='D NPV=0 at 18 percent; uniform scale of A inputs') for k,v in breaks.items()])
    comp,curves,env=engineering();dump('customer_comparison.csv',comp);dump('customer_cumulative_cost.csv',curves);dump('environment.csv',env)
    # Model-level contribution with one explicit shared-overhead allocation.
    contributions=[]
    for s in SCENARIOS:
        for y in [1,5,10]:
            row=results[s]['annual'][y];rev=row['revenue']
            for channel,key in [('sale','sale_revenue'),('lease','lease_revenue'),('pay_per_use','use_revenue'),('installation','installation_revenue'),('maintenance','maintenance_revenue')]:
                share=row[key]/rev if rev else 0
                costkey={'sale':'cost_sale','lease':'cost_lease','pay_per_use':'cost_use','installation':'cost_install','maintenance':'cost_maintenance'}[channel]
                fleetshare={'lease':2/3,'pay_per_use':1/3}.get(channel,0)
                dep=row['depreciation_tools']*share+row['depreciation_fleet']*fleetshare
                ebitda=row[key]-row[costkey]-row['fixed_opex']*share
                tax=row['tax']*share # allocate consolidated tax; do not invent segment refunds
                contributions.append(dict(scenario=s,year=y,model=channel,allocation_share=share,revenue_bdt=row[key],direct_cost_bdt=row[costkey],allocated_ebitda_bdt=ebitda,allocated_depreciation_bdt=dep,allocated_tax_bdt=tax,allocated_net_profit_bdt=ebitda-dep-tax,basis='D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share'))
    dump('profit_allocation.csv',contributions)
    # Quantified site-level exposure examples, not predicted or booked benefits.
    problem=[dict(metric='pond_area_ha',value=424168,basis='S',source_id='dof'),dict(metric='pond_count',value=2543869,basis='S',source_id='dof'),dict(metric='pond_production_tonnes',value=2368741,basis='S',source_id='dof'),dict(metric='pollution_deaths_all_causes',value=272000,basis='S lower bound',source_id='wb'),dict(metric='pollution_illness_days',value=5200000000,basis='S',source_id='wb'),dict(metric='air_pollution_GDP_pct_2019',value=8.32,basis='S',source_id='wb'),dict(metric='site_fish_stock_kg',value=1000,basis='A',source_id=''),dict(metric='site_fish_price_bdt_kg',value=200,basis='A',source_id=''),dict(metric='site_loss_fraction_low',value=.02,basis='A',source_id=''),dict(metric='site_loss_fraction_base',value=.10,basis='A',source_id=''),dict(metric='site_loss_fraction_high',value=.30,basis='A',source_id=''),dict(metric='site_base_stock_exposure_bdt',value=1000*200*.10,basis='D from A, not avoided loss',source_id=''),dict(metric='clinic_baseline_electric_bdt_year',value=.055*4380*CLINIC_TARIFF,basis='D current hospital tariff S plus A hours',source_id='tarifforder')]
    dump('problem_metrics.csv',problem)
    assumptions=[
      ('FX BDT/USD',123.65,123.65,123.65,'S','BB WAR 2026-10-19; not guaranteed transaction rate'),
      ('Site mean wind m/s',2.5,3.5,4.5,'A','No hub-height time series; utility-height speeds not transferred to roof'),
      ('Mechanical availability',.8,.9,.95,'A','Includes maintenance/curtailment; prototype uptime unmeasured'),
      ('Wind distribution k',1.5,2.,2.5,'A','Only k=2 used in central scenarios; k bounds flagged for later data fitting'),
      ('Price multiplier',.85,1.,1.10,'A','No willingness-to-pay survey'),('Adoption multiplier',.5,1.,1.8,'A','No orders or customer funnel'),
      ('Production cost multiplier',.9,1.,1.25,'A','No comparable RFQs for custom production BOM'),('Annual price/cost escalation',.02,.04,.08,'A','Common nominal escalation; no margin inflation benefit'),
      ('Tax reserve fraction',.20,.25,.30,'A','Entity-specific statutory taxes NOT FOUND; no tax advice'),
      ('Yearly churn',.04,.08,.15,'A','No retention observations'),('Uncollected revenue',.015,.03,.08,'A','No payment histories'),
      ('Lease BDT/month',1000,1500,2000,'A','Supplemental access tariff; not an energy-saving price quote'),
      ('Pay-per-use BDT/h',20,30,40,'A','Metered delivery and collection untested'),('Paid hours scheduled/month',60,120,180,'A','Actual billable hours multiplied by energy-service fraction'),
      ('Installation fee BDT',2000,3000,5000,'A','Unbundled sold units only'),('AMC fee BDT/year',1000,1800,3000,'A','After warranty; separate sold units only'),
      ('Grid benchmark BDT/kWh',9.05,15.36,20.,'A/S','2026 BERC LT-D1 and LT-E S; future tariff high A; VAT/fixed costs cancel for existing connection'),
      ('Electric field SAE kg/kWh',.8,1.2,1.8,'A','FAO and supplier standard ratings are not field delivery'),
      ('Wind field oxygen correction',.3,.5,.7,'A','No alpha/beta or site water test'),('Wind standard SAE kg/kWh',.4,.8,1.2,'A','Site default base .8, prototype test NOT FOUND'),
      ('Diesel BDT/litre',90,110,140,'A','No verified current pump quote'),('Generator litre/kWh',.3,.4,.6,'A','Part-load sharing; own set at tiny load could be much worse'),
      ('Embodied footprint multiplier',.5,1.,2.,'A','Foreground masses and factors not supplier EPDs'),('Import landed uplift',.15,.35,.65,'A','Freight duties and broker reserve; not a statutory tariff'),
      ('Local lead time weeks',1,3,6,'A','Custom RFQ not received'),('Import lead time weeks',3,6,12,'A','No shipment quote'),
      ('Discount rate nominal',.12,.18,.25,'A','Historical 10 percent BB policy benchmark plus project risk; not observed WACC'),
      ('AMC uptake',.2,.4,.6,'A','No service-contract demand study'),('Customer mechanical annual maintenance share',.02,.04,.08,'A','Service visits can dominate low output'),
      ('Hybrid avoided energy fraction addition',.25,.45,.60,'A','Applied to base wind fraction, capped .85; dispatch model NOT FOUND')]
    dump('assumptions.csv',[dict(parameter=n,low=l,base=b,high=h,basis=t,reason=r) for n,l,b,h,t,r in assumptions])
    payload=dict(date=DATE,fx=FX,fx_date='2026-10-19',scenarios=results,bom=bomsummary,break_even=breaks,wind=WIND,
      comparison=comp,environment=env,price_statistics=ps,investment=inv,opex=OPEX,ramp=RAMP,prices=PRICES,product_mix=MIX,channels=CHANNELS,sensitivity=sens,
      constants=dict(years=YEARS,months=MONTHS,inflation=INFLATION,tax=TAX,lease_monthly=LEASE_MO,use_hourly=USE_HOURLY,use_hours=USE_SCHEDULED_H,installation=INSTALL,amc=AMC_ANNUAL,amc_uptake=AMC_TAKE,fleet_life_months=FLEET_LIFE,discount_rates=RATES))
    (DATA/'results.json').write_text(json.dumps(payload,indent=2,allow_nan=False),encoding='utf-8')
    from supplement import generate
    generate(payload)
    checks=[]
    def check(label,ok):
        checks.append((label,bool(ok)))
        if not ok:raise AssertionError(label)
    check('Three scenario cash flows each contain month 0 plus 120 operating months',len(allmonthly)==3*121)
    for s in SCENARIOS:
        rr=[r for r in allmonthly if r['scenario']==s];aa=results[s]['annual']
        for key in ['revenue','ebitda','net_profit','tax','fcf','fleet_capex','tool_capex','delta_nwc']:
            check(f'{s}: monthly/annual {key} reconciliation',abs(sum(r[key] for r in rr)-sum(r[key] for r in aa))<1e-6)
        check(f'{s}: revenue channels reconcile',all(abs(r['revenue']-sum(r[k] for k in ['sale_revenue','lease_revenue','use_revenue','installation_revenue','maintenance_revenue']))<1e-6 for r in rr))
        check(f'{s}: FCF accounting identity',all(abs(r['fcf']-(r['net_profit']+r['depreciation']-r['fleet_capex']-r['tool_capex']-r['delta_nwc']))<1e-6 for r in rr))
        check(f'{s}: no negative tax credits',all(r['tax']>=0 for r in rr))
        check(f'{s}: terminal working capital released',rr[-1]['nwc']==0)
        check(f'{s}: finite cash flows',all(isfinite(r['fcf']) for r in rr))
        if results[s]['metrics']['irr'] is not None:check(f'{s}: IRR NPV residual',abs(npv([r['fcf'] for r in rr],results[s]['metrics']['irr']))<.01)
    check('Combined BOM duplicates A and B cores',bomsummary[3]['base_bdt']==bom_cost('A')+bom_cost('B'))
    check('Combined component-level totals reconcile',sum(r['base_total_bdt'] for r in bomrows if r['mode']=='A+B')==bom_cost('A+B'))
    check('Product and channel shares total unity',abs(sum(MIX.values())-1)<1e-12 and abs(sum(CHANNELS.values())-1)<1e-12)
    check('Wind probability integrates to unity',all(abs(w['integrated_probability']-1)<1e-4 for w in WIND.values()))
    check('Full-service probability differs from energy displacement',all(0<=w['full_service_fraction']<=w['energy_service_fraction']<=1 for w in WIND.values()))
    check('Zero wind yields no mean shaft power',wind(.1)['mean_shaft_w']<1e-12)
    for k in ['price','adoption']:
        if breaks[k]:check(f'Break-even {k} residual',abs(npv([r['fcf'] for r in run('base',{k:breaks[k]})]))<.1)
    check('Allocated profit reconciles',all(abs(sum(r['allocated_net_profit_bdt'] for r in contributions if r['scenario']==s and r['year']==y)-results[s]['annual'][y]['net_profit'])<1e-6 for s in SCENARIOS for y in [1,5,10]))
    dump('self_checks.csv',[dict(check=l,status='PASS' if ok else 'FAIL') for l,ok in checks])
    print(f'SELF-CHECK PASS: {len(checks)} accounting, scenario, physical-bound and root-residual checks.')
    for row in summary:print(json.dumps(row))
    print('Break-even:',json.dumps(breaks)); print('BOM:',json.dumps(bomsummary))
    print('Generated reproducible CSV and JSON outputs; report must copy these exact values.')

if __name__=='__main__':main()
