"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { CircularProgress, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import hero from '../../public/hero.jpg';
import { Facebook, Google } from '@mui/icons-material';

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${hero.src})` }}
    >
      <motion.div
        className="bg-gray-800/50 dark:bg-gray-800/80 p-6 rounded-lg shadow-lg max-w-md w-full"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-white">Sign In</h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            setTimeout(() => {
              signIn(values.email, values.password);
              setSubmitting(false);
              router.push('/');
            }, 2000);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col space-y-4">
              <div className="relative">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border p-3 rounded w-full"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="relative">
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="border p-3 rounded w-full"
                />
                <IconButton
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <motion.button
                type="submit"
                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </motion.button>

              <div className="flex justify-between items-center mt-4">
                <button className="text-sm text-blue-200 hover:underline">
                  Forgot Password?
                </button>
                <button
                  className="text-sm text-white dark:text-gray-300 hover:underline"
                  onClick={() => router.push('/signup')}
                >
                  Don’t have an account? Sign Up
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="flex items-center justify-center mt-6 space-x-4">
          <button className="bg-white dark:bg-gray-700 p-3 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-600">
            <Google />
          </button>
          <button className="bg-white dark:bg-gray-700 p-3 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-600">
            <Facebook />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
