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

    // Create Demo Workspace
    const { restaurant: demoRes, adminCode: demoAdminCode } = await createRestaurantWorkspace({
      ownerName: 'Demo Owner',
      businessName: 'The Respo Bistro (Demo)',
      email: 'demo@respo.com',
      phone: '0000000000',
      password: 'Demo@123',
      city: 'Metropolis',
      district: 'Downtown',
      state: 'Demo State',
      address: '123 Demo Street',
      plan: 'one_time',
      paymentReference: 'DEMO-SEED-001'
    });

    // Add some demo data
    const cat1 = await prisma.category.create({
      data: {
        restaurantId: demoRes.id,
        name: 'Signature Cocktails',
        description: 'Our finest mixes',
        sortOrder: 1
      }
    });

    await prisma.menuItem.create({
      data: {
        restaurantId: demoRes.id,
        categoryId: cat1.id,
        name: 'Respo Sunrise',
        description: 'Tequila, orange juice, and grenadine with a twist.',
        price: 450,
        isAvailable: true
      }
    });

    await prisma.table.create({
      data: {
        restaurantId: demoRes.id,
        name: 'VIP Terrace',
        tableNumber: 101,
        seats: 4,
        accessToken: `demo-table-101-${Date.now()}`
      }
    });

    console.log('Database seeded successfully.');
    console.log(`Restaurant: ${restaurant.businessName} (${restaurant.restaurantCode})`);
    console.log(`Admin login: ${adminCode} / Admin@123`);
    console.log(`Demo login: demo@respo.com / Demo@123`);
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
