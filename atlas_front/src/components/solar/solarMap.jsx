import React, { Component } from "react";

import { Box, LinearProgress } from "@mui/material";
import L from "leaflet";
import { booleanPointInPolygon, difference } from "@turf/turf";

import { getYearlyPixels } from "../../services/solarDataAPI";
import {
  markerToPoint,
  boundsToPolygon,
  getColor,
} from "../../utils/functions";
import { mapsMetadata } from "../../utils/constants";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const createRectangle = (
  center,
  meters,
  fillColor,
  fillOpacity,
  data,
  markerCallback
) => {
  const latlng = L.latLng(center);
  const latLngWidth = meters * 0.00001;
  const bounds = L.latLngBounds(
    L.latLng(latlng.lat - latLngWidth / 2, latlng.lng - latLngWidth / 2),
    L.latLng(latlng.lat + latLngWidth / 2, latlng.lng + latLngWidth / 2)
  );
  let options = {
    fillColor,
    fillOpacity,
    stroke: false,
    data,
  };
  return L.rectangle(bounds, options).on("click", markerCallback);
};

class SolarMap extends Component {
  constructor(props) {
    super(props);
    this.mapContainer = React.createRef();
    this.map = null;
    this.marker = null;
    this.layer = null;
    this.state = {
      loading: false,
      limits: null,
      bounds: null,
      markers: [],
      timeout: null,
    };
  }

  handleMarkerClick = (event) => {
    const feature = markerToPoint(event.target);
    const coord = [
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0],
    ];
    this.props.onCoordChange(feature.geometry.coordinates);
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker(coord).addTo(this.map);
  };

  handleMapMove = () => {
    const newBounds = this.map.getBounds();
    const boundsPolygon = boundsToPolygon(newBounds);
    this.removeMarkersOutOfBounds(boundsPolygon);
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
    const timer = setTimeout(() => {
      this.updateMap(boundsPolygon);
      this.setState({
        bounds: boundsPolygon,
        timeout: null,
      });
    }, mapsMetadata.solar.apiCallDelay);
    this.setState({
      timeout: timer,
    });
  };

  removeMarkersOutOfBounds = (bounds) => {
    const filteredMarkers = this.state.markers.filter((marker) => {
      const point = markerToPoint(marker);
      const pointInBounds = booleanPointInPolygon(point, bounds);
      if (!pointInBounds) this.layer.removeLayer(marker);
      return pointInBounds;
    });
    this.setState({
      markers: filteredMarkers,
    });
  };

  filterMarkers = (
    geojsonResponse,
    variable,
    minValue,
    maxValue,
    markerClickCallback
  ) => {
    const bounds = this.state.bounds;
    let currentMarkers = this.state.markers;
    geojsonResponse.features.forEach((point) => {
      const latlng = L.latLng(
        point.geometry.coordinates[1],
        point.geometry.coordinates[0]
      );
      const fillColor = getColor(
        point.properties[`${variable}`],
        minValue,
        maxValue
      );
      const newMarker = createRectangle(
        latlng,
        4000,
        fillColor,
        0.6,
        point.properties,
        markerClickCallback
      );
      if (!currentMarkers.includes(newMarker)) {
        currentMarkers.push(newMarker);
      }
    });
    const filteredMarkers = currentMarkers.filter((marker) => {
      const point = markerToPoint(marker);
      const pointInBounds = booleanPointInPolygon(point, bounds);
      if (!pointInBounds) this.layer.removeLayer(marker);
      return pointInBounds;
    });
    return filteredMarkers;
  };

  updateColors = () => {
    const { variable } = this.props;
    const { limits } = this.state;
    this.layer.eachLayer(function (layer) {
      layer.setStyle({
        fillColor: getColor(
          layer.options.data[variable],
          limits[`${variable}_min`],
          limits[`${variable}_max`]
        ),
      });
    });
  };

  updateMap = async (newBounds, yearChange) => {
    this.setState({
      loading: true,
    });
    const { year, variable } = this.props;
    const { bounds, markers } = this.state;
    const markerClickCallback = this.handleMarkerClick;
    let renderBounds = boundsToPolygon(this.map.getBounds());
    if (yearChange && this.layer) {
      this.map.removeLayer(this.layer);
    }
    if (newBounds && bounds && !yearChange) {
      renderBounds = difference(newBounds, bounds);
    }

    if (renderBounds) {
      try {
        const geojsonResponse = await getYearlyPixels(
          year,
          renderBounds.geometry
        );
        const filteredMarkers = this.filterMarkers(
          geojsonResponse.pixels,
          variable,
          geojsonResponse.limits[0][`${variable}_min`],
          geojsonResponse.limits[0][`${variable}_max`],
          markerClickCallback
        );
        this.layer = L.layerGroup(filteredMarkers).addTo(this.map);
        this.setState({
          markers: filteredMarkers,
          limits: geojsonResponse.limits[0],
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      this.layer = L.layerGroup(markers).addTo(this.map);
    }
    this.setState({
      loading: false,
    });
  };

  componentDidMount() {
    this.map = L.map("solarmap").setView(
      [mapsMetadata.solar.initialLat, mapsMetadata.solar.initialLng],
      mapsMetadata.solar.initialZoom
    );
    L.tileLayer("http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      minZoom: mapsMetadata.solar.minZoom,
      maxZoom: mapsMetadata.solar.maxZoom,
      attribution: "©Google",
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(this.map);
    const initialBounds = boundsToPolygon(this.map.getBounds());
    this.updateMap(initialBounds);
    this.setState({
      bounds: initialBounds,
    });
    this.map.on("moveend", this.handleMapMove);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.year !== this.props.year) {
      this.setState({
        markers: [],
        timeout: null,
      });
      this.updateMap(this.state.bounds, true);
      this.updateColors();
    } else if (prevProps.variable !== this.props.variable) {
      this.updateColors();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
    if (this.map) {
      this.map.remove();
    }
  }

  render() {
    return (
      <Box
        display="flex"
        flexDirection="column"
        height={["40vh", "40vh", "100vh", "100vh", "100vh"]}
        overflow="hidden"
      >
        {this.state.loading ? <LinearProgress sx={{ width: "100%" }} /> : null}
        <Box id="solarmap" sx={{ flex: 1, overflow: "hidden" }}></Box>
      </Box>
    );
  }
}

export default SolarMap;
