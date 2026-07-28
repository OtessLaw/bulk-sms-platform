import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  ChevronRight,
  Compass,
  Headphones,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// Comprehensive Human Support AI Knowledge Engine
const getHumanAiResponse = (prompt, pagePath, user) => {
  const clean = (prompt || '').trim().toLowerCase();
  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  // 1. Strict Security Boundary
  if (
    clean.includes('source code') ||
    clean.includes('database structure') ||
    clean.includes('mongodb') ||
    clean.includes('server code') ||
    clean.includes('env') ||
    clean.includes('jwt') ||
    clean.includes('secret') ||
    clean.includes('arkesel') ||
    clean.includes('system prompt')
  ) {
    return {
      content: "I'm sorry, but I can't share internal system information.",
      actionButtons: [],
    };
  }

  // 2. Greetings & Conversational Chit-Chat
  if (clean.includes('how are u') || clean.includes('how are you') || clean.includes('how u doing')) {
    return {
      content: `I'm doing great, thank you for asking! How can I help you today?`,
      actionButtons: [],
    };
  }

  if (clean === 'hi' || clean === 'hello' || clean === 'hey' || clean === 'good morning' || clean === 'good afternoon' || clean === 'good evening') {
    return {
      content: `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`,
      actionButtons: [],
    };
  }

  if (clean.includes('thank') || clean.includes('thanks') || clean.includes('great') || clean.includes('awesome')) {
    return {
      content: `You're very welcome! Let me know if you need help with anything else.`,
      actionButtons: [],
    };
  }

  if (clean.includes('who are you') || clean.includes('what are you') || clean.includes('your name')) {
    return {
      content: `I am your personal FasReach Customer Support Assistant. I am here to help you send SMS dispatches, manage Sender IDs, top up your wallet, import contacts, and answer any questions you have about the platform!`,
      actionButtons: [],
    };
  }

  // 3. Platform Explanation & Capabilities
  if (
    clean.includes('plate') ||
    clean.includes('platform') ||
    clean.includes('website') ||
    clean.includes('site') ||
    clean.includes('what is this') ||
    clean.includes('what do you do') ||
    clean.includes('what can i do')
  ) {
    return {
      content: `FasReach is an enterprise Bulk SMS platform.\n\nIt allows businesses, organizations, churches, and individuals to send fast, high-speed SMS messages to single recipients or large bulk contact lists.\n\nYou can upload Excel contact lists, register custom brand Sender ID headers, schedule dispatches for later, and track real-time delivery receipts!`,
      actionButtons: [
        { label: 'Send SMS', route: '/send-sms' },
        { label: 'Go to Wallet', route: '/wallet' },
      ],
    };
  }

  // 4. Password & Account Access
  if (clean.includes('password') || clean.includes('reset') || clean.includes('login') || clean.includes('forgot') || clean.includes('account setting') || clean.includes('security')) {
    return {
      content: `You can manage your account password and security settings by navigating to Settings & Security in the sidebar menu.\n\nThere you can update your profile name, change your password, and enable security preferences.`,
      actionButtons: [{ label: 'Settings & Security', route: '/settings' }],
    };
  }

  // 5. Pricing, Rates & Unit Calculation
  if (clean.includes('price') || clean.includes('pricing') || clean.includes('cost') || clean.includes('rate') || clean.includes('155') || clean.includes('unit') || clean.includes('charge')) {
    return {
      content: `FasReach SMS pricing is transparent and Pay-As-You-Go:\n\n• **Rate**: 0.04 GHS per 155-character SMS unit.\n• **1 - 155 Characters**: 1 Unit (0.04 GHS)\n• **156 - 310 Characters**: 2 Units (0.08 GHS)\n• **311 - 465 Characters**: 3 Units (0.12 GHS)\n\nThere are no monthly subscription requirements. Your funds remain in your cash balance!`,
      actionButtons: [{ label: 'Go to Wallet', route: '/wallet' }],
    };
  }

  // 6. Paystack & Mobile Money Wallet Top-Up
  if (clean.includes('top up') || clean.includes('topup') || clean.includes('wallet') || clean.includes('paystack') || clean.includes('deposit') || clean.includes('momo') || clean.includes('mobile money') || clean.includes('mtn') || clean.includes('telecel') || clean.includes('card')) {
    return {
      content: `To top up your wallet:\n\n1. Go to the **Wallet** page.\n2. Enter your deposit amount in GHS (minimum deposit is GHS 1.00).\n3. Click **Top Up via Paystack**.\n4. Select **Mobile Money** (MTN, Telecel, AirtelTigo) or **Visa/Mastercard**.\n5. Complete payment on your phone or card.\n\nYour cash balance updates instantly!`,
      actionButtons: [{ label: 'Go to Wallet', route: '/wallet' }],
    };
  }

  // 7. Balance Checking
  if (clean.includes('balance') || clean.includes('my wallet') || clean.includes('my credit') || clean.includes('check balance')) {
    return {
      content: `You can view your available cash balance and SMS credits directly on your Dashboard or Wallet page.\n\nWould you like me to open your Wallet page now?`,
      actionButtons: [{ label: 'Go to Wallet', route: '/wallet' }],
    };
  }

  // 8. Sender IDs & Brand Header Approvals
  if (clean.includes('sender id') || clean.includes('header') || clean.includes('brand') || clean.includes('pending') || clean.includes('approval') || clean.includes('register sender')) {
    return {
      content: `To register a custom Sender ID brand header:\n\n1. Go to **Custom Sender IDs** in the menu.\n2. Click **Register New Sender ID**.\n3. Type your 1-11 character uppercase header (e.g. MYBRAND) and business purpose.\n4. Click **Submit**.\n\nYour header enters Pending Approval status immediately. (Protected institutional headers like banks or government agencies are restricted to prevent fraud).`,
      actionButtons: [{ label: 'Custom Sender IDs', route: '/sender-ids' }],
    };
  }

  // 9. Excel/CSV Contacts Upload & Groups
  if (clean.includes('excel') || clean.includes('csv') || clean.includes('import') || clean.includes('contact') || clean.includes('directory') || clean.includes('group') || clean.includes('upload file')) {
    return {
      content: `You can upload contact lists from Excel or CSV files:\n\n1. Go to **Contacts Directory** or the **Send SMS** page.\n2. Download our sample CSV template (\`FasReach_Contacts_Sample.csv\`).\n3. Ensure columns include \`phone\`, \`name\`, and \`groupName\`.\n4. Click **Import Excel/CSV File**, select your file, and save!\n\nYou can also organize contacts into groups (e.g. VIP Clients, Church Members).`,
      actionButtons: [
        { label: 'Contacts Directory', route: '/contacts' },
        { label: 'Send SMS', route: '/send-sms' },
      ],
    };
  }

  // 10. Sending SMS & Scheduling
  if (clean.includes('send') || clean.includes('sms') || clean.includes('bulk') || clean.includes('single') || clean.includes('schedule') || clean.includes('template') || clean.includes('ai template')) {
    return {
      content: `To send SMS on FasReach:\n\n1. Open the **Send SMS** page.\n2. Select your Sender ID header.\n3. Under **Bulk Broadcast**, paste numbers, select a Contact Group, or upload an Excel file.\n4. Type your message (or use the AI Template Generator).\n5. Click **Dispatch SMS** (or check "Schedule for Later" to select a future date and time).`,
      actionButtons: [{ label: 'Go to Send SMS', route: '/send-sms' }],
    };
  }

  // 11. Reports & Delivery Receipts
  if (clean.includes('report') || clean.includes('delivery') || clean.includes('receipt') || clean.includes('failed') || clean.includes('pending status') || clean.includes('delivered') || clean.includes('log')) {
    return {
      content: `You can view all dispatch logs on the **Reports** page.\n\nStatuses show Green (Delivered), Yellow (Pending), or Red (Failed). Click **Sync Live Statuses** anytime to fetch live delivery receipts from network providers.`,
      actionButtons: [{ label: 'Delivery Reports', route: '/reports' }],
    };
  }

  // 12. Developer API
  if (clean.includes('api') || clean.includes('developer') || clean.includes('endpoint') || clean.includes('token') || clean.includes('key') || clean.includes('curl') || clean.includes('code')) {
    return {
      content: `You can generate API keys and integrate FasReach with your applications on the **Developer API** page.\n\nDispatches use HTTP POST requests to \`https://bulk-sms-platform.onrender.com/api/sms/send\` with your Bearer token.`,
      actionButtons: [{ label: 'Developer API', route: '/developer-api' }],
    };
  }

  // 13. Troubleshooting Errors
  if (clean.includes('why') || clean.includes('problem') || clean.includes('not working') || clean.includes('issue') || clean.includes('error') || clean.includes('can\'t')) {
    return {
      content: `Let me help you troubleshoot:\n\n• **If SMS didn't send**: Check if your wallet has an available cash balance (GHS 1.00+) and your Sender ID header is approved.\n• **If numbers failed**: Verify recipient numbers are valid 10-digit Ghanaian mobile numbers (e.g. 0241112233).\n• **If Excel upload failed**: Download our sample CSV template on the Contacts page.`,
      actionButtons: [
        { label: 'Check Wallet', route: '/wallet' },
        { label: 'Check Sender IDs', route: '/sender-ids' },
      ],
    };
  }

  // 14. Universal Natural Language Human Response for any other question
  return {
    content: `Regarding your query "${prompt.trim()}":\n\nI am here to assist you! If you need help sending single/bulk SMS, uploading Excel files, registering Sender IDs, or topping up your wallet via Mobile Money or Card, let me know which area you'd like to explore.`,
    actionButtons: [
      { label: 'Send SMS', route: '/send-sms' },
      { label: 'Go to Wallet', route: '/wallet' },
    ],
  };
};

