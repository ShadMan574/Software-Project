import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: Address[];
  orders: Order[];
  wishlist: string[];
}

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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  total: number;
  shippingAddress: Address;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing auth on mount
    const savedUser = localStorage.getItem('shadman-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    if (email === 'demo@shadman.com' && password === 'demo123') {
      const user: User = {
        id: '1',
        name: 'Demo User',
        email: 'demo@shadman.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        addresses: [],
        orders: [],
        wishlist: []
      };
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
      
      localStorage.setItem('shadman-user', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      addresses: [],
      orders: [],
      wishlist: []
    };
    
    setState({
      user,
      isAuthenticated: true,
      isLoading: false
    });
    
    localStorage.setItem('shadman-user', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('shadman-user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...data };
    setState(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('shadman-user', JSON.stringify(updatedUser));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (!state.user) return;
    
    const newAddress: Address = {
      ...address,
      id: Date.now().toString()
    };
    
    const updatedUser = {
      ...state.user,
      addresses: [...state.user.addresses, newAddress]
    };
    
    setState(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('shadman-user', JSON.stringify(updatedUser));
  };

  const updateAddress = (id: string, addressData: Partial<Address>) => {
    if (!state.user) return;
    
    const updatedUser = {
      ...state.user,
      addresses: state.user.addresses.map(addr =>
        addr.id === id ? { ...addr, ...addressData } : addr
      )
    };
    
    setState(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('shadman-user', JSON.stringify(updatedUser));
  };

  const deleteAddress = (id: string) => {
    if (!state.user) return;
    
    const updatedUser = {
      ...state.user,
      addresses: state.user.addresses.filter(addr => addr.id !== id)
    };
    
    setState(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('shadman-user', JSON.stringify(updatedUser));
  };

  const addToWishlist = (productId: string) => {
    if (!state.user) return;
    
    const updatedUser = {
      ...state.user,
      wishlist: [...state.user.wishlist, productId]
    };
    
    setState(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('shadman-user', JSON.stringify(updatedUser));
  };

  const removeFromWishlist = (productId: string) => {
    if (!state.user) return;
    
    const updatedUser = {
      ...state.user,
      wishlist: state.user.wishlist.filter(id => id !== productId)
    };
    
    setState(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('shadman-user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      addToWishlist,
      removeFromWishlist
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};