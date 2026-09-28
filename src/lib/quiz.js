export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\b(a|an|the)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a, b) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

// Typo-tolerant match against a list of accepted answers (plural "s" ignored).
export function isMatch(guess, accepted) {
  const g = normalize(guess).replace(/s\b/g, '');
  if (!g) return false;
  return accepted.some((ans) => {
    const a = normalize(ans).replace(/s\b/g, '');
    if (g === a) return true;
    const tolerance = a.length >= 9 ? 2 : a.length >= 5 ? 1 : 0;
    return levenshtein(g, a) <= tolerance;
  });
}

// Lifetime stats per mode, kept in this browser only.
const KEY = 'event-identifier:stats';

export function loadStats(mode) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY)) || {};
    return { answered: 0, correct: 0, bestStreak: 0, ...all[mode] };
  } catch {
    return { answered: 0, correct: 0, bestStreak: 0 };
  }
}

export function saveStats(mode, stats) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY)) || {};
    all[mode] = stats;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // storage unavailable (private mode) – stats just won't persist
  }
}
