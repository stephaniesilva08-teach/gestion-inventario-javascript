const URL = "https://stock-flow-3accf-default-rtdb.firebaseio.com";
let productos = {};

cargarProductos();

async function cargarProductos() {

    const res = await fetch(`${URL}/productos.json`);
    productos = await res.json();

    const select = document.getElementById("select-prod");

    for (let id in productos) {

        if (productos[id].tipo == "producto_terminado") {

            select.innerHTML += `
                <option value="${id}">
                    ${productos[id].nombre}
                </option>
            `;

        }

    }

}

document.getElementById("form-prod").addEventListener("submit", fabricar);

async function fabricar(e) {

    e.preventDefault();

    mensajeError.textContent = "";
    mensajeexito.textContent = "";

    const idProducto = document.getElementById("select-prod").value;
    const cantidad = Number(document.getElementById("cant-fabricar").value);

    if (!idProducto || cantidad <= 0) {
        mensajeError.textContent = "Complete todos los campos.";
        return;
    }

    let producto = productos[idProducto];
    let cambios = {};
    let resumen = "";

    for (let ingrediente in producto.receta) {

        let gramos = producto.receta[ingrediente] * cantidad;

        let idMateria = Object.keys(productos).find(id =>
            productos[id].tipo == "materia_prima" &&
            productos[id].nombre.toLowerCase() == ingrediente.toLowerCase()
        );

        if (!idMateria) {
            mensajeError.textContent = `No existe ${ingrediente}.`;
            return;
        }

        if (productos[idMateria].stock < gramos) {
            mensajeError.textContent = `Stock insuficiente de ${ingrediente}.`;
            return;
        }

        cambios[`productos/${idMateria}/stock`] = productos[idMateria].stock - gramos;
        resumen += `${ingrediente}: ${gramos} g<br>`;
    }

    cambios[`productos/${idProducto}/stock`] =
        Number(producto.stock) + cantidad;

    cambios[`historial_produccion/proceso_${Date.now()}`] = {
        producto: producto.nombre,
        cantidad: cantidad,
        fecha: new Date().toLocaleDateString()
    };

    await fetch(`${URL}/.json`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cambios)
    });

    mensajeexito.innerHTML = `
        <b>Producción realizada</b><br><br>
        Producto: ${producto.nombre}<br>
        Cantidad: ${cantidad}<br><br>
        <b>Materia prima utilizada</b><br>
        ${resumen}
    `;

    document.getElementById("form-prod").reset();
    setTimeout(() => {
        location.href = "inventario.html";
    }, 5000);

}


