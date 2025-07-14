import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../api";
import { useProductDetail } from "../../apiHooks";

/**
 * ProductForm - Add or Edit product.
 * Props: user (current user), editMode (boolean)
 * Handles product image upload, preview, display, and submit using backend API.
 */
function ProductForm({ user, editMode }) {
  const navigate = useNavigate();
  const { productId } = useParams();
  const fileInput = useRef();

  // Fetch detail if editing
  const { product, loading: loadingDetail } = useProductDetail(productId);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: null,  // File object
    preview: "",  // local preview or URL
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");

  // Load product data if editMode and product is fetched
  useEffect(() => {
    if (editMode && product) {
      setForm((f) => ({
        ...f,
        name: product.name || "",
        price: product.price !== undefined ? product.price : "",
        description: product.description || "",
        image: null,
        preview: product.image || "",
      }));
      setUploadedImage(product.image || "");
    }
  }, [editMode, product]);

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setForm((f) => ({
        ...f,
        image: file,
        preview: URL.createObjectURL(file),
      }));
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
      if (!form.name || !form.price) throw new Error("Name and price required.");
      const newForm = new FormData();
      newForm.append("name", form.name);
      newForm.append("price", form.price);
      newForm.append("description", form.description);
      if (form.image) newForm.append("image", form.image);

      let endpoint = "/products";
      let method = "POST";
      if (editMode && productId) {
        endpoint = `/products/${productId}`;
        method = "PUT";
      }

      // Submit to backend - expects multipart
      const productResp = await apiFetch(endpoint, {
        method,
        body: newForm,
        headers: {},
      });

      setUploadedImage(productResp.image);
      navigate("/products");
    } catch (err) {
      setError(err.message || "Failed to save product.");
    }
    setLoading(false);
  };

  return (
    <section className="product-form container">
      <h2>{editMode ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Show preview: uploaded or newly selected */}
        {(form.preview || uploadedImage) && (
          <img
            src={form.preview || uploadedImage}
            alt="Product"
            className="product-image large"
            style={{ marginBottom: 15, border: "1px solid #ddd" }}
            onError={e => {e.target.src="/product-placeholder.png"}}
          />
        )}
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
          ref={fileInput}
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
