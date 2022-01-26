import { keyframes } from "@emotion/react";

// // animation: ${FlipIn} 250ms ease-in;
export const FlipIn = keyframes`
  0% {
    transform: rotateX(0);
  }
  100% {
    transform: rotateX(-90deg);
  }
`;

// animation: ${FlipOut} 250ms ease-in;
export const FlipOut = keyframes`
  0% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0);
  }
`;

// animation: ${PopIn} 100ms;
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

// animation: ${Reveal} 500ms ease-in;
export const Reveal = keyframes`
  0% {
    transform: rotateX(0);
  }
  50% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0);
  }
`;
