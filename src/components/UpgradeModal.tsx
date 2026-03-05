import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Zap, Phone, CreditCard, MessageSquare } from 'lucide-react';
import { PLANS } from '../constants/plans';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export const UpgradeModal = ({ isOpen, onClose, featureName }: UpgradeModalProps) => {
  const proPlan = PLANS.pro;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Upgrade to Pro</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {featureName ? `Unlock ${featureName} and more.` : 'Take your networking to the next level.'}
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Pro Features</h4>
                  <ul className="space-y-3">
                    {proPlan.features.slice(0, 6).map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <Check size={16} className="text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Only</p>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{proPlan.price}</span>
                    <span className="text-sm text-slate-400 font-bold">{proPlan.period}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Billed monthly in Pakistan</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <Phone className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest">Local Payment Methods</p>
                    <p className="text-[10px] text-amber-700 dark:text-amber-500 font-medium">Pay via EasyPaisa, JazzCash, or Bank Transfer.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CreditCard size={18} />
                    Pay with Card
                  </button>
                  <button 
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={18} />
                    WhatsApp Support
                  </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Need help? Contact our Pakistani support team on WhatsApp.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
