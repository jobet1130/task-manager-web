import React from 'react';
import Link from 'next/link';
import { Button } from '../UI/Button';

interface DemoHeaderProps {
  className?: string;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({ className }) => {
  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            TaskFlow
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="/#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
              Testimonials
            </Link>
            <Link href="/watch-demo" className="text-blue-600 font-medium">
              Demo
            </Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};