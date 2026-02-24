/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Palette, 
  Type, 
  Layout,
  Share2,
  RefreshCcw,
  Check,
  ChevronRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  X,
  Undo2,
  Redo2,
  MessageSquare,
  Zap,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CardData, CardTemplate, DEFAULT_CARD_DATA } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const InputField = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  placeholder,
  type = "text",
  prefix
}: { 
  label: string; 
  icon: any; 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
      <Icon size={12} />
      {label}
    </label>
    <div className="flex">
      {prefix && (
        <div className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-[10px] font-bold text-slate-400 flex items-center">
          {prefix}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full px-3 py-2 bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
          prefix ? "rounded-r-lg" : "rounded-lg"
        )}
      />
    </div>
  </div>
);

const ColorPicker = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void 
}) => (
  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
    <span className="text-xs font-medium text-slate-600">{label}</span>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
    />
  </div>
);

const SocialLinks = ({ data }: { data: CardData }) => {
  const links = [
    { id: 'instagram', icon: Instagram, url: `https://instagram.com/${data.instagram}`, value: data.instagram },
    { id: 'linkedin', icon: Linkedin, url: data.linkedin?.startsWith('http') ? data.linkedin : `https://linkedin.com/in/${data.linkedin}`, value: data.linkedin },
    { id: 'twitter', icon: Twitter, url: `https://twitter.com/${data.twitter}`, value: data.twitter },
  ].filter(l => l.value);

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-3">
      {links.map(link => (
        <a 
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
          style={{ color: data.textColor === '#ffffff' ? 'white' : data.primaryColor }}
        >
          <link.icon size={12} />
        </a>
      ))}
    </div>
  );
};

// --- Templates ---

