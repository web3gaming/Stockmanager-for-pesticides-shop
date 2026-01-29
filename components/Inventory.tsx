
import React, { useState } from 'react';
import { Product, Category, StockHistoryEntry } from '../types';
import { CURRENCY, CATEGORIES } from '../constants';

interface InventoryProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateStock: (id: string, amount: number) => void;
  history: StockHistoryEntry[];
}

const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateStock, history }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <i className="fas fa-search text-gray-400 mr-3"></i>
          <input 
            type="text" 
            placeholder="Search products by name or brand..." 
            className="bg-transparent border-none outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-colors"
          >
            <i className="fas fa-plus"></i>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Current Stock</th>
              <th className="px-6 py-4">Price ({CURRENCY})</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.brand}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-[10px] font-bold uppercase">
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className={`font-medium ${p.stock <= p.minStockThreshold ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                    {p.stock} <span className="text-xs text-gray-400 font-normal">{p.unit}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {p.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs ${p.expiryDate && new Date(p.expiryDate) < new Date() ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                    {p.expiryDate || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => onUpdateStock(p.id, 1)}
                      className="p-2 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                      title="Add 1 Unit"
                    >
                      <i className="fas fa-circle-plus"></i>
                    </button>
                    <button 
                      onClick={() => setHistoryProduct(p)}
                      className="p-2 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                      title="Stock History"
                    >
                      <i className="fas fa-clock-rotate-left"></i>
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                      title="Edit Details"
                    >
                      <i className="fas fa-pen-to-square text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={(p) => {
            onAddProduct(p);
            setIsModalOpen(false);
          }} 
        />
      )}

      {historyProduct && (
        <HistoryModal 
          product={historyProduct} 
          entries={history.filter(h => h.productId === historyProduct.id)}
          onClose={() => setHistoryProduct(null)} 
        />
      )}
    </div>
  );
};

const HistoryModal = ({ product, entries, onClose }: { product: Product, entries: StockHistoryEntry[], onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-800 p-6 text-white flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-xs text-blue-200 font-medium tracking-widest uppercase mt-1">Stock Movement History</p>
          </div>
          <button onClick={onClose} className="hover:text-blue-200 p-2">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <i className="fas fa-history text-5xl mb-4 opacity-20"></i>
              <p>No stock history available for this product.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.slice().reverse().map(entry => (
                <div key={entry.id} className="flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    entry.type === 'addition' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <i className={`fas ${entry.type === 'addition' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900">
                        {entry.type === 'addition' ? 'Stock Restocked' : 'Stock Deducted (Sale)'}
                      </h4>
                      <span className={`font-black text-sm ${entry.type === 'addition' ? 'text-green-700' : 'text-red-700'}`}>
                        {entry.type === 'addition' ? '+' : '-'}{entry.quantity} {product.unit}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{entry.note}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">
                      {new Date(entry.date).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
           <div className="text-sm font-medium text-gray-500">Current Stock: <span className="text-gray-900 font-bold">{product.stock} {product.unit}</span></div>
           <button onClick={onClose} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold">Close History</button>
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (p: Product) => void }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    category: 'Insecticide',
    stock: 0,
    minStockThreshold: 10,
    price: 0
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-green-800 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">New Inventory Entry</h3>
          <button onClick={onClose} className="hover:text-green-200 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            ...formData,
            id: Math.random().toString(36).substr(2, 9),
          } as Product);
        }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
              <input 
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" 
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none" 
                onChange={e => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none"
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit (e.g., 1L)</label>
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none" 
                onChange={e => setFormData({...formData, unit: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ({CURRENCY})</label>
              <input 
                type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none" 
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Stock</label>
              <input 
                type="number"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none" 
                onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
              />
            </div>
             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
              <input 
                type="date"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 outline-none" 
                onChange={e => setFormData({...formData, expiryDate: e.target.value})}
              />
            </div>
          </div>
          <div className="pt-4">
            <button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95">
              Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inventory;
