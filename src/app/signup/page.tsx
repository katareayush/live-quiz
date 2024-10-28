"use client"
import React, { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Chrome, GithubIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const SignupPage = () => {
  const router = useRouter();
  const { user, signupWithEmail,signupWithGithub ,signupWithGoogle, error: authError, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      console.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // If remember me is checked, we can store the email in localStorage
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      await signupWithEmail(formData.email, formData.password, formData.displayName);
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signupWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Google signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setLoading(true);
    try {
      await signupWithGithub();
      router.push('/dashboard');
    } catch (error) {
      console.error('Github signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-pink-800 mb-2">Create Account</h1>
            <p className="text-gray-700">Sign up to get started with our service</p>
          </motion.div>

          {authError && (
            <motion.div
              variants={fadeIn}
              className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm"
            >
              {authError}
            </motion.div>
          )}

          <motion.form variants={staggerContainer} onSubmit={handleSubmit}>
            <motion.div variants={fadeIn} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-6 py-3 pl-12 rounded-full text-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                  required
                  disabled={loading || authLoading}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-3 pl-12 rounded-full text-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                  required
                  disabled={loading || authLoading}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-6 py-3 pl-12 rounded-full text-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                  required
                  disabled={loading || authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-6 py-3 pl-12 rounded-full text-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                  required
                  disabled={loading || authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-5 w-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
            </motion.div>

            <motion.button
              variants={fadeIn}
              type="submit"
              className="w-full py-3 mt-6 bg-pink-600 text-white rounded-full text-lg"
              disabled={loading || authLoading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </motion.button>
          </motion.form>

          <div className="flex items-center justify-between mt-4">
            <hr className="w-full border-gray-300" />
            <span className="mx-2 text-gray-600">or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <motion.button
            variants={fadeIn}
            className="flex items-center justify-center w-full mt-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150"
            onClick={handleGoogleSignup}
            disabled={loading || authLoading}
          >
            <Chrome className="mr-2 h-5 w-5" />
            Sign Up with Google
          </motion.button>
          
          <motion.button
            variants={fadeIn}
            className="flex items-center justify-center w-full mt-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-150"
            onClick={handleGithubSignup}
            disabled={loading || authLoading}
          >
            <GithubIcon className="mr-2 h-5 w-5" />
            Sign Up with GitHub
          </motion.button>

          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Already have an account? <Link href="/login" className="text-pink-600">Login</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default SignupPage;
