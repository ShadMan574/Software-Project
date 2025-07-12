import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Laptop, 
  Watch, 
  Tablet, 
  Headphones, 
  Gamepad,
  ArrowRight 
} from 'lucide-react';
import { categories } from '@/data/products';

const categoryIcons = {
  smartphones: Smartphone,
  laptops: Laptop,
  smartwatches: Watch,
  tablets: Tablet,
  accessories: Headphones,
  gaming: Gamepad,
};

const categoryImages = {
  smartphones: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop',
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  smartwatches: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop',
  tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
  gaming: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop',
};

export const Categories: React.FC = () => {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-tech-black mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-tech-gray max-w-2xl mx-auto">
            Explore our wide range of premium electronics organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
            const image = categoryImages[category.id as keyof typeof categoryImages];
            
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Category Icon */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-tech-black mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-tech-gray text-sm">
                    Discover the latest {category.name.toLowerCase()} from top brands
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};