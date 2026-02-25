import React from 'react';
import { MessageSquare } from 'lucide-react';
import { CardData } from '../../types';
import { SocialLinks } from '../SocialLinks';

export const CardTemplateMinimal = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
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
        <div className="flex flex-col items-center gap-3">
          <SocialLinks data={data} />
          {data.ctaLabel && data.ctaUrl && (
            <a 
              href={data.ctaUrl.startsWith('http') ? data.ctaUrl : `https://${data.ctaUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] transition-all hover:opacity-80 border"
              style={{ borderColor: data.primaryColor, color: data.primaryColor }}
            >
              {data.ctaLabel}
            </a>
          )}
        </div>
      </div>
      <p className="font-medium pt-2" style={{ color: data.primaryColor }}>{data.company}</p>
    </div>
  </div>
);
