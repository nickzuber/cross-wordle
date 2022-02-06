export type AppTheme = {
  colors: {
    primary: string;
    text: string;
    tileSecondary: string;
    highlight: string;
    buttonActive: string;
  };
  accents: {
    dropShadow: string;
  };
};

const LightTheme: AppTheme = {
  colors: {
    primary: "#ffffff",
    text: "#1a1a1b",
    tileSecondary: "#d3d6da",
    highlight: "#f0f0f0",
    buttonActive: "#c0c4ca",
  },
  accents: {
    dropShadow: "rgb(99 99 99 / 46%) 0px 2px 8px 2px",
  },
};

const DarkTheme: AppTheme = {
  colors: {
    primary: "#10293c",
    text: "#ffffff",
    tileSecondary: "#4d5a62",
    highlight: "#133652",
    buttonActive: "#656b6e",
  },
  accents: {
    dropShadow: "rgb(0 0 0 / 24%) 0px 2px 8px 2px",
  },
};

export const Themes = {
  Light: LightTheme,
  Dark: DarkTheme,
};
