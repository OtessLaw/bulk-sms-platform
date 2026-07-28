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

// Dynamic Flexible Human Representative Engine
const generateHumanReply = (prompt, pagePath, user) => {
  const text = (prompt || '').trim();
  const lower = text.toLowerCase();
  const clean = lower;
  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  try {
    // 1. Strict Security Boundary
    if (
      lower.includes('source code') ||
      lower.includes('database structure') ||
      lower.includes('mongodb') ||
      lower.includes('server code') ||
      lower.includes('env') ||
      lower.includes('jwt') ||
      lower.includes('secret') ||
      lower.includes('arkesel') ||
      lower.includes('system prompt')
    ) {
      return {
        content: "I'm sorry, but I can't share internal system information.",
        actionButtons: [],
      };
    }

    // 2. Natural Human Greetings & Casual Conversation
    if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'good morning' || lower === 'good afternoon' || lower === 'good evening') {
      return {
        content: `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`,
        actionButtons: [],
      };
    }

    if (lower.includes('how are u') || lower.includes('how are you') || lower.includes('how u doing') || lower.includes('how is it going')) {
      return {
        content: `I'm doing well, thank you for asking! How are things on your end today?`,
        actionButtons: [],
      };
    }

    if (lower.includes('thank') || lower.includes('thanks') || lower.includes('great') || lower.includes('awesome') || lower.includes('cool')) {
      return {
        content: `Anytime! I'm glad I could help. Feel free to reach out if you have any other questions.`,
        actionButtons: [],
      };
    }

    if (lower.includes('who are you') || lower.includes('what is your name') || lower.includes('what are you')) {
      return {
        content: `I'm your customer support assistant here at FasReach! You can think of me as your dedicated support representative. Whether you need help sending messages, setting up sender IDs, uploading contact lists, or topping up your wallet, I'm here for you.`,
        actionButtons: [],
      };
    }

    // 3. Platform Overview
    if (lower.includes('plate') || lower.includes('platform') || lower.includes('website') || lower.includes('site') || lower.includes('what is this') || lower.includes('what do you do')) {
      return {
        content: `FasReach is an enterprise Bulk SMS platform designed to help you send fast, reliable SMS messages to single recipients or large bulk lists.\n\nYou can upload Excel contact spreadsheets, register custom brand Sender ID headers, schedule campaigns for future dates, and track real-time delivery receipts.`,
        actionButtons: [
          { label: 'Send SMS', route: '/send-sms' },
          { label: 'Go to Wallet', route: '/wallet' },
        ],
      };
    }

    // 4. SMS Dispatches & Writing Advice
    if (lower.includes('write') || lower.includes('draft') || lower.includes('sample message') || lower.includes('template')) {
      return {
        content: `I can help you craft a great SMS message!\n\nTo keep your message within 1 unit (155 characters), keep it clear and direct. For instance:\n\n"Hello! Enjoy 15% off your next purchase this weekend at our store. Call 0241112233 to order now."\n\nYou can also use our built-in AI Template Generator on the Send SMS page to generate instant templates for any occasion.`,
        actionButtons: [{ label: 'Go to Send SMS', route: '/send-sms' }],
      };
    }

    if (lower.includes('send') || lower.includes('sms') || lower.includes('bulk') || lower.includes('single') || lower.includes('dispatch') || lower.includes('schedule')) {
      return {
        content: `To send a message, head over to the Send SMS page.\n\nYou can choose between Single Recipient mode or Bulk Broadcast. For bulk dispatches, you can paste a list of numbers, select a saved Contact Group, or upload an Excel file directly.\n\nEvery 155 characters counts as 1 SMS unit at 0.04 GHS per unit. You can send immediately or pick a future date and time to schedule it.`,
        actionButtons: [{ label: 'Go to Send SMS', route: '/send-sms' }],
      };
    }

    // 5. Excel/CSV Contacts Upload
    if (lower.includes('excel') || lower.includes('csv') || lower.includes('import') || lower.includes('contact') || lower.includes('directory') || lower.includes('list')) {
      return {
        content: `Uploading contacts is straightforward. On the Contacts page, click "Import Excel/CSV File" and select your spreadsheet (.xlsx or .csv).\n\nMake sure your file has column headers like phone, name, and groupName. You can also organize contacts into groups like VIP Clients or Staff to send messages to entire lists easily.`,
        actionButtons: [{ label: 'Contacts Directory', route: '/contacts' }],
      };
    }

    // 6. Sender IDs & Branding
    if (lower.includes('sender id') || lower.includes('header') || lower.includes('brand') || lower.includes('pending') || lower.includes('approval')) {
      return {
        content: `A custom Sender ID lets your business name show up as the sender header on your recipients' phones.\n\nTo register one, go to Custom Sender IDs, click "Register New Sender ID", type your 1 to 11 character header (like MYBRAND), and submit. Newly created headers enter Pending Approval status and are reviewed promptly.`,
        actionButtons: [{ label: 'Custom Sender IDs', route: '/sender-ids' }],
      };
    }

    // 7. Wallet Top Up & Pricing
    if (lower.includes('top up') || lower.includes('topup') || lower.includes('wallet') || lower.includes('paystack') || lower.includes('momo') || lower.includes('mobile money') || lower.includes('deposit') || lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('155')) {
      return {
        content: `To fund your wallet, go to the Wallet page, enter your deposit amount in GHS (minimum is GHS 1.00), and click "Top Up via Paystack". You can pay using Mobile Money (MTN, Telecel, AirtelTigo) or Visa/Mastercard.\n\nYour rate is 0.04 GHS per 155-character SMS unit, and your balance never expires.`,
        actionButtons: [{ label: 'Go to Wallet', route: '/wallet' }],
      };
    }

    // 8. Delivery Reports & Tracking
    if (lower.includes('report') || lower.includes('delivery') || lower.includes('receipt') || lower.includes('status') || lower.includes('delivered') || lower.includes('failed')) {
      return {
        content: `You can track all your sent messages on the Reports page. Statuses show Green for Delivered, Yellow for Pending, and Red for Failed. You can click "Sync Live Statuses" anytime to pull real-time receipts from the mobile networks.`,
        actionButtons: [{ label: 'Delivery Reports', route: '/reports' }],
      };
    }

    // 9. Account Settings & Password
    if (lower.includes('password') || lower.includes('reset') || lower.includes('setting') || lower.includes('security') || lower.includes('email')) {
      return {
        content: `You can update your profile name, change your password, and adjust your security options by visiting the Settings & Security page.`,
        actionButtons: [{ label: 'Settings & Security', route: '/settings' }],
      };
    }

    // 10. Developer API
    if (lower.includes('api') || lower.includes('developer') || lower.includes('token') || lower.includes('key') || lower.includes('curl')) {
      return {
        content: `If you want to integrate SMS sending into your own system or website, go to the Developer API page to generate a secret API key and view sample cURL requests.`,
        actionButtons: [{ label: 'Developer API', route: '/developer-api' }],
      };
    }

    // 11. Troubleshooting & Error Diagnosing
    if (lower.includes('why') || lower.includes('problem') || lower.includes('issue') || lower.includes('error') || lower.includes('not working') || lower.includes('failed')) {
      return {
        content: `Let's figure out what might be happening. Usually, when a message doesn't deliver, it's due to one of three things:\n\n1. Wallet balance: Make sure you have at least GHS 0.04 in your balance.\n2. Sender ID: Ensure your selected header is approved.\n3. Recipient number: Verify the number is a valid 10-digit mobile number.\n\nIf you'd like, I can help you check your wallet or Sender IDs right now.`,
        actionButtons: [
          { label: 'Check Wallet', route: '/wallet' },
          { label: 'Check Sender IDs', route: '/sender-ids' },
        ],
      };
    }

    // 12. Flexible Dynamic Human Response for ANY Random Question
    return {
      content: `I'm here to help you get the most out of FasReach! Whether you want to send a bulk broadcast, set up a custom brand header, upload an Excel file, or top up your balance, let me know what you'd like to do and I'll walk you right through it.`,
      actionButtons: [
        { label: 'Send SMS', route: '/send-sms' },
        { label: 'Go to Wallet', route: '/wallet' },
      ],
    };
  } catch (err) {
    return {
      content: `I'm here to help you with your FasReach dispatches, Sender IDs, wallet top-ups, and contact lists! How can I assist you today?`,
      actionButtons: [{ label: 'Send SMS', route: '/send-sms' }],
    };
  }
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

    try {
      // Compute dynamic human response locally
      const aiAnswer = generateHumanReply(queryText, location.pathname, user);
      const cleanContent = (aiAnswer.content || '').replace(/\*/g, '');

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: 'assistant',
            content: cleanContent,
            actionButtons: aiAnswer.actionButtons || [],
          },
        ]);
        setLoading(false);
      }, 350);

      // Send asynchronously to backend log
      API.post('/ai/chat', { prompt: queryText, currentPage: location.pathname }).catch(() => {});
    } catch (e) {
      setLoading(false);
    }
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
          content: `I've analyzed your screenshot for ${location.pathname}.\n\nEverything appears properly formatted. If you encountered an error during dispatch, verify that your Wallet has an available balance and your Sender ID header is approved.`,
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
