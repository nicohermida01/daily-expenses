const FormatearCantidad = (cantidad) => {
    // Funcion que formatea un valor numerico en formato moneda USD

    return new Intl.NumberFormat(
        'en-US',
        {style: 'currency', currency: 'USD', minimumFractionDigits: 2}
    ).format(cantidad);
}
 
export default FormatearCantidad;