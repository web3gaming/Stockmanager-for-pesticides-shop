
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import ZaraiExpert from './components/ZaraiExpert';
import { Product, Sale, StockHistoryEntry } from './types';
import { INITIAL_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('izm_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('izm_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [stockHistory, setStockHistory] = useState<StockHistoryEntry[]>(() => {
    const saved = localStorage.getItem('izm_stock_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('izm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('izm_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('izm_stock_history', JSON.stringify(stockHistory));
  }, [stockHistory]);

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    // Log initial stock as an addition
    if (newProduct.stock > 0) {
      const historyEntry: StockHistoryEntry = {
        id: Math.random().toString(36).substr(2, 9),
        productId: newProduct.id,
        type: 'addition',
        quantity: newProduct.stock,
        date: new Date().toISOString(),
        note: 'Initial Stock'
      };
      setStockHistory(prev => [...prev, historyEntry]);
    }
  };

  const handleUpdateStock = (id: string, amount: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, stock: p.stock + amount } : p
    ));

    const historyEntry: StockHistoryEntry = {
      id: Math.random().toString(36).substr(2, 9),
      productId: id,
      type: 'addition',
      quantity: amount,
      date: new Date().toISOString(),
      note: 'Manual Restock'
    };
    setStockHistory(prev => [...prev, historyEntry]);
  };

  const handleProcessSale = (saleData: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };

    setSales(prev => [...prev, newSale]);
    
    // Deduct stock and log history for each item
    const newHistoryEntries: StockHistoryEntry[] = [];
    
    setProducts(prev => {
      let updated = [...prev];
      newSale.items.forEach(item => {
        updated = updated.map(p => 
          p.id === item.productId ? { ...p, stock: p.stock - item.quantity } : p
        );
        newHistoryEntries.push({
          id: Math.random().toString(36).substr(2, 9),
          productId: item.productId,
          type: 'sale',
          quantity: item.quantity,
          date: new Date().toISOString(),
          note: `Sale ID: ${newSale.id} (${newSale.customerName || 'Walk-in'})`
        });
      });
      return updated;
    });

    setStockHistory(prev => [...prev, ...newHistoryEntries]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} sales={sales} />;
      case 'inventory':
        return (
          <Inventory 
            products={products} 
            onAddProduct={handleAddProduct} 
            onUpdateStock={handleUpdateStock} 
            history={stockHistory}
          />
        );
      case 'sales':
        return <Sales products={products} sales={sales} onProcessSale={handleProcessSale} />;
      case 'ai-expert':
        return <ZaraiExpert products={products} />;
      default:
        return <Dashboard products={products} sales={sales} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
