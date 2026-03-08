import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Palette, 
  Type, 
  Layout,
  Share2,
  RefreshCcw,
  Check,
  ChevronRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  X,
  Undo2,
  Redo2,
  MessageSquare,
  Zap,
  Instagram,
  Linkedin,
  Twitter,
  Shield,
  Settings,
  LogOut,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { domToPng } from 'modern-screenshot';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CardData, CardTemplate, DEFAULT_CARD_DATA } from '../types';
import { InputField } from '../components/InputField';
import { ColorPicker } from '../components/ColorPicker';
import { SocialLinks } from '../components/SocialLinks';
import { ActiveTemplate } from '../components/ActiveTemplate';

const THEMES = [
  { name: 'Classic', primary: '#4f46e5', secondary: '#f8fafc', text: '#0f172a' },
  { name: 'Emerald', primary: '#059669', secondary: '#ecfdf5', text: '#064e3b' },
  { name: 'Rose', primary: '#e11d48', secondary: '#fff1f2', text: '#4c0519' },
  { name: 'Amber', primary: '#d97706', secondary: '#fffbeb', text: '#451a03' },
  { name: 'Violet', primary: '#7c3aed', secondary: '#f5f3ff', text: '#2e1065' },
  { name: 'Slate', primary: '#475569', secondary: '#f8fafc', text: '#0f172a' },
  { name: 'Midnight', primary: '#1e293b', secondary: '#0f172a', text: '#f8fafc' },
  { name: 'Sunset', primary: '#f43f5e', secondary: '#fbbf24', text: '#451a03' },
  { name: 'Ocean', primary: '#0ea5e9', secondary: '#064e3b', text: '#f0f9ff' },
];

