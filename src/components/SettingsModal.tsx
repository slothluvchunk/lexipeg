import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { ColorMode } from '../storage/settings-store';
import { previewUrlWords } from '../engine/url-source';
import '../styles/components/modal.css';
import './SettingsModal.css';

interface SettingsModalProps {
  onClose: () => void;
}

const COLOR_MODES: Array<{ value: ColorMode; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'deuteranopia', label: 'Deuteranopia' },
  { value: 'protanopia', label: 'Protanopia' },
  { value: 'high-contrast', label: 'High Contrast' },
];

type LoadStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, setHardMode, setColorMode, setSourceUrl } = useSettings();
  const [urlInput, setUrlInput] = useState(settings.sourceUrl);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('idle');
  const [wordCount, setWordCount] = useState(0);

  const handleLoad = async () => {
    const url = urlInput.trim();
    if (!url) return;
    setLoadStatus('loading');
    try {
      const words = await previewUrlWords(url, settings.wordLength);
      setSourceUrl(url);
      setWordCount(words.length);
      setLoadStatus(words.length > 0 ? 'success' : 'empty');
    } catch {
      setLoadStatus('error');
    }
  };

  const handleClear = () => {
    setUrlInput('');
    setSourceUrl('');
    setLoadStatus('idle');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>
        <h2 className="modal__title">Settings</h2>

        <div className="settings-row">
          <span className="settings-row__label">Hard Mode</span>
          <button
            className={`settings-toggle ${settings.hardMode ? 'settings-toggle--on' : ''}`}
            onClick={() => setHardMode(!settings.hardMode)}
            aria-pressed={settings.hardMode}
          >
            {settings.hardMode ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="settings-section">
          <span className="settings-section__label">Color Mode</span>
          <div className="settings-color-options">
            {COLOR_MODES.map(cm => (
              <button
                key={cm.value}
                className={`settings-color-btn ${settings.colorMode === cm.value ? 'settings-color-btn--active' : ''}`}
                onClick={() => setColorMode(cm.value)}
              >
                {cm.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <span className="settings-section__label">Word Source URL</span>
          <div className="settings-url-row">
            <input
              type="url"
              className="settings-url-input"
              placeholder="https://example.com/article"
              value={urlInput}
              onChange={e => { setUrlInput(e.target.value); setLoadStatus('idle'); }}
              onKeyDown={e => e.key === 'Enter' && handleLoad()}
            />
            {urlInput && (
              <button className="settings-url-clear" onClick={handleClear} title="Clear">✕</button>
            )}
          </div>
          <button
            className="settings-url-load"
            onClick={handleLoad}
            disabled={!urlInput.trim() || loadStatus === 'loading'}
          >
            {loadStatus === 'loading' ? 'Loading...' : 'Load Source'}
          </button>
          {loadStatus === 'success' && (
            <span className="settings-url-status settings-url-status--success">
              {wordCount} {settings.wordLength}-letter words found
            </span>
          )}
          {loadStatus === 'empty' && (
            <span className="settings-url-status settings-url-status--error">
              No {settings.wordLength}-letter words found — try a different URL or word length
            </span>
          )}
          {loadStatus === 'error' && (
            <span className="settings-url-status settings-url-status--error">
              Could not load URL — check the address and try again
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
