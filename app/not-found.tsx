"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Typography variant="h1" color="primary" fontWeight={700}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, color: "text.secondary" }}>
        Oops! The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4, px: 4, py: 1.5, borderRadius: "8px", textTransform: "none" }}
        component={Link}
        href="/"
      >
        Go Back Home
      </Button>
    </Box>
  );
}
