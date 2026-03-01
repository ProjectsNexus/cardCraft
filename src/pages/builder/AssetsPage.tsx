import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export const AssetsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/builder" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xl">Assets</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Construction className="text-slate-400" size={40} />
        </div>
        <h2 className="text-2xl font-black mb-4">Assets Manager — Coming Soon</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The Assets Manager is not available in trial mode. Feature under development.
        </p>
      </main>
    </div>
  );
};
