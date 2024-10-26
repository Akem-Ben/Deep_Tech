
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import { products } from '@/app/data/products';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '@/app/context/CartContext';
import { useAlert } from "next-alert";
import { Alerts } from "next-alert"; 

interface ProductPageProps {
  params: { id: string };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const product = products.find((prod) => String(prod.id) === params.id);
  const { addToCart } = useCart();
  const { addAlert } = useAlert();

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl
    });
    addAlert("Product added to cart successful", "Proceed to checkout", "success")
  };

  return (
    <motion.div 
      className="p-4 lg:px-[7rem]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="text-blue-500 mb-4 inline-block">
        <ArrowBack /> Back to Products
      </Link>
      <motion.div 
        className="flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.img
          src={product.imageUrl}
          alt={product.title}
          className="w-full lg:w-1/2 h-64 object-cover rounded-md mb-4 lg:mb-0 lg:mr-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="flex flex-col justify-between">
          <motion.h1 
            className="text-2xl font-bold dark:text-white text-black mb-2"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {product.title}
          </motion.h1>
          <p className="text-lg font-semibold text-green-500 mb-1">${product.price}</p>
          <p className="text-sm line-through text-gray-500 mb-2">${product.priceSlash}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
          <Button variant="contained" color="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
        <Alerts
			position="top-right"
			direction="right"
			timer={3000}
			className="rounded-md relative z-50 !w-80"
		>
        </Alerts>
      </motion.div>
    </motion.div>
  );
};

export default ProductPage;
