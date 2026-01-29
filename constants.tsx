
import { Product, Category } from './types';

export const SHOP_NAME = "Insaaf Zarai Markaz";
export const OWNER_NAME = "Ishrat Ullah Khan";
export const CURRENCY = "PKR";

export const CATEGORIES: Category[] = [
  'Insecticide',
  'Herbicide',
  'Fungicide',
  'Fertilizer',
  'Seeds',
  'Growth Regulator',
  'Equipment'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Emamectin Benzoate (Proclaim)',
    brand: 'Syngenta',
    category: 'Insecticide',
    unit: '200g',
    price: 1850,
    stock: 45,
    minStockThreshold: 10,
    expiryDate: '2025-12-30'
  },
  {
    id: '2',
    name: 'Sonalika Wheat Seeds',
    brand: 'Local Premium',
    category: 'Seeds',
    unit: '50kg Bag',
    price: 5500,
    stock: 120,
    minStockThreshold: 20,
    expiryDate: '2024-11-15'
  },
  {
    id: '3',
    name: 'Glyphosate (Roundup)',
    brand: 'Bayer',
    category: 'Herbicide',
    unit: '1 Litre',
    price: 2400,
    stock: 8,
    minStockThreshold: 15,
    expiryDate: '2026-06-20'
  },
  {
    id: '4',
    name: 'Urea Fertilizer',
    brand: 'Engro',
    category: 'Fertilizer',
    unit: '50kg Bag',
    price: 4800,
    stock: 500,
    minStockThreshold: 50,
    expiryDate: '2028-01-01'
  },
  {
    id: '5',
    name: 'DAP Fertilizer',
    brand: 'FFC',
    category: 'Fertilizer',
    unit: '50kg Bag',
    price: 12500,
    stock: 15,
    minStockThreshold: 20,
    expiryDate: '2027-05-10'
  }
];
