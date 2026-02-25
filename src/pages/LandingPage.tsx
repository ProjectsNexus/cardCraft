import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Share2, Zap, Palette, Layout, ChevronRight } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Share2 className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">CardCraft</span>
        </div>
        <Link 
          to="/create" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Get Started
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 mb-6">
            Your Professional Identity, <br />
            <span className="text-indigo-600">Digitally Crafted.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Create stunning, interactive digital visiting cards in minutes. 
            Share your contact details, social links, and location with a simple QR scan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/create" 
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              Create Your Card <ChevronRight size={20} />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-indigo-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Sharing</h3>
            <p className="text-slate-600">Share your card via QR code or a unique link. No physical cards needed.</p>
          </div>
          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Palette className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Design</h3>
            <p className="text-slate-600">Choose from multiple templates and customize colors, fonts, and logos.</p>
          </div>
          <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
              <Layout className="text-amber-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Links</h3>
            <p className="text-slate-600">One-tap actions for calls, emails, WhatsApp, and Google Maps location.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200 bg-white text-center">
        <p className="text-slate-500 text-sm">© 2026 CardCraft. All rights reserved.</p>
      </footer>
    </div>
  );
};
