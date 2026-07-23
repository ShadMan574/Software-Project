import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';

const Wishlist: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { products, loading } = useProducts();

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const items = products.filter((p) => user?.wishlist?.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-7 h-7 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-tech-black">My Wishlist</h1>
          <span className="text-tech-gray">({items.length})</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-tech-gray">Loading your wishlist...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-soft">
            <Heart className="w-16 h-16 text-tech-gray/40 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-tech-black mb-2">Your wishlist is empty</h2>
            <p className="text-tech-gray mb-6">Save products you love by tapping the heart icon.</p>
            <Link to="/products">
              <Button>Browse products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
