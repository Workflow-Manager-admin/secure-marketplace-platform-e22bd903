import React, { useState } from "react";

/**
 * Settings - User preferences and notifications.
 * Props: user
 */
function Settings({ user }) {
  const [prefs, setPrefs] = useState({
    notifications: true,
    darkMode: false,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // PUBLIC_INTERFACE
  const handleToggle = (name) => {
    setPrefs((curr) => ({ ...curr, [name]: !curr[name] }));
    setSuccess(false);
  };

  // PUBLIC_INTERFACE
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 600);
  };

  return (
    <section className="settings container">
      <h2>Settings</h2>
      <form className="settings-form" onSubmit={handleSave}>
        <label>
          <input
            type="checkbox"
            checked={prefs.notifications}
            onChange={() => handleToggle("notifications")}
          />
          Enable Notifications
        </label>
        <label>
          <input
            type="checkbox"
            checked={prefs.darkMode}
            onChange={() => handleToggle("darkMode")}
          />
          Dark Mode
        </label>
        <button
          className="btn btn-large"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
        {success && (
          <div className="success-text" style={{ marginTop: 8 }}>
            Preferences saved!
          </div>
        )}
      </form>
    </section>
  );
}

export default Settings;
