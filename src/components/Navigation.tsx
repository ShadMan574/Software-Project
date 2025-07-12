import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart,
  Smartphone,
  Laptop,
  Watch,
  Tablet,
  Headphones,
  Gamepad
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { categories } from '@/data/products';

const categoryIcons = {
  smartphones: Smartphone,
  laptops: Laptop,
  smartwatches: Watch,
  tablets: Tablet,
  accessories: Headphones,
  gaming: Gamepad,
};

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { state: cartState } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="bg-white shadow-soft border-b sticky top-0 z-50">

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold gradient-text">Shadman</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-tech-gray'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/products') ? 'text-primary' : 'text-tech-gray'
              }`}
            >
              All Products
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium text-tech-gray hover:text-primary transition-colors">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-medium rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4 grid grid-cols-2 gap-2">
                  {categories.map((category) => {
                    const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
                    return (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-sm">{category.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/contact') ? 'text-primary' : 'text-tech-gray'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="w-5 h-5" />
                  {user?.wishlist && user.wishlist.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">
                      {user.wishlist.length}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartState.itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs bg-primary">
                    {cartState.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-medium rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      Order History
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      Wishlist
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors text-destructive"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="electric" size="sm">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 animate-fade-in">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="block py-2 text-base font-medium text-tech-gray hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="block py-2 text-base font-medium text-tech-gray hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Products
                </Link>
                
                {/* Mobile Categories */}
                <div className="space-y-2 pl-4">
                  {categories.map((category) => {
                    const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
                    return (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        className="flex items-center space-x-2 py-2 text-sm text-tech-gray hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <Link 
                  to="/contact" 
                  className="block py-2 text-base font-medium text-tech-gray hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};