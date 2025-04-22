import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Box, Grid, ThemeProvider } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import { solarTheme } from "../themes/themes";
import constants from "../utils/constants";
import SolarTabs from "../components/solar/solarTabs";
import SolarMap from "../components/solar/solarMap";
import { getAllData } from "../services/solarDataAPI";

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

  handleNavClick = () => {
    this.props.history.push("/solar");
  };

  handleCoordChange = (coord) => {
    getAllData(coord, this.state.year).then((responseData) => {
      this.setState({
        coord,
        yearlyData: responseData.year[0],
        monthlyData: responseData.month,
      });
    });
  };

  handleYearChange = (year) => {
    this.setState({
      year,
    });
  };

  handleVariableChange = (variable) => {
    this.setState({
      variable,
    });
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
            <Grid item xs={7} md={5}>
              <SolarMap
                coord={this.state.coord}
                year={this.state.year}
                variable={this.state.variable}
                onCoordChange={this.handleCoordChange}
              />
            </Grid>
          </Grid>
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
              />
            ))}
          </SpeedDial>
        </Box>
      </ThemeProvider>
    );
  }
}

export default SolarMain;
