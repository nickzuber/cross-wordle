import { keyframes } from "@emotion/react";

export const createLetterBlink = (s1: string, s2: string, s3: string, s4: string) => keyframes`
  0% {
    content: "${s1}";
  }

  24% {
    content: "${s1}";
  }
  25% {
    content: "${s2}";
  }

  49% {
    content: "${s2}";
  }
  50% {
    content: "${s3}";
  }

  74% {
    content: "${s3}";
  }
  75% {
    content: "${s4}";
  }

  98% {
    content: "${s4}";
  }
  100% {
    content: "${s1}";
  }
`;

export const createHighlightBlink = (background: string, highlight: string) => keyframes`
  0% {
    background: ${background};
  }

  46% {
    background: ${background};
  }
  50% {
    background: ${highlight};
  }


  96% {
    background: ${highlight};
  }
  100% {
    background: ${background};
  }
`;

export const createHighlightBlinkInverted = (
  background: string,
  highlight: string,
) => keyframes`
  0% {
    background: ${highlight};
  }

  46% {
    background: ${highlight};
  }
  50% {
    background: ${background};
  }


  96% {
    background: ${background};
  }
  100% {
    background: ${highlight};
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
