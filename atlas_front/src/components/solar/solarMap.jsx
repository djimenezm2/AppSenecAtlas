// SolarMap.jsx

import React, { Component } from "react";
import { Box, LinearProgress } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import { getYearlyPixels } from "../../services/solarDataAPI";
import { boundsToPolygon, getColor } from "../../utils/functions";
import { mapsMetadata } from "../../utils/constants";

// Configure Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Map component for the Solar page
class SolarMap extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, limits: null };
    this.map = null;
    this.canvasRenderer = null;
    this.geojsonLayer = null;
    this._moveTimeout = null;
  }

  // Returns a padded polygon around map bounds
  getPaddedPolygon = () => {
    const bounds = this.map.getBounds();
    const meterSize = 4000;
    const deg = meterSize * 0.00001;
    const pad = deg * 2;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const paddedSW = L.latLng(sw.lat - pad, sw.lng - pad);
    const paddedNE = L.latLng(ne.lat + pad, ne.lng + pad);
    return boundsToPolygon(L.latLngBounds(paddedSW, paddedNE));
  };

  componentDidMount() {
    this.initializeMap();
    const padded = this.getPaddedPolygon();
    this.updateMap(padded);
    this.map.on("moveend", this.handleMapMove);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.year !== this.props.year) {
      this.updateMap(this.getPaddedPolygon(), true);
    } else if (prevProps.variable !== this.props.variable && this.state.limits) {
      this.applyColors(this.state.limits);
    }
  }

  componentWillUnmount() {
    this.map.off("moveend", this.handleMapMove);
    this.map.remove();
    if (this._moveTimeout) clearTimeout(this._moveTimeout);
  }

  // Handle map movement and reload data
  handleMapMove = () => {
    if (this._moveTimeout) clearTimeout(this._moveTimeout);
    this._moveTimeout = setTimeout(() => {
      this.updateMap(this.getPaddedPolygon());
    }, mapsMetadata.solar.apiCallDelay);
  };

  // Apply color styling based on current variable limits
  applyColors = (limits) => {
    const { variable } = this.props;
    this.geojsonLayer.eachLayer((layer) => {
      const val = layer.feature.properties[variable];
      layer.setStyle({
        fillColor: getColor(val, limits[`${variable}_min`], limits[`${variable}_max`]),
      });
    });
  };

  // Initialize the Leaflet map
  initializeMap = () => {
    this.map = L.map("solarmap", { preferCanvas: true, zoomControl: false }).setView(
      [mapsMetadata.solar.initialLat, mapsMetadata.solar.initialLng],
      mapsMetadata.solar.initialZoom
    );

    // Add zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Add tile layer
    L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      minZoom: mapsMetadata.solar.minZoom,
      maxZoom: mapsMetadata.solar.maxZoom,
      attribution: "©Google",
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(this.map);

    this.canvasRenderer = L.canvas({ padding: 2 });

    // Initialize empty GeoJSON layer
    this.geojsonLayer = L.geoJSON([], {
      renderer: this.canvasRenderer,
      pointToLayer: (feature, latlng) => {
        const deg = 4000 * 0.00001;
        const h = deg / 2;
        const pts = [
          [latlng.lat - h, latlng.lng - h],
          [latlng.lat - h, latlng.lng + h],
          [latlng.lat + h, latlng.lng + h],
          [latlng.lat + h, latlng.lng - h],
        ];
        return L.polygon(pts, {
          renderer: this.canvasRenderer,
          weight: 0,
          fillOpacity: 0.6,
          fillColor: '#ffffff',
        }).on('click', () => {
          this.props.onCoordChange([latlng.lng, latlng.lat]);
        });
      },
    }).addTo(this.map);
  };

  // Fetch data from API and update map
  updateMap = async (paddedPolygon, force = false) => {
    this.setState({ loading: true });
    const { year } = this.props;
    try {
      const resp = await getYearlyPixels(year, paddedPolygon.geometry);
      const limits = resp.limits[0];
      console.time('renderGeoJSON');
      this.geojsonLayer.clearLayers();
      this.geojsonLayer.addData(resp.pixels);
      console.timeEnd('renderGeoJSON');
      this.applyColors(limits);
      this.setState({ limits });
    } catch (e) {
      console.error(e);
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Box display="flex" flexDirection="column" height={["40vh","40vh","100vh"]} sx={{ position: 'relative' }}>
        {/* Loading bar */}
        {this.state.loading && <LinearProgress sx={{ width: '100%' }} />}

        {/* Map container */}
        <Box id="solarmap" sx={{ flex: 1, overflow: 'hidden' }} />
      </Box>
    );
  }
}

export default SolarMap;
