import React, { Component } from "react";
import { Box, Grid } from "@mui/material";
import SelectCard from "../cards/selectCard";
import SectionTitle from "../content/sectionTitle";
import SingleYearGraph from "./graphs/solarSingleYear";
import SingleDayGraph from "./graphs/solarSingleDay";
import YearlyGraph from "./graphs/solarYearlyGraph";
import YearlyMonthGraph from "./graphs/solarYearlyByMonth";
import YearlyHourGraph from "./graphs/solarYearlyByHour";
import constants from "../../utils/constants";
import { variables, graphOptions } from "../../utils/solarConstants";
import strings from "../../strings/es.json";

const Graphs = (props) => {
  switch (props.graphOption) {
    case "monthCycle":
      return (
        <SingleYearGraph
          coord={props.coord}
          variable={props.variable}
          year={props.year}
        />
      );
    case "hourCycle":
      return (
        <SingleDayGraph
          coord={props.coord}
          variable={props.variable}
          year={props.year}
        />
      );
    case "year":
      return (
        <YearlyGraph
          coord={props.coord}
          variable={props.variable}
          year={props.year}
        />
      );
    case "month":
      return <YearlyMonthGraph coord={props.coord} variable={props.variable} />;
    case "hour":
      return <YearlyHourGraph coord={props.coord} variable={props.variable} />;
    default:
      return (
        <SingleYearGraph
          coord={props.coord}
          variable={props.variable}
          year={props.year}
        />
      );
  }
};

class SolarGraphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphOption: "monthCycle",
    };
  }

  handleGraphOptionChange = (graphOption) => {
    this.setState({
      graphOption,
    });
  };

  render() {
    return (
      <Box>
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
              title={strings.graphType}
              options={graphOptions}
              onValueChange={this.handleGraphOptionChange}
              value={this.state.graphOption}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <SectionTitle
              title={`${variables[this.props.variable]} - ${
                graphOptions[this.state.graphOption]
              } ${this.props.year}`}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Graphs
              coord={this.props.coord}
              variable={this.props.variable}
              year={this.props.year}
              graphOption={this.state.graphOption}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default SolarGraphs;
