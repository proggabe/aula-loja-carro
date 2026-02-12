
import { Vehicle, Client, Sale, VehicleStatus, FuelType, SaleStatus, User, UserRole } from './types';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
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
    entryDate: '2023-10-01',
    photos: ['https://picsum.photos/seed/corolla/400/300']
  },
  {
    id: 'v2',
    brand: 'Honda',
    model: 'Civic Touring',
    year: 2021,
    color: 'Preto',
    plate: 'XYZ-9876',
    chassis: '9HXXXX987654321',
    mileage: 28000,
    fuelType: FuelType.GASOLINE,
    price: 138000,
    status: VehicleStatus.AVAILABLE,
    observations: 'Teto solar, faróis full LED.',
    entryDate: '2023-09-15',
    photos: ['https://picsum.photos/seed/civic/400/300']
  },
  {
    id: 'v3',
    brand: 'Jeep',
    model: 'Compass Longitude',
    year: 2023,
    color: 'Branco',
    plate: 'DEF-5678',
    chassis: '9JYYYY567812345',
    mileage: 5000,
    fuelType: FuelType.DIESEL,
    price: 185000,
    status: VehicleStatus.RESERVED,
    observations: 'Blindado Nível III-A.',
    entryDate: '2023-11-20',
    photos: ['https://picsum.photos/seed/compass/400/300']
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'João Silva',
    document: '123.456.789-00',
    birthDate: '1985-05-15',
    phone: '(11) 98888-7777',
    email: 'joao.silva@email.com',
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    observations: 'Cliente preferencial.'
  },
  {
    id: 'c2',
    name: 'Maria Oliveira',
    document: '987.654.321-11',
    birthDate: '1990-10-22',
    phone: '(21) 97777-6666',
    email: 'maria.oliveira@email.com',
    address: 'Rua das Flores, 50',
    city: 'Rio de Janeiro',
    state: 'RJ',
    observations: 'Interesse em SUVs.'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 's1',
    clientId: 'c1',
    vehicleId: 'v1',
    date: '2023-12-05',
    value: 122000,
    paymentMethod: 'Financiamento',
    sellerName: 'Carlos Vendedor',
    status: SaleStatus.COMPLETED,
    observations: 'Venda rápida com desconto à vista.'
  }
];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Admin Master',
  email: 'admin@automanager.com',
  role: UserRole.ADMIN
};

export const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];
