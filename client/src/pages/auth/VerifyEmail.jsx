import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { checkAuth } = useAuth();

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

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const triggerVerification = async (fullCode) => {
    if (fullCode.length !== 6 || loading) return;
    setLoading(true);

    try {
      const res = await API.post('/auth/verify-email', { email, code: fullCode });
      
      if (res.data?.success) {
        setVerifiedSuccess(true);
        toast.success('Code verified successfully!');

        // If backend returned session token, automatically log user in & open account
        if (res.data.data?.token) {
          localStorage.setItem('accessToken', res.data.data.token);
          if (res.data.data.user) localStorage.setItem('cachedUser', JSON.stringify(res.data.data.user));
          if (res.data.data.wallet) localStorage.setItem('cachedWallet', JSON.stringify(res.data.data.wallet));

          await checkAuth();

          setTimeout(() => {
            const role = res.data.data.user?.role;
            if (['Super Admin', 'Admin'].includes(role)) {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          }, 1200);
        } else {
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      }
    } catch (err) {
      setLoading(false);
      setCode(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
      toast.error(err.response?.data?.message || 'Verification failed. Please check your code.');
    }
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto trigger verification when 6th digit is entered
    const combined = newCode.join('');
    if (combined.length === 6) {
      triggerVerification(combined);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pastedData.length >= 6) {
      const pastedArray = pastedData.slice(0, 6).split('');
      setCode(pastedArray);
      triggerVerification(pastedArray.join(''));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    triggerVerification(fullCode);
  };

  const handleResend = async () => {
    try {
      setResendDisabled(true);
      await API.post('/auth/resend-verification', { email });
      toast.success('Verification code resent to your email & phone!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code.');
      setResendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E232B] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Top Left Back to Home Button */}
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
      <div className="w-full max-w-md bg-[#2A3038]/90 backdrop-blur-xl border border-[rgba(212,175,106,0.25)] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 mt-12 sm:mt-0 mb-6">
        <div className="text-center space-y-2">
          <img src="/logo.jpg" alt="FasReach Logo" className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mx-auto object-cover border-2 border-[#D4AF6A]/50 shadow-2xl" />
          <h1 className="text-2xl font-extrabold text-white tracking-wider">Verify Your Account</h1>
          <p className="text-xs text-[#AEB4BC]">We sent a 6-digit security code to your email & SMS</p>
          {email && (
            <div className="inline-flex items-center justify-center space-x-2 bg-[#1E232B]/80 px-3 py-1 rounded-full border border-[rgba(212,175,106,0.15)] mt-1">
              <Mail className="w-3.5 h-3.5 text-[#D4AF6A]" />
              <span className="text-xs font-semibold text-white">{email}</span>
            </div>
          )}
        </div>

        {/* Dynamic State Container */}
        {verifiedSuccess ? (
          /* Success State - Green/Gold Sparkle Seal */
          <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#D4AF6A] to-[#E7D3A4] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(212,175,106,0.6)] animate-pulse">
                <CheckCircle2 className="w-10 h-10 text-black stroke-[2.5]" />
              </div>
              <Sparkles className="w-6 h-6 text-[#D4AF6A] absolute -top-2 -right-2 animate-bounce" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white tracking-wide">Account Verified!</h3>
              <p className="text-xs text-[#D4AF6A] animate-pulse">Opening your account dashboard...</p>
            </div>
          </div>
        ) : loading ? (
          /* Rotating Square Loading State */
          <div className="flex flex-col items-center justify-center py-8 space-y-5 animate-in fade-in duration-300">
            <div className="relative flex items-center justify-center">
              {/* Spinning Glow Square Container */}
              <div className="w-16 h-16 border-4 border-t-[#D4AF6A] border-r-transparent border-b-[#B88E3E] border-l-transparent rounded-2xl animate-spin shadow-[0_0_30px_rgba(212,175,106,0.4)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#D4AF6A] animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-white tracking-wider animate-pulse">Verifying Code...</p>
              <p className="text-[11px] text-[#AEB4BC]">Please hold on while we authenticate your session</p>
            </div>
          </div>
        ) : (
          /* Normal 6-Digit Code Input State */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between space-x-2" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center bg-[#1E232B] border border-[rgba(212,175,106,0.3)] focus:border-[#D4AF6A] rounded-2xl text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 transition-all shadow-inner"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || code.join('').length !== 6}
              className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-bold text-xs py-3 rounded-2xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,106,0.3)] transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <span>Verify & Open Account</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="flex flex-col items-center space-y-3 pt-4 border-t border-[rgba(212,175,106,0.1)]">
          <button
            onClick={handleResend}
            disabled={resendDisabled || loading || verifiedSuccess}
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
