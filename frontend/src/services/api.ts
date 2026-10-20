import { Cart, Category, Order, Product, User, Address } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export function getSessionId(): string {
  let sessionId = localStorage.getItem('eesha_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('eesha_session_id', sessionId);
  }
  return sessionId;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('eesha_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('eesha_token', token);
  } else {
    localStorage.removeItem('eesha_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const sessionId = getSessionId();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-session-id': sessionId,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Auth & Profile
  auth: {
    register: (payload: any) => request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload: any) => request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    loginWithGoogle: (credential: string) => request<{ user: User; token: string }>('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
    getProfile: () => request<User & { addresses: Address[] }>('/auth/me'),
    updateProfile: (payload: any) => request<User>('/auth/me', { method: 'PUT', body: JSON.stringify(payload) }),
    getAddresses: () => request<Address[]>('/auth/addresses'),
    addAddress: (payload: any) => request<Address>('/auth/addresses', { method: 'POST', body: JSON.stringify(payload) }),
    deleteAddress: (id: string) => request<{ success: boolean }>(`/auth/addresses/${id}`, { method: 'DELETE' }),
  },

  // Categories
  categories: {
    getAll: () => request<Category[]>('/categories'),
    getBySlug: (slug: string) => request<Category>(`/categories/${slug}`),
    create: (payload: any) => request<Category>('/categories', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: any) => request<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id: string) => request<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),
  },

  // Products
  products: {
    getAll: (params: {
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      sortBy?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.set('search', params.search);
      if (params.category) query.set('category', params.category);
      if (params.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
      if (params.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
      if (params.inStock) query.set('inStock', 'true');
      if (params.sortBy) query.set('sortBy', params.sortBy);
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));

      return request<{
        products: Product[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
        hasMore: boolean;
      }>(`/products?${query.toString()}`);
    },
    getBySlug: (slug: string) => request<Product>(`/products/${slug}`),
    getFeatured: (limit = 6) => request<Product[]>(`/products/featured?limit=${limit}`),
    getRelated: (productId: string, categoryId: string) =>
      request<Product[]>(`/products/related?productId=${productId}&categoryId=${categoryId}`),
  },

  // Cart
  cart: {
    get: () => request<Cart>('/cart'),
    addItem: (productId: string, quantity = 1) =>
      request<Cart>('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
    updateItem: (itemId: string, quantity: number) =>
      request<Cart>(`/cart/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    removeItem: (itemId: string) => request<Cart>(`/cart/items/${itemId}`, { method: 'DELETE' }),
    clear: () => request<Cart>('/cart', { method: 'DELETE' }),
    sync: (sessionId: string) => request('/cart/sync', { method: 'POST', body: JSON.stringify({ sessionId }) }),
  },

  // Orders
  orders: {
    preview: (items: Array<{ productId: string; quantity: number }>) =>
      request<{
        items: any[];
        subtotal: number;
        taxTotal: number;
        shippingFee: number;
        grandTotal: number;
        currency: string;
      }>('/orders/preview', { method: 'POST', body: JSON.stringify({ items }) }),
    create: (payload: any, idempotencyKey?: string) =>
      request<Order>('/orders', {
        method: 'POST',
        headers: idempotencyKey ? { 'idempotency-key': idempotencyKey } : undefined,
        body: JSON.stringify(payload),
      }),
    getMyOrders: () => request<Order[]>('/orders'),
    getById: (id: string) => request<Order>(`/orders/${id}`),
    cancel: (id: string) => request<Order>(`/orders/${id}/cancel`, { method: 'POST' }),
  },
};
