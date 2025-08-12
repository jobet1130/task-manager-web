import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {/* Large stars */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse opacity-80"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/5 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-1/5 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-50"></div>
        <div className="absolute bottom-1/3 right-1/5 w-2 h-2 bg-indigo-300 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-pink-300 rounded-full animate-ping opacity-40"></div>
        
        {/* Medium stars */}
        <div className="absolute top-1/6 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse opacity-50 animation-delay-1000"></div>
        <div className="absolute bottom-1/6 right-1/2 w-1 h-1 bg-blue-200 rounded-full animate-ping opacity-40 animation-delay-1500"></div>
        <div className="absolute top-1/2 left-1/6 w-0.5 h-0.5 bg-purple-200 rounded-full animate-pulse opacity-60 animation-delay-2000"></div>
        <div className="absolute bottom-1/2 right-1/6 w-0.5 h-0.5 bg-cyan-200 rounded-full animate-ping opacity-30 animation-delay-2500"></div>
        
        {/* Small twinkling stars */}
        <div className="absolute top-1/8 left-3/4 w-0.5 h-0.5 bg-white rounded-full animate-ping opacity-30 animation-delay-500"></div>
        <div className="absolute bottom-1/8 left-1/8 w-0.5 h-0.5 bg-blue-100 rounded-full animate-pulse opacity-40 animation-delay-3000"></div>
        <div className="absolute top-3/4 right-1/8 w-0.5 h-0.5 bg-purple-100 rounded-full animate-ping opacity-20 animation-delay-3500"></div>
      </div>
      
      {/* Floating cosmic particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-purple-500 rounded-full opacity-10 animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-500 rounded-full opacity-15 animate-float-slow animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-indigo-500 rounded-full opacity-8 animate-float-slow animation-delay-4000"></div>
      </div>
      
      <div className="max-w-md w-full text-center relative z-10">
        {/* Glowing 404 Logo */}
        <div className="mb-8 relative">
          <div className="animate-bounce">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse drop-shadow-2xl">
              404
            </h1>
            {/* Glow effect */}
            <div className="absolute inset-0 text-9xl font-bold text-cyan-400 opacity-20 blur-lg animate-pulse">
              404
            </div>
          </div>
          
          {/* Orbiting particles */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="absolute w-4 h-4 bg-cyan-400 rounded-full animate-orbit opacity-80"></div>
            <div className="absolute w-3 h-3 bg-purple-400 rounded-full animate-orbit-reverse opacity-60 animation-delay-1000"></div>
            <div className="absolute w-2 h-2 bg-pink-400 rounded-full animate-orbit opacity-70 animation-delay-2000"></div>
          </div>
        </div>
        
        {/* Space-themed content */}
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-semibold text-white mt-4 animate-slide-in-left drop-shadow-lg">
            🚀 Lost in Space
          </h2>
          <p className="text-gray-300 mt-2 animate-slide-in-right">
            This page has drifted into the cosmic void. Let&apos;s navigate you back to safety.
          </p>
        </div>
        
        {/* Glowing buttons */}
        <div className="space-y-4 mt-8 animate-fade-in-up animation-delay-600">
          <Link 
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 border border-cyan-400/30"
          >
            🌍 Return to Dashboard
          </Link>
          
          <div className="text-sm text-gray-400">
            <Link 
              href="/dashboard"
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-200 hover:no-underline"
            >
              ← Navigate to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Floating astronaut/satellite */}
        <div className="mt-12 text-gray-400 animate-float">
          <div className="relative">
            <svg 
              className="mx-auto h-24 w-24 text-cyan-400 drop-shadow-lg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
              />
            </svg>
            {/* Satellite signal rings */}
            <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 border border-purple-400 rounded-full animate-ping opacity-30 animation-delay-500"></div>
          </div>
          <p className="mt-4 text-sm animate-pulse text-gray-300">Scanning for signal...</p>
        </div>
      </div>
    </div>
  );
}