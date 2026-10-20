export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt?: string;
}

export interface Address {
  id: string;
  userId: string;
  label?: string | null;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  productCount?: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  sku: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
  };
  isFeatured: boolean;
  isActive: boolean;
  stock: number;
  lowStockThreshold: number;
  specifications?: string | null;
  highlights?: string | null;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  categoryName?: string;
  quantity: number;
  stock: number;
  isAvailable: boolean;
  hasStockShortage: boolean;
  lineTotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  taxTotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  grandTotal: number;
  currency: string;
}

export interface OrderItem {
  id: string;
  productId?: string | null;
  productTitle: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  productImage?: string | null;
  snapshotData?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  guestEmail?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  subtotal: number;
  taxTotal: number;
  shippingFee: number;
  discountTotal: number;
  grandTotal: number;
  currency: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  billingAddress?: any;
  notes?: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface DashboardMetrics {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  lowStockProducts: Array<{
    id: string;
    title: string;
    stock: number;
    lowStockThreshold: number;
  }>;
  recentOrders: Order[];
  recentAdjustments: any[];
  categoryStats: Array<{
    name: string;
    _count: { products: number };
  }>;
}
