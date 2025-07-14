import React, { useRef, useState } from "react";

/**
 * UserProfile - View and edit user profile, including uploading a profile picture.
 * Props: user, setUser (function to update user info globally)
 */
function UserProfile({ user, setUser }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInput = useRef();

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files.length > 0) {
      const file = files[0];
      setForm((f) => ({ ...f, file, avatar: URL.createObjectURL(file) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // TODO: Upload file & update backend
      setTimeout(() => {
        setUser({
          ...user,
          name: form.name,
          email: form.email,
          avatar: form.avatar,
        });
      }, 600);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <section className="profile container">
      <h2>Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="profile-avatar-edit">
          <img
            src={form.avatar || "/default-avatar.png"}
            alt="avatar"
            className="avatar-large"
            style={{ width: 90, height: 90, borderRadius: "50%" }}
          />
          <button
            className="btn btn-image"
            type="button"
            onClick={() => fileInput.current.click()}
            style={{ marginLeft: 18 }}
            disabled={loading}
          >
            Change Photo
          </button>
          <input
            ref={fileInput}
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: "none" }}
            disabled={loading}
          />
        </div>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          value={form.email}
          readOnly
          disabled
        />
        {error && <div className="error-text">{error}</div>}
        <button className="btn btn-large" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default UserProfile;
