import React, { FC, createContext } from "react";
import { GameOptions, useGame } from "../hooks/useGame";

export const GameContext = createContext<GameOptions | null>(
  null,
) as React.Context<GameOptions>;

export const GameProvider: FC<{}> = ({ children }) => {
  const state = useGame();

  return <GameContext.Provider value={state}>{children}</GameContext.Provider>;
};
