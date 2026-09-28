import { useEffect, useRef, useState } from 'react';
import { shuffle, isMatch } from '../lib/quiz';
import { useScore } from '../lib/useScore';
import Scoreboard from './Scoreboard';

// Identification quiz: see the specimen, type its name, study its features.
export default function Quiz({ subject, active }) {
  const { items, title, statsKey, placeholder, rows, featuresHeading } = subject;
  const [deck, setDeck] = useState(() => shuffle(items));
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null); // { correct, picked }
  const [missed, setMissed] = useState([]);
  const score = useScore(statsKey);

  const start = (list) => {
    setDeck(shuffle(list));
    setIndex(0);
    setResult(null);
    setGuess('');
    setMissed([]);
    score.resetSession();
  };

  if (index >= deck.length) {
    return (
      <div className="page">
        <Header title={title} />
        <div className="panel done">
          <h2>Round complete</h2>
          <p className="big-score">{score.session.correct} / {score.session.answered}</p>
          {missed.length > 0 && (
            <>
              <h3>Review these</h3>
              <ul className="missed-list">
                {missed.map((m) => <li key={m.id}>{m.name}</li>)}
              </ul>
            </>
          )}
          <div className="btn-row">
            {missed.length > 0 && (
              <button className="btn btn-primary" onClick={() => start(missed)}>Retry missed ({missed.length})</button>
            )}
            <button className="btn" onClick={() => start(items)}>New round</button>
          </div>
        </div>
      </div>
    );
  }

  const item = deck[index];
  const next = deck[index + 1];

  const answer = (isCorrect, picked) => {
    setResult({ correct: isCorrect, picked });
    score.record(isCorrect);
    if (!isCorrect) setMissed((m) => [...m, item]);
  };

  const advance = () => {
    setIndex(index + 1);
    setResult(null);
    setGuess('');
  };

  return (
    <div className="page">
      <Header title={title} counter={`${index + 1} / ${deck.length}`} />
      <Scoreboard session={score.session} lifetime={score.lifetime} progress={{ done: index, total: deck.length }} />

      <div className="panel quiz-card">
        <SpecimenImage key={item.id} image={item.image} />
        {active && next && <link rel="prefetch" href={next.image.src} as="image" />}

        {!result ? (
          <form
            className="type-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (guess.trim()) answer(isMatch(guess, [item.name, ...item.aliases]), guess);
            }}
          >
            <GuessInput value={guess} onChange={setGuess} placeholder={placeholder} active={active} />
            <div className="btn-row">
              <button type="submit" className="btn btn-primary" disabled={!guess.trim()}>Check</button>
              <button type="button" className="btn" onClick={() => answer(false, '')}>Reveal</button>
            </div>
          </form>
        ) : (
          <>
            <div className={`verdict ${result.correct ? 'ok' : 'bad'}`}>
              {result.correct ? 'Correct!' : result.picked ? `Not quite. You said “${result.picked}”.` : 'Revealed.'}
            </div>
            <div className="answer">
              <h2>{item.name}</h2>
              <dl className="feature-table">
                {rows.filter(([key]) => item[key]).map(([key, label]) => (
                  <div key={key} className="feature-row">
                    <dt>{label}</dt>
                    <dd>{item[key]}</dd>
                  </div>
                ))}
              </dl>
              {item.features && (
                <>
                  <h3>{featuresHeading}</h3>
                  <ul className="key-features">
                    {item.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </>
              )}
              {item.detail && <p className="detail">{item.detail}</p>}
            </div>
            <NextButton onNext={advance} last={index === deck.length - 1} />
          </>
        )}
      </div>
    </div>
  );
}

function Header({ title, counter }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      {counter && <span className="counter">{counter}</span>}
    </header>
  );
}

// Focuses when its tab becomes visible, so typing works right after switching.
function GuessInput({ value, onChange, placeholder, active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (active) ref.current?.focus({ preventScroll: true });
  }, [active]);
  return (
    <input
      ref={ref}
      className="text-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
      autoCapitalize="off"
    />
  );
}

function SpecimenImage({ image }) {
  const [state, setState] = useState('loading');
  return (
    <figure className="specimen">
      <div className={`specimen-frame ${state}`}>
        {state === 'error' ? (
          <p className="img-error">
            Image failed to load. <a href={image.page} target="_blank" rel="noreferrer">Open on Wikimedia Commons</a>
          </p>
        ) : (
          <img
            src={image.src}
            alt="Specimen to identify"
            onLoad={() => setState('loaded')}
            onError={() => setState('error')}
          />
        )}
      </div>
      <figcaption>
        <a href={image.page} target="_blank" rel="noreferrer">{image.credit}</a> · {image.license} · Wikimedia Commons
      </figcaption>
    </figure>
  );
}

function NextButton({ onNext, last }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <button ref={ref} className="btn btn-primary btn-block" onClick={onNext}>
      {last ? 'Finish round' : 'Next →'}
    </button>
  );
}
