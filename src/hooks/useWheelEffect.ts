import React from "react";
import withRequestAnimationFrame from "raf-schd";
import { getBox } from "../utils/canvas";
import { Point } from "../types/canvas";

export const useWheelEffect = (
  canvasRef: React.RefObject<HTMLDivElement>,
  panCamera: (dx: number, dy: number) => void,
  zoomCamera: (center: Point, dz: number) => void,
) => {
  React.useEffect(() => {
    function handleWheel(event: WheelEvent) {
      event.preventDefault();

      // Should be zooming when holding Ctrl.
      if (event.ctrlKey) {
        const { clientX, clientY, deltaY } = event;
        const { left, top } = getBox();
        const center = { x: clientX - left, y: clientY - top };
        const dz = deltaY / 100;
        zoomCamera(center, dz);
      } else {
        const { deltaX, deltaY } = event;
        panCamera(deltaX, deltaY);
      }
    }

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const handleWheelPerf = withRequestAnimationFrame(handleWheel);
    canvasElement.addEventListener("wheel", handleWheelPerf, {
      passive: false,
    });
    return () => {
      canvasElement.removeEventListener("wheel", handleWheelPerf);
    };
  }, [canvasRef, panCamera, zoomCamera]);

  return null;
};
