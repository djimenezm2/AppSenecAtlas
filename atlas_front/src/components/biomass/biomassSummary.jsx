import React, { Component } from "react";
import { Grid } from "@mui/material";
import VariableCard from "../cards/variableCard";
import BiomassProductionGraph from "./graphs/biomassProductionGraph";
import SelectCard from "../cards/selectCard";
import SectionTitle from "../content/sectionTitle";
import constants from "../../utils/constants";
import strings from "../../strings/es.json";

class BiomassSummary extends Component {
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
        <Grid item xs={12} md={6}>
          <SelectCard
            title={strings.crop}
            options={this.props.crops}
            onValueChange={this.props.onCropChange}
            value={this.props.crop}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <VariableCard
            title={strings.location}
            show={this.props !== undefined}
            value={
              this.props.location === null
                ? null
                : constants.toTitleCase(this.props.location)
            }
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
            title={strings.cropArea}
            show={this.props !== undefined}
            value={this.props.area.toFixed(2) + strings.symbolHectares}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <SectionTitle
            title={`${strings.productionHistory} - ${
              this.props.location === null
                ? ""
                : constants.toTitleCase(this.props.location)
            }`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <BiomassProductionGraph graphData={this.props.graphData} />
        </Grid>
      </Grid>
    );
  }
}

export default BiomassSummary;
