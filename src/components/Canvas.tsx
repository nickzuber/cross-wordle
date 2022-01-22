import React, { FC } from "react";
import styled from "@emotion/styled";
import { Camera, Point } from "../types/canvas";
import { useWheelEffect } from "../hooks/useWheelEffect";
import { panCameraBy, updateCamera, zoomCameraTo } from "../utils/camera";
import { getBox } from "../utils/canvas";

export const Canvas: FC = () => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [camera, setCamera] = React.useState<Camera>({
    x: 0,
    y: 0,
    z: 1,
  });

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

  console.info(camera);
  useWheelEffect(canvasRef, panCamera, zoomCamera);

  const transform = `scale(${camera.z}) translate(${camera.x}px, ${camera.y}px)`;
  return (
    <Container id="canvas">
      <Board ref={canvasRef} style={{ transform }}>
        hey
      </Board>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  background: red;
  width: 100%;
  min-height: 200px;
  height: 85vh;
  margin: 24px auto 0;
  overflow: hidden;
`;

const Board = styled.div`
  position: relative;
  background: #eee;
  width: 800px;
  height: 800px;

  display: flex;
  align-items: center;
  justify-content: center;
`;
