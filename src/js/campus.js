const express = require('express');
const path = require('path');
const app1 = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const ip = '10.1.105.82';
const contraseña = "jeonjungkook";
//

// Middleware para parsear el cuerpo de las solicitudes
app1.use(bodyParser.urlencoded({ extended: true }));
app1.use(bodyParser.json());

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



const tablas = (bd) => {
    let html = `
        <!DOCTYPE html> 
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listado de Estudiantes</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
        
        </head>
        <body class="container mt-5">
        <div>
            <div class="btn-group" role="group" aria-label="Basic example">
                    <a href="/ventas" type="submit" class="btn btn-primary">Mostrar</a>
                    <a href="/total" type="submit" class="btn btn-primary">Total</a>
                    <a href="/productos" type="submit" class="btn btn-primary">Demanda</a>
                    <a href="/mes" type="submit" class="btn btn-primary">VentaMes</a>
                    <a href="/cliente" type="submit" class="btn btn-primary">Buscar Cliente</a>
                </div>

        </div>
        <h2 class="mb-4">Listado de regiones</h2>
        <!-------Tabla con los registrpos de la consulta -------->
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>cliente</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Región</th>
                    
                </tr>
            </thead> 
            <tbody>
        `;
    bd.rows.forEach(rg => {
        html += `
            <tr>
                <td>${rg.id_venta}</td>
                <td>${rg.fecha.toISOString().split('T')[0]}</td>
                <td>${rg.cliente}</td>
                <td>${rg.producto}</td>
                <td>${rg.cantidad}</td>
                <td>$${parseFloat(rg.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td>${rg.region}</td>
                
            </tr>
            `;

    });
    html += `           
            </tbody>
            </table>

            </body>
            </html>`;
    return html;
}

app1.get("/ventas", async (req, res) => {
    try {
        const result1 = await pool1.query(" SELECT * FROM ventas");
        const result2 = await pool2.query(" SELECT * FROM ventas");
        const result3 = await pool3.query(" SELECT * FROM ventas");
        const result = { rows: [...result1.rows, ...result2.rows, ...result3.rows] };
        html = tablas(result);
        res.send(html);
    } catch (error) {
        console.error(error);
        res.send('Error al obtener los estudiantes');

    }
});

