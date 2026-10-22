"""Generate a standalone LaTeX report by copying the exact CSV/model values.
Run finance.py and audit_site.cjs first. No external graphics or data are needed
to compile the resulting main.tex. Rounding for display is logged explicitly.
"""
import csv,json,re,hashlib
from pathlib import Path
from research_tasks import TASKS
ROOT=Path(__file__).resolve().parents[1];DATA=ROOT/'data'; REPORT=ROOT/'report'
REPORT.mkdir(exist_ok=True)
def read(name):
 return list(csv.DictReader((DATA/name).open(encoding='utf-8-sig')))
def num(v):return float(v) if v not in ('',None) else None
R=json.loads((DATA/'results.json').read_text())
S=json.loads((DATA/'site_baseline.json').read_text())
# Repair the append-only source register if additions precede its header.
raw=list(csv.reader((DATA/'sources.csv').open(encoding='utf-8-sig')))
hi=next(i for i,r in enumerate(raw) if r and r[0]=='id')
if hi:
 raw=[raw[hi]]+raw[:hi]+raw[hi+1:]
 with (DATA/'sources.csv').open('w',newline='',encoding='utf-8-sig') as f:csv.writer(f).writerows(raw)
sources={r['id']:r for r in read('sources.csv')}
def esc(s):
 return ''.join({'&':r'\&','%':r'\%','$':r'\$','#':r'\#','_':r'\_','{':r'\{','}':r'\}','~':r'\textasciitilde{}','^':r'\textasciicircum{}','\\':r'\textbackslash{}'}.get(c,c) for c in str(s)).replace('−','-').replace('–','-').replace('—','-')
ledger=[];used=set()
def cite(ids):
 ids=ids.split(';') if isinstance(ids,str) else ids
 ids=[i for i in ids if i]
 for i in ids:
  if i not in sources:raise ValueError('Citation not registered: '+i)
 used.update(ids)
 return r'\cite{'+','.join(ids)+'}'
def n(v,basis='D',where='',d=0,tag=False,pct=False):
 if v in ('',None):return 'Not reached' if 'payback' in where.lower() else 'N/A'
 v=float(v);display=v*100 if pct else v
 formatted=f'{display:.{d}f}'
 ledger.append(dict(id=len(ledger)+1,raw_value=v,formatted=formatted,percent=pct,basis=basis,origin=where))
 return r'\num{'+formatted+'}'+(r'\%' if pct else '')+(f' [{basis}]' if tag else '')
def m(v,where='',d=0,tag=False):return n(v,'D',where,d,tag)
def p(v,where='',tag=False):return n(v,'D',where,1,tag,True)
def text(s):return esc(s)
parts=[]
def add(s):parts.append(s)
def para(s):add(s+'\n\n')
def sec(title):add(r'\clearpage\section{'+title+'}\n')
def sub(title):add(r'\subsection{'+title+'}\n')
def table(headers,rows,weights=None,size='small'):
 count=len(headers);weights=weights or [1]*count;total=sum(weights)
 specs='@{}'+''.join(r'>{\raggedright\arraybackslash}p{'+f'{.91*w/total:.4f}'+r'\linewidth}' for w in weights)+'@{}'
 h=' & '.join(r'\textbf{'+x+'}' for x in headers)+r' \\ \midrule'
 add('{\\'+size+'\n'+r'\setlength{\tabcolsep}{3pt}\renewcommand{\arraystretch}{1.18}'+'\n'+r'\begin{longtable}{'+specs+'}\n'+r'\toprule '+h+'\n'+r'\endfirsthead\toprule '+h+'\n'+r'\endhead\bottomrule\endfoot'+'\n')
 for row in rows:
  assert len(row)==count,(headers,row)
  add(' & '.join(re.sub(r'(?<!\\)&',r'\\&',str(x)) for x in row)+r' \\'+'\n')
 add(r'\end{longtable}}'+'\n')
def coords(pairs,origin='chart'):
 for x,y in pairs:
  ledger.append(dict(id=len(ledger)+1,raw_value=float(y),formatted=f'{float(y):.8f}',percent=False,basis='D',origin=origin))
 return ' '.join(f'({float(x):.8f},{float(y):.8f})' for x,y in pairs)
def chart(plots,opts,caption):
 add(r'\begin{figure}[htbp]\centering\begin{tikzpicture}\begin{axis}[width=.92\linewidth,height=6.6cm,'+opts+r']'+'\n')
 for style,pairs,label in plots:
  add(r'\addplot['+style+'] coordinates {'+coords(pairs,caption)+r'};'+'\n')
  if label:add(r'\addlegendentry{'+label+'}\n')
 add(r'\end{axis}\end{tikzpicture}\caption{'+caption+r'}\end{figure}'+'\n')

PRE=r'''\documentclass[11pt,a4paper]{article}
\PassOptionsToPackage{hyphens}{url}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{tikz,pgfplots,booktabs,longtable,tabularx,siunitx,hyperref,geometry,xcolor,fancyhdr,caption,amsmath}
\usetikzlibrary{arrows.meta,positioning,calc}
\pgfplotsset{compat=1.18,every axis/.append style={tick label style={font=\small},label style={font=\small},legend style={font=\footnotesize,draw=none},grid=major,grid style={gray!15}}}
\geometry{margin=22mm,headheight=15pt}
\definecolor{ink}{HTML}{173D3D}\definecolor{teal}{HTML}{267C78}\definecolor{gold}{HTML}{C18B2E}\definecolor{red}{HTML}{A84238}
\hypersetup{colorlinks=true,linkcolor=teal,citecolor=teal,urlcolor=teal,pdftitle={ZeroWatt Wind - Evidence and Feasibility}}
\urlstyle{same}\Urlmuskip=0mu plus 1mu\relax\setlength{\emergencystretch}{3em}\setlength{\parskip}{5pt}\setlength{\parindent}{0pt}
\sisetup{group-separator={,},group-minimum-digits=4,detect-all}
\pagestyle{fancy}\fancyhf{}\fancyhead[L]{\small\textcolor{ink}{ZeroWatt Wind}}\fancyhead[R]{\small Feasibility and business evidence}\fancyfoot[C]{\thepage}
\captionsetup{font=small,labelfont=bf}\setcounter{tocdepth}{1}
\begin{document}
\begin{titlepage}
\vspace*{1.4cm}
{\color{teal}\large RESEARCH AND INVESTMENT SCREENING}\par\vspace{.5cm}
{\Huge\bfseries\color{ink}ZeroWatt Wind}\par\vspace{.5cm}
{\LARGE Evidence-backed feasibility\\and business report}\par\vspace{1cm}
\rule{\linewidth}{1pt}\par
Wind-driven mechanical ventilation and supplemental pond aeration in Bangladesh\par\vspace{.6cm}
{\large Decision: fund a gated validation pilot; commercial rollout is not yet supported.}\par\vspace{1cm}
Prepared for renewable-energy judges, investors and university evaluators.\par
Research cut-off: 22 October 2026 (Asia/Dhaka).\par
Baseline: supplied project submission, poster and audited repository source.\par\vfill
\textbf{Reading the evidence.} [S] is an attributed observation or published value; [D] is a reproducible calculation; [A] is an explicit scenario assumption. A source that describes a prototype does not validate its output. Low, base and high allowances are not supplier quotations. Values marked NOT FOUND remain unresolved. All figures are vector drawings embedded in this single file.\par
\end{titlepage}
'''
add(PRE)
base=R['scenarios']['base']['metrics']
add(r'\section*{Executive summary}\addcontentsline{toc}{section}{Executive summary}'+'\n')
para(r'\textbf{Verdict.} The printed prototype demonstrates a mechanical idea, while the poster expressly leaves airflow, starting wind speed, torque, drivetrain loss and oxygen transfer unmeasured. '+cite('poster;project')+r' The business should purchase evidence before purchasing scale. A limited, supervised supplemental-use pilot is defensible; a claim of guaranteed clinical ventilation or fish-survival protection is not.')
table(['Base case headline','Result','Basis'],[
 ('Project NPV, nominal BDT',m(base['npv_bdt'],'scenario_results base npv',0),'[D] monthly FCF, assumed required return'),
 ('Project NPV, USD equivalent',m(base['npv_usd'],'scenario_results base USD',0),'[D] dated conversion'),
 ('Annual effective project IRR',p(base['irr'],'scenario_results base IRR'),'[D] negative; unique bracketed root'),
 ('Simple / discounted payback','Not reached within model horizon','[D] cumulative cash flow remains negative'),
 ('Initial investment / peak cumulative funding need',m(base['initial_investment_bdt'],'base initial')+' / '+m(base['peak_funding_need_bdt'],'base peak funding'),'[D] no grant or exit-value rescue'),
 ('Basic A / pond B / combined A+B ex-works BOM',' / '.join(m(x['base_bdt'],'bom_summary '+x['mode']) for x in [R['bom'][0],R['bom'][1],R['bom'][3]]),'[D] from [A] production allowances')],[3,3,3])
