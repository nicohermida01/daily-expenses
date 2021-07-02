import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuth } from '../contextos/AuthContext';

const RutaProtegida = ({ children, ...propiedades }) => {
    // State para obtener la informacion de usuario
    const { usuario } = useAuth();

    if(usuario){
        // Si hay un usuario iniciado => mostramos los componentes hijos
        return(
            <Route {...propiedades}>{children}</Route>
        )
    }else {
        // Si no hay un usuario iniciado => redireccionamos a la ventana iniciar sesion
        return(
            <Redirect to='/iniciar-sesion' />
        )
    }
}

export default RutaProtegida;