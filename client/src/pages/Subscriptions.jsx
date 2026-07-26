import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Sparkles, CheckCircle2, Ticket } from 'lucide-react';

export default function Subscriptions() {
  const { wallet, refreshWallet } = useAuth();
  const [plans, setPlans] = useState([]);
  const [activeSub, setActiveSub] = useState(null);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await API.get('/subscriptions');
      if (res.data.success) {
        // Exclude free plan completely
        setPlans(res.data.data.plans.filter((p) => p.priceMonthly > 0));
        setActiveSub(res.data.data.activeSubscription);
      }
    } catch (err) {
      console.error('Failed to load plans', err);
    }
  };

  const handleSubscribe = async (planId, planName) => {
    try {
      const res = await API.post('/subscriptions/subscribe', { planId, billingCycle: 'monthly' });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchSubscriptions();
        refreshWallet();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/subscriptions/redeem-coupon', { code: couponCode });
      if (res.data.success) {
        toast.success(res.data.message);
        setCouponCode('');
        refreshWallet();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Redemption failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscription Tier Plans</h1>
        <p className="text-xs text-[#AEB4BC]">Upgrade your account tier for discounted SMS rates and bulk credit packages</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Ticket className="w-4 h-4 text-[#D4AF6A]" /> Redeem Promo Coupon Code
        </h3>
        <form onSubmit={handleRedeem} className="flex gap-3">
          <input
            type="text"
            required
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="PROMO2026"
            className="bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-4 py-2 text-xs text-white uppercase font-mono"
          />
          <button type="submit" className="bg-[#D4AF6A] text-black font-bold text-xs px-4 py-2 rounded-xl">
            Redeem Coupon
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((p) => (
          <div
            key={p._id}
            className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <div className="text-2xl font-extrabold text-[#D4AF6A] mt-2">
                GHS {p.priceMonthly} <span className="text-xs font-normal text-[#AEB4BC]">/ mo</span>
              </div>
              <p className="text-xs text-[#E7D3A4] mt-1 font-semibold">{p.smsCreditsIncluded.toLocaleString()} SMS Units included</p>

              {p.features && p.features.length > 0 && (
                <ul className="mt-4 space-y-2 text-xs text-[#AEB4BC]">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={() => handleSubscribe(p._id, p.name)}
              className="w-full font-bold py-2.5 rounded-xl text-xs shadow-lg transition-all bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black hover:opacity-90"
            >
              Subscribe Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
