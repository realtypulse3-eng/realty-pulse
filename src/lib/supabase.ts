import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string): string => {
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv[key]) {
    return metaEnv[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

export const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL') || '';
export const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY') || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
};

export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
