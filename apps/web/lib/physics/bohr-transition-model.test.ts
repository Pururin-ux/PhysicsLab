import assert from "node:assert/strict";
import test from "node:test";
import { getBohrTransition, hydrogenLevelEnergyEv } from "./bohr-transition-model.ts";

test("hydrogen levels are discrete negative energies proportional to 1/n squared", () => {
  assert.equal(hydrogenLevelEnergyEv(1), -13.6);
  assert.equal(hydrogenLevelEnergyEv(2), -3.4);
  assert.equal(hydrogenLevelEnergyEv(3), -13.6 / 9);
});

test("a higher-to-lower transition emits a photon with the energy difference", () => {
  const transition = getBohrTransition(3, 2);

  assert.equal(transition.direction, "emission");
  assert.ok(Math.abs(transition.photonEnergyEv - 1.8888888889) < 1e-9);
  assert.ok(Math.abs(transition.frequency14 - 4.567) < 0.002);
  assert.ok(Math.abs(transition.wavelengthNm - 656.47) < 0.1);
  assert.ok(Math.abs(transition.frequencyHz * transition.wavelengthNm * 1e-9 - 299_792_458) < 1e-6);
});

test("the reverse transition absorbs the same photon energy", () => {
  const emission = getBohrTransition(3, 2);
  const absorption = getBohrTransition(2, 3);

  assert.equal(absorption.direction, "absorption");
  assert.equal(absorption.photonEnergyEv, emission.photonEnergyEv);
  assert.equal(absorption.frequencyHz, emission.frequencyHz);
  assert.equal(absorption.wavelengthNm, emission.wavelengthNm);
});

test("a transition cannot start and finish at the same state", () => {
  assert.throws(() => getBohrTransition(2, 2), RangeError);
  assert.throws(() => hydrogenLevelEnergyEv(0), RangeError);
});
