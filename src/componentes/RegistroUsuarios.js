import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components'
import { useHistory } from 'react-router';

import { Header, Titulo, ContenedorHeader } from '../elementos/Header';
import Boton from '../elementos/Boton';
import { Formulario, Input, ContenedorBoton } from '../elementos/ElementosDeFormulario';
import { ReactComponent as SvgLogin } from '../imagenes/registro.svg';
import { auth } from '../firebase/firebaseConfig';
import Alerta from '../elementos/Alerta';

const RegistroUsuarios = () => {
    const history = useHistory();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [estadoAlerta, setEstadoAlerta] = useState(false);
    const [alerta, setAlerta] = useState({});

    const handleChange = (e) => {
        switch(e.target.name){
            case 'email': 
                setCorreo(e.target.value);
                break;
            case 'password': 
                setPassword(e.target.value);
                break;
            case 'password2': 
                setPassword2(e.target.value);
                break;
            default:
                break;
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

        if(correo === '' || password === '' || password2 === ''){
            // Si algún campo esta vacio => mostramos un msj
            setEstadoAlerta(true);
            setAlerta({
                tipo: 'error',
                mensaje: 'Por favor rellena todos los datos.'
            });
            return
        }

        if(password !== password2){
            // Si las contraseñas no coinciden => mostramos un msj
            setEstadoAlerta(true);
            setAlerta({
                tipo: 'error',
                mensaje: 'Las constaseñas deben coincidir.'
            });
            return
        }

        // En este punto los datos cargados son correctos
        // Registramos el usuario
        try {
            await auth.createUserWithEmailAndPassword(correo, password)
            // Esperamos a que la funcion asincrona de arriba termine y ejectumos lo siguiente
            // Usuario creado con exito
            // Redireccionamos al usuario a la página de inicio
            history.push('/');
        }
        catch(error) {
            // Hubo algun error al intentar crear el usuario
            setEstadoAlerta(true);

            let mensaje;
            switch(error.code) {
                case 'auth/weak-password':
                    mensaje = 'La contraseña tiene que contener al menos 6 caracteres.';
                    break;
                case 'auth/email-already-in-use': 
                    mensaje = 'El correo electrónico ingresado ya está en uso.';
                    break;
                case 'auth/invalid-email': 
                    mensaje = 'El correo electrónico no es válido';
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
                <title>Crear Cuenta</title>
            </Helmet>

            <Header>
                <ContenedorHeader>
                    <Titulo>Crear Cuenta</Titulo>
                    <div>
                        <Boton to='/iniciar-sesion'>Iniciar Sesion</Boton>
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
                <Input 
                    type='password'
                    name='password2'
                    placeholder='Confirmar contraseña'
                    value={password2}
                    onChange={handleChange}
                />
                <ContenedorBoton>
                    <Boton as='button' type='submit' primario>Crear Cuenta</Boton>
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
    max-height: 6.25rem; /* 100px */
    margin-bottom: 1.25rem; /* 20px */
`;

export default RegistroUsuarios;