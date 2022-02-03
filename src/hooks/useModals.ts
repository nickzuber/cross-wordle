import React, { useCallback, useState } from "react";

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
  const [openModal, setOpenModal] = useState<Modal | null>(null);

  const closeModal = useCallback(() => setOpenModal(null), []);
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
