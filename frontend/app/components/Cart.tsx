"use client";
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Delete } from '@mui/icons-material';
import { ShoppingBasket } from 'lucide-react';

const Cart: React.FC = () => {
  const { itemCount, cartItems, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative ">
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 ease-in-out transform hover:scale-105"
        onClick={toggleCart}
      >
        <ShoppingBasket className='dark:text-white'/>
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 text-xs font-bold text-center text-white bg-red-500 rounded-full">{itemCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-20 right-0 w-[20rem] max-h-[14rem] overflow-auto p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg text-gray-400">Cart Items</h3>
          {cartItems.length === 0 ? (
            <p className='text-gray-600'>Your cart is empty</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 border mb-[2px] rounded-lg p-[5px]">
                  <div className="flex items-center">
                    <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded-md mr-2" />
                    <div>
                      <p className="font-semibold text-gray-400">{item.title}</p>
                      <p className="text-sm text-gray-600">${item.price}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                    <Delete/>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
