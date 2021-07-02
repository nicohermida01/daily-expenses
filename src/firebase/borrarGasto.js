import { db } from './firebaseConfig';

const borrarGasto = (id) => {
    // Funcion para borrar un gasto del usuario del servidor
    
    // Nos conectamos al servidor y accedemos al documento por su id y lo borramos
    db.collection('gastos').doc(id).delete();
}

export default borrarGasto;