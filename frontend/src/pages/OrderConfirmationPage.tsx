import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Check, CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';
import { Order } from '../types';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();

  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      setIsLoading(true);
      api.orders
        .getById(orderNumber)
        .then(setOrder)
        .catch((err) => console.error('Failed to load order confirmation:', err))
        .finally(() => setIsLoading(false));
    }
  }, [order, orderNumber]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '320px', maxWidth: '540px', margin: '0 auto', borderRadius: '16px' }} />
      </div>
    );
  }

  const displayOrderNumber = order?.orderNumber || orderNumber || 'SN123456';

  return (
    <div style={{ backgroundColor: 'var(--canvas)', minHeight: '85vh', padding: '60px 20px 100px', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            padding: '48px 36px 40px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Green Check Circle (Screen 6) */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
            }}
          >
            <Check size={48} strokeWidth={3} />
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: 'var(--secondary-ink)', fontSize: '1.05rem', marginBottom: '32px' }}>
            Thank you for shopping with us.
          </p>

          {/* Order Details Box (Screen 6) */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1rem', color: 'var(--ink)' }}>
              <span style={{ color: 'var(--secondary-ink)' }}>Order ID: </span>
              <strong style={{ fontWeight: 800 }}>#{displayOrderNumber}</strong>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--secondary-ink)' }}>
              <span>Estimated Delivery: </span>
              <strong style={{ color: 'var(--ink)' }}>3-5 Business Days</strong>
            </div>
          </div>

          {/* Buttons: View Order Details & Continue Shopping (Screen 6) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '380px', margin: '0 auto 36px' }}>
            {order ? (
              <Link
                to={`/order/${order.id}`}
                className="btn btn-primary"
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                View Order Details
              </Link>
            ) : (
              <Link
                to="/profile"
                className="btn btn-primary"
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                View My Orders
              </Link>
            )}

            <Link
              to="/catalogue"
              className="btn btn-secondary"
              style={{
                padding: '14px',
                borderRadius: '12px',
                fontSize: '0.98rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Continue Shopping
            </Link>
          </div>

          {/* Delivery Van / Truck Graphic (Screen 6) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 28px',
              backgroundColor: '#F0FDF4',
              borderRadius: '999px',
              border: '1px solid #DCFCE7',
              gap: '12px',
            }}
          >
            <Truck size={28} color="#10B981" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#15803D' }}>
              Your parcel is being packaged with care and insured delivery.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
