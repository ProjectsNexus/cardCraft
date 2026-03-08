import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layout, 
  Plus, 
  Users, 
  Activity, 
  TrendingUp, 
  Eye, 
  MousePointer2, 
  Share2, 
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink,
  RefreshCcw,
  Shield,
  User,
  LogOut,
  Settings,
  Zap,
  Globe,
  Construction,
  ArrowRight,
  Mail,
  Phone,
  UserCheck,
  HelpCircle
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CardData, CardLog, Lead } from '../types';
import { ASSET_PATHS } from '../constants/assets';
import { useTemplateImages } from '../contexts/TemplateImageContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface CardWithId extends CardData {
  id: string;
  createdAt: Timestamp;
  stats: {
    views: number;
    clicks: number;
  };
}

export const DashboardPage = () => {
  const { user, profile, isAdmin, isPro, signOut } = useAuth();
  const { getTemplateImage } = useTemplateImages();
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    totalShares: 0
  });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [recentLogs, setRecentLogs] = useState<CardLog[]>([]);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'overview' | 'analytics' | 'builder' | 'leads' | 'planner'>('overview');
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!user) return;

    // Real-time listener for logs
    const logsQuery = isAdmin 
      ? query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(50))
      : query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(100)); // We'll filter client-side for simplicity if needed, or refine query

    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const allLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CardLog));
      
      if (isAdmin) {
        setRecentLogs(allLogs.slice(0, 5));
        // Update stats
        let v = 0, c = 0, s = 0;
        allLogs.forEach(l => {
          if (l.action === 'view') v++;
          if (l.action === 'click') c++;
          if (l.action === 'share') s++;
        });
        setStats(prev => ({ ...prev, totalViews: v, totalClicks: c, totalShares: s }));
      }
    });

    fetchDashboardData();

    return () => {
      unsubscribeLogs();
    };
  }, [user, isAdmin]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let cardsList: CardWithId[] = [];
      let viewCount = 0;
      let clickCount = 0;
      let shareCount = 0;

      const allLogsSnap = await getDocs(collection(db, 'logs'));
      const allLogs = allLogsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CardLog));

      if (isAdmin) {
        // Admin: Fetch all cards
        const cardsSnap = await getDocs(collection(db, 'cards'));
        cardsList = cardsSnap.docs.map(doc => {
          const data = doc.data();
          const cardId = doc.id;
          const cardLogs = allLogs.filter(l => l.cardId === cardId);
          
          return { 
            id: cardId, 
            ...data,
            stats: {
              views: cardLogs.filter(l => l.action === 'view').length,
              clicks: cardLogs.filter(l => l.action === 'click').length
            }
          } as CardWithId;
        });

        allLogs.forEach(data => {
          if (data.action === 'view') viewCount++;
          if (data.action === 'click') clickCount++;
          if (data.action === 'share') shareCount++;
        });

        setRecentLogs(allLogs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)).slice(0, 5));
      } else {
        // Owner: Fetch user's cards
        const cardsQuery = query(
          collection(db, 'cards'), 
          where('ownerId', '==', user?.uid)
        );
        const cardsSnap = await getDocs(cardsQuery);
        cardsList = cardsSnap.docs.map(doc => {
          const data = doc.data();
          const cardId = doc.id;
          const cardLogs = allLogs.filter(l => l.cardId === cardId);

          return { 
            id: cardId, 
            ...data,
            stats: {
              views: cardLogs.filter(l => l.action === 'view').length,
              clicks: cardLogs.filter(l => l.action === 'click').length
            }
          } as CardWithId;
        });

        // Sort by createdAt desc client-side
        cardsList.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));

        const cardIds = cardsList.map(c => c.id);
        const userLogs = allLogs.filter(l => cardIds.includes(l.cardId));
        
        userLogs.forEach(data => {
          if (data.action === 'view') viewCount++;
          if (data.action === 'click') clickCount++;
          if (data.action === 'share') shareCount++;
        });

        setRecentLogs(userLogs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)).slice(0, 5));
      }

      setCards(cardsList);
      setStats({
        totalViews: viewCount,
        totalClicks: clickCount,
        totalShares: shareCount
      });

      // Fetch leads if not admin
      if (!isAdmin && user) {
        const leadsQuery = query(collection(db, 'leads'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
        const leadsSnap = await getDocs(leadsQuery);
        setLeads(leadsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card? This will also remove all associated analytics and leads.')) {
      try {
        // Delete the card document
        await deleteDoc(doc(db, 'cards', cardId));
        
        // Delete associated logs
        const logsQuery = query(collection(db, 'logs'), where('cardId', '==', cardId));
        const logsSnap = await getDocs(logsQuery);
        const logDeletions = logsSnap.docs.map(d => deleteDoc(d.ref));
        
        // Delete associated leads
        const leadsQuery = query(collection(db, 'leads'), where('cardId', '==', cardId));
        const leadsSnap = await getDocs(leadsQuery);
        const leadDeletions = leadsSnap.docs.map(d => deleteDoc(d.ref));
        
        // Wait for all deletions to complete
        await Promise.all([...logDeletions, ...leadDeletions]);
        
        setCards(cards.filter(c => c.id !== cardId));
        console.log(cardId, "Deleted!!")
        // Fetch leads if not admin
        if (!isAdmin) {
          const leadsQuery = query(collection(db, 'leads'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
          const leadsSnap = await getDocs(leadsQuery);
          setLeads(leadsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
        }
      } catch (err) {
        console.error('Error deleting card and associated data:', err);
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCcw className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Header */}
      <header className="h-16 glass px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Share2 className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">CardCraft</span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/create" 
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm"
          >
            <Plus size={18} />
            Create New Card
          </Link>

          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <User size={20} />
            </button>
            
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{profile?.displayName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile?.email}</p>
                      <span className="mt-2 inline-block px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase rounded">
                        {profile?.role}
                      </span>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/settings" 
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <Link 
                        to="/help" 
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <HelpCircle size={16} />
                        Help Center
                      </Link>
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <Shield size={16} />
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Trial Mode Banner */}
        {profile?.plan === 'free' && (
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg">Beta Version Active</h3>
                <p className="text-indigo-100 text-sm">You are currently using the beta version. Some features are being tested.</p>
              </div>
            </div>
            <Link to="/#pricing" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors">
              Upgrade Now
            </Link>
          </div>
        )}

        {/* Welcome Section */}
        <div className="glass rounded-[2.5rem] p-10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                Welcome back, {profile?.displayName.split(' ')[0]}!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                {isAdmin 
                  ? "You're viewing the system-wide overview and all user cards." 
                  : "Here's what's happening with your digital cards today."}
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-white/5 backdrop-blur-xl p-2 rounded-[1.5rem] border border-slate-200/50 dark:border-white/10 shadow-inner">
              {(['overview', 'analytics', 'builder', 'leads', 'planner'] as const)
                .filter(tab => {
                  if (tab === 'planner') return isAdmin;
                  if (tab === 'leads') return !isAdmin;
                  return true;
                })
                .map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDashboardTab(tab)}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative ${
                    activeDashboardTab === tab 
                      ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 scale-[1.02]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'planner' ? 'Admin Planner' : tab}
                  {!isPro && !isAdmin && (tab === 'analytics' || tab === 'builder' || tab === 'leads') && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-400 text-slate-900 text-[8px] font-black rounded-full shadow-lg">
                      PRO
                    </span>
                  )}
                </button>
              ))}
              <div className="w-px h-8 bg-slate-200 dark:bg-white/10 mx-2" />
              <button 
                onClick={fetchDashboardData}
                className="p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/10 rounded-2xl transition-all"
                title="Refresh Data"
              >
                <RefreshCcw size={20} />
              </button>
            </div>
          </div>
        </div>

        {activeDashboardTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Layout size={20} />
                  </div>
                  <TrendingUp size={16} className="text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {isAdmin ? 'System Cards' : 'My Cards'}
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{cards.length}</h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Eye size={20} />
                  </div>
                  <TrendingUp size={16} className="text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {isAdmin ? 'Global Views' : 'Total Views'}
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stats.totalViews}</h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <MousePointer2 size={20} />
                  </div>
                  <TrendingUp size={16} className="text-emerald-500" />
                </div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {isAdmin ? 'Global Clicks' : 'Link Clicks'}
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stats.totalClicks}</h3>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Globe size={20} />
                  </div>
                  <div className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase rounded">Beta</div>
                </div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Landing Pages
                </p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">0</h3>
              </div>
            </div>

            {/* Cards Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isAdmin ? 'All System Cards' : 'Your Digital Cards'}
                </h2>
                {!isAdmin && (
                  <Link to="/create" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Create New
                  </Link>
                )}
              </div>

              {cards.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Layout className="text-slate-300 dark:text-slate-600" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No cards created yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first digital visiting card and start sharing.</p>
                  <Link 
                    to="/create" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                  >
                    <Plus size={20} />
                    Create My First Card
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((card) => (
                    <motion.div 
                      key={card.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                    >
                      {/* Card Preview Banner */}
                      <div className="h-32 relative overflow-hidden">
                        <div 
                          className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110" 
                          style={{ 
                            backgroundColor: card.primaryColor,
                            backgroundImage: getTemplateImage(card.template) 
                              ? `url('${getTemplateImage(card.template)}')` 
                              : `url('${ASSET_PATHS.PLACEHOLDERS.DASHBOARD_BG}'), linear-gradient(135deg, ${card.primaryColor} 0%, ${card.secondaryColor} 100%)`,
                            backgroundBlendMode: getTemplateImage(card.template) ? 'normal' : 'soft-light',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: getTemplateImage(card.template) ? 'none' : 'saturate(1.2) contrast(1.1)'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
                            {card.template}
                          </span>
                        </div>
                        <div className="absolute -bottom-6 left-6">
                          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-indigo-500/20">
                            {card.logo ? (
                              <img src={card.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              <div 
                                className="w-full h-full flex items-center justify-center font-black text-2xl uppercase relative group/initial"
                                style={{ color: card.primaryColor, backgroundColor: `${card.primaryColor}10` }}
                              >
                                <span className="relative z-10">{card.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-6 pt-10">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white truncate tracking-tight leading-none mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{card.name}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.15em] truncate opacity-80">{card.title}</p>
                        <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
                          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1.5">
                              <Eye size={12} />
                              <span className="text-[8px] font-black uppercase tracking-widest">Views</span>
                            </div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{card.stats.views}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1.5">
                              <MousePointer2 size={12} />
                              <span className="text-[8px] font-black uppercase tracking-widest">Clicks</span>
                            </div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{card.stats.clicks}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-5 border-t border-slate-100 dark:border-slate-800/50">
                          <Link 
                            to={`/view/${card.id}`}
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-200 dark:shadow-none active:scale-95"
                          >
                            <ExternalLink size={14} />
                            View Live
                          </Link>
                          <div className="flex items-center gap-1">
                            <Link 
                              to={`/create?id=${card.id}`}
                              className="p-3.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all"
                            >
                              <Edit3 size={18} />
                            </Link>
                            <button 
                              onClick={() => handleDeleteCard(card.id)}
                              className="p-3.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={20} className="text-indigo-600 dark:text-indigo-400" />
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentLogs.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8 italic">
                      No recent activity to show.
                    </p>
                  ) : (
                    recentLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className={`p-2 rounded-lg ${
                          log.action === 'view' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                          log.action === 'click' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                          log.action === 'share' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                          'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {log.action === 'view' ? <Eye size={14} /> : 
                           log.action === 'click' ? <MousePointer2 size={14} /> :
                           log.action === 'share' ? <Share2 size={14} /> :
                           <Activity size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {log.action === 'view' ? 'Card viewed' : 
                             log.action === 'click' ? 'Link clicked' :
                             log.action === 'share' ? 'Card shared' :
                             `${log.action} action`}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            Card ID: {log.cardId}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeDashboardTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {!isPro && !isAdmin ? (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-12 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="text-amber-600" size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Unlock Analytics</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Get detailed insights into how your cards are performing with Pro analytics. 
                    Track engagement over time and see which cards are most effective.
                  </p>
                  <Link to="/#pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none">
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Engagement Overview</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Mon', views: 40, clicks: 24 },
                        { name: 'Tue', views: 30, clicks: 13 },
                        { name: 'Wed', views: 20, clicks: 98 },
                        { name: 'Thu', views: 27, clicks: 39 },
                        { name: 'Fri', views: 18, clicks: 48 },
                        { name: 'Sat', views: 23, clicks: 38 },
                        { name: 'Sun', views: 34, clicks: 43 },
                      ]}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                        <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Performance by Card</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cards.map(c => ({ name: c.name.split(' ')[0], views: c.stats.views, clicks: c.stats.clicks }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="views" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeDashboardTab === 'builder' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {!isPro && !isAdmin ? (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-12 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Construction className="text-amber-600" size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Landing Page Builder</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Create a full-scale landing page for your professional identity. 
                    Showcase your portfolio, add custom sections, and more with our Pro builder.
                  </p>
                  <Link to="/#pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none">
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-12 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                <div className="max-w-2xl mx-auto">
                  <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Construction className="text-indigo-600 dark:text-indigo-400" size={48} />
                  </div>
                  
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                    Landing Page Builder
                  </h2>
                  <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                    Transform your digital card into a full-scale landing page. Create custom sections, 
                    showcase your portfolio, and capture leads with our powerful drag-and-drop builder.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                      to="/builder"
                      className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-2"
                    >
                      Open Builder
                      <ArrowRight size={20} />
                    </Link>
                    <Link 
                      to="/builder/templates"
                      className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                      View Templates
                    </Link>
                  </div>
                  
                  <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Layout className="text-indigo-600" size={20} />
                      </div>
                      <h4 className="font-bold text-sm mb-1">Drag & Drop</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Easy Customization</p>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Zap className="text-amber-500" size={20} />
                      </div>
                      <h4 className="font-bold text-sm mb-1">Fast Loading</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Optimized Performance</p>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Globe className="text-emerald-500" size={20} />
                      </div>
                      <h4 className="font-bold text-sm mb-1">Custom Domain</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Professional Identity</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeDashboardTab === 'leads' && !isAdmin && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {!isPro ? (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-12 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Users className="text-amber-600" size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Lead Collection</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Capture visitor information directly through your digital card. 
                    Manage your leads and export them to your CRM with our Pro features.
                  </p>
                  <Link to="/#pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none">
                    Upgrade to Pro
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Your Leads</h2>
                  <div className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-200 dark:shadow-none">
                    {leads.length} Captured
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lead Details</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Info</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Card Source</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="px-8 py-6">
                              <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{lead.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">"{lead.message}"</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                  <Mail size={12} className="text-indigo-500" />
                                  {lead.email}
                                </p>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                  <Phone size={12} className="text-indigo-500" />
                                  {lead.phone}
                                </p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-lg">
                                {cards.find(c => c.id === lead.cardId)?.name || 'Unknown Card'}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-xs font-medium text-slate-400">
                                {lead.timestamp?.toDate()?.toLocaleDateString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {leads.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-8 py-20 text-center">
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                                  <UserCheck className="text-slate-200 dark:text-slate-700" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No leads yet</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Share your card to start capturing leads!</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeDashboardTab === 'planner' && isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-indigo-600 rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  <Shield size={12} />
                  Admin Planner
                </div>
                <h2 className="text-5xl font-black tracking-tight mb-6 leading-[1.1]">
                  Master Control & <br />System Strategy
                </h2>
                <p className="text-indigo-100 text-lg font-medium mb-10 leading-relaxed">
                  Welcome to the Admin Planner. This is your central hub for system-wide strategy, 
                  user growth planning, and advanced platform configurations.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate('/admin')}
                    className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-black/10"
                  >
                    Open Admin Panel
                  </button>
                  <button className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all border border-white/10">
                    System Roadmap
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'User Growth', icon: <Users size={24} />, desc: 'Track and plan user acquisition strategies.' },
                { title: 'Feature Roadmap', icon: <Layout size={24} />, desc: 'Manage upcoming platform enhancements.' },
                { title: 'System Health', icon: <Activity size={24} />, desc: 'Monitor global performance and uptime.' }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};
