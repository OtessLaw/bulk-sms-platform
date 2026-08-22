import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send,
  Radio,
  PhoneCall,
  ShieldCheck,
  Code2,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Wallet as WalletIcon,
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  Mic,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProductHub() {
  const { user, wallet, logout } = useAuth();
  const navigate = useNavigate();

  const handleBoxClick = (productKey, fallbackPath) => {
    if (!user) {
      navigate('/register');
      return;
    }

    const token = localStorage.getItem('accessToken') || '';
    const ssoQuery = token ? `?sso_token=${encodeURIComponent(token)}` : '';
    const hostname = window.location.hostname.toLowerCase();

    if (hostname.includes('fasreach.com')) {
      if (productKey === 'sms') {
        window.location.href = `https://sms.fasreach.com${ssoQuery}`;
        return;
      }
      if (productKey === 'voice') {
        window.location.href = `https://voice.fasreach.com${ssoQuery}`;
        return;
      }
    }

    navigate(fallbackPath);
  };

  return (
    <div className="min-h-screen bg-[#0E1117] text-white font-sans selection:bg-[#D4AF6A] selection:text-black relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-[#D4AF6A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-[#B88E3E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#161B22]/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="FasReach Logo" className="w-10 h-10 rounded-2xl object-cover border border-[#D4AF6A]/50 shadow-md" />
            <span className="text-xl font-black text-white tracking-wide">
              Fas<span className="text-[#D4AF6A]">Reach</span>
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Wallet Balance Badge */}
                <div className="hidden sm:flex items-center space-x-2 bg-[#0E1117] border border-[rgba(212,175,106,0.3)] px-3.5 py-1.5 rounded-xl text-xs">
                  <WalletIcon className="w-3.5 h-3.5 text-[#D4AF6A]" />
                  <span className="text-[#AEB4BC]">Wallet:</span>
                  <span className="font-bold text-white font-mono">GHS {wallet?.balance?.toFixed(2) || '0.00'}</span>
                  <span className="text-[#D4AF6A] font-bold font-mono">({wallet?.smsCredit || 0} Credits)</span>
                </div>

                <Link
                  to="/dashboard"
                  className="bg-[#1E232B] hover:bg-[#2A3038] text-white border border-white/10 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#D4AF6A]" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={logout}
                  className="text-xs font-semibold text-[#AEB4BC] hover:text-rose-400 p-2 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-xs font-semibold text-[#AEB4BC] hover:text-white px-3 py-1.5 transition-colors">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Product Selection Hub */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 relative z-10">
        {/* Banner Section asking what the user wants to do */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center space-x-2 bg-[#1E232B] border border-[rgba(212,175,106,0.3)] px-3.5 py-1 rounded-full text-xs font-bold text-[#D4AF6A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FasReach Service Portal</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            What would you like to <span className="text-[#D4AF6A]">do today?</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#AEB4BC] leading-relaxed">
            Tap on any service box below to go straight to your message workspace.
          </p>
        </div>

        {/* 2 Main Featured Products Grid (Bulk SMS Box & Voice Note Box Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BOX 1: BULK SMS PLATFORM */}
          <div
            onClick={() => handleBoxClick('sms', '/send-sms')}
            className="bg-[#161B22] border-2 border-[rgba(212,175,106,0.3)] hover:border-[#D4AF6A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition-all group flex flex-col justify-between relative overflow-hidden cursor-pointer hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                  <Send className="w-7 h-7" />
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full">
                  Sub-Second Delivery
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white group-hover:text-[#D4AF6A] transition-colors">
                  Bulk SMS Messaging
                </h2>
                <p className="text-xs text-[#AEB4BC] leading-relaxed">
                  Send single or bulk SMS broadcasts instantly to thousands of contacts across MTN Ghana, Telecel (Vodafone), and AT (AirtelTigo).
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-[#AEB4BC]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF6A] shrink-0" />
                  <span>Instant single & bulk Excel/CSV contact list dispatch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF6A] shrink-0" />
                  <span>Custom branded Sender IDs (e.g. YOURBRAND)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF6A] shrink-0" />
                  <span>Flat GHS 0.04 per SMS with zero expiration</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBoxClick('sms', '/send-sms');
              }}
              className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-extrabold text-xs py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Go to Bulk SMS →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* BOX 2: VOICE NOTE & VOICE SMS */}
          <div
            onClick={() => handleBoxClick('voice', '/voice-sms')}
            className="bg-[#161B22] border-2 border-emerald-500/30 hover:border-emerald-400 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition-all group flex flex-col justify-between relative overflow-hidden cursor-pointer hover:-translate-y-1"
          >
            {/* Featured Badge */}
            <div className="absolute -top-1 -right-1">
              <span className="bg-emerald-500 text-black text-[9px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider shadow-md">
                NEW FEATURE 🎙️
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Mic className="w-7 h-7 animate-pulse" />
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full">
                  Ghana Voice Engine
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  Voice Note & Voice SMS
                </h2>
                <p className="text-xs text-[#AEB4BC] leading-relaxed">
                  Deliver automated voice phone calls using live browser mic voice recordings, AI Text-to-Speech (Ghanaian English & Twi), or audio files.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-[#AEB4BC]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Live browser microphone voice recording & file upload</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Text-to-Speech (Ghanaian English, Twi & Standard)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time call answered & duration analytics</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBoxClick('voice', '/voice-sms');
              }}
              className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-emerald-400 text-black font-extrabold text-xs py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Go to Voice Note →</span>
              <PhoneCall className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div
            onClick={() => handleBoxClick('sender-ids', '/sender-ids')}
            className="bg-[#161B22] border border-white/10 hover:border-[rgba(212,175,106,0.3)] rounded-2xl p-6 flex items-center justify-between space-x-4 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E232B] border border-white/10 flex items-center justify-center text-[#D4AF6A] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Custom Branded Sender IDs</h3>
                <p className="text-xs text-[#AEB4BC]">Register official company or church headers.</p>
              </div>
            </div>
            <span className="bg-[#1E232B] text-[#D4AF6A] border border-[rgba(212,175,106,0.3)] px-4 py-2 rounded-xl text-xs font-bold shrink-0">
              Manage
            </span>
          </div>

          <div
            onClick={() => handleBoxClick('developer-api', '/developer-api')}
            className="bg-[#161B22] border border-white/10 hover:border-[rgba(212,175,106,0.3)] rounded-2xl p-6 flex items-center justify-between space-x-4 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E232B] border border-white/10 flex items-center justify-center text-[#D4AF6A] shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Developer REST API</h3>
                <p className="text-xs text-[#AEB4BC]">Integrate SMS & Voice API into your app.</p>
              </div>
            </div>
            <span className="bg-[#1E232B] text-[#D4AF6A] border border-[rgba(212,175,106,0.3)] px-4 py-2 rounded-xl text-xs font-bold shrink-0">
              API Keys
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
