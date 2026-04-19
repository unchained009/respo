import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import {
  buildGuestAccessUrl,
  buildRestaurantSlug,
  generateAccessToken,
  generateAdminCode,
  generateRestaurantCode
} from '../utils/access.js';

const defaultCategories = [
  { name: 'Starters', description: 'Quick bites to begin the meal', sortOrder: 1 },
  { name: 'Main Course', description: 'Hearty mains for lunch and dinner', sortOrder: 2 },
  { name: 'Beverages', description: 'Hot and cold drinks', sortOrder: 3 },
  { name: 'Desserts', description: 'Sweet finishes and bakery specials', sortOrder: 4 }
];

const defaultMenu = [
  {
    name: 'House Burger',
    description: 'Juicy burger with caramelized onions and fries.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    categoryName: 'Main Course'
  },
  {
    name: 'Paneer Tikka Bowl',
    description: 'Smoky paneer, rice, greens, and yogurt mint dressing.',
    price: 259,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
    categoryName: 'Main Course'
  },
  {
    name: 'Masala Lemon Soda',
    description: 'Fresh soda with lime, spice, and rock salt.',
    price: 89,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
    categoryName: 'Beverages'
  },
  {
    name: 'Loaded Nachos',
    description: 'Corn chips layered with cheese, salsa, and jalapenos.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=900&q=80',
    categoryName: 'Starters'
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm cake with molten chocolate center.',
    price: 169,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=900&q=80',
    categoryName: 'Desserts'
  }
];

const defaultTables = Array.from({ length: 8 }, (_, index) => ({
  name: `T${index + 1}`,
  tableNumber: index + 1,
  seats: 4
}));

export const createRestaurantWorkspace = async ({
  ownerName,
  businessName,
  email,
  phone,
  password,
  city,
  district,
  state,
  plan,
  paymentReference = '',
  address = ''
}) => {
  const baseSlug = buildRestaurantSlug(businessName);
  let slug = baseSlug;
  let slugCounter = 1;

  while (await prisma.restaurant.findUnique({ where: { slug } })) {
    slugCounter += 1;
    slug = `${baseSlug}-${slugCounter}`;
  }

  let restaurantCode = generateRestaurantCode();
  while (await prisma.restaurant.findUnique({ where: { restaurantCode } })) {
    restaurantCode = generateRestaurantCode();
  }

  let adminCode = generateAdminCode();
  while (await prisma.user.findUnique({ where: { adminCode } })) {
    adminCode = generateAdminCode();
  }

  const deliveryAccessToken = generateAccessToken();
  const hashedPassword = await bcrypt.hash(password, 10);

  const restaurant = await prisma.restaurant.create({
    data: {
      restaurantCode,
      adminCode,
      businessName,
      slug,
      ownerName,
      phone,
      email,
      city,
      district,
      state,
      address,
      tagline: 'Turn tables faster, accept delivery smarter, and run one unified POS.',
      heroTitle: `${businessName} runs on one live dashboard for dine-in, QR ordering, and delivery.`,
      heroDescription:
        'Guests can scan secure table QR codes or use your delivery QR outside the store while your team manages everything in real time.',
      supportPhone: phone,
      deliveryAccessToken,
      subscriptionPlan: plan,
      subscriptionStatus: 'active',
      paymentReference,
      users: {
        create: {
          name: ownerName,
          email,
          phone,
          adminCode,
          password: hashedPassword,
          role: 'admin'
        }
      }
    }
  });

  const createdCategories = await Promise.all(
    defaultCategories.map((category) =>
      prisma.category.create({
        data: {
          ...category,
          restaurantId: restaurant.id
        }
      })
    )
  );

  const categoryMap = createdCategories.reduce((accumulator, category) => {
    accumulator[category.name] = category.id;
    return accumulator;
  }, {});

  await prisma.menuItem.createMany({
    data: defaultMenu.map((item) => ({
      restaurantId: restaurant.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      categoryId: categoryMap[item.categoryName],
      isAvailable: true
    }))
  });

  for (const table of defaultTables) {
    const accessToken = generateAccessToken();
    await prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        name: table.name,
        tableNumber: table.tableNumber,
        seats: table.seats,
        accessToken,
        qrCodeUrl: buildGuestAccessUrl(restaurant.slug, accessToken),
        isActive: true
      }
    });
  }

  return {
    restaurant,
    adminCode,
    deliveryUrl: buildGuestAccessUrl(restaurant.slug, deliveryAccessToken)
  };
};
