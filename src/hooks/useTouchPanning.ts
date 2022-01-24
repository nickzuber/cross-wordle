import React from "react";
import withRequestAnimationFrame from "raf-schd";
import { getBox } from "../utils/canvas";
import { Camera, Point } from "../types/canvas";

export const useTouchPanning = (
  canvasRef: React.RefObject<HTMLDivElement>,
  camera: Camera,
  zoomCamera: (center: Point, dz: number) => void,
  panCameraTo: (x: number, y: number) => void,
) => {
  const cameraXYRef = React.useRef<Point | null>(null);
  const positionRef = React.useRef<Point | null>(null);
  const centerRef = React.useRef<Point | null>(null);
  const distanceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    function killEvent(event: any) {
      event.preventDefault();
    }

    function handleTouchStart(event: TouchEvent) {
      event.preventDefault();

      const target = event.target as HTMLElement;
      const isOnTile = target.classList.contains("placed-tile");

      // Don't try to pan if we're also moving a placed tile.
      if (isOnTile) return;

      // Do pan.
      if (event.touches.length === 1) {
        const { clientX, clientY } = event.touches[0];
        positionRef.current = { x: clientX, y: clientY };
        cameraXYRef.current = { x: camera.x, y: camera.y };
      }
      // Do zoom.
      else if (event.touches.length === 2) {
        event.preventDefault();
        const { clientX, clientY } = event.touches[0];
        const { left, top } = getBox();
        const center = { x: clientX - left, y: clientY - top };

        const distanceZ = Math.hypot(
          event.touches[0].pageX - event.touches[1].pageX,
          event.touches[0].pageY - event.touches[1].pageY,
        );

        // Debug
        // (document.querySelector("#debug") as HTMLElement).innerHTML =
        //   "" + distanceZ;

        distanceRef.current = distanceZ;
        centerRef.current = center;
      }
    }

    function handleTouchMove(event: TouchEvent) {
      event.preventDefault();

      // Do pan.
      if (positionRef.current && cameraXYRef.current) {
        if (event.touches.length === 1) {
          const { clientX, clientY } = event.touches[0];
          const deltaX = (positionRef.current.x - clientX) / camera.z;
          const deltaY = (positionRef.current.y - clientY) / camera.z;

          const newPositionX = cameraXYRef.current.x - deltaX;
          const newPositionY = cameraXYRef.current.y - deltaY;

          panCameraTo(newPositionX, newPositionY);
        }
      }

      // Do zoom.
      if (distanceRef.current && centerRef.current) {
        const distanceZ = Math.hypot(
          event.touches[0].pageX - event.touches[1].pageX,
          event.touches[0].pageY - event.touches[1].pageY,
        );

        const deltaZ = distanceRef.current - distanceZ;

        // Debug
        // (document.querySelector("#debug") as HTMLElement).innerHTML =
        //   "" + deltaZ;

        const dz = deltaZ / 200;
        zoomCamera(centerRef.current, dz);
        distanceRef.current = distanceZ;
      }
    }

    function handleTouchEnd(event: TouchEvent) {
      event.preventDefault();
      positionRef.current = null;
    }

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const handleTouchStartPerf = withRequestAnimationFrame(handleTouchStart);
    const handleTouchMovePerf = withRequestAnimationFrame(handleTouchMove);
    const handleTouchEndPerf = withRequestAnimationFrame(handleTouchEnd);

    canvasElement.addEventListener("touchstart", handleTouchStartPerf, {
      passive: false,
    });
    canvasElement.addEventListener("touchmove", handleTouchMovePerf, {
      passive: false,
    });
    canvasElement.addEventListener("touchend", handleTouchEndPerf, {
      passive: false,
    });
    document.addEventListener("gesturestart", killEvent, {
      passive: false,
    });
    // document.addEventListener("touchstart", killEvent, {
    //   passive: false,
    // });
    return () => {
      canvasElement.removeEventListener("touchstart", handleTouchStartPerf);
      canvasElement.removeEventListener("touchmove", handleTouchMovePerf);
      canvasElement.removeEventListener("touchend", handleTouchEndPerf);
      document.removeEventListener("gesturestart", killEvent);
      // document.removeEventListener("killEvent", killEvent);
    };
  }, [canvasRef, zoomCamera, panCameraTo, camera]);

  return null;
};
