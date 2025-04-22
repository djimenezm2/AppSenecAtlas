import React from "react";
import { Grid, Paper, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import strings from "../../strings/es.json";

const LegendContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  zIndex: 1000,
  minWidth: "20%",
  bottom: "20px",
  left: "20px",
  padding: theme.spacing(2),
  background: "white",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
}));

const ColorBar = styled(Box)(() => ({
  display: "flex",
  borderBottom: "1px solid #ccc",
}));

const ColorBox = styled(Box)(() => ({
  flex: 1,
  height: "20px",
}));

const MapLegend = ({ minValue, maxValue, colors }) => {
  return (
    <LegendContainer>
      <Typography variant="caption" gutterBottom>
        {strings.values}
      </Typography>
      <ColorBar>
        {colors.split(",").map((color, index) => (
          <ColorBox key={index} sx={{ backgroundColor: color }}></ColorBox>
        ))}
      </ColorBar>
      <Grid container justifyContent="space-between">
        <Grid item>{minValue.toFixed(2)}</Grid>
        <Grid item>|</Grid>
        <Grid item>{((minValue + maxValue) / 2).toFixed(2)}</Grid>
        <Grid item>|</Grid>
        <Grid item>{maxValue.toFixed(2)}</Grid>
      </Grid>
    </LegendContainer>
  );
};

export default MapLegend;
