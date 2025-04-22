import React, { Component } from "react";

import { Alert, Snackbar, CircularProgress } from "@mui/material";

class CustomSnackbar extends Component {
  render() {
    return (
      <Snackbar open={this.props.open} onClose={this.props.handleClose}>
        <Alert
          onClose={this.props.handleClose}
          icon={<CircularProgress size={20} />}
          severity="info"
          sx={{ width: "100%" }}
        >
          {this.props.message}
        </Alert>
      </Snackbar>
    );
  }
}

export default CustomSnackbar;
