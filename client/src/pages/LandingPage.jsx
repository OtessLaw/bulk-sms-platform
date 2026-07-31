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
} from 'lucide-react';

export default function LandingPage() {
  const [calculatorUnits, setCalculatorUnits] = useState(1000);
  const costPerSms = 0.04;
  const estimatedCost = (calculatorUnits * costPerSms).toFixed(2);
  const [openFaq, setOpenFaq] = useState(null);

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
      a: 'SMS starts at GHS 0.04 per message. You can top up any amount via Mobile Money starting at GHS 1.00.',
    },
    {
      q: 'Do my unused SMS credits or funds expire?',
      a: 'No, your wallet cash balance and SMS credits never expire.',
    },
    {
      q: 'Can I send custom branded Sender IDs?',
      a: 'Yes, you can register custom Sender IDs (e.g. YOURBRAND) for instant auto-approval.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#14171D] text-white font-sans overflow-x-hidden selection:bg-[#D4AF6A] selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1E232B]/90 backdrop-blur-xl border-b border-[rgba(212,175,106,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="FasReach" className="w-10 h-10 rounded-2xl object-cover border border-[#D4AF6A]/50 shadow-lg" />
            <span className="text-xl font-black text-white">
              Fas<span className="text-[#D4AF6A]">Reach</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-[#AEB4BC]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <Link to="/login" className="text-[11px] sm:text-xs font-semibold text-[#AEB4BC] hover:text-[#D4AF6A] px-2 py-1.5 transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-[11px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-md hover:opacity-90 transition-all shrink-0"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Hero Copy */}
            <div className="space-y-5 text-center lg:text-left">
              <span className="inline-flex items-center space-x-2 bg-[#2A3038] border border-[rgba(212,175,106,0.3)] px-3.5 py-1 rounded-full text-xs font-semibold text-[#D4AF6A]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ghana's Fast & Reliable Bulk SMS Platform</span>
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Fast, Reliable Bulk SMS for <span className="text-[#D4AF6A]">Businesses in Ghana</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#AEB4BC] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Reach thousands of clients across MTN, Telecel, and AT networks in seconds at 0.04 GHS per SMS.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-extrabold text-xs px-7 py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-xl hover:opacity-90"
                >
                  <span>Start Sending SMS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#pricing"
                  className="w-full sm:w-auto bg-[#2A3038] text-white border border-[rgba(212,175,106,0.3)] font-bold text-xs px-7 py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-md"
                >
                  <span>View Pricing</span>
                </a>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="bg-[#2A3038]/80 border border-[rgba(212,175,106,0.3)] rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[rgba(212,175,106,0.15)] pb-2 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-[#D4AF6A]" /> Instant SMS Dispatcher
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  99.9% High Delivery
                </span>
              </div>

              <div className="space-y-2 text-xs bg-[#1E232B] p-3 rounded-2xl border border-[rgba(212,175,106,0.15)]">
                <div className="flex justify-between">
                  <span className="text-[#AEB4BC]">Sender ID:</span>
                  <span className="font-bold text-[#D4AF6A]">FASREACH</span>
                </div>
                <div className="text-[#E7D3A4] pt-1">
                  "Dear Customer, your order #8849 is dispatched! Thank you for choosing FasReach."
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-[#AEB4BC]">Rate: <strong className="text-[#D4AF6A]">GHS 0.04 / SMS</strong></span>
                <span className="bg-[#D4AF6A] text-black font-bold px-3 py-1 rounded-lg text-[10px]">
                  Delivered Sub-Second ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features */}
      <section id="features" className="py-16 bg-[#1A1D24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Key Platform <span className="text-[#D4AF6A]">Features</span>
            </h2>
            <p className="text-xs text-[#AEB4BC]">Everything you need to send bulk messages quickly and efficiently.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-5 space-y-2">
              <Send className="w-5 h-5 text-[#D4AF6A]" />
              <h3 className="text-sm font-bold text-white">Bulk SMS Campaigns</h3>
              <p className="text-xs text-[#AEB4BC]">Broadcast promotional and transactional SMS to thousands of contacts in 1 click.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-5 space-y-2">
              <Users className="w-5 h-5 text-[#D4AF6A]" />
              <h3 className="text-sm font-bold text-white">Contact & Excel Upload</h3>
              <p className="text-xs text-[#AEB4BC]">Import Excel and CSV contact files effortlessly with custom group segments.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-5 space-y-2">
              <Clock className="w-5 h-5 text-[#D4AF6A]" />
              <h3 className="text-sm font-bold text-white">SMS Scheduling</h3>
              <p className="text-xs text-[#AEB4BC]">Set future dates and times for automatic background message dispatch.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-5 space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#D4AF6A]" />
              <h3 className="text-sm font-bold text-white">Custom Sender IDs</h3>
              <p className="text-xs text-[#AEB4BC]">Brand your messages with your company header for instant recognition.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-5 space-y-2">
              <Code2 className="w-5 h-5 text-[#D4AF6A]" />
              <h3 className="text-sm font-bold text-white">Developer REST API</h3>
              <p className="text-xs text-[#AEB4BC]">Integrate SMS capabilities programmatically into your app or website in minutes.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-5 space-y-2">
              <Zap className="w-5 h-5 text-[#D4AF6A]" />
              <h3 className="text-sm font-bold text-white">Real-Time Delivery Reports</h3>
              <p className="text-xs text-[#AEB4BC]">Track message statuses live with network delivery receipts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing */}
      <section id="pricing" className="py-16 bg-[#14171D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Affordable <span className="text-[#D4AF6A]">Pricing</span>
            </h2>
            <p className="text-xs text-[#AEB4BC]">Pay as you go at 0.04 GHS / SMS. Minimum MoMo deposit GHS 1.00.</p>
          </div>

          <div className="bg-[#2A3038]/80 border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#AEB4BC]">SMS Messages:</span>
              <span className="text-[#D4AF6A] font-mono text-base">{calculatorUnits.toLocaleString()} SMS</span>
            </div>

            <input
              type="range"
              min="100"
              max="50000"
              step="500"
              value={calculatorUnits}
              onChange={(e) => setCalculatorUnits(Number(e.target.value))}
              className="w-full h-2 bg-[#1E232B] rounded-lg appearance-none cursor-pointer accent-[#D4AF6A]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-[#1E232B] p-3.5 rounded-2xl border border-[rgba(212,175,106,0.15)]">
                <span className="text-[10px] text-[#AEB4BC] block">Cost Per SMS</span>
                <span className="text-sm font-extrabold text-white font-mono">GHS 0.04</span>
              </div>
              <div className="bg-[#1E232B] p-3.5 rounded-2xl border border-[rgba(212,175,106,0.15)]">
                <span className="text-[10px] text-[#AEB4BC] block">Total Messages</span>
                <span className="text-sm font-extrabold text-white font-mono">{calculatorUnits.toLocaleString()}</span>
              </div>
              <div className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black p-3.5 rounded-2xl shadow-lg">
                <span className="text-[10px] font-bold block uppercase opacity-80">Estimated Cost</span>
                <span className="text-lg font-black font-mono">GHS {estimatedCost}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="py-16 bg-[#1A1D24]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How It Works in <span className="text-[#D4AF6A]">4 Easy Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-4 text-center space-y-2">
              <div className="w-8 h-8 bg-[#D4AF6A] text-black font-bold rounded-full flex items-center justify-center mx-auto text-xs">1</div>
              <h3 className="text-xs font-bold text-white">Create Account</h3>
              <p className="text-[11px] text-[#AEB4BC]">Sign up in 30 seconds.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-4 text-center space-y-2">
              <div className="w-8 h-8 bg-[#D4AF6A] text-black font-bold rounded-full flex items-center justify-center mx-auto text-xs">2</div>
              <h3 className="text-xs font-bold text-white">Add Contacts</h3>
              <p className="text-[11px] text-[#AEB4BC]">Upload Excel or CSV files.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-4 text-center space-y-2">
              <div className="w-8 h-8 bg-[#D4AF6A] text-black font-bold rounded-full flex items-center justify-center mx-auto text-xs">3</div>
              <h3 className="text-xs font-bold text-white">Compose Message</h3>
              <p className="text-[11px] text-[#AEB4BC]">Draft your SMS message.</p>
            </div>

            <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl p-4 text-center space-y-2">
              <div className="w-8 h-8 bg-[#D4AF6A] text-black font-bold rounded-full flex items-center justify-center mx-auto text-xs">4</div>
              <h3 className="text-xs font-bold text-white">Send & Track</h3>
              <p className="text-[11px] text-[#AEB4BC]">Dispatch & view live reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ & Contact */}
      <section id="faq" className="py-16 bg-[#14171D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Got Questions? <span className="text-[#D4AF6A]">We've Got Answers</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left text-xs font-bold text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-[#D4AF6A] transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#AEB4BC] border-t border-[rgba(212,175,106,0.1)] pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Live Dynamic Contact Buttons */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            {contactInfo.whatsapp && (
              <a
                href={`https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 hover:bg-emerald-500/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            )}

            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="w-full sm:w-auto bg-[#2A3038] text-white border border-[rgba(212,175,106,0.3)] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 hover:border-[#D4AF6A] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF6A]" />
                <span>Call {contactInfo.phone}</span>
              </a>
            )}

            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="w-full sm:w-auto bg-[#2A3038] text-[#D4AF6A] border border-[rgba(212,175,106,0.3)] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 hover:border-[#D4AF6A] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{contactInfo.email}</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101318] border-t border-[rgba(212,175,106,0.15)] py-8 text-xs text-[#AEB4BC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="FasReach" className="w-8 h-8 rounded-xl object-cover border border-[#D4AF6A]/40" />
            <div>
              <span className="font-bold text-white block">FasReach Enterprise Platform</span>
              <span className="text-[10px] text-[#AEB4BC] block">{contactInfo.address || 'Accra, Ghana'}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 text-[#AEB4BC]">
            {contactInfo.instagram && (
              <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors p-2 bg-[#1E232B] rounded-xl border border-[rgba(212,175,106,0.1)]">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {contactInfo.facebook && (
              <a href={contactInfo.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors p-2 bg-[#1E232B] rounded-xl border border-[rgba(212,175,106,0.1)]">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {contactInfo.twitter && (
              <a href={contactInfo.twitter} target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors p-2 bg-[#1E232B] rounded-xl border border-[rgba(212,175,106,0.1)]">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="flex space-x-6 text-[11px]">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <Link to="/login" className="hover:text-white">Sign In</Link>
            <Link to="/register" className="text-[#D4AF6A] font-bold">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
