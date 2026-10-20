import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const items = cart?.items || [];
  const hasShortage = items.some((i) => i.hasStockShortage);

  return (
    <div className="overlay" onClick={closeCart} style={{ zIndex: 120 }}>
      <div
        className="drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: 'var(--surface)',
          borderLeft: '1px solid var(--brand-gold-border)',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--canvas)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--brand-maroon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <ShoppingBag size={17} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  margin: 0,
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--ink)',
                }}
              >
                Shopping Bag
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--secondary-ink)' }}>
                {cart?.itemCount || 0} {cart?.itemCount === 1 ? 'curated item' : 'curated items'}
              </span>
            </div>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--secondary-ink)',
              padding: '6px',
            }}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {cart && cart.subtotal > 0 && (
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: cart.subtotal >= cart.freeShippingThreshold ? 'var(--status-success-bg)' : 'var(--brand-gold-light)',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.8rem',
              color: cart.subtotal >= cart.freeShippingThreshold ? 'var(--status-success)' : 'var(--brand-maroon)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={14} color="var(--brand-gold)" />
            {cart.subtotal >= cart.freeShippingThreshold ? (
              <span>Your order qualifies for <strong>Complimentary Insured Delivery</strong></span>
            ) : (
              <span>
                Add <strong>₹{(cart.freeShippingThreshold - cart.subtotal).toLocaleString('en-IN')}</strong> more for free insured shipping
              </span>
            )}
          </div>
        )}

        {/* Shortage Warning */}
        {hasShortage && (
          <div
            style={{
              margin: '12px 24px 0',
              padding: '10px 14px',
              backgroundColor: 'var(--status-warning-bg)',
              border: '1px solid rgba(179, 104, 20, 0.3)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              color: 'var(--status-warning)',
            }}
          >
            <AlertTriangle size={16} />
            <span>Some items exceed available stock. Please adjust quantities.</span>
          </div>
        )}

        {/* Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-gold-light)',
                  border: '1px solid var(--brand-gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--brand-maroon)',
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>
                Your shopping bag is empty
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--secondary-ink)', marginBottom: '24px', lineHeight: 1.5 }}>
                Explore our royal multi-category collections of acoustics, timepieces, apparel, and artisan homeware.
              </p>
              <button
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-pill)', padding: '10px 24px' }}
                onClick={() => {
                  closeCart();
                  navigate('/catalogue');
                }}
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                    alt={item.title}
                    style={{
                      width: '76px',
                      height: '88px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--canvas)',
                      border: '1px solid var(--border)',
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            color: 'var(--ink)',
                            lineHeight: 1.35,
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          {item.title}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--secondary-ink)',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--muted-ink)', marginTop: '2px' }}>
                        SKU: {item.sku}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--canvas)',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--ink)',
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '4px 8px',
                            cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                            opacity: item.quantity >= item.stock ? 0.35 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--ink)',
                          }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--brand-maroon)' }}>
                          ₹{item.lineTotal.toLocaleString('en-IN')}
                        </div>
                        {item.quantity > 1 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--secondary-ink)' }}>
                            (₹{item.price.toLocaleString('en-IN')} each)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Summary & Checkout */}
        {items.length > 0 && cart && (
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: 'var(--canvas)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-ink)' }}>
                <span>Subtotal</span>
                <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-ink)' }}>
                <span>Estimated GST (18%)</span>
                <span>₹{cart.taxTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-ink)' }}>
                <span>Insured Courier Shipping</span>
                <span>
                  {cart.shippingFee === 0 ? (
                    <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>FREE</span>
                  ) : (
                    `₹${cart.shippingFee.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--brand-maroon)',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <span>Estimated Total</span>
                <span>₹{cart.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', borderRadius: 'var(--radius-pill)', padding: '12px' }}
                onClick={() => {
                  closeCart();
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', borderRadius: 'var(--radius-pill)', padding: '10px' }}
                onClick={() => {
                  closeCart();
                  navigate('/cart');
                }}
              >
                Review Full Bag Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
