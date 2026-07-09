const URL_BASE = "https://stock-flow-3accf-default-rtdb.firebaseio.com";
let items = [];
let usuariosLista = []; 

document.addEventListener("product.submit", (event) => {
    const item = event.detail;
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
    console.log("Producto guardado en LocalStorage:", item);
});

const boton = document.getElementById("login");

let idUsuarioEnEdicion = localStorage.getItem("idUsuarioEnEdicion");

if (boton) {
    if (idUsuarioEnEdicion) {
        const usuarioAEditar = JSON.parse(localStorage.getItem("usuarioAEditar"));
        
        if (usuarioAEditar) {
            document.getElementById("identificacion").value = usuarioAEditar.identificacion || "";
            document.getElementById("username").value = usuarioAEditar.name || "";
            document.getElementById("cargo").value = usuarioAEditar.cargo || "";
            document.getElementById("password").value = usuarioAEditar.password || "";
            document.getElementById("confirmarPassword").value = usuarioAEditar.password || "";
            
            boton.textContent = "Guardar";
        }
    }

    boton.addEventListener("click", (e) => {
        e.preventDefault();

        const identificacion = document.getElementById("identificacion").value.trim();
        const contraseña = document.getElementById("password").value.trim();
        const nombre = document.getElementById("username").value.trim();
        const cargo = document.getElementById("cargo").value.trim();
        const confirmacion = document.getElementById("confirmarPassword").value.trim();
        const mensaje = document.getElementById("mensajeError");
        const mensajeExito = document.getElementById("mensajeexito");

        if (!identificacion || !contraseña || !nombre || !cargo || !confirmacion) {
            mensaje.textContent = "Por favor, llena todos los campos.";
            return;
        }

        if (contraseña !== confirmacion) {
            mensaje.textContent = "Las contraseñas no coinciden.";
            document.getElementById("password").value = ""; 
            document.getElementById("confirmarPassword").value = ""; 
            return;
        }
        
        mensaje.textContent = "";

        const usuario = {
            "identificacion": identificacion,
            "password": contraseña,
            "name": nombre,
            "cargo": cargo,
        };

        let urlDestino = `${URL_BASE}/usuarios.json`;
        let metodoHttp = "POST";

        if (idUsuarioEnEdicion) {
            urlDestino = `${URL_BASE}/usuarios/${idUsuarioEnEdicion}.json`;
            metodoHttp = "PUT"; 
        }

        fetch(urlDestino, {
            method: metodoHttp,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        })
        .then(res => res.json())
        .then(data => {
            console.log("usuario guardado: ", data);
            mensajeExito.textContent = idUsuarioEnEdicion ? "Usuario actualizado" : "Usuario registrado";
            
            localStorage.removeItem("idUsuarioEnEdicion");
            localStorage.removeItem("usuarioAEditar");

            setTimeout(() => {
                if(idUsuarioEnEdicion){
                    window.location.href = "../usuarios.html";
                    return;
                } else {
                    const vienelogin = localStorage.getItem("desdelogin");
                    if (vienelogin){
                        localStorage.removeItem("desdelogin");
                        window.location.href = "/index.html";
                        return;
                    } else {
                        window.location.href = "../usuarios.html"
                        return;
                    }
                } }, 1000);
        })
        .catch(err => {
            console.error("Error: ", err);
            mensaje.textContent = "Error al registrar usuario.";
        });
    });
}

const tablaComponente = document.querySelector("tabla-usuarios");
const mensajeTabla = document.getElementById("mensaje-tabla"); 

const deleteUser = async (idFirebase, identificacion) => {
    try {
        await fetch(`${URL_BASE}/usuarios/${idFirebase}.json`, {
            method: "DELETE"
        });
        usuariosLista = usuariosLista.filter((u) => u.idFirebase !== idFirebase);
        localStorage.setItem("usuarios", JSON.stringify(usuariosLista));
        if (tablaComponente) {
            tablaComponente.datos = usuariosLista;
        }
        if (mensajeTabla) {
            mensajeTabla.textContent = `Usuario eliminado`;
            setTimeout(() => { mensajeTabla.textContent = ""; }, 3000);
        }

    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        if (mensajeTabla) {
            mensajeTabla.textContent = "Error al eliminar usuario.";
        }
    }
};

async function cargarUsuarios() {
    try {
        const respuesta = await fetch(`${URL_BASE}/usuarios.json`);
        const datos = await respuesta.json();

        if (!datos) {
            usuariosLista = [];
            tablaComponente.datos = [];
            return;
        }

        usuariosLista = Object.keys(datos).map(idFirebase => ({
            idFirebase: idFirebase,
            identificacion: datos[idFirebase].identificacion,
            name: datos[idFirebase].name,
            cargo: datos[idFirebase].cargo,
            password: datos[idFirebase].password || "" 
        }));

        localStorage.setItem("users", JSON.stringify(usuariosLista));
        tablaComponente.datos = usuariosLista;

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

if (tablaComponente) {
    const configuracionUsuarios = {
        titulo: "Gestión de Usuarios",
        textoBoton: "+ Nuevo Usuario",
        urlBoton: "../registro-usuario.html"
    };

    const columnasUsuarios = [
        { key: "identificacion", label: "ID" },
        { key: "name", label: "Nombre" },
        { key: "cargo", label: "Cargo" },
    ];

    tablaComponente.configurar(configuracionUsuarios, columnasUsuarios);
    tablaComponente.addEventListener("eliminar-item", (event) => {
        const usuarioAEliminar = event.detail;
        if (confirm(`¿Estás seguro de eliminar este usuario?`)) {
            deleteUser(usuarioAEliminar.idFirebase, usuarioAEliminar.identificacion);
        }
    });

    tablaComponente.addEventListener("editar-item", (event) => {
        const usuarioAEditar = event.detail;
        localStorage.setItem("idUsuarioEnEdicion", usuarioAEditar.idFirebase);
        localStorage.setItem("usuarioAEditar", JSON.stringify(usuarioAEditar));
        window.location.href = "../registro-usuario.html";
    });

    cargarUsuarios();
}




