export type ScreenType = 'start' | 'game' | 'report';

export type CognitiveDomain = 
  | 'Basic Attention' 
  | 'Inhibitory Control (Stroop)' 
  | 'Working Memory' 
  | '1-Back Updating' 
  | 'Cognitive Flexibility' 
  | 'Task Switching (Reverse Stroop)';

export interface ColoredWord {
  word: 'RED' | 'BLUE' | 'GREEN' | 'YELLOW';
  color: 'RED' | 'BLUE' | 'GREEN' | 'YELLOW';
}

export type TargetStimulus = number | ColoredWord;

export interface GameRule {
  id: number;
  title: string;
  text: string;
  domain: CognitiveDomain;
  hint: string;
  check: (current: TargetStimulus, previous: TargetStimulus | null) => boolean;
  generateStimulus: (previous: TargetStimulus | null) => TargetStimulus;
}

export interface RoundStats {
  round: number;
  ruleTitle: string;
  domain: CognitiveDomain;
  attempts: number;
  correct: number;
  accuracy: number;
  scoreEarned: number;
}

export interface StoredStats {
  highScore: number;
  gamesPlayed: number;
  bestStreak: number;
  totalAttempts: number;
  totalCorrect: number;
}
