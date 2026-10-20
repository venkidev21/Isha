import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck, Truck, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--canvas)', minHeight: '75vh', padding: '80px 0', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-gold-light)',
              border: '1px solid var(--brand-gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'var(--brand-maroon)',
            }}
          >
            <ShoppingBag size={36} />
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
            Your Shopping Bag is Empty
          </h1>
          <p style={{ color: 'var(--secondary-ink)', marginBottom: '32px', fontSize: '1rem', lineHeight: 1.6 }}>
            Explore our curated collections across precision acoustics, fine timepieces, apparel, and artisan homeware.
          </p>
          <Link
            to="/catalogue"
            className="btn btn-primary"
            style={{ padding: '12px 32px', fontSize: '0.96rem', borderRadius: 'var(--radius-pill)' }}
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--canvas)', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '0.74rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--brand-gold)',
              fontWeight: 700,
              marginBottom: '6px',
            }}
          >
            Order Bag &bull; Summary
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: 0,
              fontFamily: 'var(--font-heading)',
            }}
          >
            Shopping Bag ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 390px', gap: '36px' }} className="cart-layout">
          {/* Items Column */}
          <div>
            {/* Free Shipping Alert Banner */}
            {cart && cart.subtotal < cart.freeShippingThreshold ? (
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--brand-gold-light)',
                  border: '1px solid var(--brand-gold-border)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--brand-maroon)',
                }}
              >
                <Truck size={20} color="var(--brand-maroon)" />
                <span>
                  Add <strong>₹{(cart.freeShippingThreshold - cart.subtotal).toLocaleString('en-IN')}</strong> more to qualify for <strong>FREE Insured Courier Delivery</strong>.
                </span>
              </div>
            ) : (
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--status-success-bg)',
                  border: '1px solid rgba(56, 107, 80, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  fontSize: '0.9rem',
                  color: 'var(--status-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Sparkles size={20} />
                <span>Congratulations! Your selection qualifies for <strong>Complimentary Insured Delivery</strong> across India.</span>
              </div>
            )}

            {/* Product Items List */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '22px 26px',
                    borderBottom: idx === items.length - 1 ? 'none' : '1px solid var(--border)',
                    gap: '20px',
                    flexWrap: 'wrap',
                  }}
                  className="cart-item-row"
                >
                  {/* Left: Thumbnail & Details */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: '240px' }}>
                    <div
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#F9F5EE',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-gold)', letterSpacing: '0.06em' }}>
                        {item.categoryName || 'Curated'}
                      </div>
                      <Link
                        to={`/product/${item.slug}`}
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 600,
                          color: 'var(--ink)',
                          display: 'block',
                          marginTop: '3px',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
                        {item.title}
                      </Link>
                      <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--brand-maroon)', marginTop: '4px' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity controls & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {/* Quantity pill */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--surface)',
                        padding: '2px 4px',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: 'var(--ink)',
                        }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '6px 10px',
                          cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: 'var(--ink)',
                          opacity: item.quantity >= item.stock ? 0.35 : 1,
                        }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Total for item */}
                    <div style={{ minWidth: '90px', textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: 'var(--brand-maroon)' }}>
                      ₹{item.lineTotal.toLocaleString('en-IN')}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--muted-ink)',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '6px',
                        transition: 'color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--status-error)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-ink)')}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Back link */}
            <div style={{ marginTop: '24px' }}>
              <Link
                to="/catalogue"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--brand-maroon)',
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={16} /> Continue Exploring Catalogue
              </Link>
            </div>
          </div>

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
              <h2
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-ink)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>₹{cart?.subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-ink)' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: 600, color: 'var(--status-success)' }}>
                    {items.reduce((acc, item) => acc + (item.compareAtPrice && item.compareAtPrice > item.price ? (item.compareAtPrice - item.price) * item.quantity : 0), 0) > 0 ? (
                      `- ₹${items.reduce((acc, item) => acc + (item.compareAtPrice && item.compareAtPrice > item.price ? (item.compareAtPrice - item.price) * item.quantity : 0), 0).toLocaleString('en-IN')}`
                    ) : (
                      '₹0'
                    )}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-ink)' }}>
                  <span>Insured Transit</span>
                  <span style={{ fontWeight: 600, color: cart?.shippingFee === 0 ? 'var(--status-success)' : 'var(--ink)' }}>
                    {cart?.shippingFee === 0 ? 'FREE' : `₹${cart?.shippingFee.toLocaleString('en-IN')}`}
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
                  <span>₹{cart?.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link
                  to="/catalogue"
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--secondary-ink)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Continue Shopping
                </Link>
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
                <ShieldCheck size={16} color="var(--brand-maroon)" />
                <span>100% Secure Checkout &amp; Encrypted Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-layout { grid-template-columns: 1fr !important; }
          .cart-item-row { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </div>
  );
};
