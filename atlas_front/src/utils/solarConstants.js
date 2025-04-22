import strings from "../strings/es.json";

export const variables = {
  ghi: strings.ghi,
  dhi: strings.dhi,
  dni: strings.dni,
  temperature: strings.temperature,
  wind_speed: strings.windSpeed,
  solar_zenith_angle: strings.solarZenithAngle,
};

export const graphOptions = {
  monthCycle: strings.monthlyCycle,
  hourCycle: strings.hourlyCycle,
  year: strings.yearlyHistory,
  month: strings.monthlyHistory,
  hour: strings.hourlyHistory,
};

export const models = {
  basic: strings.basicModel,
  advanced: strings.advancedModel,
};

export const setups = [
  { value: "isolated", label: strings.isolated },
  { value: "ceiling", label: strings.onRoof },
];

export const basicModelVariables = [
  {
    value: "N",
    label: strings.numberOfPanels,
    defaultValue: 20,
    description: strings.numberOfPanelsDescription,
  },
  {
    value: "Pmp",
    label: strings.panelMaximumPower,
    defaultValue: 455,
    description: strings.panelMaximumPowerDescription,
  },
  {
    value: "gamma",
    label: strings.maximumTemperatureCoefficient,
    defaultValue: -0.5,
    description: strings.maximumTemperatureCoefficientDescription,
  },
  {
    value: "beta",
    label: strings.panelInclination,
    defaultValue: 15,
    description: strings.panelInclinationDescription,
  },
  {
    value: "n",
    label: strings.nominalEfficiency,
    defaultValue: 96,
    description: strings.nominalEfficiencyDescription,
  },
  {
    value: "PT",
    label: strings.operationalLosses,
    defaultValue: 14.08,
    description: strings.operationalLossesDescription,
  },
];

export const advancedModelVariables = [
  {
    value: "N",
    label: strings.numberOfPanels,
    defaultValue: 20,
    description: strings.numberOfPanelsDescription,
  },
  {
    value: "s",
    label: strings.numberOfCellsInSeries,
    defaultValue: 144,
    description: strings.numberOfCellsInSeriesDescription,
  },
  {
    value: "beta",
    label: strings.arrayInclination,
    defaultValue: 15,
    description: strings.arrayInclinationDescription,
  },
  {
    value: "iscref",
    label: strings.nominalShortCircuitCurrent,
    defaultValue: 9.41,
    description: strings.nominalShortCircuitCurrentDescription,
  },
  {
    value: "vocref",
    label: strings.referenceOpenCircuitVoltage,
    defaultValue: 46.4,
    description: strings.referenceOpenCircuitVoltageDescription,
  },
  {
    value: "impref",
    label: strings.referenceMaximumPowerCurrent,
    defaultValue: 8.82,
    description: strings.referenceMaximumPowerCurrentDescription,
  },
  {
    value: "vmpref",
    label: strings.referenceMaximumPowerVoltage,
    defaultValue: 38.5,
    description: strings.referenceMaximumPowerVoltageDescription,
  },
  {
    value: "alphaisc",
    label: strings.iscTemperatureCoefficient,
    defaultValue: 0.00005,
    description: strings.iscTemperatureCoefficientDescription,
  },
  {
    value: "betavoc",
    label: strings.vocTemperatureCoefficient,
    defaultValue: -0.0027,
    description: strings.vocTemperatureCoefficientDescription,
  },
  {
    value: "n",
    label: strings.nominalEfficiency,
    defaultValue: 96,
    description: strings.nominalEfficiencyDescription,
  },
  {
    value: "PT",
    label: strings.operationalLosses,
    defaultValue: 14.08,
    description: strings.operationalLossesDescription,
  },
];

const constants = {
  variables,
  graphOptions,
  setups,
  basicModelVariables,
  advancedModelVariables,
};

export default constants;
