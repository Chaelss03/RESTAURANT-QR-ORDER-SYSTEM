
import React, { useState } from 'react';
import { User, Role, Restaurant, Order, OrderStatus, CartItem } from './types';
import { MOCK_RESTAURANTS, INITIAL_USERS } from './constants';
import CustomerView from './pages/CustomerView';
import VendorView from './pages/VendorView';
import AdminView from './pages/AdminView';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'APP'>('LANDING');

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

  const updateMenuItem = (restaurantId: string, updatedItem: any) => {
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

  if (view === 'LANDING') {
    return <LandingPage onScan={() => { setCurrentRole('CUSTOMER'); setView('APP'); }} onLoginClick={() => setView('LOGIN')} />;
  }

  if (view === 'LOGIN') {
    return <LoginPage onLogin={handleLogin} onBack={() => setView('LANDING')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Universal Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm h-16 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">QuickServe</h1>
        </div>

        <div className="flex items-center gap-4">
          {currentRole === 'CUSTOMER' && (
            <button onClick={() => setView('LANDING')} className="text-sm font-medium text-gray-500 hover:text-orange-500">Back to QR</button>
          )}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                <p className="text-sm font-semibold">{currentUser.username}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            currentRole !== 'CUSTOMER' && (
              <button 
                onClick={() => setView('LOGIN')} 
                className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all"
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
            restaurants={restaurants} 
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
          />
        )}

        {currentRole === 'ADMIN' && (
          <AdminView 
            vendors={INITIAL_USERS.filter(u => u.role === 'VENDOR')}
            restaurants={restaurants}
            orders={orders}
          />
        )}
      </main>
    </div>
  );
};

export default App;
