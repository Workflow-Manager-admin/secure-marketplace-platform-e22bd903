import React, { useEffect, useRef, useState } from "react";
import { useProfile } from "../../apiHooks";

/**
 * UserProfile - View and edit user profile, including uploading a profile picture.
 * Props: user, setUser (function to update user info globally)
 * Handles profile image upload as multipart form, preview, error handling, and updates.
 */
function UserProfile({ user, setUser }) {
  const { profile, saving, error: profileError, fetchProfile, updateProfile } = useProfile();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    image: null,
    preview: user.avatar || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInput = useRef();

  // On mount, optionally fetch from API for fresher data
  useEffect(() => {
    fetchProfile().then((prof) => {
      if (prof) {
        setForm(f => ({
          ...f,
          name: prof.name || "",
          email: prof.email || "",
          avatar: prof.avatar || "",
          preview: prof.avatar || "",
          image: null,
        }));
      }
    });
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files.length > 0) {
      const file = files[0];
      setForm((f) => ({
        ...f,
        image: file,
        avatar: URL.createObjectURL(file),
        preview: URL.createObjectURL(file),
      }));
      setSuccess(false);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
      setSuccess(false);
    }
    setError("");
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const updated = {
        name: form.name,
      };
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.image) formData.append("avatar", form.image);
      // Call backend API via updateProfile hook (which expects FormData)
      const resp = await updateProfile(formData);
      if (resp && resp.avatar) {
        setForm(f => ({ ...f, avatar: resp.avatar, preview: resp.avatar, image: null }));
        setUser((old) => ({ ...old, name: resp.name, avatar: resp.avatar }));
      } else if (resp && resp.name) {
        setForm(f => ({ ...f, name: resp.name }));
        setUser((old) => ({ ...old, name: resp.name }));
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <section className="profile container">
      <h2>Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="profile-avatar-edit">
          <img
            src={form.preview || "/default-avatar.png"}
            alt="avatar"
            className="avatar-large"
            style={{ width: 90, height: 90, borderRadius: "50%" }}
            onError={e => {e.target.src="/default-avatar.png"}}
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
        {profileError && <div className="error-text">{profileError}</div>}
        {success && <div className="success-text">Profile updated!</div>}
        <button className="btn btn-large" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default UserProfile;
