import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Send, Clock, Sparkles, Smartphone, Users, Calendar, Layers, FileSpreadsheet } from 'lucide-react';

export default function SendSMS() {
  const { refreshWallet } = useAuth();
  const [senderIds, setSenderIds] = useState([]);
  const [contactGroups, setContactGroups] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Dispatch Mode: 'single' or 'bulk'
  const [dispatchMode, setDispatchMode] = useState('bulk');

  const [formData, setFormData] = useState({
    senderId: 'FASREACH',
    recipientPhone: '',
    bulkRecipientsText: '',
    selectedGroup: '',
    content: '',
    scheduledFor: '',
  });

  const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch Sender IDs
      const senderRes = await API.get('/sender-ids');
      if (senderRes.data.success) {
        setSenderIds(senderRes.data.data.filter((s) => s.status === 'Approved'));
      }

      // Fetch Contacts & Groups
      const contactRes = await API.get('/contacts');
      if (contactRes.data.success) {
        setContacts(contactRes.data.data.contacts || []);
        setContactGroups(contactRes.data.data.groups || []);
      }
    } catch (err) {
      console.error('Failed to load SMS dispatcher data', err);
    }
  };

  // Helper to extract unique clean phone numbers from text
  const extractPhoneNumbers = (text) => {
    if (!text) return [];
    const rawList = text.split(/[\s,;\n]+/);
    const cleaned = rawList
      .map((p) => p.replace(/[^0-9+]/g, '').trim())
      .filter((p) => p.length >= 7);
    return Array.from(new Set(cleaned));
  };

  // Handle Contact Group Selection
  const handleGroupSelect = (groupName) => {
    setFormData((prev) => {
      let groupPhones = [];
      if (groupName === 'ALL') {
        groupPhones = contacts.map((c) => c.phone);
      } else if (groupName) {
        groupPhones = contacts.filter((c) => c.groupName === groupName).map((c) => c.phone);
      }

      const existingPhones = extractPhoneNumbers(prev.bulkRecipientsText);
      const combined = Array.from(new Set([...existingPhones, ...groupPhones]));

      return {
        ...prev,
        selectedGroup: groupName,
        bulkRecipientsText: combined.join(', '),
      };
    });

    if (groupName) {
      toast.success(`Loaded numbers from '${groupName === 'ALL' ? 'All Contacts' : groupName}'!`);
    }
  };

  // Handle Direct CSV / Excel File Upload inside Send SMS
  const handleDirectFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split(/\r\n|\n/);
      const extracted = [];

      for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const cols = trimmed.split(/[,;\t]/).map((c) => c.replace(/^["']|["']$/g, '').trim());

        for (let col of cols) {
          const clean = col.replace(/[^0-9+]/g, '').trim();
          if (clean.length >= 7) {
            extracted.push(clean);
          }
        }
      }

      const uniqueExtracted = Array.from(new Set(extracted));

      if (uniqueExtracted.length > 0) {
        setFormData((prev) => {
          const existing = extractPhoneNumbers(prev.bulkRecipientsText);
          const combined = Array.from(new Set([...existing, ...uniqueExtracted]));
          return {
            ...prev,
            bulkRecipientsText: combined.join(', '),
          };
        });
        toast.success(`Extracted ${uniqueExtracted.length} phone numbers from ${file.name}!`);
      } else {
        toast.error('No valid phone numbers found in file');
      }
    };

    reader.readAsText(file);
  };

  const parsedRecipients = dispatchMode === 'single'
    ? (formData.recipientPhone.trim() ? [formData.recipientPhone.trim()] : [])
    : extractPhoneNumbers(formData.bulkRecipientsText);

  const recipientCount = parsedRecipients.length;
  // 155 Characters per SMS unit
  const smsUnitsPerMsg = Math.ceil(formData.content.length / 155) || 1;
  const totalSmsUnitsNeeded = recipientCount * smsUnitsPerMsg;
  const totalCostGHS = (totalSmsUnitsNeeded * 0.04).toFixed(2);

  const handleSend = async (e) => {
    e.preventDefault();

    if (recipientCount === 0) {
      toast.error(dispatchMode === 'single' ? 'Please enter a recipient phone number' : 'Please enter, upload, or select at least one recipient phone number');
      return;
    }

    if (!formData.content) {
      toast.error('Message content cannot be empty');
      return;
    }

    if (isScheduleEnabled && !formData.scheduledFor) {
      toast.error('Please select a future date and time for scheduling');
      return;
    }

    setLoading(true);
    try {
      const scheduledForVal = isScheduleEnabled ? formData.scheduledFor : null;

      if (dispatchMode === 'single') {
        const res = await API.post('/sms/send', {
          senderId: formData.senderId,
          recipientPhone: parsedRecipients[0],
          content: formData.content,
          scheduledFor: scheduledForVal,
        });

        if (res.data.success) {
          toast.success(res.data.message || 'SMS dispatched successfully!');
          setFormData((prev) => ({ ...prev, recipientPhone: '', content: '', scheduledFor: '' }));
          setIsScheduleEnabled(false);
          await refreshWallet();
        }
      } else {
        // Bulk Dispatch Mode
        const res = await API.post('/sms/bulk', {
          senderId: formData.senderId,
          recipients: parsedRecipients,
          content: formData.content,
          scheduledFor: scheduledForVal,
        });

        if (res.data.success) {
          toast.success(res.data.message || `Bulk SMS broadcast of ${recipientCount} messages dispatched!`);
          setFormData((prev) => ({ ...prev, bulkRecipientsText: '', selectedGroup: '', content: '', scheduledFor: '' }));
          setIsScheduleEnabled(false);
          await refreshWallet();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Dispatch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAi = async () => {
    if (!aiPrompt || !aiPrompt.trim()) {
      toast.error('Please enter a topic or keyword for AI');
      return;
    }

    setGeneratingAi(true);
    try {
      const res = await API.post('/sms/ai-templates', { category: 'Marketing', keywords: [aiPrompt] });
      let list = [];
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        list = res.data.data.map((item) => (typeof item === 'string' ? item : item.content));
      } else {
        list = [
          `🔥 Special Offer: Exclusive deal on ${aiPrompt}! Claim your discount today by visiting fasreach.com or replying YES.`,
          `🎉 Big News! Check out our latest ${aiPrompt} updates. Limited slots available—get started now!`,
          `⭐ Hi there! Don't miss out on ${aiPrompt}. Contact support or visit us today to activate your offer!`,
        ];
      }

      setAiTemplatesList(list);
      const nextIdx = (aiIndex + 1) % list.length;
      setAiIndex(nextIdx);
      setFormData((prev) => ({ ...prev, content: list[nextIdx] }));
      toast.success(`Inserted AI Variation #${nextIdx + 1}! Click again for more variations.`);
    } catch (err) {
      const fallbackList = [
        `🔥 Exclusive Offer: Upgrade your ${aiPrompt} experience today! Get special discounts by replying YES or visiting us now.`,
        `🎉 Special Announcement: ${aiPrompt} is officially active! Claim your discount before stock runs out.`,
        `⭐ Hi! Grab your ${aiPrompt} package today with instant delivery. Contact support to get started!`,
      ];
      setAiTemplatesList(fallbackList);
      const nextIdx = (aiIndex + 1) % fallbackList.length;
      setAiIndex(nextIdx);
      setFormData((prev) => ({ ...prev, content: fallbackList[nextIdx] }));
      toast.success(`Inserted AI Variation #${nextIdx + 1}! Click again for more variations.`);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Send className="w-6 h-6 text-[#D4AF6A] shrink-0" /> Send Bulk & Single SMS
        </h1>
        <p className="text-xs text-[#AEB4BC]">Broadcast messages to your Contact Directory, import Excel/CSV files directly, or paste phone numbers</p>
      </div>

      {/* Dispatch Mode Toggle Tabs */}
      <div className="flex items-center space-x-3 bg-[#2A3038]/70 border border-[rgba(212,175,106,0.2)] p-1.5 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setDispatchMode('bulk')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            dispatchMode === 'bulk'
              ? 'bg-[#D4AF6A] text-black shadow-lg'
              : 'text-[#AEB4BC] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Bulk / Directory Broadcast</span>
        </button>

        <button
          type="button"
          onClick={() => setDispatchMode('single')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            dispatchMode === 'single'
              ? 'bg-[#D4AF6A] text-black shadow-lg'
              : 'text-[#AEB4BC] hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Single Recipient</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SMS Composer Form */}
        <div className="lg:col-span-2 bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
          <form onSubmit={handleSend} className="space-y-4">
            {/* Sender ID Header Selector */}
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

            {/* Recipient Input Mode: Single vs Bulk */}
            {dispatchMode === 'single' ? (
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
            ) : (
              <div className="space-y-3">
                {/* 1. Select from Saved Contact Directory / Groups */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#1E232B]/80 border border-[rgba(212,175,106,0.2)] rounded-2xl p-3 space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#D4AF6A] flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> Select from Contact Directory
                    </label>
                    <select
                      value={formData.selectedGroup}
                      onChange={(e) => handleGroupSelect(e.target.value)}
                      className="w-full bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-semibold"
                    >
                      <option value="">-- Choose Contact Group --</option>
                      <option value="ALL">All Saved Contacts ({contacts.length} numbers)</option>
                      {contactGroups.map((g) => {
                        const count = contacts.filter((c) => c.groupName === g.name).length;
                        return (
                          <option key={g._id} value={g.name}>
                            {g.name} ({count} numbers)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* 2. Direct Excel / CSV File Upload Box */}
                  <div className="bg-[#1E232B]/80 border border-[rgba(212,175,106,0.2)] rounded-2xl p-3 space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#D4AF6A] flex items-center gap-1">
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Upload Excel / CSV File Directly
                    </label>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.txt"
                      onChange={handleDirectFileUpload}
                      className="w-full bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-2 py-1 text-xs text-white file:bg-[#D4AF6A] file:text-black file:border-0 file:font-bold file:rounded-lg file:px-2.5 file:py-1 file:mr-2 file:text-[11px] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#AEB4BC]">
                      Bulk Phone Numbers List (Pasted or Imported)
                    </label>
                    <span className="text-xs font-bold text-[#D4AF6A] font-mono">
                      {recipientCount} {recipientCount === 1 ? 'Recipient' : 'Recipients'}
                    </span>
                  </div>
                  <textarea
                    rows="4"
                    value={formData.bulkRecipientsText}
                    onChange={(e) => setFormData({ ...formData, bulkRecipientsText: e.target.value })}
                    placeholder="Extracted or pasted phone numbers will appear here, e.g.:&#10;0241112233, 0509998877, 0277778899"
                    className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF6A]"
                  />
                  <p className="text-[11px] text-[#AEB4BC] mt-1">Numbers from Contact Groups or Excel files automatically populate here.</p>
                </div>
              </div>
            )}

            {/* AI Generator Helper Box */}
            <div className="bg-[#1E232B]/80 border border-[rgba(212,175,106,0.3)] rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#D4AF6A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF6A]" /> AI SMS Copy Generator
                </span>
                <span className="text-[10px] text-[#AEB4BC]">Instant High-Converting Copy</span>
              </div>

              {/* Quick Topic Chips */}
              <div className="flex flex-wrap gap-1.5">
                {['⚡ Flash Sale', '🎁 Promo Discount', '📢 Event Invitation', '💳 Payment Due', '👋 Welcome SMS'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      const topic = chip.replace(/^[^\w\s]+\s*/, '');
                      setAiPrompt(topic);
                    }}
                    className="text-[10px] bg-[#2A3038] hover:bg-[#343C47] text-[#AEB4BC] hover:text-white px-2.5 py-1 rounded-lg border border-[rgba(212,175,106,0.15)] transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. 20% Discount Sale announcement"
                  className="flex-1 bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
                />
                <button
                  type="button"
                  onClick={() => handleGenerateAi()}
                  disabled={generatingAi}
                  className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#C9A04E] text-black font-extrabold text-xs px-4 py-2 rounded-xl shrink-0 transition-all disabled:opacity-50 flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{generatingAi ? 'Generating...' : 'Generate Copy'}</span>
                </button>
              </div>

              {/* Generated Variations Cards List */}
              {aiTemplatesList.length > 0 && (
                <div className="pt-3 space-y-2 border-t border-[rgba(212,175,106,0.15)] animate-fadeIn">
                  <span className="text-[11px] font-bold text-white block">Generated AI Copy Options (Click to select):</span>
                  <div className="grid grid-cols-1 gap-2">
                    {aiTemplatesList.map((tpl, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, content: tpl }));
                          setAiIndex(idx);
                          toast.success(`Selected AI Copy Option #${idx + 1}!`);
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                          formData.content === tpl
                            ? 'bg-[#2A3038] border-[#D4AF6A] shadow-md ring-1 ring-[#D4AF6A]'
                            : 'bg-[#1E232B] border-[rgba(212,175,106,0.15)] hover:border-[#D4AF6A]/50'
                        }`}
                      >
                        <p className="text-white font-medium mb-2">"{tpl}"</p>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-[#AEB4BC]">{tpl.length} chars</span>
                          <span className={`font-bold px-2.5 py-0.5 rounded-md ${formData.content === tpl ? 'bg-[#D4AF6A] text-black' : 'bg-[#2A3038] text-[#D4AF6A]'}`}>
                            {formData.content === tpl ? '✓ Active Message' : 'Use Option'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message Content */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#AEB4BC]">SMS Message Content</label>
                <span className="text-[10px] text-[#D4AF6A] font-mono">
                  {formData.content.length} chars ({smsUnitsPerMsg} unit/msg @ 155 chars)
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || recipientCount === 0}
              className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {isScheduleEnabled ? <Clock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>
                {loading
                  ? 'Processing...'
                  : isScheduleEnabled
                  ? `Schedule Broadcast for ${recipientCount} Recipient(s)`
                  : `Dispatch SMS to ${recipientCount} Recipient(s) (GHS ${totalCostGHS})`}
              </span>
            </button>
          </form>
        </div>

        {/* Live Device Simulator Preview & Broadcast Calculation Box */}
        <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col items-center max-w-full overflow-hidden">
          <span className="text-xs font-bold text-[#D4AF6A] flex items-center gap-1">
            <Smartphone className="w-4 h-4" /> Live Mobile Preview & Cost
          </span>

          <div className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#AEB4BC]">
              <span>Mode:</span>
              <span className="font-bold text-white uppercase">{dispatchMode}</span>
            </div>
            <div className="flex justify-between text-[#AEB4BC]">
              <span>Recipients:</span>
              <span className="font-bold text-white font-mono">{recipientCount} Phones</span>
            </div>
            <div className="flex justify-between text-[#AEB4BC]">
              <span>Units Per SMS:</span>
              <span className="font-bold text-white font-mono">{smsUnitsPerMsg} Unit</span>
            </div>
            <div className="flex justify-between text-[#AEB4BC]">
              <span>Total Units Needed:</span>
              <span className="font-bold text-[#D4AF6A] font-mono">{totalSmsUnitsNeeded} Units</span>
            </div>
            <div className="pt-2 border-t border-[rgba(212,175,106,0.15)] flex justify-between font-bold text-sm">
              <span className="text-white">Estimated Cost:</span>
              <span className="text-[#D4AF6A] font-mono">GHS {totalCostGHS}</span>
            </div>
          </div>

          <div className="w-64 h-[350px] bg-black border-4 border-[#3A404A] rounded-[36px] p-3 flex flex-col justify-between shadow-2xl relative">
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
              Recipient Count: <span className="text-[#D4AF6A] font-bold">{recipientCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
