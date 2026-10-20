import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, Package, CreditCard, Truck, RotateCcw, ShieldCheck, Search } from 'lucide-react';
import { siteSettings } from '../../config/siteSettings';

interface FaqItem {
  question: string;
  answer: string;
  category: 'orders' | 'payments' | 'shipping' | 'returns' | 'authenticity';
}

const FAQ_DATA: FaqItem[] = [
  // Orders
  {
    category: 'orders',
    question: 'How do I track my order once placed?',
    answer: 'Once your order is verified and dispatched from our logistics hub, you can track its real-time status in your Account under "Orders", or by visiting the Order Confirmation link sent to your registered email address. We provide granular milestones from processing to doorstep delivery.',
  },
  {
    category: 'orders',
    question: 'Can I cancel or modify my order after placing it?',
    answer: 'Orders can be cancelled directly through your Account Profile page as long as the status is "PAID" or "PROCESSING". Once an order moves to "SHIPPED", cancellations cannot be processed automatically, and you can initiate a return upon delivery instead.',
  },
  {
    category: 'orders',
    question: 'Do I need an account to place an order?',
    answer: 'No. ShopNest supports full Guest Checkout. You only need to provide an email and shipping address to receive order updates. However, creating an account enables saved shipping addresses, order history, and wishlist persistence across devices.',
  },

  // Payments
  {
    category: 'payments',
    question: 'What payment methods does ShopNest support?',
    answer: 'We support instant online checkout via Razorpay (UPI, Credit/Debit Cards, NetBanking, Wallets) as well as Cash / UPI on Delivery (COD). In development sandbox mode, online orders are verified instantly without charging real cards.',
  },
  {
    category: 'payments',
    question: 'How are prices, taxes, and shipping calculated?',
    answer: 'All price totals, GST (Goods & Services Tax at 18%), and applicable shipping fees are computed strictly on our secure backend server using authoritative database product records. We never rely on client-side price totals.',
  },
  {
    category: 'payments',
    question: 'Is online payment secure on ShopNest?',
    answer: 'Yes. Online payments are processed using industry-standard 256-bit SSL encryption. We never store, log, or handle raw payment card numbers or CVVs on our servers.',
  },

  // Shipping
  {
    category: 'shipping',
    question: 'What are the delivery timelines across India?',
    answer: `Metro cities (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, Kolkata) typically receive deliveries within 2–3 business days. Non-metro Tier-2 and Tier-3 locations take 3–5 business days. All shipments are insured against damage or loss in transit.`,
  },
  {
    category: 'shipping',
    question: 'What are the shipping fees?',
    answer: `Shipping is completely FREE on all orders of ₹${siteSettings.shipping.freeThreshold.toLocaleString('en-IN')} or more. For orders below this threshold, a flat delivery fee of ₹${siteSettings.shipping.defaultFee} is added at checkout.`,
  },

  // Returns
  {
    category: 'returns',
    question: 'What is your return policy?',
    answer: `ShopNest provides a ${siteSettings.policies.returnDays}-day return window from the date of delivery. Items must be unused, unwashed, and in their original packaging with intact security seals and tags.`,
  },
  {
    category: 'returns',
    question: 'How long does a refund take to process?',
    answer: 'Once our quality inspection team verifies the returned product at our Bengaluru fulfilment center, refunds are processed within 2–4 business days back to your original payment method, or via direct NEFT transfer for COD orders.',
  },

  // Authenticity
  {
    category: 'authenticity',
    question: 'Are all products 100% authentic and original?',
    answer: 'Yes, absolutely. ShopNest operates directly with authorized brand distributors, official manufacturers, and vetted master artisans. Every product is backed by manufacturer warranty and genuine serial numbers where applicable.',
  },
  {
    category: 'authenticity',
    question: 'Do electronics and timepieces carry warranty?',
    answer: 'All electronics, acoustics, and automatic horology timepieces include manufacturer warranty certificates ranging from 1 to 5 years, along with stamped warranty cards in the packaging.',
  },
];

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'orders', label: 'Orders & Tracking', icon: Package },
    { id: 'payments', label: 'Payments & COD', icon: CreditCard },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'authenticity', label: 'Authenticity & Warranty', icon: ShieldCheck },
  ];

  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '100vh', padding: '48px 0 88px' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.85rem', color: 'var(--secondary-ink)', marginBottom: '24px' }}>
          <Link to="/" style={{ color: 'var(--secondary-ink)' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Help & FAQ</span>
        </nav>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              marginBottom: '12px',
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--secondary-ink)', maxWidth: '600px', margin: '0 auto 28px' }}>
            Find transparent answers to common inquiries regarding orders, shipping, payment options, and return procedures.
          </p>

          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>
            <Search size={18} color="var(--muted-ink)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
            <input
              type="text"
              placeholder="Search by topic, e.g. 'refunds', 'delivery', 'warranty'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '44px', height: '46px', fontSize: '0.95rem' }}
            />
          </div>
        </header>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px' }} className="no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: isActive ? '1px solid var(--primary-cta)' : '1px solid var(--border)',
                  backgroundColor: isActive ? 'var(--primary-cta)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--ink)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredFaqs.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: 'var(--secondary-ink)', fontSize: '1rem', marginBottom: '16px' }}>
                No matching questions found for "{searchTerm}".
              </p>
              <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }} className="btn btn-outline btn-sm">
                Reset Search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    overflow: 'hidden',
                    border: isOpen ? '1px solid var(--primary-cta)' : '1px solid var(--border)',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'var(--ink)',
                      gap: '16px',
                    }}
                  >
                    <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{faq.question}</span>
                    <ChevronDown
                      size={20}
                      color="var(--secondary-ink)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 24px 20px',
                        fontSize: '0.925rem',
                        color: 'var(--secondary-ink)',
                        lineHeight: 1.65,
                        borderTop: '1px solid var(--canvas)',
                        paddingTop: '16px',
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div
          className="card"
          style={{
            marginTop: '48px',
            padding: '36px',
            textAlign: 'center',
            backgroundColor: 'var(--surface)',
          }}
        >
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Still Have Questions?</h3>
          <p style={{ color: 'var(--secondary-ink)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 20px' }}>
            Cannot find the answer you are looking for? Our dedicated concierge support team is here to assist.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">
              Contact Concierge
            </Link>
            <a href={`mailto:${siteSettings.contact.email}`} className="btn btn-outline">
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
