import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import "./App.css";

// Placeholders for components
import LoginSignup from "./components/Auth/LoginSignup";
import ProductList from "./components/Products/ProductList";
import ProductForm from "./components/Products/ProductForm";
import ProductDetail from "./components/Products/ProductDetail";
import UserProfile from "./components/Profile/UserProfile";
import ChatDrawer from "./components/Chat/ChatDrawer";
import Payments from "./components/Payments/Payments";
import Settings from "./components/Settings/Settings";

function Navbar({ user, onLogout, onThemeToggle, theme }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <span style={{ fontWeight: 700, color: "var(--button-bg)", marginRight: 8 }}>easyBuy</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/products">Products</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/settings">Settings</Link>
        {user ? (
          <div className="navbar-user">
            <Link to="/profile">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="avatar"
                className="avatar-small"
                style={{ verticalAlign: "middle", borderRadius: "50%", width: 32, height: 32, marginRight: 6 }}
              />
              Profile
            </Link>
            <button className="btn btn-small" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <Link className="btn btn-small" to="/login">Login</Link>
        )}
      </div>
      <button 
        className="theme-toggle"
        onClick={onThemeToggle}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </nav>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null); // {id, name, avatar, ...}
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // Handle user authentication state (demo: no real backend yet)
  useEffect(() => {
    // TODO: replace with real session check
    setUser(null);
  }, []);

  // PUBLIC_INTERFACE
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // PUBLIC_INTERFACE
  const handleLogout = () => {
    setUser(null);
  };

  // Show login/signup modal if not authenticated and visiting a protected page
  return (
    <Router>
      <div className="App">
        <Navbar
          user={user}
          onLogout={handleLogout}
          onThemeToggle={toggleTheme}
          theme={theme}
        />
        <main className="app-content">
          <Routes>
            {/* Home redirects to /products for now */}
            <Route path="/" element={<Navigate to="/products" />} />
            <Route
              path="/login"
              element={
                <LoginSignup onLogin={handleLogin} />
              }
            />
            {/* Protected routes */}
            <Route
              path="/products"
              element={
                user
                  ? <ProductList user={user} />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/products/add"
              element={
                user
                  ? <ProductForm user={user} />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/products/:productId"
              element={
                user
                  ? <ProductDetail user={user} />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/products/:productId/edit"
              element={
                user
                  ? <ProductForm user={user} editMode />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/profile"
              element={
                user
                  ? <UserProfile user={user} setUser={setUser} />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/chat/*"
              element={
                user
                  ? <ChatDrawer user={user} open={true} onClose={() => setChatOpen(false)} />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/payments"
              element={
                user
                  ? <Payments user={user} />
                  : <Navigate to="/login" />
              }
            />
            <Route
              path="/settings"
              element={
                user
                  ? <Settings user={user} />
                  : <Navigate to="/login" />
              }
            />
          </Routes>
        </main>
        {/* (Optionally, global chat drawer here for always-visible chat entrypoint) */}
        {user && (
          <ChatDrawer
            user={user}
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            mini={!window.location.pathname.startsWith("/chat")}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
