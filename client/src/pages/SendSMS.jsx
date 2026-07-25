import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Send, Smartphone, Bot } from 'lucide-react';

export default function SendSMS() {
  const { wallet, refreshWallet } = useAuth();
  const [activeTab, setActiveTab] = useState('single');
  const [senderIds, setSenderIds] = useState([]);
  const [selectedSenderId, setSelectedSenderId] = useState('BULKSMS');
  const [recipient, setRecipient] = useState('');
  const [bulkRecipients, setBulkRecipients] = useState('');
  const [content, setContent] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiCategory, setAiCategory] = useState('Marketing');
  const [aiKeywords, setAiKeywords] = useState('Weekend Sale');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

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
      console.error('Error fetching Sender IDs', err);
    }
  };

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const res = await API.post('/sms/ai-templates', { category: aiCategory, keywords: aiKeywords });
      if (res.data.success) {
        setAiSuggestions(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to generate AI templates');
    } finally {
      setAiLoading(false);
    }
  };

  const isUnicode = !/^[\n\r a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?£¥èéùìòÇØøÅåΔΦΓΛΩΠΨΣΘΞÆæßÉäöñüàäÖÑÜ§à]*$/.test(content);
  const charCount = content.length;
  let unitsPerMsg = 1;
  if (isUnicode) {
    unitsPerMsg = charCount <= 70 ? 1 : Math.ceil(charCount / 67);
  } else {
    unitsPerMsg = charCount <= 160 ? 1 : Math.ceil(charCount / 153);
  }

  const recipientList = activeTab === 'single'
    ? (recipient ? [recipient] : [])
    : bulkRecipients.split(/[\n,]+/).map((r) => r.trim()).filter((r) => r.length > 0);

  const totalRecipients = recipientList.length;
  const totalUnits = totalRecipients * unitsPerMsg;
  const totalCost = (totalUnits * 0.04).toFixed(2);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content) {
      toast.error('SMS message content cannot be empty');
      return;
    }

    if (totalRecipients === 0) {
      toast.error('Please enter at least one recipient phone number');
      return;
    }

    if ((wallet?.smsCredit || 0) < totalUnits) {
      toast.error(`Insufficient credits. Required: ${totalUnits} units. Please top up.`);
      return;
    }

    setLoading(true);
    try {
      let res;
      if (activeTab === 'single') {
        res = await API.post('/sms/send', {
          senderId: selectedSenderId,
          recipientPhone: recipient,
          content,
        });
      } else {
        res = await API.post('/sms/bulk', {
          senderId: selectedSenderId,
          recipients: recipientList,
          content,
          campaignTitle: campaignTitle || 'Bulk SMS Dispatch',
        });
      }

      if (res.data.success) {
        toast.success(res.data.message || 'SMS sent successfully!');
        setContent('');
        setRecipient('');
        setBulkRecipients('');
        setCampaignTitle('');
        await refreshWallet();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch SMS');
    } finally {
      setLoading(false);
    }
  };

  const insertTag = (tag) => {
    setContent((prev) => `${prev}${tag}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Send SMS Gateway</h1>
          <p className="text-xs text-[#AEB4BC]">Compose and broadcast instant or scheduled SMS messages with AI templates</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] text-[#D4AF6A] font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-md"
          >
            <Bot className="w-4 h-4" />
            <span>AI Template Generator</span>
          </button>

          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.2)] p-1 rounded-2xl flex space-x-1">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'single' ? 'bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black' : 'text-[#AEB4BC]'
              }`}
            >
              Single SMS
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'bulk' ? 'bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black' : 'text-[#AEB4BC]'
              }`}
            >
              Bulk SMS Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-5">
          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-2">
                Select Sender ID
              </label>
              <select
                value={selectedSenderId}
                onChange={(e) => setSelectedSenderId(e.target.value)}
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF6A]"
              >
                <option value="BULKSMS">BULKSMS (Default System ID)</option>
                {senderIds.map((s) => (
                  <option key={s._id} value={s.senderId}>
                    {s.senderId} (Approved Custom ID)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider mb-2">
                {activeTab === 'single' ? 'Recipient Phone Number' : 'Recipients (Comma or line separated)'}
              </label>
              {activeTab === 'single' ? (
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="+233240001122"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF6A]"
                />
              ) : (
                <textarea
                  rows="4"
                  required
                  value={bulkRecipients}
                  onChange={(e) => setBulkRecipients(e.target.value)}
                  placeholder="+233240001122, +233544556677, +233277889900"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#D4AF6A]"
                />
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#AEB4BC]">Insert Tag:</span>
              <button
                type="button"
                onClick={() => insertTag(' {first_name} ')}
                className="bg-[#1E232B] border border-[rgba(212,175,106,0.2)] text-[11px] text-[#D4AF6A] px-2.5 py-1 rounded-lg font-mono"
              >
                {'{first_name}'}
              </button>
              <button
                type="button"
                onClick={() => insertTag(' {company} ')}
                className="bg-[#1E232B] border border-[rgba(212,175,106,0.2)] text-[11px] text-[#D4AF6A] px-2.5 py-1 rounded-lg font-mono"
              >
                {'{company}'}
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#AEB4BC] uppercase tracking-wider">
                  SMS Message Body
                </label>
                <div className="text-xs text-[#AEB4BC]">
                  <span className="text-[#D4AF6A] font-bold">{charCount}</span> chars •{' '}
                  <span className="text-white font-bold">{unitsPerMsg}</span> SMS parts
                </div>
              </div>
              <textarea
                rows="5"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Dispatching SMS Gateway...' : 'Send Message Now'}</span>
            </button>
          </form>
        </div>

        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-[#AEB4BC] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#D4AF6A]" /> Live Delivery Preview
          </h3>

          <div className="w-64 h-[440px] bg-[#1E232B] border-4 border-[#2A3038] rounded-[40px] shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="w-24 h-4 bg-[#2A3038] rounded-b-xl mx-auto mb-4"></div>
            <div className="flex-1 overflow-y-auto space-y-3 px-1">
              <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.25)] rounded-2xl rounded-tl-none p-3 shadow-lg">
                <p className="text-xs text-white leading-relaxed break-words">
                  {content || 'Your message preview will render live here as you type into the composer...'}
                </p>
              </div>
            </div>
            <div className="w-20 h-1 bg-[#AEB4BC]/30 rounded-full mx-auto mt-2"></div>
          </div>
        </div>
      </div>

      {showAIModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(212,175,106,0.15)] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#D4AF6A]" /> AI SMS Template Generator
              </h3>
              <button onClick={() => setShowAIModal(false)} className="text-xs text-[#AEB4BC]">✕</button>
            </div>

            <form onSubmit={handleGenerateAI} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#AEB4BC] mb-1">Category</label>
                  <select
                    value={aiCategory}
                    onChange={(e) => setAiCategory(e.target.value)}
                    className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Transactional">Transactional</option>
                    <option value="OTP">OTP Verification</option>
                    <option value="Event">Event Invite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#AEB4BC] mb-1">Keywords</label>
                  <input
                    type="text"
                    value={aiKeywords}
                    onChange={(e) => setAiKeywords(e.target.value)}
                    placeholder="Weekend Discount"
                    className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={aiLoading}
                className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold py-2 rounded-xl text-xs"
              >
                {aiLoading ? 'Generating AI Suggestions...' : 'Generate Templates'}
              </button>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {aiSuggestions.map((tpl, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setContent(tpl);
                    setShowAIModal(false);
                    toast.success('Template loaded into composer!');
                  }}
                  className="p-3 bg-[#1E232B] border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] rounded-xl text-xs text-white cursor-pointer transition-all"
                >
                  <p>{tpl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
