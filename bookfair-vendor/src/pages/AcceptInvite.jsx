import React from "react";
import { Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function AcceptInvite() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Paper className="p-6 w-full max-w-md space-y-4">
        <Typography variant="h5" className="font-bold text-center">
          Invitations Unavailable
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Account invitations are not supported in this version of the portal. If you received a manual invitation, please
          proceed with the standard sign-up flow or contact the event administrator to create your account.
        </Typography>
        <Button component={Link} to="/signup" variant="contained">
          Go to signup
        </Button>
      </Paper>
    </div>
  );
}
