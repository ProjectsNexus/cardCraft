import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Image as ImageIcon, Layout, RefreshCw } from 'lucide-react';
import { TemplateImageGenerator } from '../components/TemplateImageGenerator';

// Import existing templates
import { CardTemplateMinimal } from '../components/templates/CardTemplateMinimal';
import { CardTemplateProfessional } from '../components/templates/CardTemplateProfessional';
import { CardTemplateModern } from '../components/templates/CardTemplateModern';
import { CardTemplateDark } from '../components/templates/CardTemplateDark';
import { CardTemplateCreative } from '../components/templates/CardTemplateCreative';
import { CardTemplateElegant } from '../components/templates/CardTemplateElegant';
import { CardTemplateBrutalist } from '../components/templates/CardTemplateBrutalist';
import { CardTemplateGlass } from '../components/templates/CardTemplateGlass';
import { CardTemplateBold } from '../components/templates/CardTemplateBold';

import { CardData } from '../types';

export const TemplateShowcasePage = () => {
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});

  // Mock data for template rendering
  const mockData: CardData = {
    name: "Alex Rivera",
    title: "Creative Director",
    company: "Studio Nova",
    phone: "+1 (555) 123-4567",
    email: "alex@studionova.com",
    website: "studionova.com",
    primaryColor: "#6366f1", // Vibrant Indigo
    secondaryColor: "#ffffff",
    fontSize: 16,
    logoSize: 60,
    template: "minimal",
    address: "123 Creative St, San Francisco, CA",
    textColor: "#1e293b",
    linkedin: "linkedin.com/in/alex",
    twitter: "twitter.com/alex",
    qrColor: "#000000"
  };

  const templates = [
    { id: 'minimal', name: 'Minimal', component: <CardTemplateMinimal data={mockData} shareId={null} /> },
    { id: 'professional', name: 'Professional', component: <CardTemplateProfessional data={mockData} shareId={null} /> },
    { id: 'modern', name: 'Modern', component: <CardTemplateModern data={mockData} shareId={null} /> },
    { id: 'dark', name: 'Dark', component: <CardTemplateDark data={mockData} shareId={null} /> },
    { id: 'creative', name: 'Creative', component: <CardTemplateCreative data={mockData} shareId={null} /> },
    { id: 'bold', name: 'Bold', component: <CardTemplateBold data={mockData} shareId={null} /> },
    { id: 'elegant', name: 'Elegant', component: <CardTemplateElegant data={mockData} shareId={null} /> },
    { id: 'brutalist', name: 'Brutalist', component: <CardTemplateBrutalist data={mockData} shareId={null} /> },
    { id: 'glass', name: 'Glassmorphism', component: <CardTemplateGlass data={mockData} shareId={null} /> },
  ];

  const handleImageGenerated = (id: string, url: string) => {
    setGeneratedImages(prev => ({ ...prev, [id]: url }));
  };

  const downloadAll = () => {
    (Object.entries(generatedImages) as [string, string][]).forEach(([id, url]) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `template-${id}.png`;
      link.click();
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-black text-xl tracking-tight">Template Generator</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Regenerate All"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={downloadAll}
              disabled={Object.keys(generatedImages).length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Download All
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-4">Static Previews</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            These images are generated in real-time from React components using modern-screenshot. 
            They can be used for SEO meta tags, social sharing previews, or static gallery displays.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {templates.map((t) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <TemplateImageGenerator 
                templateId={t.id}
                renderComponent={t.component}
                onImageGenerated={handleImageGenerated}
              />
              <div className="flex items-center justify-between px-2">
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest">{t.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold">PNG • 800x1000</p>
                </div>
                {generatedImages[t.id] && (
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase">Ready</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Info */}
        <div className="mt-24 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-black mb-6">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                <Layout size={20} />
              </div>
              <h4 className="font-bold">1. Render Component</h4>
              <p className="text-sm text-slate-500 leading-relaxed">The React component is rendered inside a hidden container with specific dimensions.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                <ImageIcon size={20} />
              </div>
              <h4 className="font-bold">2. Capture Canvas</h4>
              <p className="text-sm text-slate-500 leading-relaxed">modern-screenshot uses SVG foreignObject to accurately capture the component including modern CSS like oklch.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                <Download size={20} />
              </div>
              <h4 className="font-bold">3. Export Blob</h4>
              <p className="text-sm text-slate-500 leading-relaxed">The canvas is converted to a Data URL (base64) which can be used in img tags or downloaded.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
