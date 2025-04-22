import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, CircularProgress, Grid } from "@mui/material";
import constants from "../../../utils/constants";
import { variables } from "../../../utils/solarConstants";
import { solarTheme } from "../../../themes/themes";
import { getMonthlyData } from "../../../services/solarDataAPI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SingleYearGraph(props) {
  const { coord, year, variable } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    getMonthlyData(coord, year).then((graphData) => {
      setData({
        labels: constants.months({ count: graphData.length }),
        datasets: [
          {
            label: variables[variable],
            data: graphData.map((item) => item[variable]),
            borderColor: solarTheme.palette.secondary.light,
            backgroundColor: solarTheme.palette.secondary.main,
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
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ minHeight: "40vh", padding: 2 }}>
            <Line
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
        </Grid>
      </Grid>
    );
  }
}

export default SingleYearGraph;
