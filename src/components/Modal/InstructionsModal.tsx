import { FC } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Modal } from "./Modal";
import {
  createHighlightBlink,
  createHighlightBlinkInverted,
  createLetterBlink,
  createInvalidReveal,
  createMixedReveal,
  createSuccessReveal,
} from "../../constants/animations";
import { AppTheme } from "../../constants/themes";

const BaseDelay = 250;

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
      <Paragraph>
        It will <b>always</b> be possible to use all 20 letters. Have fun!
      </Paragraph>

      <Divider theme={theme} />

      <Example>
        <ExampleSection>
          <MiniBoardTyping />
        </ExampleSection>
        <ExampleSection>
          Create words that are connected together. Green tiles are parts of real words. Gray
          tiles are part of invalid words.
        </ExampleSection>
      </Example>

      <Example>
        <ExampleSection>
          <MiniBoardCursor />
        </ExampleSection>
        <ExampleSection>
          Tap on any tile to change the cursor's position. Tap on the cursor to switch the
          direction you type.
        </ExampleSection>
      </Example>

      <Example>
        <ExampleSection>
          <MiniBoardShift />
        </ExampleSection>
        <ExampleSection>
          Shift the board to make room for new letters — use the arrow buttons above the
          keyboard.
        </ExampleSection>
      </Example>
    </Modal>
  );
};

function MiniBoardTyping() {
  const theme = useTheme() as AppTheme;
  return (
    <MiniBoard theme={theme}>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsSuccess theme={theme} animationDelay={0}>
            C
          </MiniTileContentsSuccess>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme}></MiniTileContents>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme}></MiniTileContents>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsSuccess theme={theme} animationDelay={100}>
            A
          </MiniTileContentsSuccess>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsSuccess theme={theme} animationDelay={200}>
            C
          </MiniTileContentsSuccess>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsMixed theme={theme} animationDelay={300}>
            T
          </MiniTileContentsMixed>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsSuccess theme={theme} animationDelay={200}>
            T
          </MiniTileContentsSuccess>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme}></MiniTileContents>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsFail theme={theme} animationDelay={300}>
            K
          </MiniTileContentsFail>
        </MiniTileWrapper>
      </MiniRow>
    </MiniBoard>
  );
}

function MiniBoardCursor() {
  const theme = useTheme() as AppTheme;
  return (
    <MiniBoard theme={theme}>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme}></MiniTileContents>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsHighlighted theme={theme} invert animationDelay={0}>
            A
          </MiniTileContentsHighlighted>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme}></MiniTileContents>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsHighlighted
            theme={theme}
            animationDelay={0}
          ></MiniTileContentsHighlighted>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsCursor theme={theme}>G</MiniTileContentsCursor>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsHighlighted
            theme={theme}
            animationDelay={0}
          ></MiniTileContentsHighlighted>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme}>R</MiniTileContents>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsHighlighted theme={theme} invert animationDelay={0}>
            E
          </MiniTileContentsHighlighted>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme}>D</MiniTileContents>
        </MiniTileWrapper>
      </MiniRow>
    </MiniBoard>
  );
}

function MiniBoardShift() {
  const theme = useTheme() as AppTheme;
  return (
    <MiniBoard theme={theme}>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsShift
            theme={theme}
            s1="P"
            s2=" "
            s3="P"
            s4="A"
            animationDelay={0}
          />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift
            theme={theme}
            s1="A"
            s2="P"
            s3="A"
            s4=" "
            animationDelay={0}
          />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift theme={theme} s1=" " s2="A" s3="" s4=" " animationDelay={0} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsShift
            theme={theme}
            s1=" "
            s2=" "
            s3=" "
            s4="G"
            animationDelay={0}
          />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift
            theme={theme}
            s1="G"
            s2=" "
            s3="G"
            s4=" "
            animationDelay={0}
          />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift
            theme={theme}
            s1=" "
            s2="G"
            s3=" "
            s4=" "
            animationDelay={0}
          />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsShift
            theme={theme}
            s1="R"
            s2=" "
            s3="R"
            s4="E"
            animationDelay={0}
          />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift
            theme={theme}
            s1="E"
            s2="R"
            s3="E"
            s4="D"
            animationDelay={0}
          />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift
            theme={theme}
            s1="D"
            s2="E"
            s3="D"
            s4=" "
            animationDelay={0}
          />
        </MiniTileWrapper>
      </MiniRow>
    </MiniBoard>
  );
}

const MiniBoard = styled.div<{ theme: AppTheme }>`
  position: relative;
  background: ${(p) => p.theme.colors.primary};
  width: 105px; // 3 tiles * tile size
  height: 105px;
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
`;

const MiniTileContentsCursor = styled(MiniTileContents)`
  background: #228be622;
  border-color: #228be6;
`;

const MiniTileContentsSuccess = styled(MiniTileContents)<{
  animationDelay: number;
  theme: AppTheme;
}>`
  animation: ${(p) =>
      createSuccessReveal(
        p.theme.colors.text,
        p.theme.colors.tileSecondary,
        p.theme.colors.primary,
      )}
    500ms ease-in;
  animation-delay: ${(p) => BaseDelay + p.animationDelay}ms;
  animation-fill-mode: forwards;
`;

const MiniTileContentsMixed = styled(MiniTileContentsSuccess)<{
  animationDelay: number;
  theme: AppTheme;
}>`
  animation: ${(p) =>
      createMixedReveal(
        p.theme.colors.text,
        p.theme.colors.tileSecondary,
        p.theme.colors.primary,
      )}
    500ms ease-in;
  animation-delay: ${(p) => BaseDelay + p.animationDelay}ms;
  animation-fill-mode: forwards;
`;

const MiniTileContentsFail = styled(MiniTileContentsSuccess)<{
  animationDelay: number;
  theme: AppTheme;
}>`
  animation: ${(p) =>
      createInvalidReveal(
        p.theme.colors.text,
        p.theme.colors.tileSecondary,
        p.theme.colors.primary,
      )}
    500ms ease-in;
  animation-delay: ${(p) => BaseDelay + p.animationDelay}ms;
  animation-fill-mode: forwards;
`;

const MiniTileContentsHighlighted = styled(MiniTileContentsSuccess)<{
  animationDelay: number;
  invert?: boolean;
  theme: AppTheme;
}>`
  animation: ${(p) =>
      p.invert
        ? createHighlightBlinkInverted(p.theme.colors.primary, p.theme.colors.highlight)
        : createHighlightBlink(p.theme.colors.primary, p.theme.colors.highlight)}
    4000ms ease-in;
  animation-delay: ${(p) => (p.animationDelay ? BaseDelay + p.animationDelay : 0)}ms;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
`;

const MiniTileContentsShift = styled(MiniTileContents)<{
  animationDelay: number;
  s1: string;
  s2: string;
  s3: string;
  s4: string;
}>`
  &:after {
    animation: ${({ s1, s2, s3, s4 }) => createLetterBlink(s1, s2, s3, s4)} 6000ms ease-in;
    animation-delay: ${(p) => (p.animationDelay ? BaseDelay + p.animationDelay : 0)}ms;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    content: "${(p) => p.s1}";
  }
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

const Example = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ExampleSection = styled.div`
  width: 50%;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-size: 0.9rem;
  font-weight: 500;
`;