app1.get("/total", async (req, res) => {
    try {
        const result1 = await pool1.query("SELECT 'Norte' AS region, SUM(total) AS total_venta FROM ventas");
        const result2 = await pool2.query("SELECT 'Centro' AS region, SUM(total) AS total_venta FROM ventas");
        const result3 = await pool3.query("SELECT 'Sur' AS region, SUM(total) AS total_venta FROM ventas");
        const result = { rows: [...result1.rows, ...result2.rows, ...result3.rows] };

        let html = `
        <!DOCTYPE html> 
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listado de Estudiantes</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
        </head>
        <body class="container mt-5">
        <div>
            <div class="btn-group" role="group" aria-label="Basic example">
                    <a href="/ventas" type="submit" class="btn btn-primary">Mostrar</a>
                    <a href="/total" type="submit" class="btn btn-primary">Total</a>
                    <a href="/productos" type="submit" class="btn btn-primary">Demanda</a>
                    <a href="/mes" type="submit" class="btn btn-primary">VentaMes</a>
                    <a href="/cliente" type="submit" class="btn btn-primary">Buscar Cliente</a>
                </div>

        </div>
        <h2 class="mb-4">Listado de regiones</h2>
        <!-------Tabla con los registrpos de la consulta -------->
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>Region</th>
                    <th>Total de Ventas</th>
                </tr>
            </thead> 
            <tbody>
        `;
        result.rows.forEach(rg => {
            html += `
            <tr>
                <td>${rg.region}</td>
                <td>$${parseFloat(rg.total_venta).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                
            </tr>
            `;
        });
        html += `           
            </tbody>
            </table>
            </body>
            </html>`;
        res.send(html);
    } catch (error) {

    }
}
)
app1.get("/mes", async (req, res) => {
    try {
        let html = `
        <!DOCTYPE html> 
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ventas por Mes</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
        </head>
        <body class="container mt-5">
        <div>
            <div class="btn-group" role="group" aria-label="Basic example">
                    <a href="/ventas" type="submit" class="btn btn-primary">Mostrar</a>
                    <a href="/total" type="submit" class="btn btn-primary">Total</a>
                    <a href="/productos" type="submit" class="btn btn-primary">Demanda</a>
                    <a href="/mes" type="submit" class="btn btn-primary">VentaMes</a>
                    <a href="/cliente" type="submit" class="btn btn-primary">Buscar Cliente</a>
                </div>
            
        </div>

        <h2 class="mb-4">Ventas por Mes y Región</h2>

        <!-- Formulario de filtros -->
        <form method="GET" action="/mes" class="row g-3 mb-4">
            <div class="col-md-4">
                <label for="region" class="form-label">Región:</label>
                <select name="region" id="region" class="form-select">
                    <option value="">Todas las regiones</option>
                    <option value="Norte" ${req.query.region === 'Norte' ? 'selected' : ''}>Norte</option>
                    <option value="Centro" ${req.query.region === 'Centro' ? 'selected' : ''}>Centro</option>
                    <option value="Sur" ${req.query.region === 'Sur' ? 'selected' : ''}>Sur</option>
                </select>
            </div>
            <div class="col-md-4">
                <label for="mes" class="form-label">Mes:</label>
                <select name="mes" id="mes" class="form-select">
                    <option value="">Todos los meses</option>
                    <option value="01" ${req.query.mes === '01' ? 'selected' : ''}>Enero</option>
                    <option value="02" ${req.query.mes === '02' ? 'selected' : ''}>Febrero</option>
                    <option value="03" ${req.query.mes === '03' ? 'selected' : ''}>Marzo</option>
                    <option value="04" ${req.query.mes === '04' ? 'selected' : ''}>Abril</option>
                    <option value="05" ${req.query.mes === '05' ? 'selected' : ''}>Mayo</option>
                    <option value="06" ${req.query.mes === '06' ? 'selected' : ''}>Junio</option>
                    <option value="07" ${req.query.mes === '07' ? 'selected' : ''}>Julio</option>
                    <option value="08" ${req.query.mes === '08' ? 'selected' : ''}>Agosto</option>
                    <option value="09" ${req.query.mes === '09' ? 'selected' : ''}>Septiembre</option>
                    <option value="10" ${req.query.mes === '10' ? 'selected' : ''}>Octubre</option>
                    <option value="11" ${req.query.mes === '11' ? 'selected' : ''}>Noviembre</option>
                    <option value="12" ${req.query.mes === '12' ? 'selected' : ''}>Diciembre</option>
                </select>
            </div>
            <div class="col-md-4">
                <label for="anio" class="form-label">Año:</label>
                <input type="text" name="anio" id="anio" class="form-control" placeholder="2024" value="${req.query.anio || ''}">
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-success">Filtrar</button>
                <a href="/mes" class="btn btn-secondary">Limpiar filtros</a>
            </div>
        </form>
        `;

        // Construir la consulta SQL con filtros
        let whereConditions = [];
        let queryParams = [];
        let paramCounter = 1;

        if (req.query.mes) {
            whereConditions.push(`EXTRACT(MONTH FROM fecha) = $${paramCounter}`);
            queryParams.push(parseInt(req.query.mes));
            paramCounter++;
        }

        if (req.query.anio) {
            whereConditions.push(`EXTRACT(YEAR FROM fecha) = $${paramCounter}`);
            queryParams.push(parseInt(req.query.anio));
            paramCounter++;
        }

        let whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // Consultas a cada base de datos
        let resultRows = [];

        // Solo consultar la región seleccionada o todas si no hay filtro
        if (!req.query.region || req.query.region === 'Norte') {
            const query1 = `SELECT 'Norte' AS region, TO_CHAR(fecha, 'MM-YYYY') AS anio_mes, SUM(total) AS venta_mensual 
                           FROM ventas 
                           ${whereClause}
                           GROUP BY TO_CHAR(fecha, 'MM-YYYY')`;
            const result1 = await pool1.query(query1, queryParams);
            resultRows = [...resultRows, ...result1.rows];
        }

        if (!req.query.region || req.query.region === 'Centro') {
            const query2 = `SELECT 'Centro' AS region, TO_CHAR(fecha, 'MM-YYYY') AS anio_mes, SUM(total) AS venta_mensual 
                           FROM ventas 
                           ${whereClause}
                           GROUP BY TO_CHAR(fecha, 'MM-YYYY')`;
            const result2 = await pool2.query(query2, queryParams);
            resultRows = [...resultRows, ...result2.rows];
        }
        if (!req.query.region || req.query.region === 'Sur') {
            const query3 = `SELECT 'Sur' AS region, TO_CHAR(fecha, 'MM-YYYY') AS anio_mes, SUM(total) AS venta_mensual 
                            FROM ventas 
                            ${whereClause}
                            GROUP BY TO_CHAR(fecha, 'MM-YYYY')`;
            const result3 = await pool3.query(query3, queryParams);
            resultRows = [...resultRows, ...result3.rows];
        }

        // Mostrar resultados
        html += `
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>Región</th>
                    <th>Fecha</th>
                    <th>Ventas por mes</th>
                </tr>
            </thead> 
            <tbody>
        `;

        if (resultRows.length > 0) {
            resultRows.forEach(rg => {
                html += `
                <tr>
                    <td>${rg.region}</td>
                    <td>${rg.anio_mes}</td>
                    <td>$${parseFloat(rg.venta_mensual).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                </tr>
                `;
            });
        } else {
            html += `
            <tr>
                <td colspan="3" class="text-center">No se encontraron resultados para los filtros seleccionados</td>
            </tr>
            `;
        }

        html += `           
            </tbody>
            </table>
            </body>
            </html>`;

        res.send(html);

    } catch (error) {
        console.error('Error en /mes:', error);
        res.status(500).send('Error al obtener las ventas por mes');
    }
});

