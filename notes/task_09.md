# Task 09: Profit by model and consolidated

## Draft

Reconcile sales, direct costs, overhead, depreciation, tax reserve and free cash flow monthly. Allocate fixed costs explicitly for alternative model comparisons; combined rows use a shared overhead pool once. Provider-owned fleet capex is not COGS and its depreciation is not an additional cash payment. Report losses and negative NPV honestly.

Source IDs: rate,tariff.

## Round 1: Source baseline and first market draft

### ATTACK
1. Hostile investor: EBITDA hides replacement and fleet capital. What source and test would falsify the claim?
2. Skeptical judge: Fleet depreciation and capex may be counted twice. What source and test would falsify the claim?
3. Fact-checker: Revenue growth can hide negative working capital cash flow. What source and test would falsify the claim?
4. Hostile investor: Tax losses cannot automatically be refunded. What source and test would falsify the claim?
5. Fact-checker: A consolidated total cannot sum full-overhead standalone alternatives. What source and test would falsify the claim?

### VERIFY
PDF/site read, supplier indications and Bangladesh institutional sources. Evidence artefacts: notes/evidence_round1a.txt; notes/evidence_round1b.txt. Relevant task sources: rate,tariff. Quantitative repair artefacts: data/profit_allocation.csv; data/cashflow_annual.csv.

### REPAIR
Bridge EBITDA to depreciation, tax reserve, fleet capex and NWC.

### SCORE
Evidence 6/10, Numerical correctness 8/10, Realism 7/10, Completeness 7/10.

## Round 2: Counter-evidence and applicability

### ATTACK
1. Hostile investor: EBITDA hides replacement and fleet capital. Does the low-wind/high-cost case change the result?
2. Skeptical judge: Fleet depreciation and capex may be counted twice. Does the low-wind/high-cost case change the result?
3. Fact-checker: Revenue growth can hide negative working capital cash flow. Does the low-wind/high-cost case change the result?
4. Hostile investor: Tax losses cannot automatically be refunded. Does the low-wind/high-cost case change the result?
5. Fact-checker: A consolidated total cannot sum full-overhead standalone alternatives. Does the low-wind/high-cost case change the result?

### VERIFY
Small-wind turbulence, source age/geography, environmental burden boundaries. Evidence artefacts: notes/evidence_round2a.txt; notes/evidence_round2b.txt. Relevant task sources: rate,tariff. Quantitative repair artefacts: data/profit_allocation.csv; data/cashflow_annual.csv.

### REPAIR
Add capitalised fleet installation depreciation; no double cash depreciation.

### SCORE
Evidence 6/10, Numerical correctness 9/10, Realism 8/10, Completeness 8/10.

## Round 3: Independent service and programme checks

### ATTACK
1. Hostile investor: EBITDA hides replacement and fleet capital. Is the source current, local and the same specification?
2. Skeptical judge: Fleet depreciation and capex may be counted twice. Is the source current, local and the same specification?
3. Fact-checker: Revenue growth can hide negative working capital cash flow. Is the source current, local and the same specification?
4. Hostile investor: Tax losses cannot automatically be refunded. Is the source current, local and the same specification?
5. Fact-checker: A consolidated total cannot sum full-overhead standalone alternatives. Is the source current, local and the same specification?

### VERIFY
FAO oxygen methods, fisheries primary tables, grant/lender eligibility, multiple local offers. Evidence artefacts: notes/evidence_round3a.txt; notes/evidence_round3b.txt. Relevant task sources: rate,tariff. Quantitative repair artefacts: data/profit_allocation.csv; data/cashflow_annual.csv.

### REPAIR
Use actual segment direct costs, one shared overhead allocation; show standalone alternatives separately.

### SCORE
Evidence 6/10, Numerical correctness 10/10, Realism 9/10, Completeness 9/10.

## Round 4: Material, tariff and grade repair

### ATTACK
1. Hostile investor: EBITDA hides replacement and fleet capital. Are provider/customer boundaries or cash/noncash costs confused?
2. Skeptical judge: Fleet depreciation and capex may be counted twice. Are provider/customer boundaries or cash/noncash costs confused?
3. Fact-checker: Revenue growth can hide negative working capital cash flow. Are provider/customer boundaries or cash/noncash costs confused?
4. Hostile investor: Tax losses cannot automatically be refunded. Are provider/customer boundaries or cash/noncash costs confused?
5. Fact-checker: A consolidated total cannot sum full-overhead standalone alternatives. Are provider/customer boundaries or cash/noncash costs confused?

### VERIFY
Prusa/recycled-PLA study, production gear specs and evidence of June2026 tariff revision. Evidence artefacts: notes/evidence_round4.txt. Relevant task sources: rate,tariff. Quantitative repair artefacts: data/profit_allocation.csv; data/cashflow_annual.csv.

