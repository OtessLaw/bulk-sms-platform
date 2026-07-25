import React from 'react';
import { UserPlus, Shield } from 'lucide-react';

export default function Team() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <p className="text-xs text-[#AEB4BC]">Invite sub-account operators and assign granular roles</p>
        </div>

        <button className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-8 text-center text-xs text-[#AEB4BC] shadow-2xl">
        <Shield className="w-10 h-10 text-[#D4AF6A] mx-auto mb-3 opacity-60" />
        <p className="font-semibold text-white">Sub-Account Team Access Available on Starter & Enterprise Plans</p>
        <p className="mt-1">Invite staff members to manage contact directories and send broadcasts under your organization balance.</p>
      </div>
    </div>
  );
}
