import { db } from './firebaseConfig';

const editarGasto = ({ id, categoria, descripcion, cantidad, fecha }) => {
    // Funcion para editar un gasto en el servidor

    // Accedemos al documento mediante su id en el servidor y lo editamos
    return db.collection('gastos').doc(id).update({
        categoria: categoria,
        descripcion: descripcion,
        cantidad: Number(cantidad),
        fecha: fecha
    });
}

export default editarGasto;