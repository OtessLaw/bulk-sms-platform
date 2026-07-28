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
  Building2,
  GraduationCap,
  Church,
  HeartHandshake,
  Vote,
  ShoppingBag,
  CalendarDays,
  HelpCircle,
  Mail,
  PhoneCall,
  MessageCircle,
  FileText,
  BarChart3,
  Layers,
} from 'lucide-react';

export default function LandingPage() {
  const [calculatorUnits, setCalculatorUnits] = useState(1000);
  const costPerSms = 0.04;
  const estimatedCost = (calculatorUnits * costPerSms).toFixed(2);

  // FAQ State
  const [openFaq, setOpenFaq] = useState(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: 'How much does SMS cost on FasReach?',
      a: 'SMS messages start at just GHS 0.04 per SMS with no hidden charges or setup fees. You can top up any amount via Mobile Money or Card starting at GHS 1.00.',
    },
    {
      q: 'Do unused SMS credits or cash balances expire?',
      a: 'No! Your wallet cash balance and SMS credits never expire. They remain in your account until you send your broadcasts.',
    },
    {
      q: 'Can I schedule messages for a future date and time?',
      a: 'Yes, absolutely. FasReach includes an automated background scheduler. Select any future date and time, and our system will automatically dispatch your broadcast.',
    },
    {
      q: 'Do you support custom branded Sender IDs?',
      a: 'Yes! You can register your custom Sender ID (e.g. YOURBRAND). Sender IDs are automatically registered with our Arkesel v2 API for instant approval.',
    },
    {
      q: 'How quickly are messages delivered?',
      a: 'Messages are routed directly through high-speed direct telco connections across MTN, Telecel, and AT networks with delivery times under 3 seconds.',
    },
  ];

  const industries = [
    { name: 'Schools & Universities', icon: GraduationCap, desc: 'Send exam results, fee reminders, & emergency notices to parents.' },
    { name: 'Churches & Ministries', icon: Church, desc: 'Broadcast Sunday service reminders, devotionals, & event updates.' },
    { name: 'Corporate Businesses', icon: Building2, desc: 'Deliver internal staff alerts, client updates, & promotional offers.' },
    { name: 'NGOs & Non-Profits', icon: HeartHandshake, desc: 'Coordinate field teams, donor updates, and community campaigns.' },
    { name: 'Political Campaigns', icon: Vote, desc: 'Reach constituents en masse with manifesto updates & rally reminders.' },
    { name: 'E-commerce & Retail', icon: ShoppingBag, desc: 'Send order confirmations, delivery tracking SMS, & flash sale alerts.' },
    { name: 'Event Organizers', icon: CalendarDays, desc: 'Broadcast ticket confirmations, venue directions, & schedule changes.' },
  ];

  return (
    <div className="min-h-screen bg-[#14171D] text-white font-sans overflow-x-hidden selection:bg-[#D4AF6A] selection:text-black">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#1E232B]/85 backdrop-blur-xl border-b border-[rgba(212,175,106,0.15)] transition-all">
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

          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold text-[#AEB4BC]">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#industries" className="hover:text-white transition-colors">
              Industries
            </a>
            <a href="#api" className="hover:text-white transition-colors">
              Developer API
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact Us
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-xs font-bold text-white hover:text-[#D4AF6A] px-3.5 py-2.5 rounded-xl transition-colors"
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

      {/* 1. Hero Section (Top of Homepage) */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#D4AF6A]/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-[#2A3038]/80 border border-[rgba(212,175,106,0.3)] px-4 py-1.5 rounded-full text-xs font-semibold text-[#D4AF6A] shadow-xl backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ghana's Premier Enterprise Bulk SMS Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Fast, Reliable Bulk SMS for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF6A] via-[#E7D3A4] to-[#B88E3E]">Businesses in Ghana</span>
              </h1>

              <p className="text-sm sm:text-base text-[#AEB4BC] leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect instantly with thousands of customers across MTN, Telecel, and AT networks. Send marketing campaigns, transactional alerts, and OTPs at 0.04 GHS per SMS with 99.9% high delivery rate.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-extrabold text-sm px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-2xl hover:opacity-95 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Start Sending SMS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#pricing"
                  className="w-full sm:w-auto bg-[#2A3038] hover:bg-[#343B45] text-white border border-[rgba(212,175,106,0.3)] font-bold text-sm px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl transition-all"
                >
                  <span>View Pricing</span>
                </a>
              </div>

              <div className="pt-6 flex items-center justify-center lg:justify-start space-x-6 text-xs text-[#AEB4BC]">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No Monthly Expiration</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant MoMo Deposit</span>
                </div>
              </div>
            </div>

            {/* Right Dashboard Screenshot / Live UI Preview Frame */}
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>

              <div className="relative bg-[#1E232B] border border-[rgba(212,175,106,0.3)] rounded-3xl p-4 shadow-2xl space-y-4">
                {/* Browser Top Header Controls */}
                <div className="flex items-center justify-between border-b border-[rgba(212,175,106,0.15)] pb-3 px-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  <div className="bg-[#2A3038] text-[10px] text-[#D4AF6A] font-mono px-4 py-1 rounded-full border border-[rgba(212,175,106,0.2)]">
                    https://fasreach.com/send-sms
                  </div>
                  <Sparkles className="w-4 h-4 text-[#D4AF6A]" />
                </div>

                {/* Dashboard Screenshot Mock Representation */}
                <div className="bg-[#2A3038]/90 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-[#D4AF6A]" /> Live SMS Dispatcher
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      99.9% High Delivery Rate
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-[#1E232B] p-2.5 rounded-xl border border-[rgba(212,175,106,0.15)] flex justify-between">
                      <span className="text-[#AEB4BC]">Sender ID Header:</span>
                      <span className="font-bold text-[#D4AF6A]">FASREACH</span>
                    </div>

                    <div className="bg-[#1E232B] p-2.5 rounded-xl border border-[rgba(212,175,106,0.15)] flex justify-between">
                      <span className="text-[#AEB4BC]">Recipients:</span>
                      <span className="font-mono text-white">0241112233 (+ 4,999 contacts)</span>
                    </div>

                    <div className="bg-[#1E232B] p-3 rounded-xl border border-[rgba(212,175,106,0.15)] text-[#E7D3A4]">
                      "Dear Valued Customer, your order #8849 is on the way! Thank you for choosing FasReach."
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[#AEB4BC]">Cost: <strong className="text-[#D4AF6A] font-mono">GHS 0.04 / SMS</strong></span>
                    <button type="button" className="bg-[#D4AF6A] text-black font-extrabold px-4 py-2 rounded-xl text-xs">
                      Dispatched Successfully ✓
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section id="features" className="py-20 bg-[#1A1D24] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Enterprise Features Built for <span className="text-[#D4AF6A]">High Growth</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">
              Powerful bulk messaging tools designed for Ghanaian businesses, schools, churches, and developers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
              <Send className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Bulk SMS Campaigns</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Broadcast marketing campaigns or announcement messages to thousands of contacts with a single click.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
              <MessageSquare className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Personalized SMS</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Insert customer names, custom account balances, or unique codes into messages dynamically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
              <Users className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Contact Management</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Upload CSV or Excel files, organize custom groups, and search contact directories with zero effort.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
              <FileText className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Delivery Reports</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Monitor real-time message statuses (Pending, Submitted, Delivered, Failed) with live network receipts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
              <Clock className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">SMS Scheduling</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Set future dispatch dates and times. Our automated background worker dispatches messages while you sleep.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
              <Lock className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Sender ID Support</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Brand your SMS broadcasts with your business name. Auto-registered with Arkesel v2 API for fast approval.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
              <Code2 className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">API Integration</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Programmatically send transactional SMS, OTPs, and alerts directly from your software or mobile app.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
              <Zap className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Fast Sub-Second Delivery</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Direct connections to MTN, Telecel, and AT networks ensure your SMS arrives in under 3 seconds.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
              <BarChart3 className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">High Delivery & Real-Time Analytics</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Achieve 99.9% delivery rates with multi-gateway failover and live delivery analytics dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing Section */}
      <section id="pricing" className="py-20 bg-[#14171D] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Affordable <span className="text-[#D4AF6A]">Pricing & Volume Bundles</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">
              No hidden fees, no setup charges. Pay-as-you-go or choose wholesale monthly bundles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pay-As-You-Go */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="bg-[#1E232B] text-[#D4AF6A] border border-[#D4AF6A]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Pay-As-You-Go
                </span>
                <h3 className="text-xl font-bold text-white">Flexi Rate</h3>
                <div className="text-3xl font-black text-[#D4AF6A] font-mono">
                  GHS 0.04 <span className="text-xs text-[#AEB4BC] font-normal">/ SMS</span>
                </div>
                <p className="text-xs text-[#AEB4BC]">Top up any amount via Mobile Money starting at GHS 1.00.</p>

                <ul className="space-y-3 text-xs text-[#AEB4BC] pt-4 border-t border-[rgba(212,175,106,0.15)]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pay strictly for messages sent</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cash balance NEVER expires</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>MTN MoMo, Telecel Cash & Cards</span>
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

            {/* Enterprise Volume Plan */}
            <div className="bg-[#2A3038]/70 border border-[#D4AF6A]/60 rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#D4AF6A] text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Volume Discount
              </div>

              <div className="space-y-4">
                <span className="bg-[#D4AF6A]/20 text-[#D4AF6A] border border-[#D4AF6A]/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Starter Business
                </span>
                <h3 className="text-xl font-bold text-white">Wholesale Package</h3>
                <div className="text-3xl font-black text-[#D4AF6A] font-mono">
                  GHS 150 <span className="text-xs text-[#AEB4BC] font-normal">/ mo</span>
                </div>
                <p className="text-xs text-[#E7D3A4] font-semibold">Includes 4,000 SMS Credits + 3 Sender IDs</p>

                <ul className="space-y-3 text-xs text-[#AEB4BC] pt-4 border-t border-[rgba(212,175,106,0.15)]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>4,000 Bundled SMS Credits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>3 Custom Sender IDs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI Content Generator</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-extrabold text-xs py-3 rounded-xl text-center block shadow-lg hover:opacity-95"
              >
                Subscribe Package
              </Link>
            </div>

            {/* Enterprise & Reseller Plan */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-8 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="bg-[#1E232B] text-[#D4AF6A] border border-[#D4AF6A]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Enterprise & Resellers
                </span>
                <h3 className="text-xl font-bold text-white">Agency Reseller</h3>
                <div className="text-3xl font-black text-[#D4AF6A] font-mono">
                  GHS 450 <span className="text-xs text-[#AEB4BC] font-normal">/ mo</span>
                </div>
                <p className="text-xs text-[#E7D3A4] font-semibold">Includes 15,000 SMS Credits + REST API</p>

                <ul className="space-y-3 text-xs text-[#AEB4BC] pt-4 border-t border-[rgba(212,175,106,0.15)]">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>15,000 Bundled SMS Credits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>15 Custom Sender IDs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>White-Label API Access</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full bg-[#2A3038] hover:bg-[#D4AF6A]/20 border border-[rgba(212,175,106,0.3)] text-white font-bold text-xs py-3 rounded-xl text-center block transition-colors"
              >
                Get Reseller Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#1A1D24] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              How FasReach Works in <span className="text-[#D4AF6A]">5 Easy Steps</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">Start broadcasting SMS messages to your audience in under 3 minutes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-5 text-center space-y-3 shadow-xl relative">
              <div className="w-10 h-10 bg-[#D4AF6A] text-black font-black rounded-full flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h3 className="text-xs font-bold text-white">Create Account</h3>
              <p className="text-[11px] text-[#AEB4BC]">Register your free FasReach account in 30 seconds.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-5 text-center space-y-3 shadow-xl relative">
              <div className="w-10 h-10 bg-[#D4AF6A] text-black font-black rounded-full flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h3 className="text-xs font-bold text-white">Add Contacts</h3>
              <p className="text-[11px] text-[#AEB4BC]">Upload Excel or CSV files or add contacts manually.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-5 text-center space-y-3 shadow-xl relative">
              <div className="w-10 h-10 bg-[#D4AF6A] text-black font-black rounded-full flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h3 className="text-xs font-bold text-white">Compose Message</h3>
              <p className="text-[11px] text-[#AEB4BC]">Draft your SMS or use our built-in AI Assistant.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-5 text-center space-y-3 shadow-xl relative">
              <div className="w-10 h-10 bg-[#D4AF6A] text-black font-black rounded-full flex items-center justify-center mx-auto text-sm">
                4
              </div>
              <h3 className="text-xs font-bold text-white">Send SMS</h3>
              <p className="text-[11px] text-[#AEB4BC]">Dispatch instantly or schedule for a future time.</p>
            </div>

            {/* Step 5 */}
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-5 text-center space-y-3 shadow-xl relative">
              <div className="w-10 h-10 bg-[#D4AF6A] text-black font-black rounded-full flex items-center justify-center mx-auto text-sm">
                5
              </div>
              <h3 className="text-xs font-bold text-white">View Reports</h3>
              <p className="text-[11px] text-[#AEB4BC]">Track live delivery receipts in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Industries We Serve */}
      <section id="industries" className="py-20 bg-[#14171D] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Industries <span className="text-[#D4AF6A]">We Serve</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">FasReach powers communication for organization leaders across Ghana.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, idx) => {
              const IconComp = ind.icon;
              return (
                <div key={idx} className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 space-y-3 hover:border-[#D4AF6A]/50 transition-all shadow-xl">
                  <div className="w-10 h-10 bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 rounded-2xl flex items-center justify-center text-[#D4AF6A]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{ind.name}</h3>
                  <p className="text-xs text-[#AEB4BC] leading-relaxed">{ind.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Why Choose FasReach */}
      <section className="py-20 bg-[#1A1D24] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Why Choose <span className="text-[#D4AF6A]">FasReach?</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">Engineered specifically for speed, reliability, and ease of use.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 text-center space-y-3 shadow-xl">
              <Zap className="w-8 h-8 text-[#D4AF6A] mx-auto" />
              <h3 className="text-xs font-bold text-white">Fast Sub-Second Delivery</h3>
              <p className="text-[11px] text-[#AEB4BC]">Direct telco routing delivers SMS under 3s.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 text-center space-y-3 shadow-xl">
              <CreditCard className="w-8 h-8 text-[#D4AF6A] mx-auto" />
              <h3 className="text-xs font-bold text-white">Affordable Pricing</h3>
              <p className="text-[11px] text-[#AEB4BC]">Rates starting at GHS 0.04 / SMS.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 text-center space-y-3 shadow-xl">
              <Smartphone className="w-8 h-8 text-[#D4AF6A] mx-auto" />
              <h3 className="text-xs font-bold text-white">Easy Dashboard</h3>
              <p className="text-[11px] text-[#AEB4BC]">Intuitive mobile-first dashboard layout.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 text-center space-y-3 shadow-xl">
              <PhoneCall className="w-8 h-8 text-[#D4AF6A] mx-auto" />
              <h3 className="text-xs font-bold text-white">Local Support</h3>
              <p className="text-[11px] text-[#AEB4BC]">Dedicated customer support team in Ghana.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 text-center space-y-3 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-[#D4AF6A] mx-auto" />
              <h3 className="text-xs font-bold text-white">Secure Platform</h3>
              <p className="text-[11px] text-[#AEB4BC]">Encrypted JWT auth & data privacy protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. API Section for Developers */}
      <section id="api" className="py-20 bg-[#14171D] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#2A3038]/80 border border-[rgba(212,175,106,0.3)] rounded-3xl p-8 shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(212,175,106,0.15)] pb-6">
              <div>
                <span className="bg-[#D4AF6A]/20 text-[#D4AF6A] border border-[#D4AF6A]/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  Developer Portal
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2">REST API Integration Guide</h2>
                <p className="text-xs text-[#AEB4BC]">Integrate bulk SMS sending into your app or website in under 2 minutes.</p>
              </div>

              <Link
                to="/register"
                className="bg-[#D4AF6A] text-black font-extrabold text-xs px-5 py-3 rounded-xl flex items-center space-x-2 shrink-0"
              >
                <Code2 className="w-4 h-4" />
                <span>Generate API Key</span>
              </Link>
            </div>

            {/* Sample cURL Code Block */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#AEB4BC] uppercase tracking-wider">Sample cURL Request</span>
              <div className="bg-[#101318] border border-[rgba(212,175,106,0.2)] rounded-2xl p-4 font-mono text-xs text-[#D4AF6A] overflow-x-auto leading-relaxed">
                <code>
                  curl -X POST https://fasreach.com/api/v1/sms/send \<br />
                  &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;-d '&#123;"senderId": "YOURBRAND", "recipientPhone": "0241112233", "content": "Your OTP code is 8849"&#125;'
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-20 bg-[#1A1D24] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Frequently Asked <span className="text-[#D4AF6A]">Questions (FAQ)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">Find quick answers to common questions about FasReach.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl overflow-hidden shadow-lg">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left text-xs sm:text-sm font-bold text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-[#D4AF6A] transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-[#AEB4BC] border-t border-[rgba(212,175,106,0.1)] pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact Section */}
      <section id="contact" className="py-20 bg-[#14171D] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Get in Touch with <span className="text-[#D4AF6A]">Our Team</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">Have questions or need custom enterprise pricing? We are here to help.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Action Contact Cards */}
            <div className="space-y-4">
              <a
                href="https://wa.me/233240001122"
                target="_blank"
                rel="noreferrer"
                className="bg-[#2A3038]/70 border border-emerald-500/30 p-6 rounded-3xl flex items-center space-x-4 hover:bg-emerald-500/10 transition-all shadow-xl block"
              >
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">WhatsApp Support</h3>
                  <p className="text-xs text-[#AEB4BC]">Chat with us instantly on WhatsApp</p>
                </div>
              </a>

              <a
                href="mailto:support@fasreach.com"
                className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] p-6 rounded-3xl flex items-center space-x-4 hover:border-[#D4AF6A]/50 transition-all shadow-xl block"
              >
                <div className="w-12 h-12 bg-[#D4AF6A]/10 text-[#D4AF6A] rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Email Support</h3>
                  <p className="text-xs text-[#AEB4BC]">support@fasreach.com</p>
                </div>
              </a>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-2 bg-[#2A3038]/70 border border-[rgba(212,175,106,0.3)] rounded-3xl p-8 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#D4AF6A]" /> Send Us a Message
              </h3>

              {contactSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Thank you! Your message has been sent. Our team will contact you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#AEB4BC] mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="John Mensah"
                        className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#AEB4BC] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3.5 py-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#AEB4BC] mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="0241112233"
                      className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3.5 py-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#AEB4BC] mb-1">Your Message</label>
                    <textarea
                      rows="4"
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us about your organization or custom SMS requirements..."
                      className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-extrabold text-xs py-3 rounded-xl shadow-lg"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-[#101318] border-t border-[rgba(212,175,106,0.15)] py-12 text-xs text-[#AEB4BC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="FasReach" className="w-9 h-9 rounded-xl object-cover border border-[#D4AF6A]/40" />
            <div>
              <span className="font-bold text-white text-sm">Fas<span className="text-[#D4AF6A]">Reach</span> Platform</span>
              <p className="text-[10px] text-[#AEB4BC]">© 2026 FasReach. All rights reserved.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#api" className="hover:text-white transition-colors">API Docs</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="text-[#D4AF6A] font-bold hover:underline">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
