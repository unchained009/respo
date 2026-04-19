import QRCode from 'qrcode';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { buildGuestAccessUrl } from '../utils/access.js';
import { serializeCategory, serializeMenuItem, serializeRestaurant, serializeTable } from '../utils/serializers.js';

const tenantRestaurantSelect = {
  id: true,
  restaurantCode: true,
  adminCode: true,
  businessName: true,
  slug: true,
  ownerName: true,
  phone: true,
  email: true,
  city: true,
  district: true,
  state: true,
  address: true,
  tagline: true,
  heroTitle: true,
  heroDescription: true,
  supportPhone: true,
  primaryColor: true,
  secondaryColor: true,
  logoUrl: true,
  themePreference: true,
  deliveryEnabled: true,
  deliveryAccessToken: true,
  subscriptionPlan: true,
  subscriptionStatus: true,
  oneTimeFee: true,
  monthlyFee: true,
  paymentReference: true,
  createdAt: true,
  updatedAt: true
};

const withDeliveryUrl = (restaurant) => ({
  ...restaurant,
  deliveryUrl: restaurant.deliveryEnabled ? buildGuestAccessUrl(restaurant.slug, restaurant.deliveryAccessToken) : null
});

export const getRestaurantProfile = asyncHandler(async (req, res) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: req.user.restaurantId },
    select: tenantRestaurantSelect
  });

  res.json(serializeRestaurant(withDeliveryUrl(restaurant)));
});

export const updateRestaurantSettings = asyncHandler(async (req, res) => {
  const restaurant = await prisma.restaurant.update({
    where: { id: req.user.restaurantId },
    data: {
      businessName: req.body.businessName,
      ownerName: req.body.ownerName,
      phone: req.body.phone,
      email: req.body.email,
      city: req.body.city,
      district: req.body.district,
      state: req.body.state,
      address: req.body.address || '',
      tagline: req.body.tagline || '',
      heroTitle: req.body.heroTitle || '',
      heroDescription: req.body.heroDescription || '',
      supportPhone: req.body.supportPhone || req.body.phone,
      primaryColor: req.body.primaryColor || '#f97316',
      secondaryColor: req.body.secondaryColor || '#0f172a',
      logoUrl: req.body.logoUrl || '',
      themePreference: req.body.themePreference || 'system',
      deliveryEnabled: req.body.deliveryEnabled ?? true
    },
    select: tenantRestaurantSelect
  });

  res.json(serializeRestaurant(withDeliveryUrl(restaurant)));
});

export const getDeliveryQrCode = asyncHandler(async (req, res) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: req.user.restaurantId },
    select: tenantRestaurantSelect
  });

  const deliveryUrl = buildGuestAccessUrl(restaurant.slug, restaurant.deliveryAccessToken);
  const qrCodeUrl = await QRCode.toDataURL(deliveryUrl, {
    width: 320,
    margin: 1
  });

  res.json({
    restaurant: serializeRestaurant(withDeliveryUrl(restaurant)),
    qrCodeUrl,
    accessType: 'delivery',
    entryLabel: 'Home Delivery',
    accessUrl: deliveryUrl
  });
});

export const resolveGuestAccess = asyncHandler(async (req, res) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: req.params.slug },
    select: tenantRestaurantSelect
  });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found.');
  }

  const categories = await prisma.category.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
  });

  const menuItems = await prisma.menuItem.findMany({
    where: {
      restaurantId: restaurant.id,
      isAvailable: true
    },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (restaurant.deliveryEnabled && req.params.accessToken === restaurant.deliveryAccessToken) {
    res.json({
      restaurant: serializeRestaurant(withDeliveryUrl(restaurant)),
      accessType: 'delivery',
      entryLabel: 'Home Delivery',
      accessToken: req.params.accessToken,
      categories: categories.map(serializeCategory),
      menuItems: menuItems.map(serializeMenuItem)
    });
    return;
  }

  const table = await prisma.table.findFirst({
    where: {
      restaurantId: restaurant.id,
      accessToken: req.params.accessToken,
      isActive: true
    }
  });

  if (!table) {
    res.status(404);
    throw new Error('This QR code is invalid or no longer active.');
  }

  res.json({
    restaurant: serializeRestaurant(withDeliveryUrl(restaurant)),
    accessType: 'dine_in',
    entryLabel: `Table ${table.tableNumber}`,
    accessToken: req.params.accessToken,
    table: serializeTable(table),
    categories: categories.map(serializeCategory),
    menuItems: menuItems.map(serializeMenuItem)
  });
});
