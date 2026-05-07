import { WordSource, WordSourceResult } from '../words/types';
import { STOP_WORDS } from './stop-words';

const PROXY = 'https://api.allorigins.win/get?url=';

// Noise elements to strip before extracting text
const NOISE_SELECTORS = [
  'script', 'style', 'noscript', 'nav', 'header', 'footer', 'aside',
  'form', 'button', 'iframe', 'figure', 'figcaption',
  '[role="navigation"]', '[role="banner"]', '[role="complementary"]',
  '[role="form"]', '.nav', '.menu', '.sidebar', '.advertisement',
  '.cookie', '.popup', '.social', '.share', '.related',
];

// Content candidates in preference order
const CONTENT_SELECTORS = [
  'article', '[role="main"]', 'main', '.post-content',
  '.entry-content', '.article-body', '.article-content',
  '.story-body', '.content', '#content', '#main',
];

function extractText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  for (const sel of NOISE_SELECTORS) {
    doc.querySelectorAll(sel).forEach(el => el.remove());
  }

  const contentEl =
    CONTENT_SELECTORS.reduce<Element | null>(
      (found, sel) => found ?? doc.querySelector(sel),
      null,
    ) ?? doc.body;

  return contentEl?.textContent ?? '';
}

function tokenize(text: string, wordLength: number): string[] {
  const seen = new Set<string>();
  const words: string[] = [];

  for (const raw of text.toLowerCase().split(/[^a-z'-]+/)) {
    // Split on internal hyphens/apostrophes, giving sub-tokens
    for (const token of raw.split(/[-']+/)) {
      if (
        token.length === wordLength &&
        /^[a-z]+$/.test(token) &&
        !STOP_WORDS.has(token) &&
        !seen.has(token)
      ) {
        seen.add(token);
        words.push(token);
      }
    }
  }

  return words;
}

// In-memory cache: avoids re-fetching while the page is open
const cache = new Map<string, string[]>();

async function fetchWords(url: string, wordLength: number): Promise<string[]> {
  const key = `${url}::${wordLength}`;
  if (cache.has(key)) return cache.get(key)!;

  const res = await fetch(`${PROXY}${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`Proxy error: ${res.status}`);

  const data = await res.json() as { contents: string | null };
  if (!data.contents) throw new Error('Empty response from proxy');

  const words = tokenize(extractText(data.contents), wordLength);
  cache.set(key, words);
  return words;
}

// Exported for the settings modal preview
export async function previewUrlWords(url: string, wordLength: number): Promise<string[]> {
  return fetchWords(url, wordLength);
}

export function clearUrlCache(): void {
  cache.clear();
}

export class UrlSource implements WordSource {
  constructor(private url: string) {}

  async extract(options: { wordLength: number; dictionary: Set<string> }): Promise<WordSourceResult> {
    const words = await fetchWords(this.url, options.wordLength);
    if (words.length === 0) throw new Error('No suitable words found at this URL');
    return { word: words[Math.floor(Math.random() * words.length)] };
  }
}
