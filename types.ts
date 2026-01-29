
export type Category = 'Insecticide' | 'Herbicide' | 'Fungicide' | 'Fertilizer' | 'Seeds' | 'Growth Regulator' | 'Equipment';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  unit: string; // e.g., '1 Litre', '500ml', '50kg Bag'
  price: number;
  stock: number;
  minStockThreshold: number;
  expiryDate?: string;
}

export interface StockHistoryEntry {
  id: string;
  productId: string;
  type: 'addition' | 'sale';
  quantity: number;
  date: string;
  note?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  date: string;
  customerName?: string;
}

export interface DashboardStats {
  totalStockValue: number;
  totalSalesToday: number;
  lowStockItems: number;
  expiredItems: number;
}
