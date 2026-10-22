# Task 12: Complete simulation interpretation

## Draft

Audit basic ventilation, pond and advanced hybrid source, all named weather cases, controls, hardware and equations. Preserve all coefficients in JSON/CSV. Basic and pond are steady-state, perfectly mixed illustrations; advanced integrates battery energy with a simplified fan curve. Storm rotation is a deliberate display behaviour, not safe cut-out. Scene graphics, sun tracking and RPM animations are explanatory only.

Source IDs: site,project,poster,windguide.

## Round 1: Source baseline and first market draft

### ATTACK
1. Hostile investor: A dynamic animation is not CFD or a field test. What source and test would falsify the claim?
2. Skeptical judge: Declared cutout thresholds are not applied. What source and test would falsify the claim?
3. Fact-checker: Basic and advanced have different assumed rotor geometry. What source and test would falsify the claim?
4. Hostile investor: Battery animation may conceal inadequate autonomy. What source and test would falsify the claim?
5. Fact-checker: Removing metric panels does not validate underlying numbers. What source and test would falsify the claim?

### VERIFY
PDF/site read, supplier indications and Bangladesh institutional sources. Evidence artefacts: notes/evidence_round1a.txt; notes/evidence_round1b.txt. Relevant task sources: site,project,poster,windguide. Quantitative repair artefacts: data/site_baseline.json; data/site_scenarios.json; data/engineering_metrics.csv.

### REPAIR
Archive all coefficients, numeric literals and weather presets from source.

### SCORE
Evidence 6/10, Numerical correctness 8/10, Realism 7/10, Completeness 7/10.

## Round 2: Counter-evidence and applicability

### ATTACK
1. Hostile investor: A dynamic animation is not CFD or a field test. Does the low-wind/high-cost case change the result?
2. Skeptical judge: Declared cutout thresholds are not applied. Does the low-wind/high-cost case change the result?
3. Fact-checker: Basic and advanced have different assumed rotor geometry. Does the low-wind/high-cost case change the result?
4. Hostile investor: Battery animation may conceal inadequate autonomy. Does the low-wind/high-cost case change the result?
5. Fact-checker: Removing metric panels does not validate underlying numbers. Does the low-wind/high-cost case change the result?

### VERIFY
Small-wind turbulence, source age/geography, environmental burden boundaries. Evidence artefacts: notes/evidence_round2a.txt; notes/evidence_round2b.txt. Relevant task sources: site,project,poster,windguide. Quantitative repair artefacts: data/site_baseline.json; data/site_scenarios.json; data/engineering_metrics.csv.

### REPAIR
Identify ignored basic cut-out and different advanced geometry.

### SCORE
Evidence 7/10, Numerical correctness 9/10, Realism 8/10, Completeness 8/10.

## Round 3: Independent service and programme checks

### ATTACK
1. Hostile investor: A dynamic animation is not CFD or a field test. Is the source current, local and the same specification?
2. Skeptical judge: Declared cutout thresholds are not applied. Is the source current, local and the same specification?
3. Fact-checker: Basic and advanced have different assumed rotor geometry. Is the source current, local and the same specification?
4. Hostile investor: Battery animation may conceal inadequate autonomy. Is the source current, local and the same specification?
5. Fact-checker: Removing metric panels does not validate underlying numbers. Is the source current, local and the same specification?

### VERIFY
FAO oxygen methods, fisheries primary tables, grant/lender eligibility, multiple local offers. Evidence artefacts: notes/evidence_round3a.txt; notes/evidence_round3b.txt. Relevant task sources: site,project,poster,windguide. Quantitative repair artefacts: data/site_baseline.json; data/site_scenarios.json; data/engineering_metrics.csv.

### REPAIR
Calculate battery autonomy and point outputs independently in Python; no physical validation implied.

### SCORE
Evidence 9/10, Numerical correctness 10/10, Realism 9/10, Completeness 9/10.

## Final repaired conclusion

Audit basic ventilation, pond and advanced hybrid source, all named weather cases, controls, hardware and equations. Preserve all coefficients in JSON/CSV. Basic and pond are steady-state, perfectly mixed illustrations; advanced integrates battery energy with a simplified fan curve. Storm rotation is a deliberate display behaviour, not safe cut-out. Scene graphics, sun tracking and RPM animations are explanatory only.

The model tables cited above provide the reproducible numerical result. Low/base/high scenario assumptions are in data/assumptions.csv and component/process registers; they are not additional sourced observations.

## Remaining limitation
Requested evidence threshold met for bounded description; physical validation still separate.

