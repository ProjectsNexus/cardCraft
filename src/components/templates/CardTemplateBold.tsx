import React from 'react';
import { MessageSquare, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { CardData } from '../../types';
import { SocialLinks } from '../SocialLinks';

export const CardTemplateBold = ({ data }: { data: CardData; shareId: string | null }) => (
  <div 
    className="relative w-full h-full p-8 sm:p-12 flex flex-col justify-between overflow-hidden"
    style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
  >
    {/* Large Background Text */}
    <div className="absolute top-0 right-0 text-[12rem] font-black opacity-5 select-none leading-none pointer-events-none">
      {data.company.substring(0, 2).toUpperCase()}
    </div>
    
    <div className="z-10">
      <div className="flex items-center gap-4 mb-8">
        {data.logo && (
          <img 
            src={data.logo} 
            alt="Logo" 
            className="bg-white p-2 rounded-xl" 
            style={{ width: `${data.logoSize}px`, height: `${data.logoSize}px` }} 
          />
        )}
        <div className="h-12 w-1 bg-indigo-600" />
        <div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter" style={{ fontSize: `${data.fontSize * 1.8}px` }}>{data.name}</h2>
          <p className="text-xs sm:text-sm font-bold text-indigo-500 uppercase tracking-widest">{data.title}</p>
        </div>
      </div>
    </div>

    <div className="z-10 space-y-8">
      <div className="grid grid-cols-1 gap-4">
        {[
          { icon: <Phone size={18} />, label: data.phone, href: `tel:${data.phone}` },
          { icon: <Mail size={18} />, label: data.email, href: `mailto:${data.email}` },
          { icon: <Globe size={18} />, label: data.website, href: data.website.startsWith('http') ? data.website : `https://${data.website}` }
        ].map((item, i) => (
          <a key={i} href={item.href} className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
              {item.icon}
            </div>
            <span className="text-sm sm:text-base font-bold tracking-tight">{item.label}</span>
          </a>
        ))}
      </div>
      
      <div className="flex gap-4">
        <SocialLinks data={data} />
      </div>
    </div>

    <div className="z-10 pt-8 border-t border-white/10">
      <p className="text-sm font-black uppercase tracking-widest">{data.company}</p>
      <p className="text-[10px] opacity-40 mt-1">{data.address}</p>
    </div>

    {/* Watermark */}
    <div className="absolute bottom-4 right-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-20 pointer-events-none select-none mix-blend-difference">
      Made with CardCraft
    </div>
  </div>
);
