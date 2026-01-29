
import React, { useState } from 'react';
import { SHOP_NAME, OWNER_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
    { id: 'inventory', icon: 'fa-boxes-stacked', label: 'Inventory' },
    { id: 'sales', icon: 'fa-cart-shopping', label: 'Sales/POS' },
    { id: 'ai-expert', icon: 'fa-robot', label: 'Zarai AI Expert' },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-green-900 text-white flex flex-col shadow-xl transition-transform duration-300 transform
        lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-green-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{SHOP_NAME}</h1>
            <p className="text-xs text-green-300 mt-1">Prop: {OWNER_NAME}</p>
          </div>
          <button 
            className="lg:hidden text-green-100 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-green-700 text-white shadow-md' 
                  : 'text-green-100 hover:bg-green-800'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-green-800">
          <div className="flex items-center space-x-3 text-sm text-green-200">
            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
              <i className="fas fa-user text-xs"></i>
            </div>
            <span>Admin Panel</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden mr-4 text-gray-600 hover:text-green-700 transition-colors p-2"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h2 className="text-lg font-semibold text-gray-800 capitalize truncate max-w-[150px] sm:max-w-none">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
             <div className="relative hidden sm:block">
                <i className="fas fa-bell text-gray-400 cursor-pointer hover:text-green-600"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">3</span>
             </div>
             <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
             <span className="text-[10px] sm:text-sm font-medium text-gray-600 whitespace-nowrap">PK Standard Time</span>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
