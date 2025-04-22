import React, { Component } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/material/styles";

const StyledInfoCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.info.main,
  color: theme.palette.info.contrastText,
}));

class InfoCard extends Component {
  render() {
    return (
      <StyledInfoCard>
        <CardContent>
          <Grid container alignItems={"center"}>
            <Grid item xs={2}>
              <InfoIcon sx={{ width: "70%", height: "70%" }} />
            </Grid>
            <Grid item xs={10}>
              <Typography variant="body2">{this.props.text}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </StyledInfoCard>
    );
  }
}

export default InfoCard;
