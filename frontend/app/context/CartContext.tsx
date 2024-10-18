"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
}

interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const itemCount = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, itemCount, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
