import { useState } from 'react';
import { loadStats, saveStats } from './quiz';

// Session score + streak, and lifetime stats persisted per mode.
export function useScore(mode) {
  const [session, setSession] = useState({ answered: 0, correct: 0, streak: 0 });
  const [lifetime, setLifetime] = useState(() => loadStats(mode));

  const record = (isCorrect) => {
    const streak = isCorrect ? session.streak + 1 : 0;
    setSession({
      answered: session.answered + 1,
      correct: session.correct + (isCorrect ? 1 : 0),
      streak,
    });
    const next = {
      answered: lifetime.answered + 1,
      correct: lifetime.correct + (isCorrect ? 1 : 0),
      bestStreak: Math.max(lifetime.bestStreak, streak),
    };
    setLifetime(next);
    saveStats(mode, next);
  };

  const resetSession = () => setSession({ answered: 0, correct: 0, streak: 0 });

  const resetLifetime = () => {
    const empty = { answered: 0, correct: 0, bestStreak: 0 };
    setLifetime(empty);
    saveStats(mode, empty);
  };

  return { session, lifetime, record, resetSession, resetLifetime };
}
