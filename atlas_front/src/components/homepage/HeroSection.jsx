// HeroSection.jsx

import React from "react";
import { Box, Typography, Fade, useTheme, useMediaQuery } from "@mui/material";
import strings from "../../strings/es.json";

// Hero section displayed at the top of the index page
const HeroSection = () => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Fade in timeout={1000}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
                {/* Main title */}
                <Typography variant={isSmall ? "h4" : "h2"} sx={{ fontWeight: 700, mb: 2 }}>
                    {strings.indexTitle}
                </Typography>

                {/* Main description */}
                <Typography variant="subtitle1" sx={{ fontSize: 19, maxWidth: 850, mx: "auto", color: theme.palette.text.secondary, mb: 7 }}>
                    {strings.indexDescription}
                </Typography>

                {/* Subtitle */}
                <Typography variant="h6" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                    {strings.indexSubtitle}
                </Typography>
            </Box>
        </Fade>
    );
};

export default HeroSection;
