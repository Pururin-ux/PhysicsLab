import assert from "node:assert/strict";
import test from "node:test";
import { calculateMetalTemperature } from "./metal-temperature-model.ts";

const model = {
  referenceTemperatureCelsius: 20,
  referenceResistanceOhms: 10,
  temperatureCoefficientPerCelsius: 0.004,
  voltageVolts: 12,
};

test("heating the stated ordinary-metal model raises R and lowers I at fixed U", () => {
  const cool = calculateMetalTemperature({ ...model, temperatureCelsius: 20 });
  const warm = calculateMetalTemperature({ ...model, temperatureCelsius: 60 });
  const hot = calculateMetalTemperature({ ...model, temperatureCelsius: 100 });
  assert.deepEqual(cool, { resistanceOhms: 10, currentAmperes: 1.2 });
  assert.ok(Math.abs(warm.resistanceOhms - 11.6) < 1e-12);
  assert.ok(Math.abs(hot.resistanceOhms - 13.2) < 1e-12);
  assert.ok(cool.currentAmperes > warm.currentAmperes);
  assert.ok(warm.currentAmperes > hot.currentAmperes);
  assert.ok(Math.abs(hot.currentAmperes * hot.resistanceOhms - 12) < 1e-12);
});

test("unsupported parameters cannot masquerade as a valid classroom reading", () => {
  assert.throws(() => calculateMetalTemperature({ ...model, temperatureCelsius: Number.NaN }), RangeError);
  assert.throws(() => calculateMetalTemperature({ ...model, temperatureCelsius: -300 }), RangeError);
  assert.throws(() => calculateMetalTemperature({ ...model, temperatureCelsius: 20, temperatureCoefficientPerCelsius: 0 }), RangeError);
});
