"""Independent numeric/source/LaTeX audit; --prepare before generating final TeX."""
from pathlib import Path
import csv,json,re,sys,math,hashlib
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data';N=ROOT/'notes'
def read(name):return list(csv.DictReader((D/name).open(encoding='utf-8-sig')))
def write(name,rows):
 with (D/name).open('w',newline='',encoding='utf-8-sig') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
def prepare():
 rows=read('sources.csv')
 extra=dict(id='bdstall',title='SG-PW2-1HP two-paddle aerator',publisher='BDStall single seller',URL='https://www.bdstall.com/details/sg-pw2-1hp-2-paddle-wheel-aerator-for-fish-pond-shrimp-farm-172138/',date_published='undated',date_accessed='2026-10-22',what_it_supports='40000 BDT 1HP model; not equivalent to 2HP offers; independence unverified',quality_1_5='2',access_status='opened content',geography='Bangladesh',age_flag='undated')
 if not any(r['id']=='bdstall' for r in rows):rows.append(extra)
 for r in rows:
  dt=r['date_published']
  if re.match(r'2021-\d\d-\d\d',dt) and dt<'2021-10-22':r['age_flag']='OLDER THAN 5 YEARS'
  if any(x in dt for x in ['legacy','1982']):r['age_flag']='OLDER THAN 5 YEARS / legacy underlying evidence'
  if r['id']=='khk':r['geography']='not Bangladesh-specific'
  if r['id']=='filament3' and 'out of stock on final' not in r['what_it_supports']:r['what_it_supports']+='; out of stock on final full-page recheck'
 write('sources.csv',rows)
 # Complete PDF figure baseline including values illegible to plain text extraction.
 visualnote=N/'00_project_understanding.md'
 visualnote.write_text(visualnote.read_text(encoding='utf-8').split('\n## Final visual baseline refinement')[0],encoding='utf-8')
 with visualnote.open('a',encoding='utf-8') as f:
  f.write('\n## Final visual baseline refinement\n\nProject p7 rotor slicing estimate [S]: total filament12.70m /40.02g, model filament9.77m /30.78g, slicer cost1.02 (currency NOT GIVEN), prepare6m14s, model print1h59m and total2h5m. These are software estimates for the small printed part, not measured fabrication costs or full-scale BOM inputs. Left assembly slicing screenshot visibly labels PolyLite PETG, while textual project specs and poster state PLA; retain as a material contradiction pending print-file confirmation. The printed rotor mass is not extrapolated to production. Hand sketch includes a grain-grinding possibility, which is deferred.\n')
 hashes=[]
 for path in ['inputs/project.pdf','inputs/poster.pdf','model.js','app.js','src/advanced/hybrid-model.js','src/advanced/hybrid-ui.js','HYBRID-GUIDE.md']:
  hashes.append(dict(path=path,sha256=hashlib.sha256((ROOT/path).read_bytes()).hexdigest()))
 write('input_hashes.csv',hashes)
 # Embed the actual calculated outputs in each task note, not merely links to them.
 tables={1:['components.csv'],2:['price_statistics.csv','price_observations.csv'],3:['fabrication_methods.csv'],4:['build_vs_assemble.csv'],5:['customer_comparison.csv'],6:['investment.csv'],7:['opex.csv'],8:['revenue_by_model.csv','market_assumptions.csv'],9:['profit_allocation.csv'],10:['funding_routes.csv'],11:['problem_metrics.csv'],12:['engineering_metrics.csv','wind_resource.csv'],13:['customer_comparison.csv'],14:['customer_comparison.csv'],15:['components.csv','bom_summary.csv'],16:['assumptions.csv'],17:['future_scope.csv'],18:['future_scope.csv'],19:['customer_comparison.csv'],20:['environment.csv']}
 for task,files in tables.items():
  p=N/f'task_{task:02d}.md';txt=p.read_text(encoding='utf-8').split('\n## Reproducible repaired numerical register')[0]
  txt+='\n## Reproducible repaired numerical register\n\nExact model-export rows below; display precision is not altered. Source references are IDs in data/sources.csv.\n'
  for filename in files:
   rr=read(filename)
   if task in [5,8,9,12,13,14,19,20]:rr=[r for r in rr if r.get('scenario','base')=='base']
   if task==16:rr=[r for r in rr if 'lead time' in r['parameter'].lower() or 'import' in r['parameter'].lower()]
   txt+='\n### '+filename+'\n\n```json\n'+json.dumps(rr,indent=2)+'\n```\n'
  p.write_text(txt,encoding='utf-8')
 print('Prepared source status/age flags, visual PDF baseline, hashes and numerical task appendices.')
