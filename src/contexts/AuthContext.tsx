import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';


export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  items: any[];
  total: number;
  shippingAddress: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: Address[];
  orders: Order[];
  wishlist: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminSignup: (name: string, email: string, password: string, referralEmail: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshUserData: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = async (userId: string, email: string) => {
    const [profileRes, rolesRes, addressesRes, wishlistRes, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId),
      supabase.from('addresses').select('*').eq('user_id', userId),
      supabase.from('wishlist').select('product_id').eq('user_id', userId),
      supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    const profile = profileRes.data;
    setIsAdmin((rolesRes.data ?? []).some((r: any) => r.role === 'admin'));

    setUser({
      id: userId,
      name: profile?.name ?? email.split('@')[0],
      email: profile?.email ?? email,
      avatar: profile?.avatar ?? undefined,
      addresses: (addressesRes.data ?? []).map((a: any) => ({
        id: a.id, type: a.type, firstName: a.first_name, lastName: a.last_name,
        address: a.address, city: a.city, state: a.state, zipCode: a.zip_code,
        country: a.country, isDefault: a.is_default,
      })),
      orders: (ordersRes.data ?? []).map((o: any) => ({
        id: o.id, date: o.created_at, status: o.status, items: [],
        total: Number(o.total), shippingAddress: o.shipping_address,
      })),
      wishlist: (wishlistRes.data ?? []).map((w: any) => w.product_id),
    });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setTimeout(() => {
          loadUserData(newSession.user.id, newSession.user.email ?? '');
        }, 0);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        loadUserData(s.user.id, s.user.email ?? '').finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const adminLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      await supabase.auth.signOut();
      return { success: false, error: 'Unable to verify admin access.' };
    }

    const { data: rolesData, error: rolesError } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
    if (rolesError) {
      await supabase.auth.signOut();
      return { success: false, error: 'Unable to verify admin access.' };
    }

    const isAdminUser = (rolesData ?? []).some((role: any) => role.role === 'admin');
    if (!isAdminUser) {
      await supabase.auth.signOut();
      return { success: false, error: 'This account does not have admin privileges.' };
    }

    return { success: true };
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const adminSignup = async (name: string, email: string, password: string, referralEmail: string) => {
    const trimmedReferral = referralEmail.trim().toLowerCase();
    if (!trimmedReferral) {
      return { success: false, error: 'Please enter a referral email address.' };
    }

    const { data: referralUsers, error: referralError } = await supabase
      .from('profiles')
      .select('email')
      .ilike('email', trimmedReferral);

    if (referralError) {
      return { success: false, error: referralError.message };
    }

    const isValidReferral = (referralUsers ?? []).some((profile: any) => profile.email?.toLowerCase() === trimmedReferral);
    if (!isValidReferral) {
      return { success: false, error: 'Referral email does not match any existing admin account.' };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin-login`,
        data: { name, is_admin_signup: true },
      },
    });

    if (error) return { success: false, error: error.message };

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (userId) {
        await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
      }
    } catch {
      // Ignore role assignment errors; the signup still proceeds.
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const refreshUserData = async () => {
    if (session?.user) await loadUserData(session.user.id, session.user.email ?? '');
  };

  const addAddress = async (a: Omit<Address, 'id'>) => {
    if (!user) return;
    await supabase.from('addresses').insert({
      user_id: user.id, type: a.type, first_name: a.firstName, last_name: a.lastName,
      address: a.address, city: a.city, state: a.state, zip_code: a.zipCode,
      country: a.country, is_default: a.isDefault,
    });
    await refreshUserData();
  };

  const deleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    await refreshUserData();
  };

  const addToWishlist = async (productId: string) => {
    if (!user) return;
    await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId });
    setUser({ ...user, wishlist: [...user.wishlist, productId] });
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
    setUser({ ...user, wishlist: user.wishlist.filter(id => id !== productId) });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!session,
      isLoading,
      isAdmin,
      login, adminLogin, signup, adminSignup, logout, resetPassword, refreshUserData,
      addAddress, deleteAddress, addToWishlist, removeFromWishlist,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
