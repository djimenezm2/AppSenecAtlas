// FeatureCard.jsx

import React from "react";
import { Card, CardContent, Typography, Button, Box, styled, Fade } from "@mui/material";
import { Link } from "react-router-dom";

// Styled Card with hover animation
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[6],
  },
}));

// Styled wrapper for the icon
const IconWrapper = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.contrastText,
}));

// Component to display a feature card with title, description, and button
const FeatureCard = ({ title, description, icon, link, button }) => {
  return (
    <Fade in timeout={1000}>
      <Box sx={{ height: '100%' }}>
        <StyledCard
          elevation={3}
          sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <CardContent sx={{ textAlign: "center", py: 5, px: 3 }}>
            {/* Icon */}
            <IconWrapper>{icon}</IconWrapper>

            {/* Title */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {title}
            </Typography>

            {/* Description */}
            <Typography variant="body2" sx={{ mb: 4, color: "text.secondary" }}>
              {description}
            </Typography>

            {/* Navigation Button */}
            <Button
              component={Link}
              to={link}
              variant="outlined"
              size="medium"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              {button}
            </Button>
          </CardContent>
        </StyledCard>
      </Box>
    </Fade>
  );
};

export default FeatureCard;
