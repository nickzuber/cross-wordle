import { seed } from "../utils/words-helper";

const Prefix = "_cross-wordle-game__";

export const PersistedStates = {
  FirstTime: `${Prefix}first-time`,
  GameOver: `${Prefix}${seed}game-over`,
  Board: `${Prefix}${seed}todays-board`,
  Letters: `${Prefix}${seed}todays-letters`,
  Stats: `${Prefix}stats`,
};
