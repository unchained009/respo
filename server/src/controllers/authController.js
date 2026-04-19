import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';
import { serializeUser } from '../utils/serializers.js';

const userSelect = {
  id: true,
  restaurantId: true,
  name: true,
  email: true,
  phone: true,
  adminCode: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  restaurant: true,
  password: true
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const identifier = req.body.identifier || req.body.email || req.body.adminCode;
  const { password } = req.body;

  if (!identifier || !password) {
    res.status(400);
    throw new Error('Admin ID or email and password are required.');
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier.toLowerCase() }, { adminCode: identifier.toUpperCase() }]
    },
    select: userSelect
  });

  if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid admin ID/email or password.');
  }

  res.json({
    message: 'Login successful.',
    token: generateToken(user.id),
    user: serializeUser(user),
    credentials: {
      adminCode: user.adminCode,
      restaurantCode: user.restaurant.restaurantCode
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(serializeUser(req.user));
});
