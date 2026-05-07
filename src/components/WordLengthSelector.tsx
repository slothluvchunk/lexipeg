import { useSettings } from '../context/SettingsContext';
import './WordLengthSelector.css';

const LENGTHS: Array<4 | 5 | 6 | 7> = [4, 5, 6, 7];

export function WordLengthSelector() {
  const { settings, setWordLength } = useSettings();

  return (
    <div className="word-length-selector">
      {LENGTHS.map(len => (
        <button
          key={len}
          className={`word-length-selector__btn ${settings.wordLength === len ? 'word-length-selector__btn--active' : ''}`}
          onClick={() => setWordLength(len)}
        >
          {len}
        </button>
      ))}
    </div>
  );
}
