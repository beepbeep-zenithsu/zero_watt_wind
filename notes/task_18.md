# Task 18: References for future work

## Draft

Map each future item to the specific test or engineering principle its source supports. Spiral-turbine studies justify a test methodology, not borrowed Cp. DO manuals justify oxygen monitoring; WHO/clinic evidence supports measuring ventilation. Published materials/LCA and small-wind guidance justify durability/siting work. Any exact improvement percentage, component life or cost without a matching source stays an assumption.

Source IDs: spiral,spiral2026,windguide,fao,whoweb,clinic.

## Round 1: Source baseline and first market draft

### ATTACK
1. Hostile investor: A paper on another rotor is not validation of this rotor. What source and test would falsify the claim?
2. Skeptical judge: Simulation-only claims must not be called experimental evidence. What source and test would falsify the claim?
3. Fact-checker: Old guidance may be technologically outdated. What source and test would falsify the claim?
4. Hostile investor: Foreign studies may not transfer to Bangladesh climate. What source and test would falsify the claim?
5. Fact-checker: A bibliography entry does not support every statement nearby. What source and test would falsify the claim?

### VERIFY
PDF/site read, supplier indications and Bangladesh institutional sources. Evidence artefacts: notes/evidence_round1a.txt; notes/evidence_round1b.txt. Relevant task sources: spiral,spiral2026,windguide,fao,whoweb,clinic. Quantitative repair artefacts: data/sources.csv; data/future_scope.csv.

### REPAIR
Map each feature to a relevant source/method rather than borrowed performance.

### SCORE
Evidence 6/10, Numerical correctness 8/10, Realism 7/10, Completeness 7/10.

## Round 2: Counter-evidence and applicability

### ATTACK
1. Hostile investor: A paper on another rotor is not validation of this rotor. Does the low-wind/high-cost case change the result?
2. Skeptical judge: Simulation-only claims must not be called experimental evidence. Does the low-wind/high-cost case change the result?
3. Fact-checker: Old guidance may be technologically outdated. Does the low-wind/high-cost case change the result?
4. Hostile investor: Foreign studies may not transfer to Bangladesh climate. Does the low-wind/high-cost case change the result?
5. Fact-checker: A bibliography entry does not support every statement nearby. Does the low-wind/high-cost case change the result?

### VERIFY
Small-wind turbulence, source age/geography, environmental burden boundaries. Evidence artefacts: notes/evidence_round2a.txt; notes/evidence_round2b.txt. Relevant task sources: spiral,spiral2026,windguide,fao,whoweb,clinic. Quantitative repair artefacts: data/sources.csv; data/future_scope.csv.

### REPAIR
Flag old/foreign studies and blocked full texts.

### SCORE
Evidence 7/10, Numerical correctness 9/10, Realism 8/10, Completeness 8/10.

## Round 3: Independent service and programme checks

### ATTACK
1. Hostile investor: A paper on another rotor is not validation of this rotor. Is the source current, local and the same specification?
2. Skeptical judge: Simulation-only claims must not be called experimental evidence. Is the source current, local and the same specification?
3. Fact-checker: Old guidance may be technologically outdated. Is the source current, local and the same specification?
4. Hostile investor: Foreign studies may not transfer to Bangladesh climate. Is the source current, local and the same specification?
5. Fact-checker: A bibliography entry does not support every statement nearby. Is the source current, local and the same specification?

### VERIFY
FAO oxygen methods, fisheries primary tables, grant/lender eligibility, multiple local offers. Evidence artefacts: notes/evidence_round3a.txt; notes/evidence_round3b.txt. Relevant task sources: spiral,spiral2026,windguide,fao,whoweb,clinic. Quantitative repair artefacts: data/sources.csv; data/future_scope.csv.

### REPAIR
Use primary gear/material/oxygen guidance; no exact uplift or lifetime copied.

### SCORE
Evidence 8/10, Numerical correctness 9/10, Realism 9/10, Completeness 9/10.

## Final repaired conclusion

Map each future item to the specific test or engineering principle its source supports. Spiral-turbine studies justify a test methodology, not borrowed Cp. DO manuals justify oxygen monitoring; WHO/clinic evidence supports measuring ventilation. Published materials/LCA and small-wind guidance justify durability/siting work. Any exact improvement percentage, component life or cost without a matching source stays an assumption.

