import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@eesha.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      toast.success('Admin authentication verified');
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid administrator credentials');
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const autoFillAdmin = () => {
    setEmail('admin@eesha.com');
    setPassword('AdminPassword123!');
  };

  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '32px 28px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '18px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--brand-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <ShoppingBag size={20} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink)' }}>ShopNest</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
            Admin Portal Login
          </h1>
          <p style={{ color: 'var(--secondary-ink)', fontSize: '0.85rem', margin: 0 }}>
            Sign in with administrator privileges to manage the store
          </p>
        </div>

        {/* 1-Click Demo Fill */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>
            <UserCheck size={16} color="var(--brand-blue)" /> Demo Credentials:
          </div>
          <button
            type="button"
            onClick={autoFillAdmin}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
          >
            Autofill Admin
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '0.85rem',
              marginBottom: '20px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '38px', borderRadius: '10px' }}
              />
              <Mail size={16} color="var(--muted-ink)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px', borderRadius: '10px' }}
              />
              <Lock size={16} color="var(--muted-ink)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              fontSize: '0.98rem',
              fontWeight: 700,
              marginTop: '8px',
            }}
          >
            {isLoading ? 'Verifying...' : 'Sign in to Admin Dashboard'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '24px', fontSize: '0.78rem', color: 'var(--muted-ink)' }}>
          <ShieldCheck size={14} color="#15803D" />
          <span>Connected directly to Backend API &bull; port 5000</span>
        </div>
      </div>
    </div>
  );
};
