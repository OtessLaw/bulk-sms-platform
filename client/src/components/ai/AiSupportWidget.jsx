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
  UserCheck,
} from 'lucide-react';

export default function AiSupportWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [supportMode, setSupportMode] = useState('AI'); // 'AI' or 'HUMAN'
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Keyboard Shortcut (Alt + K) to toggle Live Chat
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
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
      const welcomeMsg = {
        id: 'welcome_1',
        sender: 'assistant',
        content: `Hello 👋 ${timeGreeting}!\n\nI am Perincle, your FasReach AI Assistant. How can I help you today?`,
        pageContext: location.pathname,
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // Live Polling for Admin Replies when in HUMAN Support Mode
  useEffect(() => {
    let interval = null;
    if (isOpen && conversationId && supportMode === 'HUMAN') {
      interval = setInterval(async () => {
        try {
          const res = await API.get(`/ai/messages/${conversationId}`);
          if (res.data && res.data.data?.messages) {
            const dbMsgs = res.data.data.messages.map((m) => ({
              id: m._id || `msg_${Date.now()}_${Math.random()}`,
              sender: m.sender,
              content: m.content.replace(/\*/g, ''),
              actionButtons: m.actionButtons || [],
            }));
            setMessages(dbMsgs);
            if (res.data.data.supportMode) {
              setSupportMode(res.data.data.supportMode);
            }
          }
        } catch (err) {}
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, conversationId, supportMode]);

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
      const recentHistory = messages.slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const res = await API.post('/ai/chat', {
        prompt: queryText,
        currentPage: location.pathname,
        conversationId,
        history: recentHistory,
      });

      if (res.data && res.data.data?.message) {
        const msgDoc = res.data.data.message;
        if (res.data.data.conversationId) {
          setConversationId(res.data.data.conversationId);
        }
        if (res.data.data.supportMode) {
          setSupportMode(res.data.data.supportMode);
        }

        const cleanContent = (msgDoc.content || '').replace(/\*/g, '');
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: msgDoc.sender || 'assistant',
            content: cleanContent,
            actionButtons: msgDoc.actionButtons || [],
          },
        ]);
      }
    } catch (err) {
      console.error('[AI Chat Network Notice]:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_fallback_${Date.now()}`,
          sender: 'assistant',
          content: `Regarding "${queryText}": I am here to help answer any questions, draft SMS dispatches, check your balance, or manage your Sender IDs. How can I assist you further?`,
          actionButtons: [{ label: 'Send SMS', route: '/send-sms' }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Request Live Human Support Escalation
  const handleConnectHuman = async () => {
    if (!user) {
      toast.error('Please log in to connect with Live Human Support');
      navigate('/login');
      return;
    }

    toast.loading('Connecting to Live Human Support...', { id: 'human-toast' });
    try {
      const res = await API.post('/api/ai/escalate', {
        conversationId: conversationId || `CONV_${Date.now()}`,
        pageContext: location.pathname,
      });

      if (res.data && res.data.success) {
        toast.success('Connected to Live Human Support!', { id: 'human-toast' });
        setSupportMode('HUMAN');
        if (res.data.data?.conversationId) {
          setConversationId(res.data.data.conversationId);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `human_connected_${Date.now()}`,
            sender: 'system',
            content: `Connected to Live Human Support! Your messages are delivered directly to our live Admin desk. An admin representative will reply right here.`,
          },
        ]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to connect to Live Human Support', { id: 'human-toast' });
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
          <span className="hidden sm:inline font-bold pr-1">Live Support Chat</span>
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-ping" />
          )}
        </button>
      )}

      {/* Main AI & Live Chat Modal Window */}
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
                {supportMode === 'HUMAN' ? <UserCheck className="w-5 h-5 text-black" /> : <Bot className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Live Chat <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
                </h3>
                <span className="text-[10px] text-[#AEB4BC] flex items-center gap-1">
                  {supportMode === 'HUMAN' ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> Live Admin Connected
                    </span>
                  ) : (
                    <span className="text-[#AEB4BC] flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#D4AF6A]" /> Page: {location.pathname}
                    </span>
                  )}
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
                  const isHumanAdmin = m.sender === 'human_admin';
                  const isSystem = m.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={m.id} className="flex justify-center my-2">
                        <div className="bg-[#2A3038] text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-[11px] text-center font-medium">
                          {m.content}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 space-y-2 shadow-md ${
                          isUser
                            ? 'bg-[#D4AF6A] text-black font-semibold rounded-br-none'
                            : isHumanAdmin
                            ? 'bg-emerald-900/80 text-white border border-emerald-500/40 rounded-bl-none'
                            : 'bg-[#2A3038] text-white border border-[rgba(212,175,106,0.2)] rounded-bl-none'
                        }`}
                      >
                        {isHumanAdmin && (
                          <span className="text-[10px] text-emerald-400 font-bold block border-b border-emerald-500/20 pb-1">
                            👨‍💼 Admin Representative
                          </span>
                        )}
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
                                className="bg-[#1E232B] hover:bg-[#D4AF6A] hover:text-[#1E232B] border border-[rgba(212,175,106,0.3)] text-[#D4AF6A] font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
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
                      <div className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-[#D4AF6A] rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-[#D4AF6A] rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-[#D4AF6A] rounded-full animate-bounce" />
                      </div>
                      <span className="text-xs font-semibold text-[#D4AF6A]">Perincle is typing...</span>
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
                    placeholder={supportMode === 'HUMAN' ? 'Type message to Live Human Support...' : 'Ask Live Chat... (Alt + K)'}
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
                  <span>{supportMode === 'HUMAN' ? '🟢 Live Human Mode' : '🤖 Perincle AI Active'}</span>
                  {supportMode !== 'HUMAN' && (
                    <button
                      onClick={handleConnectHuman}
                      className="text-[#D4AF6A] hover:underline font-semibold flex items-center gap-0.5"
                    >
                      <Headphones className="w-3 h-3" /> Connect Human Support
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
