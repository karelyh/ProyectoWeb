// crear_tabla.js
const mysql = require('mysql2/promise');

// ⚠️ PEGA AQUÍ ABAJO LA URL QUE COPIASTE DE RAILWAY (dentro de las comillas)
const connectionString = "mysql://root:vvHBYnIiNcSVewmculicHfDfFKfFYgFP@shortline.proxy.rlwy.net:20053/railway"; 

async function crear() {
    console.log("⏳ Conectando a Railway...");
    
    // Conectamos
    const connection = await mysql.createConnection(connectionString);
    
    console.log("✅ Conexión exitosa. Creando tabla...");

    // La orden SQL para crear la tabla
    const sql = `
        CREATE TABLE IF NOT EXISTS productos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            categoria VARCHAR(100),
            precio DECIMAL(10,2),
            stock INT,
            imagen TEXT,
            descripcion TEXT
        );
    `;

    await connection.query(sql);
    
    console.log("🎉 ¡Tabla 'productos' creada con éxito!");
    console.log("Ya puedes cerrar esto y usar tu página.");
    process.exit();
}

crear().catch(err => {
    console.error("❌ Error:", err.message);
    process.exit(1);
});