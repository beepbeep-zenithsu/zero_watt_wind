/* ZeroWatt Wind - steady-state engineering model + hardware catalogue.
   All coefficients are ASSUMED demonstration values, not measurements of the prototype.
   Hardware ratings are typical datasheet-style figures - always confirm with the real datasheet. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WindModel = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const defaults = Object.freeze({wind:3.5,diameter:1,units:1,cp:0.18,drive:0.75,cutin:2,cutout:25,stormCutout:16,ratedPower:250,brake:false,boats:1,upb:1,mount:'boat',rain:0,ratio:2,tsr:0.9,profile:'steady',ambient:32,
    room:150,people:8,outdoorCO2:420,backgroundACH:0.5,pressure:20,fanEfficiency:0.35,co2Target:1200,
    pond:100,temp:28,oxygenDemand:0.25,sae:0.8,backgroundK:0.01,doTarget:4,
    windSensor:'none',qualitySensor:'none',envSensor:'none',mcu:'none',enclosure:'none'});

  /* ---------- live wind (no fixed time span: the pattern simply keeps cycling) ---------- */
  const smooth = (a,b,x) => { const t = Math.min(1, Math.max(0, (x-a)/(b-a))); return t*t*(3-2*t); };
  function liveWind(p, t) {
    if (p.profile === 'gusts') return Math.max(0, p.wind*(1 + 0.5*Math.sin(t*0.45) + 0.18*Math.sin(t*1.3)));
    if (p.profile === 'storm') return Math.max(0, p.wind*(0.9 + 0.28*Math.sin(t*0.45) + 0.15*Math.sin(t*1.3)));
    if (p.profile === 'lull') { const c = t % 36; const dip = smooth(10,13,c) * (1 - smooth(23,26,c)); return p.wind*(1 - 0.85*dip); }
    return p.wind;
  }
  function peakWind(p) { let m = 0; for (let t = 0; t < 120; t += 0.25) m = Math.max(m, liveWind(p, t)); return m; }

  /* ---------- hardware catalogue ---------- */
  // wet: 0 open/unprotected, 2 drips, 3 light rain, 5 heavy rain/jets, 6 storm jets, 7 temporary immersion, 8 continuous immersion
  const hardware = {
    windSensor: [
      {id:'none', name:'— none —'},
      {id:'cup_hobby', name:'Cup anemometer · hobby plastic', tmin:-10, tmax:50, wet:3, maxWind:30, acc:.06, watts:0.01, note:'Reed/pulse output. Cheap, moving parts, weak against heavy rain.'},
      {id:'cup_ind', name:'Cup anemometer · industrial IP67', tmin:-35, tmax:70, wet:7, maxWind:60, acc:.03, watts:0.1, note:'Sealed bearings and heated body options.'},
      {id:'ultra', name:'Ultrasonic anemometer · no moving parts', tmin:-40, tmax:80, wet:6, maxWind:60, acc:.02, watts:0.4, note:'Best for storms and dust. Needs a stable supply.'},
      {id:'hall', name:'Rotor RPM sensor · Hall effect', tmin:-40, tmax:105, wet:5, maxWind:99, acc:.04, watts:0.02, note:'Reads rotor speed, not true wind. Blind below cut-in.', rpmBased:true}
    ],
    qualityAir: [
      {id:'none', name:'— none —'},
      {id:'mq135', name:'MQ-135 gas module (metal-oxide)', tmin:-10, tmax:40, wet:0, acc:.30, watts:0.75, indoor:true, note:'Cheap, hot heater, humidity-sensitive.'},
      {id:'mhz19', name:'MH-Z19B · NDIR CO₂', tmin:0, tmax:50, wet:0, acc:.06, watts:0.1, indoor:true, note:'Real CO₂ measurement, indoor use only.'},
      {id:'scd41', name:'SCD41 · photoacoustic CO₂', tmin:-10, tmax:60, wet:0, acc:.05, watts:0.06, indoor:true, note:'Small, accurate, I²C.'},
      {id:'ndir_duct', name:'Industrial NDIR duct probe · IP65', tmin:-20, tmax:60, wet:5, acc:.03, watts:0.5, indoor:true, note:'Built for hot, dusty ducts.'}
    ],
    qualityWater: [
      {id:'none', name:'— none —'},
      {id:'do_cheap', name:'Low-cost analog DO kit', tmin:0, tmax:35, wet:7, acc:.10, watts:0.05, submerged:true, note:'Needs frequent calibration.'},
      {id:'do_galv', name:'Galvanic DO probe', tmin:0, tmax:40, wet:8, acc:.05, watts:0.02, submerged:true, note:'No warm-up, membrane wears.'},
      {id:'do_opt', name:'Optical DO probe · IP68', tmin:0, tmax:50, wet:8, acc:.02, watts:0.15, submerged:true, note:'Low drift, best for hot ponds.'}
    ],
    envAir: [
      {id:'none', name:'— none —'},
      {id:'rain_res', name:'Resistive rain board (YL-83 type)', tmin:-10, tmax:60, wet:2, acc:.2, watts:0.05, note:'Corrodes quickly outdoors.'},
      {id:'rain_opt', name:'Optical (IR) rain sensor', tmin:-40, tmax:85, wet:6, acc:.1, watts:0.2, note:'Sealed, no moving parts.'},
      {id:'rain_tip', name:'Tipping-bucket rain gauge', tmin:-30, tmax:70, wet:5, acc:.05, watts:0, note:'Passive reed switch.'}
    ],
    envWater: [
      {id:'none', name:'— none —'},
      {id:'ntc', name:'NTC thermistor probe', tmin:-40, tmax:125, wet:7, acc:.04, watts:0.001, submerged:true, note:'Needs an ADC and calibration.'},
      {id:'ds18', name:'DS18B20 waterproof probe', tmin:-55, tmax:125, wet:8, acc:.01, watts:0.005, submerged:true, note:'Digital, ±0.5 °C.'}
    ],
    mcu: [
      {id:'none', name:'— none —'},
      {id:'attiny', name:'ATtiny85 · ultra-low power', tmin:-40, tmax:85, bits:10, watts:0.02, note:'Tiny, very little power.'},
      {id:'uno', name:'Arduino Uno · ATmega328P', tmin:-40, tmax:85, bits:10, watts:0.25, note:'Easy to prototype; open board.'},
      {id:'pico', name:'Raspberry Pi Pico · RP2040', tmin:-20, tmax:85, bits:12, watts:0.1, note:'Fast, cheap, 12-bit ADC.'},
      {id:'esp32', name:'ESP32 · Wi-Fi + 12-bit ADC', tmin:-40, tmax:85, bits:12, watts:0.4, note:'Adds telemetry, but draws most power.'},
      {id:'stm32', name:'STM32 Nucleo · industrial range', tmin:-40, tmax:85, bits:12, watts:0.15, note:'Robust, low power per ADC bit.'}
    ],
    enclosure: [
      {id:'none', name:'Open board · no box', wet:0, solar:20},
      {id:'ip54', name:'Plastic box · IP54', wet:5, solar:15},
      {id:'ip67', name:'Sealed IP67 box + sun shield', wet:7, solar:5}
    ]
  };
  const find = (list,id) => list.find(i => i.id === id) || list[0];
  const WET_NAMES = {0:'open',2:'drip-proof',3:'splash-proof',5:'rain-proof',6:'storm-proof',7:'IP67',8:'IP68'};

  function needWet(rain) { return rain <= 0 ? 0 : rain < 0.5 ? 3 : rain < 1 ? 5 : 6; }

  function check(item, env, opts) {
    if (!item || item.id === 'none') return null;
    const reasons = []; let level = 0;
    const temp = opts.temp;
    if (temp > item.tmax) { level = 2; reasons.push('too hot ('+temp.toFixed(0)+' °C > '+item.tmax+' °C)'); }
    else if (temp > item.tmax - 5) { level = Math.max(level,1); reasons.push('near max temperature ('+item.tmax+' °C)'); }
    if (temp < item.tmin) { level = 2; reasons.push('too cold'); }
    if (!opts.submerged && !opts.indoor) {
      const need = needWet(env.rain);
      if (item.wet < need) { level = 2; reasons.push('water ingress ('+(WET_NAMES[item.wet]||item.wet)+' in '+(env.rain>=1?'storm':'heavy rain')+')'); }
      else if (env.rain > 0 && item.wet === need) { level = Math.max(level,1); reasons.push('marginal in rain'); }
    }
    if (opts.checkWind && item.maxWind && env.peakWind > item.maxWind) { level = 2; reasons.push('peak gust '+env.peakWind.toFixed(0)+' m/s above rating'); }
    return {level, status: level === 2 ? 'fail' : level === 1 ? 'warn' : 'ok', reasons, temp};
  }

  function evaluateHardware(p) {
    const weather = p._weather || 'clear', sunny = weather === 'clear' || weather === 'heat';
    const enc = find(hardware.enclosure, p.enclosure);
    const env = {rain:p.rain, peakWind:peakWind(p)};
    const outdoorTemp = p.ambient + (sunny ? 8 : 2);
    const mcuTemp = p.ambient + (sunny ? enc.solar : 3);
    const quality = p._mode === 'air' ? find(hardware.qualityAir,p.qualitySensor) : find(hardware.qualityWater,p.qualitySensor);
    const envS = p._mode === 'air' ? find(hardware.envAir,p.envSensor) : find(hardware.envWater,p.envSensor);
    const wind = find(hardware.windSensor,p.windSensor), mcu = find(hardware.mcu,p.mcu);
    const items = {
      wind: {item:wind, res:check(wind, env, {temp:outdoorTemp, checkWind:true})},
      quality: {item:quality, res:check(quality, env, {temp: quality.submerged ? p.temp : p.ambient + 2, submerged:quality.submerged, indoor:quality.indoor})},
      env: {item:envS, res:check(envS, env, {temp: envS.submerged ? p.temp : outdoorTemp, submerged:envS.submerged})},
      mcu: {item:mcu, res:check(Object.assign({}, mcu, {wet:enc.wet}), env, {temp:mcuTemp})}
    };
    const ok = k => items[k].res && items[k].res.status !== 'fail';
    const windOK = ok('wind'), mcuOK = ok('mcu');
    const protection = windOK && mcuOK;
    const damper = p._mode === 'air' && mcuOK && ok('env') && items.env.item.id !== 'none' && p.rain > 0.5;
    const alerts = mcuOK && ok('quality');
    const watts = ['wind','quality','env','mcu'].reduce((s,k) => s + (items[k].item && items[k].item.watts || 0), 0);
    let protectionText;
    if (!mcu.tmax) protectionText = 'NO MICROCONTROLLER';
    else if (!mcuOK) protectionText = 'MCU FAILED';
    else if (wind.id === 'none') protectionText = 'NO WIND INPUT';
    else if (!windOK) protectionText = 'WIND SENSOR FAILED';
    else protectionText = 'ARMED';
    return {items, protection, damper, alerts, watts, enclosure:enc, protectionText, peakWind:env.peakWind, mcuTemp, outdoorTemp};
  }

  /* ---------- steady-state physics ---------- */
  function mechanical(p, v, protectedFlag) {
    const available = 0.5*1.225*Math.PI*p.diameter*p.diameter/4*v*v*v*p.units;
    // Demonstration mode: wind keeps driving the rotor across the full slider range.
    // Only the explicit manual shaft brake stops it; hardware ratings still report separately.
    const stopped = !!p.brake;
    const shaft = v < p.cutin || stopped ? 0 : Math.min(available*p.cp*p.drive, p.ratedPower*p.units);
    const rpm = shaft > 0 ? v*p.tsr/(Math.PI*p.diameter)*60 : 0;
    return {available, shaft, rpm, outputRPM:rpm/p.ratio, torque:rpm > 0 ? shaft/(rpm*2*Math.PI/60) : 0, stopped};
  }
  function saturation(t) { return 14.652 - 0.41022*t + 0.007991*t*t - 0.000077774*t*t*t; }

  // Equilibrium (steady-state) quality with and without the device at a given wind speed.
  function steady(p, v, hw) {
    const mech = mechanical(p, v, hw.protection);
    const damper = hw.damper ? 0.3 : 1;
    const airflow = mech.shaft*p.fanEfficiency/p.pressure*3600*damper;
    const source = p.people*0.018*1e6;
    const qBase = p.backgroundACH*p.room;
    const co2Base = p.outdoorCO2 + source/qBase;
    const co2 = p.outdoorCO2 + source/(qBase + airflow);
    const sat = saturation(p.temp), correction = Math.pow(1.024,p.temp-20)*sat/saturation(20);
    const standardKgHour = mech.shaft/1000*p.sae;
    const kDevice = standardKgHour*1000/(p.pond*sat)*correction;
    const eqDO = k => k <= 0 ? 0 : Math.max(0, sat - p.oxygenDemand/k);
    const doBase = eqDO(p.backgroundK), doValue = eqDO(p.backgroundK + kDevice);
    const supply = standardKgHour*1000*correction;           // g O2/h at zero DO
    const demandG = p.oxygenDemand*p.pond;                    // g O2/h consumed by the pond
    const coverage = demandG > 0 ? supply/demandG*100 : 0;
    return Object.assign({wind:v, airflow, co2, co2Base, do:doValue, doBase, supply, demandG, coverage, sat}, mech);
  }
  function sweep(p, hw, n) {
    n = n || 60; const out = [];
    for (let i = 0; i <= n; i++) out.push(steady(p, 60*i/n, hw));
    return out;
  }
  return {defaults, hardware, find, liveWind, peakWind, mechanical, saturation, steady, sweep, evaluateHardware};
});
