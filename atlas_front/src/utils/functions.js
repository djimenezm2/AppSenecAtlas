import { point, polygon } from "@turf/turf";

export const getColor = (value, minValue, maxValue, palette) => {
  const colorList = palette
    ? palette.split(",")
    : [
        "#0000FF",
        "#0033FF",
        "#0066FF",
        "#0099FF",
        "#00CCFF",
        "#00FFFF",
        "#33FFCC",
        "#66FF99",
        "#99FF66",
        "#CCFF33",
        "#FFFF00",
        "#FFCC00",
        "#FF9900",
        "#FF6600",
        "#FF3300",
        "#FF0000",
        "#FF3333",
        "#FF6666",
        "#FF9999",
        "#FFCCCC",
      ];
  const colorLen = colorList.length;
  return colorList[
    Math.floor(((value - minValue) / (maxValue - minValue)) * (colorLen - 1))
  ];
};

export const getRandomColor = (value) => {
  let closestValue = value;
  if (value > 10) {
    const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const firstDigit = Math.floor(value / orderOfMagnitude);
    closestValue = firstDigit * orderOfMagnitude;
  }

  const red = (Math.abs(Math.sin(closestValue * 3.141592653589793)) * 256) | 0;
  const green =
    (Math.abs(Math.sin(closestValue * 1.618033988749895)) * 256) | 0;
  const blue = (Math.abs(Math.sin(closestValue * 2.718281828459045)) * 256) | 0;

  const redHex = red.toString(16).padStart(2, "0");
  const greenHex = green.toString(16).padStart(2, "0");
  const blueHex = blue.toString(16).padStart(2, "0");

  const hexColor = `#${redHex}${greenHex}${blueHex}`;
  return hexColor;
};

export const getRadius = (zoom) => {
  return 5 + 1 / (4 * zoom);
};

export const boundsToPolygon = (bounds) => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const coordinates = [
    [sw.lng, sw.lat],
    [ne.lng, sw.lat],
    [ne.lng, ne.lat],
    [sw.lng, ne.lat],
    [sw.lng, sw.lat],
  ];
  return polygon([coordinates]);
};

export const markerToPoint = (marker) => {
  const markerCoords = marker.getBounds().getCenter();
  return point([markerCoords.lng, markerCoords.lat]);
};

export const bytesToMb = (bytes) => {
  return (bytes / 1048576).toFixed(2);
};

const functions = {
  getColor,
  getRandomColor,
  getRadius,
  bytesToMb,
};

export default functions;
