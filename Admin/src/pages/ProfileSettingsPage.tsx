import React, { useState } from 'react';
import { Camera, Lock, User, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';

export const ProfileSettingsPage: React.FC = () => {
  const { user } = useAdminAuth();
  const toast = useToast();

  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}` : 'Venkatesan E');
  const [email, setEmail] = useState(user?.email || 'admin@eesha.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState('123, Gandhi Street, Erode');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Admin profile settings updated');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter both passwords');
      return;
    }
    toast.success('Admin password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
          Profile Information
        </h1>
        <p style={{ color: 'var(--secondary-ink)', fontSize: '0.9rem' }}>
          Manage your administrator credentials and platform notifications.
        </p>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        {/* Avatar (Screen 16) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-navy)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 700,
              }}
            >
              {user ? user.firstName[0] : 'V'}
            </div>
            <button
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-blue)',
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Change photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)' }}>{name}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--secondary-ink)' }}>{email}</div>
            <span style={{ display: 'inline-block', fontSize: '0.72rem', backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginTop: '4px' }}>
              Super Admin
            </span>
          </div>
        </div>

        {/* Profile Form (Screen 16) */}
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', borderRadius: '10px' }}>
              Save Changes
            </button>
          </div>
        </form>

        {/* Change Password (Screen 16) */}
        <div style={{ paddingTop: '28px', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
            Change Password
          </h3>
          <form onSubmit={handleUpdatePassword} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ padding: '12px 20px', borderRadius: '10px', minHeight: '44px' }}
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
