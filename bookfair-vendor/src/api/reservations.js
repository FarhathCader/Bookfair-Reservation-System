import { api } from "./client";

export async function getMyReservations() {
  const { data } = await api.get("/reservations/me");
  return { data };
}
