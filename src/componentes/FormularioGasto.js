import React, { useState, useEffect } from 'react';
import fromUnixTime from 'date-fns/fromUnixTime';
import getUnixTime from 'date-fns/getUnixTime';
import { useHistory } from 'react-router-dom';

import { ContenedorFiltros, Formulario, Input, InputGrande, ContenedorBoton } from '../elementos/ElementosDeFormulario';
import Boton from '../elementos/Boton';
import { ReactComponent as IconoPlus } from '../imagenes/plus.svg';
import SelectCategorias from './SelectCategorias';
import DatePicker from './DatePicker';
import agregarGasto from '../firebase/agregarGasto';
import { useAuth } from '../contextos/AuthContext';
import Alerta from '../elementos/Alerta';
import editarGasto from '../firebase/editarGasto';

const FormularioGasto = ({ gasto }) => {
    const history = useHistory();

    const [inputDescripcion, setInputDescripcion] = useState('');
    const [inputCantidad, setInputCantidad] = useState('');
    // State para la categoria seleccionada actualmente
    const [categoria, setCategoria] = useState('hogar');
    // State para la fecha seleccionada actualmente
    const [fecha, setFecha] = useState(new Date());
    // State para la informacion de la alerta
    const [estadoAlerta, setEstadoAlerta] = useState(false);
    const [alerta, setAlerta] = useState({})

    // Obtenemos la sesion del usuario actual
    const { usuario } = useAuth();

    useEffect(() => {
        // Funcion que se ejecuta al cargar el componente para comprobar si ya tenemos algun gasto (formluario para editar)

        if(gasto){
            // Si tenemos un gasto => comprobamos si el gasto es del usuario actual
            if(gasto.data().uidUsuario === usuario.uid){
                // Si el gasto pertenece al usuario actual => establecemos todo el state del formulario
                setCategoria(gasto.data().categoria);
                setFecha(fromUnixTime(gasto.data().fecha)); // transformamos el valor de la fecha de unix time a javascript time
                setInputDescripcion(gasto.data().descripcion);
                setInputCantidad(gasto.data().cantidad);
            }
            else {
                // Si el gasto no pertenece al usuario actual => lo redireccionamos
                history.push('/lista');
            }
        }
    }, [gasto, usuario, history]);

    const handleChange = (e) => {
        if(e.target.name === 'descripcion'){
            setInputDescripcion(e.target.value);
        }
        else if(e.target.name === 'cantidad'){
            // Aplicamos una expresion regular para asegurarnos de que el usuario solo pueda escribir numeros
            setInputCantidad(e.target.value.replace(/[^0-9.]/g, '')); // "Todo lo que no sean numeros lo reemplazamos por nada"
        }
    }

    const handleSubmit = (e) => {
        // Funcion que se ejecuta con el submit del formulario para enviar los valores
        e.preventDefault();

        // Convertimos el valor de cantidad a decimal
        let cantidad = parseFloat(inputCantidad).toFixed(2); // Si inputCantidad posee algun caracter, parseFloat retorna null

        // Verificamos los inputs del formulario
        if(inputDescripcion !== '' && inputCantidad !== ''){
            // Si la descripcion y la cantidad no estan vacios => seguimos

            if(cantidad){
                // Si tenemos una cantidad valida => seguimos

                if(gasto){
                    // Si tenemos un gasto ya en el componente => signifca que queremos editar el gasto
                    editarGasto({
                        id: gasto.id,
                        categoria: categoria,
                        descripcion: inputDescripcion,
                        cantidad: cantidad,
                        fecha: getUnixTime(fecha), // Convertimos la fecha en formato unix 
                    })
                    .then(() => {
                        // Si la operacion de editar fue exitosa => redireccionamos
                        history.push('/lista');
                    })
                    .catch((err) => {
                        // Si hubo algun problema al intentar editar el gasto => lo informamos
                        console.log(err);
                    });
                }
                else {
                    // si no tenemos un gasto en el componente => significa que queremos agregar uno
                    
                    // le pasamos el objeto con todos los datos del gasto a la funcion de agregarGasto
                    agregarGasto({
                        categoria: categoria,
                        descripcion: inputDescripcion,
                        cantidad: cantidad,
                        fecha: getUnixTime(fecha), // Convertimos la fecha en formato unix 
                        uidUsuario: usuario.uid // Guardamos el id universal del usuario 
                    })
                    .then(() => {
                        // Si se pudo agregar el gasto al servidor correctamente => mostramos en pantalla la operacion exitosa
                        // Seteamos los datos de la alerta => se muestra en pantalla
                        setEstadoAlerta(true);
                        setAlerta({tipo: 'exito', mensaje: 'El gasto fue agregado correctamente.'});

                        // Reiniciamos el formulario
                        setCategoria('hogar');
                        setInputDescripcion('');
                        setInputCantidad('');
                        setFecha(new Date());
                    })
                    .catch((error) => {
                        // Si hubo algun error al intentar agregar el gasto => mostramos en pantalla el error

                        // Seteamos los datos de la alerta => se muestra en pantalla
                        setEstadoAlerta(true);
                        setAlerta({tipo: 'error', mensaje: 'Hubo algun problema al intentar agregar el gasto.'});
                    });
                }
            }
            else{
                // Si cantidad es null => informamos error

                // Seteamos los datos de la alerta => se muestra en pantalla
                setEstadoAlerta(true);
                setAlerta({tipo: 'error', mensaje: 'El valor que ingresaste no es correcto.'});
            }
        }
        else{  
            // Si alguno de los campos estan vacios => inormamos un error

            // Seteamos los datos de la alerta => se muestra en pantalla
            setEstadoAlerta(true);
            setAlerta({tipo: 'error', mensaje: 'Por favor rellena todos los campos.'});
        }

        
    }

    return ( 
        <Formulario onSubmit={handleSubmit}>
            <ContenedorFiltros>
                <SelectCategorias 
                    categoria={categoria}
                    setCategoria={setCategoria}
                />
                <DatePicker
                    fecha={fecha}
                    setFecha={setFecha}
                />
            </ContenedorFiltros>

            <div>
                <Input 
                    type='text'
                    name='descripcion'
                    id='descripcion'
                    placeholder='Descripción'
                    value={inputDescripcion}
                    onChange={handleChange}
                />
                <InputGrande 
                    type='text'
                    name='cantidad'
                    id='cantidad'
                    placeholder='$0.00'
                    value={inputCantidad}
                    onChange={handleChange}
                />

            </div>
            <ContenedorBoton>
                <Boton as='button' primario conIcono type='submit'>
                   {
                       // Si ya hay un gasto en el componente => queremos editarlo
                       // Si no hay queremos agregarlo
                       gasto ? 'Editar Gasto' : 'Agregar Gasto'
                   }  
                   <IconoPlus />
                </Boton>
            </ContenedorBoton>
            <Alerta 
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                setEstadoAlerta={setEstadoAlerta}
            />
        </Formulario>
    );
}
 
export default FormularioGasto;

