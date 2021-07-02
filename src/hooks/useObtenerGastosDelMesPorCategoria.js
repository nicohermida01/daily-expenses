import { useEffect, useState } from "react";

import useObtenerGastosDelMes from "./useObtenerGastosDelMes";

const useObtenerGastosDelMesPorCategoria = () => {
    // Funcion para obtener los gastos del mes por categoria

    // State donde guardamos los gastos por categoria en un arreglo
    const [gastosPorCategoria, setGastosPorCategoria] = useState([]);

    // Obtenemos los gastos del mes desde el servidor
    const gastosDelMes = useObtenerGastosDelMes();

    useEffect(() => {
        // Obtenemos la suma de cada categoria y la guardamos
        const sumaDeGastos = gastosDelMes.reduce((objetoResultado, objetoActual) => {
            // Funcion para calcular los montos entre los distintos gastos dentro del arreglo

            // Obtenemos la categoria del gasto actual
            const categoriaActual = objetoActual.categoria;
            // Obtenemos el monto del gasto actual
            const cantidadActual = objetoActual.cantidad;

            // Sumamos el monto a la categoria correspondiente del objeto final que nos retorna la funcion
            objetoResultado[categoriaActual] += cantidadActual

            return objetoResultado;
        }, {
            // ObjetoResultado inicial
            'comida': 0,
            'cuentas y pagos': 0,
            'hogar': 0,
            'transporte': 0,
            'ropa': 0,
            'salud e higiene': 0,
            'compras': 0,
            'diversion': 0
        });

        // Construimos el arreglo final para devolver

        /* 0: {categoria: "comida", cantidad: 400}
        1: {categoria: "cuentas y pagos", cantidad: 0}
        2: {categoria: "hogar", cantidad: 500}
        3: {categoria: "transporte", cantidad: 0}
        4: {categoria: "ropa", cantidad: 1000}
        5: {categoria: "salud e higiene", cantidad: 0}
        6: {categoria: "compras", cantidad: 0}
        7: {categoria: "diversion", cantidad: 0} */

        setGastosPorCategoria(Object.keys(sumaDeGastos).map((elemento) => {
            return { categoria: elemento, cantidad: sumaDeGastos[elemento]}
        }));
    }, [setGastosPorCategoria, gastosDelMes]);
    
    return gastosPorCategoria;
}
 
export default useObtenerGastosDelMesPorCategoria;