import { useEffect, useState } from 'react';
import { botanyPlants } from './data/plants';
import { rocksMinerals } from './data/rocks';
import Quiz from './components/Quiz';

const SUBJECTS = [
  {
    id: 'botany',
    label: 'Botany',
    title: 'Botany – Identification Practice',
    items: botanyPlants,
    statsKey: 'identify',
    placeholder: 'What plant, organ, or structure is this?',
    rows: [
      ['group', 'Plant group'],
      ['monocotDicot', 'Monocot / dicot'],
      ['venation', 'Leaf venation'],
      ['roots', 'Root system'],
      ['floral', 'Floral pattern'],
    ],
    featuresHeading: 'Key identifying features',
  },
  {
    id: 'rocks',
    label: 'Rocks & Minerals',
    title: 'Rocks & Minerals – Identification Practice',
    items: rocksMinerals,
    statsKey: 'rocks',
    placeholder: 'What rock or mineral is this?',
    rows: [
      ['classification', 'Classification'],
      ['composition', 'Composition'],
      ['color', 'Color'],
      ['luster', 'Luster'],
      ['hardness', 'Hardness (Mohs)'],
      ['streak', 'Streak'],
      ['form', 'Crystal form / cleavage'],
      ['texture', 'Texture'],
    ],
    featuresHeading: 'Key identifying property',
  },
];

const fromHash = () => (SUBJECTS.some((s) => `#${s.id}` === window.location.hash) ? window.location.hash.slice(1) : 'botany');

export default function App() {
  const [active, setActive] = useState(fromHash);

  useEffect(() => {
    const onHash = () => setActive(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const current = SUBJECTS.find((s) => s.id === active);
  useEffect(() => {
    document.title = current.title;
  }, [current]);

  return (
    <>
      <nav className="tabs" aria-label="Subject">
        {SUBJECTS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={`tab ${s.id === active ? 'on' : ''}`} aria-current={s.id === active ? 'page' : undefined}>
            {s.label}
          </a>
        ))}
      </nav>
      {/* Both quizzes stay mounted so switching tabs keeps each one's progress. */}
      {SUBJECTS.map((s) => (
        <div key={s.id} hidden={s.id !== active}>
          <Quiz subject={s} active={s.id === active} />
        </div>
      ))}
    </>
  );
}
