import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, AlertCircle, Heart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images?.find((img) => !img.isPrimary)?.url;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const wishlisted = isInWishlist(product.id);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    } catch {
      // toast notification handled by CartContext
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="card card-interactive"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        borderColor: isHovered ? 'var(--brand-gold-border)' : 'var(--border)',
      }}
    >
      <Link
        to={`/product/${product.slug}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {/* 1. Curated Aspect Ratio (4:5) Image Container with Subtle Warm Tone */}
        <div
          className="product-card-image"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 5',
            backgroundColor: '#F9F5EE',
            overflow: 'hidden',
          }}
        >
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform var(--transition-slow), opacity var(--transition-normal)',
            }}
          />

          {/* Badges Stack (Top-Left) */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              zIndex: 2,
            }}
          >
            {hasDiscount && (
              <span
                style={{
                  backgroundColor: 'var(--brand-maroon)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: '0 2px 6px rgba(100, 28, 50, 0.25)',
                }}
              >
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span
                style={{
                  backgroundColor: 'var(--brand-gold)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  boxShadow: '0 2px 6px rgba(182, 154, 98, 0.25)',
                }}
              >
                Featured
              </span>
            )}
          </div>

          {/* Top-Right Wishlist Heart Control */}
          <button
            onClick={handleToggleWishlist}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 3,
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: wishlisted ? 'var(--brand-gold-light)' : 'rgba(255, 253, 250, 0.95)',
              border: `1px solid ${wishlisted ? 'var(--brand-gold-border)' : 'var(--border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(41, 35, 38, 0.08)',
              cursor: 'pointer',
              transition: 'transform var(--transition-fast), background-color var(--transition-fast)',
              transform: wishlisted ? 'scale(1.05)' : 'scale(1)',
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              size={16}
              color={wishlisted ? 'var(--brand-maroon)' : '#766C6D'}
              fill={wishlisted ? 'var(--brand-maroon)' : 'none'}
              strokeWidth={2}
            />
          </button>

          {/* Bottom Availability Status Tag */}
          {isOutOfStock ? (
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 2 }}>
              <span className="badge badge-error">Out of Stock</span>
            </div>
          ) : isLowStock ? (
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 2 }}>
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} />
                Only {product.stock} left
              </span>
            </div>
          ) : null}
        </div>

        {/* 2. Structured Content Below Image */}
        <div
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: '6px',
            backgroundColor: 'var(--surface)',
          }}
        >
          {/* Category Label */}
          <div
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--brand-gold)',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {product.category?.name || 'Curated'}
          </div>

          {/* Product Title (Cormorant Serif Accent) */}
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.35,
              color: 'var(--ink)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.7em',
              margin: 0,
            }}
          >
            {product.title}
          </h3>

          {/* Star Rating Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', marginTop: '2px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  fill={star <= Math.round(product.rating || 4.8) ? 'var(--brand-gold)' : '#E9E0D7'}
                  color={star <= Math.round(product.rating || 4.8) ? 'var(--brand-gold)' : '#E9E0D7'}
                />
              ))}
            </div>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{product.rating?.toFixed(1) || '4.8'}</span>
            <span style={{ color: 'var(--muted-ink)' }}>({product.reviewCount || 24})</span>
          </div>

          {/* Price & Quick Add Row */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '10px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '12px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {/* Price block */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--brand-maroon)',
                  letterSpacing: '-0.01em',
                }}
              >
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span
                  style={{
                    fontSize: '0.825rem',
                    color: 'var(--muted-ink)',
                    textDecoration: 'line-through',
                    fontWeight: 400,
                  }}
                >
                  ₹{product.compareAtPrice!.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Quick Add Action Button (Royal Maroon / Dark Burgundy) */}
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock || isAdding}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: justAdded
                  ? 'var(--status-success)'
                  : isOutOfStock
                  ? 'var(--surface-subtle)'
                  : 'var(--brand-maroon)',
                color: isOutOfStock ? 'var(--muted-ink)' : '#FFFFFF',
                border: 'none',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
                flexShrink: 0,
                boxShadow: isOutOfStock ? 'none' : '0 2px 6px rgba(100, 28, 50, 0.25)',
              }}
              title={isOutOfStock ? 'Out of Stock' : justAdded ? 'Added to Bag!' : 'Add to Bag'}
              aria-label={`Add ${product.title} to bag`}
            >
              {justAdded ? <Check size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};
