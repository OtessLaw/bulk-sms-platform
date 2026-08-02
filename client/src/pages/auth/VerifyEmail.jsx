import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ShieldCheck, ArrowLeft, RefreshCw, ArrowRight } from 'lucide-react';
import API from '../../services/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(60);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, countdown]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/verify-email', { email, code: verificationCode });
      toast.success('Email verified successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendDisabled(true);
      await API.post('/auth/resend-verification', { email });
      toast.success('Verification code resent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code.');
      setResendDisabled(false);
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
          <h1 className="text-2xl font-extrabold text-white tracking-wider">Verify Your Email</h1>
          <p className="text-xs text-[#AEB4BC]">We sent a 6-digit code to your email & phone number</p>
          {email && (
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF6A]" />
              <span className="text-sm font-medium text-white">{email}</span>
            </div>
          )}
          <div className="bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 rounded-xl p-2.5 text-[11px] text-[#D4AF6A] text-center font-medium mt-2 leading-relaxed">
            💡 <strong>Tip:</strong> If not in Inbox, check your <strong>Spam / Promotions</strong> folder, or check your phone SMS!
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-between space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl text-xl font-bold text-white focus:outline-none focus:border-[#D4AF6A] transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-bold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex flex-col items-center space-y-3 pt-4 border-t border-[rgba(212,175,106,0.1)]">
          <button
            onClick={handleResend}
            disabled={resendDisabled}
            className="flex items-center space-x-1.5 text-xs text-[#D4AF6A] hover:text-[#E7D3A4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resendDisabled ? 'animate-spin' : ''}`} />
            <span>
              {resendDisabled ? `Resend Code in ${countdown}s` : 'Resend Code'}
            </span>
          </button>

          <Link to="/login" className="text-xs text-[#AEB4BC] hover:text-white transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
