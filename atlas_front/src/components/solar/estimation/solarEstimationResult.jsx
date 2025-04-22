import React from "react";
import { Grid } from "@mui/material";

import SectionTitle from "../../content/sectionTitle";
import VariableCard from "../../cards/variableCard";
import SolarGenerationGraph from "../graphs/solarGenerationGraph";
import SolarEstimationDialog from "./solarEstimationDialog";
import { dayToDate, round2 } from "../../../utils/solarFunctions";
import constants from "../../../utils/constants";
import strings from "../../../strings/es.json";

class SolarEstimationResult extends React.Component {
  constructor(props) {
    super(props);

    this.months = constants.months({ count: 12 });

    this.dates = this.props.data.map((day) => ({
      date: dayToDate(this.props.year, day.x),
      y: day.y,
    }));

    this.groups = this.groupDatesByMonth();
    this.means = this.calculateMeans();
  }

  groupDatesByMonth() {
    return this.dates.reduce((previous, current) => {
      const month = current.date.getMonth();
      const monthKey = this.months[month];

      if (previous[monthKey]) {
        previous[monthKey].data.push(current);
      } else {
        previous[monthKey] = { data: [current] };
      }

      return previous;
    }, {});
  }

  calculateMeans() {
    return this.months.map((month) => {
      const monthData = this.groups[month];
      const length = monthData.data.length;
      const sum = monthData.data.reduce((a, b) => a + b.y, 0);

      return {
        month,
        Potencia: round2(sum / length) || 0,
      };
    });
  }

  render() {
    return (
      <>
        <Grid item xs={12} md={12}>
          <SectionTitle
            title={`${strings.powerGeneratedByMonth} - ${this.props.year}`}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <VariableCard
            title={strings.minimum}
            show={this.props !== undefined}
            value={`${this.props.min.toFixed(2)}${strings.kwhDay}`}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <VariableCard
            title={strings.maximum}
            show={this.props !== undefined}
            value={`${this.props.max.toFixed(2)}${strings.kwhDay}`}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <VariableCard
            title={strings.capacityFactor}
            show={this.props !== undefined}
            value={
              isFinite(this.props.cf)
                ? `${(this.props.cf * 100).toFixed(2)}%`
                : "--"
            }
          />
        </Grid>
        <Grid item xs={12} align={"center"}>
          <SolarGenerationGraph graphData={this.means} />
          <SolarEstimationDialog
            graphData={this.props.data}
            year={this.props.year}
          />
        </Grid>
      </>
    );
  }
}

export default SolarEstimationResult;
