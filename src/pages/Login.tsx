import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const { login, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (resetMode) {
        const { success, error } = await resetPassword(email);
        if (success) {
          toast({ title: 'Check your email', description: 'We sent you a password reset link.' });
          setResetMode(false);
        } else {
          toast({ title: 'Error', description: error, variant: 'destructive' });
        }
      } else {
        const { success, error } = await login(email, password);
        if (success) {
          toast({ title: 'Welcome back!', description: 'You have been signed in.' });
          navigate('/');
        } else {
          toast({ title: 'Login failed', description: error, variant: 'destructive' });
        }
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
          <h2 className="text-3xl font-bold text-tech-black">
            {resetMode ? 'Reset password' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-tech-gray">
            {resetMode ? "Enter your email and we'll send a reset link" : 'Sign in to your account'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10" placeholder="Enter your email" required />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {!resetMode && (
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10"
                    placeholder="Enter your password" required />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                <button type="button" onClick={() => setResetMode(true)}
                  className="text-xs text-primary hover:underline mt-2">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" variant="electric" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Please wait...' : resetMode ? 'Send reset link' : 'Sign In'}
            </Button>

            {resetMode && (
              <button type="button" onClick={() => setResetMode(false)}
                className="text-sm text-primary hover:underline w-full text-center">
                Back to sign in
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-tech-gray">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
