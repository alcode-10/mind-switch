import React, { useState } from 'react';
import { Trophy, Award, RefreshCw, Home, Share2, Check, Brain } from 'lucide-react';
import { RoundStats } from '../types';

interface ReportScreenProps {
  score: number;
  accuracy: number;
  maxStreak: number;
  roundsCleared: number;
  isNewHigh: boolean;
  highScore: number;
  roundHistories: RoundStats[];
  onRestart: () => void;
  onMainMenu: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  score,
  accuracy,
  maxStreak,
  roundsCleared,
  isNewHigh,
  highScore,
  roundHistories,
  onRestart,
  onMainMenu,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Cognitive evaluation title
  let cognitiveRank = 'Apprentice';
  let rankColor = 'text-[#38BDF8]';
  let rankDesc = 'Good foundation. Keep training to boost rapid task switching.';

  if (score >= 250 && accuracy >= 85) {
    cognitiveRank = 'Master Mind';
    rankColor = 'text-amber-400';
    rankDesc = 'Exceptional cognitive flexibility, inhibitory control, and working memory!';
  } else if (score >= 180 && accuracy >= 75) {
    cognitiveRank = 'Neural Athlete';
    rankColor = 'text-sky-300';
    rankDesc = 'High agility across Stroop tests and rapid memory updating.';
  } else if (score >= 120 && accuracy >= 60) {
    cognitiveRank = 'Sharp Focus';
    rankColor = 'text-[#22C55E]';
    rankDesc = 'Solid selective attention. Train working memory comparisons to break 200+.';
  }

  const handleShare = () => {
    const text = `🧠 Mind Switch Session\nScore: ${score} pts | Accuracy: ${accuracy}%\nMax Streak: ${maxStreak} | Cleared: ${roundsCleared}/10 rounds\nCognitive Rank: ${cognitiveRank}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      id="screen-report" 
      className="screen active flex flex-col items-center justify-center text-center w-[92%] max-w-[460px] mx-auto min-h-screen py-8"
    >
      {/* Header Banner */}
      <div className="mb-6">
        {isNewHigh ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold font-mono mb-3 tracking-widest uppercase animate-pulse">
            <Trophy className="w-3.5 h-3.5" />
            <span>New High Score Record</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] text-[10px] font-bold font-mono mb-3 tracking-widest uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Session Protocol Concluded</span>
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-[#F8FAFC]">
          Performance<br /><span className="text-[#38BDF8]">Telemetry</span>
        </h2>
        <p className="text-[10px] uppercase text-[#64748B] tracking-[0.2em] font-semibold mt-2">
          Assessment Report
        </p>
      </div>

      {/* Rank Card */}
      <div className="w-full bg-[#111116] border border-[#1E293B] p-4 rounded-sm mb-4 text-left">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] uppercase tracking-widest text-[#64748B] font-bold font-mono">
            Cognitive Assessment
          </span>
          <span className={`text-xs font-extrabold font-mono uppercase tracking-wider ${rankColor}`}>
            {cognitiveRank}
          </span>
        </div>
        <p className="text-xs text-[#94A3B8] italic">
          {rankDesc}
        </p>
      </div>

      {/* 2x2 Performance Grid - Geometric Balance Cards */}
      <div className="report-grid grid grid-cols-2 gap-2.5 w-full mb-6">
        <div className="stat-box bg-[#111116] border border-[#1E293B] p-4 rounded-sm text-left">
          <span className="stat-label text-[9px] uppercase font-mono tracking-widest text-[#64748B] font-bold block mb-1">
            Final Score
          </span>
          <span id="res-score" className="stat-val text-3xl font-extrabold font-mono text-[#38BDF8] block">
            {score}
          </span>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">Best: {highScore}</span>
        </div>

        <div className="stat-box bg-[#111116] border border-[#1E293B] p-4 rounded-sm text-left">
          <span className="stat-label text-[9px] uppercase font-mono tracking-widest text-[#64748B] font-bold block mb-1">
            Accuracy
          </span>
          <span id="res-acc" className="stat-val text-3xl font-extrabold font-mono text-[#22C55E] block">
            {accuracy}%
          </span>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">Precision rate</span>
        </div>

        <div className="stat-box bg-[#111116] border border-[#1E293B] p-4 rounded-sm text-left">
          <span className="stat-label text-[9px] uppercase font-mono tracking-widest text-[#64748B] font-bold block mb-1">
            Max Streak
          </span>
          <span id="res-streak" className="stat-val text-3xl font-extrabold font-mono text-orange-400 block">
            {maxStreak}
          </span>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">Consecutive hits</span>
        </div>

        <div className="stat-box bg-[#111116] border border-[#1E293B] p-4 rounded-sm text-left">
          <span className="stat-label text-[9px] uppercase font-mono tracking-widest text-[#64748B] font-bold block mb-1">
            Rounds Cleared
          </span>
          <span id="res-rounds" className="stat-val text-3xl font-extrabold font-mono text-[#F8FAFC] block">
            {roundsCleared}/10
          </span>
          <span className="text-[10px] text-[#64748B] font-mono mt-1 block">Full battery</span>
        </div>
      </div>

      {/* Toggle Round breakdown */}
      {roundHistories.length > 0 && (
        <div className="w-full mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-[#38BDF8] hover:text-sky-300 font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 w-full py-1.5 cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>{showDetails ? 'Hide Round Telemetry' : 'View Round Telemetry'}</span>
          </button>

          {showDetails && (
            <div className="mt-3 bg-[#111116] border border-[#1E293B] rounded-sm p-3 text-left space-y-2 max-h-48 overflow-y-auto">
              {roundHistories.map((rh) => (
                <div key={rh.round} className="flex items-center justify-between text-xs py-1.5 border-b border-[#1E293B] last:border-0">
                  <div>
                    <span className="font-semibold text-[#F8FAFC]">R0{rh.round}: {rh.ruleTitle}</span>
                    <span className="text-[10px] text-[#64748B] block font-mono">{rh.domain}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[#22C55E] font-bold">{rh.accuracy}%</span>
                    <span className="text-[10px] text-[#64748B] block">+{rh.scoreEarned} pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons - Geometric Balance styled */}
      <div className="w-full flex flex-col gap-3">
        <button 
          id="restart-game-btn"
          className="btn w-full h-15 border border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] rounded-xl font-bold uppercase tracking-widest hover:bg-[#38BDF8] hover:text-[#0A0A0B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_-10px_rgba(56,189,248,0.2)]"
          onClick={onRestart}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-Engage Sequence</span>
        </button>

        <div className="flex gap-3 w-full">
          <button 
            id="main-menu-btn"
            className="flex-1 h-12 border border-[#1E293B] text-[#64748B] rounded-xl font-bold uppercase tracking-widest text-xs hover:border-white hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            onClick={onMainMenu}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Main Menu</span>
          </button>

          <button
            id="share-score-btn"
            onClick={handleShare}
            className="h-12 px-5 bg-[#111116] border border-[#1E293B] text-[#64748B] hover:text-[#F8FAFC] rounded-xl font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            title="Share score"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
