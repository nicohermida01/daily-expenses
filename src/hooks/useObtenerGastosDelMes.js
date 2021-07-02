import { useState, useEffect } from "react";
import { startOfMonth, endOfMonth, getUnixTime } from "date-fns";

import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../contextos/AuthContext';

const useObtenerGastosDelMes = () => {
    // Funcion que retorna todos los gastos del usuario en el mes acutal

    // State para almacenar los gastos
    const [gastos, setGastos] = useState([]);
    // Obtenemos la informacion de la sesion del usuario
    const { usuario } = useAuth();

    useEffect(() => {
        // Funcion para conectarnos al servidor una sola vez

        // Obtenemos la fecha de inicio y fin de mes
        // Convertimos la fecha en unix time
        const inicioDeMes = getUnixTime(startOfMonth(new Date()));
        const finDeMes = getUnixTime(endOfMonth(new Date()));

        if(usuario){
            // Si el usuario tiene la sesion iniciada => seguimos

            // Nos conectamos a la tabla gastos
            const unsuscribe = db.collection('gastos') // guardamos la funcion de desconexion 
            .orderBy('fecha', 'desc') // ordenamos el pedido por fecha en forma descendiente
            .where('fecha', '>=', inicioDeMes) 
            .where('fecha', '<=', finDeMes) // solo queremos los gastos que tengan la fecha entre inicioDeMes y finDeMes
            .where('uidUsuario', '==', usuario.uid) // solo queremos los gastos del usuario actual
            .onSnapshot((snapshot) => {

                // Iteramos sobre el arreglo de docs y guardamos los gastos dentro del arreglo de gastos
                setGastos(snapshot.docs.map((doc) => {
                    return {...doc.data(), id: doc.id}
                }));
            })

            // Ejecutamos la desconexion con el servidor al desmontarse el componente
            return unsuscribe;
        }
    }, [usuario]);

    return gastos;
}
 
export default useObtenerGastosDelMes;