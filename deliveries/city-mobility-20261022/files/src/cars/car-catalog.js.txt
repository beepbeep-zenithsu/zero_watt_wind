/**
 * Catalog of the eight premium cars (showcase viewer AND city traffic).
 *
 * `length` is the nominal overall length in metres. The showcase and the traffic
 * fleet rescale each loaded model to this length, so a model exported in
 * centimetres still fits.
 * `yaw` is a manual correction in degrees if a model's nose does not face +Z.
 * `source` is populated by installed-fleet.js only after real GLBs and their
 * recorded licenses pass tools/validate-traffic-assets.cjs --install.
 * Candidate licenses alone never mark an absent model as installed.
 */
import {INSTALLED_FLEET} from './installed-fleet.js';
export const CAR_BASE = 'assets/cars/';

/** Traffic-ready LOD files: assets/cars/traffic/<id>-lod0.glb, -lod1.glb, -lod2.glb */
export const TRAFFIC_BASE = 'assets/cars/traffic/';
/** Camera distance (scene units = metres) at which each LOD level takes over. */
export const TRAFFIC_LOD_DISTANCES = [0, 38, 95];
export const TRAFFIC_LOD_HYSTERESIS = 0.12;

const entries = [
  {id: 'jaguar-e-type', name: 'Jaguar E-Type', maker: 'Jaguar', year: '1961–1974', length: 4.45, note: 'Series 1 coupe'},
  {id: 'porsche-taycan', name: 'Porsche Taycan', maker: 'Porsche', year: '2019–', length: 4.96, note: 'Electric sport saloon'},
  {id: 'ferrari-roma', name: 'Ferrari Roma', maker: 'Ferrari', year: '2020–', length: 4.66, note: 'Front-engined GT coupe'},
  {id: 'mclaren-gt', name: 'McLaren GT', maker: 'McLaren', year: '2019–', length: 4.68, note: 'Mid-engined grand tourer'},
  {id: 'pininfarina-battista', name: 'Automobili Pininfarina Battista', maker: 'Automobili Pininfarina', year: '2020–', length: 4.91, note: 'Electric hypercar'},
  {id: 'de-tomaso-p72', name: 'De Tomaso P72', maker: 'De Tomaso', year: '2020–', length: 4.55, note: 'Nominal length: verify against the model'},
  {id: 'mclaren-elva', name: 'McLaren Elva', maker: 'McLaren', year: '2020–', length: 4.61, note: 'Open-cockpit roadster'},
  {id: 'lotus-evija', name: 'Lotus Evija', maker: 'Lotus', year: '2020–', length: 4.69, note: 'Electric hypercar'}
];

export const CARS = entries.map(c => {
  const installed = INSTALLED_FLEET[c.id];
  return {yaw: 0, source: installed?.source ?? null, ...c,
    installed: Boolean(installed), file: installed?.lods[0] ?? `${CAR_BASE}${c.id}.glb`};
});

/** Same eight cars, with the three LOD files used by city traffic. */
export const TRAFFIC_CARS = CARS.map(c => ({
  ...c,
  lods: [0, 1, 2].map(level => `${TRAFFIC_BASE}${c.id}-lod${level}.glb`)
}));
