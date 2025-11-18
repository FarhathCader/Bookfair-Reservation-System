import React from 'react'
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../api/client";

const AuthCtx = createContext();

const readStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const writeStoredUser = (value) => {
  if (typeof window === "undefined") return;
  if (value) {
    window.localStorage.setItem("user", JSON.stringify(value));
  } else {
    window.localStorage.removeItem("user");
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    writeStoredUser(nextUser);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (!active) return;
        persistUser(data);
      } catch {
        if (!active) return;
        persistUser(null);
      } finally {
        if (active) setIsAuthenticating(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [persistUser]);

  const login = useCallback((userData) => {
    persistUser(userData);
  }, [persistUser]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Failed to terminate session", error);
    }
    persistUser(null);
  }, [persistUser]);

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticating }),
    [user, login, logout, isAuthenticating]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
