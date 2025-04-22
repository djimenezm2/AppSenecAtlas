import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box, Tabs, Tab, Grid, Typography } from "@mui/material";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import BiomassSummary from "./biomassSummary";
import BiomassEstimation from "./estimation/biomassEstimation";
import ContentTitle from "../content/contentTitle";

import leaf from "../../assets/images/leaf.svg";
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

class BiomassTabs extends Component {
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
              background={leaf}
              title={strings.biomassAtlas}
              subtitle={strings.biomassAtlasDescription}
            />
          </Grid>
          <Grid item xs={12}>
            {this.props.codMun !== 0 ? (
              <>
                <Tabs
                  value={this.state.value}
                  onChange={this.handleValueChange}
                  aria-label="tabs-biomass"
                  variant="fullWidth"
                  textColor="secondary"
                  indicatorColor="secondary"
                >
                  <Tab label={strings.summary} {...a11yProps(0)} />
                  <Tab label={strings.generation} {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={this.state.value} index={0}>
                  <BiomassSummary
                    coord={this.props.coord}
                    crop={this.props.crop}
                    crops={this.props.crops}
                    codMun={this.props.codMun}
                    location={this.props.location}
                    area={this.props.area}
                    graphData={this.props.graphData}
                    onCropChange={this.props.onCropChange}
                  />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                  <BiomassEstimation
                    coord={this.props.coord}
                    crop={this.props.crop}
                    crops={this.props.crops}
                    location={this.props.location}
                    area={this.props.area}
                    onCropChange={this.props.onCropChange}
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
                    {strings.biomassAtlasInstructions}
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

export default BiomassTabs;
