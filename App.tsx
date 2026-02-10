
import React, { useState, useEffect } from 'react';
import { User, Role, Restaurant, Order, OrderStatus, CartItem, MenuItem } from './types';
import { MOCK_RESTAURANTS, INITIAL_USERS } from './constants';
import CustomerView from './pages/CustomerView';
import VendorView from './pages/VendorView';
import AdminView from './pages/AdminView';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { LogOut, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [locations, setLocations] = useState<string[]>(['Floor 1 - Zone A', 'Floor 2 - Zone B', 'Floor 1 - Zone C', 'Food Court - West']);
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'APP'>('LANDING');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setView('APP');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setView('LANDING');
  };

  const handleImpersonateVendor = (user: User) => {
    setCurrentUser(user);
    setCurrentRole('VENDOR');
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      items: [...cart],
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      customerId: 'guest_user',
      restaurantId: cart[0].restaurantId
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    alert('Order placed successfully!');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateMenuItem = (restaurantId: string, updatedItem: MenuItem) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        return {
          ...r,
          menu: r.menu.map(m => m.id === updatedItem.id ? updatedItem : m)
        };
      }
      return r;
    }));
  };

  const handleAddMenuItem = (restaurantId: string, newItem: MenuItem) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        return {
          ...r,
          menu: [...r.menu, newItem]
        };
      }
      return r;
    }));
  };

  const handlePermanentDeleteMenuItem = (restaurantId: string, itemId: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        return {
          ...r,
          menu: r.menu.filter(m => m.id !== itemId)
        };
      }
      return r;
    }));
  };

  const handleAddVendor = (newUser: User, newRestaurant: Restaurant) => {
    setAllUsers(prev => [...prev, { ...newUser, isActive: true }]);
    setRestaurants(prev => [...prev, newRestaurant]);
  };

  const handleUpdateVendor = (updatedUser: User, updatedRestaurant: Restaurant) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setRestaurants(prev => prev.map(r => r.id === updatedRestaurant.id ? updatedRestaurant : r));
  };

  const handleAddLocation = (newLoc: string) => {
    if (!locations.includes(newLoc)) {
      setLocations(prev => [...prev, newLoc]);
    }
  };

  const handleDeleteLocation = (locToDelete: string) => {
    setLocations(prev => prev.filter(l => l !== locToDelete));
  };

  if (view === 'LANDING') {
    return <LandingPage onScan={() => { setCurrentRole('CUSTOMER'); setView('APP'); }} onLoginClick={() => setView('LOGIN')} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />;
  }

  if (view === 'LOGIN') {
    return <LoginPage onLogin={handleLogin} onBack={() => setView('LANDING')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Universal Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">QuickServe</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {currentRole === 'CUSTOMER' && (
            <button onClick={() => setView('LANDING')} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400">Back to QR</button>
          )}
          
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                <p className="text-sm font-semibold dark:text-white">{currentUser.username}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            currentRole !== 'CUSTOMER' && (
              <button 
                onClick={() => setView('LOGIN')} 
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all shadow-md shadow-orange-200 dark:shadow-none"
              >
                Login
              </button>
            )
          )}
        </div>
      </header>

      <main className="flex-1">
        {currentRole === 'CUSTOMER' && (
          <CustomerView 
            restaurants={restaurants.map(res => ({
              ...res,
              menu: res.menu.filter(m => !m.isArchived)
            }))} 
            cart={cart}
            orders={orders}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onPlaceOrder={placeOrder}
          />
        )}

        {currentRole === 'VENDOR' && currentUser && (
          <VendorView 
            restaurant={restaurants.find(r => r.id === currentUser.restaurantId)!}
            orders={orders.filter(o => o.restaurantId === currentUser.restaurantId)}
            onUpdateOrder={updateOrderStatus}
            onUpdateMenu={updateMenuItem}
            onAddMenuItem={handleAddMenuItem}
            onPermanentDeleteMenuItem={handlePermanentDeleteMenuItem}
          />
        )}

        {currentRole === 'ADMIN' && (
          <AdminView 
            vendors={allUsers.filter(u => u.role === 'VENDOR')}
            restaurants={restaurants}
            orders={orders}
            locations={locations}
            onAddVendor={handleAddVendor}
            onUpdateVendor={handleUpdateVendor}
            onImpersonateVendor={handleImpersonateVendor}
            onAddLocation={handleAddLocation}
            onDeleteLocation={handleDeleteLocation}
          />
        )}
      </main>
    </div>
  );
};

export default App;
