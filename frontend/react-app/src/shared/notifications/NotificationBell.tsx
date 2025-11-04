import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getAlerts, resolveAlert } from '../../api/dashboard.api';

const Wrapper = styled.div`
  position: relative;
`;

const BellButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: #2d3748;
  &:hover { background: #f3f4f6; }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
  70% { transform: scale(1.06); box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
`;

const Badge = styled.span<{ $highlight?: boolean }>`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #dc3545;
  color: white;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${({ $highlight }) => $highlight ? `animation: ${pulse} 1.2s ease-out 0s 3;` : ''}
`;

const Panel = styled.div`
  position: absolute;
  right: 0;
  top: 42px;
  width: 360px;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  border-radius: 10px;
  padding: 8px;
  z-index: 10;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 10px;
  border-bottom: 1px solid #f1f1f1;
`;

const Title = styled.div`
  font-weight: 700;
  color: #111827;
`;

const ClearBtn = styled.button`
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
`;

const List = styled.div`
  max-height: 320px;
  overflow-y: auto;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: 10px;
  padding: 10px 8px;
  border-bottom: 1px solid #f5f5f5;
`;

const SeverityDot = styled.span<{ $level: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-top: 3px;
  background-color: ${({ $level }) => ($level === 'CRITICAL' ? '#dc2626' : '#d97706')};
`;

const ResolveBtn = styled.button`
  border: none;
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  &:hover { background: #dcfce7; }
`;

const Empty = styled.div`
  padding: 16px;
  color: #6b7280;
  text-align: center;
`;

export type UiAlert = { id:number; level:string; message:string; created_at:string };

const BellIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" />
    <path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2z" />
  </svg>
);

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<UiAlert[]>([]);
  const [highlight, setHighlight] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastCountRef = useRef<number>(0);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAlerts();
      if (data.length > lastCountRef.current) {
        if (!open) beep();
        flashBadge();
      }
      lastCountRef.current = data.length;
      setAlerts(data);
    } catch (_) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Simple polling every 20s
  useEffect(() => {
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, []);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (open && wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  const onResolve = async (id: number) => {
    try {
      await resolveAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (_) {}
  };

  const onClearAll = async () => {
    // Resolve all visible alerts sequentially (keeps code simple)
    for (const a of alerts) {
      try { await resolveAlert(a.id); } catch (_) {}
    }
    setAlerts([]);
    lastCountRef.current = 0;
  };

  const flashBadge = () => {
    setHighlight(true);
    window.setTimeout(() => setHighlight(false), 3000);
  };

  const beep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      o.start(now);
      o.stop(now + 0.18);
    } catch {
      // ignore if not supported
    }
  };

  return (
    <Wrapper ref={wrapperRef}>
      <BellButton onClick={() => setOpen(v => !v)} aria-label="Notificaciones">
        <BellIcon size={20} />
        {alerts.length > 0 && <Badge $highlight={highlight}>{alerts.length}</Badge>}
      </BellButton>
      {open && (
        <Panel>
          <Header>
            <Title>Alertas {loading ? '(cargando...)' : ''}</Title>
            {alerts.length > 0 && <ClearBtn onClick={onClearAll}>Marcar todo como visto</ClearBtn>}
          </Header>
          <List>
            {alerts.length === 0 ? (
              <Empty>No hay alertas</Empty>
            ) : (
              alerts.map(a => (
                <Item key={a.id}>
                  <SeverityDot $level={a.level} />
                  <div>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{a.message}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{new Date(a.created_at).toLocaleString()}</div>
                  </div>
                  <ResolveBtn onClick={() => onResolve(a.id)}>Resolver</ResolveBtn>
                </Item>
              ))
            )}
          </List>
        </Panel>
      )}
    </Wrapper>
  );
};
