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
import { Box, CircularProgress } from "@mui/material";
import { biomassTheme } from "../../../themes/themes";
import strings from "../../../strings/es.json"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BiomassProductionGraph(props) {
  const graphData = props.graphData;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (graphData) {
      setData({
        labels: graphData.map((item) => item.periodo),
        datasets: [
          {
            label: strings.historic,
            data: graphData.map((item) => item.produccion),
            backgroundColor: biomassTheme.palette.secondary.main,
          },
        ],
      });
    }
  }, [graphData]);

  if (data === null) {
    return (
      <Box sx={{ minWidth: "100%", display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  } else {
    return (
      <Box sx={{ minHeight: "30vh", padding: 2 }}>
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

export default BiomassProductionGraph;
