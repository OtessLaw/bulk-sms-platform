import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Send, Wallet, Users, CheckCircle, TrendingUp, Sparkles, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, wallet } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalSent: 0, delivered: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/reports');
      if (res.data.success) {
        setStats(res.data.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#2A3038] via-[#1E232B] to-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs text-[#D4AF6A] font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#D4AF6A]" /> Welcome Back, {user?.name}
          </span>
          <h1 className="text-2xl font-extrabold text-white">FasReach Overview</h1>
        </div>

        <button
          onClick={() => navigate('/send-sms')}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-2 shadow-[0_0_20px_rgba(212,175,106,0.3)] shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Dispatch New SMS</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block mb-2">Available Balance</span>
          <div className="text-2xl font-extrabold text-white">GHS {wallet?.balance?.toFixed(2) || '0.00'}</div>
          <button onClick={() => navigate('/wallet')} className="text-xs text-[#D4AF6A] font-semibold mt-3 hover:underline">
            + Fund Wallet via Paystack
          </button>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block mb-2">Active SMS Credits</span>
          <div className="text-2xl font-extrabold text-[#E7D3A4]">{wallet?.smsCredit?.toLocaleString() || '0'} Units</div>
          <button onClick={() => navigate('/subscriptions')} className="text-xs text-[#D4AF6A] font-semibold mt-3 hover:underline">
            View Subscription Plans →
          </button>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block mb-2">Total Messages Sent</span>
          <div className="text-2xl font-extrabold text-white">{stats.totalSent || 0}</div>
          <span className="text-xs text-emerald-400 mt-3 block">High Delivery Rate</span>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block mb-2">Delivery Rate</span>
          <div className="text-2xl font-extrabold text-emerald-400">{stats.deliveryRate || '100'}%</div>
          <span className="text-xs text-[#AEB4BC] mt-3 block">Multi-Gateway Active</span>
        </div>
      </div>
    </div>
  );
}
