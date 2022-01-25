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
  flex: 0 0 50px;
  z-index: 2;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  text-align: center;
`;