para('The base screening assumes a site mean wind of '+n(R['wind']['base']['mean_wind_ms'],'A','wind mean',1,True)+' m/s. It predicts full additional-flow performance for '+p(R['wind']['base']['full_service_fraction'],'full service',True)+' of time after mechanical availability, distinct from an energy displacement fraction of '+p(R['wind']['base']['energy_service_fraction'],'energy fraction',True)+'. These probabilities come from an assumed distribution, not a Bangladesh rooftop measurement.')
para('The NPV discount rate is '+n(.18,'A','discount rate',0,True,True)+', tested alongside '+n(.12,'A','discount low',0,True,True)+' and '+n(.25,'A','discount high',0,True,True)+'. The historical Bangladesh Bank policy benchmark was '+n(.10,'S','rate policy',0,True,True)+'; the project risk premium is an analyst assumption. '+cite('rate'))
para('Commercial tariffs, willingness to pay, adoption, component quotations and durability remain weakly evidenced. The optimistic scenario is conditional and profitable; it is not a probability-weighted forecast. Currency: '+n(R['fx'],'S','fx WAR',2,True)+' BDT/USD, Bangladesh Bank weighted average dated '+esc(R['fx_date'])+', accessed '+esc(R['date'])+'. '+cite('fx'))
add(r'\clearpage\tableofcontents'+'\n')

sec('Problem sizing and the addressable need')
para('Poor indoor air and pond oxygen matter, but their national consequences must not be attributed wholesale to this device. World Bank estimates combine outdoor and household pollution, unsafe water, sanitation and lead; they are not a ventilation-only loss estimate. '+cite('wb'))
pm={r['metric']:r for r in read('problem_metrics.csv')}
table(['Evidence / boundary','Value','Basis'],[
 ('National pond area',n(pm['pond_area_ha']['value'],'S','problem pond area')+' ha','[S] DoF, reporting period 2023-24 '+cite('dof')),
 ('Number of ponds',n(pm['pond_count']['value'],'S','problem pond count'),'[S] DoF table on culture intensity; not paying customers '+cite('dof')),
 ('Annual pond fish production',n(pm['pond_production_tonnes']['value'],'S','problem pond tonnes')+' tonnes','[S] DoF '+cite('dof')),
 ('National combined pollution burden','Over '+n(pm['pollution_deaths_all_causes']['value'],'S','WB deaths')+' premature deaths; '+n(pm['pollution_illness_days']['value'],'S','WB illness days')+' illness days/year','[S] Context only '+cite('wb')),
 ('Household and outdoor air pollution health cost',n(pm['air_pollution_GDP_pct_2019']['value'],'S','WB GDP',2)+r'\% of GDP (2019)','[S] Historical national burden '+cite('wb'))],[3,3,4])
para('The project repeats a claim linking '+n(500,'S','poster cognition claim',0,True)+' ppm additional CO2 with a '+n(15,'S','poster cognition effect',0,True)+r'\% cognitive-performance reduction. The institutional description and primary-study record concern specific observational test endpoints. A general causal productivity loss at this exact percentage was NOT VERIFIED and is excluded from revenue, health savings and NPV. '+cite('poster;harvard;cognition'))
para('FAO describes oxygen depletion and reduced growth in Bangladesh ponds, including warm calm nights and cloudy monsoon conditions. A Bangladesh heatwave report corroborates the mechanism but does not quantify national losses attributable only to low DO. These sources do not establish this prototype prevents fish kills. '+cite('fao;heatnews'))
sub('A site-level loss exposure, not an avoided-loss promise')
para('An illustrative '+n(1000,'A','assumed fish stock',0,True)+' kg stock at '+n(200,'A','fish price reserve',0,True)+' BDT/kg and a '+n(.10,'A','loss fraction',0,True,True)+' event loss exposes '+m(pm['site_base_stock_exposure_bdt']['value'],'stock exposure',0,True)+' BDT. Low/high loss fractions are '+n(.02,'A','loss low',0,True,True)+' / '+n(.30,'A','loss high',0,True,True)+'. The event probability and avoidable fraction are NOT FOUND; no expected-value benefit is booked. Time spent manually splashing, fetching fuel or servicing the unit is likewise NOT FOUND; travel/labour allowances are in OPEX.')
para('Using the illustrative room duty, clinic electricity costs '+m(pm['clinic_baseline_electric_bdt_year']['value'],'clinic baseline electricity',0,True)+' BDT/year before fixed fees and taxes. This modest energy bill constrains an energy-only product price. Load-shedding coincidence with useful wind is NOT FOUND. Neither a mortality-reduction total nor a fish-yield uplift is fabricated.')

sec('Solution, engineering boundary and simulation audit')
para('The mechanical core captures wind with a spiral rotor and transmits rotation through shafts and bevel gears to either a fan or paddles. The combined physical case in this report is a separate roof installation plus a separate pond installation; their energy is not counted twice. The advanced website adds PV, battery, motor, controls and freewheels; it is not an electricity-free extension. '+cite('poster;project;site'))
add(r'''\begin{figure}[htbp]\centering
\begin{tikzpicture}[node distance=7mm and 10mm,box/.style={draw=teal,rounded corners,fill=teal!5,align=center,text width=30mm,minimum height=11mm,font=\small},>=Latex]
\node[box] (wind) {Ambient wind};\node[box,right=of wind] (rotor) {Spiral rotor\\and hub};\node[box,right=of rotor] (drive) {Shafts, bearings\\and bevel gears};
\node[box,above right=7mm and 10mm of drive] (fan) {A: fan, plenum\\and exhaust duct};
\node[box,below right=7mm and 10mm of drive] (pond) {B: paddle wheel,\\floats and mooring};
\draw[->,thick] (wind)--(rotor);\draw[->,thick] (rotor)--(drive);\draw[->,thick] (drive)|-(fan);\draw[->,thick] (drive)|-(pond);
\node[box,below=20mm of rotor] (pv) {Advanced A: PV,\\battery and motor};\draw[->,gold,thick] (pv)-|(drive);
\node[align=center,font=\footnotesize,text width=100mm,below=12mm of pv] {Each deployment also needs guards, a tested fail-safe brake, corrosion protection and site-specific mounting. Fan and pond branches are separate applications.};
\end{tikzpicture}\caption{System pathways [S] project concept, with [A] production protection and advanced assistance boundary.}\end{figure}
''')
sub('What the code computes')
para(r'For the basic geometry, $P_s=\min(\tfrac12\rho A v^3C_p\eta_d,P_r)$ above the assumed starting speed; $Q=P_s\eta_f\,3600/\Delta p$. The room model is a perfectly mixed equilibrium CO2 balance. The pond model applies standard oxygen transfer, a temperature/saturation correction, background reaeration and constant oxygen demand. It does not integrate a whole-night oxygen budget. '+cite('site'))
defaults=S['defaults'];ad=S['advancedDefaults']
table(['Parameter','Basic / pond default','Advanced default','Basis'],[
 ('Swept rotor size',n(defaults['diameter'],'A','site diameter',1)+' m diameter',n(3.46,'A','advanced area',2)+r' m$^2$ area','[A] Different geometries'),
 ('Power coefficient / drivetrain efficiency',n(defaults['cp'],'A','cp',2)+' / '+n(defaults['drive'],'A','drive',2),n(.23,'A','hybrid Cp',2)+' / '+n(ad['transmissionEfficiency'],'A','hybrid drive',2),'[A] Untested coefficients'),
 ('Fan model',n(defaults['pressure'],'A','pressure')+' Pa; '+n(defaults['fanEfficiency'],'A','fan eff',2)+' efficiency',n(ad['fanRatedW'],'A','fan power')+' W at '+n(ad['targetRPM'],'A','fan RPM')+' RPM','[A] Not a certified curve'),
 ('Room / pond volume',n(defaults['room'],'A','room')+r' / '+n(defaults['pond'],'A','pond')+r' m$^3$','Same scene; separate model','[A] Default sizes'),
 ('CO2 / DO targets',n(defaults['co2Target'],'A','co2 target')+' ppm / '+n(defaults['doTarget'],'A','DO target')+' mg/L','No clinical certification','[A] Demo targets'),
 ('Pond standard SAE / demand',n(defaults['sae'],'A','sae',2)+' kg/kWh; '+n(defaults['oxygenDemand'],'A','DO demand',2)+' mg/L/h','Not implemented','[A] Transfer model'),
 ('PV / battery / motor','None for uninstrumented core',n(ad['pvWatts'],'A','PV')+' W / '+n(ad['batteryWh'],'A','battery')+' Wh / '+n(ad['motorMaxW'],'A','motor max')+' W input','[A] Site concept'),
 ('Battery lock / recovery','No battery',n(ad['lowSOC'],'A','lock')+r'\% / '+n(ad['recoverSOC'],'A','recover')+r'\%','[A] Control thresholds'),
 ('Assistance on/off / verification','No motor',n(ad['assistOn'],'A','assistOn',2)+' / '+n(ad['assistOff'],'A','assistOff',2)+' target; '+n(ad['verifySeconds'],'A','verifyseconds',1)+' s','[A] Hysteresis')],[2.4,3.1,3.1,2.2])
