import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "primeflex/primeflex.css";

import 'primereact/resources/primereact.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';


import Login from './pages/Login';
import Menu from './pages/Menu';
import Perfil from './pages/Perfil';
import Usuario from './pages/Usuario';
import Sede from './pages/Sede';
import UbicacionFisica from './pages/UbicacionFisica';
import Area from './pages/Area';
import Servicio from './pages/Servicio';
import Clase from './pages/Clase';
import Marca from './pages/Marca';
import Proveedor from './pages/Proveedor';
import Inventario from './pages/Inventario';
import InventarioU from './pages/InventarioU';
import Evento from './pages/Evento';
import EventoU from './pages/EventoU';
import Mantenimiento from './pages/Mantenimiento';
import MantenimientoU from './pages/MantenimientoU';
import NotFoundPage from './pages/NotFoundPage';



// Modal.setAppElement('#root');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Menu />} >
          <Route exact path="perfil" element={<Perfil />} />
          <Route exact path="usuario" element={<Usuario />} />
          <Route exact path="sede" element={<Sede />} />

          <Route exact path="inventario" element={<Inventario />} />
          <Route exact path="inventariou" element={<InventarioU />} />
          <Route exact path="evento" element={<Evento />} />
          <Route exact path="eventou" element={<EventoU />} />
          <Route exact path="mantenimiento" element={<Mantenimiento />} />
          <Route exact path="mantenimientou" element={<MantenimientoU />} />

          <Route exact path="ubicacion_fisica" element={<UbicacionFisica />} />
          <Route exact path="area" element={<Area />} />
          <Route exact path="servicio" element={<Servicio />} />
          <Route exact path="clase" element={<Clase />} />
          <Route exact path="marca" element={<Marca />} />
          <Route exact path="proveedor" element={<Proveedor />} />
        </Route>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/404" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
