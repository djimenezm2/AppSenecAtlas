import React, { useState, useEffect } from "react";

import { Box, CircularProgress, Grid } from "@mui/material";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import constants from "../../../utils/constants";
import { getMonthlyData } from "../../../services/solarDataAPI";

function YearlyMonthGraph(props) {
  const { coord, year, variable } = props;
  const [data, setData] = useState(null);
  const [minValue, setminValue] = useState(0);
  const [maxValue, setmaxValue] = useState(0);

  useEffect(() => {
    getMonthlyData(coord).then((graphData) => {
      const uniqueYears = [...new Set(graphData.map((item) => item.year))];
      const months = constants.months({ count: 12 });
      const values = graphData.map((item)=>item[variable])
      setminValue(Math.min(...values))
      setmaxValue(Math.max(...values))
      let processedData = [];
      for (let x in uniqueYears) {
        const yearFilter = graphData.filter(
          (item) => item.year === uniqueYears[x]
        );
        const yearData = yearFilter.map((item) => {
          return { x: months[item.month - 1], y: item[variable] };
        });
        processedData.push({ id: uniqueYears[x], data: yearData });
      }
      setData(processedData);
    });
  }, [coord, year, variable]);

  if (data === null) {
    return (
      <Box
        sx={{
          minHeight: "40vh",
          minWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  } else {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ height: "50vh", padding: 2 }}>
            <ResponsiveHeatMap
              data={data}
              margin={{ top: 60, bottom: 90, left: 40 }}
              valueFormat=" >-,.3r"
              axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -90,
                legend: "",
                legendOffset: 46,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              colors={{
                type: "sequential",
                scheme: "yellow_orange_red",
                minValue: minValue,
                maxValue: maxValue,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default YearlyMonthGraph;
