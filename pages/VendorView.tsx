
import React, { useState } from 'react';
import { Restaurant, Order, OrderStatus, MenuItem, MenuItemVariant } from '../types';
import { ShoppingBag, BookOpen, BarChart3, Edit3, CheckCircle, Clock, X, Plus, Trash2, Image as ImageIcon, Thermometer, LayoutGrid, List, Filter, Archive, RotateCcw, XCircle, Power, Eye } from 'lucide-react';

interface Props {
  restaurant: Restaurant;
  orders: Order[];
  onUpdateOrder: (orderId: string, status: OrderStatus) => void;
  onUpdateMenu: (restaurantId: string, updatedItem: MenuItem) => void;
  onAddMenuItem: (restaurantId: string, newItem: MenuItem) => void;
  onPermanentDeleteMenuItem: (restaurantId: string, itemId: string) => void;
}

const VendorView: React.FC<Props> = ({ restaurant, orders, onUpdateOrder, onUpdateMenu, onAddMenuItem, onPermanentDeleteMenuItem }) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'MENU' | 'REPORTS'>('ORDERS');
  const [orderFilter, setOrderFilter] = useState<OrderStatus>(OrderStatus.PENDING);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  
  // Menu View Options
  const [menuViewMode, setMenuViewMode] = useState<'grid' | 'list'>('grid');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('All');
  const [menuStatusFilter, setMenuStatusFilter] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');

  // Unified Form State (for both Add and Edit)
  const [formItem, setFormItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'Main',
    sizes: [],
    tempOptions: { enabled: false, hot: 0, cold: 0 }
  });

  const categories = ['All', ...new Set(restaurant.menu.map(item => item.category))];

  const filteredOrders = orders.filter(o => {
    if (orderFilter === OrderStatus.PENDING) return o.status === OrderStatus.PENDING || o.status === OrderStatus.ONGOING;
    return o.status === orderFilter;
  });

  // Filter based on Active/Archived and Category
  const currentMenu = restaurant.menu.filter(item => {
    const statusMatch = menuStatusFilter === 'ACTIVE' ? !item.isArchived : !!item.isArchived;
    const categoryMatch = menuCategoryFilter === 'All' || item.category === menuCategoryFilter;
    return statusMatch && categoryMatch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormItem({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'Main',
      sizes: [],
      tempOptions: { enabled: false, hot: 0, cold: 0 }
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormItem({
      ...item,
      sizes: item.sizes ? [...item.sizes] : [],
      tempOptions: item.tempOptions ? { ...item.tempOptions } : { enabled: false, hot: 0, cold: 0 }
    });
    setIsFormModalOpen(true);
  };

  const handleAddSize = () => {
    setFormItem({
      ...formItem,
      sizes: [...(formItem.sizes || []), { name: '', price: 0 }]
    });
  };

  const handleRemoveSize = (index: number) => {
    setFormItem({
      ...formItem,
      sizes: formItem.sizes?.filter((_, i) => i !== index)
    });
  };

  const handleSizeChange = (index: number, field: 'name' | 'price', value: string | number) => {
    const updatedSizes = [...(formItem.sizes || [])];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setFormItem({ ...formItem, sizes: updatedSizes });
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.name || !formItem.price) return;

    const itemToSave: MenuItem = {
      id: editingItem ? editingItem.id : `m_${Date.now()}`,
      name: formItem.name || '',
      description: formItem.description || '',
      price: Number(formItem.price),
      image: formItem.image || `https://picsum.photos/seed/${formItem.name}/400/300`,
      category: formItem.category || 'Main',
      isArchived: editingItem ? editingItem.isArchived : false,
      sizes: formItem.sizes,
      tempOptions: formItem.tempOptions?.enabled ? formItem.tempOptions : undefined
    };

    if (editingItem) {
      onUpdateMenu(restaurant.id, itemToSave);
    } else {
      onAddMenuItem(restaurant.id, itemToSave);
    }
    
    setIsFormModalOpen(false);
  };

  const handleArchiveItem = (item: MenuItem) => {
    onUpdateMenu(restaurant.id, { ...item, isArchived: true });
  };

  const handleRestoreItem = (item: MenuItem) => {
    onUpdateMenu(restaurant.id, { ...item, isArchived: false });
  };

  const handlePermanentDelete = (itemId: string) => {
    if (confirm('Are you sure you want to permanently delete this item?')) {
      onPermanentDeleteMenuItem(restaurant.id, itemId);
    }
  };

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
                            <span className="font-semibold text-gray-700 dark:text-gray-200">x{item.quantity} {item.name} {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'MENU' && (
          <div className="max-w-6xl mx-auto">
            {/* Menu Header with Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-black dark:text-white">Menu Editor</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customize your offerings and layout.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Status Toggle (Active / Archived) */}
                <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 border dark:border-gray-700 shadow-sm">
                  <button 
                    onClick={() => setMenuStatusFilter('ACTIVE')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${menuStatusFilter === 'ACTIVE' ? 'bg-orange-500 text-white shadow-md shadow-orange-100 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <Eye size={14} />
                    Active
                  </button>
                  <button 
                    onClick={() => setMenuStatusFilter('ARCHIVED')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${menuStatusFilter === 'ARCHIVED' ? 'bg-orange-500 text-white shadow-md shadow-orange-100 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <Archive size={14} />
                    Archived
                  </button>
                </div>

                {/* View Switcher */}
                <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 border dark:border-gray-700 shadow-sm">
                  <button 
                    onClick={() => setMenuViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${menuViewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    title="Grid View"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setMenuViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${menuViewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    title="List View"
                  >
                    <List size={18} />
                  </button>
                </div>

                <button 
                  onClick={handleOpenAddModal}
                  className="px-6 py-3 bg-black dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-white transition-all shadow-lg ml-auto"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 mb-8 bg-white dark:bg-gray-800 px-4 py-2 border dark:border-gray-700 rounded-2xl shadow-sm overflow-x-auto hide-scrollbar">
              <Filter size={16} className="text-gray-400 shrink-0" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setMenuCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${menuCategoryFilter === cat ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu List rendering based on View Mode */}
            {currentMenu.length === 0 ? (
               <div className="bg-white dark:bg-gray-800 rounded-3xl p-20 text-center border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">No items found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Try changing your filters or add a new item.</p>
               </div>
            ) : (
              menuViewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMenu.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border dark:border-gray-700 hover:shadow-xl transition-all group flex flex-col">
                      <div className="relative h-48">
                        <img src={item.image} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 flex gap-2">
                          {menuStatusFilter === 'ACTIVE' ? (
                            <>
                              <button 
                                onClick={() => handleArchiveItem(item)}
                                className="p-2.5 bg-red-50/90 dark:bg-red-900/90 backdrop-blur rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Deactivate"
                              >
                                <XCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleOpenEditModal(item)}
                                className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl text-gray-700 dark:text-gray-200 hover:text-orange-500 transition-colors shadow-sm"
                                title="Edit"
                              >
                                <Edit3 size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleRestoreItem(item)}
                                className="p-2.5 bg-green-50/90 dark:bg-green-900/90 backdrop-blur rounded-xl text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                                title="Restore"
                              >
                                <RotateCcw size={18} />
                              </button>
                              <button 
                                onClick={() => handlePermanentDelete(item.id)}
                                className="p-2.5 bg-red-50/90 dark:bg-red-900/90 backdrop-blur rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Delete Forever"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4">
                           <span className="px-3 py-1 bg-black/50 backdrop-blur text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">{item.category}</span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">{item.description}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-xl font-black text-orange-500">${item.price.toFixed(2)}</span>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${item.isArchived ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'}`}>
                            {item.isArchived ? 'Archived' : 'Live'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-xs font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 md:px-8 py-4 text-left">Item</th>
                        <th className="px-4 py-4 text-left hidden sm:table-cell">Category</th>
                        <th className="px-4 py-4 text-left">Price</th>
                        <th className="px-6 md:px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {currentMenu.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-6 md:px-8 py-4">
                            <div className="flex items-center gap-4">
                              <img src={item.image} className={`w-12 h-12 rounded-xl object-cover ${item.isArchived ? 'grayscale opacity-50' : ''}`} />
                              <div className="max-w-[120px] md:max-w-md">
                                <p className={`font-bold text-gray-900 dark:text-white ${item.isArchived ? 'opacity-50' : ''}`}>{item.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate hidden md:block">{item.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                             <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{item.category}</span>
                          </td>
                          <td className="px-4 py-4 font-black text-gray-900 dark:text-white">${item.price.toFixed(2)}</td>
                          <td className="px-6 md:px-8 py-4 text-right">
                             <div className="flex justify-end items-center gap-2 md:gap-4">
                               {menuStatusFilter === 'ACTIVE' ? (
                                 <>
                                   <button 
                                     onClick={() => handleArchiveItem(item)}
                                     className="p-2 md:p-3 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                     title="Deactivate"
                                   >
                                     <Power size={18} />
                                   </button>
                                   <button 
                                     onClick={() => handleOpenEditModal(item)}
                                     className="p-2 md:p-3 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400 rounded-xl transition-all"
                                     title="Edit"
                                   >
                                     <Edit3 size={18} />
                                   </button>
                                 </>
                               ) : (
                                 <>
                                   <button 
                                     onClick={() => handleRestoreItem(item)}
                                     className="p-2 md:p-3 text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-500 hover:text-white rounded-xl transition-all"
                                     title="Restore"
                                   >
                                     <RotateCcw size={18} />
                                   </button>
                                   <button 
                                     onClick={() => handlePermanentDelete(item.id)}
                                     className="p-2 md:p-3 text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                     title="Delete"
                                   >
                                     <Trash2 size={18} />
                                   </button>
                                 </>
                               )}
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === 'REPORTS' && (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-black mb-8 dark:text-white">Performance Insights</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-400 dark:text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Today's Revenue</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">$1,248.50</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Unified Add/Edit Item Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsFormModalOpen(false)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black mb-1 dark:text-white">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              {editingItem ? `Currently editing all information for "${editingItem.name}"` : 'Create a new dish or drink for your customers.'}
            </p>

            <form onSubmit={handleSaveItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600">
                    {formItem.image ? (
                      <img src={formItem.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400">Preview Image</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Image URL</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm outline-none"
                      value={formItem.image}
                      onChange={(e) => setFormItem({...formItem, image: e.target.value})}
                    />
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Item Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Classic Latte"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none"
                      value={formItem.name}
                      onChange={(e) => setFormItem({...formItem, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Classification</label>
                      <select 
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none text-sm cursor-pointer"
                        value={formItem.category}
                        onChange={(e) => setFormItem({...formItem, category: e.target.value})}
                      >
                        <option value="Main">Main Dish</option>
                        <option value="Sides">Sides</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Pizza">Pizza</option>
                        <option value="Sushi">Sushi</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Appetizer">Appetizer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Base Price ($)</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none"
                        value={formItem.price || ''}
                        onChange={(e) => setFormItem({...formItem, price: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                    <textarea 
                      rows={2}
                      placeholder="Brief description of the item..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm outline-none resize-none"
                      value={formItem.description}
                      onChange={(e) => setFormItem({...formItem, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Sizes Section */}
              <div className="pt-4 border-t dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Available Sizes (+ Price)</h3>
                  <button 
                    type="button"
                    onClick={handleAddSize}
                    className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg hover:bg-orange-500 hover:text-white transition-all"
                  >
                    <Plus size={14} /> Add Size
                  </button>
                </div>
                <div className="space-y-3">
                  {formItem.sizes?.map((size, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl animate-in slide-in-from-left duration-200">
                      <input 
                        type="text" 
                        placeholder="e.g. Large"
                        className="flex-1 bg-white dark:bg-gray-800 border-none rounded-xl px-3 py-2 text-sm outline-none dark:text-white"
                        value={size.name}
                        onChange={(e) => handleSizeChange(idx, 'name', e.target.value)}
                      />
                      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2">
                        <span className="text-gray-400 text-xs">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Price"
                          className="w-20 bg-transparent border-none text-sm outline-none dark:text-white"
                          value={size.price || ''}
                          onChange={(e) => handleSizeChange(idx, 'price', Number(e.target.value))}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveSize(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(!formItem.sizes || formItem.sizes.length === 0) && (
                    <p className="text-xs text-gray-400 italic text-center py-2">No custom sizes added.</p>
                  )}
                </div>
              </div>

              {/* Temperature Options Section */}
              <div className="pt-4 border-t dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Thermometer size={18} className="text-blue-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Hot / Cold (+ Price)</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formItem.tempOptions?.enabled}
                      onChange={(e) => setFormItem({...formItem, tempOptions: {...formItem.tempOptions!, enabled: e.target.checked}})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>

                {formItem.tempOptions?.enabled && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top duration-300">
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/20">
                      <p className="text-xs font-black text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-widest">Hot (+ $)</p>
                      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border dark:border-gray-700">
                        <span className="text-gray-400 text-xs">+$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          className="w-full bg-transparent text-sm outline-none dark:text-white"
                          value={formItem.tempOptions?.hot || ''}
                          onChange={(e) => setFormItem({...formItem, tempOptions: {...formItem.tempOptions!, hot: Number(e.target.value)}})}
                        />
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                      <p className="text-xs font-black text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-widest">Cold (+ $)</p>
                      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border dark:border-gray-700">
                        <span className="text-gray-400 text-xs">+$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          className="w-full bg-transparent text-sm outline-none dark:text-white"
                          value={formItem.tempOptions?.cold || ''}
                          onChange={(e) => setFormItem({...formItem, tempOptions: {...formItem.tempOptions!, cold: Number(e.target.value)}})}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsFormModalOpen(false)} 
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 dark:shadow-none hover:bg-orange-600 transition-all"
                >
                  {editingItem ? 'Save All Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorView;
