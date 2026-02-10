
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
    <div className="flex h-[calc(100vh-64px)] overflow-hidden dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col transition-colors">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img src={restaurant.logo} className="w-10 h-10 rounded-lg shadow-sm" />
            <h2 className="font-bold text-gray-900 dark:text-white truncate">{restaurant.name}</h2>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('ORDERS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'ORDERS' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
          >
            <ShoppingBag size={20} />
            Incoming Orders
          </button>
          <button 
            onClick={() => setActiveTab('MENU')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'MENU' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
          >
            <BookOpen size={20} />
            Menu Editor
          </button>
          <button 
            onClick={() => setActiveTab('REPORTS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'REPORTS' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
          >
            <BarChart3 size={20} />
            Sales Reports
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
        {activeTab === 'ORDERS' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-black dark:text-white">Order Management</h1>
              <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 border dark:border-gray-700 shadow-sm">
                <button 
                  onClick={() => setOrderFilter(OrderStatus.PENDING)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${orderFilter === OrderStatus.PENDING ? 'bg-orange-500 text-white shadow-md shadow-orange-100 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Ongoing
                </button>
                <button 
                  onClick={() => setOrderFilter(OrderStatus.COMPLETED)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${orderFilter === OrderStatus.COMPLETED ? 'bg-orange-500 text-white shadow-md shadow-orange-100 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Completed
                </button>
                <button 
                  onClick={() => setOrderFilter(OrderStatus.CANCELLED)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${orderFilter === OrderStatus.CANCELLED ? 'bg-orange-500 text-white shadow-md shadow-orange-100 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-20 text-center border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">No orders yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">New orders will appear here as they come in.</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-gray-400">#{order.id.split('_')[1]}</span>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{new Date(order.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">x{item.quantity} {item.name}</span>
                            <span className="text-gray-400 dark:text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total</span>
                        <span className="text-xl font-black text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 min-w-[140px]">
                      {order.status === OrderStatus.PENDING && (
                        <>
                          <button 
                            onClick={() => onUpdateOrder(order.id, OrderStatus.ONGOING)}
                            className="flex-1 py-3 px-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all"
                          >
                            Accept
                          </button>
                          <button 
                             onClick={() => onUpdateOrder(order.id, OrderStatus.CANCELLED)}
                             className="flex-1 py-3 px-4 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
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
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold justify-center py-2">
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
              <h1 className="text-2xl font-black dark:text-white">Menu Editor</h1>
              <button className="px-6 py-3 bg-black dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-white transition-all">Add New Item</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurant.menu.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border dark:border-gray-700 flex gap-4 hover:shadow-lg transition-all group">
                  <img src={item.image} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{item.category}</p>
                      </div>
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mb-3">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-lg text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">Active</span>
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
            <h1 className="text-2xl font-black mb-8 dark:text-white">Performance Insights</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-400 dark:text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Today's Revenue</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">$1,248.50</p>
                <p className="text-xs text-green-500 dark:text-green-400 mt-2 font-bold">+12.5% from yesterday</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-400 dark:text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Orders Today</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">42</p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-2 font-bold">-2.1% from yesterday</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-400 dark:text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Average Ticket</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">$29.72</p>
                <p className="text-xs text-green-500 dark:text-green-400 mt-2 font-bold">+5.4% from yesterday</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-lg dark:text-white">Weekly Sales Trend</h3>
                <select className="bg-gray-50 dark:bg-gray-700 dark:text-white border-none rounded-lg text-sm font-bold p-2 outline-none">
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#fff' }} 
                      itemStyle={{ color: '#fff' }}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl transition-colors">
            <h2 className="text-2xl font-black mb-6 dark:text-white">Edit Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Item Name</label>
                <input type="text" defaultValue={editingItem.name} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Price ($)</label>
                <input type="number" defaultValue={editingItem.price} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Description</label>
                <textarea rows={3} defaultValue={editingItem.description} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium resize-none"></textarea>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setEditingItem(null)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">Cancel</button>
              <button onClick={() => setEditingItem(null)} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 dark:shadow-none hover:bg-orange-600 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorView;
