import React, { FC, createContext } from "react";
import { ModalsOptions, useModals } from "../hooks/useModals";

export const ModalsContext = createContext<ModalsOptions | null>(
  null,
) as React.Context<ModalsOptions>;

export const ModalsProvider: FC<{}> = ({ children }) => {
  const state = useModals();

  return <ModalsContext.Provider value={state}>{children}</ModalsContext.Provider>;
};
