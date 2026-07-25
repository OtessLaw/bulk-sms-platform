import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Wallet as WalletIcon, CreditCard, Plus, CheckCircle2 } from 'lucide-react';

export default function WalletPage() {
  const { wallet, refreshWallet } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await API.get('/wallet');
      if (res.data.success) {
        setTransactions(res.data.data.transactions);
      }
    } catch (err) {
      console.error('Failed to load wallet data', err);
    }
  };

  const handleFund = async (e) => {
    e.preventDefault();
    if (amount < 20) {
      toast.error('Minimum deposit amount is 20 GHS');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/wallet/fund', {
        amount,
        redirectUrl: `${window.location.origin}/wallet?funding=success`,
      });

      if (res.data.success && res.data.data.authorization_url) {
        window.location.href = res.data.data.authorization_url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Funding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet & Top Up</h1>
        <p className="text-xs text-[#AEB4BC]">Fund your wallet instantly using Paystack Mobile Money & Bank Cards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block">Wallet Balance</span>
          <div className="text-3xl font-extrabold text-white">GHS {wallet?.balance?.toFixed(2) || '0.00'}</div>
          <div className="text-sm font-semibold text-[#E7D3A4]">{wallet?.smsCredit?.toLocaleString() || '0'} SMS Credits</div>
        </div>

        <div className="md:col-span-2 bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#D4AF6A]" /> Instant Paystack Top Up
          </h3>

          <form onSubmit={handleFund} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="number"
              min="20"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Amount in GHS"
              className="w-full sm:w-48 bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-4 py-2.5 text-sm text-white font-bold"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-6 py-3 rounded-xl flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Connecting Paystack...' : 'Pay via Paystack'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
