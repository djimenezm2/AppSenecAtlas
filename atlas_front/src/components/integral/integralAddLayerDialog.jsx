import React, { Component } from "react";
import {
  Alert,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import SelectFileInput from "./integralSelectFileInput";
import CustomSnackbar from "../content/customSnackbar";
import { uploadFile, getUnits, addLayers } from "../../services/mapsAPI";
import constants from "../../utils/constants";
import strings from "../../strings/es.json";

class AddLayerDialog extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      open: false,
      name: "",
      units: 1,
      unitsList: null,
      file: null,
      metadataFile: null,
      thumbnailFile: null,
      isNameEmpty: false,
      isUnitsEmpty: false,
      isFileNull: false,
      progress: 0,
      success: "success",
      openResult: false,
      openProcessing: false,
      resultMessage: "",
    };
    this.state = this.initialState;
  }

  resetState = () => {
    this.setState(this.initialState);
  };

  handleButtonClick = () => {
    getUnits().then((unitsList) => {
      this.setState({
        open: true,
        unitsList,
      });
    });
  };

  handleUploadUpdate = (percentCompleted) => {
    this.setState({
      progress: percentCompleted,
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
    } else if (field === "units") {
      const units = event.target.value;
      const isUnitsEmpty = units === "";
      this.setState({
        units,
        isUnitsEmpty,
      });
    } else {
      this.setState({
        [field]: event.target.value,
      });
    }
  };

  handleFileChange = (event, file) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (file === "file") {
        this.setState({
          isFileNull: false,
        });
      }
      this.setState({
        [file]: selectedFile,
      });
    }
  };

  handleUnitsChange = (event) => {
    this.setState({ units: event.target.value });
  };

  handleDialogClose = () => {
    this.resetState();
  };

  handleResultClose = () => {
    this.resetState();
  };

  handleDialogSubmit = async () => {
    const { name, units, file, metadataFile, thumbnailFile } = this.state;
    if (name === "" || units === "" || file === null) {
      this.setState({
        isNameEmpty: name === "",
        isUnitsEmpty: units === "",
        isFileNull: file === null,
      });
    } else {
      this.setState({
        open: false,
        openProcessing: true,
      });
      const fileFormData = new FormData();
      const indicatorFormData = new FormData();

      indicatorFormData.append("name", name);
      indicatorFormData.append("units", units);
      if (thumbnailFile !== null) {
        indicatorFormData.append("thumbnail", thumbnailFile);
      }
      if (metadataFile !== null) {
        fileFormData.append("metadataFile", metadataFile);
      }

      fileFormData.append("file", file);
      await uploadFile(indicatorFormData, fileFormData, this.handleUploadUpdate)
        .then((response) => {
          const filePath = response.file.file_path;
          const indicatorId = response.indicator.indicator_id;
          const formData = new FormData();
          formData.append("file_path", filePath);
          formData.append("indicator_id", indicatorId);
          addLayers(formData)
            .then((response) => {
              this.setState({
                openResult: true,
                openProcessing: false,
                success: "success",
                resultMessage: `${response.message}`,
              });
            })
            .then(() => this.props.onUploadSuccess())
            .catch((error) =>
              this.setState({
                openResult: true,
                openProcessing: false,
                success: "error",
                resultMessage: `${strings.serverError}: ${error.message}`,
              })
            );
        })
        .catch((error) => {
          this.setState({
            openResult: true,
            openProcessing: false,
            success: "error",
            resultMessage: `${strings.serverError}: ${error.response.data.message}`,
          });
        });
    }
  };

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={this.handleButtonClick}
        >
          {strings.addNewLayer}
        </Button>
        <Dialog open={this.state.open} onClose={this.handleDialogClose}>
          {this.state.progress > 0 ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress
                variant="determinate"
                value={this.state.progress}
              />
            </Box>
          ) : null}
          <DialogTitle>{strings.addNewLayer}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DialogContentText>
                  {strings.addNewLayerSelectFile}
                </DialogContentText>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={strings.name}
                  name="name"
                  value={this.state.name}
                  onChange={(event) => {
                    this.handleFormChange(event, "name");
                  }}
                  variant="outlined"
                  error={this.state.isNameEmpty}
                  helperText={this.state.isNameEmpty ? strings.addName : ""}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {this.state.unitsList ? (
                  <FormControl fullWidth>
                    <InputLabel id="tech-label">{strings.units}</InputLabel>
                    <Select
                      value={this.state.units}
                      label={strings.units}
                      onChange={this.handleUnitsChange}
                      fullWidth
                    >
                      {this.state.unitsList.map((item) => {
                        let itemKey = item.id;
                        let itemValue = item.abbreviation;
                        return (
                          <MenuItem key={itemKey} value={itemKey}>
                            <Typography variant="body2" noWrap>
                              {`${item.name} (${itemValue})`}
                            </Typography>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                ) : (
                  <Skeleton variant="rounded" width={"100%"} height={"100%"} />
                )}
              </Grid>
              <Grid item xs={12}>
                <SelectFileInput
                  label={strings.layer}
                  buttonText={strings.selectFile}
                  helperText={`${strings.acceptedFormats}: `}
                  formats={[strings.symbolTIF, strings.symbolTIFF]}
                  file={this.state.file}
                  error={this.state.isFileNull}
                  onFileChange={(event) => {
                    this.handleFileChange(event, "file");
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <SelectFileInput
                  label={strings.metadata}
                  buttonText={strings.selectFile}
                  file={this.state.metadataFile}
                  onFileChange={(event) => {
                    this.handleFileChange(event, "metadataFile");
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <SelectFileInput
                  label={strings.thumbnail}
                  buttonText={strings.selectFile}
                  helperText={`${strings.acceptedFormats}: `}
                  formats={[strings.symbolPNG, strings.symbolJPG]}
                  file={this.state.thumbnailFile}
                  error={false}
                  onFileChange={(event) => {
                    this.handleFileChange(event, "thumbnailFile");
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={this.handleDialogClose}>
              {strings.cancel}
            </Button>
            <Button
              type="submit"
              color="primary"
              onClick={this.handleDialogSubmit}
            >
              {strings.load}
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
          message={strings.processingFile}
          open={this.state.openProcessing}
        />
      </div>
    );
  }
}

export default AddLayerDialog;
