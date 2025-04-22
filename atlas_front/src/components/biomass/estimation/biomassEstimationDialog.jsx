import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import EstimationStepOne from "./biomassEstimationStepOne";
import EstimationStepTwo from "./biomassEstimationStepTwo";
import strings from "../../../strings/es.json";

const steps = [strings.massCompositionDry, strings.technologySelection];

class BiomassEstimationDialog extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      activeStep: 0,
      open: false,
      firstCalculation: true,
    };
    this.state = this.initialState;
  }

  handleNext = () => {
    const activeStep = this.state.activeStep;
    if (activeStep === steps.length - 1) {
      this.handleDialogSubmit();
    } else {
      this.setState({
        activeStep: activeStep + 1,
      });
    }
  };

  handleBack = () => {
    const activeStep = this.state.activeStep;
    if (activeStep === 0) {
      this.handleDialogClose();
    } else {
      this.setState({
        activeStep: activeStep - 1,
      });
    }
  };

  handleButtonClick = () => {
    this.props.onDialogOpen();
    this.setState({
      open: true,
    });
  };

  handleDialogClose = () => {
    this.setState(this.initialState);
  };

  handleDialogSubmit = () => {
    this.setState({
      activeStep: 0,
      open: false,
      firstCalculation: false,
    });
    this.props.onDialogSubmit();
  };

  render() {
    return (
      <Grid container justifyContent="center">
        <Button
          variant="outlined"
          startIcon={<BoltIcon />}
          onClick={this.handleButtonClick}
        >
          {this.state.firstCalculation
            ? strings.estimateGeneration
            : strings.estimateAgain}
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleDialogClose}
          maxWidth="xl"
        >
          <DialogTitle>{strings.estimateGeneration}</DialogTitle>
          <DialogContent>
            <Stepper activeStep={this.state.activeStep}>
              {steps.map((label, index) => {
                return (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {this.state.activeStep === 0 ? (
              <EstimationStepOne
                residues={this.props.residues}
                onResiduesChange={this.props.onResiduesChange}
              />
            ) : (
              <EstimationStepTwo
                selectedTechnology={this.props.selectedTechnology}
                variables={this.props.variables}
                onTechChange={this.props.onTechChange}
                onVariablesChange={this.props.onVariablesChange}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={this.handleBack}>
              {this.state.activeStep === 0 ? strings.cancel : strings.back}
            </Button>
            <Button onClick={this.handleNext}>
              {this.state.activeStep === steps.length - 1
                ? strings.estimate
                : strings.next}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

export default BiomassEstimationDialog;
