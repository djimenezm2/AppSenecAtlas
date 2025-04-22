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
import constants from "../../../utils/constants";
import { variables } from "../../../utils/solarConstants";
import { solarTheme } from "../../../themes/themes";
import { getHourlyData } from "../../../services/solarDataAPI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SingleDayGraph(props) {
  const { coord, year, variable } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    getHourlyData(coord, year).then((graphData) => {
      setData({
        labels: Object.values(constants.hours),
        datasets: [
          {
            label: variables[variable],
            data: graphData.map((item) => item[variable]),
            backgroundColor: solarTheme.palette.primary.dark,
          },
        ],
      });
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

export default SingleDayGraph;
