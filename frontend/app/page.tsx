"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { products } from './data/products';
import { useCart } from './context/CartContext';
import './globals.css';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import Hero from './components/Hero';
import { useAlert } from "next-alert";
import { Alerts } from "next-alert";

const ITEMS_PER_PAGE = 6;

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useCart(); 
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { addAlert } = useAlert();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (product: any) => {
    addToCart(product); 
    addAlert("Product added to cart successfully", "Proceed to checkout", "success");
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: string }> | any) => {
    setSelectedCategory(event.target.value as string);
    setCurrentPage(1); 
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Hero />
      <div id='products' className="p-4 lg:px-[7rem]">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <TextField
          variant="outlined"
          label="Search Products"
          value={searchTerm}
          onChange={handleSearch}
          className="mb-2 sm:mb-0 sm:w-1/3 w-full dark:bg-gray-800 dark:text-white"
          InputLabelProps={{
            style: { color: 'grey' },
            className: 'dark:text-gray-300',
          }}
          InputProps={{
            style: {
              backgroundColor: '',
              color: 'grey',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            classes: { notchedOutline: 'dark:border-gray-500' },
          }}
        />

      <FormControl variant="outlined" className="w-full sm:w-1/4 ml-2 dark:bg-gray-800 dark:text-white">
        <InputLabel className="dark:text-gray-300">Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Category"
          style={{
            backgroundColor: '',
            color: 'gray',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
          MenuProps={{
            PaperProps: {
              style: {
                color: 'grey',
              },
            },
          }}
        >
          <MenuItem value="">
            <em className='text-gray-400'>All</em>
          </MenuItem>
          <MenuItem value="fruits">Fruits</MenuItem>
          <MenuItem value="beverages">Beverages</MenuItem>
          <MenuItem value="breads">Breads</MenuItem>
          <MenuItem value="condiments">Condiments</MenuItem>
          <MenuItem value="grains">Grains</MenuItem>
          <MenuItem value="snacks">Snacks</MenuItem>
        </Select>
      </FormControl>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <Skeleton 
                key={index} 
                variant="rectangular" 
                width="100%" 
                height={250} 
                animation="pulse" 
                className="mb-4 rounded-lg" 
                style={{
                  backgroundColor: 'rgba(200, 200, 200, 0.2)',
                  borderRadius: '10px',
                  transform: 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                }}
              />
            ))
          ) : displayedProducts.length === 0 ? (
            <p className='text-lg text-grey-400 h-[50vh] m-auto'>No products found</p>
          ) : (
            displayedProducts.map((product) => (
              <div key={product.id} className="block bg-white dark:bg-gray-800 hover:scale-105 transition-all dark:border-blue-400 dark:border rounded-lg shadow-md p-4">
                <Link href={`/product/${product.id}`}>
                  <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover rounded-md mb-2" />
                  <h2 className="text-xl dark:text-white text-black font-bold mb-2">{product.title}</h2>
                  <p className="text-lg font-semibold text-green-500 mb-1">${product.price}</p>
                  <p className="text-sm line-through text-gray-500 mb-2">${product.priceSlash}</p>
                </Link>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleAddToCart(product)} 
                  className="mt-2"
                >
                  Add to Cart
                </Button>
              </div>
            ))
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex justify-end mt-5 my-10">
            <Button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
              className="mr-2"
            >
              <ArrowLeft/>
              Previous
            </Button>
            <Button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
              <ArrowRight/>
            </Button>
          </div>
        )}
      </div>
      <Alerts
        position="top-right"
        direction="right"
        timer={3000}
        className="rounded-md relative z-50 !w-80"
      >
      </Alerts>
    </>
  );
};

export default Home;