### REPAIR
Use actual segment direct costs, one shared overhead allocation; show standalone alternatives separately. Rechecked material and source scope; no extrapolated performance credit.

### SCORE
Evidence 6/10, Numerical correctness 10/10, Realism 9/10, Completeness 9/10.

## Round 5: Current-rate and numerical accounting repair

### ATTACK
1. Hostile investor: EBITDA hides replacement and fleet capital. What remains unmeasured after the repair?
2. Skeptical judge: Fleet depreciation and capex may be counted twice. What remains unmeasured after the repair?
3. Fact-checker: Revenue growth can hide negative working capital cash flow. What remains unmeasured after the repair?
4. Hostile investor: Tax losses cannot automatically be refunded. What remains unmeasured after the repair?
5. Fact-checker: A consolidated total cannot sum full-overhead standalone alternatives. What remains unmeasured after the repair?

### VERIFY
Visual official-rate transcription, fleet installation depreciation, actual channel cost allocation, accounting rerun. Evidence artefacts: notes/evidence_round5.txt; notes/tariff2026_extracted.txt; tmp/pdfs/tariff-2.png; tmp/pdfs/tariff-3.png. Relevant task sources: rate,tariff. Quantitative repair artefacts: data/profit_allocation.csv; data/cashflow_annual.csv.

### REPAIR
Use actual segment direct costs, one shared overhead allocation; show standalone alternatives separately. Updated current tariff/price snapshot and reran model/export identities where relevant.

### SCORE
Evidence 6/10, Numerical correctness 10/10, Realism 9/10, Completeness 9/10.

## Round 6: Final adversarial closure and unresolved-evidence audit

### ATTACK
1. Hostile investor: EBITDA hides replacement and fleet capital. Is any favourable number still conditional or index-only?
2. Skeptical judge: Fleet depreciation and capex may be counted twice. Is any favourable number still conditional or index-only?
3. Fact-checker: Revenue growth can hide negative working capital cash flow. Is any favourable number still conditional or index-only?
4. Hostile investor: Tax losses cannot automatically be refunded. Is any favourable number still conditional or index-only?
5. Fact-checker: A consolidated total cannot sum full-overhead standalone alternatives. Is any favourable number still conditional or index-only?

### VERIFY
Targeted final custom gear/HDPE/ZeroWatt performance search did not yield this prototype field tests or production quotes; preserve uncertainty. Evidence artefacts: data/self_checks.csv; data/price_observations.csv; data/report_numbers.csv; notes/wind_recheck.txt. Relevant task sources: rate,tariff. Quantitative repair artefacts: data/profit_allocation.csv; data/cashflow_annual.csv.

### REPAIR
Use actual segment direct costs, one shared overhead allocation; show standalone alternatives separately. Preserve NOT FOUND and the unmet evidence threshold after the maximum passes.

### SCORE
Evidence 6/10, Numerical correctness 10/10, Realism 9/10, Completeness 9/10.

## Final repaired conclusion

Reconcile sales, direct costs, overhead, depreciation, tax reserve and free cash flow monthly. Allocate fixed costs explicitly for alternative model comparisons; combined rows use a shared overhead pool once. Provider-owned fleet capex is not COGS and its depreciation is not an additional cash payment. Report losses and negative NPV honestly.

The model tables cited above provide the reproducible numerical result. Low/base/high scenario assumptions are in data/assumptions.csv and component/process registers; they are not additional sourced observations.

## Remaining limitation
NOT FOUND: task-specific field data, comparable quotes or commercial proof; Evidence <8 after maximum rounds.

## Reproducible repaired numerical register

Exact model-export rows below; display precision is not altered. Source references are IDs in data/sources.csv.

### profit_allocation.csv

