/** Educational lumped-parameter model. SI units except RPM, Wh and percent.
 * Not a rated fan curve, CFD solver or fabrication specification. */
export const HYBRID_DEFAULTS = Object.freeze({wind:4.5, irradiance:1000, soc:72,
  targetRPM:240, speed:1, sunHour:10, weather:'sunny', night:false, fault:false, control:'auto', quality:'auto',
  pvWatts:180, batteryWh:240, motorMaxW:95, motorEfficiency:.78,
  controllerEfficiency:.94, transmissionEfficiency:.84, fanRatedW:60,
  ratedFlow:850, assistOn:.90, assistOff:1.05, verifySeconds:1.5,
  lowSOC:12, recoverSOC:20, maxChargeW:75});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function createHybridState(options={}) {
  const p={...HYBRID_DEFAULTS,...options};
  return {soc:p.soc, fanRPM:0, windRPM:0, motorRPM:0, assist:false,
    lowBattery:p.soc<=p.lowSOC, verify:0, state:'STARTING', time:0};
}
export function stepHybrid(s, options, dt) {
  const p={...HYBRID_DEFAULTS,...options};
  dt=clamp(Number.isFinite(dt)?dt:0,0,1); s.time+=dt;
  const wind=clamp(p.wind,0,60),target=clamp(p.targetRPM,80,1200);
  const monsoon=p.weather==='monsoon',windOnly=monsoon||p.control==='wind-only';
  // 2.1 m swept diameter, Cp .23, 1:1 miter drive. P_fan ∝ RPM³.
  // The previous 360 W ceiling caused RPM to plateau above roughly 9 m/s.
  // Retain the wind-power and cubic fan-load relationship across the full range.
  const windW=.5*1.225*3.46*.23*wind**3*p.transmissionEfficiency;
  const windAvailableRPM=240*Math.cbrt(windW/p.fanRatedW);
  const freeRPM=wind<.1?0:wind*65;
  const windOnlyRPM=Math.min(freeRPM,windAvailableRPM);
  if(s.soc<=p.lowSOC)s.lowBattery=true;
  if(s.soc>=p.recoverSOC)s.lowBattery=false;
  const protectedOff=!!p.fault||s.lowBattery;
  const request=s.assist ? windOnlyRPM<target*p.assistOff : windOnlyRPM<target*p.assistOn;
  if(request!==s.assist){s.verify+=dt;if(s.verify>=p.verifySeconds){s.assist=request;s.verify=0;}}
  else s.verify=0;
  if(windOnly){s.assist=false;s.verify=0;}
  const pvW=p.night||monsoon?0:p.pvWatts*clamp(p.irradiance/1000,0,1.2)*p.controllerEfficiency;
  const fanDemand=p.fanRatedW*(target/240)**3;
  // An overrunning wind clutch disconnects when the fan outruns the input.
  const windEngaged=freeRPM>Math.max(s.fanRPM*.98,1)&&windW>0;
  const windContribution=windEngaged?Math.min(windW,fanDemand):0;
  const busAvailable=pvW+(s.soc>p.lowSOC?120:0);
  const motorW=s.assist&&!protectedOff ? Math.min(p.motorMaxW,busAvailable,
    Math.max(0,fanDemand-windContribution)/p.motorEfficiency):0;
  const shaftW=windContribution+motorW*p.motorEfficiency;
  const desiredRPM=motorW>0?Math.min(target,240*Math.cbrt(shaftW/p.fanRatedW)):windOnlyRPM;
  const ease=1-Math.exp(-dt/1.15);
  s.fanRPM+=(desiredRPM-s.fanRPM)*ease;
  // When coupled, wind and fan axes are locked 1:1. Otherwise wind idles freely.
  s.windEngaged=windEngaged;
  s.motorEngaged=motorW>.05;
  s.windRPM=windEngaged?s.fanRPM:freeRPM;
  s.motorRPM=s.motorEngaged?s.fanRPM*(.34/.22):0;
  const batteryW=motorW>pvW ? -(motorW-pvW) :
    s.soc>=99.99?0:Math.min(p.maxChargeW,(pvW-motorW)*.95);
  s.soc=clamp(s.soc+batteryW*dt/3600/p.batteryWh*100,0,100);
  s.pvW=pvW;s.motorW=motorW;s.batteryW=batteryW;
  s.curtailedW=Math.max(0,pvW-motorW-Math.max(0,batteryW)/.95);
  s.windW=windW;s.windContribution=windContribution;s.targetRPM=target;
  s.airflow=p.ratedFlow*s.fanRPM/240;
  s.batteryV=22.4+3.6*s.soc/100;
  s.belowTarget=s.fanRPM<target*.9;
  s.state=windOnly?(wind>.1?'WIND':'IDLE'):protectedOff?'PROTECTED':motorW>0?(windContribution>.1?'HYBRID':'ELECTRIC'):
    windOnlyRPM>=target*p.assistOn?'WIND':s.assist?'LIMITED':'VERIFYING';
  s.warning=windOnly?'':p.fault?'Protection fault · motor inhibited':s.lowBattery?
    'Low battery · motor locked until 20% charge':s.state==='LIMITED'?
    'Insufficient electrical power · airflow below target':'';
  return s;
}
export const STATE_LABELS={STARTING:'Starting system',WIND:'Wind-Driven Operation',
  IDLE:'Waiting for wind',
  HYBRID:'Hybrid Assistance',ELECTRIC:'Solar/Battery Ventilation',
  PROTECTED:'Battery / Fault Protection',LIMITED:'Power Limited',VERIFYING:'Verifying wind speed'};
