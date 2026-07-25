import React from 'react';
import { UserCheck, Shield } from 'lucide-react';

export default function AdminStaff() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Staff Permission Roles (RBAC)</h1>
        <p className="text-xs text-[#AEB4BC]">Manage admin team permissions, support agents, and finance managers</p>
      </div>

      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <p className="text-xs text-[#AEB4BC]">Configured RBAC Roles: Super Admin, Admin, Manager, Support Staff, Agent</p>
      </div>
    </div>
  );
}
