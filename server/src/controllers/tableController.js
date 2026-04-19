import QRCode from 'qrcode';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { buildGuestAccessUrl, generateAccessToken } from '../utils/access.js';
import { serializeTable } from '../utils/serializers.js';

const restaurantSelect = {
  id: true,
  restaurantCode: true,
  businessName: true,
  slug: true,
  deliveryAccessToken: true
};

export const getTables = asyncHandler(async (req, res) => {
  const tables = await prisma.table.findMany({
    where: {
      restaurantId: req.user.restaurantId
    },
    include: {
      restaurant: {
        select: restaurantSelect
      }
    },
    orderBy: {
      tableNumber: 'asc'
    }
  });

  res.json(tables.map(serializeTable));
});

export const createTable = asyncHandler(async (req, res) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: req.user.restaurantId },
    select: restaurantSelect
  });

  const accessToken = generateAccessToken();
  const table = await prisma.table.create({
    data: {
      restaurantId: req.user.restaurantId,
      name: req.body.name,
      tableNumber: Number(req.body.tableNumber),
      seats: Number(req.body.seats || 4),
      isActive: req.body.isActive ?? true,
      accessToken,
      qrCodeUrl: buildGuestAccessUrl(restaurant.slug, accessToken)
    },
    include: {
      restaurant: {
        select: restaurantSelect
      }
    }
  });

  res.status(201).json(serializeTable(table));
});

export const updateTable = asyncHandler(async (req, res) => {
  const existingTable = await prisma.table.findFirst({
    where: { id: req.params.id, restaurantId: req.user.restaurantId },
    include: {
      restaurant: {
        select: restaurantSelect
      }
    }
  });

  if (!existingTable) {
    res.status(404);
    throw new Error('Table not found.');
  }

  const table = await prisma.table.update({
    where: { id: req.params.id },
    data: {
      name: req.body.name ?? existingTable.name,
      tableNumber: req.body.tableNumber !== undefined ? Number(req.body.tableNumber) : existingTable.tableNumber,
      seats: req.body.seats !== undefined ? Number(req.body.seats) : existingTable.seats,
      isActive: req.body.isActive ?? existingTable.isActive,
      qrCodeUrl: buildGuestAccessUrl(existingTable.restaurant.slug, existingTable.accessToken)
    },
    include: {
      restaurant: {
        select: restaurantSelect
      }
    }
  });

  res.json(serializeTable(table));
});

export const deleteTable = asyncHandler(async (req, res) => {
  const table = await prisma.table.findFirst({
    where: { id: req.params.id, restaurantId: req.user.restaurantId }
  });

  if (!table) {
    res.status(404);
    throw new Error('Table not found.');
  }

  await prisma.table.delete({
    where: { id: req.params.id }
  });

  res.json({ message: 'Table deleted successfully.' });
});

export const getTableQrCode = asyncHandler(async (req, res) => {
  const table = await prisma.table.findFirst({
    where: { id: req.params.id, restaurantId: req.user.restaurantId },
    include: {
      restaurant: {
        select: restaurantSelect
      }
    }
  });

  if (!table) {
    res.status(404);
    throw new Error('Table not found.');
  }

  const accessUrl = buildGuestAccessUrl(table.restaurant.slug, table.accessToken);
  const qrDataUrl = await QRCode.toDataURL(accessUrl, {
    width: 320,
    margin: 1
  });

  res.json({
    tableId: table.id,
    tableName: table.name,
    tableNumber: table.tableNumber,
    qrCodeUrl: qrDataUrl,
    tableUrl: accessUrl,
    restaurantCode: table.restaurant.restaurantCode
  });
});
