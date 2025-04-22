import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box, Tabs, Tab, Grid, Typography } from "@mui/material";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import SolarSummary from "./solarSummary";
import SolarGraphs from "./solarGraphs";
import SolarEstimation from "./estimation/solarEstimation";
import ContentTitle from "../content/contentTitle";
import panels from "../../assets/images/panels.svg";
import strings from "../../strings/es.json";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

class SolarTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleValueChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  render() {
    return (
      <Box sx={{ maxHeight: "100vh", overflow: "auto" }}>
        <Grid container padding={2}>
          <Grid item xs={12}>
            <ContentTitle
              background={panels}
              title={strings.solarAtlas}
              subtitle={strings.solarAtlasDescription}
            />
          </Grid>
          <Grid item xs={12}>
            {this.props.coord[0] !== 0 && this.props.coord[1] !== 0 ? (
              <>
                <Tabs
                  value={this.state.value}
                  onChange={this.handleValueChange}
                  aria-label="tabs-solar"
                  variant="fullWidth"
                  textColor="secondary"
                  indicatorColor="secondary"
                >
                  <Tab label={strings.summary} {...a11yProps(0)} />
                  <Tab label={strings.graphs} {...a11yProps(1)} />
                  <Tab label={strings.generation} {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={this.state.value} index={0}>
                  <SolarSummary
                    coord={this.props.coord}
                    year={this.props.year}
                    variable={this.props.variable}
                    variableLimits={this.props.variableLimits}
                    yearlyData={this.props.yearlyData}
                    monthlyData={this.props.monthlyData}
                    onYearChange={this.props.onYearChange}
                    onVariableChange={this.props.onVariableChange}
                  />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                  <SolarGraphs
                    coord={this.props.coord}
                    year={this.props.year}
                    variable={this.props.variable}
                    onYearChange={this.props.onYearChange}
                    onVariableChange={this.props.onVariableChange}
                  />
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                  <SolarEstimation
                    coord={this.props.coord}
                    year={this.props.year}
                    variable={this.props.variable}
                    onYearChange={this.props.onYearChange}
                    onVariableChange={this.props.onVariableChange}
                  />
                </TabPanel>
              </>
            ) : (
              <>
                <Grid item align="center" xs={12}>
                  <NotListedLocationIcon
                    sx={{ width: "100%", height: "20vh" }}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography color="primary" align="center" fontWeight="bold">
                    {strings.solarAtlasInstructions}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default SolarTabs;
