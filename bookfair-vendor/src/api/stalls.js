import { api } from "./client";

export const GENRE_OPTIONS = ["Stationary", "IT", "Hardware"];

export async function fetchStalls({ availableOnly = false, size } = {}) {
  const params = new URLSearchParams();
  if (availableOnly) params.set("availableOnly", "true");
  if (size && size !== "ALL") params.set("size", size);
  const query = params.toString();
  const { data } = await api.get(`/stalls${query ? `?${query}` : ""}`);
  return { data };
}

export async function reserveStalls({ stallIds }) {
  const { data } = await api.post("/reservations", { stallIds });
  return { data };
}
