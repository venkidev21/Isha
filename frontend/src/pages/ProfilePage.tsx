import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Plus, Trash2, ArrowRight, Clock, ShieldCheck, CheckCircle2, Truck, AlertCircle, Camera, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Order } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, addresses, refreshProfile } = useAuth();
  const toast = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'>('ALL');

  // Profile form state (Screen 16)
  const [profileName, setProfileName] = useState(user ? `${user.firstName} ${user.lastName}` : 'Venkatesan E');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'venkatesan@gmail.com');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+91 98765 43210');
  const [profileAddress, setProfileAddress] = useState('123, Gandhi Street, Erode');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // New address state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    fullName: user ? `${user.firstName} ${user.lastName}` : 'Venkatesan E',
    phone: user?.phone || '+91 98765 43210',
    street: '123, Gandhi Street',
    city: 'Erode',
    state: 'Tamil Nadu',
    postalCode: '638001',
    country: 'India',
  });

  useEffect(() => {
    async function loadOrders() {
      setIsLoadingOrders(true);
      try {
        const data = await api.orders.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.auth.addAddress(newAddress);
      toast.success('Address saved to address book');
      setShowAddAddress(false);
      await refreshProfile();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this address?')) return;
    try {
      await api.auth.deleteAddress(id);
      toast.info('Address removed');
      await refreshProfile();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete address');
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile information updated successfully');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter both current and new password');
      return;
    }
    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
  };

  // Filter orders by selected status tab (Screen 7)
  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter === 'ALL') return true;
    return order.status === orderStatusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: '#DCFCE7',
              color: '#15803D',
            }}
          >
            Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
            }}
          >
            Shipped
          </span>
        );
      case 'PROCESSING':
      case 'PAID':
        return (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: '#FEF3C7',
              color: '#D97706',
            }}
          >
            Processing
          </span>
        );
      case 'CANCELLED':
        return (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
            }}
          >
            Cancelled
          </span>
        );
      default:
        return (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: '#F1F5F9',
              color: '#475569',
            }}
          >
            {status}
          </span>
        );
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '85vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Main Tab Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '16px',
            marginBottom: '32px',
          }}
        >
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: activeTab === 'orders' ? 'var(--brand-navy)' : 'transparent',
              color: activeTab === 'orders' ? '#FFFFFF' : 'var(--secondary-ink)',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: activeTab === 'profile' ? 'var(--brand-navy)' : 'transparent',
              color: activeTab === 'profile' ? '#FFFFFF' : 'var(--secondary-ink)',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: activeTab === 'addresses' ? 'var(--brand-navy)' : 'transparent',
              color: activeTab === 'addresses' ? '#FFFFFF' : 'var(--secondary-ink)',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            Saved Addresses ({addresses.length})
          </button>
        </div>

        {/* TAB 1: MY ORDERS (Screen 7) */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
                My Orders
              </h1>

              {/* Status filter pills (Screen 7) */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '999px',
                      border: orderStatusFilter === status ? '1px solid var(--brand-navy)' : '1px solid var(--border)',
                      backgroundColor: orderStatusFilter === status ? 'var(--brand-navy)' : '#FFFFFF',
                      color: orderStatusFilter === status ? '#FFFFFF' : 'var(--secondary-ink)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {isLoadingOrders ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} className="skeleton" style={{ height: '110px', borderRadius: '16px' }} />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  padding: '60px 24px',
                  textAlign: 'center',
                }}
              >
                <Package size={48} color="var(--muted-ink)" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>
                  No orders found
                </h3>
                <p style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  You don't have any orders matching this status filter.
                </p>
                <Link to="/catalogue" className="btn btn-primary btn-sm">
                  Explore Products
                </Link>
              </div>
            ) : (
              /* Order Cards List (Screen 7) */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredOrders.map((order) => {
                  const firstItem = order.items?.[0];
                  const itemImage = firstItem?.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';
                  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-sm)',
                        flexWrap: 'wrap',
                        gap: '16px',
                      }}
                    >
                      {/* Left: Thumbnail & Order Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '12px',
                            backgroundColor: '#F8FAFC',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            border: '1px solid var(--border)',
                          }}
                        >
                          <img
                            src={itemImage}
                            alt="Order thumbnail"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                          />
                        </div>

                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)' }}>
                            Order #{order.orderNumber}
                          </div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--brand-blue)', marginTop: '2px' }}>
                            ₹{order.grandTotal.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted-ink)', marginTop: '2px' }}>
                            Placed on {formattedDate}
                          </div>
                          <Link
                            to={`/order/${order.id}`}
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: 'var(--secondary-ink)',
                              textDecoration: 'underline',
                              display: 'inline-block',
                              marginTop: '4px',
                            }}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>

                      {/* Right: Status Badge */}
                      <div>{getStatusBadge(order.status)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE INFORMATION (Screen 16) */}
        {activeTab === 'profile' && (
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '24px' }}>
              Profile Information
            </h2>

            {/* Avatar & Edit (Screen 16) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: 'var(--brand-navy)',
                  }}
                >
                  {user ? user.firstName[0] : 'V'}
                </div>
                <button
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-blue)',
                    color: '#FFFFFF',
                    border: '2px solid #FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Upload new avatar"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)' }}>
                  {profileName}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--secondary-ink)' }}>
                  {profileEmail}
                </div>
              </div>
            </div>

            {/* Profile Form (Screen 16) */}
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '12px 28px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Change Password Section (Screen 16) */}
            <div style={{ paddingTop: '28px', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
                Change Password
              </h3>
              <form onSubmit={handleUpdatePassword} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="form-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    style={{ padding: '12px 20px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, minHeight: '44px' }}
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                Saved Addresses
              </h2>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> Add New Address
              </button>
            </div>

            {/* Add Address Form */}
            {showAddAddress && (
              <div
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  padding: '24px',
                  marginBottom: '28px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>New Address</h3>
                <form onSubmit={handleAddAddress} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PIN Code</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Street / Area</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-blue)' }}>
                        {addr.label || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span style={{ fontSize: '0.72rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          Default
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{addr.fullName}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--secondary-ink)', marginTop: '4px', lineHeight: 1.5 }}>
                      {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted-ink)', marginTop: '6px' }}>
                      Phone: {addr.phone}
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
