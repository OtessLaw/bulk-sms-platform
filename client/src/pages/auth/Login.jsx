import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);

      if (res?.needsVerification || res?.data?.needsVerification) {
        toast.error('Please verify your email address to complete sign in.');
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }

      const userRole = res?.data?.user?.role || res?.user?.role || res?.data?.role;
      const hostname = window.location.hostname.toLowerCase();
      toast.success('Welcome back to FasReach!');

      if (['Super Admin', 'Admin'].includes(userRole)) {
        navigate('/admin');
      } else if (hostname.startsWith('sms.')) {
        navigate('/send-sms');
      } else if (hostname.startsWith('voice.')) {
        navigate('/voice-sms');
      } else {
        navigate('/products');
      }
    } catch (err) {
      if (err.message === 'Network Error' || !err.response) {
        toast.error('Connecting to FasReach server... Please wait a few seconds while the server wakes up and try again.');
      } else {
        const errMsg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E232B] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Top Left Back to Home Button - Compact Floating Pill */}
      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center space-x-1.5 text-[11px] font-semibold text-[#AEB4BC] hover:text-[#D4AF6A] bg-[#2A3038]/80 hover:bg-[#2A3038] border border-[rgba(212,175,106,0.2)] px-3 py-1.5 rounded-xl backdrop-blur-md transition-all z-20 group shadow-md"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF6A] group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>

      {/* Dynamic Background Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D4AF6A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#B88E3E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Content */}
      <div className="w-full max-w-md bg-[#2A3038]/90 backdrop-blur-xl border border-[rgba(212,175,106,0.25)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative z-10 mt-12 sm:mt-0 mb-6">
        <div className="text-center space-y-1.5">
          <img src="/logo.jpg" alt="FasReach Logo" className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mx-auto object-cover border-2 border-[#D4AF6A]/50 shadow-2xl" />
          <h1 className="text-2xl font-extrabold text-white tracking-wider">FasReach</h1>
          <p className="text-xs text-[#AEB4BC]">Enterprise Bulk SMS & Messaging Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D4AF6A] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF6A] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D4AF6A] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF6A] transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-[11px] text-[#D4AF6A] hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-bold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

          <div className="text-center text-xs text-[#AEB4BC] pt-2 border-t border-[rgba(212,175,106,0.1)]">
            Don't have a FasReach account?{' '}
            <Link to="/register" className="text-[#D4AF6A] font-bold hover:underline">
              Register (+10 Free SMS Credits)
            </Link>
          </div>
        </div>
    </div>
  );
}
