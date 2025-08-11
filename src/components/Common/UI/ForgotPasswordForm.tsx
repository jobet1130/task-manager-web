'use client';

import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Card } from '../UI/Card';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
  error,
  success = false
}) => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });
  
  const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ForgotPasswordFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ForgotPasswordFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background Design */}
      <div className="absolute inset-0 -z-10">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl" />
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-orange-400/30 to-red-500/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-red-400/30 to-pink-500/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 -left-6 w-16 h-16 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-16 left-12 w-1 h-1 bg-orange-300/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-16 right-16 w-1.5 h-1.5 bg-red-300/50 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>
      
      {/* Form Content */}
      <Card className="relative z-10 bg-transparent border-transparent shadow-none p-8" transparent={true}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {success ? 'Check Your Email' : 'Reset Password'}
          </h1>
          <p className="text-gray-200 drop-shadow-md">
            {success 
              ? 'We\'ve sent a password reset link to your email'
              : 'Enter your email to receive a reset link'
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 backdrop-blur-sm border border-red-500/40 rounded-xl">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/30 backdrop-blur-sm border border-green-500/40 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-200 text-sm">
                Password reset email sent successfully! Check your inbox and spam folder.
              </p>
            </div>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              transparent={true}
              className="bg-white/5 border-white/20 focus:border-white/40 focus:ring-white/20"
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0 shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02]"
              loading={loading}
            >
              Send Reset Link
            </Button>

            <div className="text-center space-y-2">
              <div>
                <span className="text-gray-300">Remember your password? </span>
                <a href="/login" className="text-blue-300 hover:text-blue-200 transition-colors">
                  Sign in
                </a>
              </div>
              <div>
                <span className="text-gray-300">Don&apos;t have an account? </span>
                <a href="/register" className="text-blue-300 hover:text-blue-200 transition-colors">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-300 text-sm">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 border-0 shadow-lg backdrop-blur-sm transition-all duration-300"
              >
                Send Another Email
              </Button>
              
              <div className="text-center">
                <a href="/login" className="text-blue-300 hover:text-blue-200 transition-colors text-sm">
                  Back to Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};