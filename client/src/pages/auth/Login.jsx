import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

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
      await login(email, password);
      toast.success('Welcome back to Bulk SMS Enterprise!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      toast.success('Signed in as Demo User');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Demo authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E232B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF6A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#2A3038]/80 backdrop-blur-xl border border-[rgba(212,175,106,0.3)] rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF6A] to-[#B88E3E] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,106,0.4)]">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#FFFFFF] via-[#E7D3A4] to-[#D4AF6A] bg-clip-text text-transparent">
            BULKSMS SAAS
          </h1>
          <p className="text-xs text-[#AEB4BC]">Enterprise Reseller Gateway Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#AEB4BC] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bulksms.com"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#AEB4BC] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(212,175,106,0.3)] disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Seed Demo Logins */}
        <div className="border-t border-[rgba(212,175,106,0.15)] pt-4 space-y-2 text-center">
          <p className="text-[11px] font-semibold text-[#AEB4BC] uppercase tracking-wider">Quick Demo Login Shortcuts</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('admin@bulksms.com', 'AdminPass123!')}
              className="bg-[#1E232B] hover:bg-[#D4AF6A]/20 border border-[rgba(212,175,106,0.2)] text-[11px] text-[#D4AF6A] py-2 rounded-xl font-mono"
            >
              👑 Super Admin
            </button>
            <button
              onClick={() => handleDemoLogin('user@bulksms.com', 'UserPass123!')}
              className="bg-[#1E232B] hover:bg-[#D4AF6A]/20 border border-[rgba(212,175,106,0.2)] text-[11px] text-[#D4AF6A] py-2 rounded-xl font-mono"
            >
              👤 Regular User
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#AEB4BC]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#D4AF6A] font-semibold hover:underline">
            Register Account
          </Link>
        </p>
      </div>
    </div>
  );
}
