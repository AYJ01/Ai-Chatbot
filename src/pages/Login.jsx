import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, Mail } from 'lucide-react';
import { useSignInEmailPassword, useUserData } from '@nhost/react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signInEmailPassword, isLoading, isSuccess, needsEmailVerification, error } = useSignInEmailPassword();
  const userData = useUserData();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    signInEmailPassword(formData.email, formData.password);
  };

  // Navigate on successful login
  useEffect(() => {
    if (isSuccess && !needsEmailVerification && userData) {
      sessionStorage.setItem('user', JSON.stringify(userData));
      navigate('/layout/chats');
    }
  }, [isSuccess, needsEmailVerification, userData, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-gray-400">Sign in to your secure account</p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6 animate-slide-in" onSubmit={handleSubmit}>
          {/* Error & Verification messages */}
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error.message}
            </div>
          )}
          {needsEmailVerification && (
            <div className="text-yellow-400 text-sm text-center">
              Please check your email to verify your account.
            </div>
          )}

          {/* Email and Password Inputs */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-dark-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent "
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-600 placeholder-gray-400 text-white bg-dark-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
