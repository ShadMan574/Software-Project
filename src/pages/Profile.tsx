import React from 'react';
import { Navigate } from 'react-router-dom';
import { User, Package, LogOut, Shield } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { isAuthenticated, isLoading, user, logout, isAdmin } = useAuth();

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
              {user?.orders.length === 0 ? (
                <p className="text-tech-gray">No orders yet. Start shopping!</p>
              ) : (
                <div className="space-y-3">
                  {user?.orders.map(o => (
                    <div key={o.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{o.id.slice(0, 8)}</p>
                        <p className="text-sm text-tech-gray">{new Date(o.date).toLocaleDateString()}</p>
                        <span className="inline-block mt-1 text-xs bg-muted px-2 py-0.5 rounded-full capitalize">{o.status}</span>
                      </div>
                      <p className="font-bold">৳{o.total.toFixed(2)}</p>
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
