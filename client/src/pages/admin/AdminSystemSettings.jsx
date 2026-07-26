import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Sliders, Power, Ticket, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminSystemSettings() {
  const [maintenance, setMaintenance] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', bonusUnits: 100, maxUses: 50 });
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await API.get('/admin/coupons');
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch coupons', err);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const res = await API.post('/admin/maintenance');
      if (res.data.success) {
        setMaintenance(res.data.data.value);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to toggle maintenance mode');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.bonusUnits) {
      toast.error('Code and bonus units are required');
      return;
    }

    setLoadingCoupon(true);
    try {
      const res = await API.post('/admin/coupons', newCoupon);
      if (res.data.success) {
        toast.success(res.data.message);
        setNewCoupon({ code: '', bonusUnits: 100, maxUses: 50 });
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Delete promo coupon '${code}'?`)) return;
    try {
      const res = await API.delete(`/admin/coupons/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCoupons();
      }
    } catch (err) {
      toast.error('Delete coupon failed');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-[#D4AF6A] shrink-0" /> System Settings & Promo Coupons
        </h1>
        <p className="text-xs text-[#AEB4BC]">Manage maintenance mode and generate promotional SMS coupon codes</p>
      </div>

      {/* 1. Maintenance Mode Setting */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Power className="w-4 h-4 text-[#D4AF6A]" /> System Maintenance Mode
            </h3>
            <p className="text-xs text-[#AEB4BC] mt-1">When enabled, only Super Admin accounts can access the platform (Returns 503 Maintenance for users).</p>
          </div>

          <button
            onClick={handleToggleMaintenance}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              maintenance
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {maintenance ? 'Maintenance ENABLED' : 'Maintenance DISABLED'}
          </button>
        </div>
      </div>

      {/* 2. Promo Coupon Generator & Management */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[rgba(212,175,106,0.15)] pb-3">
          <Ticket className="w-4 h-4 text-[#D4AF6A]" /> Generate New Promo Coupon Code
        </h3>

        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#AEB4BC] mb-1">Coupon Code</label>
            <input
              type="text"
              required
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              placeholder="e.g. WELCOME100"
              className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#AEB4BC] mb-1">Bonus SMS Units</label>
            <input
              type="number"
              min="1"
              required
              value={newCoupon.bonusUnits}
              onChange={(e) => setNewCoupon({ ...newCoupon, bonusUnits: Number(e.target.value) })}
              placeholder="100"
              className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#AEB4BC] mb-1">Max Redemptions</label>
            <input
              type="number"
              min="1"
              required
              value={newCoupon.maxUses}
              onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })}
              placeholder="50"
              className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white font-bold"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loadingCoupon}
              className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1 shadow-md disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loadingCoupon ? 'Creating...' : 'Create Coupon'}</span>
            </button>
          </div>
        </form>

        {/* Existing Promo Coupons Directory */}
        <div className="pt-3">
          <h4 className="text-xs font-bold text-white mb-2">Active & Created Promo Coupons</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                  <th className="pb-2 px-2">Code</th>
                  <th className="pb-2 px-2">Bonus Units</th>
                  <th className="pb-2 px-2">Used / Max</th>
                  <th className="pb-2 px-2">Status</th>
                  <th className="pb-2 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
                {coupons.length > 0 ? (
                  coupons.map((c) => (
                    <tr key={c._id} className="hover:bg-[#1E232B]/40">
                      <td className="py-2.5 px-2 font-mono font-bold text-[#D4AF6A]">{c.code}</td>
                      <td className="py-2.5 px-2 text-emerald-400 font-bold">+{c.bonusUnits} Units</td>
                      <td className="py-2.5 px-2 text-[#AEB4BC]">{c.usedCount} / {c.maxUses}</td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={() => handleDeleteCoupon(c._id, c.code)}
                          className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-[#AEB4BC]">
                      No promo coupons created yet. Use the form above to generate one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
