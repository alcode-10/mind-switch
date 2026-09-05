/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenType, TargetStimulus, RoundStats } from './types';
import { GAME_RULES } from './data/rules';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { ReportScreen } from './components/ReportScreen';
import { initAudioSettings, getIsMuted, toggleAudioMute, playRoundSwitchSound, playTickSound } from './utils/audio';

const ROUND_TIME = 10;
const INTERVAL_SPEED = 1200; // Time per stimulus (ms)

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('start');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  
  const [currentTarget, setCurrentTarget] = useState<TargetStimulus | null>(null);
  const [previousTarget, setPreviousTarget] = useState<TargetStimulus | null>(null);

  const [highScore, setHighScore] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [roundHistories, setRoundHistories] = useState<RoundStats[]>([]);

  // Refs to avoid stale state in setInterval callbacks
  const roundRef = useRef(0);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const maxStreakRef = useRef(0);
  const totalAttemptsRef = useRef(0);
  const correctClicksRef = useRef(0);
  const currentTargetRef = useRef<TargetStimulus | null>(null);
  const previousTargetRef = useRef<TargetStimulus | null>(null);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stimulusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Round specific tracking for detailed report
  const roundStartScoreRef = useRef(0);
  const roundAttemptsRef = useRef(0);
  const roundCorrectRef = useRef(0);

  // Load persistence
  useEffect(() => {
    initAudioSettings();
    setIsMuted(getIsMuted());

    const savedHigh = localStorage.getItem('mindSwitchHigh');
    if (savedHigh) {
      setHighScore(parseInt(savedHigh, 10) || 0);
    }

    const savedStreak = localStorage.getItem('mindSwitchBestStreak');
    if (savedStreak) {
      setBestStreak(parseInt(savedStreak, 10) || 0);
    }

    const savedGames = localStorage.getItem('mindSwitchGamesPlayed');
    if (savedGames) {
      setGamesPlayed(parseInt(savedGames, 10) || 0);
    }
  }, []);

  const handleToggleMute = () => {
    const updated = toggleAudioMute();
    setIsMuted(updated);
  };

  const clearGameIntervals = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (stimulusIntervalRef.current) {
      clearInterval(stimulusIntervalRef.current);
      stimulusIntervalRef.current = null;
    }
  };

  const nextStimulus = useCallback(() => {
    const activeRound = roundRef.current;
    const rule = GAME_RULES[activeRound];
    if (!rule) return;

    // Shift targets
    const prev = currentTargetRef.current;
    previousTargetRef.current = prev;
    setPreviousTarget(prev);

    const next = rule.generateStimulus(prev);
    currentTargetRef.current = next;
    setCurrentTarget(next);
  }, []);

  const endGame = useCallback(() => {
    clearGameIntervals();

    const finalScore = scoreRef.current;
    const finalMaxStreak = maxStreakRef.current;

    // Check & save High Score
    const savedHigh = parseInt(localStorage.getItem('mindSwitchHigh') || '0', 10);
    if (finalScore > savedHigh) {
      localStorage.setItem('mindSwitchHigh', String(finalScore));
      setHighScore(finalScore);
      setIsNewHigh(true);
    } else {
      setIsNewHigh(false);
    }

    // Save Best Streak
    const savedStreak = parseInt(localStorage.getItem('mindSwitchBestStreak') || '0', 10);
    if (finalMaxStreak > savedStreak) {
      localStorage.setItem('mindSwitchBestStreak', String(finalMaxStreak));
      setBestStreak(finalMaxStreak);
    }

    // Save Games Played
    const prevGames = parseInt(localStorage.getItem('mindSwitchGamesPlayed') || '0', 10);
    localStorage.setItem('mindSwitchGamesPlayed', String(prevGames + 1));
    setGamesPlayed(prevGames + 1);

    setScreen('report');
  }, []);

  const startRound = useCallback((roundIdx: number) => {
    clearGameIntervals();

    roundRef.current = roundIdx;
    setRound(roundIdx);
    setTimeLeft(ROUND_TIME);

    roundStartScoreRef.current = scoreRef.current;
    roundAttemptsRef.current = 0;
    roundCorrectRef.current = 0;

    playRoundSwitchSound();

    // Reset stimulus
    currentTargetRef.current = null;
    previousTargetRef.current = null;
    setCurrentTarget(null);
    setPreviousTarget(null);

    // Initial stimulus
    const rule = GAME_RULES[roundIdx];
    const initialStim = rule.generateStimulus(null);
    currentTargetRef.current = initialStim;
    setCurrentTarget(initialStim);

    // Stimulus interval
    stimulusIntervalRef.current = setInterval(() => {
      nextStimulus();
    }, INTERVAL_SPEED);

    // Timer loop
    let remaining = ROUND_TIME;
    timerIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

      if (remaining <= 3 && remaining > 0) {
        playTickSound();
      }

      if (remaining <= 0) {
        clearGameIntervals();
        
        // Record round stats
        const ruleInfo = GAME_RULES[roundIdx];
        const scoreGained = Math.max(0, scoreRef.current - roundStartScoreRef.current);
        const acc = roundAttemptsRef.current > 0
          ? Math.round((roundCorrectRef.current / roundAttemptsRef.current) * 100)
          : 0;

        setRoundHistories((prev) => [
          ...prev,
          {
            round: roundIdx + 1,
            ruleTitle: ruleInfo.title,
            domain: ruleInfo.domain,
            attempts: roundAttemptsRef.current,
            correct: roundCorrectRef.current,
            accuracy: acc,
            scoreEarned: scoreGained,
          },
        ]);

        const nextRoundIdx = roundIdx + 1;
        if (nextRoundIdx >= 10) {
          endGame();
        } else {
          startRound(nextRoundIdx);
        }
      }
    }, 1000);
  }, [nextStimulus, endGame]);

  const startGame = useCallback(() => {
    clearGameIntervals();
    
    setScore(0);
    scoreRef.current = 0;
    setStreak(0);
    streakRef.current = 0;
    setMaxStreak(0);
    maxStreakRef.current = 0;
    setTotalAttempts(0);
    totalAttemptsRef.current = 0;
    setCorrectClicks(0);
    correctClicksRef.current = 0;
    setRoundHistories([]);
    setIsNewHigh(false);

    setScreen('game');
    startRound(0);
  }, [startRound]);

  const handleAttempt = useCallback((isCorrect: boolean) => {
    totalAttemptsRef.current += 1;
    roundAttemptsRef.current += 1;
    setTotalAttempts(totalAttemptsRef.current);

    if (isCorrect) {
      const addedPoints = 10 + (streakRef.current * 2);
      scoreRef.current += addedPoints;
      correctClicksRef.current += 1;
      roundCorrectRef.current += 1;
      streakRef.current += 1;
      maxStreakRef.current = Math.max(streakRef.current, maxStreakRef.current);

      setScore(scoreRef.current);
      setCorrectClicks(correctClicksRef.current);
      setStreak(streakRef.current);
      setMaxStreak(maxStreakRef.current);
    } else {
      scoreRef.current = Math.max(0, scoreRef.current - 5);
      streakRef.current = 0;

      setScore(scoreRef.current);
      setStreak(0);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearGameIntervals();
    };
  }, []);

  const overallAccuracy = totalAttempts > 0 
    ? Math.round((correctClicks / totalAttempts) * 100) 
    : 0;

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-[#F8FAFC] flex flex-col justify-center items-center overflow-x-hidden relative font-sans p-2 sm:p-4 lg:p-6">
      {screen === 'start' && (
        <StartScreen
          highScore={highScore}
          bestStreak={bestStreak}
          gamesPlayed={gamesPlayed}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onStartGame={startGame}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          currentRule={GAME_RULES[round]}
          roundIndex={round}
          score={score}
          streak={streak}
          timeLeft={timeLeft}
          stimulus={currentTarget}
          previousStimulus={previousTarget}
          onAttempt={handleAttempt}
          onTimeOut={() => {}}
        />
      )}

      {screen === 'report' && (
        <ReportScreen
          score={score}
          accuracy={overallAccuracy}
          maxStreak={maxStreak}
          roundsCleared={roundHistories.length || round}
          isNewHigh={isNewHigh}
          highScore={highScore}
          roundHistories={roundHistories}
          onRestart={startGame}
          onMainMenu={() => setScreen('start')}
        />
      )}
    </main>
  );
}
