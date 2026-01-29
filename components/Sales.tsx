
import React, { useState } from 'react';
import { Product, Sale, SaleItem } from '../types';
import { CURRENCY } from '../constants';

interface SalesProps {
  products: Product[];
  sales: Sale[];
  onProcessSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
}

const Sales: React.FC<SalesProps> = ({ products, sales, onProcessSale }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const addToCart = () => {
    if (!selectedProduct) return;
    
    // Check if adding this would exceed stock (considering items already in cart)
    const existingCartItem = cart.find(item => item.productId === selectedProduct.id);
    const cartQuantity = existingCartItem ? existingCartItem.quantity : 0;
    
    if (quantity + cartQuantity > selectedProduct.stock) {
      alert(`Maaf kijiye, sirf ${selectedProduct.stock} units maujood hain!`);
      return;
    }

    if (existingCartItem) {
      setCart(cart.map(item => 
        item.productId === selectedProduct.id 
          ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * item.unitPrice }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        unitPrice: selectedProduct.price,
        totalPrice: selectedProduct.price * quantity
      }]);
    }

    setSelectedProductId('');
    setQuantity(1);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const calculateCartTotal = () => cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    onProcessSale({
      items: cart,
      totalAmount: calculateCartTotal(),
      customerName: customerName.trim() || 'Walk-in Customer'
    });

    // Reset everything
    setCart([]);
    setCustomerName('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Product Selection & Cart */}
      <div className="xl:col-span-8 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <i className="fas fa-cart-plus text-green-600 mr-2"></i>
            1. Select Products
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Search Item</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
              >
                <option value="">Select a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.name} ({p.stock} in stock)
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">Qty</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2">
                <input 
                  type="number" 
                  min="1"
                  className="w-full bg-transparent px-2 py-3 outline-none text-center font-bold"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                />
                <span className="text-xs text-gray-400 font-medium px-2 border-l border-gray-200">{selectedProduct?.unit || 'Units'}</span>
              </div>
            </div>
            <div className="md:col-span-3">
              <button 
                onClick={addToCart}
                disabled={!selectedProductId}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                <i className="fas fa-plus mr-2"></i> Add to Bill
              </button>
            </div>
          </div>
        </div>

        {/* Current Bill Display */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">2. Current Bill Items</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
              {cart.length} Products Added
            </span>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                <i className="fas fa-shopping-basket text-6xl mb-4 opacity-20"></i>
                <p className="italic">Bill is empty. Add products from the section above.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cart.map(item => (
                    <tr key={item.productId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{item.productName}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">{item.unitPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-green-700">{item.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-400 hover:text-red-600 transition-colors p-2"
                        >
                          <i className="fas fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-green-50/50 border-t border-green-100">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Customer Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Enter customer name..."
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 w-64"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Total Bill Amount</p>
                  <p className="text-3xl font-black text-green-900">{CURRENCY} {calculateCartTotal().toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-3 text-lg"
              >
                <i className="fas fa-check-circle"></i>
                <span>Finalize Transaction & Generate Bill</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sales History Sidebar */}
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full max-h-[800px]">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">Recent Bills</h3>
            <i className="fas fa-receipt text-gray-300"></i>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {sales.length === 0 ? (
              <div className="p-12 text-center text-gray-400 italic text-sm">No history yet.</div>
            ) : (
              sales.slice().reverse().map(sale => (
                <div key={sale.id} className="p-5 hover:bg-gray-50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-black text-gray-900 group-hover:text-green-800 transition-colors text-sm">
                        {sale.customerName || 'Walk-in'}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        ID: {sale.id} • {new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <span className="text-sm font-black text-green-700">{CURRENCY} {sale.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="text-[11px] text-gray-500 flex justify-between">
                        <span>{item.productName} x {item.quantity}</span>
                        <span className="font-medium">{item.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
