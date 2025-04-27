// src/components/integral/integralMap.jsx

import React, { Component } from "react";
import { Box, LinearProgress } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { geojsonToWKT } from "@terraformer/wkt";

import MapLegend from "../content/mapLegend";
import { getOriginalPixels, getPixels } from "../../services/mapsAPI";
import { boundsToPolygon, getColor, getRadius } from "../../utils/functions";
import { mapsMetadata } from "../../utils/constants";

// Configure Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Map component for the Integral page
class IntegralMap extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, bounds: null };
    this.map = null;
    this.tileLayer = null;
    this.canvasRenderer = null;
    this.geojsonLayer = null;
    this.drawnItems = null;
    this._moveTimeout = null;
    this.polygon = null;
  }

  // Returns a padded polygon around the current map bounds
  getPaddedPolygon = () => {
    const bounds = this.map.getBounds();
    const size = this.props.indicatorPixelSize;
    const n = 2; // extra tesselas
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const paddedSW = L.latLng(sw.lat - n * size, sw.lng - n * size);
    const paddedNE = L.latLng(ne.lat + n * size, ne.lng + n * size);
    return boundsToPolygon(L.latLngBounds(paddedSW, paddedNE));
  };

  componentDidMount() {
    this.initializeMap();
    const initialPoly = this.getPaddedPolygon();
    this.updateMap(initialPoly);
    this.setState({ bounds: initialPoly });
    this.map.on("moveend", this.handleMapMove);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.indicatorId !== this.props.indicatorId &&
      this.props.indicatorId !== -1
    ) {
      this.updateMap(this.state.bounds, true);
    }
  }

  componentWillUnmount() {
    this.map.off("moveend", this.handleMapMove);
    this.map.off("draw:created", this.handlePolygonDraw);
    this.map.off("draw:edited", this.handlePolygonUpdate);
    this.map.off("draw:deleted", this.handlePolygonDelete);
    this.map.remove();
    if (this._moveTimeout) clearTimeout(this._moveTimeout);
  }

  // Handle map move and refresh data
  handleMapMove = () => {
    if (this._moveTimeout) clearTimeout(this._moveTimeout);
    this._moveTimeout = setTimeout(() => {
      const paddedPoly = this.getPaddedPolygon();
      this.updateMap(paddedPoly);
      this.setState({ bounds: paddedPoly });
    }, mapsMetadata.integral.apiCallDelay);
  };

  // Handle polygon draw event
  handlePolygonDraw = (e) => {
    if (this.polygon) this.drawnItems.removeLayer(this.polygon);
    this.polygon = e.layer;
    this.drawnItems.addLayer(this.polygon);
    this.drawnItems.bringToFront();
    this.props.onWKTPolygonChange(
      geojsonToWKT(this.drawnItems.toGeoJSON().features[0].geometry)
    );
  };

  // Handle polygon edit event
  handlePolygonUpdate = () => {
    this.props.onWKTPolygonChange(
      geojsonToWKT(this.drawnItems.toGeoJSON().features[0].geometry)
    );
  };

  // Handle polygon delete event
  handlePolygonDelete = () => {
    this.drawnItems.clearLayers();
    this.polygon = null;
    this.props.onWKTPolygonChange(null);
  };

  // Initialize the Leaflet map
  initializeMap = () => {
    this.map = L.map("integralmap", { preferCanvas: true, zoomControl: false }).setView(
      [
        mapsMetadata.integral.initialLat,
        mapsMetadata.integral.initialLng,
      ],
      mapsMetadata.integral.initialZoom
    );

    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    this.tileLayer = L.tileLayer(
      mapsMetadata.integral.tileUrl ||
        "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      {
        minZoom: mapsMetadata.integral.minZoom,
        maxZoom: mapsMetadata.integral.maxZoom,
        maxNativeZoom: 20,
        attribution: "©Google",
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        keepBuffer: 4,
        crossOrigin: true,
      }
    ).addTo(this.map);

    this.canvasRenderer = L.canvas({ padding: 2 });

    this.geojsonLayer = L.geoJSON(null, {
      renderer: this.canvasRenderer,
      pointToLayer: (feature, latlng) => {
        const val = feature.properties.value;
        const col = getColor(
          val,
          this.props.indicatorMin,
          this.props.indicatorMax,
          this.props.indicatorPalette
        );
        const size = this.props.indicatorPixelSize;
        if (size) {
          const h = size / 2;
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
            fillOpacity: 0.7,
          }).on("click", () => {
            console.log("Sending to parent:", [latlng.lng, latlng.lat], val);
            this.props.onSelectedChange([latlng.lng, latlng.lat], val);
          });
        }
        return L.circleMarker(latlng, {
          renderer: this.canvasRenderer,
          radius: getRadius(this.map.getZoom()),
          fillColor: col,
          weight: 0,
          fillOpacity: 0.7,
        }).on("click", () => {
          console.log("Sending to parent:", [latlng.lng, latlng.lat], val);
          this.props.onSelectedChange([latlng.lng, latlng.lat], val);
        });
      },
    }).addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    // Add Leaflet Draw controls
    this.map.addControl(
      new L.Control.Draw({
        draw: {
          polygon: true,
          marker: false,
          polyline: false,
          circle: false,
          circlemarker: false,
        },
        edit: { featureGroup: this.drawnItems },
      })
    );

    // Listen to draw events
    this.map.on("draw:created", this.handlePolygonDraw);
    this.map.on("draw:edited", this.handlePolygonUpdate);
    this.map.on("draw:deleted", this.handlePolygonDelete);
  };

  // Update the map data
  updateMap = async (bounds, force) => {
    this.setState({ loading: true });
    const id = this.props.indicatorId;
    try {
      const data =
        id > 14
          ? await getPixels(id, bounds.geometry)
          : await getOriginalPixels(id, bounds.geometry);
      this.geojsonLayer.clearLayers();
      this.geojsonLayer.addData(data);
    } catch (e) {
      console.error(e);
    }
    this.drawnItems.bringToFront();
    this.setState({ loading: false });
  };

  render() {
    return (
      <Box
        display="flex"
        flexDirection="column"
        height={["40vh", "40vh", "100vh"]}
        sx={{ position: "relative" }}
      >
        {/* Loading bar */}
        {this.state.loading && <LinearProgress sx={{ width: "100%" }} />}

        {/* Map container */}
        <Box id="integralmap" sx={{ flex: 1, overflow: "hidden" }} />

        {/* Legend */}
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
