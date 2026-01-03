export interface Product {
  id: string;
  name: string;
  category: 'crops' | 'livestock';
  subcategory: string;
  quantity: string;
  price?: string;
  location: string;
  description?: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  location: string;
  isSeller: boolean;
  createdAt: Date;
}

export const CATEGORIES = {
  crops: {
    label: 'Crops',
    icon: '🌾',
    subcategories: ['Maize', 'Sorghum', 'Rice', 'Banana', 'Sesame'],
  },
  livestock: {
    label: 'Livestock',
    icon: '🐄',
    subcategories: ['Camel', 'Cow', 'Goat', 'Sheep'],
  },
} as const;

export const LOCATIONS = [
  'Mogadishu',
  'Hargeisa',
  'Kismayo',
  'Baidoa',
  'Garowe',
  'Bosaso',
  'Beledweyne',
  'Jowhar',
  'Merca',
  'Burao',
] as const;
