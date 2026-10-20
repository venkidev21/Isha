import React from 'react';
import { Link } from 'react-router-dom';
import { siteSettings } from '../../config/siteSettings';
import { ShieldCheck, Lock, FileText, Scale } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '100vh', padding: '48px 0 88px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <nav style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)', marginBottom: '24px' }}>
          <Link to="/" style={{ color: 'var(--secondary-ink)' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Privacy & Data Protection</span>
        </nav>

        <header style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Lock size={24} color="var(--primary-cta)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-cta)' }}>
              Legal & Privacy
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--ink)', marginBottom: '12px' }}>
            ShopNest Privacy & Cookie Policy
          </h1>
          <p style={{ color: 'var(--secondary-ink)', fontSize: '0.95rem' }}>
            Last revised: October 2026 &bull; Compliant with Indian Digital Personal Data Protection Act (DPDPA) & global standards.
          </p>
        </header>

        <div className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px', color: 'var(--secondary-ink)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>1. Information We Collect</h2>
            <p>
              When you purchase products or create an account on <strong>ShopNest</strong>, we collect necessary transactional information: your full name, email address, telephone number, and physical delivery address. We never collect or store sensitive raw financial credentials (such as complete credit card numbers or PINs); all payment processing is handled through PCI-DSS certified gateway adapters.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>2. How We Utilize Your Data</h2>
            <p>Your personal information is strictly utilized to:</p>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Generate authoritative server orders, tax invoices, and shipping waybills.</li>
              <li>Provide SMS and email notifications on shipping milestones and delivery confirmation.</li>
              <li>Maintain persistent shopping bags and saved wishlists across browser sessions.</li>
              <li>Prevent unauthorized transactions, brute-force attempts, and fraudulent chargebacks.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>3. Data Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or monetize your personal data to advertising networks or third-party data brokers. We share necessary shipping data solely with verified logistics couriers to facilitate doorstep delivery and with verified payment gateways to process transactions.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>4. Security Architecture</h2>
            <p>
              Our database is protected by role-based authorization middleware, bcrypt password hashing, parameterized database queries to eliminate SQL/NoSQL injection vulnerabilities, and strict HTTPS transmission.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>5. Contact Our Data Protection Officer</h2>
            <p>
              If you wish to review, update, or request deletion of your account and personal data, please contact our privacy desk at{' '}
              <a href={`mailto:${siteSettings.contact.email}`} style={{ color: 'var(--primary-cta)', fontWeight: 600 }}>
                {siteSettings.contact.email}
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsOfServicePage: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '100vh', padding: '48px 0 88px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <nav style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)', marginBottom: '24px' }}>
          <Link to="/" style={{ color: 'var(--secondary-ink)' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Terms of Service</span>
        </nav>

        <header style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Scale size={24} color="var(--primary-cta)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-cta)' }}>
              Contractual Terms
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--ink)', marginBottom: '12px' }}>
            ShopNest Terms & Conditions of Sale
          </h1>
          <p style={{ color: 'var(--secondary-ink)', fontSize: '0.95rem' }}>
            Effective date: October 2026 &bull; Governing Jurisdiction: Bengaluru, Karnataka, India.
          </p>
        </header>

        <div className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px', color: 'var(--secondary-ink)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>1. Scope & Acceptance</h2>
            <p>
              By accessing the <strong>ShopNest</strong> website or purchasing products, you agree to be bound by these Terms of Service. These terms constitute a legally binding electronic agreement between you and ShopNest Retail Operations.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>2. Product Pricing & Server Calculations</h2>
            <p>
              All prices are listed in Indian Rupees (₹ INR) and include applicable taxes unless specified otherwise. Prices, shipping surcharges, and order totals displayed on checkout are computed authoritatively on our server database at the moment of order placement. In the unlikely event of an obvious technical typographical error, ShopNest reserves the right to cancel the order and provide a full refund.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>3. Order Formation & Idempotency</h2>
            <p>
              Submission of an order through our encrypted checkout constitutes an offer to purchase. An order is confirmed when an atomic database transaction allocates warehouse stock and generates a unique order reference number. Duplicate submissions with identical idempotency keys are protected and will not result in multiple billings.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>4. Authentic Warranty & Disclaimer</h2>
            <p>
              ShopNest guarantees that all items sold are authentic, original goods sourced directly from certified brands and manufacturers. Manufacturer warranties are honored as specified by the individual brand documentation enclosed with each unit.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '10px' }}>5. Dispute Resolution & Jurisdiction</h2>
            <p>
              Any claims or legal disputes arising under these Terms shall be governed exclusively by the laws of India and subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
