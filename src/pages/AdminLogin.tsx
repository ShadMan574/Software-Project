import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, UserPlus } from 'lucide-react';
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
  const [showAdminSignup, setShowAdminSignup] = useState(false);
  const [name, setName] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const { adminLogin, adminSignup } = useAuth();
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

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { success, error } = await adminSignup(name, email, password, referralEmail);
      if (success) {
        toast({ title: 'Admin signup requested', description: 'Please verify your email before signing in as admin.' });
        setShowAdminSignup(false);
        setName('');
        setReferralEmail('');
      } else {
        toast({ title: 'Admin signup failed', description: error, variant: 'destructive' });
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
          {!showAdminSignup ? (
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
          ) : (
            <form onSubmit={handleAdminSignup} className="space-y-5">
              <div>
                <Label htmlFor="admin-signup-name">Full Name</Label>
                <div className="relative">
                  <Input id="admin-signup-name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" placeholder="Enter full name" required />
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="admin-signup-email">Admin Email</Label>
                <div className="relative">
                  <Input id="admin-signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="Enter admin email" required />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="admin-signup-password">Password</Label>
                <div className="relative">
                  <Input id="admin-signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" placeholder="Create strong password" required />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="admin-referral-email">Referral Email</Label>
                <div className="relative">
                  <Input id="admin-referral-email" type="email" value={referralEmail} onChange={(e) => setReferralEmail(e.target.value)} className="pl-10" placeholder="Enter a referral email address" required />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-xs text-amber-700">Use the approved previous admin email to request access.</p>
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600" disabled={isLoading}>
                {isLoading ? 'Please wait...' : 'Request Admin Access'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center space-y-2">
            <button type="button" onClick={() => setShowAdminSignup(!showAdminSignup)} className="text-sm font-medium text-amber-700 hover:text-amber-800">
              {showAdminSignup ? 'Back to admin sign in' : 'Create admin account'}
            </button>
            <div>
              <Link to="/login" className="text-sm text-primary hover:text-primary/80 font-medium">
                Back to user login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