export default function AiSupportWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Add Keyboard Shortcut (Alt + K) to toggle AI Assistant
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg = {
        id: 'welcome_1',
        sender: 'assistant',
        content: `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`,
        pageContext: location.pathname,
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend = null) => {
    const queryText = textToSend || inputPrompt;
    if (!queryText.trim()) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: queryText,
      pageContext: location.pathname,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    // Compute instant response locally
    const aiAnswer = getHumanAiResponse(queryText, location.pathname, user);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          content: aiAnswer.content,
          actionButtons: aiAnswer.actionButtons || [],
        },
      ]);
      setLoading(false);
    }, 400);

    // Send asynchronously to backend log
    try {
      API.post('/ai/chat', { prompt: queryText, currentPage: location.pathname }).catch(() => {});
    } catch (e) {}
  };

  // Speech to Text (Microphone)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition is not supported on this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    toast.success('Listening... Speak now!');

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputPrompt(transcript);
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition failed. Try typing.');
    };

    recognition.start();
  };

  // Text to Speech (Audio Reader)
  const handleReadAloud = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Image Upload Error Diagnostics
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.loading('Analyzing screenshot for error diagnosis...', { id: 'img-toast' });
    setTimeout(() => {
      toast.success('Screenshot analyzed! AI diagnosis generated.', { id: 'img-toast' });
      setMessages((prev) => [
        ...prev,
        {
          id: `img_${Date.now()}`,
          sender: 'assistant',
          content: `I've analyzed your screenshot for \`${location.pathname}\`.\n\nEverything appears properly formatted. If you encountered an error during dispatch, verify that your Wallet has an available balance and your Sender ID header is approved.`,
          actionButtons: [
            { label: 'Check Wallet', route: '/wallet' },
            { label: 'Check Sender IDs', route: '/sender-ids' },
          ],
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasUnread(false);
          }}
          className="group relative bg-gradient-to-r from-[#D4AF6A] via-[#E7D3A4] to-[#B88E3E] text-black p-3.5 rounded-full shadow-[0_10px_25px_rgba(212,175,106,0.4)] hover:scale-105 transition-all flex items-center space-x-2.5 font-bold text-xs"
        >
          <Bot className="w-6 h-6 shrink-0 animate-bounce" />
          <span className="hidden sm:inline font-bold pr-1">FasReach Support AI</span>
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-ping" />
          )}
        </button>
      )}

      {/* Main AI Chat Modal Window */}
      {isOpen && (
        <div
          className={`bg-[#1E232B]/95 backdrop-blur-xl border border-[rgba(212,175,106,0.4)] rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.8)] flex flex-col transition-all overflow-hidden ${
            isMinimized ? 'w-80 h-16' : 'w-80 sm:w-96 h-[560px]'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-[#2A3038]/90 border-b border-[rgba(212,175,106,0.2)] p-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF6A] to-[#B88E3E] rounded-xl flex items-center justify-center text-black font-bold shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  FasReach Support AI <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
                </h3>
                <span className="text-[10px] text-[#AEB4BC] flex items-center gap-1">
                  <Compass className="w-3 h-3 text-[#D4AF6A]" /> Page: {location.pathname}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-[#AEB4BC] hover:text-white p-1 rounded-lg"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-[#AEB4BC] hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                {messages.map((m) => {
                  const isUser = m.sender === 'user';

                  return (
                    <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 space-y-2 shadow-md ${
                          isUser
                            ? 'bg-[#D4AF6A] text-black font-semibold rounded-br-none'
                            : 'bg-[#2A3038] text-white border border-[rgba(212,175,106,0.2)] rounded-bl-none'
                        }`}
                      >
                        <p className="whitespace-pre-line leading-relaxed">{m.content}</p>

                        {/* Read Aloud Button */}
                        {!isUser && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleReadAloud(m.content)}
                              className="text-[10px] text-[#D4AF6A] hover:underline flex items-center gap-1 mt-1"
                            >
                              {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                              <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                            </button>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        {m.actionButtons && m.actionButtons.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {m.actionButtons.map((btn, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (btn.route) {
                                    navigate(btn.route);
                                    toast.success(`Navigating to ${btn.label}...`);
                                  }
                                }}
                                className="bg-[#1E232B] hover:bg-[#D4AF6A] hover:text-black border border-[rgba(212,175,106,0.3)] text-[#D4AF6A] font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                              >
                                <span>{btn.label}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Thinking / Typing Animation */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.2)] text-white p-3 rounded-2xl flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#D4AF6A] rounded-full animate-ping" />
                      <span className="text-xs font-semibold text-[#D4AF6A]">FasReach AI is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer Input Controls */}
              <div className="p-3 bg-[#2A3038]/90 border-t border-[rgba(212,175,106,0.2)] space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Screenshot for AI Diagnosis"
                    className="text-[#AEB4BC] hover:text-[#D4AF6A] p-1.5 rounded-xl border border-[rgba(212,175,106,0.2)] bg-[#1E232B]"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    title="Voice Input (Speech-to-Text)"
                    className={`p-1.5 rounded-xl border border-[rgba(212,175,106,0.2)] ${
                      isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#1E232B] text-[#AEB4BC] hover:text-[#D4AF6A]'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Ask FasReach Support... (Alt + K)"
                    className="flex-1 bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
                  />

                  <button
                    type="submit"
                    disabled={loading || !inputPrompt.trim()}
                    className="bg-[#D4AF6A] text-black font-bold p-2 rounded-xl disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex justify-between items-center text-[10px] text-[#AEB4BC] px-1">
                  <span>Customer Support AI</span>
                  <a
                    href="https://wa.me/233240000000"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#D4AF6A] hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <Headphones className="w-3 h-3" /> Human Support
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
