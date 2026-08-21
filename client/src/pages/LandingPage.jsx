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
  Check,
  ArrowRight,
  Clock,
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Building2,
  Church,
  GraduationCap,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const [calculatorUnits, setCalculatorUnits] = useState(2500);
  const costPerSms = 0.04;
  const estimatedCost = (calculatorUnits * costPerSms).toFixed(2);
  const [openFaq, setOpenFaq] = useState(0);

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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How much does SMS cost on FasReach?',
      a: 'Flat pricing of GHS 0.04 per SMS. You can top up any amount via Mobile Money starting at GHS 1.00.',
    },
    {
      q: 'Do my SMS credits or funds expire?',
      a: 'No. Your wallet cash balance and SMS credits never expire. You use them whenever you need.',
    },
    {
      q: 'How do custom Sender IDs work?',
      a: 'You can register your own Sender ID (e.g. YOURBRAND, MYCHURCH, or MYSCHOOL) directly from your dashboard for instant delivery.',
    },
    {
      q: 'Which mobile networks in Ghana are supported?',
      a: 'FasReach delivers directly to MTN Ghana, Telecel (Vodafone), and AT (AirtelTigo) numbers across Ghana.',
    },
    {
      q: 'How do developers send SMS via API?',
      a: 'You can generate a secure API key in your account settings and send SMS with a simple HTTP POST request to our API endpoints.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0E1117] text-white font-sans selection:bg-[#D4AF6A] selection:text-black">
      {/* Top Announcement Bar */}
      <div className="bg-[#1A1F29] border-b border-white/5 py-2 text-center text-xs text-[#AEB4BC]">
        <span className="inline-flex items-center space-x-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>FasReach Platform v2.0 is live across MTN, Telecel, and AT networks.</span>
          <Link to="/register" className="text-[#D4AF6A] font-bold hover:underline ml-1">
            Get 10 Free SMS Credits →
          </Link>
        </span>
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#0E1117]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="FasReach Logo" className="w-9 h-9 rounded-xl object-cover border border-[#D4AF6A]/50" />
            <span className="text-xl font-bold tracking-tight text-white">
              Fas<span className="text-[#D4AF6A]">Reach</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-[#AEB4BC]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#developers" className="hover:text-white transition-colors">Developers</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-xs font-medium text-[#AEB4BC] hover:text-white px-3 py-2 transition-colors">
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-[#D4AF6A] hover:bg-[#E7D3A4] text-black font-bold text-xs px-4 py-2 rounded-xl transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section - Clean & Direct */}
      <section className="pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Send Bulk SMS to Any Phone in Ghana.
              </h1>

              <p className="text-base sm:text-lg text-[#AEB4BC] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Reliable message delivery for businesses, churches, schools, and developers. Pay GHS 0.04 per SMS with Mobile Money deposit and zero monthly subscriptions.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-[#D4AF6A] hover:bg-[#E7D3A4] text-black font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                  <span>Start Sending SMS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#pricing"
                  className="w-full sm:w-auto bg-[#1A1F29] hover:bg-[#222834] text-white border border-white/10 text-sm font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center transition-all"
                >
                  Calculate Pricing
                </a>
              </div>

              {/* Trust Bullet Features */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#AEB4BC]">
                <span className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#D4AF6A]" />
                  <span>MTN, Telecel & AT Supported</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#D4AF6A]" />
                  <span>Custom Sender IDs</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#D4AF6A]" />
                  <span>No Setup Fees</span>
                </span>
              </div>
            </div>

            {/* Right App UI Mockup - Clean Realistic Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-[#AEB4BC]">FasReach Console</span>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#0E1117] p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#AEB4BC]">Sender ID</span>
                      <span className="font-bold text-[#D4AF6A]">FASREACH</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#AEB4BC]">Recipients</span>
                      <span className="font-mono text-white">1,450 numbers</span>
                    </div>
                    <div className="text-xs text-white bg-[#1A1F29] p-3 rounded-lg border border-white/5 font-mono">
                      "Good day! Sunday service starts at 9:00 AM. Join us live or at the main auditorium."
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#0E1117] p-3 rounded-xl border border-white/5">
                      <span className="text-[#AEB4BC] block text-[10px]">Delivery Rate</span>
                      <span className="text-emerald-400 font-bold font-mono text-sm">99.8% Delivered</span>
                    </div>
                    <div className="bg-[#0E1117] p-3 rounded-xl border border-white/5">
                      <span className="text-[#AEB4BC] block text-[10px]">Dispatch Cost</span>
                      <span className="text-[#D4AF6A] font-bold font-mono text-sm">GHS 58.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Solutions for Ghanaian Use-Cases */}
      <section id="solutions" className="py-20 bg-[#12161F] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built for Every Organization in Ghana
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">
              Whether you run a church, school, retail shop, or software platform, FasReach gets your messages delivered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 space-y-3">
              <Church className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Churches & Ministries</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Send weekly service reminders, event invitations, devotionals, and dues notifications to congregation members.
              </p>
            </div>

            <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 space-y-3">
              <GraduationCap className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Schools & Institutions</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Notify parents about fee reminders, terminal reports, PTA meetings, and urgent school announcements.
              </p>
            </div>

            <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 space-y-3">
              <ShoppingBag className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Shops & E-Commerce</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Send order status updates, delivery alerts, discount codes, and customer payment receipts instantly.
              </p>
            </div>

            <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 space-y-3">
              <Code2 className="w-6 h-6 text-[#D4AF6A]" />
              <h3 className="text-base font-bold text-white">Developers & Apps</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Integrate 2FA OTP verification, transactional receipts, and alert triggers directly into your software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Section - Clean & Readable */}
      <section id="features" className="py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Platform Features
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">Everything you need to manage your contacts and messaging campaigns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1F29] border border-white/10 flex items-center justify-center text-[#D4AF6A]">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Instant & Scheduled SMS</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Send single messages or broadcast bulk campaigns immediately. You can also pick a future date and time for automatic dispatch.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1F29] border border-white/10 flex items-center justify-center text-[#D4AF6A]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Excel & CSV Contact Import</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Upload your phone lists directly from Excel spreadsheets or CSV files. Organize contacts into custom groups for targeted messaging.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1F29] border border-white/10 flex items-center justify-center text-[#D4AF6A]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Custom Branded Sender IDs</h3>
              <p className="text-xs text-[#AEB4BC] leading-relaxed">
                Request your official business or church name as your Sender ID so recipients see your brand name instead of a random number.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing Calculator - Clean Slider */}
      <section id="pricing" className="py-20 bg-[#12161F] border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xs sm:text-sm text-[#AEB4BC]">
              No hidden fees, no monthly subscriptions. Pay GHS 0.04 per SMS with Mobile Money deposit starting at GHS 1.00.
            </p>
          </div>

          <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#AEB4BC] font-medium">SMS Messages:</span>
              <span className="text-lg font-bold text-[#D4AF6A] font-mono">{calculatorUnits.toLocaleString()} SMS</span>
            </div>

            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={calculatorUnits}
              onChange={(e) => setCalculatorUnits(Number(e.target.value))}
              className="w-full h-2 bg-[#0E1117] rounded-lg appearance-none cursor-pointer accent-[#D4AF6A]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-center">
              <div className="bg-[#0E1117] p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#AEB4BC] block">Cost Per SMS</span>
                <span className="text-sm font-bold text-white font-mono">GHS 0.04</span>
              </div>
              <div className="bg-[#0E1117] p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#AEB4BC] block">SMS Messages</span>
                <span className="text-sm font-bold text-white font-mono">{calculatorUnits.toLocaleString()}</span>
              </div>
              <div className="bg-[#D4AF6A] text-black p-4 rounded-xl font-bold">
                <span className="text-[10px] uppercase block opacity-80">Total Cost</span>
                <span className="text-xl font-mono">GHS {estimatedCost}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="py-20 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#161B22] border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left text-xs font-bold text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-[#D4AF6A] transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#AEB4BC] border-t border-white/5 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            {contactInfo.whatsapp && (
              <a
                href={`https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#161B22] text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 hover:border-emerald-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Support</span>
              </a>
            )}

            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="bg-[#161B22] text-white border border-white/10 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 hover:border-white/20 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF6A]" />
                <span>Call {contactInfo.phone}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E1117] py-10 text-xs text-[#AEB4BC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="FasReach" className="w-8 h-8 rounded-lg object-cover border border-[#D4AF6A]/50" />
            <div>
              <span className="font-bold text-white block">FasReach Platform</span>
              <span className="text-[10px] text-[#AEB4BC] block">{contactInfo.address || 'Accra, Ghana'}</span>
            </div>
          </div>

          <div className="flex space-x-6 text-[11px]">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#solutions" className="hover:text-white">Solutions</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <Link to="/login" className="hover:text-white">Log In</Link>
            <Link to="/register" className="text-[#D4AF6A] font-bold">Create Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
