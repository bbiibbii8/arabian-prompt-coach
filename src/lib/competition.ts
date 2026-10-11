// Browser-safe competition rules. No backend imports here so tests and SSR
// can use them without touching the database client.

export type Submission = { name: string; score: number };

/** A row may be published to the board only with a name and a real improvement. */
export function canPublishToBoard(s: Submission) {
  return s.name.trim().length > 0 && s.score > 0;
}
