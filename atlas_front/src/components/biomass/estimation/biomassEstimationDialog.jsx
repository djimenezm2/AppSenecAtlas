// BiomassEstimationDialog.jsx

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

// Steps labels for the dialog
const steps = [strings.massCompositionDry, strings.technologySelection];

// Dialog for biomass generation estimation
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

  // Open the dialog
  handleButtonClick = () => {
    this.props.onDialogOpen();
    this.setState({ open: true });
  };

  // Close the dialog (without resetting step yet)
  handleDialogClose = () => {
    this.setState({ open: false });
  };

  // Submit dialog (close and notify parent)
  handleDialogSubmit = () => {
    this.setState({ firstCalculation: false, open: false });
    this.props.onDialogSubmit();
  };

  // Reset to the first step after closing the dialog
  resetToFirstStep = () => {
    this.setState({ activeStep: 0 });
  };

  // Go to next step or submit if it's the last
  handleNext = () => {
    if (this.state.activeStep === steps.length - 1) {
      this.handleDialogSubmit();
    } else {
      this.setState(({ activeStep }) => ({ activeStep: activeStep + 1 }));
    }
  };

  // Go to previous step or cancel if at the first
  handleBack = () => {
    if (this.state.activeStep === 0) {
      this.handleDialogClose();
    } else {
      this.setState(({ activeStep }) => ({ activeStep: activeStep - 1 }));
    }
  };

  render() {
    return (
      <Grid container justifyContent="center">
        {/* Button to open the estimation dialog */}
        <Button
          variant="outlined"
          startIcon={<BoltIcon />}
          onClick={this.handleButtonClick}
        >
          {this.state.firstCalculation
            ? strings.estimateGeneration
            : strings.estimateAgain}
        </Button>

        {/* Dialog for the multi-step estimation */}
        <Dialog
          open={this.state.open}
          onClose={this.handleDialogClose}
          maxWidth="xl"
          TransitionProps={{
            // Reset to first step after dialog closes
            onExited: this.resetToFirstStep
          }}
        >
          <DialogTitle>{strings.estimateGeneration}</DialogTitle>

          <DialogContent>
            {/* Stepper showing current step */}
            <Stepper activeStep={this.state.activeStep}>
              {steps.map((label, idx) => (
                <Step key={idx}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Render the step content */}
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

          {/* Dialog navigation actions */}
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
