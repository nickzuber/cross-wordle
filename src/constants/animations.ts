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

export const createSuccessReveal = (
  color: string,
  borderColor: string,
  background: string,
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
