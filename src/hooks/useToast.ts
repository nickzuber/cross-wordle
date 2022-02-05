import { useCallback, useEffect, useState } from "react";

export type ToastOptions = {
  sendToast: (message: string) => void;
  clearToast: () => void;
};

type Toast = {
  message: string;
};

const toastId = "__toast__";
const toastClassName = "__toast-styles__";
const timing = 4000;

function createToast(toast: Toast) {
  removeToast();

  const ele = document.createElement("div");
  ele.setAttribute("id", toastId);
  ele.setAttribute("class", toastClassName);
  ele.innerText = toast.message;
  document.body.appendChild(ele);
}

function removeToast() {
  const eles = document.querySelectorAll(`#${toastId}`);
  eles.forEach((node) => node.remove());
}

export const useToast = (): ToastOptions => {
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

  useEffect(() => {
    let ts: ReturnType<typeof setTimeout>;
    if (toast) {
      createToast(toast);
      ts = setTimeout(() => removeToast(), timing);
    } else {
      removeToast();
    }

    return () => {
      clearTimeout(ts);
      removeToast();
    };
  }, [toast]);

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
