import React from 'react';
import { User, Phone, Mail, Globe, MessageSquare } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CardData } from '../../types';
import { SocialLinks } from '../SocialLinks';

export const CardTemplateProfessional = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
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
        <div className="flex flex-wrap items-center gap-2">
          <SocialLinks data={data} />
          {data.ctaLabel && data.ctaUrl && (
            <a 
              href={data.ctaUrl.startsWith('http') ? data.ctaUrl : `https://${data.ctaUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-3 py-1.5 rounded bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
            >
              {data.ctaLabel}
            </a>
          )}
        </div>
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
