import React, { Component } from "react";
import {
  Typography,
  Tooltip,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Box,
  Button,
  ButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DownloadIcon from "@mui/icons-material/Download";
import MapIcon from "@mui/icons-material/Map";
import { styled } from "@mui/material/styles";

import strings from "../../strings/es.json";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.contrastText,
}));
class MediaCard extends Component {
  render() {
    return (
      <Box sx={{ marginBottom: "30px", marginX: "10px", height: "100%" }}>
        <StyledCard>
          <CardMedia
            sx={{ height: "15vh" }}
            image={this.props.image}
            title={this.props.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {this.props.title}
            </Typography>
            {this.props.body ? (
              <Typography variant="body2" color="text.secondary">
                {this.props.body}
              </Typography>
            ) : (
              <div />
            )}
          </CardContent>
          <CardActions>
            <ButtonGroup
              fullWidth
              orientation="vertical"
              variant="text"
              size="small"
              aria-label="layer button group"
            >
              <Button
                startIcon={<MapIcon />}
                onClick={() => this.props.onViewClick(this.props.indicatorId)}
              >
                {strings.seeOnMap}
              </Button>
              <Button
                startIcon={this.props.selected ? <RemoveIcon /> : <AddIcon />}
                onClick={() => this.props.onAddClick(this.props.indicatorId)}
              >
                {this.props.selected
                  ? strings.removeFromAnalysis
                  : strings.addToAnalysis}
              </Button>
              {this.props.downloadDisabled ? (
                <Tooltip title={strings.layerNotAvailable} arrow>
                  <span>
                    <Button startIcon={<DownloadIcon />} disabled>
                      {strings.download}
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={() =>
                    this.props.onDownloadClick(this.props.indicatorId)
                  }
                >
                  {strings.download}
                </Button>
              )}
            </ButtonGroup>
          </CardActions>
        </StyledCard>
      </Box>
    );
  }
}

export default MediaCard;
