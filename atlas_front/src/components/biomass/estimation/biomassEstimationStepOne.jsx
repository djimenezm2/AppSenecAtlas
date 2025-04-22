import React, { Component } from "react";
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import strings from "../../../strings/es.json";

class EstimationStepOne extends Component {
  handleValueChange = (index, element, value) => {
    const updatedResidues = [...this.props.residues];
    updatedResidues[index][element] = parseFloat(value);
    this.props.onResiduesChange(updatedResidues);
  };
  render() {
    return (
      <Grid container marginTop={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Tooltip title={strings.residueDescription} arrow>
                    <Typography>{strings.residue}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={strings.carbonDescription} arrow>
                    <Typography>{strings.carbon}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={strings.hydrogenDescription} arrow>
                    <Typography>{strings.hydrogen}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={strings.oxygenDescription} arrow>
                    <Typography>{strings.oxygen}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={strings.nitrogenDescription} arrow>
                    <Typography>{strings.nitrogen}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={strings.sulfurDescription} arrow>
                    <Typography>{strings.sulfur}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={strings.ashDescription} arrow>
                    <Typography>{strings.ash}</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={strings.humidityDescription} arrow>
                    <Typography>{strings.humidity}</Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.residues.map((residue, index) => (
                <TableRow key={index}>
                  <TableCell>{residue.nombre}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={residue.c}
                      onChange={(e) =>
                        this.handleValueChange(index, "c", e.target.value)
                      }
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 1,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={residue.h}
                      onChange={(e) =>
                        this.handleValueChange(index, "h", e.target.value)
                      }
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 1,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={residue.o}
                      onChange={(e) =>
                        this.handleValueChange(index, "o", e.target.value)
                      }
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 1,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={residue.n}
                      onChange={(e) =>
                        this.handleValueChange(index, "n", e.target.value)
                      }
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 1,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={residue.s}
                      onChange={(e) =>
                        this.handleValueChange(index, "s", e.target.value)
                      }
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 1,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={residue.ceniza}
                      onChange={(e) =>
                        this.handleValueChange(index, "ceniza", e.target.value)
                      }
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 1,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={residue.humedad}
                      onChange={(e) =>
                        this.handleValueChange(index, "humedad", e.target.value)
                      }
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: 1,
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    );
  }
}

export default EstimationStepOne;
