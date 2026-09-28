import { useEffect, useRef, useState } from 'react';
import { botanyPlants } from './data/plants';
import { shuffle, isMatch } from './lib/quiz';
import { useScore } from './lib/useScore';
import Scoreboard from './components/Scoreboard';

const FEATURE_ROWS = [
  ['group', 'Plant group'],
  ['monocotDicot', 'Monocot / dicot'],
  ['venation', 'Leaf venation'],
  ['roots', 'Root system'],
  ['floral', 'Floral pattern'],
];

// Botany identification: see the specimen, type its name, study its features.
export default function App() {
  const [deck, setDeck] = useState(() => shuffle(botanyPlants));
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState(null); // { correct, picked }
  const [missed, setMissed] = useState([]);
  const score = useScore('identify');

  const start = (items) => {
    setDeck(shuffle(items));
    setIndex(0);
    setResult(null);
    setGuess('');
    setMissed([]);
    score.resetSession();
  };

  if (index >= deck.length) {
    return (
      <div className="page">
        <Header />
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
            <button className="btn" onClick={() => start(botanyPlants)}>New round</button>
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
      <Header counter={`${index + 1} / ${deck.length}`} />
      <Scoreboard session={score.session} lifetime={score.lifetime} progress={{ done: index, total: deck.length }} />

      <div className="panel quiz-card">
        <SpecimenImage key={item.id} image={item.image} />
        {next && <link rel="prefetch" href={next.image.src} as="image" />}

        {!result ? (
          <form
            className="type-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (guess.trim()) answer(isMatch(guess, [item.name, ...item.aliases]), guess);
            }}
          >
            <input
              className="text-input"
              placeholder="What plant, organ, or structure is this?"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
            />
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
                {FEATURE_ROWS.map(([key, label]) => (
                  <div key={key} className="feature-row">
                    <dt>{label}</dt>
                    <dd>{item[key]}</dd>
                  </div>
                ))}
              </dl>
              <h3>Key identifying features</h3>
              <ul className="key-features">
                {item.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
            <NextButton onNext={advance} last={index === deck.length - 1} />
          </>
        )}
      </div>
    </div>
  );
}

function Header({ counter }) {
  return (
    <header className="header">
      <h1>Botany Identifier</h1>
      {counter && <span className="counter">{counter}</span>}
    </header>
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
