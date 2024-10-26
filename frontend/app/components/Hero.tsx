"use client"

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import heroImg from '../../public/hero.jpg';

const Hero: React.FC = () => {
  return (
    <section className=" flex items-center justify-center w-full lg:h-[87vh] h-[90vh] overflow-hidden bg-gray-800">
      <div className="absolute inset-0">
        <Image
          src={heroImg}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
        />
      </div>

      <div className="relative z-10 text-center text-white">
        <motion.h1
          className="text-4xl  md:text-7xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Discover Amazing Products
        </motion.h1>

        <motion.p
          className="mt-4 text-lg md:text-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your one-stop shop for unique and quality items.
        </motion.p>

        <div className="mt-6 flex justify-center space-x-4">
          <motion.a
            href="#products"
            className="px-6 py-3 text-lg font-semibold text-gray-800 bg-white rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:bg-gray-300 hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Shop Now
          </motion.a>
          <motion.a
            href="#about"
            className="px-6 py-3 text-lg font-semibold border border-white rounded-lg transition duration-300 ease-in-out transform hover:bg-white hover:text-gray-800 hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Learn More
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
