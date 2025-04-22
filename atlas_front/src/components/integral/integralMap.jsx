import React, { Component } from "react";

import { Box, LinearProgress } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { geojsonToWKT } from "@terraformer/wkt";

import { booleanPointInPolygon, difference, point } from "@turf/turf";

import MapLegend from "../content/mapLegend";
import { getOriginalPixels, getPixels } from "../../services/mapsAPI";
import { boundsToPolygon, getRadius, getColor } from "../../utils/functions";
import { mapsMetadata } from "../../utils/constants";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const createRectangle = (
  center,
  pixelSize,
  fillColor,
  fillOpacity,
  value,
  markerCallback
) => {
  const latlng = L.latLng(center);
  const latLngWidth = pixelSize;
  const bounds = L.latLngBounds(
    L.latLng(latlng.lat - latLngWidth / 2, latlng.lng - latLngWidth / 2),
    L.latLng(latlng.lat + latLngWidth / 2, latlng.lng + latLngWidth / 2)
  );
  let options = {
    fillColor,
    fillOpacity,
    stroke: false,
    value,
  };
  const rect = L.rectangle(bounds, options).on("click", markerCallback);
  rect.getLatLng = () => {
    return latlng;
  };
  return rect;
};

class IntegralMap extends Component {
  constructor(props) {
    super(props);
    this.mapContainer = React.createRef();
    this.map = null;
    this.marker = null;
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

  updateDrawLayer = (event) => {
    this.props.onWKTPolygonChange(
      geojsonToWKT(this.drawnItems.toGeoJSON().features[0].geometry)
    );
    this.setState({
      polygon: event.layer,
    });
  };

  handlePolygonDraw = (event) => {
    if (this.state.polygon) {
      this.drawnItems.removeLayer(this.state.polygon);
    }
    this.drawnItems.addLayer(event.layer);
    this.drawnItems.bringToFront();
    this.updateDrawLayer(event);
  };

  handlePolygonDelete = () => {
    this.props.onWKTPolygonChange(null);
    this.setState({
      polygon: null,
    });
  };

  handlePolygonUpdate = (event) => {
    this.updateDrawLayer(event);
  };

  handleMarkerClick = (event) => {
    const feature = event.target;
    const { lat, lng } = feature.getLatLng();
    const coord = [lat, lng];
    this.props.onSelectedChange([lng, lat], feature.options.value);
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
    }, mapsMetadata.integral.apiCallDelay);
    this.setState({
      timeout: timer,
    });
  };

  removeMarkersOutOfBounds = (bounds) => {
    const filteredMarkers = this.state.markers.filter((marker) => {
      const { lat, lng } = marker.getLatLng();
      const pointInBounds = booleanPointInPolygon(point([lng, lat]), bounds);
      if (!pointInBounds) this.layer.removeLayer(marker);
      return pointInBounds;
    });
    this.setState({
      markers: filteredMarkers,
    });
  };

  filterMarkers = (geojsonResponse) => {
    const { bounds } = this.state;
    const markerClickCallback = this.handleMarkerClick;
    let currentMarkers = this.state.markers;
    const minValue = this.props.indicatorMin;
    const maxValue = this.props.indicatorMax;
    const palette = this.props.indicatorPalette;
    const pixelSize = this.props.indicatorPixelSize;
    geojsonResponse.features.forEach((point) => {
      const latlng = L.latLng(
        point.geometry.coordinates[1],
        point.geometry.coordinates[0]
      );
      const fillColor = getColor(
        point.properties.value,
        minValue,
        maxValue,
        palette
      );
      const newMarker =
        pixelSize !== null
          ? createRectangle(
              latlng,
              pixelSize,
              fillColor,
              0.7,
              point.properties.value,
              markerClickCallback
            )
          : L.circleMarker(latlng, {
              autoPan: false,
              radius: getRadius(this.map.getZoom()),
              fillColor: fillColor,
              weight: 0,
              opacity: 0,
              fillOpacity: 0.7,
              value: point.properties.value,
            }).on("click", markerClickCallback);
      if (!currentMarkers.includes(newMarker)) {
        currentMarkers.push(newMarker);
      }
    });
    const filteredMarkers = currentMarkers.filter((marker) => {
      const { lat, lng } = marker.getLatLng();
      const pointInBounds = booleanPointInPolygon(point([lng, lat]), bounds);
      if (!pointInBounds) this.layer.removeLayer(marker);
      return pointInBounds;
    });
    return filteredMarkers;
  };

  updateMap = async (newBounds, indicatorChange) => {
    this.setState({
      loading: true,
    });
    const { indicatorId } = this.props;
    const { bounds, markers } = this.state;
    let renderBounds = boundsToPolygon(this.map.getBounds());

    if (newBounds && bounds && !indicatorChange) {
      renderBounds = difference(newBounds, bounds);
    }

    if (renderBounds) {
      try {
        if (indicatorId > 14) {
          const geojsonResponse = await getPixels(
            indicatorId,
            renderBounds.geometry
          );
          const filteredMarkers = this.filterMarkers(geojsonResponse);
          this.layer = L.layerGroup(filteredMarkers).addTo(this.map);
          this.drawnItems.bringToFront();
          this.setState({
            markers: filteredMarkers,
          });
        } else {
          const geojsonResponse = await getOriginalPixels(
            indicatorId,
            renderBounds.geometry
          );
          const filteredMarkers = this.filterMarkers(geojsonResponse);
          this.layer = L.layerGroup(filteredMarkers).addTo(this.map);
          this.drawnItems.bringToFront();
          this.setState({
            markers: filteredMarkers,
          });
        }
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
    this.map = L.map("integralmap", { preferCanvas: true }).setView(
      [mapsMetadata.integral.initialLat, mapsMetadata.integral.initialLng],
      mapsMetadata.integral.initialZoom
    );
    L.tileLayer("http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      minZoom: mapsMetadata.integral.minZoom,
      maxZoom: mapsMetadata.integral.maxZoom,
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
    if (
      prevProps.indicatorId !== this.props.indicatorId &&
      this.props.indicatorId !== -1
    ) {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.setState({ markers: [] });
      this.map.removeLayer(this.layer);
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
        sx={{ position: "relative" }}
      >
        {this.state.loading ? <LinearProgress sx={{ width: "100%" }} /> : null}
        <Box id="integralmap" sx={{ flex: 1, overflow: "hidden" }}></Box>
        {this.props.indicatorMin !== null &&
          this.props.indicatorMax !== null &&
          this.props.indicatorPalette !== null && (
            <MapLegend
              minValue={this.props.indicatorMin}
              maxValue={this.props.indicatorMax}
              colors={this.props.indicatorPalette}
            />
          )}
      </Box>
    );
  }
}

export default IntegralMap;
