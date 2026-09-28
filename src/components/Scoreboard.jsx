const pct = (c, n) => (n ? Math.round((c / n) * 100) : 0);

export default function Scoreboard({ session, lifetime, progress }) {
  return (
    <div className="scoreboard" aria-live="polite">
      <div className="stat">
        <span className="stat-value">{session.correct}/{session.answered}</span>
        <span className="stat-label">Score</span>
      </div>
      <div className="stat">
        <span className="stat-value">{pct(session.correct, session.answered)}%</span>
        <span className="stat-label">Accuracy</span>
      </div>
      <div className="stat">
        <span className="stat-value">{session.streak}</span>
        <span className="stat-label">Streak</span>
      </div>
      <div className="stat">
        <span className="stat-value">{lifetime.bestStreak}</span>
        <span className="stat-label">Best</span>
      </div>
      {progress && (
        <div className="progress" role="progressbar" aria-valuenow={progress.done} aria-valuemax={progress.total}>
          <div className="progress-fill" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
        </div>
      )}
    </div>
  );
}
