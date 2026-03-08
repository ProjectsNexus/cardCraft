import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Globe, Shield, Users, MessageSquare, Star, Menu, X } from 'lucide-react';

export const PakLandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-pak-green selection:text-white bg-pak-cream">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-neutral-200/50 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-pak-green rounded-xl flex items-center justify-center text-white font-serif text-2xl font-bold group-hover:rotate-12 transition-transform">
              R
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-serif font-bold tracking-tight text-neutral-900 dark:text-white">
                Roshan
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-pak-gold">
                Digital Beta
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {['Features', 'Mission', 'Impact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-semibold text-neutral-500 hover:text-pak-green transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pak-green transition-all group-hover:w-full" />
              </a>
            ))}
            <button 
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-pak-green text-white rounded-full text-sm font-bold hover:bg-pak-green/90 transition-all shadow-xl shadow-pak-green/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Join Waitlist
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-neutral-900 dark:text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-8 flex flex-col gap-6 shadow-2xl"
          >
            {['Features', 'Mission', 'Impact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                onClick={() => setIsMenuOpen(false)} 
                className="text-xl font-serif font-bold"
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-5 bg-pak-green text-white rounded-2xl font-bold text-lg"
            >
              Join Waitlist
            </button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pak-green/5 border border-pak-green/10 text-pak-green text-xs font-bold uppercase tracking-widest mb-8"
            >
              <Star size={14} className="fill-pak-green" />
              Empowering the Nation
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-9xl font-serif font-bold leading-[0.85] text-neutral-900 dark:text-white mb-10 max-w-5xl"
            >
              The <span className="italic text-pak-green">Roshan</span> Era of <span className="text-pak-gold">Progress</span>.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed mb-12"
            >
              A localized digital ecosystem crafted for the unique heartbeat of Pakistan. From small shops to large enterprises, we're building for you.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 items-center"
            >
              <button 
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-pak-green text-white rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-pak-green/30 flex items-center gap-3 group"
              >
                Get Early Access <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/pak-user-${i}/100/100`}
                      alt="User"
                      className="w-12 h-12 rounded-full border-4 border-pak-cream dark:border-neutral-900 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-neutral-900 dark:text-white">1,200+ Joined</div>
                  <div className="text-xs text-neutral-500">Early adopters across Pakistan</div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,64,26,0.2)] border border-white/20">
              <img 
                src="https://picsum.photos/seed/pakistan-future/2400/1200" 
                alt="Digital Pakistan" 
                className="w-full aspect-[21/9] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pak-green/40 to-transparent" />
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-10 -right-10 hidden lg:block">
              <div className="pak-card p-8 flex items-center gap-6 shadow-2xl">
                <div className="w-16 h-16 bg-pak-gold/10 rounded-2xl flex items-center justify-center text-pak-gold">
                  <Globe size={32} />
                </div>
                <div>
                  <div className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">100%</div>
                  <div className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Localized</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-end mb-20">
            <div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                Crafted for the <span className="italic text-pak-green">Unique Needs</span> of our Market.
              </h2>
            </div>
            <div className="pb-4">
              <p className="text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed">
                We're not just building another app. We're building a solution that understands the nuances of Pakistani commerce, culture, and connectivity.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <MessageSquare className="text-pak-green" size={32} />,
                title: "Urdu First",
                desc: "Native support for Urdu and regional dialects, making digital tools accessible to everyone."
              },
              {
                icon: <Shield className="text-pak-green" size={32} />,
                title: "Local Compliance",
                desc: "Data stored within Pakistan, adhering to local regulations and ensuring maximum privacy."
              },
              {
                icon: <Users className="text-pak-green" size={32} />,
                title: "SME Focused",
                desc: "Tools designed specifically for the small and medium enterprises that drive our economy."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="w-20 h-20 bg-white dark:bg-neutral-900 rounded-[2rem] shadow-xl flex items-center justify-center mb-10 group-hover:bg-pak-green transition-all group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-serif font-bold mb-6">{feature.title}</h3>
                <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-32 bg-neutral-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-pak-green/10 blur-[120px] -z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 italic">Our Vision for 2030</h2>
            <div className="h-1 w-40 bg-pak-gold mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-16 text-center">
            {[
              { label: "Digital Literacy", value: "10M+", sub: "Users Empowered" },
              { label: "Economic Growth", value: "$5B+", sub: "Local Transaction Volume" },
              { label: "Connectivity", value: "100%", sub: "District Coverage" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-sm font-bold uppercase tracking-[0.3em] text-pak-gold mb-4">{stat.label}</div>
                <div className="text-6xl md:text-8xl font-serif font-bold mb-2">{stat.value}</div>
                <div className="text-neutral-400 font-medium">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-40 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-pak-green rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,64,26,0.4)]">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="pak-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#pak-pattern)" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-10 leading-tight">
                Be the <span className="italic text-pak-gold">First</span> to Experience the Future.
              </h2>
              <p className="text-xl text-white/80 mb-16 max-w-2xl mx-auto leading-relaxed">
                Join the exclusive beta waitlist. We're rolling out access in waves starting next month. Don't miss your spot in the digital revolution.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-8 py-5 rounded-3xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all text-lg"
                  />
                  <button 
                    type="submit"
                    className="px-10 py-5 bg-white text-pak-green rounded-3xl font-bold text-xl hover:bg-neutral-100 transition-all hover:scale-105 shadow-2xl"
                  >
                    Join Now
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 border border-white/20 rounded-[3rem] p-12 backdrop-blur-xl"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-pak-green mx-auto mb-8 shadow-2xl">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-4xl font-serif font-bold mb-4">You're on the list!</h3>
                  <p className="text-xl text-white/70">Check your inbox soon for a special welcome from the Roshan team.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pak-green rounded-xl flex items-center justify-center text-white font-serif text-2xl font-bold">
                  R
                </div>
                <span className="text-2xl font-serif font-bold tracking-tight">
                  Roshan
                </span>
              </div>
              <p className="text-neutral-500 leading-relaxed">
                Building the digital backbone for a prosperous Pakistan. Empowering every citizen with technology that feels like home.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-neutral-400">Platform</h4>
                <ul className="space-y-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                  <li><a href="#" className="hover:text-pak-green transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-pak-green transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-pak-green transition-colors">Beta Access</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-neutral-400">Company</h4>
                <ul className="space-y-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                  <li><a href="#" className="hover:text-pak-green transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-pak-green transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-pak-green transition-colors">Contact</a></li>
                </ul>
              </div>
              <div className="hidden sm:block">
                <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-neutral-400">Legal</h4>
                <ul className="space-y-4 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                  <li><a href="#" className="hover:text-pak-green transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-pak-green transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-neutral-200 dark:border-neutral-800 gap-6">
            <div className="text-sm text-neutral-400 font-medium">
              © 2026 Roshan Digital. All rights reserved.
            </div>
            <div className="flex gap-8 text-sm font-bold text-neutral-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pak-green rounded-full animate-pulse" />
                System Status: Online
              </span>
              <span>Made with ❤️ in Pakistan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

