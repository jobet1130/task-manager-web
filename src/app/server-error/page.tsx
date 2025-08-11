'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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

export default function ServerError() {
  const [stars, setStars] = useState<AnimatedElement[]>([]);
  const [particles, setParticles] = useState<ParticleElement[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log('Server error page loaded');
    
    // Generate stars
    const generatedStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 3 + 2
    }));
    
    // Generate particles
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5
    }));
    
    setStars(generatedStars);
    setParticles(generatedParticles);
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background stars */}
      {isClient && (
        <div className="absolute inset-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full opacity-70 animate-pulse"
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

      {/* Floating cosmic particles */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float-slow"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Glowing 500 */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 animate-pulse drop-shadow-2xl">
            500
          </h1>
          <div className="absolute inset-0 text-9xl font-bold text-red-500 opacity-20 blur-xl animate-pulse">
            500
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
            Server Malfunction Detected
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed animate-fade-in-delay">
            Our servers are experiencing technical difficulties. Our engineering team has been notified and is working to resolve the issue.
          </p>
        </div>

        {/* Broken loading bar */}
        <div className="relative w-80 h-4 mx-auto mb-8">
          <div className="w-full h-full bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-broken-loading" style={{width: '65%'}}></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Glitch effects */}
            <div className="absolute top-0 bg-red-400 h-full animate-glitch-1" style={{left: '20%', width: '3px'}}></div>
            <div className="absolute top-0 bg-pink-400 h-full animate-glitch-2" style={{left: '45%', width: '2px'}}></div>
            <div className="absolute top-0 bg-red-300 h-full animate-glitch-3" style={{left: '60%', width: '4px'}}></div>
          </div>
          <div className="text-red-400 text-sm mt-2 animate-pulse">Loading failed... Error 500</div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 border-2 border-purple-500 text-purple-300 font-semibold rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Return to Base
          </Link>
        </div>

        {/* Server status indicator */}
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm">Server Status: Offline</span>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes broken-loading {
          0% { width: 0%; }
          30% { width: 45%; }
          50% { width: 45%; }
          70% { width: 65%; }
          85% { width: 65%; }
          100% { width: 65%; }
        }
        @keyframes glitch-1 {
          0%, 100% { opacity: 1; transform: translateX(0); }
          25% { opacity: 0; transform: translateX(-2px); }
          50% { opacity: 1; transform: translateX(2px); }
          75% { opacity: 0; transform: translateX(-1px); }
        }
        @keyframes glitch-2 {
          0%, 100% { opacity: 0; transform: translateY(0); }
          20% { opacity: 1; transform: translateY(-1px); }
          40% { opacity: 0; transform: translateY(1px); }
          60% { opacity: 1; transform: translateY(-2px); }
          80% { opacity: 0; transform: translateY(1px); }
        }
        @keyframes glitch-3 {
          0%, 100% { opacity: 1; transform: scale(1); }
          33% { opacity: 0; transform: scale(1.1); }
          66% { opacity: 1; transform: scale(0.9); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }
        .animate-broken-loading {
          animation: broken-loading 3s ease-in-out infinite;
        }
        .animate-glitch-1 {
          animation: glitch-1 2s ease-in-out infinite;
        }
        .animate-glitch-2 {
          animation: glitch-2 1.5s ease-in-out infinite 0.5s;
        }
        .animate-glitch-3 {
          animation: glitch-3 2.5s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
}