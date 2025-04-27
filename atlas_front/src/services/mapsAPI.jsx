import axios from "axios";

import constants from "../utils/constants";

const mapsClient = axios.create({
  baseURL: constants.backendURL,
  timeout: 1000000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getIndicators = async (id) => {
  try {
    const response = await mapsClient.request({
      url: "/api/indicators/",
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

export const getMetadata = async (indicatorId) => {
  try {
    const response = await mapsClient.request({
      url: "/api/metadata/",
      method: "get",
      params: {
        id: indicatorId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUnits = async (id) => {
  try {
    const response = await mapsClient.request({
      url: "/api/units/",
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

export const getOriginalPixels = async (indicatorId, geometry) => {
  try {
    const response = await mapsClient.request({
      url: "/api/originalpixels/draw/",
      method: "post",
      data: {
        indicator_id: indicatorId,
        in: JSON.stringify(geometry),
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getPixels = async (indicatorId, geometry) => {
  try {
    const response = await mapsClient.request({
      url: "/api/pixels/draw/",
      method: "post",
      data: {
        indicator_id: indicatorId,
        in: JSON.stringify(geometry),
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const downloadLayer = async (indicatorId) => {
  await mapsClient
    .request({
      url: "/api/indicators/download/",
      method: "get",
      responseType: "blob",
      params: {
        id: indicatorId,
      },
    })
    .then((response) => {
      const blobUrl = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const disposition = response.headers["content-disposition"];
      const matches = /filename="(.+)"/.exec(disposition);
      const filename = matches ? matches[1] : "layer.csv";
      link.href = blobUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const uploadFile = async (
  indicatorFormData,
  fileFormData,
  onProgressCallback
) => {
  try {
    const [dataFile, dataIndicator] = await Promise.all([
      mapsClient.request({
        url: "/api/upload/",
        method: "post",
        data: fileFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgressCallback(percentCompleted);
        },
      }),
      mapsClient.request({
        url: "/api/indicators/",
        method: "post",
        data: indicatorFormData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    ]);
    return { file: dataFile.data, indicator: dataIndicator.data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addIndicator = async (formData) => {
  try {
    const response = await mapsClient.request({
      url: "/api/indicators/",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error.response.data;
  }
};

export const addLayers = async (formData) => {
  try {
    const response = await mapsClient.request({
      url: "/api/indicators/adder/",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error.response.data;
  }
};

export const analyzeLayers = async (formData) => {
  try {
    const response = await mapsClient.request({
      url: "/api/indicators/analyzer/",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error.response.data;
  }
};

export default mapsClient;
