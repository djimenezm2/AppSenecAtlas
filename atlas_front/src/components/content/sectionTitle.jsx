import React, { Component } from "react";

import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const StyledTitle = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: "bolder",
}));

class SectionTitle extends Component {
  render() {
    return (
      <StyledTitle sx={{ marginX: -2, padding: 1 }}>
        {this.props.title}
      </StyledTitle>
    );
  }
}

export default SectionTitle;
