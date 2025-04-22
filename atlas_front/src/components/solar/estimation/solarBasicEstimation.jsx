import React, { Component } from "react";
import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";

import SectionTitle from "../../content/sectionTitle";

import { setups, basicModelVariables } from "../../../utils/solarConstants";
import { round2, getBasicPowerGeneration } from "../../../utils/solarFunctions";
import strings from "../../../strings/es.json";

class SolarBasicEstimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstCalculation: true,
      N: basicModelVariables[0].defaultValue,
      Pmp: basicModelVariables[1].defaultValue,
      gamma: basicModelVariables[2].defaultValue,
      beta: basicModelVariables[3].defaultValue,
      n: basicModelVariables[4].defaultValue,
      PT: basicModelVariables[5].defaultValue,
    };
  }

  handleValueChange = (event, field) => {
    this.props.onVariableValueChange();
    this.setState({
      [field]: event.target.value,
    });
  };

  handleButtonClick = () => {
    const data_bas = getBasicPowerGeneration(
      round2(this.props.coord[1]),
      this.props.dailyData,
      this.props.setup,
      this.state.N,
      this.state.gamma,
      this.state.beta,
      this.state.Pmp,
      this.state.n,
      this.state.PT
    );
    this.props.onFormSubmit(
      data_bas.CF,
      data_bas.min,
      data_bas.max,
      data_bas.PAC_array
    );
    this.setState({
      firstCalculation: false,
    });
  };

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SectionTitle
            title={`${strings.setupCharacteristics} - ${strings.basicModel}`}
          />
        </Grid>
        <Grid item xs={12}>
          <Tooltip title={strings.setupTypeDescription}>
            <FormControl fullWidth>
              <InputLabel id="tech-label">{strings.setupType}</InputLabel>
              <Select
                value={this.props.setup}
                label={strings.setupType}
                onChange={this.props.onSetupChange}
                fullWidth
              >
                {setups.map((item) => {
                  let itemValue = item.value;
                  let itemLabel = item.label;
                  return (
                    <MenuItem key={itemValue} value={itemValue}>
                      <Typography variant="body2" noWrap>
                        {itemLabel}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        {basicModelVariables.map((variable, index) => (
          <Grid item xs={6} key={index}>
            <Tooltip title={variable.description}>
              <TextField
                type="number"
                label={variable.label}
                value={this.state[variable.value]}
                onChange={(e) => this.handleValueChange(e, variable.value)}
                fullWidth
              />
            </Tooltip>
          </Grid>
        ))}
        <Grid item xs={12} align={"center"}>
          <Button
            variant="outlined"
            startIcon={<BoltIcon />}
            onClick={this.handleButtonClick}
            disabled={this.props.disabled}
          >
            <Typography variant="body2">
              {this.state.firstCalculation
                ? strings.estimate
                : strings.estimateAgain}
            </Typography>
            {this.props.disabled ? (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            ) : null}
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default SolarBasicEstimation;
