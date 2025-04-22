import React, { Component } from "react";
import {
  Button,
  Chip,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { styled } from "@mui/material/styles";

import functions from "../../utils/functions";
import strings from "../../strings/es.json";

const StyledButton = styled(Button)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

class SelectFileInput extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
  }

  handleFileUpload = () => {
    this.fileInputRef.current.click();
  };

  render() {
    return (
      <FormControl
        fullWidth
        error={this.props.error}
        required={this.props.required}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <FormLabel htmlFor="file-input">{this.props.label}</FormLabel>
          </Grid>
          {this.props.file ? (
            <Grid item xs={12} justifyContent="center">
              <StyledButton
                variant="outlined"
                fullWidth
                color="primary"
                onClick={this.handleFileUpload}
              >
                <InsertDriveFileIcon />
                {`${this.props.file.name} (${functions.bytesToMb(
                  this.props.file.size
                )}${strings.symbolMB})`}
              </StyledButton>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} sm={6}>
                <StyledButton
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={this.handleFileUpload}
                >
                  <CloudUploadOutlinedIcon />
                  {this.props.buttonText}
                </StyledButton>
              </Grid>

              {this.props.helperText ? (
                <Grid item xs={12} sm={4}>
                  <Typography variant="body1">
                    {this.props.helperText}
                  </Typography>
                </Grid>
              ) : null}

              {this.props.formats ? (
                <Grid item xs={12} sm={2}>
                  <Stack direction="row" spacing={1}>
                    {this.props.formats.map((format, index) => {
                      return (
                        <Chip
                          key={index}
                          label={format}
                          variant="outlined"
                          size="small"
                        />
                      );
                    })}
                  </Stack>
                </Grid>
              ) : null}
            </>
          )}
          <input
            id="file-input"
            ref={this.fileInputRef}
            type="file"
            name="file"
            style={{ display: "none" }}
            onChange={this.props.onFileChange}
            required
          />
        </Grid>
        {this.props.error && (
          <FormHelperText>{strings.fileRequired}</FormHelperText>
        )}
      </FormControl>
    );
  }
}

export default SelectFileInput;
