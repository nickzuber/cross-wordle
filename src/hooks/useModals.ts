import { useCallback, useState } from "react";
import createPersistedState from "use-persisted-state";
import { PersistedStates } from "../constants/state";

const useFirstTime = createPersistedState(PersistedStates.FirstTime);

export type ModalsOptions = {
  openInstructions: () => void;
  openStats: () => void;
  openSettings: () => void;
  isInstructionsOpen: boolean;
  isStatsOpen: boolean;
  isSettingsOpen: boolean;
  isAnyModalOpen: boolean;
  closeModal: () => void;
};

enum Modal {
  Instructions,
  Stats,
  Settings,
}

export const useModals = (): ModalsOptions => {
  const [, setIsFirstTime] = useFirstTime(true);
  const [openModal, setOpenModal] = useState<Modal | null>(null);

  const closeModal = useCallback(() => {
    setIsFirstTime(false);
    setOpenModal(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const openInstructions = useCallback(() => setOpenModal(Modal.Instructions), []);
  const openStats = useCallback(() => setOpenModal(Modal.Stats), []);
  const openSettings = useCallback(() => setOpenModal(Modal.Settings), []);

  return {
    openInstructions,
    openStats,
    openSettings,
    isInstructionsOpen: openModal === Modal.Instructions,
    isStatsOpen: openModal === Modal.Stats,
    isSettingsOpen: openModal === Modal.Settings,
    isAnyModalOpen: openModal !== null,
    closeModal,
  };
};
