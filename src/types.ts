export type Address = {
  country?: string;
  town?: string;
  street?: string;
  houseNumber?: string;
};

export interface Product {
  id: number | string;
  title: string;
  price: number;
  isAvailable: boolean;
  description: string;
  categories: string[];
  images: {
    preview: string;
    gallery?: string[];
  };
  delivery?: {
    startTown: Address;
    earlyDate: string | Date; 
    price: number;
  };
  discount?: number;
}

export interface Delivery {
  id: string;
  items: Product[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  address: Address;
}

export interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
  cart: Product[];
  deliveries: Delivery[];
}