sub('Every weather case and operating demonstration')
case_rows=[]
limitations={'breeze':'Steady illustrative operation; no measured power curve.','canyon':'Shelter/lulls; no urban turbulence or fatigue validation.','heat':'Heat exposure warnings; no refrigeration or humidity guarantee.','rain':'Rain effects and optional damper; not waterproof certification.','storm':'Display continues spinning; no automatic safe cut-out.','lull':'Repeating lull is synthetic, not a weather time series.','night':'Pre-dawn oxygen risk; no survival or transient DO proof.'}
for mode,cases in S['scenarios'].items():
 for c in cases:
  case_rows.append(('Basic A' if mode=='air' else 'Pond B',esc(c['name']),n(c['p']['wind'],'A','site preset '+mode+c['id'],1)+' m/s; '+esc(c['p']['profile']),esc(limitations[c['id']]),'[A] '+cite('site')))
table(['Mode','Case','Wind / pattern','What it does not establish','Basis'],case_rows,[1.2,1.8,2,3.7,1.1])
table(['Advanced control / state','Demonstration','Limit','Basis'],[
 ('Sunny / sun position','PV drives or charges while the illustrated tracker follows sun position.','No measured tracking gain, shading or thermal model.','[A] '+cite('site')),
 ('Canyon','Sheltered wind with solar assistance.','No site-specific solar/wind joint distribution.','[A]'),
 ('Monsoon','PV and motor assistance are disabled by policy.','Physical PV is not inherently zero in every overcast condition.','[A]'),
 ('Adequate / weak / no wind','Wind-only, shared torque, or motor-driven fan through freewheels.','No clutch durability or measured torque curve.','[A]'),
 ('Low battery / night','Hysteretic motor lockout; battery drains with no PV at night.','Short autonomy; no guaranteed night service.','[A]'),
 ('Injected fault / wind-only','Motor inhibited, mechanical wind path remains.','No certified functional-safety system.','[A]'),
 ('Pause / speed / section / explode / tour','Presentation and inspection controls; exploded flow paths hidden.','No fabrication geometry or independent engineering proof.','[A]'),
 ('Moving / moored pond boats','Changes visual mounting and unit count.','No mooring loads, navigation, capsize or hydrodynamic validation.','[A]')],[2.2,3.5,3.5,1])
para('Wind profile selectors include steady, gusts, repeating lull and storm. Hardware choices cover cup/ultrasonic or Hall wind sensing; MQ-135, MH-Z19B, SCD41 or industrial CO2; analog/galvanic/optical DO; rain and water-temperature probes; ATtiny, Uno, Pico, ESP32 or STM32; and open, IP54 or IP67 enclosures. The code applies temperature, ingress and power assumptions. Sensor ratings are not verified datasheets. Electronics require an external power supply, and warnings do not replace a mechanical brake. A complete literal/parameter inventory is retained in the repository audit. '+cite('site'))
em={r['metric']:r for r in read('engineering_metrics.csv')}
para('At the basic rooftop breeze preset, the code gives '+m(em['basic_default_shaft_4_5ms']['value'],'engineering basic shaft',2,True)+' W and '+m(em['basic_default_airflow_4_5ms']['value'],'engineering airflow',1,True)+r' m$^3$/h, or '+m(em['basic_default_ACH_4_5ms']['value'],'engineering ACH',2,True)+' added ACH. These are calculated examples, not measurements. The advanced rated-flow assumption yields '+m(em['advanced_target_ACH']['value'],'engineering hybrid ACH',2,True)+' added ACH. The illustrative battery from its default charge to lockout supplies only '+m(em['advanced_battery_autonomy_72_to_12']['value'],'engineering autonomy',2,True)+' hours at nominal motor demand without wind, PV or parasitic loads.')
para('Older naturally ventilated clinic guidance discussed in the clinic study implies '+m(em['clinic_older_guidance_flow_8people']['value'],'clinic guidance flow',0,True)+r' m$^3$/h for the default occupancy. The financial example below targets a smaller incremental flow; it cannot be represented as compliance with that guidance. Real intake pollution, thermal comfort, filtration pressure loss and room mixing require assessment. '+cite('clinic;whoweb'))

sec('Components, market evidence and production costs')
para('The baseline prototype uses PLA, but a production candidate uses supported metal shafts/gears, protected structure and inspectable floats. Proposed dimensions and quantities are design assumptions pending stress, thermal and water tests. Catalogue gear selection depends on module, ratio, material, bore and permitted loads; a cheap model gear is not an equivalent part. '+cite('project;khk;windguide'))
sub('Observed prices and the three-quote test')
obs=read('price_observations.csv')
table(['Family / supplier','Visible price','BDT / USD','Caveat and basis'],[
 (esc(x['component_family']+' / '+x['supplier']),n(x['price'],'S','price_observations '+x['supplier'],2)+' '+esc(x['currency']),m(x['bdt'],'converted price',2)+' / '+m(x['usd'],'converted USD',2),esc(x['status'])+'; [S] indication, [D] FX '+cite(x['source_id'])) for x in obs],[3,1.6,2.2,3.5],size='footnotesize')
para('Prices were observed on '+esc(DATE if 'DATE' in globals() else R['date'])+'. Listings without publication dates are undated; stock and cached prices can differ. The Walton full page displayed a lower price than its indexed result; the opened full-page price is used. Foreign prices are not landed Bangladesh quotes. MISUMI and the hobby-gear price remain index-only and low-confidence. The low battery listing is an outlier and is excluded from the warranted production battery allowance.')
table(['Family','Seller count','Low / median / high BDT','Basis / limitation'],[(esc(x['component_family']),n(x['independent_sellers'],'D','price seller count'), ' / '.join(m(x[k],'price_statistics '+x['component_family'],2) for k in ['low_bdt','median_bdt','high_bdt']),esc(x['limitation'])+'; [D] indication summary') for x in read('price_statistics.csv')],[2.5,1,3.2,3.6])
para('Only filament has multiple independent, broadly comparable local price observations. Generic and branded bearing grades differ. Three current, independent production quotations for each bespoke component are NOT FOUND. The BOM low/base/high columns below are allowances [A], not a substituted quotation median. Supplier statements about oxygen output also differ internally; they are not accepted as field SAE. '+cite('banglaaer;faoaer'))
sub('Costed production BOM for each application')
for mode in ['A','B','A+B','H']:
 sub({'A':'A: basic rooftop ventilation','B':'B: pond aeration','A+B':'Combined A+B: two separate installed assemblies','H':'H: advanced hybrid ventilation'}[mode])
 rows=[x for x in read('components.csv') if x['mode']==mode]
 table(['Component, material/specification','Qty','Low / base / high BDT','Function / basis'],[(esc(x['name']+'. '+x['specification']),n(x['quantity'],'A','BOM '+mode+x['component']), ' / '.join(n(x[k],'A','BOM '+mode+x['component']) for k in ['low_total_bdt','base_total_bdt','high_total_bdt']),esc(x['function'])+'; [A], production quotes NOT FOUND') for x in rows],[4.2,.6,2.9,2.4],size='footnotesize')
table(['Case','Low BDT','Base BDT','High BDT','Base USD / basis'],[(esc(x['mode']),m(x['low_bdt'],'bom low'),m(x['base_bdt'],'bom base'),m(x['high_bdt'],'bom high'),m(x['base_usd'],'bom usd',2)+'; [D] from [A] BOM') for x in R['bom']],[1,1.5,1.5,1.5,3])
para('Ex-works totals include assembly/balancing/inspection. Sold-unit on-site installation is a separate fee and direct cost; pond access and difficult roofs may exceed that allowance. Optional monitoring is excluded from the uninstrumented core and costed in future scope. Two-site A+B duplicates rotors, shafts, gears, bearings, brakes and frames. No electrical generation revenue is assumed.')
breakdown=[]
for i,x in enumerate([x for x in read('components.csv') if x['mode']=='A']):breakdown.append((i+1,float(x['base_total_bdt'])/1000))
chart([('ybar,fill=teal,draw=teal',breakdown,'')],r'ylabel={Base cost, thousand BDT},xlabel={Component index in A BOM},xtick=data,bar width=8pt',r'Base A cost breakdown [D] from [A] component allowances. Indices follow the BOM order; custom rotor, structure and safety costs matter alongside gears.')

