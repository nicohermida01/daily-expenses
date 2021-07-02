import { db } from './firebaseConfig';

const agregarGasto = ({ categoria, descripcion, cantidad, fecha, uidUsuario }) => {
    // Funcion para agregar un gasto al servidor

    // Nos conectamos a la tabla de gastos (si no existe la crea)
    // Agregamos un documento con add
    // Retornamos la promesa que nos devuelve la funcion asincrona del lado del servidor
    return db.collection('gastos').add({
        categoria: categoria,
        descripcion: descripcion,
        cantidad: Number(cantidad),
        fecha: fecha,
        uidUsuario: uidUsuario
    });
}

export default agregarGasto;