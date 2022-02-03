import { seed } from "../utils/words-helper";

const Prefix = "_cross-wordle-game__";

export const PersistedStates = {
  FirstTime: `${Prefix}first-time`,
  GameOver: `${Prefix}${seed}_game-over`,
  Board: `${Prefix}${seed}_todays-board`,
  Letters: `${Prefix}${seed}_todays-letters`,
};
