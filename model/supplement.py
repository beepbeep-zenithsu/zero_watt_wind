"""Research-to-model numerical registers; all unsupported entries explicitly A."""
import csv,json
from pathlib import Path
from math import pi
ROOT=Path(__file__).resolve().parents[1];DATA=ROOT/'data'
def dump(name,rows):
 with (DATA/name).open('w',newline='',encoding='utf-8-sig') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
def generate(results):
 fx=results['fx']
 # [A] requested amounts and subjective success chances; [S] programme ceilings explicitly separated.
 funding=[
 ('University / incubator','IUT workshop and research support',100000,400000,700000,'Grant or in-kind, no assumed equity',1,3,6,0,.5,.8,'A','No specific award/call verified','University affiliation and supervised test plan','site'),
 ('CSR / sponsor','Bangladeshi bank or manufacturing CSR pilot',200000,700000,1500000,'Restricted pilot grant; reporting and branding',2,4,9,0,.25,.5,'A','Target, not an offer','Instrumented community benefit and safeguarding agreement','wb'),
 ('iDEA / BCC / ICT Division','Pre-seed grant',200000,700000,1000000,'Non-dilutive grant if selected',3,6,12,0,.15,.3,'A/S','S ceiling 1000000, A request/time/chance','Confirm innovative hardware eligibility and current application session','idea'),
 ('Competition','Renewable-energy fest / innovation competition',50000,200000,500000,'Prize; event-specific rules',1,4,12,0,.1,.25,'A','Current prize amount/deadline NOT FOUND','Published call, judged prototype and IP terms','idea'),
 ('Angel / impact VC','Bangladesh Angel Network or impact investor prospect',1000000,3000000,7000000,'A equity dilution 10-30 percent; no valuation evidence',3,6,12,0,.05,.15,'A','No investor commitment or term sheet','Paid pilots, unit margin and defensible product','startup'),
 ('Startup Bangladesh','Government venture capital',2500000,5000000,50000000,'Indexed FAQ: equity/quasi-equity, at most 49 percent; confirm',1,4,9,0,.03,.10,'A/S-index','FAQ indexed terms; full open blocked','Registered company, tax/VAT records and diligence','startup'),
 ('SME Foundation','Partner bank credit wholesaling',50000,1000000,1500000,'Published up to 9 percent; current partner terms required',2,5,9,0,.1,.3,'A/S','S indicative amount/interest; A approval time/chance','Productive enterprise and participating lender underwriting','sme'),
 ('Bank / BB green refinance','Participating lender, green factory or eligible product',500000,1500000,5000000,'A borrower rate 8-16 percent until current offer',3,6,12,0,.05,.2,'A','Programme exists; product eligibility and rate NOT FOUND','Trade licence, accounts, eligible use and repayment capacity','bbcircular'),
 ('IDCOL','Renewable-energy project partner / R&D enquiry',500000,2000000,5000000,'Project lending or R&D route; product-specific offer NOT FOUND',4,9,18,0,.03,.1,'A','Solar terms are not passive-wind eligibility','Project sponsor, technical review and eligible financing window','idcolfees'),
 ('a2i / ICT innovation','Current challenge-fund call enquiry',100000,500000,1000000,'Grant, call-specific',3,6,12,0,.05,.2,'A','Current matching call NOT FOUND','Public service innovation and published eligibility','idea'),
 ('GCF / accredited partner','Partner programme, not direct startup grant',0,0,2000000,'No budgeted receipt; AE/PSAA project route',9,18,36,0,.01,.05,'A','Direct startup allocation NOT FOUND','Accredited entity or accepted project-specific route','gcf'),
 ('BCCRF legacy','No verified open startup window',0,0,0,'Excluded from recommended cash plan',0,0,0,0,0,0,'A','Current actionable call NOT FOUND','Do not assume legacy programme is open','wb'),
 ('Crowdfunding / preorders','Small pilot backers after demonstrated performance',100000,300000,700000,'A 5-15 percent platform/fulfilment reserve, refunds possible',2,4,8,0,.15,.35,'A','Platform access and legal/FX terms NOT FOUND','Evidence, delivery plan and clear refund terms','site')]
 names=['route','target','amount_low_bdt','amount_base_bdt','amount_high_bdt','cost','months_low','months_base','months_high','probability_low','probability_base','probability_high','basis','limitation','eligibility','source_id']
 dump('funding_routes.csv',[dict(zip(names,r)) for r in funding])
 mix=[('Founder cash',440000),('University contribution',400000),('CSR pilot',700000),('iDEA grant target',700000)]
 dump('funding_mix.csv',[dict(source=n,bdt=v,usd=v/fx,share=v/2240000,basis='A proposed, none committed') for n,v in mix])
 future=[
 ('Calibrated performance rig',100000,250000,500000,0,3,'Torque-speed, static-pressure/flow, DO transfer and brake-stop data','Core validated curves; no revenue booked','windguide;asce;clinic;faoaer'),
 ('Structural and overspeed redesign',100000,250000,600000,1,6,'Guard retention, fatigue, anchor uplift and mechanical fail-safe','Independent review before occupied/public installation','windguide;khk'),
 ('Durable and recycled material pilot',50000,150000,350000,2,6,'UV, salt exposure, creep, leaks and recycled-lot coupons','Lower lifecycle cost must exceed rework cost','materials;asa;recycle'),
 ('Monitoring kit per air site',7000,18000,40000,3,6,'Calibrated CO2, anemometer, RPM and enclosure','Optional electrical load; no measured value premium','whoweb;clinic'),
 ('Monitoring kit per pond site',12000,35000,80000,3,6,'DO/temperature logging and reference calibration','Pre-dawn oxygen trend, sensor maintenance required','faoquality;asce'),
 ('Fixed PV hybrid incremental kit',20000,38000,70000,6,12,'Matched module, motor, charge control and battery autonomy','Compare fixed PV against costly tracking; no autonomy guarantee','site;windguide'),
 ('Regional service and modular fleet trial',100000,300000,700000,9,18,'Multiple independently metered assets and response-time records','Separate additive power from correlated wind availability','faoaer;windguide'),
 ('Grain grinding feasibility study',50000,150000,300000,12,24,'Torque requirement, gearing, food-contact and guarding tests','Deferred; not a current business model','project;khk')]
 names=['item','cost_low_bdt','cost_base_bdt','cost_high_bdt','start_month','end_month','test','decision','source_ids']
 dump('future_scope.csv',[dict(**dict(zip(names,r)),basis='A incremental planning allowance, not included in commercial FCF or added twice to launch investment') for r in future])
 methods=[
 ('Printed pattern + formed recycled aluminium rotor',3000,6000,11000,'Print segmented pattern, roll/form sheet, rivet, balance','Shared jigs; alloy and fatigue evidence required'),
 ('Purchased gears / local steel shaft and frame',5000,10000,19000,'Machine/key shaft, weld and coat frame, align purchased bearings','Lathe, welding, alignment jig; paid labour and scrap'),
 ('Recycled PLA / PETG noncritical parts per unit',800,1800,3500,'Dry, filter, print coupons then ducts/covers only','Reuse existing printer; no critical strength inferred'),
 ('Reclaimed HDPE float pair',2400,4400,8000,'Inspect contamination, leak-test compartments, mechanically cradle','No toxic drums, no glued untested seams'),
 ('Bamboo replaceable noncritical fixtures',500,1500,3000,'Dry, treat appropriately, bolt and inspect for rot','No untested roof anchor substitution'),
 ('Recovered metal and polymer take-back per unit',300,700,1500,'Label material, separate fasteners, recover at end of life','Recovery target, recycler agreement NOT FOUND')]
 dump('fabrication_methods.csv',[dict(method=n,low_bdt=l,base_bdt=b,high_bdt=h,process=p,tooling_and_caveat=c,basis='A process-level alternatives, overlap BOM; do not add to BOM') for n,l,b,h,p,c in methods])
 market=[]
 for segment,low,base,high in [('Qualified roof sites in first service territory',100,500,1500),('Qualified supplemental pond sites in first territory',50,250,1000)]:
  market.append(dict(segment=segment,low_sites=low,base_sites=base,high_sites=high,basis='A search funnel, not an official market survey'))
 dump('market_assumptions.csv',market)
 # Calculations used to explain simulation limitations, independent of UI rendering.
 site=json.loads((DATA/'site_baseline.json').read_text(encoding='utf-8'))
 b=site['defaults']; a=site['advancedDefaults']
 derived=[
 ('basic_default_shaft_4_5ms',.5*1.225*pi*b['diameter']**2/4*4.5**3*b['cp']*b['drive'],'W','D','site', 'P=0.5 rho A v^3 Cp eta'),
 ('basic_default_airflow_4_5ms',.5*1.225*pi/4*4.5**3*.18*.75*.35/20*3600,'m3/h','D','site','Q=Pshaft etafan/dp*3600'),
 ('basic_default_ACH_4_5ms',.5*1.225*pi/4*4.5**3*.18*.75*.35/20*3600/150,'ACH','D','site','Q/room'),
 ('advanced_battery_autonomy_72_to_12',a['batteryWh']*(a['soc']-a['lowSOC'])/100/(a['fanRatedW']/a['motorEfficiency']),'hours','D','site','Wh usable / motor W; no PV/wind or parasitic load'),
 ('advanced_target_ACH',a['ratedFlow']/b['room'],'ACH','D','site','850/150, untested fan coefficient'),
 ('clinic_older_guidance_flow_8people',60*8*3.6,'m3/h','D','clinic','Older 60 L/s/person context, not current certification'),
 ('pond_demand_100m3',.25*100/1000,'kg/h','D','site','mg/L/h *m3 =g/h; divide1000'),
 ('commercial_tariff',15.36,'BDT/kWh','S','tarifforder','Scan PDF p3 LT-E flat'),
 ('clinic_tariff',9.05,'BDT/kWh','S','tarifforder','Scan PDF p2 LT-D1'),
 ('fan_nameplate',55,'W','S','fanweb','Nameplate is not delivered pressure-flow'),
 ('cognition_claim_CO2',500,'ppm','S','poster','Project claim; exact generalized effect not accepted'),
 ('cognition_claim_effect',15,'percent','S','poster','Project claim; endpoint/causality NOT verified'),
 ('EU_Chandpur_speed',4.11,'m/s','S-index','euwind','Appendix4,60m,2014-17 indexed extract; full PDF blocked'),
 ('EU_Chandpur_height',60,'m','S-index','euwind','Not rooftop or pond height'),
 ('FAO_example_SAE_low',.91,'kg/kWh','S','faoaer','Historical table7 experiment, foreign'),
 ('FAO_example_SAE_high',1.41,'kg/kWh','S','faoaer','Historical table7 experiment, foreign')]
 dump('engineering_metrics.csv',[dict(metric=n,value=v,unit=u,basis=t,source_id=s,formula=fo) for n,v,u,t,s,fo in derived])
 # No integer rounding of expected deployments; invoiceable actual orders are a later plan.
 print('Supplemental registers exported: funding, future scope, methods, market and engineering metrics.')

if __name__=='__main__':generate(json.loads((DATA/'results.json').read_text()))
