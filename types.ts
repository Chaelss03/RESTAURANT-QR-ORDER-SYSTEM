
export type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export enum OrderStatus {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface MenuItemVariant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isArchived?: boolean; // Added for archiving logic
  sizes?: MenuItemVariant[];
  tempOptions?: {
    hot?: number;
    cold?: number;
    enabled: boolean;
  };
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
  selectedSize?: string;
  selectedTemp?: 'Hot' | 'Cold';
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
  password?: string;
  isActive?: boolean;
}

export interface SalesData {
  name: string;
  sales: number;
}
