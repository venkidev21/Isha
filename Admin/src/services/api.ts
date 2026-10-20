import { DashboardMetrics, Product, Order, Category, User } from '../types';

const BASE_URL = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('shopnest_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
  }
  return (data.data !== undefined ? data.data : data) as T;
}

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    me: async (): Promise<User> => {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },
  },

  admin: {
    getDashboard: async (): Promise<DashboardMetrics> => {
      const res = await fetch(`${BASE_URL}/admin/dashboard`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    getProducts: async (params?: { search?: string; categoryId?: string; page?: number; limit?: number }): Promise<{ products: Product[]; total: number; page: number; limit: number; totalPages: number }> => {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.categoryId) query.set('categoryId', params.categoryId);
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));

      const res = await fetch(`${BASE_URL}/admin/products?${query.toString()}`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    createProduct: async (payload: any): Promise<Product> => {
      const res = await fetch(`${BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    updateProduct: async (id: string, payload: any): Promise<Product> => {
      const res = await fetch(`${BASE_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    deleteProduct: async (id: string): Promise<{ success: boolean }> => {
      const res = await fetch(`${BASE_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    getOrders: async (params?: { search?: string; status?: string; page?: number; limit?: number }): Promise<{ orders: Order[]; total: number; page: number; limit: number; totalPages: number }> => {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.status) query.set('status', params.status);
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));

      const res = await fetch(`${BASE_URL}/admin/orders?${query.toString()}`, {
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },

    updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
      const res = await fetch(`${BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },

    adjustInventory: async (productId: string, quantityDelta: number, reason: string): Promise<Product> => {
      const res = await fetch(`${BASE_URL}/admin/products/${productId}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ changeQuantity: quantityDelta, reason }),
      });
      return handleResponse(res);
    },
  },

  categories: {
    getAll: async (): Promise<Category[]> => {
      const res = await fetch(`${BASE_URL}/categories`);
      return handleResponse(res);
    },
    create: async (name: string, description?: string): Promise<Category> => {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ name, description }),
      });
      return handleResponse(res);
    },
    delete: async (id: string): Promise<{ success: boolean }> => {
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      return handleResponse(res);
    },
  },
};
