'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../components/Common/UI/AuthLayout';
import { RegisterForm } from '../../components/Common/UI/RegisterForm';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface AnimatedElement {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  animationDelay: number;
  animationDuration: number;
}

interface ParticleElement {
  id: number;
  left: number;
  top: number;
  animationDelay: number;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [stars, setStars] = useState<AnimatedElement[]>([]);
  const [particles, setParticles] = useState<ParticleElement[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Generate animated background elements
    const generatedStars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 4 + 3
    }));
    
    const generatedParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 6
    }));
    
    setStars(generatedStars);
    setParticles(generatedParticles);
    setIsClient(true);
  }, []);

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      
      // Use the result data for better user experience
      console.log('Registration successful:', result);
      
      // You can use result data in various ways:
      // 1. Show user info in success message
      const successMessage = result.user 
        ? `Registration successful! Welcome ${result.user.firstName || result.user.email}! Please sign in.`
        : 'Registration successful! Please sign in.';
      
      // 2. Store user data temporarily if needed
      if (result.user) {
        sessionStorage.setItem('registeredUser', JSON.stringify({
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName
        }));
      }
      
      // 3. Redirect with personalized message
      router.push(`/login?message=${encodeURIComponent(successMessage)}`);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background stars */}
      {isClient && (
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full opacity-60 animate-pulse"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.width}px`,
                height: `${star.height}px`,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.animationDuration}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Floating particles */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 bg-green-300 rounded-full opacity-40 animate-float-slow"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Geometric shapes */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 border border-green-300 opacity-20 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-blue-300 opacity-20 rotate-12 animate-pulse"></div>
          <div className="absolute top-1/2 left-20 w-16 h-16 bg-blue-400 opacity-10 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border-2 border-green-400 opacity-15 animate-ping"></div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <AuthLayout>
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            error={error}
          />
        </AuthLayout>
      </div>
    </div>
  );
}