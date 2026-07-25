import React, { useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Sliders, ShieldAlert, Power } from 'lucide-react';

export default function AdminSystemSettings() {
  const [maintenance, setMaintenance] = useState(false);

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

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-[#D4AF6A]" /> System Maintenance & Security Settings
        </h1>
        <p className="text-xs text-[#AEB4BC]">Manage maintenance mode, gateway configurations, and global security</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Power className="w-4 h-4 text-[#D4AF6A]" /> System Maintenance Mode
            </h3>
            <p className="text-xs text-[#AEB4BC] mt-1">When enabled, only Super Admin accounts can access the platform (Returns 503 Maintenance for users).</p>
          </div>

          <button
            onClick={handleToggleMaintenance}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              maintenance
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {maintenance ? 'Maintenance ENABLED' : 'Maintenance DISABLED'}
          </button>
        </div>
      </div>
    </div>
  );
}
