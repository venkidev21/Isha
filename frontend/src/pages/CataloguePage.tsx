import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/product/ProductCard';

export const CataloguePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Filters from URL
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sortBy') || 'featured';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Local draft states for price inputs
  const [minPriceDraft, setMinPriceDraft] = useState(currentMinPrice);
  const [maxPriceDraft, setMaxPriceDraft] = useState(currentMaxPrice);

  useEffect(() => {
    api.categories.getAll().then(setCategories).catch(() => {});
  }, []);

  const handleCategoryScroll = () => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    setShowRightFade(scrollLeft + clientWidth < scrollWidth - 12);
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.products.getAll({
        search: currentSearch || undefined,
        category: currentCategory || undefined,
        sortBy: currentSort,
        minPrice: currentMinPrice ? parseFloat(currentMinPrice) : undefined,
        maxPrice: currentMaxPrice ? parseFloat(currentMaxPrice) : undefined,
        inStock: currentInStock || undefined,
        page: currentPage,
        limit: 12,
      });
      setProducts(res.products);
      setTotalCount(res.total);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to query products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCategory, currentSearch, currentSort, currentMinPrice, currentMaxPrice, currentInStock, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setMinPriceDraft('');
    setMaxPriceDraft('');
    setSearchParams({});
  };

  const applyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPriceDraft) newParams.set('minPrice', minPriceDraft);
    else newParams.delete('minPrice');
    if (maxPriceDraft) newParams.set('maxPrice', maxPriceDraft);
    else newParams.delete('maxPrice');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentSearch || currentMinPrice || currentMaxPrice || currentInStock || currentSort !== 'featured'
  );

  return (
    <div
      style={{
        backgroundColor: 'var(--canvas)',
        minHeight: '85vh',
        paddingTop: 'clamp(28px, 4vw, 48px)',
        paddingBottom: 'clamp(88px, 12vw, 128px)',
      }}
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              fontSize: '0.74rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--brand-gold)',
              fontWeight: 700,
              marginBottom: '6px',
            }}
          >
            Archive &bull; All Departments
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.85rem)',
                  letterSpacing: '-0.02em',
                  marginBottom: '6px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--ink)',
                }}
              >
                Curated Marketplace
              </h1>
              <p style={{ color: 'var(--secondary-ink)', fontSize: '0.94rem', margin: 0 }}>
                Showing {totalCount} authentic items
                {currentCategory && categories.find((c) => c.slug === currentCategory) && (
                  <span> in <strong style={{ color: 'var(--brand-maroon)' }}>{categories.find((c) => c.slug === currentCategory)?.name}</strong></span>
                )}
                {currentSearch && <span> matching "<strong style={{ color: 'var(--brand-maroon)' }}>{currentSearch}</strong>"</span>}
              </p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="btn btn-secondary mobile-filter-btn"
              style={{ display: 'none' }}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={15} /> Filters & Sorting
            </button>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '24px',
              padding: '12px 18px',
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Filters:
            </span>
            {currentCategory && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--brand-gold-light)',
                  color: 'var(--brand-maroon)',
                  border: '1px solid var(--brand-gold-border)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Dept: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateFilter('category', null)} />
              </span>
            )}
            {currentSearch && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--brand-gold-light)',
                  color: 'var(--brand-maroon)',
                  border: '1px solid var(--brand-gold-border)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Search: "{currentSearch}"
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateFilter('search', null)} />
              </span>
            )}
            {currentMinPrice && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--brand-gold-light)',
                  color: 'var(--brand-maroon)',
                  border: '1px solid var(--brand-gold-border)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Min: ₹{currentMinPrice}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => { setMinPriceDraft(''); updateFilter('minPrice', null); }} />
              </span>
            )}
            {currentMaxPrice && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--brand-gold-light)',
                  color: 'var(--brand-maroon)',
                  border: '1px solid var(--brand-gold-border)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Max: ₹{currentMaxPrice}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => { setMaxPriceDraft(''); updateFilter('maxPrice', null); }} />
              </span>
            )}
            {currentInStock && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--brand-gold-light)',
                  color: 'var(--brand-maroon)',
                  border: '1px solid var(--brand-gold-border)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                In Stock Only
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateFilter('inStock', null)} />
              </span>
            )}
            {currentSort !== 'featured' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--brand-gold-light)',
                  color: 'var(--brand-maroon)',
                  border: '1px solid var(--brand-gold-border)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Sort: {currentSort}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateFilter('sortBy', null)} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                color: 'var(--brand-maroon)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset All
            </button>
          </div>
        )}

        {/* Horizontal Category Strip */}
        <div className="category-nav-wrapper" style={{ marginBottom: '28px' }}>
          <div
            ref={categoryScrollRef}
            onScroll={handleCategoryScroll}
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '12px',
              WebkitOverflowScrolling: 'touch',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <button
              onClick={() => updateFilter('category', null)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.86rem',
                fontWeight: currentCategory === '' ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: currentCategory === '' ? '1px solid var(--brand-maroon)' : '1px solid var(--border)',
                backgroundColor: currentCategory === '' ? 'var(--brand-maroon)' : 'var(--surface)',
                color: currentCategory === '' ? '#FFFFFF' : 'var(--secondary-ink)',
                transition: 'all var(--transition-fast)',
                flexShrink: 0,
              }}
            >
              All Departments
            </button>
            {categories.map((cat) => {
              const isSelected = currentCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', isSelected ? null : cat.slug)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.86rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: isSelected ? '1px solid var(--brand-maroon)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--brand-maroon)' : 'var(--surface)',
                    color: isSelected ? '#FFFFFF' : 'var(--secondary-ink)',
                    transition: 'all var(--transition-fast)',
                    flexShrink: 0,
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Filter Drawer / Collapsible Box */}
        {isMobileFilterOpen && (
          <div
            className="card"
            style={{
              padding: '20px',
              marginBottom: '24px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--brand-gold-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--brand-maroon)' }}>Filter & Sorting Options</div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--secondary-ink)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Sort Order</label>
              <select
                className="form-select"
                value={currentSort}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
              >
                <option value="featured">Editorial Curation</option>
                <option value="newest">New Arrivals First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <form onSubmit={applyPriceFilter} style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Price Range (₹)</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="number"
                  placeholder="Min"
                  className="form-input"
                  value={minPriceDraft}
                  onChange={(e) => setMinPriceDraft(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="form-input"
                  value={maxPriceDraft}
                  onChange={(e) => setMaxPriceDraft(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Apply Price Range
              </button>
            </form>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : null)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--brand-maroon)' }}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        )}

        {/* Layout Grid: Sidebar + Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px' }} className="catalogue-layout">
          {/* Desktop Filters Sidebar */}
          <aside className="catalogue-sidebar">
            {/* Category Navigation List */}
            <div style={{ marginBottom: '28px' }}>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--brand-gold)',
                  marginBottom: '14px',
                }}
              >
                Departments
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  onClick={() => updateFilter('category', null)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    fontWeight: currentCategory === '' ? 700 : 500,
                    backgroundColor: currentCategory === '' ? 'var(--brand-gold-light)' : 'transparent',
                    color: currentCategory === '' ? 'var(--brand-maroon)' : 'var(--ink)',
                    border: currentCategory === '' ? '1px solid var(--brand-gold-border)' : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((c) => {
                  const active = currentCategory === c.slug;
                  return (
                    <button
                      key={c.id}
                      onClick={() => updateFilter('category', active ? null : c.slug)}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: active ? 700 : 500,
                        backgroundColor: active ? 'var(--brand-gold-light)' : 'transparent',
                        color: active ? 'var(--brand-maroon)' : 'var(--secondary-ink)',
                        border: active ? '1px solid var(--brand-gold-border)' : '1px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <span>{c.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-ink)' }}>{c.productCount ?? ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>
                  <Filter size={15} color="var(--brand-gold)" /> Filter By Price
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '0.78rem',
                      color: 'var(--brand-maroon)',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>

              <form onSubmit={applyPriceFilter} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Min ₹"
                    className="form-input"
                    value={minPriceDraft}
                    onChange={(e) => setMinPriceDraft(e.target.value)}
                    style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                  />
                  <span style={{ color: 'var(--secondary-ink)' }}>—</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    className="form-input"
                    value={maxPriceDraft}
                    onChange={(e) => setMaxPriceDraft(e.target.value)}
                    style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                  />
                </div>
                <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%', borderRadius: 'var(--radius-pill)' }}>
                  Apply Price
                </button>
              </form>
            </div>

            {/* Availability Filter */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '24px' }}>
              <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
                Availability
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={currentInStock}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : null)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--brand-maroon)', cursor: 'pointer' }}
                />
                <span>In Stock only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main style={{ minWidth: 0 }}>
            {/* Top Promo Banner with Royal Editorial Styling */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#F8F3EA',
                border: '1px solid var(--brand-gold-border)',
                padding: '28px 32px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                <span className="heritage-tag" style={{ marginBottom: '8px' }}>
                  <Sparkles size={11} color="var(--brand-gold)" /> Guaranteed Authenticity
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '6px 0', color: 'var(--ink)', fontFamily: 'var(--font-heading)' }}>
                  Excellence in Every Discipline
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--secondary-ink)', margin: '0 0 16px', maxWidth: '440px' }}>
                  Directly dispatched from certified ateliers and verified manufacturers across India.
                </p>
                <button
                  onClick={() => clearAllFilters()}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 'var(--radius-pill)', padding: '7px 20px' }}
                >
                  Explore All Finds
                </button>
              </div>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"
                alt="Curated products"
                style={{ width: '110px', height: '100px', objectFit: 'contain' }}
              />
            </div>

            {/* Sort & Count Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--secondary-ink)' }}>
                Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> authenticated items
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)' }}>Sort by:</span>
                <select
                  className="form-select"
                  value={currentSort}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  style={{ width: 'auto', padding: '6px 14px', fontSize: '0.85rem', height: '38px', borderRadius: 'var(--radius-pill)' }}
                >
                  <option value="featured">Editorial Curation</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="card" style={{ height: '400px', overflow: 'hidden' }}>
                    <div className="skeleton" style={{ height: '270px' }} />
                    <div style={{ padding: '16px' }}>
                      <div className="skeleton" style={{ height: '12px', width: '35%', marginBottom: '8px' }} />
                      <div className="skeleton" style={{ height: '18px', width: '85%', marginBottom: '12px' }} />
                      <div className="skeleton" style={{ height: '16px', width: '30%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '72px 24px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'var(--brand-maroon)',
                  }}
                >
                  <Search size={26} />
                </div>
                <h3 style={{ marginBottom: '8px', fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
                  No Matching Finds in Catalogue
                </h3>
                <p style={{ color: 'var(--secondary-ink)', maxWidth: '440px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
                  We could not find any items matching your exact filter criteria. Try adjusting your search query or expanding the price range.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-pill)', padding: '10px 24px' }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                {/* 2. Structured, balanced Product Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '24px',
                    marginBottom: '40px',
                  }}
                >
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '48px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: 'var(--radius-pill)' }}
                      onClick={() => updateFilter('page', String(currentPage - 1))}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <span style={{ fontSize: '0.88rem', color: 'var(--secondary-ink)' }}>
                      Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: 'var(--radius-pill)' }}
                      onClick={() => updateFilter('page', String(currentPage + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .catalogue-layout { grid-template-columns: 1fr !important; }
          .catalogue-sidebar { display: none !important; }
          .mobile-filter-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
};
