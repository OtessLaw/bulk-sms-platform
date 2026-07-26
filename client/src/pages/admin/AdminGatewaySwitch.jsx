import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Cpu, Key, CreditCard, ShieldCheck, Save, Eye, EyeOff } from 'lucide-react';

export default function AdminGatewaySwitch() {
  const [keys, setKeys] = useState({
    ARKESEL_API_KEY: '',
    PAYSTACK_SECRET_KEY: '',
    PAYSTACK_PUBLIC_KEY: '',
    HUBTEL_CLIENT_ID: '',
    HUBTEL_CLIENT_SECRET: '',
  });

  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await API.get('/admin/gateway-keys');
      if (res.data.success) {
        setKeys(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load gateway API keys', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/admin/gateway-keys', keys);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchKeys();
      }
    } catch (err) {
      toast.error('Failed to save API credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 break-words">
          <Cpu className="w-6 h-6 text-[#D4AF6A] shrink-0" /> Gateway & Payment API Credentials
        </h1>
        <p className="text-xs text-[#AEB4BC]">Connect your live Arkesel, Paystack, and Hubtel API keys directly to FasReach</p>
      </div>

      {/* Gateway API Credentials Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Arkesel SMS Gateway Settings */}
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.25)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[rgba(212,175,106,0.15)] pb-3 gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF6A] shrink-0" /> 1. Arkesel SMS Gateway API
            </h3>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase self-start sm:self-auto">
              Primary SMS Gateway
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-1">
              Arkesel API Key
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={keys.ARKESEL_API_KEY}
                onChange={(e) => setKeys({ ...keys, ARKESEL_API_KEY: e.target.value })}
                placeholder="Paste your Arkesel API key here..."
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-4 pr-10 py-2.5 text-xs text-white font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-2.5 text-[#AEB4BC]"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#AEB4BC] mt-1">Get this key from your Arkesel account dashboard under API Settings.</p>
          </div>
        </div>

        {/* 2. Paystack Payment Gateway Settings */}
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.25)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[rgba(212,175,106,0.15)] pb-3 gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D4AF6A] shrink-0" /> 2. Paystack Payment Gateway API
            </h3>
            <span className="bg-[#D4AF6A]/10 text-[#D4AF6A] border border-[#D4AF6A]/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase self-start sm:self-auto">
              Mobile Money & Card Top-Ups
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-1">
                Paystack Secret Key (sk_live_...)
              </label>
              <input
                type={showSecret ? 'text' : 'password'}
                value={keys.PAYSTACK_SECRET_KEY}
                onChange={(e) => setKeys({ ...keys, PAYSTACK_SECRET_KEY: e.target.value })}
                placeholder="sk_live_..."
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-1">
                Paystack Public Key (pk_live_...)
              </label>
              <input
                type="text"
                value={keys.PAYSTACK_PUBLIC_KEY}
                onChange={(e) => setKeys({ ...keys, PAYSTACK_PUBLIC_KEY: e.target.value })}
                placeholder="pk_live_..."
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Hubtel Failover Gateway */}
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.25)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[rgba(212,175,106,0.15)] pb-3 gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-[#D4AF6A] shrink-0" /> 3. Hubtel Gateway API (Optional Failover)
            </h3>
            <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase self-start sm:self-auto">
              Backup Failover Gateway
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-1">
                Hubtel Client ID
              </label>
              <input
                type="text"
                value={keys.HUBTEL_CLIENT_ID}
                onChange={(e) => setKeys({ ...keys, HUBTEL_CLIENT_ID: e.target.value })}
                placeholder="Hubtel Client ID"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-1">
                Hubtel Client Secret
              </label>
              <input
                type={showSecret ? 'text' : 'password'}
                value={keys.HUBTEL_CLIENT_SECRET}
                onChange={(e) => setKeys({ ...keys, HUBTEL_CLIENT_SECRET: e.target.value })}
                placeholder="Hubtel Client Secret"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving API Credentials...' : 'Save API Gateway Credentials'}</span>
        </button>
      </form>
    </div>
  );
}
