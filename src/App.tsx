import { ThemeProvider } from "@emotion/react";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useMemo } from "react";
import createPersistedState from "use-persisted-state";
import "./App.css";
import { Scene } from "./Scene";
import { PersistedStates } from "./constants/state";
import { Themes } from "./constants/themes";
import { GameProvider } from "./contexts/game";
import { ModalsProvider } from "./contexts/modals";
import { ToastProvider } from "./contexts/toast";

const useDarkTheme = createPersistedState(PersistedStates.DarkTheme);

function App() {
  const [darkTheme] = useDarkTheme() as [boolean, unknown];

  const theme = useMemo(() => (darkTheme ? Themes.Dark : Themes.Light), [darkTheme]);

  useEffect(() => {
    document.body.style.background = theme.colors.primary;
    document.body.style.color = theme.colors.text;
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <Analytics />
      <ModalsProvider>
        <ToastProvider>
          <GameProvider>
            <Scene />
          </GameProvider>
        </ToastProvider>
      </ModalsProvider>
    </ThemeProvider>
  );
}

export default App;
