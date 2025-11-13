import React from "react";
import { Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function AcceptInvite() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Paper className="p-6 w-full max-w-md space-y-4">
        <Typography variant="h5" className="font-bold text-center">
          Invitation Flow Unavailable
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Employee accounts currently need to be created directly in the portal. Please sign up using the standard form or
          contact the administrator to provision your access.
        </Typography>
        <Button component={Link} to="/signup" variant="contained">
          Go to signup
        </Button>
      </Paper>
    </div>
  );
}
