import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Send, Clock, Sparkles, Smartphone, Users, HelpCircle, Calendar } from 'lucide-react';

export default function SendSMS() {
  const { wallet, refreshWallet } = useAuth();
  const [senderIds, setSenderIds] = useState([]);
  const [formData, setFormData] = useState({
    senderId: 'FASREACH',
    recipientPhone: '',
    content: '',
    scheduledFor: '',
  });
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    fetchSenderIds();
  }, []);

  const fetchSenderIds = async () => {
    try {
      const res = await API.get('/sender-ids');
      if (res.data.success) {
        setSenderIds(res.data.data.filter((s) => s.status === 'Approved'));
      }
    } catch (err) {
      console.error('Failed to load sender IDs', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.recipientPhone || !formData.content) {
      toast.error('Recipient phone and message content are required');
      return;
    }

    if (isScheduleEnabled && !formData.scheduledFor) {
      toast.error('Please select a future date and time for scheduling');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        scheduledFor: isScheduleEnabled ? formData.scheduledFor : null,
      };

      const res = await API.post('/sms/send', payload);
      if (res.data.success) {
        toast.success(res.data.message || 'SMS dispatched successfully!');
        setFormData({ senderId: 'FASREACH', recipientPhone: '', content: '', scheduledFor: '' });
        setIsScheduleEnabled(false);
        await refreshWallet();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Dispatch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAi = async () => {
    if (!aiPrompt) {
      toast.error('Please enter a brief topic or prompt for AI');
      return;
    }
    setGeneratingAi(true);
    try {
      const res = await API.post('/sms/ai-templates', { category: 'Marketing', keywords: [aiPrompt] });
      if (res.data.success && res.data.data?.length > 0) {
        setFormData({ ...formData, content: res.data.data[0].content });
        toast.success('AI Template generated!');
      }
    } catch (err) {
      toast.error('AI Generation failed');
    } finally {
      setGeneratingAi(false);
    }
  };

  const smsUnits = Math.ceil(formData.content.length / 160) || 1;
  const totalCost = (smsUnits * 0.04).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Send Single & Scheduled SMS</h1>
        <p className="text-xs text-[#AEB4BC]">Compose immediate or scheduled SMS broadcasts with AI templates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SMS Composer Form */}
        <div className="lg:col-span-2 bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-4">
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Sender ID Header</label>
              <select
                value={formData.senderId}
                onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
              >
                <option value="FASREACH">FASREACH (Default Platform Header)</option>
                {senderIds.map((s) => (
                  <option key={s._id} value={s.senderId}>
                    {s.senderId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AEB4BC] mb-1">Recipient Phone Number</label>
              <input
                type="text"
                required
                value={formData.recipientPhone}
                onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                placeholder="e.g. 0241112233 or +233241112233"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>

            {/* AI Generator Helper Box */}
            <div className="bg-[#1E232B]/60 border border-[rgba(212,175,106,0.15)] rounded-2xl p-3 space-y-2">
              <span className="text-[11px] font-bold text-[#D4AF6A] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Template Generator
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. 20% Discount Sale announcement"
                  className="flex-1 bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleGenerateAi}
                  disabled={generatingAi}
                  className="bg-[#D4AF6A] text-black font-bold text-[11px] px-3 py-1.5 rounded-xl shrink-0"
                >
                  {generatingAi ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#AEB4BC]">SMS Message Content</label>
                <span className="text-[10px] text-[#D4AF6A] font-mono">
                  {formData.content.length} chars ({smsUnits} unit)
                </span>
              </div>
              <textarea
                rows="4"
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Type your SMS message here..."
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>

            {/* SMS Scheduling Toggle & DateTime Picker */}
            <div className="bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF6A]" /> Schedule for Later Dispatch
                </span>
                <input
                  type="checkbox"
                  checked={isScheduleEnabled}
                  onChange={(e) => setIsScheduleEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF6A] cursor-pointer"
                />
              </div>

              {isScheduleEnabled && (
                <div className="pt-2 border-t border-[rgba(212,175,106,0.15)] space-y-1">
                  <label className="block text-[11px] font-semibold text-[#AEB4BC]">Select Future Dispatch Date & Time</label>
                  <input
                    type="datetime-local"
                    required={isScheduleEnabled}
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    className="w-full bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF6A]"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {isScheduleEnabled ? <Clock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{loading ? 'Processing...' : isScheduleEnabled ? 'Schedule SMS Broadcast' : 'Send SMS Instantly'}</span>
            </button>
          </form>
        </div>

        {/* Live Device Simulator Preview */}
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col items-center">
          <span className="text-xs font-bold text-[#D4AF6A] flex items-center gap-1">
            <Smartphone className="w-4 h-4" /> Live Mobile Simulator
          </span>

          <div className="w-64 h-[380px] bg-black border-4 border-[#3A404A] rounded-[36px] p-3 flex flex-col justify-between shadow-2xl relative">
            <div className="w-20 h-4 bg-[#3A404A] rounded-full mx-auto mb-2" />

            <div className="flex-1 bg-[#1A1D24] rounded-2xl p-3 flex flex-col space-y-2 overflow-y-auto">
              <div className="text-[10px] text-center text-[#AEB4BC] font-mono">{formData.senderId || 'FASREACH'}</div>
              {formData.content ? (
                <div className="bg-[#D4AF6A] text-black p-2.5 rounded-2xl text-[11px] font-sans leading-snug self-end max-w-[85%] shadow-md">
                  {formData.content}
                </div>
              ) : (
                <div className="text-[10px] text-[#AEB4BC] italic text-center my-auto">
                  Type a message on the left to see live mobile preview...
                </div>
              )}
            </div>

            <div className="mt-2 text-center text-[10px] text-[#AEB4BC]">
              Cost: <span className="text-[#D4AF6A] font-bold">GHS {totalCost}</span> ({smsUnits} unit)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
