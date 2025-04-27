import axios from "axios";

import constants from "../utils/constants";

const solarDataClient = axios.create({
  baseURL: constants.backendURL,
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getYearlyData = async (coord, year) => {
  try {
    const response = await solarDataClient.request({
      url: "/senecatlas/api/solar/y/",
      method: "get",
      params: {
        point: `${coord[0]},${coord[1]}`,
        year,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMonthlyData = async (coord, year) => {
  try {
    const response = await solarDataClient.request({
      url: "/senecatlas/api/solar/m/",
      method: "get",
      params: {
        point: `${coord[0]},${coord[1]}`,
        year,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getHourlyData = async (coord, year) => {
  try {
    const response = await solarDataClient.request({
      url: "/senecatlas/api/solar/h/",
      method: "get",
      params: {
        point: `${coord[0]},${coord[1]}`,
        year,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getDailyData = async (coord, year) => {
  try {
    const response = await solarDataClient.request({
      url: "/senecatlas/api/solar/d/",
      method: "get",
      params: {
        point: `${coord[0]},${coord[1]}`,
        year,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getElevationData = async (coord) => {
  try {
    const response = await solarDataClient.request({
      url: "/senecatlas/api/solar/elevation/",
      method: "get",
      params: {
        point: coord,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getLimitsData = async (year) => {
  try {
    const response = await solarDataClient.request({
      url: "/senecatlas/api/solar/limits/",
      method: "get",
      params: {
        year,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllData = async (coord, year) => {
  try {
    const [dataYear, dataMonth] = await Promise.all([
      solarDataClient.request({
        url: "/senecatlas/api/solar/y/",
        method: "get",
        params: {
          point: `${coord[0]},${coord[1]}`,
          year,
        },
      }),
      solarDataClient.request({
        url: "/senecatlas/api/solar/m/",
        method: "get",
        params: {
          point: `${coord[0]},${coord[1]}`,
          year,
        },
      }),
    ]);
    return { year: dataYear.data, month: dataMonth.data };
  } catch (error) {
    console.error(error);
  }
};

export const getYearlyPixels = async (year, geometry) => {
  try {
    const [dataPixels, dataLimits] = await Promise.all([
      solarDataClient.request({
        url: "/senecatlas/api/solar/pixels/draw/",
        method: "post",
        data: {
          year,
          in: JSON.stringify(geometry),
        },
      }),
      solarDataClient.request({
        url: "/senecatlas/api/solar/limits/",
        method: "get",
        params: {
          year,
        },
      }),
    ]);
    return { pixels: dataPixels.data, limits: dataLimits.data };
  } catch (error) {
    console.error(error);
  }
};

export default solarDataClient;
