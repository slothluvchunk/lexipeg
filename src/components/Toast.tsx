import { useGame } from '../context/GameContext';
import '../styles/components/toast.css';

export function Toast() {
  const { toasts, dismissToast } = useGame();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast" onClick={() => dismissToast(t.id)}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
