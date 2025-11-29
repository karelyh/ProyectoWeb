let productos = []; // Ahora empieza vacío y se llena desde la BD
let productoSeleccionado = null;

const API_URL = '/api/productos'; // URL relativa al mismo servidor

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    // Event listener para cambiar el icono de categoría dinámicamente
    const selectCategoria = document.getElementById('AgregarCategoria');
    const iconoCategoria = document.getElementById('IconoCategoria');

    if (selectCategoria && iconoCategoria) {
        selectCategoria.addEventListener('change', function () {
            iconoCategoria.className = 'fa-solid IconoInput'; // Reset base classes

            if (this.value === 'Alimentos') iconoCategoria.classList.add('fa-bone');
            else if (this.value === 'Juguetes') iconoCategoria.classList.add('fa-futbol');
            else if (this.value === 'Higiene') iconoCategoria.classList.add('fa-soap');
            else if (this.value === 'Accesorios') iconoCategoria.classList.add('fa-gem');
            else iconoCategoria.classList.add('fa-carrot'); // Default
        });

        // Trigger inicial para asegurar que el icono coincida con el valor por defecto
        selectCategoria.dispatchEvent(new Event('change'));
    }
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
        if (prod.categoria === 'Juguetes') iconoCat = 'fa-futbol';
        if (prod.categoria === 'Higiene') iconoCat = 'fa-soap';
        if (prod.categoria === 'Alimentos') iconoCat = 'fa-bone';
        if (prod.categoria === 'Accesorios') iconoCat = 'fa-gem';

        // Lógica de color de stock
        let claseStock = '';
        if (prod.stock > 10) claseStock = 'StockVerde';
        else if (prod.stock >= 5) claseStock = 'StockAmarillo';
        else claseStock = 'StockRojo';

        card.innerHTML = `
            <div class="EncabezadoTarjeta">
                <div class="BadgeCategoria">
                    <i class="fa-solid ${iconoCat}"></i> ${prod.categoria}
                </div>
                <div class="BadgeStock ${claseStock}">${prod.stock} unidades</div>
                <img src="${prod.imagen}" alt="${prod.nombre}" class="ImagenProducto">
            </div>
            <div class="CuerpoTarjeta">
                <h4 class="TituloTarjeta">${prod.nombre}</h4>
                <p class="DescripcionTarjeta">${prod.descripcion}</p>
                
                <div class="PieTarjeta">
                    <div class="InfoPrecio">
                        <span class="EtiquetaPrecio">Precio</span>
                        <span class="ValorPrecio">$${parseFloat(prod.precio).toFixed(2)}</span>
                    </div>
                    <div class="AccionesTarjeta">
                        <button class="BtnIcono IconoEditar" onclick="prepararEditar(${prod.id}, event)">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="BtnIcono IconoEliminar" onclick="prepararEliminar(${prod.id}, event)">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedorReal.appendChild(card);
    });
}

// --- ACCIONES DIRECTAS DESDE TARJETA ---
function prepararEditar(id, event) {
    event.stopPropagation(); // Evita abrir el detalle
    const prod = productos.find(p => p.id === id);
    productoSeleccionado = prod;

    document.getElementById('EditarId').value = prod.id;
    document.getElementById('EditarNombre').value = prod.nombre;
    document.getElementById('EditarCategoria').value = prod.categoria;
    document.getElementById('EditarPrecio').value = prod.precio;
    document.getElementById('EditarStock').value = prod.stock;
    document.getElementById('EditarImagen').value = prod.imagen;
    document.getElementById('EditarDescripcion').value = prod.descripcion;

    abrirModal('ModalEditar');
}

function prepararEliminar(id, event) {
    event.stopPropagation(); // Evita abrir el detalle
    const prod = productos.find(p => p.id === id);
    productoSeleccionado = prod;

    document.getElementById('EliminarNombre').innerText = prod.nombre;
    document.getElementById('EliminarCategoria').innerText = prod.categoria;
    document.getElementById('EliminarPrecio').innerText = prod.precio;
    document.getElementById('EliminarStock').innerText = prod.stock;

    abrirModal('ModalEliminar');
}

// --- MODALES (Lógica visual igual) ---
function abrirModal(id) {
    document.getElementById(id).classList.add('Activo');
}

function cerrarModal(id) {
    document.getElementById(id).classList.remove('Activo');
    if (id === 'ModalAgregar') document.getElementById('FormularioAgregar').reset();
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
    if (prod.categoria === 'Juguetes') iconoCat = 'fa-futbol';
    if (prod.categoria === 'Accesorios') iconoCat = 'fa-gem';

    divCat.innerHTML = `<span class="BadgeCategoria"><i class="fa-solid ${iconoCat}"></i> ${prod.categoria}</span>`;

    // Lógica de color de stock para el modal
    let claseStock = '';
    if (prod.stock > 10) claseStock = 'StockVerde';
    else if (prod.stock >= 5) claseStock = 'StockAmarillo';
    else claseStock = 'StockRojo';

    const divStock = document.getElementById('DetalleStock');
    divStock.className = `IndicadorStock ${claseStock}`;
    divStock.innerHTML = `<i class="fa-solid fa-cube"></i> ${prod.stock} unidades`;

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

        if (res.ok) {
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

        if (res.ok) {
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

        if (res.ok) {
            cargarProductos();
            cerrarModal('ModalEliminar');
        }
    } catch (error) {
        alert("Error al eliminar");
    }
}