import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const revenueStatuses = ['accepted', 'preparing', 'served', 'completed'];
  const whereTenant = { restaurantId: req.user.restaurantId };

  const [todayOrders, allOrders, orderCount, topSellingItemsRaw, menuItemCount, tableCount] = await Promise.all([
    prisma.order.findMany({
      where: {
        ...whereTenant,
        status: { in: revenueStatuses },
        createdAt: { gte: today }
      },
      select: {
        totalAmount: true
      }
    }),
    prisma.order.findMany({
      where: {
        ...whereTenant,
        status: { in: revenueStatuses }
      },
      select: {
        totalAmount: true
      }
    }),
    prisma.order.count({ where: whereTenant }),
    prisma.orderItem.groupBy({
      by: ['name'],
      where: {
        restaurantId: req.user.restaurantId
      },
      _sum: {
        quantity: true,
        subtotal: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    }),
    prisma.menuItem.count({ where: { restaurantId: req.user.restaurantId } }),
    prisma.table.count({ where: { restaurantId: req.user.restaurantId } })
  ]);

  res.json({
    salesToday: todayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    allTimeSales: allOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    orderCount,
    menuItemCount,
    tableCount,
    topSellingItems: topSellingItemsRaw.map((item) => ({
      _id: item.name,
      quantitySold: item._sum.quantity || 0,
      revenue: item._sum.subtotal || 0
    }))
  });
});
