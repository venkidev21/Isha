import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Category } from '../types';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories.getAll()
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to load categories:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '85vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '8px' }}>
            <span className="heritage-tag">
              <Sparkles size={12} color="var(--brand-gold)" /> Curated Disciplines
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '12px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Explore by Department
          </h1>
          <p style={{ color: 'var(--secondary-ink)', fontSize: '1.02rem', lineHeight: 1.6 }}>
            Browse through our wide range of curated collections with verified quality, artisanal provenance, and direct manufacturer warranties.
          </p>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogue?category=${cat.slug}`}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
                display: 'flex',
                flexDirection: 'column',
              }}
              className="category-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--brand-gold-border)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {/* Image Container with warm tone */}
              <div
                style={{
                  height: '210px',
                  backgroundColor: '#F9F5EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform var(--transition-slow)',
                  }}
                />
              </div>

              {/* Title & Count Details */}
              <div
                style={{
                  padding: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--surface)',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--ink)',
                      margin: 0,
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {cat.name}
                  </h3>
                  <span style={{ fontSize: '0.84rem', color: 'var(--brand-gold)', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                    {cat.productCount ? `${cat.productCount} authentic items` : 'Explore department'}
                  </span>
                </div>

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-gold-light)',
                    border: '1px solid var(--brand-gold-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-maroon)',
                    flexShrink: 0,
                    transition: 'background-color var(--transition-fast)',
                  }}
                >
                  <ArrowRight size={17} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