sec('Sustainable fabrication and build-versus-assemble')
para('A low-cost process should preserve predictable failure behaviour and repair access. Print patterns and noncritical covers; fabricate balanced rotor sections and structural steel locally; purchase matched bearings and rated drive parts. Recycled aluminium needs traceable alloy and fatigue checks. Recovered HDPE requires contamination and leak inspection. Bamboo is a replaceable noncritical jig/support candidate rather than an assumed structural roof anchor. Material choices require field tests, and neither PLA nor PETG is assumed to harmlessly degrade in a pond. '+cite('materials;asa;recycle;khk'))
table(['Method / process','Low / base / high BDT','Tooling / boundary','Basis'],[(esc(x['method']+'. '+x['process']), ' / '.join(n(x[k],'A','fabrication '+x['method']) for k in ['low_bdt','base_bdt','high_bdt']),esc(x['tooling_and_caveat']),'[A] Alternative process budgets; overlap BOM') for x in read('fabrication_methods.csv')],[4,2.5,3.4,1.5])
para('Recycled-polymer research found altered properties and greater variability after reprocessing. It supports coupon testing rather than a blanket claim of equal lifetime. Supplier material guidance supports screening for outdoor UV/temperature suitability; it is not structural qualification for this application. These sources are foreign, and the recycling paper exceeds the age threshold. '+cite('recycle;materials;asa'))
sub('Batch economics')
para(r'Per-unit cost is $C(q)=V+F/q$ and the crossover is $q^*=\lceil(F_{make}-F_{assemble})/(V_{assemble}-V_{make})\rceil$. Here ``make'' means locally fabricate the custom rotor/frame while still buying precision drive elements. Making bearing balls or cutting all gears in-house is not assumed economical. Setup, variable savings, scale capability and rejects are assumptions; crossover is not a sales forecast.')
build=read('build_vs_assemble.csv')
table(['Mode','Batch units','Make BDT/unit','Assemble BDT/unit','Crossover / basis'],[(x['mode'],n(x['quantity'],'A','batch quantity'),m(x['build_unit_bdt'],'build unit',0),m(x['assemble_unit_bdt'],'assemble unit',0),m(x['break_even_quantity'],'crossover')+' units; [D] from [A] setup/rates') for x in build],[.6,1,1.8,1.8,3])
plotrows=[x for x in build if x['mode']=='A']
chart([('teal,thick,mark=*',[(float(x['quantity']),float(x['build_unit_bdt'])/1000) for x in plotrows],'Local fabrication'),('gold,thick,mark=square*',[(float(x['quantity']),float(x['assemble_unit_bdt'])/1000) for x in plotrows],'Outsourced assembly')],r'xmode=log,log basis x=10,xlabel={Batch size, units},ylabel={Thousand BDT per unit},legend pos=north east',r'Build versus assemble for A [D] from [A] setup/variable allowances. Precision parts remain purchased in both options.')

sec('Equivalent-service comparison and customer affordability')
para('The cost test holds the useful service boundary explicit. Basic ventilation supplies '+n(300,'A','comparison flow',0,True)+r' m$^3$/h of added flow to a '+n(150,'A','comparison room',0,True)+r' m$^3$ room for '+n(4380,'A','comparison hours',0,True)+' h/year; the conventional fan draw is '+n(55,'S','fan nameplate',0,True)+' W, but the required pressure-flow duty is unmeasured. The pond example needs '+m(em['pond_demand_100m3']['value'],'pond demand',3,True)+' kg O2/h continuously. Electric field SAE '+n(1.2,'A','electric field SAE',1,True)+' kg/kWh and wind field correction '+n(.5,'A','oxygen field correction',1,True)+' remain assumptions. '+cite('fanweb;faoaer;site'))
para('FAO historical foreign tests show example paddlewheel specific oxygen transfer from '+n(.91,'S','FAO SAE low',2,True)+' to '+n(1.41,'S','FAO SAE high',2,True)+' kg/kWh under their stated conditions; modern supplier nameplates differ. Neither is a clean substitute for a measured field oxygen-transfer curve. The commercial aerator used as a capex reference is larger than the small example demand; energy is duty-normalised, with mixing and start/stop feasibility unresolved. A smaller conventional unit could be cheaper, further weakening the wind case. '+cite('faoaer;aerator1;banglaaer'))
para('Wind-only systems have an unmet-service fraction. Equal-service costs therefore retain the conventional machine for backup and charge wind equipment maintenance and replacements on top. The cost of the existing grid connection is common to both alternatives. These totals assume available backup power; outage resilience still needs a generator/battery dispatch and simultaneous-weather assessment. Wind/PV substitution is not a guaranteed hourly service.')
comp=[x for x in read('customer_comparison.csv') if x['scenario']=='base']
table(['Base case','Electric, BDT','Wind + backup, BDT','Diesel-fed, BDT','Basis'],[(x['mode'],m(x['ten_year_electric_bdt'],'customer electric'),m(x['ten_year_wind_backup_bdt'],'customer wind'),m(x['ten_year_diesel_bdt'],'customer diesel'),'[D] undiscounted horizon totals from [A/S]') for x in comp],[.7,1.8,2,1.8,2.5])
para('The verified commercial flat tariff is '+n(15.36,'S','tariff LT E',2,True)+' BDT/kWh and clinic LT-D1 is '+n(9.05,'S','tariff LT D1',2,True)+' BDT/kWh under the June revision. The scanned official order and correction were inspected visually. Future tariffs are not forecast. VAT and fixed demand charges are not credited as avoidable energy savings on an existing connection. '+cite('tarifforder;tariffpage'))
curves=[x for x in read('customer_cumulative_cost.csv') if x['scenario']=='base' and x['mode']=='A']
chart([('teal,thick',[(float(x['year']),float(x['electric'])/1000) for x in curves],'Electric'),('gold,thick',[(float(x['year']),float(x['wind_backup'])/1000) for x in curves],'Wind + backup'),('red,dashed,thick',[(float(x['year']),float(x['diesel'])/1000) for x in curves],'Generator-fed electric')],r'xlabel={Year},ylabel={Cumulative thousand BDT},legend pos=north west',r'Equal-service cumulative ventilation cost [D] using [A/S] inputs. Generator sharing/fuel assumptions are weak; wind operation alone has unmet demand.')
sub('Basic A versus advanced H, and ventilation versus aeration')
table(['Criterion','Basic A','Advanced H','Pond B / basis'],[
 ('Principal service','Room air exchange','Wind/PV/battery room air exchange','Supplemental oxygen/mixing; [S/A] concepts'),
 ('Failure during calm','Fan backup required','Limited battery; backup still required','Dangerous pre-dawn DO gap; [A] risk'),
 ('Environmental controls','Intake pollution, rain and pressure','Electrical protection and battery replacement','Corrosion, leaks, mooring, aquatic fragments; [A]'),
 ('Market entry','Supervised noncritical test room','More capital and service skills','Noncritical ornamental pond before stocked aquaculture; [A] judgement'),
 ('Health/yield value','Not monetised','Not monetised','Not monetised; measurements NOT FOUND'),
 ('Wind dependency','Rooftop turbulence','Solar can assist subject to weather/storage','Pond-height shelter and correlated night lulls; [A]')],[1.7,2.7,2.7,3.2])
table(['Case','Wind energy fraction','Annual net energy saving, BDT','Incremental payback','Basis'],[(x['mode'],p(x['wind_energy_fraction'],'customer wind fraction'),m(x['annual_net_saving_bdt'],'customer net saving',1),m(x['incremental_payback_years'],'customer payback',1) if x['incremental_payback_years'] else 'No finite / beyond decision horizon','[D] after wind maintenance, before health/yield value') for x in comp],[.7,1.5,2.5,2.4,3])
table(['Case / denominator','Electric cost','Wind + backup cost','Basis'],[(x['mode']+(' / BDT per field kg O2' if x['mode']=='B' else ' / BDT per added ACH-hour'),m(x['cost_per_service_electric'],'servicecost electric',3),m(x['cost_per_service_wind'],'servicecost wind',3),'[D] total cost / total service, same room volume or oxygen demand') for x in comp],[3.6,1.6,1.6,3])
para('This is an unsubsidised customer comparison. The additional-flow target is not a full clinic safety specification. Producer profit can coexist with poor customer economics if tariffs are set above avoided energy cost; the report does not call that affordability. Subsidies or sponsor purchases may fund demonstration value, but are not evidence of a sustainable mass-market saving.')

