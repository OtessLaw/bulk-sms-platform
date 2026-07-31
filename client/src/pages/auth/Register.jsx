import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, User, Phone, ArrowRight, Gift, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success('Account created! 10 Free SMS credits bonus added!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E232B] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center space-x-2 text-xs font-semibold text-[#AEB4BC] hover:text-[#D4AF6A] bg-[#2A3038]/60 hover:bg-[#2A3038] border border-[rgba(212,175,106,0.2)] px-3.5 py-2 rounded-xl backdrop-blur-md transition-all z-20 group shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 text-[#D4AF6A] group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D4AF6A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#B88E3E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#2A3038]/80 backdrop-blur-xl border border-[rgba(212,175,106,0.25)] rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <img src="/logo.jpg" alt="FasReach Logo" className="w-16 h-16 rounded-2xl mx-auto object-cover border-2 border-[#D4AF6A]/50 shadow-2xl" />
          <h1 className="text-2xl font-extrabold text-white tracking-wider">Create FasReach Account</h1>
          <div className="bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 rounded-xl p-2 flex items-center justify-center space-x-2 text-xs text-[#D4AF6A] font-bold">
            <Gift className="w-4 h-4" />
            <span>Includes 10 FREE SMS Credits Bonus</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Full Name / Organization</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#D4AF6A] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D4AF6A] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#D4AF6A] absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0241112233"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-extrabold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 shadow-xl disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#AEB4BC] pt-2 border-t border-[rgba(212,175,106,0.1)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#D4AF6A] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
