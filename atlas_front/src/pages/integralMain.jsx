// Start page for the integral component
import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Box, Grid, ThemeProvider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import LayersIcon from "@mui/icons-material/Layers";

import IntegralContent from "../components/integral/integralContent";
import IntegralMap from "../components/integral/integralMap";
import { getMetadata } from "../services/mapsAPI";
import { integralTheme } from "../themes/themes";
import constants from "../utils/constants";

// Define styles for SpeedDial tooltips
const useStyles = makeStyles({
  staticTooltipLabel: {
    whiteSpace: "nowrap",
    maxWidth: "none",
  },
});

// SpeedDial component for navigation between sections
const SpeedDialWithStyles = () => {
  const classes = useStyles();

  return (
    <SpeedDial
      ariaLabel="dialNav"
      sx={{ position: "absolute", top: 16, right: 16 }}
      icon={<LayersIcon />}
      direction="down"
    >
      {constants.navActions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={<Link to={action.link}>{action.icon}</Link>}
          tooltipTitle={action.name}
          tooltipOpen
          classes={{ staticTooltipLabel: classes.staticTooltipLabel }}
          />
        ))}
    </SpeedDial>
  );
};

// Main page component for the Integral section
class IntegralMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indicatorId: -1,
      indicator: null,
      selected: null,
      metadata: null,
      wktPolygon: null,
    };
  }

  // Set document title when component mounts
  componentDidMount() {
    document.title = "SenecAtlas - Integral";
  }

  // Handle changes when a tessela is selected
  handleSelectedChange = (coordinates, value) => {
    this.setState({
      selected: {
        coordinates,
        value,
      },
    });
  };

  // Handle indicator change and load metadata
  handleIndicatorChange = (newIndicator) => {
    const newIndicatorId = newIndicator["id"];
    getMetadata(newIndicatorId).then((metadata) => {
      this.setState({
        metadata: metadata[0],
        indicatorId: newIndicatorId,
        indicator: newIndicator,
        selected: null,
      });
    });
  };

  // Handle WKT polygon changes
  handleWKTPolygonChange = (newWKTPolygon) => {
    this.setState({ wktPolygon: newWKTPolygon });
  };

  // Render the component
  render() {
    return (
      <ThemeProvider theme={integralTheme}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            flexDirection={{
              xs: "column-reverse",
              sm: "column-reverse",
              md: "row",
              lg: "row",
              xl: "row",
            }}
            columns={7}
          >
            <Grid item xs={7} md={2}>
              {/* Sidebar: IntegralContent component */}
              <IntegralContent
                indicatorId={this.state.indicatorId}
                onViewLayerClick={this.handleIndicatorChange}
                selected={this.state.selected}
                metadata={this.state.metadata}
                wktPolygon={this.state.wktPolygon}
              />
            </Grid>
            <Grid item xs={7} md={5}>
              {/* Main Map: IntegralMap component */}
              <IntegralMap
                indicatorId={this.state.indicatorId}
                indicatorMin={
                  this.state.indicator ? this.state.indicator["min"] : null
                }
                indicatorMax={
                  this.state.indicator ? this.state.indicator["max"] : null
                }
                indicatorPalette={
                  this.state.indicator ? this.state.indicator["palette"] : null
                }
                indicatorPixelSize={
                  this.state.indicator
                    ? this.state.indicator["pixel_size"]
                    : null
                }
                onSelectedChange={this.handleSelectedChange}
                onWKTPolygonChange={this.handleWKTPolygonChange}
              />
            </Grid>
          </Grid>
          {/* SpeedDial navigation */}
          <SpeedDialWithStyles />
        </Box>
      </ThemeProvider>
    );
  }
}

export default IntegralMain;
