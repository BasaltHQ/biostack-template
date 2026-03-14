"use client";
import React, { useState, useEffect } from "react";

// Default icon for products without images
function ProductIcon() {
  return (
    <svg className="h-24 w-24 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
    </svg>
  );
}


// CRM Contact Form — imported as shared component
import CrmContactForm from "@/components/CrmContactForm";

// ── Payment Modal ── Embeds BasaltSurge portal in an iframe
function PaymentModal({ receiptId, paymentUrl, onSuccess, onCancel }) {
  const [iframeHeight, setIframeHeight] = useState(600);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    function handleMessage(event) {
      // Only trust messages from BasaltSurge
      if (event.origin !== "https://surge.basalthq.com") return;

      switch (event.data?.type) {
        case "gateway-preferred-height":
          setIframeHeight(event.data.height);
          break;
        case "gateway-card-success":
          setPaymentDone(true);
          // Poll status to confirm, then notify parent
          pollPaymentStatus(event.data.receiptId || receiptId).then(() => {
            onSuccess(event.data.receiptId || receiptId);
          });
          break;
        case "gateway-card-cancel":
          onCancel();
          break;
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [receiptId, onSuccess, onCancel]);

  async function pollPaymentStatus(rid) {
    for (let i = 0; i < 10; i++) {
      try {
        const res = await fetch(`/api/receipts/status?receiptId=${encodeURIComponent(rid)}`);
        const data = await res.json();
        if (data.status === "paid" || data.status === "completed") return;
      } catch { /* keep polling */ }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (paymentDone) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" style={{ zIndex: 10100 }}></div>
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 10101 }}>
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Processing...</h3>
            <p className="text-slate-500 text-sm">Confirming your payment. This won&#39;t take long.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 10100 }}
        onClick={onCancel}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 10101 }}>
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden payment-modal-enter">
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <iframe
            src={paymentUrl}
            width="100%"
            height={iframeHeight}
            frameBorder="0"
            title="BasaltSurge Payment"
            allow="payment; clipboard-write"
            style={{ border: "none", display: "block" }}
          />
        </div>
      </div>
    </>
  );
}


