import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, phone, password });
      toast.success('Account created! +250 free SMS credits added to your wallet.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E232B] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#2A3038]/80 backdrop-blur-xl border border-[rgba(212,175,106,0.3)] rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF6A] to-[#B88E3E] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,106,0.4)]">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#FFFFFF] via-[#E7D3A4] to-[#D4AF6A] bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-xs text-[#AEB4BC]">Get instant 250 free SMS credits upon signup</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#AEB4BC] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#AEB4BC] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#AEB4BC] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233240001122"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-1">Password</label>
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
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#AEB4BC]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#D4AF6A] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
