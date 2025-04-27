// Index.jsx

import React, { Component } from "react";
import { Box, Container, ThemeProvider } from "@mui/material";
import { HeroSection, FeatureGrid, Footer } from "../components/homepage";
import { generalTheme } from "../themes/themes";

// Main Index page component
class Index extends Component {
    componentDidMount() {
        // Set the page title
        document.title = "SenecAtlas - Inicio";
    }

    render() {
        return (
        <ThemeProvider theme={generalTheme}>
            <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* Main container with Hero, Features and Footer */}
            <Container
                component="main"
                maxWidth="lg"
                sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                py: 8,
                }}
            >
                <HeroSection />
                <FeatureGrid />
            </Container>

            {/* Footer section */}
            <Footer />
            </Box>
        </ThemeProvider>
        );
    }
}

export default Index;
