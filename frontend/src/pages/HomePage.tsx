import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  Gamepad2,
  ShoppingBag,
  BookOpen,
  Watch,
  Truck,
  CreditCard,
  Award,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { siteSettings } from '../config/siteSettings';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, featured, all] = await Promise.all([
          api.categories.getAll(),
          api.products.getFeatured(8),
          api.products.getAll({ limit: 12, sortBy: 'featured' }),
        ]);
        setCategories(cats);
        setFeaturedProducts(featured.slice(0, 4));
        setBestSellers(all.products.slice(4, 8));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Consistent stroke style category icons in Royal Maroon & Antique Gold
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'electronics':
      case 'audio-acoustics':
        return <Headphones size={22} color="var(--brand-maroon)" />;
      case 'fashion':
      case 'apparel-textiles':
      case 'clothings-accessories':
        return <Shirt size={22} color="var(--brand-maroon)" />;
      case 'home-living':
      case 'home-decor':
        return <Home size={22} color="var(--brand-maroon)" />;
      case 'beauty':
      case 'body-care':
        return <Sparkles size={22} color="var(--brand-maroon)" />;
      case 'sports':
        return <Dumbbell size={22} color="var(--brand-maroon)" />;
      case 'toys':
        return <Gamepad2 size={22} color="var(--brand-maroon)" />;
      case 'groceries':
      case 'natural-food':
        return <ShoppingBag size={22} color="var(--brand-maroon)" />;
      case 'books':
        return <BookOpen size={22} color="var(--brand-maroon)" />;
      case 'timepieces':
      case 'workspace-leather':
        return <Watch size={22} color="var(--brand-maroon)" />;
      default:
        return <Award size={22} color="var(--brand-maroon)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', paddingBottom: '72px' }}>
      {/* 1. HERO BANNER — Royal Indian Luxury Editorial Presentation */}
      <section className="container" style={{ paddingTop: '28px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: '#F7F2EA',
            border: '1px solid var(--brand-gold-border)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            minHeight: '480px',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)',
          }}
          className="hero-banner-grid"
        >
          {/* Left Hero Content */}
          <div
            style={{
              padding: 'clamp(36px, 5.5vw, 68px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              zIndex: 2,
            }}
          >
            {/* Royal Eyebrow with Antique Gold Accent */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="heritage-tag">
                <Sparkles size={12} color="var(--brand-gold)" />
                Curated Finds &bull; Considered Living
              </span>
            </div>

            {/* Regal Cormorant Garamond Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Everyday essentials.<br />
              <span style={{ color: 'var(--brand-maroon)', fontStyle: 'italic', fontWeight: 600 }}>
                Extraordinary living.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--secondary-ink)',
                margin: 0,
                maxWidth: '460px',
                lineHeight: 1.6,
              }}
            >
              Discover thoughtfully selected finds across precision technology, tailored fashion, artisan homeware, conscious wellness, and archival books.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                to="/catalogue"
                className="btn btn-primary btn-lg"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  padding: '13px 32px',
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                Explore the Collection <ArrowRight size={18} />
              </Link>

              <Link
                to="/categories"
                className="btn btn-secondary"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  padding: '12px 24px',
                  fontSize: '0.92rem',
                }}
              >
                Browse Departments
              </Link>
            </div>

            {/* Subtle Reassurance Micro-Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(182, 154, 98, 0.25)',
                fontSize: '0.8rem',
                color: 'var(--secondary-ink)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} color="var(--brand-gold)" />
                <span>100% Certified Genuine</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={15} color="var(--brand-gold)" />
                <span>Insured Pan-India Transit</span>
              </div>
            </div>
          </div>

          {/* Right Hero Lifestyle Composition */}
          <div
            style={{
              position: 'relative',
              height: '100%',
              minHeight: '380px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#EDE5D8',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85"
              alt="Artisan crafted lifestyle essentials"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            {/* Ambient Warm Gradient Overlay for Smooth Edge Blend */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to right, #F7F2EA 0%, transparent 20%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. REFINED CATEGORY BROWSING TILES */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              Curated Departments
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--brand-maroon)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View All Categories <ArrowRight size={15} />
          </Link>
        </div>

        {/* Clean Responsive Category Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
            gap: '16px',
          }}
        >
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogue?category=${cat.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 12px',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                textAlign: 'center',
                transition: 'all var(--transition-normal)',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--brand-gold-border)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-gold-light)',
                  border: '1px solid var(--brand-gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                {getCategoryIcon(cat.slug)}
              </div>
              <span
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  lineHeight: 1.25,
                }}
              >
                {cat.name.split('&')[0].trim()}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION — Highest Priority Design Standard */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '26px' }}>
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              Handpicked Provenance
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Featured Masterpieces
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-ink)', margin: '4px 0 0' }}>
              Handpicked selections with certified ratings and exceptional artisanal finishing
            </p>
          </div>
          <Link
            to="/catalogue"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--brand-maroon)',
            }}
          >
            Explore Catalogue <ArrowRight size={15} />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. COORDINATED EDITORIAL PROMOTIONAL BANNERS */}
      <section className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Card 1: Precision Technology & Audio */}
          <div
            style={{
              borderRadius: 'var(--radius-xl)',
              backgroundColor: '#F8F3EA',
              border: '1px solid var(--brand-gold-border)',
              padding: 'clamp(28px, 4vw, 40px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ zIndex: 2, maxWidth: '250px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--brand-maroon)',
                  backgroundColor: 'var(--brand-gold-light)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--brand-gold-border)',
                }}
              >
                Acoustic Excellence
              </span>
              <h3
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  margin: '12px 0 16px',
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Reference Studio<br />
                <span style={{ color: 'var(--brand-maroon)' }}>Headphones & Audio</span>
              </h3>
              <Link
                to="/catalogue?category=audio-acoustics"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 'var(--radius-pill)', padding: '8px 20px' }}
              >
                Explore Audio
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
              alt="Reference studio audio equipment"
              style={{
                width: '160px',
                height: '160px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                transform: 'rotate(-4deg)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              }}
            />
          </div>

          {/* Card 2: Artisan Living & Horology */}
          <div
            style={{
              borderRadius: 'var(--radius-xl)',
              backgroundColor: '#F5ECE3',
              border: '1px solid var(--brand-gold-border)',
              padding: 'clamp(28px, 4vw, 40px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ zIndex: 2, maxWidth: '250px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--brand-maroon)',
                  backgroundColor: 'var(--brand-gold-light)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--brand-gold-border)',
                }}
              >
                Timeless Craft
              </span>
              <h3
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  margin: '12px 0 16px',
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Automatic Horology<br />
                <span style={{ color: 'var(--brand-maroon)' }}>& Fine Carry</span>
              </h3>
              <Link
                to="/catalogue?category=timepieces"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: 'var(--radius-pill)', padding: '8px 20px' }}
              >
                Explore Timepieces
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
              alt="Automatic timepieces collection"
              style={{
                width: '160px',
                height: '160px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                transform: 'rotate(4deg)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              }}
            />
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '26px' }}>
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              Customer Favorites
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
              Most Coveted Finds
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-ink)', margin: '4px 0 0' }}>
              Frequently purchased items across all marketplace categories this week
            </p>
          </div>
          <Link
            to="/catalogue?sortBy=featured"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--brand-maroon)',
            }}
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. TRUST & CONCIERGE ASSURANCE STRIP */}
      <section
        style={{
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '44px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-gold-light)',
                  border: '1px solid var(--brand-gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Truck size={22} color="var(--brand-maroon)" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>
                  Complimentary Insured Transit
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--secondary-ink)', lineHeight: 1.5 }}>
                  Complimentary express insured delivery on orders over ₹{siteSettings.shipping.freeThreshold.toLocaleString('en-IN')}.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-gold-light)',
                  border: '1px solid var(--brand-gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <RotateCcw size={22} color="var(--brand-maroon)" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>
                  {siteSettings.policies.returnDays}-Day Courtesy Returns
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--secondary-ink)', lineHeight: 1.5 }}>
                  Hassle-free return policy with doorstep courier collection.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-gold-light)',
                  border: '1px solid var(--brand-gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={22} color="var(--brand-maroon)" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>
                  100% Certified Authentic
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--secondary-ink)', lineHeight: 1.5 }}>
                  Authentic verified goods directly from certified brand makers.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-gold-light)',
                  border: '1px solid var(--brand-gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CreditCard size={22} color="var(--brand-maroon)" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>
                  Secure Encrypted Payments
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--secondary-ink)', lineHeight: 1.5 }}>
                  UPI, Cards, NetBanking, and Cash on Delivery supported.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 860px) {
          .hero-banner-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
