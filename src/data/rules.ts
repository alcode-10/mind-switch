import { GameRule, TargetStimulus, ColoredWord } from '../types';

export const COLORS: Array<'RED' | 'BLUE' | 'GREEN' | 'YELLOW'> = ['RED', 'BLUE', 'GREEN', 'YELLOW'];

export const COLOR_HEX: Record<'RED' | 'BLUE' | 'GREEN' | 'YELLOW', string> = {
  RED: '#ef4444',
  BLUE: '#38bdf8',
  GREEN: '#22c55e',
  YELLOW: '#facc15',
};

// Helper to pick random item from array
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const GAME_RULES: GameRule[] = [
  {
    id: 1,
    title: 'Value Filter',
    text: 'Tap numbers GREATER than 5',
    domain: 'Basic Attention',
    hint: 'Tap for 6, 7, 8, 9. Ignore 0, 1, 2, 3, 4, 5.',
    check: (val) => typeof val === 'number' && val > 5,
    generateStimulus: () => {
      // 50% chance > 5 (6..9), 50% chance <= 5 (0..5)
      if (Math.random() < 0.5) {
        return Math.floor(Math.random() * 4) + 6; // 6, 7, 8, 9
      } else {
        return Math.floor(Math.random() * 6); // 0, 1, 2, 3, 4, 5
      }
    },
  },
  {
    id: 2,
    title: 'Even Numbers',
    text: 'Tap EVEN numbers',
    domain: 'Basic Attention',
    hint: 'Tap for 0, 2, 4, 6, 8. Ignore odd numbers.',
    check: (val) => typeof val === 'number' && val % 2 === 0,
    generateStimulus: () => {
      // 50% even, 50% odd
      if (Math.random() < 0.5) {
        return [0, 2, 4, 6, 8][Math.floor(Math.random() * 5)];
      } else {
        return [1, 3, 5, 7, 9][Math.floor(Math.random() * 5)];
      }
    },
  },
  {
    id: 3,
    title: 'Congruent Stroop',
    text: 'Tap the word matching its color',
    domain: 'Inhibitory Control (Stroop)',
    hint: 'Tap when the word text and the font color match.',
    check: (val) => typeof val === 'object' && val !== null && 'word' in val && val.word === val.color,
    generateStimulus: () => {
      // 45% chance congruent (word === color), 55% incongruent
      if (Math.random() < 0.45) {
        const c = pickRandom(COLORS);
        return { word: c, color: c };
      } else {
        const word = pickRandom(COLORS);
        const otherColors = COLORS.filter(c => c !== word);
        const color = pickRandom(otherColors);
        return { word, color };
      }
    },
  },
  {
    id: 4,
    title: 'Selective Color Attention',
    text: 'Tap ONLY if the font color is RED',
    domain: 'Inhibitory Control (Stroop)',
    hint: 'Ignore what the word reads. Look strictly at font color.',
    check: (val) => typeof val === 'object' && val !== null && 'color' in val && val.color === 'RED',
    generateStimulus: () => {
      // 45% chance font color is RED, 55% other colors
      const isRed = Math.random() < 0.45;
      const color = isRed ? 'RED' : pickRandom(COLORS.filter(c => c !== 'RED'));
      const word = pickRandom(COLORS);
      return { word, color };
    },
  },
  {
    id: 5,
    title: 'Working Memory Comparison',
    text: 'Tap if current is HIGHER than last',
    domain: 'Working Memory',
    hint: 'Remember the previous digit. Tap if current digit is strictly greater.',
    check: (val, last) => typeof val === 'number' && typeof last === 'number' && val > last,
    generateStimulus: (previous) => {
      const prevNum = typeof previous === 'number' ? previous : 4;
      // 50% chance higher, 50% chance lower or equal
      if (Math.random() < 0.5 && prevNum < 9) {
        // Pick higher
        const higherPool = [prevNum + 1, prevNum + 2, 9].filter(n => n <= 9);
        return pickRandom(higherPool);
      } else {
        // Pick lower or equal
        const lowerPool = [0, 1, 2, Math.max(0, prevNum - 1), prevNum].filter(n => n <= prevNum);
        return pickRandom(lowerPool);
      }
    },
  },
  {
    id: 6,
    title: 'Incongruent Stroop',
    text: 'Tap words NOT matching their color',
    domain: 'Inhibitory Control (Stroop)',
    hint: 'Tap when the text and ink color are DIFFERENT.',
    check: (val) => typeof val === 'object' && val !== null && 'word' in val && val.word !== val.color,
    generateStimulus: () => {
      // 50% chance incongruent, 50% chance congruent
      if (Math.random() < 0.5) {
        const word = pickRandom(COLORS);
        const otherColors = COLORS.filter(c => c !== word);
        return { word, color: pickRandom(otherColors) };
      } else {
        const c = pickRandom(COLORS);
        return { word: c, color: c };
      }
    },
  },
  {
    id: 7,
    title: 'Divisibility Rule',
    text: 'Tap numbers DIVISIBLE by 3',
    domain: 'Basic Attention',
    hint: 'Tap for 0, 3, 6, 9. Ignore 1, 2, 4, 5, 7, 8.',
    check: (val) => typeof val === 'number' && val % 3 === 0,
    generateStimulus: () => {
      // 45% divisible by 3 (0, 3, 6, 9), 55% not divisible
      if (Math.random() < 0.45) {
        return pickRandom([0, 3, 6, 9]);
      } else {
        return pickRandom([1, 2, 4, 5, 7, 8]);
      }
    },
  },
  {
    id: 8,
    title: '1-Back Working Memory',
    text: 'Tap if current matches 1 step back',
    domain: '1-Back Updating',
    hint: 'Tap when the displayed number is identical to the one right before it.',
    check: (val, last) => typeof val === 'number' && typeof last === 'number' && val === last,
    generateStimulus: (previous) => {
      // 40% chance match previous if previous is number, 60% different
      if (typeof previous === 'number' && Math.random() < 0.4) {
        return previous;
      }
      const candidates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== previous);
      return pickRandom(candidates);
    },
  },
  {
    id: 9,
    title: 'Cognitive Flexibility',
    text: 'Tap BLUE words OR Even numbers',
    domain: 'Cognitive Flexibility',
    hint: 'Dual rule: Tap if word reads "BLUE" OR if stimulus is an even number.',
    check: (val) => {
      if (typeof val === 'number') {
        return val % 2 === 0;
      }
      if (typeof val === 'object' && val !== null && 'word' in val) {
        return val.word === 'BLUE';
      }
      return false;
    },
    generateStimulus: () => {
      // 50% chance number, 50% chance colored word
      const isNumber = Math.random() < 0.5;
      if (isNumber) {
        // 50% even, 50% odd
        return Math.random() < 0.5 ? pickRandom([0, 2, 4, 6, 8]) : pickRandom([1, 3, 5, 7, 9]);
      } else {
        // 40% chance BLUE word
        const nonBlueColors: Array<'RED' | 'GREEN' | 'YELLOW'> = ['RED', 'GREEN', 'YELLOW'];
        const word: ColoredWord['word'] = Math.random() < 0.4 ? 'BLUE' : pickRandom(nonBlueColors);
        const color = pickRandom(COLORS);
        return { word, color };
      }
    },
  },
  {
    id: 10,
    title: 'Reverse Stroop (Switching)',
    text: 'Reverse Stroop: Tap if word means RED',
    domain: 'Task Switching (Reverse Stroop)',
    hint: 'Ignore the ink color! Tap only if the word literally spells "RED".',
    check: (val) => typeof val === 'object' && val !== null && 'word' in val && val.word === 'RED',
    generateStimulus: () => {
      // 45% chance word is RED (with various ink colors)
      const isWordRed = Math.random() < 0.45;
      const nonRedColors: Array<'BLUE' | 'GREEN' | 'YELLOW'> = ['BLUE', 'GREEN', 'YELLOW'];
      const word: ColoredWord['word'] = isWordRed ? 'RED' : pickRandom(nonRedColors);
      const color = pickRandom(COLORS);
      return { word, color };
    },
  },
];
