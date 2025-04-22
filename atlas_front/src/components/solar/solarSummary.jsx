import React, { Component } from "react";
import { Grid } from "@mui/material";
import VariableCard from "../cards/variableCard";
import SolarSummaryGraph from "./graphs/solarSummary";
import SectionTitle from "../content/sectionTitle";
import SelectCard from "../cards/selectCard";
import constants from "../../utils/constants";
import { variables } from "../../utils/solarConstants";
import strings from "../../strings/es.json";

class SolarSummary extends Component {
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
        {this.props.yearlyData ? (
          <>
            <Grid item xs={12} md={12}>
              <SectionTitle title={strings.variableSelection} />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectCard
                title={strings.year}
                options={constants.years}
                onValueChange={this.props.onYearChange}
                value={this.props.year}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectCard
                title={strings.variable}
                options={variables}
                onValueChange={this.props.onVariableChange}
                value={this.props.variable}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <SectionTitle title={strings.generalInfo} />
            </Grid>
            <Grid item xs={12} md={4}>
              <VariableCard
                title={strings.latitude}
                show={this.props !== undefined}
                value={this.props.coord[1].toFixed(2) + strings.symbolDegrees}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <VariableCard
                title={strings.longitude}
                show={this.props !== undefined}
                value={this.props.coord[0].toFixed(2) + strings.symbolDegrees}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <VariableCard
                title={strings.elevation}
                show={this.props !== undefined}
                value={
                  this.props.yearlyData.ghi.toFixed(2) + strings.symbolMAMSL
                }
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <SectionTitle
                title={`${strings.averageYearlyIrradiation} - ${this.props.year}`}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <VariableCard
                title={strings.ghi}
                show={this.props !== undefined}
                value={
                  this.props.yearlyData.ghi.toFixed(2) +
                  strings.symbolIrradiation
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <VariableCard
                title={strings.dhi}
                show={this.props !== undefined}
                value={
                  this.props.yearlyData.dhi.toFixed(2) +
                  strings.symbolIrradiation
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <VariableCard
                title={strings.dni}
                show={this.props !== undefined}
                value={
                  this.props.yearlyData.dni.toFixed(2) +
                  strings.symbolIrradiation
                }
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <SectionTitle title={strings.averageMeteorologicalInfo} />
            </Grid>
            <Grid item xs={12} md={4}>
              <VariableCard
                title={strings.temperature}
                show={this.props !== undefined}
                value={
                  this.props.yearlyData.temperature.toFixed(2) +
                  strings.symbolCelsius
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <VariableCard
                title={strings.windSpeed}
                show={this.props !== undefined}
                value={
                  this.props.yearlyData.wind_speed.toFixed(2) +
                  strings.metersPerSecond
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <VariableCard
                title={strings.solarZenithAngle}
                show={this.props !== undefined}
                value={
                  this.props.yearlyData.solar_zenith_angle.toFixed(2) +
                  strings.symbolDegrees
                }
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <SolarSummaryGraph graphData={this.props.monthlyData} />
            </Grid>
          </>
        ) : null}
      </Grid>
    );
  }
}

export default SolarSummary;
