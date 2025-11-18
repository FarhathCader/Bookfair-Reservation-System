import React from 'react'
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../api/client";
import { releaseAllStallHolds } from "../api/stalls";

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
      await releaseAllStallHolds();
    } catch (error) {
      console.warn("Failed to release holds during logout", error);
    }
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Failed to terminate session", error);
    }
    persistUser(null);
  }, [persistUser]);

  const updateUser = useCallback((updater) => {
    setUser((prev) => {
      const nextValue = typeof updater === "function" ? updater(prev) : { ...(prev || {}), ...updater };
      const normalized = nextValue ?? null;
      writeStoredUser(normalized);
      return normalized;
    });
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, updateUser, isAuthenticating }),
    [user, login, logout, updateUser, isAuthenticating]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
