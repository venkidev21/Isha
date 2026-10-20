import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle2, Clock, Truck, X, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Order } from '../types';

export const OrdersPage: React.FC = () => {
  const toast = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Inspect Modal
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.admin.getOrders({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        limit: 100,
      });
      setOrders(res.orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [searchTerm, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const updated = await api.admin.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status changed to ${newStatus}`);
      if (inspectOrder && inspectOrder.id === orderId) {
        setInspectOrder({ ...inspectOrder, status: updated.status as any });
      }
      await loadOrders();
    } catch (err: any) {
      toast.error(err.message || 'Status transition failed');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
          Manage Orders
        </h1>
        <p style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem' }}>
          Track customer transactions, dispatch states, and process shipping deliveries.
        </p>
      </div>

      {/* Filter Tabs (Screen 14) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'All', value: '' },
          { label: 'Processing', value: 'PROCESSING' },
          { label: 'Shipped', value: 'SHIPPED' },
          { label: 'Delivered', value: 'DELIVERED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatusFilter(tab.value)}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: statusFilter === tab.value ? '1px solid var(--brand-navy)' : '1px solid var(--border)',
              backgroundColor: statusFilter === tab.value ? 'var(--brand-navy)' : 'var(--surface)',
              color: statusFilter === tab.value ? '#FFFFFF' : 'var(--secondary-ink)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <Search size={16} color="var(--muted-ink)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '38px', borderRadius: '10px' }}
          />
        </div>
      </div>

      {/* Orders Table (Screen 14) */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: '#F8FAFC', color: 'var(--muted-ink)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 20px' }}>Order ID</th>
                <th style={{ padding: '14px 20px' }}>Customer</th>
                <th style={{ padding: '14px 20px' }}>Amount</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px' }}>Date</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-ink)' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-ink)' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const statusStyle =
                    o.status === 'DELIVERED'
                      ? { bg: '#DCFCE7', text: '#15803D', label: 'Delivered' }
                      : o.status === 'SHIPPED'
                      ? { bg: '#EFF6FF', text: '#2563EB', label: 'Shipped' }
                      : o.status === 'CANCELLED'
                      ? { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' }
                      : { bg: '#FEF3C7', text: '#D97706', label: 'Processing' };

                  const formattedDate = new Date(o.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  });

                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        #{o.orderNumber}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          {o.shippingAddress?.fullName || o.guestName || 'Customer'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted-ink)' }}>
                          {o.shippingAddress?.phone}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 700 }}>
                        ₹{o.grandTotal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                          }}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--secondary-ink)', fontSize: '0.85rem' }}>
                        {formattedDate}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => setInspectOrder(o)}
                          className="btn btn-secondary btn-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {inspectOrder && (
        <div className="modal-overlay">
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                  Order #{inspectOrder.orderNumber}
                </h2>
                <div style={{ fontSize: '0.82rem', color: 'var(--secondary-ink)', marginTop: '2px' }}>
                  Placed on {new Date(inspectOrder.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-ink)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Status change selector */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>Update Status:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    disabled={isUpdating || inspectOrder.status === st}
                    onClick={() => handleStatusChange(inspectOrder.id, st)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: inspectOrder.status === st ? 'var(--brand-navy)' : '#FFFFFF',
                      color: inspectOrder.status === st ? '#FFFFFF' : 'var(--ink)',
                      border: '1px solid var(--border)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {st.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Items</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {inspectOrder.items?.map((it) => (
                  <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{it.productTitle}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--secondary-ink)' }}>Qty: {it.quantity} &bull; SKU: {it.productSku}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>₹{it.totalAmount.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ marginBottom: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Delivery Address</h4>
              <div style={{ fontSize: '0.88rem', color: 'var(--secondary-ink)', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{inspectOrder.shippingAddress?.fullName}</div>
                <div>{inspectOrder.shippingAddress?.street}</div>
                <div>{inspectOrder.shippingAddress?.city}, {inspectOrder.shippingAddress?.state} - {inspectOrder.shippingAddress?.postalCode}</div>
                <div>Phone: {inspectOrder.shippingAddress?.phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setInspectOrder(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
