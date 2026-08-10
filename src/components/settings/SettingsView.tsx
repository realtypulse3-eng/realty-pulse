import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Shield,
  Key,
  Building,
  Phone,
  Bell,
  Save,
  Check,
  Lock,
  LogOut,
  ChevronDown,
  ChevronUp,
  Database,
  Sparkles,
  Copy,
  BadgeCheck,
  Camera,
  Globe,
  Award,
} from 'lucide-react';
import { getCurrentUser, updateCurrentUser, logoutUser } from '../../lib/auth';
import { User, UserRole } from '../../types';
import { db, SUPABASE_SCHEMA_SQL } from '../../lib/db';
import { GlassCard } from '../common/GlassCard';

export const SettingsView: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  
  // Profile form state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [username, setUsername] = useState(
    currentUser?.email ? `@${currentUser.email.split('@')[0]}` : '@broker'
  );
  const [role, setRole] = useState<UserRole>(currentUser?.role || 'agent');
  const [phone, setPhone] = useState('+1 (555) 382-9021');
  const [agencyName, setAgencyName] = useState('RealtyPulse Luxury Group');
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  );

  // Sync profile form when user changes or updates
  useEffect(() => {
    const handleAuthChange = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setRole(user.role || 'agent');
        if (user.avatar) setAvatarUrl(user.avatar);
        if (user.email) setUsername(`@${user.email.split('@')[0]}`);
      }
    };

    window.addEventListener('realtypulse_auth_change', handleAuthChange);
    return () => window.removeEventListener('realtypulse_auth_change', handleAuthChange);
  }, []);

  // Notification Preferences State
  const [notifyLeadEmail, setNotifyLeadEmail] = useState(true);
  const [notifyAppointmentSms, setNotifyAppointmentSms] = useState(true);
  const [autoAiQualification, setAutoAiQualification] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Security Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Feedback States
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showAdvancedSystem, setShowAdvancedSystem] = useState(false);

  // Database Seed / SQL state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateCurrentUser({
      name,
      email,
      role,
      avatar: avatarUrl,
    });
    if (updated) {
      setCurrentUser(updated);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedSuccess(false);
    try {
      await db.seedSampleData();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleAvatarPresetSelect = (url: string) => {
    setAvatarUrl(url);
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2.5">
          <UserIcon className="w-6 h-6 text-[#8B5CF6]" />
          Account & Profile Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, credentials, brokerage details, and account security
        </p>
      </div>

      {/* User Overview Profile Card */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/30 shadow-lg shadow-purple-500/10"
              />
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">{name || 'User Profile'}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-purple-400" />
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{email}</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-purple-400">{username}</span>
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  {agencyName}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-500">ID: {currentUser?.id || 'usr_default'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => logoutUser()}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium text-xs flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Avatar Preset Selector */}
        <div className="mt-6 pt-5 border-t border-slate-800/60">
          <span className="text-[11px] font-medium text-slate-400 block mb-2">Select Profile Avatar Preset:</span>
          <div className="flex items-center gap-3">
            {avatarPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleAvatarPresetSelect(preset)}
                className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                  avatarUrl === preset
                    ? 'border-purple-500 scale-105 shadow-md shadow-purple-500/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={preset} alt={`Avatar option ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Editable Account Information Form */}
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-purple-400" />
              Personal & Brokerage Information
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your full display name, contact information, and role designation
            </p>
          </div>
          {profileSaved && (
            <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-medium flex items-center gap-1.5 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              Profile Saved Successfully!
            </div>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g. Alex Vance"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="alex@realtypulse.io"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Username / Handle</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="@alexvance"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Role Title</label>
              <div className="relative">
                <Award className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-colors capitalize"
                >
                  <option value="broker">Broker / Principal</option>
                  <option value="admin">System Administrator</option>
                  <option value="agent">Senior Real Estate Agent</option>
                  <option value="manager">Listing Manager</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Agency / Organization</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Brokerage Firm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Account Changes
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Security & Password Settings */}
      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              Security & Credentials
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage multi-factor authentication, active sessions, and password security
            </p>
          </div>
          {passwordSaved && (
            <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-medium flex items-center gap-1.5 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              Password Updated!
            </div>
          )}
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="New password"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div>
                <span className="text-xs font-medium text-slate-200 block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-slate-400">Enforce biometric or SMS code verification on sign in</span>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-medium text-xs flex items-center gap-2 transition-colors shrink-0"
            >
              <Key className="w-4 h-4" />
              Update Security Credentials
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Notification & AI Automation Preferences */}
      <GlassCard className="p-6 space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            Notification & Autonomous AI Preferences
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure real-time notifications and automated lead qualification agent rules
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">Inbound Lead Alerts</span>
              <span className="text-[11px] text-slate-400">Receive instant email and app alerts when high-budget buyers submit inquiries</span>
            </div>
            <button
              onClick={() => setNotifyLeadEmail(!notifyLeadEmail)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifyLeadEmail ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifyLeadEmail ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">Appointment Reminders</span>
              <span className="text-[11px] text-slate-400">Send automated SMS viewing confirmations 2 hours prior to scheduled property visits</span>
            </div>
            <button
              onClick={() => setNotifyAppointmentSms(!notifyAppointmentSms)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifyAppointmentSms ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifyAppointmentSms ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">Autonomous Lead Qualification Agent</span>
              <span className="text-[11px] text-slate-400">Allow Gemini AI Agent to auto-score inbound buyer budget and trigger matching listings</span>
            </div>
            <button
              onClick={() => setAutoAiQualification(!autoAiQualification)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoAiQualification ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoAiQualification ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Advanced Database & System Architecture (Collapsible) */}
      <GlassCard className="p-6 space-y-4 border-slate-800/80">
        <div
          onClick={() => setShowAdvancedSystem(!showAdvancedSystem)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-slate-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200 font-mono">
                Advanced Database & System Architecture
              </h3>
              <p className="text-[11px] text-slate-400">
                View Supabase PostgreSQL state sync, seed sample records, and copy SQL schema
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAdvancedSystem(!showAdvancedSystem);
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-slate-200"
          >
            {showAdvancedSystem ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showAdvancedSystem && (
          <div className="pt-4 border-t border-slate-800 space-y-6 animate-fade-in">
            {/* Storage Mode Status */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                    Active Storage Layer
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-bold text-slate-200 font-mono">
                      Supabase PostgreSQL + Local Persistence
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    RealtyPulse writes synchronously to PostgreSQL tables when configured, or maintains state locally in client storage.
                  </p>
                </div>

                <button
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 shrink-0 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {isSeeding ? 'Seeding Database...' : 'Seed Sample Records'}
                </button>
              </div>

              {seedSuccess && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  ✓ Successfully seeded luxury real estate properties, qualified leads, active deals, viewing appointments, and document records!
                </div>
              )}
            </div>

            {/* SQL Schema Viewer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 font-mono">Supabase SQL Schema DDL</h4>
                  <p className="text-[11px] text-slate-400">Copy & paste into Supabase SQL Editor</p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 border border-slate-700 transition-colors"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 font-mono overflow-x-auto max-h-60 leading-relaxed">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
