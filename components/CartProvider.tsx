'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('svt_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
  }, []);

  const saveToStorage = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem('svt_cart', JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === item.product_id);
      let next: CartItem[];
      if (existing) {
        next = prev.map(i =>
          i.product_id === item.product_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        next = [...prev, item];
      }
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => {
      const next = prev.filter(i => i.product_id !== productId);
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => {
      const next = prev.map(i =>
        i.product_id === productId ? { ...i, quantity } : i
      );
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const clearCart = useCallback(() => {
    setItems([]);
    saveToStorage([]);
  }, [saveToStorage]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