sec('Wind resource, performance availability and market boundary')
para('The national NREL campaign establishes a credible measurement/model framework, not a power curve for this prototype. The EU study indexed appendix reports Chandpur at '+n(4.11,'S','EU indexed wind',2,True)+' m/s at '+n(60,'S','EU measurement height',0,True)+' m, based on the older campaign. Full access to that PDF was blocked, so this contextual number is low-confidence and not used as a rooftop input. Roof turbulence and pond-height shelter need local measurement. '+cite('windrepo;euwind;windguide'))
para(r'The screening uses a Weibull wind distribution with shape $k=2$ [A], $c=\overline v/\Gamma(1+1/k)$ [D], an assumed cut-in and a real-operation cut-out absent from the display model. Numerical integration evaluates both the probability of meeting required shaft power and $E[\min(P_s/P_{needed},1)]$. Mechanical availability multiplies both. A capacity factor relative to the displayed rating is a separate quantity. These are illustrative scenario integrals, not bankable wind-resource forecasts.')
wr=read('wind_resource.csv')
table(['Scenario','Mean wind m/s','Full service time','Energy fraction','Rated CF','Basis'],[(esc(x['scenario']),n(x['mean_wind_ms'],'A','wind input',1),p(x['full_service_fraction'],'wind full'),p(x['energy_service_fraction'],'wind displaced'),p(x['capacity_factor_250w'],'wind CF'),'[D] from [A] distribution, coefficients and uptime') for x in wr],[1.7,1.1,1.3,1.3,1.1,3])
para('The required wind threshold for the airflow example is '+m(R['wind']['base']['threshold_ms'],'threshold',2,True)+' m/s under the assumed geometry and losses. The fraction of time real hardware delivers this output remains NOT FOUND. Published high-tower data cannot supply a measured rooftop/pond availability percentage. The simple annual hybrid energy allowance is separate from the website battery simulation and does not prove hourly adequacy.')
table(['Serviceable-market search funnel','Low / base / high sites','Basis'],[(esc(x['segment']),' / '.join(n(x[k],'A','market funnel') for k in ['low_sites','base_sites','high_sites']),'[A] No local qualification or willingness-to-pay survey') for x in read('market_assumptions.csv')],[4.5,2.7,3])
para('National fisheries area and pond count are broad context. A qualified site must pass wind, access, safety, maintenance and payment checks. First customers should be a university demonstration facility, a sponsor-funded community test room or a municipal ornamental-pond pilot. No clinical provider, farmer or sponsor has supplied a purchase commitment in this task. Adoption is a scenario, not a percentage inferred from national hectares.')

sec('Investment, OPEX, revenue and profit')
sub('Prototype-to-market investment')
inv=read('investment.csv')
table(['Investment item','Low BDT','Base BDT','High BDT','Treatment / basis'],[(esc(x['item']),n(x['low_bdt'],'A','investment low') if x['low_bdt'] else '--',n(x['base_bdt'],'A','investment base') if x['base_bdt'] else '--',n(x['high_bdt'],'A','investment high') if x['high_bdt'] else '--',esc(x['treatment'])+'; [A] lines, [D] total') for x in inv],[3.3,1.3,1.3,1.3,2.3])
para('Totals include an explicitly budgeted contingency and working capital. Prelaunch engineering, pilots, tests, legal/launch and contingency are cash outflows at inception; tools are capitalised, working capital is an asset released at the horizon. Post-launch fleet growth and later tool renewal can raise the financing need far above the initial budget. No government grant is included in project FCF.')
sub('Fixed OPEX, monthly and annual')
table(['Item','Low / base / high monthly BDT','Base annual BDT','Basis'],[(esc(x['item']), ' / '.join(n(x[k],'A','OPEX '+x['item']) for k in ['low_monthly_bdt','base_monthly_bdt','high_monthly_bdt']),m(x['base_annual_bdt'],'OPEX annual'),'[A] paid resources; no assumption of permanently free labour') for x in read('opex.csv')],[3.3,3,1.9,2.2])
para('Manufacturing direct cost, sold-unit installation, warranty reserve, provider-fleet service and maintenance-contract delivery are variable costs outside this fixed pool. The base fixed pool escalates with costs and adds a capacity allowance as the calendar ramp grows. Extra headcount required for very high break-even volumes is not validated. Insurance, roof liability and audited tax treatment require quotations/advice. Tax is an explicit profit reserve, with no refund for losses.')
sub('Proposed commercial models and tariffs')
para('No sale, lease, pay-per-use, installation or maintenance business model was found in the supplied PDFs or current source. The following are analyst-proposed models requested for appraisal. Competitor prices anchor the opportunity cost but do not substantiate ZeroWatt willingness to pay. '+cite('project;poster;site;fanweb;aerator1'))
table(['Model','Base tariff / transaction','Customer and billing boundary','Basis'],[
 ('Hardware sale','A '+n(R['prices']['A'],'A','sale price A')+'; B '+n(R['prices']['B'],'A','sale price B')+'; H '+n(R['prices']['H'],'A','sale price H')+' BDT','Site owner buys unit; installation unbundled; warranty cost retained','[A] unvalidated WTP'),
 ('Lease',n(R['constants']['lease_monthly'],'A','lease rate')+' BDT/unit/month','Provider owns fleet; supplemental access, no guaranteed critical service','[A] includes fleet service'),
 ('Pay-per-use',n(R['constants']['use_hourly'],'A','use tariff')+' BDT/delivered hour','Scheduled '+n(R['constants']['use_hours'],'A','use schedule')+' h/month times wind energy-service fraction; metering/collection untested','[A] provider owns fleet'),
 ('Installation',n(R['constants']['installation'],'A','install tariff')+' BDT/sold unit','Separate charge only on sold units; no duplicate leased-asset billing','[A] direct labour allowance'),
 ('Maintenance contract',n(R['constants']['amc'],'A','AMC rate')+' BDT/year','Eligible sold units after warranty; assumed uptake '+n(.4,'A','AMC fraction',0,False,True),'[A] not also billed to lease/use fleet')],[1.7,2.8,4.5,1.4])
para('Combined deployments allocate '+n(.70,'A','sale channel',0,True,True)+' to sale, '+n(.20,'A','lease channel',0,True,True)+' to lease and '+n(.10,'A','use channel',0,True,True)+' to metered use. Product mix is '+n(.60,'A','A product share',0,True,True)+' A, '+n(.30,'A','B product share',0,True,True)+' B and '+n(.10,'A','H product share',0,True,True)+' H. These are mutually exclusive asset channels. Installation and post-warranty service attach only under the stated rules. Assets are not sold and leased simultaneously.')
table(['Year','New base deployments','Conservative','Optimistic','Basis'],[(m(i+1,'ramp year'),n(v,'A','base new units'),m(v*.5,'conservative ramp'),m(v*1.8,'optimistic ramp'),'[A] ramp; [D] scenario scaling') for i,v in enumerate(R['ramp'])],[.8,2.2,1.8,1.8,3])
para('Expected deployments can be fractional in monthly/scenario outputs; actual orders must be integers. New units are spread uniformly across months and are not front-loaded to improve NPV. Cohort churn, collection loss and useful fleet life limit recurring revenue. There is no terminal enterprise multiple or unproven licence revenue.')
sub('Monthly and annual consolidated results')
ann=[x for x in read('cashflow_annual.csv') if x['scenario']=='base']
table(['Year','Revenue BDT','EBITDA BDT','Depreciation','Tax reserve','Net profit BDT','Basis'],[(m(x['year'],'year'),m(x['revenue'],'annual revenue'),m(x['ebitda'],'annual ebitda'),m(x['depreciation'],'annual depreciation'),m(x['tax'],'annual tax'),m(x['net_profit'],'annual net'),'[D]') for x in ann],[.5,1.5,1.5,1.3,1.1,1.5,.6],size='footnotesize')
table(['Year','Average monthly revenue','Average monthly EBITDA','Average monthly net profit','Average monthly FCF','Basis'],[(m(x['year'],'year'),m(x['average_monthly_revenue'],'monthly revenue'),m(x['average_monthly_ebitda'],'monthly ebitda'),m(x['average_monthly_net_profit'],'monthly net'),m(x['average_monthly_fcf'],'monthly FCF'),'[D] annual / months') for x in ann[1:]],[.6,1.8,1.8,1.8,1.8,1.2],size='footnotesize')
para('Average monthly rows are annual results divided by operating months; they do not claim every month has equal revenue. The repository includes the full inception-to-horizon monthly schedule for all scenarios, so fleet, working-capital and renewal timing can be inspected.')
sub('Revenue and profit by model')
rev=[x for x in read('revenue_by_model.csv') if x['scenario']=='base']
table(['Year / business model','Annual revenue BDT','Average monthly BDT','Basis'],[(x['year']+' / '+esc(x['model']),m(x['annual_revenue_bdt'],'model annual revenue'),m(x['average_monthly_revenue_bdt'],'model monthly revenue'),'[D] from [A] tariffs, cohort and collection inputs') for x in rev],[3,2,2,3])
prof=[x for x in read('profit_allocation.csv') if x['scenario']=='base' and x['year'] in ('1','5','10')]
table(['Year / model','EBITDA annual','Net annual','EBITDA / net monthly','Basis'],[(x['year']+' / '+esc(x['model']),m(x['allocated_ebitda_bdt'],'channel EBITDA'),m(x['allocated_net_profit_bdt'],'channel net'),m(float(x['allocated_ebitda_bdt'])/12,'channel EBITDA monthly')+' / '+m(float(x['allocated_net_profit_bdt'])/12,'channel net monthly'),'[D] allocation below') for x in prof],[2.3,1.7,1.7,2.6,1.5],size='footnotesize')
para('Direct costs follow each actual channel. Shared overhead, tools and consolidated tax are allocated by revenue; provider-fleet depreciation follows lease/use deployment shares. These rows reconcile to the combined company but do not prove independent viability of installation or AMC. Separate sale-plus-installation/service, all-lease and all-use alternatives each carry the full overhead and launch budget; they must not be summed.')
sol=[x for x in read('standalone_annual.csv') if x['scenario']=='base' and x['year'] in ('1','5','10')]
table(['Standalone alternative / year','Annual revenue','Annual EBITDA','Annual net profit','Basis'],[(esc(x['business_model'])+' / '+x['year'],m(x['revenue'],'standalone revenue'),m(x['ebitda'],'standalone EBITDA'),m(x['net_profit'],'standalone net'),'[D] full common overhead per alternative') for x in sol],[2.7,1.9,1.9,1.9,2.1])
plot=[]
for ci,ch in enumerate(['sale','lease','pay_per_use','installation','maintenance']):
 vals=[x for x in rev if x['model']==ch]
 plot.append((['teal','gold','red','gray','blue'][ci]+',thick,mark=*',[(float(x['year']),float(x['annual_revenue_bdt'])/1e6) for x in vals],esc(ch.replace('_',' '))))
