import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCcw, AlertCircle, Plus, MessageSquare, X, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { db } from '../lib/firebase';
import { CardData } from '../types';
import { ActiveTemplate } from '../components/ActiveTemplate';
import { ASSET_PATHS } from '../constants/assets';

export const CardViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const fetchCard = async () => {
        try {
          const docRef = doc(db, 'cards', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setCardData(docSnap.data() as CardData);
            setError(null);
            
            // Log the view (Customer role - no auth required)
            await addDoc(collection(db, 'logs'), {
              cardId: id,
              userId: 'customer',
              action: 'view',
              timestamp: serverTimestamp(),
            });
          } else {
            throw new Error('Card not found');
          }
        } catch (err: any) {
          console.error("Failed to load card:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCard();
    }
  }, [id]);

  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && id) {
        await addDoc(collection(db, 'logs'), {
          cardId: id,
          userId: 'customer',
          action: 'click',
          timestamp: serverTimestamp(),
          details: `Clicked: ${link.href}`
        });
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [id]);

  const handleShare = async () => {
    if (id) {
      await addDoc(collection(db, 'logs'), {
        cardId: id,
        userId: 'customer',
        action: 'share',
        timestamp: serverTimestamp(),
      });
      
      if (navigator.share) {
        navigator.share({
          title: `${cardData?.name} - Digital Visiting Card`,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    }
  };

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmittingLead(true);
    try {
      await addDoc(collection(db, 'leads'), {
        cardId: id,
        userId: cardData?.ownerId,
        ...leadData,
        timestamp: serverTimestamp(),
      });
      setLeadSubmitted(true);
      setTimeout(() => {
        setShowLeadForm(false);
        setLeadSubmitted(false);
        setLeadData({ name: '', email: '', phone: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error("Error submitting lead:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <RefreshCcw className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-600 font-medium">Loading your digital card...</p>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops! Card Not Found</h1>
        <p className="text-slate-600 mb-8 max-w-md">
          We couldn't find the digital card you're looking for. It might have been removed or the link is incorrect.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Create Your Own Card
        </Link>
      </div>
    );
  }

  // Meta description: "John Doe - Software Engineer at Tech Corp. Contact: +1234567890"
  const metaDescription = `${cardData.name} - ${cardData.title} at ${cardData.company}. Contact: ${cardData.phone}`;
  const cardUrl = `${window.location.origin}/view/${id}`;
  
  // Note: For real social sharing images, we would need a server-side route that generates an image.
  // For now, we'll use a placeholder or the logo if available.
  const metaImage = cardData.logo || ASSET_PATHS.PLACEHOLDERS.META_IMAGE;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 overflow-hidden transition-colors">
      <Helmet>
        <title>{`${cardData.name} | Digital Visiting Card`}</title>
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={cardUrl} />
        <meta property="og:title" content={`${cardData.name} - Digital Visiting Card`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={cardUrl} />
        <meta property="twitter:title" content={`${cardData.name} - Digital Visiting Card`} />
        <meta property="twitter:description" content={metaDescription} />
        <meta property="twitter:image" content={metaImage} />
      </Helmet>

      {/* Mobile-optimized view container */}
      <div className="w-full h-full sm:h-auto sm:max-w-[420px] sm:aspect-[4/6] bg-white dark:bg-slate-900 sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative transition-colors">
        <div className="w-full h-full overflow-hidden">
          <ActiveTemplate data={cardData} shareId={id || null} />
        </div>
      </div>

      {/* Floating Action Menu (Desktop only) */}
      <div className="hidden sm:flex fixed bottom-8 right-8 flex-col gap-3">
        <button 
          onClick={() => setShowLeadForm(true)}
          className="p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:scale-110 transition-all group border border-indigo-500"
          title="Connect"
        >
          <MessageSquare size={24} />
          <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Connect
          </span>
        </button>
        <button 
          onClick={handleShare}
          className="p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-xl hover:scale-110 transition-all group border border-slate-100 dark:border-slate-700"
          title="Share Card"
        >
          <Share2 size={24} />
          <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Share Card
          </span>
        </button>
        <Link 
          to="/" 
          className="p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-xl hover:scale-110 transition-all group border border-slate-100 dark:border-slate-700"
          title="Create Your Own"
        >
          <Plus size={24} />
          <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Create Your Own
          </span>
        </Link>
      </div>

      {/* Lead Form Modal */}
      <AnimatePresence>
        {showLeadForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLeadForm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Let's Connect</h3>
                  <button onClick={() => setShowLeadForm(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>

                {leadSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="text-emerald-600 dark:text-emerald-400" size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h4>
                    <p className="text-slate-500 dark:text-slate-400">Thank you for reaching out. We'll be in touch soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                      <input 
                        required
                        type="text"
                        value={leadData.name}
                        onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Email</label>
                        <input 
                          required
                          type="email"
                          value={leadData.email}
                          onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Phone</label>
                        <input 
                          type="tel"
                          value={leadData.phone}
                          onChange={(e) => setLeadData({...leadData, phone: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          placeholder="+1 234..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Message</label>
                      <textarea 
                        required
                        rows={3}
                        value={leadData.message}
                        onChange={(e) => setLeadData({...leadData, message: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95 disabled:opacity-50"
                    >
                      {isSubmittingLead ? <RefreshCcw className="animate-spin" size={20} /> : <Send size={20} />}
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
