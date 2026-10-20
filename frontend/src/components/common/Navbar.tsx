import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { siteSettings } from '../../config/siteSettings';
import { api } from '../../services/api';
import { Product, Category } from '../../types';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(siteSettings.announcement.enabled);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.categories.getAll().then(setCategories).catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.products.getAll({ search: searchQuery.trim(), limit: 5 });
        setSearchResults(res.products);
      } catch (err) {
        console.warn('Search query failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search & user menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* 1. Royal Announcement Strip (Deep Maroon with Ivory & Antique Gold) */}
      {isAnnouncementVisible && siteSettings.announcement.text && (
        <div
          style={{
            backgroundColor: 'var(--brand-burgundy)',
            color: 'var(--inverse-ink)',
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.03em',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            gap: '8px',
            borderBottom: '1px solid rgba(182, 154, 98, 0.25)',
          }}
        >
          <Sparkles size={13} color="var(--brand-gold)" />
          <span>{siteSettings.announcement.text}</span>
          <button
            onClick={() => setIsAnnouncementVisible(false)}
            aria-label="Dismiss announcement"
            style={{
              position: 'absolute',
              right: '16px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(250, 246, 239, 0.75)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--header-height)',
          gap: '24px',
        }}
      >
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink)',
            padding: '8px',
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo / Royal Crest & Wordmark */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--brand-maroon)',
              border: '1px solid var(--brand-gold-border)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-gold)',
              boxShadow: '0 2px 8px rgba(100, 28, 50, 0.25)',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--brand-maroon)',
                lineHeight: 1,
              }}
            >
              ShopNest
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                fontWeight: 700,
                lineHeight: 1,
                marginTop: '2px',
              }}
            >
              Royal Atelier
            </span>
          </div>
        </Link>

        {/* Primary Desktop Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav"
        >
          <Link
            to="/"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/') ? 700 : 500,
              color: isActive('/') ? 'var(--brand-maroon)' : 'var(--ink)',
              borderBottom: isActive('/') ? '2px solid var(--brand-gold)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all var(--transition-fast)',
            }}
          >
            Home
          </Link>
          <Link
            to="/catalogue"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/catalogue') ? 700 : 500,
              color: isActive('/catalogue') ? 'var(--brand-maroon)' : 'var(--ink)',
              borderBottom: isActive('/catalogue') ? '2px solid var(--brand-gold)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all var(--transition-fast)',
            }}
          >
            Shop
          </Link>
          <Link
            to="/categories"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/categories') ? 700 : 500,
              color: isActive('/categories') ? 'var(--brand-maroon)' : 'var(--ink)',
              borderBottom: isActive('/categories') ? '2px solid var(--brand-gold)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all var(--transition-fast)',
            }}
          >
            Categories
          </Link>
          <Link
            to="/about"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/about') ? 700 : 500,
              color: isActive('/about') ? 'var(--brand-maroon)' : 'var(--secondary-ink)',
              borderBottom: isActive('/about') ? '2px solid var(--brand-gold)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all var(--transition-fast)',
            }}
          >
            About
          </Link>
          <Link
            to="/contact"
            style={{
              fontSize: '0.9rem',
              fontWeight: isActive('/contact') ? 700 : 500,
              color: isActive('/contact') ? 'var(--brand-maroon)' : 'var(--secondary-ink)',
              borderBottom: isActive('/contact') ? '2px solid var(--brand-gold)' : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all var(--transition-fast)',
            }}
          >
            Contact
          </Link>
        </nav>

        {/* Search Bar with Autocomplete Dropdown */}
        <div ref={searchRef} style={{ position: 'relative', flex: '1', maxWidth: '360px' }} className="search-container">
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--brand-gold)" style={{ position: 'absolute', left: '14px' }} />
            <input
              type="text"
              placeholder="Search royal curated collections..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 40px',
                fontSize: '0.88rem',
                backgroundColor: 'var(--canvas)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-pill)',
                outline: 'none',
                color: 'var(--ink)',
                height: '40px',
                transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted-ink)',
                }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                backgroundColor: 'var(--surface)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                zIndex: 100,
              }}
            >
              {isSearching ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted-ink)' }}>
                  Searching royal collection...
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--brand-gold)',
                      marginBottom: '8px',
                      fontWeight: 700,
                    }}
                  >
                    Matching Selections ({searchResults.length})
                  </div>
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.slug}`}
                      onClick={() => setShowSearchDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <img
                        src={p.images[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80'}
                        alt={p.title}
                        style={{
                          width: '42px',
                          height: '42px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--border)',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            color: 'var(--ink)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {p.title}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--brand-maroon)', fontWeight: 700 }}>
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px' }}>
                    <button
                      onClick={handleSearchSubmit}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        padding: '6px',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        color: 'var(--brand-maroon)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      View all results <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--secondary-ink)' }}>
                  No curated finds matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Wishlist, Account & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Wishlist Link */}
          <Link
            to="/account/wishlist"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'var(--ink)',
              transition: 'background-color var(--transition-fast)',
            }}
            aria-label={`Saved Wishlist with ${wishlistCount} items`}
            title="Saved Wishlist"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Heart size={20} color="var(--ink)" />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: 'var(--brand-maroon)',
                  color: '#FFFFFF',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--surface)',
                }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Account Trigger */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--canvas)',
                    border: '1px solid var(--border)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    minHeight: '38px',
                  }}
                >
                  <UserIcon size={15} color="var(--brand-maroon)" />
                  <span>{user.firstName}</span>
                </button>

                {isUserMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '8px',
                      width: '220px',
                      backgroundColor: 'var(--surface)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 0',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--brand-gold)', fontWeight: 700 }}>
                        Patron Account
                      </div>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--ink)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2px',
                        }}
                      >
                        {user.email}
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        fontSize: '0.85rem',
                        color: 'var(--ink)',
                        fontWeight: 500,
                      }}
                    >
                      Orders & Addresses
                    </Link>
                    <Link
                      to="/account/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        fontSize: '0.85rem',
                        color: 'var(--ink)',
                        fontWeight: 500,
                      }}
                    >
                      Saved Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        fontSize: '0.85rem',
                        color: 'var(--status-error)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderTop: '1px solid var(--border)',
                        marginTop: '4px',
                        fontWeight: 600,
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--brand-maroon)',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--brand-gold-border)',
                  backgroundColor: 'var(--brand-gold-light)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <UserIcon size={15} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={openCart}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-maroon)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(100, 28, 50, 0.25)',
              transition: 'transform var(--transition-fast), background-color var(--transition-fast)',
            }}
            aria-label={`Shopping bag with ${itemCount} items`}
            title="Open Shopping Bag"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-burgundy)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--brand-maroon)')}
          >
            <ShoppingBag size={18} color="#FFFFFF" />
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: 'var(--brand-gold)',
                  color: '#FFFFFF',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--surface)',
                }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-lg)',
          }}
          className="mobile-menu-pane"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Link
              to="/catalogue"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-maroon)' }}
            >
              Shop All Collections
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}
            >
              Browse Categories
            </Link>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', padding: '6px 0' }}>
              {categories.slice(0, 8).map((c) => (
                <Link
                  key={c.id}
                  to={`/catalogue?category=${c.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)' }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />
            <Link
              to="/account/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: '0.9rem', color: 'var(--secondary-ink)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Heart size={16} color="var(--brand-gold)" />
              Saved Wishlist ({wishlistCount})
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: '0.9rem', color: 'var(--secondary-ink)' }}
            >
              About ShopNest
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: '0.9rem', color: 'var(--secondary-ink)' }}
            >
              Concierge & Support
            </Link>
            <Link
              to="/shipping"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: '0.9rem', color: 'var(--secondary-ink)' }}
            >
              Shipping & Policies
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .search-container { max-width: 220px !important; }
        }
        @media (max-width: 640px) {
          .search-container { display: none !important; }
        }
      `}</style>
    </header>
  );
};
