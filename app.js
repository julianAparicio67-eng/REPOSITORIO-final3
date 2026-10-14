/*
  ====================================================================
  REFERENCIA: MOMENTO 1 - Servidor nativo con Node.js (Sin Express)
  (Bloque de código comentado para evitar conflictos con Express)
  ====================================================================

  const http = require('http');

  const servidorNativo = http.createServer((req, res) => {
    console.log('Llegó una petición:', req.method, req.url);

    if (req.method === 'GET' && req.url === '/') {
      res.end('Hola desde el servidor nativo');
    } 
    else if (req.method === 'GET' && req.url === '/actividades') {
      // A mano: hay que configurar el header de Content-Type y convertir a texto con JSON.stringify
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify([{ id: 1, nombre: 'Rafting' }]));
    } 
    else {
      // A mano: hay que asignar el statusCode explícitamente
      res.statusCode = 404;
      res.end('Ruta no encontrada');
    }
  });

  // Nota: Si quisieras probarlo en otro puerto (ej: 3001 para que no choque con Express):
  // servidorNativo.listen(3001, () => {
  //   console.log('Servidor nativo escuchando en http://localhost:3001');
  // });
*/





// app.js
const express = require('express');
const app = express();

app.use(express.json());

// Middleware de registro (Va ANTES de las rutas)
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// Datos de ejemplo en memoria (Momento 4)
const actividades = [
  { id: 1, nombre: 'Rafting en el río Fonce', tipo: 'agua', precio: 60000 },
  { id: 2, nombre: 'Parapente en el cañón', tipo: 'aire', precio: 180000 },
  { id: 3, nombre: 'Caminata Camino Real a Barichara', tipo: 'tierra', precio: 0 },
  { id: 4, nombre: 'Torrentismo en cascada', tipo: 'agua', precio: 70000 },
];

// Ruta principal
app.get('/', (req, res) => {
  res.send('API Aventuras San Gil funcionando');
});

// Ruta de actividades
app.get('/actividades', (req, res) => {
  console.log('query:', req.query);
  const { tipo } = req.query;
  if (!tipo) {
    return res.json(actividades);
  }
  const tipoMinuscula = tipo.toLowerCase();
  const filtradas = actividades.filter((a) => a.tipo.toLowerCase() === tipoMinuscula);
  res.json(filtradas);
});

// 5. Ruta POST
app.post('/actividades', (req, res) => {
  console.log('Body recibido:', req.body);
  const nueva = { id: actividades.length + 1, ...req.body };
  actividades.push(nueva);
  res.status(201).json(nueva);
});

// 4.1 Una sola actividad: req.params
app.get('/actividades/:id', (req, res) => {
  const id = Number(req.params.id);
  const actividad = actividades.find((a) => a.id === id);
  if (!actividad) {
    return res.status(404).json({ mensaje: `No existe la actividad con id ${req.params.id}` });
  }
  res.json(actividad);
});

// Configuración del puerto y arranque del servidor (SIEMPRE AL FINAL)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


// SIEMPRE de último, después de todas las rutas
app.use((req, res) => {
res.status(404).json({ mensaje: `No existe la ruta ${req.method} ${req.url}` });
});