const { pool } = require('./config');


const obtenerJoyasFiltro = async ({precio_max, precio_min, categoria, metal, order_by})=>{
    let filtros = [];
    const values = [];
    const agregarFiltro = (campo, operador, valor) =>{
        values.push(valor);
        filtros.push(`${campo} ${operador} $${values.length}`);
    };
    
    if (precio_max) agregarFiltro('precio', '<=', precio_max);
    if (precio_min) agregarFiltro('precio', '>=', precio_min);
    if (categoria) agregarFiltro('categoria', '=', categoria);
    if (metal) agregarFiltro('metal', '=', metal);

    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0){
        consulta += ` WHERE ${filtros.join(' AND ')}`;
    }


    if (order_by) {
        const [campo, orden] = order_by.split('_');
        const validarCampos = ['precio', 'nombre', 'stock', 'categoria', 'metal'];
        const validarOrden = ['ASC', 'DESC'];

        if (validarCampos.includes(campo) && validarOrden.includes(orden)){
            consulta += ` ORDER BY ${campo} ${orden}`;
        }
    }

    const {rows} = await pool.query(consulta, values);
    return rows;
};

module.exports = { obtenerJoyasFiltro }; 