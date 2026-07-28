import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  MessageSquare,
  ArrowRight,
  Calculator,
  ChevronRight,
  Globe,
  Clock,
  Lock,
} from 'lucide-react';

export default function LandingPage() {
  const [calculatorUnits, setCalculatorUnits] = useState(1000);
  const costPerSms = 0.04;
  const estimatedCost = (calculatorUnits * costPerSms).toFixed(2);

  return (
    <div className="min-h-screen bg-[#14171D] text-white font-sans overflow-x-hidden selection:bg-[#D4AF6A] selection:text-black">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#1E232B]/80 backdrop-blur-xl border-b border-[rgba(212,175,106,0.15)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <img
                src="/logo.jpg"
                alt="FasReach Logo"
                className="relative w-11 h-11 rounded-2xl object-cover border border-[#D4AF6A]/50 shadow-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-[#D4AF6A] transition-colors">
                Fas<span className="text-[#D4AF6A]">Reach</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#AEB4BC]">Enterprise SMS Engine</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-[#AEB4BC]">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#calculator" className="hover:text-white transition-colors">
              SMS Calculator
            </a>
            <a href="#api" className="hover:text-white transition-colors">
              Developer API
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-xs font-bold text-white hover:text-[#D4AF6A] px-4 py-2.5 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="relative group overflow-hidden rounded-xl p-px font-bold text-xs shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF6A] via-[#E7D3A4] to-[#B88E3E] transition-all duration-300 group-hover:opacity-90"></div>
              <div className="relative px-5 py-2.5 rounded-[11px] bg-[#1E232B] text-white group-hover:bg-transparent group-hover:text-black transition-all">
                Get Started Free
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF6A]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#2A3038]/80 border border-[rgba(212,175,106,0.3)] px-4 py-1.5 rounded-full text-xs font-semibold text-[#D4AF6A] shadow-xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Bulk SMS & Marketing Platform for Ghana</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Reach Millions in Seconds with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF6A] via-[#E7D3A4] to-[#B88E3E]">Ultra-Fast Bulk SMS</span>
            </h1>

            <p className="text-sm sm:text-base text-[#AEB4BC] max-w-2xl mx-auto leading-relaxed">
              Broadcast high-converting marketing campaigns, transactional alerts, and OTPs across MTN, Telecel, and AT networks. Enjoy 99.9% delivery rates and instant custom Sender ID registration.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-extrabold text-sm px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-2xl hover:opacity-95 transition-all transform hover:-translate-y-0.5"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-[#2A3038] hover:bg-[#343B45] text-white border border-[rgba(212,175,106,0.3)] font-bold text-sm px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl transition-all"
              >
                <span>Live Dashboard Demo</span>
              </Link>
            </div>

            {/* Feature Highlights Bar */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-[rgba(212,175,106,0.15)] max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#2A3038]/40 border border-[rgba(212,175,106,0.1)]">
                <Zap className="w-5 h-5 text-[#D4AF6A] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Sub-Second Delivery</div>
                  <div className="text-[10px] text-[#AEB4BC]">Direct Telco Routing</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#2A3038]/40 border border-[rgba(212,175,106,0.1)]">
                <ShieldCheck className="w-5 h-5 text-[#D4AF6A] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Auto Sender IDs</div>
                  <div className="text-[10px] text-[#AEB4BC]">Instant Arkesel Approval</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#2A3038]/40 border border-[rgba(212,175,106,0.1)]">
                <CreditCard className="w-5 h-5 text-[#D4AF6A] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">MoMo & Card Top-Up</div>
                  <div className="text-[10px] text-[#AEB4BC]">Min Deposit GHS 1.00</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-[#2A3038]/40 border border-[rgba(212,175,106,0.1)]">
                <Code2 className="w-5 h-5 text-[#D4AF6A] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Developer REST API</div>
                  <div className="text-[10px] text-[#AEB4BC]">1-Minute Integration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Platform Capabilities & Features */}
      <section id="features" className="py-20 bg-[#1A1D24] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Everything You Need to Scale Your <span className="text-[#D4AF6A]">SMS Messaging</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">
              Built with multi-gateway failover, AI message generator, contact directory segmenting, and real-time delivery reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-4 hover:border-[#D4AF6A]/50 transition-all shadow-2xl group">
              <div className="w-12 h-12 bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 rounded-2xl flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Instant & Scheduled Broadcasts</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Dispatch single SMS or bulk broadcasts to thousands of clients instantly. Set future dates and times with our background automated scheduler.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-4 hover:border-[#D4AF6A]/50 transition-all shadow-2xl group">
              <div className="w-12 h-12 bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 rounded-2xl flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">AI SMS Content Generator</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Never run out of promotional ideas. Type a brief prompt and let our built-in AI generate high-converting promotional SMS templates in seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-4 hover:border-[#D4AF6A]/50 transition-all shadow-2xl group">
              <div className="w-12 h-12 bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 rounded-2xl flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">CSV & Excel Contact Importer</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Upload 10,000+ contacts effortlessly from Excel (.xlsx) or CSV files. Organize custom groups like VIPs, Staff, Church Members, or School Parents.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-4 hover:border-[#D4AF6A]/50 transition-all shadow-2xl group">
              <div className="w-12 h-12 bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 rounded-2xl flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Real-Time Delivery Synchronization</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Track exact message stages (Pending, Submitted, Delivered, Failed) in real time with automated Arkesel network receipts and public webhooks.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-4 hover:border-[#D4AF6A]/50 transition-all shadow-2xl group">
              <div className="w-12 h-12 bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 rounded-2xl flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Custom Branded Sender IDs</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Send messages under your custom business header (e.g. YOURBRAND). Auto-registered directly with Arkesel v2 API for instant approval.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-4 hover:border-[#D4AF6A]/50 transition-all shadow-2xl group">
              <div className="w-12 h-12 bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 rounded-2xl flex items-center justify-center text-[#D4AF6A] group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Developer REST API Keys</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Connect your website, mobile app, or ERP system directly using secure Bearer API tokens. Send transactional SMS programmatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive SMS Cost Calculator */}
      <section id="calculator" className="py-20 bg-[#14171D] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2A3038]/80 border border-[rgba(212,175,106,0.3)] rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 border-b border-[rgba(212,175,106,0.15)] pb-4">
              <Calculator className="w-6 h-6 text-[#D4AF6A]" />
              <div>
                <h3 className="text-lg font-bold text-white">Interactive SMS Price Calculator</h3>
                <p className="text-xs text-[#AEB4BC]">Calculate your estimated SMS broadcast cost at GHS 0.04 / SMS</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-[#AEB4BC]">Number of SMS Messages:</span>
                <span className="text-[#D4AF6A] font-mono text-lg">{calculatorUnits.toLocaleString()} SMS</span>
              </div>

              <input
                type="range"
                min="100"
                max="100000"
                step="500"
                value={calculatorUnits}
                onChange={(e) => setCalculatorUnits(Number(e.target.value))}
                className="w-full h-2 bg-[#1E232B] rounded-lg appearance-none cursor-pointer accent-[#D4AF6A]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
                <div className="bg-[#1E232B] p-4 rounded-2xl border border-[rgba(212,175,106,0.15)]">
                  <span className="text-[11px] text-[#AEB4BC] block">Cost Per SMS</span>
                  <span className="text-base font-extrabold text-white font-mono">GHS 0.04</span>
                </div>
                <div className="bg-[#1E232B] p-4 rounded-2xl border border-[rgba(212,175,106,0.15)]">
                  <span className="text-[11px] text-[#AEB4BC] block">Total Messages</span>
                  <span className="text-base font-extrabold text-white font-mono">{calculatorUnits.toLocaleString()}</span>
                </div>
                <div className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black p-4 rounded-2xl shadow-xl">
                  <span className="text-[11px] font-bold block uppercase opacity-80">Estimated Cost</span>
                  <span className="text-xl font-black font-mono">GHS {estimatedCost}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Tiers */}
      <section id="pricing" className="py-20 bg-[#1A1D24] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Transparent, Flexible <span className="text-[#D4AF6A]">Pricing Plans</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">
              Choose pay-as-you-go or subscribe to monthly high-volume wholesale bundles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: Pay-As-You-Go */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="bg-[#1E232B] text-[#D4AF6A] border border-[#D4AF6A]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Pay-As-You-Go
                </span>
                <h3 className="text-xl font-bold text-white">Flexi Top-Up</h3>
                <div className="text-3xl font-black text-[#D4AF6A] font-mono">
                  GHS 0.04 <span className="text-xs text-[#AEB4BC] font-normal">/ SMS</span>
                </div>
                <p className="text-xs text-[#AEB4BC]">No monthly commitment. Top up anytime via MoMo starting at GHS 1.00.</p>

                <ul className="space-y-3 text-xs text-[#AEB4BC] pt-4 border-t border-[rgba(212,175,106,0.15)]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pay only for what you send</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cash balance never expires</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant MoMo & Card Deposits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Default FASREACH Sender ID</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full bg-[#2A3038] hover:bg-[#D4AF6A]/20 border border-[rgba(212,175,106,0.3)] text-white font-bold text-xs py-3 rounded-xl text-center block transition-colors"
              >
                Start Pay-As-You-Go
              </Link>
            </div>

            {/* Plan 2: Starter Business */}
            <div className="bg-[#2A3038]/70 border border-[#D4AF6A]/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#D4AF6A] text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Most Popular
              </div>

              <div className="space-y-4">
                <span className="bg-[#D4AF6A]/20 text-[#D4AF6A] border border-[#D4AF6A]/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Starter Business
                </span>
                <h3 className="text-xl font-bold text-white">Business Package</h3>
                <div className="text-3xl font-black text-[#D4AF6A] font-mono">
                  GHS 150 <span className="text-xs text-[#AEB4BC] font-normal">/ mo</span>
                </div>
                <p className="text-xs text-[#E7D3A4] font-semibold">Includes 4,000 SMS Credits per month</p>

                <ul className="space-y-3 text-xs text-[#AEB4BC] pt-4 border-t border-[rgba(212,175,106,0.15)]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>4,000 Monthly SMS Units</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>3 Custom Sender IDs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI Content Generator</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Excel & CSV Contact Import</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-extrabold text-xs py-3 rounded-xl text-center block shadow-lg hover:opacity-95 transition-opacity"
              >
                Get Started
              </Link>
            </div>

            {/* Plan 3: Enterprise Agency */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="bg-[#1E232B] text-[#D4AF6A] border border-[#D4AF6A]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Enterprise Agency
                </span>
                <h3 className="text-xl font-bold text-white">Agency Package</h3>
                <div className="text-3xl font-black text-[#D4AF6A] font-mono">
                  GHS 450 <span className="text-xs text-[#AEB4BC] font-normal">/ mo</span>
                </div>
                <p className="text-xs text-[#E7D3A4] font-semibold">Includes 15,000 SMS Credits per month</p>

                <ul className="space-y-3 text-xs text-[#AEB4BC] pt-4 border-t border-[rgba(212,175,106,0.15)]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>15,000 Monthly SMS Units</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>15 Custom Sender IDs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Multi-Gateway Failover</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Developer REST API Access</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full bg-[#2A3038] hover:bg-[#D4AF6A]/20 border border-[rgba(212,175,106,0.3)] text-white font-bold text-xs py-3 rounded-xl text-center block transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-[#101318] border-t border-[rgba(212,175,106,0.15)] py-12 text-xs text-[#AEB4BC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="FasReach" className="w-9 h-9 rounded-xl object-cover border border-[#D4AF6A]/40" />
            <div>
              <span className="font-bold text-white text-sm">Fas<span className="text-[#D4AF6A]">Reach</span> Platform</span>
              <p className="text-[10px] text-[#AEB4BC]">© 2026 FasReach. All rights reserved.</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
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
