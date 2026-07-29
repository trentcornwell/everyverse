export interface VerseComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Sermon {
  title: string;
  description: string;
  url?: string;
}
