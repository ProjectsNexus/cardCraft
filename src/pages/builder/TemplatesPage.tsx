import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Layout, Lock } from 'lucide-react';
import { TEMPLATE_IMAGES } from '../../constants/templateBlobs';
import { ASSET_PATHS } from '../../constants/assets';

export const TemplatesPage = () => {
  const templates = [
    { id: 'minimal', name: 'Minimal Template', image: ASSET_PATHS.TEMPLATES.MINIMAL },
    { id: 'professional', name: 'Professional Template', image: ASSET_PATHS.TEMPLATES.PROFESSIONAL },
    { id: 'modern', name: 'Modern Template', image: ASSET_PATHS.TEMPLATES.MODERN },
    { id: 'dark', name: 'Dark Template', image: ASSET_PATHS.TEMPLATES.DARK },
    { id: 'creative', name: 'Creative Template', image: ASSET_PATHS.TEMPLATES.CREATIVE },
    { id: 'bold', name: 'Bold Template', image: ASSET_PATHS.TEMPLATES.BOLD },
    { id: 'elegant', name: 'Elegant Template', image: ASSET_PATHS.TEMPLATES.ELEGANT },
    { id: 'brutalist', name: 'Brutalist Template', image: ASSET_PATHS.TEMPLATES.BRUTALIST },
    { id: 'glass', name: 'Glassmorphism Template', image: ASSET_PATHS.TEMPLATES.GLASS },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/builder" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xl">Templates</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="mb-8 p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
          <h2 className="text-2xl font-black mb-2">Builder Templates — Coming Soon</h2>
          <p className="opacity-80">Landing Page Builder is not available in trial mode. Feature under development.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((t) => (
            <div key={t.id} className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
                <img 
                  src={t.image} 
                  alt={t.name}
                  className="w-full h-full object-cover opacity-50 grayscale"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = TEMPLATE_IMAGES[t.id] || ASSET_PATHS.PLACEHOLDERS.CARD_PREVIEW;
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                  <Lock className="text-white" size={32} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">{t.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Coming Soon</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
