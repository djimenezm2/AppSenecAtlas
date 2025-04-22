import React, { Component } from "react";
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
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { solarTheme } from "../../../themes/themes";
import strings from "../../../strings/es.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

class SolarEstimationDialog extends Component {
  constructor(props) {
    super(props);
    this.data = {
      labels: props.graphData.map((item) => item.x),
      datasets: [
        {
          label: strings.power,
          data: props.graphData.map((item) => item.y),
          borderColor: solarTheme.palette.secondary.light,
          backgroundColor: solarTheme.palette.secondary.main,
        },
      ],
    };
    this.state = {
      open: false,
    };
  }

  handleButtonClick = () => {
    this.setState({
      open: true,
    });
  };

  handleDialogClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <Grid container justifyContent="center">
        <Button
          variant="outlined"
          startIcon={<QueryStatsIcon />}
          onClick={this.handleButtonClick}
        >
          {strings.detailedGraph}
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleDialogClose}
          maxWidth="xl"
        >
          <DialogTitle>{`${strings.powerGeneratedByDay} - ${this.props.year}`}</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                <Box sx={{ minHeight: "40vh", padding: 2, minWidth: "100vh" }}>
                  <Line
                    data={this.data}
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
                          type: "linear",
                          display: true,
                          title: {
                            display: true,
                            text: strings.numberOfDay,
                          },
                        },
                        y: {
                          type: "linear",
                          display: true,
                          title: {
                            display: true,
                            text: strings.power,
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={this.handleDialogClose}>
              {strings.close}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

export default SolarEstimationDialog;
