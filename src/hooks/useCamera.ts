import React from "react";
import { Camera, Point } from "../types/canvas";
import {
  centerCameraAt,
  panCameraBy,
  updateCamera,
  zoomCameraTo,
} from "../utils/camera";
import { Bounds, getBox } from "../utils/canvas";

type CameraOptions = {
  camera: Camera;
  zoomCamera: (center: Point, dz: number) => void;
  panCamera: (dx: number, dy: number) => void;
  panCameraTo: (x: number, y: number) => void;
};

export const useCamera = (): CameraOptions => {
  const { width, height } = getBox();
  const [camera, setCamera] = React.useState<Camera>({
    x: -(Bounds.maxX - width) / 2,
    y: -(Bounds.maxY - height) / 2,
    z: 1,
  });

  React.useEffect(() => {
    setCamera({
      x: -(Bounds.maxX - width) / 2,
      y: -(Bounds.maxY - height) / 2,
      z: 1,
    });
  }, [height, width]);

  const panCameraTo = React.useCallback(
    (x: number, y: number) => {
      setCamera((camera) => {
        return updateCamera(camera, (camera) => centerCameraAt(camera, x, y));
      });
    },
    [setCamera],
  );

  const panCamera = React.useCallback(
    (dx: number, dy: number) => {
      setCamera((camera) => {
        return updateCamera(camera, (camera) => panCameraBy(camera, dx, dy));
      });
    },
    [setCamera],
  );

  const zoomCamera = React.useCallback(
    (center: Point, dz: number) => {
      setCamera((camera) => {
        return updateCamera(camera, (camera) =>
          zoomCameraTo(camera, center, dz),
        );
      });
    },
    [setCamera],
  );

  return {
    camera,
    zoomCamera,
    panCamera,
    panCameraTo,
  };
};
