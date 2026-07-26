import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Wallet as WalletIcon, CreditCard, Plus, CheckCircle2, History } from 'lucide-react';

export default function WalletPage() {
  const { wallet, refreshWallet } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchWalletData();
    checkPaymentReturn();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await API.get('/wallet');
      if (res.data.success) {
        setTransactions(res.data.data.transactions || []);
      }
    } catch (err) {
      console.error('Failed to load wallet data', err);
    }
  };

  const checkPaymentReturn = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference') || urlParams.get('trxref');

    if (reference) {
      setVerifying(true);
      toast.loading('Verifying Paystack Payment & Crediting Wallet...', { id: 'verify-toast' });
      try {
        const res = await API.post('/wallet/verify', { reference });
        if (res.data.success) {
          toast.success(res.data.message || 'Payment verified! Wallet credited successfully.', { id: 'verify-toast' });
          await refreshWallet();
          await fetchWalletData();
          // Clean URL parameter without reload
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Payment verification failed', { id: 'verify-toast' });
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleFund = async (e) => {
    e.preventDefault();
    if (amount < 1) {
      toast.error('Minimum deposit amount is 1 GHS');
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/wallet`;
      const res = await API.post('/wallet/fund', {
        amount,
        redirectUrl,
      });

      if (res.data.success && res.data.data?.authorization_url) {
        toast.success('Redirecting to Paystack Secure Payment Gateway...');
        window.location.href = res.data.data.authorization_url;
      } else {
        toast.error('Failed to initialize Paystack payment');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Paystack initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet & Payment Gateway</h1>
        <p className="text-xs text-[#AEB4BC]">Instant automatic wallet top-up via Paystack Mobile Money & Bank Cards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-4">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block">Available Cash Balance</span>
          <div className="text-3xl font-extrabold text-white">GHS {wallet?.balance?.toFixed(2) || '0.00'}</div>
          <div className="text-sm font-semibold text-[#E7D3A4]">{wallet?.smsCredit?.toLocaleString() || '0'} Active SMS Credits</div>
        </div>

        {/* Top Up Form Card */}
        <div className="md:col-span-2 bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#D4AF6A]" /> Paystack Automatic Mobile Money & Card Top-Up
          </h3>

          <form onSubmit={handleFund} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-56">
              <span className="absolute left-3.5 top-2.5 text-xs text-[#D4AF6A] font-bold">GHS</span>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="100"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-12 pr-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || verifying}
              className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-6 py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Initializing Paystack...' : 'Pay with Paystack'}</span>
            </button>
          </form>
          <p className="text-[11px] text-[#AEB4BC]">Supports MTN Mobile Money, Vodafone Cash, AirtelTigo Money & Visa/Mastercard.</p>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-[#D4AF6A]" /> Recent Wallet Transactions & Payment Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Reference</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Amount (GHS)</th>
                <th className="pb-3 px-3">Units Credited</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-[#1E232B]/40">
                    <td className="py-3 px-3 font-mono text-[#D4AF6A]">{t.reference}</td>
                    <td className="py-3 px-3 font-semibold">{t.type}</td>
                    <td className="py-3 px-3 font-bold">GHS {t.amount?.toFixed(2)}</td>
                    <td className="py-3 px-3 text-[#E7D3A4] font-mono">+{t.unitsAdded || 0} Units</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.status === 'Successful'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : t.status === 'Pending'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-[#AEB4BC]">{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-[#AEB4BC]">
                    No wallet transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
