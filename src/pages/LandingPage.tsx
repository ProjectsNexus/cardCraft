import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, Zap, Palette, Layout, ChevronRight, User, 
  Check, Star, Plus, Minus, Mail, Phone, MapPin, 
  Twitter, Linkedin, Github, Instagram, ArrowRight,
  Shield, Globe, Smartphone, BarChart3, Users,
  Lock, ExternalLink, HelpCircle, X, MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TEMPLATE_IMAGES, HERO_IMAGE_BLOB, APP_PREVIEW_BLOB } from '../constants/templateBlobs';
import { ASSET_PATHS } from '../constants/assets';
import { useTemplateImages } from '../contexts/TemplateImageContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
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
      toast.success('Message sent! Our team will get back to you shortly.');
      setSupportForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit support ticket:', err);
      toast.error('Failed to send message. Please try again later.');
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
    { name: "Minimal", id: "minimal", type: "Free", component: <CardTemplateMinimal data={getMockData('minimal', '#6366f1')} shareId={null} /> },
    { name: "Professional", id: "professional", type: "Free", component: <CardTemplateProfessional data={getMockData('professional', '#0f172a')} shareId={null} /> },
    { name: "Modern", id: "modern", type: "Pro", component: <CardTemplateModern data={getMockData('modern', '#ec4899')} shareId={null} /> },
    { name: "Dark", id: "dark", type: "Pro", component: <CardTemplateDark data={getMockData('dark', '#10b981')} shareId={null} /> },
    { name: "Creative", id: "creative", type: "Pro", component: <CardTemplateCreative data={getMockData('creative', '#f59e0b')} shareId={null} /> },
    { name: "Bold", id: "bold", type: "Free", component: <CardTemplateBold data={getMockData('bold', '#ef4444')} shareId={null} /> },
    { name: "Elegant", id: "elegant", type: "Pro", component: <CardTemplateElegant data={getMockData('elegant', '#8b5cf6')} shareId={null} /> },
    { name: "Brutalist", id: "brutalist", type: "Pro", component: <CardTemplateBrutalist data={getMockData('brutalist', '#000000')} shareId={null} /> },
    { name: "Glassmorphism", id: "glass", type: "Pro", component: <CardTemplateGlass data={getMockData('glass', '#06b6d4', '#3b82f6')} shareId={null} /> }
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
      isPro: true
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

  const comparisonFeatures = [
    { name: "Digital Card Templates", free: "3 Templates", pro: "All Templates", isBeta: false },
    { name: "Custom Branding", free: "Basic", pro: "Advanced", isBeta: false },
    { name: "Analytics", free: "Basic Views", pro: "Detailed Insights", isBeta: true },
    { name: "Lead Collection", free: "Limited", pro: "Unlimited", isBeta: true },
    { name: "QR Code Customization", free: "Standard", pro: "Custom Colors/Logo", isBeta: false },
    { name: "NFC Compatibility", free: "Yes", pro: "Yes", isBeta: false },
    { name: "Priority Support", free: "No", pro: "Yes", isBeta: false },
  ];

  const faqs = [
    {
      q: "How can I share my digital card?",
      a: "You can share your card via a unique URL, a QR code, or by using NFC-enabled devices. Your card is accessible on any device with a web browser."
    },
    {
      q: "Can I update my information later?",
      a: "Absolutely! You can log in to your dashboard at any time to update your contact details, social links, or profile picture. Changes are reflected instantly on your live card."
    },
    {
      q: "Is my data secure?",
      a: "Yes, we take security seriously. Your data is stored securely and we use industry-standard encryption to protect your information."
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
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight leading-none">CardCraft</span>
                <span className="text-[8px] px-1 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-black uppercase rounded">Beta</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">Templates</a>
            <Link to="/help" className="hover:text-slate-900 dark:hover:text-white transition-colors">Help Center</Link>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/923000000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
            >
              <MessageCircle size={16} fill="currentColor" />
              WhatsApp Us
            </a>
            <Link to="/login" className="text-sm font-semibold hover:text-indigo-600 transition-colors">Sign In</Link>
            <Link to="/register" className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
              <span className="text-gradient">Digital Visiting Cards.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
              Create your professional digital presence in minutes. Share your contact info, social links, and portfolio with a single scan or tap.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                Get Started
              </Link>
              <a 
                href="https://wa.me/923000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 border border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} fill="currentColor" />
                WhatsApp Us
              </a>
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
            <p className="text-slate-500 font-medium">Build your professional identity with <span className="text-indigo-600 font-bold">digital cards + landing pages</span>.</p>
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
                  <div className="absolute top-6 right-6 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded">
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

      {/* Comparison Table Section */}
      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Compare Plans</h2>
            <p className="text-slate-500">Choose the right level of professional presence for your needs.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-slate-400">Feature</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                    Free <span className="ml-1 text-[8px] px-1 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">BETA</span>
                  </th>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-indigo-600">
                    Pro <span className="ml-1 text-[10px] font-medium text-slate-400">(Rs. 1,500/mo)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <tr key={i} className="group border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-6 text-sm font-bold">
                      <div className="flex items-center gap-2">
                        {feature.name}
                        {feature.isBeta && (
                          <span className="text-[8px] px-1 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-black uppercase rounded">Beta</span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-sm text-slate-500 dark:text-slate-400">{feature.free}</td>
                    <td className="p-6 text-sm font-bold text-indigo-600">
                      {feature.pro}
                      <span className="ml-1 text-[10px] font-medium text-slate-400">
                        [Rs. 1,500]
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
              Get Started Now <ArrowRight size={20} />
            </Link>
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
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black">{t.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                        t.type === 'Pro' 
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {t.type}
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Perfect for clean, professional profiles with advanced layouts.
                  </p>
                </div>
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
            <p className="text-slate-500 mb-10">Have questions or need help? Our team is here for you.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <HelpCircle className="text-indigo-600" />
                <Link to="/help" className="font-bold hover:text-indigo-600 transition-colors underline underline-offset-4">Visit Help Center</Link>
              </div>
              <div className="flex items-center gap-4">
                <MessageCircle className="text-indigo-600" size={20} />
                <a href="https://wa.me/923000000000" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-indigo-600 transition-colors underline underline-offset-4">WhatsApp Support</a>
              </div>
              <p className="text-xs text-slate-400 max-w-xs">Our team typically responds within 24 hours.</p>
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

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/923000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[60] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all group"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={24} fill="currentColor" />
        <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
          Chat with us
        </span>
      </a>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
              <Share2 className="text-white dark:text-slate-900" size={14} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight">CardCraft</span>
              <span className="text-[8px] px-1 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-black uppercase">Beta</span>
            </div>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">Templates</a>
            <Link to="/help" className="hover:text-slate-900 dark:hover:text-white transition-colors">Help</Link>
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
