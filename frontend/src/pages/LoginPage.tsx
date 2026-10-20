import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleAuthButton } from '../components/common/GoogleAuthButton';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      toast.success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials');
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const autoFillCustomer = () => {
    setEmail('customer@shopnest.com');
    setPassword('CustomerPassword123!');
  };

  return (
    <div style={{ width: '100%', maxWidth: '940px', margin: '0 auto' }}>
      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          boxShadow: 'var(--shadow-md)',
        }}
        className="auth-split-card"
      >
        {/* Left Pane: Form */}
        <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <span className="heritage-tag" style={{ marginBottom: '10px' }}>
              <Sparkles size={11} color="var(--brand-gold)" /> Patron Concierge
            </span>
            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 700,
                color: 'var(--ink)',
                marginBottom: '6px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Welcome Back
            </h1>
            <p style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem', margin: 0 }}>
              Sign in to manage your orders, saved wishlist, and concierge profile
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--brand-gold-light)',
              border: '1px solid var(--brand-gold-border)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--brand-maroon)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={14} color="var(--brand-maroon)" /> Demo Patron Access:
            </div>
            <button
              type="button"
              onClick={autoFillCustomer}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--radius-pill)', color: 'var(--brand-maroon)' }}
            >
              Autofill Credentials
            </button>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--status-error-bg)',
                border: '1px solid rgba(180, 35, 54, 0.25)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--status-error)',
                fontSize: '0.84rem',
                marginBottom: '16px',
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.84rem', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}
                />
                <Mail size={16} color="var(--muted-ink)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ fontSize: '0.84rem', margin: 0 }}>
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Password recovery link sent if email exists.');
                  }}
                  style={{ color: 'var(--brand-maroon)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600 }}
                >
                  Forgot?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}
                />
                <Lock size={16} color="var(--muted-ink)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.84rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--ink)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--brand-maroon)', width: '16px', height: '16px' }}
                />
                <span>Remember me on this secure device</span>
              </label>
            </div>

            {/* Royal Maroon Login CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.96rem',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In to Account'}
            </button>

            {/* Divider OR */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', color: 'var(--muted-ink)', fontSize: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              <span style={{ padding: '0 12px', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            </div>

            {/* Social Google */}
            <GoogleAuthButton
              buttonText="Continue with Google"
              onSuccess={() => navigate(from, { replace: true })}
              onDemoFallback={autoFillCustomer}
            />

            {/* Link to Register */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.86rem', color: 'var(--secondary-ink)' }}>
              Don't have a patron account?{' '}
              <Link to="/register" style={{ color: 'var(--brand-maroon)', fontWeight: 700, textDecoration: 'none' }}>
                Register Here
              </Link>
            </div>
          </form>
        </div>

        {/* Right Pane: Warm Editorial Visual */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#F8F3EA',
            borderLeft: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '40px',
            overflow: 'hidden',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--brand-gold)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              ShopNest Heritage
            </span>
            <h2
              style={{
                fontSize: '1.9rem',
                fontWeight: 700,
                color: 'var(--ink)',
                lineHeight: 1.25,
                margin: 0,
                fontFamily: 'var(--font-heading)',
              }}
            >
              Considered finds.<br />
              <span style={{ color: 'var(--brand-maroon)' }}>Tailored living.</span>
            </h2>
          </div>

          <div style={{ position: 'relative', marginTop: '24px' }}>
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
              alt="Artisan crafted timepieces and lifestyle objects"
              style={{
                width: '100%',
                height: '240px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="var(--status-success)" /> 100% Genuine
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>
              <ShieldCheck size={16} color="var(--brand-maroon)" /> Insured Transit
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .auth-split-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
