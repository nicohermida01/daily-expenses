import React from 'react';
import {Helmet} from 'react-helmet';
import { Link } from 'react-router-dom';
import { format, fromUnixTime } from 'date-fns';
import { es } from 'date-fns/locale';

import { Header, Titulo } from '../elementos/Header';
import BtnRegresar from '../elementos/BtnRegresar';
import BarraTotalGastado from './BarraTotalGastado';
import useObtenerGastos from '../hooks/useObtenerGastos';
import {
    Lista,
    ElementoLista,
    Categoria,
    Descripcion,
    Valor,
    Fecha,
    ContenedorBotones,
    BotonAccion,
    BotonCargarMas,
    ContenedorBotonCentral,
    ContenedorSubtitulo,
    Subtitulo
} from '../elementos/ElementosDeLista';
import IconoCategoria from '../elementos/IconoCategoria';
import convertirAMoneda from '../funciones/convertirAMoneda';
import { ReactComponent as IconoEditar } from '../imagenes/editar.svg';
import { ReactComponent as IconoBorrar } from '../imagenes/borrar.svg';
import Boton from '../elementos/Boton';
import borrarGasto from '../firebase/borrarGasto';

const ListaDeGastos = () => {
    // Obtenemos los gastos del servidor
    const [ gastos, obtenerMasGastos, hayMasPorCargar ] = useObtenerGastos();

    const formatearFecha = (fecha) => {
        // Funcion para editar una fecha de unix time a javascript

        // Obtenemos la fecha convertida a formato javascript
        // Formateamos la fecha javascript en un formato legible
        // Lo retornamos
        return format(fromUnixTime(fecha), "dd 'de' MMMM 'de' yyyy", {locale: es});
    }  
    
    const fechaEsIgual = (gastos, index, gasto) => {
        // Funcion para saber si una fecha es igual a otra

        if(index !== 0){
            // Si no nos encontramos en el primer elemento del arreglo de gastos => hacemos la comprobacion

            const fechaActual = formatearFecha(gasto.fecha);
            const fechaGastoAnterior = formatearFecha(gastos[index - 1].fecha);

            if(fechaActual === fechaGastoAnterior) {
                // Si la fecha es igual a la anterior => retornamos verdadero
                return true
            }
            else {
                // Si no es igual => retornamos falso
                return false
            }
        }
    }

    return(
        <>
            <Helmet>
                <title>Lista de Gastos</title>
            </Helmet>

            <Header>
                <BtnRegresar />
                <Titulo>Lista de Gastos</Titulo>
            </Header>

            <Lista>
                {
                    // Iteramos sobre el arreglo de gastos
                    gastos.map((gasto, index) => {
                        return(
                            <div key={gasto.id}>
                                {   
                                    // Si la fecha no es igual a la fecha del elemento anterior => mostramos la nueva fecha
                                    !fechaEsIgual(gastos, index, gasto) &&
                                        <Fecha>{formatearFecha(gasto.fecha)}</Fecha>
                                }
                                <ElementoLista>
                                    <Categoria>
                                        <IconoCategoria id={gasto.categoria}/>
                                        {gasto.categoria}
                                    </Categoria>

                                    <Descripcion>
                                        {gasto.descripcion}
                                    </Descripcion>

                                    <Valor>
                                        {convertirAMoneda(gasto.cantidad)}
                                    </Valor>

                                    <ContenedorBotones>
                                        <BotonAccion as={Link} to={`/editar/${gasto.id}`}>
                                            <IconoEditar />
                                        </BotonAccion>
                                        <BotonAccion onClick={() => borrarGasto(gasto.id)}>
                                            <IconoBorrar />
                                        </BotonAccion>
                                    </ContenedorBotones>
                                </ElementoLista>
                            </div> 
                        );
                    })
                }

                {   
                    // Si hay mas contenido por cargar => mostramos el boton
                    hayMasPorCargar &&
                    <ContenedorBotonCentral>
                        <BotonCargarMas
                            onClick={() => obtenerMasGastos()}
                        >
                            Cargar Más
                        </BotonCargarMas>
                    </ContenedorBotonCentral>
                }
                
                {   
                    // Si no hay ningun gasto en el arreglo => mostramos que no hay gastos por mostrar
                    gastos.length === 0 &&
                        <ContenedorSubtitulo>
                            <Subtitulo>No hay gastos por mostrar</Subtitulo>
                            <Boton as={Link} to='/'>Agregar Gasto</Boton>
                        </ContenedorSubtitulo>
                }
            </Lista>

            <BarraTotalGastado />
        </>
    )
}

export default ListaDeGastos;