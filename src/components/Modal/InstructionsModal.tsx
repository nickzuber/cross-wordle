import { FC } from "react";
import styled from "@emotion/styled";
import { Modal } from "./Modal";
import {
  HighlightBlink,
  HighlightBlinkInverted,
  InvalidReveal,
  createLetterBlink,
  MixedReveal,
  SuccessReveal,
} from "../../constants/animations";

const BaseDelay = 250;

export const InstructionsModal: FC = () => {
  return (
    <Modal>
      <Title>How to play</Title>
      <Paragraph>Build a crossword by connecting the letters on the board.</Paragraph>
      <Paragraph>
        Each word must be a real english word. Words must be connected to each other.
      </Paragraph>
      <Paragraph>
        When you've done as best you can, hit enter to submit. You can only do this <b>once</b>{" "}
        per day.
      </Paragraph>
      <Paragraph>
        It will <b>always</b> be possible to use all 20 letters. Have fun!
      </Paragraph>

      <Divider />

      <Example>
        <ExampleSection>
          <MiniBoardTyping />
        </ExampleSection>
        <ExampleSection>
          Create words that are connected together. Tiles will be colored at the end based on
          validity.
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
  return (
    <MiniBoard>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsSuccess animationDelay={0}>C</MiniTileContentsSuccess>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents></MiniTileContents>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents></MiniTileContents>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsSuccess animationDelay={100}>A</MiniTileContentsSuccess>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsSuccess animationDelay={200}>C</MiniTileContentsSuccess>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsMixed animationDelay={300}>T</MiniTileContentsMixed>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsSuccess animationDelay={200}>T</MiniTileContentsSuccess>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents></MiniTileContents>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsFail animationDelay={300}>K</MiniTileContentsFail>
        </MiniTileWrapper>
      </MiniRow>
    </MiniBoard>
  );
}

function MiniBoardCursor() {
  return (
    <MiniBoard>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents></MiniTileContents>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsHighlighted invert animationDelay={0}>
            A
          </MiniTileContentsHighlighted>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents></MiniTileContents>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsHighlighted animationDelay={0}></MiniTileContentsHighlighted>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsCursor>G</MiniTileContentsCursor>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsHighlighted animationDelay={0}></MiniTileContentsHighlighted>
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents>R</MiniTileContents>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsHighlighted invert animationDelay={0}>
            E
          </MiniTileContentsHighlighted>
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents>D</MiniTileContents>
        </MiniTileWrapper>
      </MiniRow>
    </MiniBoard>
  );
}

function MiniBoardShift() {
  return (
    <MiniBoard>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsShift s1="P" s2=" " s3="P" s4="A" animationDelay={0} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift s1="A" s2="P" s3="A" s4=" " animationDelay={0} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift s1=" " s2="A" s3="" s4=" " animationDelay={0} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsShift s1=" " s2=" " s3=" " s4="G" animationDelay={0} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift s1="G" s2=" " s3="G" s4=" " animationDelay={0} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift s1=" " s2="G" s3=" " s4=" " animationDelay={0} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContentsShift s1="R" s2=" " s3="R" s4="E" animationDelay={0} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift s1="E" s2="R" s3="E" s4="D" animationDelay={0} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContentsShift s1="D" s2="E" s3="D" s4=" " animationDelay={0} />
        </MiniTileWrapper>
      </MiniRow>
    </MiniBoard>
  );
}

const MiniBoard = styled.div`
  position: relative;
  background: #ffffff;
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

const MiniTileContents = styled.div`
  background: #ffffff;
  border: 2px solid #d3d6da;
  transition: border 50ms ease-in, background 50ms ease-in;
  color: #1a1a1b;
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

const MiniTileContentsSuccess = styled(MiniTileContents)<{ animationDelay: number }>`
  animation: ${SuccessReveal} 500ms ease-in;
  animation-delay: ${(p) => BaseDelay + p.animationDelay}ms;
  animation-fill-mode: forwards;
`;

const MiniTileContentsMixed = styled(MiniTileContentsSuccess)<{ animationDelay: number }>`
  animation: ${MixedReveal} 500ms ease-in;
  animation-delay: ${(p) => BaseDelay + p.animationDelay}ms;
  animation-fill-mode: forwards;
`;

const MiniTileContentsFail = styled(MiniTileContentsSuccess)<{ animationDelay: number }>`
  animation: ${InvalidReveal} 500ms ease-in;
  animation-delay: ${(p) => BaseDelay + p.animationDelay}ms;
  animation-fill-mode: forwards;
`;

const MiniTileContentsHighlighted = styled(MiniTileContentsSuccess)<{
  animationDelay: number;
  invert?: boolean;
}>`
  animation: ${(p) => (p.invert ? HighlightBlinkInverted : HighlightBlink)} 4000ms ease-in;
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

const Divider = styled.div`
  border-bottom: 1px solid #d3d6da;
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
`;
