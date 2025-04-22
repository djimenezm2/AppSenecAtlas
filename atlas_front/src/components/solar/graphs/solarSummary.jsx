import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, CircularProgress, Grid } from "@mui/material";
import SectionTitle from "../../content/sectionTitle";
import constants from "../../../utils/constants";
import { solarTheme } from "../../../themes/themes";
import strings from "../../../strings/es.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SolarSummaryGraph(props) {
  const graphData = props.graphData;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (graphData) {
      setData({
        labels: constants.months({ count: graphData.length }),
        datasets: [
          {
            label: strings.dhi,
            data: graphData.map((item) => item.dhi),
            backgroundColor: solarTheme.palette.secondary.main,
          },
          {
            label: strings.dni,
            data: graphData.map((item) => item.dni),
            backgroundColor: solarTheme.palette.secondary.light,
          },
        ],
      });
    }
  }, [graphData]);

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
          <SectionTitle title={strings.ghi} />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ minHeight: "25vh", padding: 2 }}>
            <Bar
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                spanGaps: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default SolarSummaryGraph;
