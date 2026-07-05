const URL_BASE = "https://stock-flow-3accf-default-rtdb.firebaseio.com";
let items = [];
let productosLista = []; // Tu arreglo global de control para el inventario

// --- EVENTO DE PRODUCT SUBMIT (Mantenido igual) ---
document.addEventListener("product.submit", (event) => {
    const item = event.detail;
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
    console.log("Producto guardado en LocalStorage:", item);
});

// --- CAPTURA DE ELEMENTOS DEL FORMULARIO ---
const boton = document.getElementById("login"); 
let idItemEnEdicion = localStorage.getItem("idItemEnEdicion");

// --- FORMULARIO DE REGISTRO / EDICIÓN ---
if (boton) {
    // Si existe una edición en marcha, auto-rellenamos los campos del formulario
    if (idItemEnEdicion) {
        const itemAEditar = JSON.parse(localStorage.getItem("itemAEditar"));
        
        if (itemAEditar) {
            if (document.getElementById("codigo")) document.getElementById("codigo").value = itemAEditar.codigo || "";
            if (document.getElementById("name")) document.getElementById("name").value = itemAEditar.nombre || "";
            if (document.getElementById("proveedor")) document.getElementById("proveedor").value = itemAEditar.proveedor || "";
            if (document.getElementById("stock")) document.getElementById("stock").value = itemAEditar.stock !== undefined ? itemAEditar.stock : 0;
            
            const selectTipo = document.getElementById("tipo");
            if (selectTipo) selectTipo.value = itemAEditar.tipo || "materia_prima";
            
            boton.textContent = "Guardar";
        }
    }

    boton.addEventListener("click", (e) => {
        e.preventDefault();

        // 1. Capturar los valores de texto limpiando espacios vacíos
        const inputCodigo = document.getElementById("codigo");
        const inputNombre = document.getElementById("name");
        const inputProveedor = document.getElementById("proveedor");
        const inputStock = document.getElementById("stock"); // Referencia directa al input corregido en HTML

        const codigo = inputCodigo ? inputCodigo.value.trim() : "";
        const nombre = inputNombre ? inputNombre.value.trim() : "";
        const proveedor = inputProveedor ? inputProveedor.value.trim() : "";
        
        const selectTipo = document.getElementById("tipo");
        const tipo = selectTipo ? selectTipo.value : "materia_prima";
        
        // 2. LEER LA CANTIDAD INGRESADA EN TIEMPO REAL
        let stockLeido = inputStock ? parseFloat(inputStock.value) : 0;
        if (isNaN(stockLeido)) stockLeido = 0;

        const mensaje = document.getElementById("mensajeError");
        const mensajeExito = document.getElementById("mensajeexito");

        // Validación estricta de campos vacíos o selección inválida
        if (codigo === "" || nombre === "" || proveedor === "" || tipo === "seleccione") {
            if (mensaje) {
                mensaje.textContent = "Por favor, llena todos los campos correctamente.";
                setTimeout(() => { mensaje.textContent = ""; }, 2000);
            }
            return;
        }

        if (mensaje) mensaje.textContent = "";

        // 3. DETERMINAR EL STOCK FINAL REAL
        let stockFinal = stockLeido; // Por defecto usa el valor ingresado en el formulario

        if (idItemEnEdicion) {
            // Si estamos editando, ignoramos el input de stock y mantenemos el saldo acumulado real que ya tenía en Firebase
            const itemOriginal = JSON.parse(localStorage.getItem("itemAEditar"));
            stockFinal = itemOriginal && itemOriginal.stock !== undefined ? parseFloat(itemOriginal.stock) : stockLeido;
        }

        const productos = {
            "codigo": codigo,
            "nombre": nombre,
            "proveedor": proveedor,
            "tipo": tipo, 
            "stock": stockFinal // Asegura que viaje como un número real (ej: 5, 12, etc.)
        };

        let urlDestino = `${URL_BASE}/productos.json`;
        let metodoHttp = "POST";

        if (idItemEnEdicion) {
            urlDestino = `${URL_BASE}/productos/${idItemEnEdicion}.json`;
            metodoHttp = "PUT"; 
        }

        fetch(urlDestino, {
            method: metodoHttp,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productos)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Producto procesado con éxito:", data);
            
            // Limpiar estados de edición al terminar con éxito
            localStorage.removeItem("idItemEnEdicion");
            localStorage.removeItem("itemAEditar");

            if (mensajeExito) {
                mensajeExito.textContent = idItemEnEdicion ? "Producto actualizado" : "Producto guardado";
            }

            setTimeout(() => { 
                if (mensajeExito) mensajeExito.textContent = "";
                window.location.href = "inventario.html"; 
            }, 2000);
        })
        .catch(err => {
            console.error("error: ", err);
            if (mensaje) {
                mensaje.textContent = "Error al procesar el producto.";
                setTimeout(() => { mensaje.textContent = ""; }, 2000);
            }
        });
    });
}

