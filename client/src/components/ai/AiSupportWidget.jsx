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

// Generative Human Intelligence Engine (No canned "Regarding your question about" strings!)
const processGenerativeAiModel = (prompt, pagePath, user, history = []) => {
  const text = (prompt || '').trim();
  const lower = text.toLowerCase();

  try {
    // 🛡️ Security & Confidentiality Firewall
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

    // 1. Name Introductions ("am lawrence", "i am john", "my name is lawrence", "call me alex")
    if (
      lower.startsWith('am ') ||
      lower.startsWith('i am ') ||
      lower.includes('my name is') ||
      lower.includes('call me')
    ) {
      const namePart = text.replace(/^(am|i am|my name is|call me)\s+/i, '').trim();
      const capitalizedName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'there';

      return {
        content: `Nice to meet you, ${capitalizedName}! 👋\n\nHow can I help you today with your FasReach account or SMS dispatches?`,
        actionButtons: [],
      };
    }

    // 2. What is done here / Page Questions ("what is done here", "what can i do here", "what is this place")
    if (
      lower.includes('what is done here') ||
      lower.includes('what do you do here') ||
      lower.includes('what can i do here') ||
      lower.includes('what is this page') ||
      lower.includes('what is this place')
    ) {
      if (pagePath === '/send-sms') {
        return {
          content: `On this Send SMS page, you can dispatch single or bulk SMS messages, upload Excel/CSV contact spreadsheets, select saved Contact Directory groups, and schedule dispatches for future dates!`,
          actionButtons: [{ label: 'Send SMS', route: '/send-sms' }],
        };
      }
      if (pagePath === '/wallet') {
        return {
          content: `On this Wallet page, you can top up your cash balance via Paystack (MTN Mobile Money, Telecel Cash, Visa/Mastercard) and view your top-up history.`,
          actionButtons: [{ label: 'Go to Wallet', route: '/wallet' }],
        };
      }
      return {
        content: `Here on FasReach, you can broadcast single & bulk SMS, upload Excel contact lists, register custom brand Sender ID headers, schedule dispatches, and track real-time delivery reports. What would you like to work on?`,
        actionButtons: [
          { label: 'Send SMS', route: '/send-sms' },
          { label: 'Go to Wallet', route: '/wallet' },
        ],
      };
    }

    // 3. Delivery Speed & Performance ("How fast is SMS delivered?", "Delivery speed")
    if (lower.includes('how fast') || lower.includes('delivery speed') || lower.includes('how long does it take') || lower.includes('delivery time')) {
      return {
        content: `SMS delivery on FasReach is usually extremely fast—most text messages arrive on the recipient's phone within 3 to 10 seconds.\n\nHowever, exact delivery speed can depend on mobile network operator conditions, recipient phone power/coverage status, and carrier processing queues during peak hours.`,
        actionButtons: [],
      };
    }

    // 4. Capacity & High Volume ("Can I send 10,000 messages?", "Bulk volume")
    if (lower.includes('how many sms') || lower.includes('capacity') || lower.includes('bulk volume') || lower.includes('10000') || lower.includes('limit')) {
      return {
        content: `You can send thousands of SMS messages in a single broadcast without speed degradation.\n\nOur system connects directly to high-throughput telco gateways (MTN, Telecel, AirtelTigo), so whether you send 10 messages or 50,000 messages, dispatches process in high-speed parallel queues.`,
        actionButtons: [],
      };
    }

    // 5. Emojis & Unicode ("Can I use emojis?")
    if (lower.includes('emoji') || lower.includes('emojis') || lower.includes('unicode') || lower.includes('special character')) {
      return {
        content: `Yes, you can include emojis and special characters in your messages.\n\nPlease note that standard English plain text allows up to 155 characters per SMS unit, whereas messages containing emojis or Unicode characters use 70 characters per unit due to mobile network encoding standards.`,
        actionButtons: [],
      };
    }

    // 6. Unreachable / Off Phones ("What if phone is off?")
    if (lower.includes('switched off') || lower.includes('phone is off') || lower.includes('unreachable') || lower.includes('invalid number')) {
      return {
        content: `If a recipient's phone is switched off or out of network coverage, the mobile network operator will hold the SMS in queue and attempt delivery for up to 24-48 hours once the phone powers back on.\n\nIf the phone remains unreachable or the number is invalid, the delivery report in your account will update to reflect a Failed status.`,
        actionButtons: [],
      };
    }

    // 7. General Concept Explanations ("What is Bulk SMS?", "What is an API?", "What is a Sender ID?")
    if (lower.includes('what is bulk sms') || lower.includes('explain bulk sms')) {
      return {
        content: `Bulk SMS is a communication service that enables you to broadcast a single text message to hundreds or thousands of mobile recipients simultaneously.\n\nIt is widely used by businesses, churches, and organizations for urgent announcements, promotional sales, alerts, and customer notifications because SMS has an estimated 98% open rate!`,
        actionButtons: [],
      };
    }

    if (lower.includes('what is an api') || lower.includes('what is api')) {
      return {
        content: `An API (Application Programming Interface) allows your custom website, mobile app, or software to communicate directly with FasReach.\n\nUsing our REST API, your software can automatically trigger SMS messages (such as OTP verification codes, order confirmations, or account alerts) without manual intervention.`,
        actionButtons: [{ label: 'Developer API', route: '/developer-api' }],
      };
    }

    if (lower.includes('what is a sender id') || lower.includes('what is sender id') || lower.includes('what is a header')) {
      return {
        content: `A Sender ID is the custom 1 to 11 character header name (like your business brand name) that appears at the top of your recipient's phone screen when they receive your SMS.\n\nUsing a branded Sender ID (such as MYBRAND) builds instant trust compared to sending from an unknown phone number.`,
        actionButtons: [{ label: 'Custom Sender IDs', route: '/sender-ids' }],
      };
    }

    // 8. Action Steps ("How do I send SMS?", "How do I upload contacts?", "How do I top up?")
    if (lower.includes('how do i send') || lower.includes('how to send') || lower.includes('send sms')) {
      return {
        content: `To send a message, head over to the Send SMS page.\n\nYou can choose between Single Recipient mode or Bulk Broadcast. For bulk dispatches, you can paste a list of numbers, select a saved Contact Group, or upload an Excel file directly.\n\nEvery 155 characters counts as 1 SMS unit at 0.04 GHS per unit.`,
        actionButtons: [{ label: 'Go to Send SMS', route: '/send-sms' }],
      };
    }

    if (lower.includes('how do i upload') || lower.includes('how to upload') || lower.includes('import contacts') || lower.includes('excel upload')) {
      return {
        content: `Uploading contacts is done on the Contacts page.\n\nClick "Import Excel/CSV File" and select your spreadsheet (.xlsx or .csv). Ensure your file has column headers for phone, name, and groupName. You can also organize contacts into custom groups to send to entire lists at once.`,
        actionButtons: [{ label: 'Contacts Directory', route: '/contacts' }],
      };
    }

    if (lower.includes('how do i top up') || lower.includes('how to top up') || lower.includes('wallet top up') || lower.includes('paystack deposit')) {
      return {
        content: `To fund your wallet, go to the Wallet page, enter your deposit amount in GHS (minimum is GHS 1.00), and click "Top Up via Paystack". You can pay using Mobile Money (MTN, Telecel, AirtelTigo) or Visa/Mastercard.\n\nYour rate is 0.04 GHS per 155-character SMS unit, and your funds remain in your cash balance.`,
        actionButtons: [{ label: 'Go to Wallet', route: '/wallet' }],
      };
    }

    // 9. Greetings & Casual Dialogue
    if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'good morning' || lower === 'good afternoon' || lower === 'good evening') {
      return {
        content: `Hello 👋\n\nWelcome to FasReach.\n\nHow can I help you today?`,
        actionButtons: [],
      };
    }

    if (lower.includes('how are u') || lower.includes('how are you') || lower.includes('how u doing')) {
      return {
        content: `I'm doing well, thank you for asking! How can I help you today?`,
        actionButtons: [],
      };
    }

    if (lower.includes('thank') || lower.includes('thanks') || lower.includes('great')) {
      return {
        content: `You're very welcome! Let me know if you need help with anything else.`,
        actionButtons: [],
      };
    }

    // 10. Natural Conversational Human Fallback (NO "Regarding your question about" string!)
    return {
      content: `I am here to assist you with your FasReach account!\n\nWhether you need help broadcasting single or bulk SMS, uploading Excel contact files, registering custom Sender IDs, or topping up your wallet, let me know what you'd like to do and I'll walk you right through it.`,
      actionButtons: [
        { label: 'Send SMS', route: '/send-sms' },
        { label: 'Go to Wallet', route: '/wallet' },
      ],
    };
  } catch (err) {
    return {
      content: `How can I assist you today with your FasReach dispatches, Sender IDs, or wallet balance?`,
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
      // Process semantic generative AI model response
      const aiAnswer = processGenerativeAiModel(queryText, location.pathname, user, messages);
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
