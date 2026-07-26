import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Shield, Key } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white break-words">Account Settings & Security</h1>
        <p className="text-xs text-[#AEB4BC]">Manage profile credentials and security settings</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
        <h3 className="text-sm font-bold text-white border-b border-[rgba(212,175,106,0.15)] pb-3">User Profile Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="min-w-0">
            <span className="text-[#AEB4BC] block text-[11px]">Full Name</span>
            <span className="text-white font-semibold text-xs sm:text-sm block truncate">{user?.name}</span>
          </div>
          <div className="min-w-0">
            <span className="text-[#AEB4BC] block text-[11px]">Email Address</span>
            <span className="text-white font-semibold text-xs sm:text-sm block break-all">{user?.email}</span>
          </div>
          <div className="min-w-0">
            <span className="text-[#AEB4BC] block text-[11px]">Phone Number</span>
            <span className="text-white font-semibold text-xs sm:text-sm block truncate">{user?.phone || '—'}</span>
          </div>
          <div className="min-w-0">
            <span className="text-[#AEB4BC] block text-[11px]">Role Permission</span>
            <span className="text-[#D4AF6A] font-semibold block">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
