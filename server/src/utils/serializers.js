export const serializeRestaurant = (restaurant) => ({
  _id: restaurant.id,
  restaurantCode: restaurant.restaurantCode,
  adminCode: restaurant.adminCode,
  businessName: restaurant.businessName,
  slug: restaurant.slug,
  ownerName: restaurant.ownerName,
  phone: restaurant.phone,
  email: restaurant.email,
  city: restaurant.city,
  district: restaurant.district,
  state: restaurant.state,
  address: restaurant.address,
  tagline: restaurant.tagline,
  heroTitle: restaurant.heroTitle,
  heroDescription: restaurant.heroDescription,
  supportPhone: restaurant.supportPhone,
  primaryColor: restaurant.primaryColor,
  secondaryColor: restaurant.secondaryColor,
  logoUrl: restaurant.logoUrl,
  themePreference: restaurant.themePreference,
  deliveryEnabled: restaurant.deliveryEnabled,
  subscriptionPlan: restaurant.subscriptionPlan,
  subscriptionStatus: restaurant.subscriptionStatus,
  oneTimeFee: restaurant.oneTimeFee,
  monthlyFee: restaurant.monthlyFee,
  paymentReference: restaurant.paymentReference,
  deliveryUrl: restaurant.deliveryUrl || null,
  createdAt: restaurant.createdAt,
  updatedAt: restaurant.updatedAt
});

export const serializeUser = (user) => ({
  _id: user.id,
  restaurantId: user.restaurantId,
  name: user.name,
  email: user.email,
  phone: user.phone,
  adminCode: user.adminCode,
  role: user.role,
  isActive: user.isActive,
  restaurant: user.restaurant
    ? {
        ...serializeRestaurant(user.restaurant)
      }
    : null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const serializeCategory = (category) => ({
  ...category,
  _id: category.id
});

export const serializeTable = (table) => ({
  ...table,
  _id: table.id,
  restaurant: table.restaurant ? serializeRestaurant(table.restaurant) : null
});

export const serializeMenuItem = (item) => ({
  ...item,
  _id: item.id,
  restaurantId: item.restaurantId,
  category: item.category
    ? {
        ...item.category,
        _id: item.category.id
      }
    : null
});

export const serializeOrder = (order) => ({
  _id: order.id,
  restaurant: order.restaurant ? serializeRestaurant(order.restaurant) : null,
  table: order.table
    ? {
        ...order.table,
        _id: order.table.id
      }
    : order.tableId,
  orderType: order.orderType,
  sourceLabel: order.sourceLabel,
  tableName: order.tableName,
  tableNumber: order.tableNumber,
  customerName: order.customerName,
  customerPhone: order.customerPhone,
  deliveryAddress: order.deliveryAddress,
  items: (order.items || []).map((item) => ({
    ...item,
    _id: item.id,
    menuItem: item.menuItem
      ? {
          ...item.menuItem,
          _id: item.menuItem.id
        }
      : item.menuItemId
  })),
  status: order.status,
  totalAmount: order.totalAmount,
  notes: order.notes,
  paymentStatus: order.paymentStatus,
  paymentProvider: order.paymentProvider,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt
});