const CardTemplateModern = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
  <div 
    className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden group"
    style={{ backgroundColor: data.secondaryColor, color: data.textColor }}
  >
    {/* Watermark */}
    <div className="absolute bottom-2 right-4 text-[8px] font-bold uppercase tracking-widest opacity-20 pointer-events-none select-none">
      Made with CardCraft
    </div>
    {/* Decorative element */}
    <div 
      className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-20"
      style={{ backgroundColor: data.primaryColor }}
    />
    
    <div className="z-10">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontSize: `${data.fontSize * 1.3}px` }}>{data.name}</h2>
          <p className="text-xs sm:text-sm font-medium opacity-80" style={{ color: data.primaryColor }}>{data.title}</p>
        </div>
        {data.logo ? (
          <img 
            src={data.logo} 
            alt="Logo" 
            className="object-contain" 
            style={{ width: `${data.logoSize * 0.8}px`, height: `${data.logoSize * 0.8}px` }} 
          />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: data.primaryColor }}>
            <Briefcase className="text-white" size={20} />
          </div>
        )}
      </div>
      <p className="mt-3 sm:mt-4 text-[10px] sm:text-sm font-semibold tracking-wide uppercase opacity-60">{data.company}</p>
      <SocialLinks data={data} />
    </div>

    <div className="z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-auto pt-4 sm:pt-6 border-t border-slate-200/50">
      <div className="space-y-1.5 sm:space-y-2">
        <a href={data.customCallLink ? `tel:${data.customCallLink}` : `tel:${data.phone}`} className="flex items-center gap-2 text-[10px] sm:text-[11px] hover:opacity-70 transition-opacity">
          <Phone size={10} style={{ color: data.primaryColor }} />
          <span className="truncate">{data.phone}</span>
        </a>
        <a href={data.customMailLink ? `mailto:${data.customMailLink}` : `mailto:${data.email}`} className="flex items-center gap-2 text-[10px] sm:text-[11px] hover:opacity-70 transition-opacity">
          <Mail size={10} style={{ color: data.primaryColor }} />
          <span className="truncate">{data.email}</span>
        </a>
        {(data.whatsapp || data.customWhatsappLink) && (
          <a href={data.customWhatsappLink ? `https://wa.me/${data.customWhatsappLink}` : `https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] sm:text-[11px] hover:opacity-70 transition-opacity">
            <MessageSquare size={10} style={{ color: data.primaryColor }} />
            <span className="truncate">{data.customWhatsappLink || data.whatsapp}</span>
          </a>
        )}
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <a href={data.customWebLink ? `https://${data.customWebLink}` : (data.website.startsWith('http') ? data.website : `https://${data.website}`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] sm:text-[11px] hover:opacity-70 transition-opacity">
          <Globe size={10} style={{ color: data.primaryColor }} />
          <span className="truncate">{data.website}</span>
        </a>
        <a href={data.customLocationLink ? `https://maps.google.com/?q=${encodeURIComponent(data.customLocationLink)}` : `https://maps.google.com/?q=${encodeURIComponent(data.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] sm:text-[11px] hover:opacity-70 transition-opacity">
          <MapPin size={10} style={{ color: data.primaryColor }} />
          <span className="truncate">{data.address}</span>
        </a>
      </div>
    </div>
  </div>
);

const CardTemplateMinimal = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
  <div 
    className="relative w-full h-full p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 overflow-hidden"
    style={{ backgroundColor: data.secondaryColor, color: data.textColor }}
  >
    {/* Watermark */}
    <div className="absolute bottom-2 right-4 text-[8px] font-bold uppercase tracking-widest opacity-20 pointer-events-none select-none">
      Made with CardCraft
    </div>
    {data.logo && (
      <img 
        src={data.logo} 
        alt="Logo" 
        className="object-contain mb-1 sm:mb-2" 
        style={{ width: `${data.logoSize * 0.8}px`, height: `${data.logoSize * 0.8}px` }} 
      />
    )}
    <div className="space-y-1">
      <h2 className="text-2xl sm:text-3xl font-light tracking-widest uppercase" style={{ fontSize: `${data.fontSize * 1.5}px` }}>{data.name}</h2>
      <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-50">{data.title}</p>
    </div>
    
    <div className="w-8 sm:w-12 h-[1px]" style={{ backgroundColor: data.primaryColor }} />
    
    <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-[11px] tracking-wider opacity-80">
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
        <a href={data.customCallLink ? `tel:${data.customCallLink}` : `tel:${data.phone}`} className="hover:opacity-70 transition-opacity">{data.phone}</a>
        <span className="hidden sm:inline">&bull;</span>
        <a href={data.customMailLink ? `mailto:${data.customMailLink}` : `mailto:${data.email}`} className="hover:opacity-70 transition-opacity">{data.email}</a>
      </div>
      <div className="flex flex-col items-center gap-1">
        <a href={data.customWebLink ? `https://${data.customWebLink}` : (data.website.startsWith('http') ? data.website : `https://${data.website}`)} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">{data.website}</a>
        {(data.whatsapp || data.customWhatsappLink) && (
          <a href={data.customWhatsappLink ? `https://wa.me/${data.customWhatsappLink}` : `https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: data.primaryColor }}>
            <MessageSquare size={10} />
            <span>{data.customWhatsappLink || data.whatsapp}</span>
          </a>
        )}
        <SocialLinks data={data} />
      </div>
      <p className="font-medium pt-2" style={{ color: data.primaryColor }}>{data.company}</p>
    </div>
  </div>
);

const CardTemplateProfessional = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
  <div 
    className="relative w-full h-full flex flex-col sm:flex-row overflow-hidden"
    style={{ backgroundColor: data.secondaryColor, color: data.textColor }}
  >
    {/* Watermark */}
    <div className="absolute bottom-2 right-4 text-[8px] font-bold uppercase tracking-widest opacity-20 pointer-events-none select-none z-20">
      Made with CardCraft
    </div>
    <div className="w-full sm:w-1/3 h-auto sm:h-full p-6 sm:p-8 flex flex-row sm:flex-col justify-between items-center sm:items-start" style={{ backgroundColor: data.primaryColor, color: 'white' }}>
      <div 
        className="bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden shrink-0"
        style={{ width: `${data.logoSize * 1.1}px`, height: `${data.logoSize * 1.1}px` }}
      >
        {data.logo ? (
          <img src={data.logo} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          <User size={data.logoSize * 0.5} />
        )}
      </div>
      <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4">
        <div className="p-1 bg-white rounded-lg shadow-sm">
          <QRCodeSVG 
            value={shareId ? `${window.location.origin}${window.location.pathname}?id=${shareId}` : `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nORG:${data.company}\nTITLE:${data.title}\nTEL:${data.phone}\nEMAIL:${data.email}\nURL:${data.website}\nEND:VCARD`}
            size={40}
            bgColor="transparent"
            fgColor={data.primaryColor}
          />
        </div>
        <p className="hidden sm:block text-[10px] opacity-70 leading-tight">Scan for contact</p>
      </div>
    </div>
    <div className="w-full sm:w-2/3 h-full p-6 sm:p-8 flex flex-col justify-center space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold" style={{ fontSize: `${data.fontSize * 1.2}px` }}>{data.name}</h2>
        <p className="text-xs sm:text-sm opacity-60">{data.title}</p>
        <SocialLinks data={data} />
      </div>
      <div className="space-y-2 sm:space-y-3">
        <a href={data.customCallLink ? `tel:${data.customCallLink}` : `tel:${data.phone}`} className="flex items-center gap-3 text-[10px] sm:text-xs hover:bg-slate-50 transition-colors rounded p-1 -ml-1">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-slate-100 flex items-center justify-center shrink-0">
            <Phone size={10} className="text-slate-500" />
          </div>
          <span className="truncate">{data.phone}</span>
        </a>
        <a href={data.customMailLink ? `mailto:${data.customMailLink}` : `mailto:${data.email}`} className="flex items-center gap-3 text-[10px] sm:text-xs hover:bg-slate-50 transition-colors rounded p-1 -ml-1">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-slate-100 flex items-center justify-center shrink-0">
            <Mail size={10} className="text-slate-500" />
          </div>
          <span className="truncate">{data.email}</span>
        </a>
        <a href={data.customWebLink ? `https://${data.customWebLink}` : (data.website.startsWith('http') ? data.website : `https://${data.website}`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[10px] sm:text-xs hover:bg-slate-50 transition-colors rounded p-1 -ml-1">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-slate-100 flex items-center justify-center shrink-0">
            <Globe size={10} className="text-slate-500" />
          </div>
          <span className="truncate">{data.website}</span>
        </a>
        {(data.whatsapp || data.customWhatsappLink) && (
          <a href={data.customWhatsappLink ? `https://wa.me/${data.customWhatsappLink}` : `https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[10px] sm:text-xs hover:bg-slate-50 transition-colors rounded p-1 -ml-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-slate-100 flex items-center justify-center shrink-0">
              <MessageSquare size={10} className="text-slate-500" />
            </div>
            <span className="truncate">{data.customWhatsappLink || data.whatsapp}</span>
          </a>
        )}
      </div>
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest pt-3 sm:pt-4 border-t border-slate-100">{data.company}</p>
    </div>
  </div>
);

const CardTemplateCreative = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
  <div 
    className="relative w-full h-full p-6 sm:p-10 flex flex-col justify-between overflow-hidden"
    style={{ backgroundColor: data.secondaryColor, color: data.textColor }}
  >
    {/* Watermark */}
    <div className="absolute bottom-2 right-4 text-[8px] font-bold uppercase tracking-widest opacity-20 pointer-events-none select-none">
      Made with CardCraft
    </div>
    {/* Abstract background shapes */}
    <div 
      className="absolute -top-10 -left-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-3xl opacity-30"
      style={{ backgroundColor: data.primaryColor }}
    />
    <div 
      className="absolute -bottom-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-3xl opacity-30"
      style={{ backgroundColor: data.primaryColor }}
    />

    <div className="z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="space-y-1">
        <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter" style={{ fontSize: `${data.fontSize * 1.6}px` }}>{data.name}</h2>
        <div className="inline-block px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white rounded" style={{ backgroundColor: data.primaryColor }}>
          {data.title}
        </div>
        <SocialLinks data={data} />
      </div>
      <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-1 sm:gap-2">
        {data.logo && (
          <img 
            src={data.logo} 
            alt="Logo" 
            className="object-contain" 
            style={{ width: `${data.logoSize * 0.8}px`, height: `${data.logoSize * 0.8}px` }} 
          />
        )}
        <p className="text-[10px] sm:text-xs font-bold opacity-40">{data.company}</p>
      </div>
    </div>

    <div className="z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
      <div className="space-y-1 text-[10px] sm:text-xs font-medium">
        <a href={data.customCallLink ? `tel:${data.customCallLink}` : `tel:${data.phone}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity"><span className="opacity-30">P</span> {data.phone}</a>
        <a href={data.customMailLink ? `mailto:${data.customMailLink}` : `mailto:${data.email}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity"><span className="opacity-30">E</span> {data.email}</a>
        <a href={data.customWebLink ? `https://${data.customWebLink}` : (data.website.startsWith('http') ? data.website : `https://${data.website}`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-70 transition-opacity"><span className="opacity-30">W</span> {data.website}</a>
        {(data.whatsapp || data.customWhatsappLink) && (
          <a href={data.customWhatsappLink ? `https://wa.me/${data.customWhatsappLink}` : `https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: data.primaryColor }}><MessageSquare size={10} /> {data.customWhatsappLink || data.whatsapp}</a>
        )}
      </div>
      <div className="w-12 h-12 sm:w-16 sm:h-16 p-1 bg-white rounded-lg sm:rounded-xl shadow-lg shrink-0">
        <QRCodeSVG 
          value={shareId ? `${window.location.origin}${window.location.pathname}?id=${shareId}` : data.website}
          size={128}
          className="w-full h-full"
          level="L"
        />
      </div>
    </div>
  </div>
);

const CardTemplateDark = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
  <div 
    className="relative w-full h-full p-6 sm:p-10 flex flex-col justify-between bg-slate-950 text-white overflow-hidden border-l-[6px] sm:border-l-[8px]"
    style={{ borderColor: data.primaryColor }}
  >
    {/* Watermark */}
    <div className="absolute bottom-2 right-4 text-[8px] font-bold uppercase tracking-widest opacity-20 pointer-events-none select-none">
      Made with CardCraft
    </div>
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontSize: `${data.fontSize * 1.3}px` }}>{data.name}</h2>
        <p className="text-xs sm:text-sm text-slate-400">{data.title}</p>
        <SocialLinks data={data} />
      </div>
      {data.logo && (
        <img 
          src={data.logo} 
          alt="Logo" 
          className="object-contain brightness-0 invert" 
          style={{ width: `${data.logoSize * 0.8}px`, height: `${data.logoSize * 0.8}px` }} 
        />
      )}
    </div>

    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2 sm:space-y-3">
          <div className="space-y-1">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500">Contact</p>
            <a href={data.customCallLink ? `tel:${data.customCallLink}` : `tel:${data.phone}`} className="block text-[10px] sm:text-xs truncate hover:text-slate-300 transition-colors">{data.phone}</a>
            <a href={data.customMailLink ? `mailto:${data.customMailLink}` : `mailto:${data.email}`} className="block text-[10px] sm:text-xs truncate hover:text-slate-300 transition-colors">{data.email}</a>
            {(data.whatsapp || data.customWhatsappLink) && (
              <a href={data.customWhatsappLink ? `https://wa.me/${data.customWhatsappLink}` : `https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] sm:text-xs truncate hover:text-slate-300 transition-colors" style={{ color: data.primaryColor }}>
                <MessageSquare size={10} />
                <span>{data.customWhatsappLink || data.whatsapp}</span>
              </a>
            )}
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="space-y-1">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500">Online</p>
            <a href={data.customWebLink ? `https://${data.customWebLink}` : (data.website.startsWith('http') ? data.website : `https://${data.website}`)} target="_blank" rel="noopener noreferrer" className="block text-[10px] sm:text-xs truncate hover:text-slate-300 transition-colors">{data.website}</a>
            <a href={data.customLocationLink ? `https://maps.google.com/?q=${encodeURIComponent(data.customLocationLink)}` : `https://maps.google.com/?q=${encodeURIComponent(data.address)}`} target="_blank" rel="noopener noreferrer" className="block text-[10px] sm:text-xs truncate hover:text-slate-300 transition-colors">Location</a>
            <p className="text-[10px] sm:text-xs truncate opacity-50">{data.company}</p>
          </div>
        </div>
      </div>
      <div className="pt-3 sm:pt-4 border-t border-slate-800">
        <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">{data.address}</p>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [history, setHistory] = useState<CardData[]>([DEFAULT_CARD_DATA]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'advanced'>('content');
  const [isPublishing, setIsPublishing] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewerMode, setIsViewerMode] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load shared card if ID exists in URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setIsViewerMode(true);
      fetch(`/api/cards/${id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setCardData(data);
            setShareId(id);
            setHistory([data]);
            setHistoryIndex(0);
          }
        })
        .catch(err => console.error("Failed to load card:", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // Keyboard shortcuts for undo/redo
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const pushToHistory = (newData: CardData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    if (newHistory.length > 50) {
      newHistory.shift();
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    setHistory(newHistory);
  };

  const updateData = (key: keyof CardData, value: any) => {
    const newData = { ...cardData, [key]: value };
    setCardData(newData);
    pushToHistory(newData);

    // Reset share ID if data changes
    if (shareId) setShareId(null);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setCardData(history[prevIndex]);
      setHistoryIndex(prevIndex);
      if (shareId) setShareId(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setCardData(history[nextIndex]);
      setHistoryIndex(nextIndex);
      if (shareId) setShareId(null);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });
      const data = await response.json();
      if (data.id) {
        setShareId(data.id);
        setShowPublishModal(true);
        // Update URL without reloading
        const newUrl = `${window.location.origin}${window.location.pathname}?id=${data.id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
    } catch (err) {
      console.error("Publish failed:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareId) return;
    const url = `${window.location.origin}${window.location.pathname}?id=${shareId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const closePublishModal = () => {
    setShowPublishModal(false);
    setShareId(null);
    // Reset URL
    window.history.pushState({}, '', window.location.pathname);
  };

  const templates: { id: CardTemplate; name: string; component: any }[] = [
    { id: 'modern', name: 'Modern', component: CardTemplateModern },
    { id: 'minimal', name: 'Minimal', component: CardTemplateMinimal },
    { id: 'professional', name: 'Professional', component: CardTemplateProfessional },
    { id: 'creative', name: 'Creative', component: CardTemplateCreative },
    { id: 'dark', name: 'Dark Mode', component: CardTemplateDark },
  ];

  const ActiveTemplate = templates.find(t => t.id === cardData.template)?.component || CardTemplateModern;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-indigo-600" size={32} />
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Loading Card...</p>
        </div>
      </div>
    );
  }

  if (isViewerMode && shareId) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-12">
        <div className="w-full max-w-[800px] flex flex-col gap-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden bg-white mx-auto"
          >
            <div className="aspect-[2/3] sm:aspect-[1.75/1] w-full min-w-[280px]">
              <ActiveTemplate data={cardData} shareId={shareId} />
            </div>
          </motion.div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 bg-white rounded-2xl p-1.5 shadow-xl shrink-0">
                <QRCodeSVG 
                  value={window.location.href}
                  size={128}
                  className="w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg leading-tight">{cardData.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{cardData.title}</p>
                <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mt-0.5">{cardData.company}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a 
                href={window.location.pathname}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95 w-full sm:w-auto"
              >
                Create Your Own
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Layout className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">CardCraft</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Visiting Card Builder</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 mr-2 border-r border-slate-100 pr-3">
            <button 
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo2 size={18} />
            </button>
            <button 
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo2 size={18} />
            </button>
          </div>

          <button 
            onClick={() => {
              const newData = DEFAULT_CARD_DATA;
              setCardData(newData);
              setShareId(null);
              window.history.pushState({}, '', window.location.pathname);
              pushToHistory(newData);
            }}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset to default"
          >
            <RefreshCcw size={18} />
          </button>
          
          {!shareId ? (
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isPublishing ? (
                <RefreshCcw size={16} className="animate-spin" />
              ) : (
                <Share2 size={16} />
              )}
              Publish & Link
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-95"
              >
                <Copy size={16} />
                Copy Link
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        {/* Sidebar / Editor */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('content')}
                className={cn(
                  "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === 'content' ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Content
              </button>
              <button 
                onClick={() => setActiveTab('design')}
                className={cn(
                  "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === 'design' ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Design
              </button>
              <button 
                onClick={() => setActiveTab('advanced')}
                className={cn(
                  "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all",
                  activeTab === 'advanced' ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Advanced
              </button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'content' ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <InputField label="Full Name" icon={User} value={cardData.name} onChange={(v) => updateData('name', v)} placeholder="John Doe" />
                    <InputField label="Job Title" icon={Briefcase} value={cardData.title} onChange={(v) => updateData('title', v)} placeholder="Senior Designer" />
                    <InputField label="Company" icon={Briefcase} value={cardData.company} onChange={(v) => updateData('company', v)} placeholder="TechFlow" />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Phone" icon={Phone} value={cardData.phone} onChange={(v) => updateData('phone', v)} placeholder="+1..." />
                      <InputField label="Email" icon={Mail} value={cardData.email} onChange={(v) => updateData('email', v)} placeholder="john@..." />
                    </div>
                    <InputField label="Website" icon={Globe} value={cardData.website} onChange={(v) => updateData('website', v)} placeholder="www.example.com" />
                    <InputField label="Address" icon={MapPin} value={cardData.address} onChange={(v) => updateData('address', v)} placeholder="City, Country" />
                    
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Share2 size={12} />
                        Social Media
                      </label>
                      <div className="space-y-3">
                        <InputField label="Instagram" icon={Instagram} value={cardData.instagram || ''} onChange={(v) => updateData('instagram', v)} placeholder="username" />
                        <InputField label="LinkedIn" icon={Linkedin} value={cardData.linkedin || ''} onChange={(v) => updateData('linkedin', v)} placeholder="profile-url" />
                        <InputField label="Twitter" icon={Twitter} value={cardData.twitter || ''} onChange={(v) => updateData('twitter', v)} placeholder="username" />
                      </div>
                    </div>
                  </motion.div>
                ) : activeTab === 'design' ? (
                  <motion.div 
                    key="design"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ImageIcon size={12} />
                          Logo
                        </div>
                        {cardData.logo && (
                          <span className="text-[10px] text-slate-400">Size: {cardData.logoSize}px</span>
                        )}
                      </label>
                      <div className="space-y-3">
                        {cardData.logo ? (
                          <div className="space-y-4">
                            <div className="relative group">
                              <div className="w-full h-24 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                <img src={cardData.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                              </div>
                              <button 
                                onClick={() => updateData('logo', undefined)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                              <input 
                                type="range" 
                                min="20" 
                                max="100" 
                                value={cardData.logoSize} 
                                onChange={(e) => updateData('logoSize', parseInt(e.target.value))}
                                className="w-full accent-indigo-600"
                              />
                              <div className="flex justify-between mt-1 text-[9px] text-slate-400 font-bold uppercase">
                                <span>Small</span>
                                <span>Logo Size</span>
                                <span>Large</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full h-24 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                            <Plus size={20} className="text-slate-400 mb-1" />
                            <span className="text-[10px] font-bold uppercase text-slate-400">Upload Logo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Layout size={12} />
                        Choose Template
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {templates.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => updateData('template', t.id)}
                            className={cn(
                              "px-3 py-2 text-xs font-medium rounded-lg border transition-all text-left",
                              cardData.template === t.id 
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/10" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                            )}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Palette size={12} />
                        Colors
                      </label>
                      <div className="space-y-2">
                        <ColorPicker label="Primary Color" value={cardData.primaryColor} onChange={(v) => updateData('primaryColor', v)} />
                        <ColorPicker label="Background" value={cardData.secondaryColor} onChange={(v) => updateData('secondaryColor', v)} />
                        <ColorPicker label="Text Color" value={cardData.textColor} onChange={(v) => updateData('textColor', v)} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Type size={12} />
                        Typography
                      </label>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <input 
                          type="range" 
                          min="12" 
                          max="24" 
                          value={cardData.fontSize} 
                          onChange={(e) => updateData('fontSize', parseInt(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase">
                          <span>Small</span>
                          <span>Base Size: {cardData.fontSize}px</span>
                          <span>Large</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="advanced"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-4">
                      <div className="flex items-center gap-2 text-indigo-700 mb-1">
                        <Zap size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Smart Links</span>
                      </div>
                      <p className="text-[10px] text-indigo-600 leading-relaxed">
                        Configure direct action links for your card. These can be used for buttons or QR codes.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {shareId && (
                        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-3">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase self-start">Card QR Code</h4>
                          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                            <QRCodeSVG 
                              value={`${window.location.origin}${window.location.pathname}?id=${shareId}`}
                              size={120}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                            Scan this code to view your digital card on any device.
                          </p>
                        </div>
                      )}

                      <InputField 
                        label="WhatsApp Number" 
                        icon={MessageSquare} 
                        value={cardData.whatsapp || ''} 
                        onChange={(v) => updateData('whatsapp', v)} 
                        placeholder="e.g. 1234567890" 
                      />
                      
                      <div className="space-y-3">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                          <Zap size={12} />
                          Custom Action Links (Optional)
                        </label>
                        <div className="space-y-3">
                          <InputField label="Custom Call Link" icon={Phone} value={cardData.customCallLink || ''} onChange={(v) => updateData('customCallLink', v)} placeholder={cardData.phone} prefix="tel:" />
                          <InputField label="Custom Mail Link" icon={Mail} value={cardData.customMailLink || ''} onChange={(v) => updateData('customMailLink', v)} placeholder={cardData.email} prefix="mailto:" />
                          <InputField label="Custom WhatsApp" icon={MessageSquare} value={cardData.customWhatsappLink || ''} onChange={(v) => updateData('customWhatsappLink', v)} placeholder={cardData.whatsapp} prefix="https://wa.me/" />
                          <InputField label="Custom Location URL" icon={MapPin} value={cardData.customLocationLink || ''} onChange={(v) => updateData('customLocationLink', v)} placeholder="Location Query" prefix="maps.google.com/?q=" />
                          <InputField label="Custom Web URL" icon={Globe} value={cardData.customWebLink || ''} onChange={(v) => updateData('customWebLink', v)} placeholder="www.example.com" prefix="https://" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                          <LinkIcon size={12} />
                          Active Endpoints
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Call</span>
                              <code className="text-[9px] text-indigo-500 truncate max-w-[150px]">{cardData.customCallLink ? `tel:${cardData.customCallLink}` : `tel:${cardData.phone}`}</code>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Mail</span>
                              <code className="text-[9px] text-indigo-500 truncate max-w-[150px]">{cardData.customMailLink ? `mailto:${cardData.customMailLink}` : `mailto:${cardData.email}`}</code>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp</span>
                              <code className="text-[9px] text-indigo-500 truncate max-w-[150px]">{cardData.customWhatsappLink ? `https://wa.me/${cardData.customWhatsappLink}` : `https://wa.me/${cardData.whatsapp}`}</code>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                              <code className="text-[9px] text-indigo-500 truncate max-w-[150px]">{cardData.customLocationLink ? `https://maps.google.com/?q=${encodeURIComponent(cardData.customLocationLink)}` : `https://maps.google.com/?q=${encodeURIComponent(cardData.address)}`}</code>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Developer API Info</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          These endpoints are available for integration with external systems or custom buttons.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-6 bg-indigo-900 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-bold mb-1">Pro Tip</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Use high-contrast colors for better readability. Dark backgrounds with light text look premium on digital screens.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>
        </aside>

        {/* Preview Area */}
        <section className="flex flex-col items-center justify-center min-h-[600px] bg-white rounded-3xl border border-slate-200 shadow-sm p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="relative z-10 w-full max-w-[600px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Preview</span>
              </div>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">3.5" x 2.0"</div>
                <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500">Standard Ratio</div>
              </div>
            </div>

            {/* The Card */}
            <motion.div 
              layout
              className="aspect-[2/3] sm:aspect-[1.75/1] w-full shadow-2xl rounded-xl overflow-hidden bg-white ring-1 ring-slate-200 mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              <div ref={cardRef} className="w-full h-full">
                <ActiveTemplate data={cardData} shareId={shareId} />
              </div>
            </motion.div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <Share2 size={18} />
                </div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Share Link</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <ImageIcon size={18} />
                </div>
                <p className="text-[10px] font-bold uppercase text-slate-500">High Res</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <Check size={18} />
                </div>
                <p className="text-[10px] font-bold uppercase text-slate-500">Print Ready</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Publish Success Modal */}
      <AnimatePresence>
        {showPublishModal && shareId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePublishModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Check size={20} className="bg-emerald-100 rounded-full p-1" />
                  <h3 className="font-bold text-slate-900">Card Published!</h3>
                </div>
                <button 
                  onClick={closePublishModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
                  <QRCodeSVG 
                    value={`${window.location.origin}${window.location.pathname}?id=${shareId}`}
                    size={180}
                  />
                </div>
                
                <div className="space-y-2 w-full">
                  <p className="text-sm font-medium text-slate-600">Your unique shareable link is ready.</p>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <code className="text-xs text-slate-500 truncate flex-1 text-left">
                      {`${window.location.origin}${window.location.pathname}?id=${shareId}`}
                    </code>
                    <button 
                      onClick={handleCopyLink} 
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg shadow-sm transition-all"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    <Copy size={16} />
                    Copy Link
                  </button>
                  <a 
                    href={`${window.location.origin}${window.location.pathname}?id=${shareId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
                  >
                    <ExternalLink size={16} />
                    View Card
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-medium">
          &copy; 2024 CardCraft Builder. Built for professionals.
        </p>
      </footer>
    </div>
  );
}
