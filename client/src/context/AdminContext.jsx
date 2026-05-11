import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('pos_token');
    } catch (e) {
      return null;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('pos_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error parsing pos_user from localStorage', e);
      return null;
    }
  });
  const [restaurant, setRestaurant] = useState(() => {
    try {
      const savedRestaurant = localStorage.getItem('pos_restaurant');
      return savedRestaurant ? JSON.parse(savedRestaurant) : null;
    } catch (e) {
      console.error('Error parsing pos_restaurant from localStorage', e);
      return null;
    }
  });

  useEffect(() => {
    api.setToken(token);
    if (token) {
      localStorage.setItem('pos_token', token);
    } else {
      localStorage.removeItem('pos_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pos_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pos_user');
    }
  }, [user]);

  useEffect(() => {
    if (restaurant) {
      localStorage.setItem('pos_restaurant', JSON.stringify(restaurant));
    } else {
      localStorage.removeItem('pos_restaurant');
    }
  }, [restaurant]);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    setToken(response.token);
    setUser(response.user);
    setRestaurant(response.user.restaurant);
    return response;
  };

  const loginDemo = async () => {
    try {
      const response = await api.demoLogin();
      setToken(response.token);
      setUser(response.user);
      setRestaurant(response.user.restaurant);
      return response;
    } catch (error) {
      console.warn('Database unreachable. Launching Mock Demo Mode.', error);
      // Fallback to mock data for demo purposes
      const mockResponse = {
        token: 'mock-demo-token',
        user: {
          id: 'demo-user-id',
          name: 'Demo Manager',
          email: 'demo@respo.com',
          role: 'admin',
          restaurant: {
            id: 'demo-res-id',
            businessName: 'The Respo Bistro (Mock)',
            restaurantCode: 'RESPO-DEMO',
            adminCode: 'DEMO-ADMIN',
            slug: 'respo-bistro',
            primaryColor: '#ff8c42',
            secondaryColor: '#0f172a'
          }
        }
      };
      setToken(mockResponse.token);
      setUser(mockResponse.user);
      setRestaurant(mockResponse.user.restaurant);
      return mockResponse;
    }
  };

  const refreshProfile = async () => {
    if (!token) {
      return null;
    }

    const profile = await api.getMe();
    setUser(profile);
    setRestaurant(profile.restaurant);
    return profile;
  };

  const refreshRestaurant = async () => {
    if (!token) {
      return null;
    }

    const profile = await api.getRestaurantSettings();
    setRestaurant(profile);
    return profile;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRestaurant(null);
    api.setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      restaurant,
      login,
      loginDemo,
      logout,
      refreshProfile,
      refreshRestaurant
    }),
    [token, user, restaurant]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdmin must be used inside AdminProvider');
  }

  return context;
};
