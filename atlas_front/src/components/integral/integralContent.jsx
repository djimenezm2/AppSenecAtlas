import React, { Component } from "react";

import {
  Box,
  Button,
  Grid,
  Skeleton,
  Stack,
  Chip,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import SectionTitle from "../content/sectionTitle";
import ContentTitle from "../content/contentTitle";
import MediaCard from "./integralCarouselCard";
import VariableCard from "../cards/variableCard";
import InfoCard from "../cards/infoCard";
import CustomSnackbar from "../content/customSnackbar";
import AddLayerDialog from "./integralAddLayerDialog";
import AnalyzeDialog from "./analyze/integralAnalyzeDialog";
import MetadataList from "./intergalMetadataList";

import { getIndicators, downloadLayer } from "../../services/mapsAPI";
import diagram from "../../assets/images/diagram.svg";
import strings from "../../strings/es.json";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledAccordionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: "bolder",
}));

class IntegralContent extends Component {
  state = {
    indicators: null,
    selectedIndicators: [],
    downloading: false,
    openError: false,
    errorMessage: "",
  };

  handleViewLayerClick = (indicatorId) => {
    const newIndicator = this.state.indicators.filter(
      (i) => i["id"] === indicatorId
    )[0];
    this.props.onViewLayerClick(newIndicator);
  };

  handleDownloadLayerClick = (indicatorId) => {
    this.setState({
      downloading: true,
    });
    downloadLayer(indicatorId)
      .then(() => {
        this.setState({
          downloading: false,
        });
      })
      .catch((error) => {
        this.setState({
          downloading: false,
          openError: true,
          errorMessage: `${strings.serverError}: ${error.message}`,
        });
      });
  };

  handleLayerClick = (indicatorId) => {
    let selectedIndicators = this.state.selectedIndicators.slice();
    if (this.state.selectedIndicators.find((item) => item.id === indicatorId)) {
      selectedIndicators = selectedIndicators.filter(
        (item) => item.id !== indicatorId
      );
    } else {
      let indicator = this.state.indicators.find((i) => i.id === indicatorId);
      selectedIndicators.push(
        Object.assign(indicator, { id: indicatorId, weight: 1, relation: 0 })
      );
    }
    this.setState({
      selectedIndicators,
    });
  };

  updateIndicators = async () => {
    getIndicators().then((indicatorList) => {
      this.setState({
        indicators: indicatorList,
      });
    });
  };

  handleSelectedIndicatorsChange = (newSelectedIndicators) => {
    this.setState({
      selectedIndicators: newSelectedIndicators,
    });
  };

  componentDidMount() {
    this.updateIndicators();
  }

  render() {
    return (
      <Box sx={{ maxHeight: "100vh", overflow: "auto" }}>
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
          padding={2}
        >
          <Grid item xs={12} md={12}>
            <ContentTitle
              background={diagram}
              title={strings.integral}
              subtitle={strings.integralDescription}
            />
          </Grid>
          {this.state.indicators ? (
            <>
              <Grid item xs={12}>
                <SectionTitle title={strings.availableLayers} />
              </Grid>
              <Grid item xs={12} md={12}>
                <Carousel
                  responsive={responsive}
                  autoPlay={true}
                  swipeable={true}
                  draggable={true}
                  showDots={true}
                  infinite={true}
                  partialVisible={false}
                >
                  {this.state.indicators.map((indicator) => {
                    return (
                      <MediaCard
                        key={indicator.id}
                        indicatorId={indicator.id}
                        selected={this.state.selectedIndicators.find(
                          (item) => item.id === indicator.id
                        )}
                        image={indicator.thumbnail}
                        title={indicator.name}
                        downloadDisabled={!!!indicator.layer}
                        onViewClick={this.handleViewLayerClick}
                        onDownloadClick={this.handleDownloadLayerClick}
                        onAddClick={this.handleLayerClick}
                      />
                    );
                  })}
                </Carousel>
              </Grid>
              <Grid item xs={12} align="center">
                <AddLayerDialog onUploadSuccess={this.updateIndicators} />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Skeleton variant="rounded" height="30vh" />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height="5vh" />
              </Grid>
            </>
          )}
        </Grid>
        <Accordion disabled={!this.props.selected} disableGutters>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panelPoint-content"
            id="panelPoint-header"
          >
            <StyledAccordionTitle>{strings.selectedPoint}</StyledAccordionTitle>
          </StyledAccordionSummary>
          <AccordionDetails>
            {this.props.selected && (
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
                <Grid item xs={12} md={4}>
                  <VariableCard
                    title={strings.latitude}
                    show={this.props.selected !== undefined}
                    value={this.props.selected.coordinates[1].toFixed(2)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <VariableCard
                    title={strings.longitude}
                    show={this.props.selected !== undefined}
                    value={this.props.selected.coordinates[0].toFixed(2)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <VariableCard
                    title={strings.value}
                    show={this.props.selected !== undefined}
                    value={this.props.selected.value.toFixed(2)}
                  />
                </Grid>
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion disabled={!this.state.indicators} disableGutters>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panelAnalysis-content"
            id="panelAnalysis-header"
          >
            <StyledAccordionTitle>{strings.analysis}</StyledAccordionTitle>
          </StyledAccordionSummary>
          <AccordionDetails>
            {this.state.indicators && (
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
                {!this.props.wktPolygon ||
                this.state.selectedIndicators.length <= 1 ? (
                  <Grid item align="center">
                    <InfoCard text={strings.integralAnalysisInstructions} />
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {this.state.selectedIndicators.map((indicator, index) => (
                      <Chip
                        key={index}
                        label={indicator.name}
                        onDelete={() => this.handleLayerClick(indicator.id)}
                      />
                    ))}
                  </Stack>
                </Grid>
                {this.state.selectedIndicators.length > 0 ? (
                  <>
                    <Grid item xs={12} md={6}>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() =>
                          this.setState({ selectedIndicators: [] })
                        }
                      >
                        {strings.clearSelection}
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <AnalyzeDialog
                        wktPolygon={this.props.wktPolygon}
                        selectedIndicators={this.state.selectedIndicators}
                        onSelectedIndicatorsChange={
                          this.handleSelectedIndicatorsChange
                        }
                        onUploadSuccess={this.updateIndicators}
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion
          disabled={this.props.indicatorId === -1 || !this.props.metadata}
          disableGutters
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panelMetadata-content"
            id="panelMetadata-header"
          >
            <StyledAccordionTitle>{strings.metadata}</StyledAccordionTitle>
          </StyledAccordionSummary>
          <AccordionDetails>
            {this.props.indicatorId !== -1 && this.props.metadata && (
              <>
                <Grid item xs={12} md={12}>
                  <VariableCard
                    title={strings.currentLayer}
                    show={this.props.indicatorId !== -1}
                    value={
                      this.state.indicators.filter(
                        (ind) => ind.id === this.props.indicatorId
                      )[0]["name"]
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <MetadataList metadata={this.props.metadata} />
                </Grid>
              </>
            )}
          </AccordionDetails>
        </Accordion>
        <Snackbar
          open={this.state.openError}
          autoHideDuration={6000}
          onClose={() => this.setState({ openError: false })}
        >
          <Alert
            severity="error"
            onClose={() => this.setState({ openError: false })}
            sx={{ width: "100%" }}
          >
            {this.state.errorMessage}
          </Alert>
        </Snackbar>
        <CustomSnackbar
          handleClose={() => this.setState({ downloading: false })}
          message={strings.preparingLayerForDownload}
          open={this.state.downloading}
        />
      </Box>
    );
  }
}

export default IntegralContent;
