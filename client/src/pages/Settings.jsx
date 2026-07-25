import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Shield, Key } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Settings & Security</h1>
        <p className="text-xs text-[#AEB4BC]">Manage profile credentials and security settings</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-[rgba(212,175,106,0.15)] pb-3">User Profile Information</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#AEB4BC] block">Full Name</span>
            <span className="text-white font-semibold text-sm">{user?.name}</span>
          </div>
          <div>
            <span className="text-[#AEB4BC] block">Email Address</span>
            <span className="text-white font-semibold text-sm">{user?.email}</span>
          </div>
          <div>
            <span className="text-[#AEB4BC] block">Role Permission</span>
            <span className="text-[#D4AF6A] font-semibold">{user?.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
