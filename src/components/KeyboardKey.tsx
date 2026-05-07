import { LetterStatus } from '../engine/keyboard-state';
import '../styles/components/keyboard.css';

interface KeyboardKeyProps {
  label: string;
  status?: LetterStatus;
  wide?: boolean;
  onPress: () => void;
}

export function KeyboardKey({ label, status = 'unused', wide, onPress }: KeyboardKeyProps) {
  const classes = [
    'keyboard-key',
    wide ? 'keyboard-key--wide' : '',
    status !== 'unused' ? `keyboard-key--${status}` : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} onPointerDown={onPress} aria-label={label}>
      {label}
    </button>
  );
}
