import React, { useContext, useState, useEffect } from 'react';

import { auth } from '../firebase/firebaseConfig';

// Creamos el contexto (estado global)
const AuthContext = React.createContext();

// Hook para acceder al contexto
const useAuth = () => {
    return useContext(AuthContext)
}

// Creamos el provider
const AuthProvider = ({ children }) => {
    // State de informacion del usuario
    const [usuario, setUsuario] = useState();
    // State para saber cuando termina de cargar la comprobacion de onAuthStateChanged
    const [cargando, setCargando] = useState(true);


    // useEffect para ejecutar la comprobacion de que si el usuario tiene la secion iniciada una sola vez.
    useEffect(() => {
        // Comprobamos si hay un usuario 

        // Guardamos en cancelarSuscripcion una funcion para cerrar sesion una vez que el usuario cierre la app
        const cancelarSuscripcion = auth.onAuthStateChanged((usuario) => {
            // Ejecutamos esta funcion cada vez que hubo algun cambio en la sesion

            // Guardamos la informacion del usuario dentro del estado usuario
            setUsuario(usuario);
            // Establecemos cargando en falso luego de guardar la informacion de usuario
            setCargando(false);
        });

        // Cuando se cierre la app cerramos la sesion del usuario
        return cancelarSuscripcion;
    }, []);

    return(
        <AuthContext.Provider value={{usuario:usuario}}>
            {
                // Si ya cargo onAuthStateChanged => mostramos los componentes hijos
                !cargando && children
            }
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext, useAuth };