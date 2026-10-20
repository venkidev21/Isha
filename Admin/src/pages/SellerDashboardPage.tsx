import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, Clock, ArrowRight } from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {
  const sellerOrders = [
    { id: '#SN123456', amount: 3499, status: 'Processing', statusBg: '#FEF3C7', statusText: '#D97706' },
    { id: '#SN123455', amount: 1999, status: 'Shipped', statusBg: '#EFF6FF', statusText: '#2563EB' },
    { id: '#SN123454', amount: 2699, status: 'Delivered', statusBg: '#DCFCE7', statusText: '#15803D' },
  ];

  const weeklyBars = [
    { day: 'Mon', height: 40 },
    { day: 'Tue', height: 65 },
    { day: 'Wed', height: 85 },
    { day: 'Thu', height: 50 },
    { day: 'Fri', height: 95 },
    { day: 'Sat', height: 110 },
    { day: 'Sun', height: 75 },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
          Seller Dashboard
        </h1>
        <p style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem' }}>
          Overview of merchant catalogue, dispatch queues, and store payouts.
        </p>
      </div>

      {/* KPI Cards (Screen 12) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Total Products
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)' }}>24</div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Total Orders
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)' }}>48</div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Total Earnings
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)' }}>₹32,560</div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Pending Orders
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#D97706' }}>12</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="seller-grid">
        {/* Recent Orders (Screen 12) */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Recent Orders</h3>
            <Link to="/orders" style={{ fontSize: '0.85rem', color: 'var(--brand-blue)', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sellerOrders.map((o) => (
              <div
                key={o.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{o.id}</div>
                <div style={{ fontWeight: 700, color: 'var(--ink)' }}>₹{o.amount.toLocaleString('en-IN')}</div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    backgroundColor: o.statusBg,
                    color: o.statusText,
                  }}
                >
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Overview Bar Chart (Screen 12) */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Sales Overview</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-ink)' }}>This Week</span>
          </div>

          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', padding: '10px 10px 0' }}>
            {weeklyBars.map((bar) => (
              <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '32px',
                    height: `${bar.height}px`,
                    backgroundColor: 'var(--brand-blue)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.3s ease',
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--secondary-ink)', marginTop: '8px' }}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .seller-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
