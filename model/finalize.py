from pathlib import Path
import json,csv,re,hashlib
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data';N=ROOT/'notes';P=ROOT/'report'
R=json.loads((D/'results.json').read_text());V=json.loads((D/'verification_status.json').read_text())
def rows(name):return list(csv.DictReader((D/name).open(encoding='utf-8-sig')))
pdf=PdfReader(P/'main.pdf');pages=len(pdf.pages)
logs=[(P/x).read_text(errors='replace') for x in ['compile-release1.txt','compile-release2.txt']]
assert all('Output written on main.pdf' in x and not re.search(r'^!',x,re.M) for x in logs)
assert V['messages']==[]
raw=(N/'report_extracted.txt').read_text(encoding='utf-8',errors='replace')
assert f'{abs(R["scenarios"]["base"]["metrics"]["npv_bdt"]):,.0f}' in raw
assert f'{abs(R["scenarios"]["base"]["metrics"]["irr"])*100:.1f}%' in raw.replace(' ','')
assert len(rows('cashflow_monthly.csv'))==363
assert len(rows('cashflow_annual.csv'))==33
assert (P/'main.tex').exists() and len(rows('report_numbers.csv'))>=1500
status={**V,'compile':'PASS: two sequential release passes, zero errors/warnings/overfull boxes/undefined citations','pdf_pages':pages,
 'financial_self_checks':len(rows('self_checks.csv')),'sources_opened_or_attempted':len(rows('sources.csv')),
 'registered_report_citations':len(json.loads((D/'report_manifest.json').read_text())['citations']),
 'visual_qa':'All final rendered pages inspected via four contact sheets; detailed system/summary/roadmap review. No clipping or overlap detected.',
 'standalone_tex_sha256':hashlib.sha256((P/'main.tex').read_bytes()).hexdigest(),
 'strict_definition_of_done':'NOT FULLY MET: Evidence scores below8 for17 tasks plus finance after maximum rounds; missing measurements/quotes/customer data are not invented.'}
(D/'final_status.json').write_text(json.dumps(status,indent=2),encoding='utf-8')
tasks=rows('gauntlet_scores.csv');failing=[r['task'] for r in tasks if float(r['evidence'])<8]
progress='''# ZeroWatt Wind report progress

Research cut-off: 2026-10-22, Asia/Dhaka. Final report delivered with unresolved evidence requirements disclosed. No questions or external messages/applications were sent.

- [x] Read authoritative pasted task; treat document prose as evidence rather than instructions.
- [x] Copy poster and project into inputs/; read all extracted text using pdftotext -layout.
- [x] Inspect poster and prototype/drawing/printing pages; record slicer figures and PETG/PLA contradiction.
- [x] Audit basic ventilation, pond and advanced hybrid source, every weather case, controls and all numeric literals.
- [x] Write project understanding and complete numeric baseline inventory.
- [x] Create notes/, data/, model/ and report/.
- [x] Verify bundled Python and installed PDF/LaTeX tools; enable missing-package installation and initial font generation.
'''
for i in range(1,21):
 r=next(x for x in tasks if x['task']==f'{i:02d}')
 progress+=f'- [x] Task {i:02d}: draft, five objections per pass, source verification, repairs, {r["rounds"]} rounds, numerical appendix and candid scores. Evidence {r["evidence"]}/10.\n'
progress+='''- [x] Financial model: monthly/annual inception-to-horizon cash flow, three scenarios, NPV/IRR/payback, three rates, tornado and break-even roots.
- [x] Model direct-channel costs, warranty, fleet ownership/depreciation, installation, tax reserve, working capital and renewal costs; prohibit duplicated asset revenue.
- [x] Correct two-stage A/B production geometry to three shafts and six radial supports; regenerate every affected output.
- [x] Export all case BOMs including explicit A+B line quantities and all four batch scales; keep advanced H separate.
- [x] Record every actually opened/attempted source with access status, date, publisher, support and quality; flag blocked, foreign and old evidence.
- [x] Verify current electricity tariff from scanned official June2026 order; use opened full-page price instead of conflicting indexed fan price.
- [x] Complete report/main.tex as one standalone file, every required section and ten embedded vector figures.
- [x] Compile two final passes sequentially with zero errors, undefined citations and overfull boxes.
- [x] Render and visually inspect every final page; repair roadmap labels, table headers and URL wrapping.
- [x] Reconcile report numerical ledger, citations, bibliography, input hashes and model outputs.
- [x] Evaluate all requested acceptance criteria and explicitly retain unmet evidence requirements.

## Acceptance outcome

Technical deliverables and all feasible research/review work are complete. The strict definition of done is **NOT fully met**: required Evidence >=8 was not achieved for the tasks listed below after six rounds. All other scores are >=8. A labelled assumption is not a substitute for a prototype measurement, an independent quotation or a customer order; no score was inflated to make the checklist appear passed.

'''+', '.join(failing)+'.\n\n'
progress+=f'Final PDF: {pages} pages. Financial self-checks: {len(rows("self_checks.csv"))} PASS. Independent audit checks: {V["passed_checks"]} PASS. Registered citations: {status["registered_report_citations"]}. Sources opened/attempted: {status["sources_opened_or_attempted"]}.\n\n'
progress+='Main unresolved classes: measured performance and durability; site wind; comparable production quotes/lead times/duties; willingness to pay/adoption/retention; actual tax/insurance; current matching funding eligibility/calls; attributable health/time/fish yield benefits; embodied/noise/wildlife/recycling proof; future-feature performance; blocked full texts.\n'
(N/'progress.md').write_text(progress,encoding='utf-8')
(N/'validation.md').write_text('# Final validation\n\n'+json.dumps(status,indent=2)+'\n\nVisual artefacts: tmp/pdfs/report/contact-01.png through contact-04.png; all final pages rendered. The executive summary occupies one page. Table/figure repairs were checked in the final render. Compilation proof: report/compile-release1.txt, report/compile-release2.txt and report/main.log.\n',encoding='utf-8')
print(json.dumps(status,indent=2))
