import { keyframes } from "@emotion/react";

export const createAnimatedCursorTile = (background: string, borderColor: string) => keyframes`
  0% {
    border-color: #228be6;
    background: #228be622;
  }

  99% {
    border-color: #228be6;
    background: #228be622;
  }
  100% {
    background: ${background};
    border-color: ${borderColor};
  }
`;

export const createAnimatedTile = (
  background: string,
  highlight: string,
  textColor: string,
  borderColor: string,
) => keyframes`
  0% {
    transform: scale(0.8);
    color: ${textColor};
    background: ${background};
    border-color: #787c7e;
  }
  15% {
    transform: scale(1.1);
  }
  30% {
    transform: scale(1);
  }

  46% {
    background: ${background};
    border-color: #787c7e;
  }
  50% {
    background: ${highlight};
    border-color: #787c7e;
  }


  96% {
    background: ${highlight};
    border-color: #787c7e;
  }
  100% {
    background: ${background};
    border-color: #787c7e;
    color: ${textColor};
  }
`;

export const SlideIn = keyframes`
  from {
    transform: translateY(40px);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const FadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const PopIn = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }

  40% {
    transform: scale(1.1);
    opacity: 1;
  }
`;

export const Shine = keyframes`
  20% {
    opacity: 1;
    top: -30%;
    left: -30%;
    transition-property: left, top, opacity;
    transition-duration: 0.7s, 0.7s, 0.15s;
    transition-timing-function: ease;
  }
  100% {
    opacity: 0;
    top: -30%;
    left: -30%;
    transition-property: left, top, opacity;
  }
`;

export const createSuccessReveal = (
  color: string,
  borderColor: string,
  background: string,
  score?: number | undefined,
) => {
  let finalBackground = "#6aaa64";
  let finalBorder = "#6aaa64";

  if (score && score >= 3) {
    finalBackground = `
      radial-gradient(ellipse farthest-corner at right bottom, #c6a818 0%, #ce9b34 8%, #daae53 30%, #ddaf47 40%, #fcc52a 80%, #dbab4b 100%),
      radial-gradient(ellipse farthest-corner at left top, #c9aa2f 0%, #e2c427 8%, #e3b32c 25%, #9a7a30 62.5%, #c19738 100%)
    `;
    finalBorder = "#d3ad4b";
  }

  return keyframes`
  0% {
    transform: rotateX(0);
  }
  49% {
    color: ${color};
    border-color: ${borderColor};
    background: ${background};
  }
  50% {
    color: #ffffff;
    border-color: ${finalBorder};
    background: ${finalBackground};
    transform: rotateX(-90deg);
  }
  100% {
    color: #ffffff;
    border-color: ${finalBorder};
    background: ${finalBackground};
    transform: rotateX(0);
  }
`;
};

export const createMixedReveal = (
  color: string,
  background: string,
  borderColor: string,
) => keyframes`
  0% {
    transform: rotateX(0);
  }
  49% {
    color: ${color};
    border-color: ${borderColor};
    background: ${background};
  }
  50% {
    color: #ffffff;
    border-color: #6aaa64;
    background: #6aaa64;
    transform: rotateX(-90deg);
  }
  100% {
    color: #ffffff;
    border-color: #6aaa64;
    background: #6aaa64;
    transform: rotateX(0);
  }
`;

export const createInvalidReveal = (
  color: string,
  background: string,
  borderColor: string,
) => keyframes`
  0% {
    transform: rotateX(0);
  }
  49% {
    color: ${color};
    border-color: ${borderColor};
    background: ${background};
  }
  50% {
    color: #ffffff;
    border-color: #787c7e;
    background: #787c7e;
    transform: rotateX(-90deg);
  }
  100% {
    color: #ffffff;
    border-color: #787c7e;
    background: #787c7e;
    transform: rotateX(0);
  }
`;
