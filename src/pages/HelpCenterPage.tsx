import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, HelpCircle, Book, Zap, Shield, CreditCard, 
  MessageCircle, ChevronRight, ArrowLeft, Share2,
  Mail, Phone, Smartphone, Layout, Palette, Globe
} from 'lucide-react';

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Zap size={24} />,
    description: 'Learn the basics of creating and sharing your first digital card.',
    articles: [
      'How to create your first card',
      'Choosing the right template',
      'Setting up your profile',
      'Sharing via QR code'
    ]
  },
  {
    id: 'account',
    title: 'Account & Profile',
    icon: <Shield size={24} />,
    description: 'Manage your account settings, password, and profile visibility.',
    articles: [
      'Changing your password',
      'Updating profile information',
      'Managing multiple cards',
      'Privacy settings'
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Plans',
    icon: <CreditCard size={24} />,
    description: 'Information about our Free and Pro plans, and billing cycles.',
    articles: [
      'Free vs Pro features',
      'How to upgrade to Pro',
      'Managing your subscription',
      'Refund policy'
    ]
  },
  {
    id: 'templates',
    title: 'Templates & Design',
    icon: <Palette size={24} />,
    description: 'Customize your card with our advanced design tools and templates.',
    articles: [
      'Customizing colors and fonts',
      'Adding your logo',
      'Using custom CSS (Pro)',
      'Template-specific features'
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Leads',
    icon: <Layout size={24} />,
    description: 'Track your performance and manage captured leads.',
    articles: [
      'Understanding view metrics',
      'How lead collection works',
      'Exporting your leads',
      'Real-time tracking'
    ]
  },
  {
    id: 'sharing',
    title: 'Sharing & NFC',
    icon: <Globe size={24} />,
    description: 'Advanced sharing options including NFC and custom domains.',
    articles: [
      'Setting up NFC cards',
      'Custom domain setup',
      'Email signature integration',
      'Social media integration'
    ]
  }
];

const popularArticles = [
  'How to add a WhatsApp button to my card?',
  'Can I use my own domain name?',
  'How do I capture leads from my card?',
  'What is the difference between Free and Pro?',
  'How to reset my password?'
];

export const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.articles.some(art => art.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded flex items-center justify-center group-hover:scale-110 transition-transform">
              <Share2 className="text-white dark:text-slate-900" size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">CardCraft Help</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Sign In</Link>
            <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-900 py-20 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black tracking-tight mb-6"
          >
            How can we help you?
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search for articles, features, or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
            />
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Popular Articles */}
        {!searchQuery && (
          <section className="mb-20">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Popular Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularArticles.map((article, i) => (
                <button 
                  key={i}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group flex items-center justify-between"
                >
                  <span className="font-bold text-sm">{article}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Categories Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black">Browse Categories</h2>
            {searchQuery && (
              <p className="text-sm text-slate-500">Found {filteredCategories.length} categories</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category, i) => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
              >
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-black mb-3">{category.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  {category.description}
                </p>
                <div className="space-y-3">
                  {category.articles.map((article, j) => (
                    <button 
                      key={j}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1"
                    >
                      <span>{article}</span>
                      <ChevronRight size={12} />
                    </button>
                  ))}
                </div>
                <button className="mt-8 w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  View All Articles
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Still Need Help? */}
        <section className="mt-32 bg-indigo-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={32} />
            </div>
            <h2 className="text-3xl font-black mb-4">Still need help?</h2>
            <p className="text-indigo-100 mb-10 text-lg">
              Our support team is available 24/7 to help you with any questions or technical issues.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://wa.me/923000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} fill="currentColor" />
                WhatsApp Support
              </a>
              <button className="w-full sm:w-auto px-8 py-4 bg-indigo-700 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-800 transition-all border border-indigo-500">
                Email Support
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
              <Share2 className="text-white dark:text-slate-900" size={14} />
            </div>
            <span className="font-bold text-lg tracking-tight">CardCraft</span>
          </Link>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</Link>
            <Link to="/register" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 CardCraft</p>
        </div>
      </footer>
    </div>
  );
};
