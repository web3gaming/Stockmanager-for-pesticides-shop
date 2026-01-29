
import React, { useMemo } from 'react';
import { Product, Sale } from '../types';
import { CURRENCY } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const stats = useMemo(() => {
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const today = new Date().toISOString().split('T')[0];
    
    // Updated to use sale.totalAmount for the new structure
    const salesToday = sales
      .filter(s => s.date.startsWith(today))
      .reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    
    const lowStock = products.filter(p => p.stock <= p.minStockThreshold).length;
    
    const now = new Date();
    const expired = products.filter(p => p.expiryDate && new Date(p.expiryDate) < now).length;

    return { totalValue, salesToday, lowStock, expired };
  }, [products, sales]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + (p.price * p.stock);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = ['#15803d', '#166534', '#14532d', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Stock Value" 
          value={`${CURRENCY} ${stats.totalValue.toLocaleString()}`} 
          icon="fa-warehouse" 
          color="bg-green-600" 
        />
        <StatCard 
          title="Sales Today" 
          value={`${CURRENCY} ${stats.salesToday.toLocaleString()}`} 
          icon="fa-coins" 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats.lowStock.toString()} 
          icon="fa-triangle-exclamation" 
          color="bg-orange-600" 
          alert={stats.lowStock > 0}
        />
        <StatCard 
          title="Expired Items" 
          value={stats.expired.toString()} 
          icon="fa-calendar-xmark" 
          color="bg-red-600" 
          alert={stats.expired > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Stock Value by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                   formatter={(value: number) => [`${CURRENCY} ${value.toLocaleString()}`, 'Value']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Critical Stock Alerts</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {products.filter(p => p.stock <= p.minStockThreshold).map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div>
                  <h4 className="font-semibold text-gray-900">{p.name}</h4>
                  <p className="text-xs text-orange-700">Available: {p.stock} {p.unit} | Min: {p.minStockThreshold}</p>
                </div>
                <button className="text-xs font-bold text-white bg-orange-600 px-3 py-1.5 rounded-md hover:bg-orange-700">
                  Restock
                </button>
              </div>
            ))}
            {products.filter(p => p.stock <= p.minStockThreshold).length === 0 && (
              <div className="text-center py-12 text-gray-500 italic">
                All stock levels are currently healthy.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, alert }: { title: string, value: string, icon: string, color: string, alert?: boolean }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border ${alert ? 'border-red-200 animate-pulse' : 'border-gray-100'} flex items-center space-x-4`}>
    <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl shadow-lg`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