export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [addedItem, setAddedItem] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null); // { receiptId, paymentUrl }

  // Fetch products from BasaltSurge on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProductError("Failed to load products");
        }
      } catch {
        setProductError("Failed to connect to server");
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const pid = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === pid);
      if (existing) {
        return prev.map((item) =>
          item.id === pid ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: pid, name: product.name, sku: product.sku || product.name, price: Number(product.price), quantity: 1 }];
    });
    setAddedItem(pid);
    setTimeout(() => setAddedItem(null), 1200);
    if (!cartOpen) setCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          customerName: formData.name,
          items: cart.map((item) => ({
            productName: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // If BasaltSurge returned a paymentUrl, open the payment modal
        if (data.data.paymentUrl && data.data.receiptId) {
          setPaymentModal({
            receiptId: data.data.receiptId,
            paymentUrl: data.data.paymentUrl,
            orderNumber: data.data.orderNumber,
            email: formData.email,
          });
          setCartOpen(false);
          setCheckoutMode(false);
        } else {
          // Fallback: no Surge integration — show success directly
          setOrderResult(data.data);
          setCart([]);
          setCheckoutMode(false);
          setFormData({ name: "", email: "" });
        }
      } else {
        alert(data.error || "Order failed. Please try again.");
      }
    } catch {
      alert("Failed to connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (receiptId) => {
    setPaymentModal(null);
    setOrderResult({
      orderNumber: paymentModal?.orderNumber || "—",
      email: paymentModal?.email || formData.email,
      receiptId,
    });
    setCart([]);
    setFormData({ name: "", email: "" });

    // Confirm order server-side (updates status + triggers CRM sync)
    try {
      await fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptId }),
      });
    } catch {
      // Non-blocking — order is already shown as confirmed to user
      console.error("Failed to confirm order server-side");
    }
  };

  const handlePaymentCancel = () => {
    setPaymentModal(null);
    // Cart is preserved so the user can retry
  };

  return (
    <main className="flex-grow pt-32 pb-24 px-6 bg-sage-50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Performance Store</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Premium, pharmaceutical-grade supplements designed to optimize your biology.
          </p>
        </div>

        {/* Order Success Banner */}
        {orderResult && (
          <div className="mb-10 bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">Payment Confirmed!</h3>
            <p className="text-emerald-700 mb-1">
              Your order number is <span className="font-mono font-bold text-lg">{orderResult.orderNumber}</span>
            </p>
            {orderResult.receiptId && (
              <p className="text-emerald-600 text-xs mb-1">
                Receipt: <span className="font-mono">{orderResult.receiptId}</span>
              </p>
            )}
            <p className="text-emerald-600 text-sm">
              A confirmation has been recorded for <span className="font-medium">{orderResult.email}</span>.
              You can view your order anytime in the{" "}
              <a href="/portal" className="underline font-bold hover:text-emerald-800">Client Portal</a>.
            </p>
            <button onClick={() => setOrderResult(null)} className="mt-4 text-emerald-600 text-sm underline hover:text-emerald-800">
              Dismiss
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loadingProducts && (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="h-64 bg-slate-200"></div>
                <div className="p-8 space-y-4">
                  <div className="h-3 w-20 bg-slate-200 rounded"></div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-7 w-16 bg-slate-200 rounded"></div>
                    <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {productError && !loadingProducts && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to load products</h3>
            <p className="text-slate-500 mb-4">{productError}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">Retry</button>
          </div>
        )}

        {!loadingProducts && !productError && products.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No products available</h3>
            <p className="text-slate-500">Check back soon for new inventory.</p>
          </div>
        )}

        {!loadingProducts && !productError && products.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => {
              const pid = product._id || product.id;
              return (
                <div
                  key={pid}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 flex flex-col"
                >
                  <div className="h-64 bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ProductIcon />
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="uppercase text-xs font-bold tracking-wider text-sage-600 mb-2">
                      {product.category || "Supplement"}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h3>
                    <p className="text-slate-600 mb-6 text-sm flex-grow">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-slate-900">${Number(product.price).toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${addedItem === pid
                          ? "bg-emerald-600 text-white scale-95"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                      >
                        {addedItem === pid ? "✓ Added" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CONTACT FORM SECTION */}
      <CrmContactForm heading="Have Questions?" subtitle="Our experts are here to help you choose the right stack." />

      {/* Floating Cart Badge */}
      {cartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-8 right-8 bg-slate-900 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-slate-800 transition-all duration-300 hover:scale-110"
          style={{ zIndex: 9999 }}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"></path>
          </svg>
          <span className="absolute -top-1 -right-1 bg-sage-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all"
            style={{ zIndex: 10000 }}
            onClick={() => { setCartOpen(false); setCheckoutMode(false); }}
          ></div>

          {/* Drawer */}
          <div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col cart-drawer-enter"
            style={{ zIndex: 10001 }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"></path>
                </svg>
                Your Cart
                <span className="text-sm text-slate-400 font-normal">({cartCount} item{cartCount !== 1 ? "s" : ""})</span>
              </h3>
              <button
                onClick={() => { setCartOpen(false); setCheckoutMode(false); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  <p className="font-medium">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                        <div>
                          <h4 className="font-bold text-slate-900">{item.name}</h4>
                          <p className="text-sm text-slate-500">${Number(item.price).toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors font-bold"
                          >
                            −
                          </button>
                          <span className="text-slate-900 font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-sage-50 hover:border-sage-200 hover:text-sage-600 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkout Form */}
                  {checkoutMode && (
                    <form onSubmit={handleCheckout} className="space-y-4 bg-sage-50 rounded-xl p-5 border border-sage-100">
                      <h4 className="font-bold text-slate-900 mb-1">Checkout Details</h4>
                      <div>
                        <label htmlFor="checkout-name" className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="checkout-name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="checkout-email" className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="checkout-email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none transition-all text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-sage-600 text-white font-bold py-3 rounded-lg hover:bg-sage-700 transition-all duration-300 shadow-lg disabled:opacity-50 text-sm tracking-wide"
                      >
                        {submitting ? "Placing Order..." : `Place Order — $${cartTotal.toFixed(2)}`}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && !checkoutMode && (
              <div className="border-t border-slate-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-slate-900">Subtotal</span>
                  <span className="text-2xl font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setCheckoutMode(true)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform tracking-wide"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* BasaltSurge Payment Modal */}
      {paymentModal && (
        <PaymentModal
          receiptId={paymentModal.receiptId}
          paymentUrl={paymentModal.paymentUrl}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </main>
  );
}
