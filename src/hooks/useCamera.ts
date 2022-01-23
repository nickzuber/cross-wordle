import React from "react";
import { Camera } from "../types/canvas";
import { panCameraBy, updateCamera } from "../utils/camera";
import { Bounds, getBox } from "../utils/canvas";

type CameraOptions = {
  camera: Camera;
  panCamera: (dx: number, dy: number) => void;
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
      z: 1.1,
    });
  }, [height, width]);

  const panCamera = React.useCallback(
    (dx: number, dy: number) => {
      setCamera((camera) => {
        return updateCamera(camera, (camera) => panCameraBy(camera, dx, dy));
      });
    },
    [setCamera],
  );

  return {
    camera,
    panCamera,
  };
};
