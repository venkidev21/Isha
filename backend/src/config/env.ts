import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_development_secret_change_in_production',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  CURRENCY: process.env.CURRENCY || 'INR',
  TAX_RATE: process.env.TAX_RATE ? parseFloat(process.env.TAX_RATE) : 0.18,
  DEFAULT_SHIPPING_FEE: process.env.DEFAULT_SHIPPING_FEE ? parseFloat(process.env.DEFAULT_SHIPPING_FEE) : 99.0,
  FREE_SHIPPING_THRESHOLD: process.env.FREE_SHIPPING_THRESHOLD ? parseFloat(process.env.FREE_SHIPPING_THRESHOLD) : 999.0,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};
