import WbSunnyIcon from "@mui/icons-material/WbSunny";
import GrassIcon from "@mui/icons-material/Grass";
import LayersIcon from "@mui/icons-material/Layers";
import strings from "../strings/es.json";

// Produccion
//export const backendURL = "https://senecatlasback.virtual.uniandes.edu.co";
export const backendURL = "http://localhost:8081";

// Desarrollo
//export const backendURL = "http://localhost:8081";

export const TEXTFIELD_REGEX = /^[a-zA-Z0-9_ ]+$/;

export const mapsMetadata = {
  biomass: {
    initialLat: 9.93,
    initialLng: -73.3,
    initialZoom: 10,
    minZoom: 9,
    maxZoom: 18,
    apiCallDelay: 400,
  },
  solar: {
    initialLat: 9.93,
    initialLng: -73.8,
    initialZoom: 8.7,
    minZoom: 8,
    maxZoom: 18,
    apiCallDelay: 400,
  },
  integral: {
    initialLat: 9.93,
    initialLng: -73.3,
    initialZoom: 11,
    minZoom: 9,
    maxZoom: 18,
    apiCallDelay: 400,
  },
};

export const MONTHS = [
  strings.january,
  strings.february,
  strings.march,
  strings.april,
  strings.may,
  strings.june,
  strings.july,
  strings.august,
  strings.september,
  strings.october,
  strings.november,
  strings.december,
];
export const years = Object.fromEntries(
  Array.from({ length: 2019 - 1998 + 1 }, (_, index) => [
    1998 + index,
    1998 + index,
  ])
);
export const hours = Object.fromEntries(
  Array.from({ length: 24 }, (_, index) => [
    index,
    (index < 10 ? "0" : "") + index + ":00",
  ])
);

export const navActions = [
  {
    icon: <GrassIcon sx={{ position: 'relative', top: '2px' }} />,
    name: strings.biomassAtlas,
    link: "/senecatlas/biomass"
  },
  {
    icon: <WbSunnyIcon sx={{ position: 'relative', top: '5px' }} />,
    name: strings.solarAtlas,
    link: "/senecatlas/solar"
  },
  {
    icon: <LayersIcon sx={{ position: 'relative', top: '4px' }} />,
    name: strings.integral,
    link: "/senecatlas/integral"
  },
];


export const months = (config) => {
  var cfg = config || {};
  var count = cfg.count || 12;
  var section = cfg.section;
  var values = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = MONTHS[Math.ceil(i) % 12];
    values.push(value.substring(0, section));
  }

  return values;
};
export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const constants = {
  backendURL,
  TEXTFIELD_REGEX,
  years,
  hours,
  navActions,
  mapsMetadata,
  months,
  toTitleCase,
};

export default constants;
