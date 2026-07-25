import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Users, Wallet, Send, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#D4AF6A]" /> Super Admin Control Portal
          </h1>
          <p className="text-xs text-[#AEB4BC]">Platform-wide stats, revenue, user management, and gateway monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[#D4AF6A]/30 rounded-3xl p-6 shadow-2xl">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block mb-2">Total Users</span>
          <div className="text-3xl font-extrabold text-white">{stats?.totalUsers || 0}</div>
          <span className="text-xs text-emerald-400 mt-2 block">{stats?.activeUsers || 0} Active Accounts</span>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[#D4AF6A]/30 rounded-3xl p-6 shadow-2xl">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block mb-2">Total Revenue</span>
          <div className="text-3xl font-extrabold text-[#D4AF6A]">GHS {stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
          <span className="text-xs text-[#AEB4BC] mt-2 block">Paystack Verified</span>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[#D4AF6A]/30 rounded-3xl p-6 shadow-2xl">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block mb-2">Platform Wallet Funds</span>
          <div className="text-3xl font-extrabold text-[#E7D3A4]">GHS {stats?.totalWalletBalance?.toFixed(2) || '0.00'}</div>
          <span className="text-xs text-[#AEB4BC] mt-2 block">User Balances Combined</span>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[#D4AF6A]/30 rounded-3xl p-6 shadow-2xl">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block mb-2">Total SMS Dispatched</span>
          <div className="text-3xl font-extrabold text-white">{stats?.totalSMS || 0}</div>
          <span className="text-xs text-emerald-400 mt-2 block">Multi-Gateway Failover</span>
        </div>
      </div>
    </div>
  );
}
