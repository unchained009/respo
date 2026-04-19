import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { serializeMenuItem } from '../utils/serializers.js';

const menuInclude = {
  category: {
    select: {
      id: true,
      name: true
    }
  }
};

export const getMenuItems = asyncHandler(async (req, res) => {
  const items = await prisma.menuItem.findMany({
    where: {
      restaurantId: req.user.restaurantId
    },
    include: menuInclude,
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json(items.map(serializeMenuItem));
});

export const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await prisma.menuItem.findFirst({
    where: { id: req.params.id, restaurantId: req.user.restaurantId },
    include: menuInclude
  });

  if (!item) {
    res.status(404);
    throw new Error('Menu item not found.');
  }

  res.json(serializeMenuItem(item));
});

export const createMenuItem = asyncHandler(async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { id: req.body.category, restaurantId: req.user.restaurantId }
  });

  if (!category) {
    res.status(400);
    throw new Error('Valid category is required.');
  }

  const item = await prisma.menuItem.create({
    data: {
      restaurantId: req.user.restaurantId,
      name: req.body.name,
      description: req.body.description || '',
      price: Number(req.body.price),
      image: req.body.image || '',
      isAvailable: req.body.isAvailable ?? true,
      categoryId: req.body.category
    },
    include: menuInclude
  });

  res.status(201).json(serializeMenuItem(item));
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  if (req.body.category) {
    const category = await prisma.category.findFirst({
      where: { id: req.body.category, restaurantId: req.user.restaurantId }
    });

    if (!category) {
      res.status(400);
      throw new Error('Valid category is required.');
    }
  }

  const existingItem = await prisma.menuItem.findFirst({
    where: { id: req.params.id, restaurantId: req.user.restaurantId }
  });

  if (!existingItem) {
    res.status(404);
    throw new Error('Menu item not found.');
  }

  const item = await prisma.menuItem.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name ?? existingItem.name,
      description: req.body.description ?? existingItem.description,
      price: req.body.price !== undefined ? Number(req.body.price) : existingItem.price,
      image: req.body.image ?? existingItem.image,
      isAvailable: req.body.isAvailable ?? existingItem.isAvailable,
      categoryId: req.body.category ?? existingItem.categoryId
    },
    include: menuInclude
  });

  res.json(serializeMenuItem(item));
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const existingItem = await prisma.menuItem.findFirst({
    where: { id: req.params.id, restaurantId: req.user.restaurantId }
  });

  if (!existingItem) {
    res.status(404);
    throw new Error('Menu item not found.');
  }

  await prisma.menuItem.delete({
    where: { id: req.params.id }
  });

  res.json({ message: 'Menu item deleted successfully.' });
});

export const resetMenu = asyncHandler(async (req, res) => {
  await prisma.orderItem.deleteMany({
    where: {
      restaurantId: req.user.restaurantId
    }
  });
  await prisma.menuItem.deleteMany({
    where: {
      restaurantId: req.user.restaurantId
    }
  });
  await prisma.category.deleteMany({
    where: {
      restaurantId: req.user.restaurantId
    }
  });
  res.json({ message: 'Menu and categories reset successfully.' });
});
