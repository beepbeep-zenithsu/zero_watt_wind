# Hybrid integration validation · 21 October 2026

## Subsequent interface update

At the user's request, bottom status/metrics panels were deleted from every Basic,
Advanced and Pond scenario, including the advanced power-chain and clutch-status rows.
The matching DOM update code was removed. Existing scenario/preset tests now confirm
these panels are absent while calculations and controls still work. All 47 tests and
the production build pass after the removal. Browser captures below document the
earlier interface and predate this change.

## Automated and asset checks

- `npm test`: **47 passed, 0 failed**. Original calculations match the existing 84-case source/hash baseline.
- `npm run build`: production IIFE bundles successfully with esbuild. No added runtime dependency.
- `npm run verify:graphics`: all 16 original air/water installation/weather combinations pass;
  existing models load, machinery axes/ratios, mounting, pause and close-up framing are retained.
- Actual hybrid GLB is parsed with the project's vendored Three.js GLTFLoader in tests.
  All 20 named pivots exist, geometry is finite, fan and rotor origins are checked, roof support
  bounds are checked, and draw/vertex budgets are checked.
- Blender 5.2 generated and saved both the editable source and GLB. Final export:
  **1,956,212 bytes, 69,424 triangles**, material batches merged within each assembly pivot.
- Model checks cover adequate wind, weak wind, zero wind, night battery use, fault,
  low charge, empty battery, full-battery curtailment, electrical limits, timed verification,
  recovery hysteresis and pause. Animation checks cover miter/pulley ratios, sectioning,
  exploded reassembly, trace toggles and tour framing.
- DOM integration checks switch Basic/Advanced eight times and confirm exactly two cached air
  canvases, unchanged original camera state, paused inactive hybrid time, all presets/toggles,
  component selection and navigation to/from the original pond application.

The initial baseline had one failing voice assertion. Its expectation for `wind speed 12`
was 2.5, contrary to the existing parser's documented bare-name-plus-number behavior.
The assertion now expects 12; `jarvis.js` was not changed.

## Browser checks

Inspected the real bundled app in the local Chromium preview using the generated GLB:

- Basic and Advanced selection renders; the hybrid asset status reaches ready.
- Adequate wind reports Wind-Driven Operation with motor at 0 W.
- Weak wind reports Hybrid Assistance, with both clutch engagement indicators active.
- Zero wind reports Solar/Battery Ventilation, input RPM 0 and wind clutch overrunning.
- Night reduces PV to 0 W and shows battery supply to the motor.
- Low battery reports Battery / Fault Protection, motor at 0 W and the explicit warning.
- Section, exploded view, pause/resume, component focus and low/high render-quality controls respond.
- Mobile breakpoint **390 × 844** has no horizontal overflow; scene and controls stack,
  and telemetry becomes a 3-column grid. Desktop **1440 × 1000** is also inspected.
- No JavaScript console errors observed. Existing PMREM roughness-blur warnings may appear;
  they do not prevent the reflection map or scene from rendering.

Evidence: `desktop-browser.png` and `mobile-browser.png` are actual browser captures,
not concept renders. Some telemetry can still be accelerating in the saved frame.

## Boundaries

This is an interactive concept, with visual approximations of manufactured components,
shared existing architectural/landscape assets, and estimated engineering outputs. It does
not establish fabrication tolerances, exact tooth contact, aerodynamic performance, CFD,
measured device frame rates or exhaustive GPU compatibility. Advanced layout is one fixed
installation; the Basic installation-count and room-size controls remain available in Basic.
No external HDRI or photogrammetry assets were added. Lighting uses the existing PMREM
environment, daylight, shadows, PBR surface detail and a day/night transition.
