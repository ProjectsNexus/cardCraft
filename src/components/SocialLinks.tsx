import React from 'react';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { CardData } from '../types';

export const SocialLinks = ({ data }: { data: CardData }) => {
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
