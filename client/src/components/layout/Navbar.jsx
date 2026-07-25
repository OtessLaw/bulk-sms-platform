import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldAlert, Sparkles, User, Bell } from 'lucide-react';

export default function Navbar() {
  const { user, wallet, isImpersonating, impersonatorAdmin, stopImpersonating, logout } = useAuth();

  return (
    <header className="h-16 bg-[#2A3038]/80 backdrop-blur-md border-b border-[rgba(212,175,106,0.15)] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Impersonation Warning Banner */}
      {isImpersonating && (
        <div className="bg-[#D4AF6A] text-black text-xs font-bold px-3 py-1 rounded-xl flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Impersonating User ({user?.email})</span>
          <button onClick={stopImpersonating} className="bg-black text-white px-2 py-0.5 rounded text-[10px]">
            Return to Admin
          </button>
        </div>
      )}

      {!isImpersonating && (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4AF6A] to-[#B88E3E] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="font-extrabold text-base text-white tracking-wider">FasReach</span>
        </div>
      )}

      {/* Right User Bar */}
      <div className="flex items-center space-x-4">
        <div className="bg-[#1E232B] border border-[rgba(212,175,106,0.3)] px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2">
          <span className="text-[#AEB4BC]">Credits:</span>
          <span className="text-[#D4AF6A] font-bold font-mono">{wallet?.smsCredit?.toLocaleString() || '0'} Units</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
            <p className="text-[10px] text-[#AEB4BC] mt-0.5">{user?.role}</p>
          </div>
          <button onClick={logout} className="p-2 text-[#AEB4BC] hover:text-white rounded-xl hover:bg-[#1E232B]">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
