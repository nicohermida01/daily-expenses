import React from 'react';
import {Helmet} from 'react-helmet'
import { useParams } from 'react-router-dom';

import { Header, Titulo } from '../elementos/Header';
import BtnRegresar from '../elementos/BtnRegresar';
import BarraTotalGastado from './BarraTotalGastado';
import FormularioGasto from './FormularioGasto';
import useObtenerGasto from '../hooks/useObtenerGasto';

const EditarGasto = () => {
    // Obtenemos el id de los parametros de react router
    const { id } = useParams();
    // Obtenemos el gastos del servidr mediante su id
    const [ gasto ] = useObtenerGasto(id);

    return(
        <>
            <Helmet>
                <title>Editar Gasto</title>
            </Helmet>

            <Header>
                <BtnRegresar ruta='/lista'/>
                <Titulo>Editar Gasto</Titulo>
            </Header>

            <FormularioGasto gasto={gasto}/>

            <BarraTotalGastado />
        </>
    )
}

export default EditarGasto;