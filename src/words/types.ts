export interface WordSourceResult {
  word: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface WordSource {
  extract(options: {
    wordLength: number;
    dictionary: Set<string>;
  }): Promise<WordSourceResult>;
}
