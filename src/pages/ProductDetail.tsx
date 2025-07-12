import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/data/products';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isAuthenticated, user, addToWishlist, removeFromWishlist } = useAuth();
  const { toast } = useToast();

  const product = products.find(p => p.id === id);
  
  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isInWishlist = user?.wishlist?.includes(product.id) || false;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-tech-gray mb-8">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-primary">Products</a>
          <span className="mx-2">/</span>
          <span className="text-tech-black">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl shadow-soft overflow-hidden">
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg shadow-soft overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}

            {/* Title and Brand */}
            <div>
              <p className="text-primary font-medium text-sm uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl font-bold text-tech-black mb-4">
                {product.name}
              </h1>
            </div>


            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-tech-black">
                ৳{product.price.toLocaleString()}
              </span>
            </div>

            {/* Description */}
            <p className="text-tech-gray leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${
                product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></span>
              <span className="text-sm font-medium">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 gap-2"
                variant="electric"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlistToggle}
                className={isInWishlist ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-tech-gray">On orders over $99</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">2-Year Warranty</p>
                <p className="text-xs text-tech-gray">Manufacturer warranty</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-tech-gray">Easy return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-tech-gray">{key}:</span>
                      <span className="text-tech-black">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-tech-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                <div className="text-center py-8">
                  <p className="text-tech-gray">Reviews feature coming soon!</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-tech-black mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;