//
// apiHooks.js
// PUBLIC_INTERFACE: React hooks for API features (auth, products, profile, chat, payments, settings), all with loading/error management
//
import { useState, useCallback } from "react";
import { apiFetch, setAuthToken, logout as clearSession } from "./api";

// AUTH HOOKS

// PUBLIC_INTERFACE
export function useLoginSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // loginOrSignup: { email, password, name } (name optional for login)
  const authenticate = useCallback(async ({ email, password, name, isSignup }) => {
    setLoading(true); setError("");
    try {
      const res = await apiFetch(isSignup ? "/auth/signup" : "/auth/login", {
        method: "POST",
        body: { email, password, ...(isSignup && { name }) },
        auth: false, // Don't send token
      });
      setAuthToken(res.token);
      return res.user;
    } catch (err) {
      setError(err.message || "Authentication failed.");
      throw err;
    } finally { setLoading(false); }
  }, []);
  // logout: just clears session
  const logout = () => clearSession();
  return { authenticate, logout, loading, error };
}

// PRODUCTS HOOKS

// PUBLIC_INTERFACE
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await apiFetch("/products", { method: "GET" });
      setProducts(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to load products");
      setProducts([]);
    } finally { setLoading(false); }
  }, []);

  // CRUD ops
  const addProduct = useCallback(async (prodData) => {
    setLoading(true); setError("");
    try {
      const formData = new FormData();
      Object.keys(prodData).forEach(k => formData.append(k, prodData[k]));
      const data = await apiFetch("/products", {
        method: "POST",
        body: formData,
        headers: {}, // let fetch set multipart headers
      });
      setProducts((ps) => [data, ...ps]);
      return data;
    } catch (err) { setError(err.message || "Failed to add product."); throw err; }
    finally { setLoading(false); }
  }, []);

  const updateProduct = useCallback(async (id, prodData) => {
    setLoading(true); setError("");
    try {
      const formData = new FormData();
      Object.keys(prodData).forEach(k => formData.append(k, prodData[k]));
      const data = await apiFetch(`/products/${id}`, {
        method: "PUT",
        body: formData,
        headers: {},
      });
      setProducts((ps) => ps.map(p => (p.id === id ? data : p)));
      return data;
    } catch (err) { setError(err.message || "Failed to update product."); throw err; }
    finally { setLoading(false); }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true); setError("");
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      setProducts((ps) => ps.filter(p => p.id !== id));
    } catch (err) { setError(err.message || "Failed to delete product."); throw err; }
    finally { setLoading(false); }
  }, []);
  
  return {
    fetchProducts, products, loading, error, addProduct, updateProduct, deleteProduct,
  };
}

// PUBLIC_INTERFACE
export function useProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchProduct = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await apiFetch(`/products/${productId}`, { method: "GET" });
      setProduct(data);
      return data;
    } catch (err) { setError(err.message || "Failed to load product."); setProduct(null); }
    finally { setLoading(false); }
  }, [productId]);
  return { product, loading, error, fetchProduct };
}

// PROFILE HOOKS

// PUBLIC_INTERFACE
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fetchProfile = useCallback(async () => {
    setSaving(true); setError("");
    try {
      const data = await apiFetch("/profile", { method: "GET" });
      setProfile(data);
      return data;
    } catch (err) { setError(err.message || "Failed to fetch profile."); setProfile(null); }
    finally { setSaving(false); }
  }, []);
  const updateProfile = useCallback(async (profileData) => {
    setSaving(true); setError("");
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(k => formData.append(k, profileData[k]));
      const resp = await apiFetch("/profile", { method: "PUT", body: formData, headers: {} });
      setProfile(resp);
      return resp;
    } catch (err) { setError(err.message || "Failed to update profile."); throw err; }
    finally { setSaving(false); }
  }, []);
  return { profile, saving, error, fetchProfile, updateProfile };
}

// CHAT HOOKS

// PUBLIC_INTERFACE
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchMessages = useCallback(async (withUser) => {
    setLoading(true); setError("");
    try {
      const data = await apiFetch(`/chat?with=${withUser}`);
      setMessages(data);
      return data;
    } catch (err) { setError(err.message || "Failed to load chat."); setMessages([]);}
    finally { setLoading(false); }
  }, []);
  const sendMessage = useCallback(async (to, text) => {
    setLoading(true); setError("");
    try {
      const data = await apiFetch(`/chat`, {
        method: "POST",
        body: { to, text }
      });
      setMessages((m) => [...m, data]);
      return data;
    } catch (err) { setError(err.message || "Failed to send message."); throw err;}
    finally { setLoading(false); }
  }, []);
  return { messages, loading, error, fetchMessages, sendMessage };
}

// PAYMENTS HOOKS (Basic, presume integration w/stripe or backend)
// PUBLIC_INTERFACE
export function usePayments() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const pay = useCallback(async (paymentInfo) => {
    setProcessing(true); setError(""); setSuccess(false);
    try {
      // e.g., paymentInfo = {productId, amount, ...}
      await apiFetch("/payments", {
        method: "POST", body: paymentInfo
      });
      setSuccess(true);
    } catch (err) { setError(err.message || "Payment failed."); }
    finally { setProcessing(false); }
  }, []);

  return { pay, processing, error, success };
}

// SETTINGS HOOKS

// PUBLIC_INTERFACE
export function useSettings() {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchSettings = useCallback(async () => {
    setSaving(true); setError(""); setSuccess(false);
    try {
      const data = await apiFetch("/settings", {method: "GET"});
      setSettings(data);
      return data;
    } catch (err) { setError(err.message || "Failed to load settings"); setSettings({}); }
    finally { setSaving(false);}
  }, []);
  const saveSettings = useCallback(async (data) => {
    setSaving(true); setError(""); setSuccess(false);
    try {
      const resp = await apiFetch("/settings", { method: "PUT", body: data });
      setSettings(resp);
      setSuccess(true);
      return resp;
    } catch (err) { setError(err.message || "Failed to save settings"); throw err; }
    finally { setSaving(false); }
  }, []);
  return { settings, saving, success, error, fetchSettings, saveSettings };
}
