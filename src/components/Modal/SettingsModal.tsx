import styled from "@emotion/styled";
import { FC, useContext, useEffect, useMemo } from "react";
import createPersistedState from "use-persisted-state";
import { PersistedStates } from "../../constants/state";
import { GameContext } from "../../contexts/game";
import { ToastContext } from "../../contexts/toast";
import { Config } from "../../utils/game";
import { Modal } from "./Modal";

const useDarkTheme = createPersistedState(PersistedStates.DarkTheme);
const useHardMode = createPersistedState(PersistedStates.HardMode);
const useScoreMode = createPersistedState(PersistedStates.ScoreMode);

type CrosswordleObj = {
  hash: string;
};

type LoadedWindowObj = Window &
  typeof globalThis & { crosswordle: CrosswordleObj | undefined };

function getAppHash() {
  const loadedWindow = window as LoadedWindowObj;
  return loadedWindow.crosswordle?.hash || "0000000";
}

export const SettingsModal: FC = () => {
  const [darkTheme, setDarkTheme] = useDarkTheme(false) as [boolean, React.Dispatch<boolean>];
  const [hardMode, setHardMode] = useHardMode(false) as [boolean, React.Dispatch<boolean>];
  const [scoreMode, setScoreMode] = useScoreMode(false) as [boolean, React.Dispatch<boolean>];
  const { unusedLetters } = useContext(GameContext);
  const { sendToast } = useContext(ToastContext);
  const hash = useMemo(() => getAppHash(), []);

  useEffect(() => {
    console.info("() scoreMode", scoreMode);
  }, [scoreMode]);

  return (
    <Modal>
      <Title>Settings</Title>
      <Setting>
        <Label>
          <Name>Dark theme</Name>
          <Description>Toggles the theme to appear dark</Description>
        </Label>
        <ToggleContainer>
          <Toggle onClick={() => setDarkTheme(!darkTheme)} enabled={darkTheme} />
        </ToggleContainer>
      </Setting>
      <Setting>
        <Label>
          <Name>Hard mode</Name>
          <Description>Requires you to place all letters</Description>
        </Label>
        <ToggleContainer>
          <Toggle
            onClick={() => {
              if (hardMode) {
                setHardMode(false);
              } else {
                if (1 || unusedLetters.length === Config.MaxLetters) {
                  setHardMode(true);
                } else {
                  sendToast("You can only turn on hard mode at the start of a game");
                }
              }
            }}
            enabled={hardMode}
          />
        </ToggleContainer>
      </Setting>
      <Setting>
        <Label>
          <Name>Show score</Name>
          <Description>Includes a score for each letter</Description>
        </Label>
        <ToggleContainer>
          <Toggle
            onClick={() => {
              console.info("settings to", !scoreMode);
              setScoreMode(!scoreMode);
            }}
            enabled={scoreMode}
          />
        </ToggleContainer>
      </Setting>
      <TagContainer
        onClick={() => {
          window.open("https://github.com/nickzuber/cross-wordle", "_blank");
        }}
      >
        <Tag>© {new Date().getFullYear()} — Nick Zuber</Tag>
        <Tag>Build {`#${hash}`}</Tag>
      </TagContainer>
    </Modal>
  );
};

const Title = styled.h1`
  margin: 0 0 24px;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.025rem;
  text-transform: uppercase;
  text-align: center;
`;

const Setting = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto 24px;
`;

const ToggleContainer = styled.div`
  font-weight: 500;
  font-size: 1rem;
  text-align: left;
  height: 100%;
  flex: 1;
`;

const Label = styled.div`
  font-weight: 500;
  font-size: 1rem;
  text-align: left;
  height: 100%;
  flex: 3;
`;

const Name = styled.p`
  margin: 0 0 4px;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: left;
  height: 100%;
  flex: 2;
`;

const Description = styled.p`
  margin: 0;
  font-weight: 400;
  font-size: 0.9rem;
  text-align: left;
  opacity: 0.75;
  height: 100%;
`;

const Toggle = styled.div<{ enabled: boolean }>`
  position: relative;
  height: 24px;
  width: 44px;
  border-radius: 40px;
  margin-left: auto;
  margin-right: 0;
  cursor: pointer;
  background: ${(p) => (p.enabled ? "#6aaa64" : "#787c7e")};
  transition: all 150ms ease;

  &:after {
    content: "";
    border-radius: 100%;
    background: #ffffff;
    height: 18px;
    width: 18px;
    position: absolute;
    top: 3px;
    left: 3px;
    transition: all 150ms ease;

    transform: translateX(${(p) => (p.enabled ? "20px" : "0px")});
  }
`;

const TagContainer = styled.div`
  margin: 48px auto 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 100ms ease-in;

  &:hover {
    opacity: 1;
  }
`;

const Tag = styled.span`
  font-weight: 500;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
