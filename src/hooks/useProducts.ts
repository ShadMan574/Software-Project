import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/data/products';

export function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    category: row.category,
    brand: row.brand,
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description ?? '',
    specifications: (row.specifications ?? {}) as Record<string, string>,
    features: Array.isArray(row.features) ? row.features : [],
    reviews: row.reviews ?? 0,
    stock: row.stock ?? 0,
    isPopular: row.is_popular,
    isNew: row.is_new,
    discount: row.discount ?? undefined,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts((data ?? []).map(mapProduct));
    setLoading(false);
  };

  useEffect(() => { refetch(); }, []);
  return { products, loading, refetch };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    supabase.from('products').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      setProduct(data ? mapProduct(data) : null);
      setLoading(false);
    });
  }, [id]);

  return { product, loading };
}
