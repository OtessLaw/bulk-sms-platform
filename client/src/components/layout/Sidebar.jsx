import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Send,
  Users,
  Megaphone,
  Wallet,
  CreditCard,
  Code2,
  ShieldCheck,
  FileBarChart2,
  UserCheck,
  Settings,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

export default function Sidebar() {
  const { isAdmin } = useAuth();

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Send SMS', path: '/send-sms', icon: Send },
    { name: 'Contacts Directory', path: '/contacts', icon: Users },
    { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
    { name: 'Wallet & Top Up', path: '/wallet', icon: Wallet },
    { name: 'Subscription Tier', path: '/subscriptions', icon: CreditCard },
    { name: 'Developer REST API', path: '/developer-api', icon: Code2 },
    { name: 'Custom Sender IDs', path: '/sender-ids', icon: ShieldCheck },
    { name: 'Delivery Reports', path: '/reports', icon: FileBarChart2 },
    { name: 'Team Members', path: '/team', icon: UserCheck },
    { name: 'Settings & Security', path: '/settings', icon: Settings },
    { name: 'Help & Support Desk', path: '/help', icon: HelpCircle },
  ];

  const adminLinks = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Sender ID Queue', path: '/admin/sender-ids', icon: ShieldCheck },
    { name: 'Gateway Failover', path: '/admin/gateway-switch', icon: Code2 },
    { name: 'Staff Roles (RBAC)', path: '/admin/staff', icon: UserCheck },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
    { name: 'Security Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-[#1E232B] border-r border-[rgba(212,175,106,0.15)] flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* User Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#AEB4BC] mb-2">Main Menu</p>
          {userLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black shadow-lg font-bold'
                      : 'text-[#AEB4BC] hover:bg-[#2A3038] hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Super Admin Navigation Section */}
        {isAdmin && (
          <div className="space-y-1 pt-4 border-t border-[rgba(212,175,106,0.15)]">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF6A] mb-2 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-[#D4AF6A]" /> Super Admin Control
            </p>
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#D4AF6A] text-black shadow-lg font-bold'
                        : 'text-[#AEB4BC] hover:bg-[#2A3038] hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
