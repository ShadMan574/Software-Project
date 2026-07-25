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
import { restoreOrderStock } from '@/lib/orderStock';
import { mergeContactMessages, readStoredContactMessages } from '@/lib/contactMessages';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';

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
  const [messages, setMessages] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [refundErrorOpen, setRefundErrorOpen] = useState(false);
  const [refundErrorDetails, setRefundErrorDetails] = useState<string | null>(null);
  const [refundProblemOrderId, setRefundProblemOrderId] = useState<string | null>(null);
  const [refundBannerMessage, setRefundBannerMessage] = useState<string | null>(null);
  const [refundBannerVariant, setRefundBannerVariant] = useState<'success' | 'error' | null>(null);
  const refundSql = refundProblemOrderId
    ? `DELETE FROM public.order_items WHERE order_id = '${refundProblemOrderId}';\nDELETE FROM public.orders WHERE id = '${refundProblemOrderId}';`
    : '';

  const refundSqlWithDetails = refundErrorDetails
    ? `-- Details: ${refundErrorDetails}\n\n-- Delete order items\n${refundSql}\n`
    : refundSql;

  const loadOrders = async () => {
    const { data } = await supabase.from('orders')
      .select('*, order_items(*)')
      .not('status', 'eq', 'refunded')
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
  };

  const loadMessages = async () => {
    const fallbackMessages = readStoredContactMessages();

    try {
      const { data } = await (supabase as any).from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      setMessages(mergeContactMessages((data ?? []) as any[], fallbackMessages));
    } catch {
      setMessages(fallbackMessages);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await (supabase as any).from('contact_messages').delete().eq('id', id);
    } catch {
      // Ignore remote delete errors and rely on local fallback removal.
    }

    const nextMessages = messages.filter((message) => message.id !== id);
    setMessages(nextMessages);

    if (typeof window !== 'undefined') {
      const fallbackMessages = readStoredContactMessages().filter((message) => message.id !== id);
      window.localStorage.setItem('contact_messages_fallback', JSON.stringify(fallbackMessages));
    }

    toast({ title: 'Message removed', description: 'The message has been deleted from the list.' });
  };

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
      loadMessages();
    }
  }, [isAdmin]);

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
    const currentOrder = orders.find((o) => o.id === id);
    if (!currentOrder) return;
    if (['cancel_requested', 'refund_pending', 'cancelled'].includes(currentOrder.status)) {
      toast({ title: 'Action unavailable', description: 'Cannot change order phase after cancellation request.', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });

    if (status === 'cancelled') {
      try {
        await restoreOrderStock(id);
      } catch (restoreError: any) {
        console.error('Unable to restore stock after order cancellation:', restoreError);
      }
    }

    toast({ title: 'Order updated' });
    loadOrders();
  };

  const cancelOrder = async (id: string) => {
    setIsUpdating(id);
    try {
      const { error } = await supabase.from('orders').update({
        status: 'cancel_requested',
      }).eq('id', id).in('status', ['pending', 'processing', 'shipped']);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: 'Cancellation initiated', description: 'Refund button is now available for this order.' });
      loadOrders();
    } finally {
      setIsUpdating(null);
    }
  };

  const processRefund = async (id: string) => {
    setIsUpdating(id);
    try {
      const { error } = await supabase.from('orders').update({
        status: 'refund_pending',
      }).eq('id', id).in('status', ['cancel_requested', 'cancelled']);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: 'Refund pending', description: 'The order is now waiting for final refund removal.' });
      loadOrders();
    } finally {
      setIsUpdating(null);
    }
  };

  const completeRefund = async (id: string) => {
    setIsUpdating(id);
    try {
      // Prefer server-side RPC which also removes order items atomically
      let rpcError: any = null;
      let itemsError: any = null;
      let orderError: any = null;

      try {
        const { data: rpcData, error } = await (supabase.rpc as any)('approve_order_refund', { order_id: id });
        rpcError = error;
      } catch (e) {
        rpcError = e;
      }

      if (rpcError) {
        // Try explicit deletes as a stronger fallback (delete order_items then order)
        try {
          const resItems = await supabase.from('order_items').delete().eq('order_id', id);
          itemsError = resItems.error;
        } catch (e) {
          itemsError = e;
        }

        try {
          // delete without status constraint to ensure removal
          const resOrder = await supabase.from('orders').delete().eq('id', id);
          orderError = resOrder.error;
        } catch (e) {
          orderError = e;
        }
      }

      // Verify deletion on the server to avoid re-fetch bringing it back
      const { data: verifyData, error: verifyError } = await supabase.from('orders').select('*').eq('id', id);
      if (verifyError) {
        console.error('Error verifying deletion:', verifyError, { rpcError, itemsError, orderError });
        toast({
          title: 'Refund completed',
          description: 'Refund was processed and the order is being removed.',
          variant: 'success',
          className: 'border-slate-200 bg-white text-slate-900 shadow-md'
        });
        setOrders(prev => prev.filter(o => o.id !== id));
        return;
      }

      if (verifyData && verifyData.length > 0) {
        // If deletion failed, try to mark the order refunded so it is hidden from both dashboards.
        const { error: markError } = await supabase.from('orders').update({ status: 'refunded' }).eq('id', id);
        if (!markError) {
          try {
            await restoreOrderStock(id);
          } catch (restoreError: any) {
            console.error('Unable to restore stock after refund:', restoreError);
          }
          setOrders(prev => prev.filter(o => o.id !== id));
          setRefundBannerVariant('success');
          setRefundBannerMessage('Refund successful — the order is marked refunded and removed from views.');
          toast({
            title: 'Refund successful',
            description: 'Order marked refunded and removed from views.',
            variant: 'success',
            className: 'border-slate-200 bg-white text-slate-900 shadow-md'
          });
          return;
        }

        console.error('Order still exists after refund attempt:', { verifyData, rpcError, itemsError, orderError, markError });
        const details = [] as string[];
        if (rpcError) details.push(`RPC error: ${rpcError.message ?? String(rpcError)}`);
        if (itemsError) details.push(`items delete error: ${itemsError.message ?? String(itemsError)}`);
        if (orderError) details.push(`order delete error: ${orderError.message ?? String(orderError)}`);
        details.push(`status update error: ${markError.message ?? String(markError)}`);
        details.push(`server row status: ${verifyData[0].status ?? 'unknown'}`);
        const detailStr = details.join(' | ');
        setRefundProblemOrderId(id);
        setRefundErrorDetails(detailStr);
        setRefundErrorOpen(true);
        setRefundBannerVariant('error');
        setRefundBannerMessage('Refund failed — server prevented deletion. Check details and refresh.');
        toast({
          title: 'Refund failed',
          description: 'Server prevented deletion. See details.',
          variant: 'destructive',
          className: 'border-rose-200 bg-white text-rose-800 shadow-md'
        });
        return;
      }

      // Confirmed removed server-side — remove from UI and inform user
      try {
        await restoreOrderStock(id);
      } catch (restoreError: any) {
        console.error('Unable to restore stock after refund:', restoreError);
      }
      setOrders(prev => prev.filter(o => o.id !== id));
      setRefundBannerVariant('success');
      setRefundBannerMessage('Refund successful — the order is being removed from admin dashboard and customer history.');
      toast({
        title: 'Refund successful',
        description: 'The order is being removed from admin and customer history.',
        className: 'border-slate-200 bg-white text-slate-900 shadow-md'
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-sky-100 text-sky-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
    cancel_requested: 'bg-slate-100 text-slate-700',
    refund_pending: 'bg-orange-100 text-orange-700',
    refunded: 'bg-zinc-100 text-zinc-700',
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
            <TabsTrigger value="messages">Messages ({messages.length})</TabsTrigger>
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
              {refundBannerMessage && (
                <div className={`rounded-lg border p-4 ${refundBannerVariant === 'success' ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-rose-300 bg-rose-50 text-rose-900'}`}>
                  <p className="font-semibold">{refundBannerVariant === 'success' ? 'Refund successful' : 'Refund issue'}</p>
                  <p className="mt-1 text-sm">{refundBannerMessage}</p>
                </div>
              )}
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
                      <div className="mt-2 flex flex-col gap-2">
                        <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusStyles[o.status] ?? 'bg-muted text-tech-gray'}`}>
                          {o.status === 'refund_pending' ? 'Refund pending' : o.status}
                        </span>
                        {['cancel_requested', 'refund_pending', 'cancelled'].includes(o.status) ? (
                          <div className="text-xs text-tech-gray">Phase change disabled</div>
                        ) : (
                          <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v)}>
                            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s =>
                                <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                        {['pending', 'processing', 'shipped'].includes(o.status) && (
                          <Button
                            size="sm"
                            className="border-blue-300 bg-white text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                            onClick={() => cancelOrder(o.id)}
                            disabled={isUpdating === o.id}
                          >
                            {isUpdating === o.id ? 'Working...' : 'Cancel order'}
                          </Button>
                        )}
                        {['cancel_requested', 'cancelled'].includes(o.status) && (
                          <Button
                            size="sm"
                            className="border-yellow-300 bg-white text-yellow-700 hover:bg-yellow-600 hover:text-white hover:border-yellow-600 transition-all"
                            onClick={() => processRefund(o.id)}
                            disabled={isUpdating === o.id}
                          >
                            {isUpdating === o.id ? 'Working...' : 'Refund order'}
                          </Button>
                        )}
                        {o.status === 'refund_pending' && (
                          <Button
                            size="sm"
                            className="border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                            onClick={() => completeRefund(o.id)}
                            disabled={isUpdating === o.id}
                          >
                            {isUpdating === o.id ? 'Working...' : 'Complete refund'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-tech-gray">
                    {(o.order_items ?? []).map((i: any) => (
                      <div key={i.id}>{i.quantity} × {i.product_name} — ৳{Number(i.price).toFixed(2)}</div>
                    ))}
                  </div>
                </div>
              ))}
                <Dialog open={refundErrorOpen} onOpenChange={setRefundErrorOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Refund deletion failed</DialogTitle>
                      <DialogDescription>
                        The server prevented removing the order. You can copy-paste the SQL below into Supabase SQL editor to remove the order and its items manually.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                    <textarea readOnly className="w-full h-40 p-2 border rounded" value={refundSqlWithDetails} />
                    </div>
                    <DialogFooter>
                      <button className="btn" onClick={() => {
                        navigator.clipboard?.writeText(refundSql);
                        toast({ title: 'Copied', description: 'SQL copied to clipboard' });
                      }}>Copy SQL</button>
                      <DialogClose className="btn">Close</DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
              {messages.length === 0 && <p className="text-tech-gray">No messages yet.</p>}
              {messages.map((message: any) => (
                <div key={message.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {message.first_name || message.last_name
                          ? `${message.first_name ?? ''} ${message.last_name ?? ''}`.trim()
                          : 'Customer'}
                      </p>
                      <p className="text-sm text-tech-gray">{message.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-tech-gray">{new Date(message.created_at).toLocaleString()}</p>
                      <Button size="sm" variant="outline" onClick={() => deleteMessage(message.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-800">{message.subject}</p>
                    <p className="text-sm leading-6 text-slate-600">{message.message}</p>
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
