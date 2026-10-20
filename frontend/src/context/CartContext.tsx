import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number, options?: { openCart?: boolean }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toast = useToast();

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.cart.get();
      setCart(data);
    } catch (err: any) {
      console.warn('Failed to load cart:', err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (productId: string, quantity = 1, options: { openCart?: boolean } = {}) => {
    setIsLoading(true);
    try {
      const updatedCart = await api.cart.addItem(productId, quantity);
      setCart(updatedCart);
      toast.success('Item added to your shopping bag');
      if (options.openCart !== false) {
        openCart();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add item to bag');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updatedCart = await api.cart.updateItem(itemId, quantity);
      setCart(updatedCart);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update item quantity');
      await refreshCart();
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const updatedCart = await api.cart.removeItem(itemId);
      setCart(updatedCart);
      toast.info('Item removed from shopping bag');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove item');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const updatedCart = await api.cart.clear();
      setCart(updatedCart);
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear cart');
    }
  };

  const itemCount = cart?.itemCount ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isLoading,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
