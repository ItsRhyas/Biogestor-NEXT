import React, { useState } from 'react';
import styled from 'styled-components';
import { BarraLateral } from '../barraLateral/barraLateral';
import { BarraArriba } from '../barraAriiba/barraArriba';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9f9f9;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PageContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentView,
  onViewChange
}) => {
  const [sidebarAbierta, setSidebarAbierta] = useState(true);

  return (
    <LayoutContainer>
      <BarraLateral 
        abierta={sidebarAbierta} 
        onBotonClick={onViewChange} 
      />
      <ContentContainer>
        <BarraArriba
          vistaActual={currentView}
          onToggleSidebar={() => setSidebarAbierta(!sidebarAbierta)}
        />
        <PageContent>
          {children}
        </PageContent>
      </ContentContainer>
    </LayoutContainer>
  );
};