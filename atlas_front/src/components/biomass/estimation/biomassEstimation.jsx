import React, { Component } from "react";
import {
  Grid,
  Chip,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Typography,
  Skeleton,
} from "@mui/material";

import SelectCard from "../../cards/selectCard";
import SelectMultipleCard from "../../cards/selectMultipleCard";
import TextCard from "../../cards/textCard";
import SectionTitle from "../../content/sectionTitle";
import BiomassEstimationDialog from "./biomassEstimationDialog";

import { getAllGeneration } from "../../../utils/biomassFunctions";

import {
  getCropRelatedData,
  getResidues,
  predictProduction,
} from "../../../services/biomassDataAPI";

import strings from "../../../strings/es.json";

class BiomassEstimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      area: this.props.area,
      production: 0,
      residues: null,
      variables: null,
      selectedResidues: [],
      selectedTechnology: 0,
      result: null,
      showEstimation: false,
    };
  }

  updateCropRelatedData = async () => {
    getCropRelatedData(this.state.area, this.props.crop).then((response) => {
      this.setState({
        production: response.prediction.prediction,
        residues: response.residues,
        selectedResidues: response.residues.map((item) => item.id),
      });
    });
  };

  updateResidues = async (newCrop) => {
    getResidues(null, newCrop).then((residuesList) => {
      this.setState({
        residues: residuesList,
        selectedResidues: residuesList.map((item) => item.id),
      });
    });
  };

  updateProduction = async (newArea, newCrop) => {
    predictProduction(newArea, newCrop).then((prediction) => {
      this.setState({
        area: parseFloat(newArea),
        production: prediction.prediction,
        result: null,
        showEstimation: false,
      });
    });
  };

  handleCropChange = (newCrop) => {
    this.updateProduction(this.state.area, newCrop);
    this.updateResidues(newCrop);
    this.props.onCropChange(newCrop);
    this.setState({
      result: null,
      showEstimation: false,
    });
  };

  handleSelectedResiduesChange = (newSelection) => {
    this.setState({
      selectedResidues: newSelection,
      result: null,
      showEstimation: false,
    });
  };

  handleAreaChange = (newArea) => {
    this.updateProduction(newArea, this.props.crop);
  };

  handleProductionChange = (newProduction) => {
    this.setState({
      production: parseFloat(newProduction),
      result: null,
      showEstimation: false,
    });
  };

  handleResiduesChange = (newResidues) => {
    this.setState({
      residues: newResidues,
    });
  };

  handleTechChange = (newTechId) => {
    this.setState({
      selectedTechnology: newTechId,
    });
  };

  handleVariablesChange = (newVariables) => {
    this.setState({
      variables: newVariables,
    });
  };

  handleDialogSubmit = () => {
    this.setState({
      showEstimation: true,
      result: getAllGeneration(
        this.state.residues,
        this.state.variables,
        this.state.production,
        this.state.selectedResidues,
        this.state.selectedTechnology
      ),
    });
  };

  componentDidMount() {
    this.updateCropRelatedData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.area !== this.props.area) {
      this.updateProduction(this.props.area, this.props.crop);
    }
  }

  render() {
    return (
      <Grid
        container
        flexDirection={{
          xs: "column",
          sm: "column",
          md: "row",
          lg: "row",
          xl: "row",
        }}
        spacing={2}
      >
        <Grid item xs={12} md={12}>
          <SectionTitle title={strings.variableSelection} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectCard
            title={strings.crop}
            options={this.props.crops}
            onValueChange={this.handleCropChange}
            value={this.props.crop}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {this.state.residues ? (
            <SelectMultipleCard
              title={strings.residues}
              keyVariable="id"
              renderVariable="nombre"
              options={this.state.residues}
              selectedItems={this.state.selectedResidues}
              onValueChange={this.handleSelectedResiduesChange}
            />
          ) : (
            <Skeleton variant="rounded" width={"100%"} height={"100%"} />
          )}
        </Grid>
        <Grid item xs={12} md={12}>
          <SectionTitle title={strings.estimatedVariables} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextCard
            title={strings.area}
            value={this.state.area}
            adornment={strings.ha}
            onValueChange={this.handleAreaChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextCard
            title={strings.production}
            value={this.state.production}
            adornment={strings.t}
            onValueChange={this.handleProductionChange}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <SectionTitle title={strings.energyPotential} />
        </Grid>
        {this.state.showEstimation ? (
          <>
            <Grid container item xs={12} spacing={1}>
              {this.state.variables.map((variable, index) => (
                <Grid item key={index}>
                  <Tooltip title={variable.descripcion} arrow>
                    <Chip
                      label={`${variable.nombre}: ${variable.value}${
                        variable.unidades ? variable.unidades : ""
                      }`}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{strings.residue}</TableCell>
                      <TableCell>
                        <Tooltip title={strings.lhvDescription} arrow>
                          <Typography variant="body2">
                            {strings.lhv}
                            {strings.kjkg}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={strings.wDescription} arrow>
                          <Typography variant="body2">
                            {strings.w}
                            {strings.kwt}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={strings.lhvTotalDescription} arrow>
                          <Typography variant="body2">
                            {strings.lhv}
                            <sub>{strings.total}</sub>
                            {strings.mj}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={strings.wTotalDescription} arrow>
                          <Typography variant="body2">
                            {strings.w}
                            <sub>{strings.total}</sub>
                            {strings.mw}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.residues
                      .filter((v) => this.state.selectedResidues.includes(v.id))
                      .map((residue, index) => (
                        <TableRow hover key={index}>
                          <TableCell>{residue.nombre}</TableCell>
                          <TableCell>
                            {this.state.result.lhvResidues[residue.id].toFixed(
                              2
                            )}
                          </TableCell>
                          <TableCell>
                            {this.state.result.wResidues[residue.id].toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {this.state.result.lhvTotal[residue.id].toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {this.state.result.wTotal[residue.id].toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        ) : null}
        {this.state.residues ? (
          <Grid item xs={12}>
            <BiomassEstimationDialog
              residues={this.state.residues.filter((item) =>
                this.state.selectedResidues.includes(item.id)
              )}
              variables={this.state.variables}
              selectedTechnology={this.state.selectedTechnology}
              onResiduesChange={this.handleResiduesChange}
              onTechChange={this.handleTechChange}
              onVariablesChange={this.handleVariablesChange}
              onDialogOpen={() => this.setState({ showEstimation: false })}
              onDialogSubmit={this.handleDialogSubmit}
            />
          </Grid>
        ) : null}
      </Grid>
    );
  }
}

export default BiomassEstimation;
