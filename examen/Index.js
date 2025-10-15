
const campus = require('./js/campus.js');
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const ip = '10.1.105.48';
const contraseña = "jeonjungkook";

// Middleware para parsear el cuerpo de las solicitudes
//configuracion de la base de datos
const pool1 = new Pool({
    user: 'postgres',
    host: ip,
    database: 'norte',
    password: contraseña,
    port: 5432,
});
const pool2 = new Pool({
    user: 'postgres',
    host: ip,
    database: 'centro',
    password: contraseña,
    port: 5432,
});
const pool3 = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Sur',
    password: 'codigo26',
    port: 5432,
});



// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//ruta
app.get("/Formulario", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'region.html'));
});

app.post("/registrar", async (req, res) => {
    const { fecha, cliente, producto, cantidad, total, region } = req.body;

    try {
        const pool = bd(region);
        probarConexion(pool);
        await pool.query(
            "INSERT INTO ventas (fecha,cliente,producto,cantidad,total,region) VALUES ($1, $2, $3, $4,$5, $6)",
            [fecha, cliente, producto, cantidad, total, region]);
        return res.redirect(`/ventas`);

    } catch (error) {
        console.error('Error al registrar el estudiante:', error);
        res.send('Error al registrar el estudiante');
    }
});


const bd = (campus) => {
    switch (campus) {
        case 'Norte':
            return pool1;
        case 'Centro':
            return pool2;
        case 'Sur':
            return pool3;
        default:
            break;
    }

}
// Asumiendo que ya tienes configurado tu Pool (dbPool)

async function probarConexion(dbPool) {
    let client;
    try {
        client = await dbPool.connect();
    } catch (error) {
        console.error("🚫 ¡ERROR DE CONEXIÓN A LA BASE DE DATOS! 🚫");
        res.send("🚫 ¡ERROR DE CONEXIÓN A LA BASE DE DATOS! 🚫");
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.error(`Verifica que PostgreSQL esté corriendo en '${dbPool.options.host}:${dbPool.options.port}'.`);
            res.send(`Verifica que PostgreSQL esté corriendo en '${dbPool.options.host}:${dbPool.options.port}'.`);
        }
        throw new Error("Fallo crítico: No se pudo establecer la conexión a la DB.");
    } finally {
        // Asegúrate siempre de liberar el cliente, si se obtuvo uno.
        if (client) {
            client.release();
        }
    }
}


app.use(campus);

// iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

/** 
// Manejar el envío del formulario
 *   app.post("/submit-form", (req, res) => {
 *      const { nombre, email } = req.body;
 *      res.send(`Formulario recibido. Nombre: ${nombre}, Email: ${email}`);
});
 * // Configurar la carpeta de vistas y el motor de plantillas
 *  app.set('views', path.join(__dirname, 'views'));
 *  app.set('view engine', 'ejs'); // Usando EJS como motor de plantillas

 */
