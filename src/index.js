import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import { BrowserRouter, Route,  Switch} from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './index.css';
import App from './App';
import Contenedor from './elementos/Contenedor';
import EditarGasto from './componentes/EditarGasto';
import GastosPorCategoria from './componentes/GastosPorCategoria';
import InicioSesion from './componentes/InicioSesion';
import ListaDeGastos from './componentes/ListaDeGastos';
import RegistroUsuarios from './componentes/RegistroUsuarios';
import favicon from './imagenes/logo.png';
import Fondo from './elementos/Fondo';
import { AuthProvider } from './contextos/AuthContext';
import RutaProtegida from './componentes/RutaPrivada';
import { TotalGastadoProvider } from './contextos/TotalGastadoEnElMesContext';

WebFont.load({
  google: {
    // Work+Sans:wght@400;500;700
    families: ['Work Sans:400,500,700', 'Sans-Serif']
  }
});

const Index = () => {
  return(
    <>
      <Helmet>
        <link rel="shortcut icon" href={favicon} type="image/x-icon" />
      </Helmet>

      <AuthProvider>
        <TotalGastadoProvider>
          <BrowserRouter>
            <Contenedor>
              <Switch>
                <Route path='/iniciar-sesion' component={InicioSesion}/>
                <Route path='/crear-cuenta' component={RegistroUsuarios}/>

                <RutaProtegida path='/categorias'>
                  <GastosPorCategoria />
                </RutaProtegida>
                
                <RutaProtegida path='/lista'>
                  <ListaDeGastos />
                </RutaProtegida>

                <RutaProtegida path='/editar/:id'>
                  <EditarGasto />
                </RutaProtegida>

                <RutaProtegida path='/'>
                  <App />
                </RutaProtegida>

              </Switch>
            </Contenedor>
          </BrowserRouter>
        </TotalGastadoProvider>
      </AuthProvider>

      <Fondo />
    </>
  )
}

ReactDOM.render(<Index />, document.getElementById('root'));