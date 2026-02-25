import React from 'react';
import { Phone, Mail, Globe, MapPin, MessageSquare, Briefcase } from 'lucide-react';
import { CardData } from '../../types';
import { SocialLinks } from '../SocialLinks';

export const CardTemplateModern = ({ data, shareId }: { data: CardData; shareId: string | null }) => (
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
      <div className="flex flex-wrap items-center gap-2">
        <SocialLinks data={data} />
        {data.ctaLabel && data.ctaUrl && (
          <a 
            href={data.ctaUrl.startsWith('http') ? data.ctaUrl : `https://${data.ctaUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:opacity-90 shadow-sm"
            style={{ backgroundColor: data.primaryColor, color: 'white' }}
          >
            {data.ctaLabel}
          </a>
        )}
      </div>
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
