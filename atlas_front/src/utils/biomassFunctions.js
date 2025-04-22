export const getLHVD = (c, h, o, n, s, ash, humidity) => {
  // Aplica ecuaciones de Incineración para un residuo
  // Ec. 1: LHV_D [kJ/kg]
  let lhvD =
    (35000 * c + 96800 * h + 10000 * s - 2080 * n - 10080 * o - 2000 * ash) *
      (1 - humidity) -
    2443 * humidity;
  return lhvD;
};

export const getLHVB = (c, h, o, n, s, humidity, bioDigest) => {
  // Aplica ecuaciones de Biogás para un residuo
  // Ec. 4: T_CH4
  let tCH4 = (1 / 8) * (c / 3 + h - o / 8 - (3 * n) / 14 - s / 16);
  // Ec. 5: T_CO2
  let tCO2 = (1 / 8) * (c / 3 - h + o / 8 + (3 * n) / 14 + s / 16);
  // Ec. 3: LHV_B [kJ/kg]
  let lhvB =
    67200 *
    (tCH4 / (tCH4 + tCO2)) *
    bioDigest *
    (1 - humidity) *
    (c / (c + h + o + n + s));
  return lhvB;
};

export const getWRankine = (c, h, o, n, s, ash, humidity, pAlta, pBaja) => {
  // Aplica ecuaciones de Incineración para un residuo
  const lhvD = getLHVD(c, h, o, n, s, ash, humidity);
  // Ec. 2: WRankine [kW/Ton]
  let wRankine =
    0.181624 * lhvD * (0.010145 * pAlta + 0.004177 * pBaja) + 101.26;
  return wRankine;
};

export const getWBrayton = (c, h, o, n, s, ash, humidity, bioDigest, tComb, rCompr) => {
  // Aplica ecuaciones de Biogás para un residuo
  const lhvB = getLHVB(c, h, o, n, s, humidity, bioDigest);
  // Ec. 2: WBrayton [kW/Ton]
  let wBrayton =
    (0.0001018 * rCompr + 0.000275 * tComb) *
      (0.2776 * lhvB - 0.00555 * (ash / n)) +
    0.9996;
  return wBrayton;
};

export const getLHVTotal = (lhv, fraction, humidity, production) => {
  // Ec. 7 recibe produccion en kg, pero getLHVTotal recibe produccion en ton
  // Retorna [MJ] -> 1KJ = 1/1000MJ 
  // 1000kg = 1ton -> se modifica la constante inicial (1000/1000=1)
  let lhvTotal = lhv * production * fraction * (1 - humidity);
  return lhvTotal;
};

export const getWTotal = (w, fraction, humidity, production) => {
  // Ec. 8
  // Retorna [MW] -> 1KW = 1/1000MW
  let lhvTotal = (1/1000) * w * production * fraction * (1 - humidity);
  return lhvTotal;
};

export const getAllGeneration = (residues, variables, production, selectedResidues, selectedTechnology) => {
  const selected = residues.filter((residue) => selectedResidues.includes(residue.id));
  let variableValues = {};
  variables.forEach((item) => (variableValues[item.id] = item.value));
  const lhvResidues = {};
  const wResidues = {};
  const wTotal = {};
  const lhvTotal = {};
  // Caso 1: Incineración
  if (selectedTechnology === 1) {
    selected.forEach((item) => {
      const lhvItem = getLHVD(item.c, item.h, item.o, item.n, item.s, item.ceniza, item.humedad);
      const wItem = getWRankine(item.c, item.h, item.o, item.n, item.s, item.ceniza, item.humedad, variableValues[1], variableValues[2]);
      lhvTotal[item.id] = getLHVTotal(lhvItem, item.fraccion, item.humedad, production);
      wTotal[item.id] = getWTotal(wItem, item.fraccion, item.humedad, production);
      lhvResidues[item.id] = lhvItem;
      wResidues[item.id] = wItem;
    });
    return {lhvResidues, wResidues, lhvTotal, wTotal};
  }
  // Caso 2: Biogás
  else if (selectedTechnology === 2) {
    selected.forEach((item) => {
      const lhvItem = getLHVB(item.c, item.h, item.o, item.n, item.s, item.humedad, variableValues[3]);
      const wItem = getWBrayton(item.c, item.h, item.o, item.n, item.s, item.ceniza, item.humedad, variableValues[3], variableValues[4], variableValues[5]);
      lhvTotal[item.id] = getLHVTotal(lhvItem, item.fraccion, item.humedad, production);
      wTotal[item.id] = getWTotal(wItem, item.fraccion, item.humedad, production);
      lhvResidues[item.id] = lhvItem;
      wResidues[item.id] = wItem;
    });
    return {lhvResidues, wResidues, lhvTotal, wTotal};
  }
};

const biomassFunctions = {
  getLHVD,
  getLHVB,
  getWRankine,
  getWBrayton,
  getLHVTotal,
  getWTotal,
  getAllGeneration,
};

export default biomassFunctions;
