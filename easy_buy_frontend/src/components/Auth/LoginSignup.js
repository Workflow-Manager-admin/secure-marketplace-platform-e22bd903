import React, { useState } from "react";

/**
 * Combined Login and Signup form.
 * Handles user authentication with loading and error states.
 * Props: onLogin(user): Function called after successful login/signup
 */
function LoginSignup({ onLogin }) {
  const [view, setView] = useState("login"); // or "signup"
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // TODO: Integrate with backend: /api/login or /api/signup
      // Simulate success/fail
      if (form.email === "fail@test.com") throw new Error("Demo login fail");
      const user = {
        id: 1,
        name: form.name || "Demo User",
        avatar: "",
        email: form.email,
      };
      onLogin(user);
    } catch (err) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{view === "login" ? "Sign In" : "Sign Up"}</h2>
        {view === "signup" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            autoFocus
            disabled={loading}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          autoFocus={view === "login"}
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          disabled={loading}
        />
        {error && <div className="error-text">{error}</div>}
        <button className="btn btn-large" type="submit" disabled={loading}>
          {loading ? "Processing..." : view === "login" ? "Login" : "Sign Up"}
        </button>
        <div style={{ margin: "8px 0" }}>
          {view === "login" ? (
            <span>
              New to easyBuy?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => setView("signup")}
                disabled={loading}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => setView("login")}
                disabled={loading}
              >
                Login
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default LoginSignup;
