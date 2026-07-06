const URL = "https://stock-flow-3accf-default-rtdb.firebaseio.com";
const prod = JSON.parse(localStorage.getItem("producto_temporal_receta"));
if (!prod) window.location.href = "registro-producto.html";

document.getElementById("p-nombre").textContent = prod.nombre;

let insumos = [];
fetch(`${URL}/productos.json`)
    .then(res => res.json())
    .then(datos => {
        if (datos) {
            insumos = Object.keys(datos)
                .map(id => ({ nombre: datos[id].nombre, tipo: datos[id].tipo }))
                .filter(item => item.tipo === "materia_prima");
        }
        
        if (insumos.length === 0) {
            document.getElementById("error").textContent = "No hay materias primas.";
        } else {
            nuevaFila();
        }
    })
    .catch(() => {
        document.getElementById("error").textContent = "Error de conexión inicial.";
    });

function nuevaFila() {
    const lista = document.getElementById("lista");
    let opciones = `<option value="">Seleccione...</option>`;
    insumos.forEach(i => {
        opciones += `<option value="${i.nombre}">${i.nombre}</option>`;
    });
    const htmlFila = `
        <div class="fila" style="display: flex; gap: 10px; margin-bottom: 10px;">
            <select class="ing" required style="flex: 2;">${opciones}</select>
            <input type="number" class="cant" placeholder="Gramos" min="1" required style="flex: 1;" />
        </div>
    `;
    lista.insertAdjacentHTML("beforeend", htmlFila);
    reasignarEventosBorrar();
}

function reasignarEventosBorrar() {
    const botones = document.querySelectorAll(".btn-del");
    botones.forEach(btn => {
        const nuevoBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(nuevoBtn, btn);

        nuevoBtn.addEventListener("click", (e) => {
            const total = document.querySelectorAll(".fila").length;
            if (total > 1) {
                e.target.closest(".fila").remove();
            } else {
                document.getElementById("error").textContent = "Mínimo 1 ingrediente";
                setTimeout(() => { document.getElementById("error").textContent = ""; }, 2000);
            }
        });
    });
}

document.getElementById("btn-add").addEventListener("click", () => {
    if (insumos.length > 0) nuevaFila();
});

document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const ings = document.querySelectorAll(".ing");
    const cants = document.querySelectorAll(".cant");
    let receta = {}; 

    ings.forEach((select, i) => {
        if (select.value !== "") {
            const nombreIngrediente = select.value;
            const cantidadGramos = parseFloat(cants[i].value);
            receta[nombreIngrediente] = cantidadGramos; 
        }
    });

    if (Object.keys(receta).length === 0) {
        document.getElementById("error").textContent = "Agregue al menos un ingrediente.";
        return;
    }

    prod.receta = receta;

    fetch(`${URL}/productos.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod)
    })
    .then(res => {
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
    })
    .then(() => {
        localStorage.removeItem("producto_temporal_receta");
        document.getElementById("error").textContent = "";
        document.getElementById("exito").textContent = "Guardado";
        setTimeout(() => { 
            window.location.replace("inventario.html"); 
        }, 1200);
    })
    .catch((err) => {
        console.error("Detalle del error:", err);
        document.getElementById("error").textContent = "Error al guardar en Firebase.";
    });
});
