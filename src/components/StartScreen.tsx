import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Info, Flame, Trophy } from 'lucide-react';
import { RoundsModal } from './RoundsModal';

interface StartScreenProps {
  highScore: number;
  bestStreak: number;
  gamesPlayed: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  highScore,
  bestStreak,
  gamesPlayed,
  isMuted,
  onToggleMute,
  onStartGame,
}) => {
  const [showRoundsModal, setShowRoundsModal] = useState(false);

  return (
    <div 
      id="screen-start" 
      className="screen active flex flex-col items-center justify-center text-center w-[92%] max-w-[460px] mx-auto min-h-screen py-8"
    >
      {/* Top Utilities */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          id="toggle-audio-btn"
          onClick={onToggleMute}
          className="px-3 py-2 rounded-sm bg-[#111116] text-[#64748B] hover:text-[#F8FAFC] border border-[#1E293B] hover:border-[#38BDF8]/50 transition-colors flex items-center gap-2 text-xs"
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#EF4444]" /> : <Volume2 className="w-3.5 h-3.5 text-[#38BDF8]" />}
          <span className="font-mono text-[10px] uppercase tracking-widest">{isMuted ? 'Muted' : 'Audio On'}</span>
        </button>

        <button
          id="open-rounds-btn"
          onClick={() => setShowRoundsModal(true)}
          className="px-3 py-2 rounded-sm bg-[#111116] text-[#64748B] hover:text-[#F8FAFC] border border-[#1E293B] hover:border-[#38BDF8]/50 transition-colors flex items-center gap-1.5 text-xs"
          aria-label="View 10 Rounds Breakdown"
        >
          <Info className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="font-mono text-[10px] uppercase tracking-widest">Rounds Protocol</span>
        </button>
      </div>

      {/* Hero Branding - Geometric Balance typography */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-[#F8FAFC]">
          Mind<br />
          <span className="text-[#38BDF8]">Switch</span>
        </h1>
        <p className="text-[10px] text-[#64748B] uppercase tracking-[0.25em] mt-3 font-semibold">
          Cognitive Architecture v1.4
        </p>
        <p className="text-xs text-[#94A3B8] italic mt-1">
          Adapt. Remember. Focus.
        </p>
      </div>

      {/* Core Metrics - Geometric Cards */}
      <div className="w-full space-y-2 mb-6 text-left">
        <p className="text-[10px] uppercase text-[#64748B] font-bold tracking-widest px-0.5">Core Metrics</p>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#111116] border border-[#1E293B] p-4 rounded-sm text-left">
            <span className="block text-[9px] uppercase tracking-widest text-[#64748B] font-bold mb-1">
              All-Time High
            </span>
            <span id="high-score" className="text-2xl md:text-3xl font-mono font-bold text-[#F8FAFC] block">
              {highScore.toLocaleString()}
            </span>
            <span className="text-[9px] text-[#64748B] font-mono mt-0.5 block">{gamesPlayed} sessions logged</span>
          </div>

          <div className="bg-[#111116] border border-[#1E293B] p-4 rounded-sm text-left">
            <span className="block text-[9px] uppercase tracking-widest text-[#64748B] font-bold mb-1">
              Best Streak
            </span>
            <span id="best-streak-display" className="text-2xl md:text-3xl font-mono font-bold text-[#38BDF8] block">
              {bestStreak}
            </span>
            <span className="text-[9px] text-[#64748B] font-mono mt-0.5 block">Max uninterrupted hits</span>
          </div>
        </div>
      </div>

      {/* 10-Round Progress Preview Grid */}
      <div className="w-full space-y-2 mb-8 text-left">
        <div className="flex items-center justify-between px-0.5">
          <p className="text-[10px] uppercase text-[#64748B] font-bold tracking-widest">Progress Blueprint</p>
          <span className="text-[10px] font-mono text-[#38BDF8]">10 Rounds / 100s</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-8 rounded-sm flex items-center justify-center font-mono text-[10px] font-bold border ${
                i === 0 
                  ? 'bg-[#38BDF8]/20 border-[#38BDF8]/40 text-[#38BDF8]' 
                  : 'bg-[#111116] border-[#1E293B] text-[#64748B]'
              }`}
            >
              0{i + 1}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#94A3B8] italic pt-1">
          Rounds 01-10: Value filters, Stroop effects, Working memory & N-back variants.
        </p>
      </div>

      {/* Start Button - Geometric Balance style */}
      <button 
        id="start-game-btn"
        className="btn w-full h-16 border border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] rounded-xl font-bold uppercase tracking-widest hover:bg-[#38BDF8] hover:text-[#0A0A0B] transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99] shadow-[0_0_30px_-10px_rgba(56,189,248,0.25)]"
        onClick={onStartGame}
      >
        <Play className="w-4 h-4 fill-current" />
        <span>Initiate Sequence</span>
      </button>

      {/* System Ready Status */}
      <div className="mt-8 pt-4 border-t border-[#1E293B] w-full flex items-center justify-between text-[#64748B]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-mono">System Ready</span>
        </div>
        <span className="text-[10px] font-mono">1.2s Stimulus</span>
      </div>

      {/* Rounds Guide Modal */}
      <RoundsModal isOpen={showRoundsModal} onClose={() => setShowRoundsModal(false)} />
    </div>
  );
};