```json
[
  {
    "scenario": "base",
    "year": "1",
    "model": "sale",
    "allocation_share": "0.8853491301556438",
    "revenue_bdt": "1140720.0",
    "direct_cost_bdt": "975861.6000000001",
    "allocated_ebitda_bdt": "-1200349.9587000029",
    "allocated_depreciation_bdt": "79681.42171400794",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "-1280031.3804140107",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "1",
    "model": "lease",
    "allocation_share": "0.04294253004134869",
    "revenue_bdt": "55328.91059615734",
    "direct_cost_bdt": "7104.663090296951",
    "allocated_ebitda_bdt": "-17993.13381789929",
    "allocated_depreciation_bdt": "34180.827703721385",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "-52173.96152162067",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "1",
    "model": "pay_per_use",
    "allocation_share": "0.024278922116098042",
    "revenue_bdt": "31281.955437632292",
    "direct_cost_bdt": "3552.3315451484755",
    "allocated_ebitda_bdt": "-9708.474010539365",
    "allocated_depreciation_bdt": "17343.102990448824",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "-27051.57700098819",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "1",
    "model": "installation",
    "allocation_share": "0.04742941768690948",
    "revenue_bdt": "61110.0",
    "direct_cost_bdt": "37800.0",
    "allocated_ebitda_bdt": "-49826.16207321442",
    "allocated_depreciation_bdt": "4268.647591821853",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "-54094.80966503627",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "1",
    "model": "maintenance",
    "allocation_share": "0.0",
    "revenue_bdt": "0.0",
    "direct_cost_bdt": "0.0",
    "allocated_ebitda_bdt": "0.0",
    "allocated_depreciation_bdt": "0.0",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "0.0",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "5",
    "model": "sale",
    "allocation_share": "0.7251079803801125",
    "revenue_bdt": "5337924.226252801",
    "direct_cost_bdt": "4566480.184541184",
    "allocated_ebitda_bdt": "-850523.2832906442",
    "allocated_depreciation_bdt": "65259.71823421012",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "-915783.0015248543",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "5",
    "model": "lease",
    "allocation_share": "0.14308220838873795",
    "revenue_bdt": "1053307.9309148144",
    "direct_cost_bdt": "135252.94278986333",
    "allocated_ebitda_bdt": "597999.6679862314",
    "allocated_depreciation_bdt": "618045.5146308262",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "-20045.8466445948",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "5",
    "model": "pay_per_use",
    "allocation_share": "0.08089606714659178",
    "revenue_bdt": "595521.0648819512",
    "direct_cost_bdt": "67626.47139493166",
    "allocated_ebitda_bdt": "346941.1614696556",
    "allocated_depreciation_bdt": "309864.7039811131",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "37076.45748854248",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "5",
    "model": "installation",
    "allocation_share": "0.03884507037750602",
    "revenue_bdt": "285960.22640640003",
    "direct_cost_bdt": "176882.61427200004",
    "allocated_ebitda_bdt": "22186.505437850326",
    "allocated_depreciation_bdt": "3496.0563339755417",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "18690.449103874784",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "5",
    "model": "maintenance",
    "allocation_share": "0.012068673707051725",
    "revenue_bdt": "88844.23768973112",
    "direct_cost_bdt": "45795.99880913975",
    "allocated_ebitda_bdt": "16052.267330684692",
    "allocated_depreciation_bdt": "1086.1806336346551",
    "allocated_tax_bdt": "0.0",
    "allocated_net_profit_bdt": "14966.086697050037",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "10",
    "model": "sale",
    "allocation_share": "0.657359959532627",
    "revenue_bdt": "14612402.255988926",
    "direct_cost_bdt": "12500598.08311677",
    "allocated_ebitda_bdt": "-542834.9934168938",
    "allocated_depreciation_bdt": "71980.10124182256",
    "allocated_tax_bdt": "81194.00598975732",
    "allocated_net_profit_bdt": "-696009.1006484737",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "10",
    "model": "lease",
    "allocation_share": "0.18479931666047592",
    "revenue_bdt": "4107889.311656077",
    "direct_cost_bdt": "527484.9849217025",
    "allocated_ebitda_bdt": "2834122.937373295",
    "allocated_depreciation_bdt": "2422305.6983379745",
    "allocated_tax_bdt": "22825.541176103547",
    "allocated_net_profit_bdt": "388991.69785921695",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "10",
    "model": "pay_per_use",
    "allocation_share": "0.10448215817716455",
    "revenue_bdt": "2322525.5839191615",
    "direct_cost_bdt": "263742.49246085127",
    "allocated_ebitda_bdt": "1636849.2251596856",
    "allocated_depreciation_bdt": "1212475.8679346181",
    "allocated_tax_bdt": "12905.144059718796",
    "allocated_net_profit_bdt": "411468.2131653486",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "10",
    "model": "installation",
    "allocation_share": "0.0352157121178193",
    "revenue_bdt": "782807.2637136923",
    "direct_cost_bdt": "484210.67858578917",
    "allocated_ebitda_bdt": "156383.77264813267",
    "allocated_depreciation_bdt": "3856.0768522404937",
    "allocated_tax_bdt": "4349.678892308427",
    "allocated_net_profit_bdt": "148178.01690358375",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  },
  {
    "scenario": "base",
    "year": "10",
    "model": "maintenance",
    "allocation_share": "0.018142853511913175",
    "revenue_bdt": "403296.04768755054",
    "direct_cost_bdt": "207884.56066368584",
    "allocated_ebitda_bdt": "122144.5823051585",
    "allocated_depreciation_bdt": "1986.619984477848",
    "allocated_tax_bdt": "2240.919811673521",
    "allocated_net_profit_bdt": "117917.04250900714",
    "basis": "D actual channel direct cost; revenue-share fixed overhead/tools/tax; fleet depreciation by deployment share"
  }
]
```
