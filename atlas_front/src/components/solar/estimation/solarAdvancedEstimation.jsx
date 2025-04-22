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

import { setups, advancedModelVariables } from "../../../utils/solarConstants";
import {
  round2,
  getAdvancedPowerGeneration,
} from "../../../utils/solarFunctions";
import strings from "../../../strings/es.json";

class SolarAdvancedEstimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstCalculation: true,
      N: advancedModelVariables[0].defaultValue,
      s: advancedModelVariables[1].defaultValue,
      beta: advancedModelVariables[2].defaultValue,
      iscref: advancedModelVariables[3].defaultValue,
      vocref: advancedModelVariables[4].defaultValue,
      impref: advancedModelVariables[5].defaultValue,
      vmpref: advancedModelVariables[6].defaultValue,
      alphaisc: advancedModelVariables[7].defaultValue,
      betavoc: advancedModelVariables[8].defaultValue,
      n: advancedModelVariables[9].defaultValue,
      PT: advancedModelVariables[10].defaultValue,
    };
  }

  handleValueChange = (event, field) => {
    this.props.onVariableValueChange();
    this.setState({
      [field]: event.target.value,
    });
  };

  handleButtonClick = () => {
    const data_adv = getAdvancedPowerGeneration(
      round2(this.props.coord[1]),
      this.props.dailyData,
      this.props.setup,
      this.state.s,
      this.state.N,
      this.state.beta,
      this.state.iscref,
      this.state.vocref,
      this.state.impref,
      this.state.vmpref,
      this.state.alphaisc,
      this.state.betavoc,
      this.state.n,
      this.state.PT
    );
    this.props.onFormSubmit(
      data_adv.CF,
      data_adv.min,
      data_adv.max,
      data_adv.PAC_array
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
            title={`${strings.setupCharacteristics} - ${strings.advancedModel}`}
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
        {advancedModelVariables.map((variable, index) => (
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

export default SolarAdvancedEstimation;
