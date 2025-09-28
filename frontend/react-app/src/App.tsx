import {BrowserRouter, Routes, Route} from "react-router-dom";
import { VerProductos } from "./pages/VerProductos";
import { AgregarProductoInsumos } from "./pages/AgregarProductoInsumos";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/productos" element={<VerProductos />} />
        <Route path="/productos/agregar" element={<AgregarProductoInsumos />} />
      </Routes>
    
    </BrowserRouter>
  );
}


export default App;
