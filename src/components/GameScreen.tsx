import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GameRule, TargetStimulus, ColoredWord } from '../types';
import { COLOR_HEX } from '../data/rules';
import { playSuccessSound, playErrorSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { Flame, Clock, Zap } from 'lucide-react';

interface GameScreenProps {
  currentRule: GameRule;
  roundIndex: number; // 0 to 9
  score: number;
  streak: number;
  timeLeft: number;
  stimulus: TargetStimulus | null;
  previousStimulus: TargetStimulus | null;
  onAttempt: (isCorrect: boolean) => void;
  onTimeOut: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  currentRule,
  roundIndex,
  score,
  streak,
  timeLeft,
  stimulus,
  previousStimulus,
  onAttempt,
}) => {
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [feedbackDelta, setFeedbackDelta] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const hasRespondedRef = useRef(false);
  const stimulusCountRef = useRef(0);

  // Reset responded state on new stimulus
  useEffect(() => {
    hasRespondedRef.current = false;
    stimulusCountRef.current += 1;
  }, [stimulus]);

  const handleInput = useCallback(() => {
    if (!stimulus) return;
    if (hasRespondedRef.current) return; // Prevent double tapping on the same stimulus

    hasRespondedRef.current = true;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 120);

    const isCorrect = currentRule.check(stimulus, previousStimulus);

    if (isCorrect) {
      const addedPoints = 10 + (streak * 2);
      setFeedback('correct');
      setFeedbackDelta(`+${addedPoints}`);
      playSuccessSound();
      triggerHaptic('success');
      onAttempt(true);
    } else {
      setFeedback('wrong');
      setFeedbackDelta('-5');
      playErrorSound();
      triggerHaptic('error');
      onAttempt(false);
    }

    // Reset visual feedback border
    setTimeout(() => {
      setFeedback(null);
      setFeedbackDelta(null);
    }, 280);
  }, [stimulus, previousStimulus, currentRule, streak, onAttempt]);

  // Spacebar support for desktop play
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleInput();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  // Render content and color
  let displayContent: React.ReactNode = '?';
  let fontColor = '#F8FAFC';

  if (stimulus !== null) {
    if (typeof stimulus === 'number') {
      displayContent = stimulus;
      fontColor = '#F8FAFC';
    } else if (typeof stimulus === 'object' && 'word' in stimulus) {
      const cw = stimulus as ColoredWord;
      displayContent = cw.word;
      fontColor = COLOR_HEX[cw.color] || '#F8FAFC';
    }
  }

  // Border & Glow style for #target-display based on feedback
  let borderClass = 'border-2 border-[#38BDF8]';
  let glowShadow = 'shadow-[0_0_50px_-10px_rgba(56,189,248,0.25)]';
  if (feedback === 'correct') {
    borderClass = 'border-2 border-[#22C55E]';
    glowShadow = 'shadow-[0_0_50px_rgba(34,197,94,0.45)]';
  } else if (feedback === 'wrong') {
    borderClass = 'border-2 border-[#EF4444]';
    glowShadow = 'shadow-[0_0_50px_rgba(239,68,68,0.45)]';
  }

  const timePercentage = Math.max(0, Math.min(100, (timeLeft / 10) * 100));

  return (
    <div 
      id="screen-game" 
      className="screen active w-full max-w-6xl min-h-[95vh] bg-[#0A0A0B] text-[#F8FAFC] flex flex-col lg:flex-row font-sans select-none overflow-hidden my-auto border-0 lg:border border-[#1E293B] rounded-none lg:rounded-2xl shadow-2xl"
    >
      {/* Geometric Balance Left Aside (Visible on large screens, compact on mobile) */}
      <aside className="hidden lg:flex w-72 border-r border-[#1E293B] flex-col p-8 bg-[#0A0A0B] shrink-0 justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none text-[#F8FAFC]">
              Mind<br /><span className="text-[#38BDF8]">Switch</span>
            </h1>
            <p className="text-[10px] text-[#64748B] uppercase tracking-[0.2em] mt-2 font-semibold">
              Cognitive Architecture v1.4
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] uppercase text-[#64748B] font-bold tracking-widest">Core Metrics</p>
              <div className="bg-[#111116] border border-[#1E293B] p-4 rounded-sm">
                <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold mb-1">Current Score</span>
                <span className="text-2xl font-mono font-bold text-[#38BDF8]">{score}</span>
              </div>
              <div className="bg-[#111116] border border-[#1E293B] p-4 rounded-sm">
                <span className="block text-[9px] uppercase tracking-wider text-[#64748B] font-bold mb-1">Active Streak</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono font-bold text-[#F8FAFC]">{streak}</span>
                  {streak > 0 && (
                    <span className="text-[10px] text-amber-400 font-mono font-bold">+{streak * 2} bonus</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase text-[#64748B] font-bold tracking-widest">Progress</p>
                <span className="text-[10px] font-mono text-[#38BDF8]">{roundIndex + 1}/10</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-7 rounded-sm flex items-center justify-center font-mono text-[9px] font-bold ${
                      i < roundIndex
                        ? 'bg-[#38BDF8] text-[#0A0A0B]'
                        : i === roundIndex
                        ? 'bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] animate-pulse'
                        : 'bg-[#1E293B] text-[#64748B]'
                    }`}
                  >
                    0{i + 1}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#94A3B8] italic pt-1">
                Round 0{roundIndex + 1}: {currentRule.title}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2.5 opacity-60">
            <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-mono">System Live</span>
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">{currentRule.domain}</span>
        </div>
      </aside>

      {/* Main Game Center Panel */}
      <main className="flex-grow flex flex-col relative bg-[#0D0D12] min-h-[540px]">
        {/* Header Bar */}
        <header 
          id="game-stats"
          className="h-20 border-b border-[#1E293B] flex items-center justify-between px-5 md:px-10 shrink-0"
        >
          <div className="flex gap-6 md:gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-[#64748B] font-mono tracking-wider font-bold">Current Score</span>
              <span id="score-display" className="text-xl md:text-2xl font-mono font-bold text-[#38BDF8]">
                {score}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-[#64748B] font-mono tracking-wider font-bold">Active Streak</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-mono font-bold text-[#F8FAFC]">
                  {streak}
                </span>
                {streak > 0 && <Flame className="w-4 h-4 text-orange-400" />}
              </div>
            </div>
            <div id="round-num" className="flex flex-col lg:hidden">
              <span className="text-[10px] uppercase text-[#64748B] font-mono tracking-wider font-bold">Round</span>
              <span className="text-xl font-mono font-bold text-[#38BDF8]">{roundIndex + 1}/10</span>
            </div>
          </div>

          {/* Capsule Timer Pill from Geometric Balance Design */}
          <div className="flex items-center gap-4">
            <div 
              id="timer" 
              className="h-10 w-36 md:w-48 bg-[#111116] border border-[#1E293B] rounded-full relative overflow-hidden flex items-center justify-center shadow-inner"
            >
              <div 
                className="absolute top-0 left-0 h-full bg-[#38BDF8] transition-all duration-200 opacity-90"
                style={{ width: `${timePercentage}%` }}
              />
              <span className="relative z-10 text-[11px] font-mono font-bold text-[#F8FAFC] tracking-wider drop-shadow-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 inline text-sky-200" />
                {timeLeft}s
              </span>
            </div>
          </div>
        </header>

        {/* Center Game Arena */}
        <section className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 relative">
          {/* Instruction Block */}
          <div className="text-center mb-8 md:mb-10 max-w-xl">
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.4em] text-[#38BDF8] font-mono font-bold mb-3">
              Instruction Protocol &bull; {currentRule.domain}
            </p>
            <h2 
              id="rule-text" 
              className="text-xl md:text-2xl font-medium tracking-tight text-[#F8FAFC] leading-snug px-4"
            >
              {currentRule.text}
            </h2>
            <p className="text-xs text-[#94A3B8] italic mt-2">
              {currentRule.hint}
            </p>
          </div>

          {/* Target Display Card with Floating Badge */}
          <div className="relative flex flex-col items-center">
            <button
              type="button"
              id="target-display"
              onClick={handleInput}
              style={{
                color: fontColor,
              }}
              className={`w-[290px] sm:w-[380px] md:w-[440px] h-[230px] sm:h-[280px] md:h-[310px] bg-[#111116] rounded-3xl flex items-center justify-center text-7xl md:text-8xl font-black select-none cursor-pointer transition-all duration-100 ${borderClass} ${glowShadow} ${
                isPressed ? 'scale-95' : 'hover:scale-[1.01]'
              }`}
            >
              {displayContent}
            </button>

            {/* Stimulus Active floating badge */}
            <div className="absolute -bottom-4 md:-bottom-5 bg-[#38BDF8] text-[#0A0A0B] px-6 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg pointer-events-none whitespace-nowrap">
              Stimulus Active
            </div>

            {/* Floating score delta feedback (+10 / -5) */}
            {feedbackDelta && (
              <div 
                className={`absolute -top-6 right-2 font-mono font-extrabold text-3xl transition-all duration-200 ${
                  feedback === 'correct' ? 'text-[#22C55E] drop-shadow-md' : 'text-[#EF4444] drop-shadow-md'
                }`}
              >
                {feedbackDelta}
              </div>
            )}
          </div>

          {/* Action Buttons / Spacebar Helper */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={handleInput}
              className="w-48 h-13 border border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8] rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#38BDF8] hover:text-[#0A0A0B] transition-colors cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Tap If Match</span>
            </button>
            <span className="text-[11px] text-[#64748B] font-mono">
              Spacebar or click card directly
            </span>
          </div>

          {/* Previous stimulus reminder for N-Back / Higher than last */}
          {roundIndex === 4 && (
            <div className="mt-4 text-xs font-mono text-[#94A3B8] bg-[#111116] px-3.5 py-1.5 rounded-sm border border-[#1E293B]">
              Previous digit: <strong className="text-[#38BDF8]">{typeof previousStimulus === 'number' ? previousStimulus : '-'}</strong>
            </div>
          )}
          {roundIndex === 7 && (
            <div className="mt-4 text-xs font-mono text-[#94A3B8] bg-[#111116] px-3.5 py-1.5 rounded-sm border border-[#1E293B]">
              Previous item: <strong className="text-[#38BDF8]">{typeof previousStimulus === 'number' ? previousStimulus : '-'}</strong>
            </div>
          )}
        </section>
      </main>

      {/* Geometric Balance Right Aside (Analytics strip) */}
      <aside className="hidden lg:flex w-16 border-l border-[#1E293B] flex-col items-center py-8 gap-10 bg-[#0A0A0B] shrink-0">
        <span 
          className="text-[9px] uppercase tracking-[0.35em] text-[#64748B] font-mono font-bold whitespace-nowrap rotate-90 my-10 select-none"
        >
          Cognitive Pulse
        </span>
        <div className="flex flex-col gap-2 mt-auto">
          <div className="w-1 h-12 bg-[#38BDF8] rounded-full animate-pulse" />
          <div className="w-1 h-8 bg-[#38BDF8]/60 rounded-full" />
          <div className="w-1 h-16 bg-[#38BDF8] rounded-full animate-pulse" />
          <div className="w-1 h-6 bg-[#38BDF8]/40 rounded-full" />
        </div>
      </aside>
    </div>
  );
};
