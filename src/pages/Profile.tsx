import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Package, LogOut, Shield } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { isAuthenticated, isLoading, user, logout, isAdmin, refreshUserData } = useAuth();
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = async () => {
    if (!user?.id) {
      setOrders([]);
      return;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .not('status', 'eq', 'refunded')
      .order('created_at', { ascending: false });

    if (!error) {
      setOrders(data ?? []);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    loadOrders();

    const channel = supabase
      .channel(`profile-orders-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` }, () => {
        loadOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

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

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    setIsCancelling(orderId);
    try {
      const { error } = await supabase.from('orders').update({
        status: 'cancel_requested',
      }).eq('id', orderId).eq('user_id', user.id).in('status', ['pending', 'processing']);

      if (error) {
        toast({ title: 'Cancellation failed', description: error.message, variant: 'destructive' });
        return;
      }

      toast({ title: 'Cancellation requested', description: 'Your request has been sent. Admin can now issue a refund.' });
      await loadOrders();
      await refreshUserData();
    } finally {
      setIsCancelling(null);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-tech-black mb-8">My Profile</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-tech-black">{user?.name}</h2>
              <p className="text-tech-gray break-all">{user?.email}</p>
              {isAdmin && (
                <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                  Admin
                </span>
              )}
            </div>
            <div className="mt-6 space-y-2">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Shield className="w-4 h-4" /> Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={logout}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" /> Order History
              </h3>
              {orders.length === 0 ? (
                <p className="text-tech-gray">No orders yet. Start shopping!</p>
              ) : (
                <div className="space-y-3">
                  {orders.filter(o => o.status !== 'refunded').map(o => (
                    <div key={o.id} className="border rounded-lg p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium">Order #{o.id.slice(0, 8)}</p>
                        <p className="text-sm text-tech-gray">{new Date(o.created_at).toLocaleDateString()}</p>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full capitalize ${statusStyles[o.status] ?? 'bg-muted text-tech-gray'}`}>
                          {o.status === 'refund_pending' ? 'Refund pending' : o.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold">৳{Number(o.total).toFixed(2)}</p>
                        {['pending', 'processing'].includes(o.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                            onClick={() => handleCancelOrder(o.id)}
                            disabled={isCancelling === o.id}
                          >
                            {isCancelling === o.id ? 'Processing...' : 'Cancel order'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
