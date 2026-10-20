import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RotateCcw, Truck, Award, Sparkles } from 'lucide-react';
import { siteSettings } from '../../config/siteSettings';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--brand-burgundy)',
        color: 'var(--inverse-ink)',
        marginTop: 'auto',
        borderTop: '2px solid var(--brand-gold-border)',
      }}
    >
      {/* 1. Value Pillars Banner with Antique Gold Accents */}
      <div
        style={{
          borderBottom: '1px solid rgba(182, 154, 98, 0.2)',
          padding: '36px 0',
          backgroundColor: '#38101C',
        }}
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <Award size={22} color="var(--brand-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FAF6EF', marginBottom: '3px', fontFamily: 'var(--font-heading)' }}>
                Artisanal Provenance
              </div>
              <div style={{ fontSize: '0.8rem', color: '#D9CFCE', lineHeight: 1.5 }}>
                Beryllium transducers, horology, pure cottons, and master leathercraft.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <Truck size={22} color="var(--brand-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FAF6EF', marginBottom: '3px', fontFamily: 'var(--font-heading)' }}>
                Insured Express Delivery
              </div>
              <div style={{ fontSize: '0.8rem', color: '#D9CFCE', lineHeight: 1.5 }}>
                Complimentary insured delivery for orders over ₹{siteSettings.shipping.freeThreshold.toLocaleString('en-IN')} across India.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <RotateCcw size={22} color="var(--brand-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FAF6EF', marginBottom: '3px', fontFamily: 'var(--font-heading)' }}>
                {siteSettings.policies.returnDays}-Day Courtesy Return
              </div>
              <div style={{ fontSize: '0.8rem', color: '#D9CFCE', lineHeight: 1.5 }}>
                Doorstep courier collection in original presentation gift packaging.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <ShieldCheck size={22} color="var(--brand-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FAF6EF', marginBottom: '3px', fontFamily: 'var(--font-heading)' }}>
                100% Certified Authentic
              </div>
              <div style={{ fontSize: '0.8rem', color: '#D9CFCE', lineHeight: 1.5 }}>
                Directly from authorized brand creators, master artisans, and verified houses.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Columns */}
      <div className="container" style={{ padding: '56px 0 36px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--brand-maroon)',
                  border: '1px solid var(--brand-gold-border)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-gold)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                S
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                }}
              >
                {siteSettings.siteName}
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#D9CFCE', lineHeight: 1.6, marginBottom: '16px' }}>
              ShopNest is a premier multi-category marketplace curating electronics, horology, apparel, homeware, fine wellness, sports, and books across India.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--brand-champagne)', lineHeight: 1.5 }}>
              {siteSettings.contact.address}
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                marginBottom: '16px',
              }}
            >
              Curated Departments
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/catalogue?category=electronics" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Electronics & Acoustics
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=fashion" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Fashion & Heritage Textiles
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=home-living" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Home Decor & Living
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=beauty" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Beauty & Personal Care
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=sports" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Sports & Active Gear
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=books" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Books & Archive Monographs
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Support */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                marginBottom: '16px',
              }}
            >
              Concierge & Care
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/about" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  About the Atelier
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/faq" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/shipping" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Insured Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Track Order Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Status */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                marginBottom: '16px',
              }}
            >
              Trust & Assurance
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <li>
                <Link to="/terms" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={{ fontSize: '0.88rem', color: '#FAF6EF', opacity: 0.85 }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--brand-gold)')} onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF6EF')}>
                  Privacy & Cookie Policy
                </Link>
              </li>
            </ul>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(182, 154, 98, 0.3)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                color: 'var(--brand-champagne)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-success)',
                  boxShadow: '0 0 6px var(--status-success)',
                }}
              />
              PCI-DSS Compliant Payments
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div
          style={{
            borderTop: '1px solid rgba(182, 154, 98, 0.2)',
            marginTop: '48px',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.8rem',
            color: '#BFAFA8',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {siteSettings.siteName}. All rights reserved. Direct-to-Customer Multi-Category Marketplace.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/privacy" style={{ color: '#BFAFA8' }}>Privacy</Link>
            <Link to="/terms" style={{ color: '#BFAFA8' }}>Terms</Link>
            <Link to="/shipping" style={{ color: '#BFAFA8' }}>Shipping</Link>
            <Link to="/returns" style={{ color: '#BFAFA8' }}>Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
