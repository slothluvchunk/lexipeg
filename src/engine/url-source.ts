import { WordSource, WordSourceResult } from '../words/types';

const WORKER_URL =
  (import.meta.env.VITE_WORKER_URL as string | undefined) ??
  'https://lexipeg-worker.your-account.workers.dev';

interface WorkerResponse {
  word: string;
  sourceTitle: string;
  sourceUrl: string;
  candidates: string[];
  method: 'llm' | 'frequency';
}

interface WorkerError {
  error: string;
  details?: string;
}

// In-memory cache: avoids re-fetching while the page is open
const cache = new Map<string, WorkerResponse>();

async function fetchFromWorker(
  url: string,
  wordLength: number,
  dictionary: Set<string>,
): Promise<WorkerResponse> {
  const key = `${url}::${wordLength}`;
  if (cache.has(key)) return cache.get(key)!;

  const response = await fetch(`${WORKER_URL}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      wordLength,
      dictionary: [...dictionary],
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({ error: 'Unknown error' }))) as WorkerError;
    throw new Error(err.error ?? `Worker returned ${response.status}`);
  }

  const data = (await response.json()) as WorkerResponse;
  cache.set(key, data);
  return data;
}

// Exported for the settings modal preview
export async function previewUrlWords(
  url: string,
  wordLength: number,
  dictionary: Set<string>,
): Promise<string[]> {
  const data = await fetchFromWorker(url, wordLength, dictionary);
  return data.candidates;
}

export function clearUrlCache(): void {
  cache.clear();
}

export class UrlSource implements WordSource {
  constructor(private url: string) {}

  async extract(options: { wordLength: number; dictionary: Set<string> }): Promise<WordSourceResult> {
    const data = await fetchFromWorker(this.url, options.wordLength, options.dictionary);
    return {
      word: data.word,
      sourceTitle: data.sourceTitle,
      sourceUrl: data.sourceUrl,
    };
  }
}
