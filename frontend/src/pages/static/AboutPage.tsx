import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Truck, CheckCircle2, Award, Users, HeartHandshake } from 'lucide-react';
import { siteSettings } from '../../config/siteSettings';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '100vh', padding: '48px 0 88px' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)', marginBottom: '24px' }}>
          <Link to="/" style={{ color: 'var(--secondary-ink)' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>About ShopNest</span>
        </nav>

        {/* Hero Header */}
        <header style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--primary-cta)',
              backgroundColor: 'var(--accent-tint)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              marginBottom: '16px',
            }}
          >
            The ShopNest Philosophy
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}
          >
            Curated Living Across Every Category of Your Life
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--secondary-ink)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            ShopNest was founded to challenge fast-disposable consumerism. We hand-select exceptional products across
            electronics, apparel, homeware, beauty, sports, books, and artisanal pantry essentials—tested for durability,
            aesthetic honesty, and genuine utility.
          </p>
        </header>

        {/* Core Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <Award size={32} color="var(--primary-cta)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Authentic Provenance</h3>
            <p style={{ color: 'var(--secondary-ink)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Every item in our catalogue is vetted for material authenticity, ethical manufacturing, and uncompromising build quality. No grey-market counterfeits or rebranded white-label clones.
            </p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <ShieldCheck size={32} color="var(--primary-cta)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Server-Verified Transactions</h3>
            <p style={{ color: 'var(--secondary-ink)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Our modern transactional architecture guarantees real-time warehouse inventory reservations, atomic checkout calculations, and tamper-proof payment verification.
            </p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <Truck size={32} color="var(--primary-cta)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Insured White-Glove Logistics</h3>
            <p style={{ color: 'var(--secondary-ink)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              We partner with premier express courier networks across India. Orders over ₹{siteSettings.shipping.freeThreshold.toLocaleString('en-IN')} ship with complimentary insurance and express delivery.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <section className="card" style={{ padding: '48px', marginBottom: '64px' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '20px' }}>
              Why Multi-Category Curation Matters
            </h2>
            <p style={{ color: 'var(--secondary-ink)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '16px' }}>
              Modern consumers are forced to navigate fragmented marketplaces cluttered with search manipulation, sponsored ads, and unreliable seller reviews. Finding a studio-grade pair of headphones, a hand-thrown ceramic mug, and an organic combed cotton tee often requires visiting half a dozen disconnected stores.
            </p>
            <p style={{ color: 'var(--secondary-ink)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px' }}>
              <strong>ShopNest</strong> bridges that gap. We unite technical gear, tactile homeware, athletic accessories, and literature under one cohesive visual and editorial standard. When you browse ShopNest, every product is worthy of your space.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-cta)', fontFamily: 'var(--font-heading)' }}>
                  100%
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)', marginTop: '4px' }}>
                  Authentic Brand Guarantee
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-cta)', fontFamily: 'var(--font-heading)' }}>
                  30 Days
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)', marginTop: '4px' }}>
                  Hassle-Free Return Window
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-cta)', fontFamily: 'var(--font-heading)' }}>
                  2–4 Days
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)', marginTop: '4px' }}>
                  Average Express Delivery Time
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Box */}
        <div
          style={{
            backgroundColor: 'var(--ink)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '48px',
            textAlign: 'center',
          }}
        >
          <Sparkles size={36} color="var(--primary-cta)" style={{ marginBottom: '16px' }} />
          <h2 style={{ color: '#FFFFFF', fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '12px' }}>
            Explore Our Curated Collections
          </h2>
          <p style={{ color: '#D4D6D9', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 28px' }}>
            Discover our complete multi-category catalogue spanning electronics, fashion, homeware, sports, beauty, and books.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/catalogue" className="btn btn-primary btn-lg">
              Browse Catalogue
            </Link>
            <Link
              to="/contact"
              className="btn btn-lg"
              style={{ backgroundColor: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
