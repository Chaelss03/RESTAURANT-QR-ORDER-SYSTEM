
import React, { useState } from 'react';
import { Restaurant, Order, OrderStatus, MenuItem } from '../types';
import { LayoutDashboard, ShoppingBag, BookOpen, BarChart3, ChevronRight, Edit3, CheckCircle, Clock, XCircle, MoreVertical } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Props {
  restaurant: Restaurant;
  orders: Order[];
  onUpdateOrder: (orderId: string, status: OrderStatus) => void;
  onUpdateMenu: (restaurantId: string, updatedItem: MenuItem) => void;
}

const MOCK_SALES = [
  { name: 'Mon', sales: 400 },
  { name: 'Tue', sales: 600 },
  { name: 'Wed', sales: 500 },
  { name: 'Thu', sales: 900 },
  { name: 'Fri', sales: 1200 },
  { name: 'Sat', sales: 1500 },
  { name: 'Sun', sales: 1100 },
];

const VendorView: React.FC<Props> = ({ restaurant, orders, onUpdateOrder, onUpdateMenu }) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'MENU' | 'REPORTS'>('ORDERS');
  const [orderFilter, setOrderFilter] = useState<OrderStatus>(OrderStatus.PENDING);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const filteredOrders = orders.filter(o => {
    if (orderFilter === OrderStatus.PENDING) return o.status === OrderStatus.PENDING || o.status === OrderStatus.ONGOING;
    return o.status === orderFilter;
  });

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <img src={restaurant.logo} className="w-10 h-10 rounded-lg shadow-sm" />
            <h2 className="font-bold text-gray-900 truncate">{restaurant.name}</h2>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('ORDERS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'ORDERS' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ShoppingBag size={20} />
            Incoming Orders
          </button>
          <button 
            onClick={() => setActiveTab('MENU')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'MENU' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <BookOpen size={20} />
            Menu Editor
          </button>
          <button 
            onClick={() => setActiveTab('REPORTS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'REPORTS' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <BarChart3 size={20} />
            Sales Reports
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {activeTab === 'ORDERS' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-black">Order Management</h1>
              <div className="flex bg-white rounded-xl p-1 border shadow-sm">
                <button 
                  onClick={() => setOrderFilter(OrderStatus.PENDING)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${orderFilter === OrderStatus.PENDING ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Ongoing
                </button>
                <button 
                  onClick={() => setOrderFilter(OrderStatus.COMPLETED)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${orderFilter === OrderStatus.COMPLETED ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Completed
                </button>
                <button 
                  onClick={() => setOrderFilter(OrderStatus.CANCELLED)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${orderFilter === OrderStatus.CANCELLED ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
                  <p className="text-gray-500">New orders will appear here as they come in.</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-gray-400">#{order.id.split('_')[1]}</span>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-xs font-medium text-gray-500">{new Date(order.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-gray-700">x{item.quantity} {item.name}</span>
                            <span className="text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total</span>
                        <span className="text-xl font-black text-gray-900">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 min-w-[140px]">
                      {order.status === OrderStatus.PENDING && (
                        <>
                          <button 
                            onClick={() => onUpdateOrder(order.id, OrderStatus.ONGOING)}
                            className="flex-1 py-3 px-4 bg-orange-100 text-orange-600 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all"
                          >
                            Accept
                          </button>
                          <button 
                             onClick={() => onUpdateOrder(order.id, OrderStatus.CANCELLED)}
                             className="flex-1 py-3 px-4 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {order.status === OrderStatus.ONGOING && (
                        <button 
                          onClick={() => onUpdateOrder(order.id, OrderStatus.COMPLETED)}
                          className="flex-1 py-3 px-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Ready
                        </button>
                      )}
                      {order.status === OrderStatus.COMPLETED && (
                        <div className="flex items-center gap-2 text-green-600 font-bold justify-center py-2">
                          <CheckCircle size={20} />
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'MENU' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-black">Menu Editor</h1>
              <button className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all">Add New Item</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurant.menu.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 border flex gap-4 hover:shadow-lg transition-all group">
                  <img src={item.image} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                      </div>
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-orange-500 transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-3">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-lg text-gray-900">${item.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'REPORTS' && (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-black mb-8">Performance Insights</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm font-bold mb-1 uppercase tracking-wider">Today's Revenue</p>
                <p className="text-3xl font-black text-gray-900">$1,248.50</p>
                <p className="text-xs text-green-500 mt-2 font-bold">+12.5% from yesterday</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm font-bold mb-1 uppercase tracking-wider">Orders Today</p>
                <p className="text-3xl font-black text-gray-900">42</p>
                <p className="text-xs text-red-500 mt-2 font-bold">-2.1% from yesterday</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-sm font-bold mb-1 uppercase tracking-wider">Average Ticket</p>
                <p className="text-3xl font-black text-gray-900">$29.72</p>
                <p className="text-xs text-green-500 mt-2 font-bold">+5.4% from yesterday</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-lg">Weekly Sales Trend</h3>
                <select className="bg-gray-50 border-none rounded-lg text-sm font-bold p-2 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_SALES}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                      cursor={{ stroke: '#f97316', strokeWidth: 2 }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quick Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-pop">
            <h2 className="text-2xl font-black mb-6">Edit Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">Item Name</label>
                <input type="text" defaultValue={editingItem.name} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">Price ($)</label>
                <input type="number" defaultValue={editingItem.price} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">Description</label>
                <textarea rows={3} defaultValue={editingItem.description} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 font-medium resize-none"></textarea>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setEditingItem(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={() => setEditingItem(null)} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorView;
