import React, { Component } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

const StyledTextCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  height: "100%",
}));

class TextCard extends Component {
  state = {
    editValue: this.props.value.toFixed(2),
    edit: false,
  };
  handleChange = (event) => {
    this.setState({ editValue: event.target.value });
  };
  handleEditButtonClick = () => {
    this.setState({ edit: true });
  };
  handleDoneButtonClick = () => {
    this.setState({ edit: false });
    this.props.onValueChange(this.state.editValue);
  };
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        editValue: this.props.value.toFixed(2),
        edit: false,
      });
    }
  }
  render() {
    return (
      <StyledTextCard
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CardContent sx={{ justifyContent: "center", alignItems: "center" }}>
          <Typography
            sx={{ fontSize: 14 }}
            color="text.secondary"
            align="center"
            gutterBottom
          >
            {this.props.title}
          </Typography>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <TextField
                variant="standard"
                type="number"
                size="small"
                disabled={!this.state.edit}
                value={this.state.editValue}
                onChange={this.handleChange}
                sx={{ input: { textAlign: "center", fontWeight: "bold" } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography
                        variant="body2"
                        align="center"
                        fontWeight="bold"
                      >
                        {this.props.adornment}
                      </Typography>
                      {this.state.edit ? (
                        <IconButton
                          aria-label="done"
                          size="small"
                          onClick={this.handleDoneButtonClick}
                        >
                          <DoneIcon fontSize="inherit" />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={this.handleEditButtonClick}
                        >
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </StyledTextCard>
    );
  }
}

export default TextCard;
