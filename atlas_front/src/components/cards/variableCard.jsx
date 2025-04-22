import React, { Component } from "react";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  Box,
  CircularProgress,
  Grow,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.contrastText,
  height: "100%",
}));

class VariableCard extends Component {
  render() {
    return (
      <Grow
        in={this.props.show}
        {...(this.props.show ? { timeout: 750 } : {})}
      >
        <StyledCard elevation={3}>
          <CardContent>
            <Typography variant="body1" align="center">
              {this.props.title}
            </Typography>
            <Divider />
            {this.props.value === null ? (
              <Box
                sx={{
                  minWidth: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Typography variant="body2" align="center" fontWeight="bold">
                {this.props.value}
              </Typography>
            )}
          </CardContent>
        </StyledCard>
      </Grow>
    );
  }
}

export default VariableCard;
