import { useCallback, useEffect } from "react";
import { PersistedStorage } from "../constants/state";
import { seed as todaySeed } from "../utils/words-helper";

function getKeys() {
  return Object.keys(localStorage);
}

function deleteKey(key: string) {
  return localStorage.removeItem(key);
}

export const useLocalStorageGC = () => {
  const clean = useCallback(() => {
    const oldSeededKeys = getKeys()
      .filter(
        (key) =>
          key.indexOf(PersistedStorage.Stamp) > -1 &&
          key.indexOf(PersistedStorage.SeedDivider) > -1,
      )
      .filter((key) => {
        const [seed] = key.split(PersistedStorage.SeedDivider);
        return seed !== todaySeed;
      });

    for (const oldKey of oldSeededKeys) {
      deleteKey(oldKey);
    }
  }, []);

  useEffect(() => clean(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
