import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
    } catch {
      // CartContext surfaces the API error.
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '80vh', padding: '40px 0 88px' }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              Saved Archive &bull; Patron Collection
            </div>
            <h1
              style={{
                fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                fontWeight: 700,
                color: 'var(--ink)',
                margin: 0,
                fontFamily: 'var(--font-heading)',
              }}
            >
              My Saved Wishlist ({wishlist.length})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--status-error)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Clear All Saved Items
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '72px 24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-gold-light)',
                border: '1px solid var(--brand-gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'var(--brand-maroon)',
              }}
            >
              <Heart size={36} fill="var(--brand-maroon)" />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
              Your Wishlist is Empty
            </h2>
            <p style={{ maxWidth: '440px', margin: '0 auto 24px', fontSize: '0.96rem', color: 'var(--secondary-ink)', lineHeight: 1.6 }}>
              Explore our catalogue and click the heart icon on any piece to save it to your personal atelier curation.
            </p>
            <Link to="/catalogue" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '12px 30px' }}>
              Explore Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {wishlist.map((product) => {
              const primaryImage = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = 'var(--brand-gold-border)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {/* Image Container with Wishlist Heart */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', backgroundColor: '#F9F5EE', overflow: 'hidden' }}>
                    <Link to={`/product/${product.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                      <img
                        src={primaryImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>

                    {/* Active Heart (Remove from Wishlist) */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-gold-light)',
                        border: '1px solid var(--brand-gold-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(41, 35, 38, 0.1)',
                      }}
                      title="Remove from wishlist"
                    >
                      <Heart size={16} fill="var(--brand-maroon)" color="var(--brand-maroon)" />
                    </button>
                  </div>

                  {/* Info & Add to Cart button */}
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--surface)' }}>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--brand-gold)', fontWeight: 700, marginBottom: '4px' }}>
                      {product.category?.name || 'Curated'}
                    </div>

                    <Link
                      to={`/product/${product.slug}`}
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        marginBottom: '6px',
                        textDecoration: 'none',
                        lineHeight: 1.35,
                        fontFamily: 'var(--font-heading)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.7em',
                      }}
                    >
                      {product.title}
                    </Link>

                    {/* Price */}
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-maroon)', marginBottom: '8px' }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    {/* Stars row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={13} fill="var(--brand-gold)" color="var(--brand-gold)" />
                      ))}
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted-ink)', marginLeft: '4px' }}>(24)</span>
                    </div>

                    {/* Add to Cart button */}
                    <div style={{ marginTop: 'auto' }}>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={isOutOfStock}
                        className="btn btn-primary"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                        }}
                      >
                        {isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
