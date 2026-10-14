// app.js
const express = require('express');
const app = express();

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
const filtradas = actividades.filter((a) => a.tipo === tipo);
res.json(filtradas);
});

//4.1 Una sola actividad: req.params
app.get('/actividades/:id', (req, res) => {
const id = Number(req.params.id);
const actividad = actividades.find((a) => a.id === id);
if (!actividad) {
return res.status(404).json({ mensaje: `No existe la actividad con id ${req.params.id}`
});
}
res.json(actividad);
});


// Configuración del puerto y arranque del servidor (SIEMPRE AL FINAL)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

