
import React from 'react';
import { QrCode, Utensils, ShieldCheck, ShoppingBag, Sun, Moon } from 'lucide-react';

interface Props {
  onScan: () => void;
  onLoginClick: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const LandingPage: React.FC<Props> = ({ onScan, onLoginClick, isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200 dark:shadow-none">Q</div>
          <span className="text-2xl font-black tracking-tighter dark:text-white">QuickServe</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={onLoginClick}
            className="text-gray-600 dark:text-gray-400 font-semibold hover:text-orange-500 transition-colors"
          >
            Staff Login
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/20 rounded-full scale-150 blur-3xl opacity-50 -z-10 animate-pulse"></div>
          <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-orange-50 dark:border-gray-700 flex flex-col items-center">
            <QrCode size={120} className="text-gray-800 dark:text-gray-200 mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Scan to Order</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">Skip the queue and order directly from your table</p>
            <button 
              onClick={onScan}
              className="mt-8 px-10 py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-200 dark:shadow-none"
            >
              Simulate Scan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full py-12">
          <div className="p-6 rounded-2xl bg-orange-50 dark:bg-gray-800 border border-orange-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-orange-500 shadow-sm mb-4 mx-auto md:mx-0">
              <Utensils size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Explore Menus</h3>
            <p className="text-gray-600 dark:text-gray-400">Browse a wide variety of restaurants with interactive digital menus.</p>
          </div>
          <div className="p-6 rounded-2xl bg-orange-50 dark:bg-gray-800 border border-orange-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-orange-500 shadow-sm mb-4 mx-auto md:mx-0">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Fast Ordering</h3>
            <p className="text-gray-600 dark:text-gray-400">Add to cart and pay instantly. Your food will be served right to you.</p>
          </div>
          <div className="p-6 rounded-2xl bg-orange-50 dark:bg-gray-800 border border-orange-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-orange-500 shadow-sm mb-4 mx-auto md:mx-0">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Secure Payments</h3>
            <p className="text-gray-600 dark:text-gray-400">Multiple payment options with industry-standard security protocols.</p>
          </div>
        </div>
      </div>
      
      <footer className="p-8 text-center text-gray-400 dark:text-gray-600 text-sm border-t dark:border-gray-800">
        © 2024 QuickServe Systems. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
