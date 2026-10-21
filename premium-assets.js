// Existing entry point retained; the runtime now loads the actual Blender GLB.
import {upgradePart} from './src/graphics/assets.js';
export function upgradeRotor(group) { return upgradePart(group, 'rotor'); }