chart(plot,r'xlabel={Year},ylabel={Annual revenue, million BDT},legend pos=north west',r'Base revenue by proposed model [D] from [A] tariffs and demand. Sales, leases and use have distinct asset cohorts; no double billing.')

sec('Cash flow, NPV, IRR and payback')
para(r'The model computes $FCF=NetProfit+Depreciation-FleetCapex-ToolCapex-\Delta NWC$ and $NPV=\sum_{m=0}^{M}FCF_m/(1+r)^{m/12}$. The IRR is an annual effective rate solving the same monthly timing equation. Annual summaries are sums of monthly cash flow, not a claim of identical year-end timing. A negative IRR is meaningful when a unique root exists; no root is reported as undefined. Payback is a durable interpolated crossing that subsequent capital outlays do not reverse.')
table(['Scenario','NPV BDT / USD','IRR','Simple / discounted payback years','Peak funding BDT','Basis'],[(esc(s),m(v['metrics']['npv_bdt'],'NPV '+s)+' / '+m(v['metrics']['npv_usd'],'NPV USD '+s),p(v['metrics']['irr'],'IRR '+s) if v['metrics']['irr'] is not None else 'Undefined; no root', (m(v['metrics']['simple_payback_years'],'simple payback '+s,2) if v['metrics']['simple_payback_years'] is not None else 'Not reached')+' / '+(m(v['metrics']['discounted_payback_years'],'discount payback '+s,2) if v['metrics']['discounted_payback_years'] is not None else 'Not reached'),m(v['metrics']['peak_funding_need_bdt'],'peak '+s),'[D], [A/S] inputs') for s,v in R['scenarios'].items()],[1.5,2.5,1.3,2.4,1.8,1.2],size='footnotesize')
table(['Base year','FCF BDT','Fleet capex','Tool capex','Change in working capital','Basis'],[(m(x['year'],'FCF year'),m(x['fcf'],'annual FCF'),m(x['fleet_capex'],'fleetcapex'),m(x['tool_capex'],'toolcapex'),m(x['delta_nwc'],'deltaNWC'),'[D] monthly sum') for x in ann],[1,2,2,2,2.3,1.3])
plots=[]
for i,(sc,v) in enumerate(R['scenarios'].items()):
 total=0;pairs=[]
 for row in v['annual']:total+=row['fcf'];pairs.append((row['year'],total/1e6))
 plots.append((['red','teal','gold'][i]+',thick,mark=*',pairs,esc(sc)))
pb=R['scenarios']['optimistic']['metrics']['simple_payback_years']
plots.append(('only marks,mark=star,mark size=4pt,black',[(pb,0)],'Optimistic monthly payback'))
chart(plots,r'xlabel={Year},ylabel={Cumulative FCF, million BDT},legend pos=south west',r'Cumulative company cash flow [D]. The star marks optimistic monthly interpolated payback; the base and conservative cases do not recover within the horizon. Lines join annual snapshots.')
chart([('ybar,fill=teal,draw=teal',[(i+1,v['metrics']['npv_bdt']/1e6) for i,(s,v) in enumerate(R['scenarios'].items())],'')],r'xtick={1,2,3},xticklabels={Conservative,Base,Optimistic},ylabel={NPV, million BDT},bar width=25pt',r'Scenario NPV [D] at the assumed base discount rate; positive optimistic results are conditional, not a tuned base forecast.')
table(['Scenario','Nominal discount rate','NPV BDT','Basis'],[(esc(x['scenario']),n(x['discount_rate'],'A','rate sensitivity',0,False,True),m(x['npv_bdt'],'NPV rate'),'[D] monthly discounting') for x in read('npv_rates.csv')],[2,2,3,3])
para('The base and conservative cases fail the required return. The optimistic case assumes more adoption, higher price, cheaper components and stronger wind simultaneously; no probabilities are attached. The initial financing mix below funds only a validation budget and cannot fund the full base-case burn without repeated additional capital. Continuing the base plan would be a financing decision, not evidence that it is feasible.')

sec('Sensitivity and break-even conditions')
sen=read('sensitivity.csv')
table(['Input','Low / high setting','NPV at low','NPV at high','Basis'],[(esc(x['parameter']),esc(x['low_input']+' / '+x['high_input']),m(x['low_npv_bdt'],'tornado low'),m(x['high_npv_bdt'],'tornado high'),'[D] one at a time; [A] ranges') for x in sen],[2.1,2.6,2,2,2])
plots=[]
for style,key,label in [('xbar,fill=teal,draw=teal','low_delta_bdt','Low input'),('xbar,fill=gold,draw=gold','high_delta_bdt','High input')]:
 plots.append((style,[(float(x[key])/1e6,i+1) for i,x in enumerate(sen)],label))
chart(plots,r'xlabel={Change from base NPV, million BDT},ytick={1,2,3,4,5},yticklabels={Price,Adoption,Wind availability,Component cost,Discount rate},bar width=7pt,legend pos=south east',r'Tornado sensitivity [D]. Low/high describe the input, not necessarily the financial outcome. Wind variation affects metered-use hours; sale and supplemental-access lease prices are fixed.')
be=R['break_even']
para('Within the model, uniformly scaling all tariffs by '+m(be['price'],'price breakeven multiplier',3,True)+' makes project NPV zero; the corresponding hardware weighted price is '+m(be['weighted_price_bdt'],'break even weighted price',0,True)+' BDT. This is a portfolio tariff condition, not a hardware-only price recommendation. Holding tariff and assumed cost capacity fixed, adoption would need '+m(be['adoption'],'adoption break even',2,True)+' times the base ramp, including '+m(be['year1_units'],'firstyear break even units',1,True)+' expected first-year deployments. That scale is outside the validated staffing/customer envelope and is not a credible sales forecast.')
para('Wind does not directly create sales or guarantee lease uptime in the proposed contracts. Accordingly the financial wind tornado is modest because it changes metered-use revenue only. A severe low-wind reality could also impair adoption, retention, warranty and liability; the one-at-a-time chart does not quantify those interactions. Capacity factor, full-service probability and billable equivalent hours are not used interchangeably.')

