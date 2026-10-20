import React from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  BarChart3,
  Store,
  User as UserIcon,
  LogOut,
  Search,
  Bell,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--canvas)' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--secondary-ink)' }}>
          Authenticating ShopNest Admin Session...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/products', label: 'Products', icon: <Package size={18} /> },
    { to: '/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { to: '/categories', label: 'Categories', icon: <Layers size={18} /> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { to: '/seller', label: 'Seller Portal', icon: <Store size={18} /> },
    { to: '/profile', label: 'Profile Settings', icon: <UserIcon size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--canvas)' }}>
      {/* 1. DARK NAVY SIDEBAR (Screens 11-16) */}
      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--sidebar-bg)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          borderRight: '1px solid var(--sidebar-border)',
          zIndex: 100,
        }}
        className="admin-sidebar"
      >
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--sidebar-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--brand-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <ShoppingBag size={18} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>ShopNest</span>
          </div>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94A3B8', marginTop: '6px' }}>
            Administrative Panel
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'var(--brand-blue)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.15s ease',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Bar */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--sidebar-border)', backgroundColor: '#0B1120' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F1F5F9', marginBottom: '2px' }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#60A5FA',
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={14} /> Open Storefront (5173)
            </a>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#F87171',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 90,
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} color="var(--muted-ink)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search in admin records..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                fontSize: '0.85rem',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                outline: 'none',
              }}
            />
          </div>

          {/* Right Profile Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--secondary-ink)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-navy)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {user?.firstName[0] || 'A'}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                  {user?.firstName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 600 }}>
                  Administrator
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar { width: 70px !important; }
          .admin-sidebar span { display: none !important; }
        }
      `}</style>
    </div>
  );
};
