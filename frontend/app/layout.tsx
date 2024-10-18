import React from 'react';
import Header from './components/Header';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import { AlertProvider } from "next-alert";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900">
        <AuthProvider>
          <AlertProvider>
            <CartProvider>
              <Header />
              <main className='inconsolata'>
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}