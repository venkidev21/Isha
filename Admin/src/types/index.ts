export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  productCount?: number;
}

export interface ProductImage {
  id: string;
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
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId: string;
  category?: Category;
  isActive: boolean;
  isFeatured: boolean;
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

export interface OrderItem {
  id: string;
  productId?: string | null;
  productTitle: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  productImage?: string | null;
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
  items: OrderItem[];
  createdAt: string;
}

export interface DashboardMetrics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    lowStockCount: number;
  };
  lowStockProducts: {
    id: string;
    title: string;
    sku: string;
    stock: number;
    lowStockThreshold: number;
  }[];
  recentOrders: Order[];
  categoryStats: {
    id: string;
    name: string;
    productCount: number;
  }[];
}
