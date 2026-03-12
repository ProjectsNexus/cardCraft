import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query, 
  orderBy,
  limit,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Users, 
  Layout, 
  Activity, 
  Shield, 
  Search, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  ChevronLeft,
  RefreshCcw,
  Eye,
  Trash2,
  MousePointer2,
  Share2,
  MessageSquare,
  Clock,
  BarChart3,
  TrendingUp,
  UserCheck,
  Mail,
  Phone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { UserProfile, CardLog, UserRole, UserPlan, SupportTicket, Lead } from '../types';

export const AdminPanelPage = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<CardLog[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'system' | 'support' | 'analytics' | 'leads'>('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersList = usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
        setUsers(usersList);

        // Fetch recent logs
        const logsQuery = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(50));
        const logsSnap = await getDocs(logsQuery);
        const logsList = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CardLog));
        setLogs(logsList);

        // Fetch support tickets
        const ticketsSnap = await getDocs(query(collection(db, 'support_tickets'), orderBy('timestamp', 'desc')));
        const ticketsList = ticketsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
        setTickets(ticketsList);

        // Fetch all leads
        const leadsSnap = await getDocs(query(collection(db, 'leads'), orderBy('timestamp', 'desc')));
        const leadsList = leadsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
        setLeads(leadsList);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) fetchData();
  }, [isAdmin, authLoading, navigate]);

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.uid === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      console.error('Failed to update user role:', err);
      toast.error('Failed to update user role');
    }
  };

  const updateUserPlan = async (userId: string, newPlan: UserPlan, days: number = 30) => {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);
      
      const updateData: any = { plan: newPlan };
      if (newPlan !== 'free') {
        updateData.planExpiry = Timestamp.fromDate(expiryDate);
      } else {
        updateData.planExpiry = null;
      }

      await updateDoc(doc(db, 'users', userId), updateData);
      setUsers(users.map(u => u.uid === userId ? { ...u, ...updateData } : u));
      toast.success(`User plan updated to ${newPlan}`);
    } catch (err) {
      console.error('Failed to update user plan:', err);
      toast.error('Failed to update user plan');
    }
  };

  const updatePlanExpiry = async (userId: string, dateString: string) => {
    try {
      const expiryDate = new Date(dateString);
      if (isNaN(expiryDate.getTime())) return;

      await updateDoc(doc(db, 'users', userId), { planExpiry: Timestamp.fromDate(expiryDate) });
      setUsers(users.map(u => u.uid === userId ? { ...u, planExpiry: Timestamp.fromDate(expiryDate) } : u));
      toast.success('Plan expiry updated');
    } catch (err) {
      console.error('Failed to update plan expiry:', err);
      toast.error('Failed to update plan expiry');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      setUsers(users.map(u => u.uid === userId ? { ...u, status: newStatus as any } : u));
      toast.success(`User status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update user status:', err);
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // 1. Delete user's cards
      const cardsQuery = query(collection(db, 'cards'), where('ownerId', '==', userId));
      const cardsSnap = await getDocs(cardsQuery);
      const cardDeletions = cardsSnap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(cardDeletions);

      // 2. Delete user's logs
      const logsQuery = query(collection(db, 'logs'), where('userId', '==', userId));
      const logsSnap = await getDocs(logsQuery);
      const logDeletions = logsSnap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(logDeletions);

      // 3. Delete user's leads
      const leadsQuery = query(collection(db, 'leads'), where('userId', '==', userId));
      const leadsSnap = await getDocs(leadsQuery);
      const leadDeletions = leadsSnap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(leadDeletions);

      // 4. Delete user profile
      await deleteDoc(doc(db, 'users', userId));

      setUsers(users.filter(u => u.uid !== userId));
      toast.success('User and all associated data deleted successfully');
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center transition-colors">
        <RefreshCcw className="animate-spin text-indigo-600 dark:text-indigo-400 mb-4" size={40} />
        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
            Admin Panel
          </h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 transition-colors">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'analytics' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 size={18} />
            Analytics Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'users' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Users size={18} />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'leads' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck size={18} />
            System Leads
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'logs' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Activity size={18} />
            System Logs
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'support' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare size={18} />
            Support Tickets
            {tickets.filter(t => t.status === 'open').length > 0 && (
              <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                {tickets.filter(t => t.status === 'open').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'system' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Layout size={18} />
            Global Settings
          </button>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Analytics Builder Overview</h2>
                <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-full">
                  Real-time System Stats
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Users size={20} />
                    </div>
                    <TrendingUp size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Users</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{users.length}</h3>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Eye size={20} />
                    </div>
                    <TrendingUp size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Views</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {logs.filter(l => l.action === 'view').length}
                  </h3>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <MousePointer2 size={20} />
                    </div>
                    <TrendingUp size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Clicks</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {logs.filter(l => l.action === 'click').length}
                  </h3>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <UserCheck size={20} />
                    </div>
                    <TrendingUp size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Leads</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{leads.length}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Activity size={16} className="text-indigo-600" />
                    Recent System Activity
                  </h3>
                  <div className="space-y-4">
                    {logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className={`p-2 rounded-lg ${
                          log.action === 'view' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                          log.action === 'click' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                          'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {log.action === 'view' ? <Eye size={14} /> : <MousePointer2 size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate capitalize">{log.action} Action</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">User: {log.userId}</p>
                        </div>
                        <span className="text-[10px] text-slate-400">{log.timestamp?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab('logs')} className="w-full mt-6 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                    View All Logs
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <MessageSquare size={16} className="text-indigo-600" />
                    Pending Support Tickets
                  </h3>
                  <div className="space-y-4">
                    {tickets.filter(t => t.status === 'open').slice(0, 5).map((ticket) => (
                      <div key={ticket.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center font-bold text-xs">
                          {ticket.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{ticket.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{ticket.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-400">Open</span>
                      </div>
                    ))}
                    {tickets.filter(t => t.status === 'open').length === 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8">No pending tickets.</p>
                    )}
                  </div>
                  <button onClick={() => setActiveTab('support')} className="w-full mt-6 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                    Manage Tickets
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">System-wide Leads</h2>
                <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-full">
                  {leads.length} Total Leads
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Lead Info</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Contact</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Card ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{lead.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{lead.message.slice(0, 30)}..."</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                              <Mail size={12} />
                              {lead.email}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                              <Phone size={12} />
                              {lead.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-mono text-slate-400">{lead.cardId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500">{lead.timestamp?.toDate()?.toLocaleDateString()}</span>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic">
                          No leads captured yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manage Accounts</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    {(['all', 'active', 'inactive'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
                          statusFilter === s 
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">User</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                              {u.displayName?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{u.displayName}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <select 
                              value={u.role}
                              onChange={(e) => updateUserRole(u.uid, e.target.value as UserRole)}
                              className={`px-2 py-1 rounded text-[10px] font-bold uppercase border-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                u.role === 'admin' 
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                              <option value="customer">Customer</option>
                            </select>
                            <div className="flex flex-col gap-1">
                              <select 
                                value={u.plan}
                                onChange={(e) => updateUserPlan(u.uid, e.target.value as UserPlan)}
                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase border-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${
                                  u.plan === 'pro' 
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                                    : u.plan === 'enterprise'
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}
                              >
                                <option value="free">Free Beta</option>
                                <option value="pro">Pro</option>
                                <option value="enterprise">Enterprise</option>
                              </select>
                              {u.plan !== 'free' && (
                                <div className="flex flex-col gap-1 mt-1">
                                  <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase">
                                    <Clock size={10} />
                                    Expires: {u.planExpiry?.toDate()?.toLocaleDateString() || 'N/A'}
                                  </div>
                                  <input 
                                    type="date"
                                    defaultValue={u.planExpiry?.toDate() ? new Date(u.planExpiry.toDate().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0] : ''}
                                    onChange={(e) => updatePlanExpiry(u.uid, e.target.value)}
                                    className="text-[9px] bg-transparent border-b border-slate-200 dark:border-slate-800 text-slate-500 focus:outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${
                            u.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {u.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleUserStatus(u.uid, u.status)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                              title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              <RefreshCcw size={16} />
                            </button>
                            <button 
                              onClick={() => setUserToDelete(u.uid)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">System Activity Logs</h2>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="p-6 space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className={`p-2 rounded-lg ${
                        log.action === 'create' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                        log.action === 'delete' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                        log.action === 'update' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                        log.action === 'click' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                        log.action === 'share' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }`}>
                        {log.action === 'view' ? <Eye size={16} /> : 
                         log.action === 'click' ? <MousePointer2 size={16} /> :
                         log.action === 'share' ? <Share2 size={16} /> :
                         <Activity size={16} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{log.action} Action</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{log.timestamp?.toDate()?.toLocaleString() || 'Just now'}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          User <span className="font-medium text-slate-900 dark:text-white">{log.userId}</span> performed <span className="font-medium text-slate-900 dark:text-white">{log.action}</span> on card <span className="font-medium text-slate-900 dark:text-white">{log.cardId}</span>
                        </p>
                        {log.details && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 italic">{log.details}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Support & Help Tickets</h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-full">
                    {tickets.length} Total Tickets
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {tickets.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <MessageSquare className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={48} />
                    <p className="text-slate-500 dark:text-slate-400">No support tickets found.</p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">
                            {ticket.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{ticket.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{ticket.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            ticket.status === 'open' ? 'bg-red-100 text-red-600' :
                            ticket.status === 'in-progress' ? 'bg-amber-100 text-amber-600' :
                            'bg-emerald-100 text-emerald-600'
                          }`}>
                            {ticket.status}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            {ticket.timestamp?.toDate().toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">"{ticket.message}"</p>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          value={ticket.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value as any;
                            try {
                              await updateDoc(doc(db, 'support_tickets', ticket.id), { status: newStatus });
                              setTickets(tickets.map(t => t.id === ticket.id ? { ...t, status: newStatus } : t));
                              toast.success(`Ticket status updated to ${newStatus}`);
                            } catch (err) {
                              toast.error('Failed to update ticket status');
                            }
                          }}
                          className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Delete this ticket?')) {
                              try {
                                await deleteDoc(doc(db, 'support_tickets', ticket.id));
                                setTickets(tickets.filter(t => t.id !== ticket.id));
                                toast.success('Ticket deleted');
                              } catch (err) {
                                toast.error('Failed to delete ticket');
                              }
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Global System Settings</h2>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center transition-colors">
                <Shield size={48} className="text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Advanced Security Controls</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
                  Configure system-wide security policies, role assignments, and global application preferences.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-left"
                  >
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Role Assignment</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Modify user permissions and access levels</p>
                  </button>
                  <button 
                    onClick={() => toast.info('Force logout functionality requires backend integration. User accounts can be deactivated in the User Management tab.')}
                    className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-left"
                  >
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Force Logout</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Terminate active sessions for specific users</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete User?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete this user? This will remove their profile, all their cards, logs, and leads. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteUser(userToDelete);
                    setUserToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