def audit():
 import finance
 R=json.loads((D/'results.json').read_text());checks=[]
 def check(label,ok):
  checks.append(dict(check=label,status='PASS' if ok else 'FAIL'))
  if not ok:raise AssertionError(label)
 rr=read('cashflow_monthly.csv'); aa=read('cashflow_annual.csv')
 for scen in ['base','conservative','optimistic']:
  monthly=[r for r in rr if r['scenario']==scen]
  # Independent expression for the Weibull exceedance: quadrature must agree.
  w=R['wind'][scen];c=w['scale_ms'];v=w['threshold_ms'];uptime=w['mechanical_availability']
  exact=uptime*(math.exp(-(v/c)**2)-math.exp(-(16/c)**2))
  check(scen+': analytic versus quadrature full-performance probability',abs(exact-w['full_service_fraction'])<.001)
  # Independent NPV accumulation using log/exp rather than model's power expression.
  rate=.18;reference=sum(float(r['fcf'])*math.exp(-int(r['month'])/12*math.log1p(rate)) for r in monthly)
  check(scen+': independently recomputed NPV',abs(reference-R['scenarios'][scen]['metrics']['npv_bdt'])<1e-5)
 code=json.loads((D/'site_scenarios.json').read_text())
 for row in code:
  if row['mode']=='air' and row['scenario']=='breeze' and row['time_s']==0:
   power=.5*1.225*(math.pi/4)*4.5**3*.18*.75
   check('Independent Python versus existing JS shaft calculation',abs(power-row['shaft'])<1e-12)
   check('Independent Python versus existing JS airflow calculation',abs(power*.35/20*3600-row['airflow'])<1e-9)
 tex=(ROOT/'report/main.tex').read_text(encoding='utf-8');sources={r['id'] for r in read('sources.csv')}
 citations=set()
 for x in re.findall(r'\\cite\{([^}]+)\}',tex):citations.update(x.split(','))
 check('Every report citation is in actually-opened/attempted source register',citations<=sources)
 biblio=set(re.findall(r'\\bibitem\{([^}]+)\}',tex));check('Every citation has a bibliography item',citations==biblio)
 check('At least ten vector figures',tex.count('\\begin{figure}')>=10)
 check('No external image/data/bibliography dependencies',not re.search(r'\\(?:includegraphics|input|include|bibliography)\s*[\[{]',tex))
 for n in range(1,21):
  txt=(N/f'task_{n:02d}.md').read_text(encoding='utf-8')
  check(f'Task{n:02d}: draft, objections, numerical register and rounds',all(k in txt for k in ['## Draft','### ATTACK','### VERIFY','### REPAIR','### SCORE','## Reproducible repaired numerical register']) and 3<=txt.count('## Round ')<=6)
 numberrows=read('report_numbers.csv')
 check('Every recorded report numerical item has S/D/A basis',all(r['basis'] in ['S','D','A'] for r in numberrows))
 check('Every report displayed number has a reproducibility origin',all(r['origin'] for r in numberrows))
 log=(ROOT/'report/main.log').read_text(encoding='utf-8',errors='replace') if (ROOT/'report/main.log').exists() else ''
 messages=[]
 for line in log.splitlines():
  if line.startswith(('!','Overfull','LaTeX Warning:')) or (line.startswith('Package ') and 'Warning:' in line):messages.append(line)
 write('independent_audit.csv',checks)
 evidence_fail=[r['task'] for r in read('gauntlet_scores.csv') if min(float(r[k]) for k in ['evidence','numerical','realism','completeness'])<8]
 status=dict(passed_checks=len(checks),messages=messages,unmet_evidence_threshold_tasks=evidence_fail,base_case=R['scenarios']['base']['metrics'])
 (D/'verification_status.json').write_text(json.dumps(status,indent=2),encoding='utf-8')
 print(json.dumps(status,indent=2))
if __name__=='__main__':
 if '--prepare' in sys.argv:prepare()
 else:audit()
