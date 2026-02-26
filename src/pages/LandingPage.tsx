import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, Zap, Palette, Layout, ChevronRight, User, 
  Check, Star, Plus, Minus, Mail, Phone, MapPin, 
  Twitter, Linkedin, Github, Instagram, ArrowRight,
  Shield, Globe, Smartphone, BarChart3, Users,
  Lock, ExternalLink, HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage = () => {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Palette size={24} />,
      title: "Custom Card Builder",
      description: "Design your professional identity with our intuitive drag-and-drop editor.",
      isPro: false
    },
    {
      icon: <Layout size={24} />,
      title: "Landing Page Builder",
      description: "Every card comes with a dedicated, high-converting landing page.",
      isPro: false
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Analytics Dashboard",
      description: "Track views, clicks, and engagement metrics for your digital presence.",
      isPro: false
    },
    {
      icon: <Users size={24} />,
      title: "Lead Collection",
      description: "Capture visitor information directly through your digital card.",
      isPro: true
    },
    {
      icon: <Shield size={24} />,
      title: "Unlimited Design Options",
      description: "Access premium fonts, custom CSS, and advanced layout configurations.",
      isPro: true
    },
    {
      icon: <ExternalLink size={24} />,
      title: "Export & Sharing Tools",
      description: "Share via QR, NFC, or direct link. Export contacts to your CRM.",
      isPro: false
    }
  ];

  const pricing = [
    {
      tier: "Free Trial",
      price: "$0",
      description: "Perfect for testing the waters",
      features: ["1 Digital Card", "1 Landing Page", "Basic Analytics", "Standard Templates"],
      cta: "Start Free Trial",
      highlight: false,
      footer: "No credit card required"
    },
    {
      tier: "Standard",
      price: "$12",
      period: "/mo",
      description: "For growing professionals",
      features: ["5 Digital Cards", "5 Landing Pages", "Advanced Analytics", "Lead Collection", "Custom Branding"],
      cta: "Upgrade to Standard",
      highlight: true,
      footer: "Upgrade anytime"
    },
    {
      tier: "Premium",
      price: "$29",
      period: "/mo",
      description: "For power users & teams",
      features: ["Unlimited Cards", "Unlimited Pages", "Team Management", "API Access", "Priority Support"],
      cta: "Go Premium",
      highlight: false,
      footer: "Custom solutions available"
    }
  ];

  const faqs = [
    {
      q: "How long is the free trial?",
      a: "Our free trial is perpetual for your first card! You can use 1 card and 1 landing page forever. Upgrading unlocks more capacity and pro features."
    },
    {
      q: "Can I upgrade my trial at any time?",
      a: "Yes! You can upgrade to a Standard or Premium plan directly from your dashboard whenever you're ready for more features."
    },
    {
      q: "What happens to my card if I cancel a subscription?",
      a: "If you cancel, your account reverts to the Free Trial tier. Your primary card remains active, but additional cards and pro features will be disabled."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors scroll-smooth">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
              <Share2 className="text-white dark:text-slate-900" size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">CardCraft</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold hover:text-indigo-600 transition-colors">Sign In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6">
              No credit card required
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Network Smarter with <br />
              <span className="text-indigo-600">Digital Visiting Cards.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
              Create your professional digital presence in minutes. Share your contact info, social links, and portfolio with a single scan or tap.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                Start Free Trial
              </Link>
              <a href="#templates" className="w-full sm:w-auto px-8 py-4 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                Preview Templates
              </a>
            </div>
          </motion.div>
          <div className="relative">
            <div className="aspect-square bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-center p-12">
              <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest">
                [ Hero Image: Card Mockups ]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Benefits */}
      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Why Choose CardCraft?</h2>
            <p className="text-slate-500 font-medium">Free trial includes <span className="text-indigo-600 font-bold">1 card + 1 landing page</span> forever.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap />, title: "Instant Setup", desc: "Go live in under 2 minutes with our templates." },
              { icon: <Smartphone />, title: "Mobile Optimized", desc: "Perfectly rendered on every device and screen size." },
              { icon: <Globe />, title: "Global Sharing", desc: "Share via QR, NFC, or link anywhere in the world." }
            ].map((benefit, i) => (
              <div key={i} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Powerful Features</h2>
            <p className="text-slate-500">Everything you need to stand out in the digital age.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors relative group">
                {f.isPro && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded">
                    Pro
                  </div>
                )}
                <div className="w-12 h-12 text-indigo-600 mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Template Gallery</h2>
            <p className="text-slate-500">Choose a starting point for your professional brand.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center text-slate-200 dark:text-slate-800 font-bold uppercase tracking-widest">
                  [ Template {i} ]
                </div>
                <div className="absolute top-4 left-4 px-2 py-0.5 bg-white/90 dark:bg-slate-800/90 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                  {i % 2 === 0 ? 'Pro' : 'Free'}
                </div>
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-4">
              Used by 10,000+ professionals
            </div>
            <h2 className="text-4xl font-black">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic mb-8">"This platform has completely transformed how I network. The digital card is a conversation starter every time."</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  <div>
                    <h4 className="font-bold text-sm">User Name</h4>
                    <p className="text-xs text-slate-400">Professional Role</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-500">Start for free, upgrade when you're ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((p, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${p.highlight ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-xl scale-105 z-10' : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50'}`}>
                <h4 className="text-lg font-black mb-2 uppercase tracking-widest text-slate-400">{p.tier}</h4>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">{p.price}</span>
                  {p.period && <span className="text-sm text-slate-400 font-bold">{p.period}</span>}
                </div>
                <p className="text-sm text-slate-500 mb-8">{p.description}</p>
                <ul className="space-y-4 mb-10">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-sm font-medium">
                      <Check size={16} className="text-indigo-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`block w-full py-4 rounded-xl font-black text-sm text-center uppercase tracking-widest transition-all ${p.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'}`}>
                  {p.cta}
                </Link>
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4">{p.footer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">FAQ</h2>
            <p className="text-slate-500">Everything you need to know about our trial and plans.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <span className="font-bold">{faq.q}</span>
                  {activeFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 text-sm text-slate-500 leading-relaxed">
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-black mb-6">Support & Help</h2>
            <p className="text-slate-500 mb-10">Need help with your trial or have questions about upgrading? Our team is here for you.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <HelpCircle className="text-indigo-600" />
                <a href="#" className="font-bold hover:text-indigo-600 transition-colors underline underline-offset-4">Visit Help Center</a>
              </div>
              <p className="text-xs text-slate-400 max-w-xs">Trial users receive standard support response times. Pro users get priority access.</p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
            <form className="space-y-4">
              <input type="text" placeholder="Name" className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
              <Share2 className="text-white dark:text-slate-900" size={14} />
            </div>
            <span className="font-bold text-lg tracking-tight">CardCraft</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Templates</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Help</a>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Twitter size={18} />
            <Linkedin size={18} />
            <Instagram size={18} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center mt-8 pt-8 border-t border-slate-50 dark:border-slate-900">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 CardCraft. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
