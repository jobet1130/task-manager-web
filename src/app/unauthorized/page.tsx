import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Floating warning particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-400 rounded-full opacity-30 animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 max-w-2xl mx-auto">
        {/* Glowing 401 */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-red-600 animate-pulse drop-shadow-2xl">
            401
          </h1>
        </div>

        {/* Warning message */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-pulse">
            🚫 Access Denied
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-lg mx-auto">
            You don&apos;t have permission to access this restricted area. Please authenticate or contact your administrator.
          </p>
        </div>

        {/* Security warning */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-300 font-semibold">Security Alert</span>
          </div>
          <p className="text-red-200 text-sm">
            This access attempt has been logged. Unauthorized access is prohibited.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/login"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transition-all duration-300 hover:from-blue-500 hover:to-purple-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              🔑 Login
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </Link>
          
          <Link
            href="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-full transition-all duration-300 hover:from-gray-500 hover:to-gray-600 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              🏠 Go Home
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </Link>
        </div>

        {/* Security status */}
        <div className="mt-12 flex items-center justify-center gap-3 text-gray-400">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm">Security Level: High</span>
        </div>
      </div>
    </div>
  );
}