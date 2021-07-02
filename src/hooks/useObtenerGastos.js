import { useState, useEffect } from 'react';

import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../contextos/AuthContext';

const useObtenerGastos = () => {
    // Funcion que se conecta con el servidor y retorna los gastos del usuario

    // State donde tenemos todos los gastos traidos del servidor
    const [gastos, setGastos] = useState([]);
    // Obtenemos la informacion de la sesion del usuario actual
    const { usuario } = useAuth();
    // State donde guardamos el ultimo gasto traido del servidor
    const [ultimoGasto, setUltimoGasto] = useState(null);
    // State donde guardamos si hay mas gastos por cargar
    const [hayMasPorCargar, sethayMasPorCargar] = useState(false);

    const obtenerMasGastos = () => {
        // Funcion para obtener mas gastos del servidor (boton 'Cargar Más')

        db.collection('gastos') 
        .where('uidUsuario', '==', usuario.uid) 
        .orderBy('fecha', 'desc') 
        .limit(10) 
        .startAfter(ultimoGasto) // Devuelve los gastos a partir del ultimo que tenemos
        .onSnapshot((snapshot) => {
            if(snapshot.docs.length > 0){
                // Si hay gastos por cargar

                // Guardamos el ultimo gasto traido
                setUltimoGasto(snapshot.docs[snapshot.docs.length -1]);
                
                // Iteramos sobre los gastos traidos para agregarlos al arreglo de gastos
                setGastos(gastos.concat(snapshot.docs.map((gasto) => {
                    return {...gasto.data(), id: gasto.id}
                })));
            }
            else {
                // Si no hay gastos por cargar

                // Establecemos que no hay mas gastos por cargar
                sethayMasPorCargar(false);
            }
        })

    }

    useEffect(() => {
        // Nos conectamos al servidor mediante un effect que se ejecuta cuando carga el componente o cuando cambia el usuario

        // Guardamos la funcion que nos devuelve firestore para cerrar la conexion con el servidor
        const unsuscribe = db.collection('gastos') // nos conectamos a la tabla gastos
        .where('uidUsuario', '==', usuario.uid) // Queremos obtener solamente los gastos del usuario actual
        .orderBy('fecha', 'desc') // Ordenamos los gastos en orden descendiente por fecha
        .limit(10) // Solamente traemos de a 10 gastos
        .onSnapshot((snapshot) => { // obtenemos el snapshot

            if(snapshot.docs.length > 0){
                // Si tenemos gastos por cargar

                // Guardamos el ultimo gasto traido
                setUltimoGasto(snapshot.docs[snapshot.docs.length -1]);
                // Establecemos que hay mas gastos por cargar
                sethayMasPorCargar(true);
            }
            else {
                // Si ya no hay mas gastos por cargar

                // Establecemos que no hay mas gastos por cargar
                sethayMasPorCargar(false);
            }

            // Guardamos los gastos en el arreglo de gastos
            setGastos(snapshot.docs.map((gasto) => {
                return {...gasto.data(), id: gasto.id}
            }))
        })

        // cerramos la conexion con el servidor al desmontar el componente
        return unsuscribe
    }, [usuario]);

    return [gastos, obtenerMasGastos, hayMasPorCargar];
}
 
export default useObtenerGastos;