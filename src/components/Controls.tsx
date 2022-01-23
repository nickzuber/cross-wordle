import { FC } from "react";
import styled from "@emotion/styled";
import { Config, getRandomLetters } from "../utils/game";

export const Controls: FC = () => {
  const letters = getRandomLetters(Config.MaxLetters);

  return (
    <Container>
      <Title>{letters}</Title>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin: 12px 0 4px;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  text-align: center;
`;
