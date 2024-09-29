
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // Create Unit Types
  const kilogram = await prisma.unitType.create({
    data: { unitName: 'Kilogram' }
  });

  const liter = await prisma.unitType.create({
    data: { unitName: 'Liter' }
  });

  // Create Waste Types
  const plastic = await prisma.wasteType.create({
    data: { wasteType: 'Plastic' }
  });

  const metal = await prisma.wasteType.create({
    data: { wasteType: 'Metal' }
  });

  // Create Companies
  const companyA = await prisma.company.create({
    data: {
      name: 'Eco-Friendly Ltd.',
      address: '123 Green St',
      latitude: 40.712776,
      longitude: -74.005974,
      description: 'A company specializing in recycling services.',
      users: {
        create: [{
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@eco-friendly.com',
          password: await bcrypt.hash('password123', 10),
          phone: '1234567890',
          role: 'admin',
        }]
      }
    }
  });

  const companyB = await prisma.company.create({
    data: {
      name: 'Waste Management Inc.',
      address: '456 Waste St',
      latitude: 34.052235,
      longitude: -118.243683,
      description: 'Leaders in waste management services.',
      users: {
        create: [{
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@wastemgmt.com',
          password: await bcrypt.hash('password456', 10),
          phone: '0987654321',
          role: 'user',
        }]
      }
    }
  });

  // Create Collection Company
  const collectionCompany = await prisma.collectionCompany.create({
    data: {
      name: 'Green Collectors Co.',
      address: '789 Collection Ave',
      description: 'A company that offers collection services for recyclable materials.',
      users: {
        create: [{
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@collectors.com',
          password: await bcrypt.hash('password789', 10),
          phone: '1122334455',
          role: 'user',
        }]
      },
      collectionServices: {
        create: [{
          wasteTypeId: plastic.id,
          pricePerUnit: 15.0,
          unitTypeId: kilogram.id,
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
      expirationDate: new Date('2024-12-31'),
    }
  });

  // Create Waste Offer
  const wasteOffer = await prisma.wasteOffer.create({
    data: {
      companySellerId: companyA.id,
      wasteId: waste.id,
      offerPrice: 200.0,
      units: 100,
      pickupLatitude: 40.712776,
      pickupLongitude: -74.005974,
      status: 'available',
    }
  });

  // Create Waste Counteroffer from Company B
  const counteroffer = await prisma.wasteCounteroffer.create({
    data: {
      offerId: wasteOffer.id,
      buyerCompanyId: companyB.id,
      counterPrice: 180.0,
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
