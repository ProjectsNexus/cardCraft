import React from 'react';
import { MessageSquare } from 'lucide-react';
import { CardData } from '../../types';
import { SocialLinks } from '../SocialLinks';

export const CardTemplateDark = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
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
        <div className="flex flex-wrap items-center gap-3">
          <SocialLinks data={data} />
          {data.ctaLabel && data.ctaUrl && (
            <a 
              href={data.ctaUrl.startsWith('http') ? data.ctaUrl : `https://${data.ctaUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all hover:brightness-110"
              style={{ backgroundColor: data.primaryColor, color: 'white' }}
            >
              {data.ctaLabel}
            </a>
          )}
        </div>
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
