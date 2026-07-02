'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { login, signup } from '@/actions/auth';
import { motion } from 'framer-motion';
import { Dumbbell, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  async function handleSubmitWithAction(formData: FormData, action: typeof login | typeof signup) {
    setLoading(true);
    setError(null);
    const result = await action(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleAdminLogin() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          login_hint: 'himanshu.btmtcs4242906@nfsu.ac.in'
        }
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-zinc-50 dark:bg-[#0A0A0A] bg-noise relative">
      {/* Glow effect in background */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#FF6B35]/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#1F1F1F] shadow-2xl text-zinc-900 dark:text-[#F5F5F5]">
          <CardHeader className="space-y-1.5 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-xl bg-[#2A160F] border border-[#FF6B35]/20 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-[#FF6B35]" />
              </div>
            </div>
            <CardTitle className="text-2xl font-black tracking-widest text-zinc-900 dark:text-white uppercase">
              FITNESS <span className="text-[#FF6B35]">OS</span>
            </CardTitle>
            <CardDescription className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
              Track • Analyze • Improve • Repeat
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-2">
            {error && (
              <div className="p-3 text-xs font-bold text-red-400 bg-red-950/30 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full h-12 text-sm font-bold border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800/50 text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 transition-colors cursor-pointer flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              CONTINUE WITH GOOGLE
            </Button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-[#1F1F1F]" />
              </div>
              <span className="relative bg-white dark:bg-[#111111] px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Or Use Email
              </span>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  className="flex h-12 w-full rounded-lg border border-zinc-200 dark:border-[#1F1F1F] bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF6B35]/50 font-mono transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  type="password"
                  className="flex h-12 w-full rounded-lg border border-zinc-200 dark:border-[#1F1F1F] bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF6B35]/50 font-mono transition-colors"
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="button" 
                  disabled={loading}
                  onClick={async () => {
                    setIsLoginMode(true);
                    const formData = new FormData(document.querySelector('form')!);
                    await handleSubmitWithAction(formData, login);
                  }}
                  className="w-full h-12 text-xs font-bold tracking-widest uppercase bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 dark:text-white shadow-[0_0_20px_rgba(255,107,53,0.15)] transition-transform active:scale-95 cursor-pointer"
                >
                  {loading && isLoginMode ? 'VERIFYING...' : 'SIGN IN'}
                </Button>
              </div>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200 dark:border-[#1F1F1F]" />
                </div>
                <span className="relative bg-white dark:bg-[#111111] px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  New Athlete?
                </span>
              </div>

              <Button 
                type="button"
                variant="outline" 
                disabled={loading}
                onClick={async () => {
                  setIsLoginMode(false);
                  const formData = new FormData(document.querySelector('form')!);
                  await handleSubmitWithAction(formData, signup);
                }}
                className="w-full h-12 text-xs font-bold tracking-widest uppercase border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-950 transition-colors cursor-pointer"
              >
                {loading && !isLoginMode ? 'CREATING...' : 'CREATE AN ACCOUNT'}
              </Button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-zinc-600 mt-6 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" /> Protected by Enterprise RLS
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Admin Login Corner Button */}
      <button 
        onClick={handleAdminLogin}
        disabled={loading}
        className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-full bg-zinc-900/10 dark:bg-white/10 hover:bg-zinc-900/20 dark:hover:bg-white/20 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all z-50 cursor-pointer disabled:opacity-50"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        Admin Login
      </button>
    </div>
  );
}
