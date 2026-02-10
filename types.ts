
export type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export enum OrderStatus {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  menu: MenuItem[];
  vendorId: string;
  location: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
  customerId: string;
  restaurantId: string;
}

export interface User {
  id: string;
  username: string;
  role: Role;
  restaurantId?: string;
  password?: string; // Only for admin view
  isActive?: boolean;
}

export interface SalesData {
  name: string;
  sales: number;
}
