import React, { Component } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

import CustomSnackbar from "../../content/customSnackbar";
import AnalyzeStepOne from "./integralAnalyzeStepOne";
import AnalyzeStepTwo from "./integralAnalyzeStepTwo";
import { analyzeLayers, addIndicator } from "../../../services/mapsAPI";
import constants from "../../../utils/constants";
import strings from "../../../strings/es.json";

const steps = [strings.describeAnalysis, strings.defineLayers];

class AnalyzeDialog extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      activeStep: 0,
      open: false,
      name: "",
      cellSize: 10,
      success: "success",
      isNameEmpty: false,
      openResult: false,
      openProcessing: false,
      resultMessage: "",
    };
    this.state = this.initialState;
  }

  resetState = () => {
    this.setState(this.initialState);
  };

  handleNext = () => {
    const { name, activeStep } = this.state;
    if (name === "") {
      this.setState({
        isNameEmpty: name === "",
      });
    } else {
      if (activeStep === steps.length - 1) {
        this.handleDialogSubmit();
      } else {
        this.setState({
          activeStep: activeStep + 1,
        });
      }
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

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleButtonClick = () => {
    this.setState({
      open: true,
    });
  };

  handleFormChange = (event, field) => {
    if (field === "name") {
      const name = event.target.value;
      if (name !== "" && !constants.TEXTFIELD_REGEX.test(name)) {
        return;
      }
      const isNameEmpty = name === "";
      this.setState({
        name,
        isNameEmpty,
      });
    } else {
      this.setState({
        [field]: event.target.value,
      });
    }
  };

  handleDialogClose = () => {
    this.resetState();
  };

  handleResultClose = () => {
    this.resetState();
  };

  handleDialogSubmit = async () => {
    this.setState({
      open: false,
      openProcessing: true,
    });
    const indicatorFormData = new FormData();

    indicatorFormData.append(
      "name",
      `${this.state.name} (${new Date().toLocaleString()})`
    );
    indicatorFormData.append("units", 1);

    await addIndicator(indicatorFormData)
      .then((response) => {
        const indicatorId = response.indicator_id;
        const formData = new FormData();
        formData.append("indicator_id", indicatorId);
        formData.append("name", this.state.name);
        formData.append("cell_size", this.state.cellSize);
        formData.append("extent", this.props.wktPolygon);
        formData.append(
          "selected_ids",
          this.props.selectedIndicators.map((i) => i.id).toString()
        );
        formData.append(
          "weights",
          this.props.selectedIndicators.map((i) => i.weight).toString()
        );
        formData.append(
          "relations",
          this.props.selectedIndicators.map((i) => i.relation).toString()
        );
        analyzeLayers(formData)
          .then((response) => {
            this.setState({
              open: false,
              openResult: true,
              openProcessing: false,
              success: "success",
              resultMessage: `${response.message}`,
            });
          })
          .then(() => this.props.onUploadSuccess())
          .catch((error) =>
            this.setState({
              open: false,
              openResult: true,
              openProcessing: false,
              success: "error",
              resultMessage: `${strings.serverError}: ${error.message}`,
            })
          );
      })
      .catch((error) =>
        this.setState({
          open: false,
          openResult: true,
          openProcessing: false,
          success: "error",
          resultMessage: `${strings.serverError}: ${error.message}`,
        })
      );
  };

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          fullWidth
          disabled={
            this.props.wktPolygon === null ||
            this.props.selectedIndicators.length <= 1 ||
            this.state.openProcessing
          }
          startIcon={<TravelExploreIcon />}
          onClick={this.handleButtonClick}
        >
          {`${strings.analyze} (${this.props.selectedIndicators.length} ${strings.layers})`}
        </Button>
        <Dialog open={this.state.open} onClose={this.handleDialogClose}>
          <DialogTitle>{strings.analysis}</DialogTitle>
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
              <AnalyzeStepOne
                name={this.state.name}
                cellSize={this.state.cellSize}
                isNameEmpty={this.state.isNameEmpty}
                wktPolygon={this.props.wktPolygon}
                onFormChange={this.handleFormChange}
              />
            ) : (
              <AnalyzeStepTwo
                data={this.props.selectedIndicators}
                onSelectedIndicatorsChange={
                  this.props.onSelectedIndicatorsChange
                }
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={this.handleBack}>
              {this.state.activeStep === 0 ? strings.cancel : strings.back}
            </Button>
            <Button onClick={this.handleNext}>
              {this.state.activeStep === steps.length - 1
                ? strings.runAnalysis
                : strings.next}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={this.state.openResult}
          autoHideDuration={6000}
          onClose={this.handleResultClose}
        >
          <Alert
            severity={this.state.success}
            onClose={this.handleResultClose}
            sx={{ width: "100%" }}
          >
            {this.state.resultMessage}
          </Alert>
        </Snackbar>
        <CustomSnackbar
          handleClose={() => {
            this.setState({ openProcessing: false });
          }}
          message={strings.runningAnalysis}
          open={this.state.openProcessing}
        />
      </div>
    );
  }
}

export default AnalyzeDialog;
