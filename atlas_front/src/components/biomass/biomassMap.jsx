// Biomass map component
import React, { Component } from "react";
import { Box, LinearProgress } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { polygon, point, centroid, booleanPointInPolygon } from "@turf/turf";

import { getOriginalPixels } from "../../services/mapsAPI";
import { boundsToPolygon, getColor } from "../../utils/functions";
import { mapsMetadata } from "../../utils/constants";

// Configure Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// BiomassMap class component
class BiomassMap extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.map = null;
    this.canvasRenderer = null;
    this.geojsonLayer = null;
    this.drawnItems = null;
    this._moveTimeout = null;
    this.polygon = null;
  }

  // Returns a padded polygon based on map bounds
  getPaddedPolygon = () => {
    const bounds = this.map.getBounds();
    const deg = 10 * 0.00045;
    const pad = deg * 2;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const paddedSW = L.latLng(sw.lat - pad, sw.lng - pad);
    const paddedNE = L.latLng(ne.lat + pad, ne.lng + pad);
    return boundsToPolygon(L.latLngBounds(paddedSW, paddedNE));
  };

  componentDidMount() {
    this.initializeMap();
    this.updateMap(this.getPaddedPolygon());
    this.map.on("moveend", this.handleMapMove);
    this.map.on("draw:created", this.handlePolygonDraw);
    this.map.on("draw:edited", this.handlePolygonDraw);
    this.map.on("draw:deleted", this.clearPolygon);
  }

  componentWillUnmount() {
    this.map.off();
    this.map.remove();
    if (this._moveTimeout) clearTimeout(this._moveTimeout);
  }

  // Handle map move event
  handleMapMove = () => {
    if (this._moveTimeout) clearTimeout(this._moveTimeout);
    this._moveTimeout = setTimeout(() => {
      this.updateMap(this.getPaddedPolygon());
    }, mapsMetadata.biomass.apiCallDelay);
  };

  // Handle drawing or editing a polygon
  handlePolygonDraw = (e) => {
    if (this.polygon) this.drawnItems.clearLayers();
    this.polygon = e.layer;
    this.drawnItems.addLayer(this.polygon);
    this.drawnItems.bringToFront();
    this.getPointsInsidePolygon(this.polygon);
  };

  // Clear drawn polygons
  clearPolygon = () => {
    this.drawnItems.clearLayers();
    this.polygon = null;
    this.props.onCoordChange(null, 0);
  };

  // Sum values of points inside the drawn polygon and notify parent
  getPointsInsidePolygon = (drawnLayer) => {
    const coords = drawnLayer.toGeoJSON().geometry.coordinates;
    const turfPoly = polygon(coords);
    let sum = 0;
    this.geojsonLayer.eachLayer((layer) => {
      const turfPt = point(layer.feature.geometry.coordinates);
      if (booleanPointInPolygon(turfPt, turfPoly)) {
        sum += layer.feature.properties.value;
      }
    });
    const center = centroid(turfPoly).geometry.coordinates;
    this.props.onCoordChange(center, sum);
  };

  // Initialize the Leaflet map
  initializeMap = () => {
    this.map = L.map("biomassmap", { preferCanvas: true, zoomControl: false }).setView(
      [mapsMetadata.biomass.initialLat, mapsMetadata.biomass.initialLng],
      mapsMetadata.biomass.initialZoom
    );
    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      minZoom: mapsMetadata.biomass.minZoom,
      maxZoom: mapsMetadata.biomass.maxZoom,
      attribution: "©Google",
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      crossOrigin: true,
    }).addTo(this.map);

    this.canvasRenderer = L.canvas({ padding: 2 });
    this.geojsonLayer = L.geoJSON([], {
      renderer: this.canvasRenderer,
      pointToLayer: (feature, latlng) => {
        const val = feature.properties.value;
        const col = getColor(val, 2, 25.5);
        const deg = 10 * 0.00045;
        const h = deg / 2;
        const pts = [
          [latlng.lat - h, latlng.lng - h],
          [latlng.lat - h, latlng.lng + h],
          [latlng.lat + h, latlng.lng + h],
          [latlng.lat + h, latlng.lng - h],
        ];
        return L.polygon(pts, {
          renderer: this.canvasRenderer,
          fillColor: col,
          weight: 0,
          fillOpacity: 0.6,
        });
      },
    }).addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    this.map.addControl(
      new L.Control.Draw({
        draw: { polygon: true, marker: false, polyline: false, circle: false, circlemarker: false },
        edit: { featureGroup: this.drawnItems },
      })
    );
  };

  // Fetch pixel data and update the map
  updateMap = async (paddedPoly) => {
    this.setState({ loading: true });
    try {
      const data = await getOriginalPixels(this.props.indicatorId, paddedPoly.geometry);
      console.time("renderGeoJSON");
      this.geojsonLayer.clearLayers();
      this.geojsonLayer.addData(data);
      console.timeEnd("renderGeoJSON");
    } catch (e) {
      console.error(e);
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Box display="flex" flexDirection="column" height={["40vh","40vh","100vh"]} sx={{ position: "relative" }}>
        {/* Loading bar */}
        {this.state.loading && <LinearProgress sx={{ width: "100%" }} />}

        {/* Map container */}
        <Box id="biomassmap" sx={{ flex: 1, overflow: "hidden" }} />
      </Box>
    );
  }
}

export default BiomassMap;
