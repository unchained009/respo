import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ORDER_STATUSES } from '../constants/orderConstants.js';
import { buildOrderSocketPayload } from '../utils/buildOrderPayload.js';
import { getSocketServer } from '../config/socket.js';
import { serializeOrder } from '../utils/serializers.js';

const orderInclude = {
  restaurant: true,
  table: {
    select: {
      id: true,
      name: true,
      tableNumber: true
    }
  },
  items: true
};

export const createOrder = asyncHandler(async (req, res) => {
  const { restaurantSlug, accessToken, items, notes, customerName, customerPhone, deliveryAddress } = req.body;

  if (!restaurantSlug || !accessToken || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Restaurant access and at least one item are required.');
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: restaurantSlug }
  });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found.');
  }

  const itemIds = items.map((item) => item.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: {
      restaurantId: restaurant.id,
      id: { in: itemIds },
      isAvailable: true
    }
  });

  if (menuItems.length !== itemIds.length) {
    res.status(400);
    throw new Error('One or more selected menu items are unavailable.');
  }

  const isDelivery = restaurant.deliveryEnabled && accessToken === restaurant.deliveryAccessToken;
  let table = null;

  if (!isDelivery) {
    table = await prisma.table.findFirst({
      where: {
        restaurantId: restaurant.id,
        accessToken,
        isActive: true
      }
    });

    if (!table) {
      res.status(400);
      throw new Error('This QR code is invalid or no longer active.');
    }
  }

  if (isDelivery && (!customerName?.trim() || !customerPhone?.trim() || !deliveryAddress?.trim())) {
    res.status(400);
    throw new Error('Name, phone number, and delivery address are required for delivery orders.');
  }

  const normalizedItems = items.map((selectedItem) => {
    const menuItem = menuItems.find((currentItem) => currentItem.id === selectedItem.menuItemId);

    return {
      restaurantId: restaurant.id,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: selectedItem.quantity,
      subtotal: menuItem.price * selectedItem.quantity,
      image: menuItem.image
    };
  });

  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);

  const order = await prisma.order.create({
    data: {
      restaurantId: restaurant.id,
      tableId: table?.id,
      orderType: isDelivery ? 'delivery' : 'dine_in',
      sourceLabel: isDelivery ? 'Home Delivery' : `Table ${table.tableNumber}`,
      tableName: table?.name,
      tableNumber: table?.tableNumber,
      customerName: isDelivery ? customerName.trim() : '',
      customerPhone: isDelivery ? customerPhone.trim() : '',
      deliveryAddress: isDelivery ? deliveryAddress.trim() : '',
      totalAmount,
      notes: notes || '',
      items: {
        create: normalizedItems
      }
    },
    include: orderInclude
  });

  const payload = buildOrderSocketPayload(order);
  const io = getSocketServer();
  io.to(`admins:${restaurant.id}`).emit('order:new', payload);
  io.to(`order:${order.id}`).emit('order:updated', payload);

  res.status(201).json(serializeOrder(order));
});

export const getOrders = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const type = req.query.type;
  const query = {
    restaurantId: req.user.restaurantId
  };

  if (status) {
    query.status = status;
  }

  if (type) {
    query.orderType = type;
  }

  const orders = await prisma.order.findMany({
    where: query,
    include: orderInclude,
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json(orders.map(buildOrderSocketPayload));
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.order.findFirst({
    where: {
      id: req.params.id,
      restaurantId: req.user.restaurantId
    },
    include: orderInclude
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  res.json(serializeOrder(order));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!ORDER_STATUSES.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status.');
  }

  const existingOrder = await prisma.order.findFirst({
    where: { id: req.params.id, restaurantId: req.user.restaurantId }
  });

  if (!existingOrder) {
    res.status(404);
    throw new Error('Order not found.');
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
    include: orderInclude
  });

  const payload = buildOrderSocketPayload(order);
  const io = getSocketServer();
  io.to(`admins:${req.user.restaurantId}`).emit('order:updated', payload);
  io.to(`order:${order.id}`).emit('order:updated', payload);

  res.json(serializeOrder(order));
});
