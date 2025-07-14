import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * ProductForm - Add or Edit product.
 * Props: user (current user), editMode (boolean)
 * When editMode is true, loads product data for editing.
 */
function ProductForm({ user, editMode }) {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load product data if editMode (TODO: Fetch and fill form)
  // ...

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((f) => ({ ...f, [name]: files[0] }));
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
      // TODO: API call for add/edit
      if (!form.name || !form.price) throw new Error("Name and price required.");
      // Simulate delay then navigation
      setTimeout(() => {
        navigate("/products");
      }, 700);
    } catch (err) {
      setError(err.message || "Failed to save product.");
    }
    setLoading(false);
  };

  return (
    <section className="product-form container">
      <h2>{editMode ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          step="0.01"
          disabled={loading}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          disabled={loading}
        ></textarea>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          disabled={loading}
        />
        {error && <div className="error-text">{error}</div>}
        <button className="btn btn-large" type="submit" disabled={loading}>
          {loading ? "Saving..." : editMode ? "Update Product" : "Add Product"}
        </button>
      </form>
    </section>
  );
}

export default ProductForm;
