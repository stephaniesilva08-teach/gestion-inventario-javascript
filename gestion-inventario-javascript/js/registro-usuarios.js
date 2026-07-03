items = [];

document.addEventListener("product.submit", (event) => {
    const item = event.detail;
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
    console.log("Producto guardado en LocalStorage:", item);

});

const URL_BASE = "https://stock-flow-3accf-default-rtdb.firebaseio.com"

const boton = document.getElementById("login");

boton.addEventListener("click", (e) => {

    e.preventDefault();

    const identificacion = document.getElementById("identificacion").value;
    const contraseña = document.getElementById("password").value;
    const nombre = document.getElementById("username").value;
    const cargo = document.getElementById("cargo").value;
    const confirmacion = document.getElementById("confirmarPassword").value;
    const mensaje = document.getElementById("mensajeError");
    const mensajeExito = document.getElementById("mensajeexito");

    if (!identificacion || !contraseña) {
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
    }

    const httpClient = fetch(`${URL_BASE}/usuarios.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(usuario)

    })
    .then(res => res.json())
    .then(data => {
        console.log("usuario guardado: ", data);

        mensajeExito.textContent = "Usuario registrado";
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1000);

    })
    .catch(err => {
        console.error("Error: ", err)
        mensaje.textContent = "Error al registrar usuario.";
    });

});
