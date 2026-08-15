import React, { useState } from 'react';
import {
  Zap,
  Mail,
  Lock,
  User as UserIcon,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react';
import { UserRole } from '../../types';
import { loginUser, registerUser, DEFAULT_USERS } from '../../lib/auth';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('agent');
  const [organizationName, setOrganizationName] = useState('Apex Horizon Real Estate');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim()) {
          throw new Error('Please enter your email address.');
        }
        if (!password) {
          throw new Error('Please enter your account password.');
        }

        loginUser(email.trim());
        setSuccessMsg('Authentication successful! Initializing workspace...');
        setTimeout(() => {
          onSuccess();
        }, 600);
      } else {
        // Signup validation
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (!email.trim()) {
          throw new Error('Please enter a valid work email.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }

        registerUser({
          name: fullName.trim(),
          email: email.trim(),
          role: role,
          organizationName: organizationName.trim(),
        });

        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(() => {
          onSuccess();
        }, 700);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoUserEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      loginUser(demoUserEmail);
      setSuccessMsg('Demo session authenticated successfully!');
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate demo user.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-base text-[#EDEDF0] flex flex-col justify-between p-4 md:p-8 font-sans antialiased relative overflow-hidden selection:bg-[#8B5CF6] selection:text-white">
      {/* Liquid morphism background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="liquid-orb animate-drift top-[-12%] left-[-8%] h-[560px] w-[560px] bg-[#7c3aed]/25" />
        <div className="liquid-orb animate-drift-slow bottom-[-12%] right-[-8%] h-[560px] w-[560px] bg-[#4338ca]/25" />
        <div className="liquid-orb animate-drift top-[30%] left-[45%] h-[420px] w-[420px] bg-[#312e81]/20" />
      </div>

      {/* Top Header Branding */}
      <header className="flex items-center justify-between max-w-7xl w-full mx-auto z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#6d28d9] flex items-center justify-center text-white shadow-lg shadow-[#8B5CF6]/25 shrink-0 font-bold text-xl">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="font-bold text-[#E4E4E7] text-lg tracking-tight font-display">
              REALTY <span className="text-[#8B5CF6]">PULSE</span>
            </span>
            <span className="block text-[10px] text-[#71717A] tracking-widest font-mono uppercase">
              AI Real Estate Operating System
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-soft text-xs text-[#A1A1AA]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Secure sign-in</span>
        </div>
      </header>

      {/* Main Authentication Card Grid */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Feature Showcase Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D1D21] border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VERSION 4.2 ENTERPRISE EDITION</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#E4E4E7] leading-tight font-display">
            Autonomous AI Multi-Agent Platform
          </h1>

          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            Manage properties, qualify leads, automate contract drafting, and run predictive valuation pipelines with zero manual friction.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl glass-soft">
              <div className="p-2 rounded-xl glass-soft text-[#a78bfa] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#E4E4E7]">Role-Based Access Control</h4>
                <p className="text-[11px] text-[#71717A] mt-0.5">Managing Broker, Senior Agent, Commercial Lead, and Admin privileges.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl glass-soft">
              <div className="p-2 rounded-xl glass-soft text-[#a78bfa] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#E4E4E7]">12 Dedicated AI Intelligence Agents</h4>
                <p className="text-[11px] text-[#71717A] mt-0.5">Real-time valuation, lead qualification scoring, and automated marketing dossiers.</p>
              </div>
            </div>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-4 border-t border-[#27272A]">
            <span className="text-[11px] text-[#71717A] font-mono uppercase tracking-wider block mb-3">
              One-Click Demo Accounts:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEFAULT_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleDemoLogin(user.email)}
                  className="flex items-center gap-2 p-2 rounded-xl glass-soft hover:border-[#8B5CF6]/50 text-left transition-all group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#8B5CF6]/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-[#E4E4E7] truncate group-hover:text-[#8B5CF6]">
                      {user.name}
                    </p>
                    <p className="text-[9px] text-[#71717A] font-mono capitalize truncate">
                      {user.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="glass-strong glass-glare lg:col-span-7 rounded-3xl p-6 md:p-8 relative">
          {/* Form Navigation Tabs */}
          <div className="flex glass-soft p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'glass-soft text-[#EDEDF0]'
                  : 'text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'signup'
                  ? 'glass-soft text-[#EDEDF0]'
                  : 'text-[#71717A] hover:text-[#A1A1AA]'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#E4E4E7]">
              {mode === 'login' ? 'Sign in to your account' : 'Join RealtyPulse OS'}
            </h2>
            <p className="text-xs text-[#71717A] mt-1">
              {mode === 'login'
                ? 'Enter your work credentials to access the agent workspace.'
                : 'Setup a new broker account to manage property intelligence.'}
            </p>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 animate-pulse" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5 font-mono">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-[#71717A]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full glass-soft focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E4E4E7] placeholder-[#71717A] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Role & Org */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5 font-mono">
                      SYSTEM ROLE
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-[#71717A]" />
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full glass-soft focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E4E4E7] focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="broker">Managing Broker</option>
                        <option value="agent">Senior Agent</option>
                        <option value="manager">Property Manager</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5 font-mono">
                      ORGANIZATION
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-[#71717A]" />
                      <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Organization Name"
                        className="w-full glass-soft focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E4E4E7] placeholder-[#71717A] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5 font-mono">
                WORK EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#71717A]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="broker@realtypulse.io"
                  className="w-full glass-soft focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E4E4E7] placeholder-[#71717A] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5 font-mono">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#71717A]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full glass-soft focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#E4E4E7] placeholder-[#71717A] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#71717A] hover:text-[#E4E4E7] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5 font-mono">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#71717A]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full glass-soft focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E4E4E7] placeholder-[#71717A] focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs text-[#71717A]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#0F0F12] border-[#27272A] text-[#8B5CF6] focus:ring-[#8B5CF6] focus:ring-offset-0"
                  />
                  <span>Remember session</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert('Password reset instructions have been dispatched to your email address.')
                  }
                  className="text-[#8B5CF6] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#6d28d9] hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-[#8B5CF6]/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Authenticate Workspace' : 'Complete Account Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Toggle Text */}
          <div className="mt-6 pt-4 border-t border-[#27272A] text-center text-xs text-[#71717A]">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="text-[#8B5CF6] font-semibold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-[#8B5CF6] font-semibold hover:underline"
                >
                  Sign in to existing account
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="text-center text-[11px] text-[#52525B] font-mono z-10 pt-4">
        © {new Date().getFullYear()} REALTY PULSE OS • SECURE ENCRYPTED AUTHENTICATION SESSION [X-901]
      </footer>
    </div>
  );
};
