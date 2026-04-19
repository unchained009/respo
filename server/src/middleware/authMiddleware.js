import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

const authUserSelect = {
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
  restaurant: true
};

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Missing token.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: authUserSelect
    });

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ message: 'User not found for this token.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have access to this resource.' });
  }

  next();
};
