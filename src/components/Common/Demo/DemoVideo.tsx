'use client'

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface DemoVideoProps {
  className?: string;
  videoId?: string; // YouTube video ID
  videoUrl?: string; // Direct video URL
}

export const DemoVideo: React.FC<DemoVideoProps> = ({ 
  className, 
  videoId = "dQw4w9WgXcQ", // Default placeholder
  videoUrl 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
    setShowVideo(true);
  };

  return (
    <section className={cn(
      "py-12 px-4 sm:px-6 lg:px-8",
      className
    )}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative">
            {!showVideo ? (
              // Video Thumbnail/Placeholder
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center cursor-pointer group"
                   onClick={handlePlayClick}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>
                
                {/* Play Button with loading state */}
                <div className="relative z-10 text-center">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all shadow-2xl",
                    isPlaying 
                      ? "bg-gray-600 cursor-not-allowed" 
                      : "bg-blue-600 group-hover:bg-blue-700 cursor-pointer"
                  )}>
                    {isPlaying ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isPlaying ? "Loading Video..." : "TaskFlow Product Demo"}
                  </h3>
                  <p className="text-gray-300 text-lg">
                    {isPlaying ? "Please wait" : "See how teams boost productivity by 40%"}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {isPlaying ? "" : "5:32 minutes • Click to play"}
                  </p>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
            ) : (
              // Actual Video
              <div className="aspect-video">
                {videoUrl ? (
                  <video 
                    className="w-full h-full" 
                    controls 
                    autoPlay
                    src={videoUrl}
                    onLoadStart={() => setIsPlaying(false)}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe 
                    className="w-full h-full" 
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title="TaskFlow Demo" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    onLoad={() => setIsPlaying(false)}
                  ></iframe>
                )}
              </div>
            )}
          </div>
          
          {/* Video Info */}
          <div className="p-6 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">What you&apos;ll see in this demo:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Complete task management workflow</li>
                  <li>• Real-time team collaboration features</li>
                  <li>• Advanced reporting and analytics</li>
                  <li>• Mobile and desktop experience</li>
                </ul>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <div className="text-sm text-gray-500 mb-2">Duration: 5:32</div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Quality:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">HD 1080p</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};