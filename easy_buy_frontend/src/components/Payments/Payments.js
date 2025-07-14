import React, { useState } from "react";

/**
 * Payments - Payment portal.
 * Simulate or integrate with payment gateway on product purchase.
 * Props: user
 */
function Payments({ user }) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  const handlePayment = async () => {
    setProcessing(true);
    setError("");
    setSuccess(false);
    try {
      // TODO: Integrate actual payment processor
      setTimeout(() => {
        setSuccess(true);
      }, 1000);
    } catch (err) {
      setError("Payment failed.");
    }
    setProcessing(false);
  };

  return (
    <section className="payments container">
      <h2>Payments</h2>
      {success ? (
        <div className="success-text">Payment Successful! 🎉</div>
      ) : (
        <>
          <p>
            Press the button below to simulate payment (integration will happen soon).
          </p>
          {error && <div className="error-text">{error}</div>}
          <button
            className="btn btn-large btn-accent"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
        </>
      )}
    </section>
  );
}

export default Payments;
