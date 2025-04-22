import React from "react";
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
import { Box, CircularProgress } from "@mui/material";
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

function SolarGenerationGraph(props) {
  const data = {
    labels: props.graphData.map((item) => item.month),
    datasets: [
      {
        label: strings.power,
        data: props.graphData.map((item) => item.Potencia),
        backgroundColor: solarTheme.palette.primary.dark,
      },
    ],
  };

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
      <Box sx={{ minHeight: "40vh", padding: 2 }}>
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
          }}
        />
      </Box>
    );
  }
}

export default SolarGenerationGraph;
