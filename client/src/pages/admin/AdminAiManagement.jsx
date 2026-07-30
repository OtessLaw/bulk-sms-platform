import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import {
  Bot,
  BrainCircuit,
  FileText,
  Plus,
  Trash2,
  TrendingUp,
  MessageSquare,
  Clock,
  ThumbsUp,
  Sliders,
  Sparkles,
  Layers,
  Save,
  User,
  Headphones,
  Send,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  Search,
  Bell,
  Power,
} from 'lucide-react';

export default function AdminAiManagement() {
  const [globalAiEnabled, setGlobalAiEnabled] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalQuestions: 0,
    globalAiEnabled: true,
    satisfactionRate: '98.4%',
    avgResponseTime: '1.1s',
    totalKnowledgeDocs: 0,
  });

  const [docs, setDocs] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [liveChats, setLiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [togglingGlobal, setTogglingGlobal] = useState(false);

  const selectedChatRef = useRef(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'General',
    targetPage: '',
    keywords: '',
    content: '',
  });

  // Keep selectedChatRef synchronized with selectedChat state
  useEffect(() => {
    selectedChatRef.current = selectedChat;
    if (selectedChat) {
      fetchChatMessages(selectedChat.conversationId);
    }
  }, [selectedChat]);

  // Master Polling Loop for Live Messages (Every 3 seconds)
  useEffect(() => {
    fetchAiData();
    const interval = setInterval(() => {
      fetchAiData();
      if (selectedChatRef.current) {
        fetchChatMessages(selectedChatRef.current.conversationId);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-select latest active conversation if none selected
  useEffect(() => {
    if (!selectedChat && liveChats.length > 0) {
      setSelectedChat(liveChats[0]);
    }
  }, [liveChats]);

  const fetchAiData = async () => {
    try {
      const statusRes = await API.get('/ai/system-status');
      if (statusRes.data.success) {
        setGlobalAiEnabled(statusRes.data.data.globalAiSupportEnabled);
      }

      const analyticsRes = await API.get('/ai/admin/analytics');
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }

      const docsRes = await API.get('/ai/admin/knowledge');
      if (docsRes.data.success) {
        setDocs(docsRes.data.data);
      }

      const logsRes = await API.get('/ai/admin/user-logs');
      if (logsRes.data.success) {
        setUserLogs(logsRes.data.data);
      }

      const liveChatsRes = await API.get('/ai/admin/live-chats');
      if (liveChatsRes.data.success) {
        setLiveChats(liveChatsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load AI analytics', err);
    }
  };

  const fetchChatMessages = async (convId) => {
    try {
      const res = await API.get(`/ai/messages/${convId}`);
      if (res.data.success) {
        setChatMessages(res.data.data.messages || []);
      }
    } catch (err) {
      // Silent catch
    }
  };

  const handleToggleGlobalAi = async () => {
    setTogglingGlobal(true);
    const nextState = !globalAiEnabled;
    try {
      const res = await API.post('/ai/admin/toggle-global-ai', { enabled: nextState });
      if (res.data.success) {
        setGlobalAiEnabled(nextState);
        toast.success(res.data.message);
        fetchAiData();
      }
    } catch (err) {
      toast.error('Failed to toggle global AI support status');
    } finally {
      setTogglingGlobal(false);
    }
  };

  const handleAdminReply = async (e) => {
    e.preventDefault();
    if (!selectedChat || !replyText.trim()) return;

    setReplying(true);
    try {
      const res = await API.post('/ai/admin/reply', {
        conversationId: selectedChat.conversationId,
        replyText: replyText.trim(),
      });

      if (res.data.success) {
        toast.success(`Reply sent live to ${selectedChat.userId?.name || 'Customer'}!`);
        setReplyText('');
        fetchChatMessages(selectedChat.conversationId);
        fetchAiData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const handleAddDoc = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/ai/admin/knowledge', newDoc);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAiData();
        setShowDocModal(false);
        setNewDoc({ title: '', category: 'General', targetPage: '', keywords: '', content: '' });
      }
    } catch (err) {
      toast.error('Failed to add document');
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Delete this knowledge document?')) return;
    try {
      const res = await API.delete(`/ai/admin/knowledge/${id}`);
      if (res.data.success) {
        toast.success('Document deleted');
        fetchAiData();
      }
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  const filteredChats = liveChats.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const name = c.userId?.name || '';
    const email = c.userId?.email || '';
    const mobile = c.userId?.mobileNumber || '';
    const title = c.title || '';
    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      mobile.toLowerCase().includes(term) ||
      title.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-full overflow-hidden font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[#D4AF6A] shrink-0" /> Master Support Control & AI Management
          </h1>
          <p className="text-xs text-[#AEB4BC]">Turn AI Support ON when away or OFF when online to answer live customer chats directly</p>
        </div>

        <button
          onClick={() => setShowDocModal(true)}
          className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Document</span>
        </button>
      </div>

      {/* MASTER AI SUPPORT TOGGLE BANNER */}
      <div className={`p-5 rounded-3xl border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
        globalAiEnabled
          ? 'bg-gradient-to-r from-[#1E232B] via-[#2A3038] to-[#1E232B] border-[#D4AF6A]/40'
          : 'bg-gradient-to-r from-emerald-950/80 via-[#2A3038] to-emerald-950/80 border-emerald-500/50'
      }`}>
        <div className="flex items-center space-x-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg ${
            globalAiEnabled ? 'bg-gradient-to-br from-[#D4AF6A] to-[#B88E3E] text-black' : 'bg-emerald-500 text-black animate-pulse'
          }`}>
            <Power className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Global AI Support Status:</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                globalAiEnabled ? 'bg-[#D4AF6A]/20 text-[#D4AF6A] border border-[#D4AF6A]/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {globalAiEnabled ? '🤖 ON (AI Handles Questions When Away)' : '👨‍💼 OFF (You Are Online - Live Admin Replies)'}
              </span>
            </div>
            <p className="text-xs text-[#AEB4BC] mt-0.5">
              {globalAiEnabled
                ? 'Perincle AI answers customer questions automatically. Turn OFF when you are around to reply to people yourself!'
                : 'AI Support is paused. All customer messages route directly to your Live Support Control Panel below for live replies!'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleGlobalAi}
          disabled={togglingGlobal}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shrink-0 ${
            globalAiEnabled
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
              : 'bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black hover:opacity-90'
          }`}
        >
          {globalAiEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          <span>{globalAiEnabled ? 'Turn OFF AI (I Am Around To Reply)' : 'Turn ON AI (I Am Away)'}</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#2A3038]/70 border border-[rgba(212,175,106,0.25)] rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-[#AEB4BC] uppercase font-semibold flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF6A]" /> Total Questions
          </span>
          <span className="text-xl font-extrabold text-white">{analytics.totalQuestions || userLogs.length || 0}</span>
        </div>

        <div className="bg-[#2A3038]/70 border border-emerald-500/25 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5 text-emerald-400" /> Customer Chats
          </span>
          <span className="text-xl font-extrabold text-emerald-400">{liveChats.length || 0}</span>
        </div>

        <div className="bg-[#2A3038]/70 border border-yellow-500/25 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-yellow-400 uppercase font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-yellow-400" /> Avg Response Time
          </span>
          <span className="text-xl font-extrabold text-yellow-400">{analytics.avgResponseTime}</span>
        </div>

        <div className="bg-[#2A3038]/70 border border-purple-500/25 rounded-2xl p-4 space-y-1">
          <span className="text-[11px] text-purple-400 uppercase font-semibold flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5 text-purple-400" /> Satisfaction Rate
          </span>
          <span className="text-xl font-extrabold text-purple-400">{analytics.satisfactionRate}</span>
        </div>
      </div>

      {/* Live Human Support Chat Desk */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
        <div className="flex justify-between items-center border-b border-[rgba(212,175,106,0.15)] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Headphones className="w-4 h-4 text-emerald-400" /> Super Admin Live Support Control Panel ({filteredChats.length})
          </h3>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <Bell className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> Live Stream Syncing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Conversations List */}
          <div className="bg-[#1E232B] rounded-2xl p-3 border border-[rgba(212,175,106,0.15)] space-y-2 max-h-96 overflow-y-auto">
            <div className="flex items-center gap-1.5 bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-2.5 py-1.5 mb-2">
              <Search className="w-3.5 h-3.5 text-[#AEB4BC] shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search customer name..."
                className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-[#AEB4BC]"
              />
            </div>

            <h4 className="text-[11px] font-bold text-[#AEB4BC] uppercase tracking-wider mb-2">Recent Customer Messages</h4>
            {filteredChats.length > 0 ? (
              filteredChats.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelectedChat(c)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedChat?._id === c._id
                      ? 'bg-[#2A3038] border-[#D4AF6A] shadow-md'
                      : 'bg-[#242A32] border-transparent hover:border-[rgba(212,175,106,0.2)]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-white flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#D4AF6A]" /> {c.userId?.name || 'Customer'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live Chat
                    </span>
                  </div>
                  <p className="text-[11px] text-[#AEB4BC] truncate mt-1">{c.title || 'Live Support Message'}</p>
                  <span className="text-[9px] text-[#AEB4BC] font-mono block mt-1">{new Date(c.updatedAt).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#AEB4BC] p-4 text-center">No customer conversations found.</p>
            )}
          </div>

          {/* Live Message Thread & Reply Box */}
          <div className="md:col-span-2 bg-[#1E232B] rounded-2xl p-4 border border-[rgba(212,175,106,0.15)] flex flex-col justify-between h-96">
            {selectedChat ? (
              <>
                {/* Chat Top Bar */}
                <div className="flex justify-between items-center border-b border-[rgba(212,175,106,0.15)] pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-400" /> {selectedChat.userId?.name || 'Customer'} ({selectedChat.userId?.mobileNumber || selectedChat.userId?.email || 'Guest User'})
                    </h4>
                    <span className="text-[10px] text-[#AEB4BC] font-mono">Page: {selectedChat.currentPage}</span>
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto space-y-3 py-3 text-xs">
                  {chatMessages.map((m) => {
                    const isUser = m.sender === 'user';
                    const isAdmin = m.sender === 'human_admin';

                    return (
                      <div key={m._id} className={`flex ${isAdmin ? 'justify-end' : isUser ? 'justify-start' : 'justify-center'}`}>
                        <div
                          className={`max-w-[80%] p-2.5 rounded-xl text-xs space-y-1 ${
                            isAdmin
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : isUser
                              ? 'bg-[#D4AF6A] text-black font-semibold rounded-bl-none'
                              : 'bg-[#2A3038] text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isAdmin && <span className="text-[9px] block text-emerald-200 font-bold">You (Super Admin)</span>}
                          {isUser && <span className="text-[9px] block text-black/70 font-bold">{selectedChat.userId?.name || 'Customer'}</span>}
                          <p className="whitespace-pre-line">{m.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleAdminReply} className="flex items-center gap-2 pt-2 border-t border-[rgba(212,175,106,0.15)]">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply live to ${selectedChat.userId?.name || 'customer'}...`}
                    className="flex-1 bg-[#2A3038] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="submit"
                    disabled={replying || !replyText.trim()}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply Live</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#AEB4BC] space-y-2">
                <Headphones className="w-8 h-8 text-[#D4AF6A] opacity-60 animate-pulse" />
                <p className="text-xs">Select a customer conversation from the left panel to reply live.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin User AI Questions & Support Logs Monitor */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
        <div className="flex justify-between items-center border-b border-[rgba(212,175,106,0.15)] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#D4AF6A]" /> User AI Questions & Support Logs ({userLogs.length})
          </h3>
          <span className="text-xs text-[#D4AF6A] font-mono">Live Admin Monitor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">User</th>
                <th className="pb-3 px-3">Question Asked</th>
                <th className="pb-3 px-3">Page Context</th>
                <th className="pb-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {userLogs.length > 0 ? (
                userLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#1E232B]/40">
                    <td className="py-3 px-3 font-bold text-[#D4AF6A] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#AEB4BC]" />
                      <span>{log.userId?.name || 'Guest User'}</span>
                    </td>
                    <td className="py-3 px-3 text-white max-w-md">{log.content}</td>
                    <td className="py-3 px-3 font-mono text-[#AEB4BC]">{log.pageContext || '/dashboard'}</td>
                    <td className="py-3 px-3 text-right text-[#AEB4BC]">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-[#AEB4BC]">
                    No user questions logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RAG Knowledge Base Document Manager */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-w-full overflow-hidden">
        <div className="flex justify-between items-center border-b border-[rgba(212,175,106,0.15)] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4AF6A]" /> RAG Knowledge Base Documents ({docs.length})
          </h3>
          <span className="text-xs text-[#D4AF6A] font-mono">Vector Index Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(212,175,106,0.15)] font-semibold text-[#AEB4BC] uppercase tracking-wider">
                <th className="pb-3 px-3">Title</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3">Target Page</th>
                <th className="pb-3 px-3">Keywords</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(212,175,106,0.1)] text-white">
              {docs.map((d) => (
                <tr key={d._id} className="hover:bg-[#1E232B]/40">
                  <td className="py-3 px-3 font-bold text-[#D4AF6A]">{d.title}</td>
                  <td className="py-3 px-3 text-[#AEB4BC]">{d.category}</td>
                  <td className="py-3 px-3 font-mono text-white">{d.targetPage || 'All Pages'}</td>
                  <td className="py-3 px-3 truncate max-w-xs text-[#AEB4BC]">{(d.keywords || []).join(', ')}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDeleteDoc(d._id)}
                      className="text-red-400 hover:text-red-300 p-1 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Upload Modal */}
      {showDocModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2A3038] border border-[rgba(212,175,106,0.3)] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D4AF6A]" /> Add Knowledge Base Document
            </h3>

            <form onSubmit={handleAddDoc} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="e.g. Sender ID Approval Guidelines"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#AEB4BC] mb-1">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="General">General</option>
                    <option value="Send SMS">Send SMS</option>
                    <option value="Sender ID">Sender ID</option>
                    <option value="Wallet & Payments">Wallet & Payments</option>
                    <option value="Contacts & Groups">Contacts & Groups</option>
                    <option value="Reports & Delivery">Reports & Delivery</option>
                    <option value="Developer API">Developer API</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#AEB4BC] mb-1">Target Page Path</label>
                  <input
                    type="text"
                    value={newDoc.targetPage}
                    onChange={(e) => setNewDoc({ ...newDoc, targetPage: e.target.value })}
                    placeholder="/send-sms or /wallet"
                    className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Search Keywords (Comma Separated)</label>
                <input
                  type="text"
                  value={newDoc.keywords}
                  onChange={(e) => setNewDoc({ ...newDoc, keywords: e.target.value })}
                  placeholder="header, approval, institution, status"
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#AEB4BC] mb-1">Document Content</label>
                <textarea
                  rows="5"
                  required
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                  placeholder="Write documentation text here..."
                  className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.2)] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowDocModal(false)} className="px-4 py-2 text-[#AEB4BC]">
                  Cancel
                </button>
                <button type="submit" className="bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black font-bold px-4 py-2 rounded-xl">
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
