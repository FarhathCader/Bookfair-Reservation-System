import { api } from "./client";

export async function getAllReservations() {
  const { data } = await api.get("/reservations");
  return { data };
}
