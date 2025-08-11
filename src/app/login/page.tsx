'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../../components/Common/UI/AuthLayout';
import { LoginForm } from '../../components/Common/UI/LoginForm';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
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

export default function LoginPage() {
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

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();
      
      if (!result.token) {
        throw new Error('No authentication token received');
      }
      
      const storage = data.rememberMe ? localStorage : sessionStorage;
      storage.setItem('authToken', result.token);
      
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4 overflow-hidden relative">
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
              className="absolute w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-float-slow"
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
          <div className="absolute top-20 left-10 w-32 h-32 border border-blue-300 opacity-20 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-purple-300 opacity-20 rotate-12 animate-pulse"></div>
          <div className="absolute top-1/2 left-20 w-16 h-16 bg-indigo-400 opacity-10 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border-2 border-blue-400 opacity-15 animate-ping"></div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <AuthLayout>
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            error={error}
          />
        </AuthLayout>
      </div>
    </div>
  );
}