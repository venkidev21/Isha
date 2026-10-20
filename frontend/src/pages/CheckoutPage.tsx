import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowRight, Truck, CreditCard, ChevronRight, Plus, Edit2, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user, addresses } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Contact info
  const [email, setEmail] = useState(user?.email || '');
  const [guestName, setGuestName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Shipping Address
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : 'Venkatesan E',
    phone: user?.phone || '+91 98765 43210',
    street: '123, Gandhi Street',
    city: 'Erode',
    state: 'Tamil Nadu',
    postalCode: '638001',
    country: 'India',
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [orderNotes, setOrderNotes] = useState('');

  // Server verified preview
  const [serverPreview, setServerPreview] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Initialize saved address if available
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
      setShippingAddress({
        fullName: defaultAddr.fullName,
        phone: defaultAddr.phone,
        street: defaultAddr.street,
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode,
        country: defaultAddr.country || 'India',
      });
    }
  }, [addresses]);

  // Server revalidation of prices & inventory
  useEffect(() => {
    async function revalidate() {
      if (!cart || cart.items.length === 0) {
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      setSubmissionError(null);
      try {
        const previewItems = cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
        const preview = await api.orders.preview(previewItems);
        setServerPreview(preview);
      } catch (err: any) {
        setSubmissionError(err.message || 'Error revalidating prices and inventory with server.');
      } finally {
        setIsValidating(false);
      }
    }
    revalidate();
  }, [cart]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>Your Bag is Empty</h2>
        <p style={{ color: 'var(--secondary-ink)', margin: '16px 0 24px' }}>
          Please add items to your shopping cart before proceeding to checkout.
        </p>
        <Link to="/catalogue" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '10px 28px' }}>
          Explore Catalogue
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isValidating) return;

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.postalCode) {
      toast.error('Please complete all mandatory delivery address fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const orderPayload = {
        shippingAddress: {
          fullName: shippingAddress.fullName.trim(),
          phone: shippingAddress.phone.trim(),
          street: shippingAddress.street.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          postalCode: shippingAddress.postalCode.trim(),
          country: shippingAddress.country || 'India',
        },
        billingAddress: {
          fullName: shippingAddress.fullName.trim(),
          phone: shippingAddress.phone.trim(),
          street: shippingAddress.street.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          postalCode: shippingAddress.postalCode.trim(),
          country: shippingAddress.country || 'India',
        },
        paymentMethod: paymentMethod === 'COD' ? 'COD' : 'DEVELOPMENT_MOCK',
        customerNotes: orderNotes.trim() || undefined,
        guestEmail: !user ? email.trim() : undefined,
      };

      const result = await api.orders.create(orderPayload);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${result.orderNumber}`, { state: { order: result } });
    } catch (err: any) {
      console.error('Order creation error:', err);
      const msg = err.message || 'An unexpected error occurred while placing your order.';
      setSubmissionError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '85vh', padding: '36px 0 88px' }}>
      <div className="container" style={{ maxWidth: '1120px' }}>
        {/* 3-Step Royal Progress Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-maroon)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              1
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--brand-maroon)' }}>Shipping</span>
          </div>

          <div style={{ width: '48px', height: '2px', backgroundColor: 'var(--brand-gold-border)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: paymentMethod ? 'var(--brand-maroon)' : 'var(--surface-subtle)',
                color: paymentMethod ? '#FFFFFF' : 'var(--secondary-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              2
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink)' }}>Payment</span>
          </div>

          <div style={{ width: '48px', height: '2px', backgroundColor: 'var(--border)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-subtle)',
                color: 'var(--muted-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              3
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--muted-ink)' }}>Review</span>
          </div>
        </div>

        {submissionError && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--status-error-bg)',
              border: '1px solid rgba(180, 35, 54, 0.25)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--status-error)',
              fontSize: '0.9rem',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <AlertCircle size={20} />
            <span>{submissionError}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '40px' }} className="checkout-layout">
          {/* Left Column: Delivery Address & Payment Selection */}
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Section 1: Delivery Address */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Delivery Address
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-maroon)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={16} /> Add New Address
                </button>
              </div>

              {/* Selected / Current Address Card */}
              {!showAddressForm ? (
                <div
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--brand-maroon)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '22px 26px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '5px solid var(--brand-maroon)',
                        backgroundColor: '#FFFFFF',
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>
                        {shippingAddress.fullName}
                      </div>
                      <div style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {shippingAddress.street}, {shippingAddress.city}
                      </div>
                      <div style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {shippingAddress.state} - {shippingAddress.postalCode}
                      </div>
                      <div style={{ color: 'var(--brand-gold)', fontSize: '0.85rem', marginTop: '6px', fontWeight: 600 }}>
                        Phone: {shippingAddress.phone}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-maroon)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                /* Editable Address Form */
                <div
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
                    Enter Delivery Details
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Venkatesan E"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal / PIN Code *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="638001"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Street Address / House No. *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="123, Gandhi Street"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Erode"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Tamil Nadu"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: 'var(--radius-pill)' }}
                    >
                      Use Saved Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: 'var(--radius-pill)' }}
                    >
                      Save &amp; Continue
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Payment Method */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
                Payment Method
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Option 1: UPI / Card / Net Banking */}
                <label
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: paymentMethod === 'ONLINE' ? '1px solid var(--brand-maroon)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px 24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color var(--transition-fast)',
                    boxShadow: paymentMethod === 'ONLINE' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      style={{ accentColor: 'var(--brand-maroon)', width: '18px', height: '18px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--ink)' }}>
                        UPI / Card / Net Banking (Instant Order Confirmation)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--secondary-ink)', marginTop: '2px' }}>
                        Google Pay, PhonePe, Paytm, Credit &amp; Debit Cards
                      </div>
                    </div>
                  </div>

                  {/* Payment provider brand badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--brand-gold-light)', color: 'var(--brand-maroon)', border: '1px solid var(--brand-gold-border)' }}>
                      UPI
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--canvas)', color: 'var(--ink)', border: '1px solid var(--border)' }}>
                      CARDS
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--canvas)', color: 'var(--ink)', border: '1px solid var(--border)' }}>
                      NETBANKING
                    </span>
                  </div>
                </label>

                {/* Option 2: Cash on Delivery */}
                <label
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: paymentMethod === 'COD' ? '1px solid var(--brand-maroon)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px 24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'border-color var(--transition-fast)',
                    boxShadow: paymentMethod === 'COD' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      style={{ accentColor: 'var(--brand-maroon)', width: '18px', height: '18px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--ink)' }}>
                        Cash on Delivery
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--secondary-ink)', marginTop: '2px' }}>
                        Pay at your doorstep via cash or scan QR upon courier arrival
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || isValidating}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                {isSubmitting ? (
                  <span>Processing Secure Order...</span>
                ) : (
                  <>
                    <span>Place Order &bull; Confirm Purchase</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Column: Order Summary */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
                position: 'sticky',
                top: '100px',
              }}
            >
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
                Order Summary ({cart.items.length} items)
              </h3>

              {/* Items List Snapshot */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', maxHeight: '240px', overflowY: 'auto' }}>
                {cart.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80'}
                      alt={item.title}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', backgroundColor: '#F9F5EE', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--secondary-ink)' }}>
                        Qty: {item.quantity} &bull; ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--brand-maroon)' }}>
                      ₹{item.lineTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-ink)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                    ₹{(serverPreview?.subtotal || cart.subtotal).toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-ink)' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: 600, color: 'var(--status-success)' }}>
                    {cart.items.reduce((acc, item) => acc + (item.compareAtPrice && item.compareAtPrice > item.price ? (item.compareAtPrice - item.price) * item.quantity : 0), 0) > 0 ? (
                      `- ₹${cart.items.reduce((acc, item) => acc + (item.compareAtPrice && item.compareAtPrice > item.price ? (item.compareAtPrice - item.price) * item.quantity : 0), 0).toLocaleString('en-IN')}`
                    ) : (
                      '₹0'
                    )}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-ink)' }}>
                  <span>Insured Courier Delivery</span>
                  <span style={{ fontWeight: 600, color: (serverPreview?.shippingFee ?? cart.shippingFee) === 0 ? 'var(--status-success)' : 'var(--ink)' }}>
                    {(serverPreview?.shippingFee ?? cart.shippingFee) === 0 ? 'FREE' : `₹${(serverPreview?.shippingFee ?? cart.shippingFee).toLocaleString('en-IN')}`}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--brand-maroon)',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <span>Grand Total</span>
                  <span>₹{(serverPreview?.grandTotal || cart.grandTotal).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.8rem',
                  color: 'var(--muted-ink)',
                }}
              >
                <Lock size={15} color="var(--brand-gold)" />
                <span>256-Bit SSL Encrypted &bull; Authentic Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .checkout-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
