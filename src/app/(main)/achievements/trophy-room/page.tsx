import React from 'react';
import ParticleBackground from '@/components/shared/ParticleBackground';

export const metadata = {
  title: 'Trophy Room | Fitness OS',
};

export default function TrophyRoomPage() {
  return (
    <>
      <ParticleBackground />
      <div className="pt-8 lg:pt-12 pb-20 max-w-container-max mx-auto w-full relative">
        {/* Streak Highlights Hero */}
        <section className="mb-section-gap mt-8">
          <div className="relative overflow-hidden rounded-3xl glass-card p-10 flex flex-col md:flex-row items-center justify-between group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-container/20 text-primary-container border border-primary-container/30">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-label-sm font-label-sm tracking-widest uppercase">Elite Status</span>
              </div>
              <h3 className="font-display-xl text-[72px] leading-[1.1] tracking-[-0.04em] font-extrabold text-on-surface">14-Day Streak</h3>
              <p className="text-muted-text font-body-base text-body-base italic">"Consistency beats motivation. Every single day counts."</p>
              <div className="pt-4 flex gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-primary-container font-bold text-metric-md">320</p>
                  <p className="text-muted-text text-label-sm uppercase tracking-tighter">Total XP</p>
                </div>
                <div className="w-px h-10 bg-glass-border"></div>
                <div className="text-center">
                  <p className="text-primary-container font-bold text-metric-md">Top 2%</p>
                  <p className="text-muted-text text-label-sm uppercase tracking-tighter">Community</p>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-10 md:mt-0 flex items-center justify-center">
              <div className="relative h-48 w-48 lg:h-64 lg:w-64">
                <div className="absolute inset-0 bg-primary-container blur-[60px] opacity-20 animate-pulse"></div>
                <span className="material-symbols-outlined text-[120px] lg:text-[160px] text-primary-container drop-shadow-[0_0_30px_rgba(255,107,53,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
            </div>
          </div>
        </section>

        {/* Achievement Grid */}
        <section className="mb-section-gap">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h4 className="font-headline-lg text-headline-lg text-on-surface">Achievement Grid</h4>
              <p className="text-muted-text">Progress through milestones to unlock legendary status.</p>
            </div>
            <div className="hidden md:flex gap-4">
              <button className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface text-label-sm font-bold border border-glass-border">All Badges</button>
              <button className="px-4 py-2 rounded-lg text-muted-text text-label-sm font-bold hover:text-on-surface transition-colors">Legendary</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-gutter">
            {/* Unlocked Badge 1 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2 transition-transform">
              <div className="unlocked-badge w-20 h-20 mb-4 rounded-full bg-primary-container/10 border border-primary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary-container drop-shadow-[0_0_10px_rgba(255,107,53,0.4)]" style={{ fontVariationSettings: "'FILL' 1" }}>air</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Iron Lungs</h5>
              <p className="text-muted-text text-label-sm mt-1">First 10km Run</p>
            </div>
            
            {/* Unlocked Badge 2 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2 transition-transform">
              <div className="unlocked-badge w-20 h-20 mb-4 rounded-full bg-primary-container/10 border border-primary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Heavy Lifter</h5>
              <p className="text-muted-text text-label-sm mt-1">1000kg Total Lift</p>
            </div>
            
            {/* Unlocked Badge 3 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2 transition-transform">
              <div className="unlocked-badge w-20 h-20 mb-4 rounded-full bg-primary-container/10 border border-primary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>sunny</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Early Bird</h5>
              <p className="text-muted-text text-label-sm mt-1">5 Workouts before 6AM</p>
            </div>
            
            {/* Unlocked Badge 4 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2 transition-transform">
              <div className="unlocked-badge w-20 h-20 mb-4 rounded-full bg-primary-container/10 border border-primary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Weekend Warrior</h5>
              <p className="text-muted-text text-label-sm mt-1">No missed Weekends</p>
            </div>
            
            {/* Unlocked Badge 5 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2 transition-transform">
              <div className="unlocked-badge w-20 h-20 mb-4 rounded-full bg-primary-container/10 border border-primary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>counter_0</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Century Club</h5>
              <p className="text-muted-text text-label-sm mt-1">100 Workouts Completed</p>
            </div>
            
            {/* Locked Badges */}
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center opacity-40 grayscale group hover:grayscale-0 hover:opacity-80 transition-all cursor-not-allowed">
              <div className="w-20 h-20 mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-muted-text">bolt</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Flash</h5>
              <p className="text-muted-text text-label-sm mt-1">Sub 20min 5k</p>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center opacity-40 grayscale group cursor-not-allowed">
              <div className="w-20 h-20 mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-muted-text">mountain_flag</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Peak Performance</h5>
              <p className="text-muted-text text-label-sm mt-1">Altitude Training</p>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center opacity-40 grayscale group cursor-not-allowed">
              <div className="w-20 h-20 mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-muted-text">workspace_premium</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Master</h5>
              <p className="text-muted-text text-label-sm mt-1">365 Day Streak</p>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center opacity-40 grayscale group cursor-not-allowed">
              <div className="w-20 h-20 mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-muted-text">water_drop</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Hydrated</h5>
              <p className="text-muted-text text-label-sm mt-1">Drink 3L for 30 days</p>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center opacity-40 grayscale group cursor-not-allowed">
              <div className="w-20 h-20 mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-muted-text">groups</span>
              </div>
              <h5 className="text-on-surface font-bold text-body-base">Socialite</h5>
              <p className="text-muted-text text-label-sm mt-1">Refer 5 Friends</p>
            </div>
          </div>
        </section>

        {/* Milestone Timeline */}
        <section className="pb-24">
          <h4 className="font-headline-lg text-headline-lg text-on-surface mb-10">Milestone Timeline</h4>
          <div className="relative ml-4">
            {/* Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px timeline-line"></div>
            
            <div className="space-y-12">
              {/* Milestone 1 */}
              <div className="relative pl-10">
                <div className="absolute left-[-5px] top-1 h-[11px] w-[11px] rounded-full bg-primary-container shadow-[0_0_10px_#ff6b35]"></div>
                <span className="text-label-sm font-label-sm text-primary-container tracking-widest uppercase">Aug 20, 2023</span>
                <div className="glass-card p-6 mt-4 rounded-2xl max-w-2xl">
                  <h6 className="font-bold text-body-base text-on-surface">50 Workouts Reached</h6>
                  <p className="text-muted-text text-label-sm mt-2">You've officially built the habit. You are stronger than 85% of new users who started the same month.</p>
                </div>
              </div>
              
              {/* Milestone 2 */}
              <div className="relative pl-10">
                <div className="absolute left-[-5px] top-1 h-[11px] w-[11px] rounded-full bg-primary-container shadow-[0_0_10px_#ff6b35]"></div>
                <span className="text-label-sm font-label-sm text-primary-container tracking-widest uppercase">Jun 15, 2023</span>
                <div className="glass-card p-6 mt-4 rounded-2xl max-w-2xl">
                  <h6 className="font-bold text-body-base text-on-surface">First 5k Completed</h6>
                  <p className="text-muted-text text-label-sm mt-2">Personal record: 24:12. The first of many competitive benchmarks set in your profile.</p>
                </div>
              </div>
              
              {/* Milestone 3 */}
              <div className="relative pl-10 opacity-70">
                <div className="absolute left-[-5px] top-1 h-[11px] w-[11px] rounded-full bg-white/20"></div>
                <span className="text-label-sm font-label-sm text-muted-text tracking-widest uppercase">May 01, 2023</span>
                <div className="glass-card p-6 mt-4 rounded-2xl max-w-2xl bg-surface-container-low border-dashed">
                  <h6 className="font-bold text-body-base text-on-surface">Started Journey</h6>
                  <p className="text-muted-text text-label-sm mt-2">Welcome to Fitness OS. Your account was activated and your transformation began.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
