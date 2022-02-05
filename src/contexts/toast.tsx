import React, { FC, createContext } from "react";
import { ToastOptions, useToast } from "../hooks/useToast";

export const ToastContext = createContext<ToastOptions | null>(
  null,
) as React.Context<ToastOptions>;

export const ToastProvider: FC<{}> = ({ children }) => {
  const state = useToast();

  return <ToastContext.Provider value={state}>{children}</ToastContext.Provider>;
};
