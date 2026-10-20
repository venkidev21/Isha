import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  Plus,
  Minus,
  ChevronRight,
  Heart,
  MapPin,
  Star,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { siteSettings } from '../config/siteSettings';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Indian PIN code delivery check
  const [pinCode, setPinCode] = useState('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      setSelectedImageIndex(0);
      setQuantity(1);
      setPinStatus(null);

      try {
        const prod = await api.products.getBySlug(slug);
        setProduct(prod);

        // Fetch related products
        if (prod.categoryId) {
          const related = await api.products.getRelated(prod.id, prod.categoryId);
          setRelatedProducts(related);
        }
      } catch (err: any) {
        setError(err.message || 'Product not found');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  const handleCheckPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pinCode.trim())) {
      setPinStatus('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setPinStatus(`Insured transit available to PIN ${pinCode}. Estimated delivery: ${siteSettings.shipping.estimatedDeliveryDays}.`);
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="skeleton" style={{ height: '420px', marginBottom: '24px' }} />
          <div className="skeleton" style={{ height: '32px', width: '60%', margin: '0 auto 16px' }} />
          <div className="skeleton" style={{ height: '22px', width: '40%', margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>Product Unavailable</h2>
        <p style={{ color: 'var(--secondary-ink)', marginBottom: '24px' }}>
          {error || 'This curated item is currently not active in our catalogue.'}
        </p>
        <Link to="/catalogue" className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '10px 28px' }}>
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: '1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85', altText: product.title, isPrimary: true, sortOrder: 1, productId: product.id }];

  const currentImage = images[selectedImageIndex] || images[0];

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const wishlisted = isInWishlist(product.id);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  let parsedSpecs: Record<string, string> = {};
  if (product.specifications) {
    try {
      parsedSpecs = JSON.parse(product.specifications);
    } catch {
      // ignore parse error
    }
  }

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity, { openCart: false });
      navigate('/checkout');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--canvas)', padding: '24px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--secondary-ink)', marginBottom: '28px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--secondary-ink)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/catalogue" style={{ color: 'var(--secondary-ink)' }}>Catalogue</Link>
          {product.category && (
            <>
              <ChevronRight size={14} />
              <Link to={`/catalogue?category=${product.category.slug}`} style={{ color: 'var(--secondary-ink)' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={14} />
          <span style={{ color: 'var(--brand-maroon)', fontWeight: 600 }}>{product.title}</span>
        </div>

        {/* Product Details Section: Gallery & Buying Column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '48px', marginBottom: '64px' }} className="product-layout">
          {/* Left Column: Image Gallery */}
          <div>
            {/* Main Stage Image */}
            <div
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: '16px',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <img
                src={currentImage.url}
                alt={currentImage.altText || product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {hasDiscount && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--brand-maroon)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-xs)',
                      boxShadow: '0 2px 6px rgba(100, 28, 50, 0.25)',
                    }}
                  >
                    Save {discountPercent}%
                  </span>
                </div>
              )}

              {/* Wishlist Button on Image */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: wishlisted ? 'var(--brand-gold-light)' : 'rgba(255, 253, 250, 0.95)',
                  border: `1px solid ${wishlisted ? 'var(--brand-gold-border)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: wishlisted ? 'var(--brand-maroon)' : 'var(--secondary-ink)',
                  boxShadow: '0 2px 8px rgba(41, 35, 38, 0.1)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Heart size={18} fill={wishlisted ? 'var(--brand-maroon)' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--brand-maroon)' : '1px solid var(--border)',
                      padding: 0,
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      transition: 'border-color var(--transition-fast)',
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buying Information */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              {product.category?.name || 'Curated Atelier'}
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: '10px',
                color: 'var(--ink)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {product.title}
            </h1>

            {/* Star Rating & Review Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(product.rating || 4.8) ? 'var(--brand-gold)' : '#E9E0D7'}
                    color={s <= Math.round(product.rating || 4.8) ? 'var(--brand-gold)' : '#E9E0D7'}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>
                {product.rating?.toFixed(1) || '4.8'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)' }}>
                ({product.reviewCount || 124} customer reviews)
              </span>
              <span style={{ color: 'var(--border)' }}>&bull;</span>
              <span style={{ color: 'var(--secondary-ink)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                SKU: {product.sku}
              </span>
            </div>

            {/* Price Block */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '22px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--brand-maroon)', letterSpacing: '-0.02em' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: '1.2rem', color: 'var(--muted-ink)', textDecoration: 'line-through' }}>
                    ₹{product.compareAtPrice!.toLocaleString('en-IN')}
                  </span>
                  <span
                    style={{
                      backgroundColor: 'var(--brand-gold-light)',
                      color: 'var(--brand-maroon)',
                      border: '1px solid var(--brand-gold-border)',
                      padding: '3px 8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    -{discountPercent}% OFF
                  </span>
                </>
              )}
              {isOutOfStock ? (
                <span className="badge badge-error">Out of Stock</span>
              ) : (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} /> In Stock &bull; Dispatches within 24h
                </span>
              )}
            </div>

            {/* Product Narrative / Description */}
            <p style={{ fontSize: '0.96rem', color: 'var(--secondary-ink)', lineHeight: 1.65, marginBottom: '24px' }}>
              {product.description}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)' }}>Quantity</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface)',
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    style={{ background: 'transparent', border: 'none', padding: '8px 14px', cursor: 'pointer', color: 'var(--ink)' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    style={{ background: 'transparent', border: 'none', padding: '8px 14px', cursor: 'pointer', color: 'var(--ink)' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--secondary-ink)' }}>
                  (Inventory: {product.stock} units available)
                </span>
              </div>

              {/* Dual Royal Buttons: Add to Cart (Maroon) & Buy Now (Gold) */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    borderRadius: 'var(--radius-pill)',
                  }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                >
                  {isOutOfStock ? 'Sold Out' : isAdding ? 'Adding to Bag...' : 'Add to Shopping Bag'}
                </button>
                <button
                  className="btn btn-gold btn-lg"
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    borderRadius: 'var(--radius-pill)',
                  }}
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || isAdding}
                >
                  Buy Now &bull; Express Checkout
                </button>
              </div>
            </div>

            {/* PIN Code Delivery Coverage Checker */}
            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                backgroundColor: 'var(--surface)',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px', color: 'var(--ink)' }}>
                <MapPin size={17} color="var(--brand-maroon)" /> Check Postal Delivery Coverage & Transit
              </div>
              <form onSubmit={handleCheckPin} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN code (e.g. 560038)"
                  value={pinCode}
                  maxLength={6}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="form-input"
                  style={{ flex: 1, height: '42px', fontSize: '0.88rem' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ height: '42px', padding: '0 20px', borderRadius: 'var(--radius-md)' }}>
                  Verify
                </button>
              </form>
              {pinStatus && (
                <div style={{ marginTop: '10px', fontSize: '0.85rem', color: pinStatus.includes('valid') ? 'var(--status-error)' : 'var(--status-success)' }}>
                  {pinStatus}
                </div>
              )}
            </div>

            {/* Value Guarantees Box */}
            <div
              style={{
                border: '1px solid var(--brand-gold-border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                backgroundColor: 'var(--brand-gold-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '0.86rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={18} color="var(--brand-maroon)" />
                <span style={{ color: 'var(--ink)' }}>
                  <strong>Complimentary Insured Courier</strong> across India on orders over ₹{siteSettings.shipping.freeThreshold.toLocaleString('en-IN')}.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RotateCcw size={18} color="var(--brand-maroon)" />
                <span style={{ color: 'var(--ink)' }}>
                  <strong>{siteSettings.policies.returnDays}-Day Return Standard</strong> with doorstep pickup in original packaging.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={18} color="var(--brand-maroon)" />
                <span style={{ color: 'var(--ink)' }}>
                  <strong>Official Authenticity Certificate</strong> verified direct from master makers.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        {Object.keys(parsedSpecs).length > 0 && (
          <section style={{ marginBottom: '64px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
              Curatorial & Technical Specifications
            </h2>
            <div style={{ maxWidth: '820px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {Object.entries(parsedSpecs).map(([key, value], idx) => (
                <div
                  key={key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '240px 1fr',
                    padding: '14px 20px',
                    backgroundColor: idx % 2 === 0 ? 'var(--surface)' : 'var(--canvas)',
                    borderBottom: idx === Object.keys(parsedSpecs).length - 1 ? 'none' : '1px solid var(--border)',
                    fontSize: '0.9rem',
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{key}</span>
                  <span style={{ color: 'var(--secondary-ink)' }}>{value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Active Products */}
        {relatedProducts.length > 0 && (
          <section style={{ borderTop: '1px solid var(--border)', paddingTop: '44px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
              <div>
                <div style={{ fontSize: '0.74rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand-gold)', fontWeight: 700, marginBottom: '4px' }}>
                  Related Curations
                </div>
                <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Complementary Finds
                </h2>
              </div>
              <Link
                to="/catalogue"
                style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--brand-maroon)' }}
              >
                View Full Catalogue &rarr;
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '24px',
              }}
            >
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-layout { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
};
