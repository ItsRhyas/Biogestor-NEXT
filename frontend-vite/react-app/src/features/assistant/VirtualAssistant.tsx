import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../../shared/card/card';
import { BarraLateral } from '../../shared/barraLateral/barraLateral';
import { BarraArriba } from '../../shared/barraAriiba/barraArriba';
import styled from 'styled-components';

interface Message {
  id: number;
  text: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  padding: 20px;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.2fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChatSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
`;

const Icon = styled.i<{ $color?: string }>`
  font-size: 1.2rem;
  color: ${props => props.$color || '#28a745'};
  margin-top: 5px;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h4`
  margin: 0;
  color: #333;
`;

const HeaderDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #555;
`;

// Wrapper para el Card con los estilos necesarios
const ChatCard = styled(Card)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ChatWindow = styled.div`
  flex-grow: 1;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  min-height: 350px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MessageBubble = styled.div<{ $type: 'user' | 'assistant' }>`
  padding: 0.6rem 1rem;
  border-radius: 15px;
  max-width: 80%;
  line-height: 1.4;
  align-self: ${props => props.$type === 'user' ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.$type === 'user' ? '#f2faf4' : '#e9f5ff'};
  color: ${props => props.$type === 'user' ? '#28a745' : '#0366d6'};
  border-bottom-right-radius: ${props => props.$type === 'user' ? '0' : '15px'};
  border-bottom-left-radius: ${props => props.$type === 'assistant' ? '0' : '15px'};
`;

const MessageText = styled.p`
  margin: 0;
`;

const MessageTime = styled.small`
  display: block;
  font-size: 0.7rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const LoadingMessage = styled.div`
  padding: 0.6rem 1rem;
  border-radius: 15px;
  max-width: 80%;
  align-self: flex-start;
  background-color: #e9f5ff;
  color: #0366d6;
  border-bottom-left-radius: 0;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const MessageInput = styled.input<{ $disabled: boolean }>`
  flex-grow: 1;
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 1rem;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'text'};

  &:focus {
    outline: none;
    border-color: #28a745;
  }
`;

const SendButton = styled.button<{ $disabled: boolean }>`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.8rem 1rem;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.6 : 1};
  transition: opacity 0.3s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FAQButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  text-align: left;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #28a745;
    color: white;
  }
`;

const HelpContent = styled.div`
  color: #555;
  line-height: 1.6;
`;

const HelpParagraph = styled.p`
  margin: 0 0 0.5rem 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const VirtualAssistant: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! Soy el asistente virtual de BioGestor. Estoy aquí para ayudarte con cualquier pregunta sobre el monitoreo y operación de biodigestores. ¿En qué puedo asistirte hoy?',
      type: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const faqItems = [
    '¿Cuál es la temperatura óptima?',
    '¿Cómo ajustar el nivel de pH?',
    'Soluciones a baja producción',
    'Mantenimiento preventivo'
  ];

  const getAssistantResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('temperatura')) {
      return 'La temperatura óptima para un biodigestor mesofílico es entre 35°C y 40°C. Es crucial mantenerla estable para una producción de biogás eficiente.';
    } else if (lowerQuestion.includes('ph')) {
      return 'El nivel de pH ideal se encuentra entre 6.8 y 7.2. Un pH fuera de este rango puede inhibir la actividad de las bacterias metanogénicas.';
    } else if (lowerQuestion.includes('producción') || lowerQuestion.includes('baja')) {
      return 'Una baja producción puede deberse a varios factores: temperatura inadecuada, pH incorrecto, sobrecarga de material o una mezcla incorrecta de sustratos. Recomiendo revisar los parámetros clave.';
    } else if (lowerQuestion.includes('mantenimiento')) {
      return 'El mantenimiento preventivo incluye la revisión diaria de sensores, la limpieza periódica de tuberías y la verificación de la integridad estructural del biodigestor para evitar fugas.';
    } else {
      return 'No estoy seguro de cómo responder a eso. ¿Puedes intentar reformular tu pregunta o seleccionar una de las preguntas frecuentes?';
    }
  };

  const addMessage = (text: string, type: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      type,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    addMessage(userText, 'user');
    setInputText('');
    setIsLoading(true);

    // Simular respuesta del asistente
    setTimeout(() => {
      const assistantResponse = getAssistantResponse(userText);
      addMessage(assistantResponse, 'assistant');
      setIsLoading(false);
    }, 1000);
  };

  const handleFaqClick = (question: string) => {
    setInputText(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container>
      <BarraLateral abierta={sidebarAbierta} />

      <MainContent>
        <BarraArriba
          vistaActual="Asistente Virtual"
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        
        <ContentWrapper>
          <GridLayout>
            {/* Chat Principal */}
            <ChatSection>
              <ChatCard>
                <HeaderContainer>
                  <Icon className="fas fa-robot" />
                  <HeaderContent>
                    <HeaderTitle>Chat con Asistente</HeaderTitle>
                    <HeaderDescription>
                      Pregunta sobre cualquier aspecto del sistema de biodigestores.
                    </HeaderDescription>
                  </HeaderContent>
                </HeaderContainer>

                <ChatWindow ref={chatWindowRef}>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} $type={message.type}>
                      <MessageText>{message.text}</MessageText>
                      <MessageTime>
                        {message.timestamp.toLocaleTimeString()}
                      </MessageTime>
                    </MessageBubble>
                  ))}
                  {isLoading && (
                    <LoadingMessage>
                      <MessageText>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                        Escribiendo...
                      </MessageText>
                    </LoadingMessage>
                  )}
                </ChatWindow>

                <InputContainer>
                  <MessageInput
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta aquí..."
                    disabled={isLoading}
                    $disabled={isLoading}
                  />
                  <SendButton
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputText.trim()}
                    $disabled={isLoading || !inputText.trim()}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </SendButton>
                </InputContainer>
              </ChatCard>
            </ChatSection>

            {/* Sidebar */}
            <SidebarSection>
              {/* Preguntas Frecuentes */}
              <Card>
                <HeaderContainer>
                  <Icon className="fas fa-question-circle" />
                  <HeaderContent>
                    <HeaderTitle>Preguntas Frecuentes</HeaderTitle>
                  </HeaderContent>
                </HeaderContainer>

                <FAQContainer>
                  {faqItems.map((item, index) => (
                    <FAQButton
                      key={index}
                      onClick={() => handleFaqClick(item)}
                    >
                      {item}
                    </FAQButton>
                  ))}
                </FAQContainer>
              </Card>

              {/* Ayuda Adicional */}
              <Card>
                <HeaderContainer>
                  <Icon className="fas fa-life-ring" />
                  <HeaderContent>
                    <HeaderTitle>Ayuda Adicional</HeaderTitle>
                  </HeaderContent>
                </HeaderContainer>

                <HelpContent>
                  <HelpParagraph>
                    <strong>Soporte Técnico:</strong> +1 (555) 123-4567
                  </HelpParagraph>
                  <HelpParagraph>
                    <strong>Email:</strong> soporte@biogestor.com
                  </HelpParagraph>
                  <HelpParagraph>
                    <strong>Horario:</strong> 24/7 para emergencias
                  </HelpParagraph>
                </HelpContent>
              </Card>
            </SidebarSection>
          </GridLayout>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};