"use client"

import { MoonIcon } from '@heroicons/react/16/solid';
import { SunIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add(theme);
    return () => {
      root.classList.remove(theme);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 ease-in-out transform hover:scale-105"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <SunIcon
        className="w-6 h-6 text-gray-800 dark:text-white transition-colors duration-300 ease-in-out"
        />
      ) : (
        <MoonIcon
        className="w-6 h-6 text-gray-800 dark:text-white transition-colors duration-300 ease-in-out"
        />
      )}
    </button>
  );
};

export default ThemeToggle;
