import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * ProductList - List and manage products for the marketplace
 * Shows all products, supports delete (CRUD) with loading/error state.
 * Props: user (current user object)
 */
function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  // Fetch products from backend (placeholder)
  useEffect(() => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      // TODO: Replace with fetch('/api/products')
      setProducts([
        { id: 1, name: "Sample Product 1", price: 25.0, owner: user.name, image: "" },
        { id: 2, name: "Sample Product 2", price: 45.0, owner: "Other Seller", image: "" },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  // PUBLIC_INTERFACE
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleting(productId);
    try {
      // TODO: backend delete call
      setProducts(p => p.filter(pr => pr.id !== productId));
    } catch (e) {
      setError("Failed to delete product.");
    }
    setDeleting(null);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <section className="product-list container">
      <div className="list-header">
        <h2>Products</h2>
        <Link to="/products/add" className="btn btn-large">+ Add Product</Link>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <Link to={`/products/${product.id}`}>
              <img
                src={product.image || "/product-placeholder.png"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <span className="price">${product.price.toFixed(2)}</span>
                <span className="owner">Seller: {product.owner}</span>
              </div>
            </Link>
            {product.owner === user.name && (
              <div className="card-actions">
                <Link to={`/products/${product.id}/edit`} className="btn-small btn">Edit</Link>
                <button
                  className="btn-small btn-danger"
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  style={{ marginLeft: 6 }}
                >
                  {deleting === product.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {products.length === 0 && <div>No products found.</div>}
    </section>
  );
}

export default ProductList;
