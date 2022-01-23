import { FC } from "react";
import styled from "@emotion/styled";

export const Header: FC = () => {
  return (
    <Container>
      <Title>Cross Wordle</Title>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  border-bottom: 1px solid #d3d6da;
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
