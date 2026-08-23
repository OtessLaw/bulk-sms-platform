import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  Mic,
  Volume2,
  Upload,
  Send,
  PhoneCall,
  Play,
  Square,
  RefreshCw,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Radio,
  FileAudio,
  AlertCircle,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function VoiceSMS() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('TTS'); // 'TTS' | 'Recording' | 'Upload'
  const [recipientPhone, setRecipientPhone] = useState('');
  const [textPrompt, setTextPrompt] = useState('');
  const [voiceGender, setVoiceGender] = useState('Female');
  const [voiceLanguage, setVoiceLanguage] = useState('en-GH');
  const [estimatedSeconds, setEstimatedSeconds] = useState(30);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioBase64, setAudioBase64] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Loading & History States
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalCalls: 0, totalAnswered: 0, totalSubmitted: 0 });
  const [loadingHistory, setLoadingHistory] = useState(true);

  const costPerCall = 0.08;
  const recipientCount = recipientPhone.split(/[\n,;]+/).map((p) => p.trim()).filter(Boolean).length || 1;
  const callBlocks = Math.ceil(estimatedSeconds / 30) || 1;
  const estimatedCostGHS = (recipientCount * callBlocks * costPerCall).toFixed(2);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await API.get('/voice/history');
      if (res.data?.success) {
        setHistory(res.data.data.calls || []);
        setStats(res.data.data.stats || { totalCalls: 0, totalAnswered: 0, totalSubmitted: 0 });
      }
    } catch (err) {
      console.error('Failed to load voice call history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Browser SpeechSynthesis Audio Preview for TTS
  const handleTTSPreview = () => {
    if (!textPrompt.trim()) {
      toast.error('Please enter a text prompt to listen to preview.');
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textPrompt);
      utterance.rate = 0.95;
      utterance.pitch = voiceGender === 'Female' ? 1.1 : 0.85;
      window.speechSynthesis.speak(utterance);
      toast.success('Playing AI voice preview...');
    } else {
      toast.error('Browser audio preview not supported on this browser.');
    }
  };

  // Start Mic Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        // Convert to base64 so backend can forward exact audio to Arkesel
        // No longer using base64, audioBlob is appended directly to FormData
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error('Microphone access denied or not available.');
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      // Keep a reference to the actual file in audioBlob so we can append it to FormData
      setAudioBlob(file);
      toast.success(`Loaded audio file: ${file.name}`);
    }
  };

  const handleSendVoiceCall = async (e) => {
    e.preventDefault();
    if (!recipientPhone.trim()) {
      toast.error('Please enter at least one recipient phone number.');
      return;
    }

    if (activeTab === 'TTS' && !textPrompt.trim()) {
      toast.error('Please enter text to convert to voice call.');
      return;
    }

    setSending(true);
    try {
      const formData = new FormData();
      formData.append('recipientPhone', recipientPhone);
      formData.append('type', activeTab);
      formData.append('voiceGender', voiceGender);
      formData.append('voiceLanguage', voiceLanguage);
      formData.append('durationSeconds', estimatedSeconds);
      
      if (textPrompt) formData.append('textPrompt', textPrompt);
      if (audioUrl) formData.append('audioUrl', audioUrl);
      
      if (activeTab === 'Recording' && audioBlob) {
        formData.append('audioFile', audioBlob, 'recording.wav');
      } else if (activeTab === 'Upload' && audioBlob) {
        formData.append('audioFile', audioBlob, 'upload.mp3');
      }

      const res = await API.post('/voice/send', formData);

      if (res.data?.success) {
        toast.success(res.data.message || 'Voice SMS dispatches sent successfully!');
        setRecipientPhone('');
        setTextPrompt('');
        setAudioUrl('');
        setAudioBase64('');
        setAudioBlob(null);
        fetchHistory();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch Voice SMS.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E232B]/90 border border-[rgba(212,175,106,0.25)] p-6 rounded-3xl backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 px-3 py-1 rounded-full text-xs font-bold text-[#D4AF6A]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Outbound Voice Broadcast Gateway</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">Voice SMS & Audio Dispatch</h1>
          <p className="text-xs text-[#AEB4BC]">
            Broadcast automated phone calls with AI Text-to-Speech or custom voice recordings across Ghana networks.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-[#2A3038] px-4 py-2.5 rounded-2xl border border-[rgba(212,175,106,0.15)] text-center">
            <span className="text-[10px] text-[#AEB4BC] block font-semibold">Total Calls</span>
            <span className="text-sm font-extrabold text-[#D4AF6A] font-mono">{stats.totalCalls}</span>
          </div>
          <div className="bg-[#2A3038] px-4 py-2.5 rounded-2xl border border-[rgba(212,175,106,0.15)] text-center">
            <span className="text-[10px] text-[#AEB4BC] block font-semibold">Rate / 30s</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">GHS 0.08</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Voice SMS Dispatch Creator Form */}
        <div className="lg:col-span-7 bg-[#2A3038]/90 border border-[rgba(212,175,106,0.25)] rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl">
          {/* Creation Tabs Selector */}
          <div className="flex p-1.5 bg-[#1E232B] rounded-2xl border border-[rgba(212,175,106,0.15)]">
            <button
              onClick={() => setActiveTab('TTS')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'TTS'
                  ? 'bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black shadow-md'
                  : 'text-[#AEB4BC] hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Text-to-Speech</span>
            </button>

            <button
              onClick={() => setActiveTab('Recording')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'Recording'
                  ? 'bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black shadow-md'
                  : 'text-[#AEB4BC] hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Mic Recorder</span>
            </button>

            <button
              onClick={() => setActiveTab('Upload')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'Upload'
                  ? 'bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] text-black shadow-md'
                  : 'text-[#AEB4BC] hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Audio</span>
            </button>
          </div>

          <form onSubmit={handleSendVoiceCall} className="space-y-5">
            {/* Recipient Phone Numbers */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>Recipient Phone Number(s)</span>
                <span className="text-[10px] text-[#D4AF6A] font-semibold">{recipientCount} Recipient(s)</span>
              </label>
              <textarea
                rows={2}
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="Enter numbers separated by comma or new line (e.g. 0241112233, 0559988776)"
                className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.3)] focus:border-[#D4AF6A] rounded-2xl p-3.5 text-xs text-white placeholder-[#AEB4BC]/60 focus:outline-none transition-all shadow-inner font-mono"
              />
            </div>

            {/* TAB 1: AI Text-to-Speech Mode */}
            {activeTab === 'TTS' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#AEB4BC] block mb-1">Voice Accent / Language</label>
                    <select
                      value={voiceLanguage}
                      onChange={(e) => setVoiceLanguage(e.target.value)}
                      className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.3)] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
                    >
                      <option value="en-GH">🇬🇭 Ghanaian English</option>
                      <option value="tw-GH">🗣️ Twi Accent</option>
                      <option value="en-US">🇺🇸 Standard English</option>
                      <option value="fr-FR">🇫🇷 French</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#AEB4BC] block mb-1">Voice Gender</label>
                    <select
                      value={voiceGender}
                      onChange={(e) => setVoiceGender(e.target.value)}
                      className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.3)] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF6A]"
                    >
                      <option value="Female">Female Voice</option>
                      <option value="Male">Male Voice</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-white">Voice Message Prompt</label>
                    <button
                      type="button"
                      onClick={handleTTSPreview}
                      className="text-[11px] font-bold text-[#D4AF6A] hover:underline flex items-center space-x-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Preview</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    placeholder="Type the message you want FasReach to speak on the phone call..."
                    className="w-full bg-[#1E232B] border border-[rgba(212,175,106,0.3)] focus:border-[#D4AF6A] rounded-2xl p-3.5 text-xs text-white placeholder-[#AEB4BC]/60 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Browser Microphone Recorder Mode */}
            {activeTab === 'Recording' && (
              <div className="space-y-4 bg-[#1E232B] p-5 rounded-2xl border border-[rgba(212,175,106,0.2)] animate-in fade-in duration-200 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isRecording
                        ? 'bg-rose-500/20 text-rose-400 border-2 border-rose-500 animate-pulse'
                        : 'bg-[#D4AF6A]/20 text-[#D4AF6A] border-2 border-[#D4AF6A]'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-sm font-bold text-white block">
                      {isRecording ? `Recording... (${recordingTime}s)` : audioUrl ? 'Voice Recorded!' : 'Click Mic to Start Recording'}
                    </span>
                    <span className="text-[11px] text-[#AEB4BC]">Max duration: 2 minutes (120 seconds)</span>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="bg-[#D4AF6A] text-black font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-md hover:bg-[#E7D3A4]"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Recording</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-md hover:bg-rose-500"
                      >
                        <Square className="w-4 h-4" />
                        <span>Stop Recording</span>
                      </button>
                    )}
                  </div>

                  {audioUrl && (
                    <div className="w-full pt-3">
                      <audio controls src={audioUrl} className="w-full rounded-xl" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Audio File Upload Mode */}
            {activeTab === 'Upload' && (
              <div className="space-y-4 bg-[#1E232B] p-5 rounded-2xl border border-[rgba(212,175,106,0.2)] animate-in fade-in duration-200 text-center">
                <div className="border-2 border-dashed border-[rgba(212,175,106,0.3)] rounded-2xl p-6 flex flex-col items-center justify-center space-y-2">
                  <FileAudio className="w-10 h-10 text-[#D4AF6A]" />
                  <span className="text-xs font-bold text-white block">Upload Pre-recorded Audio File</span>
                  <span className="text-[11px] text-[#AEB4BC]">Supports MP3, WAV, M4A up to 5MB</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="mt-2 text-xs text-[#AEB4BC] file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#D4AF6A] file:text-black hover:file:bg-[#E7D3A4] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Cost Summary Card */}
            <div className="bg-[#1E232B] p-4 rounded-2xl border border-[rgba(212,175,106,0.15)] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#AEB4BC] block">Estimated Cost:</span>
                <span className="text-sm font-extrabold text-[#D4AF6A] font-mono">GHS {estimatedCostGHS}</span>
              </div>
              <div className="text-right">
                <span className="text-[#AEB4BC] block">Call Block Duration:</span>
                <span className="text-white font-semibold">{estimatedSeconds}s ({callBlocks} Block)</span>
              </div>
            </div>

            {/* Dispatch Button */}
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-gradient-to-r from-[#D4AF6A] to-[#B88E3E] hover:from-[#E7D3A4] hover:to-[#D4AF6A] text-black font-extrabold text-xs py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-xl hover:shadow-[0_0_20px_rgba(212,175,106,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              <PhoneCall className={`w-4 h-4 ${sending ? 'animate-bounce' : ''}`} />
              <span>{sending ? 'Dispatching Voice Calls...' : 'Dispatch Outbound Voice SMS'}</span>
            </button>
          </form>
        </div>

        {/* Voice Call History & Delivery Analytics */}
        <div className="lg:col-span-5 bg-[#2A3038]/90 border border-[rgba(212,175,106,0.25)] rounded-3xl p-6 shadow-2xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-[rgba(212,175,106,0.15)] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#D4AF6A]" />
              <span>Recent Voice SMS Dispatches</span>
            </h3>
            <button onClick={fetchHistory} className="text-[#D4AF6A] hover:rotate-180 transition-transform p-1">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-12 text-center text-xs text-[#AEB4BC] flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF6A]" />
              <span>Loading call history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <PhoneCall className="w-8 h-8 text-[#AEB4BC]/40 mx-auto" />
              <p className="text-xs text-[#AEB4BC]">No Voice SMS dispatches yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#1E232B] p-3.5 rounded-2xl border border-[rgba(212,175,106,0.15)] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono">{item.recipientPhone}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.status === 'Answered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#AEB4BC] line-clamp-2">
                    {item.type === 'TTS' ? item.textPrompt : 'Voice Recording Broadcast'}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-[#AEB4BC]/80 pt-1 border-t border-white/5">
                    <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                    <span className="text-[#D4AF6A] font-bold">GHS {item.costGHS?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
