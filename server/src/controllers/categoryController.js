import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { serializeCategory } from '../utils/serializers.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: {
      restaurantId: req.user.restaurantId
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
  });
  res.json(categories.map(serializeCategory));
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.create({
    data: {
      restaurantId: req.user.restaurantId,
      name: req.body.name,
      description: req.body.description || '',
      sortOrder: Number(req.body.sortOrder || 0)
    }
  });
  res.status(201).json(serializeCategory(category));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const existingCategory = await prisma.category.findFirst({
    where: { id: req.params.id, restaurantId: req.user.restaurantId }
  });

  if (!existingCategory) {
    res.status(404);
    throw new Error('Category not found.');
  }

  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name ?? existingCategory.name,
      description: req.body.description ?? existingCategory.description,
      sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : existingCategory.sortOrder
    }
  });

  res.json(serializeCategory(category));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const linkedItems = await prisma.menuItem.count({
    where: { categoryId: req.params.id, restaurantId: req.user.restaurantId }
  });

  if (linkedItems > 0) {
    res.status(400);
    throw new Error('Cannot delete a category that still has menu items.');
  }

  const existingCategory = await prisma.category.findFirst({
    where: { id: req.params.id, restaurantId: req.user.restaurantId }
  });

  if (!existingCategory) {
    res.status(404);
    throw new Error('Category not found.');
  }

  await prisma.category.delete({
    where: { id: req.params.id }
  });

  res.json({ message: 'Category deleted successfully.' });
});
