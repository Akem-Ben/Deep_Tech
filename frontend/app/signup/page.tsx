"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import hero from '../public/hero.jpg';
import { Facebook, Google, Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  return (
    <div
      className="relative min-h-screen px-3 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${hero.src})` }}
    >
      <motion.div
        className="bg-gray-800/50 dark:bg-gray-800/80 p-6 rounded-lg shadow-lg max-w-md w-full"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-white">Sign Up</h2>
        
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            setTimeout(() => {
              signUp(values.email, values.password);
              setSubmitting(false);
              router.push('/');
            }, 2000);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col space-y-4">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="border p-3 rounded w-full"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

              <div className="relative">
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="border p-3 rounded w-full pr-10"
                />
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="relative">
                <Field
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="border p-3 rounded w-full pr-10"
                />
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2"
                  size="small"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
              </div>

              <motion.button
                type="submit"
                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </motion.button>
            </Form>
          )}
        </Formik>

        <div className="flex justify-center items-center mt-4">
          <button
            className="text-sm text-white dark:text-gray-300 hover:underline"
            onClick={() => router.push('/signin')}
          >
            Already have an account? Sign In
          </button>
        </div>

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

export default SignUp;
