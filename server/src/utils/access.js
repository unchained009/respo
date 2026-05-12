import crypto from 'crypto';

export const generateAccessToken = () => crypto.randomBytes(18).toString('hex');

export const buildGuestAccessUrl = (restaurantSlug, accessToken) => {
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
  return `${baseUrl}/r/${encodeURIComponent(restaurantSlug)}/access/${encodeURIComponent(accessToken)}`;
};

export const buildRestaurantSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || `restaurant-${crypto.randomBytes(3).toString('hex')}`;

export const generateRestaurantCode = () => `REST-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

export const generateAdminCode = () => `ADM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