The model tables cited above provide the reproducible numerical result. Low/base/high scenario assumptions are in data/assumptions.csv and component/process registers; they are not additional sourced observations.

## Remaining limitation
Requested evidence threshold met for bounded description; physical validation still separate.

## Reproducible repaired numerical register

Exact model-export rows below; display precision is not altered. Source references are IDs in data/sources.csv.

### future_scope.csv

```json
[
  {
    "item": "Calibrated performance rig",
    "cost_low_bdt": "100000",
    "cost_base_bdt": "250000",
    "cost_high_bdt": "500000",
    "start_month": "0",
    "end_month": "3",
    "test": "Torque-speed, static-pressure/flow, DO transfer and brake-stop data",
    "decision": "Core validated curves; no revenue booked",
    "source_ids": "windguide;asce;clinic;faoaer",
    "basis": "A incremental planning allowance, not included in commercial FCF or added twice to launch investment"
  },
  {
    "item": "Structural and overspeed redesign",
    "cost_low_bdt": "100000",
    "cost_base_bdt": "250000",
    "cost_high_bdt": "600000",
    "start_month": "1",
    "end_month": "6",
    "test": "Guard retention, fatigue, anchor uplift and mechanical fail-safe",
    "decision": "Independent review before occupied/public installation",
    "source_ids": "windguide;khk",
    "basis": "A incremental planning allowance, not included in commercial FCF or added twice to launch investment"
  },
  {
    "item": "Durable and recycled material pilot",
    "cost_low_bdt": "50000",
    "cost_base_bdt": "150000",
    "cost_high_bdt": "350000",
    "start_month": "2",
    "end_month": "6",
    "test": "UV, salt exposure, creep, leaks and recycled-lot coupons",
    "decision": "Lower lifecycle cost must exceed rework cost",
    "source_ids": "materials;asa;recycle",
    "basis": "A incremental planning allowance, not included in commercial FCF or added twice to launch investment"
  },
  {
    "item": "Monitoring kit per air site",
    "cost_low_bdt": "7000",
    "cost_base_bdt": "18000",
    "cost_high_bdt": "40000",
    "start_month": "3",
    "end_month": "6",
    "test": "Calibrated CO2, anemometer, RPM and enclosure",
    "decision": "Optional electrical load; no measured value premium",
    "source_ids": "whoweb;clinic",
    "basis": "A incremental planning allowance, not included in commercial FCF or added twice to launch investment"
  },
  {
    "item": "Monitoring kit per pond site",
    "cost_low_bdt": "12000",
    "cost_base_bdt": "35000",
    "cost_high_bdt": "80000",
    "start_month": "3",
    "end_month": "6",
    "test": "DO/temperature logging and reference calibration",
    "decision": "Pre-dawn oxygen trend, sensor maintenance required",
    "source_ids": "faoquality;asce",
    "basis": "A incremental planning allowance, not included in commercial FCF or added twice to launch investment"
  },
  {
    "item": "Fixed PV hybrid incremental kit",
    "cost_low_bdt": "20000",
    "cost_base_bdt": "38000",
    "cost_high_bdt": "70000",
    "start_month": "6",
    "end_month": "12",
    "test": "Matched module, motor, charge control and battery autonomy",
    "decision": "Compare fixed PV against costly tracking; no autonomy guarantee",
    "source_ids": "site;windguide",
    "basis": "A incremental planning allowance, not included in commercial FCF or added twice to launch investment"
  },
  {
    "item": "Regional service and modular fleet trial",
    "cost_low_bdt": "100000",
    "cost_base_bdt": "300000",
    "cost_high_bdt": "700000",
    "start_month": "9",
    "end_month": "18",
    "test": "Multiple independently metered assets and response-time records",
    "decision": "Separate additive power from correlated wind availability",
    "source_ids": "faoaer;windguide",
    "basis": "A incremental planning allowance, not included in commercial FCF or added twice to launch investment"
  },
  {
    "item": "Grain grinding feasibility study",
    "cost_low_bdt": "50000",
    "cost_base_bdt": "150000",
    "cost_high_bdt": "300000",
    "start_month": "12",
    "end_month": "24",
    "test": "Torque requirement, gearing, food-contact and guarding tests",
    "decision": "Deferred; not a current business model",
    "source_ids": "project;khk",
    "basis": "A incremental planning allowance, not included in commercial FCF or added twice to launch investment"
  }
]
```
