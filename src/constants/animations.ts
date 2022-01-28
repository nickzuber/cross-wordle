import { keyframes } from "@emotion/react";

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

export const SuccessReveal = keyframes`
  0% {
    transform: rotateX(0);
  }
  49% {
    color: #1a1a1b;
    border-color: #d3d6da;
    background: #ffffff;
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

export const MixedReveal = keyframes`
  0% {
    transform: rotateX(0);
  }
  49% {
    color: #1a1a1b;
    border-color: #d3d6da;
    background: #ffffff;
  }
  50% {
    color: #ffffff;
    border-color: #c9b458;
    background: #c9b458;
    transform: rotateX(-90deg);
  }
  100% {
    color: #ffffff;
    border-color: #c9b458;
    background: #c9b458;
    transform: rotateX(0);
  }
`;

export const InvalidReveal = keyframes`
  0% {
    transform: rotateX(0);
  }
  49% {
    color: #1a1a1b;
    border-color: #d3d6da;
    background: #ffffff;
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
