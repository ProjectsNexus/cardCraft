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
  Settings
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
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CardData, CardLog } from '../types';

interface CardWithId extends CardData {
  id: string;
  createdAt: Timestamp;
  stats: {
    views: number;
    clicks: number;
  };
}

export const DashboardPage = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
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

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
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

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await deleteDoc(doc(db, 'cards', cardId));
        setCards(cards.filter(c => c.id !== cardId));
      } catch (err) {
        console.error('Error deleting card:', err);
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
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
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
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Welcome back, {profile?.displayName.split(' ')[0]}!
              </h1>
              {isAdmin && (
                <span className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-md shadow-sm shadow-indigo-200">
                  Admin Access
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              {isAdmin 
                ? "You're viewing the system-wide overview and all user cards." 
                : "Here's what's happening with your digital cards."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchDashboardData}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
              title="Refresh Data"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>

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
                <Share2 size={20} />
              </div>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {isAdmin ? 'Global Shares' : 'Total Shares'}
            </p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stats.totalShares}</h3>
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
                    {/* Background Pattern/Image */}
                    <div 
                      className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110" 
                      style={{ 
                        backgroundColor: card.primaryColor,
                        backgroundImage: `url('https://picsum.photos/seed/${card.id}/400/200?grayscale&blur=3'), linear-gradient(135deg, ${card.primaryColor} 0%, ${card.secondaryColor} 100%)`,
                        backgroundBlendMode: 'overlay',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    
                    {/* Mockup Overlay - subtle card shape */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
                      <div className="w-40 h-24 bg-white/20 rounded-lg border border-white/30 rotate-12 translate-x-12 translate-y-4 shadow-2xl" />
                      <div className="w-40 h-24 bg-white/10 rounded-lg border border-white/20 -rotate-6 -translate-x-8 -translate-y-2 shadow-xl" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Template Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
                        {card.template}
                      </span>
                    </div>

                    {/* Profile Image / Logo */}
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
                            <div className="absolute inset-0 bg-current opacity-0 group-hover/initial:opacity-10 transition-opacity" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 pt-10">
                    <div className="flex items-start justify-between mb-5">
                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white truncate tracking-tight leading-none mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{card.name}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.15em] truncate opacity-80">{card.title}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: card.primaryColor }} />
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate">
                            {card.company}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 group/stat hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1.5">
                          <Eye size={12} className="group-hover/stat:text-indigo-500 transition-colors" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Views</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{card.stats.views}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 group/stat hover:border-amber-500/30 transition-all">
                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1.5">
                          <MousePointer2 size={12} className="group-hover/stat:text-amber-500 transition-colors" />
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
                          title="Edit Card"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-3.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                          title="Delete Card"
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
      </main>
    </div>
  );
};
