// src/components/integral/integralContent.jsx

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

// Responsive settings for the carousel
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

// Styled Accordion components
const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledAccordionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: "bolder",
}));

// Main content component for the Integral page
class IntegralContent extends Component {
  state = {
    indicators: null,
    selectedIndicators: [],
    downloading: false,
    openError: false,
    errorMessage: "",
  };

  // Load indicators when component mounts
  componentDidMount() {
    this.updateIndicators();
  }

  // Fetch indicators from API
  updateIndicators = () => {
    getIndicators().then((list) => this.setState({ indicators: list }));
  };

  // View layer button clicked
  handleViewLayerClick = (indicatorId) => {
    const newIndicator = this.state.indicators.find((i) => i.id === indicatorId);
    this.props.onViewLayerClick(newIndicator);
  };

  // Download layer button clicked
  handleDownloadLayerClick = (indicatorId) => {
    this.setState({ downloading: true });
    downloadLayer(indicatorId)
      .then(() => this.setState({ downloading: false }))
      .catch((error) =>
        this.setState({
          downloading: false,
          openError: true,
          errorMessage: `${strings.serverError}: ${error.message}`,
        })
      );
  };

  // Add or remove indicator to/from selected list
  handleLayerClick = (indicatorId) => {
    let sel = [...this.state.selectedIndicators];
    if (sel.find((item) => item.id === indicatorId)) {
      sel = sel.filter((item) => item.id !== indicatorId);
    } else {
      const ind = this.state.indicators.find((i) => i.id === indicatorId);
      sel.push({ ...ind, weight: 1, relation: 0 });
    }
    this.setState({ selectedIndicators: sel });
  };

  // Update selected indicators
  handleSelectedIndicatorsChange = (newSel) => {
    this.setState({ selectedIndicators: newSel });
  };

  render() {
    const {
      indicators,
      selectedIndicators,
      downloading,
      openError,
      errorMessage,
    } = this.state;
    const { indicatorId, metadata, selected, wktPolygon } = this.props;

    const analysisReady = !!wktPolygon && selectedIndicators.length >= 2;

    return (
      <Box sx={{ maxHeight: "100vh", overflow: "auto" }}>
        {/* ——— Header and Layers Carousel ——— */}
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12}>
            <ContentTitle
              background={diagram}
              title={strings.integral}
              subtitle={strings.integralDescription}
            />
          </Grid>

          {indicators ? (
            <>
              <Grid item xs={12}>
                <SectionTitle title={strings.availableLayers} />
              </Grid>
              <Grid item xs={12}>
                {/* Carousel of available layers */}
                <Carousel
                  responsive={responsive}
                  autoPlay
                  swipeable
                  draggable
                  showDots
                  infinite
                >
                  {indicators.map((ind) => (
                    <MediaCard
                      key={ind.id}
                      indicatorId={ind.id}
                      selected={!!selectedIndicators.find((s) => s.id === ind.id)}
                      image={ind.thumbnail}
                      title={ind.name}
                      downloadDisabled={!ind.layer}
                      onViewClick={() => this.handleViewLayerClick(ind.id)}
                      onDownloadClick={() => this.handleDownloadLayerClick(ind.id)}
                      onAddClick={() => this.handleLayerClick(ind.id)}
                    />
                  ))}
                </Carousel>
              </Grid>
              <Grid item xs={12} align="center">
                {/* Dialog to upload new layers */}
                <AddLayerDialog onUploadSuccess={this.updateIndicators} />
              </Grid>
            </>
          ) : (
            <>
              {/* Loading Skeletons */}
              <Grid item xs={12}>
                <Skeleton variant="rounded" height="30vh" />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="rectangular" height="5vh" />
              </Grid>
            </>
          )}
        </Grid>

        {/* ——— Selected Point ——— */}
        <Accordion disableGutters>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <StyledAccordionTitle>{strings.selectedPoint}</StyledAccordionTitle>
          </StyledAccordionSummary>
          <AccordionDetails>
            {selected &&
            Array.isArray(selected.coordinates) &&
            typeof selected.coordinates[0] === "number" &&
            typeof selected.coordinates[1] === "number" &&
            typeof selected.value === "number" ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <VariableCard
                    title={strings.latitude}
                    show={true}
                    value={selected.coordinates[1].toFixed(2)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <VariableCard
                    title={strings.longitude}
                    show={true}
                    value={selected.coordinates[0].toFixed(2)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <VariableCard
                    title={strings.value}
                    show={true}
                    value={selected.value.toFixed(2)}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <InfoCard text={strings.integralSelectPointInstructions} />
                </Grid>
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>

        {/* ——— Analysis Section ——— */}
        <Accordion disableGutters>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <StyledAccordionTitle>{strings.analysis}</StyledAccordionTitle>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {!analysisReady && (
                <Grid item xs={12} align="center">
                  <InfoCard text={strings.integralAnalysisInstructions} />
                </Grid>
              )}

              {analysisReady && (
                <>
                  {/* Selected indicators list */}
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {selectedIndicators.map((ind, i) => (
                        <Chip
                          key={i}
                          label={ind.name}
                          onDelete={() => this.handleLayerClick(ind.id)}
                        />
                      ))}
                    </Stack>
                  </Grid>

                  {/* Clear selection and analyze buttons */}
                  <Grid item xs={12} md={6}>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => this.setState({ selectedIndicators: [] })}
                    >
                      {strings.clearSelection}
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <AnalyzeDialog
                      wktPolygon={wktPolygon}
                      selectedIndicators={selectedIndicators}
                      onSelectedIndicatorsChange={this.handleSelectedIndicatorsChange}
                      onUploadSuccess={this.updateIndicators}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* ——— Metadata Section ——— */}
        <Accordion disableGutters>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <StyledAccordionTitle>{strings.metadata}</StyledAccordionTitle>
          </StyledAccordionSummary>
          <AccordionDetails>
            {indicatorId !== -1 && metadata ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <VariableCard
                    title={strings.currentLayer}
                    show={true}
                    value={
                      indicators.find((i) => i.id === indicatorId)?.name
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <MetadataList metadata={metadata} />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InfoCard text={strings.integralSelectMetadataInstructions} />
                </Grid>
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>

        {/* ——— Error and Download Snackbars ——— */}
        <Snackbar
          open={openError}
          autoHideDuration={6000}
          onClose={() => this.setState({ openError: false })}
        >
          <Alert
            severity="error"
            onClose={() => this.setState({ openError: false })}
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
        <CustomSnackbar
          handleClose={() => this.setState({ downloading: false })}
          message={strings.preparingLayerForDownload}
          open={downloading}
        />
      </Box>
    );
  }
}

export default IntegralContent;
