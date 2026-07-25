import { supabase } from '@/integrations/supabase/client';

export const deductOrderStock = async (orderId: string) => {
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  if (itemsError || !items) {
    throw itemsError ?? new Error('Unable to load order items');
  }

  for (const item of items) {
    if (!item.product_id) continue;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, stock')
      .eq('id', item.product_id)
      .maybeSingle();

    if (productError || !product) {
      throw productError ?? new Error('Unable to find product');
    }

    const availableStock = Number(product.stock ?? 0);
    const requestedQty = Number(item.quantity ?? 0);

    if (availableStock < requestedQty) {
      throw new Error(`Not enough stock for product ${item.product_id}`);
    }

    const nextStock = availableStock - requestedQty;
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: nextStock })
      .eq('id', item.product_id);

    if (updateError) {
      throw updateError;
    }
  }
};

export const restoreOrderStock = async (orderId: string) => {
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  if (itemsError || !items) {
    throw itemsError ?? new Error('Unable to load order items');
  }

  for (const item of items) {
    if (!item.product_id) continue;

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, stock')
      .eq('id', item.product_id)
      .maybeSingle();

    if (productError || !product) {
      throw productError ?? new Error('Unable to find product');
    }

    const nextStock = Number(product.stock ?? 0) + Number(item.quantity ?? 0);
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: nextStock })
      .eq('id', item.product_id);

    if (updateError) {
      throw updateError;
    }
  }
};
