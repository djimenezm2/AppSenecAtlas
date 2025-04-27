// Footer.jsx

import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import strings from "../../strings/es.json";

// Styled footer box
const StyledFooter = styled(Box)(({ theme }) => ({
    textAlign: "center",
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
}));

// Footer component showing copyright
const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <StyledFooter component="footer">
            <Typography variant="body2">
                {strings.footerText.replace("{year}", year)}
            </Typography>
        </StyledFooter>
    );
};

export default Footer;
