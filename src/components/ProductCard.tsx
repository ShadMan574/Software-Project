import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  const { isAuthenticated, user, addToWishlist, removeFromWishlist } = useAuth();
  const { toast } = useToast();

  const isInWishlist = user?.wishlist?.includes(product.id) || false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to be logged in to use the wishlist.",
        variant: "destructive",
      });
      return;
    }

    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <div className={`product-card bg-white rounded-xl shadow-soft border group relative overflow-hidden ${className}`}>
      {/* Badges */}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${
            isInWishlist ? 'text-red-500 fill-current' : 'text-tech-gray'
          }`} 
        />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="electric" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Brand & Category */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-primary font-medium uppercase tracking-wider">
              {product.brand}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-tech-black mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-tech-black">
              ৳{product.price.toLocaleString()}
            </span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-5 pb-5">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full gap-2"
          variant={product.stock === 0 ? "secondary" : "electric"}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};