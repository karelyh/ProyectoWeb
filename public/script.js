let productos = []; // Ahora empieza vacío y se llena desde la BD
let productoSeleccionado = null;

const API_URL = '/api/productos'; // URL relativa al mismo servidor

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});

// --- CONEXIÓN AL BACKEND ---

async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL);
        productos = await respuesta.json(); // Llenamos el array con datos reales de la BD
        renderizarProductos();
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// Renderizado (Igual que antes, pero usa el array actualizado)
function renderizarProductos() {
    const container = document.getElementById('products-container');
    const contador = document.getElementById('contador-productos');
    
    // Si no encuentras los IDs en el HTML, asegúrate que coincidan con script.js original
    // Nota: En tu HTML los IDs eran 'ContenedorProductos' y 'ContadorProductos'. 
    // Ajusto aquí para que coincida con tu HTML subido:
    const contenedorReal = document.getElementById('ContenedorProductos'); 
    const contadorReal = document.getElementById('ContadorProductos');

    contenedorReal.innerHTML = '';
    contadorReal.innerText = `Mostrando ${productos.length} productos`;

    productos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'TarjetaProducto';
        card.onclick = () => abrirDetalle(prod.id);

        let iconoCat = 'fa-paw';
        if (prod.categoria === 'Juguetes') iconoCat = 'fa-magnifying-glass'; // Ajusta según prefieras
        if (prod.categoria === 'Higiene') iconoCat = 'fa-soap';
        if (prod.categoria === 'Alimentos') iconoCat = 'fa-bone';

        card.innerHTML = `
            <div class="EncabezadoTarjeta">
                <div class="BadgeCategoria">
                    <i class="fa-solid ${iconoCat}"></i> ${prod.categoria}
                </div>
                <div class="BadgeStock">${prod.stock} unidades</div>
                <img src="${prod.imagen}" alt="${prod.nombre}" class="ImagenProducto">
            </div>
            <div class="CuerpoTarjeta">
                <h4 class="TituloTarjeta">${prod.nombre}</h4>
                <p class="DescripcionTarjeta">${prod.descripcion}</p>
            </div>
        `;
        contenedorReal.appendChild(card);
    });
}

// --- MODALES (Lógica visual igual) ---
function abrirModal(id) {
    document.getElementById(id).classList.add('Activo');
}

function cerrarModal(id) {
    document.getElementById(id).classList.remove('Activo');
    if(id === 'ModalAgregar') document.getElementById('FormularioAgregar').reset();
}

// --- VER DETALLE ---
function abrirDetalle(id) {
    const prod = productos.find(p => p.id === id);
    productoSeleccionado = prod;

    // IDs basados en tu HTML original
    document.getElementById('DetalleTitulo').innerText = prod.nombre;
    document.getElementById('DetalleImagen').src = prod.imagen;
    document.getElementById('DetallePrecio').innerText = `$${parseFloat(prod.precio).toFixed(2)}`;
    document.getElementById('DetalleDescripcion').innerText = prod.descripcion;
    
    // Categoría
    const divCat = document.getElementById('DetalleCategoria');
    let iconoCat = 'fa-paw';
    if (prod.categoria === 'Higiene') iconoCat = 'fa-soap';
    if (prod.categoria === 'Alimentos') iconoCat = 'fa-bone';
    
    divCat.innerHTML = `<span class="BadgeCategoria"><i class="fa-solid ${iconoCat}"></i> ${prod.categoria}</span>`;

    document.getElementById('DetalleStock').innerHTML = `<i class="fa-solid fa-cube"></i> ${prod.stock} unidades`;

    abrirModal('ModalDetalle');
}

// --- AGREGAR (POST) ---
async function guardarNuevoProducto(e) {
    e.preventDefault();

    const nuevo = {
        nombre: document.getElementById('AgregarNombre').value,
        categoria: document.getElementById('AgregarCategoria').value,
        precio: parseFloat(document.getElementById('AgregarPrecio').value),
        stock: parseInt(document.getElementById('AgregarStock').value),
        imagen: document.getElementById('AgregarImagen').value || "https://via.placeholder.com/150",
        descripcion: document.getElementById('AgregarDescripcion').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
        });

        if(res.ok) {
            cargarProductos(); // Recargar desde BD
            cerrarModal('ModalAgregar');
        }
    } catch (error) {
        alert("Error al guardar");
    }
}

// --- EDITAR (PUT) ---
function abrirEditarDesdeDetalle() {
    cerrarModal('ModalDetalle');
    document.getElementById('EditarId').value = productoSeleccionado.id;
    document.getElementById('EditarNombre').value = productoSeleccionado.nombre;
    document.getElementById('EditarCategoria').value = productoSeleccionado.categoria; // Select
    document.getElementById('EditarPrecio').value = productoSeleccionado.precio;
    document.getElementById('EditarStock').value = productoSeleccionado.stock;
    document.getElementById('EditarImagen').value = productoSeleccionado.imagen;
    document.getElementById('EditarDescripcion').value = productoSeleccionado.descripcion;
    abrirModal('ModalEditar');
}

async function guardarEdicion(e) {
    e.preventDefault();
    const id = document.getElementById('EditarId').value;
    
    const datosEditados = {
        nombre: document.getElementById('EditarNombre').value,
        categoria: document.getElementById('EditarCategoria').value,
        precio: parseFloat(document.getElementById('EditarPrecio').value),
        stock: parseInt(document.getElementById('EditarStock').value),
        imagen: document.getElementById('EditarImagen').value,
        descripcion: document.getElementById('EditarDescripcion').value
    };

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEditados)
        });

        if(res.ok) {
            cargarProductos();
            cerrarModal('ModalEditar');
        }
    } catch (error) {
        alert("Error al editar");
    }
}

// --- ELIMINAR (DELETE) ---
function confirmarEliminarDesdeDetalle() {
    cerrarModal('ModalDetalle');
    document.getElementById('EliminarNombre').innerText = productoSeleccionado.nombre;
    document.getElementById('EliminarCategoria').innerText = productoSeleccionado.categoria;
    document.getElementById('EliminarPrecio').innerText = productoSeleccionado.precio;
    document.getElementById('EliminarStock').innerText = productoSeleccionado.stock;
    abrirModal('ModalEliminar');
}

async function ejecutarEliminacion() {
    if (!productoSeleccionado) return;
    
    try {
        const res = await fetch(`${API_URL}/${productoSeleccionado.id}`, {
            method: 'DELETE'
        });

        if(res.ok) {
            cargarProductos();
            cerrarModal('ModalEliminar');
        }
    } catch (error) {
        alert("Error al eliminar");
    }
}