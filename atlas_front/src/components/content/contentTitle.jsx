import React, { Component } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.primary.main,
  backgroundSize: "40%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "left",
  borderRadius: 0,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

class ContentTitle extends Component {
  render() {
    return (
      <StyledCard
        sx={{
          marginX: -2,
          marginTop: -2,
          padding: 1,
          backgroundImage: `url(${this.props.background})`,
          boxShadow: "none",
          display: { xs: "none", md: "block" },
        }}
      >
        <CardContent>
          <StyledTypography variant="h4" align="right">
            {this.props.title}
          </StyledTypography>
          <StyledTypography variant="body2" align="right">
            {this.props.subtitle}
          </StyledTypography>
        </CardContent>
      </StyledCard>
    );
  }
}

export default ContentTitle;