// --- LOGICA DE INTEGRACIÓN CON TU TABLA COMPONENTE ---
const tablaProductos = document.querySelector("tabla-usuarios");
const mensajeTabla = document.getElementById("mensaje-tabla");

if (tablaProductos) {
    // 1. Enviamos los parámetros de cabeceras requeridos por el componente genérico
    const configuracion = {
        titulo: "Gestión de Inventario",
        textoBoton: "+ Nuevo Producto",
        urlBoton: "../registro-producto.html" 
    };

    const columnas = [
        { key: "codigo", label: "Código" },
        { key: "nombre", label: "Nombre" },
        { key: "tipo", label: "Tipo" },
        { key: "proveedor", label: "Proveedor" },
        { key: "stock", label: "Saldo Stock" }
    ];

    tablaProductos.configurar(configuracion, columnas);

    // 2. Descarga de datos apuntando a productos.json
    async function cargarProductos() {
        try {
            const respuesta = await fetch(`${URL_BASE}/productos.json`);
            const datos = await respuesta.json();

            if (!datos) {
                productosLista = [];
                tablaProductos.datos = [];
                return;
            }

            // Mapeamos los elementos extrayendo el stock numérico real de Firebase
            productosLista = Object.keys(datos).map(idFirebase => ({
                idFirebase: idFirebase,
                codigo: datos[idFirebase].codigo || "S/C",
                nombre: datos[idFirebase].nombre || "Sin Nombre",
                proveedor: datos[idFirebase].proveedor || "Sin Proveedor",
                tipo: datos[idFirebase].tipo || "materia_prima",
                stock: datos[idFirebase].stock !== undefined ? parseFloat(datos[idFirebase].stock) : 0
            }));

            // ASIGNACIÓN CRÍTICA: Enviamos el arreglo completo al componente para que dibuje las filas
            tablaProductos.datos = productosLista;

        } catch (error) {
            console.error("Error al cargar productos en la tabla:", error);
        }
    }

    // 3. Escuchamos las acciones genéricas emitidas desde las filas del componente
    tablaProductos.addEventListener("eliminar-item", async (event) => {
        const productoAEliminar = event.detail;
        if (confirm(`¿Estás seguro de eliminar el producto ${productoAEliminar.nombre}?`)) {
            try {
                await fetch(`${URL_BASE}/productos/${productoAEliminar.idFirebase}.json`, { method: "DELETE" });
                
                // ¡AGREGAMOS EL MENSAJE EN PANTALLA AQUÍ!
                if (mensajeTabla) {
                    mensajeTabla.style.color = "green"; // Opcional: Rojo para eliminación
                    mensajeTabla.textContent = `Producto "${productoAEliminar.nombre}" eliminado.`;
                    setTimeout(() => { mensajeTabla.textContent = ""; }, 2000);
                }

                cargarProductos(); // Refresca las filas de la tabla
            } catch (error) {
                console.error("Error al eliminar producto:", error);
            }
        }
    });


    tablaProductos.addEventListener("editar-item", (event) => {
        const productoAEditar = event.detail;
        
        localStorage.setItem("idItemEnEdicion", productoAEditar.idFirebase);
        localStorage.setItem("itemAEditar", JSON.stringify(productoAEditar));

        window.location.href = "../registro-producto.html";
    });

    tablaProductos.addEventListener("aumentar-stock", async (event) => {
        const productoSeleccionado = event.detail;
        
        // Ventana prompt nativa para recolectar las existencias a sumar sobre el saldo de Firebase
        const cantidadIngresada = prompt(`Ingrese la cantidad de stock: ${productoSeleccionado.nombre}`);
        if (cantidadIngresada === null) return; 
        
        const cantidadUnidades = parseFloat(cantidadIngresada);
        if (isNaN(cantidadUnidades) || cantidadUnidades <= 0) {
            alert("Por favor, ingrese una cantidad numérica válida.");
            return;
        }

        const nuevoStockCalculado = parseFloat(productoSeleccionado.stock) + cantidadUnidades;

        try {
            await fetch(`${URL_BASE}/productos/${productoSeleccionado.idFirebase}.json`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stock: nuevoStockCalculado })
            });

            if (mensajeTabla) {
                mensajeTabla.textContent = `Stock de "${productoSeleccionado.nombre}" incrementado con éxito a ${nuevoStockCalculado}.`;
                setTimeout(() => { mensajeTabla.textContent = ""; }, 2000); 
            }

            cargarProductos(); // Refrescamos la UI con los nuevos saldos

        } catch (error) {
            console.error("Error al actualizar el stock:", error);
            alert("Ocurrió un error al actualizar el inventario.");
        }
    });

    cargarProductos();
}




