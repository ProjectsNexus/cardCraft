import React from 'react';
import { MessageSquare } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CardData } from '../../types';
import { SocialLinks } from '../SocialLinks';

export const CardTemplateCreative = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
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
        <div className="flex flex-wrap items-center gap-3">
          <SocialLinks data={data} />
          {data.ctaLabel && data.ctaUrl && (
            <a 
              href={data.ctaUrl.startsWith('http') ? data.ctaUrl : `https://${data.ctaUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-4 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-tighter hover:bg-white transition-all"
              style={{ borderColor: data.primaryColor, color: data.primaryColor }}
            >
              {data.ctaLabel}
            </a>
          )}
        </div>
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
          fgColor={data.qrColor}
        />
      </div>
    </div>
  </div>
);
