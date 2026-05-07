import { useGame } from '../context/GameContext';
import { useSettings } from '../context/SettingsContext';

export function ShareButton() {
  const { guesses, status } = useGame();
  const { settings } = useSettings();

  const handleShare = async () => {
    const date = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    const maxGuesses = settings.wordLength === 4 ? 5 : settings.wordLength === 5 ? 6 : 7;
    const result = status === 'won' ? `⭐ ${guesses.length}/${maxGuesses}` : `❌ X/${maxGuesses}`;

    const grid = guesses.map(g =>
      g.feedback.positions.map(p =>
        p.result === 'exact' ? '🟩' : p.result === 'present' ? '🟨' : '⬛'
      ).join('')
    ).join('\n');

    const text = `LexiPeg ${date} ${result}\n\n${grid}`;

    try {
      await navigator.clipboard.writeText(text);
      window.dispatchEvent(new CustomEvent('lexipeg:toast', { detail: 'Copied to clipboard!' }));
    } catch {
      // fallback: show the text in alert
      window.alert(text);
    }
  };

  return (
    <button className="share-btn" onClick={handleShare}>
      Share
    </button>
  );
}
