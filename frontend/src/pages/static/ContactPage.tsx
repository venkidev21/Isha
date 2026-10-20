import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { siteSettings } from '../../config/siteSettings';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable async submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Your message has been received! Our concierge team will respond within 24 business hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderNumber: '',
        category: 'General Inquiry',
        subject: '',
        message: '',
      });
    }, 600);
  };

  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '100vh', padding: '48px 0 88px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)', marginBottom: '24px' }}>
          <Link to="/" style={{ color: 'var(--secondary-ink)' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Contact & Support</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '48px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              marginBottom: '12px',
            }}
          >
            Customer Concierge & Support
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--secondary-ink)', maxWidth: '640px', lineHeight: 1.6 }}>
            Have a question regarding order tracking, product specifications, bulk business purchases, or returns? We are here to assist.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '48px' }} className="contact-grid">
          {/* Left Column: Contact Details Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} color="var(--primary-cta)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>Email Support</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary-ink)' }}>Expected reply within 4 hours</span>
                </div>
              </div>
              <a href={`mailto:${siteSettings.contact.email}`} style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-cta)' }}>
                {siteSettings.contact.email}
              </a>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} color="var(--primary-cta)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>Direct Telephone</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary-ink)' }}>Toll-Free in India</span>
                </div>
              </div>
              <a href={`tel:${siteSettings.contact.phone.replace(/[^0-9+]/g, '')}`} style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>
                {siteSettings.contact.phone}
              </a>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={20} color="var(--primary-cta)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>Operating Hours</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary-ink)' }}>Indian Standard Time (IST)</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-ink)', margin: 0 }}>
                {siteSettings.contact.hours}
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} color="var(--primary-cta)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>Headquarters & Logistics</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary-ink)' }}>Karnataka, India</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-ink)', lineHeight: 1.5, margin: 0 }}>
                {siteSettings.contact.address}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="card" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <MessageSquare size={22} color="var(--primary-cta)" />
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Send a Message</h2>
            </div>

            {submitted ? (
              <div
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  backgroundColor: 'var(--accent-tint)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                }}
              >
                <CheckCircle2 size={44} color="var(--primary-cta)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Thank You for Reaching Out</h3>
                <p style={{ color: 'var(--secondary-ink)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Your inquiry has been logged in our system. A concierge representative will review your message and reply to your email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Your Name <span className="required">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Order Reference (If Applicable)</label>
                    <input
                      type="text"
                      placeholder="e.g. SHOPNEST-123456"
                      className="form-input"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Inquiry Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Status & Delivery">Order Status & Delivery</option>
                    <option value="Returns & Refunds">Returns & Refunds</option>
                    <option value="Product Specifications">Product Specifications</option>
                    <option value="Corporate / Bulk Purchases">Corporate / Bulk Purchases</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    placeholder="Brief summary of your inquiry"
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message Details <span className="required">*</span></label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we assist you today? Please include any pertinent details..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-full btn-lg"
                  style={{ marginTop: '8px', minHeight: '48px' }}
                >
                  {isSubmitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Send size={18} /> Submit Inquiry
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .contact-grid { grid-templateColumns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