app1.get("/productos", async (req, res) => {
    try {
        const result1 = await pool1.query(" SELECT producto, SUM(cantidad) AS total_cantidad FROM ventas GROUP BY producto ORDER BY total_cantidad DESC");
        const result2 = await pool2.query(" SELECT producto, SUM(cantidad) AS total_cantidad FROM ventas GROUP BY producto ORDER BY total_cantidad DESC");
        const result3 = await pool3.query(" SELECT producto, SUM(cantidad) AS total_cantidad FROM ventas GROUP BY producto ORDER BY total_cantidad DESC");
        const result = { rows: [...result1.rows, ...result2.rows, ...result3.rows] };

        const productosMap = new Map();

        result.rows.forEach(row => {
            const producto = row.producto;
            const cantidad = Number(row.total_cantidad);
            if (productosMap.has(producto)) {
                productosMap.set(producto, productosMap.get(producto) + cantidad);
            } else {
                productosMap.set(producto, cantidad);
            }
        });

        //arrgleo
        const productosTotales = Array.from(productosMap, ([producto, total_cantidad]) => ({ producto, total_cantidad }))
            .sort((a, b) => b.total_cantidad - a.total_cantidad);

        let html = `
        <!DOCTYPE html> 
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listado de Estudiantes</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
        </head>
        <body class="container mt-5">
        <div>
            <div class="btn-group" role="group" aria-label="Basic example">
                <a href="/ventas" type="submit" class="btn btn-primary">Mostrar</a>
                <a href="/total" type="submit" class="btn btn-primary">Total</a>
                <a href="/productos" type="submit" class="btn btn-primary">Demanda</a>
                <a href="/mes" type="submit" class="btn btn-primary">VentaMes</a>
                <a href="/cliente" type="submit" class="btn btn-primary">Buscar Cliente</a>
            </div>
        </div>
        <h2 class="mb-4">Listado de productos</h2>
        <!-------Tabla con los registrpos de la consulta -------->
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>Producto</th>
                    <th>Total Cantidad Vendida</th>
                </tr>
            </thead> 
            <tbody>
        `;
        productosTotales.forEach(rg => {
            html += `
            <tr>
                <td>${rg.producto}</td>
                <td>${rg.total_cantidad}</td>
            </tr>            
            `;
        });
        html += `           
            </tbody>
            </table>
            </body>
            </html>`;
        res.send(html);
    } catch (error) {
        console.error(error);
        res.send('Error al obtener los estudiantes');
    }
});
app1.get("/cliente", async (req, res) => {
    html = `
        <!DOCTYPE html> 
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Buscar Cliente</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
        </head>
        <body class="container mt-5">
            <div>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <a href="/ventas" type="submit" class="btn btn-primary">Mostrar</a>
                    <a href="/total" type="submit" class="btn btn-primary">Total</a>
                    <a href="/productos" type="submit" class="btn btn-primary">Demanda</a>
                    <a href="/mes" type="submit" class="btn btn-primary">VentaMes</a>
                    <a href="/cliente" type="submit" class="btn btn-primary">Buscar Cliente</a>
                </div>
            </div>

            <div class="card mt-5" style="max-width: 500px; margin: 0 auto;">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">Buscar Ventas por Cliente</h5>
                </div>
                <div class="card-body">
                    <form id="formBuscarCliente">
                        <div class="mb-3">
                            <label for="nombreCliente" class="form-label">Nombre del Cliente:</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="nombreCliente" 
                                name="nombreCliente" 
                                placeholder="Ingresa el nombre del cliente"
                                required
                            >
                        </div>
                        <button type="button" class="btn btn-success w-100" onclick="buscarCliente()">
                            <i class="bi bi-search"></i> Buscar
                        </button>
                    </form>
                </div>
            </div>

            <!-- Tabla de resultados (inicialmente oculta) -->
            <div id="resultadosDiv" class="mt-5" style="display: none;">
                <h3 id="tituloBusqueda"></h3>
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th>Región</th>
                            </tr>
                        </thead> 
                        <tbody id="tablaResultados">
                        </tbody>
                    </table>
                </div>
            </div>

            <script>
                async function buscarCliente() {
                    const nombre = document.getElementById('nombreCliente').value;
                    
                    if (nombre.trim() === '') {
                        alert('Por favor ingresa un nombre de cliente');
                        return;
                    }

                    try {
                        const response = await fetch(\`/api/cliente/\${encodeURIComponent(nombre)}\`);
                        const data = await response.json();

                        if (data.success) {
                            mostrarResultados(nombre, data.resultados);
                        } else {
                            alert('Error: ' + data.mensaje);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('Error al buscar el cliente');
                    }
                }

                function mostrarResultados(nombreCliente, resultados) {
                    const tituloBusqueda = document.getElementById('tituloBusqueda');
                    const tablaResultados = document.getElementById('tablaResultados');
                    const resultadosDiv = document.getElementById('resultadosDiv');

                    tituloBusqueda.textContent = \`Ventas del Cliente: \${nombreCliente}\`;
                    tablaResultados.innerHTML = '';

                    if (resultados.length === 0) {
                        tablaResultados.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No se encontraron ventas para este cliente</td></tr>';
                    } else {
                        resultados.forEach(venta => {
                            const fecha = new Date(venta.fecha).toISOString().split('T')[0];
                            tablaResultados.innerHTML += \`
                                <tr>
                                    <td>\${venta.id_venta}</td>
                                    <td>\${fecha}</td>
                                    <td>\${venta.cliente}</td>
                                    <td>\${venta.producto}</td>
                                    <td>\${venta.cantidad}</td>
                                    <td>\${parseFloat(venta.total).toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}</td>
                                    <td>\${venta.region}</td>
                                </tr>
                            \`;
                        });
                    }

                    resultadosDiv.style.display = 'block';
                }

                // Permitir buscar presionando Enter
                document.getElementById('nombreCliente').addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        buscarCliente();
                    }
                });
            </script>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;
    res.send(html);
});

// Ruta API para buscar clientes
app1.get("/api/cliente/:nombre", async (req, res) => {
    const nombre = req.params.nombre;

    try {
        const result1 = await pool1.query("SELECT * FROM ventas WHERE LOWER(cliente) LIKE LOWER($1)", [`%${nombre}%`]);
        const result2 = await pool2.query("SELECT * FROM ventas WHERE LOWER(cliente) LIKE LOWER($1)", [`%${nombre}%`]);
        const result3 = await pool3.query("SELECT * FROM ventas WHERE LOWER(cliente) LIKE LOWER($1)", [`%${nombre}%`]);

        const resultados = [...result1.rows, ...result2.rows, ...result3.rows];

        res.json({
            success: true,
            resultados: resultados,
            total: resultados.length
        });
    } catch (error) {
        console.error('Error al buscar cliente:', error);
        res.json({
            success: false,
            mensaje: 'Error al obtener las ventas del cliente'
        });
    }
});
module.exports = app1;