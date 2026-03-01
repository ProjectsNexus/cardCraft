import React from 'react';
import { MessageSquare, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { CardData } from '../../types';
import { SocialLinks } from '../SocialLinks';

export const CardTemplateElegant = ({ data }: { data: CardData; shareId: string | null }) => (
  <div 
    className="relative w-full h-full p-8 sm:p-12 flex flex-col justify-between overflow-hidden font-serif"
    style={{ backgroundColor: '#FFFDF9', color: '#1A1A1A' }}
  >
    {/* Decorative Border */}
    <div className="absolute inset-4 border border-slate-200 pointer-events-none" />
    
    <div className="z-10 text-center space-y-4">
      {data.logo && (
        <img 
          src={data.logo} 
          alt="Logo" 
          className="mx-auto object-contain mb-6" 
          style={{ width: `${data.logoSize}px`, height: `${data.logoSize}px` }} 
        />
      )}
      <h2 className="text-3xl sm:text-4xl font-light tracking-widest uppercase" style={{ fontSize: `${data.fontSize * 1.6}px` }}>{data.name}</h2>
      <div className="w-12 h-[1px] bg-slate-300 mx-auto" />
      <p className="text-xs sm:text-sm tracking-[0.3em] uppercase opacity-60 italic">{data.title}</p>
    </div>

    <div className="z-10 grid grid-cols-1 gap-6 text-center">
      <div className="space-y-2 text-[10px] sm:text-xs tracking-widest uppercase opacity-80">
        <a href={`tel:${data.phone}`} className="block hover:opacity-60 transition-opacity">{data.phone}</a>
        <a href={`mailto:${data.email}`} className="block hover:opacity-60 transition-opacity">{data.email}</a>
        <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="block hover:opacity-60 transition-opacity">{data.website}</a>
      </div>
      
      <div className="flex justify-center gap-4">
        <SocialLinks data={data} />
      </div>
    </div>

    <div className="z-10 text-center pt-6 border-t border-slate-100">
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">{data.company}</p>
    </div>
  </div>
);
