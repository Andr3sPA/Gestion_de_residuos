import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // Create Unit Types
  const kilogram = await prisma.unitType.create({
    data: { name: 'Kilogram' }
  });

  const liter = await prisma.unitType.create({
    data: { name: 'Liter' }
  });

  // Create Waste Types
  const plastic = await prisma.wasteType.create({
    data: { name: 'Plastic' }
  });

  const metal = await prisma.wasteType.create({
    data: { name: 'Metal' }
  });

  // Create Companies
  const companyA = await prisma.company.create({
    data: {
      name: 'Eco-Friendly Ltd.',
      address: '123 Green St',
      description: 'A company specializing in recycling services.',
      users: {
        create: [{
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@eco-friendly.com',
          password: await bcrypt.hash('password123', 10),
          role: 'companyAdmin',
        }]
      }
    }
  });

  const companyB = await prisma.company.create({
    data: {
      name: 'Waste Management Inc.',
      address: '456 Waste St',
      description: 'Leaders in waste management services.',
      users: {
        create: [{
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@wastemgmt.com',
          password: await bcrypt.hash('password456', 10),
          role: 'companyManager',
        }]
      }
    }
  });

  // Create Waste for Company A
  const waste = await prisma.waste.create({
    data: {
      companyOwnerId: companyA.id,
      wasteTypeId: plastic.id,
      category: 'usable',
      description: 'Plastic bottles for recycling',
      units: 100,
      unitTypeId: kilogram.id,
    }
  });

  // Create Auction for the Waste
  const auction = await prisma.auction.create({
    data: {
      companySellerId: companyA.id,
      wasteId: waste.id,
      initialPrice: 200.0,
      units: 100,
      contact: 'john.doe@eco-friendly.com',
      pickupLatitude: 40.712776,
      pickupLongitude: -74.005974,
      expiresAt: new Date('2024-12-31'),
      status: 'available',
    }
  });

  // Create Offer from Company B
  const offer = await prisma.offer.create({
    data: {
      auctionId: auction.id,
      companyBuyerId: companyB.id,
      contact: 'jane.smith@wastemgmt.com',
      offerPrice: 180.0,
      status: 'waiting',
    }
  });

  console.log('Seed data created successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
