
import React, { useState } from 'react';
import { User, Restaurant, Order } from '../types';
import { Users, Store, TrendingUp, Settings, MoreHorizontal, ShieldCheck, Mail, Key } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  vendors: User[];
  restaurants: Restaurant[];
  orders: Order[];
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const AdminView: React.FC<Props> = ({ vendors, restaurants, orders }) => {
  const [activeTab, setActiveTab] = useState<'VENDORS' | 'REPORTS'>('VENDORS');

  const restaurantSales = restaurants.map(res => ({
    name: res.name,
    total: orders.filter(o => o.restaurantId === res.id).reduce((acc, curr) => acc + curr.total, 0)
  }));

  const systemStats = [
    { label: 'Total Vendors', value: vendors.length, icon: Store, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Total Revenue', value: `$${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Platform Users', value: '1,204', icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Admin</h1>
          <p className="text-gray-500 font-medium">Platform overview and vendor management</p>
        </div>
        <div className="flex bg-white rounded-2xl p-1.5 border shadow-sm">
          <button 
            onClick={() => setActiveTab('VENDORS')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'VENDORS' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Store size={18} />
            Vendors
          </button>
          <button 
            onClick={() => setActiveTab('REPORTS')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'REPORTS' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <TrendingUp size={18} />
            Global Stats
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {systemStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'VENDORS' ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-lg">Active Vendors</h3>
            <button className="text-sm font-bold text-orange-500 hover:text-orange-600">+ Register Vendor</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Store / Vendor</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Username</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Password (Encrypted)</th>
                  <th className="px-8 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {vendors.map(vendor => {
                  const res = restaurants.find(r => r.id === vendor.restaurantId);
                  return (
                    <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <img src={res?.logo} className="w-10 h-10 rounded-lg" />
                          <span className="font-bold text-gray-800">{res?.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                          <Mail size={14} />
                          {vendor.username}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                          <Key size={14} />
                          ********
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-tighter">Active</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><MoreHorizontal size={18} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-black text-lg mb-8">Revenue Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={restaurantSales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
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
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-black text-lg mb-8">Platform Health</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><ShieldCheck size={20} /></div>
                  <div>
                    <p className="font-bold text-sm">Server Status</p>
                    <p className="text-xs text-gray-500">Operational • 99.9% Uptime</p>
                  </div>
                </div>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Users size={20} /></div>
                  <div>
                    <p className="font-bold text-sm">Concurrent Users</p>
                    <p className="text-xs text-gray-500">Currently active on platform</p>
                  </div>
                </div>
                <span className="font-black text-lg">148</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Store size={20} /></div>
                  <div>
                    <p className="font-bold text-sm">New Sign-ups</p>
                    <p className="text-xs text-gray-500">Pending verification</p>
                  </div>
                </div>
                <span className="font-black text-lg">3</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
