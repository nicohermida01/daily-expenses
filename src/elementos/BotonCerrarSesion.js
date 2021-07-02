import React from 'react';
import { useHistory } from 'react-router-dom';

import { ReactComponent as IconoCerrarSesion } from '../imagenes/log-out.svg';
import Boton from './Boton';
import { auth } from '../firebase/firebaseConfig';

const BotonCerrarSesion = ()  => {
    const history = useHistory();

    const cerrarSesion = async () => {
        try {
            // Accedemos a la funcion de firebase para cerrar sesion
            await auth.signOut();
            // Esperamos a que la funcion de signOut termine
            // Redireccionamos a la ventana de iniciar sesion
            history.push('/iniciar-sesion');
        }
        catch(error) {
            console.log(error);
        }
        
    }

    return(
        <Boton iconoGrande as='button' onClick={cerrarSesion}> 
            <IconoCerrarSesion />
        </Boton>
    )
}

export default BotonCerrarSesion;