export const EditorPage = () => {
  const { user, profile, isAdmin, isPro, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD_DATA);
  const [history, setHistory] = useState<CardData[]>([DEFAULT_CARD_DATA]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const [contentSubTab, setContentSubTab] = useState<'basic' | 'advanced'>('basic');
  const [isPublishing, setIsPublishing] = useState(false);
  const [shareId, setShareId] = useState<string | null>(editId);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load card if editing
  useEffect(() => {
    if (editId) {
      const fetchCard = async () => {
        const docSnap = await getDoc(doc(db, 'cards', editId));
        if (docSnap.exists()) {
          const data = docSnap.data() as CardData;
          setCardData(data);
          setHistory([data]);
          setHistoryIndex(0);
        }
      };
      fetchCard();
    }
  }, [editId]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const updateData = (field: keyof CardData, value: any) => {
    const newData = { ...cardData, [field]: value };
    setCardData(newData);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCardData(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCardData(history[newIndex]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQRCode = async () => {
    const element = document.getElementById('qr-standee');
    if (!element) return;

    try {
      const dataUrl = await domToPng(element, {
        scale: 3,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `qr-standee-${cardData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  const publishCard = async () => {
    if (!user) return;
    setIsPublishing(true);
    try {
      let currentShareId = editId;
      if (editId) {
        // Update existing card
        const cardRef = doc(db, 'cards', editId);
        await updateDoc(cardRef, {
          ...cardData,
          updatedAt: serverTimestamp(),
        });

        // Log the action
        await addDoc(collection(db, 'logs'), {
          userId: user.uid,
          cardId: editId,
          action: 'update',
          timestamp: serverTimestamp(),
          details: `Updated card: ${cardData.name}`
        });

        setShareId(editId);
      } else {
        // Create new card
        const cardPayload = {
          ...cardData,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'cards'), cardPayload);
        currentShareId = docRef.id;
        
        // Log the action
        await addDoc(collection(db, 'logs'), {
          userId: user.uid,
          cardId: docRef.id,
          action: 'create',
          timestamp: serverTimestamp(),
          details: `Published card: ${cardData.name}`
        });

        setShareId(docRef.id);
      }
      setShowPublishModal(true);
    } catch (error) {
      console.error("Failed to publish card:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const shareUrl = shareId ? `${window.location.origin}/view/${shareId}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteCard = async () => {
    if (!editId) return;
    if (window.confirm('Are you sure you want to delete this card? This will also remove all associated analytics and leads.')) {
      try {
        // Delete the card document
        await deleteDoc(doc(db, 'cards', editId));
        
        // Delete associated logs
        const logsQuery = query(collection(db, 'logs'), where('cardId', '==', editId));
        const logsSnap = await getDocs(logsQuery);
        const logDeletions = logsSnap.docs.map(d => deleteDoc(d.ref));
        
        // Delete associated leads
        const leadsQuery = query(collection(db, 'leads'), where('cardId', '==', editId));
        const leadsSnap = await getDocs(leadsQuery);
        const leadDeletions = leadsSnap.docs.map(d => deleteDoc(d.ref));
        
        // Wait for all deletions to complete
        await Promise.all([...logDeletions, ...leadDeletions]);
        
        navigate('/dashboard');
      } catch (err) {
        console.error('Error deleting card and associated data:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Share2 className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline dark:text-white">CardCraft</span>
          </Link>
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-1">
            <button 
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md disabled:opacity-30 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={18} />
            </button>
            <button 
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md disabled:opacity-30 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {editId && (
            <button 
              onClick={handleDeleteCard}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              title="Delete Card"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button 
            onClick={publishCard}
            disabled={isPublishing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
          >
            {isPublishing ? <RefreshCcw className="animate-spin" size={16} /> : <Share2 size={16} />}
            {isPublishing ? 'Publishing...' : 'Publish & Link'}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <User size={18} />
            </button>
            
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{profile?.displayName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile?.email}</p>
                      <span className="mt-2 inline-block px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase rounded">
                        {profile?.role}
                      </span>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/dashboard" 
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Layout size={16} />
                        Dashboard
                      </Link>
                      <Link 
                        to="/settings" 
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Shield size={16} />
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {(['content', 'design'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'content' && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4">
                    {(['basic', 'advanced'] as const).map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setContentSubTab(sub)}
                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 ${
                          contentSubTab === sub 
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                      >
                        {sub}
                        {sub === 'advanced' && !isPro && !isAdmin && (
                          <span className="px-1 py-0.5 bg-amber-400 text-slate-900 text-[7px] font-black rounded">PRO</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {contentSubTab === 'basic' ? (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <User size={16} className="text-indigo-500" />
                          Personal Info
                        </h3>
                        <InputField label="Full Name" icon={User} value={cardData.name} onChange={(v) => updateData('name', v)} placeholder="John Doe" />
                        <InputField label="Job Title" icon={Briefcase} value={cardData.title} onChange={(v) => updateData('title', v)} placeholder="Software Engineer" />
                        <InputField label="Company" icon={Briefcase} value={cardData.company} onChange={(v) => updateData('company', v)} placeholder="Tech Corp" />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Phone size={16} className="text-indigo-500" />
                          Contact Details
                        </h3>
                        <InputField label="Phone Number" icon={Phone} value={cardData.phone} onChange={(v) => updateData('phone', v)} placeholder="+1 234 567 890" />
                        <div className="space-y-2">
                          <InputField label="WhatsApp" icon={MessageSquare} value={cardData.whatsapp || ''} onChange={(v) => updateData('whatsapp', v)} placeholder="+1 234 567 890" />
                          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <Zap size={14} className={cardData.whatsappApiEnabled ? "text-indigo-500" : "text-slate-400"} />
                              <div>
                                <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">WhatsApp API</p>
                                <p className="text-[9px] text-slate-500">Official Business Integration</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (profile?.plan === 'free') {
                                  if (window.confirm('WhatsApp API is a premium feature. Upgrade to Pro to enable official business messaging?')) {
                                    navigate('/pricing');
                                  }
                                } else {
                                  updateData('whatsappApiEnabled', !cardData.whatsappApiEnabled);
                                }
                              }}
                              className={`w-10 h-5 rounded-full transition-all relative ${
                                cardData.whatsappApiEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                                cardData.whatsappApiEnabled ? 'left-5.5' : 'left-0.5'
                              }`} />
                            </button>
                          </div>
                        </div>
                        <InputField label="Email Address" icon={Mail} value={cardData.email} onChange={(v) => updateData('email', v)} placeholder="john@example.com" />
                        <InputField label="Website" icon={Globe} value={cardData.website} onChange={(v) => updateData('website', v)} placeholder="www.johndoe.com" />
                        <InputField label="Address" icon={MapPin} value={cardData.address} onChange={(v) => updateData('address', v)} placeholder="New York, USA" />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Zap size={16} className="text-indigo-500" />
                          Call to Action
                        </h3>
                        <InputField label="Button Label" icon={Type} value={cardData.ctaLabel || ''} onChange={(v) => updateData('ctaLabel', v)} placeholder="View Portfolio" />
                        <InputField label="Button URL" icon={LinkIcon} value={cardData.ctaUrl || ''} onChange={(v) => updateData('ctaUrl', v)} placeholder="https://portfolio.com" />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Share2 size={16} className="text-indigo-500" />
                          Social Media
                        </h3>
                        <InputField label="Instagram" icon={Instagram} value={cardData.instagram || ''} onChange={(v) => updateData('instagram', v)} placeholder="username" prefix="@" />
                        <InputField label="LinkedIn" icon={Linkedin} value={cardData.linkedin || ''} onChange={(v) => updateData('linkedin', v)} placeholder="username or profile URL" />
                        <InputField label="Twitter / X" icon={Twitter} value={cardData.twitter || ''} onChange={(v) => updateData('twitter', v)} placeholder="username" prefix="@" />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      {!isPro && !isAdmin ? (
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Zap className="text-amber-600" size={24} />
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Pro Features</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            Custom action links and official WhatsApp API integration are available for Pro users.
                          </p>
                          <Link to="/#pricing" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all">
                            Upgrade Now
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 space-y-3">
                            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                              <Zap size={18} />
                              <h3 className="font-bold text-sm">Smart Actions</h3>
                            </div>
                            <p className="text-xs text-indigo-600 dark:text-indigo-300 leading-relaxed">
                              These links allow you to override the default behavior for contact buttons.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <LinkIcon size={16} className="text-indigo-500" />
                              Custom Action Links (Optional)
                            </label>
                            <div className="space-y-3">
                              <InputField label="Custom Call Link" icon={Phone} value={cardData.customCallLink || ''} onChange={(v) => updateData('customCallLink', v)} placeholder={cardData.phone} prefix="tel:" />
                              <InputField label="Custom Mail Link" icon={Mail} value={cardData.customMailLink || ''} onChange={(v) => updateData('customMailLink', v)} placeholder={cardData.email} prefix="mailto:" />
                              <InputField label="Custom WhatsApp" icon={MessageSquare} value={cardData.customWhatsappLink || ''} onChange={(v) => updateData('customWhatsappLink', v)} placeholder={cardData.whatsapp} prefix="https://wa.me/" />
                              <InputField label="Custom Location URL" icon={MapPin} value={cardData.customLocationLink || ''} onChange={(v) => updateData('customLocationLink', v)} placeholder="Location Query" prefix="maps.google.com/?q=" />
                              <InputField label="Custom Web URL" icon={Globe} value={cardData.customWebLink || ''} onChange={(v) => updateData('customWebLink', v)} placeholder="www.example.com" prefix="https://" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                              <LinkIcon size={12} />
                              Active Endpoints
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Call</span>
                                  <code className="text-[9px] text-indigo-500 dark:text-indigo-400 truncate max-w-[150px]">{cardData.customCallLink ? `tel:${cardData.customCallLink}` : `tel:${cardData.phone}`}</code>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Mail</span>
                                  <code className="text-[9px] text-indigo-500 dark:text-indigo-400 truncate max-w-[150px]">{cardData.customMailLink ? `mailto:${cardData.customMailLink}` : `mailto:${cardData.email}`}</code>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">WhatsApp</span>
                                  <code className="text-[9px] text-indigo-500 dark:text-indigo-400 truncate max-w-[150px]">{cardData.customWhatsappLink ? `https://wa.me/${cardData.customWhatsappLink}` : `https://wa.me/${cardData.whatsapp}`}</code>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Location</span>
                                  <code className="text-[9px] text-indigo-500 dark:text-indigo-400 truncate max-w-[150px]">{cardData.customLocationLink ? `https://maps.google.com/?q=${encodeURIComponent(cardData.customLocationLink)}` : `https://maps.google.com/?q=${encodeURIComponent(cardData.address)}`}</code>
                                </div>
                              </div>
                            </div>
                          </div>

                          {shareId && (
                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                              <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Layout size={16} className="text-indigo-500" />
                                Card QR Code
                              </label>
                              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center gap-3">
                                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                  <QRCodeSVG value={shareUrl} size={120} fgColor={cardData.qrColor} />
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-slate-400 font-medium text-center">Scan to view your digital card</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'design' && (
                <motion.div
                  key="design"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layout size={16} className="text-indigo-500" />
                      Template
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(['modern', 'minimal', 'professional', 'creative', 'dark', 'bold', 'elegant', 'brutalist', 'glass'] as CardTemplate[]).map((t) => {
                        const isTemplatePro = ['modern', 'dark', 'creative', 'elegant', 'brutalist', 'glass'].includes(t);
                        return (
                          <button
                            key={t}
                            onClick={() => {
                              if (isTemplatePro && !isPro && !isAdmin) {
                                if (window.confirm(`${t.charAt(0).toUpperCase() + t.slice(1)} is a Pro template. Upgrade to unlock all premium designs?`)) {
                                  navigate('/#pricing');
                                }
                              } else {
                                updateData('template', t);
                              }
                            }}
                            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all relative ${
                              cardData.template === t 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' 
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            {t}
                            {isTemplatePro && !isPro && !isAdmin && (
                              <span className="absolute -top-1 -right-1 px-1 py-0.5 bg-amber-400 text-slate-900 text-[7px] font-black rounded shadow-sm">
                                PRO
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Palette size={16} className="text-indigo-500" />
                      Color Themes
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => {
                            updateData('primaryColor', theme.primary);
                            updateData('secondaryColor', theme.secondary);
                            updateData('textColor', theme.text);
                          }}
                          className={`flex-shrink-0 group flex flex-col items-center gap-2 transition-all ${
                            cardData.primaryColor === theme.primary ? 'scale-110' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div 
                            className={`w-12 h-12 rounded-full border-2 shadow-lg transition-all ${
                              cardData.primaryColor === theme.primary ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-white dark:border-slate-800'
                            }`}
                            style={{ 
                              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` 
                            }}
                          />
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Palette size={16} className="text-indigo-500" />
                      Custom Colors
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <ColorPicker label="Primary Color" value={cardData.primaryColor} onChange={(v) => updateData('primaryColor', v)} />
                      <ColorPicker label="Background" value={cardData.secondaryColor} onChange={(v) => updateData('secondaryColor', v)} />
                      <ColorPicker label="Text Color" value={cardData.textColor} onChange={(v) => updateData('textColor', v)} />
                      <ColorPicker label="QR Code Color" value={cardData.qrColor} onChange={(v) => updateData('qrColor', v)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Type size={12} />
                        Font Size
                      </label>
                      <input 
                        type="range" 
                        min="12" 
                        max="24" 
                        value={cardData.fontSize} 
                        onChange={(e) => updateData('fontSize', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ImageIcon size={16} className="text-indigo-500" />
                      Logo
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <Plus size={20} className="text-slate-400 dark:text-slate-500 mb-1" />
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Upload Logo</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                        {cardData.logo && (
                          <button 
                            onClick={() => updateData('logo', '')}
                            className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                      {cardData.logo && (
                        <div className="space-y-2">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <Layout size={12} />
                            Logo Size
                          </label>
                          <input 
                            type="range" 
                            min="30" 
                            max="100" 
                            value={cardData.logoSize} 
                            onChange={(e) => updateData('logoSize', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 sm:p-8 flex items-center justify-center overflow-y-auto transition-colors">
          <div className="w-full max-w-[400px] aspect-[4/6] sm:aspect-[4/5.5] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-indigo-200/50 dark:shadow-none overflow-hidden relative border-[8px] border-slate-900 dark:border-slate-800">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 dark:bg-slate-800 rounded-b-2xl z-40" />
            <div className="w-full h-full overflow-hidden">
              <ActiveTemplate data={cardData} shareId={shareId} />
            </div>
          </div>
        </main>
      </div>

      {/* Publish Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPublishModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Card Published!</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your digital identity is now live.</p>
                  </div>
                  <button onClick={() => setShowPublishModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  {/* Standee Style QR Card */}
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-indigo-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div id="qr-standee" className="relative bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 flex flex-col items-center text-center border border-slate-100">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                         <Share2 className="text-slate-300" size={20} />
                      </div>
                      
                      <div className="p-4 bg-white rounded-xl border-2 border-slate-50 mb-6 shadow-inner">
                        <QRCodeSVG id="publish-qr-code" value={shareUrl} size={140} level="H" fgColor={cardData.qrColor} />
                      </div>
                      
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60 mb-2">Scan to connect</p>
                      <div className="flex gap-1.5 justify-center mb-4">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-sm" />)}
                      </div>
                      
                      <div className="w-full pt-4 border-t border-slate-50">
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Powered by CardCraft</p>
                      </div>

                      {/* Standee Base Side View Effect */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-2 bg-slate-200 rounded-b-lg border-t border-slate-300 shadow-sm" />
                      
                      {/* Standee Base Shadow Effect */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-black/10 blur-xl rounded-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Share Link</label>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 truncate font-medium">
                          {shareUrl}
                        </div>
                        <button 
                          onClick={copyToClipboard}
                          className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
                        >
                          <Copy size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={downloadQRCode}
                        className="w-full flex items-center justify-center gap-4 px-6 py-4 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                        style={{ backgroundColor: cardData.primaryColor, boxShadow: `0 20px 25px -5px ${cardData.primaryColor}33` }}
                      >
                        <Download size={24} />
                        <div className="flex flex-col items-start leading-tight">
                          <span className="text-xs opacity-80">Download</span>
                          <span className="text-sm">QR Code</span>
                        </div>
                      </button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <a 
                          href={shareUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                          <ExternalLink size={16} />
                          View Live
                        </a>
                        <button 
                          onClick={() => setShowPublishModal(false)}
                          className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                          <Check size={16} />
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
