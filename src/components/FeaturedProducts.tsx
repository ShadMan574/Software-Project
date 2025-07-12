import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { getPopularProducts, getNewProducts } from '@/data/products';

export const FeaturedProducts: React.FC = () => {
  const popularProducts = getPopularProducts().slice(0, 4);
  const newProducts = getNewProducts().slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Featured Products Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-tech-black mb-2">
                Featured Products
              </h2>
              <p className="text-tech-gray">
                Discover our collection of premium electronics
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="gap-2 group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};