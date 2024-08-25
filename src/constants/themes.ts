export enum ThemeType {
  Light = "light",
  Dark = "dark",
}

export type AppTheme = {
  type: ThemeType;
  colors: {
    primary: string;
    text: string;
    tileSecondary: string;
    highlight: string;
    buttonActive: string;
    highlightBorder: string;
    linkText: string;
  };
  accents: {
    dropShadow: string;
    transparentBackground: string;
  };
};

const LightTheme: AppTheme = {
  type: ThemeType.Light,
  colors: {
    primary: "#ffffff",
    text: "#1a1a1b",
    tileSecondary: "#d3d6da",
    highlight: "#f0f0f0",
    highlightBorder: "#2e2f2f",
    buttonActive: "#c0c4ca",
    linkText: "#228be6",
  },
  accents: {
    dropShadow: "rgb(99 99 99 / 46%) 0px 2px 8px 2px",
    transparentBackground: "rgba(100, 100, 100, 0.5)",
  },
};

const DarkTheme: AppTheme = {
  type: ThemeType.Dark,
  colors: {
    primary: "#0E1924",
    text: "#ffffff",
    tileSecondary: "#4d5a62",
    highlight: "#133652",
    highlightBorder: "#c4c5c5",
    buttonActive: "#656b6e",
    linkText: "#4dabf7",
  },
  accents: {
    dropShadow: "rgb(0 0 0 / 50%) 0px 2px 8px 2px",
    transparentBackground: "rgba(14, 25, 36, 0.5)",
  },
};

export const Themes = {
  Light: LightTheme,
  Dark: DarkTheme,
};
