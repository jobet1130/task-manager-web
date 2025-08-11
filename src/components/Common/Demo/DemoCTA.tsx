import React from 'react';
import Link from 'next/link';
import { Button } from '../UI/Button';
import { cn } from '@/lib/utils';

interface DemoCTAProps {
  className?: string;
}

export const DemoCTA: React.FC<DemoCTAProps> = ({ className }) => {
  return (
    <section className={cn(
      "py-16 px-4 sm:px-6 lg:px-8",
      className
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of teams who have already revolutionized their productivity. 
              Start your free trial today and experience the difference.
            </p>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-3 text-blue-100">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-blue-100">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-blue-100">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold text-lg transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
            </div>
            
            {/* Trust Badge */}
            <div className="mt-8 pt-8 border-t border-blue-400 border-opacity-30">
              <p className="text-blue-200 text-sm">
                🔒 Enterprise-grade security • 99.9% uptime guarantee • 24/7 support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};