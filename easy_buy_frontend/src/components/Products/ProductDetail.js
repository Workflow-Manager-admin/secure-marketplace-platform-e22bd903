import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * ProductDetail - Show a specific product, with actions like buy/chat if not owner.
 * Props: user (current user object)
 */
function ProductDetail({ user }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    // TODO: Fetch product detail
    setTimeout(() => {
      setProduct({
        id: productId,
        name: `Sample Product #${productId}`,
        price: 39.99,
        owner: "Other Seller",
        description: "This is a product description.",
        image: "",
      });
      setLoading(false);
    }, 500);
  }, [productId]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error-text">{error}</div>;
  if (!product) return <div>Product not found.</div>;

  const isOwner = user && user.name === product.owner;

  return (
    <section className="product-detail container">
      <img
        src={product.image || "/product-placeholder.png"}
        alt={product.name}
        className="product-image large"
      />
      <div className="product-info">
        <h2>{product.name}</h2>
        <div className="price">${product.price}</div>
        <div className="owner">Seller: {product.owner}</div>
        <div className="description">{product.description}</div>
        {!isOwner && (
          <div className="card-actions" style={{ marginTop: 12 }}>
            <Link to={`/chat?with=${product.owner}`} className="btn btn-large">
              Chat with Seller
            </Link>
            <Link to="/payments" className="btn btn-large btn-accent" style={{ marginLeft: 10 }}>
              Buy Now
            </Link>
          </div>
        )}
        {isOwner && (
          <div className="owner-actions" style={{ marginTop: 14 }}>
            <Link to={`/products/${product.id}/edit`} className="btn btn-large">
              Edit Product
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetail;
