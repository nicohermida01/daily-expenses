import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components'
import { useHistory } from 'react-router-dom';

import { Header, Titulo, ContenedorHeader } from '../elementos/Header';
import Boton from '../elementos/Boton';
import { Formulario, Input, ContenedorBoton } from '../elementos/ElementosDeFormulario';
import { ReactComponent as SvgLogin } from '../imagenes/login.svg';
import { auth } from '../firebase/firebaseConfig';
import Alerta from '../elementos/Alerta';

const InicioSesion = () => {
    const history = useHistory();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [estadoAlerta, setEstadoAlerta] = useState(false);
    const [alerta, setAlerta] = useState({});

    const handleChange = (e) => {
        if(e.target.name === 'email'){
            setCorreo(e.target.value);
        }
        else if(e.target.name === 'password') {
            setPassword(e.target.value);
        }
    }

    const handleSubmit = async (e) => {
        // Función asincrona
        e.preventDefault();

        // Aseguramos el comportamiento de Alerta
        setEstadoAlerta(false);
        setAlerta({});

        // Verificamos si los datos envviados son correctos
        // Comprobamos del lado del cliente que el correo sea válido.
        const expRegular  = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]/

        if(!expRegular.test(correo)) {
            // Si el correo no es válido => mostramos un msj
            setEstadoAlerta(true);
            setAlerta({
                tipo: 'error',
                mensaje: 'Por favor ingresa un correo electrónico válido.'
            });
            return
        }

        if(correo === '' || password === ''){
            // Si algún campo esta vacio => mostramos un msj
            setEstadoAlerta(true);
            setAlerta({
                tipo: 'error',
                mensaje: 'Por favor rellena todos los datos.'
            });
            return
        }

        // En este punto los datos cargados son correctos
        // Verificamos el inicio de sesion
        try {
            await auth.signInWithEmailAndPassword(correo, password)
            // Esperamos a que la funcion asincrona de arriba termine y ejectumos lo siguiente

            // Sesion iniciada con exito
            // Redireccionamos al usuario a la página de inicio
            history.push('/');
        }
        catch(error) {
            // Hubo algun error al intentar registrar el usuario
            setEstadoAlerta(true);

            // detectamos cual fue el error y mostramos un msj en pantalla
            let mensaje;
            switch(error.code) {
                case "auth/wrong-password":
                    mensaje = 'La contraseña no es correcta.';
                    break;
                case "auth/user-not-found":
                    mensaje = 'No se encontro ninguna cuenta con este correo electronico';
                    break;
                default:
                    mensaje = 'Hubo algún error al intentar crear la cuenta.';
                    break;
            }

            setAlerta({
                tipo: 'error',
                mensaje: mensaje
            });
        }
    }

    return(
        <>
            <Helmet>
                <title>Iniciar Sesión</title>
            </Helmet>

            <Header>
                <ContenedorHeader>
                    <Titulo>Iniciar Sesión</Titulo>
                    <div>
                        <Boton to='/crear-cuenta'>Registrarse</Boton>
                    </div>
                </ContenedorHeader>
            </Header>

            <Formulario onSubmit={handleSubmit}>
                <Svg />
                <Input 
                    type='email'
                    name='email'
                    placeholder='Correo Electrónico'
                    value={correo}
                    onChange={handleChange}
                />
                <Input 
                    type='password'
                    name='password'
                    placeholder='Contraseña'
                    value={password}
                    onChange={handleChange}
                />
                <ContenedorBoton>
                    <Boton as='button' type='submit' primario>Iniciar Sesión</Boton>
                </ContenedorBoton>
            </Formulario>

            <Alerta 
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                setEstadoAlerta={setEstadoAlerta}
            />
        </>
    )
}

const Svg = styled(SvgLogin)`
    width: 100%;
    max-height: 12.5rem; /* 200px */
    margin-bottom: 1.25rem; /* 20px */
`;

export default InicioSesion;