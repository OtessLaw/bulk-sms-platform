import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldAlert, Sparkles, Menu } from 'lucide-react';

export default function Navbar({ onToggleMobileMenu }) {
  const { user, wallet, isImpersonating, stopImpersonating, logout } = useAuth();

  return (
    <header className="h-16 bg-[#2A3038]/80 backdrop-blur-md border-b border-[rgba(212,175,106,0.15)] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-[#D4AF6A] hover:bg-[#1E232B] rounded-xl border border-[rgba(212,175,106,0.3)] focus:outline-none"
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4AF6A] to-[#B88E3E] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="font-extrabold text-base md:text-lg text-white tracking-wider">FasReach</span>
        </div>
      </div>

      {/* Impersonation Warning Banner */}
      {isImpersonating && (
        <div className="hidden sm:flex bg-[#D4AF6A] text-black text-xs font-bold px-3 py-1 rounded-xl items-center space-x-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Impersonating ({user?.email})</span>
          <button onClick={stopImpersonating} className="bg-black text-white px-2 py-0.5 rounded text-[10px]">
            Return to Admin
          </button>
        </div>
      )}

      {/* Right User Bar */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="bg-[#1E232B] border border-[rgba(212,175,106,0.3)] px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-xs flex items-center space-x-1.5">
          <span className="text-[#AEB4BC] hidden xs:inline">Credits:</span>
          <span className="text-[#D4AF6A] font-bold font-mono text-xs">{wallet?.smsCredit?.toLocaleString() || '0'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
            <p className="text-[10px] text-[#AEB4BC] mt-0.5">{user?.role}</p>
          </div>
          <button onClick={logout} className="p-2 text-[#AEB4BC] hover:text-white rounded-xl hover:bg-[#1E232B]" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
