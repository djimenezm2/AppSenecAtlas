import React, { Component } from "react";
import { Grid } from "@mui/material";

import SolarBasicEstimation from "./solarBasicEstimation";
import SolarAdvancedEstimation from "./solarAdvancedEstimation";

import SectionTitle from "../../content/sectionTitle";
import SelectCard from "../../cards/selectCard";
import SolarEstimationResult from "./solarEstimationResult";

import constants from "../../../utils/constants";
import { models, variables } from "../../../utils/solarConstants";
import { getDailyData } from "../../../services/solarDataAPI";

import strings from "../../../strings/es.json";

class SolarEstimation extends Component {
  initialState = {
    model: "basic",
    setup: "isolated",
    dailyData: null,
    capacityFactor: 0,
    min: 0,
    max: 0,
    pacArray: null,
    showResult: false,
  };
  state = this.initialState;

  resetState = () => {
    this.setState(this.initialState);
  };

  handleModelChange = (newModel) => {
    this.setState({
      model: newModel,
      showResult: false,
    });
  };

  handleVariableValueChange = () => {
    this.setState({
      showResult: false,
    });
  };

  handleFormChange = (event, field) => {
    this.setState({
      [field]: event.target.value,
      showResult: false,
    });
  };

  handleFormSubmit = (CF, min, max, PAC_array) => {
    this.setState({
      capacityFactor: CF,
      min,
      max,
      pacArray: PAC_array,
      showResult: true,
    });
  };

  updateDailyData = async () => {
    this.resetState();
    getDailyData(this.props.coord, 2019).then((dailyData) => {
      this.setState({
        dailyData,
      });
    });
  };

  componentDidMount() {
    this.updateDailyData();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.coord !== this.props.coord
    ) {
      this.updateDailyData();
    }
  }

  render() {
    return (
      <Grid
        container
        flexDirection={{
          xs: "column",
          sm: "column",
          md: "row",
          lg: "row",
          xl: "row",
        }}
        spacing={2}
      >
        <Grid item xs={12} md={12}>
          <SectionTitle title={strings.variableSelection} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SelectCard
            title={strings.year}
            options={constants.years}
            onValueChange={this.props.onYearChange}
            value={this.props.year}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SelectCard
            title={strings.variable}
            options={variables}
            onValueChange={this.props.onVariableChange}
            value={this.props.variable}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SelectCard
            title={strings.model}
            options={models}
            onValueChange={this.handleModelChange}
            value={this.state.model}
          />
        </Grid>
        <Grid item xs={12}>
          {this.state.model === "basic" ? (
            <SolarBasicEstimation
              coord={this.props.coord}
              year={this.props.year}
              setup={this.state.setup}
              disabled={this.state.dailyData === null}
              dailyData={this.state.dailyData}
              onSetupChange={(event) => this.handleFormChange(event, "setup")}
              onVariableValueChange={this.handleVariableValueChange}
              onFormSubmit={this.handleFormSubmit}
            />
          ) : (
            <SolarAdvancedEstimation
              coord={this.props.coord}
              year={this.props.year}
              setup={this.state.setup}
              disabled={this.state.dailyData === null}
              dailyData={this.state.dailyData}
              onSetupChange={(event) => this.handleFormChange(event, "setup")}
              onVariableValueChange={this.handleVariableValueChange}
              onFormSubmit={this.handleFormSubmit}
            />
          )}
        </Grid>
        {this.state.showResult ? (
          <SolarEstimationResult
            data={this.state.pacArray}
            year={this.props.year}
            min={this.state.min}
            max={this.state.max}
            cf={this.state.capacityFactor}
          />
        ) : null}
      </Grid>
    );
  }
}

export default SolarEstimation;
