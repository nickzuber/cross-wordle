import { FC } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Modal } from "./Modal";
import {
  createAnimatedCursorTile,
  createAnimatedTile,
  createSuccessReveal,
} from "../../constants/animations";
import { AppTheme } from "../../constants/themes";

const BaseDelay = 500;
const TypingDelay = 250;

export const InstructionsModal: FC = () => {
  const theme = useTheme() as AppTheme;

  return (
    <Modal>
      <Title>How to play</Title>
      <Paragraph>Build a crossword by connecting all the letters on the board.</Paragraph>
      <Paragraph>
        Each word must be a real English word. Words must be connected to each other.
      </Paragraph>
      <Paragraph>
        When you've placed all the letters, hit enter to submit. You can only do this{" "}
        <b>once</b> per day.
      </Paragraph>

      <Divider theme={theme} />

      <Paragraph>
        You can place letters anywhere on the entire board by tapping a square.
      </Paragraph>

      <Paragraph>
        You can change the direction your letters flow by tapping the highlighted square.
      </Paragraph>

      <MiniBoardDemo />

      <Paragraph>
        It will <b>always</b> be possible to use all 20 letters. Have fun!
      </Paragraph>
    </Modal>
  );
};

const MiniBoardDemo = () => {
  const theme = useTheme() as AppTheme;

  return (
    <MiniBoardContainer>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsAnimatedEmpty firstTile order={1} theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={100 + 200} order={9} theme={theme}>
            D
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={200 + 100} order={2} theme={theme}>
            G
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={200 + 200} order={3} theme={theme}>
            R
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={200 + 300} order={4} theme={theme}>
            O
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={200 + 400} order={5} theme={theme}>
            O
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={200 + 500} order={6} theme={theme}>
            V
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={200 + 600} order={7} theme={theme}>
            Y
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsAnimatedEmpty order={8} theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={300 + 100} order={10} theme={theme}>
            I
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={300 + 400} order={13} theme={theme}>
            I
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={400 + 200} order={11} theme={theme}>
            P
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={400 + 300} order={16} theme={theme}>
            R
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={400 + 400} order={17} theme={theme}>
            O
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={400 + 500} order={14} theme={theme}>
            B
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={400 + 600} order={18} theme={theme}>
            E
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimatedEmpty order={12} theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsAnimated position={600 + 500} order={15} theme={theme}>
            E
          </MiniTileContentsAnimated>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
    </MiniBoardContainer>
  );
};

const MiniBoardContainer = styled.div`
  position: relative;
  margin: 24px auto;
`;

const MiniRow = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MiniTileWrapper = styled.div`
  position: relative;
  min-height: 33px;
  min-width: 33px;
  max-height: 33px;
  max-width: 33px;
  height: 100%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const MiniTileContents = styled.div<{ theme: AppTheme }>`
  background: ${(p) => p.theme.colors.primary};
  border: 2px solid ${(p) => p.theme.colors.tileSecondary};
  transition: border 50ms ease-in, background 50ms ease-in;
  color: ${(p) => p.theme.colors.text};
  min-height: 25px;
  min-width: 25px;
  max-height: 25px;
  max-width: 25px;
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  opacity: 1;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  text-transform: uppercase;
`;

const MiniTileContentsAnimated = styled(MiniTileContents)<{
  firstTile?: boolean;
  order: number;
  position: number;
  theme: AppTheme;
}>`
  color: transparent;
  animation: ${(p) =>
        createAnimatedCursorTile(p.theme.colors.primary, p.theme.colors.tileSecondary)}
      ${TypingDelay}ms ease-in
      ${(p) =>
        p.firstTile ? 0 : TypingDelay * p.order ? BaseDelay + TypingDelay * p.order : 0}ms,
    ${(p) =>
        createAnimatedTile(
          p.theme.colors.primary,
          p.theme.colors.primary,
          p.theme.colors.text,
          p.theme.colors.tileSecondary,
        )}
      500ms ease-in
      ${(p) => (TypingDelay * p.order ? TypingDelay + BaseDelay + TypingDelay * p.order : 0)}ms,
    ${(p) =>
        createSuccessReveal(
          p.theme.colors.primary,
          p.theme.colors.tileSecondary,
          p.theme.colors.primary,
        )}
      500ms ease-in ${(p) => 500 + BaseDelay + TypingDelay * 18 + p.position}ms;
  animation-fill-mode: forwards;
`;

const MiniTileContentsAnimatedEmpty = styled(MiniTileContents)<{
  firstTile?: boolean;
  order: number;
  theme: AppTheme;
}>`
  animation: ${(p) =>
      createAnimatedCursorTile(p.theme.colors.primary, p.theme.colors.tileSecondary)}
    ${(p) => (p.firstTile ? TypingDelay + 800 : TypingDelay)}ms ease-in
    ${(p) =>
      p.firstTile ? 0 : TypingDelay * p.order ? BaseDelay + TypingDelay * p.order : 0}ms;
  animation-fill-mode: forwards;
`;

// ====================================================

const Title = styled.h1`
  margin: 0 0 24px;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.025rem;
  text-transform: uppercase;
  text-align: center;
`;

const Paragraph = styled.p`
  margin: 0;
  margin-bottom: 12px;
  font-weight: 500;
  font-size: 0.9rem;
  text-align: left;
`;

const Divider = styled.div<{ theme: AppTheme }>`
  border-bottom: 1px solid ${(p) => p.theme.colors.tileSecondary};
  width: 100%;
  margin: 12px auto 18px;
`;
