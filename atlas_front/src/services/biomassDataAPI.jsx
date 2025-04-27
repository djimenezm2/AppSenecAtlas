import axios from "axios";

import constants from "../utils/constants";

const biomassDataClient = axios.create({
  baseURL: constants.backendURL,
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCropsByPoint = async (coord, cropId) => {
  try {
    const response = await biomassDataClient.request({
      url: "/api/biomasa/municipios/crops_by_point/",
      method: "get",
      params: {
        point: `${coord[0]},${coord[1]}`,
        cultivo: cropId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAtlasCrops = async (id) => {
  try {
    const response = await biomassDataClient.request({
      url: "/api/biomasa/cultivos/",
      method: "get",
      params: {
        id,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getTechnologies = async (id) => {
  try {
    const response = await biomassDataClient.request({
      url: "/api/biomasa/tecnologias/",
      method: "get",
      params: {
        id,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getResidues = async (id, cropId) => {
  try {
    const response = await biomassDataClient.request({
      url: "/api/biomasa/residuos/",
      method: "get",
      params: {
        id,
        cultivo: cropId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getVariables = async (id, techId) => {
  try {
    const response = await biomassDataClient.request({
      url: "/api/biomasa/variables/",
      method: "get",
      params: {
        id,
        tecnologia: techId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const predictProduction = async (area, cropId) => {
  try {
    const response = await biomassDataClient.request({
      url: "/api/biomasa/inference/production/",
      method: "post",
      params: {
        area,
        cultivo: cropId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCropRelatedData = async (area, cropId) => {
  try {
    const [predictionData, residuesData] = await Promise.all([
      biomassDataClient.request({
        url: "/api/biomasa/inference/production/",
        method: "post",
        params: {
          area,
          cultivo: cropId,
        },
      }),
      biomassDataClient.request({
        url: "/api/biomasa/residuos/",
        method: "get",
        params: {
          cultivo: cropId,
        },
      }),
    ]);
    return {
      prediction: predictionData.data,
      residues: residuesData.data,
    };
  } catch (error) {
    console.error(error);
  }
};

export default biomassDataClient;
