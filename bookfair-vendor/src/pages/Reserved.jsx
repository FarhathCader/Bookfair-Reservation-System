import React, { useEffect, useState } from "react";
import { Paper, Typography, Divider, Chip, Stack } from "@mui/material";
import { getMyReservations } from "../api/reservations";

export default function Reserved() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyReservations();
        setReservations(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load reservations");
      }
    })();
  }, []);

  return (
    <Paper className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="font-bold">
          Reservation History
        </Typography>
      </div>
      <Divider />
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      {reservations.length === 0 && !error ? (
        <Typography variant="body2" color="text.secondary">
          You have not created any reservations yet.
        </Typography>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <Paper key={reservation.id} variant="outlined" className="p-3 space-y-2">
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
                <Typography variant="subtitle1" className="font-semibold">
                  Confirmation: {reservation.confirmationCode}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(reservation.reservedAt).toLocaleString()}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Total stalls: {reservation.totalReservedStalls}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Business: {reservation.vendorBusinessName}
              </Typography>
              <div className="flex flex-wrap gap-2">
                {reservation.stalls?.map((code) => (
                  <Chip key={code} label={code} color="primary" variant="outlined" />
                ))}
              </div>
            </Paper>
          ))}
        </div>
      )}
    </Paper>
  );
}
