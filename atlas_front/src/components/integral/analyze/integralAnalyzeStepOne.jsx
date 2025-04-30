  import React, { Component } from "react";
  import { InputAdornment, Grid, TextField } from "@mui/material";

  import strings from "../../../strings/es.json";

  class AnalyzeStepOne extends Component {
    render() {
      return (
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              label={strings.name}
              name="name"
              value={this.props.name}
              onChange={(event) => {
                this.props.onFormChange(event, "name");
              }}
              variant="outlined"
              required
              error={this.props.isNameEmpty}
              helperText={
                this.props.isNameEmpty ? strings.addName : ""
              }
              // Add maxx text length to the input to 30
              inputProps={{
                maxLength: 30,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label={strings.cellSize}
              name="cellSize"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {strings.symbolMeters}
                  </InputAdornment>
                ),
                inputProps: {
                  min: 10,
                },
              }}
              value={this.props.cellSize}
              onChange={(event) => {
                this.props.onFormChange(event, "cellSize");
              }}
              variant="outlined"
              required
            />
          </Grid>
        </Grid>
      );
    }
  }

  export default AnalyzeStepOne;
