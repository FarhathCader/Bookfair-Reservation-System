import { api } from "./client";

export async function signupEmployee(payload) {
  const { data } = await api.post("/auth/register/employee", payload);
  return { data };
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return { data };
}

export async function fetchProfile() {
  const { data } = await api.get("/auth/me");
  return { data };
}
