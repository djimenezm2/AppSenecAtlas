import React, { Component } from "react";
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledSelectCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  height: "100%",
}));

class SelectCard extends Component {
  state = {
    value: this.props.value,
  };
  handleChange = (event) => {
    this.setState({ value: event.target.value });
    this.props.onValueChange(event.target.value);
  };
  render() {
    return (
      <StyledSelectCard
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
          <FormControl fullWidth variant="standard" size="small">
            <Select
              value={this.state.value}
              label="select-variable"
              onChange={this.handleChange}
              autoWidth
            >
              {Object.keys(this.props.options).map((key) => (
                <MenuItem key={key} value={key}>
                  <Typography variant="body2" noWrap>
                    {this.props.renderVariable
                      ? this.props.options[key][this.props.renderVariable]
                      : this.props.options[key]}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </StyledSelectCard>
    );
  }
}

export default SelectCard;
