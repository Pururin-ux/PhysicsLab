export type MetalTemperatureInput = {
  temperatureCelsius: number;
  referenceTemperatureCelsius: number;
  referenceResistanceOhms: number;
  temperatureCoefficientPerCelsius: number;
  voltageVolts: number;
};

export type MetalTemperatureReading = {
  resistanceOhms: number;
  currentAmperes: number;
};

/** A stated linear classroom model for an ordinary metal near room temperature. */
export function calculateMetalTemperature(input: MetalTemperatureInput): MetalTemperatureReading {
  const {
    temperatureCelsius: temperature,
    referenceTemperatureCelsius: referenceTemperature,
    referenceResistanceOhms: referenceResistance,
    temperatureCoefficientPerCelsius: coefficient,
    voltageVolts: voltage,
  } = input;
  if (![temperature, referenceTemperature, referenceResistance, coefficient, voltage].every(Number.isFinite) ||
      referenceResistance <= 0 || coefficient <= 0 || voltage <= 0) {
    throw new RangeError("Metal model needs finite values, R0 > 0, positive coefficient and positive U.");
  }
  const resistanceOhms = referenceResistance * (1 + coefficient * (temperature - referenceTemperature));
  const currentAmperes = voltage / resistanceOhms;
  if (!Number.isFinite(resistanceOhms) || resistanceOhms <= 0 ||
      !Number.isFinite(currentAmperes) || currentAmperes <= 0) {
    throw new RangeError("Temperature is outside the positive-resistance range of this model.");
  }
  return { resistanceOhms, currentAmperes };
}
