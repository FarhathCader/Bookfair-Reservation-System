import React from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { attachToken } from "../api/client";
import { fetchProfile } from "../api/auth";

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(()=>localStorage.getItem("token"));
  const [user, setUser] = useState(()=> {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });

  const login = (token, user) => {
    setToken(token); setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(()=> {
    attachToken(token);
  }, [token]);

  useEffect(() => {
    if (!token || user) return;
    (async () => {
      try {
        const { data } = await fetchProfile();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    })();
  }, [token, user]);

  const value = useMemo(()=>({ token, user, login, logout }), [token, user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
