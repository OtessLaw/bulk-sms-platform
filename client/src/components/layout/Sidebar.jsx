import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Send,
  PhoneCall,
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
  Bot,
  Sparkles,
  X,
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { isAdmin } = useAuth();

  // Lock body scroll on mobile when menu drawer is open to prevent background scrolling
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileOpen]);

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Send SMS', path: '/send-sms', icon: Send },
    { name: 'Voice SMS & Calls', path: '/voice-sms', icon: PhoneCall },
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
    { name: 'AI Support RAG Engine', path: '/admin/ai-management', icon: Bot },
    { name: 'Staff Roles (RBAC)', path: '/admin/staff', icon: UserCheck },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
    { name: 'Security Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay with touch lock */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          onTouchMove={(e) => e.preventDefault()}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        style={{ overscrollBehavior: 'contain' }}
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-[#1E232B] border-r border-[rgba(212,175,106,0.15)] flex flex-col justify-between shrink-0 h-full lg:min-h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto h-full max-h-screen lg:max-h-none touch-pan-y">
          {/* Mobile Header Close Button */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-[rgba(212,175,106,0.15)]">
            <div className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="FasReach" className="w-6 h-6 rounded-lg object-cover border border-[#D4AF6A]/40" />
              <span className="font-extrabold text-white text-xs">FasReach Menu</span>
            </div>
            <button onClick={onCloseMobile} className="p-1 text-[#AEB4BC] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Navigation Section */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#AEB4BC] mb-2">Main Menu</p>
            {userLinks.map((link) => {
              const Icon = link.icon;
              const hostname = window.location.hostname.toLowerCase();
              const token = localStorage.getItem('accessToken') || '';
              const ssoQuery = token ? `?sso_token=${encodeURIComponent(token)}` : '';

              if (hostname.includes('fasreach.com')) {
                let targetUrl = '';
                if (link.name.includes('Products Portal')) targetUrl = `https://app.fasreach.com${ssoQuery}`;
                if (link.name === 'Send SMS') targetUrl = `https://sms.fasreach.com${ssoQuery}`;
                if (link.name.includes('Voice SMS')) targetUrl = `https://voice.fasreach.com${ssoQuery}`;

                if (targetUrl) {
                  return (
                    <a
                      key={link.path}
                      href={targetUrl}
                      onClick={onCloseMobile}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#AEB4BC] hover:bg-[#2A3038] hover:text-white transition-all"
                    >
                      <Icon className="w-4 h-4 shrink-0 text-[#D4AF6A]" />
                      <span>{link.name}</span>
                    </a>
                  );
                }
              }

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onCloseMobile}
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
                    onClick={onCloseMobile}
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
    </>
  );
}
