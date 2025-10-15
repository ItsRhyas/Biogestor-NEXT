// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login/login';
import { Register } from './components/Register/register';
import { PermisosVista } from './components/Permisos/permisos';
import { Dashboard } from './features/dashboard/Dashboard';
import { Sensors } from './features/sensors/Sensors';
import { Reports } from './features/reports/Reports';
import { ProductionCalculator } from './features/calculator/ProductionCalculator';
import { VirtualAssistant } from './features/assistant/VirtualAssistant';
import { TechnicalDocumentation } from './features/documentation/TechnicalDocumentation';
import { Resources } from './features/resources/Resources';
import './services/interceptor';
import { useEffect, useState } from 'react';
import AlertDialog from './shared/popup/popup';
import { useParams } from 'react-router-dom';

// Componente para envolver rutas con institución
const InstitucionRoute = ({ children }: { children: React.ReactNode }) => {
  const { institucion } = useParams<{ institucion: string }>();
  
  // Guardar la institución en el contexto o localStorage para usarla en las APIs
  useEffect(() => {
    if (institucion) {
      localStorage.setItem('institucionActual', institucion);
    }
  }, [institucion]);

  return <>{children}</>;
};

function App() {
  const [currentView, setCurrentView] = useState('Sensores');

  useEffect(() => {
    // Solo en desarrollo
    if (import.meta.env.DEV) { // ← Vite usa import.meta.env
      const token = localStorage.getItem('authToken');
      const enLogin = window.location.pathname === '/login';
      const rutaActual = window.location.pathname;
      
      if (!token && !enLogin) {
        console.log('🔧 [MODO DESARROLLO] Redirigiendo a login...');
        console.log('📁 Ruta actual:', rutaActual);
        console.log('🔐 Token en localStorage:', token ? 'SÍ existe' : 'NO existe');
        <Navigate to ="/login"/>
      } else if (token) {
        console.log('🔧 [MODO DESARROLLO] Token detectado, sesión activa');
      }
    }
  }, [Navigate]);

  const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Rutas públicas sin institución */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        
        {/* Rutas con institución */}
        <Route path="/:institucion">
          {/* Rutas protegidas con layout principal */}
          <Route 
            path="perfil" 
            element={
              <ProtectedRoute>
                <InstitucionRoute>
                  <Dashboard />
                </InstitucionRoute>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="sensores" 
            element={
              <ProtectedRoute>
                <InstitucionRoute>
                  <Sensors />
                </InstitucionRoute>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="reportes" 
            element={
              <ProtectedRoute>
                <InstitucionRoute>
                  <Reports />
                </InstitucionRoute>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="calculadora" 
            element={
              <ProtectedRoute>
                <InstitucionRoute>
                  <ProductionCalculator />
                </InstitucionRoute>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="asistente" 
            element={
              <ProtectedRoute>
                <InstitucionRoute>
                  <VirtualAssistant />
                </InstitucionRoute>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="documentacion" 
            element={
              <ProtectedRoute>
                <InstitucionRoute>
                  <TechnicalDocumentation />
                </InstitucionRoute>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="permisos" 
            element={
              <ProtectedRoute>
                <InstitucionRoute>
                  <PermisosVista />
                </InstitucionRoute>
              </ProtectedRoute>
            } 
          />
          
          <Route
            path="recursos"
            element={
              <ProtectedRoute>
                <InstitucionRoute>
                  <Resources />
                </InstitucionRoute>
              </ProtectedRoute>
            }
          />

          <Route path="" element={<Navigate to="sensores" />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/popup" element={<AlertDialog/>}/>
      </Routes>
    </Router>
  );
}

export default App;