const express = require('express');
const cors = require('cors');
const port = 3456;
const fs = require('fs');
const app = express();
require('dotenv').config();
const { obtenerJoyasFiltro } = require('./consultas');


app.use(express.json());
app.use(require('cors')());
app.use(require('helmet')());

const registrarActividad = (req, res, next) =>{
    const ahora = new Date().toISOString();
    const log = ` [${ahora}] Ruta consultada: ${req.method} ${req.path}\n`;

    console.log(log);
    fs.appendFileSync('reporte.log', log);
    next();
};

app.use(registrarActividad);


const cambiarHATEOAS = (joyas, limite)=>{
    return{
        total: joyas.length,
        results: joyas.slice(0, limite || joyas.length).map(j=>({
            name: j.nombre,
            href: `/joyas/${j.id}`,
        })),
    };
};


app.get('/joyas', async (req, res) =>{
    try{
        const {precio_max, precio_min, categoria, metal, limits} = req.query;

        const filtros = {
            precio_max: precio_max ? parseFloat(precio_max) : undefined,
            precio_min: precio_min ? parseFloat(precio_min) : undefined,
            categoria,
            metal,
        };


        const joyas = await obtenerJoyasFiltro(filtros);

        const limite = limits && !isNaN(limits) ? parseInt(limits) : undefined; 
        const HATEOAS = cambiarHATEOAS(joyas, limite);

        res.json(HATEOAS);
    }catch(error){
        res.status(500).json({ error: "Error al obtener las joyas", details: error.message }); 
    }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}
  visit: http://localhost:${port}`);
});