import React from 'react';
import { MessageSquare, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { CardData } from '../../types';
import { SocialLinks } from '../SocialLinks';

export const CardTemplateGlass = ({ data }: { data: CardData; shareId: string | null }) => (
  <div 
    className="relative w-full h-full p-8 sm:p-12 flex flex-col justify-between overflow-hidden text-white"
    style={{ 
      background: `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%)`
    }}
  >
    {/* Animated Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-black/20 rounded-full blur-3xl animate-pulse" />

    <div className="z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
      <div className="flex flex-col items-center text-center space-y-6">
        {data.logo && (
          <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30">
            <img 
              src={data.logo} 
              alt="Logo" 
              className="object-contain" 
              style={{ width: `${data.logoSize}px`, height: `${data.logoSize}px` }} 
            />
          </div>
        )}
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2" style={{ fontSize: `${data.fontSize * 1.5}px` }}>{data.name}</h2>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] opacity-80">{data.title}</p>
          <p className="text-[10px] sm:text-xs opacity-60 mt-1">{data.company}</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4">
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: <Phone size={14} />, href: `tel:${data.phone}` },
            { icon: <Mail size={14} />, href: `mailto:${data.email}` },
            { icon: <Globe size={14} />, href: data.website.startsWith('http') ? data.website : `https://${data.website}` }
          ].map((item, i) => (
            <a 
              key={i} 
              href={item.href} 
              className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/30 border border-white/20 rounded-xl backdrop-blur-md transition-all"
            >
              {item.icon}
            </a>
          ))}
        </div>
        
        <div className="flex justify-center gap-3">
          <SocialLinks data={data} />
        </div>
      </div>
    </div>

    <div className="z-10 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Scan to connect</p>
    </div>
  </div>
);
