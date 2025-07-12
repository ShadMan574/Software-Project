import React from 'react';
import { Navigate } from 'react-router-dom';
import { User, Settings, Package, Heart, LogOut } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
              <p className="text-tech-gray">{user?.email}</p>
            </div>
            
            <div className="mt-6 space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Settings className="w-4 h-4" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Package className="w-4 h-4" />
                Order History
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Heart className="w-4 h-4" />
                Wishlist
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
              <p className="text-tech-gray">No orders yet. Start shopping to see your orders here!</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;