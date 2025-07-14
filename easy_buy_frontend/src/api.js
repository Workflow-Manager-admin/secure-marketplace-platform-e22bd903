//
// api.js
// PUBLIC_INTERFACE: Provides fetch helpers, endpoint calls, and authentication/session management
//

const API_BASE = process.env.REACT_APP_API_BASE || "/api"; // Can be overridden via .env

// In-memory JWT/session token, and load from localStorage for persistence
let _token = localStorage.getItem("authToken") || null;

export function setAuthToken(token) {
  _token = token;
  if (token) localStorage.setItem("authToken", token);
  else localStorage.removeItem("authToken");
}

export function getAuthToken() {
  return _token;
}

// PUBLIC_INTERFACE
export async function apiFetch(path, { method = "GET", body, headers = {}, auth = true, ...opts } = {}) {
  let finalHeaders = { ...headers };
  if (auth && _token) finalHeaders["Authorization"] = `Bearer ${_token}`;
  if (body && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body,
    credentials: "include",
    ...opts,
  });
  if (!response.ok) {
    let detail = "API error";
    try { detail = await response.text(); } catch {}
    throw new Error(detail || response.statusText);
  }
  // Attempt JSON but allow plain text
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = await response.text();
  }
  return data;
}

// PUBLIC_INTERFACE
export function logout() {
  setAuthToken(null);
}

//
// React hooks for common patterns (loading, error, data, refetch)
//

// PUBLIC_INTERFACE
import { useState, useEffect, useCallback } from "react";

export function useApi(fetchFn, deps = []) {
  // fetchFn: () => apiFetch(...)
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refetch = useCallback(() => {
    setLoading(true);
    setError("");
    fetchFn()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to fetch data."))
      .finally(() => setLoading(false));
  }, deps); // eslint-disable-line
  useEffect(() => {
    refetch();
    // eslint-disable-next-line
  }, deps);
  return { data, loading, error, refetch };
}
