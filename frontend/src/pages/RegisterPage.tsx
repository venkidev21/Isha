import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, User, ShoppingBag, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleAuthButton } from '../components/common/GoogleAuthButton';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMsg('Password must contain at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      toast.success('Your customer account was registered successfully!');
      navigate('/profile');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
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
        {/* Left Pane: Register Form */}
        <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <span className="heritage-tag" style={{ marginBottom: '10px' }}>
              <Sparkles size={11} color="var(--brand-gold)" /> Patron Membership
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
              Create Patron Account
            </h1>
            <p style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem', margin: 0 }}>
              Join ShopNest for express checkout, order history, and exclusive invitations
            </p>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.84rem', marginBottom: '3px' }}>First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Priya"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ borderRadius: 'var(--radius-sm)', height: '42px', fontSize: '0.9rem' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.84rem', marginBottom: '3px' }}>Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Sharma"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ borderRadius: 'var(--radius-sm)', height: '42px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.84rem', marginBottom: '3px' }}>Email Address *</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: 'var(--radius-sm)', height: '42px', fontSize: '0.9rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.84rem', marginBottom: '3px' }}>Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ borderRadius: 'var(--radius-sm)', height: '42px', fontSize: '0.9rem' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.84rem', marginBottom: '3px' }}>Password (min 8 characters) *</label>
              <input
                type="password"
                required
                placeholder="Create secure password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderRadius: 'var(--radius-sm)', height: '42px', fontSize: '0.9rem' }}
              />
            </div>

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
                marginTop: '6px',
              }}
            >
              {isLoading ? 'Creating Account...' : 'Register Patron Account'}
            </button>

            {/* Divider OR */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', color: 'var(--muted-ink)', fontSize: '0.75rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              <span style={{ padding: '0 12px', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            </div>

            <GoogleAuthButton
              buttonText="Sign up with Google"
              onSuccess={() => navigate('/profile')}
            />

            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.86rem', color: 'var(--secondary-ink)' }}>
              Already a patron member?{' '}
              <Link to="/login" style={{ color: 'var(--brand-maroon)', fontWeight: 700, textDecoration: 'none' }}>
                Sign in here
              </Link>
            </div>
          </form>
        </div>

        {/* Right Pane: Warm Lifestyle Image */}
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
              ShopNest Community
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
              Curated living.<br />
              <span style={{ color: 'var(--brand-maroon)' }}>Tailored for you.</span>
            </h2>
          </div>

          <div style={{ position: 'relative', marginTop: '24px' }}>
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80"
              alt="Lifestyle shopping experience"
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
              <CheckCircle2 size={16} color="var(--status-success)" /> 30-Day Courtesy Returns
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--ink)', fontWeight: 600 }}>
              <ShieldCheck size={16} color="var(--brand-maroon)" /> 100% Data Encrypted
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
