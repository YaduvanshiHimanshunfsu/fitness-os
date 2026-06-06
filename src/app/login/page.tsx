'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { login, signup } from '@/actions/auth';
import { motion } from 'framer-motion';
import { Dumbbell, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const action = isLoginMode ? login : signup;
    const result = await action(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#0A0A0A] bg-noise relative">
      {/* Glow effect in background */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#FF6B35]/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-[#111111] border border-[#1F1F1F] shadow-2xl text-[#F5F5F5]">
          <CardHeader className="space-y-1.5 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-xl bg-[#2A160F] border border-[#FF6B35]/20 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-[#FF6B35]" />
              </div>
            </div>
            <CardTitle className="text-2xl font-black tracking-widest text-white uppercase">
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

            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  className="flex h-12 w-full rounded-lg border border-[#1F1F1F] bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF6B35]/50 font-mono transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  type="password"
                  className="flex h-12 w-full rounded-lg border border-[#1F1F1F] bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF6B35]/50 font-mono transition-colors"
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  onClick={() => setIsLoginMode(true)}
                  className="w-full h-12 text-xs font-bold tracking-widest uppercase bg-[#FF6B35] hover:bg-[#FF8C61] text-white shadow-[0_0_20px_rgba(255,107,53,0.15)] transition-transform active:scale-95 cursor-pointer"
                >
                  {loading && isLoginMode ? 'VERIFYING...' : 'SIGN IN'}
                </Button>
              </div>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#1F1F1F]" />
                </div>
                <span className="relative bg-[#111111] px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  New Athlete?
                </span>
              </div>

              <Button 
                type="submit"
                variant="outline" 
                disabled={loading}
                onClick={() => setIsLoginMode(false)}
                className="w-full h-12 text-xs font-bold tracking-widest uppercase border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white bg-zinc-950 transition-colors cursor-pointer"
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
    </div>
  );
}
