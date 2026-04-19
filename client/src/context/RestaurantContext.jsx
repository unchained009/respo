import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshRestaurant = async () => {
    setLoading(true);

    try {
      const data = await api.getPublicRestaurant();
      setRestaurant(data);
      setError('');
      return data;
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load restaurant profile.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRestaurant();
  }, []);

  const value = useMemo(
    () => ({
      restaurant,
      loading,
      error,
      refreshRestaurant
    }),
    [restaurant, loading, error]
  );

  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>;
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);

  if (!context) {
    throw new Error('useRestaurant must be used inside RestaurantProvider');
  }

  return context;
};
