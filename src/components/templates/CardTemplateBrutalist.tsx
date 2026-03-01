import React from 'react';
import { MessageSquare, Phone, Mail, Globe, MapPin, ArrowUpRight } from 'lucide-react';
import { CardData } from '../../types';
import { SocialLinks } from '../SocialLinks';

export const CardTemplateBrutalist = ({ data }: { data: CardData; shareId: string | null }) => (
  <div 
    className="relative w-full h-full p-6 sm:p-10 flex flex-col justify-between overflow-hidden font-mono"
    style={{ backgroundColor: data.primaryColor, color: '#000000' }}
  >
    {/* Grid Background */}
    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }} />
    
    <div className="z-10 border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-4xl sm:text-5xl font-black uppercase leading-none" style={{ fontSize: `${data.fontSize * 2}px` }}>
          {data.name.split(' ').map((part, i) => (
            <span key={i} className="block">{part}</span>
          ))}
        </h2>
        {data.logo && (
          <img 
            src={data.logo} 
            alt="Logo" 
            className="border-2 border-black p-1 bg-white" 
            style={{ width: `${data.logoSize}px`, height: `${data.logoSize}px` }} 
          />
        )}
      </div>
      <p className="inline-block bg-black text-white px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-tighter">
        {data.title} @ {data.company}
      </p>
    </div>

    <div className="z-10 grid grid-cols-1 gap-4">
      <div className="space-y-2">
        {[
          { icon: <Phone size={14} />, label: data.phone, href: `tel:${data.phone}` },
          { icon: <Mail size={14} />, label: data.email, href: `mailto:${data.email}` },
          { icon: <Globe size={14} />, label: data.website, href: data.website.startsWith('http') ? data.website : `https://${data.website}` }
        ].map((item, i) => (
          <a 
            key={i} 
            href={item.href} 
            className="flex items-center justify-between border-2 border-black p-3 bg-white hover:bg-black hover:text-white transition-all font-bold text-xs sm:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            <span className="flex items-center gap-2">{item.icon} {item.label}</span>
            <ArrowUpRight size={14} />
          </a>
        ))}
      </div>
      
      <div className="flex gap-2">
        <SocialLinks data={data} />
      </div>
    </div>
  </div>
);
