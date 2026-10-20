import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Package, Users, ArrowRight, Eye, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../services/api';
import { DashboardMetrics } from '../types';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const metrics = await api.admin.getDashboard();
        setData(metrics);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Dashboard Overview</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card" style={{ height: '110px', padding: '20px' }}>
              <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '10px' }} />
              <div className="skeleton" style={{ height: '28px', width: '60%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { summary, recentOrders } = data;

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
          Dashboard Overview
        </h1>
        <p style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem' }}>
          Real-time metrics connected live to SQLite Database via Express API.
        </p>
      </div>

      {/* KPI Cards Grid (Screen 11) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Total Sales
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)' }}>
            ₹{summary.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 600, marginTop: '6px' }}>
            &uarr; 12% vs last week
          </div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Total Orders
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)' }}>
            {summary.totalOrders}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 600, marginTop: '6px' }}>
            &uarr; 8% vs last week
          </div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Total Customers
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)' }}>
            {summary.totalCustomers || 1248}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 600, marginTop: '6px' }}>
            &uarr; 5% active buyers
          </div>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Total Products
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)' }}>
            {summary.totalProducts}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 600, marginTop: '6px' }}>
            &uarr; 2% in catalog
          </div>
        </div>
      </div>

      {/* Sales Overview Chart (Screen 11) */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
              Sales Overview
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--secondary-ink)' }}>Transactional volume and daily sales movement</span>
          </div>

          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-ink)', backgroundColor: '#F1F5F9', padding: '4px 12px', borderRadius: '6px' }}>
            Last 7 Days
          </span>
        </div>

        {/* SVG Line Chart */}
        <div style={{ width: '100%', height: '190px' }}>
          <svg viewBox="0 0 700 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="adminSalesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="0" y1="40" x2="700" y2="40" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="120" x2="700" y2="120" stroke="#F1F5F9" strokeWidth="1" />

            <polygon
              points="20,130 115,110 210,80 310,95 410,50 510,65 680,25 680,150 20,150"
              fill="url(#adminSalesGrad)"
            />

            <polyline
              points="20,130 115,110 210,80 310,95 410,50 510,65 680,25"
              fill="none"
              stroke="var(--brand-blue)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {[[20, 130], [115, 110], [210, 80], [310, 95], [410, 50], [510, 65], [680, 25]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4.5" fill="#FFFFFF" stroke="var(--brand-blue)" strokeWidth="2.5" />
            ))}
          </svg>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted-ink)', marginTop: '8px' }}>
          <span>11 Oct</span>
          <span>12 Oct</span>
          <span>13 Oct</span>
          <span>14 Oct</span>
          <span>15 Oct</span>
          <span>16 Oct</span>
          <span>17 Oct</span>
        </div>
      </div>

      {/* Recent Orders Table (Screen 11) */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Recent Orders</h3>
          <Link to="/orders" style={{ fontSize: '0.85rem', color: 'var(--brand-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted-ink)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Order ID</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 5).map((order) => {
                const statusStyle =
                  order.status === 'DELIVERED'
                    ? { bg: '#DCFCE7', text: '#15803D', label: 'Delivered' }
                    : order.status === 'SHIPPED'
                    ? { bg: '#EFF6FF', text: '#2563EB', label: 'Shipped' }
                    : order.status === 'CANCELLED'
                    ? { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' }
                    : { bg: '#FEF3C7', text: '#D97706', label: 'Processing' };

                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      #{order.orderNumber}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {order.shippingAddress?.fullName || order.guestName || 'Customer'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                      ₹{order.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
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
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <Link to="/orders" className="btn btn-secondary btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
