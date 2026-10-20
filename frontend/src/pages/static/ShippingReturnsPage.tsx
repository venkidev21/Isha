import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { siteSettings } from '../../config/siteSettings';

interface ShippingReturnsProps {
  initialTab?: 'shipping' | 'returns';
}

export const ShippingReturnsPage: React.FC<ShippingReturnsProps> = ({ initialTab = 'shipping' }) => {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns'>(initialTab);

  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '100vh', padding: '48px 0 88px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)', marginBottom: '24px' }}>
          <Link to="/" style={{ color: 'var(--secondary-ink)' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
            {activeTab === 'shipping' ? 'Shipping & Delivery' : 'Returns & Refunds'}
          </span>
        </nav>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '36px' }}>
          <button
            onClick={() => setActiveTab('shipping')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'shipping' ? '2px solid var(--ink)' : '1px solid var(--border)',
              backgroundColor: activeTab === 'shipping' ? 'var(--ink)' : '#FFFFFF',
              color: activeTab === 'shipping' ? '#FFFFFF' : 'var(--ink)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Truck size={18} />
            <span>Shipping & Delivery Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'returns' ? '2px solid var(--ink)' : '1px solid var(--border)',
              backgroundColor: activeTab === 'returns' ? 'var(--ink)' : '#FFFFFF',
              color: activeTab === 'returns' ? '#FFFFFF' : 'var(--ink)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RotateCcw size={18} />
            <span>Returns & Refund Standard</span>
          </button>
        </div>

        {activeTab === 'shipping' ? (
          <div>
            <header style={{ marginBottom: '32px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--ink)', marginBottom: '8px' }}>
                Shipping & Express Delivery
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--secondary-ink)', lineHeight: 1.6 }}>
                All ShopNest consignments are fulfilled from our temperature-controlled central logistics facility in Bengaluru and shipped with fully insured premier couriers.
              </p>
            </header>

            {/* Rates Table Card */}
            <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Delivery Timelines & Charges</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--secondary-ink)' }}>
                    <th style={{ padding: '12px 8px' }}>Order Value</th>
                    <th style={{ padding: '12px 8px' }}>Destination Region</th>
                    <th style={{ padding: '12px 8px' }}>Estimated Time</th>
                    <th style={{ padding: '12px 8px' }}>Shipping Fee</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--ink)' }}>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 600 }}>Orders ≥ ₹{siteSettings.shipping.freeThreshold.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 8px' }}>Pan-India (All pin codes)</td>
                    <td style={{ padding: '14px 8px' }}>2–4 Business Days</td>
                    <td style={{ padding: '14px 8px', color: 'var(--status-success)', fontWeight: 600 }}>COMPLIMENTARY FREE</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 8px' }}>Orders &lt; ₹{siteSettings.shipping.freeThreshold.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 8px' }}>Tier 1 Metro Hubs</td>
                    <td style={{ padding: '14px 8px' }}>2–3 Business Days</td>
                    <td style={{ padding: '14px 8px' }}>₹{siteSettings.shipping.defaultFee}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '14px 8px' }}>Orders &lt; ₹{siteSettings.shipping.freeThreshold.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 8px' }}>Tier 2 / Tier 3 & Rest of India</td>
                    <td style={{ padding: '14px 8px' }}>3–5 Business Days</td>
                    <td style={{ padding: '14px 8px' }}>₹{siteSettings.shipping.defaultFee}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Packaging & Safety */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <ShieldCheck size={28} color="var(--primary-cta)" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>100% Transit Insurance</h4>
                <p style={{ color: 'var(--secondary-ink)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Every package is insured against loss, theft, or damage during courier transit. If an item arrives damaged, we replace it immediately without hassle.
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <Clock size={28} color="var(--primary-cta)" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Same-Day Dispatch</h4>
                <p style={{ color: 'var(--secondary-ink)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Orders verified before 2:00 PM IST on working days are processed and handed over to courier carriers on the exact same afternoon.
                </p>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <CheckCircle2 size={28} color="var(--primary-cta)" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Eco-Conscious Packaging</h4>
                <p style={{ color: 'var(--secondary-ink)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  We pack fragile ceramics, audio equipment, and apparel using 100% recyclable honeycomb kraft paper and reinforced cardboard boxes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <header style={{ marginBottom: '32px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--ink)', marginBottom: '8px' }}>
                Returns & Refund Policy
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--secondary-ink)', lineHeight: 1.6 }}>
                We believe purchasing premium objects should be completely stress-free. If a product does not meet your expectations, our {siteSettings.policies.returnDays}-day return policy protects your purchase.
              </p>
            </header>

            {/* Conditions Card */}
            <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Return Conditions & Guidelines</h3>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.925rem', color: 'var(--secondary-ink)', lineHeight: 1.6 }}>
                <li>Items must be initiated for return within <strong>{siteSettings.policies.returnDays} calendar days</strong> from the delivery confirmation timestamp.</li>
                <li>Products must be completely unused, unaltered, and unwashed, with all original certificates, serial tags, and presentation boxes intact.</li>
                <li>Acoustic headphones and in-ear monitors must include all silicone/foam eartips and detachable cables.</li>
                <li>Consumable gourmet groceries or opened personal care elixirs cannot be returned due to hygiene and health standards once the safety seal is broken.</li>
              </ul>
            </div>

            {/* Step by step */}
            <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>How to Initiate a Return</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--ink)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    1
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Submit Return Request</h4>
                    <p style={{ color: 'var(--secondary-ink)', fontSize: '0.88rem', margin: 0 }}>
                      Visit your <Link to="/profile" style={{ color: 'var(--primary-cta)', fontWeight: 600 }}>Account Profile</Link>, open the specific order, and select "Request Return / Refund" or email our support concierge.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--ink)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    2
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Free Doorstep Pickup</h4>
                    <p style={{ color: 'var(--secondary-ink)', fontSize: '0.88rem', margin: 0 }}>
                      Our courier partner will arrive at your address to collect the securely boxed item. There is zero pickup charge.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--ink)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    3
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Inspection & Fast Refund</h4>
                    <p style={{ color: 'var(--secondary-ink)', fontSize: '0.88rem', margin: 0 }}>
                      Upon arrival at our warehouse, our quality check team validates the serial tag and triggers an immediate refund to your bank or card within 2–4 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
