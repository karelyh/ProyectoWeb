require('dotenv').config(); // <--- AGREGA ESTO AL INICIO
// npm install dote
// npm start, para la terminal
console.log("--> LA URL ES:", process.env.MYSQL_URL);
const express = require('express');
const mysql = require('mysql2/promise'); // Usamos la versión con promesas
const cors = require('cors');
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// RUTA PRINCIPAL: Cuando entres a la web, devuelve el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conexión a Base de Datos MySQL
// Railway nos dará la variable MYSQL_URL
const pool = mysql.createPool(process.env.MYSQL_URL || process.env.DATABASE_URL);

// --- RUTAS (API) ---

// 1. OBTENER todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos ORDER BY id ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. CREAR un producto
app.post('/api/productos', async (req, res) => {
    const { nombre, categoria, precio, stock, imagen, descripcion } = req.body;
    try {
        const query = `
            INSERT INTO productos (nombre, categoria, precio, stock, imagen, descripcion)
            VALUES (?, ?, ?, ?, ?, ?)`; // MySQL usa '?'
        const values = [nombre, categoria, precio, stock, imagen, descripcion];
        
        const [result] = await pool.query(query, values);
        
        // Devolvemos el objeto creado con su nuevo ID
        res.json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. EDITAR un producto
app.put('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, precio, stock, imagen, descripcion } = req.body;
    try {
        const query = `
            UPDATE productos 
            SET nombre=?, categoria=?, precio=?, stock=?, imagen=?, descripcion=?
            WHERE id=?`;
        const values = [nombre, categoria, precio, stock, imagen, descripcion, id];
        
        await pool.query(query, values);
        res.json({ id, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ELIMINAR un producto
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        res.json({ message: "Producto eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor MySQL corriendo en puerto ${port}`);
});