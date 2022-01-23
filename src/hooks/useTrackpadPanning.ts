import React from "react";
import withRequestAnimationFrame from "raf-schd";
import { getBox } from "../utils/canvas";
import { Point } from "../types/canvas";

export const useTrackpadPanning = (
  canvasRef: React.RefObject<HTMLDivElement>,
  panCamera: (dx: number, dy: number) => void,
) => {
  React.useEffect(() => {
    function killGlobalWheel(event: WheelEvent) {
      event.preventDefault();
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault();

      const { deltaX, deltaY } = event;
      panCamera(deltaX, deltaY);
    }

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const handleWheelPerf = withRequestAnimationFrame(handleWheel);
    document.addEventListener("wheel", killGlobalWheel, {
      passive: false,
    });
    canvasElement.addEventListener("wheel", handleWheelPerf, {
      passive: false,
    });
    return () => {
      document.removeEventListener("wheel", killGlobalWheel);
      canvasElement.removeEventListener("wheel", handleWheelPerf);
    };
  }, [canvasRef, panCamera]);

  return null;
};
