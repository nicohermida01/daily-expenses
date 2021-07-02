import React, { useState, useEffect, useContext } from 'react';

import useObtenerGastosDelMes from '../hooks/useObtenerGastosDelMes';

// creamos el contexto
const TotalGastadoContext = React.createContext();

// creamos el hook para acceder al provider
const useTotalDelMes = () => useContext(TotalGastadoContext);

// creamos el provider
const TotalGastadoProvider = ({ children }) => {
    // State para guardar el monto total gastado en el mes
    const [total, setTotal] = useState(0);

    // Obtenemos los gastos del mes mediante el hook
    const gastosDelMes = useObtenerGastosDelMes();

    useEffect(() => {
        // Funcion para calcular los gastos del mes una sola vez

        // calculamos el total
        let acumulado = 0;
        gastosDelMes.forEach((gasto) => {
            acumulado += gasto.cantidad;
        });

        // Guardamos el acumulado en total
        setTotal(acumulado);
    }, [gastosDelMes]);

    return(
        <TotalGastadoContext.Provider value={{total: total}}>
            {children}
        </TotalGastadoContext.Provider>
    );
}

export {TotalGastadoProvider, useTotalDelMes}