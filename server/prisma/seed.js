import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/prisma.js';
import { createRestaurantWorkspace } from '../src/services/provisioningService.js';

async function seedDatabase() {
  try {
    await prisma.$connect();

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.table.deleteMany();
    await prisma.user.deleteMany();
    await prisma.restaurant.deleteMany();

    const { restaurant, adminCode, deliveryUrl } = await createRestaurantWorkspace({
      ownerName: 'Aarav Sharma',
      businessName: 'Aurora Table & Co.',
      email: 'admin@restaurant.com',
      phone: '9876543210',
      password: 'Admin@123',
      city: 'Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      address: '21 Market Street, Bengaluru',
      plan: 'one_time',
      paymentReference: 'SEED-PAYMENT-001'
    });

    await prisma.user.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Floor Staff',
        email: 'staff@restaurant.com',
        phone: '9876543211',
        adminCode: `${restaurant.adminCode}-S1`,
        password: bcrypt.hashSync('Staff@123', 10),
        role: 'staff'
      }
    });

    console.log('Database seeded successfully.');
    console.log(`Restaurant: ${restaurant.businessName} (${restaurant.restaurantCode})`);
    console.log(`Admin login: ${adminCode} / Admin@123`);
    console.log('Staff login: staff@restaurant.com / Staff@123');
    console.log(`Delivery QR URL: ${deliveryUrl}`);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
