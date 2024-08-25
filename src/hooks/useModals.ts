import { useCallback, useState } from "react";
import createPersistedState from "use-persisted-state";
import { PersistedStates } from "../constants/state";

const useFirstTime = createPersistedState<boolean>(PersistedStates.FirstTime);
const useScrambledAnnouncement = createPersistedState<boolean>(
  PersistedStates.ScrambledAnnouncement,
);

export type ModalsOptions = {
  openScrambledAnnouncement: () => void;
  openInstructions: () => void;
  openStats: () => void;
  openSettings: () => void;
  isScrambledAnnouncementOpen: boolean;
  isInstructionsOpen: boolean;
  isStatsOpen: boolean;
  isSettingsOpen: boolean;
  isAnyModalOpen: boolean;
  closeModal: () => void;
};

enum Modal {
  ScrambledAnnouncement,
  Instructions,
  Stats,
  Settings,
}

export const useModals = (): ModalsOptions => {
  const [, setIsFirstTime] = useFirstTime(true);
  const [, setScrambledAnnouncement] = useScrambledAnnouncement(true);
  const [openModal, setOpenModal] = useState<Modal | null>(null);

  const closeModal = useCallback(() => {
    setIsFirstTime(false);
    // setScrambledAnnouncement(false);
    setOpenModal(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const openScrambledAnnouncement = useCallback(
    () => setOpenModal(Modal.ScrambledAnnouncement),
    [],
  );
  const openInstructions = useCallback(() => setOpenModal(Modal.Instructions), []);
  const openStats = useCallback(() => setOpenModal(Modal.Stats), []);
  const openSettings = useCallback(() => setOpenModal(Modal.Settings), []);

  return {
    openScrambledAnnouncement,
    openInstructions,
    openStats,
    openSettings,
    isScrambledAnnouncementOpen: openModal === Modal.ScrambledAnnouncement,
    isInstructionsOpen: openModal === Modal.Instructions,
    isStatsOpen: openModal === Modal.Stats,
    isSettingsOpen: openModal === Modal.Settings,
    isAnyModalOpen: openModal !== null,
    closeModal,
  };
};
