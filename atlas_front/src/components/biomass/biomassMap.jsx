import React, { Component } from "react";

import { Box, LinearProgress } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import {
  polygon,
  centroid,
  booleanPointInPolygon,
  difference,
} from "@turf/turf";

import { getOriginalPixels } from "../../services/mapsAPI";
import {
  markerToPoint,
  boundsToPolygon,
  getColor,
} from "../../utils/functions";
import { mapsMetadata } from "../../utils/constants";

const createRectangle = (center, meters, fillColor, fillOpacity, value) => {
  const latlng = L.latLng(center);
  const latLngWidth = meters * 0.00045;
  const bounds = L.latLngBounds(
    L.latLng(latlng.lat - latLngWidth / 2, latlng.lng - latLngWidth / 2),
    L.latLng(latlng.lat + latLngWidth / 2, latlng.lng + latLngWidth / 2)
  );
  return L.rectangle(bounds, {
    fillColor,
    fillOpacity,
    stroke: false,
    interactive: false,
    value,
  });
};

class BiomassMap extends Component {
  constructor(props) {
    super(props);
    this.mapContainer = React.createRef();
    this.map = null;
    this.layer = null;
    this.drawnItems = null;
    this.state = {
      loading: false,
      polygon: null,
      bounds: null,
      markers: [],
      timeout: null,
    };
  }

  handlePolygonDraw = (event) => {
    if (this.state.polygon) {
      this.drawnItems.removeLayer(this.state.polygon);
    }
    this.setState({
      polygon: event.layer,
    });
    this.drawnItems.addLayer(event.layer);
    this.getPointsInsidePolygon(event.layer);
    this.drawnItems.bringToFront();
  };

  handlePolygonDelete = () => {
    this.setState({ selectedCount: 0 });
  };

  handlePolygonUpdate = () => {
    this.getPointsInsidePolygon(this.state.polygon);
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
    }, mapsMetadata.biomass.apiCallDelay);
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

  filterMarkers = (geojsonResponse, indicatorId, minValue, maxValue) => {
    const bounds = this.state.bounds;
    let currentMarkers = this.state.markers;
    geojsonResponse.features.forEach((point) => {
      const latlng = L.latLng(
        point.geometry.coordinates[1],
        point.geometry.coordinates[0]
      );
      const fillColor = getColor(point.properties.value, 2, 25.5);
      const newMarker = createRectangle(
        latlng,
        10,
        fillColor,
        0.6,
        point.properties.value
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

  getPointsInsidePolygon = (drawnPolygon) => {
    const turfPolygon = polygon([
      drawnPolygon.toGeoJSON().geometry.coordinates[0],
    ]);
    const markersInsidePolygon = this.state.markers
      .filter((marker) => {
        const turfPoint = markerToPoint(marker);
        return booleanPointInPolygon(turfPoint, turfPolygon);
      })
      .reduce((partialSum, i) => partialSum + i.options.value, 0);

    this.props.onCoordChange(
      centroid(turfPolygon).geometry.coordinates,
      markersInsidePolygon
    );
  };

  updateMap = async (newBounds, indicatorIdChange) => {
    this.setState({
      loading: true,
    });
    const { minValue, maxValue, indicatorId } = this.props;
    const { bounds, markers } = this.state;
    let renderBounds = boundsToPolygon(this.map.getBounds());
    if (indicatorIdChange && this.layer) {
      this.map.removeLayer(this.layer);
    }
    if (newBounds && bounds && !indicatorIdChange) {
      renderBounds = difference(newBounds, bounds);
    }

    if (renderBounds) {
      try {
        const geojsonResponse = await getOriginalPixels(
          indicatorId,
          renderBounds.geometry
        );
        const filteredMarkers = this.filterMarkers(
          geojsonResponse,
          indicatorId,
          minValue,
          maxValue
        );
        this.layer = L.layerGroup(filteredMarkers).addTo(this.map);
        this.setState({
          markers: filteredMarkers,
        });
        this.drawnItems.bringToFront();
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

  initializeMap = () => {
    this.map = L.map("biomassmap", { preferCanvas: true }).setView(
      [mapsMetadata.biomass.initialLat, mapsMetadata.biomass.initialLng],
      mapsMetadata.biomass.initialZoom
    );
    L.tileLayer("http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      minZoom: mapsMetadata.biomass.minZoom,
      maxZoom: mapsMetadata.biomass.maxZoom,
      attribution: "©Google",
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);
    this.map.addControl(
      new L.Control.Draw({
        draw: {
          polygon: true,
          marker: false,
          circle: false,
          circlemarker: false,
          polyline: false,
        },
        edit: {
          featureGroup: this.drawnItems,
        },
      })
    );
  };

  componentDidMount() {
    this.initializeMap();
    const initialBounds = boundsToPolygon(this.map.getBounds());
    this.updateMap(initialBounds);
    this.setState({
      bounds: initialBounds,
    });
    this.map.on("moveend", this.handleMapMove);
    this.map.on("draw:created", this.handlePolygonDraw);
    this.map.on("draw:edited", this.handlePolygonUpdate);
    this.map.on("draw:deleted", this.handlePolygonDelete);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.indicatorId !== this.props.indicatorId) {
      if (this.state.polygon) {
        this.drawnItems.removeLayer(this.state.polygon);
      }
      this.setState({
        polygon: null,
        selectedCount: 0,
        markers: [],
        timeout: null,
      });
      this.updateMap(this.state.bounds, true);
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
        <Box id="biomassmap" sx={{ flex: 1, overflow: "hidden" }}></Box>
      </Box>
    );
  }
}

export default BiomassMap;
