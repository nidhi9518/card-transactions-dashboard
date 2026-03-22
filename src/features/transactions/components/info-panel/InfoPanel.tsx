import styled from "styled-components";
import { useContext } from "react";
import { CardThemeContext } from "../../context/CardThemeProvider";

type InfoPanelProps = {
  description: string;
  amount: string;
};

const Panel = styled.section<{ $themecolor: string }>`
  background-color: ${({ $themecolor }) => $themecolor};
  display: flex;
  justify-content: space-between;
  border-radius: var(--border-radius);
  padding: var(--padding-panel);
  min-height: 4%;
`;

export default function InfoPanel({ description, amount }: InfoPanelProps) {
  const { theme } = useContext(CardThemeContext);
  return (
    <Panel $themecolor={theme} aria-label="Transaction information">
      <div aria-label={`Transaction description ${description}`}>
        {description}
      </div>
      <div aria-label={`Transaction amount ${amount}`}>{amount}</div>
    </Panel>
  );
}
