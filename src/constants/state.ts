import { seed } from "../utils/words-helper";

export const PersistedStorage = {
  Stamp: "_cross-wordle-game__",
  SeedDivider: "_.-sEeD-dIvIdEr-._",
};

export const PersistedStates = {
  FirstTime: PersistedStorage.Stamp + "first-time",
  GameOver: seed + PersistedStorage.SeedDivider + PersistedStorage.Stamp + "game-over",
  Board: seed + PersistedStorage.SeedDivider + PersistedStorage.Stamp + "todays-board",
  Letters: seed + PersistedStorage.SeedDivider + PersistedStorage.Stamp + "todays-letters",
  Stats: PersistedStorage.Stamp + "stats",
  DarkTheme: PersistedStorage.Stamp + "dark-theme",
  HardMode: PersistedStorage.Stamp + "hard-mode",
  ScoreMode: PersistedStorage.Stamp + "score-mode",
};
