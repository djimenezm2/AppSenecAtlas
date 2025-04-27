// FeatureGrid.jsx

import React from "react";
import { Grid } from "@mui/material";
import FeatureCard from "./FeatureCard";

import GrassIcon from "@mui/icons-material/Grass";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LayersIcon from "@mui/icons-material/Layers";

import strings from "../../strings/es.json";

// List of features to display
const features = [
  {
    title: strings.biomassAtlas,
    description: strings.biomassAtlasDescription,
    button: strings.biomassAtlasButton,
    icon: <GrassIcon fontSize="large" />,
    link: "/senecatlas/biomass",
  },
  {
    title: strings.solarAtlas,
    description: strings.solarAtlasDescription,
    button: strings.solarAtlasButton,
    icon: <WbSunnyIcon fontSize="large" />,
    link: "/senecatlas/solar",
  },
  {
    title: strings.integral,
    description: strings.integralDescription,
    button: strings.integralButton,
    icon: <LayersIcon fontSize="large" />,
    link: "/senecatlas/integral",
  },
];

// Grid that displays all feature cards
const FeatureGrid = () => {
  return (
    <Grid container spacing={6}>
      {features.map((feature) => (
        <Grid item xs={12} sm={6} md={4} key={feature.title}>
          <FeatureCard {...feature} />
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureGrid;
