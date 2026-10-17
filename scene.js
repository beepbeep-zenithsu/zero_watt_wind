import * as T from './vendor/three.module.js';

/* ZeroWatt Wind - 3D field scene.
   Geometry is reconstructed from the supplied photographs (not imported CAD).
   Environments: the original building cutaway (room, occupants, windows) and the original pond
   (basin, timber walkway, fish, reeds). The prototype is the photo-based assembly:
   spiral rotor -> shaft on double-plate stands -> bevel pair (90 deg) -> fan (air) or paddle wheel (water). */

const MAX_UNITS = 12, MAX_PEOPLE = 30, MAX_FISH = 8, PITCH_X = 4.9, PITCH_Z = 5.6;
// pond: units ride on pontoon boats. Deck level sits just above the waterline, the drive steps down through a second bevel pair so the paddle wheel hangs deep in the water.
const WSHAFT_Y = 2.0, WHEEL_Y = .35, WHEEL_R = 1.6, BOAT_S = .5, BOAT_PITCH = 6.6, MAX_BOATS = 6, MAX_UPB = 2, DECK_DROP = .14, WHEEL_Z = 3.4;
const POND_BACK = 1.2, POND_Y = .16, WATER_Y = .95, SHAFT_Y = 1.55;
const FLOOR_TOP = .3, WALL_H = 3.2, ROOF_TOP = 3.7;
const BEVEL_R = .5, BEVEL_N = 20, AX = 1.02;   // equal miter gears: pitch radius, teeth, x of the point where both shaft axes cross

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
// grid of prototype units: air = up to two rows on the roof, water = one row on the deck behind the basin
const grid = (n, air) => { const cols = air ? (n <= 5 ? n : Math.ceil(n / 2)) : n; return {cols, rows: Math.ceil(n / cols)}; };

