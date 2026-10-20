import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Award, ArrowUpRight } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const topProducts = [
    { title: 'Smart Watch Pro', sales: 42, revenue: 167958 },
    { title: 'Wireless Headphones', sales: 38, revenue: 94962 },
    { title: 'Backpack', sales: 27, revenue: 35073 },
    { title: 'Running Shoes', sales: 21, revenue: 52479 },
    { title: 'Cotton T-shirt', sales: 19, revenue: 11381 },
    { title: 'Sunglasses Classic', sales: 15, revenue: 19485 },
  ];

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
            Sales Analytics
          </h1>
          <p style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem' }}>
            Comprehensive revenue breakdowns, transaction volume, and product performance.
          </p>
        </div>

        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-ink)', backgroundColor: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          Last 7 Days
        </span>
      </div>

      {/* Analytics KPI Cards (Screen 15) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Total Revenue
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)' }}>
            ₹1,24,560
          </div>
          <div style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={16} /> 12% vs prior week
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Total Orders
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)' }}>
            248
          </div>
          <div style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={16} /> 8% vs prior week
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-ink)', marginBottom: '8px' }}>
            Average Order Value
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)' }}>
            ₹501
          </div>
          <div style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={16} /> 4% customer basket size
          </div>
        </div>
      </div>

      {/* Revenue Overview Graph (Screen 15) */}
      <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Revenue Overview</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--secondary-ink)' }}>Daily confirmed transactions in Indian Rupees</span>
          </div>
        </div>

        {/* SVG Graph */}
        <div style={{ width: '100%', height: '220px' }}>
          <svg viewBox="0 0 700 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="0" y1="40" x2="700" y2="40" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="80" x2="700" y2="80" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="120" x2="700" y2="120" stroke="#F1F5F9" strokeWidth="1" />

            <polygon
              points="20,130 115,110 210,80 310,95 410,50 510,65 680,25 680,150 20,150"
              fill="url(#analyticsGrad)"
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

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted-ink)', marginTop: '8px' }}>
          <span>11 Oct</span>
          <span>12 Oct</span>
          <span>13 Oct</span>
          <span>14 Oct</span>
          <span>15 Oct</span>
          <span>16 Oct</span>
          <span>17 Oct</span>
        </div>
      </div>

      {/* Top Selling Products (Screen 15) */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Top Selling Products</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {topProducts.map((p, idx) => (
            <div
              key={p.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: idx === 0 ? '#FEF3C7' : '#E2E8F0', color: idx === 0 ? '#D97706' : 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>
                  {idx + 1}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{p.title}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{p.sales} units</span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted-ink)' }}>Quantity Sold</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--brand-blue)' }}>₹{p.revenue.toLocaleString('en-IN')}</span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted-ink)' }}>Gross Revenue</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