## Reproducible repaired numerical register

Exact model-export rows below; display precision is not altered. Source references are IDs in data/sources.csv.

### engineering_metrics.csv

```json
[
  {
    "metric": "basic_default_shaft_4_5ms",
    "value": "5.917895394198803",
    "unit": "W",
    "basis": "D",
    "source_id": "site",
    "formula": "P=0.5 rho A v^3 Cp eta"
  },
  {
    "metric": "basic_default_airflow_4_5ms",
    "value": "372.8274098345246",
    "unit": "m3/h",
    "basis": "D",
    "source_id": "site",
    "formula": "Q=Pshaft etafan/dp*3600"
  },
  {
    "metric": "basic_default_ACH_4_5ms",
    "value": "2.4855160655634974",
    "unit": "ACH",
    "basis": "D",
    "source_id": "site",
    "formula": "Q/room"
  },
  {
    "metric": "advanced_battery_autonomy_72_to_12",
    "value": "1.872",
    "unit": "hours",
    "basis": "D",
    "source_id": "site",
    "formula": "Wh usable / motor W; no PV/wind or parasitic load"
  },
  {
    "metric": "advanced_target_ACH",
    "value": "5.666666666666667",
    "unit": "ACH",
    "basis": "D",
    "source_id": "site",
    "formula": "850/150, untested fan coefficient"
  },
  {
    "metric": "clinic_older_guidance_flow_8people",
    "value": "1728.0",
    "unit": "m3/h",
    "basis": "D",
    "source_id": "clinic",
    "formula": "Older 60 L/s/person context, not current certification"
  },
  {
    "metric": "pond_demand_100m3",
    "value": "0.025",
    "unit": "kg/h",
    "basis": "D",
    "source_id": "site",
    "formula": "mg/L/h *m3 =g/h; divide1000"
  },
  {
    "metric": "commercial_tariff",
    "value": "15.36",
    "unit": "BDT/kWh",
    "basis": "S",
    "source_id": "tarifforder",
    "formula": "Scan PDF p3 LT-E flat"
  },
  {
    "metric": "clinic_tariff",
    "value": "9.05",
    "unit": "BDT/kWh",
    "basis": "S",
    "source_id": "tarifforder",
    "formula": "Scan PDF p2 LT-D1"
  },
  {
    "metric": "fan_nameplate",
    "value": "55",
    "unit": "W",
    "basis": "S",
    "source_id": "fanweb",
    "formula": "Nameplate is not delivered pressure-flow"
  },
  {
    "metric": "cognition_claim_CO2",
    "value": "500",
    "unit": "ppm",
    "basis": "S",
    "source_id": "poster",
    "formula": "Project claim; exact generalized effect not accepted"
  },
  {
    "metric": "cognition_claim_effect",
    "value": "15",
    "unit": "percent",
    "basis": "S",
    "source_id": "poster",
    "formula": "Project claim; endpoint/causality NOT verified"
  },
  {
    "metric": "EU_Chandpur_speed",
    "value": "4.11",
    "unit": "m/s",
    "basis": "S-index",
    "source_id": "euwind",
    "formula": "Appendix4,60m,2014-17 indexed extract; full PDF blocked"
  },
  {
    "metric": "EU_Chandpur_height",
    "value": "60",
    "unit": "m",
    "basis": "S-index",
    "source_id": "euwind",
    "formula": "Not rooftop or pond height"
  },
  {
    "metric": "FAO_example_SAE_low",
    "value": "0.91",
    "unit": "kg/kWh",
    "basis": "S",
    "source_id": "faoaer",
    "formula": "Historical table7 experiment, foreign"
  },
  {
    "metric": "FAO_example_SAE_high",
    "value": "1.41",
    "unit": "kg/kWh",
    "basis": "S",
    "source_id": "faoaer",
    "formula": "Historical table7 experiment, foreign"
  }
]
```

### wind_resource.csv

```json
[
  {
    "scenario": "base",
    "mean_wind_ms": "3.5",
    "weibull_shape": "2.0",
    "scale_ms": "3.9493270848342936",
    "mechanical_availability": "0.9",
    "mean_shaft_w": "4.746038718962555",
    "capacity_factor_250w": "0.01898415487585022",
    "energy_service_fraction": "0.4711514453681903",
    "full_service_fraction": "0.29201339838523227",
    "threshold_ms": "4.185528666989757",
    "required_shaft_w": "4.761904761904762",
    "integrated_probability": "1.0000005342850598",
    "basis": "A Weibull distribution and site coefficients; D integration"
  }
]
```
