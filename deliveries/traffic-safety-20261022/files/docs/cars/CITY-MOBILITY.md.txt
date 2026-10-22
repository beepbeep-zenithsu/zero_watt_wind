# Whole-city traffic and pedestrian movement

## Latest fixes — traffic safety and red P72

The red De Tomaso P72 keeps its original 21,495-triangle geometry at every camera distance. The coarse reduction previously changed the curved silhouette. Other car types retain their three distance-selected LODs; the original editable Blender sources remain included.

Traffic uses exact rounded street paths, safe initial spacing, oriented footprint checks before each physical move, fair junction requests and compatible shared car/cycle movements. A reservation that never enters expires; an already committed vehicle completes its turn. Releasing reservations at the junction core prevents circular queues between short city blocks. Physical clearance checks protect the exits independently. Walkers use spaced pavement queues and exclusive corner reservations; protected crossing demand is raised only by the front pedestrian when its exit is available.

The latest [ten-minute production simulation audit](traffic-safety-audit.json) checks all 36 cars, 24 riders and 80 people at 10 Hz. It records zero vehicle, pedestrian or mixed collision samples. Every car travels at least 302.4 m, every cyclist 247.0 m, and every person completes at least 12 crossings. The longest observed stationary periods are 134.3 / 133.1 / 85.0 seconds respectively: signals and congestion still cause stops, so movement is not uninterrupted. The JSON includes the full diagnostics. A separate [large pond/rain audit](traffic-safety-water-rain.json) covers wet conditions.

The older browser timing figures and images below document the earlier visual review; they are not fresh performance measurements of this safety revision. The latest live movement check passes all six combinations of basic/advanced/pond and normal/reduced motion preferences, with all 36 cars moving in each case. The large pond/rain audit records zero collisions over 180 simulated seconds. All 77 tests passed, followed by 16 targeted mobility/environment tests after the last traffic adjustment and red-car regression check. The full project archive and byte-identical source copies are in `deliveries/traffic-safety-20261022/`.

The city contains **36 real cars, 24 cycling riders and 80 pedestrians** in basic ventilation, advanced ventilation and pond scenes. Only the installed Jaguar E-Type, Porsche Taycan and De Tomaso P72 are used. Each of the 12 vehicle circuits carries all three car types. Routes cover every street segment between all nine city blocks, including the four corner blocks. No additional car sourcing is part of this update.

People travel through a connected network of 64 pavement corners, choose destinations in other parts of town, and cross at painted zebra crossings. All 16 junctions support crossings. The 40-second signal cycle includes a protected nine-second walking phase after vehicle clearance. An occupied crossing keeps conflicting vehicles stopped until people reach the pavement. Walkers queue with spacing, step down/up the curb and make brief conversational gestures. All populations pause with the simulation.

Dry-weather cruise targets are 8.4 m/s for cars (30 km/h), 5 m/s for bicycles (18 km/h), and 1.75–2.11 m/s for walkers. Curves, queues, signals, rain and storms reduce speed. Signals cause deliberate stops. FIFO reservations prevent a continually arriving car stream from starving cyclists; vehicles also check exit space before entering a junction.

The 120 Hz simulation uses cached arc-length route tables. Render poses predict only the fraction of a step remaining between simulation ticks, preserving smooth motion on high-refresh displays. Car parts are instanced by type/LOD with individual wheel spin and front-wheel steering. Geometry, textures, matrices, rider poses and clothing colors are reused. Animated batches retain conservative bounds and shared contact shadows. Hidden fallback vehicles skip animation work. This reduces repeated CPU work and draw overhead without removing the population.

The corner workstation remains reserved for one seated operator. Other seats stay clear of the desk up to 30 occupants, including the minimum room size.

## Verification and browser images

Build and all 77 tests pass. The suite covers every street segment, four minutes of pedestrian travel across all 16 junctions, vehicle/pedestrian reservations, actual car loading, stable instance buffers, high-refresh continuity, pause/weather behavior and desk clearance. A reduced-motion preference still starts the simulation paused; pressing Play explicitly now starts all city populations. Previously the clock ran while traffic stayed disabled. [Live webpage motion checks](live-traffic-motion.json) measure real car position changes in all three modes with both motion preferences. Refresh the website to fetch the versioned bundle, then press Play if it starts paused.

[Real browser timing and mode-switch results](citywide-browser-review.json) records the test GPU, frame intervals, render work, triangles and draw calls for basic, pond and advanced scenes. Results apply to the test machine and viewport; they do not guarantee identical performance on other hardware. The isolated timing scene renders the production classes and real textures; the final smoke test also switches modes in the actual website.

- [City in sunlight](citywide-clear.png)
- [City in rain](citywide-rain.png)
- [City at night](citywide-night.png)
- [Pond city](citywide-water-clear.png)
- [Advanced city](citywide-advanced-clear.png)
- [Advanced city in rain](citywide-advanced-rain.png)
- [Installed Blender car review](installed-cars-review.png)
- [30-person workstation review](workstation-review.png)

## Source and rebuild

- `src/graphics/people.js`: pavement graph, destinations, protected crossings and walking animation.
- `src/graphics/road-network.js`: twelve routes and shared reservations.
- `src/graphics/motion-route.js`: cached arc-length sampling.
- `src/graphics/traffic.js`: acceleration, signals, fair reservations, exit clearance and render poses.
- `src/graphics/cyclists.js`: cycling traffic and pedal/leg articulation.
- `src/graphics/mobility-shadows.js`: shared moving contact shadows.
- `src/cars/traffic-fleet.js`: instanced actual cars, active LODs, wheels and lamps.
- `src/graphics/assets.js`: shared transforms and stable dynamic buffers.
- `src/graphics/occupant-layout.js`: workstation and seating clearance.

Run `npm run build`, `npm test`, then `npm start`. Preserve [model credits and licenses](../../assets/cars/SOURCES.md). Editable Blender car/rider assets remain in `assets/`. The browser check is `node tools/review-citywide-browser.cjs`; it requires Playwright, Edge/Chromium and the local server at port 5500. No external accounts or downloads are needed to run the city.
