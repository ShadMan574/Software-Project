import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, UserPlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminSignup, setShowAdminSignup] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [name, setName] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const { adminLogin, adminSignup, adminResetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (resetMode) {
        const { success, error } = await adminResetPassword(email);
        if (success) {
          toast({ title: 'Check your email', description: 'We sent you a password reset link.' });
          setResetMode(false);
        } else {
          toast({ title: 'Error', description: error, variant: 'destructive' });
        }
      } else {
        const { success, error } = await adminLogin(email, password);
        if (success) {
          toast({ title: 'Admin access granted', description: 'You have been signed in as an administrator.' });
          navigate('/admin');
        } else {
          toast({ title: 'Admin login failed', description: error, variant: 'destructive' });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password too short', description: 'Use at least 6 characters.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const { success, error, loginEmail } = await adminSignup(name, password, referralEmail);
      if (success) {
        toast({
          title: 'Admin account created',
          description: loginEmail
            ? `Your admin login email is ${loginEmail}. Save it to sign in.`
            : 'Admin account created successfully.',
        });
        setShowAdminSignup(false);
        setName('');
        setReferralEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast({ title: 'Admin signup failed', description: error, variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const heading = showAdminSignup ? 'Admin sign up' : resetMode ? 'Reset admin password' : 'Admin sign in';
  const subheading = showAdminSignup
    ? 'Create a new administrator account'
    : resetMode
    ? "Enter your admin email and we'll send a reset link"
    : 'Enter your admin credentials to continue';

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
          <h2 className="text-3xl font-bold text-tech-black">{heading}</h2>
          <p className="mt-2 text-tech-gray">{subheading}</p>
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

              {!resetMode && (
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
                  <button type="button" onClick={() => setResetMode(true)} className="text-xs text-amber-700 hover:underline mt-2">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white hover:from-amber-600 hover:via-orange-600 hover:to-red-600" disabled={isLoading}>
                {isLoading ? 'Please wait...' : resetMode ? 'Send reset link' : 'Sign In as Admin'}
              </Button>

              {resetMode && (
                <button type="button" onClick={() => setResetMode(false)} className="text-sm text-primary hover:underline w-full text-center">
                  Back to admin sign in
                </button>
              )}
            </form>
          ) : (
            <form onSubmit={handleAdminSignup} className="space-y-5">
              <div>
                <Label htmlFor="admin-signup-name">Full Name</Label>
                <div className="relative">
                  <Input id="admin-signup-name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" placeholder="Enter full name" required />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="admin-signup-password">Password</Label>
                <div className="relative">
                  <Input id="admin-signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" placeholder="Create strong password" required minLength={6} />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="admin-signup-confirm">Confirm Password</Label>
                <div className="relative">
                  <Input id="admin-signup-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" placeholder="Confirm your password" required minLength={6} />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="admin-referral-email">Referral Email</Label>
                <div className="relative">
                  <Input id="admin-referral-email" type="email" value={referralEmail} onChange={(e) => setReferralEmail(e.target.value)} className="pl-10" placeholder="Enter an existing admin's email" required />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-xs text-amber-700">Must match an existing admin's email to be approved.</p>
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600" disabled={isLoading}>
                {isLoading ? 'Please wait...' : 'Create Admin Account'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center space-y-2">
            {!resetMode && (
              <button
                type="button"
                onClick={() => {
                  setShowAdminSignup(!showAdminSignup);
                  setResetMode(false);
                }}
                className="text-sm font-medium text-amber-700 hover:text-amber-800"
              >
                {showAdminSignup ? 'Back to admin sign in' : 'Create admin account'}
              </button>
            )}
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
