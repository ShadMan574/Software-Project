import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-tech-black text-white">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold">Shadman Electronics</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for premium electronics. We bring you the latest 
              technology with exceptional service and unbeatable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-300 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/products?category=smartphones" className="text-gray-300 hover:text-primary transition-colors">Smartphones</Link></li>
              <li><Link to="/products?category=laptops" className="text-gray-300 hover:text-primary transition-colors">Laptops</Link></li>
              <li><Link to="/products?category=smartwatches" className="text-gray-300 hover:text-primary transition-colors">Smartwatches</Link></li>
              <li><Link to="/products?category=accessories" className="text-gray-300 hover:text-primary transition-colors">Accessories</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-300 hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-primary transition-colors">Returns</Link></li>
              <li><Link to="/warranty" className="text-gray-300 hover:text-primary transition-colors">Warranty</Link></li>
              <li><Link to="/track-order" className="text-gray-300 hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link to="/size-guide" className="text-gray-300 hover:text-primary transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    Rajshahi University of Engineering<br />
                    and Technology<br />
                    Rajshahi, Bangladesh
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-gray-300">+8801*******</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-gray-300">shadmanaziz5@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <p className="text-gray-300 text-sm">
              © 2024 Shadman Electronics. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <Link to="/privacy" className="text-gray-300 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-300 hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Accepted payments:</span>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-5 bg-gray-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">VISA</span>
              </div>
              <div className="w-8 h-5 bg-gray-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">MC</span>
              </div>
              <div className="w-8 h-5 bg-pink-500 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">bKash</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};