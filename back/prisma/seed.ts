import { FuelType, SaleStatus, UserRole, VehicleStatus } from '@prisma/client';

import { prisma } from '../src/prisma.js';

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@automanager.com' },
    update: {},
    create: {
      name: 'Admin Master',
      email: 'admin@automanager.com',
      role: UserRole.ADMIN
    }
  });

  const clientOne = await prisma.client.upsert({
    where: { document: '123.456.789-00' },
    update: {},
    create: {
      name: 'João Silva',
      document: '123.456.789-00',
      birthDate: new Date('1985-05-15'),
      phone: '(11) 98888-7777',
      email: 'joao.silva@email.com',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      observations: 'Cliente preferencial.'
    }
  });

  await prisma.client.upsert({
    where: { document: '987.654.321-11' },
    update: {},
    create: {
      name: 'Maria Oliveira',
      document: '987.654.321-11',
      birthDate: new Date('1990-10-22'),
      phone: '(21) 97777-6666',
      email: 'maria.oliveira@email.com',
      address: 'Rua das Flores, 50',
      city: 'Rio de Janeiro',
      state: 'RJ',
      observations: 'Interesse em SUVs.'
    }
  });

  const vehicleOne = await prisma.vehicle.upsert({
    where: { plate: 'ABC-1234' },
    update: {},
    create: {
      brand: 'Toyota',
      model: 'Corolla XEI',
      year: 2022,
      color: 'Prata',
      plate: 'ABC-1234',
      chassis: '9BWZZZ123456789',
      mileage: 15000,
      fuelType: FuelType.FLEX,
      price: 125000,
      status: VehicleStatus.AVAILABLE,
      observations: 'Único dono, todas revisões na concessionária.',
      entryDate: new Date('2023-10-01'),
      photos: {
        create: [{ url: 'https://picsum.photos/seed/corolla/400/300' }]
      }
    }
  });

  const existingSale = await prisma.sale.findFirst({
    where: {
      clientId: clientOne.id,
      vehicleId: vehicleOne.id,
      date: new Date('2023-12-05')
    }
  });

  if (!existingSale) {
    await prisma.sale.create({
      data: {
        clientId: clientOne.id,
        vehicleId: vehicleOne.id,
        date: new Date('2023-12-05'),
        value: 122000,
        paymentMethod: 'Financiamento',
        sellerName: admin.name,
        status: SaleStatus.COMPLETED,
        observations: 'Venda rápida com desconto à vista.'
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
