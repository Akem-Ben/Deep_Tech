"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CartItem {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
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

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    const confirmItem = cartItems.find((element) => element.id === item.id);
  
    if (confirmItem) {
      setCartItems((prev) =>
        prev.map((element) =>
          element.id === item.id
            ? { ...element, quantity: element.quantity + 1 }
            : element
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
    }
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
