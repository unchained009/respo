import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { createRestaurantWorkspace } from '../services/provisioningService.js';

export const getPlatformStats = asyncHandler(async (req, res) => {
  const [restaurantCount, activeSubscriptionCount, totalOrders] = await Promise.all([
    prisma.restaurant.count(),
    prisma.restaurant.count({
      where: {
        subscriptionStatus: 'active'
      }
    }),
    prisma.order.count()
  ]);

  res.json({
    restaurantCount,
    activeSubscriptionCount,
    totalOrders,
    monthlyPlanPrice: 650,
    oneTimePlanPrice: 50000
  });
});

export const subscribeRestaurant = asyncHandler(async (req, res) => {
  const {
    ownerName,
    businessName,
    email,
    phone,
    password,
    city,
    district,
    state,
    plan,
    address,
    paymentStatus,
    paymentReference
  } = req.body;

  const requiredFields = [ownerName, businessName, email, phone, password, city, district, state, plan];
  if (requiredFields.some((field) => !field || !String(field).trim())) {
    res.status(400);
    throw new Error('Name, business name, email, phone, password, city, district, state, and plan are required.');
  }

  if (!['monthly', 'one_time'].includes(plan)) {
    res.status(400);
    throw new Error('Invalid subscription plan selected.');
  }

  if (paymentStatus !== 'paid') {
    res.status(400);
    throw new Error('Payment must be successful before activating a restaurant workspace.');
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingEmail) {
    res.status(400);
    throw new Error('This email is already associated with an active workspace.');
  }

  const { restaurant, adminCode, deliveryUrl } = await createRestaurantWorkspace({
    ownerName: ownerName.trim(),
    businessName: businessName.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    password,
    city: city.trim(),
    district: district.trim(),
    state: state.trim(),
    address: address?.trim() || '',
    plan,
    paymentReference: paymentReference?.trim() || `PAY-${Date.now()}`
  });

  res.status(201).json({
    message: 'Subscription activated and restaurant workspace provisioned successfully.',
    restaurant: {
      restaurantCode: restaurant.restaurantCode,
      businessName: restaurant.businessName,
      slug: restaurant.slug,
      subscriptionPlan: restaurant.subscriptionPlan
    },
    credentials: {
      adminCode,
      passwordHint: 'Use the password created during checkout.'
    },
    deliveryUrl
  });
});
