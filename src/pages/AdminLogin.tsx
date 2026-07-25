import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { success, error } = await adminLogin(email, password);
      if (success) {
        toast({ title: 'Admin access granted', description: 'You have been signed in as an administrator.' });
        navigate('/admin');
      } else {
        toast({ title: 'Admin login failed', description: error, variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold gradient-text">Shadman</span>
          </Link>
          <div className="inline-flex items-center justify-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 mb-4">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Admin Access
          </div>
          <h2 className="text-3xl font-bold text-tech-black">Admin sign in</h2>
          <p className="mt-2 text-tech-gray">Enter your admin credentials to continue</p>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <div className="relative">
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter admin email"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter admin password"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white hover:from-amber-600 hover:via-orange-600 hover:to-red-600" disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Sign In as Admin'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:text-primary/80 font-medium">
              Back to user login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
