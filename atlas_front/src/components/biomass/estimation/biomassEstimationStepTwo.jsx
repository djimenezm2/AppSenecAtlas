import React, { Component } from "react";
import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Tooltip,
  Skeleton,
} from "@mui/material";

import {
  getTechnologies,
  getVariables,
} from "../../../services/biomassDataAPI";

import strings from "../../../strings/es.json";

class EstimationStepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      technologies: null,
    };
  }

  updateTechnologies = async () => {
    getTechnologies().then((techList) => {
      this.props.onTechChange(techList[0].id);
      this.setState({
        technologies: techList,
      });
    });
  };

  handleTechChange = async (event) => {
    const newTechId = event.target.value;
    getVariables(null, newTechId).then((variableList) => {
      this.props.onTechChange(newTechId);
      this.props.onVariablesChange(
        variableList.map((obj) => ({
          ...obj,
          value: obj.min_value,
        }))
      );
    });
  };

  handleValueChange = (index, value) => {
    const updatedVariables = [...this.props.variables];
    updatedVariables[index]["value"] = parseFloat(value);
    this.props.onVariablesChange(updatedVariables);
  };

  componentDidMount() {
    getTechnologies().then((techList) => {
      const firstTechId = techList[0].id;
      getVariables(null, firstTechId).then((variableList) => {
        this.props.onTechChange(firstTechId);
        this.props.onVariablesChange(
          variableList.map((obj) => ({
            ...obj,
            value: obj.min_value,
          }))
        );
        this.setState({
          technologies: techList,
        });
      });
    });
  }

  render() {
    return (
      <Grid container spacing={2} marginTop={3}>
        <Grid item xs={12}>
          {this.state.technologies ? (
            <FormControl fullWidth>
              <InputLabel id="tech-label">{strings.technology}</InputLabel>
              <Select
                value={this.props.selectedTechnology}
                label={strings.technology}
                onChange={this.handleTechChange}
                fullWidth
              >
                {this.state.technologies.map((item) => {
                  let itemKey = item.id;
                  let itemValue = item.nombre;
                  return (
                    <MenuItem key={itemKey} value={itemKey}>
                      <Typography variant="body2" noWrap>
                        {itemValue}
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
        {this.props.variables ? (
          this.props.variables.map((variable, index) => (
            <Grid item xs={12} key={index}>
              <Tooltip title={variable.descripcion} arrow>
                <TextField
                  type="number"
                  fullWidth
                  required
                  label={variable.nombre}
                  value={variable.value}
                  onChange={(e) =>
                    this.handleValueChange(index, e.target.value)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2">
                          {variable.unidades}
                        </Typography>
                      </InputAdornment>
                    ),
                    inputProps: {
                      min: variable.min_value,
                      max: variable.max_value,
                    },
                  }}
                />
              </Tooltip>
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12}>
              <Skeleton variant="rounded" width={"100%"} height={60} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rounded" width={"100%"} height={60} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rounded" width={"100%"} height={60} />
            </Grid>
          </>
        )}
      </Grid>
    );
  }
}

export default EstimationStepTwo;
