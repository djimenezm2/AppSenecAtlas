// Biomass main page component
import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Box, Grid, ThemeProvider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GrassIcon from "@mui/icons-material/Grass";

import BiomassMap from "../components/biomass/biomassMap";
import BiomassTabs from "../components/biomass/biomassTabs";
import { getCropsByPoint, getAtlasCrops } from "../services/biomassDataAPI";
import { biomassTheme } from "../themes/themes";
import constants from "../utils/constants";
import { cropIndicatorMapping } from "../utils/biomassConstants";

// Styles for SpeedDial tooltips
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
      icon={<GrassIcon />}
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

// Main component for the Biomass section
class BiomassMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crop: 1,
      indicatorId: cropIndicatorMapping[1],
      crops: null,
      coord: [0, 0],
      area: 0,
      codMun: 0,
      location: null,
      locationData: null,
    };
  }

  // Update state when a new coordinate is selected
  handleCoordChange = async (coord, area) => {
    getCropsByPoint(coord, this.state.crop).then((responseData) => {
      this.setState({
        coord: coord,
        area,
        codMun: responseData.municipio.id,
        location: `${responseData.municipio.municipio}, ${responseData.municipio.departamento}`,
        locationData: responseData.cultivos,
      });
    });
  };

  // Update state when a new crop is selected
  handleCropChange = async (crop) => {
    getCropsByPoint(this.state.coord, crop).then((responseData) => {
      this.setState({
        crop,
        indicatorId: cropIndicatorMapping[crop],
        codMun: responseData.municipio.id,
        location: `${responseData.municipio.municipio}, ${responseData.municipio.departamento}`,
        locationData: responseData.cultivos,
      });
    });
  };

  // Fetch available crops
  updateCrops = async () => {
    getAtlasCrops().then((cropsList) => {
      let cropsData = {};
      cropsList.forEach((item) => {
        cropsData[item.id] = item.nombre;
      });
      this.setState({
        crops: cropsData,
        crop: Object.keys(cropsData)[0],
      });
    });
  };

  // Load crops on mount
  componentDidMount() {
    this.updateCrops();
    document.title = "SenecAtlas - Biomasa";
  }

  render() {
    return (
      <ThemeProvider theme={biomassTheme}>
        <Box>
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
            {/* Sidebar: BiomassTabs component */}
            <Grid item xs={7} md={2}>
              <BiomassTabs
                coord={this.state.coord}
                crop={this.state.crop}
                crops={this.state.crops}
                codMun={this.state.codMun}
                location={this.state.location}
                area={this.state.area}
                graphData={this.state.locationData}
                onCropChange={this.handleCropChange}
              />
            </Grid>
            {/* Main Map: BiomassMap component */}
            <Grid item xs={7} md={5}>
              <BiomassMap
                coord={this.state.coord}
                onCoordChange={this.handleCoordChange}
                indicatorId={this.state.indicatorId}
                minValue={1}
                maxValue={5}
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

export default BiomassMain;
