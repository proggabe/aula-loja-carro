import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { prisma } from './prisma.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true });
});

app.get('/api/vehicles', async (_req, res) => {
  const vehicles = await prisma.vehicle.findMany({
    include: { photos: true }
  });

  res.json(vehicles);
});

app.get('/api/clients', async (_req, res) => {
  const clients = await prisma.client.findMany();
  res.json(clients);
});

app.get('/api/sales', async (_req, res) => {
  const sales = await prisma.sale.findMany({
    include: {
      client: true,
      vehicle: true
    }
  });

  res.json(sales);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
