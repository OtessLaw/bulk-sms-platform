import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Wallet as WalletIcon, CreditCard, Plus, CheckCircle2, History, ArrowRightLeft } from 'lucide-react';

export default function WalletPage() {
  const { wallet, refreshWallet } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState(10);
  const [convertAmount, setConvertAmount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
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
      toast.loading('Verifying Paystack Payment...', { id: 'verify-toast' });
      try {
        const res = await API.post('/wallet/verify', { reference });
        if (res.data.success) {
          toast.success(res.data.message || 'Payment verified! Cash balance updated.', { id: 'verify-toast' });
          await refreshWallet();
          await fetchWalletData();
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Payment verification failed', { id: 'verify-toast' });
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (depositAmount < 1) {
      toast.error('Minimum deposit amount is 1 GHS');
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/wallet`;
      const res = await API.post('/wallet/fund', {
        amount: depositAmount,
        redirectUrl,
      });

      if (res.data.success && res.data.data?.authorization_url) {
        toast.success('Redirecting to Paystack Gateway...');
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

  const handleBuyCredits = async (e) => {
    e.preventDefault();
    if (convertAmount < 1) {
      toast.error('Minimum purchase is 1 GHS');
      return;
    }

    if ((wallet?.balance || 0) < convertAmount) {
      toast.error(`Insufficient cash balance. Available: GHS ${wallet?.balance?.toFixed(2) || '0.00'}`);
      return;
    }

    setConverting(true);
    try {
      const res = await API.post('/wallet/buy-credits', { amount: convertAmount });
      if (res.data.success) {
        toast.success(res.data.message);
        await refreshWallet();
        await fetchWalletData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    } finally {
      setConverting(false);
    }
  };

  const estimatedUnits = Math.floor(convertAmount / 0.04);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet & Payment Gateway</h1>
        <p className="text-xs text-[#AEB4BC]">Deposit cash to your wallet balance or purchase SMS units directly</p>
      </div>

      {/* Balances Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-2">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block">Available Cash Balance</span>
          <div className="text-3xl font-extrabold text-white">GHS {wallet?.balance?.toFixed(2) || '0.00'}</div>
          <p className="text-[11px] text-emerald-400 font-semibold">Pay-As-You-Go Enabled (0.04 GHS / SMS)</p>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-2">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block">Active SMS Credit Units</span>
          <div className="text-3xl font-extrabold text-[#E7D3A4]">{wallet?.smsCredit?.toLocaleString() || '0'} Units</div>
          <p className="text-[11px] text-[#AEB4BC]">Deducted first before Cash Balance</p>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-2">
          <span className="text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider block">SMS Unit Rate</span>
          <div className="text-3xl font-extrabold text-white">0.04 GHS</div>
          <p className="text-[11px] text-[#D4AF6A] font-semibold">1 GHS = 25 SMS Units</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Deposit Cash to Balance via Paystack */}
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D4AF6A]" /> 1. Deposit Cash to Wallet Balance
            </h3>
            <p className="text-xs text-[#AEB4BC]">
              Deposit funds directly to your cash balance via Paystack (Mobile Money & Cards). Your money stays in your wallet as cash!
            </p>
          </div>

          <form onSubmit={handleDeposit} className="space-y-3">
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-[#D4AF6A] font-bold">GHS</span>
              <input
                type="number"
                min="1"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                placeholder="10"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-12 pr-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || verifying}
              className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Connecting Paystack...' : 'Deposit Cash via Paystack'}</span>
            </button>
          </form>
        </div>

        {/* Option 2: Buy SMS Credits from Cash Balance */}
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-[#D4AF6A]" /> 2. Buy SMS Credits from Cash Balance
            </h3>
            <p className="text-xs text-[#AEB4BC]">
              Convert cash from your available wallet balance into active SMS credit units anytime.
            </p>
          </div>

          <form onSubmit={handleBuyCredits} className="space-y-3">
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-[#D4AF6A] font-bold">GHS</span>
              <input
                type="number"
                min="1"
                required
                value={convertAmount}
                onChange={(e) => setConvertAmount(Number(e.target.value))}
                placeholder="5"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-12 pr-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>

            <div className="text-[11px] text-[#AEB4BC] flex justify-between px-1">
              <span>Cost: <strong className="text-white">GHS {convertAmount.toFixed(2)}</strong></span>
              <span>Yields: <strong className="text-[#D4AF6A]">{estimatedUnits} SMS Units</strong></span>
            </div>

            <button
              type="submit"
              disabled={converting}
              className="w-full bg-[#1E232B] hover:bg-[#D4AF6A]/20 border border-[rgba(212,175,106,0.3)] text-[#D4AF6A] font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{converting ? 'Purchasing SMS Units...' : 'Buy SMS Units Now'}</span>
            </button>
          </form>
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
                <th className="pb-3 px-3">Description</th>
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
                    <td className="py-3 px-3 text-[#AEB4BC] max-w-xs truncate">{t.description || '—'}</td>
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
