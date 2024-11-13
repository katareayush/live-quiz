"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, Check } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(null);
    return true;
  };

  // Handle input change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError(null);
    }
  };

  const getFirebaseErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        // Don't expose whether the account exists or not
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(false);

    // Validate email before submission
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      // Always show success message, regardless of whether the email exists
      setSuccess(true);
      setEmail('');
      setError(null);
      setEmailError(null);
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err);
      if (errorMessage) {
        setError(errorMessage);
        setSuccess(false);
      } else {
        // If it's a user-not-found error or other unhandled error,
        // still show success message for security
        setSuccess(true);
        setEmail('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <motion.div variants={fadeIn} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-pink-800 mb-2">Reset Password</h1>
            <p className="text-gray-700">Enter your email to reset your password</p>
          </motion.div>

          {error && (
            <motion.div
              variants={fadeIn}
              className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              variants={fadeIn}
              className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">Password reset email sent</span>
              </div>
              <p>If an account exists with {email}, you will receive a password reset link at this email address. Please check your email (including spam folder) and follow the instructions to reset your password.</p>
            </motion.div>
          )}

          <motion.form variants={staggerContainer} onSubmit={handleSubmit}>
            <motion.div variants={fadeIn} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => validateEmail(email)}
                    className={`w-full px-6 py-3 pl-12 rounded-full text-lg border-2 
                      ${emailError ? 'border-red-300 focus:border-red-500' : 'border-pink-200 focus:border-pink-500'} 
                      outline-none transition-colors`}
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>
                {emailError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 ml-3 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {emailError}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !email || !!emailError}
                className="w-full bg-pink-600 text-white px-8 py-3 rounded-full text-lg flex items-center justify-center gap-2 hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Sending link..."
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>

          <motion.div variants={fadeIn} className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Back to login</span>
              </div>
            </div>

            <motion.button
              variants={fadeIn}
              onClick={() => router.push('/login')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-full hover:border-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to login page</span>
            </motion.button>
          </motion.div>

          <motion.p variants={fadeIn} className="mt-8 text-center text-gray-700">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-pink-600 hover:text-pink-700 font-medium">
              Sign up for free
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default ForgotPassword;