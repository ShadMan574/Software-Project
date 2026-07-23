import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/data/products';
import { Trash2, Pencil } from 'lucide-react';

const emptyForm = {
  name: '', price: '', category: 'smartphones', brand: '', image: '',
  description: '', stock: '', is_popular: false, is_new: false,
};

const Admin: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const { products, refetch } = useProducts();
  const { toast } = useToast();
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    setOrders(data ?? []);
  };

  useEffect(() => { if (isAdmin) loadOrders(); }, [isAdmin]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name, price: Number(form.price), category: form.category, brand: form.brand,
      image: form.image, images: [form.image], description: form.description,
      stock: Number(form.stock), is_popular: form.is_popular, is_new: form.is_new,
    };
    const { error } = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert(payload);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: editingId ? 'Product updated' : 'Product created' });
    setForm(emptyForm);
    setEditingId(null);
    refetch();
  };

  const edit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name, price: String(p.price), category: p.category, brand: p.brand,
      image: p.image, description: p.description, stock: String(p.stock),
      is_popular: !!p.isPopular, is_new: !!p.isNew,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Deleted' });
    refetch();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Order updated' });
    loadOrders();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-8">
            <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-soft space-y-4">
              <h2 className="text-xl font-semibold">{editingId ? 'Edit product' : 'Add product'}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><Label>Brand</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required /></div>
                <div><Label>Price (৳)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} /> Popular</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> New</label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="electric">{editingId ? 'Update' : 'Create'}</Button>
                {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>}
              </div>
            </form>

            <div className="bg-white rounded-xl shadow-soft">
              <table className="w-full">
                <thead className="bg-muted"><tr>
                  <th className="text-left p-3">Product</th><th className="text-left p-3">Brand</th>
                  <th className="text-left p-3">Price</th><th className="text-left p-3">Stock</th><th className="p-3"></th>
                </tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t">
                      <td className="p-3 flex items-center gap-3"><img src={p.image} className="w-10 h-10 rounded object-cover" alt="" />{p.name}</td>
                      <td className="p-3">{p.brand}</td>
                      <td className="p-3">৳{p.price.toLocaleString()}</td>
                      <td className="p-3">{p.stock}</td>
                      <td className="p-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => edit(p)}><Pencil className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline" onClick={() => remove(p.id)}><Trash2 className="w-4 h-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
              {orders.length === 0 && <p className="text-tech-gray">No orders yet.</p>}
              {orders.map(o => (
                <div key={o.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Order #{o.id.slice(0, 8)}</p>
                      <p className="text-sm text-tech-gray">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">৳{Number(o.total).toFixed(2)}</p>
                      <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v)}>
                        <SelectTrigger className="w-36 mt-2"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s =>
                            <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-sm text-tech-gray">
                    {(o.order_items ?? []).map((i: any) => (
                      <div key={i.id}>{i.quantity} × {i.product_name} — ৳{Number(i.price).toFixed(2)}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
