import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { HelpCircle, MessageSquare, PhoneCall, Mail, Instagram, Facebook, Twitter, MapPin, MessageCircle, ExternalLink } from 'lucide-react';

export default function HelpCenter() {
  const [contactInfo, setContactInfo] = useState({
    phone: '+233 24 111 2233',
    whatsapp: '+233 24 111 2233',
    email: 'support@fasreach.com',
    instagram: 'https://instagram.com/fasreach',
    facebook: 'https://facebook.com/fasreach',
    twitter: 'https://x.com/fasreach',
    address: 'Accra, Ghana',
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await API.get('/settings/contact');
      if (res.data.success) {
        setContactInfo(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch contact settings', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl w-full font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#D4AF6A]" /> Help Center & Official Support Desk
        </h1>
        <p className="text-xs text-[#AEB4BC]">24/7 technical support, official contact channels, and social media handles</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Support Phone */}
        <div className="bg-[#2A3038]/80 backdrop-blur-xl border border-[rgba(212,175,106,0.25)] rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between hover:border-[#D4AF6A]/50 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Call Support Line</h3>
            <p className="text-xs text-[#AEB4BC]">Direct voice call assistance with our support desk.</p>
          </div>
          <a
            href={`tel:${contactInfo.phone}`}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D4AF6A] bg-[#1E232B] px-3.5 py-2 rounded-xl border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] transition-colors w-fit"
          >
            <span>{contactInfo.phone}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* WhatsApp Support */}
        <div className="bg-[#2A3038]/80 backdrop-blur-xl border border-[rgba(212,175,106,0.25)] rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between hover:border-[#D4AF6A]/50 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">WhatsApp Live Chat</h3>
            <p className="text-xs text-[#AEB4BC]">Instant messaging & live ticket updates on WhatsApp.</p>
          </div>
          <a
            href={`https://wa.me/${contactInfo.whatsapp?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-[#1E232B] px-3.5 py-2 rounded-xl border border-emerald-500/20 hover:border-emerald-500 transition-colors w-fit"
          >
            <span>WhatsApp Us</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Email Support */}
        <div className="bg-[#2A3038]/80 backdrop-blur-xl border border-[rgba(212,175,106,0.25)] rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between hover:border-[#D4AF6A]/50 transition-all">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Official Email Desk</h3>
            <p className="text-xs text-[#AEB4BC]">Send billing or technical inquiries to our email team.</p>
          </div>
          <a
            href={`mailto:${contactInfo.email}`}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D4AF6A] bg-[#1E232B] px-3.5 py-2 rounded-xl border border-[rgba(212,175,106,0.2)] hover:border-[#D4AF6A] transition-colors w-fit"
          >
            <span>{contactInfo.email}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Social Media & Office Handles Card */}
      <div className="bg-[#2A3038]/70 backdrop-blur-md border border-[rgba(212,175,106,0.2)] rounded-3xl p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[rgba(212,175,106,0.15)] pb-3">
          <Instagram className="w-4 h-4 text-[#D4AF6A]" /> Connect With Us On Social Media
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Instagram */}
          {contactInfo.instagram && (
            <a
              href={contactInfo.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 p-3 bg-[#1E232B] border border-[rgba(212,175,106,0.15)] rounded-2xl hover:border-[#D4AF6A] transition-all group"
            >
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-[#AEB4BC] block">Instagram</span>
                <span className="text-xs font-bold text-white truncate block">Follow Instagram</span>
              </div>
            </a>
          )}

          {/* Facebook */}
          {contactInfo.facebook && (
            <a
              href={contactInfo.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 p-3 bg-[#1E232B] border border-[rgba(212,175,106,0.15)] rounded-2xl hover:border-[#D4AF6A] transition-all group"
            >
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-[#AEB4BC] block">Facebook</span>
                <span className="text-xs font-bold text-white truncate block">Join Facebook</span>
              </div>
            </a>
          )}

          {/* Twitter / X */}
          {contactInfo.twitter && (
            <a
              href={contactInfo.twitter}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 p-3 bg-[#1E232B] border border-[rgba(212,175,106,0.15)] rounded-2xl hover:border-[#D4AF6A] transition-all group"
            >
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                <Twitter className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-[#AEB4BC] block">Twitter / X</span>
                <span className="text-xs font-bold text-white truncate block">Follow X</span>
              </div>
            </a>
          )}
        </div>

        {contactInfo.address && (
          <div className="pt-2 flex items-center space-x-2 text-xs text-[#AEB4BC]">
            <MapPin className="w-4 h-4 text-[#D4AF6A] shrink-0" />
            <span>Official Address: <strong className="text-white">{contactInfo.address}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
