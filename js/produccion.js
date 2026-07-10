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

    cambios[`productos/${idProducto}/cantidad_producida`] =
        (producto.cantidad_producida || 0) + cantidad;

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
    }, 1000);

}

document.getElementById("btn-reporte").addEventListener("click", generarReporte);
function generarReporte() {
    const contenedor = document.getElementById("reporte");
    const boton = document.getElementById("btn-reporte");
    if (contenedor.innerHTML !== "") {
        contenedor.innerHTML = "";
        boton.textContent = "Ver Reporte"; 
        return;
    }
    if (!productos) {
        contenedor.innerHTML = "No hay datos cargados";
        return;
    }

    const lista = Object.values(productos);
    const terminados  = lista.filter(prodt => prodt.tipo === "producto_terminado");

    terminados.sort((a,b) =>
        (b.cantidad_producida || 0) - (a.cantidad_producida || 0)
    );

    const top5 = terminados.slice(0,5);
    mostrarReporte(top5);
    boton.textContent = "Ocultar Reporte";
}

function mostrarReporte(lista) {
    const contenedor = document.getElementById("reporte");
    if(lista.length === 0) {
        contenedor.innerHTML = "<p>No hay produccion</p>"
        return;
    }
    let titulohtml = "<h3>Top 5 productos mas fabricados</h3>"
    lista.forEach(prodt => {
        titulohtml += `
        <div>
        <b style="color:#008fd1" >${prodt.nombre}</b><br>
        <p>
        Fabricados:
        <span style="font-weight:bold"> ${prodt.cantidad_producida || 0}<br><br> </span>
        </p>

        <u style="color:#008fd1" >Materia prima utilizada:</u>
        <ul>
        `;
        if(prodt.receta) {
            for (let ing in prodt.receta) {
                titulohtml += `<li>${ing}: ${prodt.receta[ing]} g</li>`;
            }
        } else {
            titulohtml += `<li>Sin receta</li>`;
        }
        titulohtml += `</ul></div>`;
    });

    contenedor.innerHTML = titulohtml;

}

