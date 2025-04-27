// SolarMain.jsx

import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Box, Grid, ThemeProvider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import { solarTheme } from "../themes/themes";
import constants from "../utils/constants";
import SolarTabs from "../components/solar/solarTabs";
import SolarMap from "../components/solar/solarMap";
import { getAllData } from "../services/solarDataAPI";

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
      icon={<WbSunnyIcon />}
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

// Main component for the Solar page
class SolarMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coord: [0, 0],
      year: 2019,
      variable: "ghi",
      variableLimits: [0, 0],
      yearlyData: null,
      monthlyData: null,
    };
  }

  componentDidMount() {
    document.title = "SenecAtlas - Solar";
  }

  // Handle change in selected coordinate
  handleCoordChange = (coord) => {
    getAllData(coord, this.state.year).then((responseData) => {
      this.setState({
        coord,
        yearlyData: responseData.year[0],
        monthlyData: responseData.month,
      });
    });
  };

  // Handle change in selected year
  handleYearChange = (year) => {
    this.setState({ year });
  };

  // Handle change in selected variable
  handleVariableChange = (variable) => {
    this.setState({ variable });
  };

  render() {
    return (
      <ThemeProvider theme={solarTheme}>
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
            {/* Sidebar: SolarTabs component */}
            <Grid item xs={7} md={2}>
              <SolarTabs
                coord={this.state.coord}
                year={this.state.year}
                variable={this.state.variable}
                variableLimits={this.state.variableLimits}
                yearlyData={this.state.yearlyData}
                monthlyData={this.state.monthlyData}
                onYearChange={this.handleYearChange}
                onVariableChange={this.handleVariableChange}
              />
            </Grid>
            {/* Main map: SolarMap component */}
            <Grid item xs={7} md={5}>
              <SolarMap
                coord={this.state.coord}
                year={this.state.year}
                variable={this.state.variable}
                onCoordChange={this.handleCoordChange}
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

export default SolarMain;
