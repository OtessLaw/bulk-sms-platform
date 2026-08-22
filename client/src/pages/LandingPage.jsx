import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Send,
  Zap,
  ShieldCheck,
  Smartphone,
  Users,
  Code2,
  Sparkles,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Calculator,
  ChevronRight,
  Clock,
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Globe,
  TrendingUp,
  Award,
  Radio,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const [calculatorUnits, setCalculatorUnits] = useState(2500);
  const costPerSms = 0.04;
  const estimatedCost = (calculatorUnits * costPerSms).toFixed(2);
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Live SMS Simulator state
  const [simText, setSimText] = useState('Flash Sale! Get 20% off all orders today with code FASREACH20.');
  const [simSender, setSimSender] = useState('FASREACH');
  const [simSending, setSimSending] = useState(false);
  const [simSentSuccess, setSimSentSuccess] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    phone: '+233 24 111 2233',
    whatsapp: '+233 24 111 2233',
    email: 'support@fasreach.com',
    instagram: 'https://instagram.com/fasreach',
    facebook: 'https://facebook.com/fasreach',
    twitter: 'https://x.com/fasreach',
    address: 'Accra, Ghana',
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await API.get('/settings/contact');
      if (res.data.success) {
        setContactInfo(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load landing contact info', err);
    }
  };

  const handleSimSend = () => {
    setSimSending(true);
    setTimeout(() => {
      setSimSending(false);
      setSimSentSuccess(true);
      setTimeout(() => setSimSentSuccess(false), 3000);
    }, 1500);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How much does SMS cost on FasReach?',
      a: 'SMS starts at GHS 0.04 per message. You can top up any amount via Mobile Money starting at GHS 1.00.',
    },
    {
      q: 'Do my unused SMS credits or funds expire?',
      a: 'No! Your wallet cash balance and SMS credits NEVER expire. Use them whenever you need.',
    },
    {
      q: 'Can I send custom branded Sender IDs?',
      a: 'Yes, you can register custom Sender IDs (e.g. YOURBRAND or CHURCH) for instant approval on your account.',
    },
    {
      q: 'Which mobile networks in Ghana are supported?',
      a: 'We deliver sub-second SMS to all networks in Ghana: MTN Ghana, Telecel (Vodafone), and AT (AirtelTigo).',
    },
    {
      q: 'Can I integrate FasReach into my website or software?',
      a: 'Yes! We provide developer-friendly REST APIs with full documentation and ready-to-use code snippets.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#12151B] text-white font-sans overflow-x-hidden selection:bg-[#D4AF6A] selection:text-black relative">
      {/* Dynamic Background Glow Elements */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-[#D4AF6A]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-[500px] h-[500px] bg-[#B88E3E]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#1E232B]/90 backdrop-blur-xl border-b border-[rgba(212,175,106,0.15)] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/logo.jpg" alt="FasReach" className="w-11 h-11 rounded-2xl object-cover border-2 border-[#D4AF6A]/60 shadow-lg group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-black tracking-wide text-white">
              Fas<span className="text-[#D4AF6A]">Reach</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-[#AEB4BC]">
            <a href="https://app.fasreach.com" className="text-[#D4AF6A] font-extrabold flex items-center space-x-1 hover:underline">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Products Portal</span>
            </a>
            <a href="#features" className="hover:text-[#D4AF6A] transition-colors">Features</a>
            <a href="#simulator" className="hover:text-[#D4AF6A] transition-colors">Live Demo</a>
            <a href="#pricing" className="hover:text-[#D4AF6A] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#D4AF6A] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/login" className="text-xs font-bold text-[#AEB4BC] hover:text-[#D4AF6A] px-3 py-2 transition-colors">
              Sign In
            </Link>
            <a
              href="https://app.fasreach.com"
              className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-extrabold text-xs px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl shadow-[0_0_20px_rgba(212,175,106,0.3)] hover:scale-105 transition-all shrink-0"
            >
              Select Product Hub
            </a>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-[#2A3038]/90 border border-[rgba(212,175,106,0.3)] px-4 py-1.5 rounded-full text-xs font-bold text-[#D4AF6A] backdrop-blur-md shadow-lg">
                <Sparkles className="w-4 h-4 text-[#D4AF6A] animate-pulse" />
                <span>Ghana's Premier Bulk SMS & Messaging Infrastructure</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
                Reach Thousands in Seconds with <span className="bg-gradient-to-r from-[#D4AF6A] via-[#E7D3A4] to-[#B88E3E] bg-clip-text text-transparent">Instant Bulk SMS</span>
              </h1>

              <p className="text-sm sm:text-base text-[#AEB4BC] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Broadcast branded SMS alerts, marketing offers, and OTPs to MTN, Telecel, and AT numbers across Ghana at just <strong className="text-[#D4AF6A]">GHS 0.04 per SMS</strong>.
              </p>

              {/* Quick Trust Badges */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 pt-2">
                <div className="bg-[#1E232B]/80 border border-[rgba(212,175,106,0.2)] p-3 rounded-2xl text-center">
                  <span className="text-lg sm:text-xl font-extrabold text-[#D4AF6A] block font-mono">Sub-Second</span>
                  <span className="text-[10px] text-[#AEB4BC] font-semibold">Delivery Speed</span>
                </div>
                <div className="bg-[#1E232B]/80 border border-[rgba(212,175,106,0.2)] p-3 rounded-2xl text-center">
                  <span className="text-lg sm:text-xl font-extrabold text-emerald-400 block font-mono">99.9%</span>
                  <span className="text-[10px] text-[#AEB4BC] font-semibold">Network Uptime</span>
                </div>
                <div className="bg-[#1E232B]/80 border border-[rgba(212,175,106,0.2)] p-3 rounded-2xl text-center">
                  <span className="text-lg sm:text-xl font-extrabold text-[#D4AF6A] block font-mono">GHS 0.04</span>
                  <span className="text-[10px] text-[#AEB4BC] font-semibold">Starting Rate</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-extrabold text-sm px-8 py-4 rounded-2xl flex items-center justify-center space-x-3 shadow-[0_0_30px_rgba(212,175,106,0.4)] hover:scale-105 transition-all"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#simulator"
                  className="w-full sm:w-auto bg-[#2A3038] hover:bg-[#343B45] text-white border border-[rgba(212,175,106,0.3)] font-bold text-sm px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <Smartphone className="w-4 h-4 text-[#D4AF6A]" />
                  <span>Try Live Simulator</span>
                </a>
              </div>
            </div>

            {/* 3D Smartphone Device Mockup Simulation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-[#1E232B] border-4 border-[#2A3038] rounded-[40px] p-4 shadow-[0_0_50px_rgba(212,175,106,0.2)] relative">
                {/* Phone Speaker Notch */}
                <div className="w-24 h-4 bg-[#2A3038] rounded-full mx-auto mb-4 flex items-center justify-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-[#12151B] rounded-full" />
                  <div className="w-8 h-1.5 bg-[#12151B] rounded-full" />
                </div>

                {/* Smartphone Display Screen */}
                <div className="bg-[#12151B] rounded-[28px] p-4 space-y-4 border border-[rgba(212,175,106,0.15)] min-h-[380px] flex flex-col justify-between">
                  {/* SMS Header */}
                  <div className="flex items-center justify-between border-b border-[rgba(212,175,106,0.15)] pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF6A] to-[#E7D3A4] flex items-center justify-center text-black font-black text-xs">
                        FR
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-white block">{simSender || 'FASREACH'}</span>
                        <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Delivered Just Now
                        </span>
                      </div>
                    </div>
                    <span className="bg-[#D4AF6A]/20 text-[#D4AF6A] border border-[#D4AF6A]/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Verified Sender
                    </span>
                  </div>

                  {/* Incoming Chat Message Bubble */}
                  <div className="space-y-3 my-auto">
                    <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.25)] rounded-2xl rounded-tl-none p-3.5 shadow-lg space-y-1.5">
                      <p className="text-xs text-white leading-relaxed font-medium">
                        {simText || 'Type a sample message in the input box below...'}
                      </p>
                      <div className="flex justify-between items-center text-[9px] text-[#AEB4BC] pt-1">
                        <span>{simText.length} chars • {Math.ceil(simText.length / 160) || 1} SMS unit</span>
                        <span className="text-[#D4AF6A] font-bold">GHS {(Math.ceil(simText.length / 160) * 0.04).toFixed(2)}</span>
                      </div>
                    </div>

                    {simSentSuccess && (
                      <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-2 text-center text-xs font-bold text-emerald-400 animate-in fade-in duration-300">
                        ⚡ SMS Sent & Delivered in 0.8 seconds!
                      </div>
                    )}
                  </div>

                  {/* Interactive Test Input Controls */}
                  <div className="space-y-2 pt-2 border-t border-[rgba(212,175,106,0.15)]">
                    <input
                      type="text"
                      value={simText}
                      onChange={(e) => setSimText(e.target.value)}
                      placeholder="Type your message text here..."
                      className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.3)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
                    />
                    <button
                      onClick={handleSimSend}
                      disabled={simSending}
                      className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Send className={`w-3.5 h-3.5 ${simSending ? 'animate-bounce' : ''}`} />
                      <span>{simSending ? 'Dispatching...' : 'Test Send Sample SMS'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Features Section */}
      <section id="features" className="py-20 bg-[#171A21] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#D4AF6A] uppercase tracking-wider">Enterprise Messaging Suite</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything You Need to <span className="text-[#D4AF6A]">Connect & Engage</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">Built for Ghanaian businesses, schools, churches, and developers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#2A3038]/60 hover:bg-[#2A3038] border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] rounded-3xl p-6 space-y-3 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Bulk SMS Campaigns</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">Broadcast promotional offers, announcements, and news to thousands of contacts with 1 click.</p>
            </div>

            <div className="bg-[#2A3038]/60 hover:bg-[#2A3038] border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] rounded-3xl p-6 space-y-3 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Excel & CSV Upload</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">Import contact lists seamlessly from Excel or CSV files with custom audience segmentation.</p>
            </div>

            <div className="bg-[#2A3038]/60 hover:bg-[#2A3038] border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] rounded-3xl p-6 space-y-3 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Scheduled Dispatches</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">Schedule birthday messages, reminders, and future campaigns for automatic background delivery.</p>
            </div>

            <div className="bg-[#2A3038]/60 hover:bg-[#2A3038] border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] rounded-3xl p-6 space-y-3 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Custom Branded Sender IDs</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">Register custom company headers (e.g. YOURBRAND) for instant brand recognition on every phone.</p>
            </div>

            <div className="bg-[#2A3038]/60 hover:bg-[#2A3038] border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] rounded-3xl p-6 space-y-3 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Developer REST API</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">Send SMS programmatically from your app or website using secure SHA-256 API keys.</p>
            </div>

            <div className="bg-[#2A3038]/60 hover:bg-[#2A3038] border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] rounded-3xl p-6 space-y-3 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Real-Time Delivery Receipts</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">Monitor live delivery statuses, failed numbers, and network carrier receipts in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Pricing Calculator */}
      <section id="pricing" className="py-20 bg-[#12151B] relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#D4AF6A] uppercase tracking-wider">Transparent & Fair Rates</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Calculate Your <span className="text-[#D4AF6A]">SMS Cost</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">Pay only for what you send at 0.04 GHS per SMS. Wallet funds never expire.</p>
          </div>

          <div className="bg-[#1E232B]/90 border-2 border-[rgba(212,175,106,0.3)] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(212,175,106,0.15)] pb-6">
              <div>
                <span className="text-xs text-[#AEB4BC] font-semibold block">Select SMS Quantity:</span>
                <span className="text-2xl sm:text-3xl font-black text-[#D4AF6A] font-mono">{calculatorUnits.toLocaleString()} SMS Messages</span>
              </div>
              {calculatorUnits >= 10000 && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                  🔥 Premium High-Volume Rate Included
                </span>
              )}
            </div>

            {/* Drag Slider */}
            <div className="space-y-3">
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={calculatorUnits}
                onChange={(e) => setCalculatorUnits(Number(e.target.value))}
                className="w-full h-3 bg-[#2A3038] rounded-xl appearance-none cursor-pointer accent-[#D4AF6A] shadow-inner"
              />

              {/* Quick Select Presets */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[1000, 5000, 10000, 25000, 50000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setCalculatorUnits(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      calculatorUnits === preset
                        ? 'bg-[#D4AF6A] text-black shadow-md'
                        : 'bg-[#2A3038] text-[#AEB4BC] hover:text-white border border-[rgba(212,175,106,0.2)]'
                    }`}
                  >
                    {preset.toLocaleString()} SMS
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-[#2A3038]/80 p-4 rounded-2xl border border-[rgba(212,175,106,0.15)] text-center">
                <span className="text-[11px] text-[#AEB4BC] block font-semibold">Rate Per SMS</span>
                <span className="text-base font-extrabold text-white font-mono">GHS 0.04</span>
              </div>
              <div className="bg-[#2A3038]/80 p-4 rounded-2xl border border-[rgba(212,175,106,0.15)] text-center">
                <span className="text-[11px] text-[#AEB4BC] block font-semibold">Total SMS Units</span>
                <span className="text-base font-extrabold text-white font-mono">{calculatorUnits.toLocaleString()}</span>
              </div>
              <div className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black p-4 rounded-2xl shadow-xl text-center">
                <span className="text-[11px] font-bold block uppercase opacity-80">Total Cost</span>
                <span className="text-2xl font-black font-mono">GHS {estimatedCost}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Supported Ghana Networks */}
      <section id="networks" className="py-16 bg-[#171A21] border-y border-[rgba(212,175,106,0.15)] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Instant Delivery Across <span className="text-[#D4AF6A]">All Ghana Networks</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#2A3038]/80 border border-amber-500/30 p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center font-black text-lg">
                MTN
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">MTN Ghana</h4>
                <p className="text-xs text-emerald-400 font-medium">99.9% Instant Delivery</p>
              </div>
            </div>

            <div className="bg-[#2A3038]/80 border border-red-500/30 p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
              <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center font-black text-lg">
                TEL
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Telecel Ghana</h4>
                <p className="text-xs text-emerald-400 font-medium">Vodafone Sub-Second Route</p>
              </div>
            </div>

            <div className="bg-[#2A3038]/80 border border-blue-500/30 p-5 rounded-2xl flex items-center space-x-4 shadow-lg">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center font-black text-lg">
                AT
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">AT Ghana</h4>
                <p className="text-xs text-emerald-400 font-medium">AirtelTigo High Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ & Contact Section */}
      <section id="faq" className="py-20 bg-[#12151B] relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#D4AF6A] uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Got Questions? <span className="text-[#D4AF6A]">We've Got Answers</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-2xl overflow-hidden shadow-lg transition-all">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left text-sm font-bold text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-[#D4AF6A] transition-transform duration-300 ${openFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-[#AEB4BC] border-t border-[rgba(212,175,106,0.1)] pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dynamic Contact Action Buttons */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
            {contactInfo.whatsapp && (
              <a
                href={`https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2.5 hover:bg-emerald-500/30 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Live Chat</span>
              </a>
            )}

            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="w-full sm:w-auto bg-[#2A3038] text-white border border-[rgba(212,175,106,0.3)] px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2.5 hover:border-[#D4AF6A] transition-all shadow-lg"
              >
                <Phone className="w-4 h-4 text-[#D4AF6A]" />
                <span>Call {contactInfo.phone}</span>
              </a>
            )}

            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="w-full sm:w-auto bg-[#2A3038] text-[#D4AF6A] border border-[rgba(212,175,106,0.3)] px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2.5 hover:border-[#D4AF6A] transition-all shadow-lg"
              >
                <Mail className="w-4 h-4" />
                <span>{contactInfo.email}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0F14] border-t border-[rgba(212,175,106,0.15)] py-10 text-xs text-[#AEB4BC] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="FasReach" className="w-9 h-9 rounded-xl object-cover border border-[#D4AF6A]/50" />
            <div>
              <span className="font-bold text-white block">FasReach Enterprise Platform</span>
              <span className="text-[10px] text-[#AEB4BC] block">{contactInfo.address || 'Accra, Ghana'}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-3 text-[#AEB4BC]">
            {contactInfo.instagram && (
              <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors p-2.5 bg-[#1E232B] rounded-xl border border-[rgba(212,175,106,0.15)]">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {contactInfo.facebook && (
              <a href={contactInfo.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors p-2.5 bg-[#1E232B] rounded-xl border border-[rgba(212,175,106,0.15)]">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {contactInfo.twitter && (
              <a href={contactInfo.twitter} target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors p-2.5 bg-[#1E232B] rounded-xl border border-[rgba(212,175,106,0.15)]">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="flex space-x-6 text-[11px] font-semibold">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="text-[#D4AF6A] font-bold hover:underline">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
