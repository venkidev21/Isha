import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';

import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CategoriesPage } from './pages/CategoriesPage';

import { AboutPage } from './pages/static/AboutPage';
import { ContactPage } from './pages/static/ContactPage';
import { FaqPage } from './pages/static/FaqPage';
import { ShippingReturnsPage } from './pages/static/ShippingReturnsPage';
import { PrivacyPolicyPage, TermsOfServicePage } from './pages/static/PolicyPages';


// Scroll to top upon route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper for customer storefront
const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--canvas)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

// Focused screen-fit layout for Auth screens (Login / Register)
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--canvas)' }}>
      <header
        style={{
          height: '68px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          flexShrink: 0,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-maroon)',
              border: '1px solid var(--brand-gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-gold)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.15rem',
            }}
          >
            S
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--brand-maroon)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            ShopNest
          </span>
        </Link>

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.86rem',
            fontWeight: 600,
            color: 'var(--brand-maroon)',
            textDecoration: 'none',
            padding: '7px 16px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--brand-gold-border)',
            backgroundColor: 'var(--brand-gold-light)',
            transition: 'all 0.15s ease',
          }}
        >
          <ArrowLeft size={14} /> Back to Store
        </Link>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        {children}
      </main>

      <footer
        style={{
          padding: '16px 32px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--secondary-ink)',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span>&copy; {new Date().getFullYear()} ShopNest. Direct to Customer &bull; 100% Certified Genuine</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/privacy" style={{ color: 'var(--secondary-ink)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'var(--secondary-ink)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/contact" style={{ color: 'var(--secondary-ink)', textDecoration: 'none' }}>Concierge Support</Link>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Customer Facing Storefront */}
                <Route path="/" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
                <Route path="/catalogue" element={<StorefrontLayout><CataloguePage /></StorefrontLayout>} />
                <Route path="/categories" element={<StorefrontLayout><CategoriesPage /></StorefrontLayout>} />
                <Route path="/product/:slug" element={<StorefrontLayout><ProductDetailPage /></StorefrontLayout>} />
                <Route path="/cart" element={<StorefrontLayout><CartPage /></StorefrontLayout>} />
                <Route path="/checkout" element={<StorefrontLayout><CheckoutPage /></StorefrontLayout>} />
                <Route path="/order-confirmation/:orderNumber" element={<StorefrontLayout><OrderConfirmationPage /></StorefrontLayout>} />
                <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
                <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
                <Route path="/profile" element={<StorefrontLayout><ProfilePage /></StorefrontLayout>} />
                <Route path="/account/wishlist" element={<StorefrontLayout><WishlistPage /></StorefrontLayout>} />
                <Route path="/wishlist" element={<StorefrontLayout><WishlistPage /></StorefrontLayout>} />
                <Route path="/order/:id" element={<StorefrontLayout><OrderDetailPage /></StorefrontLayout>} />

                {/* Information & Support Pages */}
                <Route path="/about" element={<StorefrontLayout><AboutPage /></StorefrontLayout>} />
                <Route path="/contact" element={<StorefrontLayout><ContactPage /></StorefrontLayout>} />
                <Route path="/faq" element={<StorefrontLayout><FaqPage /></StorefrontLayout>} />
                <Route path="/shipping" element={<StorefrontLayout><ShippingReturnsPage initialTab="shipping" /></StorefrontLayout>} />
                <Route path="/returns" element={<StorefrontLayout><ShippingReturnsPage initialTab="returns" /></StorefrontLayout>} />
                <Route path="/privacy" element={<StorefrontLayout><PrivacyPolicyPage /></StorefrontLayout>} />
                <Route path="/terms" element={<StorefrontLayout><TermsOfServicePage /></StorefrontLayout>} />


                {/* Fallback */}
                <Route path="*" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
