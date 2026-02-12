
export enum VehicleStatus {
  AVAILABLE = 'Disponível',
  SOLD = 'Vendido',
  RESERVED = 'Reservado'
}

export enum FuelType {
  GASOLINE = 'Gasolina',
  ETHANOL = 'Etanol',
  FLEX = 'Flex',
  DIESEL = 'Diesel',
  ELECTRIC = 'Elétrico',
  HYBRID = 'Híbrido'
}

export enum SaleStatus {
  COMPLETED = 'Concluída',
  CANCELLED = 'Cancelada',
  PENDING = 'Pendente'
}

export enum UserRole {
  ADMIN = 'Administrador',
  SELLER = 'Vendedor',
  FINANCE = 'Financeiro'
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  chassis: string;
  mileage: number;
  fuelType: FuelType;
  price: number;
  status: VehicleStatus;
  observations: string;
  entryDate: string;
  photos: string[];
}

export interface Client {
  id: string;
  name: string;
  document: string; // CPF/CNPJ
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  observations: string;
}

export interface Sale {
  id: string;
  clientId: string;
  vehicleId: string;
  date: string;
  value: number;
  paymentMethod: string;
  sellerName: string;
  status: SaleStatus;
  observations: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}