sec('Funding strategy and stage gates')
para('Pursue non-dilutive pilot support and university facilities first, while keeping project viability separate from fundraising. Government programme amounts are ceilings/indications, not awarded money. No message or application has been sent to any organisation. Probabilities below are subjective low/base/high planning assumptions; published approval probabilities were NOT FOUND.')
fund=read('funding_routes.csv')
table(['Route / eligibility','Amount low / base / high BDT','Cost and timing months','Success low / base / high','Basis / limitation'],[(esc(x['route']+'. '+x['eligibility']), ' / '.join(n(x[k],'A','funding request '+x['route']) for k in ['amount_low_bdt','amount_base_bdt','amount_high_bdt']),esc(x['cost'])+'; '+ ' / '.join(n(x[k],'A','funding timing') for k in ['months_low','months_base','months_high']), ' / '.join(n(x[k],'A','subjective funding chance',0,False,True) for k in ['probability_low','probability_base','probability_high']),esc(x['basis']+'; '+x['limitation'])+' '+cite(x['source_id'])) for x in fund],[3.5,2.3,3.5,2,3.2],size='scriptsize')
para('iDEA criteria and grant cap were checked in its official SOP; the SME route is via participating lenders. The official Bangladesh Bank listing confirms a green-factory refinance circular, but product-specific eligibility, borrower terms and credit approval remain unresolved. Startup Bangladesh FAQ terms are available in indexed text but full-page access failed. IDCOL solar terms must not be transferred to passive mechanical wind, and GCF support generally requires an accredited or accepted project-specific entity route. Current matching BCCRF/a2i/competition calls were NOT FOUND. '+cite('idea;sme;bbcircular;startup;idcolfees;gcf'))
mix=read('funding_mix.csv')
table(['Pilot funding target','BDT','USD','Share','Basis'],[(esc(x['source']),n(x['bdt'],'A','funding mix'),m(x['usd'],'funding mix USD',0),n(x['share'],'A','funding share',1,False,True),'[A] none committed') for x in mix],[3,2,2,1.5,2.7])
chart([('ybar,fill=gold,draw=gold',[(i+1,float(x['bdt'])/1000) for i,x in enumerate(mix)],'')],r'xtick={1,2,3,4},xticklabels={Founder,University,CSR,iDEA},ylabel={Pilot target, thousand BDT},bar width=23pt',r'Recommended initial funding targets [A], not expected receipts. In-kind contributions offset the relevant budget item, and must not be counted again as unrestricted cash.')
para('Release funds against gates: first confirm structural safety and a calibrated rotor/load curve; then demonstrate useful airflow or oxygen transfer in supervised conditions; then obtain written customer and supplier commitments. Pause scale spending if a gate fails. Debt should follow evidence of repayment capacity; a lower loan rate cannot turn a structurally negative product value proposition into a sound one.')

sec('Bangladesh sourcing, assembly and import exposure')
table(['Component group','Named source / assembly option','Lead time and landed-cost boundary','Basis'],[
 ('Patterns and filament','TechShopBD, HTE Bangladesh, Costareen, Electronics.Com.BD','Local stock indication; custom printed work requires quote','[S] observed offers '+cite('filament1;filament2;filament3;filament4')),
 ('Gears and supports','ZerOneTech hobby sample; KHK specification catalogue; Motion/MISUMI bearing references','Production-equivalent matched bores and torque ratings require RFQ','[S/A] not interchangeable '+cite('gear;khk;bearing1;bearing2;bearing3')),
 ('Fan and ducts','Walton distributor for conventional comparator; local sheet-metal workshop RFQ','No verified workshop quote for plenum/roof works','[S/A] '+cite('fanweb')),
 ('Wet hardware / floats','NSC BD and Bangla Ltd. as commercial aerator benchmarks','Complete machines show materials; separate float/paddle supply RFQ needed','[S/A] '+cite('aerator1;banglaaer')),
 ('Custom shafts and frames','Candidate Nawabpur/Dholaikhal workshops; IUT facilities for supervised R&D','No named, vetted fabricator quote found; do not imply a purchase agreement','[A] sourcing route'),
 ('Imports','Authorised dealer / freight forwarder; NBR classification','Freight, CD, VAT, advance taxes and broker charges depend on exact HS/SRO','[A] exact current duty NOT FOUND '+cite('customs'))],[2.2,3.6,4,1.6])
para('Assumed local lead time is '+n(1,'A','lead local low',0,True)+' / '+n(3,'A','lead local base',0,True)+' / '+n(6,'A','lead local high',0,True)+' weeks; import lead time '+n(3,'A','lead import low',0,True)+' / '+n(6,'A','lead import base',0,True)+' / '+n(12,'A','lead import high',0,True)+' weeks. A landed uplift reserve of '+n(.15,'A','import low',0,True,True)+' / '+n(.35,'A','import base',0,True,True)+' / '+n(.65,'A','import high',0,True,True)+' is only a stress range. It is not a tariff ruling and is not applied again to BOM allowances already intended as domestic purchase budgets. Classified landed quotes are required before procurement.')
para('Assembly acceptance should record rotor balance, shaft alignment, free play, axial retention, brake stop response, guard fasteners, roof water ingress and float leak/stability checks. Keep serialised service records and replaceable wear parts. Production tooling, inspection time and rejected parts are paid costs, not assumed free university support.')

sec('Future scope with costed evidence gates')
fut=read('future_scope.csv')
table(['Future item / test','Low / base / high BDT','Timing months','Source and decision boundary'],[(esc(x['item']+'. '+x['test']), ' / '.join(n(x[k],'A','future '+x['item']) for k in ['cost_low_bdt','cost_base_bdt','cost_high_bdt']),n(x['start_month'],'A','roadmap start')+'--'+n(x['end_month'],'A','roadmap end'),esc(x['decision'])+'; [A] budget '+cite(x['source_ids'])) for x in fut],[4.3,2.5,1.4,4],size='footnotesize')
para('Each citation supports a method or engineering principle, not an asserted benefit percentage. Spiral-turbine literature concerns other geometries and operating points; no published Cp is copied into a claim about this prototype. Clean-water oxygen-transfer standards and FAO oxygen budgets support testing, while clinic/WHO material supports measurement and intake design. Costs are independent planning alternatives and can overlap the launch test budget; they are not all added to the financial projection. '+cite('spiral;spiral2026;asce;faoaer;clinic;whoweb'))
add(r'\clearpage'+'\n')
sub('Roadmap and staged expansion')
para('The proposed sequence below requires evidence before each expansion step. Test infrastructure, an independent safety review and durability data precede optional monitoring and fleet growth. Costs and dates remain assumptions; an unsuccessful test should delay the next stage rather than trigger automatic deployment.')
add(r'\begin{figure}[htbp]\centering\begin{tikzpicture}[x=.36cm,y=.8cm,font=\small]'+'\n')
roadlabels=['Performance rig','Overspeed safety','Materials trial','Air monitoring','Pond monitoring','Fixed-PV hybrid','Service fleet','Grain study']
for i,x in enumerate(fut):
 y=-i
 add(r'\node[anchor=east,text width=42mm,align=right,font=\footnotesize] at (0,'+str(y)+') {'+roadlabels[i]+r'};'+'\n')
 add(r'\draw[line width=6pt,teal!65] ('+x['start_month']+','+str(y)+')--('+x['end_month']+','+str(y)+r');'+'\n')
add(r'\draw[->] (0,1)--(25,1) node[right]{Months [A]};\foreach \x in {0,6,12,18,24}{\draw (\x,.85)--(\x,1.15) node[above]{\x};}\end{tikzpicture}\caption{Future-scope sequence [A]. Advancement depends on evidence gates, not elapsed time alone.}\end{figure}'+'\n')
para('Solar tracking shown in the site adds moving parts; a fixed-panel pilot should establish whether assistance value justifies the extra cost. More pond units add potential transfer but remain exposed to shared lulls. Grain grinding appears only in a submission sketch and remains deferred until torque, food-contact, guarding and economics are tested. No future-feature revenue is included in NPV.')

sec('Environmental screening and end of life')
para('The mechanical core uses no operating electricity, but it has embodied materials, fabrication, logistics, lubricant and replacement impacts. A transparent screening calculation is preferable to a zero-carbon claim. The DoE published factor is '+n(.62,'S','gridEF',2,True)+' kg CO2/kWh for the stated older fiscal periods, published in its January notice. This historical average factor is not a prediction of future marginal displacement or a verified carbon-credit methodology. '+cite('gef'))
para(r'Gross avoided emissions equal displaced grid kWh times the grid factor. Net screening benefit subtracts assumed embodied emissions. Foreground masses are '+n(15,'A','steel mass',0,True)+' kg steel, '+n(4,'A','aluminium mass',0,True)+' kg aluminium and '+n(3,'A','polymer mass A',0,True)+' kg polymer for A, or '+n(8,'A','polymer mass B',0,True)+' kg for B. Assumed factors are '+n(2,'A','steel factor',1,True)+', '+n(8,'A','aluminium factor',1,True)+' and '+n(3,'A','polymer factor',1,True)+' kgCO2e/kg respectively. These are screening placeholders, not supplier EPDs; bounds span half to double the resulting embodied estimate. Hybrid PV/battery/electronics receive an additional lifecycle reserve, not a complete LCA.')
env=[x for x in read('environment.csv') if x['scenario']=='base']
table(['Case','Embodied low / base / high kgCO2e','Gross avoided over horizon kgCO2','Net screening kgCO2e','Carbon payback years / basis'],[(x['mode'], ' / '.join(n(x[k],'A','embodied band') for k in ['embodied_low_kg','embodied_base_kg','embodied_high_kg']),m(x['ten_year_avoided_kg'],'avoided CO2',1),m(x['ten_year_net_kg'],'net CO2',1),m(x['carbon_payback_years'],'carbon payback',1)+'; [D], not verified LCA') for x in env],[.6,2.5,2.4,2,2.4])
para('Negative net screening values are retained. Metal recovery is plausible in principle, but no supplier take-back or local recycling recovery rate has been verified. The recovery target in the model is a design target only. Keep material labels, demountable joints, drainable housings and captured lubricants. Recover printed fragments and damaged floats; do not permit pond disposal. Batteries require a dedicated recycler/take-back arrangement.')
para('Noise, structure-borne vibration, wildlife strike/entanglement, corrosion products and aquatic disturbance are NOT MEASURED. Small size and a spiral shape do not prove silence or ecological safety. Use guards and setbacks, survey the site, log vibration/noise at occupied locations, and inspect water impacts. Increasing airflow can introduce outdoor PM and moisture; filtration or damper changes can consume the small pressure budget. '+cite('windguide;materials;faoquality'))

