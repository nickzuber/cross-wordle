import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { AppTheme, ThemeType } from "../constants/themes";

export type ToastOptions = {
  sendToast: (message: string) => void;
  clearToast: () => void;
};

type Toast = {
  message: string;
};

const toastId = "__toast__";
const timing = 4000;

const getToastClassName = (type: ThemeType) => {
  switch (type) {
    case ThemeType.Dark:
      return "__toast-dark-styles__";
    case ThemeType.Light:
      return "__toast-light-styles__";
    default:
      return "__toast-light-styles__";
  }
};

function createToast(toast: Toast, type: ThemeType) {
  removeToast();

  const ele = document.createElement("div");
  ele.setAttribute("id", toastId);
  ele.setAttribute("class", getToastClassName(type));
  ele.innerText = toast.message;
  document.body.appendChild(ele);
}

function removeToast() {
  const eles = document.querySelectorAll(`#${toastId}`);
  eles.forEach((node) => node.remove());
}

export const useToast = (): ToastOptions => {
  const theme = useTheme() as AppTheme;
  const [toast, setToast] = useState<Toast | null>();

  useEffect(() => {
    function onToastTap(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.id === toastId) {
        removeToast();
      }
    }
    document.addEventListener("click", onToastTap);
    return () => document.removeEventListener("click", onToastTap);
  }, []);

  // Flushes out the current toast whenever the theme changes.
  // This prevents the toast from resetting each time you change the theme.
  useEffect(() => {
    clearToast();
  }, [theme.type]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let ts: ReturnType<typeof setTimeout>;
    if (toast) {
      createToast(toast, theme.type);
      ts = setTimeout(() => removeToast(), timing);
    } else {
      removeToast();
    }

    return () => {
      clearTimeout(ts);
      removeToast();
    };
  }, [toast, theme.type]);

  const sendToast = useCallback((message: string) => {
    setToast({
      message,
    });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    sendToast,
    clearToast,
  };
};
