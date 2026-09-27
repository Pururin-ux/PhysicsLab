import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateFullCircuit,
  estimatePowerBalanceFromReadings,
  estimateInternalResistanceFromReadings,
} from "./full-circuit-model.ts";

const source = { emfV: 12, internalResistanceOhm: 2, loadResistanceOhm: 4 };

test("an open circuit has no current or internal voltage drop", () => {
  assert.deepEqual(calculateFullCircuit({ ...source, closed: false }), {
    currentA: 0,
    terminalVoltageV: 12,
    internalDropV: 0,
    efficiency: null,
    estimatedInternalResistanceOhm: null,
  });
});

test("a closed circuit balances EMF across the load and source interior", () => {
  assert.deepEqual(calculateFullCircuit({ ...source, closed: true }), {
    currentA: 2,
    terminalVoltageV: 8,
    internalDropV: 4,
    efficiency: 2 / 3,
    estimatedInternalResistanceOhm: 2,
  });
});

test("recorded readings distinguish useful load power from source power", () => {
  const firstLoad = estimatePowerBalanceFromReadings({
    emfV: 12,
    terminalVoltageV: 8,
    currentA: 2,
  });
  const secondLoad = estimatePowerBalanceFromReadings({
    emfV: 12,
    terminalVoltageV: 9.6,
    currentA: 1.2,
  });

  assert.ok(firstLoad && secondLoad);
  assert.equal(firstLoad.loadPowerW, 16);
  assert.equal(firstLoad.sourcePowerW, 24);
  assert.equal(firstLoad.efficiency, 2 / 3);
  assert.ok(Math.abs(secondLoad.loadPowerW - 11.52) < 1e-9);
  assert.ok(Math.abs(secondLoad.sourcePowerW - 14.4) < 1e-9);
  assert.equal(secondLoad.efficiency, 0.8);
  assert.ok(firstLoad.efficiency < secondLoad.efficiency);
  assert.ok(firstLoad.loadPowerW > secondLoad.loadPowerW);
});

test("power estimates are unavailable without current or when readings contradict the source model", () => {
  assert.equal(
    estimatePowerBalanceFromReadings({ emfV: 12, terminalVoltageV: 12, currentA: 0 }),
    null,
  );
  assert.equal(
    estimatePowerBalanceFromReadings({ emfV: 12, terminalVoltageV: 12.1, currentA: 1 }),
    null,
  );
});

test("lowering load resistance raises current and lowers terminal voltage", () => {
  const smallerLoad = calculateFullCircuit({ ...source, loadResistanceOhm: 2, closed: true });
  const largerLoad = calculateFullCircuit({ ...source, loadResistanceOhm: 12, closed: true });
  assert.equal(smallerLoad.currentA, 3);
  assert.equal(smallerLoad.terminalVoltageV, 6);
  assert.ok(smallerLoad.currentA > largerLoad.currentA);
  assert.ok(smallerLoad.terminalVoltageV < largerLoad.terminalVoltageV);
});

test("the ideal model rejects a zero internal resistance", () => {
  assert.throws(
    () => calculateFullCircuit({ ...source, internalResistanceOhm: 0, closed: true }),
    RangeError,
  );
});

test("measurement estimates recover r from rounded U and I readings", () => {
  const estimate = estimateInternalResistanceFromReadings({
    emfV: 12,
    terminalVoltageV: 8,
    currentA: 2,
    displayStep: 0.1,
  });

  assert.ok(estimate);
  assert.equal(estimate.valueOhm, 2);
  assert.ok(estimate.minimumOhm < 2);
  assert.ok(estimate.maximumOhm > 2);
});

test("a second load gives a compatible resistance estimate with a wider reading interval", () => {
  const first = estimateInternalResistanceFromReadings({
    emfV: 12,
    terminalVoltageV: 8,
    currentA: 2,
    displayStep: 0.1,
  });
  const second = estimateInternalResistanceFromReadings({
    emfV: 12,
    terminalVoltageV: 9.6,
    currentA: 1.2,
    displayStep: 0.1,
  });

  assert.ok(first && second);
  assert.ok(Math.abs(second.valueOhm - 2) < 1e-12);
  assert.ok(second.maximumOhm - second.minimumOhm > first.maximumOhm - first.minimumOhm);
  assert.ok(Math.max(first.minimumOhm, second.minimumOhm) <= Math.min(first.maximumOhm, second.maximumOhm));
});

test("an open-circuit reading cannot estimate internal resistance", () => {
  assert.equal(
    estimateInternalResistanceFromReadings({
      emfV: 12,
      terminalVoltageV: 12,
      currentA: 0,
      displayStep: 0.1,
    }),
    null,
  );
});

test("measurement uncertainty rejects invalid resolution and readings", () => {
  assert.throws(
    () => estimateInternalResistanceFromReadings({
      emfV: 12,
      terminalVoltageV: 8,
      currentA: 2,
      displayStep: 0,
    }),
    RangeError,
  );
});
