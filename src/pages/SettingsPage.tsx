import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  Shield, 
  Save, 
  CheckCircle,
  ChevronLeft,
  Palette,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const { profile, user, loading: authLoading, setTheme } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    theme: 'light' as 'light' | 'dark' | 'system',
    notifications: true,
    language: 'en',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        phoneNumber: profile.phoneNumber || '',
        theme: profile.preferences?.theme || 'light',
        notifications: profile.preferences?.notifications ?? true,
        language: profile.preferences?.language || 'en',
      });
    }
  }, [profile]);

  // Clear preview theme on unmount
  React.useEffect(() => {
    return () => setTheme(null);
  }, [setTheme]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (err) {
      console.error('Failed to send password reset email:', err);
      toast.error('Failed to send password reset email. Please try again later.');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        'preferences.theme': formData.theme,
        'preferences.notifications': formData.notifications,
        'preferences.language': formData.language,
      });
      setTheme(null);
      setSuccess(true);
      toast.success('Settings updated successfully!');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
      toast.error('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {success ? <CheckCircle size={18} /> : <Save size={18} />}
          {success ? 'Saved!' : 'Save Changes'}
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-8">
        {/* Profile Settings */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User size={20} className="text-indigo-600 dark:text-indigo-400" />
              Profile Settings
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your public profile information</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  type="email"
                  value={profile?.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>
        </section>

        {/* App Preferences */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette size={20} className="text-indigo-600 dark:text-indigo-400" />
              App Preferences
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Customize your application experience</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Theme Mode</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred visual style</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setFormData({ ...formData, theme: t });
                      setTheme(t);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all flex items-center gap-2 ${
                      formData.theme === t 
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {t === 'light' && <Sun size={14} />}
                    {t === 'dark' && <Moon size={14} />}
                    {t === 'system' && <Globe size={14} />}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Push Notifications</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Receive updates about your card views</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  formData.notifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  formData.notifications ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
              Account Security
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your password and security settings</p>
          </div>
          <div className="p-6 space-y-4">
            <button 
              onClick={handlePasswordReset}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-800">
                  <Lock size={18} className="text-slate-500 dark:text-slate-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Change Password</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update your account password</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-800">
                  <Shield size={18} className="text-slate-500 dark:text-slate-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase rounded">Coming Soon</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
