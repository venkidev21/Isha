// Centralized Site Settings & Brand Configuration for ShopNest
// Editable configuration ensuring zero hardcoded claims across components


export interface SiteSettings {
  siteName: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  announcement: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  contact: {
    email: string;
    phone: string;
    hours: string;
    address: string;
  };
  shipping: {
    freeThreshold: number; // in INR
    defaultFee: number;
    estimatedDeliveryDays: string;
  };
  policies: {
    returnDays: number;
    guaranteeNotice: string;
  };
}

export const siteSettings: SiteSettings = {
  siteName: 'ShopNest',
  tagline: 'Modern Multi-Category Marketplace & Curated Living',
  currency: 'INR',
  currencySymbol: '₹',
  announcement: {
    enabled: true,
    text: 'Complimentary insured express delivery across India on orders above ₹1,999',
    link: '/shipping',
  },
  contact: {
    email: 'support@shopnest.in',
    phone: '+91 (0) 80 4920 1820',
    hours: 'Mon – Sat, 9:00 AM – 8:00 PM IST',
    address: 'ShopNest Headquarters, 42 Indiranagar 100ft Road, Bengaluru, KA 560038',
  },
  shipping: {
    freeThreshold: 1999,
    defaultFee: 149,
    estimatedDeliveryDays: '2–4 business days',
  },
  policies: {
    returnDays: 30,
    guaranteeNotice: '100% Genuine products sourced directly from authorized brands, certified artisans, and verified manufacturers.',
  },
};

