import React, { Component } from "react";
import {
  Card,
  CardContent,
  Checkbox,
  Typography,
  MenuItem,
  FormControl,
  Tooltip,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import strings from "../../strings/es.json";

const StyledSelectCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  height: "100%",
}));

class SelectMultipleCard extends Component {
  state = {
    showError: false,
  };

  handleChange = (event) => {
    const newSelection = event.target.value;
    if (newSelection.length > 0) {
      this.props.onValueChange(newSelection);
    } else {
      this.setState(
        {
          showError: true,
        },
        () => {
          setTimeout(() => {
            this.setState({ showError: false });
          }, 2000);
        }
      );
    }
  };

  render() {
    return (
      <Tooltip
        open={this.state.showError}
        arrow
        placement="top"
        title={strings.selectAtLeastOne}
      >
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
                label="select-multiple"
                multiple
                renderValue={(selected) =>
                  `${selected.length} ${strings.elements}`
                }
                value={this.props.selectedItems}
                onChange={this.handleChange}
              >
                {this.props.options.map((item) => {
                  let itemKey = item[this.props.keyVariable];
                  let itemValue = item[this.props.renderVariable];
                  return (
                    <MenuItem key={itemKey} value={itemKey}>
                      <Checkbox
                        checked={this.props.selectedItems.indexOf(itemKey) > -1}
                      />
                      <Typography variant="body2" noWrap>
                        {itemValue}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </CardContent>
        </StyledSelectCard>
      </Tooltip>
    );
  }
}

export default SelectMultipleCard;
