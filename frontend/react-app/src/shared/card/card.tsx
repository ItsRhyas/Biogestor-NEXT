import styled from "styled-components";

interface CardProps {
    ancho?: number;
    alto?: number;
    color?: string;
    titulo?: string;
    children?: React.ReactNode;
}

const CardContainer = styled.div<CardProps>`
    width: ${props => props.ancho ? `${props.ancho}px` : 'auto'};
    height: ${props => props.alto ? `${props.alto}px` : 'auto'};
    background-color: ${props => props.color || '#fafafa'};
    padding: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`;

const Titulo = styled.div`
    margin: 0;
    font-size: 1.6rem;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    text-align: center; 
`;

const Cuerpo = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    box-sizing: border-box;
`;

export function Card(props: CardProps) {
    const { ancho, alto, color, titulo, children } = props;

    return (
        <CardContainer ancho={ancho} alto={alto} color={color} titulo={titulo}>
            <Titulo>{titulo}</Titulo>
            <Cuerpo>{children}</Cuerpo>
        </CardContainer>
    );
}