import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-surface">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            
            <h1 className="text-4xl lg:text-6xl font-bold text-tech-black mb-6 leading-tight">
              Premium
              <span className="gradient-text block">Gadgets</span>
              for Tech Lovers
            </h1>
            
            <p className="text-lg text-tech-gray mb-8 leading-relaxed">
              Discover the latest smartphones, laptops, smartwatches, and accessories 
              from top brands. Quality guaranteed, fast shipping, and unbeatable prices.
            </p>
            
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-tech-black">Free Shipping</p>
                  <p className="text-xs text-tech-gray">On orders $99+</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-tech-black">2-Year Warranty</p>
                  <p className="text-xs text-tech-gray">On all products</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-tech-black">Fast Support</p>
                  <p className="text-xs text-tech-gray">24/7 available</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop"
                alt="Electronics Store"
                className="w-full h-auto rounded-2xl shadow-strong"
              />
              
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-gradient-primary rounded-full opacity-20 blur-xl"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-primary-glow rounded-full opacity-30 blur-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};