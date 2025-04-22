import React, { Component } from "react";
import {
  MenuItem,
  Select,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Paper,
} from "@mui/material";

import strings from "../../../strings/es.json";

class AnalyzeStepTwo extends Component {
  handleValueChange = (index, element, value) => {
    const updatedLayers = [...this.props.data];
    updatedLayers[index][element] = parseFloat(value);
    this.props.onSelectedIndicatorsChange(updatedLayers);
  };
  render() {
    return (
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table aria-label="layers table">
          <TableHead>
            <TableRow>
              <TableCell>{strings.name}</TableCell>
              <TableCell>{strings.weight}</TableCell>
              <TableCell>{strings.relationship}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.data.map((row, index) => (
              <TableRow key={row.name}>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={row.weight}
                    onChange={(e) =>
                      this.handleValueChange(index, "weight", e.target.value)
                    }
                    InputProps={{
                      inputProps: {
                        min: 1,
                        max: 5,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={row.relation}
                    label="Relación"
                    onChange={(e) =>
                      this.handleValueChange(index, "relation", e.target.value)
                    }
                  >
                    <MenuItem value={0}>{strings.direct}</MenuItem>
                    <MenuItem value={1}>{strings.inverse}</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default AnalyzeStepTwo;