sec('Risks, limitations and decision gates')
table(['Risk','Evidence consequence','Action / owner','Basis'],[
 ('Unknown loaded startup and torque','Core performance cannot be certified','Engineering team: measured torque-speed/load curve before commercial claims','NOT FOUND'),
 ('Wind lulls and site turbulence','Neither time availability nor outage coincidence verified','Independent site assessor: hub-height logging and demand/wind joint analysis','[S/A] '+cite('windguide;windrepo')),
 ('Storm and structural safety','Code rotates in storms; no hardware cut-out proof','Qualified engineer: fatigue, anchorage, guarding and fail-safe test','NOT FOUND'),
 ('Critical clinic / stocked pond liability','Energy example is not safe service delivery','Site owner and expert: define service demand, backup and alarm response','[S/A] '+cite('clinic;fao')),
 ('Custom quotations and warranty','BOM bands may miss costs','Procurement: equivalent-spec written RFQs and pilot failure records','NOT FOUND'),
 ('Demand and tariff acceptance','Proposed revenue may not be realisable','Commercial team: paid pilot, competing offers and customer interviews','NOT FOUND'),
 ('Tax, customs and insurance','Scenario reserves may differ from actual cash outlays','Accountant/broker/insurer: current entity and classification-specific advice','NOT FOUND'),
 ('Future-source access and age','Indexed or dated sources limit confidence','Maintain date/access flags and replace with primary full text','[S] source register')],[2.4,3.6,4.1,1.3])
para('Discount-rate sensitivities are not a substitute for modelling correlated failure, supplier escalation or market rejection. The project has no verified production CAD, independent lifetime tests, customer orders or guaranteed grant. All recommendations remain conditional on the explicitly recorded assumptions. A failure to meet an evidence score threshold is reported rather than repaired by raising a self-assigned score.')

sec('Conclusion')
para('ZeroWatt Wind is a credible student mechanical concept with an honest poster boundary, but current evidence does not support commercial-scale claims. The base project NPV is '+m(base['npv_bdt'],'conclusion NPV',0,True)+' BDT and its annual effective IRR is '+p(base['irr'],'conclusion IRR',True)+'; payback is not reached. The appropriate next investment is a gated measurement and durability pilot. Product redesign, substantially lower cost or independently demonstrated non-energy value would be required before broad rollout. No health, fish-yield, resilience or carbon premium should be promised in advance of evidence.')

sec('Assumptions and unresolved-evidence register')
table(['Input','Low','Base','High','Basis / reason'],[(esc(x['parameter']),n(x['low'],x['basis'][0],'assumption low',3),n(x['base'],x['basis'][0],'assumption base',3),n(x['high'],x['basis'][0],'assumption high',3),esc(x['basis']+': '+x['reason'])) for x in read('assumptions.csv')],[3,1.3,1.3,1.3,4],size='footnotesize')
para('Base assumptions are used as written, not selected to produce a positive outcome. Scenario input combinations are neither statistical confidence intervals nor independent probabilities. Ranges without direct evidence are labelled [A] and should be replaced with measured distributions or written quotations before investment.')
missing=[
 ('Measured core performance','Starting wind speed, loaded torque/RPM, Cp, drivetrain loss, airflow/static pressure, field and standard oxygen transfer.'),
 ('Durability and safety','Production stress/fatigue design, safe storm shutdown, anchor/mooring loads, float reserve buoyancy, weathering and service life.'),
 ('Hub-height wind','Bangladesh rooftop/pond distribution, fraction meeting demand, longest lulls and coincidence with outages/pre-dawn DO need.'),
 ('Commercial proof','Current baseline business models/prices in supplied materials, purchase commitments, willingness to pay, retention, collections and market funnel.'),
 ('Component quotations','Three independent comparable production price points for every custom rotor/frame/gear/guard/float/duct and warranted hybrid subsystem.'),
 ('Supplier execution','Verified custom Bangladesh fabricator RFQs, production lead times, landed freight and current HS/SRO tax incidence.'),
 ('Operating/legal costs','Actual insurance, entity-specific tax, minimum/turnover taxes, VAT recoverability, warranty incidence and fleet loss rates.'),
 ('Funding','Programme-specific eligibility, current matching BCCRF/a2i/competition calls, grant success probabilities, committed awards, investor terms and crowdfunding access.'),
 ('Attributable benefits','Local avoided health cost/time, cognitive productivity gain, fish mortality/yield improvement and monetary resilience value.'),
 ('Environmental proof','Supplier EPDs, material masses, recycler recovery rates, audited lifecycle inventory, noise/vibration and wildlife/aquatic impact.'),
 ('Future scope','Measured tracking gain, safe grain-grinding output, validated regional fleet operation and service economics.'),
 ('Blocked source verification','Several official/vendor full texts were blocked or index-only; those records carry explicit access limitations.'),
 ('Gauntlet sufficiency','Evidence-dependent tasks and the financial model may remain below the requested evidence threshold after the maximum rounds; no score is fabricated.')]
table(['NOT FOUND / low-confidence item','Required evidence'],[(esc(a),esc(b)) for a,b in missing],[2.5,7.5])

sec('Gauntlet log summary and reproducibility')
para('The repository preserves a draft, five task-specific objections and successive source/model repairs for each requested task, plus finance. This is one analyst self-review using investor, judge and fact-checker perspectives; it is not an independent expert review. Evidence sufficiency, arithmetic, realism and completeness are scored separately. Transparent assumptions do not turn an evidence gap into a sourced measurement.')
if (DATA/'gauntlet_scores.csv').exists():
 gs=read('gauntlet_scores.csv')
 table(['Task','Passes','Scores E / N / R / C','Remaining limitation / Basis'],[(esc(x['task']),n(x['rounds'],'D','round count'),' / '.join(n(x[k],'A','selfscore') for k in ['evidence','numerical','realism','completeness']),esc(x['limitation'])+' [A] self-assessment') for x in gs],[1,.85,2.8,5.5],size='footnotesize')
para('Reproduction order: run the site audit with Node, run the standard-library Python financial model, then run the report generator. Monetary calculations originate in the model exports; all display rounding and embedded chart data are registered. The standalone TeX uses no external image, bibliography or data file. Source IDs in every citation are checked against the opened-source register. Full monthly/annual tables, assumptions, price observations, BOM, customer comparison, sensitivity and self-check outputs accompany the report.')
checks=read('self_checks.csv')
para('The financial run passes '+n(len(checks),'D','selfcheck count',0,True)+' accounting, physical-bound and root-residual self-checks. Compilation and visual QA are documented separately in the repository; arithmetic tests do not validate commercial assumptions.')
add(r'\clearpage\begin{thebibliography}{99}'+'\n')
for sid in sorted(used):
 s=sources[sid]
 add(r'\bibitem{'+sid+'} '+esc(s['publisher'])+'. '+esc(s['title'])+'. '+esc(s['date_published'])+'. '+r'\url{'+s['URL']+'}. Accessed '+esc(s['date_accessed'])+'. '+esc(s.get('access_status',''))+'. '+esc(s.get('geography',''))+'. '+esc(s.get('age_flag',''))+'.\n')
add(r'\end{thebibliography}\end{document}'+'\n')
out=''.join(parts)
# Check all citations, balanced environments, and single-file/no-raster contract.
citations=set()
for group in re.findall(r'\\cite\{([^}]+)\}',out):citations.update(group.split(','))
assert citations<=set(sources)
assert not re.search(r'\\(?:includegraphics|input|include|bibliography)\s*[\[{]',out)
beg=re.findall(r'\\begin\{([^}]+)\}',out);end=re.findall(r'\\end\{([^}]+)\}',out)
assert sorted(beg)==sorted(end)
(REPORT/'main.tex').write_text(out,encoding='utf-8')
with (DATA/'report_numbers.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.DictWriter(f,fieldnames=list(ledger[0]));w.writeheader();w.writerows(ledger)
(DATA/'report_manifest.json').write_text(json.dumps(dict(citations=sorted(citations),number_entries=len(ledger),sha256=hashlib.sha256(out.encode()).hexdigest(),tables=beg.count('longtable'),figures=beg.count('figure'),standalone=True),indent=2))
print(f'REPORT GENERATED: {len(out)} characters; {beg.count("figure")} vector figures; {beg.count("longtable")} tables; {len(citations)} registered citations; {len(ledger)} number/coordinate entries.')