export class FieldScene {
  constructor(host, mode) {
    this.host = host; this.mode = mode;
    this.angle = .8; this.elevation = .42; this.distance = 13; this.target = new T.Vector3(0, 2, 0);
    this.view = 'field'; this.time = 0; this.count = 1; this.extent = 12;
    this.rotors = []; this.rotorGroups = []; this.gears = []; this.fans = []; this.vfans = []; this.units = [];
    this.trees = []; this.fish = []; this.rings = []; this.rainRings = []; this.people = []; this.panes = [];
    this.debris = []; this.puddles = []; this.hazes = []; this.water = null; this.canyon = null;
    this.flows = true; this.haze = 0; this.rainAmt = 0; this.storm = false; this.night = false; this.flashT = 0; this.lightT = 3; this.layoutKey = '';
    this.roomW = 6; this.roomD = 6; this.pondL = 9; this.pondW = 5; this.sensors = null;
    this.boats = 1; this.upb = 1; this.mount = 'boat'; this.boatGroups = []; this.boatPose = []; this.boatTheta = []; this.lanes = []; this.laneOf = []; this.pondZc = 6; this.benchBoat = null;

    this.renderer = new T.WebGLRenderer({antialias:true, alpha:false, powerPreference:'low-power'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.outputColorSpace = T.SRGBColorSpace; this.renderer.toneMapping = T.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 1.15;
    this.renderer.domElement.setAttribute('aria-label', mode === 'air' ? 'Interactive 3D rooftop ventilation with the wind prototype driving fans into a room' : 'Interactive 3D pond aerator with the wind prototype driving a paddle wheel');
    this.renderer.domElement.setAttribute('role', 'img'); this.renderer.domElement.tabIndex = 0;
    host.prepend(this.renderer.domElement);

    this.scene = new T.Scene(); this.scene.background = new T.Color('#839e88'); this.scene.fog = new T.FogExp2('#839e88', .02);
    this.camera = new T.PerspectiveCamera(38, 1, .1, 240);
    this.hemi = new T.HemisphereLight('#e8f3da', '#263b2c', 2.4); this.scene.add(this.hemi);
    this.sun = new T.DirectionalLight('#fff1cb', 3.2); this.sun.position.set(-8, 14, 9); this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048); this.sun.shadow.bias = -.0008; this.sun.shadow.normalBias = .03; this.scene.add(this.sun);
    const fill = new T.DirectionalLight('#b5d3cd', 1); fill.position.set(7, 6, -7); this.scene.add(fill);
    this.roomLight = new T.PointLight('#ffd89a', 0, 16, 1.5); this.roomLight.position.set(0, 2.7, 0); this.scene.add(this.roomLight);
    this.flashLight = new T.PointLight('#e8f2ff', 0, 140, 1.2); this.scene.add(this.flashLight);

    this.mats = {
      white: this.mat('#f4f2ea', .55, .02), black: this.mat('#151819', .6, .05), steel: this.mat('#aeb6b0', .35, .75),
      concrete: this.mat('#8d9b87'), cream: this.mat('#ddd8bd'), wood: this.mat('#b99f78'), gold: this.mat('#c9ae75', .5, .4),
      cream2: this.mat('#c9b48a'), dark: this.mat('#1e3029'), trunk: this.mat('#655d42'), leaf: this.mat('#4d6945'), leaf2: this.mat('#5d7c4f'),
      skin: this.mat('#cfb894'), shirtA: this.mat('#6e8e80'), shirtB: this.mat('#89966a'), path: this.mat('#d5cdb0'),
      water: new T.MeshStandardMaterial({color:'#2a7e7e', roughness:.22, metalness:.3, transparent:true, opacity:.66, side:T.DoubleSide, depthWrite:false}), fish: this.mat('#b79b61', .6, 0), fishTail: this.mat('#9d8b5a', .6, 0),
      reed: this.mat('#5e7b3e'), cattail: this.mat('#6b4f2c'), plank: this.mat('#7e8062'), basin: this.mat('#3f5a52'),
      cloud: this.mat('#b4c3b3', .9, 0), leafPiece: this.mat('#6f8f4a', .8, 0), twig: this.mat('#4a3d2c', .8, 0),
      glass: new T.MeshStandardMaterial({color:'#9ac8b8', transparent:true, opacity:.28, roughness:.12, side:T.DoubleSide}),
      win: new T.MeshStandardMaterial({color:'#b8e0d0', transparent:true, opacity:.34, roughness:.1, side:T.DoubleSide, emissive:'#000000'}),
      led: new T.MeshStandardMaterial({color:'#6fe08a', emissive:'#2fbf5a', emissiveIntensity:1.2}),
      cross: new T.MeshStandardMaterial({color:'#2fae63', emissive:'#12562f', emissiveIntensity:.6, roughness:.5}), pontoon: this.mat('#f1efe6', .45, .02),
      brake: new T.MeshStandardMaterial({color:'#e0503f', emissive:'#6a1a10', roughness:.4}),
      storm: new T.MeshStandardMaterial({color:'#f0b84a', emissive:'#6a4a10', roughness:.4}),
      duct: new T.MeshStandardMaterial({color:'#f4f2ea', roughness:.4, transparent:true, opacity:.28, side:T.DoubleSide, depthWrite:false}),
      puddle: new T.MeshStandardMaterial({color:'#2e4c52', roughness:.04, metalness:.5, transparent:true, opacity:.9}),
      ripple: new T.MeshBasicMaterial({color:'#9fd6cb', transparent:true, opacity:.6, depthWrite:false, side:T.DoubleSide}),
      haze: new T.MeshBasicMaterial({color:'#fff3d2', transparent:true, opacity:0, depthWrite:false, side:T.DoubleSide, fog:false})
    };
    this.hazeMat = this.mats.haze;

    this.env = new T.Group(); this.scene.add(this.env);          // surroundings, weather, sky
    this.shell = new T.Group(); this.scene.add(this.shell);      // building or pond (layout dependent)
    this.unitRoot = new T.Group(); this.scene.add(this.unitRoot); // the prototype units
    this.fx = new T.Group(); this.scene.add(this.fx);            // air, splash and heat particles
    this.table = new T.Group(); this.table.visible = false; this.scene.add(this.table);

    this.buildStatic(); this.buildTable(); this.buildUnits(); this.buildFx();
    this.bind(); this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize()); this.resizeObserver.observe(host);
    this.cameraPosition();
    this.renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); host.dataset.graphics = 'lost'; });
    this.renderer.domElement.addEventListener('webglcontextrestored', () => { delete host.dataset.graphics; this.resize(); });
  }

  /* ---------------- helpers ---------------- */
  mat(color, roughness = .7, metalness = .08) { return new T.MeshStandardMaterial({color, roughness, metalness, side:T.DoubleSide}); }
  mesh(g, m, parent, x = 0, y = 0, z = 0) { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; }
  box(w, h, d, m, parent, x = 0, y = 0, z = 0) { return this.mesh(new T.BoxGeometry(w, h, d), m, parent, x, y, z); }
  cyl(r, l, m, parent, x = 0, y = 0, z = 0, axis = 'y', r2 = r) { const o = this.mesh(new T.CylinderGeometry(r, r2, l, 28), m, parent, x, y, z); if (axis === 'x') o.rotation.z = Math.PI/2; if (axis === 'z') o.rotation.x = Math.PI/2; return o; }
  strut(parent, from, to, radius, material) {
    const a = new T.Vector3(...from), b = new T.Vector3(...to), delta = b.clone().sub(a);
    const o = this.cyl(radius, delta.length(), material, parent);
    o.position.copy(a.add(b).multiplyScalar(.5));
    o.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
    return o;
  }
  sphere(r, m, parent, x = 0, y = 0, z = 0) { return this.mesh(new T.SphereGeometry(r, 16, 12), m, parent, x, y, z); }
  pointGeo(n) { const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(n*3), 3)); return g; }
  // flat toothed disc in the XY plane, extruded along z (used for bevel and spur gears)
  toothGeo(ro, teeth, depth) {
    const s = new T.Shape(), n = teeth*2;
    for (let i = 0; i < n; i++) { const a = i/n*Math.PI*2, r = i % 2 ? ro*.84 : ro, x = Math.cos(a)*r, y = Math.sin(a)*r; if (i) s.lineTo(x, y); else s.moveTo(x, y); }
    s.closePath();
    const g = new T.ExtrudeGeometry(s, {depth, bevelEnabled:false, curveSegments:1}); g.translate(0, 0, -depth/2); return g;
  }

  /* ---------------- static surroundings ---------------- */
  buildStatic() {
    const E = this.env;
    this.box(260, .15, 260, this.mat('#637c60'), E, 0, -.4, 0);
    // distant buildings (original scene)
    for (let i = 0; i < 7; i++) {
      const x = (i-3)*5.4, z = -13 - Math.abs(i-3)*.8, h = 2.4 + (i*7%5)*1.3, b = new T.Group(); E.add(b);
      this.box(3.1, h, 2.8, this.mat(['#758477', '#85937d', '#a4ac91'][i%3]), b, x, h/2 - .3, z);
      this.box(3.25, .15, 2.95, this.mats.concrete, b, x, h - .2, z);
      for (let f = 0; f < Math.floor(h/.9); f++) for (let n = 0; n < 3; n++) this.box(.44, .4, .025, this.mat('#435d54'), b, x - .9 + n*.9, .5 + f*.9, z + 1.42);
    }
    // clouds (drift with the wind)
    this.clouds = new T.Group(); E.add(this.clouds);
    for (let i = 0; i < 9; i++) { const c = new T.Group(); c.position.set(-14 + i*3.6, 12 + (i%3)*.6, -24 + (i%2)*2); this.clouds.add(c); const s = new T.Mesh(new T.SphereGeometry(1, 16, 12), this.mats.cloud); s.scale.set(2.2, .5, 1.1); c.add(s); }
    // night sky
    const sp = new Float32Array(500*3);
    for (let i = 0; i < 500; i++) { const th = Math.random()*Math.PI*2, ph = Math.random()*Math.PI*.42, r = 150; sp[i*3] = Math.cos(th)*Math.cos(ph)*r; sp[i*3+1] = Math.sin(ph)*r; sp[i*3+2] = Math.sin(th)*Math.cos(ph)*r; }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3));
    this.stars = new T.Points(sg, new T.PointsMaterial({color:'#f2f6ea', size:1.6, sizeAttenuation:false, transparent:true, opacity:.85, depthWrite:false, fog:false}));
    this.stars.visible = false; E.add(this.stars);
    this.moon = new T.Mesh(new T.SphereGeometry(4, 20, 14), new T.MeshBasicMaterial({color:'#e9f0d8', fog:false})); this.moon.position.set(-70, 80, -130); this.moon.visible = false; E.add(this.moon);
    // heat haze bands near the ground
    for (let i = 0; i < 6; i++) { const h = new T.Mesh(new T.PlaneGeometry(70, 1.1), this.hazeMat); h.position.set(0, .5 + i*.6, i % 2 ? 7 : -7); E.add(h); this.hazes.push(h); }
    // wind-blown debris for storms
    const leafG = new T.PlaneGeometry(.2, .12);
    for (let i = 0; i < 36; i++) { const d = new T.Mesh(leafG, i % 3 ? this.mats.leafPiece : this.mats.twig); d.userData = {x0: Math.random()*36, y0: .6 + Math.random()*4.5, z0: (Math.random() - .5)*16, ph: Math.random()*6.28}; d.visible = false; E.add(d); this.debris.push(d); }
    // rain puddles (appear as it rains)
    const pg = new T.CircleGeometry(1, 28); pg.rotateX(-Math.PI/2);
    const spots = [[-10, 2, 1.1], [-8.5, -5, .8], [9, -6, 1.3], [10.5, 4.5, .9], [7, 9.5, 1.2], [-13, 6, 1.0], [-3, 11.5, .9], [2.5, -10.5, 1.1], [-12, -11, 1.2], [14, -1, .8]];
    for (const [x, z, s] of spots) { const m = new T.Mesh(pg, this.mats.puddle); m.position.set(x, .03, z); m.userData = {base: s, th: .05 + Math.random()*.4}; m.visible = false; E.add(m); this.puddles.push(m); }
    // windsock: points downwind; it fills with wind and droops in lulls
    const ws = new T.Group(); ws.position.set(-10.5, 0, -7.5); E.add(ws);
    this.cyl(.05, 4.2, this.mats.white, ws, 0, 2.1, 0);
    this.sockPivot = new T.Group(); this.sockPivot.position.set(0, 4.2, 0); ws.add(this.sockPivot);
    const L = 2.6, R = s => .34 - .24*s;
    for (const [a, b, col] of [[0, .85, '#e8762e'], [.85, 1.75, '#f4f1e6'], [1.75, 2.6, '#e8762e']]) {
      const m = new T.Mesh(new T.CylinderGeometry(R(a/L), R(b/L), b - a, 18, 1, true), this.mat(col, .8, 0));
      m.rotation.z = Math.PI/2; m.position.x = (a + b)/2; m.castShadow = true; this.sockPivot.add(m);
    }
    this.mesh(new T.TorusGeometry(.34, .025, 6, 18), this.mats.dark, this.sockPivot, 0, 0, 0).rotation.y = Math.PI/2;
  }
  buildTable() {
    this.box(14, .3, 8, this.mats.cream2, this.table, 0, -.15, 1.4);
    this.mats.slab = new T.MeshStandardMaterial({color:'#8d9b87', roughness:.7, transparent:true, opacity:.42, depthWrite:false, side:T.DoubleSide});
    this.benchSlab = this.box(9, .25, 4.2, this.mats.slab, this.table, -.5, .775, .2);   // the roof, see-through, so the fan under it shows
    for (let i = 0; i < 14; i++) this.box(.02, .005, 8, this.mat('#b19d73'), this.table, -6.5 + i, .01, 1.4);
    if (this.mode === 'water') {   // pond close-up: one boat floating in a tank so the deep paddle wheel can be seen under the surface
      this.benchWater = new T.Mesh(new T.BoxGeometry(14, 1.5, 9), this.mats.water); this.benchWater.position.set(0, -.75, 0); this.benchWater.renderOrder = 2; this.scene.add(this.benchWater); this.benchWater.visible = false;
      this.benchBoat = new T.Group(); this.benchBoat.position.set(-AX, DECK_DROP, -1.2); this.scene.add(this.benchBoat); this.buildHull(this.benchBoat, 1); this.benchBoat.visible = false;
    }
  }

  /* ---------------- the real prototype (photo-based) ---------------- */
  spiral(parent, x, y, z, dark) {
    const g = new T.Group(); g.position.set(x, y, z); parent.add(g); const spin = new T.Group(); g.add(spin);
    this.rotors.push(spin); this.rotorGroups.push(g);
    for (let b = 0; b < 3; b++) {
      const positions = [], indices = [], nu = 28, nv = 10;
      for (let u = 0; u <= nu; u++) for (let v = 0; v <= nv; v++) { const a = u/nu, t = v/nv, r = .1 + t*(.38 + a*.7), th = b*Math.PI*2/3 + a*2.7 + t*.3; positions.push((a - .5)*1.5, r*Math.cos(th), r*Math.sin(th)); }
      for (let u = 0; u < nu; u++) for (let v = 0; v < nv; v++) { const a = u*(nv + 1) + v; indices.push(a, a + 1, a + nv + 1, a + 1, a + nv + 2, a + nv + 1); }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); geo.setIndex(indices); geo.computeVertexNormals();
      this.mesh(geo, dark ? this.mats.black : this.mats.white, spin);
    }
    this.cyl(.12, 1.9, this.mats.white, spin, 0, 0, 0, 'x'); this.cyl(.26, .2, this.mats.white, spin, .85, 0, 0, 'x');
    return g;
  }
  stand(parent, x, z, h, rotY, plateMat, baseMat) {
    const s = new T.Group(); s.position.set(x, 0, z); s.rotation.y = rotY; parent.add(s);
    this.box(.8, .12, .95, baseMat, s, 0, .06, 0);
    for (const dz of [-.17, .17]) this.box(.1, h, .09, plateMat, s, 0, h/2 + .1, dz);
    this.box(.1, .22, .52, plateMat, s, 0, h + .02, 0);
    return s;
  }
  collar(parent, x, y, z, axis, dark) { this.cyl(.26, .13, dark ? this.mats.black : this.mats.white, parent, x, y, z, axis); this.cyl(.17, .17, dark ? this.mats.white : this.mats.black, parent, x, y, z, axis); }
  // one tooth ring for every bevel gear: teeth lie along the 45 degree cone, straddling the pitch surface
  buildTeeth() {
    const R = BEVEL_R, N = BEVEL_N, pos = [], nor = [], idx = [], tmp = new T.BoxGeometry(.2, .08, .075);
    const pa = tmp.attributes.position, na = tmp.attributes.normal, ia = tmp.index, v = new T.Vector3(), one = new T.Vector3(1, 1, 1);
    const xc = .07, rc = R - xc, mt = new T.Matrix4().compose(new T.Vector3(xc, rc, 0), new T.Quaternion().setFromEuler(new T.Euler(0, 0, -Math.PI/4)), one);
    for (let k = 0; k < N; k++) {
      const m = new T.Matrix4().makeRotationX(k/N*Math.PI*2).multiply(mt), nm = new T.Matrix3().getNormalMatrix(m), base = pos.length/3;
      for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(m); pos.push(v.x, v.y, v.z); v.fromBufferAttribute(na, i).applyMatrix3(nm).normalize(); nor.push(v.x, v.y, v.z); }
      for (let i = 0; i < ia.count; i++) idx.push(base + ia.getX(i));
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); g.setIndex(idx); return g;
  }
  // Miter bevel gear. Local +x points at the apex (where both shaft axes cross), the big end sits BEVEL_R from the apex,
  // so two of these meet exactly tooth-to-gap. 'phase' offsets the teeth half a pitch on the second gear.
  bevelGear(parent, pos, rot, sign, phase) {
    const R = BEVEL_R, delta = .04*Math.SQRT2, len = .65*R;
    const orient = new T.Group(); orient.position.copy(pos); orient.rotation.set(rot[0], rot[1], rot[2]); parent.add(orient);
    const spin = new T.Group(); orient.add(spin); this.gears.push({g:spin, sign});
    const cone = this.mesh(new T.CylinderGeometry(R - delta - len, R - delta, len, 40), this.mats.white, spin, len/2, 0, 0); cone.rotation.z = -Math.PI/2;
    this.cyl(.13, .3, this.mats.white, spin, -.15, 0, 0, 'x');
    const teeth = this.mesh(this.teethGeo, this.mats.white, spin); teeth.rotation.x = phase;
    return orient;
  }
  buildUnits() {
    this.teethGeo = this.buildTeeth(); this.toothUnit = this.toothGeo(1, 20, .08);   // spur profile, scaled per unit
    const R = BEVEL_R, W = this.mats.white, K = this.mats.black;
    for (let i = 0; i < MAX_UNITS; i++) {
      const g = new T.Group(); this.unitRoot.add(g); const Y = this.mode === 'air' ? SHAFT_Y : WSHAFT_Y, u = {g}; this.units.push(u);
      this.spiral(g, -2, Y, 0, false);                                              // spiral rotor overhangs the first stand
      this.cyl(.075, 1.55, W, g, -.225, Y, 0, 'x');                                 // main shaft (rotor -> bevel gear A), ends at the gear hub
      this.stand(g, -.95, 0, Y - .1, 0, W, W);
      this.stand(g, .1, 0, Y - .1, 0, K, K);
      this.collar(g, -.77, Y, 0, 'x', true); this.collar(g, .28, Y, 0, 'x', true);
      u.brake = this.mesh(new T.TorusGeometry(.2, .035, 8, 28), this.mats.brake, g, -.77, Y, 0); u.brake.rotation.y = Math.PI/2; u.brake.visible = false;
      // bevel gear A on the main shaft; its axis and the output axis cross at (AX, Y, 0), both gears sit BEVEL_R away
      this.bevelGear(g, new T.Vector3(AX - R, Y, 0), [0, 0, 0], 1, 0);

      // ---- ventilation: bevel gear B turns the drive straight DOWN. The vertical shaft passes through the roof to an exhaust fan under the ceiling (Whirlybird style)
      const A = u.airOut = new T.Group(); g.add(A);
      this.bevelGear(A, new T.Vector3(AX, Y - R, 0), [0, 0, Math.PI/2], -1, Math.PI/BEVEL_N);
      this.cyl(.075, 1.42, W, A, AX, .29, 0);                                        // vertical shaft: gear B down to the fan hub
      this.mesh(new T.CylinderGeometry(.45, .45, .28, 32, 1, true), W, A, AX, .14, 0); // roof curb the shaft passes through
      const hole = this.mesh(new T.CircleGeometry(.44, 32), this.mats.dark, A, AX, .012, 0); hole.rotation.x = -Math.PI/2;
      this.box(.9, .05, .08, W, A, AX, .3, 0); this.box(.08, .05, .9, W, A, AX, .3, 0); this.collar(A, AX, .34, 0, 'y', true);   // bearing spider on the curb
      u.goldAir = new T.Group(); u.goldAir.position.set(AX, .62, 0); A.add(u.goldAir); this.vfans.push(u.goldAir);                // reduction gear on the shaft
      const gm = this.mesh(this.toothUnit, this.mats.gold, u.goldAir); gm.rotation.x = Math.PI/2;
      // exhaust fan hangs under the ceiling inside a round duct; the grille bars show the duct pressure setting
      const fs = new T.Group(); fs.position.set(AX, -.4, 0); A.add(fs); this.vfans.push(fs); this.cyl(.12, .16, W, fs, 0, 0, 0);
      for (let k = 0; k < 6; k++) { const bl = new T.Group(); bl.rotation.y = k*Math.PI/3; fs.add(bl); const b = this.box(.62, .016, .2, W, bl, .45, 0, 0); b.rotation.x = .4; }
      this.mesh(new T.CylinderGeometry(.88, .88, .3, 40, 1, true), this.mats.duct, A, AX, -.35, 0);
      for (const y of [-.2, -.5]) { const rim = this.mesh(new T.TorusGeometry(.88, .03, 8, 40), W, A, AX, y, 0); rim.rotation.x = Math.PI/2; }
      this.box(1.76, .03, .05, W, A, AX, -.24, 0); this.box(.05, .03, 1.76, W, A, AX, -.24, 0); this.collar(A, AX, -.24, 0, 'y', true);
      u.bars = []; for (let k = 0; k < 10; k++) { const zz = (k - 4.5)*.17, len = 2*Math.sqrt(Math.max(.01, .88*.88 - zz*zz)), bar = this.box(len, .03, .04, this.mats.dark, A, AX, -.5, zz); bar.visible = false; u.bars.push(bar); }

      // ---- pond: the drive steps DOWN (bevel B -> short vertical shaft -> bevel C), then turns along the boat (bevel D) to a large paddle wheel that hangs deep in the water.
      const Wt = u.waterOut = new T.Group(); g.add(Wt);
      const Yl = WHEEL_Y;
      this.bevelGear(Wt, new T.Vector3(AX, Y - R, 0), [0, 0, Math.PI/2], -1, Math.PI/BEVEL_N);       // B: turns the drive down
      this.cyl(.075, .5, W, Wt, AX, (Y - R - .3 + Yl + R + .3)/2, 0);                                   // short vertical shaft B -> C
      this.collar(Wt, AX, (Y + Yl)/2 + .02, 0, 'y', true);
      this.bevelGear(Wt, new T.Vector3(AX, Yl + R, 0), [0, 0, -Math.PI/2], 1, 0);                      // C: apex points down
      this.bevelGear(Wt, new T.Vector3(AX, Yl, R), [0, Math.PI/2, 0], -1, Math.PI/BEVEL_N);            // D: turns the drive along the boat
      this.cyl(.075, 4.5, W, Wt, AX, Yl, 2.95, 'z');                                                    // output shaft from gear D to the bow
      // the wheel is held at BOTH ends: a pillow-block stand behind it on the stern deck and one in front on the bow beam
      this.stand(Wt, AX, 1.75, Yl - .1, Math.PI/2, K, K); this.collar(Wt, AX, Yl, 1.55, 'z', true);
      this.stand(Wt, AX, 5.0, Yl - .1, Math.PI/2, W, W); this.collar(Wt, AX, Yl, 4.8, 'z', false);
      u.goldWater = new T.Group(); u.goldWater.position.set(AX, Yl, 2.2); Wt.add(u.goldWater); this.fans.push(u.goldWater); this.mesh(this.toothUnit, this.mats.gold, u.goldWater);
      const pd = new T.Group(); pd.position.set(AX, Yl, WHEEL_Z); Wt.add(pd); this.fans.push(pd);
      const RR = WHEEL_R - .22;                                                                          // rim radius
      this.cyl(.24, 1.5, K, pd, 0, 0, 0, 'z');                                                         // hub on the shaft
      for (const z of [-.62, .62]) this.mesh(new T.TorusGeometry(RR, .055, 8, 56), K, pd, 0, 0, z);   // two rims
      for (let k = 0; k < 8; k++) {
        const arm = new T.Group(); arm.rotation.z = k*Math.PI/4; pd.add(arm);
        for (const z of [-.62, .62]) this.box(.09, RR - .2, .07, K, arm, 0, (RR + .2)/2, z);          // spokes hub -> rim
        this.box(.08, .62, 1.4, this.mats.cream, arm, 0, RR, 0);                                       // radial paddle vane, dips deep into the water
      }
      Wt.visible = false;
      if (i === 0) this.buildSensors(g, Y);                                        // sensors are shown on the first unit
    }
  }
  // sensors and microcontroller: only drawn when chosen in the panel
  buildSensors(P, Y) {
    const S = this.sensors = {};
    const mast = new T.Group(); mast.position.set(-3.3, 0, -1.0); P.add(mast); S.mast = mast;
    // Bolted feet and knee braces give each sensor a visible load path to the roof/deck.
    this.box(.5, .1, .5, this.mats.black, mast, 0, .05, 0);
    this.cyl(.065, 3.2, this.mats.steel, mast, 0, 1.6, 0);
    for (const x of [-.18, .18]) for (const z of [-.18, .18]) {
      this.cyl(.035, .045, this.mats.steel, mast, x, .12, z);
      this.strut(mast, [x, .1, z], [0, .65, 0], .025, this.mats.steel);
    }
    const cup = new T.Group(); cup.position.y = 3.3; mast.add(cup); S.cup = cup; this.cyl(.025, .3, this.mats.steel, cup, 0, -.1, 0);
    const spin = new T.Group(); cup.add(spin); S.cupSpin = spin;
    for (let i = 0; i < 3; i++) { const a = i*Math.PI*2/3; const arm = this.box(.5, .02, .02, this.mats.steel, spin, Math.cos(a)*.22, 0, Math.sin(a)*.22); arm.rotation.y = -a; this.sphere(.09, this.mats.black, spin, Math.cos(a)*.45, 0, Math.sin(a)*.45); }
    S.cupBody = this.cyl(.07, .2, this.mats.black, cup, 0, -.18, 0); S.cupInd = this.cyl(.1, .1, this.mats.black, cup, 0, -.2, 0);
    const us = new T.Group(); us.position.y = 3.3; mast.add(us); S.ultra = us;
    this.cyl(.15, .3, this.mats.white, us, 0, 0, 0);
    this.cyl(.18, .07, this.mats.black, us, 0, -.13, 0);                         // mast/body clamp
    this.cyl(.07, .14, this.mats.steel, us, 0, .2, 0);                          // body -> lower plate
    this.cyl(.34, .08, this.mats.black, us, 0, .27, 0);
    for (const [dx, dz] of [[.18, .18], [-.18, .18], [.18, -.18], [-.18, -.18]]) {
      this.cyl(.035, .56, this.mats.steel, us, dx, .58, dz);                   // overlaps both plates
      for (const y of [.32, .84]) this.cyl(.06, .065, this.mats.white, us, dx, y, dz); // sockets at both ends
    }
    this.cyl(.34, .08, this.mats.black, us, 0, .89, 0);                        // connected upper plate
    this.cyl(.25, .035, this.mats.white, us, 0, .94, 0);                       // weather cap
    const hall = new T.Group(); hall.position.set(-.4, Y + .22, 0); P.add(hall); S.hall = hall; this.box(.14, .12, .1, this.mats.black, hall); this.box(.04, .04, .04, this.mats.led, hall, 0, -.08, 0);
    const co2 = new T.Group(); co2.position.set(AX + .98, -.35, 0); P.add(co2); S.co2 = co2; this.box(.34, .22, .22, this.mats.black, co2); this.box(.14, .08, .02, this.mats.led, co2, 0, 0, .12);
    const doP = new T.Group(); doP.position.set(AX + 1.2, 0, 5.0); P.add(doP); S.doProbe = doP; this.box(.3, .2, .2, this.mats.black, doP, 0, .35, 0); this.cyl(.035, 1.7, this.mats.black, doP, 0, -.55, 0); this.cyl(.06, .3, this.mats.steel, doP, 0, -1.35, 0);
    const rain = new T.Group(); rain.position.set(-2.6, 0, -1.0); P.add(rain); S.rain = rain;
    this.box(.42, .1, .42, this.mats.black, rain, 0, .05, 0);
    for (const x of [-.14, .14]) for (const z of [-.14, .14]) this.cyl(.03, .045, this.mats.steel, rain, x, .12, z);
    this.cyl(.06, 3.0, this.mats.steel, rain, 0, 1.5, 0);
    this.strut(rain, [-.17, .1, 0], [0, .55, 0], .025, this.mats.steel);
    this.strut(rain, [.17, .1, 0], [0, .55, 0], .025, this.mats.steel);
    this.cyl(.11, .16, this.mats.white, rain, 0, 2.96, 0);                    // post clamp under the tilt joint
    this.sphere(.095, this.mats.steel, rain, 0, 3.03, 0);
    const rainHead = new T.Group(); rainHead.position.y = 3.06; rainHead.rotation.z = .35; rain.add(rainHead);
    this.box(.26, .16, .2, this.mats.steel, rainHead, 0, .02, 0);             // bracket touches joint and plate
    this.box(.46, .06, .36, this.mats.black, rainHead, 0, .11, 0);
    const temp = new T.Group(); temp.position.set(AX - 1.2, 0, 5.0); P.add(temp); S.temp = temp; this.box(.25, .16, .16, this.mats.black, temp, 0, .3, 0); this.cyl(.03, 1.4, this.mats.steel, temp, 0, -.4, 0); this.sphere(.07, this.mats.black, temp, 0, -1.1, 0);
    const mc = new T.Group(); mc.position.set(-2.7, this.mode === 'air' ? 1.0 : .75, this.mode === 'air' ? 1.4 : .9); P.add(mc); S.mcu = mc; this.cyl(.05, 1.0, this.mats.steel, mc, 0, -.55, 0); this.box(.7, .5, .35, this.mats.black, mc);
    S.mcuLed = this.mesh(new T.SphereGeometry(.05, 12, 8), this.mats.led.clone(), mc, .22, .15, .19); this.box(.4, .22, .01, this.mat('#2e5d44', .5, .2), mc, -.05, -.02, .18);
    const enc = new T.Group(); enc.position.copy(mc.position); P.add(enc); S.enclosure = enc; this.box(.9, .7, .5, this.mats.glass, enc);
    for (const k of ['cup', 'ultra', 'hall', 'co2', 'doProbe', 'rain', 'temp', 'mcu', 'enclosure']) S[k].visible = false;
    S.mast.visible = false;
  }
  setHardware(hw, p) {
    const S = this.sensors; if (!S) return;
    const w = p.windSensor;
    S.cup.visible = w === 'cup_hobby' || w === 'cup_ind'; S.ultra.visible = w === 'ultra'; S.mast.visible = S.cup.visible || S.ultra.visible; S.hall.visible = w === 'hall';
    S.co2.visible = this.mode === 'air' && p.qualitySensor !== 'none'; S.doProbe.visible = this.mode === 'water' && p.qualitySensor !== 'none';
    S.rain.visible = this.mode === 'air' && p.envSensor !== 'none'; S.temp.visible = this.mode === 'water' && p.envSensor !== 'none';
    S.mcu.visible = p.mcu !== 'none'; S.enclosure.visible = p.mcu !== 'none' && p.enclosure !== 'none';
    const st = hw.items.mcu.res ? hw.items.mcu.res.status : 'ok';
    const c = st === 'fail' ? '#ff5a4d' : st === 'warn' ? '#ffc04d' : '#6fe08a';
    S.mcuLed.material.color.set(c); S.mcuLed.material.emissive.set(c);
  }

  /* ---------------- layout-dependent shells ---------------- */
  // Prototype positions. Air: up to two rows on the roof. Water: one row on the deck behind the basin.
  unitPos(i) {
    const n = this.count;
    if (this.mode === 'air') {
      const g = grid(n, true), c = i % g.cols, r = Math.floor(i / g.cols);
      return {x: (c - (g.cols - 1)/2)*PITCH_X + .33, y: ROOF_TOP, z: (r - (g.rows - 1)/2)*PITCH_Z - 1.8};
    }
    return this.unitFrame(i);
  }
  // pond: the unit rides on a boat. boatPose[b] is the hull centre; the unit origin sits behind it on the deck.
  unitFrame(i) {
    const b = Math.floor(i/this.upb), j = i % this.upb, bs = this.boatPose[b] || {x:0, z:0, ry:0, heave:0}, s = BOAT_S;
    const xo = (j - (this.upb - 1)/2)*BOAT_PITCH, c = Math.cos(bs.ry), sn = Math.sin(bs.ry);
    const ox = bs.x - s*(AX*c + 2.2*sn), oz = bs.z - s*(-AX*sn + 2.2*c);
    return {x: ox + s*xo*c, z: oz - s*xo*sn, y: WATER_Y + DECK_DROP*s + bs.heave, ry: bs.ry, s, ox, oz, hy: WATER_Y + DECK_DROP*s + bs.heave};
  }
  wheelPos(i) { const f = this.unitFrame(i), c = Math.cos(f.ry), sn = Math.sin(f.ry); return {x: f.x + f.s*(AX*c + WHEEL_Z*sn), z: f.z + f.s*(-AX*sn + WHEEL_Z*c)}; }
  layout(p) {
    const n = clamp(Math.round(p.units), 1, MAX_UNITS); this.count = n; let key;
    if (this.mode === 'air') {
      const FA = Math.max(4, p.room / WALL_H), g = grid(n, true);     // room volume sets the floor area
      this.roomW = Math.max((g.cols - 1)*PITCH_X + 6, Math.sqrt(FA*1.6));
      this.roomD = Math.max((g.rows - 1)*PITCH_Z + 6, FA / this.roomW);
      this.extent = Math.max(this.roomW, this.roomD);
      key = ['air', n, this.roomW.toFixed(2), this.roomD.toFixed(2)].join('|');
    } else {
      const boats = clamp(Math.round(p.boats), 1, MAX_BOATS), upb = clamp(Math.round(p.upb), 1, MAX_UPB), mount = p.mount === 'anchored' ? 'anchored' : 'boat';
      this.boats = boats; this.upb = upb; this.mount = mount; this.count = boats*upb;
      const bw = upb*BOAT_PITCH*BOAT_S, A = Math.max(6, p.pond*.55), lanes = boats > 3 ? 2 : 1;
      const Lneed = mount === 'anchored' ? boats*(bw + 2) + 8 : 20 + boats*2.4 + upb*3, Wneed = mount === 'anchored' ? 12 : (lanes === 2 ? 26 : 16);
      this.pondL = clamp(Math.max(Lneed, Math.sqrt(A*1.5)), 14, 48);
      this.pondW = clamp(Math.max(Wneed, A/this.pondL), 11, 30);
      this.extent = Math.max(this.pondL, this.pondW*1.3);
      key = ['water', boats, upb, mount, this.pondL.toFixed(2), this.pondW.toFixed(2)].join('|');
    }
    if (key !== this.layoutKey) { this.layoutKey = key; this.buildShell(); }
    const R = Math.max(12, this.extent*.7), sc = this.sun.shadow.camera;
    sc.left = -R; sc.right = R; sc.top = R; sc.bottom = -R; sc.far = Math.max(60, R*4); sc.updateProjectionMatrix();
    this.sun.position.set(-R*.6, R*1.1, R*.75);
  }
  buildShell() {
    this.shell.clear(); this.trees = []; this.fish = []; this.rings = []; this.rainRings = []; this.people = []; this.panes = []; this.water = null;
    if (this.mode === 'air') this.buildRoomShell(); else this.buildPondShell();
    this.buildTrees();
  }
  // the original cutaway building: floor, side and back walls, open front, windows, occupants, desk
  buildRoomShell() {
    const S = this.shell, m = this.mats, W = this.roomW, D = this.roomD, n = this.count;
    this.box(W + .6, FLOOR_TOP, D + .6, m.concrete, S, 0, FLOOR_TOP/2, 0);
    this.box(.16, WALL_H, D, m.cream, S, -W/2, FLOOR_TOP + WALL_H/2, 0);
    this.box(.16, WALL_H, D, m.cream, S, W/2, FLOOR_TOP + WALL_H/2, 0);
    this.box(W, WALL_H, .16, m.cream, S, 0, FLOOR_TOP + WALL_H/2, -D/2);
    // roof covers the back of the building and the prototype bases; the front stays open as a cutaway
    let roofEnd = -D/2 + 1;
    for (let i = 0; i < n; i++) roofEnd = Math.max(roofEnd, this.unitPos(i).z + 1.4);
    const z0 = -D/2 - .1, z1 = roofEnd;
    this.box(W + .4, .2, z1 - z0, m.concrete, S, 0, 3.6, (z0 + z1)/2);
    // desk and monitor
    const dx = -W/2 + 1.35;
    this.box(1.5, .08, .8, m.wood, S, dx, .95, 0);
    for (const [lx, lz] of [[-.65, -.32], [.65, -.32], [-.65, .32], [.65, .32]]) this.box(.07, .9, .07, m.dark, S, dx + lx, .45, lz);
    this.box(.5, .32, .035, m.dark, S, dx - .1, 1.25, -.12);
    // windows on both side walls; opening follows background ventilation
    const nW = Math.max(1, Math.floor(D/2.6));
    for (const side of [-1, 1]) for (let k = 0; k < nW; k++) {
      const cell = D/nW, w = cell*.7, zc = -D/2 + (k + .5)*cell;
      const piv = new T.Group(); piv.position.set(side*(W/2 + .1), 1.8, zc - w/2); S.add(piv);
      const pane = new T.Mesh(new T.BoxGeometry(.05, 1.5, w), m.win); pane.position.set(0, 0, w/2); piv.add(pane);
      this.panes.push({piv, sign: side});
    }
    // community-clinic details from the poster: waiting-room desks with seated occupants, health cross, door, plants, fresh-air louvre
    const cols = Math.max(2, Math.floor((W - 1.4)/.85)), rows = Math.ceil(MAX_PEOPLE/cols), zS = -D/2 + 1.0, zE = D/2 - 1.6, step = rows > 1 ? Math.max(1.05, (zE - zS)/(rows - 1)) : 0;
    const xs = c => -W/2 + .9 + c*(W - 1.8)/Math.max(1, cols - 1), F = FLOOR_TOP;
    for (let r = 0; r < rows; r++) {
      const z = zS + r*step;
      this.box(W - 1.2, .06, .5, m.wood, S, 0, F + .76, z + .55);
      for (const lx of [-W/2 + .8, W/2 - .8]) this.box(.06, .74, .4, m.dark, S, lx, F + .37, z + .55);
    }
    for (let k = 0; k < MAX_PEOPLE; k++) {
      const c = k % cols, r = Math.floor(k/cols), g = new T.Group(); g.position.set(xs(c), F, zS + r*step); S.add(g); this.people.push(g);
      this.box(.4, .05, .4, m.dark, g, 0, .46, 0); this.box(.4, .4, .05, m.dark, g, 0, .72, -.2);                         // chair
      this.cyl(.15, .52, k % 2 ? m.shirtB : m.shirtA, g, 0, .76, 0); this.sphere(.13, m.skin, g, 0, 1.13, 0);               // seated torso and head
      for (const dx of [-.08, .08]) { this.cyl(.05, .42, m.dark, g, dx, .53, .2, 'z'); this.cyl(.045, .44, m.dark, g, dx, .27, .41); }   // thighs and shins
    }
    const bz = -D/2 + .1;
    this.box(1.15, 1.15, .03, m.white, S, -W/2 + 2.4, F + 2.1, bz); this.box(.78, .2, .04, m.cross, S, -W/2 + 2.4, F + 2.1, bz + .02); this.box(.2, .78, .04, m.cross, S, -W/2 + 2.4, F + 2.1, bz + .02);   // health cross
    this.box(.95, 2.1, .05, m.wood, S, W/2 - 1.3, F + 1.05, bz); this.sphere(.04, m.gold, S, W/2 - 1.62, F + 1.0, bz + .05);                                                   // door
    for (const px of [W/2 - .55, -W/2 + .5]) { this.cyl(.17, .32, m.trunk, S, px, F + .16, -D/2 + .6); for (let j = 0; j < 3; j++) this.sphere(.2 - j*.03, m.leaf2, S, px + (j - 1)*.08, F + .5 + j*.18, -D/2 + .6); }  // plants
    for (let j = 0; j < 5; j++) this.box(.04, .07, .95, m.white, S, -W/2 + .12, F + .45 + j*.15, -D/2 + 1.6);              // fresh-air louvre low on the side wall
    // canyon blocks (environment option) and the path
    this.canyon = new T.Group(); S.add(this.canyon);
    for (const k of [-1, 1]) this.canyonBlock(this.canyon, k*(W/2 + 6), 0);
    this.box(W + 8, .12, 1.3, m.path, S, 0, .06, D/2 + 2.6);
    this.parkBench(S, W/2 + 2.2, D/2 + 1.2);
  }
  // the original pond: basin with rim, timber walkway and deck, fish, reeds, ripples
  // pontoon boat hull in unit-local coordinates (bow +z, deck top at y = 0, waterline at y = -DECK_DROP)
  buildHull(parent, upb) {
    const m = this.mats;
    for (let j = 0; j < upb; j++) {
      const xo = (j - (upb - 1)/2)*BOAT_PITCH;
      for (const sx of [-2.15, 2.15]) {                                                    // two white PLA floats per unit
        const px = xo + AX + sx;
        this.cyl(.4, 6.4, m.pontoon, parent, px, -.46, 2.2, 'z');
        this.sphere(.4, m.pontoon, parent, px, -.46, -1.0); this.sphere(.4, m.pontoon, parent, px, -.46, 5.4);
      }
      this.box(4.9, .1, 1.0, m.wood, parent, xo + AX, -.05, 5.0);                          // bow beam carries the front wheel support
      for (const z of [-.6, 1.6]) this.box(4.9, .08, .14, m.black, parent, xo + AX, -.18, z + .2);
    }
    this.box(upb*BOAT_PITCH, .1, 3.4, m.wood, parent, 0, -.05, .7);                          // stern deck: rotor stands, gears, electronics, rear wheel support
    for (let k = 0; k < 8; k++) this.box(upb*BOAT_PITCH, .012, .03, m.plank, parent, 0, .002, -.9 + k*.43);
    this.box(upb*BOAT_PITCH, .14, .06, m.pontoon, parent, 0, .08, -1.0);                      // stern rail
  }
  // the pond: deep basin, timber shore deck, fish, reeds; units ride on pontoon boats (moving, or moored)
  buildPondShell() {
    const S = this.shell, m = this.mats, L = this.pondL, W = this.pondW, zc = POND_BACK + W/2; this.pondZc = zc;
    this.box(L + 2, POND_Y, 5.2, m.wood, S, 0, POND_Y/2, POND_BACK - 2.6);                    // timber deck behind the basin
    for (let i = 0; i < 13; i++) this.box(L + 2, .01, .03, m.plank, S, 0, POND_Y + .005, POND_BACK - 5.0 + i*.4);
    this.box(L, .2, W, m.basin, S, 0, -.4, zc);                                                // basin floor (deep, so the wheel hangs well under water)
    this.box(L + .5, 1.38, .24, m.concrete, S, 0, .39, POND_BACK + W + .12);                  // rims
    this.box(.24, 1.38, W + .24, m.concrete, S, -L/2 - .12, .39, zc);
    this.box(.24, 1.38, W + .24, m.concrete, S, L/2 + .12, .39, zc);
    this.box(L + .5, 1.38, .24, m.concrete, S, 0, .39, POND_BACK - .12);
    this.water = new T.Mesh(new T.PlaneGeometry(L, W, Math.max(16, Math.round(L*2)), Math.max(10, Math.round(W*2))), m.water);
    this.water.rotation.x = -Math.PI/2; this.water.position.set(0, WATER_Y, zc); this.water.receiveShadow = true; this.water.renderOrder = 2; S.add(this.water);
    // paddle ripples (three per unit) and rain rings
    for (let i = 0; i < MAX_UNITS*3; i++) { const r = new T.Mesh(new T.TorusGeometry(.25 + (i%3)*.35, .012, 6, 50), m.ripple); r.rotation.x = -Math.PI/2; r.visible = false; S.add(r); this.rings.push(r); }
    for (let i = 0; i < 16; i++) { const r = new T.Mesh(new T.RingGeometry(.12, .16, 20), m.ripple); r.rotation.x = -Math.PI/2; r.position.set((Math.random() - .5)*L*.9, WATER_Y + .015, POND_BACK + .3 + Math.random()*(W - .6)); r.userData.seed = Math.random(); r.visible = false; S.add(r); this.rainRings.push(r); }
    // fish: count follows oxygen demand, they gather at the surface when oxygen is short
    for (let i = 0; i < MAX_FISH; i++) {
      const g = new T.Group(); const body = new T.Mesh(new T.SphereGeometry(.14, 12, 8), m.fish); body.scale.set(2, .55, .7); g.add(body);
      const tail = new T.Mesh(new T.ConeGeometry(.16, .23, 3), m.fishTail); tail.rotation.z = Math.PI/2; tail.position.x = -.3; g.add(tail);
      g.userData.home = {x: -L/2 + 1.2 + (i%4)*(L - 2.4)/3, z: POND_BACK + 1 + (Math.floor(i/4) + .5)*(W - 2)/2};
      g.position.set(g.userData.home.x, .55, g.userData.home.z); S.add(g); this.fish.push(g);
    }
    // reeds along both banks
    for (let i = 0; i < 8; i++) {
      const side = i % 2 ? 1 : -1, x = side*(L/2 + 1.0 + (i >> 2)*.4), z = POND_BACK + .8 + ((i >> 1) % 4)*(W - 1.6)/3, h = 1.0 + (i % 3)*.3;
      this.cyl(.02, h, m.reed, S, x, -.3 + h/2, z); this.cyl(.06, .25, m.cattail, S, x, -.3 + h - .12, z);
    }
    // boats: one hull group per boat; moving boats circle the pond on oval lanes, moored boats sit in a row at the deck
    this.boatGroups = []; this.boatPose = []; this.boatTheta = []; this.lanes = []; this.laneOf = [];
    const bw = this.upb*BOAT_PITCH*BOAT_S, margin = Math.max(bw/2, 2.2) + 1.2, nl = this.boats > 3 ? 2 : 1;
    const a0 = Math.max(2, L/2 - margin), b0 = Math.max(1.2, W/2 - margin);
    this.lanes.push({a: a0, b: b0}); if (nl === 2) this.lanes.push({a: a0*.6, b: Math.max(.8, b0 - (bw + 2.4))});
    for (let b = 0; b < this.boats; b++) {
      const bg = new T.Group(); S.add(bg); this.buildHull(bg, this.upb); this.boatGroups.push(bg);
      const lane = b % nl, k = Math.floor(b/nl), cnt = Math.ceil((this.boats - lane)/nl);
      this.laneOf.push(lane); this.boatTheta.push(k/cnt*Math.PI*2 + lane*.9); this.boatPose.push({x:0, z:zc, ry:0, heave:0});
      if (this.mount === 'anchored') {                                                   // mooring posts on the rim in front of each boat
        const x = (b - (this.boats - 1)/2)*(bw + 2);
        for (const dx of [-bw*.3, bw*.3]) this.cyl(.1, 1.1, m.trunk, S, x + dx, 1.35, POND_BACK - .05);
      }
    }
    this.poseBoats(0);
    this.canyon = new T.Group(); S.add(this.canyon);
    for (const k of [-1, 1]) this.canyonBlock(this.canyon, k*(L/2 + 6.5), zc);
    this.box(L + 8, .12, 1.3, m.path, S, 0, .06, POND_BACK + W + 2.6);
    this.parkBench(S, L/2 - 1.2, POND_BACK + W + 1.9);
  }
  // hull centre pose for every boat (moving: oval lanes, heading along the lane; moored: fixed row, bow to the pond)
  poseBoats(t) {
    const s = BOAT_S, bw = this.upb*BOAT_PITCH*s;
    for (let b = 0; b < this.boats; b++) {
      const P = this.boatPose[b], amp = (.012 + .05*this.rainAmt + (this.storm ? .06 : 0))*1; P.heave = Math.sin(t*1.4 + b*1.9)*amp;
      if (this.mount === 'anchored') { P.x = (b - (this.boats - 1)/2)*(bw + 2); P.z = POND_BACK + 3.3; P.ry = 0; }
      else { const ln = this.lanes[this.laneOf[b]] || this.lanes[0], th = this.boatTheta[b]; P.x = ln.a*Math.cos(th); P.z = this.pondZc + ln.b*Math.sin(th); P.ry = Math.atan2(-ln.a*Math.sin(th), ln.b*Math.cos(th)); }
      const g = this.boatGroups[b]; if (!g) continue;
      const f = this.unitFrame(b*this.upb);
      g.position.set(f.ox, f.hy, f.oz); g.rotation.set(0, P.ry, 0); g.scale.setScalar(s);
    }
  }
  canyonBlock(parent, x, z) {
    this.box(2.4, 9, 6, this.mat('#65776b'), parent, x, 4.5, z);
    for (let y = 0; y < 8; y++) for (let k = 0; k < 4; k++) this.box(.03, .42, .6, this.mat('#456158'), parent, x - Math.sign(x)*1.22, .6 + y, z - 2.1 + k*1.3);
  }
  parkBench(parent, x, z) {
    this.box(1.6, .12, .5, this.mat('#95845c'), parent, x, .7, z); this.box(1.6, .45, .1, this.mat('#95845c'), parent, x, 1.0, z + .25);
    for (const dx of [-.65, .65]) this.box(.08, .5, .4, this.mats.dark, parent, x + dx, .4, z);
  }
  buildTrees() {
    const S = this.shell; let spots;
    if (this.mode === 'air') { const W = this.roomW; spots = [[-(W/2 + 2.8), 2.2], [-(W/2 + 3.6), -2.5], [-(W/2 + 2.4), -.6], [W/2 + 2.8, 2.6], [W/2 + 3.6, -1.8], [W/2 + 2.4, .2]]; }
    else { const L = this.pondL, W = this.pondW; spots = [[-(L/2 + 2.4), POND_BACK + 1], [-(L/2 + 3.6), POND_BACK + W*.6], [L/2 + 2.4, POND_BACK + W*.3], [L/2 + 3.6, POND_BACK + W*.9], [-(L/2 + 2.2), POND_BACK + W + 2.8], [L/2 + 2.2, POND_BACK + W + 3.2], [-4, -6.2], [5, -6.6]]; }
    for (const [x, z] of spots) {
      const tree = new T.Group(); tree.position.set(x, -.3, z); S.add(tree);
      this.cyl(.12, 1.7, this.mats.trunk, tree, 0, .85, 0);
      for (let j = 0; j < 3; j++) { const leaf = this.sphere(.72 - j*.12, j % 2 ? this.mats.leaf2 : this.mats.leaf, tree, j === 1 ? .3 : 0, 1.8 + j*.48, 0); leaf.scale.y = 1.25; }
      this.trees.push(tree);
    }
  }

  /* ---------------- particles ---------------- */
  buildFx() {
    const F = this.fx;
    this.flowN = 140; this.flowSeed = Array.from({length: this.flowN}, () => [Math.random(), Math.random(), Math.random()]);
    this.flowGeo = this.pointGeo(this.flowN); this.flow = new T.Points(this.flowGeo, new T.PointsMaterial({color:'#e9f5d6', size:.05, transparent:true, opacity:.7, depthWrite:false})); F.add(this.flow);
    this.stackN = 24; this.stackSeed = Array.from({length: MAX_UNITS*this.stackN}, () => [Math.random(), Math.random(), Math.random()]);
    this.stackGeo = this.pointGeo(MAX_UNITS*this.stackN); this.stackPts = new T.Points(this.stackGeo, new T.PointsMaterial({color:'#d9f2c4', size:.06, transparent:true, opacity:.8, depthWrite:false})); F.add(this.stackPts);
    this.ventN = 24; this.ventSeed = Array.from({length: this.ventN}, () => [Math.random(), Math.random(), Math.random()]);
    this.ventGeo = this.pointGeo(this.ventN); this.vent = new T.Points(this.ventGeo, new T.PointsMaterial({color:'#bfe9ff', size:.07, transparent:true, opacity:.7, depthWrite:false})); F.add(this.vent);
    this.splashN = 12; this.splashGeo = this.pointGeo(MAX_UNITS*this.splashN); this.splash = new T.Points(this.splashGeo, new T.PointsMaterial({color:'#b9e0d6', size:.05, transparent:true, opacity:.85, depthWrite:false})); F.add(this.splash);
    this.heatN = 70; this.heatSeed = Array.from({length: this.heatN}, () => [Math.random(), Math.random(), Math.random()]);
    this.heatGeo = this.pointGeo(this.heatN); this.heatPts = new T.Points(this.heatGeo, new T.PointsMaterial({color:'#ffe2a8', size:.09, transparent:true, opacity:.5, depthWrite:false})); F.add(this.heatPts);
    this.boltGeo = this.pointGeo(9); this.bolt = new T.Line(this.boltGeo, new T.LineBasicMaterial({color:'#f4fbff', fog:false})); this.bolt.visible = false; F.add(this.bolt);
    // rain streaks
    const n = 700, positions = new Float32Array(n*6);
    for (let i = 0; i < n; i++) { const x = (Math.random() - .5)*34, y = Math.random()*14, z = (Math.random() - .5)*26; positions.set([x, y, z, x - .12, y + .42, z], i*6); }
    this.rainGeo = new T.BufferGeometry(); this.rainGeo.setAttribute('position', new T.BufferAttribute(positions, 3));
    this.rain = new T.LineSegments(this.rainGeo, new T.LineBasicMaterial({color:'#b8d1c7', transparent:true, opacity:.5})); this.rain.visible = false; this.env.add(this.rain);
  }

  /* ---------------- environment, layout and view ---------------- */
  setEnvironment(s, p) {
    this.settings = p; this.scenario = s;
    this.storm = s.weather === 'storm'; this.night = s.weather === 'night';
    this.rainAmt = clamp(p.rain, 0, 1);
    this.haze = Math.max(smooth(28, 46, p.ambient), s.weather === 'heat' ? .6 : 0);
    this.layout(p);
    const air = this.mode === 'air';
    this.rotorGroups.forEach(g => g.scale.setScalar(p.diameter));
    this.units.forEach(u => { const r = .2 + .06*p.ratio; u.goldAir.scale.set(r, 1, r); u.goldWater.scale.set(r, r, 1); });
    this.people.forEach((g, k) => g.visible = air && k < p.people);
    const ach = clamp((p.backgroundACH - .2)/1.8, 0, 1);
    this.panes.forEach(pn => pn.piv.rotation.y = pn.sign*ach*1.1);
    const bars = Math.round(clamp(p.pressure/8, 1, 10));
    this.units.forEach(u => u.bars.forEach((bar, k) => bar.visible = air && k < bars));
    if (this.canyon) this.canyon.visible = s.environment === 'canyon';
    if (this.water) {
      const c = this.mats.water.color, t = clamp((p.temp - 10)/20, 0, 1);
      c.set('#1f6f86').lerp(new T.Color('#4a8f78'), t).multiplyScalar(1 - .25*p.oxygenDemand);
      if (this.night) c.multiplyScalar(.55);
      if (this.storm) c.lerp(new T.Color('#3f6d64'), .4);
    }
    this.placeUnits(); this.applyView();
  }
  applyView() {
    const bench = this.view === 'bench';
    this.env.visible = !bench; this.shell.visible = !bench; this.fx.visible = !bench; this.table.visible = bench; this.benchSlab.visible = this.mode === 'air';
    this.placeUnits();
  }
  placeUnits() {
    if (!this.settings) return;
    const bench = this.view === 'bench', air = this.mode === 'air';
    this.units.forEach((u, i) => {
      u.g.visible = bench ? i === 0 : i < this.count;
      u.g.rotation.set(0, 0, 0);
      if (bench) { if (air) { u.g.position.set(-.2, .9, .2); u.g.scale.setScalar(1.25); } else { u.g.position.set(-AX, DECK_DROP, -1.2); u.g.scale.setScalar(1); } }
      else if (air) { const q = this.unitPos(i); u.g.position.set(q.x, q.y, q.z); u.g.scale.setScalar(1); }
      else { const f = this.unitFrame(i); u.g.position.set(f.x, f.y, f.z); u.g.rotation.y = f.ry; u.g.scale.setScalar(f.s); }
      u.airOut.visible = air; u.waterOut.visible = !air;
    });
    if (this.benchBoat) this.benchBoat.visible = bench;
    if (this.benchWater) this.benchWater.visible = bench;
    this.table.position.y = air ? 0 : -1.5;
  }
  setView(view) {
    this.view = view; this.applyView();
    if (view === 'bench') { if (this.mode === 'air') { this.target.set(-.5, 1.0, .5); this.distance = 8.5; this.angle = .75; this.elevation = .3; } else { this.target.set(0, .8, 1.4); this.distance = 11; this.angle = .95; this.elevation = .3; } this.scene.background.set('#c9d3c0'); this.scene.fog.color.set('#c9d3c0'); }
    else {
      if (this.mode === 'air') this.target.set(0, 1.9, 0); else this.target.set(0, .9, this.pondZc);
      this.distance = clamp(12 + this.extent*.5, 12, 36); this.angle = .8; this.elevation = .42;
    }
    this.cameraPosition();
  }
  setFlows(on) { this.flows = on; }
  zoomBy(f) { this.distance = T.MathUtils.clamp(this.distance*f, 4, 40); this.cameraPosition(); }              // f < 1 zooms in, f > 1 zooms out
  orbitBy(dAngle, dElev = 0) { this.angle += dAngle; this.elevation = T.MathUtils.clamp(this.elevation + dElev, .05, 1.35); this.cameraPosition(); }
  cameraPosition() { this.camera.position.set(this.target.x + Math.sin(this.angle)*Math.cos(this.elevation)*this.distance, this.target.y + Math.sin(this.elevation)*this.distance, this.target.z + Math.cos(this.angle)*Math.cos(this.elevation)*this.distance); this.camera.lookAt(this.target); }
  resize() { const w = this.host.clientWidth, h = this.host.clientHeight; if (w && h) { this.renderer.setSize(w, h, false); this.camera.aspect = w/h; this.camera.updateProjectionMatrix(); } }
  bind() {
    const c = this.renderer.domElement; this.pointers = new Map(); let old = null, dist = 0;
    c.addEventListener('pointerdown', e => { this.pointers.set(e.pointerId, [e.clientX, e.clientY]); c.setPointerCapture(e.pointerId); old = [e.clientX, e.clientY]; dist = 0; });
    c.addEventListener('pointermove', e => { if (!this.pointers.has(e.pointerId)) return; this.pointers.set(e.pointerId, [e.clientX, e.clientY]);
      if (this.pointers.size === 2) { const a = [...this.pointers.values()]; const d = Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]); if (dist) this.distance = T.MathUtils.clamp(this.distance*dist/d, 4, 40); dist = d; }
      else if (old) { this.angle -= (e.clientX - old[0])*.007; this.elevation = T.MathUtils.clamp(this.elevation + (e.clientY - old[1])*.005, .05, 1.35); }
      old = [e.clientX, e.clientY]; this.cameraPosition(); });
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) c.addEventListener(ev, e => { this.pointers.delete(e.pointerId); old = null; dist = 0; });
    c.addEventListener('wheel', e => { e.preventDefault(); this.distance = T.MathUtils.clamp(this.distance*Math.exp(e.deltaY*.001), 4, 40); this.cameraPosition(); }, {passive:false});
    c.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', 'Home'].includes(e.key)) { e.preventDefault();
      if (e.key === 'ArrowLeft') this.angle -= .12; if (e.key === 'ArrowRight') this.angle += .12; if (e.key === 'ArrowUp') this.elevation = Math.min(1.35, this.elevation + .08); if (e.key === 'ArrowDown') this.elevation = Math.max(.05, this.elevation - .08);
      if (e.key === '+') this.distance = Math.max(4, this.distance - 1); if (e.key === '-') this.distance = Math.min(40, this.distance + 1); if (e.key === 'Home') this.setView(this.view); this.cameraPosition(); } });
  }

  /* ---------------- weather events ---------------- */
  strike() {
    const x = (Math.random() - .5)*34, z = (Math.random() - .5)*24, a = new Float32Array(9*3);
    let cx = x, cz = z;
    for (let k = 0; k < 9; k++) { a[k*3] = cx; a[k*3+1] = 24 - k*3; a[k*3+2] = cz; cx += (Math.random() - .5)*2.6; cz += (Math.random() - .5)*2.6; }
    this.boltGeo.setAttribute('position', new T.BufferAttribute(a, 3)); this.boltGeo.attributes.position.needsUpdate = true;
    this.flashLight.position.set(x, 14, z); this.flashT = .25;
  }
  applySky(fl) {
    if (this.view === 'bench') return;
    const r = this.rainAmt, h = this.haze, c = this._sky || (this._sky = new T.Color()), tmp = this._tmp || (this._tmp = new T.Color());
    c.set(this.night ? '#1b2e37' : '#839e88');
    c.lerp(tmp.set(this.storm ? '#3a5452' : '#6c8478'), r*.8);
    if (this.storm) c.lerp(tmp.set('#2f4543'), .45);
    c.lerp(tmp.set('#bfae7a'), h*.6);
    if (fl > 0) c.lerp(tmp.set('#e4efff'), fl*.6);
    this.scene.background.copy(c); this.scene.fog.color.copy(c);
    this.scene.fog.density = (this.storm ? .04 : this.night ? .03 : .02) + h*.012 + r*.008;
    this.sun.intensity = this.night ? .35 : Math.max(.9, 3.2 - 1.6*r - .6*h) * (this.storm ? .5 : 1);
    this.sun.color.set(this.night ? '#8ebdce' : '#fff1cb').lerp(tmp.set('#ffcf8f'), h*.8);
    this.hemi.intensity = this.night ? 1.1 : this.storm ? 1.5 : 2.4;
    this.mats.cloud.color.set(this.night ? '#2b3c44' : this.storm ? '#4a5d5a' : r > .3 ? '#7f9188' : '#b4c3b3');
    this.clouds.visible = !this.night; this.stars.visible = this.night; this.moon.visible = this.night;
    this.roomLight.intensity = this.mode === 'air' && this.night ? 7 : 0;
  }

  /* ---------------- per-frame animation ---------------- */
  render(dt, sample, running) {
    if (!this.settings || !sample) return;
    const p = this.settings, air = this.mode === 'air', bench = this.view === 'bench';
    const anim = running ? dt : 0; this.time += anim; const t = this.time;
    const wind = sample.wind, rain = this.rainAmt, haze = this.haze;

    // rotating machinery: speed follows the simulated rotor
    const rot = sample.rpm*Math.PI*2/60*anim*.35;
    this.rotors.forEach(o => o.rotation.x += rot);
    this.gears.forEach(o => o.g.rotation.x += rot*o.sign);
    this.fans.forEach(o => o.rotation.z += rot/p.ratio);
    this.vfans.forEach(o => o.rotation.y -= rot/p.ratio);
    if (this.sensors && this.sensors.cupSpin) this.sensors.cupSpin.rotation.y += anim*wind*.8;
    // brake collars: red for the manual brake, amber for storm lock
    const stopped = !!sample.stopped;
    this.units.forEach((u, i) => { const show = i < this.count && !bench && (p.brake || stopped); u.brake.visible = show; if (show) u.brake.material = p.brake ? this.mats.brake : this.mats.storm; });

    // wind-driven trees: lean downwind and sway, more in gusts and storms
    const lean = Math.min(this.storm ? .6 : .5, wind*.022);
    this.trees.forEach((o, i) => { o.rotation.z = -(lean + (.02 + Math.min(.12, wind*.008))*Math.sin(t*2.2 + i*1.7)); o.rotation.x = .03*Math.sin(t*1.7 + i)*(.3 + wind*.05); });

    // windsock: full when the wind is up, drooping in lulls
    const infl = clamp((wind - 1)/5, 0, 1);
    this.sockPivot.rotation.z = -(1 - infl)*1.35 + Math.sin(t*(5 + wind))*.05*(.3 + infl);

    // clouds drift with the wind
    this.clouds.children.forEach(c => { c.position.x += anim*(.2 + wind*.12); if (c.position.x > 32) c.position.x -= 64; });

    // rain streaks and puddles (rain intensity setting)
    const rainN = Math.round(rain*700);
    this.rain.visible = rainN > 0 && !bench; this.rainGeo.setDrawRange(0, rainN*2); this.rain.material.opacity = .25 + .35*rain;
    if (rainN > 0 && running) {
      const a = this.rainGeo.attributes.position.array;
      for (let i = 0; i < rainN*6; i += 6) {
        a[i] += dt*(wind*.25 + 1.5); a[i+1] -= dt*11; a[i+3] = a[i] - .12; a[i+4] = a[i+1] + .42;
        if (a[i+1] < -.3) { const x = (Math.random() - .5)*34; a[i] = x; a[i+1] = 13; a[i+3] = x - .12; a[i+4] = 13.42; }
      }
      this.rainGeo.attributes.position.needsUpdate = true;
    }
    this.puddles.forEach(pd => { const s = smooth(pd.userData.th, pd.userData.th + .25, rain); pd.visible = s > .01 && !bench; pd.scale.setScalar(Math.max(.001, s*pd.userData.base)); });

    // storm debris, more with wind speed
    const debN = (this.storm ? 20 : 0) + Math.round(clamp((wind - 8)/10, 0, 1)*16);
    this.debris.forEach((d, i) => {
      d.visible = i < debN && !bench; if (!d.visible) return; const u = d.userData;
      d.position.x = ((u.x0 + t*(wind*.9 + 4)) % 36) - 18; d.position.y = u.y0 + Math.sin(t*3 + u.ph)*.35; d.position.z = u.z0 + Math.sin(t*.7 + u.ph)*.5;
      d.rotation.x = t*4 + u.ph; d.rotation.y = t*2.5 + u.ph;
    });

    // lightning in storms
    if (this.storm && running) { this.lightT -= dt; if (this.lightT <= 0) { this.strike(); this.lightT = 2.5 + Math.random()*4; } }
    this.flashT = Math.max(0, this.flashT - dt);
    const fl = this.flashT > 0 ? Math.min(1, this.flashT/.25) : 0;
    this.flashLight.intensity = fl*90; this.bolt.visible = fl > .05 && !bench;
    this.applySky(fl);

    // heat haze (ambient temperature): shimmering bands and rising particles
    this.hazeMat.opacity = haze*.07;
    this.hazes.forEach((h, i) => { h.visible = haze > .02 && !bench; h.position.x = Math.sin(t*.4 + i)*2.5; h.scale.y = 1 + .25*Math.sin(t*1.3 + i*2); });
    const heatN = Math.round(haze*70); this.heatPts.visible = heatN > 0 && !bench; this.heatGeo.setDrawRange(0, heatN);
    if (heatN > 0) { const a = this.heatGeo.attributes.position.array; for (let i = 0; i < heatN; i++) { const s = this.heatSeed[i], k = (s[0] + t*.08) % 1; a[i*3] = (s[1] - .5)*26 + Math.sin(t*.9 + i)*.5; a[i*3+1] = .3 + k*6; a[i*3+2] = (s[2] - .5)*18; } this.heatGeo.attributes.position.needsUpdate = true; }

    // wind streaks across the scene
    const flowOn = this.flows && wind > 0 && !bench; this.flow.visible = flowOn;
    if (flowOn) {
      const a = this.flowGeo.attributes.position.array, base = air ? 1.2 : .9;
      for (let i = 0; i < this.flowN; i++) { const s = this.flowSeed[i], u = (s[0] + t*Math.min(wind, 25)*.03) % 1; a[i*3] = -18 + u*36; a[i*3+1] = base + s[1]*(air ? 3.6 : 2.2); a[i*3+2] = (s[2] - .5)*(air ? 14 : 10); }
      this.flowGeo.attributes.position.needsUpdate = true;
    }

    // pond boats: drift around the oval lanes (faster in more wind); moored boats just bob
    if (!air && !bench && this.boatGroups.length) {
      if (this.mount === 'boat') { const sp = running ? (.5 + wind*.09) : 0; this.boatTheta.forEach((th, b) => { const ln = this.lanes[this.laneOf[b]] || this.lanes[0]; this.boatTheta[b] = th + dt*sp/Math.max(1.5, (ln.a + ln.b)/2); }); }
      this.poseBoats(t); this.placeUnits();
    }
    // exhaust: room air is drawn up through each fan, out through the roof opening and away above the roof
    const sa = this.stackGeo.attributes.position.array, fF = clamp(sample.airflow/700, .2, 1), yb = FLOOR_TOP + 1.5, yt = ROOF_TOP + 1.5, kf = (ROOF_TOP - .4 - yb)/(yt - yb);
    for (let i = 0; i < MAX_UNITS*this.stackN; i++) {
      const ui = Math.floor(i/this.stackN), s = this.stackSeed[i];
      if (!air || ui >= this.count) { sa[i*3+1] = -100; continue; }
      const q = this.unitPos(ui), k = (s[0] + t*.5*fF) % 1, rr = k < kf ? 1 - .55*(k/kf) : .3 + .25*(1 - (k - kf)/(1 - kf)), ang = s[1]*Math.PI*2, rad = Math.sqrt(s[2])*rr;
      sa[i*3] = q.x + AX + Math.cos(ang)*rad; sa[i*3+1] = yb + k*(yt - yb); sa[i*3+2] = q.z + Math.sin(ang)*rad;
    }
    this.stackGeo.attributes.position.needsUpdate = true;
    this.stackPts.visible = air && sample.airflow > 0 && this.flows && !bench;
    const ach = clamp((p.backgroundACH - .2)/1.8, 0, 1), ventN = air ? Math.round(ach*this.ventN) : 0;
    this.vent.visible = ventN > 0 && this.flows && !bench; this.ventGeo.setDrawRange(0, ventN);
    if (ventN > 0) {
      const va = this.ventGeo.attributes.position.array, W = this.roomW, D = this.roomD;
      for (let i = 0; i < this.ventN; i++) { const s = this.ventSeed[i], side = i % 2 ? 1 : -1, k = (s[0] + t*(.4 + ach)*.6) % 1; va[i*3] = side*(W/2 + 1.6 - k*2.2); va[i*3+1] = .7 + s[1]*2.2; va[i*3+2] = (s[2] - .5)*D*.85; }
      this.ventGeo.attributes.position.needsUpdate = true;
    }

    // pond: paddle splash and aeration bubbles, ripples, rain rings, fish
    const pond = !air && !bench;
    this.splash.visible = pond && sample.shaft > 0;
    const spa = this.splashGeo.attributes.position.array;
    for (let i = 0; i < MAX_UNITS*this.splashN; i++) {
      const ui = Math.floor(i/this.splashN), j = i % this.splashN;
      if (!pond || ui >= this.count) { spa[i*3+1] = -100; continue; }
      const q = this.wheelPos(ui), ph = (t*1.5 + j/this.splashN) % 1;
      spa[i*3] = q.x + Math.sin(j*7.3)*.5*BOAT_S*2; spa[i*3+1] = WATER_Y + .02 + Math.sin(ph*Math.PI)*Math.min(.6, sample.rpm*.01); spa[i*3+2] = q.z + Math.cos(j*2.1)*.45;
    }
    this.splashGeo.attributes.position.needsUpdate = true;
    this.rings.forEach((r, i) => {
      const ui = Math.floor(i/3), k = i % 3, on = pond && ui < this.count && sample.shaft > 0;
      r.visible = on; if (!on) return;
      const q = this.wheelPos(ui), s = (1 + ((t*.3 + k*.33) % 1)*1.6)*BOAT_S*1.3;
      r.position.set(q.x, WATER_Y + .02, q.z); r.scale.set(s, s, 1);
    });
    const rr = Math.round(rain*this.rainRings.length);
    this.rainRings.forEach((r, i) => { r.visible = pond && i < rr; if (!r.visible) return; const s = .15 + ((t*.9 + r.userData.seed) % 1)*1.1; r.scale.set(s, s, 1); });
    const fishN = Math.round(1 + p.oxygenDemand*7), gasp = sample.coverage < 100;
    this.fish.forEach((o, i) => {
      o.visible = pond && i < fishN; if (!o.visible) return;
      const ph = i*1.7, h = o.userData.home;
      o.position.x = clamp(h.x + Math.sin(t*.25 + ph)*1.1, -this.pondL/2 + .6, this.pondL/2 - .6);
      o.position.z = clamp(h.z + Math.cos(t*.3 + ph)*.8, POND_BACK + .5, POND_BACK + this.pondW - .5);
      const yT = gasp ? WATER_Y - .12 : .68; o.position.y += (yT - o.position.y)*Math.min(1, dt*2);
      o.rotation.y = Math.sin(t*.25 + ph) > 0 ? Math.PI : 0;
    });
    // water surface waves: calm in clear weather, rough in rain and storms
    if (this.water && !bench) {
      const a = this.water.geometry.attributes.position.array, amp = .018 + .05*rain + wind*.0025 + (this.storm ? .09 : 0);
      for (let i = 0; i < a.length; i += 3) a[i+2] = Math.sin(a[i]*2.2 + t*1.6)*Math.cos(a[i+1]*2.8 + t)*amp;
      this.water.geometry.attributes.position.needsUpdate = true; this.water.geometry.computeVertexNormals();
    }

    if (this.host.dataset.graphics !== 'lost') this.renderer.render(this.scene, this.camera);
  }
}
