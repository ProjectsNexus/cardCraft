import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layout, ArrowLeft, Construction } from 'lucide-react';

export const BuilderPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xl">Landing Page Builder</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl"
        >
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Construction className="text-amber-600 dark:text-amber-400" size={40} />
          </div>
          <h2 className="text-2xl font-black mb-4">Coming Soon</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            The Landing Page Builder is currently under development. Soon you'll be able to create stunning landing pages for your digital cards.
          </p>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-sm font-bold">
            Landing Page Builder is not available in trial mode.
          </div>
          <p className="mt-6 text-xs text-slate-400 font-medium italic">Feature under development.</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
          <Link to="/builder/templates" className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors group">
            <Layout className="mb-4 text-slate-400 group-hover:text-indigo-600" />
            <h3 className="font-bold">Templates</h3>
            <p className="text-xs text-slate-500 mt-1">Browse layouts</p>
          </Link>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed">
            <Construction className="mb-4 text-slate-400" />
            <h3 className="font-bold">Assets</h3>
            <p className="text-xs text-slate-500 mt-1">Manage media</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed">
            <Construction className="mb-4 text-slate-400" />
            <h3 className="font-bold">Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Configure page</p>
          </div>
        </div>
      </main>
    </div>
  );
};
