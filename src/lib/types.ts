export interface Team {
  name: string;
  flag: string;
  code: string;
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface Match {
  id: string;
  group: string;
  home: Team;
  away: Team;
  matchday: number;
}

export interface Score {
  home: number;
  away: number;
}

export interface Participant {
  name: string;
  addedAt: string;
}

export type Results = Record<string, Score>;
export type Predictions = Record<string, Score>;

export interface LeaderboardEntry {
  name: string;
  points: number;
  exact: number;
  correct: number;
  wrong: number;
  total: number;
}
