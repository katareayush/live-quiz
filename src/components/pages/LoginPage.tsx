"use client"
import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Chrome, Apple } from 'lucide-react';
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

const LoginPage = () => {
  const router = useRouter();
  const { user, loginWithEmail, loginWithGithub, loginWithGoogle, error: authError, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      await loginWithGithub();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Github login failed:', error);
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
            <h1 className="text-3xl font-bold text-pink-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-700">Enter your details to access your account</p>
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
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-3 pl-12 rounded-full text-lg border-2 border-pink-200 focus:border-pink-500 outline-none"
                  required
                  disabled={loading || authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  disabled={loading || authLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-pink-300"
                    disabled={loading || authLoading}
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-pink-600 hover:text-pink-700">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || authLoading}
                className="w-full bg-pink-600 text-white px-8 py-3 rounded-full text-lg flex items-center justify-center gap-2 hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(loading || authLoading) ? "Signing in..." : (
                  <>
                    Log in
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>

          <motion.div variants={staggerContainer} className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                variants={fadeIn}
                onClick = {handleGithubLogin}
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-full hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || authLoading}
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </motion.button>

              <motion.button
                variants={fadeIn}
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-full hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || authLoading}
              >
                <Chrome className="w-5 h-5" />
                <span>Google</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.p variants={fadeIn} className="mt-8 text-center text-gray-700">
            Don't have an account?{' '}
            <Link href="/signup" className="text-pink-600 hover:text-pink-700 font-medium">
              Sign up for free
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default LoginPage;