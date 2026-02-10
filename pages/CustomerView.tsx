
import React, { useState, useEffect, useRef } from 'react';
import { Restaurant, CartItem, Order, OrderStatus } from '../types';
import { ShoppingCart, Plus, Minus, X, CheckCircle, ChevronRight, Info } from 'lucide-react';

interface Props {
  restaurants: Restaurant[];
  cart: CartItem[];
  orders: Order[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  onPlaceOrder: () => void;
}

const CustomerView: React.FC<Props> = ({ restaurants, cart, orders, onAddToCart, onRemoveFromCart, onPlaceOrder }) => {
  const [activeRestaurant, setActiveRestaurant] = useState(restaurants[0].id);
  const [showCart, setShowCart] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (id: string) => {
    setActiveRestaurant(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const res of restaurants) {
        const el = sectionRefs.current[res.id];
        if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
          setActiveRestaurant(res.id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [restaurants]);

  return (
    <div className="relative min-h-screen pb-24">
      {/* Restaurant Navbar */}
      <nav className="sticky top-16 z-40 bg-white border-b overflow-x-auto hide-scrollbar flex items-center px-4 py-3 gap-3">
        {restaurants.map(res => (
          <button
            key={res.id}
            onClick={() => scrollToSection(res.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeRestaurant === res.id 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {res.name}
          </button>
        ))}
      </nav>

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
        {/* Active Orders Ticker */}
        {orders.filter(o => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.COMPLETED).length > 0 && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="font-semibold text-orange-800 text-sm md:text-base">Your order is being prepared...</p>
            </div>
            <button className="text-orange-600 text-xs md:text-sm font-bold flex items-center gap-1">
              Status <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Menu Sections */}
        <div className="space-y-12 md:space-y-16">
          {restaurants.map(res => (
            <section 
              key={res.id} 
              id={res.id} 
              ref={el => { sectionRefs.current[res.id] = el; }}
              className="scroll-mt-32"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 px-2">
                <img src={res.logo} alt={res.name} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover shadow-sm" />
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900">{res.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 uppercase">Popular</span>
                    <span className="text-xs text-gray-400 hidden sm:inline">• Free Delivery</span>
                  </div>
                </div>
              </div>

              {/* Grid: 3 columns on mobile, scaling up for desktop */}
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                {res.menu.map(item => (
                  <div key={item.id} className="group bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                    <div className="relative h-24 md:h-48 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-1 right-1 md:top-3 md:right-3 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-md md:rounded-lg text-[8px] md:text-xs font-bold text-gray-800 shadow-sm">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-2 md:p-5 flex-1 flex flex-col">
                      <div className="flex flex-col mb-1 md:mb-2">
                        <h4 className="font-bold text-xs md:text-lg text-gray-800 leading-tight line-clamp-1">{item.name}</h4>
                        <span className="font-black text-orange-500 text-xs md:text-base">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-500 text-xs mb-4 line-clamp-2 hidden md:block">{item.description}</p>
                      
                      <button 
                        onClick={() => onAddToCart({ ...item, quantity: 1, restaurantId: res.id })}
                        className="mt-auto w-full py-1.5 md:py-3 bg-orange-50 text-orange-600 rounded-lg md:rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-orange-500 hover:text-white transition-all text-[10px] md:text-sm active:scale-95"
                      >
                        <Plus size={14} className="md:w-5 md:h-5" />
                        <span className="hidden md:inline">Add to Order</span>
                        <span className="md:hidden">Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Persistent Cart Floating Action Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
          <button 
            onClick={() => setShowCart(true)}
            className="w-full bg-black text-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-sm">{cart.length}</div>
              <span className="font-bold text-sm md:text-base">View Cart</span>
            </div>
            <span className="font-black text-base md:text-lg">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart Modal Overlay */}
      {showCart && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-black">Your Order</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between font-bold">
                      <p className="text-sm md:text-base">{item.name}</p>
                      <p className="text-sm md:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button onClick={() => onRemoveFromCart(item.id)} className="p-1.5 hover:bg-gray-100"><Minus size={14} /></button>
                        <span className="px-3 py-1 font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => onAddToCart(item)} className="p-1.5 hover:bg-gray-100"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="space-y-2 mb-6 text-gray-600">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Service Fee</span><span>$1.50</span></div>
                <div className="flex justify-between text-xl font-black text-gray-900 border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>${(cartTotal + 1.5).toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => { onPlaceOrder(); setShowCart(false); }}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-orange-600 transition-all active:scale-[0.98]"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerView;
