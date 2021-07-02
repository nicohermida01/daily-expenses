import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { db } from '../firebase/firebaseConfig';

const useObtenerGasto = (id) => {
    // Funcion para obtener un gasto mediante su id y retornarlo

    // Constante para redireccionar
    const history = useHistory();
    // State donde guardamos el gasto
    const [gasto, setGasto] = useState('');

    useEffect(() => {
        // Funcion para conectarnos al servidor al cargar el componente

        // Nos conectamos al servidor y accedemos al documento por su id y lo obtenemos
        db.collection('gastos').doc(id).get()
        .then((doc) => {
            // Funcion que se ejecuta si se pudo obtener el documento

            if(doc.exists){
                // Si el documento existe => establecemos el gasto
                setGasto(doc);
            }
            else{
                // Si el documento no existe (id incorrecto) => lo redireccionamos
                history.push('/lista')
            }
        })
    }, [history, id]);

    return [gasto];
}
 
export default useObtenerGasto;