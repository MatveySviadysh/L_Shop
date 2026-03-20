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
    earlyDate: string | Date; // Date is often stringified in JSON
    price: number;
  };
  discount?: number;
}

export interface User {
  name: string;
  email: string;
  login: string;
  phone: string;
  cart: Product[];
  deliveries: any[]; // Can be more specific later
}
