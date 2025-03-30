// components/auth/AuthForm.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Form types
type FormType = 'signin' | 'signup';

// Props interface
interface AuthFormProps {
  onAuthenticate: (email: string, password: string, isSignUp: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthenticate }) => {
  // Form state
  const [formType, setFormType] = useState<FormType>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthenticate(email, password, formType === 'signup');
  };

  // Switch between signin and signup
  const toggleFormType = () => {
    setFormType(formType === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="flex w-full max-w-5xl rounded-lg shadow-lg overflow-hidden bg-white">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center mr-2">
              <span className="text-white text-xs">H</span>
            </div>
            <span className="font-semibold text-black">Housy</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={formType}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <h2 className="text-2xl font-medium text-black mb-1">
              {formType === 'signin' ? 'Welcome Back, Please login' : 'Create an Account'}
            </h2>
            <p className="text-black mb-6">
              {formType === 'signin' 
                ? 'to your account.' 
                : 'Start your housing journey with us.'}
            </p>

            <form onSubmit={handleSubmit}>
              {/* Social login buttons */}
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition-colors text-black"
                >
                  <span className="text-blue-600">f</span>
                  <span>Login with Facebook</span>
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition-colors text-black"
                >
                  <span className="text-green-600">X</span>
                  <span>Login with Google</span>
                </button>
              </div>

              <div className="relative my-6 text-center">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200"></div>
                <span className="relative bg-white px-2 text-sm text-black">OR</span>
              </div>

              {/* Email input */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border-b border-gray-300 focus:border-pink-500 focus:outline-none transition-colors text-black"
                  placeholder="example@email.com"
                  required
                />
              </div>

              {/* Password input */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border-b border-gray-300 focus:border-pink-500 focus:outline-none transition-colors text-black"
                  placeholder="••••••••••"
                  required
                />
              </div>

              {/* Remember me & Forgot password */}
              {formType === 'signin' && (
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 text-pink-500 focus:ring-pink-400 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-black">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm text-black hover:text-pink-500">
                    Forgot password
                  </a>
                </div>
              )}

              {/* Submit button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
                >
                  {formType === 'signin' ? 'Login' : 'Sign up'}
                </button>
                {formType === 'signin' && (
                  <button
                    type="button"
                    onClick={toggleFormType}
                    className="flex-1 bg-white text-black py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Sign up
                  </button>
                )}
                {formType === 'signup' && (
                  <button
                    type="button"
                    onClick={toggleFormType}
                    className="flex-1 bg-white text-black py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Login instead
                  </button>
                )}
              </div>
            </form>

            {/* Terms and conditions */}
            <p className="text-xs text-black mt-6">
              By signing up, you agree to Housy's
              <a href="#" className="text-black underline ml-1">Terms and Conditions</a> &
              <a href="#" className="text-black underline ml-1">Privacy Policy</a>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right side - Colorful gradient */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-8 relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <button className="bg-black bg-opacity-20 text-white text-xs py-1 px-3 rounded-full">
            Hide
          </button>
        </div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-cyan-400 opacity-70"></div>
          <div className="absolute right-20 top-40 w-40 h-40 rounded-full bg-purple-600 opacity-70"></div>
        </div>
        
        <div className="relative z-10 mt-24 text-white">
          <h2 className="text-2xl font-medium mb-4">How it works?</h2>
          <p className="text-sm mb-6">
            Create your free search profile and let us know your wishes 
            for the perfect apartment.
          </p>
          
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-14 border-l-pink-500 border-b-8 border-b-transparent ml-1"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

