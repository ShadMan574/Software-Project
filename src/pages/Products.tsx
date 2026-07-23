import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { categories, brands } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    const categoryParam = searchParams.get('category');
    const activeCats = categoryParam ? [categoryParam, ...selectedCategories] : selectedCategories;
    if (activeCats.length > 0) result = result.filter(p => activeCats.includes(p.category));
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
    if (priceRange.min) result = result.filter(p => p.price >= parseInt(priceRange.min));
    if (priceRange.max) result = result.filter(p => p.price <= parseInt(priceRange.max));
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
    return result;
  }, [products, searchParams, selectedCategories, selectedBrands, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategories([]); setSelectedBrands([]);
    setPriceRange({ min: '', max: '' }); setSortBy('popular'); setSearchParams({});
  };
  const activeFiltersCount = selectedCategories.length + selectedBrands.length + (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-tech-black mb-2">
            {searchParams.get('search') ? `Search Results for "${searchParams.get('search')}"` : 'All Products'}
          </h1>
          <p className="text-tech-gray">Showing {filteredProducts.length} of {products.length} products</p>
        </div>

        <div className="flex gap-8">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 space-y-6`}>
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-tech-black">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All ({activeFiltersCount})</Button>
                )}
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-tech-black mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2">
                      <Checkbox checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(c) => setSelectedCategories(c ? [...selectedCategories, category.id] : selectedCategories.filter(x => x !== category.id))} />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-tech-black mb-3">Brands</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center space-x-2">
                      <Checkbox checked={selectedBrands.includes(brand)}
                        onCheckedChange={(c) => setSelectedBrands(c ? [...selectedBrands, brand] : selectedBrands.filter(x => x !== brand))} />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-tech-black mb-3">Price Range</h4>
                <div className="space-y-2">
                  <Input type="number" placeholder="Min price" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} />
                  <Input type="number" placeholder="Max price" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-soft">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />Filters
                  {activeFiltersCount > 0 && <Badge className="ml-2 bg-primary">{activeFiltersCount}</Badge>}
                </Button>
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant={viewMode === 'grid' ? 'electric' : 'outline'} size="sm" onClick={() => setViewMode('grid')}><Grid className="w-4 h-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'electric' : 'outline'} size="sm" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
                </div>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <p className="text-center py-12 text-tech-gray">Loading products...</p>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} className={viewMode === 'list' ? 'flex' : ''} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-tech-black mb-2">No products found</h3>
                <p className="text-tech-gray mb-4">Try adjusting your filters</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
