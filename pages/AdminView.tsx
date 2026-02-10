
import React, { useState, useMemo } from 'react';
import { User, Restaurant, Order } from '../types';
import { Users, Store, TrendingUp, Settings, MoreHorizontal, ShieldCheck, Mail, Key, Search, Filter, X, Plus, MapPin, Power, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  vendors: User[];
  restaurants: Restaurant[];
  orders: Order[];
  onAddVendor: (user: User, restaurant: Restaurant) => void;
  onUpdateVendor: (user: User, restaurant: Restaurant) => void;
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const AdminView: React.FC<Props> = ({ vendors, restaurants, orders, onAddVendor, onUpdateVendor }) => {
  const [activeTab, setActiveTab] = useState<'VENDORS' | 'REPORTS'>('VENDORS');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Registration Form State
  const [newVendor, setNewVendor] = useState({
    username: '',
    password: '',
    restaurantName: '',
    location: '',
  });

  // Edit Form State
  const [editVendor, setEditVendor] = useState<{user: User, restaurant: Restaurant} | null>(null);

  const [newLocationInput, setNewLocationInput] = useState('');
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  // Derive unique locations from restaurants
  const locations = useMemo(() => {
    const locs = Array.from(new Set(restaurants.map(r => r.location)));
    return ['All Locations', ...locs];
  }, [restaurants]);

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const res = restaurants.find(r => r.id === vendor.restaurantId);
      const matchesSearch = 
        vendor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = 
        locationFilter === 'All Locations' || 
        res?.location === locationFilter;

      const matchesStatus = 
        statusFilter === 'All Status' ||
        (statusFilter === 'Active' && vendor.isActive) ||
        (statusFilter === 'Deactivated' && !vendor.isActive);
      
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [vendors, restaurants, searchQuery, locationFilter, statusFilter]);

  const restaurantSales = restaurants.map(res => ({
    name: res.name,
    total: orders.filter(o => o.restaurantId === res.id).reduce((acc, curr) => acc + curr.total, 0)
  }));

  const systemStats = [
    { label: 'Total Vendors', value: vendors.length, icon: Store, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Total Revenue', value: `$${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Platform Users', value: '1,204', icon: Users, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const vendorId = `vendor_${Date.now()}`;
    const restaurantId = `res_${Date.now()}`;
    
    const newUser: User = {
      id: vendorId,
      username: newVendor.username,
      password: newVendor.password,
      role: 'VENDOR',
      restaurantId: restaurantId,
      isActive: true
    };

    const newRestaurant: Restaurant = {
      id: restaurantId,
      name: newVendor.restaurantName,
      vendorId: vendorId,
      location: newVendor.location,
      logo: `https://picsum.photos/seed/${newVendor.restaurantName}/200/200`,
      menu: []
    };

    onAddVendor(newUser, newRestaurant);
    setIsModalOpen(false);
    setNewVendor({ username: '', password: '', restaurantName: '', location: '' });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editVendor) return;
    onUpdateVendor(editVendor.user, editVendor.restaurant);
    setIsEditModalOpen(false);
    setEditVendor(null);
  };

  const openEditModal = (vendor: User) => {
    const res = restaurants.find(r => r.id === vendor.restaurantId);
    if (res) {
      setEditVendor({ 
        user: { ...vendor }, 
        restaurant: { ...res } 
      });
      setIsEditModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-gray-900 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">System Admin</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Platform overview and vendor management</p>
        </div>
        <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1.5 border dark:border-gray-700 shadow-sm transition-colors">
          <button 
            onClick={() => setActiveTab('VENDORS')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'VENDORS' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <Store size={18} />
            Vendors
          </button>
          <button 
            onClick={() => setActiveTab('REPORTS')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'REPORTS' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <TrendingUp size={18} />
            Global Stats
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {systemStats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-6 transition-colors">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'VENDORS' ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
          <div className="px-8 py-6 border-b dark:border-gray-700 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gray-50/50 dark:bg-gray-700/50">
            <h3 className="font-black text-lg dark:text-white whitespace-nowrap">Vendor Directory</h3>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1 max-w-5xl">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search vendor or store..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Location Filter */}
              <div className="relative">
                <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select 
                  className="pl-11 pr-10 py-2.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none appearance-none font-medium dark:text-white min-w-[160px]"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select 
                  className="pl-11 pr-10 py-2.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none appearance-none font-medium dark:text-white min-w-[140px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-100 dark:shadow-none whitespace-nowrap"
              >
                + Register Vendor
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest">Store / Vendor</th>
                  <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest">Location</th>
                  <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest">Username</th>
                  <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-right text-xs font-black uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-gray-500 dark:text-gray-400 italic">
                      No vendors found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map(vendor => {
                    const res = restaurants.find(r => r.id === vendor.restaurantId);
                    return (
                      <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <img src={res?.logo} className="w-10 h-10 rounded-lg shadow-sm" />
                            <span className="font-bold text-gray-800 dark:text-gray-200">{res?.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <MapPin size={14} className="text-orange-500" />
                            <span className="text-sm font-medium">{res?.location || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium text-sm">
                            <Mail size={14} className="text-gray-400" />
                            {vendor.username}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          {vendor.isActive ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-black uppercase tracking-tighter">
                              <CheckCircle2 size={12} />
                              Active
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full text-xs font-black uppercase tracking-tighter">
                              <AlertCircle size={12} />
                              Deactivated
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => openEditModal(vendor)}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 rounded-lg transition-all"
                            title="Edit / Actions"
                          >
                            <Settings size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <h3 className="font-black text-lg mb-8 dark:text-white">Revenue Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={restaurantSales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc', opacity: 0.1}}
                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#fff' }} 
                  />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                    {restaurantSales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <h3 className="font-black text-lg mb-8 dark:text-white">Platform Health</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center"><ShieldCheck size={20} /></div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">Server Status</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Operational • 99.9% Uptime</p>
                  </div>
                </div>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black mb-2 dark:text-white">Register New Vendor</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Set up account and store details for a new platform vendor.</p>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Store Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Pasta Hub" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none"
                    value={newVendor.restaurantName}
                    onChange={(e) => setNewVendor({...newVendor, restaurantName: e.target.value})}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Location</label>
                  <div className="flex gap-2">
                    <select 
                      required 
                      className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none appearance-none cursor-pointer text-sm"
                      value={newVendor.location}
                      onChange={(e) => setNewVendor({...newVendor, location: e.target.value})}
                    >
                      <option value="">Select Location</option>
                      {locations.filter(l => l !== 'All Locations').map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Username</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. burger_king_admin" 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none"
                  value={newVendor.username}
                  onChange={(e) => setNewVendor({...newVendor, username: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Initial Password</label>
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none"
                  value={newVendor.password}
                  onChange={(e) => setNewVendor({...newVendor, password: e.target.value})}
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold text-gray-600 dark:text-gray-300">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Action Modal */}
      {isEditModalOpen && editVendor && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsEditModalOpen(false)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black mb-2 dark:text-white">Edit Vendor</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Modify store settings or deactivate access.</p>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Restaurant Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none"
                    value={editVendor.restaurant.name}
                    onChange={(e) => setEditVendor({...editVendor, restaurant: {...editVendor.restaurant, name: e.target.value}})}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Location</label>
                  <select 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none appearance-none cursor-pointer text-sm"
                    value={editVendor.restaurant.location}
                    onChange={(e) => setEditVendor({...editVendor, restaurant: {...editVendor.restaurant, location: e.target.value}})}
                  >
                    {locations.filter(l => l !== 'All Locations').map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                  <input 
                    type="text" 
                    placeholder="Reset password..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 dark:text-white font-medium outline-none text-sm"
                    value={editVendor.user.password || ''}
                    onChange={(e) => setEditVendor({...editVendor, user: {...editVendor.user, password: e.target.value}})}
                  />
                </div>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${editVendor.user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <Power size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm dark:text-white">Account Status</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Currently {editVendor.user.isActive ? 'Active' : 'Deactivated'}
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setEditVendor({...editVendor, user: {...editVendor.user, isActive: !editVendor.user.isActive}})}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${editVendor.user.isActive ? 'bg-red-500 text-white shadow-lg shadow-red-200 dark:shadow-none' : 'bg-green-500 text-white shadow-lg shadow-green-200 dark:shadow-none'}`}
                  >
                    {editVendor.user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 dark:shadow-none hover:bg-orange-600 transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
