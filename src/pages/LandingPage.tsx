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
import { TEMPLATE_IMAGES, HERO_IMAGE_BLOB, APP_PREVIEW_BLOB } from '../constants/templateBlobs';
import { ASSET_PATHS } from '../constants/assets';
import { useTemplateImages } from '../contexts/TemplateImageContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { TemplateImageGenerator } from '../components/TemplateImageGenerator';
import { CardTemplateMinimal } from '../components/templates/CardTemplateMinimal';
import { CardTemplateProfessional } from '../components/templates/CardTemplateProfessional';
import { CardTemplateModern } from '../components/templates/CardTemplateModern';
import { CardTemplateDark } from '../components/templates/CardTemplateDark';
import { CardTemplateCreative } from '../components/templates/CardTemplateCreative';
import { CardTemplateElegant } from '../components/templates/CardTemplateElegant';
import { CardTemplateBrutalist } from '../components/templates/CardTemplateBrutalist';
import { CardTemplateGlass } from '../components/templates/CardTemplateGlass';
import { CardTemplateBold } from '../components/templates/CardTemplateBold';
import { CardData, CardTemplate } from '../types';

export const LandingPage = () => {
  const { user } = useAuth();
  const { getTemplateImage } = useTemplateImages();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [supportForm, setSupportForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.name || !supportForm.email || !supportForm.message) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'support_tickets'), {
        ...supportForm,
        userId: user?.uid || null,
        status: 'open',
        timestamp: serverTimestamp()
      });
      setSubmitSuccess(true);
      setSupportForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit support ticket:', err);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMockData = (templateId: CardTemplate, primaryColor: string, secondaryColor: string = "#ffffff"): CardData => ({
    name: "Alex Rivera",
    title: "Creative Director",
    company: "Studio Nova",
    phone: "+1 (555) 123-4567",
    email: "alex@studionova.com",
    website: "studionova.com",
    primaryColor,
    secondaryColor,
    fontSize: 16,
    logoSize: 60,
    template: templateId,
    address: "123 Creative St, San Francisco, CA",
    textColor: templateId === 'dark' ? '#ffffff' : '#1e293b',
    linkedin: "linkedin.com/in/alex",
    twitter: "twitter.com/alex",
    qrColor: '#000000'
  });

  const templates = [
    { name: "Minimal", type: "Free", id: "minimal", component: <CardTemplateMinimal data={getMockData('minimal', '#6366f1')} shareId={null} /> },
    { name: "Professional", type: "Free", id: "professional", component: <CardTemplateProfessional data={getMockData('professional', '#0f172a')} shareId={null} /> },
    { name: "Modern", type: "Pro", id: "modern", component: <CardTemplateModern data={getMockData('modern', '#ec4899')} shareId={null} /> },
    { name: "Dark", type: "Pro", id: "dark", component: <CardTemplateDark data={getMockData('dark', '#10b981')} shareId={null} /> },
    { name: "Creative", type: "Pro", id: "creative", component: <CardTemplateCreative data={getMockData('creative', '#f59e0b')} shareId={null} /> },
    { name: "Bold", type: "Pro", id: "bold", component: <CardTemplateBold data={getMockData('bold', '#ef4444')} shareId={null} /> },
    { name: "Elegant", type: "Pro", id: "elegant", component: <CardTemplateElegant data={getMockData('elegant', '#8b5cf6')} shareId={null} /> },
    { name: "Brutalist", type: "Pro", id: "brutalist", component: <CardTemplateBrutalist data={getMockData('brutalist', '#000000')} shareId={null} /> },
    { name: "Glassmorphism", type: "Pro", id: "glass", component: <CardTemplateGlass data={getMockData('glass', '#06b6d4', '#3b82f6')} shareId={null} /> }
  ];

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
      features: ["5 Digital Cards", "5 Landing Pages", "Advanced Analytics", "Lead Collection", "WhatsApp API Integration", "Custom Branding", "Premium Templates"],
      cta: "Upgrade to Standard",
      highlight: true,
      footer: "Upgrade anytime"
    },
    {
      tier: "Premium",
      price: "$29",
      period: "/mo",
      description: "For power users & teams",
      features: ["Unlimited Cards", "Unlimited Pages", "Team Management", "WhatsApp API Integration", "API Access", "Priority Support", "All Premium Templates"],
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
            <div className="aspect-[4/5] bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 flex items-center justify-center p-6 overflow-hidden shadow-2xl relative group">
              {/* Card Mockup in Hero */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50" />
              <img 
                src={ASSET_PATHS.LANDING.HERO} 
                alt="Hero Card" 
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = HERO_IMAGE_BLOB;
                }}
              />
              <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="h-1/3 bg-indigo-600 relative">
                  <div className="absolute -bottom-10 left-8 w-20 h-20 bg-white dark:bg-slate-700 rounded-2xl shadow-xl border-4 border-white dark:border-slate-800 flex items-center justify-center text-indigo-600 font-black text-3xl">
                    JD
                  </div>
                </div>
                <div className="flex-1 p-10 pt-14">
                  <h3 className="text-2xl font-black mb-1">John Doe</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-6">Senior Product Designer</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <Mail size={16} className="text-indigo-600" />
                      <span>john@example.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <Smartphone size={16} className="text-indigo-600" />
                      <span>+1 (555) 000-0000</span>
                    </div>
                  </div>
                  <div className="mt-10 flex gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                      <Twitter size={18} />
                    </div>
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                      <Linkedin size={18} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute top-10 right-10 w-24 h-24 bg-indigo-600/20 backdrop-blur-3xl rounded-full blur-2xl" />
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-600/20 backdrop-blur-3xl rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us / Trial Benefits */}
      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 lg:order-1">
              <div className="aspect-video bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                <img 
                  src={ASSET_PATHS.LANDING.APP_PREVIEW} 
                  alt="Dashboard Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = APP_PREVIEW_BLOB;
                  }}
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-black mb-6">Manage Everything in One Place</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Our intuitive dashboard gives you full control over your digital cards. Track performance, update information, and manage your professional presence with ease.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time analytics tracking",
                  "Easy card customization",
                  "Lead management system",
                  "One-click sharing options"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-bold text-sm">
                    <Check className="text-indigo-600" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((t, i) => (
              <div key={i} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden relative cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                <div className="relative overflow-hidden">
                  <TemplateImageGenerator 
                    templateId={t.id}
                    renderComponent={t.component}
                    width={400}
                    height={300}
                    aspectRatio="aspect-[4/3]"
                    showDownload={false}
                    className="w-full"
                  />
                  <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-white/90 dark:bg-slate-800/90 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                    {t.type}
                  </div>
                  {t.type === 'Pro' && (
                    <div className="absolute top-6 right-6 z-20 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-lg">
                      <Zap size={14} fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black">{t.name}</h3>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.type === 'Free' ? 'Perfect for clean, professional profiles.' : 'Advanced layouts with custom backgrounds.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-24 px-6">
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
                  <img 
                    src={ASSET_PATHS.PLACEHOLDERS.USER_AVATAR} 
                    alt="User" 
                    className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/user${i}/100/100`;
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-sm">User Name</h4>
                    <p className="text-xs text-slate-400">Professional Role</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

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
                <Link
                  to={
                    p.tier === "Free Trial"
                      ? "/register"
                      : `https://wa.me/923135227047?text=${encodeURIComponent(
                          `Hi CardCraft Team, I wish to buy the ${p.tier} Plan.`
                        )}`
                  }
                  className={`block w-full py-4 rounded-xl font-black text-sm text-center uppercase tracking-widest transition-all ${
                    p.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
                  }`}
                >
                  {p.cta}
                </Link>
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4">{p.footer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6">
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
      <section id="contact" className="py-24 px-6 border-t border-slate-100 dark:border-slate-900">
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
            {submitSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-slate-500 dark:text-slate-400">Our team will get back to you shortly.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSupportSubmit}>
                <input 
                  type="text" 
                  placeholder="Name" 
                  required
                  value={supportForm.name}
                  onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  required
                  value={supportForm.email}
                  onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
                <textarea 
                  placeholder="Message" 
                  rows={4} 
                  required
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                />
                <button 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
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
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">Templates</a>
            <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Help</a>
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
