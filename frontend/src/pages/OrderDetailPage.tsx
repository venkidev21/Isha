import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Order } from '../types';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.orders.getById(id);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Failed to locate order records');
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm('Are you certain you wish to cancel this acquisition? Inventory will be released back to the atelier catalogue.')) {
      return;
    }

    setIsCancelling(true);
    try {
      const updated = await api.orders.cancel(order.id);
      setOrder(updated);
      toast.success('Order has been successfully cancelled and inventory restored.');
    } catch (err: any) {
      toast.error(err.message || 'Unable to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '350px', maxWidth: '700px', margin: '0 auto' }} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '12px' }}>Order Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {error || 'You do not have authorization to view this order or it does not exist.'}
        </p>
        <Link to="/profile" className="btn btn-primary">
          Return to My Account
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PAID', label: 'Payment Confirmed' },
    { key: 'PROCESSING', label: 'Artisanal Preparation' },
    { key: 'SHIPPED', label: 'Dispatched & In Transit' },
    { key: 'DELIVERED', label: 'Delivered to Destination' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';

  const canCancel = ['PENDING', 'PAID'].includes(order.status);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Order Archive
        </Link>

        {/* Order Header Card */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '6px' }}>
                Order Record
              </div>
              <h1 style={{ fontSize: '1.9rem', marginBottom: '6px' }}>{order.orderNumber}</h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Recorded on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Payment Method</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {order.paymentMethod === 'DEVELOPMENT_MOCK' ? 'Sandbox Verified Payment' : order.paymentMethod}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--status-success)', marginTop: '2px' }}>
                Payment Status: {order.paymentStatus}
              </div>
            </div>
          </div>

          {/* Status Tracker Progression */}
          {isCancelled ? (
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: 'var(--status-danger-bg)',
                border: '1px solid #FCA5A5',
                borderRadius: '4px',
                color: 'var(--status-danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.92rem',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={20} />
              <span>This order has been cancelled and any reserved stock released back to inventory.</span>
            </div>
          ) : (
            <div style={{ padding: '20px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', position: 'relative' }} className="timeline-grid">
                {steps.map((step, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? 'var(--text-primary)' : 'var(--bg-secondary)',
                          color: isDone ? '#FFFFFF' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          marginBottom: '10px',
                          border: isCurrent ? '2px solid var(--accent-primary)' : 'none',
                        }}
                      >
                        {isDone ? <CheckCircle2 size={18} /> : idx + 1}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: isDone ? 600 : 400, color: isDone ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Line Items Snapshot */}
        <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Purchased Items (Preserved Snapshot)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=120&q=80'}
                  alt={item.productTitle}
                  style={{ width: '64px', height: '72px', objectFit: 'cover', borderRadius: '2px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.96rem' }}>{item.productTitle}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    SKU: {item.productSku} &bull; Unit Price at purchase: ₹{item.unitPrice.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Quantity: {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  ₹{item.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Merchandise Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>GST (18%)</span>
              <span>₹{order.taxTotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee.toLocaleString('en-IN')}`}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: 'var(--text-primary)',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span>Total Paid</span>
              <span>₹{order.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details and Cancellation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="detail-bottom-grid">
          {order.shippingAddress && (
            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Shipping Destination</h4>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.shippingAddress.fullName}</div>
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}</div>
                <div style={{ color: 'var(--text-muted)' }}>Phone: {order.shippingAddress.phone}</div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Order Support & Actions</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {canCancel
                  ? 'You may cancel this acquisition prior to dispatch. Once cancelled, reserved stock will be immediately returned to warehouse inventory.'
                  : 'This order has progressed past the cancellation window. Please contact client concierge for returns assistance.'}
              </p>
            </div>

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="btn btn-secondary"
                style={{ borderColor: 'var(--status-danger)', color: 'var(--status-danger)', marginTop: '16px' }}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 650px) {
          .detail-bottom-grid { grid-template-columns: 1fr !important; }
          .timeline-grid { grid-template-columns: 1fr 1fr !important; row-gap: 16px; }
        }
      `}</style>
    </div>
  );
};
